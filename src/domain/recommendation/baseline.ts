import type { GenreTag, Work } from "../catalog/types";
import { recommendationProfileRecords } from "../profile/catalog-profile";
import { REACTION_WEIGHTS } from "../profile/constants";
import type { RecommendationPolicies } from "../profile/types";
import type { PositiveAnchorInput } from "./anchor";
import { assertRecommendationContext, constraintMetadataFor, marketSignalFor } from "./context";
import { calculateBayesianRating, calculateMaturity } from "./market";
import { compareFloatingPoint, compareText, roundScore } from "./math";
import { applyListConstraints } from "./ordering";
import {
  assertUniqueRecords,
  filterEligibleCandidates,
  majorThemeKey,
  positiveAnchors,
} from "./rank";
import type {
  BaselineContribution,
  BaselineRecommendation,
  RecommendationInput,
  ScoredRecommendation,
} from "./types";

export const BASELINE_VERSION = "v1";

const GENRE_WEIGHT = 0.6;
const MARKET_WEIGHT = 0.3;
const MATURITY_WEIGHT = 0.1;

type GenreAnchorMatch = PositiveAnchorInput & {
  genreJaccard: number;
  reactionWeight: number;
  score: number;
};

type ScoredBaselineCandidate = {
  result: BaselineRecommendation;
  work: Work;
  isDiscovery: boolean;
  majorThemeKey: string;
  seriesGroupId: string;
};

const POLICY_KEYS = [
  "preferCompleted",
  "preferHidden",
  "preferVerified",
  "excludeIncomplete",
] as const satisfies readonly (keyof RecommendationPolicies)[];

function assertDefaultPolicies(policies: RecommendationPolicies) {
  for (const key of POLICY_KEYS) {
    if (policies[key]) {
      throw new Error(`Baseline v1 requires ${key}=false.`);
    }
  }
}

export function calculateGenreJaccard(
  leftGenres: readonly GenreTag[],
  rightGenres: readonly GenreTag[],
) {
  const left = new Set(leftGenres);
  const right = new Set(rightGenres);
  if (left.size === 0 || right.size === 0) {
    return 0;
  }

  let intersectionSize = 0;
  for (const genre of left) {
    if (right.has(genre)) {
      intersectionSize += 1;
    }
  }
  return intersectionSize / (left.size + right.size - intersectionSize);
}

function bestGenreAnchor(candidate: Work, anchors: readonly PositiveAnchorInput[]) {
  const byScore = anchors
    .map<GenreAnchorMatch>((anchor) => {
      const genreJaccard = calculateGenreJaccard(candidate.genres, anchor.work.genres);
      const reactionWeight = REACTION_WEIGHTS[anchor.reaction];
      return {
        ...anchor,
        genreJaccard,
        reactionWeight,
        score: genreJaccard * reactionWeight,
      };
    })
    .sort((left, right) => right.score - left.score || compareText(left.work.id, right.work.id));
  const leader = byScore[0];
  if (leader === undefined) {
    return undefined;
  }

  return byScore
    .filter((match) => compareFloatingPoint(leader.score, match.score) === 0)
    .sort((left, right) => compareText(left.work.id, right.work.id))[0];
}

function contribution(
  entry: Omit<BaselineContribution, "value"> & { value: number },
): BaselineContribution | undefined {
  const value = roundScore(entry.value);
  return value === 0 ? undefined : { ...entry, value };
}

function sortContributions(entries: readonly BaselineContribution[]) {
  return [...entries].sort(
    (left, right) =>
      Math.abs(right.value) - Math.abs(left.value) ||
      compareText(left.source, right.source) ||
      compareText(left.factorId, right.factorId) ||
      compareText(left.anchorWorkIds.join("\u0000"), right.anchorWorkIds.join("\u0000")),
  );
}

function scoreCandidate(options: {
  work: Work;
  anchors: readonly PositiveAnchorInput[];
  input: RecommendationInput;
}): ScoredBaselineCandidate {
  const { anchors, input, work } = options;
  const bestAnchor = bestGenreAnchor(work, anchors);
  if (bestAnchor === undefined) {
    throw new Error("Baseline scoring requires at least one positive anchor.");
  }

  const metadata = constraintMetadataFor(work.id, input.context);
  const market = marketSignalFor(work.id, input.context);
  const bayesianRatingRaw = calculateBayesianRating(
    market.reviewAverage,
    market.reviewCount,
    input.context.marketSnapshot.catalogAverageRating,
  );
  const maturityRaw = calculateMaturity(metadata.volumeCount);
  const genreAnchorScore = bestAnchor.score;
  const baselineScore = roundScore(
    GENRE_WEIGHT * genreAnchorScore +
      MARKET_WEIGHT * (bayesianRatingRaw / 5) +
      MATURITY_WEIGHT * maturityRaw,
  );
  const bestAnchorId = genreAnchorScore > 0 ? bestAnchor.work.id : null;
  const entries: BaselineContribution[] = [];

  if (bestAnchorId !== null) {
    const candidateGenres = new Set(work.genres);
    const anchorGenres = new Set(bestAnchor.work.genres);
    const unionSize = new Set([...candidateGenres, ...anchorGenres]).size;
    for (const genre of [...candidateGenres]
      .filter((tag) => anchorGenres.has(tag))
      .sort(compareText)) {
      const entry = contribution({
        source: "genre",
        group: "genre",
        factorId: genre,
        value: (GENRE_WEIGHT * bestAnchor.reactionWeight) / unionSize,
        anchorWorkIds: [bestAnchorId],
        explainable: true,
      });
      if (entry !== undefined) {
        entries.push(entry);
      }
    }
  }

  const marketEntry = contribution({
    source: "market",
    group: "overall",
    factorId: "bayesianRating",
    value: MARKET_WEIGHT * (bayesianRatingRaw / 5),
    anchorWorkIds: [],
    explainable: market.reviewAverage !== undefined && (market.reviewCount ?? 0) > 0,
  });
  if (marketEntry !== undefined) {
    entries.push(marketEntry);
  }

  const maturityEntry = contribution({
    source: "maturity",
    group: "overall",
    factorId: "maturity",
    value: MATURITY_WEIGHT * maturityRaw,
    anchorWorkIds: [],
    explainable: metadata.volumeCount > 0,
  });
  if (maturityEntry !== undefined) {
    entries.push(maturityEntry);
  }

  return {
    result: {
      workId: work.id,
      baselineScore,
      bestAnchorId,
      genreScore: roundScore(genreAnchorScore),
      bayesianRating: roundScore(bayesianRatingRaw),
      maturity: roundScore(maturityRaw),
      contributions: sortContributions(entries),
    },
    work,
    isDiscovery: metadata.catalogRole === "discovery",
    majorThemeKey: majorThemeKey(work),
    seriesGroupId: metadata.seriesGroupId ?? work.id,
  };
}

function listConstraintAdapter(candidate: ScoredBaselineCandidate): ScoredRecommendation {
  return {
    work: candidate.work,
    workId: candidate.result.workId,
    tasteScore: candidate.result.baselineScore,
    confidence: 0,
    bestAnchorId: candidate.result.bestAnchorId ?? `none:${candidate.result.workId}`,
    contributions: [],
    penaltiesApplied: [],
    bayesianRating: candidate.result.bayesianRating,
    maturity: candidate.result.maturity,
    isPopular: false,
    isDiscovery: candidate.isDiscovery,
    majorThemeKey: candidate.majorThemeKey,
    seriesGroupId: candidate.seriesGroupId,
  };
}

export function rankBaselineRecommendations(input: RecommendationInput): BaselineRecommendation[] {
  assertRecommendationContext(input.catalog, input.context);
  assertUniqueRecords(input.records);
  assertDefaultPolicies(input.policies);

  const worksById = Object.fromEntries(input.catalog.works.map((work) => [work.id, work]));
  const catalogRecords = recommendationProfileRecords(input.records, input.catalog.works);
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
  const scored = candidates
    .map((work) => scoreCandidate({ work, anchors, input }))
    .sort(
      (left, right) =>
        right.result.baselineScore - left.result.baselineScore ||
        compareText(left.result.workId, right.result.workId),
    );
  const byWorkId = new Map(scored.map((candidate) => [candidate.result.workId, candidate.result]));
  return applyListConstraints(scored.map(listConstraintAdapter), input.policies).flatMap(
    (candidate) => {
      const result = byWorkId.get(candidate.workId);
      return result === undefined ? [] : [result];
    },
  );
}
