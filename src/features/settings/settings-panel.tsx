import { CircleAlertIcon } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SettingsPanelProps = Omit<ComponentPropsWithoutRef<"section">, "title"> &
  Readonly<{
    description?: ReactNode;
    headingId: string;
    /** Decorative mark shown before the title. */
    icon?: ReactNode;
    title: ReactNode;
    tone?: "default" | "danger";
  }>;

/** One settings card. Its id is the scroll target of the section navigation. */
export function SettingsPanel({
  children,
  className,
  description,
  headingId,
  icon,
  title,
  tone = "default",
  ...props
}: SettingsPanelProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "grid min-w-0 scroll-mt-[calc(var(--control-min-size)+var(--space-6))] content-start gap-[var(--space-5)] rounded-[var(--radius-card)] border p-[var(--space-5)] md:scroll-mt-[calc(var(--desktop-navigation-height)+var(--space-6))] md:p-[var(--space-6)]",
        tone === "danger"
          ? "border-line-danger bg-surface-danger-soft"
          : "border-line bg-surface-1",
        className,
      )}
      {...props}
    >
      <div className="grid min-w-0 gap-[var(--space-content)]">
        <h2
          className={cn(
            "flex min-w-0 items-center gap-[var(--space-content)] text-[length:var(--text-subheading-size)] leading-snug [overflow-wrap:anywhere]",
            tone === "danger" ? "text-danger" : "text-text-strong",
          )}
          id={headingId}
        >
          {icon}
          {title}
        </h2>
        {description === undefined ? null : (
          <p className="text-[length:var(--font-size-14)] text-text-muted [overflow-wrap:anywhere]">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

type SettingsRowProps = Readonly<{
  /** Control placed at the end of the row (stacked under the text on narrow screens). */
  action?: ReactNode;
  /** Full-width content under the row, such as feedback or a preview. */
  children?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
  /** A status line rather than a heading, when the row has nothing to navigate to. */
  titleAs?: "h3" | "p";
}>;

/** A titled row inside a settings card, separated from the previous row by a rule. */
export function SettingsRow({
  action,
  children,
  description,
  title,
  titleAs: Title = "h3",
}: SettingsRowProps) {
  return (
    <div className="grid min-w-0 gap-[var(--space-4)] border-t border-line pt-[var(--space-5)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="grid min-w-0 gap-[var(--space-content-tight)]">
        <Title className="text-[length:var(--font-size-16)] font-bold text-text-strong">
          {title}
        </Title>
        {description === undefined ? null : (
          <div className="grid gap-[var(--space-content-tight)] text-[length:var(--font-size-14)] text-text-muted [overflow-wrap:anywhere]">
            {description}
          </div>
        )}
      </div>
      {action === undefined ? null : (
        <div className="flex flex-col gap-[var(--space-content)] sm:flex-row sm:items-center">
          {action}
        </div>
      )}
      {children === undefined ? null : (
        <div className="grid min-w-0 gap-[var(--space-3)] empty:hidden sm:col-span-2">
          {children}
        </div>
      )}
    </div>
  );
}

/** Inline feedback under a row. `role` makes errors interrupt and progress stay polite. */
export function SettingsNotice({
  children,
  tone,
}: Readonly<{ children: ReactNode; tone: "error" | "progress" }>) {
  return (
    <p
      className={cn(
        "flex min-w-0 items-start gap-[var(--space-content)] [overflow-wrap:anywhere]",
        tone === "error"
          ? "rounded-[var(--radius-control)] border border-line-danger bg-surface-danger-soft px-[var(--space-4)] py-[var(--space-3)] text-text-strong"
          : "text-[length:var(--text-caption-size)] text-text-muted",
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      {tone === "error" ? (
        <CircleAlertIcon
          aria-hidden="true"
          className="mt-[var(--space-content-tight)] size-[var(--space-4)] shrink-0 text-danger"
        />
      ) : null}
      <span className="min-w-0">{children}</span>
    </p>
  );
}
