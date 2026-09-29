import type { AxisId, Work } from "../catalog/types";
import type { RecommendationPlanEntry } from "./types";

export const RECOMMENDATION_MOODS = ["lowStress", "warm", "fastPaced"] as const;
export type RecommendationMood = (typeof RECOMMENDATION_MOODS)[number];

export type MoodCondition = Readonly<{
  axisId: AxisId;
  comparison: "atMost" | "atLeast";
  value: number;
}>;

/**
 * Starting policy values (02 §6.10), not validated user effects. A mood never relaxes itself
 * to find more works; changing a threshold is an explicit edit here and in the spec.
 */
export const MOOD_CONDITIONS = {
  lowStress: { axisId: "mentalStress", comparison: "atMost", value: 1 },
  warm: { axisId: "emotionalWarmth", comparison: "atLeast", value: 3 },
  fastPaced: { axisId: "pacing", comparison: "atLeast", value: 3 },
} as const satisfies Readonly<Record<RecommendationMood, MoodCondition>>;

export function isRecommendationMood(value: unknown): value is RecommendationMood {
  return RECOMMENDATION_MOODS.some((mood) => mood === value);
}

/**
 * A work satisfies a mood only through a confirmed (`known`) Axis value. Unknown data is not
 * a match and not a mismatch; it simply cannot be shown under the mood.
 */
export function workMatchesMood(work: Pick<Work, "axes">, mood: RecommendationMood) {
  const condition = MOOD_CONDITIONS[mood];
  const factor = work.axes[condition.axisId];
  if (factor.state !== "known") return false;
  return condition.comparison === "atMost"
    ? factor.value <= condition.value
    : factor.value >= condition.value;
}

/**
 * Narrows an already ranked plan to one mood, keeping the plan's scores, contributions,
 * popularity flags, and order. Mood-scoped dismissals and session exclusions are removed too.
 * List constraints (Top 10, Discovery window) are applied afterwards to this narrowed set.
 */
export function filterPlanForMood({
  dismissedWorkIds,
  excludedWorkIds,
  mood,
  plan,
  worksById,
}: Readonly<{
  plan: readonly RecommendationPlanEntry[];
  worksById: ReadonlyMap<string, Pick<Work, "axes">>;
  mood: RecommendationMood;
  dismissedWorkIds: ReadonlySet<string>;
  excludedWorkIds: ReadonlySet<string>;
}>): RecommendationPlanEntry[] {
  return plan.filter((entry) => {
    if (dismissedWorkIds.has(entry.workId) || excludedWorkIds.has(entry.workId)) return false;
    const work = worksById.get(entry.workId);
    return work !== undefined && workMatchesMood(work, mood);
  });
}
