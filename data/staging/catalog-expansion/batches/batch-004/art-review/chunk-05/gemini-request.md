# Batch 004 chunk 05 independent Gemini Art review request

## Execution contract

- Exact model: `gemini-3.7-flash-high` (Gemini 3.7 Flash High), effort `high`.
- Read-only independent review; no repository or payload edits.
- `reviewedByHuman=false`; Muse `NOT_USED`; Cursor Grok `ART_ABSTAIN`.
- Do not inspect `local-art.csv`, `local-codex.md`, any adjudication, or any other model conclusion.
- Use only the eight frozen repository inputs and canonical uncompressed payload root below. Do not use covers, synopsis, animation, user opinion, Genre, text Factor, Gold data, or model memory for Art.

## Frozen inputs

| Path | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-004/annotation-review-adjudication-request.md` | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` |
| `data/staging/catalog-expansion/batches/batch-004/frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-05/preflight.csv` | `7b012de84db4bba279b343960183b5f36885575bf31d6949b4c28f156988a81e` |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-05/ledger.md` | `23bc330597b4ee010924459b4832f0f9d62b1a8eefec36639b7421a0f37e1a9a` |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-05/gemini-payload-ledger.md` | `5b3b61616da9304c68ed2e14bd0d884a2fb49eb517b981a5aa9287246c94b98f` |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-05/gemini-root-identity.json` | `3637dcbf9378a564b28f57fbfd14dbc3176aae228b23d6f78ae70b7656e7365f` |

Canonical payload root: `/tmp/konocomics-batch004-gemini-art05`.
Recompute all 48 image hashes and the sorted-ledger payload identity, then open
every image at original pixels. If a hash/input/model differs, a file cannot
render, or the run is truncated, rate-limited, timed out, degraded,
substituted, or abnormal, return only `INPUT_OR_CAPABILITY_FAILURE` with the
reason.

## Gate and exact work order

Positions 41–43 and 45–49 are `sample-ready` and have six body pages each.
Independently judge `artRealism`, `artDensity`, and `visualSoftness` from the
dictionary anchors across every selected context. Positions 44 and 50 are
`unknown-ready` and must be `U/U/U/U`. Every `motionImpact` cell is `U` because
the frozen preflight contains no continuous start-development-impact-resolved
sequence. Endpoint 0 or 4 is allowed only when every selected context supports
it. `U` is unknown, never low or a blocker.

| Position | workId | Canonical title | State |
| ---: | --- | --- | --- |
| 41 | `work-c7280f9dcc2754d3f864` | 鵺の陰陽師 | sample-ready |
| 42 | `work-d63a83030a8819ff553c` | モテキ | sample-ready |
| 43 | `work-d8a87d01c1f35d58e791` | 八雲さんは餌づけがしたい。 | sample-ready |
| 44 | `work-e2f095e08fc5e08d5a2b` | 高嶺と花 | unknown-ready |
| 45 | `work-e81955a9fc5c4d84580f` | ここは今から倫理です。 | sample-ready |
| 46 | `work-eef84d07d90ba2b040cf` | さよなら絵梨 | sample-ready |
| 47 | `work-f8cb26831612e0c6ece5` | 極楽街 | sample-ready |
| 48 | `work-fc53cb5669aa4099ee4a` | アオハライド | sample-ready |
| 49 | `work-fd2a957c501c36047ed0` | 青の祓魔師 | sample-ready |
| 50 | `work-ff9b025f58d7e12f3cb1` | LOVE SO LIFE | unknown-ready |

## Required response

Return one complete Markdown document only:

1. Attest exact model/effort, normal completion, all inputs and 48 pixels opened, no degradation/fallback/edit, `reviewedByHuman=false`, and Local conclusions not inspected.
2. Echo all frozen input hashes and give a 48-row table: file, expected SHA, computed SHA, `openedAtOriginalPixels=yes`, unique visible cue.
3. Give positions 41–50 with workId and four cells in `artRealism/artDensity/visualSoftness/motionImpact` order; exactly 10 works and 40 terminal cells.
4. For each known static cell, cite at least two exact refs, dictionary-anchored pixel observation, limitation, and confidence. For unknown, state the unmet gate.
5. Audit every proposed 0/4 against all contexts. Confirm all motion cells U and positions 44/50 U/U/U/U.
6. Confirm no temporary image or repository file was copied, moved, deleted, edited, or committed.

Do not recommend promotion, compare Local values, or adjudicate.
