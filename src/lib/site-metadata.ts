import { coreStrings, landingStrings } from "./strings";

export const siteOrigin = "https://konocomics.vercel.app";
// sRGB export of the --canvas token, for manifest/browser UI that expects a hex color.
export const siteThemeColor = "#02060c";
export const socialImagePath = "/media/site-share.png";

export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  // Static SSR hydration uses inline scripts. This covers embedding, base URLs, form
  // targets, objects, and event attributes; it is not a strict script CSP.
  "Content-Security-Policy":
    "base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src-attr 'none'",
};

export function siteMetadata(pathname: string, indexable: boolean) {
  const url = new URL(pathname, siteOrigin).href;
  const imageUrl = new URL(socialImagePath, siteOrigin).href;
  return {
    meta: [
      { name: "theme-color", content: siteThemeColor },
      { name: "application-name", content: coreStrings.appName },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ja_JP" },
      { property: "og:site_name", content: coreStrings.appName },
      { property: "og:title", content: landingStrings.metadataTitle },
      { property: "og:description", content: coreStrings.metadata.description },
      { property: "og:image", content: imageUrl },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: landingStrings.metadataTitle },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: landingStrings.metadataTitle },
      { name: "twitter:description", content: coreStrings.metadata.description },
      { name: "twitter:image", content: imageUrl },
      { name: "twitter:image:alt", content: landingStrings.metadataTitle },
      ...(indexable
        ? [{ property: "og:url", content: url }]
        : [{ name: "robots", content: "noindex,follow" }]),
    ],
    links: indexable ? [{ rel: "canonical", href: url }] : [],
  };
}
