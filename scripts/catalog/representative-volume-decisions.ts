import { readFileSync } from "node:fs";
import { join } from "node:path";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import { isValidIsbn, normalizeCreator, normalizeIsbn } from "../../src/domain/catalog/normalize";

export const REPRESENTATIVE_VOLUME_DECISIONS_FILE = "representative-volume-decisions.csv";
export const REPRESENTATIVE_VOLUME_DECISION_HEADERS = [
  "workId",
  "candidateId",
  "canonicalTitleJa",
  "creatorsJa",
  "decisionKind",
  "currentIsbn",
  "auditedIsbn",
  "proof",
  "corroboratingIsbn",
] as const;

const NON_STANDARD_EDITION_PATTERN =
  /(完全版|新装版|新訂版|復刻版|愛蔵版|豪華版|廉価版|ワイド版|文庫(?:版)?|特装版|特別版|限定版|初回(?:限定)?版|合本版|全巻|セット|電子(?:版|書籍)|デジタル版|kindle|e-?book)/iu;
const ADULT_MARKER_PATTERN =
  /(?:成人向け|成年(?:コミック|漫画)|18\s*禁|r-?18|アダルト|ティーンズラブ|성인|19금|(?:^|[^a-z])tl(?:[^a-z]|$))/iu;
const CREATOR_ROLE_PATTERN =
  /(?:原作|作画|漫画|著者|著|構成|脚本|原案|キャラクター原案)\s*[:：]\s*/giu;
const CREATOR_ALIASES = new Map([["河内遥", "河内遙"]]);
const COMPOUND_CREATOR_NAMES = new Map([["沖田×華", "沖田×華"]]);
const ISBN_SCHEMA = z
  .string()
  .regex(/^\d{13}$/u)
  .refine(isValidIsbn, "Invalid ISBN-13 checksum");

const decisionSchema = z
  .strictObject({
    workId: z.string().regex(/^work-[a-f0-9]{20}$/u),
    candidateId: z.string().regex(/^candidate-[a-f0-9]{20}$/u),
    canonicalTitleJa: z.string().min(1),
    creatorsJa: z.string().min(1),
    decisionKind: z.enum(["isbn-replacement", "volume-one-correction"]),
    currentIsbn: ISBN_SCHEMA,
    auditedIsbn: ISBN_SCHEMA,
    proof: z.enum([
      "explicit-volume-1",
      "attached-volume-1",
      "upper-first-part",
      "unnumbered-first-via-volume-2",
    ]),
    corroboratingIsbn: z.union([z.literal(""), ISBN_SCHEMA]),
  })
  .superRefine((decision, context) => {
    const expectedCandidateId = decision.workId.replace(/^work-/u, "candidate-");
    if (decision.candidateId !== expectedCandidateId) {
      context.addIssue({
        code: "custom",
        path: ["candidateId"],
        message: `Expected ${expectedCandidateId}`,
      });
    }
    const replacement = decision.decisionKind === "isbn-replacement";
    if (replacement === (decision.currentIsbn === decision.auditedIsbn)) {
      context.addIssue({
        code: "custom",
        path: ["auditedIsbn"],
        message: replacement
          ? "An ISBN replacement must change the ISBN"
          : "A volume-one correction must retain the ISBN",
      });
    }
    const needsCorroboration = decision.proof === "unnumbered-first-via-volume-2";
    if (needsCorroboration !== (decision.corroboratingIsbn !== "")) {
      context.addIssue({
        code: "custom",
        path: ["corroboratingIsbn"],
        message: needsCorroboration
          ? "Unnumbered first volumes require a corroborating volume-2 ISBN"
          : "Only unnumbered first volumes may have a corroborating ISBN",
      });
    }
    if (
      decision.corroboratingIsbn !== "" &&
      [decision.currentIsbn, decision.auditedIsbn].includes(decision.corroboratingIsbn)
    ) {
      context.addIssue({
        code: "custom",
        path: ["corroboratingIsbn"],
        message: "The corroborating ISBN must identify a different volume",
      });
    }
  });

export type RepresentativeVolumeDecision = z.infer<typeof decisionSchema>;
export type RepresentativeRakutenItem = {
  title: string;
  author: string;
  publisherName: string;
  isbn: string;
  booksGenreId: string;
  salesDate: string;
  itemUrl: string;
};
export type RepresentativeRakutenHit = {
  responseSha256: string;
  item: RepresentativeRakutenItem;
};

const matrixSchema = z.array(z.array(z.string()));

function compare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function loadRepresentativeVolumeDecisions(directory: string) {
  const path = join(directory, REPRESENTATIVE_VOLUME_DECISIONS_FILE);
  const [headers, ...rows] = matrixSchema.parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }),
  );
  if (
    headers === undefined ||
    headers.join("\u0000") !== REPRESENTATIVE_VOLUME_DECISION_HEADERS.join("\u0000")
  ) {
    throw new Error(`Unexpected CSV header: ${REPRESENTATIVE_VOLUME_DECISIONS_FILE}`);
  }
  const decisions = rows.map((row, index) => {
    if (row.length !== headers.length) {
      throw new Error(
        `Unexpected CSV column count: ${REPRESENTATIVE_VOLUME_DECISIONS_FILE}:${index + 2}`,
      );
    }
    const result = decisionSchema.safeParse(
      Object.fromEntries(headers.map((header, column) => [header, row[column] ?? ""])),
    );
    if (!result.success) {
      throw new Error(
        `Invalid CSV row: ${REPRESENTATIVE_VOLUME_DECISIONS_FILE}:${index + 2}: ${result.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; ")}`,
      );
    }
    return result.data;
  });
  const workIds = decisions.map((decision) => decision.workId);
  if (new Set(workIds).size !== workIds.length) {
    throw new Error("Duplicate representative-volume decision workId");
  }
  if (workIds.some((workId, index) => index > 0 && compare(workIds[index - 1]!, workId) >= 0)) {
    throw new Error("Representative-volume decisions must be sorted by workId");
  }
  return decisions;
}

export function isStandardRakutenEdition(title: string) {
  return !NON_STANDARD_EDITION_PATTERN.test(title.normalize("NFKC"));
}

function creatorParts(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[（(【\[].*?[）)】\]]/gu, " ")
    .replace(CREATOR_ROLE_PATTERN, ";")
    .split(/[;；,，、/／&＆×\n]/u)
    .map((part) => part.trim().replace(/\s+/gu, " "))
    .filter(Boolean);
}

function creatorTokens(value: string) {
  return new Set(
    creatorParts(value).map((part) => {
      const token = normalizeCreator(part).replace(/\s+/gu, "");
      return CREATOR_ALIASES.get(token) ?? token;
    }),
  );
}

export function canonicalCreatorList(value: string) {
  const compound = COMPOUND_CREATOR_NAMES.get(
    value
      .normalize("NFKC")
      .replace(/[（(【\[].*?[）)】\]]/gu, " ")
      .replace(/\s/gu, ""),
  );
  if (compound !== undefined) return compound;
  return [
    ...new Map(creatorParts(value).map((part) => [normalizeCreator(part), part])).values(),
  ].join(";");
}

export function canonicalAuthorKey(value: string) {
  return [...creatorTokens(value)].sort(compare).join(";");
}

export function creatorsOverlap(sourceCreator: string, rakutenAuthor: string) {
  const source = creatorTokens(sourceCreator);
  const rakuten = creatorTokens(rakutenAuthor);
  return [...source].some((creator) => rakuten.has(creator));
}

function looseTitle(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("ja")
    .replace(/[\s・･·.,，。!！?？♪〜~ー—–─\-_:：;；「」『』【】\[\]（）()\/／]/gu, "");
}

function seriesAffix(title: string, canonicalTitle: string) {
  const normalized = looseTitle(title);
  const canonical = looseTitle(canonicalTitle);
  const index = normalized.indexOf(canonical);
  if (canonical === "" || index === -1) return undefined;
  return {
    prefix: normalized.slice(0, index),
    suffix: normalized.slice(index + canonical.length),
  };
}

function pureVolumeSuffix(value: string) {
  const match = /^(?:第|volume|vol|#|＃)?0*(\d{1,3})(?:巻|集|冊)?$/iu.exec(value);
  const volume = Number(match?.[1]);
  return Number.isInteger(volume) && volume > 0 ? volume : undefined;
}

function year(value: string) {
  return Number(/\d{4}/u.exec(value)?.[0] ?? Number.NaN);
}

export function assertRepresentativeDecisionIdentity(
  decision: RepresentativeVolumeDecision,
  identity: { workId: string; candidateId: string; canonicalTitleJa: string; creatorsJa: string },
) {
  if (
    decision.workId !== identity.workId ||
    decision.candidateId !== identity.candidateId ||
    decision.canonicalTitleJa !== identity.canonicalTitleJa ||
    decision.creatorsJa !== identity.creatorsJa
  ) {
    throw new Error(`Representative-volume decision identity changed: ${decision.workId}`);
  }
}

function assertAuditedItem(
  decision: RepresentativeVolumeDecision,
  item: RepresentativeRakutenItem,
  expectedIsbn: string,
  label: string,
) {
  const isbn = normalizeIsbn(item.isbn);
  if (isbn !== expectedIsbn || !isValidIsbn(isbn)) {
    throw new Error(`${decision.workId} ${label} has an invalid or unexpected ISBN: ${isbn}`);
  }
  if (!looseTitle(item.title).includes(looseTitle(decision.canonicalTitleJa))) {
    throw new Error(`${decision.workId} ${label} title conflicts with candidate: ${item.title}`);
  }
  if (!creatorsOverlap(decision.creatorsJa, item.author)) {
    throw new Error(`${decision.workId} ${label} creator conflicts with candidate: ${item.author}`);
  }
  const genres = item.booksGenreId.split("/").map((genre) => genre.trim());
  if (
    !genres.some((genre) => genre.startsWith("001001")) ||
    genres.some((genre) => genre.startsWith("001029"))
  ) {
    throw new Error(`${decision.workId} ${label} genre conflicts with manga safety`);
  }
  if (
    !isStandardRakutenEdition(item.title) ||
    [item.title, item.author, item.publisherName].some((value) =>
      ADULT_MARKER_PATTERN.test(value.normalize("NFKC")),
    )
  ) {
    throw new Error(`${decision.workId} ${label} conflicts with standard non-adult scope`);
  }
}

function hitsFor(
  decision: RepresentativeVolumeDecision,
  hits: readonly RepresentativeRakutenHit[],
  isbn: string,
  label: string,
) {
  const matches = hits
    .filter((hit) => normalizeIsbn(hit.item.isbn) === isbn)
    .sort(
      (left, right) =>
        compare(left.responseSha256, right.responseSha256) ||
        compare(left.item.itemUrl, right.item.itemUrl),
    );
  if (matches.length === 0) {
    throw new Error(`${decision.workId} frozen cache is missing ${label} ISBN ${isbn}`);
  }
  const item = JSON.stringify(matches[0]!.item);
  if (matches.some((match) => JSON.stringify(match.item) !== item)) {
    throw new Error(`${decision.workId} frozen cache fields conflict for ${label} ISBN ${isbn}`);
  }
  assertAuditedItem(decision, matches[0]!.item, isbn, label);
  return matches;
}

export function resolveRepresentativeVolumeDecision(
  decision: RepresentativeVolumeDecision,
  hits: readonly RepresentativeRakutenHit[],
) {
  const currentHits = hitsFor(decision, hits, decision.currentIsbn, "current item");
  const auditedHits = hitsFor(decision, hits, decision.auditedIsbn, "audited item");
  const corroboratingHits =
    decision.corroboratingIsbn === ""
      ? []
      : hitsFor(decision, hits, decision.corroboratingIsbn, "corroborating item");
  const audited = auditedHits[0]!;
  const affix = seriesAffix(audited.item.title, decision.canonicalTitleJa);
  if (affix === undefined) {
    throw new Error(`${decision.workId} audited title has no canonical identity`);
  }
  if (decision.proof === "attached-volume-1" && pureVolumeSuffix(affix.suffix) !== 1) {
    throw new Error(`${decision.workId} does not have an attached volume-1 title`);
  }
  if (
    decision.proof === "upper-first-part" &&
    !/(?:^|[\s　:：\-－〜~])(?:上|上巻|前編)\s*$/u.test(audited.item.title.normalize("NFKC"))
  ) {
    throw new Error(`${decision.workId} does not have an upper/first-part title`);
  }
  if (decision.proof === "explicit-volume-1") {
    const residual = `${affix.prefix}${affix.suffix}`;
    if (!/(?:^|[^\d])1(?:巻|集|冊)?(?:$|[^\d])/u.test(residual)) {
      throw new Error(`${decision.workId} does not have explicit volume-1 evidence`);
    }
  }
  if (decision.proof === "unnumbered-first-via-volume-2") {
    const corroborating = corroboratingHits[0];
    const nextAffix =
      corroborating === undefined
        ? undefined
        : seriesAffix(corroborating.item.title, decision.canonicalTitleJa);
    if (
      affix.suffix !== "" ||
      corroborating === undefined ||
      nextAffix === undefined ||
      nextAffix.prefix !== affix.prefix ||
      pureVolumeSuffix(nextAffix.suffix) !== 2 ||
      !Number.isInteger(year(audited.item.salesDate)) ||
      year(audited.item.salesDate) > year(corroborating.item.salesDate)
    ) {
      throw new Error(`${decision.workId} volume-2 corroboration conflicts with the first volume`);
    }
    const auditedResponses = new Set(auditedHits.map((hit) => hit.responseSha256));
    if (!corroboratingHits.some((hit) => auditedResponses.has(hit.responseSha256))) {
      throw new Error(`${decision.workId} first and second volumes do not share a cached response`);
    }
  }
  return {
    current: currentHits[0]!,
    audited,
    corroborating: corroboratingHits[0],
  };
}
