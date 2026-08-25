# Batch 004 Art Pass — chunk 03 — Local Codex

- reviewDate: `2026-08-25`
- reviewer: Local Codex independent pixel review
- reviewedByHuman: `false`
- scope: frozen positions 21–30; Factor Dictionary Art axes only
- Gemini / Grok / other Art conclusions: not consulted
- Muse: `NOT_USED`
- promotion: not performed
- adjudication: not performed
- image root: `/tmp/konocomics-batch004-art-chunk03`
- repository image mutation: none

## Input bindings

| Input | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `art-preflight/chunk-03/preflight.csv` | `cfea3c57b84331d9255dabf652aef7c2b9ef48031d2db31e64b5aaca569a7eee` |
| `art-preflight/chunk-03/ledger.md` | `5aba86caccc6d9c114a8709d3b9f67899ab077ae7e0591be87864a8c0172b6de` |

The frozen positions and preflight rows match exactly. Strict parsing confirms 17 columns on every row. CSV and ledger contain the same 58 unique selected hashes; all 58 hashes recomputed from the temporary image root match. Seven works are `sample-ready`; positions 21 22 and 27 are `unknown-ready` and cannot receive static values.

## Pixel boundary

All 42 selected pages for the seven `sample-ready` works were opened independently with original-detail inspection. They are readable internal body pages spanning at least two distinct contexts. Cover frontispiece standalone title or chapter-opening splash contents advertising animation synopsis and user opinion were excluded. The 16 retained pages for positions 21 22 and 27 were used only to confirm the finite-failure boundary and not to infer static Art values.

The numeric decisions apply the Factor Dictionary `0 / 2 / 4` anchors first. Intermediate values are used only where the sample lies between anchors. An extreme value is used only when every reviewed context supports it.

## Local Codex Art decisions

Vector order is `artRealism / artDensity / visualSoftness / motionImpact`. `U` means `unknown` and is not a low score.

| Pos | Work | Art terminal vector | Pixel-grounded basis |
| --: | --- | --- | --- |
| 21 | アンデッドアンラック | `U / U / U / U` | Six readable pages remain one railway encounter/action context; the static two-context gate and exact motion-sequence gate fail. |
| 22 | 俺物語！！ | `U / U / U / U` | Five genuine body pages remain after the opening/title splash exclusion; the six-page static gate and exact motion-sequence gate fail. |
| 23 | お茶にごす。 | `2 / 2 / 1 / U` | Proportionate students and school/street space remain generally stylized; detail is balanced; angular faces hard blacks and sharp comic expressions lean rough. |
| 24 | 黒月のイェルクナハト | `2 / 3 / 1 / U` | Idealized supernatural anatomy offsets coherent spaces; architecture hatching and effects are dense; hard angular and scratchy action rendering dominates. |
| 25 | ルックバック | `3 / 2 / 3 / U` | Grounded children adults and school rooms retain limited simplification; detail is balanced; fine rounded polished quiet rendering leans soft. |
| 26 | 夢中さ、きみに。 | `4 / 2 / 3 / U` | Realistic adult proportion and observed four-setting geometry persist throughout; density is balanced; controlled elegant faces and restrained tones lean soft. |
| 27 | 異世界おじさん | `U / U / U / U` | Five genuine body pages remain after chapter-opening exclusion; the six-page static gate and exact motion-sequence gate fail. |
| 28 | 思い、思われ、ふり、ふられ | `2 / 1 / 4 / U` | Large-eyed shoujo construction keeps realism stylized; broad white fields keep density sparse; delicate pale rounded treatment is uniformly soft. |
| 29 | 式の前日 | `3 / 3 / 2 / U` | Grounded adults and domestic space lean realistic; layered hatching and grain are dense; elegant contours and scratchy texture balance to neutral softness. |
| 30 | さんすくみ | `2 / 3 / 2 / U` | Coherent shrine staging coexists with elastic expressions; architecture foliage garments and effects are dense; polished and hard-angular treatment is mixed. |

## Motion boundary

Every preflight row has `motionGateAttemptable=false`. Some sampled pages contain movement or isolated impact imagery but no work supplies exact refs for one continuous start-development-impact-resolved sequence. Therefore all ten `motionImpact` rows are `unknown` with blank value and confidence. None is inferred as numeric or changed to `notApplicable` because the bounded packet stopped.

## Output accounting

- `local-art.csv` schema: exactly `workId,axisId,state,value,confidence,refs,observation,limitation`
- works: `10`
- axes per work: `4`
- data rows: `40` plus one header
- known static rows: `21`
- unknown static rows: `9`
- unknown motion rows: `10`
- `local-art.csv` SHA-256: `55393bedc2eef873583bd21b628be6b6ada3e92d3d78d0d791aae1dc5e3e93e3`
- reviewedByHuman: `false`
- Art promotion or adjudication: none
