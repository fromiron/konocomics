import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

import { siteAssets } from "./scripts/site-assets";
import { runtimeCatalogAssets } from "./scripts/catalog/runtime-assets-plugin";
import { catalogV1Schema } from "./src/domain/catalog/schema";
import { recommendationContextSchema } from "./src/domain/recommendation/context-schema";
import contextJson from "./src/data/generated/recommendation-context-v1.json" with { type: "json" };
import catalogJson from "./src/data/generated/catalog-v1.json" with { type: "json" };
import { catalogAssetUrl, recommendationContextAssetUrl } from "./src/lib/catalog-asset.ts";
import { securityHeaders } from "./src/lib/site-metadata";

export const prerenderPaths = [
  "/",
  "/onboarding",
  "/taste",
  "/recommendations",
  "/library",
  "/settings",
  "/works/external",
  "/share",
  "/about",
  ...catalogJson.works.map((work) => `/works/${encodeURIComponent(work.id)}`),
];

export default defineConfig({
  plugins: [
    siteAssets(prerenderPaths),
    runtimeCatalogAssets(
      catalogV1Schema.parse(catalogJson),
      recommendationContextSchema.parse(contextJson),
    ),
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
        "/**": { headers: securityHeaders },
        "/catalog/nodes/**": {
          headers: { "cache-control": "public, max-age=31536000, immutable" },
        },
        [catalogAssetUrl(catalogJson.catalogVersion)]: {
          headers: { "cache-control": "public, max-age=31536000, immutable" },
        },
        [recommendationContextAssetUrl(catalogJson.catalogVersion)]: {
          headers: { "cache-control": "public, max-age=31536000, immutable" },
        },
      },
    }),
  ],
  resolve: { tsconfigPaths: true },
  server: {
    headers: securityHeaders,
    port: 3030,
    strictPort: true,
    watch: {
      ignored: [
        "**/.tmp/**",
        "**/.workspace/**",
        "**/data/local/catalog-authoring/**",
        "**/.output/**",
        "**/.pnpm-store/**",
        "**/.qa/**",
        "**/.playwright-cli/**",
        "**/handoff/**",
      ],
    },
  },
});
