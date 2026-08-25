# Batch 004 chunk 03 independent non-Art review request

## Execution contract

- Requested reviewer: Cursor Grok 4.6 High, non-fast
- CLI model ID: `cursor-grok-4.6-high`
- Mode: read-only
- reviewedByHuman: `false`
- Work scope: frozen manifest positions 21–30 only
- Content scope: volumes 1–3 or the first major episode
- Art scope: `ART_ABSTAIN`. Pixel access is not established. Do not inspect,
  infer, compare, or judge any Art value, Art row, preview image, or Art review.
- Do not edit repository files, browse the web, use model memory, inspect Gold
  annotations, or inspect works outside positions 21–30.
- Muse and Ox must not be invoked or substituted.

## Frozen inputs

| Path | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `data/staging/catalog-expansion/batches/batch-004/annotation-review-adjudication-request.md` | `693e302b8ca0dbd44b513b2ad62bab93a4587a7dc60c3437182af2a9d15f6513` |
| `data/staging/catalog-expansion/batches/batch-004/frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `data/staging/catalog-expansion/batches/batch-004/research/chunk-03.md` | `2df04cf22b36b484e91e2c0a213857751d2666b25aef9dac8d7cab8303148f14` |
| `data/staging/catalog-expansion/batches/batch-004/annotation-pass-a/chunk-03/factors.csv` | `648cb388f0b1e6f6e7b22051d30c805f72c7700a96bf3d3140a431167f220723` |
| `data/staging/catalog-expansion/batches/batch-004/annotation-pass-a/chunk-03/genres.csv` | `6e4a37abd5683bdfcf5c58f6c4cf1ad7aec5028152feb2c9aaa8522e2112476e` |
| `data/staging/catalog-expansion/batches/batch-004/annotation-pass-a/chunk-03/themes.csv` | `77024e12368faa8904c8cf509719712ac43651d53e43e6f5bbc7264376535dc7` |
| `data/staging/catalog-expansion/batches/batch-004/annotation-pass-a/chunk-03/notes.md` | `8a4bd19e4945326b6b39b88dfb9e51ea9adc7030d70508a9c2b4478a58249530` |

Recompute and echo all hashes first. Stop with `INPUT_MISMATCH` on any mismatch.
Read each input in full. Ignore the four Art rows per work entirely.

## Independence and evidence rules

Read the dictionary, guide, general request, frozen set, and research packet;
form complete independent conclusions; only then read Pass A. Official material
is primary. Selection provenance is not Factor Evidence. Genre never determines
an Axis. Known zero requires affirmative evidence. Use `U` where entry-scope
evidence is insufficient. Do not average or vote. Decorative `『` and `』` must
not appear in canonical titles.

## Required response

Return one concise complete Markdown document and nothing else:

1. Attest exact model `cursor-grok-4.6-high` / Cursor Grok 4.6 High, non-fast,
   normal completion, all nine inputs read, no degradation, no edits,
   `reviewedByHuman=false`, `ART_ABSTAIN`, Muse `NOT_USED`, Ox `EXCLUDED`.
2. Echo all nine verified hashes.
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
