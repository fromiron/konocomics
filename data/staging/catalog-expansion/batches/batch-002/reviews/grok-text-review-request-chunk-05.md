# Batch 002 chunk 05 independent non-Art review request

## Execution contract

- Requested reviewer: Cursor Grok 4.6 High, non-fast
- CLI model ID: `cursor-grok-4.6-high`
- Mode: read-only
- reviewedByHuman: false
- Work scope: frozen manifest positions 41–50 only
- Content scope: volumes 1–3 or the first major episode
- Art scope: abstain. Do not inspect or judge Art values.
- Do not edit repository files.
- Do not inspect Gold Factor, Theme, Genre, or recommendation-context rows.
- Do not inspect works outside positions 41–50.
- Use only the frozen evidence packet listed below. Do not fill gaps from model memory.

## Frozen inputs

| Path                                                                                         | SHA-256                                                            |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                                                          | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                                                           | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-002/annotation-review-adjudication-request.md` | `ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2` |
| `data/staging/catalog-expansion/batches/batch-002/frozen-work-set.csv`                       | `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6` |
| `data/staging/catalog-expansion/batches/batch-002/research/chunk-05.md`                      | `acc50bd535669e00a1bc115cfed4203835f5e9e76a9218f196eb6124f3fcb02c` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/pass-a-text-chunk-05.csv`       | `989c0fe9f95c94290d878d817e95e64b2ca46e4dccca5f0be3b00417a93a81c0` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/genres-pass-a-chunk-05.csv`     | `c4658542c5c98244a01815eab6b0b3f94f8d4c3879049dd704a130f88f18bf4b` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/themes-pass-a-chunk-05.csv`     | `a4ee3285e4856428908327d42f11297aa70c3875305a6bbbecaa0ca548c77b60` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/pass-a-text-chunk-05.md`        | `e917d2e44f04231b9348cc8a7822a5836b6014c7f8135e2282327948eb5eeb53` |

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

The frozen packet contains these edition and scope limits:

- `うさぎドロップ`: frozen ISBN `9784396763800` is the original edition.
  New-edition volumes have distinct ISBNs and announced additions, and ordinal
  numbering is not a contents bridge. Do not import new-edition volume prose or
  later time-skip material into original volumes 1–3.
- `夢の碑`: frozen ISBN `9784091785015` is the original PFコミックス volume 1.
  Current official products are story-based collections with no contents bridge
  to original PF volumes 1–3; their historical and supernatural descriptions
  cannot establish frozen-entry Factors, Genre, or Theme.
- `おそ松くん`: the canonical Work begins with the 1962 run, while the frozen
  representative ISBN belongs to the 1988 講談社 34-volume edition and its
  first three product pages expose no contents. Do not combine the 1962 origin,
  1987 revival, later adaptation, or broad rights-holder history into frozen
  entry values without a contents bridge.
- `YAIBA`: the official JDCN routes connect the frozen paper product codes to
  the same ordinal volumes and may support non-Art text within that stated
  range. They do not prove pixel-level identity or visual equivalence; remain
  abstained from Art.
- `凪のお暇`: the official jury commentary does not specify an exact volume
  range. Use it only where its observation is independently established by the
  official volumes 1–3, never as proof of later-series traits.

Child harm, death, a corpse, experimentation, transformation, historical
violence, or a minor-and-adult shared setting do not by themselves prove
adult-only classification or a specific relationship. Report a safety conflict
only from direct packet evidence, and otherwise preserve the unresolved
inspection boundary.

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
