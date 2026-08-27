import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import { runCatalogPipeline } from "./catalog/pipeline";
import { rejectModelDerivedAuthoringWrite } from "./catalog/candidate-quarantine";
import { formatSourceIssue } from "./catalog/report";

const TARGET_IDS_SHA256 = "7904dc8f869cb9a116ea25b05c888a7c3ec4f60a720a45e3fbd7e04ae3e59841";
const APPROVAL_MANIFEST_SHA256 = "b20026871a55c17102c6c6df7dfb3bc410f83d87e25bd0ebe918cf6ebb4b290e";
const REVIEW_REFERENCE = "reviews/g2-catalog-annotation-panel.md";
const REVIEW_REPORT = "reviews/g2-catalog-annotation-cycle-7-v3-report.md";
const RESPONSE_CONTRACT = {
  local: [
    "Local panel row: GO",
    "Panel-row authorization: RECORD_LOCAL_GO_ROW",
    "Overall G2 / Slice 5 authorization: NOT_GRANTED_BY_LOCAL_ALONE",
  ],
  gemini: [
    "Gemini panel row: GO",
    "Panel-row authorization: RECORD_GEMINI_GO_ROW",
    "Overall G2 / Slice 5 authorization: NOT_GRANTED_BY_GEMINI_ALONE",
  ],
  grok: [
    "Grok panel row: GO",
    "Panel-row authorization: RECORD_GROK_GO_ROW",
    "Overall G2 / Slice 5 authorization: NOT_GRANTED_BY_GROK_ALONE",
  ],
  oracle: [
    "Oracle panel row: GO",
    "Panel-row authorization: RECORD_ORACLE_GO_ROW",
    "Overall G2 / Slice 5 authorization: NOT_GRANTED_BY_ORACLE_ALONE",
  ],
} as const;
const CANDIDATE_SOURCE_FILES = [
  "aliases.csv",
  "evidence/art-evidence-manifest.csv",
  "evidence/evidence.csv",
  "factors.csv",
  "recommendation-config.csv",
  "recommendation-context.csv",
  "themes.csv",
  "volumes.csv",
  "works.csv",
] as const;
const CANDIDATE_GENERATED_FILES = [
  "catalog-v1.json",
  "recommendation-context-v1.json",
  "taste-vs-baseline.md",
] as const;
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

const catalogIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const bindingSchema = z.strictObject({ path: z.string().min(1), sha256: sha256Schema });
const exactBinding = <const Path extends string>(path: Path) =>
  z.strictObject({ path: z.literal(path), sha256: sha256Schema });

const approvalManifestSchema = z.strictObject({
  schemaVersion: z.literal(1),
  policyVersion: z.literal("g2-catalog-annotation-authorized-model-panel-v1"),
  approvalScope: z.literal("catalog-annotation-only"),
  annotationReviewedAt: z.iso.datetime({ offset: true }),
  reviewReference: z.literal(REVIEW_REFERENCE),
  reviewedRepository: z.literal("fromiron/konocomics"),
  reviewedBranch: z.literal("main"),
  reviewedHead: z.literal("cc71d38d573cd24c520cbef62c607ee7a876490f"),
  exactHeadCi: z.strictObject({ runId: z.literal(31682502622), status: z.literal("success") }),
  evidenceZip: z.strictObject({
    filename: z.literal("konocomics-g2-four-path-v3.zip"),
    sha256: z.literal("cee690a0b2a35b12c5cdfd655bdf84b13e7d1a22470e46a6d690cdb908d818c4"),
  }),
  targetWorkIds: z.array(catalogIdSchema).length(101),
  targetWorkIdsSha256: z.literal(TARGET_IDS_SHA256),
  preApprovalBindings: z.strictObject({
    candidateSource: z.array(bindingSchema).length(9),
    candidateGenerated: z.array(bindingSchema).length(3),
  }),
  request: exactBinding("reviews/g2-catalog-annotation-cycle-7-v3-request.md"),
  panelReport: exactBinding(REVIEW_REPORT),
  responses: z.strictObject({
    local: exactBinding("reviews/g2-catalog-annotation-cycle-7-v3-local-response.txt"),
    gemini: exactBinding("reviews/g2-catalog-annotation-cycle-7-v3-gemini-response.txt"),
    grok: exactBinding("reviews/g2-catalog-annotation-cycle-7-v3-grok-response.txt"),
    oracle: exactBinding("reviews/g2-catalog-annotation-cycle-7-v3-oracle-response.txt"),
  }),
  validities: z.strictObject({
    local: exactBinding("reviews/g2-catalog-annotation-cycle-7-v3-local-validity.md"),
    gemini: exactBinding("reviews/g2-catalog-annotation-cycle-7-v3-gemini-validity.md"),
    grok: exactBinding("reviews/g2-catalog-annotation-cycle-7-v3-grok-validity.md"),
    oracle: exactBinding("reviews/g2-catalog-annotation-cycle-7-v3-oracle-validity.md"),
  }),
});

type ApprovalSnapshot = {
  catalog: string;
  recommendationContext: string;
  candidateFiles: Readonly<Record<string, string>>;
};
type DirectorySwap = { candidate: string; output: string; backup: string };
type PublishOperations = {
  existsSync(path: string): boolean;
  renameSync(source: string, destination: string): void;
  rmSync(path: string, options: { recursive: true; force: true }): void;
};

function hash(content: string | Buffer) {
  return createHash("sha256").update(content).digest("hex");
}

function fileHash(path: string) {
  return hash(readFileSync(path));
}

function parseWorksCsv(content: string) {
  const matrix = z
    .array(z.array(z.string()))
    .parse(parse(content, { bom: true, relax_column_count: false, skip_empty_lines: true }));
  const [headers, ...rows] = matrix;
  if (headers === undefined || headers.join("\u0000") !== WORK_HEADERS.join("\u0000")) {
    throw new Error("Unexpected works.csv header");
  }
  if (rows.some((row) => row.length !== headers.length)) {
    throw new Error("Unexpected works.csv column count");
  }
  return { headers, rows };
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeCsv(headers: readonly string[], rows: readonly (readonly string[])[]) {
  return `${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function codeUnitCompare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function deriveG2AnnotationTargets(baselineDir: string, candidateDir: string) {
  const baseline = parseWorksCsv(readFileSync(join(baselineDir, "works.csv"), "utf8"));
  const candidate = parseWorksCsv(readFileSync(join(candidateDir, "works.csv"), "utf8"));
  const idIndex = WORK_HEADERS.indexOf("id");
  const methodIndex = WORK_HEADERS.indexOf("annotationReviewMethod");
  const baselineIds = new Set(baseline.rows.map((row) => row[idIndex]!));
  if (baselineIds.size !== baseline.rows.length || baseline.rows.length !== 50) {
    throw new Error("G2 baseline must contain exactly 50 unique works");
  }
  const candidateIds = candidate.rows.map((row) => row[idIndex]!);
  if (new Set(candidateIds).size !== candidateIds.length || candidate.rows.length !== 150) {
    throw new Error("G2 candidate must contain exactly 150 unique works");
  }
  if ([...baselineIds].some((id) => !candidateIds.includes(id))) {
    throw new Error("G2 candidate does not retain the complete baseline cohort");
  }
  const targetIds = candidate.rows
    .filter((row) => row[methodIndex] === "unreviewed")
    .map((row) => row[idIndex]!)
    .sort(codeUnitCompare);
  if (targetIds.length !== 101) {
    throw new Error(
      `G2 approval requires exactly 101 unreviewed works, received ${targetIds.length}`,
    );
  }
  const targetIdsSha256 = hash(`${targetIds.join("\n")}\n`);
  if (targetIdsSha256 !== TARGET_IDS_SHA256) {
    throw new Error(`G2 target identity mismatch: ${targetIdsSha256}`);
  }
  return { targetIds, targetIdsSha256 };
}

function expectedPreApprovalPaths() {
  return [
    ...CANDIDATE_SOURCE_FILES.map((path) => `candidate-source/${path}`),
    ...CANDIDATE_GENERATED_FILES.map((path) => `candidate-generated/${path}`),
  ];
}

export function loadG2CatalogApproval(
  root: string,
  snapshot: ApprovalSnapshot,
  targetIds: readonly string[],
  expectedManifestSha256 = APPROVAL_MANIFEST_SHA256,
) {
  const stagingDirectory = join(root, "data/staging/g2");
  const manifestPath = join(stagingDirectory, "g2-catalog-annotation-approval.json");
  const manifestBytes = readFileSync(manifestPath);
  if (hash(manifestBytes) !== expectedManifestSha256) {
    throw new Error("G2 approval manifest hash does not match the frozen authorization");
  }
  const manifest = approvalManifestSchema.parse(
    JSON.parse(manifestBytes.toString("utf8")) as unknown,
  );
  const canonicalTargetIds = [...targetIds].sort(codeUnitCompare);
  if (
    new Set(canonicalTargetIds).size !== 101 ||
    JSON.stringify(manifest.targetWorkIds) !== JSON.stringify(canonicalTargetIds) ||
    hash(`${canonicalTargetIds.join("\n")}\n`) !== manifest.targetWorkIdsSha256
  ) {
    throw new Error("G2 approval target work IDs do not match the current candidate");
  }

  const sourceBindings = manifest.preApprovalBindings.candidateSource;
  const generatedBindings = manifest.preApprovalBindings.candidateGenerated;
  const preApprovalBindings = [...sourceBindings, ...generatedBindings];
  const actualPaths = preApprovalBindings.map(({ path }) => path);
  const expectedPaths = expectedPreApprovalPaths();
  if (
    new Set(actualPaths).size !== actualPaths.length ||
    JSON.stringify([...actualPaths].sort(codeUnitCompare)) !==
      JSON.stringify([...expectedPaths].sort(codeUnitCompare))
  ) {
    throw new Error("G2 pre-approval bindings must cover the exact candidate source and outputs");
  }
  for (const binding of preApprovalBindings) {
    const expectedHash = snapshot.candidateFiles[binding.path];
    if (
      expectedHash === undefined ||
      expectedHash !== binding.sha256 ||
      fileHash(join(stagingDirectory, binding.path)) !== binding.sha256
    ) {
      throw new Error(`G2 pre-approval file hash mismatch: ${binding.path}`);
    }
  }
  if (
    snapshot.catalog !== snapshot.candidateFiles["candidate-generated/catalog-v1.json"] ||
    snapshot.recommendationContext !==
      snapshot.candidateFiles["candidate-generated/recommendation-context-v1.json"]
  ) {
    throw new Error("G2 generated snapshot does not match its candidate file bindings");
  }

  const reviewBindings = [
    manifest.request,
    manifest.panelReport,
    ...Object.values(manifest.responses),
    ...Object.values(manifest.validities),
  ];
  for (const binding of reviewBindings) {
    if (fileHash(join(stagingDirectory, binding.path)) !== binding.sha256) {
      throw new Error(`G2 review file hash mismatch: ${binding.path}`);
    }
  }
  for (const response of Object.values(manifest.responses)) {
    const [verdict] = readFileSync(join(stagingDirectory, response.path), "utf8").split(/\r?\n/u);
    if (verdict !== "GO") {
      throw new Error(`G2 approval response must start with exactly GO: ${response.path}`);
    }
  }
  for (const reviewer of Object.keys(RESPONSE_CONTRACT) as (keyof typeof RESPONSE_CONTRACT)[]) {
    const content = readFileSync(join(stagingDirectory, manifest.responses[reviewer].path), "utf8");
    for (const requiredLine of RESPONSE_CONTRACT[reviewer]) {
      if (!content.split(/\r?\n/u).includes(requiredLine)) {
        throw new Error(
          `G2 approval response is missing ${requiredLine}: ${manifest.responses[reviewer].path}`,
        );
      }
    }
  }
  const report = readFileSync(join(stagingDirectory, manifest.panelReport.path), "utf8");
  for (const requiredDecision of [
    "`PROMOTION AUTHORIZATION: YES`",
    "`PRODUCT-DIRECTION G2 AUTHORIZATION: NO`",
    "`SLICE 5 AUTHORIZATION: NO`",
  ]) {
    if (!report.includes(requiredDecision)) {
      throw new Error(`G2 panel report is missing scope decision ${requiredDecision}`);
    }
  }
  return manifest;
}

export function applyG2AnnotationApproval(
  worksCsv: string,
  targetIds: readonly string[],
  reviewedAt: string,
  reference: string,
) {
  z.iso.datetime({ offset: true }).parse(reviewedAt);
  if (reference !== REVIEW_REFERENCE) {
    throw new Error(`G2 review reference must be ${REVIEW_REFERENCE}`);
  }
  const { headers, rows } = parseWorksCsv(worksCsv);
  const idIndex = WORK_HEADERS.indexOf("id");
  const methodIndex = WORK_HEADERS.indexOf("annotationReviewMethod");
  const reviewedAtIndex = WORK_HEADERS.indexOf("annotationReviewedAt");
  const referenceIndex = WORK_HEADERS.indexOf("annotationReviewReference");
  const canonicalTargets = [...targetIds].sort(codeUnitCompare);
  const unreviewedIds = rows
    .filter((row) => row[methodIndex] === "unreviewed")
    .map((row) => row[idIndex]!)
    .sort(codeUnitCompare);
  if (
    new Set(canonicalTargets).size !== canonicalTargets.length ||
    JSON.stringify(canonicalTargets) !== JSON.stringify(unreviewedIds)
  ) {
    throw new Error("G2 annotation approval targets must exactly equal the unreviewed works");
  }
  const targetSet = new Set(canonicalTargets);
  const seen = new Set<string>();
  const approvedRows = rows.map((row) => {
    const id = row[idIndex]!;
    if (!targetSet.has(id)) {
      return row;
    }
    if (seen.has(id)) {
      throw new Error(`Duplicate G2 target work: ${id}`);
    }
    seen.add(id);
    if (
      row[methodIndex] !== "unreviewed" ||
      row[reviewedAtIndex] !== "" ||
      row[referenceIndex] !== ""
    ) {
      throw new Error(`G2 target is not in the expected unreviewed state: ${id}`);
    }
    const next = [...row];
    next[methodIndex] = "authorizedModelPanel";
    next[reviewedAtIndex] = reviewedAt;
    next[referenceIndex] = reference;
    return next;
  });
  const missing = canonicalTargets.filter((id) => !seen.has(id));
  if (missing.length > 0) {
    throw new Error(`G2 approval targets are missing from works.csv: ${missing.join(",")}`);
  }
  return serializeCsv(headers, approvedRows);
}

export function publishDirectorySet(
  swaps: readonly DirectorySwap[],
  operations: PublishOperations = { existsSync, renameSync, rmSync },
) {
  const uniquePaths = new Set(
    swaps.flatMap(({ candidate, output, backup }) => [candidate, output, backup]),
  );
  if (uniquePaths.size !== swaps.length * 3) {
    throw new Error("Directory publish paths must be unique");
  }
  for (const swap of swaps) {
    if (!operations.existsSync(swap.candidate)) {
      throw new Error(`Publish candidate does not exist: ${swap.candidate}`);
    }
    if (operations.existsSync(swap.backup)) {
      throw new Error(`Publish backup path already exists: ${swap.backup}`);
    }
  }
  const prepared: { swap: DirectorySwap; hadOutput: boolean; published: boolean }[] = [];
  try {
    for (const swap of swaps) {
      const hadOutput = operations.existsSync(swap.output);
      if (hadOutput) {
        operations.renameSync(swap.output, swap.backup);
      }
      prepared.push({ swap, hadOutput, published: false });
      operations.renameSync(swap.candidate, swap.output);
      prepared[prepared.length - 1]!.published = true;
    }
  } catch (publishError) {
    const rollbackErrors: unknown[] = [];
    for (const item of [...prepared].reverse()) {
      try {
        if (item.published && operations.existsSync(item.swap.output)) {
          operations.renameSync(item.swap.output, item.swap.candidate);
        }
        if (item.hadOutput && operations.existsSync(item.swap.backup)) {
          operations.renameSync(item.swap.backup, item.swap.output);
        }
      } catch (rollbackError) {
        rollbackErrors.push(rollbackError);
      }
    }
    if (rollbackErrors.length > 0) {
      throw new AggregateError(
        [publishError, ...rollbackErrors],
        "G2 catalog publish failed and rollback was incomplete",
      );
    }
    throw publishError;
  }
  for (const { swap, hadOutput } of prepared) {
    if (hadOutput) {
      try {
        operations.rmSync(swap.backup, { recursive: true, force: true });
      } catch (error) {
        console.warn(
          `Published G2 catalog, but could not remove backup ${swap.backup}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }
}

function writeJson(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
}

function assertPreApprovalPipeline(sourceDirectory: string) {
  const result = runCatalogPipeline(sourceDirectory);
  const errors = result.issues.filter((issue) => issue.severity === "error");
  const reviewErrors = errors.filter((issue) => issue.code === "UNREVIEWED_ELIGIBILITY");
  const unexpected = errors.filter((issue) => issue.code !== "UNREVIEWED_ELIGIBILITY");
  if (reviewErrors.length !== 101 || unexpected.length > 0) {
    for (const issue of result.issues) {
      console.error(formatSourceIssue(issue));
    }
    throw new Error(
      `G2 pre-approval validation requires 101 review errors and no others; received ${reviewErrors.length} and ${unexpected.length}`,
    );
  }
  const warningCounts = Object.fromEntries(
    result.issues
      .filter((issue) => issue.severity === "warning")
      .map((issue) => issue.code)
      .reduce<Map<string, number>>((counts, code) => {
        counts.set(code, (counts.get(code) ?? 0) + 1);
        return counts;
      }, new Map()),
  );
  if (
    warningCounts.AUTHORIZED_MODEL_PANEL_REVIEW !== 49 ||
    warningCounts.EVIDENCE_NOT_HUMAN_REVIEWED !== 416 ||
    Object.keys(warningCounts).length !== 2
  ) {
    throw new Error(`Unexpected G2 pre-approval warnings: ${JSON.stringify(warningCounts)}`);
  }
  return result;
}

function assertNoPipelineErrors(sourceDirectory: string) {
  const result = runCatalogPipeline(sourceDirectory);
  const errors = result.issues.filter((issue) => issue.severity === "error");
  if (errors.length > 0) {
    for (const issue of result.issues) {
      console.error(formatSourceIssue(issue));
    }
    throw new Error(`Approved G2 catalog validation failed with ${errors.length} errors`);
  }
  const warningCounts = Object.fromEntries(
    result.issues
      .filter((issue) => issue.severity === "warning")
      .map((issue) => issue.code)
      .reduce<Map<string, number>>((counts, code) => {
        counts.set(code, (counts.get(code) ?? 0) + 1);
        return counts;
      }, new Map()),
  );
  if (
    warningCounts.AUTHORIZED_MODEL_PANEL_REVIEW !== 150 ||
    warningCounts.EVIDENCE_NOT_HUMAN_REVIEWED !== 416 ||
    Object.keys(warningCounts).length !== 2
  ) {
    throw new Error(`Unexpected approved G2 warnings: ${JSON.stringify(warningCounts)}`);
  }
  return result;
}

export function promoteG2Catalog(root = process.cwd()) {
  rejectModelDerivedAuthoringWrite();
  const stagingDirectory = join(root, "data/staging/g2");
  const baselineDirectory = join(root, "data/source");
  const candidateSourceDirectory = join(stagingDirectory, "candidate-source");
  const candidateGeneratedDirectory = join(stagingDirectory, "candidate-generated");
  const { targetIds } = deriveG2AnnotationTargets(baselineDirectory, candidateSourceDirectory);
  const preApproval = assertPreApprovalPipeline(candidateSourceDirectory);
  const candidateFiles = Object.fromEntries(
    expectedPreApprovalPaths().map((path) => [path, fileHash(join(stagingDirectory, path))]),
  );
  const catalog = hash(`${JSON.stringify(preApproval.catalog, null, 2)}\n`);
  const recommendationContext = hash(`${JSON.stringify(preApproval.context, null, 2)}\n`);
  if (
    catalog !== fileHash(join(candidateGeneratedDirectory, "catalog-v1.json")) ||
    recommendationContext !==
      fileHash(join(candidateGeneratedDirectory, "recommendation-context-v1.json"))
  ) {
    throw new Error("G2 candidate generated artifacts are stale for candidate-source");
  }
  const approval = loadG2CatalogApproval(
    root,
    { catalog, recommendationContext, candidateFiles },
    targetIds,
  );
  const temporaryRoot = mkdtempSync(join(stagingDirectory, ".catalog-promotion-"));
  const nextSource = join(temporaryRoot, "source");
  const nextDataGenerated = join(temporaryRoot, "data-generated");
  const nextSrcGenerated = join(temporaryRoot, "src-generated");
  const backupRoot = join(temporaryRoot, "backups");
  mkdirSync(backupRoot, { recursive: true });
  const swaps = [
    { candidate: nextSource, output: baselineDirectory, backup: join(backupRoot, "source") },
    {
      candidate: nextDataGenerated,
      output: join(root, "data/generated"),
      backup: join(backupRoot, "data-generated"),
    },
    {
      candidate: nextSrcGenerated,
      output: join(root, "src/data/generated"),
      backup: join(backupRoot, "src-generated"),
    },
  ] as const;

  try {
    cpSync(baselineDirectory, nextSource, { recursive: true });
    for (const path of CANDIDATE_SOURCE_FILES) {
      const destination = join(nextSource, path);
      mkdirSync(dirname(destination), { recursive: true });
      cpSync(join(candidateSourceDirectory, path), destination);
    }
    writeFileSync(
      join(nextSource, "works.csv"),
      applyG2AnnotationApproval(
        readFileSync(join(candidateSourceDirectory, "works.csv"), "utf8"),
        targetIds,
        approval.annotationReviewedAt,
        approval.reviewReference,
      ),
      { encoding: "utf8", mode: 0o600 },
    );
    const reportDestination = join(nextSource, approval.reviewReference);
    mkdirSync(dirname(reportDestination), { recursive: true });
    const reportBytes = readFileSync(join(stagingDirectory, approval.panelReport.path));
    if (hash(reportBytes) !== approval.panelReport.sha256) {
      throw new Error("G2 panel report changed during promotion");
    }
    writeFileSync(reportDestination, reportBytes, { mode: 0o600 });

    const approved = assertNoPipelineErrors(nextSource);
    for (const outputDirectory of [nextDataGenerated, nextSrcGenerated]) {
      writeJson(join(outputDirectory, "catalog-v1.json"), approved.catalog);
      writeJson(join(outputDirectory, "recommendation-context-v1.json"), approved.context);
    }

    for (const [path, expectedHash] of Object.entries(candidateFiles)) {
      if (fileHash(join(stagingDirectory, path)) !== expectedHash) {
        throw new Error(`G2 pre-approval candidate changed during promotion: ${path}`);
      }
    }
    if (fileHash(reportDestination) !== approval.panelReport.sha256) {
      throw new Error("G2 published panel report does not match its approval binding");
    }
    loadG2CatalogApproval(root, { catalog, recommendationContext, candidateFiles }, targetIds);
    publishDirectorySet(swaps);
    console.log(
      `Promoted approved ${approved.catalog.works.length}-work G2 catalog ${approved.catalog.catalogVersion}.`,
    );
  } finally {
    if (swaps.some(({ backup }) => existsSync(backup))) {
      console.warn(`Preserved G2 publish backup under ${backupRoot}`);
    } else {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  }
}

const invokedPath = process.argv[1];
if (invokedPath !== undefined && import.meta.url === pathToFileURL(resolve(invokedPath)).href) {
  promoteG2Catalog();
}
