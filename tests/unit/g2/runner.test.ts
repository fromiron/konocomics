import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { catalogV1Schema } from "@/domain/catalog/schema";
import { createG2Experiment, createG2Result, serializeG2Result } from "@/domain/g2";
import { experimentProfileV1Schema } from "@/domain/profile/experiment-schema";
import { strings } from "@/lib/strings";
import generatedCatalog from "../../../data/generated/catalog-v1.json";
import generatedContext from "../../../data/generated/recommendation-context-v1.json";
import { recommendationContextFileSchema } from "../../../scripts/experiment/inputs";
import { runG2Aggregate } from "../../../scripts/aggregate-g2";

const catalog = catalogV1Schema.parse(generatedCatalog);
const context = recommendationContextFileSchema.parse(generatedContext);
const execFileAsync = promisify(execFile);
const temporaryDirectories: string[] = [];
let canonicalResult = "";
let pilotExplanationTexts: string[] = [];

function sha256Hex(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

async function temporaryDirectory() {
  const directory = await mkdtemp(join(tmpdir(), "konocomics-g2-runner-test-"));
  temporaryDirectories.push(directory);
  return directory;
}

async function run(arguments_: readonly string[], workingDirectory = process.cwd()) {
  let stdout = "";
  let stderr = "";
  const exitCode = await runG2Aggregate(arguments_, {
    workingDirectory,
    writeStdout: (value) => {
      stdout += value;
    },
    writeStderr: (value) => {
      stderr += value;
    },
  });
  return { exitCode, stdout, stderr };
}

beforeAll(async () => {
  const base = experimentProfileV1Schema.parse(
    JSON.parse(
      await readFile(resolve("data/fixtures/experiment-profiles/tactical-mystery.json"), "utf8"),
    ),
  );
  const warm = experimentProfileV1Schema.parse(
    JSON.parse(
      await readFile(resolve("data/fixtures/experiment-profiles/warm-exploration.json"), "utf8"),
    ),
  );
  const sixthAnchor = warm.records.find((record) => record.workId === "frieren");
  if (sixthAnchor === undefined) {
    throw new Error("Missing sixth G2 fixture anchor");
  }
  const profile = experimentProfileV1Schema.parse({
    ...base,
    profileId: "pilot-runner",
    records: [...base.records, { ...sixthAnchor, updatedAt: "2000-01-01T00:00:00.000Z" }],
  });
  const experiment = await createG2Experiment({
    participantId: "pilot-runner",
    profile,
    catalog,
    context,
    sha256Hex,
    lexicon: strings.explanation,
  });
  pilotExplanationTexts = experiment.nativeLists.taste.items.flatMap(
    (item) => item.explanationTexts,
  );
  canonicalResult = serializeG2Result(
    createG2Result({
      experiment,
      respondent: { kind: "syntheticPilot", label: "manual-round-trip" },
      preResponses: experiment.distinctWorkIds.map((workId) => ({
        workId,
        familiarity: "unknown",
        wantToReadBefore: 4,
      })),
      listPreference: "tie",
      postResponses: (["A", "B"] as const).flatMap((slot) =>
        experiment.slots[slot].items.map((item) => ({
          slot,
          rank: item.rank,
          workId: item.workId,
          wantToReadAfter: 4,
          agreement: item.explanationAvailable ? 4 : null,
        })),
      ),
    }),
  );
});

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("G2 aggregate runner", () => {
  it("keeps inverse Axis preference direction explicit in the approved pilot profile", () => {
    const lowerComedy = "「ギャグ・コメディ」が控えめな点が、あなたの好みに合う作品です。";
    const directionlessComedy = "「ギャグ・コメディ」があなたの好みに合う作品です。";

    expect(pilotExplanationTexts.filter((text) => text === lowerComedy)).toHaveLength(3);
    expect(pilotExplanationTexts).not.toContain(directionlessComedy);
  });

  it("accepts a pilot, reports INCOMPLETE, and keeps stdout deterministic", async () => {
    const directory = await temporaryDirectory();
    const path = join(directory, "pilot.json");
    await writeFile(path, canonicalResult, "utf8");
    const first = await run(["--result", path]);
    const second = await run(["-r", path]);

    expect(second).toEqual(first);
    expect(first.exitCode).toBe(0);
    expect(first.stderr).toBe("");
    expect(first.stdout).toContain("Human: 0");
    expect(first.stdout).toContain("Synthetic pilot: 1");
    expect(first.stdout).toContain("Verdict: **INCOMPLETE**");
  });

  it("writes the same Markdown atomically and preserves a single final newline", async () => {
    const directory = await temporaryDirectory();
    const resultPath = join(directory, "pilot.json");
    const outputPath = join(directory, "reports/g2.md");
    await writeFile(resultPath, canonicalResult, "utf8");
    const stdoutResult = await run(["-r", resultPath]);
    const fileResult = await run(["-r", resultPath, "-o", outputPath]);

    expect(fileResult).toEqual({ exitCode: 0, stdout: "", stderr: "" });
    await expect(readFile(outputPath, "utf8")).resolves.toBe(stdoutResult.stdout);
    expect(stdoutResult.stdout.endsWith("\n")).toBe(true);
    expect(stdoutResult.stdout.endsWith("\n\n")).toBe(false);
    expect(stdoutResult.stdout).not.toContain("\r");
  });

  it("keeps the documented silent package command byte-identical", async () => {
    const directory = await temporaryDirectory();
    const resultPath = join(directory, "pilot.json");
    const localTemp = join(directory, "tmp");
    await mkdir(localTemp);
    await writeFile(resultPath, canonicalResult, "utf8");
    const expected = await run(["-r", resultPath]);
    const actual = await execFileAsync("pnpm", ["--silent", "g2:aggregate", "-r", resultPath], {
      cwd: process.cwd(),
      env: { ...process.env, TMPDIR: localTemp },
      maxBuffer: 1024 * 1024,
    });

    expect(actual.stdout).toBe(expected.stdout);
    expect(actual.stderr).toBe("");
  });

  it("returns usage 2 and data/runtime 1 without partial stdout", async () => {
    await expect(run(["--unknown"])).resolves.toMatchObject({
      exitCode: 2,
      stdout: "",
    });
    await expect(run(["--result", "missing.json"])).resolves.toMatchObject({
      exitCode: 1,
      stdout: "",
    });
  });

  it("rejects duplicate identities across catalog, context, and result inputs", async () => {
    const directory = await temporaryDirectory();
    const sharedPath = join(directory, "shared.json");
    await writeFile(sharedPath, canonicalResult, "utf8");

    await expect(
      run(["-r", sharedPath, "--catalog", sharedPath, "--context", sharedPath]),
    ).resolves.toMatchObject({ exitCode: 1, stdout: "" });
  });

  it("prints help without reading result files", async () => {
    const result = await run(["--help"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Usage: pnpm --silent g2:aggregate");
    expect(result.stderr).toBe("");
  });
});
