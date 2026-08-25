# Batch 004 text-gap recovery round 2 — positions 41, 43–50

- Research date: `2026-08-25`
- Reviewer: `luna-text-recovery-round-2`
- `reviewedByHuman=false`; this is a research packet, not a human approval.
- Scope: frozen Batch 004 positions 41–50, excluding position 42 (`モテキ`). Position 42's compound blocker is preserved in `reviews/daybreak-blocker-adjudication-position-42-final.md` and is not re-opened here.
- Work scope: entry experience only, first 1–3 volumes. No Art value is proposed. No user-review wording is copied to UI.
- This packet changes only this Markdown file. It does not modify canonical data, terminal text CSVs, promotion state, source rows, or generated artifacts.

## Method and route boundary

The exact unused official routes recorded by the independent blocker adjudication were opened or re-fetched on the research date. For each route I recorded the publisher, edition/ISBN, publication date, and the bounded observation exposed by the official product or series page. Shueisha reader endpoints were also checked: they resolve to the publisher's reader shell and its `content.ttx`/page-image payload, but the HTML response does not expose readable page text. Therefore a reader route is evidence that the edition and preview payload are available, not permission to invent scene-level text.

The numeric proposals below are deliberately narrow applications of the Factor Dictionary v1:

- `1` is used only as an intermediate value between the dictionary's 0/2 anchors.
- `2` means a repeated or ordinary arc/tone pattern in the bounded entry, not a central or extreme pattern.
- `0` is proposed only where the bounded official material explicitly presents an overwhelmingly light entry and no opposing entry signal was found.
- A missing cell remains `unknown` when the official synopsis does not establish the dictionary condition. The target coverage gate is not a reason to fill a cell.
- User reviews are supplemental only. Ratings, popularity, vague praise, and anime evidence were not used.

## Proposal summary

| position | workId | title | bounded proposal(s) | confidence | unresolved / disposition |
| ---: | --- | --- | --- | ---: | --- |
| 41 | `work-c7280f9dcc2754d3f864` | 鵺の陰陽師 | `strategy:1`; `comedy:1`; `emotionalWarmth:2` | 0.51–0.60 | `mysteryReveal`, `darkness`, `mentalStress`, `romance` remain unknown |
| 43 | `work-d8a87d01c1f35d58e791` | 八雲さんは餌づけがしたい。 | `darkness:0` (conservative candidate) | 0.55 | Do not infer `romance` from age/private meals; verify in Pass C |
| 44 | `work-e2f095e08fc5e08d5a2b` | 高嶺と花 | `strategy:1`; `mysteryReveal:2` | 0.55–0.60 | `progression` and `worldBuilding` remain unknown |
| 45 | `work-e81955a9fc5c4d84580f` | ここは今から倫理です。 | `progression:1`; `mysteryReveal:2` | 0.55–0.62 | Cases are not assumed solved; `strategy` and `worldBuilding` remain unknown |
| 46 | `work-eef84d07d90ba2b040cf` | さよなら絵梨 | `progression:2` | 0.68 | No new `problemSolving`, `strategy`, or `worldBuilding` value |
| 47 | `work-f8cb26831612e0c6ece5` | 極楽街 | `emotionalWarmth:2` | 0.65 | `problemSolving` remains unknown; rescue is not treated as a case-solving proof |
| 48 | `work-fc53cb5669aa4099ee4a` | アオハライド | `progression:2` | 0.62 | `problemSolving`, `strategy`, `worldBuilding` remain unknown |
| 49 | `work-fd2a957c501c36047ed0` | 青の祓魔師 | `comedy:2`; `emotionalWarmth:2` | 0.58–0.64 | `mentalStress` remains unknown; danger is not a stress score |
| 50 | `work-ff9b025f58d7e12f3cb1` | LOVE SO LIFE | `romance:2`; `comedy:1` (low-confidence candidate) | 0.52–0.58 | `darkness` and `mentalStress` remain unknown; child-care context is safety input only |

These are proposals for independent Pass C adjudication. They must not be copied into `adjudication/text-final-chunk-05.csv` without that review.

## 41. 鵺の陰陽師 — `work-c7280f9dcc2754d3f864`

### Direct routes checked

1. **集英社, official volume 1**, [鵺の陰陽師 1](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883687-4), published `2023-10-04`, retrieved `2026-08-25`. The entry gives 学郎's long-standing sight of 幻妖 and the request to exterminate them at school.
2. **集英社, official volume 2**, [鵺の陰陽師 2](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883788-8), published `2023-12-04`, retrieved `2026-08-25`. The entry has 代葉 approaching under a family order, 鵺 showing a power to get through a difficult situation, an unexpected post-conflict proposal, and an occult-club sea outing.
3. **集英社, official volume 3**, [鵺の陰陽師 3](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883820-5), published `2024-02-02`, retrieved `2026-08-25`. The entry has a defeated 代葉 living at school, her master appearing, 鵺's weapon being broken, and a response using an undisclosed countermeasure.
4. **集英社 reader shell**, [volume 1 reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088836874), edition bridge ISBN `9784088836874`, retrieved `2026-08-25`. The reader endpoint resolves, but its HTML contains only the reader shell; no additional readable scene text is treated as extracted evidence.

### Bounded proposals

- `strategy:1`, confidence `0.51`: the volume-2 difficult-situation response and volume-3 countermeasure are immediate tactical responses. They do not establish the dictionary's `2` anchor of recurring short plans, so the intermediate value is the ceiling of this packet.
- `comedy:1`, confidence `0.60`: the official volume-1 premise explicitly marks 鵺 as subculture-oriented, while volume 2 moves from conflict into a club sea outing. This supports a light recurring signal, not comedy as the core structure.
- `emotionalWarmth:2`, confidence `0.51`: the same club repeatedly shares school and leisure space and 代葉 is moved into school life after the duel. This is mixed group support, not a healing-core `4`; downgrade to `unknown` if the adjudicator requires page-level interaction evidence.
- `mysteryReveal`, `darkness`, `mentalStress`, and `romance` remain `unknown`. Hidden motives and supernatural danger in a short synopsis are not enough to score them.

## 43. 八雲さんは餌づけがしたい。 — `work-d8a87d01c1f35d58e791`

### Direct routes checked

1. **スクウェア・エニックス, official series page**, [八雲さんは餌づけがしたい。](https://magazine.jp.square-enix.com/yg/introduction/yakumo/), page retrieved `2026-08-25` (page-level publication date not exposed). It describes the widow's recurring evening meals for the neighboring first-year baseball player and explicitly frames the premise as a heartful story about happiness.
2. **スクウェア・エニックス, official volume 2**, [八雲さんは餌づけがしたい。 2](https://magazine.jp.square-enix.com/top/comics/detail/9784757551640/), published `2016-11-25`, ISBN `9784757551640`, retrieved `2026-08-25`. It describes a baseball-stadium outing and hungry teammates gathering around the bento; the page exposes a first-episode trial control.
3. **スクウェア・エニックス, official volume 3**, [八雲さんは餌づけがしたい。 3](https://magazine.jp.square-enix.com/top/comics/detail/9784757553347/), published `2017-04-25`, ISBN `9784757553347`, retrieved `2026-08-25`. It describes shared dinners, changing relationship dynamics, and a lightly amusing non-daily incident.
4. **マンガ大賞, official reader comment**, [2017 comment PDF](https://www.mangataisho.com/data/2017/comment2017.pdf), published `2017`, retrieved `2026-08-25`. The comment treats the hungry athlete and meals as affectionate, character-centered material; it is used only as a supplemental tone check, not as a rating or provenance shortcut.

### Bounded proposal

- `darkness:0`, confidence `0.55`, **candidate only**: the official series page repeatedly frames the bounded premise as heartful happiness, and the volume-2/3 descriptions contain meals, sport, and a light incident rather than a serious threat. The widow's history and the private-meal premise are not erased; if the page-level reader shows sustained tragedy or pressure, revert to `unknown`. No `romance` value is proposed: an age gap or private meals cannot establish romance.
- `mentalStress` remains `unknown`; “secret” and changing relations do not identify sustained psychological pressure.

## 44. 高嶺と花 — `work-e2f095e08fc5e08d5a2b`

### Direct routes checked

1. **白泉社, official volume 1**, [高嶺と花 1](https://www.hakusensha.co.jp/comicslist/46600/), published `2015-03-20`, ISBN `9784592213512`, retrieved `2026-08-25`. 花 attends a proxy marriage meeting, rejects 高嶺's rude conduct, and is repeatedly taken around after he says he likes her.
2. **白泉社, official volume 2**, [高嶺と花 2](https://www.hakusensha.co.jp/comicslist/46602/), published `2015-07-17`, ISBN `9784592213529`, retrieved `2026-08-25`. The marriage meeting continues; 花 must pass through a family-finance party while pretending to be her older sister, and an old friend approaches with an unstated purpose.
3. **白泉社, official volume 3**, [高嶺と花 3](https://www.hakusensha.co.jp/comicslist/46604/), published `2015-11-20`, ISBN `9784592213536`, retrieved `2026-08-25`. A poor test result leads to study effort and tutoring; illness care and a group resort event follow.

### Bounded proposals

- `strategy:1`, confidence `0.55`: the volume-2 identity concealment at a hostile party is a bounded deliberate plan. It is not evidence of recurring tactical planning at `2`.
- `mysteryReveal:2`, confidence `0.60`: the old friend's unstated purpose and the continuing identity concealment create a limited secret/revelation structure. This is not a clue-driven mystery at `4`.
- `progression` remains `unknown`: studying for one poor test result is not repeated growth or mastery. `worldBuilding` remains `unknown`; a finance-family setting is not a rules/forces system.

## 45. ここは今から倫理です。 — `work-e81955a9fc5c4d84580f`

### Direct routes checked

1. **集英社, official volume 1**, [ここは今から倫理です。 1](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-890791-8), published `2017-11-22`, ISBN `9784088907918`, retrieved `2026-08-25`.
2. **集英社, official volume 2**, [ここは今から倫理です。 2](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-891056-7), published `2018-06-19`, ISBN `9784088910567`, retrieved `2026-08-25`. The publisher repeatedly frames the teacher as facing students' inner burdens and thinking with them.
3. **集英社, official volume 3**, [ここは今から倫理です。 3](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-891261-5), published `2019-04-19`, ISBN `9784088912615`, retrieved `2026-08-25`. The teacher stays beside students seeking another answer about how to live.
4. **Bookworms, independent volume-1 review**, [review](https://bookworms.jp/book/4088907914), publication date not exposed, retrieved `2026-08-25`. It describes the bounded classroom case structure and the move from lessons to students' life questions; it is supplemental only.
5. **じぼうろく, independent volume-1 review**, [review](https://jibouroku.com/from-now-on-we-begin-ethics-1124), published `2018`, retrieved `2026-08-25`. It describes one student problem at a time and the teacher's use of ethical ideas to engage it; no rating is used.

### Bounded proposals

- `progression:1`, confidence `0.55`: the bounded entry repeatedly moves from a student's concealed or stated problem to a teacher's engagement and an attempt to find another way to live. The independent review also notes that cases are not necessarily completely solved; therefore this is limited case movement, not `2`/`4` mastery or guaranteed recovery.
- `mysteryReveal:2`, confidence `0.62`: each case withholds or gradually exposes a student's inner burden before the ethical conversation. This is a recurring limited revelation structure, not a clue-solving mystery.
- `strategy` and `worldBuilding` remain `unknown`; philosophical dialogue is not automatically tactical planning or a constructed rules system. Serious subject matter supports the existing Tone review but is not itself an adult-content decision.

## 46. さよなら絵梨 — `work-eef84d07d90ba2b040cf`

### Direct routes checked

1. **集英社, official complete one-shot product**, [さよなら絵梨](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-883167-1), published `2022-07-04`, ISBN `9784088831671`, retrieved `2026-08-25`. The publisher's complete-work synopsis gives the sequence: a dying mother's filming request, her death, Yuta's suicide attempt, meeting Eri, collaborative film-making, Eri's secret, and reality/creation crossing.
2. **少年ジャンプ＋, official volume route**, [さよなら絵梨](https://shonenjumpplus.com/volume/4856001361007486895), page retrieved `2026-08-25`. The route resolves to the complete volume and exposes an official trial control.
3. **集英社 reader shell**, [official reader](https://books.shueisha.co.jp/reader/main.php?cid=9784088831671), edition bridge ISBN `9784088831671`, retrieved `2026-08-25`. The reader payload exposes 17 preview pages, but the response is image-based and tile-scrambled; no unreadable page text is treated as a scene claim.
4. **コミックシーモア, customer review**, [one-shot review page](https://www.cmoa.jp/title/customer_review/title_id/246418/), review dated `2025-06-05`, retrieved `2026-08-25`. It provides one independent bounded observation of loss, film-making, and continuing after grief; it is corroboration only.

### Bounded proposal

- `progression:2`, confidence `0.68`: the complete synopsis gives a bounded movement from a suicide attempt after bereavement to a joint creative project and a changed understanding of reality/creation. This meets an ordinary arc of psychological/goal movement without claiming repeated mastery, so it is not `4`.
- No new `problemSolving`, `strategy`, or `worldBuilding` value is proposed. Film-making is already represented by the existing `crafting` Theme; production alone does not prove the Narrative axes. Existing `darkness`, `mentalStress`, `pacing`, and `mysteryReveal` values are not rewritten.

## 47. 極楽街 — `work-f8cb26831612e0c6ece5`

### Direct routes checked

1. **集英社, official digital volume 1**, [極楽街 1](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000024865900), published `2022-11-04`, edition ID `08X10000000024865900`, retrieved `2026-08-25`. Tao and Alma operate as problem solvers; a missing friend, disappearances, animal deaths, and inhuman attackers are the entry frame.
2. **集英社, official volume 2**, [極楽街 2](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883462-7), published `2023-04-04`, ISBN `9784088834627`, retrieved `2026-08-25`. A disappearance/death case continues and Alma's weakness is disclosed.
3. **集英社, official volume 3**, [極楽街 3](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883725-3), published `2023-12-04`, ISBN `9784088837253`, retrieved `2026-08-25`. Alma runs to save Kanata, attempts desperate persuasion while Kanata is out of control, and faces a further announcement of despair.
4. **Heart Ball, independent volume-1 review**, [review](https://heartball.net/2025/05/19/%E6%A5%B5%E6%A5%BD%E8%A1%97-%E7%AC%AC1%E5%B7%BB%EF%BD%9C%E6%84%9F%E6%83%B3%E3%83%BB%E8%A9%95%E4%BE%A1%E3%83%BB%E9%AD%85%E5%8A%9B%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC-%E5%AE%8C%E5%85%A8%E3%82%AC%E3%82%A4%E3%83%89/), published `2025-05-19`, retrieved `2026-08-25`. It is used only to corroborate the coexistence of a bright public district and a darker underside; it does not authorize a Narrative value.

### Bounded proposal

- `emotionalWarmth:2`, confidence `0.65`: the official volume-3 entry makes an existing friendship and an attempt to save the friend an explicit recurring emotional action. The dark threat and failure risk make this mixed warmth, not `4` healing. This does not change the already known `relationshipStructure`.
- `problemSolving` remains `unknown`. “Problem solver,” investigation, combat, and persuasion are not enough to prove analysis of constraints; this preserves Daybreak's earlier rejection of an automatic problem-solving value.
- No Art value is proposed. Corpses, man-eating, and darkness are safety/content observations, not visual-factor evidence.

## 48. アオハライド — `work-fc53cb5669aa4099ee4a`

### Direct routes checked

1. **集英社, official volume 1**, [アオハライド 1](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846647-7), published `2011-04-13`, ISBN `9784088466477`, retrieved `2026-08-25`. Futaba's first love reappears changed, while her earlier exclusion and self-concealment are part of the entry.
2. **集英社, official volume 2**, [アオハライド 2](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846690-3), published `2011-08-25`, ISBN `9784088466903`, retrieved `2026-08-25`. Futaba makes a deliberate effort to build new relationships and joins leadership training with Kou; the publisher exposes an official trial route.
3. **集英社, official volume 3**, [アオハライド 3](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846731-3), published `2011-12-22`, ISBN `9784088467313`, retrieved `2026-08-25`. Futaba recognizes her present feelings, learns of Yuri's feelings, and is shaken by the triangle.
4. **咲坂伊緒 independent volume-1 review**, [おしゃキミ](https://osha-kimi.com/manga/aoharide-1/), published `2014-07-07` (updated `2018-10-07`), retrieved `2026-08-25`. It is used only to corroborate the first-volume identity change and deliberate friendship/relationship step; no review rating is used.

### Bounded proposal

- `progression:2`, confidence `0.62`: the official volume-2 sequence explicitly makes Futaba build new relationships and participate in leadership training, followed by a changed emotional understanding in volume 3. This is gradual bounded development, not repeated mastery at `4`.
- `problemSolving`, `strategy`, and `worldBuilding` remain `unknown`; social effort and a school event are not automatically those axes. Existing `mysteryReveal` and relationship values are not rewritten.

## 49. 青の祓魔師 — `work-fd2a957c501c36047ed0`

### Direct routes checked

1. **集英社, official volume 1**, [青の祓魔師 1](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874709-5), published `2009-08-04`, ISBN `9784088747095`, retrieved `2026-08-25`.
2. **集英社, official volume 2**, [青の祓魔師 2](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874757-6), published `2009-11-04`, ISBN `9784088747576`, retrieved `2026-08-25`. Rin trains under Yukio, prepares for a candidate exam, and faces a demon attack during a strengthening camp.
3. **集英社, official volume 3**, [青の祓魔師 3](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-870016-8), published `2010-03-04`, ISBN `9784088700168`, retrieved `2026-08-25`. A spirit-search mission leads to Rin losing his sword and losing control of his flame.
4. **紀伊國屋 / 読書メーター excerpts**, [青の祓魔師 1 reviews](https://www.kinokuniya.co.jp/f/dsg-08-EK-0071727), review dates shown on page `2011-05-03` and `2011-08-04`, retrieved `2026-08-25`. One independent reader notes that the heavy opening is relieved by later laughter; this is a bounded comedy observation, not an overall score.
5. **コミックシーモア customer reviews**, [青の祓魔師 reviews](https://www.cmoa.jp/title/customer_review/title_id/54582/?page=3), review dates shown `2017-01-02` and `2017-01-03`, retrieved `2026-08-25`. Independent reviews identify a recurring balance of comic conversation and serious family-bond material; review text is paraphrased here and is not UI copy.

### Bounded proposals

- `comedy:2`, confidence `0.58`: two independent review surfaces describe comic interaction coexisting with serious entry material, and the official school/companion setup supplies the bounded recurring cast. This is intermediate balance, not comedy as the core.
- `emotionalWarmth:2`, confidence `0.64`: the official volume-1 family loss and sibling bond, plus the independent review observations of family ties and companion interaction, support mixed relational warmth. It is not `4` because the entry is also organized around danger, loss, and exorcist training.
- `mentalStress` remains `unknown`. Bereavement, demon danger, and uncontrolled power are content events, not enough to establish sustained psychological pressure in the dictionary.

## 50. LOVE SO LIFE — `work-ff9b025f58d7e12f3cb1`

### Direct routes checked

1. **白泉社, official volume 1**, [LOVE SO LIFE 1](https://www.hakusensha.co.jp/comicslist/44745/), published `2009-05-19`, ISBN `9784592187349`, retrieved `2026-08-25`. A 16-year-old aspiring childcare worker begins babysitting twins at an announcer's home.
2. **白泉社, official volume 2**, [LOVE SO LIFE 2](https://www.hakusensha.co.jp/comicslist/44747/), published `2009-09-18`, ISBN `9784592187356`, retrieved `2026-08-25`. Childcare remains busy but enjoyable; the uncle treats the institution-raised girl like family.
3. **白泉社, official volume 3**, [LOVE SO LIFE 3](https://www.hakusensha.co.jp/comicslist/44749/), published `2010-01-19`, ISBN `9784592187363`, retrieved `2026-08-25`. Childcare continues through a school-festival café; the family attending makes 詩春 happy but worried.
4. **コミックシーモア customer reviews**, [LOVE SO LIFE reviews](https://www.cmoa.jp/title/customer_review/title_id/70262/), review dates shown `2022-06-30`, `2024-01-30`, and `2025-08-08`, retrieved `2026-08-25`. Independent readers repeatedly describe family/romance material and concrete emotional reactions; only the bounded relationship observation is used.
5. **Sony Reader reviews**, [LOVE SO LIFE volume 1](https://ebookstore.sony.jp/review/title/10132778/id/LT000025962000394692/), review dates shown `2018-12-19` and `2024-10-19`, retrieved `2026-08-25`. Independent reviews describe the twins' daily care and a mild romance signal; no rating is used.
6. **楽天ブックス, official bookseller record**, [LOVE SO LIFE 1](https://books.rakuten.co.jp/rb/6056365/), review dates shown `2009-05-21` and `2009-05-22`, retrieved `2026-08-25`. The record identifies family growth and a small romance component; it is secondary corroboration only.

### Bounded proposals

- `romance:2`, confidence `0.58`: the official family setting is accompanied by independent Cmoa, Sony, and Rakuten observations of a gradual, secondary romantic line. `2` is the ceiling: romance is not the sole entry reward and one source explicitly treats it as only beginning.
- `comedy:1`, confidence `0.52`, low-confidence candidate: one independent review surface describes the entry as combining crying and laughter, while the official summaries repeatedly describe everyday child-care incidents. This is a weak intermittent signal; if the adjudicator requires two concrete comic scenes rather than reaction language, keep `unknown`.
- `darkness` and `mentalStress` remain `unknown`. Institutional upbringing, bereavement, and event worry are safety/context observations, not automatic darkness or stress values. No Art value is proposed.

## Final disposition and handoff

- Position 42 was not inspected beyond preserving its separately established compound blocker.
- No position 41 or 43–50 hard blocker is established by this packet. A residual unknown is not converted into `SOURCE_INFORMATION_UNAVAILABLE`.
- All proposals require independent Pass C review against the frozen terminal CSV. The reviewer may accept, downgrade, or revert any proposal to `unknown`.
- No `『` or `』` decorative title delimiters were introduced.
- The official reader routes are suitable for a later page-level text pass only if the permitted reader payload can be rendered and read; the current HTML/API response alone is insufficient for additional scene claims.
