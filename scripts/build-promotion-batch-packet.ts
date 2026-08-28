import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import { runCatalogPipeline } from "./catalog/pipeline";
import { formatSourceIssue } from "./catalog/report";
import {
  PROMOTION_BATCH_SIZE,
  PROMOTION_METHOD_POLICY,
  PROMOTION_PANEL_POLICY,
} from "./freeze-promotion-batch";
import { runCatalogExpansionValidation } from "./validate-catalog-expansion";

const PACKET_SCHEMA_VERSION = "promotion-batch-packet-v1";
const CANDIDATE_SCHEMA_VERSION = "promotion-batch-candidate-v1";
const PAYLOAD_LEDGER_FILE = "PAYLOAD.sha256";
const MANIFEST_FILE = "manifest.json";
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
const BATCH_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const WORK_ID_PATTERN = /^work-[a-f0-9]{20}$/u;

const FROZEN_HEADERS = ["position", "workId", "canonicalTitle"] as const;

function researchChunks(workCount: number) {
  return Array.from({ length: Math.ceil(workCount / 10) }, (_, index) =>
    String(index + 1).padStart(2, "0"),
  );
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
const ALIAS_HEADERS = ["workId", "alias"] as const;
const BATCH_LEDGER_HEADERS = [
  "workId",
  "batchId",
  "batchType",
  "status",
  "selectionReason",
  "methodPolicy",
  "panelPolicy",
  "lastUpdatedAt",
] as const;
const CANONICAL_MAPPING_HEADERS = [
  "mappingId",
  "sourceItemId",
  "candidateId",
  "workId",
  "mappingType",
  "canonicalTitleJa",
  "confidence",
  "evidenceName",
  "evidenceUrl",
  "evidencePublishedAt",
  "retrievedAt",
  "notes",
] as const;
const RAKUTEN_MATCH_HEADERS = [
  "rakutenMatchId",
  "candidateId",
  "matchStatus",
  "isbn",
  "matchedTitle",
  "editionKind",
  "isRepresentative",
  "sourceUrl",
  "checkedAt",
  "notes",
] as const;
const SAFETY_REVIEW_HEADERS = [
  "candidateId",
  "safetyStatus",
  "evidenceName",
  "evidenceUrl",
  "evidencePublishedAt",
  "retrievedAt",
  "reviewedAt",
  "notes",
] as const;
const SOURCE_MEMBERSHIP_HEADERS = [
  "sourceItemId",
  "sourceId",
  "status",
  "candidateId",
  "workId",
  "decisionRef",
] as const;
const SOURCE_REGISTRY_HEADERS = [
  "sourceId",
  "sourceKind",
  "organization",
  "title",
  "url",
  "publishedAt",
  "retrievedAt",
  "listNature",
  "registryStatus",
  "snapshotUrl",
  "snapshotSha256",
  "originalItemCount",
  "japaneseMangaItemCount",
  "excludedWebtoonCount",
  "excludedAdultCount",
  "excludedNonJapaneseCount",
  "excludedNonMangaCount",
  "duplicateCount",
  "canonicalMappingCount",
  "unresolvedCount",
  "notes",
] as const;

const POLICY_PATHS = {
  factorDictionary: "docs/factors/factor-dictionary.md",
  annotationGuide: "docs/factors/annotation-guide.md",
  promotionMethod: "docs/catalog-expansion/01-promotion-method.md",
} as const;

type CsvRecord = Record<string, string>;
type CsvTable = { headers: readonly string[]; rows: CsvRecord[] };
type PayloadFile = { path: string; rowCount: number; content: string };
type FrozenWork = { position: number; workId: string; canonicalTitle: string };

const payloadFileSchema = z.strictObject({
  path: z.string().min(1),
  rowCount: z.number().int().nonnegative(),
  sha256: z.string().regex(SHA256_PATTERN),
});
const policySchema = z.strictObject({
  path: z.string().min(1),
  sha256: z.string().regex(SHA256_PATTERN),
});

export const promotionBatchPacketManifestSchema = z.strictObject({
  schemaVersion: z.literal(PACKET_SCHEMA_VERSION),
  batchId: z.string().regex(BATCH_ID_PATTERN),
  packetRoot: z
    .string()
    .regex(/^data\/staging\/catalog-expansion\/batches\/[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  repository: z.strictObject({
    branch: z.string().min(1),
    headSha: z.string().regex(/^[a-f0-9]{40}$/u),
    dirty: z.boolean(),
  }),
  policies: z.strictObject({
    factorDictionary: policySchema,
    annotationGuide: policySchema,
    promotionMethod: policySchema,
  }),
  workSet: z
    .strictObject({
      count: z.number().int().min(1).max(PROMOTION_BATCH_SIZE),
      ordering: z.literal("frozen-position"),
      workIds: z.array(z.string().regex(WORK_ID_PATTERN)).min(1).max(PROMOTION_BATCH_SIZE),
      sha256: z.string().regex(SHA256_PATTERN),
      frozenWorkSetSha256: z.string().regex(SHA256_PATTERN),
    })
    .refine((workSet) => workSet.count === workSet.workIds.length, {
      message: "Work-set count differs from workIds",
    }),
  payload: z.strictObject({
    ledgerPath: z.literal(PAYLOAD_LEDGER_FILE),
    ledgerSha256: z.string().regex(SHA256_PATTERN),
    files: z.array(payloadFileSchema),
  }),
  candidateSha256: z.string().regex(SHA256_PATTERN),
});

export type PromotionBatchPacketManifest = z.infer<typeof promotionBatchPacketManifestSchema>;

export type PromotionBatchPacketArtifacts = {
  manifest: PromotionBatchPacketManifest;
  payloadFiles: readonly PayloadFile[];
  generatedFiles: ReadonlyMap<string, string>;
};

function codeUnitCompare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sha256(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

function csvCell(value: string | number) {
  const text = String(value);
  return /[",\r\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function readCsvTable(path: string, expectedHeaders: readonly string[]): CsvTable {
  const matrix = z.array(z.array(z.string())).parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }) as unknown,
  );
  const [headers, ...rows] = matrix;
  if (headers === undefined || JSON.stringify(headers) !== JSON.stringify(expectedHeaders)) {
    throw new Error(`Unexpected CSV header: ${path}`);
  }
  return {
    headers,
    rows: rows.map((row, index) => {
      if (row.length !== headers.length) {
        throw new Error(`Unexpected CSV column count: ${path}:${index + 2}`);
      }
      return Object.fromEntries(headers.map((header, column) => [header, row[column] ?? ""]));
    }),
  };
}

function serializeCsv(headers: readonly string[], rows: readonly CsvRecord[]) {
  return `${[headers, ...rows.map((row) => headers.map((header) => row[header] ?? ""))]
    .map((row) => row.map(csvCell).join(","))
    .join("\n")}\n`;
}

function compareRows(keys: readonly string[]) {
  return (left: CsvRecord, right: CsvRecord) => {
    for (const key of keys) {
      const order = codeUnitCompare(left[key] ?? "", right[key] ?? "");
      if (order !== 0) return order;
    }
    return 0;
  };
}

function canonicalSubset(input: {
  table: CsvTable;
  outputPath: string;
  include: (row: CsvRecord) => boolean;
  sortKeys: readonly string[];
}) {
  const rows = input.table.rows
    .filter(input.include)
    .sort(compareRows([...input.sortKeys, ...input.table.headers]));
  const identities = rows.map((row) => input.sortKeys.map((key) => row[key] ?? "").join("\0"));
  if (new Set(identities).size !== identities.length) {
    throw new Error(`Duplicate canonical packet row: ${input.outputPath}`);
  }
  return {
    path: input.outputPath,
    rowCount: rows.length,
    content: serializeCsv(input.table.headers, rows),
    rows,
  };
}

export function parseFrozenPromotionBatch(content: string): FrozenWork[] {
  const matrix = z
    .array(z.array(z.string()))
    .parse(
      parse(content, { bom: true, relax_column_count: false, skip_empty_lines: true }) as unknown,
    );
  const [headers, ...records] = matrix;
  if (headers === undefined || JSON.stringify(headers) !== JSON.stringify(FROZEN_HEADERS)) {
    throw new Error("Unexpected frozen work-set header");
  }
  if (records.length === 0 || records.length > PROMOTION_BATCH_SIZE) {
    throw new Error(`Frozen work set requires 1-${PROMOTION_BATCH_SIZE} works`);
  }
  const rows = records.map((record, index): FrozenWork => {
    if (record.length !== FROZEN_HEADERS.length) {
      throw new Error(`Unexpected frozen work-set column count: ${index + 2}`);
    }
    const position = Number(record[0]);
    const workId = record[1] ?? "";
    const canonicalTitle = record[2] ?? "";
    if (position !== index + 1 || !WORK_ID_PATTERN.test(workId) || canonicalTitle.trim() === "") {
      throw new Error(`Invalid frozen work identity at position ${index + 1}`);
    }
    if (/[『』]/u.test(canonicalTitle)) {
      throw new Error(`Canonical title contains delimiters: ${workId}`);
    }
    return { position, workId, canonicalTitle };
  });
  if (new Set(rows.map((row) => row.workId)).size !== rows.length) {
    throw new Error("Frozen work set contains a duplicate workId");
  }
  return rows;
}

function fieldCount(content: string, field: string) {
  return [...content.matchAll(new RegExp("^- `?" + field + "`?: (.+)$", "gmu"))].length;
}

function researchPayloadFiles(
  packetDirectory: string,
  frozenWorks: readonly FrozenWork[],
): PayloadFile[] {
  const researched: { workId: string; canonicalTitle: string }[] = [];
  const requiredFields = [
    "sourceUrl",
    "publishedAt",
    "retrievedAt",
    "authorityClass",
    "provenanceFactorClassification",
    "evaluatedRange",
    "supportedClaims",
    "observation",
    "limitation",
  ] as const;
  return researchChunks(frozenWorks.length)
    .map((chunk, chunkIndex) => {
      const path = `research/chunk-${chunk}.md`;
      const content = readFileSync(join(packetDirectory, path), "utf8");
      const headings = [...content.matchAll(/^## workId: `(work-[a-f0-9]{20})` — (.+)$/gmu)];
      const expectedCount = Math.min(10, frozenWorks.length - chunkIndex * 10);
      if (headings.length !== expectedCount) {
        throw new Error(`Research chunk-${chunk} requires exactly ${expectedCount} work headings`);
      }
      for (const [index, heading] of headings.entries()) {
        const workId = heading[1] ?? "";
        const canonicalTitle = heading[2]?.trim() ?? "";
        const section = content.slice(
          heading.index ?? 0,
          headings[index + 1]?.index ?? content.length,
        );
        if (/[『』]/u.test(canonicalTitle)) {
          throw new Error(`Research title contains delimiters: ${workId}`);
        }
        const sourceCount = fieldCount(section, "sourceName");
        if (sourceCount === 0) throw new Error(`Research has no source: ${workId}`);
        for (const field of requiredFields) {
          if (fieldCount(section, field) !== sourceCount) {
            throw new Error(`Research source field count differs for ${workId}: ${field}`);
          }
        }
        researched.push({ workId, canonicalTitle });
      }
      return { path, rowCount: headings.length, content };
    })
    .map((file, index, files) => {
      if (index === files.length - 1) {
        const expected = frozenWorks.map(({ workId, canonicalTitle }) => ({
          workId,
          canonicalTitle,
        }));
        if (JSON.stringify(researched) !== JSON.stringify(expected)) {
          throw new Error("Research work set or title order differs from the frozen work set");
        }
      }
      return file;
    });
}

function assertPacketRelationships(input: {
  batchId: string;
  frozenWorks: readonly FrozenWork[];
  works: readonly CsvRecord[];
  volumes: readonly CsvRecord[];
  batchLedger: readonly CsvRecord[];
  mappings: readonly CsvRecord[];
  memberships: readonly CsvRecord[];
  sources: readonly CsvRecord[];
  safety: readonly CsvRecord[];
  rakuten: readonly CsvRecord[];
}) {
  const frozenIds = input.frozenWorks.map((row) => row.workId);
  const frozenById = new Map(input.frozenWorks.map((row) => [row.workId, row]));
  if (
    JSON.stringify(input.works.map((row) => row.id)) !== JSON.stringify(frozenIds) ||
    input.works.some((row) => row.title !== frozenById.get(row.id ?? "")?.canonicalTitle)
  ) {
    throw new Error("Frozen source Work identities differ from the frozen work set");
  }
  if (
    input.works.some(
      (row) =>
        row.libraryOnly !== "true" ||
        row.onboardingEligible !== "false" ||
        row.recommendationEligible !== "false" ||
        row.annotationReviewMethod !== "unreviewed",
    )
  ) {
    throw new Error("Batch packet can only freeze isolated unreviewed library-only works");
  }
  if (
    JSON.stringify(input.batchLedger.map((row) => row.workId)) !== JSON.stringify(frozenIds) ||
    input.batchLedger.some(
      (row) =>
        row.batchId !== input.batchId ||
        row.batchType !== "batch" ||
        row.status !== "frozen" ||
        row.methodPolicy !== PROMOTION_METHOD_POLICY ||
        row.panelPolicy !== PROMOTION_PANEL_POLICY,
    )
  ) {
    throw new Error("Batch ledger differs from the frozen batch contract");
  }
  for (const workId of frozenIds) {
    if (!input.volumes.some((row) => row.workId === workId && row.isRepresentative === "true")) {
      throw new Error(`Frozen work has no representative volume: ${workId}`);
    }
    if (!input.mappings.some((row) => row.workId === workId)) {
      throw new Error(`Frozen work has no canonical mapping: ${workId}`);
    }
    if (!input.memberships.some((row) => row.workId === workId)) {
      throw new Error(`Frozen work has no source membership: ${workId}`);
    }
  }
  const candidateIds = new Set(input.mappings.map((row) => row.candidateId ?? ""));
  const sourceIds = new Set(input.memberships.map((row) => row.sourceId ?? ""));
  for (const candidateId of candidateIds) {
    if (
      !input.safety.some((row) => row.candidateId === candidateId && row.safetyStatus === "safe")
    ) {
      throw new Error(`Frozen candidate has no safe review: ${candidateId}`);
    }
    if (!input.rakuten.some((row) => row.candidateId === candidateId)) {
      throw new Error(`Frozen candidate has no Rakuten adjudication: ${candidateId}`);
    }
  }
  for (const sourceId of sourceIds) {
    if (!input.sources.some((row) => row.sourceId === sourceId)) {
      throw new Error(`Frozen membership has no source registry row: ${sourceId}`);
    }
  }
}

function validateLiveRepository(root: string) {
  const sourceErrors = runCatalogPipeline(join(root, "data/source")).issues.filter(
    (issue) => issue.severity === "error",
  );
  if (sourceErrors.length > 0) {
    throw new Error(sourceErrors.map(formatSourceIssue).join("\n"));
  }
  return runCatalogExpansionValidation(root);
}

function buildPayloadFiles(root: string, batchId: string, frozenWorks: readonly FrozenWork[]) {
  const packetDirectory = join(root, "data/staging/catalog-expansion/batches", batchId);
  const sourceDirectory = join(root, "data/source");
  const stagingDirectory = join(root, "data/staging/catalog-expansion");
  const selectedIds = new Set(frozenWorks.map((row) => row.workId));

  const worksTable = readCsvTable(join(sourceDirectory, "works.csv"), WORK_HEADERS);
  const volumesTable = readCsvTable(join(sourceDirectory, "volumes.csv"), VOLUME_HEADERS);
  const aliasesTable = readCsvTable(join(sourceDirectory, "aliases.csv"), ALIAS_HEADERS);
  const batchTable = readCsvTable(join(stagingDirectory, "batch-ledger.csv"), BATCH_LEDGER_HEADERS);
  const mappingTable = readCsvTable(
    join(stagingDirectory, "canonical-mapping.csv"),
    CANONICAL_MAPPING_HEADERS,
  );
  const membershipTable = readCsvTable(
    join(stagingDirectory, "source-membership.csv"),
    SOURCE_MEMBERSHIP_HEADERS,
  );
  const selectedMappings = mappingTable.rows.filter((row) => selectedIds.has(row.workId ?? ""));
  const selectedMemberships = membershipTable.rows.filter((row) =>
    selectedIds.has(row.workId ?? ""),
  );
  const candidateIds = new Set(selectedMappings.map((row) => row.candidateId ?? ""));
  const sourceIds = new Set(selectedMemberships.map((row) => row.sourceId ?? ""));

  const subsets = {
    batchLedger: canonicalSubset({
      table: batchTable,
      outputPath: "batch-ledger.csv",
      include: (row) => row.batchId === batchId,
      sortKeys: ["workId"],
    }),
    works: canonicalSubset({
      table: worksTable,
      outputPath: "source/works.csv",
      include: (row) => selectedIds.has(row.id ?? ""),
      sortKeys: ["id"],
    }),
    volumes: canonicalSubset({
      table: volumesTable,
      outputPath: "source/volumes.csv",
      include: (row) => selectedIds.has(row.workId ?? ""),
      sortKeys: ["workId", "id"],
    }),
    aliases: canonicalSubset({
      table: aliasesTable,
      outputPath: "source/aliases.csv",
      include: (row) => selectedIds.has(row.workId ?? ""),
      sortKeys: ["workId", "alias"],
    }),
    mappings: canonicalSubset({
      table: mappingTable,
      outputPath: "provenance/canonical-mapping.csv",
      include: (row) => selectedIds.has(row.workId ?? ""),
      sortKeys: ["workId", "sourceItemId", "mappingId"],
    }),
    rakuten: canonicalSubset({
      table: readCsvTable(join(stagingDirectory, "rakuten-matches.csv"), RAKUTEN_MATCH_HEADERS),
      outputPath: "provenance/rakuten-matches.csv",
      include: (row) => candidateIds.has(row.candidateId ?? ""),
      sortKeys: ["candidateId", "rakutenMatchId"],
    }),
    safety: canonicalSubset({
      table: readCsvTable(join(stagingDirectory, "safety-review.csv"), SAFETY_REVIEW_HEADERS),
      outputPath: "provenance/safety-review.csv",
      include: (row) => candidateIds.has(row.candidateId ?? ""),
      sortKeys: ["candidateId"],
    }),
    memberships: canonicalSubset({
      table: membershipTable,
      outputPath: "provenance/source-membership.csv",
      include: (row) => selectedIds.has(row.workId ?? ""),
      sortKeys: ["workId", "sourceId", "sourceItemId"],
    }),
    sources: canonicalSubset({
      table: readCsvTable(join(stagingDirectory, "source-registry.csv"), SOURCE_REGISTRY_HEADERS),
      outputPath: "provenance/source-registry.csv",
      include: (row) => sourceIds.has(row.sourceId ?? ""),
      sortKeys: ["sourceId"],
    }),
  };

  assertPacketRelationships({
    batchId,
    frozenWorks,
    works: subsets.works.rows,
    volumes: subsets.volumes.rows,
    batchLedger: subsets.batchLedger.rows,
    mappings: subsets.mappings.rows,
    memberships: subsets.memberships.rows,
    sources: subsets.sources.rows,
    safety: subsets.safety.rows,
    rakuten: subsets.rakuten.rows,
  });

  const selection = readFileSync(join(packetDirectory, "selection-report.md"), "utf8");
  if (!selection.startsWith(`# ${batchId} selection\n`)) {
    throw new Error(`Selection report does not identify ${batchId}`);
  }
  const request = readFileSync(
    join(packetDirectory, "annotation-review-adjudication-request.md"),
    "utf8",
  );
  for (const marker of [
    PROMOTION_METHOD_POLICY,
    "all 17 Axis",
    "unknown",
    "reviewedByHuman=false",
  ]) {
    if (!request.includes(marker))
      throw new Error(`Batch request lacks required marker: ${marker}`);
  }

  const payloadFiles: PayloadFile[] = [
    {
      path: "frozen-work-set.csv",
      rowCount: frozenWorks.length,
      content: readFileSync(join(packetDirectory, "frozen-work-set.csv"), "utf8"),
    },
    { path: "selection-report.md", rowCount: frozenWorks.length, content: selection },
    { path: "annotation-review-adjudication-request.md", rowCount: 1, content: request },
    ...researchPayloadFiles(packetDirectory, frozenWorks),
    ...Object.values(subsets).map(({ path, rowCount, content }) => ({ path, rowCount, content })),
  ];
  return payloadFiles.sort((left, right) => codeUnitCompare(left.path, right.path));
}

function repositoryIdentity(root: string) {
  const git = (args: readonly string[]) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  return {
    branch: git(["rev-parse", "--abbrev-ref", "HEAD"]),
    headSha: git(["rev-parse", "HEAD"]),
    dirty: git(["status", "--porcelain=v1", "--untracked-files=all", "--", "."]) !== "",
  };
}

export function derivePromotionBatchCandidateSha256(input: {
  batchId: string;
  factorDictionarySha256: string;
  annotationGuideSha256: string;
  promotionMethodSha256: string;
  workSetSha256: string;
  payloadLedgerSha256: string;
}) {
  return sha256(JSON.stringify({ schemaVersion: CANDIDATE_SCHEMA_VERSION, ...input }));
}

export function buildPromotionBatchPacketArtifacts(
  batchId: string,
  root = process.cwd(),
): PromotionBatchPacketArtifacts {
  if (!BATCH_ID_PATTERN.test(batchId)) throw new Error(`Invalid promotion batch ID: ${batchId}`);
  const canonicalRoot = resolve(root);
  validateLiveRepository(canonicalRoot);
  const packetRoot = `data/staging/catalog-expansion/batches/${batchId}`;
  const packetDirectory = join(canonicalRoot, packetRoot);
  const frozenBytes = readFileSync(join(packetDirectory, "frozen-work-set.csv"), "utf8");
  const frozenWorks = parseFrozenPromotionBatch(frozenBytes);
  const payloadFiles = buildPayloadFiles(canonicalRoot, batchId, frozenWorks);
  const payloadLedger = `${payloadFiles
    .map((file) => `${sha256(file.content)}  ${file.path}`)
    .join("\n")}\n`;
  const policies = Object.fromEntries(
    Object.entries(POLICY_PATHS).map(([key, path]) => [
      key,
      { path, sha256: sha256(readFileSync(join(canonicalRoot, path))) },
    ]),
  ) as Record<keyof typeof POLICY_PATHS, { path: string; sha256: string }>;
  const workIds = frozenWorks.map((row) => row.workId);
  const workSetSha256 = sha256(`${workIds.join("\n")}\n`);
  const payloadLedgerSha256 = sha256(payloadLedger);
  const manifest = promotionBatchPacketManifestSchema.parse({
    schemaVersion: PACKET_SCHEMA_VERSION,
    batchId,
    packetRoot,
    repository: repositoryIdentity(canonicalRoot),
    policies,
    workSet: {
      count: workIds.length,
      ordering: "frozen-position",
      workIds,
      sha256: workSetSha256,
      frozenWorkSetSha256: sha256(frozenBytes),
    },
    payload: {
      ledgerPath: PAYLOAD_LEDGER_FILE,
      ledgerSha256: payloadLedgerSha256,
      files: payloadFiles.map((file) => ({
        path: file.path,
        rowCount: file.rowCount,
        sha256: sha256(file.content),
      })),
    },
    candidateSha256: derivePromotionBatchCandidateSha256({
      batchId,
      factorDictionarySha256: policies.factorDictionary.sha256,
      annotationGuideSha256: policies.annotationGuide.sha256,
      promotionMethodSha256: policies.promotionMethod.sha256,
      workSetSha256,
      payloadLedgerSha256,
    }),
  });
  const generatedFiles = new Map(
    payloadFiles
      .filter((file) => /^(?:batch-ledger\.csv|source\/|provenance\/)/u.test(file.path))
      .map((file) => [file.path, file.content]),
  );
  generatedFiles.set(PAYLOAD_LEDGER_FILE, payloadLedger);
  generatedFiles.set(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
  return { manifest, payloadFiles, generatedFiles };
}

function exactDirectoryFiles(directory: string, expected: readonly string[]) {
  const actual = existsSync(directory)
    ? readdirSync(directory, { withFileTypes: true })
        .map((entry) => (entry.isFile() ? entry.name : `${entry.name}/`))
        .sort(codeUnitCompare)
    : [];
  if (JSON.stringify(actual) !== JSON.stringify([...expected].sort(codeUnitCompare))) {
    throw new Error(`Unexpected packet file set: ${relative(process.cwd(), directory)}`);
  }
}

function validateStoredPacket(batchId: string, root: string) {
  const packetRoot = `data/staging/catalog-expansion/batches/${batchId}`;
  const packetDirectory = join(root, packetRoot);
  const manifest = promotionBatchPacketManifestSchema.parse(
    JSON.parse(readFileSync(join(packetDirectory, MANIFEST_FILE), "utf8")) as unknown,
  );
  if (manifest.batchId !== batchId || manifest.packetRoot !== packetRoot) {
    throw new Error("Batch packet manifest identity differs from its path");
  }
  const expectedPaths = [
    "annotation-review-adjudication-request.md",
    "batch-ledger.csv",
    "frozen-work-set.csv",
    "provenance/canonical-mapping.csv",
    "provenance/rakuten-matches.csv",
    "provenance/safety-review.csv",
    "provenance/source-membership.csv",
    "provenance/source-registry.csv",
    ...researchChunks(manifest.workSet.count).map((chunk) => `research/chunk-${chunk}.md`),
    "selection-report.md",
    "source/aliases.csv",
    "source/volumes.csv",
    "source/works.csv",
  ].sort(codeUnitCompare);
  const payloadPaths = manifest.payload.files.map((file) => file.path);
  if (
    new Set(payloadPaths).size !== payloadPaths.length ||
    JSON.stringify(payloadPaths) !== JSON.stringify(expectedPaths)
  ) {
    throw new Error("Batch packet manifest does not bind the exact input file set");
  }
  exactDirectoryFiles(join(packetDirectory, "source"), ["aliases.csv", "volumes.csv", "works.csv"]);
  exactDirectoryFiles(join(packetDirectory, "provenance"), [
    "canonical-mapping.csv",
    "rakuten-matches.csv",
    "safety-review.csv",
    "source-membership.csv",
    "source-registry.csv",
  ]);
  const expectedLedger = `${manifest.payload.files
    .map((file) => {
      const content = readFileSync(join(packetDirectory, file.path), "utf8");
      if (sha256(content) !== file.sha256) {
        throw new Error(`Batch packet payload hash mismatch: ${file.path}`);
      }
      return `${file.sha256}  ${file.path}`;
    })
    .join("\n")}\n`;
  const actualLedger = readFileSync(join(packetDirectory, PAYLOAD_LEDGER_FILE), "utf8");
  if (actualLedger !== expectedLedger || sha256(actualLedger) !== manifest.payload.ledgerSha256) {
    throw new Error("Batch packet payload ledger is invalid");
  }
  for (const [key, expectedPath] of Object.entries(POLICY_PATHS)) {
    const policy = manifest.policies[key as keyof typeof POLICY_PATHS];
    if (policy.path !== expectedPath) {
      throw new Error(`Batch packet policy path mismatch: ${expectedPath}`);
    }
  }
  const frozenBytes = readFileSync(join(packetDirectory, "frozen-work-set.csv"), "utf8");
  const frozenWorks = parseFrozenPromotionBatch(frozenBytes);
  const workIds = frozenWorks.map((row) => row.workId);
  if (
    JSON.stringify(workIds) !== JSON.stringify(manifest.workSet.workIds) ||
    sha256(`${workIds.join("\n")}\n`) !== manifest.workSet.sha256 ||
    sha256(frozenBytes) !== manifest.workSet.frozenWorkSetSha256
  ) {
    throw new Error("Batch packet frozen work-set binding is invalid");
  }
  const candidateSha256 = derivePromotionBatchCandidateSha256({
    batchId,
    factorDictionarySha256: manifest.policies.factorDictionary.sha256,
    annotationGuideSha256: manifest.policies.annotationGuide.sha256,
    promotionMethodSha256: manifest.policies.promotionMethod.sha256,
    workSetSha256: manifest.workSet.sha256,
    payloadLedgerSha256: manifest.payload.ledgerSha256,
  });
  if (candidateSha256 !== manifest.candidateSha256) {
    throw new Error("Batch packet candidate identity is invalid");
  }

  const packetWorks = readCsvTable(join(packetDirectory, "source/works.csv"), WORK_HEADERS).rows;
  if (
    packetWorks.length !== frozenWorks.length ||
    new Set(packetWorks.map((row) => row.id)).size !== packetWorks.length ||
    packetWorks.some(
      (row) => row.title !== frozenWorks.find((frozen) => frozen.workId === row.id)?.canonicalTitle,
    )
  ) {
    throw new Error("Batch packet Work identity differs from the frozen work set");
  }
  return manifest;
}

export function validateFrozenPromotionBatchPacket(batchId: string, root = process.cwd()) {
  if (!BATCH_ID_PATTERN.test(batchId)) throw new Error(`Invalid promotion batch ID: ${batchId}`);
  const canonicalRoot = resolve(root);
  validateLiveRepository(canonicalRoot);
  return validateStoredPacket(batchId, canonicalRoot);
}

function writeAtomic(path: string, content: string) {
  mkdirSync(dirname(path), { recursive: true });
  const temporaryPath = `${path}.tmp`;
  writeFileSync(temporaryPath, content, "utf8");
  renameSync(temporaryPath, path);
}

export function runPromotionBatchPacket(
  mode: "check" | "write",
  batchId: string,
  root = process.cwd(),
) {
  const canonicalRoot = resolve(root);
  if (mode === "check") return validateFrozenPromotionBatchPacket(batchId, canonicalRoot);
  const artifacts = buildPromotionBatchPacketArtifacts(batchId, canonicalRoot);
  const packetDirectory = join(canonicalRoot, artifacts.manifest.packetRoot);
  for (const [path, content] of artifacts.generatedFiles) {
    writeAtomic(join(packetDirectory, path), content);
  }
  const stored = validateStoredPacket(batchId, canonicalRoot);
  if (stored.candidateSha256 !== artifacts.manifest.candidateSha256) {
    throw new Error("Written Batch packet differs from the generated candidate");
  }
  return stored;
}

function parseCli(args: readonly string[]) {
  const normalized = args[0] === "--" ? args.slice(1) : [...args];
  const mode = normalized.includes("--write")
    ? "write"
    : normalized.includes("--check")
      ? "check"
      : undefined;
  const batchIndex = normalized.indexOf("--batch-id");
  const batchId = batchIndex < 0 ? undefined : normalized[batchIndex + 1];
  if (
    mode === undefined ||
    batchId === undefined ||
    normalized.filter((value) => value === "--write" || value === "--check").length !== 1 ||
    normalized.length !== 3
  ) {
    throw new Error(
      "Usage: tsx scripts/build-promotion-batch-packet.ts --write|--check --batch-id <batch-id>",
    );
  }
  return { mode, batchId } as const;
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    const { mode, batchId } = parseCli(process.argv.slice(2));
    const manifest = runPromotionBatchPacket(mode, batchId);
    console.log(
      `${batchId} packet ${mode}: ${manifest.workSet.count} works; candidate ${manifest.candidateSha256}.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
