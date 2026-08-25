# Batch 005 Art preflight recovery input ledger — position 39 round 3

- scope: frozen Batch 005 position 39 only
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- temporary image root: `/tmp/konocomics-batch005-pos39-recovery-round3`
- repository image mutation: none
- archive format: uncompressed
- browser capture: headed Playwright Chromium through the normal BookLive reader route; temporary only
- no local image path was added to the repository

## Frozen repository inputs

| Input | Path or identity | SHA-256 |
| --- | --- | --- |
| candidate identity | supplied Batch 005 candidate root | `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695` |
| batch manifest | `data/staging/catalog-expansion/batches/batch-005/manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| payload ledger | `data/staging/catalog-expansion/batches/batch-005/PAYLOAD.sha256` | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` |
| frozen work set | `data/staging/catalog-expansion/batches/batch-005/frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| prior position-39 adjudication | `data/staging/catalog-expansion/batches/batch-005/reviews/daybreak-blocker-adjudication-position-39-final-round-2.md` | `8fbfabc6f39d01400241c411d75dcb6160c8b61834a071d117a0f8dba805d73e` |
| prior position-39 recovery preflight | `data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-04/recovery-pos39-round-2-preflight.csv` | `fe40d63532ff62488b3a89445f7652a6f7442f021ac950d4abf09aeaaf6c2c68` |

## Official route inputs

| Input | URL | Temporary response SHA-256 |
| --- | --- | --- |
| lower product HTML | https://booklive.jp/product/index/title_id/439092/vol_no/002 | `acbf6c740579971973c82f8347aa14b48e1eaba0a6758e394f594b2459e29c0d` |
| lower licensed reader | https://booklive.jp/bviewer/s/?cid=439092_002&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F439092%2Fvol_no%2F002 | browser-rendered route; viewport screenshot retained only |
| reader manifest | https://d1cv2lzt22ijfr.cloudfront.net/439092/002/pub/binb/trial/content.js?dmytime=20170427150205 | `fcab73d8bc9bb4620505aaefce8bac3f06e69df7ef287a1fa2f007108f2a3a22` |

The official product page confirms title, creator, publisher, lower-edition
ISBN `9784801959255`, publication date `2017-04-27`, and the browser preview
entry. The manifest confirms the exact ordered page IDs and the `baggage22`
contents heading. Its direct image responses were not used as visual evidence;
the retained evidence is limited to screenshots of the final browser-rendered
viewport.

## Temporary rendered inputs

| Capture | Path | SHA-256 |
| --- | --- | --- |
| official product viewport | `/tmp/konocomics-batch005-pos39-recovery-round3/product.png` | `44bad93127fe94d858cb78225f3521b8c5d9233dbca558e130a86bb703f0b8bf` |
| reader P0006 | `/tmp/konocomics-batch005-pos39-recovery-round3/reader-p-0006.png` | `7aac7dfc487db3a776d8459a87b24f8266adf6aee486a93eebd9f0252bda1e0d` |
| reader P0007 | `/tmp/konocomics-batch005-pos39-recovery-round3/reader-p-0007.png` | `a71753bb45c3b06c5df50b9d3e9859654b440e495dfc5894e41303761a420f06` |
| reader P0008 | `/tmp/konocomics-batch005-pos39-recovery-round3/reader-p-0008.png` | `e050a7718dfb38895979af1ea34d81a15eba677186f106bbcf6094b119e4c450` |
| reader P0009 | `/tmp/konocomics-batch005-pos39-recovery-round3/reader-p-0009.png` | `598261c00c4a8a2d9b2d0e3b89f2dfa96adf2851f98898f435367e92aa52a5dc` |
| reader P0010 | `/tmp/konocomics-batch005-pos39-recovery-round3/reader-p-0010.png` | `9491eadf38183c01319cb9efe5bf732ca4ee1d473d71b53968931a909acb5813` |
| reader P0011 clean | `/tmp/konocomics-batch005-pos39-recovery-round3/reader-p-0011-clean.png` | `389e177c77f22782da23cd5d3af624a1f73f1989319eb47b930a80a5d79f9ce9` |

Every reader capture is an official JS-rendered `1850x1937` PNG. No image
file is copied into the repository.
