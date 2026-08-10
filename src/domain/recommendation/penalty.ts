import type { AxisId, ScaleValue, Work } from "../catalog/types";
import { FACTOR_BACKED_NEGATIVE_REASON_IDS } from "../profile/constants";
import type {
  FactorBackedNegativeReasonId,
  NegativeReasonId,
  UserWorkRecord,
} from "../profile/types";
import {
  FACTOR_PENALTY_AMOUNTS,
  FACTOR_PENALTY_CAP,
  FACTOR_PENALTY_GROUPS,
  VAGUE_PENALTY_WEIGHT,
} from "./constants";
import {
  compareFloatingPoint,
  compareText,
  meetsFloatingPointThreshold,
  ownRecordValue,
} from "./math";
import { workSimilarity } from "./similarity";
import type { GroupContribution, WorkSimilarityResult } from "./types";

type AxisNegativeReasonId = Exclude<
  FactorBackedNegativeReasonId,
  "artStyleDislike" | "genericStory"
>;

export type CalculateNegativePenaltiesInput = {
  candidate: Work;
  bestAnchor: Work;
  negativeRecords: readonly UserWorkRecord[];
  worksById: Readonly<Record<string, Work>>;
};

export type NegativePenaltyResult = {
  factorPenalty: number;
  vaguePenalty: number;
  totalPenalty: number;
  contributions: GroupContribution[];
  penaltiesApplied: NegativeReasonId[];
};

type TriggeredFactorPenalty = {
  reasonId: FactorBackedNegativeReasonId;
  sourceWorkIds: string[];
  nominalAmount: number;
};

function knownAxisValue(work: Work, axisId: AxisId) {
  const factor = work.axes[axisId];
  return factor.state === "known" ? factor.value : undefined;
}

function atMost(value: ScaleValue | undefined, threshold: ScaleValue) {
  return value !== undefined && value <= threshold;
}

function atLeast(value: ScaleValue | undefined, threshold: ScaleValue) {
  return value !== undefined && value >= threshold;
}

function matchesAxisReason(candidate: Work, reasonId: AxisNegativeReasonId) {
  const value = (axisId: AxisId) => knownAxisValue(candidate, axisId);

  switch (reasonId) {
    case "tooSlow":
      return atMost(value("pacing"), 1);
    case "tooRepetitiveProgression":
      return value("progression") === 4 && atMost(value("problemSolving"), 1);
    case "tooDark":
      return atLeast(value("darkness"), 3);
    case "tooStressful":
      return atLeast(value("mentalStress"), 3);
    case "tooMuchRomance":
      return atLeast(value("romance"), 3);
    case "tooMuchComedy":
      return atLeast(value("comedy"), 3);
    case "notEnoughSeriousness":
      return atMost(value("darkness"), 1) && atMost(value("mentalStress"), 1);
    case "tooComplex":
      return value("worldBuilding") === 4 || value("relationshipStructure") === 4;
    case "powerInflation":
      return value("progression") === 4;
  }
}

function normalizedReasons(record: UserWorkRecord) {
  return new Set<NegativeReasonId>([
    ...(record.negativeReasons ?? []),
    ...(record.droppedReasons ?? []),
  ]);
}

function collectReasonSources(negativeRecords: readonly UserWorkRecord[]) {
  const factorSources = new Map<FactorBackedNegativeReasonId, Set<string>>();
  const vagueSources = new Set<string>();

  for (const record of negativeRecords) {
    const reasons = normalizedReasons(record);

    for (const reasonId of FACTOR_BACKED_NEGATIVE_REASON_IDS) {
      if (!reasons.has(reasonId)) {
        continue;
      }
      const sourceIds = factorSources.get(reasonId) ?? new Set<string>();
      sourceIds.add(record.workId);
      factorSources.set(reasonId, sourceIds);
    }

    if (reasons.size === 1 && reasons.has("vagueDislike")) {
      vagueSources.add(record.workId);
    }
  }

  return { factorSources, vagueSources };
}

function sortedSourceIds(sourceIds: ReadonlySet<string> | undefined) {
  return [...(sourceIds ?? [])].sort(compareText);
}

function createSimilarityReader(left: Work) {
  const cache = new Map<string, WorkSimilarityResult>();
  return (right: Work) => {
    const cached = cache.get(right.id);
    if (cached !== undefined) {
      return cached;
    }
    const similarity = workSimilarity(left, right);
    cache.set(right.id, similarity);
    return similarity;
  };
}

function triggeringSourceIds(options: {
  reasonId: FactorBackedNegativeReasonId;
  sourceWorkIds: readonly string[];
  candidate: Work;
  worksById: Readonly<Record<string, Work>>;
  candidateSimilarityTo: (source: Work) => WorkSimilarityResult;
  anchorSimilarityTo: (source: Work) => WorkSimilarityResult;
}) {
  const {
    anchorSimilarityTo,
    candidate,
    candidateSimilarityTo,
    reasonId,
    sourceWorkIds,
    worksById,
  } = options;

  if (reasonId === "artStyleDislike") {
    return sourceWorkIds.filter((workId) => {
      const source = ownRecordValue(worksById, workId);
      return (
        source !== undefined &&
        meetsFloatingPointThreshold(candidateSimilarityTo(source).groups.art.adjustedScore, 0.75)
      );
    });
  }

  if (reasonId === "genericStory") {
    return sourceWorkIds.filter((workId) => {
      const source = ownRecordValue(worksById, workId);
      return (
        source !== undefined &&
        meetsFloatingPointThreshold(
          candidateSimilarityTo(source).groups.theme.adjustedScore,
          0.7,
        ) &&
        meetsFloatingPointThreshold(anchorSimilarityTo(source).groups.theme.adjustedScore, 0.7)
      );
    });
  }

  return matchesAxisReason(candidate, reasonId) ? [...sourceWorkIds] : [];
}

function calculateVaguePenalty(options: {
  candidateSimilarityTo: (source: Work) => WorkSimilarityResult;
  sourceWorkIds: readonly string[];
  worksById: Readonly<Record<string, Work>>;
}) {
  const { candidateSimilarityTo, sourceWorkIds, worksById } = options;
  const matches: { sourceWorkId: string; score: number }[] = [];

  for (const sourceWorkId of sourceWorkIds) {
    const source = ownRecordValue(worksById, sourceWorkId);
    if (source === undefined) {
      continue;
    }
    matches.push({ sourceWorkId, score: candidateSimilarityTo(source).score });
  }

  const byScore = matches.sort(
    (left, right) => right.score - left.score || compareText(left.sourceWorkId, right.sourceWorkId),
  );
  const leader = byScore[0];
  const best =
    leader === undefined
      ? undefined
      : byScore
          .filter((candidate) => compareFloatingPoint(leader.score, candidate.score) === 0)
          .sort((left, right) => compareText(left.sourceWorkId, right.sourceWorkId))[0];

  if (best === undefined || best.score <= 0) {
    return { amount: 0, sourceWorkId: undefined };
  }

  return {
    amount: best.score * VAGUE_PENALTY_WEIGHT,
    sourceWorkId: best.sourceWorkId,
  };
}

export function calculateNegativePenalties({
  bestAnchor,
  candidate,
  negativeRecords,
  worksById,
}: CalculateNegativePenaltiesInput): NegativePenaltyResult {
  const { factorSources, vagueSources } = collectReasonSources(negativeRecords);
  const candidateSimilarityTo = createSimilarityReader(candidate);
  const anchorSimilarityTo = createSimilarityReader(bestAnchor);

  const triggeredFactorPenalties =
    FACTOR_BACKED_NEGATIVE_REASON_IDS.flatMap<TriggeredFactorPenalty>((reasonId) => {
      const sourceWorkIds = triggeringSourceIds({
        reasonId,
        sourceWorkIds: sortedSourceIds(factorSources.get(reasonId)),
        candidate,
        worksById,
        candidateSimilarityTo,
        anchorSimilarityTo,
      });
      return sourceWorkIds.length === 0
        ? []
        : [
            {
              reasonId,
              sourceWorkIds,
              nominalAmount: FACTOR_PENALTY_AMOUNTS[reasonId],
            },
          ];
    });

  const rawFactorPenalty = triggeredFactorPenalties.reduce(
    (sum, penalty) => sum + penalty.nominalAmount,
    0,
  );
  const factorPenalty = Math.min(FACTOR_PENALTY_CAP, rawFactorPenalty);
  const factorScale = rawFactorPenalty === 0 ? 0 : factorPenalty / rawFactorPenalty;
  const factorContributions = triggeredFactorPenalties.map<GroupContribution>((penalty) => ({
    source: "penalty",
    group: FACTOR_PENALTY_GROUPS[penalty.reasonId],
    factorId: penalty.reasonId,
    value: -penalty.nominalAmount * factorScale,
    anchorWorkIds: penalty.sourceWorkIds,
    negativeReasonId: penalty.reasonId,
    explainable: true,
  }));

  const vague = calculateVaguePenalty({
    candidateSimilarityTo,
    sourceWorkIds: sortedSourceIds(vagueSources),
    worksById,
  });
  const vagueContribution: GroupContribution[] =
    vague.sourceWorkId === undefined || vague.amount === 0
      ? []
      : [
          {
            source: "penalty",
            group: "overall",
            factorId: "vagueDislike",
            value: -vague.amount,
            anchorWorkIds: [vague.sourceWorkId],
            negativeReasonId: "vagueDislike",
            explainable: false,
          },
        ];

  const penaltiesApplied: NegativeReasonId[] = triggeredFactorPenalties.map(
    (penalty) => penalty.reasonId,
  );
  if (vague.amount > 0) {
    penaltiesApplied.push("vagueDislike");
  }

  return {
    factorPenalty,
    vaguePenalty: vague.amount,
    totalPenalty: factorPenalty + vague.amount,
    contributions: [...factorContributions, ...vagueContribution],
    penaltiesApplied,
  };
}
