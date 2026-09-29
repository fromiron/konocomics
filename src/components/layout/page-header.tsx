import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = Readonly<{
  title: string;
  /** Screen-reader description; the visible context belongs in `children`. */
  description?: string;
  /** One-line basis or context rendered under the title. */
  children?: ReactNode;
  /** Primary page action shown on the title row. */
  action?: ReactNode;
  headingId?: string;
  /** Lets flows move focus to the heading (for example after a dialog closes). */
  headingFocusable?: boolean;
  className?: string;
}>;

/** The page title block shared by every product screen, following `/recommendations`. */
export function PageHeader({
  action,
  children,
  className,
  description,
  headingFocusable = false,
  headingId,
  title,
}: PageHeaderProps) {
  return (
    <header className={cn("grid min-w-0 gap-[var(--space-1)]", className)}>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-[var(--space-4)] gap-y-[var(--space-2)]">
        <h1
          className="font-display text-[length:var(--font-size-28)] text-text-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          id={headingId}
          tabIndex={headingFocusable ? -1 : undefined}
        >
          {title}
        </h1>
        {action}
      </div>
      {description === undefined ? null : <p className="sr-only">{description}</p>}
      {children}
    </header>
  );
}
