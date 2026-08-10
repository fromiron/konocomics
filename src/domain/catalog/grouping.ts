import { normalizeCreator, normalizeTitle } from "./normalize";

export type GroupingSignals = {
  seriesNameMatch: number;
  normalizedTitleMatch: number;
  authorMatch: number;
  publisherMatch: number;
  volumeSequenceMatch: number;
};

export type GroupingDecision = "automaticCandidate" | "manualReview" | "separateWork";

export type GroupingCandidateMetadata = {
  title: string;
  seriesName?: string;
  creators: readonly string[];
  publisher?: string;
  volumeNumber?: number;
};

function exactOptionalMatch(
  left: string | undefined,
  right: string | undefined,
  normalize: (value: string) => string,
) {
  return left !== undefined && right !== undefined && normalize(left) === normalize(right) ? 1 : 0;
}

export function deriveGroupingSignals(
  left: GroupingCandidateMetadata,
  right: GroupingCandidateMetadata,
): GroupingSignals {
  const leftCreators = new Set(left.creators.map(normalizeCreator));
  const authorMatch = right.creators.some((creator) => leftCreators.has(normalizeCreator(creator)));
  const volumeSequenceMatch =
    left.volumeNumber !== undefined &&
    right.volumeNumber !== undefined &&
    Math.abs(left.volumeNumber - right.volumeNumber) === 1;

  return {
    seriesNameMatch: exactOptionalMatch(
      left.seriesName,
      right.seriesName,
      (value) => normalizeTitle(value).kanaFolded,
    ),
    normalizedTitleMatch:
      normalizeTitle(left.title).kanaFolded === normalizeTitle(right.title).kanaFolded ? 1 : 0,
    authorMatch: authorMatch ? 1 : 0,
    publisherMatch: exactOptionalMatch(left.publisher, right.publisher, normalizeCreator),
    volumeSequenceMatch: volumeSequenceMatch ? 1 : 0,
  };
}

export function calculateGroupingScore(signals: GroupingSignals) {
  return (
    signals.seriesNameMatch * 0.4 +
    signals.normalizedTitleMatch * 0.25 +
    signals.authorMatch * 0.15 +
    signals.publisherMatch * 0.1 +
    signals.volumeSequenceMatch * 0.1
  );
}

export function classifyGroupingScore(score: number): GroupingDecision {
  if (score >= 0.9) {
    return "automaticCandidate";
  }
  if (score >= 0.7) {
    return "manualReview";
  }
  return "separateWork";
}

export function evaluateGroupingCandidate(
  left: GroupingCandidateMetadata,
  right: GroupingCandidateMetadata,
) {
  const signals = deriveGroupingSignals(left, right);
  const score = calculateGroupingScore(signals);
  return { signals, score, decision: classifyGroupingScore(score) };
}
