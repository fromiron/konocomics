import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { BrandWordmark } from "@/components/nav/brand-wordmark";
import landingJson from "@/data/generated/landing-v1.json";
import { LandingFlow } from "@/features/landing/landing-flow";
import { landingProjectionSchema } from "@/features/landing/landing-types";
import { landingSearchSchema } from "@/lib/route-search";
import { landingStrings } from "@/lib/strings";

const { editorialRankingWorks, heroWorks } = landingProjectionSchema.parse(landingJson);

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
