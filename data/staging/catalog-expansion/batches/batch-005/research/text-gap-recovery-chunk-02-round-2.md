# Batch 005 text gap recovery round 2 — positions 11–20

- 조사일: 2026-08-25
- 대상: `batch-005/frozen-work-set.csv` positions 11–20 only
- 범위: `entry_1_3_volumes` (공식 권 1–3 또는 그에 대응하는 초반 범위)
- `reviewedByHuman=false`
- current candidate root: `/tmp/konocomics-batch005-grok-text-chunk-02`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- Pass C response SHA-256: `d998c4b628ded98489d1cb79308fefa9e2a8581fa1054f45cf37c2f8bfbf648f`
- retrievedAt for every web source below: `2026-08-25`
- terminal CSV, Pass A, research chunk, source registry, overlay, status, and promotion files were not edited.

The frozen Pass C known cells are retained exactly. This round searched publisher/rightsholder volume pages and previews first, then official award or bookseller records where available, then two independent bounded user-review sources as supplemental corroboration. A review was never used alone to turn synopsis silence into known `0`. Genre never supplied an Axis value. Chapter titles, labels, and unresolved mysteries do not create a known cell. No Art value is proposed; all 40 Art cells remain `unknown`.

## Result summary

| position | title | frozen residual | round-2 proposals | projected coverage after proposal | disposition |
| ---: | --- | --- | --- | --- | --- |
| 11 | ヨルムンガンド | N+2, T+2 | `mentalStress=2`, `emotionalWarmth=2` | N 2/6, T 5/7 | Tone proposals only; Narrative remains unknown |
| 12 | ボクラノキセキ | N+2, T+2 | `darkness=2`, `emotionalWarmth=2` | N 2/6, T 5/7 | Tone proposals only; Narrative remains unknown |
| 13 | おまかせ精霊 | N+4, T+5 | `progression=2`, `pacing=2`, `characterArcWeight=2`, `relationshipStructure=2`, `comedy=2` | N 2/6, T 4/7 | Conservative partial recovery; no 0 values |
| 14 | ニラメッコ | N+4, T+2 | `comedy=2` | N 0/6, T 4/7 | Comedy only; all Narrative cells remain unknown |
| 15 | 恋愛ラボ | N+4 | none | N 0/6, T 5/7 | Finite route exhausted for Narrative |
| 16 | 銀のスプーン | N+1 | `problemSolving=1`, `worldBuilding=2` | N 5/6, T 5/7 | Provisional Narrative recovery; strategy remains unknown |
| 17 | おかめ日和 | Theme+1, N+3 | none | N 1/6, T 5/7 | No legal dictionary Theme found |
| 18 | 新黒沢 最強伝説 | N+3, T+3 | `comedy=2`, `mentalStress=2` | N 1/6, T 4/7 | Tone proposals only; hardship is not darkness |
| 19 | カレチ | N+1, T+3 | none | N 3/6, T 2/7 | Passenger incidents do not establish the residual cells |
| 20 | GREEN WORLDZ | N+2, T+2 | none | N 2/6, T 3/7 | Existing terminal unknowns retained |

Proposals are research candidates for a later adjudicator, not approvals. Confidence is confidence in the proposed value under the Factor Dictionary and entry scope, not a model vote.

## 11. ヨルムンガンド — `work-151b456508f78852b002`

### Source ledger

1. **小学館コミック, ヨルムンガンド 1**, https://shogakukan-comic.jp/book?isbn=9784091570697, published `2006-11-17`, official publisher volume. Scope: volume 1. Yona lost his parents to weapons, hates weapons, joins Koko's private unit, and is forced to use a hated weapon in the opening crisis.
2. **小学館コミック, ヨルムンガンド 2**, https://shogakukan-comic.jp/book?isbn=9784091570895, published `2007-04-19`, official publisher volume. Scope: volume 2. The unit is attacked by assassins in Dubai and enters a gunfight.
3. **小学館コミック, ヨルムンガンド 3**, https://shogakukan-comic.jp/book?isbn=9784091571090, published `2007-10-19`, official publisher volume. Scope: volume 3. Yona confronts Casper over landmines, child-soldier history, and revenge.
4. **レビューン漫画 user review**, https://reviewne.jp/reviews/27701, published date not stated on page, independent user review. Bounded use: only the review's volume-1 entry and its stated change by volume 3; later-series comments were excluded. It records dangerous arms-trade work and warmth developing between Yona and Koko's group.
5. **猿吉君ビールはジュース！ user review**, https://sarukitikun.blog.fc2.com/blog-entry-4451.html, published `2008-07-05`, independent personal blog. Scope: volumes 1–4; only the volume-1–3 portion was used. It confirms the armed-unit action frame and the recurring unit members; no later conclusion was used.
6. **コミックシーモア, ヨルムンガンド 1**, https://www.cmoa.jp/title/34386/?order=up, published page date not stated, retailer review page. Scope: volume 1. Its user review is separate from sources 4–5 and was used only as a bounded check of the entry's pressure and readability; it did not create an additional value.

### Proposals

- `mentalStress=2`, confidence `0.64`: the official entry repeatedly combines parental loss, hatred of the weapon that caused it, forced weapon use, assassination danger, and a revenge-linked conflict. This is mixed sustained pressure, not a new darkness endpoint; `darkness=4` remains frozen.
- `emotionalWarmth=2`, confidence `0.61`: the recurring private unit and the two independent review accounts provide mixed group support around Yona, without making warmth the sole reward. This is below 4 and does not change the accepted `relationshipStructure=2`.

### Terminal unknowns after this round

`progression`, `problemSolving`, `strategy`, `mysteryReveal`, `comedy`, `romance`; Art `artRealism`, `artDensity`, `visualSoftness`, `motionImpact`. Arms dealing and combat do not establish the missing Narrative cells, and no romance evidence was found.

## 12. ボクラノキセキ — `work-1550d4a52c3fe6d9f94c`

### Source ledger

1. **一迅社WEB, ボクラノキセキ 1**, https://data.ichijinsha.co.jp/detail/75805394, published `2009-02-25`, official publisher volume. Scope: volume 1. Minami has memories of Veronica, a queen of a kingdom destroyed by war, and is isolated at school.
2. **一迅社WEB, ボクラノキセキ 2**, https://data.ichijinsha.co.jp/detail/75805477, published `2010-01-25`, official publisher volume. Scope: volume 2. Classmates recover past-life memories and Hiroki claims to be Veronica.
3. **一迅社, Comic ZERO-SUM series page**, https://www.ichijinsha.co.jp/stories/comic-zerosum/bokuranok/, page date not stated, official rightsholder series page. Scope: series premise cross-checked against the early volumes. It states that classmates with memories try to unravel the truth of the past; no volume-3 event was invented.
4. **読書メーター user reviews, ボクラノキセキ 1**, https://bookmeter.com/books/547723, page date not stated, independent reader-review page. Scope: volume 1. It records the war-destroyed former kingdom and present school isolation; only those entry observations were used.
5. **もるの読書感想ルーム, ボクラノキセキ 1巻**, https://morga-cat0497.hatenablog.com/entry/2025/02/06/151722, published `2025-02-06`, independent personal review. Scope: volume 1. It records memory confusion, a classmate confrontation, and mystery/fantasy entry pressure.
6. **ピアノ・ファイア, ボクラノキセキ 1–2巻**, https://piano-fire.hatenablog.jp/entry/20100206/p1, published date not stated on page, independent personal review. Scope: volumes 1–2. It independently discusses the unusual memories and sustained unease; it was used as corroboration only.
7. **マンガ大賞 2010 reviewer comments**, https://www.mangataisho.com/data/2010/comment2010.pdf, published `2010-03-17`, official award record. Scope: award commentary, not a selection label used as Factor evidence; no new cell was derived from the award.

### Proposals

- `darkness=2`, confidence `0.62`: the official volume-1 premise explicitly includes a war-destroyed kingdom and the protagonist's isolation, while volume 2 adds conflicting recovered memories. This supports serious tragedy and pressure in the entry, not the cruel-world 4 anchor.
- `emotionalWarmth=2`, confidence `0.57`: classmates and personal bonds remain present around the memory conflict in the official series premise and both bounded reviews. The evidence supports mixed relational warmth only; it does not establish a healing-core 4 or romance.

### Terminal unknowns after this round

`progression`, `problemSolving`, `strategy`, `pacing`, `comedy`, `romance`; Art all four. The series page's “unravel the truth” wording does not add a new Narrative value because `mysteryReveal=3` and `investigation=2` are already frozen, and no chapter silence was treated as zero.

## 13. おまかせ精霊 — `work-15d6508605fbd4a266fc`

### Source ledger

1. **KADOKAWA / Comic Alive, おまかせ精霊 1**, https://comic-alive.jp/product/omakase/201216022042.html, published `2007-01-23`, official publisher volume. Scope: volume 1 bibliographic identity; the page does not expose enough plot detail by itself.
2. **KADOKAWA / Comic Alive, series listing**, https://comic-alive.jp/product/omakase/, page date not stated, official publisher series page. Scope: volumes 1–3 release order; bibliographic only.
3. **HMV&BOOKS, おまかせ精霊 1**, https://www.hmv.co.jp/artist_%E9%9D%92%E6%9C%AC%E3%82%82%E3%81%82_000000000360448/item_%E3%81%8A%E3%81%BE%E3%81%8B%E3%81%9B%E7%B2%BE%E9%9C%8A-1-MF%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%E3%82%B9_2517936, published `2007-01`, licensed bookseller volume. Scope: volume 1. It describes joining the spirit research club, spirit summoning, and loose club activity.
4. **Renta!, おまかせ精霊**, https://renta.papy.co.jp/renta/sc/frm/item/4991/, page date not stated; early digital edition metadata `2011-05-24`, licensed retailer review page. Scope: volumes 1–3. The volume 2 text says the protagonist gains two members and an adviser while aiming for club promotion; volume 3 says four members seek a fifth member to obtain a clubroom. The page exposes two user ratings; the review text is limited, so this source is supplemental only.
5. **ぱるかたーる user reading note**, https://palca.hatenablog.jp/archive/2007/02, published `2007-02-10`, independent personal blog. Scope: volume 1. It confirms the spirit-summoning premise and loose, non-battle entry tone; it does not establish a numeric Axis alone.
6. **マンガ大賞 2008 reviewer comments**, https://www.mangataisho.com/data/2008/comment.pdf, published `2008` (exact page date not stated), official award record. Scope: early-work commentary; it describes a loose premise developing into a growth story. It is used as a supplemental observation, not as a selection label.

### Proposals

- `progression=2`, confidence `0.69`: the official retailer volume-2 and volume-3 records show a repeated acquisition/goal chain—new members, club promotion, then a constrained search for a fifth member and a clubroom. This is ordinary repeated progress, not a high-intensity reward loop.
- `pacing=2`, confidence `0.57`: the early chain moves from invitation and loose activity in volume 1 to gaining members in volume 2 and a member-search objective in volume 3. The summaries support ordinary Arc change, not rapid change at 4.
- `characterArcWeight=2`, confidence `0.58`: the award commentary's growth observation and the member/club objective show some character/group development, but the spirit activity remains co-central.
- `relationshipStructure=2`, confidence `0.64`: volume 2 names two additional members and an adviser; volume 3 keeps the four-member group together while seeking a fifth. This supports a fixed group, not a complex ensemble at 4.
- `comedy=2`, confidence `0.64`: the licensed volume description calls it a spirit-summoning comedy and the independent volume-1 note describes the loose comic premise. The evidence supports intermittent comedy, not constant gag density at 4.

### Terminal unknowns after this round

`problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`; Art all four. School identity and the comedy label were not used to derive unrelated Axes.

## 14. ニラメッコ — `work-18e08fe95968a6537773`

### Source ledger

1. **白泉社, ニラメッコ 1**, https://www.hakusensha.co.jp/comicslist/60421/, published `2021-06-16`, official publisher volume. Scope: volume 1. Five young comedians share a house; Rei wants to make his partner laugh on stage.
2. **白泉社, ニラメッコ 2**, https://www.hakusensha.co.jp/comicslist/62179/, published `2022-01-28`, official publisher volume. Scope: volume 2. The five continue working as comedians while facing professional pride, online abuse, partner, and future concerns.
3. **白泉社 Young Animal series page**, https://magazine.younganimal.com/title/?id=44, page date not stated, official rightsholder page. Scope: series premise. It repeats the five-person shared-house and unstable comedy-work structure.
4. **コミックシーモア, ニラメッコ 1巻 user reviews**, https://www.cmoa.jp/title/223338/vol/1/, page date not stated, independent retailer review page. Scope: volume 1. Separate users describe comedy parts mixed with backstage worry, SNS abuse, and professional struggle.
5. **BookLive, ニラメッコ 1巻 user reviews**, https://booklive.jp/review/list/title_id/20033480/vol_no/001, page date not stated, independent retailer review page. Scope: volume 1. Separate users describe the five-person house, comedy work, and苦悩 behind the laughter.
6. **漫画発売日カレンダー, ニラメッコ 1巻 network reactions**, https://blog.newcomics.jp/archives/10348120.html, published `2021-06-17` (embedded post dates), independent aggregation of reader posts. Scope: volume 1 only; used only as a third supplemental check.

### Proposal

- `comedy=2`, confidence `0.79`: the official entry places the characters on comedy stages, while two independent volume-1 review pages explicitly describe comedy mixed with backstage struggle. This is intermediate comedy because the same sources emphasize professional anxiety and character drama; the existing `mentalStress=2` remains unchanged.

### Terminal unknowns after this round

`progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `darkness`, `romance`, `emotionalWarmth`; Art all four. The occupation and comedy Genre framing were not converted into unrelated Narrative values.

## 15. 恋愛ラボ — `work-19b578d0e828242f14f3`

### Source ledger

1. **芳文社 / まんがタイム, 恋愛ラボ series and volumes 1–3**, https://manga-time.com/comics/cart/mru.html, published `2008-03-07`, `2009-01-07`, and `2009-07-07` for volumes 1–3, official publisher series page. Scope: volumes 1–3. It explicitly describes the middle-school student council, romance practice, changing personalities, and a student-council crisis.
2. **BookLive, 恋愛ラボ 1巻 user reviews**, https://booklive.jp/review/list/title_id/210181/vol_no/001, page date not stated, independent retailer review page. Scope: volume 1. Users describe the student-council romance practice as a comedy and the group interaction as the entry reward.
3. **それはロックじゃない, 恋愛ラボ 1巻**, https://arr.hatenadiary.jp/entry/20080511/1210468267, published `2008-05-11`, independent personal review. Scope: volume 1. It describes the first-volume setup and the delayed formation of the romance-research activity; this is a concrete pacing observation but not enough for `pacing=2` without a full frequency audit.
4. **マンガ大賞 2010 reviewer comments**, https://www.mangataisho.com/data/2010/comment2010.pdf, published `2010-03-17`, official award record. Scope: early work commentary; it praises the school comedy's exchanges but does not add a new cell.
5. **紀伊國屋書店, 恋愛ラボ 1**, https://www.kinokuniya.co.jp/f/dsg-01-9784832266193, page date not stated, bookseller page with reader-review aggregation. Scope: volume 1. It was checked as a bookseller route; no additional Narrative observation beyond sources 1–3 was adopted.

### Gap disposition

No new value is proposed. The official summaries and two independent bounded reviews confirm the already-known Genre/Theme/Tone context, but do not establish repeated growth/acquisition, constraint analysis, long-range strategy, rapid pacing, clue-based reveal, or a world-system under the dictionary anchors. A four-panel format, chapter rhythm, and the title's romance wording were not treated as numeric evidence.

### Terminal unknowns after finite exhaustion

`progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`; Art all four.

## 16. 銀のスプーン — `work-1b3afe12c434a9cf7603`

### Source ledger

1. **講談社, 銀のスプーン 1**, https://www.kodansha.co.jp/comic/products/0000044784, published `2011-02-10`, official publisher volume. Scope: volume 1. Ritsu begins cooking for his siblings after his mother's illness.
2. **講談社, 銀のスプーン 2**, https://www.kodansha.co.jp/comic/products/0000044817, published `2011-06-13`, official publisher volume. Scope: volume 2. His mother is hospitalized and he attempts difficult dishes while family facts emerge.
3. **講談社, 銀のスプーン 3**, https://www.kodansha.co.jp/comic/products/0000044883, published `2011-12-13`, official publisher volume. Scope: volume 3. Family identity and family love/cooking support remain explicit.
4. **BookLive, 銀のスプーン 1 user reviews**, https://booklive.jp/review/list/title_id/217009/vol_no/001, page date not stated, independent retailer review page. Scope: volume 1. The page was checked for concrete cooking/family response observations; it does not independently establish a high-complexity solving process.
5. **絵本と勇気づけとノートと。, 銀のスプーン 1–3**, https://ameblo.jp/0910soha/entry-12958906850.html, published date not stated, independent personal review. Scope: volumes 1–3. It records Ritsu cooking for siblings and family warmth; it is supplemental only.
6. **マンガ大賞 2014 reviewer comments**, https://www.mangataisho.com/data/2014/comment2014.pdf, published `2014` (exact page date not stated), official award record. Scope: early-work commentary; it characterizes the work as warm everyday reading but does not create a new Axis.
7. **紀伊國屋書店, 銀のスプーン 1**, bookseller route checked through the Kodansha product listing and reader-review aggregation; published date not stated, retrieved `2026-08-25`. No additional qualifying cell was taken from a review summary.

### Proposals

- `problemSolving=1`, confidence `0.60`: repeated cooking under illness/family constraints is concrete practical response, and the volume-2 summary names difficult dishes. The value is deliberately below 2 because the sources do not show repeated constraint analysis or ingenious solutions.
- `worldBuilding=2`, confidence `0.60`: the three official volumes repeatedly use family/domestic cooking structures, illness, and household roles as the functional entry setting. This is a functional setting, not a 4-level history/culture/faction system.

### Terminal unknowns after this round

`strategy`; Art all four. Romance and comedy remain unknown as before. No family cooking description was converted into `foundFamily`, and no Axis was inferred from the `cooking` Theme.

## 17. おかめ日和 — `work-1b7c4ed54d7761cd242b`

### Source ledger

1. **講談社, おかめ日和 1**, https://www.kodansha.co.jp/comic/products/0000043658, published `2007-04-13`, official publisher volume. Scope: volume 1. Yasuko loves her acupuncturist husband, cares for two children and a grandfather, works, and faces a suspicious call.
2. **講談社, おかめ日和 2**, https://www.kodansha.co.jp/comic/products/0000043712, published `2007-10-25`, official publisher volume. Scope: volume 2. The married-couple and family-life frame continues; no additional workplace mechanic was invented.
3. **講談社, おかめ日和 3**, https://www.kodansha.co.jp/comic/products/0000044241, published `2008-04-11`, official publisher volume. Scope: volume 3. Yasuko sees her husband with another woman while family life and a larger incident continue.
4. **BookLive, おかめ日和 1 user reviews**, https://booklive.jp/review/list/title_id/286133/vol_no/001, page date not stated, independent retailer review page. Scope: volume 1. Users independently describe household warmth together with severe couple pressure; no new Narrative or Theme value was taken.
5. **コミックシーモア, おかめ日和 1 reviews**, https://www.cmoa.jp/title/86326/, page date not stated, independent retailer review page. Scope: volume 1 and a three-volume free-reading context. Users independently describe family warmth and the husband conflict; the later-series material was excluded.

### Theme disposition

No dictionary Theme is added. An existing family is not `foundFamily`; the husband's acupuncture occupation is not by itself a recurring `workplace` mechanic. The two review sources corroborate the already-known relationship/stress/warmth cells but do not establish repeated growth, constraint solving, strategy, clue-based mystery, or world-building.

### Terminal unknowns after finite exhaustion

`progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`; Art all four. `darkness` remains unknown; the couple conflict and suspicious incident were already rejected as sufficient for a dark-world value.

## 18. 新黒沢 最強伝説 — `work-1bce95b6c02673e59bcf`

### Source ledger

1. **小学館 / ビッグコミックBROS., 新黒沢 最強伝説 1**, https://bigcomicbros.net/comics/30136/, published `2013-11-29`, official publisher volume. Scope: volume 1. Kurosawa returns to society after an eight-year hospital absence.
2. **小学館 / ビッグコミックBROS., 新黒沢 最強伝説 2**, https://bigcomicbros.net/comics/30137/, published `2014-05-30`, official publisher volume. Scope: volume 2. He leaves the hospital unnoticed, walks alone, and remains unemployed at age 54.
3. **小学館 / ビッグコミックBROS., 新黒沢 最強伝説 3**, https://bigcomicbros.net/comics/30138/, published `2014-07-30`, official publisher volume. Scope: volume 3. He sleeps at a baseball ground, obtains food from supermarket samples, and is drawn into a clerk fight.
4. **Sony Reader, 新黒沢 最強伝説 1 user reviews**, https://ebookstore.sony.jp/review/title/10152692/id/LT000032940000431762/, page date not stated, independent retailer review page. Scope: volume 1. Users describe the exaggerated gag framing, loneliness, and social return; no predecessor-series event was transferred.
5. **ツェーイーメン, 新黒沢 最強伝説 1巻感想**, https://ameblo.jp/fake-or-bluff/entry-11715030732.html, published `2013-11-30`, independent personal review. Scope: volume 1. It records the hospital-return premise and exaggerated comedy; later volumes were not used.
6. **マンバ, 新黒沢 最強伝説 all-volume review**, https://manba.co.jp/topics/63716, page date not stated, independent review aggregation. Scope: the page includes 1–3 volumes; only the early return/homelessness observations were used, not the ending.

### Proposals

- `comedy=2`, confidence `0.60`: official volume-3 absurd survival situations and two independent volume-1 review accounts support intermittent comedy. This is not a 4-level constant-gag claim.
- `mentalStress=2`, confidence `0.64`: the official three-volume chain repeats hospital absence, solitary return, unemployment, street sleeping, food insecurity, and social uncertainty. This is psychological pressure mixed with absurdity; `darkness` remains unknown as required by Pass C.

### Terminal unknowns after this round

`progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`, `darkness`, `romance`, `emotionalWarmth`; Art all four. The `survival` Theme and `characterArcWeight=3` remain unchanged; hardship was not silently converted to darkness.

## 19. カレチ — `work-1d5a3158e78e639f1973`

### Source ledger

1. **講談社, カレチ 1**, https://www.kodansha.co.jp/comic/products/0000013990, published `2009-12-22`, official publisher volume. Scope: volume 1. New long-distance conductor Ogino serves passengers, grows as a worker, and appears in short episodes.
2. **講談社, カレチ 2**, https://www.kodansha.co.jp/comic/products/0000014109, published `2011-03-23`, official publisher volume. Scope: volume 2. Ten short stories continue Ogino's passenger-service and craft focus.
3. **講談社, カレチ 3**, https://www.kodansha.co.jp/comic/products/0000018293, published `2012-02-23`, official publisher volume. Scope: volume 3. Officially listed incidents include lost property, policing, an examination, and multiple railway occupations.
4. **BookLive, カレチ 1 user reviews**, https://booklive.jp/review/list/title_id/217009/vol_no/001, page date not stated, independent retailer review page. Scope: volume 1. Users describe passenger service, human interest, and the Showa railway setting; they do not provide repeated constraint-analysis evidence.
5. **客車倶楽部 user discussion, カレチ 1–2**, https://www.mamezoo.com/pc/PC-CLUB/LOG/LOG-G05.html, published `2012-05-27` to `2012-06-09`, independent railway-reader forum. Scope: volumes 1–2. It records passenger incidents and emotional response, but not a repeated strategic solution method.
6. **軌楽庵のつれづれ日記, カレチ 1–2**, https://kirakuann.exblog.jp/13653322/, published date not stated, independent personal review. Scope: volumes 1–2. It gives one concrete ticket-cancellation/service example and the human-service frame; one example is insufficient to upgrade `problemSolving` to 2.
7. **紀伊國屋書店, カレチ 1**, https://www.kinokuniya.co.jp/f/dsg-01-9784062779241, page date not stated, bookseller page with reader-review aggregation. Scope: volume 1. It was checked for bounded work/episode evidence; no new cell was taken.

### Gap disposition

No new value is proposed. The official short-story list and the three supplemental reader sources establish work and historical context already represented by `progression=2`, `pacing=3`, and `historicalReconstruction=2`, but they do not expose a repeated constraint-analysis process for `problemSolving`, long-range resource planning for `strategy`, or a fixed relationship network for `relationshipStructure`. Passenger incidents are not known zeroes.

### Terminal unknowns after finite exhaustion

`problemSolving`, `strategy`, `mysteryReveal`, `relationshipStructure`, `comedy`, `darkness`, `mentalStress`, `romance`; Art all four.

## 20. GREEN WORLDZ — `work-1e9c4852863a22bba058`

### Source ledger

1. **講談社, GREEN WORLDZ 1**, https://www.kodansha.co.jp/comic/products/0000019152, published `2014-05-09`, official publisher volume. Scope: volume 1. A blackout leaves Tokyo covered by giant plants attacking humans; Akira exits the subway into the desperate world.
2. **講談社, GREEN WORLDZ 2**, https://www.kodansha.co.jp/comic/products/0000019222, published `2014-08-08`, official publisher volume. Scope: volume 2. Akira decides to fight and searches for Iwatobi and weapons; plants stop moving at night while fear continues.
3. **講談社, GREEN WORLDZ 3**, https://www.kodansha.co.jp/comic/products/0000019307, published `2014-11-07`, official publisher volume. Scope: volume 3. A weapons maker, Nano, a dark prophecy, and despair-carrying insects appear as unresolved entry threats.
4. **コミックシーモア, GREEN WORLDZ 1 user reviews**, https://www.cmoa.jp/title/0000076654/, page date not stated, independent retailer review page. Scope: volume 1. Users describe sudden collapse of ordinary life, monster survival, battle, and later mystery; later-series comments were excluded from the entry decision.
5. **Sony Reader, GREEN WORLDZ 1 user reviews**, https://ebookstore.sony.jp/review/title/10109180/id/LT000018679000352229/, review dates `2014-09-20` and `2016-08-08`, independent retailer review page. Scope: volume 1. Two independent users describe plant-versus-human survival, danger, and unresolved curiosity; no user review was used to create a romance, comedy, or party value.
6. **マンガ大賞 2015 reviewer comments**, https://www.mangataisho.com/data/2015/comment2015.pdf, published `2015` (exact page date not stated), official award record. Scope: early-work commentary; it comments on the plant/giant-insect world but is not used to reopen the adjudicated `worldBuilding=2` or `darkness=4`.

### Gap disposition

No new value is proposed. Weapons search is not repeated strategy, a named Nano or unresolved prophecy is not a reveal payoff, and the three volume summaries do not establish a recurring fixed party. The review pair corroborates survival/threat/mystery atmosphere only; it cannot override the Pass C rejection of `strategy=2`, `mysteryReveal=2`, or `relationshipStructure=2`. No romance, comedy, or warmth evidence meets the entry gate.

### Terminal unknowns after finite exhaustion

`progression`, `problemSolving`, `strategy`, `mysteryReveal`, `relationshipStructure`, `comedy`, `romance`, `emotionalWarmth`; Art all four. Existing `pacing=3`, `worldBuilding=2`, `characterArcWeight=1`, `darkness=4`, and `mentalStress=3` are retained exactly.

## Finite route exhaustion and change boundary

- Publisher/rightsholder routes were checked for volumes 1–3 or the available early-volume route for every position. Where a publisher page was bibliographic only, a licensed bookseller or official award commentary was checked as a separate route.
- At least two independent supplemental reader sources were checked for each work. Range-matched sources were preferred; when a page included broader-series material, only clearly bounded volume-1–3 observations were used and later comments were excluded. Sources that only exposed a rating or an unbounded synopsis did not create a cell by themselves.
- Residual `unknown` is terminal for this bounded round, not a low value. No source established a legally missing Genre/Theme in position 17, and no residual Narrative/Tone cell was changed merely because a title, chapter list, genre label, occupation, school identity, food subject, or unresolved clue suggested it.
- All Art cells remain `unknown`: no representative-edition preview supplied six readable internal pages across two scenes, so no Art inference was attempted.
- The output is intentionally research-only. `reviewedByHuman=false`; no terminal CSV, Pass A CSV, research/source CSV, overlay, status, promotion registry, generated catalog, or commit was changed.
