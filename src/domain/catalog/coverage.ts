import { ART_AXIS_IDS, AXIS_IDS, NARRATIVE_AXIS_IDS, TONE_AXIS_IDS } from "./constants";
import type { AxisId, CatalogV1, Work, WorkCoverage } from "./types";

function axisCoverage(work: Work, axisIds: readonly AxisId[]) {
  let known = 0;
  let expected = 0;

  for (const axisId of axisIds) {
    const factor = work.axes[axisId];
    if (factor.state === "notApplicable") {
      continue;
    }
    expected += 1;
    if (factor.state === "known") {
      known += 1;
    }
  }

  return expected === 0 ? 0 : known / expected;
}

export function calculateWorkCoverage(work: Work): WorkCoverage {
  return {
    genre: work.genres.length > 0 ? 1 : 0,
    theme: work.themes.length > 0 ? 1 : 0,
    narrative: axisCoverage(work, NARRATIVE_AXIS_IDS),
    tone: axisCoverage(work, TONE_AXIS_IDS),
    art: axisCoverage(work, ART_AXIS_IDS),
  };
}

export function pearsonCorrelation(pairs: readonly (readonly [number, number])[]) {
  if (pairs.length < 2) {
    return null;
  }

  const xMean = pairs.reduce((sum, [x]) => sum + x, 0) / pairs.length;
  const yMean = pairs.reduce((sum, [, y]) => sum + y, 0) / pairs.length;
  let numerator = 0;
  let xSquares = 0;
  let ySquares = 0;

  for (const [x, y] of pairs) {
    const xDelta = x - xMean;
    const yDelta = y - yMean;
    numerator += xDelta * yDelta;
    xSquares += xDelta ** 2;
    ySquares += yDelta ** 2;
  }

  const denominator = Math.sqrt(xSquares * ySquares);
  return denominator === 0 ? null : numerator / denominator;
}

export type AxisCorrelation = {
  left: AxisId;
  right: AxisId;
  sampleSize: number;
  correlation: number | null;
};

export type AxisValueRange = {
  axisId: AxisId;
  knownCount: number;
  minimum: number | null;
  maximum: number | null;
  distinctValues: number[];
};

export function calculateAxisValueRanges(catalog: CatalogV1): AxisValueRange[] {
  const recommendationWorks = catalog.works.filter(
    (work) => work.eligibility.recommendationEligible,
  );
  return AXIS_IDS.map((axisId) => {
    const values = recommendationWorks.flatMap((work) => {
      const factor = work.axes[axisId];
      return factor.state === "known" ? [factor.value] : [];
    });
    const distinctValues = [...new Set(values)].sort((left, right) => left - right);
    return {
      axisId,
      knownCount: values.length,
      minimum: distinctValues[0] ?? null,
      maximum: distinctValues.at(-1) ?? null,
      distinctValues,
    };
  });
}

export function calculateAxisCorrelations(catalog: CatalogV1): AxisCorrelation[] {
  const correlations: AxisCorrelation[] = [];

  for (let leftIndex = 0; leftIndex < AXIS_IDS.length; leftIndex += 1) {
    const left = AXIS_IDS[leftIndex];
    if (left === undefined) {
      continue;
    }
    for (let rightIndex = leftIndex + 1; rightIndex < AXIS_IDS.length; rightIndex += 1) {
      const right = AXIS_IDS[rightIndex];
      if (right === undefined) {
        continue;
      }
      const pairs: [number, number][] = [];
      for (const work of catalog.works.filter(
        (candidate) => candidate.eligibility.recommendationEligible,
      )) {
        const leftFactor = work.axes[left];
        const rightFactor = work.axes[right];
        if (leftFactor.state === "known" && rightFactor.state === "known") {
          pairs.push([leftFactor.value, rightFactor.value]);
        }
      }
      correlations.push({
        left,
        right,
        sampleSize: pairs.length,
        correlation: pairs.length < 3 ? null : pearsonCorrelation(pairs),
      });
    }
  }

  return correlations;
}
