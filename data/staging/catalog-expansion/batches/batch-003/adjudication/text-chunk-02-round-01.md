# Batch 003 text adjudication — chunk 02, round 01

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Scope: frozen positions 11–20, first 1–3 volumes or first major episode
- Date: 2026-08-23
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`; Art known `>= 2/4`; at least one Genre and one Theme
- Rule: Pass A, the independent Cursor Grok review, and the independently reviewed supplemental packet are compared against the Factor Dictionary and frozen Evidence. Disagreement is never averaged or decided by vote.
- Boundary: this round closes every reviewed proposal as retained, modified, dropped, or `unknown`. It does not promote a Work. Art is read only for the separate gate count and is never used to fill a text axis.

## Frozen inputs

| Input                                             | SHA-256                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| `frozen-work-set.csv`                             | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `docs/factors/factor-dictionary.md`               | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `research/chunk-02.md`                            | `7c59174ec97cc10922aabc09208f19e04e74ea6a852734cb9dbdf77ebdc5add5` |
| `research/text-gap-chunk-02.md`                   | `ea835cbab65bd6fff24f6465d8cb53cf4cd71896fdc27071a1cbae2bcf51eef5` |
| `annotation-pass-a/chunk-02/factors.csv`          | `fadb3aad99068ca027c887ad3f372b05272206d88e6dc4ef7dea79c16c1c452e` |
| `annotation-pass-a/chunk-02/genres.csv`           | `c403be06bdea6fb71a218b7faaaa549d302873f1ab85a9d5ff1de94788444459` |
| `annotation-pass-a/chunk-02/themes.csv`           | `2a4e92d21ec4cb05c889834cf42859cb837f5247e53f7f3924411ae53968b575` |
| `annotation-pass-a/chunk-02/notes.md`             | `5aea0caf4802bbe504aee15d169962b05e9050c6837b89c232825985f28fc99c` |
| `reviews/grok-text-review-request-chunk-02.md`    | `29e05a2f50629eefc0e25e54f4a81d068c66caf731783465fb83cc983e405d31` |
| `reviews/grok-text-review-response-chunk-02.txt`  | `0f2eae1459c63e6f39010b5e824700c62268a94b8e4ba8434d2d9b50a0a14eaf` |
| `reviews/grok-text-review-ledger-chunk-02.md`     | `349f2019be6e406b1952dcf9f0ade089e2e45d82dab7a738cf9c446f97a1d5a8` |
| `reviews/text-gap-chunk-02-independent-review.md` | `40bc69c7cfb49884bd032b6946bbd492d61c22ddf087c20f94ef82f7b2cd2e63` |
| `adjudication/identity-chunk-02.md`               | `6a7e2bb6d0adbcf967d30f1478dfe80940fa77ed4cdf589506807eea2f182a26` |
| `art-review/chunk-02/final-art.csv`               | `7c7398cad89c69ef31b38014993706efba956112b511d2258a8e73544ed2d4b5` |

The counted Cursor run used exact `cursor-grok-4.6-high` non-fast, completed normally, read the frozen inputs, and returned `ART_ABSTAIN`. Muse was not used and Ox remained excluded. Model output is review input, not human approval or a promotion decision.

## Round-01 decisions

Notation: Narrative order is `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`; Tone order is `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`; Art order is `artRealism / artDensity / visualSoftness / motionImpact`; `U` means explicitly closed `unknown`.

### 11. 暗殺教室

- Narrative: `U / 2 / 2 / 2 / U / 2` = **4/6**.
- Tone: `U / 2 / 2 / 2 / U / U / 2` = **4/7**.
- Art: `1 / 3 / 2 / U` = **3/4**.
- Add `problemSolving=2` and `strategy=2`: official volumes 2–3 and separately attributed official jurors establish recurring bounded assassination preparations, counters, prepared information, and rescue without supporting long-horizon strategy.
- Modify `comedy 3 -> 2`; close `characterArcWeight` as `unknown`. Care and education appear in jury observations, but the entry descriptions do not directly establish repeated character-change reward.
- Use Genre `comedy` and Theme `school:2`; remove `action`, `sliceOfLife`, and `combat:2` because the packet establishes events and a classroom premise, not those additional work-level classifications.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Tone short by 1.

### 12. 乱と灰色の世界

- Narrative: `U / U / U / 2 / U / 2` = **2/6**.
- Tone: `U / 2 / U / U / U / 2 / 3` = **3/7**.
- Art: `U / U / U / U` = **0/4**.
- Add `pacing=2`, `romance=2`, and `emotionalWarmth=3` from multiple separately attributed official jurors restricted to the entry range. Retain `worldBuilding=2`: the official volume-3 rule violation, concealed magic, and magical-family premise make the setting functional, but do not support anchor 4.
- Close `characterArcWeight` and `comedy` as `unknown`; the same jury packet does not directly establish their recurrence or intensity as Axis values. Use Genre `fantasy` only.
- No dictionary Theme matches a biological magical family without semantic distortion. `foundFamily` is not substituted.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Narrative short by 2, Tone short by 2, Art short by 2, and Theme missing.

### 13. 劇光仮面

- Narrative: `U / 2 / U / 2 / 3 / 2` = **4/6**.
- Tone: `U / 2 / U / 2 / U / U / U` = **2/7**.
- Art: `4 / 4 / 0 / U` = **3/4**.
- Modify `pacing 3 -> 2` and `worldBuilding 3 -> 2`; add `problemSolving=2`, `mysteryReveal=3`, and `relationshipStructure=2` from the official fabrication problem, volume-2 directional reveal, former club circle, and volume-3 rival.
- Close `characterArcWeight` and `mentalStress` as `unknown`. Self-perception, one trial, and ominous atmosphere do not establish sustained change or subjective pressure across the entry range.
- Use Genre `action` and Theme `crafting:1`; remove `scienceFiction` and `combat:1` because the packet supports a real-world suit device and one challenge, not those recurring classifications.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Tone short by 3.

### 14. その着せ替え人形は恋をする

- Narrative: `2 / U / U / 2 / U / 2` = **3/6**.
- Tone: `2 / 2 / 2 / U / U / 3 / 2` = **5/7**.
- Art: `2 / 2 / 3 / U` = **3/4**.
- Add `worldBuilding=2` and `comedy=2`: official volumes establish recurring craft practice, source-material study, event conventions, and comic reversals. They do not expose enough solution steps for `problemSolving`.
- Modify `characterArcWeight 3 -> 2` and `emotionalWarmth 3 -> 2`; retain `progression=2`, `pacing=2`, `relationshipStructure=2`, and `romance=3`.
- Retain Genres `sliceOfLife;romance` and Themes `crafting:2;school:1`.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Narrative short by 1.

### 15. 高杉さん家のおべんとう

- Narrative: `2 / 2 / U / 1 / 2 / U` = **4/6**.
- Tone: `2 / 2 / 2 / U / U / 1 / 2` = **5/7**.
- Art: `2 / 3 / 3 / U` = **3/4**.
- Add `progression=2`, `problemSolving=2`, `pacing=1`, and `comedy=2` from the repeated bento-mediated household formation and communication problems.
- Retain `mysteryReveal=2`: the licensed exact-volume description directly identifies the volume-3 birth-related secret; the limited source tier prevents a stronger value but does not require discarding the bounded reveal.
- Resolve the romance conflict as `romance=1`, not an average. Official-jury observations explicitly call the early component slight or ambiguous, which is stronger than treating the guardian premise as affirmative absence.
- Modify `characterArcWeight 3 -> 2` and `emotionalWarmth 3 -> 2`. Use Genre `sliceOfLife` and Theme `cooking:2`; remove `workplace:1` and `foundFamily:2`.
- Result: **CURRENT_GATE_PASS**.

### 16. 刻刻

- Narrative: `U / 2 / 2 / 3 / 2 / 4` = **5/6**.
- Tone: `2 / 2 / U / 4 / 3 / U / 2` = **5/7**.
- Art: `3 / 3 / 1 / U` = **3/4**.
- Close `progression` as `unknown`; ability disclosure is not repeated growth or mastery. Modify `strategy 1 -> 2`, `mysteryReveal 3 -> 2`, `worldBuilding 3 -> 4`, `relationshipStructure 3 -> 2`, and `darkness 3 -> 4` against the direct official volumes 1–3 rules, factions, violence, and family-rescue structure.
- Use Genre `fantasy` and Theme `survival:1`; remove the additional Pass A Genres and `combat:2`, which describe incidents rather than repeated work-level classifications in the frozen packet.
- Result: **CURRENT_GATE_PASS**.

### 17. BUTTER！！！

- Narrative: `2 / U / U / 2 / U / 2` = **3/6**.
- Tone: `2 / 2 / U / 1 / 2 / U / 2` = **5/7**.
- Art: `2 / 1 / 3 / U` = **3/4**.
- Modify `progression 3 -> 2`, `characterArcWeight 3 -> 2`, `mentalStress 3 -> 2`, and `emotionalWarmth 3 -> 2`; add `darkness=1` for the bounded body-shaming and dance crisis without inflating them to serious danger.
- Add `worldBuilding=2`: official volume material, the creator interview, and jury observations align on paired-dance practice, rules, and culture as a functional recurring setting. Close `problemSolving` and `romance` as `unknown`.
- Retain Genres `sports;sliceOfLife` and Theme `school:2`.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Narrative short by 1.

### 18. トクサツガガガ

- Narrative: `U / U / U / 2 / U / U` = **1/6**.
- Tone: `2 / 2 / 3 / U / 2 / U / 2` = **5/7**.
- Art: `2 / 2 / 2 / U` = **3/4**.
- Modify `pacing 1 -> 2`, `characterArcWeight 3 -> 2`, and `mentalStress 3 -> 2`; add `comedy=3` from recurring official-jury observations while serious fan-life problems remain substantial.
- Close `progression`, `problemSolving`, and `worldBuilding` as `unknown`. Widening a friend group is not mastery, applying hero sayings is not enough to establish constraint analysis, and modern fandom objects are not fictional world rules.
- Retain Genre `sliceOfLife` and Theme `workplace:2`.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Narrative short by 3.

### 19. もやしもん

- Narrative: `U / 2 / 2 / 2 / 2 / 2` = **5/6**.
- Tone: `U / 2 / 3 / U / U / U / 3` = **3/7**.
- Art: `2 / 3 / 2 / U` = **3/4**.
- Add `problemSolving=2`, `strategy=2`, `pacing=2`, `mysteryReveal=2`, `comedy=3`, and `emotionalWarmth=3`. The licensed volume-2 event and repeated independently attributed entry observations support bounded solution attempts, tactics, reveal, comic payoff, and gentle tone; same-platform concentration prevents an extreme warmth value.
- Retain `worldBuilding=2` and `relationshipStructure=2`. Use Genres `sliceOfLife;fantasy` and Theme `school:2`; remove `scienceFiction` because the ability is not framed as science or technology.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Tone short by 2.

### 20. きょうは会社休みます。

- Narrative: `2 / U / U / 2 / U / U` = **2/6**.
- Tone: `2 / 2 / U / U / U / 4 / 2` = **4/7**.
- Art: `2 / 2 / 3 / U` = **3/4**.
- Modify `progression 3 -> 2`: official volumes and supplemental observations support gradual entry into a first relationship and repeated new relationship experiences, but not recurring mastery at anchor 4. Retain `pacing=2`.
- Modify `characterArcWeight 3 -> 2`; close `mentalStress` as `unknown` because the volume-3 rival is one event. Retain `relationshipStructure=2`, `romance=4`, and `emotionalWarmth=2`.
- Retain Genres `sliceOfLife;romance`; modify Theme `workplace 2 -> 1` because the company is the meeting context rather than the central work-procedure reward.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Narrative short by 2 and Tone short by 1.

## Round-01 outcome

| Outcome                                              | Works |
| ---------------------------------------------------- | ----: |
| Current Narrative/Tone/Art/Genre/Theme coverage pass |     2 |
| Finite additional evidence recovery                  |     8 |
| Hard blocker                                         |     0 |
| Unresolved proposal inside this round                |     0 |

All `unknown` decisions are closed states for the current packet, not low values. The eight bounded recovery routes are frozen in `text-gap-queue-chunk-02.csv`. Failure to recover responsible values leaves the axes `unknown` and triggers the unchanged promotion gate rather than fabricated data, threshold changes, or indefinite pending.
