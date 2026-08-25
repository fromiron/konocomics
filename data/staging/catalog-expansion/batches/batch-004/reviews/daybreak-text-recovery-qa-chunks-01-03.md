# Batch 004 text-gap recovery QA — chunks 01–03

## Scope and attestation

- Reviewer: Daybreak independent QA.
- Frozen positions: `1–30` only.
- Inputs: `AGENTS.md`, Factor Dictionary, annotation guide, frozen Batch 004 packet, original research chunks 01–03, Pass A CSV/notes, Grok non-Art reviews 01–03, `daybreak-text-adjudication.md`, and `text-gap-recovery-chunk-01..03.md`.
- `reviewedByHuman=false`; this is model-panel QA, not human validation.
- No research, Pass A, source, registry, generated catalog, eligibility, promotion, safety, identity, or Art row was edited.
- Canonical-title check: all 30 reviewed titles exclude decorative `『』`.

## Decision rule

- `ACCEPT`: the exact proposed cell has direct `entry_1_3_volumes` or complete-one-volume evidence and matches the dictionary anchor. It may be used by the next adjudicator; this report does not apply it.
- `REJECT`: the proposal changes a Pass C accepted cell, uses the wrong dictionary construct, or overstates the exact value/centrality.
- `UNKNOWN`: the category is plausible, but the retained evidence does not establish recurrence, intensity, entry scope, or the exact numeric anchor. The cell stays `unknown`.
- Existing Pass C known cells are immutable in this recovery pass. Genre, title, metadata, event danger, synopsis silence, and model memory are not Axis evidence.

## Source-ledger QA

- All recovery records state retrieval date `2026-08-25`. Where a publication date is unavailable, the record explicitly says `undated`, `not exposed`, or supplies the publication year; no missing date was silently invented.
- A redirect-capable automated availability probe covered `110` unique recovery URLs: `99` returned `200`, `9` returned `403`, one returned `404`, and one returned `429` on 2026-08-25.
- The `403` group is the two Manba routes and seven Kodansha routes. These are access-control results, not proof that the cited page is absent; their already-recorded content remains bounded to the research ledger and is not independently expanded here.
- `https://honto.jp/ebook/pd-review_0634950093.html` currently returns `404`. It is excluded as an independently reproducible source for position 13; the Sony Reader, BookLive, rights-holder, and licensed continuation records remain separate.
- `https://www.reads.jp/books/15849` returned `429`. Position 20 does not depend on it alone because the official complete-volume description, author interview, note review, and Cmoa reviews independently preserve the linked-anthology observation.
- Same-page review blocks count as multiple observations only when separate reviewer identities and dates are exposed. A title-level review with unstated read range remains a lead and never independently closes a cell.

## Cell decisions — positions 1–10

| # | Work | Proposed cell | QA | Exact rationale |
|---:|---|---|---|---|
| 1 | ホストと社畜 | Theme `workplace:1` | `ACCEPT` | The publisher's volume-2/3 entry text repeatedly ties the two leads' worries and daily rhythms to their jobs. Centrality 1 correctly limits work to recurring context rather than an organization mechanic. |
| 1 | ホストと社畜 | `mentalStress=2` | `ACCEPT` | Health-check anxiety, fatigue, future worry, and repeated mutual encouragement are direct mixed-pressure observations across volumes 2–3; no sustained-breakdown claim is made. |
| 2 | うるわしの宵の月 | `mentalStress=2` | `ACCEPT` | Official volumes 2–3 directly repeat guardedness, uncertainty about the other person's feelings, and confusion. This fits mixed relationship pressure, not value 4. |
| 2 | うるわしの宵の月 | `emotionalWarmth=2` | `ACCEPT` | Rescue, help, trial dating, and reciprocal feeling change recur in the official 1–3 chain. Value 2 preserves the romance/drama counterweight and does not claim healing as the sole reward. |
| 3 | 応天の門 | `characterArcWeight=3` | `REJECT` | Pass C already accepted `characterArcWeight=2`. Recovery may not rewrite an accepted cell; the added reviews may corroborate the existing moderate character reward but cannot drift it to 3 here. |
| 3 | 応天の門 | `mentalStress=2` | `ACCEPT` | Official volume 3 and independent volume-3 reviewers directly connect the brother's death truth and political constraint to 道真's pressure. Buddy/case structure keeps the value moderate. |
| 4 | のらみみ | `comedy=2` | `ACCEPT` | Three official entry pages repeatedly present humorous resident-character incidents and explicitly classify the bounded work as gag alongside human drama. Value 2 avoids turning a platform label into an extreme. |
| 4 | のらみみ | `mentalStress=2` | `UNKNOWN` | Home search, age separation, and residents' problems establish story difficulty, but the packet has no qualified repeated observation of sustained reader-facing psychological pressure. Warm/funny framing cannot be converted into stress by event presence alone. |
| 5 | ヒナまつり | `comedy=2` | `ACCEPT` | The official entry explicitly calls the volume-2 supernatural battle comic and repeats disruptive cohabitation/action incidents. Mixed action and care justify 2 rather than 4. |
| 5 | ヒナまつり | `mentalStress=2` | `UNKNOWN` | Forced cohabitation, pursuit, crime, and increasing trouble are danger/plot burdens, but the official summaries do not directly establish recurring anxiety or psychological pressure. Darkness and danger are not mental stress. |
| 6 | 駅から5分 | Theme `workplace:1` | `ACCEPT` | The entry series contains a directly described taxi-work/livelihood substory. Centrality 1 correctly limits it to one recurring town-life strand and preserves the original/bunko edition note. |
| 6 | 駅から5分 | `mentalStress=2` | `UNKNOWN` | Complicated feelings and loss of taxi work are direct for one anthology strand, not a sustained pressure observation across the linked entry ensemble. The proposal overgeneralizes a substory. |
| 7 | つらつらわらじ | `problemSolving=2` | `UNKNOWN` | A split procession and next-morning reunion deadline establish a problem and direct action, but neither the official synopsis nor the bounded review shows a recurring mix of analysis and action required by the value-2 anchor. |
| 8 | ふうらい姉妹 | no proposed cell | `UNKNOWN` | The recovery correctly refuses `foundFamily` for biological siblings and does not derive Narrative/Tone values from four-panel form. Existing gaps remain open; no source-unavailable blocker follows. |
| 9 | それでも町は廻っている | `pacing=2` | `ACCEPT` | Official volumes 1 and 3 directly show ordinary episode-to-episode changes in people and situations around the stable café/neighborhood stage. This matches general arc movement, not value 4. |
| 10 | 青空にとおく酒浸り | Genre `scienceFiction` | `ACCEPT` | Comic Natalie identifies micromachines and special abilities, and independent volume-1–3 reviews describe the same entry premise. This is content evidence, not list membership. |
| 10 | 青空にとおく酒浸り | Genre `comedy` | `ACCEPT` | Comic Natalie and the Manga Taisho jury commentary independently call the work gag/comedy; multiple entry reviews describe the same construction. |
| 10 | 青空にとおく酒浸り | Theme `combat:1` | `ACCEPT` | The jury commentary directly includes battle and the volumes-1–3 review records recurring ability battles. Centrality 1 preserves daily-use SF comedy as co-central. |
| 10 | 青空にとおく酒浸り | `pacing=3` | `UNKNOWN` | “Hard to predict” is not pacing, and a high-tension/escalating volume 3 does not establish above-general goal/state-change frequency across all entry volumes. A lower value may be supportable only after exact event-frequency adjudication. |
| 10 | 青空にとおく酒浸り | `mysteryReveal=2` | `REJECT` | A focus shift to the father, multiple carriers, and an unusual premise do not establish clue, secret, reversal, or truth-disclosure as a recurring reward. |
| 10 | 青空にとおく酒浸り | `worldBuilding=3` | `ACCEPT` | The press description and independent 1–3 reviews repeat micromachine carriers, abilities, healing constraints, and connected characters as functional rules. Value 3 stays below a full history/faction system. |
| 10 | 青空にとおく酒浸り | `problemSolving=1` | `REJECT` | Automatic healing after an accident and powers used in daily life are mechanics/effects, not an observed analytical/direct problem-solving process. |
| 10 | 青空にとおく酒浸り | `characterArcWeight=2` | `UNKNOWN` | Shifting attention among the girl, father, and carriers establishes cast focus, not recurring motivation/change as a reward. |
| 10 | 青空にとおく酒浸り | `relationshipStructure=3` | `REJECT` | The sources show several connected characters but not a multi-perspective or complex relationship network. Presence of a group does not license the between-team-and-ensemble value 3. |
| 10 | 青空にとおく酒浸り | `comedy=4` | `ACCEPT` | Two institutional/editorial sources and several independent entry reviews repeatedly identify gag/slapstick as a core reward. This is the only extreme in this work with convergent recurrence evidence. |
| 10 | 青空にとおく酒浸り | `darkness=2` | `ACCEPT` | Entry reviews directly repeat accidents, violent ability use, and disturbing material, while the gag frame prevents a central-grim value. This is a tone value, not an adult-only finding. |
| 10 | 青空にとおく酒浸り | `mentalStress=2` | `UNKNOWN` | Bodily condition, danger, and a harsh parent are content leads; the sources do not directly repeat sustained anxiety or reader pressure across the bounded entry. |

## Cell decisions — positions 11–20

| # | Work | Proposed cell | QA | Exact rationale |
|---:|---|---|---|---|
| 11 | Sunny | `progression=2` | `REJECT` | Child development and reconciliation are character-arc observations, not repeated acquisition/mastery rewards. The proposal re-labels character change as progression. |
| 11 | Sunny | `pacing=2` | `ACCEPT` | Professional criticism and independent volume-1 reviews agree on an understated episode-based entry rhythm with ordinary situation changes. |
| 11 | Sunny | `mentalStress=2` | `ACCEPT` | Official 1–3 material plus independent entry reviews repeatedly describe separation, parental absence, hurt, and recovery. Value 2 preserves the warm counter-tone. |
| 12 | すみれファンファーレ | `progression=2` | `REJECT` | Changing thoughts and social experience are already character-development material; the packet does not show a repeated acquisition/mastery reward. |
| 12 | すみれファンファーレ | `pacing=2` | `ACCEPT` | Independent volume-2/3 records enumerate separate bounded episodes and ordinary monthly/episode movement. |
| 12 | すみれファンファーレ | `problemSolving=1` | `REJECT` | Bento, lottery, and spending savings to help an animal are direct/emotional actions; no analysis-or-action mixture is established. Value 1 cannot be used merely to avoid `unknown`. |
| 12 | すみれファンファーレ | `mentalStress=2` | `ACCEPT` | Divorce, isolation, tears, sadness, and adult constraints recur in official and independent entry records, while warmth prevents a high value. |
| 13 | ヒーローカンパニー | `progression=2` | `UNKNOWN` | Employment test and volume-2 team assignment show entry/status change, but not a repeated growth/acquisition reward. The currently inaccessible honto URL is excluded. |
| 13 | ヒーローカンパニー | `problemSolving=2` | `UNKNOWN` | Theft, harassment, and robbery are obstacles, but the remaining reproducible sources do not map a recurring analysis/direct-action process for solving them. |
| 13 | ヒーローカンパニー | `pacing=3` | `ACCEPT` | The rights-holder opening and independent reviews describe multiple goal interruptions within one test day. This is direct above-general short-interval state change, below maximum 4. |
| 13 | ヒーローカンパニー | `characterArcWeight=2` | `ACCEPT` | Ginga's hero ideal and adaptation are repeatedly tested by the entry incidents; event/action remains co-central. |
| 13 | ヒーローカンパニー | `relationshipStructure=2` | `ACCEPT` | The licensed volume-2 continuation supplies a five-person team and the entry reviews place the hero inside the company rather than alone. No ensemble value is claimed. |
| 13 | ヒーローカンパニー | `emotionalWarmth=2` | `UNKNOWN` | Protecting the public and performing team duty do not by themselves establish warmth/healing as a reader reward. |
| 13 | ヒーローカンパニー | `mentalStress=1` | `UNKNOWN` | A test and simultaneous incidents create situational urgency, not a repeated psychological-pressure observation. |
| 14 | ねずみの初恋 | `mysteryReveal=2` | `ACCEPT` | The official concealed organization/past premise, a bounded volume-1 revelation, and independent volume-1 reviews directly establish a secret/reveal reward. One reveal supports 2, not 4. |
| 15 | キルアオ | `progression=2` | `UNKNOWN` | School restart and re-learning are plausible development leads, but the entry sources do not show a repeated mastery/acquisition reward. |
| 15 | キルアオ | `problemSolving=2` | `ACCEPT` | Official volumes 2–3 and two distinct reviews describe concealed, constrained responses to classmate trouble, kidnapping, pursuit, and rescue. Action and judgment are mixed; no strategy or value 4 is claimed. |
| 15 | キルアオ | `characterArcWeight=2` | `ACCEPT` | The adult-killer/child-student/father role conflict is directly repeated while action remains co-central. |
| 15 | キルアオ | `emotionalWarmth=2` | `ACCEPT` | Official rescue plus independent classmate-help/family observations establish a mixed positive bond reward without a healing-core value. |
| 16 | 尾守つみきと奇日常。 | `pacing=2` | `ACCEPT` | Official sports-festival/summer movement and independent volume-1/early-school observations establish ordinary successive episodes. |
| 16 | 尾守つみきと奇日常。 | `problemSolving=1` | `REJECT` | Searching for feelings and working through self-understanding are relationship/character observations, not dictionary problem solving. |
| 16 | 尾守つみきと奇日常。 | `mentalStress=1` | `ACCEPT` | The official relationship problem and two independent entry sources directly describe mild social fatigue/unstable feelings. The bounded mild value avoids inflating it to 2. |
| 17 | アリスと蔵六 | `progression=2` | `ACCEPT` | Official volume 3 directly says Sana grows while learning/working, and independent entry reviews repeat the growth/learning trajectory. No mastery extreme is claimed. |
| 17 | アリスと蔵六 | `problemSolving=1` | `UNKNOWN` | Escape and ability control establish action and constraints, but no repeated solving process; the recovery itself calls this low confidence. |
| 17 | アリスと蔵六 | `pacing=2` | `ACCEPT` | Multiple volume-1 reviewers describe a moderate structured opening and the official entry moves through escape, pursuit, household, and new-ability arcs. |
| 17 | アリスと蔵六 | `mysteryReveal=2` | `ACCEPT` | The research institute, pursuer, initially unclear world, and gradual explanation recur in official and independent bounded evidence. |
| 17 | アリスと蔵六 | `comedy=2` | `ACCEPT` | Official rightsholder commentary and independent volume-1 reviewers agree on recurring intermittent humor; neither supports constant comedy 4. |
| 17 | アリスと蔵六 | `darkness=2` | `ACCEPT` | Facility escape/pursuit and the harsh-cute contrast are direct entry observations, balanced by household warmth. |
| 17 | アリスと蔵六 | `emotionalWarmth=3` | `ACCEPT` | Official kindness/buddy framing and independent entry reviews repeat acceptance and pseudo-family gentleness; continuing danger justifies 3 rather than 4. |
| 18 | とろける鉄工所 | `progression=1` | `REJECT` | Reader learning, vocational history, and a daughter's future are not the protagonist's repeated growth/acquisition reward. |
| 18 | とろける鉄工所 | `problemSolving=2` | `ACCEPT` | Official 1–3 welding hazards/technical work and independent reviews repeatedly describe practical know-how applied to occupational problems. |
| 18 | とろける鉄工所 | `comedy=2` | `ACCEPT` | Rights-holder work-comedy descriptions and three independent sources repeat comic workplace episodes; hazards/family material keep it below 4. |
| 19 | 新しい上司はど天然 | `pacing=2` | `ACCEPT` | Separate volume-1 gag episodes are directly repeated by independent Cmoa and BookLive reviewers. |
| 19 | 新しい上司はど天然 | `worldBuilding=2` | `REJECT` | An office, colleagues, and work/private contexts are a `workplace` Theme, not functional world rules/history/culture. The proposal duplicates Theme evidence into an Axis. |
| 19 | 新しい上司はど天然 | `progression=1` | `REJECT` | Moving jobs and experiencing relief are setup/character adaptation, not a repeated growth/acquisition reward. |
| 19 | 新しい上司はど天然 | `mentalStress=1` | `ACCEPT` | The official opening and independent volume-1 reviews directly repeat prior harassment harm and residual worry followed by relief. Value 1 limits this to the entry setup/aftermath. |
| 20 | 環と周 | `pacing=2` | `ACCEPT` | The official complete-volume structure and independent complete-work reviews establish five linked, bounded story changes. The decision does not equate multiple eras with fast pacing. |

## Cell decisions — positions 21–30

| # | Work | Proposed cell | QA | Exact rationale |
|---:|---|---|---|---|
| 21 | アンデッドアンラック | `problemSolving=2` | `UNKNOWN` | Official 1–3 text establishes ability conditions and missions, but the two supporting reviews have unstated read range. No bounded recurring analysis/use sequence remains. |
| 21 | アンデッドアンラック | `comedy=2` | `UNKNOWN` | Comedy is supplied only by title-level reviews with unstated scope; the official entry descriptions do not establish its recurrence/intensity. |
| 21 | アンデッドアンラック | `emotionalWarmth=2` | `UNKNOWN` | A rescue goal and unbounded observations of mutual help do not establish warmth as a repeated entry reward. |
| 22 | 俺物語！！ | Theme `school:1` | `ACCEPT` | Official volumes 1–3 repeatedly place the high-school trio/couple in commute, friend, and outing situations. Centrality 1 correctly treats school as a stage. |
| 22 | 俺物語！！ | `comedy=2` | `ACCEPT` | Official entry copy identifies a romantic comedy and two distinct bounded review routes describe recurring expression/situation humor. |
| 22 | 俺物語！！ | `emotionalWarmth=2` | `ACCEPT` | Rescue, friendship, courtship, protection, and return-home events recur in official volumes 1–3. Value 2 is conservative and does not reopen existing romance/character cells. |
| 23 | お茶にごす。 | `characterArcWeight=2` | `REJECT` | Pass C already accepted `characterArcWeight=4`. Recovery cannot overwrite the accepted cell, even with a lower value. |
| 23 | お茶にごす。 | `worldBuilding=2` | `REJECT` | Tea procedures/tools are a practice/craft context, not history, culture, rules, or factions functioning as the story world's repeated setting system. |
| 23 | お茶にごす。 | `comedy=2` | `UNKNOWN` | Comedy Genre/retailer metadata and unbounded title reviews do not directly establish entry comedy intensity. Genre cannot fill an Axis. |
| 23 | お茶にごす。 | `emotionalWarmth=2` | `ACCEPT` | Official volumes 1–3 repeat the goal of learning kindness, time with club members, and relationship change; value 2 preserves conflict and rivalry. |
| 24 | 黒月のイェルクナハト | `progression=2` | `UNKNOWN` | Official volume 2 contains one weakness-recognition/training lead, but volumes 1–3 do not yet show a repeated growth/mastery reward. |
| 24 | 黒月のイェルクナハト | `worldBuilding=2` | `ACCEPT` | Nonhuman beings, disaster agents, the hostile company, and the cohabiting group recur as functional entry rules/forces across all three official volumes. |
| 24 | 黒月のイェルクナハト | `mentalStress=2` | `UNKNOWN` | Marriage-or-death coercion, combat, and kidnapping are danger/darkness leads; no source directly establishes sustained psychological pressure. |
| 24 | 黒月のイェルクナハト | `emotionalWarmth=2` | `UNKNOWN` | Rescue and shared bathing/laundry/meal routines establish action/cohabitation, not the emotional quality of warmth/healing. |
| 25 | ルックバック | `progression=2` | `UNKNOWN` | Manga creation and time passage make progression plausible, but the official short synopsis and two reviews do not directly establish repeated acquisition/mastery reward over the complete one-shot. |
| 25 | ルックバック | `pacing=2` | `UNKNOWN` | A one-shot and time passage do not by themselves establish ordinary goal/state-change frequency; no bounded sequence map is supplied. |
| 26 | 夢中さ、きみに。 | no proposed cell | `UNKNOWN` | The recovery correctly keeps Narrative/Tone unknown: school, humor, and friendship across eight shorts do not independently map four Narrative and four Tone cells. Existing sources mean this is not source-unavailable. |
| 27 | 異世界おじさん | `problemSolving=2` | `UNKNOWN` | Official volume 2 supplies one livelihood adaptation, while the magic-as-practical-solution observations come from title-level reviews with unstated range. Recurrence across entry remains unverified. |
| 28 | 思い、思われ、ふり、ふられ | Theme `school:1` | `ACCEPT` | All three official entry volumes directly repeat the same high-school/commute life sphere. Centrality 1 correctly treats it as relationship stage rather than institutional core. |
| 29 | 式の前日 | no proposed cell | `UNKNOWN` | The recovery correctly avoids merging unrelated biological-family, twin, and engagement shorts into `foundFamily` or a collection-wide Axis. Sources exist, so no source-unavailable blocker is reproducible. |
| 30 | さんすくみ | `problemSolving=2` | `UNKNOWN` | Three official summaries repeat ceremonies, job trouble, and accidents, but do not show the analytical/direct solving process; title-level reviews have unstated scope. |

## Result and gate effect

- Candidate cells reviewed: `82`.
- `ACCEPT`: `45`; `REJECT`: `13`; `UNKNOWN`: `24`.
- Accepted cells alone close the non-Art text gates for positions `14`, `17`, and `20`. This is not promotion: Art, identity/safety, recommendation context, overlay consistency, and final adjudication remain separate gates.
- Positions `1–13`, `15–16`, `18–19`, and `21–30` retain at least one non-Art coverage gap after this QA. No missing cell was filled merely to reach a gate.
- Position 10 is no longer a reproducible `SOURCE_INFORMATION_UNAVAILABLE` blocker: reliable press, jury, and multiple independent entry reviews exist. Its surviving evidence still does not close all Narrative/Tone coverage, so it remains an evidence-gap case rather than a blocker or promotion.
- Positions 8, 26, and 29 yielded no responsible new cell, but their official sources exist. They remain narrow research/adjudication gaps, not hard blockers.
