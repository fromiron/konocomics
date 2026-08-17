import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Children,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { Button } from "@/components/design-system/button";
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
}>;

type ScrollState = Readonly<{
  hasOverflow: boolean;
  canScrollBack: boolean;
  canScrollForward: boolean;
}>;

const initialScrollState: ScrollState = {
  hasOverflow: false,
  canScrollBack: false,
  canScrollForward: false,
};

const focusableCardTarget =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MediaShelf({
  action,
  children,
  className,
  description,
  listType,
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
    const next = {
      hasOverflow: maximum > 1,
      canScrollBack: track.scrollLeft > 1,
      canScrollForward: track.scrollLeft < maximum - 1,
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

  if (Children.count(children) === 0) return null;

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (track === null) return;
    track.scrollBy({ left: direction * track.clientWidth });
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
    const nextCard = cards[(currentIndex + direction + cards.length) % cards.length];
    const nextTarget = nextCard?.querySelector<HTMLElement>(focusableCardTarget);
    if (nextTarget === undefined || nextTarget === null) return;

    event.preventDefault();
    nextTarget.focus({ preventScroll: true });
    nextTarget.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  };
  const trackClassName =
    "flex snap-x snap-mandatory gap-[var(--space-content-loose)] overflow-x-auto overscroll-x-contain scroll-smooth pb-[var(--space-3)] [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden";
  const setTrack = (node: HTMLElement | null) => {
    trackRef.current = node;
  };
  const track =
    listType === "ordered" ? (
      <ol
        {...trackData}
        aria-label={title}
        className={cn(trackClassName, "m-0 list-none p-0", customTrackClassName)}
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
        data-overflow={scrollState.hasOverflow || undefined}
        onKeyDown={moveCardFocus}
        ref={setTrack}
      >
        {children}
      </div>
    );

  return (
    <section aria-labelledby={headingId} className={cn("min-w-0", className)}>
      <header className="mb-[var(--space-3)] flex items-end justify-between gap-[var(--space-4)]">
        <div className="grid gap-[var(--space-content-tight)]">
          <h2 id={headingId}>{title}</h2>
          {description === undefined ? null : <p className="text-text-muted">{description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-[var(--space-content-tight)]">
          {action}
          {scrollState.hasOverflow ? (
            <span className="hidden gap-[var(--space-content-tight)] [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:flex">
              <Button
                aria-label={mediaStrings.previous(title)}
                disabled={!scrollState.canScrollBack}
                onClick={() => move(-1)}
                size="icon"
                type="button"
                variant="outline"
              >
                <ChevronLeftIcon aria-hidden="true" />
              </Button>
              <Button
                aria-label={mediaStrings.next(title)}
                disabled={!scrollState.canScrollForward}
                onClick={() => move(1)}
                size="icon"
                type="button"
                variant="outline"
              >
                <ChevronRightIcon aria-hidden="true" />
              </Button>
            </span>
          ) : null}
        </div>
      </header>
      {track}
    </section>
  );
}
