# Batch 004 text-gap recovery round 3 — positions 1–10

- 조사일: `2026-08-25`
- 조회일: `2026-08-25` (모든 URL)
- 프로젝트: `fromiron/konocomics`
- batch: `batch-004`
- 범위: frozen positions `1–10`, 초반 1–3권 또는 첫 주요 에피소드
- repository HEAD at packet creation: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`
- candidate SHA-256: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`
- terminal text CSV input SHA-256: `fbfd3b4d9039ae66bdcd7778c63dab317094ad2178a2c300f5f7bb0ee8775bfe`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- `reviewedByHuman`: `false`

이 packet은 연구·복구 기록만 추가한다. terminal CSV, Genre, Theme, Art,
source, promotion registry, blocker, overlay, generated catalog는 변경하지 않았다.
이미 기각된 `pacing=0`, 관계 이동만으로 만든 `progression`, 장르·배경만으로 만든
`strategy`·`problemSolving` 제안은 반복하지 않았다. 새 제안은 공식 자료에서
직접 확인되는 사건을 먼저 고정하고, 초반 권 범위를 명시한 서로 다른 리뷰의
구체적 관찰을 보조 근거로 사용했다. 이 문서의 제안은 독립 Pass C 승인을 거쳐야
하며 자동으로 terminal 상태를 바꾸지 않는다.

## 결과 요약

| pos | work | 새 조사 결과 | 새 제안 | 현재 처분 |
|---:|---|---|---|---|
| 1 | `work-025c8ab93483a39c9330` ホストと社畜 | 双葉社 공식 2·3권 설명과 1·2권 독립 리뷰에서 반복 루틴 속 상태 변화 확인 | `pacing=2`, confidence `0.68` | Pass C 필요; blocker 아님 |
| 2 | `work-098b1781e14365eea667` うるわしの宵の月 | 講談社 2·3권 exact reader CID를 재확인했으나 텍스트 추출 불가 | 없음 | 관계 감정 이동을 Narrative로 재분류하지 않음 |
| 3 | `work-0f3a44f5dcab9623d1be` 応天の門 | text gate는 round 2에서 이미 통과 | 없음 | Art 별도 검수로 이관 |
| 4 | `work-11d23966f22f777e95d0` のらみみ | 小学館 1권 reader와 2·3권 product route 재확인 | 없음 | 설정·상담만으로 `problemSolving`을 만들지 않음 |
| 5 | `work-132ce7172750a3b1fa53` ヒナまつり | 2권의 대결 설계가 공식 설명과 두 독립 권별 리뷰에서 반복 확인 | `problemSolving=2`, confidence `0.76` | 이전 단일 countermeasure 기각을 새 반복 근거로 재검토; Pass C 필요 |
| 6 | `work-15dba4fdb46308ab45d7` 駅から5分 | 集英社 원판 1·3권 reader/API 및 리뷰 route 재확인 | 없음 | 연결형 앤솔러지의 감정 추적을 solving으로 확장하지 않음 |
| 7 | `work-188ba092c6195603bb3f` つらつらわらじ | 이동·숙박·시간표·경로 변경의 운영 과정이 2권 독립 리뷰에 구체적으로 기록됨 | `strategy=2`, confidence `0.79` | 이전의 spy/journey-only 기각과 다른 직접 계획 근거; Pass C 필요 |
| 8 | `work-19c2017b33c07f48634e` ふうらい姉妹 | KADOKAWA/BOOK☆WALKER 2·3권 route와 1권 독립 리뷰 재확인 | 없음 | 4-koma 반복을 `pacing=0`으로 되돌리지 않음 |
| 9 | `work-1a6ad6771865b43c8516` それでも町は廻っている | 1권의 실제 수수께끼·추리·해결 에피소드가 두 독립 리뷰에서 특정됨 | `mysteryReveal=2`, confidence `0.84` | 기존 “aspiring detective만으로 부족” 판단을 보강된 사건 근거로 재검토; Pass C 필요 |
| 10 | `work-1cdc6c5cca7c33fafe51` 青空にとおく酒浸り | 기존 press·award·1–3권 리뷰 외 새 exact retailer route 없음 | 없음 | `SOURCE_INFORMATION_UNAVAILABLE`를 다시 열지 않음 |

새 제안 적용 시 text-only coverage는 position 1 `N=1/6`, position 5
`N=3/6`, position 7 `N=4/6`, position 9 `N=3/6`가 된다. 이는 promotion
승인이 아니며 Art·safety·identity gate와 독립이다.

## 신규 제안의 근거

### Position 1 — ホストと社畜 — `pacing=2`

공식 자료가 단순한 작품 태그가 아니라 초반 권 사이의 상태 변화를 직접
보여 준다.

1. **双葉社 공식 PR, volume 2**, [ホストと社畜 第2巻発売記念](https://prtimes.jp/main/html/rd/p/000000700.000014531.html), 발표 `2025-04-10`, 조회 `2026-08-25`. 1–2권의 중심을 같은 오전 5시 식사 루틴으로 고정하면서도, 두 사람의 관계가 그 루틴 안에서 전개되는 작품으로 설명한다. 2권의 공식 reader 진입점은 [webアクション](https://comic-action.com/episode/2550689798603162829)으로 연결된다.
2. **双葉社 공식 PR, volume 3**, [ホストと社畜 3巻発売](https://prtimes.jp/main/html/rd/p/000000821.000014531.html), 발표 `2025-09-25`, 조회 `2026-08-25`. 3권은 아침 식사가 이미 일상이 된 뒤, 운세로 낙담한 蓮을 直人이 격려하고 요리 실패를 蓮이 돕는 상태를 명시한다. “친구도 연인도 아닌 거리”가 유지되지만 1–3권 사이 관계의 기능과 상호작용은 누적된다.
3. **コミックシーモア, volume 1 리뷰**, [작품·리뷰 페이지](https://www.cmoa.jp/title/300198/), 작성일 `2025-04-16` 등, 조회 `2026-08-25`. 서로 다른 리뷰어가 정해진 15분·반복 식사에서 대화가 시작되고, 이후 점차 거리가 가까워지는 과정을 volume 1 범위로 관찰한다.
4. **コミックシーモア, volume 1 리뷰**, 동일 페이지, 작성일 `2026-08-16`, 조회 `2026-08-25`. 별도 리뷰어가 “과거 이야기가 연결되는 부분”과 “대부분 한 화로 정리되지만 관계가 가까워지는 과정”을 구분해 기록한다. 1화 완결 태그를 근거로 `pacing=0`을 만들지 않고, 반복 루틴 안의 누적 변화라는 일반 Arc 값만 제안한다.
5. **読書メーター, volume 1 리뷰**, [ホストと社畜(1)](https://bookmeter.com/books/22005200), 개별 리뷰 작성일 `2025-09-04`–`2025-09-29`, 조회 `2026-08-25`. 서로 다른 독립 리뷰어들이 이름도 모르던 두 사람이 관계를 구성하고, 상호 고민을 나누는 상태 변화와 다음 권으로 이어지는 흐름을 기술한다.

`pacing=2`는 빠른 전개나 큰 목표 전환이 아니다. 공식 2·3권과 복수 리뷰가
확인하는 “고정된 장소에서 관계·상호작용이 한 단계씩 변하는 일반 Arc”에만
해당한다. `progression`은 관계 이동만으로 만들지 않았고, `comedy`·`darkness`
도 이번 근거로 변경하지 않는다.

### Position 5 — ヒナまつり — `problemSolving=2`

round 2에서 “한 번의 countermeasure는 부족하다”고 기각한 것과 달리, 이번에는
공식 2권 설명과 서로 다른 2개 권별 리뷰가 같은 제약-대응 과정을 독립적으로
기록한다.

1. **KADOKAWA 공식 volume 1**, [ヒナまつり 1](https://www.kadokawa.co.jp/product/201103000336/), 종이판 발행 `2011-07-15`, 조회 `2026-08-25`. 강제 동거와 생활 붕괴라는 초기 제약을 명시한다.
2. **KADOKAWA 공식 volume 2**, [ヒナまつり 2](https://www.kadokawa.co.jp/product/301306000980/), 종이판 발행 `2011-11-15`, 조회 `2026-08-25`. 다른 초능력 소녀의 파괴적 추적에 대응하기 위해 新田이 countermeasure를 세우는 2권 상황을 공식적으로 제시한다.
3. **びよとま, volumes 1–5 권별 리뷰**, [ヒナまつり review (1)](https://biyotoma.work/entry/2022/03/13/%E8%B6%85%E8%83%BD%E5%8A%9B%E5%B0%91%E5%A5%B3x%E3%82%A4%E3%83%B3%E3%83%86%E3%83%AA%E3%83%A4%E3%82%AF%E3%82%B6%E3%81%AE%E3%81%BB%E3%81%AE%E3%81%BC%E3%81%AE%E3%82%AE%E3%83%A3%E3%82%B0%E3%83%9E%E3%83%B3%E3%82%AC), 발표 `2022-03-13`, 조회 `2026-08-25`. 1권의 조직 충돌과 2권의 초능력 대결을 분리해 기록하고, 新田이 파괴를 피하려 평화적인 대결 방법을 고안했다고 설명한다.
4. **ゆずの坂, volume 2 권별 리뷰**, [ヒナまつり 2巻 感想](https://hitomishirikaizen.hatenablog.com/entry/hinamaturi_2), 발표 `2018-06-15`, 조회 `2026-08-25`. 2권의 공식 줄거리와 별개로, 新田이 추적과 파괴를 막기 위한 대책을 세우는 구조를 구체적으로 요약한다. 홈리스 생활·학교·대결의 제약도 같은 권 범위에서 기록한다.

두 리뷰는 초능력이 무엇이든 해결한다는 주장이나 단순 폭력 평가가 아니다.
제약(파괴·추적)을 인식하고 대응 방법을 선택하는 반복 가능한 혼합형 과정이므로
`problemSolving=2`를 제안한다. 이것은 `strategy`나 `progression`으로 확장하지
않으며 yakuza·폭력 소재를 adult 판정으로 사용하지 않는다.

### Position 7 — つらつらわらじ — `strategy=2`

이전 packet의 “spy와 여행 배경만으로는 strategy가 아니다”라는 기각 사유를
해소하기 위해, 실제 이동 운영·시간·숙박·경로 조정이 명시된 자료만 사용했다.

1. **講談社 공식 volume 1**, [つらつらわらじ（1）](https://www.kodansha.co.jp/comic/products/0000014069), 발행 `2010-09-22`, 조회 `2026-08-25`. 수백 명 규모의 참근교대 행렬, 정해진 이동, 숙박과 밀정이라는 초기 운영 제약을 직접 제시한다.
2. **コミックシーモア, volume 2 리뷰 — mush**, [つらつらわらじ（2）](https://www.cmoa.jp/title/45802/vol/2/), 작성일 `2020-04-19`, 조회 `2026-08-25`. 숙박지·이동 경로·예정된 일정, 다른 집단과의 조우 때의 조정 및 보고를 구체적으로 관찰한다.
3. **コミックシーモア, volume 2 리뷰 — よしくま**, 동일 volume 2 페이지, 작성일 `2018-01-09`, 조회 `2026-08-25`. 같은 권의 행렬 운영과 다층 인물의 목적·일정 충돌을 별도 독자로 기록한다. 두 리뷰어는 서로 다른 계정이며 동일 문장 복제가 확인되지 않았다.
4. **マンバ, volume 2 review board**, [つらつらわらじ 2](https://manba.co.jp/boards/11640/books/2), 게시 연도 `2011–2012`(개별 날짜는 페이지에서 일관되게 노출되지 않음), 조회 `2026-08-25`. 행렬 분리 후 정해진 시한 내 본대에 합류해야 하는 운영 제약을 보조적으로 확인한다.

이는 장기 전쟁·정치·자원 운영 중심인 `strategy=4`가 아니다. 이동·숙박·보고·
일정 충돌에 대응하는 단기 전술과 계획이 반복된다는 의미의 `strategy=2`만
제안한다.

### Position 9 — それでも町は廻っている — `mysteryReveal=2`

round 2의 “探偵 지망이라는 직업/희망만으로는 부족하다”는 판단을 유지하되,
이번에는 1권의 실제 수수께끼와 추리·해결 에피소드를 서로 다른 리뷰에서
확인했다.

1. **少年画報社 공식 volume 1**, [それでも町は廻っている 1](https://www.shonengahosha.co.jp/book_Info.php?id=5944), 발행 `2006-01-02`, 조회 `2026-08-25`. 시사이드 메이드 카페와 상점가의 일상 무대를 확정한다.
2. **少年画報社 공식 volume 3**, [それでも町は廻っている 3](https://www.shonengahosha.co.jp/book_Info.php?id=6146), 발행 `2007-08-03`, 조회 `2026-08-25`. 歩鳥의 탐정 지향과 상점가 에피소드 범위를 확인하는 identity/content source로 사용했다.
3. **BookLive 공식 편집 리뷰**, [日常系ミステリー？](https://booklive.jp/bkmr/soremachi-review), 발표 `2016-09-29`, 조회 `2026-08-25`. 1권의 유품 그림의 이유와 병원 안뜰의 행동이라는 구체적 일상 사건을 歩鳥가 추리하는 사례를 열거하고, 1권 3화와 11화 사이의 단서 연결도 설명한다.
4. **漫画の虎 독립 리뷰**, [트릭키한 구성과 복선 회수](https://manga-blog.net/soremachi/), 최초 발표 `2018-10-29`, 갱신 `2024-12-01`, 조회 `2026-08-25`. 1권 4화의 그림 수수께끼가 실제로 밝혀지는 에피소드를 특정하고, 단순한 탐정 설정이 아니라 수수께끼-해결 보상으로 서술한다.

두 독립 리뷰가 모두 volume 1의 구체적인 사건과 해결을 특정하고, 공식 1·3권이
작품·주인공·초반 범위를 고정한다. 따라서 `mysteryReveal=2`(일부 비밀·반전과
일상 추리 보상)를 제안한다. 작품 전체가 추리물이라는 `4`나 investigation
Theme의 추가는 제안하지 않는다.

## Exact route 재확인 및 새 값 없음

### Position 2 — うるわしの宵の月

講談社 공식 [volume 2](https://www.kodansha.co.jp/comic/products/0000351649)와 [volume 3](https://www.kodansha.co.jp/comic/products/0000356350)의 `試し読み`가 각각 exact reader CID로 연결되는 것을 재확인했다(페이지·발행 연도는 기존 packet 기록, 조회 `2026-08-25`). 이번 HTTP 경로에서는 provider handoff 이후 본문을 추출할 수 없었다. BookLive/読書メーター의 volume 1 reviews도 확인했지만, 관계 감정의 변화는 기존 `romance`, `characterArcWeight`, `relationshipStructure`에 해당하며 `progression`·`mysteryReveal`로 바꾸지 않았다. blocker 아님.

### Position 4 — のらみみ

小学館 [volume 1 reader](https://e-comi.shogakukan.co.jp/viewer/speedreader?cid=091884110000d0000000)와 공식 [volume 2](https://e-comi.shogakukan.co.jp/books/091884120000d0000000)·[volume 3](https://e-comi.shogakukan.co.jp/books/091884130000d0000000) product route를 재확인했다. BookLive volume 1 [reviews](https://booklive.jp/review/list/title_id/217921/vol_no/001)의 서로 다른 날짜 관찰도 대조했으나, resident의 상담·가정 탐색은 문제를 분석·해결하는 반복 보상으로 충분하지 않았다. `problemSolving`·`progression`을 추가하지 않는다.

### Position 6 — 駅から5分

集英社 원판 [volume 1 reader](https://www.shueisha.co.jp/books/reader/main.php?cid=08865439865439315501), [volume 3 reader](https://www.shueisha.co.jp/books/reader/main.php?cid=08865566865439315501), 그리고 `bibGetCntntInfo.php` content endpoint가 `200`으로 응답하는 것을 재확인했다. Cmoa [review page](https://www.cmoa.jp/title/customer_review/title_id/54553/)와 Rakuten [volume 3](https://books.rakuten.co.jp/rb/6218942/)의 날짜 있는 리뷰는 앤솔러지의 기억·관계 추적과 시간순서 복잡성을 확인하지만, `problemSolving` 또는 `mysteryReveal`로 확장할 직접 사건 근거는 부족하다. 원판/문고판 경계도 유지한다.

### Position 8 — ふうらい姉妹

KADOKAWA [volume 2](https://www.kadokawa.co.jp/product/201109000335/)·[volume 3](https://www.kadokawa.co.jp/product/301309000222/)와 각각 연결된 BOOK☆WALKER licensed trial, BookLive volume 1, 本が好き! [volume 1 review](https://www.honzuki.jp/book/169082/review/230309/)를 재확인했다. 4-koma의 짧은 반복과 자매 개그는 기존 `comedy=4`, `relationshipStructure=2`, `emotionalWarmth=4`로 충분하다. 이전에 기각된 `pacing=0`이나 생물학적 자매를 `foundFamily`로 바꾸는 제안은 반복하지 않는다.

### Position 10 — 青空にとおく酒浸り

Comic Natalie [volume/news](https://natalie.mu/comic/news/54668), Manga Taisho [2013 comment](https://www.mangataisho.com/data/2013/comment2013.pdf), Asahi-net [volumes 1–3 review](https://www.asahi-net.or.jp/~wf9r-tngc/aozoranitooku.html), ぶるぶろぐ [volume 1](https://bulublogpart1.seesaa.net/article/a61263932.html), 天雅日記 [early series](https://oretenga2679.hatenablog.com/entry/61864472), ふさ千明 [volume 3](https://husachiaki.blog.shinobi.jp/Entry/1088/)를 재확인했다. BookLive/BOOK☆WALKER/Sony/Rakuten의 세 frozen ISBN 검색 route도 새 exact item/preview로 해소되지 않았다. 그러나 여섯 개의 내용 source가 살아 있으므로 `SOURCE_INFORMATION_UNAVAILABLE`는 재승인하지 않는다. `problemSolving`, `mysteryReveal`, `characterArcWeight`, `relationshipStructure`, `mentalStress`, `emotionalWarmth`에는 이번 round에서 새 값을 제안하지 않는다.

## Rejected shortcut ledger

| shortcut | position | round 3 처분 |
|---|---:|---|
| 고정된 15분 루틴 또는 1화 완결만으로 `pacing=0` | 1 | 기각 상태 유지. 대신 권 사이의 누적 상호작용을 근거로 보수적 `pacing=2`만 제안 |
| 연애 감정 이동을 `progression`·`mysteryReveal`로 변환 | 2 | 반복하지 않음 |
| resident 설정·상담만으로 `problemSolving` | 4 | 반복하지 않음 |
| 기억·감정 추적을 `problemSolving` 또는 `mysteryReveal`로 확장 | 6 | 반복하지 않음 |
| 4-koma 반복을 `pacing=0`으로 확정 | 8 | 반복하지 않음 |
| 탐정 지망·장르명만으로 `mysteryReveal` | 9 | 실제 1권의 수수께끼-추리-해결 사건이 두 독립 리뷰에서 확인되어 `mysteryReveal=2`로만 새 제안 |
| 초능력 존재를 곧바로 solving으로 변환 | 5 | 단일 countermeasure는 여전히 불충분하나, 공식 2권 + 두 권별 독립 리뷰의 반복된 제약-대응 과정으로 `problemSolving=2`를 새 제안 |

## Terminal disposition

- 신규 연구 제안: position 1 `pacing=2`; position 5 `problemSolving=2`; position 7 `strategy=2`; position 9 `mysteryReveal=2`.
- 독립 Pass C가 각 제안을 `ACCEPT`, `REJECT`, 또는 `UNKNOWN`으로 판정해야 한다.
- Final blocker authorized by this packet: **none**.
- `SOURCE_INFORMATION_UNAVAILABLE` authorized by this packet: **none**.
- Art, safety, identity, representative ISBN, Theme, Genre, promotion status: **unchanged**.
- CSV reverse-substitution target remains the input SHA `fbfd3b4d9039ae66bdcd7778c63dab317094ad2178a2c300f5f7bb0ee8775bfe`; no terminal CSV edit was made.

## Handoff

- Files changed: this research markdown only.
- Files not changed: `adjudication/text-final-chunk-01.csv`, source data, annotation pass, review/adjudication CSV, promotion registry, overlay, generated artifacts.
- User-facing explanation text was not copied from reviews; only bounded observations were paraphrased.
