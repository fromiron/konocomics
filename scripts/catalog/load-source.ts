import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import {
  aliasSourceRowSchema,
  evidenceSourceRowSchema,
  factorSourceRowSchema,
  themeSourceRowSchema,
  volumeSourceRowSchema,
  workSourceRowSchema,
} from "./source-schema";
import type { CatalogSource, Located, SourceIssue, SourceLoadResult } from "./types";

const locatedCsvRowsSchema = z.array(
  z.strictObject({
    row: z.number().int().positive(),
    record: z.record(z.string(), z.string()),
  }),
);

export function parseCsvContent<T>(
  file: string,
  content: string,
  schema: z.ZodType<T>,
): { rows: Located<T>[]; issues: SourceIssue[] } {
  let parsed: unknown;
  try {
    parsed = parse(content, {
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
      on_record(record, context) {
        return { row: context.lines, record };
      },
    });
  } catch (error) {
    return {
      rows: [],
      issues: [
        {
          severity: "error",
          code: "CSV_PARSE_ERROR",
          file,
          message: error instanceof Error ? error.message : "Unknown CSV parse error",
        },
      ],
    };
  }

  const locatedResult = locatedCsvRowsSchema.safeParse(parsed);
  if (!locatedResult.success) {
    return {
      rows: [],
      issues: locatedResult.error.issues.map((issue) => ({
        severity: "error",
        code: "CSV_RECORD_ERROR",
        file,
        field: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  const rows: Located<T>[] = [];
  const issues: SourceIssue[] = [];
  for (const located of locatedResult.data) {
    const result = schema.safeParse(located.record);
    if (result.success) {
      rows.push({ file, row: located.row, value: result.data });
      continue;
    }
    for (const issue of result.error.issues) {
      issues.push({
        severity: "error",
        code: "CSV_ROW_INVALID",
        file,
        row: located.row,
        field: issue.path.join("."),
        message: issue.message,
      });
    }
  }

  return { rows, issues };
}

function loadFile<T>(sourceDirectory: string, file: string, schema: z.ZodType<T>) {
  const path = join(sourceDirectory, file);
  try {
    return parseCsvContent(file, readFileSync(path, "utf8"), schema);
  } catch (error) {
    return {
      rows: [] as Located<T>[],
      issues: [
        {
          severity: "error" as const,
          code: "SOURCE_FILE_MISSING",
          file,
          message: error instanceof Error ? error.message : `Unable to read ${file}`,
        },
      ],
    };
  }
}

export function loadCatalogSource(sourceDirectory: string): SourceLoadResult {
  const works = loadFile(sourceDirectory, "works.csv", workSourceRowSchema);
  const aliases = loadFile(sourceDirectory, "aliases.csv", aliasSourceRowSchema);
  const volumes = loadFile(sourceDirectory, "volumes.csv", volumeSourceRowSchema);
  const factors = loadFile(sourceDirectory, "factors.csv", factorSourceRowSchema);
  const themes = loadFile(sourceDirectory, "themes.csv", themeSourceRowSchema);
  const evidence = loadFile(sourceDirectory, "evidence/evidence.csv", evidenceSourceRowSchema);

  const source: CatalogSource = {
    works: works.rows,
    aliases: aliases.rows,
    volumes: volumes.rows,
    factors: factors.rows,
    themes: themes.rows,
    evidence: evidence.rows,
  };
  const reviewReferenceIssues: SourceIssue[] = works.rows.flatMap((row) => {
    const reference = row.value.annotationReviewReference;
    if (reference === undefined || existsSync(join(sourceDirectory, reference))) {
      return [];
    }
    return [
      {
        severity: "error",
        code: "ANNOTATION_REVIEW_REPORT_MISSING",
        file: row.file,
        row: row.row,
        field: "annotationReviewReference",
        message: `Annotation review report does not exist: ${reference}`,
      },
    ];
  });

  return {
    source,
    issues: [
      ...works.issues,
      ...aliases.issues,
      ...volumes.issues,
      ...factors.issues,
      ...themes.issues,
      ...evidence.issues,
      ...reviewReferenceIssues,
    ],
  };
}
