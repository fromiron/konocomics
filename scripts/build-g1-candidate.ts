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

import { GENRE_TAGS, THEME_TAGS } from "../src/domain/catalog/constants";
import { blindRetagSampleManifestSchema } from "./build-g1-blind-retag";
import { buildG1ReplacementManifest, replacementManifestSchema } from "./build-g1-replacement";
import {
  artEvidenceManifestHeaders,
  artEvidenceManifestRowSchema,
  validateArtEvidence,
} from "./catalog/art-evidence";
import type { ArtEvidenceManifestRow } from "./catalog/art-evidence";
import { NON_ART_AXIS_IDS } from "./catalog/g1-replacement";
import { runCatalogPipeline } from "./catalog/pipeline";
import { formatSourceIssue } from "./catalog/report";
import {
  evidenceSourceRowSchema,
  factorSourceRowSchema,
  recommendationContextSourceRowSchema,
  themeSourceRowSchema,
} from "./catalog/source-schema";

export { artEvidenceManifestRowSchema } from "./catalog/art-evidence";

const matrixSchema = z.array(z.array(z.string()));
const catalogIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u, {
  message: "Must be a lowercase kebab-case catalog ID",
});
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const approvalFileSchema = <const Path extends string>(path: Path) =>
  z.strictObject({ path: z.literal(path), sha256: sha256Schema });
const approvalManifestSchema = z.strictObject({
  schemaVersion: z.literal(1),
  policyVersion: z.literal("g1-authorized-model-panel-v1"),
  bundleSha256: z.literal("06f1e597760785e5d39535fb159d78a79e375004bba0f54b74b5e6574c695353"),
  annotationReviewedAt: z.iso.datetime({ offset: true }),
  reviewReference: z.literal("reviews/g1-sanity-panel.md"),
  preApprovalHashes: z.strictObject({
    catalog: sha256Schema,
    recommendationContext: sha256Schema,
  }),
  panelRequest: approvalFileSchema("reviews/g1-sanity-panel-request.md"),
  tasteVsBaselineReport: approvalFileSchema("reviews/g1-sanity-taste-vs-baseline.md"),
  panelReport: approvalFileSchema("reviews/g1-sanity-panel.md"),
  responses: z.strictObject({
    local: approvalFileSchema("reviews/g1-sanity-local-response.md"),
    gemini: approvalFileSchema("reviews/g1-sanity-gemini-response.md"),
    grok: approvalFileSchema("reviews/g1-sanity-grok-response.md"),
    oracle: approvalFileSchema("reviews/g1-sanity-oracle-gpt56pro.txt"),
  }),
});
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
const adjudicationManifestSchema = z.strictObject({
  schemaVersion: z.literal(1),
  policyVersion: z.literal("g1-full-evidence-adjudication-v1"),
  workIds: z.array(catalogIdSchema).length(9),
  inputHashes: z.strictObject({
    sampleManifestFile: sha256Schema,
    reconciledFactorsFile: sha256Schema,
    reconciledGenresFile: sha256Schema,
    reconciledThemesFile: sha256Schema,
    artEvidenceManifestFile: sha256Schema,
    preAdjudicationWorks: sha256Schema,
    preAdjudicationFactors: sha256Schema,
    preAdjudicationThemes: sha256Schema,
    preAdjudicationEvidence: sha256Schema,
  }),
  payloadHashes: z.strictObject({
    factorsFile: sha256Schema,
    genresFile: sha256Schema,
    themesFile: sha256Schema,
    evidenceFile: sha256Schema,
    adjudicationFile: sha256Schema,
  }),
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
const reconciledGenreHeaders = ["workId", "genres"] as const;
const deferredWorkHeaders = [
  "workId",
  "failureReason",
  "checkedSources",
  "lastChecked",
  "reentryCondition",
] as const;
const requiredText = z.string().trim().min(1);
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
type G1Adjudication = {
  workIds: string[];
  factors: string[][];
  genres: Map<string, string>;
  themes: string[][];
  evidence: string[][];
};
type PreAdjudicationHashes = {
  works: string;
  factors: string;
  themes: string;
  evidence: string;
};
type PreApprovalHashes = z.infer<typeof approvalManifestSchema>["preApprovalHashes"];
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

function contentHash(content: string | Buffer) {
  return createHash("sha256").update(content).digest("hex");
}

function fileHash(path: string) {
  return contentHash(readFileSync(path));
}

export function loadG1Approval(root: string, preApprovalHashes: PreApprovalHashes) {
  const stagingDirectory = join(root, "data/staging/g1");
  const manifest = approvalManifestSchema.parse(
    JSON.parse(readFileSync(join(stagingDirectory, "g1-approval.json"), "utf8")) as unknown,
  );
  if (
    manifest.preApprovalHashes.catalog !== preApprovalHashes.catalog ||
    manifest.preApprovalHashes.recommendationContext !== preApprovalHashes.recommendationContext
  ) {
    throw new Error("G1 approval manifest is stale for the current pre-approval candidate");
  }
  const bindings = [
    manifest.panelRequest,
    manifest.tasteVsBaselineReport,
    manifest.panelReport,
    ...Object.values(manifest.responses),
  ];
  for (const binding of bindings) {
    if (fileHash(join(stagingDirectory, binding.path)) !== binding.sha256) {
      throw new Error(`G1 approval file hash mismatch: ${binding.path}`);
    }
  }
  for (const response of Object.values(manifest.responses)) {
    const [verdict] = readFileSync(join(stagingDirectory, response.path), "utf8").split(/\r?\n/u);
    if (verdict !== "GO") {
      throw new Error(`G1 approval response must start with exactly GO: ${response.path}`);
    }
  }
  return manifest;
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

export function loadG1Adjudication(
  root: string,
  preAdjudication: PreAdjudicationHashes,
): G1Adjudication {
  const stagingDirectory = join(root, "data/staging/g1");
  const blindDirectory = join(stagingDirectory, "blind-retag");
  const adjudicatedDirectory = join(blindDirectory, "adjudicated");
  const sampleManifestPath = join(blindDirectory, "sample-manifest.json");
  const manifest = adjudicationManifestSchema.parse(
    JSON.parse(readFileSync(join(adjudicatedDirectory, "manifest.json"), "utf8")) as unknown,
  );
  const sampleManifest = blindRetagSampleManifestSchema.parse(
    JSON.parse(readFileSync(sampleManifestPath, "utf8")) as unknown,
  );
  const workIds = sampleManifest.selected.map(({ workId }) => workId);
  if (
    new Set(manifest.workIds).size !== manifest.workIds.length ||
    JSON.stringify(manifest.workIds) !== JSON.stringify(workIds)
  ) {
    throw new Error("G1 adjudication work IDs must exactly match the frozen blind sample");
  }

  const factorsPath = join(adjudicatedDirectory, "factors.csv");
  const genresPath = join(adjudicatedDirectory, "genres.csv");
  const themesPath = join(adjudicatedDirectory, "themes.csv");
  const evidencePath = join(adjudicatedDirectory, "evidence.csv");
  const adjudicationPath = join(adjudicatedDirectory, "adjudication.md");
  const inputHashes = {
    sampleManifestFile: fileHash(sampleManifestPath),
    reconciledFactorsFile: fileHash(join(blindDirectory, "reconciled/factors.csv")),
    reconciledGenresFile: fileHash(join(blindDirectory, "reconciled/genres.csv")),
    reconciledThemesFile: fileHash(join(blindDirectory, "reconciled/themes.csv")),
    artEvidenceManifestFile: fileHash(join(stagingDirectory, "art-evidence-manifest.csv")),
    preAdjudicationWorks: preAdjudication.works,
    preAdjudicationFactors: preAdjudication.factors,
    preAdjudicationThemes: preAdjudication.themes,
    preAdjudicationEvidence: preAdjudication.evidence,
  };
  const payloadHashes = {
    factorsFile: fileHash(factorsPath),
    genresFile: fileHash(genresPath),
    themesFile: fileHash(themesPath),
    evidenceFile: fileHash(evidencePath),
    adjudicationFile: fileHash(adjudicationPath),
  };
  if (
    JSON.stringify(manifest.inputHashes) !== JSON.stringify(inputHashes) ||
    JSON.stringify(manifest.payloadHashes) !== JSON.stringify(payloadHashes)
  ) {
    throw new Error("G1 adjudication manifest is stale for the current frozen inputs");
  }

  const factors = parseCsv(factorsPath, datasets[3].headers);
  if (factors.length !== workIds.length * NON_ART_AXIS_IDS.length) {
    throw new Error("G1 adjudication factors must equal the sample by non-Art-axis product");
  }
  for (const [index, row] of factors.entries()) {
    const factor = factorSourceRowSchema.parse(rowRecord(datasets[3].headers, row));
    const workId = workIds[Math.floor(index / NON_ART_AXIS_IDS.length)];
    const axisId = NON_ART_AXIS_IDS[index % NON_ART_AXIS_IDS.length];
    if (
      factor.workId !== workId ||
      factor.axisId !== axisId ||
      factor.evidenceId !== `ev-g1-adjudicated-${factor.workId}`
    ) {
      throw new Error(`Invalid G1 adjudication factor at row ${String(index + 2)}`);
    }
  }

  const genreRows = parseCsv(genresPath, reconciledGenreHeaders);
  if (genreRows.length !== workIds.length) {
    throw new Error("G1 adjudication genres must contain exactly one row per sampled work");
  }
  const genres = new Map<string, string>();
  for (const [index, row] of genreRows.entries()) {
    const workId = row[0] ?? "";
    const cell = row[1] ?? "";
    const parsedGenres = z.array(z.enum(GENRE_TAGS)).parse(cell === "" ? [] : cell.split(";"));
    const orders = parsedGenres.map((genre) => GENRE_TAGS.indexOf(genre));
    if (
      workId !== workIds[index] ||
      parsedGenres.join(";") !== cell ||
      orders.some((order, genreIndex) => genreIndex > 0 && order <= orders[genreIndex - 1]!)
    ) {
      throw new Error(`Invalid G1 adjudication Genre row ${String(index + 2)}`);
    }
    genres.set(workId, cell);
  }

  const themes = parseCsv(themesPath, datasets[4].headers);
  let previousThemeOrder = -1;
  for (const row of themes) {
    const theme = themeSourceRowSchema.parse(rowRecord(datasets[4].headers, row));
    const workOrder = workIds.indexOf(theme.workId);
    const order = workOrder * THEME_TAGS.length + THEME_TAGS.indexOf(theme.themeId);
    if (
      workOrder < 0 ||
      order <= previousThemeOrder ||
      theme.evidenceId !== `ev-g1-adjudicated-${theme.workId}`
    ) {
      throw new Error(`Invalid G1 adjudication Theme row: ${theme.workId}/${theme.themeId}`);
    }
    previousThemeOrder = order;
  }

  const evidence = parseCsv(evidencePath, evidenceHeaders);
  if (evidence.length !== workIds.length) {
    throw new Error("G1 adjudication evidence must contain exactly one row per sampled work");
  }
  for (const [index, row] of evidence.entries()) {
    const item = evidenceSourceRowSchema.parse(rowRecord(evidenceHeaders, row));
    const workId = workIds[index];
    if (
      item.workId !== workId ||
      item.id !== `ev-g1-adjudicated-${workId}` ||
      item.targetType !== "work" ||
      item.targetId !== workId ||
      item.sourceType !== "model" ||
      item.sourceUrl === undefined ||
      item.reviewedByHuman
    ) {
      throw new Error(`Invalid G1 adjudication evidence at row ${String(index + 2)}`);
    }
  }
  return { workIds, factors, genres, themes, evidence };
}

export function applyG1Adjudication(input: {
  works: string[][];
  factors: string[][];
  themes: string[][];
  evidence: string[][];
  adjudication: G1Adjudication;
}) {
  const sampleIds = new Set(input.adjudication.workIds);
  const workIdIndex = columnIndex(datasets[0].headers, "id");
  const genresIndex = columnIndex(datasets[0].headers, "genres");
  const themeWorkIdIndex = columnIndex(datasets[4].headers, "workId");
  return {
    works: input.works.map((row) => {
      const genres = input.adjudication.genres.get(row[workIdIndex] ?? "");
      if (genres === undefined) {
        return row;
      }
      const next = [...row];
      next[genresIndex] = genres;
      return next;
    }),
    factors: mergeOverrides(datasets[3], input.factors, input.adjudication.factors),
    themes: [
      ...input.themes.filter((row) => !sampleIds.has(row[themeWorkIdIndex] ?? "")),
      ...input.adjudication.themes,
    ],
    evidence: mergeOverrides(evidenceDataset, input.evidence, input.adjudication.evidence),
  };
}

function setAnnotationReview(
  headers: readonly string[],
  rows: string[][],
  method: "unreviewed" | "authorizedModelPanel",
  reviewedAt = "",
  reference = "",
) {
  const methodColumn = columnIndex(headers, "annotationReviewMethod");
  const reviewedAtColumn = columnIndex(headers, "annotationReviewedAt");
  const referenceColumn = columnIndex(headers, "annotationReviewReference");
  return rows.map((row) => {
    const next = [...row];
    next[methodColumn] = method;
    next[reviewedAtColumn] = reviewedAt;
    next[referenceColumn] = reference;
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
  const validationIssues = validateArtEvidence({
    works: [...cohortIds].map((id, index) => ({
      file: "cohort-manifest.json",
      row: index + 1,
      value: { id },
    })),
    factors: factors.map((value, index) => ({ file: "factors.csv", row: index + 2, value })),
    evidence: evidenceRows.map((value, index) => ({
      file: "evidence/evidence.csv",
      row: index + 2,
      value,
    })),
    manifest: manifestRows.map((value, index) => ({
      file: "evidence/art-evidence-manifest.csv",
      row: index + 2,
      value,
    })),
  });
  const duplicate = validationIssues.find((item) => item.code === "DUPLICATE_ART_EVIDENCE_PAIR");
  if (duplicate !== undefined) {
    throw new Error(duplicate.message);
  }
  const missingOrExtra = validationIssues.filter((item) =>
    ["ART_EVIDENCE_PAIR_MISSING", "UNKNOWN_ART_EVIDENCE_WORK"].includes(item.code),
  );
  if (missingOrExtra.length > 0) {
    const missing = missingOrExtra.filter(
      (item) => item.code === "ART_EVIDENCE_PAIR_MISSING",
    ).length;
    const extra = missingOrExtra.filter((item) => item.code === "UNKNOWN_ART_EVIDENCE_WORK").length;
    throw new Error(
      `G1 Art evidence pairs must equal cohort x Art axes: missing=${missing}; extra=${extra}`,
    );
  }
  const firstIssue = validationIssues[0];
  if (firstIssue !== undefined) {
    throw new Error(firstIssue.message);
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
  const stagingDirectory = join(root, "data/staging/g1");
  const sourceDirectory = join(stagingDirectory, "seed-source");
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
        ? setAnnotationReview(dataset.headers, cohortRows, "unreviewed")
        : cohortRows,
    );
  }

  const baselineEvidenceRows = filterRowsToCohort(
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
  const worksDataset = datasets[0];
  const factorDataset = datasets[3];
  const themeDataset = datasets[4];
  const baselineWorkRows = tables.get(worksDataset.file);
  const baselineFactorRows = tables.get(factorDataset.file);
  const baselineThemeRows = tables.get(themeDataset.file);
  if (
    baselineWorkRows === undefined ||
    baselineFactorRows === undefined ||
    baselineThemeRows === undefined
  ) {
    throw new Error("G1 work, factor, or theme rows are missing");
  }
  const adjudication = loadG1Adjudication(root, {
    works: contentHash(serializeCsv(worksDataset.headers, baselineWorkRows)),
    factors: contentHash(serializeCsv(factorDataset.headers, baselineFactorRows)),
    themes: contentHash(serializeCsv(themeDataset.headers, baselineThemeRows)),
    evidence: contentHash(serializeCsv(evidenceHeaders, baselineEvidenceRows)),
  });
  const adjudicated = applyG1Adjudication({
    works: baselineWorkRows,
    factors: baselineFactorRows,
    themes: baselineThemeRows,
    evidence: baselineEvidenceRows,
    adjudication,
  });
  tables.set(worksDataset.file, adjudicated.works);
  tables.set(factorDataset.file, adjudicated.factors);
  tables.set(themeDataset.file, adjudicated.themes);
  const evidenceRows = adjudicated.evidence;
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
  const workRows = adjudicated.works;
  const factorRows = adjudicated.factors;
  const finalContextRows = tables.get(contextDataset.file);
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

    const preApprovalResult = runCatalogPipeline(candidateDirectory);
    const unexpectedErrors = preApprovalResult.issues.filter(
      (issue) => issue.severity === "error" && issue.code !== "UNREVIEWED_ELIGIBILITY",
    );
    const expectedReviewErrors = preApprovalResult.issues.filter(
      (issue) => issue.severity === "error" && issue.code === "UNREVIEWED_ELIGIBILITY",
    );
    if (unexpectedErrors.length > 0 || expectedReviewErrors.length !== 50) {
      for (const issue of preApprovalResult.issues) {
        console.error(formatSourceIssue(issue));
      }
      throw new Error(
        `Candidate validation failed with ${unexpectedErrors.length} unexpected errors and ${expectedReviewErrors.length} review errors`,
      );
    }

    const approval = loadG1Approval(root, {
      catalog: contentHash(`${JSON.stringify(preApprovalResult.catalog, null, 2)}\n`),
      recommendationContext: contentHash(`${JSON.stringify(preApprovalResult.context, null, 2)}\n`),
    });
    const approvedWorkRows = setAnnotationReview(
      worksDataset.headers,
      workRows,
      "authorizedModelPanel",
      approval.annotationReviewedAt,
      approval.reviewReference,
    );
    tables.set(worksDataset.file, approvedWorkRows);
    writeCandidateFile(
      candidateDirectory,
      worksDataset.file,
      serializeCsv(worksDataset.headers, approvedWorkRows),
    );
    writeCandidateFile(
      candidateDirectory,
      approval.reviewReference,
      readFileSync(join(stagingDirectory, approval.panelReport.path), "utf8"),
    );

    const result = runCatalogPipeline(candidateDirectory);
    const errors = result.issues.filter((issue) => issue.severity === "error");
    if (errors.length > 0) {
      for (const issue of result.issues) {
        console.error(formatSourceIssue(issue));
      }
      throw new Error(`Approved candidate validation failed with ${errors.length} errors`);
    }
    publishCandidateDirectory(candidateDirectory, outputDirectory, backupDirectory);
    console.log(
      `Built approved 50-work G1 candidate with catalogAverageRating=${catalogAverageRating}.`,
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
