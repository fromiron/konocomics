import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import { AXIS_IDS, GENRE_TAGS, THEME_TAGS } from "../src/domain/catalog/constants";
import { validateFrozenPromotionBatchPacket } from "./build-promotion-batch-packet";
import { factorSourceRowSchema, themeSourceRowSchema } from "./catalog/source-schema";
import { promotionPilotManifestSchema } from "./build-promotion-pilot";

const PILOT_PACKET_ROOT = "data/staging/catalog-expansion/pilots/pilot-001";
const OUTPUT_FILES = ["factors.csv", "genres.csv", "notes.md", "themes.csv"] as const;
const workIdSchema = z.string().regex(/^work-[a-f0-9]{20}$/u);
const genreRowSchema = z.strictObject({
  workId: workIdSchema,
  genres: z.string(),
});

function readCsv<T>(path: string, headers: readonly string[], schema: z.ZodType<T>) {
  const rows: unknown = parse(readFileSync(path, "utf8"), {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  const header = readFileSync(path, "utf8")
    .replace(/^\uFEFF/u, "")
    .split(/\r?\n/u, 1)[0];
  if (header !== headers.join(",")) throw new Error(`Unexpected CSV header: ${path}`);
  return z.array(schema).parse(rows);
}

function researchSections(content: string) {
  const headings = [...content.matchAll(/^## (?:workId: `)?(work-[a-f0-9]+)`? — (.+)$/gmu)];
  return headings.map((heading, index) => ({
    workId: heading[1] ?? "",
    content: content.slice(heading.index ?? 0, headings[index + 1]?.index ?? content.length),
  }));
}

function assertCanonicalList(
  values: readonly string[],
  canonical: readonly string[],
  label: string,
) {
  if (
    new Set(values).size !== values.length ||
    values.some((value) => !canonical.includes(value))
  ) {
    throw new Error(`Invalid ${label}`);
  }
  const positions = values.map((value) => canonical.indexOf(value));
  if (positions.some((position, index) => index > 0 && positions[index - 1]! >= position)) {
    throw new Error(`Non-canonical ${label} order`);
  }
}

export function validatePromotionAnnotationChunk(
  pass: string,
  chunk: string,
  root = process.cwd(),
) {
  const packet = join(resolve(root), PILOT_PACKET_ROOT);
  const manifest = promotionPilotManifestSchema.parse(
    JSON.parse(readFileSync(join(packet, "manifest.json"), "utf8")) as unknown,
  );
  return validatePromotionAnnotationArtifacts({
    packetDirectory: packet,
    pass,
    chunk,
    candidateSha256: manifest.candidateSha256,
    workSetIds: manifest.workSet.workIds,
    evidencePrefix: "ev-pilot-001-a-",
    candidateLabel: "Pilot",
    requireFrozenChunkOrder: false,
  });
}

export function validatePromotionBatchAnnotationChunk(options: {
  batchId: string;
  pass: string;
  chunk: string;
  root?: string;
}) {
  const root = resolve(options.root ?? process.cwd());
  const manifest = validateFrozenPromotionBatchPacket(options.batchId, root);
  return validatePromotionAnnotationArtifacts({
    packetDirectory: join(root, manifest.packetRoot),
    pass: options.pass,
    chunk: options.chunk,
    candidateSha256: manifest.candidateSha256,
    workSetIds: manifest.workSet.workIds,
    evidencePrefix: `ev-${options.batchId}-a-`,
    candidateLabel: options.batchId,
    requireFrozenChunkOrder: true,
  });
}

export function validatePromotionAnnotationArtifacts(options: {
  packetDirectory: string;
  pass: string;
  chunk: string;
  candidateSha256: string;
  workSetIds: readonly string[];
  evidencePrefix: string;
  candidateLabel: string;
  requireFrozenChunkOrder?: boolean;
}) {
  const { pass, chunk } = options;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(pass) || !/^0[1-5]$/u.test(chunk)) {
    throw new Error("Invalid annotation pass or chunk");
  }
  const packet = options.packetDirectory;
  const research = readFileSync(join(packet, `research/chunk-${chunk}.md`), "utf8");
  const sections = researchSections(research);
  const workIds = sections.map((section) => workIdSchema.parse(section.workId));
  if (workIds.length !== 10 || new Set(workIds).size !== 10) {
    throw new Error(`Research chunk-${chunk} does not contain 10 unique works`);
  }
  const chunkOffset = (Number(chunk) - 1) * 10;
  const unexpectedWork = workIds.find((workId) => !options.workSetIds.includes(workId));
  if (unexpectedWork !== undefined) {
    throw new Error(`Research chunk-${chunk} is outside the frozen work set: ${unexpectedWork}`);
  }
  if (
    options.requireFrozenChunkOrder &&
    JSON.stringify(workIds) !==
      JSON.stringify(options.workSetIds.slice(chunkOffset, chunkOffset + workIds.length))
  ) {
    throw new Error(`Research chunk-${chunk} differs from the frozen work-set order`);
  }
  const outputDirectory = join(packet, pass, `chunk-${chunk}`);
  const actualFiles = readdirSync(outputDirectory).sort();
  if (JSON.stringify(actualFiles) !== JSON.stringify(OUTPUT_FILES)) {
    throw new Error(`Unexpected annotation file set: ${actualFiles.join(",")}`);
  }

  const factors = readCsv(
    join(outputDirectory, "factors.csv"),
    ["workId", "axisId", "state", "value", "confidence", "evidenceId"],
    factorSourceRowSchema,
  );
  if (factors.length !== workIds.length * AXIS_IDS.length) {
    throw new Error(`Factor row count is not 10x17: chunk-${chunk}`);
  }
  const factorWorkOrder = Array.from(
    { length: workIds.length },
    (_, index) => factors[index * AXIS_IDS.length]!.workId,
  );
  if (JSON.stringify(factorWorkOrder) !== JSON.stringify(workIds)) {
    throw new Error(`Factor work set differs from research: chunk-${chunk}`);
  }
  const expectedFactorPairs = factorWorkOrder.flatMap((workId) =>
    AXIS_IDS.map((axisId) => `${workId}\u0000${axisId}`),
  );
  const actualFactorPairs = factors.map((row) => `${row.workId}\u0000${row.axisId}`);
  if (JSON.stringify(actualFactorPairs) !== JSON.stringify(expectedFactorPairs)) {
    throw new Error(`Factor rows are not the exact ordered 10x17 matrix: chunk-${chunk}`);
  }
  for (const row of factors) {
    if (row.evidenceId !== `${options.evidencePrefix}${row.workId}`) {
      throw new Error(`Unexpected Factor evidenceId: ${row.workId}/${row.axisId}`);
    }
  }

  const genres = readCsv(join(outputDirectory, "genres.csv"), ["workId", "genres"], genreRowSchema);
  if (JSON.stringify(genres.map((row) => row.workId)) !== JSON.stringify(factorWorkOrder)) {
    throw new Error(`Genre rows do not match Factor work order: chunk-${chunk}`);
  }
  for (const row of genres) {
    const values = row.genres === "" ? [] : row.genres.split(";");
    assertCanonicalList(values, GENRE_TAGS, `Genre list: ${row.workId}`);
  }

  const themes = readCsv(
    join(outputDirectory, "themes.csv"),
    ["workId", "themeId", "centrality", "confidence", "evidenceId"],
    themeSourceRowSchema,
  );
  const workOrder = new Map(factorWorkOrder.map((workId, index) => [workId, index]));
  let previous = -1;
  const pairs = new Set<string>();
  for (const row of themes) {
    const order =
      (workOrder.get(row.workId) ?? -100) * THEME_TAGS.length + THEME_TAGS.indexOf(row.themeId);
    const pair = `${row.workId}\u0000${row.themeId}`;
    if (order < 0 || order <= previous || pairs.has(pair)) {
      throw new Error(`Theme rows are not unique and canonically ordered: ${pair}`);
    }
    if (row.evidenceId !== `${options.evidencePrefix}${row.workId}`) {
      throw new Error(`Unexpected Theme evidenceId: ${pair}`);
    }
    pairs.add(pair);
    previous = order;
  }

  const notes = readFileSync(join(outputDirectory, "notes.md"), "utf8");
  if (!notes.includes(options.candidateSha256)) {
    throw new Error(`Annotation notes do not bind the ${options.candidateLabel} candidate SHA-256`);
  }
  for (const section of sections) {
    const sourceUrls = [...section.content.matchAll(/^- `?sourceUrl`?: (.+)$/gmu)].flatMap((line) =>
      [...(line[1] ?? "").matchAll(/https?:\/\/[^\s;>]+/gu)].map((url) => url[0]),
    );
    if (!notes.includes(section.workId) || !sourceUrls.some((url) => notes.includes(url))) {
      throw new Error(`Annotation notes lack frozen evidence for ${section.workId}`);
    }
  }

  const known = factors.filter((row) => row.state === "known").length;
  const unknown = factors.filter((row) => row.state === "unknown").length;
  const notApplicable = factors.length - known - unknown;
  return {
    pass,
    chunk,
    workCount: workIds.length,
    factorCount: factors.length,
    known,
    unknown,
    notApplicable,
    themeCount: themes.length,
    candidateSha256: options.candidateSha256,
  };
}

function parseNamedCli(args: readonly string[]) {
  const normalized = args[0] === "--" ? args.slice(1) : [...args];
  if (normalized.length !== 6) return undefined;
  const options = new Map<string, string>();
  for (let index = 0; index < normalized.length; index += 2) {
    const key = normalized[index];
    const value = normalized[index + 1];
    if (
      key === undefined ||
      value === undefined ||
      !["--batch-id", "--pass", "--chunk"].includes(key) ||
      options.has(key)
    ) {
      return undefined;
    }
    options.set(key, value);
  }
  const batchId = options.get("--batch-id");
  const pass = options.get("--pass");
  const chunk = options.get("--chunk");
  return batchId === undefined || pass === undefined || chunk === undefined
    ? undefined
    : { batchId, pass, chunk };
}

const invokedPath = process.argv[1];
if (invokedPath !== undefined && import.meta.url === pathToFileURL(resolve(invokedPath)).href) {
  try {
    const args = process.argv.slice(2);
    const named = parseNamedCli(args);
    const result =
      named === undefined && args.length === 2
        ? validatePromotionAnnotationChunk(args[0] ?? "", args[1] ?? "")
        : named === undefined
          ? undefined
          : validatePromotionBatchAnnotationChunk(named);
    if (result === undefined) {
      throw new Error(
        "Usage: validate-promotion-annotations.ts <pass> <01-05> | --batch-id <id> --pass <pass> --chunk <01-05>",
      );
    }
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
