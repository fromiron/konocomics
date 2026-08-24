import { createHash } from "node:crypto";
import {
  copyFileSync,
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

import { loadCatalogExpansion, validateCatalogExpansion } from "./validate-catalog-expansion";

const ARCHIVE_URL = "https://shogakukan-comic.jp/shogakukan-mangasho-archives";
const CURRENT_RESULTS_URL = "https://shogakukan-comic.jp/news/65082";
const RETRIEVED_AT = "2026-08-22";
const EXPECTED_ARCHIVE_ROUND_COUNT = 70;
const EXPECTED_ARCHIVE_ITEM_COUNT = 245;
const EXPECTED_CURRENT_ITEM_COUNT = 5;
const EXPECTED_LOGICAL_ITEM_COUNT = 276;
const EXPECTED_ARCHIVE_SHA256 = "bc0f54ca38042a2c801edfcc35c353e64fa084254771066a3c20b7443ce07588";
const EXPECTED_CURRENT_SHA256 = "e5cba919fef022cea1fd98a5ca298dffe989c6a41616c331a01ab66ccc3d3e60";

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
const RAW_HEADERS = [
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
const MEMBERSHIP_HEADERS = [
  "sourceItemId",
  "sourceId",
  "status",
  "candidateId",
  "workId",
  "decisionRef",
] as const;

const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const optionalIdSchema = z.union([z.literal(""), idSchema]);
const publishedAtSchema = z.string().regex(/^\d{4}(?:-\d{2}-\d{2})?$/u);
const countSchema = z.string().regex(/^\d+$/u);
const optionalCountSchema = z.string().regex(/^\d*$/u);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const officialUrlSchema = z
  .url()
  .refine(
    (value) => value === ARCHIVE_URL || value === CURRENT_RESULTS_URL,
    "Expected an approved Shogakukan award HTML URL",
  );
const htmlSchema = z.string().min(1);
const matrixSchema = z.array(z.array(z.string()));
const entryTypeSchema = z.enum([
  "work",
  "special-award-work",
  "special-award-non-work",
  "no-recipient",
]);
const awardItemSchema = z.strictObject({
  round: z.number().int().min(1).max(71),
  sourceRowNumber: z.number().int().positive(),
  entryType: entryTypeSchema,
  title: z.string().min(1),
  creator: z.string(),
  publication: z.string(),
});
const sourceRegistryRowSchema = z.strictObject({
  sourceId: idSchema,
  sourceKind: z.literal("award"),
  organization: z.string().min(1),
  title: z.string().min(1),
  url: officialUrlSchema,
  publishedAt: publishedAtSchema,
  retrievedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
  listNature: z.string().min(1),
  registryStatus: z.enum(["collecting", "adjudicating", "complete", "blocked"]),
  snapshotUrl: officialUrlSchema,
  snapshotSha256: sha256Schema,
  originalItemCount: countSchema,
  japaneseMangaItemCount: optionalCountSchema,
  excludedWebtoonCount: countSchema,
  excludedAdultCount: countSchema,
  excludedNonJapaneseCount: countSchema,
  excludedNonMangaCount: countSchema,
  duplicateCount: countSchema,
  canonicalMappingCount: countSchema,
  unresolvedCount: countSchema,
  notes: z.string(),
});
const rawRowSchema = z.strictObject({
  sourceItemId: idSchema,
  sourceId: idSchema,
  sourceRowNumber: z.string().regex(/^[1-9]\d*$/u),
  rawPublicationClass: entryTypeSchema,
  rawTitle: z.string().min(1),
  rawCreator: z.string(),
  rawMainGenre: z.string(),
  rawSubgenre: z.string(),
  rawRating: z.enum(["winner", "special-award", "no-recipient"]),
  rawNotes: z.string(),
  rawUpdatedAt: publishedAtSchema,
});
const membershipStatusSchema = z.enum([
  "included",
  "duplicate",
  "excluded-webtoon",
  "excluded-adult",
  "excluded-non-japanese",
  "excluded-non-manga",
  "unresolved",
]);
const membershipRowSchema = z.strictObject({
  sourceItemId: idSchema,
  sourceId: idSchema,
  status: membershipStatusSchema,
  candidateId: optionalIdSchema,
  workId: optionalIdSchema,
  decisionRef: optionalIdSchema,
});

export type ShogakukanAwardItem = z.infer<typeof awardItemSchema>;
type SourceRegistryRow = z.infer<typeof sourceRegistryRowSchema>;
type MembershipRow = z.infer<typeof membershipRowSchema>;
type ImportRows = { registry: string[][]; raw: string[][]; membership: string[][] };
type StagingRows = ImportRows & {
  paths: { registry: string; raw: string; membership: string };
};
type OpeningTag = { index: number; end: number };
type LogicalAwardItem = {
  item: ShogakukanAwardItem;
  title: string;
  publication: string;
};

const TARGET_SOURCE_IDS: ReadonlySet<string> = new Set(
  Array.from({ length: 71 }, (_, index) => sourceIdForRound(index + 1)),
);
const STATIC_REGISTRY_COLUMNS = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 20] as const;

function sourceIdForRound(round: number) {
  return `shogakukan-manga-award-${String(round).padStart(2, "0")}`;
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function zodMessage(error: z.ZodError) {
  return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
}

function decodeEntities(value: string) {
  return value
    .replace(/&#x([\da-f]+);/giu, (_, codePoint: string) =>
      String.fromCodePoint(Number.parseInt(codePoint, 16)),
    )
    .replace(/&#(\d+);/gu, (_, codePoint: string) =>
      String.fromCodePoint(Number.parseInt(codePoint, 10)),
    )
    .replace(/&nbsp;|&#160;/giu, " ")
    .replace(/&amp;|&#038;/giu, "&")
    .replace(/&quot;/giu, '"')
    .replace(/&apos;|&#39;/giu, "'")
    .replace(/&lt;/giu, "<")
    .replace(/&gt;/giu, ">");
}

function htmlText(value: string) {
  return decodeEntities(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, "")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, "")
      .replace(/<br\s*\/?>/giu, " ")
      .replace(/<[^>]+>/gu, " "),
  )
    .replace(/[\s\u3000]+/gu, " ")
    .trim();
}

function attributeValue(attributes: string, name: string) {
  const match = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "iu").exec(attributes);
  return match === null ? "" : decodeEntities(match[1] ?? match[2] ?? "");
}

function hasClass(attributes: string, className: string) {
  return attributeValue(attributes, "class").split(/\s+/u).includes(className);
}

function findOpeningTagByClass(
  html: string,
  classNames: readonly string[],
): OpeningTag | undefined {
  for (const match of html.matchAll(/<[a-z][a-z0-9]*\b([^>]*)>/giu)) {
    if (!classNames.some((className) => hasClass(match[1] ?? "", className))) continue;
    const index = match.index ?? 0;
    return { index, end: index + match[0].length };
  }
  return undefined;
}

function extractLabels(titleHtml: string) {
  const labels: string[] = [];
  const withoutLabels = titleHtml.replace(
    /<span\b([^>]*)>([\s\S]*?)<\/span>/giu,
    (span, attributes: string, body: string) => {
      if (hasClass(attributes, "list-wrap__label") || hasClass(attributes, "comic-date__zasshi")) {
        const label = htmlText(body).replace(/^（|）$/gu, "");
        if (label !== "") labels.push(label);
        return " ";
      }
      return span;
    },
  );
  return { labels, withoutLabels };
}

function entryTypeFor(title: string): z.infer<typeof entryTypeSchema> {
  if (/^該当(?:者|作)なし$/u.test(title)) return "no-recipient";
  if (!title.includes("特別賞")) return "work";
  if (
    title === "審査委員特別賞" ||
    title.includes("表紙イラスト") ||
    title.includes("原作活動に対して")
  ) {
    return "special-award-non-work";
  }
  return "special-award-work";
}

function parseArchiveListItem(fragment: string, round: number, sourceRowNumber: number) {
  const titleOpening = findOpeningTagByClass(fragment, ["list-wrap__title", "comic-date__title"]);
  if (titleOpening === undefined) {
    return awardItemSchema.parse({
      round,
      sourceRowNumber,
      entryType: entryTypeFor(htmlText(fragment)),
      title: htmlText(fragment),
      creator: "",
      publication: "",
    });
  }

  const authorOpening = findOpeningTagByClass(fragment.slice(titleOpening.end), [
    "list-wrap__author",
    "comic-date__author",
  ]);
  if (authorOpening === undefined) {
    throw new Error(`Shogakukan round ${round} row ${sourceRowNumber} has no creator field`);
  }
  const authorIndex = titleOpening.end + authorOpening.index;
  const { labels, withoutLabels } = extractLabels(fragment.slice(titleOpening.end, authorIndex));
  const title = htmlText(withoutLabels);
  return awardItemSchema.parse({
    round,
    sourceRowNumber,
    entryType: entryTypeFor(title),
    title,
    creator: htmlText(fragment.slice(titleOpening.end + authorOpening.end)),
    publication: labels.join(" | "),
  });
}

function listItems(html: string) {
  const openings = [...html.matchAll(/<li\b[^>]*>/giu)];
  return openings.map((opening, index) => {
    const start = (opening.index ?? 0) + opening[0].length;
    const end = openings[index + 1]?.index ?? html.length;
    return html.slice(start, end);
  });
}

export function extractShogakukanAwardArchive(input: string): ShogakukanAwardItem[] {
  const html = htmlSchema.parse(input);
  const headings = [...html.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/giu)]
    .map((match) => {
      const label = htmlText(match[1] ?? "");
      const roundMatch = /^第(\d+)回 小学館漫画賞受賞作品$/u.exec(label);
      if (roundMatch === null) return undefined;
      return {
        index: match.index ?? 0,
        end: (match.index ?? 0) + match[0].length,
        round: Number(roundMatch[1]),
      };
    })
    .filter((heading): heading is NonNullable<typeof heading> => heading !== undefined);
  const roundSet = new Set(headings.map((heading) => heading.round));
  if (headings.length !== EXPECTED_ARCHIVE_ROUND_COUNT || roundSet.size !== headings.length) {
    throw new Error(
      `Shogakukan archive round count changed: expected ${EXPECTED_ARCHIVE_ROUND_COUNT}, received ${headings.length}`,
    );
  }
  for (let round = 1; round <= EXPECTED_ARCHIVE_ROUND_COUNT; round += 1) {
    if (!roundSet.has(round)) throw new Error(`Shogakukan archive is missing round ${round}`);
  }

  const items: ShogakukanAwardItem[] = [];
  for (const [headingIndex, heading] of headings.entries()) {
    const nextHeading = headings[headingIndex + 1];
    const section = html.slice(heading.end, nextHeading?.index ?? html.length);
    const listOpening = findOpeningTagByClass(section, [
      "contents__work-list",
      "archive-list__item",
    ]);
    if (listOpening === undefined) {
      throw new Error(`Shogakukan archive round ${heading.round} has no award list`);
    }
    const listEndOffset = section.slice(listOpening.end).search(/<\/ul\s*>/iu);
    if (listEndOffset < 0) {
      throw new Error(`Shogakukan archive round ${heading.round} has no closing award list`);
    }
    const rows = listItems(section.slice(listOpening.end, listOpening.end + listEndOffset));
    if (rows.length === 0) {
      throw new Error(`Shogakukan archive round ${heading.round} has no award rows`);
    }
    items.push(...rows.map((row, index) => parseArchiveListItem(row, heading.round, index + 1)));
  }
  if (items.length !== EXPECTED_ARCHIVE_ITEM_COUNT) {
    throw new Error(
      `Shogakukan archive item count changed: expected ${EXPECTED_ARCHIVE_ITEM_COUNT}, received ${items.length}`,
    );
  }
  return items.sort(
    (left, right) => left.round - right.round || left.sourceRowNumber - right.sourceRowNumber,
  );
}

export function extractShogakukanCurrentResults(input: string): ShogakukanAwardItem[] {
  const html = htmlSchema.parse(input);
  const heading = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/giu)].find(
    (match) => htmlText(match[1] ?? "") === "第71回小学館漫画賞最終選考結果のお知らせ",
  );
  if (heading === undefined) throw new Error("Shogakukan round 71 result heading was not found");
  const resultScope = html.slice((heading.index ?? 0) + heading[0].length);
  const resultParagraph = [...resultScope.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/giu)].find((match) =>
    htmlText(match[1] ?? "").includes("作品名五十音順"),
  );
  if (resultParagraph === undefined) {
    throw new Error("Shogakukan round 71 work result paragraph was not found");
  }
  const lines = (resultParagraph[1] ?? "")
    .split(/<br\s*\/?>/giu)
    .map(htmlText)
    .filter((line) => line !== "" && !line.includes("作品名五十音順"));
  const items = lines.map((line, index) => {
    const match = /^『(.+)』(.+?)（(.+)）$/u.exec(line);
    if (match === null) throw new Error(`Invalid Shogakukan round 71 result row: ${line}`);
    return awardItemSchema.parse({
      round: 71,
      sourceRowNumber: index + 1,
      entryType: "work",
      title: `『${match[1]}』`,
      creator: match[2]?.trim(),
      publication: match[3]?.trim(),
    });
  });
  if (items.length !== EXPECTED_CURRENT_ITEM_COUNT) {
    throw new Error(
      `Shogakukan round 71 item count changed: expected ${EXPECTED_CURRENT_ITEM_COUNT}, received ${items.length}`,
    );
  }
  return items;
}

export function shogakukanCanonicalPayloadHash(items: readonly ShogakukanAwardItem[]) {
  return sha256(JSON.stringify(awardItemSchema.array().parse(items)));
}

function publishedAtForRound(round: number) {
  return round === 71 ? "2026-01-14" : String(1954 + round);
}

function ratingFor(entryType: ShogakukanAwardItem["entryType"]) {
  if (entryType === "no-recipient") return "no-recipient";
  return entryType.startsWith("special-award") ? "special-award" : "winner";
}

function registryNotes(round: number) {
  if (round === 71) {
    return "공식 결과 HTML의 수상 작품 5행을 문서 순서대로 보존; snapshot hash 범위는 제71회 작품 canonical extracted payload.";
  }
  return "공식 역대 수상 HTML의 회차별 li를 문서 순서대로 보존; snapshot hash 범위는 제1~70회 전체 canonical extracted payload; 비작품 특별상과 該当者なし도 unresolved raw로 보존.";
}

export function splitShogakukanAwardItem(item: ShogakukanAwardItem): LogicalAwardItem[] {
  if (item.entryType === "special-award-non-work" || item.entryType === "no-recipient") {
    return [
      {
        item,
        title: item.title.replaceAll("『", "").replaceAll("』", ""),
        publication: item.publication,
      },
    ];
  }
  const titles = [...item.title.matchAll(/『([^』]+)』|＜([^＞]+)＞/gu)].map(
    (match) => match[1] ?? match[2] ?? "",
  );
  if (titles.length === 0) {
    return [{ item, title: item.title, publication: item.publication }];
  }
  const publications = item.publication.split(" | ");
  return titles.map((title, index) => ({
    item,
    title,
    publication:
      publications.length === titles.length ? (publications[index] ?? "") : item.publication,
  }));
}

function buildRows(
  archiveItems: readonly ShogakukanAwardItem[],
  currentItems: readonly ShogakukanAwardItem[],
): ImportRows {
  const allItems = [...archiveItems, ...currentItems];
  const registry: string[][] = [];
  const raw: string[][] = [];
  const membership: string[][] = [];
  for (let round = 1; round <= 71; round += 1) {
    const items = allItems.filter((item) => item.round === round);
    if (items.length === 0) throw new Error(`Shogakukan round ${round} has no frozen items`);
    const logicalItems = items.flatMap(splitShogakukanAwardItem);
    const sourceId = sourceIdForRound(round);
    const url = round === 71 ? CURRENT_RESULTS_URL : ARCHIVE_URL;
    const snapshotSha256 = round === 71 ? EXPECTED_CURRENT_SHA256 : EXPECTED_ARCHIVE_SHA256;
    registry.push([
      sourceId,
      "award",
      "小学館「小学館漫画賞」",
      `第${round}回 小学館漫画賞受賞作品`,
      url,
      publishedAtForRound(round),
      RETRIEVED_AT,
      "공식 수상 기록",
      "adjudicating",
      url,
      snapshotSha256,
      String(logicalItems.length),
      "",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      String(logicalItems.length),
      registryNotes(round),
    ]);
    for (const [index, logical] of logicalItems.entries()) {
      const { item } = logical;
      const sourceRowNumber = index + 1;
      const sourceItemId = `${sourceId}-${String(sourceRowNumber).padStart(3, "0")}`;
      raw.push([
        sourceItemId,
        sourceId,
        String(sourceRowNumber),
        item.entryType,
        logical.title,
        item.creator,
        "",
        "",
        ratingFor(item.entryType),
        [
          `archiveRow=${item.sourceRowNumber}`,
          item.title === logical.title ? "" : `originalAwardTitle=${item.title}`,
          logical.publication === "" ? "" : `publication=${logical.publication}`,
          item.entryType === "special-award-non-work" || item.entryType === "no-recipient"
            ? "reviewHint=possible-excluded-non-manga"
            : "",
        ]
          .filter(Boolean)
          .join("; "),
        publishedAtForRound(round),
      ]);
      membership.push([sourceItemId, sourceId, "unresolved", "", "", ""]);
    }
  }
  return { registry, raw, membership };
}

async function fetchOfficialHtml(url: string, label: string) {
  officialUrlSchema.parse(url);
  const response = await fetch(url, {
    headers: { accept: "text/html" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`${label} fetch failed with HTTP ${response.status}`);
  officialUrlSchema.parse(response.url);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/html")) {
    throw new Error(`${label} returned unexpected content type: ${contentType || "missing"}`);
  }
  return htmlSchema.parse(await response.text());
}

export async function buildShogakukanMangaAwardImport() {
  const [archiveHtml, currentHtml] = await Promise.all([
    fetchOfficialHtml(ARCHIVE_URL, "Shogakukan award archive"),
    fetchOfficialHtml(CURRENT_RESULTS_URL, "Shogakukan round 71 results"),
  ]);
  const archiveItems = extractShogakukanAwardArchive(archiveHtml);
  const currentItems = extractShogakukanCurrentResults(currentHtml);
  const archiveDigest = shogakukanCanonicalPayloadHash(archiveItems);
  const currentDigest = shogakukanCanonicalPayloadHash(currentItems);
  if (archiveDigest !== EXPECTED_ARCHIVE_SHA256) {
    throw new Error(
      `Shogakukan archive payload drift: expected ${EXPECTED_ARCHIVE_SHA256}, received ${archiveDigest}`,
    );
  }
  if (currentDigest !== EXPECTED_CURRENT_SHA256) {
    throw new Error(
      `Shogakukan round 71 payload drift: expected ${EXPECTED_CURRENT_SHA256}, received ${currentDigest}`,
    );
  }
  const rows = buildRows(archiveItems, currentItems);
  if (
    rows.registry.length !== 71 ||
    rows.raw.length !== EXPECTED_LOGICAL_ITEM_COUNT ||
    rows.membership.length !== EXPECTED_LOGICAL_ITEM_COUNT
  ) {
    throw new Error("Built Shogakukan award rows are incomplete");
  }
  return { ...rows, archiveDigest, currentDigest };
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeRows(rows: readonly (readonly string[])[]) {
  return `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function serializeTable(headers: readonly string[], rows: readonly (readonly string[])[]) {
  return serializeRows([headers, ...rows]);
}

function readCsvRows(path: string, headers: readonly string[]) {
  const matrix = matrixSchema.parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }),
  );
  const [actualHeaders, ...rows] = matrix;
  if (actualHeaders === undefined || actualHeaders.join("\u0000") !== headers.join("\u0000")) {
    throw new Error(`Unexpected CSV header: ${path}`);
  }
  for (const [index, row] of rows.entries()) {
    if (row.length !== headers.length) {
      throw new Error(`Unexpected CSV column count: ${path}:${index + 2}`);
    }
  }
  return rows;
}

function readStagingRows(root: string): StagingRows {
  const directory = join(root, "data/staging/catalog-expansion");
  const paths = {
    registry: join(directory, "source-registry.csv"),
    raw: join(directory, "raw-source-items.csv"),
    membership: join(directory, "source-membership.csv"),
  };
  return {
    paths,
    registry: readCsvRows(paths.registry, SOURCE_REGISTRY_HEADERS),
    raw: readCsvRows(paths.raw, RAW_HEADERS),
    membership: readCsvRows(paths.membership, MEMBERSHIP_HEADERS),
  };
}

function parseRow<T>(
  row: readonly string[],
  headers: readonly string[],
  schema: z.ZodType<T>,
  label: string,
) {
  const result = schema.safeParse(
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])),
  );
  if (!result.success) throw new Error(`${label}: ${zodMessage(result.error)}`);
  return result.data;
}

function indexRows(rows: readonly string[][], keyColumn: number, label: string) {
  const indexed = new Map<string, string[]>();
  for (const row of rows) {
    const key = row[keyColumn] ?? "";
    if (indexed.has(key)) throw new Error(`Duplicate ${label}: ${key}`);
    indexed.set(key, row);
  }
  return indexed;
}

function assertSameKeys(
  actual: ReadonlyMap<string, string[]>,
  expected: ReadonlyMap<string, string[]>,
  label: string,
) {
  for (const key of expected.keys()) {
    if (!actual.has(key)) throw new Error(`Missing ${label}: ${key}`);
  }
  for (const key of actual.keys()) {
    if (!expected.has(key)) throw new Error(`Unexpected ${label}: ${key}`);
  }
}

function numeric(value: string) {
  return Number.parseInt(value, 10);
}

function checkSubset(staging: StagingRows, expected: ImportRows) {
  const expectedRegistry = indexRows(expected.registry, 0, "generated sourceId");
  const expectedRaw = indexRows(expected.raw, 0, "generated sourceItemId");
  const expectedMembership = indexRows(expected.membership, 0, "generated membership");
  const actualRegistry = indexRows(
    staging.registry.filter((row) => TARGET_SOURCE_IDS.has(row[0] ?? "")),
    0,
    "Shogakukan sourceId",
  );
  const actualRaw = indexRows(
    staging.raw.filter((row) => TARGET_SOURCE_IDS.has(row[1] ?? "")),
    0,
    "Shogakukan sourceItemId",
  );
  const actualMembership = indexRows(
    staging.membership.filter((row) => TARGET_SOURCE_IDS.has(row[1] ?? "")),
    0,
    "Shogakukan membership",
  );
  assertSameKeys(actualRegistry, expectedRegistry, "Shogakukan source");
  assertSameKeys(actualRaw, expectedRaw, "Shogakukan raw item");
  assertSameKeys(actualMembership, expectedMembership, "Shogakukan membership");

  const parsedSources: SourceRegistryRow[] = [];
  const parsedMemberships: MembershipRow[] = [];
  for (const [sourceId, expectedRow] of expectedRegistry) {
    const actualRow = actualRegistry.get(sourceId)!;
    const source = parseRow(
      actualRow,
      SOURCE_REGISTRY_HEADERS,
      sourceRegistryRowSchema,
      `Invalid source registry row ${sourceId}`,
    );
    for (const column of STATIC_REGISTRY_COLUMNS) {
      if (actualRow[column] !== expectedRow[column]) {
        throw new Error(
          `${sourceId}: source registry field ${SOURCE_REGISTRY_HEADERS[column]} changed`,
        );
      }
    }
    parsedSources.push(source);
  }
  for (const [sourceItemId, expectedRow] of expectedRaw) {
    const actualRow = actualRaw.get(sourceItemId)!;
    parseRow(actualRow, RAW_HEADERS, rawRowSchema, `Invalid raw item ${sourceItemId}`);
    if (actualRow.join("\u0000") !== expectedRow.join("\u0000")) {
      throw new Error(`Raw source item changed: ${sourceItemId}`);
    }
  }
  for (const [sourceItemId, expectedRow] of expectedMembership) {
    const actualRow = actualMembership.get(sourceItemId)!;
    const membership = parseRow(
      actualRow,
      MEMBERSHIP_HEADERS,
      membershipRowSchema,
      `Invalid membership ${sourceItemId}`,
    );
    if (membership.sourceId !== expectedRow[1]) {
      throw new Error(`Membership source changed: ${sourceItemId}`);
    }
    if (membership.status === "included" || membership.status === "duplicate") {
      if (membership.candidateId === "" || membership.decisionRef === "") {
        throw new Error(`Mapped membership is incomplete: ${sourceItemId}`);
      }
    } else if (membership.status === "unresolved") {
      if (
        membership.candidateId !== "" ||
        membership.workId !== "" ||
        membership.decisionRef !== ""
      ) {
        throw new Error(`Unresolved membership claims a decision: ${sourceItemId}`);
      }
    } else if (membership.workId !== "" || membership.decisionRef === "") {
      throw new Error(`Excluded membership is incomplete: ${sourceItemId}`);
    }
    parsedMemberships.push(membership);
  }

  for (const source of parsedSources) {
    const memberships = parsedMemberships.filter((row) => row.sourceId === source.sourceId);
    const statusCount = (status: MembershipRow["status"]) =>
      memberships.filter((row) => row.status === status).length;
    const mappedCandidates = new Set(
      memberships
        .filter((row) => row.status === "included" || row.status === "duplicate")
        .map((row) => row.candidateId),
    );
    const expectedCounts: Array<[string, number, number]> = [
      ["originalItemCount", numeric(source.originalItemCount), memberships.length],
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
    for (const [field, declared, actual] of expectedCounts) {
      if (declared !== actual) {
        throw new Error(`${source.sourceId}: ${field} is ${declared}, expected ${actual}`);
      }
    }
    if (source.registryStatus === "complete") {
      const japaneseMangaCount = statusCount("included") + statusCount("duplicate");
      if (
        source.japaneseMangaItemCount === "" ||
        numeric(source.japaneseMangaItemCount) !== japaneseMangaCount
      ) {
        throw new Error(`${source.sourceId}: invalid japaneseMangaItemCount`);
      }
    }
  }
}

function replaceTargetRows(
  rows: readonly string[][],
  expected: readonly string[][],
  sourceIdColumn: number,
) {
  return [...rows.filter((row) => !TARGET_SOURCE_IDS.has(row[sourceIdColumn] ?? "")), ...expected];
}

function preserveStableMemberships(staging: StagingRows, expected: ImportRows) {
  const currentRaw = indexRows(staging.raw, 0, "sourceItemId");
  const currentMemberships = indexRows(staging.membership, 0, "membership sourceItemId");
  return expected.membership.map((row, index) => {
    const expectedRaw = expected.raw[index];
    const previousRaw = currentRaw.get(row[0] ?? "");
    const previousMembership = currentMemberships.get(row[0] ?? "");
    if (
      expectedRaw === undefined ||
      previousRaw === undefined ||
      previousMembership === undefined ||
      previousRaw[4] !== expectedRaw[4] ||
      previousRaw[5] !== expectedRaw[5]
    ) {
      return row;
    }
    return previousMembership;
  });
}

function updateRegistryCounts(registry: readonly string[][], memberships: readonly string[][]) {
  return registry.map((row) => {
    const sourceMemberships = memberships.filter((membership) => membership[1] === row[0]);
    const count = (status: string) =>
      sourceMemberships.filter((membership) => membership[2] === status).length;
    const unresolved = count("unresolved");
    const mapped = sourceMemberships.filter(
      (membership) => membership[2] === "included" || membership[2] === "duplicate",
    );
    const next = [...row];
    next[8] = unresolved === 0 ? "complete" : "adjudicating";
    next[12] = unresolved === 0 ? String(mapped.length) : "";
    next[13] = String(count("excluded-webtoon"));
    next[14] = String(count("excluded-adult"));
    next[15] = String(count("excluded-non-japanese"));
    next[16] = String(count("excluded-non-manga"));
    next[17] = String(count("duplicate"));
    next[18] = String(new Set(mapped.map((membership) => membership[3])).size);
    next[19] = String(unresolved);
    return next;
  });
}

const STAGING_VALIDATION_FILES = [
  "source-registry.csv",
  "raw-source-items.csv",
  "candidates.csv",
  "source-membership.csv",
  "canonical-mapping.csv",
  "exclusions.csv",
  "safety-review.csv",
  "rakuten-matches.csv",
  "annotation-status.csv",
  "representative-volume-decisions.csv",
] as const;

function rewriteShogakukanRows(root: string, staging: StagingRows, expected: ImportRows) {
  const directory = join(root, "data/staging/catalog-expansion");
  const memberships = preserveStableMemberships(staging, expected);
  const registry = updateRegistryCounts(expected.registry, memberships);
  const tables = new Map([
    [
      "source-registry.csv",
      serializeTable(SOURCE_REGISTRY_HEADERS, replaceTargetRows(staging.registry, registry, 0)),
    ],
    [
      "raw-source-items.csv",
      serializeTable(RAW_HEADERS, replaceTargetRows(staging.raw, expected.raw, 1)),
    ],
    [
      "source-membership.csv",
      serializeTable(MEMBERSHIP_HEADERS, replaceTargetRows(staging.membership, memberships, 1)),
    ],
  ]);
  const original = new Map(
    [...tables.keys()].map((file) => [file, readFileSync(join(directory, file), "utf8")]),
  );
  const temporaryDirectory = mkdtempSync(join(dirname(directory), ".shogakukan-import-"));
  try {
    for (const file of STAGING_VALIDATION_FILES) {
      copyFileSync(join(directory, file), join(temporaryDirectory, file));
    }
    for (const [file, contents] of tables) {
      writeFileSync(join(temporaryDirectory, file), contents, "utf8");
    }
    validateCatalogExpansion(loadCatalogExpansion(temporaryDirectory));
    for (const [file, contents] of original) {
      if (readFileSync(join(directory, file), "utf8") !== contents) {
        throw new Error(`Concurrent staging change detected: ${file}`);
      }
    }
    for (const file of tables.keys()) {
      renameSync(join(temporaryDirectory, file), join(directory, file));
    }
  } finally {
    rmSync(temporaryDirectory, { force: true, recursive: true });
  }
}

export async function runShogakukanMangaAwardImport(
  mode: "--check" | "--write",
  root = process.cwd(),
) {
  const expected = await buildShogakukanMangaAwardImport();
  const staging = readStagingRows(root);
  if (mode === "--check") {
    checkSubset(staging, expected);
    return {
      appended: false,
      sourceCount: expected.registry.length,
      itemCount: expected.raw.length,
      archiveDigest: expected.archiveDigest,
      currentDigest: expected.currentDigest,
    };
  }
  rewriteShogakukanRows(root, staging, expected);
  return {
    appended: true,
    sourceCount: expected.registry.length,
    itemCount: expected.raw.length,
    archiveDigest: expected.archiveDigest,
    currentDigest: expected.currentDigest,
  };
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  const mode = process.argv[2];
  if (mode !== "--check" && mode !== "--write") {
    console.error("Usage: tsx scripts/import-shogakukan-manga-award.ts --check|--write");
    process.exitCode = 1;
  } else {
    runShogakukanMangaAwardImport(mode)
      .then(({ appended, archiveDigest, currentDigest, itemCount, sourceCount }) =>
        console.log(
          `Shogakukan Manga Award ${appended ? "appended" : "verified"}: ${sourceCount} sources / ${itemCount} items; archive=${archiveDigest}; round71=${currentDigest}.`,
        ),
      )
      .catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      });
  }
}
