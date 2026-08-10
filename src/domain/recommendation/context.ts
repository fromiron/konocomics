import type { CatalogV1 } from "../catalog/types";
import type {
  RecommendationConstraintMetadata,
  RecommendationContext,
  RecommendationWorkMarketSignal,
} from "./types";
import { ownRecordValue } from "./math";

export type RecommendationContextIssue = {
  field: string;
  message: string;
};

function isRating(value: number) {
  return Number.isFinite(value) && value >= 0 && value <= 5;
}

function isCount(value: number) {
  return Number.isInteger(value) && value >= 0;
}

export function validateRecommendationContext(
  catalog: CatalogV1,
  context: RecommendationContext,
): RecommendationContextIssue[] {
  const issues: RecommendationContextIssue[] = [];

  if (context.marketSnapshot.catalogVersion !== catalog.catalogVersion) {
    issues.push({
      field: "marketSnapshot.catalogVersion",
      message: "Recommendation context and catalog versions must match.",
    });
  }

  if (!isRating(context.marketSnapshot.catalogAverageRating)) {
    issues.push({
      field: "marketSnapshot.catalogAverageRating",
      message: "Catalog average rating must be a finite number from 0 through 5.",
    });
  }

  for (const work of [...catalog.works]
    .filter((candidate) => candidate.eligibility.recommendationEligible)
    .sort((left, right) => (left.id < right.id ? -1 : left.id > right.id ? 1 : 0))) {
    if (ownRecordValue(context.constraintByWorkId, work.id) === undefined) {
      issues.push({
        field: `constraintByWorkId.${work.id}`,
        message: "Recommendation-eligible works require constraint metadata.",
      });
    }
  }

  for (const [key, metadata] of Object.entries(context.constraintByWorkId).sort(
    ([left], [right]) => (left < right ? -1 : left > right ? 1 : 0),
  )) {
    if (metadata.workId !== key) {
      issues.push({
        field: `constraintByWorkId.${key}.workId`,
        message: "Constraint metadata key and work id must match.",
      });
    }
    if (!isCount(metadata.volumeCount)) {
      issues.push({
        field: `constraintByWorkId.${key}.volumeCount`,
        message: "Volume count must be a non-negative integer.",
      });
    }
  }

  for (const [key, signal] of Object.entries(context.marketSnapshot.byWorkId).sort(
    ([left], [right]) => (left < right ? -1 : left > right ? 1 : 0),
  )) {
    if (signal.workId !== key) {
      issues.push({
        field: `marketSnapshot.byWorkId.${key}.workId`,
        message: "Market signal key and work id must match.",
      });
    }
    if (signal.reviewAverage !== undefined && !isRating(signal.reviewAverage)) {
      issues.push({
        field: `marketSnapshot.byWorkId.${key}.reviewAverage`,
        message: "Review average must be a finite number from 0 through 5.",
      });
    }
    if (signal.reviewCount !== undefined && !isCount(signal.reviewCount)) {
      issues.push({
        field: `marketSnapshot.byWorkId.${key}.reviewCount`,
        message: "Review count must be a non-negative integer.",
      });
    }
  }

  return issues;
}

export function assertRecommendationContext(catalog: CatalogV1, context: RecommendationContext) {
  const issues = validateRecommendationContext(catalog, context);
  if (issues.length > 0) {
    throw new Error(issues.map((issue) => `${issue.field}: ${issue.message}`).join("\n"));
  }
}

export function constraintMetadataFor(
  workId: string,
  context: RecommendationContext,
): RecommendationConstraintMetadata {
  return (
    ownRecordValue(context.constraintByWorkId, workId) ?? {
      workId,
      catalogRole: "bridge",
      volumeCount: 0,
    }
  );
}

export function marketSignalFor(
  workId: string,
  context: RecommendationContext,
): RecommendationWorkMarketSignal {
  return ownRecordValue(context.marketSnapshot.byWorkId, workId) ?? { workId, reviewCount: 0 };
}
