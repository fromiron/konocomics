# Batch 002 chunk 03 independent non-Art review request

## Execution contract

- Requested reviewer: Cursor Grok 4.6 High, non-fast
- CLI model ID: `cursor-grok-4.6-high`
- Mode: read-only
- reviewedByHuman: false
- Work scope: frozen manifest positions 21–30 only
- Content scope: volumes 1–3 or the first major episode
- Art scope: abstain. Do not inspect or judge Art values.
- Do not edit repository files.
- Do not inspect Gold Factor, Theme, Genre, or recommendation-context rows.
- Do not inspect works outside positions 21–30.
- Use only the frozen evidence packet listed below. Do not fill gaps from model memory.

## Frozen inputs

| Path                                                                                         | SHA-256                                                            |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                                                          | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                                                           | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-002/annotation-review-adjudication-request.md` | `ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2` |
| `data/staging/catalog-expansion/batches/batch-002/frozen-work-set.csv`                       | `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6` |
| `data/staging/catalog-expansion/batches/batch-002/research/chunk-03.md`                      | `2e31ccaf1d9202ea253e4339ec155405b5c234c15410b2272c2c591a83e368f7` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/pass-a-text-chunk-03.csv`       | `89cf6b2b4d9ebb3e62965f13bf75f51eed210f8fb124dd6a32af10a26090e018` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/genres-pass-a-chunk-03.csv`     | `9825c2dd5173dd676b68c3993c6e86438ab6016f943753098312d63302f57799` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/themes-pass-a-chunk-03.csv`     | `7977448ab8682323d0fe7538ed096cb5f9a206fc4cd5e93d2cf90200252ea6a7` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/pass-a-text-chunk-03.md`        | `0e4245dbbb9e31d1b7e080fe50d5d21df328b2fe28e9f1542aa1e3eec272d3da` |

Verify and echo every input hash before reviewing. If any hash differs or a
file is inaccessible, stop and return `INPUT_MISMATCH`.

## Independence order

1. Read the dictionary, annotation guide, general request, frozen manifest, and
   research packet.
2. Form a complete independent conclusion for all 10 works.
3. Only then read the four Pass A output files and compare them with the
   independent conclusion.

Do not inherit Pass A values. Award/list membership is selection provenance,
not Factor Evidence. Genre never determines an Axis value. A known zero is an
affirmative evidence-backed absence, not a fallback. If the entry-scope evidence
does not establish a sustained trait, use `U` (unknown). Canonical titles must
not contain `『` or `』`.

The frozen packet documents unresolved edition-to-entry bridges for
`機動警察パトレイバー` and `風と木の詩`. Do not use later-edition prose to infer
entry Factors unless that bridge is explicitly proven inside the packet.

## Required response

Return one complete Markdown document and nothing else.

1. Execution attestation: actual model ID/label, non-fast status, normal
   completion, full input access, no timeout/rate-limit/degraded output,
   `reviewedByHuman=false`, and explicit Art abstention.
2. Echo the nine verified input hashes.
3. Full independent 13-axis matrix. One row per work in manifest order. Columns
   in this exact order:
   `workId, progression, problemSolving, strategy, pacing, mysteryReveal,
worldBuilding, characterArcWeight, relationshipStructure, comedy, darkness,
mentalStress, romance, emotionalWarmth`. Each cell is `U` or `0`–`4`.
4. Full Genre conclusion, one row per work.
5. Full Theme conclusion, one row per work as `themeId:centrality`; use an
   empty value when none is established.
6. Pass A comparison listing every Axis, Genre, or Theme change. For every
   change give the direct source URL and a short dictionary-based reason. State
   `none` if there are no changes.
7. Identity/safety/representative-ISBN table for all 10 works with verdict
   `PASS` or `NEEDS_ADJUDICATION`, plus the direct packet evidence URL.
8. Per-work final review outcome: `verified`, `needs-adjudication`,
   `insufficient-evidence`, `identity-conflict`, or `safety-conflict`.
9. A compact list of all extremes (0 or 4) and all Theme centrality 2 decisions,
   confirming whether each has direct entry-scope evidence.

Do not recommend promotion, change eligibility, average disagreements, or copy
source prose into user-facing explanations.
