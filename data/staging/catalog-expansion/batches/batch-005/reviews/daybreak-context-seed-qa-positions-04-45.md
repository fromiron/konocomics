# Batch 005 context seed independent QA — positions 4 and 45

- reviewDate: `2026-08-25`
- reviewer: `gpt-daybreak-blue-latest`
- reviewedByHuman: `false`
- scope: Batch 005 frozen positions 4 and 45 recommendation-context draft only
- result: **PASS**

## Recomputed result

| Position | Work | catalogRole | seriesGroupId | volumeCount | publication status | reviewAverage | reviewCount |
| -------: | ---- | ----------- | ------------- | ----------: | ------------------ | ------------: | ----------: |
| 4 | 黄泉のツガイ | anchor | _(blank)_ | 13 | `unknown` from the cited bibliography alone | 4.55 | 60 |
| 45 | スピリットサークル | bridge | _(blank)_ | 6 | `completed` | 4.35 | 23 |

The corrected seed values and provenance are accepted. This PASS applies to the
two context-seed files only; the Work-status and builder integration boundaries
below remain mandatory before promotion.

## Findings

### 1. Frozen identity and representative volumes — accepted

- Frozen position 4 is exactly `work-0cf463005cc77eeded8e`, `黄泉のツガイ`.
  Its frozen representative standard volume is volume 1, ISBN
  `9784757579620`.
- Frozen position 45 is exactly `work-e658d3aee2e33c17aa38`,
  `スピリットサークル`. Its frozen representative standard volume is volume
  1, ISBN `9784785939830`.
- The same workId/ISBN pairs occur in Batch 005 `source/volumes.csv`,
  `provenance/rakuten-matches.csv`, and the current canonical source volume
  rows. Neither canonical title contains `『` or `』`.
- The frozen Work-set SHA-256 remains
  `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`,
  matching the manifest.

### 2. Volume counts and publication status — counts accepted; one status boundary recorded

- SQUARE ENIX identifies `黄泉のツガイ 13`, ISBN `9784301006343`, released
  `2026年7月10日`. Its same-series list contains standard volumes 1 through 12
  and separately labels the volume 6 special edition. Together with the
  current volume 13 page this supports `volumeCount=13` without counting the
  special edition. The cited bibliography does not label the series complete
  or ongoing, so it supports `status=unknown`, not an inferred `ongoing` value.
- 少年画報社 lists standard `スピリットサークル` volumes 1 through 6. The
  volume 6 page gives ISBN `978-4-7859-5793-3`, release date `2016-06-10`, and
  explicitly calls the story `完結`. This supports `volumeCount=6` and
  `status=completed`.
- Publication status is a Work field, not one of the six recommendation-context
  fields. The current source Work row for position 45 still says `unknown`, and
  the current promotion overlay preserves that value. Before promotion, the
  permitted Work-overlay path must carry `completed` for position 45; otherwise
  the product's `完結作優先` policy will incorrectly penalize it. Position 4
  should remain `unknown` unless a separate first-party source directly
  establishes an ongoing status.

### 3. Rakuten market signals — accepted after correction

not-found document, with identical SHA-256
Both retired direct product URLs now excluded by the corrected draft return the
same common not-found document, with identical SHA-256
not-found document, with identical SHA-256
`304085c55adb5886ac513e35fa9760391ce0f7e2ffab3d30a4cfff5364aa9ffa`:

- `https://books.rakuten.co.jp/rb/17124585/`
- `https://books.rakuten.co.jp/rb/12086390/`

They do not currently reproduce an ISBN, rating, or review count. The corrected
CSV and Markdown instead cite exact Rakuten Books ISBN searches, which are
reproducible and each return exactly one manga result containing the frozen
representative ISBN, title, creator, release date/month, rating, and count in the
same row:

- `https://books.rakuten.co.jp/search?g=001&sitem=9784757579620` —
  `黄泉のツガイ（1）`, ISBN `9784757579620`, `2022年06月10日発売`, rating
  `4.55`, `レビュー60件`.
- `https://books.rakuten.co.jp/search?g=001&sitem=9784785939830` —
  `スピリットサークル（01）`, ISBN `9784785939830`, `2012年12月発売`,
  rating `4.35`, `レビュー23件`.

`retrievedAt=2026-08-25` is correct. The rating/count pairs satisfy the current
schema. If either exact-ISBN result stops reproducing both values, both fields
must be blanked together rather than carrying an unverified snapshot forward.

### 4. Exact seed corrections — rechecked and passed

| Position | Corrected field | Accepted value |
| -------: | ------------------ | -------------- |
| 4 | `reviewSourceName` | `楽天ブックス ISBN検索 黄泉のツガイ（1）` |
| 4 | `reviewSourceUrl` | `https://books.rakuten.co.jp/search?g=001&sitem=9784757579620` |
| 45 | `reviewSourceName` | `楽天ブックス ISBN検索 スピリットサークル（01）` |
| 45 | `reviewSourceUrl` | `https://books.rakuten.co.jp/search?g=001&sitem=9784785939830` |

Both CSV `statusNote` values now attribute the market values to the exact-ISBN
search result and record the retired direct product URL's common not-found
document. The Markdown judgement rule, Review market signal provenance section,
and future-recheck wording carry the same corrected boundary. No stale direct
URL remains as review evidence.

### 5. Catalog roles and series groups — accepted

- Position 4 is a reasonable `anchor`: terminal data combines
  `action;fantasy`, central `combat`, adventure, strategy, mystery reveal,
  world-building, and a visually differentiated Art profile. This is a
  contrast role, not an inference from popularity.
- Position 45 is a reasonable `bridge`: central reincarnation, school setting,
  fantasy, mystery/world-building, relationship structure, and emotional
  warmth connect speculative and relationship-oriented taste clusters.
- Neither work is a direct sequel or a separate Work in an existing franchise
  group. Blank `seriesGroupId` values correctly use each workId as the effective
  series key.

### 6. Compatibility with positions 26 and 30 and the current schema

Projecting all four seed rows (positions 4, 45, 26, and 30) to
`workId,catalogRole,seriesGroupId,volumeCount,reviewAverage,reviewCount` passes
the current `recommendationContextSourceRowSchema`. The four workIds are unique,
and the blank groups for positions 4, 45, and 26 do not collide with position
30's accepted `seriesGroupId=jojo-bizarre-adventure` or mutate the frozen Gold
row.

The research CSV itself is not directly compatible with the current promotion
overlay ingestion contract:

- The overlay currently expects volume provenance fields named
  `sourceName,sourceUrl,sourcePublishedAt,retrievedAt,statusNote`, while this seed
  splits them into `volumeSource*` and `reviewSource*` fields.
- The final recommendation-context schema accepts both review fields, but the
  current overlay builder explicitly emits them as blank. Copying this seed into
  that path without a bounded builder update would silently discard the two
  verified market snapshots.

Integration therefore must map the volume provenance to the existing research
contract, independently retain/validate the corrected review provenance, and
emit `context.reviewAverage` plus `context.reviewCount` instead of hard-coded
blanks. This seed PASS does not clear that promotion prerequisite. This QA
updated only this report and did not edit the builder, seed, terminal, source,
generated, promotion, or Gold artifact.

## Source checks

- https://magazine.jp.square-enix.com/top/comics/detail/9784301006343/
- https://www.shonengahosha.co.jp/book_Search.php?bookTag=%E3%82%B9%E3%83%94%E3%83%AA%E3%83%83%E3%83%88%E3%82%B5%E3%83%BC%E3%82%AF%E3%83%AB
- https://www.shonengahosha.co.jp/book_Info.php?id=5310
- https://books.rakuten.co.jp/search?g=001&sitem=9784757579620
- https://books.rakuten.co.jp/search?g=001&sitem=9784785939830
