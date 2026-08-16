import type { Metadata } from "next";
import { Suspense } from "react";

import { BrandWordmark } from "@/components/nav/brand-wordmark";
import catalogJson from "@/data/generated/catalog-v1.json";
import { LandingFlow } from "@/features/landing/landing-flow";
import { landingStrings } from "@/lib/strings";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: landingStrings.metadataTitle,
};

function LandingFallback() {
  return (
    <main className="landing-guard" data-landing-state="checking">
      <BrandWordmark className="landing-guard__wordmark" />
    </main>
  );
}

export default function HomePage() {
  const heroWorks = catalogJson.works
    .filter((work) => work.eligibility.onboardingEligible)
    .slice(0, 4)
    .map(({ id, title, creators }) => ({ id, title, creators }));

  return (
    <Suspense fallback={<LandingFallback />}>
      <LandingFlow heroWorks={heroWorks} />
    </Suspense>
  );
}
