import { SOURCE_WIDTH, type NodeKeyframe, type SceneDefinition, type Track } from "./scene-types";

/**
 * Turns a scene's tracks into Web Animations on the stage's channel elements. Every animation
 * shares one clock, so a single `seek` reproduces any frame for review, and pausing freezes the
 * frame in place. Transforms and opacity stay on the compositor; only the arc mask repaints.
 */

/** Source pixels to container-query width units of the 1536 px wide source space. */
const CQW_PER_SOURCE_PX = 100 / SOURCE_WIDTH;

type Resolved = {
  x: number;
  y: number;
  scale: number;
  flip: number;
  rotate: number;
  opacity: number;
  draw: number;
};

const REST: Resolved = { x: 0, y: 0, scale: 1, flip: 1, rotate: 0, opacity: 1, draw: 1 };

const round = (value: number) => Math.round(value * 1000) / 1000;

function touches(keyframes: readonly NodeKeyframe[], keys: readonly (keyof NodeKeyframe)[]) {
  return keyframes.some((frame) => keys.some((key) => frame[key] !== undefined));
}

/** Resolves carried-over values and writes the CSS each keyframe needs. */
export function trackKeyframes(track: Track): Keyframe[] {
  const usesTransform = touches(track.keyframes, ["x", "y", "scale", "flip", "rotate"]);
  const usesOpacity = touches(track.keyframes, ["opacity"]);
  const usesDraw = touches(track.keyframes, ["draw"]);
  let previous = REST;
  return track.keyframes.map((frame) => {
    const value: Resolved = {
      x: frame.x ?? previous.x,
      y: frame.y ?? previous.y,
      scale: frame.scale ?? previous.scale,
      flip: frame.flip ?? previous.flip,
      rotate: frame.rotate ?? previous.rotate,
      opacity: frame.opacity ?? previous.opacity,
      draw: frame.draw ?? previous.draw,
    };
    previous = value;
    const keyframe: Keyframe = {};
    if (frame.offset !== undefined) keyframe.offset = frame.offset;
    if (frame.easing !== undefined) keyframe.easing = frame.easing;
    if (usesTransform) {
      keyframe.transform = `translate(${String(round(value.x * CQW_PER_SOURCE_PX))}cqw, ${String(
        round(value.y * CQW_PER_SOURCE_PX),
      )}cqw) rotate(${String(round(value.rotate))}deg) scale(${String(
        round(value.scale * value.flip),
      )}, ${String(round(value.scale))})`;
    }
    if (usesOpacity) keyframe.opacity = round(value.opacity);
    if (usesDraw) keyframe.strokeDashoffset = String(round(1 - value.draw));
    return keyframe;
  });
}

export type ScenePlayer = Readonly<{
  animations: readonly Animation[];
  seek(ms: number): void;
  play(): void;
  pause(): void;
  cancel(): void;
}>;

export function supportsSceneMotion(element: Element) {
  return typeof element.animate === "function";
}

/** Creates every track paused at `startAt`; nothing moves until `play`. */
export function createScenePlayer(
  scene: SceneDefinition,
  stage: HTMLElement,
  startAt: number,
): ScenePlayer {
  const animations: Animation[] = [];
  for (const track of [...scene.intro, ...scene.ambient]) {
    const keyframes = trackKeyframes(track);
    const nodes = stage.querySelectorAll<HTMLElement | SVGElement>(
      `[data-hh-node="${track.node}"]`,
    );
    for (const node of nodes) {
      const animation = node.animate(keyframes, {
        delay: track.startMs,
        duration: track.durationMs,
        easing: "linear",
        fill: track.repeat === true ? "backwards" : "both",
        iterations: track.repeat === true ? Infinity : 1,
      });
      animation.pause();
      animation.currentTime = startAt;
      animations.push(animation);
    }
  }
  return {
    animations,
    seek(ms) {
      for (const animation of animations) animation.currentTime = ms;
    },
    play() {
      for (const animation of animations) {
        // `play()` rewinds a finished animation, so a settled intro track must stay where it is.
        const end = Number(animation.effect?.getComputedTiming().endTime ?? Infinity);
        if (Number(animation.currentTime ?? 0) < end) animation.play();
      }
    },
    pause() {
      for (const animation of animations) animation.pause();
    },
    cancel() {
      for (const animation of animations) animation.cancel();
    },
  };
}

/** Resolves once every layer image is decoded, or `false` when the budget runs out first. */
export function whenSceneDecoded(stage: HTMLElement, budgetMs: number): Promise<boolean> {
  const decodes: Promise<unknown>[] = [];
  for (const image of stage.querySelectorAll("img")) {
    if (typeof image.decode === "function") decodes.push(image.decode().catch(() => undefined));
  }
  for (const image of stage.querySelectorAll("image")) {
    const href = image.getAttribute("href");
    if (href === null) continue;
    const preload = new Image();
    preload.src = href;
    if (typeof preload.decode === "function") {
      decodes.push(preload.decode().catch(() => undefined));
    }
  }
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(false), budgetMs);
    void Promise.all(decodes).then(() => {
      window.clearTimeout(timer);
      resolve(true);
    });
  });
}
