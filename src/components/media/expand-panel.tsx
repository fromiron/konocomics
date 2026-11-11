import type { ReactNode } from "react";

import { ReasonBubble } from "@/components/media/reason-bubble";

type DataAttributes = Readonly<{ [key: `data-${string}`]: string | boolean | undefined }>;

export type ExpandPanelProps = Readonly<{
  /** The reason, set in a bubble whose tail points back at the cover. */
  reason: ReactNode;
  /** Data attributes for the caller's own hooks on the reason paragraph. */
  reasonData?: DataAttributes;
  /** Two muted lines under the reason, ending in an ellipsis when the text runs on. */
  caption?: string;
  actions: ReactNode;
}>;

/**
 * The reason in its paper bubble (04 §2.9). An expand panel points the tail back at the cover
 * beside it; the slot-form Quick Preview shows the same words with the tail up at its header.
 */
export function PanelReason({
  children,
  reasonData,
  tail = "top",
}: Readonly<{ children: ReactNode; reasonData?: DataAttributes; tail?: "top" | "side" }>) {
  return (
    <ReasonBubble tail={tail}>
      <p
        className="text-[length:var(--font-size-14)] leading-[var(--line-height-body)] text-text"
        {...reasonData}
      >
        {children}
      </p>
    </ReasonBubble>
  );
}

/**
 * The panel an `ExpandableMediaCard` opens beside its cover: the reason bubble and an optional
 * caption scroll together, and the action row stays at the bottom. The caption is clamped to two
 * lines, which fit under a three-line reason in the shortest card, so it ends in an ellipsis
 * instead of being cut off; its one column never grows past the panel (03 §5 「Anchor 옆 패널」).
 * The caller supplies the evidence.
 */
export function ExpandPanel({ actions, caption, reason, reasonData }: ExpandPanelProps) {
  return (
    <div className="flex h-full flex-col gap-[var(--space-2)]">
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] content-start gap-[var(--space-2)] overflow-y-auto overscroll-contain">
        <PanelReason reasonData={reasonData} tail="side">
          {reason}
        </PanelReason>
        {caption ? (
          <p
            className="line-clamp-2 text-[length:var(--text-caption-size)] leading-[var(--line-height-body)] [overflow-wrap:anywhere] text-text-muted"
            data-expand-caption
          >
            {caption}
          </p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}
