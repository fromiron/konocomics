import type { TasteExplanationSentence } from "@/domain/explanation/types";
import { cn } from "@/lib/utils";

type ReasonChipsProps = Readonly<{
  reasons: readonly TasteExplanationSentence[];
  caution?: TasteExplanationSentence;
  cautionLabel: string;
  emptyText?: string;
  className?: string;
}>;

export function ReasonChips({
  caution,
  cautionLabel,
  className,
  emptyText,
  reasons,
}: ReasonChipsProps) {
  return (
    <div className={cn("grid gap-[var(--space-3)]", className)}>
      {reasons.length === 0 ? (
        emptyText === undefined ? null : (
          <p>{emptyText}</p>
        )
      ) : (
        <ul className="m-0 grid list-none gap-[var(--space-content)] p-0 md:grid-cols-3">
          {reasons.slice(0, 3).map((reason) => (
            <li
              className="rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-3)]"
              key={`${reason.source}:${reason.group}:${reason.factorId}`}
            >
              {reason.text}
            </li>
          ))}
        </ul>
      )}
      {caution === undefined ? null : (
        <div className="grid gap-[var(--space-content)] border-l-[length:var(--space-1)] border-warn bg-surface-danger-soft p-[var(--space-3)]">
          <h3 className="text-[length:var(--font-size-14)]">{cautionLabel}</h3>
          <p>{caution.text}</p>
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
        "w-fit rounded-[var(--radius-pill)] bg-accent-soft px-[var(--space-3)] py-[var(--space-content-tight)] text-[length:var(--text-caption-size)] font-bold whitespace-nowrap text-accent",
        className,
      )}
    >
      {prefix}: {label}
    </p>
  );
}
