import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = Readonly<{
  id: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
  /** Use 3 when the shelf sits inside another titled section. */
  headingLevel?: 2 | 3;
}>;

export function SectionHeading({
  action,
  className,
  compact = false,
  description,
  headingLevel = 2,
  id,
  title,
}: SectionHeadingProps) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <header
      className={cn(
        "flex min-w-0 items-end justify-between gap-[var(--space-4)]",
        compact ? "mb-[var(--space-2)]" : "mb-[var(--space-4)]",
        className,
      )}
    >
      <div className="grid min-w-0 gap-[var(--space-content-tight)]">
        <Heading
          className={cn(
            "tracking-tight text-text-strong",
            headingLevel === 3
              ? "text-[length:var(--font-size-16)]"
              : compact
                ? "text-[length:var(--text-subheading-size)]"
                : "text-[length:var(--text-section-title-size)]",
          )}
          id={id}
        >
          {title}
        </Heading>
        {description === undefined ? null : (
          <p className="max-w-[var(--layout-width-reading)] text-[length:var(--font-size-14)] leading-[var(--line-height-body)] text-text-muted">
            {description}
          </p>
        )}
      </div>
      {action === undefined ? null : (
        <div className="flex shrink-0 items-center gap-[var(--space-content-tight)]">{action}</div>
      )}
    </header>
  );
}
