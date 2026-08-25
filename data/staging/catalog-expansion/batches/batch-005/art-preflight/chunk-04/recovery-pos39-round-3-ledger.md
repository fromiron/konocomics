# Batch 005 Art preflight recovery ledger — position 39 round 3

- scope: frozen position 39 only
- workId: `work-aa6018249b7fe7e92d95`
- canonical title: `かよちゃんの荷物`
- creator: `雁須磨子`
- publisher: `竹書房`
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- temporary images committed: `false`
- Art or other Factor values assigned: `false`
- promotion performed: `false`
- selected route: BookLive licensed lower product → ordinary browser reader
- representative ISBN retained: `9784812465752`
- observed lower-edition ISBN: `9784801959255`

## Identity and edition bridge

The official BookLive lower product identifies `かよちゃんの荷物 新装版 下`,
creator `雁須磨子`, publisher `竹書房`, publication date `2017-04-27`, and
lower-edition ISBN `9784801959255`. The browser reader title and official
manifest agree. This is the same-work 2017 new-edition lower volume; the frozen
standard representative ISBN `9784812465752` is unchanged. The canonical title
contains no edition suffix and no `『』` delimiter.

Stable route references:

| Route | URL | Temporary response SHA-256 |
| --- | --- | --- |
| official lower product | https://booklive.jp/product/index/title_id/439092/vol_no/002 | `acbf6c740579971973c82f8347aa14b48e1eaba0a6758e394f594b2459e29c0d` |
| licensed lower reader | https://booklive.jp/bviewer/s/?cid=439092_002&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F439092%2Fvol_no%2F002 | browser-rendered route |
| reader manifest | https://d1cv2lzt22ijfr.cloudfront.net/439092/002/pub/binb/trial/content.js?dmytime=20170427150205 | `fcab73d8bc9bb4620505aaefce8bac3f06e69df7ef287a1fa2f007108f2a3a22` |

The manifest independently binds the title, author, publisher, and ordered
pages: `P0000` cover, `P0001`–`P0002` front matter, `P0003`–`P0005`
illustration gallery, and `P0006`–`P0011` under the `baggage22 かよちゃんと遊ぼう`
contents heading. Paired `L0000`–`L0011` entries are the alternate layout and
are not additional samples.

## Browser-rendered capture procedure

1. Opened the exact licensed lower reader URL in headed Chromium.
2. Waited for the official reader JavaScript to render the cover and pages.
3. Closed the ordinary operation-help overlay by clicking the visible outside
   area at viewport coordinate `(10,10)`.
4. Starting at reader page index `0` (`P0000`), used the normal left-edge page
   turn area at `(100,650)`, waiting for the reader to settle after each turn.
5. Retained only viewport screenshots after the reader reported page indexes
   `6` through `11`, corresponding to manifest pages `P0006`–`P0011`.

No raw page response was used as visual evidence. No tile permutation, custom
decoder, manifest image reconstruction, DRM/protection bypass, or protection
code replay was performed. Temporary captures remain only under
`/tmp/konocomics-batch005-pos39-recovery-round3/`.

## Retained readable BODY pages

All captures are official JS-rendered viewport PNGs at `1850x1937`. The clean
P0011 recapture is used because the transient reader hint had moved into the
left margin on the first capture; the page content is unchanged.

| Manifest ref | Reader action | Temporary path | SHA-256 | Context |
| --- | ---: | --- | --- | --- |
| `P0006` / `c4r2yM7F.jpg` | 6 left-edge turns | `/tmp/konocomics-batch005-pos39-recovery-round3/reader-p-0006.png` | `7aac7dfc487db3a776d8459a87b24f8266adf6aee486a93eebd9f0252bda1e0d` | domestic/arrival and station-side conversation |
| `P0007` / `zDNOzQS9.jpg` | 7 left-edge turns | `/tmp/konocomics-batch005-pos39-recovery-round3/reader-p-0007.png` | `a71753bb45c3b06c5df50b9d3e9859654b440e495dfc5894e41303761a420f06` | shared restaurant meal and conversation |
| `P0008` / `GAJPL0_6.jpg` | 8 left-edge turns | `/tmp/konocomics-batch005-pos39-recovery-round3/reader-p-0008.png` | `e050a7718dfb38895979af1ea34d81a15eba677186f106bbcf6094b119e4c450` | home/interior and phone conversation |
| `P0009` / `oYXQsaxB.jpg` | 9 left-edge turns | `/tmp/konocomics-batch005-pos39-recovery-round3/reader-p-0009.png` | `598261c00c4a8a2d9b2d0e3b89f2dfa96adf2851f98898f435367e92aa52a5dc` | phone, neighborhood transition, and outing |
| `P0010` / `4SDjXxe4.jpg` | 10 left-edge turns | `/tmp/konocomics-batch005-pos39-recovery-round3/reader-p-0010.png` | `9491eadf38183c01319cb9efe5bf732ca4ee1d473d71b53968931a909acb5813` | Sendai outing, restaurant meal, and map |
| `P0011` / `8hMOKUJ_.jpg` | 11 left-edge turns | `/tmp/konocomics-batch005-pos39-recovery-round3/reader-p-0011-clean.png` | `389e177c77f22782da23cd5d3af624a1f73f1989319eb47b930a80a5d79f9ce9` | winter outing, flowers/shopfront, and retail interior |

This is six readable internal BODY pages across at least three distinct scene
contexts. It satisfies the static Art preflight threshold. The captures show
the ordinary reader watermark/UI margin but retain readable page content.

## Gate result

| Gate | Result | Evidence |
| --- | --- | --- |
| canonical identity | pass | product, reader title, manifest title/author/publisher agree |
| edition mapping | pass | 2017 new-edition lower explicitly bridged to frozen standard work; ISBN unchanged |
| static Art preflight | `sample-ready` | 6 readable BODY pages, 3 distinct contexts |
| motion Art preflight | not attemptable | no exact bounded continuous start-development-impact-resolved sequence retained |
| Art assignment | not performed | independent Local Codex + exact `gemini-3.7-flash-high` quorum still required |
| promotion | not performed | no terminal, source, generated, registry, or eligibility mutation |

## Verification boundary

```text
reviewedByHuman=false
retrievedAt=2026-08-25
temporaryImagesCommitted=false
canonicalTitleContainsDelimiter=false
artAssigned=false
motionImpactAssigned=false
promotionPerformed=false
```
