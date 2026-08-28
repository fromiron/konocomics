import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import { runCatalogPipeline } from "./catalog/pipeline";
import {
  assertRepresentativeDecisionIdentity,
  loadRepresentativeVolumeDecisions,
  resolveRepresentativeVolumeDecision,
  type RepresentativeRakutenHit,
} from "./catalog/representative-volume-decisions";
import { formatSourceIssue, hasErrors } from "./catalog/report";
import {
  deriveRakutenDemographic,
  parseRakutenSalesDate,
  parseRakutenVolumeNumber,
} from "./promote-library-only-expansion";
import { publishDirectorySet } from "./promote-g2-catalog";
import { loadCatalogExpansion, validateCatalogExpansion } from "./validate-catalog-expansion";
import { normalizeIsbn } from "../src/domain/catalog/normalize";

const SOURCE_DIRECTORY = "data/source";
const STAGING_DIRECTORY = "data/staging/catalog-expansion";
const CACHE_PATH = `${STAGING_DIRECTORY}/rakuten-search-results.jsonl`;
const CACHE_MANIFEST_PATH = `${STAGING_DIRECTORY}/rakuten-search-manifest.json`;
const EXPECTED_CACHE_SHA256 = "23bb2f90b495c9be6de78736bb959302df8a18cd97c3f003898076c34dd8fc6a";
const EXPECTED_UNSUPPORTED_COUNT = 158;

const CHANGED_FILES = [
  `${SOURCE_DIRECTORY}/works.csv`,
  `${SOURCE_DIRECTORY}/volumes.csv`,
  `${SOURCE_DIRECTORY}/evidence/evidence.csv`,
  `${STAGING_DIRECTORY}/rakuten-matches.csv`,
  `${STAGING_DIRECTORY}/canonical-mapping.csv`,
] as const;

const HEADERS = {
  works:
    "id,title,titleKana,creators,publisher,demographic,status,firstPublishedYear,genres,factorScope,onboardingEligible,recommendationEligible,libraryOnly,metadataConfidence,groupingConfidence,sourceAgreement,annotationReviewMethod,annotationReviewedAt,annotationReviewReference,evidenceId",
  volumes: "id,workId,volumeNumber,isbn,releaseDate,editionKind,isRepresentative,evidenceId",
  evidence:
    "id,workId,targetType,targetId,sourceType,sourceUrl,fetchedAt,extractorVersion,reviewedByHuman,confidence,notes",
  candidates:
    "candidateId,canonicalTitleJa,titleKana,creatorsJa,firstPublishedYear,originCountry,format,publicationStatus,notes",
  memberships: "sourceItemId,sourceId,status,candidateId,workId,decisionRef",
  matches:
    "rakutenMatchId,candidateId,matchStatus,isbn,matchedTitle,editionKind,isRepresentative,sourceUrl,checkedAt,notes",
  mappings:
    "mappingId,sourceItemId,candidateId,workId,mappingType,canonicalTitleJa,confidence,evidenceName,evidenceUrl,evidencePublishedAt,retrievedAt,notes",
} as const;

type RepairMode = "dry-run" | "apply";
type CsvTable = { headers: string[]; rows: string[][] };
const DUPLICATE_BLOCKS = [
  {
    workId: "work-3b65a9ad6f6612c1077e",
    currentIsbn: "9784091512390",
    proposedIsbn: "9784091511973",
    ownerWorkId: "work-dc6da46b90e2badecec5",
  },
  {
    workId: "work-953355c6478f97b695db",
    currentIsbn: "9784063757507",
    proposedIsbn: "9784063722017",
    ownerWorkId: "work-060a72fe10cf6ba9cbfc",
  },
] as const;

const matrixSchema = z.array(z.array(z.string()));
const cacheItemSchema = z.strictObject({
  title: z.string().min(1),
  author: z.string(),
  publisherName: z.string(),
  isbn: z.string(),
  booksGenreId: z.string(),
  salesDate: z.string(),
  itemUrl: z.url(),
});
const cacheRecordSchema = z.strictObject({
  queryKey: z.string().min(1),
  queryTitle: z.string().min(1),
  sourceItemIds: z.array(z.string()).min(1),
  retrievedAt: z.iso.date(),
  outcome: z.enum(["ok", "invalid-query"]),
  responseSha256: z.string().regex(/^[a-f0-9]{64}$/u),
  items: z.array(cacheItemSchema),
});
const manifestSchema = z.object({
  retrievedThrough: z.iso.date(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/u),
});
type CacheRecord = z.infer<typeof cacheRecordSchema>;

function sha256(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

function filesIn(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return filesIn(path);
      if (entry.isFile()) return [path];
      throw new Error(`Unsupported catalog filesystem entry: ${path}`);
    });
}

function validationSnapshot(root: string) {
  return new Map(
    [SOURCE_DIRECTORY, STAGING_DIRECTORY]
      .flatMap((directory) => filesIn(join(root, directory)))
      .map((path) => [relative(root, path), sha256(readFileSync(path))]),
  );
}

function assertValidationSnapshot(root: string, expected: ReadonlyMap<string, string>) {
  const current = validationSnapshot(root);
  if (
    current.size !== expected.size ||
    [...expected].some(([path, digest]) => current.get(path) !== digest)
  ) {
    throw new Error("Concurrent catalog source or staging change detected");
  }
}

function readCsv(path: string, expectedHeader: string): CsvTable {
  const [headers, ...rows] = matrixSchema.parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }),
  );
  if (
    headers === undefined ||
    headers.join(",") !== expectedHeader ||
    rows.some((row) => row.length !== headers.length)
  ) {
    throw new Error(`Unexpected CSV shape: ${path}`);
  }
  return { headers, rows };
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeCsv(table: CsvTable) {
  return `${[table.headers, ...table.rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function column(table: CsvTable, name: string, path: string) {
  const index = table.headers.indexOf(name);
  if (index === -1) throw new Error(`Missing ${name} column: ${path}`);
  return index;
}

function oneRow(table: CsvTable, path: string, field: string, value: string) {
  const index = column(table, field, path);
  const rows = table.rows.filter((row) => row[index] === value);
  if (rows.length !== 1) {
    throw new Error(`${path} expected one ${field}=${value} row, found ${rows.length}`);
  }
  return rows[0]!;
}

function cloneTable(table: CsvTable): CsvTable {
  return { headers: [...table.headers], rows: table.rows.map((row) => [...row]) };
}

function parseNoteFields(value: string) {
  const fields = new Map<string, string>();
  for (const part of value.replace(/\.$/u, "").split("; ")) {
    const separator = part.indexOf("=");
    if (separator > 0) fields.set(part.slice(0, separator), part.slice(separator + 1));
  }
  return fields;
}

function serializeNoteFields(fields: ReadonlyMap<string, string>) {
  return `${[...fields].map(([key, value]) => `${key}=${value}`).join("; ")}.`;
}

function loadCache(root: string) {
  const cacheBytes = readFileSync(join(root, CACHE_PATH));
  const actualHash = sha256(cacheBytes);
  const manifest = manifestSchema.parse(
    JSON.parse(readFileSync(join(root, CACHE_MANIFEST_PATH), "utf8")) as unknown,
  );
  if (actualHash !== EXPECTED_CACHE_SHA256 || manifest.sha256 !== actualHash) {
    throw new Error(`Rakuten cache hash conflict: ${actualHash}`);
  }
  const records = cacheBytes
    .toString("utf8")
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line) => cacheRecordSchema.parse(JSON.parse(line) as unknown));
  if (records.some((record) => record.retrievedAt !== manifest.retrievedThrough)) {
    throw new Error("Rakuten cache retrievedAt conflicts with its manifest");
  }
  if (
    records.some(
      (record) =>
        record.responseSha256 !==
        sha256(`${JSON.stringify({ outcome: record.outcome, items: record.items })}\n`),
    )
  ) {
    throw new Error("Rakuten cache response hash conflict");
  }
  return records;
}

function tablePaths(root: string) {
  return {
    works: join(root, SOURCE_DIRECTORY, "works.csv"),
    volumes: join(root, SOURCE_DIRECTORY, "volumes.csv"),
    evidence: join(root, SOURCE_DIRECTORY, "evidence/evidence.csv"),
    candidates: join(root, STAGING_DIRECTORY, "candidates.csv"),
    memberships: join(root, STAGING_DIRECTORY, "source-membership.csv"),
    matches: join(root, STAGING_DIRECTORY, "rakuten-matches.csv"),
    mappings: join(root, STAGING_DIRECTORY, "canonical-mapping.csv"),
  };
}

function loadTables(root: string) {
  const paths = tablePaths(root);
  return {
    paths,
    works: readCsv(paths.works, HEADERS.works),
    volumes: readCsv(paths.volumes, HEADERS.volumes),
    evidence: readCsv(paths.evidence, HEADERS.evidence),
    candidates: readCsv(paths.candidates, HEADERS.candidates),
    memberships: readCsv(paths.memberships, HEADERS.memberships),
    matches: readCsv(paths.matches, HEADERS.matches),
    mappings: readCsv(paths.mappings, HEADERS.mappings),
  };
}

function assertAllowed(value: string, allowed: readonly string[], label: string) {
  if (!allowed.includes(value)) {
    throw new Error(`${label} has an unexpected pre-repair value: ${value}`);
  }
}

function scopedCacheHits(
  records: readonly CacheRecord[],
  sourceItemIds: ReadonlySet<string>,
): RepresentativeRakutenHit[] {
  return records.flatMap((record) =>
    record.sourceItemIds.some((sourceItemId) => sourceItemIds.has(sourceItemId))
      ? record.items.map((item) => ({ responseSha256: record.responseSha256, item }))
      : [],
  );
}

function analyze(root: string) {
  const decisions = loadRepresentativeVolumeDecisions(join(root, STAGING_DIRECTORY));
  const decisionIds = new Set(decisions.map((decision) => decision.workId));
  const tables = loadTables(root);
  const records = loadCache(root);
  const { paths } = tables;
  const workId = column(tables.works, "id", paths.works);
  const workTitle = column(tables.works, "title", paths.works);
  const workCreators = column(tables.works, "creators", paths.works);
  const workPublisher = column(tables.works, "publisher", paths.works);
  const workDemographic = column(tables.works, "demographic", paths.works);
  const workYear = column(tables.works, "firstPublishedYear", paths.works);
  const libraryOnly = column(tables.works, "libraryOnly", paths.works);
  const recommendationEligible = column(tables.works, "recommendationEligible", paths.works);
  const volumeWork = column(tables.volumes, "workId", paths.volumes);
  const volumeNumber = column(tables.volumes, "volumeNumber", paths.volumes);
  const volumeIsbn = column(tables.volumes, "isbn", paths.volumes);
  const volumeRelease = column(tables.volumes, "releaseDate", paths.volumes);
  const volumeEdition = column(tables.volumes, "editionKind", paths.volumes);
  const representative = column(tables.volumes, "isRepresentative", paths.volumes);
  const candidateId = column(tables.candidates, "candidateId", paths.candidates);
  const candidateTitle = column(tables.candidates, "canonicalTitleJa", paths.candidates);
  const candidateCreators = column(tables.candidates, "creatorsJa", paths.candidates);
  const candidateYear = column(tables.candidates, "firstPublishedYear", paths.candidates);
  const membershipCandidate = column(tables.memberships, "candidateId", paths.memberships);
  const membershipSourceItem = column(tables.memberships, "sourceItemId", paths.memberships);
  const isbnOwners = new Map<string, string[]>();
  for (const row of tables.volumes.rows) {
    const isbn = normalizeIsbn(row[volumeIsbn]!);
    if (isbn === "") continue;
    const owners = isbnOwners.get(isbn) ?? [];
    owners.push(row[volumeWork]!);
    isbnOwners.set(isbn, owners);
  }

  const sourceItemsByCandidate = new Map<string, Set<string>>();
  for (const row of tables.memberships.rows) {
    const id = row[membershipCandidate]!;
    const sourceItems = sourceItemsByCandidate.get(id) ?? new Set<string>();
    sourceItems.add(row[membershipSourceItem]!);
    sourceItemsByCandidate.set(id, sourceItems);
  }

  const evidenceByWork = new Map<string, ReturnType<typeof resolveRepresentativeVolumeDecision>>();
  for (const decision of decisions) {
    const work = oneRow(tables.works, paths.works, "id", decision.workId);
    if (work[libraryOnly] !== "true" && work[recommendationEligible] !== "true") {
      throw new Error(`${decision.workId} is neither libraryOnly nor recommendationEligible`);
    }
    const volume = oneRow(tables.volumes, paths.volumes, "workId", decision.workId);
    if (volume[volumeEdition] !== "standard" || volume[representative] !== "true") {
      throw new Error(`${decision.workId} representative edition conflicts with the repair`);
    }
    const candidate = oneRow(
      tables.candidates,
      paths.candidates,
      "candidateId",
      decision.candidateId,
    );
    assertRepresentativeDecisionIdentity(decision, {
      workId: decision.workId,
      candidateId: candidate[candidateId]!,
      canonicalTitleJa: candidate[candidateTitle]!,
      creatorsJa: candidate[candidateCreators]!,
    });
    if (
      work[workTitle] !== decision.canonicalTitleJa ||
      work[workCreators] !== decision.creatorsJa
    ) {
      throw new Error(`Representative-volume source identity changed: ${decision.workId}`);
    }
    const sourceItems = sourceItemsByCandidate.get(candidate[candidateId]!);
    if (sourceItems === undefined || sourceItems.size === 0) {
      throw new Error(`${decision.workId} has no source membership for Rakuten verification`);
    }
    const resolved = resolveRepresentativeVolumeDecision(
      decision,
      scopedCacheHits(records, sourceItems),
    );
    const currentDates = parseRakutenSalesDate(resolved.current.item.salesDate);
    const auditedDates = parseRakutenSalesDate(resolved.audited.item.salesDate);
    const currentVolumeNumber = parseRakutenVolumeNumber(resolved.current.item.title);
    assertAllowed(
      work[workYear]!,
      [candidate[candidateYear]!, currentVolumeNumber === 1 ? currentDates.salesYear : ""],
      `${decision.workId} firstPublishedYear`,
    );
    assertAllowed(
      work[workPublisher]!,
      [resolved.current.item.publisherName.trim(), resolved.audited.item.publisherName.trim()],
      `${decision.workId} publisher`,
    );
    assertAllowed(
      work[workDemographic]!,
      [
        deriveRakutenDemographic(resolved.current.item.booksGenreId),
        deriveRakutenDemographic(resolved.audited.item.booksGenreId),
      ],
      `${decision.workId} demographic`,
    );
    assertAllowed(
      normalizeIsbn(volume[volumeIsbn]!),
      [decision.currentIsbn, decision.auditedIsbn],
      `${decision.workId} ISBN`,
    );
    assertAllowed(
      volume[volumeNumber]!,
      [currentVolumeNumber === undefined ? "" : String(currentVolumeNumber), "1"],
      `${decision.workId} volumeNumber`,
    );
    assertAllowed(
      volume[volumeRelease]!,
      [currentDates.releaseDate, auditedDates.releaseDate],
      `${decision.workId} releaseDate`,
    );
    const foreignOwners = (isbnOwners.get(decision.auditedIsbn) ?? []).filter(
      (owner) => owner !== decision.workId,
    );
    if (foreignOwners.length > 0) {
      throw new Error(`${decision.workId} audited ISBN conflicts with ${foreignOwners.join(",")}`);
    }
    evidenceByWork.set(decision.workId, resolved);
  }

  let duplicateBlocked = 0;
  let duplicateResolved = 0;
  for (const block of DUPLICATE_BLOCKS) {
    const loserWorks = tables.works.rows.filter((row) => row[workId] === block.workId);
    const loserVolumes = tables.volumes.rows.filter((row) => row[volumeWork] === block.workId);
    const ownerWork = oneRow(tables.works, paths.works, "id", block.ownerWorkId);
    const ownerVolume = oneRow(tables.volumes, paths.volumes, "workId", block.ownerWorkId);
    if (
      (ownerWork[libraryOnly] !== "true" && ownerWork[recommendationEligible] !== "true") ||
      normalizeIsbn(ownerVolume[volumeIsbn]!) !== block.proposedIsbn ||
      ownerVolume[volumeNumber] !== "1" ||
      ownerVolume[volumeEdition] !== "standard" ||
      ownerVolume[representative] !== "true"
    ) {
      throw new Error(`${block.ownerWorkId} is not the audited standard volume-1 owner`);
    }
    if (loserWorks.length === 0 && loserVolumes.length === 0) {
      duplicateResolved += 1;
      continue;
    }
    if (
      loserWorks.length !== 1 ||
      loserVolumes.length !== 1 ||
      loserWorks[0]?.[libraryOnly] !== "true" ||
      normalizeIsbn(loserVolumes[0]?.[volumeIsbn] ?? "") !== block.currentIsbn ||
      loserVolumes[0]?.[volumeNumber] === "1" ||
      loserVolumes[0]?.[volumeEdition] !== "standard" ||
      loserVolumes[0]?.[representative] !== "true"
    ) {
      throw new Error(
        `${block.workId} duplicate blocker no longer has the audited identity collision`,
      );
    }
    duplicateBlocked += 1;
  }

  const volumeByWork = new Map(tables.volumes.rows.map((row) => [row[volumeWork]!, row]));
  const targets = tables.works.rows
    .filter((row) => row[libraryOnly] === "true" || row[recommendationEligible] === "true")
    .map((row) => row[workId]!)
    .filter((id) => volumeByWork.get(id)?.[volumeNumber] !== "1");
  const blockedIds = new Set<string>(DUPLICATE_BLOCKS.map((block) => block.workId));
  const unsupported = targets.filter((id) => !decisionIds.has(id) && !blockedIds.has(id));
  if (unsupported.length < EXPECTED_UNSUPPORTED_COUNT) {
    throw new Error(`Audited unsupported representative count regressed: ${unsupported.length}`);
  }

  return {
    decisions,
    tables,
    evidenceByWork,
    unsupported,
    duplicateBlocked,
    duplicateResolved,
  };
}

function prepare(root: string) {
  const analysis = analyze(root);
  const { decisions, tables, evidenceByWork } = analysis;
  const { paths } = tables;
  const works = cloneTable(tables.works);
  const volumes = cloneTable(tables.volumes);
  const evidence = cloneTable(tables.evidence);
  const matches = cloneTable(tables.matches);
  const mappings = cloneTable(tables.mappings);
  const workPublisher = column(works, "publisher", paths.works);
  const workDemographic = column(works, "demographic", paths.works);
  const workYear = column(works, "firstPublishedYear", paths.works);
  const candidateYear = column(tables.candidates, "firstPublishedYear", paths.candidates);
  const volumeNumber = column(volumes, "volumeNumber", paths.volumes);
  const volumeIsbn = column(volumes, "isbn", paths.volumes);
  const releaseDate = column(volumes, "releaseDate", paths.volumes);
  const matchIsbn = column(matches, "isbn", paths.matches);
  const matchedTitle = column(matches, "matchedTitle", paths.matches);
  const matchEdition = column(matches, "editionKind", paths.matches);
  const matchRepresentative = column(matches, "isRepresentative", paths.matches);
  const matchStatus = column(matches, "matchStatus", paths.matches);
  const matchUrl = column(matches, "sourceUrl", paths.matches);
  const matchNotes = column(matches, "notes", paths.matches);
  const evidenceSourceType = column(evidence, "sourceType", paths.evidence);
  const evidenceExtractorVersion = column(evidence, "extractorVersion", paths.evidence);
  const evidenceUrl = column(evidence, "sourceUrl", paths.evidence);
  const evidenceNotes = column(evidence, "notes", paths.evidence);
  const mappingWork = column(mappings, "workId", paths.mappings);
  const mappingNotes = column(mappings, "notes", paths.mappings);
  let mappingRows = 0;

  for (const decision of decisions) {
    const cache = evidenceByWork.get(decision.workId)!;
    const auditedDates = parseRakutenSalesDate(cache.audited.item.salesDate);
    const work = oneRow(works, paths.works, "id", decision.workId);
    const candidate = oneRow(
      tables.candidates,
      paths.candidates,
      "candidateId",
      decision.candidateId,
    );
    work[workPublisher] = cache.audited.item.publisherName.trim();
    work[workDemographic] = deriveRakutenDemographic(cache.audited.item.booksGenreId);
    work[workYear] = candidate[candidateYear]!;

    const volume = oneRow(volumes, paths.volumes, "workId", decision.workId);
    volume[volumeNumber] = "1";
    volume[volumeIsbn] = decision.auditedIsbn;
    volume[releaseDate] = auditedDates.releaseDate;

    const match = oneRow(matches, paths.matches, "candidateId", decision.candidateId);
    const currentTuple = [
      decision.currentIsbn,
      cache.current.item.title,
      cache.current.item.itemUrl,
    ].join("\u0000");
    const auditedTuple = [
      decision.auditedIsbn,
      cache.audited.item.title,
      cache.audited.item.itemUrl,
    ].join("\u0000");
    if (
      match[matchStatus] !== "matched" ||
      match[matchEdition] !== "standard" ||
      match[matchRepresentative] !== "true" ||
      ![currentTuple, auditedTuple].includes(
        [normalizeIsbn(match[matchIsbn]!), match[matchedTitle]!, match[matchUrl]!].join("\u0000"),
      )
    ) {
      throw new Error(`${decision.workId} staging match conflicts with the audited cache items`);
    }
    match[matchIsbn] = decision.auditedIsbn;
    match[matchedTitle] = cache.audited.item.title;
    match[matchUrl] = cache.audited.item.itemUrl;
    match[matchNotes] =
      `Exact normalized title, creator overlap, valid ISBN, standard edition, and Rakuten manga genre ${cache.audited.item.booksGenreId}.`;

    const evidenceRow = oneRow(
      evidence,
      paths.evidence,
      "id",
      `ev-rakuten-library-${decision.workId}`,
    );
    if (
      evidenceRow[evidenceSourceType] !== "model" ||
      evidenceRow[evidenceExtractorVersion] !== "community-promotion-v4"
    ) {
      if (
        evidenceRow[evidenceSourceType] !== "rakuten" ||
        ![cache.current.item.itemUrl, cache.audited.item.itemUrl].includes(
          evidenceRow[evidenceUrl]!,
        ) ||
        ![decision.currentIsbn, decision.auditedIsbn].some((isbn) =>
          evidenceRow[evidenceNotes]!.includes(isbn),
        )
      ) {
        throw new Error(
          `${decision.workId} source evidence conflicts with the audited representative`,
        );
      }
      evidenceRow[evidenceUrl] = cache.audited.item.itemUrl;
      evidenceRow[evidenceNotes] =
        `Rakuten Books matched representative ISBN ${decision.auditedIsbn}; bibliographic promotion only; taste factors remain unknown and annotations are unreviewed.`;
    }

    const rows = mappings.rows.filter((row) => row[mappingWork] === decision.workId);
    if (rows.length === 0) throw new Error(`${decision.workId} has no canonical mapping rows`);
    for (const row of rows) {
      const fields = parseNoteFields(row[mappingNotes]!);
      const existingTuple = [
        fields.get("rakutenProductUrl"),
        fields.get("matchedRakutenAuthor"),
        fields.get("isbn"),
      ].join("\u0000");
      const currentMappingTuple = [
        cache.current.item.itemUrl,
        cache.current.item.author,
        decision.currentIsbn,
      ].join("\u0000");
      const auditedMappingTuple = [
        cache.audited.item.itemUrl,
        cache.audited.item.author,
        decision.auditedIsbn,
      ].join("\u0000");
      if (![currentMappingTuple, auditedMappingTuple].includes(existingTuple)) {
        throw new Error(
          `${decision.workId} canonical mapping conflicts with the audited representative`,
        );
      }
      fields.set("rakutenProductUrl", cache.audited.item.itemUrl);
      fields.set("matchedRakutenAuthor", cache.audited.item.author);
      fields.set("isbn", decision.auditedIsbn);
      const nextNotes = serializeNoteFields(fields);
      if (row[mappingNotes] !== nextNotes) mappingRows += 1;
      row[mappingNotes] = nextNotes;
    }
  }

  const candidateOutputs = new Map<string, string>([
    [CHANGED_FILES[0], serializeCsv(works)],
    [CHANGED_FILES[1], serializeCsv(volumes)],
    [CHANGED_FILES[2], serializeCsv(evidence)],
    [CHANGED_FILES[3], serializeCsv(matches)],
    [CHANGED_FILES[4], serializeCsv(mappings)],
  ]);
  const outputs = new Map(
    [...candidateOutputs].filter(
      ([path, content]) => readFileSync(join(root, path), "utf8") !== content,
    ),
  );
  return {
    ...analysis,
    mappingRows,
    alreadyApplied: outputs.size === 0,
    outputs,
  };
}

function validateCandidateRoot(root: string) {
  const source = runCatalogPipeline(join(root, SOURCE_DIRECTORY));
  if (hasErrors(source.issues)) {
    throw new Error(
      `Representative repair source validation failed:\n${source.issues
        .filter((issue) => issue.severity === "error")
        .map(formatSourceIssue)
        .join("\n")}`,
    );
  }
  validateCatalogExpansion(loadCatalogExpansion(join(root, STAGING_DIRECTORY)));
}

export function repairRepresentativeIsbns(mode: RepairMode = "dry-run", root = process.cwd()) {
  const resolvedRoot = resolve(root);
  if (!existsSync(join(resolvedRoot, SOURCE_DIRECTORY))) {
    throw new Error(`Catalog source directory does not exist: ${resolvedRoot}`);
  }
  const originalSnapshot = validationSnapshot(resolvedRoot);
  const plan = prepare(resolvedRoot);
  if (plan.alreadyApplied) {
    validateCandidateRoot(resolvedRoot);
  } else {
    const temporaryRoot = mkdtempSync(join(resolvedRoot, ".representative-isbn-repair-"));
    try {
      cpSync(join(resolvedRoot, SOURCE_DIRECTORY), join(temporaryRoot, SOURCE_DIRECTORY), {
        recursive: true,
      });
      cpSync(join(resolvedRoot, STAGING_DIRECTORY), join(temporaryRoot, STAGING_DIRECTORY), {
        recursive: true,
      });
      for (const [path, content] of plan.outputs) {
        const candidate = join(temporaryRoot, path);
        mkdirSync(dirname(candidate), { recursive: true });
        writeFileSync(candidate, content, "utf8");
      }
      validateCandidateRoot(temporaryRoot);
      if (mode === "apply") {
        assertValidationSnapshot(resolvedRoot, originalSnapshot);
        publishDirectorySet(
          [...plan.outputs.keys()].map((path) => {
            const backup = join(temporaryRoot, "backups", path);
            mkdirSync(dirname(backup), { recursive: true });
            return {
              candidate: join(temporaryRoot, path),
              output: join(resolvedRoot, path),
              backup,
            };
          }),
        );
      }
    } finally {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  }
  return {
    mode,
    alreadyApplied: plan.alreadyApplied,
    replacements: plan.decisions.filter((decision) => decision.decisionKind === "isbn-replacement")
      .length,
    volumeCorrections: plan.decisions.filter(
      (decision) => decision.decisionKind === "volume-one-correction",
    ).length,
    unsupported: EXPECTED_UNSUPPORTED_COUNT,
    additionalUnsupported: plan.unsupported.length - EXPECTED_UNSUPPORTED_COUNT,
    duplicateBlocked: plan.duplicateBlocked,
    duplicateResolved: plan.duplicateResolved,
    mappingRows: plan.mappingRows,
    changedFiles: [...plan.outputs.keys()],
  };
}

function cliMode(args: readonly string[]): RepairMode {
  if (args.length === 0 || (args.length === 1 && args[0] === "--dry-run")) return "dry-run";
  if (args.length === 1 && args[0] === "--apply") return "apply";
  throw new Error("Usage: tsx scripts/repair-representative-isbns.ts [--dry-run|--apply]");
}

const invokedPath = process.argv[1];
if (invokedPath !== undefined && import.meta.url === pathToFileURL(resolve(invokedPath)).href) {
  const result = repairRepresentativeIsbns(cliMode(process.argv.slice(2)));
  const verb = result.alreadyApplied
    ? "already repaired"
    : result.mode === "apply"
      ? "repaired"
      : "would repair";
  console.log(
    `${verb}: ${result.replacements} ISBN replacements, ${result.volumeCorrections} volume corrections, ${result.unsupported} audited unsupported, ${result.additionalUnsupported} additional unsupported, ${result.duplicateBlocked} duplicate-blocked, ${result.duplicateResolved} duplicate-resolved; ${result.changedFiles.length} files.`,
  );
}
