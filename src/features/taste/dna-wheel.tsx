"use client";

import { useInView } from "motion/react";
import { type CSSProperties, useId, useRef, useState } from "react";

import type { AxisId, Work } from "@/domain/catalog/types";
import type { MangaDnaSummary } from "@/domain/profile/dna-summary";
import { explanationLexicon, tasteStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

const CENTER = 170;
const INNER_RADIUS = 72;
const OUTER_RADIUS = 140;
const AXIS_LIMIT = 8;
const SEGMENT_GAP = 0.055;

function point(radius: number, angle: number) {
  return [CENTER + radius * Math.cos(angle), CENTER + radius * Math.sin(angle)];
}

function segmentPath(start: number, end: number, outerRadius: number) {
  const innerStart = point(INNER_RADIUS, start);
  const outerStart = point(outerRadius, start);
  const outerEnd = point(outerRadius, end);
  const innerEnd = point(INNER_RADIUS, end);
  const largeArc = end - start > Math.PI ? 1 : 0;
  return `M${innerStart}L${outerStart}A${outerRadius},${outerRadius} 0 ${largeArc} 1 ${outerEnd}L${innerEnd}A${INNER_RADIUS},${INNER_RADIUS} 0 ${largeArc} 0 ${innerStart}Z`;
}

export function DnaWheel({
  animateReveal,
  summary,
  worksById,
}: Readonly<{
  animateReveal: boolean;
  summary: MangaDnaSummary;
  worksById: ReadonlyMap<string, Work>;
}>) {
  const id = useId();
  const [selectedId, setSelectedId] = useState<AxisId | null>(null);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const segmentRefs = useRef(new Map<AxisId, SVGGElement>());
  const wheelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wheelRef, { once: true, amount: 0.2 });
  const axes = summary.axes
    .flatMap((axis) =>
      axis.state === "known" && axis.value !== null ? [{ ...axis, value: axis.value }] : [],
    )
    .sort(
      (left, right) =>
        right.value - left.value ||
        (left.factorId < right.factorId ? -1 : left.factorId > right.factorId ? 1 : 0),
    )
    .slice(0, AXIS_LIMIT);
  const selected = axes.find((axis) => axis.factorId === selectedId);
  const toggle = (factorId: AxisId) =>
    setSelectedId((current) => (current === factorId ? null : factorId));
  const strings = tasteStrings.wheel;

  return (
    <section aria-labelledby="taste-axes-heading" className="taste-axes grid gap-[var(--space-4)]">
      <header className="grid gap-[var(--space-1)]">
        <h2
          className="text-[length:var(--text-subheading-size)] text-text-strong"
          id="taste-axes-heading"
        >
          {tasteStrings.axesHeading}
        </h2>
        {axes.length === 0 ? null : (
          <p className="text-[length:var(--font-size-14)] text-text-muted">
            {strings.description(axes.length)}
          </p>
        )}
      </header>
      {axes.length === 0 ? (
        <p className="text-text-muted">{tasteStrings.axesPending}</p>
      ) : (
        <div className="taste-dna-emblem">
          <div className="taste-dna-emblem__layout">
            <div className="taste-dna-wheel mx-auto w-full max-w-96" ref={wheelRef}>
              <svg
                aria-label={strings.label}
                className="block h-auto w-full"
                role="group"
                viewBox="0 0 340 340"
              >
                <defs>
                  <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="var(--accent)" />
                    <stop offset="1" stopColor="var(--accent-hover)" />
                  </linearGradient>
                </defs>
                {axes.map((axis, index) => {
                  const start =
                    -Math.PI / 2 + (index * Math.PI * 2) / axes.length + SEGMENT_GAP / 2;
                  const end =
                    -Math.PI / 2 + ((index + 1) * Math.PI * 2) / axes.length - SEGMENT_GAP / 2;
                  const radius = INNER_RADIUS + (axis.value / 4) * (OUTER_RADIUS - INNER_RADIUS);
                  const badge = point(OUTER_RADIUS + 17, (start + end) / 2);
                  const label = explanationLexicon.factorLabels[axis.factorId];
                  return (
                    <g
                      aria-controls={`${id}-center`}
                      aria-label={strings.segmentLabel(label, tasteStrings.factorValue(axis.value))}
                      aria-pressed={selected?.factorId === axis.factorId}
                      className="taste-dna-segment"
                      data-axis-id={axis.factorId}
                      data-entered={inView ? "true" : undefined}
                      data-reduced-motion="fade"
                      data-settled={entranceComplete ? "true" : undefined}
                      key={axis.factorId}
                      onAnimationEnd={(event) => {
                        if (event.target === event.currentTarget && index === axes.length - 1) {
                          setEntranceComplete(true);
                        }
                      }}
                      onClick={() => toggle(axis.factorId)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          toggle(axis.factorId);
                          return;
                        }
                        const nextIndex =
                          event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? axes.length - 1
                              : event.key === "ArrowRight" || event.key === "ArrowDown"
                                ? (index + 1) % axes.length
                                : event.key === "ArrowLeft" || event.key === "ArrowUp"
                                  ? (index + axes.length - 1) % axes.length
                                  : null;
                        if (nextIndex === null) return;
                        event.preventDefault();
                        const next = axes[nextIndex];
                        if (next === undefined) return;
                        setSelectedId(next.factorId);
                        segmentRefs.current.get(next.factorId)?.focus();
                      }}
                      ref={(node) => {
                        if (node) segmentRefs.current.set(axis.factorId, node);
                        else segmentRefs.current.delete(axis.factorId);
                      }}
                      role="button"
                      style={
                        {
                          "--dna-segment-delay": `${(animateReveal ? 500 : 0) + index * 70}ms`,
                        } as CSSProperties
                      }
                      tabIndex={
                        (selected?.factorId ?? axes[0]?.factorId) === axis.factorId ? 0 : -1
                      }
                    >
                      <path
                        className="taste-dna-segment__track"
                        d={segmentPath(start, end, OUTER_RADIUS)}
                      />
                      {axis.value === 0 ? null : (
                        <path
                          className="taste-dna-segment__fill"
                          d={segmentPath(start, end, radius)}
                          fill={index < 3 ? `url(#${id}-accent)` : "var(--dna-muted-fill)"}
                        />
                      )}
                      {index < 3 ? (
                        <g aria-hidden="true" className="pointer-events-none">
                          <circle cx={badge[0]} cy={badge[1]} fill="var(--accent)" r={11} />
                          <text
                            className="taste-dna-wheel__rank"
                            dominantBaseline="central"
                            textAnchor="middle"
                            x={badge[0]}
                            y={badge[1]}
                          >
                            {index + 1}
                          </text>
                        </g>
                      ) : null}
                    </g>
                  );
                })}
                <foreignObject
                  aria-hidden="true"
                  height={120}
                  id={`${id}-center`}
                  width={132}
                  x={104}
                  y={110}
                >
                  <div className="taste-dna-wheel__center">
                    <strong>
                      {selected === undefined
                        ? strings.name
                        : explanationLexicon.factorLabels[selected.factorId]}
                    </strong>
                    <span>
                      {selected === undefined
                        ? strings.count(axes.length)
                        : tasteStrings.factorValue(selected.value)}
                    </span>
                  </div>
                </foreignObject>
              </svg>
              <p aria-live="polite" className="sr-only">
                {selected === undefined
                  ? strings.count(axes.length)
                  : `${explanationLexicon.factorLabels[selected.factorId]}: ${tasteStrings.factorValue(selected.value)}`}
              </p>
            </div>
            <div className="min-w-0">
              <p className="taste-dna-statement">
                {axes.slice(0, 3).map((axis, index) => (
                  <span key={axis.factorId}>
                    {index === 0 ? null : (
                      <span className="px-[var(--space-2)] text-accent">×</span>
                    )}
                    {explanationLexicon.factorLabels[axis.factorId]}
                  </span>
                ))}
              </p>
              <p className="mt-[var(--space-2)] mb-[var(--space-4)] text-[length:var(--text-caption-size)] text-text-muted">
                {strings.basis(summary.analyzedWorkIds.length)}
              </p>
              <ul className="m-0 grid list-none gap-[var(--space-1)] p-0">
                {axes.map((axis, index) => {
                  const label = explanationLexicon.factorLabels[axis.factorId];
                  const evidence = axis.anchorWorkIds.flatMap((workId) => {
                    const work = worksById.get(workId);
                    return work === undefined ? [] : [work.title];
                  });
                  return (
                    <li key={axis.factorId}>
                      <button
                        aria-controls={`${id}-center`}
                        aria-label={strings.axisLabel(label, tasteStrings.factorValue(axis.value))}
                        aria-describedby={
                          evidence.length === 0 ? undefined : `${id}-${axis.factorId}-evidence`
                        }
                        aria-pressed={selected?.factorId === axis.factorId}
                        className="taste-dna-axis"
                        data-axis-id={axis.factorId}
                        onClick={() => toggle(axis.factorId)}
                        type="button"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "taste-dna-axis__rank",
                            index < 3 && "taste-dna-axis__rank--top",
                          )}
                        >
                          {index < 3 ? index + 1 : "·"}
                        </span>
                        <strong className="taste-dna-axis__name">{label}</strong>
                        <span className={cn("taste-dna-axis__level", index < 3 && "text-accent")}>
                          {tasteStrings.factorValue(axis.value)}
                        </span>
                        {evidence.length === 0 ? null : (
                          <span
                            className="taste-dna-axis__evidence"
                            id={`${id}-${axis.factorId}-evidence`}
                          >
                            {tasteStrings.topPreferenceEvidence(evidence)}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-[var(--space-4)] text-[length:var(--text-caption-size)] text-text-muted">
                {strings.hint}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
