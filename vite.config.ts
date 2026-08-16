import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

import catalogJson from "./src/data/generated/catalog-v1.json" with { type: "json" };
import { catalogAssetUrl } from "./src/lib/catalog-asset.ts";

export const prerenderPaths = [
  "/",
  "/onboarding",
  "/taste",
  "/recommendations",
  "/library",
  "/settings",
  "/works/external",
  ...catalogJson.works.map((work) => `/works/${encodeURIComponent(work.id)}`),
];

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      pages: prerenderPaths.map((path) => ({ path })),
      prerender: {
        autoStaticPathsDiscovery: false,
        enabled: true,
        crawlLinks: false,
        failOnError: true,
      },
    }),
    viteReact(),
    nitro({
      routeRules: {
        [catalogAssetUrl(catalogJson.catalogVersion)]: {
          headers: { "cache-control": "public, max-age=31536000, immutable" },
        },
      },
    }),
  ],
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
});
