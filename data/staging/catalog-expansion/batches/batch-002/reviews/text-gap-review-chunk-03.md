# Batch 002 text coverage gap Pass B — chunk 03

- batchId: `batch-002`
- sourceChunk: `chunk-03`
- reviewKind: `independent-pass-b`
- reviewer: `Local Codex subagent`
- reviewedAt: `2026-08-23`
- reviewedByHuman: `false`
- evaluatedRange: 작품별 진입 1~3권 또는 첫 주요 에피소드
- scope: 보충 조사 패킷의 10작품·candidate-known 17축
- decisionBoundary: Factor source, promotion registry, final CSV를 수정하지 않고 각 후보 축의 근거 적합성과 예상 text gate만 판정한다.

## 동결 입력과 독립성

| Input                                            | SHA-256                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `research/text-gap-chunk-03.md`                  | `cd2ecf6cc8ec0055b65232e6e4e663999fd29313bd9b2385a176d054ce4477b6` |
| `docs/factors/factor-dictionary.md`              | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/catalog-expansion/01-promotion-method.md`  | `6961436ed7f2b326f11a725b5ac40e4b2148d6b70a62ff5eb977b6b747ba97bd` |
| `annotation-review-adjudication-request.md`      | `ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2` |
| `adjudication/text-chunk-03-round-01.md`         | `1e14d4b211bdc4110be492cd1e7789b7f29c4350cd5881b113b252ac189cfe2a` |
| `annotation/pass-a-text-chunk-03.csv`            | `89cf6b2b4d9ebb3e62965f13bf75f51eed210f8fb124dd6a32af10a26090e018` |
| `annotation/pass-a-text-chunk-03.md`             | `0e4245dbbb9e31d1b7e080fe50d5d21df328b2fe28e9f1542aa1e3eec272d3da` |
| `reviews/grok-text-review-response-chunk-03.txt` | `3916ba2f6a35c7ad27f6fabd7e95e5e30454ae1cbf90e1a9f27c3f020ee7d0fe` |

17개 후보는 보충 패킷의 공식·편집·정확한 권차 근거를 Factor Dictionary에 먼저 대조해 독립 판정했다. 그 뒤에만 Pass A, Grok 검수, root round-01 자료와 충돌 여부를 비교했다. 앞선 결론의 표결 수나 합의 여부는 값의 근거로 사용하지 않았다.

## 검수 규칙

- `0`은 침묵이나 단순한 장르 인상으로 만들지 않고, 진입 범위 전반에서 해당 특성이 거의 없다는 직접 관찰이 있을 때만 허용했다.
- 공식 출판사·작가 직접 발언·권차 고정 편집 자료를 우선하고, 복수 독립 리뷰는 정확한 독서 범위와 반복 관찰이 확인될 때만 보조로 사용했다.
- 같은 플랫폼의 여러 계정은 독립 작성자이더라도 하나의 source family로 취급했다. 그 family의 관찰만으로 값을 확정하지 않았다.
- 선정 목록 등재, 인기, 판매, 별점, 장르 태그는 Factor Evidence에서 제외했다. 장르에서 Axis를 자동 추론하지 않았다.
- 사건·전투·위험의 존재만으로 `problemSolving`, `strategy`, `darkness`, `mentalStress`를 정하지 않았다. `darkness`와 `mentalStress`는 별도로 판정했다.
- 후보를 지지하지 못한 축은 낮은 값이 아니라 `unknown`으로 닫는다. 이번 문서의 `unknown` 집계는 17개 후보 중 판정 결과이며, 기존의 다른 closed-unknown 축 수와 다르다.
- identity, safety, representative ISBN은 별도 판정 결과를 재개하지 않았다. 보충 근거에서 실제 모순이 발견될 때만 보고한다.
- 리뷰 문구는 사용자 설명으로 복사하지 않는다. 이 문서는 contribution 기반 설명 엔진의 입력 문구를 생성하지 않는다.

## 작품별 독립 판정

### 21. work-5cafd57db6b870a71a05 — 機動警察パトレイバー

- candidate axis: 없음.
- reviewDecision: `UNKNOWN 유지`.
- directEvidenceLinkage: 小学館 표준판 1~3권 공식 소개와 frozen wide판의 수록 범위를 잇는 contents bridge가 없다. 서로 다른 페이지 수와 판형만 확인되므로 표준판 관찰을 대표 wide판 진입부에 투영하지 않는다.
- independentReviewRule: `PASS` — 판본 불명 범위에서 값 생성을 거부했고, provenance나 장르를 사용하지 않았다.
- expectedTextGate: Narrative `0/6`, Tone `0/7`; `fail N+4 T+5`.
- blockerCheck: 새 hard blocker 없음. 이는 text Evidence 범위 한계다.

### 22. work-5e20323e014d6d390aaf — あさひなぐ

#### comedy=2 — ACCEPT

- directEvidenceLinkage: [小学館 3권 공식 소개](https://e-comi.shogakukan.co.jp/books/091841190000d0000000) `(undated; 조회 2026-08-23)`가 교내 릴레이와 합숙이라는 서로 다른 진입 맥락을 고정한다. [BookLive 3권 리뷰](https://booklive.jp/review/list/title_id/231378/vol_no/003) `(2013-04-20, 2013-04-28, 2025-01-04; 조회 2026-08-23)`의 복수 계정과 [독립 楽天ブログ 3권 리뷰](https://plaza.rakuten.co.jp/litchi912/diary/201202250001/) `(2012-02-25; 조회 2026-08-23)`가 두 맥락에서 웃음이 반복된다고 구체적으로 일치한다.
- valueCheck: 코미디가 성장·훈련 중심 구조 사이에 반복되지만 작품의 상시 핵심이라는 근거는 아니므로 Dictionary의 혼합 앵커 `2`가 맞다.
- independentReviewRule: `PASS` — 정확한 3권, 공식 범위 우선, 두 source family의 보조 관찰이며 sports Genre에서 값을 추론하지 않았다.

- expectedTextGate: Narrative `3/6`, Tone `5/7`; `fail N+1`.
- blockerCheck: 새 hard blocker 없음.

### 23. work-5ebbc9bede841d2faf7b — 高台家の人々

#### comedy=4 — ACCEPT

- directEvidenceLinkage: [集英社 1권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08845109845109315501), [2권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08845221845109315501), [3권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08845341845109315501) `(2013-09-25, 2014-05-23, 2015-01-23; 조회 2026-08-23)`가 공상 장치와 관계 소동의 3권 연속 반복을 고정한다. [BookLive 1권](https://booklive.jp/review/list/title_id/237803/vol_no/001) `(2021-06-27~2022-03-07; 조회 2026-08-23)`과 [コミックシーモア 1~2권](https://www.cmoa.jp/title/69814/) `(2022-03-08; 조회 2026-08-23)`의 독립 플랫폼 관찰이 공상 장면의 지속적 웃음에 일치한다.
- valueCheck: 공식 장르명 자체가 아니라 반복 장치와 exact-range 관찰이 웃음을 상시 핵심 보상으로 입증하므로 `4`다.
- independentReviewRule: `PASS` — 공식 자료와 두 플랫폼의 범위 명시 리뷰를 결합했고 장르 자동추론을 하지 않았다.

#### emotionalWarmth=3 — ACCEPT

- directEvidenceLinkage: 같은 集英社 1~3권 공식 소개가 남성 주인공의 수용과 가족 관계 확장을 고정하고, BookLive 편집 소개 및 두 독립 플랫폼의 진입부 리뷰가 관계에서 오는 편안함·따뜻함을 반복 관찰한다.
- valueCheck: 수용과 유대가 지속 보상이지만 가족의 폐쇄성·반대와 로맨스 갈등도 함께 작동한다. `2`와 핵심 앵커 `4` 사이의 `3`이 과대 centrality를 피한다.
- independentReviewRule: `PASS` — laughter를 warmth로 자동 전환하지 않고, 공식 관계 변화와 직접 대응하는 관찰만 사용했다.

- expectedTextGate: Narrative `2/6`, Tone `6/7`; `fail N+2`.
- blockerCheck: 새 hard blocker 없음.

### 24. work-6f849a8e785deee3d5dc — 怪物事変

#### comedy=2 — ACCEPT

- directEvidenceLinkage: [集英社 1권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-881096-6), [2권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08881128881096315501), [3권](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08881169881096315501) `(2017-03-03, 2017-07-04, 2017-11-02; 조회 2026-08-23)`가 탐정 사무소의 동료 일상과 여러 사건을 고정한다. [BookLive 1권](https://booklive.jp/review/list/title_id/424858/vol_no/001) `(2020-07-12~2021-10-29; 조회 2026-08-23)`의 편집 소개와 복수 계정이 serious 사건 사이의 작은 웃음과 동료 일상을 반복 관찰한다.
- valueCheck: 웃음이 사건 사이에 존재하지만 상시 핵심은 아니므로 `2`다.
- independentReviewRule: `PASS` — 같은 플랫폼 계정은 한 family의 보조 관찰로만 사용했고, fantasy나 mystery Genre에서 comedy를 추론하지 않았다.

#### emotionalWarmth=2 — ACCEPT

- directEvidenceLinkage: 공식 1권의 배척받던 주인공이 탐정 사무소에 받아들여지는 구조와 BookLive 편집 소개의 보호 관계가 직접 대응한다. 같은 정확한 1권의 서로 다른 계정도 동료의 친절과 수용을 반복 관찰한다.
- valueCheck: 유대와 보호가 있으나 위험한 사건과 배척 경험이 병존하므로 혼합 앵커 `2`다.
- independentReviewRule: `PASS` — 웃음이나 팀 Genre를 warmth로 바꾸지 않고 공식 수용 구조를 우선했다. 범위가 불명확한 コミックシーモア 관찰은 값에 사용하지 않았다.

- expectedTextGate: Narrative `3/6`, Tone `5/7`; `fail N+1`.
- blockerCheck: 새 hard blocker 없음.

### 25. work-71e824df2e6bc2125294 — SAKAMOTO DAYS

#### comedy=4 — ACCEPT

- directEvidenceLinkage: [週刊少年ジャンプ 공식 연재 페이지](https://www.shonenjump.com/j/rensai/sakamoto/) `(undated; 조회 2026-08-23)`와 集英社 1~3권 `(2021-04-02~2021-09-03; 조회 2026-08-23)`이 가족·가게 일상과 전투의 반복 결합을 고정한다. [ebookjapan 편집 기사](https://ebookjapan.yahoo.co.jp/special/article/aa0024.html) `(2022-05-26; 조회 2026-08-23)`가 1권 1·4화와 2권 8화의 반복 사례를 연결하고, [BookLive 1권](https://booklive.jp/review/list/title_id/919339/vol_no/001) `(2024-06-15~2025-02-15; 조회 2026-08-23)`의 복수 계정도 같은 일상·전투 간극의 웃음을 보조한다.
- valueCheck: 공식 자료와 권·화 고정 편집 자료가 코미디를 액션과 나란한 상시 축으로 입증하므로 `4`다. 액션 장르에서 역추론한 값이 아니다.
- independentReviewRule: `PASS` — 공식 우선, 전자서점 편집 자료와 범위 명시 리뷰는 보조로만 사용했다.

- expectedTextGate: Narrative `3/6`, Tone `5/7`; `fail N+1`.
- blockerCheck: 새 hard blocker 없음.

### 26. work-7975d62582a89492a35f — 図書館の大魔術師

#### problemSolving=3 — ACCEPT

- directEvidenceLinkage: [講談社 3권 공식 소개](https://www.kodansha.co.jp/comic/products/0000323947) `(2019-08-07; 조회 2026-08-23)`가 중앙도서관 사서 시험의 팀 실기를 주요 에피소드로 고정한다. 정확한 3권을 다룬 [あるいは 逃げられぬ何か](https://aruiha.hatenablog.jp/entry/Comic/TosyokannnoDaimajyutsushi/3) `(2019-08-26)`, [ごま書房](https://gomashelf.com/magusofthelibrary-3kan/) `(2019-08-07; 2026-06-23 갱신)`, [凍った中華まん](https://saavedra.hatenablog.com/entry/2019/10/18/202856) `(2019-10-18)` `(모두 조회 2026-08-23)`가 제약 확인, 자료·도구 사용, 단서 탐색, 질문, 역할 조정이라는 해결 절차에 독립적으로 일치한다.
- valueCheck: 분석과 직접 행동이 결합되고 해결 절차가 한 주요 권의 중심이지만 작품 전체의 유일한 핵심 보상까지는 입증되지 않았다. 따라서 `2`와 `4` 사이 `3`이 맞다.
- independentReviewRule: `PASS` — official 3권이 에피소드를 고정하며, 세 리뷰는 호불호가 아니라 관찰 가능한 절차만 보조한다. 시험 Genre나 팀 구성만으로 값을 만들지 않았다.

- expectedTextGate: Narrative `4/6`, Tone `5/7`; `pass`.
- blockerCheck: 새 hard blocker 없음.

### 27. work-7d259c925286a9f91310 — 聖☆おにいさん

#### progression=0 — ACCEPT

- directEvidenceLinkage: 講談社 1~3권 공식 소개 `(2008-01-23, 2008-07-23, 2009-03-23; 조회 2026-08-23)`가 성취·숙련의 누적 대신 같은 휴가·동거 일상 구조를 세 권에 걸쳐 반복한다. [ORICON NEWS 작가 인터뷰](https://www.oricon.co.jp/special/55607/) `(2020-12-18; 2021-09-17 갱신; 조회 2026-08-23)`에서 작가가 이 작품은 인물 성장을 다루지 않는 지속 구조라고 직접 설명한다.
- zeroCheck: 공식 1~3권의 반복 구조와 작가의 명시적 제작 원칙이 함께 성장 보상 구조의 부재를 직접 다룬다. 단순히 변화가 요약에 없다는 침묵이 아니므로 known `0` 문턱을 넘는다.
- independentReviewRule: `PASS` — comedy나 slice-of-life Genre에서 progression을 추론하지 않았고, 후대 인터뷰는 공식 1~3권 구조와 일치하는 제작 원칙에만 제한했다.

#### comedy=4 — ACCEPT

- directEvidenceLinkage: 講談社 1~3권 공식 소개가 쇼핑·인터넷·외출·여행·방문객을 다루는 반복 일상 에피소드를 고정한다. ORICON 작가 인터뷰는 일상에서 이어지는 웃음을 제작 원칙으로 설명한다. [キリスト新聞社 3권 서평](https://www.kirishin.com/book/13947/) `(페이지 메타데이터 2009-02-15; 2018-06-21 갱신; 조회 2026-08-23)`과 [BookLive 1권](https://booklive.jp/review/list/title_id/42530/vol_no/001) `(2020-07-25, 2022-01-02, 2022-09-13; 조회 2026-08-23)`도 정확한 진입 권에서 지속적 웃음을 관찰한다.
- valueCheck: 강한 한 방의 빈도가 아니라 웃음이 작품의 지속 핵심 보상인지가 Dictionary 기준이다. 공식 구조와 작가 발언이 상시 핵심을 지지하므로 `4`다.
- independentReviewRule: `PASS` — comedy Genre 표기를 값으로 사용하지 않았고, 작가 직접 발언과 exact-volume 자료를 우선했다.

#### darkness=0 — ACCEPT

- directEvidenceLinkage: 講談社의 1~~3권 공식 소개 전체가 휴가 중 동거, 쇼핑, 계절 외출, 여행, 방문객이라는 밝고 가벼운 반복 범위를 고정한다. 독립 전문 매체의 정확한 3권 서평과 BookLive의 정확한 1권 및 1~~2권 독서 계정이 같은 범위를 느슨하고 평온한 일상으로 교차 확인한다. 이 조합은 진입 1~3권을 빠짐없이 덮는다.
- zeroCheck: 비극 키워드가 요약에 없다는 이유가 아니라, 세 권 연속 공식 에피소드 구조와 exact-range 교차 관찰이 잔혹·암울·비극 중심 보상의 부재를 직접 지지한다. 종교 소재나 comedy 값을 근거로 삼지 않았다.
- independentReviewRule: `PASS` — presence-sensitive `0`을 별도 판정했고, 전문 매체 날짜 이상은 원문 패킷의 limitation으로 유지했다.

#### mentalStress=0 — ACCEPT

- directEvidenceLinkage: 같은 공식 1~~3권 범위는 지속 불안·압박이 아니라 휴가와 일상 소동을 반복한다. BookLive의 범위 명시 복수 계정은 1권 및 1~~2권의 갈등이 낮고 평온한 체감을 반복 관찰하며, 정확한 3권 전문 서평도 느슨한 휴가·여행 구조를 확인한다.
- zeroCheck: `darkness=0`이나 comedy에서 자동 파생하지 않았다. 진입 1~3권 전 범위에 걸친 공식 구조와 독립 exact-range 관찰이 지속적 심리 압박의 거의 없음에 직접 대응하므로 known `0`을 허용한다. 위험이나 비극의 부재와 인물 체감 압박을 분리해 확인했다.
- independentReviewRule: `PASS` — 복수 리뷰는 보조이며, 공식 범위와 충돌하지 않는 low-conflict 관찰만 사용했다.

- expectedTextGate: Narrative `3/6`, Tone `5/7`; `fail N+1`.
- blockerCheck: 새 hard blocker 없음.

### 28. work-8147aefccc365b0ecb4d — 黒執事

#### problemSolving=3 — ACCEPT

- directEvidenceLinkage: [SQUARE ENIX 2권](https://magazine.jp.square-enix.com/top/comics/detail/9784757520639/) `(2007-07-27)`과 [3권](https://magazine.jp.square-enix.com/top/comics/detail/9784757521926/) `(2007-12-18)` `(조회 2026-08-23)`이 연쇄 살인 조사 에피소드를 고정한다. [アニメイトタイムズ 원작 해설](https://www.animatetimes.com/news/details.php?id=1624006606) `(2021-06-19; 조회 2026-08-23)`은 원작 2권 6화~3권 13화에서 시신 특징과 지식으로 용의자를 좁히고 변장·잠입·포획으로 이어지는 절차를 특정한다. [honto 2권 리뷰](https://honto.jp/ebook/pd-review_0634949910.html) `(2021-01-10; 조회 2026-08-23)`도 같은 조사 방법을 보조한다.
- valueCheck: 분석과 직접 행동이 반복되고 한 주요 arc의 중심이지만 작품 전체가 제약 해결만을 핵심으로 한다는 근거는 아니므로 `3`이다.
- independentReviewRule: `PASS` — 사건 존재가 아니라 권·화 단위 방법을 사용했고, 애니메이션 영상이나 mystery Genre에서 추론하지 않았다.

#### comedy=2 — ACCEPT

- directEvidenceLinkage: アニメイトタイムズ의 정확한 원작 권·화 해설이 살인·배신 arc 사이 하인들의 소동을 구분한다. [BookLive 2권](https://booklive.jp/review/list/title_id/884183/vol_no/002) `(2009-10-07, 2021-01-16)`과 [3권](https://booklive.jp/review/list/title_id/884183/vol_no/003) `(2009-10-04, 2021-01-11)` `(조회 2026-08-23)`의 복수 계정도 권을 넘어 작은 웃음이 반복된다고 관찰한다.
- valueCheck: 웃음은 반복되지만 사건·복수 중심 arc의 사이에 놓이므로 상시 핵심 `4`가 아닌 혼합 앵커 `2`다.
- independentReviewRule: `PASS` — 편집 원작 해설을 우선하고 같은 플랫폼 리뷰 family는 보조로만 사용했다.

#### mentalStress=2 — ACCEPT

- directEvidenceLinkage: SQUARE ENIX 2~3권의 연쇄 살인 범위와 アニメイトタイムズ의 정확한 원작 해설이 조사 실패 위험, 배신, 살인, 상실이 이어지는 압박 범위를 고정한다. BookLive 2권과 3권의 서로 다른 계정이 같은 범위의 긴장과 답답함·슬픔을 반복 관찰한다.
- valueCheck: 단일 살인 사건이나 독자 충격만으로 정하지 않았다. 공식·편집 자료가 두 권에 걸친 지속 압박 맥락을 먼저 고정하고 범위 명시 리뷰가 체감을 보조한다. 코미디 완충과 주인공의 기능적 대응이 있어 지속 붕괴 `4`가 아닌 혼합 앵커 `2`다.
- independentReviewRule: `PASS` — `darkness=2`에서 자동 파생하지 않았고, 사건의 객관적 비극과 체감 압박을 분리한 뒤 exact-volume 관찰로 연결했다.

- expectedTextGate: Narrative `4/6`, Tone `5/7`; `pass`.
- blockerCheck: 새 hard blocker 없음.

### 29. work-838a6f0ad2d1ef487588 — 信長協奏曲

#### strategy=2 — ACCEPT

- directEvidenceLinkage: [小学館 1권](https://e-comi.shogakukan.co.jp/books/091221000000d0000000), [2권](https://e-comi.shogakukan.co.jp/books/091222250000d0000000), [3권](https://e-comi.shogakukan.co.jp/books/091225470000d0000000) `(undated; 조회 2026-08-23)`이 전투와 세력 운영에 직면하는 진입 범위를 고정한다. [BookLive 3권](https://booklive.jp/review/list/title_id/183297/vol_no/003) `(2012-06-05, 2020-07-13, 2022-09-13; 조회 2026-08-23)`의 복수 계정이 정책, 짧은 계획, 유연한 아이디어를 반복 관찰하고, [honto 3권](https://honto.jp/ebook/pd_34956228.html) `(2012-02-13; 조회 2026-08-23)`이 같은 범위의 전투·영지 대응을 독립 보조한다.
- valueCheck: 전술·단기 계획은 존재하지만 주인공의 즉흥성과 유연 대응이 강하며 장기 대전략이 진입부 핵심이라는 근거는 없다. Dictionary 경계 사례와 일치하는 `2`다.
- independentReviewRule: `PASS` — historical·war Genre나 정책 키워드만으로 추론하지 않고 exact-volume의 실제 대응 관찰을 요구했다.

#### comedy=2 — ACCEPT

- directEvidenceLinkage: [BookLive 1권](https://booklive.jp/review/list/title_id/183297/vol_no/001) `(2012-05-12, 2020-07-13, 2022-09-13)`과 3권의 서로 다른 계정이 시대 차이와 느긋한 대응에서 작은 웃음이 반복된다고 관찰한다. 小学館 공식 1~3권은 그 관찰이 귀속되는 신분 대체·전투·세력 범위를 고정한다.
- valueCheck: 웃음은 권을 넘어 반복되지만 역사·전투 전개와 혼합되므로 `2`다.
- independentReviewRule: `PASS` — 같은 플랫폼은 한 family로 취급했고, 공식 범위 없이는 리뷰만으로 확정하지 않았다.

#### mentalStress=1 — ACCEPT

- directEvidenceLinkage: 小学館 공식 1~3권이 잠입·전투의 실제 위험을 확인한다. BookLive의 정확한 1권·3권 계정과 독립 honto 3권 계정은 그런 위험 속에서도 주인공이 지속 불안이나 붕괴보다 느긋하고 빠르게 대응한다고 반복 관찰한다.
- valueCheck: 압박이 완전히 없는 `0`은 위험과 긴장 때문에 맞지 않고, 긴장·답답함이 균형 있게 혼합되는 `2`보다 낮다. 따라서 두 앵커 사이 `1`이다.
- independentReviewRule: `PASS` — 전쟁 Genre에서 높은 값을 만들지 않았고, 위험의 존재와 주인공 체감 압박을 분리했다.

- expectedTextGate: Narrative `4/6`, Tone `5/7`; `pass`.
- blockerCheck: 새 hard blocker 없음.

### 30. work-83fc3c4366e51b35b821 — 風と木の詩

- candidate axis: 없음.
- reviewDecision: `UNKNOWN 유지`.
- directEvidenceLinkage: frozen 小学館 원판 1권 서지, 白泉社 후대 문고판 1~3권 서지, 작가 공식 총론 사이에 수록 범위를 잇는 contents bridge가 없다. 후대 문고판 사건이나 작품 전체 회고를 대표 원판 진입부에 배치하지 않는다.
- independentReviewRule: `PASS` — 민감한 전체작 정보와 후대 판본을 자동 투영하지 않았고, 값 생성을 거부했다.
- expectedTextGate: Narrative `0/6`, Tone `0/7`; `fail N+4 T+5`.
- blockerCheck: 새 hard blocker 없음. 판본 bridge 부재는 이 패스의 text Evidence 한계이며, 별도 identity·safety 판정을 재개하지 않는다.

## 예상 text gate

Narrative 순서는 `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`, Tone 순서는 `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`다. `U`는 명시적 `unknown`이다.

| Pos | workId                      | canonicalTitle       | 검수 반영 Narrative           | 검수 반영 Tone                    | Gate         |
| --: | --------------------------- | -------------------- | ----------------------------- | --------------------------------- | ------------ |
|  21 | `work-5cafd57db6b870a71a05` | 機動警察パトレイバー | `U / U / U / U / U / U` = 0/6 | `U / U / U / U / U / U / U` = 0/7 | fail N+4 T+5 |
|  22 | `work-5e20323e014d6d390aaf` | あさひなぐ           | `4 / U / U / 3 / U / 2` = 3/6 | `4 / 2 / 2 / U / 2 / U / 2` = 5/7 | fail N+1     |
|  23 | `work-5ebbc9bede841d2faf7b` | 高台家の人々         | `U / U / U / 3 / U / 2` = 2/6 | `4 / 2 / 4 / U / 2 / 4 / 3` = 6/7 | fail N+2     |
|  24 | `work-6f849a8e785deee3d5dc` | 怪物事変             | `U / U / U / 3 / 2 / 3` = 3/6 | `2 / 2 / 2 / 2 / U / U / 2` = 5/7 | fail N+1     |
|  25 | `work-71e824df2e6bc2125294` | SAKAMOTO DAYS        | `U / U / U / 3 / 1 / 2` = 3/6 | `3 / 2 / 4 / 2 / U / U / 2` = 5/7 | fail N+1     |
|  26 | `work-7975d62582a89492a35f` | 図書館の大魔術師     | `4 / 3 / U / 3 / U / 4` = 4/6 | `4 / 2 / U / 2 / 2 / U / 2` = 5/7 | pass         |
|  27 | `work-7d259c925286a9f91310` | 聖☆おにいさん        | `0 / U / U / 1 / U / 2` = 3/6 | `U / 2 / 4 / 0 / 0 / U / 2` = 5/7 | fail N+1     |
|  28 | `work-8147aefccc365b0ecb4d` | 黒執事               | `U / 3 / U / 3 / 2 / 2` = 4/6 | `2 / 2 / 2 / 2 / 2 / U / U` = 5/7 | pass         |
|  29 | `work-838a6f0ad2d1ef487588` | 信長協奏曲           | `U / U / 2 / 4 / 2 / 3` = 4/6 | `3 / 2 / 2 / 2 / 1 / U / U` = 5/7 | pass         |
|  30 | `work-83fc3c4366e51b35b821` | 風と木の詩           | `U / U / U / U / U / U` = 0/6 | `U / U / U / U / U / U / U` = 0/7 | fail N+4 T+5 |

## 결과 요약

- reviewedWorks: 10
- candidateKnownWorks: 8
- candidateAxesReviewed: 17
- candidateDecisionAccept: 17
- candidateDecisionRevise: 0
- candidateDecisionReject: 0
- candidateDecisionUnknown: 0
- closedUnknownOnlyWorks: 2
- expectedTextGatePass: 3
- expectedTextGateFail: 7
- expectedHardBlockers: 0
- actualIdentitySafetyIsbnContradictions: 0
- canonicalTitleDelimiterCount: 0
- independentReviewRuleViolations: 0
- reviewedByHuman: false

이번 Pass B는 17개 후보가 모두 Dictionary 값과 직접 대응 근거를 충족한다고 판정했다. 이는 앞선 모델 결론과의 다수결이 아니라 공식 범위, 판본 일치, source authority, exact-volume 보조 관찰을 각 축에 다시 대조한 결과다. 특히 聖☆おにいさん의 세 `0` 후보는 각각 성장 보상 부재, 비극 중심성 부재, 심리 압박 부재를 별도로 증명하는 진입 범위 근거가 있어 채택했으며 서로에게서 값을 파생하지 않았다.
