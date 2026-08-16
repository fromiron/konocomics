"use client";

import { Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import { Input } from "@/components/design-system/input";
import { NativeSelect } from "@/components/design-system/native-select";
import { Tabs, TabsList, TabsTrigger } from "@/components/design-system/tabs";
import { SiteFooter } from "@/components/layout/site-footer";
import { MediaShelf } from "@/components/media/media-shelf";
import { parseExternalWorkId, type ExternalWorkId } from "@/domain/catalog/external-work";
import { isbnIdentityKey } from "@/domain/catalog/normalize";
import type { CatalogV1, Work } from "@/domain/catalog/types";
import type { ReadingState, UserWorkRecord } from "@/domain/profile/types";
import type { ExternalWorkRecord } from "@/infrastructure/db";
import type { RakutenBookItem } from "@/infrastructure/rakuten";
import { libraryStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { ModalSurface } from "./modal-surface";
import { LibraryRecordEditor } from "./record-editor";
import { WorkSearchSheet, type LibraryAddOutcome } from "./work-search-sheet";

const READING_STATES = ["planned", "reading", "completed", "dropped", "hidden"] as const;
const updatedAtFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
  timeZone: "Asia/Tokyo",
});

type CatalogRow = Readonly<{
  id: string;
  kind: "catalog";
  work: Work;
  record: UserWorkRecord;
}>;
type ExternalRow = Readonly<{
  id: string;
  kind: "external";
  external: ExternalWorkRecord;
  record: UserWorkRecord;
}>;
type CatalogMissingRow = Readonly<{
  id: string;
  kind: "catalog-missing";
  record: UserWorkRecord;
}>;

export type LibraryRow = CatalogRow | ExternalRow | CatalogMissingRow;
type SelectedRow = Readonly<Pick<LibraryRow, "id" | "kind">>;
type LibrarySort = "updated" | "title";
type LibraryViewMode = "list" | "grid";
type LibraryStateFilter = ReadingState | null;

function rowTitle(row: LibraryRow) {
  if (row.kind === "catalog") return row.work.title;
  if (row.kind === "external") return row.external.title;
  return libraryStrings.catalogMissing.title;
}

function rowCreators(row: LibraryRow) {
  if (row.kind === "catalog") return row.work.creators;
  if (row.kind === "external") return row.external.creators;
  return [];
}

function rowCoverUrl(row: LibraryRow, catalogCoverUrls: ReadonlyMap<string, string | null>) {
  if (row.kind === "external") return row.external.coverUrl;
  return row.kind === "catalog" ? catalogCoverUrls.get(row.id) : undefined;
}

function rowOpenLabel(row: LibraryRow) {
  return row.kind === "catalog-missing"
    ? libraryStrings.catalogMissing.openRecord(row.id)
    : libraryStrings.openRecord(rowTitle(row));
}

function formatUpdatedAt(value: string) {
  const time = Date.parse(value);
  return Number.isFinite(time) ? updatedAtFormatter.format(new Date(time)) : value;
}

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

function RowMedia({
  catalogCoverUrls,
  onCoverSettled,
  row,
}: Readonly<{
  catalogCoverUrls: ReadonlyMap<string, string | null>;
  onCoverSettled?(workId: string): void;
  row: LibraryRow;
}>) {
  if (row.kind === "catalog-missing") {
    return (
      <div className="grid w-full place-items-center rounded-[var(--radius-cover)] border border-dashed border-line bg-canvas text-text-muted [aspect-ratio:30/43]">
        <span className="sr-only">{libraryStrings.catalogMissing.coverUnavailable}</span>
      </div>
    );
  }

  return (
    <CoverImage
      coverUrl={rowCoverUrl(row, catalogCoverUrls)}
      creators={rowCreators(row)}
      onSettled={row.kind === "catalog" ? () => onCoverSettled?.(row.id) : undefined}
      requestedSize={200}
      title={rowTitle(row)}
    />
  );
}

function ProgressDisplay({
  row,
  volumeCountByWorkId,
}: Readonly<{ row: LibraryRow; volumeCountByWorkId: ReadonlyMap<string, number> }>) {
  const volume = row.record.progress?.volume;
  const chapter = row.record.progress?.chapter;
  if (volume === undefined && chapter === undefined) return null;
  const label = libraryStrings.progress(volume, chapter);
  const total = row.kind === "catalog" ? volumeCountByWorkId.get(row.id) : undefined;

  return (
    <span className="grid gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)] text-text-muted">
      <span>{label}</span>
      {volume === undefined || total === undefined || total < 1 ? null : (
        <progress
          aria-valuetext={label}
          className="h-[var(--space-content-tight)] w-full overflow-hidden rounded-[var(--radius-pill)] border-0 bg-surface-3 text-accent [&::-moz-progress-bar]:bg-accent [&::-webkit-progress-bar]:bg-surface-3 [&::-webkit-progress-value]:bg-accent"
          max={total}
          value={Math.min(volume, total)}
        />
      )}
    </span>
  );
}

function LibraryMediaCard({
  catalogCoverUrls,
  onCoverSettled,
  onOpen,
  layout,
  row,
  volumeCountByWorkId,
}: Readonly<{
  catalogCoverUrls: ReadonlyMap<string, string | null>;
  onCoverSettled?(workId: string): void;
  onOpen(opener: HTMLElement, row: LibraryRow): void;
  layout: "shelf" | LibraryViewMode;
  row: LibraryRow;
  volumeCountByWorkId: ReadonlyMap<string, number>;
}>) {
  return (
    <article
      className={cn(
        "shrink-0 snap-start",
        layout === "shelf" ? "w-[min(42vw,9rem)] md:w-36" : "h-full w-full",
      )}
      data-library-row-kind={row.kind}
      data-work-id={row.id}
    >
      <Button
        aria-label={rowOpenLabel(row)}
        className={cn(
          "grid h-full min-h-[var(--control-min-size)] w-full justify-stretch gap-[var(--space-3)] whitespace-normal rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)] text-start text-text",
          layout === "list" && "grid-cols-[5rem_minmax(0,1fr)]",
        )}
        onClick={(event) => onOpen(event.currentTarget, row)}
        type="button"
        variant="ghost"
      >
        <span className="w-full">
          <RowMedia catalogCoverUrls={catalogCoverUrls} onCoverSettled={onCoverSettled} row={row} />
        </span>
        <span className="grid min-w-0 content-start gap-[var(--space-content-tight)]">
          <strong className="[overflow-wrap:anywhere] leading-[var(--line-height-heading)] text-text-strong">
            {rowTitle(row)}
          </strong>
          <span className="overflow-hidden text-ellipsis text-[length:var(--text-caption-size)] text-text-muted">
            {row.kind === "catalog-missing"
              ? libraryStrings.catalogMissing.workId(row.id)
              : rowCreators(row).join("・") || libraryStrings.unknownCreator}
          </span>
          <span className="flex flex-wrap gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)] [&>span]:rounded-[var(--radius-pill)] [&>span]:border [&>span]:border-line [&>span]:px-[var(--space-content)] [&>span]:py-[var(--space-content-tight)] [&>span]:text-text">
            <span>{libraryStrings.tabs[row.record.readingState]}</span>
            {row.kind === "external" ? <span>{libraryStrings.externalBadge}</span> : null}
            {row.kind === "catalog-missing" ? (
              <span>{libraryStrings.catalogMissing.badge}</span>
            ) : null}
          </span>
          <ProgressDisplay row={row} volumeCountByWorkId={volumeCountByWorkId} />
          <span className="overflow-hidden text-ellipsis text-[length:var(--text-caption-size)] text-text-muted">
            {libraryStrings.updatedAt(formatUpdatedAt(row.record.updatedAt))}
          </span>
        </span>
      </Button>
    </article>
  );
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
  showFooter = false,
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
  const recentRows = [...visibleRows]
    .sort((left, right) => compareRows(left, right, "updated"))
    .slice(0, 8);
  const favoriteRows = visibleRows.filter((row) => row.record.reaction === "favorite");
  const selectedRow =
    panel === undefined || panel === "search"
      ? undefined
      : rows?.find((row) => row.kind === panel.kind && row.id === panel.id);
  const tabStates: readonly LibraryStateFilter[] =
    controlledActiveState === undefined ? READING_STATES : [null, ...READING_STATES];

  if (rows === undefined) {
    return (
      <main className="mx-auto grid min-h-dvh w-full max-w-[var(--layout-width-library)] place-items-center px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[calc(var(--layout-mobile-navigation-clearance)+var(--space-8))] text-text-muted md:pb-[var(--space-section-large)]">
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
    <main className="mx-auto min-h-dvh w-full max-w-[var(--layout-width-media)] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[calc(var(--layout-mobile-navigation-clearance)+var(--space-section-large))]">
      <header className="mb-[var(--space-6)] flex flex-wrap items-end justify-between gap-[var(--space-4)]">
        <div className="grid max-w-[var(--layout-width-reading)] gap-[var(--space-content)]">
          <h1 className="text-[length:var(--text-page-title-size)] text-text-strong">
            {libraryStrings.title}
          </h1>
          <p className="text-text-muted">{libraryStrings.description}</p>
        </div>
        <Button
          onClick={(event) => {
            setOpener(event.currentTarget);
            setMessage(undefined);
            setPanel("search");
          }}
          type="button"
        >
          {libraryStrings.addWork}
        </Button>
      </header>

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
          <section
            aria-label={libraryStrings.summary.heading}
            className="mb-[var(--space-6)] grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-card)] bg-line p-px md:grid-cols-6 [&>div]:grid [&>div]:min-h-[calc(var(--control-min-size)*1.6)] [&>div]:content-center [&>div]:justify-items-center [&>div]:gap-[var(--space-content-tight)] [&>div]:bg-surface-1 [&>div]:p-[var(--space-3)]"
          >
            <div>
              <span className="text-[length:var(--text-caption-size)] text-text-muted">
                {libraryStrings.summary.total}
              </span>
              <strong className="text-[length:var(--text-section-title-size)] text-text-strong tabular-nums">
                {String(rows.length)}
              </strong>
            </div>
            {READING_STATES.map((state) => (
              <div key={state}>
                <span className="text-[length:var(--text-caption-size)] text-text-muted">
                  {libraryStrings.tabs[state]}
                </span>
                <strong className="text-[length:var(--text-section-title-size)] text-text-strong tabular-nums">
                  {String(stateCounts[state])}
                </strong>
              </div>
            ))}
          </section>

          <div className="mb-[var(--space-section)] grid grid-cols-2 gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)] md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center xl:grid-cols-[minmax(0,1fr)_minmax(12rem,18rem)_auto_auto]">
            <Tabs
              className="col-span-2 w-full min-w-0 md:col-span-3 xl:col-span-1"
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

          {controlledActiveState === undefined || recentRows.length === 0 ? null : (
            <MediaShelf
              className="mt-[var(--space-section-large)] [&_h2]:border-l-[length:var(--space-content-tight)] [&_h2]:border-accent [&_h2]:pl-[var(--space-3)] [&_h2]:text-text-strong"
              description={libraryStrings.recent.description}
              title={libraryStrings.recent.heading}
            >
              {recentRows.map((row) => (
                <LibraryMediaCard
                  catalogCoverUrls={catalogCoverUrls}
                  key={`recent:${row.kind}:${row.id}`}
                  layout="shelf"
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
            {shelves.map((shelf) => (
              <section
                aria-labelledby={activeState === null ? undefined : `library-tab-${shelf.state}`}
                className="mt-[var(--space-section-large)]"
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
                      "m-0 grid list-none gap-[var(--space-3)] border-0 p-0",
                      view === "list" ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4",
                    )}
                  >
                    {shelf.rows.map((row) => (
                      <li className="min-w-0" key={`${row.kind}:${row.id}`}>
                        <LibraryMediaCard
                          catalogCoverUrls={catalogCoverUrls}
                          layout={view}
                          onCoverSettled={notifyCatalogCoverSettled}
                          onOpen={openRow}
                          row={row}
                          volumeCountByWorkId={volumeCountByWorkId}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {controlledActiveState === undefined || favoriteRows.length === 0 ? null : (
            <MediaShelf
              className="mt-[var(--space-section-large)] [&_h2]:border-l-[length:var(--space-content-tight)] [&_h2]:border-accent [&_h2]:pl-[var(--space-3)] [&_h2]:text-text-strong"
              description={libraryStrings.favorites.description}
              title={libraryStrings.favorites.heading}
            >
              {favoriteRows.map((row) => (
                <LibraryMediaCard
                  catalogCoverUrls={catalogCoverUrls}
                  key={`favorite:${row.kind}:${row.id}`}
                  layout="shelf"
                  onCoverSettled={notifyCatalogCoverSettled}
                  onOpen={openRow}
                  row={row}
                  volumeCountByWorkId={volumeCountByWorkId}
                />
              ))}
            </MediaShelf>
          )}

          <section className="mt-[var(--space-section-large)] grid gap-[var(--space-4)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-5)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <h2>{libraryStrings.tools.heading}</h2>
              <p>{libraryStrings.tools.description}</p>
            </div>
            <Link
              className="inline-flex min-h-[var(--control-min-size)] w-fit items-center font-bold text-accent underline underline-offset-[var(--space-content-tight)]"
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

  return showFooter ? (
    <>
      {page}
      <SiteFooter />
    </>
  ) : (
    page
  );
}
