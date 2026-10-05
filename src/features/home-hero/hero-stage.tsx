import { useId } from "react";
import type { CSSProperties, ReactNode, Ref } from "react";

import { sceneAsset } from "./scene-assets";
import {
  SOURCE_HEIGHT,
  SOURCE_WIDTH,
  type ArcLayer,
  type FillLayer,
  type GroupLayer,
  type ImageLayer,
  type OverlayLayer,
  type Point,
  type SceneDefinition,
  type SceneLayer,
  type SourceRect,
} from "./scene-types";

/** Share of the viewport the wide stage occupies, and its cap; mirrors the hero grid. */
const WIDE_STAGE_VW = 58;
const WIDE_STAGE_MAX_PX = 840;
const WIDE_MIN_WIDTH = "64rem";

const percent = (value: number, total: number) =>
  `${String(Math.round((value / total) * 1e5) / 1e3)}%`;

function boxStyle([x, y, width, height]: SourceRect): CSSProperties {
  return {
    left: percent(x, SOURCE_WIDTH),
    top: percent(y, SOURCE_HEIGHT),
    width: percent(width, SOURCE_WIDTH),
    height: percent(height, SOURCE_HEIGHT),
  };
}

/** A polygon in source pixels, relative to a box in source pixels. */
function polygon(points: readonly Point[], [x, y, width, height]: SourceRect) {
  return `polygon(${points
    .map(([px, py]) => `${percent(px - x, width)} ${percent(py - y, height)}`)
    .join(", ")})`;
}

function origin(point: Point | undefined, [x, y, width, height]: SourceRect) {
  if (point === undefined) return "50% 50%";
  return `${percent(point[0] - x, width)} ${percent(point[1] - y, height)}`;
}

const FULL_SPACE: SourceRect = [0, 0, SOURCE_WIDTH, SOURCE_HEIGHT];

/** Rendered width of a source-space span, so each layer downloads only the pixels it needs. */
function sizes(sourceWidth: number) {
  const share = sourceWidth / SOURCE_WIDTH;
  const round = (value: number) => Math.ceil(value * 10) / 10;
  return `(min-width: ${WIDE_MIN_WIDTH}) min(${String(round(share * WIDE_STAGE_VW))}vw, ${String(
    Math.ceil(share * WIDE_STAGE_MAX_PX),
  )}px), ${String(round(share * 100))}vw`;
}

/** Intro channel, then the ambient channel, each owning its own transform. */
function Channels({
  node,
  transformOrigin,
  restHidden,
  children,
}: Readonly<{ node: string; transformOrigin: string; restHidden?: boolean; children: ReactNode }>) {
  return (
    <div
      className="hh-node"
      data-hh-node={node}
      data-rest-hidden={restHidden === true ? "" : undefined}
      style={{ transformOrigin }}
    >
      <div className="hh-node" data-hh-node={`${node}:loop`} style={{ transformOrigin }}>
        {children}
      </div>
    </div>
  );
}

function ImageView({ layer, scene }: Readonly<{ layer: ImageLayer; scene: SceneDefinition }>) {
  const asset = sceneAsset(scene.id, layer.asset);
  const box: SourceRect = [asset.x, asset.y, asset.w, asset.h];
  const layerSizes = sizes(asset.w);
  return (
    <div className="hh-layer" style={boxStyle(box)}>
      <Channels
        node={layer.node ?? layer.asset}
        restHidden={layer.restHidden}
        transformOrigin={origin(layer.origin, box)}
      >
        <picture>
          {asset.avif === null ? null : (
            <source sizes={layerSizes} srcSet={asset.avif} type="image/avif" />
          )}
          <img
            alt=""
            decoding="async"
            draggable={false}
            sizes={layerSizes}
            src={asset.webpLargest}
            srcSet={asset.webp}
            style={layer.mask === undefined ? undefined : { clipPath: polygon(layer.mask, box) }}
          />
        </picture>
      </Channels>
    </div>
  );
}

function FillView({ layer }: Readonly<{ layer: FillLayer }>) {
  return (
    <div
      className="hh-fill"
      data-hh-node={layer.node}
      data-paint={layer.paint}
      style={{ clipPath: polygon(layer.polygon, FULL_SPACE) }}
    />
  );
}

function OverlayView({ layer }: Readonly<{ layer: OverlayLayer }>) {
  return (
    <div
      className="hh-overlay"
      data-effect={layer.effect}
      data-hh-node={layer.node}
      style={boxStyle(layer.rect ?? FULL_SPACE)}
    />
  );
}

/** Extends a traced stroke past both ends so flat caps never trim the drawn arc. */
function strokePath(points: readonly Point[]) {
  const extend = (from: Point, to: Point): Point => {
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1;
    return [to[0] + ((to[0] - from[0]) / length) * 14, to[1] + ((to[1] - from[1]) / length) * 14];
  };
  const [first, second] = [points[0], points[1]];
  const [last, beforeLast] = [points.at(-1), points.at(-2)];
  if (
    first === undefined ||
    second === undefined ||
    last === undefined ||
    beforeLast === undefined
  ) {
    return "";
  }
  const path = [extend(second, first), ...points, extend(beforeLast, last)];
  return path
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${String(x)} ${String(y)}`)
    .join(" ");
}

function ArcView({ layer, scene }: Readonly<{ layer: ArcLayer; scene: SceneDefinition }>) {
  const asset = sceneAsset(scene.id, layer.asset);
  const maskId = `hh-thread-${useId().replace(/[^\w-]/gu, "")}`;
  return (
    <svg
      className="hh-arcs"
      preserveAspectRatio="none"
      viewBox={`0 0 ${String(SOURCE_WIDTH)} ${String(SOURCE_HEIGHT)}`}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {layer.strokes.map((stroke) => (
            <path
              className="hh-thread"
              d={strokePath(stroke.points)}
              data-hh-node={stroke.node}
              fill="none"
              key={stroke.node}
              pathLength={1}
              stroke="white"
              strokeLinejoin="round"
              strokeWidth={30}
            />
          ))}
        </mask>
      </defs>
      <image
        height={asset.h}
        href={asset.webpLargest}
        mask={`url(#${maskId})`}
        preserveAspectRatio="none"
        width={asset.w}
        x={asset.x}
        y={asset.y}
      />
    </svg>
  );
}

function GroupView({ layer, scene }: Readonly<{ layer: GroupLayer; scene: SceneDefinition }>) {
  const content = layer.children.map((child, index) => (
    <LayerView key={index} layer={child} scene={scene} />
  ));
  return (
    <div
      className="hh-group"
      style={layer.clip === undefined ? undefined : { clipPath: polygon(layer.clip, FULL_SPACE) }}
    >
      {layer.node === undefined ? (
        content
      ) : (
        <Channels node={layer.node} transformOrigin={origin(layer.origin, FULL_SPACE)}>
          {content}
        </Channels>
      )}
    </div>
  );
}

function LayerView({ layer, scene }: Readonly<{ layer: SceneLayer; scene: SceneDefinition }>) {
  switch (layer.kind) {
    case "image":
      return <ImageView layer={layer} scene={scene} />;
    case "fill":
      return <FillView layer={layer} />;
    case "overlay":
      return <OverlayView layer={layer} />;
    case "arcs":
      return <ArcView layer={layer} scene={scene} />;
    case "group":
      return <GroupView layer={layer} scene={scene} />;
  }
}

/** Source space placed so the window shows exactly its own part of it. */
function windowSpaceStyle([x, y, width, height]: SourceRect): CSSProperties {
  return {
    left: percent(-x, width),
    top: percent(-y, height),
    width: percent(SOURCE_WIDTH, width),
  };
}

/**
 * The scene's sheet of the page at one fixed size: the ink-framed panel window placed on the
 * paper, and an unclipped escape plane over the whole sheet for whatever breaks out of the panel.
 * Decorative only; the hero copy carries the meaning.
 */
export function HeroStage({
  scene,
  ref,
}: Readonly<{ scene: SceneDefinition; ref?: Ref<HTMLDivElement> }>) {
  return (
    <div
      aria-hidden="true"
      className="hh-stage"
      data-paper={scene.paper}
      data-scene={scene.id}
      ref={ref}
    >
      <div className="hh-sheet">
        <div className="hh-window" style={boxStyle(scene.window)}>
          <div className="hh-space" style={windowSpaceStyle(scene.window)}>
            {scene.layers.map((layer, index) => (
              <LayerView key={index} layer={layer} scene={scene} />
            ))}
          </div>
        </div>
        {scene.escape === undefined ? null : (
          <div className="hh-escape">
            <div className="hh-space">
              {scene.escape.map((layer, index) => (
                <LayerView key={index} layer={layer} scene={scene} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
