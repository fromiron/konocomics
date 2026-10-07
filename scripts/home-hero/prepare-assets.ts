/**
 * Converts the delivered home hero PNG layers into the cropped AVIF/WebP files the hero serves,
 * and writes their placement in each scene's 1536x1024 source space.
 *
 * Every layer keeps its delivered pixels: the script only crops to the area a scene can show
 * (including camera and intro travel) and halves the size for small screens. Registration
 * transforms come from the delivered asset maps (`source = native * scale + translate`).
 *
 * Usage: pnpm exec tsx scripts/home-hero/prepare-assets.ts --source <delivered tmp directory>
 * Needs ImageMagick 7 (`magick`) and libavif (`avifenc`) on PATH. Outputs are committed, so
 * neither tool is part of the app build.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { format, resolveConfig } from "prettier";

type Encoding = "avif" | "lossless";

type LayerJob = Readonly<{
  scene: "romance" | "battle";
  id: string;
  file: string;
  scale: number;
  translate: readonly [number, number];
  /** Source-space rectangle [x0, y0, x1, y1] the scene can ever show for this layer. */
  need?: readonly [number, number, number, number];
  encoding?: Encoding;
}>;

const ROMANCE_CHARACTERS = "러브코미디/expanded-characters/layers";
const ROMANCE_PANELS = "러브코미디/background-FX-panels/layers";
const BATTLE_CHARACTERS = "학원물/expanded-characters/layers";
const BATTLE_ENVIRONMENT = "학원물/expanded-environment-FX/layers";

/** The romance panel graphics share a 2304x1792 canvas whose source origin is (384, 384). */
const ROMANCE_GRAPHICS_TRANSLATE = [-384, -384] as const;

/** Petal origins in the 1536x1024 petal plate, which shares source space (assetmap.json). */
const ROMANCE_PETALS: readonly (readonly [number, number])[] = [
  [31, 48],
  [164, 76],
  [298, 132],
  [160, 188],
  [479, 210],
  [253, 233],
  [701, 289],
  [398, 308],
  [111, 317],
  [879, 404],
  [544, 416],
  [703, 459],
  [1016, 488],
  [564, 510],
  [881, 552],
  [1187, 586],
  [1067, 625],
  [940, 672],
  [1331, 708],
  [1134, 805],
  [1452, 809],
  [1280, 810],
  [1415, 817],
];

const jobs: readonly LayerJob[] = [
  {
    scene: "romance",
    id: "bg",
    file: `${ROMANCE_PANELS}/04-campus-background-overscan.png`,
    scale: 1.4143646408839778,
    translate: [-256, -192],
    need: [320, -16, 1536, 1180],
  },
  {
    scene: "romance",
    id: "pair",
    file: `${ROMANCE_CHARACTERS}/01-contact-locked-pair-fullbody.png`,
    scale: 1.59,
    translate: [160, -218],
    need: [300, -16, 1536, 1270],
  },
  {
    scene: "romance",
    id: "inset-downcast",
    file: `${ROMANCE_CHARACTERS}/02-B-downcast-expanded.png`,
    scale: 0.47,
    translate: [-137, -126],
    need: [8, -4, 440, 236],
  },
  {
    scene: "romance",
    id: "inset-upturned",
    file: `${ROMANCE_CHARACTERS}/03-B-upturned-expanded.png`,
    scale: 0.7,
    translate: [-245, 111],
    need: [-16, 206, 432, 640],
  },
  {
    scene: "romance",
    id: "paper",
    file: `${ROMANCE_PANELS}/06-panel-paper-overscan.png`,
    scale: 1,
    translate: ROMANCE_GRAPHICS_TRANSLATE,
    need: [0, 0, 1536, 1024],
    encoding: "lossless",
  },
  {
    scene: "romance",
    id: "ink",
    file: `${ROMANCE_PANELS}/07-panel-ink-overscan.png`,
    scale: 1,
    translate: ROMANCE_GRAPHICS_TRANSLATE,
    need: [0, 0, 1536, 1024],
    encoding: "lossless",
  },
  {
    scene: "romance",
    id: "arcs",
    file: `${ROMANCE_PANELS}/09-romance-arcs-overscan.png`,
    scale: 1,
    translate: ROMANCE_GRAPHICS_TRANSLATE,
    need: [0, 0, 1536, 1024],
    encoding: "lossless",
  },
  ...ROMANCE_PETALS.map((origin, index): LayerJob => ({
    scene: "romance",
    id: `petal-${String(index + 1).padStart(2, "0")}`,
    file: `${ROMANCE_PANELS}/petals-individual/petal-${String(index + 1).padStart(2, "0")}.png`,
    scale: 1,
    translate: origin,
  })),
  {
    scene: "battle",
    id: "bg",
    file: `${BATTLE_ENVIRONMENT}/05-background-overscan.png`,
    // The suggested 1024x683 pan viewport at (212, 100) fills the 1536x1024 source.
    scale: 1.5,
    translate: [-318, -150],
    need: [-48, -48, 1584, 940],
  },
  {
    scene: "battle",
    id: "fx",
    file: `${BATTLE_ENVIRONMENT}/05-FX-speed-lines-debris.png`,
    // The suggested FX viewport sits at (212, 202) with the same 1.5 scale.
    scale: 1.5,
    translate: [-318, -303],
    need: [-120, -120, 1656, 1000],
  },
  {
    scene: "battle",
    id: "ink",
    file: `${BATTLE_ENVIRONMENT}/05-panel-ink-source.png`,
    scale: 1,
    translate: [0, 0],
    encoding: "lossless",
  },
  {
    scene: "battle",
    id: "boy",
    file: `${BATTLE_CHARACTERS}/05-A-full-body.png`,
    scale: 1.2456056739791896,
    translate: [-405.4516132613992, -227.06297546264625],
    need: [-200, -120, 1700, 1030],
  },
  {
    scene: "battle",
    id: "girl",
    file: `${BATTLE_CHARACTERS}/05-B-reaction-expanded.png`,
    scale: 0.482202424192361,
    translate: [649.3960136151272, -58.58653064496922],
    need: [660, -40, 1560, 500],
  },
  {
    scene: "battle",
    id: "kid",
    file: `${BATTLE_CHARACTERS}/05-C-reaction-expanded.png`,
    scale: 0.3863832376876815,
    translate: [1039.0679012417463, 45.39539350384816],
    need: [660, -40, 1560, 500],
  },
];

/** Layers wider than this also get a half-size file for small or low-density screens. */
const HALF_SIZE_MIN_WIDTH = 480;

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function magick(...args: string[]) {
  return execFileSync("magick", args, { encoding: "utf8" }).trim();
}

/** Bounding box of the visible pixels as [x, y, width, height]. */
function visibleBox(file: string): [number, number, number, number] {
  const [imageWidth, imageHeight, alpha] = magick(file, "-format", "%w %h %A", "info:").split(" ");
  if (alpha === "Undefined" || alpha === "False") {
    return [0, 0, Number(imageWidth), Number(imageHeight)];
  }
  // A 1 px empty border keeps the trim's background colour right even when the content touches
  // the image edges; the border is then taken back out of the offsets.
  const box = magick(
    file,
    "-alpha",
    "extract",
    "-threshold",
    "0",
    "-bordercolor",
    "black",
    "-border",
    "1",
    "-format",
    "%@",
    "info:",
  );
  const match = /^(\d+)x(\d+)\+(\d+)\+(\d+)$/u.exec(box);
  if (match === null) throw new Error(`Unexpected trim box ${box} for ${file}`);
  const [, width, height, x, y] = match.map(Number);
  return [x! - 1, y! - 1, width!, height!];
}

function encode(input: string, output: string, encoding: Encoding, width?: number) {
  const resize = width === undefined ? [] : ["-resize", `${String(width)}x`];
  if (encoding === "lossless") {
    magick(input, ...resize, "-define", "webp:lossless=true", "-define", "webp:method=6", output);
    return;
  }
  if (output.endsWith(".webp")) {
    magick(
      input,
      ...resize,
      "-quality",
      "84",
      "-define",
      "webp:alpha-quality=95",
      "-define",
      "webp:method=6",
      output,
    );
    return;
  }
  const resized = `${output}.png`;
  magick(input, ...resize, resized);
  execFileSync("avifenc", ["-q", "66", "--qalpha", "90", "-s", "4", "-y", "444", resized, output], {
    stdio: "ignore",
  });
  rmSync(resized);
}

function sha256(file: string) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

const sourceRoot = argument("--source");
if (sourceRoot === undefined) {
  throw new Error("Pass --source <directory that holds the delivered genre folders>");
}

const repoRoot = path.resolve(import.meta.dirname, "../..");
const assetRoot = path.join(repoRoot, "src/features/home-hero/assets");
const work = mkdtempSync(path.join(tmpdir(), "home-hero-assets-"));
rmSync(assetRoot, { recursive: true, force: true });

type Placement = {
  x: number;
  y: number;
  w: number;
  h: number;
  files: { format: "avif" | "webp"; width: number; file: string }[];
  source: { file: string; sha256: string; crop: [number, number, number, number] };
};
const manifest: Record<string, Record<string, Placement>> = {};

try {
  for (const job of jobs) {
    const input = path.join(sourceRoot, job.file);
    const [bx, by, bw, bh] = visibleBox(input);
    let [x0, y0, x1, y1] = [bx, by, bx + bw, by + bh];
    if (job.need !== undefined) {
      const [nx0, ny0, nx1, ny1] = job.need.map((value, index) =>
        index % 2 === 0
          ? (value - job.translate[0]) / job.scale
          : (value - job.translate[1]) / job.scale,
      ) as [number, number, number, number];
      x0 = Math.max(x0, Math.floor(nx0));
      y0 = Math.max(y0, Math.floor(ny0));
      x1 = Math.min(x1, Math.ceil(nx1));
      y1 = Math.min(y1, Math.ceil(ny1));
    }
    const cropWidth = x1 - x0;
    const cropHeight = y1 - y0;
    const cropped = path.join(work, `${job.scene}-${job.id}.png`);
    magick(
      input,
      "-crop",
      `${String(cropWidth)}x${String(cropHeight)}+${String(x0)}+${String(y0)}`,
      "+repage",
      cropped,
    );

    const outputDirectory = path.join(assetRoot, job.scene);
    mkdirSync(outputDirectory, { recursive: true });
    const encoding = job.encoding ?? "avif";
    const widths =
      cropWidth >= HALF_SIZE_MIN_WIDTH ? [cropWidth, Math.round(cropWidth / 2)] : [cropWidth];
    const formats = encoding === "lossless" ? (["webp"] as const) : (["avif", "webp"] as const);
    const files: Placement["files"] = [];
    for (const format of formats) {
      for (const width of widths) {
        const name = `${job.id}-${String(width)}.${format}`;
        encode(
          cropped,
          path.join(outputDirectory, name),
          encoding,
          width === cropWidth ? undefined : width,
        );
        files.push({ format, width, file: `${job.scene}/${name}` });
      }
    }

    const round = (value: number) => Math.round(value * 100) / 100;
    manifest[job.scene] ??= {};
    manifest[job.scene]![job.id] = {
      x: round(job.translate[0] + x0 * job.scale),
      y: round(job.translate[1] + y0 * job.scale),
      w: round(cropWidth * job.scale),
      h: round(cropHeight * job.scale),
      files,
      source: { file: job.file, sha256: sha256(input), crop: [x0, y0, cropWidth, cropHeight] },
    };
    console.log(`${job.scene}/${job.id}: ${String(cropWidth)}x${String(cropHeight)}`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

const manifestPath = path.join(repoRoot, "src/features/home-hero/scene-assets.json");
writeFileSync(
  manifestPath,
  await format(JSON.stringify(manifest), {
    ...(await resolveConfig(manifestPath)),
    filepath: manifestPath,
  }),
);
