# Batch 002 text adjudication — chunk 01, round 02

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Scope: the 20 supplemental candidate-known axes from frozen positions 1–9
- Date: 2026-08-23
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`
- Rule: supplemental research and independent Pass B are resolved against the Factor Dictionary, official entry range, edition mapping, and user-review independence. Coverage shortage is never evidence.
- Boundary: this round creates the terminal text matrix for the evidence currently obtained. It does not promote or block a Work; remaining finite official routes are separately queued.

## Frozen inputs and outputs

| Input or output                                   | SHA-256                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| `research/text-gap-chunk-01.md`                   | `664adc9ea4c325cb0b5841a8c1b47d7d546b48a5661e96f232b4bf9c4e413071` |
| `reviews/text-gap-chunk-01-independent-review.md` | `e7426964ac1f1e1308dc0c99df39380b0cd7de031aa4d97cd742c6666eb20b05` |
| `adjudication/text-chunk-01-round-01.md`          | `4441b0502877f175ad5498d4b253675b23145fea7aadd7636ddae64f37240672` |
| `docs/factors/factor-dictionary.md`               | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `adjudication/text-final-chunk-01.csv`            | `55323c7f59e2d2a2444781dbf0ff32d7eaa92ee1633ad42b2896a355f1745732` |
| `adjudication/genres-final-chunk-01.csv`          | `8cc719334df730383c5b716c22f2791e79470a3f1c28c9ba200d5bfdf5db12be` |
| `adjudication/themes-final-chunk-01.csv`          | `10261fed1c9d20a3ddfab50f474116b7ab2ba37f5ccc78020bb42e5a63bed9a7` |

## Supplemental decisions

| Work             | Axis                  | Proposed | Final | Decision reason                                                                                                                        |
| ---------------- | --------------------- | -------: | ----: | -------------------------------------------------------------------------------------------------------------------------------------- |
| デカワンコ       | emotionalWarmth       |        2 |     U | Official entry copy establishes emotional incidents, while user reviews supply the defining warmth claim with mixed or unknown ranges. |
| RED              | pacing                |        2 |     2 | The official 1–2 bridge and exact original-volume 3 description establish ordinary revenge-arc progression.                            |
| RED              | characterArcWeight    |        3 |     3 | Loss, erased future, hatred, and self-destructive choice directly motivate the mapped entry events alongside the plot.                 |
| RED              | mentalStress          |        3 |     3 | Bereavement, hatred, and self-destructive risk recur as subjective pressure rather than a darkness inference.                          |
| 邪眼は月輪に飛ぶ | problemSolving        |        3 |     U | The official complete-volume summary establishes a hard constraint and goal, not the actual analysis-and-solution method.              |
| 邪眼は月輪に飛ぶ | pacing                |        4 |     4 | Seven chapters move through forest, city, military response, pursuit, and tower confrontation within one complete entry volume.        |
| 邪眼は月輪に飛ぶ | worldBuilding         |        2 |     2 | The lethal-gaze rule and institutional response functionally constrain the complete conflict.                                          |
| 邪眼は月輪に飛ぶ | characterArcWeight    |        2 |     U | Inner change and heart connection are supplied by user reviews rather than direct official entry observations.                         |
| 邪眼は月輪に飛ぶ | relationshipStructure |        2 |     2 | The official complete cast and event sequence establish a fixed hunter, family, military, and CIA core.                                |
| 邪眼は月輪に飛ぶ | darkness              |        4 |     4 | Official opening mass death and the humanity-scale instant-death threat remain central through the final confrontation.                |
| 邪眼は月輪に飛ぶ | mentalStress          |        3 |     2 | Fear and despair are direct, but sustained inner collapse across the resolution is not exposed.                                        |
| 邪眼は月輪に飛ぶ | emotionalWarmth       |        2 |     U | Trust and heart connection are defined only by the same-platform reader packet.                                                        |
| 銀河鉄道999      | progression           |        2 |     U | Official entry descriptions establish encounters; same-platform reviews supply the defining personal-growth claim.                     |
| 銀河鉄道999      | emotionalWarmth       |        2 |     U | Kindness and life-value observations are reader-derived, and the only cross-platform review is not entry-scoped.                       |
| 吉祥天女         | characterArcWeight    |        3 |     U | Official direct evidence stops in volume 1; complete-work reviews cannot establish persistence through entry volumes 1–3.              |
| 吉祥天女         | relationshipStructure |        2 |     U | Opening participants do not establish a recurring entry-range relationship core.                                                       |
| 吉祥天女         | darkness              |        3 |     2 | Opening bullying and entry-scoped sexual threat establish serious harm, but stronger persistence comes from full-work reviews.         |
| 吉祥天女         | mentalStress          |        3 |     2 | Isolation, humiliation, fear, and self-defense establish mixed pressure; the stronger value would import the ending range.             |
| 吉祥天女         | emotionalWarmth       |        2 |     U | One protective intervention does not establish recurring entry-range care or healing.                                                  |
| 六三四の剣       | comedy                |        2 |     2 | Multiple official early comic incidents are corroborated by independent readers limited to the shared childhood range.                 |

`U` is terminal `unknown` for the evidence packet, not a low value. No
supplemental known zero is created. The original and alternate-edition bridges
for RED and 六三四の剣 are used only within their explicitly mapped ranges.

## Final current text coverage

| Work             | Narrative | Tone | Current result          |
| ---------------- | --------: | ---: | ----------------------- |
| サンダー３       |       3/6 |  2/7 | finite research remains |
| のたり松太郎     |       6/6 |  4/7 | finite research remains |
| デカワンコ       |       4/6 |  4/7 | finite research remains |
| ファイアパンチ   |       3/6 |  5/7 | finite research remains |
| RED              |       2/6 |  4/7 | finite research remains |
| 邪眼は月輪に飛ぶ |       2/6 |  3/7 | finite research remains |
| 銀河鉄道999      |       2/6 |  3/7 | finite research remains |
| 吉祥天女         |       0/6 |  2/7 | finite research remains |
| 六三四の剣       |       4/6 |  5/7 | **TEXT_COVERAGE_PASS**  |
| 怪獣8号          |       4/6 |  5/7 | **TEXT_COVERAGE_PASS**  |

The two passing Works are not promotion verdicts; Art, evidence materialization,
recommendation context, and the remaining promotion gates still apply. The
other eight are not hard blockers yet because a bounded official route remains
recorded. If that route fails, their missing axes remain unknown and the actual
coverage contract—not fabricated values—determines a blocker candidate.

## Genre and Theme closure

- Round-01 Genre and Theme decisions are materialized in the final CSVs.
- RED retains Genre `historical`, not `action`; 吉祥天女 and 邪眼は月輪に飛ぶ remain without a final Genre pending scoped review.
- 銀河鉄道999 `exploration` and 怪獣8号 `workplace` close at centrality 1.
- Selection rankings and user-review tags are not used as Genre or Theme evidence.
- No canonical title contains decorative `『』` delimiters.

## Outcome

| Outcome                              | Works |
| ------------------------------------ | ----: |
| Current text coverage pass           |     2 |
| Explicit finite evidence route       |     8 |
| Hard blocker                         |     0 |
| Unresolved supplemental proposal     |     0 |
| Human validation represented as done |     0 |
