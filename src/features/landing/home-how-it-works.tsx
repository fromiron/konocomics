import { useId, type ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { SectionHeading } from "@/components/layout/section-heading";
import { CoverBackdrop } from "@/components/media/cover-backdrop";
import { FactorBar } from "@/components/media/factor-bar";
import { useEntryOnce } from "@/components/motion/use-entry-once";
import { explanationLexicon, landingStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { LandingCta, type LandingVisitorState } from "./home-hero";
import { LandingSampleRecommendation } from "./landing-sample-card";
import type { LandingSample } from "./landing-types";

const CAPTION_ANCHOR_COUNT = 2;

/** The recommendations card surface: a quiet card that a cover backdrop can tint. */
const cardClassName =
  "relative isolate overflow-hidden rounded-[var(--radius-card)] border border-line/70 bg-surface-1";

type StepCardProps = Readonly<{
  number: number;
  step: Readonly<{ title: string; description: string }>;
  backdropUrl?: string | null;
  entryRef?: (element: HTMLLIElement | null) => void;
  children: ReactNode;
}>;

/**
 * One step: its order and title, a line on what happens, then the sample's real result. Steps
 * light up in reading order as the page scrolls past them (`.home-step`, CSS scroll timelines).
 */
function StepCard({ backdropUrl, entryRef, number, step, children }: StepCardProps) {
  return (
    <li
      className={cn(cardClassName, "home-step p-[var(--space-4)] md:p-[var(--space-5)]")}
      ref={entryRef}
    >
      {backdropUrl === undefined ? null : (
        // The cover tint arrives last, as the recommendation step lights up.
        <span aria-hidden="true" className="home-step__tint absolute inset-0">
          <CoverBackdrop coverUrl={backdropUrl} />
        </span>
      )}
      <div className="relative z-10 grid content-start gap-[var(--space-4)]">
        <div className="grid gap-[var(--space-content-tight)]">
          <h3 className="flex items-baseline gap-[var(--space-2)] text-[length:var(--font-size-16)] font-bold text-text-strong">
            <span aria-hidden="true" className="font-display text-accent-ink tabular-nums">
              {String(number).padStart(2, "0")}
            </span>
            {step.title}
          </h3>
          <p className="text-[length:var(--font-size-14)] leading-[var(--line-height-body)] text-text-muted [word-break:auto-phrase]">
            {step.description}
          </p>
        </div>
        {children}
      </div>
    </li>
  );
}

type HomeHowItWorksProps = Readonly<{
  sample: LandingSample;
  coverUrls: ReadonlyMap<string, string | null>;
  onCoverVisible(workId: string): void;
  animateReason?: boolean;
}>;

/**
 * How it works in three cards, in the recommendations page's language: the example's chosen
 * works, the Manga DNA they produce, and the engine's recommendation with its reason, the last
 * card tinted by its cover like a featured recommendation. One sample profile runs through all
 * three, so the section shows a real result rather than describing one.
 */
export function HomeHowItWorks({
  sample,
  coverUrls,
  onCoverVisible,
  animateReason = false,
}: HomeHowItWorksProps) {
  const headingId = useId();
  const [firstAnchor] = sample.anchorWorks;
  const recommendedId = sample.recommendation.work.id;
  const [choose, see, recommend] = landingStrings.how.steps;
  // The reason writes itself once the recommendation card is well into view.
  const reasonEntryRef = useEntryOnce<HTMLLIElement>({ threshold: 0.6, bottomInset: "20%" });

  return (
    <section aria-labelledby={headingId} className="min-w-0">
      <SectionHeading compact id={headingId} title={landingStrings.how.title} />
      <figure className="m-0 grid gap-[var(--space-3)]">
        <figcaption className="text-[length:var(--text-caption-size)] text-text-muted">
          {landingStrings.sample.caption(
            sample.anchorWorks.slice(0, CAPTION_ANCHOR_COUNT).map((anchor) => anchor.title),
          )}
        </figcaption>
        <ol className="home-steps m-0 grid list-none gap-[var(--space-3)] p-0 lg:grid-cols-3">
          <StepCard number={1} step={choose}>
            <ul
              aria-label={landingStrings.how.anchorsLabel}
              className="m-0 grid list-none grid-cols-5 gap-[var(--space-2)] p-0 lg:grid-cols-3"
            >
              {sample.anchorWorks.map((work) => (
                <li key={work.id}>
                  <CoverImage
                    coverUrl={coverUrls.get(work.id)}
                    creators={work.creators}
                    onVisible={() => onCoverVisible(work.id)}
                    requestedSize={200}
                    title={work.title}
                  />
                </li>
              ))}
            </ul>
          </StepCard>
          <StepCard number={2} step={see}>
            <div className="grid gap-[var(--space-4)]" data-slot="landing-sample-dna">
              <p className="flex flex-wrap items-baseline justify-between gap-x-[var(--space-3)] gap-y-[var(--space-content-tight)]">
                <span className="font-bold text-text-strong">{landingStrings.how.dnaTitle}</span>
                {firstAnchor === undefined ? null : (
                  <span className="text-[length:var(--text-caption-size)] text-text-muted">
                    {landingStrings.how.dnaBasis(firstAnchor.title, sample.anchorWorks.length - 1)}
                  </span>
                )}
              </p>
              <ul className="m-0 grid list-none gap-[var(--space-4)] p-0">
                {sample.axes.map((axis, index) => (
                  <li key={axis.axisId}>
                    <FactorBar
                      animateReveal={false}
                      enterDelay={0.25 + index * 0.08}
                      enterFill
                      label={explanationLexicon.factorLabels[axis.axisId]}
                      revealReady
                      state="known"
                      value={axis.value}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </StepCard>
          <StepCard
            backdropUrl={coverUrls.get(recommendedId)}
            entryRef={animateReason ? reasonEntryRef : undefined}
            number={3}
            step={recommend}
          >
            <LandingSampleRecommendation
              animateReason={animateReason}
              coverUrl={coverUrls.get(recommendedId)}
              onCoverVisible={() => onCoverVisible(recommendedId)}
              sample={sample}
            />
          </StepCard>
        </ol>
      </figure>
    </section>
  );
}

type HomeClosingProps = Readonly<{
  visitor?: LandingVisitorState;
  /** The example recommendation's cover, which tints the block like a featured card. */
  backdropUrl?: string | null;
}>;

/** The page's last block: the same single action on a card tinted by the example's cover. */
export function HomeClosing({ backdropUrl, visitor = "new" }: HomeClosingProps) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className={cn(cardClassName, "p-[var(--space-6)] md:p-[var(--space-8)]")}
    >
      <CoverBackdrop coverUrl={backdropUrl} />
      <div className="relative z-10 grid justify-items-start gap-[var(--space-4)]">
        <SectionHeading
          className="mb-0"
          description={landingStrings.closing.description}
          id={headingId}
          title={landingStrings.closing.title}
        />
        <LandingCta visitor={visitor} />
      </div>
    </section>
  );
}
