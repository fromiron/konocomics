import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { parse } from "csv-parse/sync";

const factors = new Set([
  "progression",
  "problemSolving",
  "strategy",
  "pacing",
  "mysteryReveal",
  "worldBuilding",
  "characterArcWeight",
  "relationshipStructure",
  "comedy",
  "darkness",
  "mentalStress",
  "romance",
  "emotionalWarmth",
  "artRealism",
  "artDensity",
  "visualSoftness",
  "motionImpact",
]);
const genres = new Set([
  "action",
  "fantasy",
  "historical",
  "scienceFiction",
  "mystery",
  "sports",
  "comedy",
  "horror",
  "sliceOfLife",
  "romance",
]);
const themes = new Set([
  "adventure",
  "combat",
  "martialArts",
  "war",
  "politics",
  "survival",
  "investigation",
  "dungeon",
  "crafting",
  "cooking",
  "territoryManagement",
  "tournament",
  "revenge",
  "timeTravel",
  "reincarnation",
  "school",
  "workplace",
  "sportsCompetition",
  "foundFamily",
  "historicalReconstruction",
  "postApocalypse",
  "exploration",
]);
const searchHosts = new Set([
  "google.com",
  "www.google.com",
  "bing.com",
  "www.bing.com",
  "search.yahoo.co.jp",
]);
const scopeAliases = new Set([
  "whole_work",
  "series_level",
  "full_series",
  "series_general_unbounded",
  "entry_1_3_volumes_or_first_major_episode",
  "first_major_episode",
  "episodes_1_3",
  "entry_1_3_volumes_and_first_major_episode",
  "entry_1_volume",
  "entry_2_volume",
  "entry_3_volume",
  "volume_1",
  "volume_2",
  "volume_3",
  "manga volume 1",
  "manga volume 2",
  "manga volume 3",
  "entry_1_2_volumes",
  "entry_2_3_volumes",
  "entry_1_3_volumes",
]);
const auditAccess = new Set(["full-body", "partial-body", "search-snippet", "blocked"]);
const authorRoles = new Set(["creator", "editor", "reviewer", "publisher", "unknown"]);
const datePrecision =
  /^(?:\d{4}(?:-\d{2}(?:-\d{2})?)?(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?)?)$/u;

function readCsv(path) {
  return parse(readFileSync(path), { columns: true, bom: true, skip_empty_lines: true });
}

function assertStringList(value, label) {
  assert(Array.isArray(value), `${label} must be an array`);
  assert(
    value.every((item) => typeof item === "string" && item.trim().length > 0),
    `${label} must contain non-empty strings`,
  );
  assert.equal(new Set(value).size, value.length, `${label} duplicate item`);
}

function validateReadAudit(source, workId) {
  const audit = source.readAudit;
  assert(audit && typeof audit === "object" && !Array.isArray(audit), `${workId} source readAudit`);
  assert.deepEqual(
    Object.keys(audit).sort(),
    [
      "access",
      "author",
      "authorRole",
      "coveredSections",
      "excludedSections",
      "pageTitle",
      "publishedAt",
      "retrievedAt",
      "scopeLocator",
    ],
    `${workId} readAudit keys`,
  );
  assert(auditAccess.has(audit.access), `${workId} invalid readAudit access`);
  assert.equal(typeof audit.scopeLocator, "string", `${workId} readAudit scopeLocator`);
  assert(audit.scopeLocator.trim().length > 0, `${workId} empty readAudit scopeLocator`);
  assertStringList(audit.coveredSections, `${workId} readAudit coveredSections`);
  assertStringList(audit.excludedSections, `${workId} readAudit excludedSections`);
  assert.equal(typeof audit.pageTitle, "string", `${workId} readAudit pageTitle`);
  assert.equal(typeof audit.author, "string", `${workId} readAudit author`);
  assert(authorRoles.has(audit.authorRole), `${workId} invalid readAudit authorRole`);
  if (audit.authorRole === "unknown")
    assert.equal(audit.author, "", `${workId} unknown author must be blank`);
  else assert(audit.author.trim().length > 0, `${workId} known author role requires author`);
  assert.equal(typeof audit.publishedAt, "string", `${workId} readAudit publishedAt`);
  assert.equal(typeof audit.retrievedAt, "string", `${workId} readAudit retrievedAt`);
  assert(
    audit.publishedAt === "" || datePrecision.test(audit.publishedAt),
    `${workId} invalid readAudit publishedAt precision`,
  );
  assert(
    datePrecision.test(audit.retrievedAt),
    `${workId} invalid readAudit retrievedAt precision`,
  );
  if (audit.access === "full-body" || audit.access === "partial-body") {
    assert(audit.coveredSections.length >= 1, `${workId} body read requires coveredSections`);
  }
  if (audit.access === "blocked") {
    assert.equal(audit.coveredSections.length, 0, `${workId} blocked read coveredSections`);
    assert.equal(source.claimCandidates.length, 0, `${workId} blocked read claimCandidates`);
  }
}

function validateSource(source, workId, requireSourceAudit = false) {
  assert(
    source && typeof source === "object" && !Array.isArray(source),
    `${workId} invalid source`,
  );
  const url = new URL(source.url);
  assert(["http:", "https:"].includes(url.protocol), `${workId} URL protocol`);
  assert(!searchHosts.has(url.hostname), `${workId} search-result URL`);
  assert(
    ["publisher", "independent-review", "other"].includes(source.sourceFamily),
    `${workId} sourceFamily`,
  );
  assert(["ja", "ko", "en", "zh"].includes(source.language), `${workId} language`);
  const scope = typeof source.entryScope === "string" ? source.entryScope.replaceAll("_", " ") : "";
  const range =
    /^(?:entry )?([1-9]\d*)(?: ([1-9]\d*))? volumes?$/u.exec(scope) ??
    /^(?:manga )?volumes? ([1-9]\d*)(?:[- ]([1-9]\d*))?$/u.exec(scope);
  assert(
    scopeAliases.has(source.entryScope) ||
      (range && Number(range[1]) <= Number(range[2] ?? range[1])),
    `${workId} invalid entryScope`,
  );
  assert.equal(typeof source.workOwned, "boolean", `${workId} workOwned`);
  if (source.sourceFamily === "publisher")
    assert.equal(source.workOwned, true, `${workId} publisher ownership`);
  assert(Array.isArray(source.independentFrom), `${workId} independentFrom`);
  assert(
    source.independentFrom.every((value) => typeof value === "string" && value.trim().length > 0),
    `${workId} invalid independentFrom entry`,
  );
  assert.equal(
    new Set(source.independentFrom).size,
    source.independentFrom.length,
    `${workId} duplicate independentFrom entry`,
  );
  assert.equal(typeof source.observation, "string", `${workId} observation`);
  assert(source.observation.trim().length > 0, `${workId} empty observation`);
  assert.equal(typeof source.limitation, "string", `${workId} limitation`);
  assert(source.limitation.trim().length > 0, `${workId} empty limitation`);
  assert(Array.isArray(source.claimCandidates), `${workId} claimCandidates`);
  for (const claim of source.claimCandidates) {
    assert.deepEqual(
      Object.keys(claim).sort(),
      ["anchor", "targetId", "targetType"],
      `${workId} claim keys`,
    );
    assert(["genre", "theme", "factor"].includes(claim.targetType), `${workId} claim type`);
    const vocabulary =
      claim.targetType === "genre" ? genres : claim.targetType === "theme" ? themes : factors;
    assert(
      vocabulary.has(claim.targetId),
      `${workId} invalid ${claim.targetType} id ${claim.targetId}`,
    );
    assert.equal(typeof claim.anchor, "string", `${workId} claim anchor`);
    assert(claim.anchor.trim().length > 0, `${workId} empty claim anchor`);
  }
  if (source.readAudit !== undefined || requireSourceAudit) validateReadAudit(source, workId);
}

function parseResearch(path) {
  return readFileSync(path, "utf8")
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line, lineIndex) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`research invalid JSON line ${lineIndex + 1}: ${error.message}`);
      }
    });
}

export function validateResearchRow(row, seenWorkIds, requireSourceAudit = false) {
  assert.equal(row.schemaVersion, "factor-evidence-collector-v1", `${row.workId} schema`);
  assert(typeof row.workId === "string" && row.workId.trim(), "research workId missing");
  assert(!seenWorkIds.has(row.workId), `${row.workId} duplicate work`);
  seenWorkIds.add(row.workId);
  assert(["EVIDENCE_FOUND", "INSUFFICIENT"].includes(row.status), `${row.workId} status`);
  assert.equal(row.candidateOnly, true, `${row.workId} candidateOnly`);
  assert.equal(row.reviewedByHuman, false, `${row.workId} reviewedByHuman`);
  assert.equal(row.grokUsed, false, `${row.workId} grokUsed`);
  assert.equal(row.paidSourceUsed, false, `${row.workId} paidSourceUsed`);
  assert(Array.isArray(row.sources), `${row.workId} sources`);
  assert(Array.isArray(row.remainingGaps), `${row.workId} remainingGaps`);
  const urls = new Set();
  for (const source of row.sources) {
    validateSource(source, row.workId, requireSourceAudit);
    assert(!urls.has(source.url), `${row.workId} duplicate URL`);
    urls.add(source.url);
  }
  if (row.status === "EVIDENCE_FOUND")
    assert(row.sources.length > 0, `${row.workId} EVIDENCE_FOUND without sources`);
  return row.sources.length;
}

export function validateExhaustionRecord(record, row) {
  assert.deepEqual(Object.keys(record).sort(), [
    "attempts",
    "policy",
    "representativeIsbn",
    "stopReason",
    "workId",
  ]);
  assert.equal(record.policy, "narrative-tone-exhaustion-v1");
  assert.equal(record.workId, row.workId);
  assert.equal(typeof row.isbn13, "string", "N/T handoff requires the representative ISBN");
  assert.equal(record.representativeIsbn, row.isbn13);
  assert(
    typeof record.stopReason === "string" && record.stopReason.trim(),
    "N/T stop reason missing",
  );
  assert(Array.isArray(record.attempts) && record.attempts.length, "N/T actual attempts missing");
  for (const attempt of record.attempts) {
    assert.deepEqual(Object.keys(attempt).sort(), ["gap", "observation", "outcome", "sourceUrl"]);
    assert(
      row.sources.some((source) => source.url === attempt.sourceUrl),
      "N/T same-work source missing",
    );
    assert(["narrative", "tone"].includes(attempt.gap), "N/T gap invalid");
    assert(
      ["insufficient", "unavailable", "duplicate", "resolved"].includes(attempt.outcome),
      "N/T outcome invalid",
    );
    assert(
      typeof attempt.observation === "string" && attempt.observation.trim(),
      "N/T observation missing",
    );
  }
}

export function validateCollectionHandoff(researchPath, rows) {
  const path = join(dirname(researchPath), "COLLECTION-HANDOFF.json");
  if (!existsSync(path)) return;
  const handoff = JSON.parse(readFileSync(path, "utf8"));
  assert.deepEqual(Object.keys(handoff).sort(), [
    "narrativeToneExhaustion",
    "researchSha256",
    "schemaVersion",
  ]);
  assert.equal(handoff.schemaVersion, "factor-collection-handoff-v1");
  assert.equal(
    handoff.researchSha256,
    createHash("sha256").update(readFileSync(researchPath)).digest("hex"),
    "INPUT_NEEDS_REPAIR: handoff research SHA mismatch",
  );
  const matches = rows.filter((row) => row.workId === handoff.narrativeToneExhaustion.workId);
  assert.equal(matches.length, 1, "INPUT_NEEDS_REPAIR: handoff Work mismatch");
  validateExhaustionRecord(handoff.narrativeToneExhaustion, matches[0]);
}

function main() {
  const batchRootArg = process.argv
    .find((value) => value.startsWith("--batch-root="))
    ?.slice("--batch-root=".length);
  const researchArg = process.argv
    .find((value) => value.startsWith("--research="))
    ?.slice("--research=".length);
  assert(
    Boolean(batchRootArg) !== Boolean(researchArg),
    "usage: node validate_factor_collection_batch.mjs --batch-root=<path> [--all] or --research=<jsonl>",
  );
  const root = batchRootArg ? resolve(batchRootArg) : null;
  const requireAll = process.argv.includes("--all");
  const requireSourceAudit = process.argv.includes("--require-source-audit");
  const repository = resolve(import.meta.dirname, "../..");
  const collectionPath = resolve(researchArg || batchRootArg);
  const relativeCollection = relative(repository, collectionPath);
  // External test fixtures remain a read-only validator surface, not saved authoring work.
  if (
    process.env.KONOCOMICS_AUTHORING_RECORDED !== "1" &&
    relativeCollection &&
    !isAbsolute(relativeCollection) &&
    relativeCollection !== ".." &&
    !relativeCollection.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`)
  ) {
    const result = spawnSync(
      "python",
      [
        join(repository, "scripts/catalog_workspace.py"),
        "run",
        "--label",
        "factor-collection",
        "--input",
        researchArg ? dirname(collectionPath) : collectionPath,
        "--input",
        process.argv[1],
        "--input",
        join(repository, "scripts/catalog_workspace.py"),
        ...(researchArg && existsSync(join(dirname(collectionPath), "collection-session.json"))
          ? ["--input", join(import.meta.dirname, "collect_factor_evidence.mjs")]
          : []),
        "--",
        process.execPath,
        ...process.argv.slice(1),
      ],
      { stdio: "inherit", windowsHide: true },
    );
    if (result.error) throw result.error;
    process.exit(result.status ?? 1);
  }
  if (researchArg) {
    const rows = parseResearch(resolve(researchArg));
    validateCollectionHandoff(resolve(researchArg), rows);
    assert(rows.length >= 1 && rows.length <= 200, "research requires 1..200 works");
    let sourceCount = 0;
    const seenWorkIds = new Set();
    for (const row of rows)
      sourceCount += validateResearchRow(row, seenWorkIds, requireSourceAudit);
    console.log(
      JSON.stringify({
        status: "PASS",
        mode: "research",
        researchPath: resolve(researchArg),
        works: rows.length,
        sources: sourceCount,
        requireSourceAudit,
        semanticReviewRequired: true,
      }),
    );
    process.exit(0);
  }

  let completedChunks = 0;
  let completedWorks = 0;
  let found = 0;
  let insufficient = 0;
  let sourceCount = 0;
  const batchTargets = readCsv(join(root, "targets.csv"));
  assert(batchTargets.length >= 1 && batchTargets.length <= 200, "batch requires 1..200 targets");
  assert(
    batchTargets.every((row) => typeof row.workId === "string" && row.workId.trim()),
    "root target workId missing",
  );
  const targetIndex = new Map(batchTargets.map((row, index) => [row.workId, index]));
  assert.equal(targetIndex.size, batchTargets.length, "duplicate root target work");
  const chunksRoot = join(root, "chunks");
  const chunks = existsSync(chunksRoot)
    ? readdirSync(chunksRoot, { withFileTypes: true }).filter((entry) =>
        entry.name.startsWith("chunk-"),
      )
    : [];
  for (const entry of chunks) {
    const number = Number(entry.name.slice("chunk-".length));
    assert(
      entry.isDirectory() &&
        number >= 1 &&
        number <= 200 &&
        entry.name === `chunk-${String(number).padStart(2, "0")}`,
      `invalid chunk directory: ${entry.name}`,
    );
  }
  chunks.sort((a, b) => Number(a.name.slice(6)) - Number(b.name.slice(6)));
  const assignments = chunks.map((entry) => {
    const path = join(chunksRoot, entry.name);
    const targets = readCsv(join(path, "targets.csv"));
    assert(targets.length > 0, `${entry.name} empty targets`);
    for (const row of targets) {
      assert.deepEqual(
        row,
        batchTargets[targetIndex.get(row.workId)],
        `${entry.name} target differs from root: ${row.workId}`,
      );
    }
    return { name: entry.name, path, targets };
  });
  const assigned = assignments.flatMap((chunk) =>
    chunk.targets.map((row) => targetIndex.get(row.workId)),
  );
  assert(
    assigned.every((index, position) => position === 0 || index > assigned[position - 1]),
    "chunk target order or duplicate work mismatch",
  );
  if (requireAll)
    assert.deepEqual(
      assigned,
      batchTargets.map((_, index) => index),
      "chunk targets do not exactly partition root targets",
    );
  for (const { name: index, path: chunk, targets } of assignments) {
    const researchPath = join(chunk, "research.jsonl");
    const reportPath = join(chunk, "REPORT.md");
    if (!existsSync(researchPath) || !existsSync(reportPath)) {
      if (requireAll) assert.fail(`missing chunk output: ${index}`);
      continue;
    }
    const rows = parseResearch(researchPath);
    validateCollectionHandoff(researchPath, rows);
    assert.equal(rows.length, targets.length, `chunk ${index} research row count`);
    assert.deepEqual(
      rows.map((row) => row.workId),
      targets.map((row) => row.workId),
      `chunk ${index} target order`,
    );
    assert.equal(
      new Set(rows.map((row) => row.workId)).size,
      targets.length,
      `chunk ${index} duplicate work`,
    );
    const seenWorkIds = new Set();
    for (const row of rows) {
      validateResearchRow(row, seenWorkIds, requireSourceAudit);
      if (row.status === "EVIDENCE_FOUND") {
        assert(row.sources.length > 0, `${row.workId} EVIDENCE_FOUND without sources`);
        found += 1;
      } else insufficient += 1;
      sourceCount += row.sources.length;
    }
    assert(readFileSync(reportPath, "utf8").trim().length > 0, `chunk ${index} empty report`);
    completedChunks += 1;
    completedWorks += rows.length;
  }

  console.log(
    JSON.stringify({
      status: "PASS",
      mode: "batch",
      batchRoot: root,
      targetCount: batchTargets.length,
      chunkCount: chunks.length,
      completedChunks,
      completedWorks,
      missingWorks: batchTargets.length - completedWorks,
      evidenceFound: found,
      insufficient,
      sources: sourceCount,
      requireAll,
      requireSourceAudit,
      semanticReviewRequired: true,
    }),
  );
}

if (
  typeof process !== "undefined" &&
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main();
