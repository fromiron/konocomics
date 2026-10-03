import assert from "node:assert/strict";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, toNamespacedPath } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { z } from "zod";

import { buildCatalog } from "./build-catalog";
import { prepareRestoredCatalogOperation, recordRestoredCatalogOperation } from "./catalog-python";
import {
  CATALOG_OPAQUE_PATHS,
  finalizeCatalogAuthorityProjection,
  serializeCsv,
  sha256,
  verifyCatalogAuthority,
  writeCatalogCsvProjection,
} from "./catalog/authority";
import type { LexicalTable } from "./catalog/authority";
import {
  CANONICAL_POLICY_PATHS,
  assertNoPendingCanonicalPublication,
  canonicalPendingPath,
  canonicalPublicationPaths,
  commitCanonicalPublication,
  publishPreparedCanonical,
  readCanonicalPublication,
  resolveCanonicalPath,
  sealCanonicalPublication,
  verifyCanonicalCompletion,
  writeDurableJson,
} from "./catalog/canonical-publication";
import { mergeRawCsv } from "./promote-pilot-001";
import { validateGoldSet } from "./validate-catalog-expansion";
import {
  readScopeCorrections,
  scopeAuditReviewReferences,
  scopeCorrectionBindingSchema,
  scopeOwnedTables,
  verifyScopeAfter,
  verifyScopeBefore,
} from "./catalog/scope-correction";
import type { ScopeCorrection } from "./catalog/scope-correction";

const workIdsSchema = z.array(z.string().regex(/^[a-z0-9][a-z0-9-]*$/u)).min(1);
const readbackSchema = z.object({
  status: z.literal("SQL_BUILD_COVERAGE_ENGINE_VERIFIED"),
  targetWorkIds: workIdsSchema,
  catalogSha256: z.string().regex(/^[a-f0-9]{64}$/u),
  canonicalSha256: z.string().regex(/^[a-f0-9]{64}$/u),
  executionIdentity: z
    .object({
      schemaVersion: z.literal("catalog-readback-code-v1"),
      files: z.array(z.object({ path: z.string(), sha256: z.string().regex(/^[a-f0-9]{64}$/u) })),
    })
    .optional(),
  scopeCorrections: z.array(scopeCorrectionBindingSchema).optional().default([]),
});
const workFields = new Set([
  "genres",
  "factorScope",
  "onboardingEligible",
  "recommendationEligible",
  "libraryOnly",
  "annotationReviewMethod",
  "annotationReviewedAt",
  "annotationReviewReference",
]);

const reviewReferenceSchema = z.string().regex(/^reviews\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/u);
const contextAuditSchema = z.strictObject({
  workId: z.string(), priorReviewReference: reviewReferenceSchema,
  reviewReference: reviewReferenceSchema, priorReviewSha256: z.string().regex(/^[a-f0-9]{64}$/u),
  priorContextEvidenceSha256: z.record(z.string(), z.string().regex(/^[a-f0-9]{64}$/u)),
  replacementEvidenceId: z.string(), numericContextPreserved: z.literal(true),
  candidateOnly: z.literal(true), reviewedByHuman: z.literal(false), contextOnly: z.boolean(),
});
const contextAuditPrefix = "\n## Recommendation context supersession\n\nThe new frozen context replaces the prior selection provenance for these works. Previous evidence and reviews remain historical records; numeric context rows are unchanged. Factor decisions remain in the separately validated ledger.\n\n```json\n";

/** Derive an audit identity only for exact, evidence-bound context additions. */
export function deriveCanonicalContextAudit(options: {
  reference: string; current: Buffer; candidate: Buffer; workIds: readonly string[];
  evidence: LexicalTable; priorReviewSha256: (reference: string) => string;
}) {
  const { reference, current, candidate, workIds, evidence } = options;
  reviewReferenceSchema.parse(reference);
  assert(candidate.length > current.length && candidate.subarray(0, current.length).equals(current),
    "Existing review differs outside appended context audit");
  let remaining = new TextDecoder("utf-8", { fatal: true }).decode(candidate.subarray(current.length));
  const seen = new Set<string>();
  while (remaining) {
    assert(remaining.startsWith(contextAuditPrefix), "Unexpected existing review append");
    remaining = remaining.slice(contextAuditPrefix.length);
    const end = remaining.indexOf("\n```\n");
    assert(end >= 0, "Incomplete context audit append");
    const records = z.array(contextAuditSchema).min(1).parse(JSON.parse(remaining.slice(0, end)));
    remaining = remaining.slice(end + "\n```\n".length);
    for (const record of records) {
      assert(workIds.includes(record.workId) && !seen.has(record.workId), "Context audit outside exact target group");
      seen.add(record.workId);
      assert.equal(record.reviewReference, reference, "Context audit review identity changed");
      assert.notEqual(record.priorReviewReference, reference, "Context audit must retain a separate prior review");
      assert.equal(options.priorReviewSha256(record.priorReviewReference), record.priorReviewSha256,
        "Context audit prior review changed");
      const matches = evidence.rows.filter((r) => r.values[column(evidence, "id")] === record.replacementEvidenceId);
      assert.equal(matches.length, 1, "Context audit replacement evidence missing or duplicated");
      const row = matches[0]!;
      assert.equal(row.values[column(evidence, "workId")], record.workId, "Context audit evidence belongs to another Work");
      const notes = row.values[column(evidence, "notes")]!;
      const marker = " | contextSupersessionV1|";
      assert.equal(notes.split(marker).length, 2, "Context audit has no exact evidence binding");
      const { priorReviewSha256: _prior, ...binding } = record;
      assert.deepEqual(JSON.parse(notes.split(marker)[1]!), binding, "Context audit differs from accepted evidence binding");
    }
  }
  assert.deepEqual([...seen].sort(), [...workIds].sort(), "Context audit does not cover exact target group");
  const candidateSha256 = sha256(candidate);
  return { originalReference: reference, currentSha256: sha256(current), candidateSha256,
    canonicalReference: reference.replace(/\.md$/u, `-context-${candidateSha256}.md`), workIds: [...seen].sort() };
}

function containsPath(parent: string, child: string) {
  const part = relative(parent, child);
  return (
    part === "" ||
    (!isAbsolute(part) && part !== ".." && !part.startsWith("../") && !part.startsWith("..\\"))
  );
}

function column(table: LexicalTable, key: string) {
  const index = table.headers.indexOf(key);
  assert(index >= 0, `${table.path}: missing column ${key}`);
  return index;
}

function subset(
  table: LexicalTable,
  predicate: (values: readonly string[]) => boolean,
): LexicalTable {
  return { ...table, rows: table.rows.filter((row) => predicate(row.values)) };
}

function mergeTable(
  current: LexicalTable,
  overlay: LexicalTable,
  matches: (row: readonly string[]) => boolean,
) {
  return mergeRawCsv({
    current: serializeCsv(current).toString("utf8"),
    overlay: serializeCsv(overlay).toString("utf8"),
    headers: current.headers,
    matches,
    allowedCurrentMatchCounts: [current.rows.filter((row) => matches(row.values)).length],
  });
}

/** Merge only the completed batch. Current bibliography and earlier evidence remain authoritative. */
export function mergeCanonicalTargets(
  current: readonly LexicalTable[],
  candidate: readonly LexicalTable[],
  workIds: readonly string[],
  scopeExcludedWorkIds: readonly string[] = [],
) {
  const targets = new Set(workIds);
  const excluded = new Set(scopeExcludedWorkIds);
  assert.equal(excluded.size, scopeExcludedWorkIds.length, "Duplicate scope canonical target");
  assert(
    scopeExcludedWorkIds.every((id) => targets.has(id)),
    "Scope canonical target outside batch",
  );
  const get = (tables: readonly LexicalTable[], path: string) => {
    const table = tables.find((row) => row.path === path);
    assert(table, `Missing source table: ${path}`);
    return table;
  };
  const works = get(current, "works.csv");
  const candidateWorks = get(candidate, "works.csv");
  const workId = column(works, "id");
  const currentWorks = new Map(works.rows.map((row) => [row.values[workId], row]));
  const selectedWorks = subset(candidateWorks, (row) => targets.has(row[workId]!));
  assert.equal(selectedWorks.rows.length, targets.size, "Candidate is missing a target work");
  for (const row of selectedWorks.rows) {
    assert(
      currentWorks.has(row.values[workId]),
      "Canonical target work is missing; import bibliography first",
    );
    assert.equal(row.values[column(works, "annotationReviewMethod")], "authorizedEvidencePanel");
    const scoped = excluded.has(row.values[workId]!);
    assert.equal(row.values[column(works, "recommendationEligible")], scoped ? "false" : "true");
    assert.equal(row.values[column(works, "libraryOnly")], scoped ? "true" : "false");
    if (scoped) {
      assert.equal(row.values[column(works, "onboardingEligible")], "false");
      const old = currentWorks.get(row.values[workId])!;
      for (const [index, field] of works.headers.entries())
        if (!["onboardingEligible", "recommendationEligible", "libraryOnly"].includes(field))
          assert.equal(
            row.values[index],
            old.values[index],
            `Scope correction changed Work ${field}`,
          );
    }
  }
  const merged = new Map<string, string>();
  selectedWorks.rows = selectedWorks.rows.map((row) => ({
    ...row,
    values: works.headers.map((name, index) =>
      workFields.has(name)
        ? row.values[index]!
        : currentWorks.get(row.values[workId])!.values[index]!,
    ),
  }));
  merged.set(
    works.path,
    mergeTable(works, selectedWorks, (row) => targets.has(row[workId]!)),
  );

  // An edition or alias conflict affects frozen meaning; metadata captions may advance independently.
  for (const path of ["volumes.csv", "aliases.csv"]) {
    const before = get(current, path);
    const after = get(candidate, path);
    const key = column(before, "workId");
    assert.deepEqual(
      subset(after, (row) => targets.has(row[key]!)).rows.map((row) => row.values),
      subset(before, (row) => targets.has(row[key]!)).rows.map((row) => row.values),
      `Target bibliography changed: ${path}`,
    );
  }
  for (const path of [
    "factors.csv",
    "themes.csv",
    "recommendation-context.csv",
    "evidence/art-evidence-manifest.csv",
  ]) {
    const before = get(current, path);
    const after = get(candidate, path);
    const key = column(before, "workId");
    merged.set(
      path,
      mergeTable(
        before,
        subset(after, (row) => targets.has(row[key]!)),
        (row) => targets.has(row[key]!),
      ),
    );
  }

  const evidence = get(current, "evidence/evidence.csv");
  const nextEvidence = get(candidate, evidence.path);
  const evidenceWork = column(evidence, "workId");
  const evidenceId = column(evidence, "id");
  const selectedEvidence = subset(nextEvidence, (row) => targets.has(row[evidenceWork]!));
  const existingById = new Map(evidence.rows.map((row) => [row.values[evidenceId], row.values]));
  const selectedById = new Map(
    selectedEvidence.rows.map((row) => [row.values[evidenceId], row.values]),
  );
  for (const row of evidence.rows.filter((entry) => targets.has(entry.values[evidenceWork]!))) {
    const replacement = selectedById.get(row.values[evidenceId]);
    // Older canonical evidence need not be present in an older candidate; never remove it.
    if (!replacement) selectedEvidence.rows.push(row);
  }
  for (const row of selectedEvidence.rows) {
    const before = existingById.get(row.values[evidenceId]);
    if (!before) continue;
    for (const [index, field] of evidence.headers.entries()) {
      if (field !== "sourceType" && field !== "notes") {
        assert.equal(
          row.values[index],
          before[index],
          `Existing evidence identity changed: ${row.values[evidenceId]}:${field}`,
        );
      }
    }
  }
  merged.set(
    evidence.path,
    mergeTable(evidence, selectedEvidence, (row) => targets.has(row[evidenceWork]!)),
  );
  return merged;
}

export function prepareCanonicalApplication(options: {
  root: string;
  publicationRoot: string;
  workIds: readonly string[];
  output: string;
  readback?: string;
  expectedCanonicalSha256?: string;
}) {
  const root = resolve(options.root);
  const publicationRoot = resolve(options.publicationRoot);
  const output = resolve(options.output);
  assertNoPendingCanonicalPublication(root, join(output, "prepared.json"));
  assert.notEqual(publicationRoot, root, "Candidate publication must be isolated from canonical");
  for (const protectedRoot of [
    root,
    publicationRoot,
    join(root, "data/source"),
    join(root, "data/generated"),
    join(root, "src/data/generated"),
    join(root, "public"),
  ]) {
    assert(
      !containsPath(output, protectedRoot) &&
        (protectedRoot === root || !containsPath(protectedRoot, output)),
      "Publication output overlaps a protected input",
    );
  }
  const workIds = workIdsSchema.parse(options.workIds).sort();
  assert.equal(new Set(workIds).size, workIds.length, "Duplicate target work");
  const readbackPath = resolve(options.readback ?? join(publicationRoot, "READBACK.json"));
  const readbackBytes = readFileSync(readbackPath);
  const readback = readbackSchema.parse(JSON.parse(readbackBytes.toString("utf8")));
  assert.deepEqual(
    [...readback.targetWorkIds].sort(),
    workIds,
    "Readback batch target set differs",
  );
  const candidateSource = join(publicationRoot, "data/source");
  assert.equal(
    sha256(readFileSync(join(candidateSource, "catalog.sqlite"))),
    readback.catalogSha256,
    "Candidate readback identity mismatch",
  );
  const requestSha256 = sha256(
    JSON.stringify({ publicationRoot, workIds, readbackSha256: sha256(readbackBytes) }),
  );
  const preparedPath = join(output, "prepared.json");
  const previous = existsSync(preparedPath) ? readCanonicalPublication(preparedPath) : undefined;
  if (previous) {
    assert.equal(
      canonicalPublicationPaths(previous, preparedPath).root,
      root,
      "Existing preparation belongs to another canonical root",
    );
    const input = z
      .object({
        publicationRoot: z.string(),
        readbackPath: z.string(),
        readbackSha256: z.string().regex(/^[a-f0-9]{64}$/u),
        workIds: workIdsSchema,
      })
      .parse(JSON.parse(readFileSync(join(output, "input.json"), "utf8")));
    assert.equal(resolveCanonicalPath(input.publicationRoot, root), publicationRoot);
    assert.equal(resolveCanonicalPath(input.readbackPath, root), readbackPath);
    assert.equal(
      input.readbackSha256,
      sha256(readbackBytes),
      "Existing preparation readback changed",
    );
    assert.deepEqual([...input.workIds].sort(), workIds, "Existing preparation target set changed");
    assert.equal(
      previous.requestSha256,
      sha256(
        JSON.stringify({
          publicationRoot: input.publicationRoot,
          workIds,
          readbackSha256: input.readbackSha256,
        }),
      ),
      "Existing preparation belongs to another request",
    );
    if (existsSync(canonicalPendingPath(root)) || existsSync(join(output, "completion.json")))
      return previous;
  }
  // Old sealed publications retain their recovery contract. Every new preparation must bind
  // the policy bytes actually checked by readback, even when the canonical DB did not change.
  const policySnapshots = CANONICAL_POLICY_PATHS.map((path) => {
    const bindings = readback.executionIdentity?.files.filter((entry) => entry.path === path) ?? [];
    assert.equal(bindings.length, 1, `Readback must bind exactly one current policy: ${path}`);
    const guard = bindings[0]!;
    const bytes = readFileSync(join(root, path));
    assert.equal(
      sha256(bytes),
      guard.sha256,
      `Canonical policy changed after batch verification: ${path}`,
    );
    return { ...guard, bytes };
  });
  const policyGuards = policySnapshots.map(({ path, sha256: checksum }) => ({
    path,
    sha256: checksum,
  }));
  if (previous) {
    for (const guard of policyGuards)
      assert.deepEqual(
        previous.guards.filter((entry) => entry.path === guard.path),
        [guard],
        `Existing preparation lacks current policy guard; prepare with refreshed readback: ${guard.path}`,
      );
    return previous;
  }
  const beginning = { publicationRoot, root, requestSha256 };
  const beginningPath = join(output, "begin.json");
  if (existsSync(output)) {
    assert(existsSync(beginningPath), "Use a new canonical publication output directory");
    const savedBeginning = z
      .strictObject({
        publicationRoot: z.string(),
        root: z.string(),
        requestSha256: z.string().regex(/^[a-f0-9]{64}$/u),
      })
      .parse(JSON.parse(readFileSync(beginningPath, "utf8")));
    assert.equal(resolveCanonicalPath(savedBeginning.root, root), root);
    assert.equal(resolveCanonicalPath(savedBeginning.publicationRoot, root), publicationRoot);
    assert.equal(
      savedBeginning.requestSha256,
      sha256(
        JSON.stringify({
          publicationRoot: savedBeginning.publicationRoot,
          workIds,
          readbackSha256: sha256(readbackBytes),
        }),
      ),
      "Interrupted preparation belongs to another request",
    );
    rmSync(join(output, "candidate"), { recursive: true, force: true });
  } else writeDurableJson(beginningPath, beginning);
  const source = join(root, "data/source");
  const originalDatabaseSha256 = sha256(readFileSync(join(source, "catalog.sqlite")));
  assert.equal(
    originalDatabaseSha256,
    readback.canonicalSha256,
    "Canonical advanced after batch verification; validate target dependencies and refresh readback before preparing",
  );
  if (options.expectedCanonicalSha256)
    assert.equal(
      originalDatabaseSha256,
      options.expectedCanonicalSha256,
      "Canonical baseline changed",
    );
  const { sourceData: current, ...before } = verifyCatalogAuthority(root, {
    includeSourceData: true,
  });
  const { sourceData: candidate } = verifyCatalogAuthority(publicationRoot, {
    includeSourceData: true,
  });
  assert(current && candidate);
  const scopeCorrections = new Map<string, ScopeCorrection>();
  const scopeResultManifests = new Map<string, string>();
  const scopeReviewReferences = new Set<string>();
  for (const binding of readback.scopeCorrections) {
    const artifact = readScopeCorrections(resolveCanonicalPath(binding.resultRoot, root));
    assert(artifact, "Canonical readback scope correction missing");
    assert.equal(
      artifact.binding.path,
      resolveCanonicalPath(binding.path, root),
      "Canonical scope artifact path changed",
    );
    assert.equal(artifact.binding.sha256, binding.sha256, "Canonical scope artifact SHA changed");
    assert.equal(
      artifact.binding.resultManifestSha256,
      binding.resultManifestSha256,
      "Canonical scope result manifest changed",
    );
    for (const correction of artifact.corrections) {
      assert(
        workIds.includes(correction.workId) && !scopeCorrections.has(correction.workId),
        "Invalid canonical scope target membership",
      );
      scopeCorrections.set(correction.workId, correction);
      scopeResultManifests.set(correction.workId, artifact.binding.resultManifestSha256);
    }
  }
  if (scopeCorrections.size) {
    const currentDatabase = new DatabaseSync(toNamespacedPath(join(source, "catalog.sqlite")), {
      readOnly: true,
    });
    const candidateDatabase = new DatabaseSync(
      toNamespacedPath(join(candidateSource, "catalog.sqlite")),
      { readOnly: true },
    );
    try {
      for (const [id, correction] of scopeCorrections) {
        verifyScopeBefore(correction, scopeOwnedTables(currentDatabase, id));
        scopeReviewReferences.add(
          verifyScopeAfter(
            correction,
            scopeOwnedTables(candidateDatabase, id),
            scopeResultManifests.get(id)!,
          ).reviewReference,
        );
      }
    } finally {
      currentDatabase.close();
      candidateDatabase.close();
    }
  }
  const goldBytes = readFileSync(
    join(root, "data/staging/catalog-expansion/gold-set-manifest.json"),
  );
  const gold = validateGoldSet(root, JSON.parse(goldBytes.toString("utf8")));
  assert(
    workIds.every((id) => !gold.workIds.includes(id)),
    "A canonical batch cannot replace Gold work",
  );
  const projectionRoot = join(output, "candidate");
  const projected = join(projectionRoot, "data/source");
  writeCatalogCsvProjection(source, projected);
  const works = candidate.tables.find((table) => table.path === "works.csv")!;
  const targetSet = new Set(workIds);
  const referenceIndex = column(works, "annotationReviewReference");
  const contextReviewAliases: NonNullable<ReturnType<typeof deriveCanonicalContextAudit>>[] = [];
  const handledReferences = new Set<string>();
  for (const row of works.rows.filter((entry) => targetSet.has(entry.values[0]!))) {
    const reference = row.values[referenceIndex]!;
    if (handledReferences.has(reference)) continue;
    handledReferences.add(reference);
    assert.match(reference, /^reviews\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/u);
    const destination = join(projected, reference);
    const bytes = readFileSync(join(candidateSource, reference));
    if (existsSync(destination) && sha256(readFileSync(destination)) !== sha256(bytes)) {
      const ids = works.rows.filter((r) => targetSet.has(r.values[0]!) && r.values[referenceIndex] === reference)
        .map((r) => r.values[0]!);
      assert(ids.every((id) => !scopeCorrections.has(id)), "Scope audit cannot use context review alias");
      const alias = deriveCanonicalContextAudit({ reference, current: readFileSync(destination), candidate: bytes,
        workIds: ids, evidence: candidate.tables.find((table) => table.path === "evidence/evidence.csv")!,
        priorReviewSha256: (prior) => sha256(readFileSync(join(projected, prior))) });
      const auditPath = join(projected, alias.canonicalReference);
      if (existsSync(auditPath)) assert.equal(sha256(readFileSync(auditPath)), alias.candidateSha256,
        "Canonical context audit alias already has different bytes");
      else writeFileSync(auditPath, bytes);
      contextReviewAliases.push(alias);
    } else if (!existsSync(destination)) {
      mkdirSync(dirname(destination), { recursive: true });
      copyFileSync(join(candidateSource, reference), destination);
    }
  }
  const aliases = new Map(contextReviewAliases.map((entry) => [entry.originalReference, entry.canonicalReference]));
  const projectedTables = candidate.tables.map((table) => table !== works ? table : {
    ...table, rows: table.rows.map((row) => !targetSet.has(row.values[0]!) ? row : {
      ...row, values: row.values.map((value, index) => index === referenceIndex ? aliases.get(value) ?? value : value),
    }),
  });
  const merged = mergeCanonicalTargets(current.tables, projectedTables, workIds, [...scopeCorrections.keys()]);
  for (const [path, content] of merged) writeFileSync(join(projected, path), content);
  for (const reference of scopeReviewReferences) {
    const destination = join(projected, reference);
    const bytes = readFileSync(join(candidateSource, reference));
    if (existsSync(destination))
      assert.equal(
        sha256(readFileSync(destination)),
        sha256(bytes),
        "Existing scope audit review cannot be overwritten",
      );
    else {
      mkdirSync(dirname(destination), { recursive: true });
      copyFileSync(join(candidateSource, reference), destination);
    }
  }
  // Only referenced reports belong in authority; replaced historical reports survive in rollback.
  const references = new Set<string>(CATALOG_OPAQUE_PATHS);
  for (const alias of contextReviewAliases) {
    references.add(alias.originalReference);
    references.add(alias.canonicalReference);
  }
  const currentEvidence = current.tables.find((table) => table.path === "evidence/evidence.csv")!;
  for (const reference of scopeAuditReviewReferences(
    currentEvidence.rows.map((row) =>
      Object.fromEntries(
        currentEvidence.headers.map((field, index) => [field, row.values[index]!]),
      ),
    ),
  ))
    references.add(reference);
  for (const reference of scopeReviewReferences) references.add(reference);
  const currentWorks = current.tables.find((table) => table.path === "works.csv")!;
  for (const row of currentWorks.rows.filter((entry) => !targetSet.has(entry.values[0]!)))
    references.add(row.values[referenceIndex]!);
  for (const row of works.rows.filter((entry) => targetSet.has(entry.values[0]!)))
    references.add(aliases.get(row.values[referenceIndex]!) ?? row.values[referenceIndex]!);
  for (const file of readdirSync(join(projected, "reviews"))) {
    if (!references.has(`reviews/${file}`)) rmSync(join(projected, "reviews", file));
  }
  finalizeCatalogAuthorityProjection(source, projected);
  const authority = verifyCatalogAuthority(projectionRoot);
  validateGoldSet(projectionRoot, JSON.parse(goldBytes.toString("utf8")));
  const built = buildCatalog(projectionRoot, "authority", { compact: true, verify: true });
  for (const id of workIds) {
    const work = built.catalog.works.find((row) => row.id === id);
    assert(work, `Canonical build omitted ${id}`);
    if (scopeCorrections.has(id)) {
      assert.deepEqual(
        [
          work.eligibility.onboardingEligible,
          work.eligibility.recommendationEligible,
          work.eligibility.libraryOnly,
        ],
        [false, false, true],
      );
      const profile = z
        .object({ works: z.array(z.object({ id: z.string() })) })
        .parse(
          JSON.parse(
            readFileSync(
              join(projectionRoot, "data/generated/recommendation-profile-catalog-v1.json"),
              "utf8",
            ),
          ),
        );
      assert(
        !profile.works.some((row) => row.id === id),
        "Scope-excluded canonical Work remains in recommendation profile",
      );
    } else
      assert(work.eligibility.recommendationEligible, `Canonical build omitted eligible ${id}`);
  }
  assert.equal(
    sha256(readFileSync(join(source, "catalog.sqlite"))),
    originalDatabaseSha256,
    "Canonical changed during preparation",
  );
  assert.equal(
    sha256(readFileSync(readbackPath)),
    sha256(readbackBytes),
    "Readback changed during preparation",
  );
  assert.equal(
    sha256(readFileSync(join(root, "data/staging/catalog-expansion/gold-set-manifest.json"))),
    sha256(goldBytes),
    "Gold policy changed during preparation",
  );
  for (const guard of policyGuards)
    assert.equal(
      sha256(readFileSync(join(root, guard.path))),
      guard.sha256,
      `Canonical policy changed during preparation: ${guard.path}`,
    );
  for (const snapshot of policySnapshots) {
    const path = join(output, "policies", snapshot.path);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, snapshot.bytes);
  }
  writeDurableJson(join(output, "input.json"), {
    publicationRoot,
    readbackPath,
    readbackSha256: sha256(readbackBytes),
    originalDatabaseSha256,
    workIds,
  });
  return sealCanonicalPublication(
    {
      root,
      output,
      kind: "adjudication",
      requestSha256,
      workIds,
      beforeSourceManifestDigest: before.sourceManifestDigest,
      sourceManifestDigest: authority.sourceManifestDigest,
      catalogVersion: built.catalog.catalogVersion,
      ...(contextReviewAliases.length ? { contextReviewAliases } : {}),
      guards: [
        ...policyGuards,
        {
          path: "data/staging/catalog-expansion/gold-set-manifest.json",
          sha256: sha256(goldBytes),
        },
      ],
    },
    [
      "data/source",
      ...built.artifactPaths.map((path) =>
        path.slice(projectionRoot.length + 1).replaceAll("\\", "/"),
      ),
    ],
  );
}

export function applyCanonicalApplication(
  options: Parameters<typeof prepareCanonicalApplication>[0],
) {
  prepareCanonicalApplication(options);
  return publishPreparedCanonical(join(resolve(options.output), "prepared.json"));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { values } = parseArgs({
    options: {
      "publication-root": { type: "string" },
      "work-ids": { type: "string" },
      output: { type: "string" },
      root: { type: "string" },
      readback: { type: "string" },
      "expected-canonical-sha256": { type: "string" },
      "prepare-only": { type: "boolean" },
      "commit-prepared": { type: "string" },
      "verify-completion": { type: "string" },
    },
  });
  const root = resolve(values.root ?? process.cwd());
  if (values["verify-completion"]) {
    prepareRestoredCatalogOperation(root, {
      operation: "canonical",
      action: "verify",
      outputRoot: dirname(values["verify-completion"]),
      inputPath: values["verify-completion"],
    });
    console.log(
      JSON.stringify(
        verifyCanonicalCompletion(resolveCanonicalPath(values["verify-completion"], root)),
      ),
    );
  } else if (values["commit-prepared"]) {
    const restored = prepareRestoredCatalogOperation(root, {
      operation: "canonical",
      action: "commit",
      outputRoot: dirname(values["commit-prepared"]),
      inputPath: values["commit-prepared"],
    });
    console.log(
      JSON.stringify(
        commitCanonicalPublication(
          resolveCanonicalPath(values["commit-prepared"], root),
          ({ writtenPaths, deletedPaths }) =>
            recordRestoredCatalogOperation(root, restored, writtenPaths, deletedPaths),
        ),
      ),
    );
  } else {
    assert(
      values["publication-root"] && values["work-ids"] && values.output,
      "Required: --publication-root <verified readback root> --work-ids <JSON array> --output <new or resumable directory>",
    );
    const workIds = workIdsSchema.parse(JSON.parse(values["work-ids"]));
    const restored = prepareRestoredCatalogOperation(root, {
      operation: "canonical",
      action: "prepare",
      outputRoot: values.output,
      inputPath: values.readback ?? join(values["publication-root"], "READBACK.json"),
      publicationRoot: values["publication-root"],
    });
    const options = {
      root,
      publicationRoot: resolveCanonicalPath(values["publication-root"], root),
      workIds,
      output: resolveCanonicalPath(values.output, root),
      readback: values.readback ? resolveCanonicalPath(values.readback, root) : undefined,
      expectedCanonicalSha256: values["expected-canonical-sha256"],
    };
    const preparedPath = join(options.output, "prepared.json");
    const alreadyPrepared = existsSync(preparedPath);
    const prepared = prepareCanonicalApplication(options);
    if (!alreadyPrepared) recordRestoredCatalogOperation(root, restored, [options.output]);
    console.log(
      JSON.stringify(values["prepare-only"] ? prepared : publishPreparedCanonical(preparedPath)),
    );
  }
}
