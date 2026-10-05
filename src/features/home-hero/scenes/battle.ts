import type { Point, SceneDefinition } from "../scene-types";

/**
 * 学園バトル — staccato. Read in manga order, the reaction inset (top right) comes first: the
 * two girls start. Then the main panel's speed lines snap in, the boy winds back, and lunges so
 * his open hand crosses the panel frame toward the reader. The hand is the only thing that ever
 * leaves the frame; everything else stays inside the page.
 */

/** Inset panel from the delivered ink rules (05-panel-ink-source.png). */
const INSET: readonly Point[] = [
  [877, 0],
  [1536, 0],
  [1536, 401],
  [1218, 466],
  [722, 163],
];

/** The white gutter left of the inset rules: the inset edges offset outward by 22 px. */
const INSET_GUTTER: readonly Point[] = [
  [846.6, 0],
  [1536, 0],
  [1536, 401],
  [1187.3, 473],
  [687.3, 167.6],
];

/** Delivered negative-space polygon behind the hand (asset-map.json). */
const NEGATIVE_SPACE: readonly Point[] = [
  [1005, 513],
  [1536, 404],
  [1536, 1024],
  [1130, 1024],
  [762, 904],
  [721, 866],
];

/**
 * The open hand at rest, traced along the thumb and above the trouser line, so the escape copy
 * of the figure can only ever show the hand.
 */
const HAND: readonly Point[] = [
  [677, 540],
  [1430, 540],
  [1430, 1020],
  [1150, 1020],
  [1000, 1000],
  [850, 958],
  [760, 900],
  [725, 882],
  [708, 878],
  [695, 873],
  [686, 866],
  [680, 856],
  [677, 845],
];

/** Panel frame bottom; the palm edge and fingers cross it toward the reader. */
const FRAME_BOTTOM = 830;

/**
 * The escape copy starts a little above the frame bottom, so the hand is drawn over the ink frame
 * line instead of being cut by it. Above this band the in-panel figure shows the same pixels.
 */
const FRAME_OVERLAP = 18;

/** The figure winds back and lunges around his rear shoulder, so the hand travels furthest. */
const LUNGE_ORIGIN: Point = [250, 450];
const HAND_CENTRE: Point = [990, 720];

const SINE = "cubic-bezier(0.37, 0, 0.63, 1)";
const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

export const battleScene: SceneDefinition = {
  id: "battle",
  // The panel keeps the top of the shared page; the paper below is where the hand lands.
  window: [0, 0, 1536, FRAME_BOTTOM],
  paper: "white",
  layers: [
    {
      kind: "group",
      node: "camera",
      children: [
        { kind: "image", asset: "bg", origin: HAND_CENTRE },
        { kind: "fill", node: "negative-space", polygon: NEGATIVE_SPACE, paint: "paper" },
        { kind: "image", asset: "fx", origin: HAND_CENTRE },
        { kind: "fill", polygon: INSET_GUTTER, paint: "paper" },
        {
          kind: "group",
          clip: INSET,
          children: [
            { kind: "image", asset: "bg", node: "inset-bg" },
            { kind: "image", asset: "girl", origin: [960, 470] },
            { kind: "image", asset: "kid", origin: [1290, 480] },
          ],
        },
        { kind: "image", asset: "ink" },
        { kind: "image", asset: "boy", origin: LUNGE_ORIGIN },
      ],
    },
  ],
  // The fingertips reach about 150 px below the frame at rest and 172 px at the lunge peak, still
  // inside the 1024 px page.
  escape: [
    {
      kind: "group",
      node: "camera",
      clip: [
        [-400, FRAME_BOTTOM - FRAME_OVERLAP],
        [1936, FRAME_BOTTOM - FRAME_OVERLAP],
        [1936, 1400],
        [-400, 1400],
      ],
      children: [{ kind: "image", asset: "boy", origin: LUNGE_ORIGIN, mask: HAND }],
    },
    // The impact flash covers the whole page: the panel and the hand brighten alike, and the
    // white paper around them shows no change.
    { kind: "overlay", node: "flash", effect: "flash" },
  ],
  introMs: 2100,
  intro: [
    // 1. Reaction inset: the girls start before we see why.
    {
      node: "inset-bg",
      startMs: 250,
      durationMs: 300,
      keyframes: [{ opacity: 0, easing: "ease-out" }, { opacity: 1 }],
    },
    {
      node: "girl",
      startMs: 300,
      durationMs: 460,
      keyframes: [
        { y: 20, opacity: 0, easing: "cubic-bezier(0.2, 0.8, 0.3, 1)" },
        { offset: 0.35, opacity: 1 },
        { offset: 0.65, y: -3, easing: "ease-in-out" },
        { y: 0 },
      ],
    },
    {
      node: "kid",
      startMs: 400,
      durationMs: 460,
      keyframes: [
        { y: 28, opacity: 0, easing: "cubic-bezier(0.2, 0.8, 0.3, 1)" },
        { offset: 0.35, opacity: 1 },
        { offset: 0.65, y: -5, easing: "ease-in-out" },
        { y: 0 },
      ],
    },
    // 2. The main panel arrives with the camera already rushing toward the hand.
    {
      node: "bg",
      startMs: 700,
      durationMs: 200,
      keyframes: [{ opacity: 0, easing: "ease-out" }, { opacity: 1 }],
    },
    {
      node: "bg",
      startMs: 700,
      durationMs: 1000,
      keyframes: [{ scale: 1.08, easing: OUT }, { scale: 1 }],
    },
    {
      node: "negative-space",
      startMs: 760,
      durationMs: 160,
      keyframes: [{ opacity: 0 }, { opacity: 1 }],
    },
    {
      node: "fx",
      startMs: 880,
      durationMs: 120,
      keyframes: [{ opacity: 0, easing: "ease-out" }, { opacity: 1 }],
    },
    // Speed lines converge, hold, then jolt outward on the impact.
    {
      node: "fx",
      startMs: 880,
      durationMs: 880,
      keyframes: [
        { scale: 1.35, easing: "cubic-bezier(0.1, 0.9, 0.2, 1)" },
        { offset: 0.23, scale: 1 },
        { offset: 0.61, scale: 1, easing: "cubic-bezier(0.2, 0.9, 0.3, 1)" },
        { offset: 0.7, scale: 1.06, easing: "ease-in-out" },
        { scale: 1 },
      ],
    },
    // 3–4. The boy winds back (anticipation), lunges past his mark, and settles on it.
    {
      node: "boy",
      startMs: 820,
      durationMs: 130,
      keyframes: [{ opacity: 0 }, { opacity: 1 }],
    },
    {
      node: "boy",
      startMs: 820,
      durationMs: 1230,
      keyframes: [
        { scale: 0.8, x: -20, y: -10, easing: "ease-in-out" },
        { offset: 0.29, scale: 0.775, x: -34, y: -16, easing: "cubic-bezier(0.5, 0, 0.1, 1)" },
        { offset: 0.47, scale: 1.045, x: 8, y: 5, easing: "ease-in-out" },
        { offset: 0.63, scale: 0.992, x: -2, y: -1, easing: "ease-out" },
        { scale: 1, x: 0, y: 0 },
      ],
    },
    // The page itself takes the hit for a few frames.
    {
      node: "camera",
      startMs: 1400,
      durationMs: 240,
      keyframes: [
        { x: 0, y: 0 },
        { x: -7, y: 5 },
        { x: 6, y: -4 },
        { x: -4, y: 3 },
        { x: 2, y: -1 },
        { x: 0, y: 0 },
      ],
    },
    {
      node: "flash",
      startMs: 1390,
      durationMs: 190,
      keyframes: [
        { opacity: 0, easing: "ease-out" },
        { offset: 0.2, opacity: 0.28, easing: "ease-in" },
        { opacity: 0 },
      ],
    },
  ],
  ambient: [
    // The world keeps leaning toward the hand while the figures hold their pose.
    {
      node: "bg:loop",
      startMs: 2200,
      durationMs: 12_000,
      repeat: true,
      keyframes: [{ scale: 1, easing: SINE }, { scale: 1.015, easing: SINE }, { scale: 1 }],
    },
    {
      node: "fx:loop",
      startMs: 2600,
      durationMs: 3000,
      repeat: true,
      keyframes: [{ scale: 1, easing: SINE }, { scale: 1.028, easing: SINE }, { scale: 1 }],
    },
    {
      node: "inset-bg:loop",
      startMs: 2400,
      durationMs: 8000,
      repeat: true,
      keyframes: [{ x: 0, easing: SINE }, { x: -8, easing: SINE }, { x: 0 }],
    },
  ],
};
