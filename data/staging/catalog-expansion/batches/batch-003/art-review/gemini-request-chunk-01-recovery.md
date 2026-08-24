# Batch 003 chunk 01 bounded-recovery independent Gemini Art review request

## Execution contract

- Requested model: exact `gemini-3.7-flash-high`, effort `high`.
- Mode: read-only plan; do not edit repository or temporary files.
- `reviewedByHuman=false`.
- Work scope: frozen positions 2, 3, 5, and 7 only, in that order.
- Content scope: the licensed entry-edition samples recorded by the bounded recovery preflight.
- Independently open all 12 selected image files at full pixel detail. Do not use covers, synopsis, animation, user opinion, Genre, text Factor, Gold data, Local Codex output, or model memory.
- Do not inspect any other file below `data/staging/catalog-expansion/batches/batch-003/art-review/` except this request document. In particular, do not inspect existing chunk-01 Art conclusions, Local recovery files, chunk-02 conclusions, adjudication, or final Art.
- Muse is `NOT_USED`. Cursor Grok is `ART_ABSTAIN`. Neither is a substitute and neither supplies Art values.

## Frozen inputs

| Path                                                                                             | SHA-256                                                            |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                                                              | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                                                               | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-review-adjudication-request.md`     | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `data/staging/catalog-expansion/batches/batch-003/frozen-work-set.csv`                           | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-01/recovery-preflight.csv` | `4bbc75c574c04cd0ae6477873b4ef39477d7b9e85ea7a0d8ff8eb278af790472` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-01/recovery-ledger.md`     | `d098d6dcb4d9a53a9e4d33e359c56b745c03b7220e53de0d9fbec565d451a1b9` |

The 12 images are available through the additional read-only workspace root supplied to the run. Locate them only by the relative paths below. Recompute every SHA-256 and compare it before judging. Do not rely on metadata or hashes alone: actually render and inspect every file at native/original pixel detail.

If any frozen-input hash differs, an image is missing, a file cannot be rendered, the exact requested model is not running, the response is truncated, or a timeout, rate limit, degraded, fallback, or abnormal outer condition occurs, stop and return `INPUT_OR_CAPABILITY_FAILURE` with the exact reason. Do not substitute another model.

## Exact 12-file pixel manifest

| Position | workId                      | Work                       | Ref              | Relative file                               | Expected SHA-256                                                   |
| -------: | --------------------------- | -------------------------- | ---------------- | ------------------------------------------- | ------------------------------------------------------------------ |
|        2 | `work-048a39f42bd18cb0823e` | 大東京トイボックス         | `reader-step-04` | `toybox/toybox-step-04.png`                 | `eb34b21c695f990b94ba207e7ccc0b945d10d99ee3d90c6f1ad244715241f39f` |
|        2 | `work-048a39f42bd18cb0823e` | 大東京トイボックス         | `reader-step-05` | `toybox/toybox-step-05.png`                 | `cda001cf504d883560b2516f17981ba676bf5c9736108734808ebad3e68859ec` |
|        2 | `work-048a39f42bd18cb0823e` | 大東京トイボックス         | `reader-step-06` | `toybox/toybox-step-06.png`                 | `5c5b49239661b91d7f5c81c4ba2ef4d6f0dbf26ee7c233ae265ab46b7aed4af1` |
|        3 | `work-04f35b4c99514d50231d` | デトロイト・メタル・シティ | `reader-step-04` | `dmc/dmc-step-04.png`                       | `7a2e1d42be7d738b938a8bf8706266749c846fe233fa5119812e24366ef7661b` |
|        3 | `work-04f35b4c99514d50231d` | デトロイト・メタル・シティ | `reader-step-12` | `dmc/dmc-step-12.png`                       | `fbf6a740ffe97f1de9e174c1a5bf5b33aef407c1a70a67fa99b7310663a782c9` |
|        3 | `work-04f35b4c99514d50231d` | デトロイト・メタル・シティ | `reader-step-20` | `dmc/dmc-step-20.png`                       | `28bf800ff41c9bb19dae5b850e85abc2c96ffa8e7e4cb32e59f6177f82a8890b` |
|        5 | `work-07faf4019b12de5e877d` | 私の少年                   | `reader-step-09` | `watashino-recapture/watashino-step-09.png` | `bd27cd8fe7afa5fa7c44599be5b470b09550b861e530e9b14311d24070cfaefd` |
|        5 | `work-07faf4019b12de5e877d` | 私の少年                   | `reader-step-10` | `watashino-recapture/watashino-step-10.png` | `b54115c494f284989fd4a7e6bd7a067e0f03ba36b6bcce3c0a7504ddf99fff33` |
|        5 | `work-07faf4019b12de5e877d` | 私の少年                   | `reader-step-12` | `watashino-recapture/watashino-step-12.png` | `9efa70142f6ba133a49435e492a51ca5b5d64fd37f95e4a4d61b5b213125a0e8` |
|        7 | `work-171b262b7ad72871f795` | ドリフターズ               | `reader-step-03` | `drifters/drifters-step-03.png`             | `55e78f45acd1050ee4e02cb259ed991a9aae51bdd8e57ea5d32db5643137b57f` |
|        7 | `work-171b262b7ad72871f795` | ドリフターズ               | `reader-step-04` | `drifters/drifters-step-04.png`             | `980d8d311ee25caa3c64900cad8dbfa37bb21e21e6f85eafb5a0f1616c323b8c` |
|        7 | `work-171b262b7ad72871f795` | ドリフターズ               | `reader-step-05` | `drifters/drifters-step-05.png`             | `408e550410c27d5a94cacf6b465681e53371e3f2539fc0b5bcb10e6d3bcb09b7` |

## Edition and gate limits

- `大東京トイボックス`: same frozen ISBN; digital remaster made from original manuscript data. Selected opening body pages exclude added end matter. Remaster reproduction may affect tone or line rendition, so retain that ceiling per static axis.
- `デトロイト・メタル・シティ`: same frozen ISBN; listing explicitly states body contents are unchanged except added commentary and color-enhancement pages. Selected refs are monochrome opening body pages.
- `私の少年`: current listing explicitly states the pre-2018 sold edition has unchanged contents with only a renewed cover. Catalog identity binds that prior edition to the frozen original Futabasha volume. The bridge supports body Art, not identical logos, pagination, or design metadata.
- `ドリフターズ`: licensed reader maps directly to the frozen standard volume-1 ISBN.
- Each Work has six readable internal pages across at least two contexts, so the three static axes may be reviewed independently.
- Every `motionImpact` cell must be `U`. No Work has an exact bounded continuous start, development, impact, and resolved endpoint sequence. Unresolved combat continuation is not eligible.
- `U` means unknown, never zero, low, or a promotion blocker. Use 1 or 3 only when pixels directly place the sample between adjacent anchors.

## Pixel-access proof

Before the factor matrix, include a complete 12-row verification table with columns `file, expectedSha256, computedSha256, openedAtOriginalPixels, uniqueVisibleCue`. `openedAtOriginalPixels` must be `yes` for every row. Each visible cue must be file-specific. Report `12/12 HASH_MATCH` only if every computed hash matches.

## Required response

Return one complete Markdown document and nothing else.

1. Execution attestation: actual model ID and resolved label, effort, normal completion, full frozen-input and pixel access, no timeout/rate-limit/degraded/fallback output, `reviewedByHuman=false`, and Local/Grok/Muse conclusions not inspected.
2. Echo all six frozen input hashes and give the complete 12-row pixel-access proof table.
3. Give one exact-order table for all four works with columns `position, workId, artRealism, artDensity, visualSoftness, motionImpact`; cells are `U` or integers `0`–`4`. The table must contain exactly four work rows and 16 terminal cells.
4. For every known static cell, give at least two exact selected refs, a concise pixel observation tied to dictionary anchors, an edition/sample limitation, and confidence. For every unknown cell, state the unmet gate. Do not assign a known `motionImpact` value.
5. List every static value 0 or 4 and explicitly confirm whether all selected contexts support the extreme. If not fully supported, lower it or return `U`.
6. Confirm all four `motionImpact` cells are `U` and Art unknown is not a blocker.
7. Confirm no temporary image was copied, moved, deleted, or committed and no repository file was edited.

Do not recommend promotion, compare with Local values, or write a final adjudication.
