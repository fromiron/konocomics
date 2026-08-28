import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

import { parse } from "csv-parse/sync";

export const CATALOG_DATABASE_FILE = "catalog.sqlite";
export const CATALOG_CUTOVER_SOURCE_COMMIT = "2b3cd10523b15ad131871e2f3bb202494119133d";
export const CATALOG_AUTHORITY_SCHEMA_PATH = fileURLToPath(
  new URL("../sql/catalog-authority/001-init.sql", import.meta.url),
);

export const CATALOG_TABLES = [
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
] as const;

export const CATALOG_OPAQUE_PATHS = [
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
] as const;

export interface LexicalRow {
  sourceOrdinal: number;
  sourceLine: number;
  values: string[];
}

export interface LexicalTable {
  path: string;
  headers: readonly string[];
  rows: LexicalRow[];
}

export interface AuthorityRecord {
  row: number;
  record: Record<string, string>;
}

interface OpaqueIdentity {
  path: string;
  rawSha256: string;
  byteLength: number;
}

export function compareText(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function sha256(value: Uint8Array | string) {
  return createHash("sha256").update(value).digest("hex");
}

function jsonDigest(value: unknown) {
  return sha256(Buffer.from(JSON.stringify(value), "utf8"));
}

export function assertNode24(version = process.version) {
  const major = Number.parseInt(version.replace(/^v/u, "").split(".", 1)[0] ?? "", 10);
  if (major !== 24) throw new Error(`Catalog authority requires Node 24 LTS; received ${version}`);
}

function normalizeCell(value: string) {
  return value.replace(/\r\n?/gu, "\n");
}

export function parseLexicalCsv(
  path: string,
  bytes: Uint8Array,
  expectedHeaders: readonly string[],
): LexicalTable {
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (error) {
    throw new Error(`${path}: invalid UTF-8`, { cause: error });
  }

  let records: Array<{ record: string[]; info: { lines: number } }>;
  try {
    records = parse(text, {
      bom: false,
      columns: false,
      info: true,
      relax_column_count: false,
      skip_empty_lines: true,
      trim: false,
    }) as unknown as Array<{ record: string[]; info: { lines: number } }>;
  } catch (error) {
    throw new Error(`${path}: malformed CSV: ${error instanceof Error ? error.message : error}`, {
      cause: error,
    });
  }
  if (records.length === 0) throw new Error(`${path}: missing header`);

  const headers = records[0]!.record.map(normalizeCell);
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

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export function serializeCsv(parsed: LexicalTable) {
  const lines = [
    parsed.headers.map(csvCell).join(","),
    ...parsed.rows.map((row) => row.values.map(csvCell).join(",")),
  ];
  return Buffer.from(`${lines.join("\n")}\n`, "utf8");
}

export function lexicalTupleDigest(parsed: LexicalTable) {
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

export function sourceManifestDigest(
  parsedTables: readonly LexicalTable[],
  opaqueFiles: readonly OpaqueIdentity[],
) {
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

function quoteIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function sqliteNumber(value: unknown, label: string) {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    throw new Error(`${label}: expected a safe integer`);
  }
  return value;
}

function sqliteText(value: unknown, label: string) {
  if (typeof value !== "string") throw new Error(`${label}: expected TEXT`);
  return value;
}

function tableRows(db: DatabaseSync, config: (typeof CATALOG_TABLES)[number]): LexicalRow[] {
  const columns = ["sourceOrdinal", "sourceLine", ...config.headers];
  return db
    .prepare(
      `SELECT ${columns.map(quoteIdentifier).join(", ")} FROM ${quoteIdentifier(
        config.table,
      )} ORDER BY "sourceOrdinal"`,
    )
    .all()
    .map((row) => ({
      sourceOrdinal: sqliteNumber(row.sourceOrdinal, `${config.path}: sourceOrdinal`),
      sourceLine: sqliteNumber(row.sourceLine, `${config.path}: sourceLine`),
      values: config.headers.map((header) => sqliteText(row[header], `${config.path}: ${header}`)),
    }));
}

function schemaDefinitions(db: DatabaseSync) {
  return db
    .prepare(
      "SELECT name, sql FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
    )
    .all()
    .map((row) => [
      sqliteText(row.name, "sqlite_schema.name"),
      sqliteText(row.sql, "sqlite_schema.sql"),
    ])
    .sort((left, right) => compareText(left[0]!, right[0]!));
}

function expectedSchemaDefinitions() {
  const expected = new DatabaseSync(":memory:");
  try {
    expected.exec(readFileSync(CATALOG_AUTHORITY_SCHEMA_PATH, "utf8"));
    return schemaDefinitions(expected);
  } finally {
    expected.close();
  }
}

function databaseTables(db: DatabaseSync, enforceCutoverCounts: boolean): LexicalTable[] {
  const integrity = db.prepare("PRAGMA integrity_check").get();
  assert.equal(integrity?.integrity_check, "ok", "SQLite integrity_check failed");
  assert.equal(db.prepare("PRAGMA foreign_key_check").all().length, 0, "SQLite FK check failed");
  assert.equal(
    db.prepare("PRAGMA user_version").get()?.user_version,
    1,
    "Unexpected schema version",
  );

  const tableNames = db
    .prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")
    .all()
    .map((row) => sqliteText(row.name, "sqlite_schema.name"))
    .sort(compareText);
  assert.deepEqual(
    tableNames,
    CATALOG_TABLES.map((config) => config.table).sort(compareText),
    "Catalog authority must contain exactly nine source tables",
  );
  const tableNameSet = new Set<string>(tableNames);
  const tableList = db
    .prepare("PRAGMA table_list")
    .all()
    .filter((row) => tableNameSet.has(sqliteText(row.name, "table_list.name")))
    .map((row) => [
      sqliteText(row.name, "table_list.name"),
      sqliteText(row.type, "table_list.type"),
      sqliteNumber(row.strict, "table_list.strict"),
      sqliteNumber(row.wr, "table_list.wr"),
    ])
    .sort((left, right) => compareText(String(left[0]), String(right[0])));
  assert.deepEqual(
    tableList,
    CATALOG_TABLES.map((config) => [config.table, "table", 1, 0]).sort((left, right) =>
      compareText(String(left[0]), String(right[0])),
    ),
    "Catalog authority tables must remain STRICT rowid tables",
  );
  assert.deepEqual(
    schemaDefinitions(db),
    expectedSchemaDefinitions(),
    "Catalog authority DDL drift",
  );
  assert.equal(
    db
      .prepare("SELECT count(*) AS count FROM sqlite_schema WHERE type IN ('view', 'trigger')")
      .get()?.count,
    0,
    "Catalog authority must not contain views or triggers",
  );

  return CATALOG_TABLES.map((config) => {
    const columns = db
      .prepare(`PRAGMA table_info(${quoteIdentifier(config.table)})`)
      .all()
      .map((row) => [row.name, row.type, row.notnull, row.pk]);
    assert.deepEqual(
      columns,
      [
        ["sourceOrdinal", "INTEGER", 0, 1],
        ["sourceLine", "INTEGER", 1, 0],
        ...config.headers.map((header) => [header, "TEXT", 1, 0]),
      ],
      `${config.path}: schema drift`,
    );
    const rows = tableRows(db, config);
    if (enforceCutoverCounts) {
      assert.equal(rows.length, config.expectedRows, `${config.path}: row count drift`);
    }
    rows.forEach((row, index) => {
      assert.equal(row.sourceOrdinal, index + 1, `${config.path}: non-contiguous sourceOrdinal`);
    });
    const parsed = { path: config.path, headers: config.headers, rows };
    const projected = parseLexicalCsv(config.path, serializeCsv(parsed), config.headers);
    assert.deepEqual(
      rows.map((row) => row.sourceLine),
      projected.rows.map((row) => row.sourceLine),
      `${config.path}: sourceLine is not the canonical CSV projection line`,
    );
    return parsed;
  });
}

function withReadOnlyDatabase<T>(path: string, callback: (db: DatabaseSync) => T) {
  const db = new DatabaseSync(path, { readOnly: true });
  try {
    db.exec("PRAGMA foreign_keys = ON");
    return callback(db);
  } finally {
    db.close();
  }
}

export function readCatalogAuthority(sourceDirectory: string, enforceCutoverCounts = false) {
  const databasePath = join(sourceDirectory, CATALOG_DATABASE_FILE);
  return withReadOnlyDatabase(databasePath, (db) => databaseTables(db, enforceCutoverCounts));
}

export function readCatalogAuthorityRecords(sourceDirectory: string) {
  return new Map(
    readCatalogAuthority(sourceDirectory).map((table) => [
      table.path,
      table.rows.map((row) => ({
        row: row.sourceLine,
        record: Object.fromEntries(
          table.headers.map((header, index) => [header, row.values[index] ?? ""]),
        ),
      })),
    ]),
  ) as ReadonlyMap<string, AuthorityRecord[]>;
}

function opaqueIdentities(sourceDirectory: string): OpaqueIdentity[] {
  return CATALOG_OPAQUE_PATHS.map((path) => {
    const bytes = readFileSync(join(sourceDirectory, path));
    return { path, rawSha256: sha256(bytes), byteLength: bytes.length };
  });
}

export function catalogSourceManifestDigest(sourceDirectory: string) {
  return sourceManifestDigest(
    readCatalogAuthority(sourceDirectory),
    opaqueIdentities(sourceDirectory),
  );
}

export function catalogSourceSnapshotDigest(sourceDirectory: string) {
  const files = discoverFiles(sourceDirectory);
  const hasDatabase = files.includes(CATALOG_DATABASE_FILE);
  const csvPaths = CATALOG_TABLES.map((config) => config.path);
  const hasCsv = csvPaths.some((path) => files.includes(path));
  if (hasDatabase === hasCsv) {
    throw new Error("Catalog source snapshot must contain exactly one authority representation");
  }
  const tables = hasDatabase
    ? readCatalogAuthority(sourceDirectory)
    : CATALOG_TABLES.map((config) =>
        parseLexicalCsv(
          config.path,
          readFileSync(join(sourceDirectory, config.path)),
          config.headers,
        ),
      );
  const known = new Set([
    ...(hasDatabase ? [CATALOG_DATABASE_FILE] : csvPaths),
    ...CATALOG_OPAQUE_PATHS,
  ]);
  const extras = files
    .filter((path) => !known.has(path))
    .map((path) => {
      const bytes = readFileSync(join(sourceDirectory, path));
      return [path, sha256(bytes), bytes.length] as const;
    });
  return jsonDigest({
    sourceManifestDigest: sourceManifestDigest(tables, opaqueIdentities(sourceDirectory)),
    extras,
  });
}

function discoverFiles(root: string) {
  const files: string[] = [];
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
      compareText(left.name, right.name),
    )) {
      const absolute = join(directory, entry.name);
      if (entry.isSymbolicLink())
        throw new Error(`Catalog source symlink is prohibited: ${absolute}`);
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile()) files.push(relative(root, absolute).replaceAll("\\", "/"));
      else throw new Error(`Catalog source special file is prohibited: ${absolute}`);
    }
  };
  if (!lstatSync(root).isDirectory()) throw new Error(`Catalog source is not a directory: ${root}`);
  visit(root);
  return files.sort(compareText);
}

export function assertNoCatalogSidecars(databasePath: string) {
  for (const suffix of ["-journal", "-wal", "-shm"]) {
    if (existsSync(`${databasePath}${suffix}`)) throw new Error(`SQLite residue exists: ${suffix}`);
  }
}

function assertCatalogAuthorityLayout(sourceDirectory: string) {
  assertNoCatalogSidecars(join(sourceDirectory, CATALOG_DATABASE_FILE));
  assert.deepEqual(
    discoverFiles(sourceDirectory),
    [CATALOG_DATABASE_FILE, ...CATALOG_OPAQUE_PATHS].sort(compareText),
    "data/source must contain one SQLite authority and the 12 opaque Markdown files",
  );
}

function gitBlob(repoRoot: string, commit: string, logicalPath: string) {
  return execFileSync("git", ["cat-file", "blob", `${commit}:data/source/${logicalPath}`], {
    cwd: repoRoot,
    maxBuffer: 32 * 1024 * 1024,
    windowsHide: true,
  });
}

function insertTableRows(db: DatabaseSync, tables: readonly LexicalTable[]) {
  for (const table of tables) {
    const config = CATALOG_TABLES.find((candidate) => candidate.path === table.path);
    assert(config !== undefined);
    const columns = ["sourceOrdinal", "sourceLine", ...config.headers];
    const insert = db.prepare(
      `INSERT INTO ${quoteIdentifier(config.table)} (${columns
        .map(quoteIdentifier)
        .join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
    );
    for (const row of table.rows) insert.run(row.sourceOrdinal, row.sourceLine, ...row.values);
  }
}

function insertTables(db: DatabaseSync, tables: readonly LexicalTable[]) {
  db.exec("BEGIN IMMEDIATE");
  try {
    insertTableRows(db, tables);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function bootstrapCatalogAuthority(repoRoot: string, fromGit: string, outputPath: string) {
  assertNode24();
  const canonicalRoot = resolve(repoRoot);
  const output = resolve(canonicalRoot, outputPath);
  if (existsSync(output))
    throw new Error(`Refusing to overwrite existing Catalog authority: ${output}`);
  execFileSync("git", ["cat-file", "-e", `${fromGit}^{commit}`], {
    cwd: canonicalRoot,
    windowsHide: true,
  });
  const sourceBytes: ReadonlyMap<string, Buffer> = new Map(
    CATALOG_TABLES.map((config) => [config.path, gitBlob(canonicalRoot, fromGit, config.path)]),
  );
  const tables = CATALOG_TABLES.map((config) => {
    const table = parseLexicalCsv(config.path, sourceBytes.get(config.path)!, config.headers);
    assert.equal(table.rows.length, config.expectedRows, `${config.path}: row count drift`);
    return table;
  });
  mkdirSync(dirname(output), { recursive: true });
  const temporaryDirectory = mkdtempSync(join(dirname(output), `.${basename(output)}-bootstrap-`));
  const candidate = join(temporaryDirectory, CATALOG_DATABASE_FILE);
  let db: DatabaseSync | undefined;
  try {
    db = new DatabaseSync(candidate);
    db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = DELETE");
    db.exec(readFileSync(CATALOG_AUTHORITY_SCHEMA_PATH, "utf8"));
    insertTables(db, tables);
    databaseTables(db, true);
    db.close();
    db = undefined;
    assertNoCatalogSidecars(candidate);
    withReadOnlyDatabase(candidate, (reader) => {
      for (const table of databaseTables(reader, true)) {
        assert(
          serializeCsv(table).equals(sourceBytes.get(table.path)!),
          `${table.path}: bootstrap byte parity failed`,
        );
      }
    });
    renameSync(candidate, output);
    assertNoCatalogSidecars(output);
  } finally {
    db?.close();
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
  return {
    output,
    tables: tables.length,
    rows: Object.fromEntries(tables.map((t) => [t.path, t.rows.length])),
  };
}

export function verifyCatalogAuthority(repoRoot = process.cwd()) {
  assertNode24();
  const canonicalRoot = resolve(repoRoot);
  const sourceDirectory = join(canonicalRoot, "data/source");
  const databasePath = join(sourceDirectory, CATALOG_DATABASE_FILE);
  assertCatalogAuthorityLayout(sourceDirectory);
  const tables = readCatalogAuthority(sourceDirectory);
  return {
    databasePath,
    sourceManifestDigest: sourceManifestDigest(tables, opaqueIdentities(sourceDirectory)),
    tables: tables.length,
    opaqueFiles: CATALOG_OPAQUE_PATHS.length,
    rows: Object.fromEntries(tables.map((table) => [table.path, table.rows.length])),
  };
}

export function verifyCatalogCutover(
  repoRoot = process.cwd(),
  againstGit = CATALOG_CUTOVER_SOURCE_COMMIT,
) {
  const canonicalRoot = resolve(repoRoot);
  const sourceDirectory = join(canonicalRoot, "data/source");
  const result = verifyCatalogAuthority(canonicalRoot);
  const tables = readCatalogAuthority(sourceDirectory, true);
  for (const table of tables) {
    assert(
      serializeCsv(table).equals(gitBlob(canonicalRoot, againstGit, table.path)),
      `${table.path}: S6 parent Git-blob parity failed`,
    );
  }
  return result;
}

export function writeCatalogCsvProjection(sourceDirectory: string, outputDirectory: string) {
  assertCatalogAuthorityLayout(sourceDirectory);
  const tables = readCatalogAuthority(sourceDirectory, false);
  for (const table of tables) {
    const output = join(outputDirectory, table.path);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, serializeCsv(table));
  }
  for (const path of CATALOG_OPAQUE_PATHS) {
    const output = join(outputDirectory, path);
    mkdirSync(dirname(output), { recursive: true });
    copyFileSync(join(sourceDirectory, path), output);
  }
}

export function finalizeCatalogAuthorityProjection(
  currentSourceDirectory: string,
  projectedSourceDirectory: string,
) {
  assertNode24();
  assertCatalogAuthorityLayout(currentSourceDirectory);
  const currentDatabase = join(currentSourceDirectory, CATALOG_DATABASE_FILE);
  const candidateDatabase = join(projectedSourceDirectory, CATALOG_DATABASE_FILE);
  if (existsSync(candidateDatabase)) {
    throw new Error(`Refusing to overwrite projected Catalog database: ${candidateDatabase}`);
  }
  const tables = CATALOG_TABLES.map((config) =>
    parseLexicalCsv(
      config.path,
      readFileSync(join(projectedSourceDirectory, config.path)),
      config.headers,
    ),
  );
  copyFileSync(currentDatabase, candidateDatabase);
  let db: DatabaseSync | undefined;
  try {
    db = new DatabaseSync(candidateDatabase);
    db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = DELETE; BEGIN IMMEDIATE");
    try {
      for (const config of CATALOG_TABLES) {
        db.exec(`DELETE FROM ${quoteIdentifier(config.table)}`);
      }
      insertTableRows(db, tables);
      databaseTables(db, false);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
    db.close();
    db = undefined;
    assertNoCatalogSidecars(candidateDatabase);
    withReadOnlyDatabase(candidateDatabase, (reader) => {
      for (const table of databaseTables(reader, false)) {
        assert(
          serializeCsv(table).equals(readFileSync(join(projectedSourceDirectory, table.path))),
          `${table.path}: authoring readback byte parity failed`,
        );
      }
    });
    for (const config of CATALOG_TABLES) {
      rmSync(join(projectedSourceDirectory, config.path));
    }
    assert.deepEqual(
      discoverFiles(projectedSourceDirectory),
      [CATALOG_DATABASE_FILE, ...CATALOG_OPAQUE_PATHS].sort(compareText),
      "Projected Catalog authority contains unexpected files",
    );
    return candidateDatabase;
  } catch (error) {
    db?.close();
    for (const suffix of ["", "-journal", "-wal", "-shm"]) {
      rmSync(`${candidateDatabase}${suffix}`, { force: true });
    }
    throw error;
  }
}

export function withCatalogCsvProjection<T>(
  sourceDirectory: string,
  callback: (projectedSourceDirectory: string) => T,
) {
  const temporaryRoot = mkdtempSync(join(tmpdir(), "konocomics-catalog-source-"));
  const projectedSourceDirectory = join(temporaryRoot, "source");
  try {
    writeCatalogCsvProjection(sourceDirectory, projectedSourceDirectory);
    return callback(projectedSourceDirectory);
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
}
