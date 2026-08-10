import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { catalogV1Schema } from "@/domain/catalog/schema";
import generatedCatalog from "../../../data/generated/catalog-v1.json";
import { ExperimentDataError } from "../../../scripts/experiment/errors";
import {
  loadExperimentProfiles,
  resolveExperimentProfilePaths,
} from "../../../scripts/experiment/profiles";

const catalog = catalogV1Schema.parse(generatedCatalog);
const fixtureDirectory = resolve("data/fixtures/experiment-profiles");
const fixturePaths = [
  resolve(fixtureDirectory, "warm-exploration.json"),
  resolve(fixtureDirectory, "tactical-mystery.json"),
  resolve(fixtureDirectory, "kinetic-competition.json"),
];

describe("experiment profile loading", () => {
  it("parses all approved fixtures and sorts them by profileId", async () => {
    const profiles = await loadExperimentProfiles(fixturePaths, catalog);
    expect(profiles.map((profile) => profile.profileId)).toEqual([
      "kinetic-competition",
      "tactical-mystery",
      "warm-exploration",
    ]);
  });

  it("rejects duplicate profile ids after parsing", async () => {
    const duplicatePath = resolve(fixtureDirectory, "tactical-mystery.json");
    await expect(
      loadExperimentProfiles([duplicatePath, duplicatePath], catalog),
    ).rejects.toBeInstanceOf(ExperimentDataError);
  });

  it("resolves explicit paths without discovering defaults", async () => {
    await expect(
      resolveExperimentProfilePaths(["custom/profile.json"], "/workspace"),
    ).resolves.toEqual(["/workspace/custom/profile.json"]);
  });

  it("discovers the approved fixture paths when profiles are omitted", async () => {
    const paths = await resolveExperimentProfilePaths([], process.cwd());
    expect(paths.map((path) => path.slice(fixtureDirectory.length + 1))).toEqual([
      "kinetic-competition.json",
      "tactical-mystery.json",
      "warm-exploration.json",
    ]);
  });
});
