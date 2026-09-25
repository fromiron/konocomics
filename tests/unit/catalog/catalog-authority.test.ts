import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

import { describe, expect, it } from "vitest";

import {
  CATALOG_AUTHORITY_SCHEMA_PATH,
  CATALOG_BOOK_METADATA_TABLE,
  CATALOG_DATABASE_FILE,
  CATALOG_TABLES,
  finalizeCatalogAuthorityProjection,
  readCatalogAuthority,
  serializeCsv,
  sha256,
  verifyCatalogAuthority,
  writeCatalogCsvProjection,
} from "../../../scripts/catalog/authority";
import { loadCatalogSource } from "../../../scripts/catalog/load-source";
import { runCatalogPipelineFromAuthority } from "../../../scripts/catalog/pipeline";

const repositoryRoot = resolve(import.meta.dirname, "../../..");
const repositorySource = join(repositoryRoot, "data/source");
const dynamicReviewReference = "reviews/authorized-evidence-panel-v1.md";

function createAuthorityWithDynamicReview() {
  const root = mkdtempSync(join(tmpdir(), "konocomics-authority-dynamic-review-"));
  const source = join(root, "data/source");
  writeCatalogCsvProjection(repositorySource, source);
  const works = join(source, "works.csv");
  writeFileSync(
    works,
    readFileSync(works, "utf8").replace("reviews/g1-sanity-panel.md", dynamicReviewReference),
    "utf8",
  );
  writeFileSync(join(source, dynamicReviewReference), "# Authorized evidence panel\n", "utf8");
  finalizeCatalogAuthorityProjection(repositorySource, source);
  return { root, source, review: join(source, dynamicReviewReference) };
}

describe("SQLite Catalog authority", () => {
  it("opens a Catalog SQLite file beyond the Windows path limit", () => {
    const root = mkdtempSync(join(tmpdir(), "konocomics-long-path-"));
    const source = join(root, ...Array.from({ length: 4 }, () => "nested-path-".padEnd(58, "x")));
    try {
      mkdirSync(source, { recursive: true });
      expect(join(source, CATALOG_DATABASE_FILE).length).toBeGreaterThan(260);
      copyFileSync(join(repositorySource, CATALOG_DATABASE_FILE), join(source, CATALOG_DATABASE_FILE));
      expect(readCatalogAuthority(source).length).toBeGreaterThan(0);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 120_000);

  it("migrates a v1 authoring projection to v2 and preserves metadata on the next ordinary edit", () => {
    const root = mkdtempSync(join(tmpdir(), "konocomics-authority-book-metadata-"));
    const legacy = join(root, "legacy/data/source");
    try {
      cpSync(repositorySource, legacy, { recursive: true });
      const db = new DatabaseSync(join(legacy, CATALOG_DATABASE_FILE));
      db.exec("DROP TABLE IF EXISTS source_book_metadata; PRAGMA user_version=1");
      db.close();
      expect(verifyCatalogAuthority(join(root, "legacy")).tables).toBe(9);
      const originalDigest = sha256(readFileSync(join(legacy, CATALOG_DATABASE_FILE)));
      const candidate = join(root, "candidate/data/source");
      writeCatalogCsvProjection(legacy, candidate);
      const table = {
        path: CATALOG_BOOK_METADATA_TABLE.path,
        headers: CATALOG_BOOK_METADATA_TABLE.headers,
        rows: [
          {
            sourceOrdinal: 1,
            sourceLine: 2,
            values: [
              "work-9b42e9cda7743bba0f9b",
              "9784063404456",
              "講談社",
              "出版社の紹介",
              "2003-08-06",
              "",
              "KC KISS",
              "208",
              "https://www.kodansha.co.jp/comic/products/0000035910",
              "2026-09-11T07:43:01.523Z",
            ],
          },
        ],
      };
      writeFileSync(join(candidate, table.path), serializeCsv(table));
      finalizeCatalogAuthorityProjection(legacy, candidate);
      expect(verifyCatalogAuthority(join(root, "candidate")).tables).toBe(10);
      expect(sha256(readFileSync(join(legacy, CATALOG_DATABASE_FILE)))).toBe(originalDigest);
      expect(
        runCatalogPipelineFromAuthority(candidate).catalog.volumes.find(
          (volume) => volume.isbn === "9784063404456",
        )?.metadata?.pageCount,
      ).toBe(208);
      const next = join(root, "next/data/source");
      writeCatalogCsvProjection(candidate, next);
      writeFileSync(
        join(next, "aliases.csv"),
        `${readFileSync(join(next, "aliases.csv"), "utf8").trimEnd()}\ndungeon-meshi,ダンジョン飯テスト\n`,
      );
      finalizeCatalogAuthorityProjection(candidate, next);
      expect(readCatalogAuthority(next).find((entry) => entry.path === table.path)).toEqual(table);
      expect(existsSync(join(next, table.path))).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 120_000);

  it("binds referenced review reports into the ongoing authority digest", () => {
    const { root, review } = createAuthorityWithDynamicReview();
    try {
      const before = verifyCatalogAuthority(root);
      expect(before.opaqueFiles).toBe(verifyCatalogAuthority(repositoryRoot).opaqueFiles + 1);
      writeFileSync(review, "# Changed authorized evidence panel\n", "utf8");
      expect(verifyCatalogAuthority(root).sourceManifestDigest).not.toBe(
        before.sourceManifestDigest,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 120_000);

  it("rejects a missing referenced review report", () => {
    const { root, review } = createAuthorityWithDynamicReview();
    try {
      rmSync(review);
      expect(() => verifyCatalogAuthority(root)).toThrow(
        "fixed plus referenced opaque Markdown files",
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 120_000);

  it("rejects unreferenced review reports and root duplicates", () => {
    const { root, source } = createAuthorityWithDynamicReview();
    try {
      const unreferenced = join(source, "reviews/unreferenced-panel.md");
      writeFileSync(unreferenced, "# Unreferenced\n", "utf8");
      expect(() => verifyCatalogAuthority(root)).toThrow(
        "fixed plus referenced opaque Markdown files",
      );
      rmSync(unreferenced);

      writeFileSync(join(source, "authorized-evidence-panel-v1.md"), "# Duplicate\n", "utf8");
      expect(() => verifyCatalogAuthority(root)).toThrow(
        "fixed plus referenced opaque Markdown files",
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 120_000);

  it("rejects dual authority and SQLite sidecars", () => {
    const root = mkdtempSync(join(tmpdir(), "konocomics-authority-verify-"));
    const source = join(root, "data/source");
    try {
      cpSync(repositorySource, source, { recursive: true });
      expect(verifyCatalogAuthority(root).tables).toBe(10);

      const projected = join(root, "projected");
      writeCatalogCsvProjection(source, projected);
      writeFileSync(join(source, "unexpected.txt"), "unexpected");
      expect(() => finalizeCatalogAuthorityProjection(source, projected)).toThrow(
        "data/source must contain one SQLite authority",
      );
      rmSync(join(source, "unexpected.txt"));

      writeFileSync(join(source, `${CATALOG_DATABASE_FILE}-wal`), "residue");
      expect(() => writeCatalogCsvProjection(source, join(root, "blocked-projection"))).toThrow(
        "SQLite residue exists",
      );
      rmSync(join(source, `${CATALOG_DATABASE_FILE}-wal`));

      rmSync(source, { recursive: true, force: true });
      writeCatalogCsvProjection(repositorySource, source);
      copyFileSync(
        join(repositorySource, CATALOG_DATABASE_FILE),
        join(source, CATALOG_DATABASE_FILE),
      );
      expect(loadCatalogSource(source).issues).toContainEqual(
        expect.objectContaining({ code: "SOURCE_DUAL_AUTHORITY" }),
      );
      expect(runCatalogPipelineFromAuthority(source).issues).toContainEqual(
        expect.objectContaining({ code: "SOURCE_DUAL_AUTHORITY" }),
      );
      expect(() => verifyCatalogAuthority(root)).toThrow(
        "data/source must contain one SQLite authority",
      );

      for (const table of readCatalogAuthority(repositorySource)) {
        rmSync(join(source, table.path));
      }
      writeFileSync(join(source, `${CATALOG_DATABASE_FILE}-wal`), "residue");
      expect(() => verifyCatalogAuthority(root)).toThrow();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 120_000);

  it("commits a validated projection to a candidate DB and leaves the current DB untouched", () => {
    const root = mkdtempSync(join(tmpdir(), "konocomics-authority-write-"));
    const projected = join(root, "source");
    const originalDatabase = join(repositorySource, CATALOG_DATABASE_FILE);
    const originalDigest = sha256(readFileSync(originalDatabase));
    try {
      const originalAliases = readCatalogAuthority(repositorySource).find(
        (table) => table.path === "aliases.csv",
      )!.rows;
      writeCatalogCsvProjection(repositorySource, projected);
      const aliases = join(projected, "aliases.csv");
      writeFileSync(
        aliases,
        `${readFileSync(aliases, "utf8").trimEnd()}\ndungeon-meshi,ダンジョン飯テスト\n`,
        "utf8",
      );
      finalizeCatalogAuthorityProjection(repositorySource, projected);

      expect(existsSync(join(projected, CATALOG_DATABASE_FILE))).toBe(true);
      expect(existsSync(aliases)).toBe(false);
      expect(
        readCatalogAuthority(projected).find((table) => table.path === "aliases.csv")?.rows,
      ).toEqual([
        ...originalAliases,
        {
          sourceOrdinal: originalAliases.length + 1,
          sourceLine: originalAliases.length + 2,
          values: ["dungeon-meshi", "ダンジョン飯テスト"],
        },
      ]);
      expect(sha256(readFileSync(originalDatabase))).toBe(originalDigest);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }, 120_000);

  it("rejects non-STRICT tables and CHECK constraint drift", () => {
    for (const [label, mutateSchema, expectedError] of [
      ["non-strict", (schema: string) => schema.replaceAll(") STRICT;", ");"), "STRICT"],
      [
        "missing-check",
        (schema: string) => schema.replace(' CHECK ("sourceLine" >= 2)', ""),
        "DDL drift",
      ],
    ] as const) {
      const root = mkdtempSync(join(tmpdir(), `konocomics-authority-${label}-`));
      const source = join(root, "data/source");
      const databasePath = join(source, CATALOG_DATABASE_FILE);
      try {
        cpSync(repositorySource, source, { recursive: true });
        rmSync(databasePath);
        const database = new DatabaseSync(databasePath);
        try {
          database.exec(mutateSchema(readFileSync(CATALOG_AUTHORITY_SCHEMA_PATH, "utf8")));
          database
            .prepare("ATTACH DATABASE ? AS canonical")
            .run(join(repositorySource, CATALOG_DATABASE_FILE));
          for (const table of CATALOG_TABLES) {
            database.exec(`INSERT INTO "${table.table}" SELECT * FROM canonical."${table.table}"`);
          }
          database.exec("DETACH DATABASE canonical");
        } finally {
          database.close();
        }
        expect(() => verifyCatalogAuthority(root)).toThrow(expectedError);
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    }
  }, 120_000);
});
