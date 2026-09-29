import { tasteSentenceSubjects } from "./generate";
import type { ExplanationLexicon, TasteExplanationSentence, WorkTitleResolver } from "./types";

export const RECOMMENDATION_LENS_MIN_ITEMS = 3;
export const RECOMMENDATION_LENS_MAX_ITEMS = 8;
export const RECOMMENDATION_ANCHOR_LENS_LIMIT = 2;
export const RECOMMENDATION_FACTOR_LENS_LIMIT = 1;
/** Only the top of the plan feeds lenses, so the full plan never needs explaining. */
export const RECOMMENDATION_LENS_CANDIDATE_LIMIT = 60;

export type RecommendationLens<T> =
  | { kind: "anchor"; anchorWorkId: string; anchorTitle: string; items: T[] }
  | { kind: "factor"; factorLabel: string; items: T[] };

export type GroupRecommendationLensesInput<T> = {
  /** Plan-ordered items; only the first RECOMMENDATION_LENS_CANDIDATE_LIMIT are considered. */
  items: readonly T[];
  leadReasonOf: (item: T) => TasteExplanationSentence | undefined;
  lexicon: ExplanationLexicon;
  resolveTitle: WorkTitleResolver;
};

function groupsOf<T>(entries: readonly { item: T; key: string | undefined }[]) {
  const groups = new Map<string, T[]>();
  for (const { item, key } of entries) {
    if (key === undefined) continue;
    const group = groups.get(key);
    if (group === undefined) groups.set(key, [item]);
    else group.push(item);
  }
  // Map insertion order is first appearance, so earlier groups hold the higher-ranked first item.
  return [...groups].filter(([, group]) => group.length >= RECOMMENDATION_LENS_MIN_ITEMS);
}

/**
 * Groups plan items into perspective shelves whose headings restate each card's lead reason.
 * Each item lands in at most one lens; scores and order are never recomputed.
 */
export function groupRecommendationLenses<T>({
  items,
  leadReasonOf,
  lexicon,
  resolveTitle,
}: GroupRecommendationLensesInput<T>): RecommendationLens<T>[] {
  const subjects = items.slice(0, RECOMMENDATION_LENS_CANDIDATE_LIMIT).map((item) => {
    const reason = leadReasonOf(item);
    return {
      item,
      ...(reason === undefined ? {} : tasteSentenceSubjects(reason, lexicon, resolveTitle)),
    };
  });
  const used = new Set<T>();
  const shownAnchorIds = new Set<string>();
  const shownFactorLabels = new Set<string>();
  const lenses: RecommendationLens<T>[] = [];

  for (const [anchorWorkId, group] of groupsOf(
    subjects.map(({ anchorWorkId, item }) => ({ item, key: anchorWorkId })),
  ).slice(0, RECOMMENDATION_ANCHOR_LENS_LIMIT)) {
    const lensItems = group.slice(0, RECOMMENDATION_LENS_MAX_ITEMS);
    lensItems.forEach((item) => used.add(item));
    shownAnchorIds.add(anchorWorkId);
    lenses.push({
      kind: "anchor",
      anchorWorkId,
      anchorTitle: resolveTitle(anchorWorkId) ?? "",
      items: lensItems,
    });
  }
  subjects.forEach(({ factorLabel, item }) => {
    if (used.has(item) && factorLabel !== undefined) shownFactorLabels.add(factorLabel);
  });

  // A factor lens must add a new perspective: no liked work or label already shown above.
  for (const [factorLabel, group] of groupsOf(
    subjects
      .filter(
        ({ anchorWorkId, item }) =>
          !used.has(item) && (anchorWorkId === undefined || !shownAnchorIds.has(anchorWorkId)),
      )
      .map(({ factorLabel, item }) => ({
        item,
        key:
          factorLabel === undefined || shownFactorLabels.has(factorLabel) ? undefined : factorLabel,
      })),
  ).slice(0, RECOMMENDATION_FACTOR_LENS_LIMIT)) {
    const lensItems = group.slice(0, RECOMMENDATION_LENS_MAX_ITEMS);
    lensItems.forEach((item) => used.add(item));
    lenses.push({ kind: "factor", factorLabel, items: lensItems });
  }

  return lenses;
}
