import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { parse } from "csv-parse/sync";
import { z } from "zod";

const SOURCE_ID = "dc-monthly-comics-recommendations-2020";
const SOURCE_URL =
  "https://docs.google.com/spreadsheets/d/1jVNsw1Mh-JKOQmaSnpyastsXGuh2XMVuyhiZH5t6cow/export?format=csv&gid=1013833811";
const SNAPSHOT_SHA256 = "29c5ecd3073b052bc660af14615bf9e114e90ec0033f1576e1ba683a01080735";
const HEADER_ROW_INDEX = 10;
const DATA_START_ROW_NUMBER = 12;
const EXPECTED_ITEM_COUNT = 1_994;
const SOURCE_HEADERS = [
  "구분",
  "제목",
  "작가(그작)",
  "메인장르",
  "서브장르",
  "평가(5단계)",
  "비고",
  "업데이트",
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

function sha256(bytes: Buffer) {
  return createHash("sha256").update(bytes).digest("hex");
}

function csvCell(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function serializeCsv(headers: readonly string[], rows: readonly (readonly string[])[]) {
  return `${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

export function buildDcMonthlyComicsImport(bytes: Buffer) {
  const digest = sha256(bytes);
  if (digest !== SNAPSHOT_SHA256) {
    throw new Error(
      `DC monthly comics snapshot changed: expected ${SNAPSHOT_SHA256}, received ${digest}`,
    );
  }
  const matrix = matrixSchema.parse(
    parse(bytes, { bom: true, relax_column_count: false, skip_empty_lines: false }),
  );
  const headers = matrix[HEADER_ROW_INDEX];
  if (headers === undefined || headers.join("\u0000") !== SOURCE_HEADERS.join("\u0000")) {
    throw new Error("DC monthly comics source header changed");
  }
  const sourceRows = matrix.slice(HEADER_ROW_INDEX + 1);
  if (sourceRows.length !== EXPECTED_ITEM_COUNT) {
    throw new Error(
      `DC monthly comics item count changed: expected ${EXPECTED_ITEM_COUNT}, received ${sourceRows.length}`,
    );
  }

  const rawRows = sourceRows.map((row, index) => {
    if (row.length !== SOURCE_HEADERS.length || row[1]?.trim() === "") {
      throw new Error(`Invalid DC monthly comics source row: ${DATA_START_ROW_NUMBER + index}`);
    }
    const sourceRowNumber = DATA_START_ROW_NUMBER + index;
    const sourceItemId = `${SOURCE_ID}-${sourceRowNumber.toString().padStart(4, "0")}`;
    return [sourceItemId, SOURCE_ID, String(sourceRowNumber), ...row];
  });
  const membershipRows = rawRows.map(([sourceItemId]) => [
    sourceItemId!,
    SOURCE_ID,
    "unresolved",
    "",
    "",
    "",
  ]);
  return {
    rawCsv: serializeCsv(RAW_HEADERS, rawRows),
    membershipCsv: serializeCsv(MEMBERSHIP_HEADERS, membershipRows),
  };
}

export async function runDcMonthlyComicsImport(mode: "--check" | "--write", root = process.cwd()) {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) {
    throw new Error(`DC monthly comics fetch failed: HTTP ${response.status}`);
  }
  const output = buildDcMonthlyComicsImport(Buffer.from(await response.arrayBuffer()));
  const directory = join(root, "data/staging/catalog-expansion");
  const rawPath = join(directory, "raw-source-items.csv");
  const membershipPath = join(directory, "source-membership.csv");
  if (mode === "--check") {
    const committedRows = matrixSchema.parse(
      parse(readFileSync(rawPath), {
        bom: true,
        relax_column_count: false,
        skip_empty_lines: true,
      }),
    );
    const expectedRows = matrixSchema.parse(
      parse(output.rawCsv, { bom: true, relax_column_count: false, skip_empty_lines: true }),
    );
    const committedSourceRows = committedRows.slice(1).filter((row) => row[1] === SOURCE_ID);
    if (JSON.stringify(committedSourceRows) !== JSON.stringify(expectedRows.slice(1))) {
      throw new Error("Committed raw-source-items.csv does not match the frozen DC snapshot");
    }
    return;
  }
  const currentMembership = readFileSync(membershipPath, "utf8");
  if (currentMembership !== `${MEMBERSHIP_HEADERS.join(",")}\n`) {
    throw new Error("Refusing to overwrite existing source membership decisions");
  }
  writeFileSync(rawPath, output.rawCsv, "utf8");
  writeFileSync(membershipPath, output.membershipCsv, "utf8");
}

const invokedPath =
  process.argv[1] === undefined ? undefined : pathToFileURL(resolve(process.argv[1])).href;
if (invokedPath === import.meta.url) {
  const mode = process.argv[2];
  if (mode !== "--check" && mode !== "--write") {
    console.error("Usage: tsx scripts/import-dc-monthly-comics-sheet.ts --check|--write");
    process.exitCode = 1;
  } else {
    runDcMonthlyComicsImport(mode)
      .then(() =>
        console.log(`DC monthly comics snapshot ${mode === "--write" ? "imported" : "verified"}.`),
      )
      .catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      });
  }
}
