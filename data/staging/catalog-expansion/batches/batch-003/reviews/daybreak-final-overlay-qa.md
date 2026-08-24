# Batch 003 final overlay independent QA

- reviewDate: `2026-08-25`
- reviewer: `gpt-daybreak-blue-latest`
- reviewedByHuman: `false`
- scope: corrected frozen Batch 003 final overlay, bound adjudication and Art recovery records, generic overlay builder, Batch 002 regression, and isolated Batch 003 application
- result: **ACCEPT**
- valueChangesByReviewer: none

## Decision

The four findings from the previous independent review are closed. Batch 003 may
retain its current promotion authorization: exactly 11 Works transition to
`recommendationVerified` and 39 terminate as reproducible `promotionBlocked`.
No Factor, Theme, Genre, recommendation-context role, eligibility value, or frozen
Gold datum was changed to obtain this result.

## Previous findings — closure

### 1. Position 41 canonical identity — closed

`art-review/adjudication-recovery-ac.md` now binds position 41
`work-c9e32218e26c6c6292f9` to the frozen canonical title
`ファントムバスターズ`. The incorrect title `灼熱のニライカナイ` is absent.
The correction changes only the adjudication label; the final Art vector remains
`2/2/1/U` and position 41 remains blocked by unchanged Narrative and Tone coverage.

Corrected adjudication SHA-256:
`1437f6a67d646ba8d102930231e2cef0940e0a472685be66a21b8b1b6fe3836c`.

### 2. Licensed-distributor Art provenance — closed

The generic builder now derives Art provenance from terminal preflight source type.
The four position 50 `ワカコ酒` manifest rows are exactly
`authorityClass=publisherAuthorizedPlatform, sourceType=manual`, and their four
axis Evidence rows are `sourceType=manual`. This agrees with the terminal
`licensedDistributorInternalPreview` classification and the existing
`art-evidence.ts` contract. The six-page, two-context sample and adjudicated
`1/2/3/U` vector are unchanged.

### 3. Art source URLs — closed

All 44 generated Art manifest rows and all 44 axis Evidence rows now contain one
direct reader/viewer/sample URL. None contains a semicolon route chain.

- Position 47 uses the exact Kodansha volume-2 reader URL ending in
  `trial/reader?cid=adba1ef0...`.
- Position 50 uses the exact Comic Cmoa sample URL for title `74548`, content
  `100000745480001`.

The full identity and edition route chains remain in the bound preflight and edition
notes. Direct probes no longer reproduce the previous concatenated-URL HTTP 404.

### 4. Terminal QA input binding — closed

Batch 003 config excludes exactly this terminal QA path from recursive review input
binding. The exclusion is scoped to
`data/staging/catalog-expansion/batches/batch-003/reviews/daybreak-final-overlay-qa.md`;
all other review records remain bound. The regenerated validation binds 209 files,
does not list this report, and preserves combined SHA-256
`f4f08de2b64f307247b140ef10810a100bb07e05bd42593130818edf00158bff`
after this report is overwritten. Post-report Batch 003 `--check` passes.

## Reverified invariants

- Frozen set: exactly 50 unique Work IDs in positions 1–50; decisions preserve
  exact identity and order. No frozen or generated canonical title contains `『` or
  `』`.
- Outcome: verified positions are exactly
  `1, 4, 6, 8, 10, 15, 16, 26, 29, 47, 50`; the other 39 positions are blocked;
  no frozen Work remains pending.
- Position 47 is exactly `work-f1d22b68efa7fbd501ee` /
  `僕の小規模な生活`. The invalid Gemini matrix ID remains explicitly isolated as
  a clerical defect and is not emitted as a Work.
- All 11 promoted Works preserve the terminal Narrative, Tone, and Art state/value/
  confidence. Genre and Theme rows also match the terminal adjudication inputs.
- Factor overlay: 187 rows, exactly 17 axes per promoted Work, in frozen Work order
  and Factor Dictionary axis order; 145 known and 42 unknown. Unknown is never
  converted into a numeric low value.
- Coverage: every promoted Work passes unchanged Narrative `0.60`, Tone `0.60`,
  Art `0.30`, Genre, and Theme gates. Positions 45 and 46 remain Art `0/4` and are
  blocked. Position 48 `artDensity=4` remains endpoint-audited and the Work remains
  blocked by Tone coverage.
- Art: 44 manifest rows, at least six mapped readable pages and at least two recorded
  contexts per promoted Work. The only known motion value is position 4 `COSMOS`,
  with printed pages 65–66 identifying the bounded throw and immediate aftermath.
  No cover-, synopsis-, animation-, genre-, or user-review-only Art claim was found.
- No temporary image path, `temporaryImageRoot`, `/tmp/` path, or committed raster
  image exists in the final overlay.
- Blockers: all 39 rows use `SOURCE_INFORMATION_UNAVAILABLE` and record the exact
  deficient coverage groups, named source evidence, publication date/year,
  retrieval date, and deterministic recheck path.
- Recommendation context: 11 rows in promoted Work order; Anchor 5, Bridge 3,
  Discovery 3. The official volume counts and dates remain plausible at the
  2026-08-25 cutoff, and no same-series duplicate requires `seriesGroupId`.
- Model provenance remains non-human: Local Codex, exact
  `gemini-3.7-flash-high`, Cursor Grok 4.6 High non-fast for non-Art review,
  Daybreak supplemental verification, Grok `ART_ABSTAIN`, Muse `NOT_USED`, and
  `reviewedByHuman=false` in every emitted Evidence row.
- Every generated file hash in `final-overlay-validation.json` matches its current
  bytes.

## Current hashes

| Artifact | SHA-256 |
| --- | --- |
| frozen Work set | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| annotation/review/adjudication request | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| generic promotion overlay builder | `710f8be97d78aa2542cc5aea6676f13f2f91e197536f3744ffbd9690d948c7cb` |
| Batch 003 wrapper | `ba0f8bf0875549a9a2d6f36b92cb988799f0ec93bb4dc1ae4f61c302b622ab63` |
| corrected recovery A/C adjudication | `1437f6a67d646ba8d102930231e2cef0940e0a472685be66a21b8b1b6fe3836c` |
| final overlay validation | `e7a4f8ef3c5f52a2d43d59f36a488870075f1ae7afbf1382cc3837fb027117f8` |
| promotion panel | `bb589c351df134fc344ed7ef17f8c1367916f33fb5ee155e1ed7f3f52488b44c` |
| combined input/review binding | `f4f08de2b64f307247b140ef10810a100bb07e05bd42593130818edf00158bff` |

## Commands and results

```text
pnpm catalog:promotion:batch-002-overlay --check
PASS — verified 33; blocked 17

pnpm catalog:promotion:batch-003-overlay --check
PASS — verified 11; blocked 39

pnpm catalog:promotion:apply-batch-003 --check
PASS — isolated catalog v1-7ec12b11f0aa; Gold 150; verified 94;
blocked 56; pending 1314; recommendation context 244

independent identity/cardinality/order/hash/source comparison
PASS — 50 frozen; 11 verified; 39 blocked; 187 Factors; 17 Themes;
55 Evidence; 44 Art manifest rows; 11 recommendation-context rows;
209 bound inputs

independent terminal-value comparison
PASS — Narrative/Tone/Art states, values, and confidences unchanged;
Genre and Theme terminal rows unchanged
```

## Final gate

**ACCEPT.** The corrected Batch 003 overlay satisfies the frozen promotion gate and
may proceed to source application and the repository's full catalog, test, and
performance validation without changing the current 11/39 decision boundary.
