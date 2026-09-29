import { normalizeCreator } from "@/domain/catalog/normalize";
import type { CatalogV1, Volume, Work } from "@/domain/catalog/types";
import type { ProviderCacheState } from "@/infrastructure/rakuten";

function text(value: string | undefined) {
  return value?.trim() || undefined;
}

export function resolveWorkBookMetadata(
  work: Work,
  volume: Volume | undefined,
  provider: ProviderCacheState["metadata"],
) {
  const matchingVolume = volume?.workId === work.id ? volume : undefined;
  const collected = matchingVolume?.metadata;
  const providerCaption = text(provider?.itemCaption);
  const collectedCaption = text(collected?.itemCaption);
  const captionSource: "publisher" | "rakuten" =
    providerCaption === undefined ? "publisher" : "rakuten";
  return {
    itemCaption: providerCaption ?? collectedCaption,
    captionSource,
    captionSourceUrl: providerCaption === undefined ? collected?.sourceUrl : provider?.itemUrl,
    publisherName: text(provider?.publisherName) ?? collected?.publisherName ?? work.publisher,
    salesDate: text(provider?.salesDate) ?? collected?.salesDate ?? matchingVolume?.releaseDate,
    imageUrl: text(provider?.imageUrl) ?? collected?.imageUrl,
    imprint: collected?.imprint,
    pageCount: collected?.pageCount,
    collectedSourceUrl: collected?.sourceUrl,
  };
}

/**
 * The author's other Catalog works for the detail page. The featured work is the recommendable
 * one with the most Rakuten reviews (ties by work ID); the rest follow in the same order and
 * may include library-only works. Deterministic so prerendered and hydrated output match.
 */
export function selectSameAuthorWorks(
  catalog: CatalogV1,
  source: Work,
  reviewCountOf: (workId: string) => number | undefined,
) {
  if (!source.eligibility.recommendationEligible) return null;
  const authors = new Map(source.creators.map((author) => [normalizeCreator(author), author]));
  const byReviewsThenId = (left: Work, right: Work) =>
    (reviewCountOf(right.id) ?? -1) - (reviewCountOf(left.id) ?? -1) ||
    (left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
  const candidates = catalog.works
    .filter(
      (work) =>
        work.id !== source.id &&
        work.creators.some((author) => authors.has(normalizeCreator(author))),
    )
    .sort(byReviewsThenId);
  const featured = candidates.find((work) => work.eligibility.recommendationEligible);
  const others = candidates.filter((work) => work !== featured);
  const sample = featured ?? others[0];
  const author = sample?.creators.map((name) => authors.get(normalizeCreator(name))).find(Boolean);
  return sample === undefined || author === undefined
    ? null
    : { author, featured: featured ?? null, others };
}
