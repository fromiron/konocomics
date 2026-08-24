# Batch 002 text coverage gap research — chunk 02

- batchId: batch-002
- sourceChunk: chunk-02
- scope: round-01 coverage gap 10작품
- evaluatedRange: 작품별 진입 1~3권 또는 단권 전체
- retrievedAt: 2026-08-23
- reviewedByHuman: false
- outputKind: supplemental-evidence-packet
- decisionBoundary: 이 문서는 candidate-known 또는 closed-unknown을 제안할 뿐 Factor source row, promotion 상태, identity, safety를 변경하지 않는다.
- routeBoundary: text-gap-queue-chunk-02.csv의 작품별 route만 조사했다. hard blocker는 만들지 않았다.

## 동결 입력

| Input                                    | SHA-256                                                          |
| ---------------------------------------- | ---------------------------------------------------------------- |
| docs/factors/factor-dictionary.md        | a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be |
| adjudication/text-chunk-02-round-01.md   | fda86dd1ec1c8868faf8f1678b9d95e9fcb5f547f5df741b48e4f406e3949726 |
| adjudication/text-gap-queue-chunk-02.csv | 5b10a5e91795c7b191ea9b38d1d98f5b986dd374b1f6f85cb0f8bba8f329963d |
| research/chunk-02.md                     | 645c8e20898357c3533cb879b197c367209e3fed66c9dceb495c7ee6bf0817ed |

## 판정 규칙

- 공식 출판사 1~3권 소개, 공식 내부 미리보기, 공식 편집 자료를 먼저 확인했다.
- 선정 provenance, 수상 순위, 별점, 장르 태그는 Factor Evidence로 사용하지 않았다.
- 장르나 Art 값에서 텍스트 Axis를 역추론하지 않았다.
- known 0은 반복적 부재를 직접 확인한 경우에만 허용하지만, 이번 추가 조사에는 그 기준을 만족한 축이 없다.
- 서로 다른 리뷰 계정은 저자 단위로는 독립이지만 같은 플랫폼 안에서는 완전한 독립 출처로 세지 않았다. 공식 자료와 다른 리뷰 플랫폼의 구체 관찰이 같은 방향일 때만 보조 신뢰도로 사용했다.
- 리뷰가 작품 전체를 회고하면 진입 1~3권에 자동 투영하지 않았다. 정확한 권차 리뷰 또는 발행 시점상 진입 범위만 읽을 수 있었던 리뷰를 우선했다.
- candidate-known은 다음 Pass B와 Pass C에서 다시 판정해야 한다. closed-unknown은 낮은 값이 아니라 현재 유한 route에서 책임 있게 값을 정하지 못했다는 종료 상태다.
- URL 43개를 2026-08-23에 다시 요청했고 모두 HTTP 200이었다. 공식·출판사 계열 URL 30개와 독립 서점 리뷰 URL 13개다.

## 결과 요약

Axis 표기 순서는 Narrative가 progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding, Tone이 characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth이다. U는 unknown이다.

| Pos | workId                    | canonicalTitle   | Round-01 N/T | 추가 candidate-known                                                                                                                                               | 보강 후 후보 N/T | Text gate    | hardBlocker |
| --: | ------------------------- | ---------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ------------ | ----------- |
|  11 | work-29d4300ad9d3358fb67a | 外天楼           | 4/6, 2/7     | comedy=2                                                                                                                                                           | 4/6, 3/7         | fail T+2     | false       |
|  12 | work-3dfaf6231e21133620c6 | 忍者と極道       | 3/6, 5/7     | 없음                                                                                                                                                               | 3/6, 5/7         | fail N+1     | false       |
|  13 | work-3e725951eb9c49771087 | 嘘解きレトリック | 4/6, 3/7     | comedy=2; emotionalWarmth=2                                                                                                                                        | 4/6, 5/7         | pass         | false       |
|  14 | work-40b8c35b1d8c9a90144c | orange           | 0/6, 0/7     | 없음                                                                                                                                                               | 0/6, 0/7         | fail N+4 T+5 | false       |
|  15 | work-4c784fc78dfd9b139c3f | 正反対な君と僕   | 1/6, 5/7     | 없음                                                                                                                                                               | 1/6, 5/7         | fail N+3     | false       |
|  16 | work-518d7ed42dd9253679c3 | 墨攻             | 5/6, 3/7     | 없음                                                                                                                                                               | 5/6, 3/7         | fail T+2     | false       |
|  17 | work-53e54c95f637b66c4fb2 | がんばれ元気     | 3/6, 5/7     | 없음                                                                                                                                                               | 3/6, 5/7         | fail N+1     | false       |
|  18 | work-5915d6d7601377fcc75f | 赤髪の白雪姫     | 3/6, 6/7     | 없음                                                                                                                                                               | 3/6, 6/7         | fail N+1     | false       |
|  19 | work-5b4dc4e6e966436b2990 | 人形芝居         | 3/6, 3/7     | darkness=2                                                                                                                                                         | 3/6, 4/7         | fail N+1 T+1 | false       |
|  20 | work-5b9a3ec60ac5fc90f444 | 魔法使いの嫁     | 0/6, 0/7     | progression=2; pacing=3; mysteryReveal=2; worldBuilding=3; characterArcWeight=4; relationshipStructure=2; darkness=3; mentalStress=2; romance=3; emotionalWarmth=3 | 4/6, 6/7         | pass         | false       |

- candidate-known: 4작품, 14축
- closed-unknown만 유지: 6작품
- text coverage pass 후보: 2작품
- text coverage fail 잔존: 8작품
- coverage 하한까지 남은 부족량: Narrative 11축, Tone 10축

수량을 맞추기 위해 candidate를 늘리지 않았다. 특히 사건의 폭력성은 mentalStress로, 직업이나 능력은 problemSolving으로, 관계 변화는 progression으로 자동 변환하지 않았다.

## 11. work-29d4300ad9d3358fb67a — 外天楼

### Source A — 講談社 단권 공식 소개

- sourceName: 講談社 外天楼 단행본 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000223170
- publishedAt: 2011-10-21, 단행본 발매일; 웹 페이지 자체는 undated
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: 출판사 1차 자료이며 frozen research의 같은 상품 페이지다.
- evaluatedRange: 단권 전체, 9편, 234쪽
- claim: 연결되는 기묘한 사건과 놀라운 진실뿐 아니라 작품을 유쾌하면서도 애잔한 미스터리로 직접 설명한다.
- limitation: 한 줄의 홍보 문구만으로 따뜻함, 심리 압박, 인물 변화의 강도를 정하지 않는다.

### Source B — コミックシーモア 단권 리뷰 묶음

- sourceName: コミックシーモア 外天楼 독자 리뷰
- sourceUrl: https://www.cmoa.jp/title/54875/
- publishedAt: 2021-10-31; 2023-04-09; 2025-03-11
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: 서로 다른 세 계정이지만 같은 Cmoa 플랫폼이다. 공식 문구와는 독립이다.
- evaluatedRange: 단권 전체
- claim: 초반의 가벼운 미스터리와 소동, 웃음이 후반의 불길함과 진실 공개로 바뀐다는 관찰이 반복된다.
- limitation: 결말의 충격이나 독자의 불쾌감은 인물의 지속적 mentalStress와 같은 값이 아니다. 마지막의 구원을 언급한 관찰도 한 계정뿐이다.

### Source C — BookLive 단권 리뷰 묶음

- sourceName: BookLive 外天楼 1권 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/179913/vol_no/001
- publishedAt: 2013-05-16; 2013-12-17; 2017-10-02
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: BookLive에 실린 서로 다른 Booklog 계정 관찰이다. Cmoa와 플랫폼은 다르지만 Booklog 원문을 별도 출처로 다시 세지 않았다.
- evaluatedRange: 단권 전체
- claim: 초중반의 코미디 조와 웃음을 유지하는 전개가 후반 시리어스 전개로 전환된다는 관찰이 반복된다.
- limitation: 회고형 리뷰이며 관계의 따뜻함이나 인물 내적 변화의 중심성을 직접 측정하지 않는다.

### Axis 결론

- comedy=2: candidate-known. 공식 단권 소개와 두 독립 플랫폼의 단권 리뷰가 초중반에 반복되는 웃음과 코미디 조를 함께 확인한다. 후반부가 시리어스로 바뀌므로 핵심값 4가 아니라 혼합 수준 2다.
- characterArcWeight: closed-unknown. 결말의 감정적 충격은 인물 변화가 핵심 보상이라는 직접 근거가 아니다.
- mentalStress: closed-unknown. 독자 충격과 인물의 지속적 불안·압박을 구분했다.
- romance: closed-unknown. 부재를 반복적으로 확인한 공식 자료가 없어 known 0으로 만들지 않는다.
- emotionalWarmth: closed-unknown. 애잔함과 마지막 한 이미지의 구원은 유대·힐링이 반복 보상이라는 근거가 아니다.
- finalCandidateNarrative: U / 2 / U / 3 / 4 / 2 = 4/6
- finalCandidateTone: U / 2 / 2 / 2 / U / U / U = 3/7
- blockerStatus: hard blocker 없음; Tone coverage가 2축 부족하다.

## 12. work-3dfaf6231e21133620c6 — 忍者と極道

### Source A — 講談社 연재 개시 자료와 공식 제1화

- sourceName: 講談社 연재 개시 보도자료; Comic DAYS 제1화
- sourceUrl: https://prtimes.jp/main/html/rd/p/000002502.000001719.html ; https://comic-days.com/episode/10834108156722664318
- publishedAt: 2020-01-20; 제1화 페이지 자체 날짜는 undated
- retrievedAt: 2026-08-23
- urlLiveCheck: 두 URL 모두 HTTP 200
- independence: 보도자료와 제1화는 같은 講談社 계열이므로 하나의 공식 source family다.
- evaluatedRange: 제1화와 공식 1~3권 소개
- claim: 상처 때문에 웃지 못하는 소년, 이중생활을 하는 조직 수장, 300년간 대립한 두 집단의 만남과 충돌을 직접 확인한다.
- limitation: 첫 화와 권 소개는 반복 성장, 제약 분석, 전술 계획의 수행 과정을 보여 주지 않는다. 집단 전쟁 전제만으로 strategy를 확정하지 않는다.

### Axis 결론

- progression: closed-unknown. 1~3권에서 반복 성장·획득·숙련 보상이 확인되지 않았다.
- problemSolving: closed-unknown. 전투에서 제약을 분석하고 기발하게 해결하는 반복 과정이 노출되지 않았다.
- strategy: closed-unknown. 세 집단 충돌의 규모는 확인되지만 장기 계획·자원 운영의 과정은 확인되지 않았다.
- finalCandidateNarrative: U / U / U / 3 / 2 / 3 = 3/6
- finalCandidateTone: 3 / 2 / U / 4 / 3 / U / 1 = 5/7
- blockerStatus: hard blocker 없음; Narrative coverage가 1축 부족하다.

## 13. work-3e725951eb9c49771087 — 嘘解きレトリック

### Source A — 白泉社 1~3권 공식 소개

- sourceName: 白泉社 嘘解きレトリック 1권·2권·3권
- sourceUrl: https://www.hakusensha.co.jp/comicslist/45955/ ; https://www.hakusensha.co.jp/comicslist/45957/ ; https://www.hakusensha.co.jp/comicslist/45959/
- publishedAt: 2013-06-20; 2013-11-20; 2014-05-20
- retrievedAt: 2026-08-23
- urlLiveCheck: 세 URL 모두 HTTP 200
- independence: 같은 출판사의 연속 세 권이며 서로 다른 사건 범위를 제공한다.
- evaluatedRange: 원판 1~3권
- claim: 배척받던 鹿乃子가 자신을 받아들이는 탐정 左右馬를 만나고, 둘이 일상 속 여러 사건과 수수께끼를 함께 다룬다.
- limitation: 상품 소개만으로 웃음과 따뜻함의 빈도를 정하지 않는다.

### Source B — BookLive 1권 범위 리뷰 묶음

- sourceName: BookLive 嘘解きレトリック 1권 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/303808/vol_no/001
- publishedAt: 2022-09-28; 2022-09-29; 2024-10-29; 2025-02-15
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: 서로 다른 계정이지만 같은 BookLive 플랫폼이다. 1권 리뷰 화면에 직접 귀속된 관찰만 사용했다.
- evaluatedRange: 1권 무료판 또는 1권 구매판
- claim: 느슨한 일상과 미스터리, 코미디 조, 탐정과 주인공의 수용·신뢰, 마음이 따뜻해지는 에피소드가 반복 관찰된다.
- limitation: 리뷰의 감정 태그와 별점은 사용하지 않았다. 일부 계정의 드라마 비교 문장은 제외했다.

### Source C — コミックシーモア 독자 리뷰 묶음

- sourceName: コミックシーモア 嘘解きレトリック 독자 리뷰
- sourceUrl: https://www.cmoa.jp/title/91279/
- publishedAt: 2022-01-30; 2024-05-10
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: Cmoa의 서로 다른 계정이며 BookLive와 플랫폼이 다르다.
- evaluatedRange: 작품 회고; 한 리뷰는 3~4권도 언급하므로 진입 범위를 넘을 수 있음
- claim: 사건과 일상의 배분, 밝고 코믹한 표현, 배척받던 주인공을 받아들이고 불안에 함께 대응하는 관계, 따뜻한 독후감이 반복된다.
- limitation: 전체작 회고를 1~~3권에 단독 투영하지 않고, 공식 1~~3권과 BookLive 1권 관찰의 보조 근거로만 사용한다.

### Axis 결론

- comedy=2: candidate-known. 1권 귀속 복수 리뷰와 별도 플랫폼 리뷰가 사건 사이의 코미디 조를 반복 관찰한다. 사건 미스터리가 중심이므로 핵심값 4가 아니라 혼합 수준 2다.
- emotionalWarmth=2: candidate-known. 공식 1권의 배척과 수용, 공식 2~3권의 고정된 협업 관계에 더해 두 플랫폼이 신뢰·수용·따뜻한 에피소드를 반복 관찰한다. 유대가 유일한 핵심 보상이라고 단정하지 않아 2로 제한한다.
- mentalStress: closed-unknown. 초반 배척과 사건 긴장은 존재하지만 지속적 심리 압박 보상은 확인되지 않았다.
- romance: closed-unknown. 후대 권의 연애 진행을 1~3권에 투영하지 않았고, 반복적 부재도 직접 확인하지 못했다.
- finalCandidateNarrative: U / 3 / U / 3 / 3 / 2 = 4/6
- finalCandidateTone: 2 / 2 / 2 / 2 / U / U / 2 = 5/7
- blockerStatus: hard blocker 없음; 두 candidate가 채택되면 text coverage pass다.

## 14. work-40b8c35b1d8c9a90144c — orange

### Source A — 双葉社 현행판 공식 자료

- sourceName: 双葉社 orange 공식 특설 사이트; 2022년 2월 코믹스 주문서
- sourceUrl: https://www.futabasha.co.jp/introduction/orange/pc/index.html ; https://www.futabasha.co.jp/pdf/to-store-extra/comics.pdf
- publishedAt: 2014 copyright; 2022-02
- retrievedAt: 2026-08-23
- urlLiveCheck: 두 URL 모두 HTTP 200
- independence: 같은 双葉社 source family다.
- evaluatedRange: 双葉社판 시리즈 총론과 1~3권 서지
- claim: 현행 双葉社판의 제목·저자·ISBN과 총론은 확인된다.
- limitation: frozen 대표 ISBN 9784088468044인 集英社 원판 1권과 현행판의 수록 목차·본문 동일성을 직접 연결하지 않는다. 공식 원판 1~3권 소개나 변경 없음 문구도 확인하지 못했다.

### Axis 결론

- progression: closed-unknown.
- problemSolving: closed-unknown.
- strategy: closed-unknown.
- pacing: closed-unknown.
- mysteryReveal: closed-unknown.
- worldBuilding: closed-unknown.
- characterArcWeight: closed-unknown.
- relationshipStructure: closed-unknown.
- comedy: closed-unknown.
- darkness: closed-unknown.
- mentalStress: closed-unknown.
- romance: closed-unknown.
- emotionalWarmth: closed-unknown.
- finalCandidateNarrative: U / U / U / U / U / U = 0/6
- finalCandidateTone: U / U / U / U / U / U / U = 0/7
- remainingRoute: 공식 원판 목차 또는 원판과 현행판의 수록 내용 동일성을 밝힌 출판사 자료가 새로 확인될 때만 재개한다. 그 전에는 리뷰를 사용하지 않는다.
- blockerStatus: hard blocker 없음; 판본 bridge 미확인은 text Evidence 한계이며 identity blocker로 확장하지 않는다.

## 15. work-4c784fc78dfd9b139c3f — 正反対な君と僕

### Source A — 集英社 1~3권과 공식 진입 미리보기

- sourceName: 集英社 正反対な君と僕 1권·2권·3권; 少年ジャンプ+ 1·2화 공개
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000022198000 ; https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000024401900 ; https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883395-8 ; https://www.shonenjump.com/p/re/pixiv/164/
- publishedAt: 2022-07-04; 2022-10-04; 2023-03-03; 2022-06-30
- retrievedAt: 2026-08-23
- urlLiveCheck: 네 URL 모두 HTTP 200
- independence: 같은 集英社 source family이며 독립 출처 수로 중복 계산하지 않는다.
- evaluatedRange: 1권 제1~~6화, 2권 제7~~14화, 3권 제15~~22화, 공개 제1~~2화
- claim: 학교 대화와 연애 관계, 자기 성찰, 친구 관계의 확장이 진입 범위의 반복 구조다.
- limitation: 관계 단계와 자기 성찰은 progression의 성장·획득·숙련 보상과 다르다. 학교 일상만으로 worldBuilding 0을 확정하지 않는다.

### Source B — 集英社 공식 작가 인터뷰

- sourceName: 集英社オンライン 阿賀沢紅茶 인터뷰
- sourceUrl: https://shueisha.online/articles/-/135510
- publishedAt: 2023-06-04
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: 작가 직접 발언을 포함한 공식 편집 자료지만 상품 페이지와 같은 출판사다.
- evaluatedRange: 당시 공개된 초반 단행본과 제작 의도
- claim: 인물의 성격 대비, 관계의 어색함과 자연스러운 대화 톤을 의도적으로 조절한 작품임을 지원한다.
- limitation: 제작 의도는 반복적인 문제 해결·전략·수수께끼·설정 규칙을 보여 주지 않는다.

### Axis 결론

- progression: closed-unknown. 관계와 자기 성찰은 characterArcWeight에 대응하며 반복 성장·획득 보상으로 중복 기록하지 않는다.
- problemSolving: closed-unknown. 학교·관계 문제를 다루지만 제약 분석과 기발한 해결 과정이 핵심이라는 근거가 없다.
- strategy: closed-unknown. 장기 계획·정치·자원 운영이 확인되지 않았으며 known 0의 반복적 부재도 직접 검증하지 않았다.
- mysteryReveal: closed-unknown. 수수께끼 구조가 확인되지 않았지만 known 0을 확정할 전 범위 관찰은 없다.
- worldBuilding: closed-unknown. 기능적 배경 규칙의 비중을 판단할 직접 자료가 없다.
- finalCandidateNarrative: U / U / U / 2 / U / U = 1/6
- finalCandidateTone: 4 / 2 / U / U / 1 / 4 / 4 = 5/7
- blockerStatus: hard blocker 없음; Narrative coverage가 3축 부족하다.

## 16. work-518d7ed42dd9253679c3 — 墨攻

### Source A — 小学館 공식 전자판 1~3권

- sourceName: 小学館eコミックストア 墨攻 1권·2권·3권
- sourceUrl: https://e-comi.shogakukan.co.jp/books/091830410000d0000000 ; https://e-comi.shogakukan.co.jp/books/091830420000d0000000 ; https://e-comi.shogakukan.co.jp/books/091830430000d0000000
- publishedAt: undated; undated; undated
- retrievedAt: 2026-08-23
- urlLiveCheck: 세 URL 모두 HTTP 200
- independence: 같은 출판사의 후대 전자판 source family다.
- evaluatedRange: 전자판 1~3권, 각 10화
- claim: 성벽 보수·무기 제작·훈련·방화·암살·땅굴 공격·민간인 살해·퇴각·추방이 이어지는 공성전 구조를 직접 확인한다.
- limitation: 사건의 위험과 비극은 darkness를 지지하지만, 인물의 지속적 심리 압박이나 관계적 따뜻함을 직접 설명하지 않는다.

### Source B — コミックシーモア 작품 리뷰 묶음

- sourceName: コミックシーモア 墨攻 독자 리뷰
- sourceUrl: https://www.cmoa.jp/title/9397/?order=up&page=1
- publishedAt: 2018-04-01; 2018-07-30; 2024-10-11; 2025-09-26
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: 서로 다른 Cmoa 계정이지만 같은 플랫폼이다.
- evaluatedRange: 작품 전체 회고; 정확한 1~3권 경계 불명
- claim: 주인공의 냉정함, 전술, 전쟁 속 인물성, 감동을 반복 언급한다.
- limitation: 전체작 회고이고 entry 범위가 불명확하다. 감동이라는 독자 반응은 emotionalWarmth가 아니며, 전쟁의 잔혹함은 mentalStress와 자동 연결되지 않는다.

### Axis 결론

- comedy: closed-unknown. 공식 진입 범위와 리뷰에서 반복 코미디 보상이 확인되지 않았고, known 0을 확정할 전수 부재 자료도 없다.
- mentalStress: closed-unknown. 사상자·부상·공성 위험은 확인되지만 인물의 불안·고구마·심리 붕괴·압박이 지속된다는 entry 관찰은 없다.
- romance: closed-unknown. known 0을 확정할 반복적 부재 자료가 없다.
- emotionalWarmth: closed-unknown. 인간적인 감동이라는 전체작 리뷰를 유대·힐링의 반복 보상으로 바꾸지 않았다.
- finalCandidateNarrative: U / 4 / 4 / 3 / 1 / 3 = 5/6
- finalCandidateTone: 2 / 3 / U / 3 / U / U / U = 3/7
- blockerStatus: hard blocker 없음; Tone coverage가 2축 부족하다.

## 17. work-53e54c95f637b66c4fb2 — がんばれ元気

### Source A — 小学館 공식 전자판 1~3권

- sourceName: 小学館eコミックストア がんばれ元気 1권·2권·3권
- sourceUrl: https://e-comi.shogakukan.co.jp/books/091202110000d0000000 ; https://e-comi.shogakukan.co.jp/books/091202120000d0000000 ; https://e-comi.shogakukan.co.jp/books/091202130000d0000000
- publishedAt: undated; undated; undated
- retrievedAt: 2026-08-23
- urlLiveCheck: 세 URL 모두 HTTP 200
- independence: 같은 출판사의 후대 전자판 source family다.
- evaluatedRange: 전자판 1~3권
- claim: 아버지의 복귀전과 죽음, 어린 元気의 목표 계승, 몰래 이어가는 연습, 교사의 지지와 체육관 입문을 확인한다.
- limitation: 경기별 분석, 상대 읽기, 훈련 계획, 전술 수행 과정은 요약에 노출되지 않는다.

### Source B — コミックシーモア 리뷰 묶음

- sourceName: コミックシーモア がんばれ元気 독자 리뷰
- sourceUrl: https://www.cmoa.jp/title/528/
- publishedAt: 2008-01-27; 2022-12-10; 2024-03-26; 2025-12-01
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: 서로 다른 Cmoa 계정이지만 같은 플랫폼이다.
- evaluatedRange: 한 계정은 1~2권을 명시하고, 나머지는 작품 전체 회고
- claim: 아버지와 아들의 도입, 노력과 인내, 감정적 성장, 관계의 감동을 반복 관찰한다.
- limitation: 복수 리뷰가 구체적인 bout analysis, 제약 해결, 장기 계획을 entry 1~3권에 귀속하지 않는다. 작품 전체 교훈을 Narrative 방법으로 바꾸지 않는다.

### Axis 결론

- problemSolving: closed-unknown. 경기·훈련의 존재와 문제 해결 방식은 다르다.
- strategy: closed-unknown. 목표와 인내는 장기 계획·전술·자원 운영의 반복 보상이 아니다.
- mysteryReveal: closed-unknown. known 0을 확정할 반복적 부재 자료가 없어 unknown을 유지한다.
- finalCandidateNarrative: 2 / U / U / 3 / U / 2 = 3/6
- finalCandidateTone: 4 / 2 / U / 2 / 2 / U / 3 = 5/7
- blockerStatus: hard blocker 없음; Narrative coverage가 1축 부족하다.

## 18. work-5915d6d7601377fcc75f — 赤髪の白雪姫

### Source A — 白泉社 1~3권 공식 소개

- sourceName: 白泉社 赤髪の白雪姫 1권·2권·3권
- sourceUrl: https://www.hakusensha.co.jp/comicslist/44169/ ; https://www.hakusensha.co.jp/comicslist/44171/ ; https://www.hakusensha.co.jp/comicslist/44173/
- publishedAt: 2007-12-05; 2008-08-05; 2009-03-05
- retrievedAt: 2026-08-23
- urlLiveCheck: 세 URL 모두 HTTP 200
- independence: 같은 출판사의 연속 세 권이다.
- evaluatedRange: 원판 1~3권
- claim: 이주와 만남, 궁정 약제사 시험 합격, 병사들의 질병 사건, 왕실 관계 갈등을 확인한다.
- limitation: 합격과 질병 사건 사실만으로 어떤 지식·추론·제약 분석이 해결을 이끌었는지 알 수 없다.

### Source B — BookLive 2권 리뷰 묶음

- sourceName: BookLive 赤髪の白雪姫 2권 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/319367/vol_no/002
- publishedAt: 2009-10-04; 2010-12-09; 2021-03-24; 2022-09-29; 2023-07-14
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: 서로 다른 계정이지만 같은 BookLive 화면이다.
- evaluatedRange: 2권
- claim: 약제사 합격, 직업 시작, 성곽 질병 사건, 관계와 정치 갈등이 한 권 안에서 전개된다는 관찰이 반복된다.
- limitation: 독자들은 해결 방법의 구체적 분석·추론을 반복 관찰하지 않는다.

### Source C — コミックシーモア 리뷰 묶음

- sourceName: コミックシーモア 赤髪の白雪姫 독자 리뷰
- sourceUrl: https://www.cmoa.jp/title/customer_review/title_id/98014/
- publishedAt: 2015-09-16; 2017-04-22; 이후 리뷰 포함
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: BookLive와 다른 플랫폼의 복수 계정이다.
- evaluatedRange: 작품 전체 회고; 일부는 3권까지 읽었다고 명시
- claim: 약제사로 경험을 쌓고 스스로 선택하는 주인공이라는 관찰을 지원한다.
- limitation: 전 범위 회고는 entry 문제 해결 방법을 직접 보여 주지 않으며 progression=2 또는 characterArcWeight=4를 보강할 뿐 새 Narrative 축을 만들지 않는다.

### Axis 결론

- problemSolving: closed-unknown. 질병 사건과 약제사 직업은 확인됐지만 제약 분석과 지식 적용 과정이 공개되지 않았다.
- strategy: closed-unknown. 왕실 갈등의 존재만으로 장기 계획·정치 운영을 확정하지 않는다.
- mysteryReveal: closed-unknown. 질병의 원인 공개 방식이나 단서·추리 보상이 확인되지 않았다.
- finalCandidateNarrative: 2 / U / U / 3 / U / 2 = 3/6
- finalCandidateTone: 4 / 3 / U / 2 / 2 / 3 / 3 = 6/7
- blockerStatus: hard blocker 없음; Narrative coverage가 1축 부족하다.

## 19. work-5b4dc4e6e966436b2990 — 人形芝居

### Source A — 白泉社 1~3권 공식 소개

- sourceName: 白泉社 人形芝居 1권·2권·3권
- sourceUrl: https://www.hakusensha.co.jp/comicslist/41133/ ; https://www.hakusensha.co.jp/comicslist/41065/ ; https://www.hakusensha.co.jp/comicslist/43939/
- publishedAt: 1998-10-19; 1999-07-19; 2008-09-19
- retrievedAt: 2026-08-23
- urlLiveCheck: 세 URL 모두 HTTP 200
- independence: 같은 출판사의 연속 세 권이지만 각기 다른 단편 묶음이다.
- evaluatedRange: 원판 1~3권
- claim: 외로운 사람을 돕는 어린이형 기계 인형, 창조자의 비밀, 힘을 잃은 치유자와 유산·인형의 만남을 확인한다.
- limitation: 옴니버스 에피소드의 결말과 정서 비중은 상품 소개에 모두 노출되지 않는다.

### Source B — コミックシーモア 리뷰 묶음

- sourceName: コミックシーモア 人形芝居 독자 리뷰
- sourceUrl: https://www.cmoa.jp/title/91264/
- publishedAt: 2015-08-04; 2015-08-25; 2017-01-10; 2022-08-01
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: 서로 다른 Cmoa 계정이지만 같은 플랫폼이다.
- evaluatedRange: 1~~4권 회고; 일부는 1권 또는 1~~3권 에피소드를 특정
- claim: 한 화 완결 옴니버스, 인간의 이기심과 상실, 애잔함, 인형의 헌신적 애정, 결말의 따뜻함이 반복 관찰된다.
- limitation: 4권 회고가 섞인 문장은 1~3권 값에 단독 사용하지 않았다.

### Source C — BookLive 1권 리뷰 묶음

- sourceName: BookLive 人形芝居 1권 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/303790/vol_no/001
- publishedAt: 2010-07-07; 2010-11-06; 2010-12-26; 2012-01-25
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: BookLive에 실린 서로 다른 Booklog 계정 관찰이며 Cmoa와 플랫폼이 다르다. Booklog를 별도 출처로 다시 세지 않았다.
- evaluatedRange: 1권 중심; 일부는 1~3권 회고를 명시
- claim: 가족·연인 역할의 인형과 인간 사이에 피할 수 없는 이별과 애잔함이 있고, 그와 함께 따뜻한 관계 보상이 반복된다고 관찰한다.
- limitation: 슬픔과 따뜻함은 darkness와 emotionalWarmth를 분리해 판단해야 하며, 독자의 눈물은 mentalStress가 아니다.

### Axis 결론

- progression: closed-unknown. 옴니버스 인물의 변화가 성장·획득·숙련의 반복 보상인지 확인되지 않았다.
- problemSolving: closed-unknown. 인형이 사람을 돕는다는 전제만으로 해결 과정의 지략성을 판정하지 않는다.
- strategy: closed-unknown. known 0을 확정할 반복적 부재 자료가 없다.
- darkness=2: candidate-known. 공식 1~3권의 외로움·상실 전제와 두 플랫폼의 진입 범위 리뷰가 피할 수 없는 이별과 애잔한 에피소드를 반복 확인한다. 따뜻한 결말도 반복되므로 비극 중심값 4가 아니라 혼합 수준 2다.
- comedy: closed-unknown. 반복 코미디 보상 또는 반복적 부재를 직접 확인하지 못했다.
- mentalStress: closed-unknown. 슬픔과 눈물은 지속적 불안·심리 붕괴·압박과 같지 않다.
- romance: closed-unknown. 일부 에피소드의 사랑은 작품 전체의 지속 로맨스 subplot을 확정하지 않는다.
- finalCandidateNarrative: U / U / U / 2 / 2 / 3 = 3/6
- finalCandidateTone: 3 / 3 / U / 2 / U / U / 3 = 4/7
- blockerStatus: hard blocker 없음; Narrative와 Tone coverage가 각각 1축 부족하다.

## 20. work-5b9a3ec60ac5fc90f444 — 魔法使いの嫁

### Source A — KADOKAWA 현행 1~3권과 구판 내용 동일성

- sourceName: KADOKAWA カドスト 魔法使いの嫁 1권·2권·3권
- sourceUrl: https://store.kadokawa.co.jp/shop/g/g302401004255/ ; https://store.kadokawa.co.jp/shop/g/g302401004256/ ; https://store.kadokawa.co.jp/shop/g/g302401004784/
- publishedAt: 2024-04-06; 2024-04-06; 2024-04-06, 모두 현행판 발매일이며 웹 페이지 자체는 undated
- retrievedAt: 2026-08-23
- urlLiveCheck: 세 URL 모두 HTTP 200
- independence: 같은 KADOKAWA·ブシロード 공식 source family다.
- evaluatedRange: 현행 1~3권, 각각 구 マッグガーデン판과 만화 내용 변경 없음 문구 포함
- claim: 1권은 삶의 희망이 없던 15세 チセ가 エリアス의 제자이자 신부로 새 삶을 시작하고, 2권은 교회의 세 과업을 수행하며 사랑의 의미를 알아가고 정체불명의 두 사람과 자신의 힘을 둘러싼 질문에 직면하며, 3권은 그 힘의 대가와 혹독한 운명, 공격, 두 사람의 힘 발현을 다룬다.
- limitation: 내용 동일성은 직접 확인되지만 페이지·화차 대응표는 없다. 요약에 노출되지 않은 해결 방법이나 comedy는 추정하지 않는다.

### Source B — ブシロードワークス 1~19권 재출간 보도자료

- sourceName: ブシロードワークス 1~19권 발매 보도자료
- sourceUrl: https://bushiroad.com/media/ad0a6356920f0b15
- publishedAt: 2024-04-05
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: Source A와 같은 출판 그룹이므로 독립 출처 수로 중복 계산하지 않는다.
- evaluatedRange: 현행 1~3권 소개와 2024-04-06 동시 재출간
- claim: 1~3권 소개와 발매 순서를 한 문서에서 연결하고, 2권을 소녀가 세 과업 중 사랑의 의미를 알아가는 이야기로 직접 설명한다.
- limitation: 보도자료의 홍보 강도는 값의 극단성을 단독 결정하지 않는다.

### Source C — マッグガーデン 저자 감수 1~3권 부독본 소개

- sourceName: マッグガーデン 魔法使いの嫁 Supplement I
- sourceUrl: https://comic.mag-garden.co.jp/mgnbooks/mediamix_books/mahoyome-supplement/
- publishedAt: 2017-07-10
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: 구판 출판사이자 저자 완전 감수 자료다. 현행판과의 내용 동일성은 Source A가 직접 연결한다.
- evaluatedRange: 구판 1~3권
- claim: 1~3권의 대사 의도와 신화·동물·식물·주문 요소가 상세 해설 대상임을 확인한다.
- limitation: 웹 소개는 해설 본문을 모두 노출하지 않는다. Source A의 권별 규칙·세력·능력 묘사와 결합해 worldBuilding 후보를 제한적으로 제안할 뿐 4를 부여하지 않는다.

### Source D — BookLive 현행 2~3권 리뷰 묶음

- sourceName: BookLive 魔法使いの嫁 2권·3권 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/1523783/vol_no/002 ; https://booklive.jp/product/index/title_id/1523783/vol_no/003
- publishedAt: 2024-11-18; 2024-11-29; 2025-04-17; 2026-04-14; 2026-04-15
- retrievedAt: 2026-08-23
- urlLiveCheck: 두 URL 모두 HTTP 200
- independence: 서로 다른 계정이지만 같은 BookLive 플랫폼이다. 각 리뷰는 2권 또는 3권 화면에 직접 귀속된다.
- evaluatedRange: 현행 2권과 3권
- claim: 2권의 어두운 사건과 긴장, 두 사람의 변화와 관계, 3권의 위험·과거·의존 우려, チセ의 자기표현과 성장, 둘의 행복을 바라는 정서가 반복 관찰된다.
- limitation: 감정 태그와 별점은 사용하지 않았다. 독자의 호감은 Factor가 아니며 공식 권 소개와 일치하는 구체 관찰만 보조 Evidence로 남겼다.

### Source E — コミックシーモア 구판 진입 리뷰

- sourceName: コミックシーモア マッグガーデン판 魔法使いの嫁 리뷰
- sourceUrl: https://www.cmoa.jp/title/80730/
- publishedAt: 2014-09-11
- retrievedAt: 2026-08-23
- urlLiveCheck: HTTP 200
- independence: BookLive와 다른 플랫폼의 독립 계정이다. 게시 시점상 일본어 단행본은 진입 1~2권 범위다.
- evaluatedRange: 당시 발매된 구판 1~2권
- claim: 인신매매 도입의 어두움, エリアス와의 일상에서 생기는 안정과 따뜻함, 요정의 잔혹함과 위험이 혼합된다고 관찰한다.
- limitation: 한 계정이며 장기 연재 회고가 아니다. 공식 1~3권과 BookLive 권차 리뷰의 보조 근거로만 사용한다.

### Axis 결론

- progression=2: candidate-known. 1권의 멈춰 있던 삶의 재개, 2권의 과업과 감정 학습, 3권 리뷰의 자기표현·성장 관찰이 진입 범위에서 점진적 변화를 반복 확인한다. 능력 획득 핵심값 4는 아니다.
- problemSolving: closed-unknown. 세 과업을 처리한다는 사실은 있지만 제약 분석과 해결 방법이 요약에 노출되지 않았다.
- strategy: closed-unknown. 장기 계획·정치·자원 운영의 반복 보상을 확인하지 못했다.
- pacing=3: candidate-known. 공식 1~3권이 삶의 재개, 세 과업과 습격, 힘의 대가와 새로운 공격으로 권마다 목표·상태를 실질적으로 바꾸고 2권은 전개 가속을 직접 표방한다. 짧은 간격의 극단값 4까지는 아니다.
- mysteryReveal=2: candidate-known. 2권이 습격자의 목적과 チセ의 힘을 질문하고 3권이 그 힘의 명칭·대가와 공격자의 정체 일부를 공개한다. 단서 추리 중심값 4는 아니다.
- worldBuilding=3: candidate-known. 1~3권에서 교회 과업, 마법사와 마술사, 夜の愛し仔의 힘과 대가, ウルタール의 澱み, エリアス의 별도 힘이 반복 작동하고 저자 감수 부독본이 같은 범위의 신화·생물·식물·주문 해설을 연결한다.
- characterArcWeight=4: candidate-known. 공식 1권은 멈춘 삶이 다시 움직이는 이야기, 2권은 사랑의 의미를 알아가는 소녀의 이야기로 직접 규정하며 2~3권 리뷰도 チセ와 エリアス의 변화를 반복 확인한다.
- relationshipStructure=2: candidate-known. 1~3권 모두 チセ와 エリアス의 고정된 핵심 2인 관계를 반복하고 조연이 붙지만 복잡한 군상 관계망을 보상으로 만들지는 않는다.
- comedy: closed-unknown. 가벼운 순간은 일부 리뷰에 있지만 entry 전반의 반복 코미디 보상이나 반복적 부재를 직접 확인하지 못했다.
- darkness=3: candidate-known. 삶의 희망 상실과 매매, 요정의 잔혹함, 세 과업 중의 희생, 습격과 힘의 가혹한 대가가 1~3권에 반복된다. 비극만이 유일한 중심인 4는 아니다.
- mentalStress=2: candidate-known. 공식 자료의 절망·위험·가혹한 운명과 권차 리뷰의 긴장·의존 우려가 반복되지만, 따뜻한 관계 보상도 함께 있어 지속 붕괴 수준이 아닌 혼합값 2로 제한한다.
- romance=3: candidate-known. 공식 소개가 제자와 신부, 이종 간 혼인 판타지, 사랑의 의미를 1~2권부터 반복하고 3권도 서로를 알고자 하는 관계를 전면에 둔다. 진입 범위만으로 극단값 4는 부여하지 않는다.
- emotionalWarmth=3: candidate-known. 2권의 사랑 학습, 두 사람의 관계 변화, 구판 1~~2권과 현행 2~~3권 리뷰의 안정·따뜻함·행복 기대가 서로 다른 플랫폼에서 반복된다. 위험과 어두움이 혼합돼 4가 아니라 3이다.
- finalCandidateNarrative: 2 / U / U / 3 / 2 / 3 = 4/6
- finalCandidateTone: 4 / 2 / U / 3 / 2 / 3 / 3 = 6/7
- blockerStatus: hard blocker 없음; 열 candidate가 채택되면 text coverage pass다.

## 유한 route 종료와 재개 조건

| workId                    | canonicalTitle | 현재 종료 상태               | 재개 조건                                                                    |
| ------------------------- | -------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| work-29d4300ad9d3358fb67a | 外天楼         | Tone 2축 부족                | 단권 인물 변화·유대 보상을 직접 다루는 공식 편집 자료                        |
| work-3dfaf6231e21133620c6 | 忍者と極道     | Narrative 1축 부족           | 1~3권의 반복 성장·해결·계획 과정을 직접 설명하는 공식 preview 또는 편집 자료 |
| work-40b8c35b1d8c9a90144c | orange         | edition bridge 전까지 전부 U | 集英社 원판 목차·본문과 双葉社판의 동일성을 직접 연결하는 공식 자료          |
| work-4c784fc78dfd9b139c3f | 正反対な君と僕 | Narrative 3축 부족           | 1~3권에 실제 Narrative 구조가 있음을 장면 범위와 함께 설명하는 공식 자료     |
| work-518d7ed42dd9253679c3 | 墨攻           | Tone 2축 부족                | 원판 1~3권 인물의 주관적 압박·유대 보상을 직접 다룬 scoped 비평              |
| work-53e54c95f637b66c4fb2 | がんばれ元気   | Narrative 1축 부족           | 1~3권 경기·훈련의 분석 또는 계획 과정을 직접 관찰한 공식 episode 자료        |
| work-5915d6d7601377fcc75f | 赤髪の白雪姫   | Narrative 1축 부족           | 2권 질병 사건의 지식 적용·추론·해결 단계를 직접 보여 주는 공식 preview       |
| work-5b4dc4e6e966436b2990 | 人形芝居       | Narrative 1축, Tone 1축 부족 | 1~3권 반복 해결 방법 또는 별도 Tone 축을 직접 다룬 권차 지정 자료            |

嘘解きレトリック과 魔法使いの嫁는 candidate 채택 시 gate를 통과하므로 Pass B로 보낸다. 나머지 8작품은 hard blocker가 아니라 현재 유한 route에서의 coverage 미달이다. 새 직접 근거가 생기기 전까지 unknown을 명시적 종결값으로 유지한다.
