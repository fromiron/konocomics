# Batch 002 chunk 01 identity adjudication

- adjudicationDate: 2026-08-23
- reviewedByHuman: false
- adjudicator: Local Codex
- inputReview: `../reviews/identity-safety-chunk-01.md`
- scope: first publication year and representative-edition publisher semantics
- hardBlockers: 0

## Decisions

| workId                      | decision                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `work-02d5d329c9ef85e481cb` | Set `firstPublishedYear` to 1973; retain representative ISBN `9784091800718`.                                            |
| `work-1012948f5de799831da4` | Set `firstPublishedYear` to 1998; retain original standard-volume ISBN `9784063460124`.                                  |
| `work-19a26f01512166856a6a` | Set `firstPublishedYear` to 1977; retain ISBN `9784091880017` and `publisher=小学館` as representative-edition metadata. |

The first two corrections follow the official start evidence recorded in the
independent review. For 銀河鉄道999, the creator/rightsholder's official works
page identifies the first serialization as the combined 1977-01-24/31 issue of
少年キング. The later 1997 date belongs to the matched 小学館 representative
edition and is not a Work start year.

The current expansion pipeline deliberately writes `works.publisher` from the
matched representative item (`scripts/repair-representative-isbns.ts`). The
source contract does not define that field as the original serial publisher.
This adjudication therefore retains `小学館` without claiming it was the
original publisher; changing that field would silently introduce a new schema
meaning. The original magazine publisher, 少年画報社, remains explicit in the
review evidence. A future contract change may split Work-origin publisher from
representative-edition publisher, but this batch does not add that schema.

## Evidence

- sourceName: Toei Animation 暴れん坊力士!!松太郎 work information
  - sourceUrl: https://www.toei-anim.co.jp/tv/matsutaro/about/
  - publishedAt: 2014
  - retrievedAt: 2026-08-23
- sourceName: 講談社 RED 1 official product page
  - sourceUrl: https://www.kodansha.co.jp/comic/products/0000009137
  - publishedAt: 1999-03-06; first appearance begins in 1998
  - retrievedAt: 2026-08-23
- sourceName: 松本零士 零時社 official works page
  - sourceUrl: https://leijisha.jp/works/
  - publishedAt: undated
  - retrievedAt: 2026-08-23

No title delimiter, Factor, Genre, Theme, Art value, safety state, eligibility,
or Gold data is changed by this adjudication.
