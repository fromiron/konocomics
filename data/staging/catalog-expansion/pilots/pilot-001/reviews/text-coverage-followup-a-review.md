# Pilot 001 좁은 재조사 A 독립 검수

- candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- 검수 대상: `work-671e3453cf9e1df2ee87` (`陽だまりの樹`), `work-0bec5d8d9474a2197312` (`放浪息子`)
- 검수일: `2026-08-23`
- 범위: `entry_1_3_volumes`
- 결론 상속 여부: 상속하지 않음. `/tmp/pilot-text-gap-a.md`의 값은 제안으로만 취급하고 Factor Dictionary, Pass A, 기존 Pass B/C, 공식 페이지, 보존된 공식 preview 표본을 다시 대조했다.
- 저장소 변경: 없음

## 1. 검수 입력과 재현성

직접 확인한 내부 계약:

- `docs/factors/factor-dictionary.md`
- `docs/factors/annotation-guide.md`
- `annotation-pass-a/chunk-01`, `annotation-pass-a/chunk-02`의 두 작품 행과 notes
- `reviews/coverage-gap-chunks-01-02.md`
- `reviews/text-pass-bc-chunks-01-02.md`
- `research/chunk-01.md`, `research/chunk-02.md`
- `/tmp/pilot-text-gap-a.md`

직접 재확인한 공식 자료:

| id | 확인 결과 | URL |
|---|---|---|
| H-00 | 小学館의 동일 문고 series index가 `陽だまりの樹〔小学館文庫〕` 1~8권을 연결한다. | https://shogakukan-comic.jp/book-series?cd=16938 |
| H-01 | 문고 1권은 ISBN `9784091920515`, 328쪽, 제1~9화이며 제1화부터 시작한다. 두 주인공의 만남과 각자의 진로 시작, 서양의학 제약을 공식적으로 설명한다. | https://shogakukan-comic.jp/book?isbn=9784091920515 |
| H-02 | 문고 2권은 ISBN `9784091920522`, 332쪽, 제1~7화이며 발탁, 호위 역할, 종두관 관련 사건을 공식적으로 설명한다. | https://shogakukan-comic.jp/book?isbn=9784091920522 |
| H-03 | 문고 3권은 ISBN `9784091920539`, 336쪽, 제1~7화이며 50석 가증과 종두소 지지 확대를 공식적으로 설명한다. | https://shogakukan-comic.jp/book?isbn=9784091920539 |
| R-00 | BOOK☆WALKER 공식 series index가 전자판 1~3권과 각 권의 별도 trial을 연결한다. 1~3권 상품 소개문은 같은 boilerplate다. | https://bookwalker.jp/series/162/ |
| R-01 | 전자 1권 trial의 공개 서사면 인쇄 pp.8~17을 직접 재확인했다. | https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=4bd52269-b4b6-43d8-a916-9cf8c2437a09 |
| R-02 | 전자 2권 trial의 공개 서사면 인쇄 pp.6~18을 직접 재확인했다. | https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=446e1436-912e-4738-bba9-5916bcd3faff |
| R-03 | 전자 3권 trial의 공개 서사면 인쇄 pp.6~18을 직접 재확인했다. | https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=028c9d22-530c-4728-b4d4-f45038f05b0b |

`放浪息子`의 총 36쪽은 각 권 전체가 아니라 각 권의 연속된 공식 공개 권두 표본이다. 따라서 값 0은 “소개에 없었다”로 정하지 않고, 세 권의 서로 다른 연속 표본이 같은 보상·진행 방식을 반복해서 보여 주는 축에만 허용했다.

## 2. `陽だまりの樹`

### 판본·범위 판정

`9784091920515`~`9784091920539`는 frozen 대표 ISBN `9784091806017`을 교체하지 않는다. 다만 공식 series index와 1권의 제1화 시작이 같은 작품의 chronological entry alternate edition임을 직접 연결하므로 텍스트 근거로 사용할 수 있다. H-03은 대표 일반판과 권차가 1:1이라고 주장하지 않고, 연속된 공식 재편집판의 entry 범위로만 사용한다.

### 좁은 재조사 제안별 결정

| 축/Theme | 제안 | 결정 | 근거 |
|---|---:|---|---|
| `progression` | 2 | **ACCEPT** | H-01의 경로 시작, H-02의 공식 역할 발탁, H-03의 지위 가증이 순서대로 이어진다. 이미 가진 능력이나 일반적인 인물 변화를 재명명한 것이 아니라 역할·지위 획득이 반복된다. 획득 보상이 매 사건의 최대 중심은 아니므로 4가 아니라 2다. confidence `0.82` 권고. |
| `strategy` | U | **UNKNOWN** | 암살 계획·조약 정치·아베의 장기 구상은 존재하지만 주인공이 장기 계획·정치·자원을 운영하는 반복 보상까지는 공식 권 설명이 입증하지 않는다. 사건에 계획이 있다는 사실과 Axis 2/4를 구분했다. |
| `mysteryReveal` | U | **UNKNOWN** | H-03의 부친 사망 진상은 한정된 reveal 하나다. 세 권의 반복 보상이 단서·추리·진실 공개라는 증거는 아니다. 단일 사건을 축으로 일반화하지 않았다. |
| `historicalReconstruction` | 2 | **ACCEPT** | 서양의학 제약, 종두소 설립, 외교 사절 호위, 통상조약·신분 제도가 세 entry 권에서 사건을 반복적으로 제약한다. `historical` Genre에서 자동 파생한 값이 아니다. |

### 최종 벡터 독립 확인

| 그룹 | 축 | 최종 | 결정 메모 |
|---|---|---:|---|
| Narrative | `progression` | 2 | 위 신규 근거로 ACCEPT |
| Narrative | `problemSolving` | 2 | 결투·직접 행동과 의료 처치·제도 문제 대응이 혼합되어 Pass B/C 유지 |
| Narrative | `strategy` | U | 반복적 주인공 계획 근거 부족 |
| Narrative | `pacing` | 2 | 세 권의 사건·역할·장소 변화가 일반 arc 단위로 이어지며 0/4 어느 극단도 아님 |
| Narrative | `mysteryReveal` | U | 단일 bounded reveal만 확인 |
| Narrative | `worldBuilding` | 4 | 의학·신분·외교·정치 제도가 배경 장식이 아니라 반복적으로 사건을 규정함 |
| Tone | `characterArcWeight` | 4 | 두 주인공의 경로와 선택이 공식 설명의 핵심 보상 |
| Tone | `relationshipStructure` | 2 | 두 주인공과 고정 주변 인물 구조이며 level-4 군상극 근거는 부족 |
| Tone | `comedy` | U | 장난스러운 인물 묘사만으로 반복 개그 빈도를 정하지 않음 |
| Tone | `darkness` | 2 | 질병·폭력·정치적 위험이 반복되지만 암울함이 전 보상을 지배하지 않음 |
| Tone | `mentalStress` | U | 위험 존재와 지속적 체감 압박을 구분할 자료 부족 |
| Tone | `romance` | 2 | 두 주인공과 오세키의 관계선이 명시되나 역사·의학·개인 경로에 종속 |
| Tone | `emotionalWarmth` | 2 | 치료·우정·친절과 폭력·경쟁이 공존하는 혼합 anchor |

- Narrative: `2 / 2 / U / 2 / U / 4` = **4/6, PASS**
- Tone: `4 / 2 / U / 2 / U / 2 / 2` = **5/7, PASS**
- 텍스트 coverage 결론: **PASS**
- hard blocker: **없음**

## 3. `放浪息子`

### 표본 경계와 0값 판정 규칙

R-01~R-03은 세 권의 서로 다른 CID로 연결된 공식 전자판 trial이다. 보존된 공개 페이지를 직접 확인했으며, 표지·목차·인물 소개·광고는 서사 관찰 수에서 제외했다.

36쪽이 세 권 전체는 아니므로 임의의 “없음”을 만들 수는 없다. 다만 다음 세 조건이 동시에 성립하는 경우 0을 허용했다.

1. 서로 다른 세 권의 연속 권두 장면을 모두 확인했다.
2. 해당 축의 0 anchor에 해당하는 진행 방식이 각 표본에서 실제로 관찰됐다.
3. 공식 series framing도 다른 보상 구조를 작품의 중심으로 명시하며, 반대되는 2/4 관찰이 없었다.

이 기준 때문에 `worldBuilding`처럼 배경 규칙의 지속성을 표본에서 충분히 확인하지 못한 축은 0으로 내리지 않았다.

### 좁은 재조사 제안별 결정

| 축 | 제안 | 결정 | 근거 |
|---|---:|---|---|
| `progression` | U | **UNKNOWN** | 자기 이해·관계 변화는 `characterArcWeight`의 직접 대상이다. 기술·지위·자원·숙련의 반복 획득 보상으로 다시 세면 이중 계산이다. |
| `problemSolving` | 0 | **ACCEPT** | 세 권의 표본에서 전학·교실 상호작용, 가족·옷에 관한 바람, 오디션·사과가 모두 대화·정서적 결단·직접 행동으로 진행된다. 분석·기발한 해법의 부재만 센 것이 아니라 실제 resolution mode가 반복된다. confidence `0.72` 권고. |
| `strategy` | 0 | **ACCEPT** | 세 표본의 관찰 가능한 진행은 즉시 관계 대응과 통상 일정이다. 장기 계획·정치·자원 운영 또는 반복 전술이 아니다. 공식 framing도 사춘기 관계와 자기표현을 중심 보상으로 둔다. confidence `0.72` 권고. |
| `pacing` | 2 | **ACCEPT** | 1권의 가정→전학→교실, 2권의 명절 가정→새 학기, 3권의 학교→이동→오디션→가정→다음 학교일이 일반 arc 단위 변화를 직접 보여 준다. 정체된 0도, 짧은 간격의 대전환이 지속되는 4도 아니다. confidence `0.80` 권고. |
| `mysteryReveal` | 0 | **ACCEPT** | 가장 엄격히 검토한 경계값이다. 세 권의 서로 다른 연속 표본 모두 보상은 자기표현·관계 반응·조정이며 단서 수집, 추리, 반전, 숨은 진실 공개가 아니다. 공식 series framing도 같은 보상 구조를 명시한다. 단순한 synopsis 미언급이 아니라 세 권의 실제 반복 관찰에 근거하므로 entry 범위에서 0을 허용한다. 전체 시리즈 일반화는 하지 않는다. confidence `0.68` 권고. |
| `worldBuilding` | U | **UNKNOWN** | 학교·통학·오디션은 보이지만 그 규칙이 반복적으로 결정을 제약하는 level 2인지, 최소 배경인 0인지 현재 공개 권두 표본으로 확정할 수 없다. |
| `emotionalWarmth` | 2 | **ACCEPT** | 1권의 가족 지지와 교사의 사과, 2권의 조부모 포옹·격려, 3권의 남매·친구 간 질문·사과·관계 조정이 서로 다른 권과 관계에서 반복된다. 당혹·숨김·상처 위험도 공존하므로 4가 아닌 혼합 2다. confidence `0.82` 권고. |

### 최종 벡터 독립 확인

| 그룹 | 축 | 최종 | 결정 메모 |
|---|---|---:|---|
| Narrative | `progression` | U | character arc와 이중 계산하지 않음 |
| Narrative | `problemSolving` | 0 | 세 권에서 관찰된 직접·정서적 진행 방식 |
| Narrative | `strategy` | 0 | 세 권에서 관찰된 즉시 관계 대응 중심 |
| Narrative | `pacing` | 2 | 세 권의 권두에서 일반 arc 변화 반복 |
| Narrative | `mysteryReveal` | 0 | 공식 framing과 세 권 실제 표본의 보상 구조 일치 |
| Narrative | `worldBuilding` | U | 기능적 규칙 지속성 불충분 |
| Tone | `characterArcWeight` | 4 | 자기 이해·동기·관계 변화가 핵심 보상 |
| Tone | `relationshipStructure` | 2 | 두 주인공과 고정 학교·가족 관계 |
| Tone | `comedy` | U | 웃음 빈도·중심성 근거 부족 |
| Tone | `darkness` | U | 민감한 소재 존재를 암울함 값으로 자동 변환하지 않음 |
| Tone | `mentalStress` | 3 | 공식 소개·심사평의 취약함과 고민, 표본의 반복 당혹·긴장이 지속 압박을 지지하되 붕괴 4는 아님 |
| Tone | `romance` | 1 | 공식 학원 love-story framing은 존재하나 자기 이해·관계 성장보다 종속 |
| Tone | `emotionalWarmth` | 2 | 세 권·복수 관계의 지지와 갈등이 혼합 |

- Narrative: `U / 0 / 0 / 2 / 0 / U` = **4/6, PASS**
- Tone: `4 / 2 / U / U / 3 / 1 / 2` = **5/7, PASS**
- Genre/Theme: `sliceOfLife`, `school=2` 유지 가능. 학교가 단순 한 장면이 아니라 세 권의 반복 중심 무대다.
- 텍스트 coverage 결론: **PASS**
- hard blocker: **없음**

## 4. 장식 문자·blocker·종합 결정

- canonical title은 `陽だまりの樹`, `放浪息子`로 기록되어 있으며 `『`와 `』`를 포함하지 않는다.
- 공식 source title 안의 판본 표기 `〔小学館文庫〕`는 provenance 문구일 뿐 canonical title에 합치지 않는다.
- 두 작품 모두 공식 자료가 접근 가능하고 identity를 연결할 수 있으므로 `SOURCE_INFORMATION_UNAVAILABLE` 또는 다른 text hard blocker 후보가 아니다.
- 이 결론은 text coverage만 닫는다. safety, canonical identity, ISBN, Art state, evidence row, recommendation context, 독립 promotion gate는 별도 통과가 필요하다.

## 5. 결정 수

- 검수한 좁은 재조사 Axis 제안: **10개**
- 제안 값 그대로 known으로 ACCEPT: **6개**
  - `陽だまりの樹`: `progression=2`
  - `放浪息子`: `problemSolving=0`, `strategy=0`, `pacing=2`, `mysteryReveal=0`, `emotionalWarmth=2`
- `unknown` 종결 ACCEPT: **4개**
  - `陽だまりの樹`: `strategy`, `mysteryReveal`
  - `放浪息子`: `progression`, `worldBuilding`
- 값 CORRECT: **0개**
- Theme 재확인: **2개** (`historicalReconstruction=2`, `school=2`)
- text coverage PASS: **2/2 작품**
- hard blocker: **0/2 작품**
