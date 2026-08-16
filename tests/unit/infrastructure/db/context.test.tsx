// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect, useState } from "react";
import { afterEach, describe, expect, it } from "vitest";

import type { OnboardingDraft } from "@/domain/profile/onboarding";
import type { ExternalWorkId } from "@/domain/catalog/external-work";
import type {
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";
import { PersistenceProvider, usePersistence } from "@/infrastructure/db/context";
import type { Persistence, PersistenceStatus } from "@/infrastructure/db/persistence";
import {
  createExportFileV1,
  inspectExportFileV1,
  inspectExportJsonV1,
  type CurrentCatalogIdentity,
  type DataMutationResult,
  type ExportFileV1,
  type ImportPreviewV1,
} from "@/infrastructure/db/export-v1";
import type {
  ExternalWorkRecord,
  ProviderCacheRecord,
  RecommendationCacheRecord,
} from "@/infrastructure/db/records";
import type {
  AddIfAbsentResult,
  ExternalWorkRemovalResult,
  MinimalPlannedRemovalResult,
} from "@/infrastructure/db/backend";
import { isMinimalPlannedUserWork } from "@/infrastructure/db/validation";

const UPDATED_AT = "2026-08-14T10:00:00+09:00";
const INPUT_HASH = "b".repeat(64);
const ISBN = "9784091855312";
const EXTERNAL_ID =
  "ext:rakuten:v1:ebbfe45c6734e41f113df7284b2e63fbdef2d285229e699a5109e835a26b88b6" as const;
const CURRENT_CATALOG = {
  catalogVersion: "catalog-current",
  workIds: ["one", "two", "three", "four", "five"],
} as const;

function createExternalRecord(): ExternalWorkRecord {
  return {
    id: EXTERNAL_ID,
    normalizedKey: '["きんぐだむ","原 泰久"]',
    title: "キングダム 1",
    creators: ["原 泰久"],
    isbnSamples: [ISBN],
    record: {
      workId: EXTERNAL_ID,
      readingState: "planned",
      updatedAt: UPDATED_AT,
    },
  };
}

const DEFAULT_POLICIES: RecommendationPolicies = {
  preferCompleted: false,
  preferHidden: false,
  preferVerified: false,
  excludeIncomplete: false,
};

function createCacheRecord(): RecommendationCacheRecord {
  return {
    schemaVersion: 1,
    engineVersion: "taste-v1",
    inputHash: INPUT_HASH,
    plan: [
      {
        workId: "recommended-work",
        tasteScore: 0.84,
        confidence: 0.72,
        confidenceLevel: "normal",
        bestAnchorId: "one",
        contributions: [],
        penaltiesApplied: [],
        isDiscovery: false,
        majorThemeKey: "adventure",
        seriesGroupId: "recommended-work",
      },
    ],
    computedAt: UPDATED_AT,
  };
}

function createProviderRecord(): ProviderCacheRecord {
  return {
    workId: "provider-work",
    provider: "rakuten",
    isbn: ISBN,
    itemUrl: "https://books.rakuten.co.jp/rb/provider-work/",
    itemCaption: "Provider caption",
    itemPrice: 770,
    availability: 1,
    fetchedAt: "2026-08-14T01:00:00.000Z",
    commercialExpiresAt: "2026-08-15T01:00:00.000Z",
    metadataExpiresAt: "2026-11-12T01:00:00.000Z",
  };
}

function positiveRecords(workIds: readonly string[]): UserWorkRecord[] {
  return workIds.map((workId, index) => ({
    workId,
    readingState: "completed",
    reaction: index === 0 ? "favorite" : "liked",
    updatedAt: UPDATED_AT,
  }));
}

class TestPersistence implements Persistence {
  readonly calls: string[] = [];
  indeterminateOperation: "replace" | "delete" | null = null;
  savedAdjustments: ProfileAdjustments | null = null;
  savedPolicies: RecommendationPolicies | null = null;
  savedUserWork: UserWorkRecord | null = null;
  savedCache: RecommendationCacheRecord | null = null;
  savedProviderCache: ProviderCacheRecord | null = null;
  savedExternalWork: ExternalWorkRecord | null = null;
  private cache = new Map<string, RecommendationCacheRecord>();
  private providerCache = new Map<string, ProviderCacheRecord>();
  private externalWorks = new Map<string, ExternalWorkRecord>();

  constructor(
    private records: UserWorkRecord[],
    private profileAdjustments: ProfileAdjustments,
    private completedAt: string | null,
    private recommendationPolicies: RecommendationPolicies = DEFAULT_POLICIES,
  ) {}

  async initialize(): Promise<void> {
    this.calls.push("initialize");
  }

  getStatus(): PersistenceStatus {
    return { state: "ready", mode: "indexeddb", warning: null };
  }

  subscribe(): () => void {
    return () => undefined;
  }

  async getOnboardingDraft(): Promise<OnboardingDraft | null> {
    this.calls.push("getOnboardingDraft");
    return null;
  }

  async saveOnboardingDraft(): Promise<void> {
    return undefined;
  }

  async clearOnboardingDraft(): Promise<void> {
    return undefined;
  }

  async finalizeOnboarding(): Promise<void> {
    return undefined;
  }

  async getUserWorks(): Promise<UserWorkRecord[]> {
    this.calls.push("getUserWorks");
    return structuredClone(this.records);
  }

  async addUserWorkIfAbsent(record: UserWorkRecord): Promise<AddIfAbsentResult<UserWorkRecord>> {
    const existing = this.records.find((candidate) => candidate.workId === record.workId);
    if (existing !== undefined) {
      return { kind: "already-exists", record: structuredClone(existing) };
    }
    this.records.push(structuredClone(record));
    return { kind: "added", record: structuredClone(record) };
  }

  async saveUserWork(record: UserWorkRecord): Promise<UserWorkRecord> {
    this.savedUserWork = structuredClone(record);
    const recordsById = new Map(this.records.map((candidate) => [candidate.workId, candidate]));
    recordsById.set(record.workId, structuredClone(record));
    this.records = [...recordsById.values()];
    return structuredClone(record);
  }

  async removeMinimalPlannedUserWork(workId: string): Promise<MinimalPlannedRemovalResult> {
    this.calls.push("removeMinimalPlannedUserWork");
    const current = this.records.find((record) => record.workId === workId);
    if (current === undefined) return "already-absent";
    if (!isMinimalPlannedUserWork(current)) return "preserved-conflict";

    this.records = this.records.filter((record) => record.workId !== workId);
    return "removed";
  }

  async getExternalWorks(): Promise<ExternalWorkRecord[]> {
    this.calls.push("getExternalWorks");
    return structuredClone([...this.externalWorks.values()]);
  }

  async inspectExternalWork(id: typeof EXTERNAL_ID) {
    this.calls.push("inspectExternalWork");
    const record = this.externalWorks.get(id);
    return record === undefined
      ? ({ kind: "missing" } as const)
      : ({ kind: "found", record: structuredClone(record) } as const);
  }

  async addExternalWorkIfAbsent(
    record: ExternalWorkRecord,
  ): Promise<AddIfAbsentResult<ExternalWorkRecord>> {
    const existing = this.externalWorks.get(record.id);
    if (existing !== undefined) {
      return { kind: "already-exists", record: structuredClone(existing) };
    }
    this.externalWorks.set(record.id, structuredClone(record));
    return { kind: "added", record: structuredClone(record) };
  }

  async saveExternalUserRecord(
    id: ExternalWorkId,
    expectedNormalizedKey: string,
    record: UserWorkRecord,
  ): Promise<ExternalWorkRecord> {
    const current = this.externalWorks.get(id);
    if (current === undefined) throw new Error("External work is missing");
    if (current.normalizedKey !== expectedNormalizedKey) {
      throw new Error("External work identity changed");
    }
    const updated = { ...current, record: structuredClone(record) };
    this.savedExternalWork = structuredClone(updated);
    this.externalWorks.set(id, structuredClone(updated));
    return structuredClone(updated);
  }

  async removeExternalWork(id: string): Promise<ExternalWorkRemovalResult> {
    if (!this.externalWorks.has(id)) return "already-absent";
    this.externalWorks.delete(id);
    return "removed";
  }

  replaceUserWork(record: UserWorkRecord): void {
    const recordsById = new Map(this.records.map((candidate) => [candidate.workId, candidate]));
    recordsById.set(record.workId, structuredClone(record));
    this.records = [...recordsById.values()];
  }

  async getProfileAdjustments(): Promise<ProfileAdjustments> {
    this.calls.push("getProfileAdjustments");
    return structuredClone(this.profileAdjustments);
  }

  async saveProfileAdjustments(adjustments: ProfileAdjustments): Promise<void> {
    this.savedAdjustments = structuredClone(adjustments);
    this.profileAdjustments = structuredClone(adjustments);
  }

  async getPolicies(): Promise<RecommendationPolicies> {
    this.calls.push("getPolicies");
    return structuredClone(this.recommendationPolicies);
  }

  async savePolicies(policies: RecommendationPolicies): Promise<void> {
    this.savedPolicies = structuredClone(policies);
    this.recommendationPolicies = structuredClone(policies);
  }

  async getRecommendationCache(inputHash: string): Promise<RecommendationCacheRecord | null> {
    this.calls.push("getRecommendationCache");
    return structuredClone(this.cache.get(inputHash) ?? null);
  }

  async saveRecommendationCache(record: RecommendationCacheRecord): Promise<void> {
    this.savedCache = structuredClone(record);
    this.cache.set(record.inputHash, structuredClone(record));
  }

  async getProviderCache(isbn: string): Promise<ProviderCacheRecord | null> {
    this.calls.push("getProviderCache");
    return structuredClone(this.providerCache.get(isbn) ?? null);
  }

  async saveProviderCache(record: ProviderCacheRecord): Promise<ProviderCacheRecord> {
    this.savedProviderCache = structuredClone(record);
    this.providerCache.set(record.isbn, structuredClone(record));
    return structuredClone(record);
  }

  async getOnboardingCompletedAt(): Promise<string | null> {
    this.calls.push("getOnboardingCompletedAt");
    return this.completedAt;
  }

  async exportUserData(
    exportedAt: string,
    currentCatalog: CurrentCatalogIdentity,
  ): Promise<ExportFileV1> {
    return createExportFileV1(
      {
        userWorks: this.records,
        externalWorks: [...this.externalWorks.values()],
        profile: {
          adjustments: this.profileAdjustments,
          policies: this.recommendationPolicies,
          onboardingCompletedAt: this.completedAt,
        },
        onboardingDraft: null,
      },
      exportedAt,
      currentCatalog.catalogVersion,
    );
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
    if (this.indeterminateOperation === "replace") {
      return { kind: "indeterminate", operation: "replace", recovery: "reload" };
    }
    const preview = await inspectExportFileV1(file, currentCatalog);
    this.records = structuredClone(preview.file.userWorks);
    this.externalWorks = new Map(
      preview.file.externalWorks.map((record) => [record.id, structuredClone(record)]),
    );
    this.profileAdjustments = structuredClone(preview.file.profile.adjustments);
    this.recommendationPolicies = structuredClone(preview.file.profile.policies);
    this.completedAt = preview.file.profile.onboardingCompletedAt;
    this.cache.clear();
    this.providerCache.clear();
    return {
      kind: "applied",
      mode: "indexeddb",
      readback: {
        counts: {
          userWorks: this.records.length,
          externalWorks: this.externalWorks.size,
          profile: 2 + (this.completedAt === null ? 0 : 1),
          onboardingDraft: preview.file.onboardingDraft === null ? 0 : 1,
          recommendationCache: 0,
          providerCache: 0,
        },
        meta: { schemaVersion: 2, catalogVersion: currentCatalog.catalogVersion },
      },
    };
  }

  async deleteAllData(currentCatalogVersion: string): Promise<DataMutationResult> {
    if (this.indeterminateOperation === "delete") {
      return { kind: "indeterminate", operation: "delete", recovery: "reload" };
    }
    this.records = [];
    this.externalWorks.clear();
    this.profileAdjustments = { axes: {}, themes: {} };
    this.recommendationPolicies = structuredClone(DEFAULT_POLICIES);
    this.completedAt = null;
    this.cache.clear();
    this.providerCache.clear();
    return {
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
        meta: { schemaVersion: 2, catalogVersion: currentCatalogVersion },
      },
    };
  }

  close(): void {
    return undefined;
  }
}

class DeferredRefreshPersistence extends TestPersistence {
  private releaseExternalWorksRead: () => void = () => undefined;
  private readonly externalWorksReady = new Promise<void>((resolvePromise) => {
    this.releaseExternalWorksRead = resolvePromise;
  });

  releaseRefresh() {
    this.releaseExternalWorksRead();
  }

  override async getExternalWorks(): Promise<ExternalWorkRecord[]> {
    this.calls.push("getExternalWorks");
    await this.externalWorksReady;
    return [];
  }
}

class DeferredAtomicRefreshPersistence extends TestPersistence {
  private pendingExternalWorksRead:
    | {
        promise: Promise<void>;
        release(): void;
      }
    | undefined;

  deferNextExternalWorksRead(): () => void {
    let release: () => void = () => undefined;
    const promise = new Promise<void>((resolvePromise) => {
      release = resolvePromise;
    });
    this.pendingExternalWorksRead = { promise, release };
    return () => release();
  }

  override async getExternalWorks(): Promise<ExternalWorkRecord[]> {
    const records = await super.getExternalWorks();
    const pendingRead = this.pendingExternalWorksRead;
    if (pendingRead !== undefined) {
      this.pendingExternalWorksRead = undefined;
      await pendingRead.promise;
    }
    return records;
  }
}

function PersistenceProbe() {
  const {
    adjustments,
    getProviderCache,
    getRecommendationCache,
    hasProfile,
    policies,
    removeMinimalPlannedUserWork,
    savePolicies,
    saveProviderCache,
    saveProfileAdjustments,
    saveRecommendationCache,
    saveUserWork,
    userWorks,
  } = usePersistence();
  const [cachedWorkId, setCachedWorkId] = useState("");
  const [providerCaption, setProviderCaption] = useState("");
  const [removalResult, setRemovalResult] = useState("");

  return (
    <>
      <output data-testid="has-profile">{String(hasProfile)}</output>
      <output data-testid="work-count">{String(userWorks?.length)}</output>
      <output data-testid="work-states">
        {JSON.stringify(userWorks?.map(({ readingState, workId }) => ({ readingState, workId })))}
      </output>
      <output data-testid="removal-result">{removalResult}</output>
      <output data-testid="adjustments">{JSON.stringify(adjustments)}</output>
      <output data-testid="policies">{JSON.stringify(policies)}</output>
      <output data-testid="cached-work-id">{cachedWorkId}</output>
      <output data-testid="provider-caption">{providerCaption}</output>
      <button
        type="button"
        onClick={() =>
          void saveProfileAdjustments({
            axes: { pacing: "exclude" },
            themes: { cooking: "like" },
          })
        }
      >
        save adjustments
      </button>
      <button
        type="button"
        onClick={() => void removeMinimalPlannedUserWork("new-work").then(setRemovalResult)}
      >
        delete work
      </button>
      <button
        type="button"
        onClick={() =>
          void savePolicies({
            preferCompleted: true,
            preferHidden: false,
            preferVerified: true,
            excludeIncomplete: false,
          })
        }
      >
        save policies
      </button>
      <button type="button" onClick={() => void saveProviderCache(createProviderRecord())}>
        save provider cache
      </button>
      <button
        type="button"
        onClick={() =>
          void getProviderCache(ISBN).then((record) => {
            setProviderCaption(record?.itemCaption ?? "");
          })
        }
      >
        load provider cache
      </button>
      <button
        type="button"
        onClick={() =>
          void saveUserWork({
            workId: "new-work",
            readingState: "planned",
            updatedAt: UPDATED_AT,
          })
        }
      >
        save work
      </button>
      <button type="button" onClick={() => void saveRecommendationCache(createCacheRecord())}>
        save cache
      </button>
      <button
        type="button"
        onClick={() =>
          void getRecommendationCache(INPUT_HASH).then((record) => {
            setCachedWorkId(record?.plan[0]?.workId ?? "");
          })
        }
      >
        load cache
      </button>
    </>
  );
}

function ExternalPersistenceProbe() {
  const {
    addExternalWorkIfAbsent,
    externalWorks,
    inspectExternalWork,
    removeExternalWork,
    saveExternalUserRecord,
  } = usePersistence();
  const [loadedTitle, setLoadedTitle] = useState("");
  const [removalResult, setRemovalResult] = useState("");

  return (
    <>
      <output data-testid="external-count">{String(externalWorks?.length)}</output>
      <output data-testid="external-title">{loadedTitle}</output>
      <output data-testid="external-removal-result">{removalResult}</output>
      <button type="button" onClick={() => void addExternalWorkIfAbsent(createExternalRecord())}>
        add external work
      </button>
      <button
        type="button"
        onClick={() =>
          void saveExternalUserRecord(EXTERNAL_ID, createExternalRecord().normalizedKey, {
            workId: EXTERNAL_ID,
            readingState: "completed",
            reaction: "liked",
            updatedAt: UPDATED_AT,
          })
        }
      >
        save external user record
      </button>
      <button
        type="button"
        onClick={() =>
          void inspectExternalWork(EXTERNAL_ID).then((result) =>
            setLoadedTitle(result.kind === "found" ? result.record.title : ""),
          )
        }
      >
        load external work
      </button>
      <button
        type="button"
        onClick={() => void removeExternalWork(EXTERNAL_ID).then(setRemovalResult)}
      >
        remove external work
      </button>
    </>
  );
}

function DataSovereigntyProbe({
  file,
  onSnapshot,
}: Readonly<{ file: ExportFileV1; onSnapshot?: (snapshot: string) => void }>) {
  const {
    adjustments,
    deleteAllData,
    exportUserData,
    externalWorks,
    inspectImportJson,
    onboardingCompletedAt,
    onboardingDraft,
    policies,
    replaceFromExport,
    userWorks,
  } = usePersistence();
  const [lastResult, setLastResult] = useState("");
  const [previewCount, setPreviewCount] = useState("");
  const snapshot = JSON.stringify({
    adjustments: adjustments ?? null,
    completedAt: onboardingCompletedAt === undefined ? "unresolved" : onboardingCompletedAt,
    draft: onboardingDraft === undefined ? "unresolved" : onboardingDraft,
    externalWorkIds: externalWorks?.map((record) => record.id) ?? null,
    policies: policies ?? null,
    userWorkIds: userWorks?.map((record) => record.workId) ?? null,
  });

  useEffect(() => {
    onSnapshot?.(snapshot);
  }, [onSnapshot, snapshot]);

  return (
    <>
      <output data-testid="transfer-work-count">{String(userWorks?.length)}</output>
      <output data-testid="transfer-result">{lastResult}</output>
      <output data-testid="preview-count">{previewCount}</output>
      <output data-testid="transfer-snapshot">{snapshot}</output>
      <button
        type="button"
        onClick={() =>
          void replaceFromExport(file, CURRENT_CATALOG).then((result) => setLastResult(result.kind))
        }
      >
        replace data
      </button>
      <button
        type="button"
        onClick={() =>
          void exportUserData(UPDATED_AT, CURRENT_CATALOG)
            .then((exported) => inspectImportJson(JSON.stringify(exported), CURRENT_CATALOG))
            .then((preview) => setPreviewCount(String(preview.workCount)))
        }
      >
        preview export
      </button>
      <button
        type="button"
        onClick={() =>
          void deleteAllData(CURRENT_CATALOG.catalogVersion).then((result) =>
            setLastResult(result.kind),
          )
        }
      >
        delete all data
      </button>
    </>
  );
}

afterEach(cleanup);

describe("PersistenceProvider profile state", () => {
  it("publishes authoritative user works before unrelated stores finish refreshing", async () => {
    const persistence = new DeferredRefreshPersistence(
      positiveRecords(["one", "two", "three", "four", "five"]),
      { axes: { progression: "like" }, themes: {} },
      UPDATED_AT,
    );

    render(
      <PersistenceProvider persistence={persistence}>
        <PersistenceProbe />
      </PersistenceProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("has-profile").textContent).toBe("true");
      expect(screen.getByTestId("work-count").textContent).toBe("5");
    });
    expect(screen.getByTestId("adjustments").textContent).toBe("");

    persistence.releaseRefresh();
    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId("adjustments").textContent ?? "null")).toEqual({
        axes: { progression: "like" },
        themes: {},
      });
    });
  });

  it("warms existing profile state before adjustments, exposes it, and saves adjustments", async () => {
    const persistence = new TestPersistence(
      positiveRecords(["one", "two", "three", "four", "five"]),
      { axes: { progression: "like" }, themes: { adventure: "less" } },
      null,
    );

    render(
      <PersistenceProvider persistence={persistence}>
        <PersistenceProbe />
      </PersistenceProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("has-profile").textContent).toBe("true");
      expect(screen.getByTestId("work-count").textContent).toBe("5");
    });
    expect(JSON.parse(screen.getByTestId("adjustments").textContent ?? "null")).toEqual({
      axes: { progression: "like" },
      themes: { adventure: "less" },
    });
    expect(persistence.calls).toEqual([
      "initialize",
      "getUserWorks",
      "getExternalWorks",
      "getOnboardingDraft",
      "getOnboardingCompletedAt",
      "getProfileAdjustments",
      "getPolicies",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "save adjustments" }));

    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId("adjustments").textContent ?? "null")).toEqual({
        axes: { pacing: "exclude" },
        themes: { cooking: "like" },
      });
    });
    expect(persistence.savedAdjustments).toEqual({
      axes: { pacing: "exclude" },
      themes: { cooking: "like" },
    });
  });

  it("does not treat a completion marker or duplicate positive work ids as a profile", async () => {
    const persistence = new TestPersistence(
      positiveRecords(["one", "two", "three", "four", "four"]),
      { axes: {}, themes: {} },
      UPDATED_AT,
    );

    render(
      <PersistenceProvider persistence={persistence}>
        <PersistenceProbe />
      </PersistenceProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("has-profile").textContent).toBe("false");
    });
  });

  it("exposes policy, user-work, recommendation-cache, and provider-cache operations", async () => {
    const persistence = new TestPersistence(
      positiveRecords(["one", "two", "three", "four", "five"]),
      { axes: {}, themes: {} },
      UPDATED_AT,
    );

    render(
      <PersistenceProvider persistence={persistence}>
        <PersistenceProbe />
      </PersistenceProvider>,
    );

    await waitFor(() => {
      expect(JSON.parse(screen.getByTestId("policies").textContent ?? "null")).toEqual(
        DEFAULT_POLICIES,
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "save policies" }));
    fireEvent.click(screen.getByRole("button", { name: "save work" }));
    fireEvent.click(screen.getByRole("button", { name: "save cache" }));
    fireEvent.click(screen.getByRole("button", { name: "save provider cache" }));

    await waitFor(() => {
      expect(screen.getByTestId("work-count").textContent).toBe("6");
      expect(JSON.parse(screen.getByTestId("policies").textContent ?? "null")).toEqual({
        preferCompleted: true,
        preferHidden: false,
        preferVerified: true,
        excludeIncomplete: false,
      });
      expect(persistence.savedUserWork).toMatchObject({
        workId: "new-work",
        readingState: "planned",
      });
      expect(persistence.savedCache).toEqual(createCacheRecord());
      expect(persistence.savedProviderCache).toEqual(createProviderRecord());
    });

    fireEvent.click(screen.getByRole("button", { name: "load cache" }));

    await waitFor(() => {
      expect(screen.getByTestId("cached-work-id").textContent).toBe("recommended-work");
    });
    expect(persistence.calls).toContain("getRecommendationCache");

    fireEvent.click(screen.getByRole("button", { name: "load provider cache" }));
    await waitFor(() => {
      expect(screen.getByTestId("provider-caption").textContent).toBe("Provider caption");
    });

    fireEvent.click(screen.getByRole("button", { name: "delete work" }));
    await waitFor(() => {
      expect(screen.getByTestId("work-count").textContent).toBe("5");
      expect(screen.getByTestId("removal-result").textContent).toBe("removed");
    });
    expect(persistence.calls).toContain("getProviderCache");
  });

  it("returns a stale-tab conflict and refreshes the latest meaningful record", async () => {
    const persistence = new TestPersistence(
      [{ workId: "new-work", readingState: "planned", updatedAt: UPDATED_AT }],
      { axes: {}, themes: {} },
      UPDATED_AT,
    );

    render(
      <PersistenceProvider persistence={persistence}>
        <PersistenceProbe />
      </PersistenceProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("work-count").textContent).toBe("1");
    });
    persistence.replaceUserWork({
      workId: "new-work",
      readingState: "completed",
      reaction: "favorite",
      updatedAt: "2026-08-14T10:01:00+09:00",
    });

    fireEvent.click(screen.getByRole("button", { name: "delete work" }));

    await waitFor(() => {
      expect(screen.getByTestId("removal-result").textContent).toBe("preserved-conflict");
      expect(screen.getByTestId("work-count").textContent).toBe("1");
      expect(JSON.parse(screen.getByTestId("work-states").textContent ?? "null")).toEqual([
        { workId: "new-work", readingState: "completed" },
      ]);
    });
    expect(persistence.calls.slice(-2)).toEqual(["removeMinimalPlannedUserWork", "getUserWorks"]);
  });

  it("exposes external work CRUD and refreshes authoritative list state", async () => {
    const persistence = new TestPersistence([], { axes: {}, themes: {} }, UPDATED_AT);

    render(
      <PersistenceProvider persistence={persistence}>
        <ExternalPersistenceProbe />
      </PersistenceProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("external-count").textContent).toBe("0");
    });

    fireEvent.click(screen.getByRole("button", { name: "add external work" }));
    await waitFor(() => {
      expect(screen.getByTestId("external-count").textContent).toBe("1");
    });

    fireEvent.click(screen.getByRole("button", { name: "save external user record" }));
    await waitFor(() => {
      expect(persistence.savedExternalWork).toEqual({
        ...createExternalRecord(),
        record: {
          workId: EXTERNAL_ID,
          readingState: "completed",
          reaction: "liked",
          updatedAt: UPDATED_AT,
        },
      });
    });

    fireEvent.click(screen.getByRole("button", { name: "load external work" }));
    await waitFor(() => {
      expect(screen.getByTestId("external-title").textContent).toBe("キングダム 1");
    });

    fireEvent.click(screen.getByRole("button", { name: "remove external work" }));
    await waitFor(() => {
      expect(screen.getByTestId("external-count").textContent).toBe("0");
      expect(screen.getByTestId("external-removal-result").textContent).toBe("removed");
    });
  });

  it("publishes applied import and full-delete snapshots atomically after readback", async () => {
    const importedRecords = positiveRecords(CURRENT_CATALOG.workIds);
    const importedPolicies: RecommendationPolicies = {
      preferCompleted: true,
      preferHidden: true,
      preferVerified: true,
      excludeIncomplete: true,
    };
    const file = await createExportFileV1(
      {
        userWorks: importedRecords,
        externalWorks: [createExternalRecord()],
        profile: {
          adjustments: { axes: { pacing: "exclude" }, themes: { cooking: "like" } },
          policies: importedPolicies,
          onboardingCompletedAt: null,
        },
        onboardingDraft: null,
      },
      UPDATED_AT,
      "catalog-exported",
    );
    const persistence = new DeferredAtomicRefreshPersistence(
      [{ workId: "old", readingState: "planned", updatedAt: UPDATED_AT }],
      { axes: {}, themes: {} },
      UPDATED_AT,
    );
    const observedSnapshots: string[] = [];
    const oldSnapshot = JSON.stringify({
      adjustments: { axes: {}, themes: {} },
      completedAt: UPDATED_AT,
      draft: null,
      externalWorkIds: [],
      policies: DEFAULT_POLICIES,
      userWorkIds: ["old"],
    });
    const importedSnapshot = JSON.stringify({
      adjustments: { axes: { pacing: "exclude" }, themes: { cooking: "like" } },
      completedAt: null,
      draft: null,
      externalWorkIds: [EXTERNAL_ID],
      policies: importedPolicies,
      userWorkIds: [...CURRENT_CATALOG.workIds],
    });
    const deletedSnapshot = JSON.stringify({
      adjustments: { axes: {}, themes: {} },
      completedAt: null,
      draft: null,
      externalWorkIds: [],
      policies: DEFAULT_POLICIES,
      userWorkIds: [],
    });

    render(
      <PersistenceProvider persistence={persistence}>
        <DataSovereigntyProbe
          file={file}
          onSnapshot={(snapshot) => observedSnapshots.push(snapshot)}
        />
      </PersistenceProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("transfer-snapshot").textContent).toBe(oldSnapshot);
    });

    const releaseImportRefresh = persistence.deferNextExternalWorksRead();
    const snapshotsBeforeImport = observedSnapshots.length;
    fireEvent.click(screen.getByRole("button", { name: "replace data" }));
    await waitFor(() => {
      expect(persistence.calls.filter((call) => call === "getExternalWorks")).toHaveLength(2);
    });
    expect(screen.getByTestId("transfer-result").textContent).toBe("");
    expect(screen.getByTestId("transfer-snapshot").textContent).toBe(oldSnapshot);
    expect(observedSnapshots.slice(snapshotsBeforeImport)).toEqual([]);

    releaseImportRefresh();
    await waitFor(() => {
      expect(screen.getByTestId("transfer-result").textContent).toBe("applied");
      expect(screen.getByTestId("transfer-snapshot").textContent).toBe(importedSnapshot);
    });
    expect(observedSnapshots.slice(snapshotsBeforeImport)).toEqual([importedSnapshot]);

    fireEvent.click(screen.getByRole("button", { name: "preview export" }));
    await waitFor(() => {
      expect(screen.getByTestId("preview-count").textContent).toBe("6");
    });

    const releaseDeleteRefresh = persistence.deferNextExternalWorksRead();
    const snapshotsBeforeDelete = observedSnapshots.length;
    fireEvent.click(screen.getByRole("button", { name: "delete all data" }));
    await waitFor(() => {
      expect(persistence.calls.filter((call) => call === "getExternalWorks")).toHaveLength(3);
    });
    expect(screen.getByTestId("transfer-snapshot").textContent).toBe(importedSnapshot);
    expect(observedSnapshots.slice(snapshotsBeforeDelete)).toEqual([]);

    releaseDeleteRefresh();
    await waitFor(() => {
      expect(screen.getByTestId("transfer-snapshot").textContent).toBe(deletedSnapshot);
    });
    expect(observedSnapshots.slice(snapshotsBeforeDelete)).toEqual([deletedSnapshot]);
  });

  it("does not refresh a stale context snapshot after an indeterminate replacement", async () => {
    const file = await createExportFileV1(
      {
        userWorks: positiveRecords(CURRENT_CATALOG.workIds),
        externalWorks: [],
        profile: {
          adjustments: { axes: {}, themes: {} },
          policies: DEFAULT_POLICIES,
          onboardingCompletedAt: null,
        },
        onboardingDraft: null,
      },
      UPDATED_AT,
      "catalog-exported",
    );
    const persistence = new TestPersistence(
      [{ workId: "old", readingState: "planned", updatedAt: UPDATED_AT }],
      { axes: {}, themes: {} },
      UPDATED_AT,
    );
    persistence.indeterminateOperation = "replace";

    render(
      <PersistenceProvider persistence={persistence}>
        <DataSovereigntyProbe file={file} />
      </PersistenceProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("transfer-work-count").textContent).toBe("1");
    });
    const readsBefore = persistence.calls.filter((call) => call === "getUserWorks").length;
    fireEvent.click(screen.getByRole("button", { name: "replace data" }));
    await waitFor(() => {
      expect(screen.getByTestId("transfer-result").textContent).toBe("indeterminate");
    });
    expect(screen.getByTestId("transfer-work-count").textContent).toBe("1");
    expect(persistence.calls.filter((call) => call === "getUserWorks")).toHaveLength(readsBefore);
  });
});
