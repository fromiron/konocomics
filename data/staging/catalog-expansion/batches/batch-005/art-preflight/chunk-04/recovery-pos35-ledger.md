# Batch 005 Art preflight recovery — position 35

- scope: frozen Batch 005 position 35 only
- workId: `work-8a7846af8ead1797e6a2`
- canonical title: `ハイスコアガール`
- creator: `押切蓮介`
- frozen representative ISBN: `9784757535121` (standard volume 1)
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- browser: headed Playwright Chromium; ordinary Square Enix page and Fotorama reader routes
- archive format: uncompressed
- recovery image packet: `data/staging/catalog-expansion/batches/batch-005/reviews/art-preflight/chunk-04-pos35-recovery/images/`
- acquisition root: `/tmp/konocomics-batch005-pos35-recovery`
- source/generated/promotion mutation: none
- existing terminal/final-Art files: unchanged
- Art values assigned: `false`
- promotion performed: `false`

## Frozen identity and official route bridge

The official Big Gangan series page renders the title `ハイスコアガール`, creator
`押切蓮介`, and first-party links for `第1話 試し読み`, `第2話 試し読み`, and
`第3話 試し読み`. Its comic list renders the exact historical standard volume
entries and cover ISBNs:

| entry | standard ISBN | official series-page cover path | bridge result |
| ---: | --- | --- | --- |
| 1 | `9784757535121` | `/top/shoei/9784757535121.jpg` | exact frozen representative |
| 2 | `9784757536425` | `/top/shoei/9784757536425.jpg` | exact standard volume entry |
| 3 | `9784757538412` | `/top/shoei/9784757538412.jpg` | exact standard volume entry |

The historical Square Enix detail paths linked in the old series markup were
also checked. The slash form
`https://magazine.jp.square-enix.com/top/comics/detail/{isbn}/` returned the
same `404 Not Found` body for all three ISBNs (response SHA-256
`44e79f2b4b84f6322582feacc7daece661a91f3c3f1fe39ce05d83bb4da2e1ee`); the
no-slash form returned a generic `新刊情報` page with no work identity. No
`ハイスコアガール CONTINUE` reissue was substituted for the historical
standard editions. The edition bridge therefore remains the explicit official
series-page title/creator/volume/ISBN mapping plus its first-party preview links.

## Official HTTP/browser inputs

| route | HTTP | temporary response SHA-256 | note |
| --- | ---: | --- | --- |
| [official series](https://magazine.jp.square-enix.com/biggangan/introduction/highscoregirl/) | 200 | `7c43d81e47e206c40c92c9cca2e3aaa612d6a14a9cfd25f559425d4f7567b9c6` | identity, standard vols. 1–3, preview links |
| [第1話 trial](https://magazine.jp.square-enix.com/biggangan/tachiyomi/his01/) | 200 | `3743135c42bccb6d69a1e3a3ab18322398fcf668b266011c0bae4dd7c5730aff` | prior motion-only route |
| [第2話 trial](https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/) | 200 | `9d96b2366381370988e53cfded2fe8231ec5e2c23886e97e45a50eac5dbdae05` | selected static route |
| [第3話 trial](https://magazine.jp.square-enix.com/biggangan/tachiyomi/his03/) | 200 | `2a51ee08e66486af1311b6dd05364fdcfca7a02ec87bde9773a78ab1bd42c490` | route corroboration; not merged into selected six |

The Fotorama scripts on the ordinary browser route expose eight images for
both 第2話 and 第3話. No raw tile decoding, protection bypass, cover/frontmatter
sampling, anime material, or user Art review was used.

## Selected browser-rendered static sample

第2話 image resources are the normal first-party JPEGs below. Every selected
original is `870x1236` pixels (JPEG, RGB) and is preserved only in the review
packet image directory named above. The same bytes were obtained as resources
loaded by the normal browser-rendered reader; no reconstruction was performed.

| ref | exact official image URL | class/context | dimensions | SHA-256 |
| --- | --- | --- | --- | --- |
| `reader-his02-p002` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/002.jpg` | BODY; street/social setup | `870x1236` | `0161e58893499257746ad7bd1cba7e6e07d7591711e3edd406044e176c3c4966` |
| `reader-his02-p003` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/003.jpg` | BODY; street/social setup | `870x1236` | `a5c3d1c83994934c193101fd0d10d676a462a48d28bda4421b65069349da803f` |
| `reader-his02-p004` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/004.jpg` | BODY; street/social interaction | `870x1236` | `6ec72f8e4fcb9c0ab0ffec6b2f0b13176210e71b3b355486e01a61c95155d487` |
| `reader-his02-p005` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/005.jpg` | BODY; arcade/gameplay | `870x1236` | `112acb66d9bf6b5f8f9842982ced40fc5f90836127522d98312e8716927f61b5` |
| `reader-his02-p006` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/006.jpg` | BODY; arcade/gameplay | `870x1236` | `44de76624bfaf4c4421794c8d670693d2ec5f8c1a2d4fe21c8861a09d26fbb9f` |
| `reader-his02-p007` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/007.jpg` | BODY; arcade/gameplay | `870x1236` | `aee2737299e01a69175e69d013b95f82589aac058cd67f8ace6cca05dbd72de2` |

Page `001.jpg` is the `2-CREDIT` chapter opener and is excluded. Page
`008.jpg` is a further readable page but is not needed once six BODY pages are
retained. The selected six pages therefore span two distinct contexts:
arcade/gameplay (`p005`, `p006`, `p007`) and street/social interaction (`p002`,
`p003`, `p004`). This is a static gate result only; it does not assign an Art
value.

第3話 was independently opened and its eight official image requests returned
the same `870x1236` browser-rendered image dimensions. It is retained as route
corroboration only, not mixed into the six-page selected set.

## Gate and handoff

| gate | result |
| --- | --- |
| readable BODY pages | `6` |
| distinct contexts | `2` |
| `staticGateAttemptable` | `true` |
| `motionGateAttemptable` in this recovery | `false` |
| Art values | not assigned |
| promotion | not performed |

This recovery reopens the static Art review input from the prior `6/1`
position-35 result. The existing official 第1話 motion-only evidence and final
`motionImpact=4` row were not edited, replaced, or reinterpreted. Independent
Local + Gemini pixel review is required before any static Art value changes.

## Verification

```text
reviewedByHuman=false
temporaryImagesCommitted=false
repositoryImageMutation=review-packet-only
sourceGeneratedPromotionMutation=false
staticGate=6-readable-BODY/2-contexts PASS
motionGate=this-recovery-not-claimed
```
