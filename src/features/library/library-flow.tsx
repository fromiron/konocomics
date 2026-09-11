"use client";

import { useCallback, useMemo, useState } from "react";

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
  favoriteOnly,
  page,
  query,
  sort,
  view,
  onActiveStateChange,
  onFavoriteOnlyChange,
  onClearFilters,
  onQueryChange,
  onPageChange,
  onSortChange,
  onViewChange,
}: Readonly<{
  activeState?: ReadingState | null;
  favoriteOnly?: boolean;
  page?: number;
  query?: string;
  sort?: "updated" | "title";
  view?: "list" | "grid";
  onActiveStateChange?: (state: ReadingState | null) => void;
  onFavoriteOnlyChange?: (favoriteOnly: boolean) => void;
  onClearFilters?: () => void;
  onQueryChange?: (query: string) => void;
  onPageChange?: (page: number, replace?: boolean) => void;
  onSortChange?: (sort: "updated" | "title") => void;
  onViewChange?: (view: "list" | "grid") => void;
}> = {}) {
  const catalog = useCatalog();
  const [searchWorkIds, setSearchWorkIds] = useState<readonly string[]>([]);
  const [pageWorkIds, setPageWorkIds] = useState<readonly string[]>([]);
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
      createRecommendationCoverTargets(catalog, [...new Set([...pageWorkIds, ...searchWorkIds])]),
    [catalog, pageWorkIds, searchWorkIds],
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
      favoriteOnly={favoriteOnly}
      page={page}
      addCatalogWork={addCatalogWork}
      addExternalWork={addExternalWork}
      catalog={catalog}
      discoveryContent={<PopularWorkDiscovery embedded />}
      catalogCoverUrls={coverUrls}
      externalWorks={externalWorks}
      onCatalogCoverVisible={requestCover}
      onSearchResultsChange={setSearchWorkIds}
      onPageWorkIdsChange={setPageWorkIds}
      query={query}
      saveExternalUserRecord={saveExternalRecord}
      saveUserWork={saveCatalogRecord}
      sort={sort}
      storageDegraded={status.state === "degraded"}
      userWorks={userWorks}
      view={view}
      onActiveStateChange={onActiveStateChange}
      onFavoriteOnlyChange={onFavoriteOnlyChange}
      onClearFilters={onClearFilters}
      onQueryChange={onQueryChange}
      onPageChange={onPageChange}
      onSortChange={onSortChange}
      onViewChange={onViewChange}
    />
  );
}
