# Batch 002 text adjudication — chunk 05, round 01

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Scope: frozen positions 41–50, first 1–3 volumes or first major episode
- Date: 2026-08-23
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`
- Rule: Pass A and the independent Cursor Grok review are compared against the Factor Dictionary and frozen evidence. Disagreement is never averaged or decided by vote.
- Boundary: this round closes every disputed proposal as retained, modified, dropped, or `unknown`. It does not promote a work. Missing coverage is routed to a finite evidence follow-up; Art values are not used to fill text axes.

## Frozen inputs

| Input                                            | SHA-256                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `frozen-work-set.csv`                            | `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6` |
| `docs/factors/factor-dictionary.md`              | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `research/chunk-05.md`                           | `acc50bd535669e00a1bc115cfed4203835f5e9e76a9218f196eb6124f3fcb02c` |
| `annotation/pass-a-text-chunk-05.csv`            | `989c0fe9f95c94290d878d817e95e64b2ca46e4dccca5f0be3b00417a93a81c0` |
| `annotation/genres-pass-a-chunk-05.csv`          | `c4658542c5c98244a01815eab6b0b3f94f8d4c3879049dd704a130f88f18bf4b` |
| `annotation/themes-pass-a-chunk-05.csv`          | `a4ee3285e4856428908327d42f11297aa70c3875305a6bbbecaa0ca548c77b60` |
| `annotation/pass-a-text-chunk-05.md`             | `e917d2e44f04231b9348cc8a7822a5836b6014c7f8135e2282327948eb5eeb53` |
| `reviews/grok-text-review-request-chunk-05.md`   | `bec793db24edf20018e3341018377ce3207c4ebd08b4bf1c25e8bfbeabeb7d0a` |
| `reviews/grok-text-review-response-chunk-05.txt` | `f5957295343e1ca1ffd66c60e69703c3b9709c4985a616bb4d0a0863472c7f7f` |
| `reviews/grok-text-review-ledger-chunk-05.md`    | `6469f43e39b56bfc2a219ec28e2343c4035228781710956fc7cb485166e51171` |
| `adjudication/identity-chunk-05.md`              | `b5f8a5aa33157e05d7fa39a9da75f586aabaaf7b5aa28616dd18ee48c47d273d` |

The successful Grok run used the requested non-fast model, read all nine bound
review inputs, completed normally, and abstained from Art. Its
`NEEDS_ADJUDICATION` identity and severity cautions are superseded by the
earlier identity adjudication, which verified all ten scope, safety, identity,
and representative-edition outcomes with zero hard blockers. This text pass
does not reopen those gates.

## Round-01 decisions

Notation: Narrative order is `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`; Tone order is `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`; `U` means explicitly closed `unknown`.

### 1. サンキューピッチ

- Final candidate Narrative: `U / 2 / 2 / 2 / 2 / 2` = **5/6**.
- Final candidate Tone: `2 / 2 / U / U / 2 / U / U` = **3/7**.
- Modify `pacing 3 -> 2` and `relationshipStructure 3 -> 2`: the official first three volumes establish ordinary match-to-roster progression and a fixed team, not short-interval state swings or an ensemble relationship web.
- Retain Genre `sports` and Themes `school:1;sportsCompetition:2`.
- Result: **RESEARCH_REQUIRED** — Narrative passes; Tone short by 2.

### 2. うさぎドロップ

- Final candidate Narrative: `U / U / U / U / U / U` = **0/6**.
- Final candidate Tone: `U / U / U / U / U / U / U` = **0/7**.
- Keep every Axis `unknown`: the official material confirms the shared-caregiving premise but the original volumes 1–3 still lack a contents bridge sufficient for sustained Axis judgments.
- Add Genre `sliceOfLife`; this describes the official first major episode without supplying any Axis value. No Theme is asserted from the current packet.
- Result: **RESEARCH_REQUIRED** — Narrative short by 4; Tone short by 5; an original-edition contents bridge and a responsible Theme remain required.

### 3. 水は海に向かって流れる

- Final candidate Narrative: `U / U / U / 3 / 3 / U` = **2/6**.
- Final candidate Tone: `4 / 3 / U / 2 / 3 / U / U` = **4/7**.
- Retain Pass A. The complete three-volume official copy directly supports motive and inherited-history disclosure, character focus, shared-house relationships, and sustained stress, but not the unknown methods or tonal dimensions.
- Retain Genre `sliceOfLife`; no Theme is asserted from the current packet.
- Result: **RESEARCH_REQUIRED** — Narrative short by 2; Tone short by 1; a responsible Theme remains required.

### 4. 凪のお暇

- Final candidate Narrative: `U / U / U / 2 / U / U` = **1/6**.
- Final candidate Tone: `4 / 3 / U / 2 / 2 / 3 / 2` = **6/7**.
- Modify `mentalStress 3 -> 2`: the entry begins with collapse and self-suppression but repeatedly balances tension with comfortable new ties and relief.
- Retain Genres `sliceOfLife;romance` and Theme `workplace:1`.
- Result: **RESEARCH_REQUIRED** — Tone passes; Narrative short by 3.

### 5. 逃げ上手の若君

- Final candidate Narrative: `2 / 2 / 2 / 3 / U / 3` = **5/6**.
- Final candidate Tone: `2 / 3 / U / 3 / U / U / U` = **3/7**.
- Modify `problemSolving 3 -> 2`, `pacing 4 -> 3`, `characterArcWeight 3 -> 2`, and `darkness 4 -> 3`: the packet supports mixed tactics and action, roughly one major situation per volume, balanced character change, and severe but not continuously central tragedy.
- Retain Genres `action;historical`. Modify `combat 2 -> 1`; retain `war:2;politics:1;survival:2;historicalReconstruction:2`.
- Result: **RESEARCH_REQUIRED** — Narrative passes; Tone short by 2.

### 6. タコピーの原罪

- Final candidate Narrative: `U / U / U / 4 / U / U` = **1/6**.
- Final candidate Tone: `4 / 3 / U / 4 / U / U / U` = **3/7**.
- Retain Pass A. The complete two-volume official packet directly supports rapid large changes, character-centered circumstances, a recurring relationship core, and central severe events. It does not justify filling the remaining axes.
- Retain Genre `scienceFiction` and Theme `school:1`.
- Result: **RESEARCH_REQUIRED** — Narrative short by 3; Tone short by 2.

### 7. 闇のパープル・アイ

- Final candidate Narrative: `U / U / U / 4 / 3 / 2` = **3/6**.
- Final candidate Tone: `4 / 2 / U / 4 / U / 2 / U` = **4/7**.
- Modify `relationshipStructure 3 -> 2`: the early scope has a protagonist and recurring core supports, not a multi-viewpoint ensemble network.
- Retain Genres `fantasy;horror`. Modify `survival 2 -> 1`; retain `revenge:1`.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1; Tone short by 1.

### 8. YAIBA

- Final candidate Narrative: `4 / U / U / 4 / U / 3` = **3/6**.
- Final candidate Tone: `2 / 2 / U / 2 / U / U / U` = **3/7**.
- Modify `relationshipStructure 3 -> 2`: father, rival, and master form a fixed shonen support set rather than an ensemble relationship web.
- Retain Genres `action;fantasy` and Themes `combat:2;martialArts:2`.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1; Tone short by 2.

### 9. 夢の碑

- Final candidate Narrative: `U / U / U / U / U / U` = **0/6**.
- Final candidate Tone: `U / U / U / U / U / U / U` = **0/7**.
- Keep all Axis, Genre, and Theme cells `unknown` or empty. Current story collections are not officially bridged to the frozen original PF volumes 1–3, so their descriptions cannot be silently transferred.
- Result: **RESEARCH_REQUIRED** — Narrative short by 4; Tone short by 5; Genre and Theme still require an original-edition contents bridge.

### 10. おそ松くん

- Final candidate Narrative: `U / U / U / U / U / U` = **0/6**.
- Final candidate Tone: `U / U / U / U / U / U / U` = **0/7**.
- Keep all Axis, Genre, and Theme cells `unknown` or empty. The 1962 origin, 1987 revival, 1988 representative edition, and later adaptations are distinct chronology facts, not a contents bridge for sustained entry-scope judgments.
- Result: **RESEARCH_REQUIRED** — Narrative short by 4; Tone short by 5; Genre and Theme still require an edition-specific contents bridge.

## Round-01 outcome

| Outcome                               | Works |
| ------------------------------------- | ----: |
| Text coverage pass                    |     0 |
| Finite additional evidence search     |    10 |
| Hard blocker                          |     0 |
| Unresolved proposal inside this round |     0 |

All `unknown` decisions are closed states for the current packet, not low
values. The ten evidence searches are frozen in
`text-gap-queue-chunk-05.csv`; failure to recover a responsible known value
leaves the Axis `unknown` and triggers an actual coverage-gate decision rather
than fabricated data.
