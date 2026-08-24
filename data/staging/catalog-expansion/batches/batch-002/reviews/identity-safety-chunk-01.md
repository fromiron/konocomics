# Batch 002 chunk 01 identity, safety, and edition review

- reviewDate: 2026-08-23
- retrievedAt: 2026-08-23
- reviewedByHuman: false
- reviewer: Local Codex independent review
- reviewedRange: batch-002 frozen work set positions 1–10
- reviewScope: canonical identity, safety and scope, representative ISBN and edition mapping, and research metadata only
- excludedFromReview: Factor values, Genre assignment, Theme assignment, centrality, and Art values
- sourceMutation: none

This review compares the frozen selection and research packet with the current
`works.csv`, `volumes.csv`, `canonical-mapping.csv`, `rakuten-matches.csv`,
`safety-review.csv`, and `promotion-registry.csv` rows. The ten representative
ISBNs each occur exactly once in `data/source/volumes.csv`; this is an
intra-catalog uniqueness check, not an external identity source.

The Rakuten candidate rows do not contain a reliable nationality or original
format field. Scope conclusions below therefore do not infer nationality from
that API. They rely on official Japanese publisher pages identifying a manga
work, its creator, magazine or imprint, and the matched bound edition. No
nationality-inference test is proposed.

Violence, horror, or other dark subject matter is not treated as an adult-only
classification. A safety PASS means the matched official publisher product is
in an ordinary manga imprint or general manga category and the reviewed product
has no R18, 成人向け, 成年コミック, or equivalent adult-only marker. It is not a
content-suitability rating for every reader.

## Summary

| workId                      | canonicalTitle   | verdict            | representative ISBN | edition conclusion                             | safety and scope |
| --------------------------- | ---------------- | ------------------ | ------------------- | ---------------------------------------------- | ---------------- |
| `work-017446dd1a9039d9839b` | サンダー３       | PASS               | `9784065289280`     | standard volume 1                              | PASS             |
| `work-02d5d329c9ef85e481cb` | のたり松太郎     | needs-adjudication | `9784091800718`     | standard volume 1                              | PASS             |
| `work-089947c5303024841fef` | デカワンコ       | PASS               | `9784088655017`     | standard volume 1                              | PASS             |
| `work-0e036724913c69bb937a` | ファイアパンチ   | PASS               | `9784088807317`     | standard volume 1                              | PASS             |
| `work-1012948f5de799831da4` | RED              | needs-adjudication | `9784063460124`     | original アッパーズKC standard volume 1        | PASS             |
| `work-1088a1dc00a3b0d22201` | 邪眼は月輪に飛ぶ | PASS               | `9784091811974`     | unnumbered standard single volume              | PASS             |
| `work-19a26f01512166856a6a` | 銀河鉄道999      | needs-adjudication | `9784091880017`     | later 小学館 ビッグコミックスゴールド volume 1 | PASS             |
| `work-1e27731b880d0d9012f8` | 吉祥天女         | PASS               | `9784091313010`     | standard volume 1                              | PASS             |
| `work-207bb1ca28b7472fbe1d` | 六三四の剣       | PASS               | `9784091206312`     | standard volume 1                              | PASS             |
| `work-23851cd7ccf1d0c676cc` | 怪獣8号          | PASS               | `9784088825250`     | standard volume 1                              | PASS             |

Result: 7 PASS and 3 needs-adjudication. The three adjudication cases are
bibliographic metadata corrections, not safety blockers. No duplicate ISBN,
adult-only item, vertical-scroll original, non-manga product, or identity-hard-
blocker was found in this ten-work chunk.

## 1. work-017446dd1a9039d9839b — サンダー３

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. 講談社 presents the series and first volume as
  サンダー３ and credits 池田祐輝. The full-width `３` is part of the official
  title. Rakuten's `サンダー3（1）` is an edition display variant; the volume
  marker and parentheses are not part of the canonical title.
- current source and staging: `works.firstPublishedYear=2022` agrees with the
  publisher's first-appearance range beginning in 月刊少年マガジン 2022年6月号.
  Canonical and representative-ISBN staging states are consistent with the
  official volume.
- representative edition: PASS — ISBN `9784065289280`, standard paper volume 1,
  KCデラックス, released 2022-10-17. It is neither a set nor a limited,
  complete, bunko, or special edition.
- safety and scope: PASS. The official page identifies a 月刊少年マガジン manga
  serialization and ordinary KCデラックス volume. No adult-only sales marker
  appears on the matched publisher or Rakuten product.
- research metadata: PASS. The chunk research URLs, volume range, release date,
  creator, and selection provenance are identity-consistent.
- limitations: The official selection page proves selection provenance only.
  It does not prove any recommendation annotation. No creator nationality is
  inferred from Rakuten.
- evidence:
  - sourceName: 講談社 サンダー３ 1 official product page
    - sourceUrl: https://www.kodansha.co.jp/comic/products/0000368603
    - publishedAt: 2022-10-17
    - retrievedAt: 2026-08-23
  - sourceName: 次にくるマンガ大賞 2022 comics results
    - sourceUrl: https://tsugimanga.jp/winner/2022/comics
    - publishedAt: 2022-08-31
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books サンダー3 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/17149743/
    - publishedAt: 2022-10-17
    - retrievedAt: 2026-08-23

## 2. work-02d5d329c9ef85e481cb — のたり松太郎

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. The official 小学館 page identifies のたり松太郎,
  ちばてつや, ビッグコミック, and the 36-volume series. The official award
  archive binds the same title and creator.
- current source and staging: identity and ISBN states are sound, but
  `works.firstPublishedYear=1976` conflicts with an official Toei Animation work
  page stating that the manga began serialization in ビッグコミック in August 1973. Under the source contract, the Work year is the first formal
  serialization year, not the first representative-volume sale year.
- representative edition: PASS — ISBN `9784091800718`, ビッグコミックス
  standard volume 1. The ISBN occurs once in the source catalog and the official
  digital volume maps to the same first-volume contents. This ISBN does not need
  replacement merely because the Work year needs correction.
- safety and scope: PASS. 小学館 places it in the ordinary 少年・青年マンガ,
  ビッグコミック, and ビッグコミックス hierarchy, distinct from the site's
  adult-only category. The official serial and bound-edition evidence supports
  Japanese page-manga scope.
- research metadata: needs-adjudication only for the first-published year.
  Adjudication should change the Work year from 1976 to 1973, retain the current
  representative ISBN, and bind the correction to the official 1973-start
  source. It should not derive nationality from Rakuten.
- limitations: The current 小学館 e-comic page is undated and does not itself
  state the original serialization start. The 1973 date comes from the official
  adaptation work-information page, while the 小学館 award archive independently
  proves the title existed by the 1977 award cycle.
- evidence:
  - sourceName: 小学館 eコミックストア のたり松太郎 1
    - sourceUrl: https://e-comi.shogakukan.co.jp/books/091800710000d0000000
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Toei Animation 暴れん坊力士!!松太郎 work information
    - sourceUrl: https://www.toei-anim.co.jp/tv/matsutaro/about/
    - publishedAt: 2014
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 1977
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books のたり松太郎 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/925978/
    - publishedAt: undated
    - retrievedAt: 2026-08-23

## 3. work-089947c5303024841fef — デカワンコ

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. 集英社 identifies デカワンコ 1, creator 森本梢子,
  and YOU serialization. The title, creator, and first-volume mapping match the
  source and staging rows.
- current source and staging: `works.firstPublishedYear=2008` is consistent with
  the official paper-volume date. No same-title or creator collision was found
  in the reviewed rows.
- representative edition: PASS — ISBN `9784088655017`, クイーンズコミックス
  standard paper volume 1, paper release 2008-10-17. The official page is keyed
  by the digital JDCN but explicitly gives the corresponding paper release; the
  Rakuten product supplies the exact paper ISBN binding.
- safety and scope: PASS. 集英社 identifies an ordinary YOU manga publication
  and paper comics edition. No adult-only marker appears on the matched product.
- research metadata: PASS. The paper and digital dates are correctly separated;
  the digital date must not replace the 2008 Work year.
- limitations: The official page's headline is the digital edition. The paper
  ISBN binding therefore depends on the matching Rakuten product plus the
  official page's explicit paper-edition date, rather than an ISBN printed on
  that JDCN page.
- evidence:
  - sourceName: 集英社 デカワンコ 1 official product page
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865501865501315501
    - publishedAt: 2008-10-17 paper; 2012-06-29 digital
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books デカワンコ 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/5848504/
    - publishedAt: 2008-10
    - retrievedAt: 2026-08-23
  - sourceName: マンガ大賞 2010 archive
    - sourceUrl: https://www.mangataisho.com/archives/2010.html
    - publishedAt: 2010
    - retrievedAt: 2026-08-23

## 4. work-0e036724913c69bb937a — ファイアパンチ

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. The exact 集英社 ISBN page identifies
  ファイアパンチ 1, 藤本タツキ, ジャンプコミックス, and 少年ジャンプ＋.
- current source and staging: `works.firstPublishedYear=2016`, creator,
  publisher, and canonical mapping are consistent with the official edition.
- representative edition: PASS — ISBN `9784088807317`, standard paper volume 1,
  ジャンプコミックス, released 2016-07-04. It is not a special or set product.
- safety and scope: PASS. The story includes severe violence, but the matched
  item is an ordinary ジャンプコミックス volume from 少年ジャンプ＋ and is
  not sold as an adult-only product. Violent content alone is not an adult block.
- research metadata: PASS. Official publisher and award URLs are correctly
  separated from selection provenance. The award comments may support later
  review work but do not alter this identity or safety verdict.
- limitations: This review does not convert plot violence or award comments into
  recommendation values. It also does not infer creator nationality from the
  retailer response.
- evidence:
  - sourceName: 集英社 ファイアパンチ 1 official product page
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-880731-7
    - publishedAt: 2016-07-04
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books ファイアパンチ 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/14249293/
    - publishedAt: 2016-07-04
    - retrievedAt: 2026-08-23
  - sourceName: マンガ大賞 2017 archive
    - sourceUrl: https://www.mangataisho.com/archives/2017.html
    - publishedAt: 2017
    - retrievedAt: 2026-08-23

## 5. work-1012948f5de799831da4 — RED

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 講談社 binds the title, creator 村枝賢一, and ISBN
  to the western manga series. Canonical `RED` is an ASCII-width normalization
  of the official full-width uppercase title; Rakuten's `Red` capitalization is
  an edition display variant, not a different Work.
- current source and staging: `works.firstPublishedYear=1999` conflicts with the
  official first-volume page, which states that its contents first appeared in
  ヤングマガジンアッパーズ 1998年第15号 through 1999年第4号. The Work year must
  therefore start in 1998 even though volume 1 was released in 1999.
- representative edition: PASS — ISBN `9784063460124`, original アッパーズKC
  standard volume 1, official paper release 1999-03-06. The research packet's
  later 新装版 is a two-original-volume collected edition and must not replace
  this representative ISBN or become a second Work.
- safety and scope: PASS. The exact publisher page identifies an ordinary
  講談社 comics volume and its magazine first appearance, with no adult-only
  product marker. Violent historical material is not an adult-only classification.
- research metadata: needs-adjudication only for `firstPublishedYear`.
  Adjudication should set it to 1998 and retain ISBN `9784063460124` as the
  representative original standard volume.
- limitations: The volume 2 product description repeats a series-level summary,
  and the later two-in-one page covers only the original volumes 1–2. Neither is
  independent evidence for later content or recommendation annotation.
- evidence:
  - sourceName: 講談社 RED 1 official product page
    - sourceUrl: https://www.kodansha.co.jp/comic/products/0000009137
    - publishedAt: 1999-03-06; first appearance begins in 1998
    - retrievedAt: 2026-08-23
  - sourceName: 講談社 RED series page
    - sourceUrl: https://www.kodansha.co.jp/titles/1000000217
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books Red 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/1045091/
    - publishedAt: 1999-03
    - retrievedAt: 2026-08-23
  - sourceName: マンガ大賞 2008 archive
    - sourceUrl: https://www.mangataisho.com/archives/2008.html
    - publishedAt: 2008
    - retrievedAt: 2026-08-23

## 6. work-1088a1dc00a3b0d22201 — 邪眼は月輪に飛ぶ

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. 小学館 identifies the exact title, creator
  藤田和日郎, and the complete single-volume publication. The whitespace in
  the current source creator display is normalization-only and does not indicate
  a different creator.
- current source and staging: The blank `works.firstPublishedYear` is acceptable
  under the source contract because the available product page proves the
  volume release, not the exact first serialization year. It should not be
  filled from the representative-volume date without separate official start
  evidence.
- representative edition: PASS — ISBN `9784091811974`, standard unnumbered
  single volume, ビッグコミックス, released 2007-04-27. A blank source
  `volumeNumber` is appropriate because the official title is unnumbered and the
  Work is one volume. Completion status does not make it a special `complete`
  edition.
- safety and scope: PASS. 小学館 classifies the work under ordinary
  少年・青年マンガ and ビッグコミックスピリッツ, distinct from its adult-only
  category. The concentrated magazine serial and bound volume support page-manga
  scope.
- research metadata: PASS. The official product, one-volume range, creator, and
  representative mapping are consistent.
- limitations: No official start-year source was found in this packet. Leaving
  the Work year blank is preferable to substituting the 2007 volume release.
- evidence:
  - sourceName: 小学館 邪眼は月輪に飛ぶ official book page
    - sourceUrl: https://shogakukan-comic.jp/book?isbn=9784091811974
    - publishedAt: 2007-04-27
    - retrievedAt: 2026-08-23
  - sourceName: 小学館 eコミックストア 邪眼は月輪に飛ぶ
    - sourceUrl: https://e-comi.shogakukan.co.jp/books/091811970000d0000000
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 邪眼は月輪に飛ぶ product
    - sourceUrl: https://books.rakuten.co.jp/rb/4326313/
    - publishedAt: 2007-04-27
    - retrievedAt: 2026-08-23

## 7. work-19a26f01512166856a6a — 銀河鉄道999

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS at Work level. The official award archive binds
  銀河鉄道999 and 松本零士. The reviewed 小学館 edition contains that Work, not a
  distinct sequel or an animation product.
- current source and staging: The current `works.firstPublishedYear=1997` is the
  release year of the representative 小学館 ビッグコミックスゴールド edition,
  not the Work's first publication year. The official award archive already
  records the Work in the 1977 award cycle and identifies the original magazine
  as 週刊少年キング and publisher as 少年画報社. The current Work publisher
  `小学館` therefore also appears to describe the representative edition rather
  than the original Work bibliography.
- representative edition: conditionally PASS — ISBN `9784091880017`, 小学館
  ビッグコミックスゴールド volume 1, subtitle 出発のバラード, released
  1997-04. It is a valid ordinary later collected edition and occurs once in the
  source catalog. `editionKind=standard` is the closest current schema value,
  but the review record must preserve that it is not the original edition.
- safety and scope: PASS. The official archive identifies a Japanese magazine
  manga, and 小学館 places the matched edition in its ordinary
  少年・青年マンガ/ビッグコミックス line. There is no adult-only product marker.
- research metadata: needs-adjudication. Remove 1997 from the Work start-year
  field and store it only as the representative edition release date. Obtain an
  official exact original-serialization start source before setting a replacement
  year. Adjudication must also decide whether `works.publisher` denotes original
  Work publisher; if it does, 小学館 must be corrected while remaining attached
  to the representative volume.
- limitations: The 小学館 e-comic 21-volume organization is a later edition and
  is not proof that its volume boundaries match the original edition. The 1977
  award proves that 1997 cannot be the Work start year, but by itself does not
  prove the exact first issue date.
- evidence:
  - sourceName: 小学館 eコミックストア 銀河鉄道999 1
    - sourceUrl: https://e-comi.shogakukan.co.jp/books/091880010000d0000000
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 銀河鉄道999 1 出発のバラード product
    - sourceUrl: https://books.rakuten.co.jp/rb/880883/
    - publishedAt: 1997-04
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 1977
    - retrievedAt: 2026-08-23

## 8. work-1e27731b880d0d9012f8 — 吉祥天女

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. 小学館 identifies 吉祥天女, creator 吉田秋生,
  ベツコミ, フラワーコミックス, and the completed four-volume series. The
  award archive independently binds the same title and creator.
- current source and staging: `works.firstPublishedYear=1983`, creator,
  publisher, title, and ISBN mapping are mutually consistent with the official
  award cycle and first-volume sale year. No conflicting same-title Work was
  found in the reviewed rows.
- representative edition: PASS — ISBN `9784091313010`, フラワーコミックス
  standard volume 1, released approximately 1983-09-26. It is not the later
  bunko or anthology edition.
- safety and scope: PASS. 小学館 places the series in its ordinary
  少女・女性マンガ and ベツコミ hierarchy, not the site's adult-only category.
  Official magazine and comics metadata support Japanese page-manga scope.
- research metadata: PASS for identity and edition. The chunk correctly warns
  that the 1–3 volume pages repeat the same short series synopsis; those pages
  must not be counted as three independent observations.
- limitations: The official product copy is too repetitive for detailed
  recommendation annotation. That limitation does not undermine canonical
  identity, edition, or safety.
- evidence:
  - sourceName: 小学館 eコミックストア 吉祥天女 1
    - sourceUrl: https://e-comi.shogakukan.co.jp/books/091313010000d0000000
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 吉祥天女 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/741521/
    - publishedAt: 1983-09-26 approximate
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 1983
    - retrievedAt: 2026-08-23

## 9. work-207bb1ca28b7472fbe1d — 六三四の剣

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. 小学館 identifies 六三四の剣, creator 村上もとか,
  少年サンデー, 少年サンデーコミックス, and the completed 24-volume series.
  The award archive binds the same title and creator.
- current source and staging: The title, creator, publisher, representative
  volume, and `works.firstPublishedYear=1981` have no conflict in the reviewed
  official records. The 1983 award year is selection provenance and must not
  replace the Work year.
- representative edition: PASS — ISBN `9784091206312`, 少年サンデーコミックス
  standard volume 1. The ISBN occurs once in the source catalog and is not the
  later 小学館文庫 edition.
- safety and scope: PASS. The official product is in ordinary 少年・青年マンガ,
  少年サンデー, and 少年サンデーコミックス categories, with no adult-only
  marker. Official serial and volume metadata support Japanese page-manga scope.
- research metadata: PASS. The chunk's volume 1–3 sources map to the same
  standard series and do not introduce a duplicate edition Work.
- limitations: The reviewed official product page does not provide the paper
  release date or print ISBN inline. The exact ISBN binding relies on the matched
  Rakuten product and current unique source row, while the publisher page proves
  series identity and imprint.
- evidence:
  - sourceName: 小学館 eコミックストア 六三四の剣 1
    - sourceUrl: https://e-comi.shogakukan.co.jp/books/091206310000d0000000
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 六三四の剣 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/376378/
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 1983
    - retrievedAt: 2026-08-23

## 10. work-23851cd7ccf1d0c676cc — 怪獣8号

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. The exact 集英社 ISBN page identifies 怪獣8号 1,
  creator 松本直也, ジャンプコミックス, and 少年ジャンプ＋. The award,
  bookseller, and editorial membership rows converge on the same Work.
- current source and staging: `works.firstPublishedYear=2020`, creator,
  publisher, canonical title, and representative ISBN agree with the official
  publisher page. The three source memberships are correctly duplicates of one
  canonical Work rather than three Works.
- representative edition: PASS — ISBN `9784088825250`, ジャンプコミックス
  standard paper volume 1, released 2020-12-04. It is neither a set nor a special
  edition.
- safety and scope: PASS. The official publisher identifies an ordinary
  少年ジャンプ＋ manga and ジャンプコミックス volume, with no adult-only sales
  marker. Monster violence does not by itself create an adult-only block.
- research metadata: PASS. The official volume dates and selection sources are
  separated correctly; selection membership is not recommendation annotation.
- limitations: Award comments and editorial ranking may be reviewed later for
  their proper evidence role, but they do not establish identity beyond the
  exact publisher and ISBN pages and do not assign any recommendation values.
- evidence:
  - sourceName: 集英社 怪獣8号 1 official product page
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882525-0
    - publishedAt: 2020-12-04
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 怪獣8号 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/16503594/
    - publishedAt: 2020-12-04
    - retrievedAt: 2026-08-23
  - sourceName: マンガ大賞 2021 archive
    - sourceUrl: https://www.mangataisho.com/archives/2021.html
    - publishedAt: 2021
    - retrievedAt: 2026-08-23
  - sourceName: このマンガがすごい 2022 official results article
    - sourceUrl: https://sugoiweb.jp/column/4815/
    - publishedAt: 2021-12-07
    - retrievedAt: 2026-08-23

## Adjudication queue produced by this review

1. `work-02d5d329c9ef85e481cb`: correct `firstPublishedYear` from 1976 to
   official serialization start 1973; retain ISBN `9784091800718`.
2. `work-1012948f5de799831da4`: correct `firstPublishedYear` from 1999 to 1998;
   retain original volume-1 ISBN `9784063460124` and do not promote the later
   two-in-one edition to a separate Work.
3. `work-19a26f01512166856a6a`: remove the representative-edition year 1997
   from the Work start-year field, obtain an official exact original start date,
   and adjudicate original Work publisher versus representative-edition
   publisher. Retain ISBN `9784091880017` only as an explicitly later 小学館
   ビッグコミックスゴールド representative edition.

These are reproducible metadata corrections. None is a safety or scope hard
blocker, and this review does not authorize a source-catalog mutation or
recommendation promotion.
