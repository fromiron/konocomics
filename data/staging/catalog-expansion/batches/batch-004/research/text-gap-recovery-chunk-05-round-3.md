# Batch 004 text-gap recovery — chunk 05, round 3

- 대상: frozen positions `41`, `43–50`; position `42` (`モテキ`)는 별도 compound blocker를 보존하며 조사하지 않음
- 조사일 및 모든 `retrievedAt`: `2026-08-25`
- reviewer: `luna-text-recovery-round-3`
- `reviewedByHuman`: `false`; 이 문서는 연구 packet이며 독립 승인이나 terminal write가 아님
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`
- source packet `candidateSha256`: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`
- round-2 QA SHA-256: `aa2db6798276fdd5c1b34510af5d64410f1e2004acc886a7fd05c8524e6ab3b7`
- round-2 recovery packet SHA-256: `f1b70198720ca80860f096fdd5f64071621b47123b57a63942503cbac725403c`
- terminal text CSV SHA-256 at read: `51370578f18dfc7c0ff7d8cceccbd9672ba0c7f011baf2b2753e09ca1dabefec`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`

This packet is research-only. It modifies no terminal CSV, source row, Art packet, safety record,
promotion overlay, registry, or generated artifact. Temporary reader screenshots used during
inspection remain outside the repository and are not evidence artifacts to commit. Canonical titles
are written without decorative `『` or `』` delimiters.

## Round-3 method and decision boundary

Round 2 left exact unused routes for positions `41`, `45–50`. This pass followed those routes in
the specified order: publisher/product identity and edition controls first, then the licensed reader
where it returned readable body pages, then at least two independent reviews for every new numeric
candidate. Review observations are bounded to the first 1–3 volumes (or the complete one-shot),
paraphrased, and used only as secondary Factor evidence. Ratings, popularity, recommendation-list
membership, anime material, cover art, and vague adjectives were not used.

The direct reader pages below are new evidence relative to round 2. The resulting values are
**candidates for Pass C**, not values to copy to `adjudication/text-final-chunk-05.csv`. The existing
0/2/4 Dictionary anchors are preserved; `1` is used only when the new material supports an
intermittent signal below the 2 anchor. A candidate must be reverted to `unknown` if adjudication
finds that a scene is isolated, that a review is not independent, or that the Dictionary condition
is not met.

Art was not re-evaluated. Page images were used only for readable dialogue/event text. No Art value
is proposed and the six-page/two-context Art gate is unaffected.

## Round-3 disposition summary

| position | workId | canonicalTitle | round-3 candidate(s) | disposition |
|---:|---|---|---|---|
| 41 | `work-c7280f9dcc2754d3f864` | 鵺の陰陽師 | `comedy=1` | New full-reader body pages plus two independent volume-1 reviews justify reopening the previously rejected low candidate; `strategy`, `emotionalWarmth`, `mysteryReveal`, `darkness`, `mentalStress`, and `romance` remain unresolved. |
| 42 | `work-d63a83030a8819ff553c` | モテキ | none | Untouched. Preserve `reviews/daybreak-blocker-adjudication-position-42-final.md` and the compound blocker. |
| 43 | `work-d8a87d01c1f35d58e791` | 八雲さんは餌づけがしたい。 | none | Round-2 `darkness=0` candidate already passed the text gate; no no-op reopening. |
| 44 | `work-e2f095e08fc5e08d5a2b` | 高嶺と花 | none | Round-2 candidates already passed the text gate; no no-op reopening. |
| 45 | `work-e81955a9fc5c4d84580f` | ここは今から倫理です。 | `mysteryReveal=2` | New full-reader pages show multiple student-burden disclosures in the classroom; three independent volume-1/2 reviews corroborate bounded case disclosure. Keep conservative because the structure is ethical case discussion, not a clue-solving mystery. |
| 46 | `work-eef84d07d90ba2b040cf` | さよなら絵梨 | none | Exact exhaustion for new cells. The official route exposes only an image preview in this environment; two independent complete-work reviews do not create a new safe Dictionary cell beyond the existing values. |
| 47 | `work-f8cb26831612e0c6ece5` | 極楽街 | `problemSolving=2` | New official reader pages expose fact checking, a client-payment contradiction, and case-information gathering; two independent volume-1 reviews corroborate concrete case progression. This is not the rejected title/synopsis-only “problem solver” inference. |
| 48 | `work-fc53cb5669aa4099ee4a` | アオハライド | `mysteryReveal=2` | New full-reader pages show the changed-identity/repressed-history disclosure sequence; two independent volume-1/2 reviews corroborate bounded withheld-history and relationship revelation. `4` is not supported. |
| 49 | `work-fd2a957c501c36047ed0` | 青の祓魔師 | `comedy=2` | New full-reader pages show recurring school/mentor banter across several separated page ranges; two independent review surfaces corroborate comic relief alongside serious material. This reopens the previously rejected value only because body-page evidence is new. |
| 50 | `work-ff9b025f58d7e12f3cb1` | LOVE SO LIFE | none | Exact exhaustion for new cells. Hakusensha trial route reached the reader shell but remained on the cover after provider resource failures; independent reviews do not justify converting care/romance context into a new Axis. |

## Direct official route ledger

### 41 — 鵺の陰陽師

- **集英社, volume 1 product**, published `2023-10-04`: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883687-4
- **集英社, volume 2 product**, published `2023-12-04`: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883788-8
- **集英社, volume 3 product**, published `2024-02-02`: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883820-5
- **集英社 licensed reader, volume 1**, edition bridge ISBN `9784088836874`: https://www.shueisha.co.jp/books/reader/main.php?cid=9784088836874

The rendered reader body pages `8–13` (printed page labels `9–13` in the captured body) show several
separate school-social exchanges rather than only the round-2 product synopsis: a classmate
recognizes 膳野, a 60-yen bread request creates a group exchange, the group reacts to the protagonist's
awkwardness, and the next hallway/classroom sequence continues the teasing and response pattern.
The later reader pages `14–20` shift to the visible 幻妖 threat and fear/reaction; those pages are
not converted to `darkness` or `mentalStress` because danger alone is not either Dictionary anchor.

**Independent bounded reviews used:**

1. `寿司いくら`, [鵺の陰陽師 1巻掲載時感想](https://note.com/kotoduka_ikura/n/ndb1f7725f417), publication date not exposed on the retrieved page, volume-1 collected chapters, retrieved `2026-08-25`. It describes the work's distinctive gag rhythm in the same opening volume and specific character interactions, not a rating.
2. `感想ルーム`, [鵺の陰陽師 1巻感想](https://kansou14.com/?p=8971), publication date not exposed on the retrieved page, volume 1, retrieved `2026-08-25`. It identifies the classmate exchange around 膳野 and the resulting laugh as a concrete early-volume reaction.

**Candidate:** `comedy=1`, confidence `0.60`. The official body provides repeated social banter across
multiple consecutive page groups, while two independent volume-1 reviews describe the same opening
material as having a distinct/comic interaction pattern. This is deliberately below `2`: the inspected
range also contains a serious supernatural threat and does not establish comedy as the dominant reward.
Round-2 `strategy=1`, `comedy=1`, and `emotionalWarmth=2` were not silently copied; only `comedy=1` is
reopened because the direct body-page evidence is materially new. The remaining unknowns stay unknown.

### 45 — ここは今から倫理です。

- **集英社, volume 1 product**, published `2017-11-22`: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-890791-8
- **集英社, volume 2 product**, published `2018-06-19`: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-891056-7
- **集英社, volume 3 product**, published `2019-04-19`: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-891261-5
- **集英社 licensed reader, volume 1**, edition bridge ISBN `9784088907918`: https://www.shueisha.co.jp/books/reader/main.php?cid=9784088907918

The new reader body sample covers image indices `4–20`. It contains more than the art sample
previously available: class participants are introduced separately, a student is brought into the
class, and the teacher/student exchange ends with explicit questions about living, human relations,
and a student's wish to die. The sequence is an exposure of an inner burden followed by ethical
framing, not a claim that every case is solved. The volume-2 and volume-3 official descriptions
continue to describe the teacher facing students' inner burdens and seeking another answer, which
keeps the observation within the first three volumes.

**Independent bounded reviews used:**

1. `Bookworms`, [volume-1 review](https://bookworms.jp/book/4088907914), publication date not exposed, volume 1, retrieved `2026-08-25`. It describes the classroom as a sequence of students' life problems rather than a generic subject lesson.
2. `じぼうろく`, [volume-1 review](https://jibouroku.com/from-now-on-we-begin-ethics-1124), published `2018`, volume 1, retrieved `2026-08-25`. It describes one student problem at a time and the teacher's ethical engagement with each.
3. `心理学生が読む漫画レビュー`, [review](https://magazin-review.net/now-ethics), publication date not exposed, volumes 1–2 discussion, retrieved `2026-08-25`. It explicitly notes that a student case can remain unresolved rather than being mechanically closed; this prevents over-scoring.

**Candidate:** `mysteryReveal=2`, confidence `0.57`. The bounded reward is the gradual articulation
of a student's previously unspoken or incompletely stated burden, repeatedly followed by a teacher-led
conversation. This is the Dictionary's limited secret/revelation level only if Pass C accepts an inner
problem as a reveal. It must remain `unknown` if the reviewer reserves `mysteryReveal` for external
clues/deduction. Round-2 `progression=1` is not resubmitted; the new packet makes no claim that
students acquire a stable skill or that cases resolve.

### 46 — さよなら絵梨: exact exhaustion for new cells

- **集英社 complete one-shot product**, published `2022-07-04`: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-883167-1
- **少年ジャンプ＋ official volume route**, retrieved `2026-08-25`: https://shonenjumpplus.com/volume/4856001361007486895
- **集英社 licensed reader**, edition bridge ISBN `9784088831671`: https://books.shueisha.co.jp/reader/main.php?cid=9784088831671

The Jump+ and Shueisha routes were reached. The reader response in this environment exposed an
image-based, tile-scrambled preview (17 preview pages) rather than a readable full story transcript.
The product synopsis already supplies the bounded loss/filming/reality sequence used by the existing
`pacing`, `mysteryReveal`, `characterArcWeight`, and Tone values; it does not safely establish a new
Axis. Two independent complete-work reviews were checked only as an exhaustion cross-check:

1. `松村上久郎`, [ラスト前の構成考察](https://the338.hatenablog.com/entry/2022/04/11/185823), published `2022-04-11`, complete one-shot, retrieved `2026-08-25`. It discusses the final structural trap and film-like construction, not a new Narrative cell.
2. `本やらなんやらの感想置き場`, [さよなら絵梨感想と考察](https://spaceplace.hatenablog.jp/entry/goodbye-eri), publication date not exposed, complete one-shot, retrieved `2026-08-25`. It independently describes the film/reality turn and grief release, which corroborates existing bounded values but does not support a new `problemSolving`, `strategy`, or `worldBuilding` value.

Round-2 `progression=2` is not resubmitted. The route is not declared a hard blocker for the work;
this is only text-gap exhaustion in this packet. Existing values and unknowns remain unchanged.

### 47 — 極楽街

- **集英社, digital volume 1 product**, published `2022-11-04`: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000024865900
- **集英社, volume 2 product**, published `2023-04-04`: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883462-7
- **集英社, volume 3 product**, published `2023-12-04`: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883725-3
- **集英社 licensed reader, volume 1**, edition bridge ID `08X10000000024865900`: https://www.shueisha.co.jp/books/reader/main.php?cid=08X10000000024865900

The new reader body pages `14`, `16`, `18`, and `20` expose a concrete chain beyond the job title
“解決屋”: (a) a client is challenged about a suspicious payment and the office checks the claim,
(b) the team receives local information about missing people and abnormal deaths, (c) the newspaper
material is examined in the office/restaurant conversation, and (d) the pair discuss the case and the
next action. The pages show information/constraint handling mixed with direct response; they do not
support `strategy=4` or a claim that every case is fully solved.

**Independent bounded reviews used:**

1. `photomedliban`, [極楽街 1巻感想](https://photomedliban.com/12363.html), published `2024-06-03`, volume 1 (chapters 1–3), retrieved `2026-08-25`. It independently describes the false-money check, the missing-person notice, and the distinction between the paid front job and the underlying threat.
2. `Heart Ball`, [極楽街 第1巻レビュー](https://heartball.net/2025/05/19/%E6%A5%B5%E6%A5%BD%E8%A1%97-%E7%AC%AC1%E5%B7%BB%EF%BD%9C%E6%84%9F%E6%83%B3%E3%83%BB%E8%A9%95%E4%BE%A1%E3%83%BB%E9%AD%85%E5%8A%9B%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC-%E5%AE%8C%E5%85%A8%E3%82%AC/), published `2025-05-19`, volume 1, retrieved `2026-08-25`. It independently describes the public problem-solving office, the missing friend, and the investigation/action transition.

**Candidate:** `problemSolving=2`, confidence `0.56`. This is a materially new proposal, not the
round-2 inference from the word “problem solver”: the official body now supplies a bounded
fact-check/information-gathering/action sequence, and two independent volume-1 reviews describe the
same concrete cases. The value is capped at `2`; no long-term plan, resource operation, or ingenious
multi-step solution is established. `emotionalWarmth=2` from round 2 is not reopened here.

### 48 — アオハライド

- **集英社, volume 1 product**, published `2011-04-13`: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846647-7
- **集英社, volume 2 product**, published `2011-08-25`: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846690-3
- **集英社, volume 3 product**, published `2011-12-22`: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846731-3
- **集英社 licensed reader, volume 1**, edition bridge ISBN `9784088466477`: https://www.shueisha.co.jp/books/reader/main.php?cid=9784088466477

The new reader body pages `4–20` show the first-volume reunion and its withheld-history pattern:
the former first love appears under a changed name/attitude, avoids the earlier identity, and the
two protagonists move through recognition, denial, and partial emotional disclosure. The official
volume-2 synopsis adds Futaba's deliberate relationship-building and leadership training; volume 3
adds the next emotional disclosure and triangle tension. These official facts are bounded to the
first three volumes and are not a progression rewrite.

**Independent bounded reviews used:**

1. `おしゃキミ`, [アオハライド 1巻感想](https://osha-kimi.com/manga/aoharide-1/), published `2014-07-07` (updated `2018-10-07`), volume 1, retrieved `2026-08-25`. It describes the first-love reunion and the deliberate step toward an honest relationship.
2. `ラブコメが好き過ぎて生きるのがツラい`, [アオハライド 2巻](https://blog.goo.ne.jp/chiha_002/e/f150bfa1d3a117a3f7c39a56cc7a7b3e), published `2011-12-27`, volume 2, retrieved `2026-08-25`. It describes the changed surroundings, Futaba's decision to change, and the unspoken relational movement around Kou.
3. `良キ漫画求ム！`, [アオハライド 1巻](https://yokimangamotomu.blog24.fc2.com/blog-entry-556.html), publication date not exposed, volume 1, retrieved `2026-08-25`. It independently describes the changed identity and the protagonists' direct emotional confrontation.

**Candidate:** `mysteryReveal=2`, confidence `0.59`. A changed identity and withheld family/emotional
history are limited secrets that become progressively articulated across volumes 1–3. This is not a
clue-driven mystery and does not justify `4`; the adjudicator should retain `unknown` if it treats
romance-drama disclosure as relationship content only. Round-2 `progression=2` is not resubmitted.

### 49 — 青の祓魔師

- **集英社, volume 1 product**, published `2009-08-04`: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874709-5
- **集英社, volume 2 product**, published `2009-11-04`: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874757-6
- **集英社, volume 3 product**, published `2010-03-04`: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-870016-8
- **集英社 licensed reader, volume 1**, edition bridge ISBN `9784088747095`: https://www.shueisha.co.jp/books/reader/main.php?cid=9784088747095

The new official reader body pages are separated across `8–12`, `14–16`, and `18–20`. They show
more than the prior product synopsis: the dorm/school return and mentor interaction, a meal-table
exchange, the sibling/teacher dialogue, and repeated exaggerated reactions in the classroom/mentor
group. The serious opening, exorcist identity, and danger remain visible in the surrounding pages;
the proposal is therefore an intermediate balance, not a comedy-core reading.

**Independent bounded reviews used:**

1. `紀伊國屋書店 / 読書メーター excerpts`, [青の祓魔師 1 reviews](https://www.kinokuniya.co.jp/f/dsg-08-EK-0071727), review dates shown `2011-05-03` and `2011-08-04`, volume 1, retrieved `2026-08-25`. The independent excerpts describe the heavy opening being relieved by later laughter and character exchanges.
2. `コミックシーモア`, [青の祓魔師 customer reviews](https://www.cmoa.jp/title/customer_review/title_id/54582/?page=3), review dates shown `2017-01-02` and `2017-01-03`, volume 1 context, retrieved `2026-08-25`. Independent readers describe comic conversation coexisting with serious family-bond material; popularity and ratings were ignored.

**Candidate:** `comedy=2`, confidence `0.61`. Multiple official body-page groups show comic
reaction/banter, and the two review surfaces independently corroborate comic relief in the same
entry range. This reopens the round-2 rejected `comedy=2` only because readable body pages are new;
it is not a genre-to-Axis conversion. No `mentalStress` value is added: bereavement, demon danger,
and uncontrolled power are content events, not sufficient evidence of sustained psychological
pressure. `emotionalWarmth=2` from round 2 is not rewritten.

### 50 — LOVE SO LIFE: exact exhaustion for new cells

- **白泉社, volume 1 product**, published `2009-05-19`: https://www.hakusensha.co.jp/comicslist/44745/
- **白泉社, volume 2 product**, published `2009-09-18`: https://www.hakusensha.co.jp/comicslist/44747/
- **白泉社, volume 3 product**, published `2010-01-19`: https://www.hakusensha.co.jp/comicslist/44749/
- **白泉社 official trial route**, volume-1 edition `9784592187349`: https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59218734lovesol00111&viewer=bs&rurl=http%3A%2F%2Fwww.hakusensha.co.jp%2F%3Fp%3D44745

The official product pages identify the first three volumes and the bounded childcare/family
events. The licensed trial route reached the CLIP STUDIO reader shell and displayed the cover, but
the body did not advance after provider resource failures/403 responses in this environment. No
readable event ledger was therefore claimed from the trial. Independent reviews were checked only
to test whether a new Axis could be supported without that body route:

1. `Sony Reader`, [LOVE SO LIFE volume-1 reviews](https://ebookstore.sony.jp/review/title/10132778/id/LT000025962000394692/?sort=-like), review dates `2018-12-19` and `2024-10-19`, volume 1, retrieved `2026-08-25`. It gives concrete childcare/relationship observations but is insufficient for a new Narrative Axis.
2. `コミックシーモア`, [LOVE SO LIFE reviews](https://www.cmoa.jp/title/customer_review/title_id/70262/), review dates shown `2022-06-30`, `2024-01-30`, and `2025-08-08`, mixed-volume page, retrieved `2026-08-25`. It corroborates the childcare and gradual relationship context without supplying a bounded problem-solving sequence.

The official descriptions plus reviews do not safely support a new `problemSolving`, `comedy`,
`darkness`, or `mentalStress` value. Care work is not automatically problem solving, and “healing”
or romance reactions are not new values in this pass. Round-2 `romance=2` (downgraded to `1`) and
`comedy=1` (rejected) are not resubmitted. This is text-gap exhaustion, not a safety or identity
blocker.

## Non-reopened positions and preserved boundaries

- Position `42` was not opened, re-fetched, or reinterpreted. Its compound blocker remains in the
  separate position-42 adjudication packet.
- Positions `43` and `44` were not re-proposed because the round-2 accepted candidates already
  passed their text gates. Repeating them would be a no-op.
- Round-2 rejected proposals were reopened only for `41.comedy=1`, `45.mysteryReveal=2`,
  `49.comedy=2`, and the materially different `47.problemSolving=2` / `48.mysteryReveal=2`
  candidates where new readable official body pages and independent bounded reviews were added.
- Position `46` and `50` have no new safe cell. Neither is assigned a hard blocker from this packet.
- No Art, safety, canonical identity, representative ISBN, provenance, or promotion state was
  changed. Unknown remains an explicit state and is not a low score.

## Pass-C handoff

Pass C should adjudicate the five candidates against the frozen terminal CSV. For every candidate,
check that the cited reviews are independent, that the official reader page range is actually within
the first 1–3 volume entry window, and that the claimed structure meets the exact Factor Dictionary
anchor. The conservative fallback for any failed check is `unknown`; no automatic mean or simple
majority vote is permitted.

The intended mutation boundary is exactly this file:
`data/staging/catalog-expansion/batches/batch-004/research/text-gap-recovery-chunk-05-round-3.md`.
