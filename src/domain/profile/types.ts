import type { AxisId, ThemeTag } from "../catalog/types";

export type ReadingState = "planned" | "reading" | "completed" | "dropped" | "hidden";
export type Reaction = "favorite" | "liked" | "neutral" | "disliked";

export type FactorBackedNegativeReasonId =
  | "tooSlow"
  | "tooRepetitiveProgression"
  | "tooDark"
  | "tooStressful"
  | "tooMuchRomance"
  | "tooMuchComedy"
  | "notEnoughSeriousness"
  | "tooComplex"
  | "artStyleDislike"
  | "genericStory"
  | "powerInflation";

export type ExternalNegativeReasonId = `external:${string}`;
export type NegativeReasonId =
  FactorBackedNegativeReasonId | "vagueDislike" | ExternalNegativeReasonId;

export type UserWorkRecord = {
  workId: string;
  readingState: ReadingState;
  reaction?: Reaction;
  progress?: { volume?: number; chapter?: number };
  positiveReasons?: string[];
  negativeReasons?: NegativeReasonId[];
  droppedReasons?: NegativeReasonId[];
  updatedAt: string;
};

export type AdjustmentPreference = "veryLike" | "like" | "auto" | "less" | "exclude";

export type ProfileAdjustments = {
  axes: Partial<Record<AxisId, AdjustmentPreference>>;
  themes: Partial<Record<ThemeTag, AdjustmentPreference>>;
};

export type RecommendationPolicies = {
  preferCompleted: boolean;
  preferHidden: boolean;
  preferVerified: boolean;
  excludeIncomplete: boolean;
};

export type RecommendationProfile = {
  records: UserWorkRecord[];
  adjustments: ProfileAdjustments;
  policies: RecommendationPolicies;
};
