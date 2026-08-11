import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { format } from "prettier";
import { z } from "zod";

import { AXIS_IDS } from "../src/domain/catalog/constants";
import {
  evidenceSourceRowSchema,
  volumeSourceRowSchema,
  workSourceRowSchema,
} from "./catalog/source-schema";

const ALGORITHM_VERSION = "g1-blind-retag-sha256-v1";
const POPULATION_SIZE = 50;
const SAMPLE_SIZE = 9;
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const catalogIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const cohortManifestSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    policyVersion: z.string().trim().min(1),
    originalCohortFreezeSha256: sha256Schema,
    replacementManifestSha256: sha256Schema,
    workIds: z.array(catalogIdSchema).length(POPULATION_SIZE),
  })
  .refine((manifest) => new Set(manifest.workIds).size === POPULATION_SIZE, {
    message: "G1 cohort workIds must be unique",
    path: ["workIds"],
  });

export const blindRetagSampleManifestSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    algorithmVersion: z.literal(ALGORITHM_VERSION),
    policyVersion: z.string().trim().min(1),
    cohortManifestSha256: sha256Schema,
    cohortWorkIdsSha256: sha256Schema,
    factorDictionarySha256: sha256Schema,
    annotationGuideSha256: sha256Schema,
    sourceFileSha256: z.strictObject({
      works: sha256Schema,
      volumes: sha256Schema,
      evidence: sha256Schema,
    }),
    populationSize: z.literal(POPULATION_SIZE),
    sampleSize: z.literal(SAMPLE_SIZE),
    sampleRate: z.literal(0.18),
    ordering: z.literal("sha256-code-unit-ascending"),
    selected: z
      .array(
        z.strictObject({
          workId: catalogIdSchema,
          digest: sha256Schema,
        }),
      )
      .length(SAMPLE_SIZE),
  })
  .refine(
    (manifest) => new Set(manifest.selected.map(({ workId }) => workId)).size === SAMPLE_SIZE,
    {
      message: "Blind-retag sample workIds must be unique",
      path: ["selected"],
    },
  );

type BlindRetagSelection = z.infer<typeof blindRetagSampleManifestSchema>["selected"];

function readJson(path: string): unknown {
  const value: unknown = JSON.parse(readFileSync(path, "utf8"));
  return value;
}

function readCsv<T>(path: string, schema: z.ZodType<T>): T[] {
  const rows: unknown = parse(readFileSync(path, "utf8"), {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return z.array(schema).parse(rows);
}

function fileHash(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function codeUnitCompare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
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

export function selectG1BlindRetagSample(
  policyVersion: string,
  cohortWorkIdsSha256: string,
  factorDictionarySha256: string,
  annotationGuideSha256: string,
  workIds: readonly string[],
): BlindRetagSelection {
  return workIds
    .map((workId) => ({
      workId,
      digest: createHash("sha256")
        .update(
          [
            ALGORITHM_VERSION,
            policyVersion,
            cohortWorkIdsSha256,
            factorDictionarySha256,
            annotationGuideSha256,
            workId,
          ].join("\0"),
        )
        .digest("hex"),
    }))
    .sort(
      (left, right) =>
        codeUnitCompare(left.digest, right.digest) || codeUnitCompare(left.workId, right.workId),
    )
    .slice(0, SAMPLE_SIZE);
}

function markdownCell(value: string | number | undefined) {
  return String(value ?? "")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ");
}

export async function buildG1BlindRetagArtifacts(root = process.cwd()) {
  const stagingDirectory = join(root, "data/staging/g1");
  const sourceDirectory = join(stagingDirectory, "candidate-source");
  const cohortPath = join(stagingDirectory, "cohort-manifest.json");
  const worksPath = join(sourceDirectory, "works.csv");
  const volumesPath = join(sourceDirectory, "volumes.csv");
  const evidencePath = join(sourceDirectory, "evidence/evidence.csv");
  const factorDictionaryPath = join(root, "docs/factors/factor-dictionary.md");
  const annotationGuidePath = join(root, "docs/factors/annotation-guide.md");
  const cohortManifestSha256 = fileHash(cohortPath);
  const factorDictionarySha256 = fileHash(factorDictionaryPath);
  const annotationGuideSha256 = fileHash(annotationGuidePath);
  const cohort = cohortManifestSchema.parse(readJson(cohortPath));
  const cohortWorkIdsSha256 = createHash("sha256")
    .update([...cohort.workIds].sort(codeUnitCompare).join("\0"))
    .digest("hex");
  const cohortIds = new Set(cohort.workIds);
  const works = readCsv(worksPath, workSourceRowSchema);
  const volumes = readCsv(volumesPath, volumeSourceRowSchema);
  const evidence = readCsv(evidencePath, evidenceSourceRowSchema);

  if (
    works.length !== POPULATION_SIZE ||
    works.some((work) => !cohortIds.has(work.id) || !work.recommendationEligible)
  ) {
    throw new Error("Candidate works must exactly match the 50 eligible G1 cohort works");
  }
  const worksById = uniqueMap(works, (work) => work.id, "candidate work ID");
  if (cohort.workIds.some((workId) => !worksById.has(workId))) {
    throw new Error("Candidate works are missing a G1 cohort work");
  }
  if (volumes.some((volume) => !cohortIds.has(volume.workId))) {
    throw new Error("Candidate volumes contain a work outside the G1 cohort");
  }
  const representativeByWorkId = uniqueMap(
    volumes.filter((volume) => volume.isRepresentative),
    (volume) => volume.workId,
    "representative volume",
  );
  if (cohort.workIds.some((workId) => !representativeByWorkId.has(workId))) {
    throw new Error("Every G1 cohort work requires one representative volume");
  }
  const evidenceById = uniqueMap(evidence, (row) => row.id, "evidence ID");
  const selected = selectG1BlindRetagSample(
    cohort.policyVersion,
    cohortWorkIdsSha256,
    factorDictionarySha256,
    annotationGuideSha256,
    cohort.workIds,
  );
  const manifest = blindRetagSampleManifestSchema.parse({
    schemaVersion: 1,
    algorithmVersion: ALGORITHM_VERSION,
    policyVersion: cohort.policyVersion,
    cohortManifestSha256,
    cohortWorkIdsSha256,
    factorDictionarySha256,
    annotationGuideSha256,
    sourceFileSha256: {
      works: fileHash(worksPath),
      volumes: fileHash(volumesPath),
      evidence: fileHash(evidencePath),
    },
    populationSize: POPULATION_SIZE,
    sampleSize: SAMPLE_SIZE,
    sampleRate: 0.18,
    ordering: "sha256-code-unit-ascending",
    selected,
  });
  const rows = selected.map(({ workId }) => {
    const work = worksById.get(workId);
    const volume = representativeByWorkId.get(workId);
    if (work === undefined || volume === undefined) {
      throw new Error(`Missing blind-retag metadata: ${workId}`);
    }
    const workEvidence = evidenceById.get(work.evidenceId);
    if (
      workEvidence === undefined ||
      workEvidence.workId !== workId ||
      workEvidence.targetType !== "work" ||
      workEvidence.targetId !== workId ||
      workEvidence.sourceUrl === undefined
    ) {
      throw new Error(`Invalid official work evidence: ${workId}`);
    }
    return [
      workId,
      work.title,
      work.creators.join(" / "),
      work.publisher,
      work.firstPublishedYear,
      volume.isbn,
      `<${workEvidence.sourceUrl}>`,
    ].map(markdownCell);
  });
  const rawInput = [
    "# G1 blind retag input",
    "",
    `- Policy: \`${cohort.policyVersion}\``,
    `- Cohort SHA-256: \`${cohortManifestSha256}\``,
    `- Cohort work-ID SHA-256: \`${cohortWorkIdsSha256}\``,
    `- Factor dictionary SHA-256: \`${factorDictionarySha256}\``,
    `- Annotation policy SHA-256: \`${annotationGuideSha256}\``,
    `- Sample: ${SAMPLE_SIZE}/${POPULATION_SIZE} (18%)`,
    "- Factor definitions: `docs/factors/factor-dictionary.md`",
    "",
    "## Isolation rules",
    "",
    "Use only this file, the factor dictionary, and the linked official sources. Do not open `docs/factors/annotation-guide.md`: its named examples and prior judgments leak the hidden labels. Do not inspect prior annotations, candidate factors or themes, recommendation context, catalog outputs, or recommendation outputs. They contain the original values and genre, theme, role, market, or review signals that this blind pass must not expose.",
    "",
    "## Scope and Art evidence minimum",
    "",
    "- Evaluate only the entry experience in volumes 1–3 or the first major episode (`entry_1_3_volumes`). Do not mix in later twists, endings, or long-run changes.",
    "- Insufficient evidence means `unknown`, not a low value. Use `notApplicable` only where the factor dictionary permits it.",
    "- Inspect at least six distinct readable internal pages or equivalent still frames across at least two contexts, with the edition and entry-scope relationship recorded.",
    "- Each known static Art axis must cite at least two distinct non-cover pages or frames. Known `motionImpact` requires one continuous action sequence with exact start and end references.",
    "- If an Art minimum is not met, keep that axis `unknown`; lack of evidence is not grounds for `notApplicable`.",
    "",
    "## Selected works",
    "",
    "| workId | title | creators | publisher | first published | representative ISBN | official work evidence |",
    "| --- | --- | --- | --- | ---: | --- | --- |",
    ...rows.map((row) => `| ${row.join(" | ")} |`),
    "",
    "## Required output",
    "",
    "Write exactly four files in the output directory assigned by the runner:",
    "",
    `- \`factors.csv\`: header \`workId,axisId,state,value,confidence,evidenceId\`; exactly ${SAMPLE_SIZE} × ${AXIS_IDS.length} = ${SAMPLE_SIZE * AXIS_IDS.length} rows covering every Axis ID in this canonical order: ${AXIS_IDS.map((axisId) => `\`${axisId}\``).join(", ")}. Use \`known\` with value 0–4 and confidence 0–1, or \`unknown\` with blank value and confidence; \`notApplicable\` also has blank value and confidence and is allowed only by the factor dictionary. Use evidence ID \`blind-retag-g1-v1-{workId}\`.`,
    "- `themes.csv`: header `workId,themeId,centrality,confidence,evidenceId`; canonical Theme IDs only, centrality 1 or 2, confidence 0–1, and the same per-work evidence ID.",
    `- \`genres.csv\`: header \`workId,genres\`; exactly ${SAMPLE_SIZE} rows, one per selected work, with semicolon-separated canonical Genre IDs only.`,
    "- `notes.md`: for every work, record the official URLs and inspected volume/chapter/page or time ranges, observable repeated patterns supporting each judgment, Art source authority and edition/scope mapping, every `unknown` limitation, and an explicit isolation attestation listing only this input, the factor dictionary, and official sources used.",
    "",
    "Sort every file by the selected-work order above, then by the canonical factor-dictionary order where applicable. Do not add files, compare against prior labels, or include recommendations. CSV files must use the exact headers above and end with one final newline.",
    "",
  ].join("\n");
  const [manifestContent, inputContent] = await Promise.all([
    format(JSON.stringify(manifest), { parser: "json", printWidth: 100 }),
    format(rawInput, { parser: "markdown", printWidth: 100 }),
  ]);

  return {
    manifest,
    manifestContent,
    inputContent,
  };
}

export async function runG1BlindRetagCli(args: readonly string[], root = process.cwd()) {
  const normalizedArgs = args[0] === "--" ? args.slice(1) : args;
  const check = normalizedArgs.length === 1 && normalizedArgs[0] === "--check";
  if (normalizedArgs.length > 0 && !check) {
    throw new Error(`Unknown argument: ${normalizedArgs[0]}`);
  }
  const outputDirectory = join(root, "data/staging/g1/blind-retag");
  const manifestPath = join(outputDirectory, "sample-manifest.json");
  const inputPath = join(outputDirectory, "input.md");
  const artifacts = await buildG1BlindRetagArtifacts(root);
  const outputs = [
    [manifestPath, artifacts.manifestContent],
    [inputPath, artifacts.inputContent],
  ] as const;

  if (check) {
    for (const [path, expected] of outputs) {
      if (!existsSync(path)) {
        throw new Error(`Missing blind-retag artifact: ${relative(root, path)}`);
      }
      if (readFileSync(path, "utf8") !== expected) {
        throw new Error(`Stale blind-retag artifact: ${relative(root, path)}`);
      }
    }
    blindRetagSampleManifestSchema.parse(readJson(manifestPath));
    console.log(`Verified ${relative(root, outputDirectory)}`);
    return;
  }

  mkdirSync(outputDirectory, { recursive: true });
  for (const [path, content] of outputs) {
    writeFileSync(path, content, "utf8");
  }
  console.log(`Wrote ${relative(root, outputDirectory)}`);
}

const invokedPath = process.argv[1];
if (invokedPath !== undefined && import.meta.url === pathToFileURL(resolve(invokedPath)).href) {
  void runG1BlindRetagCli(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
