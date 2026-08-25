# Batch 005 text recovery round 2 — chunk 02 independent QA and adjudication

## Scope and binding

- reviewer: Daybreak independent QA/adjudicator
- reviewDate: `2026-08-25`
- reviewedByHuman: `false`
- frozen scope: positions `11–20` only, exact `entry_1_3_volumes`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- recovery input SHA-256: `40b5e33f2b4a3a0dcfbc4caa4139aae65a7feb0fb773832044a2b1ebce9966c0`
- original research SHA-256: `7b102a7889fa15bc778d5eb0f91785a285fed2d08b0386f809eebd3d04fc6bdd`
- Grok complete response SHA-256: `d998c4b628ded98489d1cb79308fefa9e2a8581fa1054f45cf37c2f8bfbf648f`
- Grok execution ledger SHA-256: `82b8622da42a4df38b3ef83741f2ab3827c3ca9c706c0155ecdae40381eed55d`
- prior Daybreak terminal adjudication SHA-256: `be2f7dbcad0f03306efd160fb8c17261c7b6175af0cefe68b9c4c774244c8271`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- annotation guide SHA-256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`

The frozen packet, original research, Pass A CSV/notes, exact current-root Grok request/response/ledger, prior Daybreak Pass C report, terminal chunk-02 CSVs, and round-2 recovery were read against the current root. Existing Pass C known cells are immutable in this pass. No vote or averaging was used. Genre and Theme labels do not supply Axis values, synopsis silence does not supply zero, and all Art rows remain `unknown`.

## Decision rule

- `ACCEPT`: the exact residual-unknown cell has direct, independently reproducible entry evidence and matches the dictionary anchor.
- `REJECT`: the proposal uses the wrong construct, contains a material source mismatch, or overstates the exact value.
- `UNKNOWN`: the observation is plausible, but the available bounded evidence does not directly establish recurrence or the requested numeric anchor. The terminal cell stays `unknown`.

## Source and independence audit

- Position 11: recovery source 4 contains one entry-bounded statement that the group feels warmer by volume 3, but source 5 only notes the action and increasingly individualized cast. Source 6 exposes the official volume summaries and mostly unbounded title-level reviews; it does not provide a second independent entry-bounded warmth or character-pressure observation. The recovery claim of two independent warmth accounts is not reproducible.
- Position 12: the official premise and the bounded volume-1 review directly repeat a war-destroyed former kingdom, school isolation, violence, injury, and confused war memories. The separate volumes-1–2 review independently records continuing identity pressure. Only one bounded review directly supplies a positive supportive-bond observation, so warmth remains insufficient.
- Position 13: the Renta licensed KADOKAWA record directly exposes volume 2 gaining two members and an adviser and volume 3 retaining four members while seeking a fifth member and clubroom. This supports acquisition progress, ordinary successive-volume change, and a fixed group. The cited 2008 Manga Taisho PDF lists the title but exposes no work-specific growth commentary, and the independent volume-1 note only jokes about a hypothetical battle turn; neither establishes character-arc weight or recurring comedy.
- Position 14: separate Cmoa and BookLive volume-1 reviewers directly describe recurring comedy parts/dialogue mixed with backstage struggle. This is content evidence rather than inference from the characters' occupation.
- Position 16: recovery source 4 is misidentified. `https://booklive.jp/review/list/title_id/217009/vol_no/001` is the review page for `カレチ（1）`, not `銀のスプーン`. The remaining official summaries describe cooking and family events but not a repeated constraint-analysis process. A domestic household is not functional world rules, history, culture, or factions.
- Position 18: the Sony Reader volume-1 reviews and the separate volume-1 personal review explicitly and repeatedly describe gag/comedy construction. They do not establish sustained psychological pressure; hardship, unemployment, and homelessness remain survival/event evidence rather than a numeric mental-stress value.
- Positions 15, 17, 19, and 20 responsibly propose no new cell. Position 17 still has no legal dictionary Theme; an existing family is not `foundFamily`, and a spouse's occupation is not a recurring `workplace` mechanic.
- No Art source meets the six-readable-page/two-scene minimum. No Art value was reviewed or changed.

## Cell decisions

| Pos | Work | Proposed cell | QA | Exact rationale |
| --: | --- | --- | --- | --- |
| 11 | ヨルムンガンド | `mentalStress=2` | `UNKNOWN` | Loss, forced weapon use, and danger are direct events, but the new bounded sources do not independently repeat sustained anxiety or psychological pressure. Darkness and combat cannot be converted into mental stress. |
| 11 | ヨルムンガンド | `emotionalWarmth=2` | `UNKNOWN` | One volume-3-bounded review explicitly describes family-like warmth; the other cited sources do not provide the claimed second independent entry observation. A recurring unit alone does not establish warmth. |
| 12 | ボクラノキセキ | `darkness=2` | `ACCEPT` | A war-destroyed kingdom, school isolation, current violence/injury, and confused war memories are directly present in the entry and independently corroborated. This is serious tragedy/risk at 2, not a central cruel-world value 4. |
| 12 | ボクラノキセキ | `emotionalWarmth=2` | `UNKNOWN` | One review shows acceptance, gratitude, and a supportive relationship, but the second bounded review centers identity ambiguity and pressure rather than recurring warmth. Classmate presence is not warmth. |
| 13 | おまかせ精霊 | `progression=2` | `ACCEPT` | The licensed volume-2/3 descriptions directly repeat acquisition and goal rewards: new members/adviser, promotion, a fifth-member search, and a clubroom objective. This is ordinary repeated acquisition, not value 4. |
| 13 | おまかせ精霊 | `pacing=2` | `ACCEPT` | Volumes 1–3 move through invitation, member/adviser acquisition, promotion, and a new constrained member-search objective. That is ordinary successive arc change, not rapid change. |
| 13 | おまかせ精霊 | `characterArcWeight=2` | `REJECT` | The cited award document contains no work-specific growth commentary, and club acquisition does not itself establish motivation/change/relationship as the recurring reward. |
| 13 | おまかせ精霊 | `relationshipStructure=2` | `ACCEPT` | Volumes 2–3 directly retain a multi-member club, adviser, and four-member group seeking a fifth. This is a fixed group, not a complex ensemble. |
| 13 | おまかせ精霊 | `comedy=2` | `REJECT` | Renta supplies a comedy category/description, while the independent note does not describe recurring comedy. A Genre/platform label cannot fill the Axis. |
| 14 | ニラメッコ | `comedy=2` | `ACCEPT` | Two independent volume-1 review routes directly repeat comedy parts and comic dialogue alongside professional struggle. The mixed human-drama framing keeps the value below 4. |
| 16 | 銀のスプーン | `problemSolving=1` | `REJECT` | The only claimed review route is actually for `カレチ`, and the remaining summaries show cooking as response/activity without a repeated analysis-and-solution process. Value 1 cannot be used merely to avoid `unknown`. |
| 16 | 銀のスプーン | `worldBuilding=2` | `REJECT` | Family roles, illness, and household cooking are domestic setting and Theme context, not a repeated system of world rules, history, culture, or factions. |
| 18 | 新黒沢 最強伝説 | `comedy=2` | `ACCEPT` | Two independent volume-1 sources explicitly repeat gag/comedy construction, absurd incidents, and laughter. Hardship and character material keep comedy at the mixed midpoint. |
| 18 | 新黒沢 最強伝説 | `mentalStress=2` | `UNKNOWN` | The sources repeat hardship and absurdity but do not directly establish sustained anxiety, frustration, or psychological breakdown in the entry experience. Survival is not mental stress. |

Totals: `14` proposed cells; `ACCEPT 6`, `REJECT 4`, `UNKNOWN 4`.

## Materialized cell delta

Only the six `ACCEPT` rows were overlaid on the prior terminal vector. Row order and canonical evidence IDs are unchanged.

| Work | Axis | Old terminal row | New terminal row |
| --- | --- | --- | --- |
| `work-1550d4a52c3fe6d9f94c` | `darkness` | `work-1550d4a52c3fe6d9f94c,darkness,unknown,,,ev-batch-005-a-work-1550d4a52c3fe6d9f94c` | `work-1550d4a52c3fe6d9f94c,darkness,known,2,0.62,ev-batch-005-a-work-1550d4a52c3fe6d9f94c` |
| `work-15d6508605fbd4a266fc` | `progression` | `work-15d6508605fbd4a266fc,progression,unknown,,,ev-batch-005-a-work-15d6508605fbd4a266fc` | `work-15d6508605fbd4a266fc,progression,known,2,0.69,ev-batch-005-a-work-15d6508605fbd4a266fc` |
| `work-15d6508605fbd4a266fc` | `pacing` | `work-15d6508605fbd4a266fc,pacing,unknown,,,ev-batch-005-a-work-15d6508605fbd4a266fc` | `work-15d6508605fbd4a266fc,pacing,known,2,0.57,ev-batch-005-a-work-15d6508605fbd4a266fc` |
| `work-15d6508605fbd4a266fc` | `relationshipStructure` | `work-15d6508605fbd4a266fc,relationshipStructure,unknown,,,ev-batch-005-a-work-15d6508605fbd4a266fc` | `work-15d6508605fbd4a266fc,relationshipStructure,known,2,0.64,ev-batch-005-a-work-15d6508605fbd4a266fc` |
| `work-18e08fe95968a6537773` | `comedy` | `work-18e08fe95968a6537773,comedy,unknown,,,ev-batch-005-a-work-18e08fe95968a6537773` | `work-18e08fe95968a6537773,comedy,known,2,0.79,ev-batch-005-a-work-18e08fe95968a6537773` |
| `work-1bce95b6c02673e59bcf` | `comedy` | `work-1bce95b6c02673e59bcf,comedy,unknown,,,ev-batch-005-a-work-1bce95b6c02673e59bcf` | `work-1bce95b6c02673e59bcf,comedy,known,2,0.60,ev-batch-005-a-work-1bce95b6c02673e59bcf` |

## Exact terminal hashes

| File | Old SHA-256 | New SHA-256 | Change |
| --- | --- | --- | --- |
| `adjudication/text-final-chunk-02.csv` | `430aad3d52757f02a1bfeab003af0dea49e8fec92283204b55240376dff704b6` | `18bed6d698d409dedcb041c00e8d07cd5b2b2ed417f3bfc4f6e226e48e95d5b7` | six unknown rows became known |
| `adjudication/genres-final-chunk-02.csv` | `793bc52f85519ec1a6768bebb50d88ce129548eb13a6f9b5d2128517730764de` | `793bc52f85519ec1a6768bebb50d88ce129548eb13a6f9b5d2128517730764de` | unchanged; no Genre proposal accepted |
| `adjudication/themes-final-chunk-02.csv` | `671539087a1958781e9d11a9e9bc67e057f009846f0ba5e6f2203a18d1ad7cf9` | `671539087a1958781e9d11a9e9bc67e057f009846f0ba5e6f2203a18d1ad7cf9` | unchanged; no Theme proposal accepted |

## Gate recount

| Pos | Canonical title | Narrative | Tone | Genre | Theme | Art | Remaining text gap |
| --: | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 11 | ヨルムンガンド | 2/6 | 3/7 | 1/1 | 1/1 | 0/4 | N+2, T+2 |
| 12 | ボクラノキセキ | 2/6 | 4/7 | 1/1 | 1/1 | 0/4 | N+2, T+1 |
| 13 | おまかせ精霊 | 2/6 | 1/7 | 1/1 | 1/1 | 0/4 | N+2, T+4 |
| 14 | ニラメッコ | 0/6 | 4/7 | 1/1 | 1/1 | 0/4 | N+4, T+1 |
| 15 | 恋愛ラボ | 0/6 | 5/7 | 1/1 | 1/1 | 0/4 | N+4 |
| 16 | 銀のスプーン | 3/6 | 5/7 | 1/1 | 1/1 | 0/4 | N+1 |
| 17 | おかめ日和 | 1/6 | 5/7 | 1/1 | 0/1 | 0/4 | Theme+1, N+3 |
| 18 | 新黒沢 最強伝説 | 1/6 | 3/7 | 1/1 | 1/1 | 0/4 | N+3, T+2 |
| 19 | カレチ | 3/6 | 2/7 | 1/1 | 1/1 | 0/4 | N+1, T+3 |
| 20 | GREEN WORLDZ | 2/6 | 3/7 | 1/1 | 1/1 | 0/4 | N+2, T+2 |

Chunk-02 gate totals after overlay: Genre `10/10`, Theme `9/10`, Narrative `0/10`, Tone `3/10`, Art `0/10`, all non-Art text gates `0/10`. This is still `TEXT_GATE_FAIL` for every position, not a promotion or source-unavailable decision.

## Boundary

- `text-final-chunk-02.csv` is the only changed terminal CSV; Genre and Theme bytes remain unchanged.
- All 40 Art rows remain `unknown`; unknown was never converted to zero.
- No research, Pass A, source, provenance, packet, overlay, generated catalog, status, promotion, eligibility, identity, safety, or review-humanity field was changed.
- No promotion, overlay build, source mutation, commit, or deployment was performed.
