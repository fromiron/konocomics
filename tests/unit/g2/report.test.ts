import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

import { catalogV1Schema } from "@/domain/catalog/schema";
import { aggregateG2Metrics, type G2ResultV1 } from "@/domain/g2";
import { experimentProfileV1Schema } from "@/domain/profile/experiment-schema";
import { createTestWork } from "../../helpers/catalog";
import { buildG2AggregateReport } from "../../../scripts/g2/report";

const goldenPath = resolve("tests/fixtures/g2/aggregate-golden.md");

function profileRecord(workId: string, reaction: "favorite" | "liked" | "disliked" = "liked") {
  return {
    workId,
    readingState: "completed" as const,
    reaction,
    updatedAt: "2000-01-01T00:00:00.000Z",
  };
}

function fixtureResult(
  participantId: string,
  respondent: G2ResultV1["respondent"],
  preference: "A" | "B" | "tie",
): G2ResultV1 {
  const profile = experimentProfileV1Schema.parse({
    format: "konocomics-experiment-profile",
    schemaVersion: 1,
    profileId: participantId,
    records: Array.from({ length: 6 }, (_value, index) =>
      profileRecord(`anchor-${String.fromCharCode(97 + index)}`),
    ),
    adjustments: { axes: {}, themes: {} },
    policies: {
      preferCompleted: false,
      preferHidden: false,
      preferVerified: false,
      excludeIncomplete: false,
    },
  });
  return {
    format: "konocomics-g2-result",
    schemaVersion: 1,
    contractVersion: "g2-v1",
    participantId,
    respondent,
    catalogVersion: "report-catalog-v1",
    factorDictionaryVersion: "v1",
    baselineVersion: "v1",
    profile,
    holdoutWorkIds: ["anchor-f"],
    slots: {
      A: {
        engine: "taste",
        items: [{ rank: 1, workId: "candidate-a", explanationAvailable: true }],
      },
      B: {
        engine: "baseline",
        items: [{ rank: 1, workId: "candidate-b", explanationAvailable: false }],
      },
    },
    preResponses: [
      { workId: "candidate-a", familiarity: "unknown", wantToReadBefore: 4 },
      { workId: "candidate-b", familiarity: "knownUnread", wantToReadBefore: 3 },
    ],
    listPreference: preference,
    postResponses: [
      {
        slot: "A",
        rank: 1,
        workId: "candidate-a",
        wantToReadAfter: 5,
        agreement: 4,
      },
      {
        slot: "B",
        rank: 1,
        workId: "candidate-b",
        wantToReadAfter: 3,
        agreement: null,
      },
    ],
  };
}

const catalog = catalogV1Schema.parse({
  schemaVersion: 1,
  catalogVersion: "report-catalog-v1",
  factorDictionaryVersion: "v1",
  works: [
    ...Array.from({ length: 6 }, (_value, index) =>
      createTestWork({ id: `anchor-${String.fromCharCode(97 + index)}` }),
    ),
    createTestWork({ id: "candidate-a" }),
    createTestWork({ id: "candidate-b" }),
  ],
  volumes: [],
  representativeVolumeByWorkId: {},
});

export let report = "";

beforeAll(() => {
  const pilot = fixtureResult(
    "pilot-one",
    { kind: "syntheticPilot", label: "manual-round-trip" },
    "B",
  );
  report = buildG2AggregateReport(catalog, aggregateG2Metrics([pilot], catalog));
});

describe("deterministic G2 aggregate report", () => {
  it("matches the pilot-only INCOMPLETE golden", async () => {
    if (process.env.UPDATE_G2_GOLDEN === "1") {
      await writeFile(goldenPath, report, "utf8");
    }
    await expect(readFile(goldenPath, "utf8")).resolves.toBe(report);
    expect(report).toContain("Human: 0");
    expect(report).toContain("Synthetic pilot: 1");
    expect(report).toContain("Verdict: **INCOMPLETE**");
    expect(report).not.toContain("2000-01-01");
    expect(report.endsWith("\n")).toBe(true);
    expect(report.endsWith("\n\n")).toBe(false);
    expect(report).not.toContain("\r");
  });

  it("is byte-identical across repeated construction and input order", () => {
    const humanB = fixtureResult("human-b", { kind: "human" }, "B");
    const humanA = fixtureResult("human-a", { kind: "human" }, "A");
    const first = buildG2AggregateReport(catalog, aggregateG2Metrics([humanB, humanA], catalog));
    const second = buildG2AggregateReport(catalog, aggregateG2Metrics([humanA, humanB], catalog));
    expect(second).toBe(first);
    expect(first.indexOf("human-a")).toBeLessThan(first.indexOf("human-b"));
  });
});
