# Batch 002 text adjudication — chunk 02, round 01

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Scope: frozen positions 11–20, first 1–3 volumes or first major episode
- Date: 2026-08-23
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`
- Rule: Pass A and the independent Cursor Grok review are compared against the Factor Dictionary and frozen evidence. Disagreement is never averaged or decided by vote.
- Boundary: this round closes every disputed proposal as retained, modified, dropped, or `unknown`. It does not promote a work. Missing coverage is routed to a finite evidence follow-up; Art values are not used to fill text axes.

## Frozen inputs

| Input                                            | SHA-256                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `frozen-work-set.csv`                            | `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6` |
| `docs/factors/factor-dictionary.md`              | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `research/chunk-02.md`                           | `645c8e20898357c3533cb879b197c367209e3fed66c9dceb495c7ee6bf0817ed` |
| `annotation/pass-a-text-chunk-02.csv`            | `19127c718ceda3a0df46df079939605e9353288d90c84cc4609607e2b2ce2410` |
| `annotation/genres-pass-a-chunk-02.csv`          | `15f90688570a8e1edb166fc1c9ca71bc4047edc4de3b2783c8a24641ad08a123` |
| `annotation/themes-pass-a-chunk-02.csv`          | `953ccda344142d5a77d3dd82f2ff07d8de58cdef69e49686b1cb29fda63f2ced` |
| `annotation/pass-a-text-chunk-02.md`             | `4bdb5943013f49cd0015d81f47a2006a1f6466658feb5b510a5589c770a8a991` |
| `reviews/grok-text-review-request-chunk-02.md`   | `194ad1f2ef6cf9603df8c02f6bdb2866ee859d9afd15f4c794d94d6ee828b787` |
| `reviews/grok-text-review-response-chunk-02.txt` | `5645f18ed6bb84484f0c44136cce1df325977b7051d7844753163f44bcec5061` |
| `reviews/grok-text-review-ledger-chunk-02.md`    | `f61b2a90618f50a09ea170d1c879c5e9c5aafe4ef6f6fb60dc21001d1b56ab6f` |
| `adjudication/identity-chunk-02.md`              | `87d28e6c7947711fced1219aa48fa8a2c41df2bc52cd5e6e47a58f0bd35c836c` |

The successful Grok run was isolated from previous review conclusions and
abstained from Art. Its orange, 墨攻, and がんばれ元気 identity cautions are
read as annotation-scope limitations after the separate identity adjudication;
they do not reopen a resolved Work identity or create a safety blocker.

## Round-01 decisions

Notation: Narrative order is `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`; Tone order is `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`; `U` means explicitly closed `unknown`.

### 1. 外天楼

- Final candidate Narrative: `U / 2 / U / 3 / 4 / 2` = **4/6**.
- Final candidate Tone: `U / 2 / U / 2 / U / U / U` = **2/7**.
- Modify `relationshipStructure 4 -> 2`: linked incidents and many named roles converge on one detective through-line; the official one-volume description does not make a complex ensemble relationship network the reward.
- Retain `problemSolving=2`, `pacing=3`, `mysteryReveal=4`, `worldBuilding=2`, `darkness=2`, Genre `mystery`, and Theme `investigation:2`.
- Drop Genre `scienceFiction`: robot and space-police material is one incident inside the converging mystery, not a sustained work-level Genre in the frozen packet.
- Result: **RESEARCH_REQUIRED** — Tone short by 3.

### 2. 忍者と極道

- Final candidate Narrative: `U / U / U / 3 / 2 / 3` = **3/6**.
- Final candidate Tone: `3 / 2 / U / 4 / 3 / U / 1` = **5/7**.
- Modify `pacing 4 -> 3`: the encounter, underground duel, and highway clash are substantial volume-scale changes but do not prove repeated short-interval state changes at anchor 4.
- Modify `relationshipStructure 3 -> 2`: two leads plus faction members remain a protagonist-led core rather than an ensemble relationship reward.
- Retain Genre `action`, Themes `combat:2;revenge:1`, and the remaining Pass A axes.
- Drop Theme `war:2`: the packet directly supports organized recurring combat, but not a distinct campaign or wartime-operations loop beyond the faction clashes already represented by `combat`.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1.

### 3. 嘘解きレトリック

- Final candidate Narrative: `U / 3 / U / 3 / 3 / 2` = **4/6**.
- Final candidate Tone: `2 / 2 / U / 2 / U / U / U` = **3/7**.
- Retain all Pass A axes and Genres `historical;mystery`.
- Retain Theme `investigation:2`; drop `workplace:2` because the recurring reward is case inquiry rather than workplace procedure, and the stable pair is already represented by `relationshipStructure=2`.
- Result: **RESEARCH_REQUIRED** — Tone short by 2.

### 4. orange

- Final candidate Narrative: `U / U / U / U / U / U` = **0/6**.
- Final candidate Tone: `U / U / U / U / U / U / U` = **0/7**.
- Retain blank Genre and no Theme. The later 双葉社 overview is not an official contents bridge to the frozen original 集英社 volumes 1–3, and neither premise nor later-edition Art access substitutes for scoped text evidence.
- Result: **RESEARCH_REQUIRED** — Narrative short by 4; Tone short by 5. The edition limitation is not an identity, safety, or Art blocker.

### 5. 正反対な君と僕

- Final candidate Narrative: `U / U / U / 2 / U / U` = **1/6**.
- Final candidate Tone: `4 / 2 / U / U / 1 / 4 / 4` = **5/7**.
- Modify `progression 2 -> U`: relationship steps and self-reflection support character change, not a repeated growth, acquisition, or mastery reward.
- Modify `relationshipStructure 3 -> 2`: the main pair plus friends and a parallel pair remain a fixed recurring group, not a complex ensemble relationship network.
- Retain Genres `sliceOfLife;romance`, Theme `school:2`, and the other Pass A axes.
- Result: **RESEARCH_REQUIRED** — Narrative short by 3.

### 6. 墨攻

- Final candidate Narrative: `U / 4 / 4 / 3 / 1 / 3` = **5/6**.
- Final candidate Tone: `2 / 3 / U / 3 / U / U / U` = **3/7**.
- Modify `mentalStress 2 -> U`: casualties, injury, and siege danger support darkness, but the summaries do not directly establish sustained subjective pressure as a separate reward.
- Retain all other Pass A axes, Genres `action;historical`, and Themes `combat:2;war:2;territoryManagement:2`.
- The later official e-comic descriptions support content order but remain annotation-scope evidence; they do not rewrite the frozen paper ISBN or identity.
- Result: **RESEARCH_REQUIRED** — Tone short by 2.

### 7. がんばれ元気

- Final candidate Narrative: `2 / U / U / 3 / U / 2` = **3/6**.
- Final candidate Tone: `4 / 2 / U / 2 / 2 / U / 3` = **5/7**.
- Modify `progression 4 -> 2`: entry volumes establish the start, inherited goal, continued practice, and gym introduction, but not repeated clear mastery or acquisition rewards at anchor 4.
- Modify `relationshipStructure 3 -> 2`: father, grandparents, teacher, and gym figures are core supporting characters around one protagonist rather than a widening relationship network.
- Retain Genre `sports`, Themes `martialArts:2;sportsCompetition:2`, and the remaining Pass A axes.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1.

### 8. 赤髪の白雪姫

- Final candidate Narrative: `2 / U / U / 3 / U / 2` = **3/6**.
- Final candidate Tone: `4 / 3 / U / 2 / 2 / 3 / 3` = **6/7**.
- Retain all Pass A axes, Genres `fantasy;romance`, and Themes `politics:1;workplace:1`. The independent review verified the packet without a value conflict.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1.

### 9. 人形芝居

- Final candidate Narrative: `U / U / U / 2 / 2 / 3` = **3/6**.
- Final candidate Tone: `3 / 3 / U / U / U / U / 3` = **3/7**.
- Modify `characterArcWeight 4 -> 3`: loneliness and aid frame the episodes, but the official descriptions do not expose enough outcomes to establish completed character change as an unqualified anchor 4.
- Retain Genres `scienceFiction;sliceOfLife` and the other Pass A axes.
- Drop Theme `crafting:2`: makers and mechanical dolls frame the setting, while the repeated official descriptions center visitor-and-doll encounters rather than a making or crafting loop.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1; Tone short by 2.

### 10. 魔法使いの嫁

- Final candidate Narrative: `U / U / U / U / U / U` = **0/6**.
- Final candidate Tone: `U / U / U / U / U / U / U` = **0/7**.
- Modify `worldBuilding 3 -> U`: the author-supervised guide landing page confirms that setting material exists, but does not expose the entry events, rules, frequency, or guide body needed for an Axis value.
- Retain Genre `fantasy`; retain no Theme.
- Result: **RESEARCH_REQUIRED** — Narrative short by 4; Tone short by 5. The old-to-current Work continuity and Art content bridge do not themselves establish text-factor recurrence.

## Round-01 outcome

| Outcome                               | Works |
| ------------------------------------- | ----: |
| Text coverage pass                    |     0 |
| Finite additional evidence search     |    10 |
| Hard blocker                          |     0 |
| Unresolved proposal inside this round |     0 |

All `unknown` decisions are closed states for the current packet, not low
values. The ten evidence searches are frozen in
`text-gap-queue-chunk-02.csv`; failure to recover a responsible known value
leaves the Axis `unknown` and triggers an actual coverage-gate decision rather
than fabricated data.
