# Batch 005 text-gap recovery — chunk 05, round 3

- 조사일: 2026-08-25
- 범위: frozen positions 41–50, `entry_1_3_volumes`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- current terminal text SHA-256: `9dfacbe4b451243f9de430af1f73537f4a5c79482f1c98d6a78d2d95ce9d8c30`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- reviewer: Luna recovery research; `reviewedByHuman=false`
- status: recovery proposals only; no source CSV, terminal CSV, Genre/Theme CSV, Art, promotion, or eligibility mutation

## Scope and terminal attestation

Round 2의 23개 ACCEPT와 10개 REJECT를 다시 제안하지 않았다. 현재 파일의 실제
바이트와 축 순서를 다시 읽어 아래 공백을 계산했다. 이전 round-2 QA 문서의 일부
게이트 숫자는 현재 terminal SHA와 일치하지 않으므로, 이 문서는 terminal 파일을
우선한다.

| Pos | Work | Current N | Current T | Gate minimum still needed | Remaining candidate cells |
| --: | --- | ---: | ---: | --- | --- |
| 41 | 機械仕掛けの愛 | 2/6 | 4/7 | N+2, T+1 | N: progression/problemSolving/strategy/mysteryReveal; T: relationshipStructure/comedy/romance |
| 42 | 臨死!!江古田ちゃん | 1/6 | 3/7 | N+3, T+2 | N: progression/problemSolving/strategy/mysteryReveal/worldBuilding; T: characterArcWeight/relationshipStructure/darkness/emotionalWarmth |
| 43 | 町でうわさの天狗の子 | 2/6 | 5/7 | N+2 | N: progression/problemSolving/strategy/mysteryReveal |
| 44 | 万福児 | 1/6 | 3/7 | Theme+1, N+3, T+2 | N: progression/problemSolving/strategy/mysteryReveal/worldBuilding; T: characterArcWeight/darkness/mentalStress/romance |
| 45 | スピリットサークル | 3/6 | 5/7 | N+1 | N: progression/problemSolving/strategy |
| 46 | トリリオンゲーム | 4/6 | 4/7 | Genre+1, T+1 | Genre: legal Dictionary tag; N: mysteryReveal/worldBuilding; T: darkness/mentalStress/romance |
| 47 | デッドデッドデーモンズデデデデデストラクション | 3/6 | 5/7 | N+1 | N: progression/problemSolving/strategy; T: comedy/romance |
| 48 | 月に吠えらんねえ | 3/6 | 4/7 | N+1, T+1 | N: progression/problemSolving/strategy; T: comedy/romance/emotionalWarmth |
| 49 | 1/11 じゅういちぶんのいち | 1/6 | 5/7 | N+3 | N: progression/problemSolving/strategy/mysteryReveal/worldBuilding |
| 50 | シュトヘル | 2/6 | 5/7 | N+2 | N: progression/problemSolving/strategy/mysteryReveal |

`unknown`은 낮은 값으로 바꾸지 않았다. 아래 proposal은 독립 검수 전의
제안이며, 자동 평균·다수결로 terminal에 반영하지 않는다.

## Method

1. 기존 official-first packet에서 이미 사용한 축의 근거를 다시 숫자화하지 않았다.
2. 남은 축만 대상으로 출판사·권리자 페이지를 먼저 확인했다.
3. 추가 값을 제안하는 경우, 1–3권을 직접 식별하는 서로 다른 리뷰/비평에서
   반복되는 관찰을 확인했다.
4. 작품의 장르명이나 인상만으로 Axis를 역산하지 않았다. 직접 반복되는
   mechanic이 없으면 `unknown`으로 유지했다.
5. Theme와 Genre는 특히 보수적으로 보았다. `human drama`, `business`,
   `temple`, `family` 같은 분류·배경은 현재 Dictionary ID로 자동 매핑하지 않았다.

## Source ledger

모든 링크는 2026-08-25에 확인했다. 리뷰 원문은 사용자 문구로 복사하지 않고
관찰만 요약했다.

### Position 41 — 機械仕掛けの愛

- `r3-41-review-a`: [BookLive 機械仕掛けの愛 1 reviews](https://booklive.jp/review/list/title_id/205644/vol_no/001), reviewer posts dated 2013-09-21, 2015-03-10, 2017-02-05 and 2022-12-11, retrieved 2026-08-25. Volume-1 page. Independent posts repeatedly identify a one-episode-per-story robot anthology and warm/sad human–robot consequences. This supports the already known `pacing`, `darkness`, `mentalStress`, and `emotionalWarmth`; it does not establish a fixed party, romance, or repeated solving/strategy loop.
- `r3-41-review-b`: [世界の隅っこで読書するパンダ, 機械仕掛けの愛 1・2](https://ameblo.jp/spz43aq9/entry-11956416257.html), published 2014-11-27, retrieved 2026-08-25. Explicitly covers volumes 1–2 and describes 18 short stories, including a teacher robot, a household robot, and a robot group preserving memories. The repeated unit is the independent short story, not a continuing growth or investigation structure.
- `r3-41-review-c`: [マンバ, 機械仕掛けの愛 3](https://manba.co.jp/boards/12819/books/3), publication date not stated on page, volume-3 page, retrieved 2026-08-25. Reader observations describe the same human/robot heartwarming short-story mode and occasional black material. No new bounded Narrative or unreviewed Tone cell is supported.
- Official route rechecked: [小学館 機械仕掛けの愛 1](https://shogakukan-comic.jp/book?isbn=9784091846440), [2](https://shogakukan-comic.jp/book?isbn=9784091853844), [3](https://shogakukan-comic.jp/book?jdcn=091867970000d0000000), publication years 2013–2015, retrieved 2026-08-25. The introductions identify repeated robot occupations and human/robot cases, but do not add a Dictionary-grade solving, strategy, mystery, romance, or fixed-group mechanism.

**Round-3 disposition:** no new numeric proposal. The entry range has direct evidence,
but the remaining cells are not supported by the Dictionary anchors. Keep unknown.

### Position 42 — 臨死!!江古田ちゃん

- `r3-42-review-a`: [honto, 臨死!!江古田ちゃん 1 reviews](https://honto.jp/ebook/pd-review_0625431512.html), volume-1 review page, individual publication dates not shown in the rendered page, retrieved 2026-08-25. The reviews describe the protagonist’s four-panel everyday observation, work/relationship mishaps, and recurring punchline form. They do not provide a repeated mystery, strategy, world-rule, or growth-reward loop.
- `r3-42-review-b`: [レビューン, 臨死!!江古田ちゃん](https://reviewne.jp/contents/1170), published 2017-03-14, retrieved 2026-08-25. The page describes the protagonist’s life and observation style, but does not bind its observations to volumes 1–3; it was used as a route check only, not as Factor Evidence.
- `r3-42-review-c`: [マンガペディア, 臨死!!江古田ちゃん](https://mangapedia.com/臨死！！江古田ちゃん-zbaesucvd), publication date not stated, retrieved 2026-08-25. The encyclopedia describes the protagonist-centered monologue and work/relationship setting, but is not a 1–3 review and cannot supply the missing repeated Narrative cells.
- Official route rechecked: [講談社 臨死!!江古田ちゃん 1](https://www.kodansha.co.jp/comic/products/0000029261), published 2006-04-21, retrieved 2026-08-25. It confirms the rotating jobs and relationship premise, not a fixed party or cumulative plot mechanism.

**Round-3 disposition:** no new proposal. The only newly found whole-work or
volume-1 material repeats the already accepted gag/pressure observations; it does
not meet the missing Narrative/Tone anchors. Keep unknown.

### Position 43 — 町でうわさの天狗の子

- `r3-43-review-a`: [コミックシーモア 町でうわさの天狗の子 1](https://www.cmoa.jp/title/50193/), customer reviews with visible dates including 2024-09-07, retrieved 2026-08-25. The page is a volume-1 product page, but the displayed reviews discuss the completed series and later relationship interpretations; they are not entry-range evidence for a new Narrative cell.
- `r3-43-review-b`: [電子コミックライフ, 町でうわさの天狗の子](https://dcomic-life.com/machideuwasano-tengunoko/), publication date not stated, whole-series summary, retrieved 2026-08-25. It confirms the familiar town/tengu setting and relaxed pace but does not distinguish a repeated problem-solving, strategy, or mystery mechanism in volumes 1–3.
- `r3-43-review-c`: [note, 町でうわさの天狗の子 final-volume review](https://note.com/amanoakimi/n/nc3bd096c2c44), published 2026-03-07, retrieved 2026-08-25. Final-volume material is outside the frozen entry range and was excluded from annotation.
- Official route rechecked: [小学館 1](https://e-comi.shogakukan.co.jp/books/091313930000d0000000), [2](https://e-comi.shogakukan.co.jp/books/091316920000d0000000), [3](https://e-comi.shogakukan.co.jp/books/091322580000d0000000?page=1), retrieved 2026-08-25. The three introductions show school/tengu life, a postponed date, and a seaside date; they do not supply a second Narrative anchor beyond the existing functional setting/pacing.

**Round-3 disposition:** no new proposal. The new material is either whole-series,
outside-range, or repeats the already accepted comedy/warmth/romance evidence.
The two remaining Narrative cells stay unknown.

### Position 44 — 万福児

- `r3-44-review-a`: [Sony Reader Store 万福児 1 reviews](https://ebookstore.sony.jp/review/title/10078681/id/LT000008387000294434), visible reviewer posts dated 2006-06-11 through 2010-06-09, retrieved 2026-08-25. Independent posts repeatedly describe a three-person temple family, low-temperature gag, and occasional warmth. These observations overlap the terminal `relationshipStructure`, `comedy`, and `emotionalWarmth`; they do not establish a listed Theme beyond the literal family/temple setting.
- `r3-44-review-b`: [honto 万福児 series reviews](https://honto.jp/ebook/pdseries-review_06C-20004-BT0000213190.html), review dated 2007-12-11 and additional posts, retrieved 2026-08-25. The review describes the temple family and delayed surreal laughter. It does not show progression, strategy, investigation, or a chosen-family formation mechanic.
- `r3-44-official-sample`: [集英社 万福児 1 sample](https://books.shueisha.co.jp/reader/main.php?cid=08865345865345315501), volume-1 sample route, publication date not shown on sample page, retrieved 2026-08-25. The route was checked for direct entry material; no new listed Theme or Narrative loop was established.
- A [集英社 万福児 4 page](https://books.shueisha.co.jp/items/contents.html?jdcn=08865482865345315501), paper publication 2008-06-19, was found but excluded because it is outside the frozen 1–3 range. Its later chapter title cannot be used to infer entry-range progression.

**Round-3 disposition:** no new proposal. `foundFamily` remains invalid here because
the sources describe the literal temple household, not a chosen-family structure.
No other Dictionary Theme or missing Narrative/Tone anchor is directly supported.

### Position 45 — スピリットサークル

- `r3-45-review-a`: [コミックシーモア スピリットサークル review through volume 3](https://www.cmoa.jp/community/review/good/452774/?ret_url=%2Ftitle%2Fcustomer_review%2Ftitle_id%2F68273%2F%3Fsite_kbn%3D1), published 2015-05-31, retrieved 2026-08-25. The reviewer explicitly reaches volume 3 and observes repeated short past-life segments, delayed understanding, and limited present-day action. This confirms the existing `pacing`, `mysteryReveal`, and `mentalStress`; it argues against adding `progression`, strategy, or problem-solving.
- `r3-45-review-b`: [西住, スピリットサークル 執着と時間](https://note.com/nishizumi/n/n194ccecc374e), published 2023-12-30, whole-series critique, retrieved 2026-08-25. It discusses the completed arc and was not used to infer entry-range values. Its description of eventual resolution cannot be back-projected to the first three volumes.
- Official route rechecked: [少年画報社 1](https://www.shonengahosha.co.jp/book_Info.php?id=7155), [2](https://www.shonengahosha.co.jp/book_Info.php?id=7156), [3](https://www.shonengahosha.co.jp/book_Info.php?id=7157), publication years 2012–2014, retrieved 2026-08-25. Official introductions confirm the repeated past-life mechanism but do not establish a separate growth/strategy/problem-solving loop.

**Round-3 disposition:** no new proposal. The remaining Narrative gap cannot be
filled without relabeling staged revelation as progression, which the Dictionary
does not permit.

### Position 46 — トリリオンゲーム

- `r3-46-official-a`: [小学館eコミックストア トリリオンゲーム 1](https://e-comi.shogakukan.co.jp/books/098610100000d0000000), volume-1 page, retrieved 2026-08-25. The publisher storefront labels the work `ヒューマンドラマ` and places it under 少年・青年マンガ. `ヒューマンドラマ` is not one of the ten legal Genre IDs.
- `r3-46-official-b`: [小学館 AD POCKET マンガIPチャンネル](https://adpocket.shogakukan.co.jp/mangaplanning/detail/74332c78b10e3ee51ac4a3c18ccc15c1b6c9807b3ca609969de5e3c361573dfa/), publication date not stated on page, retrieved 2026-08-25. The rights-holder page calls it a startup/business growth story and labels the planning genre `その他職業・ビジネス`; this is not a legal Genre ID either. It confirms workplace/business Theme material already present.
- `r3-46-official-c`: [TBS original introduction](https://www.tbs.co.jp/trilliongame_tbs/original/), published 2023, retrieved 2026-08-25. The author introduction describes the two-person ambition and humor, but is a drama adaptation page and does not add a legal manga Genre or bounded negative Tone value.
- Official volume routes rechecked: [小学館 1](https://shogakukan-comic.jp/book?isbn=9784098610105), [2](https://shogakukan-comic.jp/book?isbn=9784098611133), [3](https://shogakukan-comic.jp/book?isbn=9784098612284), publication years 2021–2022, retrieved 2026-08-25. They establish startup, investment constraints, contest response, and business expansion, but not mystery/world-building beyond current coverage.

**Round-3 disposition:** no Genre proposal. The available authoritative labels do
not map to `action`, `fantasy`, `historical`, `scienceFiction`, `mystery`, `sports`,
`comedy`, `horror`, `sliceOfLife`, or `romance`. Bright humor and business setbacks
do not safely justify `darkness=0`, `mentalStress=0`, or `romance=0`.

### Position 47 — デッドデッドデーモンズデデデデデストラクション

- `r3-47-review-a`: [このマンガがすごい！WEB, volume-1 guide](https://konomanga.jp/guide/13188-2), published 2014-10-14, retrieved 2026-08-25. Professional volume-1 criticism describes ordinary school conversation and parody placed beside the invasion setting, explicitly treating the tone as unresolved between serious and gag.
- `r3-47-review-b`: [コメからジャガイモ, volume-1 review](https://ameblo.jp/ap-ro-pos/entry-12866496782.html), published 2024-09-09, retrieved 2026-08-25. The reviewer identifies a volume-1 structure of everyday conversation under an alien threat and describes the mismatch as humorous/odd while noting that the action is not yet the entry engine.
- `r3-47-review-c`: [BookLive volume-1 reviews](https://booklive.jp/review/list/title_id/291239/vol_no/001), visible posts dated 2014-12-13 through 2024-03-29, retrieved 2026-08-25. Multiple independent posts repeat the absurd ordinary-life gap and the protagonist pair’s conversational humor. These are volume-1 bounded observations, not popularity or rating evidence.
- Official route rechecked: [小学館 1](https://shogakukan-comic.jp/book?isbn=9784091865007), [2](https://shogakukan-comic.jp/book?isbn=9784091868572), and the existing volume-3 packet, retrieved 2026-08-25. They establish the invasion/school setting and existing Narrative cells.

### Position 48 — 月に吠えらんねえ

- `r3-48-review-a`: [コミックシーモア customer reviews](https://www.cmoa.jp/title/customer_review/title_id/75960/), reviewer post dated 2019-03-05, retrieved 2026-08-25. The reviewer explicitly distinguishes the highly favored 1–3 range and observes the protagonist being worried about and pitied by surrounding characters. This is a concrete, mixed relationship/warmth observation, not a rating signal.
- `r3-48-review-b`: [Sony Reader Store volume-1 reviews](https://ebookstore.sony.jp/review/title/10108925/id/LT000018628000351916/), reviewer posts dated 2014-06-18 through 2014-07-08, retrieved 2026-08-25. The reviewers identify the recurring poet triad and interpret their relationship as affectionate reciprocal concern while also noting the volume’s disturbing material. This supports a level-2 mixed warmth value, not level 4.
- `r3-48-review-c`: [honto volume-1 reviews](https://honto.jp/ebook/pd-review_0626189711.html), posts dated 2015-09-26 and 2018-10-02/17, retrieved 2026-08-25. The page confirms a volume-1 reader’s view of a strange but internally coherent world; it does not independently establish a new Narrative cell.
- Official route rechecked: [講談社 月に吠えらんねえ 1](https://www.kodansha.co.jp/comic/products/0000047330), [3](https://www.kodansha.co.jp/comic/products/0000047407), publication year 2014, retrieved 2026-08-25. The official entries support the existing literary-world and mystery observations.

**Proposal:** `emotionalWarmth=2`, confidence `0.64`, evidence
`r3-48-review-a`, `r3-48-review-b`. The two independent review systems repeat
relationship concern/affection within the entry range, while both retain severe
psychological and dark material. This is a new proposal; the round-2 rejected
`romance=2` is not repeated.

### Position 49 — 1/11 じゅういちぶんのいち

- `r3-49-official-a`: [集英社 series search](https://www.shueisha.co.jp/books/search/search.html?order=1&seriesid=48537), volume 1–3 entries and paper publication years 2010–2012, retrieved 2026-08-25. The page confirms the three volumes and identity but supplies no entry-range plot or mechanism text.
- `r3-49-official-b`: [LINE Manga series listing](https://manga.line.me/book/product_list?product_id=E134516), volume 1–3 listing, publication date not stated on page, retrieved 2026-08-25. Bibliographic route only; no Factor evidence.
- `r3-49-official-c`: [少年ジャンプ＋ search result](https://shonenjumpplus.com/search?q=1%EF%BC%8F11%E3%80%80じゅういちぶんのいち+1), publication date not stated, retrieved 2026-08-25. Official serialization/reading route, but no bounded synopsis supporting progression, problem-solving, strategy, mystery, or world-building.

**Round-3 disposition:** no proposal. The newly confirmed official routes are
bibliographic only. Available reviews in this search pass either repeat the
episodic/personal-drama conclusion already rejected for `progression`, or do not
identify volumes 1–3. Keep all three required Narrative cells unknown.

### Position 50 — シュトヘル

- `r3-50-review-a`: [コミックシーモア customer reviews](https://www.cmoa.jp/title/customer_review/title_id/34443/), reviewer posts including the explicit 1–3 free-reading range, retrieved 2026-08-25. The observations repeat the importance of writing, love, war, and emotional impact; they do not show a separate recurring strategy/problem-solving loop.
- `r3-50-review-b`: [コミックシーモア review through volumes 1–3](https://www.cmoa.jp/community/review/good/2575388/?ret_url=%2Ftitle%2F34443%2F), publication year 2021, retrieved 2026-08-25. It describes the 1–3 entry range as a war/文字 preservation conflict and notes the protective bond. It does not establish the Dictionary’s progression, strategy, mystery, or constraint-solution anchor.
- `r3-50-review-c`: [レビューン シュトヘル](https://reviewne.jp/contents/4760), publication year 2013, retrieved 2026-08-25. The page identifies the historical setting and character purpose, but is not a bounded 1–3 review and was not used to add a value.
- Official route rechecked: [小学館 シュトヘル 1](https://shogakukan-comic.jp/book?jdcn=091825290000d0000000) and [3](https://shogakukan-comic.jp/book?jdcn=091834200000d0000000), publication years 2010–2011, retrieved 2026-08-25. They support the existing combat/time-travel/historical Themes but do not provide a second legal Narrative anchor.

**Round-3 disposition:** no proposal. The protective relationship and writing goal
are already represented by current Tone/Theme values; relabeling them as romance,
strategy, or problem-solving would violate the Dictionary boundaries and repeat
the prior rejection logic.

## Proposal summary for independent adjudication

| Pos | Work ID | New proposal | Confidence | Evidence IDs | Basis |
| --: | --- | --- | ---: | --- | --- |
| 47 | `work-f31a42ea4ad724acefa5` | `comedy=2` | 0.72 | `r3-47-review-a`, `r3-47-review-b`, `r3-47-review-c` | Entry-volume criticism and independent volume-1 reviews repeat parody, conversational humor, and an absurd ordinary-life/invasion mismatch without making comedy the sole genre. |
| 48 | `work-f4bfc29a5e0a9b5148d0` | `emotionalWarmth=2` | 0.64 | `r3-48-review-a`, `r3-48-review-b` | Independent entry-range reviews repeat reciprocal concern/affection while also describing severe and disturbing material; mixed level 2 only. |

No proposal was made for a previously rejected round-2 axis, for Art, or for a
Genre/Theme mapping unsupported by a legal Dictionary ID.

## Exhaustion and blocker boundary

- `SOURCE_INFORMATION_UNAVAILABLE` is not established for any of the ten positions:
  every position has at least one official route and at least two review/critique
  routes or a documented reason the route is outside the frozen range.
- The report identifies potential `FACTOR_MODEL_INCOMPATIBLE` conditions only as
  research findings, not terminal blocker decisions. Position 46 has authoritative
  labels (`ヒューマンドラマ`, `その他職業・ビジネス`) that do not map to the legal
  Genre union; positions with remaining Narrative cells have episodic, relational,
  or setting evidence that does not meet the corresponding repeated-mechanic
  anchors.
- No source CSV, terminal CSV, Genre CSV, Theme CSV, Art CSV, promotion registry,
  or generated catalog was changed.
- Round-3 output requires an independent Daybreak adjudication of the two proposals.
  If both are rejected, the corresponding cells remain `unknown`; no intermediate
  `pending` state is introduced by this packet.
