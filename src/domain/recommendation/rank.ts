import type { Work } from "../catalog/types";
import {
  calculateProfileConfidence,
  calculateRecommendationConfidence,
  calculateWorkConfidence,
  getConfidenceLevel,
} from "../profile/confidence";
import type { ProfileAdjustments, RecommendationPolicies, UserWorkRecord } from "../profile/types";
import { calculateExplicitAdjustment, isHardExcluded } from "./adjustment";
import { calculatePositiveAnchorScore, type PositiveAnchorInput } from "./anchor";
import { COMPLETED_POLICY_PENALTY } from "./constants";
import { assertRecommendationContext, constraintMetadataFor, marketSignalFor } from "./context";
import { calculateBayesianRating, calculateMaturity } from "./market";
import { clamp, compareText, ownRecordValue, roundScore } from "./math";
import {
  determinePopularWorkIds,
  selectRecommendationPlanEntries,
  sortScoredRecommendations,
} from "./ordering";
import { calculateNegativePenalties } from "./penalty";
import type {
  GroupContribution,
  RecommendationPlanEntry,
  RankedRecommendation,
  RecommendationInput,
  ScoredRecommendation,
} from "./types";

const EXCLUDED_READING_STATES = new Set(["reading", "completed", "dropped", "hidden"]);

export function assertUniqueRecords(records: readonly UserWorkRecord[]) {
  const seen = new Set<string>();
  for (const record of [...records].sort((left, right) => compareText(left.workId, right.workId))) {
    if (seen.has(record.workId)) {
      throw new Error(`Duplicate user work record: ${record.workId}`);
    }
    seen.add(record.workId);
  }
}

export function positiveAnchors(
  worksById: Readonly<Record<string, Work>>,
  records: readonly UserWorkRecord[],
) {
  return [...records]
    .sort((left, right) => compareText(left.workId, right.workId))
    .flatMap<PositiveAnchorInput>((record) => {
      if (record.reaction !== "favorite" && record.reaction !== "liked") {
        return [];
      }
      const work = ownRecordValue(worksById, record.workId);
      return work === undefined ? [] : [{ work, reaction: record.reaction }];
    });
}

function excludedByRecord(record: UserWorkRecord | undefined) {
  return (
    record !== undefined &&
    (EXCLUDED_READING_STATES.has(record.readingState) || record.reaction === "disliked")
  );
}

export function filterEligibleCandidates(options: {
  works: readonly Work[];
  records: readonly UserWorkRecord[];
  adjustments: ProfileAdjustments;
  policies: RecommendationPolicies;
}) {
  const { adjustments, policies, records, works } = options;
  const recordByWorkId = new Map(records.map((record) => [record.workId, record]));
  const anchorIds = new Set(
    records
      .filter((record) => record.reaction === "favorite" || record.reaction === "liked")
      .map((record) => record.workId),
  );

  return [...works]
    .sort((left, right) => compareText(left.id, right.id))
    .filter(
      (work) =>
        work.eligibility.recommendationEligible &&
        !anchorIds.has(work.id) &&
        !excludedByRecord(recordByWorkId.get(work.id)) &&
        !isHardExcluded(work, adjustments, policies.excludeIncomplete),
    );
}

export function majorThemeKey(work: Work) {
  const themes = work.themes
    .filter((theme) => theme.centrality === 2)
    .map((theme) => theme.id)
    .sort(compareText);
  return themes.length === 0 ? `none:${work.id}` : themes.join("+");
}

function normalizeContribution(entry: GroupContribution): GroupContribution | null {
  const value = roundScore(entry.value);
  if (value === 0) {
    return null;
  }
  return {
    ...entry,
    value,
    anchorWorkIds: [...new Set(entry.anchorWorkIds)].sort(compareText),
  };
}

function sortContributions(entries: readonly GroupContribution[]) {
  return entries
    .flatMap<GroupContribution>((entry) => {
      const normalized = normalizeContribution(entry);
      return normalized === null ? [] : [normalized];
    })
    .sort(
      (left, right) =>
        Math.abs(right.value) - Math.abs(left.value) ||
        compareText(left.source, right.source) ||
        compareText(left.group, right.group) ||
        compareText(left.factorId, right.factorId) ||
        compareText(left.axisPreferenceDirection ?? "", right.axisPreferenceDirection ?? "") ||
        compareText(left.anchorWorkIds.join("\u0000"), right.anchorWorkIds.join("\u0000")),
    );
}

function baselineContribution(weight: number): GroupContribution {
  return {
    source: "baseline",
    group: "overall",
    factorId: "neutralBaseline",
    value: 0.5 * weight,
    anchorWorkIds: [],
    explainable: false,
  };
}

function scoreCandidate(options: {
  work: Work;
  anchors: readonly PositiveAnchorInput[];
  records: readonly UserWorkRecord[];
  worksById: Readonly<Record<string, Work>>;
  profileConfidence: number;
  input: RecommendationInput;
  popularWorkIds: ReadonlySet<string>;
}): ScoredRecommendation | null {
  const { anchors, input, popularWorkIds, profileConfidence, records, work, worksById } = options;
  const anchorScore = calculatePositiveAnchorScore(work, anchors);
  if (anchorScore === null) {
    return null;
  }
  const bestAnchor = ownRecordValue(worksById, anchorScore.bestAnchorId);
  if (bestAnchor === undefined) {
    return null;
  }

  const adjustment = calculateExplicitAdjustment(work, input.adjustments);
  const penalties = calculateNegativePenalties({
    candidate: work,
    bestAnchor,
    negativeRecords: records,
    worksById,
  });
  const policyAdjustment =
    input.policies.preferCompleted && work.status !== "completed" ? -COMPLETED_POLICY_PENALTY : 0;
  const preClampScore =
    anchorScore.positiveAnchorScore +
    adjustment.totalAdjustment -
    penalties.totalPenalty +
    policyAdjustment;
  const tasteScore = roundScore(clamp(preClampScore, 0, 1));
  const finalClamp = roundScore(tasteScore - preClampScore);

  const similarityContributions =
    anchorScore.bestAnchorSimilarity.contributions.map<GroupContribution>((entry) => ({
      source: "similarity",
      group: entry.group,
      factorId: entry.factorId,
      value: entry.value * anchorScore.bestAnchorReactionWeight,
      anchorWorkIds: [anchorScore.bestAnchorId],
      explainable: true,
    }));
  const ledger: GroupContribution[] = [
    baselineContribution(anchorScore.bestAnchorReactionWeight),
    ...similarityContributions,
  ];
  if (anchorScore.appliedConsensusBonus !== 0) {
    ledger.push({
      source: "consensus",
      group: "overall",
      factorId: "consensus",
      value: anchorScore.appliedConsensusBonus,
      anchorWorkIds: anchorScore.supporterMatches
        .map((supporter) => supporter.workId)
        .sort(compareText),
      explainable: false,
    });
  }
  ledger.push(...adjustment.contributions, ...penalties.contributions);
  if (policyAdjustment !== 0) {
    ledger.push({
      source: "policy",
      group: "overall",
      factorId: "preferCompleted",
      value: policyAdjustment,
      anchorWorkIds: [],
      explainable: false,
    });
  }
  if (finalClamp !== 0) {
    ledger.push({
      source: "clamp",
      group: "overall",
      factorId: "finalClamp",
      value: finalClamp,
      anchorWorkIds: [],
      explainable: false,
    });
  }

  const metadata = constraintMetadataFor(work.id, input.context);
  const market = marketSignalFor(work.id, input.context);
  const confidence = calculateRecommendationConfidence(
    profileConfidence,
    calculateWorkConfidence(work),
  );

  return {
    work,
    workId: work.id,
    tasteScore,
    confidence,
    bestAnchorId: anchorScore.bestAnchorId,
    contributions: sortContributions(ledger),
    penaltiesApplied: penalties.penaltiesApplied,
    bayesianRating: calculateBayesianRating(
      market.reviewAverage,
      market.reviewCount,
      input.context.marketSnapshot.catalogAverageRating,
    ),
    maturity: calculateMaturity(metadata.volumeCount),
    isPopular: popularWorkIds.has(work.id),
    isDiscovery: metadata.catalogRole === "discovery",
    majorThemeKey: majorThemeKey(work),
    seriesGroupId: metadata.seriesGroupId ?? work.id,
  };
}

export function serializeRecommendationConfidence(confidence: number) {
  return {
    confidence: roundScore(confidence),
    confidenceLevel: getConfidenceLevel(confidence),
  };
}

function planRecommendation(candidate: ScoredRecommendation): RecommendationPlanEntry {
  return {
    workId: candidate.workId,
    tasteScore: candidate.tasteScore,
    ...serializeRecommendationConfidence(candidate.confidence),
    bestAnchorId: candidate.bestAnchorId,
    contributions: candidate.contributions,
    penaltiesApplied: candidate.penaltiesApplied,
    isDiscovery: candidate.isDiscovery,
    majorThemeKey: candidate.majorThemeKey,
    seriesGroupId: candidate.seriesGroupId,
  };
}

function publicRecommendation(candidate: RecommendationPlanEntry): RankedRecommendation {
  return {
    workId: candidate.workId,
    tasteScore: candidate.tasteScore,
    confidence: candidate.confidence,
    confidenceLevel: candidate.confidenceLevel,
    bestAnchorId: candidate.bestAnchorId,
    contributions: candidate.contributions,
    penaltiesApplied: candidate.penaltiesApplied,
  };
}

export function buildRecommendationPlan(input: RecommendationInput): RecommendationPlanEntry[] {
  assertRecommendationContext(input.catalog, input.context);
  assertUniqueRecords(input.records);

  const worksById = Object.fromEntries(input.catalog.works.map((work) => [work.id, work]));
  const catalogRecords = input.records.filter(
    (record) => ownRecordValue(worksById, record.workId) !== undefined,
  );
  const anchors = positiveAnchors(worksById, catalogRecords);
  if (anchors.length === 0) {
    return [];
  }

  const candidates = filterEligibleCandidates({
    works: input.catalog.works,
    records: catalogRecords,
    adjustments: input.adjustments,
    policies: input.policies,
  });
  const popularWorkIds = determinePopularWorkIds(
    candidates.map((work) => work.id),
    input.context,
  );
  const profileConfidence = calculateProfileConfidence(catalogRecords);
  const scored = candidates.flatMap<ScoredRecommendation>((work) => {
    const result = scoreCandidate({
      work,
      anchors,
      records: catalogRecords,
      worksById,
      profileConfidence,
      input,
      popularWorkIds,
    });
    return result === null ? [] : [result];
  });
  const sorted = sortScoredRecommendations(scored, input.policies);
  return sorted.map(planRecommendation);
}

export function scoreWorkCompatibility(
  input: RecommendationInput,
  workId: string,
): RankedRecommendation | null {
  assertRecommendationContext(input.catalog, input.context);
  assertUniqueRecords(input.records);

  const worksById = Object.fromEntries(input.catalog.works.map((work) => [work.id, work]));
  const work = ownRecordValue(worksById, workId);
  if (work === undefined) {
    return null;
  }

  const catalogRecords = input.records.filter(
    (record) => ownRecordValue(worksById, record.workId) !== undefined,
  );
  const anchors = positiveAnchors(worksById, catalogRecords).filter(
    (anchor) => anchor.work.id !== workId,
  );
  if (anchors.length === 0) {
    return null;
  }

  const eligibleCandidates = filterEligibleCandidates({
    works: input.catalog.works,
    records: catalogRecords,
    adjustments: input.adjustments,
    policies: input.policies,
  });
  const candidate = scoreCandidate({
    work,
    anchors,
    records: catalogRecords,
    worksById,
    profileConfidence: calculateProfileConfidence(catalogRecords),
    input,
    popularWorkIds: determinePopularWorkIds(
      eligibleCandidates.map((eligibleWork) => eligibleWork.id),
      input.context,
    ),
  });

  return candidate === null ? null : publicRecommendation(planRecommendation(candidate));
}

export function rankRecommendations(input: RecommendationInput): RankedRecommendation[] {
  return selectRecommendationPlanEntries(buildRecommendationPlan(input), input.policies).map(
    publicRecommendation,
  );
}

export {
  applyListConstraints,
  backfillRecommendationPlanEntries,
  selectRecommendationPlanEntries,
  sortScoredRecommendations,
} from "./ordering";
