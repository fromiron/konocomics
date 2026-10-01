"use client";

import { useEffect, useState } from "react";

/**
 * Pointer reactions (04 §6 G, React Bits GlareHover·SpotlightCard·Magnet as reference; no
 * angle change). Pointer position is written to CSS variables inside one rAF per frame; React never
 * re-renders on movement. Effects run only for a fine hovering mouse without reduced motion, so
 * touch, pen, keyboard, and reduced-motion users see the plain surface.
 */

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const MAGNET_MAX_X_PX = 10;
const MAGNET_MAX_Y_PX = 6;

function pointerEffectsAllowed() {
  try {
    return (
      window.matchMedia(FINE_POINTER_QUERY).matches &&
      !window.matchMedia(REDUCED_MOTION_QUERY).matches
    );
  } catch {
    return false;
  }
}

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}

type PointerEffect = "light" | "magnet";

/**
 * - `light`: move a glare or spotlight with the pointer (`--light-x/y`).
 * - `magnet`: pull slightly toward the pointer (`--magnet-x/y`).
 * The element gets `data-pointer-active` while a pointer is over it. Returns a callback ref, so
 * an element that appears later (for example a CTA shown after a reveal) is still wired.
 */
export function usePointerEffect<Element extends HTMLElement>(effect: PointerEffect) {
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (element === null || typeof window.matchMedia !== "function") return;

    let frame = 0;
    let pending: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      const event = pending;
      pending = null;
      if (event === null) return;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      if (effect === "magnet") {
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        element.style.setProperty("--magnet-x", `${String(clamp(dx * 0.14, MAGNET_MAX_X_PX))}px`);
        element.style.setProperty("--magnet-y", `${String(clamp(dy * 0.22, MAGNET_MAX_Y_PX))}px`);
        return;
      }
      element.style.setProperty("--light-x", `${String(px * 100)}%`);
      element.style.setProperty("--light-y", `${String(py * 100)}%`);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !pointerEffectsAllowed()) return;
      element.dataset.pointerActive = "";
      pending = event;
      if (frame === 0) frame = window.requestAnimationFrame(apply);
    };

    const onLeave = () => {
      pending = null;
      if (frame !== 0) window.cancelAnimationFrame(frame);
      frame = 0;
      delete element.dataset.pointerActive;
      for (const name of ["--magnet-x", "--magnet-y"]) {
        element.style.removeProperty(name);
      }
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, [effect, element]);

  return setElement;
}
