import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { catalogAssetFilename, recommendationContextAssetFilename } from "@/lib/catalog-asset";
import { buildCatalog } from "../../../scripts/build-catalog";
import * as pipeline from "../../../scripts/catalog/pipeline";
import { validateCatalogArtifacts } from "../../../scripts/validate-catalog";
import { reportCoverage } from "../../../scripts/report-coverage";

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

    const pipelineSpy = vi.spyOn(pipeline, "runCatalogPipelineFromAuthority");
    const result = buildCatalog(root, "authority", { verify: true, compact: true });
    expect(pipelineSpy).toHaveBeenCalledTimes(1);
    expect(validateCatalogArtifacts(root, result, true).errorCount).toBe(0);
    expect(reportCoverage(result, true).failCount).toBe(0);
    expect(pipelineSpy).toHaveBeenCalledTimes(1);
    const expectedPaths = [
      resolve(root, "data/generated/catalog-v1.json"),
      resolve(root, "src/data/generated/catalog-v1.json"),
      resolve(root, "public/catalog", catalogAssetFilename(result.catalog.catalogVersion)),
      resolve(root, "data/generated/recommendation-context-v1.json"),
      resolve(root, "src/data/generated/recommendation-context-v1.json"),
      resolve(
        root,
        "public/catalog",
        recommendationContextAssetFilename(result.catalog.catalogVersion),
      ),
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

    const catalogPath = resolve(root, "data/generated/catalog-v1.json");
    writeFileSync(catalogPath, "{}\n");
    expect(validateCatalogArtifacts(root, result, true).artifactErrors).toEqual([
      `Generated Catalog is stale or not byte-identical: ${catalogPath}`,
    ]);
    rmSync(catalogPath);
    expect(validateCatalogArtifacts(root, result, true).artifactErrors).toEqual([
      `Generated Catalog is missing or unreadable: ${catalogPath}`,
    ]);
    const incomplete = structuredClone(result);
    const work = incomplete.catalog.works.find(
      (entry) => entry.eligibility.recommendationEligible,
    )!;
    for (const axis of Object.values(work.axes)) {
      Object.assign(axis, { state: "unknown" });
    }
    expect(reportCoverage(incomplete, true).failCount).toBe(1);
    incomplete.issues.push({
      severity: "error",
      code: "TEST_SOURCE_ERROR",
      file: "works.csv",
      message: "Regression source failure",
    });
    // All three artifact copies disagree with the changed catalog, plus the source error.
    expect(validateCatalogArtifacts(root, incomplete, true).errorCount).toBe(4);
    expect(reportCoverage(incomplete, true).sourceErrors).toBe(true);
  }, 30_000);
});
