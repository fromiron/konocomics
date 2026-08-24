# Batch 003 text-gap recovery — chunk 01, round 02

- `retrievedAt`: 2026-08-24
- `reviewedByHuman`: `false`
- `method`: bounded official-first text recovery (`promotion-evidence-v2`)
- `scope`: frozen positions 2, 3, 5, 7, and 9 only; entry range means volumes 1–3 or the first major episode
- `excluded`: Art axes, artwork/image inspection, recommendation-list membership, user-review language, genre/synopsis-only inference, and numeric promotion
- `frozenWorkSetSha256`: `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd`

This pass records evidence and rejects unsupported candidates. A candidate is not promoted unless the source is direct entry-range publisher/editorial/internal-preview text and the factor dictionary's repeated-mechanism threshold is met. Adaptation pages and alternate editions are retained with an explicit boundary and are not silently merged with the frozen representative ISBN.

## Position 2 — work-048a39f42bd18cb0823e, 大東京トイボックス

Round-01 residual: Tone needs three additional axes; unresolved Tone axes are `comedy`, `darkness`, `mentalStress`, `romance`, and `emotionalWarmth`. Existing `workplace`, `crafting`, and the known Narrative axes are not reopened here.

### Qualifying and bounded sources

- [LINE Manga digital remaster](https://manga.line.me/product/periodic?id=878800) — `publishedAt`: not shown; edition metadata identifies ナンバーナイン's digital remaster and the page exposes first-volume 第1話 and the first three free episodes; `retrievedAt`: 2026-08-24. Exact scope is the remastered volume 1 entry text, not the frozen representative edition. The text says an aspiring game creator, Momoko, enters G3, feels the gap between her dream and reality during training, and encounters the creators' game-making spirit. This is a direct authorized internal-preview/edition text. It corroborates existing `workplace`/`crafting`; `mentalStress` is a candidate signal (dream/reality gap) but is one summary-level conflict and does not establish repeated stress. It rejects `comedy`, `darkness`, `romance`, and `emotionalWarmth`: none has a repeated entry-range mechanism in the exposed text. No Theme is promoted.

- [Game Watch creator interview, volume 2](https://game.watch.impress.co.jp/docs/news/616563.html) — `publishedAt`: 2013-09-24; `retrievedAt`: 2026-08-24. Exact scope is the volume 2 production-planning sequence: a three-minute proposal, a “燃え×萌えのシューティング” constraint, iterative brainstorming, and team/creator coordination. It supports existing `problemSolving`, `strategy`, `crafting`, and `workplace` evidence. It rejects the missing Tone axes: production teamwork is not reader-facing `emotionalWarmth`, and a constrained planning meeting is not repeated `comedy`, `darkness`, `mentalStress`, or `romance`.

- [Game Watch creator interview, mainly volume 3](https://game.watch.impress.co.jp/docs/news/618077.html) — `publishedAt`: 2013-10-04; `retrievedAt`: 2026-08-24. Exact scope is explicitly described as mainly volume 3: Masa leaves after a work-wall crisis; Momo's presence makes the others more responsible; the author discusses the planned return and volume-3 foreshadowing. This is direct editorial interview text and provides a `mentalStress` candidate (work crisis) plus corroboration of `characterArc`/`relationship`. It is insufficient for a 0/2/4 Tone assignment because the text gives one bounded crisis rather than repeated stress across the entry range. “More responsible” and a planned return do not establish `emotionalWarmth`; no support for `comedy`, `darkness`, or `romance`.

- [TV Tokyo official first-episode story](https://www.tv-tokyo.co.jp/dai_tokyo_toybox/story/01.html) — `publishedAt`: `2014-01-04` ONAIR date visible; `retrievedAt`: 2026-08-24. Exact scope is the broadcaster/rights-holder's first major adaptation episode, not manga volume text: Momoko reaches the G3 interview, the studio faces deadline/budget conflict with a genius creator, overseas-version negotiations and a game contest appear, and a new problem child creates turmoil. It corroborates existing `workplace`, `crafting`, `progression`, and `relationship`. It rejects missing Tone promotion: conflict is not enough for repeated `darkness` or `mentalStress`; the page does not establish `comedy`, `romance`, or `emotionalWarmth`. Adaptation scope prevents using it to overwrite the frozen manga edition.

- [TV Tokyo official series introduction](https://www.tv-tokyo.co.jp/dai_tokyo_toybox/introduction/) — `publishedAt`: page is undated; the official site shows the 2014-01-04 series start; `retrievedAt`: 2026-08-24. Scope is series-level introduction, not entry volume. It describes G3's management crisis, deadline/budget walls, a problem child, and the idea that liking the work is not enough to clear its walls. It corroborates existing `workplace`/`crafting` and gives a bounded `mentalStress` candidate, but rejects all missing Tone promotion because it is broad series copy without repeated entry-range scenes. The official original-work page identifies Ume and publisher 幻冬舎コミックス but supplies no factor-bearing text.

### Position-2 disposition

No Tone axis is promoted. `mentalStress` remains an evidence lead only; the other four residual Tone axes remain unsupported. The broadcaster and remaster sources are useful corroboration but do not satisfy the frozen-edition/repeated-mechanism threshold.

## Position 3 — work-04f35b4c99514d50231d, デトロイト・メタル・シティ

Round-01 residual: Narrative needs two axes and Tone needs two axes. All unresolved text axes are Narrative `progression`, `problemSolving`, `strategy`, `mysteryReveal` and Tone `darkness`, `romance`, `emotionalWarmth`; `mentalStress` was not retained after adjudication.

### Qualifying and bounded sources

- [LINE Manga authorized complete-edition preview](https://manga.line.me/product/periodic?id=S153673) — `publishedAt`: not shown; edition is the 20th-anniversary complete edition by プロテカ, with text stating that the body is unchanged from prior editions except liner notes/color pages; first three episodes DEATH 1–3 are free; `retrievedAt`: 2026-08-24. Exact scope is complete-edition volume 1/first three episodes, with an explicit alternate-edition boundary. The entry text presents charismatic Krauser II/DMC while revealing that his real identity is a timid young man who wanted a pop band and did not want this band. It corroborates existing `comedy` and the dual-persona relationship premise. It rejects `progression`, `problemSolving`, `strategy`, and `mysteryReveal` as factor candidates: the identity contrast is a premise/reveal, not a repeated mystery mechanism or problem-solving/strategy structure in the exposed entry text. It also rejects missing `darkness`, `romance`, and `emotionalWarmth`: the unwilling-band premise and gag setup do not establish repeated pressure, romance, or reader-facing warmth.

- [LINE Manga book detail](https://manga.line.me/book/detail?id=B00166095557) — `publishedAt`: not shown; `retrievedAt`: 2026-08-24. Scope is the same complete-edition volume 1 entry metadata and synopsis. It repeats the DMC/Krauser-versus-timid-young-man premise but adds no new mechanism or exact-range observation. It therefore corroborates `comedy` only and rejects every residual Narrative/Tone candidate for lack of repeated entry evidence.

- Official Hakusensha order material ([young-comics order PDF](https://www.hakusensha.co.jp/book-store/order/pdf/young.pdf)) — `publishedAt`: not shown; `retrievedAt`: 2026-08-24. Scope is publisher identity/order metadata, not readable entry text. It cannot support or reject a factor beyond confirming the publisher/edition route; no value is promoted.

The official movie rights-holder page and broad 2008 interviews were checked but are adaptation/series-level material, not direct volume 1–3 entry text, so they are not used for factor support.

### Position-3 disposition

No Narrative or missing Tone axis is promoted. The alternate complete edition is textually linked to the prior body, but its exposed entry synopsis still lacks repeated mechanisms. Residuals remain exactly as listed above.

## Position 5 — work-07faf4019b12de5e877d, 私の少年

Round-01 residual: Narrative remains short of the requested three axes (`progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding` are unresolved); one additional Tone axis and any Theme candidate would be needed. Known `pacing`, `characterArc`, `relationship`, `darkness`, `mentalStress`, and `emotionalWarmth` are not reopened.

### Qualifying and bounded sources

- [Futabasha official release announcement PDF](https://prtimes.jp/a/?c=14531&f=d14531-28-pdf-0.pdf&r=28) — `publishedAt`: PDF is undated; the publisher announcement visibly states volume 1 release `2016-06-11`; `retrievedAt`: 2026-08-24. Exact scope is the first publicly released episode/volume 1 entry: 30-year-old office worker Satoko meets 12-year-old Mashu; workplace and former-lover pressure are named; Mashu's family problems and loneliness are described; the two connect, with the text asking whether this is motherhood or something else. This official publisher text corroborates existing `relationship`, `mentalStress`, and `emotionalWarmth`. It rejects `progression`, `problemSolving`, `strategy`, `mysteryReveal`, and `worldBuilding`: no constrained plan, clue/reveal, system, or recurring goal is described. Office employment is backdrop, not enough to add a Theme `workplace`; the football mention does not establish a competition Theme. No additional Tone or Theme is promoted.

- [Futabasha official volume pages](https://www.futabasha.co.jp/book/97845758481060000000?type=1), [volume 2](https://www.futabasha.co.jp/book/97845758489530000000?type=1), and [volume 3](https://www.futabasha.co.jp/book/97845758500170000000?type=1) — `publishedAt`: 2016-06-11, 2016-12-12, and 2017-07-12 respectively; `retrievedAt`: 2026-08-24. Exact scope is official volumes 1–3 product copy. These pages are the frozen publisher route and provide no new mechanism beyond the round-01 evidence. They reject the remaining Narrative/Theme recovery request because the exposed copy contains no problem-solving, strategy, mystery-reveal, or world-system mechanism and no Theme-level repeated activity. No value is changed.

- [MANTANWEB editor interview](https://mantan-web.jp/article/20160722dog00m200061000c.html) — `publishedAt`: 2016-07-23; `retrievedAt`: 2026-08-24. Exact scope is volume 1/early serialization editorial discussion. It elaborates the Satoko/Mashu relationship and reader-facing emotional stakes but introduces no missing Narrative mechanism or Theme. It therefore only corroborates existing `relationship`/`emotionalWarmth`; all residual Narrative axes and Theme candidates remain rejected.

The attempted Futabasha reader URL pattern for the volume-1–3 ISBNs did not expose a readable text preview in the available route; the product pages and publisher release remain the admissible official text.

### Position-5 disposition

No Narrative axis, additional Tone axis, or Theme is promoted. The publisher release is strong entry text for already-known relationship/stress/warmth only; it does not turn employment or a football reference into Themes.

## Position 7 — work-171b262b7ad72871f795, ドリフターズ

Round-01 residual: Tone needs two additional axes. Unresolved Tone axes are `characterArc`, `mentalStress`, `romance`, and `emotionalWarmth`; existing Narrative and combat/war/territory-management evidence is not reopened.

### Qualifying and bounded sources

- [NBC Universal/Shonen Gahosha official anime first episode](https://www.nbcuni.co.jp/rondorobe/anime/drifters/story/01.html) — `publishedAt`: not shown; `retrievedAt`: 2026-08-24. Exact scope is the first major adaptation episode: the Sekigahara retreat, Toyohisa's attack on the enemy general, severe injury, transport to another world, and meeting Nobunaga and Yoichi. It corroborates existing `darkness`, `progression`, `problemSolving`, `strategy`, and `war`/`combat` evidence. It rejects the residual Tone axes: no romance or reader-facing warmth, and a single injury/transport event is not repeated `mentalStress` or `characterArc` evidence. Adaptation scope is not merged with the frozen manga edition.

- [official anime episode 2](https://www.nbcuni.co.jp/rondorobe/anime/drifters/story/02.html) and [episode 3](https://www.nbcuni.co.jp/rondorobe/anime/drifters/story/03.html) — `publishedAt`: not shown; `retrievedAt`: 2026-08-24. Scope is adjacent early adaptation episodes, beyond the first-episode boundary: Toyohisa rescues attacked elves and later military planning/fortress action is described. Episode 2 is a bounded `emotionalWarmth` candidate (protective rescue), while episode 3 corroborates existing `strategy`/`problemSolving`; neither supplies repeated entry-range Tone evidence, and neither supports romance. They are retained as rejected/insufficient rather than promoted.

- [Shonen Gahosha official volume 1](https://www.shonengahosha.co.jp/book_Info.php?id=6358), [volume 2](https://www.shonengahosha.co.jp/book_Info.php?id=6837), and [volume 3](https://www.shonengahosha.co.jp/book_Info.php?id=7119) — `publishedAt`: 2010-07-07, 2011-10-13, and 2013-03-18 respectively; `retrievedAt`: 2026-08-24. Exact scope is publisher volumes 1–3 product text. The exposed descriptions cover Sekigahara's retreat, the otherworld war, and early conflict; they corroborate the known Narrative/Theme cells but provide no repeated evidence for `characterArc`, `mentalStress`, `romance`, or `emotionalWarmth`. No value is promoted.

- [Shonen Gahosha Manga DX+ announcement](https://www.shonengahosha.co.jp/topics_Info.php?id=7822) — `publishedAt`: 2020-09-14; `retrievedAt`: 2026-08-24. Scope is an app/free-episode availability announcement, not readable entry text. It confirms an official internal-preview route exists but exposes no factor-bearing observations; no candidate is supported.

### Position-7 disposition

No Tone axis is promoted. Episode 2's rescue is an isolated adaptation signal, not sufficient repeated `emotionalWarmth`; the route remains insufficient for both needed Tone axes.

## Position 9 — work-197089286d30de82f9e9, 多聞くん今どっち!?

Round-01 residual: Narrative needs one additional axis. Unresolved Narrative axes are `problemSolving`, `strategy`, and `mysteryReveal`; known `progression`, `pacing`, and `worldBuilding` are not reopened.

### Qualifying and bounded sources

- [Hakusensha/Manga Park official internal-preview page](https://manga-park.com/title/53371) — `publishedAt`: first-episode entries `2022-02-18` for 第1話①–⑥; `retrievedAt`: 2026-08-24. Exact scope is the publisher-owned first major episode preview and its entry metadata: Uta, a high-school fan, takes a housework job at idol Tamon's home; Tamon is a gloomy, low-self-esteem offstage self; Uta supports him. The page exposes episode metadata and synopsis text; later preview panels are image-only and are out of scope here. It corroborates existing `relationship`, `emotionalWarmth`, and the housework/workplace context. It rejects `problemSolving`, `strategy`, and `mysteryReveal`: no constrained plan, strategic mechanism, clue chain, or reveal structure is stated in the readable entry text. Do not infer `strategy` from the later center-selection/competition label; a short competition is not a strategy mechanism under the dictionary.

- [Hakusensha volume 1 new-release page](https://www.hakusensha.co.jp/news/62808/) — `publishedAt`: 2022-02-18; `retrievedAt`: 2026-08-24. Exact scope is volume 1 release copy. It calls the series an on/off “推し活ラブコメ” and repeats the Uta/Tamon premise. It corroborates existing relationship/romance-adjacent context but provides no Narrative mechanism; all three residual Narrative candidates are rejected for insufficient direct structure.

- [Hakusensha volume 3 new-release page](https://www.hakusensha.co.jp/news/64937/) — `publishedAt`: 2022-10-20; `retrievedAt`: 2026-08-24. Scope is volume 3 release copy, beyond the entry boundary; it says the center contest concludes and a new arc begins. This is not used to score entry Narrative. It does not supply a qualifying entry-range `problemSolving`, `strategy`, or `mysteryReveal` mechanism.

- [Official anime first episode](https://tamon-anime.com/story/01.html) — `publishedAt`: not shown; `retrievedAt`: 2026-08-24. Exact scope is the first major adaptation episode and repeats the housework/idol offstage premise. It corroborates existing relationship/warmth only; it rejects all residual Narrative promotion. Adaptation text cannot be used to fill a frozen manga Narrative gap.

### Position-9 disposition

No Narrative axis is promoted. The publisher-owned preview is the strongest exact-entry route, but its readable text contains premise and support, not a problem-solving, strategy, or mystery-reveal mechanism.

## Residual gaps and finite-route closure

| Position | Exact residual text gaps after round 02                                                                                                                                         | Gate shortfall from round 01                                    | Official-first finite route status                                                                                                                                                                  |
| -------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|        2 | Tone: `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth` remain unknown; `mentalStress` has leads but no repeated evidence                                      | three additional Tone axes needed                               | Exhausted for this bounded pass: publisher/alternate authorized preview, official broadcaster entry/intro, and exact vol-2/3 editorial interviews checked; no qualifying repeated Tone text remains |
|        3 | Narrative: `progression`, `problemSolving`, `strategy`, `mysteryReveal`; Tone: `darkness`, `romance`, `emotionalWarmth`                                                         | two Narrative + two Tone axes needed                            | Exhausted for this bounded pass: Hakusensha identity route and authorized complete-edition first-three-episode preview checked; no qualifying repeated mechanisms remain                            |
|        5 | Narrative: `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`; no Theme assigned; unresolved Tone candidates include `comedy`, `darkness`, `romance` | three Narrative + one Tone axis and a Theme candidate requested | Exhausted for this bounded pass: Futabasha volumes 1–3, publisher release, editor interview, and reader-route attempt checked; no qualifying missing mechanism remains                              |
|        7 | Tone: `characterArc`, `mentalStress`, `romance`, `emotionalWarmth` remain unknown                                                                                               | two additional Tone axes needed                                 | Exhausted for this bounded pass: Shonen Gahosha volumes 1–3, Manga DX+ route, and official first/adjacent anime episodes checked; rescue/war signals do not meet repeated Tone threshold            |
|        9 | Narrative: `problemSolving`, `strategy`, `mysteryReveal`                                                                                                                        | one additional Narrative axis needed                            | Exhausted for this bounded pass: Hakusensha volumes/new-release pages, Manga Park first-episode preview, and official first anime episode checked; no qualifying mechanism remains                  |

“Exhausted” means the finite official-first routes defined for this recovery were checked, not that no inaccessible or future source can ever exist. Any further attempt would require a newly authorized route (for example, a paid/full reader) and must preserve the same edition and entry-range boundary. These residuals remain `unknown`; they are not zeros and do not block later independent human review.
