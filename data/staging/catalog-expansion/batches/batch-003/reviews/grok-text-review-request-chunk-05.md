# Batch 003 chunk 05 independent non-Art review request

## Execution contract

- Requested reviewer: Cursor Grok 4.6 High, non-fast
- CLI model ID: `cursor-grok-4.6-high`
- Mode: read-only
- reviewedByHuman: `false`
- Work scope: frozen manifest positions 41–50 only
- Content scope: volumes 1–3 or the first major episode
- Art scope: `ART_ABSTAIN`. Pixel access is not established. Do not inspect,
  infer, compare, or judge any Art value, preview image, or Art review.
- Do not edit repository files, inspect Gold rows, browse the web, use model
  memory to fill gaps, or inspect works outside positions 41–50.
- Muse and Ox are not reviewers for this run and must not be invoked or
  substituted.

## Frozen inputs

| Path | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-review-adjudication-request.md` | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `data/staging/catalog-expansion/batches/batch-003/frozen-work-set.csv` | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `data/staging/catalog-expansion/batches/batch-003/research/chunk-05.md` | `b0db5cfb6a223c87bff5352860e11bff37d62259cd74d75644d3f02fe3150f68` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-pass-a/chunk-05/factors.csv` | `eb1e4d2153b423f13c06b52e90328d111ebfe8a8c7dab5c89e46b0a2b95b0c7a` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-pass-a/chunk-05/genres.csv` | `df517b745528b5b41af3bd9bb649e674b9846ea66fbbc0c7b555e2424c967184` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-pass-a/chunk-05/themes.csv` | `537f289833b4cee4577e99c33aeab01b343098878456b7a019b0bacbae954a73` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-pass-a/chunk-05/notes.md` | `78ad3229483e58814ee340c9d9329ff3f4c52d5d88110acf2561548c841b04dc` |

Compute and echo every input hash before reviewing. If any hash differs or a
file is inaccessible, stop with `INPUT_MISMATCH`. Open every input in full.
Ignore the four Art rows per work completely.

## Independence order

1. Read the dictionary, guide, general request, frozen work set, and research
   packet; form a complete independent conclusion for all 10 works.
2. Only then open the four Pass A outputs and compare them.

Do not inherit Pass A. Publisher/rightsholder material is primary; licensed
distribution and concrete attributed jury observations are secondary within
their stated range. Award membership is selection provenance only. No qualified
user-review packet is present. Genre never determines an Axis. A known zero
requires affirmative absence; otherwise use `U`. Do not average or vote.
Canonical titles must preserve the frozen text and omit decorative `『』`.

## Required response

Return one complete Markdown document and nothing else.

1. Attest actual model ID and label, non-fast status, normal completion, full
   access to all nine inputs, no timeout/rate-limit/degraded output,
   `reviewedByHuman=false`, no edits, and exact token `ART_ABSTAIN`.
2. Echo the nine verified hashes.
3. Give the complete independent 13-axis matrix for positions 41–50 in frozen
   order. Columns: `workId, canonicalTitle, progression, problemSolving,
   strategy, pacing, mysteryReveal, worldBuilding, characterArcWeight,
   relationshipStructure, comedy, darkness, mentalStress, romance,
   emotionalWarmth`. Every cell is `U` or `0`–`4`.
4. Give one Genre row per work using only the 10 dictionary IDs.
5. Give one Theme row per work as `themeId:centrality`, using only the 22
   dictionary IDs and centrality `1` or `2`.
6. List every non-Art Axis, Genre, or Theme difference from Pass A with a direct
   frozen-packet URL and dictionary reason; write `none` for no difference.
7. Give identity, safety, and representative-ISBN rows for all 10 works with
   separate findings, exact frozen ISBN, direct URL, and verdict `PASS` or
   `NEEDS_ADJUDICATION`. Check paper/electronic, original/reprint, publisher or
   rightsholder, numbered/single-volume, adaptation, and web-serialization
   boundaries raised by the packet. Adult relationships, violence, alcohol,
   ghosts, clones, hunting, or workplace material are not automatically
   adult-only.
8. Give all 10 review outcomes using only `verified`, `needs-adjudication`,
   `insufficient-evidence`, `identity-conflict`, or `safety-conflict`.
9. List every independent Axis extreme (`0` or `4`) and Theme centrality `2`,
   with direct entry-scope evidence URL; explicitly state when none exists.
10. End with `WORK_COUNT=10`, `AXIS_COUNT_PER_WORK=13`, `IDENTITY_ROWS=10`,
    `SAFETY_ROWS=10`, `ISBN_ROWS=10`, and `ART_ABSTAIN`.

These are Pass B proposals only. Do not recommend promotion, change
eligibility, adjudicate disagreements, write user-facing explanation text, or
modify any file.
