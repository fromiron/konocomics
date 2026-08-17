import { ArrowRightIcon, HardDriveIcon, HeartIcon, ShieldCheckIcon } from "lucide-react";

import { CoverImage } from "@/components/cover/CoverImage";
import { buttonClassName } from "@/components/design-system/button";
import { HeroBackdrop } from "@/components/media/hero-backdrop";
import { Link } from "@tanstack/react-router";
import { landingStrings } from "@/lib/strings";

import { LandingLogoReveal } from "./landing-logo-reveal";
import type { LandingWork } from "./landing-types";

const HERO_COVER_CLASS_NAMES = [
  "absolute top-1/2 left-1/2 z-30 w-[min(48%,10.5rem)] -translate-x-1/2 -translate-y-1/2",
  "absolute bottom-[6%] left-[4%] z-20 w-[36%] -rotate-6 opacity-90",
  "absolute right-[4%] bottom-[5%] z-20 w-[36%] rotate-6 opacity-90",
] as const;

const trustIcons = [HeartIcon, HardDriveIcon, ShieldCheckIcon] as const;

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
  return (
    <HeroBackdrop className="border-b border-line" coverUrl={backdropUrl} priority>
      <section
        aria-labelledby="landing-title"
        className="mx-auto grid w-full max-w-[var(--layout-width-media)] gap-[var(--space-4)] px-[var(--layout-page-padding)] py-[var(--space-5)] md:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] md:items-center md:gap-x-[var(--space-8)] md:gap-y-[var(--space-3)]"
      >
        <div className="grid max-w-[36rem] justify-items-start gap-[var(--space-2)]">
          <div className="flex flex-wrap items-end gap-x-[var(--space-4)] gap-y-[var(--space-content)] [&_.landing-logo-reveal]:!flex [&_.landing-logo-reveal]:items-baseline [&_.landing-logo-reveal]:gap-[var(--space-content)]">
            <LandingLogoReveal staticPresentation={staticLogo} />
            <p className="pb-[var(--space-content-tight)] text-[length:var(--text-caption-size)] font-bold text-accent">
              {landingStrings.hero.eyebrow}
            </p>
          </div>
          <h1
            className="max-w-[17ch] font-display text-[length:var(--text-display-size)] text-balance"
            id="landing-title"
          >
            {landingStrings.tagline}
          </h1>
          <p className="max-w-[34rem] text-[length:var(--text-body-size)] leading-[var(--line-height-body)] text-text-muted">
            {landingStrings.description.join("")}
          </p>
          <Link
            className={buttonClassName({
              className: "gap-[var(--space-content)] px-[var(--space-5)] font-bold",
            })}
            preload={false}
            to="/onboarding"
          >
            {landingStrings.cta}
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </Link>
          <ul className="mt-[var(--space-2)] grid list-none gap-x-[var(--space-5)] gap-y-[var(--space-content)] p-0 text-[length:var(--text-caption-size)] text-text-muted sm:grid-cols-3 md:flex md:flex-wrap md:items-start">
            {landingStrings.hero.trust.map((benefit, index) => {
              const Icon = trustIcons[index];
              return (
                <li className="flex min-w-0 items-start gap-[var(--space-content)]" key={benefit}>
                  {Icon === undefined ? null : (
                    <Icon
                      aria-hidden="true"
                      className="mt-[3px] size-4 shrink-0 text-text-strong"
                    />
                  )}
                  <span>{benefit}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto h-52 w-full max-w-[23rem] md:h-60 md:max-w-[26rem]"
        >
          <span className="absolute inset-x-[10%] top-[10%] bottom-[3%] rounded-[var(--radius-card)] border border-line bg-surface-overlay" />
          {works.slice(0, HERO_COVER_CLASS_NAMES.length).map((work, index) => (
            <CoverImage
              className={`${HERO_COVER_CLASS_NAMES[index]} shadow-[var(--shadow-raised)]`}
              coverUrl={coverUrls.get(work.id)}
              creators={work.creators}
              decorative
              key={work.id}
              onSettled={index === 0 ? onFirstCoverSettled : undefined}
              priority={index === 0}
              requestedSize={index === 0 ? 600 : 400}
              title={work.title}
            />
          ))}
        </div>
      </section>
    </HeroBackdrop>
  );
}
