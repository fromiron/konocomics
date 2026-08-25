# Batch 004 current full-gate overlay context seed independent QA

- reviewDate: `2026-08-25`
- reviewer: `gpt-daybreak-blue-latest`
- reviewedByHuman: `false`
- scope: `research/overlay-context-seed-current-full.csv` and `.md`, positions `03, 14, 17, 20, 21, 43, 44, 47, 49`
- result: **PASS**
- recheck CSV SHA-256: `5e1aa307840c6e408076403e54311977c3a47de4b09deb44bc6a8f6a39549b58`
- recheck Markdown SHA-256: `4c80266befeea21e2b47b7be5735ae31d8d7908b1893e4becb33ae29d77ebbbf`
- seed corrections independently reverified: `true`

## Recomputed gate and binding result

The terminal text and aggregate terminal Art matrices independently reproduce exactly these nine full-gate positions in frozen order. Position 14 is `4/6` Narrative, `6/7` Tone, and `3/4` Art; every other row is `4/6`, `5/7`, and `3/4`. No other frozen position passes all three unchanged coverage thresholds.

All nine seed rows match `frozen-work-set.csv` for position, `workId`, canonical title, and order. Every canonical title is free of decorative title delimiters. Each row contains six page-ref tokens, and the token list exactly matches both its selected current Art preflight row and all four rows of the current aggregate `final-art.csv` for that Work.

All nine terminal motion rows are `motionImpact=unknown`, every selected preflight has `motionGateAttemptable=false`, and every seed `motionReference` is `none`. No motion reference was fabricated from isolated action or impact imagery.

## Art context and provenance audit

| Pos. | Current authoritative Art source | Pages / contexts | Published | Retrieved | QA |
| ---: | --- | ---: | --- | --- | --- |
| 03 | recovery: 新潮社 products and publisher-operated Comic Bunch Kai first episode | 6 / 4 | `2014-04-09;2014-10-09;2015-04-09` | `2026-08-25` | PASS |
| 14 | 講談社 exact volume-1 trial | 6 / 3 | `2024-03-06` | `2026-08-25` | PASS |
| 17 | COMICリュウ official Chapter 1 and volume-1 bridge | 6 / 3 | `2013-03-30` | `2026-08-25` | PASS |
| 20 | 集英社 exact-ISBN single-volume reader | 6 / 3 | `2023-10-23` | `2026-08-25` | PASS |
| 21 | recovery: 集英社 exact products and readers for volumes 2 and 3 | 6 / 2 | `2020-04-03;2020-06-04;2020-09-04` | `2026-08-25` | PASS |
| 43 | SQUARE ENIX product-linked first episode | 6 / 2 | `2016-09-24` | `2026-08-25` | PASS |
| 44 | recovery: 白泉社 exact volume-1 product-linked reader | 6 / 3 | `2015-03-20` | `2026-08-25` | PASS |
| 47 | 集英社 official electronic volume-1 reader bridged to the frozen paper volume | 6 / 3 | `2022-11-04` | `2026-08-25` | PASS |
| 49 | 集英社 exact-ISBN volume-1 reader | 6 / 3 | `2009-08-04` | `2026-08-25` | PASS |

Every authoritative preflight row has a non-empty official URL, edition mapping, publication date, and retrieval date. Recovery provenance for positions 03, 21, and 44 is preserved in the referenced recovery preflight and ledger, and the corresponding recovery vectors are already present in the current aggregate final-Art files.

All nine scene-label sets are bounded by their retained official refs and satisfy the two-context minimum. Position 44 now uses the later independent original-pixel adjudication's exact bounded contexts: `formal meeting`, `school/transit`, and `restaurant/home-preparation`.

## Existing final-overlay comparison

The recommendation-context research and final rows exist only for positions 14, 17, and 20, as the seed says. The builder and existing final Art manifest match the current seed context string for positions 17 and 20. For position 14 they contain `school and store;food interaction;apartment kitchen`, while the current preflight and seed contain `school and store;food interaction;apartment kitchen thriller`. The corrected seed now records that mismatch exactly; its Art context remains supported.

## Applied corrections reverified

### CSV rows

```csv
14,work-2d385ad0525742330e70,ねずみの初恋,4,6,6,7,3,4,reader-page-P0008@IB_TxaSt.jpg;reader-step-11;reader-step-15;reader-step-19;reader-step-23;reader-step-27,"school and store;food interaction;apartment kitchen thriller",none,data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-02/preflight.csv,present,present,existing overlay scene map omits thriller from the current Art preflight third context,false,existing row supplies recommendation volume context; scene map is present but not an exact current Art context match
44,work-e2f095e08fc5e08d5a2b,高嶺と花,4,6,5,7,3,4,hakusensha-reader-page-07;hakusensha-reader-page-09;hakusensha-reader-page-11;hakusensha-reader-page-13;hakusensha-reader-page-15;hakusensha-reader-page-17,"formal meeting;school/transit;restaurant/home-preparation",none,data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-05/recovery-pos44-preflight.csv,missing,missing,missing-from-existing-overlay;final recovery adjudication supplies three distinct contexts,false,final recovery adjudication and aggregate final Art rows are the authoritative source
```

### Markdown lines

```markdown
- all canonical titles were checked for decorative `『` or `』` delimiters; none are present
```

```markdown
The existing final-overlay recommendation-context CSVs contain rows only for positions `14`, `17`, and `20`. The existing builder scene-context map contains those same three works. Positions `17` and `20` match the current Art preflight wording. Position `14` is present but omits `thriller` from the third current Art context. Positions `03`, `21`, `43`, `44`, `47`, and `49` have no existing final-overlay context row or scene-context map entry; their seeds are therefore recorded here for the later overlay update. This file intentionally does not modify the builder or generated overlay.
```

```markdown
| 14 | ねずみの初恋 | school and store; food interaction; apartment kitchen thriller | present but not an exact current Art-context match | Kodansha entry-volume official preview |
| 44 | 高嶺と花 | formal meeting; school/transit; restaurant/home-preparation | missing | corrected Hakusensha entry-volume recovery and final original-pixel adjudication |
```

## Scope boundary

This recheck edited only this QA report. The parent-applied seed corrections match the exact rows and Markdown text above. Builder, terminal Art, source, generated, final-overlay, and promotion files were not edited during this recheck.
