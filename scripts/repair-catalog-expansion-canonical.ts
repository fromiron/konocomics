import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import { runCatalogPipeline } from "./catalog/pipeline";
import {
  CATALOG_DATABASE_FILE,
  catalogSourceSnapshotDigest,
  finalizeCatalogAuthorityProjection,
  sha256,
  writeCatalogCsvProjection,
} from "./catalog/authority";
import { formatSourceIssue, hasErrors } from "./catalog/report";
import { runPromotionRegistry } from "./build-promotion-registry";
import { publishDirectorySet } from "./promote-g2-catalog";
import { loadCatalogExpansion, validateCatalogExpansion } from "./validate-catalog-expansion";

type CanonicalRepair = {
  winnerWorkId: string;
  winnerTitle: string;
  loserWorkId: string;
  loserTitle: string;
};

const REPAIRS: readonly CanonicalRepair[] = [
  {
    winnerWorkId: "work-3080de07cac432363d5b",
    winnerTitle: "関根くんの恋",
    loserWorkId: "work-e90e43b0be3c3ccee556",
    loserTitle: "関根くんの恋",
  },
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
];

const SOURCE_DIRECTORY = "data/source";
const STAGING_DIRECTORY = "data/staging/catalog-expansion";
const BASE_CHANGED_FILES = [
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
const PROMOTION_REGISTRY_FILE = "data/staging/catalog-expansion/promotion-registry.csv";

type RepairMode = "dry-run" | "apply";
type CsvTable = { headers: string[]; rows: string[][] };

const matrixSchema = z.array(z.array(z.string()));

function candidateId(workId: string) {
  return `candidate-${workId.slice("work-".length)}`;
}

function evidenceId(workId: string) {
  return `ev-rakuten-library-${workId}`;
}

function rakutenMatchId(workId: string) {
  return `rakuten-match-${workId.slice("work-".length)}`;
}

function loserTokens(repair: CanonicalRepair) {
  return [
    repair.loserWorkId,
    candidateId(repair.loserWorkId),
    evidenceId(repair.loserWorkId),
    rakutenMatchId(repair.loserWorkId),
  ];
}

function readCsv(path: string): CsvTable {
  const [headers, ...rows] = matrixSchema.parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      relax_column_count: false,
      skip_empty_lines: true,
    }),
  );
  if (headers === undefined || rows.some((row) => row.length !== headers.length)) {
    throw new Error(`Invalid CSV shape: ${path}`);
  }
  return { headers, rows };
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function writeCsv(path: string, table: CsvTable) {
  const matrix = [table.headers, ...table.rows];
  writeFileSync(path, `${matrix.map((row) => row.map(csvCell).join(",")).join("\n")}\n`, "utf8");
}

function column(table: CsvTable, name: string, path: string) {
  const index = table.headers.indexOf(name);
  if (index === -1) throw new Error(`Missing ${name} column: ${path}`);
  return index;
}

function matchingRows(table: CsvTable, path: string, field: string, value: string) {
  const index = column(table, field, path);
  return table.rows.filter((row) => row[index] === value);
}

function requireRows(
  table: CsvTable,
  path: string,
  field: string,
  value: string,
  expected: number,
) {
  const rows = matchingRows(table, path, field, value);
  if (rows.length !== expected) {
    throw new Error(`${path} expected ${expected} ${field}=${value} rows, found ${rows.length}`);
  }
  return rows;
}

function removeRows(table: CsvTable, path: string, field: string, value: string, expected: number) {
  requireRows(table, path, field, value, expected);
  const index = column(table, field, path);
  table.rows = table.rows.filter((row) => row[index] !== value);
  return expected;
}

function rewriteIdentity(
  table: CsvTable,
  path: string,
  repair: CanonicalRepair,
  titleField?: string,
) {
  const candidateIndex = column(table, "candidateId", path);
  const workIndex = column(table, "workId", path);
  const loserCandidateId = candidateId(repair.loserWorkId);
  const rows = table.rows.filter(
    (row) => row[candidateIndex] === loserCandidateId || row[workIndex] === repair.loserWorkId,
  );
  if (
    rows.length !== 1 ||
    rows[0]?.[candidateIndex] !== loserCandidateId ||
    rows[0]?.[workIndex] !== repair.loserWorkId
  ) {
    throw new Error(`${path} does not contain exactly one intact loser identity`);
  }
  rows[0][candidateIndex] = candidateId(repair.winnerWorkId);
  rows[0][workIndex] = repair.winnerWorkId;
  if (titleField !== undefined) rows[0][column(table, titleField, path)] = repair.winnerTitle;
}

function csvFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return csvFiles(path);
      return entry.isFile() && entry.name.endsWith(".csv") ? [path] : [];
    });
}

function loserReferences(root: string, repairs: readonly CanonicalRepair[] = REPAIRS) {
  const tokens = repairs.flatMap(loserTokens);
  return [SOURCE_DIRECTORY, STAGING_DIRECTORY].flatMap((directory) =>
    csvFiles(join(root, directory)).flatMap((path) => {
      const content = readFileSync(path, "utf8");
      const found = tokens.filter((token) => content.includes(token));
      return found.length === 0 ? [] : [`${relative(root, path)}: ${found.join(", ")}`];
    }),
  );
}

function validateRepair(root: string) {
  const references = loserReferences(root);
  if (references.length > 0) {
    throw new Error(`Loser references remain:\n${references.join("\n")}`);
  }
  const sourceResult = runCatalogPipeline(join(root, SOURCE_DIRECTORY));
  if (hasErrors(sourceResult.issues)) {
    throw new Error(
      `Repaired source catalog is invalid:\n${sourceResult.issues
        .filter((issue) => issue.severity === "error")
        .map(formatSourceIssue)
        .join("\n")}`,
    );
  }
  validateCatalogExpansion(loadCatalogExpansion(join(root, STAGING_DIRECTORY)));
  if (existsSync(join(root, PROMOTION_REGISTRY_FILE))) runPromotionRegistry("check", root, "csv");
}

function prepareRepair(root: string, repairs: readonly CanonicalRepair[]) {
  const workPath = join(root, "data/source/works.csv");
  const works = readCsv(workPath);
  const workTitle = column(works, "title", workPath);
  const candidatePath = join(root, "data/staging/catalog-expansion/candidates.csv");
  const candidates = readCsv(candidatePath);
  const candidateTitle = column(candidates, "canonicalTitleJa", candidatePath);
  const factorPath = join(root, "data/source/factors.csv");
  const factors = readCsv(factorPath);
  const axis = column(factors, "axisId", factorPath);
  const state = column(factors, "state", factorPath);
  const factorEvidence = column(factors, "evidenceId", factorPath);
  const volumePath = join(root, "data/source/volumes.csv");
  const volumes = readCsv(volumePath);
  const evidencePath = join(root, "data/source/evidence/evidence.csv");
  const evidenceRows = readCsv(evidencePath);
  const evidenceWork = column(evidenceRows, "workId", evidencePath);
  const membershipPath = join(root, "data/staging/catalog-expansion/source-membership.csv");
  const memberships = readCsv(membershipPath);
  const mappingPath = join(root, "data/staging/catalog-expansion/canonical-mapping.csv");
  const mappings = readCsv(mappingPath);
  const deletionTables = [
    ["data/staging/catalog-expansion/safety-review.csv", "candidateId"],
    ["data/staging/catalog-expansion/rakuten-matches.csv", "candidateId"],
    ["data/staging/catalog-expansion/annotation-status.csv", "candidateId"],
  ] as const;
  const tables = new Map<string, CsvTable>([
    [workPath, works],
    [volumePath, volumes],
    [factorPath, factors],
    [evidencePath, evidenceRows],
    [candidatePath, candidates],
    [membershipPath, memberships],
    [mappingPath, mappings],
  ]);
  for (const [relativePath] of deletionTables) {
    const path = join(root, relativePath);
    tables.set(path, readCsv(path));
  }
  const promotionPath = join(root, PROMOTION_REGISTRY_FILE);
  const promotion = existsSync(promotionPath) ? readCsv(promotionPath) : undefined;
  if (promotion !== undefined) tables.set(promotionPath, promotion);

  let removedRows = 0;
  for (const repair of repairs) {
    const winnerCandidateId = candidateId(repair.winnerWorkId);
    const loserCandidateId = candidateId(repair.loserWorkId);
    const loserEvidenceId = evidenceId(repair.loserWorkId);
    const winnerWork = requireRows(works, workPath, "id", repair.winnerWorkId, 1)[0];
    const loserWork = requireRows(works, workPath, "id", repair.loserWorkId, 1)[0];
    if (
      winnerWork?.[workTitle] !== repair.winnerTitle ||
      loserWork?.[workTitle] !== repair.loserTitle
    ) {
      throw new Error("Confirmed work identities no longer have the expected titles");
    }
    const winnerCandidate = requireRows(
      candidates,
      candidatePath,
      "candidateId",
      winnerCandidateId,
      1,
    )[0];
    const loserCandidate = requireRows(
      candidates,
      candidatePath,
      "candidateId",
      loserCandidateId,
      1,
    )[0];
    if (
      winnerCandidate?.[candidateTitle] !== repair.winnerTitle ||
      loserCandidate?.[candidateTitle] !== repair.loserTitle
    ) {
      throw new Error("Confirmed candidate identities no longer have the expected titles");
    }

    const winnerFactors = requireRows(factors, factorPath, "workId", repair.winnerWorkId, 17);
    const loserFactors = requireRows(factors, factorPath, "workId", repair.loserWorkId, 17);
    if (
      winnerFactors
        .map((row) => row[axis])
        .sort()
        .join("\u0000") !==
        loserFactors
          .map((row) => row[axis])
          .sort()
          .join("\u0000") ||
      loserFactors.some(
        (row) => row[state] !== "unknown" || row[factorEvidence] !== loserEvidenceId,
      )
    ) {
      throw new Error("Loser factors are not the expected duplicate unknown-axis set");
    }
    requireRows(volumes, volumePath, "workId", repair.winnerWorkId, 1);
    requireRows(volumes, volumePath, "workId", repair.loserWorkId, 1);
    const loserEvidence = requireRows(evidenceRows, evidencePath, "id", loserEvidenceId, 1)[0];
    if (loserEvidence?.[evidenceWork] !== repair.loserWorkId) {
      throw new Error("Loser evidence no longer belongs to the loser work");
    }

    removedRows += removeRows(works, workPath, "id", repair.loserWorkId, 1);
    removedRows += removeRows(volumes, volumePath, "workId", repair.loserWorkId, 1);
    removedRows += removeRows(factors, factorPath, "workId", repair.loserWorkId, 17);
    removedRows += removeRows(evidenceRows, evidencePath, "id", loserEvidenceId, 1);
    removedRows += removeRows(candidates, candidatePath, "candidateId", loserCandidateId, 1);
    rewriteIdentity(memberships, membershipPath, repair);
    rewriteIdentity(mappings, mappingPath, repair, "canonicalTitleJa");
    for (const [relativePath, field] of deletionTables) {
      const path = join(root, relativePath);
      removedRows += removeRows(tables.get(path)!, path, field, loserCandidateId, 1);
    }

    if (promotion !== undefined) {
      const promotionTitle = column(promotion, "canonicalTitle", promotionPath);
      const sourceCount = column(promotion, "sourceCount", promotionPath);
      const winnerPromotion = requireRows(
        promotion,
        promotionPath,
        "workId",
        repair.winnerWorkId,
        1,
      )[0];
      const loserPromotion = requireRows(
        promotion,
        promotionPath,
        "workId",
        repair.loserWorkId,
        1,
      )[0];
      if (
        winnerPromotion?.[promotionTitle] !== repair.winnerTitle ||
        loserPromotion?.[promotionTitle] !== repair.loserTitle
      ) {
        throw new Error("Promotion registry identities no longer have the expected titles");
      }
      removedRows += removeRows(promotion, promotionPath, "workId", repair.loserWorkId, 1);
      winnerPromotion[promotionTitle] = repair.winnerTitle;
      const membershipWork = column(memberships, "workId", membershipPath);
      const membershipSource = column(memberships, "sourceId", membershipPath);
      winnerPromotion[sourceCount] = String(
        new Set(
          memberships.rows
            .filter((row) => row[membershipWork] === repair.winnerWorkId)
            .map((row) => row[membershipSource]),
        ).size,
      );
    }
  }

  for (const [path, table] of tables) writeCsv(path, table);
  return { removedRows, rewrittenRows: repairs.length * 2 };
}

function repairCatalogExpansionCanonicalFromCsv(
  mode: RepairMode = "dry-run",
  root = process.cwd(),
) {
  const resolvedRoot = resolve(root);
  if (!existsSync(join(resolvedRoot, SOURCE_DIRECTORY))) {
    throw new Error(`Catalog source directory does not exist: ${resolvedRoot}`);
  }
  const pendingRepairs = REPAIRS.filter(
    (repair) => loserReferences(resolvedRoot, [repair]).length > 0,
  );
  if (pendingRepairs.length === 0) {
    validateRepair(resolvedRoot);
    return {
      mode,
      alreadyApplied: true,
      changedFiles: [] as string[],
      pairCount: 0,
      removedRows: 0,
      rewrittenRows: 0,
    };
  }

  const changedFiles = [
    ...BASE_CHANGED_FILES,
    ...(existsSync(join(resolvedRoot, PROMOTION_REGISTRY_FILE)) ? [PROMOTION_REGISTRY_FILE] : []),
  ];
  const originals = new Map(
    changedFiles.map((path) => [path, readFileSync(join(resolvedRoot, path), "utf8")]),
  );
  const temporaryRoot = mkdtempSync(join(resolvedRoot, ".catalog-canonical-repair-"));
  try {
    cpSync(join(resolvedRoot, SOURCE_DIRECTORY), join(temporaryRoot, SOURCE_DIRECTORY), {
      recursive: true,
    });
    cpSync(join(resolvedRoot, STAGING_DIRECTORY), join(temporaryRoot, STAGING_DIRECTORY), {
      recursive: true,
    });
    const counts = prepareRepair(temporaryRoot, pendingRepairs);
    validateRepair(temporaryRoot);

    if (mode === "apply") {
      for (const path of changedFiles) {
        if (readFileSync(join(resolvedRoot, path), "utf8") !== originals.get(path)) {
          throw new Error(`Concurrent catalog change detected: ${path}`);
        }
      }
      const swaps = changedFiles.map((path) => {
        const backup = join(temporaryRoot, "backups", path);
        mkdirSync(dirname(backup), { recursive: true });
        return {
          candidate: join(temporaryRoot, path),
          output: join(resolvedRoot, path),
          backup,
        };
      });
      publishDirectorySet(swaps);
    }

    return {
      mode,
      alreadyApplied: false,
      changedFiles,
      pairCount: pendingRepairs.length,
      ...counts,
    };
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

export function repairCatalogExpansionCanonical(
  mode: RepairMode = "dry-run",
  root = process.cwd(),
) {
  const resolvedRoot = resolve(root);
  const sourceDirectory = join(resolvedRoot, SOURCE_DIRECTORY);
  if (!existsSync(join(sourceDirectory, CATALOG_DATABASE_FILE))) {
    return repairCatalogExpansionCanonicalFromCsv(mode, resolvedRoot);
  }

  const sourceSnapshot = catalogSourceSnapshotDigest(sourceDirectory);
  const stagingDirectory = join(resolvedRoot, STAGING_DIRECTORY);
  const stagingSnapshot = new Map(
    csvFiles(stagingDirectory).map((path) => [
      relative(stagingDirectory, path),
      sha256(readFileSync(path)),
    ]),
  );
  const temporaryRoot = mkdtempSync(join(resolvedRoot, ".catalog-canonical-authority-"));
  try {
    writeCatalogCsvProjection(sourceDirectory, join(temporaryRoot, SOURCE_DIRECTORY));
    cpSync(stagingDirectory, join(temporaryRoot, STAGING_DIRECTORY), { recursive: true });
    const result = repairCatalogExpansionCanonicalFromCsv(mode, temporaryRoot);
    if (mode === "apply" && !result.alreadyApplied) {
      const candidateSource = join(temporaryRoot, SOURCE_DIRECTORY);
      finalizeCatalogAuthorityProjection(sourceDirectory, candidateSource);
      const currentStaging = new Map(
        csvFiles(stagingDirectory).map((path) => [
          relative(stagingDirectory, path),
          sha256(readFileSync(path)),
        ]),
      );
      if (
        catalogSourceSnapshotDigest(sourceDirectory) !== sourceSnapshot ||
        currentStaging.size !== stagingSnapshot.size ||
        [...stagingSnapshot].some(([path, digest]) => currentStaging.get(path) !== digest)
      ) {
        throw new Error("Concurrent catalog source or staging change detected");
      }
      const stagingFiles = result.changedFiles.filter((path) =>
        path.startsWith(`${STAGING_DIRECTORY}/`),
      );
      const swaps = [
        {
          candidate: candidateSource,
          output: sourceDirectory,
          backup: join(temporaryRoot, "backups", SOURCE_DIRECTORY),
        },
        ...stagingFiles.map((path) => ({
          candidate: join(temporaryRoot, path),
          output: join(resolvedRoot, path),
          backup: join(temporaryRoot, "backups", path),
        })),
      ];
      for (const swap of swaps) mkdirSync(dirname(swap.backup), { recursive: true });
      publishDirectorySet(swaps);
    }
    return {
      ...result,
      changedFiles: result.changedFiles.some((path) => path.startsWith(`${SOURCE_DIRECTORY}/`))
        ? [
            `${SOURCE_DIRECTORY}/${CATALOG_DATABASE_FILE}`,
            ...result.changedFiles.filter((path) => path.startsWith(`${STAGING_DIRECTORY}/`)),
          ]
        : result.changedFiles,
    };
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

function cliMode(args: readonly string[]): RepairMode {
  if (args.length === 0 || (args.length === 1 && args[0] === "--dry-run")) return "dry-run";
  if (args.length === 1 && args[0] === "--apply") return "apply";
  throw new Error("Usage: tsx scripts/repair-catalog-expansion-canonical.ts [--dry-run|--apply]");
}

const invokedPath = process.argv[1];
if (invokedPath !== undefined && import.meta.url === pathToFileURL(resolve(invokedPath)).href) {
  const result = repairCatalogExpansionCanonical(cliMode(process.argv.slice(2)));
  const verb = result.alreadyApplied
    ? "already repaired"
    : result.mode === "apply"
      ? "repaired"
      : "would repair";
  console.log(
    `${verb} ${result.pairCount} canonical pair(s): ${result.changedFiles.length} files, ${result.removedRows} rows removed, ${result.rewrittenRows} rows rewritten.`,
  );
}
