# Batch 004 chunk 02 independent Gemini Art review request

## Execution contract

- Exact model: `gemini-3.7-flash-high` (Gemini 3.7 Flash High), effort `high`, plan mode.
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
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-02/preflight.csv` | `249d177ae697a41231e15801e86097e3d011a6689027a2bc4f1e80d67968feae` |
| `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-02/ledger.md` | `4509e34e78eb35596d2aa5b66babbe4ca55dcd02945afe89efc4978c1d6f4ae7` |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-02/gemini-payload-ledger.md` | `0bb993f570fa77195bd7a69d8788aed2062fc1ff0e3e6388bad41fd63131c4ec` |
| `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-02/gemini-root-identity.json` | `850239b5e7437df008e2068f099362e3cbf901485965a022ab946b0d0dc90421` |

Canonical payload root: `/tmp/konocomics-batch004-gemini-art02`.
The eight frozen inputs are under `inputs/` in that root, the complete payload
ledger and root identity are at its top level, and the 60 original pixels are
under `images/`. Recompute all 60 image hashes and the sorted-ledger payload
identity, then open every image at original pixels. If a hash/input/model
differs, a file cannot render, or the run is truncated, rate-limited, timed
out, degraded, substituted, or abnormal, return only
`INPUT_OR_CAPABILITY_FAILURE` with the reason.

## Gate and exact work order

All ten positions 11–20 are `sample-ready` and have six official body pages
across at least two distinct contexts. Independently judge `artRealism`,
`artDensity`, and `visualSoftness` from the Factor Dictionary anchors across
every selected context. Every `motionImpact` cell is `U` because the frozen
preflight contains no continuous start-development-impact-resolved sequence.
Endpoint 0 or 4 is allowed only when every selected context supports it. `U`
is unknown, never low or a blocker.

| Position | workId | Canonical title | State |
| ---: | --- | --- | --- |
| 11 | `work-23077ad33a2066bef5a6` | Sunny | sample-ready |
| 12 | `work-2356050c72240569e1c5` | すみれファンファーレ | sample-ready |
| 13 | `work-2c4fe00df5255fc082f9` | ヒーローカンパニー | sample-ready |
| 14 | `work-2d385ad0525742330e70` | ねずみの初恋 | sample-ready |
| 15 | `work-2df743e085adef5e9bd3` | キルアオ | sample-ready |
| 16 | `work-2f1d1c3ad0f943f1562f` | 尾守つみきと奇日常。 | sample-ready |
| 17 | `work-3713ab561de583d709bc` | アリスと蔵六 | sample-ready |
| 18 | `work-39c1a2b6791238827ed5` | とろける鉄工所 | sample-ready |
| 19 | `work-3ad85a2ffdc026007d61` | 新しい上司はど天然 | sample-ready |
| 20 | `work-44d0000353478596369e` | 環と周 | sample-ready |

## Required response

Return one complete Markdown document only:

1. Attest exact model/effort, plan mode, normal completion, all inputs and 60 pixels opened, no degradation/fallback/edit, `reviewedByHuman=false`, and Local conclusions not inspected.
2. Echo all frozen input hashes and give a 60-row table: file, expected SHA, computed SHA, `openedAtOriginalPixels=yes`, unique visible cue.
3. Give positions 11–20 with workId and four cells in `artRealism/artDensity/visualSoftness/motionImpact` order; exactly 10 works and 40 terminal cells.
4. For each known static cell, cite at least two exact refs, dictionary-anchored pixel observation, limitation, and confidence. For unknown, state the unmet gate.
5. Audit every proposed 0/4 against all contexts. Confirm all motion cells U.
6. Confirm no temporary image or repository file was copied, moved, deleted, edited, or committed.

Do not recommend promotion, compare Local values, or adjudicate.
