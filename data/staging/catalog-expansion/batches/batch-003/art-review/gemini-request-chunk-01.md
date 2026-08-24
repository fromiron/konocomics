# Batch 003 chunk 01 independent Gemini Art review request

## Execution contract

- Requested model: exact `gemini-3.7-flash-high`, effort `high`.
- Mode: read-only plan; do not edit repository or temporary files.
- reviewedByHuman: `false`.
- Work scope: frozen positions 1–10 only.
- Content scope: official entry-edition samples recorded by the preflight.
- Read every selected PNG at full pixel detail. Do not use covers, synopsis,
  animation, user opinion, Genre, text Factor, Gold data, Local Codex output, or
  model memory.
- Do not inspect `art-review/chunk-01/`; this must remain independent from the
  Local pass.

## Frozen inputs

| Path                                                                                         | SHA-256                                                            |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                                                          | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                                                           | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-review-adjudication-request.md` | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `data/staging/catalog-expansion/batches/batch-003/frozen-work-set.csv`                       | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-01/preflight.csv`      | `119e2ecfc831dacc1735421e8b27fa4aae6445774c515967ef1eb1aef5ab8c39` |
| `data/staging/catalog-expansion/batches/batch-003/art-preflight/chunk-01/ledger.md`          | `76f46a18a6ede47b0284194fd85473e5d70365ab39c3781f046c958f355d932a` |

The selected image directory is
`/tmp/batch003-art-preflight-chunk01.MFt2Ak`. Recompute all 18 PNG SHA-256
values and verify them against the preflight before judging. Ignore the
`.playwright-cli` subdirectory. If an input hash differs, an image is missing,
the exact requested model is not running, full pixels cannot be opened, the
response is truncated, or a timeout/rate-limit/degraded condition occurs, stop
and return `INPUT_OR_CAPABILITY_FAILURE` with the reason.

## Art gate

- `sample-ready`: 【推しの子】, COSMOS, 超巡！超条先輩,
  からかい上手の高木さん, 多聞くん今どっち!?, だがしかし.
  Only these six have six readable pages and at least two contexts, so only
  their three static Art axes may become known.
- `unknown-ready`: 大東京トイボックス,
  デトロイト・メタル・シティ, 私の少年, ドリフターズ. Return
  `U/U/U/U`; product pages and missing viewers cannot support pixels.
- `motionImpact` may become known only for COSMOS, and only if the exact
  p065–p066 sample visibly contains a continuous start, development or impact,
  and endpoint. Every other work is `U` for motion in this packet.
- `U` means unknown, never zero. Do not average values. Intermediate 1 or 3
  must be directly justified as lying between adjacent dictionary anchors.

## Required response

Return one complete Markdown document and nothing else.

1. Execution attestation: actual model ID, effort, normal completion, full
   input and pixel access, no timeout/rate-limit/degraded output,
   `reviewedByHuman=false`, and Local/Grok/Muse output not inspected.
2. Echo all six frozen input hashes and report `18/18` PNG hash results.
3. One exact-order table for all ten works with columns
   `workId, artRealism, artDensity, visualSoftness, motionImpact`; cells are
   `U` or `0`–`4`.
4. For every known cell, give the exact image refs, dictionary-anchor reason,
   and confidence. For every unknown cell, state the unmet gate.
5. List every 0 or 4 and explicitly confirm whether its full selected sample
   supports the extreme.
6. Confirm that no temporary image was copied and no repository file was
   edited.

Do not recommend promotion or write a final adjudication.
