# Slice 2 추천 엔진 계약 보완 심사 요청

## 목적

`02-product-spec.md` §6의 확정 방향을 바꾸지 않고, 현재 문서만으로 byte-for-byte 결정할 수 없는 구현 세부를 최소한으로 닫는다. 이 문서는 심사용 제안이며, 만장일치 GO 전에는 단일 진실 원천을 변경하지 않는다.

심사자는 아래 증거·제안만으로 독립 판정한다. 판정은 정확히 `GO` 또는 `REVISE`로 시작하고, `REVISE`라면 반드시 결정 ID와 교체 문구를 제시한다.

## 변경 불가 상위 계약

1. 그룹 비중은 Genre 0.15 / Theme 0.25 / Narrative 0.25 / Tone 0.20 / Art 0.15다.
2. unknown은 점수·감점에 쓰지 않고 coverage만 낮춘다. notApplicable은 기대 분모에서 제외한다.
3. coverage 미달 그룹만 0.5로 수축하며 그룹 가중치를 재분배하지 않는다.
4. Best Positive Anchor 방식을 유지하고 consensus bonus는 최대 0.05다.
5. 시장 신호는 근접 동률 tie-break에서만 쓴다.
6. explicit adjustment는 ±0.12, factor penalty는 0.25 cap이다. vague penalty는 별도 후속 단계다.
7. 설명은 실제 `contributions[]`에서만 생성한다.
8. 모든 함수는 순수·결정론적이며 입력 순서에 의존하지 않는다.

## 확인된 공백

- 17개 Axis의 `baseAxisWeight` 값과 pair coverage 분모가 없다.
- Theme confidence의 similarity 반영 여부, 빈 Jaccard, tag coverage가 없다.
- `sameModeMatches`, 빈 supporter, exact tie의 정의가 없다.
- reason 중복 집계, `genericStory` 문장의 정확한 주어, Theme exclude soft penalty의 cap 귀속이 없다.
- `avgFactorConfidence` 대상과 `anchorCount`/`reasonedNegativeCount` 단위가 없다.
- 시장 필드, Discovery 역할, sequel group이 확정 `Work` 타입에 없다.
- `tasteScore` 차 0.025를 pairwise comparator로 구현하면 비추이 비교가 생길 수 있다.
- 기본 tie-break의 maturity 사용 여부가 §6.1과 §6.4/`07` #12 사이에서 충돌한다.
- 주요 Theme 조합, Discovery 최소·최대·백필 알고리즘이 없다.
- factor-level signed contribution의 형태와 분해식이 없다.

## 제안 계약

### D1. Axis score와 coverage

- v1의 모든 Axis `baseAxisWeight = 1`로 둔다. 그룹 안에서만 정규화한다.
- 한쪽이라도 `notApplicable`이면 그 Axis를 기대 분모에서 제외한다.
- 양쪽 모두 `notApplicable`이 아니면 기대 개수에 포함한다. 양쪽 모두 `known`일 때만 관측 개수와 score에 포함한다.
- `coverage = observedCount / expectedCount`. 기대 개수가 0이면 `coverage = 0`, raw score는 0.5다.
- raw Axis score는 관측 pair마다 `baseAxisWeight * min(anchorConfidence, candidateConfidence)`를 사용한 가중 평균이다. 유효 가중치 합이 0이면 0.5다.
- presence-sensitive 3축은 기존 문구 그대로 거리만 1.5배하고 1에서 자른다.

이 선택은 low confidence를 score 가중치와 work confidence에 반영하되, `known`을 다시 `unknown`처럼 이중 처리하지 않는다.

### D2. Tag Jaccard와 coverage

- Genre는 각 tag weight 1의 binary weighted Jaccard다.
- Theme는 각 작품 쪽 weight를 centrality 1 또는 2로 두고, 교집합은 tag별 `min(leftWeight, rightWeight)`, 합집합은 `max(...)` 합으로 계산한다.
- Theme confidence는 similarity 가중치에 다시 곱하지 않고 D8의 work confidence에 사용한다. 확정 문구가 centrality만 가중치로 명시하기 때문이다.
- tag 합집합이 비면 raw score 0.5다. 한쪽 그룹 배열이라도 비어 있으면 coverage 0이며, 양쪽 배열이 모두 비어 있지 않을 때만 coverage 1이다. 따라서 한쪽만 비었을 때 raw Jaccard가 0이어도 최종 그룹 score는 0.5로 완전히 수축한다.
- 현재 schema에는 개별 Theme/Genre의 unknown 상태가 없다. **양쪽 그룹 주석이 존재할 때만** 개별 tag 부재를 known absence로 해석한다. explicit adjustment에서는 기존 계약대로 부재를 선호 보상으로 쓰지 않는다.

### D3. 그룹 score와 signed contribution

- 각 그룹은 `adjusted = 0.5 + (raw - 0.5) * coverageScale`을 계산하고, 전체 similarity는 고정 그룹 비중의 합이다.
- factor contribution은 중립 0.5 대비 signed delta를 분해한다.
  - Axis: `(axisSimilarity - 0.5) * effectiveWeight / observedEffectiveWeightSum`.
  - Genre/Theme: `(intersectionWeight - 0.5 * unionWeight) / totalUnionWeight`.
  - 각 값에 해당 group weight와 coverageScale을 곱한다.
- Axis의 `observedEffectiveWeightSum`이 0이면 factor similarity contribution을 생성하지 않는다. Genre/Theme의 `totalUnionWeight`가 0이면 factor similarity contribution을 생성하지 않는다. 두 경우 모두 group raw score는 0.5이고 factor delta 합은 0이다.
- Genre/Theme는 D2 합집합의 **각 tag마다** `intersectionWeight=min(left,right)`, `unionWeight=max(left,right)`를 넣은 항을 하나씩 남긴다. group 합산 similarity 항은 만들지 않는다.
- 최종 추천의 similarity contribution은 best anchor의 factor contribution에 해당 anchor reaction weight를 곱한 값이다.
- `contributions[]`의 항목은 다음 의미를 갖는다.

```ts
type ContributionSource =
  | "baseline"
  | "similarity"
  | "consensus"
  | "adjustment"
  | "penalty"
  | "policy"
  | "clamp";

type GroupContribution = {
  source: ContributionSource;
  group: CoverageGroup | "overall";
  factorId: string;
  value: number; // 최종 score 공간의 signed 값
  anchorWorkIds: string[];
  negativeReasonId?: NegativeReasonId;
  explainable: boolean;
};
```

- factor-level similarity contribution에는 `workSimilarity = 0.5 + sum(factor similarity contribution)` 불변식이 성립한다.
- 추천 score ledger는 `neutralBaseline = 0.5 * bestAnchorReactionWeight`에서 시작하고, best anchor factor delta에는 reaction weight를 곱한다. 따라서 `neutralBaseline + sum(weighted factor delta) = bestMatch`가 성립한다.
- similarity뿐 아니라 실제 적용된 consensus, adjustment, penalty, completed policy와 clamp 절삭분도 항목을 남긴다. `neutralBaseline`, aggregate cap 보정, final clamp 보정은 `group="overall"`, `explainable=false`다.
- consensus 값은 clamp 후 `positiveAnchorScore - bestMatch`, final clamp 값은 `tasteScore - preClampScore`로 기록한다. explicit raw 항은 그대로 기록하고 ±0.12 초과분을 `adjustmentClamp` overall 항으로 기록한다.
- factor cap은 D7에서 비례 축소된 실제 개별 금액만 기록하며 factor penalty용 overall cap 보정 항은 만들지 않는다. 이 문서의 aggregate cap 보정은 explicit ±0.12의 `adjustmentClamp`만 뜻한다. soft exclusion과 정책은 실제 적용액을 기록한다. 최종적으로 `tasteScore = sum(all contribution.value)`가 소수 12자리 허용오차 안에서 성립한다.
- `anchorWorkIds`는 다음처럼 채운다: similarity=`[bestAnchorId]`; consensus=평균에 실제 사용된 supporter id 오름차순; adjustment/softExclusion=`[]`; factor penalty=해당 사유를 트리거한 disliked work id 오름차순; vague=maxSim을 만든 work id 1개(동률이면 workId 오름차순 첫 작품); policy/clamp/neutralBaseline/adjustmentClamp=`[]`.
- `source`는 다음으로 고정한다: neutralBaseline=`baseline`; factor similarity=`similarity`; consensus=`consensus`; axis/theme raw explicit adjustment=`adjustment`; Theme soft exclusion 및 reasoned/vague penalty=`penalty`; preferCompleted=`policy`; adjustmentClamp/finalClamp=`clamp`.
- reserved `factorId`는 baseline=`neutralBaseline`, consensus=`consensus`, explicit cap=`adjustmentClamp`, final clamp=`finalClamp`, completed policy=`preferCompleted`다. similarity/adjustment/soft exclusion은 실제 Genre/Theme/Axis id를 쓴다. negative penalty는 해당 `NegativeReasonId`를 `factorId`와 `negativeReasonId` 양쪽에 쓴다.
- group은 Genre/Theme factor=`genre/theme`, Axis factor=그 Axis가 속한 `narrative/tone/art`, Theme soft exclusion=`theme`, baseline/consensus/policy/clamp=`overall`이다. Theme soft exclusion에는 `negativeReasonId`를 두지 않는다.
- penalty group은 `tooSlow/tooRepetitiveProgression/powerInflation=narrative`, `tooDark/tooStressful/tooMuchRomance/tooMuchComedy/notEnoughSeriousness=tone`, `artStyleDislike=art`, `genericStory=theme`, `tooComplex/vagueDislike=overall`로 고정한다.
- 값이 정확히 0인 항은 만들지 않는다. baseline은 항상 0보다 크다. factor-backed penalty는 `explainable=true`, vague/baseline/consensus/policy/clamp는 `false`이며 similarity와 0이 아닌 adjustment/soft exclusion은 `true`다.
- 설명기는 `explainable=true`인 실제 factor 항목만 선택할 수 있고 배열 밖 사실을 이유로 만들 수 없다.
- 출력 숫자는 내부 계산 후 마지막 경계에서 소수 12자리로 반올림한다. 배열은 절댓값 내림차순 뒤 source/group/factor/work id 오름차순으로 안정화한다.

### D4. Positive Anchor와 consensus

- positive anchor는 `favorite`/`liked` record만이며, 0개면 빈 추천 배열을 반환한다.
- best anchor는 `workSimilarity(candidate, anchor) * reactionWeight`가 가장 큰 작품이다. 완전 동률은 `workId` 오름차순이다.
- supporter는 best anchor를 제외한 positive anchor 중 `workSimilarity(bestAnchor, supporter) >= 0.65`인 작품이다.
- supporter match도 `workSimilarity(candidate, supporter) * supporterReactionWeight`다. 내림차순, 동률 `workId` 오름차순으로 상위 2개 평균을 쓴다.
- supporter가 0개면 support 0.5로 두어 bonus 0, 1개면 그 한 값의 평균을 쓴다. bonus는 식 계산 후 0.05에서 명시적으로 cap한다.

### D5. 후보 제외

- `recommendationEligible=false`, `reading/completed/dropped/hidden`, `reaction=disliked`인 작품은 후보에서 제외한다. `reading`도 제품이 “아직 읽지 않은 작품”을 추천한다는 `02` §1·`03` §5 계약에 따라 제외한다.
- `planned`는 카드가 유지되고 다음에도 아직 읽지 않은 작품이라는 `/recommendations` 계약 때문에 제외하지 않는다.
- 엔진 입력의 `excludeIncomplete=true`는 `status !== completed`를 score 전 hard exclude한다. `preferCompleted`와 별개다.
- Axis exclude는 known 값 3 이상, Theme exclude는 centrality 2를 score 전 hard exclude한다. unknown/NA/Theme 부재는 hard exclude하지 않는다.

### D6. Explicit adjustment

- axis/theme `veryLike=+0.06`, `like=+0.03`, `auto=0`, `less=-0.06`을 기존 식에 적용한다.
- hard exclude되지 않은 axis/theme `veryLike/like/auto/less` 항만 합친 뒤 [-0.12, +0.12]로 clamp한다.
- Theme exclude가 centrality 1이면 explicit clamp 뒤 별도 `softExclusionPenalty = -0.10`을 적용한다. 이는 reasoned factor penalty cap에 넣지 않으며, 각 해당 Theme에 대해 실제 penalty/contribution을 남긴다.
- Axis exclude에서 값 0~2인 후보에는 별도 soft penalty를 만들지 않는다.

### D7. Negative penalty 집계

- `external:*`은 기록만 하고 계산에서 제거한다.
- factor-backed reason ID는 여러 record에 반복되어도 전역 1회만 적용한다. 동일 사용자 선호를 작품 수만큼 중복 감점하지 않기 위함이다.
- `artStyleDislike`는 해당 reason을 가진 불호 작품들과 후보의 Art similarity 중 최댓값이 0.75 이상이면 0.08을 1회 적용한다.
- `genericStory`는 문서의 best-anchor 조건을 보존하면서 후보와 무관한 cluster 전체 감점을 막는다. 같은 불호 작품에 대해 `(bestAnchor, dislikedWork)`와 `(candidate, dislikedWork)`의 Theme group similarity가 **둘 다** 0.7 이상이면 0.08을 1회 적용한다.
- Art/Theme threshold는 coverage shrink까지 적용된 해당 group score를 사용한다.
- reasoned factor penalty 합만 0.25에서 cap한다. raw 합이 cap을 넘으면 각 nominal penalty에 `0.25 / rawTotal`을 곱해 비례 축소한다. 고정 reason enum 순서는 `02` §6.7 표 순서이며 출력 안정화에만 쓰고 금액 우선권을 만들지 않는다.
- vague는 이유 미선택이 `vagueDislike` 단독으로 정규화된 record에만 적용한다. factor-backed 또는 `external:*` reason이 하나라도 명시된 record에는 vague를 중복 적용하지 않는다.
- vague penalty는 남은 vague record들과 후보의 전체 similarity 최댓값 ×0.08이며, §6.1 순서대로 factor cap 밖에서 1회 적용한다.
- `penaltiesApplied`는 실제 score에 반영된 사유만 담는 `NegativeReasonId[]`다. factor-backed 사유는 비례 축소 후 적용액이 0보다 큰 경우, `vagueDislike`는 vague penalty가 0보다 큰 경우만 포함한다. `external:*`, soft exclusion, completed policy는 포함하지 않는다. 순서는 `02` §6.7 표 순서이고, 동일 enum 밖 확장 키의 최종 fallback은 문자열 오름차순이다.

### D8. Confidence

- `anchorCount`는 distinct positive anchor 작품 수다.
- `reasonedNegativeCount`는 vague/external 이외의 factor-backed reason을 1개 이상 가진 distinct 불호 작품 수다.
- `avgFactorConfidence`는 work의 모든 known Axis confidence와 존재하는 Theme confidence의 산술 평균이다. unknown/NA는 분모에서 제외하고 값이 하나도 없으면 0이다.
- 나머지 식과 label 경계는 문서 그대로이며 0.75는 `high`, 0.5는 `normal`에 포함한다.

### D9. 시장 입력과 결측

확정 `Work` 타입을 임의 확장하지 않고 엔진 입력에 별도 metadata를 둔다.

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

type RecommendationContext = {
  constraintByWorkId: Record<string, RecommendationConstraintMetadata>;
  marketSnapshot: {
    catalogVersion: string;
    catalogAverageRating: number;
    byWorkId: Record<string, RecommendationWorkMarketSignal>;
  };
};
```

- 리뷰가 없으면 `n=0`으로 Bayesian 결과가 catalog average가 된다.
- constraint metadata가 없는 작품은 `bridge`, 고유 series group, volumeCount 0으로 처리하고 market 결측은 reviewCount 0으로 처리한다. 이 fallback은 작은 단위 픽스처만을 위한 것이다. 50/150작품 gate 입력은 모든 추천 작품의 정적 metadata 누락을 validation failure로 처리한다.
- `constraintByWorkId`와 `marketSnapshot`은 모두 catalog와 함께 빌드되는 불변 데이터다. `catalogVersion` digest는 catalog의 version 필드와 `marketSnapshot.catalogVersion` 필드를 제외한 catalog 내용 + 정규화된 `RecommendationContext` 내용으로 계산한다. 계산된 digest를 catalog와 `marketSnapshot.catalogVersion` 양쪽에 기록한다. 따라서 자기참조 없이 같은 catalogVersion에서 ranking context가 바뀌지 않는다.
- 외부 경계에서 `marketSnapshot.catalogVersion === catalog.catalogVersion`을 검증하고 불일치 입력은 거부한다.
- 외부 경계는 catalogAverage/reviewAverage 0~5의 유한수, reviewCount/volumeCount 0 이상의 정수를 검증하고 범위 밖 입력을 거부한다.

### D10. 0.025 근접 동률을 transitive하게 처리

- 먼저 소수 12자리로 반올림된 최종 tasteScore를 기준으로 내림차순, workId 오름차순 정렬한다.
- 아직 cohort에 들어가지 않은 첫 작품을 cohort leader로 삼고, leader와 tasteScore 차가 `< 0.025`인 연속 작품을 같은 cohort에 둔다. 차이가 정확히 0.025면 새 cohort다.
- cohort 내부만 tie tuple로 다시 정렬한다. 따라서 pairwise 비추이 comparator를 사용하지 않는다.
- 기본 tuple은 `recommendationConfidence desc -> bayesianRating desc -> workId asc`; maturity는 사용하지 않는다.
- `preferVerified`면 `bayesianRating desc -> maturity desc -> recommendationConfidence desc -> workId asc`다.
- `preferHidden`이면 아래 D11의 `isPopular` false가 모든 tuple 맨 앞에 온다.
- 두 toggle이 동시에 켜지면 `isPopular asc -> bayesianRating desc -> maturity desc -> recommendationConfidence desc -> workId asc`다.

이는 `02` §6.4의 “maturity는 검증된 작품 우선에서만”이 §6.1의 축약 tie-break를 구체화하고, `07` #12가 그 경계를 검증하는 것으로 해소한 결과다.

### D11. 완결·숨은 작품 정책

- `preferCompleted`는 clamp 전 taste score에 `status !== completed ? -0.05 : 0`을 적용한다.
- `preferHidden`의 popular 모집단은 market metadata 유무와 관계없이 현재 eligible 후보 전체다. `reviewCount` 내림차순 상위 `ceil(N * 0.20)`개를 잡고 경계 reviewCount 동률은 모두 popular로 포함한다. 결측은 reviewCount 0이다. 모두 같은 값이면 모두 같은 popular 상태가 되어 순위 변화가 없다.
- popularity는 taste score를 바꾸지 않고 D10 cohort 내부에서만 강등한다.

### D12. 리스트 제약 metadata와 key

- 같은 best anchor key는 `bestAnchorId`다.
- 주요 Theme 조합 key는 후보의 centrality 2 Theme id들을 정렬해 `+`로 연결한다. centrality 2 Theme가 없으면 서로 무관한 작품이 한 조합으로 묶이지 않도록 `none:{workId}`다.
- 같은 series/direct sequel key는 `seriesGroupId ?? workId`다. 50/150작품 metadata에서 직접 속편들은 같은 `seriesGroupId`를 받는다.
- Discovery는 `catalogRole === discovery`다.

### D13. 리스트 제약 알고리즘

- D10의 전체 정렬을 입력으로 받아 순서대로 greedy 선택한다. best anchor 최대 4, major Theme key 최대 3, series key 최대 1을 항상 적용한다.
- 모든 Discovery 후보는 최초 greedy, 최소 보정, 백필 어느 단계에서도 `candidate.tasteScore >= overallTopTasteScore - 0.10`(경계 포함)을 만족해야 한다. `overallTopTasteScore`와 후보 score는 모두 D10의 소수 12자리 값을 사용한다. 범위 밖 Discovery는 선택하지 않는다.
- Discovery 최대는 기본 2, `preferHidden`이면 4다. 먼저 이 최대를 포함해 최대 10개를 채운다.
- Discovery 최소는 기본 1, `preferHidden`이면 2다. 최소 미만이면 D10 순서상 가장 높은 미선택 Discovery부터 다음을 반복한다. 후보 `d`는 `d.tasteScore >= overallTopTasteScore - 0.10`(경계 포함)이고, 구조 cap(best anchor ≤4, major Theme key ≤3, series key ≤1, Discovery ≤ 최대)을 만족해야 한다.
- 선택 크기가 10 미만이면 그런 `d`를 추가한다. 선택 크기가 10이면 현재 선택의 non-Discovery를 D10 역순(가장 낮은 순위부터)으로 제거 후보 `r`로 두고, `(선택 \\ {r}) ∪ {d}`가 위 cap을 만족하는 첫 쌍에서 `r`을 `d`로 교체한다.
- 한 건을 반영한 뒤 선택 집합을 항상 D10 순서로 다시 정렬하고, 최소 충족 또는 후보 소진까지 반복한다. 가능한 후보가 없으면 강제하지 않는다. Discovery 최대와 구조 cap은 `02` §6.8의 hard list constraint다. 그 결과 10개를 못 채우는 경우는 `03` §5의 후보 부족 상태로 처리하며 cap을 완화하지 않는다.

### D14. 결정론 입력 정규화

- works, records, adjustments, negative reasons, metadata map을 ID/고정 enum 순서로 정렬한 뒤 계산한다.
- 어떤 입력 배열 순열에서도 결과 JSON이 동일해야 한다.
- 최종 fallback은 항상 `workId` 오름차순이며 locale-dependent 비교는 쓰지 않는다.

### D15. Slice 2와 Slice 3 수용 범위

- Slice 2는 `07` §2의 1~14, 16, 17과 signed contribution 구조까지 완료한다.
- `07` §2 #15의 실제 일본어 문장/cluster 검증은 구현 계획이 `domain/explanation/`을 Slice 3 파일로 지정하므로 Slice 3 완료 조건으로 실행한다.
- Slice 2에는 explanation 문구를 미리 만들지 않는다. Slice 3에서 `contributions[]` 밖 source 사용을 금지하는 테스트를 추가한다.
- #17은 `tests/fixtures/recommendation/golden-20.ts`의 고정 20작품·고정 profile을 사용하고, 순서·tasteScore·confidence·bestAnchorId·전체 contributions·D7 형식의 `penaltiesApplied`를 byte-exact snapshot으로 커밋한다. snapshot 갱신은 산식 표 변경과 리뷰가 함께 있을 때만 허용한다.

## 심사 기준

다음 모두를 만족할 때만 GO다.

1. 상위 문서의 수치나 제품 원칙을 바꾸지 않는다.
2. unknown을 불호로 해석하거나 시장 신호를 taste에 섞지 않는다.
3. 모든 경계·동률·결측이 결정론적이다.
4. 17개 acceptance contract를 Slice 2/3 순서에 맞춰 실제 테스트할 수 있다.
5. 제안이 불필요한 새 제품 기능이나 데이터 계층을 만들지 않는다.

## 요구 응답 형식

```text
GO
- contract preservation: PASS
- determinism: PASS
- acceptance testability: PASS
- minimality: PASS
```

또는

```text
REVISE
- D#: 문제
- 교체 문구: ...
```
