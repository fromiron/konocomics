import { AXIS_IDS } from "../catalog/constants";
import type { AxisId, Work } from "../catalog/types";

/** 0 = far apart … 4 = very close. A qualitative step, never shown as a number. */
export type OverlapLevel = 0 | 1 | 2 | 3 | 4;

export type WorkTasteOverlap = Readonly<{
  level: OverlapLevel;
  /** Axes known for both the work and the taste profile; the comparison's whole basis. */
  sharedAxisCount: number;
  /** Up to two traits the work clearly has and the taste profile sits close to. */
  closeAxes: readonly AxisId[];
  /** The single clearest difference, if any axis is at least one full step apart. */
  apart: Readonly<{ axisId: AxisId; direction: "stronger" | "weaker" }> | null;
}>;

/** Fewer shared axes than this say too little to summarise. */
export const MIN_SHARED_AXES = 3;

const SCALE = 4;

/**
 * How a work's confirmed axes sit against the user's Manga DNA axes, for the detail summary.
 * Only axes known on both sides count: an unknown axis is never read as zero. This is a view of
 * the same values the detail trait bars already show side by side; it is not the recommendation
 * score and adds no explanation of why the work was recommended.
 */
export function workTasteOverlap(
  work: Pick<Work, "axes">,
  taste: ReadonlyMap<AxisId, number>,
): WorkTasteOverlap | null {
  const pairs = AXIS_IDS.flatMap((axisId) => {
    const factor = work.axes[axisId];
    const tasteValue = taste.get(axisId);
    if (factor.state !== "known" || tasteValue === undefined) return [];
    const difference = factor.value - tasteValue;
    return [{ axisId, workValue: factor.value, difference }];
  });
  if (pairs.length < MIN_SHARED_AXES) return null;

  const closeness =
    pairs.reduce((total, pair) => total + (1 - Math.abs(pair.difference) / SCALE), 0) /
    pairs.length;
  const level: OverlapLevel =
    closeness >= 0.85 ? 4 : closeness >= 0.7 ? 3 : closeness >= 0.55 ? 2 : closeness >= 0.4 ? 1 : 0;

  const byId = (left: AxisId, right: AxisId) => (left < right ? -1 : left > right ? 1 : 0);
  // A shared trait is one the work actually has; two absent traits are not an overlap to name.
  const closeAxes = pairs
    .filter((pair) => pair.workValue >= 2 && Math.abs(pair.difference) <= 1)
    .sort(
      (left, right) =>
        Math.abs(left.difference) - Math.abs(right.difference) ||
        right.workValue - left.workValue ||
        byId(left.axisId, right.axisId),
    )
    .slice(0, 2)
    .map((pair) => pair.axisId);
  const furthest = pairs
    .filter((pair) => Math.abs(pair.difference) >= 2)
    .sort(
      (left, right) =>
        Math.abs(right.difference) - Math.abs(left.difference) || byId(left.axisId, right.axisId),
    )[0];

  return {
    level,
    sharedAxisCount: pairs.length,
    closeAxes,
    apart:
      furthest === undefined
        ? null
        : { axisId: furthest.axisId, direction: furthest.difference > 0 ? "stronger" : "weaker" },
  };
}
