import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import {
  aliasSourceRowSchema,
  evidenceSourceRowSchema,
  factorSourceRowSchema,
  recommendationConfigSourceRowSchema,
  recommendationContextSourceRowSchema,
  themeSourceRowSchema,
  volumeSourceRowSchema,
  workSourceRowSchema,
} from "./source-schema";
import { ART_EVIDENCE_MANIFEST_FILE, artEvidenceManifestRowSchema } from "./art-evidence";
import type { CatalogSource, Located, SourceIssue, SourceLoadResult } from "./types";
import {
  CATALOG_DATABASE_FILE,
  CATALOG_TABLES,
  readCatalogAuthorityRecords,
  type AuthorityRecord,
} from "./authority";

const locatedCsvRowsSchema = z.array(
  z.strictObject({
    row: z.number().int().positive(),
    record: z.record(z.string(), z.string()),
  }),
);

function parseLocatedRecords<T>(
  file: string,
  records: readonly AuthorityRecord[],
  schema: z.ZodType<T>,
): { rows: Located<T>[]; issues: SourceIssue[] } {
  const locatedResult = locatedCsvRowsSchema.safeParse(records);
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

  return parseLocatedRecords(file, parsed as AuthorityRecord[], schema);
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

type LoadedRows<T> = { rows: Located<T>[]; issues: SourceIssue[] };

function emptyCatalogSource(): CatalogSource {
  return {
    works: [],
    aliases: [],
    volumes: [],
    factors: [],
    themes: [],
    recommendationContext: [],
    recommendationConfig: [],
    evidence: [],
  };
}

function finishLoad(
  sourceDirectory: string,
  inputs: {
    works: LoadedRows<z.infer<typeof workSourceRowSchema>>;
    aliases: LoadedRows<z.infer<typeof aliasSourceRowSchema>>;
    volumes: LoadedRows<z.infer<typeof volumeSourceRowSchema>>;
    factors: LoadedRows<z.infer<typeof factorSourceRowSchema>>;
    themes: LoadedRows<z.infer<typeof themeSourceRowSchema>>;
    recommendationContext: LoadedRows<z.infer<typeof recommendationContextSourceRowSchema>>;
    recommendationConfig: LoadedRows<z.infer<typeof recommendationConfigSourceRowSchema>>;
    evidence: LoadedRows<z.infer<typeof evidenceSourceRowSchema>>;
    artEvidence: LoadedRows<z.infer<typeof artEvidenceManifestRowSchema>>;
  },
): SourceLoadResult {
  const {
    works,
    aliases,
    volumes,
    factors,
    themes,
    recommendationContext,
    recommendationConfig,
    evidence,
    artEvidence,
  } = inputs;
  const source: CatalogSource = {
    works: works.rows,
    aliases: aliases.rows,
    volumes: volumes.rows,
    factors: factors.rows,
    themes: themes.rows,
    recommendationContext: recommendationContext.rows,
    recommendationConfig: recommendationConfig.rows,
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
    artEvidence: artEvidence.rows,
    issues: [
      ...works.issues,
      ...aliases.issues,
      ...volumes.issues,
      ...factors.issues,
      ...themes.issues,
      ...recommendationContext.issues,
      ...recommendationConfig.issues,
      ...evidence.issues,
      ...artEvidence.issues,
      ...reviewReferenceIssues,
    ],
  };
}

export function loadCatalogSourceFromCsv(sourceDirectory: string): SourceLoadResult {
  return finishLoad(sourceDirectory, {
    works: loadFile(sourceDirectory, "works.csv", workSourceRowSchema),
    aliases: loadFile(sourceDirectory, "aliases.csv", aliasSourceRowSchema),
    volumes: loadFile(sourceDirectory, "volumes.csv", volumeSourceRowSchema),
    factors: loadFile(sourceDirectory, "factors.csv", factorSourceRowSchema),
    themes: loadFile(sourceDirectory, "themes.csv", themeSourceRowSchema),
    recommendationContext: loadFile(
      sourceDirectory,
      "recommendation-context.csv",
      recommendationContextSourceRowSchema,
    ),
    recommendationConfig: loadFile(
      sourceDirectory,
      "recommendation-config.csv",
      recommendationConfigSourceRowSchema,
    ),
    evidence: loadFile(sourceDirectory, "evidence/evidence.csv", evidenceSourceRowSchema),
    artEvidence: loadFile(
      sourceDirectory,
      ART_EVIDENCE_MANIFEST_FILE,
      artEvidenceManifestRowSchema,
    ),
  });
}

export function loadCatalogAuthority(sourceDirectory: string): SourceLoadResult {
  if (CATALOG_TABLES.some((table) => existsSync(join(sourceDirectory, table.path)))) {
    return {
      source: emptyCatalogSource(),
      artEvidence: [],
      issues: [
        {
          severity: "error",
          code: "SOURCE_DUAL_AUTHORITY",
          file: CATALOG_DATABASE_FILE,
          message: "Catalog source cannot contain both SQLite and authoritative CSV tables",
        },
      ],
    };
  }
  let records: ReadonlyMap<string, AuthorityRecord[]>;
  try {
    records = readCatalogAuthorityRecords(sourceDirectory);
  } catch (error) {
    return {
      source: emptyCatalogSource(),
      artEvidence: [],
      issues: [
        {
          severity: "error",
          code: "SOURCE_DATABASE_ERROR",
          file: CATALOG_DATABASE_FILE,
          message: error instanceof Error ? error.message : "Unable to read Catalog authority",
        },
      ],
    };
  }
  const load = <T>(file: string, schema: z.ZodType<T>) =>
    parseLocatedRecords(file, records.get(file) ?? [], schema);
  return finishLoad(sourceDirectory, {
    works: load("works.csv", workSourceRowSchema),
    aliases: load("aliases.csv", aliasSourceRowSchema),
    volumes: load("volumes.csv", volumeSourceRowSchema),
    factors: load("factors.csv", factorSourceRowSchema),
    themes: load("themes.csv", themeSourceRowSchema),
    recommendationContext: load("recommendation-context.csv", recommendationContextSourceRowSchema),
    recommendationConfig: load("recommendation-config.csv", recommendationConfigSourceRowSchema),
    evidence: load("evidence/evidence.csv", evidenceSourceRowSchema),
    artEvidence: load(ART_EVIDENCE_MANIFEST_FILE, artEvidenceManifestRowSchema),
  });
}

export function loadCatalogSource(sourceDirectory: string): SourceLoadResult {
  const hasDatabase = existsSync(join(sourceDirectory, CATALOG_DATABASE_FILE));
  return hasDatabase
    ? loadCatalogAuthority(sourceDirectory)
    : loadCatalogSourceFromCsv(sourceDirectory);
}
