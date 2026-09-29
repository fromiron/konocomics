import { fileURLToPath } from "node:url";

import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
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
      ".tmp/**",
      ".workspace/**",
      "data/local/catalog-authoring/**",
      "handoff/**",
    ],
  },
});
