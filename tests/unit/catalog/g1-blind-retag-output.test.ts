import { mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { validateG1BlindRetagOutput } from "../../../scripts/catalog/g1-blind-retag-output";
import { AXIS_IDS } from "../../../src/domain/catalog/constants";
import sampleManifest from "../../../data/staging/g1/blind-retag/sample-manifest.json";

const ATTESTATION =
  "Isolation attestation: only input.md and factor-dictionary.md were read as local files; no other local files were read.";

describe("G1 blind-retag output", () => {
  it("binds the canonical four-file output to its exact isolated input and rationale", () => {
    const repositoryRoot = resolve(import.meta.dirname, "../../..");
    const root = mkdtempSync(join(tmpdir(), "konocomics-g1-blind-output-"));
    const staging = join(root, "data/staging/g1/blind-retag");
    const output = join(root, "output");
    const sourceStaging = join(repositoryRoot, "data/staging/g1/blind-retag");
    const input = readFileSync(join(sourceStaging, "input.md"), "utf8");
    const workIds = sampleManifest.selected.map(({ workId }) => workId);
    const authorizedUrls = workIds.map((workId) => {
      const row = input.split("\n").find((line) => line.startsWith(`| ${workId} `));
      const url = /<(https?:\/\/[^>]+)>/u.exec(row ?? "")?.[1];
      if (url === undefined) {
        throw new Error(`Missing test URL for ${workId}`);
      }
      return url;
    });
    const factors = [
      "workId,axisId,state,value,confidence,evidenceId",
      ...workIds.flatMap((workId) =>
        AXIS_IDS.map((axisId) => `${workId},${axisId},known,2,0.8,blind-retag-g1-v1-${workId}`),
      ),
    ].join("\n");
    const themes = [
      "workId,themeId,centrality,confidence,evidenceId",
      ...workIds.slice(1).map((workId) => `${workId},adventure,2,0.8,blind-retag-g1-v1-${workId}`),
    ].join("\n");
    const genres = [
      "workId,genres",
      ...workIds.map((workId, index) => `${workId},${index === 0 ? "" : "action;fantasy"}`),
    ].join("\n");
    const notes = [
      `Input SHA-256: \`${sampleManifest.inputSha256}\``,
      ATTESTATION,
      "",
      ...workIds.flatMap((workId, index) => [
        `## \`${workId}\``,
        `- Authorized URL: <${authorizedUrls[index]}>`,
        ...AXIS_IDS.map((axisId) => `- Axis \`${axisId}\`: observed entry-scope pattern`),
        ...(index === 0
          ? [
              "- Genre unknown: official entry evidence does not establish a Genre",
              "- Theme unknown: official entry evidence does not establish a Theme",
            ]
          : [
              "- Genre `action`: observed action pattern",
              "- Genre `fantasy`: observed fantasy pattern",
              "- Theme `adventure` (centrality 2): repeated central adventure pattern",
            ]),
        ...(index === workIds.length - 1 ? [] : [""]),
      ]),
    ].join("\n");
    const inputPath = join(staging, "input.md");

    try {
      mkdirSync(staging, { recursive: true });
      mkdirSync(output);
      writeFileSync(inputPath, input);
      writeFileSync(
        join(staging, "sample-manifest.json"),
        readFileSync(join(sourceStaging, "sample-manifest.json")),
      );
      writeFileSync(join(output, "factors.csv"), `${factors}\n`);
      writeFileSync(join(output, "themes.csv"), `${themes}\n`);
      writeFileSync(join(output, "genres.csv"), `${genres}\n`);
      writeFileSync(join(output, "notes.md"), `${notes}\n`);
      expect(() => validateG1BlindRetagOutput(root, output)).not.toThrow();

      writeFileSync(
        join(output, "notes.md"),
        `${notes.replace(
          "- Genre unknown: official entry evidence does not establish a Genre\n",
          "",
        )}\n`,
      );
      expect(() => validateG1BlindRetagOutput(root, output)).toThrow(/Genre markers/u);
      writeFileSync(join(output, "notes.md"), `${notes}\n`);

      writeFileSync(
        inputPath,
        input.replace("# G1 blind retag input", "# stale blind retag input"),
      );
      expect(() => validateG1BlindRetagOutput(root, output)).toThrow(/SHA-256/u);
      writeFileSync(inputPath, input);

      writeFileSync(
        join(output, "notes.md"),
        `${notes.replace(ATTESTATION, "Isolation attestation: denied.")}\n`,
      );
      expect(() => validateG1BlindRetagOutput(root, output)).toThrow(/positive isolation/u);
      writeFileSync(join(output, "notes.md"), `${notes}\n`);

      writeFileSync(
        join(output, "notes.md"),
        `${notes.replace("- Axis `progression`: observed entry-scope pattern", "- Axis `progression`: ")}\n`,
      );
      expect(() => validateG1BlindRetagOutput(root, output)).toThrow(/Axis markers/u);
      writeFileSync(join(output, "notes.md"), `${notes}\n`);

      writeFileSync(
        join(output, "notes.md"),
        `${notes.replace(authorizedUrls[0]!, "https://example.com/altered")}\n`,
      );
      expect(() => validateG1BlindRetagOutput(root, output)).toThrow(/authorized URL/u);
      writeFileSync(join(output, "notes.md"), `${notes}\n`);

      writeFileSync(
        join(output, "notes.md"),
        `${notes.replace("observed entry-scope pattern", "observed entry-scope pattern at https://example.com/extra")}\n`,
      );
      expect(() => validateG1BlindRetagOutput(root, output)).toThrow(/non-authorized URL/u);
      writeFileSync(join(output, "notes.md"), `${notes}\n`);

      writeFileSync(
        join(output, "factors.csv"),
        `${factors.replace("workId,axisId", " workId ,axisId")}\n`,
      );
      expect(() => validateG1BlindRetagOutput(root, output)).toThrow(/invalid header/u);
      writeFileSync(join(output, "factors.csv"), `${factors}\n`);

      writeFileSync(join(output, "extra.txt"), "unexpected\n");
      expect(() => validateG1BlindRetagOutput(root, output)).toThrow(/must contain only/u);
      unlinkSync(join(output, "extra.txt"));

      writeFileSync(
        join(output, "factors.csv"),
        `${factors.replace(",progression,", ",pacing,")}\n`,
      );
      expect(() => validateG1BlindRetagOutput(root, output)).toThrow(/factor order/u);
      writeFileSync(join(output, "factors.csv"), `${factors}\n`);

      const reorderedThemes = themes.split("\n");
      [reorderedThemes[1], reorderedThemes[2]] = [reorderedThemes[2]!, reorderedThemes[1]!];
      writeFileSync(join(output, "themes.csv"), `${reorderedThemes.join("\n")}\n`);
      expect(() => validateG1BlindRetagOutput(root, output)).toThrow(/theme order/u);
      writeFileSync(join(output, "themes.csv"), `${themes}\n`);

      writeFileSync(
        join(output, "genres.csv"),
        `${genres.replace("action;fantasy", "fantasy;action")}\n`,
      );
      expect(() => validateG1BlindRetagOutput(root, output)).toThrow(/canonically ordered/u);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
