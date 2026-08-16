import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { BrandWordmark } from "@/components/nav/brand-wordmark";
import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import { LandingFlow } from "@/features/landing/landing-flow";
import { landingSearchSchema } from "@/lib/route-search";
import { landingStrings } from "@/lib/strings";

const catalog = catalogV1Schema.parse(catalogJson);
const volumesById = new Map(catalog.volumes.map((volume) => [volume.id, volume] as const));
const heroWorks = catalog.works
  .filter((work) => work.eligibility.onboardingEligible)
  .slice(0, 18)
  .map(({ id, title, creators, genres, status }) => {
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
      <LandingFlow heroWorks={heroWorks} showIntroduction={landing === "1"} />
    </Suspense>
  );
}
