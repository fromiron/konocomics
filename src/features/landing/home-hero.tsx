import { ArrowRightIcon } from "lucide-react";

import { CoverImage } from "@/components/cover/CoverImage";
import { buttonClassName } from "@/components/design-system/button";
import { HeroBackdrop } from "@/components/media/hero-backdrop";
import { Link } from "@tanstack/react-router";
import { landingStrings } from "@/lib/strings";

import { LandingLogoReveal } from "./landing-logo-reveal";
import type { LandingWork } from "./landing-types";

type HomeHeroProps = Readonly<{
  works: readonly LandingWork[];
  coverUrls: ReadonlyMap<string, string | null>;
  backdropUrl?: string | null;
  onFirstCoverSettled?: () => void;
  staticLogo?: boolean;
}>;

export function HomeHero({
  backdropUrl,
  coverUrls,
  onFirstCoverSettled,
  staticLogo = false,
  works,
}: HomeHeroProps) {
  const [leadWork, ...supportWorks] = works;

  return (
    <HeroBackdrop coverUrl={backdropUrl} priority>
      <section
        aria-labelledby="landing-title"
        className="mx-auto grid w-full max-w-[var(--layout-width-media)] content-center gap-[var(--space-6)] px-[var(--layout-page-padding)] pt-[var(--space-8)] pb-[var(--space-12)] md:min-h-[68vh] md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-[var(--space-8)] md:pt-[var(--space-12)]"
      >
        <div className="grid max-w-[38rem] justify-items-start gap-[var(--space-4)]">
          <LandingLogoReveal staticPresentation={staticLogo} />
          <div className="grid gap-[var(--space-3)]">
            <p className="text-[length:var(--text-caption-size)] font-bold tracking-[0.14em] text-accent">
              {landingStrings.hero.eyebrow}
            </p>
            <h1
              className="max-w-[16ch] font-display text-[length:var(--text-hero-size)] leading-[var(--line-height-display)] font-bold text-balance text-text-strong"
              id="landing-title"
            >
              {landingStrings.tagline}
            </h1>
            <p className="max-w-[32rem] text-[length:var(--text-body-size)] leading-[var(--line-height-body)] text-text-muted">
              {landingStrings.description.join("")}
            </p>
          </div>
          <Link
            className={buttonClassName({
              className:
                "mt-[var(--space-2)] gap-[var(--space-content)] px-[var(--space-6)] py-[var(--space-3)] text-[length:var(--font-size-16)] font-bold",
            })}
            preload={false}
            to="/onboarding"
          >
            {landingStrings.cta}
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </Link>
          <ul className="mt-[var(--space-4)] flex list-none flex-wrap items-center gap-x-[var(--space-5)] gap-y-[var(--space-content)] p-0 text-[length:var(--text-caption-size)] text-text-muted">
            {landingStrings.hero.trust.map((benefit) => (
              <li
                className="flex min-w-0 items-center gap-[var(--space-content)] before:inline-block before:size-1 before:shrink-0 before:rounded-full before:bg-text-muted/60"
                key={benefit}
              >
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto flex w-full max-w-[24rem] items-end justify-center gap-[var(--space-3)] md:max-w-none md:gap-[var(--space-4)]"
        >
          {supportWorks.slice(0, 2).map((work, index) => (
            <CoverImage
              className={
                index === 0
                  ? "w-[30%] shrink-0 opacity-80 saturate-[0.85] md:mb-[var(--space-6)]"
                  : "order-last w-[30%] shrink-0 opacity-80 saturate-[0.85] md:mb-[var(--space-6)]"
              }
              coverUrl={coverUrls.get(work.id)}
              creators={work.creators}
              decorative
              key={work.id}
              requestedSize={400}
              title={work.title}
            />
          ))}
          {leadWork === undefined ? null : (
            <CoverImage
              className="z-10 w-[46%] shrink-0 shadow-[0_24px_64px_color-mix(in_oklch,var(--canvas)_78%,transparent)] md:w-[52%]"
              coverUrl={coverUrls.get(leadWork.id)}
              creators={leadWork.creators}
              decorative
              onSettled={onFirstCoverSettled}
              priority
              requestedSize={600}
              title={leadWork.title}
            />
          )}
        </div>
      </section>
    </HeroBackdrop>
  );
}
