# Batch 004 text-gap recovery — positions 1–10

- 조사일: 2026-08-25
- 대상: `batch-004/frozen-work-set.csv` positions 1–10
- 범위: 작품별 초반 1–3권 또는 첫 주요 에피소드. 후반 전개와 애니메이션 자료는 텍스트 Factor 근거로 사용하지 않았다.
- 기존 값: Pass C의 known 값을 동결했다. 아래는 잔여 gap에 대한 추가 근거와 제안만 기록한다.
- 제목: canonical title에는 장식용 `『』`를 포함하지 않았다.
- 판정 상태: `reviewedByHuman=false`. 이 파일은 연구 packet이며 CSV·promotion registry·promotion 상태를 변경하지 않는다.
- 사전: Narrative 순서 `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`; Tone 순서 `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`.
- 원칙: 공식 출판사·공식 연재/미리보기 자료를 우선했다. 리뷰는 공식 자료가 직접 보여 주는 entry 관찰을 교차 확인할 때만 보조로 사용했다. 제목·장르·추천 목록·요약에 없는 사실만으로 known 0을 만들지 않았다.

## 결과 요약

| position | title                  | residual gap from Pass C        | additional proposal                                                                            | expected text coverage after proposal                     | disposition                                                                       |
| -------: | ---------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------- |
|        1 | ホストと社畜           | Theme +1, Narrative +4, Tone +1 | Theme `workplace:1`; Tone `mentalStress:2`                                                     | Genre 1/1, Theme 1/1, Narrative 1/6, Tone 5/7             | Narrative remains research-required; no blocker                                   |
|        2 | うるわしの宵の月       | Narrative +2, Tone +2           | Tone `mentalStress:2`, `emotionalWarmth:2`                                                     | Genre 1/1, Theme 1/1, Narrative 2/6, Tone 5/7             | Narrative remains research-required; no blocker                                   |
|        3 | 応天の門               | Tone +2                         | `characterArcWeight:3`, `mentalStress:2`                                                       | Genre 1/1, Theme 1/1, Narrative 4/6, Tone 5/7             | Text gate candidate pass; independent review evidence used                        |
|        4 | のらみみ               | Narrative +2, Tone +2           | Tone `comedy:2`, `mentalStress:2`                                                              | Genre 1/1, Theme 1/1, Narrative 2/6, Tone 5/7             | Narrative remains research-required; no blocker                                   |
|        5 | ヒナまつり             | Narrative +2, Tone +2           | Tone `comedy:2`, `mentalStress:2`                                                              | Genre 1/1, Theme 1/1, Narrative 2/6, Tone 5/7             | Narrative remains research-required; no blocker                                   |
|        6 | 駅から5分              | Theme +1, Narrative +2, Tone +1 | Theme `workplace:1`; Tone `mentalStress:2`                                                     | Genre 1/1, Theme 1/1, Narrative 2/6, Tone 5/7             | Narrative remains research-required; no blocker                                   |
|        7 | つらつらわらじ         | Narrative +1, Tone +4           | Narrative `problemSolving:2`                                                                   | Genre 1/1, Theme 1/1, Narrative 4/6, Tone 1/7             | Tone remains research-required; no blocker                                        |
|        8 | ふうらい姉妹           | Theme +1, Narrative +4, Tone +1 | No new value; biological siblinghood is not `foundFamily`                                      | Genre 1/1, Theme 0/1, Narrative 0/6, Tone 4/7             | Research-required; no blocker                                                     |
|        9 | それでも町は廻っている | Narrative +3, Tone +2           | Narrative `pacing:2` only                                                                      | Genre 1/1, Theme 1/1, Narrative 2/6, Tone 3/7             | Research-required; no blocker                                                     |
|       10 | 青空にとおく酒浸り     | all text gates missing          | Genre `scienceFiction;comedy`; Theme `combat:1`; four Narrative and five Tone candidates below | Genre 1/1, Theme 1/1, Narrative 4/6, Tone 5/7 if accepted | `SOURCE_INFORMATION_UNAVAILABLE` is no longer reproducible; adjudication required |

The proposed values are not an automatic approval. Pass C or a later independent adjudicator must accept, downgrade, or leave each proposal `unknown`.

## 1. ホストと社畜 — `work-025c8ab93483a39c9330`

### Source ledger

1. **双葉社 official press release**, [volume 2 release and work synopsis](https://prtimes.jp/main/html/rd/p/000000700.000014531.html), published 2025-04-10, retrieved 2026-08-25. Scope is the volume-2 announcement plus the publisher's series synopsis. It describes the 05:00 Shinjuku Kabukicho gyudon-shop meeting, the salaryman beginning his day, the host ending his day, and their shared 15-minute morning routine. It also links the standard volume-1 and volume-2 publisher records. Authority: publisher press; independent from reviews.
2. **双葉社 official press release**, [volume 3 release](https://prtimes.jp/main/html/rd/p/000000821.000014531.html), published 2025-09-25, retrieved 2026-08-25. Scope is volume 3 with the volume-1–3 standard-edition links. It describes the recurring morning meal, mutual encouragement, cooking and daily-life help, and explicitly says the pair are neither friends nor lovers. Authority: publisher press; distinct release from source 1.
3. **コミックシーモア customer review**, [volume 1 page](https://www.cmoa.jp/title/300198/vol/1/), review dated 2026-08-16, retrieved 2026-08-25. Scope declared by the page is volume 1. The review describes the two asking each other for advice and compensating for each other's shortcomings, with mostly self-contained episodes. It is a single user review and is not used as sole Factor Evidence; it only agrees with the publisher's relationship observation.
4. **個人 reading blog**, [ホストと社畜 1–2巻 review](https://ameblo.jp/sayu04-dokusho/entry-12909803580.html), publication date not exposed, retrieved 2026-08-25. Scope declared by the article is volumes 1–2. It independently describes the two men's contrasting work lives and a gentle everyday connection. It is supplemental only and does not establish a missing value by itself.

### Gap decisions

- Theme `workplace:1` — **provisional accept, confidence 0.63**. The entry structure repeatedly contrasts a salaryman's start-of-day employment with a host's end-of-day employment, and volume 2 describes each bringing work-related worries into the recurring meeting. Centrality 1 is intentional: the workplace is a recurring source of context and problems, not a workplace-organization mechanic. Do not use `workplace:2`.
- `mentalStress:2` — **provisional accept, confidence 0.62**. The publisher's volume-2/3 descriptions include health-check anxiety, future concerns, fatigue, and mutual encouragement within the repeated entry routine. This is mixed pressure, not sustained psychological collapse; `darkness` remains unknown.
- `pacing` remains unknown. The stable morning routine may suggest low change, but a publisher marketing phrase is not a complete 1–3-volume frequency audit.
- No additional Narrative axis is proposed. The advice and support are relationship observations, not `problemSolving` or `strategy` under the dictionary anchors.

Limitation: no complete publisher-hosted internal pages for volumes 1–3 were available in the frozen packet. The proposals are positive observations only and do not convert synopsis silence to zero.

## 2. うるわしの宵の月 — `work-098b1781e14365eea667`

### Source ledger

1. **講談社 official volume 2 page**, [うるわしの宵の月（2）](https://www.kodansha.co.jp/comic/products/0000351649), published 2021-05-13, retrieved 2026-08-25. Scope: volume 2. It describes 宵's feelings changing after the senior helps her and the start of trial dating.
2. **講談社 official volume 3 page**, [うるわしの宵の月（3）](https://www.kodansha.co.jp/comic/products/0000356350), published 2021 (publisher page; exact date not reproduced), retrieved 2026-08-25. Scope: volume 3. It says 宵, initially guarded while probing the senior's true feelings, notices her own change of feelings and is confused by it.
3. **Dessert official work page**, [うるわしの宵の月](https://go-dessert.jp/c/uruwashi/), page undated, retrieved 2026-08-25. Scope: official series introduction. It describes the school setting, the two characters both called “prince,” a rescue at a convenience store, and their rapid approach.

### Gap decisions

- `mentalStress:2` — **provisional accept, confidence 0.78**. Volume 3 directly describes guardedness, uncertainty about the other's true feelings, and continuing confusion. This matches the mixed tension/irritation anchor, not the sustained-pressure 4 anchor.
- `emotionalWarmth:2` — **provisional accept, confidence 0.60**. Across volumes 1–3, the rescue, help-triggered relationship change, and trial-dating bond are direct positive relational observations. The relationship remains a romance/drama rather than a healing-core work, so 2 is the ceiling.
- No Narrative value is proposed. Relationship progression is not automatically the dictionary's growth/acquisition/mastery `progression`; probing feelings is not `mysteryReveal`; the school setting is not `problemSolving` or `strategy`.

Limitation: the official records expose summaries rather than a complete 1–3-volume reader. The two Tone additions require Pass C confirmation and must be downgraded if the adjudicator considers the observations too romance-specific to establish warmth or stress.

## 3. 応天の門 — `work-0f3a44f5dcab9623d1be`

### Source ledger

1. **新潮社 official volume 2 page**, [応天の門 2巻](https://www.shinchosha.co.jp/book/771777/), published 2014-10-09, retrieved 2026-08-25. Scope: volume 2. It states that 道真 and 業平 investigate and solve two events, then receive another strange case from 高子; it calls them a “平安の最強バディ.”
2. **新潮社 official volume 3 page**, [応天の門 3巻](https://www.shinchosha.co.jp/book/771810/), published 2015-04-09, retrieved 2026-08-25. Scope: volume 3. It says the brother's death truth is revealed and that the pair's fate moves further; the recurring case-solving structure continues.
3. **Sony Reader review page**, [volume 3 reviews](https://ebookstore.sony.jp/review/title/00289449/id/BT000028944900300301), user review dated 2015-05-01, retrieved 2026-08-25. Scope: volume 3. The review independently observes that the brother's death truth exposes deeper political darkness, that the entry is heavy, and that 道真 learns his knowledge carries responsibility.
4. **BookLive review page**, [volume 3 reviews](https://booklive.jp/review/list/title_id/289449/vol_no/003), user reviews dated 2020-02-14 and 2021-08-01, retrieved 2026-08-25. Scope: volume 3. Multiple reviewers independently describe the brother's death truth, the persistent 藤原家 darkness, and 道真's human/character response. These are different review records from source 3 and are used only as secondary corroboration.

### Gap decisions

- `characterArcWeight:3` — **provisional accept, confidence 0.78**. The official volume-3 personal truth and the two independent review records both identify 道真's response, responsibility, and changed understanding as a recurring reward in the entry arc. 3 is used because cases and institutions remain co-central; 4 would overstate character-only reward.
- `mentalStress:2` — **provisional accept, confidence 0.73**. The brother's death, deeper political darkness, and the resulting inability to act are direct entry-scope pressure observations in the official volume-3 summary and independent reviews. The mixed buddy/comedy frame prevents a 4.
- No other value is reopened. `strategy` remains unknown: investigation and political background are not automatically long-term planning.

Limitation: review pages include spoiler text and are not primary evidence. The official volume records control the scope; reviews only corroborate the two proposed Tone observations. No review prose is copied into UI explanations.

## 4. のらみみ — `work-11d23966f22f777e95d0`

### Source ledger

1. **小学館 official e-comic, volume 1**, [のらみみ 1](https://e-comi.shogakukan.co.jp/books/091884110000d0000000), page undated, retrieved 2026-08-25. Scope: volume 1. It describes the Hello Kids 59 branch, characters living with children, the resident character's unresolved search for a home, and a warm/funny world.
2. **小学館 official e-comic, volume 2**, [のらみみ 2](https://e-comi.shogakukan.co.jp/books/091884120000d0000000), page undated, retrieved 2026-08-25. Scope: volume 2. It describes the Choco Bat group formed while children are at school, a leader who gives accurate advice when asked, and のらみみ continuing to seek a home with children.
3. **小学館 official e-comic, volume 3**, [のらみみ 3](https://e-comi.shogakukan.co.jp/books/091884130000d0000000), page undated, retrieved 2026-08-25. Scope: volume 3. It describes the recurring Hello Kids setting and multiple resident-character episodes, including a character in love with an adult woman and characters with memory/career problems. The publisher tags the series as human drama, everyday/healing, SF/fantasy, and gag.

### Gap decisions

- `comedy:2` — **provisional accept, confidence 0.69**. The publisher marks the series as gag and presents multiple entry-volume resident-character incidents with humorous situations. The human drama and separation premise remain co-central, so 2 rather than 4.
- `mentalStress:2` — **provisional accept, confidence 0.55**. Across volumes 1–3, the unresolved home search, the requirement to leave a child's home after the age boundary, and repeated residents' difficulties supply mixed pressure. This is intentionally low confidence; if the adjudicator treats those as setting facts rather than sustained entry pressure, retain unknown.
- No Narrative addition is proposed. Choco Bat advice is a direct local action, but not enough to establish a repeated `problemSolving` or `strategy` reward. The home-search premise is not automatically `progression`.

Limitation: official descriptions are short and no complete internal page sample was used. The proposed Tone values must not be treated as absence values.

## 5. ヒナまつり — `work-132ce7172750a3b1fa53`

### Source ledger

1. **KADOKAWA official volume 1**, [ヒナまつり 1](https://www.kadokawa.co.jp/product/301306000979/), published 2011-07-15, retrieved 2026-08-25. Scope: volume 1. It introduces the psychic girl, forced cohabitation, yakuza context, and the resulting disruption of 新田's life.
2. **KADOKAWA official volume 2**, [ヒナまつり 2](https://www.kadokawa.co.jp/product/301306000980/), published 2011-11-15, retrieved 2026-08-25. Scope: volume 2. It describes the second psychic girl, gang destruction, shoplifting, a pursuit, 新田's countermeasure, and “笑撃の超能力バトル.”
3. **KADOKAWA official volume 3**, [ヒナまつり 3](https://www.kadokawa.co.jp/product/201110000430/), published 2012-03-03, retrieved 2026-08-25. Scope: volume 3. It confirms the continuing struggle of the three girls and the entry group structure.

### Gap decisions

- `comedy:2` — **provisional accept, confidence 0.67**. The publisher explicitly calls the volume's psychic battle “笑撃” and presents the recurring disruption as a comedy/action mixture. This is not raised to 4 because the supplied volume copy does not establish comedy as the sole or constant reward.
- `mentalStress:2` — **provisional accept, confidence 0.70**. Volume 1 establishes forced cohabitation and a life disruption; volume 2 explicitly says 新田's troubles keep increasing while threats and criminal incidents recur. The pressure is mixed with comedy and care, so 2 rather than 4.
- No Narrative addition is proposed. A single countermeasure is not enough to change `problemSolving` or `strategy`; psychic powers do not imply progression.

Limitation: these are publisher volume descriptions, not complete page samples. The proposals are positive observations; no darkness or adult status is inferred from yakuza, violence, or danger.

## 6. 駅から5分 — `work-15dba4fdb46308ab45d7`

### Source ledger

1. **集英社 official original volume 1 route**, [駅から5分 1](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865439865439315501), published 2007-11-19, retrieved 2026-08-25. Scope: original paper volume 1. It describes people, scenery, and events crossing in 花染町.
2. **集英社 official bunko volume 2 description**, [駅から5分 2](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-619655-0), published 2016-12-16 for the reprint edition, retrieved 2026-08-25. Scope: reprint description of the entry series, not a replacement for the frozen original ISBN. It describes a robot otaku, complicated feelings, a post-accident change, and a taxi driver unable to operate because of the accident; people and scenery continue to intersect.
3. **集英社 official original volume 3 route**, [駅から5分 3](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865566865439315501), published 2009 (series record; exact page date not reproduced), retrieved 2026-08-25. Scope: volume-3 identity/series boundary. It is not used to invent volume-3 events.
4. **マンガ大賞 official jury comment**, [2010 comment PDF](https://www.mangataisho.com/data/2010/comment2010.pdf), published 2010-03-17, retrieved 2026-08-25. Scope: early-series comment; it refers to the three-volume development and the same-town structure, but is secondary and not used to add unobserved axes.

### Gap decisions

- Theme `workplace:1` — **provisional accept, confidence 0.58**. The taxi driver's inability to continue operating and the occupational lives in the entry are direct, but workplace is only a substory among interwoven town lives. Do not use centrality 2.
- `mentalStress:2` — **provisional accept, confidence 0.71**. The official volume-2 description directly gives complicated feelings, a traffic accident's continuing consequence, and loss of a taxi livelihood. These are mixed pressures in a relationship anthology, not sustained psychological collapse.
- No Narrative addition is proposed. Intersecting lives establish `relationshipStructure`, already known, but do not by themselves establish `problemSolving`, `strategy`, or `mysteryReveal`.

Limitation: the frozen original volume and the supplemental bunko description are different editions. The bunko text is used only as a series-level content lead and cannot change representative ISBN or edition identity.

## 7. つらつらわらじ — `work-188ba092c6195603bb3f`

### Source ledger

1. **講談社 official volume 1**, [つらつらわらじ 1](https://www.kodansha.co.jp/comic/products/0000014069), published 2010-09-22, retrieved 2026-08-25. Scope: volume 1. It describes the late-Edo sankin-kotai procession, shogunate austerity reform, and a spy in the procession.
2. **Sony Reader licensed-distributor volume 2**, [つらつらわらじ 2](https://ebookstore.sony.jp/title/00133690/id/BT000013369000200201/), published 2011-03-23 for the paper edition, retrieved 2026-08-25. Scope: volume 2. It describes arrival at an inn, an illegitimate-son rumor, and the lord's conduct causing trouble.
3. **講談社 official new-release list / Rakuten volume 3 identity**, [講談社 list](https://www.kodansha.co.jp/comic/new-releases/p?page=1396) and [Rakuten Books 3](https://books.rakuten.co.jp/rb/11364804/), published 2011-10-21, retrieved 2026-08-25. Scope: volume-3 identity only; no plot is inferred.
4. **マンバ review page**, [volume 2 reviews](https://manba.co.jp/boards/11640/books/2), review page published 2011–2012 (individual dates not consistently exposed), retrieved 2026-08-25. Scope: volume 2. The page independently describes the procession's route, the lord's order, and the need to reunite with the main party by a deadline. It is secondary corroboration, not sole evidence.

### Gap decisions

- `problemSolving:2` — **provisional accept, confidence 0.61**. The entry has a recurring operational problem: a procession is split and a new retainer is ordered to reunite with the main party by the next morning. The official journey/spy material plus the volume-2 review gives direct action under a stated constraint. This is 2, not 4: no sustained long-range resource operation is established.
- `strategy` remains unknown. Reform and espionage are plot context; the packet does not directly show a repeated planning process.
- No Tone values are proposed from political danger or period setting. `darkness`, `mentalStress`, and warmth remain unknown rather than being inferred from historical or political Themes.

Limitation: volume 2 is a licensed-distributor synopsis and volume 3 is identity-only. The problem-solving proposal needs Pass C confirmation because the publisher volume-1 synopsis alone is not enough.

## 8. ふうらい姉妹 — `work-19c2017b33c07f48634e`

### Source ledger

1. **KADOKAWA official volume 1**, [ふうらい姉妹 1](https://www.kadokawa.co.jp/product/201008000188/), published 2010-11-15, retrieved 2026-08-25. Scope: volume 1. It presents a two-sister 4-koma comedy.
2. **KADOKAWA official volume 2**, [ふうらい姉妹 2](https://www.kadokawa.co.jp/product/201109000335/), published 2012-01-14, retrieved 2026-08-25. Scope: volume 2. It continues the two-sister comedy and identifies the pair as the recurring center.
3. **KADOKAWA official volume 3**, [ふうらい姉妹 3](https://www.kadokawa.co.jp/product/301309000222/), published 2013-10-03 for the electronic page / 2013-09-14 paper edition, retrieved 2026-08-25. Scope: volume 3. It describes the sisters' continuing discoveries and laughter, and says being together makes even poverty enjoyable.
4. **KADOKAWA page user reviews**, same volume-2 page, retrieved 2026-08-25. One review dated 2021-05-09 notes a possible small change in the younger sister while also saying the pair remain funny; another dated 2014-06-01 describes recurring sister and supporting-character gags. These do not independently establish a dictionary Narrative axis.

### Gap decisions

- No new Theme. Biological siblinghood is not converted to `foundFamily`; no other dictionary Theme is directly central.
- No new Narrative value. The continuing 4-koma routine establishes comedy, but it does not by itself establish progression, problem solving, strategy, mystery, or world-building. The single review's “slight growth” is not enough to establish `progression` across the bounded entry.
- No new Tone value. The current `relationshipStructure:2`, `comedy:4`, `darkness:0`, and `emotionalWarmth:4` already capture the direct pair/comedy/warmth observations. The reviewer comments do not establish a further axis without stretching the dictionary.

Limitation: source descriptions are short and the one available review page contains personal impressions. This work requires a complete official sample or a new bounded evidence route; it is not a `SOURCE_INFORMATION_UNAVAILABLE` blocker yet.

## 9. それでも町は廻っている — `work-1a6ad6771865b43c8516`

### Source ledger

1. **少年画報社 official volume 1**, [それでも町は廻っている 1](https://www.shonengahosha.co.jp/book_Info.php?id=5944), published 2006-01-02, retrieved 2026-08-25. Scope: volume 1. It describes the Seaside maid café, the lively neighborhood, and neighborhood comedy.
2. **少年画報社 official volume 3**, [それでも町は廻っている 3](https://www.shonengahosha.co.jp/book_Info.php?id=6146), published 2007-08-03, retrieved 2026-08-25. Scope: volume 3. It repeats the neighborhood maid-café setting and describes 歩鳥 as a high-school student and aspiring detective in neighborhood comedy.
3. **少年画報社 series list**, [series record](https://www.shonengahosha.co.jp/book_Search.php?bookTag=%E3%81%9D%E3%82%8C%E3%81%A7%E3%82%82%E7%94%BA%E3%81%AF%E5%BB%BB%E3%81%A3%E3%81%A6%E3%81%84%E3%82%8B), page undated, retrieved 2026-08-25. Scope: series identity only.
4. **マンガ大賞 official jury comment**, [2009 comment PDF](https://www.mangataisho.com/data/2009/comment090324.pdf), published 2009-03-24, retrieved 2026-08-25. Scope: early-series comment. It notes neighborhood episodes and planned gags, but does not establish an actual mystery-solving loop.

### Gap decisions

- `pacing:2` — **provisional accept, confidence 0.61**. The official volume 1/3 descriptions show repeated neighborhood episodes with changing people and situations while the same café functions as the stage. This supports ordinary Arc-level change, not fast pacing 4.
- `mysteryReveal` remains unknown. “Aspiring detective” and the jury comment do not directly show a clue/reveal reward; this preserves the Pass C caution.
- No Tone additions. Neighborhood ensemble and comedy are already represented by the known relationship/comedy values. Liveliness alone does not prove warmth, low darkness, or low stress.

Limitation: no complete official 1–3 reader was available in this recovery packet. The pacing proposal is positive and conservative; it does not imply a mystery Genre or investigation Theme.

## 10. 青空にとおく酒浸り — `work-1cdc6c5cca7c33fafe51`

### Finite source search and identity result

The frozen packet had only identity records. A bounded Japanese-title/author search on 2026-08-25 found no usable Tokuma volume synopsis in the frozen publisher route, but it did find a reliable manga-news description, an official Manga Taisho jury-comment PDF, and multiple independent entry-volume reviews. Therefore the earlier `SOURCE_INFORMATION_UNAVAILABLE` candidate is **not reproducible as a content-source blocker**. This does not itself approve the work; the proposed values still require Pass C.

### Source ledger

1. **コミックナタリー manga news**, [new-volume announcement](https://natalie.mu/comic/news/54668), published 2011-08-11, retrieved 2026-08-25. Scope: series context plus the existing volumes 1–3 before volume 4. It describes people injected with micromachines, special abilities used for ordinary daily life, and the series as SF comedy.
2. **マンガ大賞 official jury comments**, [2013 comment PDF](https://www.mangataisho.com/data/2013/comment2013.pdf), published 2013, retrieved 2026-08-25. Scope: series-level comment covering the early published work. It independently identifies a balance of SF, gag, and battle, and says the continuation is difficult to predict. It is selection/critical evidence and not a substitute for an internal page sample.
3. **Asahi-net reading review**, [volumes 1–3 review](https://www.asahi-net.or.jp/~wf9r-tngc/aozoranitooku.html), publication date not exposed, retrieved 2026-08-25. Scope: explicitly volumes 1–3. It observes the micromachine-afflicted girl, the shift toward the father, wasteful use of extraordinary powers, high-tension volume 3, and battle sequences. Independent review; concrete entry observations only.
4. **ぶるぶろぐ volume-1 review**, [青空にとおく酒浸り 1](https://bulublogpart1.seesaa.net/article/a61263932.html), published 2010-10-10, retrieved 2026-08-25. Scope: volume 1. It observes two micromachine carriers, rapid healing after a major accident, the father, and a slapstick comedy structure. Independent from source 3.
5. **天雅日記 reading review**, [series review](https://oretenga2679.hatenablog.com/entry/61864472), published 2010-08-01, retrieved 2026-08-25. Scope: volume 1/early series. It independently describes two girl micromachine carriers, unusual SF rules, and a gag-manga mode. It corroborates the SF/comedy and carrier structure but is not used for an axis alone.
6. **ふさ千明のおたネタ日記**, [volume-3 review](https://husachiaki.blog.shinobi.jp/Entry/1088/), published 2010-06-12, retrieved 2026-08-25. Scope: volume 3. It observes escalating action/speed, repeated bizarre abilities, and the continuing gag structure. Independent from source 3–5.

### Proposed genre/theme

- Genre `scienceFiction` — **provisional accept, confidence 0.91**. Comic Natalie identifies micromachines and special abilities and labels the work SF comedy; the two independent volume/series reviews describe the same micromachine-carrier premise.
- Genre `comedy` — **provisional accept, confidence 0.91**. Comic Natalie and the 2013 jury comment both name the gag/comedy mode; independent reviews describe the early volumes' slapstick/high-tension comic construction.
- Theme `combat:1` — **provisional accept, confidence 0.64**. The official jury comment explicitly includes battle, and the independent volumes 1–3 review observes recurring ability-based battles. Centrality 1 is deliberate because daily-use SF comedy remains co-central and the packet does not establish combat as every episode's core.

### Proposed Narrative candidates

- `pacing:3` — **provisional accept, confidence 0.73**. The official jury comment says the continuation is difficult to predict; the volumes 1–3 review records a shift in focus and high-tension developments, while the volume-3 review observes escalating speed/action. This supports above-general change, but not the maximum 4 without page-by-page frequency evidence.
- `mysteryReveal:2` — **provisional accept, confidence 0.58**. The volumes 1–3 review describes the initial apparent girl-centered action shifting to the father's role, and the volume-1 review describes multiple carriers and the micromachine premise. This is a bounded reversal/hidden-structure lead, not a sustained clue-solving mystery; downgrade to unknown if Pass C requires explicit clue/reveal recurrence.
- `worldBuilding:3` — **provisional accept, confidence 0.75**. Across the news description and independent reviews, micromachine carriers, special abilities, healing constraints, and related characters recur as functional rules rather than one-off scenery. 3 is used because the available evidence does not establish a full faction/history system.
- `problemSolving:1` — **provisional accept, confidence 0.55**. The volume-1 review directly describes an accident being handled by the micromachine's healing function and the news description says unusual abilities are used in daily life. This is a weak, direct action/ability-use signal, not the dictionary's analytical 2 or ingenious 4. If the adjudicator treats ability effects as mechanics rather than solving, leave this axis unknown.
- `progression` and `strategy` remain unknown. No evidence shows repeated acquisition/mastery or long-horizon planning in the entry range.

### Proposed Tone candidates

- `characterArcWeight:2` — **provisional accept, confidence 0.61**. The early series shifts attention among the girl, the father, and other carriers; character behavior and relationship context are recurrent, but comedy/SF action remain co-central.
- `relationshipStructure:3` — **provisional accept, confidence 0.60**. The early reviews identify two micromachine girls, a father, and connected carriers as a recurring relationship group. 3 is used instead of 4 because the evidence does not establish a complex multi-perspective ensemble as the main reward.
- `comedy:4` — **provisional accept, confidence 0.91**. The official jury comment and Comic Natalie both identify gag/comedy, and three independent reviews describe the entry as sustained gag/slapstick or high-tension comic material.
- `darkness:2` — **provisional accept, confidence 0.65**. The reviews directly mention accidents, nonhuman/violent ability use, a harsh father figure, and disturbing material. These are serious and sometimes crude content leads, but the comic/gag framing and lack of a dark-world core keep this at 2; this is not an adult-only classification.
- `mentalStress:2` — **provisional accept, confidence 0.54**. The volume-1 and volumes-1–3 observations include repeated danger, a girl's bodily micromachine condition, and distressing/father-driven situations. The evidence is borderline and does not establish sustained psychological collapse; downgrade to unknown if the direct-pressure requirement is not met.
- `romance` and `emotionalWarmth` remain unknown. Sexual jokes or character attraction in a review are not romance-axis evidence, and no repeated healing/bond reward was established.

### Gate implication and limitation

If Pass C accepts the conservative candidates (`pacing:3`, `mysteryReveal:2`, `worldBuilding:3`, `problemSolving:1`; `characterArcWeight:2`, `relationshipStructure:3`, `comedy:4`, `darkness:2`, `mentalStress:2`), the text gate becomes Genre 1/1, Theme 1/1, Narrative 4/6, Tone 5/7. If any borderline candidate is downgraded, the work remains research-required rather than `SOURCE_INFORMATION_UNAVAILABLE`.

The available evidence includes reliable press/award text and independent reviews, but no publisher-hosted complete 1–3-volume reader was located. No Art value is proposed. The content includes crude/sexualized humor and violence leads; those are safety-review inputs, not automatic adult-only classification.

## Handoff

- Files changed: this research markdown only.
- CSV, source data, annotation Pass A, promotion registry, generated catalog, and blocker records: unchanged.
- All proposals retain `reviewedByHuman=false` and require independent Pass C adjudication.
- Art: no Art value or Art evidence was created.
