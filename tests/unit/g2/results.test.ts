import { createHash } from "node:crypto";
import { link, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { catalogV1Schema } from "@/domain/catalog/schema";
import {
  createG2Experiment,
  createG2Result,
  serializeG2Result,
  type G2ResultV1,
} from "@/domain/g2";
import { experimentProfileV1Schema } from "@/domain/profile/experiment-schema";
import { explanationLexicon } from "@/lib/strings";
import generatedCatalog from "../../../data/generated/recommendation-profile-catalog-v1.json";
import generatedContext from "../../../data/generated/recommendation-profile-context-v1.json";
import { ExperimentDataError } from "../../../scripts/experiment/errors";
import { recommendationContextFileSchema } from "../../../scripts/experiment/inputs";
import {
  discoverDefaultG2ResultPaths,
  G2_RESULT_FILE_LIMIT,
  loadG2Results,
} from "../../../scripts/g2/results";

const catalog = catalogV1Schema.parse(generatedCatalog);
const context = recommendationContextFileSchema.parse(generatedContext);
const temporaryDirectories: string[] = [];
let canonicalResult: G2ResultV1;
let canonicalText = "";

function sha256Hex(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

async function temporaryDirectory() {
  const directory = await mkdtemp(join(tmpdir(), "konocomics-g2-results-test-"));
  temporaryDirectories.push(directory);
  return directory;
}

beforeAll(async () => {
  const base = JSON.parse(
    await readFile(resolve("data/fixtures/experiment-profiles/tactical-mystery.json"), "utf8"),
  ) as { records: unknown[] } & Record<string, unknown>;
  const sixthAnchor = experimentProfileV1Schema
    .parse(
      JSON.parse(
        await readFile(resolve("data/fixtures/experiment-profiles/warm-exploration.json"), "utf8"),
      ),
    )
    .records.find((record) => record.workId === "frieren");
  if (sixthAnchor === undefined) {
    throw new Error("Missing sixth G2 fixture anchor");
  }
  const profile = experimentProfileV1Schema.parse({
    ...base,
    profileId: "pilot-one",
    records: [...base.records, { ...sixthAnchor, updatedAt: "2000-01-01T00:00:00.000Z" }],
  });
  const experiment = await createG2Experiment({
    participantId: "pilot-one",
    profile,
    catalog,
    context,
    sha256Hex,
    lexicon: explanationLexicon,
  });
  canonicalResult = createG2Result({
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
  });
  canonicalText = serializeG2Result(canonicalResult);
});

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

describe("G2 canonical result boundary", () => {
  it("loads a canonical file and recomputes it against the frozen engines", async () => {
    const directory = await temporaryDirectory();
    const path = join(directory, "pilot.json");
    await writeFile(path, canonicalText, "utf8");

    await expect(
      loadG2Results({ paths: [path], catalog, context, lexicon: explanationLexicon }),
    ).resolves.toEqual([canonicalResult]);
  });

  it.each([
    ["CRLF", () => canonicalText.replaceAll("\n", "\r\n")],
    ["BOM", () => `\ufeff${canonicalText}`],
    ["extra whitespace", () => `${canonicalText.trimEnd()}  \n`],
    ["reordered keys", () => `${JSON.stringify({ ...canonicalResult, format: undefined })}\n`],
    [
      "duplicate member",
      () => canonicalText.replace('{\n  "format":', '{\n  "format":"duplicate",\n  "format":'),
    ],
  ])("rejects noncanonical %s bytes", async (_label, build) => {
    const directory = await temporaryDirectory();
    const path = join(directory, "invalid.json");
    await writeFile(path, build(), "utf8");
    await expect(
      loadG2Results({ paths: [path], catalog, context, lexicon: explanationLexicon }),
    ).rejects.toBeInstanceOf(ExperimentDataError);
  });

  it("rejects malformed UTF-8, oversize files, and non-files", async () => {
    const directory = await temporaryDirectory();
    const malformed = join(directory, "malformed.json");
    const oversized = join(directory, "oversized.json");
    await writeFile(malformed, Buffer.from([0xc3, 0x28]));
    await writeFile(oversized, Buffer.alloc(G2_RESULT_FILE_LIMIT + 1, 0x20));
    for (const path of [malformed, oversized, directory]) {
      await expect(
        loadG2Results({ paths: [path], catalog, context, lexicon: explanationLexicon }),
      ).rejects.toBeInstanceOf(ExperimentDataError);
    }
  });

  it("rejects duplicate paths, symlink aliases, and hard-link identities", async () => {
    const directory = await temporaryDirectory();
    const path = join(directory, "pilot.json");
    const symlinkPath = join(directory, "pilot-symlink.json");
    const hardLinkPath = join(directory, "pilot-hardlink.json");
    await writeFile(path, canonicalText, "utf8");
    await symlink(path, symlinkPath, "file");
    await link(path, hardLinkPath);

    for (const paths of [
      [path, path],
      [path, symlinkPath],
      [path, hardLinkPath],
    ]) {
      await expect(
        loadG2Results({ paths, catalog, context, lexicon: explanationLexicon }),
      ).rejects.toBeInstanceOf(ExperimentDataError);
    }
  });

  it("discovers only regular JSON files in code-unit order", async () => {
    const directory = await temporaryDirectory();
    const resultsDirectory = join(directory, "data/local/g2-results");
    await mkdir(resultsDirectory, { recursive: true });
    await writeFile(join(resultsDirectory, "b.json"), canonicalText, "utf8");
    await writeFile(join(resultsDirectory, "a.json"), canonicalText, "utf8");
    await writeFile(join(resultsDirectory, "ignored.txt"), canonicalText, "utf8");
    await mkdir(join(resultsDirectory, "nested.json"));

    await expect(discoverDefaultG2ResultPaths(directory)).resolves.toEqual([
      join(resultsDirectory, "a.json"),
      join(resultsDirectory, "b.json"),
    ]);
  });
});
