# Batch 002 보충 텍스트 독립 Pass B — chunk 05

- `reviewedByHuman=false`
- reviewer: Local Codex independent supplemental Pass B
- reviewedAt: `2026-08-23`
- 범위: frozen position 41–50의 진입 1–3권. タコピーの原罪만 완결 전 2권
- 기준선: `adjudication/text-chunk-05-round-01.md`
- 보충 패킷 SHA-256:
  `b66c895dd1da403cdccd4de95e49f8270152dc64de07ece36fde279bf5c57d2d`
- SHA 검증: 배정된 기대값과 일치
- decisionBoundary: Art, source row, registry row, Gold row, final CSV,
  adjudication 파일은 판단 대상으로 삼거나 변경하지 않았다. 이 문서는 Pass C의
  예상값만 제시하며 promotion을 결정하지 않는다.

판정은 보충 후보를 먼저 공식 범위와 Factor Dictionary에 대조한 뒤 Pass A,
round-01, Grok 결론과 비교했다. `ACCEPT`는 제안값 유지, `REVISE`는 다른 수치 채택,
`REJECT`는 제안값을 기각하고 `unknown`으로 복귀, `UNKNOWN`은 수치 후보 자체를
책임 있게 만들 수 없다는 뜻이다. `U`는 `unknown`이다.

known `0`은 공식 소개의 침묵, Genre, 리뷰의 미언급으로 만들지 않았다. 유한한 전체
범위가 해당 축의 active absence 또는 Dictionary의 0 anchor 행동을 긍정적으로
설명할 때만 허용했다. 리뷰는 정확한 범위의 복수 독립 작성자가 같은 구체 관찰을
반복할 때만 보조로 사용했고, 공식 근거를 대신하지 않았다. 판매량, 별점, 선정 이력,
인기는 Axis 근거에서 제외했다.

Narrative 순서는 `progression / problemSolving / strategy / pacing /
mysteryReveal / worldBuilding`, Tone 순서는 `characterArcWeight /
relationshipStructure / comedy / darkness / mentalStress / romance /
emotionalWarmth`다.

## 예상 최종 벡터와 gate

아래 값은 Pass C 입력 기대값이며 source data 변경이 아니다. 후보 기각으로 coverage가
미달해도 다른 약한 값을 채우지 않았다.

| Pos | canonicalTitle         | 예상 Narrative          | N gate | 예상 Tone                   | T gate | Text gate |
| --: | ---------------------- | ----------------------- | -----: | --------------------------- | -----: | --------- |
|  41 | サンキューピッチ       | `U / 2 / 2 / 2 / 2 / 2` |    5/6 | `2 / 2 / 4 / U / 2 / U / 2` |    5/7 | PASS      |
|  42 | うさぎドロップ         | `2 / 1 / U / 2 / 2 / U` |    4/6 | `4 / 2 / 2 / U / 2 / U / 4` |    5/7 | PASS      |
|  43 | 水は海に向かって流れる | `2 / 0 / U / 3 / 3 / U` |    4/6 | `4 / 3 / U / 2 / 3 / U / 2` |    5/7 | PASS      |
|  44 | 凪のお暇               | `2 / 2 / 1 / 2 / U / U` |    4/6 | `4 / 3 / U / 2 / 2 / 3 / 2` |    6/7 | PASS      |
|  45 | 逃げ上手の若君         | `2 / 2 / 2 / 3 / U / 3` |    5/6 | `2 / 3 / 2 / 3 / 2 / U / U` |    5/7 | PASS      |
|  46 | タコピーの原罪         | `U / 1 / U / 4 / 4 / 2` |    4/6 | `4 / 3 / U / 4 / 4 / U / U` |    4/7 | FAIL      |
|  47 | 闇のパープル・アイ     | `U / U / U / 4 / 3 / 2` |    3/6 | `4 / 2 / U / 4 / 4 / 2 / U` |    5/7 | FAIL      |
|  48 | YAIBA                  | `4 / U / U / 4 / U / 3` |    3/6 | `2 / 2 / 4 / 2 / 1 / U / U` |    5/7 | FAIL      |
|  49 | 夢の碑                 | `U / U / 2 / 3 / 2 / 4` |    4/6 | `4 / 2 / U / 3 / 3 / 4 / U` |    5/7 | PASS      |
|  50 | おそ松くん             | `U / U / U / U / U / U` |    0/6 | `U / U / U / U / U / U / U` |    0/7 | FAIL      |

예상 text gate는 6 PASS, 4 FAIL이다.

## contents bridge와 핵심 URL 감사

| Work           | 판정      | 직접 근거                                                                    | 감사 결과                                                                                                                                                                                                                                                                                                                                                                             |
| -------------- | --------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| うさぎドロップ | `ACCEPT`  | [B42-A], [E42-E1], [E42-E2], [E42-E3]                                        | 출판사 주문서의 원판 ISBN `9784396763800`, `9784396764005`, `9784396764210`이 BookLive 각 권 JSON-LD와 정확히 일치한다. 원판 1–3권 text bridge이며 별도 FCswing판 또는 5권 이후 관계를 유입하지 않는다.                                                                                                                                                                               |
| 夢の碑         | `REVISE`  | [E49-B1], [E49-B2], [E49-C], [E49-D1], [E49-D2]                              | `resolved-secondary-for-text`로 좁힌다. 2001·2002년 전화 인터뷰 페이지의 사이트 편집 PF 표는 桜の森の桜の闇·とりかえばや異聞을 PF 1–2, 青頭巾을 PF 2, ベルンシュタイン을 PF 3에 연결한다. 표 자체는 작가 발언이나 출판사 표가 아니다. 인터뷰와 小学館 story 소개가 작품명을 교차 확인하므로 이 네 story의 text에만 사용하고, 현행 collection의 다른 수록작과 Art에는 사용하지 않는다. |
| おそ松くん     | `UNKNOWN` | [E50-A1], [E50-A2], [E50-A3], [E50-B], [E50-C], [E50-D1], [E50-D2], [E50-D3] | frozen 1988 ボンボンKC 1–3권 identity는 맞지만 exact contents map은 없다. 권리자는 2009 전자 34권판에 여러 잡지 원고가 새로 추가됐다고 밝히고, 전자 1권은 초출 순 배열이다. 같은 총 권수와 ordinal은 contents bridge가 아니므로 13개 text Axis 모두 `unknown`을 유지한다.                                                                                                             |

2026-08-23에 위 세 bridge의 핵심 route와 [E43-B]를 다시 열었다. 원판 ISBN 세 개,
夢の碑 PF 표 두 개, おそ松くん 전자판 추가 공지, known 0 문맥을 재현했다. 접근 성공은
그 자체로 내용 충분성이나 독립성으로 세지 않았다.

## 보충 Axis 후보 38개 독립 판정

### 41. サンキューピッチ

| 후보                | 판정     | 최종 | 직접 근거                                                 | Dictionary·범위 판단                                                                                                |
| ------------------- | -------- | ---: | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `comedy=4`          | `ACCEPT` |    4 | [E41-B], [E41-C1], [E41-C2]                               | 공식 심사 패널과 정확한 1–3권 독립 리뷰가 대화·반응·상황 개그의 상시성을 반복한다. 단순 sports Genre 추론이 아니다. |
| `emotionalWarmth=2` | `ACCEPT` |    2 | [E41-A1], [E41-A2], [E41-A3], [E41-B], [E41-C1], [E41-C2] | 신뢰·존중·팀 결속이 반복되지만 승부 압박과 심리전도 크다. 핵심 warmth 4가 아닌 혼합 2다.                            |

### 42. うさぎドロップ

판정 범위는 ISBN으로 bridge된 원판 1–3권뿐이다.

| 후보                      | 판정     | 최종 | 직접 근거                                                           | Dictionary·범위 판단                                                                                     |
| ------------------------- | -------- | ---: | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `progression=2`           | `ACCEPT` |    2 | [E42-D], [E42-E1], [E42-E2], [E42-E3]                               | 보호자와 아이가 생활 단계를 거치며 서서히 배운다. 획득·숙련 보상 loop 4는 아니다.                        |
| `problemSolving=1`        | `ACCEPT` |    1 | [E42-E2], [E42-E3]                                                  | 유언·출생 단서·생모 대면과 양육·입학 준비에 제한된 탐색과 직접 행동이 섞인다. 분석 중심 2에는 못 미친다. |
| `pacing=2`                | `ACCEPT` |    2 | [E42-E1], [E42-E2], [E42-E3]                                        | 동거, 생모 arc, 입학으로 일반적인 arc 단위 변화가 있다.                                                  |
| `mysteryReveal=2`         | `ACCEPT` |    2 | [E42-E2]                                                            | 출생 비밀과 유언 단서·대면은 일부 주요 reveal이지만 작품 전체의 추리 보상은 아니다.                      |
| `characterArcWeight=4`    | `ACCEPT` |    4 | [E42-D], [E42-E1], [E42-E2], [E42-E3]                               | 두 사람의 동기·상호 변화·돌봄 관계가 세 권의 반복 핵심 보상이다.                                         |
| `relationshipStructure=2` | `ACCEPT` |    2 | [E42-E1], [E42-E2], [E42-E3]                                        | 두 주인공과 반복 가족·보호자·또래는 fixed core 2이며 복잡한 군상극이 아니다.                             |
| `comedy=2`                | `ACCEPT` |    2 | [E42-E1], [E42-E2], [E42-E3], [E42-R1], [E42-R2], [E42-R3]          | 복수 scoped 작성자가 양육의 어긋남과 일상 웃음을 여러 권에서 반복한다. 상시 comedy 4는 아니다.           |
| `mentalStress=2`          | `ACCEPT` |    2 | [E42-E2], [E42-R1], [E42-R2], [E42-R3]                              | 양육·직장·출생·입학 부담이 반복되지만 안정과 작은 성취가 완화한다.                                       |
| `emotionalWarmth=4`       | `ACCEPT` |    4 | [E42-D], [E42-E1], [E42-E2], [E42-E3], [E42-R1], [E42-R2], [E42-R3] | 선택한 동거, 돌봄, 상호 안전이 세 권의 중심 보상이다.                                                    |

### 43. 水は海に向かって流れる

| 후보                | 판정     | 최종 | 직접 근거                             | Dictionary·범위 판단                                                                                                                                                                                     |
| ------------------- | -------- | ---: | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `progression=2`     | `ACCEPT` |    2 | [E43-A1], [E43-A2], [E43-A3], [E43-B] | 완결 세 권에서 회피하던 인물들이 대면과 감정 처리로 서서히 이동한다.                                                                                                                                     |
| `problemSolving=1`  | `REVISE` |    0 | [E43-B]                               | 출판사 소유 완결작 편집 기사는 과거 사건에 해결이 존재하지 않고 행동이 모두 오답인 가운데 인물이 감정적 한 답에 도달한다고 긍정적으로 설명한다. 유한 전체 범위의 active 0 anchor이며 침묵 추론이 아니다. |
| `emotionalWarmth=2` | `ACCEPT` |    2 | [E43-B], [E43-C]                      | 동거인들이 서로의 고통을 침범하지 않고 지지하지만 죄책감과 긴장도 크다. 혼합 2다.                                                                                                                        |

### 44. 凪のお暇

| 후보               | 판정     | 최종 | 직접 근거                                                 | Dictionary·범위 판단                                                                                |
| ------------------ | -------- | ---: | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `progression=2`    | `ACCEPT` |    2 | [E44-A1], [E44-A2], [E44-A3], [E44-B1], [E44-B2], [E44-C] | 자기소거와 collapse 뒤에 주인공이 선택과 일상을 서서히 다시 만든다.                                 |
| `problemSolving=2` | `ACCEPT` |    2 | [E44-B1], [E44-B2], [E44-C]                               | 작가가 초기 1화 1생활요령 구조를 확인한다. 절약·생활 방법과 직접 행동이 반복되고 인간극과 병존한다. |
| `strategy=1`       | `ACCEPT` |    1 | [E44-A1], [E44-B1], [E44-C]                               | 저축 목표와 wish list는 제한된 단기 계획이다. 자원 운영이 핵심인 2에는 못 미친다.                   |

### 45. 逃げ上手の若君

| 후보             | 판정     | 최종 | 직접 근거                                                  | Dictionary·범위 판단                                                                            |
| ---------------- | -------- | ---: | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `comedy=2`       | `ACCEPT` |    2 | [E45-A1], [E45-A2], [E45-A3], [E45-B1], [E45-B2], [E45-B3] | 공식 1–3권과 scoped 작성자가 역사적 비극 사이의 얼굴·상황 개그를 반복한다. 상시 4는 아니다.     |
| `mentalStress=2` | `ACCEPT` |    2 | [E45-A1], [E45-A3], [E45-B1], [E45-B2], [E45-B3]           | 추격·상실·생존 압박이 반복되지만 도주 성공과 유머가 분명한 완급을 만든다. 지속 붕괴 4가 아니다. |

### 46. タコピーの原罪

| 후보               | 판정     | 최종 | 직접 근거                                       | Dictionary·범위 판단                                                                                                                                        |
| ------------------ | -------- | ---: | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `problemSolving=1` | `ACCEPT` |    1 | [E46-A1], [E46-A2], [E46-B], [E46-C1], [E46-C2] | 도구·재시도·직접 개입이 반복되지만 이해 부족으로 실패하거나 악화된다. 감정적 직접 행동 0과 혼합 방법 2 사이의 약한 1이다.                                   |
| `mysteryReveal=4`  | `ACCEPT` |    4 | [E46-B], [E46-C1], [E46-C2]                     | 완결 16화에서 loop 변화, 기억, 진실, 복선 회수가 앞 사건을 계속 재해석하며 주요 보상이다.                                                                   |
| `worldBuilding=2`  | `ACCEPT` |    2 | [E46-A1], [E46-A2], [E46-C1], [E46-C2]          | 외계 도구와 loop 규칙이 사건을 기능적으로 제약한다. 역사·문화·세력 중심 4는 아니다.                                                                         |
| `mentalStress=4`   | `ACCEPT` |    4 | [E46-A1], [E46-A2], [E46-C1], [E46-C2]          | 학교·가정 압박, 죽음, 죄책감, 관계 붕괴가 완결 전 범위에 지속된다.                                                                                          |
| `romance=0`        | `REJECT` |    U | [E46-A1], [E46-A2], [E46-B], [E46-C1], [E46-C2] | 출처가 다른 관계를 빠짐없이 설명하더라도 romance를 언급하지 않은 것은 omission이다. 적극적인 complete-work absence audit가 없어 known 0 문턱을 넘지 못한다. |

`romance=0` 기각 뒤 Tone은 4/7이다. gate를 회복하려고 다른 축을 만들지 않는다.

### 47. 闇のパープル・アイ

| 후보               | 판정     | 최종 | 직접 근거                                                  | Dictionary·범위 판단                                                                                                                                       |
| ------------------ | -------- | ---: | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `problemSolving=1` | `REJECT` |    U | [E47-A1], [E47-A2], [E47-A3], [E47-B1], [E47-B2], [E47-B3] | 도주·잠입·구출·감정적 직접 행동은 확인되지만 구체적인 분석·기지 성분은 없다. 1을 주면 2 anchor의 없는 절반을 발명하고, 0도 active absence 근거가 부족하다. |
| `mentalStress=4`   | `ACCEPT` |    4 | [E47-A1], [E47-A2], [E47-A3], [E47-B1], [E47-B2], [E47-B3] | 포획·실험 위협, 가족 위험, 상실, 배신이 세 권에 누적되어 공포와 압박을 지속시킨다.                                                                         |

### 48. YAIBA

| 후보               | 판정     | 최종 | 직접 근거                                                  | Dictionary·범위 판단                                                                                                         |
| ------------------ | -------- | ---: | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `problemSolving=1` | `REJECT` |    U | [E48-A1], [E48-A2], [E48-A3], [E48-B1], [E48-B2], [E48-B3] | 수련·신기술·직접 전투는 progression과 combat 근거다. 구체적인 분석 해결 관찰이 없어 problemSolving으로 중복 배정하지 않는다. |
| `comedy=4`         | `ACCEPT` |    4 | [E48-A1], [E48-A2], [E48-A3], [E48-B1], [E48-B2], [E48-B3] | 복수 scoped 작성자가 1–3권의 몸개그·말장난·comic 적과 지속적인 웃음을 반복한다.                                              |
| `mentalStress=1`   | `ACCEPT` |    1 | [E48-A1], [E48-A2], [E48-A3], [E48-B1], [E48-B2], [E48-B3] | 위험이 있어 0은 아니지만 가벼운 framing과 빠른 유머 해소가 반복되어 혼합 압박 2보다 낮다.                                    |

### 49. 夢の碑

secondary PF 표에 이름이 직접 연결된 네 story만 사용한다.

| 후보                      | 판정     | 최종 | 직접 근거                                                           | Dictionary·범위 판단                                                                                                |
| ------------------------- | -------- | ---: | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `strategy=2`              | `ACCEPT` |    2 | [E49-B1], [E49-B2], [E49-C], [E49-D1], [E49-D2]                     | 신분 교체, 군사 대립, 소국의 정치 선택에 전술·단기 계획이 반복되지만 anthology 전체가 전략 중심은 아니다.           |
| `pacing=3`                | `ACCEPT` |    3 | [E49-B1], [E49-B2]                                                  | PF 1–2 장편과 3권까지의 story·시대·장소·목표 전환이 함께 있다. 일반 arc 2보다 빠르나 계속되는 단간 전환 4는 아니다. |
| `mysteryReveal=2`         | `ACCEPT` |    2 | [E49-C], [E49-D1], [E49-D2], [E49-E1], [E49-E2]                     | 숨은 신분, 예언, 비인간 정체의 공개가 여러 bridged story에 중요하지만 clue solving이 anthology 전체 핵심은 아니다.  |
| `worldBuilding=4`         | `ACCEPT` |    4 | [E49-B1], [E49-B2], [E49-C], [E49-D1], [E49-D2]                     | 시대, 신분 규칙, 대립 세력, 인간·비인간 질서가 반복적으로 전개를 결정한다.                                          |
| `characterArcWeight=4`    | `ACCEPT` |    4 | [E49-B1], [E49-B2], [E49-C], [E49-D1], [E49-D2], [E49-E1], [E49-E2] | 동기, 정체성, 운명, 중심 관계가 각 story의 반복 핵심 보상이다.                                                      |
| `relationshipStructure=2` | `ACCEPT` |    2 | [E49-C], [E49-D1], [E49-D2]                                         | story별 한 쌍과 핵심 조연이 중심이다. 서로 다른 anthology cast를 하나의 군상 관계망으로 합치지 않는다.              |
| `darkness=3`              | `ACCEPT` |    3 | [E49-B1], [E49-B2], [E49-D1], [E49-D2], [E49-E1], [E49-E2]          | 레퀴엠, 잔혹한 운명, 전쟁, 비극이 반복되지만 romance와 일부 comic 완급이 있어 일관된 4보다 낮다.                    |
| `mentalStress=3`          | `ACCEPT` |    3 | [E49-B1], [E49-B2], [E49-D1], [E49-D2], [E49-E1], [E49-E2]          | 전쟁·집착·신분·정치 압박과 관계 비극이 반복되지만 모든 story가 지속 붕괴 4인 것은 아니다.                           |
| `romance=4`               | `ACCEPT` |    4 | [E49-B1], [E49-B2], [E49-C], [E49-D1], [E49-D2], [E49-E1], [E49-E2] | 중심 사랑과 비극적 관계가 bridged story 전개를 반복해서 이끌며 단순 subplot이 아니다.                               |

### 50. おそ松くん

| 후보 또는 종결 | 판정      | 최종   | 직접 근거                                                                    | Dictionary·범위 판단                                                                                                                                  |
| -------------- | --------- | ------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| text Axis 13개 | `UNKNOWN` | 모두 U | [E50-A1], [E50-A2], [E50-A3], [E50-B], [E50-C], [E50-D1], [E50-D2], [E50-D3] | identity와 연대기는 frozen 1–3권 exact episode를 알려 주지 않는다. Work-level humor, revival, 각색, 증보 전자판에서 sustained Axis를 전용하지 않는다. |

## Genre·Theme 후보 독립 판정

모든 Pass A·round-01·보충 tag를 Axis와 분리해 다시 확인했다. 아래 `→` 오른쪽이 최종
값이다. 특히 Pass A의 逃げ上手の若君 `combat:2`와 闇のパープル・アイ
`survival:2`는 round-01 결론을 그대로 상속하지 않고 entry scope와 centrality를 다시
검수해 각각 1로 `REVISE`했다.

| Work                   | Genre 후보·판정                                         | Theme 후보·판정                                                                                                            | 직접 근거                                       |
| ---------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| サンキューピッチ       | `sports ACCEPT`                                         | `school:1 ACCEPT→1`; `sportsCompetition:2 ACCEPT→2`                                                                        | [E41-A1], [E41-A2], [E41-A3]                    |
| うさぎドロップ         | `sliceOfLife ACCEPT`                                    | `foundFamily:2 ACCEPT→2`                                                                                                   | [E42-D], [E42-E1], [E42-E2], [E42-E3]           |
| 水は海に向かって流れる | `sliceOfLife ACCEPT`                                    | `foundFamily:2 ACCEPT→2`                                                                                                   | [E43-A1], [E43-A2], [E43-A3], [E43-B]           |
| 凪のお暇               | `sliceOfLife ACCEPT`; `romance ACCEPT`                  | `workplace:1 ACCEPT→1`                                                                                                     | [E44-A1], [E44-A2], [E44-A3]                    |
| 逃げ上手の若君         | `action ACCEPT`; `historical ACCEPT`                    | `combat:2 REVISE→1`; `war:2 ACCEPT→2`; `politics:1 ACCEPT→1`; `survival:2 ACCEPT→2`; `historicalReconstruction:2 ACCEPT→2` | [E45-A1], [E45-A2], [E45-A3]                    |
| タコピーの原罪         | `scienceFiction ACCEPT`                                 | `school:1 ACCEPT→1`                                                                                                        | [E46-A1], [E46-A2]                              |
| 闇のパープル・アイ     | `fantasy ACCEPT`; `horror ACCEPT`                       | `survival:2 REVISE→1`; `revenge:1 ACCEPT→1`                                                                                | [E47-A1], [E47-A2], [E47-A3]                    |
| YAIBA                  | `action ACCEPT`; `fantasy ACCEPT`                       | `combat:2 ACCEPT→2`; `martialArts:2 ACCEPT→2`                                                                              | [E48-A1], [E48-A2], [E48-A3]                    |
| 夢の碑                 | `fantasy ACCEPT`; `historical ACCEPT`; `romance ACCEPT` | `war:1 ACCEPT→1`; `politics:1 ACCEPT→1`; `historicalReconstruction:2 ACCEPT→2`                                             | [E49-B1], [E49-B2], [E49-C], [E49-D1], [E49-D2] |
| おそ松くん             | `comedy ACCEPT`                                         | none                                                                                                                       | [E50-C], [E50-D1]                               |

おそ松くん의 comedy는 canonical Work의 공식 Genre 분류다. 대표판 contents bridge나
`comedy` Axis known을 만들지 않는다.

## 충돌과 이전 검수 비교

| 항목                                      | 독립 판정                                                                                                                                                   |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 水は海に向かって流れる `problemSolving=1` | `REVISE→0`. 완결 전체를 다룬 출판사 편집 기사가 해결 부재와 감정적 답을 긍정적으로 설명한다.                                                                |
| タコピーの原罪 `romance=0`                | `REJECT→U`. 다른 관계의 상세 설명과 romance 미언급은 active absence가 아니다.                                                                               |
| 闇のパープル・アイ `problemSolving=1`     | `REJECT→U`. 직접 행동은 있으나 분석 해결 관찰이 없다.                                                                                                       |
| YAIBA `problemSolving=1`                  | `REJECT→U`. 수련과 기술을 progression·combat와 problemSolving에 중복 배정하지 않는다.                                                                       |
| 夢の碑 bridge authority                   | `REVISE`. exact PF 표는 재현되지만 인터뷰 host의 site-editorial 자료이지 출판사 contents 표나 작가 발언이 아니다. `resolved-secondary-for-text`로 한정한다. |
| Pass A Theme centrality                   | 逃げ上手の若君 combat와 闇のパープル・アイ survival은 공식 1–3권에서 반복 핵심 mechanic 2보다 일부 소재 1이 맞아 각각 `REVISE`한다.                         |

저장된 Cursor Grok 응답은 supplemental 자료가 없는 원래 9-input packet을 검수했다. 당시
うさぎドロップ·夢の碑 all-unknown은 그 증거 경계에서는 유효하며 새 bridge의 반대표가
아니다. おそ松くん all-unknown은 이번 판정과 일치한다. ledger는 요청된 non-fast 모델,
정상 완료, 원 packet 전체 접근, Art 기권, `reviewedByHuman=false`를 확인하지만 사람
검수는 아니다.

## identity·safety 모순과 hard blocker

- 10작품의 대표 ISBN·identity·safety 결정은
  `adjudication/identity-chunk-05.md` 그대로다. Work split, title, ISBN, publisher,
  release date, safety, catalog row를 재개하지 않았다.
- うさぎドロップ의 선행 경고는 별도 FCswing판 전용 문제였다. 이번 bridge는 exact
  original ISBN을 original volume route에 묶으므로 모순이 아니다.
- 夢の碑에 official contents bridge가 없다는 선행 결론은 그대로 맞다. 이번 판정은
  reliable-interview tier의 더 좁은 secondary bridge이며 현행 collection 제외 경계를
  유지한다.
- おそ松くん identity·numbering 확인은 episode contents 동일성을 뜻하지 않는다.
  전자판의 추가 수록 공지 때문에 contents bridge는 계속 unresolved다.
- 아동 피해, 죽음, 역사 폭력, 변신, 관계 갈등은 내용 관찰이며 adult-only 판매 분류가
  아니다. safety는 10작품 모두 PASS를 유지한다.
- 이 Pass B가 발견한 identity 또는 safety hard blocker는 0개다. 네 text gate 실패는
  Pass C가 다룰 coverage 실패이며, 여기서 `promotionBlocked`,
  `SOURCE_INFORMATION_UNAVAILABLE`, eligibility, promotion role을 정하지 않는다.

## 집계

| 항목                                       | 결과                              |
| ------------------------------------------ | --------------------------------- |
| 보충 Axis 후보                             | 9작품, 38개                       |
| Axis `ACCEPT`                              | 34                                |
| Axis `REVISE`                              | 1                                 |
| Axis `REJECT`                              | 3                                 |
| Axis 후보 `UNKNOWN`                        | 0                                 |
| 별도 all-axis `UNKNOWN` 종결               | おそ松くん 1작품, 13개 Axis       |
| 최종 Genre tag 검수                        | 16                                |
| Genre `ACCEPT / REVISE / REJECT / UNKNOWN` | `16 / 0 / 0 / 0`                  |
| 보충 Genre 추가                            | 2작품, 4개 tag                    |
| 최종 Theme tag 검수                        | 18                                |
| Theme `ACCEPT / REVISE / REJECT / UNKNOWN` | `16 / 2 / 0 / 0`                  |
| 보충 Theme 추가                            | 3작품, 5개 Theme                  |
| contents bridge                            | `1 ACCEPT / 1 REVISE / 1 UNKNOWN` |
| 예상 text gate                             | `6 PASS / 4 FAIL`                 |
| identity·safety contradiction·hard blocker | `0 / 0 / 0`                       |

## Evidence URLs

[b42-a]: https://www.shodensha.co.jp/pop/comic_202602.pdf
[e41-a1]: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884305-6
[e41-a2]: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884499-2
[e41-a3]: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884668-2
[e41-b]: https://www.mangataisho.com/data/2026/comment2026.pdf
[e41-c1]: https://note.com/yumyumyomi/n/ne51f637d4344
[e41-c2]: https://note.com/tatsuya0508/n/n0af0e1234a63
[e42-d]: https://www.shodensha.co.jp/mangajam/jam012.html
[e42-e1]: https://booklive.jp/product/index/title_id/43150/vol_no/001
[e42-e2]: https://booklive.jp/product/index/title_id/43150/vol_no/002
[e42-e3]: https://booklive.jp/product/index/title_id/43150/vol_no/003
[e42-r1]: https://booklive.jp/review/list/title_id/43150/vol_no/001
[e42-r2]: https://booklive.jp/review/list/title_id/43150/vol_no/002
[e42-r3]: https://booklive.jp/review/list/title_id/43150/vol_no/003
[e43-a1]: https://www.kodansha.co.jp/comic/products/0000319530
[e43-a2]: https://www.kodansha.co.jp/comic/products/0000327242
[e43-a3]: https://www.kodansha.co.jp/comic/products/0000344116
[e43-b]: https://news.kodansha.co.jp/comics/9673
[e43-c]: https://www.cmoa.jp/title/174149/?disp_mode=easy&order=up&page=1
[e44-a1]: https://www.akitashoten.co.jp/comics/4253156371
[e44-a2]: https://www.akitashoten.co.jp/comics/425315638X
[e44-a3]: https://www.akitashoten.co.jp/comics/4253156401
[e44-b1]: https://ananweb.jp/categories/entertainment/11164/
[e44-b2]: https://natalie.mu/comic/pp/engawa/page/3
[e44-c]: https://nlab.itmedia.co.jp/cont/articles/3283685/amp/
[e45-a1]: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882710-0
[e45-a2]: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882734-6
[e45-a3]: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882793-3
[e45-b1]: https://booklive.jp/review/list/title_id/961446/vol_no/001
[e45-b2]: https://booklive.jp/review/list/title_id/961446/vol_no/002
[e45-b3]: https://booklive.jp/review/list/title_id/961446/vol_no/003
[e46-a1]: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883049-0
[e46-a2]: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883104-6
[e46-b]: https://shueisha.online/articles/-/4441?page=1
[e46-c1]: https://booklive.jp/review/list/title_id/1080370/vol_no/002
[e46-c2]: https://www.cmoa.jp/title/238426/?disp_mode=easy&order=up&page=1
[e47-a1]: https://shogakukan-comic.jp/book?jdcn=091316510000d0000000
[e47-a2]: https://shogakukan-comic.jp/book?jdcn=091316520000d0000000
[e47-a3]: https://shogakukan-comic.jp/book?jdcn=091316530000d0000000
[e47-b1]: https://booklive.jp/review/list/title_id/185715/vol_no/001
[e47-b2]: https://booklive.jp/review/list/title_id/185715/vol_no/002
[e47-b3]: https://booklive.jp/review/list/title_id/185715/vol_no/003
[e48-a1]: https://shogakukan-comic.jp/book?jdcn=091222710000d0000000
[e48-a2]: https://shogakukan-comic.jp/book?jdcn=091222720000d0000000
[e48-a3]: https://shogakukan-comic.jp/book?jdcn=091222730000d0000000
[e48-b1]: https://booklive.jp/review/list/title_id/185663/vol_no/001
[e48-b2]: https://booklive.jp/review/list/title_id/185663/vol_no/002
[e48-b3]: https://booklive.jp/review/list/title_id/185663/vol_no/003
[e49-b1]: https://www.horie-nobuo.com/dozi/me/me052.html
[e49-b2]: https://www.horie-nobuo.com/dozi/me/me062.html
[e49-c]: https://shogakukan-comic.jp/book?jdcn=091912210000d0000000
[e49-d1]: https://e-comi.shogakukan.co.jp/books/091912220000d0000000
[e49-d2]: https://e-comi.shogakukan.co.jp/books/091912270000d0000000
[e49-e1]: https://booklive.jp/review/list/title_id/502189/vol_no/001
[e49-e2]: https://www.cmoa.jp/title/144155/
[e50-a1]: https://www.kodansha.co.jp/comic/products/0000120298
[e50-a2]: https://www.kodansha.co.jp/comic/products/0000120299
[e50-a3]: https://www.kodansha.co.jp/comic/products/0000120300
[e50-b]: https://macc.bunka.go.jp/wp-content/uploads/2023/07/7e482f3ac8e13b33f02ea7099246bd89.pdf
[e50-c]: https://www.koredeiinoda.net/fujiopro-topic/?p=207
[e50-d1]: https://ebookjapan.yahoo.co.jp/books/114045/A000034609/
[e50-d2]: https://ebookjapan.yahoo.co.jp/books/114045/A000034610/
[e50-d3]: https://ebookjapan.yahoo.co.jp/books/114045/A000034611/
