import type { Plugin } from "vite";
import type { CatalogV1 } from "../../src/domain/catalog/types";
import type { RecommendationContext } from "../../src/domain/recommendation/types";
import { buildRuntimeAssets } from "./runtime-assets";

/** Transport assets belong to the app build, not to Catalog authoring authority. */
export function runtimeCatalogAssets(catalog: CatalogV1, context: RecommendationContext): Plugin {
  const runtime = buildRuntimeAssets(catalog, context);
  const virtualId = "virtual:catalog-runtime";
  const resolvedId = "\0" + virtualId;
  return {
    name: "runtime-catalog-assets",
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    load(id) {
      if (id === resolvedId) return "export default " + JSON.stringify(runtime.manifest) + ";";
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const match = /^\/catalog\/nodes\/([a-f0-9]{64})\.json$/.exec(
          request.url?.split("?")[0] ?? "",
        );
        if (match === null || (request.method !== "GET" && request.method !== "HEAD"))
          return next();
        const bytes = runtime.assets.get(match[1]!);
        if (bytes === undefined) {
          response.statusCode = 404;
          response.end();
          return;
        }
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        response.end(request.method === "HEAD" ? undefined : bytes);
      });
    },
    generateBundle() {
      for (const [hash, source] of runtime.assets)
        this.emitFile({ type: "asset", fileName: "catalog/nodes/" + hash + ".json", source });
    },
  };
}
