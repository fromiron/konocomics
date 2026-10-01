import { normalizeCreator } from "@/domain/catalog/normalize";
import type { CatalogV1, Volume, Work } from "@/domain/catalog/types";
import type { ProviderCacheState } from "@/infrastructure/rakuten";
import type { TasteRecommendationExplanation } from "@/domain/explanation";
import type { GroupContribution } from "@/domain/recommendation/types";

export type WorkEvidence = Readonly<{
  work: Work;
  contribution: number;
  reasons: readonly string[];
}>;

/** Detail presentation keeps all real evidence; the engine and shared explanation cap stay intact. */
export function collectWorkEvidence(
  catalog: CatalogV1,
  contributions: readonly GroupContribution[],
  explanation: TasteRecommendationExplanation,
): WorkEvidence[] {
  const sentences = [
    ...explanation.positiveReasons,
    ...(explanation.caution === undefined ? [] : [explanation.caution]),
  ].filter((reason) => reason.source === "similarity");
  const shownIds = new Set(sentences.flatMap((reason) => reason.anchorWorkIds));
  const values = new Map<string, number>([...shownIds].map((id) => [id, 0]));
  for (const entry of contributions) {
    if (entry.value <= 0 || (entry.source !== "similarity" && entry.source !== "consensus"))
      continue;
    for (const workId of new Set(entry.anchorWorkIds)) {
      if (entry.source === "similarity" && !shownIds.has(workId)) continue;
      // A shared consensus bonus has no supporter-specific split: its supporters remain tied.
      values.set(workId, (values.get(workId) ?? 0) + entry.value);
    }
  }
  return catalog.works
    .flatMap((work) => {
      const contribution = values.get(work.id);
      return contribution === undefined || work.title.trim() === ""
        ? []
        : [
            {
              work,
              contribution,
              reasons: [
                ...new Set(
                  sentences
                    .filter((reason) => reason.anchorWorkIds.includes(work.id))
                    .map((reason) => reason.text),
                ),
              ],
            },
          ];
    })
    .sort(
      (left, right) =>
        right.contribution - left.contribution ||
        (left.work.id < right.work.id ? -1 : left.work.id > right.work.id ? 1 : 0),
    );
}

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
    collectedCaption === undefined ? "rakuten" : "publisher";
  return {
    itemCaption: collectedCaption ?? providerCaption,
    captionSource,
    captionSourceUrl: collectedCaption === undefined ? provider?.itemUrl : collected?.sourceUrl,
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
