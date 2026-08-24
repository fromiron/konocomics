# Batch 003 targeted text coverage gap research — chunk 01

- batchId: `batch-003`
- sourceChunk: `chunk-01`
- frozenPositions: `1..10`
- scope: Pass A 이후 지정된 Narrative·Tone·Theme coverage 공백만 재조사
- evaluatedRange: 작품별 진입 1~3권 또는 첫 주요 에피소드
- retrievedAt: `2026-08-23`
- reviewedByHuman: `false`
- outputKind: `targeted-supplemental-evidence-only`
- decisionBoundary: 이 문서는 Evidence 후보와 한계만 기록한다. Factor 값, Genre, Theme,
  Art, review, adjudication, safety, identity, eligibility, promotion 상태를 변경하거나 확정하지
  않는다.

## 동결 입력과 해시 결속

| Input                                                          | SHA-256                                                            |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| immutable candidate identity (`manifest.json.candidateSha256`) | `2277f22c0c0f4b04815801059a4faca0db316d9de5efe1027cb3221725c9c410` |
| `manifest.json`                                                | `2425deaaa1672ba12f089d3a4633b2cef86bb610980fb41506c8f73e4fe5bdb3` |
| `frozen-work-set.csv`                                          | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `research/chunk-01.md`                                         | `24504373ec03820b36f87e7b211b4be557d8991b555d831afcdf6dd9b60c5f45` |
| `annotation-pass-a/chunk-01/factors.csv`                       | `cbfa7ef9169cf08552111f4cc66f90ab0b12fe5293bbb051ae009072cf583c6a` |
| `annotation-pass-a/chunk-01/genres.csv`                        | `095fa351699e62785694809516e0e39d5d1cf3e0ad4f2ddf38d6f79646c5f74a` |
| `annotation-pass-a/chunk-01/themes.csv`                        | `dfb55528d0d548780b15a55b364530bc73eddb6051e21305aa552834b2d10da0` |
| `annotation-pass-a/chunk-01/notes.md`                          | `e010a8e36c9b01e1dd4d5759b7a887a3b6ba2e908781b98810cb18c232059641` |
| `annotation-review-adjudication-request.md`                    | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `docs/factors/factor-dictionary.md`                            | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                             | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `art-review/chunk-01/final-art.csv`                            | `5317de2cc65ab9ffd1b2c1203367159e0259f7ce6433474f31104a7ad523d53a` |

Art 해시는 Narrative·Tone group gap을 잘못 계산하지 않기 위한 읽기 전용 결속이다. 이
조사에서는 이미지나 Art 값을 Evidence로 사용하지 않았다.

## 조사 규칙

- 동결 순서와 canonicalTitle을 그대로 유지했다. `『』`는 출처의 작품명 표기에서만 쓰고
  canonicalTitle 필드에는 넣지 않았다.
- 공식 출판사 작품·권 소개, 공식 내부 미리보기, 공식 수상기관 심사평, 공식 서점·배급사
  설명을 먼저 확인했다.
- 초기 1~3권 또는 첫 주요 에피소드에 귀속할 수 없는 작품 전체 회고는 수치 후보의 단독
  근거로 사용하지 않았다.
- 장르, 목록 등재, 인기, 별점, 감정 태그로 Axis를 추론하지 않았다.
- 유저평은 서로 다른 계정이 같은 구체 관찰을 반복하고 평가 범위를 확인할 수 있을 때만
  보조 Evidence로 기록했다. 같은 플랫폼의 계정은 저자 단위로 독립이지만 플랫폼 단위로는
  독립이 아니다.
- 출처가 충돌하거나 반복성이 부족하면 그 한계를 남겼다. 이 파일은 값을 채우기 위해
  `unknown`을 뒤집지 않는다.
- 아래 `candidateSupport`는 다음 독립 review/adjudication에서 검토할 조사 단서이지, 값이나
  Theme의 채택 결론이 아니다.

## 결과 요약

| Pos | workId                      | canonicalTitle             | 정확한 조사 gap | 조사 결과                                                         |
| --: | --------------------------- | -------------------------- | --------------- | ----------------------------------------------------------------- |
|   1 | `work-0029e59a039dce3f6e74` | 【推しの子】               | N3 / T4         | `mysteryReveal`과 `mentalStress` 후보 근거 확보; 값은 미확정      |
|   2 | `work-048a39f42bd18cb0823e` | 大東京トイボックス         | T2              | `mentalStress`, `emotionalWarmth` 후보 근거 확보; 범위 한계 명시  |
|   3 | `work-04f35b4c99514d50231d` | デトロイト・メタル・シティ | N2 / T4         | 빠진 축을 책임 있게 보강할 근거 없음                              |
|   4 | `work-064c0062e7a8e29cfbed` | COSMOS                     | T3              | `comedy`, `emotionalWarmth` 후보 근거 확보; 수상평 범위 한계 명시 |
|   5 | `work-07faf4019b12de5e877d` | 私の少年                   | N1 / Theme 0    | 빠진 Narrative와 허용 Theme를 보강할 근거 없음                    |
|   6 | `work-131ba7a362fa9e38a10a` | 超巡！超条先輩             | N2 / T3         | `problemSolving` 단서, `emotionalWarmth` 발생은 확인; 반복성 부족 |
|   7 | `work-171b262b7ad72871f795` | ドリフターズ               | N3 / T3         | `problemSolving` 후보 근거 확보; 빠진 Tone은 보강 못함            |
|   8 | `work-174e7603bb0e71bb62ab` | からかい上手の高木さん     | 이미 통과       | 추가 조사·후보 생성 없음                                          |
|   9 | `work-197089286d30de82f9e9` | 多聞くん今どっち!?         | N3              | 기존 `progression`만 재확인; 빠진 Narrative 근거 없음             |
|  10 | `work-1d447cc9026b530fb53d` | だがしかし                 | Theme 0         | `workplace` Theme 후보 근거 확보; 중심성은 미확정                 |

## 1. work-0029e59a039dce3f6e74 — 【推しの子】

### Source A — マンガ大賞2021 공식 심사평

- sourceName: マンガ大賞2021 選考員コメント
- sourceUrl: https://www.mangataisho.com/data/2021/comment2021.pdf
- publishedAt: `2021`
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공, PDF 102쪽
- sourceTier: `official-award-jury-commentary`
- exactWorkAndRange: 『【推しの子】』, 당시 심사 대상 1~2권이라고 문서가 명시
- candidateSupport: `mysteryReveal`; 보조적으로 기존 `pacing`
- directObservation: 여러 심사위원이 1권 말부터 미스터리·서스펜스가 선명해지고, 예측을
  뒤집는 전환과 범인 탐색이 다음 권을 견인한다고 각각 관찰한다.
- limitation: “미스터리 장르”라는 라벨만으로 값은 정할 수 없다. 단서·추론·진실 공개의
  빈도와 보상 강도는 후속 review에서 1~2권 근거에 다시 맞춰야 한다.
- independentReviewCorroboration: `yes`; 이름과 직업이 다른 복수 심사위원의 개별 코멘트다.
  단, 하나의 수상기관 packet이라는 플랫폼 한계가 있다.

### Source B — BookLive 3권 독립 리뷰 packet

- sourceName: BookLive 『【推しの子】』3권 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/815374/vol_no/003
- publishedAt: `2021-05-17`; `2022-02-19`; `2023-06-01`; 그 외 복수 게시일
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공
- sourceTier: `retailer-user-review-packet`
- exactWorkAndRange: 3권의 연애 리얼리티 쇼·인터넷 비방 에피소드
- candidateSupport: `mentalStress`; 보조적으로 `emotionalWarmth`
- directObservation: 서로 다른 계정들이 출연 압박, 온라인 집단 비방, 위기 직전의 심리적
  부담을 반복 관찰한다. 별개의 계정들은 동료들이 위기에 개입하고 회복을 돕는 장면도
  구체적으로 언급한다.
- limitation: 후기 게시물 중 애니메이션 기억을 섞은 글은 제외했다. 같은 BookLive/Booklog
  유통면의 계정들이므로 플랫폼 간 독립 교차검증은 아니다. 감정 태그와 별점은 사용하지
  않았다.
- independentReviewCorroboration: `partial`; 계정·게시일은 독립이나 플랫폼은 동일하다.

### 조사 경계

- candidateSupport: `mysteryReveal`, `mentalStress`.
- unresolved: 두 축의 0/2/4 수치와 채택 여부. Source B의 따뜻한 개입은
  `emotionalWarmth`의 후보 단서지만, 강한 압박과 섞인 에피소드이므로 별도 값 후보로
  올리지 않았다.

## 2. work-048a39f42bd18cb0823e — 大東京トイボックス

### Source A — 朝日新聞 好書好日 직업만화 비평

- sourceName: 好書好日 「大東京トイボックス」で知る、ゲームクリエイター
- sourceUrl: https://book.asahi.com/article/13662927
- publishedAt: `2020-08-28`
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공
- sourceTier: `independent-editorial-review`
- exactWorkAndRange: 기사에서 소개 도서로 1권을 연결하지만, 요약한 사건의 정확한 권차는
  모두 표시하지 않음
- candidateSupport: `mentalStress`, `emotionalWarmth`
- directObservation: 기획 실패 뒤 일시적으로 출근하지 못하는 압박, 예산·일정·수정 요구가
  만드는 팀 갈등, 동료의 과로를 알아차리고 구성원 사이를 잇는 지원이 구체적으로
  설명된다.
- limitation: 기사가 1권 상품을 소개하더라도 모든 서술이 1권만을 뜻한다고 단정할 수 없다.
  따라서 1~3권 수치의 단독 근거로 쓰지 않는다.
- independentReviewCorroboration: `no`; 기명 편집 비평 한 건이며 유저 리뷰 packet이 아니다.

### Source B — 저자 공식 인터뷰

- sourceName: GAME Watch 漫画家“うめ”インタビュー（前編）
- sourceUrl: https://game.watch.impress.co.jp/docs/news/616563.html
- publishedAt: `2013-09-24`
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공
- sourceTier: `creator-interview`
- exactWorkAndRange: 2권 제작 취재와 3권의 발상력 테스트·팀워크 장면을 저자가 직접 특정
- candidateSupport: `emotionalWarmth`; 보조적으로 이미 known인 `strategy`, `problemSolving`
- directObservation: 저자는 실제 게임 개발자 취재와 발상 강의를 2~3권의 제작 문제 및
  “팀워크” 답안에 연결했다고 설명한다.
- limitation: 저자 발언은 장면의 설계와 권차를 확인하지만, 독자의 정서적 보상 빈도를
  직접 평가하는 독립 비평은 아니다.
- independentReviewCorroboration: `no`; creator evidence다.

### 조사 경계

- candidateSupport: `mentalStress`, `emotionalWarmth`.
- unresolved: 진입 1~3권에서 두 Tone이 얼마만큼 반복되는지와 수치. 공식 권별 내부
  미리보기 없이 극단값을 제안하지 않는다.

## 3. work-04f35b4c99514d50231d — デトロイト・メタル・シティ

### Source A — コミックシーモア 1~3권 유통 설명

- sourceName: コミックシーモア 『デトロイト・メタル・シティ』1~3권 유통 페이지
- sourceUrl: https://www.cmoa.jp/title/312348/
- publishedAt: `2024-12-27` (표시된 전자 배포 시작일; 원판 1권은 `2006-05` 표기)
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공
- sourceTier: `bookseller-distributor-description`
- exactWorkAndRange: 1~3권 각각의 상품 설명
- candidateSupport: 새 missing Axis 없음
- directObservation: 2권은 무대 인물로의 변화와 인디즈 경쟁, 3권은 페스티벌 진행을
  설명한다. 이는 기존 `progression`, `pacing`, `comedy`를 재확인할 뿐이다.
- limitation: 줄거리 수준의 짧은 유통 문구다. 문제 해결 방식, 전략, 단서 공개 또는 빠진
  Tone의 지속성을 설명하지 않는다. 8권 이후에 명시되는 연애 진행은 평가 범위 밖이라
  사용하지 않았다.
- independentReviewCorroboration: `no`; 리뷰·별점은 사용하지 않았다.

### 조사 경계

- candidateSupport: 없음.
- unresolved: 빠진 Narrative 2축과 Tone 1축. 초기 1~3권에 한정된 공식 자료와 복수 독립
  리뷰에서 반복 관찰을 확보하지 못했으므로 값을 만들 근거가 없다.

## 4. work-064c0062e7a8e29cfbed — COSMOS

### Source A — マンガ大賞2025 공식 심사평

- sourceName: マンガ大賞2025 選考員コメント
- sourceUrl: https://www.mangataisho.com/data/2025/comment2025.pdf
- publishedAt: `2025`
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공, PDF 90쪽
- sourceTier: `official-award-jury-commentary`
- exactWorkAndRange: 『COSMOS』 심사 당시 발매분; 일부 코멘트는 1화·1권을 특정하지만 packet
  전체는 1~3권보다 넓을 수 있음
- candidateSupport: `comedy`, `emotionalWarmth`
- directObservation: 복수 심사위원이 시리어스와 개그의 균형, 각 에피소드에서 인물들이
  연결되는 휴먼 드라마, 감사와 공감, 따뜻한 에피소드가 반복된다고 독립적으로 관찰한다.
- limitation: 2025년 심사 당시의 전체 발매분을 읽은 코멘트가 섞인다. 1권을 특정하지 않은
  문장은 entry 지속성의 보조 근거로만 쓴다.
- independentReviewCorroboration: `yes`; 복수의 기명 심사위원·서점원 코멘트다. 하나의 수상
  packet이라는 플랫폼 한계가 있다.

### Source B — BookLive 1권 독립 리뷰 packet

- sourceName: BookLive 『COSMOS』1권 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/20070238/vol_no/001
- publishedAt: `2023-11-26`; `2024-05-23`; `2024-09-23`; `2025-01-23`; `2025-05-20`
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공
- sourceTier: `retailer-user-review-packet`
- exactWorkAndRange: 1권
- candidateSupport: `comedy`, `emotionalWarmth`
- directObservation: 서로 다른 계정들이 진지한 사건 사이의 건조한 웃음, 웃음과 감정적
  에피소드의 병치, 사람을 연결하는 휴먼 드라마를 반복 관찰한다.
- limitation: 같은 BookLive/Booklog 유통면이다. “감동” 태그와 별점은 사용하지 않았고,
  구체 서술만 요약했다.
- independentReviewCorroboration: `partial`; 계정·날짜는 독립이며 Source A와 플랫폼도
  다르지만, Source B 내부 계정들은 한 플랫폼에 모여 있다.

### 조사 경계

- candidateSupport: `comedy`, `emotionalWarmth`.
- unresolved: 각 축의 수치. 1권 반복 관찰과 공식 심사평은 방향이 일치하지만, 1~3권 전부의
  정량 빈도를 이 packet이 대신 확정하지 않는다.

## 5. work-07faf4019b12de5e877d — 私の少年

### Source A — 원 담당 편집자 인터뷰

- sourceName: MANTANWEB マンガ質問状 『私の少年』
- sourceUrl: https://mantan-web.jp/article/20160722dog00m200061000c.html
- publishedAt: `2016-07-23`
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공
- sourceTier: `publisher-editor-interview-via-editorial-media`
- exactWorkAndRange: 1권과 연재 초기
- candidateSupport: 새 missing Narrative 또는 Theme 없음
- directObservation: 두 고립된 인물이 서서히 서로 필요한 존재가 되는 관계, 과거 상처와
  가족 문제, 감정 묘사가 중심이라고 담당 편집자가 설명한다.
- limitation: 기존 `characterArcWeight`, `relationshipStructure`, `mentalStress`,
  `emotionalWarmth`를 보강할 뿐, 문제 해결·전략·미스터리 등 빠진 Narrative를 지지하지
  않는다.
- independentReviewCorroboration: `no`; 담당 편집자 발언이다.

### Source B — 작가 인터뷰

- sourceName: #俺マン 『私の少年』高野ひと深 메일 인터뷰
- sourceUrl: https://oreman.jp/column/11170/
- publishedAt: `2017-03-10`
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공
- sourceTier: `creator-interview`
- exactWorkAndRange: 당시 1~~2권; 1권 1~~4화와 2권 8화를 직접 특정
- candidateSupport: 새 missing Narrative 또는 Theme 없음
- directObservation: 작가는 1~2권 에피소드가 인물의 생활·감정을 오래 논의해 구성됐음을
  설명한다.
- limitation: 인물 설계 근거이며, 허용 Theme 목록의 반복 구조를 직접 증명하지 않는다.
  축구 연습이 존재해도 `sportsCompetition`을 만들 경쟁 구조 근거가 없고, 학교·직장은
  중심 반복 구조라고 확인되지 않았다.
- independentReviewCorroboration: `no`; creator evidence다.

### 조사 경계

- candidateSupport: 없음.
- unresolved: 빠진 Narrative 3축과 Theme. 허용 Theme를 맞추기 위해 배경이나 단발 활동을
  승격할 근거가 없다.

## 6. work-131ba7a362fa9e38a10a — 超巡！超条先輩

### Source A — 集英社 공식 제1화

- sourceName: 少年ジャンプ＋ 『超巡！超条先輩』第1話「超能力巡査長」
- sourceUrl: https://shonenjumpplus.com/episode/17106567263032649767
- publishedAt: `2025-02-10` (공식 재게시 표기)
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공
- sourceTier: `official-publisher-internal-preview`
- exactWorkAndRange: 제1화 전체 viewer
- candidateSupport: `problemSolving` 발생 단서
- directObservation: 공식 소개는 초능력을 이용하는 범죄 수사 전문성과 경찰 코미디를
  명시한다. 제1화는 조사·회수 구조를 확인할 수 있는 공식 본문이다.
- limitation: 한 화만으로 제약 분석과 기발한 해결이 entry 1~3권에서 반복된다고 말할 수
  없다. 화면 본문은 이 텍스트 연구에서 Art 판정에 사용하지 않았다.
- independentReviewCorroboration: `no`; 공식 1차 자료다.

### Source B — 1~3화 독립 리뷰

- sourceName: 184 『超巡!超条先輩』1・2・3話の感想
- sourceUrl: https://jdmgajdmga.hatenablog.com/entry/2024/02/12/022710
- publishedAt: `2024-02-12`; `2024-04-25` 추기
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공
- sourceTier: `independent-user-review`
- exactWorkAndRange: 제1~3화
- candidateSupport: `problemSolving` 단서; 기존 `pacing`, `comedy`
- directObservation: 제1화에서 앞부분의 소품·정보가 후반 해결에 회수되고, 제3화도 도난
  사건을 코미디 구조 안에서 진행한다고 관찰한다.
- limitation: 한 명의 리뷰이며, 2화에 대해서는 구체 해결 관찰이 없다.
- independentReviewCorroboration: `partial`; Source C와 작성자·플랫폼이 다르다.

### Source C — 제1~7화 독립 리뷰 기록

- sourceName: note 『超巡！超条先輩』1巻分（第1話〜第7話）感想
- sourceUrl: https://note.com/artacaminae/n/n27d0416f9840
- publishedAt: `2024-09-09`; 내장 감상 기록 `2024-02-11..2024-03-24`
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공
- sourceTier: `independent-user-review`
- exactWorkAndRange: 1권 제1~7화
- candidateSupport: `problemSolving` 단서, `emotionalWarmth` 발생 단서
- directObservation: 제3화에서 놀이와 절도범 수색이 함께 진행되고, 제1·5·7화에서 평소의
  불성실한 태도와 타인을 보호·긍정하는 행동의 대비를 관찰한다.
- limitation: 한 작성자의 당시 X 감상을 모은 기록이다. 따뜻한 행동의 발생은 확인하지만
  `emotionalWarmth`가 핵심 보상이라는 반복 평가와 같지 않다.
- independentReviewCorroboration: `partial`; Source B와 독립 저자·플랫폼이지만 두 리뷰가
  같은 축의 강도를 동일하게 평가한 것은 아니다.

### 조사 경계

- candidateSupport: `problemSolving` 연구 단서.
- unresolved: 0/2/4 수치, 진입 전반의 반복성, 빠진 Tone 2축. `emotionalWarmth`는 발생만
  확인돼 값 후보로 올리지 않았다.

## 7. work-171b262b7ad72871f795 — ドリフターズ

### Source A — MANGA Watch 기명 비평

- sourceName: MANGA Watch 『ドリフターズ』 리뷰
- sourceUrl: https://manga.watch.impress.co.jp/docs/review/1672635.html
- publishedAt: `2025-03-26`
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공
- sourceTier: `independent-editorial-review`
- exactWorkAndRange: 작품 1~7권 회고지만 제1화와 초반 설정을 별도로 특정
- candidateSupport: `problemSolving`; 기존 `strategy`
- directObservation: 제1화의 후퇴 엄호 전술과, 이세계 초반에 각 인물이 시대별 지식·전술
  기술을 활용해 압도적 열세에서 군대를 조직하는 구조를 설명한다.
- limitation: 2025년 전체 회고이므로 제1화 외 세부 내용의 권차가 모두 1~3권인지 문장마다
  확인되지는 않는다. 단독으로 수치를 정하지 않는다.
- independentReviewCorroboration: `no`; 기명 비평 한 건이다.

### Source B — BookLive 3권 독립 리뷰 packet

- sourceName: BookLive 『ドリフターズ』3권 리뷰
- sourceUrl: https://booklive.jp/review/list/title_id/175269/vol_no/003
- publishedAt: `2018-07-09`; `2018-11-04`; `2019-07-12`; `2019-08-05`
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공
- sourceTier: `retailer-user-review-packet`
- exactWorkAndRange: 3권
- candidateSupport: `problemSolving`; 기존 `strategy`
- directObservation: 서로 다른 계정들이 화약 제조, 공방 점령, 드워프의 총기 제작 연결,
  병력 차를 계략과 자원 전환으로 뒤집는 과정을 반복 관찰한다.
- limitation: 같은 BookLive/Booklog 유통면의 리뷰다. 별점과 단순 호평은 사용하지 않았다.
- independentReviewCorroboration: `partial`; 계정·게시일은 독립이며 Source A와 플랫폼도
  다르다.

### 조사 경계

- candidateSupport: `problemSolving`.
- unresolved: 값과 채택 여부. 빠진 `characterArcWeight`, `mentalStress`, `romance`,
  `emotionalWarmth`는 초기 1~3권의 반복 관찰이 부족해 새 후보를 만들지 않았다.

## 8. work-174e7603bb0e71bb62ab — からかい上手の高木さん

- targetStatus: `not-targeted`
- exactGap: 없음. Pass A 텍스트 coverage가 이미 통과한다고 전달된 동결 조건을 유지했다.
- researchAction: 추가 웹 조사, Evidence 후보, 값 제안 없음.
- limitation: 동결 10작품 순서와 완전성을 보존하기 위한 섹션이다. “통과”를 독립 review나
  promotion 승인으로 해석하지 않는다.

## 9. work-197089286d30de82f9e9 — 多聞くん今どっち!?

### Source A — Sony Reader Store 3권 독립 리뷰 packet

- sourceName: Reader Store 『多聞くん今どっち!?』3권 리뷰
- sourceUrl: https://ebookstore.sony.jp/review/title/10656632/id/LT000171244001599004/
- publishedAt: `2022-10-20`; `2022-10-25`; `2022-10-29`; `2022-10-30`;
  `2023-02-08`; `2024-06-23`
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공
- sourceTier: `retailer-user-review-packet`
- exactWorkAndRange: 3권 센터 재선발 에피소드
- candidateSupport: 새 missing Narrative 없음; 기존 `progression` 보조
- directObservation: 여러 계정이 센터 재선발의 결과와 그 결과가 多聞의 성장·다음 행동에
  이어지는 점을 반복 관찰한다.
- limitation: 같은 Reader Store의 Booklog 연동 리뷰다. 문제 해결 절차, 전략, 단서·진상
  공개를 반복 관찰하지 않으므로 빠진 Narrative를 채우지 않는다. 코미디·연애 관찰은 이미
  충분한 Tone group과 관련돼 이번 target이 아니다.
- independentReviewCorroboration: `partial`; 계정·날짜는 독립이나 플랫폼은 동일하다.

### 조사 경계

- candidateSupport: 없음.
- unresolved: `problemSolving`, `strategy`, `mysteryReveal` 중 추가 known 후보. 장르나 센터
  “경쟁”의 존재만으로 전략 Axis를 추론하지 않았다.

## 10. work-1d447cc9026b530fb53d — だがしかし

### Source A — マンガ大賞2015 공식 심사평

- sourceName: マンガ大賞2015 選考員コメント
- sourceUrl: https://www.mangataisho.com/data/2015/comment2015.pdf
- publishedAt: `2015`
- retrievedAt: `2026-08-23`
- urlLiveCheck: web open 성공, PDF 90쪽
- sourceTier: `official-award-jury-commentary`
- exactWorkAndRange: 『だがしかし』 초기 발매분; 1~3권을 넘지 않는 2015년 시점이지만 각
  코멘트의 정확한 종점은 미표기
- candidateSupport: Theme `workplace`
- directObservation: 복수 심사위원이 시골 과자가게, 가업 승계 거부, 승계를 설득하기 위해
  가게와 과자를 반복적으로 다루는 에피소드 구조를 각각 설명한다.
- limitation: “가게가 배경에 있다”는 사실만으로 centrality를 정하지 않는다. 노동 과정보다
  상품 소개와 가족 승계가 중심인 회차가 많을 수 있으므로 `workplace` 채택과 centrality
  1/2는 다음 review가 동결 1~3권 자료에 맞춰 판단해야 한다. `cooking`이나 `crafting`으로
  확장할 근거는 없다.
- independentReviewCorroboration: `yes`; 서로 다른 심사위원의 구체 관찰이다. 하나의 수상
  packet이라는 플랫폼 한계가 있다.

### 조사 경계

- candidateSupport: Theme `workplace`.
- unresolved: Theme 채택 및 centrality. 이 문서는 Theme row를 생성하지 않는다.

## 최종 연구 경계

- 새로 조사한 자료는 어떤 source CSV, reviewer output, adjudication, registry, generated
  artifact에도 반영하지 않았다.
- 복수 출처가 직접 맞는 후보는 【推しの子】의 `mysteryReveal`·`mentalStress`,
  大東京トイボックス의 `mentalStress`·`emotionalWarmth`, COSMOS의
  `comedy`·`emotionalWarmth`, ドリフターズ의 `problemSolving`, だがしかし의 Theme
  `workplace`다. 모두 다음 단계 후보이며 값·채택 결론이 아니다.
- デトロイト・メタル・シティ, 私の少年, 多聞くん今どっち!?는 지정 공백을 채우기 위한
  직접 근거를 찾지 못했다. 超巡！超条先輩는 유효 단서는 있으나 반복성과 강도가 부족하다.
- `unknown`은 낮은 값이나 blocker가 아니다. 이 packet은 hard blocker나 promotion 상태를
  판단하지 않는다.
