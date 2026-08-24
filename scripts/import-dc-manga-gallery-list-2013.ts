import { createHash } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

const SOURCE_PREFIX = "dc-manga-gallery-list-2013";
const ROBOTS_URL = "https://gall.dcinside.com/robots.txt";
const RETRIEVED_AT = "2026-08-22";
const EMPTY_BODY_SHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
const EXCLUDED_GUIDE_POST_NUMBER = "367832";

const POSTS = [
  { postNumber: "436084", role: "index", title: "■■ 망갤리스트" },
  { postNumber: "369444", role: "selection", title: "망갤리스트 하위 목록 369444" },
  { postNumber: "369452", role: "selection", title: "망갤리스트 하위 목록 369452" },
  { postNumber: "369468", role: "selection", title: "망갤리스트 하위 목록 369468" },
  { postNumber: "369491", role: "selection", title: "망갤리스트 하위 목록 369491" },
  { postNumber: "369574", role: "selection", title: "망갤리스트 하위 목록 369574" },
  { postNumber: "369581", role: "selection", title: "망갤리스트 하위 목록 369581" },
  { postNumber: "369587", role: "selection", title: "망갤리스트 하위 목록 369587" },
  { postNumber: "369589", role: "selection", title: "망갤리스트 하위 목록 369589" },
  { postNumber: "369590", role: "selection", title: "망갤리스트 하위 목록 369590" },
  { postNumber: "369592", role: "selection", title: "망갤리스트 하위 목록 369592" },
  { postNumber: "369594", role: "selection", title: "망갤리스트 하위 목록 369594" },
  { postNumber: "369597", role: "selection", title: "망갤리스트 하위 목록 369597" },
  { postNumber: "369598", role: "selection", title: "망갤리스트 하위 목록 369598" },
  { postNumber: "369600", role: "selection", title: "망갤리스트 하위 목록 369600" },
  { postNumber: "369604", role: "novel", title: "망갤리스트 노벨 목록 369604" },
  { postNumber: "369619", role: "selection", title: "망갤리스트 하위 목록 369619" },
  { postNumber: "369601", role: "shorts", title: "망갤리스트 단편 목록 369601" },
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

const matrixSchema = z.array(z.array(z.string()));
const responseBoundarySchema = z.strictObject({
  requestedUrl: z.url(),
  finalUrl: z.url(),
  status: z.number().int().min(100).max(599),
  contentType: z.string(),
  contentLength: z.string().nullable(),
  body: z.instanceof(Uint8Array),
});
const sourceRegistryRowSchema = z.strictObject({
  sourceId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
  sourceKind: z.literal("community"),
  organization: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
  publishedAt: z.literal("2013"),
  retrievedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
  listNature: z.string().min(1),
  registryStatus: z.literal("blocked"),
  snapshotUrl: z.url(),
  snapshotSha256: z.string().regex(/^[a-f0-9]{64}$/u),
  originalItemCount: z.literal(""),
  japaneseMangaItemCount: z.literal(""),
  excludedWebtoonCount: z.literal("0"),
  excludedAdultCount: z.literal("0"),
  excludedNonJapaneseCount: z.literal("0"),
  excludedNonMangaCount: z.literal("0"),
  duplicateCount: z.literal("0"),
  canonicalMappingCount: z.literal("0"),
  unresolvedCount: z.literal("0"),
  notes: z.string().min(1),
});

type Post = (typeof POSTS)[number];
type Fetch = typeof fetch;
type RobotsRule = { kind: "allow" | "disallow"; path: string };
type RobotsGroup = { agents: string[]; rules: RobotsRule[] };

function sourceUrl(postNumber: string) {
  return `https://gall.dcinside.com/board/view/?id=comic_new1&no=${postNumber}`;
}

function sourceId(postNumber: string) {
  return `${SOURCE_PREFIX}-${postNumber}`;
}

function sha256(bytes: Uint8Array) {
  return createHash("sha256").update(bytes).digest("hex");
}

function zodMessage(error: z.ZodError) {
  return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
}

export function parseRobotsGroups(text: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup | undefined;
  for (const originalLine of z.string().min(1).parse(text).split(/\r?\n/u)) {
    const line = originalLine.replace(/#.*$/u, "").trim();
    if (line === "") continue;
    const separator = line.indexOf(":");
    if (separator < 1) continue;
    const directive = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (directive === "user-agent") {
      if (current === undefined || current.rules.length > 0) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      continue;
    }
    if ((directive === "allow" || directive === "disallow") && current !== undefined) {
      current.rules.push({ kind: directive, path: value });
    }
  }
  return groups;
}

export function isGenericRobotsPathAllowed(text: string, targetUrl: string) {
  const target = new URL(z.url().parse(targetUrl));
  const genericGroups = parseRobotsGroups(text).filter((group) => group.agents.includes("*"));
  if (genericGroups.length === 0) return false;
  const path = `${target.pathname}${target.search}`;
  const matches = genericGroups
    .flatMap((group) => group.rules)
    .filter((rule) => {
      if (rule.path === "") return false;
      if (rule.path.includes("*") || rule.path.includes("$")) {
        throw new Error(`Unsupported robots rule syntax: ${rule.path}`);
      }
      return path.startsWith(rule.path);
    })
    .sort(
      (left, right) => right.path.length - left.path.length || (left.kind === "allow" ? -1 : 1),
    );
  return matches[0]?.kind !== "disallow";
}

export function validateBlockedHttpResponse(input: unknown) {
  const result = responseBoundarySchema.safeParse(input);
  if (!result.success) throw new Error(`Invalid DCInside response: ${zodMessage(result.error)}`);
  const response = result.data;
  if (response.status !== 200) {
    throw new Error(`${response.requestedUrl}: expected HTTP 200, received ${response.status}`);
  }
  if (!response.contentType.toLowerCase().includes("text/html")) {
    throw new Error(
      `${response.requestedUrl}: expected text/html, received ${response.contentType}`,
    );
  }
  if (response.contentLength !== null && response.contentLength !== "0") {
    throw new Error(
      `${response.requestedUrl}: expected Content-Length 0, received ${response.contentLength}`,
    );
  }
  if (response.body.byteLength !== 0 || sha256(response.body) !== EMPTY_BODY_SHA256) {
    throw new Error(
      `${response.requestedUrl}: source body is now available; replace the blocked importer with a reviewed parser before writing raw rows`,
    );
  }
  return {
    requestedUrl: response.requestedUrl,
    finalUrl: response.finalUrl,
    status: response.status,
    bodyByteLength: response.body.byteLength,
    bodySha256: EMPTY_BODY_SHA256,
  };
}

function notes(post: Post) {
  const common =
    "2026-08-22 일반 fetch 결과 HTTP 200, Content-Length 0, 본문 0바이트; snapshotSha256은 빈 HTTP 응답 본문의 SHA-256; robots.txt v2.1.2의 User-agent: *는 comic_new1 경로를 허용하지만 로그인·쿠키·User-Agent 위장으로 우회하지 않음; 원문을 확인할 수 없어 raw/membership을 생성하지 않음.";
  if (post.role === "index") {
    return `${common} 이 행은 umbrella 링크 허브이며 367832 위키 검색 안내는 선정 목록이 아니므로 registry 대상에서 제외.`;
  }
  if (post.role === "novel") {
    return `${common} 사용자 지정상 노벨 목록이지만 원문을 보지 못했으므로 raw를 추측하거나 excluded-non-manga membership/exclusion 근거를 날조하지 않고 차단 상태로 유지.`;
  }
  if (post.role === "shorts") {
    return `${common} 단편 목록 369601은 현재 unavailable이며 raw를 추측하지 않고 blocked registry 행만 유지.`;
  }
  return `${common} canonical·성인물·국적 판정을 자동 수행하지 않음.`;
}

export function buildBlockedRegistryRows() {
  return POSTS.map((post) => {
    const url = sourceUrl(post.postNumber);
    const listNature =
      post.role === "index"
        ? "2013년 망갤리스트 umbrella 링크 허브 (본문 접근 차단)"
        : post.role === "novel"
          ? "2013년 망갤리스트 노벨 하위 목록 (본문 접근 차단)"
          : post.role === "shorts"
            ? "2013년 망갤리스트 단편 하위 목록 (본문 접근 차단)"
            : "2013년 망갤리스트 작품 선정 하위 목록 (본문 접근 차단)";
    const row = [
      sourceId(post.postNumber),
      "community",
      "DCInside 201302~201909 만화 갤러리",
      post.title,
      url,
      "2013",
      RETRIEVED_AT,
      listNature,
      "blocked",
      url,
      EMPTY_BODY_SHA256,
      "",
      "",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      notes(post),
    ];
    const result = sourceRegistryRowSchema.safeParse(
      Object.fromEntries(
        SOURCE_REGISTRY_HEADERS.map((header, index) => [header, row[index] ?? ""]),
      ),
    );
    if (!result.success) {
      throw new Error(
        `${post.postNumber}: invalid blocked registry row: ${zodMessage(result.error)}`,
      );
    }
    return row;
  });
}

async function fetchRobots(fetchImpl: Fetch) {
  const response = await fetchImpl(ROBOTS_URL, {
    headers: { accept: "text/plain" },
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`DCInside robots.txt fetch failed: HTTP ${response.status}`);
  const text = await response.text();
  if (text === "") throw new Error("DCInside robots.txt returned an empty body");
  for (const post of POSTS) {
    const url = sourceUrl(post.postNumber);
    if (!isGenericRobotsPathAllowed(text, url)) {
      throw new Error(`${url}: disallowed by the generic robots.txt policy`);
    }
  }
}

async function verifyBlockedSources(fetchImpl: Fetch) {
  await fetchRobots(fetchImpl);
  for (const post of POSTS) {
    const requestedUrl = sourceUrl(post.postNumber);
    const response = await fetchImpl(requestedUrl, {
      headers: { accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    validateBlockedHttpResponse({
      requestedUrl,
      finalUrl: response.url,
      status: response.status,
      contentType: response.headers.get("content-type") ?? "",
      contentLength: response.headers.get("content-length"),
      body: new Uint8Array(await response.arrayBuffer()),
    });
  }
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
  return rows;
}

function checkStaging(root: string, expectedRows: string[][], allowMissing: boolean) {
  const directory = join(root, "data/staging/catalog-expansion");
  const registryPath = join(directory, "source-registry.csv");
  const rawPath = join(directory, "raw-source-items.csv");
  const membershipPath = join(directory, "source-membership.csv");
  const registry = readCsvRows(registryPath, SOURCE_REGISTRY_HEADERS);
  const raw = readCsvRows(rawPath, RAW_HEADERS);
  const membership = readCsvRows(membershipPath, MEMBERSHIP_HEADERS);
  const expectedById = new Map(expectedRows.map((row) => [row[0] ?? "", row]));
  const excludedGuideSourceId = sourceId(EXCLUDED_GUIDE_POST_NUMBER);
  if (registry.some((row) => row[0] === excludedGuideSourceId)) {
    throw new Error(`Non-selection guide must not be registered: ${excludedGuideSourceId}`);
  }
  const actualRows = registry.filter((row) => expectedById.has(row[0] ?? ""));
  if (allowMissing && actualRows.length === 0) {
    if (
      raw.some((row) => (row[1] ?? "").startsWith(`${SOURCE_PREFIX}-`)) ||
      membership.some((row) => (row[1] ?? "").startsWith(`${SOURCE_PREFIX}-`))
    ) {
      throw new Error(
        "Refusing to append blocked registry rows beside existing raw or membership rows",
      );
    }
    return { registryPath, missing: true };
  }
  if (actualRows.length !== expectedRows.length) {
    throw new Error(
      `Blocked DCInside registry subset is partial: expected ${expectedRows.length}, received ${actualRows.length}`,
    );
  }
  for (const actual of actualRows) {
    const id = actual[0] ?? "";
    const expected = expectedById.get(id);
    if (expected === undefined || actual.join("\u0000") !== expected.join("\u0000")) {
      throw new Error(`Blocked DCInside registry row changed: ${id}`);
    }
  }
  if (
    raw.some((row) => expectedById.has(row[1] ?? "")) ||
    membership.some((row) => expectedById.has(row[1] ?? ""))
  ) {
    throw new Error("Blocked DCInside sources must not have inferred raw or membership rows");
  }
  return { registryPath, missing: false };
}

export async function runDcMangaGalleryList2013Import(
  mode: "--check" | "--write",
  root = process.cwd(),
  fetchImpl: Fetch = fetch,
) {
  await verifyBlockedSources(fetchImpl);
  const rows = buildBlockedRegistryRows();
  const staging = checkStaging(root, rows, mode === "--write");
  if (mode === "--write" && staging.missing) {
    const current = readFileSync(staging.registryPath, "utf8");
    if (!current.endsWith("\n")) {
      throw new Error("source-registry.csv must end with a newline before append");
    }
    appendFileSync(staging.registryPath, serializeRows(rows), "utf8");
    checkStaging(root, rows, false);
  }
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  const mode = process.argv[2];
  if (mode !== "--check" && mode !== "--write") {
    console.error("Usage: tsx scripts/import-dc-manga-gallery-list-2013.ts --check|--write");
    process.exitCode = 1;
  } else {
    runDcMangaGalleryList2013Import(mode)
      .then(() =>
        console.log(
          `DC manga gallery 2013 blocked sources ${mode === "--write" ? "recorded" : "verified"}.`,
        ),
      )
      .catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      });
  }
}
