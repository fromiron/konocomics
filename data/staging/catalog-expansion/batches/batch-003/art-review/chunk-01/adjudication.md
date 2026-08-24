# Batch 003 Art adjudication chunk 01

- adjudicationDate: 2026-08-23
- adjudicator: Primary Local Codex Pass C
- reviewedByHuman: false
- scope: exact official entry-edition samples in chunk-01 preflight
- method: per-axis Factor Dictionary and pixel adjudication; no averaging or majority vote
- temporaryImageRoot: `/tmp/batch003-art-preflight-chunk01.MFt2Ak`
- temporaryImagesCommitted: false
- hardBlockers: 0

## Counted inputs

| Input                   | Identity or SHA-256                                                | Result                                                        |
| ----------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| Preflight CSV           | `119e2ecfc831dacc1735421e8b27fa4aae6445774c515967ef1eb1aef5ab8c39` | six sample-ready and four terminal unknown-ready works        |
| Local Art CSV           | `b5881c8a61bb9943485f5e58b3c77db7df948d3f6d237fa3a4ff571844fc3604` | 40 rows; all 18 selected image hashes matched                 |
| Local report            | `4109051ead7ef7159866480694ca3543e640a959d73fd80d231b9a02a253eb55` | completed without Gemini conclusions                          |
| Gemini request          | `b5e7bd32021f07e26dc4907d9fb4ac68aaf2daae5f3998b4c67066158f40db0f` | exact independent frozen input                                |
| Gemini response         | `5be24e80dfe01a7ac30c43294e0fc47fd6458f26c7b9069b41ce958e645813b4` | `5b769dc8-cd4a-48bd-ad4d-c790120328f7`, SUCCESS, 18/18 hashes |
| Gemini execution ledger | `4f86324e33cd1b627d9805b730b8e35c034960b52d4f081b58ab4ea55aef5e58` | three abnormal attempts excluded                              |
| Adjudicated Art CSV     | `5317de2cc65ab9ffd1b2c1203367159e0259f7ce6433474f31104a7ad523d53a` | exact 10×4 terminal matrix                                    |

The counted Gemini run resolved exact model `gemini-3.7-flash-high`, label
`Gemini 3.7 Flash (High)`, effort `high`, opened all selected pixels, matched
all frozen input and image hashes, returned every required cell, and ended
with outer `SUCCESS` and no error. Complete-looking bodies from the three
abnormal attempts are not counted.

Muse was not used because the Local plus Gemini minimum quorum completed.
Cursor Grok is `ART_ABSTAIN`: no Grok pixel-access proof was requested or
obtained.

## Per-work decision

Vectors are `artRealism / artDensity / visualSoftness / motionImpact`; `U` is
terminal `unknown`, never a low value.

| Work                       | Local     | Gemini    | Final     | Dictionary and pixel decision                                                                                                                  |
| -------------------------- | --------- | --------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 【推しの子】               | `2/3/3/U` | `2/2/3/U` | `2/2/3/U` | Detailed night and forest panels alternate with open dialogue and broad black or white fields, so density matches balanced anchor 2.           |
| 大東京トイボックス         | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | The frozen edition has no qualifying official internal pages; all four axes close unknown without a blocker.                                   |
| デトロイト・メタル・シティ | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | Official search exposed no internal reader for the frozen edition; all four axes close unknown without a blocker.                              |
| COSMOS                     | `3/3/2/4` | `2/2/2/3` | `2/2/2/3` | Standard stylized faces and mixed open panels keep realism and density at 2; p065–p066 is strongly kinetic but lies below sustained extreme 4. |
| 私の少年                   | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | The exact official product exposes no qualifying internal preview; all axes close unknown without a blocker.                                   |
| 超巡！超条先輩             | `1/3/2/U` | `2/2/2/U` | `1/3/2/U` | Recurrent chibi deformation keeps realism between 0 and 2; layered panels, effects, figures, and backgrounds place density between 2 and 4.    |
| ドリフターズ               | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | The official product page provides synopsis and cover only; all axes close unknown without a blocker.                                          |
| からかい上手の高木さん     | `1/2/3/U` | `2/1/2/U` | `1/1/3/U` | Simplified faces, broad white fields, sparse tones, and rounded linework support intermediate realism 1, density 1, and softness 3.            |
| 多聞くん今どっち!?         | `2/4/3/U` | `2/3/4/U` | `2/3/3/U` | Ornament and typography exceed balance but open fields prevent density 4; bold gag rendering prevents softness 4 across the complete sample.   |
| だがしかし                 | `2/3/2/U` | `2/2/2/U` | `2/2/2/U` | Detailed snacks and store fixtures are balanced by open character panels and broad unrendered areas, so density remains anchor 2.              |

## Motion and endpoint resolution

Only COSMOS has one exact continuous official sequence with a preserved start,
development, impact, and endpoint. Its p065–p066 spread uses strong direction
and speed lines but does not sustain the maximal force and visual intensity of
anchor 4, so the terminal value is 3. Every other motion cell closes
`unknown`; an isolated pose, gag effect, or access failure is not converted to
a low score.

No final value is 0 or 4. The apparent extrema proposed by one reviewer were
reopened against every selected context and reduced because they were not
sustained across the complete sample. Seven Local cells changed after
adjudication. No value was averaged, no Art unknown became a blocker, and no
temporary image, source row, generated artifact, or Gold value was changed.
