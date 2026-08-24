# Batch 002 text adjudication — chunk 04, round 01

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Scope: frozen positions 31–40, first 1–3 volumes or first major episode
- Date: 2026-08-23
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`
- Rule: Pass A and the independent Cursor Grok review are compared against the Factor Dictionary and frozen evidence. Disagreement is never averaged or decided by vote.
- Boundary: this round closes every disputed proposal as retained, modified, dropped, or `unknown`. It does not promote a work. Missing coverage is routed to a finite evidence follow-up; Art values are not used to fill text axes.

## Frozen inputs

| Input                                            | SHA-256                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `frozen-work-set.csv`                            | `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6` |
| `docs/factors/factor-dictionary.md`              | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `research/chunk-04.md`                           | `c7436d6d23b304d72700ad7a1d4ebff881ac08e865438a4974c1de36c96b0999` |
| `annotation/pass-a-text-chunk-04.csv`            | `895e2f1715741065bbb5adfb6edf6f0688d09a8b0780d98047c43ade6fb9bb23` |
| `annotation/genres-pass-a-chunk-04.csv`          | `bf2e2325303a6cdf997c403d3e8a3c22b34a50d3f735990326850bcaede0c005` |
| `annotation/themes-pass-a-chunk-04.csv`          | `e432191244003963572bf8f981ecaab3e32626901a19bcd0a57d14eb4df726c3` |
| `annotation/pass-a-text-chunk-04.md`             | `8db250f0688cf4f8dda8b5a8592503f19aba4362bc38b7889e44ad2665e5f2e2` |
| `reviews/grok-text-review-request-chunk-04.md`   | `b8461b4ab93e5d0f0754b28f441126a40034a59fa89f598b663af9503d30c159` |
| `reviews/grok-text-review-response-chunk-04.txt` | `c0d495de2e6693446c038c34e267123a1ef282bbf517c52dd274d3f037faf330` |
| `reviews/grok-text-review-ledger-chunk-04.md`    | `b61a5c2a77ec4fd046a6bb06116721fd40a8798360811d28e06eef7a818903c7` |
| `adjudication/identity-chunk-04.md`              | `65b08172722607773bb10c65940e3052c5c6280abcc2a27606b1694321be255a` |

The successful Grok run used the requested non-fast model, read all nine bound
inputs, completed normally, and abstained from Art. Its ISBN caution for 屍鬼
is superseded by the earlier identity adjudication, which already verified and
retained the unique original volume-1 ISBN. No identity or safety gate is
reopened here.

## Round-01 decisions

Notation: Narrative order is `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`; Tone order is `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`; `U` means explicitly closed `unknown`.

### 1. 軍靴のバルツァー

- Final candidate Narrative: `U / U / 3 / 2 / U / 3` = **3/6**.
- Final candidate Tone: `U / 2 / U / 2 / U / U / U` = **2/7**.
- Modify `strategy 4 -> 3`, `pacing 4 -> 2`, and `worldBuilding 4 -> 3`: the official packet establishes military reform, faction conflict, and a strategist role, but not repeated long-horizon operations, short-interval large changes, or the full anchor-4 world-rule pattern.
- Modify `characterArcWeight 2 -> U` and `relationshipStructure 3 -> 2`; the copy establishes trust and a protagonist-led supporting cast, not sustained inner transformation or a complex relationship web.
- Retain Genre `historical`; remove `action`. Retain `politics:2`, modify `war 2 -> 1` and `school 2 -> 1` because the early scope moves from academy reform into court and battlefield.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1; Tone short by 3.

### 2. flat

- Final candidate Narrative: `U / U / U / U / U / U` = **0/6**.
- Final candidate Tone: `U / 2 / U / U / U / U / U` = **1/7**.
- Modify `pacing 1 -> U` and `characterArcWeight 3 -> U`: short publisher copy confirms the relationship premise but not sustained event magnitude or inner-change reward.
- Retain Genre `sliceOfLife`. Remove `school:1`; a high-school label and one peer do not establish school mechanics. No Theme is asserted from the current packet.
- Result: **RESEARCH_REQUIRED** — Narrative short by 4; Tone short by 4, plus a responsible Theme is still required.

### 3. スーパーの裏でヤニ吸うふたり

- Final candidate Narrative: `U / U / U / 1 / U / U` = **1/6**.
- Final candidate Tone: `3 / 2 / U / U / 1 / U / U` = **3/7**.
- Retain Pass A. Repeated meetings and gradual relationship movement support the existing values, but smoking, workplace setting, and mistaken identity do not automatically fill any unknown Axis.
- Retain Genre `sliceOfLife` and Theme `workplace:2`.
- Result: **RESEARCH_REQUIRED** — Narrative short by 3; Tone short by 2.

### 4. ケロロ軍曹

- Final candidate Narrative: `U / U / U / 2 / U / 2` = **2/6**.
- Final candidate Tone: `U / 2 / 3 / U / U / U / U` = **2/7**.
- Modify `relationshipStructure 3 -> 2`: the Hinata household and assembling platoon form a fixed recurring party, not a complex relationship web.
- Retain Genres `scienceFiction;comedy`. Modify `foundFamily 2 -> 1`; cohabitation and platoon assembly are present, but chosen-family bonds are not yet established as the core reward.
- Result: **RESEARCH_REQUIRED** — Narrative short by 2; Tone short by 3.

### 5. 百姓貴族

- Final candidate Narrative: `U / U / U / 2 / U / 2` = **2/6**.
- Final candidate Tone: `U / U / U / U / U / U / U` = **0/7**.
- Modify `worldBuilding 3 -> 2`: real farm labor and pioneer history provide a functional real-world setting, not recurring invented rules or factions at 3–4.
- Retain Genre `sliceOfLife` and Themes `workplace:2;historicalReconstruction:1`.
- Result: **RESEARCH_REQUIRED** — Narrative short by 2; Tone short by 5.

### 6. 月刊少女野崎くん

- Final candidate Narrative: `U / U / U / 2 / U / 2` = **2/6**.
- Final candidate Tone: `3 / 3 / U / U / U / 2 / U` = **3/7**.
- Modify `relationshipStructure 4 -> 3`: the school and manga-creation cast expands beyond a fixed pair, but the packet does not establish the multi-relation web itself as the anchor-4 reward.
- Retain Genres `comedy;romance` and Themes `school:2;workplace:2`.
- Result: **RESEARCH_REQUIRED** — Narrative short by 2; Tone short by 2. The comedy Genre does not automatically make the comedy Axis known.

### 7. 私の推しは悪役令嬢。

- Final candidate Narrative: `2 / 2 / U / 2 / U / 2` = **4/6**.
- Final candidate Tone: `4 / 2 / U / U / U / 4 / U` = **3/7**.
- Modify `pacing 3 -> 2`, `worldBuilding 3 -> 2`, and `relationshipStructure 3 -> 2`: the official first three volumes show ordinary arc-unit change, a functional game-world academy, and a central pair with supporting figures.
- Retain directly supported extremes `characterArcWeight=4` and `romance=4`; attraction and Claire's changing relationship are the early plot rather than a genre-only inference.
- Retain Genres `fantasy;romance` and Themes `reincarnation:2;school:1;combat:1`.
- Result: **RESEARCH_REQUIRED** — Narrative passes; Tone short by 2.

### 8. 僕とロボコ

- Final candidate Narrative: `U / U / U / U / U / 2` = **1/6**.
- Final candidate Tone: `U / 2 / 2 / U / U / U / U` = **2/7**.
- Modify `problemSolving 1 -> U` and `pacing 1 -> U`: highlighted failure episodes do not establish sustained solving method or event magnitude.
- Modify `comedy 3 -> 2`: the official packet proves recurring gags but not the frequency needed for 3–4.
- Retain Genres `scienceFiction;comedy;sliceOfLife`, retain `cooking:1`, and remove `foundFamily:2`; a live-in robot premise alone is not a chosen-family core.
- Result: **RESEARCH_REQUIRED** — Narrative short by 3; Tone short by 3.

### 9. 屍鬼

- Final candidate Narrative: `U / 2 / U / 2 / 3 / 2` = **4/6**.
- Final candidate Tone: `2 / 2 / U / 4 / 2 / U / U` = **4/7**.
- Modify `problemSolving 3 -> 2`, `pacing 3 -> 2`, `mysteryReveal 2 -> 3`, `worldBuilding 3 -> 2`, and `relationshipStructure 4 -> 2`: the packet supports mixed inquiry and action, ordinary mystery escalation, a central unexplained-death question, a functional village setting, and protagonist-led inquiry lines.
- Retain the evidence-backed `darkness=4`; repeated corpses, deaths, fear, and grave verification remain central rather than being inferred from the horror Genre.
- Retain Genres `mystery;horror` and Theme `investigation:2`. Identity, safety, and original ISBN remain verified by the prior adjudication.
- Result: **RESEARCH_REQUIRED** — Narrative passes; Tone short by 1.

### 10. 大ダーク

- Final candidate Narrative: `U / U / U / 2 / U / 2` = **2/6**.
- Final candidate Tone: `U / 2 / U / 2 / U / U / U` = **2/7**.
- Modify `pacing 4 -> 2`, `worldBuilding 4 -> 2`, `relationshipStructure 3 -> 2`, and `darkness 3 -> 2`: early travel, infiltration, rescue, factions, and serious violence support ordinary arc change and danger, not anchor-4 frequency or scope.
- Retain Genres `action;scienceFiction` and Themes `adventure:2;combat:2`; remove `foundFamily:2` because companion assembly and one rescue do not yet make chosen-family bonds the core reward.
- Result: **RESEARCH_REQUIRED** — Narrative short by 2; Tone short by 3.

## Round-01 outcome

| Outcome                               | Works |
| ------------------------------------- | ----: |
| Text coverage pass                    |     0 |
| Finite additional evidence search     |    10 |
| Hard blocker                          |     0 |
| Unresolved proposal inside this round |     0 |

All `unknown` decisions are closed states for the current packet, not low
values. The ten evidence searches are frozen in
`text-gap-queue-chunk-04.csv`; failure to recover a responsible known value
leaves the Axis `unknown` and triggers an actual coverage-gate decision rather
than fabricated data.
