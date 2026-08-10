import type { CoverageGroup } from "../catalog/types";
import type { FactorBackedNegativeReasonId } from "../profile/types";

export const GROUP_WEIGHTS = {
  genre: 0.15,
  theme: 0.25,
  narrative: 0.25,
  tone: 0.2,
  art: 0.15,
} as const satisfies Record<CoverageGroup, number>;

export const PRESENCE_SENSITIVE_AXIS_IDS = ["darkness", "mentalStress", "romance"] as const;

export const FACTOR_PENALTY_AMOUNTS = {
  tooSlow: 0.12,
  tooRepetitiveProgression: 0.1,
  tooDark: 0.1,
  tooStressful: 0.1,
  tooMuchRomance: 0.1,
  tooMuchComedy: 0.1,
  notEnoughSeriousness: 0.1,
  tooComplex: 0.1,
  artStyleDislike: 0.08,
  genericStory: 0.08,
  powerInflation: 0.08,
} as const satisfies Record<FactorBackedNegativeReasonId, number>;

export const FACTOR_PENALTY_GROUPS = {
  tooSlow: "narrative",
  tooRepetitiveProgression: "narrative",
  tooDark: "tone",
  tooStressful: "tone",
  tooMuchRomance: "tone",
  tooMuchComedy: "tone",
  notEnoughSeriousness: "tone",
  tooComplex: "overall",
  artStyleDislike: "art",
  genericStory: "theme",
  powerInflation: "narrative",
} as const satisfies Record<FactorBackedNegativeReasonId, CoverageGroup | "overall">;

export const FACTOR_PENALTY_CAP = 0.25;
export const VAGUE_PENALTY_WEIGHT = 0.08;
export const CONSENSUS_CLUSTER_THRESHOLD = 0.65;
export const CONSENSUS_BONUS_CAP = 0.05;
export const EXPLICIT_ADJUSTMENT_CAP = 0.12;
export const THEME_SOFT_EXCLUSION_PENALTY = 0.1;
export const COMPLETED_POLICY_PENALTY = 0.05;
export const TASTE_COHORT_THRESHOLD = 0.025;
export const DISCOVERY_SCORE_WINDOW = 0.1;
