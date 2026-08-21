import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { BrandWordmark } from "@/components/nav/brand-wordmark";
import catalogJson from "@/data/generated/catalog-v1.json";
import { landingEditorialRankingIds } from "@/data/landing-showcase";
import { catalogV1Schema } from "@/domain/catalog/schema";
import { LandingFlow } from "@/features/landing/landing-flow";
import type { LandingWork } from "@/features/landing/landing-types";
import { landingSearchSchema } from "@/lib/route-search";
import { landingStrings } from "@/lib/strings";

const catalog = catalogV1Schema.parse(catalogJson);
const volumesById = new Map(catalog.volumes.map((volume) => [volume.id, volume] as const));
const worksById = new Map(catalog.works.map((work) => [work.id, work] as const));

function toLandingWork(work: (typeof catalog.works)[number]): LandingWork {
  const { id, title, creators, genres, status } = work;
  const representativeVolumeId = catalog.representativeVolumeByWorkId[id];

  return {
    id,
    title,
    creators,
    genres,
    status,
    isbn:
      representativeVolumeId === undefined
        ? undefined
        : volumesById.get(representativeVolumeId)?.isbn,
  };
}

const heroWorks = catalog.works
  .filter((work) => work.eligibility.onboardingEligible)
  .slice(0, 18)
  .map(toLandingWork);
const editorialRankingWorks = landingEditorialRankingIds.map((workId) => {
  const work = worksById.get(workId);
  if (work === undefined || !work.eligibility.onboardingEligible) {
    throw new Error(`Landing editorial ranking work is unavailable: ${workId}`);
  }

  return toLandingWork(work);
});

export const Route = createFileRoute("/")({
  validateSearch: (search) => landingSearchSchema.parse(search),
  head: () => ({ meta: [{ title: landingStrings.metadataTitle }] }),
  component: HomePage,
});

function LandingFallback() {
  return (
    <main className="landing-guard" data-landing-state="checking">
      <BrandWordmark className="landing-guard__wordmark" />
    </main>
  );
}

function HomePage() {
  const { landing } = Route.useSearch();

  return (
    <Suspense fallback={<LandingFallback />}>
      <LandingFlow
        editorialRankingWorks={editorialRankingWorks}
        heroWorks={heroWorks}
        showIntroduction={landing === "1"}
      />
    </Suspense>
  );
}
