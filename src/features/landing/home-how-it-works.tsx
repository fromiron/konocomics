import { useId, type CSSProperties, type ReactNode } from "react";

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

/** Each DNA row rises over a fifth of its scene's spacer, one row a little after the last. */
function barRiseRange(index: number) {
  const start = 18 + index * 6;
  return `cover ${String(start)}% cover ${String(start + 20)}%`;
}

/** The recommendations card surface: a quiet card that a cover backdrop can tint. */
const cardClassName =
  "relative isolate overflow-hidden rounded-[var(--radius-media-card)] border border-line/70 bg-surface-1";

type SceneProps = Readonly<{
  number: number;
  step: Readonly<{ title: string; description: string }>;
  /** A cover that tints the whole scene, like a featured recommendation card. */
  backdropUrl?: string | null;
  children: ReactNode;
}>;

/** One full-screen scene: a large step number and title beside the sample's real result. */
function Scene({ backdropUrl, number, step, children }: SceneProps) {
  return (
    <li className="home-story__scene" data-scene={number}>
      {backdropUrl === undefined ? null : (
        <span aria-hidden="true" className="home-story__tint">
          <CoverBackdrop coverUrl={backdropUrl} />
        </span>
      )}
      <div className="home-story__scene-body">
        <div className="home-story__scene-copy">
          <span aria-hidden="true" className="home-story__number">
            {String(number).padStart(2, "0")}
          </span>
          <h3 className="home-story__title">{step.title}</h3>
          <p className="home-story__description">{step.description}</p>
        </div>
        <div className="home-story__scene-proof">{children}</div>
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
 * How it works as three full-screen scenes on one pinned stage: the example's chosen works, the
 * Manga DNA they produce, and the engine's recommendation with its reason. Each scene blinks
 * into the next (blur and contrast) as the page scrolls through three screen-tall spacers, and a
 * 01·02·03 index follows along. One sample profile runs through all three, so the section shows a
 * real result rather than describing one. Without scroll timelines the scenes simply stack.
 */
export function HomeHowItWorks({
  sample,
  coverUrls,
  onCoverVisible,
  animateReason = false,
}: HomeHowItWorksProps) {
  const [firstAnchor] = sample.anchorWorks;
  const recommendedId = sample.recommendation.work.id;
  const [choose, see, recommend] = landingStrings.how.steps;
  // The reason writes itself once its scene holds the stage (the third spacer is in view).
  const reasonEntryRef = useEntryOnce<HTMLSpanElement>({ threshold: 0.5 });

  return (
    <section aria-label={landingStrings.how.progressLabel} className="home-story">
      <figure className="home-story__stage">
        <figcaption className="home-story__caption">
          {landingStrings.sample.caption(
            sample.anchorWorks.slice(0, CAPTION_ANCHOR_COUNT).map((anchor) => anchor.title),
          )}
        </figcaption>
        <ol aria-hidden="true" className="home-story__index">
          {[choose, see, recommend].map((step, index) => (
            <li data-scene={index + 1} key={step.title}>
              {String(index + 1).padStart(2, "0")}
            </li>
          ))}
        </ol>
        <ol className="home-story__scenes">
          <Scene number={1} step={choose}>
            <ul aria-label={landingStrings.how.anchorsLabel} className="home-story__covers">
              {sample.anchorWorks.map((work, index) => (
                <li
                  key={work.id}
                  style={
                    {
                      "--cover-index": index,
                      "--cover-offset": index - (sample.anchorWorks.length - 1) / 2,
                    } as CSSProperties
                  }
                >
                  <CoverImage
                    coverUrl={coverUrls.get(work.id)}
                    creators={work.creators}
                    onVisible={() => onCoverVisible(work.id)}
                    requestedSize={400}
                    title={work.title}
                  />
                </li>
              ))}
            </ul>
          </Scene>
          <Scene number={2} step={see}>
            <div className="grid gap-[var(--space-5)]" data-slot="landing-sample-dna">
              <p className="flex flex-wrap items-baseline justify-between gap-x-[var(--space-3)] gap-y-[var(--space-content-tight)]">
                <span className="text-[length:var(--font-size-20)] font-bold text-text-strong">
                  {landingStrings.how.dnaTitle}
                </span>
                {firstAnchor === undefined ? null : (
                  <span className="text-[length:var(--text-caption-size)] text-text-muted">
                    {landingStrings.how.dnaBasis(firstAnchor.title, sample.anchorWorks.length - 1)}
                  </span>
                )}
              </p>
              <ul className="home-story__bars m-0 grid list-none gap-[var(--space-5)] p-0">
                {sample.axes.map((axis, index) => (
                  <li
                    key={axis.axisId}
                    style={{ "--scroll-range": barRiseRange(index) } as CSSProperties}
                  >
                    <FactorBar
                      animateReveal={false}
                      enterDelay={0.2 + index * 0.08}
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
          </Scene>
          <Scene backdropUrl={coverUrls.get(recommendedId)} number={3} step={recommend}>
            <div
              className={cn(
                cardClassName,
                "home-story__card p-[var(--space-5)] md:p-[var(--space-6)]",
              )}
            >
              <LandingSampleRecommendation
                animateReason={animateReason}
                coverUrl={coverUrls.get(recommendedId)}
                onCoverVisible={() => onCoverVisible(recommendedId)}
                sample={sample}
              />
            </div>
          </Scene>
        </ol>
      </figure>
      {/* Three screen-tall spacers drive the scenes; they carry no content. */}
      <div aria-hidden="true" className="home-story__spacers">
        <span className="home-story__spacer" data-scene={1} />
        <span className="home-story__spacer" data-scene={2} />
        <span
          className="home-story__spacer"
          data-scene={3}
          ref={animateReason ? reasonEntryRef : undefined}
        />
      </div>
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
