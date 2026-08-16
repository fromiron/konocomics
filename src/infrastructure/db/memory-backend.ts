import type { OnboardingDraft } from "@/domain/profile/onboarding";
import { parseExternalWorkId, type ExternalWorkId } from "@/domain/catalog/external-work";
import type {
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";

import {
  OnboardingAlreadyCompletedError,
  OnboardingWorkConflictError,
  type MinimalPlannedRemovalResult,
  type OnboardingCommit,
  type PersistenceBackend,
  type ConfirmedAddIfAbsentResult,
} from "./backend";
import {
  runtimeMetaV2,
  validateUserDataSnapshot,
  type DataMutationReadback,
  type RawUserDataSnapshot,
  type RuntimeMetaV2,
  type UserDataSnapshot,
} from "./export-v1";
import {
  ExternalWorkCorruptRecordError,
  ExternalWorkIdentityConflictError,
  ExternalWorkNotFoundError,
  hasValidExternalWorkIdentity,
  mergeExternalWorkOnInsert,
} from "./external-work";
import type { ExternalWorkRecord, ProviderCacheRecord, RecommendationCacheRecord } from "./records";
import {
  isMinimalPlannedUserWork,
  parseExternalUserWorkRecord,
  parseExternalWork,
  parseExternalWorks,
  parseOnboardingCompletedAt,
  parseOnboardingDraft,
  parseProfileAdjustments,
  parseProviderCacheIsbn,
  parseProviderCacheRecord,
  parseRecommendationCacheRecord,
  parseRecommendationInputHash,
  parseRecommendationPolicies,
  parseUserWork,
  parseUserWorks,
  parseWorkId,
} from "./validation";

export class MemoryPersistenceBackend implements PersistenceBackend {
  readonly mode = "memory" as const;

  private onboardingDraft: OnboardingDraft | null = null;
  private onboardingCompletedAt: string | null = null;
  private profileAdjustments: ProfileAdjustments | null = null;
  private recommendationPolicies: RecommendationPolicies | null = null;
  private recommendationCache = new Map<string, RecommendationCacheRecord>();
  private providerCache = new Map<string, ProviderCacheRecord>();
  private externalWorks = new Map<string, ExternalWorkRecord>();
  private userWorks = new Map<string, UserWorkRecord>();

  open(): Promise<void> {
    return Promise.resolve();
  }

  async getOnboardingDraft(): Promise<OnboardingDraft | null> {
    return this.onboardingDraft === null ? null : parseOnboardingDraft(this.onboardingDraft);
  }

  async setOnboardingDraft(draft: OnboardingDraft | null): Promise<void> {
    this.onboardingDraft = draft === null ? null : parseOnboardingDraft(draft);
  }

  async commitOnboarding(commit: OnboardingCommit): Promise<void> {
    const userWorks = parseUserWorks(commit.userWorks);
    const duplicate = userWorks.find((record) => this.userWorks.has(record.workId));
    if (duplicate !== undefined) {
      throw new OnboardingWorkConflictError(duplicate.workId);
    }
    const nextUserWorks = new Map(this.userWorks);
    userWorks.forEach((record) => nextUserWorks.set(record.workId, record));

    if (commit.mode === "add") {
      this.userWorks = nextUserWorks;
      this.onboardingDraft = null;
      return;
    }

    if (this.onboardingCompletedAt !== null) {
      throw new OnboardingAlreadyCompletedError();
    }

    const onboardingCompletedAt = parseOnboardingCompletedAt(commit.onboardingCompletedAt);
    if (onboardingCompletedAt === null) {
      throw new Error("Onboarding completion time is required");
    }
    this.userWorks = nextUserWorks;
    this.onboardingCompletedAt = onboardingCompletedAt;
    this.onboardingDraft = null;
  }

  async getUserWorks(): Promise<UserWorkRecord[]> {
    return parseUserWorks([...this.userWorks.values()]);
  }

  async addUserWorkIfAbsent(
    record: UserWorkRecord,
  ): Promise<ConfirmedAddIfAbsentResult<UserWorkRecord>> {
    const validatedRecord = parseUserWork(record);
    const existing = this.userWorks.get(validatedRecord.workId);
    if (existing !== undefined) {
      return { kind: "already-exists", record: parseUserWork(existing) };
    }
    this.userWorks.set(validatedRecord.workId, validatedRecord);
    return {
      kind: "added",
      record: parseUserWork(this.userWorks.get(validatedRecord.workId)),
    };
  }

  async upsertUserWork(record: UserWorkRecord): Promise<UserWorkRecord> {
    const validatedRecord = parseUserWork(record);
    this.userWorks.set(validatedRecord.workId, validatedRecord);
    return parseUserWork(this.userWorks.get(validatedRecord.workId));
  }

  async removeMinimalPlannedUserWork(workId: string): Promise<MinimalPlannedRemovalResult> {
    const validatedWorkId = parseWorkId(workId);
    const current = this.userWorks.get(validatedWorkId);
    if (current === undefined) return "already-absent";
    if (!isMinimalPlannedUserWork(current)) return "preserved-conflict";

    this.userWorks.delete(validatedWorkId);
    if (this.userWorks.has(validatedWorkId)) {
      throw new Error(`User work deletion readback failed: ${validatedWorkId}`);
    }
    return "removed";
  }

  async getExternalWorks(): Promise<ExternalWorkRecord[]> {
    return parseExternalWorks([...this.externalWorks.values()]);
  }

  async getExternalWork(id: string): Promise<ExternalWorkRecord | null> {
    const record = this.externalWorks.get(parseExternalWorkId(id));
    return record === undefined ? null : parseExternalWork(record);
  }

  async addExternalWorkIfAbsent(
    record: ExternalWorkRecord,
  ): Promise<ConfirmedAddIfAbsentResult<ExternalWorkRecord>> {
    const validatedRecord = parseExternalWork(record);
    const existing = this.externalWorks.get(validatedRecord.id);
    if (existing !== undefined) {
      const merged = mergeExternalWorkOnInsert(parseExternalWork(existing), validatedRecord);
      this.externalWorks.set(merged.id, merged);
      return { kind: "already-exists", record: parseExternalWork(merged) };
    }
    this.externalWorks.set(validatedRecord.id, validatedRecord);
    return {
      kind: "added",
      record: parseExternalWork(this.externalWorks.get(validatedRecord.id)),
    };
  }

  async saveExternalUserRecord(
    id: ExternalWorkId,
    expectedNormalizedKey: string,
    record: UserWorkRecord,
  ): Promise<ExternalWorkRecord> {
    const validatedId = parseExternalWorkId(id);
    const validatedRecord = parseExternalUserWorkRecord(validatedId, record);
    const current = this.externalWorks.get(validatedId);
    if (current === undefined) {
      throw new ExternalWorkNotFoundError(validatedId);
    }

    let currentRecord: ExternalWorkRecord;
    try {
      currentRecord = parseExternalWork(current);
    } catch {
      throw new ExternalWorkCorruptRecordError(validatedId);
    }
    if (!(await hasValidExternalWorkIdentity(currentRecord))) {
      throw new ExternalWorkCorruptRecordError(validatedId);
    }
    if (currentRecord.normalizedKey !== expectedNormalizedKey) {
      throw new ExternalWorkIdentityConflictError(validatedId);
    }

    const updatedRecord = parseExternalWork({ ...currentRecord, record: validatedRecord });
    this.externalWorks.set(validatedId, updatedRecord);
    return parseExternalWork(this.externalWorks.get(validatedId));
  }

  async removeExternalWork(id: string): Promise<"removed" | "already-absent"> {
    const validatedId = parseExternalWorkId(id);
    if (!this.externalWorks.has(validatedId)) return "already-absent";
    this.externalWorks.delete(validatedId);
    if (this.externalWorks.has(validatedId)) {
      throw new Error(`External work deletion readback failed: ${validatedId}`);
    }
    return "removed";
  }

  async getProfileAdjustments(): Promise<ProfileAdjustments | null> {
    return this.profileAdjustments === null
      ? null
      : parseProfileAdjustments(this.profileAdjustments);
  }

  async setProfileAdjustments(adjustments: ProfileAdjustments): Promise<void> {
    this.profileAdjustments = parseProfileAdjustments(adjustments);
  }

  async getRecommendationPolicies(): Promise<RecommendationPolicies | null> {
    return this.recommendationPolicies === null
      ? null
      : parseRecommendationPolicies(this.recommendationPolicies);
  }

  async setRecommendationPolicies(policies: RecommendationPolicies): Promise<void> {
    this.recommendationPolicies = parseRecommendationPolicies(policies);
  }

  async getRecommendationCache(inputHash: string): Promise<RecommendationCacheRecord | null> {
    const validatedHash = parseRecommendationInputHash(inputHash);
    const record = this.recommendationCache.get(validatedHash);
    return record === undefined ? null : parseRecommendationCacheRecord(record, validatedHash);
  }

  async setRecommendationCache(record: RecommendationCacheRecord): Promise<void> {
    const validatedRecord = parseRecommendationCacheRecord(record);
    this.recommendationCache.set(validatedRecord.inputHash, validatedRecord);
  }

  async getProviderCache(isbn: string): Promise<ProviderCacheRecord | null> {
    const validatedIsbn = parseProviderCacheIsbn(isbn);
    const record = this.providerCache.get(validatedIsbn);
    return record === undefined ? null : parseProviderCacheRecord(record, validatedIsbn);
  }

  async upsertProviderCache(record: ProviderCacheRecord): Promise<ProviderCacheRecord> {
    const validatedRecord = parseProviderCacheRecord(record);
    this.providerCache.set(validatedRecord.isbn, validatedRecord);
    return parseProviderCacheRecord(this.providerCache.get(validatedRecord.isbn));
  }

  async getOnboardingCompletedAt(): Promise<string | null> {
    return parseOnboardingCompletedAt(this.onboardingCompletedAt);
  }

  async readUserDataSnapshot(): Promise<RawUserDataSnapshot> {
    return {
      userWorks: parseUserWorks([...this.userWorks.values()]),
      externalWorks: parseExternalWorks([...this.externalWorks.values()]),
      profile: {
        adjustments:
          this.profileAdjustments === null
            ? null
            : parseProfileAdjustments(this.profileAdjustments),
        policies:
          this.recommendationPolicies === null
            ? null
            : parseRecommendationPolicies(this.recommendationPolicies),
        onboardingCompletedAt: parseOnboardingCompletedAt(this.onboardingCompletedAt),
      },
      onboardingDraft:
        this.onboardingDraft === null ? null : parseOnboardingDraft(this.onboardingDraft),
    };
  }

  async replaceUserData(
    snapshot: UserDataSnapshot,
    runtimeMeta: RuntimeMetaV2,
  ): Promise<DataMutationReadback> {
    const validatedSnapshot = await validateUserDataSnapshot(snapshot);
    const validatedMeta = runtimeMetaV2(runtimeMeta.catalogVersion);
    const nextUserWorks = new Map(
      validatedSnapshot.userWorks.map((record) => [record.workId, record] as const),
    );
    const nextExternalWorks = new Map(
      validatedSnapshot.externalWorks.map((record) => [record.id, record] as const),
    );

    this.userWorks = nextUserWorks;
    this.externalWorks = nextExternalWorks;
    this.profileAdjustments = validatedSnapshot.profile.adjustments;
    this.recommendationPolicies = validatedSnapshot.profile.policies;
    this.onboardingCompletedAt = validatedSnapshot.profile.onboardingCompletedAt;
    this.onboardingDraft = validatedSnapshot.onboardingDraft;
    this.recommendationCache = new Map();
    this.providerCache = new Map();

    return {
      counts: {
        userWorks: this.userWorks.size,
        externalWorks: this.externalWorks.size,
        profile: 2 + (this.onboardingCompletedAt === null ? 0 : 1),
        onboardingDraft: this.onboardingDraft === null ? 0 : 1,
        recommendationCache: this.recommendationCache.size,
        providerCache: this.providerCache.size,
      },
      meta: validatedMeta,
    };
  }

  async clearAllData(runtimeMeta: RuntimeMetaV2): Promise<DataMutationReadback> {
    const validatedMeta = runtimeMetaV2(runtimeMeta.catalogVersion);
    this.userWorks = new Map();
    this.externalWorks = new Map();
    this.profileAdjustments = null;
    this.recommendationPolicies = null;
    this.onboardingCompletedAt = null;
    this.onboardingDraft = null;
    this.recommendationCache = new Map();
    this.providerCache = new Map();
    return {
      counts: {
        userWorks: 0,
        externalWorks: 0,
        profile: 0,
        onboardingDraft: 0,
        recommendationCache: 0,
        providerCache: 0,
      },
      meta: validatedMeta,
    };
  }

  synchronizeUserWorks(value: unknown): void {
    this.userWorks = new Map(
      parseUserWorks(value).map((record) => [record.workId, record] as const),
    );
  }

  synchronizeExternalWorks(value: unknown): void {
    this.externalWorks = new Map(
      parseExternalWorks(value).map((record) => [record.id, record] as const),
    );
  }

  synchronizeExternalWork(id: string, value: ExternalWorkRecord | null): void {
    const validatedId = parseExternalWorkId(id);
    if (value === null) {
      this.externalWorks.delete(validatedId);
      return;
    }
    const record = parseExternalWork(value);
    if (record.id !== validatedId) {
      throw new Error("External work key does not match its record id");
    }
    this.externalWorks.set(validatedId, record);
  }

  synchronizeProfileAdjustments(value: unknown): void {
    this.profileAdjustments = parseProfileAdjustments(value);
  }

  synchronizeRecommendationPolicies(value: unknown): void {
    this.recommendationPolicies = parseRecommendationPolicies(value);
  }

  synchronizeRecommendationCache(inputHash: string, value: RecommendationCacheRecord | null): void {
    const validatedHash = parseRecommendationInputHash(inputHash);
    if (value === null) {
      this.recommendationCache.delete(validatedHash);
      return;
    }
    this.recommendationCache.set(
      validatedHash,
      parseRecommendationCacheRecord(value, validatedHash),
    );
  }

  synchronizeProviderCache(isbn: string, value: ProviderCacheRecord | null): void {
    const validatedIsbn = parseProviderCacheIsbn(isbn);
    if (value === null) {
      this.providerCache.delete(validatedIsbn);
      return;
    }
    this.providerCache.set(validatedIsbn, parseProviderCacheRecord(value, validatedIsbn));
  }

  synchronizeOnboardingCompletedAt(value: unknown): void {
    this.onboardingCompletedAt = parseOnboardingCompletedAt(value);
  }

  close(): void {
    return undefined;
  }
}
