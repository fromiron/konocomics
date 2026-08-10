import { describe, expect, it } from "vitest";

import { ART_AXIS_IDS, AXIS_IDS, NARRATIVE_AXIS_IDS } from "@/domain/catalog/constants";
import type { ScaleValue } from "@/domain/catalog/types";
import {
  calculateAxisGroupSimilarity,
  calculateAxisValueSimilarity,
  calculateGenreGroupSimilarity,
  calculateThemeGroupSimilarity,
  workSimilarity,
} from "@/domain/recommendation/similarity";
import { createTestAxes, createTestWork } from "../../helpers/catalog";

function uniformAxes(value: ScaleValue, confidence = 1) {
  const axes = createTestAxes();
  for (const axisId of AXIS_IDS) {
    axes[axisId] = { state: "known", value, confidence };
  }
  return axes;
}

describe("recommendation similarity", () => {
  it("uses linear distance except for the three presence-sensitive axes", () => {
    expect(calculateAxisValueSimilarity("pacing", 0, 1)).toBe(0.75);
    for (const axisId of ["darkness", "mentalStress", "romance"] as const) {
      expect(calculateAxisValueSimilarity(axisId, 0, 1)).toBe(0.625);
    }
  });

  it("weights observed axis scores by the lower pair confidence", () => {
    const left = createTestWork({
      axes: createTestAxes({
        progression: { state: "known", value: 0, confidence: 1 },
        problemSolving: { state: "known", value: 4, confidence: 0.5 },
        strategy: { state: "unknown" },
        pacing: { state: "unknown" },
        mysteryReveal: { state: "unknown" },
        worldBuilding: { state: "unknown" },
      }),
    });
    const right = createTestWork({
      axes: createTestAxes({
        progression: { state: "known", value: 4, confidence: 1 },
        problemSolving: { state: "known", value: 4, confidence: 1 },
        strategy: { state: "unknown" },
        pacing: { state: "unknown" },
        mysteryReveal: { state: "unknown" },
        worldBuilding: { state: "unknown" },
      }),
    });

    const result = calculateAxisGroupSimilarity(left, right, "narrative");
    expect(result.rawScore).toBeCloseTo(1 / 3);
    expect(result.coverage).toBeCloseTo(1 / 3);
    expect(result.coverageScale).toBeCloseTo(5 / 9);
  });

  it("keeps known zero-confidence pairs observed but gives them a neutral raw score", () => {
    const leftAxes = createTestAxes();
    const rightAxes = createTestAxes();
    for (const axisId of NARRATIVE_AXIS_IDS) {
      leftAxes[axisId] = { state: "known", value: 0, confidence: 0 };
      rightAxes[axisId] = { state: "known", value: 4, confidence: 0 };
    }

    const result = calculateAxisGroupSimilarity(
      createTestWork({ axes: leftAxes }),
      createTestWork({ axes: rightAxes }),
      "narrative",
    );
    expect(result.coverage).toBe(1);
    expect(result.rawScore).toBe(0.5);
    expect(result.adjustedScore).toBe(0.5);
    expect(result.contributions).toEqual([]);
  });

  it("emits one signed contribution per Genre union tag", () => {
    const left = createTestWork({ genres: ["fantasy", "action"] });
    const right = createTestWork({ genres: ["mystery", "action"] });

    const result = calculateGenreGroupSimilarity(left, right);
    expect(result.rawScore).toBeCloseTo(1 / 3);
    expect(result.contributions).toEqual([
      { group: "genre", factorId: "action", value: 0.024999999999999998 },
      { group: "genre", factorId: "fantasy", value: -0.024999999999999998 },
      { group: "genre", factorId: "mystery", value: -0.024999999999999998 },
    ]);
    expect(
      result.contributions.reduce((sum, contribution) => sum + contribution.value, 0),
    ).toBeCloseTo(0.15 * (result.adjustedScore - 0.5));
  });

  it("uses Theme centrality but not Theme confidence in weighted Jaccard", () => {
    const left = createTestWork({
      themes: [
        { id: "combat", centrality: 1, confidence: 0.01 },
        { id: "adventure", centrality: 2, confidence: 0.01 },
      ],
    });
    const right = createTestWork({
      themes: [
        { id: "cooking", centrality: 2, confidence: 1 },
        { id: "adventure", centrality: 1, confidence: 1 },
      ],
    });

    const result = calculateThemeGroupSimilarity(left, right);
    expect(result.rawScore).toBe(0.2);
    expect(result.contributions).toEqual([
      { group: "theme", factorId: "combat", value: -0.025 },
      { group: "theme", factorId: "cooking", value: -0.05 },
    ]);

    const reordered = calculateThemeGroupSimilarity(
      createTestWork({ themes: [...left.themes].reverse() }),
      createTestWork({ themes: [...right.themes].reverse() }),
    );
    expect(reordered).toEqual(result);
  });

  it("uses neutral score and no contributions for a zero tag union", () => {
    const result = calculateThemeGroupSimilarity(
      createTestWork({ themes: [] }),
      createTestWork({ themes: [] }),
    );
    expect(result).toEqual({
      group: "theme",
      rawScore: 0.5,
      coverage: 0,
      coverageScale: 0,
      adjustedScore: 0.5,
      contributions: [],
    });
  });

  it("fully shrinks a one-sided tag annotation instead of treating absence as dislike", () => {
    const result = calculateGenreGroupSimilarity(
      createTestWork({ genres: [] }),
      createTestWork({ genres: ["action"] }),
    );
    expect(result.rawScore).toBe(0);
    expect(result.coverage).toBe(0);
    expect(result.adjustedScore).toBe(0.5);
    expect(result.contributions).toEqual([]);
  });

  it("shrinks only the low-coverage group without redistributing its weight", () => {
    const anchor = createTestWork({ id: "anchor" });
    const complete = createTestWork({ id: "complete" });
    const artUnknown = createTestAxes();
    for (const axisId of ART_AXIS_IDS) {
      artUnknown[axisId] = { state: "unknown" };
    }
    const candidate = createTestWork({ id: "candidate", axes: artUnknown });

    expect(workSimilarity(anchor, complete).score).toBe(1);
    const result = workSimilarity(anchor, candidate);
    expect(result.score).toBeCloseTo(0.925);
    expect(result.groups.genre.adjustedScore).toBe(1);
    expect(result.groups.genre.contributions).toEqual([
      { group: "genre", factorId: "fantasy", value: 0.075 },
    ]);
    expect(result.groups.art).toEqual({
      group: "art",
      rawScore: 0.5,
      coverage: 0,
      coverageScale: 0,
      adjustedScore: 0.5,
      contributions: [],
    });
  });

  it("excludes notApplicable from the expected Art denominator", () => {
    const leftAxes = createTestAxes({ motionImpact: { state: "notApplicable" } });
    const rightAxes = createTestAxes({ motionImpact: { state: "notApplicable" } });
    const result = calculateAxisGroupSimilarity(
      createTestWork({ axes: leftAxes }),
      createTestWork({ axes: rightAxes }),
      "art",
    );

    expect(result.coverage).toBe(1);
    expect(result.rawScore).toBe(1);
    expect(result.adjustedScore).toBe(1);
  });

  it("preserves the signed contribution decomposition invariant", () => {
    const left = createTestWork({
      id: "left",
      genres: ["fantasy", "action"],
      axes: uniformAxes(0),
    });
    const right = createTestWork({
      id: "right",
      genres: ["fantasy", "mystery"],
      axes: uniformAxes(4),
    });
    const result = workSimilarity(left, right);
    const contributionSum = result.contributions.reduce(
      (sum, contribution) => sum + contribution.value,
      0,
    );

    expect(result.score).toBeCloseTo(0.5 + contributionSum);
  });
});
