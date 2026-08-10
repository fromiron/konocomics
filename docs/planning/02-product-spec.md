# 02 — 제품 사양 (Product Spec)

> 이 문서는 `konocomics-project-plan.md`를 대체하는 **확정 제품 사양**이다.
> 원본과 충돌하면 이 문서가 우선한다. 추천 산식은 이 문서 §6이 단일 진실 원천(single source of truth)이다.

---

## 1. 제품 테제

**KonoComics**는 사용자가 좋아하거나 싫어한 만화로부터 장르가 아니라 **전개·문제 해결·전략·관계·톤·심리적 피로도·작화 성향**을 추론하고, 아직 읽지 않은 만화를 **왜 추천했는지 설명하면서** 제시하는 개인 만화 취향 서비스다.

- 사용자 노출 제품명: **KonoComics** / 로고: **kono**co**mi**cs / 일본어: コノコミックス
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

원본 계획서의 타입을 그대로 채택한다: `Work`, `Volume`, `ProviderListing`, `ThemeFactor(centrality 1|2)`, `AxisFactor(known|unknown|notApplicable)`, `CatalogEligibility`, `FactorEvidence`, `WorkEvidence`, `UserWorkRecord(readingState×reaction 분리)`. (원본 §10~13, §18, §30 참조 — 변경 없음)

추가 확정:

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

Genre 10종, Theme 22종, Axis 17종(Narrative 6 / Tone·Relationship 7 / Art 4)의 정의와 0/2/4 기준은 원본 §15~16을 확정 채택하고, 실행 문서는 팩터 사전으로 이관한다. `training` Theme 제외, `actionIntensity` Axis 제거(→`combat` centrality)도 확정.

---

## 6. 추천 산식 (단일 진실 원천)

### 6.1 파이프라인 순서

```text
1. Hard Exclusion (사용자 除外 조건, 미완결 제외 정책 등)
2. Eligibility 필터 (recommendationEligible, 읽음/하차/숨김/興味なし 제외)
3. 그룹별 Work Similarity (Weighted Jaccard + Axis 거리)
4. Coverage 미달 그룹만 중립(0.5) 수축
5. Best Positive Anchor 점수 + Consensus Bonus (≤ +0.05)
6. 명시적 보정 explicitAdjustment (±0.12 cap)
7. 사유별 Factor Penalty (합계 ≤ 0.25)
8. Vague Dislike Shape Penalty (maxSim × 0.08)
9. clamp(0, 1) → rawTasteScore
10. 정렬: tasteScore 차 ≥ 0.025면 tasteScore, 아니면 tie-break
    (recommendationConfidence → bayesianRating → maturity)
11. 리스트 제약 적용 후 상위 10개 확정
```

### 6.2 유사도

- Tag(Genre/Theme): Weighted Jaccard, Theme는 centrality를 가중치로.
- Axis: `1 − |a−b|/4`. `darkness / mentalStress / romance`는 presence-sensitive — 한쪽이 0이고 다른 쪽이 >0이면 거리 ×1.5 (상한 1).
- 팩터별 유효 가중치: `baseAxisWeight × min(anchorConfidence, candidateConfidence)`.
- unknown 포함 비교 → 해당 팩터 미계산 + Coverage 감소. notApplicable → 기대 분모에서 제외.
- 그룹 비중 고정: Genre 15% / Theme 25% / Narrative 25% / Tone·Relationship 20% / Art 15%.
- Coverage 임계: Genre 0.80 / Theme 0.60 / Narrative 0.60 / Tone 0.60 / Art 0.30. 미달 그룹만 `0.5 + (score−0.5) × min(1, coverage/threshold)`. **가중치 재분배 금지.**

### 6.3 Positive Anchor

```ts
weight = { favorite: 1.0, liked: 0.8 };            // neutral·disliked는 positive anchor 아님
anchorMatch = workSimilarity(candidate, anchor) * weight[reaction];
bestMatch   = max(anchorMatches);
// 같은 취향군: bestAnchor와 workSimilarity ≥ 0.65인 다른 positive anchor
support        = average(sameModeMatches.slice(0, 2));
consensusBonus = max(0, support − 0.5) * 0.1;      // 실질 상한 ≈ +0.05
positiveAnchorScore = clamp(bestMatch + consensusBonus, 0, 1);
```

### 6.4 시장 신호 (tie-break 전용)

- `bayesianRating = (n·avg + 20·catalogAvg) / (n + 20)` — 1권 리뷰 기준, priorCount 20에서 시작.
- `maturity = min(1, log1p(volumeCount) / log1p(15))` — "검증된 작품 우선" 정책 선택 시에만 tie-break 우선순위 상승.

### 6.5 Confidence

```ts
profileConfidence = min(anchorCount/8, 1) * 0.8 + min(reasonedNegativeCount/2, 1) * 0.2;
workConfidence    = avgFactorConfidence * 0.6 + groupingConfidence * 0.2 + sourceAgreement * 0.2;
recommendationConfidence = sqrt(profileConfidence * workConfidence);
```

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

`除外` 처리: Axis는 후보의 해당 값 ≥ 3이면 Hard Exclusion, Theme은 centrality 2이면 Hard Exclusion (centrality 1은 −0.10 감점).

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
| `genericStory` | ありきたりな展開 | bestAnchor가 해당 불호 작품과 Theme 유사도 ≥ 0.7인 후보 | 감점 0.08 |
| `powerInflation` | インフレ・強さの破綻 | `progression = 4` | 감점 0.08 |
| `vagueDislike` | なんとなく合わなかった | 작품 전체 유사도 기반 | `maxSim × 0.08` (§6.1-8) |
| `external:*` | 休載・時間がない・配信終了 등 | **감점 없음** | 기록만 |

unknown인 팩터는 감점 조건 판정에서 제외한다(원칙 2). 조건·수치는 Phase 1 sanity check에서 조정될 수 있으며, 조정 시 이 표를 갱신한다.

### 6.8 추천 리스트 제약

```text
동일 best Anchor 기반         최대 4
동일 주요 Theme 조합          최대 3
동일 시리즈·직접 속편         최대 1
Discovery 슬롯               1~2 (top score − 0.10 이내에서만)
```

추천 정책 반영: `완결작 우선` = status≠completed 후보 −0.05 (제외 아님) / `숨은 작품 우선` = Discovery 슬롯 2~4로 확대 + reviewCount 상위 20% 후보 tie-break 강등 / `검증된 작품 우선` = tie-break에서 bayesianRating·maturity 우선.

### 6.9 설명 생성

- 구성: 맞는 이유 최대 3 + 주의할 차이 1 + 근거 Anchor 1~3 + 확신도 레이블.
- 소스는 실제 기여도 상위 항목만. 그룹/Cluster당 최대 1개.
- Cluster: `tacticalThinking(problemSolving, strategy, mysteryReveal)` / `relationshipAppeal(characterArcWeight, relationshipStructure)` / `toneLoad(darkness, mentalStress)`.
- "주의할 차이"는 best Anchor 대비 가장 큰 음(−) 기여 팩터에서 생성한다. 음의 기여가 유의미하지 않으면 생략 가능(강제로 만들어내지 않음).
- 템플릿 기반 일본어 문장. 예: `『{anchor}』で好きだった{clusterLabel}に近い作品です。` / 차이: `ただし序盤のテンポは、あなたの好みよりゆっくりめです。`
- 각 추천 결과는 `contributions[]`(팩터·그룹별 기여값)를 함께 반환하며, 설명은 이 배열에서만 생성한다. 테스트로 강제한다(`07` §2).

---

## 7. 검증 전략

### 단계 게이트

1. **Sanity Check (50작품, 본인+지인 2~3명):** CLI 리포트로 Top 10 육안 검증. 통과 기준 — 명백히 이상한 Top 10 없음 / 소수 취향 생존 / unknown 다수 작품 과대평가 없음 / 부정 사유가 올바른 팩터에만 작동.
2. **블라인드 테스트 (150작품, 다독자 10명):** Baseline(장르 중첩+시장 신호+축적도) vs Taste Engine. 출처 숨김, 설명 공개 전/후 2단 설문. 로컬 웹 하니스 사용.
3. **GO 기준 (방향성 판단, 통계적 유의성 주장 안 함):** 10명 중 7명 이상 Taste ≥ Baseline / Unknown Want-to-Read 우세 / Explanation Agreement ≥ 70% / Disliked Leakage 악화 없음 / Holdout Recall@10 열세 없음.
4. GO 이후에만 Web MVP 본격 구현. 2회 수정 후에도 열세이고 DNA 콘텐츠 가치도 없으면 범위 축소·방향 전환 검토.

### 핵심 지표

`Unknown Want-to-Read Rate` / `Explanation Agreement` / `Explanation Lift` / `Disliked Leakage@10` / `Holdout Recall@10` / 사용자별 승패.

### REVISE 진단표 (원본 유지)

설명은 정확한데 읽고 싶지 않음 → Catalog Hook·진입성 / Holdout 좋고 Discovery 약함 → Bridge·Discovery 보강 / 추천 좋고 설명 부정확 → contribution·템플릿 수정 / 인기작만 상위 → tie-break 범위·Catalog 편향 수정.

---

## 8. 운영·법적 확정 사항

- Rakuten: 브라우저 직접 호출 금지(Route Handler 프록시), 캐시 TTL(가격·재고 24h / 기타 3개월), `Supported by Rakuten Developers` 크레디트, Affiliate 관계 표시, 약관 버전·검토일 기록.
- 표지: 원본 비율 유지, 크롭·누끼·텍스트 합성·콜라주 금지, 블러 배경은 동일 URL 재사용 + `aria-hidden`, 자체 CDN 영구 복제 금지.
- 상표: **[사용자 결정 필요]** 공개 전 J-PlatPat·도메인·SNS 핸들 확인. 내부 개발명으로는 즉시 사용 가능.
