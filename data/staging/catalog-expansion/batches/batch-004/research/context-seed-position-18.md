# Batch 004 recommendation context and Art scene-context seed — position 18

- reviewedAt: `2026-08-25`
- reviewedByHuman: `false`
- scope: research-only recommendation context and Art scene-context seed for frozen position `18`
- canonical title: `とろける鉄工所`; no decorative `『` or `』` delimiters are present
- source, generated, final-overlay, builder, promotion, and terminal files were not changed

## Frozen identity

- Frozen row: position `18`, `work-39c1a2b6791238827ed5`, `とろける鉄工所`.
- Frozen representative volume: standard volume `1`, ISBN `9784063522471`, publisher 講談社, creator 野村宗弘. The identity row is unchanged.
- [講談社 volume 1](https://www.kodansha.co.jp/comic/products/0000038640) binds the title, creator, and ISBN. The title page and frozen work/volume rows contain no alternate Work, sequel, set, or decorative title delimiter.

## Recommendation context result

| Position | Work | catalogRole | seriesGroupId | volumeCount | status | reviewAverage | reviewCount |
| -------: | ---- | ------------ | ------------- | ----------: | ------ | ------------: | -----------: |
| 18 | とろける鉄工所 | bridge | _(blank)_ | 10 | completed | 4.06 | 58 |

- `catalogRole=bridge`: the frozen profile combines `sliceOfLife` with the distinct `crafting` and `workplace` themes, practical welding knowledge, workplace comedy, and family warmth. It connects occupational/craft and everyday-comedy taste clusters; this is a diversity role, not a popularity inference.
- `seriesGroupId` remains blank. No direct sequel or separate canonical Work in the frozen set establishes a shared franchise key; the effective key remains this `workId`.
- [講談社 title page](https://www.kodansha.co.jp/titles/1000004427) marks the series `完結` and identifies the latest standard numbered book as `とろける鉄工所（１０）＜完＞`, released `2013-06-21`. [The volume-10 product page](https://www.kodansha.co.jp/comic/products/0000038856) identifies the standard volume-10 ISBN `9784063524659` and the same completed title.
- The publisher's [title endpoint](https://www.kodansha.co.jp/titles/1000004427/api?count=0) lists standard numbered products 1 through 10, plus a separate `とろける鉄工所 選り抜き編`; the latter is not a main-series volume. Electronic records, the selection book, special editions, and sets are excluded. Therefore `volumeCount=10` and `status=completed`.

## Review market signal provenance

- [楽天ブックス exact ISBN search](https://books.rakuten.co.jp/search?g=001&sitem=9784063522471) currently returns the single manga result `とろける鉄工所（1）`, ISBN `9784063522471`, author 野村宗弘, release `2008年11月`, user rating `4.06`, and `レビュー58件` in the same result row.
- The CSV records `reviewAverage=4.06` and `reviewCount=58` only because this exact ISBN search is reproducible at `retrievedAt=2026-08-25`. These are mutable representative-volume market fields, separate from official identity, Factor evidence, and selection provenance.
- If a future exact-ISBN search no longer reproduces both values, blank both review fields together; do not substitute another volume, electronic edition, set, sales signal, or review prose.

## Art scene-context seed

- Authoritative Art source: [講談社 volume-1 official trial](https://www.kodansha.co.jp/comic/products/0000038640/trial), edition-mapped to frozen ISBN `9784063522471`, `retrievedAt=2026-08-25`. The accepted preflight row is `data/staging/catalog-expansion/batches/batch-004/art-preflight/chunk-02/preflight.csv`; the exact context labels come from `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-02/gemini-response.md`; final adjudication is `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-02/adjudication.md`; terminal output is `data/staging/catalog-expansion/batches/batch-004/art-review/chunk-02/final-art.csv`.
- Exact accepted page-reference tokens copied to the CSV: `reader-step-07;reader-step-11;reader-step-15;reader-step-19;reader-step-23;reader-step-27`.
- Exact accepted scene-context labels copied from the final Art review's multi-context audit: `welding shop floor;social/family/office;moonlight training & tool`. This exceeds the two-context minimum. The preflight limitation describes the same three bounded groups as welding-floor, worker-safety, and lunch-family-office contexts.
- `motionReference=none`. The accepted preflight has `motionGateAttemptable=false`; final Art leaves `motionImpact=unknown` because no one continuous start/development/impact/resolved sequence was established. Isolated tool use, vibration, or injury imagery was not promoted to motion evidence.

## Provenance boundary

- Official 講談社 product/title data establishes frozen identity, standard main-series volume count, and completed status.
- The exact Rakuten ISBN search supplies only the mutable review snapshot (`4.06`, `58`).
- The official internal trial plus accepted preflight/final-art files supply only Art page refs and scene contexts. No Art value, recommendation score, generated row, promotion decision, or source row is changed by this seed.
