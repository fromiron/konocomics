import { useMemo } from "react";

import { hasCatalogBackedProfileById } from "@/domain/profile/catalog-profile";
import { useCatalogIdentity } from "@/features/catalog/catalog-provider";
import { usePersistence } from "@/infrastructure/db";

import type { LandingVisitorState } from "./home-hero";

/** Where the visitor stands, read from local state without changing it. */
export function useLandingVisitorState(): LandingVisitorState {
  const catalogIdentity = useCatalogIdentity();
  const { onboardingCompletedAt, onboardingDraft, userWorks } = usePersistence();
  const hasProfile = useMemo(
    () => hasCatalogBackedProfileById(userWorks, catalogIdentity.profileWorkIds),
    [catalogIdentity.profileWorkIds, userWorks],
  );
  return hasProfile === true
    ? "profile"
    : onboardingCompletedAt !== undefined && onboardingCompletedAt !== null
      ? "recovery"
      : (onboardingDraft?.positiveEntries.length ?? 0) > 0
        ? "resume"
        : "new";
}
