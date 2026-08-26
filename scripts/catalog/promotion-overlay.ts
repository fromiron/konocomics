import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import {
  ART_AXIS_IDS,
  AXIS_IDS,
  COVERAGE_THRESHOLDS,
  GENRE_TAGS,
  NARRATIVE_AXIS_IDS,
  THEME_TAGS,
  TONE_AXIS_IDS,
} from "../../src/domain/catalog/constants";
import {
  artEvidenceManifestHeaders,
  artEvidenceManifestRowSchema,
  validateArtEvidence,
} from "./art-evidence";
import {
  evidenceSourceRowSchema,
  factorSourceRowSchema,
  recommendationContextSourceRowSchema,
  themeSourceRowSchema,
  workSourceRowSchema,
} from "./source-schema";
import { PROMOTION_HARD_BLOCKERS } from "../build-promotion-registry";

type CsvRow = Record<string, string>;

export type PromotionOverlayConfig = {
  batchId: string;
  batchLabel: string;
  batchRoot: string;
  reviewReference: string;
  reviewedAt: string;
  targetWorkCount: number;
  expectedVerifiedPositions: readonly number[];
  chunks: readonly string[];
  artPreflightReviewChunks: ReadonlySet<string>;
  annotationDirectory?: string;
  artFactorOverrideFiles?: readonly string[];
  artPreflightOverrideFiles?: readonly string[];
  terminalQaFiles?: readonly string[];
  blockerAdjudicationFile?: string;
  sceneContexts: ReadonlyMap<string, string>;
  motionReferences: ReadonlyMap<string, string>;
};

export type PromotionOverlayMode = "check" | "write";

const TEXT_AXIS_IDS = [...NARRATIVE_AXIS_IDS, ...TONE_AXIS_IDS] as const;
const ROW_SCHEMA = z.record(z.string(), z.string());
const WORK_HEADERS = [
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
] as const;
const FACTOR_HEADERS = ["workId", "axisId", "state", "value", "confidence", "evidenceId"] as const;
const THEME_HEADERS = ["workId", "themeId", "centrality", "confidence", "evidenceId"] as const;
const EVIDENCE_HEADERS = [
  "id",
  "workId",
  "targetType",
  "targetId",
  "sourceType",
  "sourceUrl",
  "fetchedAt",
  "extractorVersion",
  "reviewedByHuman",
  "confidence",
  "notes",
] as const;
const CONTEXT_HEADERS = [
  "workId",
  "catalogRole",
  "seriesGroupId",
  "volumeCount",
  "reviewAverage",
  "reviewCount",
] as const;
const BLOCKER_HEADERS = [
  "workId",
  "blockerCode",
  "blockerDetails",
  "evidenceName",
  "evidenceUrl",
  "evidencePublishedAt",
  "retrievedAt",
  "recheckPath",
] as const;
const DECISION_HEADERS = [
  "position",
  "workId",
  "canonicalTitle",
  "narrativeKnown",
  "toneKnown",
  "artKnown",
  "genreCount",
  "themeCount",
  "outcome",
  "blockerCode",
  "blockerDetails",
] as const;

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function sha256File(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function listFiles(root: string, relativeDirectory: string): string[] {
  const directory = join(root, relativeDirectory);
  if (!existsSync(directory))
    throw new Error(`Bound input directory is missing: ${relativeDirectory}`);
  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0))
    .flatMap((entry) => {
      const relativePath = `${relativeDirectory}/${entry.name}`;
      return entry.isDirectory()
        ? listFiles(root, relativePath)
        : entry.isFile()
          ? [relativePath]
          : [];
    });
}

function inputBindings(root: string, config: PromotionOverlayConfig) {
  const outputRoot = `${config.batchRoot}/final-overlay`;
  const contextFiles = [
    `${outputRoot}/context-research-positions-01-20.csv`,
    `${outputRoot}/context-research-positions-01-20.md`,
    `${outputRoot}/context-research-positions-21-50.csv`,
    `${outputRoot}/context-research-positions-21-50.md`,
  ];
  const groups = {
    frozen: [`${config.batchRoot}/frozen-work-set.csv`],
    request: [`${config.batchRoot}/annotation-review-adjudication-request.md`],
    research: listFiles(root, `${config.batchRoot}/research`),
    annotation: listFiles(
      root,
      `${config.batchRoot}/${config.annotationDirectory ?? "annotation"}`,
    ),
    reviews: listFiles(root, `${config.batchRoot}/reviews`).filter(
      (path) => !(config.terminalQaFiles ?? []).includes(path),
    ),
    adjudication: listFiles(root, `${config.batchRoot}/adjudication`),
    artPreflight: existsSync(join(root, `${config.batchRoot}/art-preflight`))
      ? listFiles(root, `${config.batchRoot}/art-preflight`)
      : [],
    artReview: listFiles(root, `${config.batchRoot}/art-review`),
    contextResearch: contextFiles,
  };
  const bound = Object.fromEntries(
    Object.entries(groups).map(([category, paths]) => [
      category,
      Object.fromEntries(
        paths.map((path) => {
          if (!existsSync(join(root, path))) throw new Error(`Bound input is missing: ${path}`);
          return [path, sha256File(join(root, path))];
        }),
      ),
    ]),
  );
  const combinedSha256 = sha256(
    `${Object.values(bound)
      .flatMap((files) => Object.entries(files))
      .map(([path, hash]) => `${path}\0${hash}`)
      .join("\n")}\n`,
  );
  return { combinedSha256, files: bound };
}

function exactArtSourceUrl(sourceUrl: string): string {
  const urls = sourceUrl
    .split(";")
    .map((url) => url.trim())
    .filter(Boolean);
  return (
    [...urls].reverse().find((url) => /(?:reader|viewer|sample)/iu.test(url)) ?? urls.at(-1) ?? ""
  );
}

function artEvidenceAuthority(sourceType: string) {
  return /licensedDistributor/iu.test(sourceType)
    ? ({ authorityClass: "publisherAuthorizedPlatform", sourceType: "manual" } as const)
    : ({ authorityClass: "originalPublisher", sourceType: "publisher" } as const);
}

function validateReviewLedgers(root: string, config: PromotionOverlayConfig) {
  const artReviewFiles = listFiles(root, `${config.batchRoot}/art-review`);
  for (const chunk of config.chunks) {
    const finalArtRows = readCsv(
      join(root, `${config.batchRoot}/art-review/chunk-${chunk}/final-art.csv`),
    );
    const artLedger = artReviewFiles
      .filter((path) => path.includes(`chunk-${chunk}`))
      .map((path) => readFileSync(join(root, path), "utf8"))
      .join("\n")
      .replaceAll(/\s+/gu, " ");
    if (
      finalArtRows.some(
        (row) => row.state === "known" && (row.evidenceRoute ?? "image") !== "community",
      )
    ) {
      for (const [label, pattern] of [
        ["exact Gemini model", /gemini-3\.7-flash-high/u],
        [
          "completed execution",
          /(?:completionStatus=completed|completed normally|outer(?:Result| subtype)?[^.;]{0,40}success|outer SUCCESS)/iu,
        ],
        [
          "original-pixel access",
          /(?:full pixel access|original[- ]detail pixel|original pixels|opened all [^.;]{0,80}pixels|openedAtOriginalPixels=yes)/iu,
        ],
        ["non-human review", /reviewedByHuman`?\s*[:=]\s*`?false/iu],
        ["Grok Art abstention", /ART_ABSTAIN/u],
        ["Muse non-use", /(?:Muse (?:is |was )?`?NOT_USED|Muse was not (?:used|invoked))/iu],
      ] as const) {
        if (!pattern.test(artLedger)) {
          throw new Error(`Art adjudication chunk ${chunk} lacks quorum evidence: ${label}`);
        }
      }
    }
    const grok = readFileSync(
      join(root, `${config.batchRoot}/reviews/grok-text-review-ledger-chunk-${chunk}.md`),
      "utf8",
    );
    for (const [label, pattern] of [
      ["requested model", /requestedModel:\s*`cursor-grok-4\.6-high`/u],
      [
        "resolved model",
        /(?:resolvedModel|resolvedModelAttestation):\s*`?Cursor Grok 4\.6 High`?/u,
      ],
      [
        "non-fast read-only mode",
        /(?:mode:\s*non-fast, read-only `(?:ask|plan)`|fastVariantInvoked:\s*`?false`?[\s\S]{0,160}mode:\s*read-only `(?:ask|plan)`)/u,
      ],
      ["successful result", /(?:outerResult|outerSubtype):\s*`?success`?/u],
      ["zero exit", /exitCode:\s*`?0`?/u],
      ["non-human review", /reviewedByHuman:\s*`?false`?/u],
      ["Art abstention", /artAccess:\s*`?(?:abstained|ART_ABSTAIN)/u],
      ["Muse non-use", /museStatus:\s*`?NOT_USED/u],
    ] as const) {
      if (!pattern.test(grok)) {
        throw new Error(`Grok review ledger chunk ${chunk} lacks execution evidence: ${label}`);
      }
    }
  }
}

function readCsv(path: string) {
  return z.array(ROW_SCHEMA).parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      columns: true,
      skip_empty_lines: true,
    }) as unknown,
  );
}

function uniqueRows(rows: readonly CsvRow[], key: string, label: string) {
  const result = new Map<string, CsvRow>();
  for (const row of rows) {
    const value = row[key] ?? "";
    if (value === "" || result.has(value))
      throw new Error(`${label} has a missing or duplicate ${key}: ${value}`);
    result.set(value, row);
  }
  return result;
}

function assertUrl(value: string, label: string) {
  if (!z.url().safeParse(value).success) throw new Error(`${label} must contain a source URL`);
}

function isExplicitlyUndated(value: string) {
  return value.startsWith("undated") || value.startsWith("not stated on page");
}

function assertSourceDate(value: string, label: string) {
  if (!isExplicitlyUndated(value) && !/\b(?:18|19|20)\d{2}(?:-\d{2}(?:-\d{2})?)?\b/u.test(value)) {
    throw new Error(`${label} must contain a source date/year or the explicit value undated`);
  }
}

function assertRetrievedAt(value: string, label: string) {
  if (!/^20\d{2}-\d{2}-\d{2}$/u.test(value))
    throw new Error(`${label} must contain a retrieval date`);
}

function assertProvenance(
  row: CsvRow,
  fields: { name: string; url: string; publishedAt: string; retrievedAt: string },
  label: string,
) {
  const sourceName = row[fields.name] ?? "";
  if (sourceName === "" || sourceName === "Official source") {
    throw new Error(`${label} must name the actual source`);
  }
  assertUrl(row[fields.url] ?? "", label);
  assertSourceDate(row[fields.publishedAt] ?? "", label);
  assertRetrievedAt(row[fields.retrievedAt] ?? "", label);
}

function escapeCsv(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeCsv(headers: readonly string[], rows: readonly CsvRow[]) {
  return `${[
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header] ?? "")).join(",")),
  ].join("\n")}\n`;
}

function expandedPageReferences(value: string) {
  const references: string[] = [];
  for (const token of value.split(";").filter(Boolean)) {
    const pageRange = /^p0*(\d+)-p0*(\d+)$/u.exec(token);
    if (pageRange !== null) {
      for (let page = Number(pageRange[1]); page <= Number(pageRange[2]); page += 1) {
        references.push(`official page ${String(page)}`);
      }
    } else {
      references.push(`${token} left`, `${token} right`);
    }
  }
  return references.join(";");
}

function evidencePublishedAt(value: string, fallbackYear: string, workId: string) {
  const sourceDate = value.match(/\b(?:18|19|20)\d{2}(?:-\d{2}-\d{2})?/u)?.[0];
  if (sourceDate !== undefined) return { value: sourceDate, fallbackNote: "" };
  if (!isExplicitlyUndated(value) || !/^(?:18|19|20)\d{2}$/u.test(fallbackYear)) {
    throw new Error(`Blocker evidence publication provenance is incomplete: ${workId}`);
  }
  return {
    value: fallbackYear,
    fallbackNote: ` Evidence source is explicitly undated; evidencePublishedAt uses canonical work firstPublishedYear ${fallbackYear} only as a fallback, not as the source publication date.`,
  };
}

function sampleHashes(value: string) {
  if (value === "") return "";
  const entries = value.split(";");
  const hashes = entries.map((entry) => {
    const match = /^[^=]+=([0-9a-f]{64})$/u.exec(entry);
    if (match === null) throw new Error(`Malformed temporary sample SHA-256 entry: ${entry}`);
    return match[1] ?? "";
  });
  if (new Set(hashes).size !== hashes.length)
    throw new Error("Temporary sample SHA-256 entries repeat");
  return hashes.join(";");
}

function readPrimaryTextSources(root: string, config: PromotionOverlayConfig) {
  const sources = new Map<string, CsvRow>();
  for (const chunk of config.chunks) {
    const content = readFileSync(
      join(root, `${config.batchRoot}/research/chunk-${chunk}.md`),
      "utf8",
    );
    const headings = [...content.matchAll(/^## workId: `([^`]+)` — .+$/gmu)];
    for (const [index, heading] of headings.entries()) {
      const section = content.slice(
        heading.index ?? 0,
        headings[index + 1]?.index ?? content.length,
      );
      const field = (name: string) =>
        new RegExp(`^- \`?${name}\`?: (.+)$`, "mu").exec(section)?.[1]?.trim() ?? "";
      const workId = heading[1] ?? "";
      if (sources.has(workId)) throw new Error(`Duplicate primary research section: ${workId}`);
      sources.set(workId, {
        workId,
        canonicalTitle: /^## workId: `[^`]+` — (.+)$/mu.exec(section)?.[1]?.trim() ?? "",
        sourceName: field("sourceName"),
        sourceUrl: field("sourceUrl"),
        publishedAt: field("publishedAt"),
        retrievedAt: field("retrievedAt"),
      });
    }
  }
  return sources;
}

function validateTerminalFactors(
  workId: string,
  rows: readonly CsvRow[],
  expectedAxes: readonly string[],
  label: string,
  batchId: string,
) {
  const axes = rows.map((row) => row.axisId ?? "");
  if (
    rows.length !== expectedAxes.length ||
    new Set(axes).size !== expectedAxes.length ||
    expectedAxes.some((axisId) => !axes.includes(axisId))
  ) {
    throw new Error(`${label} must contain each expected axis exactly once: ${workId}`);
  }
  for (const row of rows) {
    if (row.workId !== workId) throw new Error(`${label} workId mismatch: ${workId}`);
    factorSourceRowSchema.parse({
      workId,
      axisId: row.axisId ?? "",
      state: row.state ?? "",
      value: row.value ?? "",
      confidence: row.confidence ?? "",
      evidenceId: row.evidenceId ?? `${batchId}-terminal-${workId}`,
    });
    if (label === "Art") {
      if (!["", "image", "community"].includes(row.evidenceRoute ?? "")) {
        throw new Error(`Art terminal row has an invalid evidence route: ${workId}/${row.axisId}`);
      }
      if ((row.observation ?? "") === "" || (row.limitation ?? "") === "") {
        throw new Error(
          `Art terminal row lacks observation or limitation: ${workId}/${row.axisId}`,
        );
      }
      if (row.state === "known" && (row.refs ?? "") === "") {
        throw new Error(`Known Art terminal row lacks a page reference: ${workId}/${row.axisId}`);
      }
      if (
        row.state === "known" &&
        row.evidenceRoute === "community" &&
        new Set(
          (row.refs ?? "").split(";").filter((reference) => z.url().safeParse(reference).success),
        ).size < 2
      ) {
        throw new Error(
          `Community-backed Art requires two exact independent review URLs: ${workId}/${row.axisId}`,
        );
      }
    }
  }
}

function axisCoverage(rows: readonly CsvRow[], expectedAxes: readonly string[]) {
  const eligible = rows.filter(
    (row) => expectedAxes.includes(row.axisId ?? "") && row.state !== "notApplicable",
  );
  const known = eligible.filter((row) => row.state === "known").length;
  return {
    known,
    expected: eligible.length,
    ratio: eligible.length === 0 ? 0 : known / eligible.length,
  };
}

function coverageDeficiency(
  label: string,
  coverage: ReturnType<typeof axisCoverage>,
  threshold: number,
) {
  return coverage.ratio >= threshold
    ? []
    : [
        `${label} ${coverage.known}/${coverage.expected}=${coverage.ratio.toFixed(3)} (<${threshold.toFixed(3)})`,
      ];
}

function finalOverlay(root: string, config: PromotionOverlayConfig) {
  const outputRoot = `${config.batchRoot}/final-overlay`;
  const batch = join(root, config.batchRoot);
  const frozen = readCsv(join(batch, "frozen-work-set.csv"));
  const frozenIds = new Set(frozen.map((row) => row.workId ?? ""));
  if (
    frozen.length !== config.targetWorkCount ||
    frozenIds.size !== config.targetWorkCount ||
    frozenIds.has("") ||
    frozen.some((row, index) => row.position !== String(index + 1))
  )
    throw new Error(
      `${config.batchLabel} frozen work set must contain ${String(config.targetWorkCount)} unique IDs at positions 1 through ${String(config.targetWorkCount)}`,
    );
  if (frozen.some((row) => /[『』]/u.test(row.canonicalTitle ?? ""))) {
    throw new Error("A frozen canonical title contains decorative title delimiters");
  }

  validateReviewLedgers(root, config);
  const bindings = inputBindings(root, config);
  const sourceWorks = uniqueRows(
    readCsv(join(root, "data/source/works.csv")),
    "id",
    "Source works",
  );
  const registry = uniqueRows(
    readCsv(join(root, "data/staging/catalog-expansion/promotion-registry.csv")),
    "workId",
    "Promotion registry",
  );
  const textFactors = new Map<string, CsvRow[]>();
  const genres = new Map<string, CsvRow[]>();
  const themes = new Map<string, CsvRow[]>();
  const artFactors = new Map<string, CsvRow[]>();
  const preflight = new Map<string, CsvRow>();
  for (const chunk of config.chunks) {
    for (const row of readCsv(join(batch, `adjudication/text-final-chunk-${chunk}.csv`)).filter(
      (candidate) => TEXT_AXIS_IDS.includes(candidate.axisId as (typeof TEXT_AXIS_IDS)[number]),
    )) {
      textFactors.set(row.workId ?? "", [...(textFactors.get(row.workId ?? "") ?? []), row]);
    }
    for (const row of readCsv(join(batch, `adjudication/genres-final-chunk-${chunk}.csv`))) {
      genres.set(row.workId ?? "", [...(genres.get(row.workId ?? "") ?? []), row]);
    }
    for (const row of readCsv(join(batch, `adjudication/themes-final-chunk-${chunk}.csv`))) {
      themes.set(row.workId ?? "", [...(themes.get(row.workId ?? "") ?? []), row]);
    }
    for (const row of readCsv(join(batch, `art-review/chunk-${chunk}/final-art.csv`))) {
      artFactors.set(row.workId ?? "", [...(artFactors.get(row.workId ?? "") ?? []), row]);
    }
    const preflightPath = config.artPreflightReviewChunks.has(chunk)
      ? join(batch, `art-review/chunk-${chunk}/preflight.csv`)
      : join(batch, `art-preflight/chunk-${chunk}/preflight.csv`);
    if (existsSync(preflightPath)) {
      for (const row of readCsv(preflightPath)) {
        const workId = row.workId ?? "";
        if (preflight.has(workId)) throw new Error(`Duplicate Art preflight row: ${workId}`);
        preflight.set(workId, row);
      }
    }
  }
  for (const file of config.artFactorOverrideFiles ?? []) {
    const rows = readCsv(join(batch, file));
    for (const workId of new Set(rows.map((row) => row.workId ?? ""))) {
      artFactors.set(
        workId,
        rows.filter((row) => row.workId === workId),
      );
    }
  }
  for (const file of config.artPreflightOverrideFiles ?? []) {
    for (const row of readCsv(join(batch, file))) preflight.set(row.workId ?? "", row);
  }
  for (const [label, rows] of [
    ["text terminal matrix", textFactors],
    ["Genre terminal matrix", genres],
    ["Theme terminal matrix", themes],
    ["Art terminal matrix", artFactors],
  ] as const) {
    for (const workId of rows.keys()) {
      if (!frozenIds.has(workId))
        throw new Error(`${label} contains an out-of-batch work: ${workId}`);
    }
  }
  if ([...preflight.keys()].some((workId) => !frozenIds.has(workId))) {
    throw new Error("Art preflight contains an out-of-batch work");
  }
  const contexts = new Map<string, CsvRow>();
  for (const file of [
    "context-research-positions-01-20.csv",
    "context-research-positions-21-50.csv",
  ]) {
    const path = join(root, outputRoot, file);
    if (!existsSync(path)) throw new Error(`Recommendation context research is missing: ${file}`);
    for (const row of readCsv(path)) {
      if (contexts.has(row.workId ?? ""))
        throw new Error(`Duplicate context research: ${row.workId}`);
      if (!frozenIds.has(row.workId ?? "")) {
        throw new Error(`Context research contains an out-of-batch work: ${row.workId}`);
      }
      assertProvenance(
        row,
        {
          name: "sourceName",
          url: "sourceUrl",
          publishedAt: "sourcePublishedAt",
          retrievedAt: "retrievedAt",
        },
        `Context research ${row.workId}`,
      );
      if ((row.statusNote ?? "") === "")
        throw new Error(`Context research lacks a status note: ${row.workId}`);
      contexts.set(row.workId ?? "", row);
    }
  }
  const primarySources = readPrimaryTextSources(root, config);
  if (
    primarySources.size !== config.targetWorkCount ||
    [...primarySources.keys()].some((workId) => !frozenIds.has(workId))
  ) {
    throw new Error(
      `Primary official research must contain exactly the ${String(config.targetWorkCount)} frozen works`,
    );
  }
  const explicitBlockers = new Map<string, CsvRow[]>();
  if (config.blockerAdjudicationFile !== undefined) {
    const path = join(root, config.batchRoot, config.blockerAdjudicationFile);
    if (!existsSync(path)) throw new Error(`Independent blocker adjudication is missing: ${path}`);
    for (const row of readCsv(path)) {
      const workId = row.workId ?? "";
      if (
        !frozenIds.has(workId) ||
        !Object.hasOwn(PROMOTION_HARD_BLOCKERS, row.blockerCode ?? "") ||
        (row.blockerDetails ?? "") === "" ||
        (row.recheckPath ?? "") === ""
      ) {
        throw new Error(`Invalid independent blocker adjudication: ${workId}`);
      }
      assertProvenance(
        row,
        {
          name: "evidenceName",
          url: "evidenceUrl",
          publishedAt: "evidencePublishedAt",
          retrievedAt: "retrievedAt",
        },
        `Independent blocker adjudication ${workId}`,
      );
      explicitBlockers.set(workId, [...(explicitBlockers.get(workId) ?? []), row]);
    }
  }

  const decisions: CsvRow[] = [];
  const blockers: CsvRow[] = [];
  const works: CsvRow[] = [];
  const factors: CsvRow[] = [];
  const finalThemes: CsvRow[] = [];
  const evidence: CsvRow[] = [];
  const artManifest: CsvRow[] = [];
  const recommendationContext: CsvRow[] = [];

  for (const frozenRow of frozen) {
    const workId = frozenRow.workId ?? "";
    const canonicalTitle = frozenRow.canonicalTitle ?? "";
    const sourceWork = sourceWorks.get(workId);
    const registryRow = registry.get(workId);
    const workText = textFactors.get(workId) ?? [];
    const workArt = artFactors.get(workId) ?? [];
    const workThemes = themes.get(workId) ?? [];
    const genreRows = genres.get(workId) ?? [];
    const artSource = preflight.get(workId);
    const primary = primarySources.get(workId);
    if (
      sourceWork === undefined ||
      registryRow === undefined ||
      primary === undefined ||
      registryRow.plannedBatch !== config.batchId ||
      registryRow.safetyStatus !== "safe" ||
      registryRow.canonicalStatus !== "verified" ||
      registryRow.representativeIsbnStatus !== "verified"
    ) {
      throw new Error(`${config.batchLabel} base gate or terminal matrix is incomplete: ${workId}`);
    }
    if (
      canonicalTitle === "" ||
      sourceWork.title !== canonicalTitle ||
      registryRow.canonicalTitle !== canonicalTitle ||
      primary.canonicalTitle !== canonicalTitle ||
      [
        sourceWork.title,
        registryRow.canonicalTitle,
        ...(artSource === undefined ? [] : [artSource.canonicalTitle]),
        primary.canonicalTitle,
      ].some((title) => /[『』]/u.test(title ?? ""))
    ) {
      throw new Error(
        `Frozen/source/registry/research title mismatch or delimiter contamination: ${workId}`,
      );
    }
    validateTerminalFactors(workId, workText, TEXT_AXIS_IDS, "Text", config.batchId);
    validateTerminalFactors(workId, workArt, ART_AXIS_IDS, "Art", config.batchId);
    if (genreRows.length !== 1) throw new Error(`Expected exactly one Genre row: ${workId}`);
    const workGenres = (genreRows[0]?.genres ?? "").split(";").filter(Boolean);
    if (new Set(workGenres).size !== workGenres.length)
      throw new Error(`Duplicate Genre: ${workId}`);
    for (const genre of workGenres) z.enum(GENRE_TAGS).parse(genre);
    const themeIds = workThemes.map((row) => row.themeId ?? "");
    if (new Set(themeIds).size !== themeIds.length) throw new Error(`Duplicate Theme: ${workId}`);
    for (const row of workThemes) themeSourceRowSchema.parse(row);
    assertProvenance(
      primary,
      {
        name: "sourceName",
        url: "sourceUrl",
        publishedAt: "publishedAt",
        retrievedAt: "retrievedAt",
      },
      `Primary text research ${workId}`,
    );
    if (artSource !== undefined) {
      assertProvenance(
        artSource,
        {
          name: "sourceName",
          url: "officialUrl",
          publishedAt: "publishedAt",
          retrievedAt: "retrievedAt",
        },
        `Art preflight ${workId}`,
      );
      for (const field of [
        "sourceType",
        "editionMapping",
        "accessResult",
        "stateEligibility",
        "limitation",
      ] as const) {
        if ((artSource[field] ?? "") === "")
          throw new Error(`Art preflight lacks ${field}: ${workId}`);
      }
      sampleHashes(artSource.temporarySampleSha256 ?? "");
    }
    const narrative = axisCoverage(workText, NARRATIVE_AXIS_IDS);
    const tone = axisCoverage(workText, TONE_AXIS_IDS);
    const art = axisCoverage(workArt, ART_AXIS_IDS);
    const deficiencies = [
      ...coverageDeficiency("Narrative", narrative, COVERAGE_THRESHOLDS.narrative),
      ...coverageDeficiency("Tone", tone, COVERAGE_THRESHOLDS.tone),
      ...(workGenres.length === 0 ? ["Genre 0"] : []),
      ...(workThemes.length === 0 ? ["Theme 0"] : []),
    ];
    const defaultBlockerDetails =
      deficiencies.length === 0
        ? ""
        : `Finite official-first routes exhausted; unchanged promotion coverage fails: ${deficiencies.join(
            "; ",
          )}. Unknown is not a low value and no value was filled to meet a quota.`;
    let blockerRecords: CsvRow[] = [];
    if (deficiencies.length > 0) {
      const source = primarySources.get(workId);
      if (source === undefined) throw new Error(`Blocker evidence is missing: ${workId}`);
      const publication = evidencePublishedAt(
        source.publishedAt ?? "",
        sourceWork.firstPublishedYear ?? "",
        workId,
      );
      const recheck = [
        ...(narrative.ratio < COVERAGE_THRESHOLDS.narrative
          ? [
              "Provide direct entry-range evidence for enough remaining Narrative axes to reach the frozen coverage threshold",
            ]
          : []),
        ...(tone.ratio < COVERAGE_THRESHOLDS.tone
          ? [
              "Provide direct entry-range evidence for enough remaining Tone axes to reach the frozen coverage threshold",
            ]
          : []),
        ...(workGenres.length === 0 ? ["Provide direct official entry-range Genre evidence"] : []),
        ...(workThemes.length === 0
          ? ["Provide direct official evidence for at least one central Theme"]
          : []),
      ];
      blockerRecords = explicitBlockers.get(workId) ?? [];
      if (blockerRecords.length === 0) {
        if (config.blockerAdjudicationFile !== undefined) {
          decisions.push({
            position: frozenRow.position ?? "",
            workId,
            canonicalTitle,
            narrativeKnown: String(narrative.known),
            toneKnown: String(tone.known),
            artKnown: String(art.known),
            genreCount: String(workGenres.length),
            themeCount: String(workThemes.length),
            outcome: "pending",
            blockerCode: "",
            blockerDetails: "",
          });
          continue;
        }
        blockerRecords = [
          {
            blockerCode: "SOURCE_INFORMATION_UNAVAILABLE",
            blockerDetails: defaultBlockerDetails,
            recheckPath: recheck.join("; "),
          },
        ];
      }
      if (
        blockerRecords.length === 0 ||
        new Set(blockerRecords.map((record) => record.blockerCode)).size !==
          blockerRecords.length ||
        blockerRecords.some(
          (record) =>
            record.blockerCode === "" || record.blockerDetails === "" || record.recheckPath === "",
        )
      ) {
        throw new Error(`Invalid blocker override: ${workId}`);
      }
      blockers.push(
        ...blockerRecords.map((record) => {
          const explicit = record.evidenceUrl !== undefined;
          return {
            workId,
            blockerCode: record.blockerCode ?? "",
            blockerDetails: `${record.blockerDetails ?? ""}${explicit ? "" : publication.fallbackNote} Combined input/review packet binding: SHA-256=${bindings.combinedSha256}; see final-overlay-validation.json inputBindings.`,
            evidenceName: explicit ? (record.evidenceName ?? "") : (source.sourceName ?? ""),
            evidenceUrl: explicit
              ? (record.evidenceUrl ?? "")
              : (source.officialUrl ?? source.sourceUrl ?? ""),
            evidencePublishedAt: explicit ? (record.evidencePublishedAt ?? "") : publication.value,
            retrievedAt: explicit ? (record.retrievedAt ?? "") : (source.retrievedAt ?? ""),
            recheckPath: record.recheckPath ?? "",
          };
        }),
      );
    }
    decisions.push({
      position: frozenRow.position ?? "",
      workId,
      canonicalTitle,
      narrativeKnown: String(narrative.known),
      toneKnown: String(tone.known),
      artKnown: String(art.known),
      genreCount: String(workGenres.length),
      themeCount: String(workThemes.length),
      outcome: deficiencies.length === 0 ? "recommendationVerified" : "promotionBlocked",
      blockerCode: blockerRecords.map((record) => record.blockerCode).join(";"),
      blockerDetails: blockerRecords.map((record) => record.blockerDetails).join(" | "),
    });
    if (deficiencies.length > 0) continue;

    const context = contexts.get(workId);
    if (context === undefined || primary === undefined) {
      throw new Error(`Verified overlay provenance is incomplete: ${workId}`);
    }
    works.push({
      ...sourceWork,
      status:
        context.status === undefined || context.status === ""
          ? (sourceWork.status ?? "")
          : context.status,
      genres: workGenres.join(";"),
      onboardingEligible: "true",
      recommendationEligible: "true",
      libraryOnly: "false",
      annotationReviewMethod: "authorizedModelPanel",
      annotationReviewedAt: config.reviewedAt,
      annotationReviewReference: config.reviewReference,
    });

    const textEvidenceId = `ev-${config.batchId}-text-${workId}`;
    const sortedText = [...workText].sort(
      (left, right) =>
        AXIS_IDS.indexOf(left.axisId as (typeof AXIS_IDS)[number]) -
        AXIS_IDS.indexOf(right.axisId as (typeof AXIS_IDS)[number]),
    );
    const knownArtRoutes = new Set(
      workArt.filter((row) => row.state !== "unknown").map((row) => row.evidenceRoute || "image"),
    );
    if (knownArtRoutes.size > 1) {
      throw new Error(`Art evidence routes cannot be mixed within one work: ${workId}`);
    }
    const artRoute = knownArtRoutes.has("community")
      ? "community"
      : knownArtRoutes.has("image")
        ? "image"
        : "none";
    for (const row of sortedText) factors.push({ ...row, evidenceId: textEvidenceId });
    for (const row of [...workThemes].sort(
      (left, right) =>
        THEME_TAGS.indexOf(left.themeId as (typeof THEME_TAGS)[number]) -
        THEME_TAGS.indexOf(right.themeId as (typeof THEME_TAGS)[number]),
    )) {
      finalThemes.push({ ...row, evidenceId: textEvidenceId });
    }
    const claimConfidences = [
      ...sortedText,
      ...workThemes,
      ...(artRoute === "community" ? workArt : []),
    ]
      .filter((row) => row.state === "known" || row.confidence !== "")
      .map((row) => Number(row.confidence));
    evidence.push({
      id: textEvidenceId,
      workId,
      targetType: "work",
      targetId: workId,
      sourceType: "model",
      sourceUrl: primary.sourceUrl ?? "",
      fetchedAt: config.reviewedAt,
      extractorVersion: `${config.batchId}-text-overlay-v1`,
      reviewedByHuman: "false",
      confidence: String(Math.min(...claimConfidences)),
      notes: `reviewedByHuman=false; primary source lead/index=${primary.sourceName}; source published=${primary.publishedAt}; retrieved=${primary.retrievedAt}; the sourceUrl is a research lead/index and is not asserted as the sole support for every Axis or Theme. Supporting official, annotation, review, and adjudication packets are immutably bound under final-overlay-validation.json inputBindings; combined input/review packet SHA-256=${bindings.combinedSha256}. Official-first entry-range research, independent Pass B, and Local Codex Pass C were combined claim by claim. Repeated bounded independent community observations may support text or Art claims only where recorded; selection provenance was not reused as Factor evidence.`,
    });

    const sortedArt = [...workArt].sort(
      (left, right) =>
        ART_AXIS_IDS.indexOf(left.axisId as (typeof ART_AXIS_IDS)[number]) -
        ART_AXIS_IDS.indexOf(right.axisId as (typeof ART_AXIS_IDS)[number]),
    );
    if (artRoute !== "image") {
      for (const row of sortedArt) {
        factors.push({
          workId,
          axisId: row.axisId ?? "",
          state: row.state ?? "",
          value: row.value ?? "",
          confidence: row.confidence ?? "",
          evidenceId: textEvidenceId,
        });
      }
    } else {
      const contextsForArt = config.sceneContexts.get(workId);
      if (artSource === undefined || contextsForArt === undefined) {
        throw new Error(`Verified image Art provenance is incomplete: ${workId}`);
      }
      const expandedRefs = expandedPageReferences(artSource.pageRefs ?? "");
      const artSourceUrl = exactArtSourceUrl(artSource.officialUrl ?? "");
      const artAuthority = artEvidenceAuthority(artSource.sourceType ?? "");
      if (
        Number(artSource.readableInternalPageCount) < 6 ||
        Number(artSource.distinctContextCount) < 2 ||
        expandedRefs.split(";").filter(Boolean).length < 6 ||
        contextsForArt.split(";").length < 2
      ) {
        throw new Error(`Verified Art sample gate is incomplete: ${workId}`);
      }
      for (const row of sortedArt) {
        const axisId = row.axisId ?? "";
        const evidenceId = `ev-${config.batchId}-art-${workId}-${axisId.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase()}`;
        const pageOrTimeRefs =
          axisId === "motionImpact" && row.state === "known"
            ? (config.motionReferences.get(workId) ?? "")
            : expandedRefs;
        if (axisId === "motionImpact" && row.state === "known" && pageOrTimeRefs === "") {
          throw new Error(`Known motion sequence lacks an exact range: ${workId}`);
        }
        factors.push({
          workId,
          axisId,
          state: row.state ?? "",
          value: row.value ?? "",
          confidence: row.confidence ?? "",
          evidenceId,
        });
        const hashes = sampleHashes(artSource.temporarySampleSha256 ?? "");
        if (hashes === "") throw new Error(`Verified Art sample hashes are missing: ${workId}`);
        const limitation = `${row.limitation}; ${artSource.limitation}; temporary sample SHA-256=${hashes}. Temporary images and paths are not committed.`;
        evidence.push({
          id: evidenceId,
          workId,
          targetType: "axis",
          targetId: axisId,
          sourceType: artAuthority.sourceType,
          sourceUrl: artSourceUrl,
          fetchedAt: config.reviewedAt,
          extractorVersion: `${config.batchId}-art-overlay-v1`,
          reviewedByHuman: "false",
          confidence: row.state === "known" ? (row.confidence ?? "") : "1",
          notes: `reviewedByHuman=false; source=${artSource.sourceName}; published=${artSource.publishedAt}; retrieved=${artSource.retrievedAt}; Local Codex and gemini-3.7-flash-high pixel quorum; Cursor Grok ART_ABSTAIN; Muse NOT_USED; combined input/review packet SHA-256=${bindings.combinedSha256}; ${limitation}`,
        });
        artManifest.push({
          workId,
          axisId,
          state: row.state ?? "",
          value: row.value ?? "",
          confidence: row.confidence ?? "",
          authorityClass: artAuthority.authorityClass,
          sourceType: artAuthority.sourceType,
          sourceUrl: artSourceUrl,
          edition: artSource.editionMapping ?? "",
          scopeMapping:
            "Official internal preview mapped to the entry_1_3_volumes contract; static claims require at least 6 readable pages and 2 scene contexts.",
          pageOrTimeRefs,
          sampleCount: artSource.readableInternalPageCount ?? "",
          contexts: contextsForArt,
          observation: row.observation ?? "",
          limitation,
          reviewStatus: "quorum-verified;adjudicated;reviewedByHuman=false",
        });
      }
    }
    recommendationContext.push({
      workId,
      catalogRole: context.catalogRole ?? "",
      seriesGroupId: context.seriesGroupId ?? "",
      volumeCount: context.volumeCount ?? "",
      reviewAverage: context.reviewAverage ?? "",
      reviewCount: context.reviewCount ?? "",
    });
  }

  const verifiedIds = decisions
    .filter((row) => row.outcome === "recommendationVerified")
    .map((row) => row.workId ?? "");
  const verifiedPositions = decisions
    .filter((row) => row.outcome === "recommendationVerified")
    .map((row) => Number(row.position));
  const blockedIds = decisions
    .filter((row) => row.outcome === "promotionBlocked")
    .map((row) => row.workId ?? "");
  const pendingIds = decisions
    .filter((row) => row.outcome === "pending")
    .map((row) => row.workId ?? "");
  const blockerWorkIds = [...new Set(blockers.map((row) => row.workId ?? ""))];
  if (
    [...explicitBlockers.keys()].some(
      (workId) => !blockedIds.includes(workId) || !blockerWorkIds.includes(workId),
    )
  ) {
    throw new Error(`${config.batchLabel} blocker adjudication contains a non-blocked work`);
  }
  if (JSON.stringify(verifiedPositions) !== JSON.stringify(config.expectedVerifiedPositions)) {
    throw new Error(
      `${config.batchLabel} outcome drifted from the frozen ${String(config.expectedVerifiedPositions.length)}/${String(config.targetWorkCount - config.expectedVerifiedPositions.length)} adjudication: ${verifiedPositions.join(",")}`,
    );
  }
  const expectedFactorPairs = verifiedIds.flatMap((workId) =>
    AXIS_IDS.map((axisId) => `${workId}\0${axisId}`),
  );
  if (
    JSON.stringify(factors.map((row) => `${row.workId}\0${row.axisId}`)) !==
      JSON.stringify(expectedFactorPairs) ||
    works.length !== verifiedIds.length ||
    recommendationContext.length !== verifiedIds.length ||
    evidence.length !== verifiedIds.length + artManifest.length ||
    JSON.stringify(blockerWorkIds) !== JSON.stringify(blockedIds) ||
    blockedIds.length + verifiedIds.length + pendingIds.length !== config.targetWorkCount
  ) {
    throw new Error(`${config.batchLabel} overlay cardinality or canonical order is invalid`);
  }

  const located = <T>(file: string, values: readonly T[]) =>
    values.map((value, index) => ({ file, row: index + 2, value }));
  const parsedWorks = works.map((row) => workSourceRowSchema.parse(row));
  const parsedFactors = factors.map((row) => factorSourceRowSchema.parse(row));
  const parsedThemes = finalThemes.map((row) => themeSourceRowSchema.parse(row));
  const parsedEvidence = evidence.map((row) => evidenceSourceRowSchema.parse(row));
  const parsedContext = recommendationContext.map((row) =>
    recommendationContextSourceRowSchema.parse(row),
  );
  const parsedManifest = artManifest.map((row) => artEvidenceManifestRowSchema.parse(row));
  const artIssues = validateArtEvidence({
    works: located("works-final.csv", parsedWorks),
    factors: located(
      "factors-final.csv",
      parsedFactors.filter((row) =>
        ART_AXIS_IDS.includes(row.axisId as (typeof ART_AXIS_IDS)[number]),
      ),
    ),
    evidence: located("evidence-final.csv", parsedEvidence),
    manifest: located("art-evidence-manifest-final.csv", parsedManifest),
  });
  if (artIssues.length > 0) throw new Error(artIssues.map((issue) => issue.message).join("\n"));
  if (parsedThemes.length !== finalThemes.length || parsedContext.length !== verifiedIds.length) {
    throw new Error("Theme or recommendation context validation failed");
  }

  const contents = new Map<string, string>([
    ["promotion-decisions.csv", serializeCsv(DECISION_HEADERS, decisions)],
    ["works-final.csv", serializeCsv(WORK_HEADERS, works)],
    ["factors-final.csv", serializeCsv(FACTOR_HEADERS, factors)],
    ["themes-final.csv", serializeCsv(THEME_HEADERS, finalThemes)],
    ["evidence-final.csv", serializeCsv(EVIDENCE_HEADERS, evidence)],
    ["art-evidence-manifest-final.csv", serializeCsv(artEvidenceManifestHeaders, artManifest)],
    ["recommendation-context-final.csv", serializeCsv(CONTEXT_HEADERS, recommendationContext)],
    ["promotion-blockers-final.csv", serializeCsv(BLOCKER_HEADERS, blockers)],
  ]);
  for (const [name, content] of contents) {
    if (/(?:\/tmp\/|temporaryImageRoot)/u.test(content)) {
      throw new Error(`Generated overlay leaks a temporary image path: ${name}`);
    }
  }
  const validation = `${JSON.stringify(
    {
      schemaVersion: 3,
      batchId: config.batchId,
      reviewedByHuman: false,
      humanValidation: "NOT_RUN",
      targetWorkCount: config.targetWorkCount,
      recommendationVerified: verifiedIds.length,
      promotionBlocked: blockedIds.length,
      pending: pendingIds.length,
      expectedVerifiedPositions: config.expectedVerifiedPositions,
      promotionCoverageThresholds: {
        narrative: COVERAGE_THRESHOLDS.narrative,
        tone: COVERAGE_THRESHOLDS.tone,
        denominator: "known+unknown; notApplicable excluded",
      },
      scoringCoverageThresholds: {
        art: COVERAGE_THRESHOLDS.art,
        effect: "neutral shrink only; not a promotion gate",
      },
      inputBindings: bindings,
      known: {
        text: factors.filter(
          (row) =>
            !ART_AXIS_IDS.includes(row.axisId as (typeof ART_AXIS_IDS)[number]) &&
            row.state === "known",
        ).length,
        art: factors.filter(
          (row) =>
            ART_AXIS_IDS.includes(row.axisId as (typeof ART_AXIS_IDS)[number]) &&
            row.state === "known",
        ).length,
      },
      unknown: {
        text: factors.filter(
          (row) =>
            !ART_AXIS_IDS.includes(row.axisId as (typeof ART_AXIS_IDS)[number]) &&
            row.state === "unknown",
        ).length,
        art: factors.filter(
          (row) =>
            ART_AXIS_IDS.includes(row.axisId as (typeof ART_AXIS_IDS)[number]) &&
            row.state === "unknown",
        ).length,
      },
      files: Object.fromEntries([...contents].map(([name, content]) => [name, sha256(content)])),
    },
    null,
    2,
  )}\n`;
  contents.set("final-overlay-validation.json", validation);
  return {
    contents,
    verified: verifiedIds.length,
    blocked: blockedIds.length,
    pending: pendingIds.length,
  };
}

export function runPromotionOverlay(
  config: PromotionOverlayConfig,
  mode: PromotionOverlayMode,
  root = process.cwd(),
) {
  const canonicalRoot = resolve(root);
  const outputRoot = `${config.batchRoot}/final-overlay`;
  const result = finalOverlay(canonicalRoot, config);
  for (const [file, content] of result.contents) {
    const path = join(canonicalRoot, outputRoot, file);
    if (mode === "check") {
      if (!existsSync(path) || readFileSync(path, "utf8") !== content) {
        throw new Error(`${config.batchLabel} final overlay is missing or stale: ${file}`);
      }
    } else {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content, "utf8");
    }
  }
  return { verified: result.verified, blocked: result.blocked, pending: result.pending };
}
