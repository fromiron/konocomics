import { describe, expect, it } from "vitest";

import {
  OnboardingInsufficientPositiveWorksError,
  type OnboardingDraft,
} from "@/domain/profile/onboarding";
import type { UserWorkRecord } from "@/domain/profile/types";
import type { KonocomicsDatabase } from "@/infrastructure/db/database";
import { DexiePersistenceBackend } from "@/infrastructure/db/dexie-backend";
import { UserWorkConflictError } from "@/infrastructure/db/backend";
import { MemoryPersistenceBackend } from "@/infrastructure/db/memory-backend";
import type { RuntimeMetaV2, UserDataSnapshot } from "@/infrastructure/db/export-v1";
import type {
  ExternalWorkRecord,
  MetaRecord,
  ProfileRecord,
  ProviderCacheRecord,
  RecommendationCacheRecord,
} from "@/infrastructure/db/records";

const UPDATED_AT = "2026-08-14T10:00:00+09:00";
const EXTERNAL_ID =
  "ext:rakuten:v1:ebbfe45c6734e41f113df7284b2e63fbdef2d285229e699a5109e835a26b88b6" as const;
const RUNTIME_META: RuntimeMetaV2 = { schemaVersion: 2, catalogVersion: "catalog-current" };

type Key = string;

class FakeTable<T> {
  failBulkAddAfter: number | null = null;
  countOverride: number | null = null;
  private records = new Map<Key, T>();

  constructor(
    private readonly keyOf: (record: T) => Key,
    records: readonly T[] = [],
  ) {
    this.restore(records);
  }

  async delete(key: Key): Promise<void> {
    this.records.delete(key);
  }

  async clear(): Promise<void> {
    this.records.clear();
  }

  async add(record: T): Promise<void> {
    const key = this.keyOf(record);
    if (this.records.has(key)) throw new Error(`Duplicate key: ${key}`);
    this.records.set(key, structuredClone(record));
  }

  async bulkAdd(records: readonly T[]): Promise<void> {
    for (const [index, record] of records.entries()) {
      await this.add(record);
      if (this.failBulkAddAfter !== null && index + 1 >= this.failBulkAddAfter) {
        throw new Error("Injected partial bulkAdd failure");
      }
    }
  }

  async put(record: T): Promise<void> {
    this.records.set(this.keyOf(record), structuredClone(record));
  }

  async get(key: Key): Promise<T | undefined> {
    return structuredClone(this.records.get(key));
  }

  async bulkGet(keys: readonly Key[]): Promise<(T | undefined)[]> {
    return Promise.all(keys.map((key) => this.get(key)));
  }

  async toArray(): Promise<T[]> {
    return this.dump();
  }

  async count(): Promise<number> {
    return this.countOverride ?? this.records.size;
  }

  dump(): T[] {
    return structuredClone([...this.records.values()]);
  }

  restore(records: readonly T[]): void {
    this.records = new Map(records.map((record) => [this.keyOf(record), structuredClone(record)]));
  }
}

class AtomicDatabaseHarness {
  beforeTransaction: (() => void) | null = null;
  readonly userWorks: FakeTable<UserWorkRecord>;
  readonly externalWorks: FakeTable<ExternalWorkRecord>;
  readonly profile: FakeTable<ProfileRecord>;
  readonly onboardingDraft: FakeTable<OnboardingDraft>;
  readonly recommendationCache: FakeTable<RecommendationCacheRecord>;
  readonly providerCache: FakeTable<ProviderCacheRecord>;
  readonly meta: FakeTable<MetaRecord>;

  constructor(seed: {
    userWorks: UserWorkRecord[];
    externalWorks: ExternalWorkRecord[];
    profile: ProfileRecord[];
    onboardingDraft: OnboardingDraft[];
    recommendationCache: RecommendationCacheRecord[];
    providerCache: ProviderCacheRecord[];
    meta: MetaRecord[];
  }) {
    this.userWorks = new FakeTable((record) => record.workId, seed.userWorks);
    this.externalWorks = new FakeTable((record) => record.id, seed.externalWorks);
    this.profile = new FakeTable((record) => record.key, seed.profile);
    this.onboardingDraft = new FakeTable((record) => record.id, seed.onboardingDraft);
    this.recommendationCache = new FakeTable(
      (record) => record.inputHash,
      seed.recommendationCache,
    );
    this.providerCache = new FakeTable((record) => record.isbn, seed.providerCache);
    this.meta = new FakeTable((record) => record.key, seed.meta);
  }

  async transaction<T>(...args: unknown[]): Promise<T> {
    const operation = args.at(-1);
    if (typeof operation !== "function") throw new Error("Missing transaction operation");
    this.beforeTransaction?.();
    this.beforeTransaction = null;
    const before = this.dump();
    try {
      return await (operation as () => Promise<T>)();
    } catch (error) {
      this.restore(before);
      throw error;
    }
  }

  dump() {
    return {
      userWorks: this.userWorks.dump(),
      externalWorks: this.externalWorks.dump(),
      profile: this.profile.dump(),
      onboardingDraft: this.onboardingDraft.dump(),
      recommendationCache: this.recommendationCache.dump(),
      providerCache: this.providerCache.dump(),
      meta: this.meta.dump(),
    };
  }

  restore(snapshot: ReturnType<AtomicDatabaseHarness["dump"]>): void {
    this.userWorks.restore(snapshot.userWorks);
    this.externalWorks.restore(snapshot.externalWorks);
    this.profile.restore(snapshot.profile);
    this.onboardingDraft.restore(snapshot.onboardingDraft);
    this.recommendationCache.restore(snapshot.recommendationCache);
    this.providerCache.restore(snapshot.providerCache);
    this.meta.restore(snapshot.meta);
  }
}

function externalRecord(): ExternalWorkRecord {
  return {
    id: EXTERNAL_ID,
    normalizedKey: '["きんぐだむ","原 泰久"]',
    title: "キングダム 1",
    creators: ["原 泰久"],
    isbnSamples: ["9784091855312"],
    record: { workId: EXTERNAL_ID, readingState: "planned", updatedAt: UPDATED_AT },
  };
}

function draft(): OnboardingDraft {
  return {
    id: "current",
    mode: "firstRun",
    step: 1,
    positiveEntries: [{ workId: "new-one", reaction: "liked" }],
    negativeEntries: [],
    updatedAt: UPDATED_AT,
  };
}

function cacheRecord(): RecommendationCacheRecord {
  return {
    schemaVersion: 1,
    engineVersion: "taste-v1",
    inputHash: "a".repeat(64),
    plan: [],
    computedAt: UPDATED_AT,
  };
}

function providerRecord(): ProviderCacheRecord {
  return {
    workId: "old",
    provider: "rakuten",
    isbn: "9784091855312",
    fetchedAt: "2026-08-14T01:00:00.000Z",
    commercialExpiresAt: "2026-08-15T01:00:00.000Z",
    metadataExpiresAt: "2026-11-12T01:00:00.000Z",
  };
}

function harness() {
  const oldWork: UserWorkRecord = {
    workId: "old",
    readingState: "completed",
    reaction: "favorite",
    updatedAt: UPDATED_AT,
  };
  const database = new AtomicDatabaseHarness({
    userWorks: [oldWork],
    externalWorks: [externalRecord()],
    profile: [
      { key: "adjustments", value: { axes: {}, themes: {} } },
      {
        key: "policies",
        value: {
          preferCompleted: false,
          preferHidden: false,
          preferVerified: false,
          excludeIncomplete: false,
        },
      },
      { key: "onboardingCompletedAt", value: UPDATED_AT },
    ],
    onboardingDraft: [draft()],
    recommendationCache: [cacheRecord()],
    providerCache: [providerRecord()],
    meta: [
      { key: "schemaVersion", value: 2 },
      { key: "catalogVersion", value: "old-catalog" },
    ],
  });
  return {
    database,
    backend: new DexiePersistenceBackend(database as unknown as KonocomicsDatabase),
  };
}

function replacementSnapshot(): UserDataSnapshot {
  return {
    userWorks: [
      { workId: "new-one", readingState: "completed", reaction: "liked", updatedAt: UPDATED_AT },
    ],
    externalWorks: [externalRecord()],
    profile: {
      adjustments: { axes: { pacing: "like" }, themes: {} },
      policies: {
        preferCompleted: true,
        preferHidden: true,
        preferVerified: true,
        excludeIncomplete: true,
      },
      onboardingCompletedAt: null,
    },
    onboardingDraft: draft(),
  };
}

describe("Dexie data-sovereignty transactions", () => {
  it("rolls back every store when a partial replacement write fails", async () => {
    const { backend, database } = harness();
    const before = database.dump();
    database.profile.failBulkAddAfter = 1;

    await expect(backend.replaceUserData(replacementSnapshot(), RUNTIME_META)).rejects.toThrow(
      "Injected partial bulkAdd failure",
    );
    expect(database.dump()).toEqual(before);
  });

  it("commits replacement only after exact rows, cleared caches, and metadata read back", async () => {
    const { backend, database } = harness();

    await expect(backend.replaceUserData(replacementSnapshot(), RUNTIME_META)).resolves.toEqual({
      counts: {
        userWorks: 1,
        externalWorks: 1,
        profile: 2,
        onboardingDraft: 1,
        recommendationCache: 0,
        providerCache: 0,
      },
      meta: RUNTIME_META,
    });
    expect(database.dump()).toEqual({
      userWorks: replacementSnapshot().userWorks,
      externalWorks: replacementSnapshot().externalWorks,
      profile: [
        { key: "adjustments", value: replacementSnapshot().profile.adjustments },
        { key: "policies", value: replacementSnapshot().profile.policies },
      ],
      onboardingDraft: [draft()],
      recommendationCache: [],
      providerCache: [],
      meta: [
        { key: "schemaVersion", value: 2 },
        { key: "catalogVersion", value: "catalog-current" },
      ],
    });
  });

  it("rolls delete back when the authoritative empty-store readback cannot be proven", async () => {
    const { backend, database } = harness();
    const before = database.dump();
    database.userWorks.countOverride = 1;

    await expect(backend.clearAllData(RUNTIME_META)).rejects.toThrow(
      "Authoritative deletion store counts readback failed",
    );
    expect(database.dump()).toEqual(before);
  });
});

describe.each(["indexeddb", "memory"] as const)("%s stale user-work writes", (mode) => {
  it("preserves newer records against stale additions and conditional feedback", async () => {
    const backend = mode === "indexeddb" ? harness().backend : new MemoryPersistenceBackend();
    const latest: UserWorkRecord = {
      workId: "shared-work",
      readingState: "completed",
      reaction: "favorite",
      progress: { volume: 7 },
      positiveReasons: ["characters"],
      updatedAt: "2026-08-15T10:00:00+09:00",
    };
    await backend.upsertUserWork(latest);
    const planned: UserWorkRecord = {
      workId: latest.workId,
      readingState: "planned",
      updatedAt: UPDATED_AT,
    };
    expect(await backend.addUserWorkIfAbsent(planned)).toEqual({
      kind: "already-exists",
      record: latest,
    });
    for (const expected of [null, UPDATED_AT]) {
      await expect(
        backend.upsertUserWork({ ...planned, readingState: "hidden" }, expected),
      ).rejects.toBeInstanceOf(UserWorkConflictError);
    }
    expect(await backend.getUserWorks()).toContainEqual(latest);
    const updated = {
      ...latest,
      reaction: "liked" as const,
      updatedAt: "2026-08-16T10:00:00+09:00",
    };
    expect(await backend.upsertUserWork(updated, latest.updatedAt)).toEqual(updated);
    await expect(backend.upsertUserWork(planned, latest.updatedAt)).rejects.toBeInstanceOf(
      UserWorkConflictError,
    );
    expect(await backend.getUserWorks()).toContainEqual(updated);
    const newWork = { ...planned, workId: "absent-work" };
    expect(await backend.upsertUserWork(newWork, null)).toEqual(newWork);
    await expect(backend.upsertUserWork(newWork, null)).rejects.toBeInstanceOf(
      UserWorkConflictError,
    );
  });
});

describe("atomic onboarding eligibility", () => {
  const existing: UserWorkRecord[] = Array.from({ length: 4 }, (_, index) => ({
    workId: `existing-${String(index)}`,
    readingState: "reading",
    reaction: "liked",
    updatedAt: UPDATED_AT,
  }));
  const confirmedDraft: OnboardingDraft = {
    id: "current",
    mode: "firstRun",
    step: 2,
    positiveEntries: [{ workId: "new-one", reaction: "liked", readingState: "reading" }],
    negativeEntries: [],
    updatedAt: UPDATED_AT,
  };
  const profileWorkIds = [...existing.map((record) => record.workId), "new-one"];

  it.each(["delete", "downgrade"] as const)(
    "checks the current rows inside the write transaction after another tab's %s",
    async (change) => {
      const { database, backend } = harness();
      database.profile.restore([]);
      database.userWorks.restore(existing);
      database.onboardingDraft.restore([confirmedDraft]);
      expect(await backend.getUserWorks()).toHaveLength(4);
      const concurrentRecords =
        change === "delete"
          ? existing.slice(1)
          : existing.map((record, index) =>
              index === 0 ? { ...record, reaction: "neutral" as const } : record,
            );
      database.beforeTransaction = () => database.userWorks.restore(concurrentRecords);
      await expect(
        backend.commitOnboarding(confirmedDraft, UPDATED_AT, profileWorkIds),
      ).rejects.toBeInstanceOf(OnboardingInsufficientPositiveWorksError);
      expect(database.userWorks.dump()).toEqual(concurrentRecords);
      expect(database.profile.dump()).toEqual([]);
      expect(database.onboardingDraft.dump()).toEqual([confirmedDraft]);
    },
  );

  it("commits four current eligible positives and one new work atomically", async () => {
    const { database, backend } = harness();
    database.profile.restore([]);
    database.userWorks.restore(existing);
    database.onboardingDraft.restore([confirmedDraft]);
    const records = await backend.commitOnboarding(confirmedDraft, UPDATED_AT, profileWorkIds);
    expect(records).toHaveLength(5);
    expect(database.userWorks.dump()).toEqual(records);
    expect(database.profile.dump()).toEqual([{ key: "onboardingCompletedAt", value: UPDATED_AT }]);
    expect(database.onboardingDraft.dump()).toEqual([]);
  });

  it("rejects an ineligible new positive and preserves memory records and draft", async () => {
    const backend = new MemoryPersistenceBackend();
    backend.synchronizeUserWorks(existing);
    await backend.setOnboardingDraft(confirmedDraft);
    await expect(
      backend.commitOnboarding(
        confirmedDraft,
        UPDATED_AT,
        existing.map((record) => record.workId),
      ),
    ).rejects.toBeInstanceOf(OnboardingInsufficientPositiveWorksError);
    expect(await backend.getUserWorks()).toEqual(existing);
    expect(await backend.getOnboardingDraft()).toEqual(confirmedDraft);
    expect(await backend.getOnboardingCompletedAt()).toBeNull();
  });
});
