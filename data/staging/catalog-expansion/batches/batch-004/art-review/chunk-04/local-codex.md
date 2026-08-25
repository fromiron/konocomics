# Batch 004 Art Pass — chunk 04 — Local Codex

- reviewDate: `2026-08-25`
- reviewer: Local Codex independent pixel review
- reviewedByHuman: `false`
- scope: frozen positions 31–40; Factor Dictionary Art axes only
- Gemini / other Art conclusions: not consulted
- Muse: `NOT_USED`
- Grok: `ART_ABSTAIN`
- promotion: not performed
- adjudication: not performed
- image root: `/tmp/konocomics-batch004-art-chunk04`
- repository image mutation: none

## Input bindings

| Input | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `art-preflight/chunk-04/preflight.csv` | `f0574f648a2318121bf7750e7151cb0000d3928a09657273991bf2d1309ed765` |
| `art-preflight/chunk-04/ledger.md` | `dc427da1b1f95602fa5ccfc91d9a842d0faf740907a00843e9ffabbce9a542f0` |
| `reviews/daybreak-art-preflight-qa-chunk-04.md` | `1665ba7016a6a3fab2d835636fcd77e1330af712010afc837671e8941478b995` |

The PASSed preflight fixes positions 31–40 exactly. Position 31 is the only `sample-ready` work. Positions 32–40 remain terminal `unknown-ready`; no pixel value was inferred from their covers product pages one-page samples or failed viewers.

## Original-pixel proof and hash verification

All six selected position 31 files were reopened at original pixel detail. Recomputed SHA-256 matched the preflight record `6/6`; no selected file was missing or mismatched. The three retained below-threshold pages for positions 35 37 and 40 were also rehashed. The complete preflight hash result is `9/9 matched / 0 missing / 0 mismatched`.

| Ref | Exact temporary file | Dimensions | Recomputed SHA-256 | Context / eligibility |
| --- | --- | ---: | --- | --- |
| `reader-step-6` | `jashin-reader-step-6-active.png` | 507×720 | `ed0320975c2d2a6727c9b40ffef0eaedbe1e2ef440d6b0ee630c919ba5b583b3` | bakery and household body page |
| `reader-step-8` | `jashin-reader-step-8-active.png` | 507×720 | `aeefe29218d852e60fdf0c43e78f39d4c5f6dd4f5de7aa9aafce83acd69cecd5` | bakery and household body page |
| `reader-step-10` | `jashin-reader-step-10-active.png` | 507×720 | `8c87b5fbd023e7c821078172ffc2a3c4d3975d1daa5f451f9896f67fcbbb69e1` | outdoor market and flower-stall body page |
| `reader-step-12` | `jashin-reader-step-12-active.png` | 507×720 | `fcdd9ba008b2ad2f6f68038ea38e5fe9d262f8f4d447e70bbe835d15c20b381a` | outdoor market and flower-stall body page |
| `reader-step-14` | `jashin-reader-step-14-active.png` | 507×720 | `eef7b2f37f5506f860b2a0831e639925476c6ae019b4dd2b7aa924a762286fa7` | city-history and wall-tableau body page |
| `reader-step-15` | `jashin-reader-step-15-active.png` | 509×720 | `cd7b3b166c940c8d28bb096ee28d9f9314216cbff0c8c78a6770e7b50672298e` | outdoor market continuation body page |

The six files are readable internal story pages rather than covers contents ads animation or duplicated viewer shells. They span three genuinely distinct contexts.

| Below-threshold work / ref | Exact temporary file | Recomputed SHA-256 | Gate disposition |
| --- | --- | --- | --- |
| position 35 / `reader-p5` | `digit-reader-p5.png` | `405724e5956552c04ea208fe9a1405508b36a92966962ee8ff9692391306901f` | one page and one context; all Art axes unknown |
| position 37 / `episode-01-page-00` | `raise-days-canvas-0.png` | `de4a459e2e52edbcb57c034ac72da76efc727a2c39bb9093fb1efcf0f526d4be` | one page and one context; all Art axes unknown |
| position 40 / `reader-p5` | `cuckoo-p5-full.png` | `e247a15b86db560c981b7c6498db40771cc807f475fca87c1d52c7c5102815da` | one page and one context; all Art axes unknown |

## Position 31 Art decision

The Factor Dictionary `0 / 2 / 4` anchors were applied before considering intermediate values. No extreme value was used unless every reviewed context supported it.

| Axis | State / value | Confidence | Pixel-grounded decision |
| --- | --- | ---: | --- |
| `artRealism` | known `1` | 0.91 | The heroine and animal use strong chibi simplification while the tall customer has elongated but still stylized proportions and minimal facial construction. This falls between strong deformation `0` and general styling `2`; the more proportionate figure prevents an all-context `0`. |
| `artDensity` | known `1` | 0.89 | Bakery masonry props market stalls fortifications and the statue provide some setting information but close-ups and dialogue panels preserve large blank areas and light texture. This lies between sparse `0` and balanced `2`. |
| `visualSoftness` | known `3` | 0.90 | Rounded heroine and animal contours clean lines curved hair and light screentone dominate. Angular customer features the statue and architecture prevent an all-context `4`; the packet falls between neutral `2` and soft `4`. |
| `motionImpact` | unknown | — | Preflight fixed `motionGateAttemptable=false`. No exact continuous start-development-impact-resolved sequence exists in the packet; unknown is not a low value. |

## Positions 32–40 terminal states

| Pos | Work | Art terminal vector | Basis |
| --: | --- | --- | --- |
| 32 | `work-961a49798df191311f42` — 働かないふたり | `U / U / U / U` | official product only; no work-specific internal trial |
| 33 | `work-9bd00739b995d84e2494` — あした死ぬには、 | `U / U / U / U` | unregistered product-linked reader excluded |
| 34 | `work-a3d922576a1a1ecc8e3e` — ドカ食いダイスキ！ もちづきさん | `U / U / U / U` | unregistered product-linked reader excluded |
| 35 | `work-aa85b65d02f367e76a07` — ディグイット | `U / U / U / U` | one readable page and one context; static and motion gates fail |
| 36 | `work-af3443bab1c30d470a76` — 坂本ですが? | `U / U / U / U` | exact product-linked viewer timed out; no retained pixels |
| 37 | `work-bd5c323a3dbc9f3a04d4` — 来世は他人がいい | `U / U / U / U` | one readable page and one context; static and motion gates fail |
| 38 | `work-c2df32661c0b925ff74f` — カラオケ行こ！ | `U / U / U / U` | exact product-linked viewer timed out; no retained pixels |
| 39 | `work-c2f3864045578cebb590` — となりの猫と恋知らず | `U / U / U / U` | no product-linked entry-chapter bridge |
| 40 | `work-c5c2695ad33fd05af945` — カッコウの許嫁 | `U / U / U / U` | one readable page and one context; static and motion gates fail |

## Output accounting

- `local-art.csv`: 40 terminal rows = 3 known + 37 unknown.
- `local-art.csv` SHA-256: `d8b8cd4f402d6d6391e52d5b3ff5ffcd7c297a1ce066b34fbb5fcd221e90fe85`.
- Known values occur only for position 31 static Art axes.
- `motionImpact` is unknown for every scoped work.
- No `notApplicable` state was inferred from missing pixels.
- No Art value came from a cover contents page ad animation synopsis product copy or user review.
- This Local pass is a proposal for later quorum review only. It performs no promotion or adjudication.
