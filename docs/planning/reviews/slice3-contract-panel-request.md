# Slice 3 Baseline·설명·CLI 계약 보완 심사 요청

## 목적

`02-product-spec.md`와 `06-implementation-plan.md`가 확정한 방향을 바꾸지 않고, G1/G2 비교 결과와 설명 문장을 좌우하지만 아직 수치화되지 않은 Slice 3 구현 계약을 최소 범위로 닫는다. 이 문서는 심사용 제안이며, 3개 독립 심사자의 만장일치 GO 전에는 단일 진실 원천이나 코드를 변경하지 않는다.

심사자는 정확히 `GO` 또는 `REVISE`로 응답을 시작한다. `REVISE`라면 결정 ID와 문제, 교체 문구를 함께 제시한다.

## 변경 불가 상위 계약

1. Taste Engine 산식과 결정론 계약은 `02-product-spec.md` §6 그대로 유지한다.
2. Baseline은 Genre 중첩, Bayesian 시장 신호, 작품 축적도만 사용하는 비교 대조군이다.
3. 두 엔진은 동일 catalog/context, records, 후보 풀을 받아야 한다. holdout은 Slice 4 하니스의 별도 계약이다.
4. 설명은 엔진이 반환한 실제 contribution 근거에서만 생성하고 런타임 LLM을 쓰지 않는다.
5. domain은 순수·결정론적이며 I/O와 UI 계층을 import하지 않는다.
6. 일본어 사용자 문자열은 `src/lib/strings.ts`가 소유한다.
7. CLI는 로컬 G1/G2 실험 도구이며 네트워크·환경 비밀키·현재 시간·난수를 사용하지 않는다.

## 확인된 공백

- Baseline 세 구성요소의 결합 방식·가중치·정규화가 없다.
- Genre를 어느 anchor와 비교하고 favorite/liked를 어떻게 반영할지 없다.
- Baseline 후보 필터, hard exclusion, 정책, 리스트 제약, 동률, 출력 타입이 없다.
- 설명의 positive/caution 대상, group/cluster 중복 제거 순서, Anchor 1~3 선택법이 없다.
- `domain/explanation`이 문장을 만들라는 계약과 domain→`lib` 금지·문자열 중앙화 규칙 사이 연결 방식이 없다.
- CLI profile JSON 경계, flags, 결정론적 Markdown 형식, 로컬 민감 데이터 보호 계약이 없다.

## 제안 계약

### B1. Baseline의 역할

- Baseline은 G1/G2에서 Taste Engine과 비교하는 **실험 전용 control**이다. 사용자에게 노출되는 Taste 점수나 제품 추천에는 사용하지 않는다.
- 제품 원칙의 “시장 신호는 tie-break 전용”은 Taste Engine에 그대로 적용한다. Baseline은 원래 정의된 “장르+인기+축적도” control을 만들기 위해서만 시장·축적 신호를 additive component로 쓴다.
- Baseline 수치와 버전은 G2 결과를 보기 전에 고정하며, 결과를 본 뒤 대조군을 약화하거나 강화하지 않는다.

### B2. Baseline score

```text
genreAnchorScore = max(
  genreJaccard(candidate.genres, anchor.genres) × reactionWeight
)
marketScore       = bayesianRating / 5
baselineScoreRaw  = 0.60 × genreAnchorScore
                  + 0.30 × marketScore
                  + 0.10 × maturity
baselineScore     = q12(baselineScoreRaw)
```

- reactionWeight는 favorite 1.0 / liked 0.8이다.
- 세 component는 `[0,1]`이고 가중치 합이 1이므로 별도 clamp는 하지 않는다.
- 0.60은 장르 신호를 단독 과반으로 유지한다. 시장+축적 신호의 최대 합은 0.40이다.
- 정렬은 `baselineScore desc → workId asc`다. 공개 q12가 같으면 동점이다. 공개 상수 `BASELINE_VERSION="v1"`을 두고 가중치·anchor 집계·정렬 변경 시 version을 올린 뒤 golden을 재생성한다.

골든 예시:

```text
Genre Jaccard=1/3, reviewAverage=5, reviewCount=20,
catalogAverage=3, volumeCount=15
bayesianRating=4, marketScore=.8, maturity=1

favorite baselineScore = .60×(1/3) + .30×.8 + .10×1 = .54
liked baselineScore    = .60×(.8/3) + .30×.8 + .10×1 = .50
```

### B3. Genre와 anchor

- Genre는 중복을 제거한 set의 binary Jaccard다. `|intersection| / |union|`이며 한쪽 또는 양쪽 set이 비면 0이다. 데이터 부재를 일치로 보지 않는다.
- catalog 안의 distinct favorite/liked record만 positive anchor다. positive anchor가 0개면 Baseline 추천 결과는 Taste와 같이 빈 배열이며 점수를 계산하지 않는다.
- positive anchor가 1개 이상일 때 anchor별 B2 점수가 가장 큰 작품을 best Genre anchor로 둔다. raw 내림차순 leader와 `02` §6.4의 4-EPS tolerance 안인 항목은 같은 수치 동률 cohort로 보고 `workId asc`로 정한다.
- `genreAnchorScore>0`일 때만 공개 `bestAnchorId`를 둔다. `genreAnchorScore=0`이면 `bestAnchorId=null`이며 Genre contribution·Genre reason·evidence Anchor를 만들지 않는다.

### B4. 공통 입력과 후보 풀

- Baseline은 Taste와 동일 `RecommendationInput`의 catalog, records, adjustments, policies, immutable context를 받으며 같은 version·범위·중복 검증을 거친다.
- 공통 제외: `recommendationEligible=false`, catalog 안 positive anchor, `reading/completed/dropped/hidden`, `reaction=disliked`, catalog 밖 record, `excludeIncomplete=true`일 때 status 비완결.
- Axis/Theme `exclude` hard exclusion도 두 엔진에 동일 적용한다.
- Baseline score에는 soft explicit adjustment, Theme soft exclusion, reasoned/vague penalty, consensus, confidence, `preferCompleted`, `preferVerified`를 사용하지 않는다.
- Slice 3의 실험 profile은 네 정책을 모두 false로 고정하며, 하나라도 true면 입력 오류다. Slice 3 CLI/G1은 holdout을 적용하지 않고 두 엔진에 동일 records 전체를 전달한다. Slice 4 하니스가 holdout 선택·제거·후보 복원을 별도로 소유한다.

### B5. 공통 리스트 제약

- Baseline도 best anchor≤4, 주요 Theme 조합≤3, series≤1, 기본 Discovery 1~2의 동일 greedy 후처리를 적용한다. anchor cap key는 `genreAnchorScore > 0 ? bestAnchorId : "none:" + workId`다. Genre overlap 0인 후보를 임의의 한 anchor cap에 묶지 않는다.
- Discovery 품질창은 `baselineScore >= q12(overallTopBaselineScore - 0.10)`이다. `overallTopBaselineScore`는 리스트 제약 전 전체 후보의 공개 `baselineScore` 최댓값이다.
- Slice 3 Baseline API는 네 policy가 모두 false가 아니면 거부한다. non-default policy 동작은 구현하지 않으며 기본 D13 caps와 Discovery 1~2만 공유한다.
- 최대 10개이며 cap 때문에 부족하면 더 낮은 후보로 규칙을 완화하지 않는다.

### B6. Baseline 출력과 ledger

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
  genreScore: number;
  bayesianRating: number;
  maturity: number;
  contributions: BaselineContribution[];
};
```

- `genreScore=q12(genreAnchorScore)`이며 favorite/liked reaction weight가 반영된 값이다.
- Genre contribution은 B3가 고른 best Genre anchor 기준이다. 그 anchor와 공유하는 Genre마다 `value=0.60 × reactionWeight / unionSize`, `source="genre"`, `group="genre"`, `factorId=GenreTag`, `anchorWorkIds=[bestAnchorId]`, `explainable=true`로 남긴다.
- market은 `0.30 × bayesianRating/5`, maturity는 `0.10 × maturity`이며 `group="overall"`, `anchorWorkIds=[]`다. zero 항은 생략한다.
- market은 실제 `reviewAverage`가 있고 `reviewCount>0`일 때만 explainable=true다. prior-only market 항은 점수 ledger에는 남지만 설명하지 않는다. maturity는 실제 `volumeCount>0`일 때 explainable=true다.
- 출력 값은 q12, 배열은 `abs(value) desc → source/factorId/anchorWorkIds asc`다. `abs(sum(contribution.value)-baselineScore) <= 1e-11`이어야 한다.
- Baseline 이유는 explainable contribution 중 `value desc → source/factorId/anchorWorkIds asc` 첫 1개만 사용하고, 없으면 생략한다. caution은 만들지 않는다.
- Baseline lexicon은 아래 exact 값을 필수로 가진다.
  - `baselineGenreWithAnchor="『{anchorTitle}』と「{factorLabel}」が共通しています。"`
  - `baselineGenreWithoutAnchor="「{factorLabel}」のジャンル一致を順位に反映しています。"`
  - `baselineMarketObserved="第1巻のレビュー情報を順位に反映しています。"`
  - `baselineMaturity="刊行の蓄積を順位に反映しています。"`
- 선택한 Baseline 이유가 `source="genre"`이면 `resolveTitle(bestAnchorId)`가 비어 있지 않은 제목을 반환할 때만 `baselineGenreWithAnchor`, 아니면 `baselineGenreWithoutAnchor`를 쓴다. `source="market"|"maturity"`는 각각 `baselineMarketObserved`/`baselineMaturity`만 쓰며 placeholder가 없다.
- Baseline 문장은 높음·인기·품질을 추론하지 않는다. 구조화 결과는 `kind="baseline"`과 선택한 contribution의 `source/group/factorId/value/anchorWorkIds`를 정확히 포함한다. Taste의 `kind="positive"|"caution"`과 discriminated union으로 둔다.

### B7. Baseline 수용 테스트

1. Jaccard identical/disjoint/1/3/empty.
2. favorite/liked, max anchor, 4-EPS 동률 ID, positive-anchor 0개→빈 결과, `genreAnchorScore=0`→`bestAnchorId=null`과 Genre 근거 없음.
3. B2 `.54/.50` 골든과 market/maturity 결측.
4. 공통 eligibility·hard exclusion·catalog-out·duplicate record. context/profile map 접근은 기존 `ownRecordValue` own-property 규칙을 따른다.
5. soft adjustment와 negative reason이 Baseline 점수를 바꾸지 않음.
6. raw 차이가 있어도 공개 q12 score가 같으면 workId asc, q12가 다르면 score desc, 입력 배열·map 순열 결정론.
7. Top 10과 공통 cap/Discovery/후보 부족.
8. ledger 합계·정렬·prior-only 설명 금지.

### E1. 설명 source 선택

- Taste positive reason 후보는 `explainable=true && value>0`인 contribution이다.
- caution 후보는 best Anchor와의 차이를 나타내는 `source="similarity" && explainable=true && value<0`만이다. factor penalty·soft adjustment·policy를 “Anchor와의 차이” 문장으로 바꾸지 않는다.
- Taste 이유 후보는 위 explainable·부호 조건과 함께 `factorId`가 `ExplanationLexicon.factorLabels`에 정의된 Axis/Genre/Theme일 때만 유효하다. 지원하지 않는 factor는 렌더링하지 않는다.
- contribution 안정 fallback은 `source asc → group asc → factorId asc → anchorWorkIds.join("\\0") asc → (negativeReasonId ?? "") asc`다.
- 음수 similarity 후보를 `value asc → contribution 안정 fallback`으로 정렬한 첫 1개만 global caution 후보로 둔다. 다른 음수는 caution 백필 후보가 아니다.
- 모든 positive 후보와 global caution 후보만 합쳐 `abs(value) desc → contribution 안정 fallback`으로 정렬하고 한 번 순회한다. 이미 쓴 coverage group 또는 cluster 후보는 건너뛴다. positive는 최대 3개, caution은 최대 1개만 채운다. 새 “유의미” 수치 threshold는 만들지 않는다.
- global caution이 더 강한 positive와 group/cluster 충돌로 탈락하면 다른 음수로 백필하지 않고 caution을 생략한다. 표시할 때 positive는 `value desc → contribution 안정 fallback`, caution은 별도 한 문장 슬롯이다.
- caution과 positive 전체에서 같은 coverage group을 1회만 쓰고, 아래 cluster도 각각 1회만 쓴다.
  - `tacticalThinking(problemSolving,strategy,mysteryReveal)`
  - `relationshipAppeal(characterArcWeight,relationshipStructure)`
  - `toneLoad(darkness,mentalStress)`
- `{factorLabel}`은 factor가 위 cluster에 속하면 `clusterLabels[clusterId]`, 아니면 `factorLabels[factorId]`를 쓴다. 구조화 identity의 `factorId`는 원래 contribution 값을 유지한다.

### E2. 설명 Anchor와 confidence

- Anchor 구역은 렌더링된 positive reasons를 표시 순서대로 훑고 이어 caution이 있으면 그 contribution을 훑는다. Taste에서는 `source="similarity"`, Baseline에서는 `source="genre"`인 contribution의 저장된 `anchorWorkIds` 순서만 distinct 1~3개 표시한다.
- `source="penalty"`, 렌더링되지 않은 contribution, 제목을 resolve할 수 없는 ID는 Anchor로 표시하지 않는다. 남는 ID가 없으면 bestAnchorId를 임의 보충하지 않고 Anchor 구역을 생략한다.
- confidence는 Taste 추천 결과에만 §6.5 경계를 적용해 정확히 `高い / ふつう / 低め(データ収集中)`로 표시한다. Baseline 구조화 결과에는 confidence가 없다.

### E3. 문자열·domain 경계

- `src/domain/explanation/`은 Taste/Baseline contribution 선택·중복 제거·구조화·placeholder 보간만 수행한다.
- `ExplanationLexicon`을 함수 인자로 받고 `src/lib/strings.ts`의 일본어 Axis/Genre/Theme/cluster/confidence/template 문자열을 script/feature가 주입한다. domain은 lib를 import하지 않는다.
- placeholder 보간은 원본 template의 `{factorLabel}`·`{anchorTitle}` token에 대한 단일 비재귀 pass다. 주입한 label/title 문자열은 다시 token으로 해석하지 않으며, 값 자체에 포함된 같은 token bytes는 설명 단계에서 그대로 보존한다.
- `scripts/run-baseline-experiment.ts`는 순수 문자열 데이터인 `src/lib/strings.ts`를 import할 수 있는 유일한 scripts→lib 예외다. 승인 후 `05` §5 의존 문구도 이 한 예외를 명시한다. 다른 scripts와 harness는 domain·data만 import한다.
- 제목은 catalog의 실제 title resolver를 주입한다. 찾지 못한 ID는 문장에서 생략하며 ID를 제목처럼 출력하지 않는다.

### E4. 구조화 결과와 테스트

각 문장은 text와 함께 `kind`, `source`, `group`, `factorId`, `value`, `anchorWorkIds`를 반환한다. 테스트는 문자열 파싱 대신 이 identity가 입력 contribution에 정확히 존재하는지 검증한다.

- 모든 이유 source가 실제 contribution에 존재한다.
- positive≤3, caution≤1, group/cluster 중복 0.
- caution은 음수 similarity만이다.
- 동일 입력·입력 contribution 순열에서 byte-identical이다.
- 근거 없는 Anchor·factor 문장을 만들지 않는다.

### C1. 실험 profile JSON

```ts
type ExperimentProfileV1 = {
  format: "konocomics-experiment-profile";
  schemaVersion: 1;
  profileId: string;
  records: UserWorkRecord[];
  adjustments: ProfileAdjustments;
  policies: RecommendationPolicies;
};
```

- strict zod. `profileId`는 길이 1~64와 `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`를 모두 만족한다. external reason은 전체 길이 10~64와 `/^external:[a-z0-9]+(?:-[a-z0-9]+)*$/`를 모두 만족한다.
- unknown key와 record workId 중복을 거부한다. `negativeReasons`와 `droppedReasons`는 각각 중복이 없고 두 배열 교집합도 비어야 한다. 두 배열 합집합에 `vagueDislike`가 있으면 합집합 크기는 정확히 1이다.
- `negativeReasons`는 `reaction="disliked"`, `droppedReasons`는 `readingState="dropped"`인 record에만 허용한다.
- catalog 결합 검증에서 모든 workId 존재, positive anchor 5~10개, negative source 0~3개, 네 policy 모두 false를 강제한다. negative source는 `reaction="disliked"`이거나 두 reason 배열 합집합이 비어 있지 않은 distinct record다.
- fixture의 `updatedAt`은 고정 ISO 8601 offset 값이다. profile에는 catalogVersion을 넣지 않아 additive catalog 확장 뒤에도 재사용한다.

### C2. CLI

```text
pnpm experiment:baseline
  --profile, -p <json>   # 반복 가능
  --catalog <json>       # 기본 data/generated/catalog-v1.json
  --context <json>       # 기본 data/generated/recommendation-context-v1.json
  --output, -o <md|->    # 기본 stdout
  --help, -h
```

- profile 인자가 없으면 `data/fixtures/experiment-profiles/*.json`을 읽는다. 명시·기본 profile 모두 파싱 후 `profileId asc`로 출력하고 중복 profileId는 data error 1이다. Top 10은 고정해 `--limit`은 두지 않는다.
- unknown flag·중복 scalar flag는 usage error다. 성공 0, data/runtime error 1, usage error 2다.
- stdout에는 Markdown만, 진단은 stderr만 쓴다.

### C3. 결정론적 Markdown

- UTF-8/LF, 마지막 newline 정확히 1개. 생성 시각·절대 경로·locale 의존 정렬을 넣지 않는다. report metadata에는 `catalogVersion`, `factorDictionaryVersion`, `baselineVersion`, profile 수를 이 순서로 출력한다.
- 순서: report/catalog metadata → profile summary → Taste Top 10 → Baseline Top 10 → diagnostic summary. 별도 rank comparison 절은 만들지 않는다.
- profile summary에는 profileId, reaction weight/workId로 정렬한 anchor, workId/reason enum으로 정렬한 negative source, `AXIS_IDS` 뒤 `THEME_TAGS` 고정 순서의 adjustment만 출력한다. `updatedAt`, progress, 자유서술 문자열은 출력하지 않는다.
- Taste 항목: q12 tasteScore, 숫자 없는 confidence label, best anchor, positive reasons≤3, caution≤1, evidence anchors, penalties, coverage warnings, engine ledger 상위 5.
- Baseline 항목: q12 score, best Genre anchor, contribution-derived reason, Bayesian/maturity, ledger 상위 5. `bestAnchorId=null`은 exact text `なし`로 출력한다.
- coverage는 best anchor pair의 `genre → theme → narrative → tone → art` 순서로 `SHRUNK`(coverage<threshold)와 `PARTIAL`(threshold≤coverage<1)을 구분한다.
- 후보 부족은 `N/10`으로 명시하고 fill을 발명하지 않는다. dynamic text는 Markdown/HTML/control/ANSI escape 후 출력한다.
- diagnostic summary는 Taste 결과 `N/10`, Baseline 결과 `N/10`, Taste Top 10의 전체 best-anchor pair에서 발생한 `SHRUNK` group 수와 `PARTIAL` group 수만 이 순서로 출력한다. Slice 3에는 holdout·승패·G2 지표를 출력하지 않는다.
- q12 숫자는 `roundScore` 뒤 `-0`을 `0`으로 바꾸고 ECMAScript `String(number)` 결과를 출력한다.
- dynamic text escape는 U+0000–001F와 U+007F–009F를 각각 U+FFFD로 바꾸고, `&`, `<`, `>`를 차례로 `&amp;`, `&lt;`, `&gt;`로 바꾼 뒤 `\\`, backtick, `* _ { } [ ] ( ) # + - . ! |` 앞에 backslash를 붙인다.
- Anchor 정렬은 `reactionWeight desc → workId asc`, negative source는 `workId asc → NEGATIVE_REASON_ORDER`, external fallback은 문자열 오름차순이다.
- 같은 입력 2회와 records/reasons/map 순열 입력이 byte-identical이어야 한다.

### C4. 파일 경계와 개인정보

- catalog/context 파일은 각 16 MiB, profile은 각 1 MiB를 초과하면 읽기 전에 거부한다. catalog는 strict `catalogV1Schema` 뒤 `catalog:validate`와 같은 의미 검증, context는 strict zod 뒤 `assertRecommendationContext`의 version·범위·metadata completeness 검증을 통과해야 한다. 실패하면 엔진을 호출하지 않고 data error 1이다.
- CLI는 env/Rakuten/network를 읽지 않는다.
- output은 모든 input과 다른 경로여야 하며 temp file+rename으로 원자적으로 쓴다. 실패 시 기존 output을 바꾸지 않는다.
- 실사용 profile/report는 `data/local/experiment-profiles/`, `reports/local/`에 두고 gitignore한다. 이름·자유서술 불호를 포함한 실사용 파일은 커밋하지 않는다.
- 합성 fixture 3개(`tactical-mystery`, `warm-exploration`, `kinetic-competition`)와 결정론적 report golden만 커밋한다.

## 심사 기준

다음 모두를 만족할 때만 GO다.

1. Baseline이 Taste의 세부 팩터를 몰래 사용하지 않고도 의미 있는 강한 control이다.
2. 두 엔진 비교가 동일 입력·후처리로 공정하며 G1/G2 뒤에 수치를 조작할 여지가 없다.
3. 설명이 contribution 밖 사실을 이유로 만들지 않는다.
4. domain 경계, 문자열 중앙화, 결정론, 개인정보 보호를 지킨다.
5. Slice 3 완료 기준을 넘는 UI·하니스·새 데이터 계층을 만들지 않는다.

## 요구 응답 형식

```text
GO
- baseline validity: PASS
- comparison fairness: PASS
- explanation grounding: PASS
- determinism and privacy: PASS
- minimality: PASS
```

또는

```text
REVISE
- 결정 ID: 문제
- 교체 문구: ...
```
