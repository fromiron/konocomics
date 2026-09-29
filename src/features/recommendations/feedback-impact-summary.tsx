import { Link } from "@tanstack/react-router";

import { SummarySection, summaryLinkClassName } from "@/components/layout/summary-section";
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
    <SummarySection
      actions={
        <Link className={summaryLinkClassName} preload={false} to="/taste">
          {recommendationStrings.tasteSummary.link}
        </Link>
      }
      className="mb-[calc(var(--space-shelf-group)-var(--space-8))] md:mb-[calc(var(--space-shelf-group)-var(--space-6))]"
      headingId="recommendation-feedback-heading"
      title={strings.heading}
    >
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
    </SummarySection>
  );
}
