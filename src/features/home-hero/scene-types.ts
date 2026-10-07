/**
 * A hero scene is authored in the delivered illustration's 1536x1024 source space. Layers keep
 * the delivered pixels; tracks only move, fade, or reveal them. Every node's rest pose is the
 * approved still, so a scene without motion (reduced motion, no WAAPI) is the approved still.
 */

export const SOURCE_WIDTH = 1536;
export const SOURCE_HEIGHT = 1024;

export type Point = readonly [x: number, y: number];
/** [x, y, width, height] in source pixels. */
export type SourceRect = readonly [x: number, y: number, width: number, height: number];

export type SceneId = "battle" | "romance";

/** One pose in a track. Missing values carry over from the previous keyframe. */
export type NodeKeyframe = Readonly<{
  /** 0–1 position inside the track. Defaults to an even spread, as in WAAPI. */
  offset?: number;
  /** Translation in source pixels. */
  x?: number;
  y?: number;
  scale?: number;
  /** Horizontal squash for petals turning over; 1 is flat. */
  flip?: number;
  /** Degrees. Only for loose props such as petals, never for figures. */
  rotate?: number;
  opacity?: number;
  /** Arc stroke reveal, 0 hidden to 1 fully drawn. */
  draw?: number;
  /** Easing of the segment that starts at this keyframe. */
  easing?: string;
}>;

export type Track = Readonly<{
  node: string;
  startMs: number;
  durationMs: number;
  keyframes: readonly NodeKeyframe[];
  /** Ambient tracks loop forever and start and end on the node's rest pose. */
  repeat?: boolean;
}>;

/** Pixels of a delivered layer, placed by the generated asset manifest. */
export type ImageLayer = Readonly<{
  kind: "image";
  asset: string;
  /** Intro node id; the ambient channel is `${node}:loop`. Defaults to the asset id. */
  node?: string;
  /** Transform origin in source pixels. Defaults to the layer centre. */
  origin?: Point;
  /** Mask that travels with the layer, in source pixels at rest. */
  mask?: readonly Point[];
  /** Hidden in the approved still; only motion shows it (petals). */
  restHidden?: boolean;
}>;

/** A flat graphic shape from the delivered panel geometry (gutters, negative space). */
export type FillLayer = Readonly<{
  kind: "fill";
  node?: string;
  polygon: readonly Point[];
  paint: "paper" | "inset-warm" | "inset-cool";
}>;

/** Light or impact overlays drawn in CSS; hidden at rest. */
export type OverlayLayer = Readonly<{
  kind: "overlay";
  node: string;
  effect: "flash" | "bloom" | "dapple";
  /** Overlay box in source pixels. Defaults to the whole source space. */
  rect?: SourceRect;
}>;

/** Arc strokes revealed along traced paths; the raster arc art is only masked. */
export type ArcLayer = Readonly<{
  kind: "arcs";
  asset: string;
  strokes: readonly Readonly<{ node: string; points: readonly Point[] }>[];
}>;

export type GroupLayer = Readonly<{
  kind: "group";
  node?: string;
  origin?: Point;
  /** Fixed clip in source pixels; it does not travel with the group's own motion. */
  clip?: readonly Point[];
  children: readonly SceneLayer[];
}>;

export type SceneLayer = ImageLayer | FillLayer | OverlayLayer | ArcLayer | GroupLayer;

export type SceneDefinition = Readonly<{
  id: SceneId;
  /**
   * The ink-framed panel, [x, y, width, height] in source pixels. Every scene shares the same
   * 1536x1024 page, so the hero keeps one size whichever scene is drawn.
   */
  window: SourceRect;
  paper: "warm" | "white";
  /** Layers inside the panel window, back to front. */
  layers: readonly SceneLayer[];
  /** Layers drawn over the panel frame, for the parts that break out of it. */
  escape?: readonly SceneLayer[];
  introMs: number;
  intro: readonly Track[];
  ambient: readonly Track[];
}>;
