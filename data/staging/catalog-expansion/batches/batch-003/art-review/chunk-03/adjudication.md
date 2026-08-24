# Batch 003 Art adjudication chunk 03

- adjudicationDate: 2026-08-23
- adjudicator: Primary Local Codex Pass C
- reviewedByHuman: false
- scope: exact official entry-edition samples in chunk-03 preflight
- method: per-axis Factor Dictionary and pixel adjudication; no averaging or majority vote
- temporaryImagesCommitted: false
- hardBlockers: 0

## Counted inputs

| Input                   | Identity or SHA-256                                                | Result                                                                 |
| ----------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Preflight CSV           | `0d922527dcb8b1cbfc1196810c5e5963c01d1c3c6b4540999cd7185ce9f1b7aa` | eight sample-ready and two terminal unknown-ready works                |
| Preflight ledger        | `2c69e652a9399d110e98e0c77efb14da686d2c29d303d02a52e44b8f2e6bfe38` | 27 temporary images; official URLs, editions, refs, and SHA-256 frozen |
| Local Art CSV           | `a1f16fd9e7d24d3eb9d25eb480cb867d255053d3f0e1e11836f629d79c490e13` | 40 rows; all 27 selected image hashes matched                          |
| Local report            | `8078df2e32af8f1b45f09f3375a88ec27f182d799846d110873dc4dd620bb6c4` | completed without Gemini conclusions                                   |
| Gemini request          | `8ed4984658b2983b0e3821183e8f454e493a95b781d92215c5387f1ac7f3bb37` | exact independent frozen input                                         |
| Gemini response         | `60ee0d539c472a9756bbd1424f7592b74b4723249e50e30e76904df703402128` | SUCCESS; 27/27 hashes and per-file pixel cues                          |
| Gemini execution ledger | `812e3aee94deba7c3e64e48b78fa7c4f735d9ed5cdc44b82089b3b4d48e66ad0` | one counted reviewer run; transcription-only continuations recorded    |
| Adjudicated Art CSV     | `99cc5867899af7ea141f27744067c6aa604db602200cfe63c98f6be0aef5d02a` | exact 10×4 terminal matrix                                             |

The counted Gemini run resolved exact model `gemini-3.7-flash-high`, effort
`high`, opened every selected file, matched all frozen input and image hashes,
returned every required cell, and ended with outer `SUCCESS`. Local conclusions
were hidden from Gemini. The display truncated the original response, so the
same conversation was continued only to transcribe the already completed
answer; the execution ledger preserves those continuations without counting
them as additional reviewers.

The primary adjudicator recomputed the frozen hashes and reopened all 24 images
implicated by the 13 value disagreements at original detail. Muse is `NOT_USED`.
Cursor Grok is `ART_ABSTAIN` because no Grok pixel-access proof was requested or
obtained.

## Per-work decision

Vectors are `artRealism / artDensity / visualSoftness / motionImpact`; `U` is
terminal `unknown`, never a low value.

| Work                       | Local     | Gemini    | Final     | Dictionary and pixel decision                                                                                                                   |
| -------------------------- | --------- | --------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 青空エール                 | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | The available color-restored remaster was not bridged to the frozen print edition, so all Art axes close unknown without a blocker.             |
| 甘々と稲妻                 | `2/2/3/U` | `2/2/3/U` | `2/2/3/U` | Both reviewers independently matched the three static values; everyday gestures are not a bounded motion sequence.                              |
| ライドンキング             | `4/3/0/U` | `3/3/1/U` | `3/3/1/U` | Observed machinery and anatomy lean realistic, but fantasy anatomy and open clean fields prevent realism 4 and softness 0 across all contexts.  |
| 俺はまだ本気出してないだけ | `3/1/1/U` | `2/0/1/U` | `2/0/1/U` | Deliberately simplified faces keep realism at 2; broad whitespace and minimally rendered settings sustain density 0 in every context.           |
| 僕の心のヤバイやつ         | `2/3/2/U` | `1/2/3/U` | `2/2/2/U` | Ordinary stylized anatomy, alternating detailed and open classroom fields, and mixed rounded and angular treatment support the three midpoints. |
| 山賊ダイアリー             | `3/3/1/U` | `2/2/2/U` | `2/2/2/U` | Realistic gear and settings remain paired with simplified figures; detailed rural panels alternate with open fields and clean contours.         |
| よふかしのうた             | `2/2/1/U` | `2/3/1/U` | `2/2/1/U` | Urban detail is repeatedly balanced by broad night skies, gradients, silhouettes, and deliberate negative space.                                |
| いつかティファニーで朝食を | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | The exact official product exposed no readable internal preview, so all Art axes close unknown without a blocker.                               |
| 鬼灯の冷徹                 | `1/3/1/U` | `2/3/1/U` | `1/3/1/U` | Flattened faces, chibi figures, and decorative creatures sustain stronger-than-ordinary stylization across the sample.                          |
| 喰う寝るふたり住むふたり   | `3/2/3/U` | `2/2/3/U` | `3/2/3/U` | Mature faces, hands, food, interiors, and architecture retain plausible scale and structure while remaining below full realism.                 |

## Motion and endpoint resolution

Every `motionImpact` cell closes `unknown`. Preflight marked
`motionGateAttemptable=false` for all ten works, and no selected sample provides
exact start, development, impact, and resolved endpoint references. Hunting,
playground movement, cooking, fantasy combat fragments, and small gestures were
not converted into numeric motion values.

`俺はまだ本気出してないだけ` retains the only final endpoint:
`artDensity=0`. All three selected contexts sustain broad whitespace, sparse
background construction, and minimally toned fields. The proposed
`ライドンキング` realism 4 and softness 0 endpoints did not survive complete
sample review.

The final matrix contains 24 known and 16 unknown cells. Thirteen static cells
differed between Local and Gemini; Pass C changed eight Local proposals and five
Gemini proposals by applying the dictionary to the complete sample. No value was
averaged, no Art unknown became a blocker, and no temporary image, source row,
generated artifact, recommendation formula, validator, or Gold value was
changed.
