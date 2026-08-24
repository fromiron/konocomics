import { createHash } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

const OFFICIAL_ORIGIN = "https://www.mangataisho.com";
const RETRIEVED_AT = "2026-08-22";
const EXPECTED_SOURCE_COUNT = 19;
const EXPECTED_ITEM_COUNT = 4_290;
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

const pageConfigSchema = z.strictObject({
  year: z.number().int().min(2008).max(2026),
  url: z.url().refine((value) => new URL(value).origin === OFFICIAL_ORIGIN),
  expectedSecondCount: z.number().int().nonnegative(),
  expectedFirstCount: z.number().int().positive(),
  snapshotSha256: z.string().regex(/^[a-f0-9]{64}$/u),
});

export const MANGATAISHO_PAGES = pageConfigSchema
  .array()
  .length(19)
  .parse([
    {
      year: 2008,
      url: "https://www.mangataisho.com/archives/2008.html",
      expectedSecondCount: 11,
      expectedFirstCount: 158,
      snapshotSha256: "240cb616d62797f3f58b443da86a052becf4212640ea8c607df88e1539c6baf4",
    },
    {
      year: 2009,
      url: "https://www.mangataisho.com/archives/2009.html",
      expectedSecondCount: 9,
      expectedFirstCount: 167,
      snapshotSha256: "18b6f5054a9bfb0e48dd9572cf38424af4fc0b6a617d101c9ae21e776aa89607",
    },
    {
      year: 2010,
      url: "https://www.mangataisho.com/archives/2010.html",
      expectedSecondCount: 9,
      expectedFirstCount: 190,
      snapshotSha256: "57e093fc1612b1e3612585e0af0e01ef15faaacb407fcbed35cf80b15f276e5f",
    },
    {
      year: 2011,
      url: "https://www.mangataisho.com/archives/2011.html",
      expectedSecondCount: 12,
      expectedFirstCount: 197,
      snapshotSha256: "e3c8292c53d198e507eded1a8b70dcded4c3619b01ab19426855cce4dedb1fb8",
    },
    {
      year: 2012,
      url: "https://www.mangataisho.com/archives/2012.html",
      expectedSecondCount: 14,
      expectedFirstCount: 187,
      snapshotSha256: "c6f9c3f5d96ef63ec13109105ed640439264f0701ecd80f04f24bbdd66205e0f",
    },
    {
      year: 2013,
      url: "https://www.mangataisho.com/archives/2013.html",
      expectedSecondCount: 10,
      expectedFirstCount: 222,
      snapshotSha256: "87d8f03b2d44ee8c1457fd0995ee0f95f1b78106c75364f3a69120b9fc3c7428",
    },
    {
      year: 2014,
      url: "https://www.mangataisho.com/archives/2014.html",
      expectedSecondCount: 9,
      expectedFirstCount: 213,
      snapshotSha256: "67736b796ceff45b77463db1c5ae0f603a91ab4fc41cff9a54dab069aa759bab",
    },
    {
      year: 2015,
      url: "https://www.mangataisho.com/archives/2015.html",
      expectedSecondCount: 13,
      expectedFirstCount: 219,
      snapshotSha256: "5bdc5d85c90418570d8d6acdb2661a2f4eff84768087d582422b77e35152fdf8",
    },
    {
      year: 2016,
      url: "https://www.mangataisho.com/archives/2016.html",
      expectedSecondCount: 10,
      expectedFirstCount: 215,
      snapshotSha256: "b20793f3e536a8c26cbd1fecd61967122d27ed81f10640df2c21fdd4df078d16",
    },
    {
      year: 2017,
      url: "https://www.mangataisho.com/archives/2017.html",
      expectedSecondCount: 12,
      expectedFirstCount: 235,
      snapshotSha256: "4ef4b5f15af410c1f7c8b6950aff0692b4b52091c52b4c5c76ece9974f72a20e",
    },
    {
      year: 2018,
      url: "https://www.mangataisho.com/archives/2018.html",
      expectedSecondCount: 11,
      expectedFirstCount: 239,
      snapshotSha256: "209427277e32de8a602579dcc5111bd253684e35df27a0cbb99ac57c1b66adbc",
    },
    {
      year: 2019,
      url: "https://www.mangataisho.com/archives/2019.html",
      expectedSecondCount: 12,
      expectedFirstCount: 231,
      snapshotSha256: "5bb326c1cd98853ce96ff31f25b80ebff957d13f689a6eed24ffba1101f4e134",
    },
    {
      year: 2020,
      url: "https://www.mangataisho.com/archives/2020.html",
      expectedSecondCount: 11,
      expectedFirstCount: 226,
      snapshotSha256: "b67dafdbb26be84614abfa879817c8a37947013099980f3f1894fa816a65407d",
    },
    {
      year: 2021,
      url: "https://www.mangataisho.com/archives/2021.html",
      expectedSecondCount: 9,
      expectedFirstCount: 206,
      snapshotSha256: "5fba3fb368911118774bf4668693de9686a7623f6079aef92457e24ea6b0aec5",
    },
    {
      year: 2022,
      url: "https://www.mangataisho.com/archives/2022.html",
      expectedSecondCount: 9,
      expectedFirstCount: 223,
      snapshotSha256: "5b972ae00ac9ae82bb192a271ff8c97394f48d42c7c4dc43f5889b619ecb1cef",
    },
    {
      year: 2023,
      url: "https://www.mangataisho.com/archives/2023.html",
      expectedSecondCount: 10,
      expectedFirstCount: 231,
      snapshotSha256: "4c717469e8b9122981ac35d109130c91024412c9ee4ef273e80deafdd71c1100",
    },
    {
      year: 2024,
      url: "https://www.mangataisho.com/archives/2024.html",
      expectedSecondCount: 9,
      expectedFirstCount: 247,
      snapshotSha256: "166b258e3071cd11f9e04125a3d1d4b663ee0ffdf1fe898530b4ef55979ba777",
    },
    {
      year: 2025,
      url: "https://www.mangataisho.com/archives/index.html",
      expectedSecondCount: 9,
      expectedFirstCount: 228,
      snapshotSha256: "64e7dcf6c53979bf9193ee75d27faa30fba4acdcb14ffa071c1317d5eb47aa52",
    },
    {
      year: 2026,
      url: "https://www.mangataisho.com/",
      expectedSecondCount: 11,
      expectedFirstCount: 237,
      snapshotSha256: "1212e6c4d02b0b7458d36dbe1096582cd6f123d655fa283e4fbb04b961cb6981",
    },
  ]);

const sectionSchema = z.enum(["大賞", "二次ノミネート", "一次選考作品リスト"]);
const itemSchema = z
  .strictObject({
    section: sectionSchema,
    rank: z.string(),
    rawText: z.string().min(1),
    title: z.string(),
    creator: z.string(),
    detailUrl: z.union([z.literal(""), z.url()]),
  })
  .superRefine((item, context) => {
    if (item.section === "大賞" && item.rank !== "大賞") {
      context.addIssue({ code: "custom", message: "Grand prize must retain its label" });
    }
    if (
      item.section === "二次ノミネート" &&
      item.rank !== "" &&
      !/^[０-９\d]+位$/u.test(item.rank)
    ) {
      context.addIssue({ code: "custom", message: "Nominee rank is not source-shaped" });
    }
    if (item.section === "一次選考作品リスト" && item.rank !== "") {
      context.addIssue({ code: "custom", message: "First-selection row cannot claim a rank" });
    }
  });
const canonicalPayloadSchema = z.strictObject({
  year: z.number().int().min(2008).max(2026),
  url: z.url().refine((value) => new URL(value).origin === OFFICIAL_ORIGIN),
  items: z.array(itemSchema).min(1),
});
const matrixSchema = z.array(z.array(z.string()));
const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const optionalIdSchema = z.union([z.literal(""), idSchema]);
const publishedAtSchema = z.string().regex(/^\d{4}(?:-\d{2}-\d{2})?$/u);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u);
const countSchema = z.string().regex(/^\d+$/u);
const optionalCountSchema = z.string().regex(/^\d*$/u);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const sourceRegistryRowSchema = z.strictObject({
  sourceId: idSchema,
  sourceKind: z.enum(["community", "award", "bookseller", "sales", "publisher", "editorial"]),
  organization: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
  publishedAt: publishedAtSchema,
  retrievedAt: dateSchema,
  listNature: z.string().min(1),
  registryStatus: z.enum(["collecting", "adjudicating", "complete", "blocked"]),
  snapshotUrl: z.url(),
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
  rawPublicationClass: sectionSchema,
  rawTitle: z.string(),
  rawCreator: z.string(),
  rawMainGenre: z.string(),
  rawSubgenre: z.string(),
  rawRating: z.string(),
  rawNotes: z.string().min(1),
  rawUpdatedAt: z.string().regex(/^\d{4}$/u),
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

type PageConfig = z.infer<typeof pageConfigSchema>;
type CanonicalItem = z.infer<typeof itemSchema>;
type CanonicalPayload = z.infer<typeof canonicalPayloadSchema>;
type MembershipRow = z.infer<typeof membershipRowSchema>;
type SourceRegistryRow = z.infer<typeof sourceRegistryRowSchema>;
type SourceSnapshot = { config: PageConfig; payload: CanonicalPayload };
type ImportRows = { registry: string[][]; raw: string[][]; membership: string[][] };
type StagingRows = ImportRows & {
  paths: { registry: string; raw: string; membership: string };
};

const TARGET_SOURCE_IDS: ReadonlySet<string> = new Set(
  MANGATAISHO_PAGES.map((page) => `mangataisho-${page.year}`),
);
const STATIC_REGISTRY_COLUMNS = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 20] as const;

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function zodMessage(error: z.ZodError) {
  return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
}

function decodeHtml(value: string) {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, "")
    .replace(/<br\s*\/?>/giu, " ")
    .replace(/<[^>]+>/gu, "")
    .replace(/&nbsp;|&#160;/giu, " ")
    .replace(/&amp;|&#038;/giu, "&")
    .replace(/&quot;/giu, '"')
    .replace(/&#39;|&apos;/giu, "'")
    .replace(/&lt;/giu, "<")
    .replace(/&gt;/giu, ">")
    .replace(/&#x([\da-f]+);/giu, (_, value: string) =>
      String.fromCodePoint(Number.parseInt(value, 16)),
    )
    .replace(/&#(\d+);/gu, (_, value: string) => String.fromCodePoint(Number(value)))
    .replace(/[\t\r\n ]+/gu, " ")
    .trim();
}

function parseWorkLabel(rawText: string) {
  const match = /^『([^』]+)』([\s\S]*)$/u.exec(rawText);
  return match === null
    ? { title: "", creator: "" }
    : { title: match[1]!.trim(), creator: match[2]!.trim() };
}

function extractDetailUrl(fragment: string, pageUrl: string) {
  const href = /<a\b[^>]*\bhref=(["'])(.*?)\1[^>]*>/iu.exec(fragment)?.[2];
  if (href === undefined) return "";
  const detailUrl = new URL(decodeHtml(href), pageUrl);
  if (detailUrl.protocol !== "https:" && detailUrl.protocol !== "http:") {
    throw new Error(`Unsupported detail URL protocol: ${detailUrl.protocol}`);
  }
  return detailUrl.href;
}

function buildItem(
  section: CanonicalItem["section"],
  rank: string,
  fragment: string,
  pageUrl: string,
): CanonicalItem {
  const rawText = decodeHtml(fragment);
  return {
    section,
    rank,
    rawText,
    ...parseWorkLabel(rawText),
    detailUrl: extractDetailUrl(fragment, pageUrl),
  };
}

function extractDivByClass(html: string, className: string) {
  const match = new RegExp(
    `<div\\b[^>]*class=(["'])${className}\\1[^>]*>([\\s\\S]*?)<\\/div>`,
    "iu",
  ).exec(html);
  if (match === null) throw new Error(`Missing official markup: ${className}`);
  return match[2]!;
}

function extractFirstSelection(html: string, className: string, pageUrl: string) {
  const container = extractDivByClass(html, className);
  return [...container.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/giu)].map((match) =>
    buildItem("一次選考作品リスト", "", match[1]!, pageUrl),
  );
}

function extractArchiveItems(html: string, pageUrl: string) {
  const items: CanonicalItem[] = [
    buildItem("大賞", "大賞", extractDivByClass(html, "ttl_maname"), pageUrl),
  ];
  for (const match of html.matchAll(/([０-９\d]+)位\s*:\s*<a\b([^>]*)>([\s\S]*?)<\/a>/giu)) {
    items.push(
      buildItem("二次ノミネート", `${match[1]}位`, `<a ${match[2]}>${match[3]}</a>`, pageUrl),
    );
  }
  items.push(...extractFirstSelection(html, "list_area", pageUrl));
  return items;
}

function extractCurrentItems(html: string, pageUrl: string) {
  const winnerTitle = decodeHtml(extractDivByClass(html, "name_taisho"));
  const winnerCreator = decodeHtml(extractDivByClass(html, "name_sakusya"));
  const items: CanonicalItem[] = [
    {
      section: "大賞",
      rank: "大賞",
      rawText: `${winnerTitle}\n${winnerCreator}`,
      ...parseWorkLabel(`${winnerTitle}${winnerCreator}`),
      detailUrl: extractDetailUrl(extractDivByClass(html, "img_taisho"), pageUrl),
    },
  ];
  for (const match of html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/giu)) {
    const fragment = match[1]!;
    if (!/class=(["'])list_ttl_nominate\1/iu.test(fragment)) continue;
    const title = decodeHtml(extractDivByClass(fragment, "list_ttl_nominate"));
    const creator = decodeHtml(extractDivByClass(fragment, "list_name_nominate"));
    items.push({
      section: "二次ノミネート",
      rank: "",
      rawText: `${title}\n${creator}`,
      ...parseWorkLabel(`${title}${creator}`),
      detailUrl: extractDetailUrl(fragment, pageUrl),
    });
  }
  items.push(...extractFirstSelection(html, "list_area_top", pageUrl));
  return items;
}

export function extractMangaTaishoPage(htmlInput: string, yearInput: number, urlInput: string) {
  const html = z.string().min(1).parse(htmlInput);
  const { url, year } = z
    .strictObject({
      year: z.number().int().min(2008).max(2026),
      url: z.url().refine((value) => new URL(value).origin === OFFICIAL_ORIGIN),
    })
    .parse({ year: yearInput, url: urlInput });
  const marker =
    year === 2026 ? `マンガ大賞${year} 大賞決定！` : `マンガ大賞${year}一次選考作品リスト`;
  if (!html.includes(marker)) throw new Error(`Manga Taisho ${year}: official year marker missing`);
  return canonicalPayloadSchema.parse({
    year,
    url,
    items: year === 2026 ? extractCurrentItems(html, url) : extractArchiveItems(html, url),
  });
}

async function fetchSource(config: PageConfig): Promise<SourceSnapshot> {
  const response = await fetch(config.url, {
    headers: { accept: "text/html" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`Manga Taisho ${config.year}: fetch failed with HTTP ${response.status}`);
  }
  if (new URL(response.url).origin !== OFFICIAL_ORIGIN) {
    throw new Error(`Manga Taisho ${config.year}: redirected outside the official origin`);
  }
  if (!response.headers.get("content-type")?.includes("text/html")) {
    throw new Error(`Manga Taisho ${config.year}: response is not HTML`);
  }
  const payload = extractMangaTaishoPage(await response.text(), config.year, config.url);
  const sectionCount = (section: CanonicalItem["section"]) =>
    payload.items.filter((item) => item.section === section).length;
  const expectedCount = 1 + config.expectedSecondCount + config.expectedFirstCount;
  if (
    payload.items.length !== expectedCount ||
    sectionCount("大賞") !== 1 ||
    sectionCount("二次ノミネート") !== config.expectedSecondCount ||
    sectionCount("一次選考作品リスト") !== config.expectedFirstCount
  ) {
    throw new Error(
      `Manga Taisho ${config.year}: expected 1/${config.expectedSecondCount}/${config.expectedFirstCount} rows by section`,
    );
  }
  const digest = sha256(JSON.stringify(payload));
  if (digest !== config.snapshotSha256) {
    throw new Error(
      `Manga Taisho ${config.year}: payload drift: expected ${config.snapshotSha256}, received ${digest}`,
    );
  }
  return { config, payload };
}

function rawNotes(config: PageConfig, item: CanonicalItem) {
  return JSON.stringify({
    officialYear: config.year,
    section: item.section,
    rank: item.rank,
    detailUrl: item.detailUrl,
    rawText: item.rawText,
  });
}

function buildRows(snapshots: readonly SourceSnapshot[]): ImportRows {
  const registry: string[][] = [];
  const raw: string[][] = [];
  const membership: string[][] = [];
  for (const { config, payload } of snapshots) {
    const sourceId = `mangataisho-${config.year}`;
    const itemCount = payload.items.length;
    registry.push([
      sourceId,
      "award",
      "マンガ大賞実行委員会",
      `マンガ大賞${config.year}`,
      config.url,
      String(config.year),
      RETRIEVED_AT,
      "공식 大賞·二次ノミネート·一次選考 작품 목록",
      "adjudicating",
      config.url,
      config.snapshotSha256,
      String(itemCount),
      "",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      String(itemCount),
      `공식 HTML 추출; 大賞 1건·二次ノミネート ${config.expectedSecondCount}건·一次選考作品リスト ${config.expectedFirstCount}건; hash 범위는 official year/url과 section/rank/rawText/title/creator/detailUrl; 원문 중복을 합치지 않고 모두 unresolved 유지.`,
    ]);
    for (const [index, item] of payload.items.entries()) {
      const sourceItemId = `${sourceId}-${String(index + 1).padStart(3, "0")}`;
      raw.push([
        sourceItemId,
        sourceId,
        String(index + 1),
        item.section,
        item.title,
        item.creator,
        "",
        "",
        item.rank,
        rawNotes(config, item),
        String(config.year),
      ]);
      membership.push([sourceItemId, sourceId, "unresolved", "", "", ""]);
    }
  }
  return { registry, raw, membership };
}

export async function buildMangaTaishoArchiveImport() {
  const configuredYears = MANGATAISHO_PAGES.map((page) => page.year);
  if (
    MANGATAISHO_PAGES.length !== EXPECTED_SOURCE_COUNT ||
    configuredYears.some((year, index) => year !== 2008 + index) ||
    MANGATAISHO_PAGES.reduce(
      (sum, page) => sum + 1 + page.expectedSecondCount + page.expectedFirstCount,
      0,
    ) !== EXPECTED_ITEM_COUNT
  ) {
    throw new Error("Frozen Manga Taisho source configuration is incomplete");
  }
  const snapshots: SourceSnapshot[] = [];
  for (const config of MANGATAISHO_PAGES) snapshots.push(await fetchSource(config));
  const rows = buildRows(snapshots);
  if (
    rows.registry.length !== EXPECTED_SOURCE_COUNT ||
    rows.raw.length !== EXPECTED_ITEM_COUNT ||
    rows.membership.length !== EXPECTED_ITEM_COUNT
  ) {
    throw new Error("Built Manga Taisho row count is incomplete");
  }
  return rows;
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeRows(rows: readonly (readonly string[])[]) {
  return `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
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
    "Manga Taisho sourceId",
  );
  const actualRaw = indexRows(
    staging.raw.filter((row) => TARGET_SOURCE_IDS.has(row[1] ?? "")),
    0,
    "Manga Taisho sourceItemId",
  );
  const actualMembership = indexRows(
    staging.membership.filter((row) => TARGET_SOURCE_IDS.has(row[1] ?? "")),
    0,
    "Manga Taisho membership",
  );
  assertSameKeys(actualRegistry, expectedRegistry, "Manga Taisho source");
  assertSameKeys(actualRaw, expectedRaw, "Manga Taisho raw item");
  assertSameKeys(actualMembership, expectedMembership, "Manga Taisho membership");

  const sources: SourceRegistryRow[] = [];
  const memberships: MembershipRow[] = [];
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
    sources.push(source);
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
    memberships.push(membership);
  }

  for (const source of sources) {
    const sourceMemberships = memberships.filter((row) => row.sourceId === source.sourceId);
    const statusCount = (status: MembershipRow["status"]) =>
      sourceMemberships.filter((row) => row.status === status).length;
    const mappedCandidates = new Set(
      sourceMemberships
        .filter((row) => row.status === "included" || row.status === "duplicate")
        .map((row) => row.candidateId),
    );
    const expectedCounts: Array<[string, number, number]> = [
      ["originalItemCount", numeric(source.originalItemCount), sourceMemberships.length],
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

function appendRows(path: string, rows: readonly string[][]) {
  const current = readFileSync(path, "utf8");
  appendFileSync(path, `${current.endsWith("\n") ? "" : "\n"}${serializeRows(rows)}`, "utf8");
}

function targetRowCount(staging: StagingRows) {
  return (
    staging.registry.filter((row) => TARGET_SOURCE_IDS.has(row[0] ?? "")).length +
    staging.raw.filter((row) => TARGET_SOURCE_IDS.has(row[1] ?? "")).length +
    staging.membership.filter((row) => TARGET_SOURCE_IDS.has(row[1] ?? "")).length
  );
}

function assertNoKeyCollisions(staging: StagingRows, expected: ImportRows) {
  const existingRegistry = indexRows(staging.registry, 0, "sourceId");
  const existingRaw = indexRows(staging.raw, 0, "sourceItemId");
  const existingMembership = indexRows(staging.membership, 0, "membership sourceItemId");
  for (const row of expected.registry) {
    if (existingRegistry.has(row[0]!)) throw new Error(`Source already exists: ${row[0]}`);
  }
  for (const row of expected.raw) {
    if (existingRaw.has(row[0]!)) throw new Error(`Raw item already exists: ${row[0]}`);
  }
  for (const row of expected.membership) {
    if (existingMembership.has(row[0]!)) throw new Error(`Membership already exists: ${row[0]}`);
  }
}

export async function runMangaTaishoArchiveImport(
  mode: "--check" | "--write",
  root = process.cwd(),
) {
  const expected = await buildMangaTaishoArchiveImport();
  const staging = readStagingRows(root);
  if (mode === "--check") {
    checkSubset(staging, expected);
    return {
      appended: false,
      sourceCount: expected.registry.length,
      itemCount: expected.raw.length,
    };
  }
  if (targetRowCount(staging) > 0) {
    checkSubset(staging, expected);
    return {
      appended: false,
      sourceCount: expected.registry.length,
      itemCount: expected.raw.length,
    };
  }
  assertNoKeyCollisions(staging, expected);
  appendRows(staging.paths.registry, expected.registry);
  appendRows(staging.paths.raw, expected.raw);
  appendRows(staging.paths.membership, expected.membership);
  return { appended: true, sourceCount: expected.registry.length, itemCount: expected.raw.length };
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  const mode = process.argv[2];
  if (mode !== "--check" && mode !== "--write") {
    console.error("Usage: tsx scripts/import-mangataisho-archive.ts --check|--write");
    process.exitCode = 1;
  } else {
    runMangaTaishoArchiveImport(mode)
      .then(({ appended, itemCount, sourceCount }) =>
        console.log(
          `Manga Taisho ${appended ? "appended" : "verified"}: ${sourceCount} sources / ${itemCount} items.`,
        ),
      )
      .catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      });
  }
}
