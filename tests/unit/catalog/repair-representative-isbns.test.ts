import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { parse } from "csv-parse/sync";
import { expect, it } from "vitest";
import { z } from "zod";

import { runRakutenCandidateAdjudication } from "../../../scripts/adjudicate-rakuten-candidates";
import { runCatalogPipeline } from "../../../scripts/catalog/pipeline";
import {
  loadRepresentativeVolumeDecisions,
  resolveRepresentativeVolumeDecision,
} from "../../../scripts/catalog/representative-volume-decisions";
import {
  deriveRakutenDemographic,
  parseRakutenCacheContent,
  parseRakutenSalesDate,
  parseRakutenVolumeNumber,
  runLibraryOnlyExpansion,
} from "../../../scripts/promote-library-only-expansion";
import { repairRepresentativeIsbns } from "../../../scripts/repair-representative-isbns";
import { normalizeIsbn } from "../../../src/domain/catalog/normalize";
import { catalogAssetFilename } from "../../../src/lib/catalog-asset";

const TARGET_FILES = [
  "data/source/works.csv",
  "data/source/volumes.csv",
  "data/source/evidence/evidence.csv",
  "data/staging/catalog-expansion/rakuten-matches.csv",
  "data/staging/catalog-expansion/canonical-mapping.csv",
] as const;

const matrixSchema = z.array(z.array(z.string()));
type CsvTable = { headers: string[]; rows: string[][] };

function readCsv(path: string): CsvTable {
  const [headers, ...rows] = matrixSchema.parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }),
  );
  if (headers === undefined) throw new Error(`Missing CSV header: ${path}`);
  return { headers, rows };
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function writeCsv(path: string, table: CsvTable) {
  writeFileSync(
    path,
    `${[table.headers, ...table.rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`,
    "utf8",
  );
}

function column(table: CsvTable, name: string) {
  const index = table.headers.indexOf(name);
  if (index === -1) throw new Error(`Missing ${name} column`);
  return index;
}

function oneRow(table: CsvTable, field: string, value: string) {
  const index = column(table, field);
  const rows = table.rows.filter((row) => row[index] === value);
  if (rows.length !== 1) throw new Error(`Expected one ${field}=${value} row`);
  return rows[0]!;
}

function setCell(table: CsvTable, row: string[], field: string, value: string) {
  row[column(table, field)] = value;
}

function parseNoteFields(value: string) {
  return new Map(
    value
      .replace(/\.$/u, "")
      .split("; ")
      .map((part) => {
        const separator = part.indexOf("=");
        return [part.slice(0, separator), part.slice(separator + 1)] as const;
      }),
  );
}

function serializeNoteFields(fields: ReadonlyMap<string, string>) {
  return `${[...fields].map(([key, value]) => `${key}=${value}`).join("; ")}.`;
}

function copyFixture(sourceRoot: string, fixtureRoot: string) {
  cpSync(join(sourceRoot, "data/source"), join(fixtureRoot, "data/source"), {
    recursive: true,
  });
  cpSync(
    join(sourceRoot, "data/staging/catalog-expansion"),
    join(fixtureRoot, "data/staging/catalog-expansion"),
    { recursive: true },
  );
}

function restorePreRepairProjection(root: string) {
  const staging = join(root, "data/staging/catalog-expansion");
  const decisions = loadRepresentativeVolumeDecisions(staging);
  const records = parseRakutenCacheContent(
    readFileSync(join(staging, "rakuten-search-results.jsonl"), "utf8"),
  );
  const memberships = readCsv(join(staging, "source-membership.csv"));
  const membershipCandidate = column(memberships, "candidateId");
  const membershipSourceItem = column(memberships, "sourceItemId");
  const sourceItemsByCandidate = Map.groupBy(
    memberships.rows.filter((row) => row[membershipCandidate] !== ""),
    (row) => row[membershipCandidate]!,
  );
  const paths = {
    works: join(root, TARGET_FILES[0]),
    volumes: join(root, TARGET_FILES[1]),
    evidence: join(root, TARGET_FILES[2]),
    matches: join(root, TARGET_FILES[3]),
    mappings: join(root, TARGET_FILES[4]),
  };
  const tables = Object.fromEntries(
    Object.entries(paths).map(([name, path]) => [name, readCsv(path)]),
  ) as Record<keyof typeof paths, CsvTable>;

  for (const decision of decisions) {
    const sourceItems = new Set(
      (sourceItemsByCandidate.get(decision.candidateId) ?? []).map(
        (row) => row[membershipSourceItem]!,
      ),
    );
    const resolved = resolveRepresentativeVolumeDecision(
      decision,
      records.flatMap((record) =>
        record.sourceItemIds.some((sourceItemId) => sourceItems.has(sourceItemId))
          ? record.items.map((item) => ({ responseSha256: record.responseSha256, item }))
          : [],
      ),
    );
    const dates = parseRakutenSalesDate(resolved.current.item.salesDate);
    const oldVolumeNumber = parseRakutenVolumeNumber(resolved.current.item.title);

    const work = oneRow(tables.works, "id", decision.workId);
    setCell(tables.works, work, "publisher", resolved.current.item.publisherName.trim());
    setCell(
      tables.works,
      work,
      "demographic",
      deriveRakutenDemographic(resolved.current.item.booksGenreId),
    );
    if (work[column(tables.works, "recommendationEligible")] !== "true") {
      setCell(
        tables.works,
        work,
        "firstPublishedYear",
        oldVolumeNumber === 1 ? dates.salesYear : "",
      );
    }

    const volume = oneRow(tables.volumes, "workId", decision.workId);
    setCell(
      tables.volumes,
      volume,
      "volumeNumber",
      oldVolumeNumber === undefined ? "" : String(oldVolumeNumber),
    );
    setCell(tables.volumes, volume, "isbn", decision.currentIsbn);
    setCell(tables.volumes, volume, "releaseDate", dates.releaseDate);

    const evidence = oneRow(tables.evidence, "id", `ev-rakuten-library-${decision.workId}`);
    if (
      evidence[column(tables.evidence, "sourceType")] !== "model" ||
      evidence[column(tables.evidence, "extractorVersion")] !== "community-promotion-v4"
    ) {
      setCell(tables.evidence, evidence, "sourceUrl", resolved.current.item.itemUrl);
      setCell(
        tables.evidence,
        evidence,
        "notes",
        `Rakuten Books matched representative ISBN ${decision.currentIsbn}; bibliographic promotion only; taste factors remain unknown and annotations are unreviewed.`,
      );
    }

    const match = oneRow(tables.matches, "candidateId", decision.candidateId);
    setCell(tables.matches, match, "isbn", decision.currentIsbn);
    setCell(tables.matches, match, "matchedTitle", resolved.current.item.title);
    setCell(tables.matches, match, "sourceUrl", resolved.current.item.itemUrl);
    setCell(
      tables.matches,
      match,
      "notes",
      `Exact normalized title, creator overlap, valid ISBN, standard edition, and Rakuten manga genre ${resolved.current.item.booksGenreId}.`,
    );

    for (const mapping of tables.mappings.rows.filter(
      (row) => row[column(tables.mappings, "workId")] === decision.workId,
    )) {
      const fields = parseNoteFields(mapping[column(tables.mappings, "notes")]!);
      fields.set("rakutenProductUrl", resolved.current.item.itemUrl);
      fields.set("matchedRakutenAuthor", resolved.current.item.author);
      fields.set("isbn", decision.currentIsbn);
      setCell(tables.mappings, mapping, "notes", serializeNoteFields(fields));
    }
  }

  for (const [name, path] of Object.entries(paths)) {
    writeCsv(path, tables[name as keyof typeof paths]);
  }
}

function unchangedRows(
  before: CsvTable,
  after: CsvTable,
  identityField: string,
  targets: ReadonlySet<string>,
) {
  const beforeIdentity = column(before, identityField);
  const afterIdentity = column(after, identityField);
  expect(after.rows.filter((row) => !targets.has(row[afterIdentity]!))).toEqual(
    before.rows.filter((row) => !targets.has(row[beforeIdentity]!)),
  );
}

function writeGeneratedArtifacts(root: string) {
  const pipeline = runCatalogPipeline(join(root, "data/source"));
  expect(pipeline.issues.filter((issue) => issue.severity === "error")).toEqual([]);
  const catalog = `${JSON.stringify(pipeline.catalog, null, 2)}\n`;
  const context = `${JSON.stringify(pipeline.context, null, 2)}\n`;
  const outputs = [
    ["data/generated/catalog-v1.json", catalog],
    ["src/data/generated/catalog-v1.json", catalog],
    [`public/catalog/${catalogAssetFilename(pipeline.catalog.catalogVersion)}`, catalog],
    ["data/generated/recommendation-context-v1.json", context],
    ["src/data/generated/recommendation-context-v1.json", context],
  ] as const;
  for (const [file, content] of outputs) {
    const path = join(root, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, "utf8");
  }
}

it("keeps one audited 84-work decision set through repair, adjudication, and promotion", () => {
  const sourceRoot = resolve(process.cwd());
  const fixtureRoot = mkdtempSync(join(tmpdir(), "konocomics-representative-isbns-"));
  try {
    copyFixture(sourceRoot, fixtureRoot);
    restorePreRepairProjection(fixtureRoot);
    const staging = join(fixtureRoot, "data/staging/catalog-expansion");
    const decisions = loadRepresentativeVolumeDecisions(staging);
    const workIds = new Set(decisions.map((decision) => decision.workId));
    const candidateIds = new Set(decisions.map((decision) => decision.candidateId));
    const replacementWorkIds = new Set(
      decisions
        .filter((decision) => decision.decisionKind === "isbn-replacement")
        .map((decision) => decision.workId),
    );
    const before = new Map(TARGET_FILES.map((file) => [file, readCsv(join(fixtureRoot, file))]));
    const beforeEvidence = before.get(TARGET_FILES[2])!;
    const beforeEvidenceId = column(beforeEvidence, "id");
    const beforeEvidenceWorkId = column(beforeEvidence, "workId");
    const beforeEvidenceSourceType = column(beforeEvidence, "sourceType");
    const beforeEvidenceExtractorVersion = column(beforeEvidence, "extractorVersion");
    const downstreamEvidenceRows = beforeEvidence.rows.filter(
      (row) =>
        workIds.has(row[beforeEvidenceWorkId]!) &&
        row[beforeEvidenceSourceType] === "model" &&
        row[beforeEvidenceExtractorVersion] === "community-promotion-v4",
    );
    expect(downstreamEvidenceRows).toHaveLength(71);
    const bytes = new Map(
      TARGET_FILES.map((file) => [file, readFileSync(join(fixtureRoot, file), "utf8")]),
    );

    expect(repairRepresentativeIsbns("dry-run", fixtureRoot)).toMatchObject({
      alreadyApplied: false,
      replacements: 28,
      volumeCorrections: 56,
    });
    for (const [file, content] of bytes) {
      expect(readFileSync(join(fixtureRoot, file), "utf8")).toBe(content);
    }

    expect(repairRepresentativeIsbns("apply", fixtureRoot)).toMatchObject({
      mode: "apply",
      alreadyApplied: false,
      replacements: 28,
      volumeCorrections: 56,
    });
    const after = new Map(TARGET_FILES.map((file) => [file, readCsv(join(fixtureRoot, file))]));
    const afterEvidence = after.get(TARGET_FILES[2])!;
    for (const row of downstreamEvidenceRows) {
      expect(oneRow(afterEvidence, "id", row[beforeEvidenceId]!)).toEqual(row);
    }
    const candidates = readCsv(join(staging, "candidates.csv"));
    let replacementMappingRows = 0;
    for (const decision of decisions) {
      const work = oneRow(after.get(TARGET_FILES[0])!, "id", decision.workId);
      const candidate = oneRow(candidates, "candidateId", decision.candidateId);
      const volume = oneRow(after.get(TARGET_FILES[1])!, "workId", decision.workId);
      expect(work[column(after.get(TARGET_FILES[0])!, "firstPublishedYear")]).toBe(
        candidate[column(candidates, "firstPublishedYear")],
      );
      expect(volume[column(after.get(TARGET_FILES[1])!, "volumeNumber")]).toBe("1");
      expect(normalizeIsbn(volume[column(after.get(TARGET_FILES[1])!, "isbn")]!)).toBe(
        decision.auditedIsbn,
      );
      if (decision.decisionKind === "isbn-replacement") {
        const match = oneRow(after.get(TARGET_FILES[3])!, "candidateId", decision.candidateId);
        expect(match[column(after.get(TARGET_FILES[3])!, "isbn")]).toBe(decision.auditedIsbn);
        const mappings = after
          .get(TARGET_FILES[4])!
          .rows.filter(
            (row) => row[column(after.get(TARGET_FILES[4])!, "workId")] === decision.workId,
          );
        replacementMappingRows += mappings.length;
        expect(
          mappings.every((row) =>
            row[column(after.get(TARGET_FILES[4])!, "notes")]?.includes(
              `isbn=${decision.auditedIsbn}`,
            ),
          ),
        ).toBe(true);
      }
    }
    expect(replacementMappingRows).toBe(40);

    unchangedRows(before.get(TARGET_FILES[0])!, after.get(TARGET_FILES[0])!, "id", workIds);
    unchangedRows(before.get(TARGET_FILES[1])!, after.get(TARGET_FILES[1])!, "workId", workIds);
    unchangedRows(before.get(TARGET_FILES[2])!, after.get(TARGET_FILES[2])!, "workId", workIds);
    unchangedRows(
      before.get(TARGET_FILES[3])!,
      after.get(TARGET_FILES[3])!,
      "candidateId",
      candidateIds,
    );
    unchangedRows(
      before.get(TARGET_FILES[4])!,
      after.get(TARGET_FILES[4])!,
      "workId",
      replacementWorkIds,
    );

    expect(repairRepresentativeIsbns("dry-run", fixtureRoot)).toMatchObject({
      alreadyApplied: true,
      changedFiles: [],
    });
    runRakutenCandidateAdjudication("--write", fixtureRoot);
    expect(runRakutenCandidateAdjudication("--check", fixtureRoot)).toEqual({
      candidateCount: 1_541,
      mappingCount: 2_239,
    });
    writeGeneratedArtifacts(fixtureRoot);
    const expansion = runLibraryOnlyExpansion("--check", fixtureRoot);
    expect(expansion.committedCount).toBe(expansion.expectedCount);

    const corruptedEvidence = readCsv(join(fixtureRoot, TARGET_FILES[2]));
    const corruptedRow = oneRow(
      corruptedEvidence,
      "id",
      downstreamEvidenceRows[0]![beforeEvidenceId]!,
    );
    setCell(corruptedEvidence, corruptedRow, "extractorVersion", "community-promotion-v3");
    writeCsv(join(fixtureRoot, TARGET_FILES[2]), corruptedEvidence);
    expect(() => runLibraryOnlyExpansion("--check", fixtureRoot)).toThrow(
      'sourceType ("model" !== "rakuten")',
    );
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
}, 60_000);
