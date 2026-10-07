import { useEffect, useState, type FocusEvent } from "react";

import { cn } from "@/lib/utils";

const DURATION_MS = 5000;
/** Longer window so an action such as 「元に戻す」 stays reachable. */
const ACTION_DURATION_MS = 8000;

/** Bottom-right toast surface shared by pages that report saved actions. */
export const snackbarClassName =
  "fixed right-[var(--layout-page-padding)] bottom-[calc(var(--layout-mobile-navigation-clearance)+var(--space-4))] z-40 max-w-[min(calc(var(--layout-width-form)/2),calc(100vw-(var(--layout-page-padding)*2)))] rounded-[var(--radius-card)] border-l-[length:var(--space-content-tight)] border-l-accent bg-surface-1 px-[var(--space-4)] py-[var(--space-3)] font-bold shadow-[var(--shadow-raised)] empty:hidden md:bottom-[var(--space-6)]";

export type SnackbarNotice = Readonly<{
  /** Changes on every notice so repeated text is announced again. */
  id: number;
  text: string;
  tone: "status" | "error";
  action?: Readonly<{ label: string; onAction(): void }>;
}>;

/**
 * One polite live region that replaces its notice in place instead of reflowing the page.
 * Status notices dismiss themselves; the timer pauses while the pointer or focus is inside.
 */
export function Snackbar({
  notice,
  onDismiss,
}: Readonly<{ notice: SnackbarNotice | undefined; onDismiss(id: number): void }>) {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (notice === undefined || notice.tone === "error" || held) return;
    const timer = window.setTimeout(
      () => onDismiss(notice.id),
      notice.action === undefined ? DURATION_MS : ACTION_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [held, notice, onDismiss]);

  const release = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false);
  };

  return (
    <div
      aria-atomic="true"
      className={cn(
        snackbarClassName,
        // An action shares the line with its sentence instead of wrapping it.
        notice?.action !== undefined &&
          "max-w-[min(var(--layout-width-form),calc(100vw-(var(--layout-page-padding)*2)))]",
        notice?.tone === "error" && "border-l-warn",
      )}
      data-slot="snackbar"
      onBlur={release}
      onFocus={() => setHeld(true)}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      role="status"
    >
      {notice === undefined ? null : (
        <span className="flex items-center gap-x-[var(--space-4)]" key={notice.id}>
          <span>{notice.text}</span>
          {notice.action === undefined ? null : (
            <button
              className="-my-[var(--space-2)] inline-flex min-h-[var(--control-min-size)] shrink-0 items-center rounded-[var(--radius-control)] px-[var(--space-2)] text-accent-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              onClick={notice.action.onAction}
              type="button"
            >
              {notice.action.label}
            </button>
          )}
        </span>
      )}
    </div>
  );
}
