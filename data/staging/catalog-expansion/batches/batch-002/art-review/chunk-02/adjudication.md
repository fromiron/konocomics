# Batch 002 Art adjudication chunk 02

- adjudicationDate: 2026-08-23
- adjudicator: Primary Local Codex Pass C
- reviewedByHuman: false
- scope: the exact official entry-edition samples in chunk-02 preflight
- method: per-axis Factor Dictionary adjudication; no averaging or majority vote
- temporaryImageRoot: `/tmp/batch002-art-preflight-chunk02.polhkX`
- temporaryImagesCommitted: false
- hardBlockers: 0

## Counted inputs

| Input                    | Identity or SHA-256                                                | Result                                                      |
| ------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| Preflight CSV            | `56e6a1d4bc74e0e074cdaec6973a54b2fe49697dc2cbdbfeae4f1d812de2bdf1` | nine static sample gates, `orange` unknown-ready            |
| Local Art CSV            | `325546ed0eb62212c250f0c2cb234921eadfd6fe1619be9b46b47493ec188718` | 40 rows; all 30 selected image hashes matched               |
| Local report             | `60dc36829ecf687905c41c2c1b9a6a0f28dcfb605208b2f6185c83d5e1815819` | completed before Gemini conclusions were read               |
| Gemini group 01 request  | `4179fe972e088dd2fe683e73e7a6af1c176b012035d2035e4edc0aae0a48d91b` | exact independent input                                     |
| Gemini group 01 response | `46aa1a89caa60bb50da7898b4734bcf6a0675d41977f48f6c1d3b5fa3b8cfe3e` | `b6b4286d-3870-45bf-a314-41936c1500b5`, SUCCESS, 9/9 hashes |
| Gemini group 02 request  | `f80a14abad09afd918a527ce28f36ac6130d477434234887e780cabfd213d8a8` | exact independent input                                     |
| Gemini group 02 response | `ceea08c731ef08ba8a5799116bdf02cd225155e740bfe628f67f7d79fb7d1edb` | `799d7ede-9b27-4ef5-936c-73553bea4ea7`, SUCCESS, 9/9 hashes |
| Gemini group 03 request  | `ad23b2c0be7040b74d91c346b50e94584e85d0c76ea0240bd4055d94e650d157` | exact independent input                                     |
| Gemini group 03 response | `75161a2ec3351447cb32ad56de3b16eb8f864aa9d165c1c0cf375a3e3f910616` | `6923e86e-e5ff-41eb-9dfb-e6a367885069`, SUCCESS, 9/9 hashes |
| Adjudicated Art CSV      | `0dd052932e6a7995d205e17e6d1b495827677243fef4014f4c2766e8b4421a37` | exact 10×4 terminal matrix                                  |

All three counted Gemini responses report exact model
`gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash (High)`, effort
`high`, `completionStatus=completed`, full pixel access, no issue, no hard
blocker, and `reviewedByHuman=false`. Their 27 returned image hashes all match
the preflight bytes. The execution ledger records and excludes every path,
permission, and abnormal-termination attempt; none contributes a verdict.

Muse was not invoked because the required Local plus Gemini quorum completed.
Cursor Grok is `ART_ABSTAIN` because no Grok pixel-access proof was requested or
obtained.

## Per-work decision

Vectors are `artRealism / artDensity / visualSoftness / motionImpact`; `U` is
terminal `unknown`, never a low value.

| Work             | Local     | Counted Gemini | Final     | Dictionary and pixel decision                                                                                                                |
| ---------------- | --------- | -------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 外天楼           | `2/2/2/U` | `2/2/2/U`      | `2/2/2/U` | Quorum agreement; no bounded motion sequence.                                                                                                |
| 忍者と極道       | `3/4/0/U` | `2/4/0/U`      | `3/4/0/U` | Grounded adult anatomy and spatial perspective exceed ordinary stylization, while extreme expressions keep realism below 4.                  |
| 嘘解きレトリック | `2/3/4/U` | `2/2/4/U`      | `2/3/4/U` | Period streets, food, interiors, patterned clothing, and compact panels repeatedly place density between balanced 2 and high 4.              |
| orange           | `U/U/U/U` | not reviewed   | `U/U/U/U` | The preview edition lacks an official bridge to the frozen representative edition; all four axes close unknown without a blocker.            |
| 正反対な君と僕   | `1/1/4/U` | `1/1/3/U`      | `1/1/4/U` | Rounded figures, smooth contours, light rendering, and polished faces recur across all three contexts and meet soft anchor 4.                |
| 墨攻             | `3/4/0/U` | `4/4/0/U`      | `4/4/0/U` | Anatomy, musculature, armor, terrain, fortress structure, and stable perspective repeatedly meet realistic anchor 4 despite caricature.      |
| がんばれ元気     | `2/3/1/U` | `2/2/2/U`      | `2/3/1/U` | Layered figures, detailed station and field settings, and motion lines exceed density 2; dry angular action ink places softness between 0–2. |
| 赤髪の白雪姫     | `2/2/4/U` | `2/2/4/U`      | `2/2/4/U` | Quorum agreement; the sword draw is an isolated beat rather than a complete sequence.                                                        |
| 人形芝居         | `2/1/4/U` | `2/1/3/U`      | `2/1/3/U` | Delicate controlled contours lean polished, but firm comic marks and angular adult forms keep the complete sample below extreme softness 4.  |
| 魔法使いの嫁     | `2/3/2/U` | `2/3/3/U`      | `2/3/3/U` | Flowing organic forms lean polished, while coarse texture, skull edges, and deep black fields keep the sample between neutral 2 and soft 4.  |

## Motion resolution

None of the nine sample-ready works supplies one exact continuous sequence with
a preserved start, development or impact, and endpoint. `orange` also fails the
edition prerequisite. All ten `motionImpact` axes therefore close terminal
`unknown`; no isolated impact, gunshot, fall, running pose, or sword draw is
treated as a low score or a qualified sequence.

The adjudicated CSV changes three Local static rows after inspecting the exact
pixels: `墨攻.artRealism`, `人形芝居.visualSoftness`, and
`魔法使いの嫁.visualSoftness`. No value is averaged. No Art unknown becomes a
blocker, no source or Gold row is changed, and no temporary image is copied into
the repository.
