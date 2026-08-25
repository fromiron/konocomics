# Batch 005 position 39 Art route recovery — round 2

## 조사 경계

- 대상: frozen work-set position `39`, `work-aa6018249b7fe7e92d95`, `かよちゃんの荷物`
- canonical creator/publisher: `雁須磨子` / `竹書房`
- 조회일: `2026-08-25`
- `reviewedByHuman=false`
- frozen representative: standard original volume 1 ISBN `9784812465752`
- no Art values, source/generated/promotion changes, or commits were made

This recovery re-opened the exact BookLive lower product, reader, and content
manifest routes named by the final blocker adjudication. It also checked the
exact BOOK☆WALKER upper/lower product pages and their signed inline trial image
routes. Independent QA found that the directly retained BookLive page bytes are
tile-scrambled; no decoded BODY capture was preserved. Temporary page responses
and screenshots remain only under
`/tmp/konocomics-batch005-pos39-recovery-round2/`.

## Identity and edition

BookLive lower product HTML contains title `かよちゃんの荷物 新装版 下`,
creator `雁須磨子`, publisher `竹書房`, publication date `2017-04-27`, and
lower-edition ISBN `9784801959255`. The manifest returns title
`かよちゃんの荷物　新装版　下`, `author="雁須磨子"`, and
`publisher="竹書房"`. This is the same-work 2017 new-edition lower volume;
the frozen standard representative ISBN remains unchanged.

## Exact route results

| Route | Result | Evidence |
| --- | --- | --- |
| [BookLive lower product](https://booklive.jp/product/index/title_id/439092/vol_no/002) | HTTP 200 | product title/creator/publisher/edition metadata |
| [BookLive lower reader](https://booklive.jp/bviewer/s/?cid=439092_002&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F439092%2Fvol_no%2F002) | HTTP 200 | reader loaded the manifest and all twelve ordered page sources through the viewer |
| [BookLive lower manifest](https://d1cv2lzt22ijfr.cloudfront.net/439092/002/pub/binb/trial/content.js?dmytime=20170427150205) | HTTP 200 | `P0000`–`P0011`, paired `L0000`–`L0011`, exact title/author/publisher attributes |
| [BOOK☆WALKER upper](https://bookwalker.jp/de823a2c37-d79e-4358-82e2-c84b8acc9d33/) | HTTP 200 | 12 unique signed inline image paths: cover plus p001–p011 |
| [BOOK☆WALKER lower](https://bookwalker.jp/de90e7d72e-1f81-40ad-904b-9e0c6ed2de25/) | HTTP 200 | 12 unique signed inline image paths: cover plus p001–p011 |

The BOOK☆WALKER signed image host is `viewer-epubs-trial.bookwalker.jp`.
Signed query strings are ephemeral and are retained in the temporary URL
inventory rather than the canonical preflight CSV.

## Complete BookLive page classification

| Manifest page | Classification | Count |
| --- | --- | --- |
| `P0000` | cover | excluded |
| `P0001` | blank front matter | excluded |
| `P0002` | title/colour front matter | excluded |
| `P0003`–`P0005` | illustration gallery | excluded |
| `P0006`–`P0011` | manifest BODY candidates in `baggage22 かよちゃんと遊ぼう`; direct bytes tile-scrambled | not admitted |

The paired `L` IDs duplicate source URLs for alternate reading layout and are
not additional page samples. The six retrieved raw BODY candidates are:

| Ref | Pixel result | SHA-256 |
| --- | --- | --- |
| `P0006` | tile-scrambled; not readable | `c70c9518ef30e2efca298a6d19cb1825b852ea4078d3c88265e9b8d3943089b8` |
| `P0007` | tile-scrambled; not readable | `1d6eb3fd7d6302e78896b8f50b22ac70067c9b3019c65838b5aeab49765d5922` |
| `P0008` | tile-scrambled; not readable | `5bee41954f2b5c97ee81f5d2e26469ae094e8dacfce2d4331539ac04f0c11fac` |
| `P0009` | tile-scrambled; not readable | `1b1d87e53c218afe1a1ec1f41b72fd9740f7207be7e2a785f0c7fe7140c64325` |
| `P0010` | tile-scrambled; not readable | `faef78011c5020ee9389e37e3155143677b9bfc6bbe1ec9ad10b93076b98e35e` |
| `P0011` | tile-scrambled; not readable | `6b11807a7bb66f79f2bde88ab4dd380d244ef47c58fec6eabd66483f888027bf` |

This does not meet the static preflight minimum: zero decoded readable internal
pages and zero admissible complete scene contexts were retained. No exact
bounded start-development-impact-resolved motion sequence was retained, so
motion remains false/unknown.

## Conclusion

The exact route and edition bridge are verified, but the corrected lower route
closes `unknown-ready` at `0/0` because only tile-scrambled direct assets were
retained. A future recovery may reopen it only with six decoded browser-rendered
BODY pages and two contexts. This does not assign Art values or authorize
promotion. `reviewedByHuman=false` and `temporaryImagesCommitted=false` remain
explicit.

## Verification

```text
reviewedByHuman=false
retrievedAt=2026-08-25
temporaryImagesCommitted=false
canonicalTitleContainsDelimiter=false
git diff --check -- data/staging/catalog-expansion/batches/batch-005/reviews/art-preflight/chunk-04-pos39-recovery-round-2 data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-04/recovery-pos39-round-2-preflight.csv data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-04/recovery-pos39-round-2-ledger.md data/staging/catalog-expansion/batches/batch-005/research/art-route-recovery-pos39-round-2.md
```
