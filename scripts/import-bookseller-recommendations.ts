import { createHash } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

const DISCOVERY_URL = "https://hon-hikidashi.jp/news/107527/";
const RETRIEVED_AT = "2026-08-22";
const FIRST_YEAR = 2006;
const LAST_YEAR = 2026;
const EXPECTED_SOURCE_COUNT = LAST_YEAR - FIRST_YEAR + 1;
const EXPECTED_ITEM_COUNT = 272;

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

type ParserKind = "table" | "image-map" | "structured-list" | "article-headings";
type SourceConfig = {
  sourceId: string;
  year: number;
  snapshotUrl: string;
  parser: ParserKind;
  count: number;
  sha256: string;
};

const SOURCE_CONFIGS: readonly SourceConfig[] = [
  {
    sourceId: "nippan-bookseller-recommendations-2006",
    year: 2006,
    snapshotUrl: "https://hon-hikidashi.jp/event/104714/",
    parser: "table",
    count: 3,
    sha256: "5e9b21696ec7cfe26ed2ceae0c636942e39cc0e5bd12948891a1f657215974dc",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2007",
    year: 2007,
    snapshotUrl: "https://hon-hikidashi.jp/event/104741/",
    parser: "table",
    count: 5,
    sha256: "abb6779b600a56b78d9a6892a84754e247c4ccac65ef1237f1f00935b887c776",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2008",
    year: 2008,
    snapshotUrl: "https://hon-hikidashi.jp/event/104752/",
    parser: "table",
    count: 4,
    sha256: "2a90d9837124d4462a5cadbbac78a04d8ffea219ea1e32a56841503a33dac7ad",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2009",
    year: 2009,
    snapshotUrl: "https://hon-hikidashi.jp/event/104760/",
    parser: "table",
    count: 5,
    sha256: "b1b625e85cdc709b6ac5150d90bb03cceda10ae6ce8e53fe402ba5cd68f47686",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2010",
    year: 2010,
    snapshotUrl: "https://hon-hikidashi.jp/event/104773/",
    parser: "table",
    count: 15,
    sha256: "0737a41a49250ecc701011d1bd793fe1688e704ff6788408068472c82c3a3c9a",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2011",
    year: 2011,
    snapshotUrl: "https://hon-hikidashi.jp/event/105000/",
    parser: "table",
    count: 15,
    sha256: "1fffdf160b271653fd2cf610a16ec87cf6fa6897d252febb7a4037825795b641",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2012",
    year: 2012,
    snapshotUrl: "https://hon-hikidashi.jp/event/105008/",
    parser: "table",
    count: 15,
    sha256: "ab557a7b8060b4733abe65afe70f20a618bf7d29b854299323490938c9eede33",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2013",
    year: 2013,
    snapshotUrl: "https://www.honyaclub.com/shop/pages/osusume.aspx",
    parser: "image-map",
    count: 15,
    sha256: "b067f0ec0ee96e00fc737c5687b009ea23d2990b1aa3feeb144d18a01aa422b9",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2014",
    year: 2014,
    snapshotUrl: "https://www.honyaclub.com/shop/pages/osusume_comic2014.aspx?affiliate=osusumec14",
    parser: "image-map",
    count: 15,
    sha256: "b7f321101bbbf71edc08a638b7d3a5fdb3ead15c263d35caa9a2df003a0eee6e",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2015",
    year: 2015,
    snapshotUrl: "https://www.honyaclub.com/shop/pages/osusume_comic2015.aspx?affiliate=osusumec",
    parser: "image-map",
    count: 15,
    sha256: "3d3eb43fd7709dd0c7e1930f0571a8e3b5ba1fa898b43b9f2a995e63692944c8",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2016",
    year: 2016,
    snapshotUrl: "https://www.honyaclub.com/shop/pages/osusumecomic2016.aspx?affiliate=osusumec16",
    parser: "structured-list",
    count: 15,
    sha256: "6472a9c053c5dc7ce69f7cb29163b7cb56483ce77fb2303e21a9ee49ebb82c18",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2017",
    year: 2017,
    snapshotUrl: "https://www.honyaclub.com/shop/pages/osusumecomic2017.aspx?affiliate=osusumec17",
    parser: "structured-list",
    count: 15,
    sha256: "9ed3b3628f3ea5fbf5313f599973b0501e99d7a6985aa874417c9e4bbe3d8711",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2018",
    year: 2018,
    snapshotUrl: "https://www.honyaclub.com/shop/pages/osusumecomic2018.aspx?affiliate=osusumec18",
    parser: "structured-list",
    count: 15,
    sha256: "5be25b7a99987fe404be3249011b4681c9bd6dcc333b69e23c80a6b70fe8fd3e",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2019",
    year: 2019,
    snapshotUrl: "https://www.honyaclub.com/shop/pages/osusumecomic2019.aspx",
    parser: "structured-list",
    count: 15,
    sha256: "7ce13e58446f4a904d5697876ca202d7639084e66af50eb8bb7200c44d2a1667",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2020",
    year: 2020,
    snapshotUrl: "https://hon-hikidashi.jp/event/105418/",
    parser: "table",
    count: 15,
    sha256: "9b4c1bfc2f17c2d9d0b482b2bfb74bba7fad3e5c29a21ca7f52fb7633e00eba0",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2021",
    year: 2021,
    snapshotUrl: "https://hon-hikidashi.jp/event/105449/",
    parser: "table",
    count: 15,
    sha256: "3aca739be58d9b71d9522294249afbca547e8ec211bdaedf17b1c740562f01f9",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2022",
    year: 2022,
    snapshotUrl: "https://hon-hikidashi.jp/event/10708/",
    parser: "article-headings",
    count: 15,
    sha256: "e143ca84a7cae4eb7740c20d6b88ffb60dfa7a27498f1022c8858e590eef4c5f",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2023",
    year: 2023,
    snapshotUrl: "https://hon-hikidashi.jp/event/228/",
    parser: "article-headings",
    count: 15,
    sha256: "b664c7715c0a2f93f0e0a730284854eb1dc31ed090445d6d5d8fa8d0a94bc5c9",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2024",
    year: 2024,
    snapshotUrl: "https://hon-hikidashi.jp/event/28229/",
    parser: "article-headings",
    count: 15,
    sha256: "351efccb6bc3a6285f8a0a821a7af85ad322bcbe4930d5b49926ce1b5c713773",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2025",
    year: 2025,
    snapshotUrl: "https://hon-hikidashi.jp/event/51345/",
    parser: "article-headings",
    count: 15,
    sha256: "9afaaf48cea1f42ae09d1c56d27d41d425e817c7b8595f42ad96be368fbec64a",
  },
  {
    sourceId: "nippan-bookseller-recommendations-2026",
    year: 2026,
    snapshotUrl: "https://hon-hikidashi.jp/event/95563/",
    parser: "article-headings",
    count: 15,
    sha256: "ab9d4cc620e610ed5346f839b3b15fcbccbb5e12c7b6493963b352ca11690239",
  },
];

const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const optionalIdSchema = z.union([z.literal(""), idSchema]);
const publishedAtSchema = z.string().regex(/^\d{4}(?:-\d{2}-\d{2})?$/u);
const countSchema = z.string().regex(/^\d+$/u);
const optionalCountSchema = z.string().regex(/^\d*$/u);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const htmlSchema = z.string().min(1);
const matrixSchema = z.array(z.array(z.string()));
const parserKindSchema = z.enum(["table", "image-map", "structured-list", "article-headings"]);

function isOfficialPageUrl(value: string) {
  const parsed = new URL(value);
  return (
    parsed.protocol === "https:" &&
    (parsed.hostname === "hon-hikidashi.jp" || parsed.hostname === "www.honyaclub.com")
  );
}

function isOfficialDetailUrl(value: string) {
  const parsed = new URL(value);
  return (
    (parsed.protocol === "http:" || parsed.protocol === "https:") &&
    (parsed.hostname === "hon-hikidashi.jp" || parsed.hostname === "www.honyaclub.com")
  );
}

const officialPageUrlSchema = z
  .url()
  .refine(isOfficialPageUrl, "Expected an approved official page");
const officialDetailUrlSchema = z
  .url()
  .refine(isOfficialDetailUrl, "Expected an official Hon no Hikidashi or Honya Club URL");
const sourceConfigSchema = z.strictObject({
  sourceId: idSchema,
  year: z.number().int().min(FIRST_YEAR).max(LAST_YEAR),
  snapshotUrl: officialPageUrlSchema,
  parser: parserKindSchema,
  count: z.number().int().positive(),
  sha256: sha256Schema,
});
const rankingItemSchema = z.strictObject({
  year: z.number().int().min(FIRST_YEAR).max(LAST_YEAR),
  rank: z.number().int().min(1).max(15).nullable(),
  title: z.string().min(1),
  creator: z.string(),
  detailUrl: officialDetailUrlSchema,
});
const discoverySchema = z.strictObject({
  history: z.array(
    z.strictObject({
      year: z
        .number()
        .int()
        .min(FIRST_YEAR)
        .max(LAST_YEAR - 1),
      url: officialPageUrlSchema,
    }),
  ),
  currentDetailUrl: officialPageUrlSchema,
});
const sourceRegistryRowSchema = z.strictObject({
  sourceId: idSchema,
  sourceKind: z.literal("bookseller"),
  organization: z.string().min(1),
  title: z.string().min(1),
  url: officialPageUrlSchema,
  publishedAt: publishedAtSchema,
  retrievedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
  listNature: z.string().min(1),
  registryStatus: z.enum(["collecting", "adjudicating", "complete", "blocked"]),
  snapshotUrl: officialPageUrlSchema,
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
  rawPublicationClass: z.literal("general-ranking"),
  rawTitle: z.string().min(1),
  rawCreator: z.string(),
  rawMainGenre: z.string(),
  rawSubgenre: z.string(),
  rawRating: z.string().min(1),
  rawNotes: z.string().min(1),
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

export type BooksellerRecommendation = z.infer<typeof rankingItemSchema>;
type SourceRegistryRow = z.infer<typeof sourceRegistryRowSchema>;
type MembershipRow = z.infer<typeof membershipRowSchema>;
type ImportRows = { registry: string[][]; raw: string[][]; membership: string[][] };
type StagingRows = ImportRows & {
  paths: { registry: string; raw: string; membership: string };
};
type OpeningTag = { index: number; end: number };

const CONFIGS = sourceConfigSchema.array().parse(SOURCE_CONFIGS);
const TARGET_SOURCE_IDS: ReadonlySet<string> = new Set(CONFIGS.map((config) => config.sourceId));
const STATIC_REGISTRY_COLUMNS = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 20] as const;

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

function classes(attributes: string) {
  return attributeValue(attributes, "class").split(/\s+/u);
}

function hasClass(attributes: string, className: string) {
  return classes(attributes).includes(className);
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

function sourceDetailUrl(href: string, pageUrl: string) {
  const trimmed = href.trim();
  const resolved = /^https?:\/\//iu.test(trimmed) ? trimmed : new URL(trimmed, pageUrl).href;
  return officialDetailUrlSchema.parse(resolved);
}

function decodeShiftJisQueryComponent(value: string) {
  let decoded = "";
  let bytes: number[] = [];
  const decoder = new TextDecoder("shift_jis", { fatal: true });
  const flush = () => {
    if (bytes.length === 0) return;
    decoded += decoder.decode(Uint8Array.from(bytes));
    bytes = [];
  };
  for (let index = 0; index < value.length;) {
    const percent = /^%([\da-f]{2})/iu.exec(value.slice(index));
    if (percent !== null) {
      bytes.push(Number.parseInt(percent[1] ?? "", 16));
      index += 3;
      continue;
    }
    const character = value[index] ?? "";
    const codePoint = character.codePointAt(0) ?? 0;
    if (codePoint <= 0x7f) {
      bytes.push(character === "+" ? 0x20 : codePoint);
    } else {
      flush();
      decoded += character;
    }
    index += character.length;
  }
  flush();
  return decoded.replace(/[\s\u3000]+/gu, " ").trim();
}

function legacyQueryValue(href: string, name: string) {
  const query = (href.split("?")[1] ?? "").split("#")[0] ?? "";
  const pair = query.split("&").find((entry) => entry.split("=")[0] === name);
  if (pair === undefined) return "";
  try {
    return decodeShiftJisQueryComponent(pair.split("=").slice(1).join("="));
  } catch {
    return "";
  }
}

function parseTableRanking(html: string, year: number, pageUrl: string) {
  const heading = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/giu)].find((match) =>
    htmlText(match[1] ?? "").includes("ランキング一覧はこちら"),
  );
  if (heading === undefined) throw new Error(`${year}: ranking table heading was not found`);
  const remaining = html.slice((heading.index ?? 0) + heading[0].length);
  const table = /<table\b[^>]*>([\s\S]*?)<\/table>/iu.exec(remaining);
  if (table === null) throw new Error(`${year}: ranking table was not found`);

  const items: BooksellerRecommendation[] = [];
  for (const row of (table[1] ?? "").matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/giu)) {
    const cells = [...(row[1] ?? "").matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/giu)].map((cell) =>
      htmlText(cell[1] ?? ""),
    );
    if (cells.length === 0 || cells[0] === "順位" || cells[0] === "タイトル") continue;
    const rankMatch = /^第(\d+)位$/u.exec(cells[0] ?? "");
    const ranked = rankMatch !== null;
    items.push(
      rankingItemSchema.parse({
        year,
        rank: ranked ? Number(rankMatch[1]) : null,
        title: cells[ranked ? 1 : 0] ?? "",
        creator: cells[ranked ? 3 : 2] ?? "",
        detailUrl: pageUrl,
      }),
    );
  }
  return items;
}

function parseImageMapRanking(html: string, year: number, pageUrl: string) {
  const byRank = new Map<number, BooksellerRecommendation>();
  for (const match of html.matchAll(/<area\b([^>]*)>/giu)) {
    const attributes = match[1] ?? "";
    const alt = attributeValue(attributes, "alt");
    const href = attributeValue(attributes, "href");
    let rank: number | undefined;
    let title = "";
    let creator = "";
    if (year === 2015) {
      const parts = alt.split("/");
      const rankMatch = /^(\d+)位$/u.exec(parts[0] ?? "");
      if (rankMatch === null) continue;
      rank = Number(rankMatch[1]);
      title = (parts[1] ?? "").trim();
      creator = (parts[2] ?? "").trim();
    } else {
      const rankMatch = /^(\d+)位\s+(.+?)(?:\s+ご購入はこちらから)?$/u.exec(alt);
      if (rankMatch === null) continue;
      rank = Number(rankMatch[1]);
      title = (rankMatch[2] ?? "").trim();
      creator = legacyQueryValue(href, "aut_n");
    }
    if (rank < 1 || rank > 15 || byRank.has(rank)) continue;
    byRank.set(
      rank,
      rankingItemSchema.parse({
        year,
        rank,
        title,
        creator,
        detailUrl: sourceDetailUrl(href, pageUrl),
      }),
    );
  }
  return [...byRank.values()].sort((left, right) => (left.rank ?? 0) - (right.rank ?? 0));
}

function firstOfficialAnchor(fragment: string, pageUrl: string) {
  const match = /<a\b([^>]*)>/iu.exec(fragment);
  if (match === null) return pageUrl;
  const href = attributeValue(match[1] ?? "", "href");
  return href === "" ? pageUrl : sourceDetailUrl(href, pageUrl);
}

function parseStructuredListItem(fragment: string, year: number, pageUrl: string, rank: number) {
  let title = "";
  let creator = "";
  const name = /<[^>]+\bitemprop=["']name["'][^>]*>([\s\S]*?)<\/[^>]+>/iu.exec(fragment);
  const author = /<[^>]+\bitemprop=["']author["'][^>]*>([\s\S]*?)<\/[^>]+>/iu.exec(fragment);
  if (name !== null && author !== null) {
    title = htmlText(name[1] ?? "");
    creator = htmlText(author[1] ?? "");
  } else {
    const paragraphs = [...fragment.matchAll(/<(?:h2|p)\b([^>]*)>([\s\S]*?)<\/(?:h2|p)>/giu)];
    const titleIndex = paragraphs.findIndex((paragraph) => {
      const paragraphClasses = classes(paragraph[1] ?? "");
      return paragraphClasses.includes(year === 2016 ? "comic_title" : "title");
    });
    if (titleIndex >= 0) {
      const titleText = htmlText(paragraphs[titleIndex]?.[2] ?? "");
      const split = titleText.split(/\s*\/\s*/u, 2);
      title = split[0] ?? "";
      creator = split[1] ?? "";
      if (creator === "") {
        const explicitAuthor = paragraphs.find((paragraph) =>
          classes(paragraph[1] ?? "").includes("comic_author"),
        );
        const followingAuthor = paragraphs.slice(titleIndex + 1).find((paragraph) => {
          const paragraphClasses = classes(paragraph[1] ?? "");
          return (
            !paragraphClasses.includes("comment") &&
            !paragraphClasses.includes("comic_comment") &&
            !paragraphClasses.includes("btn") &&
            !paragraphClasses.includes("comic_btn") &&
            !paragraphClasses.includes("title")
          );
        });
        creator = htmlText(explicitAuthor?.[2] ?? followingAuthor?.[2] ?? "");
      }
    }
  }
  return rankingItemSchema.parse({
    year,
    rank,
    title,
    creator,
    detailUrl: firstOfficialAnchor(fragment, pageUrl),
  });
}

function parseStructuredListRanking(html: string, year: number, pageUrl: string) {
  const startPattern =
    year === 2016 ? /<ul\b[^>]*class=["'][^"']*comic_top/iu : /<h2\b[^>]*class=["'][^"']*rank1/iu;
  const start = html.search(startPattern);
  if (start < 0) throw new Error(`${year}: general ranking start was not found`);
  let scope = html.slice(start);
  const boundaries = [
    /<h2\b[^>]*id=["']webrank["']/iu,
    /<h2\b[^>]*id=["']presentcp["']/iu,
    /<!--\s*Webマンガ ランキング/iu,
    /<!--\s*\/content4/iu,
  ];
  let end = scope.length;
  for (const boundary of boundaries) {
    const index = scope.search(boundary);
    if (index >= 0 && index < end) end = index;
  }
  scope = scope.slice(0, end);

  const items: BooksellerRecommendation[] = [];
  for (const list of scope.matchAll(/<ul\b([^>]*)>([\s\S]*?)<\/ul>/giu)) {
    const listClasses = classes(list[1] ?? "");
    const isRankingList = listClasses.some((className) =>
      ["comic_top", "comic_list", "grandprix-contents03", "grandprix-goodsList"].includes(
        className,
      ),
    );
    if (!isRankingList) continue;
    for (const item of (list[2] ?? "").matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/giu)) {
      items.push(parseStructuredListItem(item[1] ?? "", year, pageUrl, items.length + 1));
    }
  }
  return items;
}

function parseArticleHeadingRanking(html: string, year: number, pageUrl: string) {
  const articleStart = html.indexOf('<div class="article__contents">');
  let scope = articleStart < 0 ? html : html.slice(articleStart);
  const publisherHeading = [...scope.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/giu)].find(
    (heading) => htmlText(heading[1] ?? "").includes("出版社コミック担当が選んだ"),
  );
  if (publisherHeading !== undefined)
    scope = scope.slice(0, publisherHeading.index ?? scope.length);

  const headings = [...scope.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/giu)]
    .map((heading) => ({
      index: heading.index ?? 0,
      end: (heading.index ?? 0) + heading[0].length,
      label: htmlText(heading[1] ?? ""),
    }))
    .filter((heading) => /^第\s*\d+\s*位/u.test(heading.label));
  const byRank = new Map<number, BooksellerRecommendation>();
  for (const [headingIndex, heading] of headings.entries()) {
    const parsedHeading = /^第\s*(\d+)\s*位[\s　]*『([\s\S]+?)』/u.exec(heading.label);
    if (parsedHeading === null) continue;
    const rank = Number(parsedHeading[1]);
    if (rank < 1 || rank > 15 || byRank.has(rank)) continue;
    const segment = scope.slice(heading.end, headings[headingIndex + 1]?.index ?? scope.length);
    const cardOpening = findOpeningTagByClass(segment, ["honyaclub"]);
    const card = cardOpening === undefined ? "" : segment.slice(cardOpening.index);
    const author = [...card.matchAll(/<dd\b[^>]*>([\s\S]*?)<\/dd>/giu)]
      .map((match) => htmlText(match[1] ?? ""))
      .find((value) => /^著者[：:]/u.test(value));
    byRank.set(
      rank,
      rankingItemSchema.parse({
        year,
        rank,
        title: (parsedHeading[2] ?? "").trim(),
        creator: (author ?? "").replace(/^著者[：:]\s*/u, "").trim(),
        detailUrl: card === "" ? pageUrl : firstOfficialAnchor(card, pageUrl),
      }),
    );
  }
  return [...byRank.values()].sort((left, right) => (left.rank ?? 0) - (right.rank ?? 0));
}

function validateYearItems(items: readonly BooksellerRecommendation[], config: SourceConfig) {
  const parsed = rankingItemSchema.array().parse(items);
  if (parsed.length !== config.count) {
    throw new Error(
      `${config.year}: expected ${config.count} general results, received ${parsed.length}`,
    );
  }
  if (parsed.some((item) => item.year !== config.year)) {
    throw new Error(`${config.year}: extracted item has the wrong year`);
  }
  if (config.year <= 2009) {
    if (parsed.some((item) => item.rank !== null)) {
      throw new Error(`${config.year}: source list did not publish ranks`);
    }
  } else {
    const ranks = new Set(parsed.map((item) => item.rank));
    for (let rank = 1; rank <= 15; rank += 1) {
      if (!ranks.has(rank))
        throw new Error(`${config.year}: general ranking is missing rank ${rank}`);
    }
    if (ranks.size !== 15) throw new Error(`${config.year}: general ranking has duplicate ranks`);
  }
  return parsed;
}

export function extractBooksellerRecommendations(
  input: string,
  year: number,
  pageUrl: string,
): BooksellerRecommendation[] {
  const html = htmlSchema.parse(input);
  const config = CONFIGS.find((candidate) => candidate.year === year);
  if (config === undefined) throw new Error(`Unsupported bookseller recommendation year: ${year}`);
  officialPageUrlSchema.parse(pageUrl);
  const items =
    config.parser === "table"
      ? parseTableRanking(html, year, pageUrl)
      : config.parser === "image-map"
        ? parseImageMapRanking(html, year, pageUrl)
        : config.parser === "structured-list"
          ? parseStructuredListRanking(html, year, pageUrl)
          : parseArticleHeadingRanking(html, year, pageUrl);
  return validateYearItems(items, config);
}

export function booksellerCanonicalPayloadHash(items: readonly BooksellerRecommendation[]) {
  return sha256(JSON.stringify(rankingItemSchema.array().parse(items)));
}

export function discoverBooksellerRecommendationPages(input: string) {
  const html = htmlSchema.parse(input);
  const history = new Map<number, string>();
  for (const match of html.matchAll(
    /(20(?:0[6-9]|1\d|2[0-5]))年度ランキングは\s*<a\b([^>]*)>/giu,
  )) {
    const year = Number(match[1]);
    const href = attributeValue(match[2] ?? "", "href");
    if (history.has(year)) throw new Error(`Discovery root contains duplicate year ${year}`);
    history.set(year, officialPageUrlSchema.parse(sourceDetailUrl(href, DISCOVERY_URL)));
  }
  for (let year = FIRST_YEAR; year < LAST_YEAR; year += 1) {
    if (!history.has(year)) throw new Error(`Discovery root is missing historical year ${year}`);
  }
  if (history.size !== EXPECTED_SOURCE_COUNT - 1) {
    throw new Error(`Discovery root returned ${history.size} historical years`);
  }

  const currentHeading = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/giu)].find((heading) =>
    htmlText(heading[1] ?? "").includes("第4位以降の作品はこちら"),
  );
  if (currentHeading === undefined)
    throw new Error("Discovery root has no 2026 full-result heading");
  const currentStart = (currentHeading.index ?? 0) + currentHeading[0].length;
  const afterCurrentHeading = html.slice(currentStart);
  const nextHeadingOffset = afterCurrentHeading.search(/<h2\b/iu);
  const currentScope = afterCurrentHeading.slice(
    0,
    nextHeadingOffset < 0 ? afterCurrentHeading.length : nextHeadingOffset,
  );
  const currentAnchor = /<a\b([^>]*)>/iu.exec(currentScope);
  if (currentAnchor === null) throw new Error("Discovery root has no 2026 full-result link");
  return discoverySchema.parse({
    history: [...history]
      .map(([year, url]) => ({ year, url }))
      .sort((left, right) => left.year - right.year),
    currentDetailUrl: sourceDetailUrl(
      attributeValue(currentAnchor[1] ?? "", "href"),
      DISCOVERY_URL,
    ),
  });
}

function assertDiscoveryContract(discovery: z.infer<typeof discoverySchema>) {
  const discovered = new Map(discovery.history.map((entry) => [entry.year, entry.url]));
  for (const config of CONFIGS) {
    const actual =
      config.year === LAST_YEAR ? discovery.currentDetailUrl : discovered.get(config.year);
    if (actual !== config.snapshotUrl) {
      throw new Error(
        `${config.year}: discovery URL drifted; expected ${config.snapshotUrl}, received ${actual ?? "missing"}`,
      );
    }
  }
}

async function fetchOfficialHtml(url: string, label: string) {
  officialPageUrlSchema.parse(url);
  const response = await fetch(url, {
    headers: { accept: "text/html" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`${label} fetch failed with HTTP ${response.status}`);
  officialPageUrlSchema.parse(response.url);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/html")) {
    throw new Error(`${label} returned unexpected content type: ${contentType || "missing"}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  const encoding = new URL(url).hostname === "www.honyaclub.com" ? "shift_jis" : "utf-8";
  return htmlSchema.parse(new TextDecoder(encoding, { fatal: true }).decode(bytes));
}

function registryNotes(config: SourceConfig) {
  const rankNote =
    config.year <= 2009 ? "공식 표에 순위가 없어 selected로 보존" : "공식 순위를 보존";
  return `2026 공식 페이지의 역대 링크에서 발견한 일반 부문 결과만 수집; ${rankNote}; 출판사 담당 별도 부문 제외; snapshot hash 범위는 ${config.year} canonical extracted payload; 저자가 HTML에 없으면 추측하지 않고 빈 값으로 보존.`;
}

function buildRows(
  extracted: readonly { config: SourceConfig; items: readonly BooksellerRecommendation[] }[],
): ImportRows {
  const registry: string[][] = [];
  const raw: string[][] = [];
  const membership: string[][] = [];
  for (const { config, items } of extracted) {
    const registryUrl = config.year === LAST_YEAR ? DISCOVERY_URL : config.snapshotUrl;
    registry.push([
      config.sourceId,
      "bookseller",
      "日本出版販売「全国書店員が選んだおすすめコミック」",
      `全国書店員が選んだおすすめコミック${config.year}`,
      registryUrl,
      String(config.year),
      RETRIEVED_AT,
      "공식 일반 부문 추천 결과",
      "adjudicating",
      config.snapshotUrl,
      config.sha256,
      String(items.length),
      "",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      String(items.length),
      registryNotes(config),
    ]);
    for (const [index, item] of items.entries()) {
      const sourceItemId = `${config.sourceId}-${String(index + 1).padStart(3, "0")}`;
      const notes = [
        `detailUrl=${item.detailUrl}`,
        item.creator === "" ? "creator=not-stated-in-source-html" : "",
      ]
        .filter((note) => note !== "")
        .join("; ");
      raw.push([
        sourceItemId,
        config.sourceId,
        String(index + 1),
        "general-ranking",
        item.title,
        item.creator,
        "",
        "",
        item.rank === null ? "selected" : String(item.rank),
        notes,
        String(config.year),
      ]);
      membership.push([sourceItemId, config.sourceId, "unresolved", "", "", ""]);
    }
  }
  return { registry, raw, membership };
}

export async function buildBooksellerRecommendationsImport() {
  const discoveryHtml = await fetchOfficialHtml(DISCOVERY_URL, "Bookseller discovery root");
  const discovery = discoverBooksellerRecommendationPages(discoveryHtml);
  assertDiscoveryContract(discovery);
  const extracted: Array<{
    config: SourceConfig;
    items: BooksellerRecommendation[];
    digest: string;
  }> = [];
  for (const config of CONFIGS) {
    const html = await fetchOfficialHtml(
      config.snapshotUrl,
      `Bookseller recommendations ${config.year}`,
    );
    const items = extractBooksellerRecommendations(html, config.year, config.snapshotUrl);
    const digest = booksellerCanonicalPayloadHash(items);
    if (digest !== config.sha256) {
      throw new Error(
        `${config.year}: canonical payload drifted; expected ${config.sha256}, received ${digest}`,
      );
    }
    extracted.push({ config, items, digest });
  }
  const rows = buildRows(extracted);
  if (
    rows.registry.length !== EXPECTED_SOURCE_COUNT ||
    rows.raw.length !== EXPECTED_ITEM_COUNT ||
    rows.membership.length !== EXPECTED_ITEM_COUNT
  ) {
    throw new Error("Built bookseller recommendation rows are incomplete");
  }
  const overallDigest = sha256(JSON.stringify(extracted.flatMap(({ items }) => items)));
  return {
    ...rows,
    overallDigest,
    digests: extracted.map(({ config, digest }) => [config.year, digest]),
  };
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
    "bookseller sourceId",
  );
  const actualRaw = indexRows(
    staging.raw.filter((row) => TARGET_SOURCE_IDS.has(row[1] ?? "")),
    0,
    "bookseller sourceItemId",
  );
  const actualMembership = indexRows(
    staging.membership.filter((row) => TARGET_SOURCE_IDS.has(row[1] ?? "")),
    0,
    "bookseller membership",
  );
  assertSameKeys(actualRegistry, expectedRegistry, "bookseller source");
  assertSameKeys(actualRaw, expectedRaw, "bookseller raw item");
  assertSameKeys(actualMembership, expectedMembership, "bookseller membership");

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

export async function runBooksellerRecommendationsImport(
  mode: "--check" | "--write",
  root = process.cwd(),
) {
  const expected = await buildBooksellerRecommendationsImport();
  const staging = readStagingRows(root);
  if (mode === "--check") {
    checkSubset(staging, expected);
    return {
      appended: false,
      sourceCount: expected.registry.length,
      itemCount: expected.raw.length,
      overallDigest: expected.overallDigest,
    };
  }
  if (targetRowCount(staging) > 0) {
    checkSubset(staging, expected);
    return {
      appended: false,
      sourceCount: expected.registry.length,
      itemCount: expected.raw.length,
      overallDigest: expected.overallDigest,
    };
  }
  assertNoKeyCollisions(staging, expected);
  appendRows(staging.paths.registry, expected.registry);
  appendRows(staging.paths.raw, expected.raw);
  appendRows(staging.paths.membership, expected.membership);
  return {
    appended: true,
    sourceCount: expected.registry.length,
    itemCount: expected.raw.length,
    overallDigest: expected.overallDigest,
  };
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  const mode = process.argv[2];
  if (mode !== "--check" && mode !== "--write") {
    console.error("Usage: tsx scripts/import-bookseller-recommendations.ts --check|--write");
    process.exitCode = 1;
  } else {
    runBooksellerRecommendationsImport(mode)
      .then(({ appended, itemCount, overallDigest, sourceCount }) =>
        console.log(
          `Bookseller recommendations ${appended ? "appended" : "verified"}: ${sourceCount} sources / ${itemCount} items; overall=${overallDigest}.`,
        ),
      )
      .catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      });
  }
}
