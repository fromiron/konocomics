# Batch 005 position 45 Art route recovery — round 1

## 조사 경계

- 대상: frozen work-set position `45`, `work-e658d3aee2e33c17aa38`, `スピリットサークル`
- 조회일: `2026-08-25`
- `reviewedByHuman=false`
- current branch / HEAD: `main` / `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Art gate: readable internal BODY pages at least 6개, genuinely distinct contexts at least 2개. `motionImpact=known`은 별도의 연속 시퀀스 gate를 통과해야 한다.

이 recovery는 기존 `official-product-only` 결과를 재검증하는 제한된 공식/권리자
연결 reader 조사다. Art 값을 배정하지 않았고, 기존
`art-preflight/chunk-05/preflight.csv`, `art-preflight/chunk-05/ledger.md`,
`art-review/chunk-05/final-art.csv`, source/generated/promotion 파일을 수정하지
않았다. 임시 이미지와 signed viewer URL은 저장소에 추가하지 않았다.

## canonical identity와 standard-edition bridge

| 항목 | 확인값 |
| --- | --- |
| canonical title | `スピリットサークル` |
| creator | `水上悟志` |
| publisher | `少年画報社` |
| frozen representative ISBN | `9784785939830` (standard print, volume 1) |
| official volume 1 | https://www.shonengahosha.co.jp/book_Info.php?id=7155 |
| official volume 2 | https://www.shonengahosha.co.jp/book_Info.php?id=7156 |
| official volume 3 | https://www.shonengahosha.co.jp/book_Info.php?id=7157 |
| volume 1 ISBN / date | `9784785939830` / `2012-12-10` |
| volume 2 ISBN / date | `9784785950972` / `2013-07-30` |
| volume 3 ISBN / date | `9784785952556` / `2014-04-03` |
| BOOK☆WALKER series | https://bookwalker.jp/series/7441/list/ |

The three publisher product pages independently render `スピリットサークル 第1巻`,
`第2巻`, and `第3巻` with creator `水上悟志`. Their standard ISBNs and dates bridge
the frozen representative ISBN to the exact entry-volume range. The canonical title
is the clean work title; Japanese corner brackets are not part of the title.

The rights-holder-linked BOOK☆WALKER products are:

| entry volume | product/trial URL | viewer CID | identity result |
| ---: | --- | --- | --- |
| 1 | https://bookwalker.jp/ded91ce5bd-eb14-46e5-938c-f27e4a0203c2/?sample=1 | `d91ce5bd-eb14-46e5-938c-f27e4a0203c2` | product title is `スピリットサークル (1)`; creator/publisher and product-linked trial match the standard vol. 1 bridge |
| 2 | https://bookwalker.jp/de10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/?sample=1 | `10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df` | product title is `スピリットサークル (2)`; creator/publisher and product-linked trial match standard vol. 2 |
| 3 | https://bookwalker.jp/de110df35f-cfc9-40cc-98e4-be4ce5ec9584/?sample=1 | `110df35f-cfc9-40cc-98e4-be4ce5ec9584` | product title is `スピリットサークル (3)`; creator/publisher and product-linked trial match standard vol. 3 |

The final viewer routes are the common BOOK☆WALKER trial reader:

```text
https://viewer-trial.bookwalker.jp/03/21/viewer.html?cid=d91ce5bd-eb14-46e5-938c-f27e4a0203c2&cty=1
https://viewer-trial.bookwalker.jp/03/21/viewer.html?cid=10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df&cty=1
https://viewer-trial.bookwalker.jp/03/21/viewer.html?cid=110df35f-cfc9-40cc-98e4-be4ce5ec9584&cty=1
```

## finite trial-entry enumeration

The configured reader exposed a `1/12`-style page counter for each entry-volume
trial. Actual image requests were followed through the browser, and only the exact
rendered JPEG requests were retained under `/tmp`. The counts below are observed
renderable entries, not an inference about unavailable pages. Covers, blank
frontmatter, title/opening material, chapter splashes, and terminal reader UI were
not counted as BODY pages.

### Volume 1

Observed image entries `p001` through `p011`.

| refs | classification | disposition |
| --- | --- | --- |
| `p001` | cover | excluded |
| `p002` | blank/white frontmatter | excluded |
| `p003` | full-colour opening material | excluded conservatively |
| `p004`–`p005` | title splash / opening illustration | excluded |
| `p006` | body panels followed by a large `三ヶ月前` chapter marker | excluded conservatively as chapter-opening material |
| `p007`–`p011` | readable BODY; school corridor, classroom, and character introduction | retained as diagnostic only |

The strict volume-1 result is `5` BODY pages and does not meet the static gate.

### Volume 2

Observed image entries `p001` through `p011`.

| refs | classification | disposition |
| --- | --- | --- |
| `p001` | cover | excluded |
| `p002` | blank/white frontmatter | excluded |
| `p003`–`p005` | opening/title illustration material | excluded |
| `p006` | readable BODY; colour fantasy/travel-memory sequence | selected |
| `p007`–`p011` | readable BODY; present-day school corridor/classroom introduction | selected |

This is `6` readable BODY pages over `2` genuinely distinct scene contexts and is
the recovery's static `sample-ready` route. No exact bounded continuous
start-development-impact-resolved motion sequence was established; motion remains
closed (`motionGateAttemptable=false`).

### Volume 3

The viewer exposed the same 12-slot counter. In the bounded browser run, actual
renderable JPEG entries `p001` through `p009` were observed before the reader
stopped issuing page-image requests. `p001` is the cover; `p002`–`p009` are
readable body-like colour/fantasy and home/bedroom material. Volume 3 was retained
as an identity/route corroboration entry and was not needed to satisfy the gate,
so no missing `p010`–`p012` pages are inferred or counted.

## selected static sample

The recovery preflight selects exact volume-2 reader pages `p006`–`p011`:

1. `p006`: colour fantasy/travel-memory scene with characters and landscape.
2. `p007`–`p011`: present-day school corridor/classroom sequence with character
   interaction and introduction.

These are two different scene contexts, not two labels applied to the same panel
layout. The six pages are all readable BODY pages after the conservative opening
material exclusions. This opens only the static Art review; it does not assert an
Art value.

## temporary capture hashes

Original-resolution JPEG bytes are temporary only:
`/tmp/konocomics-spirit45-recovery-v2/actual-p-006.jpeg` through
`actual-p-011.jpeg`. The deterministic selected-byte set hash is
`17d9246b0ea04ecd2af200225ca0f20de318f906f3006bf644ccacc30bdccead`.

| page ref | official image path | SHA-256 |
| --- | --- | --- |
| `reader-v2-p006` | `/d_normal/10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/2/item/xhtml/p-006.xhtml/0.jpeg` | `54ea32927502dd995b0952d77a64e726f3f03441f84e8f2927cb85677bacd9ad` |
| `reader-v2-p007` | `/d_normal/10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/2/item/xhtml/p-007.xhtml/0.jpeg` | `6e572900e5e33c863c26e2f87b5d574f2b38b41e5c7a7f48c4af0108903b41a4` |
| `reader-v2-p008` | `/d_normal/10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/2/item/xhtml/p-008.xhtml/0.jpeg` | `65a6e3949dd6e08d4b724497b0673d96f3f1acbcd29a890213eac7752dfe938c` |
| `reader-v2-p009` | `/d_normal/10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/2/item/xhtml/p-009.xhtml/0.jpeg` | `39dd198ac1d80541b03abd9faa1f01c94a070532b0cad4f913e3f7a6722dcfc4` |
| `reader-v2-p010` | `/d_normal/10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/2/item/xhtml/p-010.xhtml/0.jpeg` | `0d37650396712882c4147ef87c7334fc4cbd244c09a981b94d33a771fef26dd5` |
| `reader-v2-p011` | `/d_normal/10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/2/item/xhtml/p-011.xhtml/0.jpeg` | `e2b97fdebf7d8b483136615e770e87470bc437f14153e0b62d85b58811c23ed4` |

The image paths identify the official reader route; signed query parameters were
transient and are intentionally not committed. Page refs and hashes bind the
temporary capture to this preflight.

## conclusion and handoff

This bounded recovery reopens position 45 from the previous `official-product-only`
result to `sample-ready` for static Art review through the product-linked
BOOK☆WALKER volume-2 trial. It does not assign Art, confidence, motion, promotion,
or recommendation eligibility. The existing terminal/source/generated/promotion
records remain unchanged.

The next required step is the existing independent Local + Gemini Art review (and
adjudication only if required). `reviewedByHuman=false`,
`temporaryImagesCommitted=false`, `FactorValuesAssigned=false`, and
`promotionPerformed=false` remain explicit.

## verification

```text
reviewedByHuman=false
retrievedAt=2026-08-25
temporaryImagesCommitted=false
git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/art-route-recovery-pos45-round-1.md  # PASS
```
