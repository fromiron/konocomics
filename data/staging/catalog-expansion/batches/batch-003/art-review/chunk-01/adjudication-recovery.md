# Batch 003 Art chunk 01 bounded-recovery adjudication

- adjudicationDate: 2026-08-23
- adjudicator: Primary Local Codex Pass C
- reviewedByHuman: false
- scope: four chunk-01 works with newly verified licensed volume-one preview and edition bridge
- method: per-axis Factor Dictionary and original-pixel adjudication; no averaging or majority vote
- temporaryImagesCommitted: false
- hardBlockers: 0

This bounded recovery supersedes only the four matching `unknown` rows in the
original chunk-01 Art decision. Every other row in `final-art.csv` remains
unchanged. The stable official URL, edition mapping, page references, context
counts, sample counts, and image SHA-256 values remain in the recovery
preflight and ledger; no temporary filesystem path or image is durable catalog
Evidence.

## Counted inputs

| Input                   | Identity or SHA-256                                                | Result                                                                  |
| ----------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Recovery preflight CSV  | `4bbc75c574c04cd0ae6477873b4ef39477d7b9e85ea7a0d8ff8eb278af790472` | four sample-ready works; six pages and at least two contexts each       |
| Recovery ledger         | `d098d6dcb4d9a53a9e4d33e359c56b745c03b7220e53de0d9fbec565d451a1b9` | four edition bridges; twelve selected image hashes                      |
| Local Art CSV           | `25ebc818a568a2fff23f812870c458a44c332e6ac624d4a0a3443026d14fb26a` | sixteen terminal cells; twelve of twelve hashes matched                 |
| Local report            | `0967a6bb1ed48d1cd69057c7b42ee3e4208f767846946b6b98f63304b7ac5999` | completed without Gemini conclusions                                    |
| Gemini request          | `c8989d6f82a18d8bc258df33d8decfe667719e57e091f9462869ef9392ef312b` | exact independent frozen input                                          |
| Gemini response         | `4d5274c333025a998b272ae18a6502302b3c54e1581ae796e7cf55e298741eea` | exact model; normal completion; twelve of twelve hashes and pixel cues  |
| Gemini execution ledger | `f6cd39e115a039ac24d4f60162287f91d91a58fd071c1b451c67082f0d3c7926` | one successful run; no retry fallback timeout rate limit or degradation |
| Recovery final Art CSV  | `92820b99b1427ba0a9f48295ebb4cd98109f24cd99963411f2fed135af68f582` | exact four-by-four terminal matrix                                      |

The counted Gemini run resolved exact model `gemini-3.7-flash-high`, label
`Gemini 3.7 Flash High`, effort `high`, and returned normally after opening all
twelve selected files at original pixels. Local conclusions were hidden from
Gemini. Muse is `NOT_USED`; the Local plus Gemini minimum quorum completed
without it. Cursor Grok is `ART_ABSTAIN` because no Grok pixel-access proof was
requested or obtained.

## Per-work decision

Vectors are `artRealism / artDensity / visualSoftness / motionImpact`; `U` is
terminal `unknown`, never a low value.

| Work                       | Local     | Gemini    | Final     | Dictionary and pixel decision                                                                                                                                                                                         |
| -------------------------- | --------- | --------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 大東京トイボックス         | `3/3/2/U` | `2/2/2/U` | `2/2/2/U` | Standard stylized faces persist and detailed rooms, city, and vehicle panels alternate with broad open fields, supporting realism 2 and balanced density 2.                                                           |
| デトロイト・メタル・シティ | `1/3/0/U` | `2/2/1/U` | `2/3/1/U` | Recognizable ordinary bodies across three settings support realism 2; compact panels, props, hatching, and information remain above balance at density 3; rough marks are moderated by smooth contours at softness 1. |
| 私の少年                   | `3/1/4/U` | `3/2/4/U` | `3/1/4/U` | Fine detail does not overcome the dominant white fields and lightly rendered settings, so density is 1; both reviewers independently sustain realism 3 and softness 4.                                                |
| ドリフターズ               | `3/4/0/U` | `2/4/0/U` | `2/4/0/U` | Persistent facial exaggeration and action distortion keep overall realism at ordinary stylization 2 despite plausible armor; both contexts sustain density 4 and roughness 0.                                         |

Five of the twelve static cells already agreed. The seven differing static
cells were reopened against all relevant original-pixel captures. Pass C
changed five Local proposals and two Gemini proposals; no cell was averaged or
decided by reviewer count.

## Extreme values and motion gate

`私の少年 visualSoftness=4` persists across the first park meeting, domestic
aftermath, and later park conversation. `ドリフターズ artDensity=4` and
`visualSoftness=0` persist across command and battlefield contexts through
layered armor, weapons, figures, smoke, coarse hatching, angular contours, and
heavy contrast. These extrema are not based on one panel.

Every `motionImpact` cell closes `unknown`. The selected samples contain only
isolated gestures, unrelated poses, or combat that continues beyond the last
reference; none exposes an exact start, development, impact, and resolved
endpoint. The final recovery matrix therefore contains twelve known and four
unknown cells. No Art unknown became a blocker, and no source row, generated
artifact, recommendation formula, validator, Gold value, or image repository
was changed.
