import { Fragment } from "react";

import type { Work } from "@/domain/catalog/types";
import type { TasteExplanationSentence } from "@/domain/explanation/types";
import { recommendationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { ReasonBubble } from "./reason-bubble";

type ReasonChipsProps = Readonly<{
  reasons: readonly TasteExplanationSentence[];
  caution?: TasteExplanationSentence;
  cautionLabel: string;
  emptyText?: string;
  className?: string;
  presentation?: "default" | "feature-cards";
}>;

export function ReasonChips({
  caution,
  cautionLabel,
  className,
  emptyText,
  presentation = "default",
  reasons,
}: ReasonChipsProps) {
  return (
    <div className={cn("grid gap-[var(--space-3)]", className)}>
      {reasons.length === 0 ? (
        emptyText === undefined ? null : (
          <p className="text-text-muted">{emptyText}</p>
        )
      ) : (
        <ReasonBubble>
          <ul
            className={cn(
              "m-0 grid list-none gap-[var(--space-content)] p-0",
              presentation === "feature-cards" && "gap-[var(--space-3)]",
            )}
          >
            {reasons.slice(0, 3).map((reason) => (
              <li
                className={cn(
                  "relative min-w-0 pl-[var(--space-4)] text-[length:var(--font-size-14)] leading-[var(--line-height-body)] text-text",
                  presentation === "feature-cards" && "text-[length:var(--font-size-16)]",
                )}
                key={`${reason.source}:${reason.group}:${reason.factorId}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-[0.72em] left-0 h-px w-[var(--space-2)] bg-text-muted"
                />
                {reason.text}
              </li>
            ))}
          </ul>
        </ReasonBubble>
      )}
      {caution === undefined ? null : (
        <div className="grid gap-[var(--space-content)] border-l-2 border-warn pl-[var(--space-3)]">
          <h3 className="text-[length:var(--font-size-14)] font-bold text-text-strong">
            {cautionLabel}
          </h3>
          <p className="text-[length:var(--font-size-14)] leading-[var(--line-height-body)] text-text-muted">
            {caution.text}
          </p>
        </div>
      )}
    </div>
  );
}

export function ConfidenceLabel({
  className,
  label,
  prefix,
}: Readonly<{ className?: string; label: string; prefix: string }>) {
  return (
    <p
      className={cn(
        "w-fit text-[length:var(--text-caption-size)] font-medium whitespace-nowrap text-text-muted",
        className,
      )}
    >
      {prefix}: {label}
    </p>
  );
}

/**
 * Publication status and volume count, known values only: an unknown status or an unconfirmed
 * volume count is missing data, never a signal, so it gets no words (03 §5). Renders nothing when
 * neither is known.
 */
export function KnownPublicationMeta({
  className,
  status,
  volumeCount,
}: Readonly<{ className?: string; status: Work["status"]; volumeCount?: number | null }>) {
  const labels = [
    ...(status === "unknown" ? [] : [recommendationStrings.workStatus[status]]),
    ...(volumeCount === undefined || volumeCount === null || volumeCount < 1
      ? []
      : [recommendationStrings.volumeCount(volumeCount)]),
  ];
  if (labels.length === 0) return null;
  return (
    <p className={className}>
      {labels.map((label, index) => (
        <Fragment key={label}>
          {index === 0 ? null : <span aria-hidden="true"> · </span>}
          {label}
        </Fragment>
      ))}
    </p>
  );
}
