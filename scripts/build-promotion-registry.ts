import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import {
  ART_AXIS_IDS,
  AXIS_IDS,
  COVERAGE_THRESHOLDS,
  NARRATIVE_AXIS_IDS,
  TONE_AXIS_IDS,
} from "../src/domain/catalog/constants";
import { isValidIsbn } from "../src/domain/catalog/normalize";
import { validateArtEvidence } from "./catalog/art-evidence";
import { loadCatalogSource } from "./catalog/load-source";
import { runCatalogPipeline } from "./catalog/pipeline";
import {
  compareCodeUnit,
  decidePromotionJudgment,
  type PromotionReasonCode,
} from "./catalog/promotion-judgment";
import { formatSourceIssue } from "./catalog/report";
import type {
  CatalogSource,
  EvidenceSourceRow,
  FactorSourceRow,
  Located,
  WorkSourceRow,
} from "./catalog/types";
import {
  loadCatalogExpansion,
  runCatalogExpansionValidation,
  validateGoldSet,
} from "./validate-catalog-expansion";

export const PROMOTION_REGISTRY_HEADERS = [
  "workId",
  "canonicalTitle",
  "currentStatus",
  "targetStatus",
  "sourceCount",
  "sourceTypes",
  "safetyStatus",
  "canonicalStatus",
  "representativeIsbnStatus",
  "annotationStatus",
  "reviewStatus",
  "evidenceStatus",
  "recommendationContextStatus",
  "onboardingEligibilityStatus",
  "recommendationEligibilityStatus",
  "plannedBatch",
  "blockerCode",
  "blockerDetails",
  "lastUpdatedAt",
  "promotionOutcome",
] as const;

export const PROMOTION_BLOCKER_HEADERS = [
  "workId",
  "blockerCode",
  "blockerDetails",
  "evidenceName",
  "evidenceUrl",
  "evidencePublishedAt",
  "retrievedAt",
  "recheckPath",
] as const;

export const BATCH_LEDGER_HEADERS = [
  "workId",
  "batchId",
  "batchType",
  "status",
  "selectionReason",
  "methodPolicy",
  "panelPolicy",
  "lastUpdatedAt",
] as const;

export const PROMOTION_HARD_BLOCKERS = {
  ADULT_CONTENT: "Adult-only content.",
  VERTICAL_WEBTOON: "Vertical-scroll-first work.",
  NON_JAPANESE: "Not a Japanese manga work.",
  NON_MANGA: "Not a manga work.",
  FAN_WORK: "Doujin or fan work.",
  NON_WORK_MATERIAL: "Art book, guide, fan book, edition, or set rather than a canonical work.",
  DUPLICATE_WORK: "Duplicate of another canonical Work.",
  IDENTITY_UNRESOLVED: "Canonical identity cannot be resolved reliably.",
  SAFETY_UNRESOLVED: "Adult safety status cannot be resolved reliably.",
  SOURCE_INFORMATION_UNAVAILABLE: "Usable work or Factor evidence is not available.",
  FACTOR_MODEL_INCOMPATIBLE: "The current Factor Dictionary cannot model the work responsibly.",
  PRODUCT_CONTRACT_INCOMPATIBLE:
    "The work is fundamentally incompatible with the product contract.",
} as const;

const blockerCodeSchema = z.enum(
  Object.keys(PROMOTION_HARD_BLOCKERS) as [
    keyof typeof PROMOTION_HARD_BLOCKERS,
    ...(keyof typeof PROMOTION_HARD_BLOCKERS)[],
  ],
);
const promotionBlockerSchema = z.strictObject({
  workId: z.string().min(1),
  blockerCode: blockerCodeSchema,
  blockerDetails: z.string().min(1),
  evidenceName: z.string().min(1),
  evidenceUrl: z.url(),
  evidencePublishedAt: z.string().regex(/^\d{4}(?:-\d{2}-\d{2})?$/u),
  retrievedAt: z.iso.date(),
  recheckPath: z.string().min(1),
});

const batchLedgerRowSchema = z
  .strictObject({
    workId: z.string().min(1),
    batchId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
    batchType: z.enum(["pilot", "batch"]),
    status: z.literal("frozen"),
    selectionReason: z
      .string()
      .regex(/^era-[a-z0-9-]+;audience-[a-z0-9-]+;genre-[a-z0-9-]+;ev-[a-z0-9-]+$/u),
    methodPolicy: z.enum(["promotion-evidence-v2", "promotion-evidence-v3"]),
    panelPolicy: z.enum([
      "art-local-codex+gemini-3.7-flash-high;grok-art-abstain;muse-conditional",
      "official+community-bounded;art-optional-peer;muse-conditional",
    ]),
    lastUpdatedAt: z.iso.date(),
  })
  .superRefine((row, context) => {
    const expectedPanel =
      row.methodPolicy === "promotion-evidence-v3"
        ? "official+community-bounded;art-optional-peer;muse-conditional"
        : "art-local-codex+gemini-3.7-flash-high;grok-art-abstain;muse-conditional";
    if (row.panelPolicy !== expectedPanel) {
      context.addIssue({
        code: "custom",
        path: ["panelPolicy"],
        message: `${row.methodPolicy} requires its matching panel policy`,
      });
    }
  });

const promotionRegistryRowSchema = z.strictObject({
  workId: z.string().min(1),
  canonicalTitle: z.string().min(1),
  currentStatus: z.enum(["libraryOnly", "annotationDraft", "recommendationVerified", "gold"]),
  targetStatus: z.enum(["recommendationVerified", "gold"]),
  sourceCount: z.number().int().nonnegative(),
  sourceTypes: z.string(),
  safetyStatus: z.enum(["safe", "adult", "safety-unknown", "missing", "conflict", "frozen"]),
  canonicalStatus: z.enum(["verified", "missing", "conflict", "frozen"]),
  representativeIsbnStatus: z.enum(["verified", "missing", "invalid", "conflict"]),
  annotationStatus: z.enum(["complete", "draft", "missing"]),
  reviewStatus: z.enum(["unreviewed", "human", "authorizedModelPanel", "invalid"]),
  evidenceStatus: z.enum(["complete", "missing", "invalid"]),
  recommendationContextStatus: z.enum(["complete", "missing", "invalid"]),
  onboardingEligibilityStatus: z.enum(["eligible", "ineligible", "conflict"]),
  recommendationEligibilityStatus: z.enum(["eligible", "ineligible", "conflict"]),
  plannedBatch: z.string(),
  blockerCode: z.string(),
  blockerDetails: z.string(),
  lastUpdatedAt: z.union([z.literal(""), z.iso.datetime()]),
  promotionOutcome: z.enum(["pending", "recommendationVerified", "promotionBlocked", "gold"]),
});

export type PromotionRegistryRow = z.infer<typeof promotionRegistryRowSchema>;
export type PromotionBlocker = z.infer<typeof promotionBlockerSchema>;
export type BatchLedgerRow = z.infer<typeof batchLedgerRowSchema>;
type ExpansionData = ReturnType<typeof loadCatalogExpansion>;

export type PromotionRegistryInput = {
  source: CatalogSource;
  artEvidence: Parameters<typeof validateArtEvidence>[0]["manifest"];
  expansion: Pick<ExpansionData, "sources" | "memberships" | "mappings" | "safetyReviews">;
  goldWorkIds: readonly string[];
  existingReviewReferences: ReadonlySet<string>;
  blockers: readonly PromotionBlocker[];
  batches: readonly BatchLedgerRow[];
};

function sortedUnique(values: readonly string[]) {
  return [...new Set(values)].sort(compareCodeUnit);
}

function groupByWork<T>(rows: readonly Located<T>[], workId: (row: T) => string) {
  const grouped = new Map<string, Located<T>[]>();
  for (const row of rows) {
    const id = workId(row.value);
    grouped.set(id, [...(grouped.get(id) ?? []), row]);
  }
  return grouped;
}

function groupValuesByWork<T>(rows: readonly T[], workId: (row: T) => string) {
  const grouped = new Map<string, T[]>();
  for (const row of rows) {
    const id = workId(row);
    grouped.set(id, [...(grouped.get(id) ?? []), row]);
  }
  return grouped;
}

function latestTimestamp(values: readonly (string | undefined)[]) {
  const dated = values.flatMap((value) => {
    if (value === undefined || value === "") return [];
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? [{ timestamp, value }] : [];
  });
  if (dated.length === 0) return "";
  const latest = dated.sort(
    (left, right) => right.timestamp - left.timestamp || compareCodeUnit(right.value, left.value),
  )[0]!;
  return new Date(latest.timestamp).toISOString();
}

function axisCoverage(rows: readonly Located<FactorSourceRow>[], axisIds: readonly string[]) {
  const byAxis = new Map(rows.map((row) => [row.value.axisId, row.value]));
  let known = 0;
  let expected = 0;
  for (const axisId of axisIds) {
    const factor = byAxis.get(axisId as FactorSourceRow["axisId"]);
    if (factor?.state === "notApplicable") continue;
    expected += 1;
    if (factor?.state === "known") known += 1;
  }
  return expected === 0 ? 0 : known / expected;
}

function annotationStatus(
  work: WorkSourceRow,
  factors: readonly Located<FactorSourceRow>[],
  themeCount: number,
  contextCount: number,
): PromotionRegistryRow["annotationStatus"] {
  const distinctAxes = new Set(factors.map((row) => row.value.axisId));
  const complete =
    factors.length === AXIS_IDS.length &&
    distinctAxes.size === AXIS_IDS.length &&
    work.genres.length > 0 &&
    themeCount > 0 &&
    axisCoverage(factors, NARRATIVE_AXIS_IDS) >= COVERAGE_THRESHOLDS.narrative &&
    axisCoverage(factors, TONE_AXIS_IDS) >= COVERAGE_THRESHOLDS.tone;
  if (complete) return "complete";
  return factors.some((row) => row.value.state !== "unknown") ||
    themeCount > 0 ||
    work.genres.length > 0 ||
    contextCount > 0 ||
    work.annotationReviewMethod !== "unreviewed" ||
    work.onboardingEligible ||
    work.recommendationEligible
    ? "draft"
    : "missing";
}

function evidenceMatches(
  evidence: EvidenceSourceRow,
  workId: string,
  targetType: EvidenceSourceRow["targetType"],
  targetId: string,
) {
  return (
    evidence.workId === workId &&
    (evidence.targetType === "work" ||
      (evidence.targetType === targetType && evidence.targetId === targetId))
  );
}

function evidenceStatus(input: {
  work: Located<WorkSourceRow>;
  volumes: PromotionRegistryInput["source"]["volumes"];
  factors: PromotionRegistryInput["source"]["factors"];
  themes: PromotionRegistryInput["source"]["themes"];
  evidence: PromotionRegistryInput["source"]["evidence"];
  artEvidence: PromotionRegistryInput["artEvidence"];
}): PromotionRegistryRow["evidenceStatus"] {
  const evidenceById = new Map<string, Located<EvidenceSourceRow>>();
  const duplicateEvidenceIds = new Set<string>();
  for (const row of input.evidence) {
    if (evidenceById.has(row.value.id)) duplicateEvidenceIds.add(row.value.id);
    else evidenceById.set(row.value.id, row);
  }
  const references = [
    {
      evidenceId: input.work.value.evidenceId,
      targetType: "work" as const,
      targetId: input.work.value.id,
    },
    ...input.volumes.map((row) => ({
      evidenceId: row.value.evidenceId,
      targetType: "volume" as const,
      targetId: row.value.id,
    })),
    ...input.factors.map((row) => ({
      evidenceId: row.value.evidenceId,
      targetType: "axis" as const,
      targetId: row.value.axisId,
    })),
    ...input.themes.map((row) => ({
      evidenceId: row.value.evidenceId,
      targetType: "theme" as const,
      targetId: row.value.themeId,
    })),
  ];
  let missing = false;
  let invalid = false;
  for (const reference of references) {
    const evidence = evidenceById.get(reference.evidenceId)?.value;
    if (evidence === undefined) {
      missing = true;
    } else if (
      duplicateEvidenceIds.has(reference.evidenceId) ||
      evidence.sourceUrl === undefined ||
      !evidenceMatches(evidence, input.work.value.id, reference.targetType, reference.targetId)
    ) {
      invalid = true;
    }
  }
  const hasArtClaim = input.factors.some(
    (row) =>
      ART_AXIS_IDS.includes(row.value.axisId as (typeof ART_AXIS_IDS)[number]) &&
      row.value.state !== "unknown",
  );
  if (
    hasArtClaim &&
    validateArtEvidence({
      works: [input.work],
      factors: input.factors,
      evidence: input.evidence,
      manifest: input.artEvidence,
    }).some((issue) => issue.severity === "error")
  ) {
    invalid = true;
  }
  return missing ? "missing" : invalid ? "invalid" : "complete";
}

function reviewStatus(
  work: WorkSourceRow,
  workEvidence: EvidenceSourceRow | undefined,
  existingReferences: ReadonlySet<string>,
): PromotionRegistryRow["reviewStatus"] {
  if (work.annotationReviewMethod === "unreviewed") return "unreviewed";
  if (
    work.annotationReviewedAt === undefined ||
    work.annotationReviewReference === undefined ||
    !existingReferences.has(work.annotationReviewReference) ||
    workEvidence === undefined
  ) {
    return "invalid";
  }
  if (work.annotationReviewMethod === "human" && !workEvidence.reviewedByHuman) return "invalid";
  return work.annotationReviewMethod;
}

function eligibilityStatus(
  eligible: boolean,
  libraryOnly: boolean,
): PromotionRegistryRow["recommendationEligibilityStatus"] {
  return eligible && libraryOnly ? "conflict" : eligible ? "eligible" : "ineligible";
}

function registryReasonCodes(
  row: Pick<
    PromotionRegistryRow,
    | "targetStatus"
    | "canonicalStatus"
    | "safetyStatus"
    | "representativeIsbnStatus"
    | "annotationStatus"
    | "reviewStatus"
    | "evidenceStatus"
    | "recommendationContextStatus"
    | "onboardingEligibilityStatus"
    | "recommendationEligibilityStatus"
    | "lastUpdatedAt"
  > & { provenanceComplete: boolean },
) {
  const reasons: PromotionReasonCode[] = [];
  const isGold = row.targetStatus === "gold";
  if (!row.provenanceComplete) reasons.push("SOURCE_PROVENANCE_INCOMPLETE");
  if (!isGold && row.canonicalStatus !== "verified") {
    reasons.push("CANONICAL_IDENTITY_NOT_VERIFIED");
  }
  if (!isGold && row.safetyStatus !== "safe") reasons.push("SAFETY_NOT_SAFE");
  if (row.representativeIsbnStatus !== "verified") {
    reasons.push("REPRESENTATIVE_ISBN_NOT_VERIFIED");
  }
  if (row.annotationStatus === "missing") reasons.push("ANNOTATION_MISSING");
  if (row.annotationStatus === "draft") reasons.push("ANNOTATION_INCOMPLETE");
  if (row.reviewStatus !== "human" && row.reviewStatus !== "authorizedModelPanel") {
    reasons.push("REVIEW_NOT_ACCEPTED");
  }
  if (row.evidenceStatus !== "complete") reasons.push("EVIDENCE_INCOMPLETE");
  if (row.recommendationContextStatus !== "complete") {
    reasons.push("RECOMMENDATION_CONTEXT_INCOMPLETE");
  }
  if (row.lastUpdatedAt === "") reasons.push("LAST_UPDATED_AT_MISSING");
  if (!isGold && row.onboardingEligibilityStatus !== "eligible") {
    reasons.push("ONBOARDING_INELIGIBLE");
  }
  if (row.recommendationEligibilityStatus !== "eligible") {
    reasons.push("RECOMMENDATION_INELIGIBLE");
  }
  return reasons;
}

export function buildPromotionRegistry(input: PromotionRegistryInput): PromotionRegistryRow[] {
  const goldIds = new Set(input.goldWorkIds);
  const workIds = new Set(input.source.works.map((row) => row.value.id));
  if (input.blockers.some((blocker) => !workIds.has(blocker.workId))) {
    throw new Error("Promotion blocker references an unknown source work");
  }
  const batchByWork = new Map<string, BatchLedgerRow>();
  for (const batch of input.batches) {
    if (!workIds.has(batch.workId)) {
      throw new Error(`Batch assignment references an unknown source work: ${batch.workId}`);
    }
    if (goldIds.has(batch.workId)) {
      throw new Error(`Gold work cannot have a planned batch: ${batch.workId}`);
    }
    if (batchByWork.has(batch.workId)) {
      throw new Error(`Work has duplicate batch assignments: ${batch.workId}`);
    }
    batchByWork.set(batch.workId, batch);
  }
  const volumesByWork = groupByWork(input.source.volumes, (row) => row.workId);
  const factorsByWork = groupByWork(input.source.factors, (row) => row.workId);
  const themesByWork = groupByWork(input.source.themes, (row) => row.workId);
  const contextByWork = groupByWork(input.source.recommendationContext, (row) => row.workId);
  const evidenceByWork = groupByWork(input.source.evidence, (row) => row.workId);
  const artEvidenceByWork = groupByWork(input.artEvidence, (row) => row.workId);
  const mappingsByWork = groupValuesByWork(input.expansion.mappings, (row) => row.workId);
  const membershipsByWork = groupValuesByWork(input.expansion.memberships, (row) => row.workId);
  const evidenceById = new Map(input.source.evidence.map((row) => [row.value.id, row.value]));
  const sourceById = new Map(input.expansion.sources.map((source) => [source.sourceId, source]));
  const safetyByCandidate = new Map(
    input.expansion.safetyReviews.map((review) => [review.candidateId, review]),
  );
  const blockersByWork = groupValuesByWork(input.blockers, (blocker) => blocker.workId);

  const rows = input.source.works.map((locatedWork): PromotionRegistryRow => {
    const work = locatedWork.value;
    const isGold = goldIds.has(work.id);
    const batch = batchByWork.get(work.id);
    const volumes = volumesByWork.get(work.id) ?? [];
    const factors = factorsByWork.get(work.id) ?? [];
    const themes = themesByWork.get(work.id) ?? [];
    const contexts = contextByWork.get(work.id) ?? [];
    const mappings = mappingsByWork.get(work.id) ?? [];
    const memberships = (membershipsByWork.get(work.id) ?? []).filter(
      (membership) => membership.status === "included" || membership.status === "duplicate",
    );
    const workEvidenceRows = evidenceByWork.get(work.id) ?? [];
    const sourceIds = sortedUnique(memberships.map((membership) => membership.sourceId));
    const sources = sourceIds.flatMap((sourceId) => {
      const source = sourceById.get(sourceId);
      return source === undefined ? [] : [source];
    });
    const sourceTypes = isGold
      ? "frozen"
      : sortedUnique(sources.map((source) => source.sourceKind)).join(";");
    const provenanceComplete =
      isGold || (sourceIds.length > 0 && sources.length === sourceIds.length);

    const canonicalStatus: PromotionRegistryRow["canonicalStatus"] = isGold
      ? "frozen"
      : mappings.length === 0
        ? "missing"
        : mappings.every(
              (mapping) =>
                mapping.canonicalTitleJa === work.title &&
                memberships.some(
                  (membership) =>
                    membership.decisionRef === mapping.mappingId &&
                    membership.candidateId === mapping.candidateId &&
                    membership.status === mapping.mappingType,
                ),
            )
          ? "verified"
          : "conflict";

    const candidateIds = sortedUnique(mappings.map((mapping) => mapping.candidateId));
    const safetyReviews = candidateIds.flatMap((candidateId) => {
      const review = safetyByCandidate.get(candidateId);
      return review === undefined ? [] : [review];
    });
    const safetyStatus: PromotionRegistryRow["safetyStatus"] = isGold
      ? "frozen"
      : candidateIds.length === 0 || safetyReviews.length < candidateIds.length
        ? "missing"
        : new Set(safetyReviews.map((review) => review.candidateId)).size !== safetyReviews.length
          ? "conflict"
          : safetyReviews.some((review) => review.safetyStatus === "adult")
            ? "adult"
            : safetyReviews.some((review) => review.safetyStatus === "safety-unknown")
              ? "safety-unknown"
              : "safe";

    const representatives = volumes.filter((volume) => volume.value.isRepresentative);
    const representativeIsbnStatus: PromotionRegistryRow["representativeIsbnStatus"] =
      representatives.length === 0
        ? "missing"
        : representatives.length > 1
          ? "conflict"
          : isValidIsbn(representatives[0]!.value.isbn)
            ? "verified"
            : "invalid";
    const workAnnotationStatus = annotationStatus(work, factors, themes.length, contexts.length);
    const workEvidence = evidenceById.get(work.evidenceId);
    const workReviewStatus = reviewStatus(work, workEvidence, input.existingReviewReferences);
    const rawEvidenceStatus = evidenceStatus({
      work: locatedWork,
      volumes,
      factors,
      themes,
      evidence: workEvidenceRows,
      artEvidence: artEvidenceByWork.get(work.id) ?? [],
    });
    const workEvidenceStatus =
      rawEvidenceStatus === "invalid" || workAnnotationStatus === "complete"
        ? rawEvidenceStatus
        : "missing";
    const recommendationContextStatus: PromotionRegistryRow["recommendationContextStatus"] =
      contexts.length === 0 ? "missing" : contexts.length === 1 ? "complete" : "invalid";
    const onboardingEligibilityStatus = eligibilityStatus(
      work.onboardingEligible,
      work.libraryOnly,
    );
    const recommendationEligibilityStatus = eligibilityStatus(
      work.recommendationEligible,
      work.libraryOnly,
    );

    const blockers = [...(blockersByWork.get(work.id) ?? [])].sort(
      (left, right) =>
        compareCodeUnit(left.blockerCode, right.blockerCode) ||
        compareCodeUnit(left.blockerDetails, right.blockerDetails),
    );

    const updatedAt = latestTimestamp([
      work.annotationReviewedAt,
      ...workEvidenceRows.map((evidence) => evidence.value.fetchedAt),
      ...mappings.map((mapping) => mapping.retrievedAt),
      ...safetyReviews.flatMap((review) => [review.retrievedAt, review.reviewedAt]),
      ...sources.map((source) => source.retrievedAt),
      batch?.lastUpdatedAt,
    ]);
    const targetStatus = isGold ? "gold" : "recommendationVerified";
    const judgment = decidePromotionJudgment({
      targetStatus,
      annotationStatus: workAnnotationStatus,
      reasonCodes: registryReasonCodes({
        targetStatus,
        provenanceComplete,
        canonicalStatus,
        safetyStatus,
        representativeIsbnStatus,
        annotationStatus: workAnnotationStatus,
        reviewStatus: workReviewStatus,
        evidenceStatus: workEvidenceStatus,
        recommendationContextStatus,
        onboardingEligibilityStatus,
        recommendationEligibilityStatus,
        lastUpdatedAt: updatedAt,
      }),
      blockerCodes: blockers.map((blocker) => blocker.blockerCode),
    });

    return promotionRegistryRowSchema.parse({
      workId: work.id,
      canonicalTitle: work.title,
      currentStatus: judgment.currentStatus,
      targetStatus,
      sourceCount: isGold ? 0 : sourceIds.length,
      sourceTypes,
      safetyStatus,
      canonicalStatus,
      representativeIsbnStatus,
      annotationStatus: workAnnotationStatus,
      reviewStatus: workReviewStatus,
      evidenceStatus: workEvidenceStatus,
      recommendationContextStatus,
      onboardingEligibilityStatus,
      recommendationEligibilityStatus,
      plannedBatch: batch?.batchId ?? "",
      blockerCode: blockers.map((blocker) => blocker.blockerCode).join(";"),
      blockerDetails: blockers.map((blocker) => blocker.blockerDetails).join(" | "),
      lastUpdatedAt: updatedAt,
      promotionOutcome: judgment.promotionOutcome,
    });
  });

  return rows.sort((left, right) => compareCodeUnit(left.workId, right.workId));
}

export function validatePromotionRegistry(
  rows: readonly PromotionRegistryRow[],
  expectedWorkIds: readonly string[],
) {
  const parsed = rows.map((row) => promotionRegistryRowSchema.parse(row));
  const actualIds = parsed.map((row) => row.workId);
  const expectedIds = sortedUnique(expectedWorkIds);
  if (
    new Set(actualIds).size !== actualIds.length ||
    JSON.stringify(actualIds) !== JSON.stringify([...actualIds].sort(compareCodeUnit)) ||
    JSON.stringify(actualIds) !== JSON.stringify(expectedIds)
  ) {
    throw new Error("Promotion registry must cover every source work exactly once in workId order");
  }

  for (const row of parsed) {
    if ((row.blockerCode === "") !== (row.blockerDetails === "")) {
      throw new Error(`Promotion blocker code and details disagree: ${row.workId}`);
    }
    const blockerCodes = row.blockerCode === "" ? [] : row.blockerCode.split(";");
    if (
      new Set(blockerCodes).size !== blockerCodes.length ||
      JSON.stringify(blockerCodes) !== JSON.stringify([...blockerCodes].sort(compareCodeUnit)) ||
      blockerCodes.some((code) => !Object.hasOwn(PROMOTION_HARD_BLOCKERS, code))
    ) {
      throw new Error(`Promotion registry has an unknown hard blocker: ${row.workId}`);
    }
    if (row.targetStatus === "gold") {
      if (
        row.sourceCount !== 0 ||
        row.sourceTypes !== "frozen" ||
        row.safetyStatus !== "frozen" ||
        row.canonicalStatus !== "frozen" ||
        row.plannedBatch !== ""
      ) {
        throw new Error(`Gold registry contract is invalid: ${row.workId}`);
      }
    }
    const judgment = decidePromotionJudgment({
      targetStatus: row.targetStatus,
      annotationStatus: row.annotationStatus,
      reasonCodes: registryReasonCodes({
        ...row,
        provenanceComplete:
          row.targetStatus === "gold"
            ? row.sourceCount === 0 && row.sourceTypes === "frozen"
            : row.sourceCount > 0 && row.sourceTypes !== "",
      }),
      blockerCodes,
    });
    if (
      row.currentStatus !== judgment.currentStatus ||
      row.promotionOutcome !== judgment.promotionOutcome
    ) {
      throw new Error(`Promotion registry judgment is inconsistent: ${row.workId}`);
    }
  }
}

function csvCell(value: string | number) {
  const text = String(value);
  return /[",\r\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function serializePromotionRegistry(rows: readonly PromotionRegistryRow[]) {
  const matrix = [
    PROMOTION_REGISTRY_HEADERS,
    ...rows.map((row) => PROMOTION_REGISTRY_HEADERS.map((header) => row[header])),
  ];
  return `${matrix.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function loadPromotionBlockers(path: string) {
  const rows: unknown = parse(readFileSync(path, "utf8"), {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return z.array(promotionBlockerSchema).parse(rows);
}

function loadBatchLedger(path: string) {
  const rows: unknown = parse(readFileSync(path, "utf8"), {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return z.array(batchLedgerRowSchema).parse(rows);
}

export function loadPromotionRegistryInput(root = process.cwd()): PromotionRegistryInput {
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
  const expansion = loadCatalogExpansion(stagingDirectory);
  const manifest = validateGoldSet(
    canonicalRoot,
    JSON.parse(readFileSync(join(stagingDirectory, "gold-set-manifest.json"), "utf8")) as unknown,
  );
  const existingReviewReferences = new Set(
    loaded.source.works.flatMap((row) => {
      const reference = row.value.annotationReviewReference;
      return reference !== undefined && existsSync(join(sourceDirectory, reference))
        ? [reference]
        : [];
    }),
  );
  return {
    source: loaded.source,
    artEvidence: loaded.artEvidence,
    expansion,
    goldWorkIds: manifest.workIds,
    existingReviewReferences,
    blockers: loadPromotionBlockers(join(stagingDirectory, "promotion-blockers.csv")),
    batches: loadBatchLedger(join(stagingDirectory, "batch-ledger.csv")),
  };
}

function buildCurrentPromotionRegistry(root = process.cwd()) {
  const input = loadPromotionRegistryInput(root);
  const rows = buildPromotionRegistry(input);
  validatePromotionRegistry(
    rows,
    input.source.works.map((row) => row.value.id),
  );
  return { rows, content: serializePromotionRegistry(rows) };
}

export function runPromotionRegistry(
  mode: "stdout" | "check" | "write" = "stdout",
  root = process.cwd(),
) {
  const { rows, content } = buildCurrentPromotionRegistry(root);
  const path = join(resolve(root), "data/staging/catalog-expansion/promotion-registry.csv");
  if (mode === "stdout") process.stdout.write(content);
  if (mode === "check" && (!existsSync(path) || readFileSync(path, "utf8") !== content)) {
    throw new Error("Promotion registry is missing or stale; run with --write");
  }
  if (mode === "write") {
    const temporaryPath = `${path}.tmp`;
    writeFileSync(temporaryPath, content, "utf8");
    renameSync(temporaryPath, path);
  }
  return {
    workCount: rows.length,
    goldCount: rows.filter((row) => row.promotionOutcome === "gold").length,
    verifiedCount: rows.filter((row) => row.promotionOutcome === "recommendationVerified").length,
    blockedCount: rows.filter((row) => row.promotionOutcome === "promotionBlocked").length,
    pendingCount: rows.filter((row) => row.promotionOutcome === "pending").length,
  };
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    const argument = process.argv[2];
    const mode =
      argument === undefined
        ? "stdout"
        : argument === "--check"
          ? "check"
          : argument === "--write"
            ? "write"
            : undefined;
    if (mode === undefined) {
      throw new Error("Usage: tsx scripts/build-promotion-registry.ts [--check|--write]");
    }
    const result = runPromotionRegistry(mode);
    if (mode !== "stdout") {
      console.log(
        `Promotion registry: ${result.workCount} works; Gold ${result.goldCount}; verified ${result.verifiedCount}; blocked ${result.blockedCount}; pending ${result.pendingCount}.`,
      );
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
