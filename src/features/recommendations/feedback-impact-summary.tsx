import { Link } from "@tanstack/react-router";

import { recommendationStrings } from "@/lib/strings";

type FeedbackImpactSummaryProps = Readonly<{
  completedCount: number;
  hiddenCount: number;
}>;

export function FeedbackImpactSummary({ completedCount, hiddenCount }: FeedbackImpactSummaryProps) {
  if (completedCount + hiddenCount === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="recommendation-feedback-heading"
      className="relative mt-[var(--space-section)] min-h-[148px] overflow-hidden rounded-[var(--radius-card)] md:h-[152px] md:min-h-[152px]"
    >
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover object-[86%_50%] md:object-[76%_46%]"
        decoding="async"
        fetchPriority="low"
        loading="lazy"
        src="/media/recommendations-feedback-manga-v4.png"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-canvas from-40% via-canvas/80 via-58% to-transparent to-82%"
      />
      <div className="relative z-10 grid h-full min-h-[148px] content-center justify-items-start gap-[var(--space-2)] p-[var(--space-3)] md:min-h-[152px] md:max-w-[58%] md:p-[var(--space-5)]">
        <h2
          className="text-[length:var(--font-size-14)] leading-snug font-bold text-text-strong md:text-[length:var(--text-subheading-size)]"
          id="recommendation-feedback-heading"
        >
          {recommendationStrings.feedbackSummary.heading}
        </h2>
        <p className="text-[length:var(--text-caption-size)] text-text-muted">
          {recommendationStrings.feedbackSummary.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-[var(--space-4)] gap-y-[var(--space-2)]">
          <dl className="m-0 flex gap-[var(--space-4)]">
            <div className="grid gap-[var(--space-content-tight)]">
              <dt className="text-[length:var(--text-caption-size)] font-medium text-text-muted">
                {recommendationStrings.actions.completed}
              </dt>
              <dd className="m-0 text-[length:var(--font-size-16)] font-bold tracking-tight text-text-strong tabular-nums">
                {recommendationStrings.feedbackSummary.count(completedCount)}
              </dd>
            </div>
            <div className="grid gap-[var(--space-content-tight)]">
              <dt className="text-[length:var(--text-caption-size)] font-medium text-text-muted">
                {recommendationStrings.actions.hidden}
              </dt>
              <dd className="m-0 text-[length:var(--font-size-16)] font-bold tracking-tight text-text-strong tabular-nums">
                {recommendationStrings.feedbackSummary.count(hiddenCount)}
              </dd>
            </div>
          </dl>
          <Link
            className="inline-flex min-h-[var(--control-min-size)] items-center font-bold text-accent underline underline-offset-[var(--space-content-tight)] transition-transform duration-[var(--motion-duration-press)] active:scale-[0.97] motion-reduce:transform-none motion-reduce:transition-none"
            preload={false}
            to="/taste"
          >
            {recommendationStrings.tasteSummary.link}
          </Link>
        </div>
      </div>
    </section>
  );
}
