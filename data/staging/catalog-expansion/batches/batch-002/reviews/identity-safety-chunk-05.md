# Batch 002 chunk 05 identity, safety, and edition review

- reviewDate: 2026-08-23
- retrievedAt: 2026-08-23
- reviewedByHuman: false
- reviewer: Local Codex independent review
- reviewedRange: batch-002 frozen work set positions 41–50
- reviewScope: canonical identity, safety and scope, representative ISBN and edition mapping, first-publication metadata, and research metadata only
- excludedFromReview: Factor values, Genre assignment, Theme assignment, centrality, and Art values
- sourceMutation: none

This review compares the frozen selection and research packet with the current
`works.csv`, `volumes.csv`, `canonical-mapping.csv`, `rakuten-matches.csv`,
`safety-review.csv`, and `promotion-registry.csv` rows. All ten representative
ISBN-13 values pass checksum validation and each occurs exactly once in the
current `data/source/volumes.csv`. Exact normalized-title matching also finds
one current Work per reviewed title. These are intra-catalog consistency
checks, not external identity sources.

The Rakuten rows do not expose a reliable nationality or original-format
field. Scope conclusions therefore do not infer either property from Rakuten,
and this review does not propose a nationality-inference test. Scope is based
on Japanese publisher, magazine, or official rights-holder records that bind a
manga Work to its creator, serialization route, or numbered comics edition.

Child harm, death, family conflict, infidelity, historical violence,
transformation, combat, or other sensitive story content is not treated as an
adult-only sales classification. A safety PASS means the reviewed publisher
and retailer product is an ordinary manga edition with no R18, 成人向け,
成年コミック, or equivalent adult-only marker. It is not a reader-age or
content-suitability rating. A site-wide R18 navigation link is not a
product-level marker.

## Summary

| workId                      | canonicalTitle         | verdict            | representative ISBN | edition conclusion                                         | safety and scope |
| --------------------------- | ---------------------- | ------------------ | ------------------- | ---------------------------------------------------------- | ---------------- |
| `work-ccf0ddff9c6410c4de14` | サンキューピッチ       | needs-adjudication | `9784088843056`     | standard ジャンプコミックス volume 1                       | PASS             |
| `work-cdef8cfd678998a51447` | うさぎドロップ         | needs-adjudication | `9784396763800`     | original フィールコミックス volume 1, not the 新装版       | PASS             |
| `work-ced7a8e6d9c3b8147702` | 水は海に向かって流れる | needs-adjudication | `9784065144510`     | standard KCデラックス volume 1                             | PASS             |
| `work-daf65c6f2cce3e076dfa` | 凪のお暇               | needs-adjudication | `9784253156370`     | standard A.L.C.DX volume 1                                 | PASS             |
| `work-db80d94709b62aa8823f` | 逃げ上手の若君         | PASS               | `9784088827100`     | standard ジャンプコミックス volume 1                       | PASS             |
| `work-ef1bdac46a0956a87f7f` | タコピーの原罪         | needs-adjudication | `9784088830490`     | standard ジャンプコミックス upper volume                   | PASS             |
| `work-f5847c45d30753150364` | 闇のパープル・アイ     | PASS               | `9784091316516`     | original フラワーコミックス paper volume 1                 | PASS             |
| `work-fabc7f5d853e361acaf3` | YAIBA                  | needs-adjudication | `9784091222718`     | original 少年サンデーコミックス paper volume 1             | PASS             |
| `work-fb7a0ed6a88db7d7bc71` | 夢の碑                 | needs-adjudication | `9784091785015`     | original PFコミックス volume 1; current collections differ | PASS             |
| `work-fd88144bf7334c4aae39` | おそ松くん             | needs-adjudication | `9784061005099`     | 1988 講談社 collected volume 1 for the 1962 Work           | PASS             |

Result: 2 PASS and 8 needs-adjudication. Six Works require a narrow
`firstPublishedYear` correction because the current value is the standard
volume-1 year rather than the first formal publication year. 凪のお暇 and
おそ松くん also have blank representative `releaseDate` cells despite exact
publisher dates being available. 夢の碑 requires an edition-evidence and date
precision correction, not a Work split. Approximate or month-only retailer
dates for うさぎドロップ, 闇のパープル・アイ, YAIBA, and 夢の碑 must not
be coerced into exact source dates.

None is a safety or scope hard blocker. No duplicate ISBN, adult-only item,
webtoon or vertical-scroll original, non-manga product, duplicate Work, or
identity hard blocker was found. Later new editions, digital editions,
reorganized collections, adaptations, and revival products remain separate
edition evidence where applicable and do not overwrite the frozen Work
identity.

## 41. work-ccf0ddff9c6410c4de14 — サンキューピッチ

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 少年ジャンプ＋ and 集英社 bind the exact title,
  creator 住吉九, the digital serial, and the numbered ジャンプコミックス
  paper series. Two selection memberships are provenance for one Work, not
  duplicate Works.
- current source and staging: canonical title, creator, publisher,
  representative ISBN, exact volume date, and mappings are sound.
  `works.firstPublishedYear=2025` is the collected-volume year and needs a
  narrow correction. The title contains no decorative title delimiters.
- first-publication audit: needs correction from 2025 to 2024. The official
  first chapter is dated 2024-09-03. The standard volume 1 followed on
  2025-01-04, so that volume date must remain only in `volumes.releaseDate`.
- representative edition: PASS — ISBN `9784088843056`, ordinary
  ジャンプコミックス paper volume 1, released 2025-01-04. Its checksum is
  valid and it occurs once in the source catalog. Official volumes 2 and 3
  continue the same numbering; no set or special edition replaces volume 1.
- safety and scope: PASS. The official first-chapter route and publisher comic
  page identify a Japanese digital-serial manga and an ordinary numbered paper
  comic. School sports pressure and difficult childhood material are sensitive
  content, not an adult-only sales class. No R18 or equivalent marker appears.
- research metadata: needs-adjudication only because the packet starts its
  edition evidence with the 2025 volume page and does not carry the official
  2024 first-chapter date into the Work-year audit. Add that official
  chronology without using award membership as identity or safety evidence.
- limitations: The first-chapter page establishes the exact formal web release
  date but does not establish any earlier manuscript or promotional preview.
  No such earlier event is needed by the current publication-year contract.
- evidence:
  - sourceName: 少年ジャンプ＋ サンキューピッチ first chapter
    - sourceUrl: https://shonenjumpplus.com/episode/17106567254627463963
    - publishedAt: 2024-09-03
    - retrievedAt: 2026-08-23
  - sourceName: 集英社 サンキューピッチ volume 1
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884305-6
    - publishedAt: 2025-01-04
    - retrievedAt: 2026-08-23
  - sourceName: 次にくるマンガ大賞 2025 Webマンガ official result
    - sourceUrl: https://tsugimanga.jp/winner/2025/web
    - publishedAt: 2025-09-18
    - retrievedAt: 2026-08-23

## 42. work-cdef8cfd678998a51447 — うさぎドロップ

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 祥伝社 binds うさぎドロップ and 宇仁田ゆみ
  to the フィールコミックス series. Four selection memberships collapse to
  one Work. The later 新装版 is an alternate edition with separate ISBNs and
  added material, not a second Work and not a byte-equivalent substitute for
  the frozen original edition.
- current source and staging: title, creator, original publisher,
  representative ISBN, and mappings are sound. `firstPublishedYear=2006` is
  the original collected-volume year; the blank representative release date is
  appropriately conservative because the available original-volume record is
  month-only.
- first-publication audit: needs correction from 2006 to 2005. The official
  licensed chronology records the manga's main serial from the 2005-10 issue
  of FEEL YOUNG. The original volume 1 was published in 2006-05, which is a
  separate edition event.
- representative edition: PASS with an edition bridge — ISBN
  `9784396763800`, ordinary A5 フィールコミックス original volume 1,
  published in 2006-05. Its checksum is valid and it occurs once in the source
  catalog. The publisher order sheet distinguishes original volumes 1–3 from
  新装版 ISBNs `9784396766191`, `9784396766207`, and `9784396766276`.
- edition bridge: PASS for ordinal identity only. The publisher's 新装版 page
  announces newly added production notes, omitted preview cuts, bookmarks, and
  later bonus material. Without a contents table, the current collections must
  not be treated as direct page-for-page evidence for original volumes 1–3.
- safety and scope: PASS. The official publisher serial and catalog records
  identify an ordinary Japanese magazine manga and numbered comics editions.
  Child care, family relationships, and later character aging do not establish
  an adult-only sales category. No product-level R18 or equivalent marker was
  found.
- research metadata: needs-adjudication for the Work year and edition boundary
  only. The packet correctly identifies the separate ISBN sets and already
  warns that the 新装版 contents cannot be transferred to the original edition
  without a verified contents map.
- limitations: The original volume product exposes only 2006-05, so
  `volumes.releaseDate` should remain blank unless a day-precise publisher or
  library record is obtained. Rakuten is used only for ISBN and edition
  bibliography, never for nationality or original-format inference.
- evidence:
  - sourceName: 祥伝社 マンガJam うさぎドロップ official serial introduction
    - sourceUrl: https://www.shodensha.co.jp/mangajam/jam012.html
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Happinet Pictures licensed うさぎドロップ chronology
    - sourceUrl: https://happinet-p.com/jp3/special2/1112_1_usagidrop/index.html
    - publishedAt: 2011; records the manga serial from the 2005-10 issue
    - retrievedAt: 2026-08-23
  - sourceName: 祥伝社 FCswing うさぎドロップ 新装版 volumes 1–3
    - sourceUrl: https://www.shodensha.co.jp/fc_swing/
    - publishedAt: 2014-10-08 for volumes 1–2; 2014-12-08 for volume 3
    - retrievedAt: 2026-08-23
  - sourceName: 祥伝社 February 2026 comics order sheet
    - sourceUrl: https://www.shodensha.co.jp/pop/comic_202602.pdf
    - publishedAt: 2026-02
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books うさぎドロップ original volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/4018566/
    - publishedAt: 2006-05; month-only retailer record
    - retrievedAt: 2026-08-23

## 43. work-ced7a8e6d9c3b8147702 — 水は海に向かって流れる

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 講談社 binds the exact title, creator 田島列島,
  別冊少年マガジン publication, and the three-volume KCデラックス manga
  series. Five memberships are duplicate provenance for the same Work. The
  prose and film-photo products on the publisher site are separate adaptations.
- current source and staging: title, creator, publisher, representative ISBN,
  exact release date, and canonical mappings are correct.
  `firstPublishedYear=2019` incorrectly mirrors volume 1's year.
- first-publication audit: needs correction from 2019 to 2018. The official
  volume 1 page states that it collects material from 別冊少年マガジン's
  2018-09 through 2019-04 issues. The earliest formal publication is therefore
  in 2018, while 2019-05-09 remains the collected volume date.
- representative edition: PASS — ISBN `9784065144510`, ordinary KCデラックス
  paper volume 1, released 2019-05-09. Its checksum is valid and it occurs once
  in the catalog. Official volumes 2 and 3 complete the same standard edition.
- safety and scope: PASS. 講談社 identifies a Japanese magazine manga and an
  ordinary numbered paper comic. Family infidelity, a high-school student and
  adult sharing a residence, and difficult family reunions require contextual
  care but are not product-level adult-only markers. None appears on the
  reviewed products.
- research metadata: needs-adjudication only for the Work year. The packet's
  volume ranges and exact publisher dates are internally consistent and keep
  adaptations separate from the manga edition.
- limitations: The volume contents identify the first issue month but do not
  provide the physical on-sale day of that magazine issue. The year-only Work
  field does not require an invented day.
- evidence:
  - sourceName: 講談社 水は海に向かって流れる volume 1
    - sourceUrl: https://www.kodansha.co.jp/comic/products/0000319530
    - publishedAt: 2019-05-09; contains 2018-09 through 2019-04 issue material
    - retrievedAt: 2026-08-23
  - sourceName: 講談社 水は海に向かって流れる volume 2
    - sourceUrl: https://www.kodansha.co.jp/comic/products/0000327242
    - publishedAt: 2019-12-09
    - retrievedAt: 2026-08-23
  - sourceName: 講談社 水は海に向かって流れる volume 3
    - sourceUrl: https://www.kodansha.co.jp/comic/products/0000344116
    - publishedAt: 2020-09-09
    - retrievedAt: 2026-08-23

## 44. work-daf65c6f2cce3e076dfa — 凪のお暇

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 秋田書店 binds 凪のお暇, creator コナリミサト,
  the Eleganceイブ route, and the numbered A.L.C.DX series. Four selection
  memberships collapse to one Work.
- current source and staging: title, creator, publisher, representative ISBN,
  and mappings are sound. `firstPublishedYear=2017` is the first collected
  volume year, and the representative release date is blank.
- first-publication audit: needs correction from 2017 to 2016. The magazine
  back-number chronology records the serial from the 2016-08 issue, before the
  2017 paper volume. The official current 秋田書店 archive confirms the same
  creator, title, and serial in later issues but does not expose the 2016 issue
  page through the current searchable archive.
- representative edition: PASS — ISBN `9784253156370`, ordinary A.L.C.DX
  volume 1, released 2017-06-16. Its checksum is valid and it occurs once in
  the source catalog. Set the blank `volumes.releaseDate` to that exact
  publisher date; do not infer any different date from an award year.
- safety and scope: PASS. 秋田書店 identifies an ordinary Japanese magazine
  manga and numbered women's-comics edition. Workplace distress, panic-like
  symptoms, relationship conflict, and life-reset subject matter do not create
  an adult-only sales class. No R18 or equivalent marker appears.
- research metadata: needs-adjudication for the Work year and blank volume date.
  The packet's official volume 1–3 evidence is edition-consistent. The 2016
  start relies on a magazine back-number index and should retain that source
  limitation instead of claiming an unavailable publisher issue page.
- limitations: The current official series page does not state the first issue.
  A future archived official 2016 issue page would strengthen the chronology,
  but the existing evidence is sufficient to reject 2017 as the Work start
  because the serial existed in a 2016 issue.
- evidence:
  - sourceName: 秋田書店 凪のお暇 volume 1
    - sourceUrl: https://www.akitashoten.co.jp/comics/4253156371
    - publishedAt: 2017-06-16
    - retrievedAt: 2026-08-23
  - sourceName: 秋田書店 凪のお暇 series page
    - sourceUrl: https://www.akitashoten.co.jp/series/6797
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Fujisan Eleganceイブ back-number index
    - sourceUrl: https://www.fujisan.co.jp/product/254/b/list/?page=8
    - publishedAt: 2016; records 凪のお暇 in the 2016-08 issue chronology
    - retrievedAt: 2026-08-23
  - sourceName: 文化庁メディア芸術祭 22nd manga award page
    - sourceUrl: https://www.bunka.go.jp/j-mediaarts-festival/award/single/nagis-long-vacation/index.html
    - publishedAt: 2019
    - retrievedAt: 2026-08-23

## 45. work-db80d94709b62aa8823f — 逃げ上手の若君

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. 集英社 binds 逃げ上手の若君, creator 松井優征,
  the 週刊少年ジャンプ serial, and the numbered ジャンプコミックス
  series. Three selection memberships are provenance for this one Work.
- current source and staging: canonical title, creator, publisher,
  `firstPublishedYear=2021`, representative ISBN, exact release date, and
  mappings agree with official records. The title has no decorative delimiters.
- first-publication audit: PASS. The official serial page records the start in
  週刊少年ジャンプ 2021年8号. The standard volume 1 followed on 2021-07-02;
  both events are in 2021, so the Work year is not contaminated by the volume
  date.
- representative edition: PASS — ISBN `9784088827100`, ordinary
  ジャンプコミックス paper volume 1, released 2021-07-02. Its checksum is
  valid and it occurs once in the source catalog. Official volumes 2 and 3
  continue the same standard series.
- safety and scope: PASS. The official publisher identifies a Japanese weekly
  magazine manga and ordinary numbered comics. Historical warfare, killing,
  pursuit, and political conflict are sensitive content but not adult-only
  product markers. None is present on the reviewed edition.
- research metadata: PASS. The official volume 1–3 pages match the frozen
  edition and the award row remains selection provenance rather than identity
  or safety evidence.
- limitations: This scope review does not assess historical accuracy or rate
  the intensity of violence. It also makes no Factor, Genre, Theme, or Art
  conclusion.
- evidence:
  - sourceName: 集英社 逃げ上手の若君 official serial page
    - sourceUrl: https://sp.shonenjump.com/j/rensai/nigejozu/
    - publishedAt: undated; records the serial from 2021 issue 8
    - retrievedAt: 2026-08-23
  - sourceName: 集英社 逃げ上手の若君 volume 1
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882710-0
    - publishedAt: 2021-07-02
    - retrievedAt: 2026-08-23
  - sourceName: 次にくるマンガ大賞 2021 comics official result
    - sourceUrl: https://tsugimanga.jp/winner/2021/comics
    - publishedAt: 2021-08-24
    - retrievedAt: 2026-08-23

## 46. work-ef1bdac46a0956a87f7f — タコピーの原罪

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 少年ジャンプ＋ and 集英社 bind the exact title,
  creator タイザン5, the official web serial, and the two-volume upper/lower
  ジャンプコミックス edition. Two selection memberships refer to one Work.
- current source and staging: title, creator, publisher, representative ISBN,
  exact release date, and canonical mappings are sound.
  `firstPublishedYear=2022` reflects the upper collected volume rather than the
  first official chapter.
- first-publication audit: needs correction from 2022 to 2021. The official
  first chapter was published on 2021-12-10. The upper volume release
  2022-03-04 belongs only to the representative edition row.
- representative edition: PASS — ISBN `9784088830490`, ordinary
  ジャンプコミックス upper volume, released 2022-03-04. Its checksum is
  valid and it occurs once in the catalog. The lower volume ISBN
  `9784088831046` completes the same Work on 2022-04-04 and is not a sequel or
  replacement edition.
- safety and scope: PASS. The official web-serial and numbered comic pages
  identify a Japanese manga and ordinary publisher products. Child abuse,
  bullying, death, suicide-related context, and family violence demand content
  care but do not by themselves establish an adult-only sales classification.
  No R18 or equivalent marker appears on the reviewed products.
- research metadata: needs-adjudication only for the Work year. The packet
  correctly treats the two official volumes as the full edition and separates
  sensitive content from sales classification.
- limitations: Safety PASS is not a suitability judgment for children and does
  not minimize the subject matter. A later content-warning policy may describe
  it separately, but it must not rewrite identity or invent an R18 marker.
- evidence:
  - sourceName: 少年ジャンプ＋ タコピーの原罪 first chapter
    - sourceUrl: https://shonenjumpplus.com/episode/3269754496638370192
    - publishedAt: 2021-12-10
    - retrievedAt: 2026-08-23
  - sourceName: 集英社 タコピーの原罪 upper volume
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883049-0
    - publishedAt: 2022-03-04
    - retrievedAt: 2026-08-23
  - sourceName: 集英社 タコピーの原罪 lower volume
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883104-6
    - publishedAt: 2022-04-04
    - retrievedAt: 2026-08-23

## 47. work-f5847c45d30753150364 — 闇のパープル・アイ

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. 小学館 binds 闇のパープル・アイ,
  篠原千絵, the Sho-Comi route, and the completed 12-volume
  フラワーコミックス series. One selection membership maps to this Work.
- current source and staging: title, creator, original publisher,
  `firstPublishedYear=1984`, representative ISBN, blank release date, and
  mapping are consistent with the available precision.
- first-publication audit: PASS. The official volume 12 description states that
  the series began in 週刊少女コミック 昭和59年9号, establishing 1984 as
  the first formal publication year. The later official electronic date is not
  substituted for that Work year.
- representative edition: PASS with a legacy product-code bridge — ISBN
  `9784091316516`, ordinary フラワーコミックス paper volume 1. Its checksum
  is valid and it occurs once in the catalog. The official electronic product
  code `09131651` preserves the paper product's legacy book-code stem and same
  series numbering, but its 2013-01-01 digital date is not the paper release.
- safety and scope: PASS. 小学館 classifies the official series as an ordinary
  Sho-Comi少女・女性マンガ and completed numbered comic. Transformation,
  death, pursuit, and suspense are sensitive content, not adult-only sales
  markers. No R18 or equivalent marker appears.
- research metadata: PASS. It explicitly labels the official 2013 pages as
  electronic records and does not overwrite the frozen paper ISBN or invent a
  paper release day.
- limitations: The live official page does not expose the original paper
  volume's exact release date. Keep `volumes.releaseDate` blank until a
  day-precise authoritative paper record is found.
- evidence:
  - sourceName: 小学館 闇のパープル・アイ volume 1 official electronic record
    - sourceUrl: https://shogakukan-comic.jp/book?jdcn=091316510000d0000000
    - publishedAt: 2013-01-01; electronic edition
    - retrievedAt: 2026-08-23
  - sourceName: 小学館eコミックストア 闇のパープル・アイ volume 12
    - sourceUrl: https://e-comi.shogakukan.co.jp/books/091318520000d0000000
    - publishedAt: undated; records serialization from 1984 issue 9
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 1986
    - retrievedAt: 2026-08-23

## 48. work-fabc7f5d853e361acaf3 — YAIBA

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 小学館 binds YAIBA, creator 青山剛昌, the
  週刊少年サンデー serial, and the original numbered
  少年サンデーコミックス series. The current 新装版 is an alternate
  edition, not a separate canonical Work and not a replacement for the frozen
  original-paper ISBN.
- current source and staging: canonical title, creator, original publisher,
  representative ISBN, and mapping are sound. `firstPublishedYear=1989` is the
  original volume-1 year; the blank representative release date is correctly
  more conservative than the approximate retailer display.
- first-publication audit: needs correction from 1989 to 1988. The official
  少年サンデー archive records serialization from 1988年39号 through
  1993年50号. The paper volume's 1989 event does not move the Work start year.
- representative edition: PASS with a legacy product-code bridge — ISBN
  `9784091222718`, ordinary original 少年サンデーコミックス paper volume 1.
  Its checksum is valid and it occurs once in the catalog. The official
  electronic product code `09122271` preserves the legacy paper code; the
  2013 electronic release and current 新装版 remain separate editions.
- release-date precision: Rakuten displays `1989-04-18頃`, an approximate date.
  Do not write 1989-04-18 as an exact `volumes.releaseDate`; retain the blank
  field unless a day-precise authoritative paper record is obtained.
- safety and scope: PASS. The official weekly magazine archive and numbered
  comics record identify a Japanese page-manga Work. Sword combat, injury,
  supernatural conflict, and comic violence are not adult-only product
  markers. No R18 or equivalent marker was found.
- research metadata: needs-adjudication for `firstPublishedYear` and explicit
  approximate-date notation. The official electronic pages remain useful for
  title, creator, numbering, and legacy-code continuity, not original paper
  release precision.
- limitations: The official archive currently promotes a 新装版, but it also
  states the original serial chronology. Do not infer that the new edition has
  the same pagination or volume boundaries as the frozen edition.
- evidence:
  - sourceName: 少年サンデー YAIBA official archive
    - sourceUrl: https://websunday.net/4217/
    - publishedAt: 2021-04-06; records serialization from 1988 issue 39
    - retrievedAt: 2026-08-23
  - sourceName: 小学館 YAIBA volume 1 official electronic record
    - sourceUrl: https://shogakukan-comic.jp/book?jdcn=091222710000d0000000
    - publishedAt: 2013-01-01; electronic edition
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books YAIBA original volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/569233/
    - publishedAt: 1989-04-18頃; approximate retailer display
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 1992
    - retrievedAt: 2026-08-23

## 49. work-fb7a0ed6a88db7d7bc71 — 夢の碑

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS at Work level. 小学館 and its official award
  archive bind 夢の碑 and 木原敏江, while the publisher's author catalog records
  the PFコミックス series as 20 volumes. One selection membership maps to
  this Work.
- current source and staging: canonical title, creator, original publisher,
  `firstPublishedYear=1984`, representative ISBN, blank release date, and
  mapping are sound. The research packet needs a precision correction for the
  retailer date and a stronger edition-boundary statement.
- first-publication audit: PASS. The series is recorded from 1984, and the
  official award archive places the Work in the 1984 cycle. The 1978 precursor
  大江山花伝 is separately titled and does not move this canonical Work's year
  backward.
- representative edition: conditionally PASS — ISBN `9784091785015`, ordinary
  PFコミックス volume 1. Its checksum is valid and it occurs once in the
  source catalog. The official publisher catalog identifies the PF series as
  all 20 volumes, while retailer bibliography binds this ISBN to its first
  volume.
- edition bridge: needs-adjudication. Current official products such as
  夢の碑 とりかえばや異聞 and 夢の碑 青頭巾 are story-based electronic
  collections with separate product codes. No official contents table in the
  packet maps those collections to original PF volumes 1–3. They may support
  Work identity but cannot serve as direct representative-range evidence.
- release-date precision: the Rakuten result is currently exposed as
  `1984-11-20頃`, while the packet normalized it to an exact day. Treat the
  retailer display as approximate and leave `volumes.releaseDate` blank. A
  month-only bookstore entry also does not justify exact-day storage.
- safety and scope: PASS. The PFコミックス record, official publisher
  collections, and award identity describe an ordinary Japanese manga Work.
  Historical violence, gender-role exchange, and period sexual context do not
  establish an adult-only sales class. No R18 or equivalent product marker was
  found.
- research metadata: needs-adjudication for the PF-to-current-collection bridge
  and retailer date precision only. Preserve the original PF ISBN and do not
  promote the current collection pages as direct evidence for original volume
  1–3 contents.
- limitations: The live Rakuten product URL is intermittently unavailable, and
  the official author page's current rendered list does not expose the old PF
  volume-by-volume contents. Final promotion may use this identity review, but
  any text annotation for the frozen range needs edition-matched evidence.
- evidence:
  - sourceName: 小学館 月刊flowers 木原敏江 author catalog
    - sourceUrl: https://flowers.shogakukan.co.jp/author/260/
    - publishedAt: undated; publisher catalog records 夢の碑 PFコミックス all 20 volumes
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 夢の碑 original volume 1 bibliography
    - sourceUrl: https://books.rakuten.co.jp/rb/377347/
    - publishedAt: 1984-11-20頃; approximate retailer display
    - retrievedAt: 2026-08-23
  - sourceName: Google Arts & Culture 夢の碑 publication chronology
    - sourceUrl: https://artsandculture.google.com/story/_gVhpN5-FcNsiA?hl=ja
    - publishedAt: 2020; records the series from 1984 through 1997
    - retrievedAt: 2026-08-23
  - sourceName: 小学館 夢の碑 とりかえばや異聞 official electronic collection
    - sourceUrl: https://shogakukan-comic.jp/book?jdcn=091912210000d0000000
    - publishedAt: 2018-03-02
    - retrievedAt: 2026-08-23
  - sourceName: 小学館eコミックストア 夢の碑 青頭巾 collection
    - sourceUrl: https://e-comi.shogakukan.co.jp/books/091912220000d0000000
    - publishedAt: 2018-03-02
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 1984
    - retrievedAt: 2026-08-23

## 50. work-fd88144bf7334c4aae39 — おそ松くん

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS at Work level. The official rights-holder binds
  おそ松くん and 赤塚不二夫 to the original 週刊少年サンデー run beginning
  in 1962, later serial routes, and multiple collected editions. The 1987
  Comic BomBom revival is a later publication phase of the same established
  Work, while 最新版 おそ松くん and later adaptations remain separately
  titled products.
- current source and staging: canonical title, creator, representative ISBN,
  and mapping are sound. `firstPublishedYear=1988` is the frozen 講談社
  edition year, not the Work origin. The blank representative release date can
  be filled exactly. `works.publisher=講談社` describes the frozen edition,
  whereas the original serial publisher was 小学館; publisher-field semantics
  require explicit adjudication rather than silent conflation.
- first-publication audit: needs correction from 1988 to 1962. The official
  rights-holder records the original 週刊少年サンデー run from the
  1962-04-15 issue 16 through the 1969-05-18 issue 21. The Comic BomBom revival
  began in the 1987-11 issue, and the frozen collected edition began in 1988;
  neither replaces the canonical origin year.
- representative edition: PASS as a later ordinary collected edition — ISBN
  `9784061005099`, 講談社 コミックボンボンKC volume 1, released
  1988-01-13, 192 pages. Its checksum is valid and it occurs once in the source
  catalog. Official volumes 2 and 3 continue the same 34-volume edition.
- edition bridge: PASS. The rights-holder lists the 1988 講談社 おそ松くん
  edition as 34 volumes and separately lists 赤塚不二夫爆笑ランド
  おそ松くん and 最新版 おそ松くん. Preserve those distinctions. The
  frozen ISBN is not a 1962 first edition and is not the two-volume 最新版.
- safety and scope: PASS. The official rights-holder and 講談社 pages identify
  an ordinary Japanese magazine manga and numbered collected comics. Period
  humor and comic mischief are not adult-only sales markers. No R18,
  成人向け, 成年コミック, or equivalent marker appears on the representative
  edition.
- research metadata: needs-adjudication for Work year, blank release date, and
  Work-level publisher semantics. The packet correctly separates the frozen
  1988 edition from later adaptations, but its identity note must also preserve
  the original 1962 run and the distinct 1987 revival chronology.
- limitations: The Work spans serial venues and publishers. If
  `works.publisher` means original Work publisher, correct 講談社 to 小学館 and
  retain 講談社 solely in representative-edition evidence. If it means the
  publisher of the representative edition, retain 講談社 but document the
  original 小学館 route. Do not encode both meanings in one unqualified value.
- evidence:
  - sourceName: 赤塚不二夫 official rights-holder おそ松くん history
    - sourceUrl: https://www.koredeiinoda.net/manga/osomatsukun.html
    - publishedAt: undated; records the 1962 original run, 1987 revival, and 1988 editions
    - retrievedAt: 2026-08-23
  - sourceName: 講談社 おそ松くん volume 1
    - sourceUrl: https://www.kodansha.co.jp/comic/products/0000120298
    - publishedAt: 1988-01-13
    - retrievedAt: 2026-08-23
  - sourceName: 講談社 おそ松くん volume 2
    - sourceUrl: https://www.kodansha.co.jp/comic/products/0000120299
    - publishedAt: 1988-01-13
    - retrievedAt: 2026-08-23
  - sourceName: 講談社 おそ松くん volume 3
    - sourceUrl: https://www.kodansha.co.jp/comic/products/0000120300
    - publishedAt: 1988-02-15
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 1964; archive award-cycle convention
    - retrievedAt: 2026-08-23

## Adjudication queue produced by this review

1. `work-ccf0ddff9c6410c4de14`: correct `firstPublishedYear` from 2025 to
   2024; retain ISBN `9784088843056` and exact representative release date
   2025-01-04.
2. `work-cdef8cfd678998a51447`: correct `firstPublishedYear` from 2006 to
   2005; retain original ISBN `9784396763800`, keep the month-only volume date
   unstored, and preserve the 新装版 as an alternate edition with added material.
3. `work-ced7a8e6d9c3b8147702`: correct `firstPublishedYear` from 2019 to
   2018; retain ISBN `9784065144510` and exact representative release date
   2019-05-09.
4. `work-daf65c6f2cce3e076dfa`: correct `firstPublishedYear` from 2017 to
   2016 and set `volumes.releaseDate` to 2017-06-16; retain ISBN
   `9784253156370` and the source limitation on the 2016 magazine chronology.
5. `work-ef1bdac46a0956a87f7f`: correct `firstPublishedYear` from 2022 to
   2021; retain upper-volume ISBN `9784088830490` and exact release date
   2022-03-04.
6. `work-fabc7f5d853e361acaf3`: correct `firstPublishedYear` from 1989 to
   1988; retain original ISBN `9784091222718`, keep the approximate paper date
   unstored, and do not substitute the current 新装版 or electronic date.
7. `work-fb7a0ed6a88db7d7bc71`: retain `firstPublishedYear=1984` and ISBN
   `9784091785015`, correct the packet's retailer date to approximate, keep
   `releaseDate` blank, and prohibit direct PF-volume mapping from the current
   story collections until an official contents bridge exists.
8. `work-fd88144bf7334c4aae39`: correct `firstPublishedYear` from 1988 to
   1962 and set `volumes.releaseDate` to 1988-01-13; retain ISBN
   `9784061005099`, distinguish the 1987 revival and separate 最新版 product,
   and resolve whether `works.publisher` stores original Work publisher
   小学館 or representative-edition publisher 講談社.

These are reproducible metadata or evidence-boundary corrections, not
promotion blockers. Exact first-issue days remain unstored where the source
schema only requires a year, and approximate retailer dates remain unstored.
No Work enters a hard-blocker queue, and this review does not authorize a
source-catalog mutation, recommendation promotion, or any Factor, Genre,
Theme, centrality, or Art value.
