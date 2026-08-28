import {
  copyFileSync,
  cpSync,
  existsSync,
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
  CATALOG_DATABASE_FILE,
  CATALOG_TABLES,
  finalizeCatalogAuthorityProjection,
  readCatalogAuthority,
  sha256,
  verifyCatalogAuthority,
  writeCatalogCsvProjection,
} from "../../../scripts/catalog/authority";
import { loadCatalogSource } from "../../../scripts/catalog/load-source";
import { runCatalogPipelineFromAuthority } from "../../../scripts/catalog/pipeline";

const repositoryRoot = resolve(import.meta.dirname, "../../..");
const repositorySource = join(repositoryRoot, "data/source");

describe("SQLite Catalog authority", () => {
  it("rejects dual authority and SQLite sidecars", () => {
    const root = mkdtempSync(join(tmpdir(), "konocomics-authority-verify-"));
    const source = join(root, "data/source");
    try {
      cpSync(repositorySource, source, { recursive: true });
      expect(verifyCatalogAuthority(root).tables).toBe(9);

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
      ).toHaveLength(179);
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
