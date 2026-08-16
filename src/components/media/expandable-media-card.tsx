"use client";

import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
  type SyntheticEvent,
} from "react";

type ExpansionControls = Readonly<{
  expanded: boolean;
  onDetailsToggle(event: SyntheticEvent<HTMLDetailsElement>): void;
  onPreviewClick(event: MouseEvent<HTMLElement>): void;
}>;

type ExpandableMediaCardProps = Readonly<{
  articleRef: Ref<HTMLElement>;
  children(controls: ExpansionControls): ReactNode;
  onPreview?: () => void;
}>;

function usesTouchPresentation() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: none), (pointer: coarse)").matches
  );
}

export function ExpandableMediaCard({ articleRef, children, onPreview }: ExpandableMediaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hoverTimer = useRef<number | null>(null);
  const cancelHoverIntent = () => {
    if (hoverTimer.current === null) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  const collapseAfterFocusLeaves = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false);
  };

  useEffect(() => cancelHoverIntent, []);

  return (
    <article
      className="group/card w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1 p-0 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:data-[expanded]:border-accent [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:data-[expanded]:shadow-[var(--shadow-level-1)]"
      data-expanded={expanded || undefined}
      onBlurCapture={collapseAfterFocusLeaves}
      onFocusCapture={(event) => {
        if (
          !usesTouchPresentation() &&
          event.target instanceof HTMLElement &&
          event.target.matches(":focus-visible")
        ) {
          setExpanded(true);
        }
      }}
      onPointerEnter={() => {
        cancelHoverIntent();
        if (usesTouchPresentation()) return;
        hoverTimer.current = window.setTimeout(() => setExpanded(true), 200);
      }}
      onPointerLeave={(event) => {
        cancelHoverIntent();
        if (!event.currentTarget.contains(document.activeElement)) setExpanded(false);
      }}
      ref={articleRef}
      tabIndex={-1}
    >
      {children({
        expanded,
        onDetailsToggle: (event) => {
          if (usesTouchPresentation()) {
            if (event.currentTarget.open) event.currentTarget.open = false;
            setExpanded(false);
            return;
          }
          setExpanded(event.currentTarget.open);
        },
        onPreviewClick: (event) => {
          if (onPreview === undefined || !usesTouchPresentation()) return;
          event.preventDefault();
          setExpanded(false);
          onPreview();
        },
      })}
    </article>
  );
}
