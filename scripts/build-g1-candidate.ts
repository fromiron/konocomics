import { createHash } from "node:crypto";
import {
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

import { ART_AXIS_IDS, FACTOR_SOURCE_TYPES } from "../src/domain/catalog/constants";
import { buildG1ReplacementManifest, replacementManifestSchema } from "./build-g1-replacement";
import { NON_ART_AXIS_IDS } from "./catalog/g1-replacement";
import { runCatalogPipeline } from "./catalog/pipeline";
import { formatSourceIssue } from "./catalog/report";
import {
  evidenceSourceRowSchema,
  recommendationContextSourceRowSchema,
} from "./catalog/source-schema";

const matrixSchema = z.array(z.array(z.string()));
const catalogIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u, {
  message: "Must be a lowercase kebab-case catalog ID",
});
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const cohortManifestSchema = z.strictObject({
  schemaVersion: z.literal(1),
  policyVersion: z.string().trim().min(1),
  originalCohortFreezeSha256: sha256Schema,
  replacementManifestSha256: sha256Schema,
  workIds: z.array(catalogIdSchema).length(50),
});
const histogramSchema = z.record(z.string(), z.number().int().nonnegative());
const originalCohortFreezeSchema = z.object({
  schemaVersion: z.literal(1),
  workIds: z.array(catalogIdSchema).length(50),
  histograms: z.strictObject({
    demographic: histogramSchema,
    catalogRole: histogramSchema,
    onboardingEligible: z.number().int().nonnegative(),
    recommendationEligible: z.number().int().nonnegative(),
    libraryOnly: z.number().int().nonnegative(),
  }),
  replacementSlots: z
    .array(
      z.strictObject({
        workId: catalogIdSchema,
        demographic: z.string().min(1),
        catalogRole: z.string().min(1),
        onboardingEligible: z.boolean(),
      }),
    )
    .length(2),
});

const datasets = [
  {
    file: "works.csv",
    headers: [
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
    ],
    keyColumns: ["id"],
    overrideMode: "row" as const,
  },
  {
    file: "aliases.csv",
    headers: ["workId", "alias"],
    keyColumns: ["workId", "alias"],
    overrideMode: "row" as const,
  },
  {
    file: "volumes.csv",
    headers: [
      "id",
      "workId",
      "volumeNumber",
      "isbn",
      "releaseDate",
      "editionKind",
      "isRepresentative",
      "evidenceId",
    ],
    keyColumns: ["id"],
    overrideMode: "row" as const,
  },
  {
    file: "factors.csv",
    headers: ["workId", "axisId", "state", "value", "confidence", "evidenceId"],
    keyColumns: ["workId", "axisId"],
    overrideMode: "row" as const,
  },
  {
    file: "themes.csv",
    headers: ["workId", "themeId", "centrality", "confidence", "evidenceId"],
    keyColumns: ["workId", "themeId"],
    overrideMode: "workSet" as const,
  },
  {
    file: "recommendation-context.csv",
    headers: [
      "workId",
      "catalogRole",
      "seriesGroupId",
      "volumeCount",
      "reviewAverage",
      "reviewCount",
    ],
    keyColumns: ["workId"],
    overrideMode: "row" as const,
  },
] as const;

const evidenceHeaders = [
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
const evidenceDataset = {
  file: "evidence.csv",
  headers: evidenceHeaders,
  keyColumns: ["id"],
  overrideMode: "row" as const,
};
const artEvidenceManifestHeaders = [
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
const reconciledGenreHeaders = ["workId", "genres"] as const;
const deferredWorkHeaders = [
  "workId",
  "failureReason",
  "checkedSources",
  "lastChecked",
  "reentryCondition",
] as const;
const requiredText = z.string().trim().min(1);
export const artEvidenceManifestRowSchema = z
  .strictObject({
    workId: catalogIdSchema,
    axisId: z.enum(ART_AXIS_IDS),
    state: z.enum(["known", "unknown", "notApplicable"]),
    value: z.string(),
    confidence: z.string(),
    authorityClass: z.enum([
      "licensedPublisher",
      "publisherAuthorizedPlatform",
      "originalPublisher",
    ]),
    sourceType: z.enum(FACTOR_SOURCE_TYPES),
    sourceUrl: z.url(),
    edition: requiredText,
    scopeMapping: requiredText,
    pageOrTimeRefs: z.string(),
    sampleCount: z.string().regex(/^\d+$/u).transform(Number),
    contexts: requiredText,
    observation: requiredText,
    limitation: requiredText,
    reviewStatus: requiredText,
  })
  .superRefine((row, context) => {
    if (row.state === "known") {
      if (!/^[0-4]$/u.test(row.value)) {
        context.addIssue({ code: "custom", path: ["value"], message: "Known value is required" });
      }
      const confidence = Number(row.confidence);
      if (!/^\d+(?:\.\d+)?$/u.test(row.confidence) || confidence < 0 || confidence > 1) {
        context.addIssue({
          code: "custom",
          path: ["confidence"],
          message: "Known confidence must be between 0 and 1",
        });
      }
    } else if (row.value !== "" || row.confidence !== "") {
      context.addIssue({
        code: "custom",
        path: ["value"],
        message: "Unknown or not-applicable evidence cannot have value or confidence",
      });
    }
    if (row.state !== "unknown" && row.pageOrTimeRefs.trim() === "") {
      context.addIssue({
        code: "custom",
        path: ["pageOrTimeRefs"],
        message: "Known or not-applicable Art evidence requires references",
      });
    }
    const expectedSourceType =
      row.authorityClass === "publisherAuthorizedPlatform" ? "manual" : "publisher";
    if (row.sourceType !== expectedSourceType) {
      context.addIssue({
        code: "custom",
        path: ["sourceType"],
        message: `${row.authorityClass} requires sourceType=${expectedSourceType}`,
      });
    }
  });
const deferredWorkRowSchema = z.strictObject({
  workId: catalogIdSchema,
  failureReason: requiredText,
  checkedSources: requiredText,
  lastChecked: z.iso.date(),
  reentryCondition: requiredText,
});

type Dataset = (typeof datasets)[number];
type MergeableDataset = {
  file: string;
  headers: readonly string[];
  keyColumns: readonly string[];
  overrideMode: "row" | "workSet";
};
type ArtEvidenceManifestRow = z.infer<typeof artEvidenceManifestRowSchema>;
type G1WorkContract = {
  id: string;
  demographic: string;
  onboardingEligible: boolean;
  recommendationEligible: boolean;
  libraryOnly: boolean;
};
type G1ContextContract = { workId: string; catalogRole: string };
type G1FactorContract = {
  workId: string;
  axisId: string;
  state: string;
  value: string;
  confidence: string;
  evidenceId: string;
};
type G1EvidenceContract = {
  id: string;
  workId: string;
  sourceType: string;
  sourceUrl?: string;
};
type G1HistogramContract = z.infer<typeof originalCohortFreezeSchema>["histograms"];
type G1Replacement = z.infer<typeof replacementManifestSchema>["replacements"][number];

function parseCsv(path: string, expectedHeaders: readonly string[]) {
  const rows = matrixSchema.parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }),
  );
  const [headers, ...dataRows] = rows;
  if (headers === undefined || headers.join("\u0000") !== expectedHeaders.join("\u0000")) {
    throw new Error(`Unexpected CSV header in ${path}`);
  }
  for (const [index, row] of dataRows.entries()) {
    if (row.length !== headers.length) {
      throw new Error(`Unexpected column count in ${path}:${index + 2}`);
    }
  }
  return dataRows;
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeCsv(headers: readonly string[], rows: readonly (readonly string[])[]) {
  return `${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function fileHash(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function columnIndex(headers: readonly string[], column: string) {
  const index = headers.indexOf(column);
  if (index < 0) {
    throw new Error(`Missing column ${column}`);
  }
  return index;
}

function rowRecord(headers: readonly string[], row: readonly string[]) {
  return Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]));
}

function rowKey(headers: readonly string[], row: readonly string[], columns: readonly string[]) {
  return columns.map((column) => row[columnIndex(headers, column)] ?? "").join("\u0000");
}

function mergeOverrides(dataset: MergeableDataset, rows: string[][], overrides: string[][]) {
  const overrideKeys = new Set<string>();
  for (const row of overrides) {
    const key = rowKey(dataset.headers, row, dataset.keyColumns);
    if (overrideKeys.has(key)) {
      throw new Error(
        `Duplicate override key in ${dataset.file}: ${key.replaceAll("\u0000", "/")}`,
      );
    }
    overrideKeys.add(key);
  }
  if (dataset.overrideMode === "workSet") {
    const workIdIndex = columnIndex(dataset.headers, "workId");
    const overriddenWorks = new Set(overrides.map((row) => row[workIdIndex]));
    return [...rows.filter((row) => !overriddenWorks.has(row[workIdIndex])), ...overrides];
  }
  const overrideByKey = new Map(
    overrides.map((row) => [rowKey(dataset.headers, row, dataset.keyColumns), row]),
  );
  const result = rows.map(
    (row) => overrideByKey.get(rowKey(dataset.headers, row, dataset.keyColumns)) ?? row,
  );
  const existingKeys = new Set(rows.map((row) => rowKey(dataset.headers, row, dataset.keyColumns)));
  for (const row of overrides) {
    if (!existingKeys.has(rowKey(dataset.headers, row, dataset.keyColumns))) {
      result.push(row);
    }
  }
  return result;
}

function applyOverrides(dataset: MergeableDataset, rows: string[][], overrideDirectory: string) {
  const overridePath = join(overrideDirectory, dataset.file);
  return existsSync(overridePath)
    ? mergeOverrides(dataset, rows, parseCsv(overridePath, dataset.headers))
    : rows;
}

function resetAnnotationReview(headers: readonly string[], rows: string[][]) {
  const method = columnIndex(headers, "annotationReviewMethod");
  const reviewedAt = columnIndex(headers, "annotationReviewedAt");
  const reference = columnIndex(headers, "annotationReviewReference");
  return rows.map((row) => {
    const next = [...row];
    next[method] = "unreviewed";
    next[reviewedAt] = "";
    next[reference] = "";
    return next;
  });
}

function collectDataset(
  dataset: Dataset,
  sourceDirectory: string,
  chunkDirectories: readonly string[],
) {
  return [
    ...parseCsv(join(sourceDirectory, dataset.file), dataset.headers),
    ...chunkDirectories.flatMap((directory) =>
      parseCsv(join(directory, dataset.file), dataset.headers),
    ),
  ];
}

function filterRowsToCohort(
  headers: readonly string[],
  rows: string[][],
  cohortIds: ReadonlySet<string>,
  ownerColumn: "id" | "workId",
) {
  const ownerIndex = columnIndex(headers, ownerColumn);
  return rows.filter((row) => cohortIds.has(row[ownerIndex] ?? ""));
}

function histogram(values: readonly string[]) {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Object.fromEntries(
    [...counts].sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0)),
  );
}

function assertHistogram(
  label: string,
  values: readonly string[],
  expected: Readonly<Record<string, number>>,
) {
  const actual = histogram(values);
  const normalizedExpected = Object.fromEntries(
    Object.entries(expected).sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0)),
  );
  if (JSON.stringify(actual) !== JSON.stringify(normalizedExpected)) {
    throw new Error(
      `G1 ${label} histogram mismatch: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
    );
  }
}

function assertExactIds(label: string, ids: readonly string[], expected: ReadonlySet<string>) {
  const actual = new Set(ids);
  if (actual.size !== ids.length) {
    throw new Error(`G1 ${label} IDs must be unique`);
  }
  const missing = [...expected].filter((id) => !actual.has(id)).sort();
  const extra = [...actual].filter((id) => !expected.has(id)).sort();
  if (missing.length > 0 || extra.length > 0) {
    throw new Error(
      `G1 ${label} IDs must match the cohort manifest: missing=${missing.join(",") || "none"}; extra=${extra.join(",") || "none"}`,
    );
  }
}

export function assertG1CohortManifest(
  manifestInput: unknown,
  freezeInput: unknown,
  replacementInput: unknown,
  hashes: { originalCohortFreezeSha256: string; replacementManifestSha256: string },
) {
  const manifest = cohortManifestSchema.parse(manifestInput);
  const freeze = originalCohortFreezeSchema.parse(freezeInput);
  const replacement = replacementManifestSchema.parse(replacementInput);
  if (new Set(freeze.workIds).size !== freeze.workIds.length) {
    throw new Error("Original G1 cohort freeze contains duplicate work IDs");
  }
  if (manifest.policyVersion !== replacement.policyVersion) {
    throw new Error("G1 cohort manifest policyVersion does not match the replacement manifest");
  }
  if (
    manifest.originalCohortFreezeSha256 !== hashes.originalCohortFreezeSha256 ||
    replacement.inputHashes.originalCohortFreezeFile !== hashes.originalCohortFreezeSha256
  ) {
    throw new Error("G1 cohort manifest is not bound to the current original cohort freeze");
  }
  if (manifest.replacementManifestSha256 !== hashes.replacementManifestSha256) {
    throw new Error("G1 cohort manifest is not bound to the current replacement manifest");
  }

  const slotByWorkId = new Map(freeze.replacementSlots.map((slot) => [slot.workId, slot]));
  const selectedByRemoved = new Map<string, string>();
  for (const item of replacement.replacements) {
    const slot = slotByWorkId.get(item.removedWorkId);
    if (
      slot === undefined ||
      slot.demographic !== item.inherited.demographic ||
      slot.catalogRole !== item.inherited.catalogRole ||
      slot.onboardingEligible !== item.inherited.onboardingEligible
    ) {
      throw new Error(`Replacement inheritance does not match frozen slot ${item.removedWorkId}`);
    }
    if (selectedByRemoved.has(item.removedWorkId)) {
      throw new Error(`Duplicate replacement slot ${item.removedWorkId}`);
    }
    selectedByRemoved.set(item.removedWorkId, item.selectedWorkId);
  }
  if (selectedByRemoved.size !== freeze.replacementSlots.length) {
    throw new Error("Replacement manifest does not cover every frozen replacement slot");
  }
  const expectedWorkIds = freeze.workIds.map((workId) => selectedByRemoved.get(workId) ?? workId);
  if (
    new Set(manifest.workIds).size !== manifest.workIds.length ||
    JSON.stringify(manifest.workIds) !== JSON.stringify(expectedWorkIds)
  ) {
    throw new Error("G1 cohort manifest must preserve frozen order and selected replacements");
  }
  return { manifest, freeze, replacement };
}

export function assertG1Cohort(
  manifestWorkIds: readonly string[],
  works: readonly G1WorkContract[],
  context: readonly G1ContextContract[],
  expected: G1HistogramContract,
  replacements: readonly G1Replacement[],
) {
  const manifestIds = new Set(manifestWorkIds);
  if (manifestWorkIds.length !== 50 || manifestIds.size !== 50) {
    throw new Error("G1 cohort manifest must contain exactly 50 unique work IDs");
  }
  assertExactIds(
    "work",
    works.map((work) => work.id),
    manifestIds,
  );
  assertExactIds(
    "recommendation-eligible work",
    works.filter((work) => work.recommendationEligible).map((work) => work.id),
    manifestIds,
  );
  assertExactIds(
    "recommendation context",
    context.map((row) => row.workId),
    manifestIds,
  );
  const onboardingCount = works.filter((work) => work.onboardingEligible).length;
  const recommendationCount = works.filter((work) => work.recommendationEligible).length;
  const libraryOnlyCount = works.filter((work) => work.libraryOnly).length;
  if (onboardingCount !== expected.onboardingEligible) {
    throw new Error(
      `G1 requires ${expected.onboardingEligible} onboarding-eligible works, received ${onboardingCount}`,
    );
  }
  if (recommendationCount !== expected.recommendationEligible) {
    throw new Error(
      `G1 requires ${expected.recommendationEligible} recommendation-eligible works, received ${recommendationCount}`,
    );
  }
  if (libraryOnlyCount !== expected.libraryOnly) {
    throw new Error(
      `G1 requires ${expected.libraryOnly} library-only works, received ${libraryOnlyCount}`,
    );
  }
  assertHistogram(
    "demographic",
    works.map((work) => work.demographic),
    expected.demographic,
  );
  assertHistogram(
    "catalog role",
    context.map((row) => row.catalogRole),
    expected.catalogRole,
  );
  const workById = new Map(works.map((work) => [work.id, work]));
  const contextById = new Map(context.map((row) => [row.workId, row]));
  for (const item of replacements) {
    const work = workById.get(item.selectedWorkId);
    const contextRow = contextById.get(item.selectedWorkId);
    if (
      work?.demographic !== item.inherited.demographic ||
      work.onboardingEligible !== item.inherited.onboardingEligible ||
      contextRow?.catalogRole !== item.inherited.catalogRole
    ) {
      throw new Error(`Selected work does not preserve inherited slot: ${item.selectedWorkId}`);
    }
  }
}

function hasContinuousSequenceRange(references: string) {
  const hasPageOrPanelRange = [
    ...references.matchAll(/\b(?:pages?|panels?)\s+(\d+)\s*-\s*(\d+)/giu),
  ].some((match) => Number(match[2]) > Number(match[1]));
  if (hasPageOrPanelRange) {
    return true;
  }
  return [
    ...references.matchAll(
      /\b(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d(?:\.\d+)?)\s*-\s*(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d(?:\.\d+)?)\b/gu,
    ),
  ].some((match) => {
    const start = Number(match[1] ?? 0) * 3600 + Number(match[2]) * 60 + Number(match[3]);
    const end = Number(match[4] ?? 0) * 3600 + Number(match[5]) * 60 + Number(match[6]);
    return end > start;
  });
}

export function assertG1ArtEvidence(
  manifestRows: readonly ArtEvidenceManifestRow[],
  factors: readonly G1FactorContract[],
  evidenceRows: readonly G1EvidenceContract[],
  cohortIds: ReadonlySet<string>,
  deferredWorkIds: readonly string[],
) {
  if (manifestRows.length !== 200) {
    throw new Error(
      `G1 Art evidence manifest requires exactly 200 rows, received ${manifestRows.length}`,
    );
  }
  const expectedPairs = new Set(
    [...cohortIds].flatMap((workId) => ART_AXIS_IDS.map((axisId) => `${workId}\u0000${axisId}`)),
  );
  const manifestPairs = new Set<string>();
  for (const row of manifestRows) {
    const pair = `${row.workId}\u0000${row.axisId}`;
    if (manifestPairs.has(pair)) {
      throw new Error(`Duplicate Art evidence pair: ${row.workId}/${row.axisId}`);
    }
    manifestPairs.add(pair);
  }
  const missingPairs = [...expectedPairs].filter((pair) => !manifestPairs.has(pair)).sort();
  const extraPairs = [...manifestPairs].filter((pair) => !expectedPairs.has(pair)).sort();
  if (missingPairs.length > 0 || extraPairs.length > 0) {
    throw new Error(
      `G1 Art evidence pairs must equal cohort x Art axes: missing=${missingPairs.length}; extra=${extraPairs.length}`,
    );
  }
  const factorByAxis = new Map<string, G1FactorContract>();
  for (const factor of factors) {
    const pair = `${factor.workId}\u0000${factor.axisId}`;
    if (factorByAxis.has(pair)) {
      throw new Error(`Duplicate final factor pair: ${factor.workId}/${factor.axisId}`);
    }
    factorByAxis.set(pair, factor);
  }
  const evidenceById = new Map<string, G1EvidenceContract>();
  for (const evidence of evidenceRows) {
    if (evidenceById.has(evidence.id)) {
      throw new Error(`Duplicate final evidence ID: ${evidence.id}`);
    }
    evidenceById.set(evidence.id, evidence);
  }
  const referencesByWork = new Map<string, Set<string>>();
  const contextsByWork = new Map<string, Set<string>>();
  for (const row of manifestRows) {
    if (!cohortIds.has(row.workId)) {
      throw new Error(`Art evidence work is outside the G1 cohort: ${row.workId}`);
    }
    const factor = factorByAxis.get(`${row.workId}\u0000${row.axisId}`);
    if (
      factor === undefined ||
      factor.state !== row.state ||
      factor.value !== row.value ||
      factor.confidence !== row.confidence
    ) {
      throw new Error(`Art evidence does not match final factor: ${row.workId}/${row.axisId}`);
    }
    const evidence = evidenceById.get(factor.evidenceId);
    if (
      evidence === undefined ||
      evidence.workId !== row.workId ||
      evidence.sourceType !== row.sourceType ||
      evidence.sourceUrl === undefined ||
      new URL(evidence.sourceUrl).href !== new URL(row.sourceUrl).href
    ) {
      throw new Error(
        `Art evidence provenance does not match final factor: ${row.workId}/${row.axisId}`,
      );
    }
    const distinctSampleRefs = new Set(
      row.pageOrTimeRefs
        .split(";")
        .map((reference) => reference.trim())
        .filter((reference) => reference !== "" && !/\bcover\b/iu.test(reference)),
    );
    const workReferences = referencesByWork.get(row.workId) ?? new Set<string>();
    for (const reference of distinctSampleRefs) {
      workReferences.add(reference);
    }
    referencesByWork.set(row.workId, workReferences);
    const workContexts = contextsByWork.get(row.workId) ?? new Set<string>();
    for (const context of row.contexts
      .split(";")
      .map((value) => value.trim())
      .filter((value) => value !== "")) {
      workContexts.add(context);
    }
    contextsByWork.set(row.workId, workContexts);
    if (row.state === "known" && row.axisId !== "motionImpact" && distinctSampleRefs.size < 2) {
      throw new Error(
        `Known static Art evidence requires two distinct non-cover references: ${row.workId}/${row.axisId}`,
      );
    }
    if (
      row.state === "known" &&
      row.axisId === "motionImpact" &&
      !hasContinuousSequenceRange(row.pageOrTimeRefs)
    ) {
      throw new Error(`Known motion evidence requires a continuous sequence: ${row.workId}`);
    }
  }
  for (const workId of cohortIds) {
    if ((referencesByWork.get(workId)?.size ?? 0) < 6) {
      throw new Error(`Art evidence requires six work-wide samples: ${workId}`);
    }
    if ((contextsByWork.get(workId)?.size ?? 0) < 2) {
      throw new Error(`Art evidence requires two distinct work-wide contexts: ${workId}`);
    }
  }
  for (const workId of deferredWorkIds) {
    if (cohortIds.has(workId)) {
      throw new Error(`Deferred work cannot remain in the G1 cohort: ${workId}`);
    }
  }
}

export function equalWeightCatalogAverage(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
) {
  if (rows.length !== 50) {
    throw new Error(`G1 requires exactly 50 recommendation context rows, received ${rows.length}`);
  }
  const observedRatings: number[] = [];
  for (const row of rows) {
    const context = recommendationContextSourceRowSchema.parse(rowRecord(headers, row));
    if (context.reviewAverage !== undefined && (context.reviewCount ?? 0) > 0) {
      observedRatings.push(context.reviewAverage);
    }
  }
  if (observedRatings.length === 0) {
    throw new Error("G1 catalog average requires at least one reviewed work");
  }
  return String(observedRatings.reduce((sum, rating) => sum + rating, 0) / observedRatings.length);
}

function writeCandidateFile(directory: string, path: string, content: string) {
  const destination = join(directory, path);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, content, { encoding: "utf8", mode: 0o600 });
}

export function publishCandidateDirectory(
  candidate: string,
  output: string,
  backup: string,
  operations = { existsSync, renameSync, rmSync },
) {
  const hadPreviousOutput = operations.existsSync(output);
  if (hadPreviousOutput) {
    operations.renameSync(output, backup);
  }
  try {
    operations.renameSync(candidate, output);
  } catch (publishError) {
    if (hadPreviousOutput) {
      try {
        operations.renameSync(backup, output);
      } catch (restoreError) {
        throw new AggregateError(
          [publishError, restoreError],
          `Candidate publish and rollback failed; previous candidate is preserved at ${backup}`,
        );
      }
    }
    throw publishError;
  }
  if (hadPreviousOutput) {
    try {
      operations.rmSync(backup, { recursive: true, force: true });
    } catch (error) {
      console.warn(
        `Published candidate, but could not remove previous candidate backup at ${backup}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

function buildG1Candidate(root = process.cwd()) {
  const sourceDirectory = join(root, "data/source");
  const stagingDirectory = join(root, "data/staging/g1");
  const outputDirectory = join(stagingDirectory, "candidate-source");
  const chunkDirectories = ["chunk-a", "chunk-b", "chunk-c"].map((directory) =>
    join(stagingDirectory, directory),
  );
  const overrideDirectory = join(stagingDirectory, "candidate-overrides");
  const originalCohortFreezePath = join(stagingDirectory, "original-cohort-freeze.json");
  const replacementManifestPath = join(stagingDirectory, "replacement-manifest.json");
  const originalCohortFreezeInput: unknown = JSON.parse(
    readFileSync(originalCohortFreezePath, "utf8"),
  );
  const replacementManifestInput: unknown = JSON.parse(
    readFileSync(replacementManifestPath, "utf8"),
  );
  const currentReplacementManifest = buildG1ReplacementManifest(root);
  const persistedReplacementManifest = replacementManifestSchema.parse(replacementManifestInput);
  if (JSON.stringify(persistedReplacementManifest) !== JSON.stringify(currentReplacementManifest)) {
    throw new Error("Replacement manifest is stale for the current frozen inputs");
  }
  const cohortManifestInput: unknown = JSON.parse(
    readFileSync(join(stagingDirectory, "cohort-manifest.json"), "utf8"),
  );
  const { manifest, freeze, replacement } = assertG1CohortManifest(
    cohortManifestInput,
    originalCohortFreezeInput,
    persistedReplacementManifest,
    {
      originalCohortFreezeSha256: fileHash(originalCohortFreezePath),
      replacementManifestSha256: fileHash(replacementManifestPath),
    },
  );
  const { workIds } = manifest;
  const cohortIds = new Set(workIds);
  const selectedWorkIds = new Set(replacement.replacements.map((item) => item.selectedWorkId));
  const reconciledDirectory = join(stagingDirectory, "replacement-blind/reconciled");
  const selectedReconciledFactors = parseCsv(
    join(reconciledDirectory, "factors.csv"),
    datasets[3].headers,
  ).filter(
    (row) =>
      selectedWorkIds.has(row[0] ?? "") && NON_ART_AXIS_IDS.some((axisId) => axisId === row[1]),
  );
  const selectedReconciledThemes = parseCsv(
    join(reconciledDirectory, "themes.csv"),
    datasets[4].headers,
  ).filter((row) => selectedWorkIds.has(row[0] ?? ""));
  const selectedGenreByWork = new Map<string, string>();
  for (const row of parseCsv(join(reconciledDirectory, "genres.csv"), reconciledGenreHeaders)) {
    const workId = row[0] ?? "";
    if (!selectedWorkIds.has(workId)) {
      continue;
    }
    if (selectedGenreByWork.has(workId)) {
      throw new Error(`Duplicate reconciled Genre row: ${workId}`);
    }
    selectedGenreByWork.set(workId, row[1] ?? "");
  }
  if (selectedGenreByWork.size !== selectedWorkIds.size) {
    throw new Error("Reconciled Genre rows do not cover every selected replacement");
  }
  const tables = new Map(
    datasets.map((dataset) => [
      dataset.file,
      collectDataset(dataset, sourceDirectory, chunkDirectories),
    ]),
  );
  const contextDataset = datasets.find((dataset) => dataset.file === "recommendation-context.csv");
  if (contextDataset === undefined) {
    throw new Error("Recommendation context dataset is missing");
  }
  const contextRows = tables.get(contextDataset.file);
  if (contextRows === undefined) {
    throw new Error("Recommendation context rows are missing");
  }
  const seedContext = parseCsv(
    join(stagingDirectory, "seed-recommendation-context.csv"),
    contextDataset.headers,
  );
  tables.set(contextDataset.file, mergeOverrides(contextDataset, contextRows, seedContext));

  for (const dataset of datasets) {
    const rows = tables.get(dataset.file);
    if (rows === undefined) {
      throw new Error(`Rows are missing for ${dataset.file}`);
    }
    let overriddenRows = applyOverrides(dataset, rows, overrideDirectory);
    if (dataset.file === "factors.csv") {
      overriddenRows = mergeOverrides(dataset, overriddenRows, selectedReconciledFactors);
    } else if (dataset.file === "themes.csv") {
      overriddenRows = mergeOverrides(dataset, overriddenRows, selectedReconciledThemes);
    } else if (dataset.file === "works.csv") {
      const idIndex = columnIndex(dataset.headers, "id");
      const genresIndex = columnIndex(dataset.headers, "genres");
      overriddenRows = overriddenRows.map((row) => {
        const genres = selectedGenreByWork.get(row[idIndex] ?? "");
        if (genres === undefined) {
          return row;
        }
        const next = [...row];
        next[genresIndex] = genres;
        return next;
      });
    }
    const cohortRows = filterRowsToCohort(
      dataset.headers,
      overriddenRows,
      cohortIds,
      dataset.file === "works.csv" ? "id" : "workId",
    );
    tables.set(
      dataset.file,
      dataset.file === "works.csv"
        ? resetAnnotationReview(dataset.headers, cohortRows)
        : cohortRows,
    );
  }

  const evidenceRows = filterRowsToCohort(
    evidenceHeaders,
    applyOverrides(
      evidenceDataset,
      [
        ...parseCsv(join(sourceDirectory, "evidence/evidence.csv"), evidenceHeaders),
        ...chunkDirectories.flatMap((directory) =>
          parseCsv(join(directory, "evidence.csv"), evidenceHeaders),
        ),
      ],
      overrideDirectory,
    ),
    cohortIds,
    "workId",
  );
  const artEvidenceSourceRows = parseCsv(
    join(stagingDirectory, "art-evidence-manifest.csv"),
    artEvidenceManifestHeaders,
  );
  const artEvidenceRows = artEvidenceSourceRows.map((row) =>
    artEvidenceManifestRowSchema.parse(rowRecord(artEvidenceManifestHeaders, row)),
  );
  const deferredWorkIds = parseCsv(
    join(stagingDirectory, "deferred-works.csv"),
    deferredWorkHeaders,
  ).map((row) => deferredWorkRowSchema.parse(rowRecord(deferredWorkHeaders, row)).workId);
  const worksDataset = datasets[0];
  const factorDataset = datasets.find((dataset) => dataset.file === "factors.csv");
  const workRows = tables.get(worksDataset.file);
  const factorRows = factorDataset === undefined ? undefined : tables.get(factorDataset.file);
  const finalContextRows = tables.get(contextDataset.file);
  if (workRows === undefined || factorDataset === undefined || factorRows === undefined) {
    throw new Error("G1 work or factor rows are missing");
  }
  if (finalContextRows === undefined) {
    throw new Error("G1 recommendation context rows are missing");
  }
  assertG1Cohort(
    workIds,
    workRows.map((row) => ({
      id: row[columnIndex(worksDataset.headers, "id")] ?? "",
      demographic: row[columnIndex(worksDataset.headers, "demographic")] ?? "",
      onboardingEligible: row[columnIndex(worksDataset.headers, "onboardingEligible")] === "true",
      recommendationEligible:
        row[columnIndex(worksDataset.headers, "recommendationEligible")] === "true",
      libraryOnly: row[columnIndex(worksDataset.headers, "libraryOnly")] === "true",
    })),
    finalContextRows.map((row) => ({
      workId: row[columnIndex(contextDataset.headers, "workId")] ?? "",
      catalogRole: row[columnIndex(contextDataset.headers, "catalogRole")] ?? "",
    })),
    freeze.histograms,
    replacement.replacements,
  );
  assertG1ArtEvidence(
    artEvidenceRows,
    factorRows.map((row) => ({
      workId: row[columnIndex(factorDataset.headers, "workId")] ?? "",
      axisId: row[columnIndex(factorDataset.headers, "axisId")] ?? "",
      state: row[columnIndex(factorDataset.headers, "state")] ?? "",
      value: row[columnIndex(factorDataset.headers, "value")] ?? "",
      confidence: row[columnIndex(factorDataset.headers, "confidence")] ?? "",
      evidenceId: row[columnIndex(factorDataset.headers, "evidenceId")] ?? "",
    })),
    evidenceRows.map((row) => {
      const evidence = evidenceSourceRowSchema.parse(rowRecord(evidenceHeaders, row));
      return {
        id: evidence.id,
        workId: evidence.workId,
        sourceType: evidence.sourceType,
        sourceUrl: evidence.sourceUrl,
      };
    }),
    cohortIds,
    deferredWorkIds,
  );

  const catalogAverageRating = equalWeightCatalogAverage(contextDataset.headers, finalContextRows);
  const temporaryDirectory = mkdtempSync(join(stagingDirectory, ".candidate-build-"));
  const candidateDirectory = join(temporaryDirectory, "candidate-source");
  const backupDirectory = join(temporaryDirectory, "previous-candidate-source");

  try {
    mkdirSync(candidateDirectory);
    for (const dataset of datasets) {
      const rows = tables.get(dataset.file);
      if (rows === undefined) {
        throw new Error(`Rows are missing for ${dataset.file}`);
      }
      writeCandidateFile(candidateDirectory, dataset.file, serializeCsv(dataset.headers, rows));
    }
    writeCandidateFile(
      candidateDirectory,
      "recommendation-config.csv",
      serializeCsv(["catalogAverageRating"], [[catalogAverageRating]]),
    );
    writeCandidateFile(
      candidateDirectory,
      "evidence/evidence.csv",
      serializeCsv(evidenceHeaders, evidenceRows),
    );
    writeCandidateFile(
      candidateDirectory,
      "evidence/art-evidence-manifest.csv",
      serializeCsv(artEvidenceManifestHeaders, artEvidenceSourceRows),
    );

    const result = runCatalogPipeline(candidateDirectory);
    const unexpectedErrors = result.issues.filter(
      (issue) => issue.severity === "error" && issue.code !== "UNREVIEWED_ELIGIBILITY",
    );
    const expectedReviewErrors = result.issues.filter(
      (issue) => issue.severity === "error" && issue.code === "UNREVIEWED_ELIGIBILITY",
    );
    if (unexpectedErrors.length > 0 || expectedReviewErrors.length !== 50) {
      for (const issue of result.issues) {
        console.error(formatSourceIssue(issue));
      }
      throw new Error(
        `Candidate validation failed with ${unexpectedErrors.length} unexpected errors and ${expectedReviewErrors.length} review errors`,
      );
    }
    publishCandidateDirectory(candidateDirectory, outputDirectory, backupDirectory);
    console.log(
      `Built 50-work G1 candidate with catalogAverageRating=${catalogAverageRating}; only 50 expected UNREVIEWED_ELIGIBILITY errors remain.`,
    );
  } finally {
    if (existsSync(backupDirectory)) {
      console.warn(`Preserved previous candidate backup at ${backupDirectory}`);
    } else {
      try {
        rmSync(temporaryDirectory, { recursive: true, force: true });
      } catch (error) {
        console.warn(
          `Could not clean candidate build directory ${temporaryDirectory}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }
}

const invokedPath = process.argv[1];
if (invokedPath !== undefined && import.meta.url === pathToFileURL(resolve(invokedPath)).href) {
  buildG1Candidate();
}
