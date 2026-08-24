# Batch 002 chunk 04 independent non-Art review request

## Execution contract

- Requested reviewer: Cursor Grok 4.6 High, non-fast
- CLI model ID: `cursor-grok-4.6-high`
- Mode: read-only
- reviewedByHuman: false
- Work scope: frozen manifest positions 31–40 only
- Content scope: volumes 1–3 or the first major episode
- Art scope: abstain. Do not inspect or judge Art values.
- Do not edit repository files.
- Do not inspect Gold Factor, Theme, Genre, or recommendation-context rows.
- Do not inspect works outside positions 31–40.
- Use only the frozen evidence packet listed below. Do not fill gaps from model memory.

## Frozen inputs

| Path                                                                                         | SHA-256                                                            |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                                                          | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                                                           | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-002/annotation-review-adjudication-request.md` | `ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2` |
| `data/staging/catalog-expansion/batches/batch-002/frozen-work-set.csv`                       | `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6` |
| `data/staging/catalog-expansion/batches/batch-002/research/chunk-04.md`                      | `c7436d6d23b304d72700ad7a1d4ebff881ac08e865438a4974c1de36c96b0999` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/pass-a-text-chunk-04.csv`       | `895e2f1715741065bbb5adfb6edf6f0688d09a8b0780d98047c43ade6fb9bb23` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/genres-pass-a-chunk-04.csv`     | `bf2e2325303a6cdf997c403d3e8a3c22b34a50d3f735990326850bcaede0c005` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/themes-pass-a-chunk-04.csv`     | `e432191244003963572bf8f981ecaab3e32626901a19bcd0a57d14eb4df726c3` |
| `data/staging/catalog-expansion/batches/batch-002/annotation/pass-a-text-chunk-04.md`        | `8db250f0688cf4f8dda8b5a8592503f19aba4362bc38b7889e44ad2665e5f2e2` |

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

- `屍鬼`: the official JDCN pages provide the original paper release dates,
  volume order, descriptions, and contents, but they do not display frozen ISBN
  `9784088745497`. Review the mapped original-volume text within its stated
  scope; do not import later bunko content or treat the absent on-page ISBN as a
  different canonical Work without direct evidence.
- `私の推しは悪役令嬢。`: review only the official manga volumes 1–3. The
  source novel, Revolution edition, and メイドキッチン spin-off are distinct
  products and cannot supply manga-entry Factors.
- `flat` volume 2 and `僕とロボコ` volumes 2–3 use short representative-episode
  descriptions. Do not turn one highlighted episode into a sustained
  volume-range trait without repeated packet evidence.

Smoking, sexual humor, death, corpses, injury, or violence in a description do
not by themselves prove adult-only classification. Report a safety conflict only
from direct packet evidence, and otherwise preserve the unresolved inspection
boundary.

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
