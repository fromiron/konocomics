# Batch 004 text-gap recovery round 2 — positions 1–10

- 조사일: `2026-08-25`
- 조회일: `2026-08-25` (모든 URL)
- 프로젝트: `fromiron/konocomics`
- batch: `batch-004`
- 범위: frozen positions `1–10`
- frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`
- candidate SHA-256: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`
- repository root SHA at packet creation: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- dictionary: `docs/factors/factor-dictionary.md` SHA-256 `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- reviewedByHuman: `false`
- 이 packet은 research evidence만 추가한다. terminal CSV, source, promotion registry, overlay, blocker, generated catalog는 변경하지 않았다.

## 판정 범위와 증거 규칙

초반 1–3권 또는 첫 주요 에피소드만 사용했다. 공식 출판사·공식 전자서점·licensed reader를 먼저 확인하고, BookLive/Sony의 사용자 리뷰는 동일한 구체적 관찰이 두 건 이상 반복될 때만 보조 증거로 기록했다. 단일 감상, 별점, 추천 목록, 장르명, 표지와 애니메이션은 Factor 근거로 사용하지 않았다.

`0/2/4` 중간값은 dictionary anchor에 직접 대응할 때만 제안했다. `0`은 단순한 출처 침묵이 아니라 밝음·부재·낮음이 반복적으로 관찰된 경우에만 제안했다. 새 제안은 Pass C가 채택·기각·unknown 처리해야 하며 이 문서만으로 promotion 상태를 바꾸지 않는다.

독립 HTTP 확인에서 reader shell이 `200`이어도 viewer API가 `302`/`403`으로 본문을 반환하지 않으면 페이지 내용을 추측하지 않았다. 이는 해당 작품의 정보 부재가 아니라 이 실행 경로의 접근 한계다.

## 결과 요약

| pos | work | exact route result | eligible new text claim | residual / disposition |
|---:|---|---|---|---|
| 1 | `work-025c8ab93483a39c9330` ホストと社畜 | Futabasha reader shell `200`; content API `403`; volume 2/3 product shells `200`; BookLive product/reviews `200` | 없음. `pacing=0`과 `comedy=2`를 검토했으나 entry 1–3 전체 관찰 부족 | Narrative 0/6 remains; no blocker |
| 2 | `work-098b1781e14365eea667` うるわしの宵の月 | Kodansha volume 2/3 pages `200`; both official trial routes resolve to exact reader CIDs but provider handoff is not text-extractable in this run | 없음. 감정 변화는 relationship progression 자동 변환을 하지 않음 | Narrative 2/6 remains; no blocker |
| 3 | `work-0f3a44f5dcab9623d1be` 応天の門 | Shinchosha volumes 2/3 `200`; Sony volume-3 review page `200` with dated bounded reviews | `emotionalWarmth=2` provisional: official buddy framing plus repeated supportive/affectionate entry observations | Pass C adjudication required; no blocker |
| 4 | `work-11d23966f22f777e95d0` のらみみ | Shogakukan volume 1 reader shell/product pages `200`; volume 2/3 product pages `200`; BookLive product/reviews `200` | `darkness=0` provisional: publisher “ほんわか” framing and repeated light/warm entry observations | Narrative 2/6 remains; no blocker |
| 5 | `work-132ce7172750a3b1fa53` ヒナまつり | KADOKAWA volumes 2/3 `200`; exact BookWalker trial links resolve; vol.2 sample exposes 17 page image refs; BookLive product/reviews `200` | `mentalStress=2`, `emotionalWarmth=2` provisional, with official plot burden plus repeated bounded review observations | Narrative 2/6 remains; Pass C required; no blocker |
| 6 | `work-15dba4fdb46308ab45d7` 駅から5分 | Shueisha volume 1/3 readers and `bibGetCntntInfo.php` return `200` JSON/content servers; BookLive product/reviews `200` | 없음. anthology substory does not justify mentalStress or darkness | Narrative 2/6 remains; Art/context issue remains separate; no blocker |
| 7 | `work-188ba092c6195603bb3f` つらつらわらじ | Kodansha reader handoff `302`; Sony volume 2, Rakuten volume 3, BookLive volume 1/reviews `200` | 없음. journey/spy/human relations do not automatically prove strategy, mentalStress, or warmth | Narrative 3/6 and Tone 1/7 remain; no blocker |
| 8 | `work-19c2017b33c07f48634e` ふうらい姉妹 | KADOKAWA volumes 2/3 `200`; exact BookWalker volume 2/3 trial links resolve; BookLive product/reviews `200` | 없음. biological siblinghood is not foundFamily; 4-koma form is not a Narrative axis | Theme 0/1 and Narrative 0/6 remain; no blocker |
| 9 | `work-1a6ad6771865b43c8516` それでも町は廻っている | Shonen Gahosha volumes 1/3 `200`; BookLive ISBN-matched volume 1/reviews `200`; browser trial control confirmed | `emotionalWarmth=2` provisional: recurring humanistic neighborhood/comedy observations from official copy and multiple bounded reviews | Narrative 2/6 remains; mysteryReveal remains unknown; no blocker |
| 10 | `work-1cdc6c5cca7c33fafe51` 青空にとおく酒浸り | existing press/award/review sources `200`; BookLive/BookWalker/Sony/Rakuten ISBN searches return no exact item page | 없음. ability effects are not problemSolving; earlier SOURCE_INFORMATION_UNAVAILABLE remains withdrawn | Narrative 1/6 and Tone 2/7 remain; no blocker |

## Position 1 — ホストと社畜

### Routes followed

1. **双葉社 official reader**, [volume-1 reader](https://reader.futabasha.co.jp/s?cid=ac_hosttoshachiku), page date not exposed, retrieved `2026-08-25`. HTML shell returned `200`; it declares the work title, author, tags `癒し・ヒューマンドラマ・日常・1話完結`, and a work-specific reader. The direct `./sws/bibGetCntntInfo` content request returned `403` in this HTTP run, so no additional page event was claimed.
2. **双葉社 official product records**, [vol.1](https://www.futabasha.co.jp/book/97845758600160000000?type=2), [vol.2](https://www.futabasha.co.jp/book/97845758607400000000?type=2), [vol.3](https://www.futabasha.co.jp/book/97845758613890000000?type=2), publication dates not exposed by the returned shell, retrieved `2026-08-25`. All three product routes returned `200` but the response was an iframe shell without a new internal trial payload.
3. **BookLive volume 1**, [product](https://booklive.jp/product/index/title_id/20097990/vol_no/001), page `datePublished` `2024-08-28`, and [review list](https://booklive.jp/review/list/title_id/20097990/vol_no/001), reviews dated `2024-08-28`–`2026-06-27`, retrieved `2026-08-25`. Independent reviews repeatedly describe the fixed breakfast meeting, the contrasting work schedules, and a healing/unnamed bond. This corroborates the existing workplace and warmth observations but does not satisfy a Narrative anchor.

### Gap decisions

- `pacing=0`: **rejected for now**. `1話完結` and a repeated 15-minute breakfast routine support a low-change hypothesis, but the required first 1–3-volume situation audit was not obtained from the reader API. Absence of a new event is not enough to write known 0.
- `comedy=2`: **rejected for now**. “面白さ” in individual reviews is not the dictionary’s recurring comedy observation, and the official tags do not identify comedy.
- Existing `workplace=1` and `mentalStress=2` remain unchanged; this packet does not rewrite terminal cells.

No final blocker: the route is partially access-limited, not source-unavailable.

## Position 2 — うるわしの宵の月

### Routes followed

1. **講談社 official volume 1 trial**, [exact reader](https://www.kodansha.co.jp/comic/products/0000347553/trial/reader?cid=ba96be53fcfdb06d53367812d2ac2870103f34502862e3be32109cb2faf7e9d3), publication date for volume 1 in the frozen packet `2021-01-13`, retrieved `2026-08-25`. The official URL redirects to a provider handoff; no new text transcript was taken.
2. **講談社 official volume 2**, [product](https://www.kodansha.co.jp/comic/products/0000351649), published `2021-05-13`, retrieved `2026-08-25`; its official `試し読み` control resolves to [reader CID `9f3a8ee1...`](https://www.kodansha.co.jp/comic/products/0000351649/trial/reader?cid=9f3a8ee1fd7f5bf169c3490c552d94b29b2b0c88b884716430f4177f31b615a0).
3. **講談社 official volume 3**, [product](https://www.kodansha.co.jp/comic/products/0000356350), publication year `2021` (exact date not exposed in the packet), retrieved `2026-08-25`; its official `試し読み` control resolves to [reader CID `88fdb82e...`](https://www.kodansha.co.jp/comic/products/0000356350/trial/reader?cid=88fdb82ed36e3ac64e350bb45678024a4081d186ef9c13cb7a3dcd0d44fae41d).

### Gap decisions

- The volume 2/3 official summaries directly show guardedness, uncertainty, and trial dating, but this is already represented by the accepted Tone cells. It is not converted to `progression=2`: the current dictionary anchor requires repeated growth/acquisition/mastery reward, and romantic relationship movement alone is insufficient under the current adjudication rule.
- No new Narrative axis is eligible. `mysteryReveal` is not established by probing feelings, and `problemSolving`/`strategy` are absent from the bounded official descriptions.

No final blocker: exact official volume 2/3 reader routes exist even though this run could not extract their body pages.

## Position 3 — 応天の門

### Routes followed

1. **新潮社 official**, [volume 2](https://www.shinchosha.co.jp/book/771777/), published `2014-10-09`, and [volume 3](https://www.shinchosha.co.jp/book/771810/), published `2015-04-09`, retrieved `2026-08-25`. Both returned `200` and retain the recurring case-solving/buddy framing.
2. **Sony Reader licensed review page**, [volume 3](https://ebookstore.sony.jp/review/title/00289449/id/BT000028944900300301/), page title and review records retrieved `2026-08-25`. Dated bounded reviews include `2015-05-01`, `2015-04-18`, `2016-05-26`, `2017-07-09`, and later independent records. The page repeatedly records the pair’s support, the fiancée/family connection, and character response alongside the political case material.
3. **BookLive route**, [volume-3 review list](https://booklive.jp/review/list/title_id/289449/vol_no/003), publication dates in the existing packet `2020-02-14` and `2021-08-01`, retrieved `2026-08-25`. Used only as a separate corroboration route.

### Gap decision

- `emotionalWarmth=2`: **provisional accept, confidence 0.66**. The official volume-2 phrase “最強バディ” supplies a direct recurring-support relation; multiple independent volume-3 reviews repeat supportive partnership/family-affection observations. This matches mixed warmth (2), not healing as the sole reward (4). It is supplemental review evidence and needs Pass C confirmation.
- `characterArcWeight=3` remains rejected; the bound Pass C value `2` is not rewritten.
- `strategy` remains unknown; investigation and political context do not equal long-horizon planning.

No final blocker. The remaining gap is adjudication/coverage, not source absence.

## Position 4 — のらみみ

### Routes followed

1. **小学館 official e-comic**, [volume 1 reader](https://e-comi.shogakukan.co.jp/viewer/speedreader?cid=091884110000d0000000&u0=1&u1=https%3A%2F%2Fe-comi.shogakukan.co.jp%2Fbooks%2F091884110000d0000000&rurl=https%3A%2F%2Fe-comi.shogakukan.co.jp%2Fbooks%2F091884110000d0000000), page date not exposed, retrieved `2026-08-25`. The work-specific reader shell returned `200`; the initial packet’s six-page/five-context sample remains the bounded page evidence.
2. **小学館 official volume records**, [vol.2](https://e-comi.shogakukan.co.jp/books/091884120000d0000000) and [vol.3](https://e-comi.shogakukan.co.jp/books/091884130000d0000000), page dates not exposed, retrieved `2026-08-25`. Both returned `200`, preserving the Hello Kids setting and resident-character stories.
3. **BookLive volume 1**, [product](https://booklive.jp/product/index/title_id/217921/vol_no/001), `datePublished` `2013-09-23`, and [review list](https://booklive.jp/review/list/title_id/217921/vol_no/001), review dates `2009-10-04`–`2011-10-14`, retrieved `2026-08-25`. Several independent reviews describe short, warm, sometimes tearful resident/child episodes and an easy-going “ほっこり” tone.

### Gap decision

- `darkness=0`: **provisional accept, confidence 0.78**. The official volume-1 description calls the setting a “ほんわかワールド”; official volumes 1–3 retain everyday/healing/gag framing; independent volume-1 reviews repeatedly describe warm/tearful but light short episodes. This directly supports the low darkness anchor (0), while it does not claim that difficult events are absent.
- `mentalStress=2` remains **unknown**. Separation and home-search events are plot difficulties, but no repeated reader-facing anxiety/pressure observation met the dictionary threshold.
- No Narrative value is added; resident-character episodes do not automatically establish progression, problem solving, or strategy.

No final blocker.

## Position 5 — ヒナまつり

### Routes followed

1. **KADOKAWA official**, [volume 2](https://www.kadokawa.co.jp/product/301306000980/), print publication `2011-11-15` (electronic product record `2013-08-01`), and [volume 3](https://www.kadokawa.co.jp/product/201110000430/), print publication `2012-03-03`, retrieved `2026-08-25`. Both pages returned `200` and expose official BOOK☆WALKER `試し読み` links.
2. **BOOK☆WALKER licensed trials**, [volume 2](https://bookwalker.jp/de2c8d7edd-9302-444a-bfaa-a3051e33a472/?adpcnt=g2vvr2xz&utm_source=kadokawa.co.jp&utm_medium=referral&utm_campaign=button&sample=1&from=1) and [volume 3](https://bookwalker.jp/debfd614e0-5596-435d-a519-b3bb490f3e87/?adpcnt=g2vvr2xz&utm_source=kadokawa.co.jp&utm_medium=referral&utm_campaign=button&sample=1&from=1), licensed pages retrieved `2026-08-25`. Volume 2 resolved to `viewer-trial.bookwalker.jp` and exposed 17 `p-*.xhtml` image references; the first non-title pages show the entry battle/arrival sequence. No UI text was copied.
3. **BookLive volume 1**, [product](https://booklive.jp/product/index/title_id/201266/vol_no/001), `datePublished` `2013-03-29`, and [review list](https://booklive.jp/review/list/title_id/201266/vol_no/001), review dates `2021-11-16`–`2025-03-19`, retrieved `2026-08-25`. Multiple independent reviews separately repeat the protagonist’s ongoing worry/苦労 under the cohabitation, the mixed comedy, and small acts of care/heartwarming response.

### Gap decisions

- `mentalStress=2`: **provisional accept, confidence 0.68**. Official volume 1 establishes forced cohabitation/life disruption; official volume 2 says the protagonist’s troubles increase while threats recur; independent reviews repeatedly observe ongoing worry rather than merely danger. This is mixed pressure (2), not sustained psychological collapse (4).
- `emotionalWarmth=2`: **provisional accept, confidence 0.66**. The cohabitation/care relation and multiple independent reviews’ repeated care/relief observations support mixed warmth. Action and gag remain co-central, so 4 is rejected.
- No Narrative value is added. A single countermeasure, pursuit, or psychic ability is not `problemSolving` or `strategy`.

No final blocker. Art and Narrative gates remain separate and unresolved.

## Position 6 — 駅から5分

### Routes followed

1. **集英社 official readers**, [original volume 1](https://www.shueisha.co.jp/books/reader/main.php?cid=08865439865439315501) and [original volume 3](https://www.shueisha.co.jp/books/reader/main.php?cid=08865566865439315501), publication dates `2007-11-19` and `2009` respectively in the frozen packet, retrieved `2026-08-25`. Both shells returned `200`; the official `sws/apis/bibGetCntntInfo.php?cid=...` endpoints returned `200` JSON and publisher content-server URLs. The API descriptions repeat the intersecting people/scenery frame and do not provide a complete text event transcript in this packet.
2. **集英社 official bunko lead**, [volume 2 description](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-619655-0), published `2016-12-16` for the bunko edition, retrieved `2026-08-25`. It is a different edition and was used only as a content lead; it cannot change the frozen original ISBN.
3. **BookLive original volume 1**, [ISBN-matched product](https://booklive.jp/product/index/title_id/173346/vol_no/001), `datePublished` `2012-05-11`, and [review list](https://booklive.jp/review/list/title_id/173346/vol_no/001), review dates `2011-02-04`–`2025-03-23`, retrieved `2026-08-25`. Reviews repeatedly confirm an ensemble/linked-town-life reading, but do not establish persistent psychological pressure.

### Gap decisions

- `mentalStress=2`: **rejected for now**. Accident/lost work and complicated feelings occur in one anthology strand; the bounded source set does not show sustained pressure across the linked entry ensemble.
- `darkness=0`: **rejected for now**. “Everyday” and intersecting lives do not prove an almost entirely bright tone across volumes 1–3.
- `workplace=1` remains the accepted limited substory Theme. No Narrative axis is inferred from “intersecting lives.”

No final blocker. The edition boundary and Art context issue remain explicit; they are not a text source blocker.

## Position 7 — つらつらわらじ

### Routes followed

1. **講談社 official volume-1 reader**, [exact reader](https://www.kodansha.co.jp/comic/products/0000014069/trial/reader?cid=936f121ea19660bac47d9946dce12bbc601fa0b76c281db4028e19e908f41e2d), publication date `2010-09-22`, retrieved `2026-08-25`. The route redirected back to the product trial shell (`302`); no page text was claimed.
2. **Sony Reader licensed volume 2**, [volume 2 route](https://ebookstore.sony.jp/title/00133690/id/BT000013369000200201/), paper publication `2011-03-23`, retrieved `2026-08-25`; route returned `200` and retained the journey/rumor synopsis.
3. **Rakuten Books volume 3 identity**, [volume 3](https://books.rakuten.co.jp/rb/11364804/), publication date `2011-10-21`, retrieved `2026-08-25`; route returned `200`. It is identity-only and was not used for plot claims.
4. **BookLive volume 1**, [product](https://booklive.jp/product/index/title_id/132077/vol_no/001), `datePublished` `2011-11-18`, and [review list](https://booklive.jp/review/list/title_id/132077/vol_no/001), review dates `2010-10-12`–`2014-05-16`, retrieved `2026-08-25`. Reviews repeatedly describe the procession, lord/retainer human relations, and period-drama structure.

### Gap decisions

- `characterArcWeight=2`: **rejected for now**. Character settings and conflicting motives are present, but the available entry evidence does not establish character change as a repeated primary reward.
- `strategy=2/4`: **rejected**. A spy and a journey constraint are context; no repeated planning/resource-management process was directly observed.
- `mentalStress`, `darkness`, `emotionalWarmth`, and `comedy`: **remain unknown**. Political danger or human conflict alone is not a Tone value.

No final blocker. The one-page Art shortage and remaining text coverage are research states, not hard blockers.

## Position 8 — ふうらい姉妹

### Routes followed

1. **KADOKAWA official volume records**, [volume 2](https://www.kadokawa.co.jp/product/201109000335/), published `2012-01-14`, and [volume 3](https://www.kadokawa.co.jp/product/301309000222/), published `2013-09-14` (electronic page `2013-10-03`), retrieved `2026-08-25`. Both returned `200` and expose official BOOK☆WALKER trial links.
2. **BOOK☆WALKER licensed trials**, [volume 2](https://bookwalker.jp/de5e7dbed3-2109-4593-848e-a6f17af327d2/?adpcnt=g2vvr2xz&utm_source=kadokawa.co.jp&utm_medium=referral&utm_campaign=button&sample=1&from=1) and [volume 3](https://bookwalker.jp/debfd614e0-5596-435d-a519-b3bb490f3e87/?adpcnt=g2vvr2xz&utm_source=kadokawa.co.jp&utm_medium=referral&utm_campaign=button&sample=1&from=1), retrieved `2026-08-25`. The routes resolve to licensed viewer pages; no new text transcription was added.
3. **BookLive volume 1**, [product](https://booklive.jp/product/index/title_id/218479/vol_no/001), `datePublished` `2013-09-20`, and [review list](https://booklive.jp/review/list/title_id/218479/vol_no/001), review dates `2012-07-11`–`2022-02-03`, retrieved `2026-08-25`. Reviews repeatedly describe the two-sister 4-koma as very funny and everyday-focused.

### Gap decisions

- No Theme added. Biological siblinghood is not `foundFamily`; poverty or household setting is not sufficient for a different current Theme.
- `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, and `worldBuilding`: **remain unknown**. Four-panel form, repeated jokes, and a single reviewer’s impression of slight change do not meet any Narrative anchor.
- No new Tone value. Existing comedy/warmth/relationship cells already represent the repeated observations; no additional axis is responsibly supported.

No final blocker. Exact licensed volume 2/3 sample routes exist.

## Position 9 — それでも町は廻っている

### Routes followed

1. **少年画報社 official**, [volume 1](https://www.shonengahosha.co.jp/book_Info.php?id=5944), ISBN `978-4-7859-2604-5`, published `2006-01-02`, and [volume 3](https://www.shonengahosha.co.jp/book_Info.php?id=6146), ISBN `978-4-7859-2827-8`, published `2007-08-03`, retrieved `2026-08-25`. Both returned `200`; the product records expose metadata and authorized-store context but no work-specific internal reader.
2. **BookLive ISBN-matched volume 1**, [product](https://booklive.jp/product/index/title_id/144592/vol_no/001), ISBN `9784785926045`, `datePublished` `2012-02-03`, and [review list](https://booklive.jp/review/list/title_id/144592/vol_no/001), review dates `2012-09-01`–`2023-02-22`, retrieved `2026-08-25`. The product has a browser-trial control (`data-title=144592`, `data-vol=001`); its description and multiple bounded reviews repeat the neighborhood, maid-café comedy, ensemble character interactions, and humanistic/relaxed tone.
3. **Official award comment**, [2009 jury PDF](https://www.mangataisho.com/data/2009/comment090324.pdf), published `2009-03-24`, retrieved `2026-08-25`. It remains a selection/critical source and is not treated as a mystery or Art proof.

### Gap decision

- `emotionalWarmth=2`: **provisional accept, confidence 0.62**. Official volume copy gives a human-centered neighborhood and recurring café setting; multiple independent volume-1 reviews repeat a warm/relaxed ensemble and character-affection observation. Mixed comedy/episodic structure prevents value 4.
- `mysteryReveal` remains unknown. “Aspiring detective” is an identity/aspiration description, not direct clue/reveal reward.
- No new Narrative value is added from the product’s “neighborhood episodes” alone.

No final blocker. The publisher page lacks an embedded reader, but the ISBN-matched licensed retailer route and bounded reviews are available.

## Position 10 — 青空にとおく酒浸り

### Routes followed and source-exhaustion result

1. **Comic Natalie**, [volume/news coverage](https://natalie.mu/comic/news/54668), published `2011-08-11`, retrieved `2026-08-25`, returned `200`.
2. **Manga Taisho official jury PDF**, [2013 comments](https://www.mangataisho.com/data/2013/comment2013.pdf), published `2013`, retrieved `2026-08-25`, returned `200`.
3. **Independent bounded reviews**, [Asahi-net volumes 1–3](https://www.asahi-net.or.jp/~wf9r-tngc/aozoranitooku.html), [ぶるぶろぐ volume 1](https://bulublogpart1.seesaa.net/article/a61263932.html), [天雅日記 early series](https://oretenga2679.hatenablog.com/entry/61864472), [ふさ千明 volume 3](https://husachiaki.blog.shinobi.jp/Entry/1088/), all returned `200` and were retrieved `2026-08-25`. Their publication dates remain as in the first packet: not exposed, `2010-10-10`, `2010-08-01`, and `2010-06-12` respectively.
4. **Exact ISBN retailer searches**, each retrieved `2026-08-25`: [BookLive ISBN 9784199501746](https://booklive.jp/search/keyword/isbn/9784199501746), [BookLive ISBN 9784199501753](https://booklive.jp/search/keyword/isbn/9784199501753), [BookLive ISBN 9784199501814](https://booklive.jp/search/keyword/isbn/9784199501814); [BOOK☆WALKER ISBN 9784199501746](https://bookwalker.jp/search/?word=9784199501746), [vol.2](https://bookwalker.jp/search/?word=9784199501753), [vol.3](https://bookwalker.jp/search/?word=9784199501814); [Sony ISBN 9784199501746](https://ebookstore.sony.jp/search/?keyword=9784199501746), [vol.2](https://ebookstore.sony.jp/search/?keyword=9784199501753), [vol.3](https://ebookstore.sony.jp/search/?keyword=9784199501814); and [Rakuten ISBN 9784199501746](https://books.rakuten.co.jp/search?sitem=9784199501746), [vol.2](https://books.rakuten.co.jp/search?sitem=9784199501753), [vol.3](https://books.rakuten.co.jp/search?sitem=9784199501814). The search pages returned `200` but did not expose an exact item page/title match for the three ISBNs in this run. No false retailer match was created.

### Gap decisions

- No additional known value. The official/news and independent evidence already supports the accepted `scienceFiction`, `comedy`, `combat=1`, `worldBuilding=3`, `comedy=4`, and `darkness=2` candidates from the first packet; this round does not rewrite them.
- `problemSolving=1`: rejected again. Healing/ability effects are mechanics, not direct analytical solution process.
- `mysteryReveal=2`: rejected again. Focus shifts and a hidden premise are not repeated clue/reveal rewards.
- `characterArcWeight=2`, `relationshipStructure=3`, `mentalStress=2`, and `pacing=3`: remain unknown because the recovered sources do not independently meet the corresponding dictionary anchors across entry volumes.
- `SOURCE_INFORMATION_UNAVAILABLE`: **not reproducible**. Six usable content sources remain available; retailer sample absence does not erase them. This is not a blocker authorization.

No final blocker. The exact Tokuma/retailer sample route is unavailable in this run, but content sources are present and residual cells remain evidence gaps.

## Rejected inference ledger

| rejected shortcut | affected positions | reason |
|---|---|---|
| `1話完結` or recurring setting automatically means `pacing=0` | 1 | requires a bounded 1–3-volume change audit, not a tag alone |
| romantic feeling change automatically means `progression=2` | 2 | dictionary progression is growth/acquisition/mastery; relationship movement is not automatic equivalence |
| buddy/case structure automatically means `strategy` | 3, 7 | investigation or political setting is not long-horizon planning/resource management |
| home-search, accident, danger, or conflict automatically means `mentalStress` | 4, 6, 7 | plot burden is distinct from repeated reader-facing psychological pressure |
| violence/powers automatically means `problemSolving` or adult safety risk | 5, 10 | abilities and danger are not analytical solving; violent/crude content is not adult-only by itself |
| biological siblings automatically means `foundFamily` | 8 | dictionary Theme semantics do not permit it |
| “aspiring detective” automatically means `mysteryReveal` | 9 | aspiration is not a clue/reveal reward |
| connected cast automatically means high `relationshipStructure` | 3, 7, 10 | complexity and multi-perspective reward must be directly observed |

## Terminal disposition

- New provisional text claims for Pass C: position 3 `emotionalWarmth=2`; position 4 `darkness=0`; position 5 `mentalStress=2`, `emotionalWarmth=2`; position 9 `emotionalWarmth=2`.
- No terminal CSV was modified. No claim is promotion-approved by this packet.
- Final blockers authorized by this packet: **none**.
- `SOURCE_INFORMATION_UNAVAILABLE` authorized: **none**.
- `FACTOR_MODEL_INCOMPATIBLE` authorized: **none**.
- All ten remain `NO_FINAL_BLOCKER`; remaining coverage gaps must be adjudicated or retained as explicit unknowns, and Art/identity/safety/promotion gates remain separate.
