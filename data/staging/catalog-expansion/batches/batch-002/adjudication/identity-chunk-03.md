# Batch 002 chunk 03 identity adjudication

- adjudicationDate: 2026-08-23
- reviewedByHuman: false
- adjudicator: Local Codex
- inputReview: `../reviews/identity-safety-chunk-03.md`
- scope: first-publication metadata, release dates, and edition precision
- hardBlockers: 0

## Decisions

| workId                      | decision                                                                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `work-5cafd57db6b870a71a05` | Set Work year to 1988; retain wide-volume ISBN `9784091247216`; change unsupported `editionKind=standard` to `unknown`; keep its approximate release day out of the exact date field. |
| `work-5ebbc9bede841d2faf7b` | Set Work year to 2012 and representative release date to 2013-09-25.                                                                                                                  |
| `work-6f849a8e785deee3d5dc` | Set Work year to 2016; retain the 2017-03-03 volume date.                                                                                                                             |
| `work-71e824df2e6bc2125294` | Set Work year to 2020; retain the 2021-04-02 volume date.                                                                                                                             |
| `work-7975d62582a89492a35f` | Set Work year to 2017; retain the 2018-04-06 volume date.                                                                                                                             |
| `work-7d259c925286a9f91310` | Set Work year to 2006; retain the 2008-01-23 volume date.                                                                                                                             |
| `work-8147aefccc365b0ecb4d` | Set Work year to 2006; retain the 2007-02-27 volume date.                                                                                                                             |
| `work-838a6f0ad2d1ef487588` | Retain Work year 2009 and set the verified volume date to 2009-11-12.                                                                                                                 |
| `work-83fc3c4366e51b35b821` | Set Work year to 1976; retain original standard ISBN `9784091302212`; keep its approximate release day out of the exact date field.                                                   |

The edition enum has no `wide` value. Marking the パトレイバー volume as
`standard` would assert a false edition identity, so `unknown` preserves the
verified ISBN without inventing a new schema value. The missing standard-to-wide
contents bridge means later annotation cannot bind standard-volume summaries to
this representative range; it does not invalidate the canonical Work.

Likewise, the 風と木の詩 representative ISBN is an original standard edition,
while the available detailed publisher summaries describe later bunko volumes.
Those descriptions remain unavailable for direct entry-range annotation until
an official contents bridge is found. This is not an identity or safety blocker.

## Evidence

- sourceName: 小学館 少年サンデー 機動警察パトレイバー work page
  - sourceUrl: https://websunday.net/4213/
  - publishedAt: 2021-04-06; states 1988–1994 serialization
  - retrievedAt: 2026-08-23
- sourceName: 集英社 高台家の人々 1 official product page
  - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-845109-1
  - publishedAt: 2013-09-25
  - retrievedAt: 2026-08-23
- sourceName: 集英社 怪物事変 1 official product page
  - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-881096-6
  - publishedAt: 2017-03-03
  - retrievedAt: 2026-08-23
- sourceName: 集英社 SAKAMOTO DAYS 1 official product page
  - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882657-8
  - publishedAt: 2021-04-02
  - retrievedAt: 2026-08-23
- sourceName: 講談社 図書館の大魔術師 1 official product page
  - sourceUrl: https://www.kodansha.co.jp/comic/products/0000115421
  - publishedAt: 2018-04-06
  - retrievedAt: 2026-08-23
- sourceName: 講談社 聖☆おにいさん 1 official product page
  - sourceUrl: https://www.kodansha.co.jp/comic/products/0000013718
  - publishedAt: 2008-01-23
  - retrievedAt: 2026-08-23
- sourceName: スクウェア・エニックス 黒執事 1 official product page
  - sourceUrl: https://magazine.jp.square-enix.com/top/comics/detail/9784757519633/
  - publishedAt: 2007-02-27
  - retrievedAt: 2026-08-23
- sourceName: 小学館 信長協奏曲 1 official product page
  - sourceUrl: https://www.shogakukan.co.jp/books/09122100
  - publishedAt: 2009-11-12
  - retrievedAt: 2026-08-23
- sourceName: eBook Initiative Japan 風と木の詩 publication-history release
  - sourceUrl: https://prtimes.jp/a/?c=1485&f=d1485-666-pdf-0.pdf&r=666
  - publishedAt: 2017; states 1976–1984 serialization
  - retrievedAt: 2026-08-23

No canonical title, `『』` delimiter, Factor, Genre, Theme, Art value,
eligibility, recommendation math, validator rule, or Gold data is changed by
this adjudication.
