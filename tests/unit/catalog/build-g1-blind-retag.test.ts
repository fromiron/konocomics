import { createHash } from "node:crypto";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  buildG1BlindRetagArtifacts,
  runG1BlindRetagCli,
  selectG1BlindRetagSample,
} from "../../../scripts/build-g1-blind-retag";
import { GENRE_TAGS, THEME_TAGS } from "../../../src/domain/catalog/constants";

describe("G1 blind-retag sample", () => {
  it("builds a deterministic, isolated 9-of-50 sample", async () => {
    const root = resolve(import.meta.dirname, "../../..");
    const first = await buildG1BlindRetagArtifacts(root);
    const second = await buildG1BlindRetagArtifacts(root);
    const selectedIds = first.manifest.selected.map(({ workId }) => workId);

    expect(second).toEqual(first);
    expect(first.manifest.populationSize).toBe(50);
    expect(first.manifest.sampleSize).toBe(9);
    expect(first.manifest.sampleRate).toBe(0.18);
    expect(first.manifest.inputSha256).toBe(
      createHash("sha256").update(first.inputContent).digest("hex"),
    );
    expect(first.inputContent).not.toContain(first.manifest.inputSha256);
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
    expect(first.inputContent).toContain(
      `Within each cell, emit Genre IDs in this exact canonical order: ${GENRE_TAGS.map((genreId) => `\`${genreId}\``).join(", ")}`,
    );
    expect(first.inputContent).toContain(
      `Within each work, emit Theme rows in this exact canonical order: ${THEME_TAGS.map((themeId) => `\`${themeId}\``).join(", ")}`,
    );
    expect(first.inputContent).toContain("The only authorized source URLs are the exact URLs");
    expect(first.inputContent).toContain(
      "Only publisher-authored bibliographic, synopsis, table-of-contents, and editorial text on an authorized page is evidence. User reviews, ratings, comments, retailer or recommendation widgets, and other third-party text remain out of scope even when rendered on that exact URL.",
    );
    expect(first.inputContent).toContain("only on facts within that entry scope");
    expect(first.inputContent).toContain("Record an exact volume/chapter/page or time range only");
    expect(first.inputContent).toContain("Metadata, catalog, and cover-only pages");
    expect(first.inputContent).toContain("MONSTER's representative ISBN");
    expect(first.inputContent).toContain("Input SHA-256: `{sha256 of input.md}`");
    expect(first.inputContent).toContain(
      "Isolation attestation: only input.md and factor-dictionary.md were read as local files; no other local files were read.",
    );
    expect(first.inputContent).toContain("## `{workId}`");
    expect(first.inputContent).toContain("- Authorized URL: <{exact-url}>");
    expect(first.inputContent).toContain("- Axis `{axisId}`: {nonempty rationale}");
    expect(first.inputContent).toContain("- Genre `{genreId}`: {nonempty rationale}");
    expect(first.inputContent).toContain("- Genre unknown: {nonempty limitation}");
    expect(first.inputContent).toContain(
      "- Theme `{themeId}` (centrality {1-or-2}): {nonempty rationale}",
    );
    expect(first.inputContent).toContain("- Theme unknown: {nonempty limitation}");
    expect(first.inputContent).toContain(
      "A blank Genre cell or zero Theme rows is permitted only when entry-scope evidence is insufficient",
    );
    expect(first.inputContent).toContain(
      "Do not emit a sentinel when its Genre IDs or Theme rows exist",
    );
    expect(first.inputContent.match(/^\| (?!workId|---)[a-z0-9-]+\s+\|/gmu)).toHaveLength(9);
    expect(first.inputContent).not.toContain("| genres |");
    expect(first.inputContent).not.toContain("| catalog role |");
    expect(first.inputContent).not.toContain("| review average |");
    expect(first.inputContent.endsWith("\n")).toBe(true);
    expect(first.manifestContent.endsWith("\n")).toBe(true);
  });

  it("uses the frozen blind input instead of mutable candidate approval provenance", async () => {
    const repositoryRoot = resolve(import.meta.dirname, "../../..");
    const root = mkdtempSync(join(tmpdir(), "konocomics-g1-blind-freeze-"));
    const inputs = [
      "data/staging/g1/cohort-manifest.json",
      "data/staging/g1/blind-retag/sample-manifest.json",
      "data/staging/g1/blind-retag/input.md",
      "data/staging/g1/blind-retag/source/works.csv",
      "data/staging/g1/blind-retag/source/volumes.csv",
      "data/staging/g1/blind-retag/source/evidence/evidence.csv",
      "docs/factors/factor-dictionary.md",
      "docs/factors/annotation-guide.md",
    ];
    try {
      for (const path of inputs) {
        const destination = join(root, path);
        mkdirSync(dirname(destination), { recursive: true });
        cpSync(join(repositoryRoot, path), destination);
      }
      const candidateWorks = "data/staging/g1/candidate-source/works.csv";
      mkdirSync(dirname(join(root, candidateWorks)), { recursive: true });
      cpSync(join(repositoryRoot, candidateWorks), join(root, candidateWorks));

      await runG1BlindRetagCli([], root);
      const expected = await buildG1BlindRetagArtifacts(root);
      await expect(runG1BlindRetagCli(["--check"], root)).resolves.toBeUndefined();
      const currentCandidate = readFileSync(join(root, candidateWorks), "utf8");
      const changedApproval = currentCandidate.replace(
        /,authorizedModelPanel,[^,\r\n]*,[^,\r\n]*,/gu,
        ",authorizedModelPanel,2030-01-01T00:00:00+09:00,reviews/changed.md,",
      );
      expect(changedApproval).not.toBe(currentCandidate);
      writeFileSync(join(root, candidateWorks), changedApproval);
      await expect(buildG1BlindRetagArtifacts(root)).resolves.toEqual(expected);

      const frozenWorksPath = join(root, "data/staging/g1/blind-retag/source/works.csv");
      writeFileSync(
        frozenWorksPath,
        readFileSync(frozenWorksPath, "utf8").replace("ダンジョン飯", "ダンジョン飯 changed"),
      );
      await expect(runG1BlindRetagCli(["--check"], root)).rejects.toThrow(
        /Stale blind-retag artifact/u,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
