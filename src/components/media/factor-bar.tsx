"use client";

import { m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

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
  /**
   * Fill from 0 the first time the bar enters the viewport in this mount (04 §6 E). The meter's
   * accessible value is final from the start; only the drawn fill waits.
   */
  enterFill?: boolean;
  /** Stagger for `enterFill`, in seconds. */
  enterDelay?: number;
}>;

const ENTER_FILL_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";

export function FactorBar({
  label,
  state,
  value,
  animateReveal,
  revealReady,
  revealDelay = 0,
  reference,
  unknownLabel = tasteStrings.unknown,
  enterFill = false,
  enterDelay = 0,
}: FactorBarProps) {
  const [revealComplete, setRevealComplete] = useState(false);
  const revealTrackRef = useRef<HTMLSpanElement>(null);
  const revealInView = useInView(revealTrackRef, { amount: 0.4, once: true });
  const enterTrackRef = useRef<HTMLSpanElement>(null);
  // Without IntersectionObserver there is no way to wait, so the bar starts filled.
  const [enterInView, setEnterInView] = useState(() => typeof IntersectionObserver === "undefined");
  const reducedMotion = useReducedMotion() === true;
  const usesEnterFill = enterFill && !animateReveal;
  // Reduced motion shows the final length at once; the track fades in instead (04 §6 E).
  const enterFilled = !usesEnterFill || reducedMotion || enterInView;

  useEffect(() => {
    const element = enterTrackRef.current;
    if (!usesEnterFill || enterInView || element === null) return;
    // Any visible part counts: the track is a few pixels tall, so ratio thresholds miss it.
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      setEnterInView(true);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [enterInView, usesEnterFill]);
  const [enterSettled, setEnterSettled] = useState(false);
  // During the reveal the qualitative label follows the settled bar (04 §5.2).
  const labelWaitsForReveal = animateReveal && !revealComplete && !reducedMotion;
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
        <span
          className="taste-factor-bar__value whitespace-nowrap text-[length:var(--text-caption-size)] font-medium text-text-muted transition-opacity duration-[var(--motion-duration-page)] ease-[var(--motion-ease-direct)]"
          data-reduced-motion="fade"
          style={knownValue !== null && labelWaitsForReveal ? { opacity: 0 } : undefined}
        >
          {valueLabel === null ? unknownLabel : valueLabel}
        </span>
      </span>
      <span
        className="relative block"
        ref={usesEnterFill ? enterTrackRef : undefined}
        {...(usesEnterFill
          ? { "data-reduced-motion": "fade", "data-reduced-motion-enter": "" }
          : {})}
      >
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
              data-enter-fill={usesEnterFill ? (enterFilled ? "filled" : "waiting") : undefined}
              onTransitionEnd={() => {
                if (enterFilled) setEnterSettled(true);
              }}
              style={{
                transform: `scaleX(${String(enterFilled ? knownValue / 4 : 0)})`,
                transformOrigin: "left",
                ...(usesEnterFill && enterFilled && !reducedMotion && !enterSettled
                  ? {
                      transitionDuration: "600ms",
                      transitionDelay: `${String(enterDelay)}s`,
                      transitionTimingFunction: ENTER_FILL_EASE,
                    }
                  : {}),
              }}
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
