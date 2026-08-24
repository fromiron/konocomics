# Batch 002 chunk 02 identity, safety, and edition review

- reviewDate: 2026-08-23
- retrievedAt: 2026-08-23
- reviewedByHuman: false
- reviewer: Local Codex independent review
- reviewedRange: batch-002 frozen work set positions 11–20
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
They rely on official Japanese publisher pages that identify a manga work,
creator, serial venue or comics imprint, and the matched bound edition.

Violence, horror, crime, an adult magazine mentioned inside a story, or a work's
origin as a prototype shown at a creator event is not treated as an adult-only
sales classification. A safety PASS means the reviewed official publisher and
retailer product is an ordinary manga edition with no R18, 成人向け,
成年コミック, or equivalent adult-only marker. It is not a reader-age or
content-suitability rating.

## Summary

| workId                      | canonicalTitle   | verdict            | representative ISBN | edition conclusion                              | safety and scope |
| --------------------------- | ---------------- | ------------------ | ------------------- | ----------------------------------------------- | ---------------- |
| `work-29d4300ad9d3358fb67a` | 外天楼           | needs-adjudication | `9784063761597`     | standard unnumbered single volume               | PASS             |
| `work-3dfaf6231e21133620c6` | 忍者と極道       | PASS               | `9784065193655`     | standard volume 1                               | PASS             |
| `work-3e725951eb9c49771087` | 嘘解きレトリック | needs-adjudication | `9784592196334`     | standard volume 1                               | PASS             |
| `work-40b8c35b1d8c9a90144c` | orange           | needs-adjudication | `9784088468044`     | original 集英社 マーガレットコミックス volume 1 | PASS             |
| `work-4c784fc78dfd9b139c3f` | 正反対な君と僕   | PASS               | `9784088831251`     | standard volume 1                               | PASS             |
| `work-518d7ed42dd9253679c3` | 墨攻             | needs-adjudication | `9784091830418`     | standard ビッグコミックス volume 1              | PASS             |
| `work-53e54c95f637b66c4fb2` | がんばれ元気     | needs-adjudication | `9784091202116`     | standard 少年サンデーコミックス volume 1        | PASS             |
| `work-5915d6d7601377fcc75f` | 赤髪の白雪姫     | needs-adjudication | `9784592183730`     | standard 花とゆめコミックス volume 1            | PASS             |
| `work-5b4dc4e6e966436b2990` | 人形芝居         | needs-adjudication | `9784592177098`     | standard 花とゆめコミックス volume 1            | PASS             |
| `work-5b9a3ec60ac5fc90f444` | 魔法使いの嫁     | needs-adjudication | `9784800002846`     | former マッグガーデン standard volume 1         | PASS             |

Result: 2 PASS and 8 needs-adjudication. Six adjudication items are narrow
first-publication metadata repairs or verification gaps. The orange item needs
an official original-to-current edition bridge, and 墨攻 needs a creator-credit
decision against the official three-name credit. None is a safety or scope hard
blocker. No duplicate ISBN, adult-only item, webtoon or vertical-scroll original,
non-manga product, duplicate Work, or identity hard blocker was found.

## 11. work-29d4300ad9d3358fb67a — 外天楼

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 講談社 identifies 外天楼, creator 石黒正数,
  the nine collected pieces, and the single bound volume. The empty source
  `volumeNumber` is appropriate for an officially unnumbered one-volume title.
- current source and staging: title, creator, publisher, canonical mapping,
  safety, and representative-ISBN states are mutually consistent. The blank
  `works.firstPublishedYear` is incomplete because the official product page
  identifies the collected メフィスト publication range as 2008–2011.
- first-publication audit: needs correction from blank to 2008. The 2011 volume
  release belongs to `volumes.releaseDate` and must not become the Work start
  year.
- representative edition: PASS — ISBN `9784063761597`, standard unnumbered
  single volume, released 2011-10-21. Its ISBN-13 checksum is valid and it
  occurs once in the source catalog. It is not a set, limited, complete, bunko,
  or special edition.
- safety and scope: PASS. The official page presents collected manga chapters
  and an ordinary 講談社 comics product. A plot episode involving boys seeking
  an adult magazine is story content, not an adult-only product marker. Neither
  the publisher nor matched Rakuten product carries an adult-only sales marker.
- research metadata: PASS except for carrying the official 2008 start into the
  Work row. The 단권 evaluation range and chapter list are correctly recorded.
- limitations: The product page does not expose every original issue date. The
  explicit 2008–2011 publication range is sufficient for the year-level Work
  field but not for an exact start date.
- evidence:
  - sourceName: 講談社 外天楼 official product page
    - sourceUrl: https://www.kodansha.co.jp/comic/products/0000223170
    - publishedAt: 2011-10-21; collected publication range begins 2008
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 外天楼 product
    - sourceUrl: https://books.rakuten.co.jp/rb/11378102/
    - publishedAt: 2011-10-21
    - retrievedAt: 2026-08-23
  - sourceName: マンガ大賞 2012 archive
    - sourceUrl: https://www.mangataisho.com/archives/2012.html
    - publishedAt: 2012
    - retrievedAt: 2026-08-23

## 12. work-3dfaf6231e21133620c6 — 忍者と極道

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. 講談社 binds the title, creator 近藤信輔,
  Comic DAYS serialization, and the numbered first three standard volumes.
  Rakuten's parenthesized volume marker is edition display text, not part of the
  canonical title.
- current source and staging: `works.firstPublishedYear=2020`, title, creator,
  publisher, demographic, canonical mappings, and representative ISBN agree
  with the official first-volume publication range.
- first-publication audit: PASS. The 2020 Work year reflects the official
  Comic DAYS publication range beginning in January 2020, not merely the
  2020-04-08 volume release.
- representative edition: PASS — ISBN `9784065193655`, standard volume 1,
  released 2020-04-08. Its checksum is valid and it occurs once in the source
  catalog. It is not a special or collected edition.
- safety and scope: PASS. The official product is an ordinary 講談社 manga
  volume from a page-based Comic DAYS serialization. Severe violence in the
  premise does not create an adult-only sales classification, and no adult-only
  marker appears on the reviewed products.
- research metadata: PASS. The first three official volume ranges, creator,
  publication dates, and selection provenance map to one Work.
- limitations: This review does not derive safety from the editorial ranking
  itself and does not convert violent content into recommendation values.
- evidence:
  - sourceName: 講談社 忍者と極道 1 official product page
    - sourceUrl: https://www.kodansha.co.jp/comic/products/0000339844
    - publishedAt: 2020-04-08; included serial range begins 2020-01
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 忍者と極道 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/16264636/
    - publishedAt: 2020-04-08
    - retrievedAt: 2026-08-23
  - sourceName: このマンガがすごい 2021 official results
    - sourceUrl: https://sugoiweb.jp/column/4868/
    - publishedAt: 2020-12-10
    - retrievedAt: 2026-08-23

## 13. work-3e725951eb9c49771087 — 嘘解きレトリック

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 白泉社 identifies 嘘解きレトリック 1,
  creator 都戸利津, 花とゆめコミックス, and the same ten-volume manga
  described by the official adaptation and publisher announcements.
- current source and staging: the title, creator, publisher, representative
  ISBN, and canonical mapping are sound. `works.firstPublishedYear=2013` is the
  first standard-volume year, while official 白泉社 and フジテレビ material
  states that serialization ran from 2012 through 2018.
- first-publication audit: needs correction from 2013 to 2012. The
  2013-06-20 date remains the representative volume release date.
- representative edition: PASS — ISBN `9784592196334`, 花とゆめコミックス
  standard volume 1, released 2013-06-20. Its checksum is valid and it occurs
  once in the source catalog. It is not a later reissue or special edition.
- safety and scope: PASS. The official publisher page presents an ordinary
  花とゆめコミックス manga, and the official serial metadata establishes
  Japanese magazine page-manga scope. No adult-only marker appears.
- research metadata: needs-adjudication only for the Work year. The official
  first-three-volume pages and the warning not to use award membership as
  content evidence remain correct.
- limitations: The exact 2012 issue number is unnecessary for a year-level
  field and is not inferred here.
- evidence:
  - sourceName: 白泉社 嘘解きレトリック 1 official product page
    - sourceUrl: https://www.hakusensha.co.jp/comicslist/45955/
    - publishedAt: 2013-06-20
    - retrievedAt: 2026-08-23
  - sourceName: 白泉社 Manga Park adaptation campaign announcement
    - sourceUrl: https://prtimes.jp/main/html/rd/p/000001535.000046848.html
    - publishedAt: 2024-09-09; states 2012–2018 serialization
    - retrievedAt: 2026-08-23
  - sourceName: フジテレビ 嘘解きレトリック introduction
    - sourceUrl: https://www.fujitv.co.jp/usotoki/introduction/
    - publishedAt: 2024-08-26; states 2012–2018 serialization
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 嘘解きレトリック 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/12324789/
    - publishedAt: 2013-06-20
    - retrievedAt: 2026-08-23

## 14. work-40b8c35b1d8c9a90144c — orange

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS at Work level. The frozen selection memberships,
  Rakuten original-volume product, and current 双葉社 official series material
  converge on 高野苺's orange. The lowercase ASCII title is the official Work
  title and contains no volume or decorative delimiter.
- current source and staging: `works.publisher=集英社` and
  `works.firstPublishedYear=2012` are appropriate for the original Work and
  first standard edition. The six source memberships correctly collapse to one
  canonical Work. They must not create separate 集英社 and 双葉社 Works.
- first-publication audit: conditionally PASS. The 2012 value is consistent
  with the original 集英社 volume and Work era. No evidence suggests that a
  later 双葉社 release year contaminated this field.
- representative edition: needs official edition adjudication — ISBN
  `9784088468044` has a valid checksum, occurs once in the source catalog, and
  Rakuten identifies it as the original 集英社 マーガレットコミックス
  standard volume 1 released in 2012-07. The research packet did not obtain a
  current official 集英社 product page or an official publisher transfer table
  directly mapping that volume to the later 双葉社 editions. Retain the ISBN;
  do not replace it with a 双葉社 ISBN or split the Work. Add an official
  original-to-current edition bridge before final promotion.
- safety and scope: PASS. The original retailer record is an ordinary
  マーガレットコミックス manga, and 双葉社's official series and comics
  catalog present the same creator and title as ordinary manga. No adult-only
  marker appears.
- research metadata: PASS. It correctly separates current-publisher series
  material from edition-only catalog evidence and explicitly records the
  missing original-edition bridge.
- limitations: The 双葉社 order sheet proves its own 1–3 ISBNs but does not by
  itself prove page-for-page identity with the 集英社 original. This is an
  edition-evidence gap, not an identity or safety hard blocker.
- evidence:
  - sourceName: 双葉社 orange official special site
    - sourceUrl: https://www.futabasha.co.jp/introduction/orange/pc/index.html
    - publishedAt: 2014 copyright; page publication date otherwise undated
    - retrievedAt: 2026-08-23
  - sourceName: 双葉社 comics order catalog 2022-02
    - sourceUrl: https://www.futabasha.co.jp/pdf/to-store-extra/comics.pdf
    - publishedAt: 2022-02
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books orange 1 original 集英社 product
    - sourceUrl: https://books.rakuten.co.jp/rb/11742628/
    - publishedAt: 2012-07
    - retrievedAt: 2026-08-23
  - sourceName: 次にくるマンガ大賞 2015 comics results
    - sourceUrl: https://tsugimanga.jp/winner/2015/comics
    - publishedAt: 2015-02-06
    - retrievedAt: 2026-08-23

## 15. work-4c784fc78dfd9b139c3f — 正反対な君と僕

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. The exact 集英社 page identifies 正反対な君と僕
  1, creator 阿賀沢紅茶, 少年ジャンプ＋, and the matching paper ISBN. The
  four source memberships are duplicate provenance for one canonical Work.
- current source and staging: `works.firstPublishedYear=2022`, title, creator,
  publisher, demographic, representative ISBN, and mappings agree with the
  official page.
- first-publication audit: PASS. The official first-volume page binds chapters
  1–6 and the 少年ジャンプ＋ publication to 2022; the year is not a later
  edition or reprint value.
- representative edition: PASS — ISBN `9784088831251`, standard paper volume 1,
  ジャンプコミックス, released 2022-07-04. Its checksum is valid and it
  occurs once in the source catalog.
- safety and scope: PASS. The official page identifies an ordinary
  少年ジャンプ＋ page-manga and standard bound comic. No adult-only marker
  appears.
- research metadata: PASS. The paper and digital identity, chapter range,
  official jury packet, and selection provenance are kept in their proper roles.
- limitations: The jury packet is not identity evidence and does not create a
  human review or recommendation value.
- evidence:
  - sourceName: 集英社 正反対な君と僕 1 official product page
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000022198000
    - publishedAt: 2022-07-04
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 正反対な君と僕 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/17163482/
    - publishedAt: 2022-07-04
    - retrievedAt: 2026-08-23
  - sourceName: マンガ大賞 2023 archive
    - sourceUrl: https://www.mangataisho.com/archives/2023.html
    - publishedAt: 2023
    - retrievedAt: 2026-08-23

## 16. work-518d7ed42dd9253679c3 — 墨攻

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS at Work level. 小学館 identifies the completed
  11-volume manga 墨攻 and credits 森秀樹, 酒見賢一, and 久保田千太郎. This is
  the manga adaptation Work, not 酒見賢一's prose source or a film novelization.
- current source and staging: title, publisher, representative ISBN, canonical
  mapping, and `works.firstPublishedYear=1992` have no conflicting official
  year evidence in the reviewed packet. The current creator cell lists
  `森秀樹;酒見賢一` but omits the official series credit 久保田千太郎.
- first-publication audit: conditionally PASS. The 1992 Work year is plausible
  and not shown to be a later-edition year, but the reviewed official e-comic
  page is undated and does not independently state the first serialization
  year. Do not replace it from a reprint date.
- representative edition: PASS — ISBN `9784091830418`, standard
  ビッグコミックス volume 1, not the separately listed 小学館文庫 edition.
  Its checksum is valid and it occurs once in the source catalog. The official
  e-comic page establishes the standard series and Rakuten binds the exact ISBN.
- safety and scope: PASS. 小学館 classifies the product as completed
  少年・青年マンガ in ビッグコミック/ビッグコミックス. A prose source does
  not make the reviewed manga volume a non-manga product. No adult-only marker
  appears.
- research metadata: needs-adjudication for creator completeness. Decide whether
  the flat `creators` contract includes the officially credited scenario
  collaborator; if it does, append 久保田千太郎 with role provenance. Do not
  create a second Work.
- limitations: The e-comic page is a later digital presentation and does not
  provide a first-edition contents mapping or exact start year. That does not
  invalidate the unique standard-volume ISBN.
- evidence:
  - sourceName: 小学館 eコミックストア 墨攻 1
    - sourceUrl: https://e-comi.shogakukan.co.jp/books/091830410000d0000000
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: 小学館 eコミックストア 墨攻 edition list
    - sourceUrl: https://csbs.shogakukan.co.jp/book/list-ec-books?book_group_id=5977
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 墨攻 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/555187/
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 1994
    - retrievedAt: 2026-08-23

## 17. work-53e54c95f637b66c4fb2 — がんばれ元気

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 小学館's 少年サンデー page identifies
  がんばれ元気, creator 小山ゆう, and the original 1976–1981 magazine
  serialization. The official award archive binds the same Work and creator.
- current source and staging: title, creator, publisher, canonical mapping, and
  representative ISBN are sound. `works.firstPublishedYear=1977` conflicts with
  the official 少年サンデー serialization range beginning in 1976.
- first-publication audit: needs correction from 1977 to 1976. The current value
  appears to reflect a representative-volume era rather than the first formal
  serialization year.
- representative edition: PASS — ISBN `9784091202116`, standard
  少年サンデーコミックス volume 1. Its checksum is valid and it occurs once
  in the source catalog. The official e-comic content maps to the same series;
  no evidence identifies this ISBN as bunko, complete, limited, or a set.
- safety and scope: PASS. Official 少年サンデー and 小学館 pages identify a
  magazine manga and ordinary standard volume. Boxing injury and death in the
  story are not adult-only sales markers, and no such marker appears.
- research metadata: needs-adjudication only for the start year. The research
  packet correctly called out the 1976 award/current-1977 inconsistency and did
  not silently overwrite it.
- limitations: The official 少年サンデー page supplies a year-and-issue range;
  this review does not need to infer an exact calendar date.
- evidence:
  - sourceName: 小学館 少年サンデー がんばれ元気 work page
    - sourceUrl: https://websunday.net/4250/
    - publishedAt: undated; states 1976 issue 19 through 1981 issue 14
    - retrievedAt: 2026-08-23
  - sourceName: 小学館 eコミックストア がんばれ元気 1
    - sourceUrl: https://e-comi.shogakukan.co.jp/books/091202110000d0000000
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books がんばれ元気 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/376287/
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: 小学館漫画賞 past winners archive
    - sourceUrl: https://shogakukan-comic.jp/shogakukan-mangasho-archives
    - publishedAt: 1976
    - retrievedAt: 2026-08-23

## 18. work-5915d6d7601377fcc75f — 赤髪の白雪姫

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 白泉社 identifies 赤髪の白雪姫 1, creator
  あきづき空太, 花とゆめコミックス, and the same Work described by its
  official exhibition announcement.
- current source and staging: title, creator, publisher, canonical mapping, and
  representative ISBN are consistent. `works.firstPublishedYear=2007` matches
  the representative volume year, while an official 白泉社 announcement states
  that the Work began in 2006.
- first-publication audit: needs correction from 2007 to 2006 under the current
  year-level Work contract. Retain 2007-12-05 only as the standard volume-1
  release date.
- representative edition: PASS — ISBN `9784592183730`, 花とゆめコミックス
  standard volume 1, released 2007-12-05. Its checksum is valid and it occurs
  once in the source catalog. The volume also contains a separate short story;
  that inclusion does not make the series volume a duplicate Work or special
  edition.
- safety and scope: PASS. 白泉社 presents an ordinary LaLa/花とゆめコミックス
  manga and standard bound volume. No adult-only marker appears.
- research metadata: needs-adjudication only for the Work year. The first-three-
  volume product pages and their release dates remain correctly mapped.
- limitations: The year field records the earliest official Work publication,
  not whether the 2006 appearance was marketed as a one-shot before later
  serialization. No more precise date is asserted here.
- evidence:
  - sourceName: 白泉社 赤髪の白雪姫 1 official product page
    - sourceUrl: https://www.hakusensha.co.jp/comicslist/44169/
    - publishedAt: 2007-12-05
    - retrievedAt: 2026-08-23
  - sourceName: 白泉社 赤髪の白雪姫 exhibition announcement
    - sourceUrl: https://prtimes.jp/main/html/rd/p/000001438.000046848.html
    - publishedAt: 2024-06-24; states publication began in 2006
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 赤髪の白雪姫 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/5097571/
    - publishedAt: 2007-12-05
    - retrievedAt: 2026-08-23
  - sourceName: マンガ大賞 2008 archive
    - sourceUrl: https://www.mangataisho.com/archives/2008.html
    - publishedAt: 2008
    - retrievedAt: 2026-08-23

## 19. work-5b4dc4e6e966436b2990 — 人形芝居

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 白泉社 identifies 人形芝居 1, creator 高尾滋,
  花とゆめコミックス, and the same episodic manga later announced as a
  returning serial. Volumes separated by long publication gaps remain one
  canonical episodic Work, not separate Works.
- current source and staging: title, creator, publisher, canonical mapping, and
  representative ISBN are sound. `works.firstPublishedYear=1998` exactly matches
  volume 1's release, but the reviewed official product page does not state the
  first magazine appearance. The official 2018 magazine page calls the work a
  returning serial and therefore does not validate 1998 as the original start.
- first-publication audit: needs verification before promotion. Do not preserve
  1998 merely because it is the representative-volume year, and do not replace
  it from non-official recollection. Obtain a 白泉社 original magazine or award
  archive; then set the verified year or clear the field if it remains unknown.
- representative edition: PASS — ISBN `9784592177098`, 花とゆめコミックス
  standard volume 1, released 1998-10-19. Its checksum is valid and it occurs
  once in the source catalog. It is not a set, bunko, complete, or special
  edition.
- safety and scope: PASS. The official publisher identifies an ordinary
  花とゆめコミックス manga and later magazine serialization. The futuristic
  mechanical-doll subject does not alter scope, and no adult-only marker appears.
- research metadata: PASS. It correctly records the episodic structure, the
  nine-year gap between volumes 2 and 3, and the danger of treating the volumes
  as one continuous early arc.
- limitations: The current official book and 2018 magazine pages do not expose
  the original issue-level bibliography. This is a metadata gap, not an identity
  or safety blocker.
- evidence:
  - sourceName: 白泉社 人形芝居 1 official product page
    - sourceUrl: https://www.hakusensha.co.jp/comicslist/41133/
    - publishedAt: 1998-10-19
    - retrievedAt: 2026-08-23
  - sourceName: 白泉社 別冊花とゆめ 2018-05 issue announcement
    - sourceUrl: https://www.hakusensha.co.jp/news/51524/
    - publishedAt: 2018-03-26
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 人形芝居 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/1011238/
    - publishedAt: 1998-10-19
    - retrievedAt: 2026-08-23
  - sourceName: マンガ大賞 2009 archive
    - sourceUrl: https://www.mangataisho.com/archives/2009.html
    - publishedAt: 2009
    - retrievedAt: 2026-08-23

## 20. work-5b9a3ec60ac5fc90f444 — 魔法使いの嫁

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. マッグガーデン's former-edition notice binds
  ISBN `9784800002846` to 魔法使いの嫁 1 and creator ヤマザキコレ.
  ブシロードワークス officially connects chapters 1–95 with the resumed
  chapter 96 onward, proving one continuing Work across publishers.
- current source and staging: title, creator, original publisher, canonical
  mappings, and representative ISBN are sound. `works.firstPublishedYear=2014`
  reflects the old volume era, while an official マッグガーデン announcement
  states that serialization began in 2013.
- first-publication audit: needs correction from 2014 to 2013. The former
  publisher's volume-1 release remains edition metadata and must not replace the
  serialization start.
- representative edition: PASS — ISBN `9784800002846`, former マッグガーデン
  standard volume 1. Its checksum is valid and it occurs once in the source
  catalog. The 2024 ブシロードワークス volume is a current-publisher edition,
  not a second Work and not a reason to replace the frozen representative ISBN.
  The former publisher notice separately lists limited editions and starter
  packs, so those must remain excluded.
- safety and scope: PASS. The reviewed item is an ordinary commercial manga
  volume and the current publisher continues the same numbered manga chapters.
  The publisher's separate account of an earlier creator prototype does not turn
  the officially serialized commercial Work into an excluded doujin or fan
  product. No adult-only marker appears.
- research metadata: needs-adjudication only for the Work year. The packet
  correctly isolates edition-transfer documents from content evidence and
  records the lack of direct official 1–3 volume descriptions.
- limitations: The official notices do not prove page-for-page identity between
  old and current editions. That limitation affects content annotation, not the
  old ISBN's identity as standard volume 1.
- evidence:
  - sourceName: マッグガーデン old-edition shipment-end notice
    - sourceUrl: https://www.mag-garden.co.jp/news/12448/
    - publishedAt: 2024-01-05
    - retrievedAt: 2026-08-23
  - sourceName: マッグガーデン original-rights announcement
    - sourceUrl: https://www.mag-garden.co.jp/news/7879/
    - publishedAt: 2020-03-10; states serialization began in 2013
    - retrievedAt: 2026-08-23
  - sourceName: ブシロードワークス serialization-resumption release
    - sourceUrl: https://bushiroad.com/media/3ca852dcac7a868c
    - publishedAt: 2023-12-20
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 魔法使いの嫁 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/12690122/
    - publishedAt: undated
    - retrievedAt: 2026-08-23

## Adjudication queue produced by this review

1. `work-29d4300ad9d3358fb67a`: set `firstPublishedYear` from blank to 2008;
   retain ISBN `9784063761597` and its 2011-10-21 volume release.
2. `work-3e725951eb9c49771087`: correct `firstPublishedYear` from 2013 to 2012;
   retain ISBN `9784592196334` and its 2013-06-20 volume release.
3. `work-40b8c35b1d8c9a90144c`: retain the original 集英社 ISBN
   `9784088468044` and one canonical Work; add an official original-to-双葉社
   edition bridge before final promotion instead of substituting a later ISBN.
4. `work-518d7ed42dd9253679c3`: adjudicate whether the flat creator contract must
   include officially credited 久保田千太郎; if yes, append the credit with role
   provenance. Retain the standard ISBN and do not merge the prose source.
5. `work-53e54c95f637b66c4fb2`: correct `firstPublishedYear` from 1977 to 1976;
   retain ISBN `9784091202116`.
6. `work-5915d6d7601377fcc75f`: correct `firstPublishedYear` from 2007 to 2006;
   retain ISBN `9784592183730` and its 2007-12-05 volume release.
7. `work-5b4dc4e6e966436b2990`: verify the original 白泉社 issue-level start;
   do not retain 1998 solely because it is volume 1's release year, and do not
   substitute an unofficial date.
8. `work-5b9a3ec60ac5fc90f444`: correct `firstPublishedYear` from 2014 to 2013;
   retain former-edition standard ISBN `9784800002846` and preserve the current
   publisher as an edition/serialization continuation rather than a new Work.

These are reproducible metadata corrections or narrow evidence gaps. None is a
safety or scope hard blocker, and this review does not authorize a source-catalog
mutation, recommendation promotion, or any Factor, Genre, Theme, or Art value.
