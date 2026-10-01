"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const DEFAULT_DURATION_MS = 600;

/**
 * Counts an integer up from 0 to `target` once (04 §6 E). Use it only for real counts, never for
 * Manga DNA values. Disabled or under reduced motion it returns `target` at once; callers keep
 * the final number in the accessible text.
 */
export function useCountUp(target: number, enabled: boolean, durationMs = DEFAULT_DURATION_MS) {
  const reducedMotion = useReducedMotion() === true;
  const animate = enabled && !reducedMotion && target > 0;
  const [value, setValue] = useState(animate ? 0 : target);

  useEffect(() => {
    if (!animate) return;
    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [animate, durationMs, target]);

  return animate ? value : target;
}
