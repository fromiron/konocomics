import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { format } from "prettier";
import { z } from "zod";

import { DEMOGRAPHICS, GENRE_TAGS, THEME_TAGS } from "../src/domain/catalog/constants";
import type { ScaleValue } from "../src/domain/catalog/types";
import { factorSourceRowSchema } from "./catalog/source-schema";
import { NON_ART_AXIS_IDS, selectReplacementPair } from "./catalog/g1-replacement";
import type {
  CohortProfile,
  NonArtAxisId,
  ReplacementContract,
  ReplacementProfile,
  ReplacementSlot,
} from "./catalog/g1-replacement";

const catalogIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const csvRecordsSchema = z.array(z.record(z.string(), z.string()));
const catalogRoleSchema = z.enum(["anchor", "bridge", "discovery"]);
const csvBooleanSchema = z.enum(["true", "false"]).transform((value) => value === "true");
const csvListSchema = z.string().transform((value) =>
  value
    .split(";")
    .map((item) => item.trim())
    .filter((item) => item !== ""),
);
const workProjectionSchema = z.object({
  id: catalogIdSchema,
  demographic: z.enum(DEMOGRAPHICS),
  genres: csvListSchema.pipe(z.array(z.enum(GENRE_TAGS))),
  onboardingEligible: csvBooleanSchema,
  recommendationEligible: csvBooleanSchema,
});
const contextProjectionSchema = z.object({
  workId: catalogIdSchema,
  catalogRole: catalogRoleSchema,
});
const themeProjectionSchema = z.object({
  workId: catalogIdSchema,
  themeId: z.enum(THEME_TAGS),
  centrality: z.enum(["1", "2"]).transform((value): 1 | 2 => (value === "1" ? 1 : 2)),
});
const genreProjectionSchema = z.object({
  workId: catalogIdSchema,
  genres: csvListSchema.pipe(z.array(z.enum(GENRE_TAGS))),
});
const poolSlotSchema = z.object({
  removedWorkId: catalogIdSchema,
  demographic: z.enum(DEMOGRAPHICS),
  catalogRole: catalogRoleSchema,
  onboardingEligible: z.boolean(),
  minimumValidCandidates: z.number().int().positive(),
});
const cohortSlotSchema = z.object({
  workId: catalogIdSchema,
  demographic: z.enum(DEMOGRAPHICS),
  catalogRole: catalogRoleSchema,
  onboardingEligible: z.boolean(),
});
const contractSchema = z.strictObject({
  minimumSharedKnownNonArtAxes: z.literal(9),
  requiredNonArtGroups: z.tuple([z.literal("narrative"), z.literal("tone")]),
  distanceWeights: z.strictObject({
    axis: z.literal(0.7),
    genre: z.literal(0.15),
    theme: z.literal(0.15),
  }),
});
const cohortFreezeSchema = z.object({
  schemaVersion: z.literal(1),
  workIds: z.array(catalogIdSchema).length(50),
  replacementSlots: z.array(cohortSlotSchema).length(2),
  selectionContract: contractSchema.extend({
    candidatePoolTargetPerSlot: z.literal(5),
    minimumValidCandidatesPerSlot: z.literal(4),
    excludedSelectionSignals: z.tuple([
      z.literal("art"),
      z.literal("market"),
      z.literal("recommendationOutput"),
      z.literal("popularity"),
    ]),
    tieBreak: z.literal("workId-ascending"),
  }),
});
const poolFreezeSchema = z.object({
  schemaVersion: z.literal(1),
  policyVersion: z.literal("g1-replacement-v1"),
  originalCohortFreezeSha256: sha256Schema,
  excludedDistanceSignals: z.tuple([
    z.literal("art"),
    z.literal("market"),
    z.literal("popularity"),
    z.literal("review"),
    z.literal("recommendationOutput"),
  ]),
  slots: z
    .array(
      poolSlotSchema.extend({
        validCandidateCount: z.literal(5),
        candidates: z.array(z.object({ workId: catalogIdSchema })).length(5),
      }),
    )
    .length(2),
});
const distanceSchema = z.object({
  sharedKnownAxisIds: z.array(z.enum(NON_ART_AXIS_IDS)),
  axisDistance: z.number().min(0).max(1),
  genreDistance: z.number().min(0).max(1),
  themeDistance: z.number().min(0).max(1),
  totalDistance: z.number().min(0).max(1),
});
export const replacementManifestSchema = z.strictObject({
  schemaVersion: z.literal(1),
  policyVersion: z.string().min(1),
  inputHashes: z.strictObject({
    originalCohortFreezeFile: sha256Schema,
    replacementPoolFreezeFile: sha256Schema,
    originalSelectionProjection: sha256Schema,
    reconciledFactorsFile: sha256Schema,
    reconciledGenresFile: sha256Schema,
    reconciledThemesFile: sha256Schema,
  }),
  selectionContract: contractSchema.extend({
    excludedSignals: z.array(z.string()),
    pairOrdering: z.literal("totalDistance-then-code-unit-workId"),
  }),
  replacements: z
    .array(
      z.strictObject({
        removedWorkId: catalogIdSchema,
        selectedWorkId: catalogIdSchema,
        inherited: z.strictObject({
          demographic: z.enum(DEMOGRAPHICS),
          catalogRole: catalogRoleSchema,
          onboardingEligible: z.boolean(),
        }),
        distance: distanceSchema,
      }),
    )
    .length(2),
  selectedPairRank: z.number().int().positive(),
  pairRanking: z
    .array(
      z.strictObject({
        rank: z.number().int().positive(),
        candidateWorkIds: z.array(catalogIdSchema).length(2),
        totalDistance: z.number().nonnegative(),
        diversityPassed: z.boolean(),
        diversityFailures: z.array(z.string()),
      }),
    )
    .length(25),
});

type CsvRecord = z.infer<typeof csvRecordsSchema>[number];
type FactorProjection = { workId: string; axisId: NonArtAxisId } & (
  { state: "known"; value: ScaleValue } | { state: "unknown" }
);
type ThemeProjection = z.infer<typeof themeProjectionSchema>;

const sourceDirectories = [
  "data/staging/g1/seed-source",
  "data/staging/g1/chunk-a",
  "data/staging/g1/chunk-b",
  "data/staging/g1/chunk-c",
] as const;

function readJson(path: string) {
  return JSON.parse(readFileSync(path, "utf8")) as unknown;
}

function readCsv(path: string) {
  return csvRecordsSchema.parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }),
  );
}

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function fileHash(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function projectionHash(value: unknown) {
  return hash(JSON.stringify(value));
}

function isNonArtAxisId(value: string | undefined): value is NonArtAxisId {
  return value !== undefined && NON_ART_AXIS_IDS.some((axisId) => axisId === value);
}

function uniqueMap<T>(values: readonly T[], key: (value: T) => string, label: string) {
  const result = new Map<string, T>();
  for (const value of values) {
    const itemKey = key(value);
    if (result.has(itemKey)) {
      throw new Error(`Duplicate ${label}: ${itemKey}`);
    }
    result.set(itemKey, value);
  }
  return result;
}

function knownFactorValues(rows: readonly FactorProjection[], workIds: readonly string[]) {
  const byPair = uniqueMap(rows, (row) => `${row.workId}\u0000${row.axisId}`, "factor pair");
  const result = new Map<string, ReplacementProfile["factors"]>();
  for (const workId of workIds) {
    const factors: Partial<Record<NonArtAxisId, ScaleValue>> = {};
    for (const axisId of NON_ART_AXIS_IDS) {
      const row = byPair.get(`${workId}\u0000${axisId}`);
      if (row === undefined) {
        throw new Error(`Missing non-Art factor: ${workId}/${axisId}`);
      }
      if (row.state === "known") {
        factors[axisId] = row.value;
      }
    }
    result.set(workId, factors);
  }
  if (byPair.size !== workIds.length * NON_ART_AXIS_IDS.length) {
    throw new Error("Non-Art factor rows must exactly match the selected works and axes");
  }
  return result;
}

function themesByWork(rows: readonly ThemeProjection[], workIds: readonly string[]) {
  uniqueMap(rows, (row) => `${row.workId}\u0000${row.themeId}`, "theme pair");
  const result = new Map<string, ReplacementProfile["themes"]>();
  for (const workId of workIds) {
    const themes = rows
      .filter((row) => row.workId === workId)
      .map((row) => ({ id: row.themeId, centrality: row.centrality }))
      .sort((left, right) => THEME_TAGS.indexOf(left.id) - THEME_TAGS.indexOf(right.id));
    result.set(workId, themes);
  }
  if (rows.some((row) => !result.has(row.workId))) {
    throw new Error("Theme rows contain a work outside the selected set");
  }
  return result;
}

function parseNonArtFactors(rows: readonly CsvRecord[]) {
  return rows
    .filter((row) => isNonArtAxisId(row.axisId))
    .map((row): FactorProjection => {
      const factor = factorSourceRowSchema.parse(row);
      if (!isNonArtAxisId(factor.axisId) || factor.state === "notApplicable") {
        throw new Error(`Invalid non-Art factor: ${factor.workId}/${factor.axisId}`);
      }
      return factor.state === "known"
        ? {
            workId: factor.workId,
            axisId: factor.axisId,
            state: factor.state,
            value: factor.value,
          }
        : { workId: factor.workId, axisId: factor.axisId, state: factor.state };
    });
}

function loadOriginalCohort(root: string, workIds: readonly string[]) {
  const works = sourceDirectories.flatMap((directory) =>
    readCsv(join(root, directory, "works.csv")).map((row) => workProjectionSchema.parse(row)),
  );
  const contexts = sourceDirectories.flatMap((directory) =>
    readCsv(join(root, directory, "recommendation-context.csv")).map((row) =>
      contextProjectionSchema.parse(row),
    ),
  );
  const factors = sourceDirectories.flatMap((directory) =>
    parseNonArtFactors(readCsv(join(root, directory, "factors.csv"))),
  );
  const themes = sourceDirectories.flatMap((directory) =>
    readCsv(join(root, directory, "themes.csv")).map((row) => themeProjectionSchema.parse(row)),
  );
  const workById = uniqueMap(works, (work) => work.id, "source workId");
  const contextById = uniqueMap(contexts, (context) => context.workId, "context workId");
  const factorValues = knownFactorValues(factors, workIds);
  const themeValues = themesByWork(themes, workIds);
  const expectedIds = new Set(workIds);
  if (
    workById.size !== expectedIds.size ||
    contextById.size !== expectedIds.size ||
    [...workById.keys()].some((workId) => !expectedIds.has(workId)) ||
    [...contextById.keys()].some((workId) => !expectedIds.has(workId))
  ) {
    throw new Error("Source/chunk works and contexts must exactly match the frozen cohort");
  }

  return [...workIds].sort().map((workId): CohortProfile => {
    const work = workById.get(workId);
    const context = contextById.get(workId);
    const workFactors = factorValues.get(workId);
    const workThemes = themeValues.get(workId);
    if (
      work === undefined ||
      context === undefined ||
      workFactors === undefined ||
      workThemes === undefined
    ) {
      throw new Error(`Frozen cohort work is incomplete: ${workId}`);
    }
    if (!work.recommendationEligible) {
      throw new Error(`Frozen cohort work is not recommendation eligible: ${workId}`);
    }
    return {
      workId,
      demographic: work.demographic,
      catalogRole: context.catalogRole,
      onboardingEligible: work.onboardingEligible,
      genres: [...work.genres].sort(
        (left, right) => GENRE_TAGS.indexOf(left) - GENRE_TAGS.indexOf(right),
      ),
      themes: workThemes,
      factors: workFactors,
    };
  });
}

function loadCandidates(root: string, candidateWorkIds: readonly string[]) {
  const reconciledDirectory = join(root, "data/staging/g1/replacement-blind/reconciled");
  const factorRows = parseNonArtFactors(readCsv(join(reconciledDirectory, "factors.csv")));
  const genreRows = readCsv(join(reconciledDirectory, "genres.csv")).map((row) =>
    genreProjectionSchema.parse(row),
  );
  const themeRows = readCsv(join(reconciledDirectory, "themes.csv")).map((row) =>
    themeProjectionSchema.parse(row),
  );
  const genreById = uniqueMap(genreRows, (row) => row.workId, "candidate genre workId");
  const factorValues = knownFactorValues(factorRows, candidateWorkIds);
  const themeValues = themesByWork(themeRows, candidateWorkIds);
  const expectedIds = new Set(candidateWorkIds);
  if (
    genreById.size !== expectedIds.size ||
    [...genreById.keys()].some((workId) => !expectedIds.has(workId))
  ) {
    throw new Error("Reconciled genre rows must exactly match the replacement pool");
  }

  return [...candidateWorkIds].sort().map((workId): ReplacementProfile => {
    const genreRow = genreById.get(workId);
    const workFactors = factorValues.get(workId);
    const workThemes = themeValues.get(workId);
    if (genreRow === undefined || workFactors === undefined || workThemes === undefined) {
      throw new Error(`Reconciled candidate is incomplete: ${workId}`);
    }
    return {
      workId,
      genres: [...genreRow.genres].sort(
        (left, right) => GENRE_TAGS.indexOf(left) - GENRE_TAGS.indexOf(right),
      ),
      themes: workThemes,
      factors: workFactors,
    };
  });
}

function toSlot(slot: z.infer<typeof poolFreezeSchema>["slots"][number]): ReplacementSlot {
  return {
    removedWorkId: slot.removedWorkId,
    demographic: slot.demographic,
    catalogRole: slot.catalogRole,
    onboardingEligible: slot.onboardingEligible,
    minimumValidCandidates: slot.minimumValidCandidates,
    candidateWorkIds: slot.candidates.map((candidate) => candidate.workId),
  };
}

function sameSlot(left: z.infer<typeof cohortSlotSchema>, right: ReplacementSlot) {
  return (
    left.workId === right.removedWorkId &&
    left.demographic === right.demographic &&
    left.catalogRole === right.catalogRole &&
    left.onboardingEligible === right.onboardingEligible
  );
}

export function buildG1ReplacementManifest(root = process.cwd()) {
  const cohortFreezePath = join(root, "data/staging/g1/original-cohort-freeze.json");
  const poolFreezePath = join(root, "data/staging/g1/replacement-pool-freeze.json");
  const reconciledDirectory = join(root, "data/staging/g1/replacement-blind/reconciled");
  const cohortFreeze = cohortFreezeSchema.parse(readJson(cohortFreezePath));
  const poolFreeze = poolFreezeSchema.parse(readJson(poolFreezePath));
  if (fileHash(cohortFreezePath) !== poolFreeze.originalCohortFreezeSha256) {
    throw new Error("Replacement pool is not anchored to the current original cohort freeze");
  }
  const contract: ReplacementContract = {
    minimumSharedKnownNonArtAxes: cohortFreeze.selectionContract.minimumSharedKnownNonArtAxes,
    requiredNonArtGroups: cohortFreeze.selectionContract.requiredNonArtGroups,
    distanceWeights: cohortFreeze.selectionContract.distanceWeights,
  };
  const slots = poolFreeze.slots.map(toSlot);
  const frozenSlots = [...cohortFreeze.replacementSlots].sort((left, right) =>
    left.workId < right.workId ? -1 : left.workId > right.workId ? 1 : 0,
  );
  const sortedSlots = [...slots].sort((left, right) =>
    left.removedWorkId < right.removedWorkId
      ? -1
      : left.removedWorkId > right.removedWorkId
        ? 1
        : 0,
  );
  for (const [index, frozenSlot] of frozenSlots.entries()) {
    const poolSlot = sortedSlots[index];
    if (
      poolSlot === undefined ||
      !sameSlot(frozenSlot, poolSlot) ||
      poolSlot.minimumValidCandidates !==
        cohortFreeze.selectionContract.minimumValidCandidatesPerSlot
    ) {
      throw new Error("Replacement-pool slots do not match the original cohort freeze");
    }
  }
  const candidateWorkIds = slots.flatMap((slot) => slot.candidateWorkIds);
  const originalCohort = loadOriginalCohort(root, cohortFreeze.workIds);
  const candidates = loadCandidates(root, candidateWorkIds);
  const selection = selectReplacementPair({ originalCohort, slots, candidates, contract });
  const factorsPath = join(reconciledDirectory, "factors.csv");
  const genresPath = join(reconciledDirectory, "genres.csv");
  const themesPath = join(reconciledDirectory, "themes.csv");
  const manifest = {
    schemaVersion: 1 as const,
    policyVersion: poolFreeze.policyVersion,
    inputHashes: {
      originalCohortFreezeFile: fileHash(cohortFreezePath),
      replacementPoolFreezeFile: fileHash(poolFreezePath),
      originalSelectionProjection: projectionHash(originalCohort),
      reconciledFactorsFile: fileHash(factorsPath),
      reconciledGenresFile: fileHash(genresPath),
      reconciledThemesFile: fileHash(themesPath),
    },
    selectionContract: {
      ...contract,
      excludedSignals: [...poolFreeze.excludedDistanceSignals].sort(),
      pairOrdering: "totalDistance-then-code-unit-workId" as const,
    },
    ...selection,
  };
  return replacementManifestSchema.parse(manifest);
}

export async function runG1ReplacementCli(args: readonly string[], root = process.cwd()) {
  const outputPath = join(root, "data/staging/g1/replacement-manifest.json");
  const content = await format(JSON.stringify(buildG1ReplacementManifest(root)), {
    parser: "json",
    printWidth: 100,
  });
  if (args.includes("--check")) {
    if (!existsSync(outputPath)) {
      throw new Error(`Missing replacement manifest: ${relative(root, outputPath)}`);
    }
    replacementManifestSchema.parse(readJson(outputPath));
    if (readFileSync(outputPath, "utf8") !== content) {
      throw new Error(`Stale replacement manifest: ${relative(root, outputPath)}`);
    }
    console.log(`Verified ${relative(root, outputPath)}`);
    return;
  }
  if (args.length > 0) {
    throw new Error(`Unknown argument: ${args[0]}`);
  }
  writeFileSync(outputPath, content, "utf8");
  console.log(`Wrote ${relative(root, outputPath)}`);
}

const invokedPath = process.argv[1];
if (invokedPath !== undefined && import.meta.url === pathToFileURL(resolve(invokedPath)).href) {
  void runG1ReplacementCli(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
