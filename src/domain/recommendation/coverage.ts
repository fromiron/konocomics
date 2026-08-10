import { COVERAGE_THRESHOLDS } from "../catalog/constants";
import type { AxisId, CoverageGroup, WorkAxes } from "../catalog/types";

export type AxisPairCoverage = {
  coverage: number;
  expectedCount: number;
  observedCount: number;
};

export function calculateAxisPairCoverage(
  left: WorkAxes,
  right: WorkAxes,
  axisIds: readonly AxisId[],
): AxisPairCoverage {
  let expectedCount = 0;
  let observedCount = 0;

  for (const axisId of axisIds) {
    const leftFactor = left[axisId];
    const rightFactor = right[axisId];

    if (leftFactor.state === "notApplicable" || rightFactor.state === "notApplicable") {
      continue;
    }

    expectedCount += 1;
    if (leftFactor.state === "known" && rightFactor.state === "known") {
      observedCount += 1;
    }
  }

  return {
    coverage: expectedCount === 0 ? 0 : observedCount / expectedCount,
    expectedCount,
    observedCount,
  };
}

export function calculateTagPairCoverage(left: readonly unknown[], right: readonly unknown[]) {
  return left.length === 0 || right.length === 0 ? 0 : 1;
}

export function calculateCoverageScale(group: CoverageGroup, coverage: number) {
  return Math.min(1, coverage / COVERAGE_THRESHOLDS[group]);
}

export function adjustScoreForCoverage(group: CoverageGroup, rawScore: number, coverage: number) {
  const coverageScale = calculateCoverageScale(group, coverage);
  return {
    adjustedScore: 0.5 + (rawScore - 0.5) * coverageScale,
    coverageScale,
  };
}
