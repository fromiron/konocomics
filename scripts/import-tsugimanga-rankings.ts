import { createHash } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

const RETRIEVED_AT = "2026-08-22";
const EXPECTED_SOURCE_COUNT = 24;
const EXPECTED_ITEM_COUNT = 1_150;
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

type Division = "comics" | "web";
type SourceConfig = {
  sourceId: string;
  year: number;
  division: Division;
  url: string;
  publishedAt: string;
  count: number;
  sha256: string;
};

const SOURCE_CONFIGS = [
  {
    sourceId: "tsugimanga-2015-comics",
    year: 2015,
    division: "comics",
    url: "https://tsugimanga.jp/winner/2015/comics",
    publishedAt: "2015-02-06",
    count: 50,
    sha256: "c5f5e8e269bb0094df99134bcddc60652039aff6cf5ffc057b3c6bcb1c233322",
  },
  {
    sourceId: "tsugimanga-2015-web",
    year: 2015,
    division: "web",
    url: "https://tsugimanga.jp/winner/2015/web",
    publishedAt: "2015-02-06",
    count: 20,
    sha256: "05ad42f7396ff142f92fdf589386d3befa6a7722f9d8a3372662d124ebe28590",
  },
  {
    sourceId: "tsugimanga-2016-comics",
    year: 2016,
    division: "comics",
    url: "https://tsugimanga.jp/winner/2016/comics",
    publishedAt: "2016-02-04",
    count: 50,
    sha256: "497ad254e79ba11d1fe5dd72534b0136842056c03f9e0f0cdd8ad2a2e144dd81",
  },
  {
    sourceId: "tsugimanga-2016-web",
    year: 2016,
    division: "web",
    url: "https://tsugimanga.jp/winner/2016/web",
    publishedAt: "2016-02-04",
    count: 30,
    sha256: "b1959128a77a1d386032523dfb9078e441946274e2b85c9ce4b0ec74f8398c70",
  },
  {
    sourceId: "tsugimanga-2017-comics",
    year: 2017,
    division: "comics",
    url: "https://tsugimanga.jp/winner/2017/comics",
    publishedAt: "2017-08-23",
    count: 50,
    sha256: "a0129c3b70f9a6c9c88b675ef51fa9ab746e3a33a80d0a2414dd74b016c547c0",
  },
  {
    sourceId: "tsugimanga-2017-web",
    year: 2017,
    division: "web",
    url: "https://tsugimanga.jp/winner/2017/web",
    publishedAt: "2017-08-23",
    count: 50,
    sha256: "d437cf1b4f20e70ba00d9433eeec65d0a4b5b5c173fb55a85b26a2ceadd57e50",
  },
  {
    sourceId: "tsugimanga-2018-comics",
    year: 2018,
    division: "comics",
    url: "https://tsugimanga.jp/winner/2018/comics",
    publishedAt: "2018-08-23",
    count: 50,
    sha256: "1a46d683127cea6a486f7db82b805e30ed4f826140ab04b0fd3ea02fabc58239",
  },
  {
    sourceId: "tsugimanga-2018-web",
    year: 2018,
    division: "web",
    url: "https://tsugimanga.jp/winner/2018/web",
    publishedAt: "2018-08-23",
    count: 50,
    sha256: "c7eaac6139ca5a1a6a0deb822fa5c8025e8cefd30fe688bd492449df15d92dfd",
  },
  {
    sourceId: "tsugimanga-2019-comics",
    year: 2019,
    division: "comics",
    url: "https://tsugimanga.jp/winner/2019/comics",
    publishedAt: "2019-08-22",
    count: 50,
    sha256: "5881761ac08865f8a22e5d53af3610c5f96a1a658fe47a1c6e811c9bd6467f02",
  },
  {
    sourceId: "tsugimanga-2019-web",
    year: 2019,
    division: "web",
    url: "https://tsugimanga.jp/winner/2019/web",
    publishedAt: "2019-08-22",
    count: 50,
    sha256: "4012c4c3785184025f80fd67ff7f9ad9eaf8f3b4fa3040f7d125b5097b196e02",
  },
  {
    sourceId: "tsugimanga-2020-comics",
    year: 2020,
    division: "comics",
    url: "https://tsugimanga.jp/winner/2020/comics",
    publishedAt: "2020-08-19",
    count: 50,
    sha256: "3972e139b2daf07b3eaf88ea36520d925478ccd58d26ec1d8f205faf9d972b1e",
  },
  {
    sourceId: "tsugimanga-2020-web",
    year: 2020,
    division: "web",
    url: "https://tsugimanga.jp/winner/2020/web",
    publishedAt: "2020-08-19",
    count: 50,
    sha256: "ba9c82535b4d740a8883def03bff7474b7aec83d0028e7be0730bd6120e5d486",
  },
  {
    sourceId: "tsugimanga-2021-comics",
    year: 2021,
    division: "comics",
    url: "https://tsugimanga.jp/winner/2021/comics",
    publishedAt: "2021-08-24",
    count: 40,
    sha256: "7128cdbe28966d76f5dcf1b1c7c2892dc43f42e0cb82cf954612bfad9b44e137",
  },
  {
    sourceId: "tsugimanga-2021-web",
    year: 2021,
    division: "web",
    url: "https://tsugimanga.jp/winner/2021/web",
    publishedAt: "2021-08-24",
    count: 60,
    sha256: "8a89f64bec201ee44413061e3c8d6b34759aa9bb0b1598b3afc8746b3f2e79ed",
  },
  {
    sourceId: "tsugimanga-2022-comics",
    year: 2022,
    division: "comics",
    url: "https://tsugimanga.jp/winner/2022/comics",
    publishedAt: "2022-08-31",
    count: 40,
    sha256: "dcde2def2a21a161c9136bc60e1029762e022e2acf2327f309628058c35666a4",
  },
  {
    sourceId: "tsugimanga-2022-web",
    year: 2022,
    division: "web",
    url: "https://tsugimanga.jp/winner/2022/web",
    publishedAt: "2022-08-31",
    count: 60,
    sha256: "216bd4c36e5883222d84d8d09add7de0f2d04dd56f06888cc7698e6a1dcae1f1",
  },
  {
    sourceId: "tsugimanga-2023-comics",
    year: 2023,
    division: "comics",
    url: "https://tsugimanga.jp/winner/2023/comics",
    publishedAt: "2023-08-31",
    count: 40,
    sha256: "8ee40595744ed029839f058ba668dd4cc8d7af5113031c4621884dbbbfe79eaf",
  },
  {
    sourceId: "tsugimanga-2023-web",
    year: 2023,
    division: "web",
    url: "https://tsugimanga.jp/winner/2023/web",
    publishedAt: "2023-08-31",
    count: 60,
    sha256: "947dfef624029b4c5242374b85ea2b58de45df169fd6f8c75535ccce1d152050",
  },
  {
    sourceId: "tsugimanga-2024-comics",
    year: 2024,
    division: "comics",
    url: "https://tsugimanga.jp/winner/2024/comics",
    publishedAt: "2024-08-28",
    count: 40,
    sha256: "51397a5e7338e823d3aa003aefb7e6cbb255b0044ab37de48cc7294b1c95eb9e",
  },
  {
    sourceId: "tsugimanga-2024-web",
    year: 2024,
    division: "web",
    url: "https://tsugimanga.jp/winner/2024/web",
    publishedAt: "2024-08-28",
    count: 60,
    sha256: "20e1b97ad4adbf48bec7d7c3e8e4e55e1d0664481b2b0b84c41b1de7f4391f6a",
  },
  {
    sourceId: "tsugimanga-2025-comics",
    year: 2025,
    division: "comics",
    url: "https://tsugimanga.jp/winner/2025/comics",
    publishedAt: "2025-09-18",
    count: 40,
    sha256: "d42c3febebed1e69a1317ee8b26fff29854aa39459be56fc7a9882c4f4b9cf7e",
  },
  {
    sourceId: "tsugimanga-2025-web",
    year: 2025,
    division: "web",
    url: "https://tsugimanga.jp/winner/2025/web",
    publishedAt: "2025-09-18",
    count: 60,
    sha256: "512a6e15a5951891ee0c9bc084c54e1cc0c7092bdf9790a989749b524f817537",
  },
  {
    sourceId: "tsugimanga-2026-comics",
    year: 2026,
    division: "comics",
    url: "https://tsugimanga.jp/nominate/comics",
    publishedAt: "2026-06-26",
    count: 40,
    sha256: "3c2331fd41b7fd76ef8e38828cd37738f9f4e3cdf0503122487e003b5b9f7112",
  },
  {
    sourceId: "tsugimanga-2026-web",
    year: 2026,
    division: "web",
    url: "https://tsugimanga.jp/nominate/web",
    publishedAt: "2026-06-26",
    count: 60,
    sha256: "0808ac4c89f26380d34f33cafdcece16b65634bd6b37ab8fdaa79da4742fd502",
  },
] as const satisfies readonly SourceConfig[];

const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const optionalIdSchema = z.union([z.literal(""), idSchema]);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u);
const countSchema = z.string().regex(/^\d+$/u);
const optionalCountSchema = z.string().regex(/^\d*$/u);
const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
const divisionSchema = z.enum(["comics", "web"]);
const storeSchema = z.record(z.string(), z.string().nullable());
const winnerEntrySchema = z.strictObject({
  id: z.number().int().positive(),
  title: z.string().min(1),
  author: z.string().min(1),
  thumbnail: z.url(),
  award: z.string().nullable(),
  comment: z.record(z.string(), z.unknown()).nullable(),
  description: z.string().nullable(),
  point: z.number().int().nonnegative().nullable(),
  rank: z.number().int().positive().nullable(),
  store: storeSchema,
});
const nomineeEntrySchema = z.strictObject({
  id: z.number().int().positive(),
  title: z.string().min(1),
  author: z.string().min(1),
  thumbnail: z.url(),
  store: storeSchema,
});
const detailsSchema = z.strictObject({
  entryCount: z.number().int().positive(),
  voteCount: z.number().int().nonnegative(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/u),
});
const winnerNextDataSchema = z.object({
  props: z.object({
    pageProps: z.strictObject({
      data: z.strictObject({
        details: detailsSchema,
        entries: z.array(winnerEntrySchema),
      }),
      category: divisionSchema,
      year: z.string().regex(/^\d{4}$/u),
    }),
  }),
});
const nomineeNextDataSchema = z.object({
  props: z.object({
    pageProps: z.strictObject({
      category: divisionSchema,
      data: z.strictObject({ entries: z.array(nomineeEntrySchema) }),
    }),
  }),
});
const matrixSchema = z.array(z.array(z.string()));
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
  sourceId: idSchema,
  sourceRowNumber: z.string().regex(/^[1-9]\d*$/u),
  rawPublicationClass: divisionSchema,
  rawTitle: z.string().min(1),
  rawCreator: z.string().min(1),
  rawMainGenre: z.string(),
  rawSubgenre: z.string(),
  rawRating: z.string().min(1),
  rawNotes: z.string(),
  rawUpdatedAt: dateSchema,
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

type SourceRegistryRow = z.infer<typeof sourceRegistryRowSchema>;
type MembershipRow = z.infer<typeof membershipRowSchema>;
type CanonicalEntry = {
  id: number;
  title: string;
  author: string;
  rank: number | null;
  point: number | null;
  award: string | null;
};
type CanonicalPayload = {
  details: z.infer<typeof detailsSchema> | null;
  entries: CanonicalEntry[];
};
type SourceSnapshot = { config: SourceConfig; payload: CanonicalPayload };
type ImportRows = {
  registry: string[][];
  raw: string[][];
  membership: string[][];
};
type StagingRows = ImportRows & {
  paths: { registry: string; raw: string; membership: string };
};

const TARGET_SOURCE_IDS: ReadonlySet<string> = new Set(
  SOURCE_CONFIGS.map((config) => config.sourceId),
);
const STATIC_REGISTRY_COLUMNS = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 20] as const;

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function zodMessage(error: z.ZodError) {
  return error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
}

function parseNextData(html: string, config: SourceConfig): CanonicalPayload {
  const script = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/u,
  )?.[1];
  if (script === undefined) {
    throw new Error(`${config.sourceId}: __NEXT_DATA__ was not found`);
  }

  let input: unknown;
  try {
    input = JSON.parse(script);
  } catch (error: unknown) {
    throw new Error(
      `${config.sourceId}: invalid __NEXT_DATA__ JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (config.year === 2026) {
    const result = nomineeNextDataSchema.safeParse(input);
    if (!result.success) {
      throw new Error(`${config.sourceId}: invalid nominee payload: ${zodMessage(result.error)}`);
    }
    const { category, data } = result.data.props.pageProps;
    if (category !== config.division) {
      throw new Error(`${config.sourceId}: expected ${config.division}, received ${category}`);
    }
    return {
      details: null,
      entries: data.entries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        author: entry.author,
        rank: null,
        point: null,
        award: null,
      })),
    };
  }

  const result = winnerNextDataSchema.safeParse(input);
  if (!result.success) {
    throw new Error(`${config.sourceId}: invalid winner payload: ${zodMessage(result.error)}`);
  }
  const { category, data, year } = result.data.props.pageProps;
  if (category !== config.division || year !== String(config.year)) {
    throw new Error(
      `${config.sourceId}: expected ${config.year}/${config.division}, received ${year}/${category}`,
    );
  }
  if (data.details.date.slice(0, 10) !== config.publishedAt) {
    throw new Error(
      `${config.sourceId}: expected publishedAt ${config.publishedAt}, received ${data.details.date}`,
    );
  }
  return {
    details: {
      entryCount: data.details.entryCount,
      voteCount: data.details.voteCount,
      date: data.details.date,
    },
    entries: data.entries.map((entry) => ({
      id: entry.id,
      title: entry.title,
      author: entry.author,
      rank: entry.rank,
      point: entry.point,
      award: entry.award,
    })),
  };
}

async function fetchSource(config: SourceConfig): Promise<SourceSnapshot> {
  const response = await fetch(config.url, {
    headers: { accept: "text/html" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`${config.sourceId}: fetch failed with HTTP ${response.status}`);
  }
  const payload = parseNextData(await response.text(), config);
  if (payload.entries.length !== config.count) {
    throw new Error(
      `${config.sourceId}: expected ${config.count} entries, received ${payload.entries.length}`,
    );
  }
  for (const [index, entry] of payload.entries.entries()) {
    if (entry.id !== index + 1) {
      throw new Error(`${config.sourceId}: expected sequential entry id ${index + 1}`);
    }
  }
  const digest = sha256(JSON.stringify(payload));
  if (digest !== config.sha256) {
    throw new Error(
      `${config.sourceId}: payload drift: expected ${config.sha256}, received ${digest}`,
    );
  }
  return { config, payload };
}

function rawNotes(entry: CanonicalEntry) {
  const notes: string[] = [];
  if (entry.point !== null) notes.push(`point=${entry.point}`);
  if (entry.award !== null) notes.push(`award=${entry.award}`);
  return notes.join("; ");
}

function buildRows(snapshots: readonly SourceSnapshot[]): ImportRows {
  const registry: string[][] = [];
  const raw: string[][] = [];
  const membership: string[][] = [];
  for (const { config, payload } of snapshots) {
    const divisionName = config.division === "comics" ? "コミックス部門" : "Webマンガ部門";
    registry.push([
      config.sourceId,
      "award",
      "KADOKAWA「次にくるマンガ大賞」",
      `次にくるマンガ大賞 ${config.year} ${divisionName}`,
      config.url,
      config.publishedAt,
      RETRIEVED_AT,
      config.year === 2026 ? "공식 후보 목록" : "공식 후보·최종 순위",
      "adjudicating",
      config.url,
      config.sha256,
      String(config.count),
      "",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      String(config.count),
      "공식 __NEXT_DATA__ 추출; hash 범위는 details와 id/title/author/rank/point/award; Web 부문도 형식 판정 전에는 unresolved 유지.",
    ]);
    for (const entry of payload.entries) {
      const sourceItemId = `${config.sourceId}-${String(entry.id).padStart(3, "0")}`;
      raw.push([
        sourceItemId,
        config.sourceId,
        String(entry.id),
        config.division,
        entry.title,
        entry.author,
        "",
        "",
        entry.rank === null ? "nominee" : String(entry.rank),
        rawNotes(entry),
        config.publishedAt,
      ]);
      membership.push([sourceItemId, config.sourceId, "unresolved", "", "", ""]);
    }
  }
  return { registry, raw, membership };
}

export async function buildTsugimangaImport() {
  if (
    SOURCE_CONFIGS.length !== EXPECTED_SOURCE_COUNT ||
    SOURCE_CONFIGS.reduce((sum, config) => sum + config.count, 0) !== EXPECTED_ITEM_COUNT
  ) {
    throw new Error("Frozen Next Manga Awards source configuration is incomplete");
  }
  const snapshots = await Promise.all(SOURCE_CONFIGS.map(fetchSource));
  const rows = buildRows(snapshots);
  if (rows.raw.length !== EXPECTED_ITEM_COUNT || rows.membership.length !== EXPECTED_ITEM_COUNT) {
    throw new Error("Built Next Manga Awards row count is incomplete");
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
  if (!result.success) {
    throw new Error(`${label}: ${zodMessage(result.error)}`);
  }
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
    "Next Manga Awards sourceId",
  );
  const actualRaw = indexRows(
    staging.raw.filter((row) => TARGET_SOURCE_IDS.has(row[1] ?? "")),
    0,
    "Next Manga Awards sourceItemId",
  );
  const actualMembership = indexRows(
    staging.membership.filter((row) => TARGET_SOURCE_IDS.has(row[1] ?? "")),
    0,
    "Next Manga Awards membership",
  );
  assertSameKeys(actualRegistry, expectedRegistry, "Next Manga Awards source");
  assertSameKeys(actualRaw, expectedRaw, "Next Manga Awards raw item");
  assertSameKeys(actualMembership, expectedMembership, "Next Manga Awards membership");

  const parsedMemberships: MembershipRow[] = [];
  const parsedSources: SourceRegistryRow[] = [];
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

export async function runTsugimangaImport(mode: "--check" | "--write", root = process.cwd()) {
  const expected = await buildTsugimangaImport();
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
    console.error("Usage: tsx scripts/import-tsugimanga-rankings.ts --check|--write");
    process.exitCode = 1;
  } else {
    runTsugimangaImport(mode)
      .then(({ appended, itemCount, sourceCount }) =>
        console.log(
          `Next Manga Awards ${appended ? "appended" : "verified"}: ${sourceCount} sources / ${itemCount} items.`,
        ),
      )
      .catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      });
  }
}
