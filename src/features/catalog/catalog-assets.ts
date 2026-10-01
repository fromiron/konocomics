import type { CatalogV1 } from "@/domain/catalog/types";
import type { RecommendationContext } from "@/domain/recommendation/types";
import {
  CATALOG_ASSET_CACHE,
  catalogNodeSchema,
  catalogNodeUrl,
  type CatalogManifest,
  type CatalogNode,
} from "./catalog-assets-schema";

const pending = new Map<string, Promise<CatalogNode>>();
const resolved = new Map<string, CatalogNode>();
const MEMORY_NODE_LIMIT = 32;
export async function sha256(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function assetCache() {
  try {
    return typeof caches === "undefined" ? null : await caches.open(CATALOG_ASSET_CACHE);
  } catch {
    return null;
  }
}
export async function readCatalogNode(hash: string): Promise<CatalogNode> {
  const cached = resolved.get(hash);
  if (cached !== undefined) return cached;
  const existing = pending.get(hash);
  if (existing !== undefined) return existing;
  const request = (async () => {
    const url = catalogNodeUrl(hash);
    const cache = await assetCache();
    let response: Response | undefined;
    try {
      response = await cache?.match(url);
    } catch {
      /* Cache availability is optional. */
    }
    async function parse(value: Response) {
      if (!value.ok) throw new Error("Catalog asset request failed");
      const text = await value.text();
      if ((await sha256(text)) !== hash) throw new Error("Catalog asset digest mismatch");
      return catalogNodeSchema.parse(JSON.parse(text));
    }
    if (response !== undefined) {
      try {
        return await parse(response);
      } catch {
        try {
          await cache?.delete(url);
        } catch {
          /* Retry through the network. */
        }
      }
    }
    const fetched = await fetch(url, { cache: "no-cache" });
    const node = await parse(fetched.clone());
    try {
      await cache?.put(url, fetched);
    } catch {
      /* Quota/privacy settings cannot block loading. */
    }
    return node;
  })();
  pending.set(hash, request);
  try {
    const node = await request;
    resolved.set(hash, node);
    while (resolved.size > MEMORY_NODE_LIMIT) resolved.delete(resolved.keys().next().value!);
    return node;
  } finally {
    pending.delete(hash);
  }
}

export type CatalogSelection = { catalog: CatalogV1; context: RecommendationContext };
/** A selection is complete only for the requested IDs; never use it for whole-catalog ranking. */
export async function loadCatalogSelection(
  manifest: CatalogManifest,
  workIds: readonly string[],
): Promise<CatalogSelection> {
  const leaves = new Map<string, Extract<CatalogNode, { kind: "leaf" }>>();
  const ids = [...new Set(workIds)];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(4, ids.length) }, async () => {
      while (cursor < ids.length) {
        const id = ids[cursor++]!;
        const key = await sha256(id);
        let hash: string | undefined = manifest.root;
        let depth = 0;
        while (hash !== undefined) {
          const node = await readCatalogNode(hash);
          if (node.kind === "leaf") {
            leaves.set(hash, node);
            break;
          }
          if (depth >= 64) throw new Error("Invalid Catalog directory depth");
          hash = node.children[key[depth++]!];
        }
      }
    }),
  );
  return combineCatalogLeaves(manifest, [...leaves.values()], new Set(ids));
}
export function combineCatalogLeaves(
  manifest: CatalogManifest,
  leaves: readonly Extract<CatalogNode, { kind: "leaf" }>[],
  selected?: ReadonlySet<string>,
): CatalogSelection {
  const works = leaves
    .flatMap((leaf) => leaf.catalog.works)
    .filter((work) => selected === undefined || selected.has(work.id))
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const ids = new Set(works.map((work) => work.id));
  if (ids.size !== works.length || (selected === undefined && works.length !== manifest.workCount))
    throw new Error("Catalog tree identity mismatch");
  return {
    catalog: {
      schemaVersion: 1,
      catalogVersion: manifest.catalogVersion,
      factorDictionaryVersion: "v1",
      works,
      volumes: leaves
        .flatMap((leaf) => leaf.catalog.volumes)
        .filter((volume) => ids.has(volume.workId))
        .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
      representativeVolumeByWorkId: Object.fromEntries(
        leaves
          .flatMap((leaf) => Object.entries(leaf.catalog.representativeVolumeByWorkId))
          .filter(([id]) => ids.has(id)),
      ),
    },
    context: {
      constraintByWorkId: Object.fromEntries(
        leaves
          .flatMap((leaf) => Object.entries(leaf.context.constraintByWorkId))
          .filter(([id]) => ids.has(id)),
      ),
      marketSnapshot: {
        catalogVersion: manifest.catalogVersion,
        catalogAverageRating: manifest.catalogAverageRating,
        byWorkId: Object.fromEntries(
          leaves
            .flatMap((leaf) => Object.entries(leaf.context.marketSnapshot.byWorkId))
            .filter(([id]) => ids.has(id)),
        ),
      },
    },
  };
}
/** Used by the Worker: every leaf must succeed before the full candidate pool is available. */
export async function loadCompleteCatalog(manifest: CatalogManifest): Promise<CatalogSelection> {
  const leaves: Extract<CatalogNode, { kind: "leaf" }>[] = [];
  let queue = [manifest.recommendationRoot];
  const seen = new Set<string>();
  while (queue.length > 0) {
    const batch = queue.splice(0, 4);
    const nodes = await Promise.all(
      batch.map(async (hash) => {
        if (seen.has(hash)) throw new Error("Duplicate Catalog tree node");
        seen.add(hash);
        return readCatalogNode(hash);
      }),
    );
    for (const node of nodes) {
      if (node.kind === "leaf") leaves.push(node);
      else queue = [...queue, ...Object.values(node.children)];
    }
  }
  return combineCatalogLeaves(manifest, leaves);
}
