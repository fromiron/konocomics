# Batch 004 Art preflight recovery — position 3

- scope: frozen Batch 004 position 3 only
- workId: `work-0f3a44f5dcab9623d1be`
- canonicalTitle: `応天の門`
- creator: `灰原薬`
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- temporaryImagesCommitted: `false`
- FactorValuesAssigned: `false`
- promotionPerformed: `false`
- purpose: recover an official multi-context Art sample only; this ledger assigns no Art value and does not alter the terminal Art rows

## Previous terminal state

The original Batch 004 chunk-01 preflight recorded the exact Shinchosha volume-1
product and frozen ISBN but no work-specific internal trial. It therefore closed
all four Art axes as `unknown-ready`. The registered Shinchosha route remains
fail-closed for a product page with no linked trial; this recovery records a
separate publisher-owned Comic Bunch Kai route discovered through an official
Shinchosha release and does not silently rewrite that registry row.

## Frozen identity and standard edition bridge

| volume | standard ISBN   | official product                          | release      | format        |
| -----: | --------------- | ----------------------------------------- | ------------ | ------------- |
|      1 | `9784107717429` | https://www.shinchosha.co.jp/book/771742/ | `2014-04-09` | B6, 208 pages |
|      2 | `9784107717771` | https://www.shinchosha.co.jp/book/771777/ | `2014-10-09` | B6, 192 pages |
|      3 | `9784107718105` | https://www.shinchosha.co.jp/book/771810/ | `2015-04-09` | B6, 192 pages |

All three official Shinchosha pages identify the same canonical title `応天の門`,
creator `灰原薬`, series `BUNCH COMICS`, and comic form. No limited, bundled,
special, or reissued edition was used. The frozen representative is the standard
volume-1 ISBN `9784107717429`.

The publisher-operated Comic Bunch Kai episode is:

`https://kuragebunch.com/episode/13933686331620138885`

Its page payload identifies `series_id=13933686331620138638`,
`content_id=outennomon_001`, `series_title=応天の門`, creator `灰原薬`,
`can_read=true`, and `isPublic=true`. The same page exposes links to the
publisher's volume 1, 2, and 3 product pages. The page footer states SHINCHOSHA
copyright and the official Shinchosha release below links the episode as the
work's first-episode trial:

`https://prtimes.jp/main/html/rd/p/000001214.000047877.html` (Shinchosha,
`2023-11-09`, retrieved `2026-08-25`).

As a secondary exact-volume check, the publisher-authorized BOOK☆WALKER item
for volume 1 is:

`https://bookwalker.jp/de8f4f25a3-4f0e-4d26-bfc7-6716c85223e1/`

The page identifies `応天の門 1巻`, `灰原薬`, `新潮社` copyright, and a
trial sample whose internal identifiers are `p-outen_01_000` through
`p-outen_01_XXX`. No retailer pixel is used in this recovery; the Art sample
below is from the publisher-owned Comic Bunch Kai CDN.

## Route and page gate

The Comic Bunch Kai HTML exposes 42 `type=main` pages for
`outennomon_001`, from page id `316112896951684662` through
`316112896951684703`. The first page carries `contentStart=outennomon_001` and
the last carries `contentEnd=outennomon_001`. Independent pixel QA found that
page 663 visibly carries the `第一話` title and is chapter-opening material, so
it is excluded along with page 662. The retained set begins at page 666. Every retained
file is a `985x1400` JPEG returned by the official `cdn-img.kuragebunch.com`
route and was rehashed after download.

| ref               | official page URL                                                                                 | body/context boundary                   | temporary file                                               | SHA-256                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| `kurage-page-666` | https://cdn-img.kuragebunch.com/public/page/2/316112896951684666-9b121a435874dcb8e98619118b55c790 | body; movement/atmospheric context      | `/tmp/konocomics-batch004-art01-recovery-pos03/page-666.jpg` | `641c81e47c48f60f0436bc25f77e03721f15c594df11dbd4ca4c760731e6eeab` |
| `kurage-page-674` | https://cdn-img.kuragebunch.com/public/page/2/316112896951684674-5a90f0e98bda1582f7d3ed922549cafc | body; interior/figure context           | `/tmp/konocomics-batch004-art01-recovery-pos03/page-674.jpg` | `d9384fe969953f9f76bc31f3b28dea48066937db68a0874417d0c97e4076a189` |
| `kurage-page-682` | https://cdn-img.kuragebunch.com/public/page/2/316112896951684682-bb2188286e9e057ee772d86c15f08dc7 | body; architectural city context        | `/tmp/konocomics-batch004-art01-recovery-pos03/page-682.jpg` | `13d4a9e45e079a502bc4748bf5035bc9ded984a5f53b32a2ba9ab57db7eb8974` |
| `kurage-page-690` | https://cdn-img.kuragebunch.com/public/page/2/316112896951684690-7dddc763f257a0fa1e8f454f66c204b4 | body; multi-person dialogue context     | `/tmp/konocomics-batch004-art01-recovery-pos03/page-690.jpg` | `479a89dbe21d157b7c87b35dbfca17501e12f7432d5d2b33acd79f09556e3b7d` |
| `kurage-page-698` | https://cdn-img.kuragebunch.com/public/page/2/316112896951684698-8ac9bec6b92084e4aa16db8c5e7b86a0 | body; interior/costume dialogue context | `/tmp/konocomics-batch004-art01-recovery-pos03/page-698.jpg` | `1ae0f8b5745d9efff18df749280f4c90a79a36498a79c2dadb2a014e764b3e4d` |
| `kurage-page-703` | https://cdn-img.kuragebunch.com/public/page/2/316112896951684703-708fb08db53416e2ccbfb0faa30644a3 | body; close character dialogue context  | `/tmp/konocomics-batch004-art01-recovery-pos03/page-703.jpg` | `6ddb6b65c143e69ccd1b5f579b6572c943181248a50444e3a838e8ad57d8ae13` |

The sample has `6` readable internal body pages and `4` distinct scene/context
groups, satisfying the static Art attemptability threshold. It does not prove
one exact bounded start-development-impact-resolved action sequence, so
`motionGateAttemptable=false` is intentional and `motionImpact` must remain
`unknown` unless the independent review later finds an exact bounded sequence.

## Supporting payload hashes

| artifact                             | SHA-256                                                            |
| ------------------------------------ | ------------------------------------------------------------------ |
| Comic Bunch Kai episode HTML         | `d17c3f39614064fcf5e79254d3e810331c46e73151ae041d59615ce61045e11e` |
| Shinchosha volume-1 product HTML     | `aa9235ae0ba8b9cbcf8882a0219ddcdcf7e391301fdf9f6ca2f35c5c8b3087bd` |
| Shinchosha volume-2 product HTML     | `63e4dbd27e5e5d670faa71722043ce3bd2ac178e97b6f9637fe592654393873d` |
| Shinchosha volume-3 product HTML     | `1f85d4b8013e6535e0f86c20482ab2e7b2e64756ba48aedf5d70fd7f848e89fa` |
| BOOK☆WALKER volume-1 item HTML       | `5cd3cc9655bcd146d2e95a42f83c3f7f60f32841ddec3a438847a7f08a41fa06` |
| frozen-work-set.csv                  | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| publisher route registry at recovery | `813d9d36175d9fdde9db9e2adff2549470e04bed778d91fa9918d23e46ce1f28` |

## Closure

- `staticGateAttemptable=true`
- `motionGateAttemptable=false`
- `stateEligibility=sample-ready`
- `reviewedByHuman=false`
- `temporaryImagesCommitted=false`
- `FactorValuesAssigned=false`
- `promotionPerformed=false`

The next step is the existing independent Local + exact Gemini Art review using
this recovery sample. This recovery file does not update `final-art.csv`, any
source or generated catalog, the promotion registry, or any recommendation
state.
