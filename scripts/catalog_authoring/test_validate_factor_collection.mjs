import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, relative, isAbsolute } from "node:path";
import test from "node:test";
import { startCollection, recordProgress } from "./collect_factor_evidence.mjs";
import {
  validateResearchRow,
  validateCollectionErrors,
} from "./validate_factor_collection_batch.mjs";

test("explicit supplemental inputs keep original bytes and reject incomplete or competing sessions", () => {
  const parent = resolve(
    import.meta.dirname,
    "../../data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902/planning",
  );
  mkdirSync(parent, { recursive: true });
  const directory = mkdtempSync(join(parent, "collection-input-test-"));
  const originals = mkdtempSync(join(tmpdir(), "collection-originals-"));
  try {
    const source = join(originals, "research.jsonl");
    const raw = Buffer.from("Unstructured user material\n");
    writeFileSync(source, raw);
    const value = startCollection(directory, "work-aaaaaaaaaaaaaaaaaaaa", [source]);
    const selected = value.supplementalFiles[0];
    assert.match(selected.path, /^supplemental\/input-0001-research.jsonl$/u);
    assert.deepEqual(readFileSync(join(directory, selected.path)), raw);
    assert.equal(selected.sha256, createHash("sha256").update(raw).digest("hex"));
    assert.throws(
      () => startCollection(directory, "work-bbbbbbbbbbbbbbbbbbbb", [source]),
      /EEXIST/u,
    );
    rmSync(source);
    recordProgress(directory, "reading-finished", "Original bytes remain local");
    writeFileSync(join(directory, selected.path), "changed");
    assert.throws(
      () => recordProgress(directory, "writing-started"),
      /Supplemental input changed/u,
    );
    writeFileSync(join(directory, selected.path), raw);
    writeFileSync(
      join(directory, "collection-session.json"),
      JSON.stringify({ workId: value.workId, startedAt: value.startedAt }),
    );
    assert.throws(
      () => recordProgress(directory, "writing-started"),
      /Supplemental membership changed/u,
    );
    writeFileSync(join(directory, "collection-session.json"), JSON.stringify(value));
    rmSync(join(directory, selected.path));
    assert.throws(
      () => recordProgress(directory, "writing-started"),
      /Missing supplemental input/u,
    );
    writeFileSync(source, raw);
    const duplicate = join(directory, "duplicate");
    assert.throws(
      () => startCollection(duplicate, value.workId, [source, source]),
      /Duplicate supplemental input/u,
    );
    assert.throws(
      () => startCollection(duplicate, value.workId, [originals]),
      /exact regular file/u,
    );
  } finally {
    const contained = relative(parent, directory);
    assert(contained && !isAbsolute(contained) && !contained.startsWith(".."));
    rmSync(directory, { recursive: true, force: true });
    rmSync(originals, { recursive: true, force: true });
  }
});

test("collection errors preserve failure evidence and never become source exhaustion", () => {
  const root = mkdtempSync(join(tmpdir(), "catalog-collection-error-"));
  try {
    const body = Buffer.from("Actual saved retrieval failure: connection reset");
    const failure = join(root, "failure.txt");
    writeFileSync(failure, body);
    const row = {
      schemaVersion: "factor-evidence-collector-v1",
      workId: "work-aaaaaaaaaaaaaaaaaaaa",
      status: "ERROR",
      error: "Source retrieval failed",
      errorScope: "work",
      retryCondition: "Retry when source retrieval is available",
      failureEvidence: [{ path: failure, sha256: createHash("sha256").update(body).digest("hex") }],
      candidateOnly: true,
      reviewedByHuman: false,
      grokUsed: false,
      paidSourceUsed: false,
      sources: [],
      remainingGaps: [],
    };
    assert.equal(validateResearchRow(row, new Set()), 0);
    validateCollectionErrors(join(root, "research.jsonl"), [row]);
    for (const changed of [
      { errorScope: "unknown" },
      { retryCondition: "" },
      { failureEvidence: [] },
      { error: "" },
    ]) {
      assert.throws(() => validateResearchRow({ ...row, ...changed }, new Set()));
    }
    writeFileSync(failure, "Changed failure bytes");
    assert.throws(
      () => validateCollectionErrors(join(root, "research.jsonl"), [row]),
      /failure evidence SHA mismatch/u,
    );
    assert.throws(
      () =>
        validateCollectionErrors(join(root, "research.jsonl"), [
          { ...row, failureEvidence: [{ ...row.failureEvidence[0], path: "../outside.txt" }] },
        ]),
      /outside collection/u,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("collector validation has no provider field or provider-name gate", () => {
  const row = {
    schemaVersion: "factor-evidence-collector-v1",
    workId: "work-aaaaaaaaaaaaaaaaaaaa",
    status: "INSUFFICIENT",
    candidateOnly: true,
    reviewedByHuman: false,
    paidSourceUsed: false,
    sources: [],
    remainingGaps: ["identity"],
    retryCondition: "Obtain same-work evidence",
    notes: "Grok or any other executor",
  };
  assert.equal(validateResearchRow(row, new Set()), 0);
  assert.equal(validateResearchRow({ ...row, grokUsed: true }, new Set()), 0);
  assert.throws(() => validateResearchRow({ ...row, paidSourceUsed: true }, new Set()));
  assert.throws(() => validateResearchRow({ ...row, reviewedByHuman: true }, new Set()));
});
