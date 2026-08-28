import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";
import { CATALOG_DATABASE_FILE, withCatalogCsvProjection } from "./catalog/authority";

import { loadCatalogSource } from "./catalog/load-source";
import { runCatalogPipeline } from "./catalog/pipeline";
import { formatSourceIssue } from "./catalog/report";
import type { WorkSourceRow } from "./catalog/types";
import { runCatalogExpansionValidation, validateGoldSet } from "./validate-catalog-expansion";

const PILOT_ID = "pilot-001";
const PILOT_WORK_COUNT = 50;
const METHOD_POLICY = "promotion-evidence-v2";
const PANEL_POLICY = "art-local-codex+gemini-3.7-flash-high;grok-art-abstain;muse-conditional";
const PACKET_ROOT = "data/staging/catalog-expansion/pilots/pilot-001";
const RESEARCH_ROOT = "data/staging/catalog-expansion/pilot-research/pilot-001";
const RESEARCH_CHUNK_COUNT = 5;
const RESEARCH_WORKS_PER_CHUNK = 10;
const MANIFEST_FILE = "manifest.json";
const PAYLOAD_LEDGER_FILE = "PAYLOAD.sha256";
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;

const batchRowSchema = z.strictObject({
  workId: z.string().min(1),
  batchId: z.literal(PILOT_ID),
  batchType: z.literal("pilot"),
  status: z.literal("frozen"),
  selectionReason: z.string().min(1),
  methodPolicy: z.literal(METHOD_POLICY),
  panelPolicy: z.literal(PANEL_POLICY),
  lastUpdatedAt: z.iso.date(),
});

const payloadFileSchema = z.strictObject({
  path: z.string().min(1),
  rowCount: z.number().int().nonnegative(),
  sha256: z.string().regex(SHA256_PATTERN),
});

export const promotionPilotManifestSchema = z.strictObject({
  schemaVersion: z.literal("promotion-pilot-packet-v1"),
  pilotId: z.literal(PILOT_ID),
  packetRoot: z.literal(PACKET_ROOT),
  repository: z.strictObject({
    branch: z.string().min(1),
    headSha: z.string().regex(/^[a-f0-9]{40}$/u),
    dirty: z.boolean(),
  }),
  policies: z.strictObject({
    factorDictionary: z.strictObject({
      path: z.literal("docs/factors/factor-dictionary.md"),
      sha256: z.string().regex(SHA256_PATTERN),
    }),
    annotationGuide: z.strictObject({
      path: z.literal("docs/factors/annotation-guide.md"),
      sha256: z.string().regex(SHA256_PATTERN),
    }),
    promotionMethod: z.strictObject({
      path: z.literal("docs/catalog-expansion/01-promotion-method.md"),
      sha256: z.string().regex(SHA256_PATTERN),
    }),
  }),
  workSet: z.strictObject({
    count: z.literal(PILOT_WORK_COUNT),
    ordering: z.literal("code-unit-ascending"),
    workIds: z.array(z.string().min(1)).length(PILOT_WORK_COUNT),
    sha256: z.string().regex(SHA256_PATTERN),
  }),
  payload: z.strictObject({
    ledgerPath: z.literal(PAYLOAD_LEDGER_FILE),
    ledgerSha256: z.string().regex(SHA256_PATTERN),
    files: z.array(payloadFileSchema).length(16),
  }),
  candidateSha256: z.string().regex(SHA256_PATTERN),
});

export type PromotionPilotManifest = z.infer<typeof promotionPilotManifestSchema>;
export type PilotBatchRow = z.infer<typeof batchRowSchema>;

type CsvRecord = Record<string, string>;
type CsvTable = {
  headers: string[];
  rows: CsvRecord[];
};
type PayloadFile = {
  path: string;
  rowCount: number;
  content: string;
};
type PilotWork = Pick<
  WorkSourceRow,
  "id" | "title" | "libraryOnly" | "onboardingEligible" | "recommendationEligible"
>;

export type PromotionPilotInput = {
  root: string;
  batches: PilotBatchRow[];
  works: PilotWork[];
  goldWorkIds: string[];
};

export type PromotionPilotArtifacts = {
  manifest: PromotionPilotManifest;
  files: ReadonlyMap<string, string>;
};

function codeUnitCompare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sha256(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

function readCsvTable(path: string): CsvTable {
  const matrix = z.array(z.array(z.string())).parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }),
  );
  const [headers, ...rows] = matrix;
  if (headers === undefined || headers.length === 0 || new Set(headers).size !== headers.length) {
    throw new Error(`Invalid CSV header: ${path}`);
  }
  return {
    headers,
    rows: rows.map((row, index) => {
      if (row.length !== headers.length) {
        throw new Error(`Unexpected column count: ${path}:${index + 2}`);
      }
      return Object.fromEntries(headers.map((header, column) => [header, row[column] ?? ""]));
    }),
  };
}

function requireColumns(table: CsvTable, path: string, columns: readonly string[]) {
  for (const column of columns) {
    if (!table.headers.includes(column)) {
      throw new Error(`Missing CSV column ${column}: ${path}`);
    }
  }
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeCsv(table: CsvTable, rows: readonly CsvRecord[]) {
  return `${[table.headers, ...rows.map((row) => table.headers.map((header) => row[header] ?? ""))]
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

function subsetCsv(input: {
  sourcePath: string;
  outputPath: string;
  requiredColumns: readonly string[];
  include: (row: CsvRecord) => boolean;
  sortKeys: readonly string[];
}): PayloadFile {
  const table = readCsvTable(input.sourcePath);
  requireColumns(table, input.sourcePath, input.requiredColumns);
  const rows = table.rows.filter(input.include).sort(compareRows(input.sortKeys));
  return {
    path: input.outputPath,
    rowCount: rows.length,
    content: serializeCsv(table, rows),
  };
}

function fieldLines(content: string, field: string) {
  return [...content.matchAll(new RegExp("^- `?" + field + "`?: (.+)$", "gmu"))];
}

function researchPayloadFiles(
  root: string,
  works: readonly PilotWork[],
  workIds: readonly string[],
) {
  const titlesById = new Map(works.map((work) => [work.id, work.title]));
  const researchedWorkIds: string[] = [];
  const files = Array.from({ length: RESEARCH_CHUNK_COUNT }, (_, index) => {
    const chunk = String(index + 1).padStart(2, "0");
    const sourcePath = join(root, RESEARCH_ROOT, `chunk-${chunk}.md`);
    const content = readFileSync(sourcePath, "utf8");
    const headings = [...content.matchAll(/^## (?:workId: `)?(work-[a-f0-9]+)`? — (.+)$/gmu)];
    if (headings.length !== RESEARCH_WORKS_PER_CHUNK) {
      throw new Error(`Pilot research chunk-${chunk}.md requires exactly 10 work headings`);
    }
    for (const [headingIndex, heading] of headings.entries()) {
      const workId = heading[1] ?? "";
      const title = heading[2]?.trim() ?? "";
      const sectionStart = heading.index ?? 0;
      const sectionEnd = headings[headingIndex + 1]?.index ?? content.length;
      const section = content.slice(sectionStart, sectionEnd);
      const expectedTitle = titlesById.get(workId);
      if (expectedTitle === undefined || !workIds.includes(workId)) {
        throw new Error(`Pilot research chunk-${chunk}.md has an unexpected work: ${workId}`);
      }
      if (title !== expectedTitle || /[『』]/u.test(title)) {
        throw new Error(
          `Pilot research chunk-${chunk}.md title is not canonical: ${workId} (${title})`,
        );
      }
      const sourceCount = fieldLines(section, "sourceName").length;
      if (sourceCount === 0) {
        throw new Error(`Pilot research has no source: ${workId}`);
      }
      for (const field of [
        "sourceUrl",
        "publishedAt",
        "retrievedAt",
        "authorityClass",
        "supportedClaims",
        "observation",
        "limitation",
      ]) {
        if (fieldLines(section, field).length !== sourceCount) {
          throw new Error(`Pilot research field count differs for ${workId}: ${field}`);
        }
      }
      const compactSafety = [...section.matchAll(/^\*\*safetyScopeNote:\*\*/gmu)].length === 1;
      const expandedSafety =
        [...section.matchAll(/^### (?:Safety \/ scope|안전 \/ 범위)$/gmu)].length === 1 &&
        fieldLines(section, "safetyScope").length === 1 &&
        fieldLines(section, "safetyScopeLimitation").length === 1;
      if (
        fieldLines(section, "retrievedAt").some((match) => match[1] !== "2026-08-22") ||
        (!compactSafety && !expandedSafety)
      ) {
        throw new Error(`Pilot research review metadata is incomplete: ${workId}`);
      }
      researchedWorkIds.push(workId);
    }
    return {
      path: `research/chunk-${chunk}.md`,
      rowCount: headings.length,
      content,
    };
  });
  if (
    new Set(researchedWorkIds).size !== PILOT_WORK_COUNT ||
    JSON.stringify([...researchedWorkIds].sort(codeUnitCompare)) !== JSON.stringify(workIds)
  ) {
    throw new Error("Pilot research work set differs from the frozen pilot work set");
  }
  const artPreflight = readFileSync(
    join(root, RESEARCH_ROOT, "art-capability-preflight.md"),
    "utf8",
  );
  for (const required of [
    "gemini-3.7-flash-high",
    "opencode/muse-spark-1.2-contributor-free",
    "cursor-grok-4.6-high",
    "Local Codex subagent",
  ]) {
    if (!artPreflight.includes(required)) {
      throw new Error(`Pilot Art capability preflight is missing ${required}`);
    }
  }
  const reviewRequest = readFileSync(
    join(root, RESEARCH_ROOT, "annotation-review-adjudication-request.md"),
    "utf8",
  );
  for (const required of [
    METHOD_POLICY,
    "Supplemental user-review pass",
    "Art sample shortage alone resolves to `unknown`",
  ]) {
    if (!reviewRequest.includes(required)) {
      throw new Error(`Pilot review request is missing ${required}`);
    }
  }
  return [
    ...files,
    {
      path: "research/art-capability-preflight.md",
      rowCount: 4,
      content: artPreflight,
    },
    {
      path: "research/annotation-review-adjudication-request.md",
      rowCount: 1,
      content: reviewRequest,
    },
  ];
}

function git(root: string, args: readonly string[]) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function repositoryIdentity(root: string) {
  const dirty =
    git(root, [
      "status",
      "--porcelain=v1",
      "--untracked-files=all",
      "--",
      ".",
      `:(exclude)${PACKET_ROOT}/**`,
    ]) !== "";
  return {
    branch: git(root, ["rev-parse", "--abbrev-ref", "HEAD"]),
    headSha: git(root, ["rev-parse", "HEAD"]),
    dirty,
  };
}

export function validatePilotWorkSet(
  batches: readonly PilotBatchRow[],
  works: readonly PilotWork[],
  goldWorkIds: readonly string[],
) {
  if (batches.length !== PILOT_WORK_COUNT) {
    throw new Error(`Pilot ${PILOT_ID} requires exactly ${PILOT_WORK_COUNT} frozen works`);
  }
  const workIds = batches.map((row) => row.workId);
  const duplicate = workIds.find((workId, index) => workIds.indexOf(workId) !== index);
  if (duplicate !== undefined) {
    throw new Error(`Pilot ${PILOT_ID} contains a duplicate work: ${duplicate}`);
  }
  const worksById = new Map(works.map((work) => [work.id, work]));
  const goldIds = new Set(goldWorkIds);
  for (const workId of workIds) {
    const work = worksById.get(workId);
    if (work === undefined) {
      throw new Error(`Pilot ${PILOT_ID} references a missing work: ${workId}`);
    }
    if (goldIds.has(workId)) {
      throw new Error(`Pilot ${PILOT_ID} cannot include a Gold work: ${workId}`);
    }
    if (!work.libraryOnly || work.onboardingEligible || work.recommendationEligible) {
      throw new Error(`Pilot ${PILOT_ID} work is not isolated libraryOnly: ${workId}`);
    }
  }
  return [...workIds].sort(codeUnitCompare);
}

export function derivePilotCandidateSha256(input: {
  factorDictionarySha256: string;
  annotationGuideSha256: string;
  promotionMethodSha256: string;
  workSetSha256: string;
  payloadLedgerSha256: string;
}) {
  return sha256(
    JSON.stringify({
      schemaVersion: "promotion-pilot-candidate-v1",
      pilotId: PILOT_ID,
      ...input,
    }),
  );
}

export function loadPromotionPilotInput(root = process.cwd()): PromotionPilotInput {
  const canonicalRoot = resolve(root);
  const sourceDirectory = join(canonicalRoot, "data/source");
  const stagingDirectory = join(canonicalRoot, "data/staging/catalog-expansion");
  const pipelineErrors = runCatalogPipeline(sourceDirectory).issues.filter(
    (issue) => issue.severity === "error",
  );
  if (pipelineErrors.length > 0) {
    throw new Error(pipelineErrors.map(formatSourceIssue).join("\n"));
  }
  runCatalogExpansionValidation(canonicalRoot);
  const loaded = loadCatalogSource(sourceDirectory);
  const gold = validateGoldSet(
    canonicalRoot,
    JSON.parse(readFileSync(join(stagingDirectory, "gold-set-manifest.json"), "utf8")) as unknown,
  );
  const batchTable = readCsvTable(join(stagingDirectory, "batch-ledger.csv"));
  requireColumns(batchTable, "batch-ledger.csv", [
    "workId",
    "batchId",
    "batchType",
    "status",
    "selectionReason",
    "methodPolicy",
    "panelPolicy",
    "lastUpdatedAt",
  ]);
  const batches = z
    .array(batchRowSchema)
    .parse(batchTable.rows.filter((row) => row.batchId === PILOT_ID));
  return {
    root: canonicalRoot,
    batches,
    works: loaded.source.works.map((row) => row.value),
    goldWorkIds: gold.workIds,
  };
}

function assertPacketRelationships(files: readonly PayloadFile[], workIds: readonly string[]) {
  const byPath = new Map(
    files
      .filter((file) => file.path.endsWith(".csv"))
      .map((file) => [file.path, readCsvTableFromContent(file.content)]),
  );
  const mappings = byPath.get("provenance/canonical-mapping.csv")?.rows ?? [];
  const memberships = byPath.get("provenance/source-membership.csv")?.rows ?? [];
  const sources = byPath.get("provenance/source-registry.csv")?.rows ?? [];
  const safety = byPath.get("provenance/safety-review.csv")?.rows ?? [];
  const rakuten = byPath.get("provenance/rakuten-matches.csv")?.rows ?? [];
  const candidateIds = new Set(mappings.map((row) => row.candidateId ?? ""));
  const sourceIds = new Set(memberships.map((row) => row.sourceId ?? ""));
  for (const workId of workIds) {
    if (!mappings.some((row) => row.workId === workId)) {
      throw new Error(`Pilot work has no canonical mapping: ${workId}`);
    }
    if (!memberships.some((row) => row.workId === workId)) {
      throw new Error(`Pilot work has no source membership: ${workId}`);
    }
  }
  for (const sourceId of sourceIds) {
    if (!sources.some((row) => row.sourceId === sourceId)) {
      throw new Error(`Pilot membership has no source registry row: ${sourceId}`);
    }
  }
  for (const candidateId of candidateIds) {
    if (!safety.some((row) => row.candidateId === candidateId && row.safetyStatus === "safe")) {
      throw new Error(`Pilot candidate has no safe review: ${candidateId}`);
    }
    if (!rakuten.some((row) => row.candidateId === candidateId)) {
      throw new Error(`Pilot candidate has no Rakuten adjudication: ${candidateId}`);
    }
  }
}

function readCsvTableFromContent(content: string): CsvTable {
  const matrix = z
    .array(z.array(z.string()))
    .parse(parse(content, { relax_column_count: false, skip_empty_lines: true }));
  const [headers, ...rows] = matrix;
  if (headers === undefined) throw new Error("Generated CSV is empty");
  return {
    headers,
    rows: rows.map((row) =>
      Object.fromEntries(headers.map((header, column) => [header, row[column] ?? ""])),
    ),
  };
}

export function buildPromotionPilotArtifacts(
  input = loadPromotionPilotInput(),
  sourceOverride?: string,
): PromotionPilotArtifacts {
  const { root } = input;
  const canonicalSourceDirectory = join(root, "data/source");
  if (
    sourceOverride === undefined &&
    existsSync(join(canonicalSourceDirectory, CATALOG_DATABASE_FILE))
  ) {
    return withCatalogCsvProjection(canonicalSourceDirectory, (projected) =>
      buildPromotionPilotArtifacts(input, projected),
    );
  }
  const sourceDirectory = sourceOverride ?? canonicalSourceDirectory;
  const stagingDirectory = join(root, "data/staging/catalog-expansion");
  const workIds = validatePilotWorkSet(input.batches, input.works, input.goldWorkIds);
  const selectedIds = new Set(workIds);

  const mappingTable = readCsvTable(join(stagingDirectory, "canonical-mapping.csv"));
  requireColumns(mappingTable, "canonical-mapping.csv", ["workId", "candidateId"]);
  const selectedMappings = mappingTable.rows.filter((row) => selectedIds.has(row.workId ?? ""));
  const candidateIds = new Set(selectedMappings.map((row) => row.candidateId ?? ""));
  const membershipTable = readCsvTable(join(stagingDirectory, "source-membership.csv"));
  requireColumns(membershipTable, "source-membership.csv", ["workId", "sourceId"]);
  const sourceIds = new Set(
    membershipTable.rows
      .filter((row) => selectedIds.has(row.workId ?? ""))
      .map((row) => row.sourceId ?? ""),
  );

  const payloadFiles = [
    subsetCsv({
      sourcePath: join(stagingDirectory, "batch-ledger.csv"),
      outputPath: "batch-ledger.csv",
      requiredColumns: ["workId", "batchId"],
      include: (row) => row.batchId === PILOT_ID,
      sortKeys: ["workId"],
    }),
    subsetCsv({
      sourcePath: join(sourceDirectory, "works.csv"),
      outputPath: "source/works.csv",
      requiredColumns: ["id"],
      include: (row) => selectedIds.has(row.id ?? ""),
      sortKeys: ["id"],
    }),
    subsetCsv({
      sourcePath: join(sourceDirectory, "aliases.csv"),
      outputPath: "source/aliases.csv",
      requiredColumns: ["workId", "alias"],
      include: (row) => selectedIds.has(row.workId ?? ""),
      sortKeys: ["workId", "alias"],
    }),
    subsetCsv({
      sourcePath: join(sourceDirectory, "volumes.csv"),
      outputPath: "source/volumes.csv",
      requiredColumns: ["workId", "id"],
      include: (row) => selectedIds.has(row.workId ?? ""),
      sortKeys: ["workId", "id"],
    }),
    subsetCsv({
      sourcePath: join(stagingDirectory, "source-membership.csv"),
      outputPath: "provenance/source-membership.csv",
      requiredColumns: ["workId", "sourceId", "sourceItemId"],
      include: (row) => selectedIds.has(row.workId ?? ""),
      sortKeys: ["workId", "sourceId", "sourceItemId"],
    }),
    subsetCsv({
      sourcePath: join(stagingDirectory, "source-registry.csv"),
      outputPath: "provenance/source-registry.csv",
      requiredColumns: ["sourceId"],
      include: (row) => sourceIds.has(row.sourceId ?? ""),
      sortKeys: ["sourceId"],
    }),
    subsetCsv({
      sourcePath: join(stagingDirectory, "canonical-mapping.csv"),
      outputPath: "provenance/canonical-mapping.csv",
      requiredColumns: ["workId", "sourceItemId", "mappingId"],
      include: (row) => selectedIds.has(row.workId ?? ""),
      sortKeys: ["workId", "sourceItemId", "mappingId"],
    }),
    subsetCsv({
      sourcePath: join(stagingDirectory, "safety-review.csv"),
      outputPath: "provenance/safety-review.csv",
      requiredColumns: ["candidateId"],
      include: (row) => candidateIds.has(row.candidateId ?? ""),
      sortKeys: ["candidateId"],
    }),
    subsetCsv({
      sourcePath: join(stagingDirectory, "rakuten-matches.csv"),
      outputPath: "provenance/rakuten-matches.csv",
      requiredColumns: ["candidateId", "rakutenMatchId"],
      include: (row) => candidateIds.has(row.candidateId ?? ""),
      sortKeys: ["candidateId", "rakutenMatchId"],
    }),
    ...researchPayloadFiles(root, input.works, workIds),
  ].sort((left, right) => codeUnitCompare(left.path, right.path));

  assertPacketRelationships(payloadFiles, workIds);
  const payloadLedger = `${payloadFiles
    .map((file) => `${sha256(file.content)}  ${file.path}`)
    .join("\n")}\n`;
  const factorDictionarySha256 = sha256(
    readFileSync(join(root, "docs/factors/factor-dictionary.md")),
  );
  const annotationGuideSha256 = sha256(
    readFileSync(join(root, "docs/factors/annotation-guide.md")),
  );
  const promotionMethodSha256 = sha256(
    readFileSync(join(root, "docs/catalog-expansion/01-promotion-method.md")),
  );
  const workSetSha256 = sha256(`${workIds.join("\n")}\n`);
  const payloadLedgerSha256 = sha256(payloadLedger);
  const manifest = promotionPilotManifestSchema.parse({
    schemaVersion: "promotion-pilot-packet-v1",
    pilotId: PILOT_ID,
    packetRoot: PACKET_ROOT,
    repository: repositoryIdentity(root),
    policies: {
      factorDictionary: {
        path: "docs/factors/factor-dictionary.md",
        sha256: factorDictionarySha256,
      },
      annotationGuide: {
        path: "docs/factors/annotation-guide.md",
        sha256: annotationGuideSha256,
      },
      promotionMethod: {
        path: "docs/catalog-expansion/01-promotion-method.md",
        sha256: promotionMethodSha256,
      },
    },
    workSet: {
      count: PILOT_WORK_COUNT,
      ordering: "code-unit-ascending",
      workIds,
      sha256: workSetSha256,
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
    candidateSha256: derivePilotCandidateSha256({
      factorDictionarySha256,
      annotationGuideSha256,
      promotionMethodSha256,
      workSetSha256,
      payloadLedgerSha256,
    }),
  });
  const files = new Map(payloadFiles.map((file) => [file.path, file.content]));
  files.set(PAYLOAD_LEDGER_FILE, payloadLedger);
  files.set(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
  return { manifest, files };
}

function listFiles(directory: string, prefix = ""): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
    return entry.isDirectory() ? listFiles(join(directory, entry.name), path) : [path];
  });
}

function validateStoredPromotionPilotArtifacts(packetDirectory: string) {
  const manifest = promotionPilotManifestSchema.parse(
    JSON.parse(readFileSync(join(packetDirectory, MANIFEST_FILE), "utf8")) as unknown,
  );
  const payloadPaths = manifest.payload.files.map((file) => file.path);
  if (new Set(payloadPaths).size !== payloadPaths.length) {
    throw new Error("Pilot manifest contains a duplicate payload path");
  }
  const expectedPaths = [MANIFEST_FILE, PAYLOAD_LEDGER_FILE, ...payloadPaths].sort(codeUnitCompare);
  const actualPaths = listFiles(packetDirectory)
    .filter(
      (path) =>
        !path.startsWith("annotation-pass-a/") &&
        !path.startsWith("reviews/") &&
        !path.startsWith("final-overlay/"),
    )
    .sort(codeUnitCompare);
  if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths)) {
    throw new Error(
      `Pilot packet file set differs: expected=${expectedPaths.join(",")}; actual=${actualPaths.join(",")}`,
    );
  }
  const payloadLedger = readFileSync(join(packetDirectory, PAYLOAD_LEDGER_FILE), "utf8");
  const expectedPayloadLedger = `${manifest.payload.files
    .map((file) => {
      const content = readFileSync(join(packetDirectory, file.path), "utf8");
      if (sha256(content) !== file.sha256) {
        throw new Error(`Pilot payload hash is invalid: ${file.path}`);
      }
      return `${file.sha256}  ${file.path}`;
    })
    .join("\n")}\n`;
  if (
    payloadLedger !== expectedPayloadLedger ||
    sha256(payloadLedger) !== manifest.payload.ledgerSha256
  ) {
    throw new Error("Pilot payload ledger is invalid");
  }
  const workIds = [...manifest.workSet.workIds].sort(codeUnitCompare);
  if (
    JSON.stringify(workIds) !== JSON.stringify(manifest.workSet.workIds) ||
    new Set(workIds).size !== PILOT_WORK_COUNT ||
    sha256(`${workIds.join("\n")}\n`) !== manifest.workSet.sha256
  ) {
    throw new Error("Pilot manifest work set is not canonical");
  }
  if (
    derivePilotCandidateSha256({
      factorDictionarySha256: manifest.policies.factorDictionary.sha256,
      annotationGuideSha256: manifest.policies.annotationGuide.sha256,
      promotionMethodSha256: manifest.policies.promotionMethod.sha256,
      workSetSha256: manifest.workSet.sha256,
      payloadLedgerSha256: manifest.payload.ledgerSha256,
    }) !== manifest.candidateSha256
  ) {
    throw new Error("Pilot candidate identity is invalid");
  }
  return manifest;
}

function validatePilotLiveIdentity(
  input: PromotionPilotInput,
  manifest: PromotionPilotManifest,
  packetDirectory: string,
) {
  const frozenWorks = readCsvTable(join(packetDirectory, "source/works.csv"));
  requireColumns(frozenWorks, "source/works.csv", ["id", "title"]);
  const frozenWorkIds = frozenWorks.rows.map((row) => row.id ?? "");
  if (
    new Set(frozenWorkIds).size !== frozenWorkIds.length ||
    JSON.stringify([...frozenWorkIds].sort(codeUnitCompare)) !==
      JSON.stringify(manifest.workSet.workIds)
  ) {
    throw new Error("Frozen pilot source work set differs from its manifest");
  }
  const liveWorkIds = input.works.map((work) => work.id);
  if (new Set(liveWorkIds).size !== liveWorkIds.length) {
    throw new Error("Live source contains a duplicate work ID");
  }
  const liveById = new Map(input.works.map((work) => [work.id, work]));
  const goldIds = new Set(input.goldWorkIds);
  for (const frozen of frozenWorks.rows) {
    const workId = frozen.id ?? "";
    const live = liveById.get(workId);
    if (live === undefined) {
      throw new Error(`Pilot ${PILOT_ID} references a missing live work: ${workId}`);
    }
    if (goldIds.has(workId)) {
      throw new Error(`Pilot ${PILOT_ID} cannot include a Gold work: ${workId}`);
    }
    if (live.title !== frozen.title) {
      throw new Error(`Pilot ${PILOT_ID} canonical title changed: ${workId}`);
    }
  }
}

export function validateFrozenPromotionPilot(input: PromotionPilotInput) {
  const packetDirectory = join(resolve(input.root), PACKET_ROOT);
  const manifest = validateStoredPromotionPilotArtifacts(packetDirectory);
  validatePilotLiveIdentity(input, manifest, packetDirectory);
  return manifest;
}

export function validatePromotionPilotArtifacts(
  artifacts: PromotionPilotArtifacts,
  packetDirectory: string,
) {
  validateStoredPromotionPilotArtifacts(packetDirectory);
  for (const [path, content] of artifacts.files) {
    const fullPath = join(packetDirectory, path);
    if (readFileSync(fullPath, "utf8") !== content) {
      throw new Error(`Stale pilot packet artifact: ${path}`);
    }
  }
}

export function runPromotionPilotCli(args: readonly string[], root = process.cwd()) {
  const normalizedArgs = args[0] === "--" ? args.slice(1) : args;
  const check = normalizedArgs.length === 1 && normalizedArgs[0] === "--check";
  if (normalizedArgs.length > 0 && !check) {
    throw new Error("Usage: tsx scripts/build-promotion-pilot.ts [--check]");
  }
  const input = loadPromotionPilotInput(root);
  const packetDirectory = join(resolve(root), PACKET_ROOT);
  if (check) {
    const manifest = validateFrozenPromotionPilot(input);
    console.log(`Verified ${relative(root, packetDirectory)} (${manifest.candidateSha256})`);
    return manifest;
  }
  const artifacts = buildPromotionPilotArtifacts(input);
  for (const [path, content] of artifacts.files) {
    const outputPath = join(packetDirectory, path);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, content, "utf8");
  }
  validatePromotionPilotArtifacts(artifacts, packetDirectory);
  console.log(`Wrote ${relative(root, packetDirectory)} (${artifacts.manifest.candidateSha256})`);
  return artifacts.manifest;
}

const invokedPath = process.argv[1];
if (invokedPath !== undefined && import.meta.url === pathToFileURL(resolve(invokedPath)).href) {
  try {
    runPromotionPilotCli(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
