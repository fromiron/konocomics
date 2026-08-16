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
