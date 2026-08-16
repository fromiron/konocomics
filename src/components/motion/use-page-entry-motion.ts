"use client";

import { type AnimationEvent, useCallback, useLayoutEffect, useRef, useState } from "react";

const PAGE_ENTRY_ANIMATION_NAME = "page-entry-b-enter";

type PageEntryMotionOptions = Readonly<{
  enabled: boolean;
  identity: string;
}>;

type PageEntryMotionOwner = Readonly<{
  active: boolean;
  onAnimationEnd(event: AnimationEvent<HTMLElement>): void;
}>;

export function usePageEntryMotion({
  enabled,
  identity,
}: PageEntryMotionOptions): PageEntryMotionOwner {
  const [active, setActive] = useState(false);
  const ownershipRef = useRef({ consumed: false, identity });
  const consume = useCallback(() => {
    ownershipRef.current.consumed = true;
    setActive(false);
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect -- B is a pre-paint progressive enhancement that must fail closed before it can animate. */
  useLayoutEffect(() => {
    if (ownershipRef.current.identity !== identity) {
      ownershipRef.current = { consumed: false, identity };
    }

    if (!enabled || ownershipRef.current.consumed) {
      consume();
      return;
    }

    let mediaQuery: MediaQueryList;
    let handleChange: ((event: MediaQueryListEvent) => void) | undefined;
    try {
      if (typeof window.matchMedia !== "function") {
        consume();
        return;
      }

      mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (
        mediaQuery.matches !== false ||
        typeof mediaQuery.addEventListener !== "function" ||
        typeof mediaQuery.removeEventListener !== "function"
      ) {
        consume();
        return;
      }

      handleChange = (event) => {
        if (event.matches) consume();
      };
      mediaQuery.addEventListener("change", handleChange);
      if (mediaQuery.matches !== false) {
        mediaQuery.removeEventListener("change", handleChange);
        consume();
        return;
      }
      setActive(true);
    } catch {
      consume();
      return;
    }

    return () => {
      if (handleChange === undefined) return;
      try {
        mediaQuery.removeEventListener("change", handleChange);
      } catch {
        // Ownership is local and already fail-closed; listener cleanup remains best effort.
      }
    };
  }, [consume, enabled, identity]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const onAnimationEnd = useCallback(
    (event: AnimationEvent<HTMLElement>) => {
      if (event.animationName === PAGE_ENTRY_ANIMATION_NAME) consume();
    },
    [consume],
  );

  return { active, onAnimationEnd };
}
