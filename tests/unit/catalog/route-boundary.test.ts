import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("Catalog route boundaries", () => {
  it("keeps the shared client shell and identity-only consumers out of the full Catalog graph", () => {
    for (const path of [
      "src/features/catalog/catalog-provider.tsx",
      "src/components/nav/app-shell.tsx",
      "src/features/landing/landing-flow.tsx",
      "src/features/settings/settings-flow.tsx",
    ]) {
      expect(source(path)).not.toContain("@/data/generated/catalog-v1.json");
    }

    expect(source("src/components/nav/app-shell.tsx")).toContain("useCatalogIdentity");
    expect(source("src/features/landing/landing-flow.tsx")).toContain("useCatalogIdentity");
    expect(source("src/features/settings/settings-flow.tsx")).toContain("useCatalogIdentity");
  });

  it("wraps only synchronous full-Catalog routes with BundledCatalogProvider", () => {
    for (const path of [
      "src/app/onboarding/page.tsx",
      "src/app/taste/page.tsx",
      "src/app/library/page.tsx",
      "src/app/works/[workId]/page.tsx",
    ]) {
      expect(source(path)).toContain("<BundledCatalogProvider>");
    }

    for (const path of [
      "src/app/page.tsx",
      "src/app/recommendations/page.tsx",
      "src/app/settings/page.tsx",
      "src/app/works/external/page.tsx",
    ]) {
      expect(source(path)).not.toContain("<BundledCatalogProvider>");
    }
  });

  it("loads recommendations from the versioned static asset without an API or RSC fetch", () => {
    const page = source("src/app/recommendations/page.tsx");
    const shell = source("src/components/nav/app-shell.tsx");
    const provider = source("src/features/catalog/static-asset-catalog-provider.tsx");

    expect(page).not.toContain("StaticAssetCatalogProvider");
    expect(shell).toContain('import("@/features/catalog/static-asset-catalog-provider")');
    expect(provider).not.toContain("/api/");
    expect(provider).not.toContain("@/data/generated/catalog-v1.json");
  });
});
