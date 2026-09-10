import { Link } from "@tanstack/react-router";

import { buttonClassName } from "@/components/design-system/button";
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
      className="relative mt-[var(--space-section-xl)] mb-[calc(var(--space-section-xl)-var(--space-8))] overflow-hidden rounded-[var(--radius-card)] md:mb-[calc(var(--space-section-xl)-var(--space-6))]"
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
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-canvas from-30% via-canvas/90 via-55% to-canvas/90 to-85% md:to-transparent"
      />
      <div className="relative z-10 grid justify-items-start gap-[var(--space-4)] p-[var(--space-5)] md:max-w-[58%] md:p-[var(--space-6)]">
        <div className="grid gap-[var(--space-2)]">
          <h2
            className="text-[length:var(--text-subheading-size)] leading-snug font-bold text-text-strong"
            id="recommendation-feedback-heading"
          >
            {recommendationStrings.feedbackSummary.heading}
          </h2>
          <p className="text-[length:var(--font-size-14)] text-text-muted">
            {recommendationStrings.feedbackSummary.description}
          </p>
        </div>
        <dl className="m-0 flex gap-[var(--space-8)]">
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
          className={buttonClassName({
            className: "border-line bg-surface-1 px-[var(--space-4)] font-bold text-text",
            variant: "outline",
          })}
          preload={false}
          to="/taste"
        >
          {recommendationStrings.tasteSummary.link}
        </Link>
      </div>
    </section>
  );
}
