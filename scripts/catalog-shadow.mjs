import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { arch, platform, tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath, pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";

import { buildCatalog } from "./build-catalog.ts";
import {
  buildPromotionRegistry,
  loadPromotionRegistryInput,
  serializePromotionRegistry,
  validatePromotionRegistry,
} from "./build-promotion-registry.ts";
import { ingestModelAttempt, readModelAttempt } from "./catalog/candidate-quarantine.ts";
import {
  bootstrapLegacySnapshot,
  LEGACY_CUTOFF_BASELINE_COMMIT,
  LEGACY_RESOLUTION_COUNTS,
  readResolutionSnapshot,
} from "./catalog/fact-resolution.ts";
import { loadCatalogSource } from "./catalog/load-source.ts";

export const BASELINE_COMMIT = LEGACY_CUTOFF_BASELINE_COMMIT;

export const TABLES = [
  {
    path: "works.csv",
    table: "source_works",
    expectedRows: 1614,
    headers: [
      "id",
      "title",
      "titleKana",
      "creators",
      "publisher",
      "demographic",
      "status",
      "firstPublishedYear",
      "genres",
      "factorScope",
      "onboardingEligible",
      "recommendationEligible",
      "libraryOnly",
      "metadataConfidence",
      "groupingConfidence",
      "sourceAgreement",
      "annotationReviewMethod",
      "annotationReviewedAt",
      "annotationReviewReference",
      "evidenceId",
    ],
  },
  {
    path: "aliases.csv",
    table: "source_aliases",
    expectedRows: 178,
    headers: ["workId", "alias"],
  },
  {
    path: "volumes.csv",
    table: "source_volumes",
    expectedRows: 1618,
    headers: [
      "id",
      "workId",
      "volumeNumber",
      "isbn",
      "releaseDate",
      "editionKind",
      "isRepresentative",
      "evidenceId",
    ],
  },
  {
    path: "factors.csv",
    table: "source_factors",
    expectedRows: 27438,
    headers: ["workId", "axisId", "state", "value", "confidence", "evidenceId"],
  },
  {
    path: "themes.csv",
    table: "source_themes",
    expectedRows: 2565,
    headers: ["workId", "themeId", "centrality", "confidence", "evidenceId"],
  },
  {
    path: "recommendation-context.csv",
    table: "source_recommendation_context",
    expectedRows: 1481,
    headers: [
      "workId",
      "catalogRole",
      "seriesGroupId",
      "volumeCount",
      "reviewAverage",
      "reviewCount",
    ],
  },
  {
    path: "recommendation-config.csv",
    table: "source_recommendation_config",
    expectedRows: 1,
    headers: ["catalogAverageRating"],
  },
  {
    path: "evidence/evidence.csv",
    table: "source_evidence",
    expectedRows: 2458,
    headers: [
      "id",
      "workId",
      "targetType",
      "targetId",
      "sourceType",
      "sourceUrl",
      "fetchedAt",
      "extractorVersion",
      "reviewedByHuman",
      "confidence",
      "notes",
    ],
  },
  {
    path: "evidence/art-evidence-manifest.csv",
    table: "source_art_evidence_manifest",
    expectedRows: 1060,
    headers: [
      "workId",
      "axisId",
      "state",
      "value",
      "confidence",
      "authorityClass",
      "sourceType",
      "sourceUrl",
      "edition",
      "scopeMapping",
      "pageOrTimeRefs",
      "sampleCount",
      "contexts",
      "observation",
      "limitation",
      "reviewStatus",
    ],
  },
];

const OPAQUE_PATHS = [
  "README.md",
  "evidence/seed-annotations.md",
  "reviews/batch-002-promotion-panel.md",
  "reviews/batch-003-promotion-panel.md",
  "reviews/batch-004-promotion-panel.md",
  "reviews/batch-005-promotion-panel.md",
  "reviews/community-promotion-v4.md",
  "reviews/g1-sanity-panel.md",
  "reviews/g2-catalog-annotation-panel.md",
  "reviews/pilot-001-promotion-panel.md",
  "reviews/slice1-seed-panel-request.md",
  "reviews/slice1-seed-panel.md",
];

const EXPECTED_PATHS = [...TABLES.map((table) => table.path), ...OPAQUE_PATHS].sort(compareText);
const SCHEMA_PATH = fileURLToPath(new URL("./sql/catalog-shadow/001-init.sql", import.meta.url));

export function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function jsonDigest(value) {
  return sha256(Buffer.from(JSON.stringify(value), "utf8"));
}

export function assertNode24(version = process.version) {
  const major = Number.parseInt(version.replace(/^v/u, "").split(".", 1)[0] ?? "", 10);
  if (major !== 24) {
    throw new Error(`catalog:shadow requires Node 24 LTS; received ${version}`);
  }
}

function normalizeCell(value) {
  return value.replace(/\r\n?/gu, "\n");
}

export function parseLexicalCsv(path, bytes, expectedHeaders) {
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (error) {
    throw new Error(`${path}: invalid UTF-8`, { cause: error });
  }

  let records;
  try {
    records = parse(text, {
      bom: false,
      columns: false,
      info: true,
      relax_column_count: false,
      skip_empty_lines: true,
      trim: false,
    });
  } catch (error) {
    throw new Error(`${path}: malformed CSV: ${error instanceof Error ? error.message : error}`, {
      cause: error,
    });
  }
  if (records.length === 0) throw new Error(`${path}: missing header`);

  const headers = records[0].record.map(normalizeCell);
  if (headers.some((header) => header === "")) throw new Error(`${path}: empty header`);
  if (new Set(headers).size !== headers.length) throw new Error(`${path}: duplicate header`);
  if (JSON.stringify(headers) !== JSON.stringify(expectedHeaders)) {
    throw new Error(`${path}: header mismatch`);
  }

  const rows = records.slice(1).map((entry, index) => {
    if (entry.record.length !== headers.length) {
      throw new Error(`${path}:${entry.info.lines}: column count mismatch`);
    }
    return {
      sourceOrdinal: index + 1,
      sourceLine: entry.info.lines,
      values: entry.record.map(normalizeCell),
    };
  });
  return { path, headers, rows };
}

function csvCell(value) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export function serializeCsv(parsed) {
  const lines = [
    parsed.headers.map(csvCell).join(","),
    ...parsed.rows.map((row) => row.values.map(csvCell).join(",")),
  ];
  return Buffer.from(`${lines.join("\n")}\n`, "utf8");
}

export function lexicalTupleDigest(parsed) {
  const tuples = parsed.rows.flatMap((row) =>
    parsed.headers.map((header, index) => [
      parsed.path,
      row.sourceOrdinal,
      header,
      row.values[index],
    ]),
  );
  tuples.sort((left, right) => compareText(JSON.stringify(left), JSON.stringify(right)));
  return jsonDigest(tuples);
}

export function sourceManifestDigest(parsedTables, opaqueFiles) {
  const entries = [
    ...parsedTables.map((parsed) => [
      parsed.path,
      "tableCsv",
      parsed.headers,
      lexicalTupleDigest(parsed),
    ]),
    ...opaqueFiles.map((file) => [file.path, "opaqueFile", file.rawSha256, file.byteLength]),
  ];
  entries.sort((left, right) => compareText(JSON.stringify(left), JSON.stringify(right)));
  return jsonDigest(entries);
}

function discoverSourceFiles(sourceRoot) {
  const rootStat = lstatSync(sourceRoot);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) {
    throw new Error("data/source must be a real directory");
  }
  const files = [];
  const visit = (directory) => {
    const entries = readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
      compareText(left.name, right.name),
    );
    for (const entry of entries) {
      const absolutePath = join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`source symlink is prohibited: ${absolutePath}`);
      if (entry.isDirectory()) {
        visit(absolutePath);
        continue;
      }
      if (!entry.isFile()) throw new Error(`source special file is prohibited: ${absolutePath}`);
      const path = relative(sourceRoot, absolutePath).replaceAll("\\", "/");
      const rawBytes = readFileSync(absolutePath);
      files.push({
        path,
        absolutePath,
        rawBytes,
        rawSha256: sha256(rawBytes),
        byteLength: rawBytes.length,
      });
    }
  };
  visit(sourceRoot);
  files.sort((left, right) => compareText(left.path, right.path));
  if (JSON.stringify(files.map((file) => file.path)) !== JSON.stringify(EXPECTED_PATHS)) {
    throw new Error("data/source path set does not match the 21-file S1 baseline");
  }
  return files;
}

function rawTreeDigest(files) {
  return jsonDigest(files.map((file) => [file.path, file.rawSha256, file.byteLength]));
}

function quoteIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`;
}

function git(repoRoot, args) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    maxBuffer: 32 * 1024 * 1024,
    windowsHide: true,
  });
}

function baselineBlob(repoRoot, sourcePath) {
  return git(repoRoot, ["cat-file", "blob", `${BASELINE_COMMIT}:data/source/${sourcePath}`]);
}

function trackedTreeSnapshot(repoRoot) {
  const paths = git(repoRoot, ["ls-files", "-z"])
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .sort(compareText);
  return paths.map((path) => {
    const absolutePath = resolve(repoRoot, path);
    return [path, existsSync(absolutePath) ? sha256(readFileSync(absolutePath)) : null];
  });
}

function workingStatus(repoRoot) {
  return git(repoRoot, ["status", "--porcelain=v1", "-z", "--untracked-files=normal"]);
}

function importDatabase(db, schema, files, parsedTables, metadata) {
  db.exec("BEGIN IMMEDIATE");
  try {
    db.exec(schema);
    db.prepare(
      `INSERT INTO source_import (
        id, baseline_commit, raw_source_tree_digest, source_manifest_digest,
        node_version, sqlite_version, os, architecture
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      1,
      BASELINE_COMMIT,
      metadata.rawSourceTreeDigest,
      metadata.sourceManifestDigest,
      process.version,
      metadata.sqliteVersion,
      platform(),
      arch(),
    );

    const tablePaths = new Set(TABLES.map((table) => table.path));
    const insertFile = db.prepare(
      "INSERT INTO source_file (path, file_role, raw_bytes, raw_sha256, byte_length) VALUES (?, ?, ?, ?, ?)",
    );
    for (const file of files) {
      insertFile.run(
        file.path,
        tablePaths.has(file.path) ? "tableCsv" : "opaqueFile",
        file.rawBytes,
        file.rawSha256,
        file.byteLength,
      );
    }

    const insertTable = db.prepare("INSERT INTO source_table (path, table_name) VALUES (?, ?)");
    for (const config of TABLES) insertTable.run(config.path, config.table);

    for (const parsed of parsedTables) {
      const config = TABLES.find((table) => table.path === parsed.path);
      assert(config !== undefined);
      const columns = ["sourceOrdinal", "sourceLine", ...config.headers];
      const statement = db.prepare(
        `INSERT INTO ${quoteIdentifier(config.table)} (${columns
          .map(quoteIdentifier)
          .join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
      );
      for (const row of parsed.rows)
        statement.run(row.sourceOrdinal, row.sourceLine, ...row.values);
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function readCount(db, table) {
  return db.prepare(`SELECT count(*) AS count FROM ${quoteIdentifier(table)}`).get().count;
}

function assertDatabase(db, expectedRawTreeDigest, expectedManifestDigest) {
  assert.equal(db.prepare("PRAGMA integrity_check").get().integrity_check, "ok");
  assert.equal(db.prepare("PRAGMA foreign_key_check").all().length, 0);
  assert.equal(readCount(db, "source_import"), 1);
  assert.equal(readCount(db, "source_file"), EXPECTED_PATHS.length);
  assert.equal(readCount(db, "source_table"), TABLES.length);
  const imported = db
    .prepare(
      "SELECT raw_source_tree_digest, source_manifest_digest FROM source_import WHERE id = 1",
    )
    .get();
  assert.equal(imported.raw_source_tree_digest, expectedRawTreeDigest);
  assert.equal(imported.source_manifest_digest, expectedManifestDigest);
  assert.deepEqual(
    db
      .prepare("SELECT path, table_name FROM source_table")
      .all()
      .map((row) => [row.path, row.table_name])
      .sort((left, right) => compareText(left[0], right[0])),
    TABLES.map((table) => [table.path, table.table]).sort((left, right) =>
      compareText(left[0], right[0]),
    ),
  );
  for (const config of TABLES) {
    assert.equal(readCount(db, config.table), config.expectedRows);
    const columns = db
      .prepare(`PRAGMA table_info(${quoteIdentifier(config.table)})`)
      .all()
      .map((row) => row.name);
    assert.deepEqual(columns, ["sourceOrdinal", "sourceLine", ...config.headers]);
  }
  const snapshot = databaseSnapshot(db);
  assert.equal(snapshot.rawSourceTreeDigest, expectedRawTreeDigest);
  assert.equal(snapshot.sourceManifestDigest, expectedManifestDigest);
  return snapshot;
}

function tableRows(db, config) {
  return db
    .prepare(
      `SELECT ${["sourceOrdinal", "sourceLine", ...config.headers]
        .map(quoteIdentifier)
        .join(", ")} FROM ${quoteIdentifier(config.table)} ORDER BY ${quoteIdentifier(
        "sourceOrdinal",
      )}`,
    )
    .all()
    .map((row) => ({
      sourceOrdinal: row.sourceOrdinal,
      sourceLine: row.sourceLine,
      values: config.headers.map((header) => row[header]),
    }));
}

function exportTable(db, config) {
  return serializeCsv({ path: config.path, headers: config.headers, rows: tableRows(db, config) });
}

function exportOpaque(db, path) {
  const row = db.prepare("SELECT raw_bytes FROM source_file WHERE path = ?").get(path);
  assert(row !== undefined);
  return Buffer.from(row.raw_bytes);
}

function tableDigestFromDatabase(db, config) {
  return lexicalTupleDigest({
    path: config.path,
    headers: config.headers,
    rows: tableRows(db, config),
  });
}

function hashExports(paths, exporter) {
  return paths.map((path) => [path, sha256(exporter(path))]);
}

function sourceFilesFromDatabase(db) {
  const tablePaths = new Set(TABLES.map((table) => table.path));
  const files = db
    .prepare("SELECT path, file_role, raw_bytes, raw_sha256, byte_length FROM source_file")
    .all()
    .map((row) => {
      const rawBytes = Buffer.from(row.raw_bytes);
      assert.equal(row.file_role, tablePaths.has(row.path) ? "tableCsv" : "opaqueFile");
      assert.equal(row.raw_sha256, sha256(rawBytes), `${row.path}: stored SHA-256 drift`);
      assert.equal(row.byte_length, rawBytes.length, `${row.path}: stored byte length drift`);
      return {
        path: row.path,
        rawBytes,
        rawSha256: row.raw_sha256,
        byteLength: row.byte_length,
      };
    })
    .sort((left, right) => compareText(left.path, right.path));
  assert.deepEqual(
    files.map((file) => file.path),
    EXPECTED_PATHS,
  );
  return files;
}

function databaseSnapshot(db) {
  const files = sourceFilesFromDatabase(db);
  const fileByPath = new Map(files.map((file) => [file.path, file]));
  const parsedTables = TABLES.map((config) => ({
    path: config.path,
    headers: config.headers,
    rows: tableRows(db, config),
  }));
  const opaqueFiles = OPAQUE_PATHS.map((path) => fileByPath.get(path));
  assert(opaqueFiles.every((file) => file !== undefined));
  return {
    rawSourceTreeDigest: rawTreeDigest(files),
    sourceManifestDigest: sourceManifestDigest(parsedTables, opaqueFiles),
    csvExports: hashExports(
      TABLES.map((table) => table.path),
      (path) =>
        exportTable(
          db,
          TABLES.find((table) => table.path === path),
        ),
    ),
    tableDigests: TABLES.map((config) => [config.path, tableDigestFromDatabase(db, config)]),
    opaqueExports: hashExports(OPAQUE_PATHS, (path) => exportOpaque(db, path)),
  };
}

function updateRawFile(db, path, bytes) {
  db.prepare(
    "UPDATE source_file SET raw_bytes = ?, raw_sha256 = ?, byte_length = ? WHERE path = ?",
  ).run(bytes, sha256(bytes), bytes.length, path);
}

function changedPaths(before, after) {
  return after.flatMap(([path, digest], index) => (digest === before[index][1] ? [] : [path]));
}

function withSavepoint(db, name, probe) {
  db.exec(`SAVEPOINT ${name}`);
  try {
    probe();
  } finally {
    db.exec(`ROLLBACK TO ${name}; RELEASE ${name}`);
  }
}

function runMutationProbes(db) {
  const before = databaseSnapshot(db);
  const changed = Buffer.from("changed", "utf8");
  withSavepoint(db, "csv_blob_probe", () => {
    updateRawFile(db, TABLES[0].path, changed);
    const after = databaseSnapshot(db);
    assert.notEqual(after.rawSourceTreeDigest, before.rawSourceTreeDigest);
    assert.equal(after.sourceManifestDigest, before.sourceManifestDigest);
    assert.deepEqual(after.csvExports, before.csvExports);
    assert.deepEqual(after.tableDigests, before.tableDigests);
    assert.deepEqual(after.opaqueExports, before.opaqueExports);
  });
  assert.deepEqual(databaseSnapshot(db), before);

  const config = TABLES.find((table) => table.path === "recommendation-config.csv");
  assert(config !== undefined);
  withSavepoint(db, "csv_table_probe", () => {
    db.prepare(
      `UPDATE ${quoteIdentifier(config.table)} SET ${quoteIdentifier(
        config.headers[0],
      )} = ${quoteIdentifier(config.headers[0])} || '0' WHERE ${quoteIdentifier(
        "sourceOrdinal",
      )} = 1`,
    ).run();
    const after = databaseSnapshot(db);
    assert.equal(after.rawSourceTreeDigest, before.rawSourceTreeDigest);
    assert.notEqual(after.sourceManifestDigest, before.sourceManifestDigest);
    assert.deepEqual(changedPaths(before.csvExports, after.csvExports), [config.path]);
    assert.deepEqual(changedPaths(before.tableDigests, after.tableDigests), [config.path]);
    assert.deepEqual(after.opaqueExports, before.opaqueExports);
  });
  assert.deepEqual(databaseSnapshot(db), before);

  const opaquePath = OPAQUE_PATHS[0];
  withSavepoint(db, "opaque_blob_probe", () => {
    updateRawFile(db, opaquePath, changed);
    const after = databaseSnapshot(db);
    assert.notEqual(after.rawSourceTreeDigest, before.rawSourceTreeDigest);
    assert.notEqual(after.sourceManifestDigest, before.sourceManifestDigest);
    assert.deepEqual(after.csvExports, before.csvExports);
    assert.deepEqual(after.tableDigests, before.tableDigests);
    assert.deepEqual(changedPaths(before.opaqueExports, after.opaqueExports), [opaquePath]);
  });
  assert.deepEqual(databaseSnapshot(db), before);
}

function assertCandidateSchemaIsolation(db) {
  assert.deepEqual(db.prepare("PRAGMA foreign_key_list(model_attempt)").all(), []);
  assert.deepEqual(
    db
      .prepare("PRAGMA foreign_key_list(claim_candidate)")
      .all()
      .map((row) => [row.table, row.from, row.to, row.on_delete]),
    [["model_attempt", "attempt_id", "attempt_id", "CASCADE"]],
  );
  const candidateTables = new Set(["model_attempt", "claim_candidate"]);
  const tables = db
    .prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")
    .all()
    .map((row) => row.name);
  for (const table of tables) {
    for (const foreignKey of db
      .prepare(`PRAGMA foreign_key_list(${quoteIdentifier(table)})`)
      .all()) {
      if (candidateTables.has(table) || candidateTables.has(foreignKey.table)) {
        assert(candidateTables.has(table) && candidateTables.has(foreignKey.table));
      }
    }
  }
  assert.deepEqual(
    db
      .prepare(
        `SELECT type, name FROM sqlite_schema
        WHERE type IN ('trigger', 'view')
          AND (lower(sql) LIKE '%model_attempt%' OR lower(sql) LIKE '%claim_candidate%')`,
      )
      .all(),
    [],
  );
}

function assertResolutionSchemaIsolation(db) {
  assert.deepEqual(db.prepare("PRAGMA foreign_key_list(fact_resolution)").all(), []);
  assert.deepEqual(
    db
      .prepare("PRAGMA table_info(fact_resolution)")
      .all()
      .map((row) => row.name),
    [
      "fact_key",
      "state",
      "value_type",
      "lexical_value",
      "authority_kind",
      "authority_artifact_digest",
      "citation_set_digest",
      "reason_code",
    ],
  );
  assert.deepEqual(
    db
      .prepare(
        `SELECT type, name FROM sqlite_schema
        WHERE type IN ('trigger', 'view')
          AND lower(sql) LIKE '%fact_resolution%'`,
      )
      .all(),
    [],
  );
}

function runCandidateQuarantineProbes(db, sourceManifestDigest) {
  assertCandidateSchemaIsolation(db);
  const before = databaseSnapshot(db);
  assert.equal(readCount(db, "model_attempt"), 0);
  assert.equal(readCount(db, "claim_candidate"), 0);

  db.exec(`CREATE TEMP TRIGGER force_candidate_ingest_failure
    BEFORE INSERT ON claim_candidate
    WHEN NEW.candidate_value = 'force-rollback'
    BEGIN
      SELECT RAISE(ABORT, 'forced candidate rollback');
    END`);
  assert.throws(
    () =>
      ingestModelAttempt(db, {
        attemptId: "0".repeat(64),
        provider: "rollback-probe",
        model: "rollback-probe-v1",
        sourceManifestDigest,
        requestSha256: "8".repeat(64),
        responseSha256: "9".repeat(64),
        claims: [
          {
            factKey: "work:dungeon-meshi:factor:progression",
            candidateValue: "4",
            citations: ["https://example.com/factor"],
          },
          {
            factKey: "work:dungeon-meshi:theme:cooking",
            candidateValue: "force-rollback",
            citations: ["https://example.com/theme"],
          },
        ],
      }),
    /forced candidate rollback/u,
  );
  db.exec("DROP TRIGGER force_candidate_ingest_failure");
  assert.equal(readCount(db, "model_attempt"), 0);
  assert.equal(readCount(db, "claim_candidate"), 0);
  assert.deepEqual(databaseSnapshot(db), before);

  ingestModelAttempt(db, {
    attemptId: "1".repeat(64),
    provider: "provider-a",
    model: "model-a-v1",
    sourceManifestDigest,
    requestSha256: "a".repeat(64),
    responseSha256: "b".repeat(64),
    claims: [
      {
        factKey: "work:dungeon-meshi:theme:cooking",
        candidateValue: "2",
        confidence: "high",
        citations: ["https://example.com/b", "https://example.com/a"],
      },
      {
        factKey: "work:dungeon-meshi:factor:progression",
        candidateValue: "4",
        confidence: "0.9",
        citations: ["https://example.com/factor"],
      },
      {
        factKey: "work:dungeon-meshi:factor:progression",
        candidateValue: "0",
        confidence: "0.1",
        citations: ["https://example.com/factor"],
      },
      {
        factKey: "work:dungeon-meshi:genre:fantasy",
        candidateValue: "present",
        citations: ["https://example.com/genre"],
      },
    ],
  });
  assert.equal(readCount(db, "model_attempt"), 1);
  assert.equal(readCount(db, "claim_candidate"), 4);
  assert.deepEqual(databaseSnapshot(db), before);

  db.prepare("DELETE FROM model_attempt WHERE attempt_id = ?").run("1".repeat(64));
  assert.equal(readCount(db, "model_attempt"), 0);
  assert.equal(readCount(db, "claim_candidate"), 0);
  assert.deepEqual(databaseSnapshot(db), before);

  const readback = ingestModelAttempt(db, {
    attemptId: "2".repeat(64),
    provider: "provider-b",
    model: "model-b-v2",
    sourceManifestDigest,
    requestSha256: "c".repeat(64),
    responseSha256: "d".repeat(64),
    claims: [
      {
        factKey: "work:dungeon-meshi:factor:progression",
        candidateValue: "0",
        confidence: "low",
        citations: ["https://example.com/factor"],
      },
      {
        factKey: "work:dungeon-meshi:theme:cooking",
        candidateValue: "1",
        citations: ["https://example.com/b", "https://example.com/a", "https://example.com/b"],
      },
      {
        factKey: "work:dungeon-meshi:factor:progression",
        candidateValue: "4",
        confidence: "high",
        citations: ["https://example.com/factor"],
      },
      {
        factKey: "work:dungeon-meshi:theme:cooking",
        candidateValue: "1",
        citations: ["https://example.com/a", "https://example.com/b"],
      },
    ],
  });
  assert.equal(readCount(db, "model_attempt"), 1);
  assert.equal(readCount(db, "claim_candidate"), 3);
  assert.equal(
    readback.claims.filter((claim) => claim.factKey === "work:dungeon-meshi:factor:progression")
      .length,
    2,
  );
  assert.deepEqual(databaseSnapshot(db), before);
  return readback;
}

function bootstrapFromLiveSource(db) {
  return bootstrapLegacySnapshot(db, () => databaseSnapshot(db).sourceManifestDigest);
}

function runLegacyResolutionProbes(db, schema, files, parsedTables, metadata) {
  assertResolutionSchemaIsolation(db);
  assert.equal(readCount(db, "fact_resolution"), 0);

  let candidateFree;
  const cleanDatabase = new DatabaseSync(":memory:");
  try {
    cleanDatabase.exec("PRAGMA foreign_keys = ON");
    importDatabase(cleanDatabase, schema, files, parsedTables, metadata);
    assertDatabase(cleanDatabase, metadata.rawSourceTreeDigest, metadata.sourceManifestDigest);
    assert.equal(readCount(cleanDatabase, "model_attempt"), 0);
    assert.equal(readCount(cleanDatabase, "claim_candidate"), 0);
    candidateFree = bootstrapFromLiveSource(cleanDatabase);
  } finally {
    cleanDatabase.close();
  }

  const sourceBefore = databaseSnapshot(db);
  withSavepoint(db, "legacy_resolution_source_tamper", () => {
    const factor = db
      .prepare(
        `SELECT "sourceOrdinal" AS sourceOrdinal, "value" AS value
        FROM source_factors WHERE "state" = 'known' AND "value" IN ('2', '4')
        ORDER BY "sourceOrdinal" LIMIT 1`,
      )
      .get();
    assert(factor !== undefined);
    db.prepare(`UPDATE source_factors SET "value" = ? WHERE "sourceOrdinal" = ?`).run(
      factor.value === "2" ? "4" : "2",
      factor.sourceOrdinal,
    );
    assert.notEqual(databaseSnapshot(db).sourceManifestDigest, sourceBefore.sourceManifestDigest);
    assert.throws(() => bootstrapFromLiveSource(db), /fixed cutoff manifest/u);
    assert.equal(readCount(db, "fact_resolution"), 0);
  });
  assert.deepEqual(databaseSnapshot(db), sourceBefore);

  withSavepoint(db, "legacy_resolution_metadata_tamper", () => {
    db.prepare("UPDATE source_import SET source_manifest_digest = ? WHERE id = 1").run(
      "0".repeat(64),
    );
    assert.throws(() => bootstrapFromLiveSource(db), /fixed cutoff manifest/u);
    assert.equal(readCount(db, "fact_resolution"), 0);
  });

  const withCandidates = bootstrapFromLiveSource(db);
  assert.equal(withCandidates.tuples.length, LEGACY_RESOLUTION_COUNTS.total);
  assert.deepEqual(withCandidates.states, {
    accepted: LEGACY_RESOLUTION_COUNTS.accepted,
    explicitUnknown: LEGACY_RESOLUTION_COUNTS.explicitUnknown,
    notApplicable: LEGACY_RESOLUTION_COUNTS.notApplicable,
    rejected: LEGACY_RESOLUTION_COUNTS.rejected,
    manualReview: LEGACY_RESOLUTION_COUNTS.manualReview,
  });
  assert.equal(withCandidates.acceptedFactsDigest, withCandidates.resolutionSetDigest);
  assert.equal(JSON.stringify(withCandidates.tuples), JSON.stringify(candidateFree.tuples));
  assert.equal(withCandidates.acceptedFactsDigest, candidateFree.acceptedFactsDigest);
  assert.equal(withCandidates.resolutionSetDigest, candidateFree.resolutionSetDigest);
  assert.throws(() => bootstrapFromLiveSource(db), /requires an empty table/u);
  assert.deepEqual(databaseSnapshot(db), sourceBefore);
  return withCandidates;
}

function assertTableExportParity(db, repoRoot, parsedTables) {
  for (const [index, config] of TABLES.entries()) {
    const baseline = baselineBlob(repoRoot, config.path);
    const persisted = {
      path: config.path,
      headers: config.headers,
      rows: tableRows(db, config),
    };
    assert(exportTable(db, config).equals(baseline), `${config.path}: SQLite export byte drift`);
    assert.equal(lexicalTupleDigest(persisted), lexicalTupleDigest(parsedTables[index]));
    assert.equal(
      lexicalTupleDigest(persisted),
      lexicalTupleDigest(parseLexicalCsv(config.path, baseline, config.headers)),
    );
  }
}

function writeExportedSource(db, exportSourceRoot) {
  for (const config of TABLES) {
    const output = join(exportSourceRoot, ...config.path.split("/"));
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, exportTable(db, config));
  }
  for (const path of OPAQUE_PATHS) {
    const output = join(exportSourceRoot, ...path.split("/"));
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, exportOpaque(db, path));
  }
}

function buildQuietly(root) {
  const originalLog = console.log;
  console.log = () => undefined;
  try {
    return buildCatalog(root);
  } finally {
    console.log = originalLog;
  }
}

function compareBuildArtifacts(repoRoot, originalRoot, exportedRoot, originalBuild, exportedBuild) {
  const originalPaths = originalBuild.artifactPaths
    .map((path) => relative(originalRoot, path).replaceAll("\\", "/"))
    .sort(compareText);
  const exportedPaths = exportedBuild.artifactPaths
    .map((path) => relative(exportedRoot, path).replaceAll("\\", "/"))
    .sort(compareText);
  assert.deepEqual(exportedPaths, originalPaths);
  for (const path of originalPaths) {
    const original = readFileSync(resolve(originalRoot, path));
    assert(
      original.equals(readFileSync(resolve(exportedRoot, path))),
      `${path}: shadow build drift`,
    );
    assert(
      original.equals(readFileSync(resolve(repoRoot, path))),
      `${path}: tracked artifact drift`,
    );
  }
}

function exportedReviewReferences(sourceRoot, works) {
  return new Set(
    works.flatMap((row) => {
      const reference = row.value.annotationReviewReference;
      return reference !== undefined && existsSync(resolve(sourceRoot, reference))
        ? [reference]
        : [];
    }),
  );
}

function assertPromotionParity(repoRoot, exportSourceRoot) {
  const input = loadPromotionRegistryInput(repoRoot);
  const originalRows = buildPromotionRegistry(input);
  validatePromotionRegistry(
    originalRows,
    input.source.works.map((row) => row.value.id),
  );
  const original = serializePromotionRegistry(originalRows);

  const exported = loadCatalogSource(exportSourceRoot);
  assert.equal(exported.issues.filter((issue) => issue.severity === "error").length, 0);
  const shadowInput = {
    ...input,
    source: exported.source,
    artEvidence: exported.artEvidence,
    existingReviewReferences: exportedReviewReferences(exportSourceRoot, exported.source.works),
  };
  const shadowRows = buildPromotionRegistry(shadowInput);
  validatePromotionRegistry(
    shadowRows,
    shadowInput.source.works.map((row) => row.value.id),
  );
  assert.equal(serializePromotionRegistry(shadowRows), original);
  assert.equal(
    readFileSync(
      resolve(repoRoot, "data/staging/catalog-expansion/promotion-registry.csv"),
      "utf8",
    ),
    original,
  );
  assert.equal(shadowRows.filter((row) => row.promotionOutcome === "gold").length, 150);
  assert.equal(
    shadowRows.filter((row) => row.promotionOutcome === "recommendationVerified").length,
    1291,
  );
  assert.equal(shadowRows.filter((row) => row.promotionOutcome === "promotionBlocked").length, 173);
  assert.equal(shadowRows.filter((row) => row.promotionOutcome === "pending").length, 0);
}

function assertLegacyBoundary(repoRoot, loaded) {
  const reviewMethods = Map.groupBy(loaded.source.works, (row) => row.value.annotationReviewMethod);
  assert.equal(reviewMethods.get("authorizedModelPanel")?.length, 1481);
  assert.equal(reviewMethods.get("unreviewed")?.length, 133);
  const sourceTypes = Map.groupBy(loaded.source.evidence, (row) => row.value.sourceType);
  assert.equal(sourceTypes.get("model")?.length, 1490);
  assert.equal(sourceTypes.get("publisher")?.length, 648);
  assert.equal(sourceTypes.get("rakuten")?.length, 250);
  assert.equal(sourceTypes.get("manual")?.length, 70);
  assert(loaded.source.evidence.every((row) => row.value.reviewedByHuman === false));

  const approval = JSON.parse(
    readFileSync(resolve(repoRoot, "data/staging/g2/g2-product-direction-approval.json"), "utf8"),
  );
  assert.equal(approval.humanValidation, "not-run");
  assert.equal(approval.humanMetrics, null);
  assert.equal(approval.syntheticPilot.humanResults, 0);
  assert.equal(approval.syntheticPilot.syntheticPilotResults, 1);
  assert.equal(approval.syntheticPilot.verdict, "INCOMPLETE");
}

function assertNoJournals(databasePath) {
  for (const suffix of ["-journal", "-wal", "-shm"]) {
    assert(!existsSync(`${databasePath}${suffix}`), `SQLite residue exists: ${suffix}`);
  }
}

export function runCatalogShadow(repoRoot = process.cwd()) {
  assertNode24();
  const canonicalRoot = resolve(repoRoot);
  const sourceRoot = resolve(canonicalRoot, "data/source");
  git(canonicalRoot, ["cat-file", "-e", `${BASELINE_COMMIT}^{commit}`]);

  const trackedBefore = trackedTreeSnapshot(canonicalRoot);
  const statusBefore = workingStatus(canonicalRoot);
  const filesBefore = discoverSourceFiles(sourceRoot);
  const rawSourceTreeDigest = rawTreeDigest(filesBefore);
  const fileByPath = new Map(filesBefore.map((file) => [file.path, file]));
  const parsedTables = TABLES.map((config) => {
    const file = fileByPath.get(config.path);
    assert(file !== undefined);
    const parsed = parseLexicalCsv(config.path, file.rawBytes, config.headers);
    assert.equal(parsed.rows.length, config.expectedRows, `${config.path}: row count drift`);
    return parsed;
  });
  const opaqueFiles = OPAQUE_PATHS.map((path) => {
    const file = fileByPath.get(path);
    assert(file !== undefined);
    return file;
  });
  const manifestDigest = sourceManifestDigest(parsedTables, opaqueFiles);

  const canonicalByteDifferences = [];
  for (const [index, config] of TABLES.entries()) {
    const baseline = baselineBlob(canonicalRoot, config.path);
    const baselineParsed = parseLexicalCsv(config.path, baseline, config.headers);
    assert.equal(lexicalTupleDigest(parsedTables[index]), lexicalTupleDigest(baselineParsed));
    const exported = serializeCsv(parsedTables[index]);
    assert(exported.equals(baseline), `${config.path}: canonical Git-blob byte drift`);
    if (!fileByPath.get(config.path).rawBytes.equals(baseline)) {
      canonicalByteDifferences.push(config.path);
    }
  }

  const temporaryRoot = mkdtempSync(join(tmpdir(), "konocomics-catalog-shadow-"));
  const databasePath = join(temporaryRoot, "catalog-shadow.sqlite");
  const originalBuildRoot = join(temporaryRoot, "original-build");
  const exportedBuildRoot = join(temporaryRoot, "exported-build");
  let database;
  let reader;
  let candidateReadback;
  let resolutionSnapshot;
  try {
    const schema = readFileSync(SCHEMA_PATH, "utf8");
    database = new DatabaseSync(databasePath);
    database.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = DELETE");
    assert.equal(database.prepare("PRAGMA journal_mode").get().journal_mode, "delete");
    const sqliteVersion = database.prepare("SELECT sqlite_version() AS version").get().version;
    importDatabase(database, schema, filesBefore, parsedTables, {
      rawSourceTreeDigest,
      sourceManifestDigest: manifestDigest,
      sqliteVersion,
    });
    assertDatabase(database, rawSourceTreeDigest, manifestDigest);
    runMutationProbes(database);
    candidateReadback = runCandidateQuarantineProbes(database, manifestDigest);
    resolutionSnapshot = runLegacyResolutionProbes(database, schema, filesBefore, parsedTables, {
      rawSourceTreeDigest,
      sourceManifestDigest: manifestDigest,
      sqliteVersion,
    });
    assertDatabase(database, rawSourceTreeDigest, manifestDigest);
    assertNoJournals(databasePath);
    database.close();
    database = undefined;

    reader = new DatabaseSync(databasePath, { readOnly: true });
    assertDatabase(reader, rawSourceTreeDigest, manifestDigest);
    assertCandidateSchemaIsolation(reader);
    assertResolutionSchemaIsolation(reader);
    assert.deepEqual(readModelAttempt(reader, "2".repeat(64)), candidateReadback);
    assert.deepEqual(readResolutionSnapshot(reader), resolutionSnapshot);
    assertTableExportParity(reader, canonicalRoot, parsedTables);
    writeExportedSource(reader, resolve(exportedBuildRoot, "data/source"));
    for (const file of opaqueFiles) {
      assert(exportOpaque(reader, file.path).equals(file.rawBytes), `${file.path}: opaque drift`);
    }
    reader.close();
    reader = undefined;
    assertNoJournals(databasePath);

    mkdirSync(resolve(originalBuildRoot, "data"), { recursive: true });
    cpSync(sourceRoot, resolve(originalBuildRoot, "data/source"), { recursive: true });
    const originalBuild = buildQuietly(originalBuildRoot);
    const exportedBuild = buildQuietly(exportedBuildRoot);
    assert.equal(originalBuild.catalog.catalogVersion, "v1-5b115a2230d2");
    assert.equal(originalBuild.catalog.works.length, 1614);
    assert.equal(originalBuild.catalog.volumes.length, 1618);
    compareBuildArtifacts(
      canonicalRoot,
      originalBuildRoot,
      exportedBuildRoot,
      originalBuild,
      exportedBuild,
    );

    const exportedLoaded = loadCatalogSource(resolve(exportedBuildRoot, "data/source"));
    assert.equal(exportedLoaded.issues.filter((issue) => issue.severity === "error").length, 0);
    assertLegacyBoundary(canonicalRoot, exportedLoaded);
    assertPromotionParity(canonicalRoot, resolve(exportedBuildRoot, "data/source"));

    assert.deepEqual(
      discoverSourceFiles(sourceRoot).map((file) => file.rawSha256),
      filesBefore.map((file) => file.rawSha256),
    );
    assert.deepEqual(trackedTreeSnapshot(canonicalRoot), trackedBefore);
    assert(workingStatus(canonicalRoot).equals(statusBefore));
    return {
      status: "PASS",
      baselineCommit: BASELINE_COMMIT,
      sourceFiles: EXPECTED_PATHS.length,
      tableCsvFiles: TABLES.length,
      opaqueFiles: OPAQUE_PATHS.length,
      rawSourceTreeDigest,
      sourceManifestDigest: manifestDigest,
      canonicalByteDifferences,
      catalogVersion: originalBuild.catalog.catalogVersion,
      works: originalBuild.catalog.works.length,
      volumes: originalBuild.catalog.volumes.length,
      promotion: { gold: 150, recommendationVerified: 1291, promotionBlocked: 173, pending: 0 },
      candidateQuarantine: { attempts: 1, claims: 3 },
      legacyResolution: {
        rows: resolutionSnapshot.tuples.length,
        states: resolutionSnapshot.states,
        acceptedFactsDigest: resolutionSnapshot.acceptedFactsDigest,
        resolutionSetDigest: resolutionSnapshot.resolutionSetDigest,
      },
      audit: { node: process.version, sqlite: sqliteVersion, os: platform(), architecture: arch() },
    };
  } finally {
    try {
      reader?.close();
    } finally {
      try {
        database?.close();
      } finally {
        rmSync(temporaryRoot, { recursive: true, force: true });
        assert(!existsSync(temporaryRoot), "catalog shadow temp directory was not removed");
        assert.deepEqual(
          discoverSourceFiles(sourceRoot).map((file) => file.rawSha256),
          filesBefore.map((file) => file.rawSha256),
        );
        assert.deepEqual(trackedTreeSnapshot(canonicalRoot), trackedBefore);
        assert(workingStatus(canonicalRoot).equals(statusBefore));
      }
    }
  }
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    console.log(JSON.stringify(runCatalogShadow(), null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
