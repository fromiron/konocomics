# Batch 004 text-gap recovery independent QA — chunks 04–05

## Review identity and boundary

- reviewer: Daybreak independent QA
- reviewed inputs: frozen positions 31–50, Factor Dictionary, annotation guide, Batch 004 request, original official-first research, Pass A CSV/notes, Grok Pass B, Daybreak text adjudication, and recovery chunks 04–05
- frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`
- recovery chunk 04 SHA-256: `5d6929f9b87e98f4f7f526733c46588643888af8c7c274b9f31bd4a79a9668b0`
- recovery chunk 05 SHA-256: `eff8683fc217cbca8ab74e8146f177fe2363354961cade8cb597628c2b5d54ce`
- scope: exact `entry_1_3_volumes`; `さよなら絵梨` uses the complete-one-shot exception
- `reviewedByHuman=false`; Art not reviewed; no promotion, CSV edit, registry edit, or eligibility decision

`ACCEPT` means the exact proposed cell is sufficiently direct for Pass C consideration. `REJECT` means the proposed value violates the dictionary, scope, evidence policy, or the frozen-cell boundary. `UNKNOWN` means the observation is plausible but the current packet cannot responsibly close the cell. An `ACCEPT (frozen/no-op)` row confirms an already-adjudicated value and is not a new recovered cell.

## Overall result

- proposed cells reviewed: `70`
- `ACCEPT`: `37`, including `3` frozen/no-op duplicates
- `UNKNOWN`: `23`
- `REJECT`: `10`
- recovery packet verdict: `NEEDS_CORRECTION`
- accepted-cell drift: position 43 proposes `relationshipStructure=2` over frozen `1`; reject that mutation. Positions 31 `worldBuilding=2`, 35 `pacing=2`, and 47 `characterArcWeight=2` are confirmations only.
- position 42: the old `SOURCE_INFORMATION_UNAVAILABLE` result is not reproducible after the bounded re-search. It must be withdrawn. The Dictionary Theme gate remains unresolved, so this finding is not a promotion approval.

## Source, date, access, and independence audit

- All `96` unique recovery URLs were checked on `2026-08-25`: `93` returned HTTP 200, StoryGraph and Manba returned HTTP 403 to the command-line client but remained readable through an independent web reader, and one Note URL returned HTTP 404.
- `tgr-38-note-kaoru` is malformed: the packet records `https://note.com/kaoru246/n/n82165f7fd57`; the live article is `https://note.com/kaoru246/n/n82165f7fd57c`. The missing final `c` must be corrected before any dependent cell is accepted.
- `tgr-32-mangasuki` incorrectly says `not exposed`; the page exposes publication `2020-10-05` and update `2024-08-11`.
- `tgr-34-mangawatch` incorrectly says `not exposed`; the page exposes publication `2024-10-28`.
- `tgr-33-sony` and `tgr-34-cmoa` expose individual review dates. Their selected reviewer/date/claim mappings must replace the aggregate `not exposed` record before those reviews are promotion evidence.
- `tgr-33-manba` exposes only a relative posting age in the checked page, so `not exposed` remains accurate for an exact date.
- Same-page reviewer bundles are usable only where the packet states distinct reviewers and a repeated concrete claim. Ratings, mood tags, recommendation membership, art opinions, and unscoped later-volume observations remain excluded.
- The frozen and recovery title rows contain no decorative `『` or `』` delimiters.

## Chunk 04 cell QA — positions 31–40

### 31 — 邪神の弁当屋さん

| cell | result | exact rationale |
| --- | --- | --- |
| `worldBuilding=2` | `ACCEPT (frozen/no-op)` | Daybreak already froze this cell. Official volumes 1–3 directly repeat the god/human/monster setting, divine power, shrine/festival, and inner-space rules. Do not count it as recovery. |
| `mysteryReveal=2` | `ACCEPT` | Official volumes 2–3 name hidden power, pasts, and a disclosed secret; bounded 1–2-volume reviewer observations independently report a question followed by partial recovery. This supports some secret/reveal reward, not a clue-network level 4. |
| `pacing=2` | `ACCEPT` | The three official volume records move through shop life, new actors, communal cleaning, festival, and an inner-space incident. These are ordinary arc/state changes; no fast-4 inference is made. |
| `characterArcWeight=2` | `UNKNOWN` | Deficits, viewpoints, and relationships are present, but the packet does not directly establish character change as a recurring reward rather than character introduction. |
| `emotionalWarmth=3` | `UNKNOWN` | Warmth is described by jury comments with unspecified reading range and aggregated Cmoa observations. The exact entry-scoped repeated reviewer-to-claim mapping is insufficient for the between-anchor value 3. |
| `mentalStress=2` | `REJECT` | Fear, deprivation, secrets, and a serious tone do not directly establish sustained anxiety or pressure. The recovery document itself records this as low confidence and admits `unknown` is equally valid. |

### 32 — 働かないふたり

| cell | result | exact rationale |
| --- | --- | --- |
| `pacing=0` | `ACCEPT` | Official volumes 1–3 directly retain the same loose four-panel home routine with little goal/state movement while adding only limited neighbor contact. Short episode length is not being mistaken for fast pacing. |
| `progression=0` | `UNKNOWN` | Continued unemployment is not itself proof that growth/acquisition rewards are nearly absent, and the same sources show social contact opening. A direct bounded absence audit is still missing. |
| `emotionalWarmth=3` | `ACCEPT` | Close siblings, family routine, and repeated friend/neighbor contact are direct in the official chain and independently corroborated by two reading sources. Correct `tgr-32-mangasuki`'s exposed publication metadata before overlay use. |

### 33 — あした死ぬには、

| cell | result | exact rationale |
| --- | --- | --- |
| `pacing=2` | `ACCEPT` | Official volumes 1–3 move among health, work/money, caregiving, and film-making situations across the recurring women. That is ordinary arc change, not rapid pacing. |
| `progression=2` | `REJECT` | Job change, caregiving, and life transition are not the Dictionary's repeated growth/acquisition/mastery reward. The recovery packet itself distinguishes them from skill growth. |
| `problemSolving=1` | `UNKNOWN` | Explaining symptoms to a colleague is one concrete response, but the packet does not establish a recurring constraint-response process. Sony reviewer/date mappings also need completion. |

### 34 — ドカ食いダイスキ！ もちづきさん

| cell | result | exact rationale |
| --- | --- | --- |
| Theme `cooking:1` | `REJECT` | The direct recurring mechanic is consumption/overeating, not cooking or preparation. The earlier Pass A QA explicitly cleared an empty Theme set on this distinction. |
| `pacing=2` | `ACCEPT` | Official volumes and bounded episode reviews directly change menu, location, and immediate situation across self-contained episodes. This supports ordinary episode-level change, not 4. Record MANGA Watch's exposed `2024-10-28` date before use. |
| `problemSolving=1` | `REJECT` | Self-justification, dietary evasion, and failed self-control are not solutions under the Dictionary. |
| `characterArcWeight=2` | `UNKNOWN` | Weight gain and diet attempts may be recurring gag resets; the packet does not show sustained character change as a balanced reward. |
| `mentalStress=1` | `UNKNOWN` | Health-check worry and regret are plausible but not directly repeated enough to close sustained pressure. |
| `emotionalWarmth=2` | `UNKNOWN` | One food-sharing observation and generic social wishes do not establish mixed relational warmth across the entry range. |

### 35 — ディグイット

| cell | result | exact rationale |
| --- | --- | --- |
| `problemSolving=2` | `UNKNOWN` | Defensive play and position-specific skill conflict show sports action, but the packet does not directly describe a recurring blend of constraint analysis and solution. |
| `pacing=2` | `ACCEPT (frozen/no-op)` | Already frozen by Daybreak from the official practice-match and rivalry sequence. Do not count it as recovery. |
| `mentalStress=2` | `ACCEPT` | The official entry repeatedly ties the protagonist's role to paternal expectation, separation, self-proof, and rival pressure; independent volume-1 readers corroborate that bounded conflict. |
| `emotionalWarmth=2` | `UNKNOWN` | Team, coach, and teammate presence alone does not establish supportive warmth as a recurring reward. |

### 36 — 坂本ですが?

| cell | result | exact rationale |
| --- | --- | --- |
| `pacing=2` | `ACCEPT` | Official volumes and entry-mapped reviews enumerate successive school incidents and an event change. Event count supports ordinary episodic movement, not fast 4. |
| `problemSolving=2` | `ACCEPT` | Two independent entry reviews directly describe repeated, different responses to bullying, punishment, a beehive, errands, and school disruptions. The solutions are action-heavy and comic, so 2 rather than ingenious-analysis 4. |
| `relationshipStructure=2` | `UNKNOWN` | Many students reacting to one protagonist do not establish a fixed party or relationship network; the packet itself notes protagonist-centered reactions. |
| `emotionalWarmth=2` | `ACCEPT` | Separate entry reviews directly record protection of a bullied student and repeated considerate/non-harmful handling of surrounding characters. Out-of-range graduation observations are excluded. |

### 37 — 来世は他人がいい

| cell | result | exact rationale |
| --- | --- | --- |
| Theme `combat:1` | `REJECT` | Yakuza organizations, threats, and interpersonal conflict do not directly establish combat as a recurring mechanic. No entry-scoped fight sequence is identified. |
| `worldBuilding=2` | `ACCEPT` | Official volumes 1–3 repeatedly make the two regional organizations, family relations, and their functional social constraints important to events. This supports a functional setting, not a rule-dense 4. |
| `mysteryReveal=2` | `UNKNOWN` | The Cmoa series-page foreshadowing claim is not mapped to exact reviewers and entry volumes; official hidden motives/relationship additions do not by themselves establish recurring reveal reward. |
| `problemSolving=1` | `UNKNOWN` | Generic collision/cooperation in organization incidents is not a direct recurring solution process. |

### 38 — カラオケ行こ！

| cell | result | exact rationale |
| --- | --- | --- |
| `pacing=3` | `UNKNOWN` | The complete work plausibly shifts from comedy to voice-change tension and danger, but an essential transition source has a broken URL in the packet. Repair `tgr-38-note-kaoru` and re-run the exact source mapping. |
| `mysteryReveal=2` | `UNKNOWN` | The early-clue recovery claim depends on the same malformed source record; one remaining surprise-ending review is not enough for repeated secret/reveal reward. |
| `problemSolving=1` | `UNKNOWN` | Weekly singing lessons establish a goal and activity, not a directly observed constraint-solving method. |
| `progression=2` | `UNKNOWN` | Voice concerns, lessons, and relationship change do not yet show repeated skill/mastery reward with a clear start-to-result chain. |
| `emotionalWarmth=3` | `ACCEPT` | Two independent complete-work reviews directly repeat respect, friendship, and distance change, with official jury commentary corroborating the emotional resolution. No romance inference is made. |
| `mentalStress=2` | `UNKNOWN` | One valid review records late pressure, while the second supporting URL is malformed. Repair and remap before closing the cell. |

### 39 — となりの猫と恋知らず

| cell | result | exact rationale |
| --- | --- | --- |
| `problemSolving=1` | `REJECT` | Trying to speak and broaden relationships is character/relationship activity, not Dictionary problem solving. |
| `emotionalWarmth=3` | `ACCEPT` | Multiple distinct volume-1 reviewers and an independent volumes-1–2 reading record repeat calm closeness, healing affect, and gradual connection within the exact entry scope. |
| `mentalStress=1` | `UNKNOWN` | Shyness and difficulty initiating contact are an entry barrier, but sustained pressure is not directly established. |

### 40 — カッコウの許嫁

| cell | result | exact rationale |
| --- | --- | --- |
| `mysteryReveal=2` | `REJECT` | The switched-birth fact is the opening premise reveal. Volumes 2–3 use it for cohabitation and relationships but do not establish a recurring clue/reveal reward. |
| `problemSolving=1` | `UNKNOWN` | The packet names relationship/family problems and generic attempts to get through them, not a concrete recurring solving process. |
| `emotionalWarmth=3` | `ACCEPT` | Independent entry reviews directly describe opening up during cohabitation and repeated family/classmate support, while retaining competition that prevents 4. |
| `comedy=2` | `ACCEPT` | Separate volume-1/early-volume review sources repeatedly describe comic dialogue and relationship/cohabitation incidents. This is supplemental observation, not Genre-to-Axis inference. |

## Chunk 05 cell QA — positions 41–50

### 41 — 鵺の陰陽師

| cell | result | exact rationale |
| --- | --- | --- |
| `progression=2` | `ACCEPT` | Two independent volume-1 readings identify the contract/exorcism as the start of Gakuro's growth, while official volumes 2–3 continue increasingly difficult encounters. No mastery-4 claim is made. |
| `problemSolving=2` | `ACCEPT` | A bounded review identifies school monster problems being solved, and official volumes 2–3 add getting through a difficult situation and an explicit countermeasure after weapon loss. This supports mixed action/situational response. |
| `characterArcWeight=2` | `ACCEPT` | Official defeat/living-arrangement change for Dayo and corroborated Gakuro growth directly balance character movement with exorcism events. |
| `comedy=1` | `UNKNOWN` | One review mentions game/subculture jokes and the publisher gives a character trait, but the required repeated independent observations are missing. |

### 42 — モテキ

| cell | result | exact rationale |
| --- | --- | --- |
| Genre `romance` | `ACCEPT` | The bounded licensed volume-1 synopsis directly centers multiple romantic opportunities; independent Cmoa and BookLive volume-1 readers corroborate the same subject. This repairs the earlier title-only defect. |
| `pacing=2` | `ACCEPT` | Several women and romantic turns occur within the bounded entry synopsis and are repeated by independent volume-1 reviews. This is ordinary arc change, not 4. |
| `characterArcWeight=2` | `ACCEPT` | Independent entry readers directly repeat self-loathing, hesitation, attempted action, and recovery alongside relationship events. |
| `relationshipStructure=2` | `ACCEPT` | The licensed synopsis and reviews directly establish the protagonist navigating several recurring women and a friend context; this is a core cast, not a multi-perspective ensemble 4. |
| `comedy=2` | `ACCEPT` | The content synopsis calls the work a painful love comedy, and independent readers describe the failures/agitation as comic without making comedy constant. |
| `mentalStress=2` | `ACCEPT` | Separate Cmoa and BookLive volume-1 readers directly repeat self-loathing, self-destructive response, worry, and agitation while also noting that the work is not wholly dark. |
| `romance=4` | `ACCEPT` | Multiple romantic opportunities and the protagonist's pursuit are the direct entry engine in the licensed synopsis and both independent review routes. |

Bounded query and source results make `SOURCE_INFORMATION_UNAVAILABLE` false. The work still has no directly supported Dictionary Theme; that unresolved gate must not be disguised as the old source blocker.

### 43 — 八雲さんは餌づけがしたい。

| cell | result | exact rationale |
| --- | --- | --- |
| `relationshipStructure=2` | `REJECT` | Daybreak already froze `relationshipStructure=1`. Recovery was restricted to residual unknown cells, so changing an accepted cell is unreviewed drift. The evidence may be raised in a separate explicit re-adjudication, not silently overlaid. |
| `comedy=2` | `ACCEPT` | Official volumes 1–3 directly repeat exaggerated appetite, hungry teammates, and an expressly amusing incident while retaining the heartful daily-life balance. |

### 44 — 高嶺と花

| cell | result | exact rationale |
| --- | --- | --- |
| `problemSolving=1` | `ACCEPT` | Official volumes 2–3 directly show bounded practical obstacles: maintaining an assumed identity at a hostile family party and responding to a failed test through study/tutoring. These support a below-midpoint mix of action under constraint. |
| `emotionalWarmth=2` | `ACCEPT` | Repeated tutoring, nursing, and shared events are direct in official volumes 1–3, while conflict and power asymmetry keep the value at mixed 2. |

### 45 — ここは今から倫理です。

| cell | result | exact rationale |
| --- | --- | --- |
| `problemSolving=2` | `ACCEPT` | The official three-volume chain repeatedly presents student problems and a teacher thinking with and speaking to students; two independent volumes-1–2 reviews corroborate the case-by-case intervention. |
| `pacing=2` | `ACCEPT` | Different student cases succeed one another inside the stable classroom frame across volumes 1–3. This is ordinary case/arc movement. |
| `darkness=2` | `ACCEPT` | Official burdens/salvation language and two bounded independent reviews directly repeat loss, bullying, work, money, and despair. These are serious mixed risks, not automatic darkness 4. |
| `emotionalWarmth=2` | `ACCEPT` | Official volumes 2–3 repeatedly describe thinking with, staying beside, and speaking to students; both independent reviews corroborate supportive intervention. |

### 46 — さよなら絵梨

| cell | result | exact rationale |
| --- | --- | --- |
| `mentalStress=3` | `ACCEPT` | The complete one-shot's official spine repeatedly includes illness, death, a suicide attempt, grief, another secret/loss, and unstable collaboration; a complete-work reader independently corroborates continued heavy pressure. |
| `emotionalWarmth=2` | `UNKNOWN` | Collaborative filmmaking is direct, but interpreting it as warmth relies on one supplemental review and the relationship is also unstable. A second independent bounded observation is required. |

### 47 — 極楽街

| cell | result | exact rationale |
| --- | --- | --- |
| `characterArcWeight=2` | `ACCEPT (frozen/no-op)` | Daybreak already froze this cell. Do not count it as recovery. |
| `mentalStress=2` | `ACCEPT` | Official volumes 2–3 directly repeat exposed weakness, desperate friend rescue/persuasion, rampage, and despair. This supports mixed pressure without deriving graphic violence or 4. |

### 48 — アオハライド

| cell | result | exact rationale |
| --- | --- | --- |
| `mysteryReveal=2` | `UNKNOWN` | A product synopsis withholding a boy's identity and a later recognition of a love triangle do not directly establish secrets/reveals as a recurring reward. No new bounded review was added after Daybreak froze this cell unknown. |
| `emotionalWarmth=2` | `UNKNOWN` | Trying to build relationships and meeting a kind-but-distant boy establish relationship activity, but the short summaries do not directly establish repeated warmth amid exclusion and triangle conflict. |

### 49 — 青の祓魔師

| cell | result | exact rationale |
| --- | --- | --- |
| `problemSolving=2` | `REJECT` | This reintroduces the same inference Daybreak rejected: training, missions, spirit search, weapon loss, and uncontrolled flames establish action/investigation, not a recurring analysis-and-solution process. No new qualifying evidence was added. |

### 50 — LOVE SO LIFE

| cell | result | exact rationale |
| --- | --- | --- |
| `problemSolving=2` | `REJECT` | Official summaries establish childcare obligations but not the solving method. The concrete adaptation/incident claims come from user reviews, while the current policy does not permit user reviews to establish `problemSolving`; they may only supplement the listed Tone/relationship/pacing observations and recurring structure. |

## Handoff

- Correct the four exposed-date records and the malformed position-38 Note URL before using those sources in an overlay.
- Preserve the three frozen/no-op values and reject the position-43 silent drift.
- Re-adjudicate only `ACCEPT` cells as possible additions; leave `UNKNOWN` cells unknown and do not substitute nearby values.
- Position 42 requires a new disposition based on its real remaining gates. `SOURCE_INFORMATION_UNAVAILABLE` is no longer a valid blocker code for it.
- This QA creates no promotion result and does not assert that any position now clears Genre, Theme, Narrative, Tone, Art, identity, safety, context, or eligibility gates together.
