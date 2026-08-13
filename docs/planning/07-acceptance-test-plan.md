# 07 — 수용 테스트 계획 (Acceptance Test Plan)

> 최소 신뢰 가능한 검증 전략. 매트릭스 완결성이 아니라 실제 계약 보호가 목적이다.
> 자동화 계층: 유닛(Vitest) / 컴포넌트(Testing Library) / E2E(Playwright) / 정적 검사 / 수동 QA.

---

## 1. 정적 검사 (CI 매 커밋)

- `tsc --noEmit` (strict) / ESLint (domain 계층 격리 규칙 포함: domain이 react·dexie·next를 import하면 실패) / Prettier check.
- **`catalog:validate`를 CI 게이트로:** 검증 실패 데이터는 빌드 자체가 실패한다. 검사 항목 — ID·ISBN 중복, 팩터 범위·상태 오류, centrality 범위, eligibility 충돌, 추천 대상 coverage 미달, evidence 누락, 대표 volume 누락.

## 2. 추천 엔진 유닛 테스트 (가장 두터운 계층)

계약 목록 (각각 독립 픽스처):

1. 읽음(completed)·하차·숨김·興味なし 작품이 후보에서 제외된다.
2. Hard Exclusion(除外 축·테마, 미완결 제외 정책)이 점수 계산 전에 적용된다.
3. Coverage 미달 그룹만 0.5로 수축하고, **가중치가 다른 그룹으로 재분배되지 않는다** (Art 전부 unknown인 후보의 Genre 기여가 변하지 않음을 명시 검증).
4. notApplicable이 기대 분모에서 제외되고 unknown은 포함된다.
5. presence-sensitive 축(darkness/mentalStress/romance)의 0↔양수 거리 ×1.5.
6. 소수 취향 보존: 8개 anchor 중 1개만 이질적인 프로필에서, 그 anchor와 유사한 후보가 Top 10에 생존한다.
7. Consensus Bonus 상한 +0.05. 동일 성향 anchor를 8개로 늘려도 점수가 폭발하지 않는다.
8. 부정 사유 12종 각각: 감점 조건을 만족하는 후보만 감점되고, unknown 팩터 후보는 감점되지 않는다. 합계 cap 0.25.
9. 외부적 하차 사유(`external:*`)는 어떤 감점도 만들지 않는다.
10. vagueDislike는 `maxSim × 0.08`이며 이유 있는 불호와 중복 적용되지 않는다.
11. explicitAdjustment: 축값 4/2/0에서 +s/0/−s, 총합 ±0.12 clamp, unknown 축 0.
12. market tie-break: tasteScore 차 0.025 경계의 양쪽 동작. 정책 미선택 시 maturity가 순위를 뒤집지 않는다.
13. 리스트 제약: 동일 best Anchor ≤4, 동일 Theme 조합 ≤3, 동일 시리즈 ≤1, Discovery는 top−0.10 이내.
14. **결정론:** 동일 입력 2회 호출 → 완전 동일 출력(순서 포함).
15. **설명-기여 일치:** Taste `kind=positive|caution`, Baseline `kind=baseline`의 discriminated 구조화 문장에서 source/group/factor/value/anchor ID와 optional Axis preference direction이 실제 contribution과 byte-identical하다. positive≤3, caution≤1, group/Cluster당 1개이며 caution은 전역 최대 음수 similarity 하나만 후보가 된다. `less`×낮은 Axis의 양수 contribution은 낮은 정도가 취향과 맞는다는 전용 문장을 쓰고, Axis adjustment의 direction이 빠지면 일반 positive로 추정하지 않는다. 근거 Anchor는 렌더링된 similarity/Genre contribution에서만 온다.
16. confidence: 산식 값과 반올림 전 값 기준 3단 레이블 경계(0.5 / 0.75). 공개 q12 숫자가 경계로 반올림돼도 레이블은 바뀌지 않는다.
17. 20작품 골든 스냅샷: 산식 수치 변경 시 순위 변화가 리뷰에 드러난다.

### Slice 3 Baseline·CLI 추가 계약

1. Baseline Genre Jaccard identical/disjoint/1/3/empty와 favorite/liked reaction weight.
2. `0.60 Genre + 0.30 Bayesian/5 + 0.10 maturity`의 `.54/.50` 골든, 모든 공개 수치 q12, zero contribution 생략, score tie와 contribution 합 오차≤1e-11.
3. positive anchor 0개는 빈 결과, Genre overlap 0은 bestAnchorId null·고유 cap key·Genre 근거 없음.
4. Taste와 동일 eligibility·hard exclusion·D13 기본 cap. soft adjustment·negative reason은 Baseline score에 영향 없음.
5. prior-only market은 ledger에는 존재하지만 설명 불가. Baseline reason은 explainable contribution 중 안정 정렬 첫 1개뿐이며 `kind=baseline` identity 전체가 원 contribution과 같다.
6. 작품·record·reason·map 입력 순열과 같은 profile 2회 실행의 결과 JSON/Markdown byte 동일.
7. strict profile regex·reason/state·count 불변식, 1/16 MiB pre-read cap, catalog 의미 검증과 context completeness 거부 경계.
8. CLI unknown/duplicate flag와 0/1/2 exit code, 문서화된 `--silent` package-manager 호출의 stdout=golden, input=output·symlink alias 거부, temp+rename 실패 시 기존 output 불변.
9. 합성 3 profile report golden + 상호 보완 unknown 축 pair의 coverage warning golden: UTF-8/LF/단일 final newline, exact q12·escape, Taste/Baseline Top 10, ledger 상위 5, SHRUNK/PARTIAL, 후보 부족 N/10.

## 3. Catalog·데이터 유닛 테스트

- zod 스키마 라운드트립(catalog JSON, Export v1, Rakuten 응답 축소형).
- 일본어 정규화 골든 케이스(NFKC·가나·전각/반각·권수 토큰 10례 이상).
- Export→Import 라운드트립: 임의 상태 생성 → export → import → Dexie 상태 동등.
- Import 거부: schemaVersion 2 / 필드 손상 / 부분 손상 배열 — 모두 기존 데이터 불변.
- providerCache TTL: 만료 판정(시간 주입) 경계.
- Route Handler: 쿼리 검증 400, 필드 축소, `_ex` 재작성, 타임아웃→502.

### G1 데이터 게이트 추가 계약

1. cohort manifest는 정확히 50개의 서로 다른 `recommendationEligible` Work만 허용한다. 49·51개, 중복 ID, eligibility 불일치, manifest 밖 추천 작품은 각각 실패한다.
2. Art evidence 픽스처는 원권리 출판사·정식 라이선스 해외 출판사·출판사 승인 플랫폼을 허용하고, 권리 관계 미확인·표지만 존재·판독 가능한 내부 페이지/동등 프레임 6개 미만·2개 미만 맥락·정적 축당 2개 미만 참조·연속 동작 없는 known `motionImpact`·정확한 페이지/타임코드 또는 판본 관계 누락을 거부한다. 근거 미달 축은 `unknown`이어야 하며 이를 `notApplicable`로 바꾸거나 coverage 0.30 통과로 검사를 우회하지 못한다.
3. 후보 빌드 중 어느 검사에서 실패해도 기존 후보와 source가 byte-identical하고 임시 파일만 정리된다. 성공 시에는 같은 manifest의 완전한 파일 집합만 한 번에 게시된다.
4. 같은 manifest·정책 버전은 항상 같은 15~20% 블라인드 표본을 만들고 표본은 cohort의 부분집합이며 입력에 원점수가 없다. cohort 또는 정책 버전 변경은 기존 표본을 무효화하고 새 표본을 만든다.
5. replacement selector는 Art·시장·리뷰·추천 결과를 입력받지 않고, unknown pair를 건너뛰며, shared-known 9축·Narrative/Tone 경계를 강제한다. 후보 입력 순열에도 동일한 합산 거리·code-unit tie-break 결과를 내고, Genre·central Theme·non-Art 최솟값/최댓값·점유 value bin 보존 실패 조합은 다음 순위로 넘긴다.

## 4. Slice 4 / G2 계약 테스트

### 순수 G2 domain 유닛 테스트

1. **입력·identity:** `participantId`의 길이 1~64와 `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, `profile.profileId === participantId`, catalog에 존재하는 서로 다른 positive anchor 6~10개, distinct negative source 0~3개, 네 policy `false`, 모든 record의 catalog 소속을 검증한다. positive anchor가 `recommendationEligible=false`이거나 선택된 holdout이 post-holdout 공통 후보로 복원될 수 없으면 거부한다. `human`과 exact `syntheticPilot/manual-round-trip` 외 respondent 변형, 이메일·표시명·자유서술 필드는 거부한다.
2. **결정론적 holdout:** positive anchor가 6개면 1개, 7~10개면 2개를 고르고 항상 5개 이상을 남긴다. `konocomics-g2-holdout-v1\0{catalogVersion}\0{participantId}\0{workId}`의 UTF-8 SHA-256 lowercase hex와 code-unit workId tie-break로 선택 순서를 검증한다. 선택된 record 전체만 양 엔진 입력에서 빠지고 다른 record·adjustment·policy는 byte-identical하다. 입력 record 순열에도 holdout과 post-holdout profile이 같고 시간·난수·별도 seed를 사용하지 않는다.
3. **native list·slot:** 같은 post-holdout input으로 Taste와 Baseline을 각각 한 번 실행하고 각 native 1~10위(10개 미만이면 실제 N개)를 보존한다. union·교차 dedupe·재정렬·interleave·다른 결과로 채우기가 없고, overlap 작품은 양쪽 native rank에 남는다. `konocomics-g2-slot-v1\0{catalogVersion}\0{participantId}` digest 첫 byte의 짝/홀수에 따라 Taste의 A/B가 정확히 바뀌며 각 slot의 연속 rank와 workId 무중복을 검증한다.
4. **설문 cardinality:** distinct work 순서가 A의 첫 등장 뒤 B의 새 work 첫 등장 순서이고, familiarity와 `wantToReadBefore`는 work당 정확히 한 번이다. `listPreference`는 참가자당 한 번이며 A/B/tie만 허용한다. `postResponses`는 A rank 순서 뒤 B rank 순서의 occurrence별 한 개다. overlap 작품도 post 응답은 slot/rank/work별로 분리한다. 설명이 있으면 agreement 1~5가 필수이고, 없으면 정확히 `null`이며 질문 대상에서도 제외된다. pre/after의 1~5 범위와 required key set·순서를 검증한다.
5. **strict result schema·canonical 값:** format/schema/contract/catalog/factor dictionary/Baseline version literal, respondent discriminated union, slot·rank·work·설명 availability, pre/post 응답의 strict object와 정수 범위를 검증하고 extra/누락 필드를 거부한다. key insertion order, A→B slot, 계약 순서의 배열을 사용한 `JSON.stringify(validatedValue, null, 2) + "\n"`가 동일 입력에서 byte-identical하다.
6. **교차 필드 재계산·변조 거부:** embedded profile과 제공된 catalog/context로 participant/profile 결합, holdout, post-holdout records, 두 native list, A/B mapping, rank/work, explanation availability, pre/post key set·순서와 agreement null 규칙을 다시 계산한다. holdout·slot·rank·work·설명 availability·응답 중 하나라도 바꾸거나 다른 catalog/context/version을 섞은 canonical JSON을 모두 거부한다.
7. **공통 leakage predicate:** metric occurrence를 `(participantId, engine, native rank, workId)`로 센다. remaining positive anchor와 기존 positive-anchor score/negative-penalty 계산으로 Taste와 Baseline occurrence에 같은 predicate를 적용하며 factor-backed negative reason만 leakage가 된다. `vagueDislike`, `external:*`, 이유 없는 disliked와 unknown factor는 leakage를 만들지 않는다.
8. **지표 분자·분모:** overlap은 엔진별 occurrence로 한 번씩 세되 공유 pre 응답을 참조한다. Unknown Want-to-Read는 unknown occurrence 중 before≥4, Agreement는 설명 없는 occurrence도 전체 분모에 포함하고 설명 있음+agreement≥4만 분자, Lift는 설명 있는 occurrence의 after−before 평균, Leakage는 전체 native occurrence, Holdout Recall은 전체 holdout 수를 분모로 계산한다. 각 denominator 0의 `null`, tie의 `tasteOrTieCount` 포함, strict Taste 우세, `≤`/`≥`, 70% integer cross multiplication 경계를 각각 검증한다. participant별 macro 평균은 GO 판정에 쓰지 않는다.
9. **respondent와 verdict 분리:** 모든 aggregate count에서 `syntheticPilot`을 제외한다. 정확히 10개의 고유하고 완전한 human 결과일 때만 다섯 기준을 계산해 전부 PASS면 `GO`, 하나라도 실패하면 `REVISE`이고, human 수가 10이 아니면 `INCOMPLETE`다. strict Taste win은 진단으로만 보고하며 tie를 제외한 별도 threshold를 만들지 않는다.

### G2 aggregator 경계·골든 테스트

1. result는 최대 1 MiB regular file, fatal UTF-8, BOM 없음, LF only여야 한다. parse·strict validate·재직렬화한 bytes가 원본과 같아야 하며 duplicate JSON member, CRLF, key reorder, extra whitespace, 마지막 newline 누락·중복을 거부한다.
2. catalog/context는 각각 기존 16 MiB·strict schema·semantic validation을 통과하고 result의 catalog/factor dictionary/Baseline version 및 context catalogVersion과 일치해야 한다. 제출된 파생값을 신뢰하지 않고 순수 G2 검증기로 전부 재계산한다.
3. 중복 `participantId`, 중복 input path/identity, result와 output의 동일 경로·symlink alias를 거부한다. output은 private sibling temp + atomic rename을 사용하며 검증·쓰기·rename 실패 시 기존 output은 byte-identical하고 temp만 정리된다.
4. `--result/-r` 반복, `--catalog`, `--context`, `--output/-o`, `--help/-h`와 result 미지정 시 `data/local/g2-results/*.json` 기본 탐색을 검증한다. unknown flag와 duplicate scalar flag는 exit 2, data/runtime 오류는 1, 성공은 0이다.
5. 명시·기본 result 모두 parse 뒤 participantId code-unit 순으로 집계한다. input path·result 배열·profile map 순열과 동일 실행 2회에도 report가 byte-identical하다.
6. stdout은 identity/catalog metadata → accepted human/pilot counts → 다섯 GO 기준 → aggregate counts/rates → participant rows → Lift/coverage diagnostics 순서의 deterministic Markdown만 포함한다. 진단은 stderr로만 보내고 생성 시각·절대 경로·locale·env·network·자유서술은 출력하지 않으며 LF와 마지막 newline 한 개를 강제한다.
7. overlap, 설명 없음, denominator 0, tie, factor-backed leakage, holdout hit/miss, 9·10·11 human, pilot-only를 포함한 집계 fixture로 integer 분자·분모, q12 표시, `GO`/`REVISE`/`INCOMPLETE`, pilot의 human 지표 제외를 exact Markdown golden으로 고정한다.

### 수동 브라우저 round-trip (Slice 4 완료 게이트)

- [ ] 실제 브라우저에서 `/synthetic-pilot/`로 들어가 `participantId`와 유효한 `ExperimentProfileV1` 파일을 입력하고 pre 설문 → listPreference 확정 → after 설문 → final submit → debrief → JSON 다운로드까지 의도된 UI만으로 완주한다. 직접 state 조작이나 test-only route를 사용하지 않는다.
- [ ] pre 확정 전과 final submit 전의 visible text, accessible name/description, DOM text, `data-*`, id/class, URL/query/hash, JSON-LD, console과 중간 다운로드 가능 상태를 확인해 engine identity·A/B mapping·score·confidence·anchor·contribution·penalty·market·maturity·catalog role이 노출되지 않음을 확인한다. after에서는 같은 native list/rank와 contribution 기반 설명 또는 exact `説明はありません。`을 확인한다.
- [ ] 다운로드한 canonical JSON을 그대로 `pnpm --silent g2:aggregate -r <다운로드 파일> -o <리포트>`에 넣고 성공 exit와 authoritative report를 read back한다. report가 accepted pilot 1개, human 0개, verdict `INCOMPLETE`를 나타내며 pilot을 human 분자·분모나 10명 수에 포함하지 않는지 확인한다.

## 5. 제품 E2E (Playwright — 5 시나리오 고정, 확장 금지)

Chromium + 모바일 뷰포트(390×844) 프로젝트 2개로 실행. 라쿠텐은 라우트 모킹.

1. **핵심 여정:** 온보딩(검색 포함 8작품, 1 favorite) → 불호 1개+이유 → DNA reveal → 추천 10개 표시, 1위 카드의 이유 문장이 카드 data-attribute의 contribution 요약과 일치.
2. **피드백 루프:** 추천 1위를 読んだ 처리 → 카드 제거·백필 → 재계산 후에도 해당 작품 미등장.
3. **영속성:** 기록 생성 → 컨텍스트 재시작 → Library·DNA 유지.
4. **Provider 장애:** `/api/rakuten/*` 전부 502 모킹 → placeholder 표지로 온보딩·추천·상세 성립, 구매 버튼 폴백.
5. **데이터 주권:** Export → 전체 삭제(랜딩 복귀 확인) → Import → 추천·Library 원상 복구.

E2E 내 접근성 스모크: 시나리오 1을 키보드만으로 완주(탭 순서·Enter/Space 선택) + 각 페이지 `axe-core` 주입 검사(critical 위반 0).

## 6. 수동 QA 체크리스트 (릴리스 게이트, 슬라이스 11~12에서 전체 실행)

### 모바일 실기기 (iOS Safari + Android Chrome 각 1대)

- [ ] 온보딩 Shelf 스와이프·스크롤 스냅 자연스러움, 터치 타깃 44px 실측.
- [ ] 하단 탭 바가 키보드(가상)·세이프 에어리어와 충돌하지 않음.
- [ ] 홈 화면 설치 → standalone 실행 → 오프라인에서 DNA·Library·기존 추천 열람.
- [ ] 작품 상세 블러 배경의 스크롤 성능(프레임 드랍 육안 확인).

### 키보드·스크린리더 (데스크톱)

- [ ] 전 화면 focus-visible 링 표시, 시트·다이얼로그 포커스 트랩과 복귀.
- [ ] FactorBar가 VoiceOver/NVDA에서 「戦略的な展開: 強い好み」 형태로 읽힘. 미확인 축은 「まだ分析中」.
- [ ] 추천 카드 제거 시 aria-live 어나운스와 포커스 이동.

### reduced-motion

- [ ] OS 설정 활성 후: 로고 reveal·DNA reveal·카드 layout 애니메이션이 무모션으로 즉시 완료되고 정보 손실이 없다.
- [ ] Shelf 버튼 스크롤이 instant로 동작.

### 비주얼 충실도 (04 문서 대조)

- [ ] 토큰 값·radius(카드 8/표지 4)·accent 사용처 제한 준수.
- [ ] 표지가 어떤 화면에서도 크롭되지 않음(세로/가로 특이 비율 표지 3종으로 확인).
- [ ] placeholder 표지·빈 상태·오류 상태를 화면별로 강제 재현해 확인(라쿠텐 차단 + 데이터 비움).
- [ ] 스크린톤이 지정 표면(랜딩 hero·빈 상태·DNA 요약)에만 존재.
- [ ] 다크 모드(슬라이스 12 이후): 대비 재측정, 블러 배경 위 텍스트 4.5:1.

### 성능 (수동 측정, 예산은 04 §8)

- [ ] Lighthouse(모바일 스로틀): LCP < 2.5s, CLS < 0.05, PWA 설치 가능.
- [ ] 추천 페이지 초기 JS < 250KB gzip (`next build` 출력 확인).
- [ ] 중급 안드로이드(또는 CPU 4× 스로틀)에서 DNA reveal·카드 제거 60fps 근접.

## 7. 명시적으로 하지 않는 것

- 크로스 브라우저 전수 매트릭스(Firefox는 스모크 수동 1회만), 시각 회귀 스냅샷 인프라, 부하 테스트, 엔진 property-based testing(골든+계약 테스트로 충분).
- 하니스(`harness/`)에서 제외하는 자동화는 **UI Playwright E2E와 visual regression뿐**이다. §4의 순수 G2 schema/holdout/slot/overlap/leakage/metric/tie/null/canonical JSON 테스트와 aggregator 경계·변조 거부·CLI·골든 테스트는 필수이며 제외 대상이 아니다.
