import type { Plugin } from "vite";

import { securityHeaders, siteOrigin, siteThemeColor } from "../src/lib/site-metadata";
import { coreStrings } from "../src/lib/strings";

/** Public assets share the exact catalog paths used by prerendering; no runtime route. */
export function siteAssets(prerenderPaths: readonly string[]): Plugin {
  const publicPaths = prerenderPaths.filter(
    (path) => path === "/" || (path.startsWith("/works/") && path !== "/works/external"),
  );
  const assets = [
    {
      fileName: "sitemap.xml",
      contentType: "application/xml; charset=utf-8",
      source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPaths
        .map(
          (path) =>
            `  <url><loc>${new URL(path, siteOrigin).href.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</loc></url>`,
        )
        .join("\n")}\n</urlset>\n`,
    },
    {
      fileName: "robots.txt",
      contentType: "text/plain; charset=utf-8",
      source: `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`,
    },
    {
      fileName: "manifest.webmanifest",
      contentType: "application/manifest+json; charset=utf-8",
      source: `${JSON.stringify(
        {
          id: "/",
          name: coreStrings.appName,
          short_name: coreStrings.appName,
          description: coreStrings.metadata.description,
          lang: "ja",
          start_url: "/",
          scope: "/",
          display: "standalone",
          theme_color: siteThemeColor,
          background_color: siteThemeColor,
          icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            {
              src: "/icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        null,
        2,
      )}\n`,
    },
  ];
  return {
    name: "public-site-assets",
    applyToEnvironment: (environment) => environment.name === "client",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        for (const [name, value] of Object.entries(securityHeaders)) {
          response.setHeader(name, value);
        }
        const pathname = request.url?.split("?")[0];
        const asset = assets.find(({ fileName }) => pathname === `/${fileName}`);
        if (asset === undefined || (request.method !== "GET" && request.method !== "HEAD")) {
          next();
          return;
        }
        response.setHeader("Content-Type", asset.contentType);
        response.end(request.method === "HEAD" ? undefined : asset.source);
      });
    },
    generateBundle() {
      for (const { fileName, source } of assets) this.emitFile({ type: "asset", fileName, source });
    },
  };
}
