import { afterEach, describe, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";
import catalogJson from "@/data/generated/catalog-v1.json";
import contextJson from "@/data/generated/recommendation-context-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import { recommendationContextSchema } from "@/domain/recommendation/context-schema";
import {
  buildRecommendationPlan,
  buildRecommendationPlanSteps,
} from "@/domain/recommendation/rank";
import { summarizeMangaDna } from "@/domain/profile/dna-summary";
import { buildRuntimeAssets } from "../../../scripts/catalog/runtime-assets";
import {
  CATALOG_LEAF_MAX_BYTES,
  RECOMMENDATION_LEAF_MAX_BYTES,
  catalogNodeSchema,
} from "@/features/catalog/catalog-assets-schema";
import type { RecommendationInput } from "@/domain/recommendation/types";

const catalog = catalogV1Schema.parse(catalogJson);
const context = recommendationContextSchema.parse(contextJson);
const runtime = buildRuntimeAssets(catalog, context);
afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});
function serve() {
  const fetcher = vi.fn(async (url: string) => {
    const hash = url.split("/").pop()?.replace(".json", "");
    const body = runtime.assets.get(hash ?? "");
    return new Response(body ?? "missing", { status: body === undefined ? 404 : 200 });
  });
  vi.stubGlobal("fetch", fetcher);
  return fetcher;
}
describe("incremental Catalog assets", () => {
  it("binds bounded leaves to hashes and reuses unchanged nodes after one work changes", () => {
    const personalNodes = [runtime.manifest.root];
    while (personalNodes.length > 0) {
      const bytes = runtime.assets.get(personalNodes.pop()!)!;
      const node = catalogNodeSchema.parse(JSON.parse(bytes));
      if (node.kind === "directory") personalNodes.push(...Object.values(node.children));
      else expect(Buffer.byteLength(bytes)).toBeLessThanOrEqual(CATALOG_LEAF_MAX_BYTES);
    }
    for (const [hash, bytes] of runtime.assets) {
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(hash);
      const node = catalogNodeSchema.parse(JSON.parse(bytes));
      if (node.kind === "leaf")
        expect(Buffer.byteLength(bytes)).toBeLessThanOrEqual(RECOMMENDATION_LEAF_MAX_BYTES);
    }
    const changed = buildRuntimeAssets(
      {
        ...catalog,
        catalogVersion: "changed",
        works: catalog.works.map((work, index) =>
          index === 0 ? { ...work, title: `${work.title} revised` } : work,
        ),
      },
      context,
    );
    expect(
      [...runtime.assets.keys()].filter((hash) => !changed.assets.has(hash)).length,
    ).toBeLessThan(runtime.assets.size / 10);
  });
  it("fetches only personal leaves, preserves DNA, and assembles the exact full recommendation input", async () => {
    const fetcher = serve();
    const { loadCatalogSelection, loadCompleteCatalog } =
      await import("@/features/catalog/catalog-assets");
    const records: RecommendationInput["records"] = catalog.works
      .filter((work) => work.eligibility.recommendationEligible)
      .slice(0, 5)
      .map((work) => ({
        workId: work.id,
        readingState: "completed",
        reaction: "liked",
        updatedAt: "2026-10-01T00:00:00Z",
      }));
    const selected = await loadCatalogSelection(runtime.manifest, [
      ...records.map((record) => record.workId),
      "missing-work",
    ]);
    expect(selected.catalog.works.map((work) => work.id)).toEqual(
      records.map((record) => record.workId),
    );
    expect(summarizeMangaDna(selected.catalog.works, records)).toEqual(
      summarizeMangaDna(catalog.works, records),
    );
    expect(fetcher.mock.calls.length).toBeLessThan(16);
    const full = await loadCompleteCatalog(runtime.manifest);
    expect(full.catalog.works).toEqual(catalog.works);
    expect(full.context).toEqual(context);
    expect(full.catalog.volumes).toEqual(
      [...catalog.volumes].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
    );
    const input: RecommendationInput = {
      catalog,
      context,
      records,
      adjustments: { axes: {}, themes: {} },
      policies: {
        preferCompleted: false,
        preferHidden: false,
        preferVerified: false,
        excludeIncomplete: false,
      },
    };
    const expected = buildRecommendationPlan(input);
    const steps = buildRecommendationPlanSteps({ ...input, ...full });
    let next = steps.next();
    let yields = 0;
    while (!next.done) {
      yields++;
      next = steps.next();
    }
    expect(yields).toBeGreaterThan(1);
    expect(next.value).toEqual(expected);
  });
  it("rejects corruption and retries failed requests instead of caching a failure", async () => {
    const fetcher = serve();
    fetcher.mockImplementationOnce(async () => new Response("{}"));
    const { readCatalogNode } = await import("@/features/catalog/catalog-assets");
    await expect(readCatalogNode(runtime.manifest.root)).rejects.toThrow("digest mismatch");
    await expect(readCatalogNode(runtime.manifest.root)).resolves.toMatchObject({
      kind: "directory",
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("reads verified persistent cache offline and repairs a corrupt cached asset", async () => {
    const store = new Map<string, Response>();
    const cache = {
      match: vi.fn(async (url: string) => store.get(url)?.clone()),
      put: vi.fn(async (url: string, response: Response) => {
        store.set(url, response.clone());
      }),
      delete: vi.fn(async (url: string) => store.delete(url)),
    };
    vi.stubGlobal("caches", { open: async () => cache });
    const fetcher = serve();
    let assets = await import("@/features/catalog/catalog-assets");
    await assets.readCatalogNode(runtime.manifest.root);
    vi.resetModules();
    fetcher.mockRejectedValue(new Error("offline"));
    assets = await import("@/features/catalog/catalog-assets");
    await expect(assets.readCatalogNode(runtime.manifest.root)).resolves.toMatchObject({
      kind: "directory",
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
    vi.resetModules();
    store.set(`/catalog/nodes/${runtime.manifest.root}.json`, new Response("{}"));
    serve();
    assets = await import("@/features/catalog/catalog-assets");
    await expect(assets.readCatalogNode(runtime.manifest.root)).resolves.toMatchObject({
      kind: "directory",
    });
    expect(cache.delete).toHaveBeenCalledTimes(1);
  });
});
