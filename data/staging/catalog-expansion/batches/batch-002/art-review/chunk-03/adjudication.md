# Batch 002 Art adjudication chunk 03

- adjudicationDate: 2026-08-23
- adjudicator: Primary Local Codex Pass C
- reviewedByHuman: false
- scope: the exact official entry-edition samples in chunk-03 preflight
- method: per-axis Factor Dictionary adjudication; no averaging or majority vote
- temporaryImageRoot: `/tmp/batch002-art-preflight-chunk03.6Zlsbu`
- temporaryImagesCommitted: false
- hardBlockers: 0

## Counted inputs

| Input                    | Identity or SHA-256                                                | Result                                                      |
| ------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| Preflight CSV            | `1f5444994829de49ad00b2a60281f3514e336c16e5160edf431c51dea11067ae` | eight static sample gates; two works terminal unknown-ready |
| Preflight ledger         | `467c4cb682468031b984bfc61c8a6de8a499f31ce82c223a8f57c36a81121b75` | 24 temporary captures; repository images remain zero        |
| Local Art CSV            | `9b1f2084a52526fd8a63a5511f0e97a89343fb1d7052a09e2694eb5200845add` | 40 rows; all 24 selected image hashes matched               |
| Local report             | `2e342ac4e4ffd389a586c6f183738cf04d2c9925b374c7c19aa6eca1a4a5ee07` | completed before Gemini conclusions were read               |
| Gemini group 01 request  | `a45d92259797c40b071cf8b96b06bfafc3fc84a61f634e9f095ab6d6bbb445d2` | exact independent input                                     |
| Gemini group 01 response | `ff59d967b40b9ad9d2e50cf64dc0b399d871f7329e67f016bb1f78242502e077` | `f9af7090-3e44-4775-9ddb-cbd33444f800`, SUCCESS, 9/9 hashes |
| Gemini group 02 request  | `fb21d41e40852a85f8c2f1690de53de1c5f7dc3e3cef15a21adccdeac2c04ad2` | exact independent input                                     |
| Gemini group 02 response | `0cf5f7bf9396f0f408f815070e0bdfaa9dd70f6c00245fbea1cb4336990c3349` | `635dc07d-2cd7-4034-a67c-197b9456a805`, SUCCESS, 9/9 hashes |
| Gemini group 03 request  | `a57fa915cd7ad532d5ac8486e458c5794db545f20d558dc84c3e00947b849844` | exact independent input                                     |
| Gemini group 03 response | `e1d5b3c9caf7a009083d6cd0c496070b94955ce9558b2d1be8f0685e08a9bb0b` | `ffa5001e-824a-4dea-82e9-6ebd0df9ec03`, SUCCESS, 6/6 hashes |
| Adjudicated Art CSV      | `9b1f2084a52526fd8a63a5511f0e97a89343fb1d7052a09e2694eb5200845add` | exact 10×4 terminal matrix; 25 known and 15 unknown         |

All counted Gemini payloads identify exact model
`gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash (High)`, effort
`high`, `completionStatus=completed`, full pixel access, no issue, no hard
blocker, and `reviewedByHuman=false`. Their 24 returned image hashes match the
preflight bytes. The execution ledger records all excluded abnormal,
permission, schema, and non-exact transport attempts; none independently
contributes a verdict.

Muse was not invoked because the required Local plus Gemini quorum completed.
Cursor Grok is `ART_ABSTAIN` because no Grok pixel-access proof was requested or
obtained.

## Per-work decision

Vectors are `artRealism / artDensity / visualSoftness / motionImpact`; `U` is
terminal `unknown`, never a low value.

| Work                 | Local     | Counted Gemini | Final     | Dictionary and pixel decision                                                                                                                      |
| -------------------- | --------- | -------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 機動警察パトレイバー | `U/U/U/U` | not reviewed   | `U/U/U/U` | The standard-volume preview has no official bridge to the frozen wide edition; sampling stopped before pixels and all axes close unknown.          |
| あさひなぐ           | `3/2/2/U` | `2/2/2/U`      | `3/2/2/U` | Natural bodies, sports equipment, and grounded space place realism between ordinary stylization 2 and realistic anchor 4.                          |
| 高台家の人々         | `2/1/3/U` | `2/2/3/U`      | `2/1/3/U` | Large white fields and face-led panels dominate across the three contexts, placing density between sparse 0 and balanced 2.                        |
| 怪物事変             | `2/2/1/U` | `2/3/2/U`      | `2/2/1/U` | Detailed rural and creature panels alternate with open fields; jagged effects, hard blacks, and angular silhouettes keep softness between 0 and 2. |
| SAKAMOTO DAYS        | `3/3/1/4` | `2/2/2/3`      | `3/3/1/4` | Grounded bodies, spatial depth, sustained architecture and hatching support the static between-values; the exact p010–p011 action meets impact 4.  |
| 図書館の大魔術師     | `3/4/2/U` | `2/4/3/U`      | `3/4/2/U` | Observed anatomy, objects, and architecture raise realism above 2; intricate detail meets density 4, while hard architecture balances fine lines.  |
| 聖☆おにいさん        | `2/2/1/U` | `2/2/2/U`      | `2/2/1/U` | Lean angular faces, crisp contours, and emphatic expression marks consistently place softness between rough 0 and neutral 2.                       |
| 黒執事               | `2/2/3/U` | `2/2/3/U`      | `2/2/3/U` | Quorum agreement across the product-linked first-episode pages; no exact bounded action sequence.                                                  |
| 信長協奏曲           | `3/3/1/U` | `2/2/1/U`      | `3/3/1/U` | Grounded anatomy, historical clothing, landscape depth, forest texture, and fight hatching place realism and density between anchors 2 and 4.      |
| 風と木の詩           | `U/U/U/U` | not reviewed   | `U/U/U/U` | The official bunko preview has no official bridge to the frozen Flower Comics edition; sampling stopped before pixels and all axes close unknown.  |

## Motion and extrema resolution

`SAKAMOTO DAYS` alone passes the motion gate. The exact p010–p011 sequence
contains gunfire initiation, evasive low advance, impact, and visible aftermath;
the primary adjudicator reopened these pixels and retained
`motionImpact=known 4`. All other sampled works lack a preserved exact start,
development or impact, and endpoint, so motion closes `unknown`. The two
edition-unresolved works also close all Art axes `unknown` before pixel review.

`図書館の大魔術師.artDensity=4` is retained because intricate textiles,
equipment, architecture, crowds, and surface hatching recur in every sampled
context. These are the only final Art extrema in the chunk. The primary
adjudicator reopened all disputed and extreme samples; no value was averaged,
no Art unknown became a blocker, no source or Gold row changed, and no
temporary image entered the repository.
