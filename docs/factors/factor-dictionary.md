# 팩터 사전 (Factor Dictionary) v1

> Manga Taste Engine의 팩터 정의 단일 진실 원천. Catalog 주석(annotation)·엔진 구현·UI 레이블이 모두 이 문서를 따른다.
> 산식(가중치·감점·보정)은 `docs/planning/02-product-spec.md` §6, 데이터 타입은 같은 문서 §5 참조.
> 이 문서는 버전 관리한다. 정의 변경 시 버전을 올리고 기존 주석 데이터의 재검토 범위를 기록한다.

---

## 1. 팩터 범위 (Scope)

모든 팩터는 **초반 1~3권 또는 첫 주요 에피소드의 진입 경험**만을 기준으로 태깅한다.

```ts
type WorkFactorScope = "entry_1_3_volumes";
```

장편의 1권과 30권은 전개·톤·관계가 크게 다를 수 있다. 후반부 인상을 섞지 않는다. Phase별 팩터(`entry / middle / late / ending`)는 실제 필요가 검증된 뒤에만 확장한다.

## 2. Axis 값 체계

```ts
type ScaleValue = 0 | 1 | 2 | 3 | 4;

type AxisFactor =
  | { state: "known"; value: ScaleValue; confidence: number }
  | { state: "unknown" }
  | { state: "notApplicable" };
```

| 상태 | 의미 | 예 |
|---|---|---|
| `known` + 0 | 실제로 거의 없거나 매우 낮음 | 로맨스가 없는 작품 → `romance = known 0` |
| `unknown` | 아직 모름 / 근거 부족 | 작화 자료가 없어 타격감을 모름 → `motionImpact = unknown` |
| `notApplicable` | 조건부 하위 축을 평가할 대상 자체가 없음 | 전투가 없는 작품의 타격감 → `motionImpact = notApplicable` |

- `notApplicable`은 조건부 하위 축(§5의 표시된 축)에만 제한적으로 사용한다.
- 주석 절차: 먼저 각 축의 `0 / 2 / 4` 기준으로 판정하고, `1 / 3`은 두 기준 사이일 때만 사용한다.
- "빠르다", "어둡다" 같은 형용사 인상이 아니라 **관찰 가능한 상태·빈도·반복 구조**를 근거로 판정한다.

## 3. Genre (10종)

```ts
type GenreTag =
  | "action" | "fantasy" | "historical" | "scienceFiction" | "mystery"
  | "sports" | "comedy" | "horror" | "sliceOfLife" | "romance";
```

Rakuten `booksGenreId`는 추천 계산에 직접 넣지 않고 이 자체 Genre로 매핑한다.

## 4. Theme / Mechanic (22종)

Theme는 존재 여부가 아니라 **중심성(centrality)** 을 가진다.

```ts
type ThemeFactor = {
  id: ThemeTag;
  centrality: 1 | 2;   // 1 = 일부 에피소드·서브 소재, 2 = 작품의 반복적 핵심 구조
  confidence: number;
};

type ThemeTag =
  | "adventure" | "combat" | "martialArts" | "war" | "politics"
  | "survival" | "investigation" | "dungeon" | "crafting" | "cooking"
  | "territoryManagement" | "tournament" | "revenge" | "timeTravel"
  | "reincarnation" | "school" | "workplace" | "sportsCompetition"
  | "foundFamily" | "historicalReconstruction" | "postApocalypse" | "exploration";
```

제외 확정:

- `training` Theme는 `progression` Axis와 중복이므로 스코어링 Theme에서 제외한다(필요 시 설명용 태그 `trainingArc`로만 보존).
- `actionIntensity` Axis는 존재하지 않는다 — `combat` Theme의 centrality로 대체 확정.

## 5. 핵심 Axis 17종 — 0/2/4 기준

### 5.1 Narrative 그룹 (6)

| 팩터 | 0 | 2 | 4 |
|---|---|---|---|
| `progression` | 성장 보상 구조가 거의 없음 | 서서히 성장 | 성장·획득·숙련 보상이 반복적으로 명확함 |
| `problemSolving` | 우연·힘·감정적 결단 중심 | 지략과 직접 행동 혼합 | 제약을 분석하고 기발하게 해결하는 과정이 핵심 |
| `strategy` | 즉흥 대응 중심 | 전술·단기 계획 존재 | 장기 계획·전쟁·정치·자원 운영이 중심 |
| `pacing` | 첫 3권 동안 목표·상황 변화가 적음 | 일반적인 Arc 단위 변화 | 짧은 간격으로 목표·장소·상태가 크게 바뀜 |
| `mysteryReveal` | 수수께끼 구조가 거의 없음 | 비밀·반전이 일부 존재 | 단서·추리·진실 공개가 주요 보상 |
| `worldBuilding` | 배경 규칙이 최소 | 기능적인 설정 | 역사·문화·규칙·세력이 반복적으로 중요함 |

### 5.2 Tone / Relationship 그룹 (7)

| 팩터 | 0 | 2 | 4 |
|---|---|---|---|
| `characterArcWeight` | 사건·세계·목표 중심 | 사건과 인물 변화가 균형 | 인물 동기·변화·관계가 핵심 보상 |
| `relationshipStructure` | 단독 주인공 중심 | 고정 파티·핵심 조연 반복 | 복잡한 군상극·다중 관계 구조 |
| `comedy` | 거의 없음 | 중간중간 개그 | 개그가 상시 또는 핵심 |
| `darkness` | 밝고 가벼움 | 진지한 위험·비극 존재 | 잔혹·암울·비극적 사건이 중심 |
| `mentalStress` | 심리적 압박이 거의 없음 | 긴장과 답답함이 혼합 | 불안·고구마·심리 붕괴·압박이 지속됨 |
| `romance` | 거의 없음 | 서브 플롯 | 주요 관계와 전개의 중심 |
| `emotionalWarmth` | 차갑고 가혹한 관계 | 혼합 | 유대·힐링·따뜻함이 핵심 보상 |

`darkness`와 `mentalStress`는 반드시 분리 판정한다:

```text
어두운 세계관 + 안정적 주인공 + 개그 많음  → darkness 높음 / mentalStress 낮음
밝은 일상 배경 + 지속적 관계 갈등·불안     → darkness 낮음 / mentalStress 높음
```

### 5.3 Art 그룹 (4)

| 팩터 | 0 | 2 | 4 |
|---|---|---|---|
| `artRealism` | 강한 데포르메·단순화 | 일반적 스타일화 | 현실적인 인체·배경·비례 |
| `artDensity` | 단순하고 여백이 많음 | 균형 | 선·배경·정보 밀도가 높음 |
| `visualSoftness` | 거칠고 각진 표현 | 중립 | 부드럽고 미려한 표현 |
| `motionImpact` † | 정적·절제된 동적 표현 | 보통 | 속도감·타격감·동작 강조가 강함 |

† **조건부 축:** `motionImpact`는 전투 또는 동적 장면이 존재할 때만 평가하며(없으면 `notApplicable`), 줄거리·표지만으로 자동 확정하지 않는다.

Art는 추천·Gold-quality 승격의 선택 축이다. 이미지 분석과 복수 독립 커뮤니티 평은 동급의 대체 근거 경로이며 둘 중 하나도 없으면 네 축을 `unknown`으로 둘 수 있다. 커뮤니티 경로는 초반 평가 범위가 확인되고 같은 구체적 시각 관찰이 서로 복제되지 않은 두 출처 이상에서 반복될 때만 0/2/4 기준에 매핑한다. 단순한 “그림이 예쁘다”, “액션이 좋다”, 별점·순위는 값 근거가 아니다. 출처끼리 충돌하면 adjudication 또는 `unknown`으로 종결한다.

## 6. Axis 거리 종류 (엔진 계약)

```ts
type AxisDistanceKind = "linear" | "presenceSensitive";
```

- `presenceSensitive` (0=없음 ↔ 1이상=존재의 차이가 큰 축): **`darkness`, `mentalStress`, `romance`** — 한쪽이 0이고 다른 쪽이 >0이면 거리 ×1.5(상한 1).
- 그 외 14축은 전부 `linear` (`1 − |a−b|/4`).

## 7. 사용자 표시 레이블 (일본어)

| Axis | 표시 레이블 |
|---|---|
| `progression` | 成長・報酬の積み重ね |
| `problemSolving` | 頭脳で解決する話 |
| `strategy` | 戦略的な展開 |
| `pacing` | テンポの速さ |
| `mysteryReveal` | 謎解き・伏線 |
| `worldBuilding` | 世界観の作り込み |
| `characterArcWeight` | 人物の変化・ドラマ |
| `relationshipStructure` | 群像劇・関係の広がり |
| `comedy` | ギャグ・コメディ |
| `darkness` | ダークな世界観 |
| `mentalStress` | 精神的な重さ |
| `romance` | 恋愛要素 |
| `emotionalWarmth` | あたたかさ・癒やし |
| `artRealism` | リアル寄りの絵 |
| `artDensity` | 描き込みの密度 |
| `visualSoftness` | やわらかい絵柄 |
| `motionImpact` | 迫力・スピード感 |

Theme·Genre의 표시 레이블은 `src/lib/strings.ts`에서 이 id들을 키로 관리한다.

## 8. 주석(Annotation) 운영 원칙

### 검수 수준

```text
Anchor 작품            → 모든 핵심 팩터 수동 검수
Recommendation 작품    → 추천에 사용되는 Narrative/Tone 팩터 우선 검수
Library-only 작품      → 서지와 Work 연결만 유지 (팩터 불요)
```

### 자동 제안의 한계

- LLM·모델의 용도는 **격리된 오프라인 candidate 생성만**: 공식 소개문에서 Theme 후보 생성, Narrative/Tone 초안, 태그 누락 후보 탐지, 충돌 데이터 표시.
- 금지: 런타임 후보 생성, 최종 순위 결정, 근거 없는 특성 생성, 미확인 작품 설명 생성.
- candidate는 모델·응답 수·일치 여부와 무관하게 Catalog 사실이나 판정 권한이 아니며 `09`의 candidate-independent 비모델 resolution 없이는 추천에 쓰지 않는다.
- 기존 `authorizedModelPanel` 행은 legacy provenance로 동결하며 신규 주석의 일반 승인 경로로 재사용하지 않는다.

### 자기 취향 편향 방지

- 무작위 15~20%를 기존 점수를 숨긴 상태에서 재태깅한다.
- 두 평가가 2단계 이상 차이나면 정의 또는 데이터가 불안정한 것으로 보고 기준을 재검토한다.
- 추천 상위에 자주 등장하는 작품부터 재검수한다.
- 대표 사례·경계 사례는 `annotation-guide.md`(Stage A에서 작성)에 축적한다.

### Anchor 선정 기준 (Onboarding Catalog)

Anchor는 장르별 인기작 나열이 아니라 **강하게 대비되는 취향 판독기**여야 한다. 아래 대비 축을 커버하도록 구성한다:

```text
빠른 전개 ↔ 느린 전개 / 밝음 ↔ 어두움 / 낮은 정신적 피로 ↔ 높은 정신적 피로
전략 중심 ↔ 직접 전투 중심 / 단독 주인공 ↔ 고정 파티 ↔ 군상극
성장 보상 중심 ↔ 캐릭터·서사 중심 / 현실적 작화 ↔ 강한 스타일화
```

단, 사용자가 Anchor를 선택하지 않았다는 사실은 부정 신호가 아니다(제품 원칙 3).
