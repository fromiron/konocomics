# Batch 002 text adjudication — chunk 03, round 02

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Scope: frozen positions 21–30, first 1–3 volumes or first major episode
- Date: 2026-08-23
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`
- Method: supplemental official-first evidence and its independent Pass B review are adjudicated per Axis; no averaging or model vote
- Boundary: accepted values are materialized in the chunk-final CSVs. Seven remaining coverage gaps move to one finite second search; no work is promoted by this document.

## Frozen inputs

| Input                                      | SHA-256                                                            |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `adjudication/text-chunk-03-round-01.md`   | `1e14d4b211bdc4110be492cd1e7789b7f29c4350cd5881b113b252ac189cfe2a` |
| `adjudication/text-gap-queue-chunk-03.csv` | `cc63171ad0154276699b0f60b4179e64185b756fcfe8fb90efcd7498a4b6cdcc` |
| `research/text-gap-chunk-03.md`            | `cd2ecf6cc8ec0055b65232e6e4e663999fd29313bd9b2385a176d054ce4477b6` |
| `reviews/text-gap-review-chunk-03.md`      | `d1535dccf318d653286779f23a067e0d9f1ba12846260815ba7e0e9c56a30d98` |
| `adjudication/text-final-chunk-03.csv`     | `b224257c6460525d36847279bed65db452fe33973d322776785b2f8545ddd281` |
| `adjudication/genres-final-chunk-03.csv`   | `f3fc7656aa7e3bbce5c860bcf52a5b03a710b2bf358c39d2751d2cb1269654b4` |
| `adjudication/themes-final-chunk-03.csv`   | `67b3ddd5318d8fd609db7b03971854c9b02edb90f9fe868c0ddf4c24dacb9025` |

The supplemental packet records 58 unique, reachable URLs and separates
official entry-range evidence from independently authored scoped reviews. Pass
B independently accepted all 17 candidate axes and rejected no Genre or Theme
change. Community or user observations are auxiliary only where multiple
independent sources repeat a concrete observation within the official range;
selection provenance, popularity, and genre labels never supply an Axis.

## Pass C decisions

The following candidate values are accepted because their evidence directly
matches the Dictionary and exact entry range:

| Work             | Accepted candidate axes                                                           | Genre or Theme decision                             |
| ---------------- | --------------------------------------------------------------------------------- | --------------------------------------------------- |
| あさひなぐ       | `relationshipStructure=2`, `comedy=2`                                             | no change                                           |
| 高台家の人々     | `relationshipStructure=2`, `comedy=4`, `emotionalWarmth=3`                        | no change                                           |
| 怪物事変         | `relationshipStructure=2`, `comedy=2`, `emotionalWarmth=2`                        | drop unsupported `horror`; retain `fantasy;mystery` |
| SAKAMOTO DAYS    | `relationshipStructure=2`, `comedy=4`                                             | add episode-level `tournament:1`                    |
| 図書館の大魔術師 | `problemSolving=3`, `relationshipStructure=2`                                     | no change                                           |
| 聖☆おにいさん    | `progression=0`, `comedy=4`, `darkness=0`, `mentalStress=0`                       | no change                                           |
| 黒執事           | `problemSolving=3`, `mysteryReveal=2`, `comedy=2`, `darkness=2`, `mentalStress=2` | no change                                           |
| 信長協奏曲       | `strategy=2`, `relationshipStructure=2`, `comedy=2`, `mentalStress=1`             | no change                                           |

The three zero values for 聖☆おにいさん are not copied from its comedy label.
The evidence separately establishes the absence of a growth-loop reward,
entry-range tragic centrality, and sustained psychological pressure. Each
therefore satisfies its own zero anchor. No unsupported candidate was converted
to a midpoint.

## Coverage after round 02

Narrative order is `progression / problemSolving / strategy / pacing /
mysteryReveal / worldBuilding`; Tone order is `characterArcWeight /
relationshipStructure / comedy / darkness / mentalStress / romance /
emotionalWarmth`. `U` is terminal `unknown`, never a low value.

| Pos | Work                 | Narrative           | Tone                  | Gate         |
| --: | -------------------- | ------------------- | --------------------- | ------------ |
|  21 | 機動警察パトレイバー | `U/U/U/U/U/U` = 0/6 | `U/U/U/U/U/U/U` = 0/7 | fail N+4 T+5 |
|  22 | あさひなぐ           | `4/U/U/3/U/2` = 3/6 | `4/2/2/U/2/U/2` = 5/7 | fail N+1     |
|  23 | 高台家の人々         | `U/U/U/3/U/2` = 2/6 | `4/2/4/U/2/4/3` = 6/7 | fail N+2     |
|  24 | 怪物事変             | `U/U/U/3/2/3` = 3/6 | `2/2/2/2/U/U/2` = 5/7 | fail N+1     |
|  25 | SAKAMOTO DAYS        | `U/U/U/3/1/2` = 3/6 | `3/2/4/2/U/U/2` = 5/7 | fail N+1     |
|  26 | 図書館の大魔術師     | `4/3/U/3/U/4` = 4/6 | `4/2/U/2/2/U/2` = 5/7 | pass         |
|  27 | 聖☆おにいさん        | `0/U/U/1/U/2` = 3/6 | `U/2/4/0/0/U/2` = 5/7 | fail N+1     |
|  28 | 黒執事               | `U/3/U/3/2/2` = 4/6 | `2/2/2/2/2/U/U` = 5/7 | pass         |
|  29 | 信長協奏曲           | `U/U/2/4/2/3` = 4/6 | `3/2/2/2/1/U/U` = 5/7 | pass         |
|  30 | 風と木の詩           | `U/U/U/U/U/U` = 0/6 | `U/U/U/U/U/U/U` = 0/7 | fail N+4 T+5 |

## Outcome

| Outcome                            | Works |
| ---------------------------------- | ----: |
| Text coverage pass                 |     3 |
| Finite second evidence search      |     7 |
| Hard blocker                       |     0 |
| Pending proposal inside this round |     0 |

The seven finite searches are frozen in
`text-gap-queue-chunk-03-round-02.csv`. For 機動警察パトレイバー and
風と木の詩, no text claim may cross editions until an official contents bridge
is found. If the second search cannot responsibly establish a needed Axis, that
Axis remains `unknown` and the actual text coverage gate—not workload or Art
availability—determines any blocker candidate.
