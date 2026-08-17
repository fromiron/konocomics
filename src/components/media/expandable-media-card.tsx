"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";

type ExpansionSide = "left" | "right";

type VisualRect = Readonly<{
  height: number;
  left: number;
  top: number;
  width: number;
}>;

type PositionSnapshot = Readonly<{
  element: HTMLElement;
  rect: VisualRect;
}>;

type MotionTiming = Readonly<{
  duration: number;
  easing: string;
}>;

type ExpansionContext = Readonly<{
  collapsedWidth: number;
  coverRect: VisualRect | null;
  item: HTMLElement;
  originScrollLeft: number;
  side: ExpansionSide;
  track: HTMLElement;
}>;

type ExpansionControls = Readonly<{
  expanded: boolean;
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

function measureCover(card: HTMLElement): VisualRect | null {
  const frame = card.querySelector<HTMLElement>("[data-expandable-cover-frame]");
  if (frame === null) return null;
  const rect = frame.getBoundingClientRect();
  return { height: rect.height, left: rect.left, top: rect.top, width: rect.width };
}

function measurePositionParts(card: HTMLElement): PositionSnapshot[] {
  return Array.from(card.querySelectorAll<HTMLElement>("[data-expandable-position-part]")).flatMap(
    (element) => {
      const rect = element.getBoundingClientRect();
      return rect.width <= 0 || rect.height <= 0
        ? []
        : [
            {
              element,
              rect: {
                height: rect.height,
                left: rect.left,
                top: rect.top,
                width: rect.width,
              },
            },
          ];
    },
  );
}

function measureSiblingPositions(item: HTMLElement, track: HTMLElement): PositionSnapshot[] {
  if (track.dataset.recommendationMotion === "enabled") return [];
  return Array.from(track.children).flatMap((element) => {
    if (!(element instanceof HTMLElement) || element === item) return [];
    const rect = element.getBoundingClientRect();
    return rect.width <= 0 || rect.height <= 0
      ? []
      : [
          {
            element,
            rect: {
              height: rect.height,
              left: rect.left,
              top: rect.top,
              width: rect.width,
            },
          },
        ];
  });
}

function readDuration(value: string) {
  const normalized = value.trim();
  if (normalized.endsWith("ms")) return Number.parseFloat(normalized);
  if (normalized.endsWith("s")) return Number.parseFloat(normalized) * 1000;
  return Number.NaN;
}

function readMotionTiming(
  card: HTMLElement,
  durationToken: string,
  easingToken: string,
  fallback: MotionTiming,
): MotionTiming {
  const styles = window.getComputedStyle(card);
  const duration = readDuration(styles.getPropertyValue(durationToken));
  const easing = styles.getPropertyValue(easingToken).trim();
  return {
    duration: Number.isFinite(duration) ? duration : fallback.duration,
    easing: easing === "" ? fallback.easing : easing,
  };
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function setScrollLeftInstant(track: HTMLElement, left: number) {
  const previous = track.style.scrollBehavior;
  track.style.scrollBehavior = "auto";
  track.scrollLeft = left;
  if (previous === "") track.style.removeProperty("scroll-behavior");
  else track.style.scrollBehavior = previous;
}

function restoreOwnedScroll(context: ExpansionContext | null, adjustedScrollLeft: number | null) {
  if (
    context?.side !== "left" ||
    adjustedScrollLeft === null ||
    Math.abs(context.track.scrollLeft - adjustedScrollLeft) > 2
  ) {
    return;
  }
  const maximum = Math.max(0, context.track.scrollWidth - context.track.clientWidth);
  setScrollLeftInstant(context.track, Math.min(maximum, context.originScrollLeft));
}

function anotherExpandedCardOwnsFocus(card: HTMLElement) {
  const track = card.closest<HTMLElement>("[data-media-shelf-track]");
  const activeElement = document.activeElement;
  if (track === null || !(activeElement instanceof HTMLElement)) return false;

  return Array.from(track.querySelectorAll<HTMLElement>('article[data-expanded="true"]')).some(
    (candidate) => candidate !== card && candidate.contains(activeElement),
  );
}

function animateCover(card: HTMLElement, from: VisualRect | null) {
  const frame = card.querySelector<HTMLElement>("[data-expandable-cover-frame]");
  if (
    frame === null ||
    from === null ||
    typeof frame.animate !== "function" ||
    prefersReducedMotion()
  ) {
    return null;
  }

  const to = frame.getBoundingClientRect();
  if (to.width <= 0 || to.height <= 0) return null;
  const deltaX = from.left - to.left;
  const deltaY = from.top - to.top;
  const scaleX = from.width / to.width;
  const scaleY = from.height / to.height;
  const timing = readMotionTiming(card, "--motion-duration-value", "--motion-ease-signature", {
    duration: 240,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
  });

  return frame.animate(
    [
      {
        transform: `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`,
        transformOrigin: "top left",
      },
      { transform: "none", transformOrigin: "top left" },
    ],
    timing,
  );
}

function animateArticleWidth(card: HTMLElement, fromWidth: number) {
  if (typeof card.animate !== "function" || prefersReducedMotion()) return null;
  const toWidth = card.getBoundingClientRect().width;
  if (fromWidth <= 0 || toWidth <= 0 || Math.abs(fromWidth - toWidth) < 0.5) return null;
  const timing = readMotionTiming(card, "--motion-duration-value", "--motion-ease-signature", {
    duration: 240,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
  });

  return card.animate([{ width: `${fromWidth}px` }, { width: `${toWidth}px` }], timing);
}

function animatePositionSnapshots(
  card: HTMLElement,
  snapshots: readonly PositionSnapshot[],
): Animation[] {
  if (prefersReducedMotion()) return [];
  const timing = readMotionTiming(card, "--motion-duration-value", "--motion-ease-signature", {
    duration: 240,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
  });

  return snapshots.flatMap(({ element, rect: from }) => {
    if (!element.isConnected || typeof element.animate !== "function") return [];
    const to = element.getBoundingClientRect();
    if (to.width <= 0 || to.height <= 0) return [];
    const deltaX = element.dataset.expandablePositionAxis === "block" ? 0 : from.left - to.left;
    const deltaY = from.top - to.top;
    if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return [];
    return [
      element.animate(
        [{ transform: `translate(${deltaX}px, ${deltaY}px)` }, { transform: "none" }],
        timing,
      ),
    ];
  });
}

function animateExpandedReveal(card: HTMLElement, side: ExpansionSide): Animation[] {
  if (prefersReducedMotion()) return [];
  const timing = readMotionTiming(card, "--motion-duration-page", "--motion-ease-direct", {
    duration: 160,
    easing: "ease-out",
  });
  const offset = side === "right" ? -6 : 6;

  return Array.from(card.querySelectorAll<HTMLElement>("[data-expandable-reveal]")).flatMap(
    (element) => {
      if (typeof element.animate !== "function") return [];
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return [];
      return [
        element.animate(
          [
            { opacity: 0, transform: `translateX(${offset}px)` },
            { opacity: 1, transform: "none" },
          ],
          { ...timing, delay: 80, fill: "backwards" },
        ),
      ];
    },
  );
}

function chooseExpansionSide(card: HTMLElement): {
  context: ExpansionContext | null;
  side: ExpansionSide;
} {
  const item = card.closest<HTMLElement>("li");
  const track = item?.closest<HTMLElement>("[data-media-shelf-track]");
  if (item === null || item === undefined || track === null || track === undefined) {
    return { context: null, side: "right" };
  }

  const itemRect = item.getBoundingClientRect();
  const trackRect = track.getBoundingClientRect();
  const controlSize = Number.parseFloat(
    window.getComputedStyle(card).getPropertyValue("--control-min-size"),
  );
  const expandedWidth = Number.isFinite(controlSize) ? controlSize * 8 : itemRect.width;
  const growth = Math.max(0, expandedWidth - itemRect.width);
  const availableLeft = Math.max(0, itemRect.left - trackRect.left);
  const availableRight = Math.max(0, trackRect.right - itemRect.right);
  const side = availableRight >= growth || availableRight >= availableLeft ? "right" : "left";

  return {
    context: {
      collapsedWidth: itemRect.width,
      coverRect: measureCover(card),
      item,
      originScrollLeft: track.scrollLeft,
      side,
      track,
    },
    side,
  };
}

export function ExpandableMediaCard({ articleRef, children, onPreview }: ExpandableMediaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [expansionSide, setExpansionSide] = useState<ExpansionSide>("right");
  const collapseCoverRect = useRef<VisualRect | null>(null);
  const coverAnimation = useRef<Animation | null>(null);
  const spatialAnimations = useRef<Animation[]>([]);
  const expansionContext = useRef<ExpansionContext | null>(null);
  const positionSnapshots = useRef<PositionSnapshot[]>([]);
  const siblingSnapshots = useRef<PositionSnapshot[]>([]);
  const adjustedScrollLeft = useRef<number | null>(null);
  const hoverTimer = useRef<number | null>(null);
  const cancelHoverIntent = () => {
    if (hoverTimer.current === null) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };

  const expandCard = (card: HTMLElement) => {
    if (card.dataset.expanded === "true") return;
    const next = chooseExpansionSide(card);
    collapseCoverRect.current = null;
    expansionContext.current = next.context;
    adjustedScrollLeft.current = null;
    positionSnapshots.current = measurePositionParts(card);
    siblingSnapshots.current =
      next.context === null ? [] : measureSiblingPositions(next.context.item, next.context.track);
    setExpansionSide(next.side);
    setExpanded(true);
  };

  const collapseCard = (card: HTMLElement) => {
    if (card.dataset.expanded !== "true") return;
    collapseCoverRect.current = measureCover(card);
    positionSnapshots.current = measurePositionParts(card);
    const context = expansionContext.current;
    siblingSnapshots.current =
      context === null ? [] : measureSiblingPositions(context.item, context.track);
    setExpanded(false);
  };

  const collapseAfterFocusLeaves = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) collapseCard(event.currentTarget);
  };

  useEffect(
    () => () => {
      cancelHoverIntent();
      coverAnimation.current?.cancel();
      spatialAnimations.current.forEach((animation) => animation.cancel());
      restoreOwnedScroll(expansionContext.current, adjustedScrollLeft.current);
    },
    [],
  );

  useLayoutEffect(() => {
    const context = expansionContext.current;
    if (context === null) return;

    if (expanded) {
      if (context.side === "left") {
        const growth = Math.max(0, context.item.offsetWidth - context.collapsedWidth);
        const maximum = Math.max(0, context.track.scrollWidth - context.track.clientWidth);
        const nextScrollLeft = Math.min(maximum, context.originScrollLeft + growth);
        setScrollLeftInstant(context.track, nextScrollLeft);
        adjustedScrollLeft.current = nextScrollLeft;
      }
      spatialAnimations.current.forEach((animation) => animation.cancel());
      coverAnimation.current?.cancel();
      const card = context.item.querySelector<HTMLElement>("article") ?? context.item;
      coverAnimation.current = animateCover(card, context.coverRect);
      spatialAnimations.current = [
        animateArticleWidth(card, context.collapsedWidth),
        ...animatePositionSnapshots(card, positionSnapshots.current),
        ...animatePositionSnapshots(card, siblingSnapshots.current),
        ...animateExpandedReveal(card, context.side),
      ].filter((animation): animation is Animation => animation !== null);
      positionSnapshots.current = [];
      siblingSnapshots.current = [];
      return;
    }

    restoreOwnedScroll(context, adjustedScrollLeft.current);
    spatialAnimations.current.forEach((animation) => animation.cancel());
    coverAnimation.current?.cancel();
    const card = context.item.querySelector<HTMLElement>("article") ?? context.item;
    coverAnimation.current = animateCover(card, collapseCoverRect.current);
    spatialAnimations.current = [
      ...animatePositionSnapshots(card, positionSnapshots.current),
      ...animatePositionSnapshots(card, siblingSnapshots.current),
    ];
    collapseCoverRect.current = null;
    positionSnapshots.current = [];
    siblingSnapshots.current = [];
    adjustedScrollLeft.current = null;
    expansionContext.current = null;
  }, [expanded]);

  return (
    <article
      className="group/card relative isolate w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-1 p-0 [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:h-full [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:data-[expanded]:border-accent [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:data-[expanded]:shadow-[var(--shadow-level-1)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:data-[expansion-side=left]:ml-auto"
      data-expanded={expanded || undefined}
      data-expansion-side={expanded ? expansionSide : undefined}
      onBlurCapture={collapseAfterFocusLeaves}
      onFocusCapture={(event) => {
        if (
          !usesTouchPresentation() &&
          event.target instanceof HTMLElement &&
          event.target.matches(":focus-visible")
        ) {
          expandCard(event.currentTarget);
        }
      }}
      onPointerEnter={(event) => {
        cancelHoverIntent();
        if (usesTouchPresentation()) return;
        const card = event.currentTarget;
        hoverTimer.current = window.setTimeout(() => {
          if (!anotherExpandedCardOwnsFocus(card)) expandCard(card);
        }, 200);
      }}
      onPointerLeave={(event) => {
        cancelHoverIntent();
        if (!event.currentTarget.contains(document.activeElement))
          collapseCard(event.currentTarget);
      }}
      ref={articleRef}
      tabIndex={-1}
    >
      {children({
        expanded,
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
