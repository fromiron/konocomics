import { Link } from "@tanstack/react-router";

import { recommendationStrings } from "@/lib/strings";

type FeedbackImpactSummaryProps = Readonly<{
  completedCount: number;
  hiddenCount: number;
}>;

export function FeedbackImpactSummary({ completedCount, hiddenCount }: FeedbackImpactSummaryProps) {
  return (
    <section className="mt-[var(--space-5)] grid gap-[var(--space-3)] overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] md:items-center">
      <div className="grid gap-[var(--space-content-tight)] p-[var(--space-4)]">
        <h2>{recommendationStrings.feedbackSummary.heading}</h2>
        <p className="text-text-muted">{recommendationStrings.feedbackSummary.description}</p>
      </div>
      <dl className="m-0 grid grid-cols-2 border-y border-line md:border-x md:border-y-0">
        <div className="grid gap-[var(--space-content-tight)] border-r border-line p-[var(--space-3)]">
          <dt className="text-[length:var(--text-caption-size)] text-text-muted">
            {recommendationStrings.actions.completed}
          </dt>
          <dd className="m-0 font-bold text-text-strong">
            {recommendationStrings.feedbackSummary.count(completedCount)}
          </dd>
        </div>
        <div className="grid gap-[var(--space-content-tight)] p-[var(--space-3)]">
          <dt className="text-[length:var(--text-caption-size)] text-text-muted">
            {recommendationStrings.actions.hidden}
          </dt>
          <dd className="m-0 font-bold text-text-strong">
            {recommendationStrings.feedbackSummary.count(hiddenCount)}
          </dd>
        </div>
      </dl>
      <Link
        className="mx-[var(--space-4)] mb-[var(--space-4)] inline-flex min-h-[var(--control-min-size)] items-center justify-center rounded-[var(--radius-control)] border border-line px-[var(--space-3)] font-bold text-accent md:mx-0 md:mr-[var(--space-4)] md:mb-0"
        preload={false}
        to="/taste"
      >
        {recommendationStrings.tasteSummary.link}
      </Link>
    </section>
  );
}
