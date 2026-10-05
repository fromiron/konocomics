import { landingStrings } from "@/lib/strings";

import type { SceneId } from "./scene-types";

/**
 * Blank manga pages under the hero: two sheets of empty panels, a few laid with screentone, and
 * hand-lettered sound effects with their speed lines, lying at slight angles beneath the hero's
 * panels so those read as the top page of a pile. Pure decoration, drawn faintly in the paper
 * colour; it never moves.
 */

type Panel = Readonly<{ points: string; tone?: "dots" | "fade" }>;

/** Panel outlines of one page in its own 760x1080 space, three tiers read from the top right. */
const PAGE_A: readonly Panel[] = [
  { points: "400,40 720,40 720,330 400,330", tone: "dots" },
  { points: "40,40 388,40 388,330 40,330" },
  { points: "300,362 720,362 720,700 260,700" },
  { points: "40,362 288,362 248,700 40,700", tone: "fade" },
  { points: "40,732 720,732 720,1040 40,1040" },
];

const PAGE_B: readonly Panel[] = [
  { points: "40,40 720,40 720,260 40,260", tone: "fade" },
  { points: "470,292 720,292 720,640 470,640" },
  { points: "40,292 458,292 458,640 40,640", tone: "dots" },
  { points: "380,672 720,672 720,1040 330,1040" },
  { points: "40,672 368,672 318,1040 40,1040" },
];

function Page({ panels, transform }: Readonly<{ panels: readonly Panel[]; transform: string }>) {
  return (
    <g transform={transform}>
      <rect className="hh-underlay__sheet" height="1080" width="760" />
      {panels.map(({ points, tone }) => (
        <g key={points}>
          {tone === undefined ? null : (
            <polygon
              className="hh-underlay__tone"
              fill="url(#hh-tone-dots)"
              mask={tone === "fade" ? "url(#hh-tone-fade)" : undefined}
              points={points}
            />
          )}
          <polygon className="hh-underlay__frame" points={points} />
        </g>
      ))}
    </g>
  );
}

type SoundEffect = Readonly<{
  x: number;
  y: number;
  size: number;
  /** Degrees: the lettering tilts and leans like a drawn effect. */
  turn: number;
  lean: number;
  /** Outlined and laid with tone, or outlined only. */
  toned: boolean;
}>;

/**
 * Where each scene's sound effects are lettered, mostly in the open margins. Battle effects are
 * hard katakana, tilted and leaning far like a blow; romance effects are softer, upright and
 * laid with tone.
 */
const SOUND_EFFECTS: Readonly<Record<SceneId, readonly SoundEffect[]>> = {
  battle: [
    { x: 760, y: 112, size: 118, turn: -6, lean: -14, toned: true },
    { x: 1170, y: 122, size: 138, turn: 4, lean: -10, toned: false },
    { x: 1440, y: 96, size: 86, turn: -10, lean: -18, toned: true },
    { x: 940, y: 600, size: 210, turn: -4, lean: -12, toned: false },
    { x: 70, y: 975, size: 108, turn: 5, lean: -10, toned: true },
    { x: 1330, y: 985, size: 82, turn: -8, lean: -16, toned: false },
  ],
  romance: [
    { x: 780, y: 104, size: 104, turn: -3, lean: -4, toned: true },
    { x: 1150, y: 112, size: 112, turn: 3, lean: -2, toned: true },
    { x: 1420, y: 92, size: 78, turn: -5, lean: -4, toned: false },
    { x: 900, y: 590, size: 180, turn: 2, lean: -3, toned: true },
    { x: 80, y: 970, size: 96, turn: 4, lean: -2, toned: true },
    { x: 1340, y: 980, size: 76, turn: -4, lean: -4, toned: false },
  ],
};

/** Speed lines trailing the effects in the masthead margin. */
const SPEED_LINES = [
  "M1395 40 L1590 18",
  "M1405 62 L1600 46",
  "M1390 84 L1560 74",
  "M700 150 L1080 132",
  "M720 168 L980 158",
];

export function HeroUnderlay({ sceneId }: Readonly<{ sceneId: SceneId }>) {
  const places = SOUND_EFFECTS[sceneId];
  return (
    <svg
      aria-hidden="true"
      className="hh-underlay"
      data-scene={sceneId}
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1600 1000"
    >
      <defs>
        <pattern height="7" id="hh-tone-dots" patternUnits="userSpaceOnUse" width="7">
          <circle cx="3.5" cy="3.5" fill="currentColor" r="1.3" />
        </pattern>
        <linearGradient id="hh-tone-fade-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="white" />
          <stop offset="0.8" stopColor="black" />
        </linearGradient>
        <mask height="1" id="hh-tone-fade" maskContentUnits="objectBoundingBox" width="1">
          <rect fill="url(#hh-tone-fade-gradient)" height="1" width="1" />
        </mask>
      </defs>
      <Page panels={PAGE_B} transform="translate(840 -60) rotate(3 380 540)" />
      <Page panels={PAGE_A} transform="translate(20 -20) rotate(-2.5 380 540)" />
      {SPEED_LINES.map((line) => (
        <path className="hh-underlay__line" d={line} key={line} />
      ))}
      {landingStrings.hero.soundEffects[sceneId].map((effect, index) => {
        const place = places[index % places.length]!;
        return (
          <text
            className="hh-underlay__sfx"
            data-toned={place.toned ? "" : undefined}
            fontSize={place.size}
            key={effect}
            transform={`translate(${String(place.x)} ${String(place.y)}) rotate(${String(place.turn)}) skewX(${String(place.lean)})`}
          >
            {effect}
          </text>
        );
      })}
    </svg>
  );
}
