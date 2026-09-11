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

export function selectSameAuthorWork(catalog: CatalogV1, source: Work) {
  if (!source.eligibility.recommendationEligible) return null;
  const authors = new Map(source.creators.map((author) => [normalizeCreator(author), author]));
  const candidates = catalog.works.filter(
    (work) =>
      work.id !== source.id &&
      work.eligibility.recommendationEligible &&
      work.creators.some((author) => authors.has(normalizeCreator(author))),
  );
  candidates.sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
  const work = candidates[0];
  const author = work?.creators.map((name) => authors.get(normalizeCreator(name))).find(Boolean);
  return work === undefined || author === undefined ? null : { work, author };
}
