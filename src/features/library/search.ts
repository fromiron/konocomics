import Fuse from "fuse.js";

import {
  foldKatakanaToHiragana,
  isbnIdentityKey,
  normalizeCreator,
  normalizeTitle,
} from "@/domain/catalog/normalize";
import type { CatalogV1, Work } from "@/domain/catalog/types";
import type { RakutenBookItem } from "@/infrastructure/rakuten";

type SearchDocument = Readonly<{
  work: Work;
  normalizedText: string;
}>;

function normalizeQuery(value: string) {
  return normalizeTitle(value).kanaFolded.replace(/\s+/gu, "");
}

function searchableText(work: Work) {
  const titles = [work.title, work.titleKana, ...work.aliases]
    .filter((value): value is string => value !== undefined)
    .map(normalizeQuery);
  const creators = work.creators.map((creator) =>
    foldKatakanaToHiragana(normalizeCreator(creator)).replace(/\s+/gu, ""),
  );
  return [...titles, ...creators].join(" ");
}

export type LibraryWorkSearch = Readonly<{
  search(query: string, limit?: number): Work[];
}>;

export function createLibraryWorkSearch(works: readonly Work[]): LibraryWorkSearch {
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
    search(query, limit = 20) {
      const normalizedQuery = normalizeQuery(query);
      if (normalizedQuery.length === 0) return [];
      return fuse.search(normalizedQuery, { limit }).map(({ item }) => item.work);
    },
  };
}

export function catalogWorkForRakutenItem(
  catalog: Pick<CatalogV1, "volumes" | "works">,
  item: Pick<RakutenBookItem, "isbn">,
): Work | undefined {
  const isbn = isbnIdentityKey(item.isbn);
  const volume = catalog.volumes.find((candidate) => isbnIdentityKey(candidate.isbn) === isbn);
  if (volume === undefined) return undefined;
  return catalog.works.find((work) => work.id === volume.workId);
}
