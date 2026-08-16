import type { RecommendationPolicies } from "../profile/types";
import { DISCOVERY_SCORE_WINDOW, TASTE_COHORT_THRESHOLD } from "./constants";
import { compareFloatingPoint, compareText, ownRecordValue, roundScore } from "./math";
import type {
  RecommendationConstraintCandidate,
  RecommendationContext,
  RecommendationPlanEntry,
  ScoredRecommendation,
} from "./types";

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

function countBy<Candidate extends RecommendationConstraintCandidate>(
  selected: readonly Candidate[],
  key: (candidate: Candidate) => string,
  value: string,
) {
  return selected.reduce((count, candidate) => count + (key(candidate) === value ? 1 : 0), 0);
}

function canAdd<Candidate extends RecommendationConstraintCandidate>(
  selected: readonly Candidate[],
  candidate: Candidate,
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

export function applyListConstraints<Candidate extends RecommendationConstraintCandidate>(
  sortedCandidates: readonly Candidate[],
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
  const isDiscoveryEligible = (candidate: RecommendationConstraintCandidate) =>
    !candidate.isDiscovery || candidate.tasteScore >= discoveryFloor;
  let selected: Candidate[] = [];

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

export function selectRecommendationPlanEntries(
  plan: readonly RecommendationPlanEntry[],
  policies: RecommendationPolicies,
  limit = 10,
) {
  return applyListConstraints(plan, policies, limit);
}

export type BackfillRecommendationPlanEntriesOptions = {
  plan: readonly RecommendationPlanEntry[];
  survivors: readonly RecommendationPlanEntry[];
  excludedWorkIds: readonly string[];
  policies: RecommendationPolicies;
  limit?: number;
};

export function backfillRecommendationPlanEntries({
  plan,
  survivors,
  excludedWorkIds,
  policies,
  limit = 10,
}: BackfillRecommendationPlanEntriesOptions): RecommendationPlanEntry[] {
  if (limit <= 0) {
    return [];
  }

  const planByWorkId = new Map<string, RecommendationPlanEntry>();
  const planOrder = new Map<string, number>();
  for (const [index, entry] of plan.entries()) {
    if (planByWorkId.has(entry.workId)) {
      throw new Error(`Duplicate recommendation plan work: ${entry.workId}`);
    }
    planByWorkId.set(entry.workId, entry);
    planOrder.set(entry.workId, index);
  }

  const excluded = new Set(excludedWorkIds);
  const selected: RecommendationPlanEntry[] = [];
  const sortSelected = () => {
    selected.sort(
      (left, right) =>
        (planOrder.get(left.workId) ?? Number.MAX_SAFE_INTEGER) -
        (planOrder.get(right.workId) ?? Number.MAX_SAFE_INTEGER),
    );
  };
  for (const survivor of survivors) {
    if (excluded.has(survivor.workId)) {
      continue;
    }
    const planEntry = planByWorkId.get(survivor.workId);
    if (planEntry === undefined) {
      throw new Error(`Recommendation survivor is absent from plan: ${survivor.workId}`);
    }
    if (!selected.some((entry) => entry.workId === planEntry.workId)) {
      selected.push(planEntry);
    }
  }
  sortSelected();
  if (selected.length >= limit) {
    return selected.slice(0, limit);
  }

  const discoveryMinimum = policies.preferHidden ? 2 : 1;
  const limits = { discoveryMaximum: policies.preferHidden ? 4 : 2 };
  const overallTopTasteScore = Math.max(...plan.map((entry) => entry.tasteScore));
  const discoveryFloor = roundScore(overallTopTasteScore - DISCOVERY_SCORE_WINDOW);
  const alreadySelected = new Set(selected.map((entry) => entry.workId));

  const appendFirstReserve = (discoveryOnly: boolean) => {
    for (const candidate of plan) {
      if (
        excluded.has(candidate.workId) ||
        alreadySelected.has(candidate.workId) ||
        (candidate.isDiscovery && candidate.tasteScore < discoveryFloor) ||
        (discoveryOnly && !candidate.isDiscovery) ||
        !canAdd(selected, candidate, limits)
      ) {
        continue;
      }
      selected.push(candidate);
      alreadySelected.add(candidate.workId);
      sortSelected();
      return true;
    }
    return false;
  };

  while (selected.length < limit) {
    const discoveryCount = selected.filter((entry) => entry.isDiscovery).length;
    const addedDiscovery = discoveryCount < discoveryMinimum ? appendFirstReserve(true) : false;
    if (!addedDiscovery && !appendFirstReserve(false)) {
      break;
    }
  }

  sortSelected();
  return selected;
}
