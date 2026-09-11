"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type ExpandableMediaCardProps = ComponentPropsWithoutRef<"article"> &
  Readonly<{
    expanded: boolean;
    onExpandedChange: (expanded: boolean) => void;
    panel: ReactNode;
  }>;

function supportsExpansion() {
  return (
    window.matchMedia?.("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches ??
    false
  );
}

export function ExpandableMediaCard({
  children,
  className,
  expanded,
  onExpandedChange,
  panel,
  style,
  ...props
}: ExpandableMediaCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scroll = useRef({ origin: 0, target: 0, last: 0, owned: false });
  const [geometry, setGeometry] = useState<{
    width: number;
    contentWidth: number;
    panelWidth: number;
  } | null>(null);
  const [side, setSide] = useState<"left" | "right">("right");

  const cancelHoverIntent = () => {
    if (hoverTimer.current !== null) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  const open = (card: HTMLElement) => {
    if (!supportsExpansion() || expanded) return;
    const track = card.closest<HTMLElement>("[data-media-shelf-track]");
    if (track?.hasAttribute("data-expansion-manual-scroll")) return;
    const previous = track?.querySelector<HTMLElement>('article[data-expanded="true"]');
    if (previous?.contains(document.activeElement)) return;
    const rect = card.getBoundingClientRect();
    const content = contentRef.current?.getBoundingClientRect() ?? rect;
    const bounds = track?.getBoundingClientRect();
    const trackStyle = track ? getComputedStyle(track) : null;
    const visibleLeft =
      (bounds?.left ?? 0) + (Number.parseFloat(trackStyle?.scrollPaddingLeft ?? "0") || 0);
    const visibleRight =
      (bounds?.right ?? window.innerWidth) -
      (Number.parseFloat(trackStyle?.scrollPaddingRight ?? "0") || 0);
    const panelWidth =
      Number.parseFloat(getComputedStyle(card).getPropertyValue("--control-min-size")) * 6;
    const right = visibleRight - rect.right;
    const left = rect.left - visibleLeft;
    if (geometry === null) {
      // Start at the used width; the responsive width can be larger before max-width clamps it.
      card.style.transitionProperty = "none";
      card.style.width = `${rect.width}px`;
      void card.offsetWidth;
      card.style.transitionProperty = "";
    }
    // Keep the next cover under the pointer while the previous card gives up its space.
    const previousBefore = Boolean(
      previous && previous.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING,
    );
    const opensLeft = previous ? previousBefore : right < panelWidth && left > right;
    const previousExpansion = previous
      ? Number.parseFloat(getComputedStyle(previous).getPropertyValue("--media-card-expansion")) ||
        0
      : 0;
    const currentExpansion =
      Number.parseFloat(getComputedStyle(card).getPropertyValue("--media-card-expansion")) || 0;
    const width = geometry?.width ?? rect.width;
    const finalLeft = rect.left - (previousBefore ? previousExpansion : 0);
    const origin = track?.scrollLeft ?? 0;
    const maximumScroll = track
      ? Math.max(
          0,
          track.scrollWidth - track.clientWidth + panelWidth - previousExpansion - currentExpansion,
        )
      : 0;
    // Keep the whole expanded card inside the shelf's unfaded area, including handoffs.
    const minimumVisibleScroll = origin + finalLeft + width + panelWidth - visibleRight;
    const maximumVisibleScroll = origin + finalLeft - visibleLeft;
    const preferredScroll = origin + (opensLeft && !previous ? panelWidth : 0);
    const target = Math.max(
      0,
      Math.min(
        maximumScroll,
        maximumVisibleScroll,
        Math.max(minimumVisibleScroll, preferredScroll),
      ),
    );
    setGeometry({
      width,
      contentWidth: geometry?.contentWidth ?? content.width,
      panelWidth,
    });
    scroll.current = {
      origin,
      target,
      last: origin,
      owned: true,
    };
    setSide(opensLeft ? "left" : "right");
    onExpandedChange(true);
  };
  const queueHover = (card: HTMLElement) => {
    cancelHoverIntent();
    hoverTimer.current = setTimeout(() => {
      hoverTimer.current = null;
      open(card);
    }, 200);
  };

  useEffect(() => () => cancelHoverIntent(), []);

  useEffect(() => {
    const card = cardRef.current;
    if (
      !expanded &&
      geometry !== null &&
      card &&
      Number.parseFloat(getComputedStyle(card).getPropertyValue("--media-card-expansion")) === 0
    ) {
      // A motion-free or zero-distance close has no transitionend event.
      const frame = requestAnimationFrame(() => setGeometry(null));
      return () => cancelAnimationFrame(frame);
    }
  }, [expanded, geometry]);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const track = card?.closest<HTMLElement>("[data-media-shelf-track]");
    const position = scroll.current;
    if (geometry == null) return;
    if (card == null || track == null || !position.owned) return;
    if (!expanded && track.querySelector('article[data-expanded="true"]')) {
      position.owned = false;
      return;
    }
    let frame = 0;
    const compensate = () => {
      const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
      if (Math.abs(track.scrollLeft - Math.min(maximum, position.last)) > 2) {
        position.owned = false;
        return;
      }
      const growth = card.getBoundingClientRect().width - geometry.width;
      const progress = Math.max(0, Math.min(1, growth / geometry.panelWidth));
      track.scrollTo({
        left: Math.min(maximum, position.origin + (position.target - position.origin) * progress),
        behavior: "instant",
      });
      position.last = track.scrollLeft;
      if (expanded ? progress < 1 : progress > 0) frame = requestAnimationFrame(compensate);
    };
    compensate();
    return () => cancelAnimationFrame(frame);
  }, [expanded, geometry, side]);

  useEffect(() => {
    const card = cardRef.current;
    const track = card?.closest<HTMLElement>("[data-media-shelf-track]");
    const dismiss = () => onExpandedChange(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (card?.querySelector("[data-expandable-panel]")?.contains(document.activeElement)) {
        contentRef.current?.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
      }
      dismiss();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !card?.contains(event.target)) dismiss();
    };
    const onResize = () => {
      if (card) card.style.transitionProperty = "none";
      track?.removeAttribute("data-expansion-manual-scroll");
      setGeometry(null);
      cancelHoverIntent();
      dismiss();
    };
    const releaseScroll = () => {
      scroll.current.owned = false;
    };
    const onWheel = () => {
      releaseScroll();
      cancelHoverIntent();
      track?.setAttribute("data-expansion-manual-scroll", "");
    };
    window.addEventListener("resize", onResize);
    if (expanded) {
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("pointerdown", onPointerDown);
      track?.addEventListener("wheel", onWheel, { passive: true });
      track?.addEventListener("pointerdown", releaseScroll);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      track?.removeEventListener("wheel", onWheel);
      track?.removeEventListener("pointerdown", releaseScroll);
    };
  }, [expanded, onExpandedChange]);

  return (
    <article
      {...props}
      className={cn(
        className,
        "relative overflow-hidden transition-[--media-card-expansion] duration-[var(--motion-duration-value)] ease-[var(--motion-ease-signature)] motion-reduce:transition-none",
      )}
      data-expanded={expanded || undefined}
      data-expansion-active={geometry !== null || undefined}
      data-expansion-side={side}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          cancelHoverIntent();
          onExpandedChange(false);
        }
      }}
      onFocusCapture={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget) &&
          event.target.matches(":focus-visible")
        ) {
          cancelHoverIntent();
          event.currentTarget
            .closest<HTMLElement>("[data-media-shelf-track]")
            ?.removeAttribute("data-expansion-manual-scroll");
          open(event.currentTarget);
        }
      }}
      onPointerEnter={(event) => {
        cancelHoverIntent();
        if (!supportsExpansion() || event.pointerType === "touch" || event.pointerType === "pen")
          return;
        queueHover(event.currentTarget);
      }}
      onPointerLeave={cancelHoverIntent}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || (!event.movementX && !event.movementY)) return;
        const track = event.currentTarget.closest<HTMLElement>("[data-media-shelf-track]");
        if (!track?.hasAttribute("data-expansion-manual-scroll")) return;
        track.removeAttribute("data-expansion-manual-scroll");
        queueHover(event.currentTarget);
      }}
      onTransitionEnd={(event) => {
        if (
          event.target === event.currentTarget &&
          event.propertyName === "--media-card-expansion" &&
          !expanded
        ) {
          setGeometry(null);
        }
      }}
      onTransitionCancel={(event) => {
        if (
          event.target === event.currentTarget &&
          event.nativeEvent.propertyName === "--media-card-expansion" &&
          !expanded &&
          Number.parseFloat(
            getComputedStyle(event.currentTarget).getPropertyValue("--media-card-expansion"),
          ) === 0
        ) {
          setGeometry(null);
        }
      }}
      ref={cardRef}
      style={{
        ...style,
        ...{ "--media-card-expansion": geometry && expanded ? geometry.panelWidth : 0 },
        width: geometry
          ? `calc(${geometry.width}px + var(--media-card-expansion) * 1px)`
          : undefined,
        minWidth: geometry ? 0 : undefined,
        maxWidth: geometry ? "none" : undefined,
      }}
    >
      <div
        className={cn("w-full", side === "left" && "ml-auto")}
        ref={contentRef}
        style={{
          width: geometry?.contentWidth,
        }}
      >
        {children}
      </div>
      <div
        aria-hidden={!expanded}
        className={cn(
          "absolute inset-y-0 w-[calc(var(--control-min-size)*6)] overflow-y-auto overscroll-contain bg-inherit p-[var(--space-3)]",
          !expanded && "invisible",
        )}
        data-expandable-panel
        inert={!expanded}
        style={
          side === "right" ? { left: geometry?.contentWidth } : { right: geometry?.contentWidth }
        }
      >
        {panel}
      </div>
    </article>
  );
}
