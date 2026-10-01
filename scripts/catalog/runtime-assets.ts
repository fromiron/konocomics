import { createHash } from "node:crypto";
import type { CatalogV1, Work } from "../../src/domain/catalog/types";
import type { RecommendationContext } from "../../src/domain/recommendation/types";
import {
  CATALOG_LEAF_MAX_BYTES,
  RECOMMENDATION_LEAF_MAX_BYTES,
  type CatalogManifest,
  type CatalogNode,
} from "../../src/features/catalog/catalog-assets-schema";

export function buildRuntimeAssets(catalog: CatalogV1, context: RecommendationContext) {
  const assets = new Map<string, string>();
  const hashes = new Map(
    catalog.works.map((work) => [work.id, createHash("sha256").update(work.id).digest("hex")]),
  );
  const volumes = new Map<string, CatalogV1["volumes"]>();
  for (const volume of catalog.volumes)
    volumes.set(volume.workId, [...(volumes.get(volume.workId) ?? []), volume]);
  function emit(node: CatalogNode) {
    const bytes = JSON.stringify(node);
    const hash = createHash("sha256").update(bytes).digest("hex");
    assets.set(hash, bytes);
    return hash;
  }
  function split(works: Work[], depth: number, maxBytes: number): string {
    const leaf: CatalogNode = {
      kind: "leaf",
      catalog: {
        schemaVersion: 1,
        catalogVersion: "shard-v1",
        factorDictionaryVersion: "v1",
        works,
        volumes: works.flatMap((work) => volumes.get(work.id) ?? []),
        representativeVolumeByWorkId: Object.fromEntries(
          works.flatMap((work) => {
            const id = catalog.representativeVolumeByWorkId[work.id];
            return id === undefined ? [] : [[work.id, id]];
          }),
        ),
      },
      context: {
        constraintByWorkId: Object.fromEntries(
          works.flatMap((work) => {
            const value = context.constraintByWorkId[work.id];
            return value === undefined ? [] : [[work.id, value]];
          }),
        ),
        marketSnapshot: {
          catalogVersion: "shard-v1",
          catalogAverageRating: 0,
          byWorkId: Object.fromEntries(
            works.flatMap((work) => {
              const value = context.marketSnapshot.byWorkId[work.id];
              return value === undefined ? [] : [[work.id, value]];
            }),
          ),
        },
      },
    };
    if (Buffer.byteLength(JSON.stringify(leaf)) <= maxBytes) return emit(leaf);
    if (works.length <= 1 || depth >= 64)
      throw new Error("Catalog work exceeds static asset size budget");
    const groups = new Map<string, Work[]>();
    for (const work of works) {
      const key = hashes.get(work.id)![depth]!;
      groups.set(key, [...(groups.get(key) ?? []), work]);
    }
    return emit({
      kind: "directory",
      children: Object.fromEntries(
        [...groups]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, group]) => [key, split(group, depth + 1, maxBytes)]),
      ),
    });
  }
  const manifest: CatalogManifest = {
    schemaVersion: 1,
    catalogVersion: catalog.catalogVersion,
    workCount: catalog.works.length,
    catalogAverageRating: context.marketSnapshot.catalogAverageRating,
    root: split(catalog.works, 0, CATALOG_LEAF_MAX_BYTES),
    recommendationRoot: split(catalog.works, 0, RECOMMENDATION_LEAF_MAX_BYTES),
  };
  return { manifest, assets };
}
