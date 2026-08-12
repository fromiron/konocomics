import { cpSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  ART_EVIDENCE_MANIFEST_FILE,
  artEvidenceManifestRowSchema,
  validateArtEvidence,
} from "../../../scripts/catalog/art-evidence";
import { runCatalogPipeline } from "../../../scripts/catalog/pipeline";
import { ART_AXIS_IDS } from "../../../src/domain/catalog/constants";

const previewUrl = "https://example.com/official-preview";
const sampleReferences = Array.from(
  { length: 6 },
  (_, index) => `official preview page ${index + 1}`,
).join("; ");

function manifestRow(axisId: (typeof ART_AXIS_IDS)[number]) {
  return artEvidenceManifestRowSchema.parse({
    workId: "test-work",
    axisId,
    state: axisId === "motionImpact" ? "unknown" : "known",
    value: axisId === "motionImpact" ? "" : "2",
    confidence: axisId === "motionImpact" ? "" : "0.9",
    authorityClass: "originalPublisher",
    sourceType: "publisher",
    sourceUrl: previewUrl,
    edition: "Japanese Volume 1",
    scopeMapping: "The observed edition maps to entry_1_3_volumes.",
    pageOrTimeRefs: sampleReferences,
    sampleCount: "6",
    contexts: "school conversation; outdoor action",
    observation: "Directly observed in the cited pages.",
    limitation: "Entry-range sample pending annotation review.",
    reviewStatus: "modelObservedPendingPanel",
  });
}

function located<T>(file: string, row: number, value: T) {
  return { file, row, value };
}

function createFixture() {
  const manifest = ART_AXIS_IDS.map((axisId, index) =>
    located(ART_EVIDENCE_MANIFEST_FILE, index + 2, manifestRow(axisId)),
  );
  return {
    works: [located("works.csv", 2, { id: "test-work" })],
    factors: manifest.map(({ value: row }, index) =>
      located("factors.csv", index + 2, {
        workId: row.workId,
        axisId: row.axisId,
        state: row.state,
        value: row.value,
        confidence: row.confidence,
        evidenceId: "art-test-work",
      }),
    ),
    evidence: [
      located("evidence/evidence.csv", 2, {
        id: "art-test-work",
        workId: "test-work",
        sourceType: "publisher",
        sourceUrl: previewUrl,
      }),
    ],
    manifest,
  };
}

function replaceManifestRow(
  fixture: ReturnType<typeof createFixture>,
  axisId: (typeof ART_AXIS_IDS)[number],
  replacement: Record<string, string>,
) {
  return {
    ...fixture,
    manifest: fixture.manifest.map((locatedRow) =>
      locatedRow.value.axisId === axisId
        ? {
            ...locatedRow,
            value: artEvidenceManifestRowSchema.parse({
              ...locatedRow.value,
              sampleCount: String(locatedRow.value.sampleCount),
              ...replacement,
            }),
          }
        : locatedRow,
    ),
  };
}

function replaceFactor(
  fixture: ReturnType<typeof createFixture>,
  axisId: (typeof ART_AXIS_IDS)[number],
  replacement: Record<string, string>,
) {
  return {
    ...fixture,
    factors: fixture.factors.map((locatedRow) =>
      locatedRow.value.axisId === axisId
        ? { ...locatedRow, value: { ...locatedRow.value, ...replacement } }
        : locatedRow,
    ),
  };
}

function codes(fixture: ReturnType<typeof createFixture>) {
  return validateArtEvidence(fixture).map((issue) => issue.code);
}

describe("generic Art evidence validation", () => {
  it("accepts a complete work x Art-axis manifest", () => {
    expect(validateArtEvidence(createFixture())).toEqual([]);
  });

  it("requires one manifest row for every Work x Art-axis pair", () => {
    const fixture = createFixture();
    expect(codes({ ...fixture, manifest: fixture.manifest.slice(1) })).toContain(
      "ART_EVIDENCE_PAIR_MISSING",
    );
    expect(codes({ ...fixture, manifest: [...fixture.manifest, fixture.manifest[0]!] })).toContain(
      "DUPLICATE_ART_EVIDENCE_PAIR",
    );
  });

  it("enforces authority class and source-type schema", () => {
    expect(
      artEvidenceManifestRowSchema.safeParse({
        ...manifestRow("artRealism"),
        sampleCount: "6",
        authorityClass: "publisherAuthorizedPlatform",
        sourceType: "publisher",
      }).success,
    ).toBe(false);
    expect(
      artEvidenceManifestRowSchema.safeParse({
        ...manifestRow("artRealism"),
        sampleCount: "6",
        state: "notApplicable",
        value: "",
        confidence: "",
      }).success,
    ).toBe(false);
  });

  it("matches state, value, and numeric confidence to the final factor", () => {
    const fixture = replaceFactor(createFixture(), "artRealism", { confidence: "0.8" });
    expect(codes(fixture)).toContain("ART_EVIDENCE_FACTOR_MISMATCH");

    const equivalentFormatting = replaceFactor(createFixture(), "artRealism", {
      confidence: "0.90",
    });
    expect(codes(equivalentFormatting)).not.toContain("ART_EVIDENCE_FACTOR_MISMATCH");
  });

  it("joins the factor evidence to the same work, source type, and normalized URL", () => {
    const fixture = createFixture();
    fixture.evidence[0]!.value.sourceType = "model";
    expect(codes(fixture)).toContain("ART_EVIDENCE_PROVENANCE_MISMATCH");
  });

  it("enforces work-wide sample, sampleCount, and context minimums", () => {
    const fixture = createFixture();
    const fiveReferences = Array.from(
      { length: 5 },
      (_, index) => `official preview page ${index + 1}`,
    ).join("; ");
    fixture.manifest = fixture.manifest.map((locatedRow) => ({
      ...locatedRow,
      value: artEvidenceManifestRowSchema.parse({
        ...locatedRow.value,
        sampleCount: "5",
        pageOrTimeRefs: fiveReferences,
        contexts: "same; same",
      }),
    }));
    expect(codes(fixture)).toEqual(
      expect.arrayContaining([
        "ART_EVIDENCE_WORK_SAMPLES_INSUFFICIENT",
        "ART_EVIDENCE_SAMPLE_COUNT_INSUFFICIENT",
        "ART_EVIDENCE_WORK_CONTEXTS_INSUFFICIENT",
      ]),
    );
  });

  it("requires two exact non-cover references for each known static axis", () => {
    const fixture = replaceManifestRow(createFixture(), "artRealism", {
      pageOrTimeRefs: "official preview page 1",
    });
    expect(codes(fixture)).toContain("ART_EVIDENCE_STATIC_REFS_INSUFFICIENT");
  });

  it("accepts exact continuous motion ranges and rejects disconnected samples", () => {
    for (const pageOrTimeRefs of [
      "official preview pages 3-6",
      "reader page 32 through reader page 33",
      "official preview panels 2-7",
      "00:20.0-00:21.2",
    ]) {
      let fixture = replaceManifestRow(createFixture(), "motionImpact", {
        state: "known",
        value: "4",
        confidence: "0.9",
        pageOrTimeRefs,
      });
      fixture = replaceFactor(fixture, "motionImpact", {
        state: "known",
        value: "4",
        confidence: "0.9",
      });
      expect(codes(fixture)).not.toContain("ART_EVIDENCE_MOTION_SEQUENCE_MISSING");
    }

    let disconnected = replaceManifestRow(createFixture(), "motionImpact", {
      state: "known",
      value: "4",
      confidence: "0.9",
      pageOrTimeRefs: sampleReferences,
    });
    disconnected = replaceFactor(disconnected, "motionImpact", {
      state: "known",
      value: "4",
      confidence: "0.9",
    });
    expect(codes(disconnected)).toContain("ART_EVIDENCE_MOTION_SEQUENCE_MISSING");

    for (const pageOrTimeRefs of [
      "reader page 8, first panel through final panel",
      "reader page 8, first-to-final panels",
    ]) {
      let nonnumeric = replaceManifestRow(createFixture(), "motionImpact", {
        state: "known",
        value: "4",
        confidence: "0.9",
        pageOrTimeRefs,
      });
      nonnumeric = replaceFactor(nonnumeric, "motionImpact", {
        state: "known",
        value: "4",
        confidence: "0.9",
      });
      expect(codes(nonnumeric)).toContain("ART_EVIDENCE_MOTION_SEQUENCE_MISSING");
    }
  });

  it("allows honest unknown axes but does not let notApplicable bypass sampling", () => {
    let unknown = replaceManifestRow(createFixture(), "artRealism", {
      state: "unknown",
      value: "",
      confidence: "",
      pageOrTimeRefs: "",
      sampleCount: "0",
    });
    unknown = replaceFactor(unknown, "artRealism", {
      state: "unknown",
      value: "",
      confidence: "",
    });
    expect(validateArtEvidence(unknown)).toEqual([]);

    let notApplicable = replaceManifestRow(createFixture(), "motionImpact", {
      state: "notApplicable",
      value: "",
      confidence: "",
    });
    notApplicable = replaceFactor(notApplicable, "motionImpact", {
      state: "notApplicable",
      value: "",
      confidence: "",
    });
    const fiveReferences = Array.from(
      { length: 5 },
      (_, index) => `official preview page ${index + 1}`,
    ).join("; ");
    notApplicable.manifest = notApplicable.manifest.map((locatedRow) => ({
      ...locatedRow,
      value: artEvidenceManifestRowSchema.parse({
        ...locatedRow.value,
        sampleCount: "5",
        pageOrTimeRefs: fiveReferences,
        contexts: "one context",
      }),
    }));
    expect(codes(notApplicable)).toEqual(
      expect.arrayContaining([
        "ART_EVIDENCE_WORK_SAMPLES_INSUFFICIENT",
        "ART_EVIDENCE_SAMPLE_COUNT_INSUFFICIENT",
        "ART_EVIDENCE_WORK_CONTEXTS_INSUFFICIENT",
      ]),
    );
  });
});

describe("catalog pipeline Art evidence boundary", () => {
  const repositoryRoot = resolve(import.meta.dirname, "../../..");

  it("requires the Art manifest without cascading pair diagnostics", () => {
    const root = mkdtempSync(join(tmpdir(), "konocomics-art-missing-"));
    const source = join(root, "source");
    try {
      cpSync(join(repositoryRoot, "data/source"), source, { recursive: true });
      unlinkSync(join(source, ART_EVIDENCE_MANIFEST_FILE));
      const result = runCatalogPipeline(source);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          code: "SOURCE_FILE_MISSING",
          file: ART_EVIDENCE_MANIFEST_FILE,
        }),
      );
      expect(result.issues.map((issue) => issue.code)).not.toContain("ART_EVIDENCE_PAIR_MISSING");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("surfaces factor-linked Art provenance mismatches through the normal pipeline", () => {
    const root = mkdtempSync(join(tmpdir(), "konocomics-art-provenance-"));
    const source = join(root, "source");
    try {
      cpSync(join(repositoryRoot, "data/source"), source, { recursive: true });
      const evidencePath = join(source, "evidence/evidence.csv");
      const evidence = readFileSync(evidencePath, "utf8").replace(
        /^(ev-g1-art-dungeon-meshi,[^\r\n]*?),publisher,/mu,
        "$1,model,",
      );
      writeFileSync(evidencePath, evidence);
      const result = runCatalogPipeline(source);
      expect(result.issues).toContainEqual(
        expect.objectContaining({ code: "ART_EVIDENCE_PROVENANCE_MISMATCH" }),
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
