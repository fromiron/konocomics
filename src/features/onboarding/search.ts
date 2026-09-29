import Fuse from "fuse.js";

import {
  foldKatakanaToHiragana,
  normalizeCreator,
  normalizeTitle,
} from "@/domain/catalog/normalize";
import type { Work } from "@/domain/catalog/types";

type SearchDocument = Readonly<{
  work: Work;
  normalizedText: string;
}>;

export function normalizeWorkQuery(value: string): string {
  return normalizeTitle(value).kanaFolded.replace(/\s+/gu, "");
}

function searchableText(work: Work): string {
  const titles = [work.title, work.titleKana, ...work.aliases]
    .filter((value): value is string => value !== undefined)
    .map(normalizeWorkQuery);
  const creators = work.creators.map((creator) =>
    foldKatakanaToHiragana(normalizeCreator(creator)).replace(/\s+/gu, ""),
  );
  return [...titles, ...creators].join(" ");
}

export type WorkSearch = Readonly<{
  search: (query: string, limit?: number) => Work[];
}>;

export function createWorkSearch(works: readonly Work[]): WorkSearch {
  const documents = works.map((work): SearchDocument => ({
    work,
    normalizedText: searchableText(work),
  }));
  const fuse = new Fuse(documents, {
    keys: ["normalizedText"],
    threshold: 0.3,
    ignoreLocation: true,
    shouldSort: true,
  });

  return {
    search(query, limit = 30) {
      const normalizedQuery = normalizeWorkQuery(query);
      if (normalizedQuery.length === 0) {
        return [];
      }

      return fuse.search(normalizedQuery, { limit }).map(({ item }) => item.work);
    },
  };
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
