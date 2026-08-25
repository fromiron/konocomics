# Art route recovery — Batch 004 position 3 — round 1

- workId: `work-0f3a44f5dcab9623d1be`
- canonicalTitle: `応天の門`
- creator: `灰原薬`
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- purpose: recover an official multi-context Art preflight sample only; no Art value assignment or promotion change

## Result

The previous terminal preflight was `official-product-only` because the
Shinchosha volume-1 product page did not expose a work-specific reader. A
bounded recovery found the publisher-operated Comic Bunch Kai first-episode
route, linked from a Shinchosha publisher release. Its payload identifies the
same series, title, creator, and first-episode content id, and its page lists
publisher volume 1, 2, and 3 products. Six readable body pages were retained
from four distinct contexts. The static Art sample gate is now attemptable.

The route is publisher-owned and licensed internal-preview evidence, not a
community upload or retailer capture. The previous registered Shinchosha
product-only disposition remains fail-closed for the product page itself; this
recovery is an explicit route-specific supplement and is not a silent registry
rewrite.

## Identity and edition bridge

| volume | standard ISBN   | official product                          | release      |
| -----: | --------------- | ----------------------------------------- | ------------ |
|      1 | `9784107717429` | https://www.shinchosha.co.jp/book/771742/ | `2014-04-09` |
|      2 | `9784107717771` | https://www.shinchosha.co.jp/book/771777/ | `2014-10-09` |
|      3 | `9784107718105` | https://www.shinchosha.co.jp/book/771810/ | `2015-04-09` |

All three pages identify `応天の門`, `灰原薬`, and `BUNCH COMICS`; the frozen
representative remains the standard vol.1 ISBN `9784107717429`. The publisher
episode is https://kuragebunch.com/episode/13933686331620138885 and its
payload identifies `series_id=13933686331620138638`,
`content_id=outennomon_001`, `can_read=true`, and `isPublic=true`. It lists the
publisher's volume 1–3 book entries. The official Shinchosha release
https://prtimes.jp/main/html/rd/p/000001214.000047877.html (2023-11-09)
explicitly presents the Comic Bunch Kai URL as the work's first-episode trial.

As a secondary exact-volume identity check, the publisher-authorized
BOOK☆WALKER item https://bookwalker.jp/de8f4f25a3-4f0e-4d26-bfc7-6716c85223e1/
identifies vol.1, creator, Shinchosha copyright, and `p-outen_01_XXX` trial
identifiers. No BOOK☆WALKER pixels were used for the recovery sample.

## Sample disposition

- `staticGateAttemptable=true`
- `readableInternalPageCount=6`
- `distinctContextCount=4`
- `motionGateAttemptable=false`
- `stateEligibility=sample-ready`
- temporary images: `/tmp/konocomics-batch004-art01-recovery-pos03/`
- recovery metadata: `../art-preflight/chunk-01/recovery-pos03-preflight.csv` and `../art-preflight/chunk-01/recovery-pos03-ledger.md`
- review input manifest: `../art-review/chunk-01/recovery-pos03-input-manifest.md`

The selected page set excludes `kurage-page-663`, which visibly contains the
`第一話` title and is therefore chapter-opening material, along with covers,
ads, link pages, and synopsis material. The six retained pages span movement or
atmosphere, architectural city detail, and multi-person dialogue. No exact
bounded start-development-impact-resolved action sequence was retained, so
`motionImpact` remains `unknown` unless an independent reviewer finds one in
the exact contiguous official references.

## Scope boundary

This recovery does not edit `final-art.csv`, any Art factor, source data,
generated artifacts, promotion registry, or recommendation state. The existing
terminal unknown rows remain authoritative until the independent Local + Gemini
review and adjudication are completed.
