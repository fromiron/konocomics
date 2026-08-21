import type { TasteExplanationSentence } from "@/domain/explanation/types";
import { cn } from "@/lib/utils";
import {
  BookOpenTextIcon,
  BrushIcon,
  Grid2X2Icon,
  MoonIcon,
  ShapesIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react";

const reasonIcons: Record<TasteExplanationSentence["group"], LucideIcon> = {
  art: BrushIcon,
  genre: Grid2X2Icon,
  narrative: BookOpenTextIcon,
  overall: SparklesIcon,
  theme: ShapesIcon,
  tone: MoonIcon,
};

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
          <p>{emptyText}</p>
        )
      ) : (
        <ul
          className={cn(
            "m-0 grid list-none gap-[var(--space-content)] p-0 md:grid-cols-3",
            presentation === "feature-cards" && "gap-[var(--space-3)]",
          )}
        >
          {reasons.slice(0, 3).map((reason) => {
            const Icon = reasonIcons[reason.group];
            return (
              <li
                className={cn(
                  "rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-3)]",
                  presentation === "feature-cards" &&
                    "grid min-h-32 content-start gap-[var(--space-3)] border-line-accent-subtle bg-surface-1",
                )}
                key={`${reason.source}:${reason.group}:${reason.factorId}`}
              >
                {presentation === "feature-cards" ? (
                  <span
                    aria-hidden="true"
                    className="grid size-[var(--control-min-size)] place-items-center rounded-[var(--radius-pill)] border border-line-accent-subtle bg-accent-soft text-accent"
                  >
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                ) : null}
                {reason.text}
              </li>
            );
          })}
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
