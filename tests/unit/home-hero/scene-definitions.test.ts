import { describe, expect, it } from "vitest";

import { sceneAsset } from "@/features/home-hero/scene-assets";
import { trackKeyframes } from "@/features/home-hero/scene-playback";
import type {
  NodeKeyframe,
  SceneDefinition,
  SceneLayer,
  Track,
} from "@/features/home-hero/scene-types";
import { battleScene } from "@/features/home-hero/scenes/battle";
import { ROMANCE_PETAL_FLIGHTS, romanceScene } from "@/features/home-hero/scenes/romance";

const scenes: readonly SceneDefinition[] = [battleScene, romanceScene];

type NodeInfo = { rest: { opacity: number; x: number }; restHidden: boolean; image?: string };

/** Every node a scene renders, with the pose its CSS shows when nothing animates. */
function sceneNodes(scene: SceneDefinition) {
  const nodes = new Map<string, NodeInfo>();
  const visit = (layer: SceneLayer) => {
    switch (layer.kind) {
      case "image": {
        const node = layer.node ?? layer.asset;
        const info = { rest: { opacity: 1, x: 0 }, restHidden: layer.restHidden === true };
        nodes.set(node, { ...info, image: layer.asset });
        nodes.set(`${node}:loop`, { ...info, image: layer.asset });
        return;
      }
      case "fill":
        if (layer.node !== undefined) {
          nodes.set(layer.node, { rest: { opacity: 1, x: 0 }, restHidden: false });
        }
        return;
      case "overlay":
        nodes.set(layer.node, {
          rest: { opacity: layer.effect === "dapple" ? 1 : 0, x: 0 },
          restHidden: false,
        });
        return;
      case "arcs":
        for (const stroke of layer.strokes) {
          nodes.set(stroke.node, { rest: { opacity: 1, x: 0 }, restHidden: false });
        }
        return;
      case "group":
        if (layer.node !== undefined) {
          nodes.set(layer.node, { rest: { opacity: 1, x: 0 }, restHidden: false });
          nodes.set(`${layer.node}:loop`, { rest: { opacity: 1, x: 0 }, restHidden: false });
        }
        layer.children.forEach(visit);
    }
  };
  [...scene.layers, ...(scene.escape ?? [])].forEach(visit);
  return nodes;
}

function resolved(keyframes: readonly NodeKeyframe[]) {
  let pose = { x: 0, y: 0, scale: 1, flip: 1, rotate: 0, opacity: 1, draw: 1 };
  return keyframes.map((frame) => {
    pose = {
      x: frame.x ?? pose.x,
      y: frame.y ?? pose.y,
      scale: frame.scale ?? pose.scale,
      flip: frame.flip ?? pose.flip,
      rotate: frame.rotate ?? pose.rotate,
      opacity: frame.opacity ?? pose.opacity,
      draw: frame.draw ?? pose.draw,
    };
    return pose;
  });
}

function properties(track: Track) {
  const touched = new Set<string>();
  for (const frame of track.keyframes) {
    if (["x", "y", "scale", "flip", "rotate"].some((key) => key in frame)) touched.add("transform");
    if ("opacity" in frame) touched.add("opacity");
    if ("draw" in frame) touched.add("draw");
  }
  return touched;
}

describe.each(scenes)("$id scene", (scene) => {
  const nodes = sceneNodes(scene);
  const tracks = [...scene.intro, ...scene.ambient];

  it("animates only nodes the scene renders, from delivered assets", () => {
    for (const track of tracks) expect(nodes.has(track.node), track.node).toBe(true);
    for (const info of nodes.values()) {
      if (info.image !== undefined) expect(() => sceneAsset(scene.id, info.image!)).not.toThrow();
    }
  });

  it("never lets two tracks fight over one property of a node", () => {
    const owners = new Map<string, Track>();
    for (const track of tracks) {
      for (const property of properties(track)) {
        const key = `${track.node}/${property}`;
        expect(owners.has(key), `${key} is animated twice`).toBe(false);
        owners.set(key, track);
      }
    }
  });

  it("ends every intro track on the approved still", () => {
    for (const track of scene.intro) {
      const info = nodes.get(track.node)!;
      if (info.restHidden) continue;
      const last = resolved(track.keyframes).at(-1)!;
      expect(
        { x: last.x, y: last.y, scale: last.scale, rotate: last.rotate, draw: last.draw },
        track.node,
      ).toEqual({ x: 0, y: 0, scale: 1, rotate: 0, draw: 1 });
      if (properties(track).has("opacity"))
        expect(last.opacity, track.node).toBe(info.rest.opacity);
    }
  });

  it("loops ambient motion seamlessly from the settled page", () => {
    for (const track of scene.ambient) {
      expect(track.repeat, track.node).toBe(true);
      expect(track.startMs, track.node).toBeGreaterThanOrEqual(scene.introMs);
      if (nodes.get(track.node)!.restHidden) continue;
      const poses = resolved(track.keyframes);
      expect(poses[0], track.node).toEqual(poses.at(-1));
      expect(poses[0]!.x).toBe(0);
      expect(poses[0]!.y).toBe(0);
      expect(poses[0]!.scale).toBe(1);
    }
  });

  it("keeps the figures within a camera move of their approved place", () => {
    for (const track of tracks) {
      const info = nodes.get(track.node)!;
      if (info.restHidden || info.image === undefined) continue;
      for (const pose of resolved(track.keyframes)) {
        expect(pose.scale, track.node).toBeGreaterThanOrEqual(0.75);
        expect(pose.scale, track.node).toBeLessThanOrEqual(1.4);
        expect(Math.abs(pose.x) + Math.abs(pose.y), track.node).toBeLessThanOrEqual(240);
        expect(pose.rotate, track.node).toBe(0);
      }
    }
  });

  it("returns loose light and props off-page instead of sweeping them back across it", () => {
    for (const track of scene.ambient) {
      const poses = resolved(track.keyframes);
      track.keyframes.forEach((frame, index) => {
        const next = poses[index + 1];
        if (next === undefined) return;
        const jump = Math.hypot(next.x - poses[index]!.x, next.y - poses[index]!.y);
        const nextOffset = track.keyframes[index + 1]?.offset ?? 1;
        const span = nextOffset - (frame.offset ?? 0);
        // A move of hundreds of pixels in about a hundred milliseconds is a return, not motion.
        if (jump > 400 && span * track.durationMs < 400) {
          expect(frame.easing, `${track.node} keyframe ${String(index)}`).toMatch(/^steps\(/u);
        }
      });
    }
  });

  it("does not start everything on the same beat", () => {
    const starts = new Set(scene.intro.map((track) => track.startMs));
    expect(starts.size).toBeGreaterThanOrEqual(6);
  });
});

describe("romance petals", () => {
  it("enter and leave out of sight, so each loop restarts unseen", () => {
    for (const flight of ROMANCE_PETAL_FLIGHTS) {
      const { w, h } = sceneAsset("romance", flight.asset);
      for (const [x, y] of [flight.from, flight.to]) {
        const outside = x + w <= 0 || x >= 1536 || y + h <= 0 || y >= 1024;
        expect(outside, `${flight.asset} at ${String(x)},${String(y)}`).toBe(true);
      }
    }
  });
});

describe("trackKeyframes", () => {
  it("carries values forward and writes compositor-friendly CSS", () => {
    const keyframes = trackKeyframes({
      node: "boy",
      startMs: 0,
      durationMs: 100,
      keyframes: [{ x: 15.36, scale: 0.5, opacity: 0, easing: "ease-in" }, { opacity: 1 }],
    });
    expect(keyframes).toEqual([
      {
        easing: "ease-in",
        opacity: 0,
        transform: "translate(1cqw, 0cqw) rotate(0deg) scale(0.5, 0.5)",
      },
      { opacity: 1, transform: "translate(1cqw, 0cqw) rotate(0deg) scale(0.5, 0.5)" },
    ]);
  });

  it("reveals arcs through the stroke offset", () => {
    expect(
      trackKeyframes({
        node: "thread",
        startMs: 0,
        durationMs: 100,
        keyframes: [{ draw: 0 }, { draw: 1 }],
      }),
    ).toEqual([{ strokeDashoffset: "1" }, { strokeDashoffset: "0" }]);
  });
});
