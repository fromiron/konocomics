import { createHash } from "node:crypto";
import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import { normalizeTitle } from "../src/domain/catalog/normalize";
import {
  RAKUTEN_BOOKS_ENDPOINT,
  readRakutenCredentials,
  type RakutenCredentials,
} from "../src/infrastructure/rakuten/server";

const RETRIEVED_AT = "2026-08-22";
const REQUEST_INTERVAL_MS = 1_200;
const SELECTION_POLICY =
  "konomanga-all;tsugimanga-comics-all;shogakukan-all;bookseller-all;mangataisho-finalists-all-and-first-selection-2008-2015";
const CACHE_FILE = "rakuten-search-results.jsonl";
const MANIFEST_FILE = "rakuten-search-manifest.json";

const sourceRegistrySchema = z.object({
  sourceId: z.string(),
  sourceKind: z.enum(["community", "award", "bookseller", "sales", "publisher", "editorial"]),
});
const rawItemSchema = z.object({
  sourceItemId: z.string(),
  sourceId: z.string(),
  rawPublicationClass: z.string(),
  rawTitle: z.string(),
});
const itemSchema = z.object({
  title: z.string().min(1),
  author: z.string(),
  publisherName: z.string(),
  isbn: z.string(),
  booksGenreId: z.string(),
  salesDate: z.string().optional(),
  itemUrl: z.string().url(),
});
const responseSchema = z.union([
  z.object({ items: z.array(itemSchema) }),
  z.object({ Items: z.array(itemSchema) }).transform(({ Items }) => ({ items: Items })),
]);
const cacheItemSchema = z.strictObject({
  title: z.string(),
  author: z.string(),
  publisherName: z.string(),
  isbn: z.string(),
  booksGenreId: z.string(),
  salesDate: z.string(),
  itemUrl: z.string().url(),
});
const cacheRecordSchema = z.strictObject({
  queryKey: z.string().min(1),
  queryTitle: z.string().min(1),
  sourceItemIds: z.array(z.string()).min(1),
  retrievedAt: z.string().date(),
  outcome: z.enum(["ok", "invalid-query"]),
  responseSha256: z.string().regex(/^[a-f0-9]{64}$/u),
  items: z.array(cacheItemSchema),
});
const cacheSchema = z.array(cacheRecordSchema);
const manifestSchema = z.strictObject({
  schemaVersion: z.literal(1),
  sourceName: z.literal("Rakuten Books Book Search API 2017-04-04"),
  documentationUrl: z.literal("https://webservice.rakuten.co.jp/documentation/books-book-search"),
  endpoint: z.literal(RAKUTEN_BOOKS_ENDPOINT),
  booksGenreId: z.literal("001001"),
  bookSize: z.literal(9),
  selectionPolicy: z.literal(SELECTION_POLICY),
  retrievedThrough: z.string().date(),
  queryCount: z.number().int().nonnegative(),
  sourceItemCount: z.number().int().nonnegative(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/u),
});

type CacheRecord = z.infer<typeof cacheRecordSchema>;
type TargetGroup = { queryKey: string; titles: string[]; sourceItemIds: string[] };

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function codeUnitCompare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function readCsv(path: string) {
  return z.array(z.record(z.string(), z.string())).parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      columns: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }),
  );
}

function isAdjudicationTarget(item: z.infer<typeof rawItemSchema>) {
  if (item.sourceId.startsWith("konomanga-")) return true;
  if (item.sourceId.startsWith("tsugimanga-") && item.sourceId.endsWith("-comics")) return true;
  if (item.sourceId.startsWith("shogakukan-manga-award-")) return true;
  if (item.sourceId.startsWith("nippan-bookseller-recommendations-")) return true;
  if (!item.sourceId.startsWith("mangataisho-")) return false;
  const year = Number(item.sourceId.slice(-4));
  return item.rawPublicationClass !== "一次選考作品リスト" || year <= 2015;
}

function loadTargetGroups(directory: string): TargetGroup[] {
  const sources = sourceRegistrySchema
    .array()
    .parse(readCsv(join(directory, "source-registry.csv")));
  const officialSourceIds = new Set(
    sources.filter((source) => source.sourceKind !== "community").map((source) => source.sourceId),
  );
  const groups = new Map<string, { titles: Set<string>; sourceItemIds: string[] }>();
  for (const item of rawItemSchema
    .array()
    .parse(readCsv(join(directory, "raw-source-items.csv")))) {
    if (
      item.rawTitle === "" ||
      !officialSourceIds.has(item.sourceId) ||
      !isAdjudicationTarget(item)
    ) {
      continue;
    }
    const queryKey = normalizeTitle(item.rawTitle).kanaFolded;
    const group = groups.get(queryKey) ?? { titles: new Set<string>(), sourceItemIds: [] };
    group.titles.add(item.rawTitle);
    group.sourceItemIds.push(item.sourceItemId);
    groups.set(queryKey, group);
  }
  return [...groups]
    .map(([queryKey, group]) => ({
      queryKey,
      titles: [...group.titles].sort(codeUnitCompare),
      sourceItemIds: group.sourceItemIds.sort(codeUnitCompare),
    }))
    .sort((left, right) => codeUnitCompare(left.queryKey, right.queryKey));
}

function loadCache(path: string): CacheRecord[] {
  try {
    const lines = readFileSync(path, "utf8").trim().split("\n").filter(Boolean);
    return cacheSchema.parse(lines.map((line) => JSON.parse(line) as unknown));
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
}

function assertCacheManifest(directory: string, records: CacheRecord[]) {
  const cacheBytes = readFileSync(join(directory, CACHE_FILE), "utf8");
  const manifest: z.infer<typeof manifestSchema> = manifestSchema.parse(
    JSON.parse(readFileSync(join(directory, MANIFEST_FILE), "utf8")) as unknown,
  );
  if (
    manifest.retrievedThrough !== RETRIEVED_AT ||
    manifest.queryCount !== records.length ||
    manifest.sourceItemCount !== new Set(records.flatMap((record) => record.sourceItemIds)).size ||
    manifest.sha256 !== sha256(cacheBytes)
  ) {
    throw new Error("Rakuten cache manifest is stale");
  }
}

function canonicalResponseItems(items: z.infer<typeof itemSchema>[]) {
  return items.map((item) => ({
    title: item.title,
    author: item.author,
    publisherName: item.publisherName,
    isbn: item.isbn,
    booksGenreId: item.booksGenreId,
    salesDate: item.salesDate ?? "",
    itemUrl: item.itemUrl,
  }));
}

function buildSearchUrl(title: string, credentials: RakutenCredentials) {
  const url = new URL(RAKUTEN_BOOKS_ENDPOINT);
  url.searchParams.set("applicationId", credentials.applicationId);
  url.searchParams.set("format", "json");
  url.searchParams.set("formatVersion", "2");
  url.searchParams.set("title", title);
  url.searchParams.set("size", "9");
  url.searchParams.set("booksGenreId", "001001");
  url.searchParams.set("hits", "30");
  url.searchParams.set("sort", "+releaseDate");
  url.searchParams.set("outOfStockFlag", "1");
  url.searchParams.set(
    "elements",
    ["title", "author", "publisherName", "isbn", "booksGenreId", "salesDate", "itemUrl"].join(","),
  );
  if (credentials.affiliateId !== undefined) {
    url.searchParams.set("affiliateId", credentials.affiliateId);
  }
  return url;
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

let lastRequestAt = 0;

async function searchRakuten(title: string, credentials: RakutenCredentials) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    await wait(Math.max(0, REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt)));
    lastRequestAt = Date.now();
    let response: Response;
    try {
      response = await fetch(buildSearchUrl(title, credentials), {
        headers: {
          accept: "application/json",
          accessKey: credentials.accessKey,
          origin: credentials.allowedOrigin,
          referer: `${credentials.allowedOrigin}/`,
          "user-agent": "konocomics-catalog-research/1.0",
        },
        signal: AbortSignal.timeout(30_000),
      });
    } catch (error: unknown) {
      if (attempt === 3) throw error;
      await wait(2 ** attempt * 1_000);
      continue;
    }
    if (response.ok) {
      const payload: unknown = await response.json();
      return {
        outcome: "ok" as const,
        items: canonicalResponseItems(responseSchema.parse(payload).items),
      };
    }
    if (response.status === 400) return { outcome: "invalid-query" as const, items: [] };
    if (response.status !== 429 && response.status < 500) {
      throw new Error(`Rakuten search failed for ${title}: HTTP ${response.status}`);
    }
    const retryAfter = Number(response.headers.get("retry-after"));
    await wait(
      Number.isFinite(retryAfter) ? Math.min(retryAfter * 1_000, 30_000) : 2 ** attempt * 1_000,
    );
  }
  throw new Error(`Rakuten search retries exhausted for ${title}`);
}

function writeCache(directory: string, records: CacheRecord[]) {
  const sorted = [...records].sort((left, right) => codeUnitCompare(left.queryKey, right.queryKey));
  const jsonl = `${sorted.map((record) => JSON.stringify(record)).join("\n")}\n`;
  const cachePath = join(directory, CACHE_FILE);
  const temporaryPath = `${cachePath}.tmp`;
  writeFileSync(temporaryPath, jsonl, "utf8");
  renameSync(temporaryPath, cachePath);
  const manifest = {
    schemaVersion: 1,
    sourceName: "Rakuten Books Book Search API 2017-04-04",
    documentationUrl: "https://webservice.rakuten.co.jp/documentation/books-book-search",
    endpoint: RAKUTEN_BOOKS_ENDPOINT,
    booksGenreId: "001001",
    bookSize: 9,
    selectionPolicy: SELECTION_POLICY,
    retrievedThrough: RETRIEVED_AT,
    queryCount: sorted.length,
    sourceItemCount: new Set(sorted.flatMap((record) => record.sourceItemIds)).size,
    sha256: sha256(jsonl),
  };
  writeFileSync(join(directory, MANIFEST_FILE), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

function assertCacheCoverage(groups: TargetGroup[], records: CacheRecord[]) {
  const byKey = new Map(records.map((record) => [record.queryKey, record]));
  if (byKey.size !== records.length) throw new Error("Rakuten cache has duplicate query keys");
  const missing = groups.filter((group) => !byKey.has(group.queryKey));
  if (missing.length > 0) {
    throw new Error(`Rakuten cache is missing ${missing.length} queries; run --write`);
  }
  if (byKey.size !== groups.length) {
    throw new Error("Rakuten cache contains queries outside the current source registry");
  }
  for (const group of groups) {
    const record = byKey.get(group.queryKey)!;
    if (
      !group.titles.includes(record.queryTitle) ||
      JSON.stringify(record.sourceItemIds) !== JSON.stringify(group.sourceItemIds) ||
      record.responseSha256 !==
        sha256(`${JSON.stringify({ outcome: record.outcome, items: record.items })}\n`)
    ) {
      throw new Error(`Rakuten cache record changed or is stale: ${group.queryKey}`);
    }
  }
}

export async function runRakutenExpansionCache(mode: "--check" | "--write", root = process.cwd()) {
  const directory = join(root, "data/staging/catalog-expansion");
  const groups = loadTargetGroups(directory);
  const records = loadCache(join(directory, CACHE_FILE));
  if (mode === "--check") {
    assertCacheCoverage(groups, records);
    assertCacheManifest(directory, records);
    return { queryCount: records.length, fetched: 0 };
  }

  const credentials = readRakutenCredentials();
  if (credentials === null) throw new Error("Rakuten credentials are unavailable");
  const targetKeys = new Set(groups.map((group) => group.queryKey));
  const byKey = new Map(
    records
      .filter((record) => targetKeys.has(record.queryKey))
      .map((record) => [record.queryKey, record]),
  );
  let fetched = 0;
  for (const [index, group] of groups.entries()) {
    const existing = byKey.get(group.queryKey);
    if (existing !== undefined) {
      existing.sourceItemIds = group.sourceItemIds;
      continue;
    }
    const result = await searchRakuten(group.titles[0]!, credentials);
    byKey.set(group.queryKey, {
      queryKey: group.queryKey,
      queryTitle: group.titles[0]!,
      sourceItemIds: group.sourceItemIds,
      retrievedAt: RETRIEVED_AT,
      outcome: result.outcome,
      responseSha256: sha256(`${JSON.stringify(result)}\n`),
      items: result.items,
    });
    fetched += 1;
    if (fetched % 10 === 0) writeCache(directory, [...byKey.values()]);
    if (fetched % 25 === 0) {
      console.log(
        `Rakuten cache progress: ${index + 1}/${groups.length} queries (${fetched} fetched).`,
      );
    }
  }
  writeCache(directory, [...byKey.values()]);
  assertCacheCoverage(groups, [...byKey.values()]);
  return { queryCount: groups.length, fetched };
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  const mode = process.argv[2];
  if (mode !== "--check" && mode !== "--write") {
    console.error(
      "Usage: node --env-file=.env --import tsx scripts/cache-rakuten-catalog-expansion.ts --check|--write",
    );
    process.exitCode = 1;
  } else {
    runRakutenExpansionCache(mode)
      .then(({ fetched, queryCount }) =>
        console.log(`Rakuten expansion cache: ${queryCount} queries; ${fetched} fetched.`),
      )
      .catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      });
  }
}
