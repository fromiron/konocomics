import { createHash } from "node:crypto";

import { z } from "zod";

import { AXIS_IDS, GENRE_TAGS, THEME_TAGS } from "../../src/domain/catalog/constants";
import { compareCodeUnit } from "./promotion-judgment";
import { factorSourceRowSchema, themeSourceRowSchema } from "./source-schema";

export const LEGACY_CUTOFF_BASELINE_COMMIT = "b8463b31ff58332fee8762dccb733ac902982cea";
export const LEGACY_CUTOFF_SOURCE_MANIFEST =
  "adf3f21c1be5ce6cb5691bd97cb4a03dc1bfd828c76697445621c9bf12171542";
export const EMPTY_CITATION_SET_DIGEST =
  "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945";
export const LEGACY_SNAPSHOT_REASON = "LEGACY_SNAPSHOT_CUTOFF";

export const LEGACY_RESOLUTION_COUNTS = {
  accepted: 24_250,
  explicitUnknown: 8_985,
  notApplicable: 0,
  rejected: 0,
  manualReview: 0,
  total: 33_235,
} as const;

const catalogId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const digest = z.string().regex(/^[a-f0-9]{64}$/u);
const resolutionState = z.enum([
  "accepted",
  "explicitUnknown",
  "notApplicable",
  "rejected",
  "manualReview",
]);
const valueType = z.enum(["integer", "boolean", "none"]);
const factKey = z
  .string()
  .regex(/^work:([a-z0-9]+(?:-[a-z0-9]+)*):(factor|theme|genre):([A-Za-z0-9]+)$/u);
const rawWorkRow = z.strictObject({ id: catalogId, genres: z.string() });
const rawFactorRow = z.strictObject({
  workId: z.string(),
  axisId: z.string(),
  state: z.string(),
  value: z.string(),
  confidence: z.string(),
  evidenceId: z.string(),
});
const rawThemeRow = z.strictObject({
  workId: z.string(),
  themeId: z.string(),
  centrality: z.string(),
  confidence: z.string(),
  evidenceId: z.string(),
});
const resolutionRow = z.strictObject({
  factKey,
  state: resolutionState,
  valueType,
  lexicalValue: z.string(),
  authorityKind: z.literal("legacySnapshot"),
  authorityArtifactDigest: z.literal(LEGACY_CUTOFF_SOURCE_MANIFEST),
  citationSetDigest: z.literal(EMPTY_CITATION_SET_DIGEST),
  reasonCode: z.literal(LEGACY_SNAPSHOT_REASON),
});
const sourceImportRow = z.strictObject({
  baselineCommit: z.string(),
  sourceManifestDigest: digest,
});

type ResolutionRow = z.infer<typeof resolutionRow>;
type SQLiteValue = string | number | null;
type ResolutionDatabase = {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...values: SQLiteValue[]): unknown;
    get(...values: SQLiteValue[]): unknown;
    all(...values: SQLiteValue[]): unknown[];
  };
};
export type ResolutionTuple = readonly [
  factKey: string,
  state: z.infer<typeof resolutionState>,
  valueType: z.infer<typeof valueType>,
  lexicalValue: string,
  authorityKind: "legacySnapshot",
  authorityArtifactDigest: typeof LEGACY_CUTOFF_SOURCE_MANIFEST,
  citationSetDigest: typeof EMPTY_CITATION_SET_DIGEST,
  reasonCode: typeof LEGACY_SNAPSHOT_REASON,
];

function sha256Json(value: unknown) {
  return createHash("sha256")
    .update(Buffer.from(JSON.stringify(value), "utf8"))
    .digest("hex");
}

function parseFactKey(value: string) {
  const match = factKey
    .parse(value)
    .match(/^work:([a-z0-9]+(?:-[a-z0-9]+)*):(factor|theme|genre):([A-Za-z0-9]+)$/u);
  if (match === null) throw new Error(`Invalid resolution fact key: ${value}`);
  return { workId: match[1]!, kind: match[2]!, member: match[3]! } as const;
}

function assertResolutionEncoding(row: ResolutionRow) {
  const key = parseFactKey(row.factKey);
  const vocabulary =
    key.kind === "factor" ? AXIS_IDS : key.kind === "theme" ? THEME_TAGS : GENRE_TAGS;
  if (!vocabulary.some((member) => member === key.member)) {
    throw new Error(`Unknown ${key.kind} resolution key: ${key.member}`);
  }
  if (row.state === "notApplicable" && (key.kind !== "factor" || key.member !== "motionImpact")) {
    throw new Error("notApplicable is only defined for motionImpact in factor dictionary v1");
  }
  if (row.state !== "accepted") {
    if (row.valueType !== "none" || row.lexicalValue !== "") {
      throw new Error("Value-less resolution states require none and an empty lexical value");
    }
    return;
  }
  const valid =
    (key.kind === "factor" &&
      row.valueType === "integer" &&
      ["0", "1", "2", "3", "4"].includes(row.lexicalValue)) ||
    (key.kind === "theme" &&
      row.valueType === "integer" &&
      ["1", "2"].includes(row.lexicalValue)) ||
    (key.kind === "genre" && row.valueType === "boolean" && row.lexicalValue === "true");
  if (!valid) throw new Error(`Resolution value does not match its fact kind: ${row.factKey}`);
}

function toTuple(row: ResolutionRow): ResolutionTuple {
  return [
    row.factKey,
    row.state,
    row.valueType,
    row.lexicalValue,
    row.authorityKind,
    row.authorityArtifactDigest,
    row.citationSetDigest,
    row.reasonCode,
  ];
}

export function canonicalResolutionSnapshot(values: readonly unknown[]) {
  const rows = values.map((value) => resolutionRow.parse(value));
  const factKeys = new Set<string>();
  for (const row of rows) {
    assertResolutionEncoding(row);
    if (factKeys.has(row.factKey)) throw new Error(`Duplicate resolution fact key: ${row.factKey}`);
    factKeys.add(row.factKey);
  }
  const tuples = rows
    .map(toTuple)
    .sort((left, right) => compareCodeUnit(JSON.stringify(left), JSON.stringify(right)));
  const acceptedTuples = tuples.filter(
    (tuple) =>
      tuple[1] === "accepted" || tuple[1] === "explicitUnknown" || tuple[1] === "notApplicable",
  );
  const states = Object.fromEntries(
    resolutionState.options.map((state) => [
      state,
      tuples.filter((tuple) => tuple[1] === state).length,
    ]),
  ) as Record<z.infer<typeof resolutionState>, number>;
  return {
    tuples,
    states,
    acceptedFactsDigest: sha256Json(acceptedTuples),
    resolutionSetDigest: sha256Json(tuples),
  };
}

export function readResolutionSnapshot(db: ResolutionDatabase) {
  return canonicalResolutionSnapshot(
    db
      .prepare(
        `SELECT fact_key AS factKey, state, value_type AS valueType,
          lexical_value AS lexicalValue, authority_kind AS authorityKind,
          authority_artifact_digest AS authorityArtifactDigest,
          citation_set_digest AS citationSetDigest, reason_code AS reasonCode
        FROM fact_resolution`,
      )
      .all(),
  );
}

function legacyRow(
  factKeyValue: string,
  state: ResolutionRow["state"],
  valueTypeValue: ResolutionRow["valueType"],
  lexicalValue: string,
): ResolutionRow {
  return {
    factKey: factKeyValue,
    state,
    valueType: valueTypeValue,
    lexicalValue,
    authorityKind: "legacySnapshot",
    authorityArtifactDigest: LEGACY_CUTOFF_SOURCE_MANIFEST,
    citationSetDigest: EMPTY_CITATION_SET_DIGEST,
    reasonCode: LEGACY_SNAPSHOT_REASON,
  };
}

function readLegacyRows(db: ResolutionDatabase) {
  const works = db
    .prepare('SELECT "id", "genres" FROM source_works ORDER BY "sourceOrdinal"')
    .all()
    .map((row) => rawWorkRow.parse(row));
  if (works.length !== 1_614) throw new Error("Legacy cutoff requires exactly 1,614 Works");
  const workIds = new Set<string>();
  const rows: ResolutionRow[] = [];
  let genreCount = 0;
  for (const work of works) {
    if (workIds.has(work.id)) throw new Error(`Duplicate legacy Work: ${work.id}`);
    workIds.add(work.id);
    const genres = work.genres === "" ? [] : work.genres.split(";");
    if (genres.some((genre) => genre === "" || genre.trim() !== genre)) {
      throw new Error(`Noncanonical Genre list: ${work.id}`);
    }
    const parsedGenres = z.array(z.enum(GENRE_TAGS)).parse(genres);
    if (new Set(parsedGenres).size !== parsedGenres.length) {
      throw new Error(`Duplicate Genre membership: ${work.id}`);
    }
    for (const genre of parsedGenres) {
      rows.push(legacyRow(`work:${work.id}:genre:${genre}`, "accepted", "boolean", "true"));
      genreCount += 1;
    }
  }
  if (genreCount !== 3_232) throw new Error("Legacy cutoff Genre count drift");

  const factorKeys = new Set<string>();
  const axesByWork = new Map<string, Set<string>>();
  const factors = db
    .prepare(
      `SELECT "workId", "axisId", "state", "value", "confidence", "evidenceId"
      FROM source_factors ORDER BY "sourceOrdinal"`,
    )
    .all();
  if (factors.length !== works.length * AXIS_IDS.length) {
    throw new Error("Legacy cutoff requires exactly one Factor per Work and Axis");
  }
  for (const value of factors) {
    const raw = rawFactorRow.parse(value);
    const factor = factorSourceRowSchema.parse(raw);
    if (!workIds.has(factor.workId))
      throw new Error(`Factor references unknown Work: ${factor.workId}`);
    const key = `work:${factor.workId}:factor:${factor.axisId}`;
    if (factorKeys.has(key)) throw new Error(`Duplicate legacy Factor: ${key}`);
    factorKeys.add(key);
    const axes = axesByWork.get(factor.workId) ?? new Set<string>();
    axes.add(factor.axisId);
    axesByWork.set(factor.workId, axes);
    if (factor.state === "known") {
      if (raw.value !== String(factor.value)) throw new Error(`Noncanonical Factor value: ${key}`);
      rows.push(legacyRow(key, "accepted", "integer", raw.value));
    } else {
      rows.push(
        legacyRow(
          key,
          factor.state === "unknown" ? "explicitUnknown" : "notApplicable",
          "none",
          "",
        ),
      );
    }
  }
  for (const workId of workIds) {
    const axes = axesByWork.get(workId);
    if (axes?.size !== AXIS_IDS.length || AXIS_IDS.some((axisId) => !axes.has(axisId))) {
      throw new Error(`Legacy Factor matrix is incomplete: ${workId}`);
    }
  }

  const themeKeys = new Set<string>();
  const themes = db
    .prepare(
      `SELECT "workId", "themeId", "centrality", "confidence", "evidenceId"
      FROM source_themes ORDER BY "sourceOrdinal"`,
    )
    .all();
  if (themes.length !== 2_565) throw new Error("Legacy cutoff Theme count drift");
  for (const value of themes) {
    const raw = rawThemeRow.parse(value);
    const theme = themeSourceRowSchema.parse(raw);
    if (!workIds.has(theme.workId))
      throw new Error(`Theme references unknown Work: ${theme.workId}`);
    const key = `work:${theme.workId}:theme:${theme.themeId}`;
    if (themeKeys.has(key)) throw new Error(`Duplicate legacy Theme: ${key}`);
    themeKeys.add(key);
    if (raw.centrality !== String(theme.centrality)) {
      throw new Error(`Noncanonical Theme centrality: ${key}`);
    }
    rows.push(legacyRow(key, "accepted", "integer", raw.centrality));
  }

  const snapshot = canonicalResolutionSnapshot(rows);
  if (
    snapshot.tuples.length !== LEGACY_RESOLUTION_COUNTS.total ||
    resolutionState.options.some(
      (state) => snapshot.states[state] !== LEGACY_RESOLUTION_COUNTS[state],
    )
  ) {
    throw new Error("Legacy resolution cutoff counts drifted");
  }
  if (snapshot.acceptedFactsDigest !== snapshot.resolutionSetDigest) {
    throw new Error("The current legacy cutoff must contain only accepted fact states");
  }
  return { rows, snapshot };
}

export function bootstrapLegacySnapshot(
  db: ResolutionDatabase,
  recomputeLiveSourceManifest: () => string,
) {
  const existing = z
    .object({ count: z.number().int().nonnegative() })
    .parse(db.prepare("SELECT count(*) AS count FROM fact_resolution").get());
  if (existing.count !== 0) throw new Error("Legacy resolution bootstrap requires an empty table");

  const imported = sourceImportRow.parse(
    db
      .prepare(
        `SELECT baseline_commit AS baselineCommit,
          source_manifest_digest AS sourceManifestDigest
        FROM source_import WHERE id = 1`,
      )
      .get(),
  );
  const expected = readLegacyRows(db);
  const liveSourceManifestDigest = digest.parse(recomputeLiveSourceManifest());
  if (
    imported.baselineCommit !== LEGACY_CUTOFF_BASELINE_COMMIT ||
    imported.sourceManifestDigest !== LEGACY_CUTOFF_SOURCE_MANIFEST ||
    liveSourceManifestDigest !== LEGACY_CUTOFF_SOURCE_MANIFEST
  ) {
    throw new Error("Legacy resolution source does not match the fixed cutoff manifest");
  }

  db.exec("SAVEPOINT legacy_resolution_bootstrap");
  try {
    const insert = db.prepare(
      `INSERT INTO fact_resolution (
        fact_key, state, value_type, lexical_value, authority_kind,
        authority_artifact_digest, citation_set_digest, reason_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    for (const row of expected.rows) insert.run(...toTuple(row));
    const readback = readResolutionSnapshot(db);
    if (JSON.stringify(readback) !== JSON.stringify(expected.snapshot)) {
      throw new Error("Legacy resolution readback does not match the canonical bootstrap");
    }
    db.exec("RELEASE legacy_resolution_bootstrap");
    return readback;
  } catch (error) {
    db.exec("ROLLBACK TO legacy_resolution_bootstrap; RELEASE legacy_resolution_bootstrap");
    throw error;
  }
}
