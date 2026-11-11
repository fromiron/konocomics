import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { useId, useState } from "react";

import { createRecommendationInputProjection } from "@/domain/recommendation/input-hash";
import type { RecommendationInput } from "@/domain/recommendation/types";
import { recommendationStrings } from "@/lib/strings";

type RecommendationCriteriaSummaryProps = Readonly<{
  recordCount: number;
  totalRecordCount: number;
  input?: RecommendationInput | null;
  adjustmentLabels?: readonly string[];
  preferenceLabels: readonly string[];
}>;

/**
 * One sentence on what the list is based on, with the Manga DNA link inline and the 「選び方の詳細」
 * disclosure at the end of the same line. The record ledger and the DNA adjustments open directly
 * below the sentence and start closed, so the first card is not pushed below the first screen
 * (03 §5 「추천 헤더」).
 */
export function RecommendationCriteriaSummary({
  adjustmentLabels = [],
  preferenceLabels,
  recordCount,
  totalRecordCount,
  input,
}: RecommendationCriteriaSummaryProps) {
  const detailsId = useId();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const projection = input == null ? null : createRecommendationInputProjection(input);
  const hasDetails = projection !== null || adjustmentLabels.length > 0;
  return (
    <section
      aria-label={recommendationStrings.criteria.heading}
      className="mb-[var(--space-3)] grid min-w-0 justify-items-start"
    >
      <div className="text-[length:var(--font-size-14)] leading-relaxed text-text-muted">
        <p className="inline">
          {preferenceLabels.length === 0
            ? recommendationStrings.criteria.basisWithoutPreferences(recordCount)
            : recommendationStrings.criteria.basis(recordCount, preferenceLabels.join("・"))}{" "}
          {/* Inline padding gives the link a 44px target without making its line taller. */}
          <Link
            className="py-[calc((var(--control-min-size)-1lh)/2)] font-bold whitespace-nowrap text-text underline underline-offset-4 hover:text-text-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            preload={false}
            to="/taste"
          >
            {recommendationStrings.criteria.dnaLink}
          </Link>
        </p>
        {hasDetails ? " " : null}
        {hasDetails ? (
          // The trigger ends the sentence's line after a plain space, so when it wraps it starts near
          // the text's edge; negative block margins keep its 44px target from making a line taller.
          <button
            aria-controls={detailsId}
            aria-expanded={detailsOpen}
            className="group/criteria -my-[calc((var(--control-min-size)-1lh)/2)] ml-[var(--space-1)] inline-flex min-h-[var(--control-min-size)] cursor-pointer items-center gap-[var(--space-1)] rounded-[var(--radius-control)] px-[var(--space-1)] font-bold whitespace-nowrap text-text hover:text-text-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            onClick={() => setDetailsOpen((open) => !open)}
            type="button"
          >
            <ChevronRightIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-text-muted group-aria-expanded/criteria:rotate-90"
            />
            {recommendationStrings.criteria.details}
          </button>
        ) : null}
      </div>
      {hasDetails ? (
        <div
          className="grid gap-[var(--space-1)] pt-[var(--space-2)]"
          hidden={!detailsOpen}
          id={detailsId}
        >
          {projection === null ? null : (
            <p className="text-[length:var(--text-caption-size)] leading-[var(--line-height-body)] text-text-muted">
              {recommendationStrings.criteria.counts(
                totalRecordCount,
                new Set(projection.negativeRecords.map((record) => record.workId)).size,
                new Set([
                  ...projection.anchors.map((anchor) => anchor.workId),
                  ...projection.eligibilityExclusions,
                ]).size,
              )}
            </p>
          )}
          {adjustmentLabels.length > 0 ? (
            <p className="text-[length:var(--font-size-14)] text-text-muted">
              {recommendationStrings.criteria.adjusted(adjustmentLabels.join("・"))}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
