# Batch 005 Art preflight recovery — position 26

- scope: frozen Batch 005 position 26 only
- workId: `work-5b7cf2105a4bc6f6b46c`
- canonicalTitle: `クジラの子らは砂上に歌う`
- creator: `梅田阿比`
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- temporaryImagesCommitted: `false`
- FactorValuesAssigned: `false`
- promotionPerformed: `false`
- acquisition boundary: official Akita Shoten product page and its directly linked official ARC viewer; no retailer or unregistered reader was substituted

## Frozen identity and edition bridge

| Item | Value |
| --- | --- |
| frozen representative ISBN | `9784253261012` |
| official vol. 1 product | https://www.akitashoten.co.jp/comics/4253261019 |
| official vol. 2 product | https://www.akitashoten.co.jp/comics/4253261027 |
| official vol. 3 product | https://www.akitashoten.co.jp/comics/4253261035 |
| product title | `クジラの子らは砂上に歌う 第1巻` |
| product creator | `梅田阿比` |
| product ISBN | `978-4-253-26101-2` |
| product → ARC link | https://arc.akitashoten.co.jp/comics/kojiranoko/1 |
| ARC episode JSON | https://arc.akitashoten.co.jp/comics/kojiranoko/1.json |
| ARC JSON title | `クジラの子らは砂上に歌う` |
| ARC JSON creator | `梅田阿比` |
| ARC JSON volume | `1` |
| ARC JSON page count | `45` |
| ARC JSON created/updated | `2013-12-12T23:58:52+09:00` / `2015-06-15T20:45:48+09:00` |

The vol. 1 publisher page contains the direct `試し読み！` link to the ARC reader. The ARC JSON independently identifies the same title, creator, and volume 1. Volumes 2 and 3 were checked through the publisher product pages to establish the entry-volume range. The representative ISBN remains the standard vol. 1 edition; no special, set, or later edition was used.

## Full 45-page JSON enumeration and classification

The JSON returned exactly 45 ordered page entries. All page URLs below use the official `pc_url` form `https://arc.akitashoten.co.jp/comics/kojiranoko/1/{n}?style=pc`.

| order | page ref | classification | disposition |
| ---: | --- | --- | --- |
| 1 | `arc-page-01` | non-body | full-color cover / promotional cover material |
| 2 | `arc-page-02` | body | readable interior page; landscape and group setting |
| 3 | `arc-page-03` | body | readable interior page; settlement and community setting |
| 4 | `arc-page-04` | body | selected; readable interior landscape / settlement architecture |
| 5 | `arc-page-05` | body | selected; readable interior desert / floating-settlement landscape |
| 6 | `arc-page-06` | body | selected; readable interior ceremony / character group interaction |
| 7 | `arc-page-07` | body | selected; readable interior sand movement and group interaction |
| 8 | `arc-page-08` | body | selected; readable interior mourning / character interaction |
| 9 | `arc-page-09` | body | selected; readable interior settlement and character context |
| 10 | `arc-page-10` | body | readable interior page |
| 11 | `arc-page-11` | body | readable interior page |
| 12 | `arc-page-12` | body | readable interior page |
| 13 | `arc-page-13` | body | readable interior page |
| 14 | `arc-page-14` | body | readable interior page |
| 15 | `arc-page-15` | body | selected motion start; leaf-cutting request and throw preparation |
| 16 | `arc-page-16` | body | selected motion development; disc throw and flight through foliage |
| 17 | `arc-page-17` | body | selected motion impact/resolution; leaves are cut and the characters react |
| 18 | `arc-page-18` | body | readable interior page |
| 19 | `arc-page-19` | body | readable interior page |
| 20 | `arc-page-20` | body | readable interior page |
| 21 | `arc-page-21` | body | readable interior page |
| 22 | `arc-page-22` | body | readable interior page |
| 23 | `arc-page-23` | body | readable interior page |
| 24 | `arc-page-24` | body | readable interior page |
| 25 | `arc-page-25` | body | readable interior page |
| 26 | `arc-page-26` | body | readable interior page |
| 27 | `arc-page-27` | body | readable interior page |
| 28 | `arc-page-28` | body | readable interior page |
| 29 | `arc-page-29` | body | readable interior page |
| 30 | `arc-page-30` | body | readable interior page |
| 31 | `arc-page-31` | body | readable interior page |
| 32 | `arc-page-32` | body | readable interior page |
| 33 | `arc-page-33` | body | readable interior page |
| 34 | `arc-page-34` | body | readable interior page |
| 35 | `arc-page-35` | body | readable interior page |
| 36 | `arc-page-36` | body | readable interior page |
| 37 | `arc-page-37` | body | readable interior page |
| 38 | `arc-page-38` | body | readable interior page |
| 39 | `arc-page-39` | body | readable interior page |
| 40 | `arc-page-40` | body | readable interior page |
| 41 | `arc-page-41` | body | readable interior page |
| 42 | `arc-page-42` | body | readable interior page |
| 43 | `arc-page-43` | body | readable interior page |
| 44 | `arc-page-44` | body | readable interior page |
| 45 | `arc-page-45` | body | readable interior page |

Classification was made by reopening every original-resolution page in the transient rendered packet. Page 01 is the only non-body item. The remaining 44 pages are readable body pages. Six pages were retained for the static preflight sample and three additional pages were retained for the exact motion sequence.

## Selected sample and gate result

Selected exact official static page refs are `arc-page-04` through `arc-page-09` (six readable body pages). They provide at least three distinct contexts: (1) floating settlement / ship and desert world-building landscapes, (2) funeral or mourning ceremony with multiple characters, and (3) close character and group interaction. The static threshold is therefore met: six readable body pages and at least two distinct contexts.

`motionGateAttemptable=true`. The separately retained `arc-page-15` through `arc-page-17` sequence is exact and continuous: page 15 gives the leaf-cutting request and throw preparation; page 16 shows the disc release and flight; page 17 shows the cutting impact, falling leaves, and immediate character reaction endpoint. This only opens later `motionImpact` review. No motion value is assigned here.

No Art value is assigned by this recovery. The result is `sample-ready` only and must proceed through the existing independent Local + Gemini Art quorum. No source, generated catalog, promotion registry, or existing final-Art row was edited.

## Selected transient capture hashes

| page ref | official URL | temporary capture | SHA-256 |
| --- | --- | --- | --- |
| `arc-page-04` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/4?style=pc | `/tmp/konocomics-batch005-pos26-recovery/page-04.jpg` | `5267b559b1b94d3b3db55b27e3abcecbf927dea5234e8958e098c162a5202ca8` |
| `arc-page-05` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/5?style=pc | `/tmp/konocomics-batch005-pos26-recovery/page-05.jpg` | `499baf43abe445f2c224edd63d01c53228869e0768b4779c455c579c85f5bb22` |
| `arc-page-06` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/6?style=pc | `/tmp/konocomics-batch005-pos26-recovery/page-06.jpg` | `662dd7d48b21a5ccedcc544a4f56e9011ad08e56c3282ba5979958fb08bf92ba` |
| `arc-page-07` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/7?style=pc | `/tmp/konocomics-batch005-pos26-recovery/page-07.jpg` | `d0242000a68c5c33b5db2bf66a57bb867c0e4b999ca9655cba17959fddca274a` |
| `arc-page-08` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/8?style=pc | `/tmp/konocomics-batch005-pos26-recovery/page-08.jpg` | `7198867a4aa18bd8908d756f2a6588b9a7818163fed12df9a9ea18d0ae76bab45` |
| `arc-page-09` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/9?style=pc | `/tmp/konocomics-batch005-pos26-recovery/page-09.jpg` | `dc34ceca0dd9ecd4d1bbd7c1b82b304cf3ac4e20c7990a805fdde99f8822f4c3` |
| `arc-page-15` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/15?style=pc | `/tmp/konocomics-batch005-pos26-recovery/page-15.jpg` | `908d4cfecfe0de5596c970a8626a6fa1a10816369922c61cbe0a9321ad6e0d6d` |
| `arc-page-16` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/16?style=pc | `/tmp/konocomics-batch005-pos26-recovery/page-16.jpg` | `07b965fd34519558fdd755b2df065ff2dc4154bdf66e7472b74dc8d686aae3ad` |
| `arc-page-17` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/17?style=pc | `/tmp/konocomics-batch005-pos26-recovery/page-17.jpg` | `4b7adc8d48d893be7855a67d291405a14e929e9e69024cf2defd1f8b68358053` |

## Browser route capture

Playwright Chromium screenshots were captured transiently for the official product page and the ARC viewer. They are route-verification artifacts only and are not committed:

- product screenshot SHA-256: `6a3cc0c4b4bd3a85f5d686fa218cbfcab737d9d8e71e1a0ff290b08c788339d8`
- reader screenshot SHA-256: `6abb79ef1a9cae6978fde579608f70a1e6a6bff8dd1b71ac6134fbe065bfe557`

## Closure

This bounded recovery closes the previous `official-product-only` result for position 26 as `sample-ready`. It does not assign Art or change promotion status. `reviewedByHuman=false`, `temporaryImagesCommitted=false`, and `FactorValuesAssigned=false` remain explicit.
