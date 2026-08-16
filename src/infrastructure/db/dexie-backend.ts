import type { OnboardingDraft } from "@/domain/profile/onboarding";
import type { ExternalWorkId } from "@/domain/catalog/external-work";
import type {
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";

import {
  OnboardingAlreadyCompletedError,
  OnboardingWorkConflictError,
  type ConfirmedAddIfAbsentResult,
  type MinimalPlannedRemovalResult,
  type OnboardingCommit,
  type PersistenceBackend,
} from "./backend";
import { DATABASE_SCHEMA_VERSION, KonocomicsDatabase } from "./database";
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
  mergeExternalWorkOnInsert,
} from "./external-work";
import type {
  ExternalWorkRecord,
  ProfileRecord,
  ProviderCacheRecord,
  RecommendationCacheRecord,
} from "./records";
import {
  isMinimalPlannedUserWork,
  parseExternalUserWorkRecord,
  parseExternalWork,
} from "./validation";

export class DexiePersistenceBackend implements PersistenceBackend {
  readonly mode = "indexeddb" as const;

  constructor(private readonly database = new KonocomicsDatabase()) {}

  async open(): Promise<void> {
    await this.database.open();
    await this.database.meta.put({ key: "schemaVersion", value: DATABASE_SCHEMA_VERSION });
  }

  async getOnboardingDraft(): Promise<OnboardingDraft | null> {
    return (await this.database.onboardingDraft.get("current")) ?? null;
  }

  async setOnboardingDraft(draft: OnboardingDraft | null): Promise<void> {
    if (draft === null) {
      await this.database.onboardingDraft.delete("current");
      return;
    }
    await this.database.onboardingDraft.put(draft);
  }

  async commitOnboarding(commit: OnboardingCommit): Promise<void> {
    if (commit.mode === "add") {
      await this.database.transaction(
        "rw",
        this.database.userWorks,
        this.database.onboardingDraft,
        async () => {
          const workIds = commit.userWorks.map((record) => record.workId);
          const existingRecords = await this.database.userWorks.bulkGet(workIds);
          const conflictIndex = existingRecords.findIndex((record) => record !== undefined);
          if (conflictIndex >= 0) {
            throw new OnboardingWorkConflictError(workIds[conflictIndex]!);
          }
          await this.database.userWorks.bulkAdd(commit.userWorks);
          await this.database.onboardingDraft.delete("current");
        },
      );
      return;
    }

    await this.database.transaction(
      "rw",
      this.database.userWorks,
      this.database.profile,
      this.database.onboardingDraft,
      async () => {
        const existingCompletion = await this.database.profile.get("onboardingCompletedAt");
        if (existingCompletion !== undefined) {
          throw new OnboardingAlreadyCompletedError();
        }
        const workIds = commit.userWorks.map((record) => record.workId);
        const existingRecords = await this.database.userWorks.bulkGet(workIds);
        const conflictIndex = existingRecords.findIndex((record) => record !== undefined);
        if (conflictIndex >= 0) {
          throw new OnboardingWorkConflictError(workIds[conflictIndex]!);
        }
        await this.database.userWorks.bulkAdd(commit.userWorks);
        await this.database.profile.put({
          key: "onboardingCompletedAt",
          value: commit.onboardingCompletedAt,
        });
        await this.database.onboardingDraft.delete("current");
      },
    );
  }

  async getUserWorks(): Promise<unknown[]> {
    return this.database.userWorks.toArray();
  }

  async addUserWorkIfAbsent(record: UserWorkRecord): Promise<ConfirmedAddIfAbsentResult<unknown>> {
    return this.database.transaction("rw", this.database.userWorks, async () => {
      const existing = await this.database.userWorks.get(record.workId);
      if (existing !== undefined) {
        return { kind: "already-exists", record: existing };
      }
      await this.database.userWorks.add(record);
      const stored = await this.database.userWorks.get(record.workId);
      if (stored === undefined) {
        throw new Error(`User work insert readback failed: ${record.workId}`);
      }
      return { kind: "added", record: stored };
    });
  }

  async upsertUserWork(record: UserWorkRecord): Promise<unknown> {
    return this.database.transaction("rw", this.database.userWorks, async () => {
      await this.database.userWorks.put(record);
      const stored = await this.database.userWorks.get(record.workId);
      if (stored === undefined) {
        throw new Error(`User work readback failed: ${record.workId}`);
      }
      return stored;
    });
  }

  async removeMinimalPlannedUserWork(workId: string): Promise<MinimalPlannedRemovalResult> {
    return this.database.transaction("rw", this.database.userWorks, async () => {
      const current = await this.database.userWorks.get(workId);
      if (current === undefined) return "already-absent";
      if (!isMinimalPlannedUserWork(current)) return "preserved-conflict";

      await this.database.userWorks.delete(workId);
      if ((await this.database.userWorks.get(workId)) !== undefined) {
        throw new Error(`User work deletion readback failed: ${workId}`);
      }
      return "removed";
    });
  }

  async getExternalWorks(): Promise<unknown[]> {
    return this.database.externalWorks.toArray();
  }

  async getExternalWork(id: string): Promise<unknown | null> {
    return (await this.database.externalWorks.get(id)) ?? null;
  }

  async addExternalWorkIfAbsent(
    record: ExternalWorkRecord,
  ): Promise<ConfirmedAddIfAbsentResult<unknown>> {
    return this.database.transaction("rw", this.database.externalWorks, async () => {
      const existing = await this.database.externalWorks.get(record.id);
      if (existing !== undefined) {
        let existingRecord: ExternalWorkRecord;
        try {
          existingRecord = parseExternalWork(existing);
        } catch {
          throw new ExternalWorkCorruptRecordError(record.id);
        }
        const merged = mergeExternalWorkOnInsert(existingRecord, parseExternalWork(record));
        if (
          merged.isbnSamples.length !== existing.isbnSamples.length ||
          merged.isbnSamples.some((isbn, index) => isbn !== existing.isbnSamples[index])
        ) {
          await this.database.externalWorks.put(merged);
        }
        const stored = await this.database.externalWorks.get(record.id);
        if (stored === undefined) {
          throw new Error(`External work merge readback failed: ${record.id}`);
        }
        return { kind: "already-exists", record: stored };
      }
      await this.database.externalWorks.add(record);
      const stored = await this.database.externalWorks.get(record.id);
      if (stored === undefined) {
        throw new Error(`External work insert readback failed: ${record.id}`);
      }
      return { kind: "added", record: stored };
    });
  }

  async saveExternalUserRecord(
    id: ExternalWorkId,
    expectedNormalizedKey: string,
    record: UserWorkRecord,
  ): Promise<unknown> {
    const validatedRecord = parseExternalUserWorkRecord(id, record);
    return this.database.transaction("rw", this.database.externalWorks, async () => {
      const current = await this.database.externalWorks.get(id);
      if (current === undefined) {
        throw new ExternalWorkNotFoundError(id);
      }

      let currentRecord: ExternalWorkRecord;
      try {
        currentRecord = parseExternalWork(current);
      } catch {
        throw new ExternalWorkCorruptRecordError(id);
      }
      if (currentRecord.normalizedKey !== expectedNormalizedKey) {
        throw new ExternalWorkIdentityConflictError(id);
      }

      await this.database.externalWorks.put({ ...currentRecord, record: validatedRecord });
      const stored = await this.database.externalWorks.get(id);
      if (stored === undefined) {
        throw new Error(`External work readback failed: ${id}`);
      }
      return stored;
    });
  }

  async removeExternalWork(id: string): Promise<"removed" | "already-absent"> {
    return this.database.transaction("rw", this.database.externalWorks, async () => {
      const current = await this.database.externalWorks.get(id);
      if (current === undefined) return "already-absent";
      await this.database.externalWorks.delete(id);
      if ((await this.database.externalWorks.get(id)) !== undefined) {
        throw new Error(`External work deletion readback failed: ${id}`);
      }
      return "removed";
    });
  }

  async getProfileAdjustments(): Promise<unknown | null> {
    const record = await this.database.profile.get("adjustments");
    return record?.key === "adjustments" ? record.value : null;
  }

  async setProfileAdjustments(adjustments: ProfileAdjustments): Promise<void> {
    await this.database.profile.put({ key: "adjustments", value: adjustments });
  }

  async getRecommendationPolicies(): Promise<unknown | null> {
    const record = await this.database.profile.get("policies");
    return record?.key === "policies" ? record.value : null;
  }

  async setRecommendationPolicies(policies: RecommendationPolicies): Promise<void> {
    await this.database.profile.put({ key: "policies", value: policies });
  }

  async getRecommendationCache(inputHash: string): Promise<unknown | null> {
    return (await this.database.recommendationCache.get(inputHash)) ?? null;
  }

  async setRecommendationCache(record: RecommendationCacheRecord): Promise<void> {
    await this.database.recommendationCache.put(record);
  }

  async getProviderCache(isbn: string): Promise<unknown | null> {
    return (await this.database.providerCache.get(isbn)) ?? null;
  }

  async upsertProviderCache(record: ProviderCacheRecord): Promise<unknown> {
    return this.database.transaction("rw", this.database.providerCache, async () => {
      await this.database.providerCache.put(record);
      const stored = await this.database.providerCache.get(record.isbn);
      if (stored === undefined) {
        throw new Error(`Provider cache readback failed: ${record.isbn}`);
      }
      return stored;
    });
  }

  async getOnboardingCompletedAt(): Promise<unknown | null> {
    const record = await this.database.profile.get("onboardingCompletedAt");
    return record?.key === "onboardingCompletedAt" ? record.value : null;
  }

  async readUserDataSnapshot(): Promise<RawUserDataSnapshot> {
    return this.database.transaction(
      "r",
      this.database.userWorks,
      this.database.externalWorks,
      this.database.profile,
      this.database.onboardingDraft,
      async () => {
        const [userWorks, externalWorks, adjustments, policies, completedAt, onboardingDraft] =
          await Promise.all([
            this.database.userWorks.toArray(),
            this.database.externalWorks.toArray(),
            this.database.profile.get("adjustments"),
            this.database.profile.get("policies"),
            this.database.profile.get("onboardingCompletedAt"),
            this.database.onboardingDraft.get("current"),
          ]);
        return {
          userWorks,
          externalWorks,
          profile: {
            adjustments: adjustments?.key === "adjustments" ? adjustments.value : null,
            policies: policies?.key === "policies" ? policies.value : null,
            onboardingCompletedAt:
              completedAt?.key === "onboardingCompletedAt" ? completedAt.value : null,
          },
          onboardingDraft: onboardingDraft ?? null,
        };
      },
    );
  }

  async replaceUserData(
    snapshot: UserDataSnapshot,
    runtimeMeta: RuntimeMetaV2,
  ): Promise<DataMutationReadback> {
    const validatedSnapshot = await validateUserDataSnapshot(snapshot);
    const validatedMeta = runtimeMetaV2(runtimeMeta.catalogVersion);
    const profileRows: ProfileRecord[] = [
      { key: "adjustments", value: validatedSnapshot.profile.adjustments },
      { key: "policies", value: validatedSnapshot.profile.policies },
      ...(validatedSnapshot.profile.onboardingCompletedAt === null
        ? []
        : [
            {
              key: "onboardingCompletedAt" as const,
              value: validatedSnapshot.profile.onboardingCompletedAt,
            },
          ]),
    ];

    return this.database.transaction(
      "rw",
      [
        this.database.userWorks,
        this.database.externalWorks,
        this.database.profile,
        this.database.onboardingDraft,
        this.database.recommendationCache,
        this.database.providerCache,
        this.database.meta,
      ],
      async () => {
        await Promise.all([
          this.database.userWorks.clear(),
          this.database.externalWorks.clear(),
          this.database.profile.clear(),
          this.database.onboardingDraft.clear(),
          this.database.recommendationCache.clear(),
          this.database.providerCache.clear(),
          this.database.meta.clear(),
        ]);

        await Promise.all([
          validatedSnapshot.userWorks.length === 0
            ? Promise.resolve()
            : this.database.userWorks.bulkAdd(validatedSnapshot.userWorks),
          validatedSnapshot.externalWorks.length === 0
            ? Promise.resolve()
            : this.database.externalWorks.bulkAdd(validatedSnapshot.externalWorks),
          this.database.profile.bulkAdd(profileRows),
          validatedSnapshot.onboardingDraft === null
            ? Promise.resolve()
            : this.database.onboardingDraft.add(validatedSnapshot.onboardingDraft),
          this.database.meta.bulkAdd([
            { key: "schemaVersion", value: validatedMeta.schemaVersion },
            { key: "catalogVersion", value: validatedMeta.catalogVersion },
          ]),
        ]);

        const [storedUserWorks, storedExternalWorks, storedProfile, storedDraft] =
          await Promise.all([
            this.database.userWorks.bulkGet(
              validatedSnapshot.userWorks.map((record) => record.workId),
            ),
            this.database.externalWorks.bulkGet(
              validatedSnapshot.externalWorks.map((record) => record.id),
            ),
            this.database.profile.bulkGet(profileRows.map((record) => record.key)),
            this.database.onboardingDraft.get("current"),
          ]);
        assertJsonReadback(storedUserWorks, validatedSnapshot.userWorks, "user works");
        assertJsonReadback(storedExternalWorks, validatedSnapshot.externalWorks, "external works");
        assertJsonReadback(storedProfile, profileRows, "profile");
        assertJsonReadback(storedDraft ?? null, validatedSnapshot.onboardingDraft, "draft");

        const readback = await this.readMutationReadback(validatedMeta);
        assertJsonReadback(
          readback.counts,
          {
            userWorks: validatedSnapshot.userWorks.length,
            externalWorks: validatedSnapshot.externalWorks.length,
            profile: profileRows.length,
            onboardingDraft: validatedSnapshot.onboardingDraft === null ? 0 : 1,
            recommendationCache: 0,
            providerCache: 0,
          },
          "replacement store counts",
        );
        return readback;
      },
    );
  }

  async clearAllData(runtimeMeta: RuntimeMetaV2): Promise<DataMutationReadback> {
    const validatedMeta = runtimeMetaV2(runtimeMeta.catalogVersion);
    return this.database.transaction(
      "rw",
      [
        this.database.userWorks,
        this.database.externalWorks,
        this.database.profile,
        this.database.onboardingDraft,
        this.database.recommendationCache,
        this.database.providerCache,
        this.database.meta,
      ],
      async () => {
        await Promise.all([
          this.database.userWorks.clear(),
          this.database.externalWorks.clear(),
          this.database.profile.clear(),
          this.database.onboardingDraft.clear(),
          this.database.recommendationCache.clear(),
          this.database.providerCache.clear(),
          this.database.meta.clear(),
        ]);
        await this.database.meta.bulkAdd([
          { key: "schemaVersion", value: validatedMeta.schemaVersion },
          { key: "catalogVersion", value: validatedMeta.catalogVersion },
        ]);
        const readback = await this.readMutationReadback(validatedMeta);
        assertJsonReadback(
          readback.counts,
          {
            userWorks: 0,
            externalWorks: 0,
            profile: 0,
            onboardingDraft: 0,
            recommendationCache: 0,
            providerCache: 0,
          },
          "deletion store counts",
        );
        return readback;
      },
    );
  }

  private async readMutationReadback(expectedMeta: RuntimeMetaV2): Promise<DataMutationReadback> {
    const [
      userWorks,
      externalWorks,
      profile,
      onboardingDraft,
      recommendationCache,
      providerCache,
      metaCount,
    ] = await Promise.all([
      this.database.userWorks.count(),
      this.database.externalWorks.count(),
      this.database.profile.count(),
      this.database.onboardingDraft.count(),
      this.database.recommendationCache.count(),
      this.database.providerCache.count(),
      this.database.meta.count(),
    ]);
    const [schemaVersion, catalogVersion] = await this.database.meta.bulkGet([
      "schemaVersion",
      "catalogVersion",
    ]);
    assertJsonReadback(
      [schemaVersion, catalogVersion],
      [
        { key: "schemaVersion", value: expectedMeta.schemaVersion },
        { key: "catalogVersion", value: expectedMeta.catalogVersion },
      ],
      "runtime metadata",
    );
    if (recommendationCache !== 0 || providerCache !== 0) {
      throw new Error("Cache clear readback failed");
    }
    if (metaCount !== 2) {
      throw new Error("Runtime metadata count readback failed");
    }
    return {
      counts: {
        userWorks,
        externalWorks,
        profile,
        onboardingDraft,
        recommendationCache,
        providerCache,
      },
      meta: expectedMeta,
    };
  }

  close(): void {
    this.database.close();
  }
}

function assertJsonReadback(actual: unknown, expected: unknown, label: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Authoritative ${label} readback failed`);
  }
}
