import { describe, expect, it } from "vitest";

import {
  adjustScoreForCoverage,
  calculateAxisPairCoverage,
  calculateCoverageScale,
  calculateTagPairCoverage,
} from "@/domain/recommendation/coverage";
import { createTestAxes } from "../../helpers/catalog";

describe("recommendation pair coverage", () => {
  it("counts unknown in the expected denominator and excludes either-side notApplicable", () => {
    const left = createTestAxes({
      motionImpact: { state: "notApplicable" },
    });
    const right = createTestAxes({
      progression: { state: "unknown" },
    });

    expect(
      calculateAxisPairCoverage(left, right, ["progression", "problemSolving", "motionImpact"]),
    ).toEqual({
      coverage: 0.5,
      expectedCount: 2,
      observedCount: 1,
    });

    expect(
      calculateAxisPairCoverage(right, left, ["progression", "problemSolving", "motionImpact"]),
    ).toEqual({
      coverage: 0.5,
      expectedCount: 2,
      observedCount: 1,
    });
  });

  it("returns neutral zero coverage when every requested axis is notApplicable", () => {
    const left = createTestAxes({ motionImpact: { state: "notApplicable" } });
    const right = createTestAxes({ motionImpact: { state: "notApplicable" } });

    expect(calculateAxisPairCoverage(left, right, ["motionImpact"])).toEqual({
      coverage: 0,
      expectedCount: 0,
      observedCount: 0,
    });
  });

  it("requires annotations on both sides for tag coverage", () => {
    expect(calculateTagPairCoverage([], ["fantasy"])).toBe(0);
    expect(calculateTagPairCoverage(["fantasy"], [])).toBe(0);
    expect(calculateTagPairCoverage([], [])).toBe(0);
    expect(calculateTagPairCoverage(["fantasy"], ["action"])).toBe(1);
  });

  it("scales only against the selected group threshold and caps the scale at one", () => {
    expect(calculateCoverageScale("narrative", 0.3)).toBe(0.5);
    expect(adjustScoreForCoverage("narrative", 1, 0.3)).toEqual({
      adjustedScore: 0.75,
      coverageScale: 0.5,
    });
    expect(adjustScoreForCoverage("art", 1, 0.3)).toEqual({
      adjustedScore: 1,
      coverageScale: 1,
    });
    expect(calculateCoverageScale("genre", 1)).toBe(1);
  });
});
