import { useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

import { recommendationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

export const recommendationShelves = [
  "featured",
  "anchor",
  "discovery",
  "completed",
  "ranking",
] as const;

export type RecommendationShelf = (typeof recommendationShelves)[number];

type RecommendationShelfNavigationProps = Readonly<{
  availability: Readonly<Record<RecommendationShelf, boolean>>;
  disabled: boolean;
  introRef: RefObject<HTMLDivElement | null>;
  onSelect: (shelf: RecommendationShelf) => void;
}>;

export function RecommendationShelfNavigation({
  availability,
  disabled,
  introRef,
  onSelect,
}: RecommendationShelfNavigationProps) {
  const holderRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<RecommendationShelf | null>(null);
  const search = useRouterState({ select: (state) => state.location.searchStr });
  const shelves = useMemo(
    () => recommendationShelves.filter((key) => availability[key]),
    [availability],
  );

  useEffect(() => {
    const holder = holderRef.current;
    const navigation = navigationRef.current;
    const intro = introRef.current;
    if (holder === null || navigation === null || intro === null) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const style = getComputedStyle(holder);
      const navigationBottom = Number.parseFloat(style.top) + navigation.offsetHeight;
      const nextVisible =
        style.display !== "none" && intro.getBoundingClientRect().bottom <= navigationBottom;
      setVisible(nextVisible);
      if (!nextVisible) return;

      const scrollPadding =
        Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      let active = shelves[0] ?? null;
      for (const key of shelves) {
        const target = document.getElementById(`recommendation-shelf-${key}`);
        if (target === null) continue;
        const scrollMargin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        if (target.getBoundingClientRect().top <= scrollPadding + scrollMargin + 1) active = key;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) {
        active = shelves.at(-1) ?? active;
      }
      setCurrent(active);
    };
    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(intro);
    const main = holder.closest("main");
    if (main !== null) observer?.observe(main);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
    };
  }, [introRef, shelves]);

  if (shelves.length < 2) return null;

  return (
    <div
      className="sticky top-[var(--desktop-navigation-height)] z-40 hidden h-0 md:block"
      ref={holderRef}
    >
      <nav
        aria-hidden={!visible}
        aria-label={recommendationStrings.shelfNavigation.label}
        className={cn(
          "absolute inset-x-0 top-0 flex h-[var(--control-min-size)] gap-[var(--space-2)] overflow-x-auto bg-canvas [scrollbar-width:none]",
          !visible && "invisible",
        )}
        id="recommendation-navigation"
        inert={!visible}
        ref={navigationRef}
      >
        {shelves.map((key) => {
          const { navigationLabel, title } = recommendationStrings.shelves[key];
          const destination = new URLSearchParams(search);
          destination.set("shelf", key);
          return (
            <a
              aria-current={current === key ? "location" : undefined}
              aria-disabled={disabled || undefined}
              aria-label={recommendationStrings.shelfNavigation.accessibleLabel(
                navigationLabel,
                title,
              )}
              className="inline-flex min-h-[var(--control-min-size)] shrink-0 items-center border-b-2 border-transparent px-[var(--space-3)] text-[length:var(--font-size-14)] font-medium text-text-muted hover:text-text focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring aria-[current=location]:border-accent aria-[current=location]:font-bold aria-[current=location]:text-accent aria-disabled:cursor-not-allowed aria-disabled:opacity-45"
              href={`/recommendations?${destination.toString()}`}
              key={key}
              onClick={(event) => {
                if (disabled) {
                  event.preventDefault();
                  return;
                }
                if (
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                onSelect(key);
              }}
              tabIndex={disabled ? -1 : undefined}
            >
              {navigationLabel}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
