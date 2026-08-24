import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { catalogAssetFilename } from "@/lib/catalog-asset";
import { buildCatalog } from "../../../scripts/build-catalog";

const temporaryRoots: string[] = [];

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("catalog build", () => {
  it("writes the complete artifact set under an alternate root", () => {
    const root = mkdtempSync(join(tmpdir(), "konocomics-catalog-build-"));
    temporaryRoots.push(root);
    mkdirSync(join(root, "data"), { recursive: true });
    cpSync(resolve("data/source"), join(root, "data/source"), { recursive: true });
    vi.spyOn(console, "log").mockImplementation(() => undefined);

    const result = buildCatalog(root);
    const expectedPaths = [
      resolve(root, "data/generated/catalog-v1.json"),
      resolve(root, "src/data/generated/catalog-v1.json"),
      resolve(root, "public/catalog", catalogAssetFilename(result.catalog.catalogVersion)),
      resolve(root, "data/generated/recommendation-context-v1.json"),
      resolve(root, "src/data/generated/recommendation-context-v1.json"),
      resolve(root, "data/generated/recommendation-profile-catalog-v1.json"),
      resolve(root, "data/generated/recommendation-profile-context-v1.json"),
      resolve(root, "src/data/generated/catalog-identity-v1.json"),
      resolve(root, "src/data/generated/landing-v1.json"),
    ].sort();

    expect([...result.artifactPaths].sort()).toEqual(expectedPaths);
    expect(expectedPaths.every((path) => existsSync(path))).toBe(true);
    expect(JSON.parse(readFileSync(expectedPaths[0]!, "utf8"))).toEqual(result.catalog);
    expect(
      JSON.parse(
        readFileSync(resolve(root, "data/generated/recommendation-context-v1.json"), "utf8"),
      ),
    ).toEqual(result.context);
  }, 30_000);
});
