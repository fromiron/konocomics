import { createHash } from "node:crypto";
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
import { dirname, join } from "node:path";

import { parse } from "csv-parse/sync";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import {
  applyG2AnnotationApproval,
  deriveG2AnnotationTargets,
  loadG2CatalogApproval,
  publishDirectorySet,
} from "../../../scripts/promote-g2-catalog";

const temporaryRoots: string[] = [];

function temporaryRoot() {
  const root = mkdtempSync(join(tmpdir(), "konocomics-g2-promotion-"));
  temporaryRoots.push(root);
  return root;
}

function sha256(content: string | Buffer) {
  return createHash("sha256").update(content).digest("hex");
}

function write(path: string, content: string) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function parseRecords(content: string) {
  return z
    .array(z.record(z.string(), z.string()))
    .parse(parse(content, { columns: true, skip_empty_lines: true }));
}

const candidateSourcePaths = [
  "aliases.csv",
  "evidence/art-evidence-manifest.csv",
  "evidence/evidence.csv",
  "factors.csv",
  "recommendation-config.csv",
  "recommendation-context.csv",
  "themes.csv",
  "volumes.csv",
  "works.csv",
] as const;
const candidateGeneratedPaths = [
  "catalog-v1.json",
  "recommendation-context-v1.json",
  "taste-vs-baseline.md",
] as const;
const responseContracts = {
  local: {
    path: "reviews/g2-catalog-annotation-cycle-7-v3-local-response.txt",
    tokens: [
      "Local panel row: GO",
      "Panel-row authorization: RECORD_LOCAL_GO_ROW",
      "Overall G2 / Slice 5 authorization: NOT_GRANTED_BY_LOCAL_ALONE",
    ],
  },
  gemini: {
    path: "reviews/g2-catalog-annotation-cycle-7-v3-gemini-response.txt",
    tokens: [
      "Gemini panel row: GO",
      "Panel-row authorization: RECORD_GEMINI_GO_ROW",
      "Overall G2 / Slice 5 authorization: NOT_GRANTED_BY_GEMINI_ALONE",
    ],
  },
  grok: {
    path: "reviews/g2-catalog-annotation-cycle-7-v3-grok-response.txt",
    tokens: [
      "Grok panel row: GO",
      "Panel-row authorization: RECORD_GROK_GO_ROW",
      "Overall G2 / Slice 5 authorization: NOT_GRANTED_BY_GROK_ALONE",
    ],
  },
  oracle: {
    path: "reviews/g2-catalog-annotation-cycle-7-v3-oracle-response.txt",
    tokens: [
      "Oracle panel row: GO",
      "Panel-row authorization: RECORD_ORACLE_GO_ROW",
      "Overall G2 / Slice 5 authorization: NOT_GRANTED_BY_ORACLE_ALONE",
    ],
  },
} as const;
const validityPaths = {
  local: "reviews/g2-catalog-annotation-cycle-7-v3-local-validity.md",
  gemini: "reviews/g2-catalog-annotation-cycle-7-v3-gemini-validity.md",
  grok: "reviews/g2-catalog-annotation-cycle-7-v3-grok-validity.md",
  oracle: "reviews/g2-catalog-annotation-cycle-7-v3-oracle-validity.md",
} as const;

function createApprovalFixture() {
  const root = temporaryRoot();
  const stagingDirectory = join(root, "data/staging/g2");
  const targetIds = parseRecords(
    readFileSync(join(process.cwd(), "data/staging/g2/candidate-source/works.csv"), "utf8"),
  )
    .filter((row) => row.annotationReviewMethod === "unreviewed")
    .map((row) => row.id ?? "")
    .sort();
  const candidateFiles: Record<string, string> = {};
  const candidateSource = candidateSourcePaths.map((relativePath) => {
    const path = `candidate-source/${relativePath}`;
    const content = `frozen source ${relativePath}\n`;
    write(join(stagingDirectory, path), content);
    const binding = { path, sha256: sha256(content) };
    candidateFiles[path] = binding.sha256;
    return binding;
  });
  const candidateGenerated = candidateGeneratedPaths.map((relativePath) => {
    const path = `candidate-generated/${relativePath}`;
    const content = `frozen generated ${relativePath}\n`;
    write(join(stagingDirectory, path), content);
    const binding = { path, sha256: sha256(content) };
    candidateFiles[path] = binding.sha256;
    return binding;
  });
  const request = {
    path: "reviews/g2-catalog-annotation-cycle-7-v3-request.md" as const,
    sha256: sha256("request\n"),
  };
  const panelReport = {
    path: "reviews/g2-catalog-annotation-cycle-7-v3-report.md" as const,
    sha256: sha256(
      "panel report\n`PROMOTION AUTHORIZATION: YES`\n`PRODUCT-DIRECTION G2 AUTHORIZATION: NO`\n`SLICE 5 AUTHORIZATION: NO`\n",
    ),
  };
  write(join(stagingDirectory, request.path), "request\n");
  write(
    join(stagingDirectory, panelReport.path),
    "panel report\n`PROMOTION AUTHORIZATION: YES`\n`PRODUCT-DIRECTION G2 AUTHORIZATION: NO`\n`SLICE 5 AUTHORIZATION: NO`\n",
  );
  const responses = Object.fromEntries(
    Object.entries(responseContracts).map(([reviewer, contract]) => {
      const content = `GO\n${contract.tokens.join("\n")}\n`;
      write(join(stagingDirectory, contract.path), content);
      return [reviewer, { path: contract.path, sha256: sha256(content) }];
    }),
  ) as {
    [Reviewer in keyof typeof responseContracts]: {
      path: (typeof responseContracts)[Reviewer]["path"];
      sha256: string;
    };
  };
  const validities = Object.fromEntries(
    Object.entries(validityPaths).map(([reviewer, path]) => {
      const content = `${reviewer} validity\n`;
      write(join(stagingDirectory, path), content);
      return [reviewer, { path, sha256: sha256(content) }];
    }),
  ) as {
    [Reviewer in keyof typeof validityPaths]: {
      path: (typeof validityPaths)[Reviewer];
      sha256: string;
    };
  };
  const manifest = {
    schemaVersion: 1,
    policyVersion: "g2-catalog-annotation-authorized-model-panel-v1",
    approvalScope: "catalog-annotation-only",
    annotationReviewedAt: "2026-08-13T16:00:00+09:00",
    reviewReference: "reviews/g2-catalog-annotation-panel.md",
    reviewedRepository: "fromiron/konocomics",
    reviewedBranch: "main",
    reviewedHead: "cc71d38d573cd24c520cbef62c607ee7a876490f",
    exactHeadCi: { runId: 31682502622, status: "success" },
    evidenceZip: {
      filename: "konocomics-g2-four-path-v3.zip",
      sha256: "cee690a0b2a35b12c5cdfd655bdf84b13e7d1a22470e46a6d690cdb908d818c4",
    },
    targetWorkIds: targetIds,
    targetWorkIdsSha256: "7904dc8f869cb9a116ea25b05c888a7c3ec4f60a720a45e3fbd7e04ae3e59841",
    preApprovalBindings: { candidateSource, candidateGenerated },
    request,
    panelReport,
    responses,
    validities,
  };
  const manifestPath = join(stagingDirectory, "g2-catalog-annotation-approval.json");
  const saveManifest = () => write(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  saveManifest();
  return {
    root,
    stagingDirectory,
    targetIds,
    candidateFiles,
    snapshot: {
      catalog: candidateFiles["candidate-generated/catalog-v1.json"] ?? "",
      recommendationContext:
        candidateFiles["candidate-generated/recommendation-context-v1.json"] ?? "",
      candidateFiles,
    },
    manifest,
    manifestPath,
    manifestSha256: sha256(readFileSync(manifestPath)),
    saveManifest,
  };
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("G2 catalog annotation target contract", () => {
  it("derives code-unit-sorted target IDs and hashes their LF records with a terminal LF", () => {
    const root = temporaryRoot();
    const baselineDirectory = join(root, "baseline");
    const candidateDirectory = join(root, "candidate");
    const candidate = readFileSync(
      join(process.cwd(), "data/staging/g2/candidate-source/works.csv"),
      "utf8",
    );
    const [header, ...candidateRows] = candidate.trimEnd().split("\n");
    const candidateRecords = parseRecords(candidate);
    const baselineIds = new Set([
      ...candidateRecords
        .filter((row) => row.annotationReviewMethod === "authorizedModelPanel")
        .map((row) => row.id ?? ""),
      "haikyu",
    ]);
    write(
      join(baselineDirectory, "works.csv"),
      `${header ?? ""}\n${candidateRows
        .filter((row) => baselineIds.has(row.split(",", 1)[0] ?? ""))
        .map((row) =>
          row.startsWith("haikyu,")
            ? row.replace(
                ",unreviewed,,,",
                ",authorizedModelPanel,2026-08-11T21:06:26+09:00,reviews/g1-sanity-panel.md,",
              )
            : row,
        )
        .join("\n")}\n`,
    );
    write(
      join(candidateDirectory, "works.csv"),
      `${header ?? ""}\n${candidateRows.reverse().join("\n")}\n`,
    );

    const derived = deriveG2AnnotationTargets(baselineDirectory, candidateDirectory);

    expect(derived.targetIds).toHaveLength(101);
    expect(derived.targetIds).toEqual([...derived.targetIds].sort());
    expect(derived.targetIdsSha256).toBe(
      "7904dc8f869cb9a116ea25b05c888a7c3ec4f60a720a45e3fbd7e04ae3e59841",
    );
    expect(derived.targetIdsSha256).toBe(sha256(`${derived.targetIds.join("\n")}\n`));
    expect(derived.targetIdsSha256).not.toBe(sha256(derived.targetIds.join("\n")));
  });

  it("changes exactly the review triplet for the exact unreviewed targets", () => {
    const candidateDirectory = join(process.cwd(), "data/staging/g2/candidate-source");
    const before = readFileSync(join(candidateDirectory, "works.csv"), "utf8");
    const targetIds = parseRecords(before)
      .filter((row) => row.annotationReviewMethod === "unreviewed")
      .map((row) => row.id ?? "")
      .sort();
    const after = applyG2AnnotationApproval(
      before,
      targetIds,
      "2026-08-13T16:00:00+09:00",
      "reviews/g2-catalog-annotation-panel.md",
    );
    const beforeRows = parseRecords(before);
    const afterRows = parseRecords(after);
    const targetSet = new Set(targetIds);
    const reviewFields = new Set([
      "annotationReviewMethod",
      "annotationReviewedAt",
      "annotationReviewReference",
    ]);

    expect(afterRows).toHaveLength(beforeRows.length);
    for (const [index, beforeRow] of beforeRows.entries()) {
      const afterRow = afterRows[index];
      expect(afterRow).toBeDefined();
      const id = beforeRow.id ?? "";
      for (const field of Object.keys(beforeRow)) {
        if (!reviewFields.has(field)) {
          expect(afterRow?.[field]).toBe(beforeRow[field]);
        }
      }
      if (targetSet.has(id)) {
        expect(afterRow).toMatchObject({
          annotationReviewMethod: "authorizedModelPanel",
          annotationReviewedAt: "2026-08-13T16:00:00+09:00",
          annotationReviewReference: "reviews/g2-catalog-annotation-panel.md",
        });
      } else {
        expect(afterRow).toMatchObject({
          annotationReviewMethod: beforeRow.annotationReviewMethod,
          annotationReviewedAt: beforeRow.annotationReviewedAt,
          annotationReviewReference: beforeRow.annotationReviewReference,
        });
      }
    }
    expect(after).not.toContain(",unreviewed,");
  });

  it("rejects a target set that omits or adds an annotation row", () => {
    const candidateDirectory = join(process.cwd(), "data/staging/g2/candidate-source");
    const before = readFileSync(join(candidateDirectory, "works.csv"), "utf8");
    const targetIds = parseRecords(before)
      .filter((row) => row.annotationReviewMethod === "unreviewed")
      .map((row) => row.id ?? "")
      .sort();

    expect(() =>
      applyG2AnnotationApproval(
        before,
        targetIds.slice(1),
        "2026-08-13T16:00:00+09:00",
        "reviews/g2-catalog-annotation-panel.md",
      ),
    ).toThrow(/target|unreviewed|exact/iu);
    expect(() =>
      applyG2AnnotationApproval(
        before,
        [...targetIds, "not-a-work"],
        "2026-08-13T16:00:00+09:00",
        "reviews/g2-catalog-annotation-panel.md",
      ),
    ).toThrow(/target|work|exact/iu);
  });
});

describe("G2 catalog annotation approval binding", () => {
  it("loads a scope-limited manifest bound to all candidate and review bytes", () => {
    const fixture = createApprovalFixture();

    const approval = loadG2CatalogApproval(
      fixture.root,
      fixture.snapshot,
      fixture.targetIds,
      fixture.manifestSha256,
    );

    expect(approval.approvalScope).toBe("catalog-annotation-only");
    expect(approval.targetWorkIds).toEqual(fixture.targetIds);
  });

  it("rejects a stale candidate or review hash binding", () => {
    const candidateFixture = createApprovalFixture();
    write(
      join(candidateFixture.stagingDirectory, "candidate-source/factors.csv"),
      "changed source\n",
    );
    expect(() =>
      loadG2CatalogApproval(
        candidateFixture.root,
        candidateFixture.snapshot,
        candidateFixture.targetIds,
        candidateFixture.manifestSha256,
      ),
    ).toThrow(/pre-approval file hash mismatch/iu);

    const reviewFixture = createApprovalFixture();
    write(join(reviewFixture.stagingDirectory, reviewFixture.manifest.request.path), "changed\n");
    expect(() =>
      loadG2CatalogApproval(
        reviewFixture.root,
        reviewFixture.snapshot,
        reviewFixture.targetIds,
        reviewFixture.manifestSha256,
      ),
    ).toThrow(/review file hash mismatch/iu);
  });

  it("rejects target identity drift and any scope broader than catalog annotations", () => {
    const targetFixture = createApprovalFixture();
    expect(() =>
      loadG2CatalogApproval(
        targetFixture.root,
        targetFixture.snapshot,
        [...targetFixture.targetIds.slice(0, -1), "not-the-frozen-target"],
        targetFixture.manifestSha256,
      ),
    ).toThrow(/target work IDs/iu);

    const scopeFixture = createApprovalFixture();
    scopeFixture.manifest.approvalScope = "product-direction-g2";
    scopeFixture.saveManifest();
    expect(() =>
      loadG2CatalogApproval(
        scopeFixture.root,
        scopeFixture.snapshot,
        scopeFixture.targetIds,
        sha256(readFileSync(scopeFixture.manifestPath)),
      ),
    ).toThrow();
  });

  it("rejects a hash-bound non-GO response", () => {
    const fixture = createApprovalFixture();
    const binding = fixture.manifest.responses.local;
    const content = `REVISE\n${responseContracts.local.tokens.join("\n")}\n`;
    write(join(fixture.stagingDirectory, binding.path), content);
    binding.sha256 = sha256(content);
    fixture.saveManifest();

    expect(() =>
      loadG2CatalogApproval(
        fixture.root,
        fixture.snapshot,
        fixture.targetIds,
        sha256(readFileSync(fixture.manifestPath)),
      ),
    ).toThrow(/must start with exactly GO/iu);
  });

  it("rejects GO text carrying another reviewer identity or authorization tokens", () => {
    const fixture = createApprovalFixture();
    const binding = fixture.manifest.responses.local;
    const content = "GO\nGemini panel row: GO\nRECORD_LOCAL_GO_ROW\nNOT_GRANTED_BY_LOCAL_ALONE\n";
    write(join(fixture.stagingDirectory, binding.path), content);
    binding.sha256 = sha256(content);
    fixture.saveManifest();

    expect(() =>
      loadG2CatalogApproval(
        fixture.root,
        fixture.snapshot,
        fixture.targetIds,
        sha256(readFileSync(fixture.manifestPath)),
      ),
    ).toThrow(/Local|reviewer|token|identity/iu);
  });
});

describe("G2 catalog publication transaction", () => {
  function directory(root: string, name: string, content: string) {
    const path = join(root, name);
    write(join(path, "identity.txt"), content);
    return path;
  }

  it("restores every prior output when a later directory publish fails", () => {
    const root = temporaryRoot();
    const candidateA = directory(root, "candidate-a", "new-a");
    const candidateB = directory(root, "candidate-b", "new-b");
    const outputA = directory(root, "output-a", "old-a");
    const outputB = directory(root, "output-b", "old-b");
    const backupA = join(root, "backup-a");
    const backupB = join(root, "backup-b");
    const operations = {
      existsSync,
      renameSync: vi.fn((source: string, destination: string) => {
        if (source === candidateB && destination === outputB) {
          throw new Error("publish-b failed");
        }
        renameSync(source, destination);
      }),
      rmSync,
    };

    expect(() =>
      publishDirectorySet(
        [
          { candidate: candidateA, output: outputA, backup: backupA },
          { candidate: candidateB, output: outputB, backup: backupB },
        ],
        operations,
      ),
    ).toThrow("publish-b failed");

    expect(readFileSync(join(outputA, "identity.txt"), "utf8")).toBe("old-a");
    expect(readFileSync(join(outputB, "identity.txt"), "utf8")).toBe("old-b");
    expect(readFileSync(join(candidateB, "identity.txt"), "utf8")).toBe("new-b");
    expect(existsSync(backupA)).toBe(false);
    expect(existsSync(backupB)).toBe(false);
  });

  it("surfaces the publish and rollback errors and leaves the backup recoverable", () => {
    const root = temporaryRoot();
    const candidateA = directory(root, "candidate-a", "new-a");
    const candidateB = directory(root, "candidate-b", "new-b");
    const outputA = directory(root, "output-a", "old-a");
    const outputB = directory(root, "output-b", "old-b");
    const backupA = join(root, "backup-a");
    const backupB = join(root, "backup-b");
    const operations = {
      existsSync,
      renameSync: vi.fn((source: string, destination: string) => {
        if (source === candidateB && destination === outputB) {
          throw new Error("publish-b failed");
        }
        if (source === backupA && destination === outputA) {
          throw new Error("restore-a failed");
        }
        renameSync(source, destination);
      }),
      rmSync,
    };

    let caught: unknown;
    try {
      publishDirectorySet(
        [
          { candidate: candidateA, output: outputA, backup: backupA },
          { candidate: candidateB, output: outputB, backup: backupB },
        ],
        operations,
      );
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(AggregateError);
    expect(caught).toMatchObject({
      errors: expect.arrayContaining([
        expect.objectContaining({ message: "publish-b failed" }),
        expect.objectContaining({ message: "restore-a failed" }),
      ]),
    });
    expect(readFileSync(join(backupA, "identity.txt"), "utf8")).toBe("old-a");
  });
});
