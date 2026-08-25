# Batch 004 text-gap recovery — positions 41–50

- 조사일: 2026-08-25
- 대상: `batch-004/frozen-work-set.csv` positions 41–50
- 범위: 작품별 초반 1–3권. `さよなら絵梨`는 단권 작품이므로 단권 전체를 평가 범위로 사용한다.
- 기존 값: Daybreak Pass C가 확정한 known 값을 동결했다. 아래에는 해당 셀을 다시 쓰지 않고, 잔여 unknown에 대한 추가 제안 또는 terminal unknown만 기록한다.
- 제목: canonical title에는 장식용 quote mark를 포함하지 않았다.
- 판정 상태: `reviewedByHuman=false`. 이 파일은 연구 packet이며 CSV·promotion registry·promotion 상태를 변경하지 않는다.
- 사전: Narrative 순서 `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`; Tone 순서 `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`.
- 원칙: 공식 출판사 권별 소개와 정식 서점의 권별 내용 설명을 먼저 확인했다. 개인 리뷰는 공식 관찰만으로 남은 경계 셀을 교차 확인할 때만 사용했고, 평점·인기·추천 목록은 Factor 근거로 사용하지 않았다. 제목·장르·요약에 없는 사실로 known 0을 만들지 않았다.

## 결과 요약

| position | title                      | frozen residual                           | additional proposal                                                                                                       | disposition                                                                |
| -------: | -------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
|       41 | 鵺の陰陽師                 | Narrative +2, Tone +4                     | `progression:2`, `problemSolving:2`, `characterArcWeight:2`, `comedy:1`                                                   | 일부 회복; darkness, mentalStress, romance, emotionalWarmth는 unknown 유지 |
|       42 | モテキ                     | Genre +1, Theme +1, Narrative +4, Tone +5 | Genre `romance`; `pacing:2`; `characterArcWeight:2`, `relationshipStructure:2`, `comedy:2`, `mentalStress:2`, `romance:4` | source blocker 철회; Theme은 직접적인 Dictionary Theme 근거가 없어 unknown |
|       43 | 八雲さんは餌づけがしたい。 | Tone +2                                   | `relationshipStructure:2`, `comedy:2`                                                                                     | 공식 반복 구조로 회복; age-boundary는 safety 입력으로만 유지               |
|       44 | 高嶺と花                   | Narrative +3, Tone +1                     | `problemSolving:1`, `emotionalWarmth:2`                                                                                   | 보수적 일부 회복; 관계 진행을 progression으로 재분류하지 않음              |
|       45 | ここは今から倫理です。     | Narrative +4, Tone +2                     | `problemSolving:2`, `pacing:2`, `darkness:2`, `emotionalWarmth:2`                                                         | 공식 소개와 1–2권 독립 리뷰가 정합; 나머지 Narrative는 unknown             |
|       46 | さよなら絵梨               | Narrative +2, Tone +2                     | 추가 Narrative 없음; `mentalStress:3`, `emotionalWarmth:2`                                                                | one-shot 범위에서 Tone만 보강; Narrative unknown 유지                      |
|       47 | 極楽街                     | Narrative +1, Tone +2                     | `characterArcWeight:2`, `mentalStress:2`                                                                                  | Tone 보강; problemSolving은 Daybreak 반론대로 unknown 유지                 |
|       48 | アオハライド               | Narrative +3, Tone +1                     | `mysteryReveal:2`, `emotionalWarmth:2`                                                                                    | 명시적 identity secret와 관계 회복 관찰만 추가                             |
|       49 | 青の祓魔師                 | Narrative +1, Tone +2                     | `problemSolving:2`                                                                                                        | 훈련·임무의 직접 행동만 보강; mentalStress는 기존 unknown 유지             |
|       50 | LOVE SO LIFE               | Narrative +3, Tone +2                     | `problemSolving:2`                                                                                                        | 돌봄 상황에 대한 구체적 대응만 보강; Tone 추가값은 근거 부족으로 unknown   |

모든 제안은 자동 승인이 아니다. Pass C adjudicator는 각 제안을 채택·downgrade·unknown으로 되돌릴 수 있다. Art 4축은 이 packet에서 다루지 않는다.

## 41. 鵺の陰陽師 — `work-c7280f9dcc2754d3f864`

### Source ledger

1. **集英社 official volume 1**, [鵺の陰陽師 1](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883687-4), published 2023-10-04, retrieved 2026-08-25. Scope: volume 1. The publisher states that 学郎 has seen 幻妖 since childhood, meets 鵺 on the first day of high school, and is asked to exterminate the 幻妖 in the school. Independence: primary publisher source.
2. **集英社 official volume 2**, [鵺の陰陽師 2](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883788-8), published 2023-12-04, retrieved 2026-08-25. Scope: volume 2. 代葉 approaches 学郎 under a family order; 鵺 displays power to get through a difficult situation; the occult club then travels to the sea. Independence: distinct primary volume record.
3. **集英社 official volume 3**, [鵺の陰陽師 3](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883820-5), published 2024-02-02, retrieved 2026-08-25. Scope: volume 3. After losing a duel, 代葉 lives at the school; her master appears, breaks 鵺's weapon with a shikigami, and 鵺 responds with a countermeasure. Independence: distinct primary volume record.
4. **こもの読書感想**, [volume 1 reading review](https://www.kashiwa1969.online/comic-nueno-1-review/), published 2023-10-05, retrieved 2026-08-25. Scope: volume 1, explicitly identified by the article. The reader records the contract with 鵺, formation of the occult club, and solving a school 幻妖 problem. Independence: individual reading blog, independent from the publisher; supplemental only.
5. **E.M.D.2nd**, [volume 1 reading review](https://emd2nd.blog.jp/archives/51971540.html), published 2023-10-04, retrieved 2026-08-25. Scope: volume 1, explicitly identified by the article. The reader observes that the exorcism request starts 学郎's growth and describes the repeated contract/exorcism premise. Independence: separate individual reading blog and author from source 4; supplemental only.
6. **note reading review**, [volume 1 reading review](https://note.com/hayashibchou/n/n9d051c8f7503), published 2023-10-04, retrieved 2026-08-25. Scope: volume 1, explicitly states no spoilers beyond volume 1. The reader observes occult-club monster extermination and game/subculture gag moments. Independence: separate author/platform from sources 4–5; used only for the low comedy proposal.

### Gap decisions

- `progression:2` — **provisional accept, confidence 0.66**. The publisher gives an entry sequence from a long-standing ability, to the contract and extermination task, to later difficult encounters and 代葉's changed living arrangement. Sources 4 and 5 independently describe the contract/extermination as the trigger for 学郎's growth. This is intermediate growth, not repeated mastery at 4. Limitation: the official blurbs do not expose every training result; downgrade to unknown if the adjudicator requires more than the bounded entry summaries.
- `problemSolving:2` — **provisional accept, confidence 0.62**. The volume-1 reader in source 4 explicitly scopes school 幻妖 incidents as problems the occult club solves; volume 2 gives an organizational order and a difficult situation that must be gotten through, while volume 3 records a countermeasure after the weapon is broken. The evidence supports direct action plus limited situational response, not analytical puzzle solving at 4.
- `characterArcWeight:2` — **provisional accept, confidence 0.65**. The publisher's volume-3 defeat and school-life change for 代葉, together with source 5's observation of 学郎's growth, show character change alongside the exorcism events. Character change is not the sole reward, so 2 rather than 4.
- `comedy:1` — **provisional accept, confidence 0.51**. Source 6 records recurring game/subculture joke moments, while the official volume-1 premise identifies 鵺 as a subculture-loving character. This is a weak intermediate signal from the entry, not evidence for constant comedy at 4. If the two-source observation is considered too sparse, leave unknown.
- `darkness`, `mentalStress`, `romance`, and `emotionalWarmth` remain unknown. Combat, supernatural danger, or a friendly club cannot by themselves establish those Tone axes.

Limitation: the review sources are volume-1 scoped while official summaries cover volumes 1–3; no user-review claim is used to extend a value beyond its declared range. No Art value is proposed.

## 42. モテキ — `work-d63a83030a8819ff553c`

### Finite Japanese-title/author re-search

The prior `SOURCE_INFORMATION_UNAVAILABLE` candidate was tested with a bounded search on 2026-08-25 rather than an open-ended crawl. The exact queries were:

1. `モテキ 久保ミツロウ 講談社 1巻 2巻 3巻`
2. `モテキ 久保ミツロウ 1巻 レビュー`
3. `モテキ（1） 9784063522594`
4. `モテキ（2） 9784063522785` and `モテキ（3） 9784063522969`

The finite route yielded three official Kodansha volume records, a Rakuten Books volume-1 content record, a Comic Cmoa volume-1 page, and a BookLive volume-1 review page. Therefore the old source-availability blocker is **not reproducible** and must not be retained merely because the Kodansha pages themselves expose mostly table-of-contents metadata. The Theme gate remains unresolved; that is a data-coverage question, not `SOURCE_INFORMATION_UNAVAILABLE`.

### Source ledger

1. **講談社 official volume 1**, [モテキ 1](https://www.kodansha.co.jp/comic/products/0000038652), published 2009-03-23, retrieved 2026-08-25. Scope: volume 1. The page exposes the volume identity and contents, but its table of contents is not treated as a plot summary. Independence: primary publisher source.
2. **講談社 official volume 2**, [モテキ 2](https://www.kodansha.co.jp/comic/products/0000038671), published 2009-08-21, retrieved 2026-08-25. Scope: volume 2. The contents include repeated love/being-liked and romantic-frustration chapter contexts, but chapter titles alone are not converted into values. Independence: distinct primary volume record.
3. **講談社 official volume 3**, [モテキ 3](https://www.kodansha.co.jp/comic/products/0000038689), published 2010-01-22, retrieved 2026-08-25. Scope: volume 3. The contents continue relationship and self-identity contexts; again, the table of contents is identity/context support only, not standalone Factor evidence. Independence: distinct primary volume record.
4. **楽天ブックス official bookseller record**, [モテキ 1 content and reviews](https://books.rakuten.co.jp/rb/5996532/?l-id=review-txt-book), page publication date not exposed, retrieved 2026-08-25. Scope: volume 1. It identifies 29-year-old dispatch worker 藤本幸世, his first popularity period, and his struggle with several past female acquaintances and romantic opportunities. Independence: official bookseller record, separate from publisher.
5. **コミックシーモア customer review**, [モテキ volume 1 page](https://www.cmoa.jp/title/41230/), review dated 2020-08-19, retrieved 2026-08-25. Scope: volume-1 page. The reviewer concretely observes a previously unsuccessful man becoming flustered, failing to act, falling into self-loathing/self-destructive behavior, and recovering. Independence: individual Cmoa reviewer, independent from source 6.
6. **BookLive customer reviews**, [モテキ volume 1 review page](https://booklive.jp/review/list/title_id/39130/vol_no/001), reviews dated 2026-08-13 and 2025-09-23, retrieved 2026-08-25. Scope: volume 1 page. Independent reviewers describe romantic trouble and worry, a comic presentation that is not wholly dark, and the protagonist's repeated emotional agitation. Independence: separate platform and reviewers from source 5.

### Gap decisions

- Genre `romance` — **provisional accept, confidence 0.90**. The volume-1 bookseller synopsis explicitly describes multiple romantic opportunities and calls the work a painful/sad love comedy; two independent volume-1 review records also describe the romantic pursuit as the entry subject. This is a content-backed Genre proposal, not a copied retail tag.
- No Theme is proposed. Romance is a Genre and is not a Dictionary Theme. The dispatch-job fact is not enough to make `workplace` central; the chapter titles are not enough to add any Theme. Theme remains terminal unknown pending direct entry evidence.
- `pacing:2` — **provisional accept, confidence 0.63**. The volume-1 synopsis presents several past women reappearing and multiple romantic opportunities in the same entry; the independent reviews describe the protagonist being repeatedly pulled through romantic turns. This is ordinary Arc-level change, not rapid 4.
- `characterArcWeight:2` — **provisional accept, confidence 0.68**. The two independent reviews both focus on the protagonist's self-loathing, hesitation, and attempts to act; this is an entry character-response reward alongside relationship events, not character-only drama at 4.
- `relationshipStructure:2` — **provisional accept, confidence 0.66**. The volume-1 synopsis names several past female acquaintances plus the protagonist's friend/relationship context, and the independent reviews repeatedly describe the protagonist navigating more than one relationship. This is a recurring core cast, not complex multi-perspective ensemble at 4.
- `comedy:2` — **provisional accept, confidence 0.74**. The bookseller/BookLive synopsis calls the work a love comedy, and independent volume-1 reviewers describe the protagonist's romantic failures and agitation as comic while retaining emotional weight. This supports intermediate comedy, not an all-comedy 4.
- `mentalStress:2` — **provisional accept, confidence 0.72**. Cmoa directly records self-loathing and self-destructive responses; BookLive independently records persistent worry and emotional agitation in the volume-1 situation. The review pair also notes that the tone is not wholly dark, so 2 rather than 4.
- `romance:4` — **provisional accept, confidence 0.88**. The official volume-1 synopsis makes romantic opportunities and the protagonist's pursuit the entry engine; the independent volume-1 reviews describe the same relationship-centered struggle. This meets the Dictionary's major-relationship-and-development-center anchor.
- `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`, `darkness`, and `emotionalWarmth` remain unknown. In particular, self-improvement language in a review is not enough to assert repeated skill-growth `progression`, and romantic indecision is not `strategy`.

Limitation: the Kodansha records are table-of-contents-heavy and the bookseller synopsis is a short product description. User reviews are corroboration, not a substitute for full page review; no ratings or UI copy are imported. Since usable content evidence now exists, the work is not retained as a source-information blocker, although the unresolved Theme and remaining unknown axes still require adjudication.

## 43. 八雲さんは餌づけがしたい。 — `work-d8a87d01c1f35d58e791`

### Source ledger

1. **スクウェア・エニックス official volume 1**, [八雲さんは餌づけがしたい。 1](https://magazine.jp.square-enix.com/top/comics/detail/9784757551107/), published 2016-09-24, retrieved 2026-08-25. Scope: volume 1. The publisher describes the 28-year-old widow's nightly meal promise to the hungry 16-year-old baseball player, her lost motivation to cook, and her fuller daily life.
2. **スクウェア・エニックス official volume 2**, [八雲さんは餌づけがしたい。 2](https://magazine.jp.square-enix.com/top/comics/detail/9784757551640/), published 2016-11-25, retrieved 2026-08-25. Scope: volume 2. The publisher describes continued feeding, a baseball game, and hungry teammates gathering around her bento.
3. **スクウェア・エニックス official volume 3**, [八雲さんは餌づけがしたい。 3](https://magazine.jp.square-enix.com/top/comics/detail/9784757553347/), published 2017-04-25, retrieved 2026-08-25. Scope: volume 3. The publisher calls the recurring promise and shared dinners the two characters' time, and describes slightly changing relationship dynamics amid a somewhat amusing non-daily incident.

### Gap decisions

- `relationshipStructure:2` — **provisional accept, confidence 0.79**. Across all three official volume records, the same two-person dinner promise and recurring apartment/baseball circle organize the entry. This is a fixed pair with recurring supporting participants, not a complex ensemble at 4.
- `comedy:2` — **provisional accept, confidence 0.71**. Volume 1's exaggerated four-cup rice appetite and volume 2's hungry teammates create concrete humorous situations; volume 3 explicitly calls the non-daily incident somewhat amusing. This is intermediate comedy because the publisher simultaneously frames the work as heartful daily life.
- No romance value is added. The age difference and private meals are safety-review inputs, not permission to infer romance from a marketing label or relationship change.

Limitation: official records are short summaries and no internal-page reading was done here. No Art value is proposed; age-boundary information remains in the safety packet.

## 44. 高嶺と花 — `work-e2f095e08fc5e08d5a2b`

### Source ledger

1. **白泉社 official volume 1**, [高嶺と花 1](https://www.hakusensha.co.jp/comicslist/46600/), published 2015-03-20, retrieved 2026-08-25. Scope: volume 1. 花 attends a proxy marriage meeting as a high-school student, rejects 高嶺's rude manner, and is then repeatedly taken around after he says he likes her.
2. **白泉社 official volume 2**, [高嶺と花 2](https://www.hakusensha.co.jp/comicslist/46602/), published 2015-07-17, retrieved 2026-08-25. Scope: volume 2. The marriage meetings continue; 花 must survive a family-finance party while pretending to be her older sister, and an old friend approaches her with an unstated purpose.
3. **白泉社 official volume 3**, [高嶺と花 3](https://www.hakusensha.co.jp/comicslist/46604/), published 2015-11-20, retrieved 2026-08-25. Scope: volume 3. After a poor test result, 花 studies hard and 高嶺 intrudes as a home tutor; she nurses him when ill and a group resort event follows.

### Gap decisions

- `problemSolving:1` — **provisional accept, confidence 0.56**. The entry contains bounded practical obstacles: passing through a hostile family party while masking identity and responding to a poor test result with study/tutoring. These are direct actions under constraints, but not repeated analytical or ingenious solutions; 1 is deliberately below the dictionary's intermediate 2 anchor.
- `emotionalWarmth:2` — **provisional accept, confidence 0.61**. Across volumes 1–3, the official summaries show recurring contact, tutoring, nursing, and participation in shared events. The relationship remains a comic romance with conflict and asymmetry, so this is mixed warmth, not the core-healing 4 anchor.
- `progression` remains unknown. Relationship development and repeated meetings are not automatically growth/acquisition/mastery under the Dictionary. `strategy`, `mysteryReveal`, and `worldBuilding` also remain unknown.

Limitation: the official summaries do not establish the full frequency of the practical obstacles, so `problemSolving:1` needs adjudicator confirmation. Age and power asymmetry remain safety notes, not Factor values.

## 45. ここは今から倫理です。 — `work-e81955a9fc5c4d84580f`

### Source ledger

1. **集英社 official volume 1**, [ここは今から倫理です。 1](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-890791-8), published 2017-11-22, retrieved 2026-08-25. Scope: volume 1. 高柳, an ethics teacher, repeatedly faces the problems held by students with his own stance.
2. **集英社 official volume 2**, [ここは今から倫理です。 2](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-891056-7), published 2018-06-19, retrieved 2026-08-25. Scope: volume 2. The teacher seriously faces the students' inner residue and thinks together with them.
3. **集英社 official volume 3**, [ここは今から倫理です。 3](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-891261-5), published 2019-04-19, retrieved 2026-08-25. Scope: volume 3. 高柳 stays beside students and speaks to them while they seek salvation or another answer about how to live.
4. **ぽこ区 personal reading review**, [volumes 1–2 review](https://poco-ku.com/kokohaimakara/), published 2020-06-25, updated 2024-01-24, retrieved 2026-08-25. Scope: explicitly volumes 1–2. The reviewer records the ethics teacher's individual student cases and reads the work as a way of thinking that can address loneliness. Independence: individual blog, independent from source 5.
5. **小さなツナの缶詰。齧る。 personal reading review**, [volumes 1–2 review](https://tunabook03.hatenablog.com/entry/2018/08/03/200003), published 2018-08-03, retrieved 2026-08-25. Scope: explicitly volumes 1–2. The reviewer lists each student's problem, describes 高柳 facing them one by one, and records heavy cases involving loss, bullying, work, money, and despair. Independence: separate author/blog from source 4; used as secondary corroboration only.

### Gap decisions

- `problemSolving:2` — **provisional accept, confidence 0.78**. The official three-volume chain repeatedly presents student problems and a teacher who faces them and thinks with the students. Sources 4 and 5 independently describe the repeated case-by-case structure and the teacher's question-oriented intervention. This is mixed thought and direct dialogue, not ingenious constraint solving at 4.
- `pacing:2` — **provisional accept, confidence 0.64**. Official volumes 1–3 each retain the classroom/student-case frame while moving through different students' issues; source 5 explicitly describes one problem at a time across volumes 1–2. This supports ordinary case/arc change, not rapid location or objective changes at 4.
- `darkness:2` — **provisional accept, confidence 0.67**. The official descriptions use inner burdens, the question of how to live, and salvation; source 5 independently records loss, bullying, work failure, money, and despair in the bounded first two volumes. These are serious risks and emotional weight, but the work is not being assigned darkness 4 solely from sensitive-topic presence.
- `emotionalWarmth:2` — **provisional accept, confidence 0.73**. Volumes 2–3 explicitly describe the teacher facing students seriously, thinking with them, staying beside them, and speaking to them. Source 4 calls the work a possible support for loneliness, while source 5 records the teacher's warm guidance. This is mixed support rather than a uniformly healing tone.
- `progression`, `strategy`, `mysteryReveal`, and `worldBuilding` remain unknown. Teacher-student dialogue is not automatically long-range strategy or a world-building system.

Limitation: personal reviews summarize selected cases and do not replace a complete page audit. Sensitive-topic observations are safety inputs as well as Tone evidence; they are not adult-only classification.

## 46. さよなら絵梨 — `work-eef84d07d90ba2b040cf`

### Source ledger

1. **集英社 official one-shot product page**, [さよなら絵梨](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-883167-1), published 2022-07-04, retrieved 2026-08-25. Scope: complete one-shot. The publisher describes a sick mother's request to be filmed until death, her death, Yuta's suicide attempt, meeting Eri, collaborative filmmaking, Eri's secret, and reality/creation crossing.
2. **コミックシーモア customer review**, [one-shot review](https://www.cmoa.jp/title/customer_review/title_id/246418/), review dated 2025-06-05, retrieved 2026-08-25. Scope: complete one-shot. The reviewer observes film-making as a way to face or escape the mother's death and another heavy loss, followed by destruction, reconstruction, and continuing life. Independence: separate retail platform and reviewer from source 3.
3. **松村上久郎 personal reading analysis**, [reality/fiction trap analysis](https://the338.hatenablog.com/entry/2022/04/11/185823), published 2022-04-11, retrieved 2026-08-25. Scope: complete one-shot, explicitly spoiler-marked. The reader identifies deliberate traps before the ending and a repeated use of filmmaking/form as a narrative device. Independence: separate author/blog from source 2; supplemental, not copied into UI.

### Gap decisions

- No new Narrative value is proposed. The existing `pacing:3` and `mysteryReveal:2` are frozen; filmmaking is already represented by Theme `crafting:2`, and the official one-shot summary does not justify a separate `problemSolving`, `strategy`, or `worldBuilding` value.
- `mentalStress:3` — **provisional accept, confidence 0.85**. The official spine includes illness, death, a suicide attempt, grief, and a secret that destabilizes the collaboration; source 2 independently describes heavy loss and the need to face or escape it. This is sustained central pressure but not assigned 4 merely from the presence of a tragic event.
- `emotionalWarmth:2` — **provisional accept, confidence 0.57**. The official source records Yuta and Eri making a film together after his crisis; source 2 describes the creative relationship as a possible way to continue living. The collaboration is also unstable and coercive readings are possible, so the value is mixed and low confidence.
- `darkness` remains the frozen 3. `romance` remains unknown; a romance-like atmosphere in an analysis is not enough to mark the axis.

Limitation: this is a one-shot exception, not a three-volume chain. No Art value is proposed, and no visual intensity is inferred from the suicide/death synopsis.

## 47. 極楽街 — `work-f8cb26831612e0c6ece5`

### Source ledger

1. **集英社 official volume 1**, [極楽街 1](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000024865900), published 2022-11-04, retrieved 2026-08-25. Scope: volume 1. Tao and Alma work as problem solvers; a missing beast-person friend, serial disappearances, animal corpses, and man-eating nonhumans are named.
2. **集英社 official volume 2**, [極楽街 2](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883462-7), published 2023-04-04, retrieved 2026-08-25. Scope: volume 2. Alma and Tao pursue serial hanging-death cases; Alma undertakes a mission with Nei and his weakness is disclosed.
3. **集英社 official volume 3**, [極楽街 3](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883725-3), published 2023-12-04, retrieved 2026-08-25. Scope: volume 3. Alma tries to rescue his friend Kanata, who is pursued as a man-eating monster; Kanata rampages and Alma attempts a desperate persuasion, followed by further despair.

### Gap decisions

- `characterArcWeight:2` — **provisional accept, confidence 0.76**. Volume 2 explicitly makes Alma's weakness a case revelation, and volume 3 centers his choice to save a friend despite the threat. Character vulnerability and decision are recurring alongside the case/combat structure; 2 is the balanced middle value, not character-only 4.
- `mentalStress:2` — **provisional accept, confidence 0.78**. The official volume-3 text directly states struggle, desperation, and a desperate attempt to persuade a rampaging friend; volume 2 adds the protagonist's revealed weakness. This is mixed sustained pressure in the entry, not a claim about visual gore.
- No Narrative addition is proposed. The existing `pacing`, `mysteryReveal`, and `worldBuilding` remain frozen. Daybreak's decision to return `problemSolving` to unknown is respected: problem-solver job titles, investigation, and combat do not by themselves prove repeated analytical solving.

Limitation: official summaries do not expose the exact number of cases or pages, so the values are conservative. Violence, corpses, and man-eating remain safety/content signals, not Art judgments.

## 48. アオハライド — `work-fc53cb5669aa4099ee4a`

### Source ledger

1. **集英社 official volume 1**, [アオハライド 1](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846647-7), published 2011-04-13, retrieved 2026-08-25. Scope: volume 1. Futaba's remembered first love appears in a changed form, while her middle-school exclusion and self-concealment are stated; the boy's identity is deliberately withheld in the synopsis.
2. **集英社 official volume 2**, [アオハライド 2](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846690-3), published 2011-08-25, retrieved 2026-08-25. Scope: volume 2. Futaba tries to build new relationships in a new class and joins leadership training with Kou.
3. **集英社 official volume 3**, [アオハライド 3](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846731-3), published 2011-12-22, retrieved 2026-08-25. Scope: volume 3. Futaba realizes she likes the present Kou, learns that friend Yuri also likes him, and is emotionally shaken by the triangle.

### Gap decisions

- `mysteryReveal:2` — **provisional accept, confidence 0.63**. Volume 1 explicitly withholds the identity/changed state of the first-love counterpart, and volume 3 discloses the current emotional situation through the triangle. This is a limited secret/revelation reward, not a clue-solving mystery at 4.
- `emotionalWarmth:2` — **provisional accept, confidence 0.58**. Volume 2 records deliberate effort to build new relationships and a kind-but-distant Kou; volume 3 retains close friendship and emotionally direct recognition. This is mixed warmth within romance/conflict, not a healing-core 4.
- `progression` remains unknown. The relationship's emotional development is not automatically growth/acquisition/mastery under the Dictionary. `problemSolving`, `strategy`, and `worldBuilding` remain unknown.

Limitation: official summaries describe relationship states but not all scenes or conflict frequency. Bullying/isolation remains a safety-context note, not an adult-only classification.

## 49. 青の祓魔師 — `work-fd2a957c501c36047ed0`

### Source ledger

1. **集英社 official volume 1**, [青の祓魔師 1](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874709-5), published 2009-08-04, retrieved 2026-08-25. Scope: volume 1. Rin learns his demonic lineage, loses his adoptive father while being protected, and decides to become an exorcist and fight the demon king.
2. **集英社 official volume 2**, [青の祓魔師 2](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874757-6), published 2009-11-04, retrieved 2026-08-25. Scope: volume 2. Under Yukio's guidance, Rin trains at the exorcist school and enters a strengthening camp where a demon attacks the trainees.
3. **集英社 official volume 3**, [青の祓魔師 3](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-870016-8), published 2010-03-04, retrieved 2026-08-25. Scope: volume 3. The promoted candidates conduct a spirit search at an amusement park; Rin's sword is taken and his flame becomes uncontrollable.

### Gap decisions

- `problemSolving:2` — **provisional accept, confidence 0.60**. The entry repeatedly combines training under constraints, a qualification/camp threat, a spirit-search mission, and responding to a lost weapon and uncontrolled flame. This is direct action with limited tactical response, not analytical or strategic problem solving at 4.
- `mentalStress` remains unknown, as Daybreak specifically rejected sustained-pressure inference from death and demon danger. `comedy`, `emotionalWarmth`, and `romance` also remain unknown; sibling guidance and team context do not by themselves establish warmth or comedy.

Limitation: official synopses establish mission structure but not the full scene-by-scene solving process. No Art or visual violence value is inferred.

## 50. LOVE SO LIFE — `work-ff9b025f58d7e12f3cb1`

### Source ledger

1. **白泉社 official volume 1**, [LOVE SO LIFE 1](https://www.hakusensha.co.jp/comicslist/44745/), published 2009-05-19, retrieved 2026-08-25. Scope: volume 1. A 16-year-old aspiring childcare worker begins babysitting twins at an announcer's home.
2. **白泉社 official volume 2**, [LOVE SO LIFE 2](https://www.hakusensha.co.jp/comicslist/44747/), published 2009-09-18, retrieved 2026-08-25. Scope: volume 2. The babysitting remains busy but enjoyable; the uncle treats the institution-raised girl like family and his home becomes important to her.
3. **白泉社 official volume 3**, [LOVE SO LIFE 3](https://www.hakusensha.co.jp/comicslist/44749/), published 2010-01-19, retrieved 2026-08-25. Scope: volume 3. Childcare continues through school-festival café preparation and family attendance; the publisher states that 詩春 is happy but also worried about the event.
4. **コミックシーモア customer review**, [volume 2 page and review](https://www.cmoa.jp/title/70262/vol/2/), review dated 2024-06-23, retrieved 2026-08-25. Scope: volume-2 page. The reviewer repeatedly describes adapting words, attitude, and conduct to the children's feelings and understanding, and thinking about what action is possible. Independence: individual Cmoa reviewer.
5. **Sony Reader customer reviews**, [volume 2 review page](https://ebookstore.sony.jp/review/title/10132778/id/LT000025962000394693/), reviews dated 2009-10-21, 2012-03-26, 2018-03-05, and 2024-09-22, retrieved 2026-08-25. Scope: volume 2. Independent reviewers record concrete care situations such as a burn, a rain-cancelled plan, school/workload, and everyday events, while noting the caregiver's responses and the relationship's steady daily rhythm. Independence: separate platform and reviewers from source 4.

### Gap decisions

- `problemSolving:2` — **provisional accept, confidence 0.58**. The official entry establishes recurring childcare and school-event obligations; source 4 independently describes adapting language and behavior to children's feelings, while source 5 records concrete care incidents and changed plans. This supports practical response under everyday constraints, not ingenious or analytical solving at 4.
- `progression`, `strategy`, `mysteryReveal`, and `worldBuilding` remain unknown. Repeated childcare is not automatically growth, long-range planning, mystery, or world-building.
- Tone residual remains unresolved. The official and review sources support the already frozen `emotionalWarmth:4`; the additional observations do not safely establish a separate comedy, darkness, mentalStress, or romance value. The minor-care context remains a safety note.

Limitation: source 4's reviewer discusses the series through a volume-2 page, so it is used only as corroboration for concrete care behavior also present in the official volume-1–3 summaries. No review rating or user prose is copied to UI. No Art value is proposed.

## Handoff and change boundary

- Files changed: this research markdown only.
- CSV, source data, annotation Pass A, promotion registry, generated catalog, blocker records, and Art records: unchanged.
- All proposals retain `reviewedByHuman=false` and require independent Pass C adjudication.
- Position 42's old `SOURCE_INFORMATION_UNAVAILABLE` candidate is not retained after the finite Japanese-title/author search; unresolved Theme and residual unknowns are recorded separately.
- No canonical title in this packet contains decorative quote marks.
