"use client";

import { CoverImage } from "@/components/cover/CoverImage";
import { Button } from "@/components/design-system/button";
import type { Work } from "@/domain/catalog/types";
import type { UserWorkRecord } from "@/domain/profile/types";
import type { ExternalWorkRecord } from "@/infrastructure/db";
import { libraryStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

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

const updatedAtFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
  timeZone: "Asia/Tokyo",
});

export function rowTitle(row: LibraryRow) {
  if (row.kind === "catalog") return row.work.title;
  if (row.kind === "external") return row.external.title;
  return libraryStrings.catalogMissing.title;
}

export function rowCreators(row: LibraryRow) {
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

export function formatUpdatedAt(value: string) {
  const time = Date.parse(value);
  return Number.isFinite(time) ? updatedAtFormatter.format(new Date(time)) : value;
}

export function RowMedia({
  catalogCoverUrls,
  className,
  coverUrl,
  onCoverVisible,
  requestedSize = 400,
  row,
}: Readonly<{
  catalogCoverUrls: ReadonlyMap<string, string | null>;
  className?: string;
  coverUrl?: string;
  onCoverVisible?(workId: string): void;
  requestedSize?: 200 | 400;
  row: LibraryRow;
}>) {
  if (row.kind === "catalog-missing") {
    return (
      <div
        className={cn(
          "grid w-full place-items-center overflow-hidden rounded-[var(--radius-cover)] border border-dashed border-line bg-canvas text-text-muted [aspect-ratio:30/43]",
          className,
        )}
      >
        <span className="px-[var(--space-2)] text-center text-[length:var(--text-caption-size)] leading-[var(--line-height-body)]">
          {libraryStrings.catalogMissing.coverUnavailable}
        </span>
      </div>
    );
  }

  return (
    <CoverImage
      className={className}
      coverUrl={coverUrl ?? rowCoverUrl(row, catalogCoverUrls)}
      creators={rowCreators(row)}
      onVisible={row.kind === "catalog" ? () => onCoverVisible?.(row.id) : undefined}
      requestedSize={requestedSize}
      title={rowTitle(row)}
    />
  );
}

function CreatorLine({ row }: Readonly<{ row: LibraryRow }>) {
  return (
    <span className="line-clamp-1 text-[length:var(--text-caption-size)] text-text-muted">
      {row.kind === "catalog-missing"
        ? libraryStrings.catalogMissing.workId(row.id)
        : rowCreators(row).join("・") || libraryStrings.unknownCreator}
    </span>
  );
}

function RowBadges({ row, showState }: Readonly<{ row: LibraryRow; showState: boolean }>) {
  return (
    <span className="flex min-w-0 flex-wrap gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)]">
      {showState ? (
        <span className="text-text">{libraryStrings.tabs[row.record.readingState]}</span>
      ) : null}
      {row.record.reaction === undefined ? null : (
        <span
          className={
            row.record.reaction === "favorite" ? "font-bold text-accent" : "text-text-muted"
          }
        >
          {libraryStrings.reactions[row.record.reaction]}
        </span>
      )}
      {row.kind === "external" ? (
        <span className="rounded-[var(--radius-pill)] border border-line px-[var(--space-2)] py-[var(--space-1)] text-text-muted">
          {libraryStrings.externalBadge}
        </span>
      ) : null}
      {row.kind === "catalog-missing" ? (
        <span className="rounded-[var(--radius-pill)] border border-line px-[var(--space-2)] py-[var(--space-1)] text-text-muted">
          {libraryStrings.catalogMissing.badge}
        </span>
      ) : null}
    </span>
  );
}

function ProgressDisplay({
  row,
  volumeCountByWorkId,
}: Readonly<{
  row: LibraryRow;
  volumeCountByWorkId: ReadonlyMap<string, number>;
}>) {
  const volume = row.record.progress?.volume;
  const chapter = row.record.progress?.chapter;
  if (volume === undefined && chapter === undefined) return null;

  const label = libraryStrings.progress(volume, chapter);
  const total = row.kind === "catalog" ? volumeCountByWorkId.get(row.id) : undefined;
  const percentage =
    row.record.readingState !== "reading" ||
    volume === undefined ||
    total === undefined ||
    total < 1
      ? undefined
      : Math.min(100, Math.round((volume / total) * 100));

  return (
    <span className="grid gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)] text-text-muted">
      <span className="flex items-center justify-between gap-[var(--space-2)]">
        <span>{label}</span>
        {percentage === undefined ? null : (
          <span className="font-bold text-text tabular-nums">{String(percentage)}%</span>
        )}
      </span>
      {percentage === undefined || total === undefined || volume === undefined ? null : (
        <progress
          aria-label={libraryStrings.editor.progress}
          aria-valuetext={label}
          className="h-[var(--space-content-tight)] w-full overflow-hidden rounded-[var(--radius-pill)] border-0 bg-surface-3 text-accent [&::-moz-progress-bar]:bg-accent [&::-webkit-progress-bar]:bg-surface-3 [&::-webkit-progress-value]:bg-accent"
          max={total}
          value={Math.min(volume, total)}
        />
      )}
    </span>
  );
}

type LibraryCardProps = Readonly<{
  catalogCoverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible?(workId: string): void;
  onOpen(opener: HTMLElement, row: LibraryRow): void;
  row: LibraryRow;
  showState: boolean;
  view: "grid" | "list";
  volumeCountByWorkId: ReadonlyMap<string, number>;
}>;

export function LibraryStateCard({
  catalogCoverUrls,
  onCoverVisible,
  onOpen,
  row,
  showState,
  view,
  volumeCountByWorkId,
}: LibraryCardProps) {
  return (
    <article
      className="h-full min-w-0"
      data-library-row-kind={row.kind}
      data-reading-state={row.record.readingState}
      data-work-id={row.id}
    >
      <Button
        aria-label={rowOpenLabel(row)}
        className={cn(
          "group/card !grid h-full min-h-[var(--control-min-size)] w-full items-start justify-stretch gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line/70 bg-surface-1 p-[var(--space-3)] text-start whitespace-normal text-text focus-visible:shadow-[var(--shadow-raised)] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[var(--shadow-raised)]",
          view === "list" ? "grid-cols-[calc(var(--space-8)*2)_minmax(0,1fr)]" : "content-start",
        )}
        onClick={(event) => onOpen(event.currentTarget, row)}
        type="button"
        variant="ghost"
      >
        <RowMedia catalogCoverUrls={catalogCoverUrls} onCoverVisible={onCoverVisible} row={row} />
        <span className="grid min-w-0 content-start gap-[var(--space-content-tight)]">
          <strong className="[overflow-wrap:anywhere] leading-[var(--line-height-heading)] text-text-strong">
            {rowTitle(row)}
          </strong>
          <CreatorLine row={row} />
          <RowBadges row={row} showState={showState} />
          <ProgressDisplay row={row} volumeCountByWorkId={volumeCountByWorkId} />
          <span className="text-[length:var(--text-caption-size)] text-text-muted">
            {libraryStrings.editRecord}
          </span>
        </span>
      </Button>
    </article>
  );
}
