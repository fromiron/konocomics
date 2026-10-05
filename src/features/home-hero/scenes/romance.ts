import { sceneAsset } from "../scene-assets";
import type { ImageLayer, Point, SceneDefinition, Track } from "../scene-types";

/**
 * ラブコメ — legato. The page reads top left to bottom: she looks down (first inset), looks up
 * (second inset), and the main panel opens on the book their hands share. The camera tilts up
 * from the hands to the moment their eyes meet, while the thread from each inset finds her. A
 * gust of petals passes between their faces on arrival. Nobody moves; the camera and the page do.
 */

/** Delivered inset panels (assetmap.json `panel_polygons_original`). */
const DOWNCAST_PANEL: readonly Point[] = [
  [31, 13],
  [426, 14],
  [407, 216],
  [23, 220],
];
const UPTURNED_PANEL: readonly Point[] = [
  [0, 235],
  [418, 226],
  [380, 582],
  [0, 620],
];

/** The main panel; petals are only visible inside it (paper and insets cover the rest). */
export const ROMANCE_MAIN_PANEL: readonly Point[] = [
  [445, 0],
  [1536, 0],
  [1536, 1024],
  [335, 1024],
];

/** Arc strokes traced from 09-romance-arcs-overscan.png, drawn from each inset toward her. */
const DOWNCAST_THREAD: readonly Point[] = [
  [345, 163],
  [373, 166],
  [401, 174],
  [427, 183],
  [451, 196],
  [474, 213],
  [495, 232],
  [515, 254],
  [533, 276],
  [553, 298],
  [574, 320],
  [596, 338],
  [620, 353],
  [646, 364],
  [674, 370],
  [698, 372],
];
const UPTURNED_THREAD: readonly Point[] = [
  [115, 580],
  [132, 604],
  [153, 625],
  [177, 640],
  [203, 652],
  [230, 660],
  [258, 664],
  [286, 666],
  [314, 667],
  [342, 666],
  [370, 663],
  [398, 659],
  [426, 654],
  [454, 647],
  [482, 639],
  [509, 630],
  [518, 627],
];

/** Camera tilt from the shared book up to their faces; the background moves less (depth). */
const TILT_FIGURES = 230;
const TILT_BACKGROUND = 126;
const TILT = "cubic-bezier(0.45, 0, 0.15, 1)";
const SINE = "cubic-bezier(0.37, 0, 0.63, 1)";
const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

type PetalFlight = Readonly<{
  asset: string;
  /** Top-left corner at the start and end, both outside the window or above it. */
  from: Point;
  to: Point;
  startMs: number;
  durationMs: number;
  spin: number;
  sway: number;
  repeat?: boolean;
}>;

/** A petal crossing the panel on the wind, turning over and swaying across its path. */
function flight({ asset, from, to, startMs, durationMs, spin, sway, repeat }: PetalFlight): Track {
  const { x, y } = sceneAsset("romance", asset);
  const [dx, dy] = [to[0] - from[0], to[1] - from[1]];
  const length = Math.hypot(dx, dy);
  const [nx, ny] = [-dy / length, dx / length];
  const swayAt = [0, 1, 0, -1, 0];
  const flipAt = [1, 0.4, 1, 0.55, 1];
  return {
    node: asset,
    startMs,
    durationMs,
    repeat,
    keyframes: swayAt.map((side, index) => {
      const progress = index / 4;
      return {
        x: from[0] - x + dx * progress + nx * sway * side,
        y: from[1] - y + dy * progress + ny * sway * side,
        rotate: spin * progress,
        flip: flipAt[index],
        opacity: 1,
      };
    }),
  };
}

const gust: readonly PetalFlight[] = [
  // The accent petal falls through the gap between their faces as their eyes meet.
  {
    asset: "petal-12",
    from: [820, -150],
    to: [1120, 1150],
    startMs: 1850,
    durationMs: 3200,
    spin: 200,
    sway: 22,
  },
  {
    asset: "petal-17",
    from: [-220, 560],
    to: [1700, 900],
    startMs: 2150,
    durationMs: 2300,
    spin: 240,
    sway: 36,
  },
  {
    asset: "petal-22",
    from: [-180, 740],
    to: [1650, 1080],
    startMs: 2450,
    durationMs: 2300,
    spin: -180,
    sway: 30,
  },
  {
    asset: "petal-13",
    from: [-170, 600],
    to: [1700, 720],
    startMs: 2650,
    durationMs: 2500,
    spin: 160,
    sway: 28,
  },
];

const drift: readonly PetalFlight[] = [
  {
    asset: "petal-02",
    from: [520, -80],
    to: [1600, 640],
    startMs: 3200,
    durationMs: 15_000,
    spin: 320,
    sway: 40,
    repeat: true,
  },
  {
    asset: "petal-04",
    from: [-110, 420],
    to: [1620, 1000],
    startMs: 4800,
    durationMs: 17_000,
    spin: -280,
    sway: 46,
    repeat: true,
  },
  {
    asset: "petal-09",
    from: [700, -110],
    to: [1640, 440],
    startMs: 6100,
    durationMs: 13_000,
    spin: 260,
    sway: 34,
    repeat: true,
  },
  {
    asset: "petal-21",
    from: [-100, 640],
    to: [1600, 1090],
    startMs: 3900,
    durationMs: 16_000,
    spin: 300,
    sway: 38,
    repeat: true,
  },
  {
    asset: "petal-23",
    from: [960, -90],
    to: [1620, 780],
    startMs: 8000,
    durationMs: 14_000,
    spin: -240,
    sway: 30,
    repeat: true,
  },
  {
    asset: "petal-18",
    from: [-110, 700],
    to: [1650, 1100],
    startMs: 5200,
    durationMs: 12_000,
    spin: 220,
    sway: 32,
    repeat: true,
  },
  {
    asset: "petal-14",
    from: [-120, 760],
    to: [1660, 1110],
    startMs: 9000,
    durationMs: 18_000,
    spin: -200,
    sway: 40,
    repeat: true,
  },
];

export const ROMANCE_PETAL_FLIGHTS: readonly PetalFlight[] = [...gust, ...drift];

const petalLayer = (asset: string): ImageLayer => ({ kind: "image", asset, restHidden: true });

/** Petals that pass behind the pair, then the ones in front of it. */
const BEHIND = new Set(["petal-02", "petal-04", "petal-09", "petal-21", "petal-23"]);

export const romanceScene: SceneDefinition = {
  id: "romance",
  window: [0, 0, 1536, 1024],
  paper: "warm",
  layers: [
    // The main panel fades in as one flattened picture, so nothing shows through the figures.
    {
      kind: "group",
      node: "panel",
      children: [
        { kind: "image", asset: "bg" },
        ...drift.filter((petal) => BEHIND.has(petal.asset)).map((petal) => petalLayer(petal.asset)),
        { kind: "image", asset: "pair" },
        ...drift
          .filter((petal) => !BEHIND.has(petal.asset))
          .map((petal) => petalLayer(petal.asset)),
        ...gust.map((petal) => petalLayer(petal.asset)),
        { kind: "overlay", node: "dapple", effect: "dapple", rect: [-700, -120, 600, 1264] },
        { kind: "overlay", node: "bloom", effect: "bloom", rect: [335, 0, 1201, 1024] },
      ],
    },
    {
      kind: "group",
      clip: DOWNCAST_PANEL,
      children: [
        { kind: "fill", node: "downcast-tone", polygon: DOWNCAST_PANEL, paint: "inset-warm" },
        { kind: "image", asset: "inset-downcast" },
      ],
    },
    {
      kind: "group",
      clip: UPTURNED_PANEL,
      children: [
        { kind: "fill", node: "upturned-tone", polygon: UPTURNED_PANEL, paint: "inset-cool" },
        { kind: "image", asset: "inset-upturned" },
      ],
    },
    { kind: "image", asset: "paper" },
    { kind: "image", asset: "ink" },
    {
      kind: "arcs",
      asset: "arcs",
      strokes: [
        { node: "thread-downcast", points: DOWNCAST_THREAD },
        { node: "thread-upturned", points: UPTURNED_THREAD },
      ],
    },
  ],
  introMs: 3000,
  intro: [
    // 1. First inset: she looks down; the panel settles with her gaze.
    {
      node: "downcast-tone",
      startMs: 150,
      durationMs: 300,
      keyframes: [{ opacity: 0 }, { opacity: 1 }],
    },
    {
      node: "inset-downcast",
      startMs: 220,
      durationMs: 500,
      keyframes: [{ opacity: 0, easing: "ease-out" }, { opacity: 1 }],
    },
    {
      node: "inset-downcast",
      startMs: 220,
      durationMs: 880,
      keyframes: [{ y: -14, easing: OUT }, { y: 0 }],
    },
    // 2. The main panel opens on the shared book, then tilts up to their faces.
    {
      node: "panel",
      startMs: 450,
      durationMs: 550,
      keyframes: [{ opacity: 0, easing: "ease-out" }, { opacity: 1 }],
    },
    {
      node: "bg",
      startMs: 600,
      durationMs: 2300,
      keyframes: [{ y: -TILT_BACKGROUND, easing: TILT }, { y: 0 }],
    },
    {
      node: "pair",
      startMs: 600,
      durationMs: 2300,
      keyframes: [{ y: -TILT_FIGURES, easing: TILT }, { y: 0 }],
    },
    // 3. Second inset: she looks up; the panel rises with her gaze.
    {
      node: "upturned-tone",
      startMs: 900,
      durationMs: 250,
      keyframes: [{ opacity: 0 }, { opacity: 1 }],
    },
    {
      node: "inset-upturned",
      startMs: 950,
      durationMs: 500,
      keyframes: [{ opacity: 0, easing: "ease-out" }, { opacity: 1 }],
    },
    {
      node: "inset-upturned",
      startMs: 950,
      durationMs: 850,
      keyframes: [{ y: 16, easing: OUT }, { y: 0 }],
    },
    // 4. Each thread leaves its inset and reaches her as the camera arrives.
    {
      node: "thread-upturned",
      startMs: 1450,
      durationMs: 900,
      keyframes: [{ draw: 0, easing: "ease-in-out" }, { draw: 1 }],
    },
    {
      node: "thread-downcast",
      startMs: 1800,
      durationMs: 1100,
      keyframes: [{ draw: 0, easing: "cubic-bezier(0.45, 0, 0.2, 1)" }, { draw: 1 }],
    },
    // 5. Their eyes meet: warm light swells once while the gust passes.
    {
      node: "bloom",
      startMs: 2600,
      durationMs: 1700,
      keyframes: [
        { opacity: 0, easing: "ease-out" },
        { offset: 0.3, opacity: 0.34, easing: "ease-in-out" },
        { opacity: 0 },
      ],
    },
    ...gust.map(flight),
  ],
  ambient: [
    // The camera breathes; the figures move with it, never on their own.
    {
      node: "bg:loop",
      startMs: 3200,
      durationMs: 12_000,
      repeat: true,
      keyframes: [{ y: 0, easing: SINE }, { y: 4, easing: SINE }, { y: 0 }],
    },
    {
      node: "pair:loop",
      startMs: 3200,
      durationMs: 12_000,
      repeat: true,
      keyframes: [{ y: 0, easing: SINE }, { y: 7, easing: SINE }, { y: 0 }],
    },
    // Sunlight through the cherry trees crosses the panel, then rests off-panel.
    {
      node: "dapple",
      startMs: 4200,
      durationMs: 12_000,
      repeat: true,
      keyframes: [
        { offset: 0, x: 0, easing: SINE },
        // Jump back while off-panel instead of sweeping back across it.
        { offset: 0.45, x: 2500, easing: "steps(1, end)" },
        { offset: 0.46, x: 0 },
        { offset: 1, x: 0 },
      ],
    },
    ...drift.map(flight),
  ],
};
