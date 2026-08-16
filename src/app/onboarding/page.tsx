import type { Metadata } from "next";

import { BundledCatalogProvider } from "@/features/catalog/bundled-catalog-provider";
import { OnboardingFlow } from "@/features/onboarding/onboarding-flow";
import { onboardingStrings } from "@/lib/strings";

export const metadata: Metadata = {
  title: onboardingStrings.metadataTitle,
};

export default function OnboardingPage() {
  return (
    <BundledCatalogProvider>
      <OnboardingFlow />
    </BundledCatalogProvider>
  );
}
