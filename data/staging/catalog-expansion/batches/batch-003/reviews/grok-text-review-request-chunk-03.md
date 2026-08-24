# Batch 003 chunk 03 independent non-Art review request

## Execution contract

- Requested reviewer: Cursor Grok 4.6 High, non-fast
- CLI model ID: `cursor-grok-4.6-high`
- Mode: read-only
- reviewedByHuman: `false`
- Work scope: frozen manifest positions 21–30 only
- Content scope: volumes 1–3 or the first major episode
- Art scope: `ART_ABSTAIN`. Pixel access is not established. Do not inspect,
  infer, compare, or judge any Art value, Art row, preview image, or Art review.
- Do not edit repository files.
- Do not inspect Gold Factor, Theme, Genre, or recommendation-context rows.
- Do not inspect works outside positions 21–30.
- Use only the frozen evidence packet listed below. Do not browse the web or
  fill gaps from model memory.
- Muse and Ox are not reviewers for this run and must not be invoked or
  substituted.

## Frozen inputs

| Path | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-review-adjudication-request.md` | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `data/staging/catalog-expansion/batches/batch-003/frozen-work-set.csv` | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `data/staging/catalog-expansion/batches/batch-003/research/chunk-03.md` | `1e65e398e2c375129ac118c9f54e0d75eae1f145fc1b8b7fa68cb847c459aaa1` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-pass-a/chunk-03/factors.csv` | `588a2f6fcd26d67c6cec9d9e107649d64c73155d12944b1e917e967010678bbb` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-pass-a/chunk-03/genres.csv` | `229d65b82839343a04a85c26d22c48bd87bb7cb61c9ec447250922344ebe0b00` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-pass-a/chunk-03/themes.csv` | `ff6b6fca5c9145a7e477f57ade502be76056c56af6bc25e7773da81c29b682e7` |
| `data/staging/catalog-expansion/batches/batch-003/annotation-pass-a/chunk-03/notes.md` | `3429a8fb958f499b4f4a5ca46cffae72d7dba5bb926d161305dac28d90d110f7` |

Compute and echo every input hash before reviewing. If any hash differs or a
file is inaccessible, stop and return `INPUT_MISMATCH`. Open each input in
full. The `factors.csv` contains four out-of-scope Art rows per work; ignore
those rows entirely and do not report agreement or disagreement about them.

## Independence order

1. Read the Factor Dictionary, annotation guide, general request, frozen work
   set, and research packet in full.
2. Form and retain a complete independent conclusion for all 10 works covering
   the 13 non-Art Axis values, Genre, Theme, identity, safety, and representative
   ISBN.
3. Only then read the four Pass A output files and compare them with the
   independent conclusion.

Do not inherit Pass A values. Official publisher or rights-holder material is
primary; licensed distribution descriptions and concrete repeated jury or user
observations are secondary and must retain their stated limitations. Award or
list membership is selection provenance, not Factor Evidence. No user-review
packet is present, so do not invent one. Genre never determines an Axis value.
A known zero is an affirmative evidence-backed absence, not a fallback. If the
entry-scope evidence does not establish a sustained trait, use `U` (unknown).
Do not average or vote across disagreements.

Canonical titles must not contain decorative `『` or `』` delimiters. Preserve
the frozen canonical titles exactly, including any punctuation that is already
part of a frozen title; a source punctuation difference is an alias or
normalization observation, not a new Work.

## Required response

Return one complete Markdown document and nothing else.

1. Execution attestation with all of these exact facts: actual model ID and
   label, non-fast status, normal completion, full access to all nine inputs, no
   timeout/rate-limit/degraded output, `reviewedByHuman=false`, no repository
   edits, and the exact token `ART_ABSTAIN` stating that pixel access was not
   established and no Art conclusion was inspected or judged.
2. Echo the nine locally verified input hashes.
3. Full independent 13-axis matrix, one row per work in frozen manifest order.
   Columns in this exact order: `workId, canonicalTitle, progression,
   problemSolving, strategy, pacing, mysteryReveal, worldBuilding,
   characterArcWeight, relationshipStructure, comedy, darkness, mentalStress,
   romance, emotionalWarmth`. Every Axis cell is `U` or `0`–`4`.
4. Full Genre conclusion, one row per work. Use only the dictionary's 10 Genre
   IDs; use an empty value when no Genre is established.
5. Full Theme conclusion, one row per work as `themeId:centrality`. Use only the
   dictionary's 22 Theme IDs and centrality `1` or `2`; use an empty value when
   none is established.
6. Pass A comparison listing every non-Art Axis, Genre, or Theme change. For
   each change give a direct frozen-packet source URL and a short
   dictionary-based reason. State `none` for a work with no changes. Never
   mention or compare the four Art rows.
7. Identity, safety, and representative-ISBN table for all 10 works with frozen
   canonical title, representative ISBN, separate identity and safety findings,
   verdict `PASS` or `NEEDS_ADJUDICATION`, and a direct frozen-packet evidence
   URL. Explicitly inspect the electronic-remaster/print-ISBN relation for
   `青空エール`, the regular/special-edition relation for
   `僕の心のヤバイやつ`, and the original/new-edition relation for
   `喰う寝るふたり住むふたり`. Also inspect the sensitive-content leads for
   `僕の心のヤバイやつ`, `山賊ダイアリー`, `鬼灯の冷徹`, and
   `喰う寝るふたり住むふたり`. Killing fantasies, hunting, animal death or
   dismemberment, firearms, hell punishments, sadistic behavior, or sexual
   subject matter are not by themselves adult-only status.
8. Per-work final review outcome using exactly one of `verified`,
   `needs-adjudication`, `insufficient-evidence`, `identity-conflict`, or
   `safety-conflict`. Give all 10 rows even when evidence is sparse.
9. Compact list of all independently assigned extremes (`0` or `4`) and every
   Theme centrality `2`, confirming whether direct entry-scope evidence exists
   and citing the direct frozen-packet URL. State explicitly when no such value
   is assigned.
10. A final completeness line with `WORK_COUNT=10`, `AXIS_COUNT_PER_WORK=13`,
    `IDENTITY_ROWS=10`, `SAFETY_ROWS=10`, `ISBN_ROWS=10`, and `ART_ABSTAIN`.

These are Pass B proposals only. Do not recommend promotion, alter eligibility,
adjudicate disagreements, copy source prose into user-facing explanations, or
modify any file.
