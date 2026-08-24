import { createHash } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

const SOURCE_ID = "fmkorea-otaku-notion";
const SOURCE_URL =
  "https://fmksubculture.notion.site/06de23eed0554485bafeb6c86721eec7?v=c49d4d8a0dee4f29a3de6c662b79a7da";
const PAGE_ID = "06de23ee-d055-4485-bafe-b6c86721eec7";
const COLLECTION_ID = "45bea267-5577-46c3-9c36-dc9e47989454";
const VIEW_ID = "c49d4d8a-0dee-4f29-a3de-6c662b79a7da";
const SPACE_ID = "a4ae95cc-b7f7-4156-8922-f04ce0c0f712";
const PAGE_TITLE = "만화 추천 목록";
const PAGE_LAST_EDITED_TIME = 1_677_499_508_723;
const PUBLISHED_AT = "2023-02-27";
const RETRIEVED_AT = "2026-08-22";
const EXPECTED_ITEM_COUNT = 170;
const EXPECTED_PAYLOAD_SHA256 = "5b188986d0839de8dfd580a830ca91acecac90651503c9c93eef42980e51bc9d";
const QUERY_LIMIT = 500;

const EXPECTED_PROPERTIES = [
  { id: "title", name: "이름", type: "title", optionCount: 0 },
  { id: ";DN^", name: "작가", type: "multi_select", optionCount: 182 },
  { id: "E_AU", name: "연재 시작", type: "select", optionCount: 31 },
  { id: "k@?^", name: "연재 상태", type: "select", optionCount: 4 },
  { id: "qWVR", name: "태그", type: "multi_select", optionCount: 45 },
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

const uuidSchema = z.string().regex(/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/u);
const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const optionalIdSchema = z.union([z.literal(""), idSchema]);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u);
const timestampSchema = z.string().datetime({ offset: true });
const countSchema = z.string().regex(/^\d+$/u);
const optionalCountSchema = z.string().regex(/^\d*$/u);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const matrixSchema = z.array(z.array(z.string()));
const richTextSegmentSchema = z.union([
  z.tuple([z.string()]),
  z.tuple([z.string(), z.array(z.unknown())]),
]);
const richTextSchema = z.array(richTextSegmentSchema);
const notionPropertySchema = z.object({
  name: z.string().min(1),
  type: z.enum(["title", "select", "multi_select"]),
  options: z.array(z.object({ value: z.string().min(1) })).optional(),
});
const pageBlockSchema = z.object({
  id: uuidSchema,
  type: z.literal("collection_view_page"),
  view_ids: z.array(uuidSchema),
  collection_id: uuidSchema,
  created_time: z.number().int().positive(),
  last_edited_time: z.number().int().positive(),
  alive: z.literal(true),
  space_id: uuidSchema,
});
const collectionSchema = z.object({
  id: uuidSchema,
  name: richTextSchema,
  description: richTextSchema,
  schema: z.record(z.string(), notionPropertySchema),
  parent_id: uuidSchema,
  parent_table: z.literal("block"),
  alive: z.literal(true),
  space_id: uuidSchema,
});
const collectionViewSchema = z.object({
  id: uuidSchema,
  type: z.literal("gallery"),
  name: z.string().min(1),
  parent_id: uuidSchema,
  parent_table: z.literal("block"),
  alive: z.literal(true),
  space_id: uuidSchema,
});
const pageRecordSchema = z.object({
  spaceId: uuidSchema,
  value: z.object({ value: pageBlockSchema, role: z.literal("reader") }),
});
const collectionRecordSchema = z.object({
  spaceId: uuidSchema,
  value: z.object({ value: collectionSchema, role: z.literal("reader") }),
});
const collectionViewRecordSchema = z.object({
  spaceId: uuidSchema,
  value: z.object({ value: collectionViewSchema, role: z.literal("reader") }),
});
const pageResponseSchema = z.object({
  recordMap: z.object({
    block: z.record(z.string(), pageRecordSchema),
    collection: z.record(z.string(), collectionRecordSchema),
    collection_view: z.record(z.string(), collectionViewRecordSchema),
  }),
});
const genericRecordSchema = z.object({
  spaceId: uuidSchema,
  value: z.object({ value: z.unknown(), role: z.string().min(1) }),
});
const queryResponseSchema = z.object({
  result: z.object({
    type: z.literal("reducer"),
    reducerResults: z.object({
      collection_group_results: z.object({
        type: z.literal("results"),
        blockIds: z.array(uuidSchema),
        hasMore: z.boolean(),
      }),
    }),
    sizeHint: z.number().int().nonnegative(),
  }),
  recordMap: z.object({ block: z.record(z.string(), genericRecordSchema) }),
  collectionIds: z.array(uuidSchema),
  allBlockIds: z.array(uuidSchema),
});
const rowBlockSchema = z.object({
  id: uuidSchema,
  type: z.literal("page"),
  properties: z.record(z.string(), richTextSchema),
  created_time: z.number().int().positive(),
  last_edited_time: z.number().int().positive(),
  parent_id: uuidSchema,
  parent_table: z.literal("collection"),
  alive: z.literal(true),
  space_id: uuidSchema,
});
const sourceRegistryRowSchema = z.strictObject({
  sourceId: idSchema,
  sourceKind: z.enum(["community", "award", "bookseller", "sales", "publisher", "editorial"]),
  organization: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
  publishedAt: dateSchema,
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
  sourceId: z.literal(SOURCE_ID),
  sourceRowNumber: z.string().regex(/^[1-9]\d*$/u),
  rawPublicationClass: z.string().min(1),
  rawTitle: z.string().min(1),
  rawCreator: z.string().min(1),
  rawMainGenre: z.string().min(1),
  rawSubgenre: z.string(),
  rawRating: z.string(),
  rawNotes: z.string().min(1),
  rawUpdatedAt: timestampSchema,
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
  sourceId: z.literal(SOURCE_ID),
  status: membershipStatusSchema,
  candidateId: optionalIdSchema,
  workId: optionalIdSchema,
  decisionRef: optionalIdSchema,
});

type RichText = z.infer<typeof richTextSchema>;
type MembershipRow = z.infer<typeof membershipRowSchema>;
type CanonicalProperty = {
  id: string;
  name: string;
  type: "title" | "select" | "multi_select";
  options: string[];
};
type CanonicalRowProperty = { id: string; name: string; value: RichText };
type CanonicalRow = {
  id: string;
  createdTime: number;
  lastEditedTime: number;
  properties: CanonicalRowProperty[];
};
type CanonicalPayload = {
  sourceUrl: string;
  page: {
    id: string;
    title: string;
    description: RichText;
    createdTime: number;
    lastEditedTime: number;
    collectionId: string;
    viewId: string;
    viewName: string;
  };
  properties: CanonicalProperty[];
  rows: CanonicalRow[];
};
type ImportRows = { registry: string[][]; raw: string[][]; membership: string[][] };
type StagingRows = ImportRows & {
  paths: { registry: string; raw: string; membership: string };
};

const STATIC_REGISTRY_COLUMNS = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 20] as const;

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function zodMessage(error: z.ZodError) {
  return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
}

function flattenRichText(value: RichText) {
  return value.map((segment) => segment[0]).join("");
}

function isoTimestamp(value: number) {
  return new Date(value).toISOString();
}

function requireRecord<T>(records: Readonly<Record<string, T>>, id: string, label: string) {
  const record = records[id];
  if (record === undefined) throw new Error(`Missing ${label}: ${id}`);
  return record;
}

function assertSameIds(actual: readonly string[], expected: readonly string[], label: string) {
  if (actual.length !== expected.length || new Set(actual).size !== actual.length) {
    throw new Error(`${label}: duplicate or missing IDs`);
  }
  const expectedIds = new Set(expected);
  if (expectedIds.size !== actual.length || actual.some((id) => !expectedIds.has(id))) {
    throw new Error(`${label}: ID sets differ`);
  }
}

async function postJson(path: string, body: unknown, headers: Record<string, string> = {}) {
  const response = await fetch(new URL(path, SOURCE_URL), {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`${path}: fetch failed with HTTP ${response.status}`);
  const text = await response.text();
  try {
    return JSON.parse(text) as unknown;
  } catch (error: unknown) {
    throw new Error(
      `${path}: invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function fetchPageResponse() {
  return postJson("/api/v3/loadCachedPageChunk", {
    pageId: PAGE_ID,
    limit: 100,
    cursor: { stack: [] },
    chunkNumber: 0,
    verticalColumns: false,
  });
}

async function fetchCollectionResponse() {
  return postJson(
    "/api/v3/queryCollection",
    {
      collectionView: { id: VIEW_ID, spaceId: SPACE_ID },
      source: { type: "collection", id: COLLECTION_ID, spaceId: SPACE_ID },
      loader: {
        userTimeZone: "Asia/Tokyo",
        archiveStatus: "NON_ARCHIVED",
        searchQuery: "",
        sort: [],
        reducers: {
          collection_group_results: {
            type: "results",
            limit: QUERY_LIMIT,
            loadContentCover: false,
          },
        },
      },
      clientType: "notion_app",
    },
    { "x-notion-space-id": SPACE_ID },
  );
}

function parsePage(input: unknown) {
  const result = pageResponseSchema.safeParse(input);
  if (!result.success) throw new Error(`Invalid Notion page payload: ${zodMessage(result.error)}`);
  const { recordMap } = result.data;
  const pageRecord = requireRecord(recordMap.block, PAGE_ID, "page block");
  const collectionRecord = requireRecord(recordMap.collection, COLLECTION_ID, "collection");
  const viewRecord = requireRecord(recordMap.collection_view, VIEW_ID, "collection view");
  for (const [label, record] of [
    ["page", pageRecord],
    ["collection", collectionRecord],
    ["view", viewRecord],
  ] as const) {
    if (record.spaceId !== SPACE_ID || record.value.value.space_id !== SPACE_ID) {
      throw new Error(`${label}: unexpected Notion space`);
    }
  }

  const page = pageRecord.value.value;
  const collection = collectionRecord.value.value;
  const view = viewRecord.value.value;
  if (
    page.id !== PAGE_ID ||
    page.collection_id !== COLLECTION_ID ||
    page.view_ids.length !== 1 ||
    page.view_ids[0] !== VIEW_ID
  ) {
    throw new Error("Notion page no longer points to the frozen collection view");
  }
  if (
    collection.id !== COLLECTION_ID ||
    collection.parent_id !== PAGE_ID ||
    view.id !== VIEW_ID ||
    view.parent_id !== PAGE_ID
  ) {
    throw new Error("Notion collection ownership changed");
  }
  if (flattenRichText(collection.name) !== PAGE_TITLE) {
    throw new Error(`Notion title changed: ${flattenRichText(collection.name)}`);
  }
  if (page.last_edited_time !== PAGE_LAST_EDITED_TIME) {
    throw new Error(
      `Notion page modified: expected ${isoTimestamp(PAGE_LAST_EDITED_TIME)}, received ${isoTimestamp(page.last_edited_time)}`,
    );
  }

  const actualPropertyIds = Object.keys(collection.schema);
  assertSameIds(
    actualPropertyIds,
    EXPECTED_PROPERTIES.map((property) => property.id),
    "Notion property schema",
  );
  const properties: CanonicalProperty[] = EXPECTED_PROPERTIES.map((expected) => {
    const property = requireRecord(collection.schema, expected.id, "collection property");
    const options = (property.options ?? []).map((option) => option.value);
    if (
      property.name !== expected.name ||
      property.type !== expected.type ||
      options.length !== expected.optionCount ||
      new Set(options).size !== options.length
    ) {
      throw new Error(`Notion property changed: ${expected.name}`);
    }
    return { id: expected.id, name: expected.name, type: expected.type, options: options.sort() };
  });

  return {
    page: {
      id: page.id,
      title: PAGE_TITLE,
      description: collection.description,
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      collectionId: collection.id,
      viewId: view.id,
      viewName: view.name,
    },
    properties,
  };
}

function parseRows(input: unknown): CanonicalRow[] {
  const result = queryResponseSchema.safeParse(input);
  if (!result.success) {
    throw new Error(`Invalid Notion collection payload: ${zodMessage(result.error)}`);
  }
  const reducer = result.data.result.reducerResults.collection_group_results;
  if (reducer.hasMore) throw new Error(`Notion collection exceeds query limit ${QUERY_LIMIT}`);
  if (
    reducer.blockIds.length !== EXPECTED_ITEM_COUNT ||
    result.data.result.sizeHint !== EXPECTED_ITEM_COUNT
  ) {
    throw new Error(
      `Notion row count changed: expected ${EXPECTED_ITEM_COUNT}, received ${reducer.blockIds.length}`,
    );
  }
  if (result.data.collectionIds.length !== 1 || result.data.collectionIds[0] !== COLLECTION_ID) {
    throw new Error("Notion query returned an unexpected collection");
  }
  assertSameIds(result.data.allBlockIds, reducer.blockIds, "Notion query rows");

  return reducer.blockIds.map((id) => {
    const record = requireRecord(result.data.recordMap.block, id, "Notion row");
    const rowResult = rowBlockSchema.safeParse(record.value.value);
    if (!rowResult.success) {
      throw new Error(`Invalid Notion row ${id}: ${zodMessage(rowResult.error)}`);
    }
    const row = rowResult.data;
    if (
      record.spaceId !== SPACE_ID ||
      record.value.role !== "reader" ||
      row.id !== id ||
      row.parent_id !== COLLECTION_ID ||
      row.space_id !== SPACE_ID
    ) {
      throw new Error(`Notion row ${id} crossed the frozen collection boundary`);
    }
    assertSameIds(
      Object.keys(row.properties),
      EXPECTED_PROPERTIES.map((property) => property.id),
      `Notion row ${id} properties`,
    );
    const properties = EXPECTED_PROPERTIES.map((property) => ({
      id: property.id,
      name: property.name,
      value: requireRecord(row.properties, property.id, `Notion row ${id} property`),
    }));
    if (
      flattenRichText(properties[0]!.value) === "" ||
      flattenRichText(properties[1]!.value) === ""
    ) {
      throw new Error(`Notion row ${id} has no title or creator`);
    }
    return {
      id: row.id,
      createdTime: row.created_time,
      lastEditedTime: row.last_edited_time,
      properties,
    };
  });
}

async function fetchSnapshot(): Promise<CanonicalPayload> {
  const [pageInput, collectionInput] = await Promise.all([
    fetchPageResponse(),
    fetchCollectionResponse(),
  ]);
  const page = parsePage(pageInput);
  const payload: CanonicalPayload = {
    sourceUrl: SOURCE_URL,
    page: page.page,
    properties: page.properties,
    rows: parseRows(collectionInput),
  };
  const digest = sha256(JSON.stringify(payload));
  if (digest !== EXPECTED_PAYLOAD_SHA256) {
    throw new Error(
      `${SOURCE_ID}: payload drift: expected ${EXPECTED_PAYLOAD_SHA256}, received ${digest}`,
    );
  }
  return payload;
}

function rowValue(row: CanonicalRow, propertyId: string) {
  const property = row.properties.find((candidate) => candidate.id === propertyId);
  if (property === undefined) throw new Error(`${row.id}: missing property ${propertyId}`);
  return flattenRichText(property.value);
}

function rawNotes(row: CanonicalRow) {
  return JSON.stringify({
    notionPageId: row.id,
    createdTime: isoTimestamp(row.createdTime),
    lastEditedTime: isoTimestamp(row.lastEditedTime),
    properties: Object.fromEntries(
      row.properties.map((property) => [property.name, { id: property.id, value: property.value }]),
    ),
  });
}

function buildRows(payload: CanonicalPayload): ImportRows {
  const registry = [
    [
      SOURCE_ID,
      "community",
      "FMKorea 오덕양성소",
      PAGE_TITLE,
      SOURCE_URL,
      PUBLISHED_AT,
      RETRIEVED_AT,
      "에펨코리아 오덕양성소 공개 만화 추천 데이터베이스",
      "adjudicating",
      SOURCE_URL,
      EXPECTED_PAYLOAD_SHA256,
      String(EXPECTED_ITEM_COUNT),
      "",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      String(EXPECTED_ITEM_COUNT),
      "공개 Notion collection API 추출; page last_edited_time=2023-02-27T12:05:08.723Z; hash 범위는 원본 URL, 페이지 메타데이터, 5개 속성·옵션, view 순서의 170개 행과 원문 rich-text 값; 일본 만화·웹툰·성인물 여부는 자동 판정하지 않고 전부 unresolved 유지.",
    ],
  ];
  const raw: string[][] = [];
  const membership: string[][] = [];
  for (const [index, row] of payload.rows.entries()) {
    const sourceItemId = `${SOURCE_ID}-${row.id.replaceAll("-", "")}`;
    raw.push([
      sourceItemId,
      SOURCE_ID,
      String(index + 1),
      rowValue(row, "k@?^"),
      rowValue(row, "title"),
      rowValue(row, ";DN^"),
      rowValue(row, "qWVR"),
      "",
      "",
      rawNotes(row),
      isoTimestamp(row.lastEditedTime),
    ]);
    membership.push([sourceItemId, SOURCE_ID, "unresolved", "", "", ""]);
  }
  return { registry, raw, membership };
}

export async function buildFmkoreaOtakuNotionImport() {
  const payload = await fetchSnapshot();
  const rows = buildRows(payload);
  if (
    rows.registry.length !== 1 ||
    rows.raw.length !== EXPECTED_ITEM_COUNT ||
    rows.membership.length !== EXPECTED_ITEM_COUNT
  ) {
    throw new Error("Built FMKorea Notion row count is incomplete");
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
    staging.registry.filter((row) => row[0] === SOURCE_ID),
    0,
    "FMKorea Notion sourceId",
  );
  const actualRaw = indexRows(
    staging.raw.filter((row) => row[1] === SOURCE_ID),
    0,
    "FMKorea Notion sourceItemId",
  );
  const actualMembership = indexRows(
    staging.membership.filter((row) => row[1] === SOURCE_ID),
    0,
    "FMKorea Notion membership",
  );
  assertSameKeys(actualRegistry, expectedRegistry, "FMKorea Notion source");
  assertSameKeys(actualRaw, expectedRaw, "FMKorea Notion raw item");
  assertSameKeys(actualMembership, expectedMembership, "FMKorea Notion membership");

  const sourceRow = actualRegistry.get(SOURCE_ID)!;
  const source = parseRow(
    sourceRow,
    SOURCE_REGISTRY_HEADERS,
    sourceRegistryRowSchema,
    `Invalid source registry row ${SOURCE_ID}`,
  );
  const expectedSourceRow = expectedRegistry.get(SOURCE_ID)!;
  for (const column of STATIC_REGISTRY_COLUMNS) {
    if (sourceRow[column] !== expectedSourceRow[column]) {
      throw new Error(
        `${SOURCE_ID}: source registry field ${SOURCE_REGISTRY_HEADERS[column]} changed`,
      );
    }
  }
  for (const [sourceItemId, expectedRow] of expectedRaw) {
    const actualRow = actualRaw.get(sourceItemId)!;
    parseRow(actualRow, RAW_HEADERS, rawRowSchema, `Invalid raw item ${sourceItemId}`);
    if (actualRow.join("\u0000") !== expectedRow.join("\u0000")) {
      throw new Error(`Raw source item changed: ${sourceItemId}`);
    }
  }

  const memberships: MembershipRow[] = [];
  for (const [sourceItemId] of expectedMembership) {
    const membership = parseRow(
      actualMembership.get(sourceItemId)!,
      MEMBERSHIP_HEADERS,
      membershipRowSchema,
      `Invalid membership ${sourceItemId}`,
    );
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

  const statusCount = (status: MembershipRow["status"]) =>
    memberships.filter((row) => row.status === status).length;
  const mappedCandidates = new Set(
    memberships
      .filter((row) => row.status === "included" || row.status === "duplicate")
      .map((row) => row.candidateId),
  );
  const expectedCounts: Array<[string, number, number]> = [
    ["originalItemCount", numeric(source.originalItemCount), memberships.length],
    ["excludedWebtoonCount", numeric(source.excludedWebtoonCount), statusCount("excluded-webtoon")],
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
    if (declared !== actual)
      throw new Error(`${SOURCE_ID}: ${field} is ${declared}, expected ${actual}`);
  }
  if (source.registryStatus === "complete") {
    const japaneseMangaCount = statusCount("included") + statusCount("duplicate");
    if (
      source.japaneseMangaItemCount === "" ||
      numeric(source.japaneseMangaItemCount) !== japaneseMangaCount
    ) {
      throw new Error(`${SOURCE_ID}: invalid japaneseMangaItemCount`);
    }
  }
}

function appendRows(path: string, rows: readonly string[][]) {
  const current = readFileSync(path, "utf8");
  appendFileSync(path, `${current.endsWith("\n") ? "" : "\n"}${serializeRows(rows)}`, "utf8");
}

function targetRowCount(staging: StagingRows) {
  return (
    staging.registry.filter((row) => row[0] === SOURCE_ID).length +
    staging.raw.filter((row) => row[1] === SOURCE_ID).length +
    staging.membership.filter((row) => row[1] === SOURCE_ID).length
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

export async function runFmkoreaOtakuNotionImport(
  mode: "--check" | "--write",
  root = process.cwd(),
) {
  const expected = await buildFmkoreaOtakuNotionImport();
  const staging = readStagingRows(root);
  if (mode === "--check") {
    checkSubset(staging, expected);
    return { appended: false, itemCount: expected.raw.length, sha256: EXPECTED_PAYLOAD_SHA256 };
  }
  if (targetRowCount(staging) > 0) {
    checkSubset(staging, expected);
    return { appended: false, itemCount: expected.raw.length, sha256: EXPECTED_PAYLOAD_SHA256 };
  }
  assertNoKeyCollisions(staging, expected);
  appendRows(staging.paths.registry, expected.registry);
  appendRows(staging.paths.raw, expected.raw);
  appendRows(staging.paths.membership, expected.membership);
  return { appended: true, itemCount: expected.raw.length, sha256: EXPECTED_PAYLOAD_SHA256 };
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  const mode = process.argv[2];
  if (mode !== "--check" && mode !== "--write") {
    console.error("Usage: tsx scripts/import-fmkorea-otaku-notion.ts --check|--write");
    process.exitCode = 1;
  } else {
    runFmkoreaOtakuNotionImport(mode)
      .then(({ appended, itemCount, sha256: digest }) =>
        console.log(
          `FMKorea Notion ${appended ? "appended" : "verified"}: 1 source / ${itemCount} items / sha256 ${digest}.`,
        ),
      )
      .catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      });
  }
}
