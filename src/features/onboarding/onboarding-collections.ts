import type { GenreTag, Work } from "@/domain/catalog/types";

export const onboardingCollections = [
  { id: "momentum", genres: ["action", "sports"] },
  { id: "worlds", genres: ["fantasy", "scienceFiction"] },
  { id: "mysteries", genres: ["mystery", "historical", "horror"] },
  { id: "everyday", genres: ["sliceOfLife", "romance", "comedy"] },
] as const satisfies ReadonlyArray<{ id: string; genres: readonly GenreTag[] }>;

export const COLLECTION_PREVIEW_LIMIT_MOBILE = 8;
export const COLLECTION_PREVIEW_LIMIT_DESKTOP = 12;
export const COLLECTION_EXPANDED_LIMIT = 40;
export const COLLECTION_TRIGGER_COVER_COUNT = 3;
export const COLLECTION_PANEL_ID = "onboarding-collection-panel";
export const COLLECTION_PANEL_TITLE_ID = "onboarding-collection-panel-title";
export const COLLECTION_DESKTOP_QUERY = "(min-width: 768px)";

export type OnboardingCollectionId = (typeof onboardingCollections)[number]["id"];
export type OnboardingCollection = (typeof onboardingCollections)[number];
export type OnboardingDiscoverySearch = Readonly<{
  q?: string;
  genre?: GenreTag;
  shelf?: string;
}>;

export function isOnboardingCollectionId(
  value: string | undefined,
): value is OnboardingCollectionId {
  return onboardingCollections.some((collection) => collection.id === value);
}

export function exclusiveOnboardingSearch(
  search: OnboardingDiscoverySearch,
): OnboardingDiscoverySearch {
  if (search.q !== undefined && search.q.trim().length > 0) {
    return { q: search.q };
  }
  if (isOnboardingCollectionId(search.shelf)) {
    return { shelf: search.shelf };
  }
  if (search.genre !== undefined) {
    return { genre: search.genre };
  }
  return {};
}

export function worksForOnboardingCollection(
  works: readonly Work[],
  collection: OnboardingCollection,
): Work[] {
  const selected = new Map<string, Work>();
  for (const work of works) {
    if (selected.has(work.id)) {
      continue;
    }
    if (work.genres.some((genre) => collection.genres.some((preset) => preset === genre))) {
      selected.set(work.id, work);
    }
  }
  return [...selected.values()];
}

export function collectionPreviewLimitForViewport(
  matchMedia: typeof window.matchMedia | undefined = globalThis.window?.matchMedia,
): number {
  if (typeof matchMedia !== "function") {
    return COLLECTION_PREVIEW_LIMIT_MOBILE;
  }
  return matchMedia(COLLECTION_DESKTOP_QUERY).matches
    ? COLLECTION_PREVIEW_LIMIT_DESKTOP
    : COLLECTION_PREVIEW_LIMIT_MOBILE;
}
