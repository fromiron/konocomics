"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/design-system/button";
import { Input } from "@/components/design-system/input";
import { NativeSelect } from "@/components/design-system/native-select";
import { Tabs, TabsList, TabsTrigger } from "@/components/design-system/tabs";
import { parseExternalWorkId, type ExternalWorkId } from "@/domain/catalog/external-work";
import { isbnIdentityKey } from "@/domain/catalog/normalize";
import type { CatalogV1, Work } from "@/domain/catalog/types";
import type { ReadingState, UserWorkRecord } from "@/domain/profile/types";
import type { ExternalWorkRecord } from "@/infrastructure/db";
import type { RakutenBookItem } from "@/infrastructure/rakuten";
import { libraryStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import {
  formatUpdatedAt,
  type LibraryRow,
  LibraryStateCard,
  RowMedia,
  rowCreators,
  rowTitle,
} from "./library-media-cards";
import { LibraryOverviewHeader } from "./library-overview-header";
import { ModalSurface } from "./modal-surface";
import { LibraryRecordEditor } from "./record-editor";
import { WorkSearchSheet, type LibraryAddOutcome } from "./work-search-sheet";

const READING_STATES = ["planned", "reading", "completed", "dropped", "hidden"] as const;
const PAGE_SIZE = 24;
export type { LibraryRow } from "./library-media-cards";
type SelectedRow = Readonly<
  Pick<LibraryRow, "id" | "kind"> & { coverSize: 200 | 400; coverUrl?: string }
>;
type LibrarySort = "updated" | "title";
type LibraryViewMode = "list" | "grid";
type LibraryStateFilter = ReadingState | null;

function compareRows(left: LibraryRow, right: LibraryRow, sort: LibrarySort) {
  if (sort === "title") {
    const byTitle = rowTitle(left).localeCompare(rowTitle(right), "ja");
    if (byTitle !== 0) return byTitle;
  }
  const byUpdatedAt = Date.parse(right.record.updatedAt) - Date.parse(left.record.updatedAt);
  if (byUpdatedAt !== 0) return byUpdatedAt;
  return left.id < right.id ? -1 : left.id === right.id ? 0 : 1;
}

function matchesQuery(row: LibraryRow, query: string) {
  const normalized = query.trim().toLocaleLowerCase("ja-JP");
  if (normalized === "") return true;
  return [rowTitle(row), rowCreators(row).join(" "), row.id].some((value) =>
    value.toLocaleLowerCase("ja-JP").includes(normalized),
  );
}

function parseLibraryState(value: unknown): LibraryStateFilter | undefined {
  if (value === "all") return null;
  return READING_STATES.find((state) => state === value);
}

type LibraryViewProps = Readonly<{
  discoveryContent?: ReactNode;
  activeState?: LibraryStateFilter;
  favoriteOnly?: boolean;
  page?: number;
  addCatalogWork(work: Work): Promise<LibraryAddOutcome>;
  addExternalWork(item: RakutenBookItem): Promise<LibraryAddOutcome>;
  catalog: CatalogV1;
  catalogCoverUrls?: ReadonlyMap<string, string | null>;
  externalWorks: readonly ExternalWorkRecord[] | undefined;
  onCatalogCoverVisible?(workId: string): void;
  onActiveStateChange?(state: LibraryStateFilter): void;
  onFavoriteOnlyChange?(favoriteOnly: boolean): void;
  onClearFilters?(): void;
  onSearchResultsChange?(workIds: readonly string[]): void;
  onPageWorkIdsChange?(workIds: readonly string[]): void;
  onPageChange?(page: number, replace?: boolean): void;
  onQueryChange?(query: string): void;
  onSortChange?(sort: LibrarySort): void;
  onViewChange?(view: LibraryViewMode): void;
  query?: string;
  saveExternalUserRecord(
    id: ExternalWorkId,
    expectedNormalizedKey: string,
    record: ExternalWorkRecord["record"],
  ): Promise<void>;
  saveUserWork(record: UserWorkRecord): Promise<void>;
  // Accepted for test compatibility; the footer is now rendered once by the app shell.
  showFooter?: boolean;
  sort?: LibrarySort;
  storageDegraded: boolean;
  userWorks: readonly UserWorkRecord[] | undefined;
  view?: LibraryViewMode;
}>;

export function LibraryView({
  discoveryContent,
  activeState: controlledActiveState,
  favoriteOnly = false,
  page = 1,
  addCatalogWork,
  addExternalWork,
  catalog,
  catalogCoverUrls = new Map(),
  externalWorks,
  onCatalogCoverVisible,
  onActiveStateChange,
  onFavoriteOnlyChange,
  onClearFilters,
  onSearchResultsChange,
  onPageWorkIdsChange,
  onPageChange,
  onQueryChange,
  onSortChange,
  onViewChange,
  query = "",
  saveExternalUserRecord,
  saveUserWork,
  sort = "updated",
  storageDegraded,
  userWorks,
  view = "grid",
}: LibraryViewProps) {
  const [localActiveState, setLocalActiveState] = useState<LibraryStateFilter>(null);
  const activeState =
    controlledActiveState === undefined ? localActiveState : controlledActiveState;
  const [panel, setPanel] = useState<"search" | SelectedRow>();
  const [opener, setOpener] = useState<HTMLElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<
    Readonly<{ kind: "status" | "error"; text: string }> | undefined
  >();
  const saveInFlight = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const workById = useMemo(
    () => new Map(catalog.works.map((work) => [work.id, work] as const)),
    [catalog.works],
  );
  const volumeCountByWorkId = useMemo(() => {
    const counts = new Map<string, number>();
    catalog.volumes.forEach((volume) =>
      counts.set(volume.workId, (counts.get(volume.workId) ?? 0) + 1),
    );
    return counts;
  }, [catalog.volumes]);
  const rows = useMemo(() => {
    if (userWorks === undefined || externalWorks === undefined) return undefined;
    const next: LibraryRow[] = [];
    const externalIds = new Set<string>(externalWorks.map((external) => external.id));
    userWorks.forEach((record) => {
      const work = workById.get(record.workId);
      if (work !== undefined) next.push({ id: work.id, kind: "catalog", work, record });
      else if (!externalIds.has(record.workId)) {
        next.push({ id: record.workId, kind: "catalog-missing", record });
      }
    });
    externalWorks.forEach((external) => {
      next.push({ id: external.id, kind: "external", external, record: external.record });
    });
    return next;
  }, [externalWorks, userWorks, workById]);
  const visibleRows = useMemo(
    () =>
      rows
        ?.filter(
          (row) =>
            matchesQuery(row, query) &&
            (activeState === null || row.record.readingState === activeState) &&
            (!favoriteOnly || row.record.reaction === "favorite"),
        )
        .sort((left, right) => compareRows(left, right, sort)) ?? [],
    [activeState, favoriteOnly, query, rows, sort],
  );
  const stateCounts = useMemo(
    () =>
      Object.fromEntries(
        READING_STATES.map((state) => [
          state,
          rows?.filter((row) => row.record.readingState === state).length ?? 0,
        ]),
      ) as Record<ReadingState, number>,
    [rows],
  );
  const selectedRow =
    panel === undefined || panel === "search"
      ? undefined
      : rows?.find((row) => row.kind === panel.kind && row.id === panel.id);
  const pageCount = Math.max(1, Math.ceil(visibleRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = useMemo(
    () => visibleRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, visibleRows],
  );
  const selectedWorkId = selectedRow?.kind === "catalog" ? selectedRow.id : undefined;
  useEffect(() => {
    onPageWorkIdsChange?.([
      ...new Set([
        ...pageRows.filter((row) => row.kind === "catalog").map((row) => row.id),
        ...(selectedWorkId === undefined ? [] : [selectedWorkId]),
      ]),
    ]);
  }, [onPageWorkIdsChange, pageRows, selectedWorkId]);
  useEffect(() => {
    if (rows !== undefined && page !== currentPage) onPageChange?.(currentPage, true);
  }, [currentPage, onPageChange, page, rows]);
  const tabStates: readonly LibraryStateFilter[] = [null, ...READING_STATES];
  const hasQuery = query.trim().length > 0;
  const hasFilters = activeState !== null || favoriteOnly;

  if (rows === undefined) {
    return (
      <main className="mx-auto grid w-full max-w-[var(--layout-width-media)] flex-1 place-items-center px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[var(--space-8)] text-text-muted md:pb-[var(--space-section-large)]">
        <p aria-live="polite">{libraryStrings.loading}</p>
      </main>
    );
  }

  const closePanel = () => {
    setPanel(undefined);
    setMessage(undefined);
  };
  const selectActiveState = (state: LibraryStateFilter) => {
    if (controlledActiveState === undefined) setLocalActiveState(state);
    onActiveStateChange?.(state);
  };
  const clearFilters = () => {
    setLocalActiveState(null);
    onClearFilters?.();
  };
  const changePage = (nextPage: number) => {
    onPageChange?.(nextPage);
    resultsRef.current?.focus({ preventScroll: true });
    resultsRef.current?.scrollIntoView({ block: "start" });
  };
  const saveSelectedRecord = async (record: UserWorkRecord) => {
    if (selectedRow === undefined || busy || saveInFlight.current) return;
    saveInFlight.current = true;
    setBusy(true);
    setMessage(undefined);
    try {
      if (selectedRow.kind === "external") {
        await saveExternalUserRecord(selectedRow.external.id, selectedRow.external.normalizedKey, {
          ...record,
          workId: selectedRow.external.id,
        });
      } else await saveUserWork(record);
      setMessage({ kind: "status", text: libraryStrings.editor.saved });
    } catch {
      setMessage({ kind: "error", text: libraryStrings.editor.error });
    } finally {
      saveInFlight.current = false;
      setBusy(false);
    }
  };
  const openRow = (nextOpener: HTMLElement, row: LibraryRow) => {
    setOpener(nextOpener);
    setMessage(undefined);
    const coverSource =
      nextOpener.querySelector<HTMLImageElement>("img.cover-image__image")?.currentSrc;
    setPanel({
      id: row.id,
      kind: row.kind,
      coverSize: coverSource?.includes("_ex=200x200") ? 200 : 400,
      coverUrl: coverSource || undefined,
    });
  };
  return (
    <main className="mx-auto w-full max-w-[var(--layout-width-media)] flex-1 px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[var(--space-8)] md:pb-[var(--space-section-large)]">
      <LibraryOverviewHeader
        onAddWork={(nextOpener) => {
          setOpener(nextOpener);
          setMessage(undefined);
          setPanel("search");
        }}
        total={rows.length}
      />

      {storageDegraded ? (
        <p
          className="mb-[var(--space-4)] border-l-[length:var(--space-content-tight)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
          role="status"
        >
          {libraryStrings.storageWarning}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <section
          aria-labelledby="library-empty-heading"
          className="relative min-h-[calc(var(--control-min-size)*5)] overflow-hidden rounded-[var(--radius-card)] md:min-h-[calc(var(--space-12)*5)]"
        >
          <img
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full object-cover object-[82%_50%]"
            src="/media/library-empty-shelf.png"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-canvas from-40% via-canvas/80 via-55% to-transparent to-78%"
          />
          <div className="relative z-10 grid h-full min-h-[calc(var(--control-min-size)*5)] content-center justify-items-start gap-[var(--space-3)] p-[var(--space-4)] md:min-h-[calc(var(--space-12)*5)] md:max-w-[55%] md:p-[var(--space-6)]">
            <h2 id="library-empty-heading">{libraryStrings.overallEmpty.title}</h2>
            <p className="text-text-muted">{libraryStrings.overallEmpty.description}</p>
            <Button
              onClick={(event) => {
                setOpener(event.currentTarget);
                setPanel("search");
              }}
              type="button"
            >
              {libraryStrings.addWork}
            </Button>
          </div>
        </section>
      ) : (
        <>
          <div className="mb-[var(--space-4)] grid gap-[var(--space-3)]">
            <label className="min-w-0">
              <span className="sr-only">{libraryStrings.toolbar.searchLabel}</span>
              <Input
                className="w-full bg-surface-2 text-text-strong"
                onChange={(event) => onQueryChange?.(event.currentTarget.value)}
                placeholder={libraryStrings.toolbar.searchPlaceholder}
                type="search"
                value={query}
              />
            </label>
            <Tabs
              className="w-full min-w-0"
              onValueChange={(value) => {
                const state = parseLibraryState(value);
                if (state !== undefined) selectActiveState(state);
              }}
              value={activeState ?? "all"}
            >
              <TabsList
                aria-label={libraryStrings.tablistLabel}
                className="m-0 flex h-auto w-fit max-w-full flex-wrap justify-start gap-[var(--space-content-tight)] overflow-visible"
              >
                {tabStates.map((state) => {
                  const id = state ?? "all";
                  const label =
                    state === null ? libraryStrings.tabsAll : libraryStrings.tabs[state];
                  const count = state === null ? rows.length : stateCounts[state];
                  return (
                    <TabsTrigger
                      aria-controls="library-results"
                      aria-label={libraryStrings.tabWithCount(label, count)}
                      className="h-auto min-h-[var(--control-min-size)] min-w-max flex-none px-[var(--space-content)]"
                      id={"library-tab-" + id}
                      key={id}
                      value={id}
                    >
                      {label}
                      <span aria-hidden="true" className="tabular-nums">
                        {count}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-[var(--space-content)] md:grid-cols-[auto_minmax(0,1fr)_auto_auto]">
              <Button
                aria-pressed={favoriteOnly}
                className="order-1 justify-self-start rounded-[var(--radius-pill)] aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent"
                onClick={() => onFavoriteOnlyChange?.(!favoriteOnly)}
                type="button"
                variant="outline"
              >
                {libraryStrings.toolbar.favoriteOnly}
              </Button>
              <label className="order-2 min-w-0 justify-self-end md:order-3">
                <span className="sr-only">{libraryStrings.toolbar.sortLabel}</span>
                <NativeSelect
                  onChange={(event) =>
                    onSortChange?.(event.currentTarget.value === "title" ? "title" : "updated")
                  }
                  value={sort}
                >
                  <option value="updated">{libraryStrings.toolbar.sortUpdated}</option>
                  <option value="title">{libraryStrings.toolbar.sortTitle}</option>
                </NativeSelect>
              </label>
              <p
                aria-live="polite"
                aria-atomic="true"
                className="order-3 text-[length:var(--text-caption-size)] text-text-muted md:order-2 md:pl-[var(--space-content)]"
              >
                {pageCount === 1
                  ? libraryStrings.toolbar.resultCount(visibleRows.length)
                  : libraryStrings.pagination.resultRange(
                      (currentPage - 1) * PAGE_SIZE + 1,
                      Math.min(currentPage * PAGE_SIZE, visibleRows.length),
                      visibleRows.length,
                    )}
              </p>
              <div
                aria-label={libraryStrings.toolbar.viewLabel}
                className="order-4 flex gap-[var(--space-content)]"
                role="group"
              >
                {(["grid", "list"] as const).map((mode) => (
                  <Button
                    aria-pressed={view === mode}
                    className="aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent"
                    key={mode}
                    onClick={() => onViewChange?.(mode)}
                    type="button"
                    variant="outline"
                  >
                    {libraryStrings.toolbar.views[mode]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div
            aria-labelledby={"library-tab-" + (activeState ?? "all")}
            data-library-view={view}
            id="library-results"
            ref={resultsRef}
            role="tabpanel"
            tabIndex={0}
          >
            {visibleRows.length === 0 ? (
              <div className="grid justify-items-start gap-[var(--space-3)] py-[var(--space-8)]">
                <p className="[overflow-wrap:anywhere] text-text-strong">
                  {hasQuery
                    ? libraryStrings.filteredEmpty.search(query.trim())
                    : favoriteOnly
                      ? libraryStrings.filteredEmpty.favorite
                      : activeState === null
                        ? libraryStrings.overallEmpty.title
                        : libraryStrings.tabEmpty[activeState]}
                </p>
                {hasFilters ? (
                  <p className="text-text-muted">
                    {libraryStrings.filteredEmpty.conditions(
                      activeState === null
                        ? libraryStrings.tabsAll
                        : libraryStrings.tabs[activeState],
                      favoriteOnly,
                    )}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-[var(--space-content)]">
                  {hasQuery ? (
                    <Button onClick={() => onQueryChange?.("")} type="button" variant="outline">
                      {libraryStrings.filteredEmpty.clearSearch}
                    </Button>
                  ) : null}
                  {hasFilters ? (
                    <Button onClick={clearFilters} type="button" variant="outline">
                      {hasQuery
                        ? libraryStrings.filteredEmpty.clearFilters
                        : libraryStrings.filteredEmpty.showAll}
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : (
              <ul
                className={cn(
                  "m-0 grid list-none gap-[var(--space-4)] p-0",
                  view === "list"
                    ? "grid-cols-1"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6",
                )}
              >
                {pageRows.map((row) => (
                  <li className="min-w-0" key={row.kind + ":" + row.id}>
                    <LibraryStateCard
                      catalogCoverUrls={catalogCoverUrls}
                      onCoverVisible={onCatalogCoverVisible}
                      onOpen={openRow}
                      row={row}
                      showState={activeState === null}
                      view={view}
                      volumeCountByWorkId={volumeCountByWorkId}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {pageCount > 1 ? (
            <nav
              aria-label={libraryStrings.pagination.label}
              className="mt-[var(--space-6)] flex flex-wrap items-center justify-center gap-[var(--space-3)]"
            >
              <Button
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
                type="button"
                variant="outline"
              >
                {libraryStrings.pagination.previous}
              </Button>
              <NativeSelect
                aria-label={libraryStrings.pagination.label}
                className="w-auto"
                onChange={(event) => changePage(Number(event.currentTarget.value))}
                value={currentPage}
              >
                {Array.from({ length: pageCount }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {libraryStrings.pagination.page(index + 1, pageCount)}
                  </option>
                ))}
              </NativeSelect>
              <Button
                disabled={currentPage === pageCount}
                onClick={() => changePage(currentPage + 1)}
                type="button"
                variant="outline"
              >
                {libraryStrings.pagination.next}
              </Button>
            </nav>
          ) : null}

          {!hasQuery && visibleRows.length > 0 ? (
            <section
              aria-labelledby="library-data-heading"
              className="relative mt-[var(--space-6)] min-h-[128px] w-full overflow-hidden rounded-[var(--radius-card)] md:min-h-[136px]"
            >
              <img
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full object-cover object-[88%_50%] md:object-[82%_48%]"
                decoding="async"
                fetchPriority="low"
                loading="lazy"
                src="/media/library-data-portability.png"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-canvas from-38% via-canvas/80 via-56% to-transparent to-80%"
              />
              <div className="relative z-10 grid h-full min-h-[128px] content-center justify-items-start gap-[var(--space-2)] p-[var(--space-3)] md:min-h-[136px] md:max-w-[70%] md:p-[var(--space-4)]">
                <h2
                  className="text-[length:var(--font-size-14)] leading-snug font-bold text-text-strong md:text-[length:var(--text-subheading-size)]"
                  id="library-data-heading"
                >
                  {libraryStrings.tools.heading}
                </h2>
                <p className="text-[length:var(--text-caption-size)] text-text-muted">
                  {libraryStrings.tools.description}
                </p>
                <Link
                  className="inline-flex min-h-[var(--control-min-size)] w-fit items-center rounded-[var(--radius-control)] border border-accent px-[var(--space-4)] font-bold text-accent hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  search={{ section: "data" }}
                  to="/settings"
                >
                  {libraryStrings.tools.openSettings}
                </Link>
              </div>
            </section>
          ) : null}
        </>
      )}

      {panel === "search" ? (
        <ModalSurface
          labelledBy="library-search-title"
          initialFocusId="library-add-search"
          onClose={closePanel}
          opener={opener}
          variant="search"
        >
          <WorkSearchSheet
            catalog={catalog}
            emptyContent={discoveryContent}
            catalogCoverUrls={catalogCoverUrls}
            onCatalogCoverVisible={onCatalogCoverVisible}
            onSearchResultsChange={onSearchResultsChange}
            isCatalogAdded={(workId) =>
              userWorks?.some((record) => record.workId === workId) === true
            }
            isExternalAdded={(item) =>
              externalWorks?.some((external) =>
                external.isbnSamples.some(
                  (isbn) => isbnIdentityKey(isbn) === isbnIdentityKey(item.isbn),
                ),
              ) === true
            }
            onAddCatalog={addCatalogWork}
            onAddExternal={addExternalWork}
          />
        </ModalSurface>
      ) : null}

      {selectedRow === undefined ? null : (
        <ModalSurface
          initialFocusId="library-detail-title"
          fallbackFocusId={`library-tab-${activeState ?? "all"}`}
          label={
            selectedRow.kind === "catalog-missing"
              ? libraryStrings.catalogMissing.dialogLabel(selectedRow.id)
              : rowTitle(selectedRow)
          }
          onClose={closePanel}
          opener={opener}
          variant="detail"
        >
          <div className="grid gap-[var(--space-6)]">
            <div className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-[var(--space-4)]">
              <RowMedia
                catalogCoverUrls={catalogCoverUrls}
                coverUrl={typeof panel === "object" ? panel.coverUrl : undefined}
                onCoverVisible={onCatalogCoverVisible}
                requestedSize={typeof panel === "object" ? panel.coverSize : 400}
                row={selectedRow}
              />
              <div className="grid min-w-0 gap-[var(--space-content)]">
                <h2 className="[overflow-wrap:anywhere]" id="library-detail-title" tabIndex={-1}>
                  {rowTitle(selectedRow)}
                </h2>
                <p className="text-text-muted">
                  {selectedRow.kind === "catalog-missing"
                    ? libraryStrings.catalogMissing.workId(selectedRow.id)
                    : rowCreators(selectedRow).join("・") || libraryStrings.unknownCreator}
                </p>
                <p className="text-[length:var(--text-caption-size)] text-text-muted">
                  {libraryStrings.updatedAt(formatUpdatedAt(selectedRow.record.updatedAt))}
                </p>
                {selectedRow.kind === "external" ? (
                  <>
                    <span className="inline-flex min-h-6 w-fit items-center rounded-[var(--radius-pill)] border border-line px-[var(--space-content)] py-0.5 text-[length:var(--text-caption-size)] font-bold text-text-muted">
                      {libraryStrings.externalBadge}
                    </span>
                    <p className="border-l-[length:var(--space-content-tight)] border-line bg-canvas p-[var(--space-3)] text-[length:var(--text-caption-size)] text-text-muted">
                      {libraryStrings.externalExclusion}
                    </p>
                  </>
                ) : null}
                {selectedRow.kind === "catalog-missing" ? (
                  <>
                    <span className="inline-flex min-h-6 w-fit items-center rounded-[var(--radius-pill)] border border-line px-[var(--space-content)] py-0.5 text-[length:var(--text-caption-size)] font-bold text-text-muted">
                      {libraryStrings.catalogMissing.badge}
                    </span>
                    <p className="border-l-[length:var(--space-content-tight)] border-line bg-canvas p-[var(--space-3)] text-[length:var(--text-caption-size)] text-text-muted">
                      {libraryStrings.catalogMissing.description}
                    </p>
                  </>
                ) : selectedRow.kind === "catalog" ? (
                  <Link
                    className="inline-flex min-h-[var(--control-min-size)] w-fit items-center font-bold text-accent underline underline-offset-[var(--space-content-tight)]"
                    params={{ workId: selectedRow.id }}
                    to="/works/$workId"
                  >
                    {libraryStrings.panel.catalogDetail}
                  </Link>
                ) : (
                  <Link
                    className="inline-flex min-h-[var(--control-min-size)] w-fit items-center font-bold text-accent underline underline-offset-[var(--space-content-tight)]"
                    search={{ workId: parseExternalWorkId(selectedRow.id) }}
                    to="/works/external"
                  >
                    {libraryStrings.panel.externalDetail}
                  </Link>
                )}
              </div>
            </div>
            <LibraryRecordEditor
              busy={busy}
              key={`${selectedRow.kind}:${selectedRow.id}:${selectedRow.record.updatedAt}`}
              onSave={saveSelectedRecord}
              record={selectedRow.record}
            />
            <p
              aria-live="polite"
              className="min-h-6 text-text-muted [&[role=alert]]:border-l-[length:var(--space-content-tight)] [&[role=alert]]:border-warn [&[role=alert]]:bg-canvas [&[role=alert]]:p-[var(--space-3)] [&[role=alert]]:text-text-strong"
              role={message?.kind === "error" ? "alert" : "status"}
            >
              {message?.text}
            </p>
          </div>
        </ModalSurface>
      )}
    </main>
  );
}
