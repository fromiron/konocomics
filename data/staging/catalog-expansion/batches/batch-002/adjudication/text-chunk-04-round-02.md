# Batch 002 text adjudication — chunk 04, round 02

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Scope: frozen positions 31–40, first 1–3 volumes or first major episode
- Date: 2026-08-23
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`
- Method: official-first supplemental evidence and independent Pass B are adjudicated per Axis; no averaging, majority vote, genre inference, or review-silence inference
- Boundary: accepted values are materialized in chunk-final CSVs. Three remaining Tone gaps move to one finite second search; no work is promoted here.

## Frozen inputs

| Input                                      | SHA-256                                                            |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `adjudication/text-chunk-04-round-01.md`   | `f5272bd8a807ea876ffa2ff114e95e7ea47f3c0afd2e012de5ef1202f66f09fc` |
| `adjudication/text-gap-queue-chunk-04.csv` | `00fdfd857e72e252355d96134a693dac4758ba86d79bd1578a1a8c332082e48d` |
| `research/text-gap-chunk-04.md`            | `10c1d1b22d5bcf406beb08b23017b35b65e21b28ea3d4022b10fcb2539579eeb` |
| `reviews/text-gap-review-chunk-04.md`      | `dbbcf51b532769f149e1039aed479f5d06811f4b8662cfb329d75e287e980000` |
| `adjudication/text-final-chunk-04.csv`     | `3fb67d62ae703f717f8a7fca65c220dd2214a9115305cff87bbd682304db9689` |
| `adjudication/genres-final-chunk-04.csv`   | `f193e19a5045d54ee1216ea4b7620d937c46353184131dd95845ea2806e9c840` |
| `adjudication/themes-final-chunk-04.csv`   | `9f5aa2d468f1648ad8648025d7835ee897c43010da1a08c29a2d9c72ac547fca` |

The research packet records 67 unique URLs and the independent reviewer
rechecked `67/67` as reachable. Reachability was not counted as content
sufficiency. Official 1–3 volume material fixes scope; creator or award
commentary and multiple independent exact-range reviews only support concrete
repeated observations. Popularity, ratings, selection provenance, demographics,
and Genre labels supply no Axis value.

## Pass C decisions

| Work                         | Accepted candidate axes                                                                                                                    | Candidate closed unknown | Genre or Theme decision                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | ------------------------------------------------------------------------------ |
| 軍靴のバルツァー             | `progression=2`, `characterArcWeight=2`, `emotionalWarmth=2`                                                                               | `mentalStress`           | retain `historical`; retain `politics:2`, `war:1`, `school:1`                  |
| flat                         | `problemSolving=0`, `strategy=0`, `pacing=1`, `mysteryReveal=0`, `characterArcWeight=3`, `comedy=2`, `mentalStress=1`, `emotionalWarmth=4` | `progression`            | retain `sliceOfLife`; add `cooking:1` only                                     |
| スーパーの裏でヤニ吸うふたり | `problemSolving=0`, `strategy=0`, `worldBuilding=0`, `comedy=2`, `emotionalWarmth=3`                                                       | none                     | retain `sliceOfLife`, `workplace:2`                                            |
| ケロロ軍曹                   | `strategy=1`, `mysteryReveal=0`, `darkness=0`, `mentalStress=0`                                                                            | `emotionalWarmth`        | retain `scienceFiction;comedy`, `foundFamily:1`                                |
| 百姓貴族                     | `progression=0`, `mysteryReveal=0`, `relationshipStructure=2`, `comedy=4`, `darkness=2`, `mentalStress=2`, `emotionalWarmth=2`             | none                     | retain `sliceOfLife`, `workplace:2`, `historicalReconstruction:1`              |
| 月刊少女野崎くん             | `progression=0`, `mysteryReveal=0`, `comedy=4`, `emotionalWarmth=2`                                                                        | none                     | retain `comedy;romance`, `school:2`, `workplace:2`                             |
| 私の推しは悪役令嬢。         | `comedy=3`, `emotionalWarmth=2`                                                                                                            | none                     | retain manga-only `fantasy;romance`, `reincarnation:2`, `school:1`, `combat:1` |
| 僕とロボコ                   | `progression=0`, `strategy=0`, `mysteryReveal=0`, `darkness=0`, `mentalStress=0`, `emotionalWarmth=3`                                      | none                     | retain `scienceFiction;comedy;sliceOfLife`, `cooking:1`                        |
| 屍鬼                         | none                                                                                                                                       | `comedy`                 | retain `mystery;horror`, `investigation:2`                                     |
| 大ダーク                     | `problemSolving=1`, `strategy=1`, `mysteryReveal=1`, `comedy=4`, `mentalStress=1`, `romance=0`, `emotionalWarmth=2`                        | none                     | retain `action;scienceFiction`, `adventure:2`, `combat:2`                      |

The four unknown decisions are evidence closures, not low scores. In particular,
屍鬼 `comedy=0` is not accepted: official copy and exact-volume reviews focus on
death and investigation, but their silence does not actively establish absence,
and a range-external review raises a possible conflict. The same rule prevents
relationship presence alone from proving ケロロ軍曹 warmth, objective military
risk from proving 軍靴のバルツァー mental stress, or slow relationship change from
proving flat progression.

## Coverage after round 02

Narrative order is `progression / problemSolving / strategy / pacing /
mysteryReveal / worldBuilding`; Tone order is `characterArcWeight /
relationshipStructure / comedy / darkness / mentalStress / romance /
emotionalWarmth`. `U` is terminal `unknown`.

| Pos | Work                         | Narrative           | Tone                  | Gate     |
| --: | ---------------------------- | ------------------- | --------------------- | -------- |
|  31 | 軍靴のバルツァー             | `2/U/3/2/U/3` = 4/6 | `2/2/U/2/U/U/2` = 4/7 | fail T+1 |
|  32 | flat                         | `U/0/0/1/0/U` = 4/6 | `3/2/2/U/1/U/4` = 5/7 | pass     |
|  33 | スーパーの裏でヤニ吸うふたり | `U/0/0/1/U/0` = 4/6 | `3/2/2/U/1/U/3` = 5/7 | pass     |
|  34 | ケロロ軍曹                   | `U/U/1/2/0/2` = 4/6 | `U/2/3/0/0/U/U` = 4/7 | fail T+1 |
|  35 | 百姓貴族                     | `0/U/U/2/0/2` = 4/6 | `U/2/4/2/2/U/2` = 5/7 | pass     |
|  36 | 月刊少女野崎くん             | `0/U/U/2/0/2` = 4/6 | `3/3/4/U/U/2/2` = 5/7 | pass     |
|  37 | 私の推しは悪役令嬢。         | `2/2/U/2/U/2` = 4/6 | `4/2/3/U/U/4/2` = 5/7 | pass     |
|  38 | 僕とロボコ                   | `0/U/0/U/0/2` = 4/6 | `U/2/2/0/0/U/3` = 5/7 | pass     |
|  39 | 屍鬼                         | `U/2/U/2/3/2` = 4/6 | `2/2/U/4/2/U/U` = 4/7 | fail T+1 |
|  40 | 大ダーク                     | `U/1/1/2/1/2` = 5/6 | `U/2/4/2/1/0/2` = 6/7 | pass     |

## Outcome

| Outcome                            |   Count |
| ---------------------------------- | ------: |
| Candidate axes accepted            |      46 |
| Candidate axes revised or rejected |       0 |
| Candidate axes closed unknown      |       4 |
| Text coverage pass                 | 7 works |
| Finite second evidence search      | 3 works |
| Hard blocker                       |       0 |
| Pending proposal inside this round |       0 |

The three finite searches are frozen in
`text-gap-queue-chunk-04-round-02.csv`. If no additional directly corresponding
Tone evidence exists, the Axis remains `unknown` and the actual coverage gate
determines a blocker candidate. Art availability, workload, or catalog size do
not alter that decision.
