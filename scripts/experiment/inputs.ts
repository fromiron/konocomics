import { z } from "zod";

import { catalogIdSchema, catalogV1Schema } from "../../src/domain/catalog/schema";
import type { CatalogV1 } from "../../src/domain/catalog/types";
import { validateCatalog } from "../../src/domain/catalog/validate";
import { validateRecommendationContext } from "../../src/domain/recommendation/context";
import type { RecommendationContext } from "../../src/domain/recommendation/types";
import { ExperimentDataError } from "./errors";
import { EXPERIMENT_FILE_LIMITS, readBoundedJson } from "./io";

const recommendationConstraintMetadataSchema = z.strictObject({
  workId: catalogIdSchema,
  catalogRole: z.enum(["anchor", "bridge", "discovery"]),
  seriesGroupId: catalogIdSchema.optional(),
  volumeCount: z.number().int().nonnegative(),
});

const recommendationWorkMarketSignalSchema = z.strictObject({
  workId: catalogIdSchema,
  reviewAverage: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
});

export const recommendationContextFileSchema: z.ZodType<RecommendationContext> = z.strictObject({
  constraintByWorkId: z.record(catalogIdSchema, recommendationConstraintMetadataSchema),
  marketSnapshot: z.strictObject({
    catalogVersion: z.string().min(1),
    catalogAverageRating: z.number().min(0).max(5),
    byWorkId: z.record(catalogIdSchema, recommendationWorkMarketSignalSchema),
  }),
});

function formatZodIssues(issues: readonly { path: PropertyKey[]; message: string }[]) {
  return issues
    .map((issue) => `${issue.path.map(String).join(".") || "input"}: ${issue.message}`)
    .join("\n");
}

export function validateExperimentRecommendationContext(
  catalog: CatalogV1,
  context: RecommendationContext,
) {
  const issues = validateRecommendationContext(catalog, context);
  for (const work of [...catalog.works]
    .filter((candidate) => candidate.eligibility.recommendationEligible)
    .sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0))) {
    if (!Object.hasOwn(context.marketSnapshot.byWorkId, work.id)) {
      issues.push({
        field: `marketSnapshot.byWorkId.${work.id}`,
        message: "Recommendation-eligible works require an explicit market signal entry.",
      });
    }
  }
  return issues;
}

export async function loadExperimentCatalog(path: string): Promise<CatalogV1> {
  const input = await readBoundedJson(path, EXPERIMENT_FILE_LIMITS.catalog);
  const parsed = catalogV1Schema.safeParse(input);
  if (!parsed.success) {
    throw new ExperimentDataError(`Invalid catalog\n${formatZodIssues(parsed.error.issues)}`);
  }

  const issues = validateCatalog(parsed.data);
  if (issues.length > 0) {
    throw new ExperimentDataError(
      `Invalid catalog\n${issues.map((issue) => `${issue.code}: ${issue.message}`).join("\n")}`,
    );
  }
  return parsed.data;
}

export async function loadRecommendationContext(
  path: string,
  catalog: CatalogV1,
): Promise<RecommendationContext> {
  const input = await readBoundedJson(path, EXPERIMENT_FILE_LIMITS.context);
  const parsed = recommendationContextFileSchema.safeParse(input);
  if (!parsed.success) {
    throw new ExperimentDataError(
      `Invalid recommendation context\n${formatZodIssues(parsed.error.issues)}`,
    );
  }

  const issues = validateExperimentRecommendationContext(catalog, parsed.data);
  if (issues.length > 0) {
    throw new ExperimentDataError(
      `Invalid recommendation context\n${issues
        .map((issue) => `${issue.field}: ${issue.message}`)
        .join("\n")}`,
    );
  }
  return parsed.data;
}
