import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import {
  assertRepresentativeDecisionIdentity,
  loadRepresentativeVolumeDecisions,
  type RepresentativeVolumeDecision,
} from "./catalog/representative-volume-decisions";

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;
const PUBLISHED_AT_PATTERN = /^\d{4}(?:-\d{2}-\d{2})?$/u;
const SHA256_PATTERN = /^[a-f0-9]{64}$/u;
const COUNT_PATTERN = /^\d+$/u;
const OPTIONAL_COUNT_PATTERN = /^\d*$/u;
const YEAR_PATTERN = /^(?:\d{4})?$/u;
const CONFIDENCE_PATTERN = /^(?:0(?:\.\d+)?|1(?:\.0+)?)$/u;
const ISBN_PATTERN = /^(?:\d{10}|\d{13})$/u;

const id = z.string().regex(ID_PATTERN);
const optionalId = z.union([z.literal(""), id]);
const date = z.string().regex(DATE_PATTERN);
const publishedAt = z.string().regex(PUBLISHED_AT_PATTERN);
const optionalPublishedAt = z.union([z.literal(""), publishedAt]);
const count = z.string().regex(COUNT_PATTERN);
const optionalCount = z.string().regex(OPTIONAL_COUNT_PATTERN);
const url = z.url().refine((value) => {
  const protocol = new URL(value).protocol;
  return protocol === "https:" || protocol === "http:";
});
const optionalUrl = z.union([z.literal(""), url]);

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

const RAW_SOURCE_ITEM_HEADERS = [
  "sourceItemId",
  "sourceId",
  "sourceRowNumber",
  "rawPublicationClass",
  "rawTitle",
  "rawCreator",
  "rawMainGenre",
  "rawSubgenre",
  "rawRating",
  "rawNotes",
  "rawUpdatedAt",
] as const;

const CANDIDATE_HEADERS = [
  "candidateId",
  "canonicalTitleJa",
  "titleKana",
  "creatorsJa",
  "firstPublishedYear",
  "originCountry",
  "format",
  "publicationStatus",
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

const EXCLUSION_HEADERS = [
  "exclusionId",
  "sourceItemId",
  "candidateId",
  "status",
  "reason",
  "evidenceName",
  "evidenceUrl",
  "evidencePublishedAt",
  "retrievedAt",
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

const ANNOTATION_STATUS_HEADERS = [
  "candidateId",
  "workId",
  "bibliographyStatus",
  "factorStatus",
  "themeStatus",
  "evidenceStatus",
  "artEvidenceStatus",
  "reviewStatus",
  "reviewReference",
  "updatedAt",
  "notes",
] as const;

const sourceRegistrySchema = z.strictObject({
  sourceId: id,
  sourceKind: z.enum(["community", "award", "bookseller", "sales", "publisher", "editorial"]),
  organization: z.string().min(1),
  title: z.string().min(1),
  url,
  publishedAt,
  retrievedAt: date,
  listNature: z.string().min(1),
  registryStatus: z.enum(["collecting", "adjudicating", "complete", "blocked"]),
  snapshotUrl: url,
  snapshotSha256: z.string().regex(SHA256_PATTERN),
  originalItemCount: optionalCount,
  japaneseMangaItemCount: optionalCount,
  excludedWebtoonCount: count,
  excludedAdultCount: count,
  excludedNonJapaneseCount: count,
  excludedNonMangaCount: count,
  duplicateCount: count,
  canonicalMappingCount: count,
  unresolvedCount: count,
  notes: z.string(),
});

const rawSourceItemSchema = z.strictObject({
  sourceItemId: id,
  sourceId: id,
  sourceRowNumber: z.string().regex(/^[1-9]\d*$/u),
  rawPublicationClass: z.string(),
  rawTitle: z.string(),
  rawCreator: z.string(),
  rawMainGenre: z.string(),
  rawSubgenre: z.string(),
  rawRating: z.string(),
  rawNotes: z.string(),
  rawUpdatedAt: z.string(),
});

const candidateSchema = z.strictObject({
  candidateId: id,
  canonicalTitleJa: z
    .string()
    .min(1)
    .refine(
      (value) => !/[『』]/u.test(value),
      "Title quotation marks are not canonical title text",
    ),
  titleKana: z.string(),
  creatorsJa: z.string().min(1),
  firstPublishedYear: z.string().regex(YEAR_PATTERN),
  originCountry: z.enum(["JP", "unknown"]),
  format: z.enum(["page-manga", "web-manga", "unknown"]),
  publicationStatus: z.enum(["ongoing", "completed", "hiatus", "unknown"]),
  notes: z.string(),
});

const terminalStatusSchema = z.enum([
  "included",
  "duplicate",
  "excluded-webtoon",
  "excluded-adult",
  "excluded-non-japanese",
  "excluded-non-manga",
  "unresolved",
]);
const excludedStatusSchema = z.enum([
  "excluded-webtoon",
  "excluded-adult",
  "excluded-non-japanese",
  "excluded-non-manga",
]);

const sourceMembershipSchema = z.strictObject({
  sourceItemId: id,
  sourceId: id,
  status: terminalStatusSchema,
  candidateId: optionalId,
  workId: optionalId,
  decisionRef: optionalId,
});

const canonicalMappingSchema = z.strictObject({
  mappingId: id,
  sourceItemId: id,
  candidateId: id,
  workId: optionalId,
  mappingType: z.enum(["included", "duplicate"]),
  canonicalTitleJa: z.string().min(1),
  confidence: z.string().regex(CONFIDENCE_PATTERN),
  evidenceName: z.string().min(1),
  evidenceUrl: url,
  evidencePublishedAt: optionalPublishedAt,
  retrievedAt: date,
  notes: z.string(),
});

const exclusionSchema = z.strictObject({
  exclusionId: id,
  sourceItemId: id,
  candidateId: optionalId,
  status: excludedStatusSchema,
  reason: z.string().min(1),
  evidenceName: z.string().min(1),
  evidenceUrl: url,
  evidencePublishedAt: optionalPublishedAt,
  retrievedAt: date,
  notes: z.string(),
});

const safetyReviewSchema = z.strictObject({
  candidateId: id,
  safetyStatus: z.enum(["safe", "adult", "safety-unknown"]),
  evidenceName: z.string().min(1),
  evidenceUrl: url,
  evidencePublishedAt: optionalPublishedAt,
  retrievedAt: date,
  reviewedAt: date,
  notes: z.string(),
});

const rakutenMatchSchema = z.strictObject({
  rakutenMatchId: id,
  candidateId: id,
  matchStatus: z.enum(["matched", "not-found", "ambiguous"]),
  isbn: z.union([z.literal(""), z.string().regex(ISBN_PATTERN)]),
  matchedTitle: z.string(),
  editionKind: z.string(),
  isRepresentative: z.enum(["true", "false"]),
  sourceUrl: optionalUrl,
  checkedAt: date,
  notes: z.string(),
});

const progressStatusSchema = z.enum(["not-started", "in-progress", "complete"]);
const annotationStatusSchema = z.strictObject({
  candidateId: id,
  workId: optionalId,
  bibliographyStatus: progressStatusSchema,
  factorStatus: progressStatusSchema,
  themeStatus: progressStatusSchema,
  evidenceStatus: progressStatusSchema,
  artEvidenceStatus: progressStatusSchema,
  reviewStatus: z.enum(["unreviewed", "human", "authorizedModelPanel"]),
  reviewReference: z.string(),
  updatedAt: date,
  notes: z.string(),
});

type SourceRegistry = z.infer<typeof sourceRegistrySchema>;
type RawSourceItem = z.infer<typeof rawSourceItemSchema>;
type Candidate = z.infer<typeof candidateSchema>;
type SourceMembership = z.infer<typeof sourceMembershipSchema>;
type CanonicalMapping = z.infer<typeof canonicalMappingSchema>;
type Exclusion = z.infer<typeof exclusionSchema>;
type SafetyReview = z.infer<typeof safetyReviewSchema>;
type RakutenMatch = z.infer<typeof rakutenMatchSchema>;
type AnnotationStatus = z.infer<typeof annotationStatusSchema>;

type ExpansionData = {
  sources: SourceRegistry[];
  rawItems: RawSourceItem[];
  candidates: Candidate[];
  memberships: SourceMembership[];
  mappings: CanonicalMapping[];
  exclusions: Exclusion[];
  safetyReviews: SafetyReview[];
  rakutenMatches: RakutenMatch[];
  annotationStatuses: AnnotationStatus[];
  representativeVolumeDecisions: RepresentativeVolumeDecision[];
};

const matrixSchema = z.array(z.array(z.string()));

function readCsv<T>(
  directory: string,
  file: string,
  headers: readonly string[],
  schema: z.ZodType<T>,
) {
  const matrix = matrixSchema.parse(
    parse(readFileSync(join(directory, file), "utf8"), {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }),
  );
  const [actualHeaders, ...rows] = matrix;
  if (actualHeaders === undefined || actualHeaders.join("\u0000") !== headers.join("\u0000")) {
    throw new Error(`Unexpected CSV header: ${file}`);
  }
  return rows.map((row, index) => {
    if (row.length !== headers.length) {
      throw new Error(`Unexpected column count: ${file}:${index + 2}`);
    }
    const record = Object.fromEntries(headers.map((header, column) => [header, row[column] ?? ""]));
    const result = schema.safeParse(record);
    if (!result.success) {
      const detail = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Invalid CSV row: ${file}:${index + 2}: ${detail}`);
    }
    return result.data;
  });
}

export function loadCatalogExpansion(directory: string): ExpansionData {
  return {
    sources: readCsv(
      directory,
      "source-registry.csv",
      SOURCE_REGISTRY_HEADERS,
      sourceRegistrySchema,
    ),
    rawItems: readCsv(
      directory,
      "raw-source-items.csv",
      RAW_SOURCE_ITEM_HEADERS,
      rawSourceItemSchema,
    ),
    candidates: readCsv(directory, "candidates.csv", CANDIDATE_HEADERS, candidateSchema),
    memberships: readCsv(
      directory,
      "source-membership.csv",
      SOURCE_MEMBERSHIP_HEADERS,
      sourceMembershipSchema,
    ),
    mappings: readCsv(
      directory,
      "canonical-mapping.csv",
      CANONICAL_MAPPING_HEADERS,
      canonicalMappingSchema,
    ),
    exclusions: readCsv(directory, "exclusions.csv", EXCLUSION_HEADERS, exclusionSchema),
    safetyReviews: readCsv(
      directory,
      "safety-review.csv",
      SAFETY_REVIEW_HEADERS,
      safetyReviewSchema,
    ),
    rakutenMatches: readCsv(
      directory,
      "rakuten-matches.csv",
      RAKUTEN_MATCH_HEADERS,
      rakutenMatchSchema,
    ),
    annotationStatuses: readCsv(
      directory,
      "annotation-status.csv",
      ANNOTATION_STATUS_HEADERS,
      annotationStatusSchema,
    ),
    representativeVolumeDecisions: loadRepresentativeVolumeDecisions(directory),
  };
}

function indexUnique<T>(
  rows: readonly T[],
  key: (row: T) => string,
  label: string,
  issues: string[],
) {
  const indexed = new Map<string, T>();
  for (const row of rows) {
    const value = key(row);
    if (indexed.has(value)) {
      issues.push(`Duplicate ${label}: ${value}`);
    } else {
      indexed.set(value, row);
    }
  }
  return indexed;
}

function numeric(value: string) {
  return Number.parseInt(value, 10);
}

export type ExpansionSummary = {
  sourceCount: number;
  rawItemCount: number;
  candidateCount: number;
  unresolvedCount: number;
  libraryReadyCount: number;
  recommendationReadyCount: number;
  promotionReadyCount: number;
};

export function validateCatalogExpansion(data: ExpansionData): ExpansionSummary {
  const issues: string[] = [];
  const sources = indexUnique(data.sources, (row) => row.sourceId, "sourceId", issues);
  const rawItems = indexUnique(data.rawItems, (row) => row.sourceItemId, "sourceItemId", issues);
  const candidates = indexUnique(data.candidates, (row) => row.candidateId, "candidateId", issues);
  const memberships = indexUnique(
    data.memberships,
    (row) => row.sourceItemId,
    "source membership",
    issues,
  );
  indexUnique(data.mappings, (row) => row.mappingId, "mappingId", issues);
  const mappingsByItem = indexUnique(
    data.mappings,
    (row) => row.sourceItemId,
    "canonical mapping sourceItemId",
    issues,
  );
  indexUnique(data.exclusions, (row) => row.exclusionId, "exclusionId", issues);
  const exclusionsByItem = indexUnique(
    data.exclusions,
    (row) => row.sourceItemId,
    "exclusion sourceItemId",
    issues,
  );
  const safetyReviews = indexUnique(
    data.safetyReviews,
    (row) => row.candidateId,
    "safety review candidateId",
    issues,
  );
  const annotationStatuses = indexUnique(
    data.annotationStatuses,
    (row) => row.candidateId,
    "annotation status candidateId",
    issues,
  );
  indexUnique(data.rakutenMatches, (row) => row.rakutenMatchId, "rakutenMatchId", issues);

  const ordinals = new Set<string>();
  for (const raw of data.rawItems) {
    if (!sources.has(raw.sourceId)) {
      issues.push(`Raw item ${raw.sourceItemId} references unknown source ${raw.sourceId}`);
    }
    const ordinalKey = `${raw.sourceId}\u0000${raw.sourceRowNumber}`;
    if (ordinals.has(ordinalKey)) {
      issues.push(`Duplicate source row number: ${raw.sourceId}:${raw.sourceRowNumber}`);
    }
    ordinals.add(ordinalKey);
    if (!memberships.has(raw.sourceItemId)) {
      issues.push(`Raw item has no terminal membership: ${raw.sourceItemId}`);
    }
  }

  for (const membership of data.memberships) {
    const raw = rawItems.get(membership.sourceItemId);
    if (raw === undefined) {
      issues.push(`Membership references unknown raw item: ${membership.sourceItemId}`);
      continue;
    }
    if (raw.sourceId !== membership.sourceId) {
      issues.push(`Membership source mismatch: ${membership.sourceItemId}`);
    }
    const mapping = mappingsByItem.get(membership.sourceItemId);
    const exclusion = exclusionsByItem.get(membership.sourceItemId);
    if (membership.status === "included" || membership.status === "duplicate") {
      if (membership.candidateId === "" || membership.decisionRef === "") {
        issues.push(
          `Mapped membership is missing candidateId or decisionRef: ${membership.sourceItemId}`,
        );
      }
      if (membership.workId !== "" && !ID_PATTERN.test(membership.workId)) {
        issues.push(`Mapped membership has invalid workId: ${membership.sourceItemId}`);
      }
      if (
        mapping === undefined ||
        mapping.mappingId !== membership.decisionRef ||
        mapping.mappingType !== membership.status ||
        mapping.candidateId !== membership.candidateId ||
        mapping.workId !== membership.workId
      ) {
        issues.push(`Membership does not match canonical mapping: ${membership.sourceItemId}`);
      }
      if (exclusion !== undefined) {
        issues.push(`Mapped membership also has an exclusion: ${membership.sourceItemId}`);
      }
    } else if (membership.status === "unresolved") {
      if (
        membership.candidateId !== "" ||
        membership.workId !== "" ||
        membership.decisionRef !== ""
      ) {
        issues.push(`Unresolved membership must not claim a decision: ${membership.sourceItemId}`);
      }
      if (mapping !== undefined || exclusion !== undefined) {
        issues.push(`Unresolved membership has a mapping or exclusion: ${membership.sourceItemId}`);
      }
    } else {
      if (membership.workId !== "" || membership.decisionRef === "") {
        issues.push(
          `Excluded membership has invalid workId or decisionRef: ${membership.sourceItemId}`,
        );
      }
      if (
        exclusion === undefined ||
        exclusion.exclusionId !== membership.decisionRef ||
        exclusion.status !== membership.status ||
        exclusion.candidateId !== membership.candidateId
      ) {
        issues.push(`Membership does not match exclusion: ${membership.sourceItemId}`);
      }
      if (mapping !== undefined) {
        issues.push(`Excluded membership also has a mapping: ${membership.sourceItemId}`);
      }
    }
  }

  for (const mapping of data.mappings) {
    const candidate = candidates.get(mapping.candidateId);
    if (candidate === undefined) {
      issues.push(`Mapping references unknown candidate: ${mapping.mappingId}`);
    } else if (candidate.canonicalTitleJa !== mapping.canonicalTitleJa) {
      issues.push(`Mapping canonical title differs from candidate: ${mapping.mappingId}`);
    }
    if (!rawItems.has(mapping.sourceItemId) || !memberships.has(mapping.sourceItemId)) {
      issues.push(`Orphan canonical mapping: ${mapping.mappingId}`);
    }
  }

  for (const exclusion of data.exclusions) {
    if (!rawItems.has(exclusion.sourceItemId) || !memberships.has(exclusion.sourceItemId)) {
      issues.push(`Orphan exclusion: ${exclusion.exclusionId}`);
    }
    if (exclusion.candidateId !== "" && !candidates.has(exclusion.candidateId)) {
      issues.push(`Exclusion references unknown candidate: ${exclusion.exclusionId}`);
    }
  }

  for (const candidate of data.candidates) {
    const referenced =
      data.mappings.some((row) => row.candidateId === candidate.candidateId) ||
      data.exclusions.some((row) => row.candidateId === candidate.candidateId);
    if (!referenced) {
      issues.push(`Orphan candidate: ${candidate.candidateId}`);
    }
  }

  for (const review of data.safetyReviews) {
    if (!candidates.has(review.candidateId)) {
      issues.push(`Safety review references unknown candidate: ${review.candidateId}`);
    }
  }

  for (const match of data.rakutenMatches) {
    if (!candidates.has(match.candidateId)) {
      issues.push(`Rakuten match references unknown candidate: ${match.rakutenMatchId}`);
    }
    if (match.matchStatus === "matched") {
      if (
        match.isbn === "" ||
        match.matchedTitle === "" ||
        match.editionKind === "" ||
        match.sourceUrl === ""
      ) {
        issues.push(`Matched Rakuten row is incomplete: ${match.rakutenMatchId}`);
      }
    } else if (
      match.isbn !== "" ||
      match.matchedTitle !== "" ||
      match.editionKind !== "" ||
      match.isRepresentative !== "false" ||
      match.sourceUrl !== ""
    ) {
      issues.push(`Unmatched Rakuten row must not claim a product: ${match.rakutenMatchId}`);
    }
  }

  const representativeByCandidate = new Set<string>();
  const representativeIsbn = new Set<string>();
  const representativeMatchByCandidate = new Map<string, RakutenMatch>();
  for (const match of data.rakutenMatches.filter((row) => row.isRepresentative === "true")) {
    if (match.matchStatus !== "matched") {
      issues.push(`Representative Rakuten row is not matched: ${match.rakutenMatchId}`);
    }
    if (representativeByCandidate.has(match.candidateId)) {
      issues.push(`Candidate has multiple representative ISBNs: ${match.candidateId}`);
    }
    representativeByCandidate.add(match.candidateId);
    representativeMatchByCandidate.set(match.candidateId, match);
    if (representativeIsbn.has(match.isbn)) {
      issues.push(`Representative ISBN is assigned to multiple candidates: ${match.isbn}`);
    }
    representativeIsbn.add(match.isbn);
  }

  for (const decision of data.representativeVolumeDecisions) {
    const candidate = candidates.get(decision.candidateId);
    if (candidate === undefined) {
      issues.push(
        `Representative-volume decision references unknown candidate: ${decision.workId}`,
      );
      continue;
    }
    try {
      assertRepresentativeDecisionIdentity(decision, {
        workId: decision.workId,
        candidateId: candidate.candidateId,
        canonicalTitleJa: candidate.canonicalTitleJa,
        creatorsJa: candidate.creatorsJa,
      });
    } catch (error) {
      issues.push(error instanceof Error ? error.message : String(error));
    }
    const candidateMappings = data.mappings.filter(
      (mapping) => mapping.candidateId === decision.candidateId,
    );
    if (
      candidateMappings.length === 0 ||
      candidateMappings.some(
        (mapping) =>
          mapping.workId !== decision.workId ||
          !mapping.notes.includes(`isbn=${decision.auditedIsbn}`),
      )
    ) {
      issues.push(
        `Representative-volume decision has stale canonical mappings: ${decision.workId}`,
      );
    }
    const match = representativeMatchByCandidate.get(decision.candidateId);
    if (
      match === undefined ||
      match.matchStatus !== "matched" ||
      match.editionKind !== "standard" ||
      match.isbn !== decision.auditedIsbn
    ) {
      issues.push(`Representative-volume decision has a stale Rakuten match: ${decision.workId}`);
    }
  }

  for (const status of data.annotationStatuses) {
    if (!candidates.has(status.candidateId)) {
      issues.push(`Annotation status references unknown candidate: ${status.candidateId}`);
    }
    if (status.reviewStatus === "unreviewed" && status.reviewReference !== "") {
      issues.push(`Unreviewed annotation must not have a review reference: ${status.candidateId}`);
    }
    if (status.reviewStatus !== "unreviewed" && status.reviewReference === "") {
      issues.push(`Reviewed annotation is missing its review reference: ${status.candidateId}`);
    }
  }

  for (const source of data.sources) {
    const sourceRawItems = data.rawItems.filter((row) => row.sourceId === source.sourceId);
    const sourceMemberships = data.memberships.filter((row) => row.sourceId === source.sourceId);
    const statusCount = (status: SourceMembership["status"]) =>
      sourceMemberships.filter((row) => row.status === status).length;
    const mappedCandidates = new Set(
      sourceMemberships
        .filter((row) => row.status === "included" || row.status === "duplicate")
        .map((row) => row.candidateId),
    );
    if (source.originalItemCount === "" && source.registryStatus !== "blocked") {
      issues.push(`Non-blocked source is missing originalItemCount: ${source.sourceId}`);
    }
    const expectedCounts: Array<[string, number, number]> = [
      [
        "excludedWebtoonCount",
        numeric(source.excludedWebtoonCount),
        statusCount("excluded-webtoon"),
      ],
      ["excludedAdultCount", numeric(source.excludedAdultCount), statusCount("excluded-adult")],
      [
        "excludedNonJapaneseCount",
        numeric(source.excludedNonJapaneseCount),
        statusCount("excluded-non-japanese"),
      ],
      [
        "excludedNonMangaCount",
        numeric(source.excludedNonMangaCount),
        statusCount("excluded-non-manga"),
      ],
      ["duplicateCount", numeric(source.duplicateCount), statusCount("duplicate")],
      ["canonicalMappingCount", numeric(source.canonicalMappingCount), mappedCandidates.size],
      ["unresolvedCount", numeric(source.unresolvedCount), statusCount("unresolved")],
    ];
    if (source.originalItemCount !== "") {
      expectedCounts.unshift([
        "originalItemCount",
        numeric(source.originalItemCount),
        sourceRawItems.length,
      ]);
    }
    for (const [field, declared, actual] of expectedCounts) {
      if (declared !== actual) {
        issues.push(`Source ${source.sourceId} ${field} is ${declared}, expected ${actual}`);
      }
    }
    if (sourceMemberships.length !== sourceRawItems.length) {
      issues.push(`Source ${source.sourceId} membership count does not match raw items`);
    }
    if (source.registryStatus === "complete") {
      const japaneseMangaItems = statusCount("included") + statusCount("duplicate");
      if (source.japaneseMangaItemCount === "") {
        issues.push(`Complete source is missing japaneseMangaItemCount: ${source.sourceId}`);
      } else if (numeric(source.japaneseMangaItemCount) !== japaneseMangaItems) {
        issues.push(
          `Source ${source.sourceId} japaneseMangaItemCount is ${source.japaneseMangaItemCount}, expected ${japaneseMangaItems}`,
        );
      }
      if (statusCount("unresolved") !== 0) {
        issues.push(`Complete source still has unresolved items: ${source.sourceId}`);
      }
    }
  }

  if (issues.length > 0) {
    throw new Error(`Catalog expansion validation failed:\n${issues.sort().join("\n")}`);
  }

  const annotationComplete = (candidate: Candidate) => {
    const annotation = annotationStatuses.get(candidate.candidateId);
    return (
      safetyReviews.get(candidate.candidateId)?.safetyStatus === "safe" &&
      representativeByCandidate.has(candidate.candidateId) &&
      annotation?.bibliographyStatus === "complete" &&
      annotation.factorStatus === "complete" &&
      annotation.themeStatus === "complete" &&
      annotation.evidenceStatus === "complete" &&
      annotation.artEvidenceStatus === "complete"
    );
  };
  const libraryReadyCount = data.candidates.filter(
    (candidate) =>
      annotationComplete(candidate) &&
      annotationStatuses.get(candidate.candidateId)?.reviewStatus === "unreviewed",
  ).length;
  const recommendationReadyCount = data.candidates.filter(
    (candidate) =>
      annotationComplete(candidate) &&
      annotationStatuses.get(candidate.candidateId)?.reviewStatus !== "unreviewed",
  ).length;

  return {
    sourceCount: data.sources.length,
    rawItemCount: data.rawItems.length,
    candidateCount: data.candidates.length,
    unresolvedCount: data.memberships.filter((row) => row.status === "unresolved").length,
    libraryReadyCount,
    recommendationReadyCount,
    promotionReadyCount: recommendationReadyCount,
  };
}

const GOLD_DATASETS = [
  { file: "works.csv", workIdColumn: "id", mode: "exact" },
  { file: "aliases.csv", workIdColumn: "workId", mode: "subset" },
  { file: "volumes.csv", workIdColumn: "workId", mode: "subset" },
  { file: "factors.csv", workIdColumn: "workId", mode: "exact" },
  { file: "themes.csv", workIdColumn: "workId", mode: "exact" },
  { file: "recommendation-context.csv", workIdColumn: "workId", mode: "exact" },
  { file: "evidence/evidence.csv", workIdColumn: "workId", mode: "subset" },
  { file: "evidence/art-evidence-manifest.csv", workIdColumn: "workId", mode: "exact" },
] as const;

const goldSetManifestSchema = z.strictObject({
  schemaVersion: z.literal(1),
  baselineMainSha: z.string().regex(/^[a-f0-9]{40}$/u),
  baselineCatalogVersion: z.string().min(1),
  workCount: z.number().int().positive(),
  workIds: z.array(id),
  workIdsSha256: z.string().regex(SHA256_PATTERN),
  datasets: z.record(
    z.string(),
    z.strictObject({
      mode: z.enum(["exact", "subset"]),
      rowCount: z.number().int().nonnegative(),
      headerSha256: z.string().regex(SHA256_PATTERN),
      rowSha256: z.array(z.string().regex(SHA256_PATTERN)),
      sha256: z.string().regex(SHA256_PATTERN),
    }),
  ),
  reviewFiles: z.record(z.string(), z.string().regex(SHA256_PATTERN)),
  goldSetSha256: z.string().regex(SHA256_PATTERN),
});

export type GoldSetManifest = z.infer<typeof goldSetManifestSchema>;

function codeUnitCompare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sha256(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

function canonicalGoldDataset(
  sourceDirectory: string,
  file: string,
  workIdColumn: string,
  mode: "exact" | "subset",
  ids: Set<string>,
) {
  const matrix = matrixSchema.parse(
    parse(readFileSync(join(sourceDirectory, file), "utf8"), {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }),
  );
  const [headers, ...rows] = matrix;
  if (headers === undefined) {
    throw new Error(`Gold Set source is empty: ${file}`);
  }
  const workIdIndex = headers.indexOf(workIdColumn);
  if (workIdIndex < 0) {
    throw new Error(`Gold Set source has no ${workIdColumn}: ${file}`);
  }
  const selected = rows.filter((row) => ids.has(row[workIdIndex] ?? ""));
  const headerSha256 = sha256(JSON.stringify(headers));
  const rowSha256 = selected.map((row) => sha256(JSON.stringify(row))).sort(codeUnitCompare);
  return {
    mode,
    rowCount: selected.length,
    headerSha256,
    rowSha256,
    sha256: sha256(JSON.stringify({ mode, headerSha256, rowSha256 })),
  };
}

function deriveGoldSetState(root: string, workIds: readonly string[]) {
  const sourceDirectory = join(root, "data/source");
  const ids = new Set(workIds);
  const datasets = Object.fromEntries(
    GOLD_DATASETS.map(({ file, workIdColumn, mode }) => [
      file,
      canonicalGoldDataset(sourceDirectory, file, workIdColumn, mode, ids),
    ]),
  );

  const worksMatrix = matrixSchema.parse(
    parse(readFileSync(join(sourceDirectory, "works.csv"), "utf8"), {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }),
  );
  const [headers, ...works] = worksMatrix;
  const idIndex = headers?.indexOf("id") ?? -1;
  const referenceIndex = headers?.indexOf("annotationReviewReference") ?? -1;
  if (idIndex < 0 || referenceIndex < 0) {
    throw new Error("Gold Set works.csv is missing identity or review reference columns");
  }
  const references = [
    ...new Set(
      works
        .filter((row) => ids.has(row[idIndex] ?? ""))
        .map((row) => row[referenceIndex] ?? "")
        .filter((value) => value !== ""),
    ),
  ].sort(codeUnitCompare);
  const reviewFiles = Object.fromEntries(
    references.map((file) => [file, sha256(readFileSync(join(sourceDirectory, file)))]),
  );
  return { datasets, reviewFiles };
}

export function deriveGoldSetManifest(
  root: string,
  workIds: readonly string[],
  baselineMainSha: string,
  baselineCatalogVersion: string,
): GoldSetManifest {
  const canonicalWorkIds = [...workIds].sort(codeUnitCompare);
  if (new Set(canonicalWorkIds).size !== canonicalWorkIds.length) {
    throw new Error("Gold Set work IDs contain duplicates");
  }
  const state = deriveGoldSetState(root, canonicalWorkIds);
  const workIdsSha256 = sha256(`${canonicalWorkIds.join("\n")}\n`);
  const binding = {
    schemaVersion: 1 as const,
    baselineMainSha,
    baselineCatalogVersion,
    workCount: canonicalWorkIds.length,
    workIds: canonicalWorkIds,
    workIdsSha256,
    datasets: state.datasets,
    reviewFiles: state.reviewFiles,
  };
  return goldSetManifestSchema.parse({
    ...binding,
    goldSetSha256: sha256(JSON.stringify(binding)),
  });
}

export function validateGoldSet(root: string, manifestInput: unknown) {
  const manifest = goldSetManifestSchema.parse(manifestInput);
  if (
    manifest.workCount !== 150 ||
    manifest.workIds.length !== manifest.workCount ||
    new Set(manifest.workIds).size !== manifest.workIds.length ||
    JSON.stringify([...manifest.workIds].sort(codeUnitCompare)) !==
      JSON.stringify(manifest.workIds) ||
    sha256(`${manifest.workIds.join("\n")}\n`) !== manifest.workIdsSha256
  ) {
    throw new Error("Gold Set manifest work IDs are not unique and canonical");
  }
  const expectedDatasetKeys = GOLD_DATASETS.map(({ file }) => file).sort(codeUnitCompare);
  if (
    JSON.stringify(Object.keys(manifest.datasets).sort(codeUnitCompare)) !==
    JSON.stringify(expectedDatasetKeys)
  ) {
    throw new Error("Gold Set manifest does not bind the exact dataset set");
  }
  const baselineBinding = {
    schemaVersion: manifest.schemaVersion,
    baselineMainSha: manifest.baselineMainSha,
    baselineCatalogVersion: manifest.baselineCatalogVersion,
    workCount: manifest.workCount,
    workIds: manifest.workIds,
    workIdsSha256: manifest.workIdsSha256,
    datasets: manifest.datasets,
    reviewFiles: manifest.reviewFiles,
  };
  if (sha256(JSON.stringify(baselineBinding)) !== manifest.goldSetSha256) {
    throw new Error("Gold Set manifest binding is invalid");
  }

  const state = deriveGoldSetState(root, manifest.workIds);
  for (const { file, mode } of GOLD_DATASETS) {
    const baseline = manifest.datasets[file];
    const current = state.datasets[file];
    if (baseline === undefined || current === undefined) {
      throw new Error(`Gold Set dataset binding is missing: ${file}`);
    }
    if (
      baseline.rowCount !== baseline.rowSha256.length ||
      baseline.mode !== mode ||
      JSON.stringify([...baseline.rowSha256].sort(codeUnitCompare)) !==
        JSON.stringify(baseline.rowSha256) ||
      sha256(
        JSON.stringify({
          mode: baseline.mode,
          headerSha256: baseline.headerSha256,
          rowSha256: baseline.rowSha256,
        }),
      ) !== baseline.sha256
    ) {
      throw new Error(`Gold Set dataset manifest is invalid: ${file}`);
    }
    if (baseline.headerSha256 !== current.headerSha256) {
      throw new Error(`Gold Set dataset header changed: ${file}`);
    }
    if (baseline.mode === "exact") {
      if (JSON.stringify(baseline.rowSha256) !== JSON.stringify(current.rowSha256)) {
        throw new Error(`Gold Set rows changed: ${file}`);
      }
      continue;
    }
    const available = new Map<string, number>();
    for (const digest of current.rowSha256) {
      available.set(digest, (available.get(digest) ?? 0) + 1);
    }
    for (const digest of baseline.rowSha256) {
      const remaining = available.get(digest) ?? 0;
      if (remaining === 0) {
        throw new Error(`Gold Set row changed or was removed: ${file}:${digest}`);
      }
      available.set(digest, remaining - 1);
    }
  }
  if (JSON.stringify(state.reviewFiles) !== JSON.stringify(manifest.reviewFiles)) {
    throw new Error("Gold Set review provenance changed");
  }
  return manifest;
}

export function runCatalogExpansionValidation(root = process.cwd()) {
  const stagingDirectory = join(root, "data/staging/catalog-expansion");
  const summary = validateCatalogExpansion(loadCatalogExpansion(stagingDirectory));
  const manifest = validateGoldSet(
    root,
    JSON.parse(readFileSync(join(stagingDirectory, "gold-set-manifest.json"), "utf8")) as unknown,
  );
  return { summary, goldWorkCount: manifest.workCount };
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    const result = runCatalogExpansionValidation();
    console.log(
      `Catalog expansion staging: ${result.summary.sourceCount} sources, ${result.summary.rawItemCount} raw items, ${result.summary.candidateCount} candidates, ${result.summary.unresolvedCount} unresolved, ${result.summary.libraryReadyCount} library-ready, ${result.summary.recommendationReadyCount} recommendation-ready; Gold Set ${result.goldWorkCount} intact.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
