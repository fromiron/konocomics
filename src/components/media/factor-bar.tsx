"use client";

import { m, useInView } from "motion/react";
import { useRef, useState } from "react";

import type { DnaPreferenceState } from "@/domain/profile/dna-summary";
import { tasteStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type FactorBarProps = Readonly<{
  label: string;
  state: DnaPreferenceState;
  value: number | null;
  animateReveal: boolean;
  revealReady: boolean;
  revealDelay?: number;
  /** Text for an axis without a confirmed value; defaults to the Manga DNA wording. */
  unknownLabel?: string;
  /** A comparison marker (for example the viewer's taste) drawn on the same 0–4 track. */
  reference?: Readonly<{ value: number; label: string }>;
}>;

export function FactorBar({
  label,
  state,
  value,
  animateReveal,
  revealReady,
  revealDelay = 0,
  reference,
  unknownLabel = tasteStrings.unknown,
}: FactorBarProps) {
  const [revealComplete, setRevealComplete] = useState(false);
  const revealTrackRef = useRef<HTMLSpanElement>(null);
  const revealInView = useInView(revealTrackRef, { amount: 0.4, once: true });
  const knownValue = state === "known" && value !== null ? value : null;
  const valueLabel = knownValue === null ? null : tasteStrings.factorValue(knownValue);
  const referenceText = reference === undefined ? "" : `（${reference.label}）`;
  const accessibilityProps =
    valueLabel === null
      ? ({ "aria-label": `${label}: ${unknownLabel}${referenceText}`, role: "group" } as const)
      : ({
          "aria-label": label,
          "aria-valuemax": 4,
          "aria-valuemin": 0,
          // Exposed to assistive tech as one decimal; the fill keeps the exact value.
          "aria-valuenow": knownValue === null ? undefined : Math.round(knownValue * 10) / 10,
          "aria-valuetext": `${valueLabel}${referenceText}`,
          role: "meter",
        } as const);

  return (
    <div
      {...accessibilityProps}
      className="taste-factor-bar relative grid gap-[var(--space-content-tight)]"
    >
      <span className="taste-factor-bar__heading flex items-baseline justify-between gap-[var(--space-content-loose)] text-[length:var(--text-caption-size)] font-bold text-text-strong">
        <span>{label}</span>
        <span className="taste-factor-bar__value whitespace-nowrap text-[length:var(--text-caption-size)] font-medium text-text-muted">
          {valueLabel === null ? unknownLabel : valueLabel}
        </span>
      </span>
      <span className="relative block">
        <span
          aria-hidden="true"
          className={cn(
            "taste-factor-bar__track block h-1.5 overflow-hidden rounded-full bg-line",
            knownValue === null &&
              "taste-factor-bar__track--unknown border border-line bg-transparent",
          )}
          ref={animateReveal && !revealComplete ? revealTrackRef : undefined}
        >
          {knownValue === null ? null : animateReveal && !revealComplete ? (
            revealReady ? (
              <m.span
                animate={{ scaleX: revealInView ? knownValue / 4 : 0 }}
                className="taste-factor-bar__fill taste-factor-bar__fill--reveal block h-full w-full origin-left rounded-[inherit] bg-accent motion-reduce:transition-none"
                data-reveal-ready="true"
                initial={{ scaleX: 0 }}
                onAnimationComplete={() => {
                  if (revealInView) setRevealComplete(true);
                }}
                style={{ transformOrigin: "left" }}
                transition={{ delay: revealDelay, duration: 0.4, ease: "easeOut" }}
              />
            ) : (
              <span
                className="taste-factor-bar__fill taste-factor-bar__fill--reveal block h-full w-full origin-left rounded-[inherit] bg-accent motion-reduce:transition-none"
                data-reveal-ready="false"
                style={{ transform: "scaleX(0)", transformOrigin: "left" }}
              />
            )
          ) : (
            <span
              className="taste-factor-bar__fill block h-full w-full origin-left rounded-[inherit] bg-accent transition-transform duration-[var(--motion-duration-value)] ease-[var(--motion-ease-value)] motion-reduce:transition-none"
              style={{ transform: `scaleX(${String(knownValue / 4)})`, transformOrigin: "left" }}
            />
          )}
        </span>
        {reference === undefined ? null : (
          <span
            aria-hidden="true"
            className="taste-factor-bar__reference absolute top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-text-strong"
            data-factor-reference
            style={{ left: `${String((Math.min(4, Math.max(0, reference.value)) / 4) * 100)}%` }}
          />
        )}
      </span>
    </div>
  );
}
