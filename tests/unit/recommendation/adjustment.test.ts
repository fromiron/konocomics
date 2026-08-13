import { describe, expect, it } from "vitest";

import {
  calculateAxisAdjustment,
  calculateExplicitAdjustment,
  getHardExclusionReasons,
  isHardExcluded,
} from "@/domain/recommendation/adjustment";
import { createTestAxes, createTestWork } from "../../helpers/catalog";
import { createTestAdjustments } from "../../helpers/recommendation";

describe("hard exclusions", () => {
  it("excludes incomplete works and only matching high Axis or central Theme values", () => {
    const base = createTestWork({
      axes: createTestAxes({
        progression: { state: "known", value: 3, confidence: 1 },
        strategy: { state: "known", value: 2, confidence: 1 },
        motionImpact: { state: "unknown" },
      }),
      themes: [
        { id: "adventure", centrality: 2, confidence: 1 },
        { id: "combat", centrality: 1, confidence: 1 },
      ],
    });
    const work = { ...base, status: "ongoing" as const };
    const adjustments = createTestAdjustments({
      axes: { progression: "exclude", strategy: "exclude", motionImpact: "exclude" },
      themes: { adventure: "exclude", combat: "exclude", cooking: "exclude" },
    });

    expect(getHardExclusionReasons(work, adjustments, true)).toEqual([
      { kind: "incomplete" },
      { kind: "axis", factorId: "progression" },
      { kind: "theme", factorId: "adventure" },
    ]);
    expect(isHardExcluded(work, adjustments, true)).toBe(true);
    expect(
      isHardExcluded(
        { ...work, status: "completed" },
        createTestAdjustments({ axes: { strategy: "exclude" }, themes: { combat: "exclude" } }),
        false,
      ),
    ).toBe(false);
  });
});

describe("explicit adjustment", () => {
  it.each([
    [4, 0.06],
    [3, 0.03],
    [2, 0],
    [1, -0.03],
    [0, -0.06],
  ] as const)("maps Axis value %s to %s for strength +0.06", (value, expected) => {
    expect(calculateAxisAdjustment(value, 0.06)).toBe(expected);
  });

  it("returns raw entries, a clamp correction, and Theme soft exclusion separately", () => {
    const work = createTestWork({
      axes: createTestAxes({
        progression: { state: "known", value: 4, confidence: 1 },
        strategy: { state: "known", value: 0, confidence: 1 },
        pacing: { state: "known", value: 4, confidence: 1 },
        worldBuilding: { state: "known", value: 4, confidence: 1 },
        mysteryReveal: { state: "unknown" },
        motionImpact: { state: "notApplicable" },
      }),
      themes: [
        { id: "adventure", centrality: 2, confidence: 1 },
        { id: "combat", centrality: 1, confidence: 1 },
        { id: "school", centrality: 1, confidence: 1 },
      ],
    });
    const adjustments = createTestAdjustments({
      axes: {
        progression: "veryLike",
        strategy: "veryLike",
        pacing: "like",
        worldBuilding: "veryLike",
        mysteryReveal: "veryLike",
        motionImpact: "veryLike",
      },
      themes: {
        adventure: "veryLike",
        combat: "like",
        school: "exclude",
        cooking: "veryLike",
      },
    });

    const result = calculateExplicitAdjustment(work, adjustments);

    expect(result.rawAdjustment).toBe(0.165);
    expect(result.explicitAdjustment).toBe(0.12);
    expect(result.clampCorrection).toBe(-0.045);
    expect(result.softExclusionPenalty).toBe(-0.1);
    expect(result.totalAdjustment).toBe(0.02);
    expect(result.rawEntries.map(({ factorId, value }) => [factorId, value])).toEqual([
      ["progression", 0.06],
      ["strategy", -0.06],
      ["pacing", 0.03],
      ["worldBuilding", 0.06],
      ["adventure", 0.06],
      ["combat", 0.015],
    ]);
    expect(
      result.rawEntries.map(({ axisPreferenceDirection, factorId }) => [
        factorId,
        axisPreferenceDirection,
      ]),
    ).toEqual([
      ["progression", "higher"],
      ["strategy", "higher"],
      ["pacing", "higher"],
      ["worldBuilding", "higher"],
      ["adventure", undefined],
      ["combat", undefined],
    ]);
    expect(result.clampEntry).toMatchObject({
      source: "clamp",
      group: "overall",
      factorId: "adjustmentClamp",
      value: -0.045,
      explainable: false,
    });
    expect(result.softExclusionEntries).toEqual([
      {
        source: "penalty",
        group: "theme",
        factorId: "school",
        value: -0.1,
        anchorWorkIds: [],
        explainable: true,
      },
    ]);
  });

  it("records the lower preference direction for positive low-Axis adjustments", () => {
    const work = createTestWork({
      axes: createTestAxes({
        comedy: { state: "known", value: 0, confidence: 1 },
        darkness: { state: "known", value: 1, confidence: 1 },
      }),
    });
    const result = calculateExplicitAdjustment(
      work,
      createTestAdjustments({ axes: { comedy: "less", darkness: "less" } }),
    );

    expect(result.rawEntries).toEqual([
      {
        source: "adjustment",
        group: "tone",
        factorId: "comedy",
        value: 0.06,
        anchorWorkIds: [],
        axisPreferenceDirection: "lower",
        explainable: true,
      },
      {
        source: "adjustment",
        group: "tone",
        factorId: "darkness",
        value: 0.03,
        anchorWorkIds: [],
        axisPreferenceDirection: "lower",
        explainable: true,
      },
    ]);
  });

  it("does not cap multiple Theme soft exclusions or penalize low excluded Axes", () => {
    const work = createTestWork({
      axes: createTestAxes({ strategy: { state: "known", value: 2, confidence: 1 } }),
      themes: [
        { id: "combat", centrality: 1, confidence: 1 },
        { id: "school", centrality: 1, confidence: 1 },
      ],
    });
    const result = calculateExplicitAdjustment(
      work,
      createTestAdjustments({
        axes: { strategy: "exclude" },
        themes: { combat: "exclude", school: "exclude" },
      }),
    );

    expect(result.rawAdjustment).toBe(0);
    expect(result.explicitAdjustment).toBe(0);
    expect(result.clampEntry).toBeUndefined();
    expect(result.softExclusionPenalty).toBe(-0.2);
    expect(result.totalAdjustment).toBe(-0.2);
  });

  it("clamps the summed raw Axis adjustment at the negative boundary", () => {
    const work = createTestWork({
      axes: createTestAxes({
        progression: { state: "known", value: 0, confidence: 1 },
        strategy: { state: "known", value: 0, confidence: 1 },
        pacing: { state: "known", value: 0, confidence: 1 },
      }),
    });
    const result = calculateExplicitAdjustment(
      work,
      createTestAdjustments({
        axes: { progression: "veryLike", strategy: "veryLike", pacing: "veryLike" },
      }),
    );

    expect(result.rawAdjustment).toBe(-0.18);
    expect(result.explicitAdjustment).toBe(-0.12);
    expect(result.clampCorrection).toBe(0.06);
    expect(result.totalAdjustment).toBe(-0.12);
  });
});
