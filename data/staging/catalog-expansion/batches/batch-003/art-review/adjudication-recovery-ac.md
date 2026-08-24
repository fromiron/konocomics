# Batch 003 Art recovery A/C adjudication

- adjudicationDate: `2026-08-25`
- adjudicator: `local-codex-primary`
- reviewedByHuman: `false`
- scope: frozen positions 41, 47, 48, and 50
- method: dictionary-anchored adjudication of accepted official internal-page samples; no voting or averaging
- Muse: `NOT_USED`
- Cursor Grok: `ART_ABSTAIN` because pixel access was not established

## Bound inputs

| Artifact                         | SHA-256                                                            |
| -------------------------------- | ------------------------------------------------------------------ |
| Recovery A preflight             | `49575cd19c74142185905ce40eecc7b221e9f04889769409bf4e62169e5bcc9a` |
| Recovery A ledger                | `b4f9023d664bd37e73fced21f51057c4736fd9f7e7c5a44769ca1108cfd4afe2` |
| Recovery C preflight             | `765a3a5085cabdd99a6c84d591c145598dd291678780390c251fa0699d1eb31c` |
| Recovery C ledger                | `25b6248eeff4f450ab51ad15c535b2488df7a1fdee488a5e04809c2a9664b0d2` |
| Daybreak Recovery A verification | `26119a831737fac878f361c010fcc4bd3359ed0200eafc1ac11c685fabca96a3` |
| Daybreak Recovery C verification | `aa65b4ad35e5b50603562ce2803c22ebc8e0948d25885e785e4cd473a6f35f7c` |
| Local proposal CSV               | `d4fbbda37e450bd1fa0c27416578a03049c608e86d6c9932f529791c45fb4b5a` |
| Local report                     | `a752c96d523909901789f17455d33113d12bdee0bc95088940ebb8ea2c739e65` |
| Gemini request                   | `bdbddf7838594ccfd5db58951f02c61cef113040223bb7287bb272cc85ab5eb9` |
| Gemini response                  | `92f6e70ae4fb1414f580272a4834e5b64998794535e68d1f3b41e682f6f3540f` |
| Gemini execution ledger          | `804997ddc4e5ad83c04eb163e6e0a8578f454e4c7a465f5a494bd059619beb53` |
| Final Art CSV                    | `0c0feb120068217d9d56a922894bf49b63331e64ec00cc0eeca2fecde3515cbb` |

The Gemini request matrix contains a clerical position-47 Work ID
`work-ec6767cc7d294c2b0d67`; it is not a catalog identity. The request's frozen
heading, attached official pixels, title, and Gemini response heading bind that
observation to frozen position 47 `work-f1d22b68efa7fbd501ee` / `僕の小規模な生活`.
The corrected ID is used in the local and final CSVs.

## Decisions

| Pos | Work                                                 | Local     | Gemini    | Final     | Dictionary-grounded decision                                                                                                                                                                                                                                                   |
| --: | ---------------------------------------------------- | --------- | --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|  41 | `work-c9e32218e26c6c6292f9` / `ファントムバスターズ` | `1/2/1/U` | `2/2/2/U` | `2/2/1/U` | Recognizable anatomy and coherent perspective across both contexts reach the realism midpoint despite conventional reaction distortion. Density is balanced. Recurrent jagged contours, hard blacks, and radiating emphasis keep softness at 1.                                |
|  47 | `work-f1d22b68efa7fbd501ee` / `僕の小規模な生活`     | `0/1/3/U` | `1/1/3/U` | `1/1/3/U` | Persistent caricature is tempered by recognizable domestic objects and spatial cues, placing realism between anchors 0 and 2. Broad white fields support density 1; rounded contours support softness 3.                                                                       |
|  48 | `work-f59be454d59478f33914` / `ハクメイとミコチ`     | `2/4/2/U` | `2/4/3/U` | `2/4/2/U` | Realistic environments offset chibi figures. Every accepted context sustains extreme foliage, masonry, and material detail, so density 4 passes the extrema audit. Rough environmental texture and hatching offset rounded figures, supporting neutral softness rather than 3. |
|  50 | `work-f6fa4c2d3a7e1dc5257b` / `ワカコ酒`             | `1/2/4/U` | `1/1/3/U` | `1/2/3/U` | Simplified figures support realism 1. Recurrent food, counter, kitchen, street, and storefront details lift density to 2 across both episodes. Rounded contours are soft, but deliberately simple rather than consistently polished, supporting softness 3.                    |

All four accepted samples lack an independently verified continuous
start-development-impact-resolved action sequence. `motionImpact` therefore
terminates `unknown`; unknown is not a low value and is not itself a promotion
blocker.

## Gate outcome

The final CSV contains exactly four Art axes for four frozen Works: 12 known
static-axis rows and four explicit unknown motion rows. Position 48
`artDensity=4` is the only endpoint and is directly supported by both accepted
contexts. No value was inferred from genre, cover art, animation, synopsis, or
user reviews.
