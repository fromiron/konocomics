import type { RecommendationPolicies } from "../profile/types";
import { DISCOVERY_SCORE_WINDOW, TASTE_COHORT_THRESHOLD } from "./constants";
import { compareFloatingPoint, compareText, ownRecordValue, roundScore } from "./math";
import type { RecommendationContext, ScoredRecommendation } from "./types";

function compareDescending(left: number, right: number) {
  return right - left;
}

function numericTuple(
  candidate: ScoredRecommendation,
  policies: RecommendationPolicies,
): readonly number[] {
  return policies.preferVerified
    ? [candidate.bayesianRating, candidate.maturity, candidate.confidence]
    : [candidate.confidence, candidate.bayesianRating];
}

function numericTupleValue(
  candidate: ScoredRecommendation,
  policies: RecommendationPolicies,
  keyIndex: number,
) {
  const value = numericTuple(candidate, policies)[keyIndex];
  if (value === undefined) {
    throw new Error(`Missing recommendation tuple key ${keyIndex}.`);
  }
  return value;
}

function sortByNumericTuple(
  candidates: readonly ScoredRecommendation[],
  policies: RecommendationPolicies,
  keyIndex = 0,
): ScoredRecommendation[] {
  const firstTuple =
    candidates[0] === undefined ? undefined : numericTuple(candidates[0], policies);
  if (firstTuple === undefined || keyIndex >= firstTuple.length) {
    return [...candidates].sort((left, right) => compareText(left.workId, right.workId));
  }

  const byValue = [...candidates].sort((left, right) => {
    const difference =
      numericTupleValue(right, policies, keyIndex) - numericTupleValue(left, policies, keyIndex);
    return difference === 0 ? compareText(left.workId, right.workId) : difference;
  });
  const sorted: ScoredRecommendation[] = [];

  for (let index = 0; index < byValue.length;) {
    const leader = byValue[index];
    if (leader === undefined) {
      break;
    }
    const leaderValue = numericTupleValue(leader, policies, keyIndex);
    let end = index + 1;
    while (end < byValue.length) {
      const candidate = byValue[end];
      if (
        candidate === undefined ||
        compareFloatingPoint(leaderValue, numericTupleValue(candidate, policies, keyIndex)) !== 0
      ) {
        break;
      }
      end += 1;
    }
    sorted.push(...sortByNumericTuple(byValue.slice(index, end), policies, keyIndex + 1));
    index = end;
  }

  return sorted;
}

function sortWithinTasteCohort(
  candidates: readonly ScoredRecommendation[],
  policies: RecommendationPolicies,
) {
  if (!policies.preferHidden) {
    return sortByNumericTuple(candidates, policies);
  }
  const hidden = candidates.filter((candidate) => !candidate.isPopular);
  const popular = candidates.filter((candidate) => candidate.isPopular);
  return [...sortByNumericTuple(hidden, policies), ...sortByNumericTuple(popular, policies)];
}

export function sortScoredRecommendations(
  candidates: readonly ScoredRecommendation[],
  policies: RecommendationPolicies,
) {
  const byTaste = [...candidates].sort(
    (left, right) =>
      compareDescending(left.tasteScore, right.tasteScore) ||
      compareText(left.workId, right.workId),
  );
  const sorted: ScoredRecommendation[] = [];

  for (let index = 0; index < byTaste.length;) {
    const leader = byTaste[index];
    if (leader === undefined) {
      break;
    }
    let end = index + 1;
    while (end < byTaste.length) {
      const candidate = byTaste[end];
      if (
        candidate === undefined ||
        roundScore(leader.tasteScore - candidate.tasteScore) >= TASTE_COHORT_THRESHOLD
      ) {
        break;
      }
      end += 1;
    }
    sorted.push(...sortWithinTasteCohort(byTaste.slice(index, end), policies));
    index = end;
  }

  return sorted;
}

export function determinePopularWorkIds(
  eligibleWorkIds: readonly string[],
  context: RecommendationContext,
) {
  const uniqueIds = [...new Set(eligibleWorkIds)].sort(compareText);
  if (uniqueIds.length === 0) {
    return new Set<string>();
  }

  const ranked = uniqueIds
    .map((workId) => ({
      workId,
      reviewCount: ownRecordValue(context.marketSnapshot.byWorkId, workId)?.reviewCount ?? 0,
    }))
    .sort(
      (left, right) =>
        compareDescending(left.reviewCount, right.reviewCount) ||
        compareText(left.workId, right.workId),
    );
  const topCount = Math.ceil(ranked.length * 0.2);
  const boundary = ranked[topCount - 1]?.reviewCount ?? 0;
  return new Set(
    ranked.filter((entry) => entry.reviewCount >= boundary).map((entry) => entry.workId),
  );
}

type ListLimits = {
  discoveryMaximum: number;
};

function countBy(
  selected: readonly ScoredRecommendation[],
  key: (candidate: ScoredRecommendation) => string,
  value: string,
) {
  return selected.reduce((count, candidate) => count + (key(candidate) === value ? 1 : 0), 0);
}

function canAdd(
  selected: readonly ScoredRecommendation[],
  candidate: ScoredRecommendation,
  limits: ListLimits,
) {
  if (selected.some((entry) => entry.workId === candidate.workId)) {
    return false;
  }
  if (countBy(selected, (entry) => entry.bestAnchorId, candidate.bestAnchorId) >= 4) {
    return false;
  }
  if (countBy(selected, (entry) => entry.majorThemeKey, candidate.majorThemeKey) >= 3) {
    return false;
  }
  if (countBy(selected, (entry) => entry.seriesGroupId, candidate.seriesGroupId) >= 1) {
    return false;
  }
  if (
    candidate.isDiscovery &&
    selected.filter((entry) => entry.isDiscovery).length >= limits.discoveryMaximum
  ) {
    return false;
  }
  return true;
}

export function applyListConstraints(
  sortedCandidates: readonly ScoredRecommendation[],
  policies: RecommendationPolicies,
  limit = 10,
) {
  const first = sortedCandidates[0];
  if (first === undefined || limit <= 0) {
    return [];
  }

  const discoveryMinimum = policies.preferHidden ? 2 : 1;
  const limits = { discoveryMaximum: policies.preferHidden ? 4 : 2 };
  const overallTopTasteScore = Math.max(
    ...sortedCandidates.map((candidate) => candidate.tasteScore),
  );
  const discoveryFloor = roundScore(overallTopTasteScore - DISCOVERY_SCORE_WINDOW);
  const isDiscoveryEligible = (candidate: ScoredRecommendation) =>
    !candidate.isDiscovery || candidate.tasteScore >= discoveryFloor;
  let selected: ScoredRecommendation[] = [];

  for (const candidate of sortedCandidates) {
    if (selected.length >= limit) {
      break;
    }
    if (isDiscoveryEligible(candidate) && canAdd(selected, candidate, limits)) {
      selected.push(candidate);
    }
  }

  const order = new Map(sortedCandidates.map((candidate, index) => [candidate.workId, index]));
  const sortSelected = () => {
    selected.sort(
      (left, right) =>
        (order.get(left.workId) ?? Number.MAX_SAFE_INTEGER) -
        (order.get(right.workId) ?? Number.MAX_SAFE_INTEGER),
    );
  };

  while (selected.filter((candidate) => candidate.isDiscovery).length < discoveryMinimum) {
    let changed = false;
    const discoveryCandidates = sortedCandidates.filter(
      (candidate) =>
        candidate.isDiscovery &&
        candidate.tasteScore >= discoveryFloor &&
        !selected.some((entry) => entry.workId === candidate.workId),
    );

    for (const discovery of discoveryCandidates) {
      if (selected.length < limit && canAdd(selected, discovery, limits)) {
        selected.push(discovery);
        sortSelected();
        changed = true;
        break;
      }

      if (selected.length < limit) {
        continue;
      }

      const removable = [...selected].reverse().filter((candidate) => !candidate.isDiscovery);
      for (const candidate of removable) {
        const virtualSelection = selected.filter((entry) => entry.workId !== candidate.workId);
        if (canAdd(virtualSelection, discovery, limits)) {
          selected = [...virtualSelection, discovery];
          sortSelected();
          changed = true;
          break;
        }
      }
      if (changed) {
        break;
      }
    }

    if (!changed) {
      break;
    }
  }

  sortSelected();
  return selected;
}
