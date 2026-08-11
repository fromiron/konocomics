import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

import {
  artEvidenceManifestRowSchema,
  assertG1ArtEvidence,
  assertG1Cohort,
  assertG1CohortManifest,
  equalWeightCatalogAverage,
  publishCandidateDirectory,
} from "../../../scripts/build-g1-candidate";
import { ART_AXIS_IDS } from "../../../src/domain/catalog/constants";

function createArtEvidenceRow() {
  return {
    workId: "work-1",
    axisId: "artRealism",
    state: "known",
    value: "4",
    confidence: "0.95",
    authorityClass: "licensedPublisher",
    sourceType: "publisher",
    sourceUrl: "https://example.com/preview",
    edition: "Volume 1",
    scopeMapping: "Matches volumes 1-3",
    pageOrTimeRefs: "official preview page 1; official preview page 2",
    sampleCount: "6",
    contexts: "character study; city background",
    observation: "Directly observed",
    limitation: "Marketing-selected sample",
    reviewStatus: "modelObservedPendingPanel",
  };
}

function createCompleteArtFixture() {
  const workIds = Array.from({ length: 50 }, (_, index) => `work-${index + 1}`);
  const sampleRefs = Array.from({ length: 6 }, (_, index) => `official preview page ${index + 1}`);
  const rows = workIds.flatMap((workId) =>
    ART_AXIS_IDS.map((axisId) =>
      artEvidenceManifestRowSchema.parse({
        ...createArtEvidenceRow(),
        workId,
        axisId,
        pageOrTimeRefs:
          axisId === "motionImpact"
            ? [...sampleRefs, "official preview pages 3-6"].join("; ")
            : sampleRefs.join("; "),
      }),
    ),
  );
  return {
    rows,
    factors: rows.map((row) => ({
      workId: row.workId,
      axisId: row.axisId,
      state: row.state,
      value: row.value,
      confidence: row.confidence,
      evidenceId: `evidence-${row.workId}`,
    })),
    evidence: workIds.map((workId) => ({
      id: `evidence-${workId}`,
      workId,
      sourceType: "publisher",
      sourceUrl: "https://example.com:443/preview",
    })),
    cohortIds: new Set(workIds),
  };
}

function createCohortFixture() {
  const workIds = Array.from({ length: 50 }, (_, index) => `work-${index + 1}`);
  const demographics = [
    "general",
    ...Array<string>(19).fill("seinen"),
    ...Array<string>(3).fill("shojo"),
    ...Array<string>(23).fill("shonen"),
    ...Array<string>(4).fill("unknown"),
  ];
  const catalogRoles = [
    ...Array<string>(18).fill("anchor"),
    ...Array<string>(20).fill("bridge"),
    ...Array<string>(12).fill("discovery"),
  ];
  return {
    workIds,
    works: workIds.map((id, index) => ({
      id,
      demographic: demographics[index] ?? "",
      onboardingEligible: index < 28,
      recommendationEligible: true,
      libraryOnly: false,
    })),
    context: workIds.map((workId, index) => ({
      workId,
      catalogRole: catalogRoles[index] ?? "",
    })),
    histograms: {
      demographic: { general: 1, seinen: 19, shojo: 3, shonen: 23, unknown: 4 },
      catalogRole: { anchor: 18, bridge: 20, discovery: 12 },
      onboardingEligible: 28,
      recommendationEligible: 50,
      libraryOnly: 0,
    },
  };
}

function createManifestFixture() {
  const originalHash = "a".repeat(64);
  const replacementHash = "b".repeat(64);
  const workIds = Array.from({ length: 50 }, (_, index) => `work-${index + 1}`);
  const replacements = [
    {
      removedWorkId: "work-1",
      selectedWorkId: "selected-general",
      inherited: { demographic: "general", catalogRole: "anchor", onboardingEligible: true },
    },
    {
      removedWorkId: "work-24",
      selectedWorkId: "selected-shonen",
      inherited: { demographic: "shonen", catalogRole: "bridge", onboardingEligible: true },
    },
  ] as const;
  const distance = {
    sharedKnownAxisIds: [],
    axisDistance: 0,
    genreDistance: 0,
    themeDistance: 0,
    totalDistance: 0,
  };
  const replacement = {
    schemaVersion: 1,
    policyVersion: "g1-replacement-v1",
    inputHashes: {
      originalCohortFreezeFile: originalHash,
      replacementPoolFreezeFile: "c".repeat(64),
      originalSelectionProjection: "d".repeat(64),
      reconciledFactorsFile: "e".repeat(64),
      reconciledGenresFile: "f".repeat(64),
      reconciledThemesFile: "0".repeat(64),
    },
    selectionContract: {
      minimumSharedKnownNonArtAxes: 9,
      requiredNonArtGroups: ["narrative", "tone"],
      distanceWeights: { axis: 0.7, genre: 0.15, theme: 0.15 },
      excludedSignals: ["art", "market"],
      pairOrdering: "totalDistance-then-code-unit-workId",
    },
    replacements: replacements.map((item) => ({ ...item, distance })),
    selectedPairRank: 1,
    pairRanking: Array.from({ length: 25 }, (_, index) => ({
      rank: index + 1,
      candidateWorkIds: ["selected-general", "selected-shonen"],
      totalDistance: index,
      diversityPassed: true,
      diversityFailures: [],
    })),
  };
  const freeze = {
    schemaVersion: 1,
    workIds,
    histograms: {
      demographic: { general: 1, seinen: 19, shojo: 3, shonen: 23, unknown: 4 },
      catalogRole: { anchor: 18, bridge: 20, discovery: 12 },
      onboardingEligible: 28,
      recommendationEligible: 50,
      libraryOnly: 0,
    },
    replacementSlots: replacements.map((item) => ({
      workId: item.removedWorkId,
      ...item.inherited,
    })),
  };
  const manifest = {
    schemaVersion: 1,
    policyVersion: replacement.policyVersion,
    originalCohortFreezeSha256: originalHash,
    replacementManifestSha256: replacementHash,
    workIds: workIds.map(
      (workId) =>
        replacements.find((item) => item.removedWorkId === workId)?.selectedWorkId ?? workId,
    ),
  };
  return { freeze, manifest, replacement, originalHash, replacementHash };
}

describe("G1 candidate cohort", () => {
  it("averages only representative volumes with observed reviews", () => {
    const headers = [
      "workId",
      "catalogRole",
      "seriesGroupId",
      "volumeCount",
      "reviewAverage",
      "reviewCount",
    ];
    const rows = Array.from({ length: 50 }, (_, index) => [
      `work-${index + 1}`,
      "bridge",
      "",
      "1",
      index === 0 ? "" : "4.50",
      index === 0 ? "0" : "1",
    ]);

    expect(equalWeightCatalogAverage(headers, rows)).toBe("4.5");
    expect(() =>
      equalWeightCatalogAverage(
        headers,
        rows.map((row, index) => (index === 0 ? [...row.slice(0, 5), "1"] : row)),
      ),
    ).toThrow(/Missing reviewAverage for reviewed work work-1/u);
  });

  it("rejects an onboarding-only work even when it would keep 50 review errors", () => {
    const fixture = createCohortFixture();
    expect(() =>
      assertG1Cohort(fixture.workIds, fixture.works, fixture.context, fixture.histograms, []),
    ).not.toThrow();
    const firstWork = fixture.works[0];
    if (firstWork === undefined) {
      throw new Error("Expected a work fixture");
    }
    firstWork.recommendationEligible = false;

    expect(() =>
      assertG1Cohort(fixture.workIds, fixture.works, fixture.context, fixture.histograms, []),
    ).toThrow(/recommendation-eligible work IDs must match/u);
  });

  it("rejects a context set with one missing cohort work and one extra work", () => {
    const fixture = createCohortFixture();
    const lastContext = fixture.context[49];
    if (lastContext === undefined) {
      throw new Error("Expected a context fixture");
    }
    lastContext.workId = "extra-work";

    expect(() =>
      assertG1Cohort(fixture.workIds, fixture.works, fixture.context, fixture.histograms, []),
    ).toThrow(/missing=work-50; extra=extra-work/u);
  });

  it("binds the final ordered cohort to the current freeze, replacement, and policy", () => {
    const fixture = createManifestFixture();
    const hashes = {
      originalCohortFreezeSha256: fixture.originalHash,
      replacementManifestSha256: fixture.replacementHash,
    };
    expect(() =>
      assertG1CohortManifest(fixture.manifest, fixture.freeze, fixture.replacement, hashes),
    ).not.toThrow();

    for (const [manifest, nextHashes, message] of [
      [
        { ...fixture.manifest, workIds: [...fixture.manifest.workIds.slice(0, -1), "other-work"] },
        hashes,
        /preserve frozen order and selected replacements/u,
      ],
      [
        { ...fixture.manifest, originalCohortFreezeSha256: "9".repeat(64) },
        hashes,
        /current original cohort freeze/u,
      ],
      [
        { ...fixture.manifest, replacementManifestSha256: "9".repeat(64) },
        hashes,
        /current replacement manifest/u,
      ],
      [{ ...fixture.manifest, policyVersion: "stale-policy" }, hashes, /policyVersion/u],
    ] as const) {
      expect(() =>
        assertG1CohortManifest(manifest, fixture.freeze, fixture.replacement, nextHashes),
      ).toThrow(message);
    }
  });

  it("swaps the complete directory and restores the previous output on publish failure", () => {
    const root = mkdtempSync(join(tmpdir(), "konocomics-g1-candidate-"));
    const output = join(root, "candidate-source");
    const candidate = join(root, "next-candidate-source");
    const backup = join(root, "previous-candidate-source");

    try {
      mkdirSync(output);
      writeFileSync(join(output, "stale.csv"), "stale\n");
      mkdirSync(candidate);
      writeFileSync(join(candidate, "works.csv"), "new\n");

      publishCandidateDirectory(candidate, output, backup);

      expect(readFileSync(join(output, "works.csv"), "utf8")).toBe("new\n");
      expect(existsSync(join(output, "stale.csv"))).toBe(false);
      expect(existsSync(backup)).toBe(false);

      expect(() =>
        publishCandidateDirectory(join(root, "missing-candidate"), output, backup),
      ).toThrow();
      expect(readFileSync(join(output, "works.csv"), "utf8")).toBe("new\n");
      expect(existsSync(backup)).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("preserves the backup when publish and rollback both fail", () => {
    const root = mkdtempSync(join(tmpdir(), "konocomics-g1-rollback-"));
    const output = join(root, "candidate-source");
    const candidate = join(root, "next-candidate-source");
    const backup = join(root, "previous-candidate-source");
    mkdirSync(output);
    writeFileSync(join(output, "works.csv"), "previous\n");
    mkdirSync(candidate);
    writeFileSync(join(candidate, "works.csv"), "next\n");
    let renameCount = 0;

    try {
      expect(() =>
        publishCandidateDirectory(candidate, output, backup, {
          existsSync,
          renameSync(from, to) {
            renameCount += 1;
            if (renameCount === 1) {
              renameSync(from, to);
              return;
            }
            throw new Error(`rename ${renameCount} failed`);
          },
          rmSync,
        }),
      ).toThrow(/previous candidate is preserved/u);
      expect(readFileSync(join(backup, "works.csv"), "utf8")).toBe("previous\n");
      expect(existsSync(output)).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("keeps a successful publish when backup cleanup fails", () => {
    const root = mkdtempSync(join(tmpdir(), "konocomics-g1-cleanup-"));
    const output = join(root, "candidate-source");
    const candidate = join(root, "next-candidate-source");
    const backup = join(root, "previous-candidate-source");
    mkdirSync(output);
    writeFileSync(join(output, "works.csv"), "previous\n");
    mkdirSync(candidate);
    writeFileSync(join(candidate, "works.csv"), "next\n");
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    try {
      expect(() =>
        publishCandidateDirectory(candidate, output, backup, {
          existsSync,
          renameSync,
          rmSync() {
            throw new Error("cleanup failed");
          },
        }),
      ).not.toThrow();
      expect(readFileSync(join(output, "works.csv"), "utf8")).toBe("next\n");
      expect(readFileSync(join(backup, "works.csv"), "utf8")).toBe("previous\n");
      expect(warning).toHaveBeenCalledWith(expect.stringMatching(/Published candidate/u));
    } finally {
      warning.mockRestore();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("matches Art evidence state, value, and confidence to final factors", () => {
    const fixture = createCompleteArtFixture();
    expect(() =>
      assertG1ArtEvidence(fixture.rows, fixture.factors, fixture.evidence, fixture.cohortIds, []),
    ).not.toThrow();
    expect(() =>
      assertG1ArtEvidence(
        fixture.rows,
        fixture.factors.map((factor, index) =>
          index === 0 ? { ...factor, confidence: "0.94" } : factor,
        ),
        fixture.evidence,
        fixture.cohortIds,
        [],
      ),
    ).toThrow(/does not match final factor/u);
  });

  it("requires exactly one manifest row for every cohort Art axis", () => {
    const fixture = createCompleteArtFixture();
    const firstRow = fixture.rows[0];
    const lastRow = fixture.rows.at(-1);
    if (firstRow === undefined || lastRow === undefined) {
      throw new Error("Expected complete Art evidence fixtures");
    }
    expect(() =>
      assertG1ArtEvidence(
        fixture.rows.slice(0, -1),
        fixture.factors,
        fixture.evidence,
        fixture.cohortIds,
        [],
      ),
    ).toThrow(/exactly 200 rows/u);
    expect(() =>
      assertG1ArtEvidence(
        fixture.rows.map((row, index) => (index === 199 ? firstRow : row)),
        fixture.factors,
        fixture.evidence,
        fixture.cohortIds,
        [],
      ),
    ).toThrow(/Duplicate Art evidence pair/u);
    expect(() =>
      assertG1ArtEvidence(
        fixture.rows.map((row, index) =>
          index === 199 ? { ...lastRow, workId: "outside-work" } : row,
        ),
        fixture.factors,
        fixture.evidence,
        fixture.cohortIds,
        [],
      ),
    ).toThrow(/must equal cohort x Art axes/u);
  });

  it("enforces Art sampling, context, reference, motion, and deferred-work gates", () => {
    const fixture = createCompleteArtFixture();
    const firstRow = fixture.rows[0];
    const motionIndex = fixture.rows.findIndex(
      (row) => row.workId === "work-1" && row.axisId === "motionImpact",
    );
    if (firstRow === undefined || motionIndex < 0) {
      throw new Error("Expected Art evidence fixtures");
    }

    const fiveRefs = Array.from(
      { length: 5 },
      (_, sampleIndex) => `official preview page ${sampleIndex + 1}`,
    ).join("; ");
    const shortRows = fixture.rows.map((row) =>
      row.workId === "work-1"
        ? {
            ...row,
            ...(row.axisId === "motionImpact"
              ? { state: "unknown" as const, value: "", confidence: "" }
              : {}),
            pageOrTimeRefs: fiveRefs,
          }
        : row,
    );
    const shortFactors = fixture.factors.map((factor) =>
      factor.workId === "work-1" && factor.axisId === "motionImpact"
        ? { ...factor, state: "unknown", value: "", confidence: "" }
        : factor,
    );

    expect(() =>
      assertG1ArtEvidence(shortRows, shortFactors, fixture.evidence, fixture.cohortIds, []),
    ).toThrow(/six work-wide samples/u);
    expect(() =>
      assertG1ArtEvidence(
        fixture.rows.map((row) =>
          row.workId === "work-1" ? { ...row, contexts: "same; same" } : row,
        ),
        fixture.factors,
        fixture.evidence,
        fixture.cohortIds,
        [],
      ),
    ).toThrow(/two distinct work-wide contexts/u);
    expect(() =>
      assertG1ArtEvidence(
        [{ ...firstRow, pageOrTimeRefs: "official preview page 1" }, ...fixture.rows.slice(1)],
        fixture.factors,
        fixture.evidence,
        fixture.cohortIds,
        [],
      ),
    ).toThrow(/Known static Art evidence requires two/u);
    expect(() =>
      assertG1ArtEvidence(
        fixture.rows.map((row, index) =>
          index === motionIndex
            ? {
                ...row,
                pageOrTimeRefs: Array.from(
                  { length: 6 },
                  (_, sampleIndex) => `official preview page ${sampleIndex + 1}`,
                ).join("; "),
              }
            : row,
        ),
        fixture.factors,
        fixture.evidence,
        fixture.cohortIds,
        [],
      ),
    ).toThrow(/continuous sequence/u);
    expect(() =>
      assertG1ArtEvidence(fixture.rows, fixture.factors, fixture.evidence, fixture.cohortIds, [
        "work-1",
      ]),
    ).toThrow(/Deferred work cannot remain/u);
  });

  it("joins each Art factor to evidence with the same work, source type, and normalized URL", () => {
    const fixture = createCompleteArtFixture();
    expect(() =>
      assertG1ArtEvidence(fixture.rows, fixture.factors, fixture.evidence, fixture.cohortIds, []),
    ).not.toThrow();
    expect(() =>
      assertG1ArtEvidence(
        fixture.rows,
        fixture.factors.map((factor, index) =>
          index === 0 ? { ...factor, evidenceId: "wrong-url" } : factor,
        ),
        [
          ...fixture.evidence,
          {
            id: "wrong-url",
            workId: "work-1",
            sourceType: "publisher",
            sourceUrl: "https://example.com/other-preview",
          },
        ],
        fixture.cohortIds,
        [],
      ),
    ).toThrow(/provenance does not match final factor/u);
  });

  it("accepts exact MM:SS and HH:MM:SS continuous motion ranges", () => {
    const fixture = createCompleteArtFixture();
    const motionIndex = fixture.rows.findIndex(
      (row) => row.workId === "work-1" && row.axisId === "motionImpact",
    );
    if (motionIndex < 0) {
      throw new Error("Expected a motion evidence fixture");
    }
    for (const range of ["00:20.0-00:21.2", "01:00:20.0-01:00:21.2"]) {
      const rows = fixture.rows.map((row, index) =>
        index === motionIndex
          ? {
              ...row,
              pageOrTimeRefs: [
                "00:20.0",
                "00:20.2",
                "00:20.4",
                "00:20.6",
                "00:20.8",
                "00:21.0",
                range,
              ].join("; "),
            }
          : row,
      );
      expect(() =>
        assertG1ArtEvidence(rows, fixture.factors, fixture.evidence, fixture.cohortIds, []),
      ).not.toThrow();
    }
  });

  it("allows honest unknown evidence but rejects notApplicable as a shortage fallback", () => {
    const fixture = createCompleteArtFixture();
    const firstRow = fixture.rows[0];
    const motionIndex = fixture.rows.findIndex(
      (row) => row.workId === "work-1" && row.axisId === "motionImpact",
    );
    if (firstRow === undefined || motionIndex < 0) {
      throw new Error("Expected Art evidence fixtures");
    }
    const unknownRow = artEvidenceManifestRowSchema.parse({
      ...createArtEvidenceRow(),
      workId: firstRow.workId,
      axisId: firstRow.axisId,
      state: "unknown",
      value: "",
      confidence: "",
      pageOrTimeRefs: "",
      sampleCount: "0",
      contexts: "cover-only context",
    });
    expect(() =>
      assertG1ArtEvidence(
        [unknownRow, ...fixture.rows.slice(1)],
        fixture.factors.map((factor, index) =>
          index === 0 ? { ...factor, state: "unknown", value: "", confidence: "" } : factor,
        ),
        fixture.evidence,
        fixture.cohortIds,
        [],
      ),
    ).not.toThrow();

    const notApplicableRows = fixture.rows.map((row, index) =>
      row.workId === "work-1" && index === motionIndex
        ? artEvidenceManifestRowSchema.parse({
            ...createArtEvidenceRow(),
            workId: row.workId,
            axisId: "motionImpact",
            state: "notApplicable",
            value: "",
            confidence: "",
            pageOrTimeRefs: Array.from(
              { length: 5 },
              (_, sampleIndex) => `official preview page ${sampleIndex + 1}`,
            ).join("; "),
            sampleCount: "0",
            contexts: "one context",
          })
        : row.workId === "work-1"
          ? {
              ...row,
              pageOrTimeRefs: Array.from(
                { length: 5 },
                (_, sampleIndex) => `official preview page ${sampleIndex + 1}`,
              ).join("; "),
              contexts: "one context",
            }
          : row,
    );
    const notApplicableFactors = fixture.factors.map((factor, index) =>
      index === motionIndex
        ? { ...factor, state: "notApplicable", value: "", confidence: "" }
        : factor,
    );
    expect(() =>
      assertG1ArtEvidence(
        notApplicableRows,
        notApplicableFactors,
        fixture.evidence,
        fixture.cohortIds,
        [],
      ),
    ).toThrow(/six work-wide samples/u);
  });

  it("requires Art authority, source type, edition, scope, and review status", () => {
    for (const field of [
      "authorityClass",
      "sourceType",
      "edition",
      "scopeMapping",
      "reviewStatus",
    ]) {
      expect(
        artEvidenceManifestRowSchema.safeParse({ ...createArtEvidenceRow(), [field]: "" }).success,
      ).toBe(false);
    }
    for (const [authorityClass, sourceType] of [
      ["licensedPublisher", "publisher"],
      ["publisherAuthorizedPlatform", "manual"],
      ["originalPublisher", "publisher"],
    ]) {
      expect(
        artEvidenceManifestRowSchema.safeParse({
          ...createArtEvidenceRow(),
          authorityClass,
          sourceType,
        }).success,
      ).toBe(true);
    }
    expect(
      artEvidenceManifestRowSchema.safeParse({
        ...createArtEvidenceRow(),
        authorityClass: "publisherAuthorizedPlatform",
        sourceType: "publisher",
      }).success,
    ).toBe(false);
    expect(
      artEvidenceManifestRowSchema.safeParse({
        ...createArtEvidenceRow(),
        authorityClass: "unverifiedRightsHolder",
      }).success,
    ).toBe(false);
  });
});
