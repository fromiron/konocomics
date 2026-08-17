import type { MangaDnaSummary } from "@/domain/profile/dna-summary";
import { explanationLexicon, tasteStrings } from "@/lib/strings";

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
      className="taste-overview taste-radar surface-card grid content-start gap-[var(--space-4)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-5)]"
    >
      <h2 id="taste-radar-heading">{tasteStrings.radarHeading}</h2>
      {confirmedAxes.length === 0 ? (
        <p>{tasteStrings.radarPending}</p>
      ) : (
        <div className="taste-radar__content grid grid-cols-1 items-center gap-[var(--space-4)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {canDrawRadar ? (
            <svg
              aria-hidden="true"
              className="aspect-square w-full justify-self-center"
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
          <ul className="m-0 grid list-none gap-[var(--space-content)] p-0">
            {confirmedAxes.map((axis) => (
              <li
                className="flex min-h-[var(--control-min-size)] items-center justify-between gap-[var(--space-4)] border-b border-line px-[var(--space-3)] py-[var(--space-2)] last:border-b-0"
                key={axis.factorId}
              >
                <span>{explanationLexicon.factorLabels[axis.factorId]}</span>
                <strong className="whitespace-nowrap text-[length:var(--text-caption-size)] text-accent">
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

function WorkIdList({ ids, label }: Readonly<{ ids: readonly string[]; label: string }>) {
  return (
    <section
      aria-label={label}
      className="taste-recommendation-preview__list grid gap-[var(--space-content)] rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-4)]"
    >
      <h3>{label}</h3>
      {ids.length === 0 ? (
        <p className="text-text-muted">{tasteStrings.previewEmpty}</p>
      ) : (
        <ol className="m-0 grid gap-[var(--space-content-tight)] ps-[var(--space-5)]">
          {ids.map((workId) => (
            <li key={workId}>
              <code className="text-[length:var(--text-caption-size)] text-text-strong [overflow-wrap:anywhere]">
                {workId}
              </code>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function RecommendationDiffPreview({
  after,
  before,
}: Readonly<{
  after: readonly string[] | null;
  before: readonly string[] | null;
}>) {
  const available = before !== null && after !== null;
  const unchanged =
    available &&
    before.length === after.length &&
    before.every((workId, index) => workId === after[index]);

  return (
    <section
      aria-labelledby="taste-recommendation-preview-heading"
      className="taste-recommendation-preview surface-card mt-[var(--space-6)] grid gap-[var(--space-4)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-5)]"
    >
      <div className="grid gap-[var(--space-content)]">
        <h2 id="taste-recommendation-preview-heading">{tasteStrings.previewHeading}</h2>
        <p className="text-text-muted">{tasteStrings.previewDescription}</p>
      </div>
      {available ? (
        <div className="taste-recommendation-preview__body grid gap-[var(--space-content)]">
          <div className="taste-recommendation-preview__columns grid grid-cols-1 gap-[var(--space-content-loose)] md:grid-cols-2">
            <WorkIdList ids={before} label={tasteStrings.previewBefore} />
            <WorkIdList ids={after} label={tasteStrings.previewAfter} />
          </div>
          <p
            aria-atomic="true"
            aria-live="polite"
            className="taste-recommendation-preview__status font-bold text-accent"
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
