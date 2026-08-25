# Batch 004 chunk 04 independent Gemini Art review request

## Execution contract

- Exact model: `opencode/gemini-3.7-flash`, variant `high` (Gemini 3.7 Flash High).
- Read-only independent review; no repository or payload edits.
- `reviewedByHuman=false`; Muse `NOT_USED`; Cursor Grok `ART_ABSTAIN`.
- Do not inspect `local-art.csv`, `local-codex.md`, any adjudication, or any other model conclusion.
- Use only the six frozen repository inputs and the canonical uncompressed payload root below. Do not use covers, synopsis, animation, user opinion, Genre, text Factor, Gold data, or model memory for Art.

## Frozen inputs

| Path                                                                                             | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                                                              | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                                                               | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-004/annotation-review-adjudication-request.md`     | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` |
| `data/staging/catalog-expansion/batches/batch-004/frozen-work-set.csv`                           | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-04/preflight.csv`          | `f0574f648a2318121bf7750e7151cb0000d3928a09657273991bf2d1309ed765` |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-04/ledger.md`              | `dc427da1b1f95602fa5ccfc91d9a842d0faf740907a00843e9ffabbce9a542f0` |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-04/gemini-payload-ledger.md`  | verify locally before review                                       |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-04/gemini-root-identity.json` | verify locally before review                                       |

Canonical payload root: `/tmp/konocomics-batch004-gemini-art04`. Recompute the six file hashes and the sorted-ledger payload identity, then open every image at original pixels. If a hash/input/model differs, a file cannot render, or the run is truncated, rate-limited, timed out, degraded, substituted, or abnormal, return only `INPUT_OR_CAPABILITY_FAILURE` with the reason.

## Gate and exact work order

- Position 31 `work-925f371723beac5227f7` / 邪神の弁当屋さん is the only `sample-ready` work. The six ledger images are genuine official episode-one body pages across bakery/household, outdoor market/flower stall, and city-history/wall-tableau contexts.
- Positions 32–40 are `unknown-ready`: `work-961a49798df191311f42`, `work-9bd00739b995d84e2494`, `work-a3d922576a1a1ecc8e3e`, `work-aa85b65d02f367e76a07`, `work-af3443bab1c30d470a76`, `work-bd5c323a3dbc9f3a04d4`, `work-c2df32661c0b925ff74f`, `work-c2f3864045578cebb590`, `work-c5c2695ad33fd05af945`. They must be `U/U/U/U`.
- For position 31, independently judge `artRealism`, `artDensity`, and `visualSoftness` from dictionary anchors. `motionImpact=U` because no continuous start-development-impact-resolved sequence exists.
- Endpoint 0 or 4 is allowed only if every selected context supports it. `U` is unknown, never low or a blocker.

## Required response

Return one complete Markdown document only:

1. Attest exact model/variant, normal completion, all inputs and pixels opened, no degradation/fallback/edit, `reviewedByHuman=false`, Local conclusions not inspected.
2. Echo all frozen input hashes and give a six-row table: file, expected SHA, computed SHA, `openedAtOriginalPixels=yes`, unique visible cue.
3. Give the exact positions 31–40 table with workId and four cells in `artRealism/artDensity/visualSoftness/motionImpact` order; exactly 10 works and 40 terminal cells.
4. For each known static cell, cite at least two exact refs, dictionary-anchored pixel observation, limitation, confidence. For unknown, state the unmet gate.
5. Audit every proposed 0/4 against all contexts. Confirm all motion cells U and positions 32–40 U/U/U/U.
6. Confirm no temporary image or repository file was copied, moved, deleted, edited, or committed.

Do not recommend promotion, compare Local values, or adjudicate.
