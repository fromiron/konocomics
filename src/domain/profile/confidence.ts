import { isFactorBackedNegativeReason } from "./constants";
import type { UserWorkRecord } from "./types";
import { AXIS_IDS, THEME_TAGS } from "../catalog/constants";
import type { Work } from "../catalog/types";

export type ConfidenceLevel = "high" | "normal" | "low";

function canonicalSum(values: readonly number[]) {
  return [...values].sort((left, right) => left - right).reduce((total, value) => total + value, 0);
}

function isPositiveAnchor(record: UserWorkRecord) {
  return record.reaction === "favorite" || record.reaction === "liked";
}

function hasFactorBackedReason(record: UserWorkRecord) {
  return [...(record.negativeReasons ?? []), ...(record.droppedReasons ?? [])].some(
    isFactorBackedNegativeReason,
  );
}

export function countPositiveAnchors(records: readonly UserWorkRecord[]) {
  return new Set(records.filter(isPositiveAnchor).map((record) => record.workId)).size;
}

export function countReasonedNegativeWorks(records: readonly UserWorkRecord[]) {
  return new Set(records.filter(hasFactorBackedReason).map((record) => record.workId)).size;
}

export function calculateProfileConfidence(records: readonly UserWorkRecord[]) {
  const anchorConfidence = Math.min(countPositiveAnchors(records) / 8, 1) * 0.8;
  const negativeConfidence = Math.min(countReasonedNegativeWorks(records) / 2, 1) * 0.2;
  return canonicalSum([anchorConfidence, negativeConfidence]);
}

export function calculateAverageFactorConfidence(work: Work) {
  const confidences = AXIS_IDS.flatMap((axisId) => {
    const factor = work.axes[axisId];
    return factor.state === "known" ? [factor.confidence] : [];
  });

  confidences.push(
    ...THEME_TAGS.flatMap((themeId) => {
      const theme = work.themes.find((candidate) => candidate.id === themeId);
      return theme === undefined ? [] : [theme.confidence];
    }),
  );

  if (confidences.length === 0) {
    return 0;
  }

  return canonicalSum(confidences) / confidences.length;
}

export function calculateWorkConfidence(work: Work) {
  return canonicalSum([
    calculateAverageFactorConfidence(work) * 0.6,
    work.evidence.groupingConfidence * 0.2,
    work.evidence.sourceAgreement * 0.2,
  ]);
}

export function calculateRecommendationConfidence(
  profileConfidence: number,
  workConfidence: number,
) {
  return Math.sqrt(profileConfidence * workConfidence);
}

export function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.75) {
    return "high";
  }
  if (confidence >= 0.5) {
    return "normal";
  }
  return "low";
}
