import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

import { buttonClassName } from "@/components/design-system/button";
import { HeroBackdrop } from "@/components/media/hero-backdrop";
import { AXIS_IDS } from "@/domain/catalog/constants";
import { landingStrings } from "@/lib/strings";

import { LandingLogoReveal } from "./landing-logo-reveal";
import { LandingSampleCard } from "./landing-sample-card";
import type { LandingSample } from "./landing-types";

const workCountFormat = new Intl.NumberFormat("ja-JP");

export const landingCtaClassName = buttonClassName({
  className:
    "gap-[var(--space-content)] px-[var(--space-6)] py-[var(--space-3)] text-[length:var(--font-size-16)] font-bold",
});

/**
 * Where the visitor stands, so the single landing action continues their own path: a new visitor
 * starts, an interrupted onboarding resumes its saved draft, a usable profile returns to its
 * recommendations, and a profile needing works keeps the existing recovery path.
 */
export type LandingVisitorState = "new" | "resume" | "profile" | "recovery";

export function LandingCta({ visitor = "new" }: Readonly<{ visitor?: LandingVisitorState }>) {
  return (
    <Link
      className={landingCtaClassName}
      data-landing-visitor={visitor}
      preload={false}
      to={visitor === "profile" ? "/recommendations" : "/onboarding"}
    >
      {landingStrings.ctaByVisitor[visitor]}
      <ArrowRightIcon aria-hidden="true" className="size-4" />
    </Link>
  );
}

type HomeHeroProps = Readonly<{
  sample: LandingSample;
  recommendableWorkCount: number;
  coverUrls: ReadonlyMap<string, string | null>;
  backdropUrl?: string | null;
  onCoverVisible(workId: string): void;
  staticLogo?: boolean;
  visitor?: LandingVisitorState;
  sharedEntry?: boolean;
}>;

export function HomeHero({
  backdropUrl,
  coverUrls,
  onCoverVisible,
  recommendableWorkCount,
  sample,
  sharedEntry = false,
  staticLogo = false,
  visitor = "new",
}: HomeHeroProps) {
  const recommendedId = sample.recommendation.work.id;

  return (
    <HeroBackdrop coverUrl={backdropUrl} priority>
      <section
        aria-labelledby="landing-title"
        className="mx-auto grid w-full max-w-[var(--layout-width-media)] content-center gap-[var(--space-8)] px-[var(--layout-page-padding)] pt-[var(--space-8)] pb-[var(--space-12)] md:min-h-[72vh] md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:gap-[var(--space-12)] md:pt-[var(--space-12)]"
      >
        <div className="grid max-w-[36rem] justify-items-start gap-[var(--space-6)]">
          <LandingLogoReveal staticPresentation={staticLogo} />
          <div className="grid gap-[var(--space-4)]">
            {sharedEntry ? (
              <p className="text-[length:var(--text-caption-size)] font-bold text-accent">
                {landingStrings.sharedEntry}
              </p>
            ) : null}
            <h1
              className="font-display text-[length:var(--text-hero-size)] leading-[var(--line-height-display)] font-bold tracking-tight text-text-strong"
              id="landing-title"
            >
              {/* Each phrase is one unbreakable unit, so the tagline never wraps mid-word. */}
              {landingStrings.taglinePhrases.map((phrase) => (
                <span className="inline-block" key={phrase}>
                  {phrase}
                </span>
              ))}
            </h1>
            <p className="max-w-[32rem] text-[length:var(--text-body-size)] leading-[var(--line-height-body)] text-text-muted [word-break:auto-phrase]">
              {landingStrings.description(AXIS_IDS.length)}
            </p>
          </div>
          <div className="grid justify-items-start gap-[var(--space-4)]">
            <LandingCta visitor={visitor} />
            {visitor === "new" ? null : (
              <p className="text-[length:var(--text-caption-size)] text-text">
                {landingStrings.visitorNote[visitor]}
              </p>
            )}
            <p className="text-[length:var(--text-caption-size)] text-text-muted">
              {landingStrings.hero
                .trust(workCountFormat.format(recommendableWorkCount))
                .join(" · ")}
            </p>
          </div>
        </div>

        <LandingSampleCard
          coverUrl={coverUrls.get(recommendedId)}
          onCoverVisible={() => onCoverVisible(recommendedId)}
          sample={sample}
        />
      </section>
    </HeroBackdrop>
  );
}
