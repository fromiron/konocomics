import type { Work } from "@/domain/catalog/types";
import { createWorkSearchIndex } from "@/lib/work-search";

export { normalizeWorkQuery } from "@/lib/work-search";
export type WorkSearch = Readonly<{ search(query: string, limit?: number): Work[] }>;
export function createWorkSearch(works: readonly Work[]): WorkSearch {
  return createWorkSearchIndex(works, 30);
}

const EXCLUDED_MATCH_WINDOW = 8;

export type ExcludedSearchMatchReason = "registered" | "notAnalyzable";

export type ExcludedSearchMatch = Readonly<{
  work: Work;
  reason: ExcludedSearchMatchReason;
}>;

/**
 * Explains matches the onboarding search deliberately leaves out, so an empty
 * or partial result is not mistaken for a broken search. Selectable works are
 * never reported; registered works keep their duplicate guard; works outside
 * the analysis set keep their eligibility.
 */
export function findExcludedSearchMatches({
  catalogSearch,
  query,
  registeredWorkIds,
  selectableWorkIds,
  limit = 3,
}: Readonly<{
  catalogSearch: WorkSearch;
  query: string;
  registeredWorkIds: ReadonlySet<string>;
  selectableWorkIds: ReadonlySet<string>;
  limit?: number;
}>): ExcludedSearchMatch[] {
  // Only the strongest catalog matches are explained; a weak fuzzy hit far
  // down the list would read as noise rather than as the work being sought.
  return catalogSearch
    .search(query, EXCLUDED_MATCH_WINDOW)
    .filter((work) => !selectableWorkIds.has(work.id))
    .slice(0, limit)
    .map((work) => ({
      work,
      reason: registeredWorkIds.has(work.id) ? "registered" : "notAnalyzable",
    }));
}
