import { describe, expect, it } from "vitest";

import {
  calculateAxisCorrelations,
  calculateAxisValueRanges,
  calculateWorkCoverage,
} from "@/domain/catalog/coverage";
import { createTestAxes, createTestCatalog, createTestWork } from "../../helpers/catalog";

describe("catalog coverage", () => {
  it("counts unknown in the denominator and excludes notApplicable", () => {
    const work = createTestWork({
      axes: createTestAxes({
        progression: { state: "unknown" },
        problemSolving: { state: "unknown" },
        strategy: { state: "unknown" },
        motionImpact: { state: "notApplicable" },
      }),
    });

    expect(calculateWorkCoverage(work)).toEqual({
      genre: 1,
      theme: 1,
      narrative: 0.5,
      tone: 1,
      art: 1,
    });
  });

  it("uses only recommendation works with pairwise known values for correlations", () => {
    const catalog = createTestCatalog();
    catalog.works = [
      createTestWork({
        id: "work-zero",
        axes: createTestAxes({
          progression: { state: "known", value: 0, confidence: 0.9 },
          strategy: { state: "known", value: 0, confidence: 0.9 },
        }),
      }),
      createTestWork({
        id: "work-two",
        axes: createTestAxes({
          progression: { state: "known", value: 2, confidence: 0.9 },
          strategy: { state: "known", value: 2, confidence: 0.9 },
        }),
      }),
      createTestWork({
        id: "work-four",
        axes: createTestAxes({
          progression: { state: "known", value: 4, confidence: 0.9 },
          strategy: { state: "known", value: 4, confidence: 0.9 },
        }),
      }),
      createTestWork({
        id: "work-unknown",
        axes: createTestAxes({ progression: { state: "unknown" } }),
      }),
      createTestWork({
        id: "library-only",
        axes: createTestAxes({
          progression: { state: "known", value: 4, confidence: 0.9 },
          strategy: { state: "known", value: 0, confidence: 0.9 },
        }),
        eligibility: {
          onboardingEligible: false,
          recommendationEligible: false,
          libraryOnly: true,
        },
      }),
    ];

    const result = calculateAxisCorrelations(catalog).find(
      (correlation) => correlation.left === "progression" && correlation.right === "strategy",
    );
    expect(result).toEqual({
      left: "progression",
      right: "strategy",
      sampleSize: 3,
      correlation: 1,
    });

    expect(
      calculateAxisValueRanges(catalog).find((range) => range.axisId === "progression"),
    ).toEqual({
      axisId: "progression",
      knownCount: 3,
      minimum: 0,
      maximum: 4,
      distinctValues: [0, 2, 4],
    });
  });
});
