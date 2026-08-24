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

import { isValidIsbn, normalizeIsbn, normalizeTitle } from "../src/domain/catalog/normalize";
import {
  assertRepresentativeDecisionIdentity,
  canonicalAuthorKey,
  canonicalCreatorList,
  creatorsOverlap,
  isStandardRakutenEdition,
  loadRepresentativeVolumeDecisions,
  REPRESENTATIVE_VOLUME_DECISIONS_FILE,
  resolveRepresentativeVolumeDecision,
  type RepresentativeVolumeDecision,
} from "./catalog/representative-volume-decisions";
import { loadCatalogExpansion, validateCatalogExpansion } from "./validate-catalog-expansion";

export {
  creatorsOverlap,
  isStandardRakutenEdition,
} from "./catalog/representative-volume-decisions";

const HASH_PREFIX_LENGTH = 20;
const ADULT_MARKER_PATTERN =
  /(?:成人向け|成年(?:コミック|漫画)|18\s*禁|r-?18|アダルト|ティーンズラブ|성인|19금|(?:^|[^a-z])tl(?:[^a-z]|$))/iu;
const CANONICAL_TITLE_RULES = [
  {
    aliasTitle: "とめはねっ！",
    canonicalTitle: "とめはねっ！ 鈴里高校書道部",
    creator: "河合克敏",
    evidenceUrl: "https://www.shogakukan.co.jp/books/09151197",
  },
  {
    aliasTitle: "チェーザレ",
    canonicalTitle: "チェーザレ 破壊の創造者",
    creator: "惣領冬実",
    evidenceUrl: "https://www.kodansha.co.jp/titles/1000002705",
  },
  {
    aliasTitle: "機械仕掛けの愛１",
    canonicalTitle: "機械仕掛けの愛",
    creator: "業田良家",
    evidenceUrl: "https://shogakukan-comic.jp/book?isbn=9784091846440",
  },
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
const CANDIDATE_HEADERS = [
  "candidateId",
  "canonicalTitleJa",
  "titleKana",
  "creatorsJa",
  "firstPublishedYear",
  "originCountry",
  "format",
  "publicationStatus",
  "notes",
] as const;
const MAPPING_HEADERS = [
  "mappingId",
  "sourceItemId",
  "candidateId",
  "workId",
  "mappingType",
  "canonicalTitleJa",
  "confidence",
  "evidenceName",
  "evidenceUrl",
  "evidencePublishedAt",
  "retrievedAt",
  "notes",
] as const;
const SAFETY_HEADERS = [
  "candidateId",
  "safetyStatus",
  "evidenceName",
  "evidenceUrl",
  "evidencePublishedAt",
  "retrievedAt",
  "reviewedAt",
  "notes",
] as const;
const RAKUTEN_HEADERS = [
  "rakutenMatchId",
  "candidateId",
  "matchStatus",
  "isbn",
  "matchedTitle",
  "editionKind",
  "isRepresentative",
  "sourceUrl",
  "checkedAt",
  "notes",
] as const;
const ANNOTATION_HEADERS = [
  "candidateId",
  "workId",
  "bibliographyStatus",
  "factorStatus",
  "themeStatus",
  "evidenceStatus",
  "artEvidenceStatus",
  "reviewStatus",
  "reviewReference",
  "updatedAt",
  "notes",
] as const;
const EXCLUSION_HEADERS = [
  "exclusionId",
  "sourceItemId",
  "candidateId",
  "status",
  "reason",
  "evidenceName",
  "evidenceUrl",
  "evidencePublishedAt",
  "retrievedAt",
  "notes",
] as const;

const EXPLICIT_VERTICAL_FORMAT_EXCLUSIONS = new Map([
  [
    normalizeTitle("ReLIFE").kanaFolded,
    {
      creator: "夜宵草",
      evidenceName: "NHN comico official service release",
      evidenceUrl: "https://www.nhn-comico.com/news/index.nhn?docid=10876596&m=read",
      evidencePublishedAt: "2025-12-17",
    },
  ],
  [
    normalizeTitle("氷の城壁").kanaFolded,
    {
      creator: "阿賀沢紅茶",
      evidenceName: "Shueisha Online creator interview",
      evidenceUrl: "https://shueisha.online/articles/-/135509",
      evidencePublishedAt: "2023-06-04",
    },
  ],
  [
    normalizeTitle("縁の手紙").kanaFolded,
    {
      creator: "チョ・ヒョナ",
      evidenceName: "Manga Taisho official selection commentary",
      evidenceUrl: "https://www.mangataisho.com/archives/2022/01/post-1862.html",
      evidencePublishedAt: "2022",
    },
  ],
]);

const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u);
const sourceSchema = z.strictObject(
  Object.fromEntries(SOURCE_REGISTRY_HEADERS.map((header) => [header, z.string()])) as Record<
    (typeof SOURCE_REGISTRY_HEADERS)[number],
    z.ZodString
  >,
);
const rawSchema = z.strictObject({
  sourceItemId: idSchema,
  sourceId: idSchema,
  sourceRowNumber: z.string(),
  rawPublicationClass: z.string(),
  rawTitle: z.string(),
  rawCreator: z.string(),
  rawMainGenre: z.string(),
  rawSubgenre: z.string(),
  rawRating: z.string(),
  rawNotes: z.string(),
  rawUpdatedAt: z.string(),
});
const membershipSchema = z.strictObject({
  sourceItemId: idSchema,
  sourceId: idSchema,
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
const rakutenItemSchema = z.strictObject({
  title: z.string().min(1),
  author: z.string(),
  publisherName: z.string(),
  isbn: z.string(),
  booksGenreId: z.string(),
  salesDate: z.string(),
  itemUrl: z.url(),
});
const cacheRecordSchema = z.strictObject({
  queryKey: z.string().min(1),
  queryTitle: z.string().min(1),
  sourceItemIds: z.array(idSchema).min(1),
  retrievedAt: dateSchema,
  outcome: z.enum(["ok", "invalid-query"]),
  responseSha256: z.string().regex(/^[a-f0-9]{64}$/u),
  items: z.array(rakutenItemSchema),
});
const goldWorkSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  titleKana: z.string(),
  creators: z.string().min(1),
  status: z.enum(["ongoing", "completed", "hiatus", "unknown"]),
  firstPublishedYear: z.string().regex(/^\d{4}$/u),
  annotationReviewMethod: z.enum(["human", "authorizedModelPanel"]),
  annotationReviewReference: z.string().min(1),
});
const goldAliasSchema = z.object({ workId: idSchema, alias: z.string().min(1) });

type Source = z.infer<typeof sourceSchema>;
type RawItem = z.infer<typeof rawSchema>;
type Membership = z.infer<typeof membershipSchema>;
type RakutenItem = z.infer<typeof rakutenItemSchema>;
type CacheRecord = z.infer<typeof cacheRecordSchema>;
type GoldWork = z.infer<typeof goldWorkSchema>;
type GoldAlias = z.infer<typeof goldAliasSchema>;
type StringRow = Record<string, string>;
type SourceMatch = {
  raw: RawItem;
  source: Source;
  items: RakutenItem[];
  cacheItems: RakutenItem[];
  titleKey: string;
  authorKey: string;
  retrievedAt: string;
  responseSha256: string;
};
type CandidateGroup = {
  identity: string;
  titleKey: string;
  authorKey: string;
  canonicalTitle?: string;
  canonicalTitleEvidenceUrl?: string;
  matches: SourceMatch[];
  representative: RakutenItem;
  retrievedAt: string;
  goldWork?: GoldWork;
};

export type RakutenAdjudicationInput = {
  sources: Source[];
  rawItems: RawItem[];
  memberships: Membership[];
  cacheRecords: CacheRecord[];
  goldWorks: GoldWork[];
  goldAliases: GoldAlias[];
  existingCandidates?: StringRow[];
};

export type RakutenAdjudicationOutput = {
  sources: Source[];
  memberships: Membership[];
  candidates: StringRow[];
  mappings: StringRow[];
  exclusions: StringRow[];
  safetyReviews: StringRow[];
  rakutenMatches: StringRow[];
  annotationStatuses: StringRow[];
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function compare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function requiredField(row: StringRow, field: string) {
  const value = row[field];
  if (value === undefined) throw new Error(`Generated row is missing ${field}`);
  return value;
}

function uniqueIndex<T>(rows: readonly T[], key: (row: T) => string, label: string) {
  const index = new Map<string, T>();
  for (const row of rows) {
    const value = key(row);
    if (index.has(value)) throw new Error(`Duplicate ${label}: ${value}`);
    index.set(value, row);
  }
  return index;
}

export function isApprovedRakutenSource(sourceId: string) {
  return (
    sourceId.startsWith("konomanga-") ||
    /^tsugimanga-\d{4}-comics$/u.test(sourceId) ||
    sourceId.startsWith("shogakukan-manga-award-") ||
    sourceId.startsWith("mangataisho-") ||
    sourceId.startsWith("nippan-bookseller-recommendations-")
  );
}

export function canonicalTitleIdentity(title: string, creator: string) {
  const titleKey = normalizeTitle(title).kanaFolded;
  const rule = CANONICAL_TITLE_RULES.find(
    (candidate) =>
      creatorsOverlap(candidate.creator, creator) &&
      [candidate.aliasTitle, candidate.canonicalTitle]
        .map((title) => normalizeTitle(title).kanaFolded)
        .includes(titleKey),
  );
  return rule === undefined
    ? { titleKey }
    : {
        titleKey: normalizeTitle(rule.canonicalTitle).kanaFolded,
        canonicalTitle: rule.canonicalTitle,
        evidenceUrl: rule.evidenceUrl,
      };
}

function isMangaGenre(value: string) {
  return value.split("/").some((genreId) => genreId.startsWith("001001"));
}

function hasTlGenre(value: string) {
  return value.split("/").some((genreId) => genreId.startsWith("001029"));
}

function hasAdultMarker(values: readonly string[]) {
  return values.some((value) => ADULT_MARKER_PATTERN.test(value.normalize("NFKC")));
}

function rawSafetyValues(raw: RawItem) {
  return [
    raw.rawPublicationClass,
    raw.rawTitle,
    raw.rawCreator,
    raw.rawMainGenre,
    raw.rawSubgenre,
    raw.rawRating,
    raw.rawNotes,
  ];
}

export function isExactSafeStandardMatch(raw: RawItem, item: RakutenItem) {
  const titleKey = normalizeTitle(raw.rawTitle).kanaFolded;
  return (
    titleKey !== "" &&
    titleKey === normalizeTitle(item.title).kanaFolded &&
    isStandardRakutenEdition(raw.rawTitle) &&
    isStandardRakutenEdition(item.title) &&
    /^(?:\d{10}|\d{13})$/u.test(normalizeIsbn(item.isbn)) &&
    isValidIsbn(item.isbn) &&
    isMangaGenre(item.booksGenreId) &&
    !hasTlGenre(item.booksGenreId) &&
    creatorsOverlap(raw.rawCreator, item.author) &&
    !hasAdultMarker(rawSafetyValues(raw)) &&
    !hasAdultMarker([item.title, item.author, item.publisherName])
  );
}

function volumePriority(title: string) {
  const normalized = title.normalize("NFKC");
  const match = normalized.match(
    /(?:[（(]\s*0*(\d{1,3})\s*[)）]|第?\s*0*(\d{1,3})\s*巻|\s0*(\d{1,3}))\s*$/u,
  );
  const value = Number(match?.[1] ?? match?.[2] ?? match?.[3]);
  if (value === 1) return 0;
  if (!Number.isInteger(value)) return 1;
  return value + 1;
}

function chooseRepresentative(items: readonly RakutenItem[]) {
  const sorted = [...items].sort(
    (left, right) =>
      volumePriority(left.title) - volumePriority(right.title) ||
      compare(left.salesDate, right.salesDate) ||
      compare(normalizeIsbn(left.isbn), normalizeIsbn(right.isbn)) ||
      compare(left.itemUrl, right.itemUrl),
  );
  const representative = sorted[0];
  if (representative === undefined) throw new Error("Cannot choose a representative from no items");
  return representative;
}

function buildGoldTitleIndex(works: readonly GoldWork[], aliases: readonly GoldAlias[]) {
  const worksById = uniqueIndex(works, (work) => work.id, "Gold workId");
  const aliasesByWork = new Map<string, string[]>();
  for (const alias of aliases) {
    if (!worksById.has(alias.workId))
      throw new Error(`Alias references unknown Gold work: ${alias.workId}`);
    const values = aliasesByWork.get(alias.workId) ?? [];
    values.push(alias.alias);
    aliasesByWork.set(alias.workId, values);
  }
  const index = new Map<string, GoldWork[]>();
  for (const work of works) {
    for (const title of [work.title, ...(aliasesByWork.get(work.id) ?? [])]) {
      const key = normalizeTitle(title).kanaFolded;
      const values = index.get(key) ?? [];
      if (!values.some((candidate) => candidate.id === work.id)) values.push(work);
      index.set(key, values);
    }
  }
  return index;
}

function findGoldWork(titleKey: string, author: string, index: ReadonlyMap<string, GoldWork[]>) {
  const matches = (index.get(titleKey) ?? []).filter((work) =>
    creatorsOverlap(work.creators, author),
  );
  return matches.length === 1 ? matches[0] : undefined;
}

function buildSourceMatches(input: RakutenAdjudicationInput) {
  const sources = uniqueIndex(input.sources, (source) => source.sourceId, "sourceId");
  const rawItems = uniqueIndex(input.rawItems, (raw) => raw.sourceItemId, "sourceItemId");
  const cacheByItem = new Map<string, CacheRecord>();
  for (const record of input.cacheRecords) {
    for (const sourceItemId of record.sourceItemIds) {
      if (!rawItems.has(sourceItemId))
        throw new Error(`Rakuten cache references unknown item: ${sourceItemId}`);
      if (cacheByItem.has(sourceItemId)) {
        throw new Error(`Rakuten cache references an item more than once: ${sourceItemId}`);
      }
      cacheByItem.set(sourceItemId, record);
    }
  }

  const matches: SourceMatch[] = [];
  for (const raw of input.rawItems) {
    if (!isApprovedRakutenSource(raw.sourceId)) continue;
    const source = sources.get(raw.sourceId);
    if (source === undefined)
      throw new Error(`Raw item references unknown source: ${raw.sourceId}`);
    const cache = cacheByItem.get(raw.sourceItemId);
    if (cache === undefined) continue;
    const titleKey = normalizeTitle(raw.rawTitle).kanaFolded;
    if (titleKey !== cache.queryKey) {
      throw new Error(`Rakuten cache query is stale for ${raw.sourceItemId}`);
    }
    const eligible = cache.items.filter((item) => isExactSafeStandardMatch(raw, item));
    const byAuthor = new Map<string, RakutenItem[]>();
    for (const item of eligible) {
      const authorKey = canonicalAuthorKey(item.author);
      const items = byAuthor.get(authorKey) ?? [];
      items.push(item);
      byAuthor.set(authorKey, items);
    }
    if (byAuthor.size !== 1) continue;
    const [authorKey, items] = byAuthor.entries().next().value ?? [];
    if (authorKey === undefined || items === undefined) continue;
    matches.push({
      raw,
      source,
      items,
      cacheItems: cache.items,
      titleKey,
      authorKey,
      retrievedAt: cache.retrievedAt,
      responseSha256: cache.responseSha256,
    });
  }
  return matches;
}

function buildCandidateGroups(input: RakutenAdjudicationInput, matches: readonly SourceMatch[]) {
  const goldIndex = buildGoldTitleIndex(input.goldWorks, input.goldAliases);
  const byIdentity = new Map<
    string,
    {
      titleKey: string;
      canonicalTitle?: string;
      canonicalTitleEvidenceUrl?: string;
      matches: SourceMatch[];
    }
  >();
  for (const match of matches) {
    const title = canonicalTitleIdentity(match.raw.rawTitle, match.raw.rawCreator);
    const identity = JSON.stringify([title.titleKey, match.authorKey]);
    const group = byIdentity.get(identity) ?? {
      titleKey: title.titleKey,
      ...(title.canonicalTitle === undefined ? {} : { canonicalTitle: title.canonicalTitle }),
      ...(title.evidenceUrl === undefined ? {} : { canonicalTitleEvidenceUrl: title.evidenceUrl }),
      matches: [],
    };
    group.matches.push(match);
    byIdentity.set(identity, group);
  }
  const groups: CandidateGroup[] = [];
  for (const [identity, grouped] of byIdentity) {
    const values = grouped.matches;
    const items = values.flatMap((value) => value.items);
    const representative = chooseRepresentative(items);
    const goldCandidates = (goldIndex.get(grouped.titleKey) ?? []).filter((work) =>
      creatorsOverlap(work.creators, representative.author),
    );
    if (goldCandidates.length > 1) continue;
    groups.push({
      identity,
      titleKey: grouped.titleKey,
      authorKey: values[0]!.authorKey,
      ...(grouped.canonicalTitle === undefined ? {} : { canonicalTitle: grouped.canonicalTitle }),
      ...(grouped.canonicalTitleEvidenceUrl === undefined
        ? {}
        : { canonicalTitleEvidenceUrl: grouped.canonicalTitleEvidenceUrl }),
      matches: values,
      representative,
      retrievedAt: values
        .map((value) => value.retrievedAt)
        .sort(compare)
        .at(-1)!,
      goldWork: findGoldWork(grouped.titleKey, representative.author, goldIndex),
    });
  }

  const groupsByIsbn = new Map<string, CandidateGroup[]>();
  for (const group of groups) {
    const isbn = normalizeIsbn(group.representative.isbn);
    const values = groupsByIsbn.get(isbn) ?? [];
    values.push(group);
    groupsByIsbn.set(isbn, values);
  }
  return groups.filter(
    (group) => groupsByIsbn.get(normalizeIsbn(group.representative.isbn))?.length === 1,
  );
}

function candidateIds(identity: string, goldWork?: GoldWork) {
  const digest = sha256(identity).slice(0, HASH_PREFIX_LENGTH);
  return { candidateId: `candidate-${digest}`, workId: goldWork?.id ?? `work-${digest}` };
}

function buildExplicitVerticalFormatExclusions(input: RakutenAdjudicationInput) {
  const sources = uniqueIndex(input.sources, (source) => source.sourceId, "sourceId");
  const exclusions = new Map<string, StringRow>();
  for (const raw of input.rawItems) {
    const evidence = EXPLICIT_VERTICAL_FORMAT_EXCLUSIONS.get(
      normalizeTitle(raw.rawTitle).kanaFolded,
    );
    if (evidence === undefined || !creatorsOverlap(raw.rawCreator, evidence.creator)) continue;
    const source = sources.get(raw.sourceId);
    if (source === undefined)
      throw new Error(`Raw item references unknown source: ${raw.sourceId}`);
    const exclusionId = `exclusion-${sha256(raw.sourceItemId).slice(0, HASH_PREFIX_LENGTH)}`;
    exclusions.set(raw.sourceItemId, {
      exclusionId,
      sourceItemId: raw.sourceItemId,
      candidateId: "",
      status: "excluded-webtoon",
      reason: "Original work uses a vertical-scroll-first format excluded by the catalog scope.",
      evidenceName: evidence.evidenceName,
      evidenceUrl: evidence.evidenceUrl,
      evidencePublishedAt: evidence.evidencePublishedAt,
      retrievedAt: source.retrievedAt,
      notes:
        "Explicit title-level decision from cited official evidence; no nationality inference.",
    });
  }
  return exclusions;
}

export function buildRakutenAdjudication(
  inputValue: RakutenAdjudicationInput,
  representativeVolumeDecisions: readonly RepresentativeVolumeDecision[] = [],
) {
  const input: RakutenAdjudicationInput = {
    sources: sourceSchema.array().parse(inputValue.sources),
    rawItems: rawSchema.array().parse(inputValue.rawItems),
    memberships: membershipSchema.array().parse(inputValue.memberships),
    cacheRecords: cacheRecordSchema.array().parse(inputValue.cacheRecords),
    goldWorks: goldWorkSchema.array().parse(inputValue.goldWorks),
    goldAliases: goldAliasSchema.array().parse(inputValue.goldAliases),
    existingCandidates: stringRecordSchema.array().parse(inputValue.existingCandidates ?? []),
  };
  uniqueIndex(input.cacheRecords, (record) => record.queryKey, "Rakuten queryKey");
  const decisionsByWork = uniqueIndex(
    representativeVolumeDecisions,
    (decision) => decision.workId,
    "representative-volume decision",
  );
  const consumedDecisions = new Set<string>();
  const rawItems = uniqueIndex(input.rawItems, (raw) => raw.sourceItemId, "sourceItemId");
  const membershipOrder = new Map(
    input.memberships.map((membership, index) => [membership.sourceItemId, index]),
  );
  for (const membership of input.memberships) {
    if (!rawItems.has(membership.sourceItemId)) {
      throw new Error(`Membership references unknown raw item: ${membership.sourceItemId}`);
    }
  }
  const explicitExclusions = buildExplicitVerticalFormatExclusions(input);
  const groups = buildCandidateGroups(
    input,
    buildSourceMatches(input).filter((match) => !explicitExclusions.has(match.raw.sourceItemId)),
  );
  const acceptedItemIds = new Set(
    groups.flatMap((group) => group.matches.map((match) => match.raw.sourceItemId)),
  );
  const memberships: Membership[] = input.memberships.map((membership) =>
    isApprovedRakutenSource(membership.sourceId)
      ? {
          ...membership,
          status: "unresolved",
          candidateId: "",
          workId: "",
          decisionRef: "",
        }
      : membership,
  );
  const membershipById = uniqueIndex(
    memberships,
    (membership) => membership.sourceItemId,
    "membership",
  );
  const exclusions = [...explicitExclusions.values()].sort((left, right) =>
    compare(requiredField(left, "sourceItemId"), requiredField(right, "sourceItemId")),
  );
  for (const exclusion of exclusions) {
    const membership = membershipById.get(requiredField(exclusion, "sourceItemId"));
    if (membership === undefined) throw new Error("Explicit exclusion has no membership");
    membership.status = "excluded-webtoon";
    membership.candidateId = "";
    membership.workId = "";
    membership.decisionRef = requiredField(exclusion, "exclusionId");
  }
  const candidates: StringRow[] = [];
  const mappings: StringRow[] = [];
  const safetyReviews: StringRow[] = [];
  const rakutenMatches: StringRow[] = [];
  const annotationStatuses: StringRow[] = [];
  const seenCandidateIds = new Map<string, string>();
  const existingCandidates = uniqueIndex(
    input.existingCandidates ?? [],
    (candidate) => requiredField(candidate, "candidateId"),
    "existing candidateId",
  );

  for (const group of groups.sort((left, right) => compare(left.identity, right.identity))) {
    const { candidateId, workId } = candidateIds(group.identity, group.goldWork);
    const priorIdentity = seenCandidateIds.get(candidateId);
    if (priorIdentity !== undefined && priorIdentity !== group.identity) {
      throw new Error(`Deterministic candidate ID collision: ${candidateId}`);
    }
    seenCandidateIds.set(candidateId, group.identity);
    const orderedMatches = [...group.matches].sort(
      (left, right) =>
        (membershipOrder.get(left.raw.sourceItemId) ?? Number.MAX_SAFE_INTEGER) -
        (membershipOrder.get(right.raw.sourceItemId) ?? Number.MAX_SAFE_INTEGER),
    );
    const first = orderedMatches[0]!;
    const canonicalTitle = group.goldWork?.title ?? group.canonicalTitle ?? first.raw.rawTitle;
    const matchedCreators =
      group.goldWork?.creators ?? canonicalCreatorList(group.representative.author);
    const existingCandidate = existingCandidates.get(candidateId);
    const preserveExistingIdentity =
      existingCandidate !== undefined &&
      requiredField(existingCandidate, "canonicalTitleJa") === canonicalTitle &&
      creatorsOverlap(requiredField(existingCandidate, "creatorsJa"), matchedCreators);
    const creators = preserveExistingIdentity
      ? requiredField(existingCandidate, "creatorsJa")
      : matchedCreators;
    const preservedYear = preserveExistingIdentity
      ? requiredField(existingCandidate, "firstPublishedYear")
      : "";
    const representativeDecision = decisionsByWork.get(workId);
    const representative =
      representativeDecision === undefined
        ? group.representative
        : (() => {
            assertRepresentativeDecisionIdentity(representativeDecision, {
              workId,
              candidateId,
              canonicalTitleJa: canonicalTitle,
              creatorsJa: creators,
            });
            consumedDecisions.add(workId);
            return resolveRepresentativeVolumeDecision(
              representativeDecision,
              group.matches.flatMap((match) =>
                match.cacheItems.map((item) => ({
                  responseSha256: match.responseSha256,
                  item,
                })),
              ),
            ).audited.item;
          })();
    candidates.push({
      candidateId,
      canonicalTitleJa: canonicalTitle,
      titleKana: group.goldWork?.titleKana ?? "",
      creatorsJa: creators,
      firstPublishedYear: group.goldWork?.firstPublishedYear ?? preservedYear,
      originCountry: "unknown",
      format: "unknown",
      publicationStatus: group.goldWork?.status ?? "unknown",
      notes:
        group.goldWork === undefined
          ? `Library-only candidate; opaque workId=${workId}; identity is normalized official title + matched Rakuten author; origin and original format remain unknown.`
          : `Matched existing Gold work ${group.goldWork.id} by normalized title/alias + creator overlap.`,
    });

    for (const [index, match] of orderedMatches.entries()) {
      const membership = membershipById.get(match.raw.sourceItemId)!;
      const mappingId = `mapping-${sha256(match.raw.sourceItemId).slice(0, HASH_PREFIX_LENGTH)}`;
      const mappingType = index === 0 ? "included" : "duplicate";
      membership.status = mappingType;
      membership.candidateId = candidateId;
      membership.workId = workId;
      membership.decisionRef = mappingId;
      mappings.push({
        mappingId,
        sourceItemId: match.raw.sourceItemId,
        candidateId,
        workId,
        mappingType,
        canonicalTitleJa: canonicalTitle,
        confidence: "1",
        evidenceName: `${match.source.organization} official selection + Rakuten Books exact product match`,
        evidenceUrl: match.source.url,
        evidencePublishedAt: match.source.publishedAt,
        retrievedAt: match.retrievedAt,
        notes: `sourceOfficialUrl=${match.source.url}; rakutenProductUrl=${representative.itemUrl}; normalizedTitle=${group.titleKey}; matchedRakutenAuthor=${representative.author}; isbn=${normalizeIsbn(representative.isbn)}${group.canonicalTitleEvidenceUrl === undefined ? "." : `; canonicalTitleEvidenceUrl=${group.canonicalTitleEvidenceUrl}.`}`,
      });
    }

    const evidenceSource = first.source;
    safetyReviews.push({
      candidateId,
      safetyStatus: "safe",
      evidenceName: `${evidenceSource.organization} mainstream selection + Rakuten Books manga category`,
      evidenceUrl: evidenceSource.url,
      evidencePublishedAt: evidenceSource.publishedAt,
      retrievedAt: group.retrievedAt,
      reviewedAt: group.retrievedAt,
      notes: `No explicit adult/TL marker in matched source or product; Rakuten booksGenreId=${representative.booksGenreId}; rakutenProductUrl=${representative.itemUrl}.`,
    });
    rakutenMatches.push({
      rakutenMatchId: `rakuten-match-${sha256(group.identity).slice(0, HASH_PREFIX_LENGTH)}`,
      candidateId,
      matchStatus: "matched",
      isbn: normalizeIsbn(representative.isbn),
      matchedTitle: representative.title,
      editionKind: "standard",
      isRepresentative: "true",
      sourceUrl: representative.itemUrl,
      checkedAt: group.retrievedAt,
      notes: `Exact normalized title, creator overlap, valid ISBN, standard edition, and Rakuten manga genre ${representative.booksGenreId}.`,
    });
    annotationStatuses.push({
      candidateId,
      workId,
      bibliographyStatus: "complete",
      factorStatus: "complete",
      themeStatus: "complete",
      evidenceStatus: "complete",
      artEvidenceStatus: "complete",
      reviewStatus: group.goldWork?.annotationReviewMethod ?? "unreviewed",
      reviewReference: group.goldWork?.annotationReviewReference ?? "",
      updatedAt: group.retrievedAt,
      notes:
        group.goldWork === undefined
          ? "Library-only intent; downstream source promotion must create 17 unknown Factor axes and no Theme rows."
          : `Existing Gold annotation contract reused from ${group.goldWork.annotationReviewReference}.`,
    });
  }

  if (acceptedItemIds.size !== mappings.length) {
    throw new Error("A matched source item did not receive exactly one canonical mapping");
  }
  if (consumedDecisions.size !== representativeVolumeDecisions.length) {
    const missing = representativeVolumeDecisions
      .filter((decision) => !consumedDecisions.has(decision.workId))
      .map((decision) => decision.workId);
    throw new Error(
      `Representative-volume decisions did not resolve after stable identity: ${missing.join(",")}`,
    );
  }
  mappings.sort(
    (left, right) =>
      (membershipOrder.get(requiredField(left, "sourceItemId")) ?? Number.MAX_SAFE_INTEGER) -
      (membershipOrder.get(requiredField(right, "sourceItemId")) ?? Number.MAX_SAFE_INTEGER),
  );

  const membershipsBySource = new Map<string, Membership[]>();
  for (const membership of memberships) {
    const values = membershipsBySource.get(membership.sourceId) ?? [];
    values.push(membership);
    membershipsBySource.set(membership.sourceId, values);
  }
  const sources = input.sources.map((source) => {
    const values = membershipsBySource.get(source.sourceId) ?? [];
    if (
      !isApprovedRakutenSource(source.sourceId) &&
      !values.some((row) => row.status === "excluded-webtoon")
    ) {
      return source;
    }
    const mapped = values.filter((row) => row.status === "included" || row.status === "duplicate");
    return {
      ...source,
      excludedWebtoonCount: String(
        values.filter((row) => row.status === "excluded-webtoon").length,
      ),
      excludedAdultCount: String(values.filter((row) => row.status === "excluded-adult").length),
      excludedNonJapaneseCount: String(
        values.filter((row) => row.status === "excluded-non-japanese").length,
      ),
      excludedNonMangaCount: String(
        values.filter((row) => row.status === "excluded-non-manga").length,
      ),
      duplicateCount: String(values.filter((row) => row.status === "duplicate").length),
      canonicalMappingCount: String(new Set(mapped.map((row) => row.candidateId)).size),
      unresolvedCount: String(values.filter((row) => row.status === "unresolved").length),
    };
  });

  return {
    sources,
    memberships,
    candidates: candidates.sort((left, right) =>
      compare(requiredField(left, "candidateId"), requiredField(right, "candidateId")),
    ),
    mappings,
    exclusions,
    safetyReviews: safetyReviews.sort((left, right) =>
      compare(requiredField(left, "candidateId"), requiredField(right, "candidateId")),
    ),
    rakutenMatches: rakutenMatches.sort((left, right) =>
      compare(requiredField(left, "candidateId"), requiredField(right, "candidateId")),
    ),
    annotationStatuses: annotationStatuses.sort((left, right) =>
      compare(requiredField(left, "candidateId"), requiredField(right, "candidateId")),
    ),
  } satisfies RakutenAdjudicationOutput;
}

const matrixSchema = z.array(z.array(z.string()));
const stringRecordSchema = z.record(z.string(), z.string());

function readCsv<T>(path: string, headers: readonly string[], schema: z.ZodType<T>) {
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
  return rows.map((row, index) => {
    if (row.length !== headers.length)
      throw new Error(`Unexpected CSV column count: ${path}:${index + 2}`);
    return schema.parse(
      Object.fromEntries(headers.map((header, column) => [header, row[column] ?? ""])),
    );
  });
}

function loadCache(path: string) {
  const lines = readFileSync(path, "utf8").split(/\r?\n/u).filter(Boolean);
  const records = cacheRecordSchema.array().parse(lines.map((line) => JSON.parse(line) as unknown));
  for (const record of records) {
    const digest = sha256(`${JSON.stringify({ outcome: record.outcome, items: record.items })}\n`);
    if (record.responseSha256 !== digest) {
      throw new Error(`Rakuten cache response hash changed: ${record.queryKey}`);
    }
    if (normalizeTitle(record.queryTitle).kanaFolded !== record.queryKey) {
      throw new Error(`Rakuten cache query normalization changed: ${record.queryKey}`);
    }
  }
  return records;
}

function loadInputs(root: string): RakutenAdjudicationInput {
  const directory = join(root, "data/staging/catalog-expansion");
  const manifest = z
    .object({ workIds: z.array(idSchema).min(1) })
    .parse(JSON.parse(readFileSync(join(directory, "gold-set-manifest.json"), "utf8")) as unknown);
  const goldWorkIds = new Set(manifest.workIds);
  if (goldWorkIds.size !== manifest.workIds.length) {
    throw new Error("Gold Set manifest contains duplicate work IDs");
  }
  const goldWorks = readCsv(
    join(root, "data/source/works.csv"),
    [
      "id",
      "title",
      "titleKana",
      "creators",
      "publisher",
      "demographic",
      "status",
      "firstPublishedYear",
      "genres",
      "factorScope",
      "onboardingEligible",
      "recommendationEligible",
      "libraryOnly",
      "metadataConfidence",
      "groupingConfidence",
      "sourceAgreement",
      "annotationReviewMethod",
      "annotationReviewedAt",
      "annotationReviewReference",
      "evidenceId",
    ],
    stringRecordSchema,
  )
    .filter((row) => goldWorkIds.has(row["id"] ?? ""))
    .map((row) => goldWorkSchema.parse(row));
  if (goldWorks.length !== goldWorkIds.size) {
    throw new Error("Gold Set manifest references missing or invalid source works");
  }
  return {
    sources: readCsv(join(directory, "source-registry.csv"), SOURCE_REGISTRY_HEADERS, sourceSchema),
    rawItems: readCsv(join(directory, "raw-source-items.csv"), RAW_HEADERS, rawSchema),
    memberships: readCsv(
      join(directory, "source-membership.csv"),
      MEMBERSHIP_HEADERS,
      membershipSchema,
    ),
    cacheRecords: loadCache(join(directory, "rakuten-search-results.jsonl")),
    goldWorks,
    goldAliases: readCsv(
      join(root, "data/source/aliases.csv"),
      ["workId", "alias"],
      goldAliasSchema,
    ).filter((alias) => goldWorkIds.has(alias.workId)),
    existingCandidates: readCsv(
      join(directory, "candidates.csv"),
      CANDIDATE_HEADERS,
      stringRecordSchema,
    ),
  };
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeRecords(headers: readonly string[], rows: readonly object[]) {
  const matrix = [
    [...headers],
    ...rows.map((row) => {
      const record = stringRecordSchema.parse(row);
      return headers.map((header) => record[header] ?? "");
    }),
  ];
  return `${matrix.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

const VALIDATION_FILES = [
  "source-registry.csv",
  "raw-source-items.csv",
  "candidates.csv",
  "source-membership.csv",
  "canonical-mapping.csv",
  "exclusions.csv",
  "safety-review.csv",
  "rakuten-matches.csv",
  "annotation-status.csv",
  REPRESENTATIVE_VOLUME_DECISIONS_FILE,
] as const;
const CHANGED_FILES = [
  "candidates.csv",
  "canonical-mapping.csv",
  "exclusions.csv",
  "safety-review.csv",
  "rakuten-matches.csv",
  "annotation-status.csv",
  "source-membership.csv",
  "source-registry.csv",
] as const;

function expectedFiles(output: RakutenAdjudicationOutput) {
  return new Map<string, string>([
    ["source-registry.csv", serializeRecords(SOURCE_REGISTRY_HEADERS, output.sources)],
    ["source-membership.csv", serializeRecords(MEMBERSHIP_HEADERS, output.memberships)],
    ["candidates.csv", serializeRecords(CANDIDATE_HEADERS, output.candidates)],
    ["canonical-mapping.csv", serializeRecords(MAPPING_HEADERS, output.mappings)],
    ["exclusions.csv", serializeRecords(EXCLUSION_HEADERS, output.exclusions)],
    ["safety-review.csv", serializeRecords(SAFETY_HEADERS, output.safetyReviews)],
    ["rakuten-matches.csv", serializeRecords(RAKUTEN_HEADERS, output.rakutenMatches)],
    ["annotation-status.csv", serializeRecords(ANNOTATION_HEADERS, output.annotationStatuses)],
  ]);
}

function assertMappedWorkIdsStable(current: readonly Membership[], next: readonly Membership[]) {
  const nextByItem = uniqueIndex(next, (row) => row.sourceItemId, "next source membership");
  for (const row of current) {
    if (row.status !== "included" && row.status !== "duplicate") continue;
    const replacement = nextByItem.get(row.sourceItemId);
    if (replacement === undefined || replacement.workId !== row.workId) {
      throw new Error(`Incremental adjudication changed a mapped work: ${row.sourceItemId}`);
    }
  }
}

function replaceFromValidatedSibling(
  directory: string,
  expected: ReadonlyMap<string, string>,
  original: ReadonlyMap<string, string>,
) {
  const temporaryDirectory = mkdtempSync(
    join(dirname(directory), ".catalog-expansion-adjudicate-"),
  );
  const replaced: string[] = [];
  try {
    for (const file of VALIDATION_FILES) {
      copyFileSync(join(directory, file), join(temporaryDirectory, file));
    }
    for (const [file, contents] of expected) {
      writeFileSync(join(temporaryDirectory, file), contents, "utf8");
    }
    validateCatalogExpansion(loadCatalogExpansion(temporaryDirectory));
    for (const file of CHANGED_FILES) {
      if (readFileSync(join(directory, file), "utf8") !== original.get(file)) {
        throw new Error(`Concurrent staging change detected: ${file}`);
      }
    }
    for (const file of CHANGED_FILES) {
      renameSync(join(temporaryDirectory, file), join(directory, file));
      replaced.push(file);
    }
  } catch (error: unknown) {
    for (const file of replaced) {
      const contents = original.get(file);
      if (contents === undefined) continue;
      writeFileSync(join(temporaryDirectory, file), contents, "utf8");
      renameSync(join(temporaryDirectory, file), join(directory, file));
    }
    throw error;
  } finally {
    rmSync(temporaryDirectory, { force: true, recursive: true });
  }
}

export function runRakutenCandidateAdjudication(mode: "--check" | "--write", root = process.cwd()) {
  const directory = join(root, "data/staging/catalog-expansion");
  const input = loadInputs(root);
  const output = buildRakutenAdjudication(input, loadRepresentativeVolumeDecisions(directory));
  const expected = expectedFiles(output);
  if (mode === "--check") {
    for (const [file, contents] of expected) {
      if (readFileSync(join(directory, file), "utf8") !== contents) {
        throw new Error(`Rakuten adjudication output differs: ${file}`);
      }
    }
    validateCatalogExpansion(loadCatalogExpansion(directory));
    return { candidateCount: output.candidates.length, mappingCount: output.mappings.length };
  }

  validateCatalogExpansion(loadCatalogExpansion(directory));
  assertMappedWorkIdsStable(input.memberships, output.memberships);
  const original = new Map(
    CHANGED_FILES.map((file) => [file, readFileSync(join(directory, file), "utf8")]),
  );
  replaceFromValidatedSibling(directory, expected, original);
  return { candidateCount: output.candidates.length, mappingCount: output.mappings.length };
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  const mode = process.argv[2];
  if (mode !== "--check" && mode !== "--write") {
    console.error("Usage: tsx scripts/adjudicate-rakuten-candidates.ts --check|--write");
    process.exitCode = 1;
  } else {
    try {
      const result = runRakutenCandidateAdjudication(mode);
      console.log(
        `Rakuten adjudication ${mode === "--write" ? "written" : "verified"}: ${result.candidateCount} candidates, ${result.mappingCount} mappings.`,
      );
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  }
}
