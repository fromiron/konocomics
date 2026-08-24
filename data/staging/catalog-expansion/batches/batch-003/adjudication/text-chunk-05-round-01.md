# Batch 003 text adjudication — chunk 05, round 01

- `reviewedByHuman=false`
- Adjudicator: Primary Local Codex Pass C
- Scope: frozen positions 41–50, first 1–3 volumes or first major episode
- Date: 2026-08-25
- Candidate manifest identity SHA-256: `2277f22c0c0f4b04815801059a4faca0db316d9de5efe1027cb3221725c9c410`
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`; Art known `>= 2/4`; at least one Genre and one Theme
- Rule: Pass A, exact Cursor Grok non-fast review, independent official-evidence review, and the bounded user-review packet are compared against the Factor Dictionary. Disagreement is never averaged or decided by vote.
- Boundary: this round closes every text proposal as retained, modified, dropped, or `unknown`. It does not promote a Work. Art is read only for the separate gate count.

## Frozen inputs

| Input                                               | SHA-256                                                            |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `manifest.json`                                     | `2425deaaa1672ba12f089d3a4633b2cef86bb610980fb41506c8f73e4fe5bdb3` |
| `frozen-work-set.csv`                               | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `docs/factors/factor-dictionary.md`                 | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                  | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `annotation-review-adjudication-request.md`         | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `research/chunk-05.md`                              | `b0db5cfb6a223c87bff5352860e11bff37d62259cd74d75644d3f02fe3150f68` |
| `research/text-gap-chunk-05.md`                     | `eea4a8e1b1bb79b847f59d3a0cd2307b43171d407343a80d16e2604a33d522a8` |
| `research/text-gap-chunk-05-round-01.md`            | `2fa794c450615f51104e63e46c67cd5d063b4403b0580c22477cef99b419d987` |
| `research/user-review-signals-chunk-05-round-01.md` | `6f6143aafeae5e7f358998fba98c57a03b6a8bf59985f0d038e88a2a359033e4` |
| `annotation-pass-a/chunk-05/factors.csv`            | `eb1e4d2153b423f13c06b52e90328d111ebfe8a8c7dab5c89e46b0a2b95b0c7a` |
| `annotation-pass-a/chunk-05/genres.csv`             | `df517b745528b5b41af3bd9bb649e674b9846ea66fbbc0c7b555e2424c967184` |
| `annotation-pass-a/chunk-05/themes.csv`             | `537f289833b4cee4577e99c33aeab01b343098878456b7a019b0bacbae954a73` |
| `annotation-pass-a/chunk-05/notes.md`               | `78ad3229483e58814ee340c9d9329ff3f4c52d5d88110acf2561548c841b04dc` |
| `reviews/grok-text-review-response-chunk-05.txt`    | `279b4778fd3e313b6e1d8237c36f06a0d320fcf118b2428a1a1308ac7a18c764` |
| `reviews/grok-text-review-ledger-chunk-05.md`       | `80ada737a4d400d988f85cf17bb85473a98257dd05efa8570ba55b6978f765db` |
| `reviews/text-gap-chunk-05-independent-review.md`   | `4b0a035f527822d0d1be31b6b62f57ab4a5530ee9edef5db6ef02055490dd8bf` |
| `reviews/identity-safety-chunk-05.md`               | `72d8247481be2a73634221d4dc774ae8428b54c1b6fc2eb2925b6ae24ae3fcd5` |
| `adjudication/identity-chunk-05.md`                 | `6bb6ed92ebc47cfe78ab9bc034c09e2ccaa7d2389f6c25270fda6e7f2efb91b5` |

The counted Cursor run used exact `cursor-grok-4.6-high` non-fast, completed normally, returned `ART_ABSTAIN`, and made no repository edits. The bounded user-review pass found zero qualifying independent-review pairs and contributed no Factor value. Model output remains non-human review input.

## Round-01 decisions

Notation: Narrative order is `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`; Tone order is `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`; `U` means explicitly closed `unknown`.

### 41. ファントムバスターズ

- Narrative: `U / U / U / 2 / U / 2` = **2/6**.
- Tone: `2 / 2 / 2 / U / U / U / 2` = **4/7**.
- Retain the bounded team, school-supernatural setting, and member-support observations. Add `comedy=2`: exact volume 1 and 3 copy ties intermittent incongruous school/exorcism situations to the entry range, but does not support core comedy 4. Reject `mentalStress`; one concern lacks repeated duration and intensity.
- Retain Genres `action;fantasy` and Theme `school:2`.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Narrative short by 2 and Tone short by 1.

### 42. 湯神くんには友達がいない

- Narrative: `U / U / U / 2 / U / 0` = **2/6**.
- Tone: `2 / 2 / 2 / 0 / U / 1 / U` = **5/7**.
- Modify `characterArcWeight 3 -> 2`; retain the fixed pair, ordinary-school darkness absence, and bounded one-episode romantic current. Add `comedy=2` from the exact volume-2 chain of mismatched intentions and misunderstandings. No source establishes two more recurring Narrative mechanisms.
- Retain Genres `sports;comedy;sliceOfLife` and Themes `school:2;sportsCompetition:1`.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Narrative short by 2.

### 43. 姉の結婚

- Narrative: `0 / U / U / 2 / 0 / 0` = **4/6**.
- Tone: `4 / 2 / U / U / 2 / 4 / U` = **4/7**.
- Retain the bounded absence values for mastery progression, clue-reveal reward, and fictional world rules across the exact first three volumes. Retain the central character/relationship/romance and recurring adult relationship pressure values. No reviewed source supplies another Tone axis.
- Use Genres `sliceOfLife;romance`. Reject `workplace`: librarian employment is background context, not a repeated work-procedure reward. No dictionary Theme is forced from marriage or an affair.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Tone short by 1 and Theme missing.

### 44. 放課後のカリスマ

- Narrative: `U / U / U / 2 / 2 / 3` = **3/6**.
- Tone: `2 / 2 / 2 / 2 / 2 / U / U` = **5/7**.
- Modify the Pass A high values to the evidence-bounded matrix above. Add `comedy=2` because the official award juror directly observes gags interspersed with the clone-school mystery within volumes 1–3. Killing and hanging references remain safety-sensitive evidence but do not establish adult-only sale.
- Retain Genres `scienceFiction;mystery` and Theme `school:2`.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Narrative short by 1.

### 45. となりの関くん

- Narrative: `0 / U / U / 2 / 0 / 0` = **4/6**.
- Tone: `0 / 2 / 4 / 0 / 0 / U / U` = **5/7**.
- Retain the repeated independent classroom-gag structure and fixed observing pair. Modify `characterArcWeight 1 -> 0`: the first three volumes repeatedly reset rather than rewarding accumulated character change. Reject the Grok `problemSolving=2` proposal because changing desk games do not expose a recurring constraint-analysis method.
- Retain Genres `comedy;sliceOfLife` and Themes `crafting:1;school:2`.
- Result: **CURRENT_TEXT_GATE_PASS**.

### 46. 男子高校生の日常

- Narrative: `0 / U / 0 / 2 / 0 / 0` = **5/6**.
- Tone: `0 / 3 / 4 / 0 / 0 / U / U` = **5/7**.
- Modify `pacing 3 -> 2` and `characterArcWeight 1 -> 0`; the short rotating gag units are the repeated structure, not rapid serialized state changes or accumulated growth. Retain core comedy, ensemble relationship structure, and bounded absence values.
- Retain Genres `comedy;sliceOfLife` and Theme `school:2`.
- Result: **CURRENT_TEXT_GATE_PASS**.

### 47. 僕の小規模な生活

- Narrative: `2 / U / U / 2 / 0 / 0` = **4/6**.
- Tone: `2 / 2 / 3 / U / U / 2 / 2` = **5/7**.
- Modify `characterArcWeight 3 -> 2`. Add `comedy=3` and `emotionalWarmth=2`: separately attributed official jurors converge on recurring unguarded monologue/editor interactions and the spouse relationship within volume 1. Work friction remains coequal, so neither value is maximized.
- Retain Genre `sliceOfLife` and Theme `workplace:2`.
- Result: **CURRENT_TEXT_GATE_PASS**.

### 48. ハクメイとミコチ

- Narrative: `0 / U / U / 2 / 0 / 4` = **4/6**.
- Tone: `2 / 2 / U / U / U / U / 4` = **3/7**.
- Retain the entry-range vignette structure, fixed pair, and setting-dependent daily activity. Add `emotionalWarmth=4`: two separately attributed official jurors connect recurring work, meals, routine, creatures, and ordinary pleasure to a gentle restorative mode. User reviews only corroborated already-known warmth and supplied no new residual Tone mechanism.
- Retain Genres `fantasy;sliceOfLife` and Themes `adventure:1;exploration:1`.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Tone short by 2.

### 49. 空挺ドラゴンズ

- Narrative: `U / U / U / 3 / U / 4` = **2/6**.
- Tone: `2 / 2 / U / 2 / U / U / U` = **3/7**.
- Retain the recurring hunting/work/cooking/airship setting evidence. Reject `mentalStress=2`: one fall-and-survival event does not establish sustained subjective pressure. The strongest bounded user review describes the capture-to-processing work cycle, but no second qualifying review establishes a missing analytical, strategic, or Tone mechanism.
- Retain Genres `action;fantasy` and the six Pass A Themes.
- Result: **EVIDENCE_RECOVERY_REQUIRED** — Narrative short by 2 and Tone short by 2.

### 50. ワカコ酒

- Narrative: `0 / 0 / 0 / 2 / 0 / 0` = **6/6**.
- Tone: `0 / 0 / U / 0 / 0 / 0 / 2` = **6/7**.
- Modify `characterArcWeight 1 -> 0` and add `emotionalWarmth=2`. The official volume-one route repeatedly frames solitary food-and-drink episodes as ordinary restorative satisfaction while the entry range does not establish accumulated growth, complex relationships, darkness, stress, or romance.
- Retain Genre `sliceOfLife` and Theme `cooking:2`.
- Result: **CURRENT_TEXT_GATE_PASS**.

## Round-01 outcome

| Outcome                                               | Works |
| ----------------------------------------------------- | ----: |
| Current Narrative/Tone/Genre/Theme text coverage pass |     4 |
| Finite additional evidence recovery exhausted         |     6 |
| Hard blocker at this layer                            |     0 |
| Unresolved proposal inside this round                 |     0 |

Positions 41, 42, 43, 44, 48, and 49 retain explicit residual gaps after the official-first and bounded user-review routes were exhausted. Positions 45, 46, 47, and 50 pass the text gate but still require the independent Art gate and final promotion checks. `unknown` remains a closed nonnumeric state, not a low value or an automatic blocker.
