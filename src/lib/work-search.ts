import Fuse from "fuse.js";

import {
  foldKatakanaToHiragana,
  normalizeCreator,
  normalizeTitle,
} from "@/domain/catalog/normalize";
import type { Work } from "@/domain/catalog/types";

import { WORK_QUERY_MAX_LENGTH } from "./search-query";

export function normalizeWorkQuery(value: string) {
  return normalizeTitle(value).kanaFolded.replace(/\s+/gu, "");
}

function titleTerms(work: Work) {
  return [work.title, work.titleKana, ...work.aliases]
    .filter((value): value is string => value !== undefined)
    .map(normalizeWorkQuery);
}

function creatorTerms(work: Work) {
  return work.creators.map((creator) =>
    foldKatakanaToHiragana(normalizeCreator(creator)).replace(/\s+/gu, ""),
  );
}

export function workSearchText(work: Work) {
  return [...titleTerms(work), ...creatorTerms(work)].join(" ");
}

export function createWorkSearchIndex(works: readonly Work[], defaultLimit: number) {
  const documents = works.map((work) => {
    const titles = titleTerms(work);
    const terms = [...titles, ...creatorTerms(work)];
    return { work, titles, terms, normalizedText: terms.join(" ") };
  });
  const fuse = new Fuse(documents, {
    keys: ["normalizedText"],
    threshold: 0.3,
    ignoreLocation: true,
    shouldSort: true,
  });

  return {
    search(query: string, limit = defaultLimit): Work[] {
      if (query.length > WORK_QUERY_MAX_LENGTH) return [];
      const normalized = normalizeWorkQuery(query);
      if (normalized.length === 0) return [];
      const ranked = documents.flatMap((document, index) => {
        const rank = document.titles.includes(normalized)
          ? 0
          : document.terms.some((term) => term.startsWith(normalized))
            ? 1
            : document.terms.some((term) => term.includes(normalized))
              ? 2
              : undefined;
        return rank === undefined ? [] : [{ document, rank, index }];
      });
      ranked.sort((a, b) => a.rank - b.rank || a.index - b.index);
      const matches = ranked.slice(0, limit).map(({ document }) => document.work);
      // Fuse splits long patterns into 32-unit chunks; exact matching keeps long titles bounded.
      if (matches.length >= limit || normalized.length > 32) return matches;
      const matchedIds = new Set(matches.map((work) => work.id));
      for (const { item } of fuse.search(normalized, { limit })) {
        if (!matchedIds.has(item.work.id)) matches.push(item.work);
        if (matches.length >= limit) break;
      }
      return matches;
    },
  };
}
