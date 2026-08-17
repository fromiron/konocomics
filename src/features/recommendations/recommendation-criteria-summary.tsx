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
  const metrics = [
    {
      label: recommendationStrings.criteria.records,
      value: recommendationStrings.criteria.recordCount(recordCount),
    },
    {
      label: recommendationStrings.criteria.preferences,
      value: preferenceSummary,
    },
    {
      label: recommendationStrings.criteria.policies,
      value: recommendationStrings.criteria.policyCount(activePolicyCount),
    },
  ] as const;

  return (
    <section className="mb-[var(--space-3)] overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1 md:grid md:grid-cols-[minmax(13rem,0.9fr)_minmax(0,2.1fr)]">
      <header className="grid justify-items-start gap-[var(--space-content-tight)] border-b border-line px-[var(--space-3)] py-[var(--space-content)] md:border-r md:border-b-0 md:py-[var(--space-2)]">
        <div className="grid gap-[var(--space-content-tight)]">
          <h2 className="whitespace-nowrap text-[length:var(--text-subheading-size)]">
            {recommendationStrings.criteria.heading}
          </h2>
          <p className="sr-only text-[length:var(--text-caption-size)] text-text-muted">
            {recommendationStrings.criteria.description}
          </p>
        </div>
        <Link
          className="inline-flex min-h-[var(--control-min-size)] items-center text-[length:var(--text-caption-size)] font-bold text-accent"
          preload={false}
          to="/taste"
        >
          {recommendationStrings.tasteSummary.link}
        </Link>
      </header>
      <dl className="m-0 grid grid-cols-3">
        {metrics.map((metric) => (
          <div
            className="grid min-w-0 gap-[var(--space-content-tight)] border-r border-line px-[var(--space-content)] py-[var(--space-3)] last:border-r-0 md:py-[var(--space-2)]"
            key={metric.label}
          >
            <dt className="text-[length:var(--text-caption-size)] text-text-muted">
              {metric.label}
            </dt>
            <dd className="m-0 line-clamp-2 font-bold text-text-strong md:line-clamp-1">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
