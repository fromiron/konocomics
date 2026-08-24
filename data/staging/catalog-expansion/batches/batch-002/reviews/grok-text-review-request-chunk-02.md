# Batch 002 chunk 02 independent non-Art review request

## Execution contract

- Requested reviewer: Cursor Grok 4.6 High, non-fast
- CLI model ID: `cursor-grok-4.6-high`
- Mode: read-only
- reviewedByHuman: false
- Work scope: frozen manifest positions 11–20 only
- Content scope: volumes 1–3 or the first major episode
- Art scope: abstain. Do not inspect or judge Art values.
- Do not edit repository files.
- Do not inspect Gold Factor, Theme, Genre, or recommendation-context rows.
- Do not inspect works outside positions 11–20.
- Use only the frozen evidence packet listed below. Do not fill gaps from model memory.

## Frozen inputs

| Path                                                                                         | SHA-256                                                            |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                                                          | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                                                           | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-002/annotation-review-adjudication-request.md` | `ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2` |
| `data/staging/catalog-expansion/batches/batch-002/frozen-work-set.csv`                       | `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6` |
| `data/staging/catalog-expansion/batches/batch-002/research/chunk-02.md`                      | `645c8e20898357c3533cb879b197c367209e3fed66c9dceb495c7ee6bf0817ed` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/pass-a-text-chunk-02.csv`       | `19127c718ceda3a0df46df079939605e9353288d90c84cc4609607e2b2ce2410` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/genres-pass-a-chunk-02.csv`     | `15f90688570a8e1edb166fc1c9ca71bc4047edc4de3b2783c8a24641ad08a123` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/themes-pass-a-chunk-02.csv`     | `953ccda344142d5a77d3dd82f2ff07d8de58cdef69e49686b1cb29fda63f2ced` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/pass-a-text-chunk-02.md`        | `4bdb5943013f49cd0015d81f47a2006a1f6466658feb5b510a5589c770a8a991` |

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
