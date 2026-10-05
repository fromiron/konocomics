import type { ReactNode } from "react";

import { CoverImage } from "@/components/cover/CoverImage";
import { FactorBar } from "@/components/media/factor-bar";
import { explanationLexicon, landingStrings } from "@/lib/strings";

import { LandingCta, type LandingVisitorState } from "./home-hero";
import { LandingSampleRecommendation } from "./landing-sample-card";
import type { LandingSample } from "./landing-types";

const CAPTION_ANCHOR_COUNT = 2;

type KomaPanelProps = Readonly<{
  number: number;
  step: Readonly<{ title: string; description: string }>;
  children: ReactNode;
}>;

/** One panel of the strip: an ink frame, its reading-order number, the step, then its proof. */
function KomaPanel({ number, step, children }: KomaPanelProps) {
  return (
    <li className="koma">
      <span aria-hidden="true" className="koma__number">
        {String(number)}
      </span>
      <div className="grid gap-[var(--space-content-tight)]">
        <h3 className="text-[length:var(--font-size-16)] font-bold text-text-strong">
          {step.title}
        </h3>
        <p className="text-[length:var(--font-size-14)] leading-[var(--line-height-body)] text-text-muted [word-break:auto-phrase]">
          {step.description}
        </p>
      </div>
      {children}
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
 * How it works as a three-panel manga strip, read in order: the example's chosen works, the
 * Manga DNA they produce, and the engine's recommendation with its reason. One sample profile
 * runs through all three panels, so the strip shows a real result rather than describing one.
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

  return (
    <section aria-labelledby="landing-how-title" className="grid gap-[var(--space-5)]">
      <h2 className="home-section-title" id="landing-how-title">
        {landingStrings.how.title}
      </h2>
      <figure className="m-0 grid gap-[var(--space-3)]">
        <figcaption className="text-[length:var(--text-caption-size)] text-text-muted">
          {landingStrings.sample.caption(
            sample.anchorWorks.slice(0, CAPTION_ANCHOR_COUNT).map((anchor) => anchor.title),
          )}
        </figcaption>
        <ol className="koma-strip">
          <KomaPanel number={1} step={choose}>
            <ul aria-label={landingStrings.how.anchorsLabel} className="koma-covers">
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
          </KomaPanel>
          <KomaPanel number={2} step={see}>
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
            </div>
          </KomaPanel>
          <KomaPanel number={3} step={recommend}>
            <LandingSampleRecommendation
              animateReason={animateReason}
              coverUrl={coverUrls.get(recommendedId)}
              onCoverVisible={() => onCoverVisible(recommendedId)}
              sample={sample}
            />
          </KomaPanel>
        </ol>
      </figure>
    </section>
  );
}

/** The last panel of the page: the same single action, framed like a closing manga panel. */
export function HomeClosing({ visitor = "new" }: Readonly<{ visitor?: LandingVisitorState }>) {
  return (
    <section aria-labelledby="landing-closing-title" className="home-closing">
      <div className="relative z-[1] grid justify-items-start gap-[var(--space-4)]">
        <h2 className="home-section-title" id="landing-closing-title">
          {landingStrings.closing.title}
        </h2>
        <p className="text-[length:var(--text-body-size)] text-text-muted [word-break:auto-phrase]">
          {landingStrings.closing.description}
        </p>
        <LandingCta visitor={visitor} />
      </div>
    </section>
  );
}
