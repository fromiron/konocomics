# Batch 003 Art preflight recovery B2

- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- scope: bounded corrective pass for positions 2, 5, 7, and 12 only; position 3 is outside this corrective route.
- basis: `daybreak-recovery-b-verification.md` rejected the title/chapter splash counted by positions 2, 5, and 7, and rejected position 12's false context/motion flags.
- mutation boundary: access and sampling evidence only. No Art values, promotion state, source row, or final-art row were assigned or changed.
- route boundary: the predefined official publisher/product-linked licensed Cmoa readers from recovery B were reused. No alternate route, crawler, or broader batch route was pursued.
- temporary evidence: all retained reader captures and hashes are under `/tmp/konocomics-batch003-art-recovery-b` only; no temporary image was copied into the repository.

The corrective rule is applied after excluding covers, title or chapter-opening splash pages, contents, advertisements, blank/loader captures, and added edition material. A distinct context is a separate scene context, not a successive beat within one continuous scene. The six-page count is the exact selected body-page count, not a claim about total preview length.

## Route and edition bridges

| Position / work | Official publisher or product URL | Licensed product / reader URL | Exact vol1 bridge |
| ---: | --- | --- | --- |
| 2 大東京トイボックス | https://www.gentosha-comics.net/search/?search_title=%E5%A4%A7%E6%9D%B1%E4%BA%AC%E3%83%88%E3%82%A4%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9 | https://www.cmoa.jp/title/190848/ / https://www.cmoa.jp/reader/sample/?title_id=190848&content_id=100001908480001 | Frozen original ISBN `9784344809437`; the Cmoa digital-remaster listing says it is remade from original manuscript data. Added end matter/roughs are excluded, so only body content is eligible. |
| 5 私の少年 | https://www.futabasha.co.jp/book/97845758481060000000?type=1 | https://www.cmoa.jp/title/150282/ / https://www.cmoa.jp/reader/sample/?title_id=150282&content_id=100001502820001 | Frozen original Futabasha ISBN `9784575848106`; current Cmoa/Kodansha vol1 is ISBN `9784065116838` and states the prior sold version has unchanged contents with only a renewed cover. This is a body-content bridge only; logos/pagination are not claimed identical. |
| 7 ドリフターズ | https://www.shonengahosha.co.jp/book_Info.php?id=6358 | https://www.cmoa.jp/title/40289/ / https://www.cmoa.jp/reader/sample/?title_id=40289&content_id=100000402890001 | Direct frozen original ISBN `9784785934071` vol1 match; no edition substitution or volume combining was needed. |
| 12 乱と灰色の世界 | https://store.kadokawa.co.jp/shop/g/g200908000223/ | https://www.cmoa.jp/title/136825/vol/1/ / https://www.cmoa.jp/reader/sample/?title_id=136825&content_id=100001368250001 | Direct KADOKAWA/HARTA COMIX vol1 ISBN `9784047261457` match; Cmoa and the KADOKAWA product agree on the frozen original. |

All four corrective rows use exact volume one only. No cross-volume combination or unbridged volume inference was introduced.

## Corrected eligibility

| Position / work | Eligible body pages | Distinct contexts | Static | Motion | State | Corrective result and limitation |
| ---: | ---: | ---: | --- | --- | --- | --- |
| 2 大東京トイボックス | 6 | 3: street/game-world opening; studio/monitor workplace; bedroom/home | ready | not attemptable | `sample-ready` | Removed rejected title-and-credits `reader-pos-02-p3`; added body `reader-pos-10-p10`. The remaster reproduction/tone ceiling remains and no exact resolved motion sequence was isolated. |
| 5 私の少年 | 6 | 3: first-meeting street/park; home/child care; work/office conversation | ready | not attemptable | `sample-ready` | Removed rejected chapter-opening `reader-pos-06-p7`; added body `reader-pos-11-p11`. The body-content bridge does not certify identical logos/pagination and no exact resolved motion sequence was isolated. |
| 7 ドリフターズ | 6 | 2: command dialogue; battlefield melee/retreat | ready | not attemptable | `sample-ready` | Removed rejected chapter-title `reader-pos-04-p5`; added body `reader-pos-10-p10`. Combat continues outside the selected refs, so no exact resolved motion sequence was isolated. |
| 12 乱と灰色の世界 | 6 | 1: bedroom/household magical-transformation | closed unknown | attemptable | `unknown-ready` | No genuinely separate second scene context was available in the finite official reader; title material and contents are excluded. The `reader-pos-04-p4` through `reader-pos-08-p8` run does expose exact start/development/impact/resolved motion, so `motionGateAttemptable=true` is retained. |

`sample-ready` is a static Art preflight state only; `unknown-ready` is a conservative static closure. No Art value is assigned by this corrective ledger.

## Selected page hashes

The following are SHA-256 values for the six selected readable body captures in the CSV. The removed splash refs do not appear in the corrected page lists.

| Work | Ref = SHA-256 |
| --- | --- |
| 大東京トイボックス | `reader-pos-04-p5=16500525d9b0f184b6cde9d204ba5339a679aaf4b73d276a679d17d185801ef7`; `reader-pos-06-p6=06ef1f35cba354c08665c0ac74f773a5497f3c9a8a699aea49a519ea9a6f09a5`; `reader-pos-06-p7=e73e2844b13844801ef26039f1cc1ec283e505bd3886f29706e9382e2dfb4256`; `reader-pos-08-p8=f9ae1fcecfd06ed81971453a01bbaeea669d219a17ec4d7be5829cb92515fc98`; `reader-pos-08-p9=785bc2a832adae4dd896c028aac85695b0fbc78e79254428aa06f88bd1386158`; `reader-pos-10-p10=ea68b6af6e03ff36b56f7dd4441f5747c1efbe1a7621eda6e2980f2520e58c8c` |
| 私の少年 | `reader-pos-04-p5=6957211dc9d2ae6fe011d6fbcc93e504720f59bb107b873e75261eb5866a39fa`; `reader-pos-06-p6=98d5509d85e2e64ab2121a5da3dc40a32bfd885ea6ed25e6d8d2d7bb9013e1a4`; `reader-pos-08-p8=7df294d47cb19b94dd0b8c3ef4b2f4fa0b8f236c59b8f35db931cb6d0e87a201`; `reader-pos-08-p9=56231526d7ef3b8ddc63f6931c7d5c539ba14a1c26078e2b1a265f9c84d93061`; `reader-pos-10-p10=14efabe767264d6e2902d35aca87e1c6212c7d6ccc54fd332034311313893a24`; `reader-pos-11-p11=a4ea3dd668590c621a6dba5d6c68b2edd6e736cb0853f7f6b01a5b4d08264e38` |
| ドリフターズ | `reader-pos-02-p3=efaa49377ffc673377c030514840da8634d565beaca7d771b2a078959c4baa98`; `reader-pos-04-p4=d2a56bbd0cb6aacea7a74cc1112cface07dbd9e47ebae64f9e429772766000c0`; `reader-pos-06-p6=92ce5367eaa3de07d849d380b5340097654fcdf068c9d200f288044f3e7c6596`; `reader-pos-06-p7=cbb4266e7ad124e1a9e05aada1585e88231c33ffca1d0bce2b5702ffad261435`; `reader-pos-08-p8=acc91be2ecd316c0e38423e0b4c8bca61f5c765d05c750695b9202e292ac148c`; `reader-pos-10-p10=ae49d322a4c01beb61760350c614cf2122ba7c133f6d735163d3f4b0d1ace059` |
| 乱と灰色の世界 | `reader-pos-02-p3=ac23dc168528c0f1da73800409da3990dac5889b29495ef3da0af878f9738f43`; `reader-pos-04-p4=25f16275d733d3e584a5ebc1e671d722c60ddd3dbef445f674c0ebe9bbfcb49e`; `reader-pos-04-p5=43fa1b1a498f5f581e93f21eeb6bdb6ee121aace857031e895ea845055dc5bc1`; `reader-pos-06-p6=6a4150d63f034d245dd59da15792ddee1fdb1f18032690c7cb59ab2b7899cc3f`; `reader-pos-06-p7=18975553f2697acf8b7c3e80bbd75a3d786140a34c3cc8d87758e5be8e3d85d1`; `reader-pos-08-p8=73b153970f2a138f0fa90b6b8c4cce8218f15254fcc4e8af12e30066ac1de262` |

## New capture verification

The three corrective pages were captured from the existing official licensed readers, recomputed with `sha256sum`, and inspected at original pixels:

| Position | Temporary capture | Original pixels | SHA-256 | Inspection result |
| ---: | --- | ---: | --- | --- |
| 2 | `/tmp/konocomics-batch003-art-recovery-b/cmoa-190848/live-content-p10.png` | 1364 x 1937 | `ea68b6af6e03ff36b56f7dd4441f5747c1efbe1a7621eda6e2980f2520e58c8c` | Body panels only: bedroom/home interaction; no title or contents material. |
| 5 | `/tmp/konocomics-batch003-art-recovery-b/cmoa-150282/live-content-p11.png` | 706 x 1000 | `a4ea3dd668590c621a6dba5d6c68b2edd6e736cb0853f7f6b01a5b4d08264e38` | Body panels only: office conversation; printed folio 9; no title or contents material. |
| 7 | `/tmp/konocomics-batch003-art-recovery-b/cmoa-40289/live-content-p10.png` | 1373 x 1937 | `ae49d322a4c01beb61760350c614cf2122ba7c133f6d735163d3f4b0d1ace059` | Body panels only: battlefield/soldier action; no chapter-title material. |

## Motion gate

Positions 2, 5, and 7 retain `motionGateAttemptable=false`: the eligible selected refs do not expose an exact continuous start-development-impact-resolved endpoint. Position 12 is the exception required by the verification: the contiguous `reader-pos-04-p4` through `reader-pos-08-p8` pixels show the bounded magical-transformation sequence through impact/landing and the resolved resting state, so `motionGateAttemptable=true`. This does not reopen static eligibility: position 12 remains `unknown-ready` because the finite route has only one genuine scene context. No motion or Art value is assigned.

This is the end of the bounded corrective route. No source, promotion, or Art values were changed.
