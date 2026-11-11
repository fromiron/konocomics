"use client";

import { useCallback, useState, type PointerEvent } from "react";

/** Track class for a shelf of expand cards: snapping would fight an opening card's scroll. */
export const EXPAND_SHELF_TRACK_CLASSNAME = "has-[[data-expansion-active]]:!snap-none";

/**
 * The page-level rules every shelf of `ExpandableMediaCard`s shares (04 §2.10): one open card on
 * the page, closed when the pointer leaves its shelf (unless focus is inside it) and when the shelf
 * pages. Spread `boundaryProps` on an element around the shelf, pass `close` as its
 * `onPageChange`, and give each card `cardProps(key)` with a key unique on the page.
 */
export function useExpandShelf() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const close = useCallback(() => setOpenKey(null), []);
  const cardProps = (key: string) => ({
    expanded: openKey === key,
    onExpandedChange: (expanded: boolean) =>
      setOpenKey((current) => (expanded ? key : current === key ? null : current)),
  });
  const boundaryProps = {
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(document.activeElement)) close();
    },
  };
  return { boundaryProps, cardProps, close };
}
