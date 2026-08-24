import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { parse } from "csv-parse/sync";
import { expect, it } from "vitest";
import { z } from "zod";

import { repairCatalogExpansionCanonical } from "../../../scripts/repair-catalog-expansion-canonical";

const WINNER_WORK = "work-3080de07cac432363d5b";
const WINNER_CANDIDATE = "candidate-3080de07cac432363d5b";
const LOSER_WORK = "work-e90e43b0be3c3ccee556";
const LOSER_CANDIDATE = "candidate-e90e43b0be3c3ccee556";
const WINNER_EVIDENCE = "ev-rakuten-library-work-3080de07cac432363d5b";
const LOSER_EVIDENCE = "ev-rakuten-library-work-e90e43b0be3c3ccee556";
const ALTERNATE_PAIRS = [
  {
    winnerWorkId: "work-dc6da46b90e2badecec5",
    winnerTitle: "とめはねっ！ 鈴里高校書道部",
    loserWorkId: "work-3b65a9ad6f6612c1077e",
    loserTitle: "とめはねっ！",
  },
  {
    winnerWorkId: "work-060a72fe10cf6ba9cbfc",
    winnerTitle: "チェーザレ 破壊の創造者",
    loserWorkId: "work-953355c6478f97b695db",
    loserTitle: "チェーザレ",
  },
] as const;
const AXES =
  "progression problemSolving strategy pacing mysteryReveal worldBuilding characterArcWeight relationshipStructure comedy darkness mentalStress romance emotionalWarmth artRealism artDensity visualSoftness motionImpact".split(
    " ",
  );
const CHANGED_FILES = [
  "data/source/works.csv",
  "data/source/volumes.csv",
  "data/source/factors.csv",
  "data/source/evidence/evidence.csv",
  "data/staging/catalog-expansion/candidates.csv",
  "data/staging/catalog-expansion/source-membership.csv",
  "data/staging/catalog-expansion/canonical-mapping.csv",
  "data/staging/catalog-expansion/safety-review.csv",
  "data/staging/catalog-expansion/rakuten-matches.csv",
  "data/staging/catalog-expansion/annotation-status.csv",
] as const;
const HEADERS: Readonly<Record<string, string>> = {
  "data/source/works.csv":
    "id,title,titleKana,creators,publisher,demographic,status,firstPublishedYear,genres,factorScope,onboardingEligible,recommendationEligible,libraryOnly,metadataConfidence,groupingConfidence,sourceAgreement,annotationReviewMethod,annotationReviewedAt,annotationReviewReference,evidenceId",
  "data/source/volumes.csv":
    "id,workId,volumeNumber,isbn,releaseDate,editionKind,isRepresentative,evidenceId",
  "data/source/factors.csv": "workId,axisId,state,value,confidence,evidenceId",
  "data/source/evidence/evidence.csv":
    "id,workId,targetType,targetId,sourceType,sourceUrl,fetchedAt,extractorVersion,reviewedByHuman,confidence,notes",
  "data/source/aliases.csv": "workId,alias",
  "data/source/themes.csv": "workId,themeId,centrality,confidence,evidenceId",
  "data/source/recommendation-context.csv":
    "workId,catalogRole,seriesGroupId,volumeCount,reviewAverage,reviewCount",
  "data/source/recommendation-config.csv": "catalogAverageRating",
  "data/source/evidence/art-evidence-manifest.csv":
    "workId,axisId,state,value,confidence,authorityClass,sourceType,sourceUrl,edition,scopeMapping,pageOrTimeRefs,sampleCount,contexts,observation,limitation,reviewStatus",
  "data/staging/catalog-expansion/source-registry.csv":
    "sourceId,sourceKind,organization,title,url,publishedAt,retrievedAt,listNature,registryStatus,snapshotUrl,snapshotSha256,originalItemCount,japaneseMangaItemCount,excludedWebtoonCount,excludedAdultCount,excludedNonJapaneseCount,excludedNonMangaCount,duplicateCount,canonicalMappingCount,unresolvedCount,notes",
  "data/staging/catalog-expansion/raw-source-items.csv":
    "sourceItemId,sourceId,sourceRowNumber,rawPublicationClass,rawTitle,rawCreator,rawMainGenre,rawSubgenre,rawRating,rawNotes,rawUpdatedAt",
  "data/staging/catalog-expansion/candidates.csv":
    "candidateId,canonicalTitleJa,titleKana,creatorsJa,firstPublishedYear,originCountry,format,publicationStatus,notes",
  "data/staging/catalog-expansion/source-membership.csv":
    "sourceItemId,sourceId,status,candidateId,workId,decisionRef",
  "data/staging/catalog-expansion/canonical-mapping.csv":
    "mappingId,sourceItemId,candidateId,workId,mappingType,canonicalTitleJa,confidence,evidenceName,evidenceUrl,evidencePublishedAt,retrievedAt,notes",
  "data/staging/catalog-expansion/exclusions.csv":
    "exclusionId,sourceItemId,candidateId,status,reason,evidenceName,evidenceUrl,evidencePublishedAt,retrievedAt,notes",
  "data/staging/catalog-expansion/safety-review.csv":
    "candidateId,safetyStatus,evidenceName,evidenceUrl,evidencePublishedAt,retrievedAt,reviewedAt,notes",
  "data/staging/catalog-expansion/rakuten-matches.csv":
    "rakutenMatchId,candidateId,matchStatus,isbn,matchedTitle,editionKind,isRepresentative,sourceUrl,checkedAt,notes",
  "data/staging/catalog-expansion/annotation-status.csv":
    "candidateId,workId,bibliographyStatus,factorStatus,themeStatus,evidenceStatus,artEvidenceStatus,reviewStatus,reviewReference,updatedAt,notes",
  "data/staging/catalog-expansion/representative-volume-decisions.csv":
    "workId,candidateId,canonicalTitleJa,creatorsJa,decisionKind,currentIsbn,auditedIsbn,proof,corroboratingIsbn",
};

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function writeRows(root: string, path: string, rows: readonly (readonly string[])[] = []) {
  const header = HEADERS[path];
  if (header === undefined) throw new Error(`Missing fixture header: ${path}`);
  const output = join(root, path);
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(
    output,
    `${[header.split(","), ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`,
    "utf8",
  );
}

function records(root: string, path: string) {
  return z
    .array(z.record(z.string(), z.string()))
    .parse(
      parse(readFileSync(join(root, path), "utf8"), { columns: true, skip_empty_lines: true }),
    );
}

function createFixture(root: string) {
  writeRows(root, "data/source/works.csv", [
    [
      WINNER_WORK,
      "関根くんの恋",
      "",
      "河内遙",
      "太田出版",
      "unknown",
      "unknown",
      "2010",
      "",
      "entry_1_3_volumes",
      "false",
      "false",
      "true",
      "1",
      "1",
      "1",
      "unreviewed",
      "",
      "",
      WINNER_EVIDENCE,
    ],
    [
      LOSER_WORK,
      "関根くんの恋",
      "",
      "河内遥",
      "太田出版",
      "unknown",
      "unknown",
      "",
      "",
      "entry_1_3_volumes",
      "false",
      "false",
      "true",
      "1",
      "1",
      "1",
      "unreviewed",
      "",
      "",
      LOSER_EVIDENCE,
    ],
  ]);
  writeRows(root, "data/source/volumes.csv", [
    [
      `${WINNER_WORK}-representative`,
      WINNER_WORK,
      "1",
      "9784778321079",
      "",
      "standard",
      "true",
      WINNER_EVIDENCE,
    ],
    [
      `${LOSER_WORK}-representative`,
      LOSER_WORK,
      "4",
      "9784778321840",
      "",
      "standard",
      "true",
      LOSER_EVIDENCE,
    ],
  ]);
  writeRows(root, "data/source/factors.csv", [
    ...AXES.map((axis) => [WINNER_WORK, axis, "unknown", "", "", WINNER_EVIDENCE]),
    ...AXES.map((axis) => [LOSER_WORK, axis, "unknown", "", "", LOSER_EVIDENCE]),
  ]);
  writeRows(root, "data/source/evidence/evidence.csv", [
    [
      WINNER_EVIDENCE,
      WINNER_WORK,
      "work",
      WINNER_WORK,
      "rakuten",
      "https://example.com/winner",
      "2026-08-22T00:00:00+09:00",
      "fixture-v1",
      "false",
      "1",
      "Winner bibliography.",
    ],
    [
      LOSER_EVIDENCE,
      LOSER_WORK,
      "work",
      LOSER_WORK,
      "rakuten",
      "https://example.com/loser",
      "2026-08-22T00:00:00+09:00",
      "fixture-v1",
      "false",
      "1",
      "Loser bibliography.",
    ],
  ]);
  for (const path of [
    "data/source/aliases.csv",
    "data/source/themes.csv",
    "data/source/recommendation-context.csv",
    "data/source/evidence/art-evidence-manifest.csv",
  ])
    writeRows(root, path);
  writeRows(root, "data/source/recommendation-config.csv", [["0"]]);

  const registryRow = (year: string, hash: string) => [
    `source-${year}`,
    "award",
    "Awards",
    `${year} list`,
    `https://example.com/${year}`,
    year,
    "2026-08-22",
    "official selection",
    "complete",
    `https://example.com/snapshot-${year}`,
    hash.repeat(64),
    "1",
    "1",
    "0",
    "0",
    "0",
    "0",
    "0",
    "1",
    "0",
    "",
  ];
  writeRows(root, "data/staging/catalog-expansion/source-registry.csv", [
    registryRow("2011", "a"),
    registryRow("2012", "b"),
  ]);
  writeRows(root, "data/staging/catalog-expansion/raw-source-items.csv", [
    ["item-2011", "source-2011", "1", "nominee", "関根くんの恋", "河内遥", "", "", "", "", ""],
    ["item-2012", "source-2012", "1", "nominee", "関根くんの恋", "河内遙", "", "", "", "", ""],
  ]);
  writeRows(root, "data/staging/catalog-expansion/candidates.csv", [
    [
      WINNER_CANDIDATE,
      "関根くんの恋",
      "",
      "河内遙",
      "2010",
      "unknown",
      "unknown",
      "unknown",
      "winner",
    ],
    [LOSER_CANDIDATE, "関根くんの恋", "", "河内遥", "", "unknown", "unknown", "unknown", "loser"],
  ]);
  writeRows(root, "data/staging/catalog-expansion/source-membership.csv", [
    ["item-2011", "source-2011", "included", LOSER_CANDIDATE, LOSER_WORK, "mapping-2011"],
    ["item-2012", "source-2012", "included", WINNER_CANDIDATE, WINNER_WORK, "mapping-2012"],
  ]);
  const mappingRow = (year: string, candidate: string, work: string, isbn: string) => [
    `mapping-${year}`,
    `item-${year}`,
    candidate,
    work,
    "included",
    "関根くんの恋",
    "1",
    `${year} evidence`,
    `https://example.com/${year}`,
    year,
    "2026-08-22",
    `isbn=${isbn}`,
  ];
  writeRows(root, "data/staging/catalog-expansion/canonical-mapping.csv", [
    mappingRow("2011", LOSER_CANDIDATE, LOSER_WORK, "9784778321840"),
    mappingRow("2012", WINNER_CANDIDATE, WINNER_WORK, "9784778321079"),
  ]);
  writeRows(root, "data/staging/catalog-expansion/exclusions.csv");
  writeRows(root, "data/staging/catalog-expansion/safety-review.csv", [
    [
      WINNER_CANDIDATE,
      "safe",
      "2012 evidence",
      "https://example.com/2012",
      "2012",
      "2026-08-22",
      "2026-08-22",
      "safe",
    ],
    [
      LOSER_CANDIDATE,
      "safe",
      "2011 evidence",
      "https://example.com/2011",
      "2011",
      "2026-08-22",
      "2026-08-22",
      "safe",
    ],
  ]);
  writeRows(root, "data/staging/catalog-expansion/rakuten-matches.csv", [
    [
      "rakuten-match-3080de07cac432363d5b",
      WINNER_CANDIDATE,
      "matched",
      "9784778321079",
      "関根くんの恋（1）",
      "standard",
      "true",
      "https://example.com/winner",
      "2026-08-22",
      "winner",
    ],
    [
      "rakuten-match-e90e43b0be3c3ccee556",
      LOSER_CANDIDATE,
      "matched",
      "9784778321840",
      "関根くんの恋（4）",
      "standard",
      "true",
      "https://example.com/loser",
      "2026-08-22",
      "loser",
    ],
  ]);
  const annotationRow = (candidate: string, work: string, note: string) => [
    candidate,
    work,
    "complete",
    "complete",
    "complete",
    "complete",
    "complete",
    "unreviewed",
    "",
    "2026-08-22",
    note,
  ];
  writeRows(root, "data/staging/catalog-expansion/annotation-status.csv", [
    annotationRow(WINNER_CANDIDATE, WINNER_WORK, "winner"),
    annotationRow(LOSER_CANDIDATE, LOSER_WORK, "loser"),
  ]);
  writeRows(root, "data/staging/catalog-expansion/representative-volume-decisions.csv");
}

function configureAlternatePair(root: string, pair: (typeof ALTERNATE_PAIRS)[number]) {
  const winnerCandidate = `candidate-${pair.winnerWorkId.slice("work-".length)}`;
  const loserCandidate = `candidate-${pair.loserWorkId.slice("work-".length)}`;
  const replacements = [
    [WINNER_WORK, pair.winnerWorkId],
    [LOSER_WORK, pair.loserWorkId],
    [WINNER_CANDIDATE, winnerCandidate],
    [LOSER_CANDIDATE, loserCandidate],
    ["rakuten-match-3080de07cac432363d5b", `rakuten-match-${pair.winnerWorkId.slice(5)}`],
    ["rakuten-match-e90e43b0be3c3ccee556", `rakuten-match-${pair.loserWorkId.slice(5)}`],
  ] as const;
  for (const path of CHANGED_FILES) {
    let content = readFileSync(join(root, path), "utf8");
    for (const [from, to] of replacements) content = content.replaceAll(from, to);
    writeFileSync(join(root, path), content, "utf8");
  }
  for (const [path, idField, titleField] of [
    ["data/source/works.csv", "id", "title"],
    ["data/staging/catalog-expansion/candidates.csv", "candidateId", "canonicalTitleJa"],
    ["data/staging/catalog-expansion/canonical-mapping.csv", "workId", "canonicalTitleJa"],
  ] as const) {
    const rows = records(root, path);
    for (const row of rows) {
      if (row[idField] === pair.winnerWorkId || row[idField] === winnerCandidate) {
        row[titleField] = pair.winnerTitle;
      }
      if (row[idField] === pair.loserWorkId || row[idField] === loserCandidate) {
        row[titleField] = pair.loserTitle;
      }
    }
    const headers = HEADERS[path]?.split(",");
    if (headers === undefined) throw new Error(`Missing fixture header: ${path}`);
    writeRows(
      root,
      path,
      rows.map((row) => headers.map((header) => row[header] ?? "")),
    );
  }
}

it("keeps dry-run read-only and merges duplicate provenance only on apply", () => {
  const root = mkdtempSync(join(tmpdir(), "konocomics-canonical-repair-"));
  try {
    createFixture(root);
    const before = new Map(
      CHANGED_FILES.map((path) => [path, readFileSync(join(root, path), "utf8")]),
    );
    const dryRun = repairCatalogExpansionCanonical("dry-run", root);
    expect(dryRun).toMatchObject({
      mode: "dry-run",
      alreadyApplied: false,
      removedRows: 24,
      rewrittenRows: 2,
    });
    expect(dryRun.changedFiles).toHaveLength(10);
    for (const [path, content] of before)
      expect(readFileSync(join(root, path), "utf8")).toBe(content);

    expect(repairCatalogExpansionCanonical("apply", root)).toMatchObject({
      mode: "apply",
      alreadyApplied: false,
    });
    expect(records(root, "data/source/works.csv").map((row) => row.id)).toEqual([WINNER_WORK]);
    expect(records(root, "data/source/factors.csv")).toHaveLength(17);
    expect(records(root, "data/source/volumes.csv")).toHaveLength(1);
    expect(records(root, "data/source/evidence/evidence.csv")).toHaveLength(1);
    expect(
      records(root, "data/staging/catalog-expansion/source-membership.csv").map((row) => [
        row.candidateId,
        row.workId,
      ]),
    ).toEqual([
      [WINNER_CANDIDATE, WINNER_WORK],
      [WINNER_CANDIDATE, WINNER_WORK],
    ]);
    expect(
      records(root, "data/staging/catalog-expansion/canonical-mapping.csv").map(
        (row) => row.mappingId,
      ),
    ).toEqual(["mapping-2011", "mapping-2012"]);
    expect(repairCatalogExpansionCanonical("dry-run", root)).toMatchObject({
      alreadyApplied: true,
      changedFiles: [],
    });

    for (const pair of ALTERNATE_PAIRS) {
      const alternateRoot = mkdtempSync(join(tmpdir(), "konocomics-canonical-repair-"));
      try {
        createFixture(alternateRoot);
        configureAlternatePair(alternateRoot, pair);
        expect(repairCatalogExpansionCanonical("dry-run", alternateRoot)).toMatchObject({
          pairCount: 1,
          removedRows: 24,
          rewrittenRows: 2,
        });
        repairCatalogExpansionCanonical("apply", alternateRoot);
        expect(
          records(alternateRoot, "data/staging/catalog-expansion/canonical-mapping.csv").find(
            (row) => row.mappingId === "mapping-2011",
          ),
        ).toMatchObject({
          candidateId: `candidate-${pair.winnerWorkId.slice("work-".length)}`,
          workId: pair.winnerWorkId,
          canonicalTitleJa: pair.winnerTitle,
        });
      } finally {
        rmSync(alternateRoot, { recursive: true, force: true });
      }
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
