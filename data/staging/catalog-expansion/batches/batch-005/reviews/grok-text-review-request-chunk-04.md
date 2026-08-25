# Batch 005 chunk 04 independent non-Art review request

## Execution contract

- Requested reviewer: Cursor Grok 4.6 High, non-fast
- CLI model ID: `cursor-grok-4.6-high`
- Mode: read-only
- reviewedByHuman: `false`
- Work scope: frozen manifest positions 31–40 only
- Content scope: volumes 1–3 or the first major episode
- Packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- Art scope: `ART_ABSTAIN`. Pixel access is not established. Do not inspect,
  infer, compare, or judge any Art value, Art row, preview image, or Art review.
- Do not edit repository files, browse the web, use model memory, inspect Gold
  annotations, or inspect works outside positions 31–40.
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
| `data/staging/catalog-expansion/batches/batch-005/research/chunk-04.md` | `46e6b37d07f4b2baee839dca05331e9c870a6d158c392e3d77ad77419a5b76a3` |
| `data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-04/factors.csv` | `0ec928d7914d3061847e223adfd23915647b82f39a050fa514f30705eb6058d8` |
| `data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-04/genres.csv` | `41d4f721d19def51cc686d86f4b235afdbfb2e23524170ab7beb72258aadbfb7` |
| `data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-04/themes.csv` | `873753e3b438c22f3e55f5d2551ff1fee83e2b87550ff8eb4a3db16a0b814509` |
| `data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-04/notes.md` | `e3de7edbe9486d469cbdef9c014f38b6836121190e0a1a5d91cef1659c690d4e` |
| `data/staging/catalog-expansion/batches/batch-005/reviews/daybreak-annotation-qa-chunks-03-05.md` | `93613b984e2285187810ac97424ea7a618872a3ac65d8e7152db3294b93db620` |

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
