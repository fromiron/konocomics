import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { parse } from "csv-parse/sync";

type CsvRow = Record<string, string>;
type FactorOverride = { value?: number; confidence?: number };

const ROOT = "data/staging/catalog-expansion/batches/batch-002";
const CHUNKS = ["01", "02", "05"] as const;

const factorOverrides = new Map<string, FactorOverride>(
  Object.entries({
    "work-017446dd1a9039d9839b/characterArcWeight": { value: 2, confidence: 0.76 },
    "work-017446dd1a9039d9839b/relationshipStructure": { value: 2, confidence: 0.8 },
    "work-017446dd1a9039d9839b/emotionalWarmth": { value: 1, confidence: 0.7 },
    "work-02d5d329c9ef85e481cb/romance": { value: 2, confidence: 0.86 },
    "work-089947c5303024841fef/emotionalWarmth": { value: 2, confidence: 0.84 },
    "work-089947c5303024841fef/mysteryReveal": { value: 4, confidence: 0.88 },
    "work-0e036724913c69bb937a/mysteryReveal": { value: 2, confidence: 0.82 },
    "work-1012948f5de799831da4/pacing": { value: 2, confidence: 0.78 },
    "work-1012948f5de799831da4/characterArcWeight": { value: 3, confidence: 0.82 },
    "work-1012948f5de799831da4/mentalStress": { value: 3, confidence: 0.8 },
    "work-1088a1dc00a3b0d22201/problemSolving": { value: 3, confidence: 0.82 },
    "work-1088a1dc00a3b0d22201/pacing": { value: 4, confidence: 0.92 },
    "work-1088a1dc00a3b0d22201/mysteryReveal": { value: 2, confidence: 0.76 },
    "work-1088a1dc00a3b0d22201/worldBuilding": { value: 2, confidence: 0.82 },
    "work-1088a1dc00a3b0d22201/characterArcWeight": { value: 2, confidence: 0.84 },
    "work-1088a1dc00a3b0d22201/relationshipStructure": { value: 2, confidence: 0.8 },
    "work-1088a1dc00a3b0d22201/darkness": { value: 4, confidence: 0.94 },
    "work-1088a1dc00a3b0d22201/mentalStress": { value: 2, confidence: 0.74 },
    "work-1088a1dc00a3b0d22201/emotionalWarmth": { value: 2, confidence: 0.78 },
    "work-19a26f01512166856a6a/emotionalWarmth": { value: 2, confidence: 0.76 },
    "work-1e27731b880d0d9012f8/characterArcWeight": { value: 2, confidence: 0.76 },
    "work-1e27731b880d0d9012f8/relationshipStructure": { value: 2, confidence: 0.8 },
    "work-1e27731b880d0d9012f8/darkness": { value: 2, confidence: 0.72 },
    "work-1e27731b880d0d9012f8/mentalStress": { value: 2, confidence: 0.72 },
    "work-1e27731b880d0d9012f8/emotionalWarmth": { value: 1, confidence: 0.68 },
    "work-207bb1ca28b7472fbe1d/progression": { value: 3, confidence: 0.88 },
    "work-207bb1ca28b7472fbe1d/problemSolving": { value: 0, confidence: 0.78 },
    "work-207bb1ca28b7472fbe1d/strategy": { value: 0, confidence: 0.76 },
    "work-207bb1ca28b7472fbe1d/mysteryReveal": { value: 0, confidence: 0.76 },
    "work-207bb1ca28b7472fbe1d/worldBuilding": { value: 2, confidence: 0.78 },
    "work-207bb1ca28b7472fbe1d/characterArcWeight": { value: 3, confidence: 0.86 },
    "work-207bb1ca28b7472fbe1d/relationshipStructure": { value: 2, confidence: 0.8 },
    "work-207bb1ca28b7472fbe1d/comedy": { value: 2, confidence: 0.8 },
    "work-207bb1ca28b7472fbe1d/mentalStress": {},
    "work-207bb1ca28b7472fbe1d/emotionalWarmth": { value: 2, confidence: 0.78 },

    "work-29d4300ad9d3358fb67a/relationshipStructure": { value: 2, confidence: 0.8 },
    "work-29d4300ad9d3358fb67a/comedy": { value: 2, confidence: 0.86 },
    "work-3dfaf6231e21133620c6/problemSolving": { value: 0, confidence: 0.78 },
    "work-3dfaf6231e21133620c6/pacing": { value: 3, confidence: 0.84 },
    "work-3dfaf6231e21133620c6/relationshipStructure": { value: 2, confidence: 0.8 },
    "work-3e725951eb9c49771087/comedy": { value: 2, confidence: 0.8 },
    "work-3e725951eb9c49771087/emotionalWarmth": { value: 2, confidence: 0.84 },
    "work-4c784fc78dfd9b139c3f/progression": {},
    "work-4c784fc78dfd9b139c3f/problemSolving": { value: 0, confidence: 0.84 },
    "work-4c784fc78dfd9b139c3f/strategy": { value: 0, confidence: 0.8 },
    "work-4c784fc78dfd9b139c3f/mysteryReveal": { value: 0, confidence: 0.78 },
    "work-4c784fc78dfd9b139c3f/worldBuilding": { value: 0, confidence: 0.8 },
    "work-4c784fc78dfd9b139c3f/relationshipStructure": { value: 2, confidence: 0.86 },
    "work-518d7ed42dd9253679c3/mentalStress": {},
    "work-518d7ed42dd9253679c3/romance": { value: 0, confidence: 0.7 },
    "work-53e54c95f637b66c4fb2/progression": { value: 2, confidence: 0.82 },
    "work-53e54c95f637b66c4fb2/problemSolving": { value: 0, confidence: 0.76 },
    "work-53e54c95f637b66c4fb2/relationshipStructure": { value: 2, confidence: 0.82 },
    "work-5915d6d7601377fcc75f/problemSolving": { value: 2, confidence: 0.8 },
    "work-5b4dc4e6e966436b2990/problemSolving": { value: 0, confidence: 0.78 },
    "work-5b4dc4e6e966436b2990/characterArcWeight": { value: 3, confidence: 0.84 },
    "work-5b4dc4e6e966436b2990/darkness": { value: 2, confidence: 0.77 },
    "work-5b4dc4e6e966436b2990/romance": { value: 2, confidence: 0.84 },
    "work-5b9a3ec60ac5fc90f444/progression": { value: 2, confidence: 0.8 },
    "work-5b9a3ec60ac5fc90f444/pacing": { value: 2, confidence: 0.88 },
    "work-5b9a3ec60ac5fc90f444/mysteryReveal": { value: 2, confidence: 0.85 },
    "work-5b9a3ec60ac5fc90f444/worldBuilding": { value: 3, confidence: 0.91 },
    "work-5b9a3ec60ac5fc90f444/characterArcWeight": { value: 4, confidence: 0.92 },
    "work-5b9a3ec60ac5fc90f444/relationshipStructure": { value: 2, confidence: 0.91 },
    "work-5b9a3ec60ac5fc90f444/darkness": { value: 3, confidence: 0.9 },
    "work-5b9a3ec60ac5fc90f444/mentalStress": { value: 2, confidence: 0.76 },
    "work-5b9a3ec60ac5fc90f444/romance": { value: 3, confidence: 0.9 },
    "work-5b9a3ec60ac5fc90f444/emotionalWarmth": { value: 3, confidence: 0.86 },

    "work-ccf0ddff9c6410c4de14/pacing": { value: 2, confidence: 0.88 },
    "work-ccf0ddff9c6410c4de14/relationshipStructure": { value: 2, confidence: 0.84 },
    "work-ccf0ddff9c6410c4de14/comedy": { value: 4, confidence: 0.96 },
    "work-ccf0ddff9c6410c4de14/emotionalWarmth": { value: 2, confidence: 0.74 },

    "work-cdef8cfd678998a51447/progression": { value: 2, confidence: 0.9 },
    "work-cdef8cfd678998a51447/problemSolving": { value: 1, confidence: 0.72 },
    "work-cdef8cfd678998a51447/pacing": { value: 2, confidence: 0.86 },
    "work-cdef8cfd678998a51447/mysteryReveal": { value: 2, confidence: 0.82 },
    "work-cdef8cfd678998a51447/characterArcWeight": { value: 4, confidence: 0.94 },
    "work-cdef8cfd678998a51447/relationshipStructure": { value: 2, confidence: 0.9 },
    "work-cdef8cfd678998a51447/comedy": { value: 2, confidence: 0.79 },
    "work-cdef8cfd678998a51447/mentalStress": { value: 2, confidence: 0.78 },
    "work-cdef8cfd678998a51447/emotionalWarmth": { value: 4, confidence: 0.93 },

    "work-ced7a8e6d9c3b8147702/progression": { value: 2, confidence: 0.86 },
    "work-ced7a8e6d9c3b8147702/problemSolving": { value: 0, confidence: 0.76 },
    "work-ced7a8e6d9c3b8147702/emotionalWarmth": { value: 2, confidence: 0.84 },

    "work-daf65c6f2cce3e076dfa/progression": { value: 2, confidence: 0.9 },
    "work-daf65c6f2cce3e076dfa/problemSolving": { value: 2, confidence: 0.83 },
    "work-daf65c6f2cce3e076dfa/strategy": { value: 1, confidence: 0.72 },
    "work-daf65c6f2cce3e076dfa/mentalStress": { value: 2, confidence: 0.9 },

    "work-db80d94709b62aa8823f/problemSolving": { value: 2, confidence: 0.88 },
    "work-db80d94709b62aa8823f/pacing": { value: 3, confidence: 0.92 },
    "work-db80d94709b62aa8823f/characterArcWeight": { value: 2, confidence: 0.84 },
    "work-db80d94709b62aa8823f/comedy": { value: 2, confidence: 0.86 },
    "work-db80d94709b62aa8823f/darkness": { value: 3, confidence: 0.92 },
    "work-db80d94709b62aa8823f/mentalStress": { value: 2, confidence: 0.82 },

    "work-ef1bdac46a0956a87f7f/problemSolving": { value: 1, confidence: 0.76 },
    "work-ef1bdac46a0956a87f7f/mysteryReveal": { value: 4, confidence: 0.91 },
    "work-ef1bdac46a0956a87f7f/worldBuilding": { value: 2, confidence: 0.8 },
    "work-ef1bdac46a0956a87f7f/mentalStress": { value: 4, confidence: 0.96 },
    "work-ef1bdac46a0956a87f7f/emotionalWarmth": { value: 1, confidence: 0.86 },

    "work-f5847c45d30753150364/relationshipStructure": { value: 2, confidence: 0.84 },
    "work-f5847c45d30753150364/mentalStress": { value: 4, confidence: 0.93 },

    "work-fabc7f5d853e361acaf3/relationshipStructure": { value: 2, confidence: 0.84 },
    "work-fabc7f5d853e361acaf3/mysteryReveal": { value: 1, confidence: 0.8 },
    "work-fabc7f5d853e361acaf3/comedy": { value: 4, confidence: 0.92 },
    "work-fabc7f5d853e361acaf3/mentalStress": { value: 1, confidence: 0.75 },

    "work-fb7a0ed6a88db7d7bc71/strategy": { value: 2, confidence: 0.76 },
    "work-fb7a0ed6a88db7d7bc71/pacing": { value: 3, confidence: 0.82 },
    "work-fb7a0ed6a88db7d7bc71/mysteryReveal": { value: 2, confidence: 0.74 },
    "work-fb7a0ed6a88db7d7bc71/worldBuilding": { value: 4, confidence: 0.9 },
    "work-fb7a0ed6a88db7d7bc71/characterArcWeight": { value: 4, confidence: 0.88 },
    "work-fb7a0ed6a88db7d7bc71/relationshipStructure": { value: 2, confidence: 0.8 },
    "work-fb7a0ed6a88db7d7bc71/darkness": { value: 3, confidence: 0.85 },
    "work-fb7a0ed6a88db7d7bc71/mentalStress": { value: 3, confidence: 0.81 },
    "work-fb7a0ed6a88db7d7bc71/romance": { value: 4, confidence: 0.91 },
  }),
);

const genreOverrides = new Map([
  ["work-1012948f5de799831da4", "historical"],
  ["work-1088a1dc00a3b0d22201", "action;horror"],
  ["work-1e27731b880d0d9012f8", ""],
  ["work-29d4300ad9d3358fb67a", "mystery"],
  ["work-4c784fc78dfd9b139c3f", "comedy;sliceOfLife;romance"],
  ["work-5b9a3ec60ac5fc90f444", "fantasy;romance"],
  ["work-cdef8cfd678998a51447", "sliceOfLife"],
  ["work-fb7a0ed6a88db7d7bc71", "fantasy;historical;romance"],
  ["work-fd88144bf7334c4aae39", "comedy"],
]);

const themeOverrides = [
  ["work-19a26f01512166856a6a", "exploration", "1", "0.82"],
  ["work-23851cd7ccf1d0c676cc", "workplace", "1", "0.74"],
  ["work-db80d94709b62aa8823f", "combat", "1", "0.90"],
  ["work-f5847c45d30753150364", "survival", "1", "0.88"],
] as const;

const themeAdditions = [
  ["work-5b9a3ec60ac5fc90f444", "workplace", "1", "0.74"],
  ["work-cdef8cfd678998a51447", "foundFamily", "2", "0.95"],
  ["work-ced7a8e6d9c3b8147702", "foundFamily", "2", "0.91"],
  ["work-fb7a0ed6a88db7d7bc71", "war", "1", "0.84"],
  ["work-fb7a0ed6a88db7d7bc71", "politics", "1", "0.80"],
  ["work-fb7a0ed6a88db7d7bc71", "historicalReconstruction", "2", "0.90"],
] as const;

const themeRemovals = new Set([
  "work-3dfaf6231e21133620c6/war",
  "work-3e725951eb9c49771087/workplace",
  "work-5b4dc4e6e966436b2990/crafting",
]);

function readCsv(path: string) {
  return parse(readFileSync(path), { columns: true, skip_empty_lines: true }) as CsvRow[];
}

function escapeCsv(value: string) {
  return /[",\r\n]/u.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function writeCsv(path: string, headers: readonly string[], rows: readonly CsvRow[]) {
  const content = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header] ?? "")).join(",")),
  ].join("\n");
  writeFileSync(path, `${content}\n`, "utf8");
}

function main(root = process.cwd()) {
  const base = resolve(root, ROOT);
  const appliedOverrides = new Set<string>();
  for (const chunk of CHUNKS) {
    const factorPath = `${base}/annotation/pass-a-text-chunk-${chunk}.csv`;
    const factors = readCsv(factorPath).map((row) => {
      const key = `${row.workId}/${row.axisId}`;
      const override = factorOverrides.get(key);
      if (override === undefined) return row;
      appliedOverrides.add(key);
      if (override.value === undefined || override.confidence === undefined) {
        return { ...row, state: "unknown", value: "", confidence: "" };
      }
      return {
        ...row,
        state: "known",
        value: String(override.value),
        confidence: String(override.confidence),
      };
    });
    writeCsv(
      `${base}/adjudication/text-final-chunk-${chunk}.csv`,
      ["workId", "axisId", "state", "value", "confidence", "evidenceId"],
      factors,
    );

    const workIds = new Set(factors.map((row) => row.workId));
    const genres = readCsv(`${base}/annotation/genres-pass-a-chunk-${chunk}.csv`).map((row) => ({
      ...row,
      genres: genreOverrides.get(row.workId ?? "") ?? row.genres ?? "",
    }));
    writeCsv(`${base}/adjudication/genres-final-chunk-${chunk}.csv`, ["workId", "genres"], genres);

    const themes = readCsv(`${base}/annotation/themes-pass-a-chunk-${chunk}.csv`).filter(
      (row) => !themeRemovals.has(`${row.workId}/${row.themeId}`),
    );
    for (const [workId, themeId, centrality, confidence] of themeOverrides) {
      if (!workIds.has(workId)) continue;
      const row = themes.find((item) => item.workId === workId && item.themeId === themeId);
      if (row === undefined) throw new Error(`Missing Theme override target: ${workId}/${themeId}`);
      Object.assign(row, { centrality, confidence });
    }
    for (const [workId, themeId, centrality, confidence] of themeAdditions) {
      if (!workIds.has(workId)) continue;
      themes.push({
        workId,
        themeId,
        centrality,
        confidence,
        evidenceId: `ev-batch-002-a-${workId}`,
      });
    }
    writeCsv(
      `${base}/adjudication/themes-final-chunk-${chunk}.csv`,
      ["workId", "themeId", "centrality", "confidence", "evidenceId"],
      themes,
    );
  }
  if (appliedOverrides.size !== factorOverrides.size) {
    throw new Error("A configured Factor override did not match the selected chunk inputs");
  }
}

main();
