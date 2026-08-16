import type { OnboardingDraft } from "@/domain/profile/onboarding";
import type { ExternalWorkId } from "@/domain/catalog/external-work";
import type {
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";

import type { ExternalWorkRecord, ProviderCacheRecord, RecommendationCacheRecord } from "./records";
import type {
  DataMutationReadback,
  RawUserDataSnapshot,
  RuntimeMetaV2,
  UserDataSnapshot,
} from "./export-v1";

export type StorageMode = "indexeddb" | "memory";

export type MinimalPlannedRemovalResult = "removed" | "already-absent" | "preserved-conflict";

export type ExternalWorkRemovalResult = "removed" | "already-absent" | "preserved-unknown";

export type AddIfAbsentResult<T> =
  | { kind: "added"; record: T }
  | { kind: "already-exists"; record: T }
  | { kind: "preserved-unknown" };

export type ConfirmedAddIfAbsentResult<T> = Exclude<
  AddIfAbsentResult<T>,
  { kind: "preserved-unknown" }
>;

export class OnboardingWorkConflictError extends Error {
  constructor(readonly workId: string) {
    super(`Cannot add existing user work: ${workId}`);
    this.name = "OnboardingWorkConflictError";
  }
}

export class OnboardingAlreadyCompletedError extends Error {
  constructor() {
    super("First-run onboarding has already been completed");
    this.name = "OnboardingAlreadyCompletedError";
  }
}

export type OnboardingCommit =
  | {
      mode: "firstRun";
      userWorks: UserWorkRecord[];
      onboardingCompletedAt: string;
    }
  | {
      mode: "add";
      userWorks: UserWorkRecord[];
    };

export interface PersistenceBackend {
  readonly mode: StorageMode;
  open(): Promise<void>;
  getOnboardingDraft(): Promise<unknown | null>;
  setOnboardingDraft(draft: OnboardingDraft | null): Promise<void>;
  commitOnboarding(commit: OnboardingCommit): Promise<void>;
  getUserWorks(): Promise<unknown[]>;
  addUserWorkIfAbsent(record: UserWorkRecord): Promise<ConfirmedAddIfAbsentResult<unknown>>;
  upsertUserWork(record: UserWorkRecord): Promise<unknown>;
  removeMinimalPlannedUserWork(workId: string): Promise<MinimalPlannedRemovalResult>;
  getExternalWorks(): Promise<unknown[]>;
  getExternalWork(id: string): Promise<unknown | null>;
  addExternalWorkIfAbsent(record: ExternalWorkRecord): Promise<ConfirmedAddIfAbsentResult<unknown>>;
  saveExternalUserRecord(
    id: ExternalWorkId,
    expectedNormalizedKey: string,
    record: UserWorkRecord,
  ): Promise<unknown>;
  removeExternalWork(id: string): Promise<Exclude<ExternalWorkRemovalResult, "preserved-unknown">>;
  getProfileAdjustments(): Promise<unknown | null>;
  setProfileAdjustments(adjustments: ProfileAdjustments): Promise<void>;
  getRecommendationPolicies(): Promise<unknown | null>;
  setRecommendationPolicies(policies: RecommendationPolicies): Promise<void>;
  getRecommendationCache(inputHash: string): Promise<unknown | null>;
  setRecommendationCache(record: RecommendationCacheRecord): Promise<void>;
  getProviderCache(isbn: string): Promise<unknown | null>;
  upsertProviderCache(record: ProviderCacheRecord): Promise<unknown>;
  getOnboardingCompletedAt(): Promise<unknown | null>;
  readUserDataSnapshot(): Promise<RawUserDataSnapshot>;
  replaceUserData(
    snapshot: UserDataSnapshot,
    runtimeMeta: RuntimeMetaV2,
  ): Promise<DataMutationReadback>;
  clearAllData(runtimeMeta: RuntimeMetaV2): Promise<DataMutationReadback>;
  close(): void;
}
