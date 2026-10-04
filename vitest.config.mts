import { fileURLToPath } from "node:url";

import { configDefaults, defineConfig } from "vitest/config";
import { runtimeCatalogAssets } from "./scripts/catalog/runtime-assets-plugin";
import catalogJson from "./src/data/generated/catalog-v1.json";
import contextJson from "./src/data/generated/recommendation-context-v1.json";
import { catalogV1Schema } from "./src/domain/catalog/schema";
import { recommendationContextSchema } from "./src/domain/recommendation/context-schema";

export default defineConfig({
  plugins: [
    runtimeCatalogAssets(
      catalogV1Schema.parse(catalogJson),
      recommendationContextSchema.parse(contextJson),
    ),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Catalog integration tests launch SQLite/Node processes and load the full catalog.
    // Bound file concurrency so those jobs do not starve component timers and I/O.
    maxWorkers: 4,
    exclude: [
      ...configDefaults.exclude,
      "tests/e2e/**",
      ".claude/worktrees/**",
      ".tmp/**",
      ".workspace/**",
      "data/local/catalog-authoring/**",
      "handoff/**",
    ],
  },
});
