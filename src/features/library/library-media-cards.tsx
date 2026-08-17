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

function formatUpdatedAt(value: string) {
  const time = Date.parse(value);
  return Number.isFinite(time) ? updatedAtFormatter.format(new Date(time)) : value;
}

export function RowMedia({
  catalogCoverUrls,
  className,
  onCoverSettled,
  requestedSize = 200,
  row,
}: Readonly<{
  catalogCoverUrls: ReadonlyMap<string, string | null>;
  className?: string;
  onCoverSettled?(workId: string): void;
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
      coverUrl={rowCoverUrl(row, catalogCoverUrls)}
      creators={rowCreators(row)}
      onSettled={row.kind === "catalog" ? () => onCoverSettled?.(row.id) : undefined}
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

function RowBadges({ row }: Readonly<{ row: LibraryRow }>) {
  return (
    <span className="flex min-w-0 flex-wrap gap-[var(--space-content-tight)] text-[length:var(--text-caption-size)]">
      <span className="rounded-[var(--radius-pill)] border border-line bg-surface-2 px-[var(--space-2)] py-[var(--space-1)] text-text">
        {libraryStrings.tabs[row.record.readingState]}
      </span>
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
    volume === undefined || total === undefined || total < 1
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
  onCoverSettled?(workId: string): void;
  onOpen(opener: HTMLElement, row: LibraryRow): void;
  row: LibraryRow;
  volumeCountByWorkId: ReadonlyMap<string, number>;
}>;

export function LibraryRecentCard({
  catalogCoverUrls,
  onCoverSettled,
  onOpen,
  row,
}: LibraryCardProps) {
  return (
    <article
      className="w-[min(44vw,10.5rem)] shrink-0 snap-start md:w-36"
      data-library-card-role="recent"
      data-library-row-kind={row.kind}
      data-work-id={row.id}
    >
      <Button
        aria-label={rowOpenLabel(row)}
        className="group/card relative block h-auto min-h-[var(--control-min-size)] w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1 p-0 text-start whitespace-normal text-text shadow-[var(--shadow-level-1)] hover:border-line-accent-subtle"
        onClick={(event) => onOpen(event.currentTarget, row)}
        type="button"
        variant="ghost"
      >
        <RowMedia
          catalogCoverUrls={catalogCoverUrls}
          className="rounded-none border-0"
          onCoverSettled={onCoverSettled}
          requestedSize={400}
          row={row}
        />
        <span className="absolute top-[var(--space-2)] left-[var(--space-2)] rounded-[var(--radius-pill)] border border-line-accent-subtle bg-surface-overlay px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-caption-size)] font-bold text-accent">
          {libraryStrings.tabs[row.record.readingState]}
        </span>
        <span className="absolute inset-x-0 bottom-0 grid gap-[var(--space-content-tight)] bg-[linear-gradient(to_top,var(--canvas)_0%,color-mix(in_oklch,var(--canvas)_94%,transparent)_62%,transparent_100%)] px-[var(--space-3)] pt-[var(--space-6)] pb-[var(--space-3)]">
          <strong className="line-clamp-2 leading-[var(--line-height-heading)] text-text-strong">
            {rowTitle(row)}
          </strong>
          <span className="line-clamp-1 text-[length:var(--text-caption-size)] text-text-muted">
            {libraryStrings.updatedAt(formatUpdatedAt(row.record.updatedAt))}
          </span>
        </span>
      </Button>
    </article>
  );
}

function LibraryReadingProgressCard({
  catalogCoverUrls,
  onCoverSettled,
  onOpen,
  row,
  volumeCountByWorkId,
}: LibraryCardProps) {
  return (
    <article
      className="h-full min-w-0"
      data-library-card-role="reading-progress"
      data-library-row-kind={row.kind}
      data-work-id={row.id}
    >
      <Button
        aria-label={rowOpenLabel(row)}
        className="group/card !grid h-full min-h-[var(--control-min-size)] w-full grid-cols-[5.25rem_minmax(0,1fr)] items-start justify-stretch gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)] text-start whitespace-normal text-text hover:border-line-accent-subtle"
        onClick={(event) => onOpen(event.currentTarget, row)}
        type="button"
        variant="ghost"
      >
        <RowMedia
          catalogCoverUrls={catalogCoverUrls}
          className="self-start"
          onCoverSettled={onCoverSettled}
          row={row}
        />
        <span className="grid min-w-0 content-between gap-[var(--space-content)] py-[var(--space-1)]">
          <span className="grid min-w-0 gap-[var(--space-content-tight)]">
            <strong className="line-clamp-2 leading-[var(--line-height-heading)] text-text-strong">
              {rowTitle(row)}
            </strong>
            <CreatorLine row={row} />
          </span>
          <ProgressDisplay row={row} volumeCountByWorkId={volumeCountByWorkId} />
          <span className="inline-flex min-h-[var(--control-min-size)] w-full items-center justify-center rounded-[var(--radius-control)] border border-line-accent px-[var(--space-2)] text-[length:var(--text-caption-size)] font-bold text-accent">
            {libraryStrings.editor.heading}
          </span>
        </span>
      </Button>
    </article>
  );
}

function LibraryPlannedCompactCard({
  catalogCoverUrls,
  onCoverSettled,
  onOpen,
  row,
}: LibraryCardProps) {
  return (
    <article
      className="h-full min-w-0"
      data-library-card-role="planned-compact"
      data-library-row-kind={row.kind}
      data-work-id={row.id}
    >
      <Button
        aria-label={rowOpenLabel(row)}
        className="group/card !grid h-full min-h-[var(--control-min-size)] w-full justify-stretch gap-[var(--space-content)] rounded-[var(--radius-card)] bg-transparent p-0 text-start whitespace-normal text-text"
        onClick={(event) => onOpen(event.currentTarget, row)}
        type="button"
        variant="ghost"
      >
        <span className="relative block w-full overflow-hidden rounded-[var(--radius-cover)] shadow-[var(--shadow-level-1)] transition-transform duration-[var(--motion-duration-feedback)] [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/card:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
          <RowMedia
            catalogCoverUrls={catalogCoverUrls}
            onCoverSettled={onCoverSettled}
            requestedSize={400}
            row={row}
          />
          {row.kind === "external" || row.kind === "catalog-missing" ? (
            <span className="absolute right-[var(--space-2)] bottom-[var(--space-2)] rounded-[var(--radius-pill)] border border-line bg-surface-overlay px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-caption-size)] text-text-muted">
              {row.kind === "external"
                ? libraryStrings.externalBadge
                : libraryStrings.catalogMissing.badge}
            </span>
          ) : null}
        </span>
        <span className="grid min-w-0 content-start gap-[var(--space-content-tight)]">
          <strong className="line-clamp-2 leading-[var(--line-height-heading)] text-text-strong">
            {rowTitle(row)}
          </strong>
          <CreatorLine row={row} />
        </span>
      </Button>
    </article>
  );
}

function LibraryStatusCard({
  catalogCoverUrls,
  onCoverSettled,
  onOpen,
  row,
  volumeCountByWorkId,
}: LibraryCardProps) {
  return (
    <article
      className="h-full min-w-0"
      data-library-card-role="status"
      data-library-row-kind={row.kind}
      data-reading-state={row.record.readingState}
      data-work-id={row.id}
    >
      <Button
        aria-label={rowOpenLabel(row)}
        className="group/card !grid h-full min-h-[var(--control-min-size)] w-full justify-stretch gap-[var(--space-content)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)] text-start whitespace-normal text-text hover:border-line-accent-subtle"
        onClick={(event) => onOpen(event.currentTarget, row)}
        type="button"
        variant="ghost"
      >
        <span className="relative block w-full">
          <RowMedia
            catalogCoverUrls={catalogCoverUrls}
            onCoverSettled={onCoverSettled}
            requestedSize={400}
            row={row}
          />
          <span className="absolute right-[var(--space-2)] bottom-[var(--space-2)] rounded-[var(--radius-pill)] border border-line bg-surface-overlay px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-caption-size)] font-bold text-text-strong">
            {libraryStrings.tabs[row.record.readingState]}
          </span>
        </span>
        <span className="grid min-w-0 content-start gap-[var(--space-content-tight)]">
          <strong className="line-clamp-2 leading-[var(--line-height-heading)] text-text-strong">
            {rowTitle(row)}
          </strong>
          <CreatorLine row={row} />
          <ProgressDisplay row={row} volumeCountByWorkId={volumeCountByWorkId} />
          <span className="line-clamp-1 text-[length:var(--text-caption-size)] text-text-muted">
            {libraryStrings.updatedAt(formatUpdatedAt(row.record.updatedAt))}
          </span>
        </span>
      </Button>
    </article>
  );
}

export function LibraryStateCard(props: LibraryCardProps) {
  if (props.row.record.readingState === "reading") {
    return <LibraryReadingProgressCard {...props} />;
  }
  if (props.row.record.readingState === "planned") {
    return <LibraryPlannedCompactCard {...props} />;
  }
  return <LibraryStatusCard {...props} />;
}

export function LibraryFavoriteCard({
  catalogCoverUrls,
  onCoverSettled,
  onOpen,
  row,
}: LibraryCardProps) {
  return (
    <article
      className="w-28 shrink-0 snap-start sm:w-32"
      data-library-card-role="favorite"
      data-library-row-kind={row.kind}
      data-work-id={row.id}
    >
      <Button
        aria-label={rowOpenLabel(row)}
        className="group/card !grid h-auto min-h-[var(--control-min-size)] w-full justify-stretch gap-[var(--space-content-tight)] rounded-[var(--radius-card)] bg-transparent p-0 text-start whitespace-normal text-text"
        onClick={(event) => onOpen(event.currentTarget, row)}
        type="button"
        variant="ghost"
      >
        <RowMedia
          catalogCoverUrls={catalogCoverUrls}
          className="shadow-[var(--shadow-level-1)] transition-transform duration-[var(--motion-duration-feedback)] [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/card:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
          onCoverSettled={onCoverSettled}
          requestedSize={400}
          row={row}
        />
        <strong className="line-clamp-1 text-[length:var(--text-caption-size)] text-text-strong">
          {rowTitle(row)}
        </strong>
      </Button>
    </article>
  );
}

export function LibraryListCard(props: LibraryCardProps) {
  return (
    <article
      className="h-full min-w-0"
      data-library-card-role="list"
      data-library-row-kind={props.row.kind}
      data-work-id={props.row.id}
    >
      <Button
        aria-label={rowOpenLabel(props.row)}
        className="!grid h-full min-h-[var(--control-min-size)] w-full grid-cols-[5rem_minmax(0,1fr)] items-start justify-stretch gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)] text-start whitespace-normal text-text hover:border-line-accent-subtle"
        onClick={(event) => props.onOpen(event.currentTarget, props.row)}
        type="button"
        variant="ghost"
      >
        <RowMedia
          catalogCoverUrls={props.catalogCoverUrls}
          onCoverSettled={props.onCoverSettled}
          row={props.row}
        />
        <span className="grid min-w-0 content-start gap-[var(--space-content-tight)]">
          <strong className="line-clamp-2 text-text-strong">{rowTitle(props.row)}</strong>
          <CreatorLine row={props.row} />
          <RowBadges row={props.row} />
          <ProgressDisplay row={props.row} volumeCountByWorkId={props.volumeCountByWorkId} />
          <span className="line-clamp-1 text-[length:var(--text-caption-size)] text-text-muted">
            {libraryStrings.updatedAt(formatUpdatedAt(props.row.record.updatedAt))}
          </span>
        </span>
      </Button>
    </article>
  );
}
