import type { AdjustmentPreference, FactorBackedNegativeReasonId, Reaction } from "./types";

export const REACTION_WEIGHTS = {
  favorite: 1,
  liked: 0.8,
} as const satisfies Partial<Record<Reaction, number>>;

export const ADJUSTMENT_STRENGTHS = {
  veryLike: 0.06,
  like: 0.03,
  auto: 0,
  less: -0.06,
} as const satisfies Partial<Record<AdjustmentPreference, number>>;

export const FACTOR_BACKED_NEGATIVE_REASON_IDS = [
  "tooSlow",
  "tooRepetitiveProgression",
  "tooDark",
  "tooStressful",
  "tooMuchRomance",
  "tooMuchComedy",
  "notEnoughSeriousness",
  "tooComplex",
  "artStyleDislike",
  "genericStory",
  "powerInflation",
] as const satisfies readonly FactorBackedNegativeReasonId[];

export const NEGATIVE_REASON_ORDER = [
  ...FACTOR_BACKED_NEGATIVE_REASON_IDS,
  "vagueDislike",
] as const;

export function isExternalNegativeReason(reason: string): reason is `external:${string}` {
  return reason.startsWith("external:");
}

export function isFactorBackedNegativeReason(
  reason: string,
): reason is FactorBackedNegativeReasonId {
  return FACTOR_BACKED_NEGATIVE_REASON_IDS.some((candidate) => candidate === reason);
}
