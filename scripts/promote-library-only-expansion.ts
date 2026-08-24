import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import { AXIS_IDS } from "../src/domain/catalog/constants";
import {
  createExternalWorkKey,
  isbnIdentityKey,
  isValidIsbn,
  normalizeIsbn,
} from "../src/domain/catalog/normalize";
import { catalogAssetFilename } from "../src/lib/catalog-asset";
import { runCatalogPipeline } from "./catalog/pipeline";
import {
  assertRepresentativeDecisionIdentity,
  resolveRepresentativeVolumeDecision,
  type RepresentativeVolumeDecision,
} from "./catalog/representative-volume-decisions";
import { formatSourceIssue } from "./catalog/report";
import { publishDirectorySet } from "./promote-g2-catalog";
import {
  loadCatalogExpansion,
  runCatalogExpansionValidation,
  validateGoldSet,
} from "./validate-catalog-expansion";

const CACHE_FILE = "rakuten-search-results.jsonl";
const GOLD_MANIFEST_FILE = "gold-set-manifest.json";
const EXTRACTOR_VERSION = "library-only-expansion-v1";
const MINIMUM_CATALOG_WORKS = 1_000;

export function assertMinimumCatalogSize(workCount: number): void {
  if (workCount < MINIMUM_CATALOG_WORKS) {
    throw new Error(
      `Catalog expansion requires at least ${MINIMUM_CATALOG_WORKS} works; received ${workCount}`,
    );
  }
}

const WORK_HEADERS = [
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
] as const;
const VOLUME_HEADERS = [
  "id",
  "workId",
  "volumeNumber",
  "isbn",
  "releaseDate",
  "editionKind",
  "isRepresentative",
  "evidenceId",
] as const;
const FACTOR_HEADERS = ["workId", "axisId", "state", "value", "confidence", "evidenceId"] as const;
const EVIDENCE_HEADERS = [
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
] as const;
const ALIAS_HEADERS = ["workId", "alias"] as const;
const THEME_HEADERS = ["workId", "themeId", "centrality", "confidence", "evidenceId"] as const;
const CONTEXT_HEADERS = [
  "workId",
  "catalogRole",
  "seriesGroupId",
  "volumeCount",
  "reviewAverage",
  "reviewCount",
] as const;
const ART_HEADERS = [
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
] as const;

const cacheItemSchema = z.strictObject({
  title: z.string().min(1),
  author: z.string(),
  publisherName: z.string(),
  isbn: z.string(),
  booksGenreId: z.string(),
  salesDate: z.string(),
  itemUrl: z.url(),
});
const cacheRecordSchema = z
  .strictObject({
    queryKey: z.string().min(1),
    queryTitle: z.string().min(1),
    sourceItemIds: z.array(z.string()).min(1),
    retrievedAt: z.iso.date(),
    outcome: z.enum(["ok", "invalid-query"]),
    responseSha256: z.string().regex(/^[a-f0-9]{64}$/u),
    items: z.array(cacheItemSchema),
  })
  .superRefine((record, context) => {
    if (record.outcome === "invalid-query" && record.items.length > 0) {
      context.addIssue({
        code: "custom",
        path: ["items"],
        message: "An invalid-query cache record cannot contain Rakuten items",
      });
    }
  });
const cacheRecordsSchema = z.array(cacheRecordSchema).min(1);
const matrixSchema = z.array(z.array(z.string()));
const confidenceSchema = z
  .string()
  .regex(/^(?:0(?:\.\d+)?|1(?:\.0+)?)$/u)
  .transform(Number);

type ExpansionData = ReturnType<typeof loadCatalogExpansion>;
type Candidate = ExpansionData["candidates"][number];
type RakutenMatch = ExpansionData["rakutenMatches"][number];
type CacheRecord = z.infer<typeof cacheRecordSchema>;
type CacheItem = z.infer<typeof cacheItemSchema>;
type CsvRecord = Record<string, string>;
type CsvTable = { headers: string[]; rows: string[][] };

export type LibraryOnlyBuildInput = {
  candidate: Pick<
    Candidate,
    | "candidateId"
    | "canonicalTitleJa"
    | "titleKana"
    | "creatorsJa"
    | "firstPublishedYear"
    | "publicationStatus"
  >;
  workId: string;
  match: Pick<
    RakutenMatch,
    "matchStatus" | "isbn" | "matchedTitle" | "editionKind" | "isRepresentative" | "sourceUrl"
  >;
  cacheRecord: Pick<CacheRecord, "retrievedAt">;
  cacheItem: CacheItem;
  confidence: string;
  representativeDecision?: RepresentativeVolumeDecision;
};

export type LibraryOnlyRows = ReturnType<typeof buildLibraryOnlyRows>;

type PromotionPlan = {
  workId: string;
  rows: LibraryOnlyRows;
};

type SourceTables = {
  works: CsvTable;
  aliases: CsvTable;
  volumes: CsvTable;
  factors: CsvTable;
  themes: CsvTable;
  context: CsvTable;
  evidence: CsvTable;
  art: CsvTable;
};

function sha256(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

function codeUnitCompare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function canonicalText(value: string, label: string) {
  const canonical = value.trim();
  if (canonical === "") throw new Error(`${label} is empty`);
  return canonical;
}

function creatorList(value: string) {
  const creators = value.split(";").map((creator) => creator.trim());
  if (creators.length === 0 || creators.some((creator) => creator === "")) {
    throw new Error("Candidate creators must be a non-empty semicolon-separated list");
  }
  return creators;
}

function validCalendarDate(year: number, month: number, day: number) {
  if (year < 1800 || year > 2200 || month < 1 || month > 12 || day < 1) return false;
  return day <= new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function parseRakutenSalesDate(value: string) {
  const normalized = value.normalize("NFKC").trim();
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(normalized);
  const japanese = /^(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日\s*(頃)?$/u.exec(normalized);
  const full = iso ?? japanese;
  if (full !== null) {
    const year = Number(full[1]);
    const month = Number(full[2]);
    const day = Number(full[3]);
    if (validCalendarDate(year, month, day)) {
      if (japanese?.[4] !== undefined) {
        return { salesYear: String(year), releaseDate: "" };
      }
      const releaseDate = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return { salesYear: String(year), releaseDate };
    }
    return { salesYear: "", releaseDate: "" };
  }

  const approximate =
    /^(\d{4})\s*年(?:\s*(?:頃|\d{1,2}\s*月(?:\s*(?:上旬|中旬|下旬|頃))?))?$/u.exec(normalized);
  if (approximate !== null) {
    const year = Number(approximate[1]);
    if (year >= 1800 && year <= 2200) {
      return { salesYear: String(year), releaseDate: "" };
    }
  }
  return { salesYear: "", releaseDate: "" };
}

export function parseRakutenVolumeNumber(title: string) {
  const match = title
    .normalize("NFKC")
    .match(/(?:[（(]\s*0*(\d{1,3})\s*[)）]|第?\s*0*(\d{1,3})\s*巻|\s0*(\d{1,3}))\s*$/u);
  const value = Number(match?.[1] ?? match?.[2] ?? match?.[3]);
  return Number.isInteger(value) && value > 0 ? value : undefined;
}

export function deriveRakutenDemographic(booksGenreId: string) {
  const mappings = {
    "001001001": "shonen",
    "001001002": "shojo",
    "001001003": "seinen",
    "001001004": "josei",
  } as const;
  const demographics = new Set(
    booksGenreId
      .split("/")
      .map((genreId) => genreId.trim())
      .flatMap((genreId) => {
        const prefix = Object.keys(mappings).find((candidate) => genreId.startsWith(candidate));
        return prefix === undefined ? [] : [mappings[prefix as keyof typeof mappings]];
      }),
  );
  return demographics.size === 1 ? ([...demographics][0] ?? "unknown") : "unknown";
}

function assertMatchedCacheItem(input: LibraryOnlyBuildInput) {
  const isbn = normalizeIsbn(input.match.isbn);
  if (
    input.match.matchStatus !== "matched" ||
    input.match.isRepresentative !== "true" ||
    input.match.editionKind !== "standard"
  ) {
    throw new Error(
      `Library-only promotion requires one representative standard match: ${input.workId}`,
    );
  }
  if (!isValidIsbn(isbn) || isbnIdentityKey(input.cacheItem.isbn) !== isbnIdentityKey(isbn)) {
    throw new Error(`Matched ISBN is invalid or disagrees with the Rakuten cache: ${input.workId}`);
  }
  if (
    input.match.matchedTitle !== input.cacheItem.title ||
    input.match.sourceUrl === "" ||
    new URL(input.match.sourceUrl).href !== new URL(input.cacheItem.itemUrl).href
  ) {
    throw new Error(`Rakuten match metadata disagrees with the cached item: ${input.workId}`);
  }
  return isbn;
}

export function buildLibraryOnlyRows(input: LibraryOnlyBuildInput) {
  const workId = canonicalText(input.workId, "workId");
  const title = canonicalText(input.candidate.canonicalTitleJa, "candidate title");
  const creators = creatorList(input.candidate.creatorsJa);
  const confidence = String(confidenceSchema.parse(input.confidence));
  const isbn = assertMatchedCacheItem(input);
  const evidenceId = `ev-rakuten-library-${workId}`;
  const volumeId = `${workId}-representative`;
  const dates = parseRakutenSalesDate(input.cacheItem.salesDate);
  if (input.representativeDecision !== undefined) {
    assertRepresentativeDecisionIdentity(input.representativeDecision, {
      workId,
      candidateId: input.candidate.candidateId,
      canonicalTitleJa: title,
      creatorsJa: input.candidate.creatorsJa,
    });
    if (isbn !== input.representativeDecision.auditedIsbn) {
      throw new Error(`Audited representative ISBN changed: ${workId}`);
    }
  }
  const volumeNumber =
    input.representativeDecision === undefined
      ? parseRakutenVolumeNumber(input.match.matchedTitle)
      : 1;

  const work = {
    id: workId,
    title,
    titleKana: input.candidate.titleKana.trim(),
    creators: creators.join(";"),
    publisher: input.cacheItem.publisherName.trim(),
    demographic: deriveRakutenDemographic(input.cacheItem.booksGenreId),
    status: input.candidate.publicationStatus,
    firstPublishedYear: input.candidate.firstPublishedYear,
    genres: "",
    factorScope: "entry_1_3_volumes",
    onboardingEligible: "false",
    recommendationEligible: "false",
    libraryOnly: "true",
    metadataConfidence: confidence,
    groupingConfidence: confidence,
    sourceAgreement: confidence,
    annotationReviewMethod: "unreviewed",
    annotationReviewedAt: "",
    annotationReviewReference: "",
    evidenceId,
  } satisfies CsvRecord;
  const volume = {
    id: volumeId,
    workId,
    volumeNumber: volumeNumber === undefined ? "" : String(volumeNumber),
    isbn,
    releaseDate: dates.releaseDate,
    editionKind: "standard",
    isRepresentative: "true",
    evidenceId,
  } satisfies CsvRecord;
  const factors = AXIS_IDS.map(
    (axisId) =>
      ({
        workId,
        axisId,
        state: "unknown",
        value: "",
        confidence: "",
        evidenceId,
      }) satisfies CsvRecord,
  );
  const evidence = {
    id: evidenceId,
    workId,
    targetType: "work",
    targetId: workId,
    sourceType: "rakuten",
    sourceUrl: input.cacheItem.itemUrl,
    fetchedAt: `${input.cacheRecord.retrievedAt}T00:00:00+09:00`,
    extractorVersion: EXTRACTOR_VERSION,
    reviewedByHuman: "false",
    confidence,
    notes: `Rakuten Books matched representative ISBN ${isbn}; bibliographic promotion only; taste factors remain unknown and annotations are unreviewed.`,
  } satisfies CsvRecord;
  return { work, volume, factors, evidence };
}

function parseCsvTable(path: string, expectedHeaders: readonly string[]): CsvTable {
  const matrix = matrixSchema.parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }),
  );
  const [headers, ...rows] = matrix;
  if (headers === undefined || headers.join("\u0000") !== expectedHeaders.join("\u0000")) {
    throw new Error(`Unexpected CSV header: ${path}`);
  }
  if (rows.some((row) => row.length !== headers.length)) {
    throw new Error(`Unexpected CSV column count: ${path}`);
  }
  return { headers, rows };
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeCsv(headers: readonly string[], rows: readonly (readonly string[])[]) {
  return `${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function recordToRow(headers: readonly string[], record: CsvRecord) {
  return headers.map((header) => {
    const value = record[header];
    if (value === undefined) throw new Error(`Generated row is missing ${header}`);
    return value;
  });
}

function readSourceTables(sourceDirectory: string): SourceTables {
  return {
    works: parseCsvTable(join(sourceDirectory, "works.csv"), WORK_HEADERS),
    aliases: parseCsvTable(join(sourceDirectory, "aliases.csv"), ALIAS_HEADERS),
    volumes: parseCsvTable(join(sourceDirectory, "volumes.csv"), VOLUME_HEADERS),
    factors: parseCsvTable(join(sourceDirectory, "factors.csv"), FACTOR_HEADERS),
    themes: parseCsvTable(join(sourceDirectory, "themes.csv"), THEME_HEADERS),
    context: parseCsvTable(join(sourceDirectory, "recommendation-context.csv"), CONTEXT_HEADERS),
    evidence: parseCsvTable(join(sourceDirectory, "evidence/evidence.csv"), EVIDENCE_HEADERS),
    art: parseCsvTable(join(sourceDirectory, "evidence/art-evidence-manifest.csv"), ART_HEADERS),
  };
}

function rowsFor(table: CsvTable, column: string, value: string) {
  const index = table.headers.indexOf(column);
  if (index < 0) throw new Error(`Missing ${column} column`);
  return table.rows.filter((row) => row[index] === value);
}

function assertSeedFields(
  actual: readonly string[][],
  expected: readonly string[],
  headers: readonly string[],
  fields: readonly string[],
  label: string,
) {
  if (actual.length !== 1) {
    throw new Error(`Committed library-only seed row is missing or duplicated: ${label}`);
  }
  for (const field of fields) {
    const index = headers.indexOf(field);
    if (index < 0 || actual[0]![index] !== expected[index]) {
      throw new Error(
        `Committed library-only seed identity changed: ${label}/${field} (${JSON.stringify(actual[0]?.[index])} !== ${JSON.stringify(expected[index])})`,
      );
    }
  }
}

function assertCommittedPlan(plan: PromotionPlan, source: SourceTables) {
  assertSeedFields(
    rowsFor(source.works, "id", plan.workId),
    recordToRow(WORK_HEADERS, plan.rows.work),
    source.works.headers,
    ["id", "title", "creators", "evidenceId"],
    `${plan.workId}/works.csv`,
  );
  assertSeedFields(
    rowsFor(source.volumes, "id", plan.rows.volume.id),
    recordToRow(VOLUME_HEADERS, plan.rows.volume),
    source.volumes.headers,
    ["id", "workId", "isbn", "isRepresentative"],
    `${plan.workId}/volumes.csv`,
  );
  const factorAxisIndex = tableIndex(source.factors, "axisId");
  const factorAxes = rowsFor(source.factors, "workId", plan.workId)
    .map((row) => row[factorAxisIndex]!)
    .sort(codeUnitCompare);
  if (
    factorAxes.length !== AXIS_IDS.length ||
    new Set(factorAxes).size !== AXIS_IDS.length ||
    JSON.stringify(factorAxes) !== JSON.stringify([...AXIS_IDS].sort(codeUnitCompare))
  ) {
    throw new Error(`Committed library-only Factor matrix changed shape: ${plan.workId}`);
  }
  assertSeedFields(
    rowsFor(source.evidence, "id", plan.rows.evidence.id),
    recordToRow(EVIDENCE_HEADERS, plan.rows.evidence),
    source.evidence.headers,
    ["id", "workId", "targetType", "targetId", "sourceType", "sourceUrl"],
    `${plan.workId}/evidence.csv`,
  );
}

export function parseRakutenCacheContent(input: string) {
  const content = input.replace(/^\uFEFF/u, "");
  const lines = content.split(/\r?\n/u).filter((line) => line !== "");
  const records = cacheRecordsSchema.parse(
    lines.map((line, index) => {
      try {
        return JSON.parse(line) as unknown;
      } catch (error) {
        throw new Error(
          `Invalid Rakuten cache JSON at line ${index + 1}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }),
  );
  const queryKeys = new Set<string>();
  for (const record of records) {
    if (queryKeys.has(record.queryKey))
      throw new Error(`Duplicate Rakuten queryKey: ${record.queryKey}`);
    queryKeys.add(record.queryKey);
    if (
      record.responseSha256 !==
      sha256(`${JSON.stringify({ outcome: record.outcome, items: record.items })}\n`)
    ) {
      throw new Error(`Rakuten cache response hash mismatch: ${record.queryKey}`);
    }
  }
  return records;
}

function readCache(path: string) {
  return parseRakutenCacheContent(readFileSync(path, "utf8"));
}

function cacheItemForMatch(
  records: readonly CacheRecord[],
  match: RakutenMatch,
  sourceItemIds: ReadonlySet<string>,
) {
  if (match.sourceUrl === "")
    throw new Error(`Matched Rakuten row has no source URL: ${match.candidateId}`);
  const isbnKey = isbnIdentityKey(match.isbn);
  const sourceUrl = new URL(match.sourceUrl).href;
  const found = records.flatMap((record) =>
    (record.outcome === "ok" && record.sourceItemIds.some((id) => sourceItemIds.has(id))
      ? record.items
      : []
    )
      .filter(
        (item) =>
          isbnIdentityKey(item.isbn) === isbnKey && new URL(item.itemUrl).href === sourceUrl,
      )
      .map((item) => ({ record, item })),
  );
  const unique = new Map(
    found.map((entry) => [
      JSON.stringify({ retrievedAt: entry.record.retrievedAt, item: entry.item }),
      entry,
    ]),
  );
  if (unique.size !== 1) {
    throw new Error(
      `Representative ISBN must resolve to exactly one cached Rakuten item: ${match.candidateId} (${unique.size})`,
    );
  }
  return unique.values().next().value!;
}

function minimumMappingConfidence(values: readonly string[]) {
  if (values.length === 0) throw new Error("Canonical mapping confidence is missing");
  return String(Math.min(...values.map((value) => confidenceSchema.parse(value))));
}

function allBibliographicGatesComplete(annotation: ExpansionData["annotationStatuses"][number]) {
  return (
    annotation.bibliographyStatus === "complete" &&
    annotation.factorStatus === "complete" &&
    annotation.themeStatus === "complete" &&
    annotation.evidenceStatus === "complete" &&
    annotation.artEvidenceStatus === "complete" &&
    annotation.reviewStatus === "unreviewed"
  );
}

function buildPromotionPlans(expansion: ExpansionData, cache: readonly CacheRecord[]) {
  const safetyByCandidate = new Map(expansion.safetyReviews.map((row) => [row.candidateId, row]));
  const annotationByCandidate = new Map(
    expansion.annotationStatuses.map((row) => [row.candidateId, row]),
  );
  const matchesByCandidate = Map.groupBy(expansion.rakutenMatches, (row) => row.candidateId);
  const mappingsByCandidate = Map.groupBy(expansion.mappings, (row) => row.candidateId);
  const decisionsByWork = new Map(
    expansion.representativeVolumeDecisions.map((decision) => [decision.workId, decision]),
  );
  const consumedDecisions = new Set<string>();
  const plans: PromotionPlan[] = [];

  for (const candidate of [...expansion.candidates].sort((left, right) =>
    codeUnitCompare(left.candidateId, right.candidateId),
  )) {
    const annotation = annotationByCandidate.get(candidate.candidateId);
    if (
      annotation === undefined ||
      !allBibliographicGatesComplete(annotation) ||
      safetyByCandidate.get(candidate.candidateId)?.safetyStatus !== "safe"
    ) {
      continue;
    }
    const representative = (matchesByCandidate.get(candidate.candidateId) ?? []).filter(
      (match) => match.matchStatus === "matched" && match.isRepresentative === "true",
    );
    if (representative.length === 0) continue;
    if (representative.length !== 1) {
      throw new Error(
        `Candidate has multiple representative matched ISBNs: ${candidate.candidateId}`,
      );
    }
    const match = representative[0]!;
    const workId = canonicalText(
      annotation.workId,
      `annotation workId for ${candidate.candidateId}`,
    );
    const mappings = mappingsByCandidate.get(candidate.candidateId) ?? [];
    if (
      mappings.length === 0 ||
      !mappings.some((mapping) => mapping.mappingType === "included") ||
      mappings.some(
        (mapping) =>
          mapping.workId !== workId || mapping.canonicalTitleJa !== candidate.canonicalTitleJa,
      )
    ) {
      throw new Error(
        `Canonical mappings do not bind candidate ${candidate.candidateId} to ${workId}`,
      );
    }
    const cached = cacheItemForMatch(
      cache,
      match,
      new Set(mappings.map((mapping) => mapping.sourceItemId)),
    );
    const representativeDecision = decisionsByWork.get(workId);
    if (representativeDecision !== undefined) {
      const sourceItemIds = new Set(mappings.map((mapping) => mapping.sourceItemId));
      const audited = resolveRepresentativeVolumeDecision(
        representativeDecision,
        cache.flatMap((record) =>
          record.sourceItemIds.some((sourceItemId) => sourceItemIds.has(sourceItemId))
            ? record.items.map((item) => ({ responseSha256: record.responseSha256, item }))
            : [],
        ),
      ).audited.item;
      if (JSON.stringify(audited) !== JSON.stringify(cached.item)) {
        throw new Error(`Rakuten match does not select the audited representative: ${workId}`);
      }
      consumedDecisions.add(workId);
    }
    plans.push({
      workId,
      rows: buildLibraryOnlyRows({
        candidate,
        workId,
        match,
        cacheRecord: cached.record,
        cacheItem: cached.item,
        confidence: minimumMappingConfidence(mappings.map((mapping) => mapping.confidence)),
        representativeDecision,
      }),
    });
  }
  if (consumedDecisions.size !== expansion.representativeVolumeDecisions.length) {
    const missing = expansion.representativeVolumeDecisions
      .filter((decision) => !consumedDecisions.has(decision.workId))
      .map((decision) => decision.workId);
    throw new Error(`Representative-volume decisions are not library-ready: ${missing.join(",")}`);
  }
  if (plans.length === 0)
    throw new Error("No library-only expansion candidates satisfy every gate");
  return plans;
}

function tableIndex(table: CsvTable, column: string) {
  const index = table.headers.indexOf(column);
  if (index < 0) throw new Error(`Missing ${column} column`);
  return index;
}

function assertInternalPlanUniqueness(plans: readonly PromotionPlan[]) {
  const seen = new Map<string, string>();
  const claim = (kind: string, value: string, workId: string) => {
    const key = `${kind}\u0000${value}`;
    const owner = seen.get(key);
    if (owner !== undefined) throw new Error(`Promotion ${kind} collision: ${owner} / ${workId}`);
    seen.set(key, workId);
  };
  for (const plan of plans) {
    claim("workId", plan.workId, plan.workId);
    claim("volumeId", plan.rows.volume.id, plan.workId);
    claim("ISBN", isbnIdentityKey(plan.rows.volume.isbn), plan.workId);
    claim("evidenceId", plan.rows.evidence.id, plan.workId);
    claim(
      "canonicalKey",
      createExternalWorkKey(plan.rows.work.title, creatorList(plan.rows.work.creators)[0]!),
      plan.workId,
    );
  }
}

function partitionPlans(
  plans: readonly PromotionPlan[],
  source: SourceTables,
  goldWorkIds: ReadonlySet<string>,
) {
  assertInternalPlanUniqueness(plans);
  const workIdIndex = tableIndex(source.works, "id");
  const workTitleIndex = tableIndex(source.works, "title");
  const workCreatorsIndex = tableIndex(source.works, "creators");
  const volumeIdIndex = tableIndex(source.volumes, "id");
  const isbnIndex = tableIndex(source.volumes, "isbn");
  const evidenceIdIndex = tableIndex(source.evidence, "id");
  const existingCanonicalKeys = new Map<string, Set<string>>();
  for (const row of source.works.rows) {
    const key = createExternalWorkKey(
      row[workTitleIndex]!,
      creatorList(row[workCreatorsIndex]!)[0]!,
    );
    const owners = existingCanonicalKeys.get(key) ?? new Set<string>();
    owners.add(row[workIdIndex]!);
    existingCanonicalKeys.set(key, owners);
  }
  const volumeIds = new Set(source.volumes.rows.map((row) => row[volumeIdIndex]!));
  const isbnKeys = new Set(source.volumes.rows.map((row) => isbnIdentityKey(row[isbnIndex]!)));
  const evidenceIds = new Set(source.evidence.rows.map((row) => row[evidenceIdIndex]!));
  const fresh: PromotionPlan[] = [];
  const committed: PromotionPlan[] = [];

  for (const plan of plans) {
    if (goldWorkIds.has(plan.workId))
      throw new Error(`Promotion collides with Gold Set: ${plan.workId}`);
    const canonicalKey = createExternalWorkKey(
      plan.rows.work.title,
      creatorList(plan.rows.work.creators)[0]!,
    );
    const conflictingOwners = [...(existingCanonicalKeys.get(canonicalKey) ?? [])].filter(
      (owner) => owner !== plan.workId,
    );
    if (conflictingOwners.length > 0) {
      throw new Error(
        `Promotion canonical key collides with existing work ${conflictingOwners.sort(codeUnitCompare).join(",")}`,
      );
    }
    const existingWorks = rowsFor(source.works, "id", plan.workId);
    if (existingWorks.length > 0) {
      assertCommittedPlan(plan, source);
      committed.push(plan);
      continue;
    }
    if (volumeIds.has(plan.rows.volume.id)) {
      throw new Error(`Promotion volume ID already exists: ${plan.rows.volume.id}`);
    }
    if (isbnKeys.has(isbnIdentityKey(plan.rows.volume.isbn))) {
      throw new Error(`Promotion ISBN already exists: ${plan.rows.volume.isbn}`);
    }
    if (evidenceIds.has(plan.rows.evidence.id)) {
      throw new Error(`Promotion evidence ID already exists: ${plan.rows.evidence.id}`);
    }
    for (const table of [
      source.aliases,
      source.volumes,
      source.factors,
      source.themes,
      source.context,
      source.evidence,
      source.art,
    ]) {
      if (rowsFor(table, "workId", plan.workId).length > 0) {
        throw new Error(
          `Promotion workId already appears in a dependent source row: ${plan.workId}`,
        );
      }
    }
    fresh.push(plan);
  }
  return { fresh, committed };
}

function appendRows(
  path: string,
  headers: readonly string[],
  additions: readonly (readonly string[])[],
) {
  const table = parseCsvTable(path, headers);
  writeFileSync(path, serializeCsv(table.headers, [...table.rows, ...additions]), "utf8");
}

function appendPlans(sourceDirectory: string, plans: readonly PromotionPlan[]) {
  const ordered = [...plans].sort((left, right) => codeUnitCompare(left.workId, right.workId));
  appendRows(
    join(sourceDirectory, "works.csv"),
    WORK_HEADERS,
    ordered.map((plan) => recordToRow(WORK_HEADERS, plan.rows.work)),
  );
  appendRows(
    join(sourceDirectory, "volumes.csv"),
    VOLUME_HEADERS,
    ordered.map((plan) => recordToRow(VOLUME_HEADERS, plan.rows.volume)),
  );
  appendRows(
    join(sourceDirectory, "factors.csv"),
    FACTOR_HEADERS,
    ordered.flatMap((plan) =>
      plan.rows.factors.map((factor) => recordToRow(FACTOR_HEADERS, factor)),
    ),
  );
  appendRows(
    join(sourceDirectory, "evidence/evidence.csv"),
    EVIDENCE_HEADERS,
    ordered.map((plan) => recordToRow(EVIDENCE_HEADERS, plan.rows.evidence)),
  );
}

function directoryDigest(directory: string) {
  const files: string[] = [];
  const visit = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true }).sort((left, right) =>
      codeUnitCompare(left.name, right.name),
    )) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile()) files.push(path);
      else throw new Error(`Unsupported source filesystem entry: ${path}`);
    }
  };
  visit(directory);
  const digest = createHash("sha256");
  for (const path of files) {
    digest.update(relative(directory, path));
    digest.update("\u0000");
    digest.update(readFileSync(path));
    digest.update("\u0000");
  }
  return digest.digest("hex");
}

function assertPipeline(sourceDirectory: string) {
  const result = runCatalogPipeline(sourceDirectory);
  const errors = result.issues.filter((issue) => issue.severity === "error");
  if (errors.length > 0) {
    for (const issue of result.issues) console.error(formatSourceIssue(issue));
    throw new Error(`Library-only source validation failed with ${errors.length} errors`);
  }
  return result;
}

function assertGeneratedArtifactsCurrent(
  root: string,
  pipeline: ReturnType<typeof runCatalogPipeline>,
) {
  const expectedCatalog = `${JSON.stringify(pipeline.catalog, null, 2)}\n`;
  const expectedContext = `${JSON.stringify(pipeline.context, null, 2)}\n`;
  const artifacts = [
    [join(root, "data/generated/catalog-v1.json"), expectedCatalog],
    [join(root, "src/data/generated/catalog-v1.json"), expectedCatalog],
    [
      join(root, "public/catalog", catalogAssetFilename(pipeline.catalog.catalogVersion)),
      expectedCatalog,
    ],
    [join(root, "data/generated/recommendation-context-v1.json"), expectedContext],
    [join(root, "src/data/generated/recommendation-context-v1.json"), expectedContext],
  ] as const;
  for (const [path, expected] of artifacts) {
    if (!existsSync(path) || readFileSync(path, "utf8") !== expected) {
      throw new Error(`Generated catalog artifact is missing or stale: ${path}`);
    }
  }
}

function parseGoldManifest(path: string) {
  return JSON.parse(readFileSync(path, "utf8")) as unknown;
}

export function runLibraryOnlyExpansion(mode: "--check" | "--write", root = process.cwd()) {
  const canonicalRoot = resolve(root);
  const sourceDirectory = join(canonicalRoot, "data/source");
  const stagingDirectory = join(canonicalRoot, "data/staging/catalog-expansion");
  const expansionValidation = runCatalogExpansionValidation(canonicalRoot);
  const expansion = loadCatalogExpansion(stagingDirectory);
  const cache = readCache(join(stagingDirectory, CACHE_FILE));
  const plans = buildPromotionPlans(expansion, cache);
  if (plans.length !== expansionValidation.summary.libraryReadyCount) {
    throw new Error(
      `Library-ready candidate count changed across validation: ${expansionValidation.summary.libraryReadyCount} / ${plans.length}`,
    );
  }
  const goldManifestInput = parseGoldManifest(join(stagingDirectory, GOLD_MANIFEST_FILE));
  const goldManifest = validateGoldSet(canonicalRoot, goldManifestInput);
  const source = readSourceTables(sourceDirectory);
  const { fresh, committed } = partitionPlans(plans, source, new Set(goldManifest.workIds));

  if (mode === "--check") {
    if (fresh.length > 0) {
      throw new Error(`${fresh.length} library-only candidates have not been committed`);
    }
    const pipeline = assertPipeline(sourceDirectory);
    assertMinimumCatalogSize(pipeline.catalog.works.length);
    assertGeneratedArtifactsCurrent(canonicalRoot, pipeline);
    return {
      mode,
      expectedCount: plans.length,
      committedCount: committed.length,
      catalogVersion: pipeline.catalog.catalogVersion,
    };
  }

  if (fresh.length === 0) throw new Error("No new library-only source rows need promotion");
  const sourceDigest = directoryDigest(sourceDirectory);
  const stagingDigest = directoryDigest(stagingDirectory);
  const transactionRoot = mkdtempSync(join(dirname(sourceDirectory), ".library-only-expansion-"));
  const nextSource = join(transactionRoot, "data/source");
  const backupSource = join(transactionRoot, "source-backup");
  try {
    mkdirSync(dirname(nextSource), { recursive: true });
    cpSync(sourceDirectory, nextSource, { recursive: true });
    appendPlans(nextSource, fresh);
    const nextTables = readSourceTables(nextSource);
    for (const plan of plans) assertCommittedPlan(plan, nextTables);
    const pipeline = assertPipeline(nextSource);
    assertMinimumCatalogSize(pipeline.catalog.works.length);
    validateGoldSet(transactionRoot, goldManifestInput);
    if (
      directoryDigest(sourceDirectory) !== sourceDigest ||
      directoryDigest(stagingDirectory) !== stagingDigest
    ) {
      throw new Error("Catalog source or expansion staging changed during promotion");
    }
    publishDirectorySet([{ candidate: nextSource, output: sourceDirectory, backup: backupSource }]);
    return {
      mode,
      promotedCount: fresh.length,
      existingCount: committed.length,
      catalogVersion: pipeline.catalog.catalogVersion,
    };
  } finally {
    if (existsSync(backupSource)) {
      console.warn(`Preserved library-only promotion backup: ${backupSource}`);
    } else if (existsSync(transactionRoot) && statSync(transactionRoot).isDirectory()) {
      rmSync(transactionRoot, { recursive: true, force: true });
    }
  }
}

const invokedPath = process.argv[1];
if (invokedPath !== undefined && import.meta.url === pathToFileURL(resolve(invokedPath)).href) {
  const [mode, ...rest] = process.argv.slice(2);
  if ((mode !== "--check" && mode !== "--write") || rest.length > 0) {
    console.error("Usage: tsx scripts/promote-library-only-expansion.ts --check|--write");
    process.exitCode = 1;
  } else {
    try {
      const result = runLibraryOnlyExpansion(mode);
      console.log(JSON.stringify(result));
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  }
}
