# Batch 004 chunk 03 independent Gemini Art review request

## Execution contract

- Exact model: `gemini-3.7-flash-high` (Gemini 3.7 Flash High), effort `high`.
- Run in read-only `plan` mode with normal completion; no repository or payload edits.
- `reviewedByHuman=false`; Muse `NOT_USED`; Cursor Grok `ART_ABSTAIN`.
- Do not inspect or use any Local reviewer conclusion, including any
  `art-review/chunk-03/local-art.csv`, `art-review/chunk-03/local-codex.md`,
  adjudication, final-art, or any other model conclusion. The canonical payload
  contains no such files.
- Use only the frozen metadata copies under `inputs/` and the 58 original
  preview pixels under `images/`. Do not use covers, synopsis, animation, user
  opinion, Genre, text Factor, Gold data, or model memory for Art.

## Frozen inputs

| Path | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-004/annotation-review-adjudication-request.md` | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` |
| `data/staging/catalog-expansion/batches/batch-004/frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-03/preflight.csv` | `cfea3c57b84331d9255dabf652aef7c2b9ef48031d2db31e64b5aaca569a7eee` |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-03/ledger.md` | `5aba86caccc6d9c114a8709d3b9f67899ab077ae7e0591be87864a8c0172b6de` |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-03/gemini-payload-ledger.md` | verify locally before review |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-03/gemini-root-identity.json` | verify locally before review |

Canonical payload root: `/tmp/konocomics-batch004-gemini-art03`. The six
frozen inputs are under `inputs/`, the complete payload ledger and root identity
are at the root, and the 58 original pixels are under `images/`. Recompute all
58 image hashes and the sorted-ledger payload identity, then open every image
at original pixels. If any hash/input/model differs, a file cannot render, or
the run is truncated, rate-limited, timed out, degraded, substituted, or
abnormal, return only `INPUT_OR_CAPABILITY_FAILURE` with the reason.

## Gate and exact work order

The frozen Batch 004 chunk 03 positions are:

| Position | workId | Canonical title | State |
| ---: | --- | --- | --- |
| 21 | `work-53fb816835ab36e40a1f` | アンデッドアンラック | unknown-ready |
| 22 | `work-62fbc6b2253b895e3a66` | 俺物語！！ | unknown-ready |
| 23 | `work-634f34830600e07d8f17` | お茶にごす。 | sample-ready |
| 24 | `work-65f856a6fa2078f21d2f` | 黒月のイェルクナハト | sample-ready |
| 25 | `work-741deb03d9f59e723929` | ルックバック | sample-ready |
| 26 | `work-7c8931bc010e2f28f7ec` | 夢中さ、きみに。 | sample-ready |
| 27 | `work-7d4568dcc8e9175d35ba` | 異世界おじさん | unknown-ready |
| 28 | `work-7f0f63c5d80083f2be7f` | 思い、思われ、ふり、ふられ | sample-ready |
| 29 | `work-80a2f62ce5073ade2ec2` | 式の前日 | sample-ready |
| 30 | `work-8733067e6afcaeadbd8d` | さんすくみ | sample-ready |

For positions 23–26, 28–30, independently judge `artRealism`, `artDensity`,
and `visualSoftness` from the Factor Dictionary anchors across every selected
context. Every `motionImpact` cell is `U`: the frozen preflight has
`motionGateAttemptable=false` for every position, and no sample contains a
continuous start-development-impact-resolved action sequence. Positions 21,
22, and 27 must be `U/U/U/U` because their static prerequisites failed.
Endpoint 0 or 4 is allowed only if every selected context supports it. `U` is
unknown, never low or a blocker.

## Required response

Return one complete Markdown document only:

1. Attest exact model/effort, read-only plan mode, normal completion, all eight
   inputs and 58 pixels opened at original pixels, no degradation/fallback/edit,
   `reviewedByHuman=false`, and Local conclusions not inspected.
2. Echo all eight frozen input hashes and give a 58-row table: file, expected
   SHA, computed SHA, `openedAtOriginalPixels=yes`, and unique visible cue.
3. Give the exact positions 21–30 table with workId and four cells in
   `artRealism/artDensity/visualSoftness/motionImpact` order; exactly 10 works
   and 40 terminal cells.
4. For each known static cell, cite at least two exact refs, a
   dictionary-anchored pixel observation, limitation, and confidence. For
   unknown, state the unmet gate.
5. Audit every proposed 0/4 against all contexts. Confirm all motion cells U
   and positions 21/22/27 U/U/U/U.
6. Confirm no temporary image or repository file was copied, moved, deleted,
   edited, or committed by the review.

Do not recommend promotion, compare Local values, or adjudicate.
