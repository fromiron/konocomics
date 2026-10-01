"use client";

import { useEffect, useRef, useState } from "react";

const STAMP_MS = 260;

/**
 * True for a moment after `confirmed` turns from false to true, never on mount. Callers pass
 * state that only flips after the choice is actually saved, so the stamp marks success only.
 */
export function useConfirmStamp(confirmed: boolean) {
  const previous = useRef(confirmed);
  const [stamping, setStamping] = useState(false);

  useEffect(() => {
    const turnedOn = confirmed && !previous.current;
    previous.current = confirmed;
    if (!turnedOn) return;
    setStamping(true);
    const timer = window.setTimeout(() => setStamping(false), STAMP_MS);
    return () => window.clearTimeout(timer);
  }, [confirmed]);

  return stamping && confirmed;
}
