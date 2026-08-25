# Batch 005 chunk 02 independent non-Art review request

## Execution contract

- Requested reviewer: Cursor Grok 4.6 High, non-fast
- CLI model ID: `cursor-grok-4.6-high`
- Mode: read-only
- reviewedByHuman: `false`
- Work scope: frozen manifest positions 11–20 only
- Content scope: volumes 1–3 or the first major episode
- Packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- Art scope: `ART_ABSTAIN`. Pixel access is not established. Do not inspect,
  infer, compare, or judge any Art value, Art row, preview image, or Art review.
- Do not edit repository files, browse the web, use model memory, inspect Gold
  annotations, or inspect works outside positions 11–20.
- Muse and Ox must not be invoked or substituted.

## Frozen inputs

| Path | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-005/annotation-review-adjudication-request.md` | `9254c3d00faeb844df9f81ffb7ce0b7873eff2c009dccf8e87fca7342c5f9527` |
| `data/staging/catalog-expansion/batches/batch-005/manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| `data/staging/catalog-expansion/batches/batch-005/PAYLOAD.sha256` | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` |
| `data/staging/catalog-expansion/batches/batch-005/frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| `data/staging/catalog-expansion/batches/batch-005/research/chunk-02.md` | `7b102a7889fa15bc778d5eb0f91785a285fed2d08b0386f809eebd3d04fc6bdd` |
| `data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-02/factors.csv` | `f1a78e3029887f2549b5b4b3e9836a32680d311ca7e21252cfb8ec1de31de6c2` |
| `data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-02/genres.csv` | `2dc31c0b29003889c0650e1ec3e208f766139050cab1afdcb143418e7bdd9e9e` |
| `data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-02/themes.csv` | `8b61757f1d427ded69ebc351a7532f923b34e8e423f4213424fe821d77ab09b0` |
| `data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-02/notes.md` | `0ea56e271b53ebbad98cd6eb80e71c6f5512893b48551366e31cd73f4f841c49` |
| `data/staging/catalog-expansion/batches/batch-005/reviews/daybreak-annotation-qa-chunks-01-02.md` | `4f032d8fbfacdeec01ab01dc53a414dd9f1b118fc5f208b4584d520828a65539` |

Recompute and echo all hashes first. Stop with `INPUT_MISMATCH` on any mismatch.
Read each input in full. Ignore the four Art rows per work entirely. The
Daybreak report is QA evidence, not an annotation source or a vote.

## Independence and evidence rules

Read the dictionary, guide, general request, frozen set, and research packet;
form complete independent conclusions; only then read Pass A and the Daybreak
QA. Official material is primary. Selection provenance is not Factor Evidence.
Genre never determines an Axis. Known zero requires affirmative evidence. Use
`U` where entry-scope evidence is insufficient. Do not average or vote.
Decorative `『` and `』` must not appear in canonical titles.

## Required response

Return one concise complete Markdown document and nothing else:

1. Attest exact model `cursor-grok-4.6-high` / Cursor Grok 4.6 High, non-fast,
   normal completion, all twelve inputs read, no degradation, no edits,
   `reviewedByHuman=false`, `ART_ABSTAIN`, Muse `NOT_USED`, Ox `EXCLUDED`.
2. Echo all twelve verified hashes and the packet candidate SHA-256.
3. A 10-row matrix with columns `workId, canonicalTitle, progression,
   problemSolving, strategy, pacing, mysteryReveal, worldBuilding,
   characterArcWeight, relationshipStructure, comedy, darkness, mentalStress,
   romance, emotionalWarmth`; cells only `U` or `0`–`4`.
4. Ten-row Genre and ten-row Theme conclusions using dictionary IDs and Theme
   centrality 1 or 2.
5. Every Pass A non-Art disagreement with direct packet URL and brief dictionary
   reason; `none` where unchanged.
6. Ten-row identity, safety, and representative-ISBN table with verdict `PASS`
   or `NEEDS_ADJUDICATION` and direct packet URL.
7. Ten-row outcome using `verified`, `needs-adjudication`,
   `insufficient-evidence`, `identity-conflict`, or `safety-conflict`.
8. Every independently assigned endpoint 0/4 and Theme centrality 2 with direct
   entry-scope support.
9. End exactly with `WORK_COUNT=10 AXIS_COUNT_PER_WORK=13 IDENTITY_ROWS=10
   SAFETY_ROWS=10 ISBN_ROWS=10 ART_ABSTAIN`.

These are independent Pass B proposals only. Do not authorize promotion or
modify any file.
