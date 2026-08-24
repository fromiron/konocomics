# Pilot 001 Art confidence-only Pass C

## Identity and authorization boundary

- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Frozen value source: `data/staging/catalog-expansion/pilots/pilot-001/reviews/art-final-matrix.csv`
- Frozen matrix SHA-256 at review time: `c02457eab38b2b00ec381880abf9eb31077f70ace82401f99b10463d4ce03fa6`
- Output CSV SHA-256: `72f039e312259ba2c63485e9eac71544a0ff34292206badaff9d1642016cee4f`
- Reviewer provenance: `reviewedByHuman=false` (Local Codex model adjudication; not human validation)
- Scope: confidence metadata only. No Art state or value was changed, no repository source or code was edited, and no Pilot artifact was archived.

The current matrix is authoritative. `review-ledger.md` predates the later salvage passes and still reports 127 known / 73 unknown; its aggregate counts are stale and were not used. The current matrix contains 163 known and 37 unknown axis rows.

## Method

1. Read the current 50-work Art matrix and every Local, counted Gemini, and final adjudication report named by it, including the late four-work salvage and dedicated Pass C reports.
2. Kept every matrix `state` and `value` byte-equivalent at the field level. This pass supplies confidence only.
3. Treated confidence as support for the finalized claim inside its recorded official edition and entry-page scope. It is not a probability about the full series and is not an Evidence-row confidence copied into an Art claim.
4. Assigned each exact number claim by claim from official-pixel authority, edition mapping, page/context breadth, anchor clarity, model agreement or the quality of explicit Pass C conflict resolution, and motion start/development/endpoint completeness. No source-class formula, arithmetic mean, confidence averaging, or majority vote was used.
5. Unknown rows have blank `value` and `confidence`. Their decision text records why the conditional or static gate closes unknown; unknown is not a low numeric value.
6. Where prose left an especially narrow boundary, original ignored pixels were opened at original resolution. This pass directly spot-checked YAWARA's restrained gate sequence, Conan's roller-coaster impact pair, and all three Dr. Coto spreads. These checks changed no frozen state/value; they only bounded confidence.

## Matrix and confidence distribution

- Works: 50
- Axes per work: 4
- Data rows: 200
- Known: 163
- Unknown: 37
- Known confidence range: 0.72-0.95
- Known confidence mean / median: 0.878 / 0.89
- Rows that cannot responsibly receive required metadata: 0. All known claims have one exact bounded confidence; every unknown has deliberately blank numeric fields and a closure reason.

| Axis | Known | Unknown | Min confidence | Mean confidence | Max confidence |
|---|---:|---:|---:|---:|---:|
| artRealism | 50 | 0 | 0.81 | 0.887 | 0.95 |
| artDensity | 50 | 0 | 0.81 | 0.875 | 0.95 |
| visualSoftness | 50 | 0 | 0.79 | 0.878 | 0.95 |
| motionImpact | 13 | 37 | 0.72 | 0.858 | 0.93 |

| Confidence bucket | Known rows |
|---|---:|
| 0.70-0.79 | 2 |
| 0.80-0.84 | 34 |
| 0.85-0.89 | 72 |
| 0.90-0.95 | 55 |

The lowest known confidence is YAWARA `motionImpact=1` at 0.72: Pass C identified a complete but restrained chain-pull and gate-opening movement inside a digitally re-edited complete edition, while Gemini had closed motion unknown. This is intentionally lower than the static claims. The highest values are reserved for repeated, anchor-clear agreement such as the realism and density of I Am a Hero and the roughness of Golgo 13.

## Edition and scope controls

- Alternate or non-byte-identical edition caveats remain explicit for Drifting Classroom, Urusei Yatsura, YAWARA, Hidamari no Ki, Wandering Son, Dr. Coto, and the mapped re-edited volume of Barairo no Ashita.
- Motion confidence is issued only when the frozen matrix is known and the authoritative reports identify exact bounded refs. No genre, synopsis, cover, animation image, or user Art opinion was promoted into an Art value.
- Counted Gemini runs must have outer `SUCCESS`, exact `gemini-3.7-flash-high` identity, complete response, and demonstrated pixel access. Outer-error runs remain excluded.
- The four late salvage works use `data/staging/catalog-expansion/pilots/pilot-001/reviews/art-salvage-four/pass-c-adjudication.md` as terminal authority. Its two documented false Gemini image descriptions were excluded from the confidence reasoning.

## Deterministic validation

The CSV was generated in matrix work order and canonical axis order: `artRealism`, `artDensity`, `visualSoftness`, `motionImpact`. Validation requires exactly 50 unique work IDs, exactly one row for every work-axis pair, 200 rows total, exact state/value equality to the current matrix, confidence in 0..1 for known, and blank value/confidence for unknown.
