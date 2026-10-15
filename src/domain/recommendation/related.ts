import type { Work } from "../catalog/types";
import { compareFloatingPoint, compareText } from "./math";
import { workSimilarity } from "./similarity";
import type { SimilarityContribution } from "./types";

export type RelatedWork = Readonly<{
  work: Work;
  score: number;
  contributions: readonly SimilarityContribution[];
}>;

/** Work-to-work relationships only; personal records and recommendation policies do not apply. */
export function selectRelatedWorks({
  source,
  candidates,
}: Readonly<{
  source: Work;
  candidates: readonly Work[];
}>): readonly RelatedWork[] {
  if (!source.eligibility.recommendationEligible) return [];

  return candidates
    .flatMap<RelatedWork>((work) => {
      if (work.id === source.id || !work.eligibility.recommendationEligible) return [];
      const similarity = workSimilarity(source, work);
      if (compareFloatingPoint(similarity.score, 0.5) <= 0) return [];
      const contributions = similarity.contributions
        .filter((entry) => entry.value > 0 && similarity.groups[entry.group].coverageScale === 1)
        .sort(
          (left, right) =>
            right.value - left.value ||
            compareText(left.group, right.group) ||
            compareText(left.factorId, right.factorId),
        );
      return contributions.length === 0 ? [] : [{ work, score: similarity.score, contributions }];
    })
    .sort((left, right) => right.score - left.score || compareText(left.work.id, right.work.id))
    .slice(0, 16);
}
