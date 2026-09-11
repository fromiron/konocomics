import { createExternalWorkNormalizedKeyV1 } from "@/domain/catalog/external-work";
import { isbnIdentityKey, stripVolumeAndEditionTokens } from "@/domain/catalog/normalize";
import type { CatalogV1 } from "@/domain/catalog/types";
import type { UserWorkRecord } from "@/domain/profile/types";
import { catalogWorkForRakutenItem } from "@/features/library/search";
import type { ExternalWorkRecord } from "@/infrastructure/db";
import { searchRakutenBooks, type RakutenBookItem } from "@/infrastructure/rakuten";

export function popularWorkKey(item: Pick<RakutenBookItem, "title" | "author">) {
  return createExternalWorkNormalizedKeyV1(item.title, item.author);
}

export function selectPopularWork(
  items: readonly RakutenBookItem[],
  catalog: CatalogV1,
  records: readonly UserWorkRecord[],
  externalWorks: readonly ExternalWorkRecord[],
  excludedWorkIds: readonly string[] = [],
): RakutenBookItem | undefined {
  const excludedIds = new Set([...records.map((record) => record.workId), ...excludedWorkIds]);
  const excludedKeys = new Set(externalWorks.map((work) => work.normalizedKey));
  const excludedIsbns = new Set(
    externalWorks.flatMap((work) => work.isbnSamples.map(isbnIdentityKey)),
  );
  for (const work of catalog.works) {
    if (!excludedIds.has(work.id)) continue;
    for (const title of [work.title, ...work.aliases]) {
      for (const creator of [...work.creators, work.creators.join("/")]) {
        if (creator.trim()) excludedKeys.add(popularWorkKey({ title, author: creator }));
      }
    }
  }
  return items.find((item) => {
    const match = catalogWorkForRakutenItem(catalog, item);
    return (
      !excludedKeys.has(popularWorkKey(item)) &&
      !excludedIsbns.has(isbnIdentityKey(item.isbn)) &&
      (match === undefined || !excludedIds.has(match.id))
    );
  });
}

export async function resolvePopularWork(item: RakutenBookItem): Promise<RakutenBookItem> {
  const title = stripVolumeAndEditionTokens(item.title);
  if (title === item.title) return item;
  const results = await searchRakutenBooks(title);
  const key = popularWorkKey(item);
  return (
    results.find(
      (candidate) =>
        popularWorkKey(candidate) === key &&
        /(?:\s+1|[（(]1[）)]|第?1巻)\s*$/u.test(candidate.title.normalize("NFKC")),
    ) ?? item
  );
}
