import { NARRATIVE_AXIS_IDS, TONE_AXIS_IDS } from "../../src/domain/catalog/constants";
import type { Demographic, GenreTag, ScaleValue, ThemeTag } from "../../src/domain/catalog/types";

export const NON_ART_AXIS_IDS = [...NARRATIVE_AXIS_IDS, ...TONE_AXIS_IDS] as const;

export type NonArtAxisId = (typeof NON_ART_AXIS_IDS)[number];
export type CatalogRole = "anchor" | "bridge" | "discovery";

export type ReplacementProfile = {
  workId: string;
  genres: readonly GenreTag[];
  themes: readonly { id: ThemeTag; centrality: 1 | 2 }[];
  factors: Partial<Record<NonArtAxisId, ScaleValue>>;
};

export type CohortProfile = ReplacementProfile & {
  demographic: Demographic;
  catalogRole: CatalogRole;
  onboardingEligible: boolean;
};

export type ReplacementSlot = {
  removedWorkId: string;
  demographic: Demographic;
  catalogRole: CatalogRole;
  onboardingEligible: boolean;
  minimumValidCandidates: number;
  candidateWorkIds: readonly string[];
};

export type ReplacementContract = {
  minimumSharedKnownNonArtAxes: number;
  requiredNonArtGroups: readonly ("narrative" | "tone")[];
  distanceWeights: { axis: number; genre: number; theme: number };
};

export type ReplacementDistance = {
  sharedKnownAxisIds: NonArtAxisId[];
  axisDistance: number;
  genreDistance: number;
  themeDistance: number;
  totalDistance: number;
};

export type ReplacementSelection = {
  replacements: {
    removedWorkId: string;
    selectedWorkId: string;
    inherited: {
      demographic: Demographic;
      catalogRole: CatalogRole;
      onboardingEligible: boolean;
    };
    distance: ReplacementDistance;
  }[];
  selectedPairRank: number;
  pairRanking: {
    rank: number;
    candidateWorkIds: string[];
    totalDistance: number;
    diversityPassed: boolean;
    diversityFailures: string[];
  }[];
};

function codeUnitCompare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function jaccard(left: readonly string[], right: readonly string[]) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const union = new Set([...leftSet, ...rightSet]);
  if (union.size === 0) {
    return 1;
  }
  let intersectionSize = 0;
  for (const value of leftSet) {
    if (rightSet.has(value)) {
      intersectionSize += 1;
    }
  }
  return intersectionSize / union.size;
}

function weightedThemeJaccard(
  left: ReplacementProfile["themes"],
  right: ReplacementProfile["themes"],
) {
  const leftWeights = new Map(left.map((theme) => [theme.id, theme.centrality]));
  const rightWeights = new Map(right.map((theme) => [theme.id, theme.centrality]));
  const themeIds = new Set([...leftWeights.keys(), ...rightWeights.keys()]);
  let minimumSum = 0;
  let maximumSum = 0;
  for (const themeId of themeIds) {
    const leftWeight = leftWeights.get(themeId) ?? 0;
    const rightWeight = rightWeights.get(themeId) ?? 0;
    minimumSum += Math.min(leftWeight, rightWeight);
    maximumSum += Math.max(leftWeight, rightWeight);
  }
  return maximumSum === 0 ? 1 : minimumSum / maximumSum;
}

export function calculateReplacementDistance(
  removed: ReplacementProfile,
  candidate: ReplacementProfile,
  contract: ReplacementContract,
) {
  const sharedKnownAxisIds = NON_ART_AXIS_IDS.filter(
    (axisId) => removed.factors[axisId] !== undefined && candidate.factors[axisId] !== undefined,
  );
  if (sharedKnownAxisIds.length < contract.minimumSharedKnownNonArtAxes) {
    return undefined;
  }

  const hasNarrative = sharedKnownAxisIds.some((axisId) =>
    NARRATIVE_AXIS_IDS.some((narrativeAxisId) => narrativeAxisId === axisId),
  );
  const hasTone = sharedKnownAxisIds.some((axisId) =>
    TONE_AXIS_IDS.some((toneAxisId) => toneAxisId === axisId),
  );
  if (
    (contract.requiredNonArtGroups.includes("narrative") && !hasNarrative) ||
    (contract.requiredNonArtGroups.includes("tone") && !hasTone)
  ) {
    return undefined;
  }

  const axisDistance =
    sharedKnownAxisIds.reduce((sum, axisId) => {
      const removedValue = removed.factors[axisId];
      const candidateValue = candidate.factors[axisId];
      if (removedValue === undefined || candidateValue === undefined) {
        throw new Error(`Unexpected unknown shared axis ${axisId}`);
      }
      return sum + Math.abs(candidateValue - removedValue) / 4;
    }, 0) / sharedKnownAxisIds.length;
  const genreDistance = 1 - jaccard(removed.genres, candidate.genres);
  const themeDistance = 1 - weightedThemeJaccard(removed.themes, candidate.themes);

  return {
    sharedKnownAxisIds,
    axisDistance,
    genreDistance,
    themeDistance,
    totalDistance:
      contract.distanceWeights.axis * axisDistance +
      contract.distanceWeights.genre * genreDistance +
      contract.distanceWeights.theme * themeDistance,
  };
}

function histogram<T>(values: readonly T[], key: (value: T) => string) {
  const counts = new Map<string, number>();
  for (const value of values) {
    const item = key(value);
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  return [...counts].sort(([left], [right]) => codeUnitCompare(left, right));
}

function sameHistogram<T>(
  original: readonly T[],
  replacement: readonly T[],
  key: (value: T) => string,
) {
  return JSON.stringify(histogram(original, key)) === JSON.stringify(histogram(replacement, key));
}

function evaluateDiversity(
  originalCohort: readonly CohortProfile[],
  slots: readonly ReplacementSlot[],
  candidates: readonly ReplacementProfile[],
) {
  const removedWorkIds = new Set(slots.map((slot) => slot.removedWorkId));
  const finalCohort: CohortProfile[] = originalCohort.filter(
    (work) => !removedWorkIds.has(work.workId),
  );
  for (const [index, slot] of slots.entries()) {
    const candidate = candidates[index];
    if (candidate === undefined) {
      throw new Error(`Missing replacement candidate for ${slot.removedWorkId}`);
    }
    finalCohort.push({
      ...candidate,
      demographic: slot.demographic,
      catalogRole: slot.catalogRole,
      onboardingEligible: slot.onboardingEligible,
    });
  }

  const failures: string[] = [];
  if (!sameHistogram(originalCohort, finalCohort, (work) => work.demographic)) {
    failures.push("demographic-counts");
  }
  if (!sameHistogram(originalCohort, finalCohort, (work) => work.catalogRole)) {
    failures.push("catalog-role-counts");
  }
  if (!sameHistogram(originalCohort, finalCohort, (work) => String(work.onboardingEligible))) {
    failures.push("onboarding-counts");
  }

  const finalGenres = new Set(finalCohort.flatMap((work) => work.genres));
  const missingGenres = [...new Set(originalCohort.flatMap((work) => work.genres))]
    .filter((genre) => !finalGenres.has(genre))
    .sort(codeUnitCompare);
  if (missingGenres.length > 0) {
    failures.push(`genres:${missingGenres.join(",")}`);
  }

  const finalCentralThemes = new Set(
    finalCohort.flatMap((work) =>
      work.themes.filter((theme) => theme.centrality === 2).map((theme) => theme.id),
    ),
  );
  const missingCentralThemes = [
    ...new Set(
      originalCohort.flatMap((work) =>
        work.themes.filter((theme) => theme.centrality === 2).map((theme) => theme.id),
      ),
    ),
  ]
    .filter((theme) => !finalCentralThemes.has(theme))
    .sort(codeUnitCompare);
  if (missingCentralThemes.length > 0) {
    failures.push(`central-themes:${missingCentralThemes.join(",")}`);
  }

  for (const axisId of NON_ART_AXIS_IDS) {
    const originalValues = originalCohort
      .map((work) => work.factors[axisId])
      .filter((value): value is ScaleValue => value !== undefined);
    const finalValues = finalCohort
      .map((work) => work.factors[axisId])
      .filter((value): value is ScaleValue => value !== undefined);
    if (originalValues.length === 0) {
      continue;
    }
    const firstValue = originalValues[0];
    if (firstValue === undefined) {
      continue;
    }
    const originalMinimum = originalValues.reduce(
      (minimum, value) => (value < minimum ? value : minimum),
      firstValue,
    );
    const originalMaximum = originalValues.reduce(
      (maximum, value) => (value > maximum ? value : maximum),
      firstValue,
    );
    if (!finalValues.includes(originalMinimum) || !finalValues.includes(originalMaximum)) {
      failures.push(`axis-extrema:${axisId}`);
    }
    const missingBins = [...new Set(originalValues)]
      .filter((value) => !finalValues.includes(value))
      .sort((left, right) => left - right);
    if (missingBins.length > 0) {
      failures.push(`axis-bins:${axisId}:${missingBins.join(",")}`);
    }
  }

  return { passed: failures.length === 0, failures };
}

function uniqueByWorkId<T extends { workId: string }>(values: readonly T[], label: string) {
  const result = new Map<string, T>();
  for (const value of values) {
    if (result.has(value.workId)) {
      throw new Error(`Duplicate ${label} workId: ${value.workId}`);
    }
    result.set(value.workId, value);
  }
  return result;
}

export function selectReplacementPair(input: {
  originalCohort: readonly CohortProfile[];
  slots: readonly ReplacementSlot[];
  candidates: readonly ReplacementProfile[];
  contract: ReplacementContract;
}): ReplacementSelection {
  if (input.slots.length !== 2) {
    throw new Error(
      `G1 replacement selection requires exactly two slots, received ${input.slots.length}`,
    );
  }
  const originalById = uniqueByWorkId(input.originalCohort, "original cohort");
  const candidateById = uniqueByWorkId(input.candidates, "candidate");
  const slots = [...input.slots].sort((left, right) =>
    codeUnitCompare(left.removedWorkId, right.removedWorkId),
  );
  const pooledCandidateIds = new Set<string>();
  const distanceByPair = new Map<string, ReplacementDistance>();

  for (const slot of slots) {
    const removed = originalById.get(slot.removedWorkId);
    if (removed === undefined) {
      throw new Error(`Removed work is outside the original cohort: ${slot.removedWorkId}`);
    }
    if (
      removed.demographic !== slot.demographic ||
      removed.catalogRole !== slot.catalogRole ||
      removed.onboardingEligible !== slot.onboardingEligible
    ) {
      throw new Error(`Slot inheritance does not match removed work: ${slot.removedWorkId}`);
    }
    const candidateIds = [...slot.candidateWorkIds].sort(codeUnitCompare);
    let eligibleCount = 0;
    for (const candidateWorkId of candidateIds) {
      if (pooledCandidateIds.has(candidateWorkId)) {
        throw new Error(`Duplicate candidate across replacement slots: ${candidateWorkId}`);
      }
      pooledCandidateIds.add(candidateWorkId);
      if (originalById.has(candidateWorkId)) {
        throw new Error(`Replacement candidate already belongs to the cohort: ${candidateWorkId}`);
      }
      const candidate = candidateById.get(candidateWorkId);
      if (candidate === undefined) {
        throw new Error(`Missing replacement candidate profile: ${candidateWorkId}`);
      }
      const distance = calculateReplacementDistance(removed, candidate, input.contract);
      if (distance !== undefined) {
        eligibleCount += 1;
        distanceByPair.set(`${slot.removedWorkId}\u0000${candidateWorkId}`, distance);
      }
    }
    if (eligibleCount < slot.minimumValidCandidates) {
      throw new Error(
        `Slot ${slot.removedWorkId} has ${eligibleCount} valid candidates; requires ${slot.minimumValidCandidates}`,
      );
    }
    if (eligibleCount !== candidateIds.length) {
      throw new Error(
        `Slot ${slot.removedWorkId} cannot produce the frozen all-pairs ranking: ${eligibleCount}/${candidateIds.length} candidates are valid`,
      );
    }
  }
  if (candidateById.size !== pooledCandidateIds.size) {
    throw new Error("Candidate profiles must exactly match the frozen replacement pool");
  }

  const leftSlot = slots[0];
  const rightSlot = slots[1];
  if (leftSlot === undefined || rightSlot === undefined) {
    throw new Error("Expected two replacement slots");
  }
  const pairs: Omit<ReplacementSelection["pairRanking"][number], "rank">[] = [];
  for (const leftCandidateId of [...leftSlot.candidateWorkIds].sort(codeUnitCompare)) {
    for (const rightCandidateId of [...rightSlot.candidateWorkIds].sort(codeUnitCompare)) {
      const leftCandidate = candidateById.get(leftCandidateId);
      const rightCandidate = candidateById.get(rightCandidateId);
      const leftDistance = distanceByPair.get(`${leftSlot.removedWorkId}\u0000${leftCandidateId}`);
      const rightDistance = distanceByPair.get(
        `${rightSlot.removedWorkId}\u0000${rightCandidateId}`,
      );
      if (
        leftCandidate === undefined ||
        rightCandidate === undefined ||
        leftDistance === undefined ||
        rightDistance === undefined
      ) {
        throw new Error("Frozen candidate pair is missing a valid distance");
      }
      const diversity = evaluateDiversity(input.originalCohort, slots, [
        leftCandidate,
        rightCandidate,
      ]);
      pairs.push({
        candidateWorkIds: [leftCandidateId, rightCandidateId],
        totalDistance: leftDistance.totalDistance + rightDistance.totalDistance,
        diversityPassed: diversity.passed,
        diversityFailures: diversity.failures,
      });
    }
  }

  pairs.sort((left, right) => {
    const distanceOrder = left.totalDistance - right.totalDistance;
    if (distanceOrder !== 0) {
      return distanceOrder;
    }
    return (
      codeUnitCompare(left.candidateWorkIds[0] ?? "", right.candidateWorkIds[0] ?? "") ||
      codeUnitCompare(left.candidateWorkIds[1] ?? "", right.candidateWorkIds[1] ?? "")
    );
  });
  const pairRanking = pairs.map((pair, index) => ({ rank: index + 1, ...pair }));
  const selectedPair = pairRanking.find((pair) => pair.diversityPassed);
  if (selectedPair === undefined) {
    throw new Error("No replacement pair preserves the frozen cohort diversity contract");
  }

  return {
    replacements: slots.map((slot, index) => {
      const selectedWorkId = selectedPair.candidateWorkIds[index];
      const distance =
        selectedWorkId === undefined
          ? undefined
          : distanceByPair.get(`${slot.removedWorkId}\u0000${selectedWorkId}`);
      if (selectedWorkId === undefined || distance === undefined) {
        throw new Error(`Selected pair is missing slot ${slot.removedWorkId}`);
      }
      return {
        removedWorkId: slot.removedWorkId,
        selectedWorkId,
        inherited: {
          demographic: slot.demographic,
          catalogRole: slot.catalogRole,
          onboardingEligible: slot.onboardingEligible,
        },
        distance,
      };
    }),
    selectedPairRank: selectedPair.rank,
    pairRanking,
  };
}
