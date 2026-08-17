import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = Readonly<{
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}>;

export function SectionHeading({
  action,
  className,
  compact = false,
  description,
  id,
  title,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "flex min-w-0 items-end justify-between gap-[var(--space-4)]",
        compact ? "mb-[var(--space-2)]" : "mb-[var(--space-3)]",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-[var(--space-3)]">
        <span
          aria-hidden="true"
          className={cn(
            "mt-[3px] w-[var(--space-1)] shrink-0 rounded-[var(--radius-pill)] bg-accent",
            compact
              ? "h-[calc(var(--text-subheading-size)*1.3)]"
              : "h-[calc(var(--text-section-title-size)*1.3)]",
          )}
        />
        <div className="grid min-w-0 gap-[var(--space-content-tight)] md:flex md:items-baseline md:gap-[var(--space-4)]">
          <h2 className={cn(compact && "text-[length:var(--text-subheading-size)]")} id={id}>
            {title}
          </h2>
          {description === undefined ? null : (
            <p className="max-w-[var(--layout-width-reading)] text-[length:var(--text-caption-size)] text-text-muted">
              {description}
            </p>
          )}
        </div>
      </div>
      {action === undefined ? null : (
        <div className="flex shrink-0 items-center gap-[var(--space-content-tight)]">{action}</div>
      )}
    </header>
  );
}
