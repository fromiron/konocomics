import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import catalogJson from "@/data/generated/catalog-v1.json";
import { parseExternalWorkId } from "@/domain/catalog/external-work";
import {
  externalWorkSearchSchema,
  landingSearchSchema,
  librarySearchSchema,
  onboardingSearchSchema,
  recommendationsSearchSchema,
  settingsSearchSchema,
  tasteSearchSchema,
} from "@/lib/route-search";
import { prerenderPaths } from "../../../vite.config";

function source(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

const externalWorkId = parseExternalWorkId(`ext:rakuten:v1:${"a".repeat(64)}`);
const clientOnlyRoutes = [
  "src/routes/onboarding.tsx",
  "src/routes/taste.tsx",
  "src/routes/recommendations.tsx",
  "src/routes/library.tsx",
  "src/routes/settings.tsx",
  "src/routes/works/external.tsx",
] as const;
const fixedPrerenderPaths = [
  "/",
  "/onboarding",
  "/taste",
  "/recommendations",
  "/library",
  "/settings",
  "/works/external",
] as const;
const routedSearchCases = [
  {
    parse: (input: unknown) => recommendationsSearchSchema.parse(input),
    valid: { preview: "monster", genre: "fantasy", sort: "recommended", shelf: "top_10" },
    malformed: {
      preview: ["monster"],
      genre: ["fantasy"],
      sort: ["recommended"],
      shelf: ["top_10"],
    },
    malformedDefault: {
      preview: undefined,
      genre: undefined,
      sort: undefined,
      shelf: undefined,
    },
  },
  {
    parse: (input: unknown) => librarySearchSchema.parse(input),
    valid: { state: "reading", q: "monster", sort: "title", view: "grid" },
    malformed: { state: ["reading"], q: ["monster"], sort: ["title"], view: ["grid"] },
    malformedDefault: {
      state: undefined,
      q: undefined,
      sort: undefined,
      view: undefined,
    },
  },
  {
    parse: (input: unknown) => settingsSearchSchema.parse(input),
    valid: { section: "data" },
    malformed: { section: ["data"] },
    malformedDefault: { section: undefined },
  },
] as const;

const contracts = [
  {
    name: "keeps the legacy landing and reveal flags typed for string and numeric router input",
    verify: () => {
      expect(landingSearchSchema.parse({ landing: "1" })).toEqual({ landing: "1" });
      expect(landingSearchSchema.parse({ landing: 1 })).toEqual({ landing: "1" });
      expect(tasteSearchSchema.parse({ reveal: "1" }).reveal).toBe("1");
      expect(tasteSearchSchema.parse({ reveal: 1 }).reveal).toBe("1");
    },
  },
  {
    name: "defaults malformed and repeated search values without throwing",
    verify: () => {
      expect(landingSearchSchema.parse({ landing: ["1", "1"] })).toEqual({
        landing: undefined,
      });
      expect(tasteSearchSchema.parse({ reveal: "yes", mode: ["adjust"] })).toEqual({
        mode: undefined,
        group: undefined,
        reveal: undefined,
      });
      expect(onboardingSearchSchema.parse({ q: ["monster"], genre: "unknown" })).toEqual({
        q: undefined,
        genre: undefined,
        shelf: undefined,
      });
      expect(
        externalWorkSearchSchema.parse({ workId: [externalWorkId, externalWorkId] }).workId,
      ).toBeUndefined();
      for (const { malformed, malformedDefault, parse, valid } of routedSearchCases) {
        expect(parse(valid)).toEqual(valid);
        expect(parse({})).toEqual({});
        expect(parse(malformed)).toEqual(malformedDefault);
      }
    },
  },
  {
    name: "keeps IndexedDB routes client-only while public and bundled work routes retain SSR",
    verify: () => {
      for (const route of clientOnlyRoutes) {
        expect(source(route)).toMatch(/\bssr:\s*false\b/u);
        expect(source(route)).toContain("validateSearch:");
      }
      for (const route of ["src/routes/index.tsx", "src/routes/works/$workId.tsx"]) {
        expect(source(route)).not.toMatch(/\bssr:\s*false\b/u);
        expect(source(route)).toContain("validateSearch:");
      }
      const rootRoute = source("src/routes/__root.tsx");
      expect(rootRoute).toContain("errorComponent:");
      expect(rootRoute).toContain("notFoundComponent:");
      expect(rootRoute).toContain("pendingComponent:");
      expect(source("src/routes/works/$workId.tsx")).toContain("throw notFound()");
    },
  },
  {
    name: "prerenders the seven fixed shells and all 150 bundled work paths",
    verify: () => {
      expect(catalogJson.works).toHaveLength(150);
      expect(new Set(catalogJson.works.map((work) => work.id))).toHaveLength(150);

      const expectedPaths = [
        ...fixedPrerenderPaths,
        ...catalogJson.works.map((work) => `/works/${encodeURIComponent(work.id)}`),
      ];
      expect(prerenderPaths).toHaveLength(expectedPaths.length);
      expect(new Set(prerenderPaths)).toEqual(new Set(expectedPaths));
    },
  },
] as const;

describe("TanStack route contract", () => {
  it.each(contracts)("$name", ({ verify }) => verify());
});
