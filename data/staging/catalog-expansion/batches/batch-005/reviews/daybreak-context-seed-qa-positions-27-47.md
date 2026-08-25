# Batch 005 context seed independent QA — positions 27 and 47

- reviewDate: `2026-08-25`
- reviewer: `gpt-daybreak-blue-latest`
- reviewedByHuman: `false`
- scope: Batch 005 frozen positions 27 and 47 recommendation-context draft only
- result: **PASS**

## Recomputed result

| Position | Work | catalogRole | seriesGroupId | volumeCount | publication status | reviewAverage | reviewCount |
| -------: | ---- | ----------- | ------------- | ----------: | ------------------ | ------------: | ----------: |
| 27 | 女王の花 | bridge | _(blank)_ | 15 | `completed` | 4.25 | 65 |
| 47 | デッドデッドデーモンズデデデデデストラクション | anchor | _(blank)_ | 12 | `completed` | 4.16 | 52 |

The six recommendation-context values for both works are accepted. Position 27
now uses the direct reproducible 小学館 volume-15 bibliography and the Markdown
separately cites the direct volume-1 bibliography. Position 47 passes unchanged.

## Findings

### 1. Frozen identity and representative ISBNs — accepted

- Position 27 is exactly `work-5e30ab3c7e3fb43e51f2`, `女王の花`, with
  frozen representative standard volume 1 ISBN `9784091320094`.
- Position 47 is exactly `work-f31a42ea4ad724acefa5`,
  `デッドデッドデーモンズデデデデデストラクション`, with frozen
  representative standard volume 1 ISBN `9784091865007`.
- The same workId/ISBN pairs occur in Batch 005 `source/volumes.csv`,
  `provenance/rakuten-matches.csv`, and the current canonical source volume
  rows. The official publisher volume-1 bibliographies and exact Rakuten ISBN
  searches reproduce the identities.
- Neither canonical title contains `『` or `』`. The frozen Work-set SHA-256 is
  still `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`,
  matching the manifest and payload ledger.

### 2. Standard volume counts and publication status — accepted

- 小学館's direct book page for `女王の花 15` identifies standard Flower
  Comics ISBN `9784091391247`, publication date `2017-03-24`, and the completed
  final volume. The official e-comic series page independently says
  `全15巻完結`. Therefore position 27 is complete at 15 standard main-series
  volumes.
- The corrected seed cites the direct 小学館 volume-15 bibliography instead of
  the non-reproducing Betsucomi list URL. Its source name, URL, publication date,
  volume count, and completion statement now agree.
- 小学館's cited page for
  `デッドデッドデーモンズデデデデデストラクション 12` gives standard
  paper ISBN `9784098612932`, publication date `2022-03-30`, and explicitly
  calls it the completed final volume. Therefore position 47 is complete at 12
  standard main-series volumes.
- `女王の花 青徹外伝`, the volume-15 fan-book limited edition, digital
  listings, the DDDD limited editions, the DX COMPLETE BOX, and reissues are
  separate products and are not added to either standard volume count.

### 3. Exact Rakuten market signals and date separation — accepted

Both exact ISBN searches returned one manga result on `2026-08-25` and exposed
the representative ISBN, title, creator, release date, rating, and review count
in the same result row:

- `9784091320094`: `女王の花（1）`, 和泉かねよし,
  `2008年08月26日発売`, rating `4.25`, `レビュー65件`.
- `9784091865007`: `デッドデッドデーモンズデデデデデストラクション（1）`,
  浅野いにお, `2014年09月30日頃発売`, rating `4.16`, `レビュー52件`.

The CSV correctly keeps volume provenance separate from review provenance:
`2017-03-24` versus `2008-08-26` for position 27, and `2022-03-30` versus
`2014-09-30` for position 47, with a common `retrievedAt=2026-08-25`. These are
mutable market snapshots. If either exact-ISBN result stops reproducing both
values, both review fields must be blanked together.

### 4. Catalog roles and series groups — accepted

- Position 27 is a reasonable `bridge`: the terminal evidence combines central
  romance and relationship structure with palace politics, strategy, conflict,
  and world-building. This connects relationship-led and political/historical
  drama tastes.
- Position 47 is a reasonable `anchor`: the terminal evidence combines science
  fiction and slice of life, invasion/war and school contexts, mystery and
  world-building, plus high visual density. The contrast profile is distinct
  and is not derived from popularity.
- Neither work has a separate direct sequel/franchise Work in the current Gold
  context or Batch 005 frozen set. Blank `seriesGroupId` values correctly fall
  back to each workId and do not collide with the accepted JoJo group.

### 5. Applied correction — rechecked and passed

Position 27 now exactly matches the independently recomputed row below. Position
47 remains accepted without a CSV value change.

```csv
27,work-5e30ab3c7e3fb43e51f2,女王の花,bridge,,15,4.25,65,小学館 書籍 女王の花 15,https://www.shogakukan.co.jp/books/09139124,2017-03-24,楽天ブックス ISBN検索 女王の花（1）,https://books.rakuten.co.jp/search?g=001&sitem=9784091320094,2008-08-26,2026-08-25,"Official Shogakukan volume-15 page identifies the standard Flower Comics ISBN 9784091391247, release date 2017-03-24, and the completed final volume; the official Shogakukan e-comic series page separately marks the series complete at 15 volumes. Frozen representative ISBN 9784091320094 is verified by the official volume-1 bibliography and the exact Rakuten ISBN search, which reproduces user rating 4.25 and 65 reviews. The Aotetsu side story, digital listings, fan-book limited edition, and sets are not counted as standard main-series volumes."
```

The Markdown now carries the same bounded provenance:

- `https://www.shogakukan.co.jp/books/09139124` directly reproduces volume 15,
  ISBN `9784091391247`, `2017-03-24`, and completion.
- `https://www.shogakukan.co.jp/books/09132009` directly reproduces the frozen
  representative ISBN `9784091320094`; the adjacent `shogakukan-comic.jp` route
  is redundant title/creator corroboration rather than the sole ISBN authority.
- The e-comic page remains separate `全15巻完結` corroboration, with its
  electronic release date `2017-04-07` kept separate from the standard volume
  publication date.

### 6. Compatibility with positions 4, 26, 30, and 45

Projecting all six accepted seed rows to
`workId,catalogRole,seriesGroupId,volumeCount,reviewAverage,reviewCount` passes
the current `recommendationContextSourceRowSchema`. All six workIds are unique.
Blank groups use their unique workIds; position 30 alone uses
`seriesGroupId=jojo-bizarre-adventure`, matching the existing Gold Work's
effective key without mutating that Gold row.

Publication status is a Work field rather than one of these six context fields.
The current Batch and canonical source Work rows still say `unknown` for both
positions 27 and 47. A permitted Work-overlay path must carry `completed` for
both before promotion or the `preferCompleted` policy will penalize them
incorrectly. In the existing seed family, positions 26, 30, and 45 are also
officially completed while their current source Work rows remain `unknown`;
position 4 correctly remains `unknown` from its cited bibliography alone.

### 7. Builder integration boundary

The research CSV is not directly ingestible by the current promotion overlay:

- The builder expects volume provenance as
  `sourceName,sourceUrl,sourcePublishedAt,retrievedAt,statusNote`, while this
  seed separates `volumeSource*` and `reviewSource*`.
- `scripts/catalog/promotion-overlay.ts` currently hard-codes
  `reviewAverage: ""` and `reviewCount: ""` in its output row. Without a bounded
  mapping update, all six verified Rakuten snapshots would be silently dropped.

Before promotion, map the corrected volume provenance to the existing research
contract, retain and validate review provenance independently, and emit the
paired review values instead of hard-coded blanks. This QA changes only this
report and does not edit the seed, builder, source, generated, promotion,
terminal, or frozen Gold artifacts.

## Source checks

- https://www.shogakukan.co.jp/books/09139124
- https://www.shogakukan.co.jp/books/09132009
- https://e-comi.shogakukan.co.jp/books/091391240000d0000000
- https://shogakukan-comic.jp/book?isbn=9784098612932
- https://shogakukan-comic.jp/book?isbn=9784091865007
- https://books.rakuten.co.jp/search?g=001&sitem=9784091320094
- https://books.rakuten.co.jp/search?g=001&sitem=9784091865007
