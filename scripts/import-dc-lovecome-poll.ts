import { createHash } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

const SOURCE_ID = "dc-lovecome-manga-award-poll-2024";
const POST_URL = "https://gall.dcinside.com/mgallery/board/view/?id=lovecome&no=602233";
const SNAPSHOT_URL =
  "https://docs.google.com/spreadsheets/d/1q7ig-Dv8wogqKU39ho9Lx7v-Wa85_YIuQ_mvOMFAUtg/export?format=csv";
const SNAPSHOT_SHA256 = "e4534e0b2743541f7fafae4a4ab8dafd7ee4e9994ca7068800f836cb4b85e77f";
const PUBLISHED_AT = "2024-05-12";
const RETRIEVED_AT = "2026-08-22";
const EXPECTED_RESPONDENT_COUNT = 69;
const EXPECTED_ITEM_COUNT = 22;

const SOURCE_HEADERS = [
  "e",
  "이메일 주소",
  "1 순위 투표",
  "2 순위 투표",
  "",
  "",
  "제목",
  "1순위",
  "2순위",
  "총점",
  "총점 (1.2)",
  "총점(2, 1.5)",
  "총점 (1.5)",
] as const;
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
const STATIC_REGISTRY_COLUMNS = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 20] as const;

const matrixSchema = z.array(z.array(z.string()));
const membershipSchema = z.strictObject({
  sourceItemId: z.string().min(1),
  sourceId: z.literal(SOURCE_ID),
  status: z.enum([
    "included",
    "duplicate",
    "excluded-webtoon",
    "excluded-adult",
    "excluded-non-japanese",
    "excluded-non-manga",
    "unresolved",
  ]),
  candidateId: z.string(),
  workId: z.string(),
  decisionRef: z.string(),
});

type PollItem = {
  sourceRowNumber: number;
  resultOrder: number;
  title: string;
  firstChoiceVotes: number;
  secondChoiceVotes: number;
  score2To1: number;
  score1Point2To1: number;
  score2To1Point5: number;
  score1Point5To1: number;
};
type ImportRows = { registry: string[][]; raw: string[][]; membership: string[][] };
type StagingRows = ImportRows & {
  paths: { registry: string; raw: string; membership: string };
};

function sha256(bytes: Buffer) {
  return createHash("sha256").update(bytes).digest("hex");
}

function numericCell(row: readonly string[], column: number, label: string) {
  const value = row[column]?.trim() ?? "";
  if (!/^\d+(?:\.\d+)?$/u.test(value)) throw new Error(`Invalid ${label}: ${value}`);
  return Number(value);
}

function assertScore(actual: number, expected: number, label: string) {
  if (Math.abs(actual - expected) > 1e-9) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
}

function increment(counts: Map<string, number>, title: string) {
  counts.set(title, (counts.get(title) ?? 0) + 1);
}

export function extractDcLovecomePollResults(bytes: Buffer) {
  const matrix = matrixSchema.parse(
    parse(bytes, { bom: true, relax_column_count: false, skip_empty_lines: false }),
  );
  const [headers, ...rows] = matrix;
  if (headers === undefined || headers.join("\u0000") !== SOURCE_HEADERS.join("\u0000")) {
    throw new Error("DC lovecome poll source header changed");
  }

  const firstChoiceCounts = new Map<string, number>();
  const secondChoiceCounts = new Map<string, number>();
  let respondentCount = 0;
  for (const [index, row] of rows.entries()) {
    const firstChoice = row[2]?.trim() ?? "";
    const secondChoice = row[3]?.trim() ?? "";
    if ((firstChoice === "") !== (secondChoice === "")) {
      throw new Error(`Incomplete vote response at source row ${index + 2}`);
    }
    if (firstChoice === "") continue;
    respondentCount += 1;
    increment(firstChoiceCounts, firstChoice);
    increment(secondChoiceCounts, secondChoice);
  }

  const items: PollItem[] = [];
  const titles = new Set<string>();
  for (const [index, row] of rows.entries()) {
    const title = row[6]?.trim() ?? "";
    const hasResultValues = row.slice(7, 13).some((value) => value.trim() !== "");
    if (title === "") {
      if (hasResultValues) throw new Error(`Result without title at source row ${index + 2}`);
      continue;
    }
    if (titles.has(title)) throw new Error(`Duplicate poll result title: ${title}`);
    titles.add(title);
    const item: PollItem = {
      sourceRowNumber: index + 2,
      resultOrder: items.length + 1,
      title,
      firstChoiceVotes: numericCell(row, 7, `${title} first-choice votes`),
      secondChoiceVotes: numericCell(row, 8, `${title} second-choice votes`),
      score2To1: numericCell(row, 9, `${title} 2:1 score`),
      score1Point2To1: numericCell(row, 10, `${title} 1.2:1 score`),
      score2To1Point5: numericCell(row, 11, `${title} 2:1.5 score`),
      score1Point5To1: numericCell(row, 12, `${title} 1.5:1 score`),
    };
    if (
      item.firstChoiceVotes !== (firstChoiceCounts.get(title) ?? 0) ||
      item.secondChoiceVotes !== (secondChoiceCounts.get(title) ?? 0)
    ) {
      throw new Error(`Vote totals do not match raw responses: ${title}`);
    }
    assertScore(
      item.score2To1,
      item.firstChoiceVotes * 2 + item.secondChoiceVotes,
      `${title} 2:1 score`,
    );
    assertScore(
      item.score1Point2To1,
      item.firstChoiceVotes * 1.2 + item.secondChoiceVotes,
      `${title} 1.2:1 score`,
    );
    assertScore(
      item.score2To1Point5,
      item.firstChoiceVotes * 2 + item.secondChoiceVotes * 1.5,
      `${title} 2:1.5 score`,
    );
    assertScore(
      item.score1Point5To1,
      item.firstChoiceVotes * 1.5 + item.secondChoiceVotes,
      `${title} 1.5:1 score`,
    );
    items.push(item);
  }

  const votedTitles = new Set([...firstChoiceCounts.keys(), ...secondChoiceCounts.keys()]);
  if (votedTitles.size !== titles.size || [...votedTitles].some((title) => !titles.has(title))) {
    throw new Error("Poll result titles do not cover every voted title");
  }
  return { respondentCount, items };
}

export function buildDcLovecomePollImport(bytes: Buffer): ImportRows {
  const digest = sha256(bytes);
  if (digest !== SNAPSHOT_SHA256) {
    throw new Error(
      `DC lovecome poll snapshot changed: expected ${SNAPSHOT_SHA256}, received ${digest}`,
    );
  }
  const { respondentCount, items } = extractDcLovecomePollResults(bytes);
  if (respondentCount !== EXPECTED_RESPONDENT_COUNT || items.length !== EXPECTED_ITEM_COUNT) {
    throw new Error(
      `DC lovecome poll size changed: ${respondentCount} respondents / ${items.length} items`,
    );
  }

  const registry = [
    [
      SOURCE_ID,
      "community",
      "DCInside 러브코미디만화 마이너 갤러리",
      "만화대상 결과표 스프레드시트",
      POST_URL,
      PUBLISHED_AT,
      RETRIEVED_AT,
      "갤러리 이용자 1·2순위 만화 투표 결과",
      "adjudicating",
      SNAPSHOT_URL,
      SNAPSHOT_SHA256,
      String(items.length),
      "",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      String(items.length),
      "공개 Google Sheet 결과표 22작품만 수집; 원본 69명 응답의 이메일·타임스탬프는 저장하지 않음; 1·2순위 집계와 네 가지 점수 산식을 raw 응답에 대조함; canonical·일본 만화·비성인 판정 전 unresolved 유지.",
    ],
  ];
  const raw = items.map((item) => {
    const sourceItemId = `${SOURCE_ID}-${String(item.sourceRowNumber).padStart(3, "0")}`;
    return [
      sourceItemId,
      SOURCE_ID,
      String(item.sourceRowNumber),
      "community-poll-result",
      item.title,
      "",
      "",
      "",
      String(item.score2To1),
      `resultOrder=${item.resultOrder};firstChoiceVotes=${item.firstChoiceVotes};secondChoiceVotes=${item.secondChoiceVotes};score1.2to1=${item.score1Point2To1};score2to1.5=${item.score2To1Point5};score1.5to1=${item.score1Point5To1};respondents=${respondentCount}`,
      PUBLISHED_AT,
    ];
  });
  const membership = raw.map(([sourceItemId]) => [
    sourceItemId!,
    SOURCE_ID,
    "unresolved",
    "",
    "",
    "",
  ]);
  return { registry, raw, membership };
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeRows(rows: readonly (readonly string[])[]) {
  return `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function readCsvRows(path: string, expectedHeaders: readonly string[]) {
  const matrix = matrixSchema.parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }),
  );
  const [headers, ...rows] = matrix;
  if (headers === undefined || headers.join("\u0000") !== expectedHeaders.join("\u0000")) {
    throw new Error(`Unexpected CSV header: ${path}`);
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
  for (const key of expected.keys())
    if (!actual.has(key)) throw new Error(`Missing ${label}: ${key}`);
  for (const key of actual.keys())
    if (!expected.has(key)) throw new Error(`Unexpected ${label}: ${key}`);
}

function checkSubset(staging: StagingRows, expected: ImportRows) {
  const actualRegistry = indexRows(
    staging.registry.filter((row) => row[0] === SOURCE_ID),
    0,
    "DC lovecome source",
  );
  const actualRaw = indexRows(
    staging.raw.filter((row) => row[1] === SOURCE_ID),
    0,
    "DC lovecome raw item",
  );
  const actualMembership = indexRows(
    staging.membership.filter((row) => row[1] === SOURCE_ID),
    0,
    "DC lovecome membership",
  );
  const expectedRegistry = indexRows(expected.registry, 0, "generated source");
  const expectedRaw = indexRows(expected.raw, 0, "generated raw item");
  const expectedMembership = indexRows(expected.membership, 0, "generated membership");
  assertSameKeys(actualRegistry, expectedRegistry, "DC lovecome source");
  assertSameKeys(actualRaw, expectedRaw, "DC lovecome raw item");
  assertSameKeys(actualMembership, expectedMembership, "DC lovecome membership");

  const source = actualRegistry.get(SOURCE_ID)!;
  const expectedSource = expectedRegistry.get(SOURCE_ID)!;
  for (const column of STATIC_REGISTRY_COLUMNS) {
    if (source[column] !== expectedSource[column]) {
      throw new Error(`DC lovecome source field changed: ${SOURCE_REGISTRY_HEADERS[column]}`);
    }
  }
  for (const [sourceItemId, expectedRow] of expectedRaw) {
    const actualRow = actualRaw.get(sourceItemId)!;
    if (actualRow.join("\u0000") !== expectedRow.join("\u0000")) {
      throw new Error(`DC lovecome raw item changed: ${sourceItemId}`);
    }
  }
  for (const [sourceItemId] of expectedMembership) {
    const row = actualMembership.get(sourceItemId)!;
    const result = membershipSchema.safeParse(
      Object.fromEntries(MEMBERSHIP_HEADERS.map((header, index) => [header, row[index] ?? ""])),
    );
    if (!result.success) throw new Error(`Invalid DC lovecome membership: ${sourceItemId}`);
    const membership = result.data;
    if (membership.status === "unresolved") {
      if (
        membership.candidateId !== "" ||
        membership.workId !== "" ||
        membership.decisionRef !== ""
      ) {
        throw new Error(`Unresolved membership claims a decision: ${sourceItemId}`);
      }
    } else if (membership.status === "included" || membership.status === "duplicate") {
      if (membership.candidateId === "" || membership.decisionRef === "") {
        throw new Error(`Mapped membership is incomplete: ${sourceItemId}`);
      }
    } else if (membership.workId !== "" || membership.decisionRef === "") {
      throw new Error(`Excluded membership is incomplete: ${sourceItemId}`);
    }
  }
}

function targetRowCount(staging: StagingRows) {
  return (
    staging.registry.filter((row) => row[0] === SOURCE_ID).length +
    staging.raw.filter((row) => row[1] === SOURCE_ID).length +
    staging.membership.filter((row) => row[1] === SOURCE_ID).length
  );
}

function assertNoCollisions(staging: StagingRows, expected: ImportRows) {
  const registry = indexRows(staging.registry, 0, "sourceId");
  const raw = indexRows(staging.raw, 0, "sourceItemId");
  const membership = indexRows(staging.membership, 0, "membership sourceItemId");
  if (registry.has(expected.registry[0]![0]!))
    throw new Error(`Source already exists: ${SOURCE_ID}`);
  for (const row of expected.raw)
    if (raw.has(row[0]!)) throw new Error(`Raw item already exists: ${row[0]}`);
  for (const row of expected.membership) {
    if (membership.has(row[0]!)) throw new Error(`Membership already exists: ${row[0]}`);
  }
}

function appendRows(path: string, rows: readonly string[][]) {
  const current = readFileSync(path, "utf8");
  appendFileSync(path, `${current.endsWith("\n") ? "" : "\n"}${serializeRows(rows)}`, "utf8");
}

export async function runDcLovecomePollImport(mode: "--check" | "--write", root = process.cwd()) {
  const response = await fetch(SNAPSHOT_URL);
  if (!response.ok) throw new Error(`DC lovecome poll fetch failed: HTTP ${response.status}`);
  const expected = buildDcLovecomePollImport(Buffer.from(await response.arrayBuffer()));
  const staging = readStagingRows(root);
  if (mode === "--check") {
    checkSubset(staging, expected);
    return { appended: false, itemCount: expected.raw.length };
  }
  if (targetRowCount(staging) > 0) {
    checkSubset(staging, expected);
    return { appended: false, itemCount: expected.raw.length };
  }
  assertNoCollisions(staging, expected);
  appendRows(staging.paths.registry, expected.registry);
  appendRows(staging.paths.raw, expected.raw);
  appendRows(staging.paths.membership, expected.membership);
  return { appended: true, itemCount: expected.raw.length };
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  const mode = process.argv[2];
  if (mode !== "--check" && mode !== "--write") {
    console.error("Usage: tsx scripts/import-dc-lovecome-poll.ts --check|--write");
    process.exitCode = 1;
  } else {
    runDcLovecomePollImport(mode)
      .then(({ appended, itemCount }) =>
        console.log(`DC lovecome poll ${appended ? "appended" : "verified"}: ${itemCount} items.`),
      )
      .catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      });
  }
}
