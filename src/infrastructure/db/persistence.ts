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
  type AddIfAbsentResult,
  type ExternalWorkRemovalResult,
  type MinimalPlannedRemovalResult,
  type PersistenceBackend,
} from "./backend";
import { DexiePersistenceBackend } from "./dexie-backend";
import {
  createExportFileV1,
  DataSnapshotUnavailableError,
  exportFileToSnapshot,
  inspectExportFileV1,
  inspectExportJsonV1,
  parseCurrentCatalogIdentity,
  runtimeMetaV2,
  type CurrentCatalogIdentity,
  type DataMutationResult,
  type ExportFileV1,
  type ImportPreviewV1,
  type RawUserDataSnapshot,
} from "./export-v1";
import {
  ExternalWorkCorruptRecordError,
  ExternalWorkIdentityConflictError,
  ExternalWorkNotFoundError,
  hasValidExternalWorkIdentity,
} from "./external-work";
import { MemoryPersistenceBackend } from "./memory-backend";
import type { ExternalWorkRecord, ProviderCacheRecord, RecommendationCacheRecord } from "./records";
import {
  createOnboardingCommit,
  createDefaultRecommendationPolicies,
  createEmptyProfileAdjustments,
  parseExternalWork,
  parseExternalWorks,
  parseExternalUserWorkRecord,
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

export type PersistenceStatus =
  | { state: "initializing"; mode: null; warning: null }
  | { state: "ready"; mode: "indexeddb"; warning: null }
  | {
      state: "degraded";
      mode: "memory";
      warning: "session-only";
      reason: "open-failed" | "operation-failed";
    };

export type PersistenceStatusListener = (status: PersistenceStatus) => void;

export type ExternalWorkLookupResult =
  | { kind: "found"; record: ExternalWorkRecord }
  | { kind: "missing" }
  | { kind: "corrupt" }
  | { kind: "unavailable" };

async function parseVerifiedExternalWork(value: unknown): Promise<ExternalWorkRecord> {
  const candidateId =
    typeof value === "object" && value !== null && "id" in value && typeof value.id === "string"
      ? value.id
      : null;
  let record: ExternalWorkRecord;
  try {
    record = parseExternalWork(value);
  } catch {
    throw new ExternalWorkCorruptRecordError(candidateId);
  }
  if (!(await hasValidExternalWorkIdentity(record))) {
    throw new ExternalWorkCorruptRecordError(record.id);
  }
  return record;
}

async function parseVerifiedExternalWorks(value: unknown): Promise<ExternalWorkRecord[]> {
  const records = parseExternalWorks(value);
  await Promise.all(records.map((record) => parseVerifiedExternalWork(record)));
  return records;
}

async function retainVerifiedExternalWorks(values: unknown[]): Promise<ExternalWorkRecord[]> {
  const settled = await Promise.allSettled(values.map((value) => parseVerifiedExternalWork(value)));
  return settled.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
}

async function createCompatibleExportFile(
  snapshot: RawUserDataSnapshot,
  exportedAt: string,
  currentCatalog: CurrentCatalogIdentity,
): Promise<ExportFileV1> {
  const file = await createExportFileV1(snapshot, exportedAt, currentCatalog.catalogVersion);
  return (await inspectExportFileV1(file, currentCatalog)).file;
}

export interface Persistence {
  initialize(): Promise<void>;
  getStatus(): PersistenceStatus;
  subscribe(listener: PersistenceStatusListener): () => void;
  getOnboardingDraft(): Promise<OnboardingDraft | null>;
  saveOnboardingDraft(draft: OnboardingDraft): Promise<void>;
  clearOnboardingDraft(): Promise<void>;
  finalizeOnboarding(draft: OnboardingDraft, completedAt: string): Promise<void>;
  getUserWorks(): Promise<UserWorkRecord[]>;
  addUserWorkIfAbsent(record: UserWorkRecord): Promise<AddIfAbsentResult<UserWorkRecord>>;
  saveUserWork(record: UserWorkRecord): Promise<UserWorkRecord>;
  removeMinimalPlannedUserWork(workId: string): Promise<MinimalPlannedRemovalResult>;
  getExternalWorks(): Promise<ExternalWorkRecord[]>;
  inspectExternalWork(id: ExternalWorkId): Promise<ExternalWorkLookupResult>;
  addExternalWorkIfAbsent(
    record: ExternalWorkRecord,
  ): Promise<AddIfAbsentResult<ExternalWorkRecord>>;
  saveExternalUserRecord(
    id: ExternalWorkId,
    expectedNormalizedKey: string,
    record: UserWorkRecord,
  ): Promise<ExternalWorkRecord>;
  removeExternalWork(id: ExternalWorkId): Promise<ExternalWorkRemovalResult>;
  getProfileAdjustments(): Promise<ProfileAdjustments>;
  saveProfileAdjustments(adjustments: ProfileAdjustments): Promise<void>;
  getPolicies(): Promise<RecommendationPolicies>;
  savePolicies(policies: RecommendationPolicies): Promise<void>;
  getRecommendationCache(inputHash: string): Promise<RecommendationCacheRecord | null>;
  saveRecommendationCache(record: RecommendationCacheRecord): Promise<void>;
  getProviderCache(isbn: string): Promise<ProviderCacheRecord | null>;
  saveProviderCache(record: ProviderCacheRecord): Promise<ProviderCacheRecord>;
  getOnboardingCompletedAt(): Promise<string | null>;
  exportUserData(exportedAt: string, currentCatalog: CurrentCatalogIdentity): Promise<ExportFileV1>;
  inspectImportJson(
    jsonText: string,
    currentCatalog: CurrentCatalogIdentity,
  ): Promise<ImportPreviewV1>;
  replaceFromExport(
    file: ExportFileV1,
    currentCatalog: CurrentCatalogIdentity,
  ): Promise<DataMutationResult>;
  deleteAllData(currentCatalogVersion: string): Promise<DataMutationResult>;
  close(): void;
}

type ResilientPersistenceOptions = {
  primaryFactory?: () => PersistenceBackend;
  memoryBackend?: MemoryPersistenceBackend;
};

const INITIAL_STATUS: PersistenceStatus = {
  state: "initializing",
  mode: null,
  warning: null,
};

export class ResilientPersistence implements Persistence {
  private readonly listeners = new Set<PersistenceStatusListener>();
  private readonly memoryBackend: MemoryPersistenceBackend;
  private readonly primaryFactory: () => PersistenceBackend;
  private activeBackend: PersistenceBackend;
  private primaryBackend: PersistenceBackend | null = null;
  private initialization: Promise<void> | null = null;
  private operationQueue: Promise<void> = Promise.resolve();
  private status: PersistenceStatus = INITIAL_STATUS;

  constructor(options: ResilientPersistenceOptions = {}) {
    this.memoryBackend = options.memoryBackend ?? new MemoryPersistenceBackend();
    this.primaryFactory = options.primaryFactory ?? (() => new DexiePersistenceBackend());
    this.activeBackend = this.memoryBackend;
  }

  initialize(): Promise<void> {
    this.initialization ??= this.initializeOnce();
    return this.initialization;
  }

  getStatus(): PersistenceStatus {
    return this.status;
  }

  subscribe(listener: PersistenceStatusListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async getOnboardingDraft(): Promise<OnboardingDraft | null> {
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return this.readDraft(this.memoryBackend);
      }

      try {
        const draft = await this.readDraft(this.activeBackend);
        await this.memoryBackend.setOnboardingDraft(draft);
        return draft;
      } catch {
        await this.degrade("operation-failed");
        return this.readDraft(this.memoryBackend);
      }
    });
  }

  async saveOnboardingDraft(draft: OnboardingDraft): Promise<void> {
    const validatedDraft = parseOnboardingDraft(draft);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        await this.memoryBackend.setOnboardingDraft(validatedDraft);
        return;
      }

      try {
        await this.activeBackend.setOnboardingDraft(validatedDraft);
        await this.memoryBackend.setOnboardingDraft(validatedDraft);
      } catch {
        await this.degrade("operation-failed");
        await this.memoryBackend.setOnboardingDraft(validatedDraft);
      }
    });
  }

  async clearOnboardingDraft(): Promise<void> {
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        await this.memoryBackend.setOnboardingDraft(null);
        return;
      }

      try {
        await this.activeBackend.setOnboardingDraft(null);
        await this.memoryBackend.setOnboardingDraft(null);
      } catch {
        await this.degrade("operation-failed");
        await this.memoryBackend.setOnboardingDraft(null);
      }
    });
  }

  async finalizeOnboarding(draft: OnboardingDraft, completedAt: string): Promise<void> {
    const commit = createOnboardingCommit(draft, completedAt);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        await this.memoryBackend.commitOnboarding(commit);
        return;
      }

      try {
        await this.activeBackend.commitOnboarding(commit);
        await this.memoryBackend.commitOnboarding(commit);
      } catch (error) {
        if (
          error instanceof OnboardingWorkConflictError ||
          error instanceof OnboardingAlreadyCompletedError
        ) {
          throw error;
        }
        await this.degrade("operation-failed");
        await this.memoryBackend.commitOnboarding(commit);
      }
    });
  }

  async getUserWorks(): Promise<UserWorkRecord[]> {
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return parseUserWorks(await this.memoryBackend.getUserWorks());
      }

      try {
        const records = parseUserWorks(await this.activeBackend.getUserWorks());
        this.memoryBackend.synchronizeUserWorks(records);
        return records;
      } catch {
        await this.degrade("operation-failed");
        return parseUserWorks(await this.memoryBackend.getUserWorks());
      }
    });
  }

  async addUserWorkIfAbsent(record: UserWorkRecord): Promise<AddIfAbsentResult<UserWorkRecord>> {
    const validatedRecord = parseUserWork(record);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return this.memoryBackend.addUserWorkIfAbsent(validatedRecord);
      }

      try {
        const existingRecords = parseUserWorks(await this.activeBackend.getUserWorks());
        this.memoryBackend.synchronizeUserWorks(existingRecords);
        const result = await this.activeBackend.addUserWorkIfAbsent(validatedRecord);
        const storedRecord = parseUserWork(result.record);
        if (storedRecord.workId !== validatedRecord.workId) {
          throw new Error("User work insert readback returned a different id");
        }
        await this.memoryBackend.upsertUserWork(storedRecord);
        return { kind: result.kind, record: storedRecord };
      } catch {
        await this.degrade("operation-failed");
        // Never replay an uncertain insert against a potentially stale mirror.
        return { kind: "preserved-unknown" };
      }
    });
  }

  async saveUserWork(record: UserWorkRecord): Promise<UserWorkRecord> {
    const validatedRecord = parseUserWork(record);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return parseUserWork(await this.memoryBackend.upsertUserWork(validatedRecord));
      }

      try {
        const existingRecords = parseUserWorks(await this.activeBackend.getUserWorks());
        this.memoryBackend.synchronizeUserWorks(existingRecords);
        const storedRecord = parseUserWork(
          await this.activeBackend.upsertUserWork(validatedRecord),
        );
        await this.memoryBackend.upsertUserWork(storedRecord);
        return storedRecord;
      } catch {
        await this.degrade("operation-failed");
        return parseUserWork(await this.memoryBackend.upsertUserWork(validatedRecord));
      }
    });
  }

  async removeMinimalPlannedUserWork(workId: string): Promise<MinimalPlannedRemovalResult> {
    const validatedWorkId = parseWorkId(workId);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return this.memoryBackend.removeMinimalPlannedUserWork(validatedWorkId);
      }

      try {
        const existingRecords = parseUserWorks(await this.activeBackend.getUserWorks());
        this.memoryBackend.synchronizeUserWorks(existingRecords);
        const result = await this.activeBackend.removeMinimalPlannedUserWork(validatedWorkId);
        const records = parseUserWorks(await this.activeBackend.getUserWorks());
        const current = records.find((record) => record.workId === validatedWorkId);
        this.memoryBackend.synchronizeUserWorks(records);
        if (result === "removed" && current !== undefined) {
          throw new Error(`User work deletion readback failed: ${validatedWorkId}`);
        }
        if (result === "already-absent" && current !== undefined) {
          throw new Error(`Absent user work reappeared during readback: ${validatedWorkId}`);
        }
        if (result === "preserved-conflict" && current === undefined) {
          throw new Error(`Conflicting user work disappeared during readback: ${validatedWorkId}`);
        }
        return result;
      } catch {
        await this.degrade("operation-failed");
        // A failed primary mutation cannot prove that its latest row was still minimal.
        // Preserve the warmed mirror and require an explicit retry in degraded mode.
        return "preserved-conflict";
      }
    });
  }

  async getExternalWorks(): Promise<ExternalWorkRecord[]> {
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return parseVerifiedExternalWorks(await this.memoryBackend.getExternalWorks());
      }

      let values: unknown[];
      try {
        values = await this.activeBackend.getExternalWorks();
      } catch {
        await this.degrade("operation-failed");
        return parseVerifiedExternalWorks(await this.memoryBackend.getExternalWorks());
      }

      // A malformed row is local data state, not an IndexedDB operation failure.
      // Retain valid rows in the list mirror and leave corrupt rows untouched so a
      // targeted inspect can report `corrupt` instead of collapsing to `missing`.
      const records = await retainVerifiedExternalWorks(values);
      this.memoryBackend.synchronizeExternalWorks(records);
      return records;
    });
  }

  async inspectExternalWork(id: ExternalWorkId): Promise<ExternalWorkLookupResult> {
    const validatedId = parseExternalWorkId(id);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        const value = await this.memoryBackend.getExternalWork(validatedId);
        if (value === null) return { kind: "unavailable" };
        try {
          return { kind: "found", record: await parseVerifiedExternalWork(value) };
        } catch {
          return { kind: "corrupt" };
        }
      }

      let value: unknown | null;
      try {
        value = await this.activeBackend.getExternalWork(validatedId);
      } catch {
        await this.degrade("operation-failed");
        return { kind: "unavailable" };
      }

      if (value === null) {
        this.memoryBackend.synchronizeExternalWork(validatedId, null);
        return { kind: "missing" };
      }

      try {
        const record = await parseVerifiedExternalWork(value);
        if (record.id !== validatedId) {
          this.memoryBackend.synchronizeExternalWork(validatedId, null);
          return { kind: "corrupt" };
        }
        this.memoryBackend.synchronizeExternalWork(validatedId, record);
        return { kind: "found", record };
      } catch {
        this.memoryBackend.synchronizeExternalWork(validatedId, null);
        return { kind: "corrupt" };
      }
    });
  }

  async addExternalWorkIfAbsent(
    record: ExternalWorkRecord,
  ): Promise<AddIfAbsentResult<ExternalWorkRecord>> {
    return this.enqueue(async () => {
      const validatedRecord = await parseVerifiedExternalWork(record);
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return this.memoryBackend.addExternalWorkIfAbsent(validatedRecord);
      }

      try {
        const existingRecords = await retainVerifiedExternalWorks(
          await this.activeBackend.getExternalWorks(),
        );
        this.memoryBackend.synchronizeExternalWorks(existingRecords);
        const result = await this.activeBackend.addExternalWorkIfAbsent(validatedRecord);
        const storedRecord = await parseVerifiedExternalWork(result.record);
        if (storedRecord.id !== validatedRecord.id) {
          throw new Error("External work insert readback returned a different id");
        }
        this.memoryBackend.synchronizeExternalWork(storedRecord.id, storedRecord);
        return { kind: result.kind, record: storedRecord };
      } catch (error) {
        if (
          error instanceof ExternalWorkIdentityConflictError ||
          error instanceof ExternalWorkCorruptRecordError
        ) {
          throw error;
        }
        await this.degrade("operation-failed");
        // Never replay an uncertain insert against a potentially stale mirror.
        return { kind: "preserved-unknown" };
      }
    });
  }

  async saveExternalUserRecord(
    id: ExternalWorkId,
    expectedNormalizedKey: string,
    record: UserWorkRecord,
  ): Promise<ExternalWorkRecord> {
    const validatedId = parseExternalWorkId(id);
    const validatedRecord = parseExternalUserWorkRecord(validatedId, record);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        const current = await this.memoryBackend.getExternalWork(validatedId);
        if (current === null) {
          throw new ExternalWorkNotFoundError(validatedId);
        }
        await parseVerifiedExternalWork(current);
        return this.memoryBackend.saveExternalUserRecord(
          validatedId,
          expectedNormalizedKey,
          validatedRecord,
        );
      }

      try {
        const rawRecords = await this.activeBackend.getExternalWorks();
        const existingRecords = await retainVerifiedExternalWorks(rawRecords);
        this.memoryBackend.synchronizeExternalWorks(existingRecords);
        let current = existingRecords.find((candidate) => candidate.id === validatedId);
        if (current === undefined) {
          const rawCurrent = rawRecords.find(
            (candidate) =>
              typeof candidate === "object" &&
              candidate !== null &&
              "id" in candidate &&
              candidate.id === validatedId,
          );
          if (rawCurrent !== undefined) {
            current = await parseVerifiedExternalWork(rawCurrent);
          } else {
            throw new ExternalWorkNotFoundError(validatedId);
          }
        }
        const storedRecord = await parseVerifiedExternalWork(
          await this.activeBackend.saveExternalUserRecord(
            validatedId,
            expectedNormalizedKey,
            validatedRecord,
          ),
        );
        if (
          storedRecord.id !== validatedId ||
          storedRecord.normalizedKey !== expectedNormalizedKey
        ) {
          throw new Error("External work write readback returned a different id");
        }
        this.memoryBackend.synchronizeExternalWork(validatedId, storedRecord);
        return storedRecord;
      } catch (error) {
        if (
          error instanceof ExternalWorkIdentityConflictError ||
          error instanceof ExternalWorkCorruptRecordError ||
          error instanceof ExternalWorkNotFoundError
        ) {
          throw error;
        }
        await this.degrade("operation-failed");
        // The primary mutation may have committed before the failure. Replaying a
        // stale edit against the warmed mirror could erase a concurrent ISBN merge.
        throw error;
      }
    });
  }

  async removeExternalWork(id: ExternalWorkId): Promise<ExternalWorkRemovalResult> {
    const validatedId = parseExternalWorkId(id);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return this.memoryBackend.removeExternalWork(validatedId);
      }

      try {
        const existingRecords = await retainVerifiedExternalWorks(
          await this.activeBackend.getExternalWorks(),
        );
        this.memoryBackend.synchronizeExternalWorks(existingRecords);
        const result = await this.activeBackend.removeExternalWork(validatedId);
        const current = await this.activeBackend.getExternalWork(validatedId);
        if (current !== null) {
          throw new Error(`External work deletion readback failed: ${validatedId}`);
        }
        this.memoryBackend.synchronizeExternalWork(validatedId, null);
        return result;
      } catch {
        await this.degrade("operation-failed");
        // The primary mutation may have failed before or after IndexedDB changed.
        // Keep the warmed mirror and never claim a deletion without readback.
        return "preserved-unknown";
      }
    });
  }

  async getProfileAdjustments(): Promise<ProfileAdjustments> {
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return this.readProfileAdjustments(this.memoryBackend);
      }

      try {
        const adjustments = await this.readProfileAdjustments(this.activeBackend);
        this.memoryBackend.synchronizeProfileAdjustments(adjustments);
        return adjustments;
      } catch {
        await this.degrade("operation-failed");
        return this.readProfileAdjustments(this.memoryBackend);
      }
    });
  }

  async saveProfileAdjustments(adjustments: ProfileAdjustments): Promise<void> {
    const validatedAdjustments = parseProfileAdjustments(adjustments);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        await this.memoryBackend.setProfileAdjustments(validatedAdjustments);
        return;
      }

      try {
        await this.activeBackend.setProfileAdjustments(validatedAdjustments);
        await this.memoryBackend.setProfileAdjustments(validatedAdjustments);
      } catch {
        await this.degrade("operation-failed");
        await this.memoryBackend.setProfileAdjustments(validatedAdjustments);
      }
    });
  }

  async getPolicies(): Promise<RecommendationPolicies> {
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return this.readPolicies(this.memoryBackend);
      }

      try {
        const policies = await this.readPolicies(this.activeBackend);
        this.memoryBackend.synchronizeRecommendationPolicies(policies);
        return policies;
      } catch {
        await this.degrade("operation-failed");
        return this.readPolicies(this.memoryBackend);
      }
    });
  }

  async savePolicies(policies: RecommendationPolicies): Promise<void> {
    const validatedPolicies = parseRecommendationPolicies(policies);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        await this.memoryBackend.setRecommendationPolicies(validatedPolicies);
        return;
      }

      try {
        await this.activeBackend.setRecommendationPolicies(validatedPolicies);
        await this.memoryBackend.setRecommendationPolicies(validatedPolicies);
      } catch {
        await this.degrade("operation-failed");
        await this.memoryBackend.setRecommendationPolicies(validatedPolicies);
      }
    });
  }

  async getRecommendationCache(inputHash: string): Promise<RecommendationCacheRecord | null> {
    const validatedHash = parseRecommendationInputHash(inputHash);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return this.memoryBackend.getRecommendationCache(validatedHash);
      }

      let value: unknown | null;
      try {
        value = await this.activeBackend.getRecommendationCache(validatedHash);
      } catch {
        await this.degrade("operation-failed");
        return this.memoryBackend.getRecommendationCache(validatedHash);
      }

      if (value === null) {
        this.memoryBackend.synchronizeRecommendationCache(validatedHash, null);
        return null;
      }

      try {
        const record = parseRecommendationCacheRecord(value, validatedHash);
        this.memoryBackend.synchronizeRecommendationCache(validatedHash, record);
        return record;
      } catch {
        this.memoryBackend.synchronizeRecommendationCache(validatedHash, null);
        return null;
      }
    });
  }

  async saveRecommendationCache(record: RecommendationCacheRecord): Promise<void> {
    const validatedRecord = parseRecommendationCacheRecord(record);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        await this.memoryBackend.setRecommendationCache(validatedRecord);
        return;
      }

      try {
        await this.activeBackend.setRecommendationCache(validatedRecord);
        await this.memoryBackend.setRecommendationCache(validatedRecord);
      } catch {
        await this.degrade("operation-failed");
        await this.memoryBackend.setRecommendationCache(validatedRecord);
      }
    });
  }

  async getProviderCache(isbn: string): Promise<ProviderCacheRecord | null> {
    const validatedIsbn = parseProviderCacheIsbn(isbn);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return this.memoryBackend.getProviderCache(validatedIsbn);
      }

      let value: unknown | null;
      try {
        value = await this.activeBackend.getProviderCache(validatedIsbn);
      } catch {
        await this.degrade("operation-failed");
        return this.memoryBackend.getProviderCache(validatedIsbn);
      }

      if (value === null) {
        this.memoryBackend.synchronizeProviderCache(validatedIsbn, null);
        return null;
      }

      try {
        const record = parseProviderCacheRecord(value, validatedIsbn);
        this.memoryBackend.synchronizeProviderCache(validatedIsbn, record);
        return record;
      } catch {
        this.memoryBackend.synchronizeProviderCache(validatedIsbn, null);
        return null;
      }
    });
  }

  async saveProviderCache(record: ProviderCacheRecord): Promise<ProviderCacheRecord> {
    const validatedRecord = parseProviderCacheRecord(record);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return this.memoryBackend.upsertProviderCache(validatedRecord);
      }

      try {
        const storedRecord = parseProviderCacheRecord(
          await this.activeBackend.upsertProviderCache(validatedRecord),
          validatedRecord.isbn,
        );
        await this.memoryBackend.upsertProviderCache(storedRecord);
        return storedRecord;
      } catch {
        await this.degrade("operation-failed");
        return this.memoryBackend.upsertProviderCache(validatedRecord);
      }
    });
  }

  async getOnboardingCompletedAt(): Promise<string | null> {
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return parseOnboardingCompletedAt(await this.memoryBackend.getOnboardingCompletedAt());
      }

      try {
        const completedAt = parseOnboardingCompletedAt(
          await this.activeBackend.getOnboardingCompletedAt(),
        );
        this.memoryBackend.synchronizeOnboardingCompletedAt(completedAt);
        return completedAt;
      } catch {
        await this.degrade("operation-failed");
        return parseOnboardingCompletedAt(await this.memoryBackend.getOnboardingCompletedAt());
      }
    });
  }

  async exportUserData(
    exportedAt: string,
    currentCatalog: CurrentCatalogIdentity,
  ): Promise<ExportFileV1> {
    const catalog = parseCurrentCatalogIdentity(currentCatalog);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        return createCompatibleExportFile(
          await this.memoryBackend.readUserDataSnapshot(),
          exportedAt,
          catalog,
        );
      }

      let snapshot;
      try {
        snapshot = await this.activeBackend.readUserDataSnapshot();
      } catch (error) {
        await this.degrade("operation-failed");
        throw new DataSnapshotUnavailableError({ cause: error });
      }
      return createCompatibleExportFile(snapshot, exportedAt, catalog);
    });
  }

  inspectImportJson(
    jsonText: string,
    currentCatalog: CurrentCatalogIdentity,
  ): Promise<ImportPreviewV1> {
    return inspectExportJsonV1(jsonText, currentCatalog);
  }

  async replaceFromExport(
    file: ExportFileV1,
    currentCatalog: CurrentCatalogIdentity,
  ): Promise<DataMutationResult> {
    const catalog = parseCurrentCatalogIdentity(currentCatalog);
    const preview = await inspectExportFileV1(file, catalog);
    const snapshot = exportFileToSnapshot(preview.file);
    const meta = runtimeMetaV2(catalog.catalogVersion);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        const readback = await this.memoryBackend.replaceUserData(snapshot, meta);
        return { kind: "applied", mode: "session-only", readback };
      }

      try {
        const readback = await this.activeBackend.replaceUserData(snapshot, meta);
        await this.memoryBackend.replaceUserData(snapshot, meta);
        return { kind: "applied", mode: "indexeddb", readback };
      } catch {
        await this.degrade("operation-failed");
        return { kind: "indeterminate", operation: "replace", recovery: "reload" };
      }
    });
  }

  async deleteAllData(currentCatalogVersion: string): Promise<DataMutationResult> {
    const meta = runtimeMetaV2(currentCatalogVersion);
    return this.enqueue(async () => {
      await this.initialize();
      if (this.activeBackend.mode === "memory") {
        const readback = await this.memoryBackend.clearAllData(meta);
        return { kind: "applied", mode: "session-only", readback };
      }

      try {
        const readback = await this.activeBackend.clearAllData(meta);
        await this.memoryBackend.clearAllData(meta);
        return { kind: "applied", mode: "indexeddb", readback };
      } catch {
        await this.degrade("operation-failed");
        return { kind: "indeterminate", operation: "delete", recovery: "reload" };
      }
    });
  }

  close(): void {
    this.closePrimary();
    this.memoryBackend.close();
  }

  private async initializeOnce(): Promise<void> {
    await this.memoryBackend.open();
    try {
      const primaryBackend = this.primaryFactory();
      this.primaryBackend = primaryBackend;
      await primaryBackend.open();
      this.activeBackend = primaryBackend;
      this.setStatus({ state: "ready", mode: "indexeddb", warning: null });
    } catch {
      await this.degrade("open-failed");
    }
  }

  private async readDraft(backend: PersistenceBackend): Promise<OnboardingDraft | null> {
    const value = await backend.getOnboardingDraft();
    return value === null ? null : parseOnboardingDraft(value);
  }

  private async readProfileAdjustments(backend: PersistenceBackend): Promise<ProfileAdjustments> {
    const value = await backend.getProfileAdjustments();
    return value === null ? createEmptyProfileAdjustments() : parseProfileAdjustments(value);
  }

  private async readPolicies(backend: PersistenceBackend): Promise<RecommendationPolicies> {
    const value = await backend.getRecommendationPolicies();
    return value === null
      ? createDefaultRecommendationPolicies()
      : parseRecommendationPolicies(value);
  }

  private async degrade(reason: "open-failed" | "operation-failed"): Promise<void> {
    this.closePrimary();
    this.activeBackend = this.memoryBackend;
    this.setStatus({ state: "degraded", mode: "memory", warning: "session-only", reason });
  }

  private closePrimary(): void {
    const primaryBackend = this.primaryBackend;
    this.primaryBackend = null;
    try {
      primaryBackend?.close();
    } catch {
      // A broken IndexedDB handle must not prevent the session-memory fallback.
    }
  }

  private setStatus(status: PersistenceStatus): void {
    this.status = status;
    this.listeners.forEach((listener) => listener(status));
  }

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.operationQueue.then(operation, operation);
    this.operationQueue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }
}

export function createPersistence(options: ResilientPersistenceOptions = {}): Persistence {
  return new ResilientPersistence(options);
}
