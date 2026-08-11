import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { TextDecoder } from "node:util";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import { AXIS_IDS, GENRE_TAGS, THEME_TAGS } from "../../src/domain/catalog/constants";
import { blindRetagSampleManifestSchema } from "../build-g1-blind-retag";
import { factorSourceRowSchema, themeSourceRowSchema } from "./source-schema";

const OUTPUT_FILES = ["factors.csv", "genres.csv", "notes.md", "themes.csv"] as const;
const FACTOR_HEADERS = ["workId", "axisId", "state", "value", "confidence", "evidenceId"];
const THEME_HEADERS = ["workId", "themeId", "centrality", "confidence", "evidenceId"];
const GENRE_HEADERS = ["workId", "genres"];
const ISOLATION_ATTESTATION =
  "Isolation attestation: only input.md and factor-dictionary.md were read as local files; no other local files were read.";
const genreRowSchema = z.strictObject({
  workId: z.string().trim().min(1),
  genres: z
    .string()
    .transform((value) =>
      value.trim() === "" ? [] : value.split(";").map((genre) => genre.trim()),
    )
    .pipe(z.array(z.enum(GENRE_TAGS))),
});

function readCanonicalFile(path: string) {
  const bytes = readFileSync(path);
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (text.includes("\r") || !text.endsWith("\n") || text.endsWith("\n\n")) {
    throw new Error(`${path} must use LF and end with exactly one newline`);
  }
  return { bytes, text };
}

function readCanonicalText(path: string) {
  return readCanonicalFile(path).text;
}

function readCsv(path: string, expectedHeaders: readonly string[]) {
  const [headers, ...rows] = z.array(z.array(z.string())).parse(parse(readCanonicalText(path)));
  if (headers === undefined || headers.join("\0") !== expectedHeaders.join("\0")) {
    throw new Error(`${path} has an invalid header`);
  }
  return rows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index]])),
  );
}

function readAuthorizedUrls(input: string, workIds: readonly string[]) {
  const expectedWorkIds = new Set(workIds);
  const urls = new Map<string, string>();
  for (const line of input.split("\n")) {
    const match = /^\|\s+([a-z0-9]+(?:-[a-z0-9]+)*)\s+\|.*\|\s+<(https?:\/\/[^>]+)>\s+\|$/u.exec(
      line,
    );
    const workId = match?.[1];
    const url = match?.[2];
    if (workId !== undefined && url !== undefined && expectedWorkIds.has(workId)) {
      if (urls.has(workId)) {
        throw new Error(`input.md contains duplicate authorized URL rows for ${workId}`);
      }
      urls.set(workId, url);
    }
  }
  if (urls.size !== workIds.length) {
    throw new Error("input.md must contain one authorized URL for every selected work");
  }
  return urls;
}

function readWorkSections(notes: string, workIds: readonly string[]) {
  const headings = [...notes.matchAll(/^## `([a-z0-9]+(?:-[a-z0-9]+)*)`$/gmu)];
  if (
    headings.length !== workIds.length ||
    headings.some((heading, index) => heading[1] !== workIds[index])
  ) {
    throw new Error("notes.md work sections must exactly match the selected-work order");
  }
  return headings.map((heading, index) => {
    const start = (heading.index ?? 0) + heading[0].length + 1;
    return notes.slice(start, headings[index + 1]?.index ?? notes.length);
  });
}

function requireMarkers(section: string, label: string, expectedPrefixes: readonly string[]) {
  const lines = section.split("\n").filter((line) => line.startsWith(`- ${label}`));
  if (
    lines.length !== expectedPrefixes.length ||
    lines.some((line, index) => {
      const prefix = expectedPrefixes[index];
      return (
        prefix === undefined ||
        !line.startsWith(prefix) ||
        line.slice(prefix.length).trim() === "" ||
        ["{nonempty rationale}", "{nonempty limitation}"].includes(line.slice(prefix.length).trim())
      );
    })
  ) {
    throw new Error(`notes.md has invalid ${label} markers or rationale`);
  }
}

export function validateG1BlindRetagOutput(root: string, outputDirectory: string) {
  const directory = resolve(root, outputDirectory);
  const entries = readdirSync(directory, { withFileTypes: true });
  if (
    entries.length !== OUTPUT_FILES.length ||
    entries.some(
      (entry) => !entry.isFile() || !OUTPUT_FILES.some((fileName) => fileName === entry.name),
    )
  ) {
    throw new Error(`Blind-retag output must contain only: ${OUTPUT_FILES.join(", ")}`);
  }

  const manifest = blindRetagSampleManifestSchema.parse(
    JSON.parse(
      readFileSync(join(root, "data/staging/g1/blind-retag/sample-manifest.json"), "utf8"),
    ) as unknown,
  );
  const inputFile = readCanonicalFile(join(root, "data/staging/g1/blind-retag/input.md"));
  const inputSha256 = createHash("sha256").update(inputFile.bytes).digest("hex");
  if (inputSha256 !== manifest.inputSha256) {
    throw new Error("input.md SHA-256 does not match the blind-retag manifest");
  }
  const workIds = manifest.selected.map(({ workId }) => workId);
  const authorizedUrls = readAuthorizedUrls(inputFile.text, workIds);
  const factors = readCsv(join(directory, "factors.csv"), FACTOR_HEADERS).map((row) =>
    factorSourceRowSchema.parse(row),
  );
  if (factors.length !== workIds.length * AXIS_IDS.length) {
    throw new Error("factors.csv must contain the exact selected-work by Axis ID product");
  }
  for (const [index, factor] of factors.entries()) {
    const workId = workIds[Math.floor(index / AXIS_IDS.length)];
    const axisId = AXIS_IDS[index % AXIS_IDS.length];
    if (
      factor.workId !== workId ||
      factor.axisId !== axisId ||
      factor.evidenceId !== `blind-retag-g1-v1-${factor.workId}`
    ) {
      throw new Error(`Invalid factor order or evidence at row ${String(index + 2)}`);
    }
  }

  const themes = readCsv(join(directory, "themes.csv"), THEME_HEADERS).map((row) =>
    themeSourceRowSchema.parse(row),
  );
  let previousThemeOrder = -1;
  for (const theme of themes) {
    const workOrder = workIds.indexOf(theme.workId);
    const themeOrder = THEME_TAGS.indexOf(theme.themeId);
    const order = workOrder * THEME_TAGS.length + themeOrder;
    if (
      workOrder < 0 ||
      order <= previousThemeOrder ||
      theme.evidenceId !== `blind-retag-g1-v1-${theme.workId}`
    ) {
      throw new Error(
        `Invalid theme order, uniqueness, or evidence: ${theme.workId}/${theme.themeId}`,
      );
    }
    previousThemeOrder = order;
  }

  const genres = readCsv(join(directory, "genres.csv"), GENRE_HEADERS).map((row) =>
    genreRowSchema.parse(row),
  );
  if (genres.length !== workIds.length) {
    throw new Error("genres.csv must contain exactly one row per selected work");
  }
  for (const [index, row] of genres.entries()) {
    if (row.workId !== workIds[index]) {
      throw new Error(`Invalid genre work order at row ${String(index + 2)}`);
    }
    const orders = row.genres.map((genre) => GENRE_TAGS.indexOf(genre));
    if (orders.some((order, genreIndex) => genreIndex > 0 && order <= orders[genreIndex - 1]!)) {
      throw new Error(`Genres must be unique and canonically ordered: ${row.workId}`);
    }
  }

  const notes = readCanonicalText(join(directory, "notes.md"));
  const noteLines = notes.split("\n");
  const inputHashLines = noteLines.filter((line) => line.startsWith("Input SHA-256:"));
  if (
    inputHashLines.length !== 1 ||
    inputHashLines[0] !== `Input SHA-256: \`${manifest.inputSha256}\``
  ) {
    throw new Error("notes.md must contain the exact current Input SHA-256 line");
  }
  const attestationLines = noteLines.filter((line) => line.startsWith("Isolation attestation:"));
  if (attestationLines.length !== 1 || attestationLines[0] !== ISOLATION_ATTESTATION) {
    throw new Error("notes.md must contain the exact positive isolation attestation");
  }

  const sections = readWorkSections(notes, workIds);
  for (const [index, workId] of workIds.entries()) {
    const section = sections[index];
    const authorizedUrl = authorizedUrls.get(workId);
    if (section === undefined || authorizedUrl === undefined) {
      throw new Error(`Missing notes.md work contract for ${workId}`);
    }
    const authorizedUrlLines = section
      .split("\n")
      .filter((line) => line.startsWith("- Authorized URL"));
    if (
      authorizedUrlLines.length !== 1 ||
      authorizedUrlLines[0] !== `- Authorized URL: <${authorizedUrl}>`
    ) {
      throw new Error(`notes.md has an invalid authorized URL for ${workId}`);
    }
    requireMarkers(
      section,
      "Axis",
      factors
        .filter((factor) => factor.workId === workId)
        .map((factor) => `- Axis \`${factor.axisId}\`: `),
    );
    const workGenres = genres[index]?.genres ?? [];
    requireMarkers(
      section,
      "Genre",
      workGenres.length === 0
        ? ["- Genre unknown: "]
        : workGenres.map((genre) => `- Genre \`${genre}\`: `),
    );
    const workThemes = themes.filter((theme) => theme.workId === workId);
    requireMarkers(
      section,
      "Theme",
      workThemes.length === 0
        ? ["- Theme unknown: "]
        : workThemes.map(
            (theme) => `- Theme \`${theme.themeId}\` (centrality ${String(theme.centrality)}): `,
          ),
    );
  }

  const authorizedUrlSet = new Set(authorizedUrls.values());
  for (const url of notes.match(/https?:\/\/[^\s<>()\[\]{}"'`]+/giu) ?? []) {
    if (!authorizedUrlSet.has(url)) {
      throw new Error(`notes.md contains a non-authorized URL: ${url}`);
    }
  }
}

const invokedPath = process.argv[1];
if (invokedPath !== undefined && import.meta.url === pathToFileURL(resolve(invokedPath)).href) {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  try {
    if (args.length !== 1 || args[0] === undefined) {
      throw new Error("Usage: tsx scripts/catalog/g1-blind-retag-output.ts <output-directory>");
    }
    validateG1BlindRetagOutput(process.cwd(), args[0]);
    console.log(`Validated ${relative(process.cwd(), resolve(process.cwd(), args[0]))}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
