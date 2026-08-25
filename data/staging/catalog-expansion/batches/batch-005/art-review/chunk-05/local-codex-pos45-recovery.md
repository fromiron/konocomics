# Batch 005 Art recovery — position 45 — Local Codex

- reviewDate: `2026-08-25`
- reviewer: Local Codex independent original-pixel review
- reviewedByHuman: `false`
- scope: frozen Batch 005 position `45`, `work-e658d3aee2e33c17aa38`, `スピリットサークル`
- Factor Dictionary scope: static Art axes only
- other model Art conclusions consulted: `false`
- promotion performed: `false`
- final-Art/source/generated data edited: `false`
- temporary images committed: `false`
- canonical uncompressed image root: `/tmp/konocomics-spirit45-recovery-v2`

## Decision rule

The static values use only the current Factor Dictionary `0 / 2 / 4` anchors, with intermediate values reserved for a sustained between-anchor result. The review uses only the six authorized readable standard-volume-2 BODY pages `reader-v2-p006` through `reader-v2-p011`. No cover, synopsis, animation frame, genre, user opinion, memory of the work, or another model's Art value supplied a decision. `motionImpact` remains `unknown` because the independently verified motion gate is false.

## Identity and edition binding

The frozen work set identifies position 45 as `work-e658d3aee2e33c17aa38`, title `スピリットサークル`, creator `水上悟志`, publisher `少年画報社`, and representative standard-volume-1 ISBN `9784785939830`. The publisher's official products bind standard volumes 1–3 to the same title and creator. The selected BOOK☆WALKER trial CID `10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df` is product-linked to standard volume 2, ISBN `9784785950972`, within the required entry range.

| Binding                       | SHA-256                                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| Factor Dictionary             | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| frozen work set               | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| corrected recovery preflight  | `3231c03511f68373204addd118e1a89c6f8bc1253ea829f2336ae066f29e4fd7` |
| corrected recovery ledger     | `9f2a0f9e7e37a50d9142ea89581d76ceb8cc8b2258d8b37aeb9d3762674ae31f` |
| independent preflight QA read | `c512c93a55e974a78737788554f206aeb66deb9ed8b4e9c5ac22ff5debd3728b` |
| selected six-file set         | `17d9246b0ea04ecd2af200225ca0f20de318f906f3006bf644ccacc30bdccead` |

Official references:

- volume 1 product: https://www.shonengahosha.co.jp/book_Info.php?id=7155
- volume 2 product: https://www.shonengahosha.co.jp/book_Info.php?id=7156
- volume 3 product: https://www.shonengahosha.co.jp/book_Info.php?id=7157
- product-linked volume 2 trial: https://bookwalker.jp/de10e1d3b7-8ffe-4faf-bb14-e5ea8a6d18df/?sample=1
- retrieval and review date: `2026-08-25`

## Per-image original-pixel access proof

All six selected JPEGs were opened directly at original detail. Each is a valid `853 × 1200` JPEG, and every hash recomputed exactly against the corrected recovery preflight and independent QA.

| Page             | SHA-256                                                            | Direct pixel observation                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reader-v2-p006` | `54ea32927502dd995b0952d77a64e726f3f03441f84e8f2927cb85677bacd9ad` | Colour fantasy/travel-memory page: exaggerated female figure and simplified boy portrait lead into a distant two-figure landscape with painterly mountains.                |
| `reader-v2-p007` | `6e572900e5e33c863c26e2f87b5d574f2b38b41e5c7a7f48c4af0108903b41a4` | School corridor interaction: stylized student and fantasy-character bodies, caricatured adult faces, flat uniform blacks, and one perspective-grounded corridor panel.     |
| `reader-v2-p008` | `65a6e3949dd6e08d4b724497b0673d96f3f1acbcd29a890213eac7752dfe938c` | Walking and dialogue beats use broad white fields and simplified reactions; the lower corridor and school exterior provide controlled linear perspective and architecture. |
| `reader-v2-p009` | `39dd198ac1d80541b03abd9faa1f01c94a070532b0cad4f913e3f7a6722dcfc4` | Classroom interaction combines idealized bodies and enlarged eyes with desks, chairs, floor lines, clothing tone, and an overhead spatial panel.                           |
| `reader-v2-p010` | `0d37650396712882c4147ef87c7334fc4cbd244c09a981b94d33a771fef26dd5` | Large smooth portrait and reaction close-up dominate; simplified faces, hard black hair, sparse classroom cues, and firm contours keep rendering controlled but open.      |
| `reader-v2-p011` | `e2b97fdebf7d8b483136615e770e87470bc437f14153e0b62d85b58811c23ed4` | Classroom discussion uses rounded faces, spiky hair, flat black uniforms, light screentone, sparse furniture, and repeated unrendered backgrounds.                         |

## Local result

| Axis             | State   | Value | Confidence | Anchor rationale                                                                                                                                                                                                                                |
| ---------------- | ------- | ----: | ---------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artRealism`     | known   |     1 |       0.88 | Coherent bodies and school spaces remain strongly simplified through enlarged eyes, flat facial planes, idealized proportions, and caricatured reactions. The repeated result falls between strong simplification 0 and ordinary stylization 2. |
| `artDensity`     | known   |     1 |       0.89 | Architecture and furniture recur, but large white fields, omitted backgrounds, flat blacks, and sparse portrait panels dominate. This is above uniformly simple 0 but below balanced 2.                                                         |
| `visualSoftness` | known   |     2 |       0.86 | Rounded faces, smooth curves, and gentle tone are consistently offset by spiky hair, hard blacks, angular reactions, and firm geometry, supporting the neutral anchor.                                                                          |
| `motionImpact`   | unknown |     — |          — | The selected pages contain isolated gestures and walking but no exact start-development-impact-resolved sequence. The false motion gate is preserved.                                                                                           |

This output is a Local proposal for independent Gemini review and adjudication. It does not alter the existing terminal Art row or promotion state.
