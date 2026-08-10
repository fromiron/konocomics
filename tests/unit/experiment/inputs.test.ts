import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { catalogV1Schema } from "@/domain/catalog/schema";
import generatedCatalog from "../../../data/generated/catalog-v1.json";
import generatedContext from "../../../data/generated/recommendation-context-v1.json";
import { ExperimentDataError } from "../../../scripts/experiment/errors";
import {
  loadExperimentCatalog,
  loadRecommendationContext,
  recommendationContextFileSchema,
} from "../../../scripts/experiment/inputs";

const temporaryDirectories: string[] = [];

async function temporaryDirectory() {
  const directory = await mkdtemp(join(tmpdir(), "konocomics-input-test-"));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("experiment catalog and context boundaries", () => {
  it("strictly parses the committed catalog and context artifacts", async () => {
    const catalog = await loadExperimentCatalog(resolve("data/generated/catalog-v1.json"));
    const context = await loadRecommendationContext(
      resolve("data/generated/recommendation-context-v1.json"),
      catalog,
    );

    expect(catalog).toEqual(catalogV1Schema.parse(generatedCatalog));
    expect(context).toEqual(recommendationContextFileSchema.parse(generatedContext));
  });

  it("rejects unknown context fields before semantic validation", () => {
    expect(
      recommendationContextFileSchema.safeParse({ ...generatedContext, unexpected: true }).success,
    ).toBe(false);
    expect(
      recommendationContextFileSchema.safeParse({
        ...generatedContext,
        marketSnapshot: { ...generatedContext.marketSnapshot, unexpected: true },
      }).success,
    ).toBe(false);
  });

  it("rejects version drift and missing eligible-work constraint or market metadata", async () => {
    const directory = await temporaryDirectory();
    const catalog = catalogV1Schema.parse(generatedCatalog);
    const versionDriftPath = join(directory, "version-drift.json");
    await writeFile(
      versionDriftPath,
      JSON.stringify({
        ...generatedContext,
        marketSnapshot: { ...generatedContext.marketSnapshot, catalogVersion: "v1-other" },
      }),
      "utf8",
    );
    await expect(loadRecommendationContext(versionDriftPath, catalog)).rejects.toBeInstanceOf(
      ExperimentDataError,
    );

    const missingMetadataPath = join(directory, "missing-metadata.json");
    await writeFile(
      missingMetadataPath,
      JSON.stringify({ ...generatedContext, constraintByWorkId: {} }),
      "utf8",
    );
    await expect(loadRecommendationContext(missingMetadataPath, catalog)).rejects.toBeInstanceOf(
      ExperimentDataError,
    );

    const missingMarketPath = join(directory, "missing-market.json");
    await writeFile(
      missingMarketPath,
      JSON.stringify({
        ...generatedContext,
        marketSnapshot: { ...generatedContext.marketSnapshot, byWorkId: {} },
      }),
      "utf8",
    );
    await expect(loadRecommendationContext(missingMarketPath, catalog)).rejects.toBeInstanceOf(
      ExperimentDataError,
    );
  });

  it("rejects catalogs that pass zod but fail catalog semantics", async () => {
    const directory = await temporaryDirectory();
    const path = join(directory, "invalid-catalog.json");
    await writeFile(
      path,
      JSON.stringify({ ...generatedCatalog, representativeVolumeByWorkId: {} }),
      "utf8",
    );

    await expect(loadExperimentCatalog(path)).rejects.toBeInstanceOf(ExperimentDataError);
  });
});
