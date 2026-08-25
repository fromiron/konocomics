# Batch 005 recommendation context and Art scene-context seed — position 23

- reviewedAt: `2026-08-25`
- reviewedByHuman: `false`
- scope: research-only recommendation context and Art scene-context seed for frozen position `23`
- canonical title: `千年万年りんごの子`; frozen title has no decorative `『` or `』` delimiters
- source, generated, final-overlay, builder, promotion, and terminal files were not changed

## Frozen identity

- Frozen row: position `23`, `work-43ebf010a490cfd4bb50`, `千年万年りんごの子`.
- Frozen representative volume: standard volume `1`, ISBN `9784063805789`, publisher 講談社, creator 田中 相. The identity row is unchanged.
- [講談社 volume 1](https://www.kodansha.co.jp/comic/products/0000046459) binds the title, creator, and frozen representative ISBN. The title and volume rows contain no alternate Work, sequel, set, or decorative title delimiter.

## Recommendation context result

| Position | Work | catalogRole | seriesGroupId | volumeCount | status | reviewAverage | reviewCount |
| -------: | ---- | ------------ | ------------- | ----------: | ------ | ------------: | -----------: |
| 23 | 千年万年りんごの子 | bridge | _(blank)_ | 3 | completed | 4.07 | 47 |

- `catalogRole=bridge`: the frozen profile combines a central married relationship and romance with a supernatural village custom, seasonal setting, and mystery/world-building structure. It connects relationship-oriented and speculative/rural-folklore taste clusters; this is a diversity role, not a popularity inference.
- `seriesGroupId` remains blank. No direct sequel or separate canonical Work in the frozen set establishes a shared franchise key; the effective key remains this `workId`.
- [講談社 title page](https://www.kodansha.co.jp/titles/1000005956) marks the series `完結`, lists `全3件`, and identifies the latest standard numbered book as volume 3. [The official volume-3 product page](https://www.kodansha.co.jp/comic/products/0000046557) identifies the standard volume-3 ISBN `9784063806786`, release date `2014-03-07`, and the completed title.
- [The official volume-1 product page](https://www.kodansha.co.jp/comic/products/0000046459) identifies frozen representative ISBN `9784063805789` and release date `2012-07-06`; volume 2 is separately identified by [its official product page](https://www.kodansha.co.jp/comic/products/0000046505) with ISBN `9784063806250` and release date `2013-05-07`. The standard main series is therefore `volumeCount=3` and `status=completed`.
- Electronic records, any special or bundled product, and related works are not counted as standard main-series volumes.

## Review market signal provenance

- [楽天ブックス exact ISBN search](https://books.rakuten.co.jp/search?g=001&sitem=9784063805789) currently returns one manga result for `千年万年りんごの子（1）`, ISBN `9784063805789`, author 田中 相, release `2012年07月`, user rating `4.07`, and `レビュー47件` in the same result row.
- The exact ISBN search was fetched twice on `2026-08-25`; both responses reproduced the title/ISBN row and the same `4.07` / `47` pair. The CSV records these mutable representative-volume market fields only because that exact search is reproducible at `retrievedAt=2026-08-25`.
- The review snapshot is separate from official identity, volume/status provenance, Factor evidence, and award/selection provenance. If a future exact-ISBN search no longer reproduces both values, blank `reviewAverage` and `reviewCount` together; do not substitute another volume, electronic edition, set, sales signal, or review prose.

## Art scene-context seed

- Authoritative Art source: [講談社 volume-1 official trial](https://www.kodansha.co.jp/comic/products/0000046459/trial/reader?cid=16004bb7861da5596a0684a912a8f99c1021434d87c50d73d1a592067049f05b), edition-mapped to frozen ISBN `9784063805789`, retrieved `2026-08-25`. The accepted preflight row and exact scene-context source are `data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-03/preflight.csv`; independent Gemini review is `data/staging/catalog-expansion/batches/batch-005/art-review/chunk-03/gemini-response.md`; final adjudication is `data/staging/catalog-expansion/batches/batch-005/art-review/chunk-03/adjudication.md`; terminal output is `data/staging/catalog-expansion/batches/batch-005/art-review/chunk-03/final-art.csv`.
- Exact accepted page-reference tokens copied to the CSV: `reader-step-04;reader-step-05;reader-step-06;reader-step-07;reader-step-08;reader-step-09`. The six selected body pages were hash-verified `6/6` in the current preflight/final Art packet.
- Exact preflight scene-context labels copied to the CSV: `mountain or outdoor scenes;domestic interiors;community or family gatherings`. The final Art observations independently retain temple/interior, landscape, clothing, banquet, and group evidence across those contexts; no cover, title splash, contents page, advertisement, or synopsis material was used.
- `motionReference=none`. The accepted preflight has `motionGateAttemptable=false`; final Art leaves `motionImpact=unknown` because no one continuous start/development/impact/resolved sequence was established. Ordinary gestures and scene transitions were not promoted to motion evidence.

## Provenance boundary

- Official 講談社 title and product data establish frozen identity, standard main-series volume count, and completed status.
- The exact Rakuten ISBN search supplies only the mutable review snapshot (`4.07`, `47`).
- The official internal trial plus accepted preflight/final-art files supply only Art page refs and scene contexts. No Art value, recommendation score, generated row, promotion decision, or source row is changed by this seed.
