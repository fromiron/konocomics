# Batch 002 text coverage gap research — chunk 04

- batchId: batch-002
- sourceChunk: chunk-04
- scope: round-01 coverage gap 10작품
- evaluatedRange: 작품별 진입 1~3권 또는 첫 주요 에피소드
- accessedDate: 2026-08-23
- reviewedByHuman: false
- outputKind: supplemental-evidence-packet
- decisionBoundary: 이 문서는 candidate-known 또는 closed-unknown을 제안하는 연구 패킷이다. 독립 검수, adjudication, source 반영, promotion 판정은 수행하지 않는다.
- identityBoundary: `屍鬼`의 identity와 대표 ISBN은 선행 adjudication의 resolved 상태를 그대로 유지했고 다시 조사하거나 열지 않았다.

## 동결 입력

| Input                                          | SHA-256                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| docs/factors/factor-dictionary.md              | a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be |
| docs/catalog-expansion/01-promotion-method.md  | 6961436ed7f2b326f11a725b5ac40e4b2148d6b70a62ff5eb977b6b747ba97bd |
| annotation-review-adjudication-request.md      | ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2 |
| adjudication/text-chunk-04-round-01.md         | f5272bd8a807ea876ffa2ff114e95e7ea47f3c0afd2e012de5ef1202f66f09fc |
| adjudication/text-gap-queue-chunk-04.csv       | 00fdfd857e72e252355d96134a693dac4758ba86d79bd1578a1a8c332082e48d |
| annotation/pass-a-text-chunk-04.csv            | 895e2f1715741065bbb5adfb6edf6f0688d09a8b0780d98047c43ade6fb9bb23 |
| annotation/pass-a-text-chunk-04.md             | 8db250f0688cf4f8dda8b5a8592503f19aba4362bc38b7889e44ad2665e5f2e2 |
| reviews/grok-text-review-response-chunk-04.txt | c0d495de2e6693446c038c34e267123a1ef282bbf517c52dd274d3f037faf330 |
| reviews/grok-text-review-ledger-chunk-04.md    | b61a5c2a77ec4fd046a6bb06116721fd40a8798360811d28e06eef7a818903c7 |
| research/chunk-04.md                           | c7436d6d23b304d72700ad7a1d4ebff881ac08e865438a4974c1de36c96b0999 |
| frozen-work-set.csv                            | 80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6 |
| adjudication/identity-chunk-04.md              | 65b08172722607773bb10c65940e3052c5c6280abcc2a27606b1694321be255a |
| identity-safety-review.csv                     | 3be97437cce30d76b75613034fd011bb2ccd1c16403e45f00d9f6c0a8968ab09 |

## 조사 규칙

- 공식 출판사 1~3권 소개, 공식 작품 페이지, 작가·편집자 인터뷰를 먼저 확인했다.
- 선정 목록 등재, 판매 순위, 별점, 인구통계상 독자층, 장르 태그는 Factor Evidence로 사용하지 않았다.
- 리뷰는 정확한 권차나 1~3권 범위를 식별할 수 있고 서로 다른 작성자의 구체 관찰이 반복될 때만 공식 자료의 보조 근거로 사용했다. 같은 플랫폼의 계정은 계정 단위로 구분하되 source family는 하나로 계산했다.
- 단일 감상, 복제된 리뷰, 작품을 읽지 않은 반응, 별점뿐인 항목, 범위가 불명확한 전체 회고는 제외했다.
- known 0은 공식 1~3권 설명과 범위가 확인된 복수 관찰이 해당 구조의 반복적 부재를 함께 지지할 때만 후보로 냈다. 0 후보도 다음 독립 검수에서 같은 높은 문턱으로 다시 확인해야 한다.
- 공식 자료와 보조 리뷰가 갈리는 항목은 자동 다수결하지 않았다. `屍鬼`의 comedy 후보처럼 경미한 충돌도 명시해 다음 review/adjudication으로 넘겼다.
- candidate-known은 Pass B와 Pass C의 입력일 뿐 확정값이 아니다. closed-unknown은 낮은 값이 아니라 현재 유한 route에서 책임 있게 정하지 못했다는 종결 상태다.
- `flat`에는 독자층이나 고등학생 신분을 근거로 school Theme를 만들지 않았다. 실제 1권 반복 소재가 확인된 dictionary Theme만 별도로 제안했다.
- canonicalTitle에는 장식용 괄호를 넣지 않았다.

## 결과 요약

Axis 표기 순서는 Narrative가 progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding, Tone이 characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth이다. U는 unknown이다.

| Pos | workId                    | canonicalTitle               | Round-01 N/T | 추가 candidate-known                                                                                                                      | 보강 후 후보 N/T | Text gate | hardBlocker |
| --: | ------------------------- | ---------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | --------- | ----------- |
|  31 | work-84b7c7d7720447075c25 | 軍靴のバルツァー             | 3/6, 2/7     | progression=2; characterArcWeight=2; mentalStress=2; emotionalWarmth=2                                                                    | 4/6, 5/7         | pass      | false       |
|  32 | work-9072892a767332254f00 | flat                         | 0/6, 1/7     | progression=2; problemSolving=0; strategy=0; pacing=1; mysteryReveal=0; characterArcWeight=3; comedy=2; mentalStress=1; emotionalWarmth=4 | 5/6, 5/7         | pass      | false       |
|  33 | work-98b7d2ef065bde405972 | スーパーの裏でヤニ吸うふたり | 1/6, 3/7     | problemSolving=0; strategy=0; worldBuilding=0; comedy=2; emotionalWarmth=3                                                                | 4/6, 5/7         | pass      | false       |
|  34 | work-a59481c00155de21d75f | ケロロ軍曹                   | 2/6, 2/7     | strategy=1; mysteryReveal=0; darkness=0; mentalStress=0; emotionalWarmth=2                                                                | 4/6, 5/7         | pass      | false       |
|  35 | work-a8349445836546a82934 | 百姓貴族                     | 2/6, 0/7     | progression=0; mysteryReveal=0; relationshipStructure=2; comedy=4; darkness=2; mentalStress=2; emotionalWarmth=2                          | 4/6, 5/7         | pass      | false       |
|  36 | work-ab95f4d4997113e0687a | 月刊少女野崎くん             | 2/6, 3/7     | progression=0; mysteryReveal=0; comedy=4; emotionalWarmth=2                                                                               | 4/6, 5/7         | pass      | false       |
|  37 | work-ad32c71b07fd13c65a79 | 私の推しは悪役令嬢。         | 4/6, 3/7     | comedy=3; emotionalWarmth=2                                                                                                               | 4/6, 5/7         | pass      | false       |
|  38 | work-bbeeaad9e37ab267dc29 | 僕とロボコ                   | 1/6, 2/7     | progression=0; strategy=0; mysteryReveal=0; darkness=0; mentalStress=0; emotionalWarmth=3                                                 | 4/6, 5/7         | pass      | false       |
|  39 | work-c221a17d6b962b17c9f4 | 屍鬼                         | 4/6, 4/7     | comedy=0, conflict-flag                                                                                                                   | 4/6, 5/7         | pass 후보 | false       |
|  40 | work-c55467873ec70e670484 | 大ダーク                     | 2/6, 2/7     | problemSolving=1; strategy=1; mysteryReveal=1; comedy=4; mentalStress=1; romance=0; emotionalWarmth=2                                     | 5/6, 6/7         | pass      | false       |

- candidate-known: 10작품, 50축
- text coverage pass 후보: 10작품
- conflict-flag: 1축, `屍鬼` comedy=0
- hard blocker 후보: 0작품
- `flat` Theme 후보: cooking:1

## 31. work-84b7c7d7720447075c25 — 軍靴のバルツァー

### Source packet

#### Source A — 新潮社 표준판 1~3권 공식 소개

- sourceName: 新潮社 軍靴のバルツァー 1권·2권·3권
- sourceUrl1: https://www.shinchosha.co.jp/book/771626/
- sourceUrl2: https://www.shinchosha.co.jp/book/771642/
- sourceUrl3: https://www.shinchosha.co.jp/book/771671/
- publicationDate: 2011-07-08; 2011-12-09; 2012-07-09
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 표준판 1~3권
- directObservation: 군제 개혁, 학생·교관과의 신뢰 형성, 왕족 파벌 싸움, 실전 투입, 제2왕자의 책사 역할과 학교에서 궁정·전장으로의 이동이 연속된다.
- limitation: 권 소개만으로 세부 심리, 반복 유머, 로맨스는 정하지 않는다.

#### Source B — 작가·담당 편집자 인터뷰

- sourceName: このマンガがすごい！WEB 中島三千恒 인터뷰 전편 3·4쪽
- sourceUrl1: https://web.archive.org/web/20150412062825id_/http://konomanga.jp/interview/16932-2/3
- sourceUrl2: https://web.archive.org/web/20150802235408id_/http://konomanga.jp/interview/16932-2/4
- originalSourceUrl1: https://konomanga.jp/interview/16932-2/3
- originalSourceUrl2: https://konomanga.jp/interview/16932-2/4
- publicationDate: 2014-12-09
- accessedDate: 2026-08-23
- authority: 작가·담당 편집자 직접 인터뷰의 보존본
- evaluatedRange: 초기 구상, 1~3권에 직접 언급된 설정과 주인공 설계
- directObservation: 작가는 군제를 이해하기 쉽게 설명하고 학교를 바꾸는 외부 교관을 핵심으로 삼았다고 설명한다. 이어 주인공의 출세·인정, 파벌 사이의 선택, 학생·동년배·상급자 관점의 복수 시점을 의도했다고 밝힌다.
- limitation: 후대 인터뷰의 시리즈 총론 중 1~3권에 직접 대응하지 않는 후반 사례는 사용하지 않았다. 원 URL은 현재 새 사이트 landing으로 이동하므로 접근 가능한 보존 URL도 함께 기록했다.

#### Source C — BookLive 3권 독자 리뷰 묶음

- sourceName: BookLive 軍靴のバルツァー 3권 독자 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/1188582/vol_no/003
- publicationDate: 2022-08-10; 2022-08-15; 2022-12-17; 2024-12-04
- accessedDate: 2026-08-23
- independence: 서로 다른 네 계정이지만 같은 BookLive 플랫폼 family다.
- evaluatedRange: 정확히 3권
- directObservation: 제한된 수단으로 정치·군사 교섭을 진행하는 모습, 학교·현장 개선, 제2왕자의 인정과 관계 변화가 계정 사이에서 반복된다.
- limitation: 감정 태그와 별점은 사용하지 않았고, 개별 계정의 인상만 있는 작화 평가는 제외했다.

#### Source D — コミックシーモア 1~3권 범위 리뷰

- sourceName: コミックシーモア 軍靴のバルツァー 독자 리뷰
- sourceUrl: https://www.cmoa.jp/title/249132/?order=up
- publicationDate: 2023-06-21
- accessedDate: 2026-08-23
- independence: BookLive와 다른 플랫폼의 독립 계정이다.
- evaluatedRange: 리뷰 본문이 3권까지 읽었다고 명시
- directObservation: 군제·훈련 개혁과 합리적 판단, 적과의 지략 대결, 1권에서 적대적이던 제2왕자가 3권에서 주인공을 인정하며 부드러워지는 변화를 구체적으로 관찰한다.
- limitation: 단일 계정이므로 Source A~C와 같은 범위에서 반복되는 주장만 보조했다.

### Axis 결론

- progression=2: candidate-known. Source A의 임무·책사 역할 확대와 Source B의 출세·인정 보상 설계가 직접 대응하고 Source C가 3권의 현장 개선을 확인한다. 성장 보상이 지속적 핵심 4라는 근거는 없어 2다.
- characterArcWeight=2: candidate-known. Source A의 신뢰 형성과 Source C·D의 제2왕자 태도 변화가 1~3권에서 반복되지만 정치·군사 사건과 균형을 이루므로 2다.
- mentalStress=2: candidate-known. Source A의 실전·파벌 압력과 Source C의 제한된 수단·상하 관계 압박이 함께 확인된다. 지속 붕괴 4가 아니라 긴장 혼합값 2다.
- emotionalWarmth=2: candidate-known. 학생·교관의 신뢰와 적대적 왕자의 인정 변화가 Source A·C·D에서 반복된다. 유대가 유일한 핵심 보상은 아니므로 2다.
- problemSolving, mysteryReveal, comedy, romance: closed-unknown. 지략과 인간관계는 보이지만 각 축의 별도 반복 구조 또는 반복적 부재를 현재 범위에서 충분히 확정하지 못했다.
- retainedRound01: strategy=3; pacing=2; worldBuilding=3; relationshipStructure=2; darkness=2. Source A와 선행 round-01 근거를 유지한다.
- finalCandidateNarrative: 2 / U / 3 / 2 / U / 3 = 4/6
- finalCandidateTone: 2 / 2 / U / 2 / 2 / U / 2 = 5/7
- coverageAssessment: 네 candidate가 채택되면 Narrative 4/6, Tone 5/7로 text gate를 충족한다.
- hardBlockerAssessment: false. 남은 unknown은 Evidence 한계이며 scope·identity·safety blocker가 아니다.

## 32. work-9072892a767332254f00 — flat

### Source packet

#### Source A — マッグガーデン 표준판 1~3권 공식 소개

- sourceName: マッグガーデン flat 1권·2권·3권
- sourceUrl1: https://www.mag-garden.co.jp/comics/6038/
- sourceUrl2: https://www.mag-garden.co.jp/comics/6039/
- sourceUrl3: https://www.mag-garden.co.jp/comics/6040/
- publicationDate: 2008-09-10; 2009-05-09; 2010-01-09
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 표준판 1~3권
- directObservation: 자기 속도로 사는 平介의 일상에 어린 사촌 秋가 들어오고, 평온한 날들이 이어지는 가운데 두 사람과 또래 관계가 조금씩 변한다.
- limitation: 인물의 고등학생 신분을 school Theme나 school mechanic으로 전용하지 않았다.

#### Source B — BookLive 1권 편집 소개·리뷰 묶음

- sourceName: BookLive flat 1권
- sourceUrl: https://booklive.jp/product/index/title_id/130205/vol_no/001
- publicationDate: 전자판 2011-11-18; 독자 리뷰 2014-02-02, 2015-06-14, 2021-05-16, 2022-07-31
- accessedDate: 2026-08-23
- independence: 편집 소개와 서로 다른 계정이 있으나 같은 BookLive 플랫폼 family다.
- evaluatedRange: 정확히 1권
- directObservation: 큰 사건보다 평범한 대화와 일상이 차분히 이어지고, 平介와 秋가 서로를 의식하며 천천히 변하고, 가벼운 웃음과 따뜻함이 반복된다는 관찰이 겹친다.
- limitation: 감정 태그와 별점은 제외했다. 1권만의 관찰을 2~3권에 단독 투영하지 않고 Source A·C와 교차했다.

#### Source C — コミックシーモア 진입부 리뷰 묶음

- sourceName: コミックシーモア flat 독자 리뷰
- sourceUrl: https://www.cmoa.jp/title/24689/
- publicationDate: 2009-12-20; 2014-01-21; 2014-03-20
- accessedDate: 2026-08-23
- independence: 서로 다른 계정이고 BookLive와 다른 플랫폼이지만 플랫폼 family는 하나다.
- evaluatedRange: 1권을 직접 지목한 리뷰와 진입부·권 진행을 명시한 리뷰만 사용
- directObservation: 컵케이크 사건, 감기 회복, 일상의 작은 장면을 통해 平介와 秋가 서서히 변하고, 극적인 사건 없이 관계·배려·따뜻함과 작은 웃음이 반복된다는 주장이 계정 간 일치한다.
- limitation: 전체 8권 회고와 학교 생활만 언급한 리뷰는 제외했다.

#### Source D — 1권 음식 장면 분석

- sourceName: マンガ食堂 flat 1권 ホットケーキ 재현
- sourceUrl: https://mangashokudo.net/blog-entry-176.html
- publicationDate: 2010-04-20
- accessedDate: 2026-08-23
- independence: 두 전자서점과 독립된 작성자·플랫폼이다.
- evaluatedRange: 정확히 1권과 1권 권말 추가 만화
- directObservation: 平介의 과자 만들기가 1권 중심 인물 설정이고, 큰 팬케이크와 권말 팬케이크 에피소드가 서로 다른 장면에서 반복됨을 페이지 범위와 함께 확인한다.
- limitation: 하나의 권에서 확인된 반복이므로 cooking centrality 2가 아닌 1만 제안한다.

### Axis·Theme 결론

- progression=2: candidate-known. Source A의 작은 변화와 Source B·C의 두 인물 변화가 직접 대응한다. 빠른 숙련·획득 보상이 아니라 느린 관계 기반 성장이라 2다.
- problemSolving=0: candidate-known. Source A의 1~3권 중심이 관계와 작은 일상 변화이고 Source B·C가 큰 사건·해결 구조 없이 일상을 잘라 보여 준다고 반복 관찰한다. 0 후보의 높은 문턱은 다음 Pass에서 재확인해야 한다.
- strategy=0: candidate-known. 같은 1~3권 자료가 즉흥적 일상 반응만 보여 주며 장기 계획·전술·자원 운영의 반복 구조는 없다고 범위 관찰이 일치한다. 독자층이나 sliceOfLife Genre에서 추론하지 않았다.
- pacing=1: candidate-known. Source A의 평온한 날들, Source B·C의 극적 변화 없는 느린 관계 이동이 1~3권 범위에서 반복된다. 완전 정지 0보다 작은 변화를 반영해 1이다.
- mysteryReveal=0: candidate-known. 공식 1~3권 소개와 두 플랫폼의 범위 리뷰가 수수께끼·단서 공개가 아닌 일상·관계 관찰을 반복적으로 핵심으로 지목한다.
- characterArcWeight=3: candidate-known. 平介와 秋 양쪽의 변화가 Source A~C에서 주된 보상으로 반복되지만 사건이 전혀 없는 순수 내면극 4보다 3으로 제한한다.
- comedy=2: candidate-known. Source B·C가 대화와 팬케이크 등 서로 다른 일상 맥락에서 작은 웃음을 반복 관찰한다. 상시 개그 4는 아니다.
- mentalStress=1: candidate-known. 秋의 자기 억제와 平介의 작은 걱정이 반복되지만 Source B·C는 무거운 압박보다 평온한 일상과 배려를 일관되게 관찰한다.
- emotionalWarmth=4: candidate-known. 관계의 배려와 따뜻함이 Source A~C 모두에서 진입부 핵심 보상으로 직접 반복된다.
- worldBuilding, darkness, romance: closed-unknown. 일상적 배경을 곧 worldBuilding=0으로 만들지 않았고, 따뜻함만으로 darkness 부재나 romance 부재를 확정하지 않았다.
- retainedRound01: relationshipStructure=2.
- Theme cooking:1: candidate. Source D가 1권에서 과자 만들기와 팬케이크 장면의 반복을 정확히 연결한다. 일부 에피소드 소재이므로 centrality 1이며 school은 제안하지 않는다.
- finalCandidateNarrative: 2 / 0 / 0 / 1 / 0 / U = 5/6
- finalCandidateTone: 3 / 2 / 2 / U / 1 / U / 4 = 5/7
- coverageAssessment: 아홉 candidate와 cooking:1이 채택되면 양 그룹 text gate와 Theme 계약을 충족한다.
- hardBlockerAssessment: false. 0 후보를 포함한 모든 값은 독립 검수 대상이며, 불채택 가능성 자체가 hard blocker는 아니다.

## 33. work-98b7d2ef065bde405972 — スーパーの裏でヤニ吸うふたり

### Source packet

#### Source A — SQUARE ENIX 표준판 1~3권 공식 소개

- sourceName: SQUARE ENIX スーパーの裏でヤニ吸うふたり 1권·2권·3권
- sourceUrl1: https://magazine.jp.square-enix.com/top/comics/detail/9784757580947/
- sourceUrl2: https://magazine.jp.square-enix.com/top/comics/detail/9784757583627/
- sourceUrl3: https://magazine.jp.square-enix.com/top/comics/detail/9784757586949/
- publicationDate: 2022-08-25; 2023-01-25; 2023-07-25
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 일반판 1~3권
- directObservation: 퇴근 후 흡연 장소의 대화가 반복되고, 건강검진 오진·폭우·새 직원·결혼 오해 같은 작은 사건이 두 사람의 관계를 조금씩 움직인다.
- limitation: 흡연 소재를 성인 분류, mentalStress, darkness 값으로 자동 변환하지 않았다. 3권 특장판 부록은 제외했다.

#### Source B — マンガ大賞 2023 심사 댓글

- sourceName: マンガ大賞 2023 공식 심사 댓글
- sourceUrl: https://www.mangataisho.com/data/2023/comment2023.pdf
- publicationDate: 2023
- accessedDate: 2026-08-23
- authority: 공식 수상기관의 복수 심사자 관찰
- evaluatedRange: 심사 당시 출간된 진입 권 범위
- directObservation: 여러 심사자가 흡연 장소에서 대화하는 단순 구조, 천천히 가까워지는 관계, 편안함·작은 웃음·따뜻함을 서로 독립적으로 반복 관찰한다.
- limitation: 순위와 노미네이트 사실은 Evidence에서 제외했고 심사자의 구체 관찰만 사용했다.

#### Source C — BookLive 1권·3권 리뷰 묶음

- sourceName: BookLive スーパーの裏でヤニ吸うふたり 1권·3권 독자 리뷰
- sourceUrl1: https://booklive.jp/review/list/title_id/20048232/vol_no/001
- sourceUrl2: https://booklive.jp/review/list/title_id/20048232/vol_no/003
- publicationDate: 1권 리뷰 2022-08-30, 2022-10-15, 2022-10-25, 2022-10-29, 2022-11-01; 3권 리뷰 2023-07-29, 2023-08-12, 2023-12-19
- accessedDate: 2026-08-23
- independence: 각 권의 서로 다른 계정이지만 같은 BookLive 플랫폼 family다.
- evaluatedRange: 정확히 1권과 일반판 3권
- directObservation: 큰 사건보다 짧은 대화와 오해가 중심이고, 두 사람과 주변 직원의 작은 웃음·편안함·따뜻함이 1권과 3권에서 반복되며 관계가 천천히 움직인다는 관찰이 일치한다.
- limitation: 전체 연재 회고와 4권 이후 언급은 제외했다.

### Axis 결론

- problemSolving=0: candidate-known. Source A의 작은 사건들이 분석·기발한 해결보다 대화와 관계 반응으로 끝나며 Source B·C가 큰 사건 없는 회화극을 반복 관찰한다.
- strategy=0: candidate-known. 1~3권의 관계 진행은 장기 계획·전술·자원 운영이 아니라 우연한 만남과 즉흥 대화 중심으로 직접 확인된다.
- worldBuilding=0: candidate-known. 동일 슈퍼·흡연 장소의 현실적 일상 배경만 기능하며 규칙·문화·세력 설명이 반복 보상이라는 근거가 1~3권에 없다. workplace Theme나 Genre에서 추론하지 않았다.
- comedy=2: candidate-known. Source B의 복수 심사자와 Source C의 1권·3권 계정이 오해와 대화에서 작은 웃음이 반복된다고 관찰한다. 상시 개그는 아니므로 2다.
- emotionalWarmth=3: candidate-known. Source A의 관계 이동과 Source B·C의 편안함·배려·따뜻함이 1권과 3권 모두에서 반복된다. 느린 관계극과 혼합되어 4보다 3이다.
- progression, mysteryReveal, darkness, romance: closed-unknown. 관계 변화는 characterArcWeight와 중복 배정하지 않았고, identity 오해만으로 mysteryReveal을 만들지 않았다. 따뜻함만으로 darkness·romance 부재도 확정하지 않았다.
- retainedRound01: pacing=1; characterArcWeight=3; relationshipStructure=2; mentalStress=1.
- finalCandidateNarrative: U / 0 / 0 / 1 / U / 0 = 4/6
- finalCandidateTone: 3 / 2 / 2 / U / 1 / U / 3 = 5/7
- coverageAssessment: 다섯 candidate가 채택되면 Narrative 4/6, Tone 5/7로 text gate를 충족한다.
- hardBlockerAssessment: false. 흡연 소재는 blocker도 값 생성 근거도 아니다.

## 34. work-a59481c00155de21d75f — ケロロ軍曹

### Source packet

#### Source A — KADOKAWA 표준판 1~3권 공식 소개

- sourceName: KADOKAWA ケロロ軍曹 1권·2권·3권
- sourceUrl1: https://www.kadokawa.co.jp/product/200659000036/
- sourceUrl2: https://www.kadokawa.co.jp/product/200659000037/
- sourceUrl3: https://www.kadokawa.co.jp/product/200000000671/
- publicationDate: 1999-11-29; 2000-06-28; 2001-02-26
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 표준판 1~3권
- directObservation: 침공 선행대가 日向家에서 포획·동거하고, 가사·취미와 동료 집결이 이어지며, 본격 침공을 표방해도 일상 소동으로 빗나가는 구조가 세 권에서 반복된다.
- limitation: 3권의 성적 유머 고지는 별도 safety 검수 항목이며 Tone 값을 직접 만들지 않는다.

#### Source B — BookLive 1권·3권 리뷰

- sourceName: BookLive ケロロ軍曹 1권·3권
- sourceUrl1: https://booklive.jp/product/index/title_id/13140/vol_no/001
- sourceUrl2: https://booklive.jp/product/index/title_id/13140/vol_no/003
- publicationDate: 전자판 2011-01-28; 독자 리뷰 2022-09-29 및 페이지별 게시일
- accessedDate: 2026-08-23
- independence: 권별 서로 다른 계정이지만 같은 BookLive 플랫폼 family다.
- evaluatedRange: 정확히 1권과 3권
- directObservation: 1권의 즉시 실패한 침공과 거주 생활, 3권의 괴담·크리스마스·침공 시도 등 독립 에피소드가 웃음과 가벼운 집단 상호작용으로 반복된다는 관찰을 제공한다.
- limitation: 애니메이션 추억만 말한 리뷰는 제외했다.

#### Source C — コミックシーモア 3권

- sourceName: コミックシーモア ケロロ軍曹 3권
- sourceUrl: https://www.cmoa.jp/title/12586/vol/3/
- publicationDate: 전자 배포 2010; 독자 리뷰 페이지는 개별 게시일 표시
- accessedDate: 2026-08-23
- independence: BookLive와 다른 플랫폼이다.
- evaluatedRange: 정확히 3권
- directObservation: 네 명이 모인 뒤에도 침공보다 日向家와 소대의 일상적 상호작용과 소동이 중심이라는 권 소개와 범위 리뷰가 일치한다.
- limitation: 플랫폼 편집자의 시리즈 총론은 보조로만 사용했다.

### Axis 결론

- strategy=1: candidate-known. Source A~C에서 침공 계획은 반복되지만 실행은 단기·즉흥적이고 자주 빗나간다. 완전 부재 0보다 계획이 있으나 장기 운영 2에는 못 미쳐 1이다.
- mysteryReveal=0: candidate-known. 괴담 같은 개별 소재가 있어도 1~3권의 반복 보상은 단서·추리·진실 공개가 아니라 독립 소동이라는 범위 관찰이 일치한다.
- darkness=0: candidate-known. 포획·침공 표방이 지속적 위험·비극으로 전개되지 않고 세 권 모두 가벼운 가정 소동으로 반복된다는 Source A~C의 직접 범위를 따른다.
- mentalStress=0: candidate-known. 주인공 집단의 실패와 갈등이 지속 불안·압박보다 회차 단위 웃음으로 해소된다는 1권·3권 관찰이 반복된다.
- emotionalWarmth=2: candidate-known. 日向家 동거와 소대 집결, 함께 보내는 일상 에피소드가 1~3권에서 반복되지만 유대·힐링이 유일한 핵심은 아니므로 2다.
- progression, problemSolving, characterArcWeight, romance: closed-unknown. 소대원이 모이는 것을 성장으로, 침공 실패를 problemSolving으로 자동 전환하지 않았다. 로맨스의 반복적 존재·부재도 확인하지 못했다.
- retainedRound01: pacing=2; worldBuilding=2; relationshipStructure=2; comedy=3.
- finalCandidateNarrative: U / U / 1 / 2 / 0 / 2 = 4/6
- finalCandidateTone: U / 2 / 3 / 0 / 0 / U / 2 = 5/7
- coverageAssessment: 다섯 candidate가 채택되면 두 text group이 gate를 충족한다.
- hardBlockerAssessment: false. 3권 민감도 고지는 선행 safety review의 별도 범위이며 이 연구에서 blocker를 재판정하지 않는다.

## 35. work-a8349445836546a82934 — 百姓貴族

### Source packet

#### Source A — 新書館 표준판 1~3권 공식 소개

- sourceName: 新書館 百姓貴族 1권·2권·3권
- sourceUrl1: https://www.shinshokan.co.jp/book/b565859.html
- sourceUrl2: https://www.shinshokan.co.jp/book/b565858.html
- sourceUrl3: https://www.shinshokan.co.jp/book/b565857.html
- publicationDate: 2009-12-08; 2012-02-25; 2014-02-25
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 표준판 1~3권
- directObservation: 소 사육·작물·야생동물·연중 노동, 十勝 개척사와 가족, 농사와 창작 병행 경험이 에피소드 단위로 이어진다.
- limitation: 에세이 형식만으로 모든 Narrative 0을 만들지 않았다.

#### Source B — 楽天ブックス 작가 인터뷰

- sourceName: 楽天ブックス 荒川弘 百姓貴族 인터뷰
- sourceUrl: https://books.rakuten.co.jp/event/book/interview/arakawa-h/
- publicationDate: 2010-03-18
- accessedDate: 2026-08-23
- authority: 작가 직접 인터뷰
- evaluatedRange: 1권과 2권 예고
- directObservation: 작가는 농가 에세이의 제작 목적, 반복 농작업과 수면 부족, 가축의 삶·죽음 판단에서 남는 해소되지 않은 감정, 친밀한 소의 성격, 독자에게 웃음을 주려는 목표를 직접 설명한다.
- limitation: 인터뷰에 인용된 독자 반응은 Factor 근거에서 제외했다.

#### Source C — ITmedia 작가 인터뷰

- sourceName: ITmedia eBook USER 荒川弘 인터뷰
- sourceUrl: https://www.itmedia.co.jp/ebook/articles/1202/24/news041.html
- publicationDate: 2012-02-24
- accessedDate: 2026-08-23
- authority: 작가 직접 인터뷰
- evaluatedRange: 1~2권과 초기 작품 설계
- directObservation: 작가는 이 작품을 성장 서사와 구분해 에피소드 소재를 연속해서 웃음으로 전달하는 농업 에세이라고 설명한다. 동시에 1권의 가축 생사, 농업의 거친 면, 농업에 대한 애정, 큰 가족이 함께 웃으며 식사하는 풍요를 직접 연결한다.
- limitation: 작가의 일반적인 만화 기술 설명과 다른 작품 언급은 제외했다.

### Axis 결론

- progression=0: candidate-known. Source C가 성장 이야기인 다른 작품과 달리 이 작품은 농업 소재를 에피소드 단위로 웃음에 쓰는 구조라고 직접 구분한다.
- mysteryReveal=0: candidate-known. Source A의 1~3권 에피소드와 Source B·C의 제작 설명에서 단서·추리·진실 공개가 반복 보상으로 기능하지 않는다.
- relationshipStructure=2: candidate-known. Source A의 가족·동물·편집자·지역 인물과 Source B·C의 가족·가축 관계가 고정 조연군으로 반복되지만 복잡한 군상 관계 4는 아니다.
- comedy=4: candidate-known. Source B·C에서 작가가 웃음을 작품의 직접 목표와 소재 선별 기준으로 두 번 명시한다.
- darkness=2: candidate-known. Source B·C가 1권의 가축 생사 판단과 고통스러운 장면을 직접 지목하지만 그것이 전편의 유일한 보상은 아니므로 2다.
- mentalStress=2: candidate-known. 연중무휴 노동·수면 부족과 해소되지 않는 생사 고민이 Source B·C에 직접 나오며, 웃음과 애정이 병존하므로 2다.
- emotionalWarmth=2: candidate-known. 가축의 친밀함, 농업·고향에 대한 애정, 가족 식탁의 웃음이 Source B·C에 반복되지만 생사·노동의 가혹함과 혼합되어 2다.
- problemSolving, strategy, characterArcWeight, romance: closed-unknown. 농업 지식·노동을 해결형 서사로, 가족 에피소드를 내면 변화로 자동 변환하지 않았다.
- retainedRound01: pacing=2; worldBuilding=2.
- finalCandidateNarrative: 0 / U / U / 2 / 0 / 2 = 4/6
- finalCandidateTone: U / 2 / 4 / 2 / 2 / U / 2 = 5/7
- coverageAssessment: 일곱 candidate가 채택되면 두 text group이 gate를 충족한다.
- hardBlockerAssessment: false. 무거운 농업 현실은 성인 전용 여부나 promotion blocker와 동일하지 않다.

## 36. work-ab95f4d4997113e0687a — 月刊少女野崎くん

### Source packet

#### Source A — SQUARE ENIX 표준판 1~3권 공식 소개

- sourceName: SQUARE ENIX 月刊少女野崎くん 1권·2권·3권
- sourceUrl1: https://magazine.jp.square-enix.com/top/comics/detail/9784757535664/
- sourceUrl2: https://magazine.jp.square-enix.com/top/comics/detail/9784757537774/
- sourceUrl3: https://magazine.jp.square-enix.com/top/comics/detail/9784757539853/
- publicationDate: 2012-04-20; 2012-11-22; 2013-06-22
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 표준판 1~3권
- directObservation: 고백 오해로 만화 어시스턴트가 되는 도입, 개성이 강한 학교·창작 인물의 확대, 이미 모인 인물의 새 면과 과거 고백 시도가 짧은 에피소드로 이어진다.
- limitation: 출판사의 Genre 문구만으로 comedy 값을 만들지 않았다.

#### Source B — マンガ大賞 2015 심사 댓글

- sourceName: マンガ大賞 2015 공식 심사 댓글
- sourceUrl: https://www.mangataisho.com/data/2015/comment2015.pdf
- publicationDate: 2015
- accessedDate: 2026-08-23
- authority: 공식 수상기관의 복수 심사자 관찰
- evaluatedRange: 당시 공개된 초기 단행본 범위 중 1~3권과 일치하는 반복 구조
- directObservation: 여러 심사자가 멈추지 않는 웃음, 뒤집힌 인물 성격, 귀엽고 호감 가는 인물군, 4컷 단위의 일상과 연결 서사를 독립적으로 반복 관찰한다.
- limitation: 노미네이트 사실과 인기 평가는 사용하지 않았다.

#### Source C — BookLive 1권 리뷰

- sourceName: BookLive 月刊少女野崎くん 1권
- sourceUrl: https://booklive.jp/review/list/title_id/195926/vol_no/001
- publicationDate: 2017-03-31; 2019-03-03; 2023-01-17
- accessedDate: 2026-08-23
- independence: 서로 다른 계정이지만 같은 BookLive 플랫폼 family다.
- evaluatedRange: 정확히 1권
- directObservation: 1페이지·4컷 단위의 오치, 이어지는 학교·창작 일상, 짙은 인물 개성, 고백 이후에도 거의 진전되지 않는 관계가 반복된다는 관찰을 제공한다.
- limitation: 애니메이션 감상은 제외했다.

#### Source D — コミックシーモア 3권 리뷰

- sourceName: コミックシーモア 月刊少女野崎くん 3권
- sourceUrl: https://www.cmoa.jp/title/62958/vol/3/
- publicationDate: 2013-10-17; 2019-06-02; 2023-11-26
- accessedDate: 2026-08-23
- independence: BookLive와 다른 플랫폼의 서로 다른 계정이다.
- evaluatedRange: 정확히 3권을 구입한 페이지의 리뷰
- directObservation: 4컷마다 웃음이 반복되고 연결 서사가 있어도 관계 진전보다 인물별 오해·창작 개그가 중심이며 인물들을 따뜻하게 바라보게 된다는 관찰이 반복된다.
- limitation: 15권까지 읽은 회고는 1~3권 candidate 근거에서 제외했다.

### Axis 결론

- progression=0: candidate-known. Source A의 1~3권은 관계·역량 누적보다 반복 오해와 짧은 일상을 이어 가고 Source C·D가 관계 진전의 정체를 구체적으로 관찰한다.
- mysteryReveal=0: candidate-known. Source A~D에서 드러나는 새 인물 면은 회차 개그의 재료이며 단서·추리·진실 공개가 반복 보상이라는 근거가 없다.
- comedy=4: candidate-known. Source B의 복수 심사자, Source C의 1권, Source D의 3권이 모두 회차마다 웃음이 핵심이라고 독립적으로 반복 관찰한다.
- emotionalWarmth=2: candidate-known. Source B·D가 인물군의 귀여움·호감과 관계를 따뜻하게 지켜보는 보상을 반복 확인하지만 핵심은 comedy와 관계 오해이므로 2다.
- problemSolving, strategy, darkness, mentalStress: closed-unknown. 만화 제작 소재를 problemSolving으로 만들지 않았고, 밝은 웃음만으로 darkness·stress 부재를 확정하지 않았다.
- retainedRound01: pacing=2; worldBuilding=2; characterArcWeight=3; relationshipStructure=3; romance=2.
- finalCandidateNarrative: 0 / U / U / 2 / 0 / 2 = 4/6
- finalCandidateTone: 3 / 3 / 4 / U / U / 2 / 2 = 5/7
- coverageAssessment: 네 candidate가 채택되면 두 text group이 gate를 충족한다.
- hardBlockerAssessment: false. 남은 unknown은 추천 coverage를 해치지 않으며 blocker가 아니다.

## 37. work-ad32c71b07fd13c65a79 — 私の推しは悪役令嬢。

### Source packet

#### Source A — 一迅社 만화판 1~3권 공식 소개

- sourceName: 一迅社 私の推しは悪役令嬢。 만화판 1권·2권·3권
- sourceUrl1: https://data.ichijinsha.co.jp/detail/75802193
- sourceUrl2: https://data.ichijinsha.co.jp/detail/75802263
- sourceUrl3: https://data.ichijinsha.co.jp/detail/75802318
- publicationDate: 2020-12-18; 2021-06-17; 2021-12-18
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 만화판 표준판 1~3권 본편
- directObservation: レイ가 クレア에게 적극적으로 다가가고, 전생 지식으로 메이드가 되며, 기사단 시험·학원 행사 속에서 クレア의 태도가 변하는 과정이 이어진다.
- limitation: 권말 원작자 단편 소설과 원작 소설판은 평가에서 제외했다.

#### Source B — 만화판 1권 독서 범위를 밝힌 인터뷰

- sourceName: アニメ！アニメ！ 奈波果林 인터뷰
- sourceUrl: https://animeanime.jp/article/2023/11/28/81532.html
- publicationDate: 2023-11-28
- accessedDate: 2026-08-23
- authority: 만화판 1권을 읽은 출연자의 범위 명시 관찰
- evaluatedRange: 인터뷰 대상자가 오디션 전에 읽었다고 명시한 만화판 1권
- directObservation: 빠른 학원 코미디와 중간의 진지한 장면, 강하게 행동하려 해도 상대를 걱정하는 クレア의 친절이 함께 보인다고 구체적으로 설명한다.
- limitation: 애니메이션 연기·영상·후속 에피소드 설명은 사용하지 않았다.

#### Source C — BookLive 만화판 1권 리뷰

- sourceName: BookLive 私の推しは悪役令嬢。 만화판 1권
- sourceUrl: https://booklive.jp/review/list/title_id/884440/vol_no/001
- publicationDate: 2021-03-16; 2021-07-21; 2022-08-05
- accessedDate: 2026-08-23
- independence: 서로 다른 계정이지만 같은 BookLive 플랫폼 family다.
- evaluatedRange: 정확히 만화판 1권; 한 계정은 2~3권까지 이어 읽었다고 명시
- directObservation: レイ의 과장된 접근과 クレア의 반응에서 반복 웃음이 생기고, 차갑게 대하려다 걱정하거나 부드러워지는 변화가 있다는 관찰이 계정 간 반복된다.
- limitation: 원작 소설 리뷰와 별점은 제외했다.

#### Source D — 만화판 3권 독립 리뷰

- sourceName: アンタレスのアニメと漫画の解剖録 私の推しは悪役令嬢。 3권 감상
- sourceUrl: https://antaressmangakanso.iiblog.jp/article/484867024.html
- publicationDate: 2021-12-19
- accessedDate: 2026-08-23
- independence: BookLive와 다른 작성자·플랫폼이다.
- evaluatedRange: 정확히 만화판 3권
- directObservation: 기사단 시험과 축제에서 웃음과 관계 변화가 반복되고, クレア의 여러 감정과 부드러워진 태도가 핵심 장면으로 이어진다고 관찰한다.
- limitation: 단일 블로그이므로 Source A~C와 일치하는 범위만 보조했다.

### Axis 결론

- comedy=3: candidate-known. Source B의 정확한 만화 1권 관찰, Source C의 복수 계정, Source D의 3권이 과장된 접근과 반응에서 지속 웃음이 난다고 반복 확인한다. 진지한 장면과 관계극도 있어 4보다 3이다.
- emotionalWarmth=2: candidate-known. Source A의 クレア 태도 변화, Source B의 친절, Source C·D의 관계가 부드러워지는 관찰이 1권과 3권에 직접 대응한다. romance와 character arc가 더 중심이므로 2다.
- strategy, mysteryReveal, darkness, mentalStress: closed-unknown. 전생 지식 사용만으로 strategy를, 진지한 장면만으로 darkness·stress를 만들지 않았다.
- retainedRound01: progression=2; problemSolving=2; pacing=2; worldBuilding=2; characterArcWeight=4; relationshipStructure=2; romance=4.
- finalCandidateNarrative: 2 / 2 / U / 2 / U / 2 = 4/6
- finalCandidateTone: 4 / 2 / 3 / U / U / 4 / 2 = 5/7
- coverageAssessment: 두 candidate가 채택되면 Tone 5/7로 text gate를 충족한다.
- hardBlockerAssessment: false. 만화판 identity와 평가 범위가 분리되어 있고 남은 unknown은 blocker가 아니다.

## 38. work-bbeeaad9e37ab267dc29 — 僕とロボコ

### Source packet

#### Source A — 集英社 표준판 1~3권 공식 소개

- sourceName: 集英社 僕とロボコ 1권·2권·3권
- sourceUrl1: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882509-0
- sourceUrl2: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882548-9
- sourceUrl3: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882595-3
- publicationDate: 2020-11-04; 2021-02-04; 2021-04-02
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 표준판 1~3권
- directObservation: 규격 밖 메이드 로봇과 친절한 소년의 동거, 요리·감량 같은 일상 목표의 시도와 실패가 권마다 독립 에피소드로 반복된다.
- limitation: 실패 에피소드만으로 problemSolving을 만들지 않았다.

#### Source B — 少年ジャンプ 공식 작품 페이지

- sourceName: 少年ジャンプ 공식 僕とロボコ 작품 페이지
- sourceUrl: https://www.shonenjump.com/j/rensai/roboko/
- publicationDate: 페이지 undated; 연재 시작 2020년 31호
- accessedDate: 2026-08-23
- authority: 연재 매체 공식 작품 소개
- evaluatedRange: 진입 설정과 초기 핵심 인물
- directObservation: 한 가정에 온 예외적 메이드 로봇과 마음이 따뜻한 소년의 기묘한 일상을 작품의 핵심으로 직접 설명한다.
- limitation: 현재 페이지의 후대 캐릭터·권 목록은 1~3권 근거에서 제외했다.

#### Source C — 集英社 작가 인터뷰

- sourceName: 週プレNEWS 宮崎周平 인터뷰 전편
- sourceUrl: https://wpb.shueisha.co.jp/news/entertainment/20210711-114019/
- publicationDate: 2021-07-11
- accessedDate: 2026-08-23
- authority: 출판사 계열 작가 인터뷰·편집 특집
- evaluatedRange: 1~~4권 시기; 1~~3권에 이미 존재하는 제작 원칙만 사용
- directObservation: 편집부는 작품의 핵심을 타인을 해치지 않는 웃음과 반복 패러디로 설명하며, 작가 인터뷰 시점이 4권 직후라 진입부 제작 맥락과 맞닿아 있다.
- limitation: 4권 고유 사건과 인기도는 제외했다. 편집자의 서술과 작가 직접 답변을 구분했다.

#### Source D — 1~2권 범위 비평

- sourceName: Real Sound 僕とロボコ 코미디 분석
- sourceUrl: https://realsound.jp/book/2021/02/post-712473_2.html
- publicationDate: 2021-02-24
- accessedDate: 2026-08-23
- independence: 集英社 공식 페이지와 편집상 독립된 매체 필자다.
- evaluatedRange: 기사 시점에 출간된 1~2권
- directObservation: 패러디와 인물 반응의 반복 웃음, ボンド와 친구들의 선의, 가벼운 감동이 독립 에피소드에서 반복된다고 분석한다.
- limitation: 후대 연재나 애니메이션은 범위에서 제외했다.

#### Source E — BookLive 1권 리뷰 묶음

- sourceName: BookLive 僕とロボコ 1권
- sourceUrl: https://booklive.jp/review/list/title_id/855753/vol_no/001
- publicationDate: 페이지 내 1권 독자 리뷰 2020~2022
- accessedDate: 2026-08-23
- independence: 서로 다른 계정이지만 같은 BookLive 플랫폼 family다.
- evaluatedRange: 정확히 1권
- directObservation: 독립 회차의 패러디·웃음, ボンド와 친구들의 친절, 부담 없이 읽히는 가벼운 분위기가 여러 계정에서 반복된다.
- limitation: 애니메이션 비교와 별점은 제외했다.

### Axis 결론

- progression=0: candidate-known. Source A가 1~3권을 일상 목표의 독립 시도·실패로 반복하고 Source D·E도 회차 리셋형 구조를 관찰한다. 성장·획득의 누적 보상이 핵심이 아니다.
- strategy=0: candidate-known. 요리·감량·생활 문제는 즉흥 소동으로 전개되며 장기 계획·전술·자원 운영의 반복 구조가 1~3권에 없다.
- mysteryReveal=0: candidate-known. Source A~E가 반복 보상을 패러디와 인물 반응으로 직접 지목하며 단서·추리·진실 공개 구조를 보이지 않는다.
- darkness=0: candidate-known. Source B·C의 타인을 해치지 않는 웃음과 Source D·E의 가벼운 진입 경험이 1~3권에서 반복된다. 과장된 실패·패러디를 비극으로 세지 않았다.
- mentalStress=0: candidate-known. 갈등이 지속 불안·압박보다 독립 회차 웃음으로 즉시 전환된다는 Source A·D·E의 관찰이 일치한다.
- emotionalWarmth=3: candidate-known. Source B의 마음 따뜻한 주인공, Source C의 비공격적 웃음, Source D·E의 친구들의 선의와 가벼운 감동이 반복되지만 comedy도 핵심이라 3이다.
- problemSolving, pacing, characterArcWeight, romance: closed-unknown. 실패 장면을 solving으로, 독립 회차를 자동으로 pacing=0으로 만들지 않았다. 로맨스의 반복적 부재도 확정하지 않았다.
- retainedRound01: worldBuilding=2; relationshipStructure=2; comedy=2.
- finalCandidateNarrative: 0 / U / 0 / U / 0 / 2 = 4/6
- finalCandidateTone: U / 2 / 2 / 0 / 0 / U / 3 = 5/7
- coverageAssessment: 여섯 candidate가 채택되면 두 text group이 gate를 충족한다.
- hardBlockerAssessment: false. 남은 unknown과 패러디 소재는 blocker가 아니다.

## 39. work-c221a17d6b962b17c9f4 — 屍鬼

### Source packet

#### Source A — 集英社 공식 디지털판 1~3권 소개

- sourceName: 集英社 屍鬼 공식 디지털판 1권·2권·3권
- sourceUrl1: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08874549874549315501
- sourceUrl2: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08874550874549315501
- sourceUrl3: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08874585874549315501
- publicationDate: 종이 원판 2008-07-04; 2008-07-04; 2008-10-03, 디지털판 2012-07-06
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 원판 1~3권과 같은 권차의 공식 디지털판
- directObservation: 연속 사망·실종, 전염병 가설, 죽은 동급생에 대한 공포, 무덤 확인과 충격적 진실을 향한 조사로 진입 3권이 일관되게 이어진다.
- limitation: identity와 대표 ISBN은 이 자료로 재판정하지 않았다. 선행 adjudication의 resolved 상태를 그대로 보존한다.

#### Source B — BookLive 1권·3권 리뷰 묶음

- sourceName: BookLive 屍鬼 1권·3권
- sourceUrl1: https://booklive.jp/review/list/title_id/172303/vol_no/001
- sourceUrl2: https://booklive.jp/review/list/title_id/172303/vol_no/003
- publicationDate: 1권 리뷰 2010-03-06, 2010-09-05, 2011-08-01, 2012-10-10; 3권 리뷰 2009-10-04, 2009-10-07, 2009-10-20
- accessedDate: 2026-08-23
- independence: 권별 서로 다른 계정이지만 같은 BookLive 플랫폼 family다.
- evaluatedRange: 정확히 1권과 3권
- directObservation: 불길함·공포·불안이 1권부터 누적되고 3권의 무덤 조사와 진실 접근에서도 긴장과 무거운 분위기가 유지된다는 관찰이 반복된다. 반복 개그를 핵심 보상으로 지목한 범위 리뷰는 없다.
- limitation: 원작 소설과 애니메이션만 본 감상, 전 11권 회고는 제외했다.

#### Source C — コミックシーモア 충돌 점검

- sourceName: コミックシーモア 屍鬼 독자 리뷰
- sourceUrl: https://www.cmoa.jp/title/customer_review/title_id/46832/
- publicationDate: 페이지 내 리뷰 2011년 이후
- accessedDate: 2026-08-23
- independence: BookLive와 다른 플랫폼이다.
- evaluatedRange: 일부 리뷰는 전체작 범위라 candidate의 직접 근거가 아니라 충돌 점검에만 사용
- directObservation: 한 전체작 리뷰가 원작보다 다소 comic한 템포가 있다고 관찰하지만, 진입 1~3권의 반복 comedy 장면이나 빈도를 특정하지 않는다.
- limitation: 범위가 불명확한 이 관찰을 다수결로 제거하지 않고 conflict-flag로 기록했다.

### Axis 결론

- comedy=0: candidate-known, conflict-flag. Source A의 1~3권 공식 사건과 Source B의 정확한 1권·3권 복수 관찰은 웃음보다 사망·공포·조사를 일관되게 보상으로 지목하고 반복 개그를 확인하지 못한다. 다만 Source C의 전체작 템포 관찰이 있어 다음 독립 review가 0의 높은 문턱과 진입 범위를 재확인해야 한다. 충돌이 material하면 unknown 또는 adjudication으로 보낸다.
- progression, strategy, romance, emotionalWarmth: closed-unknown. 조사 진전을 성장으로, 무거운 분위기를 romance·warmth 부재로 자동 전환하지 않았다.
- retainedRound01: problemSolving=2; pacing=2; mysteryReveal=3; worldBuilding=2; characterArcWeight=2; relationshipStructure=2; darkness=4; mentalStress=2.
- finalCandidateNarrative: U / 2 / U / 2 / 3 / 2 = 4/6
- finalCandidateTone: 2 / 2 / 0 / 4 / 2 / U / U = 5/7
- coverageAssessment: comedy=0이 다음 Pass에서 채택될 때만 Tone 5/7이다. conflict가 material해 unknown이면 Tone은 4/7로 돌아가며 추가 gate 판단이 필요하다.
- hardBlockerAssessment: false. 이번 후보 충돌은 Factor review 항목이며 선행 identity·ISBN resolved 상태를 다시 열지 않는다.

## 40. work-c55467873ec70e670484 — 大ダーク

### Source packet

#### Source A — 小学館 표준판 1~3권 공식 소개

- sourceName: 小学館 大ダーク 1권·2권·3권
- sourceUrl1: https://shogakukan-comic.jp/book?isbn=9784091294869
- sourceUrl2: https://shogakukan-comic.jp/book?isbn=9784098502158
- sourceUrl3: https://shogakukan-comic.jp/book?isbn=9784098504961
- publicationDate: 2019-11-12; 2020-08-12; 2021-04-12
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 표준판 1~3권
- directObservation: 전 우주에서 뼈를 노리는 적의 반복 습격, 우주선 잠입, 새 동료와의 만남, 조종·부상·납치와 동료의 구출 잠입이 이어진다.
- limitation: 폭력적 사건을 darkness·mentalStress에 자동 연결하지 않았다.

#### Source B — 작가 인터뷰

- sourceName: コミックナタリー 林田球 大ダーク 인터뷰 1·2쪽
- sourceUrl1: https://natalie.mu/comic/pp/daidark
- sourceUrl2: https://natalie.mu/comic/pp/daidark/page/2
- publicationDate: 2020-08-12
- accessedDate: 2026-08-23
- authority: 작가 직접 인터뷰를 포함한 PR 특집
- evaluatedRange: 1~2권과 초기 핵심 구상
- directObservation: 작가는 작품을 가볍게 읽는 comedy로 설계했고 サンコ에게 비장한 분위기를 주지 않았다고 설명한다. 또한 romance가 전혀 없는 name이 통과할지 걱정했다고 직접 밝히며, 네 명이 우주선에서 이동하는 집단 구상을 설명한다.
- limitation: 특집 편집 문구와 작가 직접 진술을 구분했다.

#### Source C — 1~3권 독립 리뷰 세 묶음

- sourceName: 東京マンガレビュアーズ, AQM, こたっつ 大ダーク 리뷰
- sourceUrl1: https://note.com/tmreviewers/n/n50b2beb03fae
- sourceUrl2: https://aqm.hatenablog.jp/entry/2020/08/13/033100
- sourceUrl3: https://ktats.blog.fc2.com/blog-entry-869.html
- publicationDate: 2020-10-14; 2020-08-13; 2021-04-14
- accessedDate: 2026-08-23
- independence: 서로 다른 작성자와 note, Hatena Blog, FC2 플랫폼이다.
- evaluatedRange: 각각 명시적 1~2권, 정확히 2권, 정확히 3권
- directObservation: 직접 힘으로 습격에 대응하는 가운데 2권 잠입·수수께끼 시체와 3권 구출·정체 공개가 있고, 장기 목표보다 즉흥 여행이 우세하며, 밝고 느슨한 웃음·우정이 폭력과 함께 반복된다는 관찰이 세 출처에서 겹친다.
- limitation: 각 리뷰의 호불호와 작화 평가는 제외했다.

#### Source D — BookLive 1권·3권 리뷰 묶음

- sourceName: BookLive 大ダーク 1권·3권
- sourceUrl1: https://booklive.jp/review/list/title_id/672506/vol_no/001
- sourceUrl2: https://booklive.jp/product/index/title_id/672506/vol_no/003
- publicationDate: 독자 리뷰 2020-01-10~2022-07-31
- accessedDate: 2026-08-23
- independence: 서로 다른 계정이지만 같은 BookLive 플랫폼 family다.
- evaluatedRange: 정확히 1권과 3권
- directObservation: 잔혹한 사건과 달리 주인공의 낙관·웃음이 유지되고, 첫 친구와 보호자·동료 관계, 3권의 구출과 우정이 반복된다는 관찰을 제공한다.
- limitation: 다른 전자서점에 복제된 Booklog 문구는 별도 독립 출처로 세지 않았다.

### Axis 결론

- problemSolving=1: candidate-known. Source A의 반복 직접 격퇴와 2~3권 잠입·구출, Source C의 전술적 행동이 섞인다. 분석형 해결보다 힘·직접 행동이 우세해 1이다.
- strategy=1: candidate-known. Source C가 1~2권을 즉흥 road-movie식 대응으로, 3권 말에야 새 목표가 생기는 구조로 관찰한다. 단기 계획은 있으나 중심 2는 아니다.
- mysteryReveal=1: candidate-known. 2권의 수수께끼 시체가 3권에서 ダメ丸이며 죽지 않았고 조종 능력이 있음이 드러나지만, Source C는 미해결 수수께끼가 많고 reveal이 핵심 보상은 아니라고 일치한다.
- comedy=4: candidate-known. Source B의 작가 직접 규정과 Source C·D의 1~3권 독립 관찰이 가벼운 웃음을 작품의 지속 핵심으로 함께 지지한다.
- mentalStress=1: candidate-known. 생명 위협과 부상은 있으나 Source B가 サンコ의 비장감 부재를 직접 설명하고 Source C·D도 낙관적·느슨한 대응을 반복 관찰한다. 위험이 전혀 없지는 않아 0이 아닌 1이다.
- romance=0: candidate-known. Source B의 작가 직접 진술과 Source A의 1~3권 공식 전개 모두 romance 선의 반복적 부재를 지지한다.
- emotionalWarmth=2: candidate-known. 첫 친구, 보호자, 네 명 집단 구상과 3권의 구출·우정이 Source A~D에서 반복되지만 폭력적 모험과 혼합되어 2다.
- progression, characterArcWeight: closed-unknown. 동료 합류나 생존을 성장·내면 변화 보상으로 자동 변환하지 않았다.
- retainedRound01: pacing=2; worldBuilding=2; relationshipStructure=2; darkness=2.
- finalCandidateNarrative: U / 1 / 1 / 2 / 1 / 2 = 5/6
- finalCandidateTone: U / 2 / 4 / 2 / 1 / 0 / 2 = 6/7
- coverageAssessment: 일곱 candidate가 채택되면 두 text group이 gate를 충족한다. problemSolving이 기각돼도 Narrative 4/6, emotionalWarmth가 기각돼도 Tone 5/7다.
- hardBlockerAssessment: false. violence와 dark setting은 safety·promotion blocker로 자동 전환하지 않는다.

## 산출물 검증

- expectedWorks: 10
- expectedCandidateKnownWorks: 10
- expectedCandidateKnownAxes: 50
- expectedTextGatePassCandidates: 10
- expectedConflictFlags: 1
- expectedHardBlockers: 0
- sourceRecords: 37
- uniqueSourceUrls: 67
- urlLiveVerification: HTTP 200 after redirects = 67; content-bearing final URLs = 65; legacy landing redirects = 2; archived replacements HTTP 200 = 2; non-200 = 0
- canonicalTitleDelimiterCount: 0
- outputSha256: 자기참조를 피하기 위해 파일을 닫은 뒤 계산하여 상위 batch 원장에 전달한다.
