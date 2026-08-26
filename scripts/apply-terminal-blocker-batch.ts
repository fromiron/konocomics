import { createHash } from "node:crypto";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import {
  buildPromotionRegistry,
  loadPromotionRegistryInput,
  PROMOTION_BLOCKER_HEADERS,
  PROMOTION_HARD_BLOCKERS,
  serializePromotionRegistry,
  validatePromotionRegistry,
  type PromotionBlocker,
} from "./build-promotion-registry";

const terminalRowSchema = z.strictObject({
  position: z.string().regex(/^\d+$/u),
  workId: z.string().min(1),
  canonicalTitle: z.string().min(1),
  blockerCode: z.string().min(1),
  blockerDetails: z
    .string()
    .min(40)
    .refine((value) => /(?:optional Art|Art is optional)/iu.test(value), {
      message: "blockerDetails must state that Art is optional",
    }),
  evidenceName: z.string().min(1),
  evidenceUrl: z.url(),
  evidencePublishedAt: z.string().regex(/^\d{4}(?:-\d{2}-\d{2})?$/u),
  retrievedAt: z.iso.date(),
  recheckPath: z.string().min(20),
  koreanQueries: z.string().regex(/[가-힣]/u),
  japaneseEvidenceUrls: z.string().refine(
    (value) =>
      value
        .split(";")
        .filter(Boolean)
        .every((url) => z.url().safeParse(url).success) && value !== "",
    { message: "japaneseEvidenceUrls must contain semicolon-separated URLs" },
  ),
});

const frozenRowSchema = z.strictObject({
  position: z.string().regex(/^\d+$/u),
  workId: z.string().min(1),
  canonicalTitle: z.string().min(1),
});

function readCsv<T>(path: string, schema: z.ZodType<T>) {
  return z.array(schema).parse(
    parse(readFileSync(path, "utf8"), {
      bom: true,
      columns: true,
      skip_empty_lines: true,
    }) as unknown,
  );
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeBlockers(rows: readonly PromotionBlocker[]) {
  return `${[
    PROMOTION_BLOCKER_HEADERS.join(","),
    ...rows.map((row) => PROMOTION_BLOCKER_HEADERS.map((header) => csvCell(row[header])).join(",")),
  ].join("\n")}\n`;
}

function atomicWrite(path: string, content: string) {
  const temporaryPath = `${path}.tmp`;
  writeFileSync(temporaryPath, content, "utf8");
  renameSync(temporaryPath, path);
}

export function runTerminalBlockerBatch(
  batchId: string,
  mode: "check" | "write",
  root = process.cwd(),
) {
  if (!/^batch-\d{3}$/u.test(batchId)) throw new Error("Batch ID must match batch-NNN");
  const canonicalRoot = resolve(root);
  const batchRoot = join(canonicalRoot, "data/staging/catalog-expansion/batches", batchId);
  const frozenPath = join(batchRoot, "frozen-work-set.csv");
  const evidencePath = join(batchRoot, "terminal-evidence-v3.csv");
  if (!existsSync(frozenPath) || !existsSync(evidencePath)) {
    throw new Error(`${batchId} frozen set or terminal evidence is missing`);
  }

  const frozen = readCsv(frozenPath, frozenRowSchema);
  const terminal = readCsv(evidencePath, terminalRowSchema);
  if (
    terminal.length !== frozen.length ||
    terminal.some(
      (row, index) =>
        row.position !== String(index + 1) ||
        row.position !== frozen[index]?.position ||
        row.workId !== frozen[index]?.workId ||
        row.canonicalTitle !== frozen[index]?.canonicalTitle,
    )
  ) {
    throw new Error(`${batchId} terminal evidence must exactly match the frozen ordered set`);
  }

  const binding = createHash("sha256")
    .update(readFileSync(frozenPath))
    .update(readFileSync(evidencePath))
    .digest("hex");
  const targetIds = new Set(frozen.map((row) => row.workId));
  const input = loadPromotionRegistryInput(canonicalRoot);
  const additions = terminal.flatMap((row): PromotionBlocker[] => {
    const codes = row.blockerCode.split(";");
    if (
      new Set(codes).size !== codes.length ||
      codes.some((code) => !Object.hasOwn(PROMOTION_HARD_BLOCKERS, code))
    ) {
      throw new Error(`${row.workId} has an invalid blocker code`);
    }
    return codes.map((blockerCode) => ({
      workId: row.workId,
      blockerCode: blockerCode as keyof typeof PROMOTION_HARD_BLOCKERS,
      blockerDetails: `${row.blockerDetails} Terminal evidence binding SHA-256=${binding}.`,
      evidenceName: row.evidenceName,
      evidenceUrl: row.evidenceUrl,
      evidencePublishedAt: row.evidencePublishedAt,
      retrievedAt: row.retrievedAt,
      recheckPath: `${row.recheckPath} Korean queries: ${row.koreanQueries}. Japanese evidence: ${row.japaneseEvidenceUrls}.`,
    }));
  });
  const blockers = [
    ...input.blockers.filter((row) => !targetIds.has(row.workId)),
    ...additions,
  ].sort(
    (left, right) =>
      left.workId.localeCompare(right.workId) || left.blockerCode.localeCompare(right.blockerCode),
  );
  const rows = buildPromotionRegistry({ ...input, blockers });
  validatePromotionRegistry(
    rows,
    input.source.works.map((row) => row.value.id),
  );
  const targetRows = rows.filter((row) => targetIds.has(row.workId));
  if (
    targetRows.length !== frozen.length ||
    targetRows.some(
      (row) => row.plannedBatch !== batchId || row.promotionOutcome !== "promotionBlocked",
    )
  ) {
    throw new Error(`${batchId} did not produce an exact terminal blocked registry set`);
  }

  const blockerContent = serializeBlockers(blockers);
  const registryContent = serializePromotionRegistry(rows);
  const blockerPath = join(canonicalRoot, "data/staging/catalog-expansion/promotion-blockers.csv");
  const registryPath = join(canonicalRoot, "data/staging/catalog-expansion/promotion-registry.csv");
  if (mode === "check") {
    if (
      readFileSync(blockerPath, "utf8") !== blockerContent ||
      readFileSync(registryPath, "utf8") !== registryContent
    ) {
      throw new Error(`${batchId} terminal blocker state is stale; run with --write`);
    }
  } else {
    atomicWrite(blockerPath, blockerContent);
    atomicWrite(registryPath, registryContent);
  }
  return {
    batchId,
    blocked: targetRows.length,
    pending: rows.filter((row) => row.promotionOutcome === "pending").length,
    binding,
  };
}

const [modeArgument, batchArgument] = process.argv.slice(2);
if (modeArgument !== undefined) {
  try {
    const mode =
      modeArgument === "--check" ? "check" : modeArgument === "--write" ? "write" : undefined;
    if (mode === undefined || batchArgument === undefined) {
      throw new Error(
        "Usage: tsx scripts/apply-terminal-blocker-batch.ts --check|--write batch-NNN",
      );
    }
    const result = runTerminalBlockerBatch(batchArgument, mode);
    console.log(
      `${result.batchId} terminal blockers ${mode}: blocked ${String(result.blocked)}; global pending ${String(result.pending)}; binding ${result.binding}.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
