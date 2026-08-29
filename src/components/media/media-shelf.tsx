import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { Button } from "@/components/design-system/button";
import { SectionHeading } from "@/components/layout/section-heading";
import { mediaStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type MediaShelfProps = Readonly<{
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  listType?: "ordered" | "unordered";
  trackClassName?: string;
  trackData?: Readonly<{
    [key: `data-${string}`]: string | boolean | undefined;
  }>;
  compactHeading?: boolean;
  controlsPlacement?: "heading" | "overlay";
  enableLoop?: boolean;
  onPageChange?: (firstVisibleIndex: number) => void;
}>;

type ScrollState = Readonly<{
  hasOverflow: boolean;
  canScrollBack: boolean;
  canScrollForward: boolean;
}>;

export const carouselLoopCopies = [0, 1, 2] as const;
export type CarouselLoopCopy = (typeof carouselLoopCopies)[number];

const initialScrollState: ScrollState = {
  hasOverflow: false,
  canScrollBack: false,
  canScrollForward: false,
};

const focusableCardTarget =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const overlayDesktop = "[@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]";

export function carouselCloneProps(copy: CarouselLoopCopy) {
  if (copy === 1) {
    return { "data-carousel-copy": copy } as const;
  }
  return {
    "aria-hidden": true,
    "data-carousel-clone": "",
    "data-carousel-copy": copy,
    inert: true,
  } as const;
}

export function shouldLoopCarousel(count: number) {
  return count > 1;
}

export function cloneCarouselTrailing(trailing: ReactNode, copy: CarouselLoopCopy) {
  if (trailing == null || trailing === false) return null;
  if (copy === 1) return trailing;
  if (!isValidElement(trailing)) return trailing;
  const className =
    typeof trailing.props === "object" &&
    trailing.props !== null &&
    "className" in trailing.props &&
    typeof trailing.props.className === "string"
      ? trailing.props.className
      : undefined;
  return cloneElement(trailing as ReactElement<{ className?: string }>, {
    key: `trailing-${String(copy)}`,
    className: cn(className, "invisible pointer-events-none"),
    ...carouselCloneProps(copy),
  });
}

export function duplicateCarouselContent(content: ReactNode, copy: CarouselLoopCopy) {
  if (copy === 1 || !isValidElement(content)) return content;
  return cloneElement(content as ReactElement<Record<string, unknown>>, {
    articleRef: undefined,
    onCoverSettled: undefined,
    priority: false,
  });
}

type LoopMetrics = Readonly<{
  copy1Scroll: number;
  copy2Offset: number;
  periodFromCopy0: number;
  periodFromCopy2: number;
}>;

function getLoopMetrics(track: HTMLElement): LoopMetrics | null {
  const copy0 = track.querySelector<HTMLElement>("[data-carousel-copy='0']");
  const copy1 = track.querySelector<HTMLElement>("[data-carousel-copy='1']");
  const copy2 = track.querySelector<HTMLElement>("[data-carousel-copy='2']");
  if (copy0 === null || copy1 === null || copy2 === null) return null;
  const periodFromCopy0 = copy1.offsetLeft - copy0.offsetLeft;
  const periodFromCopy2 = copy2.offsetLeft - copy1.offsetLeft;
  if (periodFromCopy0 <= 1 || periodFromCopy2 <= 1) return null;
  return {
    copy1Scroll: copy1.offsetLeft - copy0.offsetLeft,
    copy2Offset: copy2.offsetLeft,
    periodFromCopy0,
    periodFromCopy2,
  };
}

function jumpScroll(track: HTMLElement, left: number) {
  track.style.scrollBehavior = "auto";
  track.style.scrollSnapType = "none";
  track.scrollLeft = left;
  window.setTimeout(() => {
    track.style.scrollBehavior = "";
    track.style.scrollSnapType = "";
  }, 32);
}

function wrapLoopedTrack(track: HTMLElement, wrappingRef: { current: boolean }) {
  if (wrappingRef.current) return;
  const metrics = getLoopMetrics(track);
  if (metrics === null) return;
  const left = track.scrollLeft;
  if (left < metrics.copy1Scroll - 1) {
    wrappingRef.current = true;
    jumpScroll(track, left + metrics.periodFromCopy0);
    wrappingRef.current = false;
    return;
  }
  if (left >= metrics.copy2Offset) {
    wrappingRef.current = true;
    jumpScroll(track, left - metrics.periodFromCopy2);
    wrappingRef.current = false;
  }
}

function loopPageItems(track: HTMLElement) {
  return Array.from(track.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement &&
      element.hasAttribute("data-carousel-copy") &&
      !element.classList.contains("invisible"),
  );
}

function loopOrigin(track: HTMLElement) {
  const copy0 = track.querySelector<HTMLElement>("[data-carousel-copy='0']");
  return copy0?.offsetLeft ?? 0;
}

function scrollLoopPage(track: HTMLElement, direction: -1 | 1) {
  const origin = loopOrigin(track);
  const items = loopPageItems(track);
  if (items.length === 0) {
    track.scrollBy({ left: direction * track.clientWidth });
    return;
  }
  const destination = track.scrollLeft + direction * track.clientWidth;
  const target =
    direction === 1
      ? items.find((item) => item.offsetLeft - origin >= destination - 1)
      : [...items].reverse().find((item) => item.offsetLeft - origin <= destination + 1);
  if (target === undefined) {
    track.scrollBy({ left: direction * track.clientWidth });
    return;
  }
  const reducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  track.scrollTo({
    left: target.offsetLeft - origin,
    behavior: reducedMotion ? "auto" : "smooth",
  });
}

function loopOverlayChildren(children: ReactNode) {
  const items = Children.toArray(children);
  if (!shouldLoopCarousel(items.length)) return children;
  return carouselLoopCopies.flatMap((copy) =>
    items.map((child, index) => {
      if (!isValidElement(child)) return child;
      return cloneElement(child as ReactElement<Record<string, unknown>>, {
        key: `carousel-${String(copy)}-${String(child.key ?? index)}`,
        ...carouselCloneProps(copy),
      });
    }),
  );
}

export function MediaShelf({
  action,
  children,
  className,
  compactHeading = false,
  controlsPlacement = "heading",
  enableLoop = true,
  description,
  listType,
  onPageChange,
  title,
  trackClassName: customTrackClassName,
  trackData,
}: MediaShelfProps) {
  const headingId = useId();
  const trackRef = useRef<HTMLElement | null>(null);
  const wrappingRef = useRef(false);
  const [scrollState, setScrollState] = useState(initialScrollState);
  const loopingChildren =
    controlsPlacement === "overlay" && enableLoop ? loopOverlayChildren(children) : children;
  const loopSignatureRef = useRef<string | null>(null);
  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (track === null) return;

    const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
    const looping = getLoopMetrics(track) !== null;
    const next = {
      hasOverflow: looping || maximum > 1,
      canScrollBack: looping || track.scrollLeft > 1,
      canScrollForward: looping || track.scrollLeft < maximum - 1,
    };
    setScrollState((current) =>
      current.hasOverflow === next.hasOverflow &&
      current.canScrollBack === next.canScrollBack &&
      current.canScrollForward === next.canScrollForward
        ? current
        : next,
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (track === null) return;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    const settleLoop = () => {
      if (settleTimer !== undefined) {
        clearTimeout(settleTimer);
        settleTimer = undefined;
      }
      wrapLoopedTrack(track, wrappingRef);
      updateScrollState();
    };
    const onScroll = () => {
      updateScrollState();
      if (settleTimer !== undefined) clearTimeout(settleTimer);
      settleTimer = setTimeout(settleLoop, 400);
    };

    updateScrollState();
    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("scrollend", settleLoop);

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            if (settleTimer !== undefined) {
              updateScrollState();
              return;
            }
            wrapLoopedTrack(track, wrappingRef);
            updateScrollState();
          });
    observer?.observe(track);
    for (const child of track.children) observer?.observe(child);

    return () => {
      if (settleTimer !== undefined) clearTimeout(settleTimer);
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("scrollend", settleLoop);
      observer?.disconnect();
    };
  }, [children, updateScrollState]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (track === null) return;
    const metrics = getLoopMetrics(track);
    if (metrics === null) {
      loopSignatureRef.current = null;
      return;
    }
    const signature = Array.from(track.querySelectorAll<HTMLElement>("[data-carousel-copy='1']"))
      .map(
        (node) =>
          node.getAttribute("data-recommendation-work-id") ??
          node.querySelector("a")?.getAttribute("href") ??
          "",
      )
      .join("|");
    if (loopSignatureRef.current === signature) return;
    loopSignatureRef.current = signature;
    wrappingRef.current = true;
    jumpScroll(track, metrics.copy1Scroll);
    wrappingRef.current = false;
    updateScrollState();
  }, [children, updateScrollState]);

  if (Children.count(children) === 0) return null;

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (track === null) return;
    const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
    const targetLeft = Math.min(
      maximum,
      Math.max(0, track.scrollLeft + direction * track.clientWidth),
    );
    const cards = Array.from(track.children).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && !element.hasAttribute("data-carousel-clone"),
    );
    const firstVisibleIndex = cards.findIndex(
      (card) => card.offsetLeft + card.offsetWidth > targetLeft + 1,
    );
    onPageChange?.(firstVisibleIndex < 0 ? Math.max(0, cards.length - 1) : firstVisibleIndex);
    if (getLoopMetrics(track) === null) {
      track.scrollBy({ left: direction * track.clientWidth });
      return;
    }
    scrollLoopPage(track, direction);
  };
  const moveCardFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.defaultPrevented || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const cards = Array.from(event.currentTarget.children).filter(
      (element) => !element.hasAttribute("data-carousel-clone"),
    );
    const currentIndex = cards.findIndex((card) => card.contains(target));
    if (currentIndex < 0) return;

    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextCard = cards[(currentIndex + direction + cards.length) % cards.length];
    const nextTarget = nextCard?.querySelector<HTMLElement>(focusableCardTarget);
    if (nextTarget === undefined || nextTarget === null) return;

    event.preventDefault();
    nextTarget.focus({ preventScroll: true });
    nextTarget.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  };
  const overlayGutterClassName =
    controlsPlacement === "overlay"
      ? `${overlayDesktop}:px-[var(--media-shelf-edge-fade-width)] ${overlayDesktop}:scroll-px-[var(--media-shelf-edge-fade-width)]`
      : undefined;
  const trackClassName = cn(
    "flex snap-x gap-[var(--space-content-loose)] overflow-x-auto overscroll-x-contain scroll-smooth pb-[var(--space-3)] [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden",
    controlsPlacement === "overlay" && enableLoop ? "snap-proximity" : "snap-mandatory",
  );
  const setTrack = (node: HTMLElement | null) => {
    trackRef.current = node;
  };
  const track =
    listType === "ordered" ? (
      <ol
        {...trackData}
        aria-label={title}
        className={cn(
          trackClassName,
          "m-0 list-none p-0",
          customTrackClassName,
          overlayGutterClassName,
        )}
        data-media-shelf-track
        data-overflow={scrollState.hasOverflow || undefined}
        onKeyDown={moveCardFocus}
        ref={setTrack}
        role="list"
      >
        {loopingChildren}
      </ol>
    ) : listType === "unordered" ? (
      <ul
        {...trackData}
        aria-label={title}
        className={cn(
          trackClassName,
          "m-0 list-none p-0",
          customTrackClassName,
          overlayGutterClassName,
        )}
        data-media-shelf-track
        data-overflow={scrollState.hasOverflow || undefined}
        onKeyDown={moveCardFocus}
        ref={setTrack}
        role="list"
      >
        {loopingChildren}
      </ul>
    ) : (
      <div
        {...trackData}
        aria-label={title}
        className={cn(trackClassName, customTrackClassName, overlayGutterClassName)}
        data-media-shelf-track
        data-overflow={scrollState.hasOverflow || undefined}
        onKeyDown={moveCardFocus}
        ref={setTrack}
      >
        {loopingChildren}
      </div>
    );
  const scrollButton = (direction: -1 | 1) => (
    <Button
      aria-label={direction === -1 ? mediaStrings.previous(title) : mediaStrings.next(title)}
      className={
        controlsPlacement === "overlay"
          ? "pointer-events-auto rounded-[var(--radius-pill)] border-line bg-surface-overlay shadow-[var(--shadow-level-1)]"
          : undefined
      }
      disabled={direction === -1 ? !scrollState.canScrollBack : !scrollState.canScrollForward}
      onClick={() => move(direction)}
      size="icon"
      type="button"
      variant="outline"
    >
      {direction === -1 ? (
        <ChevronLeftIcon aria-hidden="true" />
      ) : (
        <ChevronRightIcon aria-hidden="true" />
      )}
    </Button>
  );

  return (
    <section aria-labelledby={headingId} className={cn("relative min-w-0", className)}>
      <SectionHeading
        action={
          <>
            {action}
            {scrollState.hasOverflow && controlsPlacement === "heading" ? (
              <span className="hidden gap-[var(--space-content-tight)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:flex">
                {scrollButton(-1)}
                {scrollButton(1)}
              </span>
            ) : null}
          </>
        }
        compact={compactHeading}
        description={description}
        id={headingId}
        title={title}
      />
      {controlsPlacement === "overlay" ? (
        <div className="relative [--media-shelf-edge-fade-width:clamp(3.52rem,11.52%,6.4rem)]">
          {track}
          {scrollState.hasOverflow ? (
            <span className="pointer-events-none absolute inset-0 z-30 hidden [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:block">
              <span
                aria-hidden="true"
                className="media-shelf-edge-fade media-shelf-edge-fade--start absolute inset-y-0 left-0"
              />
              <span
                aria-hidden="true"
                className="media-shelf-edge-fade media-shelf-edge-fade--end absolute inset-y-0 right-0"
              />
              <span className="absolute top-1/2 -left-[var(--space-6)] z-10 -translate-y-1/2">
                {scrollButton(-1)}
              </span>
              <span className="absolute top-1/2 -right-[var(--space-6)] z-10 -translate-y-1/2">
                {scrollButton(1)}
              </span>
            </span>
          ) : null}
        </div>
      ) : (
        track
      )}
    </section>
  );
}
