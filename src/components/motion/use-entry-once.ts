"use client";

import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type EntryOnceOptions = Readonly<{
  /** Share of the element that must be visible before it plays. */
  threshold?: number;
  /** Shrinks the viewport's bottom edge, so it plays once the element is well into view. */
  bottomInset?: string;
}>;

/**
 * A one-time entrance for an element below the fold. On attach the element gets
 * `data-entry="armed"` (CSS shows its starting pose) and switches to `data-entry="play"` the
 * first time it is in view. Nothing is set when motion is reduced, IntersectionObserver is
 * missing, or the element is already in view or not rendered, so the final state is the default and never
 * waits on script. Returns a callback ref.
 */
export function useEntryOnce<Element extends HTMLElement>({
  threshold = 0.35,
  bottomInset = "0px",
}: EntryOnceOptions = {}) {
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (element === null || typeof IntersectionObserver === "undefined") return;
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches
    ) {
      return;
    }
    const rect = element.getBoundingClientRect();
    // An element without a box (display: none) never comes into view, so it must not wait.
    if (rect.width === 0 && rect.height === 0) return;
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    element.setAttribute("data-entry", "armed");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        element.setAttribute("data-entry", "play");
      },
      { threshold, rootMargin: `0px 0px -${bottomInset} 0px` },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      // An entrance cut short by unmount must not leave content hidden.
      if (element.getAttribute("data-entry") === "armed") element.removeAttribute("data-entry");
    };
  }, [bottomInset, element, threshold]);

  return setElement;
}
