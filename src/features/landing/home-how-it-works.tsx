import { useEffect, useRef } from "react";

import { FactorBar } from "@/components/media/factor-bar";
import { explanationLexicon, landingStrings } from "@/lib/strings";

import { LandingCta, type LandingVisitorState } from "./home-hero";
import type { LandingSample } from "./landing-types";

/** A finite reading-order cue; native scrolling never drives or loops this strip. */
export function HomeObi({ animate }: Readonly<{ animate: boolean }>) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!animate || element === null || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        element.dataset.entered = "true";
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [animate]);
  return (
    <div className="border-y border-line-accent-subtle bg-accent-soft px-[var(--layout-page-padding)] py-[var(--space-4)]">
      <ol
        aria-label={landingStrings.obi.label}
        className="landing-obi mx-auto flex max-w-[var(--layout-width-media)] flex-wrap items-center justify-center gap-x-[var(--space-6)] gap-y-[var(--space-2)] text-[length:var(--font-size-14)] font-bold text-text-strong"
        ref={ref}
      >
        {landingStrings.obi.steps.map((step, index) => (
          <li className="flex items-center gap-[var(--space-6)]" key={step}>
            {index > 0 ? (
              <span aria-hidden="true" className="text-accent">
                →
              </span>
            ) : null}
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Three steps beside the sample profile's real Manga DNA, so the promise is shown, not told. */
export function HomeHowItWorks({ sample }: Readonly<{ sample: LandingSample }>) {
  const [firstAnchor] = sample.anchorWorks;

  return (
    <section
      aria-labelledby="landing-how-title"
      className="grid items-start gap-[var(--space-8)] md:grid-cols-2 md:gap-[var(--space-12)]"
    >
      <div className="grid content-start gap-[var(--space-6)]">
        <h2
          className="text-[length:var(--text-subheading-size)] font-bold text-text-strong"
          id="landing-how-title"
        >
          {landingStrings.how.title}
        </h2>
        <ol className="m-0 grid list-none gap-[var(--space-5)] p-0">
          {landingStrings.how.steps.map((step, index) => (
            <li
              className="grid grid-cols-[var(--space-8)_minmax(0,1fr)] gap-x-[var(--space-3)]"
              key={step.title}
            >
              <span
                aria-hidden="true"
                className="font-display text-[length:var(--font-size-16)] font-bold text-text-muted tabular-nums"
              >
                {String(index + 1)}
              </span>
              <div className="grid gap-[var(--space-content-tight)]">
                <h3 className="text-[length:var(--font-size-16)] font-bold text-text-strong">
                  {step.title}
                </h3>
                <p className="text-[length:var(--font-size-14)] leading-[var(--line-height-body)] text-text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <figure
        className="m-0 grid gap-[var(--space-5)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-6)]"
        data-slot="landing-sample-dna"
      >
        <figcaption className="flex flex-wrap items-baseline justify-between gap-x-[var(--space-3)] gap-y-[var(--space-content-tight)]">
          <span className="font-bold text-text-strong">{landingStrings.how.dnaTitle}</span>
          {firstAnchor === undefined ? null : (
            <span className="text-[length:var(--text-caption-size)] text-text-muted">
              {landingStrings.how.dnaBasis(firstAnchor.title, sample.anchorWorks.length - 1)}
            </span>
          )}
        </figcaption>
        <ul className="m-0 grid list-none gap-[var(--space-4)] p-0">
          {sample.axes.map((axis) => (
            <li key={axis.axisId}>
              <FactorBar
                animateReveal={false}
                label={explanationLexicon.factorLabels[axis.axisId]}
                revealReady
                state="known"
                value={axis.value}
              />
            </li>
          ))}
        </ul>
      </figure>
    </section>
  );
}

export function HomeClosing({ visitor = "new" }: Readonly<{ visitor?: LandingVisitorState }>) {
  return (
    <section
      aria-labelledby="landing-closing-title"
      className="grid justify-items-start gap-[var(--space-4)] border-t border-line pt-[var(--space-shelf)]"
    >
      <h2
        className="text-[length:var(--text-subheading-size)] font-bold text-text-strong"
        id="landing-closing-title"
      >
        {landingStrings.closing.title}
      </h2>
      <p className="text-[length:var(--text-body-size)] text-text-muted">
        {landingStrings.closing.description}
      </p>
      <LandingCta visitor={visitor} />
    </section>
  );
}
