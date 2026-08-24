# Batch 002 chunk 04 identity, safety, and edition review

- reviewDate: 2026-08-23
- retrievedAt: 2026-08-23
- reviewedByHuman: false
- reviewer: Local Codex independent review
- reviewedRange: batch-002 frozen work set positions 31–40
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
on Japanese publisher or magazine records that identify the manga Work,
creator roles, serial venue or comics imprint, and a numbered bound edition.

Smoking, war, death, violence, sexual humor, same-sex relationships, or other
sensitive story content is not treated as an adult-only sales classification.
A safety PASS means the reviewed official publisher and retailer product is an
ordinary manga edition with no R18, 成人向け, 成年コミック, or equivalent
adult-only marker. It is not a reader-age or content-suitability rating.

## Summary

| workId                      | canonicalTitle               | verdict            | representative ISBN | edition conclusion                                   | safety and scope |
| --------------------------- | ---------------------------- | ------------------ | ------------------- | ---------------------------------------------------- | ---------------- |
| `work-84b7c7d7720447075c25` | 軍靴のバルツァー             | PASS               | `9784107716262`     | standard BUNCH COMICS volume 1                       | PASS             |
| `work-9072892a767332254f00` | flat                         | needs-adjudication | `9784861275333`     | standard BLADE COMICS AVARUS volume 1                | PASS             |
| `work-98b7d2ef065bde405972` | スーパーの裏でヤニ吸うふたり | PASS               | `9784757580947`     | standard ビッグガンガンコミックス volume 1           | PASS             |
| `work-a59481c00155de21d75f` | ケロロ軍曹                   | PASS               | `9784047133075`     | standard 角川コミックス・エース volume 1             | PASS             |
| `work-a8349445836546a82934` | 百姓貴族                     | needs-adjudication | `9784403670855`     | standard ウィングス・コミックス・デラックス volume 1 | PASS             |
| `work-ab95f4d4997113e0687a` | 月刊少女野崎くん             | needs-adjudication | `9784757535664`     | standard ガンガンコミックスONLINE volume 1           | PASS             |
| `work-ad32c71b07fd13c65a79` | 私の推しは悪役令嬢。         | PASS               | `9784758021937`     | standard 百合姫コミックス manga volume 1             | PASS             |
| `work-bbeeaad9e37ab267dc29` | 僕とロボコ                   | PASS               | `9784088825090`     | standard ジャンプコミックス volume 1                 | PASS             |
| `work-c221a17d6b962b17c9f4` | 屍鬼                         | needs-adjudication | `9784088745497`     | original ジャンプコミックス SQ volume 1              | PASS             |
| `work-c55467873ec70e670484` | 大ダーク                     | PASS               | `9784091294869`     | standard ゲッサン少年サンデーコミックス volume 1     | PASS             |

Result: 6 PASS and 4 needs-adjudication. Four Works require narrow
`firstPublishedYear` corrections because the current value is the standard
volume-1 year rather than the first formal publication year. Those same four
representative volume rows have blank `releaseDate` cells despite exact
publisher dates being available. No approximate retailer date needs to be
coerced into an exact source value in this chunk.

None is a safety or scope hard blocker. No duplicate ISBN, adult-only item,
webtoon or vertical-scroll original, non-manga product, duplicate Work, or
identity hard blocker was found. Later special, vertical, digital, bunko,
prose-original, and spin-off products are kept outside the representative
edition identity where applicable.

## 31. work-84b7c7d7720447075c25 — 軍靴のバルツァー

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. 新潮社 binds 軍靴のバルツァー, creator
  中島三千恒, the 月刊コミックバンチ serial, and the numbered BUNCH
  COMICS series. Five selection memberships are duplicate provenance for this
  one Work. 軍靴のバルツァー外伝 銀灰のユーリ has a different full title,
  manga creator, publication route, and ISBN and remains a separate spin-off.
- current source and staging: canonical title, creator, original publisher,
  `firstPublishedYear=2011`, representative ISBN, release date, and mappings
  agree with the reviewed evidence. The title contains no decorative title
  delimiters.
- first-publication audit: PASS. The serial began in the 2011 launch year of
  月刊コミックバンチ; the 2011-07-08 date is specifically the collected
  volume-1 date. Both belong to 2011, so the Work year is not contaminated by a
  later edition or reprint year.
- representative edition: PASS — ISBN `9784107716262`, ordinary BUNCH COMICS
  volume 1, released 2011-07-08, 194 pages. Its checksum is valid and it occurs
  once in the source catalog. It is not volume 4 or 11's limited edition and is
  not a set product.
- safety and scope: PASS. 新潮社 identifies a Japanese magazine-born manga and
  a B6 numbered comic volume. War, weapons, political conflict, and violence in
  its premise do not constitute an adult-only sales marker, and none appears
  on the reviewed publisher or retailer product.
- research metadata: PASS. The packet's official volume 1–3 pages use the same
  BUNCH COMICS numbering as the frozen representative edition and correctly
  separates award membership from content evidence.
- limitations: The current 新潮社 volume page does not give the exact first
  magazine-issue day. That precision is unnecessary for the year-level source
  field. The later publisher transfer and spin-off do not change the frozen
  volume-1 identity.
- evidence:
  - sourceName: 新潮社 軍靴のバルツァー volume 1
    - sourceUrl: https://www.shinchosha.co.jp/book/771626/
    - publishedAt: 2011-07-08
    - retrievedAt: 2026-08-23
  - sourceName: このマンガがすごい！WEB 軍靴のバルツァー work feature
    - sourceUrl: https://konomanga.jp/manga/bartzar
    - publishedAt: 2014
    - retrievedAt: 2026-08-23
  - sourceName: 新潮社 軍靴のバルツァー外伝 銀灰のユーリ volume 1
    - sourceUrl: https://www.shinchosha.co.jp/book/772500/
    - publishedAt: 2022-06-09
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 軍靴のバルツァー volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/11229476/
    - publishedAt: 2011-07-08
    - retrievedAt: 2026-08-23

## 32. work-9072892a767332254f00 — flat

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. マッグガーデン binds the exact title flat,
  creator 青桐ナツ, numbered volumes 1–8, and the BLADE COMICS AVARUS
  product line. The generic title is disambiguated by creator, imprint, ISBN,
  and series membership. Nine selection memberships collapse to this one Work.
- current source and staging: canonical title, creator, publisher,
  representative ISBN, and mappings are sound. `works.firstPublishedYear=2008`
  and the blank representative `releaseDate` need narrow repair.
- first-publication audit: needs correction from 2008 to 2007. The first flat
  story appeared in the 2007-12 issue of コミックブレイド アヴァルス;
  later serialization and the 2008 collected volume do not move the Work's
  first formal publication into 2008.
- representative edition: PASS — ISBN `9784861275333`, ordinary BLADE COMICS
  AVARUS volume 1, released 2008-09-10. Its checksum is valid and it occurs
  once in the source catalog. Set `volumes.releaseDate` to that exact publisher
  date; retain the standard edition and do not treat the later volumes as
  separate Works.
- safety and scope: PASS. The official publisher identifies an eight-volume
  Japanese magazine manga and an ordinary B6 comic. No adult-only marker is
  present on the reviewed publisher or retailer pages.
- research metadata: needs-adjudication only for the Work year and blank
  release date. The official packet's volume 1–3 pages use the same standard
  numbering and creator as the frozen representative edition.
- limitations: マッグガーデン's current product page preserves the volume
  date but not an archived first-issue date. The 2007 year is independently
  recorded by 小学館's digital reference entry; do not invent an exact day in
  the current year-only Work field.
- evidence:
  - sourceName: マッグガーデン flat volume 1
    - sourceUrl: https://www.mag-garden.co.jp/comics/6038/
    - publishedAt: 2008-09-10
    - retrievedAt: 2026-08-23
  - sourceName: 小学館デジタル大辞泉プラス flat publication record
    - sourceUrl: https://kotobank.jp/word/flat-735157
    - publishedAt: undated; records publication from the 2007-12 issue
    - retrievedAt: 2026-08-23
  - sourceName: マッグガーデン flat volume 8
    - sourceUrl: https://www.mag-garden.co.jp/comics/6045/
    - publishedAt: 2014-02-15
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books flat volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/5837393/
    - publishedAt: 2008-09-10
    - retrievedAt: 2026-08-23

## 33. work-98b7d2ef065bde405972 — スーパーの裏でヤニ吸うふたり

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. SQUARE ENIX binds the exact canonical title,
  creator 地主, the ビッグガンガン publication route, and the numbered
  ビッグガンガンコミックス series. Two selection rows are provenance for
  the same Work, not duplicate Works.
- current source and staging: canonical title, creator, publisher,
  `firstPublishedYear=2022`, representative ISBN, exact release date, and
  mappings agree with the official product. The canonical title has no
  decorative title delimiters.
- first-publication audit: PASS. The Work and its standard volume 1 both first
  appeared in 2022. The exact 2022-08-25 value belongs to the collected volume;
  the source Work field correctly stores only 2022.
- representative edition: PASS — ISBN `9784757580947`, ordinary
  ビッグガンガンコミックス volume 1, released 2022-08-25. Its checksum is
  valid and it occurs once in the source catalog. Later volumes have separate
  special editions, but the frozen volume 1 is an ordinary edition and is not
  replaced by those products.
- safety and scope: PASS. The official work page and B6 volume identify a
  Japanese page-manga publication. Adult characters smoking repeatedly is
  sensitive content, not an adult-only sales classification. No R18 or
  equivalent marker appears on the reviewed official product.
- research metadata: PASS. Official volume 1–3 pages match the same standard
  edition numbering. The packet correctly excludes volume 3's special-edition
  booklet and treats the award row only as selection provenance.
- limitations: This verdict does not endorse smoking or convert it into a user
  recommendation statement. It also does not decide any text or visual Factor.
- evidence:
  - sourceName: SQUARE ENIX スーパーの裏でヤニ吸うふたり volume 1
    - sourceUrl: https://magazine.jp.square-enix.com/top/comics/detail/9784757580947/
    - publishedAt: 2022-08-25
    - retrievedAt: 2026-08-23
  - sourceName: SQUARE ENIX ビッグガンガン work page
    - sourceUrl: https://magazine.jp.square-enix.com/biggangan/introduction/yanisuu/
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: マンガ大賞 2023 official archive
    - sourceUrl: https://www.mangataisho.com/archives/2023.html
    - publishedAt: 2023
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books スーパーの裏でヤニ吸うふたり volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/17198290/
    - publishedAt: 2022-08-25
    - retrievedAt: 2026-08-23

## 34. work-a59481c00155de21d75f — ケロロ軍曹

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. KADOKAWA identifies ケロロ軍曹 by 吉崎観音
  as the manga serialized from the 1999 月刊少年エース 4月号. The 1998
  prototype reading `ケロロぐんそー` is explicitly distinguished by title
  and publication context and is not silently merged as the serial's first
  year. Later electronic and タテスク products do not replace the original
  page-manga Work or its representative paper edition.
- current source and staging: canonical title, creator, publisher,
  `firstPublishedYear=1999`, representative ISBN, release date, and mapping are
  consistent. The title uses no decorative title delimiters.
- first-publication audit: PASS. The official KADOKAWA history places the
  ケロロ軍曹 serial in 1999, while the paper volume 1 was released
  1999-11-29. The earlier differently titled prototype does not require a 1998
  change to this canonical serial Work.
- representative edition: PASS — ISBN `9784047133075`, ordinary
  角川コミックス・エース paper volume 1, released 1999-11-29, 168 pages.
  Its checksum is valid and it occurs once in the source catalog. The electronic
  product's 2010-12-01 date is not substituted for the paper release date.
- safety and scope: PASS. KADOKAWA identifies an ordinary 月刊少年エース
  manga and numbered comic. Volume 3's official description flags an increase
  in sexual humor or fanservice, but the reviewed products carry no adult-only
  sales marker. That content note does not become an adult classification.
- research metadata: PASS. The official volume 1–3 pages correspond to the
  standard paper numbering. The packet properly records the dual paper and
  electronic dates and does not use the award entry as content evidence.
- limitations: Safety PASS does not rate individual scenes for children. Any
  later visual safety review must use the actual page sample and edition, not
  the anime, the vertical-format derivative, or a cover.
- evidence:
  - sourceName: KADOKAWA ケロロ軍曹 volume 1 paper product
    - sourceUrl: https://www.kadokawa.co.jp/product/199999713307/
    - publishedAt: 1999-11-29
    - retrievedAt: 2026-08-23
  - sourceName: KADOKAWA ケロロ軍曹 25th-anniversary identity history
    - sourceUrl: https://group.kadokawa.co.jp/information/promotional_topics/article-7311.html
    - publishedAt: 2023
    - retrievedAt: 2026-08-23
  - sourceName: KADOKAWA ケロロ軍曹 volume 3
    - sourceUrl: https://www.kadokawa.co.jp/product/200000000671/
    - publishedAt: 2001-02-26
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books ケロロ軍曹 volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/1112815/
    - publishedAt: 1999-11-29
    - retrievedAt: 2026-08-23

## 35. work-a8349445836546a82934 — 百姓貴族

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 新書館 binds 百姓貴族, creator 荒川弘, the
  ウィングス serial, and the numbered ウィングス・コミックス・デラックス
  series. Two selection memberships map to one Work. Later DVD-attached and
  8.1 booklet products are derivative edition products, not replacements for
  the representative volume 1.
- current source and staging: canonical title, creator, publisher,
  representative ISBN, and mappings are sound. `works.firstPublishedYear=2009`
  is the collected volume year, and the representative release date is blank.
- first-publication audit: needs correction from 2009 to 2006. 新書館's 2021
  magazine and volume records explicitly call the Work a 15th-anniversary
  serial, and its later archive identifies material drawn from 2006 onward.
  The 2009-12-08 date belongs to volume 1, not the Work's first publication.
- representative edition: PASS — ISBN `9784403670855`, ordinary
  ウィングス・コミックス・デラックス volume 1, released 2009-12-08. Its
  checksum is valid and it occurs once in the source catalog. Fill the exact
  publisher date in `volumes.releaseDate`; retain the standard volume.
- safety and scope: PASS. 新書館 presents an ordinary Japanese magazine manga
  and A5 comic edition. Descriptions of agricultural labor, animals, injury, or
  bodily realities are not adult-only sales markers, and none appears on the
  reviewed products.
- research metadata: needs-adjudication only for the Work year and blank
  release date. Official volume 1–3 pages use the same standard numbering and
  author as the frozen representative edition.
- limitations: The anniversary evidence establishes 2006 at year precision but
  does not expose the exact first issue day. Do not manufacture a day-level
  value. The later 8.1 booklet must not be used as the representative volume.
- evidence:
  - sourceName: 新書館 百姓貴族 volume 1
    - sourceUrl: https://www.shinshokan.co.jp/book/b565859.html
    - publishedAt: 2009-12-08
    - retrievedAt: 2026-08-23
  - sourceName: 新書館 ウィングス 2021年4月号
    - sourceUrl: https://www.shinshokan.co.jp/book/b575082.html
    - publishedAt: 2021-02-27; identifies the serial's 15th anniversary
    - retrievedAt: 2026-08-23
  - sourceName: 新書館 百姓貴族 volume 7
    - sourceUrl: https://www.shinshokan.co.jp/book/b575057.html
    - publishedAt: 2021-10-22; identifies the serial's 15th anniversary
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 百姓貴族 volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/6243116/
    - publishedAt: 2009-12-08
    - retrievedAt: 2026-08-23

## 36. work-ab95f4d4997113e0687a — 月刊少女野崎くん

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. SQUARE ENIX binds 月刊少女野崎くん,
  creator 椿いづみ, ガンガンONLINE, and the numbered
  ガンガンコミックスONLINE series. Four memberships are duplicate
  provenance for this one Work. Later fanbooks, anthologies, and special-edition
  booklets are separate products and do not alter the canonical identity.
- current source and staging: canonical title, creator, publisher,
  representative ISBN, and mappings are consistent. `firstPublishedYear=2012`
  and the blank volume release date require narrow correction.
- first-publication audit: needs correction from 2012 to 2011. SQUARE ENIX's
  2021 official records describe the browser ガンガンONLINE serial's tenth
  anniversary. The 2012-04-20 value is the standard volume-1 release date, not
  the first serial year.
- representative edition: PASS — ISBN `9784757535664`, ordinary
  ガンガンコミックスONLINE volume 1, released 2012-04-20. Its checksum is
  valid and it occurs once in the source catalog. Fill that exact date and keep
  the standard ISBN.
- safety and scope: PASS. The publisher identifies a Japanese online
  page-manga serial with an ordinary B6 numbered comic. School relationships
  and romantic misunderstanding in the official description do not create an
  adult-only classification, and no such marker appears.
- research metadata: needs-adjudication only for the Work year and blank
  release date. The official first-three-volume pages align directly with the
  frozen standard edition.
- limitations: The anniversary record establishes the first year but this
  review does not assert an exact initial update day. The series title's word
  月刊 is part of the canonical title and is not a publication-frequency claim
  about the Work row.
- evidence:
  - sourceName: SQUARE ENIX 月刊少女野崎くん volume 1
    - sourceUrl: https://magazine.jp.square-enix.com/top/comics/detail/9784757535664/
    - publishedAt: 2012-04-20
    - retrievedAt: 2026-08-23
  - sourceName: SQUARE ENIX 月刊少女野崎くん volume 13 special edition
    - sourceUrl: https://magazine.jp.square-enix.com/top/comics/detail/9784757573963/
    - publishedAt: 2021-08-11; identifies the serial's tenth anniversary
    - retrievedAt: 2026-08-23
  - sourceName: SQUARE ENIX 2021 ガンガンONLINE anniversary notice archive
    - sourceUrl: https://magazine.jp.square-enix.com/top/news/?p=35
    - publishedAt: 2021-08-05
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 月刊少女野崎くん volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/11604240/
    - publishedAt: 2012-04-20
    - retrievedAt: 2026-08-23

## 37. work-ad32c71b07fd13c65a79 — 私の推しは悪役令嬢。

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. 一迅社 identifies 青乃下 as manga creator,
  いのり。 as original author, and 花ヶ田 as character-design originator for
  the コミック百合姫 manga. The punctuation-final full stop is part of the
  official canonical title; it is not a decorative delimiter. The prose series
  私の推しは悪役令嬢。-Revolution- and other spin-off products remain
  separate from this manga Work.
- current source and staging: title, creator credits, publisher,
  `firstPublishedYear=2020`, representative ISBN, release date, and mappings
  agree with official records. Whitespace in the normalized creator display
  does not create a second identity.
- first-publication audit: PASS. The official コミック百合姫 2020年8月号,
  released 2020-06-18, announces the start of the manga adaptation. Volume 1
  followed on 2020-12-18, so the current Work year is not a volume-year error.
- representative edition: PASS — ISBN `9784758021937`, ordinary
  百合姫コミックス manga volume 1, released 2020-12-18. Its checksum is
  valid and it occurs once in the source catalog. The short prose item included
  in the volume does not convert the bound manga edition into a prose Work.
- safety and scope: PASS. 一迅社 identifies a Japanese magazine manga and
  numbered B6 comic. A same-sex central relationship is not an adult-only
  marker, and the official product carries no R18 or equivalent classification.
- research metadata: PASS. The packet correctly binds volumes 1–3 to the manga
  edition and separates the manga, source novel, and character-design roles.
  The award result remains selection provenance only.
- limitations: This identity review does not merge the prose original's
  publication year, content, or edition into the manga. It also makes no
  relationship or other annotation conclusion.
- evidence:
  - sourceName: 一迅社 コミック百合姫 2020年8月号 back number
    - sourceUrl: https://www.ichijinsha.co.jp/yurihime/backnumber/yuri20-08/
    - publishedAt: 2020-06-18
    - retrievedAt: 2026-08-23
  - sourceName: 一迅社 私の推しは悪役令嬢。 volume 1
    - sourceUrl: https://data.ichijinsha.co.jp/detail/75802193
    - publishedAt: 2020-12-18
    - retrievedAt: 2026-08-23
  - sourceName: 一迅社 コミック百合姫 work page
    - sourceUrl: https://www.ichijinsha.co.jp/yurihime/title/%E6%BC%AB%E7%94%BB%EF%BC%9A%E9%9D%92%E4%B9%83%E4%B8%8B%E3%80%80%E5%8E%9F%E4%BD%9C%EF%BC%9A%E3%81%84%E3%81%AE%E3%82%8A%E3%80%82%E3%80%80%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E3%83%87/%E7%A7%81%E3%81%AE%E6%8E%A8%E3%81%97%E3%81%AF%E6%82%AA%E5%BD%B9%E4%BB%A4%E5%AC%A2%E3%80%82/
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 私の推しは悪役令嬢。 volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/16495318/
    - publishedAt: 2020-12-18
    - retrievedAt: 2026-08-23

## 38. work-bbeeaad9e37ab267dc29 — 僕とロボコ

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. 集英社's 週刊少年ジャンプ page binds
  僕とロボコ, creator 宮崎周平, the 2020 issue-31 serial start, and the
  numbered ジャンプコミックス series. Two memberships are selection
  provenance for the same Work.
- current source and staging: canonical title, creator, publisher,
  `firstPublishedYear=2020`, representative ISBN, release date, and mappings
  are consistent. No decorative title delimiter is stored.
- first-publication audit: PASS. The official serial page gives 2020 issue 31
  as the start, while the standard collected volume 1 was released 2020-11-04.
  Both confirm the current year without conflating issue and volume dates.
- representative edition: PASS — ISBN `9784088825090`, ordinary
  ジャンプコミックス volume 1, released 2020-11-04. Its checksum is valid
  and it occurs once in the source catalog. It is not a set, fanbook, novel, or
  special edition.
- safety and scope: PASS. The official 週刊少年ジャンプ serial page and
  standard comic identify a Japanese page manga. Robot action, parody, or body
  jokes are content, not adult-only product markers, and none appears on the
  reviewed publisher or retailer page.
- research metadata: PASS. The packet's official volume 1–3 pages align with
  the same standard numbering. Brief single-episode descriptions in volumes 2
  and 3 are correctly retained as evidence limitations rather than identity
  conflicts.
- limitations: This review does not generalize from those episode summaries to
  any annotation. The current official serial page is live and may change its
  surrounding promotional content, but the creator and start issue are clear.
- evidence:
  - sourceName: 集英社 週刊少年ジャンプ 僕とロボコ work page
    - sourceUrl: https://sp.shonenjump.com/j/rensai/roboko/
    - publishedAt: undated; records serial start in 2020 issue 31
    - retrievedAt: 2026-08-23
  - sourceName: 集英社 僕とロボコ volume 1
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882509-0
    - publishedAt: 2020-11-04
    - retrievedAt: 2026-08-23
  - sourceName: 次にくるマンガ大賞 2021 comics results
    - sourceUrl: https://tsugimanga.jp/winner/2021/comics
    - publishedAt: 2021-08-24
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 僕とロボコ volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/16463144/
    - publishedAt: 2020-11-04
    - retrievedAt: 2026-08-23

## 39. work-c221a17d6b962b17c9f4 — 屍鬼

- verdict: needs-adjudication
- reviewedByHuman: false
- canonical identity: PASS. 集英社 identifies 屍鬼 as the manga with
  小野不由美 credited for the original and 藤崎竜 for manga, and the official
  ジャンプSQ archive lists it among ended serials. This is the manga
  adaptation, not the prose original or the animation. One selection membership
  maps to the Work.
- current source and staging: canonical title, creator pair, publisher,
  representative ISBN, and mapping are sound. `firstPublishedYear=2008` is the
  collected-volume year, and the representative release date is blank.
- first-publication audit: needs correction from 2008 to 2007. The first chapter
  appeared in ジャンプSQ 2008年1月号, distributed in December 2007. The
  source contract follows actual formal publication time rather than the cover
  year, so 2008-07-04 remains only the collected volume-1 date.
- representative edition: conditionally PASS — ISBN `9784088745497`, original
  ジャンプコミックス SQ paper volume 1, released 2008-07-04. Its checksum
  is valid and it occurs once in the source catalog. 集英社's current digital
  page preserves the same title, creator roles, contents, and exact paper date
  but no longer displays the old paper ISBN; the Rakuten product supplies the
  exact ISBN and original imprint. Preserve both parts of that bridge.
- edition bridge: PASS with a documented limitation. The official digital page
  explicitly labels its paper counterpart and gives the same volume-1 contents
  and paper date. A later 2016 集英社文庫 comic edition has a different ISBN
  and pagination and must not replace or merge with the frozen representative
  volume row.
- safety and scope: PASS. 集英社 identifies a Japanese ジャンプSQ manga and
  ordinary paper/digital comic editions. Death, corpses, disease, supernatural
  violence, and horror imagery are sensitive content but are not adult-only
  sales markers. No R18 or equivalent marker appears on the reviewed products.
- research metadata: needs-adjudication only for the Work year and blank
  release date. The packet correctly notes that the live official pages cover
  the same numbered edition through digital records while the frozen ISBN is
  the original paper product.
- limitations: The current 集英社 archive does not expose an old issue page
  directly joining 屍鬼 to a dated December 2007 URL. The year correction uses
  the official ended-work identity, the National Diet Library's magazine
  chronology, and the documented 2008年1月号 start. Retain this composite
  provenance instead of inventing an issue-day field or treating 2008 as the
  first year.
- evidence:
  - sourceName: 集英社 屍鬼 volume 1 official digital and paper bridge
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08874549874549315501
    - publishedAt: 2008-07-04 paper; 2012-07-06 digital
    - retrievedAt: 2026-08-23
  - sourceName: 集英社 ジャンプSQ ended-work archive
    - sourceUrl: https://jumpsq.shueisha.co.jp/rensai/end.html
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: National Diet Library ジャンプSQ bibliographic chronology
    - sourceUrl: https://ndlsearch.ndl.go.jp/books/R100000002-I000009146006
    - publishedAt: 2007; records the magazine from volume 1 issue 1 in 2007-12
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 屍鬼 original volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/5750110/
    - publishedAt: 2008-07-04
    - retrievedAt: 2026-08-23
  - sourceName: 集英社 屍鬼 bunko volume 1
    - sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-619637-6
    - publishedAt: 2016-07-15
    - retrievedAt: 2026-08-23

## 40. work-c55467873ec70e670484 — 大ダーク

- verdict: PASS
- reviewedByHuman: false
- canonical identity: PASS. 小学館 binds 大ダーク, creator 林田球,
  ゲッサン publication, and the numbered ゲッサン少年サンデーコミックス
  series. Two selection memberships are provenance for one Work. ドロヘドロ
  and its art or reference books are separately titled products and do not
  conflict with this identity.
- current source and staging: canonical title, creator, publisher,
  `firstPublishedYear=2019`, representative ISBN, release date, and mappings
  match official evidence. The title contains no decorative title delimiters.
- first-publication audit: PASS. 小学館's volume-launch article states that the
  serial began in ゲッサン before volume 1's 2019-11-12 release. Both events
  are in 2019, so the Work year is not contaminated by the collected date.
- representative edition: PASS — ISBN `9784091294869`, ordinary
  ゲッサン少年サンデーコミックス volume 1, released 2019-11-12, 208
  pages. Its checksum is valid and it occurs once in the source catalog. It is
  not a set, limited edition, artbook, or later reprint.
- safety and scope: PASS. The official publisher identifies a Japanese magazine
  manga and standard B6 comic. Killing, blood, injury, and body-related violence
  in the publisher description do not by themselves establish an adult-only
  sales class, and no such marker appears on the reviewed product.
- research metadata: PASS. Official volume 1–3 pages match the same standard
  edition numbering and creator. The research packet correctly separates the
  violent premise from product safety and keeps award ranking as selection
  provenance only.
- limitations: Safety PASS is not a visual-intensity rating. Any later page
  analysis must use the official internal preview and must not infer a visual
  value from the product description or cover.
- evidence:
  - sourceName: 小学館 大ダーク volume 1
    - sourceUrl: https://shogakukan-comic.jp/book?isbn=9784091294869
    - publishedAt: 2019-11-12
    - retrievedAt: 2026-08-23
  - sourceName: 小学館 大ダーク volume 1 launch article
    - sourceUrl: https://shogakukan-comic.jp/news/21531
    - publishedAt: 2019-11-12
    - retrievedAt: 2026-08-23
  - sourceName: 小学館 ゲッサン comics list
    - sourceUrl: https://shogakukan-comic.jp/booklist?mag_daihyo_cd=24709&order=desc&pageno=1&sort=title
    - publishedAt: undated
    - retrievedAt: 2026-08-23
  - sourceName: Rakuten Books 大ダーク volume 1 product
    - sourceUrl: https://books.rakuten.co.jp/rb/16075898/
    - publishedAt: 2019-11-12
    - retrievedAt: 2026-08-23

## Adjudication queue produced by this review

1. `work-9072892a767332254f00`: correct `firstPublishedYear` from 2008 to
   2007 and set `volumes.releaseDate` to 2008-09-10; retain ISBN
   `9784861275333` and the standard BLADE COMICS AVARUS edition.
2. `work-a8349445836546a82934`: correct `firstPublishedYear` from 2009 to
   2006 and set `volumes.releaseDate` to 2009-12-08; retain ISBN
   `9784403670855` and do not substitute a later special or 8.1 product.
3. `work-ab95f4d4997113e0687a`: correct `firstPublishedYear` from 2012 to
   2011 and set `volumes.releaseDate` to 2012-04-20; retain ISBN
   `9784757535664` and the ordinary volume-1 edition.
4. `work-c221a17d6b962b17c9f4`: correct `firstPublishedYear` from 2008 to
   2007 and set `volumes.releaseDate` to 2008-07-04; retain original ISBN
   `9784088745497`, preserve the official digital-to-paper plus Rakuten ISBN
   bridge, and do not substitute the later bunko edition.

These are reproducible metadata corrections, not promotion blockers. Exact
first-issue days remain unstored where the source schema only requires a year.
No work enters a hard-blocker queue, and this review does not authorize a
source-catalog mutation, recommendation promotion, or any Factor, Genre,
Theme, centrality, or Art value.
