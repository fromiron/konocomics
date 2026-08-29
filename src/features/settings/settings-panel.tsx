import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SettingsPanelProps = Omit<ComponentPropsWithoutRef<"section">, "title"> &
  Readonly<{
    description?: ReactNode;
    headingId: string;
    title: ReactNode;
  }>;

export function SettingsPanel({
  children,
  className,
  description,
  headingId,
  title,
  ...props
}: SettingsPanelProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={cn("grid min-w-0 content-start gap-[var(--space-4)]", className)}
      {...props}
    >
      <div className="grid min-w-0 gap-[var(--space-content)]">
        <h2 className="[overflow-wrap:anywhere] text-text-strong" id={headingId}>
          {title}
        </h2>
        {description === undefined ? null : (
          <p className="text-text-muted [overflow-wrap:anywhere]">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
