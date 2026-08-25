# Batch 005 context seed independent QA — positions 26 and 30

- reviewDate: `2026-08-25`
- reviewer: `gpt-daybreak-blue-latest`
- reviewedByHuman: `false`
- scope: Batch 005 frozen positions 26 and 30 recommendation-context draft only
- result: **ACCEPT_WITH_CORRECTIONS**

## Recomputed result

| Position | Work                     | catalogRole | seriesGroupId            | volumeCount | reviewAverage | reviewCount |
| -------: | ------------------------ | ----------- | ------------------------ | ----------: | ------------: | ----------: |
|       26 | クジラの子らは砂上に歌う | bridge      | _(blank)_                |          23 |          4.17 |          23 |
|       30 | ジョジョリオン           | anchor      | `jojo-bizarre-adventure` |          27 |          4.38 |         217 |

Canonical titles match the frozen Work set and contain neither `『` nor `』`.

## Findings

### 1. Volume counts — accepted

- 秋田書店 lists `既刊23巻`; its standard volume 23 page gives ISBN
  `978-4-253-26393-1`, release date `2023.03.16`, and `ついにフィナーレ`.
  Therefore position 26 is complete at 23 standard main-series volumes.
- ウルトラジャンプ labels the standard release `ジョジョリオン 第27巻（完）`
  and dates it `2021年9月17日`. The Shueisha bibliography also records
  `series_count=27` and `series_end_flg=1`. Therefore position 30 is complete at
  27 standard main-series volumes.
- Special editions, digital color editions, fan books, and reissues are not added.

### 2. Market signals — accepted after source URL correction

The two frozen representative ISBNs are present in both Batch 005 and source
volume rows:

- position 26: `9784253261012`
- position 30: `9784088703114`

The old direct Rakuten product URLs currently return the same not-found document
(identical SHA-256 `304085c55adb5886ac513e35fa9760391ce0f7e2ffab3d30a4cfff5364aa9ffa`).
They are not valid current evidence pages. Exact Rakuten Books ISBN searches are
currently reproducible and each returns exactly one manga result with title,
creator, representative ISBN, release month, rating, and count in one row:

- `9784253261012`: `4.17`, `レビュー23件`, `2013年12月発売`
- `9784088703114`: `4.38`, `レビュー217件`, `2011年12月発売`

The draft now cites those search URLs. Blanking or setting count to zero is not
required while the official exact-ISBN result reproduces both values. If a future
build cannot reproduce the result, `reviewAverage` and `reviewCount` must both be
left blank rather than carrying this snapshot forward as an unverified value.

### 3. Catalog roles — accepted

- Position 26 remains `bridge`: its terminal data joins central survival fantasy
  and high world-building with community relationships, emotional warmth, and
  political pressure. This bridges setting/survival and relationship-oriented
  taste clusters rather than merely encoding popularity.
- Position 30 remains `anchor`: action, fantasy, central investigation,
  mystery-reveal emphasis, very high visual density, and rough/angular visual
  treatment form a clear contrast profile suitable for an anchor.

### 4. JoJolion series grouping — corrected without Gold mutation

The product contract defines the effective series key as
`seriesGroupId ?? workId`. Existing Gold `jojo-bizarre-adventure` has a blank
`seriesGroupId`, so its effective key is already `jojo-bizarre-adventure`.
Assigning that exact value to the new JoJolion row groups the two works while
leaving the frozen Gold row byte-for-byte unchanged.

The prior proposal `jojo-bizarre-adventure-franchise` would only work if the Gold
row were also mutated, which is prohibited. The draft is corrected to
`seriesGroupId=jojo-bizarre-adventure` and no Gold/source/final-overlay/generated
row was edited.

## Source checks

- https://www.akitashoten.co.jp/series/3463
- https://www.akitashoten.co.jp/comics/4253263933
- https://ultra.shueisha.co.jp/comics/comics-3938/
- https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000016953800
- https://books.rakuten.co.jp/search?g=001&sitem=9784253261012
- https://books.rakuten.co.jp/search?g=001&sitem=9784088703114

## Scope boundary

Only the two research draft files were corrected. No source, generated,
promotion-registry, final-overlay, or Gold row was modified.
