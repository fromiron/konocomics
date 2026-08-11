import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { beforeAll, describe, expect, it } from "vitest";

import { catalogV1Schema } from "@/domain/catalog/schema";
import {
  createExperimentProfileV1Schema,
  type ExperimentProfileV1,
} from "@/domain/profile/experiment-schema";
import { strings } from "@/lib/strings";
import { createTestAxes, createTestWork } from "../../helpers/catalog";
import generatedCatalog from "../../../data/generated/catalog-v1.json";
import generatedContext from "../../../data/generated/recommendation-context-v1.json";
import { recommendationContextFileSchema } from "../../../scripts/experiment/inputs";
import { loadExperimentProfiles } from "../../../scripts/experiment/profiles";
import {
  buildExperimentReport,
  calculateCoverageWarnings,
  escapeExperimentMarkdown,
  formatExperimentNumber,
  renderCoverageWarningLine,
} from "../../../scripts/experiment/report";

const catalog = catalogV1Schema.parse(generatedCatalog);
const context = recommendationContextFileSchema.parse(generatedContext);
const fixtureDirectory = resolve("data/fixtures/experiment-profiles");
const fixturePaths = [
  resolve(fixtureDirectory, "tactical-mystery.json"),
  resolve(fixtureDirectory, "warm-exploration.json"),
  resolve(fixtureDirectory, "kinetic-competition.json"),
];
const goldenPath = resolve("tests/fixtures/experiment/report-golden.md");
const coverageGoldenPath = resolve("tests/fixtures/experiment/coverage-warning-golden.md");
let profiles: ExperimentProfileV1[] = [];

beforeAll(async () => {
  profiles = await loadExperimentProfiles(fixturePaths, catalog);
});

function report(
  options: {
    profiles?: readonly ExperimentProfileV1[];
    catalogInput?: typeof catalog;
    contextInput?: typeof context;
  } = {},
) {
  return buildExperimentReport(
    {
      catalog: options.catalogInput ?? catalog,
      context: options.contextInput ?? context,
      profiles: options.profiles ?? profiles,
      lexicon: strings.explanation,
    },
    strings.experimentReport,
  );
}

function permuteProfiles() {
  const schema = createExperimentProfileV1Schema(catalog);
  return [...profiles].reverse().map((profile) =>
    schema.parse({
      ...profile,
      records: [...profile.records].reverse().map((record) => ({
        ...record,
        negativeReasons:
          record.negativeReasons === undefined ? undefined : [...record.negativeReasons].reverse(),
        droppedReasons:
          record.droppedReasons === undefined ? undefined : [...record.droppedReasons].reverse(),
      })),
      adjustments: {
        axes: Object.fromEntries(Object.entries(profile.adjustments.axes).reverse()),
        themes: Object.fromEntries(Object.entries(profile.adjustments.themes).reverse()),
      },
    }),
  );
}

describe("deterministic experiment report", () => {
  it("matches the committed three-profile Markdown golden", async () => {
    const output = report();
    await expect(readFile(goldenPath, "utf8")).resolves.toBe(output);
    expect(output.endsWith("\n")).toBe(true);
    expect(output.endsWith("\n\n")).toBe(false);
    expect(output.includes("\r")).toBe(false);
    expect(output).not.toContain("updatedAt");
    expect(output).not.toContain("2000-01-01T00:00:00.000Z");
  });

  it("is byte-identical across repeated calls and input permutations", () => {
    const expected = report();
    expect(report()).toBe(expected);

    const reversedCatalog = catalogV1Schema.parse({
      ...catalog,
      works: [...catalog.works].reverse(),
      volumes: [...catalog.volumes].reverse(),
      representativeVolumeByWorkId: Object.fromEntries(
        Object.entries(catalog.representativeVolumeByWorkId).reverse(),
      ),
    });
    const reversedContext = recommendationContextFileSchema.parse({
      constraintByWorkId: Object.fromEntries(Object.entries(context.constraintByWorkId).reverse()),
      marketSnapshot: {
        ...context.marketSnapshot,
        byWorkId: Object.fromEntries(Object.entries(context.marketSnapshot.byWorkId).reverse()),
      },
    });
    expect(
      report({
        profiles: permuteProfiles(),
        catalogInput: reversedCatalog,
        contextInput: reversedContext,
      }),
    ).toBe(expected);
  });

  it("renders only the contracted sections and diagnostics in profile order", () => {
    const output = report();
    expect(output.indexOf("kinetic\\-competition")).toBeLessThan(
      output.indexOf("tactical\\-mystery"),
    );
    expect(output.indexOf("tactical\\-mystery")).toBeLessThan(output.indexOf("warm\\-exploration"));
    expect(output).toContain("Taste Engine Top 10 (10/10)");
    expect(output).toContain("Baseline Top 10 (10/10)");
    expect(output).toContain("SHRUNK グループ数");
    expect(output).not.toContain("Rank comparison");
  });

  it("matches the SHRUNK and PARTIAL coverage warning golden", async () => {
    const shrunkCandidate = createTestWork({
      id: "shrunk-candidate",
      axes: createTestAxes({
        characterArcWeight: { state: "unknown" },
        relationshipStructure: { state: "unknown" },
      }),
    });
    const shrunkAnchor = createTestWork({
      id: "shrunk-anchor",
      axes: createTestAxes({
        comedy: { state: "unknown" },
        darkness: { state: "unknown" },
      }),
    });
    const partialCandidate = createTestWork({
      id: "partial-candidate",
      axes: createTestAxes({ characterArcWeight: { state: "unknown" } }),
    });
    const partialAnchor = createTestWork({ id: "partial-anchor" });
    const warnings = [
      ...calculateCoverageWarnings(shrunkCandidate, shrunkAnchor),
      ...calculateCoverageWarnings(partialCandidate, partialAnchor),
    ];
    const output = `${warnings.map(renderCoverageWarningLine).join("\n")}\n`;

    expect(warnings.map(({ status }) => status)).toEqual(["SHRUNK", "PARTIAL"]);
    await expect(readFile(coverageGoldenPath, "utf8")).resolves.toBe(output);
  });
});

describe("experiment report primitives", () => {
  it("escapes controls, HTML, and Markdown punctuation in the contracted order", () => {
    expect(escapeExperimentMarkdown("<A&B>|x.y-\u001b\\`*")).toBe(
      "&lt;A&amp;B&gt;\\|x\\.y\\-�\\\\\\`\\*",
    );
  });

  it("uses q12 String(number) output and canonicalizes negative zero", () => {
    expect(formatExperimentNumber(-0)).toBe("0");
    expect(formatExperimentNumber(1.2345678901236)).toBe("1.234567890124");
    expect(() => formatExperimentNumber(Number.POSITIVE_INFINITY)).toThrow(/finite/u);
  });
});
