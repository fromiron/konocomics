"use client";

import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

import { coverSourceForSize } from "@/components/cover/CoverImage";
import { SiteFooter } from "@/components/layout/site-footer";
import { BrandWordmark } from "@/components/nav/brand-wordmark";
import { hasCatalogBackedProfileById } from "@/domain/profile/catalog-profile";
import { useCatalogIdentity } from "@/features/catalog/catalog-provider";
import { useRecommendationCovers } from "@/features/recommendations/recommendation-cover-resolver";
import { usePersistence } from "@/infrastructure/db";

import { HomeHero } from "./home-hero";
import { HomeHowItWorks } from "./home-how-it-works";
import { HomeDiscoveryShelf, HomeRankingShelf, HomeShowcaseShelf } from "./home-showcase";
import type { LandingWork } from "./landing-types";

const SHOWCASE_COUNT = 4;
const RANKING_COUNT = 10;
const DISCOVERY_COUNT = 7;

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
  heroWorks: readonly LandingWork[];
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
      <HomeHero
        backdropUrl={heroCoverUrl}
        coverUrls={coverUrls}
        onFirstCoverSettled={
          firstCoverTarget === undefined || !coverUrls.has(firstCoverTarget.workId)
            ? undefined
            : () => notifyCoverSettled(firstCoverTarget)
        }
        staticLogo={showIntroduction}
        works={heroWorks}
      />

      <div className="mx-auto grid w-full max-w-[var(--layout-width-media)] gap-[var(--space-section)] px-[var(--layout-page-padding)] py-[var(--space-section)]">
        <HomeShowcaseShelf coverUrls={coverUrls} works={showcaseWorks} />
        <HomeRankingShelf coverUrls={coverUrls} works={rankingWorks} />
        <HomeDiscoveryShelf coverUrls={coverUrls} works={discoveryWorks} />
        <HomeHowItWorks />
      </div>

      <SiteFooter />
    </main>
  );
}
