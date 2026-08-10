import { AXIS_IDS, NARRATIVE_AXIS_IDS, THEME_TAGS, TONE_AXIS_IDS } from "../catalog/constants";
import type { AxisId, CoverageGroup, ScaleValue, ThemeTag, Work } from "../catalog/types";
import { ADJUSTMENT_STRENGTHS } from "../profile/constants";
import type { AdjustmentPreference, ProfileAdjustments } from "../profile/types";
import { EXPLICIT_ADJUSTMENT_CAP, THEME_SOFT_EXCLUSION_PENALTY } from "./constants";
import { clamp, roundScore } from "./math";
import type { GroupContribution } from "./types";

const NARRATIVE_AXIS_SET = new Set<AxisId>(NARRATIVE_AXIS_IDS);
const TONE_AXIS_SET = new Set<AxisId>(TONE_AXIS_IDS);

export type HardExclusionReason =
  | { kind: "incomplete" }
  | { kind: "axis"; factorId: AxisId }
  | { kind: "theme"; factorId: ThemeTag };

export type ExplicitAdjustmentResult = {
  rawAdjustment: number;
  explicitAdjustment: number;
  clampCorrection: number;
  softExclusionPenalty: number;
  totalAdjustment: number;
  rawEntries: GroupContribution[];
  clampEntry?: GroupContribution;
  softExclusionEntries: GroupContribution[];
  contributions: GroupContribution[];
};

function axisGroup(axisId: AxisId): CoverageGroup {
  if (NARRATIVE_AXIS_SET.has(axisId)) {
    return "narrative";
  }
  if (TONE_AXIS_SET.has(axisId)) {
    return "tone";
  }
  return "art";
}

function adjustmentStrength(preference: AdjustmentPreference | undefined) {
  if (preference === undefined || preference === "exclude") {
    return undefined;
  }
  return ADJUSTMENT_STRENGTHS[preference];
}

function contribution(
  source: GroupContribution["source"],
  group: GroupContribution["group"],
  factorId: string,
  value: number,
  explainable: boolean,
): GroupContribution {
  return {
    source,
    group,
    factorId,
    value: roundScore(value),
    anchorWorkIds: [],
    explainable,
  };
}

export function calculateAxisAdjustment(value: ScaleValue, strength: number) {
  return roundScore(strength * (value / 4 - 0.5) * 2);
}

export function calculateThemeAdjustment(centrality: 1 | 2, strength: number) {
  return roundScore(strength * (centrality === 2 ? 1 : 0.5));
}

export function getHardExclusionReasons(
  work: Work,
  adjustments: ProfileAdjustments,
  excludeIncomplete: boolean,
): HardExclusionReason[] {
  const reasons: HardExclusionReason[] = [];

  if (excludeIncomplete && work.status !== "completed") {
    reasons.push({ kind: "incomplete" });
  }

  for (const axisId of AXIS_IDS) {
    if (adjustments.axes[axisId] !== "exclude") {
      continue;
    }
    const factor = work.axes[axisId];
    if (factor.state === "known" && factor.value >= 3) {
      reasons.push({ kind: "axis", factorId: axisId });
    }
  }

  for (const themeId of THEME_TAGS) {
    if (adjustments.themes[themeId] !== "exclude") {
      continue;
    }
    if (work.themes.some((theme) => theme.id === themeId && theme.centrality === 2)) {
      reasons.push({ kind: "theme", factorId: themeId });
    }
  }

  return reasons;
}

export function isHardExcluded(
  work: Work,
  adjustments: ProfileAdjustments,
  excludeIncomplete: boolean,
) {
  return getHardExclusionReasons(work, adjustments, excludeIncomplete).length > 0;
}

export function calculateExplicitAdjustment(
  work: Work,
  adjustments: ProfileAdjustments,
): ExplicitAdjustmentResult {
  const rawEntries: GroupContribution[] = [];
  const softExclusionEntries: GroupContribution[] = [];

  for (const axisId of AXIS_IDS) {
    const strength = adjustmentStrength(adjustments.axes[axisId]);
    const factor = work.axes[axisId];
    if (strength === undefined || factor.state !== "known") {
      continue;
    }
    const value = calculateAxisAdjustment(factor.value, strength);
    if (value !== 0) {
      rawEntries.push(contribution("adjustment", axisGroup(axisId), axisId, value, true));
    }
  }

  for (const themeId of THEME_TAGS) {
    const preference = adjustments.themes[themeId];
    const theme = work.themes.find((candidate) => candidate.id === themeId);
    if (preference === "exclude") {
      if (theme?.centrality === 1) {
        softExclusionEntries.push(
          contribution("penalty", "theme", themeId, -THEME_SOFT_EXCLUSION_PENALTY, true),
        );
      }
      continue;
    }

    const strength = adjustmentStrength(preference);
    if (strength === undefined || theme === undefined) {
      continue;
    }
    const value = calculateThemeAdjustment(theme.centrality, strength);
    if (value !== 0) {
      rawEntries.push(contribution("adjustment", "theme", themeId, value, true));
    }
  }

  const rawAdjustment = roundScore(rawEntries.reduce((total, entry) => total + entry.value, 0));
  const explicitAdjustment = roundScore(
    clamp(rawAdjustment, -EXPLICIT_ADJUSTMENT_CAP, EXPLICIT_ADJUSTMENT_CAP),
  );
  const clampCorrection = roundScore(explicitAdjustment - rawAdjustment);
  const clampEntry =
    clampCorrection === 0
      ? undefined
      : contribution("clamp", "overall", "adjustmentClamp", clampCorrection, false);
  const softExclusionPenalty = roundScore(
    softExclusionEntries.reduce((total, entry) => total + entry.value, 0),
  );

  return {
    rawAdjustment,
    explicitAdjustment,
    clampCorrection,
    softExclusionPenalty,
    totalAdjustment: roundScore(explicitAdjustment + softExclusionPenalty),
    rawEntries,
    ...(clampEntry === undefined ? {} : { clampEntry }),
    softExclusionEntries,
    contributions: [
      ...rawEntries,
      ...(clampEntry === undefined ? [] : [clampEntry]),
      ...softExclusionEntries,
    ],
  };
}
