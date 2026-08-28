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
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import { ART_AXIS_IDS, AXIS_IDS } from "../src/domain/catalog/constants";
import { buildCatalog } from "./build-catalog";
import {
  ART_EVIDENCE_MANIFEST_FILE,
  artEvidenceManifestHeaders,
  artEvidenceManifestRowSchema,
  validateArtEvidence,
} from "./catalog/art-evidence";
import { loadCatalogSource, parseCsvContent } from "./catalog/load-source";
import { assertLegacyModelWriteMode } from "./catalog/candidate-quarantine";
import { runCatalogPipeline } from "./catalog/pipeline";
import { formatSourceIssue } from "./catalog/report";
import {
  evidenceSourceRowSchema,
  factorSourceRowSchema,
  recommendationContextSourceRowSchema,
  themeSourceRowSchema,
  workSourceRowSchema,
} from "./catalog/source-schema";
import { loadPromotionPilotInput, validateFrozenPromotionPilot } from "./build-promotion-pilot";
import { PROMOTION_REGISTRY_HEADERS, runPromotionRegistry } from "./build-promotion-registry";
import { publishDirectorySet } from "./promote-g2-catalog";
import { validateGoldSet } from "./validate-catalog-expansion";

const PILOT_ID = "pilot-001";
const PILOT_ROOT = `data/staging/catalog-expansion/pilots/${PILOT_ID}`;
const OVERLAY_ROOT = `${PILOT_ROOT}/final-overlay`;
const APPROVAL_FILE = "promotion-approval.json";
const APPROVAL_SHA256 = "58e5dc38d65a726060525685d5c6e6fbe389484e5255ebe707c39aef5d3ceec1";
const LEGACY_MISSING_REVIEW_BINDINGS = new Map([
  [
    `${PILOT_ROOT}/reviews/art-salvage-four/eleven-gemini-counted.log`,
    "6c66afbaf1f729b61115ec2179a0dc750bd743f56b4d5b38dad7b8263fada211",
  ],
  [
    `${PILOT_ROOT}/reviews/art-salvage-four/hyoryu-gemini-counted.log`,
    "1314073351a0bbfb453213b4b27411a7f9038c8197636cce2cb0d0214edd1646",
  ],
  [
    `${PILOT_ROOT}/reviews/art-salvage-four/hyoryu-gemini-excluded.log`,
    "63da906cc379dbe464d3b65df35e1863086a28666d879df58f712f803c89ce9e",
  ],
  [
    `${PILOT_ROOT}/reviews/art-salvage-four/urusei-gemini-counted.log`,
    "5229643cd03f81dc6c97af0efe8156e8da4ff340f1960ae32fd1bd2eea28ae37",
  ],
  [
    `${PILOT_ROOT}/reviews/art-salvage-four/yawara-gemini-counted.log`,
    "9a7cdd0ee4cbff4fbc2d160a0c8f18cf047426d302b48e82345e958e9318389f",
  ],
]);
const REVIEW_REFERENCE = "reviews/pilot-001-promotion-panel.md";
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
const FACTOR_HEADERS = ["workId", "axisId", "state", "value", "confidence", "evidenceId"] as const;
const THEME_HEADERS = ["workId", "themeId", "centrality", "confidence", "evidenceId"] as const;
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
const CONTEXT_HEADERS = [
  "workId",
  "catalogRole",
  "seriesGroupId",
  "volumeCount",
  "reviewAverage",
  "reviewCount",
] as const;
const APPLIED_OVERLAY_FILES = {
  works: "works-final.csv",
  factors: "factors-final.csv",
  themes: "themes-final.csv",
  evidence: "evidence-final.csv",
  artEvidence: "art-evidence-manifest-final.csv",
  context: "recommendation-context-final.csv",
  review: "pilot-001-promotion-panel.md",
} as const;
const PUBLISH_PATHS = [
  "data/source",
  "data/generated",
  "src/data/generated",
  "public/catalog",
  "data/staging/catalog-expansion",
] as const;

const catalogIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const approvalSchema = z.strictObject({
  schemaVersion: z.literal(1),
  policyVersion: z.literal("promotion-evidence-v2"),
  batchId: z.literal(PILOT_ID),
  candidateSha256: sha256Schema,
  annotationReviewedAt: z.iso.datetime({ offset: true }),
  reviewMethod: z.literal("authorizedModelPanel"),
  reviewedByHuman: z.literal(false),
  humanValidation: z.literal("NOT_RUN"),
  decision: z.literal("GO"),
  hardBlockerCount: z.literal(0),
  panel: z.strictObject({
    localCodex: z.strictObject({ art: z.literal("PASS"), nonArt: z.literal("PASS") }),
    gemini: z.strictObject({
      model: z.literal("gemini-3.7-flash-high"),
      effort: z.literal("high"),
      art: z.literal("PASS"),
    }),
    grok: z.strictObject({
      model: z.literal("cursor-grok-4.6-high"),
      mode: z.literal("non-fast"),
      nonArt: z.literal("PASS"),
      art: z.literal("ABSTAIN"),
    }),
    muse: z.strictObject({
      model: z.literal("muse-spark-1.2"),
      status: z.literal("NOT_USED"),
    }),
  }),
  reviewReference: z.literal(REVIEW_REFERENCE),
  targetWorkIds: z.array(catalogIdSchema).length(50),
  bindings: z.array(
    z.strictObject({
      path: z.string().regex(/^[a-z0-9][a-z0-9.-]*$/u),
      sha256: sha256Schema,
    }),
  ),
  reviewBindings: z.array(
    z.strictObject({
      path: z
        .string()
        .regex(
          /^data\/staging\/catalog-expansion\/pilots\/pilot-001\/(?:reviews|research)\/[A-Za-z0-9._/-]+$/u,
        )
        .refine((path) => !path.split("/").includes("..")),
      sha256: sha256Schema,
    }),
  ),
});

type Approval = z.infer<typeof approvalSchema>;
type PreparedPromotion = {
  temporaryRoot: string;
  candidateRoot: string;
  summary: ReturnType<typeof runPromotionRegistry>;
  catalogVersion: string;
  profileWorkCount: number;
  state: "isolated" | "exactlyApplied";
  baselineDigests: Readonly<Record<(typeof PUBLISH_PATHS)[number], string>>;
};

type ApprovalSnapshot = {
  approval: Approval;
  overlayFiles: ReadonlyMap<string, Buffer>;
  reviewFiles: ReadonlyMap<string, Buffer>;
};

const rawRecordsSchema = z.array(z.strictObject({ record: z.array(z.string()), raw: z.string() }));
const stringRecordRowsSchema = z.array(z.record(z.string(), z.string()));

function codeUnitCompare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sha256(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

function directoryDigest(directory: string) {
  const hash = createHash("sha256");
  const visit = (current: string, prefix = "") => {
    for (const entry of readdirSync(current, { withFileTypes: true }).sort((left, right) =>
      codeUnitCompare(left.name, right.name),
    )) {
      const relativePath = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
      const path = join(current, entry.name);
      if (entry.isDirectory()) visit(path, relativePath);
      else if (entry.isFile()) {
        hash.update(relativePath).update("\0").update(readFileSync(path)).update("\0");
      } else throw new Error(`Publish snapshot contains a non-file entry: ${path}`);
    }
  };
  visit(directory);
  return hash.digest("hex");
}

export function getPilotPublishDigests(root: string) {
  return Object.fromEntries(
    PUBLISH_PATHS.map((path) => [path, directoryDigest(join(root, path))]),
  ) as Record<(typeof PUBLISH_PATHS)[number], string>;
}

export function assertPilotPublishSnapshot(
  actual: Readonly<Record<(typeof PUBLISH_PATHS)[number], string>>,
  expected: Readonly<Record<(typeof PUBLISH_PATHS)[number], string>>,
  message: string,
) {
  for (const path of PUBLISH_PATHS) {
    if (actual[path] !== expected[path]) throw new Error(`${message}: ${path}`);
  }
}

export function validatePilotPanelDecision(options: {
  candidateSha256: string;
  report: string | undefined;
  reviewFiles: ReadonlyMap<string, Buffer>;
}) {
  for (const path of [
    `${PILOT_ROOT}/reviews/review-ledger.md`,
    `${PILOT_ROOT}/reviews/art-final-matrix.csv`,
    `${PILOT_ROOT}/reviews/art-pass-c-adjudication.md`,
  ]) {
    if (!options.reviewFiles.has(path)) {
      throw new Error(`Required model-panel review is not bound: ${path}`);
    }
  }
  if (
    ![...options.reviewFiles].some(
      ([path, bytes]) =>
        path.includes("gemini-art") &&
        bytes.includes("gemini-3.7-flash-high") &&
        bytes.includes("high"),
    ) ||
    ![...options.reviewFiles.keys()].some((path) => path.includes("/art-local-"))
  ) {
    throw new Error("Local and Gemini Art quorum evidence must both be bound");
  }
  for (const chunk of ["01", "02", "03", "04", "05"]) {
    const path = `${PILOT_ROOT}/reviews/grok-current-chunk-${chunk}-response.txt`;
    const response = options.reviewFiles.get(path)?.toString("utf8");
    if (
      response === undefined ||
      !response.includes("model=cursor-grok-4.6-high") ||
      !response.includes("fast=false") ||
      !response.includes(`candidateSha256=${options.candidateSha256}`) ||
      !response.includes("artAccess=abstained") ||
      !response.includes("completionStatus=SUCCESS_AFTER_RESUME")
    ) {
      throw new Error(`Invalid current-SHA Grok review binding: ${path}`);
    }
  }
  for (const requiredLine of [
    "PROMOTION AUTHORIZATION: YES",
    "HUMAN VALIDATION: NOT_RUN",
    "LOCAL ART QUORUM: PASS",
    "GEMINI ART QUORUM: PASS — gemini-3.7-flash-high",
    "GROK ART: ABSTAIN",
    "MUSE: NOT_USED",
    "HARD BLOCKERS: 0",
    `CANDIDATE SHA-256: ${options.candidateSha256}`,
  ]) {
    if (!options.report?.split(/\r?\n/u).includes(requiredLine)) {
      throw new Error(`Pilot panel report is missing exact decision: ${requiredLine}`);
    }
  }
}

function readRawCsv(content: string, expectedHeaders: readonly string[]) {
  const rows = rawRecordsSchema.parse(
    parse(content, {
      bom: true,
      raw: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }) as unknown,
  );
  const [header, ...records] = rows;
  if (
    header === undefined ||
    JSON.stringify(header.record) !== JSON.stringify(expectedHeaders) ||
    rows.map((row) => row.raw).join("") !== content
  ) {
    throw new Error("CSV bytes or header are not canonical");
  }
  return { header, records };
}

export function mergeRawCsv(options: {
  current: string;
  overlay: string;
  headers: readonly string[];
  matches: (record: readonly string[]) => boolean;
  allowedCurrentMatchCounts: readonly number[];
  existingRowsMustMatchOverlay?: boolean;
  existingRowsMayBeOverlaySubset?: boolean;
  normalizeRow?: (row: string) => string;
}) {
  const current = readRawCsv(options.current, options.headers);
  const overlay = readRawCsv(options.overlay, options.headers);
  const currentMatches = current.records.filter((row) => options.matches(row.record));
  const currentMatchCount = currentMatches.length;
  if (!options.allowedCurrentMatchCounts.includes(currentMatchCount)) {
    throw new Error(`Unexpected current overlay row count: ${currentMatchCount}`);
  }
  const currentRawRows = currentMatches.map((row) => row.raw);
  const overlayRawRows = overlay.records.map((row) => row.raw);
  const rawRowsMatch = JSON.stringify(currentRawRows) === JSON.stringify(overlayRawRows);
  const normalizeRow = options.normalizeRow ?? ((row: string) => row);
  const currentRows = currentRawRows.map(normalizeRow);
  const overlayRows = overlayRawRows.map(normalizeRow);
  const rowsMatch = JSON.stringify(currentRows) === JSON.stringify(overlayRows);
  const rowsAreSubset = currentRows.every((row) => overlayRows.includes(row));
  if (
    currentMatches.length > 0 &&
    ((options.existingRowsMustMatchOverlay && !rowsMatch) ||
      (options.existingRowsMayBeOverlaySubset && !rowsAreSubset))
  ) {
    throw new Error("Existing target rows conflict with approved overlay");
  }
  if (rawRowsMatch) return options.current;
  const overlayBytes = overlay.records.map((row) => row.raw).join("");
  let inserted = false;
  const output = [current.header.raw];
  for (const row of current.records) {
    if (!options.matches(row.record)) {
      output.push(row.raw);
      continue;
    }
    if (!inserted) {
      output.push(overlayBytes);
      inserted = true;
    }
  }
  if (!inserted) output.push(overlayBytes);
  const merged = output.join("");
  const mergedRows = readRawCsv(merged, options.headers).records;
  const untouchedBefore = current.records
    .filter((row) => !options.matches(row.record))
    .map((row) => row.raw);
  const untouchedAfter = mergedRows
    .filter((row) => !options.matches(row.record))
    .map((row) => row.raw);
  if (JSON.stringify(untouchedBefore) !== JSON.stringify(untouchedAfter)) {
    throw new Error("A non-target CSV record changed");
  }
  return merged;
}

function readOverlayCsv<T>(
  overlayFiles: ReadonlyMap<string, Buffer>,
  file: string,
  headers: readonly string[],
  schema: z.ZodType<T>,
) {
  const bytes = overlayFiles.get(file);
  if (bytes === undefined) throw new Error(`Approved overlay is missing: ${file}`);
  const content = bytes.toString("utf8");
  readRawCsv(content, headers);
  const parsed = parseCsvContent(file, content, schema);
  if (parsed.issues.length > 0) {
    throw new Error(parsed.issues.map(formatSourceIssue).join("\n"));
  }
  return { content, rows: parsed.rows };
}

function loadApproval(root: string): ApprovalSnapshot {
  const overlayDirectory = join(root, OVERLAY_ROOT);
  const approvalBytes = readFileSync(join(overlayDirectory, APPROVAL_FILE));
  if (sha256(approvalBytes) !== APPROVAL_SHA256) {
    throw new Error("Pilot approval manifest hash does not match the frozen authorization");
  }
  const approval = approvalSchema.parse(JSON.parse(approvalBytes.toString("utf8")) as unknown);
  const boundPaths = approval.bindings.map((binding) => binding.path);
  const actualPaths = readdirSync(overlayDirectory, { withFileTypes: true }).map((entry) => {
    if (!entry.isFile()) throw new Error(`Final overlay must be flat: ${entry.name}`);
    return entry.name;
  });
  const expectedPaths = [APPROVAL_FILE, ...boundPaths].sort(codeUnitCompare);
  if (
    new Set(boundPaths).size !== boundPaths.length ||
    JSON.stringify([...actualPaths].sort(codeUnitCompare)) !== JSON.stringify(expectedPaths)
  ) {
    throw new Error("Promotion approval does not bind the exact final-overlay file set");
  }
  const overlayFiles = new Map<string, Buffer>();
  for (const binding of approval.bindings) {
    const bytes = readFileSync(join(overlayDirectory, binding.path));
    if (sha256(bytes) !== binding.sha256) {
      throw new Error(`Final-overlay hash mismatch: ${binding.path}`);
    }
    overlayFiles.set(binding.path, bytes);
  }
  for (const file of Object.values(APPLIED_OVERLAY_FILES)) {
    if (!boundPaths.includes(file)) throw new Error(`Required overlay is not bound: ${file}`);
  }
  const reviewFiles = new Map<string, Buffer>();
  const reviewBindings = new Map(
    approval.reviewBindings.map((binding) => [binding.path, binding.sha256]),
  );
  if (reviewBindings.size !== approval.reviewBindings.length) {
    throw new Error("Promotion approval contains duplicate model-panel review bindings");
  }
  for (const [path, expectedSha256] of LEGACY_MISSING_REVIEW_BINDINGS) {
    if (reviewBindings.get(path) !== expectedSha256) {
      throw new Error(`Promotion approval does not bind the legacy review identity: ${path}`);
    }
  }
  for (const binding of approval.reviewBindings) {
    const path = join(root, binding.path);
    if (!existsSync(path)) {
      if (LEGACY_MISSING_REVIEW_BINDINGS.get(binding.path) === binding.sha256) continue;
      throw new Error(`Model-panel review is missing: ${binding.path}`);
    }
    const bytes = readFileSync(path);
    if (sha256(bytes) !== binding.sha256) {
      throw new Error(`Model-panel review hash mismatch: ${binding.path}`);
    }
    reviewFiles.set(binding.path, bytes);
  }
  validatePilotPanelDecision({
    candidateSha256: approval.candidateSha256,
    report: overlayFiles.get(APPLIED_OVERLAY_FILES.review)?.toString("utf8"),
    reviewFiles,
  });
  return { approval, overlayFiles, reviewFiles };
}

function exactWorkSet(values: readonly string[], approval: Approval, label: string) {
  if (
    values.length !== approval.targetWorkIds.length ||
    new Set(values).size !== values.length ||
    JSON.stringify(values) !== JSON.stringify(approval.targetWorkIds)
  ) {
    throw new Error(`${label} does not contain the exact ordered Pilot work set`);
  }
}

function validateOverlay(
  root: string,
  approval: Approval,
  overlayFiles: ReadonlyMap<string, Buffer>,
) {
  const works = readOverlayCsv(
    overlayFiles,
    APPLIED_OVERLAY_FILES.works,
    WORK_HEADERS,
    workSourceRowSchema,
  );
  const factors = readOverlayCsv(
    overlayFiles,
    APPLIED_OVERLAY_FILES.factors,
    FACTOR_HEADERS,
    factorSourceRowSchema,
  );
  const themes = readOverlayCsv(
    overlayFiles,
    APPLIED_OVERLAY_FILES.themes,
    THEME_HEADERS,
    themeSourceRowSchema,
  );
  const evidence = readOverlayCsv(
    overlayFiles,
    APPLIED_OVERLAY_FILES.evidence,
    EVIDENCE_HEADERS,
    evidenceSourceRowSchema,
  );
  const artEvidence = readOverlayCsv(
    overlayFiles,
    APPLIED_OVERLAY_FILES.artEvidence,
    artEvidenceManifestHeaders,
    artEvidenceManifestRowSchema,
  );
  const context = readOverlayCsv(
    overlayFiles,
    APPLIED_OVERLAY_FILES.context,
    CONTEXT_HEADERS,
    recommendationContextSourceRowSchema,
  );
  exactWorkSet(
    works.rows.map((row) => row.value.id),
    approval,
    "Work overlay",
  );
  exactWorkSet(
    context.rows.map((row) => row.value.workId),
    approval,
    "Recommendation context overlay",
  );
  const expectedFactorPairs = approval.targetWorkIds.flatMap((workId) =>
    AXIS_IDS.map((axisId) => `${workId}\u0000${axisId}`),
  );
  const factorPairs = factors.rows.map((row) => `${row.value.workId}\u0000${row.value.axisId}`);
  if (JSON.stringify(factorPairs) !== JSON.stringify(expectedFactorPairs)) {
    throw new Error("Factor overlay must be the exact ordered 50x17 matrix");
  }
  const targetSet = new Set(approval.targetWorkIds);
  const themePairs = new Set<string>();
  for (const row of themes.rows) {
    const pair = `${row.value.workId}\u0000${row.value.themeId}`;
    if (!targetSet.has(row.value.workId) || themePairs.has(pair)) {
      throw new Error(`Invalid Theme overlay pair: ${pair}`);
    }
    themePairs.add(pair);
  }
  if (
    approval.targetWorkIds.some((workId) => !themes.rows.some((row) => row.value.workId === workId))
  ) {
    throw new Error("Every Pilot work requires at least one Theme");
  }
  const evidenceIds = evidence.rows.map((row) => row.value.id);
  if (
    new Set(evidenceIds).size !== evidenceIds.length ||
    evidence.rows.length !== 250 ||
    evidence.rows.some(
      (row) =>
        !targetSet.has(row.value.workId) ||
        row.value.reviewedByHuman ||
        row.value.sourceUrl === undefined,
    )
  ) {
    throw new Error("Promotion Evidence must be unique, URL-backed, Pilot-scoped, and non-human");
  }
  const artFactors = factors.rows.filter((row) =>
    ART_AXIS_IDS.includes(row.value.axisId as (typeof ART_AXIS_IDS)[number]),
  );
  if (artFactors.length !== approval.targetWorkIds.length * ART_AXIS_IDS.length) {
    throw new Error("Art Factor overlay must contain exactly 50x4 rows");
  }
  if (artEvidence.rows.length !== approval.targetWorkIds.length * ART_AXIS_IDS.length) {
    throw new Error("Art manifest overlay must contain exactly 50x4 rows");
  }
  if (
    artEvidence.rows.some(
      (row) =>
        !row.value.reviewStatus.split(";").includes("quorum-verified") ||
        !row.value.reviewStatus.split(";").includes("reviewedByHuman=false"),
    )
  ) {
    throw new Error("Every Art state requires model quorum and non-human review provenance");
  }
  const artIssues = validateArtEvidence({
    works: works.rows,
    factors: artFactors,
    evidence: evidence.rows,
    manifest: artEvidence.rows,
  }).filter((issue) => issue.severity === "error");
  if (artIssues.length > 0) throw new Error(artIssues.map(formatSourceIssue).join("\n"));

  const current = loadCatalogSource(join(root, "data/source"));
  if (current.issues.some((issue) => issue.severity === "error")) {
    throw new Error(current.issues.map(formatSourceIssue).join("\n"));
  }
  const currentById = new Map(current.source.works.map((row) => [row.value.id, row.value]));
  const mutable = new Set([
    "genres",
    "onboardingEligible",
    "recommendationEligible",
    "libraryOnly",
    "annotationReviewMethod",
    "annotationReviewedAt",
    "annotationReviewReference",
  ]);
  for (const row of works.rows) {
    const before = currentById.get(row.value.id);
    if (before === undefined) throw new Error(`Pilot work is missing: ${row.value.id}`);
    const stable = (value: Record<string, unknown>) =>
      JSON.stringify(
        Object.fromEntries(Object.entries(value).filter(([key]) => !mutable.has(key))),
      );
    if (
      stable(before) !== stable(row.value) ||
      row.value.onboardingEligible !== true ||
      row.value.recommendationEligible !== true ||
      row.value.libraryOnly !== false ||
      row.value.annotationReviewMethod !== approval.reviewMethod ||
      row.value.annotationReviewedAt !== approval.annotationReviewedAt ||
      row.value.annotationReviewReference !== approval.reviewReference
    ) {
      throw new Error(`Work overlay changes a forbidden field or misses a gate: ${row.value.id}`);
    }
  }
  return { works, factors, themes, evidence, artEvidence, context };
}

function writeMergedSource(options: {
  root: string;
  candidateRoot: string;
  approval: Approval;
  overlayFiles: ReadonlyMap<string, Buffer>;
  overlay: ReturnType<typeof validateOverlay>;
}) {
  const source = join(options.root, "data/source");
  const candidate = join(options.candidateRoot, "data/source");
  cpSync(source, candidate, { recursive: true });
  const targetSet = new Set(options.approval.targetWorkIds);
  const evidenceIdSet = new Set(options.overlay.evidence.rows.map((row) => row.value.id));
  const merge = (
    sourceFile: string,
    overlayFile: string,
    headers: readonly string[],
    matches: (record: readonly string[]) => boolean,
    allowedCurrentMatchCounts: readonly number[],
    existingRowsMustMatch = false,
  ) => {
    const destination = join(candidate, sourceFile);
    const current = readFileSync(join(source, sourceFile), "utf8");
    const overlayBytes = options.overlayFiles.get(overlayFile);
    if (overlayBytes === undefined) throw new Error(`Approved overlay is missing: ${overlayFile}`);
    const overlayContent = overlayBytes.toString("utf8");
    writeFileSync(
      destination,
      mergeRawCsv({
        current,
        overlay: overlayContent,
        headers,
        matches,
        allowedCurrentMatchCounts,
        existingRowsMustMatchOverlay: existingRowsMustMatch,
      }),
      "utf8",
    );
  };
  merge(
    "works.csv",
    APPLIED_OVERLAY_FILES.works,
    WORK_HEADERS,
    (row) => targetSet.has(row[0] ?? ""),
    [50],
  );
  merge(
    "factors.csv",
    APPLIED_OVERLAY_FILES.factors,
    FACTOR_HEADERS,
    (row) => targetSet.has(row[0] ?? ""),
    [850],
  );
  merge(
    "themes.csv",
    APPLIED_OVERLAY_FILES.themes,
    THEME_HEADERS,
    (row) => targetSet.has(row[0] ?? ""),
    [0, options.overlay.themes.rows.length],
    true,
  );
  merge(
    "recommendation-context.csv",
    APPLIED_OVERLAY_FILES.context,
    CONTEXT_HEADERS,
    (row) => targetSet.has(row[0] ?? ""),
    [0, 50],
    true,
  );
  merge(
    "evidence/evidence.csv",
    APPLIED_OVERLAY_FILES.evidence,
    EVIDENCE_HEADERS,
    (row) => evidenceIdSet.has(row[0] ?? ""),
    [0, options.overlay.evidence.rows.length],
    true,
  );
  merge(
    ART_EVIDENCE_MANIFEST_FILE,
    APPLIED_OVERLAY_FILES.artEvidence,
    artEvidenceManifestHeaders,
    (row) => targetSet.has(row[0] ?? ""),
    [0, options.overlay.artEvidence.rows.length],
    true,
  );
  const reviewDestination = join(candidate, options.approval.reviewReference);
  const reviewBytes = options.overlayFiles.get(APPLIED_OVERLAY_FILES.review);
  if (reviewBytes === undefined) throw new Error("Approved review report is missing");
  if (existsSync(reviewDestination) && !readFileSync(reviewDestination).equals(reviewBytes)) {
    throw new Error(`Existing review report conflicts with approved overlay: ${REVIEW_REFERENCE}`);
  }
  mkdirSync(dirname(reviewDestination), { recursive: true });
  writeFileSync(reviewDestination, reviewBytes);
}

function rawRowsByKey(path: string, headers: readonly string[], keyIndex = 0) {
  return new Map(
    readRawCsv(readFileSync(path, "utf8"), headers).records.map((row) => [
      row.record[keyIndex] ?? "",
      row.raw,
    ]),
  );
}

function assertRegistryTransition(
  root: string,
  candidateRoot: string,
  targetIds: readonly string[],
) {
  const baseline = runPromotionRegistry("check", root);
  const candidate = runPromotionRegistry("write", candidateRoot);
  const targetSet = new Set(targetIds);
  const baselineRows = rawRowsByKey(
    join(root, "data/staging/catalog-expansion/promotion-registry.csv"),
    PROMOTION_REGISTRY_HEADERS,
  );
  const candidateRows = rawRowsByKey(
    join(candidateRoot, "data/staging/catalog-expansion/promotion-registry.csv"),
    PROMOTION_REGISTRY_HEADERS,
  );
  for (const [workId, raw] of baselineRows) {
    if (!targetSet.has(workId) && candidateRows.get(workId) !== raw) {
      throw new Error(`Non-target registry row changed: ${workId}`);
    }
  }
  const candidateParsed = stringRecordRowsSchema.parse(
    parse(
      readFileSync(
        join(candidateRoot, "data/staging/catalog-expansion/promotion-registry.csv"),
        "utf8",
      ),
      { columns: true, skip_empty_lines: true },
    ) as unknown,
  );
  if (
    candidateParsed
      .filter((row) => targetSet.has(row.workId ?? ""))
      .some((row) => row.promotionOutcome !== "recommendationVerified")
  ) {
    throw new Error("Every Pilot target must be recommendationVerified");
  }
  const baselinePendingTargets = stringRecordRowsSchema
    .parse(
      parse(
        readFileSync(join(root, "data/staging/catalog-expansion/promotion-registry.csv"), "utf8"),
        { columns: true, skip_empty_lines: true },
      ) as unknown,
    )
    .filter((row) => targetSet.has(row.workId ?? "") && row.promotionOutcome === "pending").length;
  if (
    candidate.goldCount !== 150 ||
    candidate.blockedCount !== baseline.blockedCount ||
    candidate.verifiedCount !== baseline.verifiedCount + baselinePendingTargets ||
    candidate.pendingCount !== baseline.pendingCount - baselinePendingTargets
  ) {
    throw new Error("Pilot promotion registry counts are inconsistent");
  }
  return candidate;
}

function classifyPilotState(
  current: ReturnType<typeof loadCatalogSource>["source"],
  approval: Approval,
  overlay: ReturnType<typeof validateOverlay>,
): PreparedPromotion["state"] {
  const currentWorks = new Map(current.works.map((row) => [row.value.id, row.value]));
  const approvedWorks = new Map(overlay.works.rows.map((row) => [row.value.id, row.value]));
  const exactlyApplied = approval.targetWorkIds.every(
    (workId) =>
      JSON.stringify(currentWorks.get(workId)) === JSON.stringify(approvedWorks.get(workId)),
  );
  if (exactlyApplied) return "exactlyApplied";

  const factorsByWork = new Map<string, typeof current.factors>();
  for (const factor of current.factors) {
    factorsByWork.set(factor.value.workId, [
      ...(factorsByWork.get(factor.value.workId) ?? []),
      factor,
    ]);
  }
  const isolated = approval.targetWorkIds.every((workId) => {
    const work = currentWorks.get(workId);
    const factors = factorsByWork.get(workId) ?? [];
    return (
      work !== undefined &&
      work.libraryOnly &&
      !work.onboardingEligible &&
      !work.recommendationEligible &&
      work.annotationReviewMethod === "unreviewed" &&
      work.annotationReviewedAt === undefined &&
      work.annotationReviewReference === undefined &&
      factors.length === AXIS_IDS.length &&
      factors.every(
        (row) =>
          row.value.state === "unknown" &&
          row.value.value === "" &&
          row.value.confidence === "" &&
          row.value.evidenceId === work.evidenceId,
      )
    );
  });
  if (isolated) return "isolated";
  throw new Error(
    "Pilot source is neither isolated nor exactly applied; partial promotion refused",
  );
}

export function preparePilotPromotion(root = process.cwd()): PreparedPromotion {
  const canonicalRoot = resolve(root);
  const baselineDigests = getPilotPublishDigests(canonicalRoot);
  const { approval, overlayFiles } = loadApproval(canonicalRoot);
  const pilotManifest = validateFrozenPromotionPilot(loadPromotionPilotInput(canonicalRoot));
  if (
    pilotManifest.candidateSha256 !== approval.candidateSha256 ||
    JSON.stringify(pilotManifest.workSet.workIds) !== JSON.stringify(approval.targetWorkIds)
  ) {
    throw new Error("Promotion approval does not bind the frozen Pilot candidate");
  }
  const overlay = validateOverlay(canonicalRoot, approval, overlayFiles);
  const loadedCurrent = loadCatalogSource(join(canonicalRoot, "data/source"));
  const currentWorks = new Map(loadedCurrent.source.works.map((row) => [row.value.id, row.value]));
  const state = classifyPilotState(loadedCurrent.source, approval, overlay);
  const sourceErrors = runCatalogPipeline(join(canonicalRoot, "data/source")).issues.filter(
    (issue) => issue.severity === "error",
  );
  if (sourceErrors.length > 0) throw new Error(sourceErrors.map(formatSourceIssue).join("\n"));

  const temporaryRoot = mkdtempSync(join(canonicalRoot, ".pilot-001-promotion-"));
  const candidateRoot = join(temporaryRoot, "candidate");
  mkdirSync(join(candidateRoot, "data/staging"), { recursive: true });
  try {
    writeMergedSource({
      root: canonicalRoot,
      candidateRoot,
      approval,
      overlayFiles,
      overlay,
    });
    cpSync(
      join(canonicalRoot, "data/staging/catalog-expansion"),
      join(candidateRoot, "data/staging/catalog-expansion"),
      { recursive: true },
    );
    for (const relativePath of ["data/generated", "src/data/generated", "public/catalog"]) {
      const source = join(canonicalRoot, relativePath);
      const destination = join(candidateRoot, relativePath);
      mkdirSync(dirname(destination), { recursive: true });
      if (existsSync(source)) cpSync(source, destination, { recursive: true });
      else mkdirSync(destination, { recursive: true });
    }
    const candidateIssues = runCatalogPipeline(join(candidateRoot, "data/source")).issues.filter(
      (issue) => issue.severity === "error",
    );
    if (candidateIssues.length > 0) {
      throw new Error(candidateIssues.map(formatSourceIssue).join("\n"));
    }
    const goldManifest = JSON.parse(
      readFileSync(
        join(canonicalRoot, "data/staging/catalog-expansion/gold-set-manifest.json"),
        "utf8",
      ),
    ) as unknown;
    validateGoldSet(candidateRoot, goldManifest);
    const summary = assertRegistryTransition(canonicalRoot, candidateRoot, approval.targetWorkIds);
    const built = buildCatalog(candidateRoot);
    const profile = z
      .object({ works: z.array(z.unknown()) })
      .parse(
        JSON.parse(
          readFileSync(
            join(candidateRoot, "data/generated/recommendation-profile-catalog-v1.json"),
            "utf8",
          ),
        ) as unknown,
      );
    const profileWorkCount = profile.works.length;
    if (
      built.catalog.works.length !== currentWorks.size ||
      profileWorkCount !== summary.goldCount + summary.verifiedCount
    ) {
      throw new Error("Generated recommendation projection disagrees with promotion registry");
    }
    assertPilotPublishSnapshot(
      getPilotPublishDigests(canonicalRoot),
      baselineDigests,
      "Live Pilot inputs changed during preparation",
    );
    if (state === "exactlyApplied") {
      assertPilotPublishSnapshot(
        getPilotPublishDigests(candidateRoot),
        baselineDigests,
        "Applied Pilot output drifted from the approved projection",
      );
    }
    return {
      temporaryRoot,
      candidateRoot,
      summary,
      catalogVersion: built.catalog.catalogVersion,
      profileWorkCount,
      state,
      baselineDigests,
    };
  } catch (error) {
    rmSync(temporaryRoot, { recursive: true, force: true });
    throw error;
  }
}

export function runPilotPromotion(mode: "check" | "write", root = process.cwd()) {
  assertLegacyModelWriteMode(mode);
  const canonicalRoot = resolve(root);
  const prepared = preparePilotPromotion(canonicalRoot);
  const backupRoot = join(prepared.temporaryRoot, "backups");
  const swaps = [
    "data/source",
    "data/generated",
    "src/data/generated",
    "public/catalog",
    "data/staging/catalog-expansion",
  ].map((path) => ({
    candidate: join(prepared.candidateRoot, path),
    output: join(canonicalRoot, path),
    backup: join(backupRoot, path),
  }));
  for (const swap of swaps) mkdirSync(dirname(swap.backup), { recursive: true });
  try {
    assertPilotPublishSnapshot(
      getPilotPublishDigests(canonicalRoot),
      prepared.baselineDigests,
      "Live Pilot outputs changed before publish",
    );
    if (mode === "write" && prepared.state === "isolated") publishDirectorySet(swaps);
    return {
      ...prepared.summary,
      catalogVersion: prepared.catalogVersion,
      profileWorkCount: prepared.profileWorkCount,
    };
  } finally {
    if (mode === "check" || !swaps.some((swap) => existsSync(swap.backup))) {
      rmSync(prepared.temporaryRoot, { recursive: true, force: true });
    } else {
      console.warn(`Preserved Pilot promotion backup under ${backupRoot}`);
    }
  }
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    const mode =
      process.argv[2] === "--check" ? "check" : process.argv[2] === "--write" ? "write" : undefined;
    if (mode === undefined)
      throw new Error("Usage: tsx scripts/promote-pilot-001.ts --check|--write");
    const result = runPilotPromotion(mode);
    console.log(
      `Pilot 001 ${mode}: ${result.catalogVersion}; Gold ${result.goldCount}; verified ${result.verifiedCount}; blocked ${result.blockedCount}; pending ${result.pendingCount}; profile ${result.profileWorkCount}.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
