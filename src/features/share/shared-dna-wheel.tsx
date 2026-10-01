"use client";

import { useInView } from "motion/react";
import { type CSSProperties, useId, useRef, useState } from "react";

import type { DnaShareLink } from "@/domain/profile/dna-share";
import { DNA_WHEEL_VIEW_BOX, dnaWheelSegment } from "@/features/taste/dna-wheel-geometry";
import { dnaSharePageStrings, explanationLexicon, tasteStrings } from "@/lib/strings";

const strings = dnaSharePageStrings;

/** The shared DNA as a read-only wheel: the same geometry and entrance as the `/taste` wheel. */
export function SharedDnaWheel({ link }: Readonly<{ link: DnaShareLink }>) {
  const id = useId();
  const wheelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wheelRef, { once: true, amount: 0.2 });
  const [entranceComplete, setEntranceComplete] = useState(false);
  const ranks = new Map(link.topPositions.map((position, rank) => [position, rank + 1] as const));
  const label = strings.wheelLabel(
    link.axes.map((axis) =>
      strings.wheelAxis(
        explanationLexicon.factorLabels[axis.axisId] ?? "",
        tasteStrings.factorValue(axis.level),
      ),
    ),
  );

  return (
    <div className="taste-dna-wheel mx-auto w-full max-w-96" ref={wheelRef}>
      <svg
        aria-label={label}
        className="block h-auto w-full"
        role="img"
        viewBox={DNA_WHEEL_VIEW_BOX}
      >
        <defs>
          <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-hover)" />
          </linearGradient>
        </defs>
        {link.axes.map((axis, index) => {
          const segment = dnaWheelSegment(index, link.axes.length, axis.level);
          const rank = ranks.get(index);
          return (
            <g
              aria-hidden="true"
              className="taste-dna-segment"
              data-axis-id={axis.axisId}
              data-entered={inView ? "true" : undefined}
              data-reduced-motion="fade"
              data-settled={entranceComplete ? "true" : undefined}
              data-static="true"
              key={axis.axisId}
              onAnimationEnd={(event) => {
                if (event.target === event.currentTarget && index === link.axes.length - 1) {
                  setEntranceComplete(true);
                }
              }}
              style={{ "--dna-segment-delay": `${String(index * 70)}ms` } as CSSProperties}
            >
              <path className="taste-dna-segment__track" d={segment.trackPath} />
              {axis.level === 0 ? null : (
                <path
                  className="taste-dna-segment__fill"
                  d={segment.fillPath}
                  fill={rank === undefined ? "var(--dna-muted-fill)" : `url(#${id}-accent)`}
                />
              )}
              {rank === undefined ? null : (
                <g className="pointer-events-none">
                  <circle cx={segment.badge.x} cy={segment.badge.y} fill="var(--accent)" r={11} />
                  <text
                    className="taste-dna-wheel__rank"
                    dominantBaseline="central"
                    textAnchor="middle"
                    x={segment.badge.x}
                    y={segment.badge.y}
                  >
                    {rank}
                  </text>
                </g>
              )}
            </g>
          );
        })}
        <foreignObject aria-hidden="true" height={120} width={132} x={104} y={110}>
          <div className="taste-dna-wheel__center">
            <strong className="dna-share-wheel__count">{link.analyzedWorkCount}</strong>
            <span>{strings.centerUnit}</span>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
