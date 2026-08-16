"use client";

import Link from "next/link";
import { type KeyboardEvent, useMemo, useRef, useState } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import type { ExternalWorkId } from "@/domain/catalog/external-work";
import { isbnIdentityKey } from "@/domain/catalog/normalize";
import type { CatalogV1, Work } from "@/domain/catalog/types";
import type { ReadingState, UserWorkRecord } from "@/domain/profile/types";
import type { ExternalWorkRecord } from "@/infrastructure/db";
import type { RakutenBookItem } from "@/infrastructure/rakuten";
import { libraryStrings } from "@/lib/strings";

import { ModalSurface } from "./modal-surface";
import { LibraryRecordEditor } from "./record-editor";
import { WorkSearchSheet, type LibraryAddOutcome } from "./work-search-sheet";

const READING_STATES = ["planned", "reading", "completed", "dropped", "hidden"] as const;
const reactionIcons = {
  favorite: "♥",
  liked: "＋",
  neutral: "＝",
  disliked: "−",
} as const;
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

function rowCoverUrl(row: LibraryRow) {
  return row.kind === "external" ? row.external.coverUrl : undefined;
}

function rowOpenLabel(row: LibraryRow) {
  return row.kind === "catalog-missing"
    ? libraryStrings.catalogMissing.openRecord(row.id)
    : libraryStrings.openRecord(rowTitle(row));
}

function RowMedia({ row, size }: Readonly<{ row: LibraryRow; size: 200 }>) {
  if (row.kind === "catalog-missing") {
    return (
      <div className="library-missing-media">
        <span className="visually-hidden">{libraryStrings.catalogMissing.coverUnavailable}</span>
        <span aria-hidden="true">—</span>
      </div>
    );
  }

  return (
    <CoverImage
      coverUrl={rowCoverUrl(row)}
      creators={rowCreators(row)}
      requestedSize={size}
      title={rowTitle(row)}
    />
  );
}

function formatUpdatedAt(value: string) {
  const time = Date.parse(value);
  return Number.isFinite(time) ? updatedAtFormatter.format(new Date(time)) : value;
}

function sortRows(left: LibraryRow, right: LibraryRow) {
  const byUpdatedAt = Date.parse(right.record.updatedAt) - Date.parse(left.record.updatedAt);
  if (byUpdatedAt !== 0) return byUpdatedAt;
  return rowTitle(left).localeCompare(rowTitle(right), "ja");
}

type LibraryViewProps = Readonly<{
  addCatalogWork(work: Work): Promise<LibraryAddOutcome>;
  addExternalWork(item: RakutenBookItem): Promise<LibraryAddOutcome>;
  catalog: CatalogV1;
  externalHref(id: string): string;
  externalWorks: readonly ExternalWorkRecord[] | undefined;
  saveExternalUserRecord(
    id: ExternalWorkId,
    expectedNormalizedKey: string,
    record: ExternalWorkRecord["record"],
  ): Promise<void>;
  saveUserWork(record: UserWorkRecord): Promise<void>;
  storageDegraded: boolean;
  userWorks: readonly UserWorkRecord[] | undefined;
}>;

export function LibraryView({
  addCatalogWork,
  addExternalWork,
  catalog,
  externalHref,
  externalWorks,
  saveExternalUserRecord,
  saveUserWork,
  storageDegraded,
  userWorks,
}: LibraryViewProps) {
  const [activeState, setActiveState] = useState<ReadingState>("planned");
  const [panel, setPanel] = useState<"search" | SelectedRow>();
  const [opener, setOpener] = useState<HTMLElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<
    Readonly<{ kind: "status" | "error"; text: string }> | undefined
  >();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const saveInFlight = useRef(false);
  const workById = useMemo(
    () => new Map(catalog.works.map((work) => [work.id, work] as const)),
    [catalog.works],
  );
  const rows = useMemo(() => {
    if (userWorks === undefined || externalWorks === undefined) return undefined;
    const next: LibraryRow[] = [];
    const externalIds = new Set<string>(externalWorks.map((external) => external.id));
    userWorks.forEach((record) => {
      const work = workById.get(record.workId);
      if (work !== undefined) {
        next.push({ id: work.id, kind: "catalog", work, record });
      } else if (!externalIds.has(record.workId)) {
        next.push({ id: record.workId, kind: "catalog-missing", record });
      }
    });
    externalWorks.forEach((external) => {
      next.push({ id: external.id, kind: "external", external, record: external.record });
    });
    return next.sort(sortRows);
  }, [externalWorks, userWorks, workById]);
  const filteredRows = rows?.filter((row) => row.record.readingState === activeState) ?? [];
  const selectedRow =
    panel === undefined || panel === "search"
      ? undefined
      : rows?.find((row) => row.kind === panel.kind && row.id === panel.id);

  if (rows === undefined) {
    return (
      <main className="library-page library-page--loading">
        <p aria-live="polite">{libraryStrings.loading}</p>
      </main>
    );
  }

  const closePanel = () => {
    setPanel(undefined);
    setMessage(undefined);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % READING_STATES.length;
    if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + READING_STATES.length) % READING_STATES.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = READING_STATES.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    const nextState = READING_STATES[nextIndex];
    if (nextState !== undefined) {
      setActiveState(nextState);
      tabRefs.current[nextIndex]?.focus();
    }
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
      } else {
        await saveUserWork(record);
      }
      setMessage({ kind: "status", text: libraryStrings.editor.saved });
    } catch {
      setMessage({ kind: "error", text: libraryStrings.editor.error });
    } finally {
      saveInFlight.current = false;
      setBusy(false);
    }
  };

  const openSearch = (opener: HTMLElement) => {
    setOpener(opener);
    setMessage(undefined);
    setPanel("search");
  };

  return (
    <main className="library-page">
      <header className="library-header">
        <div>
          <h1>{libraryStrings.title}</h1>
          <p>{libraryStrings.description}</p>
        </div>
        <button
          className="library-add-button interactive-press"
          onClick={(event) => openSearch(event.currentTarget)}
          type="button"
        >
          {libraryStrings.addWork}
        </button>
      </header>
      {storageDegraded ? (
        <p className="library-warning" role="status">
          {libraryStrings.storageWarning}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <section className="library-empty">
          <h2>{libraryStrings.overallEmpty.title}</h2>
          <p>{libraryStrings.overallEmpty.description}</p>
          <button
            className="interactive-press"
            onClick={(event) => openSearch(event.currentTarget)}
            type="button"
          >
            {libraryStrings.addWork}
          </button>
        </section>
      ) : (
        <>
          <div aria-label={libraryStrings.tablistLabel} className="library-tabs" role="tablist">
            {READING_STATES.map((state, index) => (
              <button
                aria-controls={`library-tabpanel-${state}`}
                aria-selected={activeState === state}
                className="interactive-press"
                id={`library-tab-${state}`}
                key={state}
                onClick={() => setActiveState(state)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                role="tab"
                tabIndex={activeState === state ? 0 : -1}
                type="button"
              >
                {libraryStrings.tabs[state]}
              </button>
            ))}
          </div>
          <section
            aria-labelledby={`library-tab-${activeState}`}
            id={`library-tabpanel-${activeState}`}
            role="tabpanel"
            tabIndex={0}
          >
            {filteredRows.length === 0 ? (
              <div className="library-empty">
                <p>{libraryStrings.tabEmpty[activeState]}</p>
              </div>
            ) : (
              <ul
                aria-label={libraryStrings.listLabel(libraryStrings.tabs[activeState])}
                className="library-list"
              >
                {filteredRows.map((row) => {
                  const title = rowTitle(row);
                  const creators = rowCreators(row);
                  const reaction = row.record.reaction;
                  return (
                    <li
                      className="library-row"
                      data-library-row-kind={row.kind}
                      data-work-id={row.id}
                      key={`${row.kind}:${row.id}`}
                    >
                      <button
                        aria-label={rowOpenLabel(row)}
                        className="library-row__button"
                        onClick={(event) => {
                          setOpener(event.currentTarget);
                          setMessage(undefined);
                          setPanel({ id: row.id, kind: row.kind });
                        }}
                        type="button"
                      />
                      <div className="library-row__content">
                        <div className="library-row__cover">
                          <RowMedia row={row} size={200} />
                        </div>
                        <div className="library-row__identity">
                          <span className="library-row__title">{title}</span>
                          {row.kind === "catalog-missing" ? (
                            <span className="library-row__creators">
                              {libraryStrings.catalogMissing.workId(row.id)}
                            </span>
                          ) : (
                            <span className="library-row__creators">
                              {creators.join("・") || libraryStrings.unknownCreator}
                            </span>
                          )}
                          {row.kind === "external" ? (
                            <span className="library-external-badge">
                              {libraryStrings.externalBadge}
                            </span>
                          ) : null}
                          {row.kind === "catalog-missing" ? (
                            <span className="library-catalog-missing-badge">
                              {libraryStrings.catalogMissing.badge}
                            </span>
                          ) : null}
                        </div>
                        <div className="library-row__meta">
                          <span className="library-row__reaction">
                            {reaction === undefined ? null : (
                              <span aria-hidden="true">{reactionIcons[reaction]} </span>
                            )}
                            {libraryStrings.reactions[reaction ?? "none"]}
                          </span>
                          <time className="library-row__updated" dateTime={row.record.updatedAt}>
                            {libraryStrings.updatedAt(formatUpdatedAt(row.record.updatedAt))}
                          </time>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
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

      {selectedRow !== undefined ? (
        <ModalSurface
          fallbackFocusId={`library-tab-${activeState}`}
          label={
            selectedRow.kind === "catalog-missing"
              ? libraryStrings.catalogMissing.dialogLabel(selectedRow.id)
              : rowTitle(selectedRow)
          }
          onClose={closePanel}
          opener={opener}
          variant="detail"
        >
          <div className="library-detail">
            <div className="library-detail__identity">
              <RowMedia row={selectedRow} size={200} />
              <div className="library-detail__copy">
                <h2 id="library-detail-title">{rowTitle(selectedRow)}</h2>
                {selectedRow.kind === "catalog-missing" ? (
                  <p className="library-detail__creators">
                    {libraryStrings.catalogMissing.workId(selectedRow.id)}
                  </p>
                ) : (
                  <p className="library-detail__creators">
                    {rowCreators(selectedRow).join("・") || libraryStrings.unknownCreator}
                  </p>
                )}
                {selectedRow.kind === "external" ? (
                  <>
                    <span className="library-external-badge">{libraryStrings.externalBadge}</span>
                    <p className="library-external-note">{libraryStrings.externalExclusion}</p>
                  </>
                ) : null}
                {selectedRow.kind === "catalog-missing" ? (
                  <>
                    <span className="library-catalog-missing-badge">
                      {libraryStrings.catalogMissing.badge}
                    </span>
                    <p className="library-external-note">
                      {libraryStrings.catalogMissing.description}
                    </p>
                  </>
                ) : (
                  <Link
                    className="library-detail__link"
                    href={
                      selectedRow.kind === "catalog"
                        ? `/works/${encodeURIComponent(selectedRow.id)}`
                        : externalHref(selectedRow.id)
                    }
                  >
                    {selectedRow.kind === "catalog"
                      ? libraryStrings.panel.catalogDetail
                      : libraryStrings.panel.externalDetail}
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
              className="library-detail__message"
              role={message?.kind === "error" ? "alert" : "status"}
            >
              {message?.text}
            </p>
          </div>
        </ModalSurface>
      ) : null}
    </main>
  );
}
