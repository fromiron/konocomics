import type { Work } from "../catalog/types";
import { REACTION_WEIGHTS } from "../profile/constants";
import type { Reaction } from "../profile/types";
import { CONSENSUS_BONUS_CAP, CONSENSUS_CLUSTER_THRESHOLD } from "./constants";
import { clamp, compareFloatingPoint, compareText, meetsFloatingPointThreshold } from "./math";
import { workSimilarity } from "./similarity";
import type { WorkSimilarityResult } from "./types";

export type PositiveReaction = Extract<Reaction, "favorite" | "liked">;

export type PositiveAnchorInput = {
  work: Work;
  reaction: PositiveReaction;
};

export type SupporterMatch = {
  match: number;
  workId: string;
};

export type PositiveAnchorScoreResult = {
  appliedConsensusBonus: number;
  bestAnchorId: string;
  bestAnchorReactionWeight: number;
  bestAnchorSimilarity: WorkSimilarityResult;
  bestMatch: number;
  consensusBonus: number;
  positiveAnchorScore: number;
  support: number;
  supporterMatches: SupporterMatch[];
};

type CandidateAnchorMatch = {
  anchor: PositiveAnchorInput;
  match: number;
  reactionWeight: number;
  similarity: WorkSimilarityResult;
};

function normalizedAnchors(anchors: readonly PositiveAnchorInput[]) {
  const sorted = [...anchors].sort((left, right) => {
    const idOrder = compareText(left.work.id, right.work.id);
    if (idOrder !== 0) {
      return idOrder;
    }
    return REACTION_WEIGHTS[right.reaction] - REACTION_WEIGHTS[left.reaction];
  });
  const byWorkId = new Map<string, PositiveAnchorInput>();
  for (const anchor of sorted) {
    if (!byWorkId.has(anchor.work.id)) {
      byWorkId.set(anchor.work.id, anchor);
    }
  }
  return [...byWorkId.values()];
}

function sortMatchCohorts<Value>(
  values: readonly Value[],
  matchFor: (value: Value) => number,
  workIdFor: (value: Value) => string,
) {
  const byMatch = [...values].sort((left, right) => {
    const matchDifference = matchFor(right) - matchFor(left);
    return matchDifference === 0 ? compareText(workIdFor(left), workIdFor(right)) : matchDifference;
  });
  const sorted: Value[] = [];

  for (let index = 0; index < byMatch.length;) {
    const leader = byMatch[index];
    if (leader === undefined) {
      break;
    }
    let end = index + 1;
    while (end < byMatch.length) {
      const candidate = byMatch[end];
      if (
        candidate === undefined ||
        compareFloatingPoint(matchFor(leader), matchFor(candidate)) !== 0
      ) {
        break;
      }
      end += 1;
    }
    sorted.push(
      ...byMatch
        .slice(index, end)
        .sort((left, right) => compareText(workIdFor(left), workIdFor(right))),
    );
    index = end;
  }

  return sorted;
}

export function calculatePositiveAnchorScore(
  candidate: Work,
  anchors: readonly PositiveAnchorInput[],
): PositiveAnchorScoreResult | null {
  const positiveAnchors = normalizedAnchors(anchors);
  if (positiveAnchors.length === 0) {
    return null;
  }

  const candidateMatches = sortMatchCohorts(
    positiveAnchors.map<CandidateAnchorMatch>((anchor) => {
      const similarity = workSimilarity(candidate, anchor.work);
      const reactionWeight = REACTION_WEIGHTS[anchor.reaction];
      return {
        anchor,
        match: similarity.score * reactionWeight,
        reactionWeight,
        similarity,
      };
    }),
    (candidateMatch) => candidateMatch.match,
    (candidateMatch) => candidateMatch.anchor.work.id,
  );
  const best = candidateMatches[0];
  if (best === undefined) {
    return null;
  }

  const supporterMatches = sortMatchCohorts(
    candidateMatches
      .filter(
        (candidateMatch) =>
          candidateMatch.anchor.work.id !== best.anchor.work.id &&
          meetsFloatingPointThreshold(
            workSimilarity(best.anchor.work, candidateMatch.anchor.work).score,
            CONSENSUS_CLUSTER_THRESHOLD,
          ),
      )
      .map<SupporterMatch>((candidateMatch) => ({
        match: candidateMatch.match,
        workId: candidateMatch.anchor.work.id,
      })),
    (supporter) => supporter.match,
    (supporter) => supporter.workId,
  ).slice(0, 2);
  const support =
    supporterMatches.length === 0
      ? 0.5
      : supporterMatches.reduce((sum, supporter) => sum + supporter.match, 0) /
        supporterMatches.length;
  const consensusBonus = Math.min(CONSENSUS_BONUS_CAP, Math.max(0, support - 0.5) * 0.1);
  const positiveAnchorScore = clamp(best.match + consensusBonus, 0, 1);

  return {
    appliedConsensusBonus: positiveAnchorScore - best.match,
    bestAnchorId: best.anchor.work.id,
    bestAnchorReactionWeight: best.reactionWeight,
    bestAnchorSimilarity: best.similarity,
    bestMatch: best.match,
    consensusBonus,
    positiveAnchorScore,
    support,
    supporterMatches,
  };
}
