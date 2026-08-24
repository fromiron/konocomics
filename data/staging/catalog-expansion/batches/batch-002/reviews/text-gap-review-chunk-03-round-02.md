# Batch 002 text coverage gap Pass B — chunk 03, round 02

- batchId: `batch-002`
- sourceChunk: `chunk-03`
- reviewKind: `independent-pass-b-round-02`
- reviewer: `Local Codex subagent`
- reviewedAt: `2026-08-23`
- reviewedByHuman: `false`
- evaluatedRange: 작품별 진입 1~3권 또는 첫 주요 에피소드
- scope: second-search queue 7작품, candidate-known 22축
- decisionBoundary: source, final CSV, Art, identity, safety, eligibility, promotion 상태를 수정하지 않고 후보 Axis와 예상 coverage gate만 판정한다.

## 동결 입력과 독립성

| Input                                               | SHA-256                                                            |
| --------------------------------------------------- | ------------------------------------------------------------------ |
| `research/text-gap-chunk-03-round-02.md`            | `2d8236f39f0bcbe75b87a4092273fc2b28d6b01540db4845c9abff587d9c5d78` |
| `docs/factors/factor-dictionary.md`                 | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/catalog-expansion/01-promotion-method.md`     | `6961436ed7f2b326f11a725b5ac40e4b2148d6b70a62ff5eb977b6b747ba97bd` |
| `annotation-review-adjudication-request.md`         | `ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2` |
| `adjudication/text-chunk-03-round-01.md`            | `1e14d4b211bdc4110be492cd1e7789b7f29c4350cd5881b113b252ac189cfe2a` |
| `adjudication/text-chunk-03-round-02.md`            | `d887cf206138c7885937b6ad36620a93e97d64c65d01ea3836b9c654717d792c` |
| `adjudication/text-gap-queue-chunk-03-round-02.csv` | `b2a51eca7714e94b6e58d21e58e74976f2f6aed7bbeb239a7d189efb0f9d056a` |
| `adjudication/text-final-chunk-03.csv`              | `b224257c6460525d36847279bed65db452fe33973d322776785b2f8545ddd281` |
| `adjudication/genres-final-chunk-03.csv`            | `f3fc7656aa7e3bbce5c860bcf52a5b03a710b2bf358c39d2751d2cb1269654b4` |
| `adjudication/themes-final-chunk-03.csv`            | `67b3ddd5318d8fd609db7b03971854c9b02edb90f9fe868c0ddf4c24dacb9025` |
| `art-review/chunk-03/final-art.csv`                 | `9b1f2084a52526fd8a63a5511f0e97a89343fb1d7052a09e2694eb5200845add` |

후보 값을 먼저 공식 범위, 판본 연결, Dictionary의 0/2/4 앵커에 대조한 뒤 기존 final과 앞선 adjudication을 충돌 점검에만 사용했다. 앞선 모델의 결론이나 gate 통과 여부를 값의 근거로 사용하지 않았다. 보강 패킷의 고유 URL 52개를 검수일에 다시 요청해 `52/52 HTTP 200`을 확인했지만, 접근 가능성 자체는 내용 충분성으로 세지 않았다.

## 검수 규칙

- `ACCEPT`는 제안값과 known 상태를 유지한다. `REVISE`는 known 상태를 유지하되 값을 바꾼다. 근거가 숫자 상태를 책임 있게 닫지 못하면 `UNKNOWN`이다.
- 공식 권 소개와 판본 연결을 먼저 확인했다. 복수 리뷰는 exact-volume의 반복 관찰만 보조로 사용했고 같은 플랫폼의 계정은 한 source family로 계산했다.
- 장르, 선정 목록, 별점, 인기, 위험의 존재, 인물 수만으로 Axis를 정하지 않았다. 특히 관계 구조는 등장인물 수가 아니라 관계망이 보상 구조에서 차지하는 복잡도로 판정했다.
- known `0`은 침묵이 아니라 진입 범위에서 반복되는 대응 방식이 Dictionary의 0 앵커에 직접 맞을 때만 허용했다.
- 현재 값으로 gate가 통과하더라도 불충분한 후보를 채택하지 않았고, gate 실패를 피하려 새 후보를 만들지 않았다.
- identity, safety, 대표 ISBN과 Art 결론은 수정하지 않았다. 새 packet에서 실제 identity 또는 safety 모순은 발견되지 않았다.

## 작품별 독립 판정

### 21. work-5cafd57db6b870a71a05 — 機動警察パトレイバー

#### Source와 판본 범위

- 紀伊國屋書店의 [wide판 1권](https://www.kinokuniya.co.jp/f/dsg-01-9784091247216) `(1995-07; 조회 2026-08-23)` 수록표 `Prolog`, `ザ・ライトスタッフ`, `シャフト！`, `活性因子`는 [원판 1권](https://www.kinokuniya.co.jp/f/dsg-01-9784091221216) `(1988-06; 조회 2026-08-23)`과 [원판 2권](https://www.kinokuniya.co.jp/f/dsg-01-9784091221223) `(1988-09; 조회 2026-08-23)`의 수록표 합과 정확히 일치한다. 이번 텍스트 packet에는 frozen wide판 진입 범위를 위한 기계적 contents bridge가 있다.
- 小学館의 [공식 Prolog](https://www.sunday-webry.com/episode/2550912965415142506) `(2025-03-14; 조회 2026-08-23)`가 조직, Labor 범죄, 노아의 배치와 성장 전제를 고정한다. exact 원판 1~2권을 다룬 [Ameba 기록 1](https://ameblo.jp/s-kishodo/entry-10503707298.html), [Ameba 기록 2](https://ameblo.jp/s-kishodo/entry-10504076769.html) `(각 2010-04-09; 조회 2026-08-23)`와 honto [1권](https://honto.jp/ebook/pd-review_0610179172.html), [2권](https://honto.jp/ebook/pd-review_0635349384.html) `(2017~2024; 조회 2026-08-23)`은 서로 다른 source family로 훈련, 현장 대응, 팀 일상과 기업 측 시험을 보조한다.

| Axis                    | Proposed | Decision | Final | Dictionary 대응                                                                                                                            |
| ----------------------- | -------- | -------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `progression`           | `3`      | `ACCEPT` | `3`   | 선발, 첫 출동, 실패와 훈련, 이후 기술 성공이 이어진다. 서서히 성장하는 `2`보다 보상이 분명하지만 숙련 루프가 전부를 지배하는 `4`는 아니다. |
| `problemSolving`        | `2`      | `ACCEPT` | `2`   | 유인·매복, 지시, 걸기와 직접 기체 대응이 함께 반복돼 지략과 직접 행동 혼합 앵커에 맞는다.                                                  |
| `pacing`                | `3`      | `ACCEPT` | `3`   | 네 수록 단위에서 선발, 부대 형성, 첫 출동, 기업 시험, 새 대원과 훈련으로 상황이 자주 바뀌지만 최대 속도까지는 입증되지 않는다.             |
| `worldBuilding`         | `4`      | `ACCEPT` | `4`   | Babylon Project, Labor 범죄, 경찰 조직 역할, 제조사와 현장 시험 규칙이 반복해 사건의 원인이 된다.                                          |
| `characterArcWeight`    | `3`      | `ACCEPT` | `3`   | 노아의 선발, 현장 판단, 실패와 개선이 사건과 함께 보상된다. 인물극만이 전부인 `4`보다 낮다.                                                |
| `relationshipStructure` | `3`      | `REVISE` | `2`   | 여러 이름과 두 조직이 등장해도 진입부 관계 보상은 노아 중심의 고정 부대와 핵심 조연이다. 복잡한 군상 관계망을 직접 입증하지 못한다.        |
| `comedy`                | `2`      | `ACCEPT` | `2`   | exact-volume 관찰이 위험한 출동 사이의 농담과 느슨한 부대 일상을 반복하지만 상시 핵심 개그는 아니다.                                       |
| `mentalStress`          | `1`      | `ACCEPT` | `1`   | 현장 실패와 강한 훈련이 회차 단위 압박을 만들지만 지속 불안이나 붕괴는 관찰되지 않는다. 거의 없음 `0`과 긴장 혼합 `2` 사이에 둔다.         |
| `emotionalWarmth`       | `2`      | `ACCEPT` | `2`   | 지도, 지원, 부대 친밀감과 관계 심화가 반복되지만 직업 갈등과 위험이 함께 있어 혼합 앵커 `2`다.                                             |

- Genre/Theme: supplemental 후보 없음. 현재 blank Genre와 Theme를 이 Pass B에서 새로 만들지 않는다.
- expectedTextGate: Narrative `3 / 2 / U / 3 / U / 4` = `4/6`; Tone `3 / 2 / 2 / U / 1 / U / 2` = `5/7`; **pass**.
- combinedBlockerCheck: final Art는 `0/4 known`이어서 현재 Art coverage `0`이 `0.3` gate를 통과하지 못한다. 텍스트 pass가 이를 상쇄하지 않는다. Pass C의 `SOURCE_INFORMATION_UNAVAILABLE` 후보이며, 재검토 경로는 이번에 입증된 contents bridge에 맞는 공식 내부 페이지가 실제로 6쪽·2맥락 기준을 충족하는지 다시 확인하는 것이다.

### 22. work-5e20323e014d6d390aaf — あさひなぐ

- 小学館 공식 [1권](https://e-comi.shogakukan.co.jp/books/091837980000d0000000), [2권](https://e-comi.shogakukan.co.jp/books/091838990000d0000000), [3권](https://e-comi.shogakukan.co.jp/books/091841190000d0000000) `(undated; 조회 2026-08-23)`이 초보자의 신체 훈련, 줄넘기 시험, 장비 획득, 합숙과 연습경기를 순서대로 고정한다. [BookLive 3권](https://booklive.jp/review/list/title_id/231378/vol_no/003) `(2012~2025; 조회 2026-08-23)`과 [독립 Rakuten Blog 3권](https://plaza.rakuten.co.jp/litchi912/diary/201202250001/) `(2012-02-25; 조회 2026-08-23)`이 반복 훈련과 지구력 중심 대응을 보조한다.

| Axis             | Proposed | Decision | Final | Dictionary 대응                                                                                                                                       |
| ---------------- | -------- | -------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `problemSolving` | `0`      | `ACCEPT` | `0`   | 장애에 대한 반복 대응이 분석·기발한 해결보다 신체 반복, 지구력과 감정적 결단으로 제시된다. sports Genre가 아니라 exact 1~3권의 실제 대응 방식 근거다. |

- Genre/Theme: 새 후보 없음. 기존 Genre `sports`, Themes `martialArts:2;school:2;sportsCompetition:2`와 충돌하지 않는다.
- expectedTextGate: Narrative `4 / 0 / U / 3 / U / 2` = `4/6`; Tone `4 / 2 / 2 / U / 2 / U / 2` = `5/7`; **pass**.
- blockerCheck: text hard blocker 후보 없음.

### 23. work-5ebbc9bede841d2faf7b — 高台家の人々

- 集英社 S-MANGA [1권](https://www.s-manga.net/items/contents.html?jdcn=08845109845109315501), [2권](https://www.s-manga.net/items/contents.html?jdcn=08845221845109315501), [3권](https://www.s-manga.net/items/contents.html?jdcn=08845341845109315501) `(2013-09-25, 2014-05-23, 2015-01-23; 조회 2026-08-23)`이 텔레파시 공개, 연애 오해, 약혼과 가족 과거의 범위를 고정한다. [Rakuten Blog 1~3권 리뷰](https://plaza.rakuten.co.jp/mangatokurasu/diary/201508010000/) `(2015-08-01)`, [manganista 3권 기사](https://manganista.net/entertainment/8644) `(2024-07-28 갱신)`, [Hatena 3권 리뷰](https://jump-dream-room.hatenablog.com/entry/2016/01/26/003000) `(2016-01-26)` `(모두 조회 2026-08-23)`가 현재 갈등을 바꾸는 가족 과거 공개를 독립 보조한다.

| Axis            | Proposed | Decision | Final | Dictionary 대응                                                                                                                          |
| --------------- | -------- | -------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `mysteryReveal` | `2`      | `ACCEPT` | `2`   | 숨겨진 능력의 공개와 가족 과거의 공개가 진입부에서 두 번 관계 갈등을 바꾼다. 단서 풀이가 주된 보상은 아니므로 일부 비밀·반전 앵커 `2`다. |

- Genre/Theme: 새 후보 없음. 기존 Genres `fantasy;romance`, Theme `workplace:1`과 충돌하지 않는다.
- expectedTextGate: Narrative `U / U / U / 3 / 2 / 2` = `3/6`; Tone `4 / 2 / 4 / U / 2 / 4 / 3` = `6/7`; **fail N+1**.
- blockerCheck: finite second search 뒤에도 필요한 네 번째 Narrative를 책임 있게 확정하지 못했다. Pass C의 `SOURCE_INFORMATION_UNAVAILABLE` 후보이며, 재검토 경로는 exact 1~3권 공식 내부 페이지나 작가·편집 자료가 반복되는 해결 방식·전략 또는 그 적극적 부재를 직접 보여 주는 경우뿐이다. romance·comedy 근거를 재활용해 zero를 만들면 안 된다.

### 24. work-6f849a8e785deee3d5dc — 怪物事変

- 集英社 S-MANGA [1권](https://www.s-manga.net/items/contents.html?isbn=978-4-08-881096-6), [2권](https://www.s-manga.net/items/contents.html?jdcn=08881128881096315501), [3권](https://www.s-manga.net/items/contents.html?jdcn=08881169881096315501) `(2017-03-03, 2017-07-04, 2017-11-02; 조회 2026-08-23)`이 조사 의뢰의 반복을 고정한다. exact 1권과 3권을 다룬 [개인 기록 1](https://kemonozihen1470.com/kansou-netabare-2/) `(2020-10-25)`, [개인 기록 2](https://kemonozihen1470.com/kansou-netabare/) `(2020-11-28)`와 별도 [OREMANGA 3권 기록](https://oremanga.tokyo/?p=11125) `(표시 2021-11-22, metadata 2021-04-17)` `(모두 조회 2026-08-23)`이 간격 추론, 관찰, 카메라, 잠입·함정과 직접 전투의 혼합을 보조한다.

| Axis             | Proposed | Decision | Final | Dictionary 대응                                                                                                                  |
| ---------------- | -------- | -------- | ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| `problemSolving` | `2`      | `ACCEPT` | `2`   | 사실과 간격을 이용한 추론, 감시·잠입·함정과 직접 구조·전투가 서로 다른 exact 권에서 반복돼 지략과 직접 행동 혼합값 `2`에 맞는다. |

- Genre/Theme: 새 후보 없음. 기존 Genres `fantasy;mystery`, Themes `investigation:2;workplace:2`와 충돌하지 않는다.
- expectedTextGate: Narrative `U / 2 / U / 3 / 2 / 3` = `4/6`; Tone `2 / 2 / 2 / 2 / U / U / 2` = `5/7`; **pass**.
- blockerCheck: text hard blocker 후보 없음.

### 25. work-71e824df2e6bc2125294 — SAKAMOTO DAYS

- 集英社 [1권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08882657882657315501), [2권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882685-1), [3권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882763-6) `(2021-04-02, 2021-06-04, 2021-09-03; 조회 2026-08-23)`이 가족·상점 제약과 초기 전투를 고정한다. [ebookjapan의 1권 1·4화와 2권 8화 기사](https://ebookjapan.yahoo.co.jp/special/article/aa0024.html) `(2022-05-26)`, [Animate Times 초기 만화 사례](https://www.animatetimes.com/news/details.php?id=1735175303) `(2025-01-02)`, [exact 1권 독립 리뷰](https://uniquerui.com/tblog/sakamoto-days-1-review/) `(2025-08-30)` `(모두 조회 2026-08-23)`가 무기 분해와 주변 생활용품 재활용을 반복 관찰한다.

| Axis             | Proposed | Decision | Final | Dictionary 대응                                                                                                                                            |
| ---------------- | -------- | -------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `problemSolving` | `3`      | `ACCEPT` | `3`   | 비살상·가족 제약 아래 상황과 주변 물건을 이용하는 해결이 반복되고 직접 전투도 상당하다. 혼합 `2`보다 지략 비중이 높지만 분석이 유일한 보상인 `4`는 아니다. |

- Genre/Theme: 새 후보 없음. 기존 Genre `action`, Themes `combat:2;tournament:1`과 충돌하지 않는다.
- expectedTextGate: Narrative `U / 3 / U / 3 / 1 / 2` = `4/6`; Tone `3 / 2 / 4 / 2 / U / U / 2` = `5/7`; **pass**.
- blockerCheck: text hard blocker 후보 없음.

### 27. work-7d259c925286a9f91310 — 聖☆おにいさん

- 講談社 [1권](https://www.kodansha.co.jp/comic/products/0000013790), [2권](https://www.kodansha.co.jp/comic/products/0000013847), [3권](https://www.kodansha.co.jp/comic/products/0000013911) `(2008-01-23, 2008-07-23, 2009-03-23; 조회 2026-08-23)`과 [ORICON 작가 인터뷰](https://www.oricon.co.jp/special/55607/) `(2020-12-18, 2021-09-17 갱신; 조회 2026-08-23)`가 누적 성장보다 일상 웃음이 반복되는 구조를 고정한다. exact 1~2권의 [Hatena 1](https://nakano-laboratory.hatenablog.com/entry/2014/03/07/220229), [Hatena 2](https://hanhans.hatenablog.com/entry/20080803/p1), [BookLive 1권](https://booklive.jp/review/list/title_id/42530/vol_no/001), [Sony 2권](https://ebookstore.sony.jp/review/title/00128906/id/BT000012890600200201) `(2008~2025; 조회 2026-08-23)`도 독립 완결형 일상 gag를 반복하지만 공통 해결·전략·reveal 방식을 직접 보여 주지는 않는다.

- candidate axis: 없음.
- decision: `UNKNOWN 유지` — `problemSolving`, `strategy`, `mysteryReveal` 어느 축도 공식 범위와 독립 관찰이 숫자를 책임 있게 닫지 못한다. episodic comedy 구조나 관련 언급의 부재를 zero로 바꾸지 않는다.
- Genre/Theme: 새 후보 없음. 기존 Genres `fantasy;comedy;sliceOfLife`, Theme 없음과 충돌하지 않는다.
- expectedTextGate: Narrative `0 / U / U / 1 / U / 2` = `3/6`; Tone `U / 2 / 4 / 0 / 0 / U / 2` = `5/7`; **fail N+1**.
- blockerCheck: finite second search 뒤에도 Narrative 네 번째 축이 없다. Pass C의 `SOURCE_INFORMATION_UNAVAILABLE` 후보이며, 재검토 경로는 exact 1~3권 공식 내부 페이지 또는 작가 설명이 반복 해결·계획·reveal 방식이나 적극적 부재를 직접 확인하는 경우다. comedy Genre로 zero를 만들면 안 된다.

### 30. work-83fc3c4366e51b35b821 — 風と木の詩

#### Source와 판본 범위

- 紀伊國屋書店의 원판 Flower Comics [1권](https://www.kinokuniya.co.jp/f/dsg-01-9784091302212), [2권](https://www.kinokuniya.co.jp/f/dsg-01-9784091302229), [3권](https://www.kinokuniya.co.jp/f/dsg-01-9784091302236) `(1977-04, 1977-06, 1977-07; 조회 2026-08-23)`이 frozen 원판 범위를 직접 고정한다. [작가 공식 작품 페이지](https://k-takemiya.jp/works1.html) `(2026-04-23 갱신; 조회 2026-08-23)`의 첫 주요 에피소드와 exact 원판 1~2권에 귀속된 Bookmeter 관찰, [원판 권차 인용을 명시한 Hatena 비평](https://in-the-sanatorium.hatenablog.com/entry/2018/08/08/120826) `(2018-08-08; 조회 2026-08-23)`만 사용했다. 후대 판본 사건은 사용하지 않았다.

| Axis                    | Proposed | Decision | Final | Dictionary 대응                                                                                                                                 |
| ----------------------- | -------- | -------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `problemSolving`        | `0`      | `ACCEPT` | `0`   | 진입 갈등은 제약 분석보다 정서적 접근, 거부, 시험과 도덕적 대면으로 움직인다. romance Genre가 아니라 첫 주요 에피소드의 실제 대응 방식 근거다.  |
| `pacing`                | `2`      | `ACCEPT` | `2`   | 전학·만남, 반복 접근과 반발, 학교 관계 확대와 비밀 질문이 일반적인 arc 단위로 변한다.                                                           |
| `mysteryReveal`         | `2`      | `ACCEPT` | `2`   | Gilbert 행동의 사정과 Auguste를 둘러싼 비밀이 관계를 바꾸지만 단서 풀이와 공개가 주된 보상은 아니다.                                            |
| `worldBuilding`         | `3`      | `ACCEPT` | `3`   | 기숙학교 제도, 교우·교사 관계, 차별, 성·도덕·종교 규범이 갈등 원인으로 반복된다. 풍부한 역사 체계 자체가 최대 보상인 `4`까지는 입증되지 않는다. |
| `characterArcWeight`    | `4`      | `ACCEPT` | `4`   | Serge가 Gilbert를 이해하려는 동기, Gilbert의 저항과 관계 변화가 첫 주요 에피소드의 중심 보상이다.                                               |
| `relationshipStructure` | `3`      | `REVISE` | `2`   | exact 원판 관찰은 중심 두 인물과 핵심 조연을 지지한다. 작가 총론의 더 넓은 인물 목록만으로 복잡한 군상 관계망 `3`을 진입부에 투영하지 않는다.   |
| `darkness`              | `4`      | `ACCEPT` | `4`   | 작가 공식 opening과 exact 원판 관찰이 미성년 성착취·성적 갈등, 차별과 고립을 지속 중심 조건으로 둔다.                                           |
| `mentalStress`          | `4`      | `ACCEPT` | `4`   | 거부, 정서·성적 시험, 심리 불안정, 고립과 반복 접촉 실패가 첫 주요 에피소드 전반에 지속된다. 객관적 darkness에서 자동 파생하지 않았다.          |
| `romance`               | `4`      | `ACCEPT` | `4`   | 작가 공식 설명이 두 인물의 유대와 사랑의 시작을 opening 전개의 엔진으로 직접 규정한다.                                                          |

- Genre/Theme: supplemental 후보 없음. 현재 blank Genre와 Theme를 이 Pass B에서 새로 만들지 않는다.
- expectedTextGate: Narrative `U / 0 / U / 2 / 2 / 3` = `4/6`; Tone `4 / 2 / U / 4 / 4 / 4 / U` = `5/7`; **pass**.
- safetyBoundary: 미성년 성착취·성적 갈등은 Factor 근거로 정확히 보존하되 adult-only 판매 분류와 동일시하지 않는다. 선행 safety PASS와 모순되는 제품 분류 표시는 새 packet에서 발견되지 않았다.
- combinedBlockerCheck: final Art는 `0/4 known`이어서 현재 Art coverage `0`이 `0.3` gate를 통과하지 못한다. Pass C의 `SOURCE_INFORMATION_UNAVAILABLE` 후보이며, 재검토 경로는 frozen 원판 1~3권과 직접 연결된 공식 내부 페이지가 6쪽·2맥락 기준을 충족하는지 확인하는 것이다.

## 예상 gate와 blocker handoff

Narrative 순서는 `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`, Tone 순서는 `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`다. `U`는 낮은 값이 아닌 명시적 `unknown`이다.

| Pos | workId                      | canonicalTitle       | 검수 반영 Narrative           | 검수 반영 Tone                    | Text gate | Combined blocker candidate                                     |
| --: | --------------------------- | -------------------- | ----------------------------- | --------------------------------- | --------- | -------------------------------------------------------------- |
|  21 | `work-5cafd57db6b870a71a05` | 機動警察パトレイバー | `3 / 2 / U / 3 / U / 4` = 4/6 | `3 / 2 / 2 / U / 1 / U / 2` = 5/7 | pass      | `SOURCE_INFORMATION_UNAVAILABLE` — Art 0/4 known               |
|  22 | `work-5e20323e014d6d390aaf` | あさひなぐ           | `4 / 0 / U / 3 / U / 2` = 4/6 | `4 / 2 / 2 / U / 2 / U / 2` = 5/7 | pass      | none                                                           |
|  23 | `work-5ebbc9bede841d2faf7b` | 高台家の人々         | `U / U / U / 3 / 2 / 2` = 3/6 | `4 / 2 / 4 / U / 2 / 4 / 3` = 6/7 | fail N+1  | `SOURCE_INFORMATION_UNAVAILABLE` — finite text route exhausted |
|  24 | `work-6f849a8e785deee3d5dc` | 怪物事変             | `U / 2 / U / 3 / 2 / 3` = 4/6 | `2 / 2 / 2 / 2 / U / U / 2` = 5/7 | pass      | none                                                           |
|  25 | `work-71e824df2e6bc2125294` | SAKAMOTO DAYS        | `U / 3 / U / 3 / 1 / 2` = 4/6 | `3 / 2 / 4 / 2 / U / U / 2` = 5/7 | pass      | none                                                           |
|  27 | `work-7d259c925286a9f91310` | 聖☆おにいさん        | `0 / U / U / 1 / U / 2` = 3/6 | `U / 2 / 4 / 0 / 0 / U / 2` = 5/7 | fail N+1  | `SOURCE_INFORMATION_UNAVAILABLE` — finite text route exhausted |
|  30 | `work-83fc3c4366e51b35b821` | 風と木の詩           | `U / 0 / U / 2 / 2 / 3` = 4/6 | `4 / 2 / U / 4 / 4 / 4 / U` = 5/7 | pass      | `SOURCE_INFORMATION_UNAVAILABLE` — Art 0/4 known               |

Blocker는 이 Pass B의 후보이며 registry 상태 변경이나 최종 `promotionBlocked` 확정이 아니다. Pass C는 text 실패와 실제 Art coverage 실패를 별도로 기록하고, 각 행의 재검토 경로를 blocker ledger에 보존해야 한다.

## 결과 요약

- reviewedWorks: 7
- candidateKnownWorks: 6
- candidateAxesReviewed: 22
- candidateDecisionAccept: 20
- candidateDecisionRevise: 2
- candidateDecisionReject: 0
- candidateDecisionUnknown: 0
- closedUnknownOnlyWorks: 1
- supplementalGenreCandidatesReviewed: 0
- supplementalThemeCandidatesReviewed: 0
- expectedTextGatePass: 5
- expectedTextGateFail: 2
- expectedCombinedBlockerCandidates: 4
- actualIdentitySafetyIsbnContradictions: 0
- sourceUrlsReachable: 52/52
- canonicalTitleDelimiterCount: 0
- reviewedByHuman: false
