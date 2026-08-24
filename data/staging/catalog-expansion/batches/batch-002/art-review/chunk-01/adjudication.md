# Batch 002 Art adjudication chunk 01

- adjudicationDate: 2026-08-23
- adjudicator: Primary Local Codex Pass C
- reviewedByHuman: false
- scope: the exact official entry-edition samples in chunk-01 preflight
- method: per-axis Factor Dictionary adjudication; no averaging or majority vote
- temporaryImageRoot: `/tmp/batch002-art-preflight.DZG1uL`
- temporaryImagesCommitted: false
- hardBlockers: 0

## Counted inputs

| Input                    | Identity or SHA-256                                                | Result                                                      |
| ------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| Preflight CSV            | `f3cc4aebbf6000513ca229474ab862f7ada5dc15a3c02a5b3a289a9a0b6e8043` | nine static sample gates, RED unknown-ready                 |
| Local Art CSV            | `ca7350bcb790a72390294b5be448b88d8a8799ee130db8ce803abe61926ce495` | 40 rows; 27/27 sample hashes matched                        |
| Local report             | `2d95ddfdcb6ed915ef3d3a125484330251f038cbb65f39a422eeaa8842704e3b` | blind to Gemini conclusions                                 |
| Gemini group 01 request  | `1053f87837731f11af01a5724c862036054017fd766f04c838dd24f5105cde1a` | exact independent input                                     |
| Gemini group 01 response | `38042860de0f7d4b4f60f1a85b548941e39b90657ee705a05c89015487d1f41f` | `d50113f7-3e29-419f-b111-7917493c8b31`, SUCCESS, 9/9 hashes |
| Gemini group 02 request  | `eabfea9b104738713abc06cf254d4e1a6b4aaaa49ee8d46b832728dd09b87b4f` | exact independent input                                     |
| Gemini group 02 response | `323c18a122c54f2d92581b8cee5cdec256e1ca2b13a4d889f4af213d3bba328a` | `0298e033-fde4-4426-86b9-b1dba317acf9`, SUCCESS, 9/9 hashes |
| Gemini group 03 request  | `57ae684217dd1a80c639273e4db9e231e622d8bfaa95ab0c389d2c7b5237ef19` | exact independent input                                     |
| Gemini group 03 response | `db59364f0ea21e64358d0e4331a0573b2d36066f7a98a9d5c83746e4ba77c50a` | `c9500346-41cb-4528-bb46-8081f7a5f63b`, SUCCESS, 9/9 hashes |
| Adjudicated Art CSV      | `3a10f06c9cdbdf98f6dd9d19314033b4a80f28be2e8b6ae37d7b5c59ba2e0b52` | exact 10×4 terminal matrix                                  |

All three counted Gemini responses report exact model
`gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash (High)`, effort
`high`, `completionStatus=completed`, full pixel access, no issue, no hard
blocker, and `reviewedByHuman=false`. Their 27 returned image hashes all match
the preflight bytes.

An earlier group-01 run (`ceb5ce2a-6421-4975-9849-ad472495bed3`) returned
outer SUCCESS, but its complete stdout was not durably stored in the batch
packet. It is excluded from the quorum under the complete-payload requirement;
the fresh independent counted run above replaces it. Muse was not invoked
because the required Local plus Gemini quorum completed. Cursor Grok is
`ART_ABSTAIN` because no Grok pixel-access proof was requested or obtained.

## Per-work decision

Vectors are `artRealism / artDensity / visualSoftness / motionImpact`; `U` is
terminal `unknown`, never a low value.

| Work             | Local     | Counted Gemini | Final     | Dictionary and pixel decision                                                                                                       |
| ---------------- | --------- | -------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| サンダー３       | `0/1/4/U` | `0/0/4/U`      | `0/1/4/U` | Numerous open fields coexist with detailed street, house, school, and shoe-locker panels; density lies between sparse 0 and 2.      |
| のたり松太郎     | `2/4/0/U` | `2/4/0/U`      | `2/4/0/U` | Quorum agreement; no bounded motion sequence.                                                                                       |
| デカワンコ       | `2/2/2/U` | `2/2/2/U`      | `2/2/2/U` | Quorum agreement; the isolated kick does not include the complete sequence.                                                         |
| ファイアパンチ   | `3/3/1/U` | `2/2/2/U`      | `3/2/1/U` | Grounded anatomy supports realism 3; dense rendered panels alternate with open snow/dialogue fields; dry hatching supports 1.       |
| RED              | `U/U/U/U` | `U/U/U/U`      | `U/U/U/U` | Zero readable internal pages; official product identity cannot substitute for pixels.                                               |
| 邪眼は月輪に飛ぶ | `4/4/0/U` | `3/4/0/U`      | `4/4/0/U` | Reality-oriented anatomy, carrier machinery, perspective, and equipment repeatedly meet realism 4; bridge impact remains unbound.   |
| 銀河鉄道999      | `2/3/3/U` | `1/2/2/U`      | `2/3/2/U` | Stylized figures plus credible machinery fit 2; recurring detail exceeds balanced density; hard and elegant rendering net to 2.     |
| 吉祥天女         | `3/2/4/2` | `3/2/3/U`      | `3/2/3/2` | Soft rendering is tempered by angular faces and heavy uniforms; printed p020 supplies an exact short collision sequence.            |
| 六三四の剣       | `2/4/0/4` | `2/3/1/U`      | `2/4/1/4` | Six pages sustain high information; rough and rounded forms put softness at 1; p023 supplies setup, transition, strike, and impact. |
| 怪獣8号          | `3/4/1/U` | `2/3/3/U`      | `2/4/1/U` | Stylized faces keep realism at 2; backgrounds, gear, debris, and layered panels sustain 4; hard cleanup rendering supports 1.       |

## Motion resolution

- 吉祥天女 p020: stair-landing approach, bucket displacement/contact, and the
  immediate clutching reaction form a bounded ordinary-impact sequence;
  `motionImpact=2`.
- 六三四の剣 p023: the two-step setup, hand transition, accelerating strikes,
  and debris-filled impact form a bounded high-impact sequence;
  `motionImpact=4`.
- The other eight works lack a complete supplied sequence or any internal page;
  their `motionImpact` is terminal `unknown` for this scope.

The adjudicated CSV changes five Local static rows after inspecting the pixels;
it retains the two Local motion rows because the exact references satisfy the
guide. No value is averaged. No Art unknown becomes a blocker, no source or Gold
row is changed, and no temporary image is copied into the repository.
