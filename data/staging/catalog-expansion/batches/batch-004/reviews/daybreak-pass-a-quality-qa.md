# Batch 004 Pass A independent quality QA

## Verdict

- overall: `NEEDS_REVIEW`
- work-level results: `PASS 40`, `NEEDS_REVIEW 9`, `REJECT 1`
- reviewedByHuman: `false`
- review scope: the exact 50 frozen works, their official-first research packets, Pass A Factor/Genre/Theme rows and notes, the Factor Dictionary, the annotation guide, and the Luna vector QA
- non-decision: this QA does not edit annotation values, approve eligibility or promotion, or substitute for Pass B/adjudication

The CSV structure and frozen-work references pass. The sparse distribution is mostly a legitimate consequence of using `unknown` when official product descriptions do not establish recurrence or intensity. It is not evidence that a vector was copied. However, nine works need bounded re-review of specific cells, and `work-d63a83030a8819ff553c` is rejected as a Pass A annotation because chapter titles were converted into numeric Axis and Genre conclusions despite the research packet's own limitation.

## Art policy result

`PASS` — all `200/200` Art cells are explicit `unknown`, with blank value/confidence. The five notes packets record no qualifying representative-edition internal-page sample. No cover, synopsis, animation frame, or user art opinion was converted into an Art value, and no `motionImpact=notApplicable` was inferred from missing pixels. This review made no pixel or Art-value judgment.

## Required cell-level review

| result | workId | title | exact cell(s) | evidence finding |
| --- | --- | --- | --- | --- |
| `NEEDS_REVIEW` | `work-132ce7172750a3b1fa53` | ヒナまつり | `factors.problemSolving=known:2` | The official volume-2 synopsis contains one countermeasure by 新田, but the packet does not establish a recurring mix of analysis and direct action across the entry range. Recheck as `unknown` unless a bounded repeated process is added. This is the unsupported cell that makes its vector nearly identical to `応天の門`. |
| `NEEDS_REVIEW` | `work-3ad85a2ffdc026007d61` | 新しい上司はど天然 | `factors.characterArcWeight=unknown`, `factors.relationshipStructure=unknown`, `factors.comedy=unknown`, `factors.emotionalWarmth=unknown` | The official publisher release directly defines a workplace comedy in which the new boss repeatedly relieves the transferred employee's worry. Keeping every text Axis unknown is more conservative than the same packet's known Genre/Theme decision and leaves direct central-pair/comedy/relief observations unused. Re-annotate only the cells supported by the one-volume/first-major-entry boundary. |
| `NEEDS_REVIEW` | `work-44d0000353478596369e` | 環と周 | `factors.worldBuilding=known:3`, `factors.mentalStress=known:3` | Five time settings do not by themselves establish repeated history/culture/rules at level 3. Illness, separation, survival, murder and forced marriage support darkness content, but the product synopsis does not establish sustained reader pressure at `mentalStress=3`. Recheck both independently; do not infer stress from darkness. |
| `NEEDS_REVIEW` | `work-741deb03d9f59e723929` | ルックバック | missing `themes.crafting` row | The complete one-shot's official synopsis makes manga creation the mechanism that connects and sustains the central relationship. Within this batch, film production is already treated as `crafting` for `さよなら絵梨`; adjudicate `crafting` centrality against the same dictionary usage rather than leaving the Theme set empty without explanation. |
| `NEEDS_REVIEW` | `work-80a2f62ce5073ade2ec2` | 式の前日 | `factors.characterArcWeight=unknown`, `factors.emotionalWarmth=unknown` | The official complete-collection description explicitly says the stories repeatedly isolate two-person family/marriage moments and present them warmly. That is bounded whole-book evidence for relationship-centered reward and warmth, even though it is insufficient for a single fixed `relationshipStructure` or a collection-wide romance value. Recheck these two cells only. |
| `NEEDS_REVIEW` | `work-8733067e6afcaeadbd8d` | さんすくみ | `factors.romance=known:2` | The official volume-2 description says romance is scarce, and the packet names only one meeting in volume 3. That supports presence but not a recurring subplot at anchor 2. Recheck the 1/unknown boundary instead of retaining 2 from a single bounded incident. |
| `REJECT` | `work-d63a83030a8819ff553c` | モテキ | `genres=romance`, `factors.pacing=known:2`, `factors.romance=known:2` | The only content evidence is official tables of contents. The research packet explicitly says chapter titles are not direct plot summaries and cannot establish relationship intensity. Short-chapter units also do not prove goal/state-change frequency. These three conclusions require a real official synopsis, inspected entry content, or eligible corroborating reviews before Pass A can proceed. |
| `NEEDS_REVIEW` | `work-eef84d07d90ba2b040cf` | さよなら絵梨 | `genres=""` | The same complete one-shot description that supports `mysteryReveal=2` directly identifies Eri's secret and the reality/creation boundary as central. Recheck whether dictionary Genre `mystery` applies; the empty Genre row is not explained by lack of bounded evidence. Do not derive Genre automatically from the Axis—use the cited complete-work description. |
| `NEEDS_REVIEW` | `work-f8cb26831612e0c6ece5` | 極楽街 | `factors.problemSolving=known:2` | “Problem solver” is an occupation label, while the official descriptions establish investigations, pursuit, rescue and combat but not a recurring constraint-analysis or clever-solution process. Keep `investigation`/`mysteryReveal` separate and recheck `problemSolving` as unknown absent direct process evidence. |
| `NEEDS_REVIEW` | `work-fd2a957c501c36047ed0` | 青の祓魔師 | `factors.mentalStress=known:2` | Death, demon attacks, stolen weapons and uncontrolled fire support danger/darkness, but the product synopses do not establish sustained anxiety or psychological pressure. Recheck this cell independently so darkness is not mechanically copied into mental stress. |

## Work-by-work disposition

`PASS` below means that the reviewed Pass A cells are defensible from the frozen packet; it is not a promotion approval.

| position | workId | result | finding |
| ---: | --- | --- | --- |
| 1 | `work-025c8ab93483a39c9330` | `PASS` | The central pair, mutual support and bounded warmth are directly repeated across the supplied volume-2/3 descriptions; empty Theme is legitimate because occupation is context, not a repeated workplace mechanic. |
| 2 | `work-098b1781e14365eea667` | `PASS` | Volumes 1–3 directly support relationship progression, central romance and school Theme. |
| 3 | `work-0f3a44f5dcab9623d1be` | `PASS` | Repeated cases, rational/witty duo, court setting and revealed truth directly support the known cells and investigation/history Themes. |
| 4 | `work-11d23966f22f777e95d0` | `PASS` | Repeated family-placement, belonging and resident-character episodes support the functional setting, relationships and found-family Theme. |
| 5 | `work-132ce7172750a3b1fa53` | `NEEDS_REVIEW` | `problemSolving=2` lacks recurrence; other known cells are independently supported by the psychic/cohabitation and danger bounds. |
| 6 | `work-15dba4fdb46308ab45d7` | `PASS` | The town-linked ensemble supports `relationshipStructure=4`; no dictionary Theme is directly recurring enough to require a row. |
| 7 | `work-188ba092c6195603bb3f` | `PASS` | Journey, domain/procession institutions and political complications independently support the sparse vector and three Themes. |
| 8 | `work-19c2017b33c07f48634e` | `PASS` | Three official volume pages repeatedly frame a two-sister four-panel comedy; empty Theme is legitimate. |
| 9 | `work-1a6ad6771865b43c8516` | `PASS` | Neighborhood café setting and repeated publisher/jury comedy observations support the known cells; no mystery value was inferred from “aspiring detective.” |
| 10 | `work-1cdc6c5cca7c33fafe51` | `PASS` | All-text-unknown, empty Genre and empty Theme are justified because only identity records and an unbounded series-wide jury comment are available. This may fail later coverage, but it is not a Pass A fabrication. |
| 11 | `work-23077ad33a2066bef5a6` | `PASS` | Official volumes 1–3 repeatedly describe institutional family separation, a child group, attachment and shared setting. |
| 12 | `work-2356050c72240569e1c5` | `PASS` | Child-centered emotional processing, family separation and warm acts repeat across three official descriptions; school centrality is bounded. |
| 13 | `work-2c4fe00df5255fc082f9` | `PASS` | The rights-holder premise supports a regulated hero workplace/world and central combat; early jury observations independently bound moderate comedy. |
| 14 | `work-2d385ad0525742330e70` | `PASS` | Training, first killing, organization tests, abduction and rescue recur across all three official volumes and support the extreme darkness/romance values without using Art. |
| 15 | `work-2df743e085adef5e9bd3` | `PASS` | Three volumes directly change body/status/location and repeat assassin/school conflict and comedy. |
| 16 | `work-2f1d1c3ad0f943f1562f` | `PASS` | Repeated search for feelings, non-human coexistence and school relationships support the known cells; romance remains conservatively unknown. |
| 17 | `work-3713ab561de583d709bc` | `PASS` | The official series premise plus licensed volume-3 description support a central pair, functional SF setting and limited workplace Theme. |
| 18 | `work-39c1a2b6791238827ed5` | `PASS` | Official 1–3 descriptions repeatedly cover welding work, craft hazards, family and seasonal episodes. |
| 19 | `work-3ad85a2ffdc026007d61` | `NEEDS_REVIEW` | The all-unknown text vector discards direct first-volume workplace-comedy, central-pair and worry-relief observations. |
| 20 | `work-44d0000353478596369e` | `NEEDS_REVIEW` | `worldBuilding=3` and `mentalStress=3` exceed what the complete-volume synopsis directly establishes. |
| 21 | `work-53fb816835ab36e40a1f` | `PASS` | Meeting, organization entry, ability rules and recurring combat directly support the sparse vector. |
| 22 | `work-62fbc6b2253b895e3a66` | `PASS` | Volumes 1–3 directly center the same romance and core trio; empty Theme is justified from the supplied bounds. |
| 23 | `work-634f34830600e07d8f17` | `PASS` | Tea-club learning and the protagonist's nonviolence/change goal support progression, character weight and school Theme. |
| 24 | `work-65f856a6fa2078f21d2f` | `PASS` | Marriage/death premise, training, kidnapping and shared living independently support the same coarse romance vector as `俺物語！！`; matching values are not copied conclusions. |
| 25 | `work-741deb03d9f59e723929` | `NEEDS_REVIEW` | Known Axis values are bounded, but the empty Theme set omits a direct central creation mechanic. |
| 26 | `work-7c8931bc010e2f28f7ec` | `PASS` | The publisher press release directly describes eight school-life shorts and repeated offbeat humor; other text Axis unknowns are conservative. |
| 27 | `work-7d4568dcc8e9175d35ba` | `PASS` | Three volumes repeat the present/otherworld frame, core trio and comedy; neither that frame nor flashback is `timeTravel`. |
| 28 | `work-7f0f63c5d80083f2be7f` | `PASS` | The four-person emotional network and romance changes are explicit across three volumes; no school Theme is forced from an unbounded setting assumption. |
| 29 | `work-80a2f62ce5073ade2ec2` | `NEEDS_REVIEW` | The all-unknown vector fails to use direct whole-collection evidence for relationship-centered reward and warmth. |
| 30 | `work-8733067e6afcaeadbd8d` | `NEEDS_REVIEW` | The occupational setting and trio are supported, but `romance=2` overstates the source's explicitly scarce, single-event presence. |
| 31 | `work-925f371723beac5227f7` | `PASS` | Repeated god/human/monster bento-shop setting supports world, relationship and cooking; warmth remains conservatively unknown because jury scope is non-uniform. |
| 32 | `work-961a49798df191311f42` | `PASS` | The sibling/neighbor group and continuing four-panel daily-comedy form support the two known cells; empty Theme is legitimate. |
| 33 | `work-9bd00739b995d84e2494` | `PASS` | Three official volumes and episode mapping support the recurring trio, life/work burdens and limited romance presence. |
| 34 | `work-a3d922576a1a1ecc8e3e` | `PASS` | Three official volumes repeat overeating as the central gourmet gag; `cooking` is not required because the evidence establishes consumption, not preparation. |
| 35 | `work-aa85b65d02f367e76a07` | `PASS` | Position change, team entry, practice matches and rivalries directly support progression, pacing and sports competition. |
| 36 | `work-af3443bab1c30d470a76` | `PASS` | The recurring school premise and bounded jury observation support central comedy; “stylish” was not converted into Art. |
| 37 | `work-bd5c323a3dbc9f3a04d4` | `PASS` | Three official volumes expand the yakuza engagement into an intersecting relationship network; the rights-holder editorial supports mixed unease/comedy. |
| 38 | `work-c2df32661c0b925ff74f` | `PASS` | The complete single volume and jury observations support the central pair, character focus, moderate comedy and secondary school context. |
| 39 | `work-c2f3864045578cebb590` | `PASS` | Three official volumes explicitly progress the school relationship from first contact to shared club activity. |
| 40 | `work-c5c2695ad33fd05af945` | `PASS` | Three official volumes directly expand the engagement/shared-living premise and multi-person romance network. |
| 41 | `work-c7280f9dcc2754d3f864` | `PASS` | Three official volumes repeat school exorcism, collaboration and combat; its exact sparse vector match is independently grounded. |
| 42 | `work-d63a83030a8819ff553c` | `REJECT` | Genre and two Axis conclusions rely on chapter-title implications that the research packet explicitly forbids treating as plot evidence. |
| 43 | `work-d8a87d01c1f35d58e791` | `PASS` | Repeated evening meals, cooking, game attendance and changing pair relationship support the known cells and Themes. |
| 44 | `work-e2f095e08fc5e08d5a2b` | `PASS` | Publisher descriptions explicitly repeat an age-gap arranged-meeting love comedy across three volumes. |
| 45 | `work-e81955a9fc5c4d84580f` | `PASS` | Three official descriptions repeat teacher/student problems and inner burdens, supporting moderate mental stress without inferring unspecified cases. |
| 46 | `work-eef84d07d90ba2b040cf` | `NEEDS_REVIEW` | Numeric cells are bounded to the complete one-shot, but the empty Genre needs an explicit mystery decision from the same direct description. |
| 47 | `work-f8cb26831612e0c6ece5` | `NEEDS_REVIEW` | Investigations and combat are supported; analytical/clever `problemSolving=2` is not. |
| 48 | `work-fc53cb5669aa4099ee4a` | `PASS` | School exclusion, reunion and triangle changes repeat across volumes 1–3 and directly support the known cells. |
| 49 | `work-fd2a957c501c36047ed0` | `NEEDS_REVIEW` | Training, school, world and darkness are supported, but `mentalStress=2` is inferred from danger rather than a direct sustained-pressure observation. |
| 50 | `work-ff9b025f58d7e12f3cb1` | `PASS` | Three official volumes repeat childcare work, family-like home relationships and school/day-care contexts. |

## Vector and distribution adjudication

### Exact vectors

- `PASS`: `work-188ba092c6195603bb3f`, `work-53fb816835ab36e40a1f`, and `work-c7280f9dcc2754d3f864` independently converge on `pacing=2`, `worldBuilding=2`, `relationshipStructure=2`. Their Genre, Theme, incidents and source URLs differ; no shared evidence ID crosses Works.
- `NEEDS_REVIEW`: the all-unknown group contains one justified sparse result (`work-1cdc6c5cca7c33fafe51`) and two unsupported omissions (`work-3ad85a2ffdc026007d61`, `work-80a2f62ce5073ade2ec2`). The repetition is not proof of copying, but the latter two need correction.
- `PASS`: `work-62fbc6b2253b895e3a66` and `work-65f856a6fa2078f21d2f` independently support the same `pacing=2`, `characterArcWeight=2`, `relationshipStructure=2`, `romance=4` anchors from very different official events.
- `PASS`: `work-a3d922576a1a1ecc8e3e` and `work-af3443bab1c30d470a76` each have only `comedy=4`, but each has independent repeated official/jury comedy evidence. Sparse equality is expected, not copied annotation.

### Near-identical vectors

The distance-1 pairs are mostly explained by sparse known coverage and coarse 0/2/4 anchors. Work-level review found no cross-Work evidence reuse or duplicated notes. Four warnings identify real cell problems rather than copying:

- `work-132ce7172750a3b1fa53` near `work-0f3a44f5dcab9623d1be`: unsupported `problemSolving=2`.
- `work-f8cb26831612e0c6ece5` near `work-0f3a44f5dcab9623d1be`: occupation/investigation was incorrectly expanded to `problemSolving=2`.
- `work-3ad85a2ffdc026007d61` and `work-80a2f62ce5073ade2ec2` near the zero-known cluster: direct text observations were omitted.
- All other distance-1 pairs are cleared by their individual `PASS` rows above; matching cells have separate official bounds and do not establish a copy pattern.

### Repeated Theme sets

`PASS` for copying risk. Repeated `school`, `foundFamily`, `combat`, `workplace`, and `combat;school` sets all have per-Work direct entry evidence. The one substantive Theme omission is `work-741deb03d9f59e723929` / possible `crafting`; the other twelve empty Theme sets are justified because the available text does not establish one of the 22 dictionary mechanics as recurrent and central.

### Genre-to-Axis patterns

- `PASS`: all eight `action -> relationshipStructure=2` rows have a directly described pair/team/group; the value is not derived from action Genre.
- `PASS`: the `action/fantasy -> worldBuilding=2` rows each have an explicit ability, organization, supernatural population or institutional rule. Genre alone was not used.
- `PASS`: `work-0f3a44f5dcab9623d1be` and `work-44d0000353478596369e` independently support `mysteryReveal=2`; historical Genre is not the cause.
- mixed: `work-0f3a44f5dcab9623d1be` supports both investigation and problem solving, while `work-f8cb26831612e0c6ece5` does not support the analytical-process cell and is flagged above.
- `PASS`: the reviewed `sliceOfLife` pacing/progression/world/stress cells have explicit volume-to-volume state changes, settings, growth, or burdens. They are not applied to every slice-of-life Work, which rules out a blanket Genre mapping.
- `PASS`: the nine central-romance works with `romance=4` repeat relationship formation or change throughout the entry range. `work-8733067e6afcaeadbd8d` is separately flagged because its source says romance is scarce.

### Midpoint and unknown distribution

`PASS` with the cell exceptions above. Value 2 is the dictionary's ordinary/functional/mixed anchor, so it naturally dominates supported publisher-summary observations. More importantly, 649/850 rows are `unknown`; the annotators did not fill missing evidence with midpoint 2. The absence of value 0 is also defensible here: product summaries demonstrate included events more readily than repeated absence, and the policy correctly prefers `unknown` over inferred zero. The midpoint warning reveals the specific unsupported cells listed above, not a batch-wide fill pattern.

## Required handoff

Before Pass B or promotion use:

1. Correct or explicitly re-adjudicate only the exact cells in the required-review table.
2. Replace `work-d63a83030a8819ff553c` title-only evidence with bounded content evidence, or close its disputed fields as unknown/empty.
3. Re-run structural/vector QA after correction and confirm the 200 Art cells remain independently governed by the Art preflight pipeline.

No annotation value, Genre, Theme, eligibility field, or promotion state was changed by this QA.
