# Batch 002 text adjudication — chunk 03, round 01

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Scope: frozen positions 21–30, first 1–3 volumes or first major episode
- Date: 2026-08-23
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`
- Rule: Pass A and the independent Cursor Grok review are compared against the Factor Dictionary and frozen evidence. Disagreement is never averaged or decided by vote.
- Boundary: this round closes every disputed proposal as retained, modified, dropped, or `unknown`. It does not promote a work. Missing coverage is routed to a finite evidence follow-up; Art values are not used to fill text axes.

## Frozen inputs

| Input                                            | SHA-256                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `frozen-work-set.csv`                            | `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6` |
| `docs/factors/factor-dictionary.md`              | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `research/chunk-03.md`                           | `2e31ccaf1d9202ea253e4339ec155405b5c234c15410b2272c2c591a83e368f7` |
| `annotation/pass-a-text-chunk-03.csv`            | `89cf6b2b4d9ebb3e62965f13bf75f51eed210f8fb124dd6a32af10a26090e018` |
| `annotation/genres-pass-a-chunk-03.csv`          | `9825c2dd5173dd676b68c3993c6e86438ab6016f943753098312d63302f57799` |
| `annotation/themes-pass-a-chunk-03.csv`          | `7977448ab8682323d0fe7538ed096cb5f9a206fc4cd5e93d2cf90200252ea6a7` |
| `annotation/pass-a-text-chunk-03.md`             | `0e4245dbbb9e31d1b7e080fe50d5d21df328b2fe28e9f1542aa1e3eec272d3da` |
| `reviews/grok-text-review-request-chunk-03.md`   | `6f8654e415d87691dfefbcdfc6d784e9c730ac3b1c7cc5cc404a27755a3da4ae` |
| `reviews/grok-text-review-response-chunk-03.txt` | `3916ba2f6a35c7ad27f6fabd7e95e5e30454ae1cbf90e1a9f27c3f020ee7d0fe` |
| `reviews/grok-text-review-ledger-chunk-03.md`    | `84ee2634dc638e53f70573315728a91171c1c21cfa138a41208537cf60259739` |
| `adjudication/identity-chunk-03.md`              | `1d2ef4131fd464f73cb7d32ac2fc2f1cee82211c27b4978cc4284bc7d14b15c5` |

The successful Grok run used the requested non-fast model, was isolated from
prior review conclusions, and abstained from Art. Its two edition cautions are
annotation-scope limitations after the separate identity adjudication; neither
reopens Work identity nor creates a safety blocker.

## Round-01 decisions

Notation: Narrative order is `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`; Tone order is `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`; `U` means explicitly closed `unknown`.

### 1. 機動警察パトレイバー

- Final candidate Narrative: `U / U / U / U / U / U` = **0/6**.
- Final candidate Tone: `U / U / U / U / U / U / U` = **0/7**.
- Retain blank Genre and no Theme. The standard-volume descriptions are not an official contents bridge to frozen wide ISBN `9784091247216`.
- Result: **RESEARCH_REQUIRED** — Narrative short by 4; Tone short by 5. The edition limitation is not an identity, safety, or Art blocker.

### 2. あさひなぐ

- Final candidate Narrative: `4 / U / U / 3 / U / 2` = **3/6**.
- Final candidate Tone: `4 / 2 / U / U / 2 / U / 2` = **4/7**.
- Retain `progression=4`: qualification, equipment acquisition, repeated training, comparison, and confrontation with weakness directly meet the repeated growth and acquisition anchor across official volumes 1–3.
- Modify `relationshipStructure 3 -> 2`: the club is a fixed team plus core supporting cast, not a complex ensemble relationship reward.
- Retain Genre `sports` and Themes `martialArts:2;school:2;sportsCompetition:2`.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1; Tone short by 1.

### 3. 高台家の人々

- Final candidate Narrative: `U / U / U / 3 / U / 2` = **2/6**.
- Final candidate Tone: `4 / 2 / U / U / 2 / 4 / U` = **4/7**.
- Modify `relationshipStructure 3 -> 2`: the central pair, siblings, and mother remain two leads plus key supporting cast.
- Retain Genres `fantasy;romance`, Theme `workplace:1`, and all other Pass A axes.
- Result: **RESEARCH_REQUIRED** — Narrative short by 2; Tone short by 1.

### 4. 怪物事変

- Final candidate Narrative: `U / U / U / 3 / 2 / 3` = **3/6**.
- Final candidate Tone: `2 / 2 / U / 2 / U / U / U` = **3/7**.
- Modify `relationshipStructure 3 -> 2`: the recurring three-person assignment group is a fixed party.
- Drop Genre `horror`: the official entry packet establishes supernatural inquiry and serious danger but not a sustained horror mode. Retain Genres `fantasy;mystery`.
- Retain Themes `investigation:2;workplace:2` and all other Pass A axes.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1; Tone short by 2.

### 5. SAKAMOTO DAYS

- Final candidate Narrative: `U / U / U / 3 / 1 / 2` = **3/6**.
- Final candidate Tone: `3 / 2 / U / 2 / U / U / 2` = **4/7**.
- Modify `relationshipStructure 3 -> 2`: shop, family, and Shin are a fixed core; incoming assassins do not make relationship-network complexity the reward.
- Retain Genre `action` and Theme `combat:2`. Add `tournament:1` for the official volume-3 survival-game contest, limited to episode-level centrality.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1; Tone short by 1.

### 6. 図書館の大魔術師

- Final candidate Narrative: `4 / U / U / 3 / U / 4` = **3/6**.
- Final candidate Tone: `4 / 2 / U / 2 / 2 / U / 2` = **5/7**.
- Modify `relationshipStructure 3 -> 2`: a forming travel and examination party remains a fixed protagonist-led group.
- Retain Genre `fantasy`, Themes `adventure:2;workplace:2`, and all other Pass A axes.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1.

### 7. 聖☆おにいさん

- Final candidate Narrative: `U / U / U / 1 / U / 2` = **2/6**.
- Final candidate Tone: `U / 2 / U / U / U / U / 2` = **2/7**.
- Retain all Pass A axes and Genres `fantasy;comedy;sliceOfLife`. Retain no Theme.
- Result: **RESEARCH_REQUIRED** — Narrative short by 2; Tone short by 3. A comedy Genre does not automatically fill the comedy Axis.

### 8. 黒執事

- Final candidate Narrative: `U / U / U / 3 / 2 / 2` = **3/6**.
- Final candidate Tone: `2 / 2 / U / 2 / U / U / U` = **3/7**.
- Modify `problemSolving 2 -> U`: the official copy establishes an inquiry but does not expose the analysis-versus-action method.
- Modify `mysteryReveal 3 -> 2`: one documented culprit reveal proves secrets and twists, not a repeated clue cadence.
- Modify `darkness 3 -> 2`: serial murder proves serious danger without establishing entry-scope bleakness as the center.
- Retain Genres `historical;mystery` and Themes `combat:1;investigation:2;workplace:2`.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1; Tone short by 2.

### 9. 信長協奏曲

- Final candidate Narrative: `U / U / U / 4 / 2 / 3` = **3/6**.
- Final candidate Tone: `3 / 2 / U / 2 / U / U / U` = **3/7**.
- Modify `relationshipStructure 3 -> 2`: identity substitution and named historical actors remain a protagonist-led core, not a complex ensemble relationship reward.
- Retain Genres `historical;scienceFiction`: a modern student's time displacement remains causal across all three official entry volumes rather than a one-scene label. Retain Themes `war:1;politics:2;timeTravel:2;historicalReconstruction:2`.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1; Tone short by 2.

### 10. 風と木の詩

- Final candidate Narrative: `U / U / U / U / U / U` = **0/6**.
- Final candidate Tone: `U / U / U / U / U / U / U` = **0/7**.
- Retain blank Genre and no Theme. Later bunko descriptions cannot be mapped to frozen original ISBN `9784091302212`; sensitive later-edition events are not projected onto the original entry scope.
- Result: **RESEARCH_REQUIRED** — Narrative short by 4; Tone short by 5. The missing bridge is not itself an identity or safety blocker.

## Round-01 outcome

| Outcome                               | Works |
| ------------------------------------- | ----: |
| Text coverage pass                    |     0 |
| Finite additional evidence search     |    10 |
| Hard blocker                          |     0 |
| Unresolved proposal inside this round |     0 |

All `unknown` decisions are closed states for the current packet, not low
values. The ten evidence searches are frozen in
`text-gap-queue-chunk-03.csv`; failure to recover a responsible known value
leaves the Axis `unknown` and triggers an actual coverage-gate decision rather
than fabricated data.
