# Batch 003 text adjudication — chunk 01, round 01

- adjudicationDate: 2026-08-23
- adjudicator: Local Codex
- reviewedByHuman: `false`
- scope: frozen positions 1–10, entry 1–3 volumes or first major episode
- coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`; Art known or not-applicable `>= 2/4`
- rule: Pass A, Cursor Grok Pass B, targeted Evidence review, and final Art states are resolved from the Factor Dictionary and source scope. Values are never averaged or chosen by vote.
- boundary: this round records the current terminal candidate and the smallest unexhausted recovery route. It does not promote or block a Work.

## Frozen inputs

| Input                                             | SHA-256                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| `frozen-work-set.csv`                             | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `docs/factors/factor-dictionary.md`               | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `research/chunk-01.md`                            | `24504373ec03820b36f87e7b211b4be557d8991b555d831afcdf6dd9b60c5f45` |
| `research/text-gap-chunk-01.md`                   | `2a267025e7e8f00c2d46cc74d2e04988421dc7fd9922ef4ab187b99f2a2df4ac` |
| `annotation-pass-a/chunk-01/factors.csv`          | `cbfa7ef9169cf08552111f4cc66f90ab0b12fe5293bbb051ae009072cf583c6a` |
| `annotation-pass-a/chunk-01/genres.csv`           | `095fa351699e62785694809516e0e39d5d1cf3e0ad4f2ddf38d6f79646c5f74a` |
| `annotation-pass-a/chunk-01/themes.csv`           | `dfb55528d0d548780b15a55b364530bc73eddb6051e21305aa552834b2d10da0` |
| `reviews/grok-text-review-response-chunk-01.txt`  | `8bb43a64bdfee079a9de21153cc2facc1da369efc2848c208c7502240decf69c` |
| `reviews/grok-text-review-ledger-chunk-01.md`     | `37c21844bd50a084d5b13f51f4075cbbd742ea465699bcb92ff41207f5b3b93c` |
| `reviews/text-gap-chunk-01-independent-review.md` | `b28a9fcb18638a3108a2989627b7cdb7b14205188eb4867f5202f8dbe0a75b33` |
| `art-review/chunk-01/final-art.csv`               | `5317de2cc65ab9ffd1b2c1203367159e0259f7ce6433474f31104a7ad523d53a` |

Notation: Narrative is `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`; Tone is `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`; `U` is an explicitly closed unknown.

## Decisions

### 1. 【推しの子】

- Narrative: `2 / U / U / 3 / 2 / 2` = **4/6**.
- Tone: `2 / 2 / 2 / 2 / 2 / U / U` = **5/7**.
- Art: `2 / 2 / 3 / U` = **3/4**.
- Retain `progression=2`: the three official volume descriptions show two protagonists moving from the reincarnation/family-loss state into school, idol preparation, acting, and program work. This is gradual role progression, not merely a Genre inference.
- Modify `pacing 4 -> 3`, `characterArcWeight 3 -> 2`, and `darkness 3 -> 2`; add `mysteryReveal=2` and `mentalStress=2`. Official volumes establish the large turns, while jury and scoped review packets keep the non-extreme anchors.
- Retain `comedy=2`: multiple official jurors explicitly observe comedy beside the serious entry story. Award membership itself is not Evidence.
- Retain Genres `fantasy;mystery` and Themes `revenge:1;reincarnation:2;school:1;workplace:2`.
- Result: **CURRENT_GATE_PASS**.

### 2. 大東京トイボックス

- Narrative: `U / 2 / 2 / 2 / U / 2` = **4/6**.
- Tone: `2 / 2 / U / U / U / U / U` = **2/7**.
- Art: `U / U / U / U` = **0/4**.
- Add `problemSolving=2` from the creator's volume-2/3 development-problem and teamwork account plus the licensed volume descriptions. Retain `strategy=2`, `pacing=2`, `worldBuilding=2`; drop `progression=2` because entry into a role does not alone prove repeated growth reward.
- Retain `characterArcWeight=2`, `relationshipStructure=2`, Genre `sliceOfLife`, and Themes `crafting:2;workplace:2`. The same scoped sources establish a fixed development team and recurring production constraints, but not three more Tone axes.
- Do not convert a named article's unspecific-range pressure or one creator-described teamwork scene into `mentalStress` or `emotionalWarmth`.
- Result: **OFFICIAL_PREVIEW_RECOVERY_REQUIRED** — Tone short by 3; Art short by 2.

### 3. デトロイト・メタル・シティ

- Narrative: `U / U / U / 2 / U / 2` = **2/6**.
- Tone: `2 / 2 / 3 / U / U / U / U` = **3/7**.
- Art: `U / U / U / U` = **0/4**.
- Retain `pacing=2`, `worldBuilding=2`, `characterArcWeight=2`, `relationshipStructure=2`, and `comedy=3`. The exact licensed 1–3 volume descriptions and multiple entry-scope official jurors support the dual-persona music-comedy structure; the conflict over comedy frequency rules out 4.
- Drop `mentalStress=2`; recurring comic embarrassment is not sustained psychological pressure.
- Retain Genre `comedy` and Themes `tournament:1;workplace:1`. The volume-3 festival competition is a bounded sub-arc and the band activity is recurring work, neither centrality 2.
- Result: **OFFICIAL_PREVIEW_RECOVERY_REQUIRED** — Narrative short by 2; Tone short by 2; Art short by 2.

### 4. COSMOS

- Narrative: `2 / 2 / U / 2 / 2 / 2` = **5/6**.
- Tone: `2 / 2 / 2 / 2 / U / U / 2` = **5/7**.
- Art: `2 / 2 / 2 / 3` = **4/4**.
- Use the dictionary anchors rather than intermediate inflation: modify `progression`, `problemSolving`, `pacing`, `mysteryReveal`, and `worldBuilding` from 3 to 2.
- Add `comedy=2` and `emotionalWarmth=2` from aligned official-jury and independent volume-1 observations; neither is raised to an extreme.
- Retain Genres `scienceFiction;mystery` and Themes `investigation:2;workplace:2`.
- Result: **CURRENT_GATE_PASS**.

### 5. 私の少年

- Narrative: `U / U / U / 2 / U / U` = **1/6**.
- Tone: `4 / 2 / U / U / 2 / U / 2` = **4/7**.
- Art: `U / U / U / U` = **0/4**.
- Retain the official-publisher-supported relationship core, modify `mentalStress 3 -> 2`, and drop `darkness=2`: isolation and family conflict establish pressure but not the dictionary's danger/tragedy anchor.
- Retain Genre `sliceOfLife`. Theme remains empty: interviews do not justify forcing school, sports competition, workplace, or found-family semantics onto the central relationship.
- The age-gap relationship is a safety review lead, not an adult-only finding and not a romance-value shortcut.
- Result: **OFFICIAL_PREVIEW_RECOVERY_REQUIRED** — Narrative short by 3; Tone short by 1; Art short by 2; Theme missing.

### 6. 超巡！超条先輩

- Narrative: `U / 2 / U / 2 / 2 / 2` = **4/6**.
- Tone: `2 / 2 / 4 / 0 / U / U / 2` = **5/7**.
- Art: `1 / 3 / 2 / U` = **3/4**.
- Add `problemSolving=2` and `mysteryReveal=2` from the official complete first episode and independent early-episode clue/recovery observations.
- Retain `characterArcWeight=2`, `relationshipStructure=2`, and `worldBuilding=2`; modify `comedy 3 -> 4`, supported by the official police-comedy framing and repeated first-volume incident structure.
- Set `darkness=0` only because the complete official first episode plus all three official entry-volume descriptions repeatedly show low-stakes community comedy and no danger/tragedy reward in that scope. Add `emotionalWarmth=2` from repeated protective or affirming early episodes.
- Use Genre `comedy`; drop `mystery`. Retain Themes `investigation:1;workplace:2`.
- Result: **CURRENT_GATE_PASS**.

### 7. ドリフターズ

- Narrative: `U / 2 / 2 / 2 / U / 2` = **4/6**.
- Tone: `U / 2 / 2 / 2 / U / U / U` = **3/7**.
- Art: `U / U / U / U` = **0/4**.
- Add `problemSolving=2`; named criticism and independent volume-3 reviews align on tactical knowledge, production, and resource conversion.
- Modify `strategy`, `pacing`, `worldBuilding`, `relationshipStructure`, and `darkness` to anchor 2. Retain `comedy=2` from multiple official entry-scope jurors; do not infer Art from those comments.
- Retain Genres `action;fantasy;historical`; use Themes `combat:2;war:2;territoryManagement:1`. Drop `adventure` because war and territory action, not exploration, form the repeated entry structure.
- Result: **OFFICIAL_PREVIEW_RECOVERY_REQUIRED** — Tone short by 2; Art short by 2.

### 8. からかい上手の高木さん

- Narrative: `0 / U / U / 0 / 0 / 0` = **4/6**.
- Tone: `2 / 2 / 4 / 0 / 0 / 2 / U` = **6/7**.
- Art: `1 / 1 / 3 / U` = **3/4**.
- Drop `problemSolving=1`; the retaliation loop is not a problem-solving narrative. Add `mysteryReveal=0` from the repeated complete absence of a clue/reveal loop in all three official volume descriptions.
- Modify `characterArcWeight 3 -> 2`, `comedy 3 -> 4`, `mentalStress 1 -> 0`, and `romance 3 -> 2`; close `emotionalWarmth` as unknown. These follow the 0/2/4 anchors without treating embarrassment as pressure.
- Retain Genres `comedy;sliceOfLife;romance` and Theme `school:2`.
- Result: **CURRENT_GATE_PASS**.

### 9. 多聞くん今どっち!?

- Narrative: `2 / U / U / 2 / U / 2` = **3/6**.
- Tone: `2 / 2 / U / U / 2 / 2 / 2` = **5/7**.
- Art: `2 / 3 / 3 / U` = **3/4**.
- Retain `progression=2`, `pacing=2`, and `worldBuilding=2`: official volumes 1–3 and multiple volume-3 reviews bind role progression, center-selection outcome, and the recurring idol-work rules to the entry scope.
- Modify `characterArcWeight 4 -> 2`, `romance 3 -> 2`, and `emotionalWarmth 3 -> 2`; retain `mentalStress=2` for the repeated low-self-esteem, competition, and jealousy pressure described across the three official volumes.
- Retain Genre `romance` and Themes `tournament:1;workplace:2`.
- Result: **OFFICIAL_PREVIEW_RECOVERY_REQUIRED** — Narrative short by 1.

### 10. だがしかし

- Narrative: `0 / 1 / 0 / 1 / 0 / 1` = **6/6**.
- Tone: `1 / 2 / 4 / 0 / 0 / 1 / 2` = **7/7**.
- Art: `2 / 2 / 2 / U` = **3/4**.
- Retain the Pass A intermediate values where the three official volume descriptions place the repeated candy questions, small challenges, setting rules, and relationship change between anchors. Add `strategy=0` and `mysteryReveal=0` from the same repeated episode structure.
- Modify `comedy 3 -> 4`: multiple official jurors and the three official volumes establish candy comedy as the core, not merely intermittent relief.
- Retain Genres `comedy;sliceOfLife`; add Theme `workplace:1`. The family candy shop and succession attempt recur, but work procedure is not the central reward.
- Result: **CURRENT_GATE_PASS**.

## Round-01 outcome

| Outcome                                              | Works |
| ---------------------------------------------------- | ----: |
| Current Narrative/Tone/Art/Genre/Theme coverage pass |     5 |
| Bounded official-preview recovery                    |     5 |
| Hard blocker                                         |     0 |
| Unresolved model proposal                            |     0 |

The five recovery works are frozen in `text-gap-queue-chunk-01.csv`. A failed recovery closes the remaining axes as `unknown` and moves the Work to the unchanged promotion gate; it does not trigger fabricated values, threshold changes, or an indefinite pending state.
