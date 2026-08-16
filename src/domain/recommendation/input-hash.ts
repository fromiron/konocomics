import { AXIS_IDS, THEME_TAGS } from "../catalog/constants";
import type { AxisId, ThemeTag } from "../catalog/types";
import type {
  AdjustmentPreference,
  NegativeReasonId,
  RecommendationPolicies,
  UserWorkRecord,
} from "../profile/types";
import { compareText } from "./math";
import type { RecommendationInput } from "./types";

export const RECOMMENDATION_ENGINE_VERSION = "taste-v1" as const;
export const RECOMMENDATION_CACHE_SCHEMA_VERSION = 1 as const;
export const RECOMMENDATION_INPUT_PROJECTION_VERSION = 1 as const;

type RecommendationInputHashSource = Pick<
  RecommendationInput,
  "catalog" | "records" | "adjustments" | "policies"
>;

export type RecommendationInputProjectionAdjustment<FactorId extends string> = {
  factorId: FactorId;
  preference: Exclude<AdjustmentPreference, "auto">;
};

export type RecommendationInputProjectionV1 = {
  schemaVersion: typeof RECOMMENDATION_INPUT_PROJECTION_VERSION;
  cacheSchemaVersion: typeof RECOMMENDATION_CACHE_SCHEMA_VERSION;
  engineVersion: typeof RECOMMENDATION_ENGINE_VERSION;
  catalogVersion: string;
  anchors: {
    workId: string;
    reaction: "favorite" | "liked";
  }[];
  negativeRecords: {
    workId: string;
    disposition: "disliked" | "dropped";
    reasons: NegativeReasonId[];
  }[];
  adjustments: {
    axes: RecommendationInputProjectionAdjustment<AxisId>[];
    themes: RecommendationInputProjectionAdjustment<ThemeTag>[];
  };
  policies: RecommendationPolicies;
  eligibilityExclusions: string[];
};

function sortedReasons(reasons: readonly NegativeReasonId[] | undefined) {
  return [...new Set(reasons ?? [])].sort(compareText);
}

function isPositiveAnchor(
  record: UserWorkRecord,
): record is UserWorkRecord & { reaction: "favorite" | "liked" } {
  return record.reaction === "favorite" || record.reaction === "liked";
}

function effectiveAdjustments<FactorId extends AxisId | ThemeTag>(
  factorIds: readonly FactorId[],
  values: Partial<Record<FactorId, AdjustmentPreference>>,
): RecommendationInputProjectionAdjustment<FactorId>[] {
  return factorIds
    .flatMap<RecommendationInputProjectionAdjustment<FactorId>>((factorId) => {
      const preference = values[factorId];
      return preference === undefined || preference === "auto" ? [] : [{ factorId, preference }];
    })
    .sort((left, right) => compareText(left.factorId, right.factorId));
}

export function createRecommendationInputProjection(
  input: RecommendationInputHashSource,
): RecommendationInputProjectionV1 {
  const workById = new Map(input.catalog.works.map((work) => [work.id, work]));
  const currentRecords = input.records.filter((record) => workById.has(record.workId));
  const anchors = currentRecords
    .filter(isPositiveAnchor)
    .map((record) => ({ workId: record.workId, reaction: record.reaction }))
    .sort(
      (left, right) =>
        compareText(left.workId, right.workId) || compareText(left.reaction, right.reaction),
    );
  const anchorWorkIds = new Set(anchors.map((anchor) => anchor.workId));
  const negativeRecords = currentRecords
    .flatMap<RecommendationInputProjectionV1["negativeRecords"][number]>((record) => {
      const entries: RecommendationInputProjectionV1["negativeRecords"] = [];
      if (record.reaction === "disliked" || (record.negativeReasons?.length ?? 0) > 0) {
        entries.push({
          workId: record.workId,
          disposition: "disliked",
          reasons: sortedReasons(record.negativeReasons),
        });
      }
      if (record.readingState === "dropped" || (record.droppedReasons?.length ?? 0) > 0) {
        entries.push({
          workId: record.workId,
          disposition: "dropped",
          reasons: sortedReasons(record.droppedReasons),
        });
      }
      return entries;
    })
    .sort(
      (left, right) =>
        compareText(left.workId, right.workId) || compareText(left.disposition, right.disposition),
    );
  const eligibilityExclusions = [
    ...new Set(
      currentRecords.flatMap((record) => {
        const work = workById.get(record.workId);
        if (
          work?.eligibility.recommendationEligible !== true ||
          anchorWorkIds.has(record.workId) ||
          (record.readingState !== "reading" &&
            record.readingState !== "completed" &&
            record.readingState !== "dropped" &&
            record.readingState !== "hidden" &&
            record.reaction !== "disliked")
        ) {
          return [];
        }
        return [record.workId];
      }),
    ),
  ].sort(compareText);

  return {
    schemaVersion: RECOMMENDATION_INPUT_PROJECTION_VERSION,
    cacheSchemaVersion: RECOMMENDATION_CACHE_SCHEMA_VERSION,
    engineVersion: RECOMMENDATION_ENGINE_VERSION,
    catalogVersion: input.catalog.catalogVersion,
    anchors,
    negativeRecords,
    adjustments: {
      axes: effectiveAdjustments(AXIS_IDS, input.adjustments.axes),
      themes: effectiveAdjustments(THEME_TAGS, input.adjustments.themes),
    },
    policies: {
      preferCompleted: input.policies.preferCompleted,
      preferHidden: input.policies.preferHidden,
      preferVerified: input.policies.preferVerified,
      excludeIncomplete: input.policies.excludeIncomplete,
    },
    eligibilityExclusions,
  };
}

export function serializeRecommendationInput(input: RecommendationInputHashSource) {
  return JSON.stringify(createRecommendationInputProjection(input));
}
