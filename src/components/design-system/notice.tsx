import { CircleAlertIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type NoticeTone = "info" | "warn" | "danger";

/**
 * The tone decides the live role: an info note is static (`note`), a warning is announced
 * politely (`status`) and an error that needs action interrupts (`alert`).
 */
const NOTICE_ROLE = {
  info: "note",
  warn: "status",
  danger: "alert",
} as const satisfies Record<NoticeTone, string>;

const NOTICE_ICON = {
  info: InfoIcon,
  warn: TriangleAlertIcon,
  danger: CircleAlertIcon,
} as const satisfies Record<NoticeTone, unknown>;

const NOTICE_TONE_CLASSNAME = {
  info: "border-line text-text-muted [&>svg]:text-text-muted",
  warn: "border-warn text-text [&>svg]:text-warn",
  danger: "border-danger text-text-strong [&>svg]:text-danger",
} as const satisfies Record<NoticeTone, string>;

/**
 * The one inline notice box (04 §2.5): a left rule and a quiet surface, never colour alone — each
 * tone also has its own icon (04 §2.1). Pass `className="bg-canvas"` where the notice sits on a
 * raised surface, so it stays distinct from it.
 */
export function Notice({
  children,
  className,
  id,
  tone = "info",
}: Readonly<{
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: NoticeTone;
}>) {
  const Icon = NOTICE_ICON[tone];
  return (
    <div
      className={cn(
        "notice flex min-w-0 items-start gap-[var(--space-2)] rounded-r-[var(--radius-card)] border-l-[length:var(--space-1)] bg-surface-1 px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--font-size-14)] leading-[var(--line-height-body)] [overflow-wrap:anywhere] [&>svg]:mt-[calc((1lh-var(--space-4))/2)] [&>svg]:size-4 [&>svg]:shrink-0",
        NOTICE_TONE_CLASSNAME[tone],
        className,
      )}
      data-notice-tone={tone}
      id={id}
      role={NOTICE_ROLE[tone]}
    >
      <Icon aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
