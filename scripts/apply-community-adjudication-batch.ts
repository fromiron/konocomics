import { cpSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import {
  ART_AXIS_IDS,
  AXIS_IDS,
  GENRE_TAGS,
  NARRATIVE_AXIS_IDS,
  THEME_TAGS,
  TONE_AXIS_IDS,
} from "../src/domain/catalog/constants";
import {
  buildPromotionRegistry,
  loadPromotionRegistryInput,
  PROMOTION_BLOCKER_HEADERS,
  serializePromotionRegistry,
  validatePromotionRegistry,
} from "./build-promotion-registry";
import { loadCatalogSource } from "./catalog/load-source";
import { assertLegacyModelWriteMode } from "./catalog/candidate-quarantine";
import { runCatalogPipeline } from "./catalog/pipeline";
import { compareCodeUnit } from "./catalog/promotion-judgment";
import { formatSourceIssue } from "./catalog/report";
import { mergeRawCsv } from "./promote-pilot-001";

const TEXT_AXIS_IDS = [...NARRATIVE_AXIS_IDS, ...TONE_AXIS_IDS] as const;
const REVIEW_REFERENCE = "reviews/community-promotion-v4.md";
const HEADERS = [
  "position",
  "workId",
  "canonicalTitle",
  "genres",
  "themes",
  ...TEXT_AXIS_IDS,
  "factorConfidence",
  "evidenceName",
  "evidenceUrl",
  "evidencePublishedAt",
  "retrievedAt",
  "japaneseEvidenceUrls",
  "koreanEvidenceUrls",
  "koreanQueries",
  "notes",
] as const;
const FROZEN_HEADERS = ["position", "workId", "canonicalTitle"] as const;
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
const VOLUME_HEADERS = [
  "id",
  "workId",
  "volumeNumber",
  "isbn",
  "releaseDate",
  "editionKind",
  "isRepresentative",
  "evidenceId",
] as const;
const FACTOR_VALUES = new Set(["0", "2", "4", "unknown"]);
const GENRES = new Set<string>(GENRE_TAGS);
const THEMES = new Set<string>(THEME_TAGS);

type CsvRow = Record<string, string>;
type Theme = { id: string; centrality: string; confidence: string };
type MatrixRow<Headers extends readonly string[]> = {
  [Header in Headers[number]]: string;
};
type AdjudicationRow = MatrixRow<typeof HEADERS>;
type FrozenRow = MatrixRow<typeof FROZEN_HEADERS>;

function readMatrix<const Headers extends readonly string[]>(
  path: string,
  expectedHeaders: Headers,
): MatrixRow<Headers>[] {
  const matrix = parse(readFileSync(path, "utf8"), {
    bom: true,
    skip_empty_lines: true,
  }) as string[][];
  const [headers, ...records] = matrix;
  if (JSON.stringify(headers) !== JSON.stringify(expectedHeaders)) {
    throw new Error(`${path} has an invalid header`);
  }
  return records.map((record, index) => {
    if (record.length !== expectedHeaders.length)
      throw new Error(`${path}:${String(index + 2)} has an invalid column count`);
    return Object.fromEntries(
      expectedHeaders.map((header, column) => [header, record[column] ?? ""]),
    ) as MatrixRow<Headers>;
  });
}

function isSearchOnlyUrl(value: string) {
  const url = new URL(value);
  const host = url.hostname.replace(/^www\./u, "");
  return (
    host.startsWith("search.") ||
    host === "google.com" ||
    host.endsWith(".google.com") ||
    host === "bing.com" ||
    host.endsWith(".bing.com") ||
    (host === "bookmeter.com" && url.pathname === "/search") ||
    (host === "reviewne.jp" && url.searchParams.has("query")) ||
    (host.endsWith("yahoo.co.jp") && url.pathname.includes("search"))
  );
}

function parseUrls(value: string, required: boolean, label: string) {
  const urls = value
    .split(";")
    .map((url) => url.trim())
    .filter(Boolean);
  if (
    (required && urls.length === 0) ||
    urls.some((url) => !z.url().safeParse(url).success || isSearchOnlyUrl(url))
  ) {
    throw new Error(`${label} must contain direct result URLs, not search pages`);
  }
  return urls;
}

function parseThemes(value: string, workId: string): Theme[] {
  const themes = value
    .split(";")
    .map((theme) => theme.trim())
    .filter(Boolean)
    .map((theme) => {
      const [id = "", centrality = "", confidence = "", ...extra] = theme.split(":");
      const numericConfidence = Number(confidence);
      if (
        extra.length > 0 ||
        !THEMES.has(id) ||
        !["1", "2"].includes(centrality) ||
        numericConfidence < 0.5 ||
        numericConfidence > 1
      ) {
        throw new Error(`${workId} has an invalid theme token: ${theme}`);
      }
      return { id, centrality, confidence };
    });
  if (new Set(themes.map((theme) => theme.id)).size !== themes.length)
    throw new Error(`${workId} has duplicate themes`);
  return themes;
}

function csvCell(value: string | number) {
  const text = String(value);
  return /[",\r\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function serialize(headers: readonly string[], rows: readonly CsvRow[]) {
  return `${[headers.join(","), ...rows.map((row) => headers.map((header) => csvCell(row[header] ?? "")).join(","))].join("\n")}\n`;
}

function atomicWrite(path: string, content: string) {
  const temporary = `${path}.tmp`;
  writeFileSync(temporary, content, "utf8");
  renameSync(temporary, path);
}

function validateRows(rows: AdjudicationRow[], frozen: FrozenRow[]) {
  if (rows.length !== frozen.length)
    throw new Error("Community adjudication must cover the frozen batch exactly");
  if (new Set(rows.map((row) => row.evidenceUrl)).size !== rows.length) {
    throw new Error("Community adjudication must use one work-specific official URL per row");
  }
  return rows.map((row, index) => {
    if (
      row.position !== String(index + 1) ||
      row.position !== frozen[index]?.position ||
      row.workId !== frozen[index]?.workId ||
      row.canonicalTitle !== frozen[index]?.canonicalTitle
    ) {
      throw new Error(`Community adjudication identity mismatch at position ${String(index + 1)}`);
    }
    if (/[\\/]mnt[\\/]|[\\/]home[\\/]|\\\\wsl|wsl\$/iu.test(Object.values(row).join(" ")))
      throw new Error(`${row.workId} contains a WSL path`);
    const genres = row.genres
      .split(";")
      .map((genre) => genre.trim())
      .filter(Boolean);
    if (new Set(genres).size !== genres.length || genres.some((genre) => !GENRES.has(genre)))
      throw new Error(`${row.workId} has invalid genres`);
    const themes = parseThemes(row.themes, row.workId);
    for (const axisId of TEXT_AXIS_IDS)
      if (!FACTOR_VALUES.has(row[axisId] ?? ""))
        throw new Error(`${row.workId}/${axisId} has an invalid value`);
    const hasKnownFactor = TEXT_AXIS_IDS.some((axisId) => row[axisId] !== "unknown");
    const confidence = Number(row.factorConfidence);
    if (
      (hasKnownFactor && row.factorConfidence === "") ||
      (row.factorConfidence !== "" && (confidence < 0.5 || confidence > 1))
    )
      throw new Error(`${row.workId} has an invalid factor confidence`);
    if (
      !z.url().safeParse(row.evidenceUrl).success ||
      isSearchOnlyUrl(row.evidenceUrl) ||
      !/^\d{4}(?:-\d{2}-\d{2})?$/u.test(row.evidencePublishedAt) ||
      !z.iso.date().safeParse(row.retrievedAt).success
    ) {
      throw new Error(`${row.workId} has invalid official evidence metadata`);
    }
    const japaneseUrls = parseUrls(
      row.japaneseEvidenceUrls,
      false,
      `${row.workId} Japanese evidence`,
    );
    const koreanUrls = parseUrls(row.koreanEvidenceUrls, false, `${row.workId} Korean evidence`);
    if (!/[가-힣]/u.test(row.koreanQueries) || row.notes.length < 80 || row.evidenceName === "")
      throw new Error(`${row.workId} lacks review detail`);
    const missingFactorMappings = TEXT_AXIS_IDS.filter(
      (axisId) => row[axisId] !== "unknown" && !row.notes.includes(`${axisId}=${row[axisId]}`),
    );
    if (missingFactorMappings.length > 0) {
      throw new Error(
        `${row.workId} notes do not map known factors: ${missingFactorMappings.join(", ")}`,
      );
    }
    const narrativeKnown = NARRATIVE_AXIS_IDS.filter((axisId) => row[axisId] !== "unknown").length;
    const toneKnown = TONE_AXIS_IDS.filter((axisId) => row[axisId] !== "unknown").length;
    return {
      row,
      genres,
      themes,
      confidence: row.factorConfidence,
      japaneseUrls,
      koreanUrls,
      narrativeKnown,
      toneKnown,
      verified:
        narrativeKnown >= 4 &&
        toneKnown >= 5 &&
        genres.length > 0 &&
        themes.length > 0 &&
        japaneseUrls.length + koreanUrls.length > 0,
    };
  });
}

export function runCommunityAdjudicationBatch(
  batchId: string,
  mode: "check" | "write",
  root = process.cwd(),
) {
  assertLegacyModelWriteMode(mode);
  if (!/^batch-\d{3}$/u.test(batchId)) throw new Error("Batch ID must match batch-NNN");
  const canonicalRoot = resolve(root);
  const sourceRoot = join(canonicalRoot, "data/source");
  const batchRoot = join(canonicalRoot, "data/staging/catalog-expansion/batches", batchId);
  const frozen = readMatrix(join(batchRoot, "frozen-work-set.csv"), FROZEN_HEADERS);
  const reviewed = validateRows(
    readMatrix(join(batchRoot, "community-adjudication-v4.csv"), HEADERS),
    frozen,
  );
  const verified = reviewed.filter((result) => result.verified);
  const pending = reviewed.filter((result) => !result.verified);
  const targetIds = new Set(reviewed.map((result) => result.row.workId));
  const currentWorks = readMatrix(join(sourceRoot, "works.csv"), WORK_HEADERS);
  const currentEvidence = readMatrix(join(sourceRoot, "evidence/evidence.csv"), EVIDENCE_HEADERS);
  const currentVolumes = readMatrix(join(sourceRoot, "volumes.csv"), VOLUME_HEADERS);
  const currentThemes = readMatrix(join(sourceRoot, "themes.csv"), THEME_HEADERS);
  const currentContext = readMatrix(
    join(sourceRoot, "recommendation-context.csv"),
    CONTEXT_HEADERS,
  );
  const workById = new Map(currentWorks.map((work) => [work.id, work]));
  const evidenceById = new Map(currentEvidence.map((evidence) => [evidence.id, evidence]));
  const reviewedAt = `${reviewed[0]?.row.retrievedAt ?? "2026-08-26"}T00:00:00+09:00`;

  const workRows: CsvRow[] = [];
  const factorRows: CsvRow[] = [];
  const themeRows: CsvRow[] = [];
  const evidenceRows: CsvRow[] = [];
  const contextRows: CsvRow[] = [];
  for (const result of reviewed) {
    const work = workById.get(result.row.workId);
    if (work === undefined) throw new Error(`Unknown source work: ${result.row.workId}`);
    const evidence = evidenceById.get(work.evidenceId);
    if (evidence === undefined) throw new Error(`Missing source evidence: ${work.evidenceId}`);
    workRows.push({
      ...work,
      genres: result.genres.join(";"),
      onboardingEligible: result.verified ? "true" : "false",
      recommendationEligible: result.verified ? "true" : "false",
      libraryOnly: result.verified ? "false" : "true",
      annotationReviewMethod: "authorizedModelPanel",
      annotationReviewedAt: reviewedAt,
      annotationReviewReference: REVIEW_REFERENCE,
    });
    const factorValues = [
      ...TEXT_AXIS_IDS.map((axisId) => [axisId, result.row[axisId]] as const),
      ...ART_AXIS_IDS.map((axisId) => [axisId, "unknown"] as const),
    ];
    for (const [axisId, value] of factorValues) {
      factorRows.push({
        workId: result.row.workId,
        axisId,
        state: value === "unknown" ? "unknown" : "known",
        value: value === "unknown" ? "" : value,
        confidence: value === "unknown" ? "" : result.confidence,
        evidenceId: work.evidenceId,
      });
    }
    themeRows.push(
      ...result.themes.map((theme) => ({
        workId: result.row.workId,
        themeId: theme.id,
        centrality: theme.centrality,
        confidence: theme.confidence,
        evidenceId: work.evidenceId,
      })),
    );
    evidenceRows.push({
      ...evidence,
      sourceType: "model",
      sourceUrl: result.row.evidenceUrl,
      fetchedAt: reviewedAt,
      extractorVersion: "community-promotion-v4",
      reviewedByHuman: "false",
      confidence: result.confidence || evidence.confidence,
      notes: `${result.row.notes} Japanese evidence: ${result.japaneseUrls.join("; ") || "no direct result"}. Korean-title evidence: ${result.koreanUrls.join("; ") || "no direct result"}. Korean queries: ${result.row.koreanQueries}.`,
    });
    const volumeCount = Math.max(
      1,
      ...currentVolumes
        .filter((volume) => volume.workId === result.row.workId)
        .map((volume) => Number(volume.volumeNumber) || 0),
    );
    contextRows.push({
      workId: result.row.workId,
      catalogRole: "discovery",
      seriesGroupId: "",
      volumeCount: String(volumeCount),
      reviewAverage: "",
      reviewCount: "",
    });
  }

  const worksContent = mergeRawCsv({
    current: readFileSync(join(sourceRoot, "works.csv"), "utf8"),
    overlay: serialize(WORK_HEADERS, workRows),
    headers: WORK_HEADERS,
    matches: (record) => targetIds.has(record[0] ?? ""),
    allowedCurrentMatchCounts: [reviewed.length],
  });
  const factorsContent = mergeRawCsv({
    current: readFileSync(join(sourceRoot, "factors.csv"), "utf8"),
    overlay: serialize(FACTOR_HEADERS, factorRows),
    headers: FACTOR_HEADERS,
    matches: (record) => targetIds.has(record[0] ?? ""),
    allowedCurrentMatchCounts: [reviewed.length * AXIS_IDS.length],
  });
  const themesContent = mergeRawCsv({
    current: readFileSync(join(sourceRoot, "themes.csv"), "utf8"),
    overlay: serialize(THEME_HEADERS, themeRows),
    headers: THEME_HEADERS,
    matches: (record) => targetIds.has(record[0] ?? ""),
    allowedCurrentMatchCounts: [
      currentThemes.filter((theme) => targetIds.has(theme.workId)).length,
    ],
  });
  const evidenceIds = new Set(workRows.map((work) => work.evidenceId));
  if (evidenceIds.size !== reviewed.length) {
    throw new Error(`${batchId} must have one source evidence row per work`);
  }
  const evidenceContent = mergeRawCsv({
    current: readFileSync(join(sourceRoot, "evidence/evidence.csv"), "utf8"),
    overlay: serialize(EVIDENCE_HEADERS, evidenceRows),
    headers: EVIDENCE_HEADERS,
    matches: (record) => evidenceIds.has(record[0] ?? ""),
    allowedCurrentMatchCounts: [reviewed.length],
  });
  const contextContent = mergeRawCsv({
    current: readFileSync(join(sourceRoot, "recommendation-context.csv"), "utf8"),
    overlay: serialize(CONTEXT_HEADERS, contextRows),
    headers: CONTEXT_HEADERS,
    matches: (record) => targetIds.has(record[0] ?? ""),
    allowedCurrentMatchCounts: [
      currentContext.filter((context) => targetIds.has(context.workId)).length,
    ],
  });

  const input = loadPromotionRegistryInput(canonicalRoot);
  const blockers = input.blockers
    .filter(
      (blocker) =>
        !targetIds.has(blocker.workId) || blocker.blockerCode !== "SOURCE_INFORMATION_UNAVAILABLE",
    )
    .sort(
      (left, right) =>
        compareCodeUnit(left.workId, right.workId) ||
        compareCodeUnit(left.blockerCode, right.blockerCode),
    );
  const blockersContent = serialize(PROMOTION_BLOCKER_HEADERS, blockers as unknown as CsvRow[]);

  const temporarySource = mkdtempSync(join(tmpdir(), "konocomics-community-"));
  let registryContent = "";
  try {
    cpSync(sourceRoot, temporarySource, { recursive: true });
    writeFileSync(join(temporarySource, "works.csv"), worksContent, "utf8");
    writeFileSync(join(temporarySource, "factors.csv"), factorsContent, "utf8");
    writeFileSync(join(temporarySource, "themes.csv"), themesContent, "utf8");
    writeFileSync(join(temporarySource, "evidence/evidence.csv"), evidenceContent, "utf8");
    writeFileSync(join(temporarySource, "recommendation-context.csv"), contextContent, "utf8");
    const errors = runCatalogPipeline(temporarySource).issues.filter(
      (issue) => issue.severity === "error",
    );
    if (errors.length > 0) throw new Error(errors.map(formatSourceIssue).join("\n"));
    const loaded = loadCatalogSource(temporarySource);
    const registryRows = buildPromotionRegistry({
      ...input,
      source: loaded.source,
      artEvidence: loaded.artEvidence,
      existingReviewReferences: new Set([...input.existingReviewReferences, REVIEW_REFERENCE]),
      blockers,
    });
    validatePromotionRegistry(
      registryRows,
      loaded.source.works.map((work) => work.value.id),
    );
    for (const result of reviewed) {
      const registryRow = registryRows.find(
        (registryRow) => registryRow.workId === result.row.workId,
      );
      const outcome = registryRow?.promotionOutcome;
      const expected = result.verified
        ? "recommendationVerified"
        : registryRow?.blockerCode === ""
          ? "pending"
          : "promotionBlocked";
      if (outcome !== expected)
        throw new Error(
          `${result.row.workId} expected ${expected} but produced ${outcome ?? "missing"}`,
        );
    }
    registryContent = serializePromotionRegistry(registryRows);
  } finally {
    rmSync(temporarySource, { recursive: true, force: true });
  }

  const outputs = new Map([
    [join(sourceRoot, "works.csv"), worksContent],
    [join(sourceRoot, "factors.csv"), factorsContent],
    [join(sourceRoot, "themes.csv"), themesContent],
    [join(sourceRoot, "evidence/evidence.csv"), evidenceContent],
    [join(sourceRoot, "recommendation-context.csv"), contextContent],
    [join(canonicalRoot, "data/staging/catalog-expansion/promotion-blockers.csv"), blockersContent],
    [join(canonicalRoot, "data/staging/catalog-expansion/promotion-registry.csv"), registryContent],
  ]);
  if (mode === "check") {
    for (const [path, content] of outputs)
      if (readFileSync(path, "utf8") !== content)
        throw new Error(`${batchId} community adjudication state is stale; run with --write`);
  } else {
    for (const [path, content] of outputs) atomicWrite(path, content);
  }
  return { batchId, verified: verified.length, pending: pending.length };
}

const [modeArgument, batchArgument] = process.argv.slice(2);
if (modeArgument !== undefined) {
  try {
    const mode =
      modeArgument === "--check" ? "check" : modeArgument === "--write" ? "write" : undefined;
    if (mode === undefined || batchArgument === undefined)
      throw new Error(
        "Usage: tsx scripts/apply-community-adjudication-batch.ts --check|--write batch-NNN",
      );
    const result = runCommunityAdjudicationBatch(batchArgument, mode);
    console.log(
      `${result.batchId} community adjudication ${mode}: verified ${String(result.verified)}; pending ${String(result.pending)}.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
