# 07 — 수용 테스트 계획 (Acceptance Test Plan)

> 최소 신뢰 가능한 검증 전략. 매트릭스 완결성이 아니라 실제 계약 보호가 목적이다.
> 자동화 계층: 유닛(Vitest) / 컴포넌트(Testing Library) / E2E(Playwright) / 정적 검사 / 수동 QA.

---

## 1. 정적 검사 (CI 매 커밋)

- `tsc --noEmit` (strict) / ESLint (domain 계층 격리 규칙 포함: domain이 react·dexie·TanStack을 import하면 실패) / Prettier check.
- **`catalog:validate`를 CI 게이트로:** 검증 실패 데이터는 빌드 자체가 실패한다. 검사 항목 — ID·ISBN 중복, 팩터 범위·상태 오류, centrality 범위, eligibility 충돌, 추천 대상의 Genre·Theme·Narrative·Tone 필수 coverage 미달, evidence 누락, 대표 volume 누락, `data`/`src`/exact versioned `public` Catalog 세 artifact의 존재와 canonical byte 동일성. Art는 선택 축이며 이미지 경로를 사용한 known 값에만 Art manifest 최소선을 강제한다.

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
- 추천용 `/catalog/catalog-v1.<catalogVersion>.json`은 bundled Catalog와 byte·strict schema·semantic validation·DNA·추천 plan이 동일하다. client provider는 exact URL, HTTP/JSON/schema/version/workIds mismatch, 실제 retry, abort와 late stale completion 차단을 검증한다. 공통 shell/랜딩/settings는 full Catalog client import가 없고 onboarding/DNA/Library/Catalog 상세만 bundled provider를 갖는 route source 계약을 고정한다.
- 일본어 정규화 골든 케이스(NFKC·가나·전각/반각·권수 토큰 10례 이상).
- Art 4축이 모두 `unknown`인 Work도 다른 네 필수 그룹을 충족하면 `recommendationEligible`을 통과한다. 커뮤니티 근거의 Art는 이미지 manifest 없이 허용하고, publisher/manual 이미지 근거의 known Art는 기존 manifest·표본·맥락 검사를 그대로 통과해야 한다.
- Export→Import 라운드트립: 임의 사용자 상태 생성 → export → import → userWorks/externalWorks/profile/draft 동등, cache empty와 current runtime meta 확인.
- Import 거부: schemaVersion 2 / 필드 손상 / 부분 손상 배열 — mutation 전 전체 거부와 일곱 store 불변.
- providerCache TTL: 주입 시간 기준 가격·재고 24시간 / 기타 metadata 90일의 직전·정확 경계, 상업 필드만 먼저 숨기는 상태, legacy 단일 `expiresAt` cache miss.
- 추천 표지 resolver: 표시 순 representative ISBN, 1위 완료 전 2~10위 미시작, fresh exact-workId/no-image terminal, expired·mismatch·miss 갱신+저장 readback, 실패 placeholder, stale generation 차단, 백필 survivor URL 보존·신규만 요청. normalized ISBN 동시 요청은 한 provider 호출에 합류하고 settle 뒤 재시도 가능하다.
- TanStack Start server route: 기존 URL의 쿼리 검증 400, App ID·Access Key 비노출, 필드 축소, `_ex=600x600` 재작성, cache header, 타임아웃→502, 자동 재시도 0회.

### Slice 10 데이터 주권·호환 프로필 추가 계약

1. strict `ExportFileV1`은 format/schema/exportedAt/catalogVersion/userWorks/externalWorks/profile/onboardingDraft의 exact key set을 요구한다. profile에는 adjustments와 `preferCompleted`·`preferHidden`·`preferVerified`·`excludeIncomplete` 전부, required `onboardingCompletedAt: string | null`이 있고 draft도 required nullable이다. profile rows가 없는 pre-profile Export는 app default adjustments/policies와 nullable `null`을 쓰며 시각을 합성하지 않고 cache/meta를 payload에 넣지 않는다.
2. Export snapshot은 한 readonly transaction의 일관된 userWorks/externalWorks/profile/draft를 직렬화한다. external ID/key/metadata/ISBN/nested record를 재계산·누락하지 않으며 손상 row가 하나라도 있으면 부분 export를 만들지 않는다.
3. Import는 strict schema, duplicate user/external ID, namespace, external version/key/digest/nested ID/ISBN/collision, profile/draft 교차 필드를 첫 write 전에 모두 검증한다. 어느 하나라도 실패하면 transaction을 열어 일부 적용하지 않고 raw 일곱 store와 memory mirror가 byte-equivalent로 유지된다.
4. 호환 resolver 표는 현재 bundled Catalog의 distinct positive로 고정한다: `>=5 + marker string|null → usable`, `<5 + marker string → add recovery`, `<5 + marker null → firstRun`. `onboardingDraft=null`은 세 상태 모두 유효하고, non-null firstRun draft는 마지막 상태에서만, add draft는 usable 또는 marker 존재 상태에서만 유효하며 add entry가 imported userWorks와 겹치면 whole-file 거부한다. mode·marker를 자동 교정하지 않는다.
5. 성공 Import readback은 한 seven-store transaction의 exact outcome을 검증한다: imported userWorks/externalWorks/profile/draft, 빈 recommendation/provider cache, current schemaVersion/current bundled catalogVersion meta. 과거 cache/meta를 복원하지 않고 성공 UI는 이 readback 뒤에만 허용한다.
6. source catalogVersion 불일치는 preview warning을 만들되 Import를 막지 않는다. current Catalog에 없는 user record도 보존·「カタログ外」 표시되고 usable count와 추천 입력에서는 빠진다.
7. 전체 삭제는 typed 「削除」 확인 뒤 seven-store transaction으로 모두 지우고 current runtime meta만 다시 쓴다. authoritative readback에서 여섯 non-meta store가 비고 meta가 exact current 값일 때만 성공·랜딩 이동을 허용한다.
8. Import/삭제 commit 또는 readback failure를 주입해 uncertain primary operation이 memory backend에서 자동 재실행되지 않고 `indeterminate`가 반환되는지 검증한다. 의도적 memory-only 경로를 구현한 경우에는 `session-only` 결과와 새로고침 소실 안내를 별도로 검증한다.

### Slice 9 external identity·영속성 추가 계약

1. title/creator v1 golden은 NFKC·가나/폭·locale-independent lowercase·Unicode 공백/정확한 중점 집합 `[・･·]`(U+0387 NFKC 포함)과 title 전용 권수/판형 제거를 고정한다. 가나 통합 후 edition 제거 순서를 `作品 セット`/`作品 せっと`의 same-key/full-digest vector로 검증한다. 현재 edition regex의 인접 exact substring 제거와 remainder 보존(`完全版画集→画集`, `セットアップ→あっぷ`), 비목록 부분 문자열 보존을 경계 vector로 포함한다. `normalizedKey` canonical JSON, UTF-8 namespace input, full lowercase SHA-256과 exact `^ext:rakuten:v1:[0-9a-f]{64}$` ID를 byte-level golden으로 검증한다. 빈 정규화 결과와 규격 밖 digest/namespace/version은 거부한다.
2. canonical href는 URL query 직렬화된 `/works/external?workId=<encoded-id>` 하나다. query의 missing/duplicate/empty/malformed 값은 invalid이고 해당 값을 `inspectExternalWork`에 넘기거나 Rakuten 요청을 하지 않는다. 전역 PersistenceProvider의 일반 초기화는 허용하며 `/works/[workId]`는 Catalog-only static params와 unknown 404를 유지한다.
3. strict external readback은 parent/nested ID, canonical normalizedKey, stored key로 재계산한 ID/digest, distinct valid ISBN identity를 검증한다. ISBN-10/ISBN-13 동등 쌍은 한 canonical ISBN-13으로 parse/merge되고 중복 표본이 될 수 없다. 유효 row는 `found`, authoritative IndexedDB에서 확인한 유효 ID 미저장은 `missing`, schema/key/digest 손상은 서지를 반환하지 않는 `corrupt`, storage read/open 실패와 degraded mirror miss는 `unavailable`로 구분한다. 검증된 mirror hit는 degraded 상태에서도 `found`일 수 있다. 표시 title/creators 변경은 저장된 v1 identity를 무효화하거나 re-key하지 않는다.
4. 초기 external 목록에 valid+corrupt row가 함께 있어도 valid row만 반환·mirror하며 IndexedDB 상태를 degraded로 바꾸지 않는다. 이어서 corrupt ID를 단건 조회하면 `missing`이 아니라 `corrupt`다. add/save/remove의 사전 mirror warm도 unrelated corrupt row를 건너뛰고 대상 transaction/readback을 계속한다.
   과거 valid mirror를 가진 ID의 authoritative row가 이후 corrupt로 판정되면 해당 mirror를 무효화한다. 그 다음 storage failure로 degraded가 되어도 같은 ID는 stale `found`가 아니라 `unavailable`이다.
5. Catalog와 external add는 stale-tab 경쟁에서도 insert-only다. `added`는 transaction 뒤 authoritative readback과 일치할 때만 반환한다. Catalog 기존 record 전체와 external의 user state·비-ISBN 표시 metadata는 `already-exists`로 보존하고, external ISBN만 §6의 canonical distinct union을 허용한다. primary 결과가 불확실하면 memory mirror에 재실행하지 않고 `preserved-unknown`을 반환한다.
6. 같은 external key/ID 재선택은 기존 표시 metadata·사용자 record를 보존하며 distinct ISBN만 union한다. same-ID/different-key는 원본 row 불변으로 거부하고 suffix·시각·난수 fallback을 만들지 않는다.
7. ISBN 1만 본 stale external 편집기와 같은 identity의 ISBN 2 추가가 경쟁하면, 편집 transaction은 authoritative 최신 row의 nested user record만 바꾸고 ISBN 1·2와 최신 표시 metadata를 모두 보존한다. 대상 삭제·손상·key 변경은 update-only로 거부하고, 불확실 primary write는 stale mirror에 재실행하지 않는다. IndexedDB transaction과 memory fallback을 각각 검증한다.
8. Slice 10 Export→삭제→Import는 exact external ID/key/canonical URL/nested user record를 보존한다. unsupported identity version, noncanonical key, ID/digest mismatch, duplicate/collision, invalid ISBN 중 하나라도 있으면 replacement transaction 전 전체 파일을 거부하고 기존 DB를 유지한다.

### Slice 5 온보딩 draft 추가 계약

1. strict `OnboardingDraft` restore는 `id="current"`와 필수 `mode` 판별 필드를 요구한다. `firstRun`은 step 1|2, positive reaction, negative disposition·reason을 보존하고 `add`는 step 1 + `negativeEntries=[]`만 허용한다. positive/negative 내부 work 중복, 양쪽 overlap, positive 10개 초과, negative 3개 초과, 중복 reason, `vagueDislike` 혼합, 비정규 `external:*`을 거부한다.
2. `firstRun` 완료는 positive 5개 미만을 거부하고 5~10개를 `completed` + 원 reaction으로 변환한다. `add` 완료는 신규 positive 1~10개를 같은 방식으로 변환하고 Step 2 입력을 허용하지 않는다. `disliked`는 `completed` + `disliked` + `negativeReasons`, `dropped`는 `dropped` + reaction 미지정 + `droppedReasons`가 되며 빈 reasons는 해당 bucket의 `vagueDislike` 하나가 된다.
3. draft 생성·완료 시각은 호출자가 주입한다. 동일 draft와 동일 완료 시각은 record 순서와 bytes가 같은 결과를 만들며 `Date.now()`·난수·I/O를 사용하지 않는다.
4. add 완료는 기존 `UserWorkRecord`의 모든 필드와 최초 `onboardingCompletedAt`을 보존하고 신규 workId만 한 트랜잭션으로 추가한다. 기존 ID 충돌은 신규 row·marker·draft 모두 불변으로 거부한다. 일반 닫기는 draft를 보존하고 명시적 폐기만 삭제한다.
5. 기존 프로필 대표 흐름은 `/taste` → 추가 모드 → 새 positive 1개 선택 → 완료 → `/taste`를 검증한다. Step 2와 `?reveal=1`이 없고, 기존 record readback·완료 marker가 동일하며 add draft만 삭제됨을 확인한다.

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

## 4.5 TanStack Start migration 회귀

- 하나의 parameterized route-schema test에서 `/onboarding`, `/taste`, `/recommendations`, `/library`, `/settings`, `/works/external`의 valid/default/malformed search를 검증한다. external duplicate `workId`만 기존 invalid-link/no-lookup 계약을 유지한다.
- route/build integration은 `/` prerender, bundled `/works/$workId` prerender, unknown work not-found, local-state 5 route의 client boundary, `/works/external` static shell을 확인한다. server loader/`beforeLoad`에서 Dexie를 열지 않는다.
- 같은 frozen fixture에서 migration 전후 추천 work ID 순서, contribution, confidence level, explanation source를 byte-equivalent하게 비교한다. 새 산식 테스트를 복제하지 않는다.
- 기존 Export/Import/external identity/Rakuten server-route 테스트를 그대로 통과시킨다. 1초 client throttle은 development에서만 활성이고 production/test에는 지연이 없음을 한 기존 client test에 추가한다.
- source contract는 feature/route가 `src/components/ui/**` primitive를 직접 import하지 않고 `src/components/design-system/**` wrapper를 쓰는지 확인한다. 새 visual-regression infrastructure는 만들지 않는다.

## 5. 제품 E2E (Playwright — 5 시나리오 고정, 확장 금지)

Chromium + 모바일 뷰포트(390×844) 프로젝트 2개로 실행. 라쿠텐은 라우트 모킹.

1. **핵심 여정:** 일반 first-run resolved landing의 marker 선기록·CTA 상시 조작·비소비 스킵·reload 정적 상태를 같은 시나리오의 격리 분기에서 확인 → typed `q/genre/shelf`가 back/forward에 복원되는 온보딩(검색 포함 8작품, 1 favorite) → `合わなかった` 1개+이유 → DNA reveal(`?reveal` 즉시 제거 뒤 local decision으로 계속, 1200ms 뒤 late-viewport FactorBar 즉시 시작) → 추천 Top 10, 1위 이유와 contribution data 일치.
2. **피드백 루프:** desktop focus expansion/mobile Quick Preview open-close와 opener 복원 → 추천 1위를 読んだ 처리 → 카드 제거·백필 → 재계산 후에도 해당 작품 미등장. `?preview` back/forward는 대상만 복원하고 dialog animation/focus state를 복원하지 않는다.
3. **영속성:** Catalog와 external 기록 생성 → 컨텍스트 재시작 → Library·DNA 유지. Library typed filter/search가 reload/back에 복원된다. 같은 브라우저의 canonical external URL reload는 같은 row를 표시하고, row 없는 독립 context는 local-missing을 표시하며 provider로 복원하지 않는다.
4. **Provider 장애:** `/api/rakuten/*` 전부 502 모킹 → placeholder 표지로 온보딩·추천·상세 성립, 구매 버튼 폴백.
5. **데이터 주권:** usable profile의 모든 정책·Catalog/external 기록을 Export → 전체 삭제(여섯 non-meta store empty + current meta readback, 랜딩/가드 확인) → `/settings`에서 Import → 추천·Library·정책과 exact external URL/identity 원상 복구. 같은 시나리오의 격리된 분기로 (a) 손상 external/profile/draft 파일의 whole-file 거부와 일곱 store 무변경, (b) 과거 catalogVersion 경고와 「カタログ外」 record 보존, (c) completion marker가 `null`인 pre-profile first-run draft의 Export→삭제→Import와 합성 시각 없음, (d) `?landing=1` 소개 전후 `logoRevealed` sentinel과 나머지 로컬 상태가 byte-identical임을 검증한다.

E2E 내 기본 조작성 스모크: 시나리오 1을 키보드만으로 완주하고 탭 순서·Enter/Space 선택·focus 복귀를 검증한다. 주요 heading·label·name/role/value·status message는 Playwright DOM assertion으로 확인한다. 기존 시나리오 안에서 desktop GNB/mobile bottom navigation 상호 배타, immersive route의 mobile nav 없음, Shelf overflow, reduced-motion의 A/B/C 정적 상태를 함께 확인하되 여섯 번째 제품 시나리오를 만들지 않는다. 이는 제품 회귀 검사이며 WCAG 적합성 판정으로 해석하지 않는다.

## 6. 수동 QA 체크리스트 (M10 릴리스 게이트)

### 모바일 실기기 (iOS Safari + Android Chrome 각 1대)

- [ ] 온보딩 Shelf 스와이프·스크롤 스냅 자연스러움, 터치 타깃 44px 실측.
- [ ] 하단 탭 바가 키보드(가상)·세이프 에어리어와 충돌하지 않음.
- [ ] 작품 상세 블러 배경의 스크롤 성능(프레임 드랍 육안 확인).
- [ ] touch card는 hover 확장 없이 Quick Preview sheet를 열고 닫은 뒤 opener로 복귀.

### 키보드·포커스·DOM 시맨틱 (데스크톱)

- [ ] 전 화면 focus-visible 링 표시, 시트·다이얼로그 포커스 트랩과 복귀.
- [ ] desktop fine-pointer card는 200ms intent 뒤 확장되고 keyboard focus는 즉시 같은 정보를 노출한다.
- [ ] FactorBar 확인값이 접근 가능한 이름 「戦略的な展開」과 정성 값 「強め」를 중복 없이 노출하고, 미확인 축은 「戦略的な展開: まだ分析中」인 비수치 DOM 상태를 노출한다.
- [ ] 추천 카드 제거 시 `aria-live` 메시지의 DOM 갱신과 포커스 이동.

### reduced-motion

- [ ] OS 설정 활성 후: 로고 reveal·DNA reveal·카드 layout 애니메이션이 무모션으로 즉시 완료되고 정보 손실이 없다.
- [ ] A는 최종 상태와 해당 1회 marker를 보존하고 B는 최종 상태로 즉시 표시한다. C는 `layout=false`로 상태·순서·focus·live message를 즉시 반영한다. D/E는 scale·travel·값 보간 없이 선택·focus·정성 값·성공 상태를 보존하고 F는 흔들림 대신 정적 `--warn` 보더와 text를 유지한다.
- [ ] skeleton은 pulse 없는 정적 silhouette로 loading/failure를 구분하고, 실행 중 reduce로 바뀌어도 A가 즉시 완료된 뒤 같은 session에서 재생되지 않는다.
- [ ] Shelf 버튼 스크롤이 instant로 동작.

### 비주얼 충실도 (04 문서 대조)

- [ ] 토큰 값·radius(카드 8/표지 4)·accent 사용처 제한 준수.
- [ ] 표지가 어떤 화면에서도 크롭되지 않음(세로/가로 특이 비율 표지 3종으로 확인).
- [ ] placeholder 표지·빈 상태·오류 상태를 화면별로 강제 재현해 확인(라쿠텐 차단 + 데이터 비움).
- [ ] 스크린톤이 지정 표면(랜딩 hero·빈 상태·DNA 요약)에만 존재.
- [ ] dark-only canvas에서 본문/보조/control 상태 대비와 블러/overlay 위 텍스트 4.5:1을 재측정하고 theme selector가 없음을 확인한다.

### 성능 (독립 production-local 계측, 예산·프로토콜은 04 §8)

이 계측은 fixed 5 product E2E와 별도 suite/artifact로 실행하며 제품 E2E 시나리오 수에 포함하지 않는다.

- [ ] `pnpm build` + `pnpm start`와 Playwright Chromium에서 390×844/DPR 3/touch, CDP CPU 4×·150ms RTT·1.6Mbit/s down·0.75Mbit/s up 조건을 기록하고, 실제 제품 flow로 state를 만든 독립 cold context 5회의 raw 결과와 중앙값을 보존한다.
- [ ] navigation 전 buffered `PerformanceObserver`로 측정한 landing resolved introduction과 추천 화면의 실제 browser-selected LCP 중앙값이 각각 <3.5s이고, 두 route CLS 중앙값이 <0.05다. 가시 태그라인·설명문을 숨기거나 축소하거나 96px 표지를 확대해 후보 identity를 조작하지 않는다. 첫 로고 후보와 1위 표지 request·삽입·load 시각을 별도로 보존하고, 1위 표지는 eager/high-priority이며 provider fixture를 쓰면 fulfilled bytes가 같은 latency/transfer profile을 실제로 보존함을 함께 입증한다.
- [ ] cold direct `/recommendations`가 user input 전 `networkidle`까지 실제 요청한 unique same-origin JavaScript를 TanStack Start/Vite manifest의 emitted file로 dedupe하고 exact file gzip level 9 합계를 냈을 때 <250,000 bytes다. URL·raw/gzip bytes·total을 JSON으로 남기며 build summary로 대신하지 않는다.
- [ ] 같은 frozen mobile 조건의 rAF raw interval에서 DNA A와 추천 C를 보고한다. 60fps는 목표이며 추천 C median effective FPS가 ≥30이다. 미달하면 해당 C owner의 layout motion을 끄고 같은 flow로 재검증한다.
- [ ] Lighthouse Performance는 진단용일 뿐 위 직접 지표의 판정 근거가 아니다. PWA/service-worker 감사는 TanStack Start adapter가 별도 승인된 뒤 수행한다. Lighthouse accessibility는 실행하지 않는다.
- [ ] production-local 결과와 별도로 중급 Android thermal/frame, real cellular/provider LCP, iOS/Android 설치 모드의 검증 한계를 기록한다.

### 선택적 post-MVP 접근성 감사 (릴리스 비차단)

- axe-core 또는 Lighthouse a11y 자동 판정, VoiceOver/NVDA 실제 낭독, 전체 WCAG 적합성 평가는 현재 구현 슬라이스와 MVP 릴리스 게이트에 포함하지 않는다.
- 제품 완성 후 사용자가 별도 작업을 승인한 경우에만 독립 감사로 수행한다. 수행하지 않아도 슬라이스 완료·PR·배포를 막지 않는다.
- 이 제외는 키보드 조작성, focus-visible, 의미 있는 heading·label, 기본 name/role/value, 상태 메시지 DOM, 대비·리플로우·터치 타깃 같은 기존 제품 계약을 제거하지 않는다.

## 7. 명시적으로 하지 않는 것

- 크로스 브라우저 전수 매트릭스(Firefox는 스모크 수동 1회만), 시각 회귀 스냅샷 인프라, 부하 테스트, 엔진 property-based testing(골든+계약 테스트로 충분).
- 하니스(`harness/`)에서 제외하는 자동화는 **UI Playwright E2E와 visual regression뿐**이다. §4의 순수 G2 schema/holdout/slot/overlap/leakage/metric/tie/null/canonical JSON 테스트와 aggregator 경계·변조 거부·CLI·골든 테스트는 필수이며 제외 대상이 아니다.
