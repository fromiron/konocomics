import { Link } from "@tanstack/react-router";

import { recommendationStrings } from "@/lib/strings";

type RecommendationCriteriaSummaryProps = Readonly<{
  recordCount: number;
  preferenceSummary: string;
  activePolicyCount: number;
}>;

export function RecommendationCriteriaSummary({
  activePolicyCount,
  preferenceSummary,
  recordCount,
}: RecommendationCriteriaSummaryProps) {
  const items = [
    recommendationStrings.criteria.recordCount(recordCount),
    preferenceSummary,
    recommendationStrings.criteria.policyCount(activePolicyCount),
  ];

  return (
    <section
      aria-label={recommendationStrings.criteria.heading}
      className="mb-[var(--space-4)] flex min-w-0 flex-wrap items-baseline gap-x-[var(--space-3)] gap-y-[var(--space-content-tight)] border-b border-line/60 pb-[var(--space-3)]"
    >
      <h2 className="sr-only">{recommendationStrings.criteria.heading}</h2>
      <p className="min-w-0 text-[length:var(--text-caption-size)] leading-relaxed text-text-muted">
        {items.map((item, index) => (
          <span key={item}>
            {index === 0 ? null : (
              <span aria-hidden="true" className="mx-[var(--space-2)] text-text-muted/50">
                ·
              </span>
            )}
            {index === 1 ? <span className="text-text">{item}</span> : item}
          </span>
        ))}
      </p>
      <Link
        className="ml-auto inline-flex min-h-[var(--control-min-size)] shrink-0 items-center text-[length:var(--text-caption-size)] font-bold text-text-strong underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        preload={false}
        to="/taste"
      >
        {recommendationStrings.tasteSummary.link}
      </Link>
    </section>
  );
}
