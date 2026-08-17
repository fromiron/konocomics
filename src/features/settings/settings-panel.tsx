import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SettingsPanelTone = "default" | "accent" | "danger";

type SettingsPanelProps = Omit<ComponentPropsWithoutRef<"section">, "title"> &
  Readonly<{
    description?: ReactNode;
    headingId: string;
    icon?: LucideIcon;
    title: ReactNode;
    tone?: SettingsPanelTone;
  }>;

const toneClassNames: Record<SettingsPanelTone, string> = {
  default: "border-line bg-surface-1",
  accent: "border-line-accent-subtle bg-surface-1",
  danger: "border-line-danger bg-surface-danger-soft",
};

export function SettingsPanel({
  children,
  className,
  description,
  headingId,
  icon: Icon,
  title,
  tone = "default",
  ...props
}: SettingsPanelProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "grid min-w-0 content-start gap-[var(--space-4)] rounded-[var(--radius-card)] border p-[var(--space-4)] md:p-[var(--space-5)]",
        toneClassNames[tone],
        className,
      )}
      {...props}
    >
      <header className="flex min-w-0 items-start gap-[var(--space-3)]">
        {Icon === undefined ? null : (
          <span
            aria-hidden="true"
            className={cn(
              "mt-[var(--space-1)] flex size-[var(--control-min-size)] shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-line-accent-subtle bg-accent-soft text-accent",
              tone === "danger" && "border-line-danger bg-surface-danger-soft text-danger",
            )}
          >
            <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
          </span>
        )}
        <div className="grid min-w-0 gap-[var(--space-content)]">
          <h2 className="[overflow-wrap:anywhere] text-text-strong" id={headingId}>
            {title}
          </h2>
          {description === undefined ? null : (
            <p className="text-text-muted [overflow-wrap:anywhere]">{description}</p>
          )}
        </div>
      </header>
      {children}
    </section>
  );
}
