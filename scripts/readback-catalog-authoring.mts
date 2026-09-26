import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, toNamespacedPath } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { parse } from "csv-parse/sync";
import { z } from "zod";
import { CATALOG_OPAQUE_PATHS, verifyCatalogAuthority } from "./catalog/authority.ts";
import { validateGoldSet } from "./validate-catalog-expansion.ts";
import { buildCatalog } from "./build-catalog.ts";
import { buildRecommendationPlan } from "../src/domain/recommendation/rank.ts";
import {
  createDefaultRecommendationPolicies,
  createEmptyProfileAdjustments,
} from "../src/infrastructure/db/validation.ts";
import { catalogV1Schema } from "../src/domain/catalog/schema.ts";
import { parseRecommendationContext } from "../src/domain/recommendation/context-schema.ts";
import { AXIS_IDS } from "../src/domain/catalog/constants.ts";
import { workSimilarity } from "../src/domain/recommendation/similarity.ts";

const argv = z.array(z.string().min(1)).parse(process.argv.slice(2));
const batchFlag = argv.indexOf("--batch-publications");
assert(batchFlag === -1 || batchFlag === argv.length - 2, "Invalid batch publication argument");
const batchPublicationPath = batchFlag === -1 ? undefined : resolve(argv[batchFlag + 1]!);
const [publication, resultRoot, output, ...additionalResults] = z
  .array(z.string().min(1))
  .min(3)
  .parse(batchFlag === -1 ? argv : argv.slice(0, batchFlag))
  .map((p) => resolve(p));
assert(publication && resultRoot && output);
const resultRoots = [...additionalResults, resultRoot];
assert.equal(process.versions.node.split(".")[0], "24", "Catalog readback requires Node 24");
const repo = process.cwd();
const executionIdentity = () => {
  const result = spawnSync(
    "python",
    ["-B", "-X", "utf8", join(repo, "scripts/catalog_readback_identity.py"), repo],
    { encoding: "utf8", windowsHide: true },
  );
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stderr);
  return z
    .strictObject({
      schemaVersion: z.literal("catalog-readback-code-v1"),
      files: z.array(
        z.strictObject({ path: z.string(), sha256: z.string().regex(/^[a-f0-9]{64}$/u) }),
      ),
    })
    .parse(JSON.parse(result.stdout));
};
const started = performance.now();
const timingsSeconds: Record<string, number> = {};
let phaseStarted = started;
const phase = (name: string) => {
  const now = performance.now();
  timingsSeconds[name] = (now - phaseStarted) / 1000;
  phaseStarted = now;
};
const codeIdentity = executionIdentity();
const sha = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const canonical = join(repo, "data/source/catalog.sqlite");
const canonicalSha = sha(canonical);
const candidate = join(publication, "catalog-expanded.candidate.sqlite");
const candidateSha = sha(candidate);
const publicationManifestSha = sha(join(publication, "MANIFEST.sha256"));
const resultManifestShas = resultRoots.map((root) =>
  sha(join(root, "chunk-01/PANEL-RESULT.sha256")),
);
const registrySha = sha(join(publication, "catalog-source-registry.candidate.sqlite"));
phase("initialIdentity");
const compact = existsSync(join(publication, "COMPACT-PUBLICATION.json"))
  ? (() => {
      const verified = spawnSync(
        "python",
        [
          "-B",
          "-X",
          "utf8",
          join(repo, "scripts/catalog_readback_identity.py"),
          "--compact",
          publication,
        ],
        { encoding: "utf8", windowsHide: true, maxBuffer: 32 * 1024 * 1024 },
      );
      if (verified.error) throw verified.error;
      assert.equal(verified.status, 0, verified.stderr);
      const value = z
        .object({
          schemaVersion: z.literal("catalog-compact-publication-v1"),
          manifestSha256: z.string(),
          works: z.record(
            z.string(),
            z.object({
              source_factors: z.array(
                z.object({
                  axisId: z.string(),
                  state: z.string(),
                  value: z.string(),
                  confidence: z.string(),
                }),
              ),
            }),
          ),
        })
        .parse(JSON.parse(verified.stdout));
      assert.equal(value.manifestSha256, publicationManifestSha);
      return value;
    })()
  : undefined;
phase("independentAuthorityReplay");
const records = (path: string) =>
  z
    .array(z.record(z.string(), z.string()))
    .parse(parse(readFileSync(path, "utf8"), { columns: true, skip_empty_lines: true }));
const promotionsByRoot = resultRoots.map((root) =>
  records(join(root, "chunk-01/promotion-ledger.csv")),
);
const batchPublications = batchPublicationPath
  ? z
      .strictObject({
        works: z.array(
          z.strictObject({
            workId: z.string().min(1),
            publicationRoot: z.string().min(1),
            resultRoot: z.string().min(1),
          }),
        ),
      })
      .parse(JSON.parse(readFileSync(batchPublicationPath, "utf8")))
  : undefined;
if (batchPublications) {
  assert.equal(batchPublications.works.length, resultRoots.length);
  assert.deepEqual(
    batchPublications.works.map((row) => resolve(row.resultRoot)),
    resultRoots,
    "Batch result roots changed",
  );
}
const promotion = promotionsByRoot.flat();
const targets = promotion.filter((row) => row.panelOutcome === "PASS").map((row) => row.workId!);
assert(targets.length > 0);
assert.equal(new Set(targets).size, targets.length, "Duplicate batch target");
if (compact)
  assert.deepEqual(
    Object.keys(compact.works).sort(),
    [...targets].sort(),
    "Compact target set differs",
  );
const ledger = resultRoots.flatMap((root) =>
  records(join(root, "chunk-01/evidence-panel-ledger.csv")),
);
const db = new DatabaseSync(toNamespacedPath(candidate), { readOnly: true });
const rowSchema = z.record(z.string(), z.string());
const expectedAxes = new Map<string, Map<string, z.infer<typeof rowSchema>>>();
let counts;
try {
  assert.equal(db.prepare("pragma integrity_check").get()?.integrity_check, "ok");
  assert.equal(db.prepare("pragma foreign_key_check").all().length, 0);
  for (const wid of targets) {
    const work = rowSchema.parse(
      db
        .prepare(
          "select recommendationEligible,libraryOnly,annotationReviewMethod from source_works where id=?",
        )
        .get(wid),
    );
    assert.equal(work.recommendationEligible, "true");
    assert.equal(work.libraryOnly, "false");
    assert.equal(work.annotationReviewMethod, "authorizedEvidencePanel");
    const claims = ledger.filter((row) => row.workId === wid && row.factKey?.startsWith("axis:"));
    assert.equal(claims.length, 17);
    let axes = new Map(
      claims.map((claim) => [
        claim.factKey!.slice(5),
        rowSchema.parse({
          state: claim.state!,
          value: claim.value!,
          confidence: claim.confidence!,
        }),
      ]),
    );
    const batchPublication = batchPublications?.works.find((row) => row.workId === wid);
    if (compact) {
      axes = new Map(compact.works[wid]!.source_factors.map((fact) => [fact.axisId, fact]));
      assert.equal(axes.size, 17, `Verified compact Axis snapshot mismatch: ${wid}`);
    } else if (batchPublication) {
      const published = new DatabaseSync(
        toNamespacedPath(
          join(resolve(batchPublication.publicationRoot), "catalog-expanded.candidate.sqlite"),
        ),
        { readOnly: true },
      );
      try {
        axes = new Map(
          z
            .array(rowSchema)
            .parse(
              published
                .prepare("select axisId,state,value,confidence from source_factors where workId=?")
                .all(wid),
            )
            .map((fact) => [fact.axisId!, fact]),
        );
      } finally {
        published.close();
      }
      assert.equal(axes.size, 17, `Published Axis snapshot mismatch: ${wid}`);
    }
    expectedAxes.set(wid, axes);
    for (const [axis, claim] of axes) {
      const fact = rowSchema.parse(
        db
          .prepare("select state,value,confidence from source_factors where workId=? and axisId=?")
          .get(wid, axis),
      );
      for (const key of ["state", "value", "confidence"]) assert.equal(fact[key], claim[key]);
    }
  }
  counts = z
    .object({ works: z.number(), eligible: z.number(), libraryOnly: z.number() })
    .parse(
      db
        .prepare(
          "select count(*) works,sum(recommendationEligible='true') eligible,sum(libraryOnly='true') libraryOnly from source_works",
        )
        .get(),
    );
  const references = z
    .array(z.object({ annotationReviewReference: z.string() }))
    .parse(
      db
        .prepare(
          "select distinct annotationReviewReference from source_works where annotationReviewReference<>''",
        )
        .all(),
    );
  const source = join(output, "data/source");
  mkdirSync(source, { recursive: true });
  copyFileSync(candidate, join(source, "catalog.sqlite"));
  // Copy the exact fixed/referenced files from this publication, without an old validation template.
  for (const reference of new Set([
    ...CATALOG_OPAQUE_PATHS,
    ...references.map((r) => r.annotationReviewReference),
  ])) {
    assert(
      CATALOG_OPAQUE_PATHS.some((path) => path === reference) ||
        /^reviews\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/u.test(reference),
    );
    const published = join(
      publication,
      compact || existsSync(join(publication, "CURATION-BASELINE.json"))
        ? "data/source"
        : "authorized-evidence-panel-v1/data/source",
      reference,
    );
    const origin = existsSync(published) ? published : join(repo, "data/source", reference);
    const destination = join(source, reference);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(origin, destination);
    assert.equal(sha(origin), sha(destination));
  }
} finally {
  db.close();
}
const authority = verifyCatalogAuthority(output);
const gold = validateGoldSet(
  output,
  JSON.parse(
    readFileSync(join(repo, "data/staging/catalog-expansion/gold-set-manifest.json"), "utf8"),
  ),
);
phase("sqlGoldAndAuthority");
const built = buildCatalog(output, "authority", { verify: true, compact: true });
phase("buildAndCoverage");
// Exercise the product engine with the existing representative taste profile.
const catalog = catalogV1Schema.parse(
  JSON.parse(
    readFileSync(join(output, "data/generated/recommendation-profile-catalog-v1.json"), "utf8"),
  ),
);
const context = parseRecommendationContext(
  JSON.parse(
    readFileSync(join(output, "data/generated/recommendation-profile-context-v1.json"), "utf8"),
  ),
);
const plan = buildRecommendationPlan({
  catalog,
  context,
  records: [
    {
      workId: "naruto",
      readingState: "completed",
      reaction: "favorite",
      updatedAt: "2026-09-14T00:00:00.000Z",
    },
    {
      workId: "spy-family",
      readingState: "completed",
      reaction: "liked",
      updatedAt: "2026-09-14T00:00:00.000Z",
    },
  ],
  adjustments: createEmptyProfileAdjustments(),
  policies: createDefaultRecommendationPolicies(),
});
for (const wid of targets) {
  const work = catalog.works.find((row) => row.id === wid);
  assert(work, `Published work absent from compiled catalog: ${wid}`);
  if (
    promotion.find((row) => row.workId === wid)?.reasonCode === "NARRATIVE_TONE_RESEARCH_EXHAUSTED"
  ) {
    const source = resultRoots.find((_, index) =>
      promotionsByRoot[index]!.some((row) => row.workId === wid && row.panelOutcome === "PASS"),
    );
    assert(source);
    assert.equal(work.eligibility.narrativeToneException?.workId, wid);
    assert.equal(
      work.eligibility.narrativeToneException?.inputManifestSha256,
      sha(join(source, "chunk-01/PANEL-INPUT.sha256")),
    );
    // Eligibility metadata cannot change similarity, coverage or contributions.
    const { narrativeToneException, ...ordinaryEligibility } = work.eligibility;
    assert(narrativeToneException);
    assert.deepEqual(
      workSimilarity(work, work),
      workSimilarity({ ...work, eligibility: ordinaryEligibility }, work),
    );
  }
  for (const [axisId, fact] of expectedAxes.get(wid) ?? []) {
    if (fact.state !== "unknown") continue;
    const axis = z.enum(AXIS_IDS).parse(axisId);
    assert.deepEqual(work.axes[axis], { state: "unknown" });
  }
  const entry = plan.find((row) => row.workId === wid);
  assert(entry, `Published work absent from recommendation plan: ${wid}`);
  assert(Number.isFinite(entry.tasteScore));
  assert(entry.contributions.length > 0);
}
phase("engineAndUnknownChecks");
assert.equal(sha(candidate), candidateSha);
assert.equal(sha(canonical), canonicalSha);
assert.equal(sha(join(publication, "catalog-source-registry.candidate.sqlite")), registrySha);
assert.deepEqual(executionIdentity(), codeIdentity, "Readback execution inputs changed");
assert.equal(sha(join(publication, "MANIFEST.sha256")), publicationManifestSha);
assert.deepEqual(
  resultRoots.map((root) => sha(join(root, "chunk-01/PANEL-RESULT.sha256"))),
  resultManifestShas,
);
const report = {
  executionIdentity: codeIdentity,
  publicationManifestSha256: publicationManifestSha,
  resultManifestSha256: resultManifestShas.at(-1),
  resultRoots: resultRoots.map((root, index) => ({ root, sha256: resultManifestShas[index] })),
  batchPublications: batchPublicationPath
    ? {
        path: batchPublicationPath,
        sha256: sha(batchPublicationPath),
        works: batchPublications!.works.map((row) => ({
          ...row,
          publicationManifestSha256: sha(join(resolve(row.publicationRoot), "MANIFEST.sha256")),
        })),
      }
    : undefined,
  artifacts: built.artifactPaths.map((path) => ({
    path: relative(output, path).replaceAll("\\", "/"),
    sha256: sha(path),
  })),
  status: "SQL_BUILD_COVERAGE_ENGINE_VERIFIED",
  publicationRoot: publication,
  resultRoot,
  targetWorkIds: targets,
  catalogSha256: candidateSha,
  registrySha256: registrySha,
  canonicalSha256: canonicalSha,
  catalogVersion: built.catalog.catalogVersion,
  counts,
  goldWorks: gold.workCount,
  authority: { tables: authority.tables, opaqueFiles: authority.opaqueFiles },
  engine: { entryPoint: "buildRecommendationPlan", planCount: plan.length },
  verifiedAt: new Date().toISOString(),
  elapsedSeconds: (performance.now() - started) / 1000,
};
phase("finalIdentityAndArtifacts");
writeFileSync(join(output, "READBACK.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ readbackTimingsSeconds: timingsSeconds }));
console.log(JSON.stringify(report));
