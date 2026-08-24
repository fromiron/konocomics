# Batch 002 text adjudication — chunk 01, round 01

- `reviewedByHuman=false`
- Adjudicator: Local Codex
- Scope: frozen positions 1–10, first 1–3 volumes or first major episode
- Date: 2026-08-23
- Coverage gate: Narrative known `>= 4/6`; Tone known `>= 5/7`
- Rule: Pass A and the independent Grok review are compared against the Factor Dictionary and frozen evidence. Disagreement is never averaged or decided by vote.
- Boundary: this round closes every disputed proposal as retained, modified, dropped, or `unknown`. It does not promote a work. Missing coverage is routed to a finite evidence follow-up; Art values are not used to fill text axes.

## Frozen inputs

| Input                                            | SHA-256                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `frozen-work-set.csv`                            | `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6` |
| `docs/factors/factor-dictionary.md`              | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `research/chunk-01.md`                           | `86f6b3a2b29326e63ceb01266ec246d25f393a7cd971935a13a1b94bcb1045ba` |
| `annotation/pass-a-text-chunk-01.csv`            | `4f126caf1ab7c8963ce53b7f3a00201582169b4dd8d1f2265d251c453fc5b9c3` |
| `annotation/genres-pass-a-chunk-01.csv`          | `9b092d3fede2383fe69560f1d14fc985e4c16e73d69ffb2f84975dbdd9647ab0` |
| `annotation/themes-pass-a-chunk-01.csv`          | `7d6ae3c742e2f7617a818e3f2370244fabaae8f3461b46f6ba4a3997f70dca2b` |
| `annotation/pass-a-text-chunk-01.md`             | `d765771de8e8615dd8ae722e31c8a97f7be8c368d711a90f78c8c293361a36a2` |
| `reviews/grok-text-review-request-chunk-01.md`   | `3301df088566d5878d8fe1f016dc26587d8ce3f7c5dc5b9b49d9df3e1dc4d694` |
| `reviews/grok-text-review-response-chunk-01.txt` | `4920d6cfcf277755eb77d51736fdfdf8a0b7eacf320ece0ba91e1537405a3628` |
| `reviews/grok-text-review-ledger-chunk-01.md`    | `73783ced60a2e167032a54d39e05613369f58d9ebcb43a553de40bba96b9585d` |
| `adjudication/identity-chunk-01.md`              | `a64df78b95a2e7474f925d01171980958f0335eeb970571aff2bb7c81b7e8280` |

The immutable Grok response misspells `デカワンコ`; this ledger uses the frozen canonical title and does not propagate the typo. Its RED and 銀河鉄道999 flags concern evidence-edition scope. The already adjudicated canonical identities remain valid.

## Round-01 decisions

Notation: Narrative order is `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`; Tone order is `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`; `U` means explicitly closed `unknown`.

### 1. サンダー３

- Final candidate Narrative: `U / U / 1 / 3 / U / 2` = **3/6**.
- Final candidate Tone: `U / 2 / U / 2 / U / U / U` = **2/7**.
- Modify `relationshipStructure 3 -> 2`: the entry evidence establishes a core party plus named allies, not an ensemble near the level-4 anchor.
- Retain `strategy=1`, `pacing=3`, `worldBuilding=2`, and `darkness=2`. The three separate official volume descriptions establish a bounded operation, repeated large early state changes, functional other-world rules, and sustained serious danger. The independent review does not supply stronger evidence for replacing them.
- Retain Genres `action;scienceFiction` and Themes `adventure:2;combat:2`. Travel/rescue and armed resistance recur through volumes 1–3 rather than appearing as a single premise beat.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1; Tone short by 3.

### 2. のたり松太郎

- Final candidate Narrative: `3 / 0 / 0 / 3 / 0 / 2` = **6/6**.
- Final candidate Tone: `2 / 3 / 2 / 1 / U / U / U` = **4/7**.
- Modify `romance 1 -> U`: visiting a former teacher does not establish a sustained romantic subplot. The independent proposal of 0 also lacks affirmative repeated absence evidence.
- Retain the other Pass A axes. The three official entry-volume episode lists directly establish repeated training/status progression, impulse rather than analysis or planning, open sports conflicts, a widening recurring stable network, comic misconduct, and a predominantly light frame.
- Retain Genres `sports;comedy` and Themes `martialArts:2;workplace:2;sportsCompetition:2`. Professional sumo technique, stable hierarchy, and matches are distinct repeated entry structures; an opening school segment is not added as a major Theme.
- Result: **RESEARCH_REQUIRED** — Tone short by 1.

### 3. デカワンコ

- Final candidate Narrative: `U / 3 / U / 3 / 4 / 1` = **4/6**.
- Final candidate Tone: `2 / 3 / 3 / 2 / U / U / U` = **4/7**.
- Modify `mysteryReveal 3 -> 4`: the first 24 named files repeatedly make investigation and answer disclosure the principal reward.
- Retain the other Pass A values, Genres `mystery;comedy`, and Themes `investigation:2;workplace:2`. The official first-three-volume packet supports the recurring police-team and comic case loop; the review does not demonstrate that these repeated structures are merely incidental.
- Result: **RESEARCH_REQUIRED** — Tone short by 1.

### 4. ファイアパンチ

- Final candidate Narrative: `U / U / 2 / 4 / U / 3` = **3/6**.
- Final candidate Tone: `3 / 3 / 2 / 4 / 4 / U / U` = **5/7**.
- Retain all Pass A axes. The three official volume descriptions plus multiple official award-jury observations directly support rapid direction changes, a constrained frozen/powered world, character-driven revenge choices, recurring relationships, tonal comedy, extreme bleakness, and sustained psychological pressure within the entry scope.
- Retain Genres `action;fantasy;horror` and Themes `combat:2;survival:2;revenge:2;postApocalypse:2`. The horror and post-apocalyptic readings are grounded in repeated starvation, bodily destruction, unending fire, and the frozen ruined world, not inferred from a ranking label.
- Result: **RESEARCH_REQUIRED** — Narrative short by 1.

### 5. RED

- Final candidate Narrative: `U / U / U / U / U / 2` = **1/6**.
- Final candidate Tone: `U / 2 / U / 3 / U / U / U` = **2/7**.
- Modify `characterArcWeight 2 -> U`: the mapped original-volume 1–2 material establishes motive and encounter but not enough repeated character-change reward.
- Retain `worldBuilding=2`, `relationshipStructure=2`, and `darkness=3` only inside the mapped original-volume 1–2 scope. Retain Genre `historical`; drop `action`. Retain Themes `adventure:2;revenge:2`; do not add `historicalReconstruction` from setting alone.
- Original volume 3 remains unmapped. No result from a later combined edition may be generalized past the proven content bridge.
- Result: **RESEARCH_REQUIRED** — Narrative short by 3; Tone short by 3. This is an annotation-scope gap, not an identity or safety blocker.

### 6. 邪眼は月輪に飛ぶ

- Final candidate Narrative: `U / U / U / U / U / U` = **0/6**.
- Final candidate Tone: `U / U / U / U / U / U / U` = **0/7**.
- Modify `worldBuilding 2 -> U` and `darkness 3 -> U`: one short complete-volume blurb cannot establish either sustained trait.
- Drop Genres `action;horror`. Retain Themes `combat:2;survival:2` only as provisional Pass-A candidates pending the same complete-volume entry review; they are not yet promotion-ready Theme decisions.
- Result: **RESEARCH_REQUIRED** — Narrative short by 4; Tone short by 5. Insufficient current text evidence is not yet a hard blocker because the official complete-volume preview route is unexhausted.

### 7. 銀河鉄道999

- Final candidate Narrative: `U / U / U / 3 / U / 4` = **2/6**.
- Final candidate Tone: `2 / 2 / U / 3 / U / U / U` = **3/7**.
- Retain Pass A axes and Genre `scienceFiction`. Modify Theme `exploration 2 -> 1`; retain `adventure:2`. Planet-by-planet travel is the repeated core, while exploration is a subordinate expression of the same loop.
- The later reprint pages may support content only where their chronological entry mapping is explicit. They do not establish original-issue bibliography.
- Result: **RESEARCH_REQUIRED** — Narrative short by 2; Tone short by 2. The edition limitation is not an identity blocker.

### 8. 吉祥天女

- Final candidate Narrative: `U / U / U / U / U / U` = **0/6**.
- Final candidate Tone: `U / U / U / U / U / U / U` = **0/7**.
- Drop Genre `mystery`: a mysterious transfer-student premise does not establish a recurring clue/reveal genre structure.
- Retain Theme `school:1` as a setting-level Theme only. No Axis is inferred from it.
- Result: **RESEARCH_REQUIRED** — Narrative short by 4; Tone short by 5. Official entry previews remain an unexhausted route.

### 9. 六三四の剣

- Final candidate Narrative: `3 / 0 / 0 / 3 / 0 / 2` = **6/6**.
- Final candidate Tone: `3 / 2 / U / 2 / U / U / 2` = **4/7**.
- Modify `progression 4 -> 3`, `mysteryReveal U -> 0`, `worldBuilding 0 -> 2`, `characterArcWeight 4 -> 3`, `relationshipStructure 3 -> 2`, `mentalStress 2 -> U`, and `emotionalWarmth U -> 2`.
- The three official volume descriptions positively establish a training/rivalry/family-bond structure with no clue/reveal reward, functional competitive-kendo institutions, balanced-to-strong character change, mixed family warmth, and one major loss that does not alone prove sustained psychological pressure.
- Retain Genre `sports` and Themes `martialArts:2;sportsCompetition:2`. Do not add `tournament` from a single incident.
- Result: **RESEARCH_REQUIRED** — Tone short by 1.

### 10. 怪獣8号

- Final candidate Narrative: `3 / U / U / 4 / U / 3` = **4/6**.
- Final candidate Tone: `3 / 3 / 2 / 2 / 2 / U / U` = **5/7**.
- Retain all Pass A axes and Genres `action;scienceFiction`. Modify Theme `workplace 2 -> 1`; retain `combat:2`. Do not add `tournament` from the one selection-exam segment.
- Official volumes 1–3 and official jury observations support the entry values without using Genre as an Axis shortcut.
- Result: **TEXT_COVERAGE_PASS**. This is not a promotion verdict; Art, evidence, review, context, and remaining gates still apply.

## Round-01 outcome

| Outcome                               | Works |
| ------------------------------------- | ----: |
| Text coverage pass                    |     1 |
| Finite additional evidence search     |     9 |
| Hard blocker                          |     0 |
| Unresolved proposal inside this round |     0 |

All `unknown` decisions are closed states for the current packet, not low values. The nine evidence searches are frozen in `text-gap-queue-chunk-01.csv`; failure to recover a responsible known value leaves the Axis `unknown` and triggers an actual coverage-gate decision rather than fabricated data.
