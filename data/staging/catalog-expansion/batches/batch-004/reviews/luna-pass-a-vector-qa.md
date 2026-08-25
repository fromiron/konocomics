# Batch 004 Annotation Pass A — vector QA

## 감사 범위와 판정 경계

- 감사일: 2026-08-25
- 입력: `frozen-work-set.csv`와 `annotation-pass-a/chunk-{01..05}/{factors,genres,themes}.csv`만 사용
- 감사 방식: CSV 구조·참조 무결성·분포·반복 패턴의 정적 검사
- `reviewedByHuman`: `false`
- 이 문서는 독립 검수 입력이다. 아래 경고를 자동 승격 판정이나 자동 blocker 판정으로 바꾸지 않는다.

## 구조 결과

| 항목 | 결과 |
| --- | ---: |
| frozen 작품 | 50 |
| 청크 | 5 × 10 works |
| Factor 행 | 850 = 50 × 17 |
| 축 종류 | 17 |
| 작품별 Factor 행 | 전 작품 17 |
| 장르 행 | 50 |
| Theme 행 | 52, 37 works |
| Factor 상태 | known 201, unknown 649 |
| Art 4축 | 200/200 unknown, known 0 |
| 잘못된 상태·값·confidence | 0 |
| frozen 외 workId 참조 | 0 |
| 중복 axis 행 | 0 |
| `『』` 제목 잔존 | 0 |

17개 축은 다음과 같다.

`progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `characterArcWeight`, `relationshipStructure`, `romance`, `comedy`, `darkness`, `mentalStress`, `emotionalWarmth`, `artDensity`, `artRealism`, `visualSoftness`, `motionImpact`.

Art 4축(`artDensity`, `artRealism`, `visualSoftness`, `motionImpact`)이 모두 unknown인 구조는 현재 Art preflight 정책과 일치한다. 이를 낮은 값으로 해석하지 않는다.

## 즉시 검토가 필요한 작품 단위 경고

### 장르가 비어 있음

다음 두 행은 `genres`가 빈 문자열이다.

- `work-1cdc6c5cca7c33fafe51` — 青空にとおく酒浸り
- `work-eef84d07d90ba2b040cf` — さよなら絵梨

### Theme 행이 없음

다음 13개 작품은 Theme 행이 없다. 실제로 주요 Theme가 없는 것인지, Pass A 누락인지 독립 검수가 필요하다.

- `work-025c8ab93483a39c9330` — ホストと社畜
- `work-15dba4fdb46308ab45d7` — 駅から5分
- `work-19c2017b33c07f48634e` — ふうらい姉妹
- `work-1cdc6c5cca7c33fafe51` — 青空にとおく酒浸り
- `work-62fbc6b2253b895e3a66` — 俺物語！！
- `work-741deb03d9f59e723929` — ルックバック
- `work-7d4568dcc8e9175d35ba` — 異世界おじさん
- `work-7f0f63c5d80083f2be7f` — 思い、思われ、ふり、ふられ
- `work-80a2f62ce5073ade2ec2` — 式の前日
- `work-961a49798df191311f42` — 働かないふたり
- `work-a3d922576a1a1ecc8e3e` — ドカ食いダイスキ！ もちづきさん
- `work-bd5c323a3dbc9f3a04d4` — 来世は他人がいい
- `work-d63a83030a8819ff553c` — モテキ

### 텍스트 Factor가 전부 unknown

다음 3개 작품은 13개 텍스트 축이 모두 unknown이다. Art까지 포함하면 알려진 Factor가 0개이므로 추천 coverage 계약 검토가 필요하다.

- `work-1cdc6c5cca7c33fafe51` — 青空にとおく酒浸り
- `work-3ad85a2ffdc026007d61` — 新しい上司はど天然
- `work-80a2f62ce5073ade2ec2` — 式の前日

## 벡터 반복 및 기계적 패턴 경고

벡터 비교는 Art 4축을 제외한 13개 텍스트 축의 `known:value`/`unknown` 서명을 사용했다. unknown은 값으로 간주하지 않았지만, 동일한 미확인 패턴이 반복되는지 확인하기 위해 서명에는 `U`로 표시했다.

### 완전히 동일한 텍스트 벡터

다음 4개 그룹은 텍스트 13축 서명이 완전히 같다.

- `work-188ba092c6195603bb3f` つらつらわらじ / `work-53fb816835ab36e40a1f` アンデッドアンラック / `work-c7280f9dcc2754d3f864` 鵺の陰陽師
- `work-1cdc6c5cca7c33fafe51` 青空にとおく酒浸り / `work-3ad85a2ffdc026007d61` 新しい上司はど天然 / `work-80a2f62ce5073ade2ec2` 式の前日
- `work-62fbc6b2253b895e3a66` 俺物語！！ / `work-65f856a6fa2078f21d2f` 黒月のイェルクナハト
- `work-a3d922576a1a1ecc8e3e` ドカ食いダイスキ！ もちづきさん / `work-af3443bab1c30d470a76` 坂本ですが?

정확히 같은 쌍은 8개다. 13축 중 known 축이 적은 작품이 많아 반복이 곧 오류라는 뜻은 아니지만, 각 작품 근거로 재검토해야 한다.

### 거의 동일한 텍스트 벡터

13축 Hamming distance가 1인 쌍 32개, distance가 2인 쌍 74개다. distance 0을 포함한 `distance ≤ 1` 연결요소는 다음 5개로 묶인다.

- `work-098b1781e14365eea667`, `work-65f856a6fa2078f21d2f`, `work-e2f095e08fc5e08d5a2b`, `work-62fbc6b2253b895e3a66`
- `work-0f3a44f5dcab9623d1be`, `work-f8cb26831612e0c6ece5`, `work-132ce7172750a3b1fa53`
- `work-188ba092c6195603bb3f`, `work-c7280f9dcc2754d3f864`, `work-925f371723beac5227f7`, `work-3713ab561de583d709bc`, `work-1a6ad6771865b43c8516`, `work-53fb816835ab36e40a1f`
- `work-19c2017b33c07f48634e`, `work-af3443bab1c30d470a76`, `work-80a2f62ce5073ade2ec2`, `work-7c8931bc010e2f28f7ec`, `work-2c4fe00df5255fc082f9`, `work-3ad85a2ffdc026007d61`, `work-1cdc6c5cca7c33fafe51`, `work-a3d922576a1a1ecc8e3e`, `work-961a49798df191311f42`
- `work-aa85b65d02f367e76a07`, `work-c2f3864045578cebb590`, `work-c5c2695ad33fd05af945`

이 경고는 sparse known coverage의 결과일 수 있으므로, 독립 검수에서 근거 없는 값 복사인지 작품별로 확인한다.

### Theme 세트 반복

빈 세트를 제외한 exact theme-set도 반복된다.

- `school`: `work-098b1781e14365eea667`, `work-2356050c72240569e1c5`, `work-2f1d1c3ad0f943f1562f`, `work-634f34830600e07d8f17`, `work-7c8931bc010e2f28f7ec`, `work-af3443bab1c30d470a76`, `work-c2df32661c0b925ff74f`, `work-c2f3864045578cebb590`, `work-c5c2695ad33fd05af945`, `work-e2f095e08fc5e08d5a2b`, `work-fc53cb5669aa4099ee4a`
- `foundFamily`: `work-11d23966f22f777e95d0`, `work-23077ad33a2066bef5a6`
- `combat`: `work-132ce7172750a3b1fa53`, `work-2d385ad0525742330e70`, `work-53fb816835ab36e40a1f`, `work-65f856a6fa2078f21d2f`
- `workplace`: `work-1a6ad6771865b43c8516`, `work-3713ab561de583d709bc`, `work-3ad85a2ffdc026007d61`, `work-8733067e6afcaeadbd8d`, `work-9bd00739b995d84e2494`
- `combat;school`: `work-2df743e085adef5e9bd3`, `work-c7280f9dcc2754d3f864`, `work-fd2a957c501c36047ed0`

추가로 빈 Theme 세트가 13개다. Theme 세트가 작품별 근거에서 나온 것인지, 장르·작업 순서에 의해 복사된 것인지 검수한다.

### 장르 → Axis 기계적 매핑 의심

다음은 해당 장르가 있는 작품 중 해당 축이 known인 행의 값이 모두 같은 패턴이다. 아래 workId는 재검수 대상이며, 자동 수정하지 않는다.

- `action` → `relationshipStructure=2` 8/8: `work-132ce7172750a3b1fa53`, `work-2d385ad0525742330e70`, `work-2df743e085adef5e9bd3`, `work-53fb816835ab36e40a1f`, `work-65f856a6fa2078f21d2f`, `work-c7280f9dcc2754d3f864`, `work-f8cb26831612e0c6ece5`, `work-fd2a957c501c36047ed0`
- `action` → `worldBuilding=2` 8/8: `work-132ce7172750a3b1fa53`, `work-2c4fe00df5255fc082f9`, `work-2d385ad0525742330e70`, `work-2df743e085adef5e9bd3`, `work-53fb816835ab36e40a1f`, `work-c7280f9dcc2754d3f864`, `work-f8cb26831612e0c6ece5`, `work-fd2a957c501c36047ed0`
- `fantasy` → `worldBuilding=2` 7/7: `work-2f1d1c3ad0f943f1562f`, `work-53fb816835ab36e40a1f`, `work-7d4568dcc8e9175d35ba`, `work-925f371723beac5227f7`, `work-c7280f9dcc2754d3f864`, `work-f8cb26831612e0c6ece5`, `work-fd2a957c501c36047ed0`
- `historical` → `mysteryReveal=2` 2/2: `work-0f3a44f5dcab9623d1be`, `work-44d0000353478596369e`
- `mystery` → `mysteryReveal=2` 및 `problemSolving=2` 각각 2/2: `work-0f3a44f5dcab9623d1be`, `work-f8cb26831612e0c6ece5`
- `sliceOfLife` → `pacing=2` 11/11: `work-11d23966f22f777e95d0`, `work-15dba4fdb46308ab45d7`, `work-39c1a2b6791238827ed5`, `work-634f34830600e07d8f17`, `work-7d4568dcc8e9175d35ba`, `work-7f0f63c5d80083f2be7f`, `work-8733067e6afcaeadbd8d`, `work-c2f3864045578cebb590`, `work-c5c2695ad33fd05af945`, `work-fc53cb5669aa4099ee4a`, `work-ff9b025f58d7e12f3cb1`
- `sliceOfLife` → `progression=2` 4/4: `work-2f1d1c3ad0f943f1562f`, `work-634f34830600e07d8f17`, `work-c2f3864045578cebb590`, `work-c5c2695ad33fd05af945`
- `sliceOfLife` → `worldBuilding=2` 10/10: `work-11d23966f22f777e95d0`, `work-15dba4fdb46308ab45d7`, `work-1a6ad6771865b43c8516`, `work-23077ad33a2066bef5a6`, `work-2f1d1c3ad0f943f1562f`, `work-3713ab561de583d709bc`, `work-39c1a2b6791238827ed5`, `work-7d4568dcc8e9175d35ba`, `work-8733067e6afcaeadbd8d`, `work-925f371723beac5227f7`
- `sliceOfLife` → `mentalStress=2` 4/4: `work-7f0f63c5d80083f2be7f`, `work-9bd00739b995d84e2494`, `work-e81955a9fc5c4d84580f`, `work-fc53cb5669aa4099ee4a`

`romance`의 `romance=4`는 known 12개 중 9개(75%)로, 동일한 의심 패턴으로 검수한다.

## 값 분포와 극단값

known 201개 값의 분포는 `1=5`, `2=143 (71.1%)`, `3=30`, `4=23`이다. 특히 `pacing`은 28 known 중 25가 2(89.3%), `worldBuilding`은 21 중 20이 2(95.2%), `progression`은 7 중 7이 2, `problemSolving`은 3 중 3이 2, `mysteryReveal`은 4 중 4가 2다. 중간값이 낮은 confidence를 숨기는 방식인지 독립 검수에서 확인한다.

known confidence가 0.75 미만인 행은 34개다. 모두 0.70~0.74 범위이며, 자동으로 unknown으로 바꾸지는 않지만 우선 검수 대상으로 표시한다.

값 1은 5행이다: `work-741deb03d9f59e723929`(relationshipStructure), `work-9bd00739b995d84e2494`(romance), `work-c2df32661c0b925ff74f`(relationshipStructure), `work-d8a87d01c1f35d58e791`(relationshipStructure), `work-eef84d07d90ba2b040cf`(relationshipStructure).

값 4는 23행이다. 작품 단위로는 `work-098b1781e14365eea667`, `work-15dba4fdb46308ab45d7`, `work-19c2017b33c07f48634e`, `work-1a6ad6771865b43c8516`, `work-2d385ad0525742330e70`, `work-62fbc6b2253b895e3a66`, `work-634f34830600e07d8f17`, `work-65f856a6fa2078f21d2f`, `work-741deb03d9f59e723929`, `work-7f0f63c5d80083f2be7f`, `work-a3d922576a1a1ecc8e3e`, `work-af3443bab1c30d470a76`, `work-bd5c323a3dbc9f3a04d4`, `work-c2f3864045578cebb590`, `work-c5c2695ad33fd05af945`, `work-e2f095e08fc5e08d5a2b`, `work-eef84d07d90ba2b040cf`, `work-f8cb26831612e0c6ece5`, `work-fc53cb5669aa4099ee4a`에서 관찰된다. 값 0은 없다.

## Evidence ID 무결성

- 모든 Factor 행과 Theme 행에 evidenceId가 있다.
- 모든 evidenceId가 동일 작품의 `ev-batch-004-a-<workId>` 패턴과 일치한다.
- 작품 간 evidenceId 교차 재사용 0건, 오연결 0건이다.
- 작품 내부에서는 동일 evidenceId가 17개 Factor 행에 반복되고, Theme가 있는 작품에서는 Theme 행에도 반복된다. 이는 현재 Pass A CSV의 작품 단위 Evidence 참조 형태로 보이며, 축별 근거가 실제로 직접 대응하는지는 Pass B에서 확인해야 한다.

## 결론

행·축·workId·Art unknown·Evidence 참조의 구조적 무결성은 통과했다. 다만 빈 장르 2개, Theme 누락 13개, 텍스트 Factor 전부 unknown 3개, exact/near-identical vector 반복, exact Theme 세트 반복, 장르와 동일한 축 값의 반복, 값 2 및 low-confidence known 편중은 독립 검수에서 반드시 확인해야 할 경고다. 이 보고서만으로 작품을 승격하거나 blocker로 확정하지 않는다.
