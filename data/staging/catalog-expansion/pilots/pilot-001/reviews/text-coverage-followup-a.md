# Pilot 001 Text coverage 좁은 재조사 A

- 대상 candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- 대상: `work-671e3453cf9e1df2ee87` (`陽だまりの樹`), `work-0bec5d8d9474a2197312` (`放浪息子`)
- 조회일: `2026-08-23`
- 평가 범위: chronological entry 1~3권 또는 그에 대응하는 공식 판본의 첫 주요 에피소드
- 제한: 기존 원장의 미소진 공식 경로만 조사했다. 전체 후보 수집, 신규 커뮤니티 수집, 유저평 수집은 하지 않았다.
- Axis 순서:
  - Narrative: `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`
  - Tone: `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`

## 결론 요약

| workId | 작품명 | 조사 전 N/T | 최종 N/T | coverage | 결론 |
|---|---|---:|---:|---|---|
| `work-671e3453cf9e1df2ee87` | `陽だまりの樹` | 3/6, 5/7 | **4/6, 5/7** | PASS | 공식 문고판 1~3권의 반복적인 지위·역할·제도적 성취를 근거로 `progression=2` 확정 |
| `work-0bec5d8d9474a2197312` | `放浪息子` | 0/6, 4/7 | **4/6, 5/7** | PASS | 공식 1~3권 내부 미리보기의 36개 서사 페이지를 교차 표본으로 `problemSolving=0`, `strategy=0`, `pacing=2`, `mysteryReveal=0`, `emotionalWarmth=2` 확정 |

두 작품 모두 이번 공식 경로로 현재 coverage gate를 닫을 수 있다. `promotionBlocked` 후보가 아니다.

## 1. `work-671e3453cf9e1df2ee87` — `陽だまりの樹`

### 판본 경계

- frozen representative ISBN은 일반판 1권 `9784091806017`이다.
- 이번에 미소진 V02로 확인한 자료는 小学館文庫판 ISBN `9784091920515`~`9784091920539`이다. 대표 ISBN을 바꾸는 근거로 사용하지 않는다.
- 小学館 공식 series page가 세 권을 같은 `陽だまりの樹〔小学館文庫〕` 연속 권차로 연결하고, 문고 1권이 제1화부터 시작한다. 따라서 chronological entry의 alternate edition으로만 사용했다.

### 공식 출처 원장

| id | sourceName | publishedAt | 판본·범위 | URL | 직접 확인 내용 |
|---|---|---|---|---|---|
| H-00 | 小学館コミック `陽だまりの樹〔小学館文庫〕` series page | undated | 문고판 series index | https://shogakukan-comic.jp/book-series?cd=16938 | H-01~H-03이 같은 공식 연속 판본의 1~3권임을 확인 |
| H-01 | 小学館コミック `陽だまりの樹〔小学館文庫〕 1` | 1995-05-17 | ISBN `9784091920515`, 문고 1권, 제1~9화, 328쪽 | https://shogakukan-comic.jp/book?isbn=9784091920515 | 출사 4개월인 万次郎가 良庵과 만나고, 결투 부상을 良庵이 치료한다. 공식 권 특징은 두 사람이 각각 자기 길을 본격적으로 걷기 시작하고, 서양의학 미인정 때문에 생명이 희생되는 문제를 전면화한다고 명시 |
| H-02 | 小学館コミック `陽だまりの樹〔小学館文庫〕 2` | 1995-05-17 | ISBN `9784091920522`, 문고 2권, 제1~7화, 332쪽 | https://shogakukan-comic.jp/book?isbn=9784091920522 | 지진 피난 유도, 良仙 암살 계획 개입, 근신과 해제 뒤 老中・阿部의 발탁이 이어진다. 공식 권 특징은 万次郎가 Harris·Heusken 호위를 맡고 장차 육군 통솔자로 고려된다고 명시. `抜擢`, `除痘館`이 실제 수록 에피소드 |
| H-03 | 小学館コミック `陽だまりの樹〔小学館文庫〕 3` | 1995-05-17 | ISBN `9784091920539`, 문고 3권, 제1~7화, 336쪽 | https://shogakukan-comic.jp/book?isbn=9784091920539 | 아버지 죽음의 진상, 통상조약 최종평의와 종두소 설립 청원, 고열 중 임무 수행이 이어진다. 공식 권 특징은 万次郎의 50석 가증과 종두소 설립 지지자의 점진적 증가를 명시 |

모든 H 출처의 `retrievedAt`은 `2026-08-23`이다.

### 미달 축 판정

#### `progression=2` — ACCEPT

- Dictionary의 2 anchor는 서서히 성장·획득하는 구조다.
- H-01은 두 주인공이 자기 경로를 본격적으로 시작한다고 범위를 잡는다.
- H-02는 万次郎가 호위 역할로 발탁되고 장래의 지휘 역할까지 고려되는 지위·역할 획득을 명시한다.
- H-03은 실제 50석 가증과 종두소 지지자의 점진적 증가를 명시한다.
- 즉 한 문장의 장기 synopsis가 아니라 연속 세 entry 권에서 `경로 시작 → 공식 역할 발탁 → 가증`, 그리고 의료 제도의 점진적 지지 확보가 반복된다. 숙련·획득 보상이 명확하지만 매 권 압도적인 최대 보상 구조라고 볼 정도는 아니므로 4가 아닌 2다.
- confidence: `0.88`.

#### `strategy=U` — 종결

阿部의 장래 계획, 암살 계획, 조약 정치가 등장하지만 H-01~H-03이 보여 주는 주인공의 반복 보상은 즉각 행동·임무 수행과 발탁이다. 주인공의 장기 계획·자원 운영이 중심이라는 anchor까지는 직접 입증하지 못한다.

#### `mysteryReveal=U` — 종결

H-03의 아버지 사망 진상은 하나의 bounded reveal이지만, 1~3권 전체에서 단서·추리·진실 공개가 반복적인 주요 보상이라는 근거는 아니다. 단일 사건을 축 전체로 일반화하지 않았다.

### 최종 벡터와 Theme 확인

- Narrative: **`2 / 2 / U / 2 / U / 4` = 4/6 — PASS**
- Tone: **`4 / 2 / U / 2 / U / 2 / 2` = 5/7 — PASS** (기존 Pass B/C 값 유지)
- `historicalReconstruction=2`: 유지 가능. H-01~H-03에서 서양의학 인식, 종두소 설립 운동, Harris·Heusken 호위, 통상조약 평의가 entry에 반복하여 실제 전개를 제약한다. `historical` genre에서 자동 변환한 값이 아니다.
- 미달 해소에 필요하지 않은 다른 unknown은 채우지 않았다.

## 2. `work-0bec5d8d9474a2197312` — `放浪息子`

### 공식 미리보기 범위와 판본

- frozen representative ISBN은 1권 `9784757715226`이다.
- BOOK☆WALKER 상품 페이지는 KADOKAWA/ENTERBRAIN 권별 전자판이며 각 권의 공식 trial viewer로 연결된다.
- 상품 소개문은 1~3권에서 사실상 동일한 boilerplate이므로 축 판정에는 사용하지 않았다. 실제 서로 다른 1~3권 내부 페이지를 직접 판독했다.
- preview 총 viewer 페이지와 서사 페이지를 구분했다. 표지·목차·광고는 Factor 관찰에서 제외했다.

### 공식 출처 원장

| id | sourceName | publishedAt | 판본·페이지 범위 | URL | 직접 확인 내용 |
|---|---|---|---|---|---|
| R-00 | BOOK☆WALKER `放浪息子` series page | undated | 공식 series index | https://bookwalker.jp/series/162/ | 전자 1~3권 연결과 각 권 preview 제공 여부 확인 |
| R-01 | BOOK☆WALKER `放浪息子(1)` 상품·공식 trial | 전자 2010-12-01; 저본 2003-08-06 | 19 viewer pages 중 인쇄면 pp.8~17, 서사 10쪽 | https://bookwalker.jp/de4bd52269-b4b6-43d8-a916-9cf8c2437a09/ ; https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=4bd52269-b4b6-43d8-a916-9cf8c2437a09 | 가정의 아침에서 누나와 아버지의 지지, 전학 첫날 교사의 이름·성별 오인과 사과, 새 반 안내, 吉野 옆자리와 자기소개를 확인. 갈등은 일상적 대화와 즉시 반응으로 진행 |
| R-02 | BOOK☆WALKER `放浪息子(2)` 상품·공식 trial | 전자 2010-12-01; 저본 2004-06-07 | 20 viewer pages 중 인쇄면 pp.6~18, 서사 13쪽 | https://bookwalker.jp/de446e1436-912e-4738-bba9-5916bcd3faff/ ; https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=446e1436-912e-4738-bba9-5916bcd3faff | 명절 세뱃돈과 조부모의 포옹·격려, 옷을 생각하는 修一, 새 학기 반 재편과 친구들의 반 배치·대화를 확인. 가족 지지와 당혹·긴장이 같은 entry에 공존 |
| R-03 | BOOK☆WALKER `放浪息子(3)` 상품·공식 trial | 전자 2010-12-01; 저본 2005-01-05 | 20 viewer pages 중 인쇄면 pp.6~18, 서사 13쪽 | https://bookwalker.jp/de028c9d22-530c-4728-b4d4-f45038f05b0b/ ; https://viewer-trial.bookwalker.jp/trial-page/03/view?cid=028c9d22-530c-4728-b4d4-f45038f05b0b | 방과 후 학교→전철→백화점 모델 오디션, 밤의 남매 대화, 다음날 학교 컴퓨터실의 사과·관계 조정을 확인. 누나가 여장을 한 修一도 심사해 달라고 요청하고, 이후 희망과 당혹을 대화로 다룸 |

모든 R 출처의 `retrievedAt`은 `2026-08-23`이다. 총 직접 표본은 **서로 다른 세 entry 권의 서사 36쪽**이다.

### Narrative 판정

#### `progression=U` — 기존 기각 유지

공식 preview는 자기 이해와 관계 변화가 중요함을 보이지만, 이는 이미 `characterArcWeight=4`가 포착한다. 기술·지위·자원·숙련의 반복 획득 보상은 확인되지 않았다. identity development를 progression으로 이중 계산하지 않았다.

#### `problemSolving=0` — ACCEPT

- R-01~R-03의 반복 문제는 전학·교실 상호작용, 옷에 대한 바람과 가족 관계, 오디션 제안·사과 같은 사회·감정 상황이다.
- 세 표본 모두 해결/진행은 즉시 대화, 정서적 결단, 직접 행동으로 이루어지고, 제약 분석이나 기발한 해법이 보상으로 제시되지 않는다.
- 이는 짧은 synopsis에서 분석 장면이 빠졌다는 논리가 아니라, 세 연속 권의 실제 내부 페이지에서 반복적으로 관찰한 resolution mode다.
- confidence: `0.78`.

#### `strategy=0` — ACCEPT

- R-01의 전학·교실 적응, R-02의 가족·새 학기, R-03의 즉석 오디션 요청과 후속 대화에서 장기 계획·정치·자원 운영은 전개의 중심이 아니다.
- 소풍·통학·오디션 참석 같은 통상 일정은 Dictionary의 전략/전술 anchor가 아니다. 세 권 표본의 반복 구조는 즉흥 대응 중심인 0 anchor에 맞는다.
- confidence: `0.80`.

#### `pacing=2` — ACCEPT

- R-01은 가정→전학 첫날→교실 배치, R-02는 명절 가정→새 학기 반 재편, R-03은 학교→전철→오디션→밤의 가정→다음 학교일로 장소·시간·관계 상태가 arc 단위로 변한다.
- 첫 3권 동안 변화가 거의 없는 0보다 높지만, 짧은 간격으로 목표·장소·상태가 크게 뒤집히는 4도 아니다. 일반적인 arc 변화인 2가 적합하다.
- confidence: `0.84`.

#### `mysteryReveal=0` — ACCEPT

- R-01~R-03은 각기 다른 권의 실제 opening sequence이며, 반복 보상은 학교·가족·친구 사이의 자기표현, 정서 반응, 관계 조정이다.
- 어느 표본도 단서 수집, 추리, 반전, 숨은 진실 공개를 보상 구조로 사용하지 않는다. 서로 다른 세 권에서 reward form이 일치하므로 `공식 소개가 mystery를 언급하지 않았다`는 단순 omission 판단과 구별된다.
- 샘플은 각 권 전체가 아니라 공식 공개 opening에 한정되므로 confidence는 다른 세 Narrative 값보다 낮게 둔다: `0.74`.

#### `worldBuilding=U` — 종결

학교 반 편성, 통학, 오디션 제도는 기능적 현실 배경이지만, 제한된 opening 표본만으로 배경 규칙이 반복적으로 중요하다는 2 anchor 또는 최소라는 0 anchor를 책임 있게 확정할 필요도 근거도 부족하다. coverage에 필요하지 않으므로 unknown으로 닫는다.

### Tone 판정

#### `emotionalWarmth=2` — ACCEPT

- R-01은 누나·아버지의 지지와 교사의 사과·안내를 직접 보여 준다.
- R-02는 조부모의 포옹·격려와 가족 대화를 보여 준다.
- R-03은 남매·친구 사이의 조심스러운 질문, 사과, 관계 조정을 보여 준다.
- 지지와 돌봄이 여러 관계·권차에서 반복되지만, 당혹·숨김·상처 위험도 함께 존재한다. 따라서 유대·힐링이 압도적인 4가 아니라 혼합 anchor인 2다.
- 기존의 추상적 표현 `gentle gaze`를 값의 근거로 재사용하지 않았다.
- confidence: `0.86`.

### 최종 벡터

- Narrative: **`U / 0 / 0 / 2 / 0 / U` = 4/6 — PASS**
- Tone: **`4 / 2 / U / U / 3 / 1 / 2` = 5/7 — PASS**
- `school=2`, `sliceOfLife`는 기존 판정과 충돌하지 않는다.
- 유저평은 사용하지 않았다. 이번 공식 1~3권 preview만으로 gate를 닫았으므로 독립성·entry-range가 불명확한 리뷰를 보조 근거로 끌어오지 않았다.

## 3. 경로 소진 및 blocker 판정

### 실제 시도한 미소진 경로

1. `陽だまりの樹`: 기존 V02인 小学館 공식 series route를 열어 문고 1~3권의 개별 공식 권 정보와 수록 화·줄거리·권 특징을 확인했다.
2. `放浪息子`: BOOK☆WALKER 공식 1권 19-page trial을 열고, 같은 공식 series에서 2·3권 상품과 서로 다른 trial CID를 찾아 각 viewer의 공개 페이지 전체를 확인했다.
3. BOOK☆WALKER 1~3권 상품 설명의 반복 boilerplate는 권별 Narrative 근거로 세지 않았다. 상품 HTML에서 전자 배포일과 저본 발행일만 판본 provenance로 확인했다.
4. 별도 유저평 경로는 재개하지 않았다. 기존 원장이 entry-range가 입증되지 않은 리뷰 경로를 이미 소진했고, 공식 자료로 이번 gap이 해소되었다.

### blocker 후보 여부

- `陽だまりの樹`: `SOURCE_INFORMATION_UNAVAILABLE` 후보 아님. 공식 1~3권 권별 자료가 접근 가능하고 `progression`을 직접 입증한다.
- `放浪息子`: `SOURCE_INFORMATION_UNAVAILABLE` 후보 아님. 공식 1~3권 내부 preview가 모두 접근 가능하며 Narrative 4축과 Tone 1축을 직접 판정할 수 있다.
- 두 작품 모두 `recommendationVerified` 승격의 text coverage 측면을 통과한다. 다른 독립 gate(safety, identity, ISBN, art state, independent review 등)는 이 메모의 범위 밖이며 별도로 그대로 적용해야 한다.

## 4. 임시 관찰 산출물

공식 viewer 판독을 위해 `output/playwright/pilot-text-gap-a/` 아래에 임시 screenshot과 contact sheet를 만들었다. source data 또는 증거 원장으로 커밋하면 안 된다. 보존해야 할 것은 위 공식 URL, 판본, 공개 페이지 범위, 직접 관찰뿐이다.
