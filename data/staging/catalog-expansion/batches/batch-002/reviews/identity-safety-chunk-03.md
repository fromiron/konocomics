# Batch 002 chunk 03 identity, safety, and edition review

- reviewDate: 2026-08-23
- retrievedAt: 2026-08-23
- reviewedByHuman: false
- reviewer: Local Codex independent review
- reviewedRange: batch-002 frozen work set positions 21–30
- reviewScope: canonical identity, safety and scope, representative ISBN and edition mapping, first-publication metadata, and research metadata only
- excludedFromReview: Factor values, Genre assignment, Theme assignment, centrality, and Art values
- sourceMutation: none

This review compares the frozen selection and research packet with the current
`works.csv`, `volumes.csv`, `canonical-mapping.csv`, `rakuten-matches.csv`,
`safety-review.csv`, and `promotion-registry.csv` rows. All ten representative
ISBN-13 values pass checksum validation and each occurs exactly once in the
current `data/source/volumes.csv`. That is an intra-catalog uniqueness check,
not an external identity source.

The Rakuten candidate rows do not contain a reliable nationality or original
format field. Scope conclusions below therefore do not infer nationality or
original format from that API, and no nationality-inference test is proposed.
They rely on official Japanese publisher or magazine pages that identify a
manga Work, creator, serial venue or comics imprint, and the matched bound
edition.

Violence, killing, horror, religion, same-sex relationships, abuse, or other
sensitive story content is not treated as an adult-only sales classification.
A safety PASS means the reviewed official publisher and retailer product is an
ordinary manga edition with no R18, 成人向け, 成年コミック, or equivalent
adult-only marker. It is not a reader-age or content-suitability rating.

## Summary

| workId                      | canonicalTitle       | verdict            | representative ISBN | edition conclusion                               | safety and scope |
| --------------------------- | -------------------- | ------------------ | ------------------- | ------------------------------------------------ | ---------------- |
| `work-5cafd57db6b870a71a05` | 機動警察パトレイバー | needs-adjudication | `9784091247216`     | later 少年サンデーコミックスワイド版 volume 1    | PASS             |
| `work-5e20323e014d6d390aaf` | あさひなぐ           | PASS               | `9784091837981`     | standard ビッグコミックス volume 1               | PASS             |
| `work-5ebbc9bede841d2faf7b` | 高台家の人々         | needs-adjudication | `9784088451091`     | standard マーガレットコミックス volume 1         | PASS             |
| `work-6f849a8e785deee3d5dc` | 怪物事変             | needs-adjudication | `9784088810966`     | standard ジャンプコミックス volume 1             | PASS             |
| `work-71e824df2e6bc2125294` | SAKAMOTO DAYS        | needs-adjudication | `9784088826578`     | standard ジャンプコミックス volume 1             | PASS             |
| `work-7975d62582a89492a35f` | 図書館の大魔術師     | needs-adjudication | `9784065112434`     | standard アフタヌーンKC volume 1                 | PASS             |
| `work-7d259c925286a9f91310` | 聖☆おにいさん        | needs-adjudication | `9784063726626`     | standard モーニングKC volume 1                   | PASS             |
| `work-8147aefccc365b0ecb4d` | 黒執事               | needs-adjudication | `9784757519633`     | standard Gファンタジーコミックス volume 1        | PASS             |
| `work-838a6f0ad2d1ef487588` | 信長協奏曲           | PASS               | `9784091221001`     | standard ゲッサン少年サンデーコミックス volume 1 | PASS             |
| `work-83fc3c4366e51b35b821` | 風と木の詩           | needs-adjudication | `9784091302212`     | original 小学館 フラワーコミックス volume 1      | PASS             |

Result: 2 PASS and 8 needs-adjudication. Eight items need narrow
`firstPublishedYear` corrections because the current value is the volume-1 or
later-edition release year. 機動警察パトレイバー and 風と木の詩 also need an
official edition-to-edition contents bridge before content annotation from a
different edition can be bound to the frozen representative range. Four blank
`volumes.releaseDate` cells remain: two have exact publisher dates available,
while the two older products expose only approximate retailer dates that must
not be coerced into an exact ISO date.
None is a safety or scope hard blocker. No duplicate ISBN, adult-only item,
webtoon or vertical-scroll original, non-manga product, duplicate Work, or
identity hard blocker was found.

## 21. work-5cafd57db6b870a71a05 — 機動警察パトレイバー

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. The official 少年サンデー page identifies
  機動警察パトレイバー, creator ゆうきまさみ, and the 1988–1994
  週刊少年サンデー manga serialization. The award row and Rakuten product
  map the same Work and creator rather than an animation or prose product.
- current source and staging: title, creator, original publisher, canonical
  mapping, and the unique representative ISBN are sound.
  `works.firstPublishedYear=1995` is the wide-edition release year, not the
  Work's first publication year. `volumes.releaseDate` is blank and
  `editionKind=standard` loses the explicit wide-edition identity.
- first-publication audit: needs correction from 1995 to 1988. The official
  少年サンデー page gives the serialization range as 1988 issue 17 through
  1994 issue 23. The 1995 date belongs only to the later representative edition.
- representative edition: conditionally PASS — ISBN `9784091247216`, later
  少年サンデーコミックスワイド版 volume 1, approximately released
  1995-07-15, 362 pages. Its checksum is valid and it occurs once in the source
  catalog. The current edition enum has no `wide` value; retain the ISBN but
  preserve the later-wide identity explicitly instead of treating it as an
  original standard volume.
- edition bridge: needs adjudication. The official content packet covers the
  22-volume standard edition's volumes 1–3, while the frozen representative is
  wide volume 1. Obtain an official contents table or publisher bridge before
  asserting that the two ranges are equivalent. Do not split the Work or
  replace the ISBN merely to reuse the available summaries.
- safety and scope: PASS. The official publisher identifies a completed
  週刊少年サンデー page-manga and the matched product is an ordinary comics
  edition. Police and robot violence in the premise is not an adult-only sales
  marker, and none appears on the reviewed products.
- research metadata: needs-adjudication only for the Work year, blank release
  date, and explicit edition bridge. The packet correctly isolates the wide
  product as canonical-edition evidence and does not claim a contents mapping.
- limitations: The Rakuten date is displayed with an approximate-day suffix.
  Keep the exact-date source cell blank unless a publisher date or a
  precision-aware field is added. The original standard-to-wide chapter mapping
  also remains unavailable in the reviewed official sources.
- evidence:
  - sourceName: 小学館 少年サンデー 機動警察パトレイバー work page
    - sourceUrl: https://websunday.net/4213/
    - publishedAt: 2021-04-06; states serialization from 1988 issue 17 to 1994 issue 23
    - retrievedAt: 2026-08-23
  - sourceName: 小学館 eコミックストア 機動警察パトレイバー 1
    - sourceUrl: https://e-comi.shogakukan.co.jp/books/091221210000d0000000
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 機動警察パトレイバー wide volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/739903/
    - publishedAt: 1995-07-15 approximate product date
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 1990
    - retrievedAt: 2026-08-23

## 22. work-5e20323e014d6d390aaf — あさひなぐ

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. 小学館 identifies あさひなぐ, creator
  こざき亜衣, ビッグコミックスピリッツ, and the numbered 34-volume
  manga. Three frozen memberships are duplicate provenance for one Work.
- current source and staging: title, creator, publisher, representative ISBN,
  canonical mappings, and `works.firstPublishedYear=2011` agree with the
  official series record.
- first-publication audit: PASS. The official スピリッツ work list records the
  series from 2011-01 through 2020-09, so the Work year is not merely the
  2011-04-28 standard-volume release year.
- representative edition: PASS — ISBN `9784091837981`, standard
  ビッグコミックス volume 1, released 2011-04-28. Its checksum is valid and
  it occurs once in the source catalog. It is not a wide, bunko, complete,
  limited, or set edition.
- safety and scope: PASS. The publisher and retailer present an ordinary
  ビッグコミックス sports manga and bound volume. Competition and training
  content do not create an adult-only classification, and no marker appears.
- research metadata: PASS. The first-three-volume publisher summaries and
  frozen representative volume use the same standard volume numbering.
- limitations: The e-comic summaries are undated. The official work list
  verifies the year and month but not an exact first-issue day.
- evidence:
  - sourceName: 小学館 Big Comic Bros スピリッツ all-work list
    - sourceUrl: https://bigcomicbros.net/allworklist-spirits/
    - publishedAt: undated; records 2011-01 through 2020-09
    - retrievedAt: 2026-08-23
  - sourceName: 小学館 eコミックストア あさひなぐ 1
    - sourceUrl: https://e-comi.shogakukan.co.jp/books/091837980000d0000000
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books あさひなぐ 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/11126631/
    - publishedAt: 2011-04-28
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 2014
    - retrievedAt: 2026-08-23

## 23. work-5ebbc9bede841d2faf7b — 高台家の人々

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 集英社 binds 高台家の人々, creator 森本梢子,
  YOU publication, and the six-volume マーガレットコミックス series.
  Five source memberships collapse to this one Work; the separately labelled
  bonus story in volume 6 does not create a second canonical Work.
- current source and staging: title, creator, publisher, demographic,
  representative ISBN, and mappings are consistent. `works.firstPublishedYear`
  and `volumes.releaseDate` both need narrow repairs.
- first-publication audit: needs correction from 2013 to 2012. A dated
  contemporaneous publication record identifies the first reading in the
  2012-11-15 issue of 月刊YOU, while the official 集英社 volume page identifies
  the collected Work as YOU material. Retain 2013 only as volume-1 metadata.
- representative edition: PASS — ISBN `9784088451091`, standard
  マーガレットコミックス volume 1, released 2013-09-25. Its checksum is
  valid and it occurs once in the source catalog. Fill the currently blank
  `volumes.releaseDate`; do not create a separate Work for the first reading or
  later continuing serialization.
- safety and scope: PASS. The official product is an ordinary YOU manga and
  standard bound comic. Telepathy, romance, and family conflict are story
  content, not adult-only product markers, and no such marker appears.
- research metadata: needs-adjudication only for the first-publication year and
  blank release date. The packet correctly uses 集英社's numbered chapter list
  for the same standard 1–3 volume range.
- limitations: The defunct magazine's official issue archive was not available.
  The 2012 start is supported by contemporaneous trade reporting plus the
  publisher's YOU attribution; retain that provenance when applying the year
  repair rather than treating the 2013 volume as the first publication.
- evidence:
  - sourceName: 集英社 高台家の人々 1 official product page
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-845109-1
    - publishedAt: 2013-09-25
    - retrievedAt: 2026-08-23
  - sourceName: Comic Natalie 月刊YOU 2012-12 issue publication report
    - sourceUrl: https://natalie.mu/comic/news/79944
    - publishedAt: 2012-11-15
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 高台家の人々 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/12417181/
    - publishedAt: 2013-09-25
    - retrievedAt: 2026-08-23
  - sourceName: 次にくるマンガ大賞 2015 comics results
    - sourceUrl: https://tsugimanga.jp/winner/2015/comics
    - publishedAt: 2015-02-06
    - retrievedAt: 2026-08-23

## 24. work-6f849a8e785deee3d5dc — 怪物事変

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. The official ジャンプSQ and 集英社 pages bind
  怪物事変, creator 藍本松, the first serialization, and the numbered
  ジャンプコミックス series. Two memberships map to one Work.
- current source and staging: title, creator, publisher, representative ISBN,
  and mappings are sound. `works.firstPublishedYear=2017` reflects the cover
  year of the 2017-01 magazine issue and the volume year, not the issue's actual
  first publication date.
- first-publication audit: needs correction from 2017 to 2016. The official
  少年ジャンプ＋ magazine record dates the 2017-01 issue and the new
  serialization to 2016-12-02. The 2017-03-03 date remains the standard volume-1
  release date.
- representative edition: PASS — ISBN `9784088810966`, standard
  ジャンプコミックス volume 1, released 2017-03-03. Its checksum is valid and
  it occurs once in the source catalog. It is not a later collected or special
  edition.
- safety and scope: PASS. The official source identifies a ジャンプSQ page
  manga and an ordinary standard comic. Deaths and supernatural beings in the
  premise do not constitute an adult-only sales marker, and none appears.
- research metadata: needs-adjudication only for the Work year. The first three
  official volume pages map directly to the frozen standard numbering.
- limitations: The magazine's issue label is 2017-01, but the year-level Work
  field follows the actual first publication date, 2016-12-02.
- evidence:
  - sourceName: 少年ジャンプ＋ ジャンプSQ 2017-01 issue
    - sourceUrl: https://shonenjumpplus.com/magazine/3270296674393062425
    - publishedAt: 2016-12-02
    - retrievedAt: 2026-08-23
  - sourceName: 集英社 怪物事変 1 official product page
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-881096-6
    - publishedAt: 2017-03-03
    - retrievedAt: 2026-08-23
  - sourceName: ジャンプSQ 怪物事変 official series page
    - sourceUrl: https://jumpsq-sp.shueisha.co.jp/rensai/kemonojihen/
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: 次にくるマンガ大賞 2018 comics results
    - sourceUrl: https://tsugimanga.jp/winner/2018/comics
    - publishedAt: 2018-08-23
    - retrievedAt: 2026-08-23

## 25. work-71e824df2e6bc2125294 — SAKAMOTO DAYS

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. The official 少年ジャンプ page identifies
  SAKAMOTO DAYS, creator 鈴木祐斗, and the 2020 issue 51 serialization start.
  集英社 binds the same title and creator to the numbered standard volumes.
- current source and staging: title, creator, publisher, representative ISBN,
  and canonical mappings are consistent. `works.firstPublishedYear=2021` is
  the first volume year rather than the serialization year.
- first-publication audit: needs correction from 2021 to 2020. The official
  series page states that serialization began in 2020 issue 51. Keep
  2021-04-02 only as the standard volume-1 release date.
- representative edition: PASS — ISBN `9784088826578`, standard
  ジャンプコミックス volume 1, released 2021-04-02. Its checksum is valid and
  it occurs once in the source catalog. It is not a set or special edition.
- safety and scope: PASS. 集英社 presents an ordinary 週刊少年ジャンプ manga
  and standard comic. The assassin premise and violence do not by themselves
  create an adult-only sales classification, and no adult-only marker appears.
- research metadata: needs-adjudication only for the Work year. The first-three-
  volume packet and representative ISBN share the same standard numbering.
- limitations: The official series page gives the magazine issue rather than a
  calendar-day start. The year is nevertheless explicit and sufficient for the
  year-level field.
- evidence:
  - sourceName: 少年ジャンプ SAKAMOTO DAYS official series page
    - sourceUrl: https://sp.shonenjump.com/j/rensai/sakamoto/
    - publishedAt: undated; states serialization began in 2020 issue 51
    - retrievedAt: 2026-08-23
  - sourceName: 集英社 SAKAMOTO DAYS 1 official product page
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=9784088826578
    - publishedAt: 2021-04-02
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books SAKAMOTO DAYS 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/16655172/
    - publishedAt: 2021-04-02
    - retrievedAt: 2026-08-23
  - sourceName: 次にくるマンガ大賞 2021 comics results
    - sourceUrl: https://tsugimanga.jp/winner/2021/comics
    - publishedAt: 2021-08-24
    - retrievedAt: 2026-08-23

## 26. work-7975d62582a89492a35f — 図書館の大魔術師

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 講談社's アフタヌーン site identifies
  図書館の大魔術師, creator 泉光, and its good!アフタヌーン
  serialization. The four memberships are repeat provenance for one Work.
- current source and staging: title, creator, publisher, representative ISBN,
  and mappings are consistent. `works.firstPublishedYear=2018` is the first
  bound-volume year, not the first serialization year.
- first-publication audit: needs correction from 2018 to 2017. The official
  work page states that serialization began in good!アフタヌーン 2017 issue 12. Retain 2018-04-06 only as standard volume-1 release metadata.
- representative edition: PASS — ISBN `9784065112434`, standard
  アフタヌーンKC volume 1, released 2018-04-06. Its checksum is valid and it
  occurs once in the source catalog. It is not a later collected edition.
- safety and scope: PASS. The official page identifies a page-based manga
  serialization and ordinary 講談社 bound comic. Discrimination and fantasy
  conflict in the premise are not adult-only product markers, and none appears.
- research metadata: needs-adjudication only for the Work year. The first and
  third official volume pages expose their magazine issue ranges and support
  the standard-volume mapping.
- limitations: The official page gives an issue label rather than an exact day.
  No original-format claim is taken from Rakuten.
- evidence:
  - sourceName: 講談社 アフタヌーン 図書館の大魔術師 official work page
    - sourceUrl: https://afternoon.kodansha.co.jp/c/toshodai.html
    - publishedAt: undated; states serialization began in 2017 issue 12
    - retrievedAt: 2026-08-23
  - sourceName: 講談社 図書館の大魔術師 1 official product page
    - sourceUrl: https://www.kodansha.co.jp/comic/products/0000115710
    - publishedAt: 2018-04-06
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 図書館の大魔術師 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/15388202/
    - publishedAt: 2018-04-06
    - retrievedAt: 2026-08-23
  - sourceName: 次にくるマンガ大賞 2018 comics results
    - sourceUrl: https://tsugimanga.jp/winner/2018/comics
    - publishedAt: 2018-08-23
    - retrievedAt: 2026-08-23

## 27. work-7d259c925286a9f91310 — 聖☆おにいさん

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 講談社 identifies 聖☆おにいさん, creator
  中村光, the モーニング・ツー publication, and the numbered standard
  volumes. Five source memberships collapse to the same Work.
- current source and staging: title, creator, publisher, representative ISBN,
  and mappings are sound. `works.firstPublishedYear=2008` is the volume-1
  release year rather than the original magazine publication year.
- first-publication audit: needs correction from 2008 to 2006. The official
  volume page states that serialization began in 2006 and gives the initial
  publication range as モーニング・ツー 2006 issues 1–2 and 2007 issues 3–6.
- representative edition: PASS — ISBN `9784063726626`, standard モーニングKC
  volume 1, released 2008-01-23. Its checksum is valid and it occurs once in the
  source catalog. It is not bunko, complete, limited, or a set.
- safety and scope: PASS. The official product is an ordinary 講談社 manga
  volume. Religious figures and satire are story subject matter, not an
  adult-only sales label, and no adult-only marker appears.
- research metadata: needs-adjudication only for the Work year. The first-three-
  volume official pages and frozen ISBN use the same standard volume structure.
- limitations: The 2006 material includes the magazine's early issue numbering;
  this review records the explicit year without inferring a more precise date.
- evidence:
  - sourceName: 講談社 聖☆おにいさん 1 official product page
    - sourceUrl: https://www.kodansha.co.jp/comic/products/0000013790
    - publishedAt: 2008-01-23; states initial publication began in 2006
    - retrievedAt: 2026-08-23
  - sourceName: 講談社 Morning Two web-relaunch announcement
    - sourceUrl: https://morning.kodansha.co.jp/news/5474.html
    - publishedAt: 2022-07-22; states magazine launch in 2006
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 聖☆おにいさん 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/5360347/
    - publishedAt: 2008-01-23
    - retrievedAt: 2026-08-23
  - sourceName: マンガ大賞 2009 archive
    - sourceUrl: https://www.mangataisho.com/archives/2009.html
    - publishedAt: 2009
    - retrievedAt: 2026-08-23

## 28. work-8147aefccc365b0ecb4d — 黒執事

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. SQUARE ENIX binds 黒執事, creator 枢やな,
  Gファンタジー publication, and the numbered standard comic series. The
  manga Work is distinct from its adaptations and merchandise.
- current source and staging: title, creator, publisher, representative ISBN,
  and mappings are consistent. `works.firstPublishedYear=2007` is the first
  volume year, while an official company release places the serialization in
  the magazine's 2006-10 issue onward.
- first-publication audit: needs correction from 2007 to 2006. Retain
  2007-02-27 only as the standard volume-1 release date.
- representative edition: PASS — ISBN `9784757519633`, standard
  Gファンタジーコミックス volume 1, released 2007-02-27. Its checksum is
  valid and it occurs once in the source catalog. It is not a fan book, set,
  special edition, or adaptation product.
- safety and scope: PASS. SQUARE ENIX presents an ordinary commercial manga
  volume. Murder and supernatural violence in the early story are not an
  adult-only sales classification, and no adult-only marker appears on the
  reviewed series products.
- research metadata: needs-adjudication only for the Work year. The first-three-
  volume product pages use the same standard numbering and the packet correctly
  keeps a text-described confrontation out of Art evidence.
- limitations: The official corporate release uses the 2006-10 magazine issue
  label and does not provide an exact day. That is sufficient for the year-level
  Work field.
- evidence:
  - sourceName: SQUARE ENIX 黒執事 1 official product page
    - sourceUrl: https://magazine.jp.square-enix.com/top/comics/detail/9784757519633/
    - publishedAt: 2007-02-27
    - retrievedAt: 2026-08-23
  - sourceName: SQUARE ENIX 黒執事 corporate release
    - sourceUrl: https://www.jp.square-enix.com/company/ja/news/2009/download/20090113_160.pdf
    - publishedAt: 2009-01-13; states serialization from the 2006-10 issue
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 黒執事 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/4272127/
    - publishedAt: 2007-02-27
    - retrievedAt: 2026-08-23
  - sourceName: マンガ大賞 2008 archive
    - sourceUrl: https://www.mangataisho.com/archives/2008.html
    - publishedAt: 2008
    - retrievedAt: 2026-08-23

## 29. work-838a6f0ad2d1ef487588 — 信長協奏曲

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. The official ゲッサン page identifies
  信長協奏曲, creator 石井あゆみ, and the creator's first serialization in
  ゲッサン. The five memberships are duplicate provenance for one Work.
- current source and staging: title, creator, publisher, representative ISBN,
  canonical mappings, and `works.firstPublishedYear=2009` are mutually
  consistent with the original ゲッサン series and first standard volume.
- first-publication audit: PASS at year level. The Work belongs to the magazine
  launched in 2009, and the original standard volume was published in 2009.
  No reviewed evidence identifies the current year as a later-edition value.
- representative edition: PASS — ISBN `9784091221001`, standard
  ゲッサン少年サンデーコミックス volume 1, released 2009-11-12. Its
  checksum is valid and it occurs once in the source catalog. Fill the currently
  blank `volumes.releaseDate`; the edition itself does not need replacement.
- safety and scope: PASS. The official pages identify a ゲッサン page-manga
  and an ordinary 小学館 standard comic. Historical battles are not adult-only
  product markers, and none appears.
- research metadata: PASS except for the blank source release-date cell. The
  first-three-volume summaries and representative ISBN use the same standard
  edition structure.
- limitations: The reviewed official Work page does not expose the exact first
  issue date. The evidence is sufficient for the existing year-level value but
  not for a more precise start date.
- evidence:
  - sourceName: ゲッサンWEB 信長協奏曲 official work page
    - sourceUrl: https://gekkansunday.net/work/400/
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: 小学館コミック 信長協奏曲 1 official product page
    - sourceUrl: https://shogakukan-comic.jp/book?isbn=9784091221001
    - publishedAt: 2009-11-12
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 信長協奏曲 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/6232105/
    - publishedAt: 2009-11-12
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 2011
    - retrievedAt: 2026-08-23

## 30. work-83fc3c4366e51b35b821 — 風と木の詩

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. The original 小学館 フラワーコミックス,
  later 白泉社文庫 series, corporate publication history, and award archive
  converge on 竹宮惠子's single manga Work. The later publisher and edition do
  not create a second canonical Work.
- current source and staging: title, creator, original publisher, canonical
  mapping, and unique representative ISBN are sound.
  `works.firstPublishedYear=1977` is the original volume-1 year rather than the
  serialization year. `volumes.releaseDate` is blank.
- first-publication audit: needs correction from 1977 to 1976. A dated
  corporate publication record states that the manga ran from 1976 to 1984.
  Retain the 1977 product date only as original standard volume-1 metadata.
- representative edition: PASS — ISBN `9784091302212`, original 小学館
  フラワーコミックス volume 1, approximately released 1977-04-30. Its
  checksum is valid and it occurs once in the source catalog. Fill the blank
  source release date without substituting a 白泉社文庫 ISBN.
- edition bridge: needs adjudication. The research packet's direct content
  descriptions are for 白泉社文庫 volumes 1–3, not the frozen 小学館 original
  volumes 1–3. Obtain an official contents or chapter bridge before binding
  those descriptions to `entry_1_3_volumes`; do not assume identical volume
  boundaries.
- safety and scope: PASS for adult-only classification. Both publishers present
  ordinary commercial manga editions, and the Work received a mainstream
  publisher award. The official later-edition summaries include minor
  characters, sexual relationships, manipulation, and abuse. Those are
  sensitive content that requires careful annotation context, but neither the
  original product nor later bunko carries an R18 or adult-only sales marker.
- research metadata: needs-adjudication for the Work year, blank release date,
  and edition bridge. The packet correctly records the sensitive content and
  does not convert it into an Axis value or silently equate editions.
- limitations: The available original-volume retailer page does not expose a
  chapter list and gives only an approximate release day, so the exact-date
  source cell should remain blank without a publisher date or precision-aware
  field. The available publisher content summaries belong to the later
  ten-volume bunko. This is an annotation-range limitation, not an identity,
  safety, or scope hard blocker.
- evidence:
  - sourceName: 白泉社 風と木の詩 bunko volume 1 official product page
    - sourceUrl: https://www.hakusensha.co.jp/comicslist/41720/
    - publishedAt: 1995-03-17
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 風と木の詩 original volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/379720/
    - publishedAt: 1977-04-30 approximate product date
    - retrievedAt: 2026-08-23
  - sourceName: eBook Initiative Japan 風と木の詩 publication-history release
    - sourceUrl: https://prtimes.jp/a/?c=1485&f=d1485-666-pdf-0.pdf&r=666
    - publishedAt: 2017; states serialization from 1976 through 1984
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 1979
    - retrievedAt: 2026-08-23

## Adjudication queue produced by this review

1. `work-5cafd57db6b870a71a05`: correct `firstPublishedYear` from 1995 to
   1988; preserve the documented approximate 1995-07-15 retailer value as
   evidence without coercing it into an exact date; preserve the wide-edition
   identity and obtain an official standard-to-wide contents bridge before
   annotation.
2. `work-5ebbc9bede841d2faf7b`: correct `firstPublishedYear` from 2013 to
   2012 and set `volumes.releaseDate` to 2013-09-25; retain the standard ISBN.
3. `work-6f849a8e785deee3d5dc`: correct `firstPublishedYear` from 2017 to
   2016; retain 2017-03-03 only as the standard volume-1 release date.
4. `work-71e824df2e6bc2125294`: correct `firstPublishedYear` from 2021 to
   2020; retain ISBN `9784088826578` and its 2021-04-02 release date.
5. `work-7975d62582a89492a35f`: correct `firstPublishedYear` from 2018 to
   2017; retain ISBN `9784065112434` and its 2018-04-06 release date.
6. `work-7d259c925286a9f91310`: correct `firstPublishedYear` from 2008 to
   2006; retain ISBN `9784063726626` and its 2008-01-23 release date.
7. `work-8147aefccc365b0ecb4d`: correct `firstPublishedYear` from 2007 to
   2006; retain ISBN `9784757519633` and its 2007-02-27 release date.
8. `work-838a6f0ad2d1ef487588`: fill the representative release date with
   2009-11-12; keep `firstPublishedYear=2009` and the standard ISBN unchanged.
9. `work-83fc3c4366e51b35b821`: correct `firstPublishedYear` from 1977 to
   1976; preserve the documented approximate 1977-04-30 retailer value as
   evidence without coercing it into an exact date; retain the original ISBN
   and obtain an official original-to-bunko contents bridge before annotation.

These are reproducible metadata corrections or narrow edition-evidence gaps.
None is a safety or scope hard blocker, and this review does not authorize a
source-catalog mutation, recommendation promotion, or any Factor, Genre, Theme,
or Art value.
