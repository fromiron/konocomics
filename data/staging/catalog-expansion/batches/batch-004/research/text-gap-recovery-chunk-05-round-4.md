# Batch 004 text-gap recovery — chunk 05, round 4

- 대상: non-gate positions `41`, `45`, `46`, `48`, `49`, `50`
- 조사 제외: position `42` モテキ의 최종 compound blocker, 그리고 이미 text gate를 통과한 `43`, `44`, `47`
- 조사일 및 모든 `retrievedAt`: `2026-08-25`
- reviewer: `luna-text-recovery-round-4`
- `reviewedByHuman`: `false`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`
- terminal text CSV SHA-256 at read: `4df2a5564ef8a582d199d0ffe852cf13e6a96b1338d591019dcdadd50b0e69f7`
- round-3 research SHA-256: `b839cc3e94386bc2f12bdfc90e7cd962b7f7827b23643b4d92d90c8a2d1a03f1`
- round-3 Daybreak QA SHA-256: `34202023651f771e00dcec24dbe71532344b95c4f4427913908eae61bd086f63`
- chunk-05 blocker adjudication SHA-256: `c4be3b24ae4b9b9a3f1b1e8f4dff4531a3400dcb2e7e1fe77306a8425666abb1`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`

This is a research-only packet. It does not modify terminal text CSV, source rows, Genre, Theme,
Art, safety, identity, ISBN, promotion, blocker, registry, generated data, or runtime explanations.
No Art value is proposed. Canonical titles are written without decorative `『` or `』` delimiters.

## Method and decision boundary

The pass followed still-unused official volume 1–3 product and licensed-reader routes first. A
reader shell that returned no readable body text was recorded as an access result, not as scene
evidence. Official synopses were bounded to the first three volumes or the complete one-shot.
Independent reviews were used only when they contained concrete observations tied to the same entry
range; ratings, popularity, recommendation-list membership, vague adjectives, anime material, and
cover art were excluded. Review wording is paraphrased and is not runtime explanation text.

Only two previously untouched cells produced a genuinely new candidate. All other checked material
either confirms an already known cell or fails the relevant Factor Dictionary anchor. A candidate is
for independent Pass C adjudication only and must be reverted to `unknown` if the source range,
review independence, or anchor mapping does not hold.

## Locked cells and no-reopen ledger

The following decisions are carried forward without re-proposal:

| position | locked cells | round-4 handling |
|---:|---|---|
| 41 | `comedy=1` accepted in round 3; earlier `strategy`/`emotionalWarmth` decisions remain closed | no new candidate |
| 42 | untouched final `FACTOR_MODEL_INCOMPATIBLE` + `SOURCE_INFORMATION_UNAVAILABLE` compound blocker | not inspected or mutated |
| 45 | `mysteryReveal=2` rejected in round 3; `progression` rejection remains closed | no new candidate |
| 47 | `problemSolving=2` accepted in round 3 | not reopened; already text-gate pass |
| 48 | `progression=2` accepted; `mysteryReveal=2` rejected in round 3 | only new `emotionalWarmth` candidate below |
| 49 | `comedy=2` and `emotionalWarmth=2` accepted; `problemSolving=2` rejected | no new candidate |
| 50 | `romance=1` accepted; `problemSolving` and `comedy` proposals rejected | no new candidate |

## Current terminal snapshot before this packet

The terminal file was read but not changed. Counts are Narrative `N` and Tone `T`; Art unknowns
are not promotion blockers.

| position | workId | canonicalTitle | current coverage | round-4 disposition |
|---:|---|---|---|---|
| 41 | `work-c7280f9dcc2754d3f864` | 鵺の陰陽師 | `N4/6 · T3/7` | no candidate |
| 45 | `work-e81955a9fc5c4d84580f` | ここは今から倫理です。 | `N2/6 · T5/7` | no candidate |
| 46 | `work-eef84d07d90ba2b040cf` | さよなら絵梨 | `N2/6 · T4/7` | `emotionalWarmth=2` candidate |
| 48 | `work-fc53cb5669aa4099ee4a` | アオハライド | `N2/6 · T4/7` | `emotionalWarmth=1` candidate |
| 49 | `work-fd2a957c501c36047ed0` | 青の祓魔師 | `N3/6 · T5/7` | no candidate |
| 50 | `work-ff9b025f58d7e12f3cb1` | LOVE SO LIFE | `N1/6 · T4/7` | no candidate |

## New Pass C candidates

### Position 46 — さよなら絵梨 — `work-eef84d07d90ba2b040cf`

**Candidate:** `emotionalWarmth=2`, confidence `0.56`.

The official complete-work synopsis describes Yuta's joint filmmaking with Eri after bereavement,
their communication through the film, and the farewell/reality boundary. Three independent
complete-work reviews add concrete relational observations: the film is the pair's continuing
means of contact, the farewell is emotionally reciprocal rather than a simple plot event, and Yuta
later resumes filmmaking after family loss. This is a mixed bond and recovery signal in a grief-heavy
one-shot, not a `4` healing-core claim. It is therefore a candidate for the Dictionary's mixed
relationship/warmth level, not a terminal value.

**Official sources**

| source | publication date/year | retrievedAt | bounded observation |
|---|---:|---:|---|
| [集英社, さよなら絵梨 complete one-shot product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-883167-1) | `2022-07-04` | `2026-08-25` | Mother-loss filming request, Yuta/Eri joint film, farewell, and reality/creation crossing are the official entry frame. |
| [少年ジャンプ＋, さよなら絵梨 official volume route](https://shonenjumpplus.com/volume/4856001361007486895) | `2022` entry; page date not exposed in retrieved view | `2026-08-25` | Official complete-volume route and reading entry; body response was image-based in this environment. |
| [集英社 licensed reader, ISBN 9784088831671](https://books.shueisha.co.jp/reader/main.php?cid=9784088831671) | edition route; publication date inherited from product above | `2026-08-25` | Preview payload was image/tile based, so it is not credited as readable scene text. |

**Supplemental reviews**

| source | publication date/year | retrievedAt | independent observation |
|---|---:|---:|---|
| [rednought, さよなら絵梨 review](https://note.com/rednought_1/n/nc3d5037851) | `2022-04-11` | `2026-08-25` | Yuta and Eri's relationship is carried by filmmaking, and the final farewell is treated as emotional communication. |
| [まゆ文庫, さよなら絵梨 review](https://www.mayubunmei.com/manga/3748) | `2024-07-09` | `2026-08-25` | The review tracks the secret/reality turn and Yuta's return to filmmaking after loss; it is used as relational corroboration, not as a new mystery or progression value. |
| [12garage, さよなら絵梨 review](https://12garage.hatenadiary.jp/entry/2022/04/16/040231) | `2022-04-16` | `2026-08-25` | Yuta's conflicted feelings and growth through making the film are described concretely. |

**Boundary:** This packet does not reopen `progression`, `mysteryReveal`, or any earlier decision.
The candidate remains `unknown` until Pass C confirms that a short, grief-heavy reciprocal bond is
enough for the `emotionalWarmth=2` anchor. If the reviewer requires warmth to be a recurring core
reward rather than a bounded relationship event, retain `unknown`.

### Position 48 — アオハライド — `work-fc53cb5669aa4099ee4a`

**Candidate:** `emotionalWarmth=1`, confidence `0.55`.

The official volume-2 description gives a concrete effort to build new relationships and a joint
leadership-training context. A volume-2 reader review describes Kou offering practical support and
Futaba recognizing that kindness; the volume-review surfaces also describe friendship and care amid
the romantic conflict. This is a weak, intermittent positive signal with substantial social strain,
not the mixed warmth anchor at `2` and not a healing/found-family core at `4`. The low candidate is
intentionally conservative and may remain `unknown` after independent adjudication.

**Official sources**

| source | publication date | retrievedAt | bounded observation |
|---|---:|---:|---|
| [集英社, アオハライド volume 1 product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846647-7) | `2011-04-13` | `2026-08-25` | First-love reunion and changed interpersonal stance establish the conflicted relationship frame. |
| [集英社, アオハライド volume 2 product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846690-3) | `2011-08-25` | `2026-08-25` | Futaba makes a positive effort to build new relationships and joins leadership training with Kou. |
| [集英社, アオハライド volume 3 product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846731-3) | `2011-12-22` | `2026-08-25` | Futaba recognizes present feelings and confronts a friend’s feelings for Kou; this also documents the conflict limiting warmth. |
| [集英社 licensed reader, ISBN 9784088466477](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088466477) | edition route; publication date inherited from volume 1 | `2026-08-25` | Reader shell was reachable; no additional readable text claim is made here. |

**Supplemental reviews**

| source | publication date/year | retrievedAt | independent observation |
|---|---:|---:|---|
| [Ameblo, アオハライド volume-2 diary review](https://ameblo.jp/chikezdiary/entry-11896012676.html) | date not exposed on retrieved page | `2026-08-25` | The review ties Kou's practical help during the class-leadership context to an underlying kindness, rather than relying on a rating. |
| [BookLive, アオハライド volume-3 review surface](https://booklive.jp/review/list/title_id/193481/vol_no/003) | review dates shown include `2019-03-23` and `2017-05-18` | `2026-08-25` | The review surface discusses friendship, relational choices, and Kou's supportive behavior in the entry range; popularity and star ratings were ignored. |

**Boundary:** This packet does not reopen the accepted `progression=2` or rejected `mysteryReveal=2`.
It proposes no romance or relationship-structure rewrite. Pass C must confirm that the two review
surfaces are independent and that a low intermittent signal is permissible; otherwise leave the
cell `unknown`.

## Checked routes with no new candidate

### Position 41 — 鵺の陰陽師 — `work-c7280f9dcc2754d3f864`

Official volume 2 ([集英社](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-883788-8),
published `2023-12-04`, retrieved `2026-08-25`) describes 代葉's approach under the 藤乃家 order,
鵺's response to a difficult situation, and a later school/leisure event. Official volume 3
([集英社](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883820-5), published
`2024-02-02`, retrieved `2026-08-25`) was also checked. The opening-volume reader route
([licensed reader](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088836874), product
published `2023-10-04`, retrieved `2026-08-25`) returned a reader shell rather than new readable body
text in this pass. The [寿司いくら review](https://note.com/kotoduka_ikura/n/ndb1f7725f417), published
`2023-10-05`, and [感想ルーム review](https://kansou14.com/?p=8971), publication date not exposed,
both retrieved `2026-08-25`, discuss opening-volume interaction and tension. These observations do
not establish a new safe darkness, mental-stress, romance, mystery, strategy, or warmth anchor.
`comedy=1` remains the accepted round-3 value and is not re-proposed.

### Position 45 — ここは今から倫理です。 — `work-e81955a9fc5c4d84580f`

Official volume 2 ([集英社](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-891056-7),
published `2018-06-19`, retrieved `2026-08-25`) frames the teacher facing students' inner burdens;
volume 3 ([集英社](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-891261-5),
published `2019-04-19`, retrieved `2026-08-25`) continues the question of how to live and the
teacher's dialogue/support. These confirm the already known problem-solving, pacing, darkness,
mental-stress, and warmth context but do not provide strategy or a constructed world. The round-3
`mysteryReveal=2` rejection is preserved: a student articulating an inner burden is not automatically
a secret/reversal reward. No candidate or blocker is added.

### Position 49 — 青の祓魔師 — `work-fd2a957c501c36047ed0`

Official volume 2 ([集英社](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874757-6),
published `2009-11-04`, retrieved `2026-08-25`) describes the academy training camp and a demon
attack. Official volume 3 ([集英社](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-870016-8),
published `2010-03-04`, retrieved `2026-08-25`) describes the spirit-search mission, the sword loss,
and Rin's loss of flame control. The [Sony Book Review surface](https://ebookstore.sony.jp/review/title/00149811/id/BT000014981100100101/?sort=-like),
review dates shown around `2011-10-26`, and [BookLive volume-1 review surface](https://booklive.jp/review/list/title_id/150198/vol_no/001),
retrieved `2026-08-25`, describe bereavement, guilt, and abnormality. Their overlap and the official
danger summaries do not establish sustained mental pressure at the Dictionary anchor; danger or
loss alone is not a new Tone value. Accepted `comedy=2` and `emotionalWarmth=2` remain unchanged.

### Position 50 — LOVE SO LIFE — `work-ff9b025f58d7e12f3cb1`

Official Hakusensha volume 2 ([白泉社](https://www.hakusensha.co.jp/comicslist/44747/), published
`2009-09-18`, retrieved `2026-08-25`) describes Shiharu's childcare and Matsunaga's family-like
treatment. Volume 3 ([白泉社](https://www.hakusensha.co.jp/comicslist/44749/), published `2010-01-19`,
retrieved `2026-08-25`) describes the school-festival visit, family presence, happiness, and worry.
The [Rakuten Books product/review page](https://books.rakuten.co.jp/rb/6056365/), review dates shown
`2009-05-21`, `2009-05-22`, and `2009-08-06`, retrieved `2026-08-25`, corroborates the already known
care/family warmth but is not used to create a new factor. Childcare incidents are not automatically
problem solving or comedy, and the previously accepted `romance=1` is not reopened. No candidate or
blocker is added.

## Disposition and promotion impact

| position | result | blocker change | terminal write authorized |
|---:|---|---|---|
| 41 | no new cell | none | no |
| 45 | no new cell | none | no |
| 46 | Pass C candidate `emotionalWarmth=2`, confidence `0.56` | none | no |
| 48 | Pass C candidate `emotionalWarmth=1`, confidence `0.55` | none | no |
| 49 | no new cell | none | no |
| 50 | no new cell | none | no |

If both candidates are accepted, positions 46 and 48 would move from `T4/7` to `T5/7` while their
Narrative coverage remains `N2/6`; neither becomes a text-gate pass from this packet alone. No
promotion decision follows from research-only candidates. Position 42's two blocker rows remain the
only authorized blockers for this chunk, and no new blocker is proposed here.

## Handoff to Pass C

1. Verify the candidate source ranges and that the two supplemental review surfaces for position 48
   are independent rather than copied excerpts.
2. Apply the Factor Dictionary's warmth anchors conservatively; retain `unknown` when the evidence
   only proves a relationship event or a single supportive beat.
3. If accepted, create the normal evidence link in the adjudication pass; do not copy review prose
   into user-facing explanations.
4. Keep terminal text, generated artifacts, promotion overlays, safety, identity, ISBN, and Art files
   unchanged until independent adjudication completes.

## Integrity

`git diff --check` was run after writing this packet. The working tree contains unrelated shared-agent
changes; this packet adds only the research report above. No terminal or generated file was modified
by round 4.
