"use client";

import { useCallback, useMemo } from "react";

import type { ExternalWorkId } from "@/domain/catalog/external-work";
import type { Work } from "@/domain/catalog/types";
import type { ReadingState, UserWorkRecord } from "@/domain/profile/types";
import { useCatalog } from "@/features/catalog/catalog-provider";
import { PopularWorkDiscovery } from "@/features/discovery/popular-work-discovery";
import {
  createRecommendationCoverTargets,
  useRecommendationCovers,
} from "@/features/recommendations/recommendation-cover-resolver";
import {
  createPlannedExternalWorkRecord,
  type ExternalWorkRecord,
  usePersistence,
} from "@/infrastructure/db";
import type { RakutenBookItem } from "@/infrastructure/rakuten";

import { LibraryView } from "./library-view";
import type { LibraryAddOutcome } from "./work-search-sheet";

function nowIso() {
  return new Date().toISOString();
}

export function LibraryFlow({
  activeState,
  query,
  sort,
  view,
  onActiveStateChange,
  onQueryChange,
  onSortChange,
  onViewChange,
}: Readonly<{
  activeState?: ReadingState | null;
  query?: string;
  sort?: "updated" | "title";
  view?: "list" | "grid";
  onActiveStateChange?: (state: ReadingState | null) => void;
  onQueryChange?: (query: string) => void;
  onSortChange?: (sort: "updated" | "title") => void;
  onViewChange?: (view: "list" | "grid") => void;
}> = {}) {
  const catalog = useCatalog();
  const {
    status,
    userWorks,
    externalWorks,
    addUserWorkIfAbsent,
    addExternalWorkIfAbsent,
    getProviderCache,
    saveProviderCache,
    saveUserWork,
    saveExternalUserRecord,
  } = usePersistence();
  const coverTargets = useMemo(
    () =>
      createRecommendationCoverTargets(
        catalog,
        [...(userWorks ?? [])]
          .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
          .map((record) => record.workId),
      ),
    [catalog, userWorks],
  );
  const { coverUrls, requestCover } = useRecommendationCovers({
    targets: coverTargets,
    getProviderCache,
    saveProviderCache,
  });

  const addCatalogWork = useCallback(
    async (work: Work): Promise<LibraryAddOutcome> => {
      const result = await addUserWorkIfAbsent({
        workId: work.id,
        readingState: "planned",
        updatedAt: nowIso(),
      });
      return result.kind;
    },
    [addUserWorkIfAbsent],
  );

  const addExternalWork = useCallback(
    async (item: RakutenBookItem): Promise<LibraryAddOutcome> => {
      const record = await createPlannedExternalWorkRecord(item, nowIso());
      const result = await addExternalWorkIfAbsent(record);
      return result.kind;
    },
    [addExternalWorkIfAbsent],
  );

  const saveCatalogRecord = useCallback(
    async (record: UserWorkRecord) => {
      await saveUserWork(record);
    },
    [saveUserWork],
  );

  const saveExternalRecord = useCallback(
    async (
      id: ExternalWorkId,
      expectedNormalizedKey: string,
      record: ExternalWorkRecord["record"],
    ) => {
      await saveExternalUserRecord(id, expectedNormalizedKey, record);
    },
    [saveExternalUserRecord],
  );

  return (
    <LibraryView
      activeState={activeState}
      addCatalogWork={addCatalogWork}
      addExternalWork={addExternalWork}
      catalog={catalog}
      discoveryContent={<PopularWorkDiscovery embedded />}
      catalogCoverUrls={coverUrls}
      externalWorks={externalWorks}
      onCatalogCoverVisible={requestCover}
      query={query}
      saveExternalUserRecord={saveExternalRecord}
      saveUserWork={saveCatalogRecord}
      sort={sort}
      storageDegraded={status.state === "degraded"}
      userWorks={userWorks}
      view={view}
      onActiveStateChange={onActiveStateChange}
      onQueryChange={onQueryChange}
      onSortChange={onSortChange}
      onViewChange={onViewChange}
    />
  );
}
