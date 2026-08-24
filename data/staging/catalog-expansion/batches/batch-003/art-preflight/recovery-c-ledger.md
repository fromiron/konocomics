# Batch 003 Art preflight recovery C

- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- scope: positions 21, 28, 34, 37, 49, and 50 only; canonical titles omit decorative brackets.
- mutation boundary: bounded route and sampling evidence only. No Art values, promotion state, source rows, generated catalog, or final-Art rows were assigned or changed.
- route boundary: finite publisher-product and licensed product-linked Cmoa routes were attempted. The Cmoa BinB reader was used only as a licensed internal preview; the publisher or rightsholder product URL is the edition bridge. No further alternate route or crawler was pursued after the routes below.
- temporary evidence: rendered reader captures and hashes were kept under `/tmp/konocomics-batch003-art-recovery-c` only; no images were committed.
- gate contract: static is eligible only with at least 6 readable internal body pages and at least 2 distinct contexts within vols 1–3. Covers, title pages, contents, blank/disclaimer pages, and episode-title splashes are excluded. Motion remains eligible only for one exact continuous start-development-impact-resolved sequence; none was retained. `FactorValuesAssigned=false`.

## Route and edition bridges

| Position / work | Official publisher or rightsholder product URL | Licensed product / reader URL | Frozen edition bridge and route result |
| ---: | --- | --- | --- |
| 21 青空エール | https://www.shueisha.co.jp/books/items/contents.html?jdcn=08846366846366345501 / https://www.shueisha.co.jp/books/reader/main.php?cid=08846366846366345501 | https://www.cmoa.jp/title/54583/ / https://www.cmoa.jp/reader/sample/?title_id=54583&content_id=100000545830001 | The official route is digital remaster JDCN `08846366846366345501` (digital release 2012-06-15). It states color-restoration changes and exposes no explicit body bridge to frozen print ISBN `9784088463667`; the Cmoa listing is the same remaster family, so no page was retained. |
| 28 いつかティファニーで朝食を | https://www.shinchosha.co.jp/book/771677/ | https://www.cmoa.jp/title/86461/ / https://www.cmoa.jp/reader/sample/?title_id=86461&content_id=100000864610001 | Shinchosha product is exact frozen vol1 ISBN `9784107716774` (2012-09-07). Cmoa vol1 repeats the title, creator, 新潮社/BUNCH COMICS identity, volume number, and the same opening synopsis, which is an explicit same-body vol1 bridge; print pagination/logos are not asserted identical. |
| 34 惑星のさみだれ | https://www.shonengahosha.co.jp/book_Info.php?id=7347 | https://www.cmoa.jp/title/15963/ / https://www.cmoa.jp/reader/sample/?title_id=15963&content_id=100000159630001 | Shonengahosha product is exact frozen vol1 ISBN `9784785926052` (2006-01-27). Cmoa vol1 repeats title, 水上悟志, 少年画報社/YOUNG KING OURS, volume identity, and opening synopsis, establishing the same-body bridge; the prior Comic Y’ours tile route was not retained because the six assets were unreadable/permuted. |
| 37 ねこだらけ | https://www.kodansha.co.jp/comic/products/0000013952 | https://www.cmoa.jp/title/130307/ / https://www.cmoa.jp/reader/sample/?title_id=130307&content_id=100001303070001 | Kodansha unnumbered standard product is exact frozen ISBN `9784063728262` (2009-08-21). Cmoa's one-volume listing repeats title, 横山キムチ, 講談社/Morning identity, and the body work, establishing the same-body bridge. |
| 49 空挺ドラゴンズ | https://www.kodansha.co.jp/comic/products/0000047558 | https://www.cmoa.jp/title/121923/ / https://www.cmoa.jp/reader/sample/?title_id=121923&content_id=100001219230001 | Kodansha product is exact frozen vol1 ISBN `9784063882049` (2016-11-07). Cmoa vol1 repeats title, 桑原太矩, 講談社/good! Afternoon identity, volume number, and opening synopsis, establishing the same-body bridge; print pagination is not asserted identical. |
| 50 ワカコ酒 | https://catalog.coamix.co.jp/wakako/ | https://www.cmoa.jp/title/74548/ / https://www.cmoa.jp/reader/sample/?title_id=74548&content_id=100000745480001 | Existing official identity adjudication explicitly bridges current Coamix rights-holder identity to original North Stars Pictures/Zenon Comics vol1 ISBN `9784199801457`. Cmoa vol1 repeats title, 新久千映, Coamix/Zenon identity, and the body episodes; pagination is not asserted identical. |

The five Cmoa samples marked `sample-ready` are single-volume routes; no cross-volume page combining or vol2/vol3 inference was used. Position 21 is intentionally `unknown-ready` because no frozen-print body bridge was established.

## Eligibility summary

| Position / work | Eligible body pages | Distinct contexts | Static | Motion | State | Residual limitation |
| ---: | ---: | ---: | --- | --- | --- | --- |
| 21 青空エール | 0 | 0 | not attemptable | not attemptable | `unknown-ready` | Reachable official and licensed routes are remaster-based and edition-unresolved; no page is retained. |
| 28 いつかティファニーで朝食を | 6 | 3: bedroom/domestic relationship; breakfast-table; restaurant/conversation | ready | not attemptable | `sample-ready` | Body bridge supports static Art only; no exact resolved motion sequence and no print-pagination claim. |
| 34 惑星のさみだれ | 6 | 3: apartment/bedroom opening; balcony/home interaction; indoor rescue/conversation | ready | not attemptable | `sample-ready` | Episode-title splash and front matter are excluded; prior official tile route was unreadable; no exact resolved motion sequence. |
| 37 ねこだらけ | 6 | 3: festival/stage; public/aerial play; household/laundry | ready | not attemptable | `sample-ready` | Four-panel gag pages do not provide one exact continuous resolved motion sequence. |
| 49 空挺ドラゴンズ | 6 | 3: airship/crew operations; dragon capture in cloud-sea; onboard/ground processing | ready | not attemptable | `sample-ready` | Flight 1 title page, contents, disclaimer/blank are excluded; action continues without a single bounded resolved sequence. |
| 50 ワカコ酒 | 6 | 3: salmon restaurant; yakitori restaurant; street-to-restaurant transition | ready | not attemptable | `sample-ready` | Episode 1 title page and front matter are excluded; current-rightsholder bridge supports body only; no exact resolved motion sequence. |

All selected pages are readable rendered body pages and the five ready rows clear both static thresholds. No row receives an Art value; `sample-ready` is a static preflight state only.

## Selected page hashes

Hashes are SHA-256 for the six selected readable body captures recorded in the CSV. Refs are stable Cmoa reader positions, not asserted print folios.

| Work | Ref = SHA-256 |
| --- | --- |
| 28 いつかティファニーで朝食を | `cmoa-86461-P007=f4ddf37ea0498a2c65298c4a1a1d41b3cd7e623aeb555873b052e4ada0892cb9`; `cmoa-86461-P008=0a9a78eb7d7b07e0752e7b0fb7c136beacc0828c4229dec1223eec6cbabfb29a`; `cmoa-86461-P009=0a3f5b658c6af2d4afe41b3fdab965e15047be2db8abd1ceef14a24be680321b`; `cmoa-86461-P010=d1e992f0278d2b9acd9222ea1c796ff60d5d2c7db8d57294aa4c876ad989b17b`; `cmoa-86461-P011=8b8d87cb8926d4da5244ebea274694a77a356dcb3667a1bf1a26efd47e0c9e08`; `cmoa-86461-P012=4eb666460688dfbebb2be7d4b84c6a51c75816d3a71af88dbca14216627d308d` |
| 34 惑星のさみだれ | `cmoa-15963-P004=3644f68b362a3940421ebf2f1ce3fd401c0c96ddef6a937878fbb9b7cbcee829`; `cmoa-15963-P005=c34c223318ed7278f4ffd0f3e8b5ca9e2133ee3a560c65d88ff77d8a654e05b3`; `cmoa-15963-P007=23a973d4be0dcce55db182805d79dfe9f7266b86008ff17dd1600979fd69f71c`; `cmoa-15963-P008=2f52909fc48fb00e29329b958beec1287a8b72ebc91b8217f4e45961b675524c`; `cmoa-15963-P009=6d09717d259e59818da4fd1f1bdf710b5b691aed3dd8283fa526dc8183837807`; `cmoa-15963-P010=756b558a5f0c3de120875ea4c4571b91af134cba7bd136f1c322ba073c142b72` |
| 37 ねこだらけ | `cmoa-130307-P003=fbd51544976175a9d6d9e453ec69c2d06adfd11bfa22c399f20f4f365645ece4`; `cmoa-130307-P004=5d0cdf0ccecd89af38a905f5dab9d5d39117c37fd45a9bdbc2d38f4de43b4c51`; `cmoa-130307-P005=740c6bee24e0be8209a4dad88075707daa55d6f959d1ac8aaaabc1db1b5cc540`; `cmoa-130307-P006=c832677927f7c49152ac62bb8438ea740e38463bc899b7fc1b4e9bb9523944ed`; `cmoa-130307-P007=a49297de3384dd50f559d6dd3f8d9dada6d53013935310f0b58607ecb5a76dc9`; `cmoa-130307-P008=39c48e6bee73b0fda3844327cf398dc2a0b8fbda7cc191c76472de7f702c3a0b` |
| 49 空挺ドラゴンズ | `cmoa-121923-P006=47612368193f689fadf0685eed7a11b7e8ea2f8093bfa58a30a2280bf10680d8`; `cmoa-121923-P008=7f4f9e42a2f8c57029491271db42949efe8d186719d92f6ef1770db60250b645`; `cmoa-121923-P009=eb1bdaa119074f7222e0985c013bd43ea1a2ed0d982abc6cfde109bcbb4e688b`; `cmoa-121923-P010=fffb36513890e1c3a5f6d19fdb313a7b5e9117cf54920f667dd75e678330eb6d`; `cmoa-121923-P011=3faa68eb09d802057f359e784d936c2314f30f13363a793ff2d1147b44fa4633`; `cmoa-121923-P012=b200569f12f19b13c0f2c1cad6104d5663fdd650922ea212d5ca481ad3c8ae92` |
| 50 ワカコ酒 | `cmoa-74548-P007=183bd1275489338ba4acee84a819098fa32b96d5264e6611b34035963edfbdc8`; `cmoa-74548-P008=6e4604c5218c2e9bb21c93bc449358f804c9d3862fe921cef010d7af6be05f4b`; `cmoa-74548-P009=8f7533b0b7eefcd5f75443a4837fcd533e8d443bfc0db7dd68f1252296c5c413`; `cmoa-74548-P010=652b977d84d40b83b90925ae8fe5df6a991745a1d97a493b1aa645c96c55fc89`; `cmoa-74548-P012=109e006070bd7ec1f27fe8662c57571c712fca8138e9a8b010953de28dc007fb`; `cmoa-74548-P013=f18bc6a7e2806e544438b6124aa728fd37280751fd7866efe56ad7b56e5c3f44` |

## Motion gate and closure

All six rows set `motionGateAttemptable=false`. The captures show static scenes or action fragments without one exact continuous start-development-impact-resolved sequence. Motion therefore remains unknown/ineligible; no sequence is inferred from adjacent pages.

`temporaryImagesCommitted=false`, `reviewedByHuman=false`, and `FactorValuesAssigned=false`. Recovery C is closed at the requested route boundary; no Art values or promotion was performed.
