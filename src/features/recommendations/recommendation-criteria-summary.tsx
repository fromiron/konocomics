import { Link } from "@tanstack/react-router";
import { BookOpenTextIcon, InfoIcon, SlidersHorizontalIcon, SparklesIcon } from "lucide-react";

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
      icon: BookOpenTextIcon,
      label: recommendationStrings.criteria.records,
      value: recommendationStrings.criteria.recordCount(recordCount),
    },
    {
      icon: SparklesIcon,
      label: recommendationStrings.criteria.preferences,
      value: preferenceSummary,
    },
    {
      icon: SlidersHorizontalIcon,
      label: recommendationStrings.criteria.policies,
      value: recommendationStrings.criteria.policyCount(activePolicyCount),
    },
  ] as const;

  return (
    <section className="mb-[var(--space-3)] overflow-hidden rounded-[var(--radius-card)] border border-line/80 bg-surface-1">
      <header className="flex min-h-[var(--control-min-size)] min-w-0 items-center justify-between gap-[var(--space-3)] border-b border-line/80 px-[var(--space-3)] py-0">
        <div className="flex min-w-0 items-center gap-[var(--space-2)]">
          <InfoIcon aria-hidden="true" className="size-4 shrink-0 text-accent" />
          <div className="flex min-w-0 items-baseline gap-[var(--space-2)]">
            <h2 className="whitespace-nowrap text-[length:var(--font-size-16)] font-bold text-text-strong">
              {recommendationStrings.criteria.heading}
            </h2>
            <p className="hidden truncate text-[length:var(--text-caption-size)] text-text-muted md:block">
              {recommendationStrings.criteria.description}
            </p>
          </div>
        </div>
        <Link
          className="inline-flex min-h-[var(--control-min-size)] shrink-0 items-center gap-[var(--space-1)] px-[var(--space-2)] text-[length:var(--text-caption-size)] font-bold text-accent underline-offset-[var(--space-content-tight)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          preload={false}
          to="/taste"
        >
          <span>{recommendationStrings.tasteSummary.link}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </header>
      <dl className="m-0 grid grid-cols-3 divide-x divide-line/70">
        {metrics.map(({ icon: Icon, label, value }) => (
          <div
            className="grid min-h-[var(--control-min-size)] min-w-0 grid-cols-1 items-center gap-[var(--space-2)] px-[var(--space-2)] py-0 sm:grid-cols-[auto_minmax(0,1fr)] md:px-[var(--space-4)]"
            key={label}
          >
            <Icon aria-hidden="true" className="hidden size-4 shrink-0 text-accent sm:block" />
            <div className="grid min-w-0 gap-px">
              <dt className="truncate text-[length:var(--text-caption-size)] font-medium text-text-muted">
                {label}
              </dt>
              <dd className="m-0 line-clamp-1 text-[length:var(--font-size-12)] font-bold text-text-strong md:text-[length:var(--font-size-14)]">
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
