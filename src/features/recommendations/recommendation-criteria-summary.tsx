import { Link } from "@tanstack/react-router";

import { createRecommendationInputProjection } from "@/domain/recommendation/input-hash";
import type { RecommendationInput } from "@/domain/recommendation/types";
import { recommendationStrings } from "@/lib/strings";

type RecommendationCriteriaSummaryProps = Readonly<{
  recordCount: number;
  totalRecordCount: number;
  input?: RecommendationInput | null;
  adjustmentLabels?: readonly string[];
  preferenceLabels: readonly string[];
}>;

export function RecommendationCriteriaSummary({
  adjustmentLabels = [],
  preferenceLabels,
  recordCount,
  totalRecordCount,
  input,
}: RecommendationCriteriaSummaryProps) {
  const projection = input == null ? null : createRecommendationInputProjection(input);
  return (
    <section
      aria-label={recommendationStrings.criteria.heading}
      className="mb-[var(--space-4)] flex min-w-0 flex-wrap items-center gap-x-[var(--space-3)]"
    >
      <p className="text-[length:var(--font-size-14)] leading-relaxed text-text-muted">
        {preferenceLabels.length === 0
          ? recommendationStrings.criteria.basisWithoutPreferences(recordCount)
          : recommendationStrings.criteria.basis(recordCount, preferenceLabels.join("・"))}
      </p>
      {projection === null ? null : (
        <p className="w-full text-[length:var(--text-caption-size)] text-text-muted">
          {recommendationStrings.criteria.counts(
            totalRecordCount,
            new Set(projection.negativeRecords.map((record) => record.workId)).size,
            new Set([
              ...projection.anchors.map((anchor) => anchor.workId),
              ...projection.eligibilityExclusions,
            ]).size,
          )}
        </p>
      )}
      {adjustmentLabels.length > 0 ? (
        <p className="text-[length:var(--font-size-14)] text-text-muted">
          {recommendationStrings.criteria.adjusted(adjustmentLabels.join("・"))}
        </p>
      ) : null}
      <Link
        className="inline-flex min-h-[var(--control-min-size)] shrink-0 items-center text-[length:var(--font-size-14)] font-bold text-text underline underline-offset-4 hover:text-text-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        preload={false}
        to="/taste"
      >
        {recommendationStrings.criteria.dnaLink}
      </Link>
    </section>
  );
}
