import type { ScaleValue, Work } from "../catalog/types";
import { compareText } from "./math";
import { calculateAxisValueSimilarity } from "./similarity";

export const CONTRAST_AXIS_IDS = [
  "pacing",
  "comedy",
  "darkness",
  "mentalStress",
  "romance",
] as const;

export type ContrastAxisId = (typeof CONTRAST_AXIS_IDS)[number];

/** Observed work-to-work differences, independent of personalized score contributions. */
export type ContrastContribution = Readonly<{
  axisId: ContrastAxisId;
  sourceValue: ScaleValue;
  targetValue: ScaleValue;
  direction: "higher" | "lower";
  distance: number;
}>;

export type ContrastingWork = Readonly<{
  work: Work;
  observedCount: number;
  distance: number;
  contributions: readonly ContrastContribution[];
}>;

type AxisObservation = Omit<ContrastContribution, "direction">;

// Starting policy values from 02 §6.12; sparse results never relax these thresholds.
const MIN_OBSERVED_AXES = 3;
const MIN_CONTRAST_AXES = 2;
const MIN_RAW_DIFFERENCE = 2;
const MAX_CONTRASTING_WORKS = 6;

export function selectContrastingWorks({
  source,
  candidates,
  excludedWorkIds = [],
}: Readonly<{
  source: Work;
  candidates: readonly Work[];
  excludedWorkIds?: readonly string[];
}>): readonly ContrastingWork[] {
  if (!source.eligibility.recommendationEligible) return [];
  const excluded = new Set([source.id, ...excludedWorkIds]);

  return candidates
    .flatMap<ContrastingWork>((work) => {
      if (!work.eligibility.recommendationEligible || excluded.has(work.id)) return [];
      const observations = CONTRAST_AXIS_IDS.flatMap<AxisObservation>((axisId) => {
        const sourceFactor = source.axes[axisId];
        const targetFactor = work.axes[axisId];
        if (sourceFactor.state !== "known" || targetFactor.state !== "known") return [];
        return [
          {
            axisId,
            sourceValue: sourceFactor.value,
            targetValue: targetFactor.value,
            distance:
              1 - calculateAxisValueSimilarity(axisId, sourceFactor.value, targetFactor.value),
          },
        ];
      });
      if (observations.length < MIN_OBSERVED_AXES) return [];

      const contributions = observations
        .filter(
          ({ sourceValue, targetValue }) =>
            Math.abs(sourceValue - targetValue) >= MIN_RAW_DIFFERENCE,
        )
        .map<ContrastContribution>((observation) => ({
          ...observation,
          direction: observation.targetValue > observation.sourceValue ? "higher" : "lower",
        }))
        .sort(
          (left, right) =>
            right.distance - left.distance ||
            Math.abs(right.targetValue - right.sourceValue) -
              Math.abs(left.targetValue - left.sourceValue) ||
            CONTRAST_AXIS_IDS.indexOf(left.axisId) - CONTRAST_AXIS_IDS.indexOf(right.axisId),
        );
      if (contributions.length < MIN_CONTRAST_AXES) return [];

      return [
        {
          work,
          observedCount: observations.length,
          distance:
            observations.reduce((total, observation) => total + observation.distance, 0) /
            observations.length,
          contributions,
        },
      ];
    })
    .sort(
      (left, right) =>
        right.distance - left.distance ||
        right.observedCount - left.observedCount ||
        compareText(left.work.id, right.work.id),
    )
    .slice(0, MAX_CONTRASTING_WORKS);
}
