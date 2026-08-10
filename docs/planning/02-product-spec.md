# 02 — 제품 사양 (Product Spec)

> konocomics의 **확정 제품 사양**이다. (초안 기획서는 감사 후 폐기되었고, 그 delta 기록은 `00-plan-audit.md`·`01-decision-ledger.md`에 있다.)
> 추천 산식은 이 문서 §6이, 팩터 정의는 `docs/factors/factor-dictionary.md`가 단일 진실 원천(single source of truth)이다.

---

## 1. 제품 테제

**konocomics**는 사용자가 좋아하거나 싫어한 만화로부터 장르가 아니라 **전개·문제 해결·전략·관계·톤·심리적 피로도·작화 성향**을 추론하고, 아직 읽지 않은 만화를 **왜 추천했는지 설명하면서** 제시하는 개인 만화 취향 서비스다.

- 사용자 노출 제품명: **konocomics** / 로고: **kono**co**mi**cs / 일본어: コノコミックス
- 내부 엔진명: Manga Taste Engine / 대표 기능명: **Manga DNA**
- 브랜드 기믹: `kono + mi = konomi = 好み`. 로고 안에 숨은 단어 = 작품 안에 숨은 취향.

### 대상 사용자

일본 만화 다독자. 인기순 추천에서 이미 읽은 작품만 반복되고, 장르 필터로는 부족하며, 추천 이유의 납득을 원하는 사람. Phase 1 UI 언어는 일본어.

### 검증 가설 (확정 요구사항이 아님 — 블라인드 테스트 대상)

- **A. 세부 취향 추천의 가치** — 장르+인기 Baseline보다 세부 요소 기반 추천이 더 가치 있다.
- **B. 설명의 신뢰 효과** — "93% 일치"보다 어떤 작품·요소가 비슷한지의 설명이 신뢰를 만든다.
- **C. 피드백의 누적 가치** — 초기 추천이 맞으면 사용자는 추가 입력 의향이 있다.
- **D. Discovery 가치** — 몰랐던 작품의 발견이 유명작 재노출보다 강한 가치다.
- **E. 취향 분석의 콘텐츠성** — Manga DNA 확인·보정 자체가 재미있는 결과물이다.

### 제품 원칙 (확정 — 모든 구현 판단의 상위 규칙)

1. 취향 적합도와 시장 인기도를 분리한다. 시장 신호는 tie-break로만 쓴다.
2. 데이터 없음(unknown)을 낮은 취향값으로 해석하지 않는다.
3. 작품을 선택하지 않았다는 사실을 불호로 해석하지 않는다.
4. 읽기 상태(readingState)와 감상(reaction)을 분리한다.
5. 명시적 불호와 데이터 불확실성을 분리한다.
6. 추천 설명은 실제 점수 기여 요소에서만 생성한다.
7. 런타임 LLM이 후보·순위를 결정하지 않는다.
8. 다중 취향을 하나의 평균 벡터로 뭉개지 않는다 (Best Anchor).
9. 팩터는 초반 1~3권 진입 경험만 기준으로 태깅한다.
10. 데이터가 부족한 작품을 높은 확신으로 추천하지 않는다.
11. MVP 투자는 인프라가 아니라 Catalog와 추천 정확도에 집중한다.
12. 확신도(Confidence)는 확률 숫자가 아니라 단계 레이블로 표시한다.

---

## 2. MVP 범위

### 포함

- 온보딩: 좋아한 작품 선택(5~10개) + 선택적 불호 작품(0~3개, 이유 포함)
- Manga DNA 생성·reveal·인라인 보정 (매우 선호/선호/자동/덜 추천/제외)
- 설명 가능한 추천 10개 (이유 최대 3 + 주의점 1 + 근거 Anchor)
- 추천 피드백: 읽고 싶음 / 이미 읽음 / 관심 없음(+이유)
- Library: 읽음 상태 5종 × 감상 4종 관리, Catalog 외 작품은 라쿠텐 검색으로 external entry 추가
- 작품 상세: 표지(고해상도), 블러 배경, 추천 근거, 라쿠텐 구매 링크
- 추천 정책 3종: 완결작 우선 / 숨은 작품 우선 / 검증된 작품 우선
- 로컬 데이터 Export / Import (v1 스키마) / 전체 삭제
- 반응형 웹 + 설치 가능한 PWA(manifest 우선, 오프라인 셸은 폴리시 단계)

### 제외 (Non-goals)

계정·서버 사용자 데이터 / 실시간 LLM / Vector DB / Collaborative Filtering / 커뮤니티 기능 / 리뷰 수집 크롤러 / 결제·광고 / 네이티브 앱 / 자체 뷰어 / 검색 서버 / **현재 Mood 모드(DEFER)** / **NDL 연동(DEFER)** / 분석 SDK(DEFER) / 한국어 UI(Phase 2).

### Catalog 범위

- 우선 장르: 액션·판타지·역사·SF·미스터리 / 인접: 코미디·무술·호러·일상·로맨스·스포츠
- 규모: sanity check 50 → 블라인드 테스트·공개 MVP 150 (Anchor 30~40 / Bridge 30~40 / Discovery 70+)
- 역할 분리: `onboardingEligible` / `recommendationEligible` / `libraryOnly`
- Anchor는 취향 판독기 역할(대비 축 커버)이어야 하며 단순 인기작 나열이 아니다.

---

## 3. 최종 사용자 흐름

```text
[신규]
/               랜딩. konomi 로고 reveal + 제품 설명 + CTA「好きなマンガから始める」
/onboarding     STEP 1  좋아한 작품 5~10개 선택 (검색 + 장르 Shelf)
                STEP 2  (선택) 싫어했거나 하차한 작품 0~3개 + 이유 선택
/taste?reveal=1 STEP 3  Manga DNA reveal → 인라인 보정 → CTA「おすすめを見る」
/recommendations 추천 10개 + 이유. 카드 액션: 読みたい / 読んだ / 興味なし(+이유)
/works/[id]     상세: 표지·블러 배경·DNA 대조·추천 근거·라쿠텐 링크
/library        읽음 상태·감상 관리, 외부 작품 추가
/settings       추천 정책, Export/Import, 전체 삭제, 크레딧

[재방문]
/ → 프로필 존재 시 /recommendations로 클라이언트 리다이렉트
온보딩 중단 시 → 진행 상태가 Dexie에 남아 이어서 진행
```

피드백 루프: 추천 카드에서 `読んだ`/`興味なし` 입력 → 해당 작품은 후보에서 제거되고 즉시 다음 순위로 백필 → 감상·이유는 Library에 축적 → 프로필 입력 변경 시 다음 추천 계산에 반영.

**추천 재계산 계약:** 추천 목록은 `(프로필 입력 해시)`가 마지막 계산 시점과 다를 때만 페이지 진입 시 재계산한다. 같은 입력이면 동일한 목록을 유지한다(결정론). 카드 개별 제거는 재계산이 아니라 백필이다.

---

## 4. Manga DNA 경험

- 사용자가 보는 것: 그룹(장르/테마/전개/톤·관계/작화)별 섹션 아래 **가로 막대(0~4)** 와 일본어 레이블. 상위 취향 3개는 상단에 konomi 강조 색으로 요약.
- 각 상위 취향에는 근거 Anchor 표지 칩("『ダンジョン飯』『キングダム』から")을 붙인다 — 원칙 6의 시각화.
- **미확인 정직성:** 데이터가 부족한 축은 빈(윤곽선) 막대 + 「まだ分析中」로 표시한다. 0으로 그리지 않는다.
- 인라인 보정: 각 축·테마에 5단계 칩 `とても好き / 好き / 自動 / 控えめに / 除外`. 내부 수치 슬라이더는 노출하지 않는다.
- 보정은 자동 학습을 덮어쓰지 않고 §6.6의 제한적 보정으로만 작동한다. `除外`만 절대 조건(Hard Exclusion)이다.
- DNA reveal 애니메이션은 온보딩 완료 시 1회 (`04-visual-interaction-spec.md` §5.2).

사용자 표시용 축 → 표시 언어 매핑(대표 예): `strategy→戦略的な展開`, `pacing→テンポの速さ`, `mentalStress→精神的な重さ`, `problemSolving→頭脳で解決する話`, `relationshipStructure→群像劇・関係の広がり`, `artRealism→リアル寄りの絵`. 전체 매핑은 팩터 사전(`docs/factors/factor-dictionary.md`)에서 관리한다.

---

## 5. 데이터 모델 (도메인 확정분)

### 5.1 원칙

- **ISBN은 작품 ID가 아니다.** 『キングダム』 1~3권은 서로 다른 ISBN이지만 추천에서는 하나의 `Work`다. MVP 계층은 `Work / Volume / ProviderListing` 셋뿐이며, 판형(완전판·문고판 등) 문제로 실제 오류가 발생한 뒤에만 별도 `Edition` 계층을 추가한다.
- **원본 응답과 자체 데이터의 물리적 분리:** Work Taste Metadata(자체 정의·검수, 영구) / ProviderListing(라쿠텐 취득, 갱신 가능) / providerCache(TTL 캐시). 라쿠텐 응답을 영구 canonical DB로 복제하지 않는다.
- 공개 Catalog에는 최종 값과 최소 confidence만 포함하고, 상세 근거(evidence)는 빌드용 `data/source/`에만 보존한다.

### 5.2 핵심 타입 (확정)

```ts
type Work = {
  id: string;
  title: string;
  titleKana?: string;
  aliases: string[];
  creators: string[];
  publisher?: string;
  demographic?: "shonen" | "seinen" | "shojo" | "josei" | "children" | "general" | "unknown";
  status: "ongoing" | "completed" | "hiatus" | "unknown";
  firstPublishedYear?: number;
  genres: GenreTag[];
  themes: ThemeFactor[];       // { id, centrality: 1|2, confidence }
  axes: WorkAxes;              // 17개 AxisFactor — 정의는 팩터 사전
  factorScope: "entry_1_3_volumes";
  eligibility: CatalogEligibility;
  evidence: WorkEvidence;
};
// demographic·firstPublishedYear는 핵심 Similarity 그룹에 넣지 않고
// 약한 사용자 정책 또는 필터로만 사용한다.

type Volume = {
  id: string;
  workId: string;
  volumeNumber?: number;
  isbn: string;
  releaseDate?: string;
  editionKind: "standard" | "digital" | "bunko" | "complete" | "limited" | "set" | "unknown";
};

type CatalogEligibility = {
  onboardingEligible: boolean;
  recommendationEligible: boolean;
  libraryOnly: boolean;
};

type ProviderListing = {
  workId: string;
  provider: "rakuten";
  isbn: string;
  imageUrl?: string;
  itemUrl?: string;
  affiliateUrl?: string;
  chirayomiUrl?: string;
  itemPrice?: number;
  availability?: number;
  reviewAverage?: number;
  reviewCount?: number;
  fetchedAt: string;
  expiresAt: string;
};

type FactorEvidence = {
  sourceType: "rakuten" | "publisher" | "manual" | "model";  // ndl은 DEFER
  sourceUrl?: string;
  fetchedAt: string;
  extractorVersion?: string;
  reviewedByHuman: boolean;
  confidence: number;
};

type WorkEvidence = {
  metadataConfidence: number;
  groupingConfidence: number;
  sourceAgreement: number;
  annotationReviewedAt?: string;
};

// 읽기 상태와 감상을 하나의 enum에 섞지 않는다 (원칙 4).
// 표현 예: 완독+최애 / 읽는 중+좋음 / 완독+별로 / 하차+초반은 좋았음
type UserWorkRecord = {
  workId: string;
  readingState: "planned" | "reading" | "completed" | "dropped" | "hidden";
  reaction?: "favorite" | "liked" | "neutral" | "disliked";
  progress?: { volume?: number; chapter?: number };
  positiveReasons?: string[];
  negativeReasons?: NegativeReason[];   // §6.7 enum
  droppedReasons?: NegativeReason[];
  updatedAt: string;
};
```

### 5.3 추가 확정 타입

```ts
// Catalog 외 작품의 Library 기록 (추천·DNA 계산에 절대 사용하지 않음)
type ExternalWorkRecord = {
  id: string;                 // "ext:" + normalizedKey
  normalizedKey: string;      // NFKC(title 권수 제거) + "::" + first author
  title: string;
  creators: string[];
  isbnSamples: string[];      // 확인된 권 ISBN들
  coverUrl?: string;
  record: UserWorkRecord;     // workId 대신 이 id를 가리킴
};

// 온보딩 진행 상태 (중단·재개용)
type OnboardingDraft = {
  step: 1 | 2;
  likedWorkIds: string[];     // reaction 포함해 확정 전 임시 보관
  dislikedEntries: { workId: string; reasons: NegativeReason[] }[];
  updatedAt: string;
};
```

### 5.4 팩터 정의

Genre 10종, Theme 22종(centrality 1|2), Axis 17종(Narrative 6 / Tone·Relationship 7 / Art 4)의 전체 목록·0/2/4 판정 기준·`known/unknown/notApplicable` 의미·거리 종류·일본어 표시 레이블은 **`docs/factors/factor-dictionary.md`가 확정 정의**한다. `training` Theme 제외, `actionIntensity` Axis 제거(→`combat` centrality) 확정 포함.

---

## 6. 추천 산식 (단일 진실 원천)

### 6.1 파이프라인 순서

```text
1. Hard Exclusion (사용자 除外 조건, 미완결 제외 정책 등)
2. Eligibility 필터 (recommendationEligible, 읽음/하차/숨김/興味なし 제외)
3. 그룹별 Work Similarity (Weighted Jaccard + Axis 거리)
4. Coverage 미달 그룹만 중립(0.5) 수축
5. Best Positive Anchor 점수 + Consensus Bonus (≤ +0.05)
6. 명시적 보정 explicitAdjustment (±0.12 cap) + Theme soft exclusion
7. 사유별 Factor Penalty (합계 ≤ 0.25)
8. Vague Dislike Shape Penalty (maxSim × 0.08)
9. 완결 우선 정책 감점 → clamp(0, 1) → rawTasteScore
10. 정렬: 반올림된 tasteScore를 0.025 leader cohort로 분리한 뒤 cohort 안에서 tie-break
11. 리스트 제약 적용 후 상위 10개 확정
```

### 6.2 유사도

- Tag(Genre/Theme): Weighted Jaccard. Genre tag weight는 1, Theme는 각 작품의 centrality(1/2)를 가중치로 하며 tag별 교집합은 `min`, 합집합은 `max`다. Theme confidence는 similarity에 다시 곱하지 않고 Work confidence에서 사용한다.
- Axis: `1 − |a−b|/4`. `darkness / mentalStress / romance`는 presence-sensitive — 한쪽이 0이고 다른 쪽이 >0이면 거리 ×1.5 (상한 1).
- v1의 17개 `baseAxisWeight`는 모두 1이다. 팩터별 유효 가중치는 `1 × min(anchorConfidence, candidateConfidence)`이며 그룹 안에서만 정규화한다.
- Axis pair에서 한쪽이라도 notApplicable이면 기대 분모에서 제외한다. 그 외 pair는 기대 개수에 포함하고 양쪽 모두 known일 때만 관측 개수와 score에 포함한다. `coverage=observedCount/expectedCount`; 기대 개수 0이면 coverage 0이다. 관측 유효 가중치 합이 0이면 raw score는 0.5지만 known count coverage는 유지한다(known을 다시 unknown처럼 이중 처리하지 않음).
- Tag group은 양쪽 배열이 모두 비어 있지 않을 때 coverage 1, 한쪽이라도 비면 coverage 0이다. 합집합이 비면 raw score 0.5다. 한쪽만 비면 raw Jaccard는 0이지만 coverage 0으로 최종 0.5에 수축한다. 양쪽 그룹 주석이 있을 때만 개별 tag 부재를 known absence로 본다.
- 그룹 비중 고정: Genre 15% / Theme 25% / Narrative 25% / Tone·Relationship 20% / Art 15%.
- Coverage 임계: Genre 0.80 / Theme 0.60 / Narrative 0.60 / Tone 0.60 / Art 0.30. 미달 그룹만 `0.5 + (score−0.5) × min(1, coverage/threshold)`. **가중치 재분배 금지.**

### 6.3 Positive Anchor

```ts
weight = { favorite: 1.0, liked: 0.8 };            // neutral·disliked는 positive anchor 아님
anchorMatch = workSimilarity(candidate, anchor) * weight[reaction];
bestMatch   = max(anchorMatches);
// 같은 취향군: bestAnchor와 workSimilarity ≥ 0.65인 다른 positive anchor
supporterMatch = workSimilarity(candidate, supporter) * weight[supporter.reaction];
support        = average(supporterMatches.sort(desc, workIdAsc).slice(0, 2));
consensusBonus = max(0, support − 0.5) * 0.1;      // 실질 상한 ≈ +0.05
positiveAnchorScore = clamp(bestMatch + consensusBonus, 0, 1);
```

- positive anchor가 없으면 추천 배열은 비어 있다.
- best anchor 완전 동률은 `workId` 오름차순으로 결정한다. `anchorMatch` 최댓값과 supporter 정렬의 수치 동률은 §6.4의 부동소수점 비교 계약을 따른다.
- supporter가 0개면 support 0.5(보너스 0), 1개면 그 한 값의 평균이다. bonus는 계산 후 0.05에서 명시적으로 cap한다.

### 6.4 시장 신호 (tie-break 전용)

- `bayesianRating = (n·avg + 20·catalogAvg) / (n + 20)` — 1권 리뷰 기준, priorCount 20에서 시작.
- `maturity = min(1, log1p(volumeCount) / log1p(15))` — "검증된 작품 우선" 정책 선택 시에만 tie-break 우선순위 상승.
- 리뷰가 없으면 `n=0`으로 Bayesian 결과는 catalog average다. 결측 reviewCount는 0, 결측 정적 volumeCount는 0이다.

근접 동률은 pairwise comparator를 쓰지 않는다. 최종 tasteScore를 소수 12자리로 반올림해 내림차순 정렬하고, 아직 cohort에 들지 않은 첫 작품을 leader로 삼아 leader와 차가 `<0.025`인 연속 작품을 같은 cohort로 묶는다. 정확히 0.025 차이면 새 cohort다.

- 기본 cohort tuple: `recommendationConfidence desc → bayesianRating desc → workId asc` (maturity 미사용).
- 검증된 작품 우선: `bayesianRating desc → maturity desc → recommendationConfidence desc → workId asc`.
- 숨은 작품 우선: `isPopular=false`를 위 tuple 맨 앞에 둔다. 검증 정책도 함께 켜졌으면 `isPopular asc → bayesianRating desc → maturity desc → recommendationConfidence desc → workId asc`.

`maturity`의 기본 미사용은 이 절의 “검증된 작품 우선에서만”이 §6.1의 축약을 구체화한 것이며 `07` §2-12가 경계를 검증한다.

부동소수점 비교 계약:

- `tol(a,b) = 4 × Number.EPSILON × max(1, |a|, |b|)`로 정의한다. raw similarity threshold `0.65`·`0.75`·`0.7`은 `value`가 threshold보다 작더라도 차이가 `tol(value, threshold)` 이하면 경계값을 충족한 것으로 본다. `0.025` taste cohort, Discovery `0.10`, coverage·표시 confidence 등 나머지 threshold에는 이 tolerance를 확장하지 않고 각 절의 반올림·exact 계약을 따른다.
- best anchor, supporter, vague source 및 cohort 내부 numeric tuple key는 raw 값 내림차순으로 먼저 정렬한다. 아직 묶이지 않은 최고값을 leader로 삼고 leader와의 차이가 tolerance 이내인 연속 항목만 같은 수치 동률 cohort로 묶는다. pairwise fuzzy comparator는 사용하지 않는다.
- numeric tuple은 key마다 위 leader cohort를 재귀 적용하고, 모든 key가 동률일 때만 `workId` 오름차순으로 결정한다. `isPopular` 같은 boolean key는 tolerance 없이 정확히 분리한다.
- 정렬·최댓값·threshold 선택에 쓰는 confidence·Bayesian·maturity·anchor·penalty 값은 q12로 조기 반올림하지 않는다. tasteScore cohort는 위 규칙대로 q12를 사용하고, contribution과 공개 숫자는 §6.9의 최종 출력 경계에서 q12로 만든다.

### 6.5 Confidence

```ts
profileConfidence = min(anchorCount/8, 1) * 0.8 + min(reasonedNegativeCount/2, 1) * 0.2;
workConfidence    = avgFactorConfidence * 0.6 + groupingConfidence * 0.2 + sourceAgreement * 0.2;
recommendationConfidence = sqrt(profileConfidence * workConfidence);
```

- `anchorCount`: distinct favorite/liked 작품 수.
- `reasonedNegativeCount`: vague/external 이외 factor-backed reason이 1개 이상인 distinct 불호 작품 수.
- `avgFactorConfidence`: 모든 known Axis confidence + 존재하는 Theme confidence의 산술 평균. unknown/notApplicable은 분모 제외, 값이 하나도 없으면 0.

표시: 숫자가 아니라 3단계 레이블. `≥0.75 → 高い`, `0.5~0.75 → ふつう`, `<0.5 → 低め(データ収集中)`.

### 6.6 명시적 보정 (확정 수치 — 기존 미정의 항)

DNA 보정 칩이 만드는 `explicitAdjustment`:

```ts
// Axis 설정: strength = とても好き +0.06 / 好き +0.03 / 控えめに −0.06
// (自動 = 0, 除外 = Hard Exclusion으로 별도 처리)
axisAdj(candidateValue: ScaleValue, strength: number) =
  strength * (candidateValue / 4 - 0.5) * 2;
  // value 4 → +strength, value 2 → 0, value 0 → −strength
  // unknown/notApplicable → 0 (원칙 2)

// Theme 설정: centrality 2 → ±strength, centrality 1 → ±strength/2, 없음 → −strength*0.5는 적용하지 않음(부재≠불호)
themeAdj = has(theme) ? strength * (centrality === 2 ? 1 : 0.5) : 0;

explicitAdjustment = clamp(sum(axisAdj) + sum(themeAdj), -0.12, +0.12);
```

`除外` 처리: Axis는 후보의 해당 값 ≥ 3이면 Hard Exclusion, Theme은 centrality 2이면 Hard Exclusion. Axis 값 0~2에는 soft penalty가 없다. Theme centrality 1은 explicit adjustment clamp 뒤 별도 `softExclusionPenalty=-0.10`이며 reasoned factor penalty cap에 넣지 않는다.

### 6.7 부정 사유 어휘 (확정 12종 + 외부 사유)

UI·엔진·설명이 공유하는 고정 enum. 각 사유는 "후보가 조건을 만족할 때만" 감점한다. 기본 감점 0.10, 합계 cap 0.25.

| id | 일본어 레이블 | 감점 조건 (candidate) | 비고 |
|---|---|---|---|
| `tooSlow` | 展開が遅い | `pacing ≤ 1` | 감점 0.12 |
| `tooRepetitiveProgression` | 強くなるだけの繰り返し | `progression = 4` かつ `problemSolving ≤ 1` | |
| `tooDark` | 暗すぎる・残酷 | `darkness ≥ 3` | |
| `tooStressful` | 精神的にしんどい | `mentalStress ≥ 3` | |
| `tooMuchRomance` | 恋愛の比重が高い | `romance ≥ 3` | |
| `tooMuchComedy` | ギャグが多すぎる | `comedy ≥ 3` | |
| `notEnoughSeriousness` | 軽すぎる・緊張感がない | `darkness ≤ 1` かつ `mentalStress ≤ 1` | |
| `tooComplex` | 設定・人間関係が複雑 | `worldBuilding = 4` または `relationshipStructure = 4` | |
| `artStyleDislike` | 絵が合わない | Art 그룹 유사도(대상 작품과) ≥ 0.75 | 약한 감점 0.08 |
| `genericStory` | ありきたりな展開 | 같은 불호 작품에 대해 bestAnchor↔불호와 candidate↔불호 Theme 유사도가 모두 ≥ 0.7 | 감점 0.08 |
| `powerInflation` | インフレ・強さの破綻 | `progression = 4` | 감점 0.08 |
| `vagueDislike` | なんとなく合わなかった | 작품 전체 유사도 기반 | `maxSim × 0.08` (§6.1-8) |
| `external:*` | 休載・時間がない・配信終了 등 | **감점 없음** | 기록만 |

unknown인 팩터는 감점 조건 판정에서 제외한다(원칙 2). 조건·수치는 Phase 1 sanity check에서 조정될 수 있으며, 조정 시 이 표를 갱신한다.

집계 계약:

- `external:*`은 계산에서 제거한다. factor-backed reason id는 여러 record에 반복되어도 전역 1회만 적용한다.
- `artStyleDislike`와 `genericStory`의 threshold는 coverage shrink가 적용된 group score다. 여러 source 작품 중 조건을 만족하는 최댓값으로 1회 적용한다.
- reasoned raw 합이 0.25를 넘으면 각 nominal penalty에 `0.25/rawTotal`을 곱해 비례 축소한다. 표 순서는 출력 안정화에만 쓰며 금액 우선권을 만들지 않는다.
- vague는 이유 미선택이 `vagueDislike` 단독으로 정규화된 record만 사용한다. factor-backed 또는 external reason과 함께 있으면 적용하지 않는다. 남은 vague 작품과 후보의 전체 similarity 최댓값 ×0.08을 factor cap 밖에서 1회 적용한다(동률 source는 workId 오름차순).
- `0.75`·`0.7` threshold와 vague 최댓값 동률은 §6.4의 부동소수점 비교 계약을 따른다.
- `penaltiesApplied`는 실제 적용액이 0보다 큰 factor-backed reason과 vague만 `NegativeReasonId[]`로 담는다. external, Theme soft exclusion, completed policy는 넣지 않으며 이 표 순서로 정렬한다.

### 6.8 추천 리스트 제약

```text
동일 best Anchor 기반         최대 4
동일 주요 Theme 조합          최대 3
동일 시리즈·직접 속편         최대 1
Discovery 슬롯               1~2 (top score − 0.10 이내에서만)
```

추천 정책 반영: `완결작 우선` = status≠completed 후보 −0.05 (제외 아님) / `숨은 작품 우선` = Discovery 슬롯 2~4로 확대 + reviewCount 상위 20% 후보 tie-break 강등 / `검증된 작품 우선` = tie-break에서 bayesianRating·maturity 우선.

정적 추천 제약 metadata는 확정 `Work` 타입을 늘리지 않고 별도 build input으로 둔다.

```ts
type RecommendationConstraintMetadata = {
  workId: string;
  catalogRole: "anchor" | "bridge" | "discovery";
  seriesGroupId?: string;
  volumeCount: number;
};

type RecommendationWorkMarketSignal = {
  workId: string;
  reviewAverage?: number;
  reviewCount?: number;
};
```

- 주요 Theme 조합 key는 centrality 2 Theme id 정렬 결합이며, 없으면 `none:{workId}`다. series/direct sequel key는 `seriesGroupId ?? workId`, Discovery는 `catalogRole=discovery`다.
- metadata 결측 fallback은 단위 픽스처에서만 bridge/고유 series/volumeCount 0/reviewCount 0이다. 50/150작품 gate에서는 추천 작품의 정적 metadata 누락이 validation failure다.
- review average/catalog average는 0~5 유한수, count류는 0 이상 정수로 경계 검증한다.
- 정적 metadata와 market snapshot은 catalog와 함께 빌드되는 불변 context다. version 필드를 제외한 catalog+정규화 context로 digest를 계산해 catalog와 snapshot 양쪽에 같은 `catalogVersion`을 기록하고, 입력 경계에서 일치를 검증한다.

리스트 선택은 §6.4에서 만든 전체 정렬을 순회하는 greedy다.

1. best anchor≤4, 주요 Theme key≤3, series key≤1을 항상 적용한다.
2. 모든 Discovery는 반올림된 `tasteScore >= overallTopTasteScore-0.10`일 때만 선택한다.
3. Discovery 최대는 기본 2/숨은 정책 4, 최소는 기본 1/숨은 정책 2다.
4. 최소 미달이면 가장 높은 미선택 Discovery `d`부터 본다. 선택이 10 미만이면 caps를 만족하는 `d`를 append한다. 이미 10이면 non-Discovery를 낮은 순위부터 `r`로 시도해 `(selected−r)+d`가 모든 cap을 만족하는 첫 쌍을 교체한다.
5. 한 건마다 전체 tie-break 순서로 재정렬하고 최소 충족 또는 후보 소진까지 반복한다. cap은 완화하지 않으며 10개 미달은 후보 부족 상태로 처리한다.

### 6.9 설명 생성

- 구성: 맞는 이유 최대 3 + 주의할 차이 1 + 근거 Anchor 1~3 + 확신도 레이블.
- 소스는 실제 기여도 상위 항목만. 그룹/Cluster당 최대 1개.
- Cluster: `tacticalThinking(problemSolving, strategy, mysteryReveal)` / `relationshipAppeal(characterArcWeight, relationshipStructure)` / `toneLoad(darkness, mentalStress)`.
- "주의할 차이"는 best Anchor 대비 전역 최대 음(−) similarity 하나만 후보로 삼는다. 해당 후보가 없거나 아래 group/Cluster 경쟁에서 탈락하면 생략한다.
- 템플릿 기반 일본어 문장. 예: `『{anchorTitle}』で好きだった「{factorLabel}」に近い作品です。` / 차이: `ただし「{factorLabel}」は、あなたの好みと少し異なります。`
- 각 추천 결과는 `contributions[]`(팩터·그룹별 기여값)를 함께 반환하며, 설명은 이 배열에서만 생성한다. 테스트로 강제한다(`07` §2).

선택·렌더링 계약:

- positive 후보는 `explainable=true && value>0`, caution 후보는 best Anchor와의 차이인 `source=similarity && explainable=true && value<0`만이다. factor penalty·soft adjustment·policy를 Anchor 차이 문장으로 바꾸지 않는다.
- 안정 fallback은 `source → group → factorId → anchorWorkIds.join("\\0") → negativeReasonId` 오름차순이다. 음수 similarity를 `value asc → fallback`으로 정렬한 첫 1개만 global caution 후보로 둔다.
- 모든 positive와 global caution 하나를 `abs(value) desc → fallback`으로 순회한다. 이미 쓴 group/Cluster는 건너뛰고 positive 최대 3, caution 최대 1을 고른다. caution이 더 강한 positive와 충돌하면 다른 음수로 백필하지 않고 생략한다.
- 렌더링 가능한 factor는 `ExplanationLexicon.factorLabels`에 정의된 Axis/Genre/Theme뿐이다. Cluster 소속 factor는 cluster label, 나머지는 factor label을 쓰되 구조화 identity에는 원래 factorId를 보존한다.
- 근거 Anchor는 렌더링된 positive 순서 뒤 caution 순서에서 `source=similarity` contribution의 실제 `anchorWorkIds`만 distinct 1~3개 수집한다. penalty source·미렌더 contribution·제목 미해결 ID는 제외하고, 0개면 bestAnchorId를 보충하지 않은 채 Anchor 구역을 생략한다.
- confidence는 Taste에만 정확히 `高い / ふつう / 低め(データ収集中)`로 표시한다. 모든 일본어 label/template은 `src/lib/strings.ts`가 소유하고 순수 설명기에 lexicon으로 주입한다.
- placeholder는 원본 template의 `{factorLabel}`·`{anchorTitle}` token을 단일 비재귀 pass로 치환한다. 주입 값 안의 같은 token bytes는 다시 해석하지 않는다.

```ts
type StructuredExplanationSentence =
  | {
      kind: "positive" | "caution";
      text: string;
      source: ContributionSource;
      group: CoverageGroup | "overall";
      factorId: string;
      value: number;
      anchorWorkIds: string[];
      negativeReasonId?: NegativeReasonId;
    }
  | {
      kind: "baseline";
      text: string;
      source: "genre" | "market" | "maturity";
      group: "genre" | "overall";
      factorId: GenreTag | "bayesianRating" | "maturity";
      value: number;
      anchorWorkIds: string[];
    };
```

각 문장의 `source/group/factorId/value/anchorWorkIds`와 optional negativeReasonId는 선택한 원 contribution identity와 정확히 같아야 한다.

Contribution ledger는 `tasteScore`를 완전히 추적한다.

```ts
type ContributionSource =
  | "baseline" | "similarity" | "consensus" | "adjustment"
  | "penalty" | "policy" | "clamp";

type GroupContribution = {
  source: ContributionSource;
  group: CoverageGroup | "overall";
  factorId: string;
  value: number;
  anchorWorkIds: string[];
  negativeReasonId?: NegativeReasonId;
  explainable: boolean;
};
```

- similarity factor delta는 중립 0.5 기준이다. Axis는 `(sim-0.5)*effectiveWeight/observedWeightSum`, tag는 합집합의 **각 tag별** `(minWeight-0.5*maxWeight)/totalUnionWeight`에 group weight와 coverage scale을 곱한다. 0분모에는 항을 만들지 않는다.
- ledger는 `neutralBaseline=0.5*bestAnchorReactionWeight` + best anchor factor delta×reaction weight에서 시작한다. consensus는 clamp 후 실제 bonus, adjustment는 raw factor 항 + `adjustmentClamp`, penalty/policy는 실제 적용액, `finalClamp`는 `tasteScore-preClampScore`다.
- source 고정: baseline / factor similarity / consensus / raw adjustment / Theme soft exclusion·reason penalty / completed policy / adjustment·final clamp 순으로 각각 이름과 같은 source를 쓴다. zero 항은 만들지 않는다.
- group 고정: Genre/Theme tag=`genre/theme`, Axis=소속 그룹, Theme soft exclusion=`theme`, penalty는 §6.7의 원인 그룹(`tooComplex/vague=overall`), baseline/consensus/policy/clamp=`overall`.
- reserved factorId: `neutralBaseline`, `consensus`, `adjustmentClamp`, `finalClamp`, `preferCompleted`. penalty는 reason id, 나머지는 실제 factor id다.
- anchorWorkIds: similarity=[best], consensus=실제 supporter id 정렬, factor penalty=source disliked ids 정렬, vague=max source 1개, 나머지=[]다.
- 설명 가능: similarity, 0이 아닌 adjustment/soft exclusion, factor-backed penalty만 true. baseline/consensus/vague/policy/clamp는 false다.
- 내부 계산 후 출력은 소수 12자리로 반올림한다. contribution은 절댓값 내림차순→source/group/factor/anchor ids 오름차순이다. `tasteScore=sum(contribution.value)`가 반올림 허용오차에서 성립한다.

### 6.10 실험 Baseline v1

Baseline은 G1/G2에서만 쓰는 Genre+시장+축적도 control이다. 제품 Taste 점수에는 사용하지 않으며 G2 결과를 보기 전에 `BASELINE_VERSION="v1"`로 고정한다.

```text
genreAnchorScore = max(genreJaccard(candidate, anchor) × reactionWeight)
marketScore       = bayesianRating / 5
baselineScore     = q12(
  0.60 × genreAnchorScore + 0.30 × marketScore + 0.10 × maturity
)
```

- Genre는 중복 제거 set의 binary Jaccard이며 한쪽이라도 비면 0이다. positive anchor와 reactionWeight는 §6.3을 재사용하고 0개면 빈 결과다.
- best Genre anchor는 raw match 내림차순 leader cohort와 §6.4 tolerance, 최종 workId 오름차순으로 고른다. `genreAnchorScore=0`이면 공개 bestAnchorId는 null이고 Genre contribution·이유·Anchor를 만들지 않는다.
- 정렬은 공개 `baselineScore desc → workId asc`다. q12가 같으면 workId 순서다.
- Taste와 동일 recommendation eligibility, catalog 안 positive anchor, 읽음·하차·숨김·불호 제외, Axis/Theme exclude, catalog/context 검증을 사용한다. catalog 밖 record는 계산에서 제외한다. soft adjustment·penalty·consensus·confidence는 Baseline score에 넣지 않는다. Slice 3 profile의 네 policy는 모두 false다.
- 기본 리스트 제약을 공유한다. overlap>0의 anchor cap key는 bestAnchorId, 0이면 `none:{workId}`다. Discovery 창은 `baselineScore >= q12(overallTopBaselineScore-0.10)`이고 기본 1~2다.

```ts
type BaselineContribution = {
  source: "genre" | "market" | "maturity";
  group: "genre" | "overall";
  factorId: GenreTag | "bayesianRating" | "maturity";
  value: number;
  anchorWorkIds: string[];
  explainable: boolean;
};

type BaselineRecommendation = {
  workId: string;
  baselineScore: number;
  bestAnchorId: string | null;
  genreScore: number; // q12 reaction-weighted genreAnchorScore
  bayesianRating: number;
  maturity: number;
  contributions: BaselineContribution[];
};
```

- Genre 항은 best anchor와 공유하는 tag별 `0.60×reactionWeight/unionSize`, market은 `0.30×bayesianRating/5`, maturity는 `0.10×maturity`다. market/maturity anchor ids는 빈 배열이다.
- 실제 1권 reviewAverage와 reviewCount>0이 있을 때만 market 설명 가능, volumeCount>0일 때만 maturity 설명 가능이다. prior-only market은 점수에 남지만 설명하지 않는다.
- zero contribution은 생략한다. 공개 `baselineScore`, `genreScore`, `bayesianRating`, `maturity`, `contribution.value`는 모두 q12다. contribution은 절댓값 내림차순 뒤 source/factor/anchor 오름차순이며 `abs(sum-baselineScore)<=1e-11`이다.
- Baseline 이유는 explainable contribution의 `value desc → source/factor/anchor` 첫 1개만 사용하고 caution/confidence는 만들지 않는다. 구조화 문장은 선택 contribution identity를 그대로 반환한다.
- Baseline exact template은 `src/lib/strings.ts`에 다음 값으로 둔다.
  - `baselineGenreWithAnchor="『{anchorTitle}』と「{factorLabel}」が共通しています。"`
  - `baselineGenreWithoutAnchor="「{factorLabel}」のジャンル一致を順位に反映しています。"`
  - `baselineMarketObserved="第1巻のレビュー情報を順位に反映しています。"`
  - `baselineMaturity="刊行の蓄積を順位に反映しています。"`
- Genre 이유는 bestAnchorId 제목이 resolve되면 withAnchor, 아니면 withoutAnchor를 쓴다. market/maturity에는 placeholder가 없다. 보간은 §6.9의 단일 비재귀 pass다.

---

## 7. 검증 전략

### 단계 게이트

1. **Sanity Check (50작품, 본인+지인 2~3명):** CLI 리포트로 Top 10 육안 검증. 통과 기준 — 명백히 이상한 Top 10 없음 / 소수 취향 생존 / unknown 다수 작품 과대평가 없음 / 부정 사유가 올바른 팩터에만 작동.
2. **블라인드 테스트 (150작품, 다독자 10명):** Baseline(장르 중첩+시장 신호+축적도) vs Taste Engine. 출처 숨김, 설명 공개 전/후 2단 설문. 로컬 웹 하니스 사용.
3. **GO 기준 (방향성 판단, 통계적 유의성 주장 안 함):** 10명 중 7명 이상 Taste ≥ Baseline / Unknown Want-to-Read 우세 / Explanation Agreement ≥ 70% / Disliked Leakage 악화 없음 / Holdout Recall@10 열세 없음.
4. GO 이후에만 Web MVP 본격 구현. 2회 수정 후에도 열세이고 DNA 콘텐츠 가치도 없으면 범위 축소·방향 전환 검토.

### 핵심 지표

`Unknown Want-to-Read Rate` / `Explanation Agreement` / `Explanation Lift` / `Disliked Leakage@10` / `Holdout Recall@10` / 사용자별 승패.

### REVISE 진단표 (확정)

설명은 정확한데 읽고 싶지 않음 → Catalog Hook·진입성 / Holdout 좋고 Discovery 약함 → Bridge·Discovery 보강 / 추천 좋고 설명 부정확 → contribution·템플릿 수정 / 인기작만 상위 → tie-break 범위·Catalog 편향 수정.

---

## 8. 운영·법적 확정 사항

- Rakuten: 브라우저 직접 호출 금지(Route Handler 프록시), 캐시 TTL(가격·재고 24h / 기타 3개월), `Supported by Rakuten Developers` 크레디트, Affiliate 관계 표시, 약관 버전·검토일 기록.
- 표지: 원본 비율 유지, 크롭·누끼·텍스트 합성·콜라주 금지, 블러 배경은 동일 URL 재사용 + `aria-hidden`, 자체 CDN 영구 복제 금지.
- 상표: **[사용자 결정 필요]** 공개 전 J-PlatPat·도메인·SNS 핸들 확인. 내부 개발명으로는 즉시 사용 가능.
