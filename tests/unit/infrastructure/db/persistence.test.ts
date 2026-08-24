import { describe, expect, it } from "vitest";

import { onboardingDraftSchema, type OnboardingDraft } from "@/domain/profile/onboarding";
import type { ExternalWorkId } from "@/domain/catalog/external-work";
import type {
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";
import {
  type AddIfAbsentResult,
  type MinimalPlannedRemovalResult,
  OnboardingAlreadyCompletedError,
  OnboardingWorkConflictError,
  type OnboardingCommit,
  type PersistenceBackend,
} from "@/infrastructure/db/backend";
import {
  DATABASE_SCHEMA_VERSION,
  DATABASE_SCHEMA_V1,
  DATABASE_SCHEMA_V2,
  KonocomicsDatabase,
} from "@/infrastructure/db/database";
import { DexiePersistenceBackend } from "@/infrastructure/db/dexie-backend";
import { MemoryPersistenceBackend } from "@/infrastructure/db/memory-backend";
import { ResilientPersistence } from "@/infrastructure/db/persistence";
import {
  createExportFileV1,
  DataSnapshotUnavailableError,
  DataTransferError,
  exportFilenameV1,
  serializeExportFileV1,
  type DataMutationReadback,
  type RuntimeMetaV2,
  type UserDataSnapshot,
} from "@/infrastructure/db/export-v1";
import type {
  ExternalWorkRecord,
  ProviderCacheRecord,
  RecommendationCacheRecord,
} from "@/infrastructure/db/records";
import {
  ExternalWorkCorruptRecordError,
  ExternalWorkIdentityConflictError,
  ExternalWorkNotFoundError,
  hasValidExternalWorkIdentity,
  mergeExternalWorkOnInsert,
} from "@/infrastructure/db/external-work";
import {
  isMinimalPlannedUserWork,
  parseExternalUserWorkRecord,
  parseExternalWork,
} from "@/infrastructure/db/validation";

const DRAFT_TIME = "2026-08-14T10:00:00+09:00";
const COMPLETED_TIME = "2026-08-14T10:10:00+09:00";
const INPUT_HASH = "a".repeat(64);
const ISBN = "9784091855312";
const EXTERNAL_ID =
  "ext:rakuten:v1:ebbfe45c6734e41f113df7284b2e63fbdef2d285229e699a5109e835a26b88b6" as const;
const CURRENT_CATALOG = {
  catalogVersion: "catalog-current",
  workIds: ["one", "two", "three", "four", "five", "six"],
  profileWorkIds: ["one", "two", "three", "four", "five", "six"],
} as const;

function createExternalRecord(overrides: Partial<ExternalWorkRecord> = {}): ExternalWorkRecord {
  const id = overrides.id ?? EXTERNAL_ID;
  return {
    id,
    normalizedKey: '["きんぐだむ","原 泰久"]',
    title: "キングダム 1",
    creators: ["原 泰久"],
    isbnSamples: [ISBN],
    coverUrl: "https://thumbnail.image.rakuten.co.jp/external.jpg",
    record: {
      workId: id,
      readingState: "planned",
      updatedAt: DRAFT_TIME,
    },
    ...overrides,
  };
}

function createCacheRecord(inputHash = INPUT_HASH): RecommendationCacheRecord {
  return {
    schemaVersion: 1,
    engineVersion: "taste-v1",
    inputHash,
    plan: [
      {
        workId: "recommended-work",
        tasteScore: 0.86,
        confidence: 0.78,
        confidenceLevel: "high",
        bestAnchorId: "anchor-work",
        contributions: [
          {
            source: "similarity",
            group: "theme",
            factorId: "adventure",
            value: 0.24,
            anchorWorkIds: ["anchor-work"],
            explainable: true,
          },
        ],
        penaltiesApplied: [],
        isDiscovery: false,
        majorThemeKey: "adventure",
        seriesGroupId: "recommended-work",
      },
    ],
    computedAt: COMPLETED_TIME,
  };
}

function createProviderRecord(): ProviderCacheRecord {
  return {
    workId: "provider-work",
    provider: "rakuten",
    isbn: ISBN,
    imageUrl: "https://thumbnail.image.rakuten.co.jp/provider.jpg?_ex=600x600",
    itemUrl: "https://books.rakuten.co.jp/rb/provider-work/",
    itemCaption: "Provider caption",
    itemPrice: 770,
    availability: 1,
    reviewAverage: 4.5,
    reviewCount: 12,
    fetchedAt: "2026-08-14T01:00:00.000Z",
    commercialExpiresAt: "2026-08-15T01:00:00.000Z",
    metadataExpiresAt: "2026-11-12T01:00:00.000Z",
  };
}

function createDraft(positiveCount = 5): OnboardingDraft {
  return onboardingDraftSchema.parse({
    id: "current",
    mode: "firstRun",
    step: 2,
    positiveEntries: Array.from({ length: positiveCount }, (_value, index) => ({
      workId: `positive-${String(index + 1)}`,
      reaction: index === 0 ? "favorite" : "liked",
    })),
    negativeEntries: [
      { workId: "negative-disliked", disposition: "disliked", reasons: ["tooDark"] },
      { workId: "negative-dropped", disposition: "dropped", reasons: [] },
    ],
    updatedAt: DRAFT_TIME,
  });
}

function createAddDraft(workId = "new-positive"): OnboardingDraft {
  return onboardingDraftSchema.parse({
    id: "current",
    mode: "add",
    step: 1,
    positiveEntries: [{ workId, reaction: "liked" }],
    negativeEntries: [],
    updatedAt: DRAFT_TIME,
  });
}

async function createTransferFile(
  options: {
    userWorks?: UserWorkRecord[];
    externalWorks?: ExternalWorkRecord[];
    draft?: OnboardingDraft | null;
    completedAt?: string | null;
  } = {},
) {
  return createExportFileV1(
    {
      userWorks: options.userWorks ?? [],
      externalWorks: options.externalWorks ?? [],
      profile: {
        adjustments: { axes: { pacing: "like" }, themes: {} },
        policies: {
          preferCompleted: true,
          preferHidden: false,
          preferVerified: true,
          excludeIncomplete: true,
        },
        onboardingCompletedAt: options.completedAt ?? null,
      },
      onboardingDraft: options.draft ?? null,
    },
    COMPLETED_TIME,
    "catalog-exported",
  );
}

class ControllableBackend implements PersistenceBackend {
  readonly mode = "indexeddb" as const;

  draft: unknown | null = null;
  userWorks: unknown[] = [];
  externalWorks: unknown[] = [];
  profileAdjustments: unknown | null = null;
  recommendationPolicies: unknown | null = null;
  recommendationCache = new Map<string, unknown>();
  providerCache = new Map<string, unknown>();
  onboardingCompletedAt: unknown | null = null;
  failOpen = false;
  failDraftRead = false;
  failCommit = false;
  failAdjustmentsRead = false;
  failAdjustmentsWrite = false;
  failPoliciesRead = false;
  failPoliciesWrite = false;
  failUserWorkWrite = false;
  failUserWorkInsert = false;
  failUserWorkRemoval = false;
  failExternalWorkRead = false;
  failExternalWorkInsert = false;
  failExternalWorkWrite = false;
  failExternalWorkRemoval = false;
  failCacheRead = false;
  failCacheWrite = false;
  failProviderCacheRead = false;
  failProviderCacheWrite = false;
  failSnapshotRead = false;
  failReplace = false;
  failClear = false;
  snapshotReadGate: Promise<void> | null = null;
  onSnapshotReadWaiting: (() => void) | null = null;
  policyWriteGate: Promise<void> | null = null;
  onPolicyWriteWaiting: (() => void) | null = null;
  beforeUserWorkRemoval: (() => void) | null = null;
  closed = false;

  async open(): Promise<void> {
    if (this.failOpen) {
      throw new Error("IndexedDB open failed");
    }
  }

  async getOnboardingDraft(): Promise<unknown | null> {
    if (this.failDraftRead) {
      throw new Error("IndexedDB read failed");
    }
    return this.draft;
  }

  async setOnboardingDraft(draft: OnboardingDraft | null): Promise<void> {
    this.draft = draft === null ? null : structuredClone(draft);
  }

  async commitOnboarding(commit: OnboardingCommit): Promise<void> {
    if (this.failCommit) {
      throw new Error("IndexedDB transaction failed");
    }
    if (commit.mode === "firstRun" && this.onboardingCompletedAt !== null) {
      throw new OnboardingAlreadyCompletedError();
    }
    const existing = new Map(
      this.userWorks.flatMap((record) =>
        typeof record === "object" && record !== null && "workId" in record
          ? [[String(record.workId), record] as const]
          : [],
      ),
    );
    if (commit.mode === "add") {
      const duplicate = commit.userWorks.find((record) => existing.has(record.workId));
      if (duplicate !== undefined) {
        throw new OnboardingWorkConflictError(duplicate.workId);
      }
    }
    commit.userWorks.forEach((record) => existing.set(record.workId, structuredClone(record)));
    this.userWorks = [...existing.values()];
    if (commit.mode === "firstRun") {
      this.onboardingCompletedAt = commit.onboardingCompletedAt;
    }
    this.draft = null;
  }

  async getUserWorks(): Promise<unknown[]> {
    return structuredClone(this.userWorks);
  }

  async addUserWorkIfAbsent(
    record: UserWorkRecord,
  ): Promise<Exclude<AddIfAbsentResult<unknown>, { kind: "preserved-unknown" }>> {
    if (this.failUserWorkInsert) {
      throw new Error("IndexedDB user work insert failed");
    }
    const existing = this.userWorks.find(
      (candidate) =>
        typeof candidate === "object" &&
        candidate !== null &&
        "workId" in candidate &&
        String(candidate.workId) === record.workId,
    );
    if (existing !== undefined) {
      return { kind: "already-exists", record: structuredClone(existing) };
    }
    this.userWorks.push(structuredClone(record));
    return { kind: "added", record: structuredClone(record) };
  }

  async upsertUserWork(record: UserWorkRecord): Promise<unknown> {
    if (this.failUserWorkWrite) {
      throw new Error("IndexedDB user work write failed");
    }
    const existing = new Map(
      this.userWorks.flatMap((candidate) =>
        typeof candidate === "object" && candidate !== null && "workId" in candidate
          ? [[String(candidate.workId), candidate] as const]
          : [],
      ),
    );
    existing.set(record.workId, structuredClone(record));
    this.userWorks = [...existing.values()];
    return structuredClone(record);
  }

  async removeMinimalPlannedUserWork(workId: string): Promise<MinimalPlannedRemovalResult> {
    if (this.failUserWorkRemoval) {
      throw new Error("IndexedDB user work removal failed");
    }
    this.beforeUserWorkRemoval?.();
    const current = this.userWorks.find(
      (record) =>
        typeof record === "object" &&
        record !== null &&
        "workId" in record &&
        String(record.workId) === workId,
    );
    if (current === undefined) return "already-absent";
    if (!isMinimalPlannedUserWork(current)) return "preserved-conflict";

    this.userWorks = this.userWorks.filter(
      (record) =>
        !(typeof record === "object" && record !== null && "workId" in record) ||
        String(record.workId) !== workId,
    );
    return "removed";
  }

  async getExternalWorks(): Promise<unknown[]> {
    if (this.failExternalWorkRead) {
      throw new Error("IndexedDB external work read failed");
    }
    return structuredClone(this.externalWorks);
  }

  async getExternalWork(id: string): Promise<unknown | null> {
    if (this.failExternalWorkRead) {
      throw new Error("IndexedDB external work read failed");
    }
    return structuredClone(
      this.externalWorks.find(
        (record) =>
          typeof record === "object" &&
          record !== null &&
          "id" in record &&
          String(record.id) === id,
      ) ?? null,
    );
  }

  async addExternalWorkIfAbsent(
    record: ExternalWorkRecord,
  ): Promise<Exclude<AddIfAbsentResult<unknown>, { kind: "preserved-unknown" }>> {
    if (this.failExternalWorkInsert) {
      throw new Error("IndexedDB external work insert failed");
    }
    const existing = this.externalWorks.find(
      (candidate) =>
        typeof candidate === "object" &&
        candidate !== null &&
        "id" in candidate &&
        String(candidate.id) === record.id,
    );
    if (existing !== undefined) {
      const merged = mergeExternalWorkOnInsert(
        existing as ExternalWorkRecord,
        structuredClone(record),
      );
      this.externalWorks = this.externalWorks.map((candidate) =>
        typeof candidate === "object" &&
        candidate !== null &&
        "id" in candidate &&
        String(candidate.id) === record.id
          ? structuredClone(merged)
          : candidate,
      );
      return { kind: "already-exists", record: structuredClone(merged) };
    }
    this.externalWorks.push(structuredClone(record));
    return { kind: "added", record: structuredClone(record) };
  }

  async saveExternalUserRecord(
    id: ExternalWorkId,
    expectedNormalizedKey: string,
    record: UserWorkRecord,
  ): Promise<unknown> {
    if (this.failExternalWorkWrite) {
      throw new Error("IndexedDB external work write failed");
    }
    const currentIndex = this.externalWorks.findIndex(
      (candidate) =>
        typeof candidate === "object" &&
        candidate !== null &&
        "id" in candidate &&
        candidate.id === id,
    );
    if (currentIndex < 0) throw new ExternalWorkNotFoundError(id);

    let current: ExternalWorkRecord;
    try {
      current = parseExternalWork(this.externalWorks[currentIndex]);
    } catch {
      throw new ExternalWorkCorruptRecordError(id);
    }
    if (!(await hasValidExternalWorkIdentity(current))) {
      throw new ExternalWorkCorruptRecordError(id);
    }
    if (current.normalizedKey !== expectedNormalizedKey) {
      throw new ExternalWorkIdentityConflictError(id);
    }
    const updated = parseExternalWork({
      ...current,
      record: parseExternalUserWorkRecord(id, record),
    });
    this.externalWorks[currentIndex] = structuredClone(updated);
    return structuredClone(updated);
  }

  async removeExternalWork(id: string): Promise<"removed" | "already-absent"> {
    if (this.failExternalWorkRemoval) {
      throw new Error("IndexedDB external work removal failed");
    }
    const exists = this.externalWorks.some(
      (record) =>
        typeof record === "object" && record !== null && "id" in record && String(record.id) === id,
    );
    if (!exists) return "already-absent";
    this.externalWorks = this.externalWorks.filter(
      (record) =>
        !(typeof record === "object" && record !== null && "id" in record) ||
        String(record.id) !== id,
    );
    return "removed";
  }

  async getProfileAdjustments(): Promise<unknown | null> {
    if (this.failAdjustmentsRead) {
      throw new Error("IndexedDB adjustments read failed");
    }
    return structuredClone(this.profileAdjustments);
  }

  async setProfileAdjustments(adjustments: ProfileAdjustments): Promise<void> {
    if (this.failAdjustmentsWrite) {
      throw new Error("IndexedDB adjustments write failed");
    }
    this.profileAdjustments = structuredClone(adjustments);
  }

  async getRecommendationPolicies(): Promise<unknown | null> {
    if (this.failPoliciesRead) {
      throw new Error("IndexedDB policies read failed");
    }
    return structuredClone(this.recommendationPolicies);
  }

  async setRecommendationPolicies(policies: RecommendationPolicies): Promise<void> {
    if (this.failPoliciesWrite) {
      throw new Error("IndexedDB policies write failed");
    }
    if (this.policyWriteGate !== null && policies.preferCompleted) {
      this.onPolicyWriteWaiting?.();
      await this.policyWriteGate;
    }
    this.recommendationPolicies = structuredClone(policies);
  }

  async getRecommendationCache(inputHash: string): Promise<unknown | null> {
    if (this.failCacheRead) {
      throw new Error("IndexedDB recommendation cache read failed");
    }
    return structuredClone(this.recommendationCache.get(inputHash) ?? null);
  }

  async setRecommendationCache(record: RecommendationCacheRecord): Promise<void> {
    if (this.failCacheWrite) {
      throw new Error("IndexedDB recommendation cache write failed");
    }
    this.recommendationCache.set(record.inputHash, structuredClone(record));
  }

  async getProviderCache(isbn: string): Promise<unknown | null> {
    if (this.failProviderCacheRead) {
      throw new Error("IndexedDB provider cache read failed");
    }
    return structuredClone(this.providerCache.get(isbn) ?? null);
  }

  async upsertProviderCache(record: ProviderCacheRecord): Promise<unknown> {
    if (this.failProviderCacheWrite) {
      throw new Error("IndexedDB provider cache write failed");
    }
    this.providerCache.set(record.isbn, structuredClone(record));
    return structuredClone(record);
  }

  async getOnboardingCompletedAt(): Promise<unknown | null> {
    return this.onboardingCompletedAt;
  }

  async readUserDataSnapshot() {
    if (this.failSnapshotRead) {
      throw new Error("IndexedDB snapshot read failed");
    }
    const snapshot = structuredClone({
      userWorks: this.userWorks,
      externalWorks: this.externalWorks,
      profile: {
        adjustments: this.profileAdjustments,
        policies: this.recommendationPolicies,
        onboardingCompletedAt: this.onboardingCompletedAt,
      },
      onboardingDraft: this.draft,
    });
    if (this.snapshotReadGate !== null) {
      this.onSnapshotReadWaiting?.();
      await this.snapshotReadGate;
    }
    return snapshot;
  }

  async replaceUserData(
    snapshot: UserDataSnapshot,
    runtimeMeta: RuntimeMetaV2,
  ): Promise<DataMutationReadback> {
    if (this.failReplace) {
      throw new Error("IndexedDB replacement failed");
    }
    this.userWorks = structuredClone(snapshot.userWorks);
    this.externalWorks = structuredClone(snapshot.externalWorks);
    this.profileAdjustments = structuredClone(snapshot.profile.adjustments);
    this.recommendationPolicies = structuredClone(snapshot.profile.policies);
    this.onboardingCompletedAt = snapshot.profile.onboardingCompletedAt;
    this.draft = structuredClone(snapshot.onboardingDraft);
    this.recommendationCache.clear();
    this.providerCache.clear();
    return {
      counts: {
        userWorks: snapshot.userWorks.length,
        externalWorks: snapshot.externalWorks.length,
        profile: 2 + (snapshot.profile.onboardingCompletedAt === null ? 0 : 1),
        onboardingDraft: snapshot.onboardingDraft === null ? 0 : 1,
        recommendationCache: 0,
        providerCache: 0,
      },
      meta: structuredClone(runtimeMeta),
    };
  }

  async clearAllData(runtimeMeta: RuntimeMetaV2): Promise<DataMutationReadback> {
    if (this.failClear) {
      throw new Error("IndexedDB deletion failed");
    }
    this.userWorks = [];
    this.externalWorks = [];
    this.profileAdjustments = null;
    this.recommendationPolicies = null;
    this.onboardingCompletedAt = null;
    this.draft = null;
    this.recommendationCache.clear();
    this.providerCache.clear();
    return {
      counts: {
        userWorks: 0,
        externalWorks: 0,
        profile: 0,
        onboardingDraft: 0,
        recommendationCache: 0,
        providerCache: 0,
      },
      meta: structuredClone(runtimeMeta),
    };
  }

  close(): void {
    this.closed = true;
  }
}

function openFailingPersistence() {
  const backend = new ControllableBackend();
  backend.failOpen = true;
  return {
    backend,
    persistence: new ResilientPersistence({ primaryFactory: () => backend }),
  };
}

function createDexieRemovalHarness(initial: UserWorkRecord | undefined) {
  let current = initial === undefined ? undefined : structuredClone(initial);
  const userWorks = {
    async get(workId: string) {
      return current?.workId === workId ? structuredClone(current) : undefined;
    },
    async delete(workId: string) {
      if (current?.workId === workId) current = undefined;
    },
  };
  const database = {
    userWorks,
    async transaction<T>(_mode: string, _table: unknown, operation: () => Promise<T>) {
      return operation();
    },
  } as unknown as KonocomicsDatabase;

  return {
    backend: new DexiePersistenceBackend(database),
    read: () => (current === undefined ? undefined : structuredClone(current)),
    replace: (record: UserWorkRecord | undefined) => {
      current = record === undefined ? undefined : structuredClone(record);
    },
  };
}

function createDexieExternalHarness(initial: unknown | undefined) {
  let current = initial === undefined ? undefined : structuredClone(initial);
  const externalWorks = {
    async get(id: string) {
      return typeof current === "object" && current !== null && "id" in current && current.id === id
        ? structuredClone(current)
        : undefined;
    },
    async put(record: ExternalWorkRecord) {
      current = structuredClone(record);
    },
  };
  const database = {
    externalWorks,
    async transaction<T>(_mode: string, _table: unknown, operation: () => Promise<T>) {
      return operation();
    },
  } as unknown as KonocomicsDatabase;

  return {
    backend: new DexiePersistenceBackend(database),
    read: () => (current === undefined ? undefined : structuredClone(current)),
    replace: (record: unknown | undefined) => {
      current = record === undefined ? undefined : structuredClone(record);
    },
  };
}

describe("persistence schema", () => {
  it("preserves v1 for migration and removes only the obsolete provider expiry index in v2", () => {
    expect(DATABASE_SCHEMA_V1).toEqual({
      userWorks: "workId, readingState, updatedAt",
      externalWorks: "id, record.updatedAt",
      profile: "key",
      onboardingDraft: "id",
      recommendationCache: "inputHash",
      providerCache: "isbn, expiresAt",
      meta: "key",
    });
    expect(DATABASE_SCHEMA_VERSION).toBe(2);
    expect(DATABASE_SCHEMA_V2).toEqual({
      ...DATABASE_SCHEMA_V1,
      providerCache: "isbn",
    });

    const database = new KonocomicsDatabase("schema-contract-test");
    expect(database.verno).toBe(2);
    expect(database.providerCache.schema.primKey.name).toBe("isbn");
    expect(database.providerCache.schema.indexes).toEqual([]);
    database.close();
  });
});

describe("Slice 10 data-sovereignty persistence", () => {
  it("exports one coherent transaction snapshot while another tab changes later state", async () => {
    const backend = new ControllableBackend();
    const original: UserWorkRecord = {
      workId: "one",
      readingState: "planned",
      updatedAt: DRAFT_TIME,
    };
    backend.userWorks = [original];
    backend.draft = createDraft(1);
    let releaseSnapshot!: () => void;
    backend.snapshotReadGate = new Promise<void>((resolve) => {
      releaseSnapshot = resolve;
    });
    let snapshotWaiting!: () => void;
    const waiting = new Promise<void>((resolve) => {
      snapshotWaiting = resolve;
    });
    backend.onSnapshotReadWaiting = snapshotWaiting;
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    const pendingExport = persistence.exportUserData(COMPLETED_TIME, CURRENT_CATALOG);
    await waiting;
    backend.userWorks = [
      {
        workId: "two",
        readingState: "completed",
        reaction: "liked",
        updatedAt: COMPLETED_TIME,
      },
    ];
    backend.draft = null;
    releaseSnapshot();

    const file = await pendingExport;
    expect(file.userWorks).toEqual([original]);
    expect(file.onboardingDraft).toEqual(createDraft(1));
    expect(file.catalogVersion).toBe(CURRENT_CATALOG.catalogVersion);
  });

  it("refuses to create an export that the same current catalog cannot import", async () => {
    const records = CURRENT_CATALOG.workIds.slice(0, 5).map((workId) => ({
      workId,
      readingState: "completed" as const,
      reaction: "liked" as const,
      updatedAt: COMPLETED_TIME,
    }));
    const staleModeBackend = new ControllableBackend();
    staleModeBackend.userWorks = records;
    staleModeBackend.draft = createDraft(1);
    const staleModePersistence = new ResilientPersistence({
      primaryFactory: () => staleModeBackend,
    });
    await expect(
      staleModePersistence.exportUserData(COMPLETED_TIME, CURRENT_CATALOG),
    ).rejects.toMatchObject({
      code: "incompatible-profile-state",
    });
    expect(staleModeBackend.draft).toEqual(createDraft(1));
    expect(staleModePersistence.getStatus()).toMatchObject({ state: "ready", mode: "indexeddb" });

    const overlapBackend = new ControllableBackend();
    overlapBackend.userWorks = records;
    overlapBackend.draft = createAddDraft("one");
    const overlapPersistence = new ResilientPersistence({ primaryFactory: () => overlapBackend });
    await expect(
      overlapPersistence.exportUserData(COMPLETED_TIME, CURRENT_CATALOG),
    ).rejects.toMatchObject({
      code: "incompatible-profile-state",
      details: "one",
    });
    expect(overlapBackend.draft).toEqual(createAddDraft("one"));
  });

  it("atomically replaces user data, clears stale caches, and returns authoritative counts", async () => {
    const backend = new ControllableBackend();
    backend.userWorks = [{ workId: "old", readingState: "planned", updatedAt: DRAFT_TIME }];
    backend.externalWorks = [createExternalRecord()];
    backend.recommendationCache.set(INPUT_HASH, createCacheRecord());
    backend.providerCache.set(ISBN, createProviderRecord());
    const importedRecords = CURRENT_CATALOG.workIds.slice(0, 5).map((workId, index) => ({
      workId,
      readingState: "completed" as const,
      reaction: index === 0 ? ("favorite" as const) : ("liked" as const),
      updatedAt: COMPLETED_TIME,
    }));
    const draft = createAddDraft("six");
    const file = await createTransferFile({
      userWorks: importedRecords,
      externalWorks: [createExternalRecord()],
      draft,
      completedAt: null,
    });
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    const result = await persistence.replaceFromExport(file, CURRENT_CATALOG);

    expect(result).toEqual({
      kind: "applied",
      mode: "indexeddb",
      readback: {
        counts: {
          userWorks: 5,
          externalWorks: 1,
          profile: 2,
          onboardingDraft: 1,
          recommendationCache: 0,
          providerCache: 0,
        },
        meta: { schemaVersion: 2, catalogVersion: CURRENT_CATALOG.catalogVersion },
      },
    });
    expect(backend.userWorks).toEqual(importedRecords);
    expect(backend.externalWorks).toEqual([createExternalRecord()]);
    expect(backend.draft).toEqual(draft);
    expect(backend.onboardingCompletedAt).toBeNull();
    expect(backend.recommendationPolicies).toMatchObject({ excludeIncomplete: true });
    expect(backend.recommendationCache.size).toBe(0);
    expect(backend.providerCache.size).toBe(0);
  });

  it("clears all seven stores and recreates only current runtime metadata", async () => {
    const backend = new ControllableBackend();
    backend.userWorks = [{ workId: "one", readingState: "planned", updatedAt: DRAFT_TIME }];
    backend.externalWorks = [createExternalRecord()];
    backend.profileAdjustments = { axes: { pacing: "like" }, themes: {} };
    backend.recommendationPolicies = {
      preferCompleted: true,
      preferHidden: true,
      preferVerified: true,
      excludeIncomplete: true,
    };
    backend.onboardingCompletedAt = COMPLETED_TIME;
    backend.draft = createAddDraft("two");
    backend.recommendationCache.set(INPUT_HASH, createCacheRecord());
    backend.providerCache.set(ISBN, createProviderRecord());
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    await expect(persistence.deleteAllData(CURRENT_CATALOG.catalogVersion)).resolves.toEqual({
      kind: "applied",
      mode: "indexeddb",
      readback: {
        counts: {
          userWorks: 0,
          externalWorks: 0,
          profile: 0,
          onboardingDraft: 0,
          recommendationCache: 0,
          providerCache: 0,
        },
        meta: { schemaVersion: 2, catalogVersion: CURRENT_CATALOG.catalogVersion },
      },
    });
    expect(await backend.readUserDataSnapshot()).toEqual({
      userWorks: [],
      externalWorks: [],
      profile: { adjustments: null, policies: null, onboardingCompletedAt: null },
      onboardingDraft: null,
    });
  });

  it("never replays an indeterminate primary replace or delete against the memory mirror", async () => {
    const existing: UserWorkRecord = {
      workId: "one",
      readingState: "completed",
      reaction: "favorite",
      updatedAt: DRAFT_TIME,
    };
    const replacementFile = await createTransferFile();

    const replaceBackend = new ControllableBackend();
    replaceBackend.userWorks = [existing];
    const replacePersistence = new ResilientPersistence({
      primaryFactory: () => replaceBackend,
    });
    expect(await replacePersistence.getUserWorks()).toEqual([existing]);
    replaceBackend.failReplace = true;
    await expect(
      replacePersistence.replaceFromExport(replacementFile, CURRENT_CATALOG),
    ).resolves.toEqual({
      kind: "indeterminate",
      operation: "replace",
      recovery: "reload",
    });
    expect(await replacePersistence.getUserWorks()).toEqual([existing]);

    const deleteBackend = new ControllableBackend();
    deleteBackend.userWorks = [existing];
    const deletePersistence = new ResilientPersistence({ primaryFactory: () => deleteBackend });
    expect(await deletePersistence.getUserWorks()).toEqual([existing]);
    deleteBackend.failClear = true;
    await expect(deletePersistence.deleteAllData(CURRENT_CATALOG.catalogVersion)).resolves.toEqual({
      kind: "indeterminate",
      operation: "delete",
      recovery: "reload",
    });
    expect(await deletePersistence.getUserWorks()).toEqual([existing]);
  });

  it("does not silently export a stale mirror after an authoritative snapshot read fails", async () => {
    const backend = new ControllableBackend();
    backend.userWorks = [{ workId: "one", readingState: "planned", updatedAt: DRAFT_TIME }];
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    expect(await persistence.getUserWorks()).toHaveLength(1);
    backend.failSnapshotRead = true;

    await expect(
      persistence.exportUserData(COMPLETED_TIME, CURRENT_CATALOG),
    ).rejects.toBeInstanceOf(DataSnapshotUnavailableError);
    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      mode: "memory",
      reason: "operation-failed",
    });
  });

  it("keeps replace and delete truthful in explicit session-only memory mode", async () => {
    const backend = new ControllableBackend();
    backend.failOpen = true;
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const importedRecords = CURRENT_CATALOG.workIds.slice(0, 5).map((workId) => ({
      workId,
      readingState: "completed" as const,
      reaction: "liked" as const,
      updatedAt: COMPLETED_TIME,
    }));
    const file = await createTransferFile({
      userWorks: importedRecords,
      draft: createAddDraft("six"),
    });

    await expect(persistence.replaceFromExport(file, CURRENT_CATALOG)).resolves.toMatchObject({
      kind: "applied",
      mode: "session-only",
    });
    expect(await persistence.getUserWorks()).toEqual(importedRecords);
    expect((await persistence.exportUserData(COMPLETED_TIME, CURRENT_CATALOG)).userWorks).toEqual(
      importedRecords,
    );

    await expect(persistence.deleteAllData(CURRENT_CATALOG.catalogVersion)).resolves.toMatchObject({
      kind: "applied",
      mode: "session-only",
      readback: { counts: { userWorks: 0, externalWorks: 0, profile: 0 } },
    });
    expect(await persistence.getUserWorks()).toEqual([]);
  });

  it("keeps diagnostic helper outputs stable", async () => {
    const file = await createTransferFile();
    expect(exportFilenameV1(COMPLETED_TIME)).toBe("konocomics-export-20260814.json");
    expect(serializeExportFileV1(file)).toMatch(/^\{[\s\S]*\}\n$/u);
    expect(new DataTransferError("invalid-format", "invalid").details).toBeNull();
  });
});

describe("conditional minimal-planned removal backend contract", () => {
  it("atomically distinguishes removed, absent, and a stale-tab conflict", async () => {
    const minimal: UserWorkRecord = {
      workId: "shared-work",
      readingState: "planned",
      updatedAt: DRAFT_TIME,
    };
    const harness = createDexieRemovalHarness(minimal);

    expect(await harness.backend.removeMinimalPlannedUserWork("shared-work")).toBe("removed");
    expect(harness.read()).toBeUndefined();
    expect(await harness.backend.removeMinimalPlannedUserWork("shared-work")).toBe(
      "already-absent",
    );

    const staleSnapshot = structuredClone(minimal);
    harness.replace({
      workId: "shared-work",
      readingState: "completed",
      reaction: "favorite",
      updatedAt: COMPLETED_TIME,
    });

    expect(staleSnapshot.readingState).toBe("planned");
    expect(await harness.backend.removeMinimalPlannedUserWork("shared-work")).toBe(
      "preserved-conflict",
    );
    expect(harness.read()).toMatchObject({
      readingState: "completed",
      reaction: "favorite",
    });
  });

  it("uses the same conflict-safe semantics in session memory", async () => {
    const backend = new MemoryPersistenceBackend();
    await backend.upsertUserWork({
      workId: "shared-work",
      readingState: "completed",
      reaction: "liked",
      updatedAt: COMPLETED_TIME,
    });

    expect(await backend.removeMinimalPlannedUserWork("shared-work")).toBe("preserved-conflict");
    expect(await backend.getUserWorks()).toEqual([
      expect.objectContaining({ readingState: "completed", reaction: "liked" }),
    ]);
  });
});

describe("external work persistence", () => {
  it("strictly validates embedded identity and duplicate bibliographic fields", async () => {
    const memory = new MemoryPersistenceBackend();
    await expect(
      memory.addExternalWorkIfAbsent({
        ...createExternalRecord(),
        record: {
          workId: "different-id",
          readingState: "planned",
          updatedAt: DRAFT_TIME,
        },
      }),
    ).rejects.toThrow(/embedded user work id/u);
    await expect(
      memory.addExternalWorkIfAbsent({
        ...createExternalRecord(),
        isbnSamples: [ISBN, ISBN],
      }),
    ).rejects.toThrow(/isbnSamples must be unique/u);
    await expect(
      memory.addExternalWorkIfAbsent({
        ...createExternalRecord(),
        isbnSamples: ["0306406152", "9780306406157"],
      }),
    ).rejects.toThrow(/isbnSamples must be unique/u);
  });

  it("writes, reads, updates, and removes through the primary backend with readback", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const initial = createExternalRecord();

    expect(await persistence.addExternalWorkIfAbsent(initial)).toEqual({
      kind: "added",
      record: initial,
    });
    expect(await persistence.inspectExternalWork(EXTERNAL_ID)).toEqual({
      kind: "found",
      record: initial,
    });
    expect(await persistence.getExternalWorks()).toEqual([initial]);

    const updated = createExternalRecord({
      record: {
        workId: EXTERNAL_ID,
        readingState: "completed",
        reaction: "liked",
        updatedAt: COMPLETED_TIME,
      },
    });
    expect(
      await persistence.saveExternalUserRecord(EXTERNAL_ID, initial.normalizedKey, updated.record),
    ).toEqual(updated);
    expect(await persistence.inspectExternalWork(EXTERNAL_ID)).toEqual({
      kind: "found",
      record: updated,
    });

    expect(await persistence.removeExternalWork(EXTERNAL_ID)).toBe("removed");
    expect(await persistence.inspectExternalWork(EXTERNAL_ID)).toEqual({ kind: "missing" });
    expect(await persistence.removeExternalWork(EXTERNAL_ID)).toBe("already-absent");
  });

  it("atomically updates only the nested user record in the IndexedDB transaction", async () => {
    const latest = createExternalRecord({
      title: "キングダム 2",
      isbnSamples: [ISBN, "9780306406157"],
    });
    const harness = createDexieExternalHarness(latest);
    const userRecord: UserWorkRecord = {
      workId: EXTERNAL_ID,
      readingState: "completed",
      reaction: "favorite",
      updatedAt: COMPLETED_TIME,
    };

    expect(
      await harness.backend.saveExternalUserRecord(EXTERNAL_ID, latest.normalizedKey, userRecord),
    ).toEqual({ ...latest, record: userRecord });
    expect(harness.read()).toEqual({ ...latest, record: userRecord });

    harness.replace(undefined);
    await expect(
      harness.backend.saveExternalUserRecord(EXTERNAL_ID, latest.normalizedKey, userRecord),
    ).rejects.toThrow(ExternalWorkNotFoundError);
    expect(harness.read()).toBeUndefined();
  });

  it("refuses a key change observed inside the IndexedDB edit transaction", async () => {
    const loaded = createExternalRecord();
    const changed = createExternalRecord({ normalizedKey: '["べつさくひん","べつさくしゃ"]' });
    const harness = createDexieExternalHarness(changed);
    const userRecord: UserWorkRecord = {
      workId: EXTERNAL_ID,
      readingState: "completed",
      updatedAt: COMPLETED_TIME,
    };

    await expect(
      harness.backend.saveExternalUserRecord(EXTERNAL_ID, loaded.normalizedKey, userRecord),
    ).rejects.toThrow(ExternalWorkIdentityConflictError);
    expect(harness.read()).toEqual(changed);
  });

  it("preserves a concurrent ISBN merge when a stale editor saves in session memory", async () => {
    const memory = new MemoryPersistenceBackend();
    const initial = createExternalRecord();
    await memory.addExternalWorkIfAbsent(initial);
    await memory.addExternalWorkIfAbsent(createExternalRecord({ isbnSamples: ["9780306406157"] }));
    const userRecord: UserWorkRecord = {
      workId: EXTERNAL_ID,
      readingState: "reading",
      progress: { volume: 4 },
      updatedAt: COMPLETED_TIME,
    };

    expect(
      await memory.saveExternalUserRecord(EXTERNAL_ID, initial.normalizedKey, userRecord),
    ).toEqual({
      ...initial,
      isbnSamples: [ISBN, "9780306406157"],
      record: userRecord,
    });
  });

  it("does not replay an uncertain primary external edit over the warmed mirror", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const latest = createExternalRecord({ isbnSamples: [ISBN, "9780306406157"] });
    backend.externalWorks = [latest];
    expect(await persistence.getExternalWorks()).toEqual([latest]);
    backend.failExternalWorkWrite = true;
    const userRecord: UserWorkRecord = {
      workId: EXTERNAL_ID,
      readingState: "completed",
      reaction: "liked",
      updatedAt: COMPLETED_TIME,
    };

    await expect(
      persistence.saveExternalUserRecord(EXTERNAL_ID, latest.normalizedKey, userRecord),
    ).rejects.toThrow("IndexedDB external work write failed");
    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      reason: "operation-failed",
    });
    expect(await persistence.inspectExternalWork(EXTERNAL_ID)).toEqual({
      kind: "found",
      record: latest,
    });
  });

  it("refuses missing or corrupt targeted edits without degrading or recreating rows", async () => {
    const missingBackend = new ControllableBackend();
    const missingPersistence = new ResilientPersistence({
      primaryFactory: () => missingBackend,
    });
    const userRecord = createExternalRecord().record;

    await expect(
      missingPersistence.saveExternalUserRecord(
        EXTERNAL_ID,
        createExternalRecord().normalizedKey,
        userRecord,
      ),
    ).rejects.toThrow(ExternalWorkNotFoundError);
    expect(missingPersistence.getStatus()).toMatchObject({ state: "ready", mode: "indexeddb" });
    expect(missingBackend.externalWorks).toEqual([]);

    const corruptBackend = new ControllableBackend();
    corruptBackend.externalWorks = [
      createExternalRecord({ normalizedKey: '["다른 작품","다른 작가"]' }),
    ];
    const corruptPersistence = new ResilientPersistence({
      primaryFactory: () => corruptBackend,
    });
    await expect(
      corruptPersistence.saveExternalUserRecord(
        EXTERNAL_ID,
        createExternalRecord().normalizedKey,
        userRecord,
      ),
    ).rejects.toThrow(ExternalWorkCorruptRecordError);
    expect(corruptPersistence.getStatus()).toMatchObject({ state: "ready", mode: "indexeddb" });
  });

  it("does not claim deletion when the primary mutation cannot be read back", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const record = createExternalRecord();
    backend.externalWorks = [record];
    backend.failExternalWorkRemoval = true;

    expect(await persistence.removeExternalWork(EXTERNAL_ID)).toBe("preserved-unknown");
    expect(persistence.getStatus()).toEqual({
      state: "degraded",
      mode: "memory",
      warning: "session-only",
      reason: "operation-failed",
    });
    expect(await persistence.inspectExternalWork(EXTERNAL_ID)).toEqual({
      kind: "found",
      record,
    });
  });

  it("reports a corrupt authoritative single-record read without rendering it as missing", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    backend.externalWorks = [
      {
        ...createExternalRecord(),
        record: {
          workId: "different-id",
          readingState: "planned",
          updatedAt: DRAFT_TIME,
        },
      },
    ];

    expect(await persistence.inspectExternalWork(EXTERNAL_ID)).toEqual({ kind: "corrupt" });
    expect(persistence.getStatus()).toMatchObject({ state: "ready", mode: "indexeddb" });
  });

  it("invalidates a stale valid mirror after the authoritative row becomes corrupt", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const valid = createExternalRecord();
    backend.externalWorks = [valid];
    expect(await persistence.getExternalWorks()).toEqual([valid]);

    backend.externalWorks = [
      {
        ...valid,
        record: { ...valid.record, workId: "different-id" },
      },
    ];
    expect(await persistence.inspectExternalWork(EXTERNAL_ID)).toEqual({ kind: "corrupt" });
    expect(persistence.getStatus()).toMatchObject({ state: "ready", mode: "indexeddb" });

    backend.failExternalWorkRead = true;
    expect(await persistence.inspectExternalWork(EXTERNAL_ID)).toEqual({ kind: "unavailable" });
    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      reason: "operation-failed",
    });
    expect(await persistence.inspectExternalWork(EXTERNAL_ID)).toEqual({ kind: "unavailable" });
  });

  it("retains valid list rows without degrading before a targeted corrupt read", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const valid = createExternalRecord();
    const corruptId = `ext:rakuten:v1:${"a".repeat(64)}` as ExternalWorkId;
    const corrupt = createExternalRecord({
      id: corruptId,
      record: {
        workId: corruptId,
        readingState: "planned",
        updatedAt: DRAFT_TIME,
      },
    });
    backend.externalWorks = [valid, corrupt];

    expect(await persistence.getExternalWorks()).toEqual([valid]);
    expect(persistence.getStatus()).toMatchObject({ state: "ready", mode: "indexeddb" });
    expect(await persistence.inspectExternalWork(corruptId)).toEqual({ kind: "corrupt" });
    expect(persistence.getStatus()).toMatchObject({ state: "ready", mode: "indexeddb" });
  });

  it("ignores unrelated corrupt rows while warming add, save, and remove operations", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const corruptId = `ext:rakuten:v1:${"a".repeat(64)}` as ExternalWorkId;
    const corrupt = createExternalRecord({
      id: corruptId,
      record: {
        workId: corruptId,
        readingState: "planned",
        updatedAt: DRAFT_TIME,
      },
    });
    const record = createExternalRecord();
    backend.externalWorks = [corrupt];

    expect(await persistence.addExternalWorkIfAbsent(record)).toEqual({
      kind: "added",
      record,
    });
    const edited = createExternalRecord({
      record: {
        workId: EXTERNAL_ID,
        readingState: "completed",
        updatedAt: COMPLETED_TIME,
      },
    });
    expect(
      await persistence.saveExternalUserRecord(EXTERNAL_ID, record.normalizedKey, edited.record),
    ).toEqual(edited);
    expect(await persistence.removeExternalWork(EXTERNAL_ID)).toBe("removed");
    expect(persistence.getStatus()).toMatchObject({ state: "ready", mode: "indexeddb" });
    expect(await persistence.inspectExternalWork(corruptId)).toEqual({ kind: "corrupt" });
  });

  it("returns unavailable for an IndexedDB read failure without calling it for malformed ids", async () => {
    const malformedBackend = new ControllableBackend();
    const malformedPersistence = new ResilientPersistence({
      primaryFactory: () => malformedBackend,
    });

    await expect(
      malformedPersistence.inspectExternalWork("not-an-external-id" as ExternalWorkId),
    ).rejects.toThrow(/supported Rakuten v1/u);
    expect(malformedPersistence.getStatus().state).toBe("initializing");

    const unavailableBackend = new ControllableBackend();
    const unavailablePersistence = new ResilientPersistence({
      primaryFactory: () => unavailableBackend,
    });
    unavailableBackend.failExternalWorkRead = true;
    expect(await unavailablePersistence.inspectExternalWork(EXTERNAL_ID)).toEqual({
      kind: "unavailable",
    });
    expect(unavailablePersistence.getStatus()).toMatchObject({
      state: "degraded",
      reason: "operation-failed",
    });
  });

  it("does not report a persistent miss when IndexedDB failed to open", async () => {
    const { persistence } = openFailingPersistence();

    expect(await persistence.inspectExternalWork(EXTERNAL_ID)).toEqual({ kind: "unavailable" });
    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      reason: "open-failed",
    });
  });

  it("uses a verified mirror hit after an operation failure but cannot confirm mirror absence", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const record = createExternalRecord();
    const unknownId = `ext:rakuten:v1:${"a".repeat(64)}` as ExternalWorkId;
    backend.externalWorks = [record];

    expect(await persistence.getExternalWorks()).toEqual([record]);
    backend.failExternalWorkRead = true;
    expect(await persistence.inspectExternalWork(EXTERNAL_ID)).toEqual({ kind: "unavailable" });
    expect(await persistence.inspectExternalWork(EXTERNAL_ID)).toEqual({
      kind: "found",
      record,
    });
    expect(await persistence.inspectExternalWork(unknownId)).toEqual({ kind: "unavailable" });
  });
});

describe("atomic library insert-only persistence", () => {
  it("preserves existing meaningful catalog and external records", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const existingCatalog: UserWorkRecord = {
      workId: "existing-catalog",
      readingState: "completed",
      reaction: "favorite",
      updatedAt: COMPLETED_TIME,
    };
    const existingExternal = createExternalRecord({
      record: {
        workId: EXTERNAL_ID,
        readingState: "completed",
        reaction: "liked",
        updatedAt: COMPLETED_TIME,
      },
    });
    backend.userWorks = [existingCatalog];
    backend.externalWorks = [existingExternal];

    expect(
      await persistence.addUserWorkIfAbsent({
        workId: "existing-catalog",
        readingState: "planned",
        updatedAt: DRAFT_TIME,
      }),
    ).toEqual({ kind: "already-exists", record: existingCatalog });
    expect(await persistence.addExternalWorkIfAbsent(createExternalRecord())).toEqual({
      kind: "already-exists",
      record: existingExternal,
    });
    expect(await persistence.getUserWorks()).toEqual([existingCatalog]);
    expect(await persistence.getExternalWorks()).toEqual([existingExternal]);
  });

  it("reuses the same external identity, preserves user state, and merges distinct ISBNs", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const existing = createExternalRecord({
      record: {
        workId: EXTERNAL_ID,
        readingState: "completed",
        reaction: "favorite",
        updatedAt: COMPLETED_TIME,
      },
    });
    backend.externalWorks = [existing];
    const incoming = createExternalRecord({
      title: "キングダム 新装版 2巻",
      isbnSamples: ["9780306406157"],
      coverUrl: "https://thumbnail.image.rakuten.co.jp/new-volume.jpg",
    });

    expect(await persistence.addExternalWorkIfAbsent(incoming)).toEqual({
      kind: "already-exists",
      record: {
        ...existing,
        isbnSamples: [ISBN, "9780306406157"],
      },
    });
    expect(await persistence.getExternalWorks()).toEqual([
      { ...existing, isbnSamples: [ISBN, "9780306406157"] },
    ]);
  });

  it("stores equivalent ISBN-10 and ISBN-13 samples once in canonical ISBN-13 form", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const existing = createExternalRecord({ isbnSamples: ["0306406152"] });
    backend.externalWorks = [existing];
    const incoming = createExternalRecord({ isbnSamples: ["9780306406157"] });
    const canonical = createExternalRecord({ isbnSamples: ["9780306406157"] });

    expect(await persistence.addExternalWorkIfAbsent(incoming)).toEqual({
      kind: "already-exists",
      record: canonical,
    });
    expect(backend.externalWorks).toEqual([canonical]);
    expect(await persistence.getExternalWorks()).toEqual([canonical]);
  });

  it("rejects a same-id/different-key collision without overwriting the existing row", () => {
    const existing = createExternalRecord();
    const conflicting = createExternalRecord({
      normalizedKey: '["別作品","別作者"]',
    });

    expect(() => mergeExternalWorkOnInsert(existing, conflicting)).toThrow(
      ExternalWorkIdentityConflictError,
    );
    expect(existing).toEqual(createExternalRecord());
  });

  it("returns added only with authoritative stored readback", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const catalog: UserWorkRecord = {
      workId: "new-catalog",
      readingState: "planned",
      updatedAt: DRAFT_TIME,
    };
    const external = createExternalRecord();

    expect(await persistence.addUserWorkIfAbsent(catalog)).toEqual({
      kind: "added",
      record: catalog,
    });
    expect(await persistence.addExternalWorkIfAbsent(external)).toEqual({
      kind: "added",
      record: external,
    });
    expect(backend.userWorks).toEqual([catalog]);
    expect(backend.externalWorks).toEqual([external]);
  });

  it("does not replay an uncertain primary insert into session memory", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    backend.failUserWorkInsert = true;

    expect(
      await persistence.addUserWorkIfAbsent({
        workId: "uncertain-catalog",
        readingState: "planned",
        updatedAt: DRAFT_TIME,
      }),
    ).toEqual({ kind: "preserved-unknown" });
    expect(await persistence.getUserWorks()).toEqual([]);
  });
});

describe("resilient onboarding persistence", () => {
  it("surfaces open failure and completes onboarding in session memory", async () => {
    const { backend, persistence } = openFailingPersistence();
    const statuses: string[] = [];
    persistence.subscribe((status) => statuses.push(status.state));

    await persistence.initialize();
    expect(persistence.getStatus()).toEqual({
      state: "degraded",
      mode: "memory",
      warning: "session-only",
      reason: "open-failed",
    });
    expect(statuses).toEqual(["degraded"]);
    expect(backend.closed).toBe(true);

    const draft = createDraft();
    await persistence.saveOnboardingDraft(draft);
    draft.positiveEntries[0]!.reaction = "liked";
    const restored = await persistence.getOnboardingDraft();
    expect(restored?.positiveEntries[0]?.reaction).toBe("favorite");

    await persistence.finalizeOnboarding(restored!, COMPLETED_TIME);

    expect(await persistence.getOnboardingDraft()).toBeNull();
    expect(await persistence.getOnboardingCompletedAt()).toBe(COMPLETED_TIME);
    expect(await persistence.getUserWorks()).toEqual(
      expect.arrayContaining<UserWorkRecord>([
        {
          workId: "positive-1",
          readingState: "completed",
          reaction: "favorite",
          updatedAt: COMPLETED_TIME,
        },
        {
          workId: "negative-disliked",
          readingState: "completed",
          reaction: "disliked",
          negativeReasons: ["tooDark"],
          updatedAt: COMPLETED_TIME,
        },
        {
          workId: "negative-dropped",
          readingState: "dropped",
          droppedReasons: ["vagueDislike"],
          updatedAt: COMPLETED_TIME,
        },
      ]),
    );
  });

  it("validates finalization before changing draft, works, or completion state", async () => {
    const { persistence } = openFailingPersistence();
    const incompleteDraft = createDraft(4);
    await persistence.saveOnboardingDraft(incompleteDraft);

    await expect(persistence.finalizeOnboarding(incompleteDraft, COMPLETED_TIME)).rejects.toThrow(
      "at least 5 positive works",
    );

    expect(await persistence.getOnboardingDraft()).toEqual(incompleteDraft);
    expect(await persistence.getUserWorks()).toEqual([]);
    expect(await persistence.getOnboardingCompletedAt()).toBeNull();
  });

  it("retains the session mirror when a later IndexedDB operation fails", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const draft = createDraft();

    await persistence.initialize();
    expect(persistence.getStatus()).toEqual({
      state: "ready",
      mode: "indexeddb",
      warning: null,
    });
    await persistence.saveOnboardingDraft(draft);

    backend.failDraftRead = true;
    expect(await persistence.getOnboardingDraft()).toEqual(draft);
    expect(persistence.getStatus()).toEqual({
      state: "degraded",
      mode: "memory",
      warning: "session-only",
      reason: "operation-failed",
    });
    expect(backend.closed).toBe(true);
  });

  it("rejects invalid IndexedDB boundary data and reports the memory fallback", async () => {
    const backend = new ControllableBackend();
    backend.draft = { ...createDraft(), unexpected: true };
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    expect(await persistence.getOnboardingDraft()).toBeNull();
    expect(persistence.getStatus()).toEqual({
      state: "degraded",
      mode: "memory",
      warning: "session-only",
      reason: "operation-failed",
    });
  });

  it.each([
    ["non-canonical external reason", ["external:UPPER"]],
    ["vague reason mixed with a factor reason", ["vagueDislike", "tooDark"]],
  ])("rejects %s in persisted user works", async (_label, negativeReasons) => {
    const backend = new ControllableBackend();
    backend.userWorks = [
      {
        workId: "corrupt-work",
        readingState: "completed",
        reaction: "disliked",
        negativeReasons,
        updatedAt: COMPLETED_TIME,
      },
    ];
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    expect(await persistence.getUserWorks()).toEqual([]);
    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      mode: "memory",
      reason: "operation-failed",
    });
  });

  it("replays a failed atomic commit against the memory fallback", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const draft = createDraft();

    await persistence.saveOnboardingDraft(draft);
    backend.failCommit = true;
    await persistence.finalizeOnboarding(draft, COMPLETED_TIME);

    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      mode: "memory",
      reason: "operation-failed",
    });
    expect(await persistence.getOnboardingDraft()).toBeNull();
    expect(await persistence.getUserWorks()).toHaveLength(7);
    expect(await persistence.getOnboardingCompletedAt()).toBe(COMPLETED_TIME);
  });

  it("inserts add-mode works without replacing existing records or the first completion time", async () => {
    const backend = new ControllableBackend();
    const firstCompletionTime = "2026-08-13T09:00:00+09:00";
    const existingRecord: UserWorkRecord = {
      workId: "existing-positive",
      readingState: "reading",
      reaction: "favorite",
      progress: { volume: 7, chapter: 58 },
      positiveReasons: ["緻密な駆け引き"],
      updatedAt: DRAFT_TIME,
    };
    backend.userWorks = [existingRecord];
    backend.onboardingCompletedAt = firstCompletionTime;
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const addDraft = createAddDraft();

    expect(await persistence.getUserWorks()).toEqual([existingRecord]);
    expect(await persistence.getOnboardingCompletedAt()).toBe(firstCompletionTime);
    await persistence.saveOnboardingDraft(addDraft);
    await persistence.finalizeOnboarding(addDraft, COMPLETED_TIME);

    expect(await persistence.getOnboardingDraft()).toBeNull();
    expect(await persistence.getOnboardingCompletedAt()).toBe(firstCompletionTime);
    expect(await persistence.getUserWorks()).toEqual(
      expect.arrayContaining([
        existingRecord,
        {
          workId: "new-positive",
          readingState: "completed",
          reaction: "liked",
          updatedAt: COMPLETED_TIME,
        },
      ]),
    );
    expect(await persistence.getUserWorks()).toHaveLength(2);
  });

  it("does not degrade, replay, or clear an add draft when the primary detects a conflict", async () => {
    const backend = new ControllableBackend();
    const existingRecord: UserWorkRecord = {
      workId: "existing-positive",
      readingState: "reading",
      reaction: "favorite",
      progress: { volume: 4 },
      updatedAt: DRAFT_TIME,
    };
    backend.userWorks = [existingRecord];
    backend.onboardingCompletedAt = DRAFT_TIME;
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const conflictingDraft = createAddDraft("existing-positive");

    await persistence.saveOnboardingDraft(conflictingDraft);
    await expect(persistence.finalizeOnboarding(conflictingDraft, COMPLETED_TIME)).rejects.toThrow(
      OnboardingWorkConflictError,
    );

    expect(persistence.getStatus()).toEqual({
      state: "ready",
      mode: "indexeddb",
      warning: null,
    });
    expect(await persistence.getOnboardingDraft()).toEqual(conflictingDraft);
    expect(await persistence.getUserWorks()).toEqual([existingRecord]);
    expect(await persistence.getOnboardingCompletedAt()).toBe(DRAFT_TIME);
  });

  it("does not overwrite a first completion marker when a stale tab submits disjoint works", async () => {
    const backend = new ControllableBackend();
    backend.onboardingCompletedAt = DRAFT_TIME;
    backend.userWorks = [
      {
        workId: "completed-in-another-tab",
        readingState: "completed",
        reaction: "favorite",
        updatedAt: DRAFT_TIME,
      },
    ];
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const staleFirstRunDraft = createDraft();
    await persistence.saveOnboardingDraft(staleFirstRunDraft);

    await expect(
      persistence.finalizeOnboarding(staleFirstRunDraft, COMPLETED_TIME),
    ).rejects.toThrow(OnboardingAlreadyCompletedError);

    expect(persistence.getStatus()).toEqual({
      state: "ready",
      mode: "indexeddb",
      warning: null,
    });
    expect(await persistence.getOnboardingCompletedAt()).toBe(DRAFT_TIME);
    expect(await persistence.getUserWorks()).toEqual([
      expect.objectContaining({ workId: "completed-in-another-tab" }),
    ]);
    expect(await persistence.getOnboardingDraft()).toEqual(staleFirstRunDraft);
  });

  it("clears only the onboarding draft when the user explicitly discards add-mode input", async () => {
    const backend = new ControllableBackend();
    const existingRecord: UserWorkRecord = {
      workId: "existing-positive",
      readingState: "completed",
      reaction: "liked",
      updatedAt: DRAFT_TIME,
    };
    backend.userWorks = [existingRecord];
    backend.onboardingCompletedAt = DRAFT_TIME;
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    await persistence.saveOnboardingDraft(createAddDraft());
    await persistence.clearOnboardingDraft();

    expect(await persistence.getOnboardingDraft()).toBeNull();
    expect(await persistence.getUserWorks()).toEqual([existingRecord]);
    expect(await persistence.getOnboardingCompletedAt()).toBe(DRAFT_TIME);
  });

  it("returns empty adjustments for a missing row and strictly clones saved adjustments", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    expect(await persistence.getProfileAdjustments()).toEqual({ axes: {}, themes: {} });

    const adjustments: ProfileAdjustments = {
      axes: { pacing: "less" },
      themes: { cooking: "veryLike" },
    };
    await persistence.saveProfileAdjustments(adjustments);
    adjustments.axes.pacing = "exclude";

    expect(await persistence.getProfileAdjustments()).toEqual({
      axes: { pacing: "less" },
      themes: { cooking: "veryLike" },
    });
  });

  it.each([
    ["unknown axis", { axes: { unknownAxis: "like" }, themes: {} }],
    ["invalid preference", { axes: { pacing: "stronglyLike" }, themes: {} }],
    ["unexpected root field", { axes: {}, themes: {}, unexpected: true }],
  ])("rejects %s at the adjustments read boundary", async (_label, profileAdjustments) => {
    const backend = new ControllableBackend();
    backend.profileAdjustments = profileAdjustments;
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    expect(await persistence.getProfileAdjustments()).toEqual({ axes: {}, themes: {} });
    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      mode: "memory",
      reason: "operation-failed",
    });
  });

  it("validates adjustments before attempting a write", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    await persistence.initialize();

    await expect(
      Reflect.apply(persistence.saveProfileAdjustments, persistence, [
        { axes: { pacing: "stronglyLike" }, themes: {} },
      ]),
    ).rejects.toThrow();

    expect(backend.profileAdjustments).toBeNull();
    expect(persistence.getStatus()).toEqual({
      state: "ready",
      mode: "indexeddb",
      warning: null,
    });
  });

  it("replays a failed adjustment write against the memory fallback", async () => {
    const backend = new ControllableBackend();
    backend.failAdjustmentsWrite = true;
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const adjustments: ProfileAdjustments = {
      axes: { darkness: "exclude" },
      themes: { revenge: "less" },
    };

    await persistence.saveProfileAdjustments(adjustments);

    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      mode: "memory",
      reason: "operation-failed",
    });
    expect(await persistence.getProfileAdjustments()).toEqual(adjustments);
  });

  it("preserves warmed works and adjustments when a later onboarding commit fails", async () => {
    const backend = new ControllableBackend();
    backend.userWorks = [
      {
        workId: "existing-positive",
        readingState: "completed",
        reaction: "favorite",
        updatedAt: DRAFT_TIME,
      },
    ];
    backend.profileAdjustments = {
      axes: { progression: "like" },
      themes: { adventure: "less" },
    };
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    expect(await persistence.getUserWorks()).toHaveLength(1);
    expect(await persistence.getProfileAdjustments()).toEqual(backend.profileAdjustments);
    await persistence.saveOnboardingDraft(createDraft());

    backend.failCommit = true;
    await persistence.finalizeOnboarding(createDraft(), COMPLETED_TIME);

    expect(await persistence.getUserWorks()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ workId: "existing-positive", reaction: "favorite" }),
        expect.objectContaining({ workId: "positive-1", reaction: "favorite" }),
      ]),
    );
    expect(await persistence.getUserWorks()).toHaveLength(8);
    expect(await persistence.getProfileAdjustments()).toEqual({
      axes: { progression: "like" },
      themes: { adventure: "less" },
    });
  });

  it("preserves earlier refresh state when the final adjustments read fails", async () => {
    const backend = new ControllableBackend();
    const draft = createDraft();
    backend.userWorks = [
      {
        workId: "existing-positive",
        readingState: "completed",
        reaction: "favorite",
        updatedAt: DRAFT_TIME,
      },
    ];
    backend.draft = draft;
    backend.onboardingCompletedAt = COMPLETED_TIME;
    backend.failAdjustmentsRead = true;
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    const [records, restoredDraft, completedAt, adjustments] = await Promise.all([
      persistence.getUserWorks(),
      persistence.getOnboardingDraft(),
      persistence.getOnboardingCompletedAt(),
      persistence.getProfileAdjustments(),
    ]);

    expect(records).toEqual([
      expect.objectContaining({ workId: "existing-positive", reaction: "favorite" }),
    ]);
    expect(restoredDraft).toEqual(draft);
    expect(completedAt).toBe(COMPLETED_TIME);
    expect(adjustments).toEqual({ axes: {}, themes: {} });
    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      reason: "operation-failed",
    });

    backend.userWorks = [];
    backend.draft = null;
    backend.onboardingCompletedAt = null;
    expect(await persistence.getUserWorks()).toEqual(records);
    expect(await persistence.getOnboardingDraft()).toEqual(draft);
    expect(await persistence.getOnboardingCompletedAt()).toBe(COMPLETED_TIME);
  });

  it("uses strict all-false policy defaults and round-trips saved policies", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    expect(await persistence.getPolicies()).toEqual({
      preferCompleted: false,
      preferHidden: false,
      preferVerified: false,
      excludeIncomplete: false,
    });

    const policies: RecommendationPolicies = {
      preferCompleted: true,
      preferHidden: true,
      preferVerified: false,
      excludeIncomplete: false,
    };
    await persistence.savePolicies(policies);
    policies.preferCompleted = false;

    expect(await persistence.getPolicies()).toEqual({
      preferCompleted: true,
      preferHidden: true,
      preferVerified: false,
      excludeIncomplete: false,
    });
  });

  it("rejects incomplete or extended policy values before writing", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    await persistence.initialize();

    await expect(
      Reflect.apply(persistence.savePolicies, persistence, [
        {
          preferCompleted: false,
          preferHidden: false,
          preferVerified: false,
        },
      ]),
    ).rejects.toThrow();
    await expect(
      Reflect.apply(persistence.savePolicies, persistence, [
        {
          preferCompleted: false,
          preferHidden: false,
          preferVerified: false,
          excludeIncomplete: false,
          renderedReason: "not persisted",
        },
      ]),
    ).rejects.toThrow();

    expect(backend.recommendationPolicies).toBeNull();
    expect(persistence.getStatus()).toEqual({
      state: "ready",
      mode: "indexeddb",
      warning: null,
    });
  });

  it("serializes rapid policy saves so the last invocation remains authoritative", async () => {
    const backend = new ControllableBackend();
    let releaseFirstWrite: () => void = () => undefined;
    backend.policyWriteGate = new Promise<void>((resolve) => {
      releaseFirstWrite = () => resolve();
    });
    let markFirstWriteWaiting: () => void = () => undefined;
    const firstWriteWaiting = new Promise<void>((resolve) => {
      markFirstWriteWaiting = () => resolve();
    });
    backend.onPolicyWriteWaiting = markFirstWriteWaiting;
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const firstPolicies: RecommendationPolicies = {
      preferCompleted: true,
      preferHidden: false,
      preferVerified: false,
      excludeIncomplete: false,
    };
    const finalPolicies: RecommendationPolicies = {
      preferCompleted: false,
      preferHidden: true,
      preferVerified: true,
      excludeIncomplete: false,
    };

    const firstSave = persistence.savePolicies(firstPolicies);
    const finalSave = persistence.savePolicies(finalPolicies);
    await firstWriteWaiting;

    expect(backend.recommendationPolicies).toBeNull();
    releaseFirstWrite();
    await Promise.all([firstSave, finalSave]);

    expect(await persistence.getPolicies()).toEqual(finalPolicies);
    expect(backend.recommendationPolicies).toEqual(finalPolicies);
  });

  it("replays a failed policy write in memory without disturbing warmed works", async () => {
    const backend = new ControllableBackend();
    const existingRecord: UserWorkRecord = {
      workId: "existing-work",
      readingState: "completed",
      reaction: "favorite",
      updatedAt: DRAFT_TIME,
    };
    backend.userWorks = [existingRecord];
    backend.failPoliciesWrite = true;
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const policies: RecommendationPolicies = {
      preferCompleted: false,
      preferHidden: true,
      preferVerified: true,
      excludeIncomplete: false,
    };

    expect(await persistence.getUserWorks()).toEqual([existingRecord]);
    await persistence.savePolicies(policies);

    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      mode: "memory",
      reason: "operation-failed",
    });
    expect(await persistence.getPolicies()).toEqual(policies);
    expect(await persistence.getUserWorks()).toEqual([existingRecord]);
  });

  it("upserts one user work with readback while preserving every sibling record", async () => {
    const backend = new ControllableBackend();
    backend.userWorks = [
      {
        workId: "updated-work",
        readingState: "planned",
        updatedAt: DRAFT_TIME,
      },
      {
        workId: "sibling-work",
        readingState: "completed",
        reaction: "favorite",
        updatedAt: DRAFT_TIME,
      },
    ];
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const update: UserWorkRecord = {
      workId: "updated-work",
      readingState: "completed",
      reaction: "liked",
      updatedAt: COMPLETED_TIME,
    };

    expect(await persistence.saveUserWork(update)).toEqual(update);
    update.reaction = "neutral";

    expect(await persistence.getUserWorks()).toEqual(
      expect.arrayContaining([
        {
          workId: "updated-work",
          readingState: "completed",
          reaction: "liked",
          updatedAt: COMPLETED_TIME,
        },
        expect.objectContaining({ workId: "sibling-work", reaction: "favorite" }),
      ]),
    );
    expect(await persistence.getUserWorks()).toHaveLength(2);
  });

  it("replays a failed user-work upsert without dropping warmed sibling records", async () => {
    const backend = new ControllableBackend();
    backend.userWorks = [
      {
        workId: "existing-work",
        readingState: "completed",
        reaction: "favorite",
        updatedAt: DRAFT_TIME,
      },
    ];
    backend.failUserWorkWrite = true;
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    const stored = await persistence.saveUserWork({
      workId: "new-work",
      readingState: "hidden",
      reaction: "disliked",
      negativeReasons: ["vagueDislike"],
      updatedAt: COMPLETED_TIME,
    });

    expect(stored).toMatchObject({ workId: "new-work", readingState: "hidden" });
    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      mode: "memory",
      reason: "operation-failed",
    });
    expect(await persistence.getUserWorks()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ workId: "existing-work", reaction: "favorite" }),
        expect.objectContaining({ workId: "new-work", reaction: "disliked" }),
      ]),
    );
    expect(await persistence.getUserWorks()).toHaveLength(2);
  });

  it("round-trips a versioned full recommendation plan without rendered explanations", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const cache = createCacheRecord();

    await persistence.saveRecommendationCache(cache);
    cache.plan[0]!.tasteScore = 0.1;

    expect(await persistence.getRecommendationCache(INPUT_HASH)).toEqual(createCacheRecord());
    expect(backend.recommendationCache.get(INPUT_HASH)).not.toHaveProperty("renderedExplanation");
  });

  it.each([
    ["non-lowercase SHA-256 key", { ...createCacheRecord(), inputHash: "A".repeat(64) }],
    ["unknown engine version", { ...createCacheRecord(), engineVersion: "taste-v2" }],
    ["timestamp without an offset", { ...createCacheRecord(), computedAt: "2026-08-14T10:10:00" }],
    [
      "rendered explanation payload",
      {
        ...createCacheRecord(),
        plan: [
          {
            ...createCacheRecord().plan[0],
            renderedExplanation: "derived sentences do not belong in cache",
          },
        ],
      },
    ],
  ])("rejects a cache with %s before writing", async (_label, invalidCache) => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    await persistence.initialize();

    await expect(
      Reflect.apply(persistence.saveRecommendationCache, persistence, [invalidCache]),
    ).rejects.toThrow();

    expect(backend.recommendationCache.size).toBe(0);
    expect(persistence.getStatus()).toEqual({
      state: "ready",
      mode: "indexeddb",
      warning: null,
    });
  });

  it("treats a structurally corrupt cache as a miss without touching profile state", async () => {
    const backend = new ControllableBackend();
    const existingRecord: UserWorkRecord = {
      workId: "existing-work",
      readingState: "completed",
      reaction: "favorite",
      updatedAt: DRAFT_TIME,
    };
    const policies: RecommendationPolicies = {
      preferCompleted: true,
      preferHidden: false,
      preferVerified: true,
      excludeIncomplete: false,
    };
    backend.userWorks = [existingRecord];
    backend.recommendationPolicies = policies;
    backend.recommendationCache.set(INPUT_HASH, {
      ...createCacheRecord(),
      renderedExplanation: "cache must never store this sentence",
    });
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    expect(await persistence.getUserWorks()).toEqual([existingRecord]);
    expect(await persistence.getPolicies()).toEqual(policies);
    expect(await persistence.getRecommendationCache(INPUT_HASH)).toBeNull();
    expect(persistence.getStatus()).toEqual({
      state: "ready",
      mode: "indexeddb",
      warning: null,
    });
    expect(await persistence.getUserWorks()).toEqual([existingRecord]);
    expect(await persistence.getPolicies()).toEqual(policies);
  });

  it("falls back to the warmed recommendation cache after a cache read failure", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const cache = createCacheRecord();

    await persistence.saveRecommendationCache(cache);
    backend.failCacheRead = true;

    expect(await persistence.getRecommendationCache(INPUT_HASH)).toEqual(cache);
    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      mode: "memory",
      reason: "operation-failed",
    });
  });

  it("replays a failed recommendation-cache write in the session mirror", async () => {
    const backend = new ControllableBackend();
    backend.failCacheWrite = true;
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const cache = createCacheRecord();

    await persistence.saveRecommendationCache(cache);

    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      mode: "memory",
      reason: "operation-failed",
    });
    expect(await persistence.getRecommendationCache(INPUT_HASH)).toEqual(cache);
  });

  it("removes one minimal planned work with authoritative readback while preserving siblings", async () => {
    const backend = new ControllableBackend();
    backend.userWorks = [
      { workId: "remove-me", readingState: "planned", updatedAt: DRAFT_TIME },
      {
        workId: "keep-me",
        readingState: "completed",
        reaction: "favorite",
        updatedAt: DRAFT_TIME,
      },
    ];
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    expect(await persistence.removeMinimalPlannedUserWork("remove-me")).toBe("removed");

    expect(await persistence.getUserWorks()).toEqual([
      expect.objectContaining({ workId: "keep-me", reaction: "favorite" }),
    ]);
    expect(backend.userWorks).toEqual([
      expect.objectContaining({ workId: "keep-me", reaction: "favorite" }),
    ]);
  });

  it("does not replay a failed primary removal against the warmed session mirror", async () => {
    const backend = new ControllableBackend();
    backend.userWorks = [
      { workId: "remove-me", readingState: "planned", updatedAt: DRAFT_TIME },
      { workId: "keep-me", readingState: "planned", updatedAt: DRAFT_TIME },
    ];
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    backend.failUserWorkRemoval = true;

    expect(await persistence.removeMinimalPlannedUserWork("remove-me")).toBe("preserved-conflict");

    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      mode: "memory",
      reason: "operation-failed",
    });
    expect(await persistence.getUserWorks()).toEqual([
      expect.objectContaining({ workId: "remove-me" }),
      expect.objectContaining({ workId: "keep-me" }),
    ]);
  });

  it("preserves a meaningful row written after a stale tab read its minimal snapshot", async () => {
    const backend = new ControllableBackend();
    backend.userWorks = [{ workId: "shared-work", readingState: "planned", updatedAt: DRAFT_TIME }];
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    expect(await persistence.getUserWorks()).toEqual([
      expect.objectContaining({ workId: "shared-work", readingState: "planned" }),
    ]);
    backend.beforeUserWorkRemoval = () => {
      backend.userWorks = [
        {
          workId: "shared-work",
          readingState: "completed",
          reaction: "favorite",
          updatedAt: COMPLETED_TIME,
        },
      ];
    };

    expect(await persistence.removeMinimalPlannedUserWork("shared-work")).toBe(
      "preserved-conflict",
    );
    expect(await persistence.getUserWorks()).toEqual([
      expect.objectContaining({
        workId: "shared-work",
        readingState: "completed",
        reaction: "favorite",
      }),
    ]);
    expect(backend.userWorks).toEqual([
      expect.objectContaining({ readingState: "completed", reaction: "favorite" }),
    ]);
    expect(persistence.getStatus()).toEqual({
      state: "ready",
      mode: "indexeddb",
      warning: null,
    });
  });

  it("round-trips a split-TTL provider cache record through primary readback", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const providerRecord = createProviderRecord();

    expect(await persistence.saveProviderCache(providerRecord)).toEqual(providerRecord);
    providerRecord.itemPrice = 1;

    expect(await persistence.getProviderCache(ISBN)).toEqual(createProviderRecord());
    expect(backend.providerCache.get(ISBN)).not.toHaveProperty("expiresAt");
  });

  it("treats a legacy v1 single-TTL row as a cache miss without degrading persistence", async () => {
    const backend = new ControllableBackend();
    backend.providerCache.set(ISBN, {
      workId: "legacy-work",
      provider: "rakuten",
      isbn: ISBN,
      itemUrl: "https://books.rakuten.co.jp/rb/legacy-work/",
      fetchedAt: "2026-08-14T01:00:00.000Z",
      expiresAt: "2026-08-15T01:00:00.000Z",
    });
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });

    expect(await persistence.getProviderCache(ISBN)).toBeNull();
    expect(persistence.getStatus()).toEqual({
      state: "ready",
      mode: "indexeddb",
      warning: null,
    });
  });

  it("falls back to warmed provider data after a provider-cache read failure", async () => {
    const backend = new ControllableBackend();
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const providerRecord = createProviderRecord();
    await persistence.saveProviderCache(providerRecord);
    backend.failProviderCacheRead = true;

    expect(await persistence.getProviderCache(ISBN)).toEqual(providerRecord);
    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      mode: "memory",
      reason: "operation-failed",
    });
  });

  it("replays a failed provider-cache write in the session mirror", async () => {
    const backend = new ControllableBackend();
    backend.failProviderCacheWrite = true;
    const persistence = new ResilientPersistence({ primaryFactory: () => backend });
    const providerRecord = createProviderRecord();

    expect(await persistence.saveProviderCache(providerRecord)).toEqual(providerRecord);
    expect(persistence.getStatus()).toMatchObject({
      state: "degraded",
      mode: "memory",
      reason: "operation-failed",
    });
    expect(await persistence.getProviderCache(ISBN)).toEqual(providerRecord);
  });
});
