import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { AXIS_IDS, GENRE_TAGS, THEME_TAGS } from "../../../src/domain/catalog/constants";
import {
  validatePromotionAnnotationArtifacts,
  validatePromotionAnnotationChunk,
} from "../../../scripts/validate-promotion-annotations";

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function csv(headers: readonly string[], rows: readonly (readonly string[])[]) {
  return `${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function createAnnotationFixture() {
  const packetDirectory = mkdtempSync(join(tmpdir(), "konocomics-batch-annotation-"));
  const output = join(packetDirectory, "annotation-pass-a/chunk-01");
  const researchDirectory = join(packetDirectory, "research");
  mkdirSync(output, { recursive: true });
  mkdirSync(researchDirectory, { recursive: true });
  const workIds = Array.from(
    { length: 10 },
    (_, index) => `work-${index.toString(16).padStart(20, "0")}`,
  );
  const candidateSha256 = "a".repeat(64);
  const urls = new Map(workIds.map((workId) => [workId, `https://example.com/${workId}`]));
  writeFileSync(
    join(researchDirectory, "chunk-01.md"),
    `${workIds
      .map(
        (workId) =>
          `## workId: \`${workId}\` — Title ${workId}\n\n- sourceUrl: ${urls.get(workId)}\n`,
      )
      .join("\n")}\n`,
  );
  writeFileSync(
    join(output, "factors.csv"),
    csv(
      ["workId", "axisId", "state", "value", "confidence", "evidenceId"],
      workIds.flatMap((workId) =>
        AXIS_IDS.map((axisId) => [workId, axisId, "unknown", "", "", `ev-batch-003-a-${workId}`]),
      ),
    ),
  );
  writeFileSync(
    join(output, "genres.csv"),
    csv(
      ["workId", "genres"],
      workIds.map((workId) => [workId, GENRE_TAGS.slice(0, 2).join(";")]),
    ),
  );
  writeFileSync(
    join(output, "themes.csv"),
    csv(
      ["workId", "themeId", "centrality", "confidence", "evidenceId"],
      workIds.map((workId) => [workId, THEME_TAGS[0], "1", "0.8", `ev-batch-003-a-${workId}`]),
    ),
  );
  writeFileSync(
    join(output, "notes.md"),
    `# Notes\n\ncandidateSha256: ${candidateSha256}\n\n${workIds
      .map((workId) => `## ${workId}\n\n- sourceUrl: ${urls.get(workId)}\n`)
      .join("\n")}`,
  );
  return { packetDirectory, output, workIds, candidateSha256 };
}

describe("promotion annotation validation", () => {
  it("preserves the Pilot positional invocation", () => {
    const result = validatePromotionAnnotationChunk("annotation-pass-a", "01");
    expect(result.workCount).toBe(10);
    expect(result.factorCount).toBe(170);
  }, 30_000);

  it("validates the nested 10x17 Batch shape and exact evidence prefix", () => {
    const fixture = createAnnotationFixture();
    try {
      const options = {
        packetDirectory: fixture.packetDirectory,
        pass: "annotation-pass-a",
        chunk: "01",
        candidateSha256: fixture.candidateSha256,
        workSetIds: fixture.workIds,
        evidencePrefix: "ev-batch-003-a-",
        candidateLabel: "batch-003",
        requireFrozenChunkOrder: true,
      } as const;
      expect(validatePromotionAnnotationArtifacts(options)).toMatchObject({
        workCount: 10,
        factorCount: 170,
        unknown: 170,
      });

      const path = join(fixture.output, "factors.csv");
      const content = readFileSync(path, "utf8");
      writeFileSync(path, content.replace(`,${AXIS_IDS[0]},unknown`, `,${AXIS_IDS[1]},unknown`));
      expect(() => validatePromotionAnnotationArtifacts(options)).toThrow();
    } finally {
      rmSync(fixture.packetDirectory, { recursive: true, force: true });
    }
  });
});
