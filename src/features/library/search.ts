import { isbnIdentityKey } from "@/domain/catalog/normalize";
import type { CatalogV1, Work } from "@/domain/catalog/types";
import type { RakutenBookItem } from "@/infrastructure/rakuten";
import { createWorkSearchIndex } from "@/lib/work-search";

export {
  normalizeWorkQuery as normalizeLibraryQuery,
  workSearchText as libraryWorkSearchText,
} from "@/lib/work-search";

export type LibraryWorkSearch = Readonly<{ search(query: string, limit?: number): Work[] }>;

export function createLibraryWorkSearch(works: readonly Work[]): LibraryWorkSearch {
  return createWorkSearchIndex(works, 20);
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
