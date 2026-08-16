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
  highlighted?: boolean;
}>;

export function FactorBar({
  label,
  state,
  value,
  animateReveal,
  revealReady,
  revealDelay = 0,
  highlighted = false,
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
      className={cn("taste-factor-bar", highlighted && "taste-factor-bar--highlighted")}
    >
      <span className="taste-factor-bar__heading">
        <span>{label}</span>
        <span className="taste-factor-bar__value">
          {valueLabel === null ? tasteStrings.unknown : valueLabel}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "taste-factor-bar__track",
          knownValue === null && "taste-factor-bar__track--unknown",
        )}
        ref={animateReveal && !revealComplete ? revealTrackRef : undefined}
      >
        {knownValue === null ? null : animateReveal && !revealComplete ? (
          revealReady ? (
            <m.span
              animate={{ scaleX: revealInView ? knownValue / 4 : 0 }}
              className="taste-factor-bar__fill taste-factor-bar__fill--reveal"
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
              className="taste-factor-bar__fill taste-factor-bar__fill--reveal"
              data-reveal-ready="false"
              style={{ transform: "scaleX(0)", transformOrigin: "left" }}
            />
          )
        ) : (
          <span
            className="taste-factor-bar__fill"
            style={{ transform: `scaleX(${String(knownValue / 4)})`, transformOrigin: "left" }}
          />
        )}
      </span>
    </div>
  );
}
