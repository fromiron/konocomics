# Batch 002 text coverage gap research — chunk 05

- batchId: batch-002
- sourceChunk: chunk-05
- scope: round-01 coverage gap 10작품, frozen positions 41–50
- evaluatedRange: 작품별 진입 1~3권, 2권 완결작은 전 2권
- retrievedAt: 2026-08-23
- reviewedByHuman: false
- outputKind: supplemental Pass A evidence packet
- decisionBoundary: 이 문서는 candidate-known, candidate Genre·Theme 또는
  closed-unknown만 제안한다. 독립 검수, adjudication, source data 반영,
  promotion 판정은 수행하지 않는다.
- editionBoundary: `うさぎドロップ`, `夢の碑`, `おそ松くん`은 아래 판본 브리지가
  성립하는 범위에만 후속 판단을 제한한다. 신장판 추가분, 현행 재편집 collection의
  미매핑 수록작, 영상 각색은 사용하지 않는다.

## 동결 입력

| Input                                         | SHA-256                                                          |
| --------------------------------------------- | ---------------------------------------------------------------- |
| docs/factors/factor-dictionary.md             | a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be |
| docs/catalog-expansion/01-promotion-method.md | 6961436ed7f2b326f11a725b5ac40e4b2148d6b70a62ff5eb977b6b747ba97bd |
| annotation-review-adjudication-request.md     | ca34d38bc87e58603014142a0abfd6fb886cbdbeb7e917414f2874cd387fdeb2 |
| adjudication/text-chunk-05-round-01.md        | aec776f74dc872e4ba65478180699daf601211953c1e722f71222fd7b36ce2e3 |
| adjudication/text-gap-queue-chunk-05.csv      | 08bb055efd5daeec01d63e3bd85d9ffc2258e2a00311c1977b9a8696798948f0 |
| research/chunk-05.md                          | acc50bd535669e00a1bc115cfed4203835f5e9e76a9218f196eb6124f3fcb02c |
| frozen-work-set.csv                           | 80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6 |
| adjudication/identity-chunk-05.md             | b5f8a5aa33157e05d7fa39a9da75f586aabaaf7b5aa28616dd18ee48c47d273d |
| reviews/identity-safety-chunk-05.md           | dbef5daf9a8308842ab6bea2445462c6ff3dab7cfdc8232c4e181c4eb6c69f75 |

## 적용 규칙

- 공식 출판사 1~3권 소개, 공식 작품 페이지, 작가·편집자 인터뷰를 우선했다.
- Genre에서 Axis를 만들지 않았다. 별점, 판매량, 선정 목록 등재, 단일 감상,
  범위가 불명확한 회고도 Factor Evidence로 사용하지 않았다.
- 복수 유저평은 정확한 권 범위를 밝힌 서로 다른 작성자의 구체 관찰이 공식 자료와
  반복될 때만 보조했다. 같은 전자서점의 계정은 서로 다른 작성자로 구분하되 source
  family는 하나로 계산했다.
- 리뷰가 다른 플랫폼에 복제된 흔적이 있으면 독립 출처로 중복 계산하지 않았다.
- 0 후보는 진입 범위가 유한하고 공식 권 구성과 반복 구조가 함께 부재를 지지할 때만
  냈다. 0도 다음 독립 검수에서 높은 문턱으로 다시 확인해야 한다.
- 1과 3은 Dictionary의 0·2 또는 2·4 anchor 사이의 관찰일 때만 썼다.
- candidate-known은 Pass B와 Pass C의 입력일 뿐 확정값이 아니다.
  closed-unknown은 낮은 값이 아니라 이번 유한 조사 route에서 책임 있게 정하지
  못했다는 종결 상태다.
- 아래 인용 대상의 표현은 모두 요약했다. 리뷰 원문이나 인터뷰 문장을 사용자 설명으로
  복사하지 않았다.

## 판본 브리지 결과

| Work           | Bridge result | 재현 가능한 연결                                                                                                                                                                    | 제외 경계                                                                                       |
| -------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| うさぎドロップ | resolved      | 祥伝社 주문서의 원판 1–3권 ISBN과 BookLive 원판 1–3권의 ISBN이 권차별로 정확히 일치한다. frozen ISBN `9784396763800`도 1권에 직접 일치한다.                                         | 별도 ISBN의 FCswing 신장판과 그 추가 자료는 사용하지 않는다.                                    |
| 夢の碑         | resolved      | 작가 직접 인터뷰의 판본표가 PF 1권에 `桜の森の桜の闇`·`とりかえばや異聞`, PF 2권에 `とりかえばや異聞`·`青頭巾`, PF 3권에 `ベルンシュタイン`을 연결한다.                             | 현행 story collection의 그 밖의 추가 수록작은 PF 1–3권에 전용하지 않는다.                       |
| おそ松くん     | unresolved    | frozen ボンボンKC 1–3권 identity는 확인됐다. 문화청 보고서의 판본 등치는 실물 미확인 metadata이며 ebookJapan 1·2권 ISBN도 frozen판과 다르므로 수록 내용의 동일성을 입증하지 못한다. | 후속작 `おそ松さん`, 애니메이션, revival 또는 ebookJapan판의 내용을 frozen entry에 섞지 않는다. |

브리지의 의미는 텍스트 평가 범위의 연결이다. 해결된 두 경우도 이미지·페이지가 같은
판본이라는 Art bridge로 사용하지 않는다. `おそ松くん`은 identity bridge만 성립했고
contents bridge는 실패했으므로 Work-level 공식 Genre 외의 텍스트 판단을 unknown으로
종결한다.

## 결과 요약

Axis 표기 순서는 Narrative가 progression / problemSolving / strategy / pacing /
mysteryReveal / worldBuilding, Tone이 characterArcWeight / relationshipStructure /
comedy / darkness / mentalStress / romance / emotionalWarmth다. U는 unknown이다.

| Pos | workId                    | canonicalTitle         | Round-01 N/T | 추가 candidate-known                                                                                                                                   | 보강 후 후보 N/T | Genre·Theme 후보                                                                                | Gate 예상            | hardBlocker |
| --: | ------------------------- | ---------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ----------------------------------------------------------------------------------------------- | -------------------- | ----------- |
|  41 | work-ccf0ddff9c6410c4de14 | サンキューピッチ       | 5/6, 3/7     | comedy=4; emotionalWarmth=2                                                                                                                            | 5/6, 5/7         | retained `sports`; `school:1;sportsCompetition:2`                                               | pass                 | false       |
|  42 | work-cdef8cfd678998a51447 | うさぎドロップ         | 0/6, 0/7     | progression=2; problemSolving=1; pacing=2; mysteryReveal=2; characterArcWeight=4; relationshipStructure=2; comedy=2; mentalStress=2; emotionalWarmth=4 | 4/6, 5/7         | retained `sliceOfLife`; add `foundFamily:2`                                                     | pass                 | false       |
|  43 | work-ced7a8e6d9c3b8147702 | 水は海に向かって流れる | 2/6, 4/7     | progression=2; problemSolving=1; emotionalWarmth=2                                                                                                     | 4/6, 5/7         | retained `sliceOfLife`; add `foundFamily:2`                                                     | pass                 | false       |
|  44 | work-daf65c6f2cce3e076dfa | 凪のお暇               | 1/6, 6/7     | progression=2; problemSolving=2; strategy=1                                                                                                            | 4/6, 6/7         | retained `sliceOfLife;romance`; `workplace:1`                                                   | pass                 | false       |
|  45 | work-db80d94709b62aa8823f | 逃げ上手の若君         | 5/6, 3/7     | comedy=2; mentalStress=2                                                                                                                               | 5/6, 5/7         | retained `action;historical`; `combat:1;war:2;politics:1;survival:2;historicalReconstruction:2` | pass                 | false       |
|  46 | work-ef1bdac46a0956a87f7f | タコピーの原罪         | 1/6, 3/7     | problemSolving=1; mysteryReveal=4; worldBuilding=2; mentalStress=4; romance=0                                                                          | 4/6, 5/7         | retained `scienceFiction`; `school:1`                                                           | pass 후보            | false       |
|  47 | work-f5847c45d30753150364 | 闇のパープル・アイ     | 3/6, 4/7     | problemSolving=1; mentalStress=4                                                                                                                       | 4/6, 5/7         | retained `fantasy;horror`; `survival:1;revenge:1`                                               | pass                 | false       |
|  48 | work-fabc7f5d853e361acaf3 | YAIBA                  | 3/6, 3/7     | problemSolving=1; comedy=4; mentalStress=1                                                                                                             | 4/6, 5/7         | retained `action;fantasy`; `combat:2;martialArts:2`                                             | pass                 | false       |
|  49 | work-fb7a0ed6a88db7d7bc71 | 夢の碑                 | 0/6, 0/7     | strategy=2; pacing=3; mysteryReveal=2; worldBuilding=4; characterArcWeight=4; relationshipStructure=2; darkness=3; mentalStress=3; romance=4           | 4/6, 5/7         | add `fantasy;historical;romance`; `war:1;politics:1;historicalReconstruction:2`                 | pass 후보            | false       |
|  50 | work-fd88144bf7334c4aae39 | おそ松くん             | 0/6, 0/7     | none; representative-edition contents bridge unresolved                                                                                                | 0/6, 0/7         | add Work-level `comedy`; Theme none                                                             | fail, closed unknown | false       |

- candidate-known: 9작품, 38축
- text coverage pass 예상: 9작품. 0 후보가 있는 `タコピーの原罪`은 독립 검수에서 같은 높은
  문턱을 통과할 때만 pass다.
- edition contents bridge resolved: 2작품; unresolved: 1작품
- candidate Genre additions: 2작품, 4개 tag
- candidate Theme additions: 3작품, 5개 Theme
- closed-unknown: 필요한 known 수를 맞추기 위해 남은 축을 채우지 않았다.
- hard blocker 후보: 0작품

## 41. work-ccf0ddff9c6410c4de14 — サンキューピッチ

### Source packet

#### Source A — 集英社 표준판 1~3권 공식 소개

- sourceName: 集英社 サンキューピッチ 1권·2권·3권
- sourceUrl1: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884305-6
- sourceUrl2: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884499-2
- sourceUrl3: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884668-2
- publishedAt: 2025-01-04; 2025-05-02; 2025-10-03
- retrievedAt: 2026-08-23
- evaluatedRange: frozen 표준판 1~3권
- directObservation: 제한 투구의 비밀, 팀 영입, 연습 경기, 선수의 과거 압박,
  팀 전술과 벤치 선발이 이어진다. 승부의 긴장과 팀 관계가 함께 존재한다.
- limitation: 권 소개만으로 웃음의 빈도나 따뜻함을 확정하지 않는다.

#### Source B — マンガ大賞 2026 복수 심사 코멘트

- sourceName: マンガ大賞 2026 サンキューピッチ 심사 코멘트
- sourceUrl: https://www.mangataisho.com/data/2026/comment2026.pdf
- publishedAt: 2026
- retrievedAt: 2026-08-23
- evaluatedRange: 심사 시 공개된 1~3권 범위
- independence: 직업과 소속이 다른 복수 심사자가 이름과 소속을 밝힌 별도 코멘트를
  제출했다. 공식 심사 패널 하나로 계산한다.
- directObservation: 여러 심사자가 인물들의 지속적인 말장난과 상호 반응, 매 화의
  웃음, 진지한 승부 사이의 열기와 팀 유대를 반복 관찰한다.
- conflict: 유머의 강도에는 큰 불일치가 없지만, 작품의 핵심을 전략으로 보는 관찰도
  많다. 따라서 따뜻함은 핵심값 4가 아니라 혼합값 2로 제한한다.

#### Source C — 정확한 1~3권 독립 리뷰 2건

- sourceName: note サンキューピッチ 1~3권 리뷰 2건
- sourceUrl1: https://note.com/yumyumyomi/n/ne51f637d4344
- sourceUrl2: https://note.com/tatsuya0508/n/n0af0e1234a63
- publishedAt: 2025-10-06; 2025-10-11
- retrievedAt: 2026-08-23
- evaluatedRange: 두 작성자 모두 정확히 1~3권이라고 명시
- independence: 서로 다른 작성자·계정이다. 같은 note 플랫폼 family 하나로 계산하며,
  한 리뷰가 포함한 외부 SNS 인용은 별도 출처로 세지 않았다.
- directObservation: 두 리뷰가 서로 다른 장면을 들어 지속적인 비정상적 대화 유머,
  팀원 간 신뢰와 단결, 진지한 야구 열기를 관찰한다.
- limitation: 개인의 캐릭터 선호와 작품 추천 문장은 제외했다.

### Axis 결론

- comedy=4: candidate-known, confidence 0.96. Source B의 복수 심사자가 상시 대화
  유머와 매 화의 웃음을 반복하고 Source C가 정확한 1~3권에서 교차한다. Dictionary의
  `개그가 상시 또는 핵심` 4 anchor에 직접 대응한다.
- emotionalWarmth=2: candidate-known, confidence 0.74. Source A의 팀 변화와 Source
  B·C의 신뢰·단결이 반복되지만 심리전과 경기 압박도 크다. Dictionary의 `혼합` 2
  anchor다.
- darkness, romance: closed-unknown. 유머가 높다고 darkness가 자동으로 0이 되지
  않으며, 팀 유대를 romance 부재 근거로 쓰지 않았다.
- retainedRound01: Narrative `U / 2 / 2 / 2 / 2 / 2`; Tone known
  `characterArcWeight=2;relationshipStructure=2;mentalStress=2`.
- finalCandidateTone: `2 / 2 / 4 / U / 2 / U / 2` = 5/7.
- coverageAssessment: 두 후보가 채택되면 Tone 5/7로 text gate를 충족한다.
- hardBlockerAssessment: false.

## 42. work-cdef8cfd678998a51447 — うさぎドロップ

### Original-edition bridge

#### Bridge Source A — 祥伝社 주문서

- sourceName: 祥伝社 2026년 2월 코믹스 주문서
- sourceUrl: https://www.shodensha.co.jp/pop/comic_202602.pdf
- publishedAt: 2026-02
- retrievedAt: 2026-08-23
- bridgeObservation: 원판 1~3권 ISBN은 `9784396763800`, `9784396764005`,
  `9784396764210`이며 frozen 대표 ISBN은 첫 값과 일치한다. 신장판은 별도 ISBN으로
  분리된다.

#### Bridge Source B — 원판 권별 상품·리뷰 route

- sourceName: BookLive うさぎドロップ 원판 1권·2권·3권
- sourceUrl1: https://booklive.jp/product/index/title_id/43150/vol_no/001
- sourceUrl2: https://booklive.jp/product/index/title_id/43150/vol_no/002
- sourceUrl3: https://booklive.jp/product/index/title_id/43150/vol_no/003
- publishedAt: 원판 발행 2006–2008; 전자 상품 페이지 자체 게시일 무기재
- retrievedAt: 2026-08-23
- bridgeObservation: 각 route의 ISBN이 Bridge Source A의 원판 ISBN과 권차별로
  정확히 일치하고, 동일 title ID 안에서 원판 1→2→3권으로 연결된다.
- limitation: 사용자 리뷰는 해당 원판 route의 보조 텍스트일 뿐 판본 identity를
  변경하지 않는다.

#### Bridge Source C — 별도 판매자 교차 확인

- sourceName: Yahoo!ショッピング ebookjapan うさぎドロップ 1권
- sourceUrl: https://store.shopping.yahoo.co.jp/ebookjapan/b00060046192.html
- publishedAt: undated product page; bibliographic year 2006
- retrievedAt: 2026-08-23
- bridgeObservation: 1권에 frozen ISBN `9784396763800`, ebookJapan title
  `EB-118733`, volume item `A000046192`가 함께 표시된다.
- independence: Bridge Source A의 출판사와 Bridge Source B의 BookLive와 다른 판매자
  route다.

Bridge verdict: resolved. 아래 판단은 원판 1~3권 route에만 한정한다.

### Factor sources

#### Source D — 祥伝社 공식 연재 소개

- sourceName: 祥伝社 マンガJam うさぎドロップ
- sourceUrl: https://www.shodensha.co.jp/mangajam/jam012.html
- publishedAt: page undated; referenced work year 2005
- retrievedAt: 2026-08-23
- evaluatedRange: 공식 첫 주요 에피소드
- directObservation: 장례에서 여섯 살 아이를 만난 성인이 즉흥적으로 함께 살기로
  결정하고, 익숙하지 않은 양육을 시작한다.
- limitation: 권별 지속성은 Source B에서만 보완한다.

#### Source E — 원판 1~3권 상품 소개와 scoped reviews

- sourceName: BookLive うさぎドロップ 원판 1~3권 소개·리뷰
- sourceUrl1: https://booklive.jp/review/list/title_id/43150/vol_no/001
- sourceUrl2: https://booklive.jp/review/list/title_id/43150/vol_no/002
- sourceUrl3: https://booklive.jp/review/list/title_id/43150/vol_no/003
- publishedAt: 원판 권별 소개 2006–2008; 독자 리뷰 2007–2026
- retrievedAt: 2026-08-23
- evaluatedRange: bridge가 확인된 원판 1~3권
- independence: 권 소개는 판매자 편집 copy다. 사용한 리뷰는 서로 다른 작성자지만
  BookLive family 하나로만 계산했다.
- directObservation: 보육·직장 조정, 실종된 생모의 단서와 대면, 초등학교 입학과
  또래 관계, 보호자와 아이의 상호 성장이 1→3권에 걸쳐 이어진다. 복수 리뷰는 일상적
  부담과 작은 웃음, 상호 성장, 안정된 유대를 반복한다.
- conflict: 부담의 체감 강도는 리뷰마다 다르다. 따라서 mentalStress는 4가 아니라 2다.
- limitation: 5권 이후의 시간 이동과 관계 변화는 제외했다.

### Axis·Theme 결론

- progression=2: candidate-known, confidence 0.90. 아이와 보호자가 생활 단계마다
  서로 배우고 성장하지만 숙련 보상이 반복적으로 전면화되는 4는 아니다.
- problemSolving=1: candidate-known, confidence 0.72. 보육·직장·입학 준비와 생모
  탐색에 직접 행동과 일부 단서 추적이 섞이지만, 기발한 제약 분석이 핵심은 아니다.
  Dictionary의 감정적·직접 결단 0과 지략·직접 행동 혼합 2 사이 값이다.
- pacing=2: candidate-known, confidence 0.86. 공동생활 시작, 생모 단서, 입학이라는
  Arc 단위 변화가 있으므로 Dictionary 2 anchor다.
- mysteryReveal=2: candidate-known, confidence 0.82. 출생 비밀, 유언 단서와 생모
  대면이 일부 전개의 보상이지만 작품 전부가 추리·공개 구조는 아니다.
- characterArcWeight=4: candidate-known, confidence 0.94. 보호자와 아이의 동기·변화·
  관계가 원판 1~3권의 지속적 핵심 보상으로 Dictionary 4에 직접 대응한다.
- relationshipStructure=2: candidate-known, confidence 0.90. 두 주인공과 반복되는
  가족·또래 핵심 조연 구조이며 복잡한 군상극은 아니다.
- comedy=2: candidate-known, confidence 0.79. 양육의 어긋남과 일상 장면에서 작은
  웃음이 여러 권에 반복되지만 상시 개그 4는 아니다.
- mentalStress=2: candidate-known, confidence 0.78. 양육·직장 조정과 출생 문제의
  긴장이 안정과 작은 성취로 완화되므로 `긴장과 답답함이 혼합` anchor다.
- emotionalWarmth=4: candidate-known, confidence 0.93. 함께 사는 유대와 상호 돌봄,
  일상의 안정이 1~3권 핵심 보상이다.
- strategy, worldBuilding, darkness, romance: closed-unknown. 생활 계획을 장기 전략으로
  확대하지 않았고, 진입부의 보호 관계에 후반부 기억을 섞지 않았다.
- Genre `sliceOfLife`: retained.
- Theme `foundFamily:2`: candidate, confidence 0.95. 혈연상 모호한 두 사람이 선택한
  공동생활과 돌봄이 세 권의 반복적 핵심 구조다.
- finalCandidateNarrative: `2 / 1 / U / 2 / 2 / U` = 4/6.
- finalCandidateTone: `4 / 2 / 2 / U / 2 / U / 4` = 5/7.
- coverageAssessment: 브리지와 아홉 후보가 Pass B를 통과하면 양 그룹 text gate 및
  Theme 계약을 충족한다.
- hardBlockerAssessment: false.

## 43. work-ced7a8e6d9c3b8147702 — 水は海に向かって流れる

### Source packet

#### Source A — 講談社 표준판 전 3권

- sourceName: 講談社 水は海に向かって流れる 1권·2권·3권
- sourceUrl1: https://www.kodansha.co.jp/comic/products/0000319530
- sourceUrl2: https://www.kodansha.co.jp/comic/products/0000327242
- sourceUrl3: https://www.kodansha.co.jp/comic/products/0000344116
- publishedAt: 2019-05-09; 2019-12-09; 2020-09-09
- retrievedAt: 2026-08-23
- evaluatedRange: frozen 표준판 1~3권 전편
- directObservation: 공동생활, 양가의 오래된 불륜 사실, 대응과 회피, 당사자 대면,
  억눌린 감정과 과거를 다루는 과정이 완결까지 이어진다.
- limitation: 가족사를 로맨스나 mystery Genre로 자동 전환하지 않는다.

#### Source B — 講談社 전 3권 편집 리뷰

- sourceName: 講談社 今日のおすすめ 水は海に向かって流れる
- sourceUrl: https://news.kodansha.co.jp/comics/9673
- publishedAt: 2023-04-13
- retrievedAt: 2026-08-23
- evaluatedRange: 전 3권을 명시적으로 다루는 출판사 소유 편집 기사
- directObservation: 함께 사는 사람들이 각자의 고통을 건드리지 않으면서 지지하고,
  주인공이 해결책이 없다고 여겨지는 가족 문제에 계속 직접 반응해 한 답에 이르는
  과정을 관찰한다.
- conflict: 기사는 시간 체감이 느려졌다 빨라진다고 함께 관찰한다. pacing은 round-01의
  3을 유지하고 새 값으로 덮지 않는다.

#### Source C — 전 3권 전자서점 소개·리뷰

- sourceName: コミックシーモア 水は海に向かって流れる 전 3권
- sourceUrl: https://www.cmoa.jp/title/174149/?disp_mode=easy&order=up&page=1
- publishedAt: 전자판 2019–2020; 리뷰 2019–2024
- retrievedAt: 2026-08-23
- evaluatedRange: 표준판과 같은 전 3권 완결 범위
- independence: Source B와 다른 플랫폼이다. 서로 다른 리뷰 계정은 CMOA family
  하나로 계산했다.
- directObservation: 여러 작성자가 가족사에 맞서는 주인공의 변화, 공동생활자의 지지,
  무거운 감정과 따뜻한 여운의 혼합을 구체적으로 반복한다.
- limitation: 영화 각색 감상과 별점만 있는 항목은 제외했다.

### Axis·Theme 결론

- progression=2: candidate-known, confidence 0.86. 인물들이 과거를 회피하는 상태에서
  대면하고 감정을 다룰 수 있는 상태로 서서히 이동한다. Dictionary의 느린 성장 2다.
- problemSolving=1: candidate-known, confidence 0.76. 명확한 해결책이 없는 문제에
  대화·회피·직접 대면이 섞이며, 제약 분석과 기발한 해결이 보상은 아니다. 0과 2 사이
  값이다.
- emotionalWarmth=2: candidate-known, confidence 0.84. 공동생활자의 조용한 지지와
  가족 밖의 안전한 관계가 반복되지만 죄책감·긴장도 크므로 혼합값 2다.
- comedy, romance, worldBuilding: closed-unknown. 편집 기사의 가족 중심 결론을 comedy
  또는 romance 값으로 변환하지 않았다.
- retainedRound01: Narrative `pacing=3;mysteryReveal=3`; Tone
  `characterArcWeight=4;relationshipStructure=3;darkness=2;mentalStress=3`;
  Genre `sliceOfLife`.
- Theme `foundFamily:2`: candidate, confidence 0.91. 출판사 편집 기사가 가족을 떠나
  시작되는 가족 이야기로 전 3권을 규정하고, 선택된 공동생활의 지지가 반복적 핵심이다.
- finalCandidateNarrative: `2 / 1 / U / 3 / 3 / U` = 4/6.
- finalCandidateTone: `4 / 3 / U / 2 / 3 / U / 2` = 5/7.
- coverageAssessment: 세 후보와 Theme가 채택되면 text gate와 Theme 계약을 충족한다.
- hardBlockerAssessment: false.

## 44. work-daf65c6f2cce3e076dfa — 凪のお暇

### Source packet

#### Source A — 秋田書店 표준판 1~3권

- sourceName: 秋田書店 凪のお暇 1권·2권·3권
- sourceUrl1: https://www.akitashoten.co.jp/comics/4253156371
- sourceUrl2: https://www.akitashoten.co.jp/comics/425315638X
- sourceUrl3: https://www.akitashoten.co.jp/comics/4253156401
- publishedAt: 2017-06-16; 2017-11-16; 2018-01-16
- retrievedAt: 2026-08-23
- evaluatedRange: frozen 표준판 1~3권
- directObservation: 직장·연애·주거를 끊고 100만 엔으로 생활을 다시 시작한 뒤,
  편안한 새 관계, 새 감정, 절약과 생활 재구성의 선택이 이어진다.
- limitation: 생활 재시작 premise만으로 progression을 만들지 않고 인터뷰와 교차했다.

#### Source B — 작가 직접 인터뷰 2건

- sourceName: ananweb コナリミサト 인터뷰; コミックナタリー コナリミサト 인터뷰
- sourceUrl1: https://ananweb.jp/categories/entertainment/11164/
- sourceUrl2: https://natalie.mu/comic/pp/engawa/page/3
- publishedAt: 2017; 2018
- retrievedAt: 2026-08-23
- evaluatedRange: 작품 초기 설계와 1~3권에 반복되는 생활 장치
- independence: 서로 다른 편집 매체의 별도 작가 인터뷰다.
- directObservation: 작가는 초기에 회차마다 하나의 절약·생활 요령을 배치했고,
  타인에게 맞추던 인물이 자신을 다시 세우는 인간극으로 중심이 이동했다고 설명한다.
  저축 목표와 생활 목록도 단기 선택의 구조로 반복된다.
- conflict: 후속 인터뷰는 생활 요령보다 인간극이 중심이 되었다고 설명한다. 이 때문에
  problemSolving은 4가 아니라 2, strategy는 2가 아니라 1로 제한한다.

#### Source C — 초기 3권 작가 인터뷰 보조

- sourceName: ねとらぼ コナリミサト 인터뷰
- sourceUrl: https://nlab.itmedia.co.jp/cont/articles/3283685/amp/
- publishedAt: 2018-10-16
- retrievedAt: 2026-08-23
- evaluatedRange: 3권까지의 독자 반응과 생활 재구성 장치
- directObservation: 작가가 절약 팁과 주인공의 희망 목록을 초기 구조로 다시 설명한다.
- limitation: 인터뷰 이후 연재분 사례는 진입 1~3권 판단에서 제외했다.

### Axis 결론

- progression=2: candidate-known, confidence 0.90. 타인에게 맞추던 상태에서 생활과
  관계의 선택을 다시 배우는 변화가 서서히 누적되어 Dictionary 2에 대응한다.
- problemSolving=2: candidate-known, confidence 0.83. 절약·생활 요령과 직접 행동이
  반복되지만 기발한 제약 분석이 작품의 핵심 보상은 아니므로 2다.
- strategy=1: candidate-known, confidence 0.72. 저축 목표와 생활 목록 같은 단기 계획이
  있으나 장기 계획·자원 운영 중심 4나 명확한 전술 반복 2에는 미달한다.
- mysteryReveal, worldBuilding: closed-unknown. 생활 지식 공개를 mystery로, 현실 배경을
  worldBuilding=0으로 전환하지 않았다.
- retainedRound01: Narrative `pacing=2`; Tone `4 / 3 / U / 2 / 2 / 3 / 2`;
  Genres `sliceOfLife;romance`; Theme `workplace:1`.
- finalCandidateNarrative: `2 / 2 / 1 / 2 / U / U` = 4/6.
- coverageAssessment: 세 후보가 채택되면 Narrative 4/6으로 text gate를 충족한다.
- hardBlockerAssessment: false.

## 45. work-db80d94709b62aa8823f — 逃げ上手の若君

### Source packet

#### Source A — 集英社 표준판 1~3권

- sourceName: 集英社 逃げ上手の若君 1권·2권·3권
- sourceUrl1: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882710-0
- sourceUrl2: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882734-6
- sourceUrl3: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882793-3
- publishedAt: 2021-07-02; 2021-08-04; 2021-11-04
- retrievedAt: 2026-08-23
- evaluatedRange: frozen 표준판 1~3권
- directObservation: 멸문과 도주, 동료 결집, 추격·전투·정치적 위험이 이어지지만,
  어린 동료들의 과장된 반응과 기묘한 조력자의 행동도 진지한 사건 사이에 배치된다.
- limitation: 표지나 Genre에서 tone을 추론하지 않는다.

#### Source B — 정확한 1~3권 리뷰 묶음

- sourceName: BookLive 逃げ上手の若君 1권·2권·3권 리뷰
- sourceUrl1: https://booklive.jp/review/list/title_id/961446/vol_no/001
- sourceUrl2: https://booklive.jp/review/list/title_id/961446/vol_no/002
- sourceUrl3: https://booklive.jp/review/list/title_id/961446/vol_no/003
- publishedAt: 2021–2025
- retrievedAt: 2026-08-23
- evaluatedRange: 정확한 각 권 route의 리뷰만 사용
- independence: 각 권의 서로 다른 계정이지만 BookLive family 하나로 계산했다.
- directObservation: 여러 작성자가 역사적 비극과 생존 압박 사이에 반복되는 얼굴
  개그·상황 유머가 들어가며, 위험과 긴장 뒤에 완급이 생긴다고 관찰한다.
- conflict: 일부 작성자는 비극을, 일부는 유머를 더 강하게 체감한다. 자동 다수결하지
  않고 Dictionary의 혼합 anchor로 제한했다.
- limitation: 애니메이션 감상과 후반부 회고는 제외했다.

### Axis 결론

- comedy=2: candidate-known, confidence 0.86. 공식 1~3권의 과장된 인물 반응과 복수
  scoped reviews가 진지한 사건 사이의 반복 유머를 확인한다. `중간중간 개그` 2다.
- mentalStress=2: candidate-known, confidence 0.82. 멸문·추격·생존 압박이 있으나
  도주 성공과 유머가 완급을 제공한다. 지속 붕괴 4가 아닌 `긴장과 답답함이 혼합` 2다.
- romance, emotionalWarmth: closed-unknown. 동료 결집을 곧 romance=0이나 warmth
  known으로 바꾸지 않았다.
- retainedRound01: Narrative `2 / 2 / 2 / 3 / U / 3`; Tone known
  `characterArcWeight=2;relationshipStructure=3;darkness=3`; Genres
  `action;historical`; Themes
  `combat:1;war:2;politics:1;survival:2;historicalReconstruction:2`.
- finalCandidateTone: `2 / 3 / 2 / 3 / 2 / U / U` = 5/7.
- coverageAssessment: 두 후보가 채택되면 Tone 5/7로 text gate를 충족한다.
- hardBlockerAssessment: false.

## 46. work-ef1bdac46a0956a87f7f — タコピーの原罪

### Source packet

#### Source A — 集英社 전 2권 공식 소개

- sourceName: 集英社 タコピーの原罪 상권·하권
- sourceUrl1: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883049-0
- sourceUrl2: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883104-6
- publishedAt: 2022-03-04; 2022-04-04
- retrievedAt: 2026-08-23
- evaluatedRange: frozen 상·하권 전편
- directObservation: 선의를 가진 외계 존재가 아동의 학교·가정 문제를 이해하지 못한
  채 도구로 개입하고, 죽음·수사·이동으로 상황이 빠르게 변한다.
- limitation: 짧은 소개만으로 mystery 구조와 0 후보를 단독 확정하지 않는다.

#### Source B — 작가·담당 편집자 공식 인터뷰

- sourceName: 集英社オンライン タイザン5·담당 편집자 인터뷰
- sourceUrl: https://shueisha.online/articles/-/4441?page=1
- publishedAt: 2022-04-03
- retrievedAt: 2026-08-23
- evaluatedRange: 전 16화·상하권의 사전 plot과 초기 전환
- directObservation: 작가는 상하권 분량을 미리 정하고 주요 인물의 역할과 plot을
  구성했다고 설명한다. 인터뷰는 4화의 loop 이탈과 급전환, 복선이 많은 전편 구조,
  3화의 강한 어두움을 구체적으로 지목한다.
- conflict: 인터뷰 서두의 조회 수와 SNS 반응은 Evidence에서 제외했다.

#### Source C — 완결권 소개와 복수 complete-work reviews

- sourceName: BookLive 하권; コミックシーモア 전 2권
- sourceUrl1: https://booklive.jp/review/list/title_id/1080370/vol_no/002
- sourceUrl2: https://www.cmoa.jp/title/238426/?disp_mode=easy&order=up&page=1
- sourceUrl3: https://www.cmoa.jp/title/customer_review/title_id/238426/
- publishedAt: 2022–2025
- retrievedAt: 2026-08-23
- evaluatedRange: 하권 또는 상하권 완독을 명시한 항목
- independence: BookLive와 CMOA는 서로 다른 platform family다. 각 플랫폼 안의
  계정은 한 family로 계산했다.
- directObservation: 복수 작성자가 도구를 이용한 선의의 개입이 상황을 악화시키고,
  loop와 기억·진실 공개가 앞 장면을 반복적으로 재해석하며, 아동 관계와 가정 압박이
  끝까지 지속된다고 관찰한다.
- conflict: 결말의 구원감을 크게 보는 리뷰도 있으나 압박의 지속성 자체에는 큰
  불일치가 없다.
- limitation: 별점과 단순 충격 반응은 제외했다.

### Axis 결론

- problemSolving=1: candidate-known, confidence 0.76. 도구 사용과 직접 행동은 반복되나
  주인공의 이해 부족으로 해결이 실패하거나 악화된다. 감정·힘 중심 0과 지략·직접 행동
  혼합 2 사이 값이다.
- mysteryReveal=4: candidate-known, confidence 0.91. 사전 구성된 복선, loop 이탈,
  기억과 진실 공개가 앞 사건을 재해석하는 주요 보상이므로 Dictionary 4에 대응한다.
- worldBuilding=2: candidate-known, confidence 0.80. 외계 도구와 loop 규칙이 사건을
  기능적으로 제약하지만 역사·문화·세력의 반복 설명이 중심인 4는 아니다.
- mentalStress=4: candidate-known, confidence 0.96. 학교·가정의 압박, 죽음과 관계
  붕괴가 전 2권에 지속되어 Dictionary의 `심리 붕괴·압박이 지속` 4다.
- romance=0: candidate-known, confidence 0.70, high-bar review required. 유한한 전
  16화의 공식 인물 역할과 전 2권 사건 구조가 아동 우정·가족·구원에 닫혀 있고,
  두 독립 platform family의 완독 리뷰에서도 연애 전개가 나타나지 않는다. 단순 Genre
  부재가 아니라 완결 범위의 반복적 부재에 근거하지만, Pass B가 이 0의 문턱을
  부족하다고 보면 unknown으로 되돌려야 한다.
- strategy, comedy, emotionalWarmth: closed-unknown. 사전 plot은 작가의 창작 방식이지
  작품 내 strategy가 아니며, 결말의 일부 구원감을 warmth known으로 확대하지 않았다.
- retainedRound01: Narrative `pacing=4`; Tone
  `characterArcWeight=4;relationshipStructure=3;darkness=4`; Genre
  `scienceFiction`; Theme `school:1`.
- finalCandidateNarrative: `U / 1 / U / 4 / 4 / 2` = 4/6.
- finalCandidateTone: `4 / 3 / U / 4 / 4 / 0 / U` = 5/7.
- coverageAssessment: romance=0을 포함한 다섯 후보가 독립 검수를 통과할 때 gate를
  충족한다. romance=0이 탈락하면 Tone은 4/7이며 추가 값을 억지로 대체하지 않는다.
- hardBlockerAssessment: false. 후보 0의 불확실성은 blocker가 아니다.

## 47. work-f5847c45d30753150364 — 闇のパープル・アイ

### Source packet

#### Source A — 小学館 표준 1~3권 공식 전자판

- sourceName: 小学館 闇のパープル・アイ 1권·2권·3권
- sourceUrl1: https://shogakukan-comic.jp/book?jdcn=091316510000d0000000
- sourceUrl2: https://shogakukan-comic.jp/book?jdcn=091316520000d0000000
- sourceUrl3: https://shogakukan-comic.jp/book?jdcn=091316530000d0000000
- publishedAt: 공식 전자판 2013-01-01
- retrievedAt: 2026-08-23
- evaluatedRange: frozen 종이 product code와 연결된 표준 1~3권
- directObservation: 신체 변화의 비밀, 포획·연구 위협, 가족 구출을 위한 침입,
  여동생의 죽음·연인의 배신과 복수 결심이 연속된다.
- limitation: 폭력의 시각 강도는 Art나 safety 값으로 전용하지 않는다.

#### Source B — 정확한 1~3권 리뷰

- sourceName: BookLive 闇のパープル・アイ 1권·2권·3권
- sourceUrl1: https://booklive.jp/review/list/title_id/185715/vol_no/001
- sourceUrl2: https://booklive.jp/review/list/title_id/185715/vol_no/002
- sourceUrl3: https://booklive.jp/review/list/title_id/185715/vol_no/003
- publishedAt: 2012–2025
- retrievedAt: 2026-08-23
- evaluatedRange: 정확한 각 권 route
- independence: 서로 다른 작성자지만 BookLive family 하나로 계산했다.
- directObservation: 복수 작성자가 도피·잠입·가족 구출을 직접 행동 중심으로
  관찰하며, 포획·실험·죽음·배신이 1~3권의 압박을 계속 높인다고 반복한다.
- conflict: 빠른 사건 전개에 대한 흥미와 고통스러운 압박 평가는 공존한다. 이는
  darkness와 mentalStress를 분리해야 한다는 Dictionary 규칙과 충돌하지 않는다.
- limitation: 전체 12권 회고와 드라마판 감상은 제외했다.

### Axis 결론

- problemSolving=1: candidate-known, confidence 0.78. 잠입·구출·도피라는 직접 행동과
  일부 계획이 있으나 힘·감정적 결단이 우세해 0과 2 사이 값이다.
- mentalStress=4: candidate-known, confidence 0.93. 포획 위협, 가족 위해, 상실과 배신이
  1~3권에 걸쳐 누적되어 `심리 붕괴·압박이 지속` 4 anchor에 대응한다.
- strategy, comedy, emotionalWarmth: closed-unknown. 한 번의 잠입을 장기 전략으로,
  로맨스 subplot을 따뜻함으로 전환하지 않았다.
- retainedRound01: Narrative `U / U / U / 4 / 3 / 2`; Tone
  `4 / 2 / U / 4 / U / 2 / U`; Genres `fantasy;horror`; Themes
  `survival:1;revenge:1`.
- finalCandidateNarrative: `U / 1 / U / 4 / 3 / 2` = 4/6.
- finalCandidateTone: `4 / 2 / U / 4 / 4 / 2 / U` = 5/7.
- coverageAssessment: 두 후보가 채택되면 양 그룹 text gate를 충족한다.
- hardBlockerAssessment: false.

## 48. work-fabc7f5d853e361acaf3 — YAIBA

### Source packet

#### Source A — 小学館 표준 1~3권 공식 전자판

- sourceName: 小学館 YAIBA 1권·2권·3권
- sourceUrl1: https://shogakukan-comic.jp/book?jdcn=091222710000d0000000
- sourceUrl2: https://shogakukan-comic.jp/book?jdcn=091222720000d0000000
- sourceUrl3: https://shogakukan-comic.jp/book?jdcn=091222730000d0000000
- publishedAt: 공식 전자판 2013-01-01
- retrievedAt: 2026-08-23
- evaluatedRange: frozen 종이 product code와 연결된 표준 1~3권
- directObservation: 일본 생활·라이벌 대결, 전설적 검을 다루는 수련, 연속 자객과
  새 기술 대응이 이어진다. 소개는 적과 사건을 과장된 모험 톤으로 제시한다.
- limitation: action·fantasy label에서 comedy나 stress를 만들지 않는다.

#### Source B — 정확한 1~3권 복수 리뷰

- sourceName: BookLive YAIBA 1권·2권·3권
- sourceUrl1: https://booklive.jp/review/list/title_id/185663/vol_no/001
- sourceUrl2: https://booklive.jp/review/list/title_id/185663/vol_no/002
- sourceUrl3: https://booklive.jp/review/list/title_id/185663/vol_no/003
- publishedAt: 2012–2025
- retrievedAt: 2026-08-23
- evaluatedRange: 정확한 각 권 route
- independence: 각 권의 서로 다른 작성자지만 BookLive family 하나로 계산했다.
- directObservation: 복수 작성자가 1~3권 모두 과장된 몸개그·말장난과 진지하지 않은
  적을 반복 관찰한다. 전투 위험은 존재하지만 밝고 가벼운 완급 때문에 심리적 긴장이
  낮다는 관찰도 여러 권에서 반복된다.
- conflict: 일부 3권 리뷰는 연속 자객의 박진감을 언급한다. mentalStress=0으로
  밀어붙이지 않고 위험과 낮은 압박 사이 값 1로 제한한다.
- limitation: 후반부 장기 모험과 애니메이션 기억은 제외했다.

### Axis 결론

- problemSolving=1: candidate-known, confidence 0.76. 수련과 새 기술, 직접 전투로
  대응하며 일부 기지가 섞이지만 제약 분석이 핵심 보상은 아니다. 0과 2 사이 값이다.
- comedy=4: candidate-known, confidence 0.92. 과장된 개그와 말장난이 1~3권에서
  지속되어 Dictionary의 `상시 또는 핵심` 4에 대응한다.
- mentalStress=1: candidate-known, confidence 0.75. 전투 위험은 있으나 복수 범위
  관찰이 낮은 긴장과 빠른 유머 완화를 반복한다. `거의 없음` 0과 `긴장 혼합` 2 사이값이다.
- strategy, mysteryReveal, romance, emotionalWarmth: closed-unknown. 훈련과 기술 습득을
  strategy로 중복 배정하지 않았고 밝은 개그를 관계 warmth로 전환하지 않았다.
- retainedRound01: Narrative `4 / U / U / 4 / U / 3`; Tone
  `2 / 2 / U / 2 / U / U / U`; Genres `action;fantasy`; Themes
  `combat:2;martialArts:2`.
- finalCandidateNarrative: `4 / 1 / U / 4 / U / 3` = 4/6.
- finalCandidateTone: `2 / 2 / 4 / 2 / 1 / U / U` = 5/7.
- coverageAssessment: 세 후보가 채택되면 양 그룹 text gate를 충족한다.
- hardBlockerAssessment: false.

## 49. work-fb7a0ed6a88db7d7bc71 — 夢の碑

### PF 1~3권 contents bridge

#### Bridge Source A — 작가 직접 인터뷰와 PF 판본표

- sourceName: 木原敏江 공식 인터뷰 자료 夢の碑 전편
- sourceUrl: https://www.horie-nobuo.com/dozi/me/me052.html
- publishedAt: 인터뷰 2001-11-27; 공개 2001-12-16
- retrievedAt: 2026-08-23
- bridgeObservation: 인터뷰 하단 판본표가 PF 1권에 `桜の森の桜の闇`과
  `とりかえばや異聞`, PF 2권에 이어지는 `とりかえばや異聞`과 `青頭巾`을 직접
  연결한다. 작가도 같은 순서로 시리즈 시작과 두 번째·세 번째 이야기를 설명한다.
- factorObservation: 작가는 series를 서로 다른 시대·장소의 시대물·역사물·환상담으로
  설명하고, 전편을 관통하는 성격을 진혼의 이야기로 설명한다.
- limitation: 사이트의 전재 금지 경계를 존중해 원문을 복사하지 않고 판본표의 대응
  사실과 작가 설명만 요약했다.

#### Bridge Source B — PF 3권 판본표

- sourceName: 木原敏江 공식 인터뷰 자료 ベルンシュタイン
- sourceUrl: https://www.horie-nobuo.com/dozi/me/me062.html
- publishedAt: 인터뷰 2002-07-02; 공개 2002-07-31
- retrievedAt: 2026-08-23
- bridgeObservation: 인터뷰 하단 판본표가 `ベルンシュタイン`을 小学館 PF
  コミックス `夢の碑` 3권에 직접 연결한다.
- factorObservation: 작가는 18세기 중부 유럽의 소국, 주변 제국의 압력, 역사적 배경,
  중심 인물 한 쌍의 서투르고 비극적인 관계를 설명한다.
- limitation: 작가의 여행·의상 제작 이야기는 Factor 근거에서 제외했다.

Bridge verdict: resolved for PF 1~~3. 이후 Source C~~E는 위 표에 이름이 직접 연결된
표제 story만 사용한다.

### Factor sources

#### Source C — 小学館 とりかえばや異聞

- sourceName: 小学館 夢の碑 とりかえばや異聞 공식 전자판
- sourceUrl: https://shogakukan-comic.jp/book?jdcn=091912210000d0000000
- publishedAt: 2018-03-02
- retrievedAt: 2026-08-23
- evaluatedRange: PF 1~2권에 bridge된 표제 장편
- directObservation: 옛 일본의 인간·비인간 존재, 신분 교체, 무장으로서의 행동,
  모리·오다 세력의 전쟁, 중심 관계가 함께 진행된다.
- limitation: 현행 collection의 추가 수록작은 PF 범위에 전용하지 않는다.

#### Source D — 小学館 青頭巾·ベルンシュタイン

- sourceName: 小学館eコミックストア 青頭巾; ベルンシュタイン
- sourceUrl1: https://e-comi.shogakukan.co.jp/books/091912220000d0000000
- sourceUrl2: https://e-comi.shogakukan.co.jp/books/091912270000d0000000
- publishedAt: 2018-03-02
- retrievedAt: 2026-08-23
- evaluatedRange: PF 2권에 bridge된 `青頭巾` 표제 story와 PF 3권에 bridge된
  `ベルンシュタイン` 표제 story
- directObservation: `青頭巾`은 역사 시대의 인간·정령 관계와 집착·잔혹한 운명을,
  `ベルンシュタイン`은 소국의 정치적 압력, 예언과 신분·성별 위장, 중심 연애 비극을
  다룬다.
- limitation: `青頭巾` 현행 collection의 나머지 네 작품은 PF 2권 판단에 넣지 않았다.

#### Source E — title-story scoped reviews

- sourceName: BookLive とりかえばや異聞; CMOA ベルンシュタイン
- sourceUrl1: https://booklive.jp/review/list/title_id/502189/vol_no/001
- sourceUrl2: https://www.cmoa.jp/title/144155/
- publishedAt: 2018–2024
- retrievedAt: 2026-08-23
- evaluatedRange: PF bridge가 확인된 두 표제 story
- independence: BookLive와 CMOA의 서로 다른 platform family다.
- directObservation: 서로 다른 작성자들이 시대 세력과 신분 교체, 운명에 압박받는
  중심 관계, 낭만성과 비극의 혼합을 반복한다.
- conflict: `とりかえばや異聞`의 초반 유머를 지적한 리뷰가 있다. 이 때문에 darkness와
  mentalStress를 4가 아닌 3으로 제한한다.
- limitation: collection 전체를 읽은 리뷰 중 표제 story와 추가 수록작을 구분하지 않는
  문장은 제외했다.

### Axis·Genre·Theme 결론

- strategy=2: candidate-known, confidence 0.76. PF 1~3권의 전쟁 세력, 신분 교체,
  소국의 정치 선택에 전술·단기 계획이 반복되지만 모든 story가 전략 중심은 아니다.
- pacing=3: candidate-known, confidence 0.82. PF 1~3권 안에서 장편 구간과 story
  전환이 함께 있고 시대·장소·목표가 크게 바뀐다. 계속되는 단간 전환 4보다 3이다.
- mysteryReveal=2: candidate-known, confidence 0.74. 신분·예언·비인간 존재의 비밀과
  일부 반전이 있으나 단서·추리가 모든 story의 주요 보상은 아니다.
- worldBuilding=4: candidate-known, confidence 0.90. 역사 시대, 전쟁 세력, 신분 규칙,
  인간·비인간 존재의 질서가 PF 1~3권의 여러 story에서 반복적으로 중요하다.
- characterArcWeight=4: candidate-known, confidence 0.88. 신분과 운명에 따른 인물의
  동기·변화·중심 관계가 각 진입 story의 핵심 보상이다.
- relationshipStructure=2: candidate-known, confidence 0.80. story별 중심 인물 한 쌍과
  핵심 조연이 반복된다. 전체 anthology를 하나의 군상 관계망으로 오인하지 않았다.
- darkness=3: candidate-known, confidence 0.85. 작가가 설명한 진혼 성격, 잔혹한 운명과
  비극이 반복되지만 일부 낭만·유머의 완급이 있어 4보다 3이다.
- mentalStress=3: candidate-known, confidence 0.81. 전쟁·집착·정치 압력과 관계 비극이
  거듭되지만 모든 story에서 지속 붕괴 4라고 보기는 어렵다.
- romance=4: candidate-known, confidence 0.91. 중심 인물 관계와 비극적 사랑이 PF
  1~3권 story 전개의 주요 축으로 반복되어 Dictionary 4에 대응한다.
- progression, problemSolving, comedy, emotionalWarmth: closed-unknown. anthology의
  story 교체를 성장으로, 일부 유머를 comedy known으로 만들지 않았다.
- Genres `fantasy;historical;romance`: candidate, confidence 0.94 / 0.92 / 0.91.
  작가의 시대물·역사물·환상 romance 설명과 공식 story 소개에 직접 대응한다.
- Theme `war:1`: candidate, confidence 0.84. PF 1~3권 중 복수 story의 전쟁·국가 위협에
  존재하지만 anthology 전체 단일 구조는 아니므로 1이다.
- Theme `politics:1`: candidate, confidence 0.80. 세력과 소국의 선택이 일부 story의
  핵심 장치지만 전편 중심 2는 아니다.
- Theme `historicalReconstruction:2`: candidate, confidence 0.90. 시대·역사 배경과
  신분·세력의 재구성이 서로 다른 진입 story에서 반복적 핵심이다.
- finalCandidateNarrative: `U / U / 2 / 3 / 2 / 4` = 4/6.
- finalCandidateTone: `4 / 2 / U / 3 / 3 / 4 / U` = 5/7.
- coverageAssessment: 브리지와 아홉 Axis, Genre·Theme 후보가 Pass B를 통과하면
  text gate와 metadata 계약을 충족한다. anthology 이질성 때문에 gate는 pass 후보다.
- hardBlockerAssessment: false.

## 50. work-fd88144bf7334c4aae39 — おそ松くん

### Representative-edition bridge attempt

#### Bridge Source A — frozen ボンボンKC 1~3권

- sourceName: 講談社 おそ松くん 1권·2권·3권
- sourceUrl1: https://www.kodansha.co.jp/comic/products/0000120298
- sourceUrl2: https://www.kodansha.co.jp/comic/products/0000120299
- sourceUrl3: https://www.kodansha.co.jp/comic/products/0000120300
- publishedAt: 1988-01-13; 1988-01-13; 1988-02-15
- retrievedAt: 2026-08-23
- bridgeObservation: frozen ISBN `9784061005099`에서 같은 ボンボンKC 번호형 2·3권으로
  이어지는 34권판의 서지 연속성이 확인된다.
- limitation: 출판사 상품 페이지만으로 수록 순서는 확인되지 않는다.

#### Bridge Source B — 문화청 디지털 아카이브 사업 보고서

- sourceName: 平成22年度メディア芸術デジタルアーカイブ事業 業務成果報告書
- sourceUrl: https://macc.bunka.go.jp/wp-content/uploads/2023/07/7e482f3ac8e13b33f02ea7099246bd89.pdf
- publishedAt: 2011-04-25
- retrievedAt: 2026-08-23
- bridgeObservation: 만화 단행본 조사 범위에서 赤塚不二夫全集版과 ボンボンKC판
  전 34권을 등치하고 1권·34권을 권별 조사 대상으로 기록한다.
- limitation: 같은 보고서는 실물을 확인하지 않은 서지만으로 동일·상이 판정을 내리는
  데 한계가 있었다고 명시한다. 따라서 equality 표기는 bibliographic metadata이며
  수록 episode 동일성을 보증하는 contents bridge로 사용할 수 없다.

#### Bridge Source C — 공식 권리자 판본 history·전자판 공지

- sourceName: 赤塚不二夫公認サイト おそ松くん; 전자판 간행 공지
- sourceUrl1: https://www.koredeiinoda.net/manga/osomatsukun.html
- sourceUrl2: https://www.koredeiinoda.net/fujiopro-topic/?p=207
- publishedAt: work page undated; release notice 2009-07-31
- retrievedAt: 2026-08-23
- bridgeObservation: 권리자 페이지가 講談社 1988년 34권판과 ebookJapan 2009년
  34권판을 같은 canonical 작품의 서로 다른 단행본 판본으로 나란히 기록한다.
- conflict: 전자판 간행 공지는 ボーイズライフ 1편, テレビマガジン 24편,
  コミックボンボン 9편을 전자판에 처음 수록했다고 명시한다. 따라서 전자판은 frozen
  KC의 단순 ordinal 복제본이 아니라 재편집·증보 가능성이 직접 확인된다.
- factorObservation: 여섯 쌍둥이와 반복 조연이 여러 잡지의 짧은 comic episode를
  이끄는 작품 구조를 설명한다.

#### Bridge Source D — authorized ebookJapan 1~3권

- sourceName: ebookJapan おそ松くん 1권·2권·3권
- sourceUrl1: https://ebookjapan.yahoo.co.jp/books/114045/A000034609/
- sourceUrl2: https://ebookjapan.yahoo.co.jp/books/114045/A000034610/
- sourceUrl3: https://ebookjapan.yahoo.co.jp/books/114045/A000034611/
- publishedAt: 2009-07-31
- retrievedAt: 2026-08-23
- bridgeObservation: ebookJapan 34권 series의 1~3권이며, 1권은 여러 잡지 발표분을 초출
  순서로 배열한다고 명시하고 세 권 모두 17편씩 수록한다. 2권은 방학 아르바이트·교사·
  숙제를, 3권은 학교 연극과 장난에 대한 되갚기를 소개한다.
- dataQualityNote: 3권 소개 말미의 `17巻` 표기는 같은 페이지의 3권 identity와 216쪽,
  34권 series 문맥에 맞지 않는 편집 오기다. 이를 17권 수록으로 해석하지 않고 17편
  묶음이라는 앞 두 권의 연속 구조만 사용한다.
- limitation: ebookJapan 1·2권의 metadata ISBN은 frozen ボンボンKC 1·2권 ISBN과
  다르다. 34권이라는 같은 총 권수와 ordinal만으로 episode 구성이 같다고 볼 수 없으며,
  Source B의 metadata equality도 이 끊김을 메우지 못한다.

Bridge verdict: unresolved. frozen ボンボンKC 1~3권의 공식 목차, 실물 판권·목차,
또는 frozen판과 ebookJapan판의 직접 수록 대응표가 공개 route에서 확보되지 않았다.

### Axis·Genre·Theme 결론

- progression, problemSolving, strategy, pacing, mysteryReveal, worldBuilding,
  characterArcWeight, relationshipStructure, comedy, darkness, mentalStress, romance,
  emotionalWarmth: closed-unknown. ebookJapan판의 episode 구성과 Work-level 설명을
  frozen ボンボンKC 1~3권에 전용하지 않았다. comedy Axis도 공식 Genre 명칭만으로
  값을 만들지 않았다.
- Genre `comedy`: candidate, confidence 0.99. 권리자와 authorized 권 소개가 comic
  소동을 canonical Work의 반복 핵심으로 직접 설명한다. Genre는 판본 수록 순서와
  무관한 공식 Work-level 분류이므로 후보로 유지한다.
- Theme: none. ebookJapan 2·3권의 school 소재를 frozen판에 전용하지 않는다.
- finalCandidateNarrative: `U / U / U / U / U / U` = 0/6.
- finalCandidateTone: `U / U / U / U / U / U / U` = 0/7.
- coverageAssessment: finite public route에서 contents bridge를 회수하지 못해 gate는
  fail로 종결한다. 부족한 known을 다른 축으로 대체하지 않는다.
- hardBlockerAssessment: false.

## Link GET·독립성·종결 요약

- 2026-08-23에 이 문서의 모든 source URL을 `curl -L`과 일반 브라우저 User-Agent로
  GET 점검했다. 기록된 URL은 모두 최종 HTTP 200을 반환했다.
- 공식 출판사·권리자·문화청·작가 직접 인터뷰를 primary 또는 bridge로 사용했다.
  BookLive·CMOA·note의 복수 계정은 작성자 독립성을 기록했지만 플랫폼 family를
  중복 가산하지 않았다.
- 명시적 source conflict는 サンキューピッチ의 전략 대 따뜻함 중심성,
  凪のお暇의 생활 요령 대 인간극 중심성, 逃げ上手の若君의 비극 대 유머,
  YAIBA의 전투 박진감 대 낮은 압박, 夢の碑의 비극 대 일부 유머다. 각 값은 자동
  다수결 없이 Dictionary의 중간 anchor로 제한했다.
- closed-unknown은 10작품 모두에 남아 있다. 필요한 known 수보다 더 채우지 않았으며,
  Art 축은 전혀 다루지 않았다.
- promotionBlocked 또는 hard blocker를 새로 뒷받침하는 자료는 0건이다.

## Pass B handoff

1. `タコピーの原罪` romance=0은 완결·유한 범위의 반복적 부재가 Dictionary의 높은
   0 문턱을 충족하는지 독립적으로 다시 본다.
2. `夢の碑`는 PF 1~3 contents bridge만 채택하고 현행 collection의 추가 수록작을
   유입하지 않았는지 검수한다. anthology 이질성 때문에 중간값 3과 Theme centrality를
   우선 확인한다.
3. `うさぎドロップ`는 원판 ISBN route만 사용했는지 확인하고 신장판 추가분이나
   5권 이후 관계를 배제한다.
4. `おそ松くん`은 contents bridge 미해결을 그대로 유지하고 Work-level Genre 외에는
   Pass B 후보로 보내지 않는다.
5. 어떤 후보가 기각되어 gate가 미달해도 이 Pass A 문서에서 대체 값을 생성하지 않는다.
   Pass C는 retained·modified·unknown 중 하나로 닫는다.
