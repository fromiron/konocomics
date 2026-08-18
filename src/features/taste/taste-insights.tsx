import { Link } from "@tanstack/react-router";

import { CoverImage } from "@/components/cover/CoverImage";
import type { Work } from "@/domain/catalog/types";
import type { MangaDnaSummary } from "@/domain/profile/dna-summary";
import { explanationLexicon, mediaStrings, tasteStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

const RADAR_AXIS_LIMIT = 7;
const RADAR_VIEWBOX_WIDTH = 180;
const RADAR_VIEWBOX_HEIGHT = 150;
const RADAR_CENTER_X = RADAR_VIEWBOX_WIDTH / 2;
const RADAR_CENTER_Y = 72;
const RADAR_RADIUS = 42;
const RADAR_LEADER_RADIUS = 49;
const RADAR_LABEL_RADIUS = 55;
const RADAR_MAX = 4;
const RADAR_LABEL_LINE_LENGTH = 7;
const RADAR_LABEL_LINE_HEIGHT = 6;

type RadarAxis = Readonly<{
  factorId: MangaDnaSummary["axes"][number]["factorId"];
  value: number;
}>;

type RadarPoint = Readonly<{
  x: number;
  y: number;
}>;

function radarPoint(index: number, count: number, radius: number): RadarPoint {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  return {
    x: RADAR_CENTER_X + Math.cos(angle) * radius,
    y: RADAR_CENTER_Y + Math.sin(angle) * radius,
  };
}

function radarPointValue(point: RadarPoint) {
  return `${String(point.x)},${String(point.y)}`;
}

function radarPoints(axes: readonly RadarAxis[], radiusFor: (axis: RadarAxis) => number) {
  return axes
    .map((axis, index) => radarPointValue(radarPoint(index, axes.length, radiusFor(axis))))
    .join(" ");
}

function radarLabelLines(label: string): readonly string[] {
  if (label.length <= RADAR_LABEL_LINE_LENGTH) return [label];

  const separatorIndex = label.indexOf("・");
  if (
    separatorIndex > 0 &&
    separatorIndex <= RADAR_LABEL_LINE_LENGTH &&
    label.length - separatorIndex - 1 <= RADAR_LABEL_LINE_LENGTH
  ) {
    return [label.slice(0, separatorIndex + 1), label.slice(separatorIndex + 1)];
  }

  const splitIndex = Math.ceil(label.length / 2);
  return [label.slice(0, splitIndex), label.slice(splitIndex)];
}

function radarTextAnchor(point: RadarPoint): "end" | "middle" | "start" {
  const horizontalDirection = (point.x - RADAR_CENTER_X) / RADAR_LABEL_RADIUS;
  if (horizontalDirection > 0.25) return "start";
  if (horizontalDirection < -0.25) return "end";
  return "middle";
}

function radarLabelY(point: RadarPoint, lineCount: number) {
  const verticalDirection = (point.y - RADAR_CENTER_Y) / RADAR_LABEL_RADIUS;
  const blockHeight = lineCount * RADAR_LABEL_LINE_HEIGHT;
  if (verticalDirection < -0.5) return point.y - blockHeight - 2;
  if (verticalDirection > 0.5) return point.y + 2;
  return point.y - blockHeight / 2;
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
              className="w-full justify-self-center overflow-visible"
              focusable="false"
              viewBox={`0 0 ${String(RADAR_VIEWBOX_WIDTH)} ${String(RADAR_VIEWBOX_HEIGHT)}`}
            >
              {[1, 2, 3, 4].map((level) => (
                <polygon
                  className="taste-radar__grid fill-none stroke-line [stroke-width:1] [vector-effect:non-scaling-stroke]"
                  key={level}
                  points={radarPoints(confirmedAxes, () => (RADAR_RADIUS * level) / RADAR_MAX)}
                />
              ))}
              {confirmedAxes.map((axis, index) => (
                <g key={axis.factorId}>
                  <line
                    className="taste-radar__axis fill-none stroke-line [stroke-width:1] [vector-effect:non-scaling-stroke]"
                    x1={RADAR_CENTER_X}
                    x2={radarPoint(index, confirmedAxes.length, RADAR_RADIUS).x}
                    y1={RADAR_CENTER_Y}
                    y2={radarPoint(index, confirmedAxes.length, RADAR_RADIUS).y}
                  />
                  <line
                    className="taste-radar__leader fill-none stroke-line [stroke-width:1] [vector-effect:non-scaling-stroke]"
                    x1={radarPoint(index, confirmedAxes.length, RADAR_RADIUS).x}
                    x2={radarPoint(index, confirmedAxes.length, RADAR_LEADER_RADIUS).x}
                    y1={radarPoint(index, confirmedAxes.length, RADAR_RADIUS).y}
                    y2={radarPoint(index, confirmedAxes.length, RADAR_LEADER_RADIUS).y}
                  />
                  <circle
                    className="taste-radar__leader-dot fill-text-muted"
                    cx={radarPoint(index, confirmedAxes.length, RADAR_LEADER_RADIUS).x}
                    cy={radarPoint(index, confirmedAxes.length, RADAR_LEADER_RADIUS).y}
                    r="0.9"
                  />
                </g>
              ))}
              <polygon
                className="taste-radar__value fill-accent-soft stroke-accent [stroke-linejoin:round] [stroke-width:2] [vector-effect:non-scaling-stroke]"
                points={radarPoints(
                  confirmedAxes,
                  (axis) => (RADAR_RADIUS * axis.value) / RADAR_MAX,
                )}
              />
              {confirmedAxes.map((axis, index) => {
                const valuePoint = radarPoint(
                  index,
                  confirmedAxes.length,
                  (RADAR_RADIUS * axis.value) / RADAR_MAX,
                );
                return (
                  <circle
                    className="taste-radar__value-dot fill-accent"
                    cx={valuePoint.x}
                    cy={valuePoint.y}
                    key={axis.factorId}
                    r="1.6"
                  />
                );
              })}
              {confirmedAxes.map((axis, index) => {
                const label = explanationLexicon.factorLabels[axis.factorId];
                const labelLines = radarLabelLines(label);
                const labelPoint = radarPoint(index, confirmedAxes.length, RADAR_LABEL_RADIUS);
                const lineCount = labelLines.length + 1;
                return (
                  <text
                    className="taste-radar__label fill-text-muted text-[5px] font-semibold"
                    dominantBaseline="hanging"
                    key={axis.factorId}
                    textAnchor={radarTextAnchor(labelPoint)}
                    x={labelPoint.x}
                    y={radarLabelY(labelPoint, lineCount)}
                  >
                    {labelLines.map((line, lineIndex) => (
                      <tspan
                        dy={lineIndex === 0 ? 0 : RADAR_LABEL_LINE_HEIGHT}
                        key={line}
                        x={labelPoint.x}
                      >
                        {line}
                      </tspan>
                    ))}
                    <tspan
                      className="fill-accent text-[5.25px] font-bold"
                      dy={RADAR_LABEL_LINE_HEIGHT}
                      x={labelPoint.x}
                    >
                      {tasteStrings.factorValue(axis.value)}
                    </tspan>
                  </text>
                );
              })}
            </svg>
          ) : null}
          <ul className="sr-only">
            {confirmedAxes.map((axis) => (
              <li key={axis.factorId}>
                {tasteStrings.radarAxisSummary(
                  explanationLexicon.factorLabels[axis.factorId],
                  tasteStrings.factorValue(axis.value),
                )}
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
