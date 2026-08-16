"use client";

import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

import { CoverImage, coverSourceForSize } from "@/components/cover/CoverImage";
import { buttonClassName } from "@/components/design-system/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroBackdrop } from "@/components/media/hero-backdrop";
import { MediaPosterCard } from "@/components/media/media-poster-card";
import { MediaShelf } from "@/components/media/media-shelf";
import { RankingShelf } from "@/components/media/ranking-shelf";
import { BrandWordmark } from "@/components/nav/brand-wordmark";
import type { Work } from "@/domain/catalog/types";
import { hasCatalogBackedProfileById } from "@/domain/profile/catalog-profile";
import { useCatalogIdentity } from "@/features/catalog/catalog-provider";
import { useRecommendationCovers } from "@/features/recommendations/recommendation-cover-resolver";
import { usePersistence } from "@/infrastructure/db";
import { landingStrings } from "@/lib/strings";

import { LandingLogoReveal } from "./landing-logo-reveal";

const HERO_COVER_COUNT = 4;
const SHOWCASE_COUNT = 7;
const RANKING_COUNT = 10;
const DISCOVERY_COUNT = 7;
const HERO_COVER_CLASS_NAMES = [
  "absolute top-1/2 left-1/2 z-30 w-[min(48%,13rem)] -translate-x-1/2 -translate-y-1/2",
  "absolute bottom-[6%] left-[2%] z-20 w-[38%] -rotate-6",
  "absolute right-[2%] bottom-[4%] z-20 w-[38%] rotate-6",
  "absolute top-[4%] left-[10%] z-10 w-[34%] -rotate-3 opacity-75",
] as const;
type LandingHeroWork = Pick<Work, "id" | "title" | "creators" | "genres" | "status"> &
  Readonly<{ isbn?: string }>;

function LandingGuard() {
  return (
    <main
      className="grid min-h-dvh place-items-center p-[var(--layout-page-padding)]"
      data-landing-state="checking"
    >
      <BrandWordmark className="text-[length:var(--font-size-28)]" />
    </main>
  );
}

type LandingFlowProps = Readonly<{
  heroWorks: readonly LandingHeroWork[];
  showIntroduction?: boolean;
}>;

export function LandingFlow({ heroWorks, showIntroduction = false }: LandingFlowProps) {
  const navigate = useNavigate();
  const catalogIdentity = useCatalogIdentity();
  const { getProviderCache, saveProviderCache, userWorks } = usePersistence();
  const hasProfile = useMemo(
    () => hasCatalogBackedProfileById(userWorks, catalogIdentity.workIds),
    [catalogIdentity.workIds, userWorks],
  );
  const coverTargets = useMemo(
    () =>
      heroWorks.flatMap((work) =>
        work.isbn === undefined ? [] : [{ workId: work.id, isbn: work.isbn }],
      ),
    [heroWorks],
  );
  const { coverUrls, notifyCoverSettled } = useRecommendationCovers({
    targets: coverTargets,
    getProviderCache,
    saveProviderCache,
  });
  const firstCoverTarget = coverTargets[0];
  const heroWork = heroWorks[0];
  const heroCoverSource = heroWork === undefined ? null : coverUrls.get(heroWork.id);
  const heroCoverUrl = heroCoverSource ? coverSourceForSize(heroCoverSource, 600) : null;
  const showcaseWorks = heroWorks.slice(0, SHOWCASE_COUNT);
  const rankingWorks = heroWorks.slice(0, RANKING_COUNT);
  const discoveryWorks = heroWorks.slice(-DISCOVERY_COUNT);

  useEffect(() => {
    if (!showIntroduction && hasProfile === true) {
      void navigate({ to: "/recommendations", replace: true });
    }
  }, [hasProfile, navigate, showIntroduction]);

  if (!showIntroduction && hasProfile !== false) {
    return <LandingGuard />;
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-canvas" data-landing-state="introduction">
      <HeroBackdrop className="border-y border-line" coverUrl={heroCoverUrl} priority>
        <section
          aria-labelledby="landing-title"
          className="mx-auto grid w-full max-w-[var(--layout-width-media)] items-center gap-[var(--space-4)] px-[var(--layout-page-padding)] py-[var(--space-8)] md:min-h-96 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:gap-[var(--space-8)]"
        >
          <div className="grid max-w-[var(--layout-width-reading)] justify-items-start gap-[var(--space-4)]">
            <LandingLogoReveal staticPresentation={showIntroduction} />
            <p className="text-[length:var(--text-caption-size)] font-bold text-accent">
              {landingStrings.hero.eyebrow}
            </p>
            <h1
              className="max-w-[var(--layout-width-form)] font-display text-[length:var(--text-display-size)]"
              id="landing-title"
            >
              {landingStrings.tagline}
            </h1>
            <div className="grid max-w-[var(--layout-width-reading)] gap-[var(--space-content-tight)] text-text-muted">
              {landingStrings.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link
              className={buttonClassName({
                className: "px-[var(--space-5)] py-[var(--space-content-loose)] font-bold",
              })}
              preload={false}
              to="/onboarding"
            >
              {landingStrings.cta}
            </Link>
            <ul className="m-0 flex list-inside flex-wrap gap-x-[var(--space-5)] gap-y-[var(--space-3)] p-0 text-[length:var(--text-caption-size)] text-text-muted">
              {landingStrings.hero.trust.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
          <div
            aria-hidden="true"
            className="relative mx-auto h-64 w-full max-w-[var(--layout-width-form)] md:h-80 md:self-center"
          >
            {heroWorks.slice(0, HERO_COVER_COUNT).map((work, index) => (
              <CoverImage
                className={HERO_COVER_CLASS_NAMES[index]}
                coverUrl={index === 0 ? heroCoverUrl : coverUrls.get(work.id)}
                creators={work.creators}
                decorative
                key={work.id}
                onSettled={
                  firstCoverTarget?.workId === work.id && coverUrls.has(work.id)
                    ? () => notifyCoverSettled(firstCoverTarget)
                    : undefined
                }
                priority={index === 0}
                requestedSize={index === 0 ? 600 : 400}
                title={work.title}
              />
            ))}
          </div>
        </section>
      </HeroBackdrop>

      <div className="mx-auto grid w-full max-w-[var(--layout-width-media)] gap-[var(--space-section-large)] px-[var(--layout-page-padding)] py-[var(--space-section-large)]">
        <MediaShelf
          className="[&_h2]:border-l-[length:var(--space-1)] [&_h2]:border-accent [&_h2]:pl-[var(--space-4)]"
          description={landingStrings.showcase.description}
          title={landingStrings.showcase.title}
        >
          {showcaseWorks.map((work, index) => (
            <MediaPosterCard
              coverUrl={coverUrls.get(work.id)}
              creators={work.creators}
              key={work.id}
              priority={index === 0}
              title={work.title}
              workId={work.id}
            />
          ))}
        </MediaShelf>

        <RankingShelf
          className="[&_h2]:border-l-[length:var(--space-1)] [&_h2]:border-accent [&_h2]:pl-[var(--space-4)]"
          description={landingStrings.ranking.description}
          title={landingStrings.ranking.title}
        >
          {rankingWorks.map((work) => (
            <MediaPosterCard
              coverUrl={coverUrls.get(work.id)}
              creators={work.creators}
              key={work.id}
              title={work.title}
              workId={work.id}
            />
          ))}
        </RankingShelf>

        <MediaShelf
          className="[&_h2]:border-l-[length:var(--space-1)] [&_h2]:border-accent [&_h2]:pl-[var(--space-4)]"
          description={landingStrings.discovery.description}
          title={landingStrings.discovery.title}
        >
          {discoveryWorks.map((work) => (
            <MediaPosterCard
              coverUrl={coverUrls.get(work.id)}
              creators={work.creators}
              key={work.id}
              title={work.title}
              workId={work.id}
            />
          ))}
        </MediaShelf>

        <section
          className="grid gap-[var(--space-6)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-6)]"
          aria-labelledby="landing-steps-title"
        >
          <h2 id="landing-steps-title">{landingStrings.stepsHeading}</h2>
          <ol className="m-0 grid list-none gap-[var(--space-4)] p-0 md:grid-cols-4">
            {landingStrings.steps.map((step, index) => (
              <li
                className="grid content-start gap-[var(--space-content)] rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-4)]"
                key={step.title}
              >
                <span aria-hidden="true" className="font-display font-bold text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p className="text-text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center justify-between gap-[var(--space-content)] text-text-muted">
            <p>{landingStrings.footer.storage}</p>
            <Link
              className="inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent"
              preload={false}
              to="/settings"
            >
              {landingStrings.footer.settings}
            </Link>
          </div>
        </section>
      </div>

      <SiteFooter className="mt-[var(--space-section-large)]" />
    </main>
  );
}
