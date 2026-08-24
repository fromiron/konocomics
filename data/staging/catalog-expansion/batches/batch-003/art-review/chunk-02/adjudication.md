# Batch 003 Art adjudication chunk 02

- adjudicationDate: 2026-08-23
- adjudicator: Primary Local Codex Pass C
- reviewedByHuman: false
- scope: exact official entry-edition samples in chunk-02 preflight
- method: per-axis Factor Dictionary and pixel adjudication; no averaging or majority vote
- temporaryImageRoot: `/tmp/batch003-art-preflight-chunk02.al2RO1`
- temporaryImagesCommitted: false
- hardBlockers: 0

## Counted inputs

| Input                   | Identity or SHA-256                                                | Result                                                |
| ----------------------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| Preflight CSV           | `80f717825e271ab3a54e0f163c78f0c66a0de507e2ca76f23c41913bd47b2019` | nine sample-ready and one terminal unknown-ready work |
| Local Art CSV           | `25fbcb217da3e9c17c6aa9648bd4e73c820d303bab56297e17b0f3631ca24303` | 40 rows; all 30 selected image hashes matched         |
| Local report            | `accde5e02755e54a781bd6eb25769103be3d6c05935ca1a92adbc42d7b0c2d7f` | completed without Gemini conclusions                  |
| Gemini request          | `96a139297fcd75926836aab16325ca1cd1c64659ec5a4b66848eb50e7b8a326a` | exact independent frozen input                        |
| Gemini response         | `e247ab0f82998470af32b3919d87e59ed97c4205961527fc35f9e21f64930c76` | SUCCESS; 30/30 hashes and per-file pixel cues         |
| Gemini execution ledger | `f6808e48ab8c5d9dd52c272b463d3e3f258e304ec3cd021bf5323270048791ee` | one normal run and zero excluded attempts             |
| Adjudicated Art CSV     | `7c7398cad89c69ef31b38014993706efba956112b511d2258a8e73544ed2d4b5` | exact 10×4 terminal matrix                            |

The counted Gemini run resolved exact model `gemini-3.7-flash-high`, effort
`high`, opened every selected file, matched all frozen input and image hashes,
returned every required cell, and ended with outer `SUCCESS`. Local conclusions
were hidden from Gemini. The primary adjudicator recomputed the 30 hashes and
reopened all 24 images implicated by a value disagreement plus all three
`劇光仮面` extreme-value sample images at original detail.

Muse is `NOT_USED`; the Local plus Gemini minimum quorum completed without it.
Cursor Grok is `ART_ABSTAIN` because no Grok pixel-access proof was requested or
obtained.

## Per-work decision

Vectors are `artRealism / artDensity / visualSoftness / motionImpact`; `U` is
terminal `unknown`, never a low value.

| Work                       | Local     | Gemini    | Final     | Dictionary and pixel decision                                                                                                                       |
| -------------------------- | --------- | --------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 暗殺教室                   | `2/3/2/U` | `1/2/2/U` | `1/3/2/U` | Persistent teacher deformation places realism between anchors 0 and 2; crowded figures, weapons, compact panels, and effects place density at 3.    |
| 乱と灰色の世界             | `U/U/U/U` | `U/U/U/U` | `U/U/U/U` | The mapped official trial exposed no readable internal page, so every Art axis closes unknown without a blocker.                                    |
| 劇光仮面                   | `4/4/0/U` | `4/4/0/U` | `4/4/0/U` | All three contexts sustain observed anatomy, dense architecture and texture, hard angles, coarse hatching, and heavy contrast.                      |
| その着せ替え人形は恋をする | `3/2/3/U` | `2/2/3/U` | `2/2/3/U` | Coherent bodies and objects remain paired with large expressive eyes and polished manga faces, matching ordinary stylization anchor 2.              |
| 高杉さん家のおべんとう     | `2/3/3/U` | `2/2/3/U` | `2/3/3/U` | Compact layouts, layered text, patterned clothing, food, city, kitchen, and fieldwork information remain above balanced density across the sample.  |
| 刻刻                       | `3/3/1/U` | `3/3/1/U` | `3/3/1/U` | Both reviewers independently matched the same three static values; the assault fragment is not a bounded motion sequence.                           |
| BUTTER！！！               | `3/1/3/U` | `2/2/3/U` | `2/1/3/U` | Stylized faces and elongated bodies match realism 2; broad white fields and sparse settings place density between anchors 0 and 2.                  |
| トクサツガガガ             | `2/3/2/U` | `2/2/2/U` | `2/2/2/U` | One dense imagined-hero spread is balanced by cleaner restroom and train dialogue spreads, so density remains anchor 2.                             |
| もやしもん                 | `3/4/1/U` | `2/3/2/U` | `2/3/2/U` | Standard faces plus mascot microbes keep realism at 2; two locally dense effects do not sustain density 4, and clean figures balance rough strokes. |
| きょうは会社休みます。     | `2/2/4/U` | `2/2/3/U` | `2/2/3/U` | Fine lines and tones are soft, but burst lines, black fields, and deformed reactions prevent maximum softness across all contexts.                  |

## Motion and endpoint resolution

Every `motionImpact` cell closes `unknown`. Preflight marked
`motionGateAttemptable=false` for all ten works, and no selected sample provides
exact start, development, impact, and resolved endpoint references. Isolated
gunfire, dance poses, imagined heroes, a shovel action, and relationship
reactions were not converted into values.

`劇光仮面` retains the only extremes: `artRealism=4`, `artDensity=4`, and
`visualSoftness=0`. The primary review confirmed that all three selected
contexts, rather than a single page, sustain the corresponding endpoint
features. No other extreme proposed by one reviewer survived the complete
sample review.

The final matrix contains 27 known and 13 unknown cells. Eleven cells differed
between Local and Gemini; Pass C changed eight Local proposals and three Gemini
proposals by applying the dictionary to the complete sample. No value was
averaged, no Art unknown became a blocker, and no image, source row, generated
artifact, recommendation formula, validator, or Gold value was changed.
