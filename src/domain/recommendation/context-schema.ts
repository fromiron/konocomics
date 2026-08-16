import * as z from "zod/v4";

import { catalogIdSchema } from "../catalog/schema";
import type { RecommendationContext } from "./types";

export const recommendationConstraintMetadataSchema = z.strictObject({
  workId: catalogIdSchema,
  catalogRole: z.enum(["anchor", "bridge", "discovery"]),
  seriesGroupId: catalogIdSchema.optional(),
  volumeCount: z.number().int().nonnegative(),
});

export const recommendationWorkMarketSignalSchema = z.strictObject({
  workId: catalogIdSchema,
  reviewAverage: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
});

export const recommendationContextSchema: z.ZodType<RecommendationContext> = z.strictObject({
  constraintByWorkId: z.record(catalogIdSchema, recommendationConstraintMetadataSchema),
  marketSnapshot: z.strictObject({
    catalogVersion: z.string().min(1),
    catalogAverageRating: z.number().min(0).max(5),
    byWorkId: z.record(catalogIdSchema, recommendationWorkMarketSignalSchema),
  }),
});

export function parseRecommendationContext(value: unknown): RecommendationContext {
  return recommendationContextSchema.parse(value);
}
