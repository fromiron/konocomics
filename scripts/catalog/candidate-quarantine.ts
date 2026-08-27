import { z } from "zod";

import { AXIS_IDS, GENRE_TAGS, THEME_TAGS } from "../../src/domain/catalog/constants";

export const MODEL_DERIVED_WRITE_QUARANTINE_ERROR =
  "Model-derived authoring writes are quarantined in S3; legacy data is read-only and S6 authority cutover requires separate user approval";

const sha256 = z.string().regex(/^[a-f0-9]{64}$/u);
const nonblank = z.string().refine((value) => value.trim().length > 0, "Must be nonblank");
const catalogId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const candidateKind = z.enum(["factor", "theme", "genre"]);
const factKey = z
  .string()
  .regex(
    /^work:([a-z0-9]+(?:-[a-z0-9]+)*):(factor|theme|genre):([A-Za-z0-9]+)$/u,
    "Must be a closed work factor/theme/genre fact key",
  );
const citation = z.url();
const claimInput = z.strictObject({
  factKey,
  candidateValue: nonblank,
  confidence: nonblank.optional(),
  citations: z.array(citation).min(1),
});
const attemptInput = z.strictObject({
  attemptId: sha256,
  provider: nonblank,
  model: nonblank,
  sourceManifestDigest: sha256,
  requestSha256: sha256,
  responseSha256: sha256,
  claims: z.array(claimInput).min(1),
});

const attemptRow = z.strictObject({
  attemptId: sha256,
  provider: z.string(),
  model: z.string(),
  sourceManifestDigest: sha256,
  requestSha256: sha256,
  responseSha256: sha256,
});
const claimRow = z.strictObject({
  claimOrdinal: z.number().int().min(1),
  factKey: z.string(),
  candidateValue: z.string(),
  confidence: z.string().nullable(),
  citationsJson: z.string(),
});

type CanonicalClaim = z.infer<typeof claimRow>;
export type CanonicalCandidateReadback = {
  attempt: z.infer<typeof attemptRow>;
  claims: CanonicalClaim[];
};

type SQLiteValue = string | number | null;
type CandidateDatabase = {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...values: SQLiteValue[]): unknown;
    get(...values: SQLiteValue[]): unknown;
    all(...values: SQLiteValue[]): unknown[];
  };
};

const axisIds = new Set<string>(AXIS_IDS);
const themeTags = new Set<string>(THEME_TAGS);
const genreTags = new Set<string>(GENRE_TAGS);

function compareCodeUnit(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function canonicalClaims(claims: z.infer<typeof claimInput>[]) {
  const unique = new Map<string, Omit<CanonicalClaim, "claimOrdinal">>();
  for (const claim of claims) {
    const citationsJson = JSON.stringify([...new Set(claim.citations)].sort(compareCodeUnit));
    const canonical = {
      factKey: claim.factKey,
      candidateValue: claim.candidateValue,
      confidence: claim.confidence ?? null,
      citationsJson,
    };
    unique.set(JSON.stringify(Object.values(canonical)), canonical);
  }
  return [...unique.values()]
    .sort((left, right) =>
      compareCodeUnit(JSON.stringify(Object.values(left)), JSON.stringify(Object.values(right))),
    )
    .map((claim, index) => ({ claimOrdinal: index + 1, ...claim }));
}

function assertFactKeys(db: CandidateDatabase, claims: readonly CanonicalClaim[]) {
  const workCount = db.prepare("SELECT count(*) AS count FROM source_works WHERE id = ?");
  const seenWorks = new Set<string>();
  for (const claim of claims) {
    const match = factKey.safeParse(claim.factKey);
    if (!match.success) throw match.error;
    const parts = match.data.match(
      /^work:([a-z0-9]+(?:-[a-z0-9]+)*):(factor|theme|genre):([A-Za-z0-9]+)$/u,
    );
    if (parts === null) throw new Error(`Invalid candidate fact key: ${claim.factKey}`);
    const workId = catalogId.parse(parts[1]);
    const kind = candidateKind.parse(parts[2]);
    const member = nonblank.parse(parts[3]);
    const vocabulary = kind === "factor" ? axisIds : kind === "theme" ? themeTags : genreTags;
    if (!vocabulary.has(member)) throw new Error(`Unknown ${kind} candidate key: ${member}`);
    if (!seenWorks.has(workId)) {
      const row = z.object({ count: z.number().int() }).parse(workCount.get(workId));
      if (row.count !== 1) throw new Error(`Candidate work must match one source row: ${workId}`);
      seenWorks.add(workId);
    }
  }
}

export function assertLegacyModelWriteMode(mode: unknown): void {
  if (mode !== "check") rejectModelDerivedAuthoringWrite();
}

export function rejectModelDerivedAuthoringWrite(): void {
  throw new Error(MODEL_DERIVED_WRITE_QUARANTINE_ERROR);
}

export function readModelAttempt(
  db: CandidateDatabase,
  attemptId: string,
): CanonicalCandidateReadback {
  const attempt = attemptRow.parse(
    db
      .prepare(
        `SELECT attempt_id AS attemptId, provider, model,
          source_manifest_digest AS sourceManifestDigest,
          request_sha256 AS requestSha256, response_sha256 AS responseSha256
        FROM model_attempt WHERE attempt_id = ?`,
      )
      .get(attemptId),
  );
  const claims = z.array(claimRow).parse(
    db
      .prepare(
        `SELECT claim_ordinal AS claimOrdinal, fact_key AS factKey,
          candidate_value AS candidateValue, confidence, citations_json AS citationsJson
        FROM claim_candidate WHERE attempt_id = ? ORDER BY claim_ordinal`,
      )
      .all(attemptId),
  );
  return { attempt, claims };
}

export function ingestModelAttempt(
  db: CandidateDatabase,
  input: unknown,
): CanonicalCandidateReadback {
  const parsed = attemptInput.parse(input);
  const imported = z
    .object({ sourceManifestDigest: sha256 })
    .parse(
      db
        .prepare(
          "SELECT source_manifest_digest AS sourceManifestDigest FROM source_import WHERE id = 1",
        )
        .get(),
    );
  if (parsed.sourceManifestDigest !== imported.sourceManifestDigest) {
    throw new Error("Candidate source manifest does not match the imported shadow");
  }
  const claims = canonicalClaims(parsed.claims);
  assertFactKeys(db, claims);
  const expected = {
    attempt: {
      attemptId: parsed.attemptId,
      provider: parsed.provider,
      model: parsed.model,
      sourceManifestDigest: parsed.sourceManifestDigest,
      requestSha256: parsed.requestSha256,
      responseSha256: parsed.responseSha256,
    },
    claims,
  };

  db.exec("SAVEPOINT candidate_ingest");
  try {
    db.prepare(
      `INSERT INTO model_attempt (
        attempt_id, provider, model, source_manifest_digest, request_sha256, response_sha256
      ) VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(
      parsed.attemptId,
      parsed.provider,
      parsed.model,
      parsed.sourceManifestDigest,
      parsed.requestSha256,
      parsed.responseSha256,
    );
    const insertClaim = db.prepare(
      `INSERT INTO claim_candidate (
        attempt_id, claim_ordinal, fact_key, candidate_value, confidence, citations_json
      ) VALUES (?, ?, ?, ?, ?, ?)`,
    );
    for (const claim of claims) {
      insertClaim.run(
        parsed.attemptId,
        claim.claimOrdinal,
        claim.factKey,
        claim.candidateValue,
        claim.confidence,
        claim.citationsJson,
      );
    }
    const readback = readModelAttempt(db, parsed.attemptId);
    if (JSON.stringify(readback) !== JSON.stringify(expected)) {
      throw new Error("Candidate readback does not match the canonical insert");
    }
    db.exec("RELEASE candidate_ingest");
    return readback;
  } catch (error) {
    db.exec("ROLLBACK TO candidate_ingest; RELEASE candidate_ingest");
    throw error;
  }
}
