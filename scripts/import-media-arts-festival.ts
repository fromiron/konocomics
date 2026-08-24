import { createHash } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

const INDEX_URL = "https://www.bunka.go.jp/j-mediaarts-festival/award/previous/index.html";
const OFFICIAL_ORIGIN = "https://www.bunka.go.jp";
const RETRIEVED_AT = "2026-08-22";
const EXPECTED_AWARD_COUNT = 171;
const EXPECTED_JURY_COUNT = 558;
const EXPECTED_TOTAL_COUNT = EXPECTED_AWARD_COUNT + EXPECTED_JURY_COUNT;
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

const snapshotSchema = z.strictObject({
  edition: z.number().int().min(1).max(25),
  publishedAt: z.string().regex(/^\d{4}$/u),
  expectedAwardCount: z.number().int().nonnegative(),
  expectedJuryCount: z.number().int().nonnegative(),
  snapshotSha256: z.string().regex(/^[a-f0-9]{64}$/u),
});

export const MEDIA_ARTS_PAGE_SNAPSHOTS = snapshotSchema
  .array()
  .length(25)
  .parse([
    {
      edition: 1,
      publishedAt: "1997",
      expectedAwardCount: 5,
      expectedJuryCount: 0,
      snapshotSha256: "32f8e200261882cb468220b969bc081f5cd771e5836c71af45b893228877eaf1",
    },
    {
      edition: 2,
      publishedAt: "1998",
      expectedAwardCount: 5,
      expectedJuryCount: 0,
      snapshotSha256: "672a42e2cea4f9b2d2c0ec56b7d1a5acd97eae20131baa257aa9c8ed574977dc",
    },
    {
      edition: 3,
      publishedAt: "1999",
      expectedAwardCount: 5,
      expectedJuryCount: 0,
      snapshotSha256: "6954c247c6cabef603db649cb064a2f0b0dfb8bc1a174a6b74d5ad2bd41678be",
    },
    {
      edition: 4,
      publishedAt: "2000",
      expectedAwardCount: 5,
      expectedJuryCount: 0,
      snapshotSha256: "cabb4fc876460f1e06c1cb407134a035adfd4e86b281f8328749a89ccf758284",
    },
    {
      edition: 5,
      publishedAt: "2001",
      expectedAwardCount: 5,
      expectedJuryCount: 17,
      snapshotSha256: "22cdf979507669d1492f19e89c23150efd296bac740512f4b8494b30eba63fcf",
    },
    {
      edition: 6,
      publishedAt: "2002",
      expectedAwardCount: 6,
      expectedJuryCount: 16,
      snapshotSha256: "3a2b8a07d759064561a5adfba2674d67d43a7a443b07d835d110c05f07740d49",
    },
    {
      edition: 7,
      publishedAt: "2003",
      expectedAwardCount: 6,
      expectedJuryCount: 17,
      snapshotSha256: "bce6e878b07334cf3b256e62387634bcaf9131ca1b1e281cb58e5351157b33b5",
    },
    {
      edition: 8,
      publishedAt: "2004",
      expectedAwardCount: 6,
      expectedJuryCount: 19,
      snapshotSha256: "c2131a00d12c052247ea8db24db4bc028b6fd77ea6c189531898ee57835b0c3b",
    },
    {
      edition: 9,
      publishedAt: "2005",
      expectedAwardCount: 6,
      expectedJuryCount: 23,
      snapshotSha256: "071de3546c42d3b56d07d2029d5fda3ca3477125ff496b387cc8d52c47871e7f",
    },
    {
      edition: 10,
      publishedAt: "2006",
      expectedAwardCount: 6,
      expectedJuryCount: 20,
      snapshotSha256: "eec53a00e48d014dbdb9071037f35921c6557a3a31b5cd1edf0051dc37363231",
    },
    {
      edition: 11,
      publishedAt: "2007",
      expectedAwardCount: 6,
      expectedJuryCount: 22,
      snapshotSha256: "ff2aa68921c5c99474bdf4ef32c761a6f50a1de3ad6084747920ffd7e0be87bb",
    },
    {
      edition: 12,
      publishedAt: "2008",
      expectedAwardCount: 6,
      expectedJuryCount: 28,
      snapshotSha256: "eb1f10522c2fff37bca9787899e1126d1a0005108671c56b28d7fc6faea09f78",
    },
    {
      edition: 13,
      publishedAt: "2009",
      expectedAwardCount: 6,
      expectedJuryCount: 33,
      snapshotSha256: "b0423de1e8c63f1d8bc70ff4a8ab34f9af327318652bfde5450798b31bf83dbe",
    },
    {
      edition: 14,
      publishedAt: "2010",
      expectedAwardCount: 6,
      expectedJuryCount: 27,
      snapshotSha256: "ce7093b690417d52dcf8385fcf82190a32950c5adccfad02434bcc7f39b9de82",
    },
    {
      edition: 15,
      publishedAt: "2011",
      expectedAwardCount: 8,
      expectedJuryCount: 30,
      snapshotSha256: "79050be2dbee90a9e71dd3475162f8634107637c1f83d57625b64901679f14ec",
    },
    {
      edition: 16,
      publishedAt: "2012",
      expectedAwardCount: 8,
      expectedJuryCount: 32,
      snapshotSha256: "d32400f27a8c7b81bed1caec078eacb2914af57305cadf6b441be5afac1ce3b7",
    },
    {
      edition: 17,
      publishedAt: "2013",
      expectedAwardCount: 8,
      expectedJuryCount: 31,
      snapshotSha256: "10fde915c8162c4d179a3ee44f7753b98c2cd63b97c0a263f15356a8a57b284d",
    },
    {
      edition: 18,
      publishedAt: "2014",
      expectedAwardCount: 9,
      expectedJuryCount: 23,
      snapshotSha256: "8f0da3758a4c2a6d50c20b373122c78b68e1b8bc694a3dff9f5bd92e51c2d535",
    },
    {
      edition: 19,
      publishedAt: "2015",
      expectedAwardCount: 8,
      expectedJuryCount: 27,
      snapshotSha256: "375f63c8e638d000aba2e2ecb914333f7ff913ead4fb6a2616680f0980ece7f8",
    },
    {
      edition: 20,
      publishedAt: "2017",
      expectedAwardCount: 8,
      expectedJuryCount: 29,
      snapshotSha256: "cf4e3b95bdfd04d4f0b838cf03a32836526fa48ff5a55d6f6330af6017706bfc",
    },
    {
      edition: 21,
      publishedAt: "2018",
      expectedAwardCount: 8,
      expectedJuryCount: 38,
      snapshotSha256: "e8950bd8fc021aaa17d7d15e9d7d4e3fd46c5a5fa626717526ba145f8877241d",
    },
    {
      edition: 22,
      publishedAt: "2019",
      expectedAwardCount: 8,
      expectedJuryCount: 31,
      snapshotSha256: "8f16d45edd777fc06bc324050b36163f52462123985d59ff8876c79c23f1002c",
    },
    {
      edition: 23,
      publishedAt: "2020",
      expectedAwardCount: 9,
      expectedJuryCount: 34,
      snapshotSha256: "7d7f3e90b27c83b7586c8377a1228f112e10bfb821433a362cc00bf42adf3389",
    },
    {
      edition: 24,
      publishedAt: "2021",
      expectedAwardCount: 9,
      expectedJuryCount: 29,
      snapshotSha256: "88075c5a410cbe27c68cee8ea335bb787604c68953934446a7c6fc1df094712e",
    },
    {
      edition: 25,
      publishedAt: "2022",
      expectedAwardCount: 9,
      expectedJuryCount: 32,
      snapshotSha256: "f3e48da2617c9dedd472e9b9387530228eabaa8afa988814e7f488950fb79fc3",
    },
  ]);

const officialMangaUrl = z.url().refine((value) => {
  const url = new URL(value);
  return (
    url.origin === OFFICIAL_ORIGIN &&
    /^\/j-mediaarts-festival\/award\/previous\/\d+(?:st|nd|rd|th)\/manga\/index\.html$/u.test(
      url.pathname,
    )
  );
});
const discoveredPageSchema = z.strictObject({
  edition: z.number().int().min(1).max(25),
  publishedAt: z.string().regex(/^\d{4}$/u),
  url: officialMangaUrl,
  sourceId: z.string().regex(/^bunka-media-arts-festival-manga-\d{2}$/u),
});
const extractedItemSchema = z.strictObject({
  publicationClass: z.enum(["award", "jury"]),
  section: z.string().min(1),
  title: z.string().min(1),
  creator: z.string(),
  detailUrl: z.union([z.literal(""), z.url()]),
});
const htmlSchema = z.string().min(1);
const matrixSchema = z.array(z.array(z.string()));

export type MediaArtsPage = z.infer<typeof discoveredPageSchema>;
export type MediaArtsItem = z.infer<typeof extractedItemSchema>;

type ElementBlock = { attributes: string; body: string };

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
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

function blocksByClass(html: string, tag: string, className: string) {
  const blocks: ElementBlock[] = [];
  const pattern = new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, "giu");
  for (const match of html.matchAll(pattern)) {
    const attributes = match[1] ?? "";
    if (attributeValue(attributes, "class").split(/\s+/u).includes(className)) {
      blocks.push({ attributes, body: match[2] ?? "" });
    }
  }
  return blocks;
}

function firstTextByClass(html: string, tag: string, className: string) {
  const openingPattern = new RegExp(`<${tag}\\b([^>]*)>`, "giu");
  for (const match of html.matchAll(openingPattern)) {
    if (
      !attributeValue(match[1] ?? "", "class")
        .split(/\s+/u)
        .includes(className)
    )
      continue;
    const bodyStart = (match.index ?? 0) + match[0].length;
    const closingMatch = new RegExp(`<\\/${tag}>`, "iu").exec(html.slice(bodyStart));
    if (closingMatch === null) return "";
    return htmlText(html.slice(bodyStart, bodyStart + closingMatch.index));
  }
  return "";
}

function detailUrl(block: string, pageUrl: string) {
  for (const match of block.matchAll(/<a\b([^>]*)>/giu)) {
    const href = attributeValue(match[1] ?? "", "href");
    if (href === "") continue;
    const url = new URL(href, pageUrl);
    if (url.pathname.includes("/j-mediaarts-festival/award/single/")) return url.href;
  }
  return "";
}

export function discoverMediaArtsFestivalPages(
  indexHtml: string,
  indexUrl = INDEX_URL,
): MediaArtsPage[] {
  const html = htmlSchema.parse(indexHtml);
  const pages = blocksByClass(html, "a", "p-archive-btn-list__single").map((anchor) => {
    const label = htmlText(anchor.body);
    const labelMatch = /第(\d+)回\s*(\d{4})年度/u.exec(label);
    if (labelMatch === null) throw new Error(`Invalid Media Arts edition label: ${label}`);
    const edition = Number(labelMatch[1]);
    const editionUrl = new URL(attributeValue(anchor.attributes, "href"), indexUrl);
    return discoveredPageSchema.parse({
      edition,
      publishedAt: labelMatch[2],
      url: new URL("manga/index.html", editionUrl).href,
      sourceId: `bunka-media-arts-festival-manga-${String(edition).padStart(2, "0")}`,
    });
  });
  const byEdition = new Map(pages.map((page) => [page.edition, page]));
  if (pages.length !== 25 || byEdition.size !== 25) {
    throw new Error(`Media Arts index changed: expected 25 editions, received ${pages.length}`);
  }
  for (const snapshot of MEDIA_ARTS_PAGE_SNAPSHOTS) {
    const page = byEdition.get(snapshot.edition);
    if (page?.publishedAt !== snapshot.publishedAt) {
      throw new Error(
        `Media Arts edition ${snapshot.edition} year changed: expected ${snapshot.publishedAt}, received ${page?.publishedAt ?? "missing"}`,
      );
    }
  }
  return pages;
}

export function extractMediaArtsFestivalPage(html: string, pageUrl: string): MediaArtsItem[] {
  const source = htmlSchema.parse(html);
  officialMangaUrl.parse(pageUrl);
  const items: MediaArtsItem[] = [];
  const seenDetails = new Set<string>();
  const seenFields = new Set<string>();
  const itemIndexByTitle = new Map<string, number>();

  for (const section of blocksByClass(source, "section", "p-award-section")) {
    const sectionName = firstTextByClass(section.body, "h2", "p-award-section__title");
    if (sectionName === "") throw new Error(`Media Arts section has no title: ${pageUrl}`);
    const publicationClass = sectionName === "審査委員会推薦作品" ? "jury" : "award";
    const cardClass = publicationClass === "jury" ? "c-award-text-single" : "p-award-single";
    const titleClass =
      publicationClass === "jury" ? "c-award-text-single__title" : "p-award-single__title";
    const creatorClass =
      publicationClass === "jury" ? "c-award-text-single__sub-text" : "p-award-single__sub-text";

    for (const card of blocksByClass(section.body, "li", cardClass)) {
      const item = extractedItemSchema.parse({
        publicationClass,
        section: sectionName,
        title: firstTextByClass(card.body, "h3", titleClass),
        creator: firstTextByClass(card.body, "div", creatorClass),
        detailUrl: detailUrl(card.body, pageUrl),
      });
      const titleKey = [item.publicationClass, item.section, item.title].join("\u0000");
      const sameTitleIndex = itemIndexByTitle.get(titleKey);
      const sameTitle = sameTitleIndex === undefined ? undefined : items[sameTitleIndex];
      if (
        sameTitleIndex !== undefined &&
        sameTitle !== undefined &&
        (sameTitle.creator === "" || item.creator === "")
      ) {
        if (sameTitle.creator === "" && item.creator !== "") {
          const oldFieldKey = [
            sameTitle.publicationClass,
            sameTitle.section,
            sameTitle.title,
            sameTitle.creator,
          ].join("\u0000");
          const merged = { ...sameTitle, creator: item.creator };
          items[sameTitleIndex] = merged;
          seenFields.delete(oldFieldKey);
          seenFields.add(
            [merged.publicationClass, merged.section, merged.title, merged.creator].join("\u0000"),
          );
        }
        continue;
      }
      const fieldKey = [item.publicationClass, item.section, item.title, item.creator].join(
        "\u0000",
      );
      if (seenFields.has(fieldKey) || (item.detailUrl !== "" && seenDetails.has(item.detailUrl))) {
        continue;
      }
      seenFields.add(fieldKey);
      if (item.detailUrl !== "") seenDetails.add(item.detailUrl);
      itemIndexByTitle.set(titleKey, items.length);
      items.push(item);
    }
  }
  if (items.length === 0) throw new Error(`Media Arts page yielded no items: ${pageUrl}`);
  return items;
}

export function mediaArtsCanonicalPayloadHash(items: readonly MediaArtsItem[]) {
  return sha256(`${JSON.stringify(items)}\n`);
}

export function buildMediaArtsPageImport(
  page: MediaArtsPage,
  html: string,
  snapshot = MEDIA_ARTS_PAGE_SNAPSHOTS.find((entry) => entry.edition === page.edition),
) {
  if (snapshot === undefined) throw new Error(`Missing snapshot for edition ${page.edition}`);
  const items = extractMediaArtsFestivalPage(html, page.url);
  const awardCount = items.filter((item) => item.publicationClass === "award").length;
  const juryCount = items.length - awardCount;
  if (awardCount !== snapshot.expectedAwardCount || juryCount !== snapshot.expectedJuryCount) {
    throw new Error(
      `Media Arts edition ${page.edition} count changed: expected ${snapshot.expectedAwardCount}+${snapshot.expectedJuryCount}, received ${awardCount}+${juryCount}`,
    );
  }
  const digest = mediaArtsCanonicalPayloadHash(items);
  if (digest !== snapshot.snapshotSha256) {
    throw new Error(
      `Media Arts edition ${page.edition} extracted snapshot changed: expected ${snapshot.snapshotSha256}, received ${digest}`,
    );
  }

  return items.map((item, index) => {
    const sourceItemId = `${page.sourceId}-${String(index + 1).padStart(3, "0")}`;
    return {
      raw: [
        sourceItemId,
        page.sourceId,
        String(index + 1),
        item.publicationClass,
        item.title,
        item.creator,
        "",
        "",
        item.section,
        item.detailUrl,
        page.publishedAt,
      ],
      membership: [sourceItemId, page.sourceId, "unresolved", "", "", ""],
    };
  });
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeCsvRows(rows: readonly (readonly string[])[]) {
  return `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function readCsvRows(path: string, headers: readonly string[]) {
  const bytes = readFileSync(path);
  const matrix = matrixSchema.parse(
    parse(bytes, { bom: true, relax_column_count: false, skip_empty_lines: true }),
  );
  const [actualHeaders, ...rows] = matrix;
  if (actualHeaders?.join("\u0000") !== headers.join("\u0000")) {
    throw new Error(`Unexpected staging headers: ${path}`);
  }
  if (!bytes.toString("utf8").endsWith("\n")) {
    throw new Error(`Staging CSV must end with a newline before append: ${path}`);
  }
  return rows;
}

async function fetchHtml(url: string, label: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${label} fetch failed: HTTP ${response.status}`);
  return htmlSchema.parse(await response.text());
}

export async function runMediaArtsFestivalImport(
  mode: "--check" | "--write",
  root = process.cwd(),
) {
  const indexHtml = await fetchHtml(INDEX_URL, "Media Arts index");
  const pages = discoverMediaArtsFestivalPages(indexHtml);
  const pageOutputs = await Promise.all(
    pages.map(async (page) =>
      buildMediaArtsPageImport(
        page,
        await fetchHtml(page.url, `Media Arts edition ${page.edition}`),
      ),
    ),
  );
  const output = pageOutputs.flat();
  const awardCount = output.filter(({ raw }) => raw[3] === "award").length;
  const juryCount = output.length - awardCount;
  if (
    awardCount !== EXPECTED_AWARD_COUNT ||
    juryCount !== EXPECTED_JURY_COUNT ||
    output.length !== EXPECTED_TOTAL_COUNT
  ) {
    throw new Error(
      `Media Arts total changed: expected ${EXPECTED_AWARD_COUNT}+${EXPECTED_JURY_COUNT}, received ${awardCount}+${juryCount}`,
    );
  }

  const sourceIds = new Set(pages.map((page) => page.sourceId));
  const sourceItemIds = new Set(output.map(({ raw }) => raw[0]!));
  const expectedRegistryRows = pages.map((page) => {
    const snapshot = MEDIA_ARTS_PAGE_SNAPSHOTS[page.edition - 1]!;
    const count = snapshot.expectedAwardCount + snapshot.expectedJuryCount;
    return [
      page.sourceId,
      "award",
      "文化庁メディア芸術祭",
      `第${page.edition}回 文化庁メディア芸術祭 マンガ部門`,
      page.url,
      page.publishedAt,
      RETRIEVED_AT,
      "만화 부문 수상작·심사위원회 추천작 공식 아카이브",
      "adjudicating",
      page.url,
      snapshot.snapshotSha256,
      String(count),
      "",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      String(count),
      `공식 카드 추출; 수상 ${snapshot.expectedAwardCount} + 심사위원회 추천 ${snapshot.expectedJuryCount}; hash 범위는 publicationClass/section/title/creator/detailUrl canonical payload.`,
    ];
  });
  const directory = join(root, "data/staging/catalog-expansion");
  const registryPath = join(directory, "source-registry.csv");
  const rawPath = join(directory, "raw-source-items.csv");
  const membershipPath = join(directory, "source-membership.csv");
  const currentRegistryRows = readCsvRows(registryPath, SOURCE_REGISTRY_HEADERS);
  const currentRawRows = readCsvRows(rawPath, RAW_HEADERS);
  const currentMembershipRows = readCsvRows(membershipPath, MEMBERSHIP_HEADERS);
  const expectedRawRows = output.map(({ raw }) => raw);
  const expectedMembershipRows = output.map(({ membership }) => membership);
  const committedRegistryRows = currentRegistryRows.filter((row) => sourceIds.has(row[0] ?? ""));
  const committedRawRows = currentRawRows.filter((row) => sourceIds.has(row[1] ?? ""));
  const committedMembershipRows = currentMembershipRows.filter((row) =>
    sourceIds.has(row[1] ?? ""),
  );

  if (mode === "--check") {
    if (JSON.stringify(committedRegistryRows) !== JSON.stringify(expectedRegistryRows)) {
      throw new Error("Committed Media Arts source registry rows do not match the snapshots");
    }
    if (JSON.stringify(committedRawRows) !== JSON.stringify(expectedRawRows)) {
      throw new Error("Committed Media Arts raw rows do not match the frozen extracted snapshots");
    }
    if (JSON.stringify(committedMembershipRows) !== JSON.stringify(expectedMembershipRows)) {
      throw new Error(
        "Committed Media Arts membership rows do not preserve the unresolved import boundary",
      );
    }
    return;
  }

  if (
    committedRegistryRows.length > 0 ||
    committedRawRows.length > 0 ||
    committedMembershipRows.length > 0 ||
    currentRawRows.some((row) => sourceItemIds.has(row[0] ?? "")) ||
    currentMembershipRows.some((row) => sourceItemIds.has(row[0] ?? ""))
  ) {
    throw new Error("Refusing to overwrite existing Media Arts rows or membership decisions");
  }
  appendFileSync(registryPath, serializeCsvRows(expectedRegistryRows), "utf8");
  appendFileSync(rawPath, serializeCsvRows(expectedRawRows), "utf8");
  appendFileSync(membershipPath, serializeCsvRows(expectedMembershipRows), "utf8");
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  const mode = process.argv[2];
  if (mode !== "--check" && mode !== "--write") {
    console.error("Usage: tsx scripts/import-media-arts-festival.ts --check|--write");
    process.exitCode = 1;
  } else {
    runMediaArtsFestivalImport(mode)
      .then(() =>
        console.log(`Media Arts Festival rows ${mode === "--write" ? "imported" : "verified"}.`),
      )
      .catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      });
  }
}
