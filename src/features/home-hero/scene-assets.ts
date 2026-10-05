import { z } from "zod";

import manifestJson from "./scene-assets.json";
import type { SceneId } from "./scene-types";

const fileSchema = z.object({
  format: z.enum(["avif", "webp"]),
  width: z.number().int().positive(),
  file: z.string().min(1),
});

const placementSchema = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number().positive(),
  h: z.number().positive(),
  files: z.array(fileSchema).min(1),
});

const manifestSchema = z.record(
  z.enum(["battle", "romance"]),
  z.record(z.string(), placementSchema),
);

const manifest = manifestSchema.parse(manifestJson);

/** Hashed URLs for every converted layer file (scripts/home-hero/prepare-assets.ts). */
const urls = import.meta.glob<string>("./assets/**/*.{avif,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

export type SceneAsset = Readonly<{
  x: number;
  y: number;
  w: number;
  h: number;
  avif: string | null;
  webp: string;
  /** Largest WebP, for SVG images that cannot pick from a srcset. */
  webpLargest: string;
}>;

function srcset(files: readonly z.infer<typeof fileSchema>[], format: "avif" | "webp") {
  const entries = files
    .filter((file) => file.format === format)
    .sort((left, right) => left.width - right.width)
    .map((file) => {
      const url = urls[`./assets/${file.file}`];
      if (url === undefined) throw new Error(`Missing hero asset file ${file.file}`);
      return { url, width: file.width };
    });
  return entries;
}

export function sceneAsset(scene: SceneId, id: string): SceneAsset {
  const placement = manifest[scene]?.[id];
  if (placement === undefined) throw new Error(`Unknown hero asset ${scene}/${id}`);
  const avif = srcset(placement.files, "avif");
  const webp = srcset(placement.files, "webp");
  const largest = webp.at(-1);
  if (largest === undefined) throw new Error(`Hero asset ${scene}/${id} has no WebP file`);
  const describe = (entries: typeof webp) =>
    entries.map((entry) => `${entry.url} ${String(entry.width)}w`).join(", ");
  return {
    x: placement.x,
    y: placement.y,
    w: placement.w,
    h: placement.h,
    avif: avif.length === 0 ? null : describe(avif),
    webp: describe(webp),
    webpLargest: largest.url,
  };
}
