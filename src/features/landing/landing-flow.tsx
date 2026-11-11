"use client";

import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

import { BrandWordmark } from "@/components/nav/brand-wordmark";
import { CatalogFailure } from "@/features/catalog/catalog-provider";
import { usePersonalProfile } from "@/features/catalog/personal-catalog-provider";
import { useRecommendationCovers } from "@/features/recommendations/recommendation-cover-resolver";
import { usePersistence, type ProviderCacheRecord } from "@/infrastructure/db";

import { recordEntrySource } from "./entry-source";
import { HomeClosing } from "./home-closing";
import { HomeHero } from "./home-hero";
import { HomeEditorialRanking, HomeSampleLens } from "./home-shelves";
import type { LandingSample, LandingWork } from "./landing-types";
import { useSampleReasons } from "./sample-reason";
import { useLandingVisitorState } from "./visitor-state";
import type { EntrySource } from "@/lib/route-search";

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
  editorialRankingWorks: readonly LandingWork[];
  recommendableWorkCount: number;
  sample: LandingSample;
  showIntroduction?: boolean;
  entrySource?: EntrySource;
}>;

export function LandingFlow({
  editorialRankingWorks,
  recommendableWorkCount,
  sample,
  showIntroduction = false,
  entrySource,
}: LandingFlowProps) {
  const navigate = useNavigate();
  const { getProviderCache } = usePersistence();
  const { hasProfile, error: profileError } = usePersonalProfile();
  // Reading local state never changes it: the landing only picks where its one action leads.
  const visitor = useLandingVisitorState();
  const reasons = useSampleReasons(sample);
  const [leadExample] = sample.stage;

  useEffect(() => {
    if (entrySource !== undefined) recordEntrySource(entrySource);
  }, [entrySource]);
  // The stage's first recommendation (the hero's large cover) is requested at once, the rest as
  // they come into view.
  const coverTargets = useMemo(() => {
    const uniqueWorks = new Map(
      [
        leadExample.work,
        ...sample.anchorWorks,
        ...sample.stage.map(({ work }) => work),
        ...sample.lens.items.map(({ work }) => work),
        ...editorialRankingWorks,
      ].map((work) => [work.id, work] as const),
    );

    return [...uniqueWorks.values()].flatMap((work) =>
      work.isbn === undefined ? [] : [{ workId: work.id, isbn: work.isbn }],
    );
  }, [editorialRankingWorks, leadExample, sample]);
  const { coverUrls, requestCover } = useRecommendationCovers({
    targets: coverTargets,
    getProviderCache,
    saveProviderCache: skipProviderCacheWrite,
  });
  // The evidence stage is on the first screen at every size, so once the landing is known to stay
  // its covers do not wait for the stage to come into view: they are asked for in reading order
  // (the large cover, the five sample works, then the other two picks), ahead of the shelves
  // below, which still ask as they come into view. A visitor who is about to be sent on to
  // /recommendations asks for none of them (03 §1 「무대 표지 로딩」).
  const staysOnLanding = showIntroduction || hasProfile === false;
  useEffect(() => {
    if (!staysOnLanding) return;
    for (const work of [
      leadExample.work,
      ...sample.anchorWorks,
      ...sample.stage.map(({ work: stageWork }) => stageWork),
    ]) {
      requestCover(work.id);
    }
  }, [leadExample, requestCover, sample, staysOnLanding]);

  useEffect(() => {
    if (!showIntroduction && hasProfile === true) {
      void navigate({ to: "/recommendations", replace: true });
    }
  }, [hasProfile, navigate, showIntroduction]);

  if (profileError) return <CatalogFailure />;

  if (!showIntroduction && hasProfile !== false) {
    return <LandingGuard />;
  }

  return (
    <main
      className="min-h-dvh overflow-x-clip bg-canvas"
      data-entry-source={entrySource}
      data-landing-state="introduction"
    >
      <HomeHero
        coverUrls={coverUrls}
        onCoverVisible={requestCover}
        reasons={reasons}
        recommendableWorkCount={recommendableWorkCount}
        sample={sample}
        sharedEntry={entrySource === "share-card"}
        storageFree={showIntroduction}
        visitor={visitor}
      />
      {/* Below the hero the product shows itself: the sample taste's lens shelf, then the
          editorial Top 10 and the same single action. */}
      <div className="mx-auto w-full max-w-[var(--layout-width-media)] px-[var(--layout-page-padding)] pt-[var(--space-section-large)]">
        <HomeSampleLens
          coverUrls={coverUrls}
          onCoverVisible={requestCover}
          reasons={reasons}
          sample={sample}
        />
        <div className="mt-[var(--space-shelf)]">
          <HomeEditorialRanking
            coverUrls={coverUrls}
            onCoverVisible={requestCover}
            works={editorialRankingWorks}
          />
        </div>
        <div className="mt-[var(--space-shelf-group)]">
          <HomeClosing backdropUrl={coverUrls.get(leadExample.work.id)} visitor={visitor} />
        </div>
      </div>
    </main>
  );
}
