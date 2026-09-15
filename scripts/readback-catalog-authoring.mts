import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
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

const [publication, resultRoot, output] = z
  .array(z.string().min(1))
  .length(3)
  .parse(process.argv.slice(2))
  .map((p) => resolve(p));
assert(publication && resultRoot && output);
const repo = process.cwd();
const started = performance.now();
const sha = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const canonical = join(repo, "data/source/catalog.sqlite");
const canonicalSha = sha(canonical);
const candidate = join(publication, "catalog-expanded.candidate.sqlite");
const candidateSha = sha(candidate);
const registrySha = sha(join(publication, "catalog-source-registry.candidate.sqlite"));
const records = (path: string) =>
  z
    .array(z.record(z.string(), z.string()))
    .parse(parse(readFileSync(path, "utf8"), { columns: true, skip_empty_lines: true }));
const promotion = records(join(resultRoot, "chunk-01/promotion-ledger.csv"));
const targets = promotion.filter((row) => row.panelOutcome === "PASS").map((row) => row.workId!);
assert(targets.length > 0);
const ledger = records(join(resultRoot, "chunk-01/evidence-panel-ledger.csv"));
const db = new DatabaseSync(candidate, { readOnly: true });
const rowSchema = z.record(z.string(), z.string());
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
    const axes = ledger.filter((row) => row.workId === wid && row.factKey?.startsWith("axis:"));
    assert.equal(axes.length, 17);
    for (const claim of axes) {
      const fact = rowSchema.parse(
        db
          .prepare("select state,value,confidence from source_factors where workId=? and axisId=?")
          .get(wid, claim.factKey!.slice(5)),
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
    const published = join(publication, "authorized-evidence-panel-v1/data/source", reference);
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
const built = buildCatalog(output, "authority", { verify: true, compact: true });
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
  const entry = plan.find((row) => row.workId === wid);
  assert(entry, `Published work absent from recommendation plan: ${wid}`);
  assert(Number.isFinite(entry.tasteScore));
  assert(entry.contributions.length > 0);
}
assert.equal(sha(candidate), candidateSha);
assert.equal(sha(canonical), canonicalSha);
const report = {
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
writeFileSync(join(output, "READBACK.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
