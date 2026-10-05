"use client";

import { useEffect, useState } from "react";

const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

/** Every element whose keyframes follow the scroll; mirrors the subject list in globals.css. */
const SUBJECTS = [
  ".hh-spread",
  ".hh-spread > .hh-page",
  ".home-scramble__stage",
  ".home-story__scene",
  ".home-story__scene-body",
  ".home-story__index li",
  ".home-story__number",
  ".home-story__covers > li",
  ".home-story__bars > li",
  ".home-story__card",
  ".home-story__tint",
  ".home-wheel__stage",
  ".home-bloom__item",
].join(", ");

type RangeName = "cover" | "contain" | "entry" | "exit";

/** One end of a view timeline range, such as `entry 45%`. */
export type RangePoint = Readonly<{ name: RangeName; fraction: number }>;
export type ScrollRange = readonly [RangePoint, RangePoint];

const RANGE_PATTERN =
  /^\s*(cover|contain|entry|exit)\s+(-?[\d.]+)%\s+(cover|contain|entry|exit)\s+(-?[\d.]+)%\s*$/;

/** Parses a two-point range such as `entry 45% contain 62%`; anything else is null. */
export function parseScrollRange(value: string): ScrollRange | null {
  const match = RANGE_PATTERN.exec(value);
  if (match === null) return null;
  const [, startName, startPercent, endName, endPercent] = match;
  return [
    { name: startName as RangeName, fraction: Number(startPercent) / 100 },
    { name: endName as RangeName, fraction: Number(endPercent) / 100 },
  ];
}

/**
 * Where a range point falls, as scroll distance since the subject's top edge met the bottom
 * of a visible area of height `viewport`, following the view timeline range definitions.
 */
export function rangeOffset({ fraction, name }: RangePoint, subject: number, viewport: number) {
  const shorter = Math.min(subject, viewport);
  const longer = Math.max(subject, viewport);
  switch (name) {
    case "cover":
      return fraction * (subject + viewport);
    case "contain":
      return shorter + fraction * (longer - shorter);
    case "entry":
      return fraction * shorter;
    case "exit":
      return longer + fraction * shorter;
  }
}

/** Progress (0–1) through `range` once the subject has scrolled `distance` into view. */
export function rangeProgress(
  [start, end]: ScrollRange,
  distance: number,
  subject: number,
  viewport: number,
) {
  const from = rangeOffset(start, subject, viewport);
  const to = rangeOffset(end, subject, viewport);
  if (to <= from) return distance < from ? 0 : 1;
  return Math.min(1, Math.max(0, (distance - from) / (to - from)));
}

/** The element whose view timeline a subject follows, as the native rules in globals.css. */
function timelineSource(subject: HTMLElement): HTMLElement | null {
  if (subject.matches(".hh-spread, .home-bloom__item")) return subject;
  if (subject.matches(".hh-page")) return subject.closest<HTMLElement>(".hh-spread");
  if (subject.matches(".home-scramble__stage")) {
    return subject.closest<HTMLElement>(".home-scramble");
  }
  if (subject.matches(".home-wheel__stage")) return subject.closest<HTMLElement>(".home-wheel");
  // Story parts follow the spacer of their scene (the scene's or index entry's data-scene).
  const scene = subject.closest<HTMLElement>("[data-scene]")?.dataset.scene;
  if (scene === undefined) return null;
  return (
    subject
      .closest(".home-story")
      ?.querySelector<HTMLElement>(`.home-story__spacer[data-scene="${scene}"]`) ?? null
  );
}

/** Layout position in the document, ignoring transforms (the subjects transform themselves). */
function documentTop(element: HTMLElement) {
  let top = 0;
  for (let node: Element | null = element; node instanceof HTMLElement; node = node.offsetParent) {
    top += node.offsetTop;
  }
  return top;
}

type Track = {
  subject: HTMLElement;
  range: ScrollRange;
  source: HTMLElement;
  top: number;
  height: number;
  progress: string;
};

/**
 * Drives the home scroll scenes where CSS scroll timelines are missing (Firefox). The CSS holds
 * each subject's keyframes paused for one second; this writes its progress through its
 * `--scroll-range` to `--scroll-progress`, which seeks them, so the scenes move with
 * the scroll exactly as native timelines would. It does nothing with native timelines or reduced
 * motion. Returns a callback ref for the page root.
 */
export function useHomeScrollFallback<Root extends HTMLElement>() {
  const [root, setRoot] = useState<Root | null>(null);

  useEffect(() => {
    if (root === null || typeof CSS === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    if (CSS.supports("animation-timeline: view()")) return;
    const motion = window.matchMedia(MOTION_QUERY);
    let tracks: Track[] = [];
    // Like native view timelines (view-timeline-inset: auto), the visible area excludes the
    // page's scroll padding, such as the room kept for the navigation bar.
    let visibleBottom = 0;
    let viewport = 0;
    let frame = 0;

    const measure = () => {
      const page = document.documentElement;
      const padding = getComputedStyle(page);
      const insetTop = Number.parseFloat(padding.scrollPaddingTop) || 0;
      const insetBottom = Number.parseFloat(padding.scrollPaddingBottom) || 0;
      visibleBottom = page.clientHeight - insetBottom;
      viewport = visibleBottom - insetTop;
      tracks = [...root.querySelectorAll<HTMLElement>(SUBJECTS)].flatMap((subject) => {
        // The hero lamp is the spread's ::before, which reads the spread's progress.
        const pseudo = subject.matches(".hh-spread") ? "::before" : null;
        const range = parseScrollRange(
          getComputedStyle(subject, pseudo).getPropertyValue("--scroll-range"),
        );
        const source = timelineSource(subject);
        if (range === null || source === null) return [];
        return [
          {
            subject,
            range,
            source,
            top: documentTop(source),
            height: source.offsetHeight,
            progress: "",
          },
        ];
      });
    };

    const update = () => {
      frame = 0;
      for (const track of tracks) {
        const distance = window.scrollY + visibleBottom - track.top;
        const progress = rangeProgress(track.range, distance, track.height, viewport).toFixed(4);
        if (progress === track.progress) continue;
        track.progress = progress;
        track.subject.style.setProperty("--scroll-progress", progress);
      }
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    const remeasure = () => {
      measure();
      schedule();
    };

    const resizeObserver = new ResizeObserver(remeasure);

    const stop = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      resizeObserver.disconnect();
      for (const track of tracks) track.subject.style.removeProperty("--scroll-progress");
      tracks = [];
    };

    const start = () => {
      measure();
      update();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", remeasure);
      // Covers and fonts arriving move everything below them.
      resizeObserver.observe(root);
    };

    const sync = () => {
      stop();
      if (motion.matches) start();
    };

    sync();
    motion.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      stop();
    };
  }, [root]);

  return setRoot;
}
