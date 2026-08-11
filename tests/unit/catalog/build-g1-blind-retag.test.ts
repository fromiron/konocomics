import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  buildG1BlindRetagArtifacts,
  selectG1BlindRetagSample,
} from "../../../scripts/build-g1-blind-retag";

describe("G1 blind-retag sample", () => {
  it("freezes a deterministic, isolated 9-of-50 sample", async () => {
    const root = resolve(import.meta.dirname, "../../..");
    const first = await buildG1BlindRetagArtifacts(root);
    const second = await buildG1BlindRetagArtifacts(root);
    const selectedIds = first.manifest.selected.map(({ workId }) => workId);

    expect(second).toEqual(first);
    expect(first.manifest.populationSize).toBe(50);
    expect(first.manifest.sampleSize).toBe(9);
    expect(first.manifest.sampleRate).toBe(0.18);
    expect(new Set(selectedIds)).toHaveLength(9);
    expect(first.manifest.selected.map(({ digest }) => digest)).toEqual(
      [...first.manifest.selected.map(({ digest }) => digest)].sort(),
    );
    expect(
      selectG1BlindRetagSample(
        `${first.manifest.policyVersion}-changed`,
        first.manifest.cohortWorkIdsSha256,
        first.manifest.factorDictionarySha256,
        first.manifest.annotationGuideSha256,
        Array.from({ length: 50 }, (_, index) => `work-${index + 1}`),
      ).map(({ workId }) => workId),
    ).not.toEqual(
      selectG1BlindRetagSample(
        first.manifest.policyVersion,
        first.manifest.cohortWorkIdsSha256,
        first.manifest.factorDictionarySha256,
        first.manifest.annotationGuideSha256,
        Array.from({ length: 50 }, (_, index) => `work-${index + 1}`),
      ).map(({ workId }) => workId),
    );
    expect(
      selectG1BlindRetagSample(
        first.manifest.policyVersion,
        "0".repeat(64),
        first.manifest.factorDictionarySha256,
        first.manifest.annotationGuideSha256,
        Array.from({ length: 50 }, (_, index) => `work-${index + 1}`),
      ).map(({ workId }) => workId),
    ).not.toEqual(
      selectG1BlindRetagSample(
        first.manifest.policyVersion,
        first.manifest.cohortWorkIdsSha256,
        first.manifest.factorDictionarySha256,
        first.manifest.annotationGuideSha256,
        Array.from({ length: 50 }, (_, index) => `work-${index + 1}`),
      ).map(({ workId }) => workId),
    );
    expect(first.inputContent).toContain("Do not open `docs/factors/annotation-guide.md`");
    expect(first.inputContent).toContain("`docs/factors/factor-dictionary.md`");
    expect(first.inputContent).toContain(first.manifest.factorDictionarySha256);
    expect(first.inputContent).toContain(first.manifest.annotationGuideSha256);
    expect(first.inputContent).toContain("exactly 9 × 17 = 153 rows");
    expect(first.inputContent).toContain("Write exactly four files");
    expect(first.inputContent.match(/^\| (?!workId|---)[a-z0-9-]+\s+\|/gmu)).toHaveLength(9);
    expect(first.inputContent).not.toContain("| genres |");
    expect(first.inputContent).not.toContain("| catalog role |");
    expect(first.inputContent).not.toContain("| review average |");
    expect(first.inputContent.endsWith("\n")).toBe(true);
    expect(first.manifestContent.endsWith("\n")).toBe(true);
    expect(readFileSync(resolve(root, "data/staging/g1/blind-retag/input.md"), "utf8")).toBe(
      first.inputContent,
    );
    expect(
      readFileSync(resolve(root, "data/staging/g1/blind-retag/sample-manifest.json"), "utf8"),
    ).toBe(first.manifestContent);
  });
});
