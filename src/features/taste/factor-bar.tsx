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
}>;

export function FactorBar({
  label,
  state,
  value,
  animateReveal,
  revealReady,
  revealDelay = 0,
}: FactorBarProps) {
  const [revealComplete, setRevealComplete] = useState(false);
  const revealTrackRef = useRef<HTMLSpanElement>(null);
  const revealInView = useInView(revealTrackRef, { amount: 0.4, once: true });
  const knownValue = state === "known" && value !== null ? value : null;
  const valueLabel = knownValue === null ? null : tasteStrings.factorValue(knownValue);
  const accessibilityProps =
    valueLabel === null
      ? ({ "aria-label": `${label}: ${tasteStrings.unknown}`, role: "group" } as const)
      : ({
          "aria-label": label,
          "aria-valuemax": 4,
          "aria-valuemin": 0,
          "aria-valuenow": knownValue ?? undefined,
          "aria-valuetext": valueLabel,
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
          {valueLabel === null ? tasteStrings.unknown : valueLabel}
        </span>
      </span>
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
    </div>
  );
}
