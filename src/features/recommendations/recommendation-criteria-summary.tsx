import { Link } from "@tanstack/react-router";

import { recommendationStrings } from "@/lib/strings";

type RecommendationCriteriaSummaryProps = Readonly<{
  recordCount: number;
  adjustmentLabels?: readonly string[];
  preferenceLabels: readonly string[];
}>;

export function RecommendationCriteriaSummary({
  adjustmentLabels = [],
  preferenceLabels,
  recordCount,
}: RecommendationCriteriaSummaryProps) {
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
