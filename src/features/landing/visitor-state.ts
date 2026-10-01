import { usePersonalProfile } from "@/features/catalog/personal-catalog-provider";
import { usePersistence } from "@/infrastructure/db";

import type { LandingVisitorState } from "./home-hero";

/** Where the visitor stands, read from local state without changing it. */
export function useLandingVisitorState(): LandingVisitorState {
  const { onboardingCompletedAt, onboardingDraft } = usePersistence();
  const { hasProfile } = usePersonalProfile();
  return hasProfile === true
    ? "profile"
    : onboardingCompletedAt !== undefined && onboardingCompletedAt !== null
      ? "recovery"
      : (onboardingDraft?.positiveEntries.length ?? 0) > 0
        ? "resume"
        : "new";
}
