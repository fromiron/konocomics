import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  assertNode24,
  canonicalTextBytes,
  lexicalTupleDigest,
  parseLexicalCsv,
  serializeCsv,
  sha256,
  sourceManifestDigest,
} from "../../../scripts/catalog-shadow.mjs";
import { runCommunityAdjudicationBatch } from "../../../scripts/apply-community-adjudication-batch";
import { runBatch002Overlay } from "../../../scripts/build-batch-002-overlay";
import {
  ingestModelAttempt,
  MODEL_DERIVED_WRITE_QUARANTINE_ERROR,
} from "../../../scripts/catalog/candidate-quarantine";
import {
  EMPTY_CITATION_SET_DIGEST,
  LEGACY_CUTOFF_SOURCE_MANIFEST,
  LEGACY_SNAPSHOT_REASON,
} from "../../../scripts/catalog/fact-resolution";
import { runBatch002Promotion } from "../../../scripts/promote-batch-002";
import { promoteG2Catalog } from "../../../scripts/promote-g2-catalog";
import { runPilotPromotion } from "../../../scripts/promote-pilot-001";

const authoritySchemaPath = fileURLToPath(
  new URL("../../../scripts/sql/catalog-authority/001-init.sql", import.meta.url),
);
const proofSchemaPath = fileURLToPath(
  new URL("../../../scripts/sql/catalog-shadow/002-proof.sql", import.meta.url),
);
const schemaSql = `${readFileSync(authoritySchemaPath, "utf8")}\n${readFileSync(
  proofSchemaPath,
  "utf8",
)}`;

describe("catalog SQLite shadow adapter", () => {
  it("rejects non-24 runtimes without using runtime metadata in semantic digests", () => {
    expect(() => assertNode24("v24.19.0")).not.toThrow();
    expect(() => assertNode24("v23.11.0")).toThrow("requires Node 24 LTS");
    expect(() => assertNode24("v25.0.0")).toThrow("requires Node 24 LTS");

    const parsed = parseLexicalCsv("fixture.csv", Buffer.from("a\n1\n"), ["a"]);
    const opaque = [{ path: "note.md", rawSha256: sha256(Buffer.from("x")), byteLength: 1 }];
    expect(sourceManifestDigest([parsed], opaque)).toBe(sourceManifestDigest([parsed], opaque));
  });

  it("preserves lexical cells while canonicalizing checkout line endings", () => {
    const crlf = Buffer.from('\uFEFFa,b\r\n1," x\r\ny "\r\n\r\n2,\uFEFFz\r\n');
    const lf = Buffer.from('a,b\n1," x\ny "\n\n2,\uFEFFz\n');
    const parsed = parseLexicalCsv("fixture.csv", crlf, ["a", "b"]);
    const baseline = parseLexicalCsv("fixture.csv", lf, ["a", "b"]);

    expect(parsed.rows).toEqual([
      { sourceOrdinal: 1, sourceLine: 4, values: ["1", " x\ny "] },
      { sourceOrdinal: 2, sourceLine: 6, values: ["2", "\uFEFFz"] },
    ]);
    expect(lexicalTupleDigest(parsed)).toBe(lexicalTupleDigest(baseline));
    expect(serializeCsv(parsed)).toEqual(Buffer.from('a,b\n1," x\ny "\n2,\uFEFFz\n'));
    expect(sha256(crlf)).not.toBe(sha256(lf));
  });

  it("rejects invalid UTF-8 and malformed source structure", () => {
    expect(() => parseLexicalCsv("bad.csv", Buffer.from([0xff]), ["a"])).toThrow("invalid UTF-8");
    expect(() => parseLexicalCsv("bad.csv", Buffer.from("a,a\n1,2\n"), ["a", "a"])).toThrow(
      "duplicate header",
    );
    expect(() => parseLexicalCsv("bad.csv", Buffer.from("a,\n1,2\n"), ["a", ""])).toThrow(
      "empty header",
    );
    expect(() => parseLexicalCsv("bad.csv", Buffer.from("a,b\n1\n"), ["a", "b"])).toThrow(
      "malformed CSV",
    );
    expect(() => parseLexicalCsv("bad.csv", Buffer.from('a\n"unterminated\n'), ["a"])).toThrow(
      "malformed CSV",
    );
  });

  it("canonicalizes identity text without trimming or inventing a terminal newline", () => {
    expect(canonicalTextBytes("policy.md", Buffer.from(" a\r\n b\r\n"))).toEqual(
      Buffer.from(" a\n b\n"),
    );
    expect(sha256(canonicalTextBytes("policy.md", Buffer.from("x")))).not.toBe(
      sha256(canonicalTextBytes("policy.md", Buffer.from("x\n"))),
    );
    expect(() => canonicalTextBytes("policy.md", Buffer.from("\uFEFFx"))).toThrow(
      "UTF-8 BOM is prohibited",
    );
    expect(() => canonicalTextBytes("policy.md", Buffer.from("x\ry"))).toThrow(
      "lone CR is prohibited",
    );
    expect(() => canonicalTextBytes("policy.md", Buffer.from([0xff]))).toThrow("invalid UTF-8");
  });

  it("rejects malformed candidates and every model-derived authoring writer before I/O", () => {
    const database = new DatabaseSync(":memory:");
    database.exec("PRAGMA foreign_keys = ON");
    database.exec(schemaSql);
    database
      .prepare(
        `INSERT INTO source_import (
          id, baseline_commit, raw_source_tree_digest, source_manifest_digest,
          node_version, sqlite_version, os, architecture
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(1, "baseline", "0".repeat(64), "a".repeat(64), "v24.19.0", "3.53.3", "win32", "x64");
    const valid = {
      attemptId: "1".repeat(64),
      provider: "provider",
      model: "model-v1",
      sourceManifestDigest: "a".repeat(64),
      requestSha256: "2".repeat(64),
      responseSha256: "3".repeat(64),
      claims: [
        {
          factKey: "work:dungeon-meshi:factor:progression",
          candidateValue: "4",
          citations: ["https://example.com/source"],
        },
      ],
    };
    try {
      expect(() =>
        ingestModelAttempt(database, {
          ...valid,
          claims: [{ ...valid.claims[0], promotionOutcome: "gold" }],
        }),
      ).toThrow();
      expect(() =>
        ingestModelAttempt(database, {
          ...valid,
          claims: [{ ...valid.claims[0], factKey: "work:x:blocker:promotionBlocked" }],
        }),
      ).toThrow();
      expect(() =>
        ingestModelAttempt(database, {
          ...valid,
          claims: [{ ...valid.claims[0], factKey: "work:dungeon-meshi:genre:notReal" }],
        }),
      ).toThrow("Unknown genre candidate key");
      expect(() =>
        ingestModelAttempt(database, {
          ...valid,
          claims: [{ ...valid.claims[0], factKey: "work:missing:factor:progression" }],
        }),
      ).toThrow("Candidate work must match one source row");
      expect(() =>
        ingestModelAttempt(database, {
          ...valid,
          claims: [{ ...valid.claims[0], citations: ["not-a-url"] }],
        }),
      ).toThrow();
      expect(() =>
        ingestModelAttempt(database, { ...valid, sourceManifestDigest: "b".repeat(64) }),
      ).toThrow("does not match the imported shadow");
      expect(database.prepare("SELECT count(*) AS count FROM model_attempt").get().count).toBe(0);
      expect(database.prepare("SELECT count(*) AS count FROM claim_candidate").get().count).toBe(0);
    } finally {
      database.close();
    }

    const missingRoot = "Z:\\konocomics-s3-no-such-root";
    for (const invoke of [
      () => runBatch002Overlay("write", missingRoot),
      () => runCommunityAdjudicationBatch("batch-006", "write", missingRoot),
      () => runBatch002Promotion("write", missingRoot),
      () => runPilotPromotion("write", missingRoot),
      () => promoteG2Catalog(missingRoot),
      () => runBatch002Overlay("invalid", missingRoot),
      () => runCommunityAdjudicationBatch("batch-006", undefined, missingRoot),
    ]) {
      expect(invoke).toThrow(MODEL_DERIVED_WRITE_QUARANTINE_ERROR);
    }
  });

  it("enforces the motionImpact notApplicable rule in SQLite", () => {
    const database = new DatabaseSync(":memory:");
    database.exec(schemaSql);
    const insert = database.prepare(
      `INSERT INTO fact_resolution (
        fact_key, state, value_type, lexical_value, authority_kind,
        authority_artifact_digest, citation_set_digest, reason_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    try {
      expect(() =>
        insert.run(
          "work:dungeon-meshi:factor:motionImpact",
          "notApplicable",
          "none",
          "",
          "legacySnapshot",
          LEGACY_CUTOFF_SOURCE_MANIFEST,
          EMPTY_CITATION_SET_DIGEST,
          LEGACY_SNAPSHOT_REASON,
        ),
      ).not.toThrow();
      expect(() =>
        insert.run(
          "work:dungeon-meshi:factor:progression",
          "notApplicable",
          "none",
          "",
          "legacySnapshot",
          LEGACY_CUTOFF_SOURCE_MANIFEST,
          EMPTY_CITATION_SET_DIGEST,
          LEGACY_SNAPSHOT_REASON,
        ),
      ).toThrow();
    } finally {
      database.close();
    }
  });
});
