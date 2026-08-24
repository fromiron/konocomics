import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

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

const pageSchema = z.object({
  year: z.string().regex(/^20\d{2}$/u),
  url: z.string().url(),
  publishedAt: z.string().date(),
  expectedItemCount: z
    .number()
    .int()
    .positive()
    .refine((value) => value % 2 === 0),
  snapshotSha256: z.string().regex(/^[a-f0-9]{64}$/u),
});

export const KONOMANGA_PAGES = pageSchema.array().parse([
  {
    year: "2020",
    url: "https://sugoiweb.jp/column/4894/",
    publishedAt: "2019-12-20",
    expectedItemCount: 40,
    snapshotSha256: "51e1dc4347abd6442e9edddef459651879158b40bf277230016c37a6ed58aeeb",
  },
  {
    year: "2021",
    url: "https://sugoiweb.jp/column/4868/",
    publishedAt: "2020-12-10",
    expectedItemCount: 20,
    snapshotSha256: "6e36cb5b4b656599ffefb673439c9c5c419b4375afcb47eb34a2789bed2e9e1d",
  },
  {
    year: "2022",
    url: "https://sugoiweb.jp/column/4815/",
    publishedAt: "2021-12-07",
    expectedItemCount: 20,
    snapshotSha256: "5c5001f59a95136afa0a84dfd1caf3f12f842e27a30c944a881920dac3ec0e41",
  },
  {
    year: "2023",
    url: "https://sugoiweb.jp/column/4772/",
    publishedAt: "2022-12-12",
    expectedItemCount: 20,
    snapshotSha256: "8f50a4b8b53572a50438236ca4ba8bfaf85d2aca5e678a7cd2b9c66b0e430dee",
  },
  {
    year: "2024",
    url: "https://sugoiweb.jp/column/4756/",
    publishedAt: "2023-12-11",
    expectedItemCount: 2,
    snapshotSha256: "0bb8774585644ed037c6faf8e8e9b18ec4528a12edafd2c9df65fd0930b8fade",
  },
  {
    year: "2025",
    url: "https://sugoiweb.jp/column/4251/",
    publishedAt: "2024-12-13",
    expectedItemCount: 2,
    snapshotSha256: "35a3935c7ad8b5a77e1f16f7de2cf4b08721d062ea899f3f6b808057c06e49aa",
  },
  {
    year: "2026",
    url: "https://sugoiweb.jp/column/3590/",
    publishedAt: "2025-12-10",
    expectedItemCount: 2,
    snapshotSha256: "1ad9054e3729f2caf459c1bb89a278c822872a82baa39f7bd753aa07406cd2cc",
  },
]);

type RankingItem = {
  section: "オトコ編" | "オンナ編";
  rank: number;
  title: string;
  creator: string;
  points: string;
};

const matrixSchema = z.array(z.array(z.string()));

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeCsv(headers: readonly string[], rows: readonly (readonly string[])[]) {
  return `${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function readCsvRows(path: string, headers: readonly string[]) {
  const matrix = matrixSchema.parse(
    parse(readFileSync(path), { bom: true, relax_column_count: false, skip_empty_lines: true }),
  );
  const [actualHeaders, ...rows] = matrix;
  if (actualHeaders?.join("\u0000") !== headers.join("\u0000")) {
    throw new Error(`Unexpected staging headers: ${path}`);
  }
  return rows;
}

function decodeHtml(html: string) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, "")
    .replace(/<br\s*\/?>/giu, "\n")
    .replace(/<\/(?:p|li|h[1-6]|div|section|article|tr|hr)>/giu, "\n")
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
    .split(/\r?\n/gu)
    .map((line) => line.replace(/[\t ]+/gu, " ").trim())
    .filter(Boolean);
}

export function extractKonomangaRanking(html: string, expectedItemCount: number): RankingItem[] {
  const lines = decodeHtml(z.string().min(1).parse(html));
  const items: RankingItem[] = [];
  const byRankAndTitle = new Map<string, RankingItem>();

  for (let index = 0; index < lines.length; index += 1) {
    const rankMatch = /^★ 第(\d+)位 ★$/u.exec(lines[index]!);
    const titleMatch = /^『([^』]+)』[\s　]*(.*)$/u.exec(lines[index + 1] ?? "");
    if (rankMatch === null || titleMatch === null) continue;

    const rank = Number(rankMatch[1]);
    const title = titleMatch[1]!.trim();
    let detail = titleMatch[2]!.trim();
    if (detail === "") {
      for (let offset = index + 2; offset <= index + 5 && offset < lines.length; offset += 1) {
        if (/^★ 第\d+位 ★$/u.test(lines[offset]!)) break;
        if (/\d+pt$/u.test(lines[offset]!)) {
          detail = lines[offset]!;
          break;
        }
      }
    }
    const pointsMatch = /^(.*?)[\s　]*(\d+)pt$/u.exec(detail);
    const key = `${rank}\u0000${title}`;
    const previous = byRankAndTitle.get(key);
    if (previous !== undefined) {
      if (previous.creator === "" && pointsMatch !== null) {
        previous.creator = pointsMatch[1]!.trim();
        previous.points = `${pointsMatch[2]}pt`;
      }
      continue;
    }
    const item: RankingItem = {
      section: items.length < expectedItemCount / 2 ? "オトコ編" : "オンナ編",
      rank,
      title,
      creator: pointsMatch?.[1]?.trim() ?? "",
      points: pointsMatch === null ? "" : `${pointsMatch[2]}pt`,
    };
    byRankAndTitle.set(key, item);
    items.push(item);
  }

  if (items.length !== expectedItemCount) {
    throw new Error(
      `Kono Manga ranking item count changed: expected ${expectedItemCount}, received ${items.length}`,
    );
  }
  return items;
}

export function buildKonomangaPageImport(page: (typeof KONOMANGA_PAGES)[number], html: string) {
  const items = extractKonomangaRanking(html, page.expectedItemCount);
  const digest = sha256(`${JSON.stringify(items)}\n`);
  if (digest !== page.snapshotSha256) {
    throw new Error(
      `Kono Manga ${page.year} extracted snapshot changed: expected ${page.snapshotSha256}, received ${digest}`,
    );
  }
  const sourceId = `konomanga-${page.year}-ranking`;
  return items.map((item, index) => {
    const sourceItemId = `${sourceId}-${String(index + 1).padStart(2, "0")}`;
    return {
      raw: [
        sourceItemId,
        sourceId,
        String(index + 1),
        item.section,
        item.title,
        item.creator,
        "",
        "",
        `${item.rank}位`,
        item.points,
        page.publishedAt,
      ],
      membership: [sourceItemId, sourceId, "unresolved", "", "", ""],
    };
  });
}

export async function runKonomangaImport(mode: "--check" | "--write", root = process.cwd()) {
  const pageOutputs = await Promise.all(
    KONOMANGA_PAGES.map(async (page) => {
      const response = await fetch(page.url);
      if (!response.ok) {
        throw new Error(`Kono Manga ${page.year} fetch failed: HTTP ${response.status}`);
      }
      return buildKonomangaPageImport(page, await response.text());
    }),
  );
  const output = pageOutputs.flat();
  const sourceIds = new Set(KONOMANGA_PAGES.map((page) => `konomanga-${page.year}-ranking`));
  const directory = join(root, "data/staging/catalog-expansion");
  const rawPath = join(directory, "raw-source-items.csv");
  const membershipPath = join(directory, "source-membership.csv");
  const currentRawRows = readCsvRows(rawPath, RAW_HEADERS);
  const expectedRawRows = output.map(({ raw }) => raw);
  const committedRawRows = currentRawRows.filter((row) => sourceIds.has(row[1] ?? ""));

  if (mode === "--check") {
    if (JSON.stringify(committedRawRows) !== JSON.stringify(expectedRawRows)) {
      throw new Error("Committed Kono Manga rows do not match the frozen extracted snapshots");
    }
    return;
  }
  const currentMembershipRows = readCsvRows(membershipPath, MEMBERSHIP_HEADERS);
  if (
    committedRawRows.length > 0 ||
    currentMembershipRows.some((row) => sourceIds.has(row[1] ?? ""))
  ) {
    throw new Error("Refusing to overwrite existing Kono Manga rows or membership decisions");
  }
  writeFileSync(
    rawPath,
    serializeCsv(RAW_HEADERS, [...currentRawRows, ...expectedRawRows]),
    "utf8",
  );
  writeFileSync(
    membershipPath,
    serializeCsv(MEMBERSHIP_HEADERS, [
      ...currentMembershipRows,
      ...output.map(({ membership }) => membership),
    ]),
    "utf8",
  );
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  const mode = process.argv[2];
  if (mode !== "--check" && mode !== "--write") {
    console.error("Usage: tsx scripts/import-konomanga-rankings.ts --check|--write");
    process.exitCode = 1;
  } else {
    runKonomangaImport(mode)
      .then(() =>
        console.log(`Kono Manga rankings ${mode === "--write" ? "imported" : "verified"}.`),
      )
      .catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      });
  }
}
