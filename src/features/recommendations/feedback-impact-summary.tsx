import { Link } from "@tanstack/react-router";

import { recommendationStrings } from "@/lib/strings";

type FeedbackImpactSummaryProps = Readonly<{
  completedCount: number;
  hiddenCount: number;
}>;

export function FeedbackImpactSummary({ completedCount, hiddenCount }: FeedbackImpactSummaryProps) {
  return (
    <section className="mt-[var(--space-4)] grid overflow-hidden rounded-[var(--radius-card)] border border-line/80 bg-surface-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] md:items-center">
      <div className="grid gap-[var(--space-content-tight)] p-[var(--space-3)]">
        <h2 className="text-[length:var(--text-subheading-size)] font-bold tracking-wide text-text-strong">
          {recommendationStrings.feedbackSummary.heading}
        </h2>
        <p className="text-[length:var(--text-caption-size)] text-text-muted">
          {recommendationStrings.feedbackSummary.description}
        </p>
      </div>
      <dl className="m-0 grid grid-cols-2 border-y border-line/70 md:border-x md:border-y-0">
        <div className="grid gap-[var(--space-content-tight)] border-r border-line/70 px-[var(--space-3)] py-[var(--space-2)]">
          <dt className="text-[length:var(--text-caption-size)] font-medium text-text-muted">
            {recommendationStrings.actions.completed}
          </dt>
          <dd className="m-0 text-[length:var(--font-size-16)] font-bold tracking-tight text-text-strong">
            {recommendationStrings.feedbackSummary.count(completedCount)}
          </dd>
        </div>
        <div className="grid gap-[var(--space-content-tight)] px-[var(--space-3)] py-[var(--space-2)]">
          <dt className="text-[length:var(--text-caption-size)] font-medium text-text-muted">
            {recommendationStrings.actions.hidden}
          </dt>
          <dd className="m-0 text-[length:var(--font-size-16)] font-bold tracking-tight text-text-strong">
            {recommendationStrings.feedbackSummary.count(hiddenCount)}
          </dd>
        </div>
      </dl>
      <Link
        className="mx-[var(--space-3)] mb-[var(--space-3)] inline-flex min-h-[var(--control-min-size)] items-center justify-center border-l border-line-accent-subtle px-[var(--space-3)] font-bold text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:mx-0 md:mr-[var(--space-3)] md:mb-0"
        preload={false}
        to="/taste"
      >
        {recommendationStrings.tasteSummary.link}
      </Link>
    </section>
  );
}
