# Batch 002 Art adjudication chunk 05

- adjudicationDate: 2026-08-23
- adjudicator: Primary Local Codex Pass C
- reviewedByHuman: false
- scope: the exact official entry-edition samples in chunk-05 preflight
- method: per-axis Factor Dictionary adjudication; no averaging or majority vote
- temporaryImageRoot: `/tmp/batch002-art-preflight-chunk05.aOTBj4`
- temporaryImagesCommitted: false
- hardBlockers: 0

## Counted inputs

| Input                    | Identity or SHA-256                                                | Result                                                                               |
| ------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Preflight CSV            | `24f97e6b79806d66a9a3051f7ab0cd65bba47d70b944deac3d863da1f5cae480` | eight static sample gates; two works terminal unknown-ready                          |
| Preflight ledger         | `a39b7228bac7ffe30b0a81c89eac2bb68dec558a8fc4726d5a81d1f6fee1189e` | 24 temporary captures; repository images remain zero                                 |
| Local Art CSV            | `9f38f8071ba570b9ed4c8aca839cf3d3f20a4e6610de95bbc5f949c54f3a138c` | 40 rows; all 24 selected image hashes matched                                        |
| Local report             | `86f6558573314730017e6006ab8ec47b2474dde792b2aa293fa383b6a1cb74a0` | completed before Gemini conclusions were read                                        |
| Gemini group 01 request  | `fa9d548df6ca378cad219b94836c14d23b508c38366a56d70dfc0361cabb4f0d` | exact independent input                                                              |
| Gemini group 01 response | `a19e52bc5757cfbd9671e5dbde3b08a284284b5b453fafb1b1d192111fdff1d1` | `89296e77-8e9a-49c6-bb42-d0b4605a925a`, SUCCESS, 9/9 hashes after syntax-only repair |
| Gemini group 02 request  | `2be3d67e059aa7b00b4689b216357f3d7ceb7ee96742f940d75d7131a8d3038c` | exact independent input                                                              |
| Gemini group 02 response | `66a6f018f974dc19eb56b5fede0679ac9b442c616e7f8d9608e7d305c2e97a37` | `b5c86717-76f9-4464-b0a5-7089767d783c`, SUCCESS, 9/9 hashes                          |
| Gemini group 03 request  | `182d413f4ac8e7fbfc79d21c3ffaf86e3e5a0ac6d5796b2e995afaa1a8e98413` | exact independent input                                                              |
| Gemini group 03 response | `3b6e917146cadb7e9ea108e2706f33bc1e9aa2050d888c3a73ae15514359f299` | `3569964a-5b2a-4faa-a684-0cd7b0a4712d`, SUCCESS, 6/6 hashes                          |
| Adjudicated Art CSV      | `14d70a187e616f264fb6444e93b9447954e0d286e6bfb513ef44e5fb867759ee` | exact 10x4 terminal matrix; 26 known and 14 unknown                                  |

All counted Gemini payloads identify exact model `gemini-3.7-flash-high`,
resolved label `Gemini 3.7 Flash (High)`, effort `high`,
`completionStatus=completed`, full pixel access, no issue, no hard blocker, and
`reviewedByHuman=false`. Their 24 returned image hashes match the preflight
bytes. Group 01 initially emitted invalid nested JSON; the execution ledger
records both malformed transports and the same-conversation syntax-only repair.
No value, ref, hash, observation, or limitation changed during that repair.

Muse was not invoked because the required Local plus Gemini quorum completed.
Cursor Grok is `ART_ABSTAIN` because no Grok pixel-access proof was requested or
obtained.

## Per-work decision

Vectors are `artRealism / artDensity / visualSoftness / motionImpact`; `U` is
terminal `unknown`, never a low value.

| Work                   | Local     | Counted Gemini | Final     | Dictionary and pixel decision                                                                                                                                                                                     |
| ---------------------- | --------- | -------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| サンキューピッチ       | `3/3/1/4` | `2/2/2/4`      | `3/3/1/4` | Grounded athletic anatomy and perspective exceed ordinary stylization; recurring equipment, furniture, and action effects exceed balanced density; hard contours and dry force marks keep softness below neutral. |
| うさぎドロップ         | `2/2/3/U` | `2/1/2/U`      | `2/1/2/U` | Natural proportions support realism 2, while broad white fields and selective backgrounds keep density below 2; clean lines are offset by pointed and graphic forms at neutral softness.                          |
| 水は海に向かって流れる | `2/2/3/U` | `1/2/3/U`      | `1/2/3/U` | Grounded spaces do not erase the persistent simplified facial and figure construction, which remains between deformation 0 and ordinary stylization 2.                                                            |
| 凪のお暇               | `2/2/3/U` | `2/2/2/U`      | `2/2/2/U` | Fine contours coexist with flat blacks, abrupt caricature, and angular reactions, so the complete sample is neutral rather than consistently soft.                                                                |
| 逃げ上手の若君         | `2/4/1/U` | `2/3/1/U`      | `2/3/1/U` | Armor, pattern, hatching, and effects exceed balanced density, but open reaction panels prevent sustained high-density anchor 4.                                                                                  |
| タコピーの原罪         | `1/2/2/U` | `1/2/1/U`      | `1/2/1/U` | Scratch hatching, hard black fields, rough animal rendering, and distressed close-ups dominate the rounded forms and keep softness below neutral.                                                                 |
| 闇のパープル・アイ     | `2/1/3/U` | `2/2/4/U`      | `2/2/4/U` | Repeated inset panels, settings, clothing, and effects balance the white fields at density 2; delicate polished linework recurs across all contexts and reaches softness 4.                                       |
| YAIBA                  | `0/2/1/4` | `0/2/0/4`      | `0/2/1/4` | Strong deformation and motion 4 agree; thick angular lines are hard but clean and consistently lie between rough anchor 0 and neutral anchor 2.                                                                   |
| 夢の碑                 | `U/U/U/U` | not reviewed   | `U/U/U/U` | The official current collection is not bridged to the frozen Petit Flower Comics edition; no pixels were admitted and all Art axes close unknown.                                                                 |
| おそ松くん             | `U/U/U/U` | not reviewed   | `U/U/U/U` | The exact official product exposes no internal reader; all Art axes close unknown without a blocker.                                                                                                              |

## Motion and extrema resolution

Only サンキューピッチ `p010-p011` and YAIBA `p036-p037` preserve exact
bounded action sequences and close `motionImpact=known 4`. All other motion
rows close `unknown`: selected pages contain gestures or isolated events but no
declared start, development or impact, and endpoint sequence. The two unreadable
works cannot reach the motion gate. Unknown is not restrained motion and is not
a promotion blocker.

The primary adjudicator reopened all 24 selected pixels, including every
conflict and final extreme. Final extremes are realism 0 and motion 4 for YAIBA,
motion 4 for サンキューピッチ, and softness 4 for 闇のパープル・アイ.
Each is supported by the repeated or bounded evidence named above. No value was
averaged, no temporary image entered the repository, and no Art unknown became
a blocker.
