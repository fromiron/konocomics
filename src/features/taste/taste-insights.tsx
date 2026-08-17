import { Link } from "@tanstack/react-router";

import { CoverImage } from "@/components/cover/CoverImage";
import type { Work } from "@/domain/catalog/types";
import type { MangaDnaSummary } from "@/domain/profile/dna-summary";
import { explanationLexicon, mediaStrings, tasteStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

const RADAR_AXIS_LIMIT = 7;
const RADAR_CENTER = 50;
const RADAR_RADIUS = 42;
const RADAR_MAX = 4;

type RadarAxis = Readonly<{
  factorId: MangaDnaSummary["axes"][number]["factorId"];
  value: number;
}>;

function radarPoint(index: number, count: number, radius: number) {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  return `${String(RADAR_CENTER + Math.cos(angle) * radius)},${String(
    RADAR_CENTER + Math.sin(angle) * radius,
  )}`;
}

function radarPoints(axes: readonly RadarAxis[], radiusFor: (axis: RadarAxis) => number) {
  return axes.map((axis, index) => radarPoint(index, axes.length, radiusFor(axis))).join(" ");
}

export function DnaRadarChart({ axes }: Readonly<Pick<MangaDnaSummary, "axes">>) {
  const confirmedAxes = axes
    .flatMap<RadarAxis>((axis) =>
      axis.state === "known" && axis.value !== null
        ? [{ factorId: axis.factorId, value: axis.value }]
        : [],
    )
    .sort(
      (left, right) =>
        right.value - left.value ||
        (left.factorId < right.factorId ? -1 : left.factorId > right.factorId ? 1 : 0),
    )
    .slice(0, RADAR_AXIS_LIMIT);
  const canDrawRadar = confirmedAxes.length >= 3;

  return (
    <section
      aria-labelledby="taste-radar-heading"
      className="taste-overview taste-radar surface-card grid content-start gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)] md:p-[var(--space-4)]"
    >
      <h2 className="text-[length:var(--text-subheading-size)]" id="taste-radar-heading">
        {tasteStrings.radarHeading}
      </h2>
      {confirmedAxes.length === 0 ? (
        <p>{tasteStrings.radarPending}</p>
      ) : (
        <div className="taste-radar__content grid grid-cols-1 items-center gap-[var(--space-3)]">
          {canDrawRadar ? (
            <svg
              aria-hidden="true"
              className="aspect-square w-full max-w-[calc(var(--space-12)*5)] justify-self-center md:max-w-[calc(var(--space-12)*6)]"
              focusable="false"
              viewBox="0 0 100 100"
            >
              {[1, 2, 3, 4].map((level) => (
                <polygon
                  className="taste-radar__grid fill-none stroke-line [stroke-width:1] [vector-effect:non-scaling-stroke]"
                  key={level}
                  points={radarPoints(confirmedAxes, () => (RADAR_RADIUS * level) / RADAR_MAX)}
                />
              ))}
              {confirmedAxes.map((axis, index) => (
                <line
                  className="taste-radar__axis fill-none stroke-line [stroke-width:1] [vector-effect:non-scaling-stroke]"
                  key={axis.factorId}
                  x1={RADAR_CENTER}
                  x2={radarPoint(index, confirmedAxes.length, RADAR_RADIUS).split(",")[0]}
                  y1={RADAR_CENTER}
                  y2={radarPoint(index, confirmedAxes.length, RADAR_RADIUS).split(",")[1]}
                />
              ))}
              <polygon
                className="taste-radar__value fill-accent-soft stroke-accent [stroke-linejoin:round] [stroke-width:2] [vector-effect:non-scaling-stroke]"
                points={radarPoints(
                  confirmedAxes,
                  (axis) => (RADAR_RADIUS * axis.value) / RADAR_MAX,
                )}
              />
            </svg>
          ) : null}
          <ul className="m-0 grid min-w-0 list-none grid-cols-1 gap-x-[var(--space-3)] border-t border-line p-0 pt-[var(--space-content-tight)] min-[420px]:grid-cols-2">
            {confirmedAxes.map((axis) => (
              <li
                className="flex min-h-[var(--space-7)] min-w-0 items-center justify-between gap-[var(--space-content)] border-b border-line px-[var(--space-content-tight)] py-[var(--space-content-tight)] text-[length:var(--font-size-12)]"
                key={axis.factorId}
              >
                <span className="min-w-0 truncate">
                  {explanationLexicon.factorLabels[axis.factorId]}
                </span>
                <strong className="shrink-0 whitespace-nowrap text-[length:var(--font-size-12)] text-accent">
                  {tasteStrings.factorValue(axis.value)}
                </strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function WorkPreviewList({
  coverUrls,
  ids,
  label,
  onCoverSettled,
  worksById,
}: Readonly<{
  ids: readonly string[];
  label: string;
  worksById: ReadonlyMap<string, Work>;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverSettled(workId: string): void;
}>) {
  return (
    <section
      aria-label={label}
      className="taste-recommendation-preview__list grid min-w-0 content-start gap-[var(--space-content)] rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-3)]"
    >
      <h3 className="border-b border-line pb-[var(--space-content-tight)] text-[length:var(--font-size-14)]">
        {label}
      </h3>
      {ids.length === 0 ? (
        <p className="text-text-muted">{tasteStrings.previewEmpty}</p>
      ) : (
        <ol className="m-0 grid list-none grid-cols-2 gap-[var(--space-content)] p-0 min-[360px]:grid-cols-4">
          {ids.map((workId) => {
            const work = worksById.get(workId);
            return (
              <li className="min-w-0" key={workId}>
                {work === undefined ? (
                  <code className="text-[length:var(--text-caption-size)] text-text-strong [overflow-wrap:anywhere]">
                    {workId}
                  </code>
                ) : (
                  <Link
                    aria-label={mediaStrings.openDetails(work.title)}
                    className="group/preview grid min-h-[var(--control-min-size)] gap-[var(--space-content-tight)] rounded-[var(--radius-cover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    params={{ workId }}
                    preload={false}
                    to="/works/$workId"
                  >
                    <CoverImage
                      className="w-full transition-transform duration-[var(--motion-duration-feedback)] [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:group-hover/preview:-translate-y-0.5 motion-reduce:transition-none"
                      coverUrl={coverUrls.get(workId)}
                      creators={work.creators}
                      decorative
                      onSettled={() => onCoverSettled(workId)}
                      requestedSize={200}
                      title={work.title}
                    />
                    <strong className="line-clamp-2 text-[length:var(--font-size-12)] leading-tight text-text-strong">
                      {work.title}
                    </strong>
                    <code className="sr-only">{workId}</code>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

export function RecommendationDiffPreview({
  after,
  before,
  className,
  coverUrls,
  onCoverSettled,
  worksById,
}: Readonly<{
  after: readonly string[] | null;
  before: readonly string[] | null;
  className?: string;
  worksById: ReadonlyMap<string, Work>;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverSettled(workId: string): void;
}>) {
  const available = before !== null && after !== null;
  const unchanged =
    available &&
    before.length === after.length &&
    before.every((workId, index) => workId === after[index]);

  return (
    <section
      aria-labelledby="taste-recommendation-preview-heading"
      className={cn(
        "taste-recommendation-preview surface-card mt-[var(--space-4)] grid gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-3)]",
        className,
      )}
    >
      <div className="grid gap-[var(--space-content-tight)]">
        <h2
          className="text-[length:var(--text-subheading-size)]"
          id="taste-recommendation-preview-heading"
        >
          {tasteStrings.previewHeading}
        </h2>
        <p className="text-[length:var(--font-size-12)] text-text-muted">
          {tasteStrings.previewDescription}
        </p>
      </div>
      {available ? (
        <div className="taste-recommendation-preview__body grid gap-[var(--space-content)]">
          <div className="taste-recommendation-preview__columns grid grid-cols-1 items-start gap-[var(--space-content)] md:grid-cols-2">
            <WorkPreviewList
              coverUrls={coverUrls}
              ids={before}
              label={tasteStrings.previewBefore}
              onCoverSettled={onCoverSettled}
              worksById={worksById}
            />
            <WorkPreviewList
              coverUrls={coverUrls}
              ids={after}
              label={tasteStrings.previewAfter}
              onCoverSettled={onCoverSettled}
              worksById={worksById}
            />
          </div>
          <p
            aria-atomic="true"
            aria-live="polite"
            className="taste-recommendation-preview__status rounded-[var(--radius-card)] border border-line bg-surface-2 px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--font-size-12)] font-bold text-accent"
          >
            {unchanged ? tasteStrings.previewUnchanged : tasteStrings.previewChanged}
          </p>
        </div>
      ) : (
        <p>{tasteStrings.previewUnavailable}</p>
      )}
    </section>
  );
}
