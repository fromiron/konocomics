import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { extractKonomangaRanking } from "../../../scripts/import-konomanga-rankings";
import { writeCatalogCsvProjection } from "../../../scripts/catalog/authority";
import {
  loadCatalogExpansion,
  validateCatalogExpansion,
  validateGoldSet,
} from "../../../scripts/validate-catalog-expansion";

const root = resolve(process.cwd());
const stagingDirectory = join(root, "data/staging/catalog-expansion");
const goldManifest = JSON.parse(
  readFileSync(join(stagingDirectory, "gold-set-manifest.json"), "utf8"),
) as unknown;
const temporaryRoots: string[] = [];

function copySource() {
  const temporaryRoot = mkdtempSync(join(tmpdir(), "konocomics-catalog-expansion-"));
  temporaryRoots.push(temporaryRoot);
  const destination = join(temporaryRoot, "data/source");
  mkdirSync(dirname(destination), { recursive: true });
  writeCatalogCsvProjection(join(root, "data/source"), destination);
  return temporaryRoot;
}

afterEach(() => {
  for (const path of temporaryRoots.splice(0)) {
    rmSync(path, { recursive: true, force: true });
  }
});

describe("catalog expansion staging", () => {
  it("accounts for every imported source row with an explicit terminal status", () => {
    const data = loadCatalogExpansion(stagingDirectory);
    expect(validateCatalogExpansion(data)).toMatchObject({
      sourceCount: data.sources.length,
      rawItemCount: data.rawItems.length,
      unresolvedCount: data.memberships.filter((row) => row.status === "unresolved").length,
    });

    data.memberships = data.memberships.slice(1);
    expect(() => validateCatalogExpansion(data)).toThrow(/no terminal membership/u);
  });

  it("rejects a claimed inclusion without its canonical decision", () => {
    const data = loadCatalogExpansion(stagingDirectory);
    data.memberships[0] = { ...data.memberships[0]!, status: "included" };
    expect(() => validateCatalogExpansion(data)).toThrow(/missing candidateId or decisionRef/u);
  });

  it("extracts tied rankings once across migrated duplicate markup", () => {
    const html = [
      "<p>★ 第1位 ★</p><p>『First』 Author A 10pt</p>",
      "<p>★ 第1位 ★</p><p>『First』</p>",
      "<p>★ 第1位 ★</p><p>『Second』</p><p>Author B 20pt</p>",
    ].join("");
    expect(extractKonomangaRanking(html, 2)).toEqual([
      { section: "オトコ編", rank: 1, title: "First", creator: "Author A", points: "10pt" },
      { section: "オンナ編", rank: 1, title: "Second", creator: "Author B", points: "20pt" },
    ]);
  });
});

describe("catalog expansion Gold Set", () => {
  it("protects exact taste rows while allowing additive provenance rows", () => {
    const additiveRoot = copySource();
    const aliasesPath = join(additiveRoot, "data/source/aliases.csv");
    writeFileSync(
      aliasesPath,
      `${readFileSync(aliasesPath, "utf8").trimEnd()}\n20th-century-boys,20th Century Boys extra alias\n`,
      "utf8",
    );
    expect(() => validateGoldSet(additiveRoot, goldManifest)).not.toThrow();

    const changedRoot = copySource();
    const factorsPath = join(changedRoot, "data/source/factors.csv");
    writeFileSync(
      factorsPath,
      readFileSync(factorsPath, "utf8").replace(",known,4,", ",known,3,"),
      "utf8",
    );
    expect(() => validateGoldSet(changedRoot, goldManifest)).toThrow(/Gold Set rows changed/u);
  });

  it("rejects removal of baseline evidence or aliases", () => {
    const temporaryRoot = copySource();
    const aliasesPath = join(temporaryRoot, "data/source/aliases.csv");
    const [header, , ...remaining] = readFileSync(aliasesPath, "utf8").trimEnd().split("\n");
    writeFileSync(aliasesPath, `${[header, ...remaining].join("\n")}\n`, "utf8");
    expect(() => validateGoldSet(temporaryRoot, goldManifest)).toThrow(
      /Gold Set row changed or was removed/u,
    );
  });

  it("allows a new Work while rejecting review provenance changes", () => {
    const additiveRoot = copySource();
    const worksPath = join(additiveRoot, "data/source/works.csv");
    const works = readFileSync(worksPath, "utf8").trimEnd().split("\n");
    const added = works[1]!.replace(/^[^,]+,/u, "new-independent-work,");
    writeFileSync(worksPath, `${works.join("\n")}\n${added}\n`, "utf8");
    expect(() => validateGoldSet(additiveRoot, goldManifest)).not.toThrow();

    const changedRoot = copySource();
    const reviewPath = join(changedRoot, "data/source/reviews/g1-sanity-panel.md");
    writeFileSync(reviewPath, `${readFileSync(reviewPath, "utf8")}changed\n`, "utf8");
    expect(() => validateGoldSet(changedRoot, goldManifest)).toThrow(/review provenance changed/u);
  });

  it("rejects a manifest that no longer binds exactly 150 Work IDs", () => {
    const manifest = JSON.parse(JSON.stringify(goldManifest)) as {
      workCount: number;
      workIds: string[];
    };
    manifest.workCount = 149;
    manifest.workIds.pop();
    expect(() => validateGoldSet(root, manifest)).toThrow(/work IDs are not unique and canonical/u);
  });
});
