# Batch 002 chunk 02 identity adjudication

- adjudicationDate: 2026-08-23
- reviewedByHuman: false
- adjudicator: Local Codex
- inputReview: `../reviews/identity-safety-chunk-02.md`
- scope: first-publication metadata, creator credits, and representative-edition sufficiency
- hardBlockers: 0

## Decisions

| workId                      | decision                                                                                                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `work-29d4300ad9d3358fb67a` | Set `firstPublishedYear` to 2008 from the official collected-publication range.                                                                                        |
| `work-3e725951eb9c49771087` | Set `firstPublishedYear` to 2012 from the official serialization range.                                                                                                |
| `work-40b8c35b1d8c9a90144c` | Retain one Work and original standard-volume ISBN `9784088468044`; record the missing page-for-page bridge to the later 双葉社 edition as a limitation, not a blocker. |
| `work-518d7ed42dd9253679c3` | Append officially credited 久保田千太郎 to the flat creator list; retain the Work ID and standard-volume ISBN.                                                         |
| `work-53e54c95f637b66c4fb2` | Set `firstPublishedYear` to 1976 from the official 少年サンデー range.                                                                                                 |
| `work-5915d6d7601377fcc75f` | Set `firstPublishedYear` to 2006 from the official publisher history.                                                                                                  |
| `work-5b4dc4e6e966436b2990` | Clear `firstPublishedYear`; 1998 is verified only as volume 1's release year, not the original magazine start.                                                         |
| `work-5b9a3ec60ac5fc90f444` | Set `firstPublishedYear` to 2013 from the official serialization history.                                                                                              |

The representative-volume contract accepts an identified ordinary volume 1;
it does not require a current-edition page mapping when the representative
ISBN itself belongs to the original standard edition. The frozen orange ISBN
therefore remains verified. The later 双葉社 site supports Work continuity by
title and creator but is not treated as proof that its pagination equals the
original 集英社 edition.

The source schema stores a flat non-empty `creators` list and has no role field.
小学館 consistently credits 森秀樹, 酒見賢一, and 久保田千太郎 for 墨攻, so
the missing official credit is appended without changing the immutable Work ID.

For 人形芝居, an unknown Work start year is preferable to copying a known book
release into a serialization field. The verified 1998-10-19 date remains on the
representative volume row. Missing year metadata is not an identity, safety, or
promotion blocker.

## Evidence

- sourceName: 双葉社 orange official special site
  - sourceUrl: https://www.futabasha.co.jp/introduction/orange/pc/
  - publishedAt: 2014 copyright; page date otherwise undated
  - retrievedAt: 2026-08-23
- sourceName: Rakuten Books orange 1 original 集英社 product
  - sourceUrl: https://books.rakuten.co.jp/rb/11742628/
  - publishedAt: 2012-07
  - retrievedAt: 2026-08-23
- sourceName: 小学館 eコミックストア 墨攻 1
  - sourceUrl: https://e-comi.shogakukan.co.jp/books/091830410000d0000000
  - publishedAt: undated
  - retrievedAt: 2026-08-23
- sourceName: 白泉社 人形芝居 1 official product page
  - sourceUrl: https://www.hakusensha.co.jp/comicslist/41133/
  - publishedAt: 1998-10-19
  - retrievedAt: 2026-08-23
- sourceName: 白泉社 別冊花とゆめ 2018-05 issue announcement
  - sourceUrl: https://www.hakusensha.co.jp/news/51524/
  - publishedAt: 2018-03-26
  - retrievedAt: 2026-08-23

No canonical title, `『』` delimiter, Factor, Genre, Theme, Art value,
eligibility, recommendation math, validator rule, or Gold data is changed by
this adjudication.
