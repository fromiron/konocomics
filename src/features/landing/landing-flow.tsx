"use client";

import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

import { coverSourceForSize } from "@/components/cover/CoverImage";
import { BrandWordmark } from "@/components/nav/brand-wordmark";
import { hasCatalogBackedProfileById } from "@/domain/profile/catalog-profile";
import { useCatalogIdentity } from "@/features/catalog/catalog-provider";
import { useRecommendationCovers } from "@/features/recommendations/recommendation-cover-resolver";
import { usePersistence, type ProviderCacheRecord } from "@/infrastructure/db";

import { HomeHero } from "./home-hero";
import { HomeClosing, HomeHowItWorks } from "./home-how-it-works";
import { HomeDiscoveryShelf, HomeRankingShelf } from "./home-showcase";
import type { LandingSample, LandingWork } from "./landing-types";

function skipProviderCacheWrite(record: ProviderCacheRecord) {
  return Promise.resolve(record);
}

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
  discoveryWorks: readonly LandingWork[];
  editorialRankingWorks: readonly LandingWork[];
  recommendableWorkCount: number;
  sample: LandingSample;
  showIntroduction?: boolean;
}>;

export function LandingFlow({
  discoveryWorks,
  editorialRankingWorks,
  recommendableWorkCount,
  sample,
  showIntroduction = false,
}: LandingFlowProps) {
  const navigate = useNavigate();
  const catalogIdentity = useCatalogIdentity();
  const { getProviderCache, userWorks } = usePersistence();
  const hasProfile = useMemo(
    () => hasCatalogBackedProfileById(userWorks, catalogIdentity.profileWorkIds),
    [catalogIdentity.profileWorkIds, userWorks],
  );
  const coverTargets = useMemo(() => {
    const uniqueWorks = new Map(
      [sample.recommendation.work, ...editorialRankingWorks, ...discoveryWorks].map(
        (work) => [work.id, work] as const,
      ),
    );

    return [...uniqueWorks.values()].flatMap((work) =>
      work.isbn === undefined ? [] : [{ workId: work.id, isbn: work.isbn }],
    );
  }, [discoveryWorks, editorialRankingWorks, sample]);
  const { coverUrls, requestCover } = useRecommendationCovers({
    targets: coverTargets,
    getProviderCache,
    saveProviderCache: skipProviderCacheWrite,
  });
  // The backdrop blurs the same cover the example card shows in front of it.
  const heroCoverSource = coverUrls.get(sample.recommendation.work.id);
  const heroCoverUrl = heroCoverSource ? coverSourceForSize(heroCoverSource, 600) : null;

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
        onCoverVisible={requestCover}
        recommendableWorkCount={recommendableWorkCount}
        sample={sample}
        staticLogo={showIntroduction}
      />

      <div className="mx-auto grid w-full max-w-[var(--layout-width-media)] gap-[var(--space-shelf-group)] px-[var(--layout-page-padding)] pt-[var(--space-shelf)] pb-[var(--space-shelf-group)]">
        <HomeHowItWorks sample={sample} />
        <div className="grid gap-[var(--space-shelf)]">
          <HomeRankingShelf
            coverUrls={coverUrls}
            onCoverVisible={requestCover}
            works={editorialRankingWorks}
          />
          <HomeDiscoveryShelf
            coverUrls={coverUrls}
            onCoverVisible={requestCover}
            works={discoveryWorks}
          />
        </div>
        <HomeClosing />
      </div>
    </main>
  );
}
