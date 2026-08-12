# Slice 4 / G2 블라인드 테스트 계약 심사 요청

## 목적과 심사 규칙

이 문서는 `konocomics` G1 통과 뒤 Slice 4 구현 전에 남은 G2 계약을 닫기 위한 **단일 자족 심사 번들**이다. 기존 Taste Engine 산식이나 제품 방향을 다시 정하지 않는다. 이 파일의 동일한 바이트를 Codex 독립 서브에이전트, Gemini, Grok, 로그인된 ChatGPT GPT-5.6 Pro에 제공한다. 심사자는 mutable workspace나 외부 자료를 별도 전제로 삼지 말고 이 문서에 고정된 상위 계약·구현 사실·제안만 판정한다.

네 심사자가 모두 조건 없는 `GO`를 낸 경우에만 아래 계약을 SSOT와 코드에 반영한다. 한 명이라도 `REVISE`이면 제안 번들을 수정하고 네 심사를 처음부터 다시 실행한다.

## 심사 대상 identity

- repository: `fromiron/konocomics`
- branch / review HEAD: `main` / `2e4c5141a14966f1b3f5d706ec5ef9fb33b5b66a`
- review date: `2026-08-12 JST`
- G1 catalog version: `v1-18c883dff5ea`, 정확히 50작품
- `AGENTS.md`: `9ffbd1e817d90ec3998906db904f5f116b8a79dfd73c223558e54d8a46a73a4b`
- `02-product-spec.md`: `a4a472c7689b278df98dc4bf2c6d89efb6f661e80e8fbf40ea766febfbf89631`
- `05-architecture.md`: `16fb7b703a9cf56ef156521ce4b4ad5fb6ffe7e8d29820e928d7588ab0f8f4fb`
- `06-implementation-plan.md`: `7edb3476238afb06e050dba3b8970855f7d6db86258be62701419ffaa7ccfa6b`
- `07-acceptance-test-plan.md`: `f62a605a5bc60358ddcf8cc42c8ce6d008722186e437eca818e9f0fb9312ed5b`
- generated catalog: `6666774f79c1c76674d2addec877d13e8f31886b472959529eb9553435c52a09`
- generated recommendation context: `631e670994ae7d8283231b94ff6cccad8343c75ec36795cec3bf0d6cd2581024`

위 identity에서 Slices 0~3, G1 승인과 `origin/main` 게시가 끝났고 working tree는 clean이다. `harness/`, G2 계약 모듈, G2 집계기, G2 결과 파일은 아직 없다.

## 변경 불가 상위 계약

1. 제품 추천은 `02-product-spec.md` §6의 Taste Engine이고, Baseline v1은 Genre 0.60 + Bayesian 시장 0.30 + maturity 0.10인 G1/G2 전용 control이다.
2. Taste와 Baseline은 동일 catalog/context, profile, holdout 뒤 records, 공통 eligibility/hard exclusion을 받는다. G2 결과를 본 뒤 엔진 수치나 Baseline을 조정하지 않는다.
3. 설명은 각 엔진이 실제 반환한 explainable contribution으로만 생성한다. 런타임 LLM은 없다.
4. `unknown` 팩터는 수치로 추정하지 않는다. domain은 순수·결정론적이고 시간·난수·I/O를 직접 사용하지 않는다.
5. G2는 150작품, 출처 은닉, 설명 공개 전/후 2단 설문이다. 사람 경로의 방향성 기준은 Taste≥Baseline 사용자 7/10 이상, Unknown Want-to-Read 우세, Taste Explanation Agreement 70% 이상, Disliked Leakage 악화 없음, Holdout Recall@10 열세 없음이다. 통계적 유의성을 주장하지 않는다.
6. 150작품의 role 범위는 Anchor 30~40 / Bridge 30~40 / Discovery 70+이다. 기존 승인 50작품을 임의 교체·약화하지 않고 100작품을 추가한다.
7. G2 GO 전에는 제품 UI Slice 5를 시작하지 않는다.
8. 하니스는 배포하지 않는 별도 `harness/` 로컬 앱이다. 제품 `/src/app` 아래에 하니스 페이지를 만들지 않는다.
9. 제품 서버 코드는 `/api/rakuten/search`, `/api/rakuten/item`뿐이다. 하니스도 API, server action, DB, auth, analytics, network, 비밀키를 추가하지 않는다.
10. UI 문자열은 일본어이고 `src/lib/strings.ts`가 소유한다. 새 의존성을 추가하지 않는다.

## 현재 구현에서 그대로 재사용할 것

- strict `ExperimentProfileV1`: profileId, records, adjustments, 네 policy=false. 현재 5~10 positive anchor 계약은 Slice 3용이므로 변경하지 않고 G2 wrapper가 6~10을 추가 검증한다.
- Taste `rankRecommendations`, Baseline `rankBaselineRecommendations`, contribution 기반 설명기.
- catalog/context strict Zod 검증, 16 MiB 경계, fatal UTF-8 JSON read, private sibling temp + rename 원자 출력.
- SHA-256은 Web Crypto 또는 Node `crypto`, 정렬은 ECMAScript code-unit 비교, 수치는 기존 q12 `roundScore`를 사용한다.

---

## 제안 계약

### G2-1. 참가자 유입과 identity

1. 하니스는 같은 client wizard를 사용하는 두 개의 문서화된 정적 진입점 `/human/`과 `/synthetic-pilot/`을 제공한다. 진입점은 wizard 시작 전에 respondent를 고정하며 실행 중 변경할 수 없다. `/human/`은 정확히 `{ kind: "human" }`, `/synthetic-pilot/`은 정확히 `{ kind: "syntheticPilot", label: "manual-round-trip" }`을 결과에 기록한다. 두 진입점은 engine identity나 A/B mapping을 final submit 전에 노출하지 않는다.
2. 두 진입점의 첫 단계는 다음 두 입력만 받는다.
   - `participantId`: 길이 1~64, `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`인 가명 ID.
   - 로컬 `ExperimentProfileV1` JSON 파일 1개.
3. respondent를 정하는 query/hash, 숨은 control, 빌드 환경값, 파일 내용 추론, 결과 편집 경로는 허용하지 않는다.
4. profile은 기존 strict schema를 통과하고 `profile.profileId === participantId`여야 한다. positive anchor는 6~10개, distinct negative source는 0~3개, 네 policy는 모두 false여야 한다.
5. 모든 record workId는 catalog에 있어야 한다. positive anchor는 `recommendationEligible=true`여야 하고, G2-2의 holdout 뒤 공통 후보 필터에서 선택된 holdout이 다시 후보가 되지 못하는 profile은 입력 오류다.
6. profile import는 Slice 4의 의도된 입력 surface다. 프로필 작성 UI, 계정, 이메일, 비밀번호, Google 로그인, 서버 저장은 범위 밖이다. 고정 더미 이메일도 결과나 DOM에 저장하지 않는다. 장기 Google 계정 지원은 별도 post-MVP 결정이며 이 로컬 검증 계약의 식별자나 auth 추상화를 만들지 않는다.
7. participantId는 한 집계 안에서 고유하다. 표시명·실명·이메일·자유서술 개인정보는 수집하지 않는다.

### G2-2. 결정론적 holdout

1. `positiveAnchorCount`는 catalog에 존재하는 distinct `favorite | liked` record 수다. G2에서는 6~10만 허용한다.
2. `holdoutCount = min(2, positiveAnchorCount - 5)`다. 따라서 6개면 1개, 7~10개면 2개를 holdout하고 엔진에는 항상 최소 5개 anchor가 남는다.
3. 각 positive anchor의 key는 다음 UTF-8 바이트의 SHA-256 lowercase hex다.

   ```text
   konocomics-g2-holdout-v1\0{catalogVersion}\0{participantId}\0{workId}
   ```

4. key 오름차순, 동률이면 code-unit workId 오름차순으로 정렬한 첫 `holdoutCount` record를 고른다.
5. 선택한 **record 전체**를 두 엔진에 전달할 records에서 제거한다. 다른 record·adjustment·policy는 바꾸지 않는다. 이로써 holdout 작품은 공통 eligibility/hard exclusion을 통과할 때 양 엔진의 후보로 복원된다.
6. holdout workId는 위 선택 순서로 저장한다. 별도 seed, 현재 시간, 난수, 재추첨은 없다.

### G2-3. 엔진 실행, native list, A/B 배치

1. 같은 post-holdout input으로 Taste와 Baseline을 각각 정확히 한 번 실행한다. 각 엔진이 반환한 native rank 1~10을 그대로 사용한다. 리스트가 10개 미만이면 실제 N개만 사용하고 낮은 후보나 다른 엔진 결과로 채우지 않는다.
2. 두 리스트를 union, 교차 dedupe, 재정렬, interleave하지 않는다. 같은 work가 두 엔진에 있으면 각 native rank에 그대로 남는다.
3. slot digest는 다음 UTF-8 바이트의 SHA-256이다.

   ```text
   konocomics-g2-slot-v1\0{catalogVersion}\0{participantId}
   ```

4. digest 첫 byte가 짝수면 Taste=`A`, Baseline=`B`; 홀수면 Taste=`B`, Baseline=`A`다. 사용자 표시는 정확히 `リストA`, `リストB`다.
5. rank는 각 native list의 1부터 N까지 보존한다. 한 리스트 안 workId 중복은 오류다.

### G2-4. 블라인딩과 단계 전환

1. pre 단계에는 두 리스트의 title/cover/native rank와 작품별 질문만 보인다. engine 이름, score, confidence, best anchor, contributions, penalty, market, maturity, catalog role은 보이지 않는다.
2. 이 비밀 정보는 final submit 전 visible text, accessible name/description, DOM text, `data-*`, id/class name, URL/query/hash, JSON-LD, console log, 다운로드 파일에 넣지 않는다. 로컬 client bundle을 역분석하는 적대적 보안은 목표가 아니지만 일반 UI·DOM 검사로 출처를 알 수 없어야 한다.
3. 모든 pre 응답과 A/B/tie 선택을 확정한 뒤에만 after 단계로 간다. 뒤로 가서 pre 값을 바꿀 수 없다.
4. after 단계는 같은 두 native list/rank를 유지하고 contribution 기반 설명을 공개한다. 설명이 없으면 exact Japanese copy `説明はありません。`를 표시한다. 이 단계에서도 engine identity는 숨긴다.
5. 모든 after 응답을 final submit한 뒤에만 A/B mapping을 debrief하고 canonical result JSON을 다운로드할 수 있다.
6. 새로고침·닫기는 draft를 영속하지 않는다. 로컬 파일·DB·브라우저 storage 없이 다시 시작한다.

### G2-5. 질문과 exact Japanese scale

pre 단계에서는 distinct work마다 familiarity와 wantToReadBefore를 각각 정확히 한 번 필수 응답한다. distinct work 순서는 `リストA` rank 순서의 첫 등장 뒤 `リストB` rank 순서의 새 work 첫 등장 순서다. 모든 distinct-work 응답을 확정한 뒤 listPreference를 참가자당 정확히 한 번 필수 응답한다.

1. familiarity — `この作品を知っていましたか？`
   - `read`: `読んだことがある`
   - `knownUnread`: `知っているが未読`
   - `unknown`: `知らなかった`
2. wantToReadBefore — `今、この作品を読みたいですか？`
   - 1 `まったく読みたくない`
   - 2 `あまり読みたくない`
   - 3 `どちらともいえない`
   - 4 `読みたい`
   - 5 `とても読みたい`
3. listPreference — `説明を見る前のおすすめ一覧として、どちらが自分に合っていますか？`
   - `A`: `リストA`
   - `B`: `リストB`
   - `tie`: `同じくらい`

after 단계에서는 slot/rank/work occurrence마다 다음을 응답한다. 순서는 A rank 1~N, B rank 1~N이다.

1. wantToReadAfter — pre와 같은 질문·1~5 scale, 필수.
2. agreement — `このおすすめ理由は、あなたの好みとの関係を正しく説明していますか？`
   - 1 `まったく当てはまらない`
   - 2 `あまり当てはまらない`
   - 3 `どちらともいえない`
   - 4 `当てはまる`
   - 5 `とても当てはまる`
3. 해당 occurrence에 실제 설명이 있으면 agreement 1~5가 필수다. 설명이 없으면 agreement 질문을 표시하지 않고 값은 반드시 `null`이다.
4. 같은 work가 A/B 양쪽에 있어도 familiarity와 wantToReadBefore는 공유 응답 한 개다. wantToReadAfter와 agreement는 slot/rank/work별 별도 응답이다.

### G2-6. 결과 schema와 canonical file boundary

구조는 아래 의미를 정확히 따른다. 구현은 strict Zod object와 literal/enum/int 범위를 사용한다.

```ts
type G2ResultV1 = {
  format: "konocomics-g2-result";
  schemaVersion: 1;
  contractVersion: "g2-v1";
  participantId: string;
  respondent:
    | { kind: "human" }
    | { kind: "syntheticPilot"; label: "manual-round-trip" };
  catalogVersion: string;
  factorDictionaryVersion: "v1";
  baselineVersion: "v1";
  profile: ExperimentProfileV1;
  holdoutWorkIds: string[];
  slots: {
    A: {
      engine: "taste" | "baseline";
      items: { rank: number; workId: string; explanationAvailable: boolean }[];
    };
    B: {
      engine: "taste" | "baseline";
      items: { rank: number; workId: string; explanationAvailable: boolean }[];
    };
  };
  preResponses: {
    workId: string;
    familiarity: "read" | "knownUnread" | "unknown";
    wantToReadBefore: 1 | 2 | 3 | 4 | 5;
  }[];
  listPreference: "A" | "B" | "tie";
  postResponses: {
    slot: "A" | "B";
    rank: number;
    workId: string;
    wantToReadAfter: 1 | 2 | 3 | 4 | 5;
    agreement: 1 | 2 | 3 | 4 | 5 | null;
  }[];
};
```

1. result는 최대 1 MiB regular file, fatal UTF-8, BOM 없음, LF only다. exact serialization은 `JSON.stringify(validatedValue, null, 2) + "\n"`이다.
2. key insertion order는 위 type의 field order, slot은 A→B, arrays는 G2-2/G2-3/G2-5 순서다. input bytes를 parse·strict validate·재직렬화한 bytes와 비교해 canonical이 아니면 거부한다. 이로써 duplicate JSON member, CRLF, key reorder, extra whitespace도 허용하지 않는다.
3. aggregator는 제출된 파생값을 신뢰하지 않는다. 제공된 catalog/context와 embedded profile로 다음을 재계산하고 byte/identity가 다르면 전체 파일을 거부한다: profile/participant 결합, holdout, post-holdout records, Taste/Baseline native list, slot mapping, rank/work, explanation availability, pre/post required key set과 순서, agreement null 규칙.
4. catalog/context는 각각 기존 16 MiB strict 경계와 semantic validation을 통과해야 한다. `catalogVersion`, factor dictionary, Baseline version, context catalogVersion이 result와 모두 같아야 한다.
5. 한 집계의 duplicate participantId와 duplicate input path/identity를 거부한다. result와 output 경로는 달라야 하며 output은 기존 private temp + atomic rename을 재사용한다.
6. result에는 설명 text, score, contribution, 실명, 이메일, 자유서술을 저장하지 않는다. aggregator가 current frozen engine에서 explanation availability만 재계산한다.

### G2-7. 공통 occurrence와 leakage 판정

1. metric occurrence는 `(participantId, engine, native rank, workId)`다. 같은 work가 양 엔진 list에 있으면 엔진별 한 번씩 센다. 같은 work의 pre 응답은 두 occurrence가 같은 값을 참조한다.
2. Disliked Leakage는 두 엔진 모두 같은 순수 predicate를 사용한다. candidate마다 remaining positive anchors로 `calculatePositiveAnchorScore`를 계산해 그 candidate의 Taste best positive anchor를 고르고, 기존 `calculateNegativePenalties`의 factor-backed reason trigger를 평가한다.
3. `FACTOR_BACKED_NEGATIVE_REASON_IDS` 중 하나 이상이 trigger되면 leakage다. `vagueDislike`, `external:*`, 단순 disliked reaction만 있고 factor-backed reason이 없는 record는 leakage predicate에 쓰지 않는다.
4. 이 predicate는 list를 만든 엔진이나 그 엔진의 contribution/bestAnchor를 보지 않는다. 따라서 Baseline occurrence도 Taste occurrence와 동일 candidate/profile predicate로 판정한다.

### G2-8. 지표의 정확한 분자·분모

모든 aggregate count는 유효한 `respondent.kind="human"` 결과만 사용한다. 각 rate는 분자/분모 integer를 보존하고 표시에만 q12를 적용한다. 비교와 70% threshold는 반올림 값이 아니라 integer cross multiplication으로 판정한다.

1. **사용자별 승패**
   - listPreference slot을 hidden mapping으로 해석해 `taste | baseline | tie`로 저장 없이 계산한다.
   - `tasteOrTieCount = tasteWinCount + tieCount`다. 사람 GO는 정확히 10명 중 `tasteOrTieCount >= 7`이다.
   - strict `tasteWinCount`도 별도 보고하지만 threshold는 두지 않는다.
2. **Unknown Want-to-Read Rate(engine)**
   - denominator: 해당 engine occurrence 중 familiarity=`unknown`인 수.
   - numerator: 그중 wantToReadBefore≥4인 수.
   - 같은 overlap work는 각 engine에 한 번씩 센다. denominator 0이면 rate=`null`이다.
   - 사람 GO는 두 denominator가 모두 >0이고 Taste fraction이 Baseline fraction보다 **strictly greater**여야 한다.
3. **Explanation Agreement(engine)**
   - denominator: 해당 engine의 전체 native list occurrence 수. 설명이 없는 occurrence도 포함한다.
   - numerator: explanationAvailable=true이고 agreement≥4인 occurrence 수.
   - 설명 없음은 agreement=null이며 numerator가 아니므로 누락 설명이 rate를 부풀리지 않는다.
   - 사람 GO는 Taste denominator>0이고 Taste numerator/denominator≥0.70이다. Baseline rate는 diagnostic이다.
4. **Explanation Lift(engine)**
   - 실제 explanationAvailable=true인 occurrence의 `wantToReadAfter - wantToReadBefore` 산술평균이다.
   - denominator 0이면 null이다. explanation availability count도 함께 보고한다. 방향 진단용이며 GO threshold는 없다.
5. **Disliked Leakage@10(engine)**
   - denominator: 해당 engine의 전체 native list occurrence 수.
   - numerator: G2-7 predicate가 true인 occurrence 수.
   - denominator 0이면 null이다. 사람 GO는 두 denominator>0이고 Taste fraction≤Baseline fraction이다.
6. **Holdout Recall@10(engine)**
   - denominator: 모든 participant의 holdoutWorkIds 수 합.
   - numerator: 해당 engine native list에 복구된 holdout work 수. 한 participant의 holdout은 distinct이고 engine당 최대 한 번 센다.
   - valid human result가 있으면 denominator는 항상 >0이어야 한다. 사람 GO는 Taste fraction≥Baseline fraction이다.
7. per-participant raw counts와 preference verdict를 participantId code-unit 순으로 함께 보고한다. aggregate는 participant마다 먼저 rate를 평균내는 macro 변형을 GO 판정에 쓰지 않는다.

### G2-9. 집계 CLI와 verdict

문서화된 호출은 lifecycle noise가 stdout에 섞이지 않게 다음으로 고정한다.

```text
pnpm --silent g2:aggregate
  --result, -r <json>   # 반복 가능
  --catalog <json>      # 기본 data/generated/catalog-v1.json
  --context <json>      # 기본 data/generated/recommendation-context-v1.json
  --output, -o <md|->   # 기본 stdout
  --help, -h
```

1. result 미지정 시 `data/local/g2-results/*.json`을 읽는다. 명시·기본 result 모두 parse 뒤 participantId 오름차순이다.
2. unknown flag, duplicate scalar flag는 usage error 2; data/runtime error 1; 성공 0이다. stdout은 deterministic Markdown만, 진단은 stderr만 쓴다.
3. report 순서는 identity/catalog metadata → accepted human/pilot counts → five GO criteria table → aggregate metric counts/rates → participant rows → diagnostics(Explanation Lift/coverage)다. 생성 시각, 절대 경로, locale, env, 네트워크, 자유서술은 없다. LF와 마지막 newline 1개다.
4. exactly 10 unique complete human result면 G2-8의 다섯 criterion을 모두 계산해 모두 PASS일 때만 `GO`, 아니면 `REVISE`다. human이 10명이 아니면 `INCOMPLETE`; 숫자 기준을 통과한 것처럼 표시하지 않는다.
5. `syntheticPilot` result는 round-trip 검증과 diagnostic에만 표시하고 모든 human 분자·분모·10명 수에서 제외한다. pilot만으로 GO/REVISE를 만들지 않는다.

### G2-10. 사람 경로와 사용자 승인 모델 패널 경로

두 경로를 혼합하거나 같은 의미로 보고하지 않는다.

1. **Human path**
   - 정확히 10개의 고유하고 완전한 `respondent.kind="human"` result와 G2-8/G2-9 숫자 기준으로만 GO/REVISE한다.
   - 결과 문구는 `humanValidation: "complete"`, `decisionBasis: "ten-human-blind-test"`다.
2. **User-authorized model-panel path**
   - 10명 human response나 숫자 metric을 만들지 않는다. `authorizedModelProxy` row도 만들지 않는다.
   - 한 개의 `syntheticPilot`은 UI→download→aggregator round-trip 증거일 뿐 participant evidence가 아니다.
   - frozen 150-work catalog/context, engine identity, 구현 diff, contract/metric tests, deterministic aggregate output, manual pilot 증거를 하나의 hash manifest로 묶어 Local/Gemini/Grok/GPT-5.6 Pro 네 reviewer에게 동일 제공한다.
   - 네 reviewer의 hash-bound unqualified GO와 현재 사용자의 사전 승인으로만 product direction gate를 열 수 있다. 한 reviewer라도 REVISE이면 열지 않는다.
   - 결정 artifact는 exact `humanValidation: "not-run"`, `decisionBasis: "user-authorized-model-panel"`을 기록하고 human metrics는 `null`/`not-run`으로 둔다. “10명 다독자 통과”, 통계적 우세, human preference validation을 주장하지 않는다.
   - 이 GO는 Slice 5 진행을 허용하는 사용자 승인 제품 결정이지, 실행하지 않은 human criteria의 대체 측정값이 아니다.

### G2-11. 최소 architecture와 테스트 경계

1. `harness/`는 root 앱과 분리된 local-only Next static export다. 한 client wizard가 profile/participant 입력 → pre 설문 → after 설문 → final/debrief/download를 수행한다.
2. root에 이미 설치된 Next/React/Zod와 기존 catalog/profile/rank/baseline/explanation/I/O 의미를 재사용한다. 새 dependency, API, server action, DB, auth, analytics, generalized survey framework를 만들지 않는다.
3. 순수 holdout/slot/result/metric logic은 한 G2 domain module에 둔다. I/O와 CLI glue는 `scripts/`에 둔다. 하니스는 이 순수 logic과 generated data를 사용한다.
4. `05-architecture.md`의 예외를 좁게 수정해 `harness -> src/lib/strings.ts`를 허용한다. 이는 일본어 copy 중앙화를 위한 read-only data import이며 다른 `src/lib` import는 허용하지 않는다.
5. `07-acceptance-test-plan.md`의 “harness 자동 테스트 제외”는 harness UI E2E/visual regression을 뜻한다. 순수 G2 schema/holdout/slot/overlap/metric denominator/tie/null/tamper/canonical JSON과 aggregator boundary/golden tests는 필수다.
6. 한 개의 `syntheticPilot`을 실제 브라우저 의도 surface에서 끝까지 입력하고 JSON download → CLI aggregate → authoritative report readback까지 수동 수행한다. 직접 state 조작이나 test-only route로 대체하지 않는다.
7. 150-work expansion은 기존 `data/source` pipeline과 evidence 정책을 사용한다. 별도 merger나 G2-only catalog를 만들지 않는다.

## 구현 완료 기준

계약 GO 뒤 Slice 4 구현은 다음이 모두 참일 때만 G2 evidence review로 넘어간다.

1. 승인 50 + evidence-complete 100 = 정확히 150 recommendation-eligible works, role 30~40 / 30~40 / 70+, catalog validate/build/coverage 통과.
2. 같은 input에서 holdout/list/slot/result/report가 byte-identical이고 input 배열·map 순열에도 semantic 결과가 같다.
3. 두 엔진은 동일 post-holdout input과 공통 후보 계약을 사용한다.
4. pre/final 전 DOM에 숨겨야 할 정보가 없고 overlap 응답 cardinality가 계약과 같다.
5. canonical output을 변조하면 aggregator가 재계산 mismatch로 거부한다.
6. root typecheck/lint/test/build/catalog gates, harness static build, G2 aggregate golden, `git diff --check`가 통과한다.
7. browser manual pilot download를 aggregator가 accepted pilot 1개로 read back한다. 이 pilot은 human metric에 들어가지 않는다.
8. G2 evidence panel 전에 SSOT, implementation, test, built artifact identity와 hash manifest를 동결한다.

## 심사 기준

다음이 모두 만족될 때만 `GO`다.

1. holdout과 두 엔진 비교가 공정하고 결과를 본 뒤 조작할 여지가 없다.
2. blinding, overlap, pre/post 응답 cardinality가 구현 가능한 수준으로 닫혔다.
3. 모든 GO metric의 분자·분모·tie/null/missing 규칙이 보수적이고 byte-for-byte 구현 가능하다.
4. strict/canonical file과 cross-field recomputation이 변조나 다른 artifact 혼입을 막는다.
5. human path와 사용자 승인 model-panel path가 정직하게 분리되고 가짜 응답이나 미실행 human claim이 없다.
6. 기존 domain/서버/문자열/의존성 경계를 보존하면서 Slice 4의 가장 작은 완전 구현이다.
7. G2 GO 전 제품 UI를 시작하지 않고, 실제 browser pilot과 authoritative aggregate readback을 요구한다.

## 요구 응답 형식

```text
GO
- comparison fairness: PASS
- blinding and survey cardinality: PASS
- metrics and gate semantics: PASS
- canonical boundary and determinism: PASS
- provenance honesty: PASS
- architecture and minimality: PASS
```

또는 다음과 같이 응답한다.

```text
REVISE
- G2-n: 구체적 문제
- 교체 문구: 바로 적용 가능한 완전한 문구
```

모호한 우려, 선택적 제안, “GO이지만” 조건은 unqualified GO가 아니며 `REVISE`로 취급한다.
