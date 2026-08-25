# Batch 004 Art preflight QA — chunk 05

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent QA
- reviewedByHuman: `false`
- scope: frozen positions 41–50
- overallVerdict: `PASS`
- work-level results: `PASS 10`, `REJECT 0`, `NEEDS_REVIEW 0`
- Art values assigned: none

## 검증 경계

- `frozen-work-set.csv`의 41–50번과 preflight 10행의 `workId`·canonical title·순서가 정확히 일치한다. frozen set, CSV, ledger 어디에도 금지된 장식 구분자 `『`·`』`는 없다.
- preflight는 헤더 포함 전 행이 17열이고 Art 값이나 confidence를 포함하지 않는다. 갱신된 CSV SHA-256 `7b012de84db4bba279b343960183b5f36885575bf31d6949b4c28f156988a81e`도 ledger 기록과 일치한다.
- `/tmp/konocomics-batch004-art-chunk05`에서 선택 SHA-256 48개를 재계산했고, 고유 48개 모두 CSV와 일치했다. 선택 파일은 모두 정적 PNG/JPEG이며 원본 해상도로 직접 확인했다.
- 공식 상품·작가·entry 권·ISBN/JDCN과 reader 연결을 live first-party route에서 재확인했다. 集英社 exact-ISBN reader 5건, JDCN-to-paper bridge 1건, 講談社 product-linked trial 1건, SQUARE ENIX product-linked 第1話 1건은 작품·판본과 결속된다. 白泉社 2건은 공식 상품 정체성만 확인되며 registry에 trusted preview route가 없다.
- 41–43·45–49번의 선택물은 각각 판독 가능한 본문 6쪽 이상과 실제로 구별되는 장면 2개 이상을 충족한다. 표지·frontispiece·목차·광고·애니메이션은 포함되지 않았다.
- 42번은 앞선 QA에서 거부한 `reader-page-06`·`reader-page-07` 제1화 오프닝을 정확히 제외했다. 교체된 `reader-page-09`–`12`·`18`·`19`는 모두 서사 본문이며 domestic room/meal과 workplace/people의 2개 구별 맥락을 제공한다.
- 모든 행에서 연속 동작의 시작·전개/impact·해결된 종점이 하나의 정확한 묶음으로 고정되지 않아 `motionGateAttemptable=false`는 타당하다.
- 44·50번은 finite route인 `art-source-route-registry.csv`에 白泉社 trusted preview route가 없다는 이유와 0쪽·0맥락을 명시했다. 두 `unknown-ready`는 Art 부족 자체로 blocker가 아니며 모든 Art 축을 `unknown`으로 닫는다.

## 작품별 판정

| Pos | Work | 판정 | 근거 |
| --: | --- | --- | --- |
| 41 | `work-c7280f9dcc2754d3f864` — 鵺の陰陽師 | **PASS** | 集英社 vol.1 상품·reader가 제목·川江康太·ISBN `9784088836874`를 직접 결속한다. 선택 6쪽과 해시가 모두 맞고 supernatural room/forest, classroom conversation, school hallway의 3개 구별 본문 맥락이 확인되어 `sample-ready`가 타당하다. |
| 42 | `work-d63a83030a8819ff553c` — モテキ | **PASS** | 講談社 product `0000038652`는 제목·久保ミツロウ·원판 vol.1 ISBN `9784063522594`와 product-linked trial을 결속한다. 기존 opening refs 06–07은 제외됐고, 교체된 09–12·18–19는 모두 genuine body pages다. domestic room/meal과 workplace/people의 2개 구별 맥락 및 갱신된 6개 해시가 확인되어 `sample-ready`가 타당하다. |
| 43 | `work-d8a87d01c1f35d58e791` — 八雲さんは餌づけがしたい。 | **PASS** | SQUARE ENIX vol.1 상품은 제목·里見U·ISBN `9784757551107`을 표시하고 해당 `第1話 試し読み`을 직접 연결한다. pages 005–010은 모두 본문이며 apartment entry/hallway와 kitchen/dining interaction의 2개 구별 맥락, 6개 일치 해시로 `sample-ready`가 타당하다. |
| 44 | `work-e2f095e08fc5e08d5a2b` — 高嶺と花 | **PASS** | 白泉社 vol.1 상품은 제목·師走ゆき·ISBN `9784592213512`를 결속한다. registry에 白泉社 trusted preview route가 없어 샘플을 사용하지 않은 0쪽·0맥락 `unknown-ready`는 finite하고 재현 가능한 종결이다. Art 부족은 blocker가 아니다. |
| 45 | `work-e81955a9fc5c4d84580f` — ここは今から倫理です。 | **PASS** | 集英社 vol.1 상품·reader가 제목·雨瀬シオリ·ISBN `9784088907918`을 직접 결속한다. 선택 6쪽은 모두 본문이고 시간적으로 구별되는 teacher/student classroom 사건과 1년 뒤 wider classroom group의 2개 맥락, 6개 일치 해시를 충족한다. |
| 46 | `work-eef84d07d90ba2b040cf` — さよなら絵梨 | **PASS** | 集英社 단권 상품·reader가 제목·藤本タツキ·ISBN `9784088831671`을 직접 결속한다. 선택 6쪽은 home birthday/dining, family-life montage, hospital의 3개 구별 본문 맥락이며 해시도 모두 일치해 `sample-ready`가 타당하다. |
| 47 | `work-f8cb26831612e0c6ece5` — 極楽街 | **PASS** | 集英社 JDCN 상품·reader `08X10000000024865900`은 제목·佐乃夕斗·digital vol.1을 표시하고 `bottom_isbn_13` 및 same-item paper data로 frozen ISBN `9784088827407`을 결속한다. office, city exterior, client/interior의 3개 구별 본문 맥락과 6개 일치 해시가 확인된다. |
| 48 | `work-fc53cb5669aa4099ee4a` — アオハライド | **PASS** | 集英社 vol.1 상품·reader가 제목·咲坂伊緒·ISBN `9784088466477`을 직접 결속한다. 선택 6쪽은 school hallway/classroom과 outdoor sports의 2개 구별 본문 맥락이고 해시도 모두 일치한다. |
| 49 | `work-fd2a957c501c36047ed0` — 青の祓魔師 | **PASS** | 集英社 vol.1 상품·reader가 제목·加藤和恵·ISBN `9784088747095`를 직접 결속한다. 선택 6쪽은 supernatural exterior threat, town/group interior, church exterior의 3개 구별 본문 맥락이며 해시도 모두 일치한다. |
| 50 | `work-ff9b025f58d7e12f3cb1` — LOVE SO LIFE | **PASS** | 白泉社 vol.1 상품은 제목·こうち楓·ISBN `9784592187349`를 결속한다. registry에 白泉社 trusted preview route가 없어 샘플을 사용하지 않은 0쪽·0맥락 `unknown-ready`는 finite하고 재현 가능한 종결이다. Art 부족은 blocker가 아니다. |

## 종합 판정

`PASS`: 41–50번의 작품·판본·공식 route와 상태가 모두 정책에 맞는다. 8개 `sample-ready` 작품은 각각 genuine body pages 6쪽 이상과 실제로 구별되는 맥락 2개 이상을 충족하고, 44·50번은 finite trusted-route 부재를 기록한 non-blocking `unknown-ready`다. 42번의 opening/frontispiece refs는 제거됐으며 갱신된 전체 48개 SHA-256이 실제 임시 파일에서 재현된다. 이 QA는 Art Factor 값을 부여하지 않으며 `reviewedByHuman=false`를 유지한다.
