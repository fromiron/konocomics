import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The speech bubble (吹き出し) around recommendation reasons (04 §2.9). The frame is static:
 * the tail and border are decoration and add nothing to the accessibility tree. Cautions keep
 * their own warn-bordered block and never use this bubble. Only the landing example opts into
 * paper grain and supplies a typed reason; this wrapper never animates operational reasons.
 *
 * `tail="top"` points up at the cover or title above. `tail="side"` is for panels that open
 * beside a cover: it points back at the cover, following the nearest `data-expansion-side`
 * (a panel opening to the right gets a left tail, and the reverse).
 */
export function ReasonBubble({
  children,
  className,
  tail = "top",
  paperGrain = false,
}: Readonly<{
  children: ReactNode;
  className?: string;
  tail?: "top" | "side";
  paperGrain?: boolean;
}>) {
  return (
    <div
      className={cn(
        "reason-bubble relative min-w-0 rounded-[var(--radius-card)] border border-line bg-surface-2 px-[var(--space-3)] py-[var(--space-2)]",
        tail === "top" && "mt-[6px]",
        paperGrain && "paper-grain",
        className,
      )}
      data-reason-bubble={tail}
    >
      <span
        aria-hidden="true"
        className={cn(
          "reason-bubble__tail pointer-events-none absolute size-2.5 rotate-45 bg-surface-2",
          tail === "top" && "-top-[6px] left-[var(--space-5)] border-t border-l border-line",
        )}
      />
      {children}
    </div>
  );
}
