# Batch 004 chunk 01 independent Gemini Art review request

## Execution contract

- Exact model: `gemini-3.7-flash-high` (Gemini 3.7 Flash High), effort `high`.
- Run in read-only `plan` mode with normal completion; no repository or payload edits.
- `reviewedByHuman=false`; Muse `NOT_USED`; Cursor Grok `ART_ABSTAIN`.
- Do not inspect or use any Local reviewer conclusion, including `art-review/chunk-01/local-art.csv`, `art-review/chunk-01/local-codex.md`, adjudication, final-art, or any other model conclusion. The canonical payload contains no such files.
- Use only the frozen metadata copies under `metadata/` in the canonical root and the 24 original preview pixels at the root. Do not use covers, synopsis, animation, user opinion, Genre, text Factor, Gold data, or model memory for Art.

## Frozen inputs

| Path | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-004/annotation-review-adjudication-request.md` | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` |
| `data/staging/catalog-expansion/batches/batch-004/frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-01/preflight.csv` | `51862c41c9f15af4a2780aeed27db95c976b8e01c705efef9019425ec84f7a81` |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-01/ledger.md` | `c32d3903fc677000576a4c743aa1f0707d7727eea5ebb45a8275bd80459d4a0a` |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-01/gemini-payload-ledger.md` | `f49c56a3f453173edb250c2b3dd7abdbc21890d4075300f2b0d76ab508679ee5` |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-01/gemini-root-identity.json` | `c45b45989ed81f9568603731dd987b96326c3c0264b6377f569dacb48fbe0be4` |

The canonical root `/tmp/konocomics-batch004-gemini-art01` is uncompressed and
contains the exact request, complete payload ledger, root identity, frozen
metadata, and original preview pixels only. The metadata copies are under
`metadata/` and match the frozen hashes above. Recompute all 24 image hashes
and the sorted-ledger payload identity, then open every image at original
pixels. If any hash/input/model differs, a file cannot render, or the run is
truncated, rate-limited, timed out, degraded, substituted, or abnormal, return
only `INPUT_OR_CAPABILITY_FAILURE` with the reason.

## Gate and exact work order

The frozen Batch 004 chunk 01 positions are:

| Position | workId | Canonical title | State |
| ---: | --- | --- | --- |
| 1 | `work-025c8ab93483a39c9330` | ホストと社畜 | sample-ready |
| 2 | `work-098b1781e14365eea667` | うるわしの宵の月 | sample-ready |
| 3 | `work-0f3a44f5dcab9623d1be` | 応天の門 | unknown-ready |
| 4 | `work-11d23966f22f777e95d0` | のらみみ | sample-ready |
| 5 | `work-132ce7172750a3b1fa53` | ヒナまつり | sample-ready |
| 6 | `work-15dba4fdb46308ab45d7` | 駅から5分 | unknown-ready |
| 7 | `work-188ba092c6195603bb3f` | つらつらわらじ | unknown-ready |
| 8 | `work-19c2017b33c07f48634e` | ふうらい姉妹 | unknown-ready |
| 9 | `work-1a6ad6771865b43c8516` | それでも町は廻っている | unknown-ready |
| 10 | `work-1cdc6c5cca7c33fafe51` | 青空にとおく酒浸り | unknown-ready |

For positions 1, 2, 4, and 5, independently judge `artRealism`,
`artDensity`, and `visualSoftness` from the Factor Dictionary anchors across
all six selected contexts. Every `motionImpact` cell is `U`: the frozen
preflight has `motionGateAttemptable=false` for every position, and no sample
contains a continuous start-development-impact-resolved action sequence.
Positions 3, 6, 7, 8, 9, and 10 must be `U/U/U/U`. Endpoint 0 or 4 is allowed
only if every selected context supports it. `U` is unknown, never low or a
blocker.

## Required response

Return one complete Markdown document only:

1. Attest exact model/effort, read-only plan mode, normal completion, all eight inputs and 24 pixels opened at original pixels, no degradation/fallback/edit, `reviewedByHuman=false`, and Local conclusions not inspected.
2. Echo all eight frozen input hashes and give a 24-row table: file, expected SHA, computed SHA, `openedAtOriginalPixels=yes`, and unique visible cue.
3. Give the exact positions 1–10 table with workId and four cells in `artRealism/artDensity/visualSoftness/motionImpact` order; exactly 10 works and 40 terminal cells.
4. For each known static cell, cite at least two exact refs, a dictionary-anchored pixel observation, limitation, and confidence. For unknown, state the unmet gate.
5. Audit every proposed 0/4 against all contexts. Confirm all motion cells U and positions 3/6/7/8/9/10 U/U/U/U.
6. Confirm no temporary image or repository file was copied, moved, deleted, edited, or committed by the review.

Do not recommend promotion, compare Local values, or adjudicate.
