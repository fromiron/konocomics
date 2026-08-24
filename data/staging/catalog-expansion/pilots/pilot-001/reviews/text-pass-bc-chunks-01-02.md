# Pilot 001 Text Pass B / Pass C candidate review — chunks 01–02

- Reviewer: Local Codex independent text review
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Scope: `chunk-01` and `chunk-02`, 20 works
- Reviewed at: 2026-08-23
- Factor scope: first 1–3 volumes or the first major episode only
- Coverage gate used here: Narrative known `>= 4/6` and Tone known `>= 5/7`
- Safety/identity: existing verified state was not changed. Evidence-edition limitations below are annotation-scope issues, not canonical or safety reversals.

## Review method and evidence identity

`ACCEPT` means the cited evidence directly supports the selected Dictionary anchor inside the allowed entry scope. `REJECT` means the proposed value misreads the Dictionary or depends on a genre/format inference. `UNKNOWN` is a closed decision for the present packet: the evidence does not support a responsible known value. It is not an intermediate numeric value.

The `S01`–`S34` URL identifiers are the source ledger in `reviews/coverage-gap-chunks-01-02.md`; that ledger contains the full URL, source name/date, and retrieval date. Two additional current-review URL identifiers are used:

- `V01`: 小学館コミック, `YAWARA！〔小学館文庫〕 1`, https://shogakukan-comic.jp/book?isbn=9784091922816, undated, retrieved 2026-08-23. It enumerates chapters 1–17, including `おじいちゃんの陰謀`, `おじいちゃんの大胆構想`, and the volume feature stating that Jigoro steadily advances Yawara's debut plan.
- `V02`: 小学館コミック, `陽だまりの樹〔小学館文庫〕` series, https://shogakukan-comic.jp/book-series?cd=16938, undated, retrieved 2026-08-23. It gives a reproducible official route to volume-specific entry material, but the current packet does not yet contain enough volume-1/3 event detail to establish progression frequency.

The supplemental review ledger declares the older candidate SHA `8b0ad5d8adf2e6638c72ebbee1fa16f02b8a531d4d4a61506704accb9a62d6cf`. I therefore used its URLs and scoped observations only as auxiliary evidence, never as approval provenance for the current SHA. Where it conflicts with the newer coverage-gap report, the current source contents and stricter scope rule control.

Notation below: `U` = `unknown`. Narrative order is `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`; Tone order is `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`.

## Summary

| Result | Works |
|---|---:|
| Narrative and Tone coverage pass | 15 |
| Coverage does not pass with current evidence | 5 |
| `SOURCE_INFORMATION_UNAVAILABLE` blocker candidate | 0 |
| Open adjudication | 0 |

The five non-passing works are `陽だまりの樹`, `放浪息子`, `エマ`, `ギャラリーフェイク`, and `バラ色の明日`. Each has a concrete, unexhausted official preview/volume-description route, so none is currently a hard blocker. All disputed proposals have nevertheless been closed as `ACCEPT`, `REJECT`, or `UNKNOWN`; no proposed value remains pending.

## Work-level decisions

### 01. `work-0262dcaa820443c3185d` — ゴルゴ13

- Final Narrative: `0 / 2 / 2 / 4 / U / 2` = **5/6**.
- Final Tone: `0 / 0 / 0 / 3 / 1 / 0 / 0` = **7/7**.
- Decision: **PASS**. No gap value is needed. `mysteryReveal` remains `UNKNOWN`: S01 proves four independent missions, not clue/reveal reward frequency.
- Evidence: S01 and the Pass A official-volume rationale. The existing 0 values are retained because the scoped mission descriptions positively establish a solitary, task-dominant, non-romance/non-comedy entry structure; no new 0 was inferred from omission.
- Genre/Theme: no new conflict found (`action`; `combat`, `politics`, `workplace`).

### 02. `work-9d5d64262dbc2893acd4` — ポーの一族

- Final Narrative: `U / U / 2 / 3 / 2 / 3` = **4/6**.
- Final Tone: `3 / 3 / U / 3 / 3 / 1 / U` = **5/7**.
- `strategy=2` — **ACCEPT** (S02–S04). Selecting a new member and repeatedly acting to conceal identity are short plans; the evidence does not support long-horizon level 4.
- `pacing=3` — **ACCEPT** (S02–S04). The official first three digital volumes move between 1880, an origin/persecution episode, and 1959 with major place/status changes.
- `mentalStress=3` — **ACCEPT** (S02–S04). Abandonment, persecution, corpse desecration, and exposure risk recur across three scoped descriptions; this is above mixed level 2 but does not prove sustained breakdown level 4.
- `romance=1` — **ACCEPT** (S03). Frank/Sheila is a bounded subordinate episode, so it is between absent 0 and subplot 2.
- `problemSolving`, `comedy`, `emotionalWarmth` — **UNKNOWN**; the packet does not establish their repeated entry frequency.
- Genre/Theme flag: `fantasy;horror` is supported. There is no Theme row. Do not fabricate a canonical Theme merely to make the table non-empty; if promotion validation requires at least one Theme, this needs an explicit schema/annotation follow-up.

### 03. `work-98d513b70560f2f96a38` — 漂流教室

- Final Narrative: `U / 2 / U / 3 / 2 / 3` = **4/6**.
- Final Tone: `2 / 4 / U / 4 / 4 / U / 2` = **5/7**.
- `characterArcWeight=2` — **ACCEPT** (S05, restricted to the chronological opening survival arc). The opening quarrel, disaster, collective deaths, role change, and emergence of leadership balance event survival with character change. The proposal is reduced neither to 0 nor raised above balance.
- `emotionalWarmth=2` — **ACCEPT** (S05–S06, opening survival arc only). Parental concern, sacrifice, courage, and group cooperation coexist with extreme hostility; this matches mixed level 2, not warmth-centered 4.
- Edition adjudication: **closed as mapped for these two axes**. S05 is an official 762-page re-edited volume beginning at episode 1; only the chronological opening/first major survival arc was used. Later contents in that omnibus and later bunko material were not used to inflate the values. This is the same canonical work, not a separate Work.
- `progression`, `strategy`, `comedy`, `romance` remain `UNKNOWN`.
- Genre/Theme: `scienceFiction;horror`, `survival=2`, and `postApocalypse=2` are directly supported. No conflict found.

### 04. `work-f50fa290eb4116a7078e` — 11人いる！

- Final Narrative: `0 / 3 / U / U / 4 / 2` = **4/6**.
- Final Tone: `2 / 4 / U / 2 / 4 / U / 2` = **5/7**.
- Proposed `characterArcWeight=3` — **REJECT**; corrected to **`2` ACCEPT** (S07). The official source directly describes prejudice, identity, choices, and relationship change, but mystery/exam incidents remain an equal reward. That matches balance 2, not character-dominant 3–4.
- `emotionalWarmth=2` — **ACCEPT** (S07 plus independently scoped observations in the supplemental ledger). Distrust moves toward cooperation/friendship while danger remains, exactly the mixed anchor.
- `strategy`, `pacing`, `comedy`, `romance` remain `UNKNOWN`.
- Genre/Theme: `scienceFiction;mystery`, `survival=2`, and `investigation=2` are supported.

### 05. `work-a089c0eef91d1213da38` — うる星やつら

- Final Narrative: `0 / 0 / 0 / 3 / 0 / 2` = **6/6**.
- Final Tone: `2 / 3 / 4 / 0 / 1 / 4 / U` = **6/7**.
- Decision: **PASS**. S08 and scoped auxiliary reviews reinforce the existing fast episodic comedy structure. `emotionalWarmth` remains **UNKNOWN** because relationship/comedy evidence does not directly establish warmth as a repeated payoff.
- Genre/Theme: `scienceFiction;comedy;romance` and `school=1` are supported; no new conflict.

### 06. `work-671e3453cf9e1df2ee87` — 陽だまりの樹

- Final Narrative: `U / 2 / U / 2 / U / 4` = **3/6**.
- Final Tone: `4 / 2 / U / 2 / U / 2 / 2` = **5/7**.
- `problemSolving=2` — **ACCEPT** (S09). The opening alternates direct violence with medical treatment under constraints, a genuine mixture of analysis/skill and direct action.
- `pacing=2` — **ACCEPT** (S09). Entry, teacher death, conflict/duel, injury, and treatment form normal arc-scale state changes, not the short-interval maximum.
- Proposed `progression=2` — **UNKNOWN/REJECT FOR CURRENT PACKET**. The official work synopsis says the two men pursue their paths, but it mixes later-series trajectory into the opening. Beginning a path or already possessing medical skill does not prove gradual entry reward.
- Proposed `comedy=2` — **UNKNOWN**. A playful/error-prone character description does not establish intermittent gag frequency in volumes 1–3.
- `romance=2` — **ACCEPT** (S09). Both leads' feelings toward the same woman are directly identified as a subordinate relationship line.
- `emotionalWarmth=2` — **ACCEPT** (S09). Treatment, friendship, and kindness coexist with violence and rivalry, fitting mixed level 2.
- Result: **RESEARCH_REQUIRED**, Narrative short by one known axis. Reproducible unexhausted route: use V02 to open official volume 1–3 pages/previews and test only `progression`, `strategy`, or `mysteryReveal` against repeated events. If those official entry materials remain unavailable or non-specific after access attempts, then and only then consider `SOURCE_INFORMATION_UNAVAILABLE`.
- Genre/Theme flag: `historical` is supported. `historicalReconstruction=2` is plausible from the official late-Tokugawa institutions/medicine description, but its entry centrality should be reconfirmed when V02 volume material is inspected; do not derive it from the genre label alone.

### 07. `work-14e489bf1afd1587c44a` — YAWARA！

- Final Narrative: `4 / U / 2 / U / 0 / 0` = **4/6**.
- Final Tone: `4 / 3 / 3 / 0 / 2 / 2 / U` = **6/7**.
- `strategy=2` — **ACCEPT** (V01; S10 only as corroboration). V01 is an official entry volume containing chapters 1–17 and explicitly states that Jigoro steadily advances a debut plan while Matsuda investigates. This is a short/medium plan, not strategy-centered level 4.
- Edition adjudication: **closed**. V01 proves the planning sequence belongs to the chronological original entry; the 29-volume digital re-edit in S10 is no longer the sole mapping basis.
- `problemSolving`, `pacing`, `emotionalWarmth` remain `UNKNOWN`.
- Genre/Theme: `sports;comedy;romance` and `sportsCompetition=2` are supported.

### 08. `work-ad2b80b81b7bc9b602a3` — Papa told me

- Final Narrative: `0 / U / U / 1 / 0 / 0` = **4/6**.
- Final Tone: `4 / 2 / 1 / 0 / U / U / 4` = **5/7**.
- `comedy=1` — **ACCEPT** (S11–S12). Both official early volumes repeat mistakes, sharp/light exchanges, and doting-parent situations, while the work is not presented as gag-centered. This supports an intermediate 1 rather than 0 or 2.
- `mentalStress`, `romance` remain `UNKNOWN`; parental affection is not romance.
- Genre/Theme flag: `sliceOfLife` is supported. No Theme row exists, and the canonical Theme vocabulary contains no general family/daily-life tag. Do not force `school` or `foundFamily` without direct repeated-mechanic evidence; escalate only if non-empty Theme is a promotion schema requirement.

### 09. `work-39555fe7402dada0d79f` — 名探偵コナン

- Final Narrative: `0 / 4 / 2 / 3 / 4 / 2` = **6/6**.
- Final Tone: `1 / 3 / U / 3 / 2 / 1 / U` = **5/7**.
- `romance=1` — **ACCEPT** (S13). The first-date/Ran relationship seed recurs but remains subordinate to case resolution in the scoped entry.
- `characterArcWeight=1` — **ACCEPT** (S13). This low value is not based on a missing keyword: the official incident archive enumerates the early cases and shows repeated case resolution while the core identity/relationship state remains largely maintained. It is above pure event-only 0 because the transformation and Ran relationship matter, but below balanced 2.
- Explicit low-value queue: **closed**. No genre-label inference was used; the case-by-case archive supplies the negative comparison against the 2/4 anchors.
- `comedy`, `emotionalWarmth` remain `UNKNOWN`.
- Genre/Theme: `mystery`, `investigation=2`, and entry `school=1` are supported.

### 10. `work-4a8a22fc766bf9bc4c59` — 天は赤い河のほとり

- Final Narrative: `U / 2 / 3 / 3 / U / 4` = **4/6**.
- Final Tone: `4 / 3 / U / 3 / 3 / 4 / U` = **5/7**.
- `problemSolving=2` — **ACCEPT** (S14–S15). Escape routes, pursuit, a sword choice, ritual constraints, and direct combat show analysis/choice mixed with force. They do not support analysis-centered 4.
- `progression`, `mysteryReveal`, `comedy`, `emotionalWarmth` remain `UNKNOWN`.
- Genre/Theme: `fantasy;historical;romance`, `combat`, `war`, `politics`, and `timeTravel` are supported within the entry evidence.

### 11. `work-0bec5d8d9474a2197312` — 放浪息子

- Final Narrative: `U / U / U / U / U / U` = **0/6**.
- Final Tone: `4 / 2 / U / U / 3 / 1 / U` = **4/7**.
- Proposed `progression=2` — **REJECT**. S16–S17 use ordinary-language “growth,” but the Dictionary progression axis is repeated growth/acquisition/mastery reward. Identity development belongs primarily to `characterArcWeight`; mapping it to progression would double count.
- Proposed `pacing=1`, `worldBuilding=1` — **UNKNOWN**. S17 repeats the same boilerplate for volumes 1–3 and supplies no volume-specific cadence or functional setting-rule observations.
- Candidate `mysteryReveal=0` — **UNKNOWN**. Lack of mystery in a short synopsis is not evidence of near-absence.
- `mentalStress=3` — **ACCEPT** (S16–S17). Concealed wishes, vulnerability, and repeated fear of being hurt define the official entry premise; this is above mixed tension 2 but below sustained breakdown 4.
- `romance=1` — **ACCEPT** (S17's official love-story framing, bounded below the identity/relationship core).
- Proposed `emotionalWarmth=2` — **REJECT/UNKNOWN**. “Gentle gaze” describes authorial handling, not observed relationship payoff. Mutual secret recognition alone does not prove mixed warmth frequency.
- Explicit queue: **closed to UNKNOWN**, not silently promoted.
- Result: **RESEARCH_REQUIRED**, short in both groups. Reproducible unexhausted route: S17 exposes a 19-page official preview; inspect the chronological first-volume text/pages, then obtain distinct official volume 2–3 previews/descriptions. Test cadence, functional setting rules, conflict-resolution mode, and warmth directly. If official previews are inaccessible and independent scoped reviews remain unavailable after logged attempts, this can become a `SOURCE_INFORMATION_UNAVAILABLE` candidate; it is not one now.
- Genre/Theme: `sliceOfLife` and `school=2` are supported. No identity/safety conflict found.

### 12. `work-1cf7a0bb5f55e0d69b27` — モンキーターン

- Final Narrative: `4 / U / U / 2 / 0 / 2` = **4/6**.
- Final Tone: `2 / 2 / U / U / 2 / 1 / 2` = **5/7**.
- `pacing=2` — **ACCEPT** (S18). Goal change, admission, training-school entry, class assignment, and dismissal risk are normal arc-scale changes.
- `worldBuilding=2` — **ACCEPT** (S18). Training duration, class assignment, and dismissal rules functionally constrain decisions.
- `mysteryReveal=0` — **ACCEPT** (S18). This low value is supported by three sequential, event-detailed official volume descriptions whose explicit rewards are admission, training, evaluation, and ranking—not merely by omission of a genre label.
- `relationshipStructure=2`, `mentalStress=2`, `romance=1`, `emotionalWarmth=2` — **ACCEPT** (S18). Friends/rivals recur; D-class dismissal risk provides mixed tension; the childhood promise is subordinate romance and friendship warmth.
- `problemSolving`, `strategy`, `comedy`, `darkness` remain `UNKNOWN`.
- Genre/Theme: `sports` and `sportsCompetition=2` are supported.

### 13. `work-1fc61ddbeb429b4a2c15` — エマ

- Final Narrative: `U / 0 / U / 2 / U / 4` = **3/6**.
- Final Tone: `4 / 2 / U / 1 / 3 / 4 / U` = **5/7**.
- `pacing=2` — **ACCEPT** (S19–S20). Relationship advance, death, class humiliation, separation, and relocation are ordinary arc-scale state changes.
- Proposed `progression=2` — **REJECT**. S20's people “slowly changing the era” is not repeated acquisition/mastery reward, and it is not sufficiently volume-specific.
- Proposed `problemSolving=1` — **REJECT AS PROPOSED; `problemSolving=0` ACCEPT** (S19–S20). The directly observed entry resolutions are separation, departure, and emotional/direct choices under class force; no analytical/direct mix is shown. This is a positive 0-anchor observation, not a midpoint used for uncertainty.
- `darkness=1` — **ACCEPT** (S19). Death and class humiliation are serious but do not dominate the entry.
- `mentalStress=3` — **ACCEPT** (S19–S20). Three independently authored scoped observations align with the official unattainable-love/departure framing on class pressure, loss, and separation. They do not justify extreme 4.
- `strategy`, `mysteryReveal`, `comedy`, `emotionalWarmth` remain `UNKNOWN`.
- Result: **RESEARCH_REQUIRED**, Narrative short by one. Reproducible unexhausted route: inspect the official BOOK☆WALKER/KADOKAWA volume 1–3 previews for a repeated planning, reveal, or progression reward. If none is observed, retain unknown rather than manufacture a fourth known axis. `SOURCE_INFORMATION_UNAVAILABLE` is premature because official previews exist.
- Genre/Theme: `historical;romance`, `workplace=2`, and `historicalReconstruction=2` are supported, though edition relation for the frozen representative ISBN still needs the existing bibliography gate, not a Work split.

### 14. `work-2f39795212f5ad8db155` — あずみ

- Final Narrative: `U / 2 / 2 / 3 / U / 2` = **4/6**.
- Final Tone: `2 / 2 / U / 4 / 4 / U / 1` = **5/7**.
- `problemSolving=2` — **ACCEPT** (S21). Deception, route prediction, ambush, and direct fighting form the Dictionary's mixed anchor.
- `pacing=3` — **ACCEPT** (S21). Training/test, mission deception, pursuit, poisoning, mutilation, and deaths repeatedly change goals and group state in short intervals.
- Proposed `characterArcWeight=3` — **REJECT AS TOO HIGH; `2` ACCEPT** (S21). Conditioning, killing peers, and losses make character change material, but the official summaries give equal or greater weight to missions/action; balance 2 is the defensible anchor.
- `mentalStress=4` — **ACCEPT** (S21). Forced child-on-child killing and repeated companion deaths across all three official descriptions directly establish sustained severe psychological pressure, not just a dark setting.
- `emotionalWarmth=1` — **ACCEPT** (S21). Companion bonds make loss emotionally meaningful, but warmth is rare inside a predominantly cruel environment; this is between cold 0 and mixed 2.
- `progression`, `mysteryReveal`, `comedy`, `romance` remain `UNKNOWN`.
- Genre/Theme: `action;historical`, `combat=2`, and `politics=2` are supported. The separate sequel `AZUMI` remains a distinct canonical identity.

### 15. `work-303d0a9d67a606a817af` — ギャラリーフェイク

- Final Narrative: `U / 4 / U / 2 / 4 / 3` = **4/6**.
- Final Tone: `1 / U / U / 2 / U / U / U` = **2/7**.
- `pacing=2` — **ACCEPT** (S22). Three separate cases create ordinary episode/arc state resets.
- `worldBuilding=3` — **ACCEPT** (S22). Appraisal, forgery, restoration, black-market, seizure, and political transaction rules repeatedly drive the cases; this exceeds functional 2 but the entry evidence does not justify maximum 4.
- `characterArcWeight=1` — **ACCEPT** (S22). Three detailed official case descriptions repeatedly reward object/case judgment while keeping Fujita stable; this is low but not an unsupported absence inference.
- Proposed `relationshipStructure=2` — **UNKNOWN**. S22 does not directly establish a fixed recurring party; separate clients are not automatically a core recurring cast.
- `darkness=2` — **ACCEPT** (S22). Theft, black-market trade, fraud, and seizure create serious criminal risk without proving bleakness-centered 4.
- Proposed `mentalStress=1` — **UNKNOWN**. Criminal stakes do not by themselves establish experienced psychological pressure.
- Proposed `emotionalWarmth=2` — **UNKNOWN** (S23–S24). S23 is a general review that links volume 1 but does not unambiguously limit all claims to it; the exact S24 `tomo` passage/range could not be independently recovered from the live page. The claimed two-source scoped quorum is therefore not reproducible at this review.
- Explicit queue: **closed to UNKNOWN**; no majority vote or review-copy assumption.
- Result: **RESEARCH_REQUIRED**, Tone short by three. Reproducible unexhausted route: inspect the official volume-1 preview linked from the S22 product page and archive exact page references for recurring cast, stress, humor/romance absence, and human-choice payoff; independently capture S24 with author/date/volume range if it remains part of the packet. Only after those attempts fail is `SOURCE_INFORMATION_UNAVAILABLE` a blocker candidate.
- Genre/Theme: `mystery`, `investigation=2`, and `workplace=2` are directly supported.

### 16. `work-440f93a4e60ef906685b` — バラ色の明日

- Final Narrative: `U / U / U / U / U / U` = **0/6**.
- Final Tone: `4 / U / U / U / U / 4 / 1` = **3/7**.
- Proposed `pacing=2` — **UNKNOWN**. Switching stories/casts in an anthology does not establish within-story goal/state cadence.
- Proposed `progression=0`, `mysteryReveal=0`, `worldBuilding=0` — **UNKNOWN**. S25 is a 2009 re-edited edition, not a proven item-for-item mapping to the frozen 1997 standard entry. Anthology format and synopsis omission are not sufficient absence proofs for three low anchors.
- Proposed `mentalStress=3` — **REJECT/UNKNOWN**. The older supplemental ledger explicitly records that only one scoped reviewer strongly mentions stress. The newer packet does not cure that discrepancy with two recoverable, directly corresponding observations.
- `emotionalWarmth=1` — **ACCEPT** (S27). Two independent scoped accounts converge on small residual warmth amid painful relationships; the low value correctly remains below mixed 2.
- Existing Pass A `relationshipStructure=4` — **REJECT TO UNKNOWN**. Unrelated short-story casts are not automatically the Dictionary's complex ensemble/multi-relationship structure. Story-level relationship topology must be observed; this is not a Genre-to-Axis mapping.
- Explicit queue: **closed to UNKNOWN** for all three candidate-0 axes and edition mapping.
- Result: **RESEARCH_REQUIRED**, both groups short. Reproducible unexhausted route: use the official Shueisha reader linked in Pass A (`https://www.shueisha.co.jp/books/reader/main.php?cid=08782229848709315501`) to map story titles/order to the frozen representative edition, then sample more than one story before judging cadence or any 0 anchor. If the reader cannot establish mapping and no standard-edition contents are obtainable after logged attempts, this becomes a `SOURCE_INFORMATION_UNAVAILABLE` candidate.
- Genre/Theme flag: `sliceOfLife;romance` is supported. No Theme row exists; do not fabricate a Theme from relationship subject matter. Identity remains one anthology Work with later editions, pending only evidence-edition mapping.

### 17. `work-464322afcd10013437b9` — 大奥

- Final Narrative: `U / U / 2 / 3 / 2 / 4` = **4/6**.
- Final Tone: `4 / 4 / U / 2 / 3 / 3 / U` = **5/7**.
- `pacing=3` — **ACCEPT** (S28–S30). The scoped volumes shift protagonists, generation, and time period while advancing the institution's origin.
- `mysteryReveal=2` — **ACCEPT** (S28–S30). The move into the past reveals part of the current institution's origin; reveal is present but not the sole/main reward at level 4.
- `mentalStress=3` — **ACCEPT** (S28–S30). Coercion, conspiracy, institutional confinement, and historical constraint recur.
- `romance=3` — **ACCEPT** (S30). The official volume description makes Iemitsu/Arikoto's love and the historical obstruction central, but politics/institution remain co-equal, so not 4.
- `progression`, `problemSolving`, `comedy`, `emotionalWarmth` remain `UNKNOWN`.
- Genre/Theme: `historical;scienceFiction`, `politics=2`, and `historicalReconstruction=2` are supported by the official alternate-history epidemic and institution structure.

### 18. `work-76c038b398f4b28b7748` — 妖しのセレス

- Final Narrative: `U / 1 / U / 3 / 2 / 2` = **4/6**.
- Final Tone: `2 / 2 / U / 3 / 3 / 2 / U` = **5/7**.
- `pacing=3` — **ACCEPT** (S31). Murder attempt, alternate identity, secret object, kiss/state shift, captivity, alliance, betrayal, control, and another murder attempt rapidly change state across volumes 2–3.
- `problemSolving=1` — **ACCEPT** (S31). Entry responses are predominantly direct/supernatural but include limited escape and identity-management choices, placing them between direct/emotional 0 and balanced mix 2.
- `progression`, `strategy`, `comedy`, `emotionalWarmth` remain `UNKNOWN`.
- Genre/Theme: `fantasy;mystery;romance` and `survival=2` are supported.

### 19. `work-b4b21d2ebe5b8efc84ea` — Dr.コトー診療所

- Final Narrative: `U / 4 / U / 2 / 2 / 2` = **4/6**.
- Final Tone: `4 / 2 / U / 1 / 2 / U / 4` = **5/7**.
- `pacing=2` — **ACCEPT** (S32 plus the official volume-1 description cited by Pass A). Arrival/emergency treatment/trust formation gives way to a reporter's accusation and expulsion effort at normal arc cadence.
- `mysteryReveal=2` — **ACCEPT** (S32). The past death and responsibility question is an explicit bounded investigation/reveal line, not the work's level-4 core.
- `worldBuilding=2` — **ACCEPT**. Island medical-resource/community constraints functionally affect decisions across the entry.
- `darkness=1` — **ACCEPT** (S32). Death and blame are present but remain below serious-danger/ tragedy-centered level 2.
- `progression`, `strategy`, `comedy`, `romance` remain `UNKNOWN`.
- Genre/Theme: `sliceOfLife` and `workplace=2` are supported. Supplemental user reviews corroborate the already-known trust/relationship arc but were not used to invent a new axis.

### 20. `work-c4abbc1b44fa5706bce3` — 風光る

- Final Narrative: `2 / 2 / 2 / 3 / U / 3` = **5/6**.
- Final Tone: `4 / 2 / U / 2 / 3 / 4 / U` = **5/7**.
- `progression=2` — **ACCEPT** (S33–S34). Training and the explicit goal of becoming a true warrior establish gradual entry growth, not repeated maximum mastery reward.
- `problemSolving=2` — **ACCEPT**. Investigation, direct fighting, disguise, and identity-risk responses are mixed.
- `strategy=2` — **ACCEPT**. Sustained disguise and a brothel-stay cover story are concrete short plans, not strategic-system dominance.
- `pacing=3` — **ACCEPT**. Enlistment, training, robbery investigation, enemy encounter, expulsion duel, menstruation, and identity cover create frequent major state changes.
- `worldBuilding=3` — **ACCEPT**. 1863 Kyoto, Mibu group membership, rank, expulsion, and gender constraints repeatedly drive decisions; the packet does not establish maximum 4 detail.
- `mentalStress=3` — **ACCEPT**. Revenge, enemy encounter, expulsion, and identity exposure produce repeated strong pressure without proving sustained breakdown 4.
- `mysteryReveal`, `comedy`, `emotionalWarmth` remain `UNKNOWN`.
- Genre/Theme: `historical;romance`, `combat=1`, `politics=1`, and `revenge=1` are supported.

## Explicit queue closure

| Queue item | Closure |
|---|---|
| 放浪息子 candidate-zero / coverage | `mysteryReveal=UNKNOWN`; Narrative 0/6, Tone 4/7; official preview path recorded |
| バラ色の明日 re-edition / candidate zeros | all three candidate zeros `UNKNOWN`; Pass A relationship 4 rejected to unknown; official reader mapping path recorded |
| 漂流教室 re-edition mapping | accepted only for chronological opening/first survival arc; later omnibus contents excluded |
| YAWARA！ 29-volume re-edit | V01 official entry volume proves planning event belongs to entry; `strategy=2` accepted |
| 名探偵コナン low character arc | `characterArcWeight=1` accepted from event-complete official early case archive, not synopsis omission |
| ギャラリーフェイク review warmth | quorum not reproducible; `emotionalWarmth=UNKNOWN`; official preview and exact-review capture path recorded |

## Genre/Theme and contract flags

1. No unsupported Genre entry was found in the 20-work set.
2. `ポーの一族`, `Papa told me`, and `バラ色の明日` have no Theme row. The current 22-tag vocabulary may legitimately have no directly supported mechanic for the first two. If the validator treats a non-empty Theme set as mandatory, resolve that contract explicitly rather than attaching a weak tag.
3. `陽だまりの樹 historicalReconstruction=2` should be reconfirmed at entry scope with V02 material; the official whole-work page supports the setting but mixes later chronology.
4. `バラ色の明日 relationshipStructure=4` was an Axis—not Genre/Theme—overreach and is rejected above because an anthology is not automatically an ensemble.
5. No `『` or `』` ornament is included in any canonical title in this review.

## Promotion disposition

- The 15 coverage-passing works may proceed to the remaining evidence, art, bibliography, safety, and independent promotion gates; this report alone is not `recommendationVerified` approval.
- The five `RESEARCH_REQUIRED` works are not `promotionBlocked`: all have reproducible official paths that have not been exhausted.
- Current `SOURCE_INFORMATION_UNAVAILABLE` candidates: **0**.
- Current hard blocker candidates from this text review: **0**.
- Current unresolved adjudications: **0**. Every present proposal is accepted, rejected, or explicitly closed to unknown.
