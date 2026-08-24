# Batch 002 text coverage gap research — chunk 01

- batchId: batch-002
- sourceChunk: chunk-01
- scope: round-01 coverage gap 9작품
- evaluatedRange: 작품별 진입 1~3권 또는 단권 전체
- retrievedAt: 2026-08-23
- reviewedByHuman: false
- outputKind: supplemental-evidence-packet
- decisionBoundary: 이 문서는 candidate-known 또는 closed-unknown을 제안할 뿐 Factor source row, promotion 상태, identity, safety를 변경하지 않는다.

## 동결 입력

| Input                                          | SHA-256                                                          |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| docs/factors/factor-dictionary.md              | a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be |
| research/chunk-01.md                           | 86f6b3a2b29326e63ceb01266ec246d25f393a7cd971935a13a1b94bcb1045ba |
| annotation/pass-a-text-chunk-01.csv            | 4f126caf1ab7c8963ce53b7f3a00201582169b4dd8d1f2265d251c453fc5b9c3 |
| reviews/grok-text-review-response-chunk-01.txt | 4920d6cfcf277755eb77d51736fdfdf8a0b7eacf320ece0ba91e1537405a3628 |
| adjudication/text-chunk-01-round-01.md         | 4441b0502877f175ad5498d4b253675b23145fea7aadd7636ddae64f37240672 |
| adjudication/text-gap-queue-chunk-01.csv       | 369e51fed6d06b0c79dda22703e103a657e90bc43e27f8b345d4869badf4a4e2 |

## 판정 규칙

- 공식 출판사 권 소개와 공식 내부 미리보기를 우선한다.
- 장르나 Art 값에서 텍스트 Axis를 역추론하지 않는다.
- known 0은 반복적 부재를 직접 확정하는 자료가 있을 때만 허용한다.
- candidate-known은 다음 adjudication에서 채택 여부를 다시 정해야 한다. 이 packet만으로 source data에 반영하지 않는다.
- closed-unknown은 낮은 값이 아니라 현재 진입 범위 자료로 책임 있게 판정할 수 없다는 종료 상태다.
- 같은 리뷰 플랫폼의 서로 다른 계정은 저자 단위로는 독립이지만 플랫폼 단위로는 독립이 아니다. 공식 자료와 다른 플랫폼 자료가 함께 맞을 때만 보조 신뢰도를 올렸다.
- 리뷰의 별점, 추천 여부, 장르 태그는 사용하지 않았다. 구체적이고 반복되는 관찰만 저작권을 침해하지 않도록 요약했다.
- selection provenance는 이 packet의 Factor Evidence에 섞지 않았다.
- 임시 공식 미리보기 캡처는 커밋하지 않는다. URL, 판본, 페이지 범위, 관찰, SHA-256만 기록한다.

## 결과 요약

Axis 표기 순서는 Narrative가 progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding, Tone이 characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth이다. U는 unknown이다.

| Pos | workId                    | canonicalTitle   | Round-01 N/T | 추가 candidate-known                                                                                                                      | 보강 후 후보 N/T | Text gate    | hardBlocker |
| --: | ------------------------- | ---------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------ | ----------- |
|   1 | work-017446dd1a9039d9839b | サンダー３       | 3/6, 2/7     | 없음                                                                                                                                      | 3/6, 2/7         | fail N+1 T+3 | false       |
|   2 | work-02d5d329c9ef85e481cb | のたり松太郎     | 6/6, 4/7     | 없음                                                                                                                                      | 6/6, 4/7         | fail T+1     | false       |
|   3 | work-089947c5303024841fef | デカワンコ       | 4/6, 4/7     | emotionalWarmth=2                                                                                                                         | 4/6, 5/7         | pass         | false       |
|   4 | work-0e036724913c69bb937a | ファイアパンチ   | 3/6, 5/7     | 없음                                                                                                                                      | 3/6, 5/7         | fail N+1     | false       |
|   5 | work-1012948f5de799831da4 | RED              | 1/6, 2/7     | pacing=2; characterArcWeight=3; mentalStress=3                                                                                            | 2/6, 4/7         | fail N+2 T+1 | false       |
|   6 | work-1088a1dc00a3b0d22201 | 邪眼は月輪に飛ぶ | 0/6, 0/7     | problemSolving=3; pacing=4; worldBuilding=2; characterArcWeight=2; relationshipStructure=2; darkness=4; mentalStress=3; emotionalWarmth=2 | 3/6, 5/7         | fail N+1     | false       |
|   7 | work-19a26f01512166856a6a | 銀河鉄道999      | 2/6, 3/7     | progression=2; emotionalWarmth=2                                                                                                          | 3/6, 4/7         | fail N+1 T+1 | false       |
|   8 | work-1e27731b880d0d9012f8 | 吉祥天女         | 0/6, 0/7     | characterArcWeight=3; relationshipStructure=2; darkness=3; mentalStress=3; emotionalWarmth=2                                              | 0/6, 5/7         | fail N+4     | false       |
|   9 | work-207bb1ca28b7472fbe1d | 六三四の剣       | 6/6, 4/7     | comedy=2                                                                                                                                  | 6/6, 5/7         | pass         | false       |

이 요약은 coverage를 맞추기 위해 값을 늘린 결과가 아니다. サンダー３, のたり松太郎, ファイアパンチ는 좁은 추가 조사 뒤에도 직접 근거가 부족해 새 known 후보를 만들지 않았다.

## 1. work-017446dd1a9039d9839b — サンダー３

### Source A — 講談社 공식 제1화 내부 미리보기

- sourceName: 月マガ基地 サンダー3 제1화 スモール3
- sourceUrl: https://comic-days.com/episode/3269754496887933824
- publishedAt: 2022-05-06
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: official-publisher-internal-preview
- independence: frozen 講談社 1~3권 상품 페이지와 같은 출판사이며 독립 출처로 중복 계산하지 않는다.
- evaluatedRange: 1권 제1화, 확인 캡처상 연속 6쪽
- pageRefsAndHashes: pages 10~15; d764131a1787b67e71e55ab5856b7a11e965c6cc952c9aaaaae813113e5f24dd, 6b7855bc48ad40457db4023704f46c13ebd71b00d5e83c97ef889270ad036615, bdb0763f79db3371dca015068feafc0341078533749ceb0ece4db5d3e475f1ef
- supportedClaims: 세 친구의 하교 대화, 여동생과의 통화, 초콜릿과 만화 행사에 관한 가벼운 일상 대화가 본격 사건 전 도입에 존재한다.
- observation: 첫 화의 일상 구간은 친구와 가족 관계를 구체화하지만, 이 6쪽만으로 2~3권까지 comedy 또는 emotionalWarmth가 지속된다고 말할 수 없다.
- limitation: 첫 화 일부 표본이다. 후속 권의 구조·정서 지속성을 확인하지 못한다.
- provenanceFactorClassification: factor-evidence-primary

### Source B — Real Sound 제1권 비평

- sourceName: Real Sound Book 成馬零一의 サンダー3 제1권 비평
- sourceUrl: https://realsound.jp/book/2022/12/post-1207281.html
- publishedAt: 2022-12-13
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: independent-editorial-review
- independence: 출판사 상품 문구와 별개의 기명 비평이다.
- evaluatedRange: 당시 발매된 1권
- supportedClaims: 평범한 가족 일상, 여동생의 오빠에 대한 친밀감, 세 친구의 잡담 뒤 디스크·이세계·납치·구조로 급전환하는 1권 순서를 지원한다.
- observation: 공식 1권 미리보기의 일상 구간과 공식 1~~3권 소개의 구조 목표를 연결하지만, 2~~3권에서 같은 가벼움이나 따뜻함이 반복된다는 관찰은 없다.
- limitation: 1권 비평 한 건이다. 장기 지속성이나 빠진 세 Tone 축을 직접 채우지 못한다.
- provenanceFactorClassification: factor-evidence-secondary

### Axis 결론

- progression: closed-unknown. 이세계에서 강해지는 최초 상태 변화는 보이지만 반복 성장·습득 보상은 확인되지 않았다.
- problemSolving: closed-unknown. 디스크 조작과 저항 작전의 존재만으로 제약 분석·영리한 해결이 반복된다고 할 수 없다.
- mysteryReveal: closed-unknown. 수수께끼의 디스크와 이세계는 비밀 전제이지 단서·추론·진상 공개의 반복 보상이 아니다.
- characterArcWeight: closed-unknown. 구조 목표는 가족 구조지만 인물의 내적 변화가 중심 보상인지는 확인되지 않았다.
- comedy: closed-unknown. 첫 화의 가벼운 대화만 확인됐고 1~3권 지속성이 없다.
- mentalStress: closed-unknown. 납치와 전쟁 위험을 인물의 지속적 불안·압박으로 직접 묘사한 자료가 없다.
- romance: closed-unknown. known 0을 확정할 반복적 부재 자료도 없다.
- emotionalWarmth: closed-unknown. 여동생 구조 동기와 초기 친밀감은 관계의 존재를 보이지만 따뜻함·치유가 entry 보상이라는 직접 근거는 아니다.
- finalCandidateNarrative: U / U / 1 / 3 / U / 2 = 3/6
- finalCandidateTone: U / 2 / U / 2 / U / U / U = 2/7
- remainingOfficialRoute: 講談社가 제공하는 2~3권 내부 페이지 또는 해당 권을 직접 다룬 공식 편집 기사가 발견될 때만 재개한다. 그 전에는 unknown을 유지한다.
- blockerStatus: identity·safety hard blocker 없음; text coverage 미달은 해소되지 않음.

## 2. work-02d5d329c9ef85e481cb — のたり松太郎

### Source A — 小学館 공식 1권 내부 미리보기

- sourceName: 小学館 eコミックストア のたり松太郎 1권 viewer
- sourceUrl: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091800710000d0000000
- publishedAt: undated
- retrievedAt: 2026-08-23
- urlLiveCheck: product와 viewer 모두 HTTP 200
- authorityClass: official-publisher-internal-preview
- independence: frozen 1권 상품 페이지와 같은 JDCN·출판사이며 별도 독립 출처로 세지 않는다.
- evaluatedRange: 1권 pages 10~15, 연속 6쪽
- pageRefsAndHashes: e9244590ce5fa604b8716085f13633fdf2e78cfbdf79d9214bb4fe1ddf3b3ae4, 4b46b3ca753a3d3a7f6056181ee038b0b20cbc275e1e75ead1db583b100d4d65, a563ce13f1fb9e494759e7c021627e2d9d067c3758c7e49f661318fc4ab8361a
- supportedClaims: 학교에서의 충돌과 과장된 난동, 주변 인물의 반응이 짧은 구간에 반복된다.
- observation: comedy=2로 이미 확정된 entry 관찰을 보강한다. 빠진 Tone 한 축을 새로 직접 지지하지 않는다.
- limitation: 1권 일부이며 2~3권 관계의 정서적 보상이나 심리 압박을 평가할 수 없다.
- provenanceFactorClassification: factor-evidence-primary

### Source B — BookLive 1권 독립 리뷰 묶음

- sourceName: BookLive のたり松太郎 1권 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/481113/vol_no/001
- publishedAt: 2009-10-04; 2024-01-26; 2024-01-28; 2025-05-30
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: retailer-user-review-packet
- independence: 서로 다른 계정·게시일의 독립 관찰이지만 같은 BookLive 플랫폼이다.
- evaluatedRange: 1권 표기 리뷰. 일부 계정은 재독 경험을 언급하므로 작품 전체 기억이 섞일 수 있다.
- supportedClaims: 여러 리뷰가 난동과 웃음, 스모부의 거친 위계·폭력, 강한 개성, 드물게 드러나는 친절을 각각 관찰한다.
- observation: 반복되는 구체 관찰은 comedy와 거친 직업 환경을 확인한다. 친절은 한 리뷰의 전체작 기억이고, 폭력은 character mentalStress가 지속된다는 관찰과 같지 않다.
- limitation: 따뜻함과 심리 압박에 대한 관찰이 entry 1~3권에서 반복된다고 교차 확인되지 않는다. 감정 태그는 사용하지 않았다.
- provenanceFactorClassification: factor-evidence-secondary

### Axis 결론

- mentalStress: closed-unknown. 형제자의 폭력·괴롭힘은 환경의 거침을 보여 주지만 주인공 또는 핵심 인물의 지속적 불안·붕괴·압박 보상을 직접 확정하지 않는다.
- romance: closed-unknown. 전 교사 방문과 호감 전제는 지속적 로맨스 subplot을 입증하지 않는다. known 0의 직접 부재 자료도 없다.
- emotionalWarmth: closed-unknown. 한 리뷰가 친절을 회고하지만 공식 1~3권 자료에서 반복되는 관계 회복·따뜻함이 확인되지 않는다.
- finalCandidateNarrative: 3 / 0 / 0 / 3 / 0 / 2 = 6/6
- finalCandidateTone: 2 / 3 / 2 / 1 / U / U / U = 4/7
- remainingOfficialRoute: 2~3권 viewer에서 田中 및 부屋 관계가 지속적으로 어떤 정서 보상을 만드는지 확인 가능한 연속 본문이 없으면 현재 unknown을 종결값으로 유지한다.
- blockerStatus: identity·safety hard blocker 없음; Tone coverage가 1축 부족하다.

## 3. work-089947c5303024841fef — デカワンコ

### Source A — 集英社 공식 2~3권 소개

- sourceName: 集英社 デカワンコ 2권·3권 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865527865501315501 ; https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865554865501315501
- publishedAt: 2009-04-17; 2009-09-18
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: official-publisher-volume
- independence: 같은 출판사의 연속 두 권이며 각기 다른 수록 File 범위를 다룬다.
- evaluatedRange: 2권 File 10~~18; 3권 File 19~~24
- supportedClaims: 2권은 웃음과 감정적 사건의 병치를, 3권은 코믹 요소와 진지한 경찰극의 병치를 직접 설명한다.
- observation: 따뜻함을 entry 전체의 핵심으로 만들지는 않지만 사건 중심 웃음 속에 정서적·인정적 보상이 반복되는 혼합 Tone을 직접 지지한다.
- limitation: 출판사 홍보 문구만으로 emotionalWarmth 극단값이나 매 File 빈도를 정하지 않는다.
- provenanceFactorClassification: factor-evidence-primary

### Source B — コミックシーモア 독립 리뷰 묶음

- sourceName: コミックシーモア デカワンコ 리뷰
- sourceUrl: https://www.cmoa.jp/title/customer_review/title_id/54544/
- publishedAt: 2020-06-27; 2022-02-23; 2022-03-01
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: retailer-user-review-packet
- independence: romance2, サララ, むーみり 세 계정은 서로 독립이지만 같은 플랫폼이다.
- evaluatedRange: romance2는 5권까지 읽었다고 명시; 나머지는 작품 리뷰로 정확한 권 경계가 불명확하다.
- supportedClaims: 사건별 인정 요소, 웃음과 감동의 병치, 유쾌한 동료들 사이의 따뜻함과 때때로 울게 되는 정서가 반복 관찰된다.
- observation: 공식 2~3권 소개의 감정적 사건·진지한 경찰극 관찰과 같은 방향이다. 리뷰 원문은 사용자 설명으로 전용하지 않는다.
- limitation: 같은 플랫폼이고 일부는 3권 이후를 포함한다. 그래서 값 4가 아니라 혼합 수준 2의 보조 근거로만 사용한다.
- provenanceFactorClassification: factor-evidence-secondary

### Axis 결론

- emotionalWarmth=2: candidate-known. 공식 2권과 3권이 entry 안에서 웃음·감정적 사건·진지한 경찰극을 반복하고, 독립 리뷰들이 인정 요소와 따뜻한 동료 관계를 교차 관찰한다. Dictionary의 혼합 수준에 해당하며 core level 4는 아니다.
- mentalStress: closed-unknown. 중대한 사건이 존재해도 지속적 심리 압박이 중심 보상이라는 근거는 없다.
- romance: closed-unknown. 리뷰들이 로맨스 진행이 적다고 말하지만 entry 1~3권의 반복적 부재를 직접 검증한 자료가 아니므로 known 0을 만들지 않는다.
- finalCandidateNarrative: U / 3 / U / 3 / 4 / 1 = 4/6
- finalCandidateTone: 2 / 3 / 3 / 2 / U / U / 2 = 5/7
- remainingOfficialRoute: 없음. candidate-known은 독립 Pass B에서 공식 권 문구와 리뷰 범위를 다시 대조한다.
- blockerStatus: hard blocker 없음; candidate가 채택되면 text coverage pass.

## 4. work-0e036724913c69bb937a — ファイアパンチ

### Source A — 集英社 공식 1권 내부 미리보기

- sourceName: 集英社 ファイアパンチ 1권 reader
- sourceUrl: https://www.shueisha.co.jp/books/reader/main.php?cid=08880731880731315501
- publishedAt: 2016-07-04
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: official-publisher-internal-preview
- independence: frozen 1권 상품 소개와 같은 출판사·판본이다.
- evaluatedRange: 1권 pages 4~9, 연속 6쪽
- pageRefsAndHashes: 4a53def0072410f4af3461f3173b46f52346dc07d31fcb95873dc0bba1c6fa13, 70671376f055bc7354368706c1c58580075aa646d0c66404bb81b69fe6b4a1b8, e4a6dc03f61fe87df665b08e83a70dd886fb55e2b1672be54f81dae563888b57
- supportedClaims: Agni의 재생 신체 일부를 식량으로 쓰는 극단적 생존 방편과 Luna·공동체의 생존 관계를 직접 보여 준다.
- observation: 하나의 강한 resource workaround는 확인되지만, entry 1~3권에서 제약 분석·영리한 해결이 반복된다는 증거는 아니다.
- limitation: 1권 도입 일부이다. 한 장면을 problemSolving 전체값으로 일반화하지 않는다.
- provenanceFactorClassification: factor-evidence-primary

### Source B — 集英社 공식 작가 대담

- sourceName: 藤本タツキ와 沙村広明 공식 대담
- sourceUrl: https://sp.shonenjump.com/p/sp/1706/fp_interview/
- publishedAt: 2017-06 campaign; page 자체 날짜 무기재
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: official-publisher-creator-interview
- independence: 출판사 공식 자료지만 작가의 직접 구조 설명과 독립 작가의 관찰을 포함한다.
- evaluatedRange: 당시 1~~5권. 이번 판정은 1~~3권에 직접 대응하는 Togata 등장 이후의 조기 방향 전환만 사용한다.
- supportedClaims: 예상 결말처럼 보이는 사건을 조기에 일으키고 다음 방향을 반복해서 묻게 하는 설계와, Togata 등장 뒤 전개가 예측 불가능하게 바뀐다는 관찰을 지원한다.
- observation: round-01의 pacing=4를 강하게 보강한다.
- limitation: 인터뷰는 4~~5권까지 포함한다. pacing 외 새 Narrative Axis를 entry 1~~3권으로 좁혀 직접 지지하지 않는다.
- provenanceFactorClassification: factor-evidence-primary-secondary-mixed

### Axis 결론

- progression: closed-unknown. 재생 능력은 초기 전제이며 반복 성장·능력 습득의 보상으로 확인되지 않는다.
- problemSolving: closed-unknown. 식량 workaround 한 건은 반복 구조가 아니다.
- mysteryReveal: closed-unknown. 예측 불가능한 전환은 clue·inference·truth reveal과 같은 개념이 아니다.
- finalCandidateNarrative: U / U / 2 / 4 / U / 3 = 3/6
- finalCandidateTone: 3 / 3 / 2 / 4 / 4 / U / U = 5/7
- remainingOfficialRoute: 1~3권의 반복적 제약 해결이나 단서·진상 구조를 직접 설명하는 공식 편집 자료가 새로 발견되지 않으면 세 축은 unknown으로 종결한다.
- blockerStatus: hard blocker 없음; Narrative coverage가 1축 부족하다.

## 5. work-1012948f5de799831da4 — RED

### Source A — 講談社 원판 3권 공식 발매 아카이브

- sourceName: 講談社 신간 아카이브 RED 3
- sourceUrl: https://www.kodansha.co.jp/comic/new-releases/p?page=2159
- publishedAt: 1999-12-04
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: official-publisher-bibliography
- independence: 원판 1~2권 페이지와 같은 출판사지만 원판 3권을 직접 식별하는 별도 권차 기록이다.
- evaluatedRange: 원판 3권, ISBN 9784063460490
- supportedClaims: RED, 저자 村枝賢一, 원판 3권, 1999-12-04 발매를 직접 연결한다.
- observation: round-01의 원판 3권 미매핑 gap을 해소한다.
- limitation: 아카이브 소개는 1권과 같은 짧은 총론이어서 단독으로 세부 Axis를 만들 수 없다.
- provenanceFactorClassification: factor-evidence-primary-and-edition-bridge

### Source B — 紀伊國屋 원판 3권 상품 설명

- sourceName: 紀伊國屋書店 RED 3 전자 상품 페이지
- sourceUrl: https://www.kinokuniya.co.jp/f/dsg-08-9973091248
- publishedAt: original volume 1999-12-04; displayed electronic release 2014-07
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: official-bookseller-distributor-description
- independence: 서점 페이지이지만 설명이 출판 유통 metadata일 가능성이 높아 독립 비평으로 세지 않는다.
- evaluatedRange: 원판 3권, ISBN 9784063460490
- supportedClaims: Red가 지워진 부족과 미래에 대한 거대한 증오를 안고 파멸 가능성에도 복수의 길을 계속 간다는 원판 3권 내용을 지원한다.
- observation: 복수 동기, 내적 압박, 자기파괴 위험이 3권까지 계속됨을 원판 ISBN과 함께 확인한다.
- limitation: 페이지의 2014-07은 전자 배포 시점이다. 원판 발매일은 Source A를 따른다. 서점의 감상·별점은 사용하지 않는다.
- provenanceFactorClassification: factor-evidence-secondary-distributor

### Source C — 講談社 신장판 1권 내용 bridge

- sourceName: 講談社 신장판 RED 1
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000044514
- publishedAt: 2014-05-16
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: official-publisher-alternate-edition
- independence: 같은 출판사이며 독립 근거가 아니라 원판 1~2권 내용 대응 bridge다.
- evaluatedRange: 신장판 1권이 원판 1~2권을 합친 범위
- supportedClaims: 부족 학살과 복수 여행이라는 entry 1~2권 목적을 더 구체적으로 확인한다.
- observation: Source A·B의 원판 3권과 결합해 원판 1~3권 범위를 처음으로 연속 평가할 수 있다.
- limitation: 신장판 2권 이후 내용을 원판 3권에 역매핑하지 않았다. 원판 3권은 오직 ISBN 9784063460490 자료를 사용한다.
- provenanceFactorClassification: factor-evidence-primary-edition-bridge

### Axis 결론

- pacing=2: candidate-known. 원판 1~~2권의 조우·복수 여행에서 원판 3권의 계속되는 복수 경로까지 정상적인 arc 진행이 확인된다. 한 리뷰의 6개월 도약만으로 3~~4를 주지 않는다.
- characterArcWeight=3: candidate-known. 부족 학살, 지워진 미래, 증오, 파멸을 감수하는 복수 선택이 entry의 사건 동기와 보상을 지속적으로 이끈다. 사건과 인물 동기가 함께 있으므로 4가 아니라 3이다.
- mentalStress=3: candidate-known. 상실·증오·자기파괴 가능성이 원판 1~3권의 복수 행동과 반복 연결된다. 극단 4를 확정할 내부 본문은 없다.
- progression: closed-unknown. 복수 여정은 성장·습득 보상의 반복과 다르다.
- problemSolving: closed-unknown. 제약 분석과 해결 과정이 확인되지 않았다.
- strategy: closed-unknown. 복수 목표는 장기 계획의 구체적 자원·정치·전쟁 관리와 같지 않다.
- mysteryReveal: closed-unknown. 숨은 의도나 진상 공개가 중심 보상이라는 근거가 없다.
- comedy, romance, emotionalWarmth: closed-unknown. 직접 반복 근거도, known 0에 필요한 부재 근거도 없다.
- finalCandidateNarrative: U / U / U / 2 / U / 2 = 2/6
- finalCandidateTone: 3 / 2 / U / 3 / 3 / U / U = 4/7
- remainingOfficialRoute: 원판 1~3권 내부 미리보기 또는 원판 3권의 상세 공식 episode 목록이 발견될 때만 나머지 축을 재검토한다.
- blockerStatus: 원판 3권 edition gap은 해소됨. identity·safety blocker가 아니며, text coverage는 N+2 T+1 미달이다.

## 6. work-1088a1dc00a3b0d22201 — 邪眼は月輪に飛ぶ

### Source A — 小学館 단권 전체 상세 소개

- sourceName: 小学館コミック 邪眼は月輪に飛ぶ
- sourceUrl: https://shogakukan-comic.jp/book?isbn=9784091811974
- publishedAt: 2007-04-27
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: official-publisher-complete-volume
- independence: 기존 e-comi 짧은 소개와 같은 출판사지만 ISBN, 204쪽, 7개 chapter, 전체 등장인물과 사건 순서를 추가한다.
- evaluatedRange: 단권 전체 204쪽, 7개 chapter
- supportedClaims: 숲의 사냥꾼, 도시로 향하는 무녀, 절망하는 군인, CIA 요원, 차량 추격, 탑 결투로 이어지는 전체 구조와 노년 사냥꾼·딸·미군·CIA 인물 구성을 지원한다.
- observation: 단권 전체가 치명적 gaze rule을 가진 위협을 어떻게 막고 쓰러뜨릴지에 집중하며 짧은 분량 안에서 장소·행동 상태가 크게 바뀐다.
- limitation: 줄거리 압축이므로 구체적인 해결 장치와 관계 감정의 장면별 비중은 내부 본문으로 교차해야 한다.
- provenanceFactorClassification: factor-evidence-primary

### Source B — 小学館 공식 내부 미리보기

- sourceName: 小学館 eコミックストア 邪眼は月輪に飛ぶ viewer
- sourceUrl: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091811970000d0000000
- publishedAt: volume release 2007-04-27; viewer 자체는 undated
- retrievedAt: 2026-08-23
- urlLiveCheck: product와 viewer 모두 HTTP 200
- authorityClass: official-publisher-internal-preview
- independence: Source A와 같은 판본·출판사이며 장면 확인용이다.
- evaluatedRange: 단권 opening pages 10~15
- pageRefsAndHashes: 120884a7b7b4412872570c6beac3e3e448cc5ba87da12c6d96fb763bd003e03a, a6050e7b43e79898e683ebe70874f0cb594067b936b17de6ed6551bfaf210f3f, c289429deaf403bf73c311e536ef4d57e669a439b06d00a988e3baff1f8a3687
- supportedClaims: 운반 수단 사고와 다수 사망, 군이 위협을 식별하지 못하는 상태, 방호 장비와 공포가 opening에서 직접 확인된다.
- observation: darkness와 mentalStress의 강한 도입 근거이며, 공식 전체 chapter 구조가 그 위협을 결말까지 중심에 둔다.
- limitation: 6쪽은 전체 해결 과정이나 관계의 종결을 직접 보여 주지 않는다.
- provenanceFactorClassification: factor-evidence-primary

### Source C — コミックシーモア 단권 독립 리뷰 묶음

- sourceName: コミックシーモア 邪眼は月輪に飛ぶ 리뷰
- sourceUrl: https://www.cmoa.jp/title/62742/
- publishedAt: 2013-10-24; 2018-12-27; 2019-08-16; 2022-12-25; 2025-03-09
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: retailer-user-review-packet
- independence: 仮面のオッサン, みゃこすけ, Ss, ふわぽこ, アルビノ는 서로 다른 계정·게시일이지만 같은 플랫폼이다.
- evaluatedRange: 전 리뷰가 단권 완독 내용을 구체적으로 언급한다.
- supportedClaims: gaze를 직접 또는 화면 너머로 받아도 죽는 제약, 막고 쓰러뜨리는 방법의 난점, 사냥꾼과 군인의 짧은 buddy 구조, 대결 중심의 높은 밀도, 다수 사망과 공포, 인물 사이 마음이 연결되는 과정이 반복 관찰된다.
- observation: 단권 전체 공식 소개와 같은 구체 사건·제약을 서로 다른 완독자가 교차 확인한다.
- limitation: 같은 플랫폼의 리뷰 묶음이며 단순 다수결하지 않는다. 작화 평가와 별점은 사용하지 않는다.
- provenanceFactorClassification: factor-evidence-secondary

### Axis 결론

- problemSolving=3: candidate-known. 치명적 gaze를 어떻게 차단하고 격파할지가 단권 전체의 명시적 제약이며 복수 완독자가 같은 해결 난점을 관찰한다. 공식 본문 전체 해결 순서를 직접 확보하지 못해 4 대신 3이다.
- pacing=4: candidate-known. 204쪽 7개 chapter가 숲, 도시, 군·정보기관, 차량 추격, 탑 결투로 빈번하게 큰 상태·장소를 바꾸고 완독 리뷰도 대결 중심 밀도를 반복 관찰한다.
- worldBuilding=2: candidate-known. gaze rule과 군·CIA 대응은 기능적으로 사건을 계속 제약하지만 역사·문화·세력 체계 자체가 주 보상은 아니다.
- characterArcWeight=2: candidate-known. 노년 사냥꾼의 재참전과 인물 간 마음의 연결이 대결 목표와 균형을 이룬다. 인물 변화가 사건보다 우세하다는 3~4 근거는 없다.
- relationshipStructure=2: candidate-known. 사냥꾼·딸·미군·CIA라는 고정 핵심과 짧은 buddy 구조가 확인되지만 복합 ensemble 수준은 아니다.
- darkness=4: candidate-known. 대규모 사망과 인류 위기가 opening부터 결말 대결까지 중심이다. 폭력 장르에서 자동 추론한 값이 아니다.
- mentalStress=3: candidate-known. chapter 자체가 군인의 절망을 명시하고, 즉사 gaze와 식별 불능 압박이 단권 전체를 지배한다. 인물 붕괴가 유일한 보상은 아니므로 4보다 3이다.
- emotionalWarmth=2: candidate-known. buddy와 인물 간 신뢰·마음 연결이 공포·대결과 섞여 나타난다는 복수 구체 관찰이 있다. 따뜻함 core level 4는 아니다.
- progression: closed-unknown. 성장·습득 보상은 확인되지 않는다.
- strategy: closed-unknown. 기관과 전투가 있어도 구체적인 단기 계획 연쇄를 공식 페이지·현재 preview로 직접 확인하지 못했다.
- mysteryReveal: closed-unknown. 위협 rule은 전제로 제시되며 단서·추론·진상 공개가 주 보상인지 확인되지 않는다.
- comedy, romance: closed-unknown. known 0에 필요한 반복적 부재 확인도 없다.
- finalCandidateNarrative: U / 3 / U / 4 / U / 2 = 3/6
- finalCandidateTone: 2 / 2 / U / 4 / 3 / U / 2 = 5/7
- remainingOfficialRoute: 같은 공식 단권 viewer의 중반 해결 준비와 후반 탑 결투 페이지를 합법적으로 더 확인해 strategy 또는 mysteryReveal 하나를 직접 검증한다. 확보하지 못하면 Narrative는 3/6으로 종결한다.
- blockerStatus: identity·safety hard blocker 없음; Tone은 후보 기준 pass, Narrative는 1축 부족하다.

## 7. work-19a26f01512166856a6a — 銀河鉄道999

### Source A — 小学館 공식 전자판 1~3권 소개

- sourceName: 小学館コミック 銀河鉄道999 전자판 1~3권
- sourceUrl: https://shogakukan-comic.jp/book?jdcn=091880010000d0000000 ; https://shogakukan-comic.jp/book?jdcn=091880020000d0000000 ; https://shogakukan-comic.jp/book?jdcn=091880030000d0000000
- publishedAt: 2015-08-07
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: official-publisher-later-electronic-edition
- independence: 같은 후대 전자판 연속 3권이다. 원판 서지의 독립 증거로 사용하지 않는다.
- evaluatedRange: 이 판본 1~3권의 시간순 entry episodes
- supportedClaims: 어머니 상실과 기계 몸 목표, Maetel과 동행, 서로 다른 행성의 사회·생명·도덕 문제를 반복해서 만나는 초반 여행을 지원한다.
- observation: 행성별 사건이 계속되며 Tetsuro가 타인과 세계를 경험할 기회를 반복 제공한다.
- limitation: 후대 전자·재판 계열의 권 구성이므로 내용에만 사용한다. 원작 최초판의 권차·발행 서지나 대표 ISBN identity를 여기서 다시 판정하지 않는다.
- provenanceFactorClassification: factor-evidence-primary-edition-limited

### Source B — BookLive 1~2권 독립 리뷰

- sourceName: BookLive 銀河鉄道999 1권·2권 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/327375/vol_no/001 ; https://booklive.jp/product/index/title_id/327375/vol_no/002
- publishedAt: 2021-05-14; 2022-09-28; 2023-03-01; 2023-03-05
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: retailer-user-review-packet
- independence: 익명, かおちゃん, ニク, CAT는 독립 계정이지만 같은 BookLive 플랫폼이다.
- evaluatedRange: 후대 전자판 1권 또는 2권을 직접 표기한 리뷰
- supportedClaims: 1권의 서로 다른 선·악·친절한 사람들과 행성 경험, 2권의 행성·주민 접촉을 통한 소년 마음의 점진적 성장, Maetel의 친절과 유한한 생명의 가치를 구체적으로 관찰한다.
- observation: 공식 전자판 entry 구조에 progression과 혼합된 따뜻함이 실제 독서 관찰로 반복 대응한다.
- limitation: 리뷰 문장은 기관 합의가 아니고 같은 플랫폼이다. 3권 이후나 전체 시리즈 결말을 언급하는 리뷰는 제외했다.
- provenanceFactorClassification: factor-evidence-secondary

### Source C — コミックシーモア 교차 플랫폼 리뷰

- sourceName: コミックシーモア 銀河鉄道999 리뷰
- sourceUrl: https://www.cmoa.jp/title/98509/
- publishedAt: 2019-01-03
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: retailer-user-review-secondary
- independence: BookLive와 다른 플랫폼의 기명 계정 ドージマ다.
- evaluatedRange: 작품 전체 회고이며 entry 전용 권 범위는 불명확하다.
- supportedClaims: 행성마다 만나는 인물의 사정과 삶을 통해 작품의 인간적 관찰이 반복된다는 보조 관찰을 제공한다.
- observation: entry 1~2권 리뷰의 친절·생명 관찰과 방향은 같지만 범위가 넓다.
- limitation: 전체작 리뷰이므로 값의 주 근거가 아니라 교차 플랫폼 보조 근거로만 사용한다.
- provenanceFactorClassification: factor-evidence-secondary-limited

### Axis 결론

- progression=2: candidate-known. 공식 entry episodes가 서로 다른 사회와 인물을 반복 경험하게 하고, 2권을 직접 읽은 독립 리뷰가 그 접촉을 통한 소년 마음의 점진적 성장을 명시한다. 명시적 skill·rank 보상은 아니므로 3~4가 아니다.
- emotionalWarmth=2: candidate-known. 1~2권 범위 리뷰가 친절한 인물, Maetel의 친절, 생명의 가치를 반복 관찰하고 다른 플랫폼도 인간적 관계를 교차 확인한다. 비극과 잔혹함이 함께 있어 4가 아니라 혼합 2다.
- problemSolving: closed-unknown. 다양한 사건은 존재하지만 제약 분석과 영리한 해결의 반복이 직접 확인되지 않았다.
- strategy: closed-unknown. 행성 여행은 장기 계획·전쟁·자원 관리 보상과 다르다.
- mysteryReveal: closed-unknown. Maetel의 수수께끼는 entry에 제시되지만 현재 권 리뷰는 해답보다 미해결을 말한다.
- comedy: closed-unknown. 반복 구체 관찰이 없다.
- mentalStress: closed-unknown. 상실·위험과 darkness는 확인되지만 핵심 인물의 지속적 불안·붕괴를 별도로 확인하지 못했다.
- romance: closed-unknown. known 0의 반복적 부재 자료가 없다.
- finalCandidateNarrative: 2 / U / U / 3 / U / 4 = 3/6
- finalCandidateTone: 2 / 2 / U / 3 / U / U / 2 = 4/7
- remainingOfficialRoute: 동일 후대 전자판 1~3권의 내부 episode pages에서 반복 problem-solving 또는 심리 압박을 직접 확인하되, 원판 서지로 전용하지 않는다.
- blockerStatus: edition limitation은 identity blocker가 아니다. hard blocker 없음; N+1 T+1 미달이다.

## 8. work-1e27731b880d0d9012f8 — 吉祥天女

### Source A — 小学館 공식 1권과 내부 미리보기

- sourceName: 小学館コミック 吉祥天女 1 및 e-comi viewer
- sourceUrl: https://shogakukan-comic.jp/book?jdcn=091313010000d0000000 ; https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091313010000d0000000
- publishedAt: electronic edition 2014-03-03
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: official-publisher-volume-and-internal-preview
- independence: 같은 JDCN·출판사 자료다. 2~3권 상품 페이지가 같은 총론을 반복하므로 별도 독립 Evidence로 세지 않는다.
- evaluatedRange: 1권 opening pages 18~23
- pageRefsAndHashes: 5ae4c01cc93cd89f885f62dba5d82fd196201c9ac6ce6c56729c53405a97b218, f888ddf6461d5f4c29f2df4840187586155203688e9cb14841cbdbb5d5fcd77e, 69dbc1327c9420d160be26b5e32730c90e9649542d71c15918fc95534a1c58b9
- supportedClaims: 학교 내 고립·괴롭힘, Yuiko를 겨냥한 모욕, Sayoko의 개입과 둘의 초기 관계가 직접 확인된다.
- observation: 관계·압박·보호가 도입부터 존재하지만 2~3권의 사건 순서는 공식 상품 총론만으로 비어 있다.
- limitation: 6쪽 opening과 반복 총론만으로 Narrative 구조를 확정하지 않는다.
- provenanceFactorClassification: factor-evidence-primary

### Source B — BookLive 1권 독립 리뷰

- sourceName: BookLive 吉祥天女 1권 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/246501/vol_no/001
- publishedAt: 2009-10-04; 2011-04-21; 2013-09-19; 2025-04-10
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: retailer-user-review-packet
- independence: 서로 다른 Booklog·BookLive 계정의 관찰이지만 같은 집계 페이지다.
- evaluatedRange: 1권을 직접 표기. 한 리뷰는 전입부터 성폭력 미수와 핵심 인물 집결까지라고 범위를 명시한다.
- supportedClaims: 첫 권에서 학교 갈등이 성폭력 미수까지 악화되고, Sayoko가 영리하게 맞서며, 여러 인물의 운명이 그녀를 중심으로 흔들리는 구조와 공포·긴장을 반복 관찰한다.
- observation: 공식 opening의 괴롭힘과 개입을 더 넓은 1권 범위로 연결한다.
- limitation: 2~3권의 전개·해소 구조는 직접 확인하지 못한다. 감정 태그는 사용하지 않았다.
- provenanceFactorClassification: factor-evidence-secondary-entry-scoped

### Source C — コミックシーモア 완독 리뷰 묶음

- sourceName: コミックシーモア 吉祥天女 리뷰
- sourceUrl: https://www.cmoa.jp/title/2733/
- publishedAt: 2008-07-19; 2009-08-09; 2009-10-31; 2009-12-26; 2010-04-20
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: retailer-user-review-packet
- independence: 嫦娥, 恋妃, 桜餅, 清春, ブルーリング은 서로 다른 계정·게시일이지만 같은 플랫폼이다.
- evaluatedRange: 4권 완결 전체. entry 1~3권으로 정확히 분해되지 않는다.
- supportedClaims: 어린 시절 상처와 공포, 남성의 욕망과 위협, 자기방어·복수, 여러 인물의 운명과 관계, 잔혹함 속 약자를 지키려는 연민이 작품 전체에서 반복된다는 관찰을 제공한다.
- observation: 1권 공식·독립 자료가 확인한 괴롭힘·성폭력 위협·보호 관계와 방향이 일치한다.
- limitation: 4권 결말이 섞여 있어 psychological strategy, mysteryReveal, pacing 같은 Narrative 값을 1~3권으로 직접 매핑하지 않는다. Tone의 지속성 보조로만 쓴다.
- provenanceFactorClassification: factor-evidence-secondary-range-limited

### Axis 결론

- characterArcWeight=3: candidate-known. 1권부터 Sayoko의 상처·자기방어와 주변 인물의 운명이 핵심 갈등이고 완독 리뷰들이 동기·관계·상처를 일관되게 관찰한다. 사건과 인물 보상이 함께 있어 4가 아니라 3이다.
- relationshipStructure=2: candidate-known. Sayoko·Yuiko와 여러 반복 주변 인물이 관계 갈등을 구성하지만 1~3권 전체를 복합 ensemble 수준으로 확정할 자료는 없다.
- darkness=3: candidate-known. 1권의 괴롭힘·성폭력 미수와 전체의 폭력·복수·죽음 관찰이 직접 이어진다. 극단 4는 entry 2~3권 직접 자료 부재 때문에 주지 않는다.
- mentalStress=3: candidate-known. 고립, 성적 위협, 과거 상처, 자기방어 압박이 인물 동기와 지속 결합한다. 단순 horror 장르 추론이 아니다.
- emotionalWarmth=2: candidate-known. 공식 opening의 약자 보호와 완독 리뷰의 연민·보호 관찰이 가혹함과 함께 나타난다. 따뜻함이 지배적이지 않아 혼합 2다.
- progression: closed-unknown. 반복 성장·습득 보상이 확인되지 않는다.
- problemSolving: closed-unknown. 위협에 맞서는 영리함은 보이지만 제약 분석과 해결의 반복을 entry 1~3권에서 직접 확인하지 못했다.
- strategy: closed-unknown. 완독 리뷰의 심리적 대응을 4권 결말과 분리할 수 없어 1~3권 strategy로 승격하지 않는다.
- pacing: closed-unknown. 2~3권 사건 순서가 비어 있다.
- mysteryReveal: closed-unknown. 수수께끼의 인물 전제와 미해결 감상은 단서·추론·진상 공개의 반복 보상을 입증하지 않는다.
- comedy, romance: closed-unknown. 소매점 장르 태그를 값으로 쓰지 않았고 known 0의 직접 부재 자료도 없다.
- finalCandidateNarrative: U / U / U / U / U / U = 0/6
- finalCandidateTone: 3 / 2 / U / 3 / 3 / U / 2 = 5/7
- remainingOfficialRoute: 小学館의 2~3권 내부 preview 또는 권별 공식 편집 해설로 Narrative 네 축을 직접 검토한다. 전체 4권 리뷰만으로는 bridge하지 않는다.
- blockerStatus: identity·safety hard blocker 없음; Tone은 후보 기준 pass지만 Narrative 4축이 부족하다.

## 9. work-207bb1ca28b7472fbe1d — 六三四の剣

### Source A — 小学館 공식 1권 내부 미리보기

- sourceName: 小学館 eコミックストア 六三四の剣 1권 viewer
- sourceUrl: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091206310000d0000000
- publishedAt: electronic edition 2013-01-01
- retrievedAt: 2026-08-23
- urlLiveCheck: product와 viewer 모두 HTTP 200
- authorityClass: official-publisher-internal-preview
- independence: frozen 1권 상품 페이지와 같은 판본·출판사다.
- evaluatedRange: 1권 pages 18~23, 연속 6쪽
- pageRefsAndHashes: 694e6108f011aee83ca9114a69df18b54b30e93a55a921000c1bbbc1f14b0e4b, b653472dad22aaa2ac88b64ddc0a5270d3b00fa5d0d6f3abf93ec37ed56063e9, 2e06569fb3eab745b58cd5d4f3e72474ad13f8f89cfe45dd09c5cd4e4a419edf
- supportedClaims: 가족·유아 일상에서 과장된 행동, 개 추격과 충돌, 주변 인물의 comic reaction이 짧은 구간에 여러 번 나타난다.
- observation: comedy가 스포츠 장면만으로 추론된 것이 아니라 공식 본문에 직접 존재한다.
- limitation: 1권 6쪽이므로 지속성은 외부 entry·작품 관찰과 교차해야 한다.
- provenanceFactorClassification: factor-evidence-primary

### Source B — 読書メーター 1권 리뷰

- sourceName: 読書メーター 六三四の剣 1권 리뷰
- sourceUrl: https://bookmeter.com/books/11059
- publishedAt: 2019-01-11; 2019-09-01
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- authorityClass: user-review-packet
- independence: ノースポール과 ピロ는 서로 다른 계정·게시일이지만 같은 플랫폼이다.
- evaluatedRange: 小学館文庫 1권. 원판과 권 구성이 다르므로 early childhood 구간만 내용 대응한다.
- supportedClaims: 어린 六三四의 난장 행동이 반복되고, 한 독자는 아이가 그림과 낭독에서 반복해 웃었다고, 다른 독자는 1권의 유아를 일관되게 난장형 인물로 관찰한다.
- observation: 공식 1권 preview의 comic mishap이 한 장면에 그치지 않는다는 보조 관찰이다.
- limitation: 문고 1권의 수록량은 frozen 전자판 1권과 다르다. early childhood 공통 구간 밖으로 확장하지 않는다.
- provenanceFactorClassification: factor-evidence-secondary-edition-limited

### Source C — ほんのきもち 편집 리뷰 PDF

- sourceName: うららか ほんのきもち 작가별 리뷰 六三四の剣
- sourceUrl: https://uraraka.co.jp/downloadpop/sakka/pdf_sakka/201411_sakka.pdf
- publishedAt: 2014-11
- retrievedAt: 2026-08-23
- urlLiveCheck: 검색 인덱스에서 PDF 본문 확인; 로컬 direct GET은 정상 종료하지 않아 접근성 제한 기록
- authorityClass: independent-editorial-review
- independence: 출판사와 별개의 기명 편집 리뷰다.
- evaluatedRange: 작품 회고 전체
- supportedClaims: 六三四의 난장 행동에서 반복적으로 웃음이 생기며, 진지한 검도 시합과 구분된다는 관찰을 제공한다.
- observation: official early preview와 같은 comedy / serious-match 병치를 장기 작품 수준에서 보조한다.
- limitation: 전체작 회고이고 현재 direct URL 접근이 불안정하다. 단독 Evidence로 사용하지 않는다.
- provenanceFactorClassification: factor-evidence-secondary-limited

### Axis 결론

- comedy=2: candidate-known. 공식 1권 본문에서 여러 comic mishap이 직접 확인되고, 서로 다른 early-volume 독자와 편집 리뷰가 난장 행동의 반복 웃음을 교차 관찰한다. 검도·상실의 진지한 축도 커서 core 4가 아니라 intermittent 2다.
- mentalStress: closed-unknown. 3권의 상실은 크지만 지속적 불안·붕괴를 entry 전체에서 직접 확인하지 못했다.
- romance: closed-unknown. known 0의 반복적 부재 자료가 없다.
- finalCandidateNarrative: 3 / 0 / 0 / 3 / 0 / 2 = 6/6
- finalCandidateTone: 3 / 2 / 2 / 2 / U / U / 2 = 5/7
- remainingOfficialRoute: 없음. candidate-known은 Pass B에서 official preview와 문고판 범위 caveat를 재확인한다.
- blockerStatus: hard blocker 없음; candidate가 채택되면 text coverage pass.

## 종료 원장

| Metric                            | Result |
| --------------------------------- | -----: |
| 조사 작품                         |      9 |
| 추가 candidate-known Axis         |     20 |
| 새 known 후보를 만들지 않은 작품  |      3 |
| 보강 후 text coverage pass 후보   |      2 |
| 보강 후 Narrative 미달 축 합계    |     10 |
| 보강 후 Tone 미달 축 합계         |      6 |
| identity 또는 safety hard blocker |      0 |

### 다음 adjudication에 넘길 항목

1. candidate-known 20개는 Factor Dictionary anchor, entry 범위, 판본 bridge를 다시 확인한 뒤 채택·수정·unknown 중 하나로 닫는다.
2. デカワンコ와 六三四の剣만 이 packet의 후보를 모두 채택할 때 text coverage를 통과한다.
3. RED 원판 3권은 ISBN 9784063460490과 1999-12-04 공식 발매 기록으로 매핑됐으며 identity blocker로 되돌리지 않는다.
4. 銀河鉄道999는 후대 전자판의 내용 순서만 사용했다. 원판 서지나 대표 ISBN을 이 packet에서 변경하지 않는다.
5. 나머지 7작품은 위에 적은 유한 공식 route가 실패하면 부족 Axis를 unknown으로 종결하고 실제 coverage gate 결과를 기록한다. 수량을 맞추기 위한 값 생성은 하지 않는다.
6. 이 문서의 모델 검수 provenance는 reviewedByHuman=false다.
