"use client";

import { Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/design-system/button";
import { Input } from "@/components/design-system/input";
import { NativeSelect } from "@/components/design-system/native-select";
import { Tabs, TabsList, TabsTrigger } from "@/components/design-system/tabs";
import { MediaShelf } from "@/components/media/media-shelf";
import { parseExternalWorkId, type ExternalWorkId } from "@/domain/catalog/external-work";
import { isbnIdentityKey } from "@/domain/catalog/normalize";
import type { CatalogV1, Work } from "@/domain/catalog/types";
import type { ReadingState, UserWorkRecord } from "@/domain/profile/types";
import type { ExternalWorkRecord } from "@/infrastructure/db";
import type { RakutenBookItem } from "@/infrastructure/rakuten";
import { libraryStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import {
  LibraryFavoriteCard,
  LibraryListCard,
  LibraryRecentCard,
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
export type { LibraryRow } from "./library-media-cards";
type SelectedRow = Readonly<Pick<LibraryRow, "id" | "kind">>;
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
  activeState?: LibraryStateFilter;
  addCatalogWork(work: Work): Promise<LibraryAddOutcome>;
  addExternalWork(item: RakutenBookItem): Promise<LibraryAddOutcome>;
  catalog: CatalogV1;
  catalogCoverUrls?: ReadonlyMap<string, string | null>;
  externalWorks: readonly ExternalWorkRecord[] | undefined;
  notifyCatalogCoverSettled?(workId: string): void;
  onActiveStateChange?(state: LibraryStateFilter): void;
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
  activeState: controlledActiveState,
  addCatalogWork,
  addExternalWork,
  catalog,
  catalogCoverUrls = new Map(),
  externalWorks,
  notifyCatalogCoverSettled,
  onActiveStateChange,
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
  const [localActiveState, setLocalActiveState] = useState<ReadingState>("planned");
  const activeState =
    controlledActiveState === undefined ? localActiveState : controlledActiveState;
  const [panel, setPanel] = useState<"search" | SelectedRow>();
  const [opener, setOpener] = useState<HTMLElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<
    Readonly<{ kind: "status" | "error"; text: string }> | undefined
  >();
  const saveInFlight = useRef(false);
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
  const searchedRows = useMemo(
    () =>
      rows
        ?.filter((row) => matchesQuery(row, query))
        .sort((left, right) => compareRows(left, right, sort)) ?? [],
    [query, rows, sort],
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
  const visibleRows =
    activeState === null
      ? searchedRows
      : searchedRows.filter((row) => row.record.readingState === activeState);
  const recentRows = [...searchedRows]
    .sort((left, right) => compareRows(left, right, "updated"))
    .slice(0, 8);
  const favoriteRows = searchedRows.filter((row) => row.record.reaction === "favorite");
  const selectedRow =
    panel === undefined || panel === "search"
      ? undefined
      : rows?.find((row) => row.kind === panel.kind && row.id === panel.id);
  const tabStates: readonly LibraryStateFilter[] =
    controlledActiveState === undefined ? READING_STATES : [null, ...READING_STATES];
  const showOverviewShelves = controlledActiveState !== undefined && activeState === null;

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
    if (controlledActiveState === undefined && state !== null) setLocalActiveState(state);
    onActiveStateChange?.(state);
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
    setPanel({ id: row.id, kind: row.kind });
  };
  const shelves =
    activeState === null
      ? READING_STATES.map((state) => ({
          state,
          rows: searchedRows.filter((row) => row.record.readingState === state),
        })).filter((shelf) => shelf.rows.length > 0)
      : [{ state: activeState, rows: visibleRows }];

  const page = (
    <main className="mx-auto w-full max-w-[var(--layout-width-media)] flex-1 px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[var(--space-8)] md:pb-[var(--space-section-large)]">
      <LibraryOverviewHeader
        onAddWork={(nextOpener) => {
          setOpener(nextOpener);
          setMessage(undefined);
          setPanel("search");
        }}
        stateCounts={stateCounts}
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
        <section className="grid justify-items-start gap-[var(--space-3)] py-[var(--space-8)]">
          <h2>{libraryStrings.overallEmpty.title}</h2>
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
        </section>
      ) : (
        <>
          <div className="mb-[var(--space-4)] grid grid-cols-2 gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)] md:grid-cols-[minmax(0,1fr)_minmax(12rem,18rem)_auto_auto] md:items-center">
            <Tabs
              className="col-span-2 w-full min-w-0 md:col-span-1"
              onValueChange={(value) => {
                const state = parseLibraryState(value);
                if (state !== undefined) selectActiveState(state);
              }}
              value={activeState ?? "all"}
            >
              <TabsList
                aria-label={libraryStrings.tablistLabel}
                className="m-0 w-full max-w-full justify-start overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {tabStates.map((state) => {
                  const id = state ?? "all";
                  return (
                    <TabsTrigger
                      aria-controls={`library-tabpanel-${id}`}
                      className="min-w-max shrink-0 px-[var(--space-content)]"
                      id={`library-tab-${id}`}
                      key={id}
                      value={id}
                    >
                      {state === null ? libraryStrings.tabsAll : libraryStrings.tabs[state]}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
            <label className="col-span-2 min-w-0 md:col-span-1">
              <span className="sr-only">{libraryStrings.toolbar.searchLabel}</span>
              <Input
                className="w-full bg-surface-2 text-text-strong"
                onChange={(event) => onQueryChange?.(event.currentTarget.value)}
                placeholder={libraryStrings.toolbar.searchPlaceholder}
                type="search"
                value={query}
              />
            </label>
            <label className="min-w-0">
              <span className="sr-only">{libraryStrings.toolbar.sortLabel}</span>
              <NativeSelect
                className="[&_[data-slot=native-select]]:bg-surface-2 [&_[data-slot=native-select]]:text-text-strong"
                onChange={(event) => onSortChange?.(event.currentTarget.value as LibrarySort)}
                value={sort}
              >
                <option value="updated">{libraryStrings.toolbar.sortUpdated}</option>
                <option value="title">{libraryStrings.toolbar.sortTitle}</option>
              </NativeSelect>
            </label>
            <div
              aria-label={libraryStrings.toolbar.viewLabel}
              className="flex gap-[var(--space-content)]"
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

          {!showOverviewShelves || recentRows.length === 0 ? null : (
            <MediaShelf
              className="mt-[var(--space-6)] [&_h2]:text-text-strong"
              compactHeading
              description={libraryStrings.recent.description}
              title={libraryStrings.recent.heading}
            >
              {recentRows.map((row) => (
                <LibraryRecentCard
                  catalogCoverUrls={catalogCoverUrls}
                  key={`recent:${row.kind}:${row.id}`}
                  onCoverSettled={notifyCatalogCoverSettled}
                  onOpen={openRow}
                  row={row}
                  volumeCountByWorkId={volumeCountByWorkId}
                />
              ))}
            </MediaShelf>
          )}

          <div
            aria-labelledby={activeState === null ? "library-tab-all" : undefined}
            data-library-view={view}
            id={activeState === null ? "library-tabpanel-all" : undefined}
            role={activeState === null ? "tabpanel" : undefined}
            tabIndex={activeState === null ? 0 : undefined}
          >
            {shelves.map((shelf) =>
              activeState === null && view === "grid" && shelf.rows.length > 0 ? (
                <MediaShelf
                  action={
                    <span className="text-text-muted tabular-nums">
                      {libraryStrings.summary.count(shelf.rows.length)}
                    </span>
                  }
                  className="mt-[var(--space-6)]"
                  compactHeading
                  key={shelf.state}
                  title={libraryStrings.tabs[shelf.state]}
                  trackClassName="items-stretch"
                >
                  {shelf.rows.map((row) => (
                    <div
                      className={cn(
                        "h-auto shrink-0 snap-start",
                        shelf.state === "reading"
                          ? "w-[min(78vw,17rem)] md:w-[calc((100%-(var(--space-content-loose)*3))/4)] md:min-w-[15rem]"
                          : "w-[calc((100vw-(var(--layout-page-padding)*2)-(var(--space-content-loose)*2))/2.4)] max-w-40 md:w-[calc((100%-(var(--space-content-loose)*5))/6)] md:min-w-[8.5rem]",
                      )}
                      key={`${row.kind}:${row.id}`}
                    >
                      <LibraryStateCard
                        catalogCoverUrls={catalogCoverUrls}
                        onCoverSettled={notifyCatalogCoverSettled}
                        onOpen={openRow}
                        row={row}
                        volumeCountByWorkId={volumeCountByWorkId}
                      />
                    </div>
                  ))}
                </MediaShelf>
              ) : (
                <section
                  aria-labelledby={activeState === null ? undefined : `library-tab-${shelf.state}`}
                  className="mt-[var(--space-6)]"
                  id={activeState === null ? undefined : `library-tabpanel-${shelf.state}`}
                  key={shelf.state}
                  role={activeState === null ? undefined : "tabpanel"}
                  tabIndex={activeState === null ? undefined : 0}
                >
                  <header className="mb-[var(--space-4)] flex items-center justify-between gap-[var(--space-3)]">
                    <h2 className="border-l-[length:var(--space-content-tight)] border-accent pl-[var(--space-3)] text-text-strong">
                      {libraryStrings.tabs[shelf.state]}
                    </h2>
                    <span className="text-text-muted tabular-nums">
                      {libraryStrings.summary.count(shelf.rows.length)}
                    </span>
                  </header>
                  {shelf.rows.length === 0 ? (
                    <div className="grid justify-items-start gap-[var(--space-3)] py-[var(--space-8)]">
                      <p className="text-text-muted">{libraryStrings.tabEmpty[shelf.state]}</p>
                    </div>
                  ) : (
                    <ul
                      className={cn(
                        "m-0 grid list-none gap-[var(--space-4)] border-0 p-0",
                        view === "list"
                          ? "grid-cols-1"
                          : shelf.state === "reading"
                            ? "grid-cols-1 md:grid-cols-4"
                            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-6",
                      )}
                    >
                      {shelf.rows.map((row) => (
                        <li className="min-w-0" key={`${row.kind}:${row.id}`}>
                          {view === "list" ? (
                            <LibraryListCard
                              catalogCoverUrls={catalogCoverUrls}
                              onCoverSettled={notifyCatalogCoverSettled}
                              onOpen={openRow}
                              row={row}
                              volumeCountByWorkId={volumeCountByWorkId}
                            />
                          ) : (
                            <LibraryStateCard
                              catalogCoverUrls={catalogCoverUrls}
                              onCoverSettled={notifyCatalogCoverSettled}
                              onOpen={openRow}
                              row={row}
                              volumeCountByWorkId={volumeCountByWorkId}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ),
            )}
          </div>

          {!showOverviewShelves || favoriteRows.length === 0 ? null : (
            <div className="mt-[var(--space-6)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-4)]">
              <MediaShelf
                className="[&_h2]:text-text-strong"
                compactHeading
                description={libraryStrings.favorites.description}
                title={libraryStrings.favorites.heading}
              >
                {favoriteRows.map((row) => (
                  <LibraryFavoriteCard
                    catalogCoverUrls={catalogCoverUrls}
                    key={`favorite:${row.kind}:${row.id}`}
                    onCoverSettled={notifyCatalogCoverSettled}
                    onOpen={openRow}
                    row={row}
                    volumeCountByWorkId={volumeCountByWorkId}
                  />
                ))}
              </MediaShelf>
            </div>
          )}

          <section className="mt-[var(--space-6)] grid gap-[var(--space-4)] rounded-[var(--radius-card)] border border-line-accent-subtle bg-surface-1 p-[var(--space-4)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="grid gap-[var(--space-content)]">
              <h2>{libraryStrings.tools.heading}</h2>
              <p className="max-w-[var(--layout-width-reading)] text-text-muted">
                {libraryStrings.tools.description}
              </p>
            </div>
            <Link
              className="inline-flex min-h-[var(--control-min-size)] w-fit items-center rounded-[var(--radius-control)] border border-accent px-[var(--space-4)] font-bold text-accent hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              search={{ section: "data" }}
              to="/settings"
            >
              {libraryStrings.tools.openSettings}
            </Link>
          </section>
        </>
      )}

      {panel === "search" ? (
        <ModalSurface
          labelledBy="library-search-title"
          onClose={closePanel}
          opener={opener}
          variant="search"
        >
          <WorkSearchSheet
            catalog={catalog}
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
                onCoverSettled={notifyCatalogCoverSettled}
                row={selectedRow}
              />
              <div className="grid min-w-0 gap-[var(--space-content)]">
                <h2 className="[overflow-wrap:anywhere]" id="library-detail-title">
                  {rowTitle(selectedRow)}
                </h2>
                <p className="text-text-muted">
                  {selectedRow.kind === "catalog-missing"
                    ? libraryStrings.catalogMissing.workId(selectedRow.id)
                    : rowCreators(selectedRow).join("・") || libraryStrings.unknownCreator}
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

  return page;
}
