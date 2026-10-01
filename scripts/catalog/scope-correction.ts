import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { z } from "zod";

const digest = z.string().regex(/^[a-f0-9]{64}$/u);
const rowSchema = z.record(z.string(), z.string());
const tablesSchema = z.record(z.string(), z.array(rowSchema));
const ownedTables = [
  "source_works",
  "source_aliases",
  "source_volumes",
  "source_factors",
  "source_themes",
  "source_evidence",
  "source_recommendation_context",
  "source_art_evidence_manifest",
  "source_book_metadata",
] as const;

export const scopeCorrectionSchema = z.strictObject({
  workId: z.string().regex(/^work-[a-f0-9]{20}$/u),
  representativeIsbn: z.string().regex(/^\d{13}$/u),
  action: z.literal("EXCLUDE_NON_JAPANESE_ORIGINAL"),
  outcome: z.literal("OUT_OF_SCOPE"),
  reasonCode: z.literal("NON_JAPANESE_ORIGINAL"),
  inputManifestSha256: digest,
  evidenceIds: z.array(z.string().min(1)).min(1),
  citationUrls: z.array(z.url()).min(1),
  entryScope: z.string().min(1),
  observation: z.string().min(1),
  limitation: z.string().min(1),
  beforeSnapshot: z.strictObject({ tables: tablesSchema }),
  beforeSnapshotSha256: digest,
  afterEligibility: z.strictObject({
    onboardingEligible: z.literal(false),
    recommendationEligible: z.literal(false),
    libraryOnly: z.literal(true),
  }),
});
export type ScopeCorrection = z.infer<typeof scopeCorrectionSchema>;
export const scopeCorrectionBindingSchema = z.strictObject({
  path: z.string().min(1),
  sha256: digest,
  resultRoot: z.string().min(1),
  resultManifestSha256: digest,
});
export type ScopeCorrectionBinding = z.infer<typeof scopeCorrectionBindingSchema>;
const auditNotesSchema = z.strictObject({
  schemaVersion: z.literal("catalog-scope-correction-evidence-v1"),
  correction: scopeCorrectionSchema,
  reviewReference: z
    .string()
    .regex(/^reviews\/authorized-evidence-panel-v1-batch-[a-z0-9-]+\.md$/u),
  reviewedByHuman: z.literal(false),
  resultManifestSha256: digest,
});

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([key, entry]) => [key, canonical(entry)]),
    );
  return value;
}
const json = (value: unknown) => JSON.stringify(canonical(value));
const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");

/** Scope audits remain referenced history after later ordinary publications. */
export function scopeAuditReviewReferences(rows: readonly Record<string, string>[]) {
  return rows
    .filter((row) => row.extractorVersion === "authorized-evidence-panel-scope-correction-v1")
    .map((row) => {
      const notes = auditNotesSchema.parse(JSON.parse(row.notes!));
      assert.equal(row.notes, json(notes), "Scope audit evidence is not canonical JSON");
      assert.equal(row.id, "ev-scope-correction-" + hash(row.notes!));
      return notes.reviewReference;
    });
}

function semanticRows(rows: readonly Record<string, string>[]) {
  return rows
    .map((row) =>
      json(
        Object.fromEntries(
          Object.entries(row).filter(([key]) => key !== "sourceOrdinal" && key !== "sourceLine"),
        ),
      ),
    )
    .sort();
}

/** Projection coordinates are not semantic values in the authority snapshot. */
export function scopeOwnedTables(database: DatabaseSync, workId: string) {
  const tables: Record<string, Record<string, string>[]> = {};
  const names = z
    .array(z.object({ name: z.string() }))
    .parse(
      database
        .prepare("select name from sqlite_schema where type='table' and name like 'source_%'")
        .all(),
    );
  for (const { name } of names) {
    const quoted = name.replaceAll('"', '""');
    const columns = z
      .array(z.object({ name: z.string() }))
      .parse(database.prepare(`pragma table_info("${quoted}")`).all());
    const owner = name === "source_works" ? "id" : "workId";
    if (!columns.some((column) => column.name === owner)) continue;
    tables[name] = z
      .array(z.record(z.string(), z.unknown()))
      .parse(database.prepare(`select * from "${quoted}" where "${owner}"=?`).all(workId))
      .map((row) =>
        rowSchema.parse(
          Object.fromEntries(
            Object.entries(row).filter(([key]) => key !== "sourceOrdinal" && key !== "sourceLine"),
          ),
        ),
      );
  }
  return tables;
}

export function validateScopeCorrection(value: unknown): ScopeCorrection {
  const correction = scopeCorrectionSchema.parse(value);
  const {
    workId,
    beforeSnapshot: { tables },
  } = correction;
  assert.equal(
    hash(json(tables)),
    correction.beforeSnapshotSha256,
    "Scope before snapshot SHA mismatch",
  );
  for (const table of ownedTables) assert(table in tables, `Scope snapshot missing ${table}`);
  assert.equal(tables.source_works!.length, 1, "Scope snapshot needs one Work");
  const work = tables.source_works![0]!;
  assert.equal(work.id, workId, "Scope snapshot Work mismatch");
  assert.equal(
    work.annotationReviewMethod,
    "authorizedEvidencePanel",
    "Scope correction needs preserved AEP authority",
  );
  assert.equal(
    work.recommendationEligible,
    "true",
    "Scope snapshot target was not recommendation eligible",
  );
  assert.equal(work.libraryOnly, "false", "Scope snapshot target was already libraryOnly");
  for (const [table, rows] of Object.entries(tables))
    for (const row of rows)
      assert.equal(
        row[table === "source_works" ? "id" : "workId"],
        workId,
        "Cross-Work scope snapshot",
      );
  const representative = tables.source_volumes!.filter((row) => row.isRepresentative === "true");
  assert.equal(representative.length, 1, "Scope snapshot representative count changed");
  assert.equal(
    representative[0]!.isbn,
    correction.representativeIsbn,
    "Scope representative ISBN mismatch",
  );
  assert.equal(
    new Set(correction.evidenceIds).size,
    correction.evidenceIds.length,
    "Duplicate scope evidence ID",
  );
  assert.equal(
    new Set(correction.citationUrls).size,
    correction.citationUrls.length,
    "Duplicate scope citation URL",
  );
  for (const url of correction.citationUrls)
    assert(["https:", "http:"].includes(new URL(url).protocol), "Invalid scope source URL");
  return correction;
}

/** Read only a sealed correction; the artifact name itself grants no authority. */
export function readScopeCorrections(resultRoot: string) {
  const chunk = resolve(resultRoot, "chunk-01");
  const path = join(chunk, "scope-corrections.json");
  if (!existsSync(path)) return undefined;
  const manifestPath = join(chunk, "PANEL-RESULT.sha256");
  const members = new Map<string, string>();
  for (const line of readFileSync(manifestPath, "utf8").split(/\r?\n/u).filter(Boolean)) {
    const match = /^([a-f0-9]{64})  (.+)$/u.exec(line);
    assert(match, "Invalid sealed scope result manifest");
    const name = match[2]!;
    const artifact = resolve(chunk, name);
    const part = relative(chunk, artifact);
    assert(
      !isAbsolute(name) && part && !part.startsWith("..") && !isAbsolute(part),
      "Scope result manifest escape",
    );
    assert(!members.has(name), "Duplicate scope result manifest member");
    assert(
      lstatSync(artifact).isFile() && !lstatSync(artifact).isSymbolicLink(),
      "Invalid scope result member",
    );
    assert.equal(hash(readFileSync(artifact)), match[1], `Scope result member changed: ${name}`);
    members.set(name, match[1]!);
  }
  assert.equal(
    members.get("scope-corrections.json"),
    hash(readFileSync(path)),
    "Scope correction is outside sealed result",
  );
  assert(members.has("PANEL-INPUT.sha256"), "Scope result has no frozen input manifest binding");
  const inputSha = hash(readFileSync(join(chunk, "PANEL-INPUT.sha256")));
  const artifact = z
    .strictObject({
      schemaVersion: z.literal("catalog-scope-correction-v1"),
      corrections: z.array(scopeCorrectionSchema).min(1),
    })
    .parse(JSON.parse(readFileSync(path, "utf8")));
  const corrections = artifact.corrections.map(validateScopeCorrection);
  assert.equal(
    new Set(corrections.map((row) => row.workId)).size,
    corrections.length,
    "Duplicate scope Work",
  );
  for (const correction of corrections)
    assert.equal(correction.inputManifestSha256, inputSha, "Scope frozen input SHA mismatch");
  const binding: ScopeCorrectionBinding = {
    path,
    sha256: hash(readFileSync(path)),
    resultRoot: resolve(resultRoot),
    resultManifestSha256: hash(readFileSync(manifestPath)),
  };
  return { binding, corrections };
}

export function verifyScopeBefore(correction: ScopeCorrection, actual: unknown) {
  const tables = tablesSchema.parse(actual);
  assert.deepEqual(
    Object.keys(tables).sort(),
    Object.keys(correction.beforeSnapshot.tables).sort(),
    "Scope before owned table set changed",
  );
  for (const [name, rows] of Object.entries(correction.beforeSnapshot.tables))
    assert.deepEqual(
      semanticRows(tables[name] ?? []),
      semanticRows(rows),
      `Scope current before changed: ${name}`,
    );
}

/** Only three flags and the manifest-bound audit evidence may differ. */
export function verifyScopeAfter(
  correction: ScopeCorrection,
  actual: unknown,
  resultManifestSha256: string,
) {
  digest.parse(resultManifestSha256);
  const tables = tablesSchema.parse(actual);
  const before = correction.beforeSnapshot.tables;
  assert.deepEqual(
    Object.keys(tables).sort(),
    Object.keys(before).sort(),
    "Scope owned table set changed",
  );
  for (const [name, rows] of Object.entries(before)) {
    if (name === "source_evidence") continue;
    const expected =
      name === "source_works"
        ? rows.map((row) => ({
            ...row,
            onboardingEligible: "false",
            recommendationEligible: "false",
            libraryOnly: "true",
          }))
        : rows;
    assert.deepEqual(
      semanticRows(tables[name]!),
      semanticRows(expected),
      `Scope changed retained ${name}`,
    );
  }
  const old = new Map(before.source_evidence!.map((row) => [row.id, row]));
  const current = new Map(tables.source_evidence!.map((row) => [row.id, row]));
  assert.equal(current.size, tables.source_evidence!.length, "Duplicate scope evidence row");
  for (const [id, row] of old) {
    assert(current.has(id), "Scope removed historical evidence");
    assert.deepEqual(
      semanticRows([current.get(id)!]),
      semanticRows([row]),
      "Scope changed historical evidence",
    );
  }
  const added = tables.source_evidence!.filter((row) => !old.has(row.id));
  assert.equal(added.length, 1, "Scope correction needs exactly one appended audit evidence");
  const evidence = added[0]!;
  assert.equal(evidence.extractorVersion, "authorized-evidence-panel-scope-correction-v1");
  const notes = auditNotesSchema.parse(JSON.parse(evidence.notes!));
  assert.deepEqual(
    notes.correction,
    correction,
    "Scope audit evidence differs from sealed correction",
  );
  assert.equal(
    notes.resultManifestSha256,
    resultManifestSha256,
    "Scope audit evidence result manifest mismatch",
  );
  assert.equal(evidence.notes, json(notes), "Scope audit evidence is not canonical JSON");
  assert.equal(evidence.id, "ev-scope-correction-" + hash(evidence.notes!));
  for (const [key, value] of Object.entries({
    workId: correction.workId,
    targetType: "work",
    targetId: correction.workId,
    sourceType: "manual",
    sourceUrl: correction.citationUrls[0]!,
    confidence: "0",
    reviewedByHuman: "false",
  }))
    assert.equal(evidence[key], value, `Scope audit evidence ${key} mismatch`);
  assert(!Number.isNaN(Date.parse(evidence.fetchedAt!)), "Invalid scope audit timestamp");
  return { reviewReference: notes.reviewReference };
}
