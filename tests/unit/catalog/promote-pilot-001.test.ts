import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { describe, expect, it, vi } from "vitest";

import {
  assertPilotPublishSnapshot,
  getPilotPublishDigests,
  mergeRawCsv,
  preparePilotPromotion,
  runPilotPromotion,
  validatePilotPanelDecision,
} from "../../../scripts/promote-pilot-001";
import { writeCatalogCsvProjection } from "../../../scripts/catalog/authority";

const PUBLISH_PATHS = [
  "data/source",
  "data/generated",
  "src/data/generated",
  "public/catalog",
  "data/staging/catalog-expansion",
] as const;

function copyPromotionFixture() {
  const root = mkdtempSync(join(tmpdir(), "konocomics-pilot-promotion-"));
  for (const relativePath of PUBLISH_PATHS) {
    const destination = join(root, relativePath);
    mkdirSync(dirname(destination), { recursive: true });
    if (relativePath === "data/source") {
      writeCatalogCsvProjection(join(process.cwd(), relativePath), destination);
    } else {
      cpSync(join(process.cwd(), relativePath), destination, { recursive: true });
    }
  }
  return root;
}

describe("Pilot 001 raw CSV promotion", () => {
  it("replaces only target records and preserves every other byte", () => {
    const current = 'id,value\nkeep,"line 1\nline 2"\ntarget,old\ntail,unchanged\n';
    const overlay = "id,value\ntarget,new\n";

    expect(
      mergeRawCsv({
        current,
        overlay,
        headers: ["id", "value"],
        matches: (row) => row[0] === "target",
        allowedCurrentMatchCounts: [1],
      }),
    ).toBe('id,value\nkeep,"line 1\nline 2"\ntarget,new\ntail,unchanged\n');

    const alreadyApplied =
      "id,value\nkeep,one\ntarget-a,approved-a\nmiddle,two\ntarget-b,approved-b\ntail,three\n";
    expect(
      mergeRawCsv({
        current: alreadyApplied,
        overlay: "id,value\ntarget-a,approved-a\ntarget-b,approved-b\n",
        headers: ["id", "value"],
        matches: (row) => row[0]?.startsWith("target-") ?? false,
        allowedCurrentMatchCounts: [2],
      }),
    ).toBe(alreadyApplied);
  });

  it("rejects a pre-existing approved ID with different bytes", () => {
    expect(() =>
      mergeRawCsv({
        current: "id,value\nkeep,ok\ntarget,unapproved\n",
        overlay: "id,value\ntarget,approved\n",
        headers: ["id", "value"],
        matches: (row) => row[0] === "target",
        allowedCurrentMatchCounts: [0, 1],
        existingRowsMustMatchOverlay: true,
      }),
    ).toThrow("Existing target rows conflict with approved overlay");
    expect(
      mergeRawCsv({
        current: "id,value\ntarget-a,approved-a-old-hash\n",
        overlay: "id,value\ntarget-a,approved-a-new-hash\ntarget-b,approved-b\n",
        headers: ["id", "value"],
        matches: (row) => row[0]?.startsWith("target-") ?? false,
        allowedCurrentMatchCounts: [0, 1, 2],
        existingRowsMayBeOverlaySubset: true,
        normalizeRow: (row) => row.replace(/-(?:old|new)-hash/u, "-hash"),
      }),
    ).toBe("id,value\ntarget-a,approved-a-new-hash\ntarget-b,approved-b\n");
  });

  it("accepts only exact pre-existing rows from a larger approved overlay", () => {
    expect(
      mergeRawCsv({
        current: "id,value\nkeep,ok\ntarget-a,approved-a\n",
        overlay: "id,value\ntarget-a,approved-a\ntarget-b,approved-b\n",
        headers: ["id", "value"],
        matches: (row) => row[0]?.startsWith("target-") ?? false,
        allowedCurrentMatchCounts: [0, 1, 2],
        existingRowsMayBeOverlaySubset: true,
      }),
    ).toBe("id,value\nkeep,ok\ntarget-a,approved-a\ntarget-b,approved-b\n");
    expect(() =>
      mergeRawCsv({
        current: "id,value\ntarget-a,changed\n",
        overlay: "id,value\ntarget-a,approved-a\ntarget-b,approved-b\n",
        headers: ["id", "value"],
        matches: (row) => row[0]?.startsWith("target-") ?? false,
        allowedCurrentMatchCounts: [0, 1, 2],
        existingRowsMayBeOverlaySubset: true,
      }),
    ).toThrow("Existing target rows conflict with approved overlay");
  });

  it("requires the frozen Local, Gemini, and Grok panel contract", () => {
    const candidateSha256 = "a".repeat(64);
    const reviewRoot = "data/staging/catalog-expansion/pilots/pilot-001/reviews";
    const reviewFiles = new Map<string, Buffer>([
      [`${reviewRoot}/review-ledger.md`, Buffer.from("ledger")],
      [`${reviewRoot}/art-final-matrix.csv`, Buffer.from("matrix")],
      [`${reviewRoot}/art-pass-c-adjudication.md`, Buffer.from("adjudication")],
      [`${reviewRoot}/art-local-audit.md`, Buffer.from("local pixels")],
      [
        `${reviewRoot}/gemini-art-response.txt`,
        Buffer.from("model=gemini-3.7-flash-high\neffort=high"),
      ],
    ]);
    for (const chunk of ["01", "02", "03", "04", "05"]) {
      reviewFiles.set(
        `${reviewRoot}/grok-current-chunk-${chunk}-response.txt`,
        Buffer.from(
          [
            "model=cursor-grok-4.6-high",
            "fast=false",
            "completionStatus=SUCCESS_AFTER_RESUME",
            `candidateSha256=${candidateSha256}`,
            "artAccess=abstained",
          ].join("\n"),
        ),
      );
    }
    const report = [
      "PROMOTION AUTHORIZATION: YES",
      "HUMAN VALIDATION: NOT_RUN",
      "LOCAL ART QUORUM: PASS",
      "GEMINI ART QUORUM: PASS — gemini-3.7-flash-high",
      "GROK ART: ABSTAIN",
      "MUSE: NOT_USED",
      "HARD BLOCKERS: 0",
      `CANDIDATE SHA-256: ${candidateSha256}`,
    ].join("\n");

    expect(() =>
      validatePilotPanelDecision({ candidateSha256, report, reviewFiles }),
    ).not.toThrow();
    reviewFiles.delete(`${reviewRoot}/gemini-art-response.txt`);
    expect(() => validatePilotPanelDecision({ candidateSha256, report, reviewFiles })).toThrow(
      "Local and Gemini Art quorum evidence must both be bound",
    );
  });

  it("rejects approval drift, partial state, and legacy model-derived writes", () => {
    const root = copyPromotionFixture();
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    try {
      const prepared = preparePilotPromotion(root);
      expect(prepared.state).toBe("exactlyApplied");
      rmSync(prepared.temporaryRoot, { recursive: true, force: true });

      const legacyReview = join(
        root,
        "data/staging/catalog-expansion/pilots/pilot-001/reviews/art-salvage-four/eleven-gemini-counted.log",
      );
      writeFileSync(legacyReview, "not the frozen diagnostic log\n", "utf8");
      expect(() => preparePilotPromotion(root)).toThrow(
        "Model-panel review hash mismatch: data/staging/catalog-expansion/pilots/pilot-001/reviews/art-salvage-four/eleven-gemini-counted.log",
      );
      rmSync(legacyReview);

      const requiredReview = join(
        root,
        "data/staging/catalog-expansion/pilots/pilot-001/reviews/art-barakamon-pass-c-adjudication.md",
      );
      const requiredReviewBytes = readFileSync(requiredReview);
      rmSync(requiredReview);
      expect(() => preparePilotPromotion(root)).toThrow(
        "Model-panel review is missing: data/staging/catalog-expansion/pilots/pilot-001/reviews/art-barakamon-pass-c-adjudication.md",
      );
      writeFileSync(requiredReview, requiredReviewBytes);

      const baseline = getPilotPublishDigests(root);
      const drift = join(root, "data/source/.pilot-test-drift");
      writeFileSync(drift, "drift\n", "utf8");
      expect(() =>
        assertPilotPublishSnapshot(
          getPilotPublishDigests(root),
          baseline,
          "Live Pilot outputs changed before publish",
        ),
      ).toThrow("Live Pilot outputs changed before publish: data/source");
      rmSync(drift);

      expect(() => runPilotPromotion("write", root)).toThrow("quarantined in S3");

      const worksPath = join(root, "data/source/works.csv");
      const works = readFileSync(worksPath, "utf8");
      const partial = works.replace(
        /(work-0153a125c5a56225b06c,[^\n]*),true,true,false,1,1,1,authorizedModelPanel/u,
        "$1,false,true,false,1,1,1,authorizedModelPanel",
      );
      expect(partial).not.toBe(works);
      writeFileSync(worksPath, partial, "utf8");
      expect(() => runPilotPromotion("check", root)).toThrow(
        "Pilot source is neither isolated nor exactly applied; partial promotion refused",
      );

      const reportPath = join(
        root,
        "data/staging/catalog-expansion/pilots/pilot-001/final-overlay/pilot-001-promotion-panel.md",
      );
      writeFileSync(reportPath, `${readFileSync(reportPath, "utf8")}\n`, "utf8");
      expect(() => runPilotPromotion("check", root)).toThrow(
        "Final-overlay hash mismatch: pilot-001-promotion-panel.md",
      );
    } finally {
      log.mockRestore();
      rmSync(root, { recursive: true, force: true });
    }
  }, 120_000);
});
