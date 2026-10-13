import { describe, expect, it } from "vitest";

import { AXIS_IDS } from "@/domain/catalog/constants";
import type { AxisFactor, AxisId, WorkAxes } from "@/domain/catalog/types";
import { workTasteOverlap } from "@/domain/profile/work-taste-overlap";

function axes(known: Partial<Record<AxisId, 0 | 2 | 4>>): WorkAxes {
  return Object.fromEntries(
    AXIS_IDS.map((axisId) => {
      const value = known[axisId];
      const factor: AxisFactor =
        value === undefined ? { state: "unknown" } : { state: "known", value, confidence: 0.9 };
      return [axisId, factor];
    }),
  ) as WorkAxes;
}

describe("workTasteOverlap", () => {
  it("compares only axes known on both sides and names the clear overlaps and difference", () => {
    const [first, second, third, fourth, unknownForTaste] = AXIS_IDS;
    const work = {
      axes: axes({ [first]: 4, [second]: 2, [third]: 0, [fourth]: 4, [unknownForTaste]: 4 }),
    };
    const taste = new Map<AxisId, number>([
      [first, 3.6],
      [second, 2.2],
      [third, 0.4],
      [fourth, 0.5],
    ]);

    const overlap = workTasteOverlap(work, taste);

    expect(overlap?.sharedAxisCount).toBe(4);
    // An absent trait (third) never counts as a named overlap, however close.
    expect(overlap?.closeAxes).toEqual([second, first]);
    expect(overlap?.apart).toEqual({ axisId: fourth, direction: "stronger" });
    expect(overlap?.level).toBe(3);
  });

  it("does not summarise fewer than three shared axes", () => {
    const [first, second] = AXIS_IDS;
    const overlap = workTasteOverlap(
      { axes: axes({ [first]: 4, [second]: 2 }) },
      new Map<AxisId, number>([
        [first, 4],
        [second, 2],
      ]),
    );

    expect(overlap).toBeNull();
  });
});
