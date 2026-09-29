import { Link } from "@tanstack/react-router";

import { recommendationStrings } from "@/lib/strings";

type FeedbackImpactSummaryProps = Readonly<{
  completedCount: number;
  hiddenCount: number;
}>;

const countLinkClassName =
  "inline-flex min-h-[var(--control-min-size)] items-center font-bold text-text underline underline-offset-4 tabular-nums hover:text-text-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function FeedbackImpactSummary({ completedCount, hiddenCount }: FeedbackImpactSummaryProps) {
  if (completedCount + hiddenCount === 0) {
    return null;
  }
  const strings = recommendationStrings.feedbackSummary;
  const counts = [
    ...(completedCount > 0
      ? [{ state: "completed" as const, label: strings.completed(completedCount) }]
      : []),
    ...(hiddenCount > 0 ? [{ state: "hidden" as const, label: strings.hidden(hiddenCount) }] : []),
  ];

  return (
    <section
      aria-labelledby="recommendation-feedback-heading"
      className="mt-[var(--space-shelf-group)] mb-[calc(var(--space-shelf-group)-var(--space-8))] border-t border-line pt-[var(--space-6)] md:mb-[calc(var(--space-shelf-group)-var(--space-6))]"
    >
      <h2
        className="text-[length:var(--text-subheading-size)] leading-snug font-bold text-text-strong"
        id="recommendation-feedback-heading"
      >
        {strings.heading}
      </h2>
      <div className="mt-[var(--space-1)] flex flex-wrap items-center gap-x-[var(--space-6)]">
        <p className="flex flex-wrap items-center text-[length:var(--font-size-14)] text-text-muted">
          {counts.map(({ label, state }, index) => (
            <span className="inline-flex items-center" key={state}>
              {index > 0 ? <span aria-hidden="true">・</span> : null}
              <Link
                aria-label={strings.openLibrary(label)}
                className={countLinkClassName}
                preload={false}
                search={{ state }}
                to="/library"
              >
                {label}
              </Link>
            </span>
          ))}
          <span>{strings.excluded}</span>
        </p>
        <Link
          className="inline-flex min-h-[var(--control-min-size)] items-center text-[length:var(--font-size-14)] font-bold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          preload={false}
          to="/taste"
        >
          {recommendationStrings.tasteSummary.link}
        </Link>
      </div>
    </section>
  );
}
