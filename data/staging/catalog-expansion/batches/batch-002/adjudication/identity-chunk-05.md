# Batch 002 chunk 05 identity adjudication

- adjudicationDate: 2026-08-23
- reviewedByHuman: false
- adjudicator: Local Codex
- inputReview: `../reviews/identity-safety-chunk-05.md`
- scope: first-publication metadata, exact representative-volume dates, and edition precision
- hardBlockers: 0

## Decisions

| workId                      | decision                                                                                                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `work-ccf0ddff9c6410c4de14` | Set Work year to 2024 from the official first chapter; retain standard volume-1 ISBN `9784088843056` and its 2025-01-04 release date.                                                                  |
| `work-cdef8cfd678998a51447` | Set Work year to 2005; retain original フィールコミックス ISBN `9784396763800`, keep its month-only release date unstored, and keep the 新装版 as a distinct alternate edition.                        |
| `work-ced7a8e6d9c3b8147702` | Set Work year to 2018 from the official volume contents; retain standard ISBN `9784065144510` and its 2019-05-09 release date.                                                                         |
| `work-daf65c6f2cce3e076dfa` | Set Work year to 2016 and representative release date to 2017-06-16; retain standard A.L.C.DX ISBN `9784253156370`.                                                                                    |
| `work-ef1bdac46a0956a87f7f` | Set Work year to 2021 from the official first chapter; retain upper-volume ISBN `9784088830490` and its 2022-03-04 release date.                                                                       |
| `work-fabc7f5d853e361acaf3` | Set Work year to 1988 from the official serial archive; retain original paper ISBN `9784091222718` and leave the approximate paper release day unstored.                                               |
| `work-fb7a0ed6a88db7d7bc71` | Retain Work year 1984 and PFコミックス ISBN `9784091785015`; leave `releaseDate` blank and do not map current story collections directly to original PF volumes 1–3.                                   |
| `work-fd88144bf7334c4aae39` | Set Work year to 1962 and representative release date to 1988-01-13; retain ISBN `9784061005099` and `publisher=講談社` as representative-edition metadata while preserving the distinct 1987 revival. |

逃げ上手の若君 and 闇のパープル・アイ passed the input review without a
source correction. The eight rows above are the complete Pass C queue in
their frozen chunk order. No Work ID, canonical title, safety state, or
representative ISBN changes.

## Publication-year boundary

The source contract stores the first formal publication year in
`works.firstPublishedYear`, not the representative book year. The corresponding
candidate year is updated to the same value so the two staging views do not
diverge. These seven Work-year changes are applied:

- サンキューピッチ: 2025 to 2024
- うさぎドロップ: 2006 to 2005
- 水は海に向かって流れる: 2019 to 2018
- 凪のお暇: 2017 to 2016
- タコピーの原罪: 2022 to 2021
- YAIBA: 1989 to 1988
- おそ松くん: 1988 to 1962

For 凪のお暇, the directly inspectable magazine back-number index places the
Work in a 2016 issue. It proves the year correction but is not used to assert
an exact first-issue month. Only the year is stored.

## Edition decisions

The original うさぎドロップ ISBN remains the representative edition. The
祥伝社 catalog gives the 新装版 separate ISBNs and identifies additional
material, so ordinal continuity does not establish page-for-page identity.
The original-volume release is available only as 2006-05 and remains blank in
the day-precise source field.

The 夢の碑 representative product is the original PFコミックス volume 1.
Rakuten displays its date as 1984-11-20頃, so no exact day is written. The
current 小学館 products 夢の碑 とりかえばや異聞 and 夢の碑 青頭巾 are
story-based collections with separate product codes. Without an official
contents bridge, neither is direct evidence for the frozen PF volume range.

The おそ松くん canonical Work begins with the 1962 週刊少年サンデー run.
The rights-holder separately records the 1987 Comic BomBom revival and the
1988 講談社 34-volume collected edition. The frozen representative ISBN belongs
to that 1988 edition, not the 1962 first edition or the separate two-volume
最新版 おそ松くん. Repository precedent deliberately stores the matched
representative item's publisher in `works.publisher`; `講談社` therefore
remains unchanged without being described as the original serial publisher.

## Exact release dates applied

- 凪のお暇 volume 1: 2017-06-16
- おそ松くん volume 1: 1988-01-13

The existing exact dates for サンキューピッチ, 水は海に向かって流れる,
逃げ上手の若君, and タコピーの原罪 remain unchanged. The blank dates for
うさぎドロップ, 闇のパープル・アイ, YAIBA, and 夢の碑 remain blank
because the reviewed records are month-only, electronic-only, or approximate.

## Evidence

- sourceName: 少年ジャンプ＋ サンキューピッチ first chapter
  - sourceUrl: https://shonenjumpplus.com/episode/17106567254627463963
  - publishedAt: 2024-09-03
  - retrievedAt: 2026-08-23
- sourceName: Happinet Pictures licensed うさぎドロップ chronology
  - sourceUrl: https://happinet-p.com/jp3/special2/1112_1_usagidrop/index.html
  - publishedAt: 2011; records the manga serial from the 2005-10 issue
  - retrievedAt: 2026-08-23
- sourceName: 祥伝社 February 2026 comics order sheet
  - sourceUrl: https://www.shodensha.co.jp/pop/comic_202602.pdf
  - publishedAt: 2026-02
  - retrievedAt: 2026-08-23
- sourceName: 講談社 水は海に向かって流れる volume 1
  - sourceUrl: https://www.kodansha.co.jp/comic/products/0000319530
  - publishedAt: 2019-05-09; contains material beginning with the 2018-09 issue
  - retrievedAt: 2026-08-23
- sourceName: Fujisan Eleganceイブ back-number index
  - sourceUrl: https://www.fujisan.co.jp/product/254/b/list/?page=8
  - publishedAt: 2016; directly lists 凪のお暇 in 2016 magazine issues
  - retrievedAt: 2026-08-23
- sourceName: 秋田書店 凪のお暇 volume 1
  - sourceUrl: https://www.akitashoten.co.jp/comics/4253156371
  - publishedAt: 2017-06-16
  - retrievedAt: 2026-08-23
- sourceName: 少年ジャンプ＋ タコピーの原罪 first chapter
  - sourceUrl: https://shonenjumpplus.com/episode/3269754496638370192
  - publishedAt: 2021-12-10
  - retrievedAt: 2026-08-23
- sourceName: 少年サンデー YAIBA official archive
  - sourceUrl: https://websunday.net/4217/
  - publishedAt: 2021-04-06; records serialization from 1988 issue 39
  - retrievedAt: 2026-08-23
- sourceName: Rakuten Books 夢の碑 original volume 1 product
  - sourceUrl: https://books.rakuten.co.jp/rb/377347/
  - publishedAt: 1984-11-20頃; approximate retailer display
  - retrievedAt: 2026-08-23
- sourceName: 小学館 夢の碑 とりかえばや異聞 official collection
  - sourceUrl: https://shogakukan-comic.jp/book?jdcn=091912210000d0000000
  - publishedAt: 2018-03-02
  - retrievedAt: 2026-08-23
- sourceName: 小学館eコミックストア 夢の碑 青頭巾 collection
  - sourceUrl: https://e-comi.shogakukan.co.jp/books/091912220000d0000000
  - publishedAt: 2018-03-02
  - retrievedAt: 2026-08-23
- sourceName: 赤塚不二夫 official rights-holder おそ松くん history
  - sourceUrl: https://www.koredeiinoda.net/manga/osomatsukun.html
  - publishedAt: undated; records the 1962 original run, 1987 revival, and 1988 editions
  - retrievedAt: 2026-08-23
- sourceName: 講談社 おそ松くん volume 1
  - sourceUrl: https://www.kodansha.co.jp/comic/products/0000120298
  - publishedAt: 1988-01-13
  - retrievedAt: 2026-08-23

The selection report and batch ledger receive only the derived 1960s era
change for おそ松くん. The frozen Work set and its order remain unchanged.
No canonical title, title delimiter, Factor, Genre, Theme, Art value, safety
state, eligibility, recommendation math, validator rule, generated artifact,
or Gold data is changed by this adjudication.
