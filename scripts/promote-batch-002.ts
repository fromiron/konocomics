import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import { ART_AXIS_IDS, AXIS_IDS } from "../src/domain/catalog/constants";
import { runBatch002Overlay } from "./build-batch-002-overlay";
import { runBatch003Overlay } from "./build-batch-003-overlay";
import { runBatch004Overlay } from "./build-batch-004-overlay";
import { runBatch005Overlay } from "./build-batch-005-overlay";
import { buildCatalog } from "./build-catalog";
import {
  ART_EVIDENCE_MANIFEST_FILE,
  artEvidenceManifestHeaders,
  artEvidenceManifestRowSchema,
  validateArtEvidence,
} from "./catalog/art-evidence";
import { loadCatalogSource, parseCsvContent } from "./catalog/load-source";
import { runCatalogPipeline } from "./catalog/pipeline";
import { formatSourceIssue } from "./catalog/report";
import {
  evidenceSourceRowSchema,
  factorSourceRowSchema,
  recommendationContextSourceRowSchema,
  themeSourceRowSchema,
  workSourceRowSchema,
} from "./catalog/source-schema";
import {
  PROMOTION_HARD_BLOCKERS,
  PROMOTION_BLOCKER_HEADERS,
  PROMOTION_REGISTRY_HEADERS,
  runPromotionRegistry,
} from "./build-promotion-registry";
import {
  assertPilotPublishSnapshot,
  getPilotPublishDigests,
  mergeRawCsv,
} from "./promote-pilot-001";
import { publishDirectorySet } from "./promote-g2-catalog";
import { validateGoldSet } from "./validate-catalog-expansion";

const batchConfigs = {
  "batch-002": {
    label: "Batch 002",
    reviewFile: "batch-002-promotion-panel.md",
    frozenSha256: "80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6",
    validationSha256: "ea34b2459e967ba27129e0e7522dadfcbb8830a5cb1a90f5af3c2337f0d9432e",
    inputBindingsSha256: "3852eea86b876b9231d549cf044e99a9a396b6adb6c1bd8d9b0ccd9be1e71e2f",
    overlaySchemaVersion: 2,
    verifiedCount: 33,
    blockedCount: 17,
    pendingCount: 0,
    previousReviewSha256: [],
    expectedVerifiedPositions: [
      2, 3, 4, 6, 9, 10, 12, 13, 15, 17, 18, 20, 22, 24, 25, 26, 28, 29, 32, 33, 35, 36, 37, 38, 39,
      40, 41, 42, 43, 44, 45, 46, 48,
    ],
    runOverlay: runBatch002Overlay,
  },
  "batch-003": {
    label: "Batch 003",
    reviewFile: "batch-003-promotion-panel.md",
    frozenSha256: "ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd",
    validationSha256: "e7a4f8ef3c5f52a2d43d59f36a488870075f1ae7afbf1382cc3837fb027117f8",
    inputBindingsSha256: "f4f08de2b64f307247b140ef10810a100bb07e05bd42593130818edf00158bff",
    overlaySchemaVersion: 2,
    verifiedCount: 11,
    blockedCount: 39,
    pendingCount: 0,
    previousReviewSha256: [],
    expectedVerifiedPositions: [1, 4, 6, 8, 10, 15, 16, 26, 29, 47, 50],
    runOverlay: runBatch003Overlay,
  },
  "batch-004": {
    label: "Batch 004",
    reviewFile: "batch-004-promotion-panel.md",
    frozenSha256: "a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1",
    validationSha256: "8c6d9a8d174bf52c3677071f8f7d2c7775ad50a2baa1cde8b652a219915cb9b7",
    inputBindingsSha256: "5ec2b05f096ecb5662ad8d8cfa207cb3ede6e101bc8902a8c015c04a72496a22",
    overlaySchemaVersion: 3,
    verifiedCount: 14,
    blockedCount: 36,
    pendingCount: 0,
    previousReviewSha256: [
      "1ac10464d520f2e349b727c3806741b084e58acf74f7f82a4b53b2fc98c18fc7",
      "d8320aea7eda002d99df600f1f9062615dd61fc34bd4956e6f1fe6c854f29f85",
      "4230fc49ef347a4cfc3fe81c0d48effc9cd9d6667610477687cf48422363fa35",
      "8464207e5178aa7b4bb6181bc6807f2602401ac070cab224dadc8d84105373a4",
    ],
    expectedVerifiedPositions: [3, 7, 9, 14, 17, 18, 20, 21, 24, 41, 43, 44, 47, 49],
    runOverlay: runBatch004Overlay,
  },
  "batch-005": {
    label: "Batch 005",
    reviewFile: "batch-005-promotion-panel.md",
    frozenSha256: "ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8",
    validationSha256: "35023d87f365d500f9fc1e61dac8a5bff1a1e4596e7cda92e783d1f3db114f11",
    inputBindingsSha256: "aa044484a0e2932098e6653b1aa40c6a4a51c7a3ba1cd6796b6a0336bc41cc5a",
    overlaySchemaVersion: 3,
    verifiedCount: 9,
    blockedCount: 9,
    pendingCount: 32,
    previousReviewSha256: [
      "7966dfd51a8985f5076211ae031996b95c15b487c8fbf3c4d77bb103973b5674",
      "b5586fcd1cb2a88667d59175827037d855fc97bc44e87ed1495ca88e7326e934",
      "00acb4c10fa7b5c3ce7510edef35b85d40dce0602e7f271f327e05fd96522e2f",
    ],
    expectedVerifiedPositions: [4, 8, 23, 26, 27, 30, 35, 45, 47],
    runOverlay: runBatch005Overlay,
  },
} as const;
const configuredBatchId = process.env.KONOCOMICS_PROMOTION_BATCH_ID ?? "batch-002";
if (!(configuredBatchId in batchConfigs)) {
  throw new Error(`Unsupported promotion batch: ${configuredBatchId}`);
}
const batchConfig = batchConfigs[configuredBatchId as keyof typeof batchConfigs];
const BATCH_ID = configuredBatchId as keyof typeof batchConfigs;
const BATCH_ROOT = `data/staging/catalog-expansion/batches/${BATCH_ID}`;
const OVERLAY_ROOT = `${BATCH_ROOT}/final-overlay`;
const REVIEW_FILE = batchConfig.reviewFile;
const REVIEW_REFERENCE = `reviews/${REVIEW_FILE}`;
const FROZEN_SHA256 = batchConfig.frozenSha256;
const VALIDATION_SHA256 = batchConfig.validationSha256;
const INPUT_BINDINGS_SHA256 = batchConfig.inputBindingsSha256;
const OVERLAY_SCHEMA_VERSION = batchConfig.overlaySchemaVersion;
const VERIFIED_COUNT: number = batchConfig.verifiedCount;
const BLOCKED_COUNT: number = batchConfig.blockedCount;
const PENDING_COUNT: number = batchConfig.pendingCount;
const EXPECTED_VERIFIED_POSITIONS: readonly number[] = batchConfig.expectedVerifiedPositions;
const PREVIOUS_REVIEW_SHA256: readonly string[] = batchConfig.previousReviewSha256;
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
const FROZEN_HEADERS = ["position", "workId", "canonicalTitle"] as const;
const DECISION_HEADERS = [
  "position",
  "workId",
  "canonicalTitle",
  "narrativeKnown",
  "toneKnown",
  "artKnown",
  "genreCount",
  "themeCount",
  "outcome",
  "blockerCode",
  "blockerDetails",
] as const;
const OVERLAY_FILES = {
  decisions: "promotion-decisions.csv",
  works: "works-final.csv",
  factors: "factors-final.csv",
  themes: "themes-final.csv",
  evidence: "evidence-final.csv",
  artEvidence: "art-evidence-manifest-final.csv",
  context: "recommendation-context-final.csv",
  blockers: "promotion-blockers-final.csv",
  validation: "final-overlay-validation.json",
  review: REVIEW_FILE,
} as const;
const HASHED_OVERLAY_FILES = [
  OVERLAY_FILES.decisions,
  OVERLAY_FILES.works,
  OVERLAY_FILES.factors,
  OVERLAY_FILES.themes,
  OVERLAY_FILES.evidence,
  OVERLAY_FILES.artEvidence,
  OVERLAY_FILES.context,
  OVERLAY_FILES.blockers,
] as const;
const PUBLISH_PATHS = [
  "data/source",
  "data/generated",
  "src/data/generated",
  "public/catalog",
  "data/staging/catalog-expansion",
] as const;

const stringRowSchema = z.record(z.string(), z.string());
const rawRecordsSchema = z.array(z.strictObject({ record: z.array(z.string()), raw: z.string() }));
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const boundPathSchema = z
  .string()
  .refine((path) => path.startsWith(`${BATCH_ROOT}/`))
  .refine((path) => !path.split("/").includes(".."));
const bindingGroupSchema = z.record(boundPathSchema, sha256Schema);
const frozenRowSchema = z.strictObject({
  position: z.string().regex(/^(?:[1-9]|[1-4]\d|50)$/u),
  workId: z.string().min(1),
  canonicalTitle: z.string().min(1),
});
const decisionRowSchema = z.strictObject({
  position: z.string(),
  workId: z.string().min(1),
  canonicalTitle: z.string().min(1),
  narrativeKnown: z.string().regex(/^\d+$/u),
  toneKnown: z.string().regex(/^\d+$/u),
  artKnown: z.string().regex(/^\d+$/u),
  genreCount: z.string().regex(/^\d+$/u),
  themeCount: z.string().regex(/^\d+$/u),
  outcome: z.enum(["pending", "recommendationVerified", "promotionBlocked"]),
  blockerCode: z.string(),
  blockerDetails: z.string(),
});
const blockerRowSchema = z.strictObject({
  workId: z.string().min(1),
  blockerCode: z.string().refine((code) => Object.hasOwn(PROMOTION_HARD_BLOCKERS, code)),
  blockerDetails: z.string().min(1),
  evidenceName: z.string().min(1),
  evidenceUrl: z.url(),
  evidencePublishedAt: z.string().regex(/^\d{4}(?:-\d{2}-\d{2})?$/u),
  retrievedAt: z.iso.date(),
  recheckPath: z.string().min(1),
});
const validationShape = {
  batchId: z.literal(BATCH_ID),
  reviewedByHuman: z.literal(false),
  humanValidation: z.literal("NOT_RUN"),
  targetWorkCount: z.literal(50),
  recommendationVerified: z.literal(VERIFIED_COUNT),
  promotionBlocked: z.literal(BLOCKED_COUNT),
  pending: z.literal(PENDING_COUNT).optional(),
  expectedVerifiedPositions: z.array(z.number().int()).length(VERIFIED_COUNT),
  inputBindings: z.strictObject({
    combinedSha256: z.literal(INPUT_BINDINGS_SHA256),
    files: z.strictObject({
      frozen: bindingGroupSchema,
      request: bindingGroupSchema,
      research: bindingGroupSchema,
      annotation: bindingGroupSchema,
      reviews: bindingGroupSchema,
      adjudication: bindingGroupSchema,
      artPreflight: bindingGroupSchema,
      artReview: bindingGroupSchema,
      contextResearch: bindingGroupSchema,
    }),
  }),
  known: z.strictObject({
    text: z.number().int().nonnegative(),
    art: z.number().int().nonnegative(),
  }),
  unknown: z.strictObject({
    text: z.number().int().nonnegative(),
    art: z.number().int().nonnegative(),
  }),
  files: z.record(z.string(), sha256Schema),
};
const validationSchema =
  OVERLAY_SCHEMA_VERSION === 3
    ? z.strictObject({
        ...validationShape,
        schemaVersion: z.literal(3),
        promotionCoverageThresholds: z.strictObject({
          narrative: z.literal(0.6),
          tone: z.literal(0.6),
          denominator: z.literal("known+unknown; notApplicable excluded"),
        }),
        scoringCoverageThresholds: z.strictObject({
          art: z.literal(0.3),
          effect: z.literal("neutral shrink only; not a promotion gate"),
        }),
      })
    : z.strictObject({
        ...validationShape,
        schemaVersion: z.literal(2),
        coverageThresholds: z.strictObject({
          narrative: z.literal(0.6),
          tone: z.literal(0.6),
          art: z.literal(0.3),
          denominator: z.literal("known+unknown; notApplicable excluded"),
        }),
      });

type Overlay = ReturnType<typeof validateOverlay>;
type PromotionState = "isolated" | "partiallyApplied" | "exactlyApplied";
type PreparedPromotion = {
  temporaryRoot: string;
  candidateRoot: string;
  summary: ReturnType<typeof runPromotionRegistry>;
  catalogVersion: string;
  profileWorkCount: number;
  state: PromotionState;
  baselineDigests: ReturnType<typeof getPilotPublishDigests>;
};

function sha256(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

function readCsv<T>(path: string, headers: readonly string[], schema: z.ZodType<T>) {
  const content = readFileSync(path, "utf8");
  const matrix = z
    .array(z.array(z.string()))
    .parse(
      parse(content, { bom: true, relax_column_count: false, skip_empty_lines: true }) as unknown,
    );
  if (JSON.stringify(matrix[0]) !== JSON.stringify(headers)) {
    throw new Error(`Unexpected CSV header: ${path}`);
  }
  const parsed = parseCsvContent(path, content, schema);
  if (parsed.issues.length > 0) throw new Error(parsed.issues.map(formatSourceIssue).join("\n"));
  return { content, rows: parsed.rows };
}

function readPlainCsv<T>(path: string, headers: readonly string[], schema: z.ZodType<T>) {
  const content = readFileSync(path, "utf8");
  const matrix = z
    .array(z.array(z.string()))
    .parse(
      parse(content, { bom: true, relax_column_count: false, skip_empty_lines: true }) as unknown,
    );
  if (JSON.stringify(matrix[0]) !== JSON.stringify(headers)) {
    throw new Error(`Unexpected CSV header: ${path}`);
  }
  return z
    .array(schema)
    .parse(parse(content, { bom: true, columns: true, skip_empty_lines: true }) as unknown);
}

function exactOrderedSet(actual: readonly string[], expected: readonly string[], label: string) {
  if (
    actual.length !== expected.length ||
    new Set(actual).size !== actual.length ||
    JSON.stringify(actual) !== JSON.stringify(expected)
  ) {
    throw new Error(`${label} does not contain the exact ordered Batch 002 work set`);
  }
}

function validatePanel(report: string) {
  const artEvidenceLines =
    OVERLAY_SCHEMA_VERSION === 3
      ? [
          "COMMUNITY/IMAGE POLICY: promotion-evidence-v3",
          "ART EVIDENCE ROUTE: OPTIONAL — COMMUNITY OR IMAGE",
        ]
      : [
          "LOCAL ART QUORUM: PASS",
          "GEMINI ART QUORUM: PASS — gemini-3.7-flash-high",
          "GROK ART: ABSTAIN",
        ];
  const requiredLines = [
    "PROMOTION AUTHORIZATION: YES",
    "HUMAN VALIDATION: NOT_RUN",
    "REVIEWED BY HUMAN: false",
    ...artEvidenceLines,
    "MUSE: NOT_USED",
    `RECOMMENDATION VERIFIED: ${VERIFIED_COUNT}`,
    `HARD BLOCKERS: ${BLOCKED_COUNT}`,
    `FROZEN WORK SET SHA-256: ${FROZEN_SHA256}`,
    `- Final overlay validation SHA-256: \`${VALIDATION_SHA256}\`.`,
    `- Combined input/review packet SHA-256: \`${INPUT_BINDINGS_SHA256}\`.`,
  ];
  if (PENDING_COUNT > 0) requiredLines.push(`PENDING: ${PENDING_COUNT}`);
  for (const line of requiredLines) {
    if (!report.split(/\r?\n/u).includes(line)) {
      throw new Error(`Batch 002 panel report is missing exact decision: ${line}`);
    }
  }
}

function validateOverlay(root: string) {
  const batchRoot = join(root, BATCH_ROOT);
  const overlayRoot = join(root, OVERLAY_ROOT);
  const frozenPath = join(batchRoot, "frozen-work-set.csv");
  if (sha256(readFileSync(frozenPath)) !== FROZEN_SHA256) {
    throw new Error("Batch 002 frozen work set hash does not match the promotion contract");
  }
  const frozen = readPlainCsv(frozenPath, FROZEN_HEADERS, frozenRowSchema);
  if (
    frozen.length !== 50 ||
    frozen.some((row, index) => row.position !== String(index + 1)) ||
    frozen.some((row) => /[『』]/u.test(row.canonicalTitle))
  ) {
    throw new Error("Batch 002 frozen work set is not the canonical ordered 50-work set");
  }
  const validationBytes = readFileSync(join(overlayRoot, OVERLAY_FILES.validation));
  if (sha256(validationBytes) !== VALIDATION_SHA256) {
    throw new Error(
      "Batch 002 final overlay validation hash does not match the promotion contract",
    );
  }
  const validation = validationSchema.parse(
    JSON.parse(validationBytes.toString("utf8")) as unknown,
  );
  if (
    JSON.stringify(validation.expectedVerifiedPositions) !==
    JSON.stringify(EXPECTED_VERIFIED_POSITIONS)
  ) {
    throw new Error("Batch 002 validation ledger has an unexpected verified-position contract");
  }
  const boundEntries = Object.values(validation.inputBindings.files).flatMap((files) =>
    Object.entries(files),
  );
  if (
    boundEntries.length === 0 ||
    new Set(boundEntries.map(([path]) => path)).size !== boundEntries.length
  ) {
    throw new Error("Batch 002 input binding ledger is empty or contains duplicate paths");
  }
  for (const [path, expectedHash] of boundEntries) {
    const absolutePath = join(root, path);
    if (!existsSync(absolutePath) || sha256(readFileSync(absolutePath)) !== expectedHash) {
      throw new Error(`Batch 002 bound input is missing or changed: ${path}`);
    }
  }
  const combinedHash = sha256(
    `${boundEntries.map(([path, hash]) => `${path}\0${hash}`).join("\n")}\n`,
  );
  if (combinedHash !== INPUT_BINDINGS_SHA256) {
    throw new Error("Batch 002 combined input/review packet hash does not match the contract");
  }
  if (
    JSON.stringify(Object.keys(validation.files).sort()) !==
    JSON.stringify([...HASHED_OVERLAY_FILES].sort())
  ) {
    throw new Error("Batch 002 validation ledger does not bind the exact overlay file set");
  }
  for (const file of HASHED_OVERLAY_FILES) {
    if (sha256(readFileSync(join(overlayRoot, file))) !== validation.files[file]) {
      throw new Error(`Batch 002 overlay hash mismatch: ${file}`);
    }
  }
  const decisions = readPlainCsv(
    join(overlayRoot, OVERLAY_FILES.decisions),
    DECISION_HEADERS,
    decisionRowSchema,
  );
  exactOrderedSet(
    decisions.map((row) => row.workId),
    frozen.map((row) => row.workId),
    "Promotion decisions",
  );
  if (
    decisions.some(
      (row, index) =>
        row.position !== frozen[index]?.position ||
        row.canonicalTitle !== frozen[index]?.canonicalTitle ||
        /[『』]/u.test(row.canonicalTitle) ||
        (row.outcome === "recommendationVerified" &&
          (row.blockerCode !== "" || row.blockerDetails !== "")) ||
        (row.outcome === "pending" && (row.blockerCode !== "" || row.blockerDetails !== "")) ||
        (row.outcome === "promotionBlocked" &&
          (row.blockerDetails === "" ||
            row.blockerCode === "" ||
            new Set(row.blockerCode.split(";")).size !== row.blockerCode.split(";").length ||
            row.blockerCode
              .split(";")
              .some((code) => !Object.hasOwn(PROMOTION_HARD_BLOCKERS, code)))),
    )
  ) {
    throw new Error("Batch 002 decisions conflict with the frozen identity or blocker contract");
  }
  const verifiedIds = decisions
    .filter((row) => row.outcome === "recommendationVerified")
    .map((row) => row.workId);
  const blockedIds = decisions
    .filter((row) => row.outcome === "promotionBlocked")
    .map((row) => row.workId);
  const pendingIds = decisions.filter((row) => row.outcome === "pending").map((row) => row.workId);
  if (
    verifiedIds.length !== VERIFIED_COUNT ||
    blockedIds.length !== BLOCKED_COUNT ||
    pendingIds.length !== PENDING_COUNT
  ) {
    throw new Error("Promotion decisions do not match the configured terminal and pending counts");
  }
  if (
    JSON.stringify(
      decisions
        .filter((row) => row.outcome === "recommendationVerified")
        .map((row) => Number(row.position)),
    ) !== JSON.stringify(EXPECTED_VERIFIED_POSITIONS)
  ) {
    throw new Error("Batch 002 decisions do not match the exact verified-position contract");
  }

  const works = readCsv(join(overlayRoot, OVERLAY_FILES.works), WORK_HEADERS, workSourceRowSchema);
  const factors = readCsv(
    join(overlayRoot, OVERLAY_FILES.factors),
    FACTOR_HEADERS,
    factorSourceRowSchema,
  );
  const themes = readCsv(
    join(overlayRoot, OVERLAY_FILES.themes),
    THEME_HEADERS,
    themeSourceRowSchema,
  );
  const evidence = readCsv(
    join(overlayRoot, OVERLAY_FILES.evidence),
    EVIDENCE_HEADERS,
    evidenceSourceRowSchema,
  );
  const artEvidence = readCsv(
    join(overlayRoot, OVERLAY_FILES.artEvidence),
    artEvidenceManifestHeaders,
    artEvidenceManifestRowSchema,
  );
  const context = readCsv(
    join(overlayRoot, OVERLAY_FILES.context),
    CONTEXT_HEADERS,
    recommendationContextSourceRowSchema,
  );
  const blockers = readPlainCsv(
    join(overlayRoot, OVERLAY_FILES.blockers),
    PROMOTION_BLOCKER_HEADERS,
    blockerRowSchema,
  );
  exactOrderedSet(
    works.rows.map((row) => row.value.id),
    verifiedIds,
    "Work overlay",
  );
  exactOrderedSet(
    context.rows.map((row) => row.value.workId),
    verifiedIds,
    "Recommendation context overlay",
  );
  exactOrderedSet(
    [...new Set(blockers.map((row) => row.workId))],
    blockedIds,
    "Promotion blocker overlay",
  );
  const expectedFactorPairs = verifiedIds.flatMap((workId) =>
    AXIS_IDS.map((axisId) => `${workId}\0${axisId}`),
  );
  if (
    JSON.stringify(factors.rows.map((row) => `${row.value.workId}\0${row.value.axisId}`)) !==
    JSON.stringify(expectedFactorPairs)
  ) {
    throw new Error("Factor overlay must be the exact ordered 33x17 matrix");
  }
  const verifiedSet = new Set(verifiedIds);
  const themePairs = new Set<string>();
  for (const row of themes.rows) {
    const pair = `${row.value.workId}\0${row.value.themeId}`;
    if (!verifiedSet.has(row.value.workId) || themePairs.has(pair)) {
      throw new Error(`Invalid Theme overlay pair: ${pair}`);
    }
    themePairs.add(pair);
  }
  if (verifiedIds.some((workId) => !themes.rows.some((row) => row.value.workId === workId))) {
    throw new Error("Every verified Batch 002 work requires at least one Theme");
  }
  const expectedEvidenceCount =
    OVERLAY_SCHEMA_VERSION === 3 ? VERIFIED_COUNT + artEvidence.rows.length : VERIFIED_COUNT * 5;
  if (
    evidence.rows.length !== expectedEvidenceCount ||
    new Set(evidence.rows.map((row) => row.value.id)).size !== evidence.rows.length ||
    evidence.rows.some(
      (row) =>
        !verifiedSet.has(row.value.workId) ||
        row.value.reviewedByHuman ||
        row.value.sourceUrl === undefined,
    )
  ) {
    throw new Error(
      "Batch 002 Evidence must match the text and optional Art manifest, be unique, URL-backed, and non-human",
    );
  }
  const artFactors = factors.rows.filter((row) =>
    ART_AXIS_IDS.includes(row.value.axisId as (typeof ART_AXIS_IDS)[number]),
  );
  if (
    artFactors.length !== VERIFIED_COUNT * ART_AXIS_IDS.length ||
    (OVERLAY_SCHEMA_VERSION === 2 &&
      artEvidence.rows.length !== VERIFIED_COUNT * ART_AXIS_IDS.length) ||
    (OVERLAY_SCHEMA_VERSION === 3 && artEvidence.rows.length % ART_AXIS_IDS.length !== 0) ||
    artEvidence.rows.some(
      (row) =>
        !row.value.reviewStatus.split(";").includes("quorum-verified") ||
        !row.value.reviewStatus.split(";").includes("reviewedByHuman=false"),
    )
  ) {
    throw new Error("Every image-backed Art state requires non-human Local/Gemini quorum provenance");
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
  const stable = (value: Record<string, unknown>) =>
    JSON.stringify(Object.fromEntries(Object.entries(value).filter(([key]) => !mutable.has(key))));
  for (const [index, frozenRow] of frozen.entries()) {
    const before = currentById.get(frozenRow.workId);
    if (before === undefined || before.title !== frozenRow.canonicalTitle) {
      throw new Error(`Frozen Batch 002 work identity changed: ${frozenRow.workId}`);
    }
    const approved = works.rows.find((row) => row.value.id === frozenRow.workId)?.value;
    if (
      approved !== undefined &&
      (stable(before) !== stable(approved) ||
        approved.onboardingEligible !== true ||
        approved.recommendationEligible !== true ||
        approved.libraryOnly !== false ||
        approved.annotationReviewMethod !== "authorizedModelPanel" ||
        approved.annotationReviewReference !== REVIEW_REFERENCE ||
        approved.annotationReviewedAt === undefined ||
        decisions[index]?.outcome !== "recommendationVerified")
    ) {
      throw new Error(`Work overlay changes a frozen field or misses a gate: ${frozenRow.workId}`);
    }
  }
  const report = readFileSync(join(overlayRoot, OVERLAY_FILES.review), "utf8");
  validatePanel(report);
  return {
    frozenIds: frozen.map((row) => row.workId),
    verifiedIds,
    blockedIds,
    pendingIds,
    decisions,
    works,
    factors,
    themes,
    evidence,
    artEvidence,
    context,
    blockers,
    report,
  };
}

function rawRowsByKey(path: string, headers: readonly string[]) {
  const content = readFileSync(path, "utf8");
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
    JSON.stringify(header.record) !== JSON.stringify(headers) ||
    rows.map((row) => row.raw).join("") !== content
  ) {
    throw new Error(`CSV bytes or header are not canonical: ${path}`);
  }
  return new Map(records.map((row) => [row.record[0] ?? "", row.raw]));
}

function currentBlockerBytes(root: string, targetIds: ReadonlySet<string>) {
  const path = join(root, "data/staging/catalog-expansion/promotion-blockers.csv");
  const rows = rawRecordsSchema.parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      raw: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }) as unknown,
  );
  return rows
    .slice(1)
    .filter((row) => targetIds.has(row.record[0] ?? ""))
    .map((row) => row.raw);
}

function withoutInputBinding(row: string) {
  return row
    .replace(
      /(Combined input\/review packet binding: SHA-256|combined input\/review packet SHA-256)=[0-9a-f]{64}/gu,
      "$1=<binding>",
    )
    .replace(
      /Multiple independent user observations were supplemental only where recorded|Repeated bounded independent community observations may support text or Art claims only where recorded/gu,
      "Community evidence follows the bound promotion policy",
    );
}

function blockerIdentity(row: string) {
  const [record] = z
    .array(z.array(z.string()).length(PROMOTION_BLOCKER_HEADERS.length))
    .length(1)
    .parse(parse(row, { relax_column_count: false }) as unknown);
  return JSON.stringify([
    record?.[0],
    record?.[1],
    record?.[3],
    record?.[4],
    record?.[5],
    record?.[6],
  ]);
}

function classifyState(root: string, overlay: Overlay): PromotionState {
  const loaded = loadCatalogSource(join(root, "data/source"));
  const works = new Map(loaded.source.works.map((row) => [row.value.id, row.value]));
  const factors = new Map<string, typeof loaded.source.factors>();
  for (const factor of loaded.source.factors) {
    factors.set(factor.value.workId, [...(factors.get(factor.value.workId) ?? []), factor]);
  }
  const approved = new Map(overlay.works.rows.map((row) => [row.value.id, row.value]));
  const approvedFactors = new Map<string, typeof overlay.factors.rows>();
  for (const factor of overlay.factors.rows) {
    approvedFactors.set(factor.value.workId, [
      ...(approvedFactors.get(factor.value.workId) ?? []),
      factor,
    ]);
  }
  const targetSet = new Set([...overlay.verifiedIds, ...overlay.blockedIds]);
  const approvedBlockerBytes = readFileSync(
    join(root, OVERLAY_ROOT, OVERLAY_FILES.blockers),
    "utf8",
  );
  const approvedBlockers = rawRecordsSchema
    .parse(
      parse(approvedBlockerBytes, {
        bom: true,
        raw: true,
        relax_column_count: false,
        skip_empty_lines: true,
      }) as unknown,
    )
    .slice(1)
    .map((row) => row.raw);
  const currentBlockers = currentBlockerBytes(root, targetSet);
  const matchesApproved = (workId: string) =>
    JSON.stringify(works.get(workId)) === JSON.stringify(approved.get(workId)) &&
    JSON.stringify((factors.get(workId) ?? []).map((row) => row.value)) ===
      JSON.stringify((approvedFactors.get(workId) ?? []).map((row) => row.value));
  const matchesApprovedWithReviewRefresh = (workId: string) => {
    const currentWork = works.get(workId);
    const approvedWork = approved.get(workId);
    return (
      currentWork !== undefined &&
      approvedWork !== undefined &&
      JSON.stringify({ ...currentWork, annotationReviewedAt: approvedWork.annotationReviewedAt }) ===
        JSON.stringify(approvedWork) &&
      JSON.stringify((factors.get(workId) ?? []).map((row) => row.value)) ===
        JSON.stringify((approvedFactors.get(workId) ?? []).map((row) => row.value))
    );
  };
  const isIsolated = (workId: string) => {
    const work = works.get(workId);
    const workFactors = factors.get(workId) ?? [];
    return (
      work !== undefined &&
      work.libraryOnly &&
      !work.onboardingEligible &&
      !work.recommendationEligible &&
      work.annotationReviewMethod === "unreviewed" &&
      work.annotationReviewedAt === undefined &&
      work.annotationReviewReference === undefined &&
      workFactors.length === AXIS_IDS.length &&
      workFactors.every(
        (row) =>
          row.value.state === "unknown" &&
          row.value.value === "" &&
          row.value.confidence === "" &&
          row.value.evidenceId === work.evidenceId,
      )
    );
  };
  const reportPath = join(root, "data/source", REVIEW_REFERENCE);
  const exactlyApplied =
    overlay.verifiedIds.every(matchesApproved) &&
    JSON.stringify(currentBlockers) === JSON.stringify(approvedBlockers) &&
    existsSync(reportPath) &&
    readFileSync(reportPath, "utf8") === overlay.report;
  if (exactlyApplied) return "exactlyApplied";

  const isolated =
    currentBlockers.length === 0 && !existsSync(reportPath) && overlay.frozenIds.every(isIsolated);
  if (isolated) return "isolated";
  const reportIsKnownPartial =
    existsSync(reportPath) && PREVIOUS_REVIEW_SHA256.includes(sha256(readFileSync(reportPath)));
  const approvedBlockersWithoutBinding = approvedBlockers.map(withoutInputBinding);
  const blockersAreApprovedSubset = currentBlockers
    .map(withoutInputBinding)
    .every((row) => approvedBlockersWithoutBinding.includes(row));
  const blockersKeepApprovedIdentity =
    currentBlockers.length === approvedBlockers.length &&
    JSON.stringify(currentBlockers.map(blockerIdentity)) ===
      JSON.stringify(approvedBlockers.map(blockerIdentity));
  const verifiedSet = new Set(overlay.verifiedIds);
  const partiallyApplied =
    reportIsKnownPartial &&
    (blockersAreApprovedSubset || blockersKeepApprovedIdentity) &&
    overlay.frozenIds.every((workId) =>
      verifiedSet.has(workId)
        ? matchesApproved(workId) || matchesApprovedWithReviewRefresh(workId) || isIsolated(workId)
        : isIsolated(workId),
    );
  if (partiallyApplied) return "partiallyApplied";
  throw new Error(
    "Promotion source is neither isolated, an approved partial state, nor exactly applied",
  );
}

function mergeFile(options: {
  sourceRoot: string;
  candidateRoot: string;
  sourceFile: string;
  overlayFile: string;
  headers: readonly string[];
  matches: (record: readonly string[]) => boolean;
  allowedCurrentMatchCounts: readonly number[];
  existingRowsMustMatchOverlay?: boolean;
  existingRowsMayBeOverlaySubset?: boolean;
  normalizeRow?: (row: string) => string;
}) {
  const current = readFileSync(join(options.sourceRoot, options.sourceFile), "utf8");
  const overlay = readFileSync(
    join(options.candidateRoot, OVERLAY_ROOT, options.overlayFile),
    "utf8",
  );
  const destination = join(options.candidateRoot, options.sourceFile);
  writeFileSync(
    destination,
    mergeRawCsv({
      current,
      overlay,
      headers: options.headers,
      matches: options.matches,
      allowedCurrentMatchCounts: options.allowedCurrentMatchCounts,
      existingRowsMustMatchOverlay: options.existingRowsMustMatchOverlay,
      existingRowsMayBeOverlaySubset: options.existingRowsMayBeOverlaySubset,
      normalizeRow: options.normalizeRow,
    }),
    "utf8",
  );
}

function writeCandidate(root: string, candidateRoot: string, overlay: Overlay) {
  cpSync(join(root, "data/source"), join(candidateRoot, "data/source"), { recursive: true });
  cpSync(
    join(root, "data/staging/catalog-expansion"),
    join(candidateRoot, "data/staging/catalog-expansion"),
    { recursive: true },
  );
  for (const path of ["data/generated", "src/data/generated", "public/catalog"]) {
    const source = join(root, path);
    const destination = join(candidateRoot, path);
    mkdirSync(dirname(destination), { recursive: true });
    if (existsSync(source)) cpSync(source, destination, { recursive: true });
    else mkdirSync(destination, { recursive: true });
  }
  const verifiedSet = new Set(overlay.verifiedIds);
  const targetSet = new Set([...overlay.verifiedIds, ...overlay.blockedIds]);
  const evidenceIds = new Set(overlay.evidence.rows.map((row) => row.value.id));
  const subsetCounts = (count: number) => Array.from({ length: count + 1 }, (_, index) => index);
  mergeFile({
    sourceRoot: root,
    candidateRoot,
    sourceFile: "data/source/works.csv",
    overlayFile: OVERLAY_FILES.works,
    headers: WORK_HEADERS,
    matches: (row) => verifiedSet.has(row[0] ?? ""),
    allowedCurrentMatchCounts: [VERIFIED_COUNT],
  });
  mergeFile({
    sourceRoot: root,
    candidateRoot,
    sourceFile: "data/source/factors.csv",
    overlayFile: OVERLAY_FILES.factors,
    headers: FACTOR_HEADERS,
    matches: (row) => verifiedSet.has(row[0] ?? ""),
    allowedCurrentMatchCounts: [VERIFIED_COUNT * AXIS_IDS.length],
  });
  mergeFile({
    sourceRoot: root,
    candidateRoot,
    sourceFile: "data/source/themes.csv",
    overlayFile: OVERLAY_FILES.themes,
    headers: THEME_HEADERS,
    matches: (row) => verifiedSet.has(row[0] ?? ""),
    allowedCurrentMatchCounts: subsetCounts(overlay.themes.rows.length),
    existingRowsMayBeOverlaySubset: true,
  });
  mergeFile({
    sourceRoot: root,
    candidateRoot,
    sourceFile: "data/source/recommendation-context.csv",
    overlayFile: OVERLAY_FILES.context,
    headers: CONTEXT_HEADERS,
    matches: (row) => verifiedSet.has(row[0] ?? ""),
    allowedCurrentMatchCounts: subsetCounts(VERIFIED_COUNT),
    existingRowsMayBeOverlaySubset: true,
  });
  mergeFile({
    sourceRoot: root,
    candidateRoot,
    sourceFile: "data/source/evidence/evidence.csv",
    overlayFile: OVERLAY_FILES.evidence,
    headers: EVIDENCE_HEADERS,
    matches: (row) => evidenceIds.has(row[0] ?? ""),
    allowedCurrentMatchCounts: subsetCounts(overlay.evidence.rows.length),
    normalizeRow: withoutInputBinding,
  });
  mergeFile({
    sourceRoot: root,
    candidateRoot,
    sourceFile: `data/source/${ART_EVIDENCE_MANIFEST_FILE}`,
    overlayFile: OVERLAY_FILES.artEvidence,
    headers: artEvidenceManifestHeaders,
    matches: (row) => verifiedSet.has(row[0] ?? ""),
    allowedCurrentMatchCounts: subsetCounts(overlay.artEvidence.rows.length),
    existingRowsMayBeOverlaySubset: true,
  });
  mergeFile({
    sourceRoot: root,
    candidateRoot,
    sourceFile: "data/staging/catalog-expansion/promotion-blockers.csv",
    overlayFile: OVERLAY_FILES.blockers,
    headers: PROMOTION_BLOCKER_HEADERS,
    matches: (row) => targetSet.has(row[0] ?? ""),
    allowedCurrentMatchCounts: subsetCounts(overlay.blockers.length),
    existingRowsMayBeOverlaySubset: true,
    normalizeRow: blockerIdentity,
  });
  const reportDestination = join(candidateRoot, "data/source", REVIEW_REFERENCE);
  if (existsSync(reportDestination)) {
    const currentReport = readFileSync(reportDestination);
    if (
      currentReport.toString("utf8") !== overlay.report &&
      !PREVIOUS_REVIEW_SHA256.includes(sha256(currentReport))
    ) {
      throw new Error(`Existing review report conflicts with ${BATCH_ID}: ${REVIEW_REFERENCE}`);
    }
  }
  mkdirSync(dirname(reportDestination), { recursive: true });
  writeFileSync(reportDestination, overlay.report, "utf8");
}

function assertRegistryTransition(root: string, candidateRoot: string, overlay: Overlay) {
  const baseline = runPromotionRegistry("check", root);
  const candidate = runPromotionRegistry("write", candidateRoot);
  const baselineRows = rawRowsByKey(
    join(root, "data/staging/catalog-expansion/promotion-registry.csv"),
    PROMOTION_REGISTRY_HEADERS,
  );
  const candidateRows = rawRowsByKey(
    join(candidateRoot, "data/staging/catalog-expansion/promotion-registry.csv"),
    PROMOTION_REGISTRY_HEADERS,
  );
  const targetSet = new Set([...overlay.verifiedIds, ...overlay.blockedIds]);
  for (const [workId, raw] of baselineRows) {
    if (!targetSet.has(workId) && candidateRows.get(workId) !== raw) {
      throw new Error(`Non-target registry row changed: ${workId}`);
    }
  }
  const candidateRegistry = z
    .array(stringRowSchema)
    .parse(
      parse(
        readFileSync(
          join(candidateRoot, "data/staging/catalog-expansion/promotion-registry.csv"),
          "utf8",
        ),
        { columns: true, skip_empty_lines: true },
      ) as unknown,
    );
  const expected = new Map([
    ...overlay.verifiedIds.map((workId) => [workId, "recommendationVerified"] as const),
    ...overlay.blockedIds.map((workId) => [workId, "promotionBlocked"] as const),
  ]);
  for (const row of candidateRegistry.filter((row) => targetSet.has(row.workId ?? ""))) {
    if (row.promotionOutcome !== expected.get(row.workId ?? "")) {
      throw new Error(`Batch 002 registry outcome mismatch: ${row.workId}`);
    }
  }
  if (
    candidate.goldCount !== 150 ||
    candidate.verifiedCount +
      candidate.blockedCount +
      candidate.pendingCount +
      candidate.goldCount !==
      baseline.workCount
  ) {
    throw new Error("Batch 002 promotion registry counts are inconsistent");
  }
  return candidate;
}

export function prepareBatch002Promotion(root = process.cwd()): PreparedPromotion {
  const canonicalRoot = resolve(root);
  batchConfig.runOverlay("check", canonicalRoot);
  const baselineDigests = getPilotPublishDigests(canonicalRoot);
  const overlay = validateOverlay(canonicalRoot);
  const state = classifyState(canonicalRoot, overlay);
  const sourceErrors = runCatalogPipeline(join(canonicalRoot, "data/source")).issues.filter(
    (issue) => issue.severity === "error",
  );
  if (sourceErrors.length > 0) throw new Error(sourceErrors.map(formatSourceIssue).join("\n"));

  const temporaryRoot = mkdtempSync(join(canonicalRoot, `.${BATCH_ID}-promotion-`));
  const candidateRoot = join(temporaryRoot, "candidate");
  mkdirSync(candidateRoot, { recursive: true });
  try {
    writeCandidate(canonicalRoot, candidateRoot, overlay);
    const candidateErrors = runCatalogPipeline(join(candidateRoot, "data/source")).issues.filter(
      (issue) => issue.severity === "error",
    );
    if (candidateErrors.length > 0) {
      throw new Error(candidateErrors.map(formatSourceIssue).join("\n"));
    }
    const goldManifest = JSON.parse(
      readFileSync(
        join(canonicalRoot, "data/staging/catalog-expansion/gold-set-manifest.json"),
        "utf8",
      ),
    ) as unknown;
    validateGoldSet(candidateRoot, goldManifest);
    const summary = assertRegistryTransition(canonicalRoot, candidateRoot, overlay);
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
    if (
      built.catalog.works.length !==
        loadCatalogSource(join(canonicalRoot, "data/source")).source.works.length ||
      profile.works.length !== summary.goldCount + summary.verifiedCount
    ) {
      throw new Error("Generated recommendation projection disagrees with Batch 002 registry");
    }
    assertPilotPublishSnapshot(
      getPilotPublishDigests(canonicalRoot),
      baselineDigests,
      "Live Batch 002 inputs changed during preparation",
    );
    if (state === "exactlyApplied") {
      assertPilotPublishSnapshot(
        getPilotPublishDigests(candidateRoot),
        baselineDigests,
        "Applied Batch 002 output drifted from its deterministic projection",
      );
    }
    return {
      temporaryRoot,
      candidateRoot,
      summary,
      catalogVersion: built.catalog.catalogVersion,
      profileWorkCount: profile.works.length,
      state,
      baselineDigests,
    };
  } catch (error) {
    rmSync(temporaryRoot, { recursive: true, force: true });
    throw error;
  }
}

export function runBatch002Promotion(mode: "check" | "write", root = process.cwd()) {
  const canonicalRoot = resolve(root);
  const prepared = prepareBatch002Promotion(canonicalRoot);
  const backupRoot = join(prepared.temporaryRoot, "backups");
  const swaps = PUBLISH_PATHS.map((path) => ({
    candidate: join(prepared.candidateRoot, path),
    output: join(canonicalRoot, path),
    backup: join(backupRoot, path),
  }));
  for (const swap of swaps) mkdirSync(dirname(swap.backup), { recursive: true });
  try {
    assertPilotPublishSnapshot(
      getPilotPublishDigests(canonicalRoot),
      prepared.baselineDigests,
      "Live Batch 002 outputs changed before publish",
    );
    if (mode === "write" && prepared.state !== "exactlyApplied") publishDirectorySet(swaps);
    return {
      ...prepared.summary,
      catalogVersion: prepared.catalogVersion,
      profileWorkCount: prepared.profileWorkCount,
      state: prepared.state,
    };
  } finally {
    if (mode === "check" || !swaps.some((swap) => existsSync(swap.backup))) {
      rmSync(prepared.temporaryRoot, { recursive: true, force: true });
    } else {
      console.warn(`Preserved Batch 002 promotion backup under ${backupRoot}`);
    }
  }
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    const mode =
      process.argv[2] === "--check" ? "check" : process.argv[2] === "--write" ? "write" : undefined;
    if (mode === undefined) {
      throw new Error("Usage: tsx scripts/promote-batch-002.ts --check|--write");
    }
    const result = runBatch002Promotion(mode);
    console.log(
      `Batch 002 ${mode} (${result.state}): ${result.catalogVersion}; Gold ${result.goldCount}; verified ${result.verifiedCount}; blocked ${result.blockedCount}; pending ${result.pendingCount}; profile ${result.profileWorkCount}.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
