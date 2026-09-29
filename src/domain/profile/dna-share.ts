import { AXIS_IDS } from "../catalog/constants";
import type { AxisId } from "../catalog/types";
import type { DnaTopPreference, MangaDnaSummary } from "./dna-summary";

export const DNA_SHARE_MAX_PREFERENCES = 3;
export const DNA_SHARE_MAX_RESTRAINED_AXES = 3;
/**
 * Upper bound (exclusive) of the 「控えめ」 band used by the Manga DNA meters. Only Axes the
 * summary confirms below it count as scarce in the reader's liked works.
 */
export const DNA_SHARE_RESTRAINED_BELOW = 1.5;

export type DnaSharePreference = Readonly<{
  kind: DnaTopPreference["kind"];
  factorId: DnaTopPreference["factorId"];
  /** 0–4, on the same scale as the Manga DNA meters. */
  value: number;
}>;

export type DnaShareRestrainedAxis = Readonly<{
  axisId: AxisId;
  value: number;
}>;

export type DnaShareCardModel = Readonly<{
  /** Distinct works the DNA was computed from. */
  analyzedWorkCount: number;
  preferences: readonly DnaSharePreference[];
  /**
   * Analysed works the reader chose to name, top-preference evidence first. Works not named
   * here are still analysed and are counted on the card, never dropped from the total.
   */
  namedWorkIds: readonly string[];
  /** Confirmed Axes that are scarce in the liked works, lowest first; may be empty. */
  restrainedAxes: readonly DnaShareRestrainedAxis[];
}>;

/** Every analysed work, with the works behind the top preferences first. */
export function dnaShareWorkCandidates(
  summary: Pick<MangaDnaSummary, "analyzedWorkIds" | "topPreferences">,
) {
  const analyzed = new Set(summary.analyzedWorkIds);
  return [
    ...new Set([
      ...summary.topPreferences
        .slice(0, DNA_SHARE_MAX_PREFERENCES)
        .flatMap((preference) => preference.anchorWorkIds)
        .filter((workId) => analyzed.has(workId)),
      ...summary.analyzedWorkIds,
    ]),
  ];
}

/**
 * Projects a Manga DNA summary onto the share card. Preferences come only from the summary's
 * confirmed top preferences and are never padded. Scarce Axes are confirmed values in the
 * 「控えめ」 band; an unanalysed Axis is never listed as scarce. Naming fewer works changes what
 * the card names, never the analysed work count. Returns null when there is nothing to share.
 */
export function buildDnaShareCard(
  summary: Pick<MangaDnaSummary, "analyzedWorkIds" | "axes" | "topPreferences">,
  publicWorkIds: ReadonlySet<string>,
): DnaShareCardModel | null {
  const topPreferences = summary.topPreferences.slice(0, DNA_SHARE_MAX_PREFERENCES);
  if (topPreferences.length === 0) return null;
  const featured = new Set<string>(topPreferences.map((preference) => preference.factorId));
  const axisOrder = new Map(AXIS_IDS.map((axisId, index) => [axisId, index] as const));
  const restrainedAxes = summary.axes
    .flatMap((axis): DnaShareRestrainedAxis[] =>
      axis.state === "known" &&
      axis.value !== null &&
      axis.value < DNA_SHARE_RESTRAINED_BELOW &&
      !featured.has(axis.factorId)
        ? [{ axisId: axis.factorId, value: axis.value }]
        : [],
    )
    .sort(
      (left, right) =>
        left.value - right.value ||
        (axisOrder.get(left.axisId) ?? 0) - (axisOrder.get(right.axisId) ?? 0),
    )
    .slice(0, DNA_SHARE_MAX_RESTRAINED_AXES);
  return {
    analyzedWorkCount: new Set(summary.analyzedWorkIds).size,
    preferences: topPreferences.map(({ factorId, kind, value }) => ({ factorId, kind, value })),
    namedWorkIds: dnaShareWorkCandidates(summary).filter((workId) => publicWorkIds.has(workId)),
    restrainedAxes,
  };
}
