"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { restoreOnboardingDraft, type OnboardingDraft } from "@/domain/profile/onboarding";
import type {
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";
import type { ExternalWorkId } from "@/domain/catalog/external-work";

import {
  createPersistence,
  type ExternalWorkLookupResult,
  type Persistence,
  type PersistenceStatus,
} from "./persistence";
import type {
  AddIfAbsentResult,
  ExternalWorkRemovalResult,
  MinimalPlannedRemovalResult,
} from "./backend";
import type {
  CurrentCatalogIdentity,
  DataMutationResult,
  ExportFileV1,
  ImportPreviewV1,
} from "./export-v1";
import type { ExternalWorkRecord, ProviderCacheRecord, RecommendationCacheRecord } from "./records";
import { parseProfileAdjustments, parseRecommendationPolicies } from "./validation";

export type PersistenceContextValue = {
  status: PersistenceStatus;
  onboardingDraft: OnboardingDraft | null | undefined;
  onboardingCompletedAt: string | null | undefined;
  userWorks: UserWorkRecord[] | undefined;
  externalWorks: ExternalWorkRecord[] | undefined;
  adjustments: ProfileAdjustments | undefined;
  policies: RecommendationPolicies | undefined;
  hasProfile: boolean | undefined;
  refresh(): Promise<void>;
  saveOnboardingDraft(draft: OnboardingDraft): Promise<void>;
  clearOnboardingDraft(): Promise<void>;
  finalizeOnboarding(draft: OnboardingDraft, completedAt: string): Promise<void>;
  saveProfileAdjustments(adjustments: ProfileAdjustments): Promise<void>;
  savePolicies(policies: RecommendationPolicies): Promise<void>;
  addUserWorkIfAbsent(record: UserWorkRecord): Promise<AddIfAbsentResult<UserWorkRecord>>;
  saveUserWork(record: UserWorkRecord): Promise<UserWorkRecord>;
  removeMinimalPlannedUserWork(workId: string): Promise<MinimalPlannedRemovalResult>;
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
  getRecommendationCache(inputHash: string): Promise<RecommendationCacheRecord | null>;
  saveRecommendationCache(record: RecommendationCacheRecord): Promise<void>;
  getProviderCache(isbn: string): Promise<ProviderCacheRecord | null>;
  saveProviderCache(record: ProviderCacheRecord): Promise<ProviderCacheRecord>;
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
};

const PersistenceContext = createContext<PersistenceContextValue | null>(null);

type PersistenceProviderProps = Readonly<{
  children: ReactNode;
  persistence?: Persistence;
}>;

export function PersistenceProvider({ children, persistence }: PersistenceProviderProps) {
  const [service] = useState(() => persistence ?? createPersistence());
  const [status, setStatus] = useState<PersistenceStatus>(() => service.getStatus());
  const [onboardingDraft, setOnboardingDraft] = useState<OnboardingDraft | null>();
  const [onboardingCompletedAt, setOnboardingCompletedAt] = useState<string | null>();
  const [userWorks, setUserWorks] = useState<UserWorkRecord[]>();
  const [externalWorks, setExternalWorks] = useState<ExternalWorkRecord[]>();
  const [adjustments, setAdjustments] = useState<ProfileAdjustments>();
  const [policies, setPolicies] = useState<RecommendationPolicies>();

  const refresh = useCallback(async () => {
    const [records, nextExternalWorks, draft, completedAt, nextAdjustments, nextPolicies] =
      await Promise.all([
        service.getUserWorks(),
        service.getExternalWorks(),
        service.getOnboardingDraft(),
        service.getOnboardingCompletedAt(),
        service.getProfileAdjustments(),
        service.getPolicies(),
      ]);
    setUserWorks(records);
    setExternalWorks(nextExternalWorks);
    setAdjustments(nextAdjustments);
    setPolicies(nextPolicies);
    setOnboardingDraft(draft);
    setOnboardingCompletedAt(completedAt);
  }, [service]);

  useEffect(() => {
    let active = true;
    const unsubscribe = service.subscribe((nextStatus) => {
      if (active) {
        setStatus(nextStatus);
      }
    });

    const hydrate = async () => {
      await service.initialize();
      if (!active) return;

      // Route/profile ownership depends only on this authoritative store. Let
      // the landing guard resolve without waiting for unrelated stores while
      // preserving atomic all-store refreshes after Import and full deletion.
      const records = await service.getUserWorks();
      if (!active) return;
      setUserWorks(records);

      const [nextExternalWorks, draft, completedAt, nextAdjustments, nextPolicies] =
        await Promise.all([
          service.getExternalWorks(),
          service.getOnboardingDraft(),
          service.getOnboardingCompletedAt(),
          service.getProfileAdjustments(),
          service.getPolicies(),
        ]);
      if (!active) return;
      setExternalWorks(nextExternalWorks);
      setAdjustments(nextAdjustments);
      setPolicies(nextPolicies);
      setOnboardingDraft(draft);
      setOnboardingCompletedAt(completedAt);
    };

    void hydrate();

    return () => {
      active = false;
      unsubscribe();
    };
  }, [service]);

  const saveOnboardingDraft = useCallback(
    async (draft: OnboardingDraft) => {
      await service.saveOnboardingDraft(draft);
      setOnboardingDraft(restoreOnboardingDraft(draft));
    },
    [service],
  );

  const clearOnboardingDraft = useCallback(async () => {
    await service.clearOnboardingDraft();
    setOnboardingDraft(null);
  }, [service]);

  const finalizeOnboarding = useCallback(
    async (draft: OnboardingDraft, completedAt: string) => {
      await service.finalizeOnboarding(draft, completedAt);
      const records = await service.getUserWorks();
      setUserWorks(records);
      setOnboardingDraft(null);
      if (draft.mode === "firstRun") {
        setOnboardingCompletedAt(completedAt);
      }
    },
    [service],
  );

  const saveProfileAdjustments = useCallback(
    async (nextAdjustments: ProfileAdjustments) => {
      await service.saveProfileAdjustments(nextAdjustments);
      setAdjustments(parseProfileAdjustments(nextAdjustments));
    },
    [service],
  );

  const savePolicies = useCallback(
    async (nextPolicies: RecommendationPolicies) => {
      await service.savePolicies(nextPolicies);
      setPolicies(parseRecommendationPolicies(nextPolicies));
    },
    [service],
  );

  const saveUserWork = useCallback(
    async (record: UserWorkRecord) => {
      const storedRecord = await service.saveUserWork(record);
      setUserWorks(await service.getUserWorks());
      return storedRecord;
    },
    [service],
  );

  const addUserWorkIfAbsent = useCallback(
    async (record: UserWorkRecord) => {
      const result = await service.addUserWorkIfAbsent(record);
      setUserWorks(await service.getUserWorks());
      return result;
    },
    [service],
  );

  const removeMinimalPlannedUserWork = useCallback(
    async (workId: string) => {
      const result = await service.removeMinimalPlannedUserWork(workId);
      setUserWorks(await service.getUserWorks());
      return result;
    },
    [service],
  );

  const inspectExternalWork = useCallback(
    (id: ExternalWorkId) => service.inspectExternalWork(id),
    [service],
  );

  const addExternalWorkIfAbsent = useCallback(
    async (record: ExternalWorkRecord) => {
      const result = await service.addExternalWorkIfAbsent(record);
      setExternalWorks(await service.getExternalWorks());
      return result;
    },
    [service],
  );

  const saveExternalUserRecord = useCallback(
    async (id: ExternalWorkId, expectedNormalizedKey: string, record: UserWorkRecord) => {
      const storedRecord = await service.saveExternalUserRecord(id, expectedNormalizedKey, record);
      setExternalWorks(await service.getExternalWorks());
      return storedRecord;
    },
    [service],
  );

  const removeExternalWork = useCallback(
    async (id: ExternalWorkId) => {
      const result = await service.removeExternalWork(id);
      setExternalWorks(await service.getExternalWorks());
      return result;
    },
    [service],
  );

  const getRecommendationCache = useCallback(
    (inputHash: string) => service.getRecommendationCache(inputHash),
    [service],
  );

  const saveRecommendationCache = useCallback(
    (record: RecommendationCacheRecord) => service.saveRecommendationCache(record),
    [service],
  );

  const getProviderCache = useCallback((isbn: string) => service.getProviderCache(isbn), [service]);

  const saveProviderCache = useCallback(
    (record: ProviderCacheRecord) => service.saveProviderCache(record),
    [service],
  );

  const exportUserData = useCallback(
    (exportedAt: string, currentCatalog: CurrentCatalogIdentity) =>
      service.exportUserData(exportedAt, currentCatalog),
    [service],
  );

  const inspectImportJson = useCallback(
    (jsonText: string, currentCatalog: CurrentCatalogIdentity) =>
      service.inspectImportJson(jsonText, currentCatalog),
    [service],
  );

  const replaceFromExport = useCallback(
    async (file: ExportFileV1, currentCatalog: CurrentCatalogIdentity) => {
      const result = await service.replaceFromExport(file, currentCatalog);
      if (result.kind === "applied") {
        await refresh();
      }
      return result;
    },
    [refresh, service],
  );

  const deleteAllData = useCallback(
    async (currentCatalogVersion: string) => {
      const result = await service.deleteAllData(currentCatalogVersion);
      if (result.kind === "applied") {
        await refresh();
      }
      return result;
    },
    [refresh, service],
  );

  const hasProfile =
    userWorks === undefined
      ? undefined
      : new Set(
          userWorks
            .filter((record) => record.reaction === "favorite" || record.reaction === "liked")
            .map((record) => record.workId),
        ).size >= 5;

  const value: PersistenceContextValue = {
    status,
    onboardingDraft,
    onboardingCompletedAt,
    userWorks,
    externalWorks,
    adjustments,
    policies,
    hasProfile,
    refresh,
    saveOnboardingDraft,
    clearOnboardingDraft,
    finalizeOnboarding,
    saveProfileAdjustments,
    savePolicies,
    addUserWorkIfAbsent,
    saveUserWork,
    removeMinimalPlannedUserWork,
    inspectExternalWork,
    addExternalWorkIfAbsent,
    saveExternalUserRecord,
    removeExternalWork,
    getRecommendationCache,
    saveRecommendationCache,
    getProviderCache,
    saveProviderCache,
    exportUserData,
    inspectImportJson,
    replaceFromExport,
    deleteAllData,
  };

  return <PersistenceContext value={value}>{children}</PersistenceContext>;
}

export function usePersistence(): PersistenceContextValue {
  const value = useContext(PersistenceContext);
  if (value === null) {
    throw new Error("usePersistence must be used within PersistenceProvider");
  }
  return value;
}
