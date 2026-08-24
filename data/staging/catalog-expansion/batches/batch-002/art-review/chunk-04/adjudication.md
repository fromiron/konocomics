# Batch 002 Art adjudication chunk 04

- adjudicationDate: 2026-08-23
- adjudicator: Primary Local Codex Pass C
- reviewedByHuman: false
- scope: the exact official entry-edition samples in chunk-04 preflight
- method: per-axis Factor Dictionary adjudication; no averaging or majority vote
- temporaryImageRoot: `/tmp/batch002-art-preflight-chunk04.7n26GY`
- temporaryImagesCommitted: false
- hardBlockers: 0

## Counted inputs

| Input                    | Identity or SHA-256                                                | Result                                                      |
| ------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| Preflight CSV            | `c2737cd4fa27e9d9239f5bb15f3a78ed0fbffc885e77955cb1a7af01801736a3` | eight static sample gates; two works terminal unknown-ready |
| Preflight ledger         | `e84f4d35cde28ce16ed985ac3d965a78c74342db3c12f51af22ca603193f31cb` | 24 temporary captures; repository images remain zero        |
| Local Art CSV            | `ebae920c3e15c041d43ed8a1d7aaeae1578ffabf75103318ddf4309e64f61fdd` | 40 rows; all 24 selected image hashes matched               |
| Local report             | `a40f267e365c42ade7d047a132227774a68ceff8422d7d9cb6c3727a974bec59` | completed before Gemini conclusions were read               |
| Gemini group 01 request  | `1f3bbcee77e74bc3ed790bc3a7638232af106698a2905724ecb7958e3b214130` | exact independent input                                     |
| Gemini group 01 response | `d8f8951a694b6b1474eaed78e1938f3f4c3bc9705a61edd4d315d8363ffb7d5b` | `4a166c0b-1324-47f8-a50e-9c7e77b305d0`, SUCCESS, 9/9 hashes |
| Gemini group 02 request  | `dbd4de3d34db447a04656f10852387c8653ced254de9cddb1472c8e70c81abee` | exact independent input                                     |
| Gemini group 02 response | `c7b9b544e90aed4f4fa17b1c194d2b05691fe11a75ced34ce1f386a1fbf6352e` | `9af5cc18-9f69-4e2d-9387-96a6d57d125c`, SUCCESS, 9/9 hashes |
| Gemini group 03 request  | `f668c7eb9143118d5e5dcff79bc8d51c0d021364eef87c1ffc6b267b36852a60` | exact independent input                                     |
| Gemini group 03 response | `2b04820297ffa29baa6c5775ee7f71ed8ad767f22d5d04bc31bb8eecc27a5cdd` | `3c848635-d9e2-4962-83fa-d8b25034bfb4`, SUCCESS, 6/6 hashes |
| Adjudicated Art CSV      | `ebae920c3e15c041d43ed8a1d7aaeae1578ffabf75103318ddf4309e64f61fdd` | exact 10x4 terminal matrix; 24 known and 16 unknown         |

All counted Gemini payloads identify exact model `gemini-3.7-flash-high`,
resolved label `Gemini 3.7 Flash (High)`, effort `high`,
`completionStatus=completed`, full pixel access, no issue, no hard blocker, and
`reviewedByHuman=false`. Their 24 returned image hashes match the preflight
bytes. The execution ledger records the excluded abnormal and non-exact
transport attempts; none independently contributes a verdict.

Muse was not invoked because the required Local plus Gemini quorum completed.
Cursor Grok is `ART_ABSTAIN` because no Grok pixel-access proof was requested or
obtained.

## Per-work decision

Vectors are `artRealism / artDensity / visualSoftness / motionImpact`; `U` is
terminal `unknown`, never a low value.

| Work                         | Local     | Counted Gemini | Final     | Dictionary and pixel decision                                                                                                                                                                 |
| ---------------------------- | --------- | -------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 軍靴のバルツァー             | `U/U/U/U` | not reviewed   | `U/U/U/U` | The exact volume-one product exposes no internal preview; all Art axes close unknown without a blocker.                                                                                       |
| flat                         | `2/2/4/U` | `2/2/3/U`      | `2/2/4/U` | Thin smooth contours, rounded faces, gentle screentone, and polished treatment recur across school, home, and doorway contexts and meet softness anchor 4.                                    |
| スーパーの裏でヤニ吸うふたり | `3/2/3/U` | `2/2/2/U`      | `3/2/3/U` | Grounded adult anatomy and controlled, polished face and hair rendering exceed ordinary stylization and neutral softness without reaching either anchor 4.                                    |
| ケロロ軍曹                   | `U/U/U/U` | not reviewed   | `U/U/U/U` | The exact product delegates to an inaccessible viewer; no internal pixels were retained and all Art axes close unknown.                                                                       |
| 百姓貴族                     | `0/1/2/U` | `0/0/2/U`      | `0/1/2/U` | Strong deformation supports realism 0; sparse fields remain above density 0 because recurring objects, compact panels, and diagrams persist after lettering is excluded.                      |
| 月刊少女野崎くん             | `1/1/4/U` | `2/2/2/U`      | `1/1/4/U` | Large-eye idealization and repeated chibi shifts place realism below 2; broad white fields place density below 2; smooth contours and polished treatment meet softness 4 across all contexts. |
| 私の推しは悪役令嬢。         | `2/3/4/U` | `2/2/2/U`      | `2/3/4/U` | Uniform, architecture, patterned clothing, compact paneling, and delicate polished figures repeatedly place density above 2 and softness at anchor 4.                                         |
| 僕とロボコ                   | `0/3/1/U` | `0/2/1/U`      | `0/3/1/U` | Strong deformation agrees; compact panels, heavy blacks, props, buildings, and repeated background cues keep density between anchors 2 and 4.                                                 |
| 屍鬼                         | `2/4/0/U` | `2/2/0/U`      | `2/4/0/U` | Architecture, vehicles, bodies, textures, layered panels, and heavy blacks remain highly dense across death, roadside, and village contexts and meet density 4.                               |
| 大ダーク                     | `3/4/0/U` | `2/4/0/U`      | `3/4/0/U` | Grounded anatomy, equipment, material texture, and spatial construction place realism above 2; grotesque exaggeration keeps it below fully realistic anchor 4.                                |

## Motion and extrema resolution

All ten `motionImpact` rows close `unknown`. The readable packets contain
gestures, vehicles, falls, or isolated impacts, but no frozen ref set preserves
one exact start, development or impact, and endpoint sequence. The two
unreadable works cannot reach the motion gate. Unknown is not restrained
motion and is not a promotion blocker.

The primary adjudicator reopened all 24 selected pixels, including every
conflict and final extreme. Final extremes are limited to the repeated
cross-context evidence described in the Local report: realism 0 for 百姓貴族 and
僕とロボコ, density 4 for 屍鬼 and 大ダーク, softness 4 for flat,
月刊少女野崎くん, and 私の推しは悪役令嬢。, and softness 0 for 屍鬼 and
大ダーク. No value was averaged, no temporary image entered the repository,
and no Art unknown became a blocker.
