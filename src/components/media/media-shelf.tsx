import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Children,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
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
  /** Omit the visual heading when a parent section already supplies its context. */
  hideHeading?: boolean;
  headingLevel?: 2 | 3;
  controlsPlacement?: "heading" | "overlay";
  onPageChange?: (firstVisibleIndex: number) => void;
}>;

type ScrollState = Readonly<{
  hasOverflow: boolean;
  canScrollBack: boolean;
  canScrollForward: boolean;
  first: number;
  last: number;
  total: number;
}>;

const initialScrollState: ScrollState = {
  hasOverflow: false,
  canScrollBack: false,
  canScrollForward: false,
  first: 0,
  last: 0,
  total: 0,
};

/** Scroll padding that bleeds the track under the edge fades; cards align inside it. */
function trackInset(track: HTMLElement) {
  const style = getComputedStyle(track);
  return {
    start: parseFloat(style.scrollPaddingLeft) || 0,
    end: parseFloat(style.scrollPaddingRight) || 0,
  };
}

const focusableCardTarget =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MediaShelf({
  action,
  children,
  className,
  compactHeading = false,
  hideHeading = false,
  headingLevel = 2,
  controlsPlacement = "heading",
  description,
  listType,
  onPageChange,
  title,
  trackClassName: customTrackClassName,
  trackData,
}: MediaShelfProps) {
  const headingId = useId();
  const trackRef = useRef<HTMLElement | null>(null);
  const [scrollState, setScrollState] = useState(initialScrollState);
  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (track === null) return;

    const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
    const cards = Array.from(track.children);
    const bounds = track.getBoundingClientRect();
    const { start, end } = trackInset(track);
    // Cards peeking into the faded inset are not counted as shown.
    const visible = cards.flatMap((card, index) => {
      const rect = card.getBoundingClientRect();
      return rect.right > bounds.left + start + 1 && rect.left < bounds.right - end - 1
        ? [index + 1]
        : [];
    });
    const next = {
      hasOverflow: maximum > 1,
      canScrollBack: track.scrollLeft > 1,
      canScrollForward: track.scrollLeft < maximum - 1,
      first: visible[0] ?? (cards.length > 0 ? 1 : 0),
      last: visible.at(-1) ?? cards.length,
      total: cards.length,
    };
    setScrollState((current) =>
      current.hasOverflow === next.hasOverflow &&
      current.canScrollBack === next.canScrollBack &&
      current.canScrollForward === next.canScrollForward &&
      current.first === next.first &&
      current.last === next.last &&
      current.total === next.total
        ? current
        : next,
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (track === null) return;
    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateScrollState);
    observer?.observe(track);
    for (const child of track.children) observer?.observe(child);
    return () => {
      track.removeEventListener("scroll", updateScrollState);
      observer?.disconnect();
    };
  }, [children, updateScrollState]);

  useLayoutEffect(updateScrollState, [children, updateScrollState]);

  if (Children.count(children) === 0) return null;

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (track === null) return;
    const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
    const { start, end } = trackInset(track);
    const page = Math.max(0, track.clientWidth - start - end);
    const targetLeft = Math.min(maximum, Math.max(0, track.scrollLeft + direction * page));
    const cards = Array.from(track.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement,
    );
    const firstVisibleIndex = cards.findIndex(
      (card) => card.offsetLeft - start + card.offsetWidth > targetLeft + 1,
    );
    onPageChange?.(firstVisibleIndex < 0 ? Math.max(0, cards.length - 1) : firstVisibleIndex);
    track.scrollBy({ left: direction * page });
  };
  const moveCardFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.defaultPrevented || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const cards = Array.from(event.currentTarget.children);
    const currentIndex = cards.findIndex((card) => card.contains(target));
    if (currentIndex < 0) return;

    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= cards.length) return;
    const nextCard = cards[nextIndex];
    const nextTarget = nextCard?.querySelector<HTMLElement>(focusableCardTarget);
    if (nextTarget === undefined || nextTarget === null) return;

    event.preventDefault();
    nextTarget.focus({ preventScroll: true });
    nextTarget.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  };
  const trackClassName = cn(
    "flex snap-x gap-[var(--space-content-loose)] overflow-x-auto overscroll-x-contain scroll-smooth pb-[var(--space-3)] [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden",
    "snap-mandatory",
  );
  const setTrack = (node: HTMLElement | null) => {
    trackRef.current = node;
  };
  const track =
    listType === "ordered" ? (
      <ol
        {...trackData}
        aria-label={title}
        className={cn(trackClassName, "m-0 list-none p-0", customTrackClassName)}
        data-media-shelf-track
        data-overflow={scrollState.hasOverflow || undefined}
        onKeyDown={moveCardFocus}
        ref={setTrack}
        role="list"
      >
        {children}
      </ol>
    ) : listType === "unordered" ? (
      <ul
        {...trackData}
        aria-label={title}
        className={cn(trackClassName, "m-0 list-none p-0", customTrackClassName)}
        data-media-shelf-track
        data-overflow={scrollState.hasOverflow || undefined}
        onKeyDown={moveCardFocus}
        ref={setTrack}
        role="list"
      >
        {children}
      </ul>
    ) : (
      <div
        {...trackData}
        aria-label={title}
        className={cn(trackClassName, customTrackClassName)}
        data-media-shelf-track
        data-overflow={scrollState.hasOverflow || undefined}
        onKeyDown={moveCardFocus}
        ref={setTrack}
      >
        {children}
      </div>
    );
  const scrollButton = (direction: -1 | 1) => (
    <Button
      aria-label={direction === -1 ? mediaStrings.previous(title) : mediaStrings.next(title)}
      className={
        controlsPlacement === "overlay"
          ? "pointer-events-auto rounded-[var(--radius-pill)] border-line bg-surface-overlay"
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

  const hasHeadingControls = scrollState.hasOverflow && controlsPlacement === "heading";
  const headingAction = (
    <>
      {action}
      {hasHeadingControls ? (
        <span className="hidden gap-[var(--space-content-tight)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:flex">
          {scrollButton(-1)}
          {scrollButton(1)}
        </span>
      ) : null}
    </>
  );

  return (
    <section
      aria-label={hideHeading ? title : undefined}
      aria-labelledby={hideHeading ? undefined : headingId}
      className={cn("relative min-w-0", className)}
    >
      {hideHeading ? (
        action != null || hasHeadingControls ? (
          <div className="mb-[var(--space-2)] flex justify-end">{headingAction}</div>
        ) : null
      ) : (
        <SectionHeading
          action={headingAction}
          compact={compactHeading}
          description={description}
          headingLevel={headingLevel}
          id={headingId}
          title={title}
        />
      )}
      {/* A position only means something when the shelf can scroll past what is shown. */}
      {scrollState.hasOverflow ? (
        <p
          className="mb-[var(--space-2)] text-[length:var(--text-caption-size)] text-text-muted"
          aria-live="polite"
          aria-atomic="true"
        >
          {mediaStrings.shelfPosition(scrollState.first, scrollState.last, scrollState.total)}
        </p>
      ) : null}
      {controlsPlacement === "overlay" ? (
        <div className="media-shelf-overlay relative">
          {track}
          {scrollState.hasOverflow ? (
            <span className="pointer-events-none absolute inset-0 z-30 hidden [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:block">
              <span
                aria-hidden="true"
                className={cn(
                  "media-shelf-edge-fade media-shelf-edge-fade--start absolute inset-y-0 left-0",
                  !scrollState.canScrollBack && "hidden",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "media-shelf-edge-fade media-shelf-edge-fade--end absolute inset-y-0 right-0",
                  !scrollState.canScrollForward && "hidden",
                )}
              />
              <span className="media-shelf-overlay__control--start absolute top-1/2 left-0 z-10 -translate-y-1/2">
                {scrollButton(-1)}
              </span>
              <span className="media-shelf-overlay__control--end absolute top-1/2 right-0 z-10 -translate-y-1/2">
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
