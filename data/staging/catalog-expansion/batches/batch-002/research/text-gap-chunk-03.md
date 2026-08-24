# Batch 002 text coverage gap research — chunk 03

- batchId: batch-002
- sourceChunk: chunk-03
- scope: round-01 coverage gap 10작품
- evaluatedRange: 작품별 진입 1~3권 또는 첫 주요 에피소드
- accessedDate: 2026-08-23
- reviewedByHuman: false
- outputKind: supplemental-evidence-packet
- decisionBoundary: 이 문서는 candidate-known 또는 closed-unknown을 제안하는 연구 패킷이다. 독립 검수, adjudication, Factor source 반영, promotion 판정은 수행하지 않는다.
- routeBoundary: text-gap-queue-chunk-03.csv에 동결된 조사 route만 보강했다. 작품 수를 맞추기 위해 값을 만들지 않았고 hard blocker를 새로 확정하지 않았다.

## 동결 입력

| Input                                          | SHA-256                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| docs/factors/factor-dictionary.md              | a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be |
| docs/catalog-expansion/01-promotion-method.md  | 6961436ed7f2b326f11a725b5ac40e4b2148d6b70a62ff5eb977b6b747ba97bd |
| annotation-review-adjudication-request.md      | ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2 |
| adjudication/text-chunk-03-round-01.md         | 1e14d4b211bdc4110be492cd1e7789b7f29c4350cd5881b113b252ac189cfe2a |
| adjudication/text-gap-queue-chunk-03.csv       | cc63171aa7dd9d6eabd99e54e9ebdbeb66dc23aa49cc0eb4d6829824eebcdcc3 |
| annotation/pass-a-text-chunk-03.csv            | 89cf6b2b4d9ebb3e62965f13bf75f51eed210f8fb124dd6a32af10a26090e018 |
| annotation/pass-a-text-chunk-03.md             | 0e4245dbbb9e31d1b7e080fe50d5d21df328b2fe28e9f1542aa1e3eec272d3da |
| reviews/grok-text-review-response-chunk-03.txt | 3916ba2f6a35c7ad27f6fabd7e95e5e30454ae1cbf90e1a9f27c3f020ee7d0fe |
| reviews/grok-text-review-ledger-chunk-03.md    | 84ee2634dc638e53f70573315728a91171c1cfa138a41208537cf60259739    |
| research/chunk-03.md                           | 2e31ccaf1d9202ea253e4339ec155405b5c234c15410b2272c2c591a83e368f7 |
| frozen-work-set.csv                            | 80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6 |

## 조사 규칙

- 공식 출판사 작품·권 소개, 공식 작품 페이지, 공식 편집 자료를 먼저 확인했다.
- 평가는 원판 또는 확인된 동일 판본의 1~3권과 첫 주요 에피소드로 제한했다. 판본 bridge가 없으면 후대 판본의 내용을 frozen ISBN에 투영하지 않았다.
- 선정 provenance, 판매 순위, 별점, 장르 태그는 Factor Evidence로 사용하지 않았다.
- 장르에서 Axis를 자동 추론하지 않았고, 사건이나 전투가 있다는 사실만으로 problemSolving, strategy, darkness, mentalStress를 정하지 않았다.
- 유저평은 정확한 권차나 진입 범위를 식별할 수 있고, 서로 다른 계정의 구체 관찰이 반복될 때만 공식 자료의 보조 Evidence로 사용했다. 같은 플랫폼 계정은 계정 단위로 독립이지만 출처 family는 하나로 계산했다.
- 작품 전체 회고, 단일 감상, 평점뿐인 글, 애니메이션 감상, 복제된 문구는 candidate 근거에서 제외했다.
- known 0은 진입 범위 전체에서 해당 특성의 반복적 부재가 직접 뒷받침되는 경우에만 제안했다. 0 후보도 다음 독립 검수에서 같은 높은 문턱을 다시 확인해야 한다.
- candidate-known은 다음 Pass B와 Pass C의 입력일 뿐 확정값이 아니다. closed-unknown은 낮은 값이 아니라 현재 유한 route에서 책임 있게 정하지 못했다는 종결 상태다.
- 제목의 장식용 괄호는 canonicalTitle에 포함하지 않았다.
- 고유 URL 58개를 2026-08-23에 GET으로 다시 요청했고 redirect 이후 최종 응답이 모두 HTTP 200이었다.

## 결과 요약

Axis 표기 순서는 Narrative가 progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding, Tone이 characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth이다. U는 unknown이다.

| Pos | workId                    | canonicalTitle       | Round-01 N/T | 추가 candidate-known                                | 보강 후 후보 N/T | Text gate    | hardBlocker |
| --: | ------------------------- | -------------------- | ------------ | --------------------------------------------------- | ---------------- | ------------ | ----------- |
|  21 | work-5cafd57db6b870a71a05 | 機動警察パトレイバー | 0/6, 0/7     | 없음                                                | 0/6, 0/7         | fail N+4 T+5 | false       |
|  22 | work-5e20323e014d6d390aaf | あさひなぐ           | 3/6, 4/7     | comedy=2                                            | 3/6, 5/7         | fail N+1     | false       |
|  23 | work-5ebbc9bede841d2faf7b | 高台家の人々         | 2/6, 4/7     | comedy=4; emotionalWarmth=3                         | 2/6, 6/7         | fail N+2     | false       |
|  24 | work-6f849a8e785deee3d5dc | 怪物事変             | 3/6, 3/7     | comedy=2; emotionalWarmth=2                         | 3/6, 5/7         | fail N+1     | false       |
|  25 | work-71e824df2e6bc2125294 | SAKAMOTO DAYS        | 3/6, 4/7     | comedy=4                                            | 3/6, 5/7         | fail N+1     | false       |
|  26 | work-7975d62582a89492a35f | 図書館の大魔術師     | 3/6, 5/7     | problemSolving=3                                    | 4/6, 5/7         | pass         | false       |
|  27 | work-7d259c925286a9f91310 | 聖☆おにいさん        | 2/6, 2/7     | progression=0; comedy=4; darkness=0; mentalStress=0 | 3/6, 5/7         | fail N+1     | false       |
|  28 | work-8147aefccc365b0ecb4d | 黒執事               | 3/6, 3/7     | problemSolving=3; comedy=2; mentalStress=2          | 4/6, 5/7         | pass         | false       |
|  29 | work-838a6f0ad2d1ef487588 | 信長協奏曲           | 3/6, 3/7     | strategy=2; comedy=2; mentalStress=1                | 4/6, 5/7         | pass         | false       |
|  30 | work-83fc3c4366e51b35b821 | 風と木の詩           | 0/6, 0/7     | 없음                                                | 0/6, 0/7         | fail N+4 T+5 | false       |

- candidate-known: 8작품, 17축
- closed-unknown만 유지: 2작품
- text coverage pass 후보: 3작품
- text coverage fail 잔존: 7작품
- coverage 하한까지 남은 부족량: Narrative 14축, Tone 10축
- hard blocker 후보: 0작품

## 21. work-5cafd57db6b870a71a05 — 機動警察パトレイバー

### Source packet

#### Source A — 小学館 표준판 1~3권 공식 소개

- sourceName: 小学館eコミックストア 機動警察パトレイバー 1권·2권·3권
- sourceUrl1: https://e-comi.shogakukan.co.jp/books/091221210000d0000000
- sourceUrl2: https://e-comi.shogakukan.co.jp/books/091221220000d0000000
- sourceUrl3: https://e-comi.shogakukan.co.jp/books/091221230000d0000000
- publicationDate: 웹 페이지는 undated
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 표준판 1~3권
- directObservation: 표준판 진입부의 사건과 인물 배치는 확인되지만, frozen 대표 ISBN의 wide판 수록 범위와 동일하다는 설명은 없다.
- limitation: 표준판의 텍스트 Axis를 wide판 1권에 자동 투영하지 않았다.

#### Source B — frozen wide판과 공식 판본 이력

- sourceName: 楽天ブックス wide판 상품; PATLABOR 공식 판본 안내; 小学館 문고판 상품
- sourceUrl1: https://books.rakuten.co.jp/rb/739903/
- sourceUrl2: https://patlabor.tokyo/news/96/
- sourceUrl3: https://patlabor.tokyo/package/373/
- sourceUrl4: https://shogakukan-comic.jp/book?isbn=9784091932716
- publicationDate: 1995-07-15; 2019-11-14; 2019-11-12; 2000-01-15
- accessedDate: 2026-08-23
- authority: frozen ISBN 서점 서지와 공식 작품·출판사 자료
- evaluatedRange: wide판 1권 362쪽, 애장판 1권 264쪽, 문고판 1권 376쪽의 판본 메타데이터
- directObservation: 표준판, wide판, 문고판, 애장판이 별도 판본으로 존재하고 페이지 수도 다르다.
- limitation: 어느 표준판 화가 frozen wide판 1권에 수록되는지 연결하는 공식 목차나 내부 미리보기는 확인되지 않았다.

### Axis 결론

- progression: closed-unknown. frozen wide판의 진입 범위를 확정하지 못했다.
- problemSolving: closed-unknown. 표준판 사건 해결 방식을 frozen wide판에 투영하지 않았다.
- strategy: closed-unknown. 조직·경찰 설정만으로 장기 전략값을 만들지 않았다.
- pacing: closed-unknown. wide판 수록 화와 장면 표본이 없다.
- mysteryReveal: closed-unknown. 사건 존재는 공개 구조의 반복성을 증명하지 않는다.
- worldBuilding: closed-unknown. 설정 소개를 판본 불명 범위에 수치화하지 않았다.
- characterArcWeight: closed-unknown.
- relationshipStructure: closed-unknown.
- comedy: closed-unknown.
- darkness: closed-unknown.
- mentalStress: closed-unknown.
- romance: closed-unknown.
- emotionalWarmth: closed-unknown.
- directEvidenceLinkage: Source A는 표준판 범위만, Source B는 판본 차이만 증명한다. 둘 사이 contents bridge가 없어 candidate-known을 제안하지 않는다.
- finalCandidateNarrative: U / U / U / U / U / U = 0/6
- finalCandidateTone: U / U / U / U / U / U / U = 0/7
- coverageAssessment: Narrative 4축, Tone 5축이 더 필요하다.
- hardBlockerAssessment: false. 판본 bridge 미확인은 현재 text Evidence 한계이며 canonical identity나 safety hard blocker로 확장하지 않는다.

## 22. work-5e20323e014d6d390aaf — あさひなぐ

### Source packet

#### Source A — 小学館 1~3권 공식 소개

- sourceName: 小学館eコミックストア あさひなぐ 1권·2권·3권
- sourceUrl1: https://e-comi.shogakukan.co.jp/books/091837980000d0000000
- sourceUrl2: https://e-comi.shogakukan.co.jp/books/091838990000d0000000
- sourceUrl3: https://e-comi.shogakukan.co.jp/books/091841190000d0000000
- publicationDate: 웹 페이지는 undated
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 1~3권
- directObservation: 주인공의 나기나타 입문, 부 활동, 3권의 교내 릴레이와 합숙이라는 진입 구조를 확인한다.
- limitation: 공식 짧은 소개만으로 반복 problemSolving, strategy, mysteryReveal을 정하지 않는다.

#### Source B — BookLive 3권 리뷰 묶음

- sourceName: BookLive あさひなぐ 3권 독자 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/231378/vol_no/003
- publicationDate: 2013-04-20; 2013-04-28; 2025-01-04
- accessedDate: 2026-08-23
- independence: 서로 다른 세 계정이지만 같은 BookLive 플랫폼 family다.
- evaluatedRange: 정확히 3권; 한 계정은 1~3권을 함께 회고
- directObservation: 교내 릴레이와 합숙 모두에서 웃음이 반복되고, 훈련의 고됨과 코미디가 교차한다는 관찰이 계정 간 반복된다.
- limitation: 별점과 단순 재미 평가는 제외했다. 웃음만으로 따뜻함이나 심리 압박을 정하지 않는다.

#### Source C — 楽天ブログ 3권 리뷰

- sourceName: Litchiの甘い夢 あさひなぐ 3권 감상
- sourceUrl: https://plaza.rakuten.co.jp/litchi912/diary/201202250001/
- publicationDate: 2012-02-25; 2012-02-26 갱신
- accessedDate: 2026-08-23
- independence: BookLive 계정·플랫폼과 독립된 개인 리뷰다.
- evaluatedRange: 정확히 3권
- directObservation: 릴레이와 합숙의 서로 다른 장면에서 웃음이 반복된다는 구체 관찰을 제공한다.
- limitation: 단일 독립 블로그이므로 Source A와 Source B의 관찰을 보조하는 데만 사용한다.

### Axis 결론

- comedy=2: candidate-known. Source A가 서로 다른 두 일상·훈련 맥락을 고정하고, Source B의 복수 계정과 Source C가 두 맥락 모두의 반복 웃음을 독립적으로 관찰한다. 스포츠 성장과 훈련이 중심이므로 코미디 핵심값 4가 아니라 혼합값 2를 제안한다.
- problemSolving: closed-unknown. 훈련과 경기가 반복되지만 제약 분석과 기발한 해결이 핵심이라는 직접 근거가 없다.
- strategy: closed-unknown. 경기·합숙 존재를 전술 또는 장기 계획으로 자동 변환하지 않았다.
- mysteryReveal: closed-unknown. 수수께끼 공개 구조의 반복 여부를 직접 확인하지 못했다.
- darkness: closed-unknown. 고된 훈련은 잔혹하거나 암울한 중심성과 다르다.
- romance: closed-unknown. 진입 범위의 반복적 중심성이나 반복적 부재를 확인하지 못했다.
- directEvidenceLinkage: comedy 후보는 Source A의 3권 범위와 Source B·C의 정확한 3권 관찰이 직접 대응한다. 나머지 unknown 축에는 같은 수준의 대응 근거가 없다.
- finalCandidateNarrative: 4 / U / U / 3 / U / 2 = 3/6
- finalCandidateTone: 4 / 2 / 2 / U / 2 / U / 2 = 5/7
- coverageAssessment: Tone은 후보 gate를 충족하지만 Narrative가 1축 부족하다.
- hardBlockerAssessment: false. 추가 Narrative 근거 부족은 promotion hard blocker가 아니다.

## 23. work-5ebbc9bede841d2faf7b — 高台家の人々

### Source packet

#### Source A — 集英社 1~3권 공식 소개

- sourceName: 集英社 高台家の人々 1권·2권·3권
- sourceUrl1: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08845109845109315501
- sourceUrl2: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08845221845109315501
- sourceUrl3: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08845341845109315501
- publicationDate: 2013-09-25; 2014-05-23; 2015-01-23
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 1~3권
- directObservation: 주인공의 공상과 타인의 생각을 읽는 남성의 관계를 공식적으로 러브 코미디로 설명하고, 가족의 폐쇄적인 관계가 진입부에서 확장된다.
- limitation: 장르명만으로 comedy나 romance 값을 정하지 않고 아래 범위 관찰과 결합했다.

#### Source B — BookLive 1권 편집 소개와 리뷰 묶음

- sourceName: BookLive 高台家の人々 1권 편집 소개·독자 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/237803/vol_no/001
- publicationDate: 편집 소개는 undated; 독자 리뷰 2021-06-27, 2021-12-31, 2022-03-03, 2022-03-06, 2022-03-07
- accessedDate: 2026-08-23
- independence: 편집 소개와 서로 다른 독자 계정이 함께 있으나 같은 BookLive 플랫폼 family다.
- evaluatedRange: 정확히 1권
- directObservation: 편집 소개는 폐쇄적인 인물이 주인공의 공상을 즐기며 관계가 변하는 지점을 짚는다. 복수 계정은 1권에서 반복적으로 크게 웃는 장면과 편안함·따뜻함을 관찰한다.
- limitation: 추천 문구와 별점은 사용하지 않았다. 웃음과 독후감만으로 Narrative 축을 추론하지 않는다.

#### Source C — コミックシーモア 진입부 리뷰

- sourceName: コミックシーモア 高台家の人々 독자 리뷰
- sourceUrl: https://www.cmoa.jp/title/69814/
- publicationDate: 2022-03-08
- accessedDate: 2026-08-23
- independence: BookLive와 다른 플랫폼의 독립 계정이다.
- evaluatedRange: 리뷰가 1~2권을 명시
- directObservation: 진입 1~2권에서 공상 장면의 반복 웃음과 관계에서 오는 따뜻함을 함께 관찰한다.
- limitation: 다른 전체작 회고 리뷰는 범위 밖이라 candidate 근거에서 제외했다.

### Axis 결론

- comedy=4: candidate-known. Source A의 반복 공상 장치와 Source B·C의 서로 다른 플랫폼 진입부 관찰이 웃음을 작품의 지속적 핵심 보상으로 함께 지지한다.
- emotionalWarmth=3: candidate-known. Source A의 관계 수용·가족 관계 확장, Source B 편집 소개, 두 플랫폼의 따뜻함 관찰이 직접 대응한다. 로맨스와 코미디도 함께 중심이므로 단일 핵심값 4보다 3으로 제한한다.
- progression: closed-unknown. 관계 변화는 이미 characterArcWeight와 relationshipStructure의 근거이며 성장·획득·숙련 보상으로 중복 기록하지 않았다.
- problemSolving: closed-unknown. 독심 능력과 오해 해결이 있다는 사실만으로 제약 분석 중심성을 정하지 않았다.
- strategy: closed-unknown. 장기 계획·정치·자원 운영의 반복 구조를 확인하지 못했다.
- mysteryReveal: closed-unknown. 숨은 생각이 보인다는 설정은 수수께끼의 단계적 공개 구조와 다르다.
- darkness: closed-unknown. 가족 갈등의 존재와 암울한 중심성을 구분했다.
- directEvidenceLinkage: comedy와 emotionalWarmth는 Source A의 진입 관계 구조를 Source B·C의 범위 명시 관찰이 보강한다. Narrative unknown에는 반복 방법을 보여 주는 직접 근거가 없다.
- finalCandidateNarrative: U / U / U / 3 / U / 2 = 2/6
- finalCandidateTone: 4 / 2 / 4 / U / 2 / 4 / 3 = 6/7
- coverageAssessment: Tone은 후보 gate를 넘지만 Narrative가 2축 부족하다.
- hardBlockerAssessment: false. Narrative Evidence 부족은 hard blocker가 아니다.

## 24. work-6f849a8e785deee3d5dc — 怪物事変

### Source packet

#### Source A — 集英社 1~3권 공식 소개

- sourceName: 集英社 怪物事変 1권·2권·3권
- sourceUrl1: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-881096-6
- sourceUrl2: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08881128881096315501
- sourceUrl3: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08881169881096315501
- publicationDate: 2017-03-03; 2017-07-04; 2017-11-02
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 1~3권
- directObservation: 배척받던 주인공이 탐정 사무소에 받아들여지고 동료와 함께 여러 괴이 사건을 맡는 진입 구조를 확인한다.
- limitation: 사건 존재만으로 problemSolving을, 괴이·위험만으로 mentalStress를 추론하지 않는다.

#### Source B — BookLive 1권 편집 소개와 리뷰 묶음

- sourceName: BookLive 怪物事変 1권 편집 소개·독자 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/424858/vol_no/001
- publicationDate: 편집 소개는 undated; 독자 리뷰 2020-07-12, 2021-01-19, 2021-04-23, 2021-10-29
- accessedDate: 2026-08-23
- independence: 편집 소개와 서로 다른 계정이지만 같은 BookLive 플랫폼 family다.
- evaluatedRange: 정확히 1권
- directObservation: 편집 소개는 배척받던 주인공을 받아들이는 어른과 동료의 친절을 짚는다. 복수 계정은 serious 사건 사이의 작은 웃음과 동료 일상의 귀여움, 수용 관계를 반복 관찰한다.
- limitation: 애니메이션 비교 문장은 제외했다. 한 플랫폼의 리뷰만으로 값을 확정하지 않고 Source A와 직접 일치하는 관찰만 사용했다.

#### Source C — コミックシーモア 리뷰 페이지

- sourceName: コミックシーモア 怪物事変 독자 리뷰
- sourceUrl: https://www.cmoa.jp/title/customer_review/title_id/127472/
- publicationDate: 페이지는 undated; 진입 범위를 확정할 수 있는 개별 리뷰 날짜 없음
- accessedDate: 2026-08-23
- independence: BookLive와 다른 플랫폼이다.
- evaluatedRange: 작품 전체 회고가 섞여 있어 1~3권 귀속 불명
- directObservation: 웃음과 동료 관계를 언급하는 관찰이 있으나 진입 범위를 분리할 수 없다.
- limitation: candidate 값에는 사용하지 않고, 범위 한계가 있는 교차 확인 자료로만 기록한다.

### Axis 결론

- comedy=2: candidate-known. Source A의 여러 사건·동료 일상 범위에서 Source B 복수 계정이 serious 전개 사이 반복되는 작은 웃음을 구체적으로 관찰한다. 사건·성장과 병존하므로 혼합값 2다.
- emotionalWarmth=2: candidate-known. Source A의 배척에서 수용으로 이동하는 공식 1권 구조와 Source B 편집 소개·복수 계정의 보호와 동료 유대 관찰이 직접 대응한다. 괴이 사건의 위험과 병존하므로 2로 제한한다.
- progression: closed-unknown. 소속과 관계 변화는 progression의 숙련·획득 보상과 다르다.
- problemSolving: closed-unknown. 사건을 맡는다는 소개만으로 해결 방법의 중심성을 정하지 않았다.
- strategy: closed-unknown. 장기 전략 또는 자원 운영을 보여 주는 근거가 없다.
- mentalStress: closed-unknown. 위협과 지속적 인물 불안·압박을 구분했다.
- romance: closed-unknown. 진입 범위의 중심성이나 반복적 부재를 확인하지 못했다.
- directEvidenceLinkage: 두 후보는 Source A의 공식 수용·사건 구조와 정확한 1권 Source B 관찰에만 의존한다. Source C는 범위 불명이라 값에 사용하지 않았다.
- finalCandidateNarrative: U / U / U / 3 / 2 / 3 = 3/6
- finalCandidateTone: 2 / 2 / 2 / 2 / U / U / 2 = 5/7
- coverageAssessment: Tone은 후보 gate를 충족하지만 Narrative가 1축 부족하다.
- hardBlockerAssessment: false. 남은 Narrative 근거 부족은 hard blocker가 아니다.

## 25. work-71e824df2e6bc2125294 — SAKAMOTO DAYS

### Source packet

#### Source A — 集英社 1~3권 공식 소개와 연재 페이지

- sourceName: 集英社 SAKAMOTO DAYS 1권·2권·3권; 週刊少年ジャンプ 공식 연재 페이지
- sourceUrl1: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08882657882657315501
- sourceUrl2: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882685-1
- sourceUrl3: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882763-6
- sourceUrl4: https://www.shonenjump.com/j/rensai/sakamoto/
- publicationDate: 2021-04-02; 2021-06-04; 2021-09-03; 연재 페이지는 undated, 2020년 51호 연재 개시 표기
- accessedDate: 2026-08-23
- authority: 출판사·잡지 1차 자료
- evaluatedRange: 1~3권과 공식 진입 총론
- directObservation: 은퇴한 킬러의 가족·가게 일상과 반복 전투가 교차하며, 공식 연재 페이지가 battle과 comedy의 결합을 작품 특징으로 제시한다.
- limitation: 2권의 위협 대처 문구는 해결 방법을 보여 주지 않으므로 problemSolving 값으로 사용하지 않았다.

#### Source B — ebookjapan 공식 편집 기사

- sourceName: ebookjapan SAKAMOTO DAYS 작품 해설
- sourceUrl: https://ebookjapan.yahoo.co.jp/special/article/aa0024.html
- publicationDate: 2022-05-26
- accessedDate: 2026-08-23
- independence: 출판사와 다른 전자서점의 편집 기사다.
- evaluatedRange: 1권 1·4화와 2권 8화를 명시한 진입 예시
- directObservation: 일상 코미디를 작품의 바탕이자 액션과 나란한 축으로 설명하고, 서로 다른 진입 화의 반복 예시를 연결한다.
- limitation: 후대 전체작 평가를 1~3권에 투영하지 않고 기사에서 권·화가 명시된 예시만 사용했다.

#### Source C — BookLive 1권 리뷰 묶음

- sourceName: BookLive SAKAMOTO DAYS 1권 독자 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/919339/vol_no/001
- publicationDate: 2024-06-15; 2024-08-08; 2025-02-15
- accessedDate: 2026-08-23
- independence: 서로 다른 계정이지만 같은 BookLive 플랫폼 family다. Source B와는 독립이다.
- evaluatedRange: 정확히 1권
- directObservation: 전투와 가족·가게 일상의 간극에서 웃음이 반복된다는 구체 관찰이 여러 계정에서 일치한다.
- limitation: 인기·별점·애니메이션 언급은 제외했다.

### Axis 결론

- comedy=4: candidate-known. Source A가 battle과 comedy의 결합을 공식 핵심으로 제시하고, Source B가 1~2권의 서로 다른 화에 반복 예시를 연결하며, Source C 복수 계정도 1권의 지속적 웃음을 관찰한다.
- progression: closed-unknown. 동료 합류나 관계 확대를 성장·획득·숙련 보상으로 자동 변환하지 않았다.
- problemSolving: closed-unknown. 위협에 대응하고 전투에서 강하다는 설명은 제약 분석과 기발한 해결 과정을 보여 주지 않는다.
- strategy: closed-unknown. 적 조직과 현상금의 존재는 장기 계획·정치·자원 운영의 중심성을 증명하지 않는다.
- mentalStress: closed-unknown. 위협과 지속적 심리 압박을 구분했다.
- romance: closed-unknown. 부부 관계의 존재와 romance 축 중심성을 구분했다.
- directEvidenceLinkage: comedy는 Source A의 공식 핵심 문구, Source B의 권·화 연결, Source C의 정확한 1권 관찰이 같은 진입 범위를 가리킨다. Narrative 축에는 방법 수준의 직접 근거가 없다.
- finalCandidateNarrative: U / U / U / 3 / 1 / 2 = 3/6
- finalCandidateTone: 3 / 2 / 4 / 2 / U / U / 2 = 5/7
- coverageAssessment: Tone은 후보 gate를 충족하지만 Narrative가 1축 부족하다.
- hardBlockerAssessment: false. Narrative Evidence 부족은 hard blocker가 아니다.

## 26. work-7975d62582a89492a35f — 図書館の大魔術師

### Source packet

#### Source A — 講談社 1~3권 공식 소개

- sourceName: 講談社 図書館の大魔術師 1권·2권·3권
- sourceUrl1: https://www.kodansha.co.jp/comic/products/0000115710
- sourceUrl2: https://www.kodansha.co.jp/comic/products/0000315327
- sourceUrl3: https://www.kodansha.co.jp/comic/products/0000323947
- publicationDate: 2018-04-06; 2018-11-07; 2019-08-07
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 1~3권
- directObservation: 3권에서 중앙도서관 사서 시험의 최종 실기와 팀 단위 과제가 진입부의 주요 에피소드임을 확인한다.
- limitation: 공식 소개는 과제의 해결 절차를 상세히 설명하지 않아 아래 정확한 3권 리뷰와 결합했다.

#### Source B — あるいは 逃げられぬ何か 3권 리뷰

- sourceName: あるいは 逃げられぬ何か 図書館の大魔術師 3권 감상
- sourceUrl: https://aruiha.hatenablog.jp/entry/Comic/TosyokannnoDaimajyutsushi/3
- publicationDate: 2019-08-26
- accessedDate: 2026-08-23
- independence: 출판사와 독립된 개인 블로그다.
- evaluatedRange: 정확히 3권
- directObservation: 팀별 제약, 단서 탐색, 다른 팀에 대한 질문, 구성원별 역할, 해결 과정 자체가 평가되는 구조를 구체적으로 기록한다.
- limitation: 단일 리뷰의 평가 문구는 사용하지 않고 과제 절차 관찰만 사용했다.

#### Source C — ごま書房 3권 리뷰

- sourceName: ごま書房 図書館の大魔術師 3권 감상
- sourceUrl: https://gomashelf.com/magusofthelibrary-3kan/
- publicationDate: 2019-08-07; 2026-06-23 갱신
- accessedDate: 2026-08-23
- independence: Source B와 저자·도메인이 다른 개인 블로그다.
- evaluatedRange: 정확히 3권
- directObservation: 제한된 도구와 시간 안에서 팀이 정보를 모으고 역할을 조정해 실기 문제를 푸는 과정을 관찰한다.
- limitation: 갱신일은 진입 범위가 아니라 페이지 유지 이력이다.

#### Source D — 凍った中華まん 3권 리뷰

- sourceName: 凍った中華まん 図書館の大魔術師 3권 감상
- sourceUrl: https://saavedra.hatenablog.com/entry/2019/10/18/202856
- publicationDate: 2019-10-18
- accessedDate: 2026-08-23
- independence: Source B·C와 저자·도메인이 다른 독립 블로그다.
- evaluatedRange: 정확히 3권
- directObservation: 사전과 도구 사용, 과제 조건 파악, 서로 다른 강점을 가진 구성원의 협업을 구체적으로 기록한다.
- limitation: 개인의 호불호는 제외하고 해결 과정의 반복 관찰만 사용했다.

### Axis 결론

- problemSolving=3: candidate-known. Source A가 공식 3권의 팀 실기 과제를 고정하고 Source B·C·D의 독립 리뷰가 제약 확인, 자료·도구 사용, 단서 탐색, 질문, 역할 조정이라는 해결 절차를 서로 보강한다. 전 작품이 퍼즐 해결만을 핵심으로 하지는 않아 4가 아니라 3을 제안한다.
- strategy: closed-unknown. 팀 역할 조정은 해당 실기 과제의 단기 계획이며 장기 전략·정치·자원 운영 중심성을 증명하지 않는다.
- mysteryReveal: closed-unknown. 단서 탐색이 있지만 비밀의 단계적 공개가 반복 보상이라는 근거는 부족하다.
- comedy: closed-unknown. 정확한 진입 범위에서 웃음의 반복 빈도를 확인하지 못했다.
- romance: closed-unknown. 중심성이나 반복적 부재를 직접 확인하지 못했다.
- directEvidenceLinkage: candidate는 공식 3권 범위와 세 독립 exact-volume 관찰의 같은 시험 에피소드에 직접 연결된다.
- finalCandidateNarrative: 4 / 3 / U / 3 / U / 4 = 4/6
- finalCandidateTone: 4 / 2 / U / 2 / 2 / U / 2 = 5/7
- coverageAssessment: candidate가 채택되면 Narrative 4/6, Tone 5/7로 text gate를 충족한다.
- hardBlockerAssessment: false. 확인되지 않은 축은 unknown으로 종결 가능하다.

## 27. work-7d259c925286a9f91310 — 聖☆おにいさん

### Source packet

#### Source A — 講談社 1~3권 공식 소개

- sourceName: 講談社 聖☆おにいさん 1권·2권·3권
- sourceUrl1: https://www.kodansha.co.jp/comic/products/0000013790
- sourceUrl2: https://www.kodansha.co.jp/comic/products/0000013847
- sourceUrl3: https://www.kodansha.co.jp/comic/products/0000013911
- publicationDate: 2008-01-23; 2008-07-23; 2009-03-23
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 1~3권
- directObservation: 두 성인이 휴가 중 동거하며 쇼핑, 인터넷, 계절 외출, 여행, 방문객을 겪는 평온한 일상 에피소드가 3권 연속 반복된다.
- limitation: 종교적 배경지식의 존재를 worldBuilding이나 mysteryReveal로 자동 변환하지 않았다.

#### Source B — ORICON NEWS 작가 인터뷰

- sourceName: ORICON NEWS 中村光 인터뷰
- sourceUrl: https://www.oricon.co.jp/special/55607/
- publicationDate: 2020-12-18; 2021-09-17 갱신
- accessedDate: 2026-08-23
- independence: 출판사 상품 페이지와 다른 매체의 작가 직접 발언이다.
- evaluatedRange: 작품의 지속 구조를 회고하며 진입부 일상 구조에도 적용되는 제작 원칙
- directObservation: 작가는 이 작품에서 인물의 성장을 다루기 어렵다고 명시하고, 강한 한 방보다 일상에서 이어지는 웃음을 만드는 작품 구조를 설명한다.
- limitation: 후대 인터뷰이므로 Source A의 1~3권 반복 구조와 일치하는 발언만 사용했다.

#### Source C — キリスト新聞社 3권 서평

- sourceName: キリスト新聞社 聖☆おにいさん 3권 서평
- sourceUrl: https://www.kirishin.com/book/13947/
- publicationDate: 페이지 메타데이터 2009-02-15; 2018-06-21 갱신
- accessedDate: 2026-08-23
- independence: 출판사와 독립된 전문 매체 서평이다.
- evaluatedRange: 정확히 3권
- directObservation: 휴가와 여행을 이어 가는 느슨한 일상 코미디를 3권의 지속 구조로 관찰한다.
- limitation: 메타데이터 날짜가 공식 3권 발매일보다 이르므로 날짜 이상을 그대로 기록하고 내용만 보조 Evidence로 사용한다.

#### Source D — BookLive 1권 리뷰 묶음

- sourceName: BookLive 聖☆おにいさん 1권 독자 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/42530/vol_no/001
- publicationDate: 2020-07-25; 2022-01-02; 2022-09-13
- accessedDate: 2026-08-23
- independence: 서로 다른 계정이지만 같은 BookLive 플랫폼 family다. Source B·C와는 독립이다.
- evaluatedRange: 정확히 1권; 한 계정은 1~2권
- directObservation: 평온하고 갈등이 낮은 동거 일상에서 중간 강도의 웃음이 계속된다는 관찰이 반복된다.
- limitation: 종교 지식에 관한 평가, 별점, 작품 전체 회고는 제외했다.

### Axis 결론

- progression=0: candidate-known. Source A의 1~3권이 성취·숙련 대신 동일한 휴가 일상을 반복하고, Source B의 작가 직접 발언이 이 작품에서 인물 성장을 보상 구조로 삼지 않음을 명시한다.
- comedy=4: candidate-known. Source A의 3권 연속 일상 에피소드, Source B의 제작 원칙, 정확한 권차 Source C·D가 웃음을 지속적 핵심 보상으로 함께 지지한다.
- darkness=0: candidate-known. Source A의 1~3권 공식 소개 전체와 Source C·D의 exact-volume 관찰이 잔혹·비극·암울 사건 대신 휴가·쇼핑·여행의 평온한 일상을 반복적으로 확인한다.
- mentalStress=0: candidate-known. 같은 1~3권 범위에서 지속적 불안·압박·긴장 구조가 아니라 갈등이 낮은 휴가 일상이 반복되고, Source D의 복수 계정 관찰도 이를 보강한다.
- problemSolving: closed-unknown. 일상 소동의 존재는 제약 분석과 기발한 해결이 핵심임을 증명하지 않는다.
- strategy: closed-unknown. 장기 계획·정치·자원 운영의 반복 구조를 확인하지 못했다.
- mysteryReveal: closed-unknown. 종교적 인용과 단계적 비밀 공개를 구분했다.
- characterArcWeight: closed-unknown. Source B는 성장이 핵심이 아니라는 방향을 지지하지만 characterArcWeight 0의 반복적 부재까지 직접 측정하지 않는다.
- romance: closed-unknown. 동거 관계와 romance 중심성을 구분했고, 반복적 부재를 별도로 확정하지 않았다.
- directEvidenceLinkage: progression은 Source A+B, comedy는 Source A+B+C+D, darkness와 mentalStress는 Source A의 1~3권 전체와 exact-volume Source C·D에 직접 연결된다. 0 후보는 다음 Pass B에서 특히 엄격히 재확인해야 한다.
- finalCandidateNarrative: 0 / U / U / 1 / U / 2 = 3/6
- finalCandidateTone: U / 2 / 4 / 0 / 0 / U / 2 = 5/7
- coverageAssessment: Tone은 후보 gate를 충족하지만 Narrative가 1축 부족하다.
- hardBlockerAssessment: false. unknown Narrative 축은 추천 계약의 다음 gate에서 평가할 문제이지 hard blocker가 아니다.

## 28. work-8147aefccc365b0ecb4d — 黒執事

### Source packet

#### Source A — SQUARE ENIX 1~3권 공식 소개

- sourceName: SQUARE ENIX 黒執事 1권·2권·3권
- sourceUrl1: https://magazine.jp.square-enix.com/top/comics/detail/9784757519633/
- sourceUrl2: https://magazine.jp.square-enix.com/top/comics/detail/9784757520639/
- sourceUrl3: https://magazine.jp.square-enix.com/top/comics/detail/9784757521926/
- publicationDate: 2007-02-27; 2007-07-27; 2007-12-18
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 1~3권
- directObservation: 진입부에서 연쇄 살인 사건을 조사하고 범인에 접근하는 2~3권 에피소드가 이어진다.
- limitation: 공식 소개만으로 조사 방법과 심리 압박의 정도를 수치화하지 않았다.

#### Source B — アニメイトタイムズ 원작 진입부 편집 해설

- sourceName: アニメイトタイムズ 黒執事 원작 에피소드 해설
- sourceUrl: https://www.animatetimes.com/news/details.php?id=1624006606
- publicationDate: 2021-06-19
- accessedDate: 2026-08-23
- independence: 출판사와 다른 전문 편집 매체다.
- evaluatedRange: 원작 2권 6화부터 3권 13화까지 명시
- directObservation: 시신 특징으로 용의자를 좁히고, 변장·잠입으로 확인하며, 범인을 붙잡으려는 조사 절차를 권·화 단위로 연결한다. 배신·살인·상실 사이에 하인들의 반복 코미디도 구분한다.
- limitation: 애니메이션 영상이 아니라 기사에서 명시한 원작 권·화와 줄거리 해설만 사용했다.

#### Source C — honto 2권 리뷰

- sourceName: honto 黒執事 2권 독자 리뷰
- sourceUrl: https://honto.jp/ebook/pd-review_0634949910.html
- publicationDate: 2021-01-10
- accessedDate: 2026-08-23
- independence: Source B와 플랫폼·작성자가 다른 독자 리뷰다.
- evaluatedRange: 정확히 2권
- directObservation: 단서 추적, 위장, 조사와 속임수가 사건 해결에 사용된다는 관찰을 제공한다.
- limitation: 단일 계정이므로 Source A·B의 조사 절차를 보조하는 데만 사용한다.

#### Source D — BookLive 2~3권 리뷰 묶음

- sourceName: BookLive 黒執事 2권·3권 독자 리뷰
- sourceUrl1: https://booklive.jp/review/list/title_id/884183/vol_no/002
- sourceUrl2: https://booklive.jp/review/list/title_id/884183/vol_no/003
- publicationDate: 2권 2009-10-07, 2021-01-16; 3권 2009-10-04, 2021-01-11
- accessedDate: 2026-08-23
- independence: 서로 다른 계정이지만 같은 BookLive 플랫폼 family다. Source B·C와는 독립이다.
- evaluatedRange: 정확히 2권과 3권
- directObservation: 사건의 슬픔·위험·배신이 긴장을 만들지만 하인들의 작은 소동과 웃음이 반복적으로 사이에 놓인다는 관찰이 권을 넘어 일치한다.
- limitation: 독자의 충격을 등장인물의 mentalStress로 그대로 바꾸지 않고, 사건 범위의 지속 압박만 보조했다.

### Axis 결론

- problemSolving=3: candidate-known. Source A가 공식 조사 사건을 고정하고 Source B가 단서로 용의자를 좁힌 뒤 변장·잠입·포획을 시도하는 절차를 원작 권·화에 연결한다. Source C도 exact-volume에서 같은 방법을 보강한다.
- comedy=2: candidate-known. Source B와 Source D의 여러 exact-volume 관찰이 살인 사건 사이 하인 소동과 작은 웃음을 반복 확인한다. 사건·복수가 중심이므로 혼합값 2다.
- mentalStress=2: candidate-known. Source A·B의 배신·살인·상실 위험과 Source D의 2~3권 관찰이 사건 긴장과 슬픔을 지속 범위에서 지지하지만, 절망이 작품 전체 보상을 지배하지 않아 2로 제한한다.
- progression: closed-unknown. 사건 진행과 능력 과시는 성장·획득·숙련 보상과 다르다.
- strategy: closed-unknown. 조사 에피소드의 단기 계획을 장기 전략값으로 중복 기록하지 않았다.
- romance: closed-unknown. 관계의 존재와 romance 중심성을 구분했다.
- emotionalWarmth: closed-unknown. 하인 소동의 웃음은 유대·힐링의 반복 보상과 다르다.
- directEvidenceLinkage: problemSolving은 Source A+B+C, comedy와 mentalStress는 Source A+B+D의 정확한 2~3권 사건에 연결된다.
- finalCandidateNarrative: U / 3 / U / 3 / 2 / 2 = 4/6
- finalCandidateTone: 2 / 2 / 2 / 2 / 2 / U / U = 5/7
- coverageAssessment: 세 candidate가 채택되면 Narrative 4/6, Tone 5/7로 text gate를 충족한다.
- hardBlockerAssessment: false. 남은 unknown 축은 승격 불가 사유가 아니다.

## 29. work-838a6f0ad2d1ef487588 — 信長協奏曲

### Source packet

#### Source A — 小学館 1~3권 공식 소개

- sourceName: 小学館eコミックストア 信長協奏曲 1권·2권·3권
- sourceUrl1: https://e-comi.shogakukan.co.jp/books/091221000000d0000000
- sourceUrl2: https://e-comi.shogakukan.co.jp/books/091222250000d0000000
- sourceUrl3: https://e-comi.shogakukan.co.jp/books/091225470000d0000000
- publicationDate: 웹 페이지는 undated
- accessedDate: 2026-08-23
- authority: 출판사 1차 자료
- evaluatedRange: 1~3권
- directObservation: 현대 학생이 전국시대의 織田信長 역할을 맡고, 3권에서 전투와 세력 운영에 직면하는 진입 구조를 확인한다.
- limitation: 역사·전쟁 장르만으로 strategy나 mentalStress 값을 만들지 않았다.

#### Source B — BookLive 1권 리뷰 묶음

- sourceName: BookLive 信長協奏曲 1권 독자 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/183297/vol_no/001
- publicationDate: 2012-05-12; 2020-07-13; 2022-09-13
- accessedDate: 2026-08-23
- independence: 서로 다른 계정이지만 같은 BookLive 플랫폼 family다.
- evaluatedRange: 정확히 1권
- directObservation: 주인공이 위기에서도 느긋하게 즉흥 대응하고, 시대 차이에서 작은 웃음이 반복된다는 관찰이 일치한다.
- limitation: 역사 지식 부족이라는 설정을 problemSolving의 낮은 값으로 자동 환산하지 않았다.

#### Source C — BookLive 3권 리뷰 묶음

- sourceName: BookLive 信長協奏曲 3권 독자 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/183297/vol_no/003
- publicationDate: 2012-06-05; 2020-07-13; 2022-09-13
- accessedDate: 2026-08-23
- independence: 서로 다른 계정이지만 Source B와 같은 BookLive family다.
- evaluatedRange: 정확히 3권
- directObservation: 전투·정책 상황에서 짧은 계획과 유연한 아이디어를 쓰지만, 주인공의 기본 대응은 빠르고 느긋하며 웃음이 섞인다는 관찰이 반복된다.
- limitation: 정책 언급만으로 장기 대전략값 4를 만들지 않았다.

#### Source D — honto 3권 리뷰

- sourceName: honto 信長協奏曲 3권 독자 리뷰
- sourceUrl: https://honto.jp/ebook/pd_34956228.html
- publicationDate: 2012-02-13
- accessedDate: 2026-08-23
- independence: BookLive와 다른 플랫폼의 독립 계정이다.
- evaluatedRange: 정확히 3권
- directObservation: 전투의 높은 위험에도 주인공이 급격한 심리 붕괴보다 느긋한 판단으로 초기 승리를 이어 간다는 관찰을 제공한다.
- limitation: 단일 계정이므로 Source A와 Source C의 exact-volume 관찰을 보조하는 데만 사용한다.

### Axis 결론

- strategy=2: candidate-known. Source A의 3권 전투·세력 상황에서 Source C가 정책, 짧은 계획, 유연한 아이디어를 반복 관찰한다. 장기 계획·자원 운영이 핵심이라는 증거보다 즉흥성이 강하므로 전술 혼합값 2를 제안한다.
- comedy=2: candidate-known. Source B·C의 서로 다른 1권·3권 계정이 시대 차이와 느긋한 대응에서 작은 웃음이 반복된다고 관찰한다. 역사·전투와 병존하므로 2다.
- mentalStress=1: candidate-known. Source A가 전투와 잠입 위험을 확인하지만 Source B·C·D는 진입부의 주인공이 지속 불안보다 느긋하고 빠르게 대응한다고 반복 관찰한다. 위험이 전혀 없지는 않아 0이 아니라 1을 제안한다.
- progression: closed-unknown. 역사적 지위와 승리의 누적은 반복 성장·획득·숙련 보상인지 직접 확인되지 않았다.
- problemSolving: closed-unknown. 유연한 발상은 있지만 제약 분석과 기발한 해결이 작품의 반복 중심이라는 근거가 부족하다.
- romance: closed-unknown. 진입 범위의 중심성 또는 반복적 부재를 확인하지 못했다.
- emotionalWarmth: closed-unknown. 동료 관계와 유대·힐링 보상의 중심성을 구분했다.
- directEvidenceLinkage: 세 후보 모두 Source A의 공식 1~3권 범위와 정확한 권차 Source B·C에 대응하며 Source D는 3권 관찰만 보조한다.
- finalCandidateNarrative: U / U / 2 / 4 / 2 / 3 = 4/6
- finalCandidateTone: 3 / 2 / 2 / 2 / 1 / U / U = 5/7
- coverageAssessment: 세 candidate가 채택되면 Narrative 4/6, Tone 5/7로 text gate를 충족한다.
- hardBlockerAssessment: false. remaining unknown은 Evidence 한계이며 hard blocker가 아니다.

## 30. work-83fc3c4366e51b35b821 — 風と木の詩

### Source packet

#### Source A — frozen 원판 서지

- sourceName: 楽天ブックス 風と木の詩 원판 1권 서지
- sourceUrl: https://books.rakuten.co.jp/rb/379720/
- publicationDate: 1977-04-30
- accessedDate: 2026-08-23
- authority: frozen ISBN 서점 서지
- evaluatedRange: frozen 대표 ISBN 9784091302212인 원판 1권
- directObservation: 원판 1권의 제목, 발행 시기, 대표 ISBN을 확인한다.
- limitation: 내부 목차나 장면 범위는 제공하지 않는다.

#### Source B — 白泉社 문고판 1~3권 공식 서지

- sourceName: 白泉社 風と木の詩 문고판 1권·2권·3권
- sourceUrl1: https://www.hakusensha.co.jp/comicslist/41720/
- sourceUrl2: https://www.hakusensha.co.jp/comicslist/41722/
- sourceUrl3: https://www.hakusensha.co.jp/comicslist/41724/
- publicationDate: 1995-03-17; 1995-03-17; 1995-05-19
- accessedDate: 2026-08-23
- authority: 후대 문고판 출판사 1차 자료
- evaluatedRange: 문고판 1~3권
- directObservation: 후대 문고판의 별도 ISBN과 권별 서지를 확인한다.
- limitation: frozen 小学館 원판 1권의 수록 범위와 문고판 각 권의 대응 관계를 설명하지 않는다.

#### Source C — 작가 공식 작품 이력

- sourceName: 竹宮惠子 공식 사이트 작품 소개
- sourceUrl: https://k-takemiya.jp/works1.html
- publicationDate: 페이지 갱신 2026-04-23
- accessedDate: 2026-08-23
- authority: 작가 공식 1차 자료
- evaluatedRange: 작품 총론과 발표 이력
- directObservation: 작품 정체성과 발표 이력, 진입 설정은 확인된다.
- limitation: 원판 권·페이지와 후대 문고판을 연결하는 목차 또는 contents bridge가 없다. 총론의 민감한 사건을 원판 1~3권에 자동 배치하지 않았다.

### Axis 결론

- progression: closed-unknown. frozen 원판의 진입 장면 범위를 확정하지 못했다.
- problemSolving: closed-unknown.
- strategy: closed-unknown.
- pacing: closed-unknown.
- mysteryReveal: closed-unknown.
- worldBuilding: closed-unknown.
- characterArcWeight: closed-unknown.
- relationshipStructure: closed-unknown.
- comedy: closed-unknown.
- darkness: closed-unknown. 작품 총론의 민감한 사건을 원판 1~3권 범위에 투영하지 않았다.
- mentalStress: closed-unknown. 같은 판본 범위 한계가 있다.
- romance: closed-unknown.
- emotionalWarmth: closed-unknown.
- directEvidenceLinkage: Source A는 frozen 원판 서지만, Source B는 후대 문고판 서지만, Source C는 작품 총론만 제공한다. 공식 contents bridge가 없어 candidate-known을 제안하지 않는다.
- finalCandidateNarrative: U / U / U / U / U / U = 0/6
- finalCandidateTone: U / U / U / U / U / U / U = 0/7
- coverageAssessment: Narrative 4축, Tone 5축이 더 필요하다.
- hardBlockerAssessment: false. 판본 bridge 미확인은 현재 text Evidence의 hard stop이지만 canonical identity·scope·safety promotion blocker를 이 연구 패스에서 확정하지 않는다.

## 산출물 검증

- expectedWorks: 10
- expectedCandidateKnownWorks: 8
- expectedCandidateKnownAxes: 17
- expectedClosedUnknownOnlyWorks: 2
- expectedTextGatePassCandidates: 3
- expectedTextGateFailRemaining: 7
- expectedHardBlockers: 0
- sourceRecords: 33
- uniqueSourceUrls: 58
- urlLiveVerification: HTTP 200 = 58; non-200 = 0
- canonicalTitleDelimiterCount: 0
- outputSha256: 자기참조를 피하기 위해 파일을 닫은 뒤 계산하여 상위 batch 원장에 전달한다.
