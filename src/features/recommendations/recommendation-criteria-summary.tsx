import { recommendationStrings } from "@/lib/strings";

type RecommendationCriteriaSummaryProps = Readonly<{
  recordCount: number;
  preferenceSummary: string;
}>;

export function RecommendationCriteriaSummary({
  preferenceSummary,
  recordCount,
}: RecommendationCriteriaSummaryProps) {
  return (
    <section
      aria-label={recommendationStrings.criteria.heading}
      className="mb-[var(--space-4)] grid min-w-0 gap-[var(--space-1)]"
    >
      <p className="text-[length:var(--text-caption-size)] text-text-muted">
        {recommendationStrings.criteria.recordCount(recordCount)}
      </p>
      <p className="text-[length:var(--font-size-14)] leading-relaxed text-text">
        {preferenceSummary}
      </p>
    </section>
  );
}
