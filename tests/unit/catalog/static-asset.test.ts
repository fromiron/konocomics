import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import { validateCatalog } from "@/domain/catalog/validate";
import { catalogAssetFilename, catalogAssetUrl } from "@/lib/catalog-asset";

const bundledBytes = readFileSync(resolve(process.cwd(), "src/data/generated/catalog-v1.json"));
const dataBytes = readFileSync(resolve(process.cwd(), "data/generated/catalog-v1.json"));
const bundledCatalog = catalogV1Schema.parse(catalogJson);
const assetPath = resolve(
  process.cwd(),
  "public/catalog",
  catalogAssetFilename(bundledCatalog.catalogVersion),
);
const assetBytes = readFileSync(assetPath);
const assetCatalog = catalogV1Schema.parse(JSON.parse(assetBytes.toString("utf8")));
const viteConfigSource = readFileSync(resolve(process.cwd(), "vite.config.ts"), "utf8");

describe("versioned static Catalog asset", () => {
  it("is byte-identical and semantically identical to both canonical generated copies", () => {
    expect(assetBytes.equals(bundledBytes)).toBe(true);
    expect(assetBytes.equals(dataBytes)).toBe(true);
    expect(assetCatalog).toEqual(bundledCatalog);
    expect(validateCatalog(assetCatalog)).toEqual([]);
    expect(catalogAssetUrl(bundledCatalog.catalogVersion)).toBe(
      `/catalog/catalog-v1.${bundledCatalog.catalogVersion}.json`,
    );
  });

  it("applies immutable Nitro caching only to the exact current content-addressed asset", () => {
    expect(viteConfigSource).toMatch(
      /\[catalogAssetUrl\(catalogJson\.catalogVersion\)\]:\s*\{\s*headers:\s*\{\s*"cache-control":\s*"public, max-age=31536000, immutable"\s*\}/u,
    );
    expect(viteConfigSource.match(/"cache-control"/gu)).toHaveLength(1);
  });
});
