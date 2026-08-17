import type { GenreTag } from "@/domain/catalog/types";

export const onboardingCollections = [
  { id: "momentum", genres: ["action", "sports"] },
  { id: "worlds", genres: ["fantasy", "scienceFiction"] },
  { id: "mysteries", genres: ["mystery", "historical", "horror"] },
  { id: "everyday", genres: ["sliceOfLife", "romance", "comedy"] },
] as const satisfies ReadonlyArray<{ id: string; genres: readonly GenreTag[] }>;

export type OnboardingCollectionId = (typeof onboardingCollections)[number]["id"];

export function isOnboardingCollectionId(
  value: string | undefined,
): value is OnboardingCollectionId {
  return onboardingCollections.some((collection) => collection.id === value);
}
