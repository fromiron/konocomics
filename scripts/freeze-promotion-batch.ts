import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  BATCH_LEDGER_HEADERS,
  buildPromotionRegistry,
  loadPromotionRegistryInput,
  serializePromotionRegistry,
  validatePromotionRegistry,
  type BatchLedgerRow,
  type PromotionRegistryRow,
} from "./build-promotion-registry";
import type { WorkSourceRow } from "./catalog/types";
import { publishDirectorySet } from "./promote-g2-catalog";
import { assertPilotPublishSnapshot, getPilotPublishDigests } from "./promote-pilot-001";

export const PROMOTION_BATCH_SIZE = 50;
export const PROMOTION_METHOD_POLICY = "promotion-evidence-v3";
export const PROMOTION_PANEL_POLICY =
  "official+community-bounded;art-optional-peer;muse-conditional";

const FROZEN_HEADERS = ["position", "workId", "canonicalTitle"] as const;

export type PromotionBatchWork = Pick<
  WorkSourceRow,
  "id" | "title" | "firstPublishedYear" | "demographic" | "genres"
>;

export type FrozenPromotionBatch = {
  selectedWorkIds: readonly string[];
  eligibleCount: number;
  frozenWorkSetCsv: string;
  selectionReport: string;
  batchLedgerRows: readonly BatchLedgerRow[];
  batchLedgerCsv: string;
};

function codeUnitCompare(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function csvCell(value: string | number) {
  const text = String(value);
  return /[",\r\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function serializeCsv(headers: readonly string[], rows: readonly (readonly (string | number)[])[]) {
  return `${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function evidenceTier(sourceCount: number) {
  return sourceCount >= 4 ? "rich" : sourceCount >= 2 ? "multi" : "single";
}

function evidenceTierRank(sourceCount: number) {
  return sourceCount >= 4 ? 0 : sourceCount >= 2 ? 1 : 2;
}

function sourceTypeCount(sourceTypes: string) {
  return new Set(sourceTypes.split(";").filter((value) => value !== "")).size;
}

function era(year: number | undefined) {
  return year === undefined ? "unknown" : `${Math.floor(year / 10) * 10}s`;
}

function markdownCell(value: string | number) {
  return String(value).replaceAll("\\", "\\\\").replaceAll("|", "\\|").replace(/\r?\n/gu, " ");
}

function assertBatchId(batchId: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(batchId)) {
    throw new Error(`Invalid promotion batch ID: ${batchId}`);
  }
}

function assertIsoDate(date: string) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/u.test(date) ||
    new Date(`${date}T00:00:00.000Z`).toISOString().slice(0, 10) !== date
  ) {
    throw new Error(`Invalid promotion freeze date: ${date}`);
  }
}

function selectionReason(work: PromotionBatchWork, sourceCount: number) {
  const genre = work.genres[0] ?? "unknown";
  const reason = `era-${era(work.firstPublishedYear)};audience-${work.demographic};genre-${genre};ev-${evidenceTier(sourceCount)}`;
  if (
    !/^era-[a-z0-9-]+;audience-[a-z0-9-]+;genre-[a-z0-9-]+;ev-(?:rich|multi|single)$/u.test(reason)
  ) {
    throw new Error(`Invalid promotion selection labels: ${work.id}`);
  }
  return reason;
}

export function freezePromotionBatch(options: {
  batchId: string;
  freezeDate: string;
  registryRows: readonly PromotionRegistryRow[];
  works: readonly PromotionBatchWork[];
  allowPlannedBatch?: string;
}): FrozenPromotionBatch {
  assertBatchId(options.batchId);
  assertIsoDate(options.freezeDate);
  const workById = new Map<string, PromotionBatchWork>();
  for (const work of options.works) {
    if (workById.has(work.id)) throw new Error(`Duplicate source work metadata: ${work.id}`);
    if (/[『』]/u.test(work.title))
      throw new Error(`Canonical title contains delimiters: ${work.id}`);
    workById.set(work.id, work);
  }
  for (const row of options.registryRows) {
    if (/[『』]/u.test(row.canonicalTitle)) {
      throw new Error(`Canonical title contains delimiters: ${row.workId}`);
    }
  }

  const eligible = options.registryRows.filter(
    (row) =>
      row.currentStatus === "libraryOnly" &&
      row.targetStatus === "recommendationVerified" &&
      row.promotionOutcome === "pending" &&
      row.safetyStatus === "safe" &&
      row.canonicalStatus === "verified" &&
      row.representativeIsbnStatus === "verified" &&
      row.blockerCode === "" &&
      row.blockerDetails === "" &&
      row.sourceCount > 0 &&
      row.sourceTypes !== "" &&
      (row.plannedBatch === "" || row.plannedBatch === options.allowPlannedBatch),
  );
  if (eligible.length === 0) throw new Error("Promotion batch requires at least one eligible work");

  const preferred = [...eligible]
    .sort(
      (left, right) =>
        evidenceTierRank(left.sourceCount) - evidenceTierRank(right.sourceCount) ||
        sourceTypeCount(right.sourceTypes) - sourceTypeCount(left.sourceTypes) ||
        right.sourceCount - left.sourceCount ||
        codeUnitCompare(left.workId, right.workId),
    )
    .slice(0, PROMOTION_BATCH_SIZE)
    .sort((left, right) => codeUnitCompare(left.workId, right.workId));
  const selected = preferred.map((row, index) => {
    const work = workById.get(row.workId);
    if (work === undefined || work.title !== row.canonicalTitle) {
      throw new Error(`Registry/source identity mismatch: ${row.workId}`);
    }
    return { position: index + 1, row, work };
  });

  const batchLedgerRows = selected.map(({ row, work }): BatchLedgerRow => ({
    workId: row.workId,
    batchId: options.batchId,
    batchType: "batch",
    status: "frozen",
    selectionReason: selectionReason(work, row.sourceCount),
    methodPolicy: PROMOTION_METHOD_POLICY,
    panelPolicy: PROMOTION_PANEL_POLICY,
    lastUpdatedAt: options.freezeDate,
  }));
  const frozenWorkSetCsv = serializeCsv(FROZEN_HEADERS, [
    ...selected.map(({ position, row }) => [position, row.workId, row.canonicalTitle] as const),
  ]);
  const batchLedgerCsv = serializeCsv(
    BATCH_LEDGER_HEADERS,
    batchLedgerRows.map((row) => BATCH_LEDGER_HEADERS.map((header) => row[header])),
  );
  const tierCounts = Object.fromEntries(
    ["rich", "multi", "single"].map((tier) => [
      tier,
      selected.filter(({ row }) => evidenceTier(row.sourceCount) === tier).length,
    ]),
  );
  const table = selected.map(({ row, work }) =>
    [
      row.workId,
      row.canonicalTitle,
      row.sourceCount,
      row.sourceTypes,
      era(work.firstPublishedYear),
      work.demographic,
      work.genres[0] ?? "unknown",
    ]
      .map(markdownCell)
      .join(" | "),
  );
  const selectionReport = `# ${options.batchId} selection

Frozen on ${options.freezeDate} under \`${PROMOTION_METHOD_POLICY}\`. Selection only: no Factor, Theme, Evidence, safety, identity, or source-catalog value is created here.

## Selection rule

The eligible pool contains ${eligible.length} unplanned library-only pending works with safe scope, verified canonical identity, verified representative ISBN, provenance, and no hard blocker. Preference is evidence tier (rich, multi, single), then distinct source types descending, source count descending, and code-unit \`workId\`. The selected set is frozen in code-unit \`workId\` order.

- ev-rich: ${tierCounts.rich}
- ev-multi: ${tierCounts.multi}
- ev-single: ${tierCounts.single}
- method policy: \`${PROMOTION_METHOD_POLICY}\`
- panel policy: \`${PROMOTION_PANEL_POLICY}\`

## Frozen work set

| workId | Canonical title | Source count | Source types | Era | Audience | Genre |
| --- | --- | ---: | --- | --- | --- | --- |
${table.map((row) => `| ${row} |`).join("\n")}

Era, audience, and Genre are selection labels only. Missing Genre remains unknown and is not converted into a Factor or Theme annotation.
`;

  return {
    selectedWorkIds: selected.map(({ row }) => row.workId),
    eligibleCount: eligible.length,
    frozenWorkSetCsv,
    selectionReport,
    batchLedgerRows,
    batchLedgerCsv,
  };
}

function serializeBatchLedger(rows: readonly BatchLedgerRow[]) {
  return serializeCsv(
    BATCH_LEDGER_HEADERS,
    rows.map((row) => BATCH_LEDGER_HEADERS.map((header) => row[header])),
  );
}

function currentBatch(options: {
  root: string;
  batchId: string;
  freezeDate: string;
  allowExisting: boolean;
}) {
  const input = loadPromotionRegistryInput(options.root);
  const registryRows = buildPromotionRegistry(input);
  validatePromotionRegistry(
    registryRows,
    input.source.works.map((row) => row.value.id),
  );
  const existingRows = input.batches.filter((row) => row.batchId === options.batchId);
  if (
    options.allowExisting
      ? existingRows.length === 0 || existingRows.length > PROMOTION_BATCH_SIZE
      : existingRows.length > 0
  ) {
    throw new Error(
      options.allowExisting
        ? `Existing ${options.batchId} ledger must contain 1-${PROMOTION_BATCH_SIZE} rows`
        : `Promotion batch already exists in the ledger: ${options.batchId}`,
    );
  }
  const artifacts = freezePromotionBatch({
    batchId: options.batchId,
    freezeDate: options.freezeDate,
    registryRows,
    works: input.source.works.map((row) => row.value),
    allowPlannedBatch: options.allowExisting ? options.batchId : undefined,
  });
  return { input, registryRows, existingRows, artifacts };
}

export function runPromotionBatchFreezer(
  mode: "check" | "write",
  options: { batchId: string; freezeDate: string; root?: string },
) {
  const root = resolve(options.root ?? process.cwd());
  const staging = join(root, "data/staging/catalog-expansion");
  const batch = join(staging, "batches", options.batchId);
  const initialSnapshot = getPilotPublishDigests(root);
  const state = currentBatch({
    root,
    batchId: options.batchId,
    freezeDate: options.freezeDate,
    allowExisting: mode === "check",
  });

  if (mode === "check") {
    const expectedLedger = serializeBatchLedger(state.existingRows);
    if (
      !existsSync(batch) ||
      readFileSync(join(batch, "frozen-work-set.csv"), "utf8") !==
        state.artifacts.frozenWorkSetCsv ||
      readFileSync(join(batch, "selection-report.md"), "utf8") !==
        state.artifacts.selectionReport ||
      expectedLedger !== state.artifacts.batchLedgerCsv ||
      readFileSync(join(staging, "promotion-registry.csv"), "utf8") !==
        serializePromotionRegistry(state.registryRows)
    ) {
      throw new Error(`Promotion batch is missing or stale: ${options.batchId}`);
    }
    return {
      batchId: options.batchId,
      eligibleCount: state.artifacts.eligibleCount,
      selectedCount: state.artifacts.selectedWorkIds.length,
    };
  }

  if (existsSync(batch))
    throw new Error(`Promotion batch directory already exists: ${options.batchId}`);
  const nextBatches = [...state.input.batches, ...state.artifacts.batchLedgerRows];
  const nextRegistry = buildPromotionRegistry({ ...state.input, batches: nextBatches });
  validatePromotionRegistry(
    nextRegistry,
    state.input.source.works.map((row) => row.value.id),
  );
  const temporaryRoot = mkdtempSync(join(root, ".promotion-freeze-"));
  const candidate = join(temporaryRoot, "catalog-expansion");
  const backup = join(temporaryRoot, "backup");
  try {
    cpSync(staging, candidate, { recursive: true });
    const candidateBatch = join(candidate, "batches", options.batchId);
    mkdirSync(candidateBatch, { recursive: false });
    writeFileSync(
      join(candidateBatch, "frozen-work-set.csv"),
      state.artifacts.frozenWorkSetCsv,
      "utf8",
    );
    writeFileSync(
      join(candidateBatch, "selection-report.md"),
      state.artifacts.selectionReport,
      "utf8",
    );
    writeFileSync(join(candidate, "batch-ledger.csv"), serializeBatchLedger(nextBatches), "utf8");
    writeFileSync(
      join(candidate, "promotion-registry.csv"),
      serializePromotionRegistry(nextRegistry),
      "utf8",
    );
    assertPilotPublishSnapshot(
      getPilotPublishDigests(root),
      initialSnapshot,
      "Promotion freezer inputs changed before publish",
    );
    publishDirectorySet([{ candidate, output: staging, backup }]);
    return {
      batchId: options.batchId,
      eligibleCount: state.artifacts.eligibleCount,
      selectedCount: state.artifacts.selectedWorkIds.length,
    };
  } finally {
    if (!existsSync(backup)) rmSync(temporaryRoot, { recursive: true, force: true });
    else console.warn(`Preserved promotion freezer backup under ${backup}`);
  }
}

function readOption(args: readonly string[], name: string) {
  const index = args.indexOf(name);
  if (index < 0 || args[index + 1] === undefined) throw new Error(`Missing ${name}`);
  return args[index + 1]!;
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  try {
    const args = process.argv.slice(2);
    const mode = args.includes("--check")
      ? "check"
      : args.includes("--write")
        ? "write"
        : undefined;
    if (mode === undefined || (args.includes("--check") && args.includes("--write"))) {
      throw new Error(
        "Usage: tsx scripts/freeze-promotion-batch.ts --check|--write --batch-id batch-003 --date YYYY-MM-DD",
      );
    }
    const result = runPromotionBatchFreezer(mode, {
      batchId: readOption(args, "--batch-id"),
      freezeDate: readOption(args, "--date"),
    });
    console.log(
      `${result.batchId} ${mode}: ${result.selectedCount}/${result.eligibleCount} works frozen.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
