import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";

import {
  readScopeCorrections,
  scopeAuditReviewReferences,
  validateScopeCorrection,
  verifyScopeAfter,
  verifyScopeBefore,
} from "../../../scripts/catalog/scope-correction";
import type { ScopeCorrection } from "../../../scripts/catalog/scope-correction";

const workId = "work-b10c43a5dea21ca208e2";
const resultSha = "f".repeat(64);
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
function canonicalJson(value: unknown): string {
  const ordered = (entry: unknown): unknown => {
    if (Array.isArray(entry)) return entry.map(ordered);
    if (entry !== null && typeof entry === "object")
      return Object.fromEntries(
        Object.entries(entry)
          .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
          .map(([key, field]) => [key, ordered(field)]),
      );
    return entry;
  };
  return JSON.stringify(ordered(value));
}
function correction(inputSha = "1".repeat(64)): ScopeCorrection {
  const tables = {
    source_works: [
      {
        id: workId,
        title: "Retained title",
        onboardingEligible: "true",
        recommendationEligible: "true",
        libraryOnly: "false",
        annotationReviewMethod: "authorizedEvidencePanel",
        annotationReviewReference: "reviews/authorized-evidence-panel-v1-batch-prior.md",
        genres: "historical",
      },
    ],
    source_aliases: [],
    source_volumes: [
      { workId, id: "retained-volume", isbn: "9784750339313", isRepresentative: "true" },
    ],
    source_factors: [
      {
        workId,
        axisId: "plot_complexity",
        state: "known",
        value: "4",
        confidence: "0.9",
        evidenceIds: "old-evidence",
      },
    ],
    source_themes: [{ workId, themeId: "family", value: "2", evidenceIds: "old-evidence" }],
    source_evidence: [
      {
        workId,
        id: "old-evidence",
        sourceUrl: "https://example.com/old",
        notes: "Original evidence",
        confidence: "0.9",
      },
    ],
    source_recommendation_context: [{ workId, publicationStatus: "completed" }],
    source_art_evidence_manifest: [],
    source_book_metadata: [
      { workId, isbn: "9784750339313", description: "Original publisher introduction" },
    ],
  };
  return validateScopeCorrection({
    workId,
    representativeIsbn: "9784750339313",
    action: "EXCLUDE_NON_JAPANESE_ORIGINAL",
    outcome: "OUT_OF_SCOPE",
    reasonCode: "NON_JAPANESE_ORIGINAL",
    inputManifestSha256: inputSha,
    evidenceIds: ["frozen-original-scope"],
    citationUrls: ["https://example.com/original-edition"],
    entryScope: "Japanese original",
    observation: "Original edition was published outside Japan.",
    limitation: "Scope only; accepted annotations stay unchanged.",
    beforeSnapshot: { tables },
    beforeSnapshotSha256: hash(canonicalJson(tables)),
    afterEligibility: {
      onboardingEligible: false,
      recommendationEligible: false,
      libraryOnly: true,
    },
  });
}
function after(scope: ScopeCorrection, manifestSha = resultSha) {
  const tables = structuredClone(scope.beforeSnapshot.tables);
  Object.assign(tables.source_works![0]!, {
    onboardingEligible: "false",
    recommendationEligible: "false",
    libraryOnly: "true",
  });
  const notes = canonicalJson({
    schemaVersion: "catalog-scope-correction-evidence-v1",
    correction: scope,
    reviewReference: "reviews/authorized-evidence-panel-v1-batch-scope.md",
    reviewedByHuman: false,
    resultManifestSha256: manifestSha,
  });
  tables.source_evidence!.push({
    workId,
    id: "ev-scope-correction-" + hash(notes),
    notes,
    extractorVersion: "authorized-evidence-panel-scope-correction-v1",
    targetType: "work",
    targetId: workId,
    sourceType: "manual",
    sourceUrl: scope.citationUrls[0]!,
    fetchedAt: "2026-10-01T00:00:00Z",
    confidence: "0",
    reviewedByHuman: "false",
  });
  return tables;
}

it("accepts only a scope exclusion that retains accepted rows and appends its sealed audit", () => {
  const scope = correction();
  verifyScopeBefore(scope, scope.beforeSnapshot.tables);
  expect(verifyScopeAfter(scope, after(scope), resultSha)).toEqual({
    reviewReference: "reviews/authorized-evidence-panel-v1-batch-scope.md",
  });
  expect(scopeAuditReviewReferences(after(scope).source_evidence!)).toEqual([
    "reviews/authorized-evidence-panel-v1-batch-scope.md",
  ]);
  expect(() => verifyScopeAfter(scope, after(scope, "e".repeat(64)), resultSha)).toThrow(
    "result manifest mismatch",
  );
  expect(() => verifyScopeBefore(scope, after(scope))).toThrow("Scope current before changed");
});

it.each([
  "source_works",
  "source_volumes",
  "source_factors",
  "source_themes",
  "source_recommendation_context",
  "source_book_metadata",
])("rejects changed retained scope data in %s", (table) => {
  const scope = correction();
  const tables = after(scope);
  const row = tables[table]![0]!;
  const field = Object.keys(row).find((name) => name !== "workId" && name !== "id")!;
  row[field] = "changed retained value";
  expect(() => verifyScopeAfter(scope, tables, resultSha)).toThrow("Scope changed retained");
});

it("rejects missing history, duplicate audit rows, changed flags and stale baseline hashes", () => {
  const scope = correction();
  const missing = after(scope);
  missing.source_evidence!.shift();
  expect(() => verifyScopeAfter(scope, missing, resultSha)).toThrow("removed historical evidence");
  const duplicate = after(scope);
  duplicate.source_evidence!.push({ ...duplicate.source_evidence![1]! });
  expect(() => verifyScopeAfter(scope, duplicate, resultSha)).toThrow(
    "Duplicate scope evidence row",
  );
  const eligible = after(scope);
  eligible.source_works![0]!.onboardingEligible = "true";
  expect(() => verifyScopeAfter(scope, eligible, resultSha)).toThrow(
    "Scope changed retained source_works",
  );
  expect(() => validateScopeCorrection({ ...scope, beforeSnapshotSha256: "0".repeat(64) })).toThrow(
    "snapshot SHA mismatch",
  );
});

it("reads a correction only through its sealed result and frozen input manifest", () => {
  const root = mkdtempSync(join(tmpdir(), "konocomics-scope-proof-"));
  const chunk = join(root, "chunk-01");
  mkdirSync(chunk);
  try {
    const input = "a".repeat(64) + "  MODEL-INPUT.json\n";
    const scope = correction(hash(input));
    const scopePath = join(chunk, "scope-corrections.json");
    writeFileSync(join(chunk, "PANEL-INPUT.sha256"), input);
    writeFileSync(
      scopePath,
      canonicalJson({ schemaVersion: "catalog-scope-correction-v1", corrections: [scope] }),
    );
    const seal = () =>
      writeFileSync(
        join(chunk, "PANEL-RESULT.sha256"),
        `${hash(input)}  PANEL-INPUT.sha256\n${hash(readFileSync(scopePath))}  scope-corrections.json\n`,
      );
    seal();
    expect(readScopeCorrections(root)?.corrections).toEqual([scope]);
    writeFileSync(scopePath, readFileSync(scopePath, "utf8") + "\n");
    expect(() => readScopeCorrections(root)).toThrow("Scope result member changed");
    seal();
    writeFileSync(
      scopePath,
      canonicalJson({
        schemaVersion: "catalog-scope-correction-v1",
        corrections: [{ ...scope, inputManifestSha256: "0".repeat(64) }],
      }),
    );
    seal();
    expect(() => readScopeCorrections(root)).toThrow("Scope frozen input SHA mismatch");
    writeFileSync(join(chunk, "PANEL-RESULT.sha256"), `${hash(input)}  PANEL-INPUT.sha256\n`);
    expect(() => readScopeCorrections(root)).toThrow("outside sealed result");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
