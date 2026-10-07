import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Accent text link used for the actions of a summary section. */
export const summaryLinkClassName =
  "inline-flex min-h-[var(--control-min-size)] items-center text-[length:var(--font-size-14)] font-bold text-accent-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

type SummarySectionProps = Readonly<{
  headingId: string;
  title: string;
  /** Usually one short line of muted text. */
  children: ReactNode;
  /** Links rendered after the body on the same wrapping row. */
  actions?: ReactNode;
  className?: string;
}>;

/**
 * An image-free, one-line closing summary (heading, body, links) that replaces decorative
 * banners across screens.
 */
export function SummarySection({
  actions,
  children,
  className,
  headingId,
  title,
}: SummarySectionProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "mt-[var(--space-shelf-group)] border-t border-line pt-[var(--space-6)]",
        className,
      )}
    >
      <h2
        className="text-[length:var(--text-subheading-size)] leading-snug font-bold text-text-strong"
        id={headingId}
      >
        {title}
      </h2>
      <div className="mt-[var(--space-1)] flex flex-wrap items-center gap-x-[var(--space-6)]">
        {children}
        {actions}
      </div>
    </section>
  );
}
