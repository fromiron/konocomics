# Factor 003 소실 사건 복구 계약 — 2026-09-09

사용자는 Oracle 6 Pro의 복구 제안을 검토한 뒤, **복구용 후보에 한해 권한 미확인 작품의 추천·온보딩 사용을 격리하고 재판정으로 추천 가능 작품 수가 감소하는 것도 허용**했다. 이 승인은 원본 복구 성공, 재판정 완료, canonical 전환·GitHub 쓰기·배포 승인이 아니다.

## 고정 사건과 보존 경계

- 사건: `factor-rescue-003-v2-loss-20260909`. 원본 `panel-input-v2`·`panel-result-v2`와 완전한 membership은 복구되지 않았다. 기대 입력 manifest SHA-256은 `c04b752039bde9840c6e99b841180f4643b99abb82bb2877e309ce54dfcd2d36`이다.
- 보존 기준: `continuation-factor-233-publication-20260909-v1`의 Catalog `d35b703eca8c1df366f1c60ad06c75ae659a87a25a102f02cfe034699d7de02f`, registry `5f355dee719c13bf8120880543d90b5bd6c7f7681594aeb290e077dc9728104f`와 canonical `78888710f280f9a10ab3f93f94c63ea80e897c4fc4cff9416c9ef33fb618f83b`는 변경하지 않는다.
- 전체 3,309 ID는 **검사 범위**다. 모두 소실에 영향받았거나 모두 재판정 대상이라는 뜻이 아니다. Gold와 계약상 legacy authority를 보호하고, 현재 사실·정정·안전성·맥락의 독립 권한이 입증된 작품만 별도로 분리한다. annotation method·날짜·값 일치만으로 독립성을 인증하지 않는다.
- 실제 원본과 membership이 발견되기 전 `originalScopeComplete=false`다. 새 권한을 완성해도 이 역사적 상태를 성공으로 바꾸지 않는다.

## 후보 격리와 새로운 판정

1. 고정 233 pair에서 새 copy-on-write 복구 후보를 만든다. 권한이 미확인인 비보호 작품은 `recommendationEligible=false`, `onboardingEligible=false`, `libraryOnly=true`로 격리한다. ID·서지·기존 Factor·Theme·Genre·evidence와 사용자 Library/Export 데이터는 보존한다. 권한 HOLD를 값 `unknown`이나 0으로 바꾸지 않는다.
2. 격리된 작품의 과거 팩터는 후보 추천·취향 anchor·불호 영향·DNA·설명·온보딩·팩터 기반 상세 추천에 사용하지 않는다. 생성 artifact의 내용 버전과 eligibility를 통해 기존 런타임 경계를 사용한다. 상세 서지와 Library 항목은 유지한다.
3. 1~5개 실제 준비 작품을 기존 operator 진입점으로 동결하고 그 뒤 별도 전체 판정을 작성한다. 각 작품은 17 Axis와 완전한 채택 Genre·Theme 집합을 판정한다. 누락 tag를 과거 집합과 자동 union하지 않는다. 같은 값이어도 새 근거와 authority digest에 결속한다.
4. 이전 판정은 `retained`(완전한 원본 권한 검증), `unavailable`(소실), `superseded`(새 판정으로 대체)를 구분한다. 불완전한 원본은 retained가 아니다. 현재 DB 값은 before 감사 자료일 뿐 새 모델의 답안이 아니다. 실제 수집 원문은 보존된 출처·범위·한계와 함께 다시 사용할 수 있다.
5. full fresh 판정은 이전 불확실 판정 전체를 명시적으로 supersede할 수 있다. 이 경우 prior 없음이나 003 비관련을 주장하지 않는다. retained 최적화를 사용하지 않아도 완전한 새 판정 경로는 진행할 수 있다.
6. 기존 coverage 기준을 그대로 적용한다. Factor BLOCKED는 유효한 복구 결과이며 과거 eligible를 유지하지 않는다. safety HOLD는 SAFE로 바꾸지 않고 격리한다. Factor PASS와 별도 안전성 PASS가 모두 확인된 경우에만 활성화한다. 기존 맥락은 새 판정과 결속해 교체하고 비활성 대상의 활성 추천 맥락은 제거한다.

## 입력 결속과 발행

- `recovery-epoch.json`: 사건·명시 승인·이 문서 digest·고정 pair/canonical digest·scope digest를 기록한다.
- `recovery-scope.jsonl`: 전체 ID의 보호·독립 입증·미확인 분류, before snapshot과 해당 증거를 기록한다. 원본 003의 membership으로 이름을 바꾸지 않는다.
- `authority-transition.jsonl`: 대상 before, retained 또는 superseded disposition, 새 입력/결과/안전성 결속과 after 상태를 기록한다.
- 각 batch의 복구 선언은 chunk manifest **안에** 포함하여 `authorityArtifactDigest`가 사건 승인·대상 membership·before snapshot을 결속하게 한다. 선언 파일만 놓거나 빈 prior 파일만 만드는 것은 예외 권한이 아니다.
- 공유 validator를 준비·판정 검증·발행에서 사용한다. 고정 정책·epoch·scope와 대상의 frozen/current 상태가 불일치하면 실패한다. Gold/legacy와 비대상 행, 과거 evidence, registry 누적은 보존한다. 일반 경로의 누락 manifest 실패는 변경하지 않는다.
- 새 baseline manifest는 현재 물리 파일의 정체성이다. 소실된 manifest 복원이나 과거 실행 재현을 주장하지 않는다. 기존 prepare → freeze → 별도 ledger → seal → 직렬 publication → DB/Gold/authority/build/coverage/추천 엔진 readback → 작업 SQLite 저장·백업 후에만 current를 갱신한다.
- 원본 복구 여부, 현재 활성 권한 폐쇄 여부, 검사 범위 전체의 disposition 완료 여부를 별도로 보고한다. 미해결 대상이 있어도 완전히 새 판정된 작품은 진행할 수 있으나 전체 복구 완료로 표시하지 않는다.

## 회귀 확인

승인·정책 변조, 범위 밖/Gold/legacy 대상, stale before, cross-work 근거, retained 원본 누락, 이전 권한을 재사용한 같은 값, 과거 tag 잔존, BLOCKED의 eligible 잔존을 거부한다. 일반 경로의 누락 prior는 계속 실패해야 한다. 실제 후보 생성 및 대표 freeze부터 제품 readback까지의 흐름을 확인하며 테스트만으로 복구를 완료 처리하지 않는다.
