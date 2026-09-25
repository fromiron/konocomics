# 수집·판정 플로우 1단계와 PR A/B 구현·검증

2026-09-25 / `catalog-pipeline-improvements` / 기준 HEAD `be5f0ba9b8be5df082fb99b8faf71b7df3b424a1`

아래 첫 구현 기록에 이어 사용자 추가 지시에 따라 PR A와 PR B를 적용했다. 후속 결과는 문서 끝의 「PR A/B 후속 검증」에 구분한다.

첨부 개선계획의 첫 구현 범위인 입력 결속·통지·검증 영수증을 변경했다. 작품별 판정과 기존 발행 포맷은 유지한다. 코드·운영 명령은 [README](../../scripts/catalog_authoring/README.md#2026-09-25-입력통지-개선)에 있다.

| 변경      | 동작                                                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 입력 결속 | CLI research 없이도 job의 researchRefs에서 빈 binding 조립. 명시한 비어 있지 않은 선택 보존. 동결 전에 정확한 추천 URL 연결·evidence ID 충돌 검사 |
| N/T 인계  | 실제 작성된 기록만 SHA-bound sidecar → job → frozen으로 전달. 기록 없는 예외 생성·상충 기록 병합 금지                                             |
| 원문 언어 | collector/validator/입력에서 `zh` 보존                                                                                                            |
| 완료 통지 | 현재 Catalog 실행 턴에만 arm. checkpoint별 불변 이벤트, 전송 ACK와 부모 consumed ACK 분리. report-only·Interrupt·사용자 중단 보호                 |
| preflight | receipt v2의 외부 helper·계약·Gold·SQL·명령·runtime 결속, 동일 key 잠금, 명시 retry attempt, cacheHit/elapsedSeconds                              |
| 저장 재개 | 동일 CHECKED의 실제 입력·판정·결과를 작업 DB와 backup에서 검증하고 재사용. receipt 저장 실패는 작은 receipt만 다시 보존                           |

`TEST DRIFT`였던 기존 "미완료 active 배치가 매 턴 무조건 Stop을 막는다" 검사를 현재 사용자 요청의 실행 턴·checkpoint 범위로 교체했다. 원문 접근 제한을 자동 HOLD로 만들거나 explicit HOLD를 PASS로 바꾸지 않는다. N/T 이외 Genre/Theme·identity·context·safety·prior/Gold·대표판 검사는 유지한다.

## 대표 운영 경로

실제 Luna5의 `work-7a156f0d2233a11ec519/run-v3/job.json`을 원본으로 **기존 runner의 `prepare --job` 명령**을 실행했다. 신규 비발행 검증 run은 `data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902/planning/pipeline-improvements-verification-20260925/luna5-binding`이다.

- 원본 binding 0개 → 새 입력 9개. 새 frozen supplementalEvidence에도 같은 9개가 존재한다.
- `INPUT_FROZEN: PASS` → `PREPARED` → workspace/append-only backup 완료.
- 동결 입력 manifest SHA: `6183979263389835a7c484dc5b044650cde0f02921879704398b152fa0f9d5ae`.
- 최종 저장 snapshot `20649`, 38파일. workspace와 latest backup 양쪽에서 실제 run 전체 bytes를 `verify_saved`로 대조했다.
- canonical, STATE, 원본 job/RUN, 기존 현재 후보 catalog/registry의 SHA 6개가 실행 전후 동일하다. 모델 호출·판정·발행은 하지 않았다.
- 상세 readback: `.workspace/catalog-pipeline-improvements-verification/RESULT.json`. 동결·저장 영수증은 run 내부와 작업 SQLite에 보존됐다.

동결 자체는 2.15초였다. 해당 recorded freeze 작업은 입력 발견·저장·백업 포함 352.63초였고, 이후 session-input 저장 비용은 별도다. 이전 구현과 전체 처리량을 비교한 수치가 아니며 속도 개선율로 해석하지 않는다. 이 실행에서 입력 저장은 9,943파일을 포함했으므로 큰 의존 집합·백업 비용은 후속 구조 개선 대상으로 남는다.

## 첫 구현의 회귀 결과

모든 명령은 `python -B -X utf8 -m unittest discover`로 해당 디렉터리/파일을 지정했다.

| 검사                                                      | 결과                                                                                                             |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `scripts/test_catalog_authoring_runner.py`                | 36 통과. collector CLI → validator CLI → job, N/T sidecar SHA·언어·대표 6권, 명시 source 선택, 저장 재사용 포함  |
| `scripts/test_catalog_workspace.py`                       | 17 통과. sidecar 의존 원문 저장과 누락 거부 포함                                                                 |
| `scripts/test_catalog_authoring_batch_publish.py`         | 5 통과. 같은 key 동시 생성, 코드/Gold/SQL/계약/명령 변경, 명시 재시도, 완료 복구 포함                            |
| `scripts/catalog_authoring/test_notification_guard.py`    | 6 통과. idle 부모, 새 checkpoint, 회고 턴, Interrupt/중단, 처리 후 ACK 전 장애, 새 배정 후 이전 이벤트 보존 포함 |
| `scripts/catalog_authoring/test_coverage_exception.py`    | 1 통과. 실제 N/T 기록만 해당 그룹에 적용하고 다른 blocker 보존                                                   |
| `scripts/catalog_authoring/test_factor_single_pass.py`    | 2 통과                                                                                                           |
| `scripts/catalog_authoring/test_prepare_factor_batch.py`  | 12 통과, 1 실패, class 초기화 오류 1건. 새 정확한 URL 결속 회귀는 통과                                           |
| 변경 MJS ESLint / 변경 파일 Prettier / `git diff --check` | 통과                                                                                                             |

총 79개 테스트가 통과했다. 기존 artifact 회귀의 미통과 두 원인은 변경 전 HEAD의 prepare 모듈을 메모리에서 실행해 동일하게 재현했다.

- `jobs/hina-drifters/records.json` 원본 부재로 `AuthoringTest.setUpClass` 실패. 그 class의 후속 사례는 실행되지 않았다.
- `test_result_attempt_reuses_real_frozen_input_after_rejected_ledger`는 과거 frozen의 canonical SHA와 현재 canonical이 달라 원래 검사 지점에 도달하지 못했다. 원본 frozen SHA·기대값·검증 강도를 바꾸지 않았다.

## 첫 구현 시점의 남은 경계

- 프로젝트 hook의 실제 앱 자동 실행은 미검증이다. 변경한 UserPromptSubmit/Stop/Interrupt 정의는 [공식 hook 신뢰 절차](https://learn.chatgpt.com/docs/hooks)에 따라 앱에서 검토되어야 한다. 로컬 함수/명령 회귀는 앱 실행을 대신하지 않는다. 기존 여섯 작업 세션을 재개하거나 메시지를 보내지 않았다.
- private pair·10작품 checkpoint·작품별 논리 delta·최종 projection 1회·새 publication reader/복원·50작품 차등 시험은 2단계이며 이번 변경에 포함하지 않았다.
- 수집→판정 사전 승인, 여러 작품 모델 판정, 세션 교체, 백업 segment화는 선택적 후속 단계다. 현재 권한 경계와 모델 설정을 변경하지 않았다.

## PR A/B 후속 검증

두 개선은 적용 가치가 있다. A는 장애 후 통지 유실·잘못된 재개와 반복 저장을 막는다. B는 기존 발행 기능을 유지하면서 정정·복구 실패를 같은 transaction에서 되돌릴 수 있게 한다. GitHub PR 생성·push·merge·배포는 수행하지 않았다.

### PR A — 국소 보완

- checkpoint/event/index 경계별 중단을 주입했다. event만 저장된 경우 등록 runRoot/generation 목록에서 인덱스를 복구하고, 다음 배정 전에 이전 완료가 발견 가능한지 확인한다.
- 중단 턴 ID와 generation을 보존한다. 같은 턴의 `arm --resume`을 거부하며 이전 Interrupt와 늦게 도착한 전송 ACK가 새 실행/중단 상태를 덮어쓰지 않는다. 부분·사용자 중단 전송 ACK도 event ID에 결속한다.
- subset 발행은 실제 summary SHA → `sourceSummary` 체인 → 원본 행 → STATE → 적용 Work 집합 → `BATCH-COMPLETED`/readback/backup을 확인한다. `partially-published`는 미소비 상태와 남은 READY를 유지한다. 처리 이력을 남기며 전부 완료될 때만 `published` ACK한다.
- 정상 CHECK-STORAGE 재사용은 양쪽 저장소의 원문·receipt 확인 후 쓰기 0회이며 DB/backup 바이트가 유지된다. 최초 receipt 백업 실패는 작은 receipt 1회로 복구하고 다음 재사용은 다시 0회다.
- preflight는 이번 호출 비용과 과거 검사 비용을 나눠 기록하고 지정 Work만 새 attempt로 재검사한다. backup은 header/membership·blob copy/readback·새 membership·commit/readback·rotation을 구분한다.
- collector 완료 receipt에 예상 N/T sidecar SHA를 남긴다. 첫 조립 전에 sidecar가 삭제된 경우도 `INPUT_NEEDS_REPAIR`로 검출한다. sidecar 없는 과거 수집분은 유지한다. 결속 복구가 새 근거 판정이나 자동 N/T 예외를 만들지 않는다.

### PR B — 기존 publisher 책임 분리

`verify_immutable` → `plan_against_current` → `apply_plan_in_transaction` → `verify_expected_after` → `finalize_projection`으로 기존 코드를 분리했다. 단독 실행 wrapper가 transaction을 소유하고 공통·context·정정·복구 materializer에 같은 connection을 넘긴다. 기존 CLI와 full publication 파일 형식은 유지한다.

회귀 검사는 공통 evidence INSERT 뒤 각 adapter의 정확한 before 조건이 실패하는 경우를 재현한다. 다른 connection에는 미커밋 행이 보이지 않고 호출자의 savepoint rollback이 성공한다. 단독 wrapper도 전체를 rollback하며, expected-after 검사 실패 역시 commit되지 않는다. catalog/registry pair transaction과 compact publication은 PR C 범위로 남긴다.

### 실제 보존 입력으로 비교

- 보존된 Candy `work-593252c1d560872fb254`의 frozen 입력·판정·baseline·registry·검토 시각을 그대로 사용했다. 원본 판정의 SHA를 수정하거나 모델을 다시 호출하지 않았다.
- frozen에 결속된 과거 canonical `9ee9db5ecfad9ba10cef221f17dd7b9561601b3e6f2c018bc2125dfa44cb80a3`와 Gold manifest를 workspace blob에서 정확한 bytes로 private 경로에 복원했다. 두 publisher 모두 같은 복원 환경과 기존 공개 `publish_batch` 경로를 사용하고 검증 함수를 생략하지 않았다.
- 변경 전 HEAD publisher와 변경 후 publisher가 모두 발행 성공했다. 두 결과는 파일 208개·전체 source table 행·registry·review/입력/판정 원문이 같다. recovery snapshot 1작품, accepted claim 18개, changed fact 25개다.
- SQLite는 길이와 데이터 페이지가 같고 header offset 27/95만 다르다. change counter/version-valid-for가 385 → 384로 감소했다. 파일 5개의 차이는 이 DB SHA 및 그 SHA를 참조하는 authority transition/recovery/validation/manifest뿐이다. 물리 SHA가 같다는 주장을 하지 않는다.
- 기존 `readback-catalog-authoring.mts` CLI로 새 결과를 SQL → static build → coverage → 실제 `buildRecommendationPlan`까지 확인했다. `SQL_BUILD_COVERAGE_ENGINE_VERIFIED`, 작품 3,309개, 추천 가능 1,681개, Gold 150개, 생성 plan 1,679개였다. 기존 N/T 회귀도 private 발행과 같은 제품 엔진에서 unknown 보존을 검증했다.
- canonical·STATE·원본 job/RUN·현재 candidate/registry의 보호 대상 6개 SHA는 이전 기록과 그대로다. 기존 비추적 `=ro`, `tmp/`도 유지했다. 과거 87개 publication과 고정 작업 세션은 변경하지 않았다.

로컬 근거는 `.workspace/catalog-pipeline-ab-verification/`의 `publisher-comparison.json`, `sqlite-byte-comparison.json`, `product-readback/READBACK.json`, `protected-readback.json`에 있다. 이 비교는 출력 호환·rollback 검증이며 처리량 개선 벤치마크가 아니다.

### 최종 회귀 결과

`PYTHONPATH=scripts;scripts/catalog_authoring`에서 runner, workspace, batch publisher, notification guard, N/T, single-pass와 artifact, prepare, panel validator의 기존 unittest 모듈 9개를 함께 실행했다. 113개 사례 중 109개가 통과했다. 실패 1건·사례 오류 1건·skip 2건과 별도로 class 초기화 오류 1건이 있다(100.82초). 이번에 추가한 장애 복구·부분 발행·첫 sidecar 유실·중단/ACK 경합·transaction rollback 검사는 통과했다. 원문 로그는 `final-tests.log`다.

변경 MJS 2개의 ESLint, 변경 Python 구문 파싱, Prettier, `git diff --check`도 통과했다. 이 작업에서 push하지 않았으므로 frontend 전체 build/배포 검사로 확대하지 않았다.

### 검증 한계

기존 artifact 검사에서 원본 `jobs/hina-drifters/records.json` 누락, 오래된 frozen/current canonical SHA 불일치를 그대로 확인했다. 확대 실행한 변경 없는 `test_validate_factor_panel.py`에서는 `IntegratedCorrectionLineageTest.ROOT` 미정의 오류도 확인했다. 이 오류는 제품 함수를 호출하기 전 테스트 코드에서 발생한다. 원본 frozen·판정·기대값을 고쳐 PASS로 만들지 않았다.

실행 중인 desktop daemon proxy는 응답하지 않았다. 모델/새 턴을 시작하지 않는 별도 app-server의 `hooks/list`로 실제 프로젝트 설정을 조회했을 때 기존 Stop은 trusted, 새 UserPromptSubmit/Interrupt는 untrusted였다. 사용자 신뢰 승인 후 설정 API로 승인한 두 exact hash만 반영했으며 사용자 config의 다른 의미 값은 같음을 확인했다. 세 프로젝트 hook 모두 trusted인 readback은 `hooks-trusted-readback.json`에 있다. 사용자의 다음 실제 메시지에서 현재 작업의 turn marker가 새로 생성됐고 `turnId=01a0d758-0b3d-70a3-acfc-bc5b7fd74eb7`를 읽었다(`live-turn-marker-after-trust.json`). 따라서 실제 UserPromptSubmit 자동 실행은 확인됐다. 실제 Catalog 실행 턴의 Stop 통지와 Interrupt 중단은 기존 작업자를 재개하지 않아 앱 수준에서는 미검증이며, 해당 경계는 로컬 회귀로 확인했다. [공식 hook 신뢰 절차](https://learn.chatgpt.com/docs/hooks)는 변경된 정의의 정확한 hash에 승인을 결속한다.

PR C의 compact publication·10작품 checkpoint·50작품 차등 시험, 모델/추론 변경, 기존 정지 큐 재개는 수행하지 않았다.

이번 비교·회귀·제품 readback 자료의 workspace/backup 저장 영수증은 `.workspace/catalog-pipeline-ab-verification/storage-receipt.json`이다.

## 추가 리뷰 반영 — 즉시 수정 3건과 PR C

사용자가 지정한 범위는 즉시 수정과 PR C 전체이며, 최초 차등 비교는 **50작품 대신 보존된 5작품**이다. `catalog-pipeline-improvements`에서 기존 A/B를 유지하고 구현했다. 새 모델 호출·고정 작업 세션 재개·운영 Catalog 승격은 하지 않았다.

- 같은 `prepare`는 PREPARED와 source/backup 원문을 확인해 재사용한다. 같은 입력의 새 snapshot·backup은 0이며 새 파일만 추가 저장한다. 실제 Luna5 prepare 재호출도 snapshot 20649를 재사용했다.
- preflight report/PASS-SUBSET은 source summary와 receipt SHA/status/scope에만 결속한다. 시간·cache-hit 값은 실행 로그에 남기고 정상 재호출의 subset SHA를 바꾸지 않는다. 같은 검사 결과의 subprocess·새 저장은 0이다.
- canonical 서지는 ordinal/line을 정규화해 같은 행이면 DML을 생략한다. compact pair 초기화에서 한 번 반영하며 최신 서지·다른 source 행 보존 조건을 유지한다.
- backup의 header와 실제 `COUNT(*)`를 분리 계측했다. 격리된 17.1 GB 사본에서 9,944,653행의 같은 COUNT가 38.751초에서 0.071초로 줄었다. 짧은 index 크기는 111,255,552바이트였다. source/latest/previous의 schema v2 마이그레이션을 확인했고, 새 snapshot 없는 실제 백업은 0.260초였다. 단일 순차 측정으로 캐시 상태를 통제하지 않았으며 전체 처리량의 개선 배수로 해석하지 않는다. 초기 진단의 열린 reader로 발생한 Windows 회전 오류는 reader 종료 후 정상 backup으로 복구했다. 17 GB 실험 사본은 제거하고 측정 기록은 보존했다.
- PR C는 private catalog/registry의 같은 transaction에서 기존 planner·materializer·expected-after 검사를 실행한다. Work별 원본 판정 참조·plan·delta·expected-after를 남기고 기본 10작품 checkpoint와 최종 projection/readback 한 번을 사용한다. 시험 간격은 중간 재개를 검증하려고 2로 설정했다. 새 prior/review/readback/restore reader가 compact v1을 직접 읽으며 구 full 형식은 유지한다.

### 실제 5작품 차등 비교와 장애 복구

원본은 `ready-87-publication-20260924/apply-r003/publication-001`~`005`다. 같은 frozen/판정·초기 pair·과거 canonical·검토 시각을 사용하고 정상 batch CLI를 private 환경에서 실행했다. 마지막 완료본은 `planning/pipeline-prc-verification-20260925/trial5-r008`이다. 작업별 before/after 전체 source 상태·delta·target 행, 최종 전체 source table과 registry가 모두 기존 결과와 같다. 물리 SQLite SHA의 동일성을 주장하지 않는다.

| 발행 산출물 | 기존 full 5건 | compact 5건 |
| ----------- | ------------: | ----------: |
| 전체 DB 쌍  |             5 |           3 |
| 파일 수     |         2,299 |         409 |
| 바이트      |   325,445,035 | 221,832,047 |

공통 baseline과 최종 readback 작업 사본은 양쪽 집계에서 제외했다. compact 집계에는 두 중간 checkpoint와 최종 publication을 포함한다. 파일 수·저장량 비교이며 전체 수행시간의 비교 벤치마크는 아니다.

- `trial5-r006`에서 3번째 Work의 실제 mutation/expected-after 뒤 commit 직전에 중단을 주입했다. 두 DB가 모두 2건 checkpoint와 같은 bytes로 rollback됐고 STATE·완료 표시는 진행되지 않았다. 저장된 Work receipt 하나를 작업 사본에서 치운 후 백업에서 정확히 복구하고 3~5번만 재개해 완료했다. 이후 최종본에서도 동일한 5건 결과를 확인했다.
- checkpoint 파일 복사 중의 중단은 receipt 생성 전의 private 사본을 다시 만들며, receipt 이후 바이트가 바뀐 사본은 거부한다. receipt의 expected-after를 변조하고 manifest까지 다시 만든 시험도 원본 권한/plan 재구성에서 거부됐다.
- native prior reader로 54개 claim 그룹과 387개 review 파일을 확인했다. 최종 정상 CLI의 SQL → static build → coverage → `buildRecommendationPlan` readback은 `SQL_BUILD_COVERAGE_ENGINE_VERIFIED`: 3,309작품, eligible 1,938, libraryOnly 1,371, Gold 150, engine plan 1,936이다. 최종 코드의 관련 회귀 68개가 통과했다. 기존 A/B의 별도 역사 fixture 오류는 위 기록대로이며 전체 저장소 suite PASS로 확대하지 않는다.
- 최종 backup snapshot **20665**의 compact publication prefix에서 의존 원본까지 **22,131파일**을 새 디렉터리에 자동 복원했다. 원래 checkout의 파일/SQLite 읽기를 차단한 채 복원된 기존 native reader로 5건의 원본 판정·plan·최종 pair를 재검증했다. 별도 의존 파일 추가 없이 통과했으며 publication manifest는 `9dbe8041a43fe255b4823b7ecbd33a4ece75b7a4edd81bd6891adcd06b2df104`다. 초기 독립 복원에서 발견한 중첩 복원 경로의 이중 이동과 recovery epoch의 암묵적 원본 누락은 주 저장/경로 처리에서 수정했다. 기존 frozen·판정·역사 publication은 고치지 않았다.
- TypeScript 검사, readback ESLint, 문서/변경 MTS 포맷, 변경 Python 구문, `git diff --check`도 통과했다. 최종 publisher code identity와 저장된 실행 identity가 같고, 최종 readback의 현재 코드/입력/산출물 결속도 확인했다.

근거는 `.workspace/catalog-pipeline-performance-20260925/`의 `five-work-comparison.json`, `checkpoint-interruption.json`, `tamper-rejection.json`, `final-core-tests.log`, `backup-index-experiment.json`, `workspace-migration.json`과 최종 배치의 `readback/READBACK.json`, `BATCH-STORAGE.json`, `BATCH-COMPLETED.json`에 있다. canonical·운영 STATE·원본 job/RUN·현재 candidate/registry의 보호 대상 6개 SHA와 기존 `=ro`, `tmp/`를 보존했다. GitHub PR 생성·commit·push·merge·배포는 수행하지 않았다.

최종 readback·자동 복원·보호 파일 확인은 `FINAL-RESULT.json`, `restore-r008.log`, `restored-native-r008.log`에 결속했다. 구현/검증 요약의 추가 저장 영수증은 같은 디렉터리의 `storage-receipt.json`이다. 복원 작업 사본 전체를 새 snapshot에 재등록하지 않는다.

## Oracle 후속 계획 반영 — D1·D2 (2026-09-25)

인앱브라우저의 [Oracle 대화](https://chatgpt.com/c/6ab34eb0-9c64-83ee-adc0-13eacd080a36)와 열린 `implementation-plan.md` 전체를 읽고 현재 호출자·검사 범위와 대조했다. 같은 branch/HEAD의 미커밋 A/B/C를 유지하며 D1과 D2를 적용했다. 이번 실행은 `trial5-d1d2-r001`이며 이전 `trial5-r008`의 입력·판정·publication·code identity를 수정하지 않았다.

- **D1:** `preserve(reuse=True)`가 실제 파일 inventory를 시작/끝에 확인하고, lookup → missing 저장 → source 검증 → backup 필요 여부 조회/회전 → 최종 backup 검증 순으로 실행한다. snapshot 전체 membership과 blob 검증은 저장소별 하나의 읽기 transaction 안에서 공유하며 연결 종료 때 폐기한다. source와 backup은 별도로 검증하고 모든 reader를 닫은 뒤 회전한다. 기존 공개 `verify_saved`/`saved_files`는 독립 호출에서도 실제 파일을 시작·끝 확인한다. receipt·snapshot schema·복원 참조 의미는 유지한다.
- **D2:** 같은 before snapshot에서 planner facts를 만들며 기존 SQL facts와 정확한 동등성을 확인했다. tuple 행을 새 planner dict로 변환해 원 view를 변경하지 않는다. commit 성공 후 after·registry view·의미 SHA만 같은 connection의 다음 Work에 전달한다. transaction 안에서 읽은 `data_version`/`schema_version`과 `total_changes`를 비교하며, 외부/자체 쓰기·rollback·재개는 새 view를 읽는다. 전체 비대상·Gold·대표판·기존 evidence·metadata 보존과 원본 권한 replay를 유지한다.
- **계측/검증 순서:** 기존 driver에서 5건의 frozen/sealed·manifest 연결·JSON shape·기준 pair를 대량 복사 전에 확인한다. 기존 stdout에 의존 보존 counter, Work 구간, readback의 Python replay/SQL·Gold/build/engine 시간을 기록한다. telemetry는 권한 receipt identity에 추가하지 않는다. README의 정상 compact 경로에 외부 preflight를 전건 수행한다는 오래된 설명도 바로잡았다.

### 실제 5건 결과와 비용

동일한 기존 판정·reviewedAt·checkpoint 간격 2로 정상 batch 진입점을 한 번 실행했다. **5개 Work receipt 전체(plan·delta·before/after·expectedAfter 포함)가 r008과 일치**하며, 최종 전체 source 행·registry도 같았다. 독립 원본 replay → SQL/Gold → static build/coverage → 추천엔진이 통과했다. 3,309작품 / eligible 1,938 / libraryOnly 1,371 / Gold 150 / engine plan 1,936이다. 기존 37,175개 경고는 남아 있으며 새 FAIL은 없다. private STATE와 완료 영수증도 저장·백업됐다.

| 지표                                |                      이번 확인 |
| ----------------------------------- | -----------------------------: |
| 의존 경로 / inventory pass          |                 21,728개 / 2회 |
| inventory hash 호출 / 논리 bytes    | 43,456회 / 1,803,977,932 bytes |
| source / backup 고유 blob 검증      |                  각각 10,036회 |
| source / backup 전체 membership     |    각각 20 snapshot / 97,551행 |
| 의존 closure 탐색                   |                        17.99초 |
| preserve 전체                       |                        40.19초 |
| 5건의 compact before/after snapshot |                     10회 → 6회 |
| 같은 snapshot의 의미 hash           |                     10회 → 6회 |
| planner의 별도 전체 source 조회     |                      5회 → 0회 |
| batch.main 전체                     |                       263.35초 |
| 그중 readback 전체                  |                       101.04초 |
| readback의 독립 권한 replay         |                        88.94초 |
| readback의 SQL·Gold·authority       |                         6.98초 |
| readback의 build·coverage           |                         4.05초 |
| readback의 engine·unknown 검사      |                         0.25초 |

inventory counter는 해당 helper의 실제 bytes 읽기이며 OS 디스크 I/O가 아니다. 새 시험 경로·수정 코드 등 missing 468개를 저장하는 추가 읽기는 이 counter 밖이다. 그 snapshot이 추가되어 이전 19그룹/97,083행과 달라졌다. Work snapshot 횟수는 `apply_work` 소유 조회만 가리키며 metadata 초기화·adapter의 별도 검사를 포함하지 않는다. blob 19,390→10,036 비교의 앞 숫자는 이전 그룹별 SHA 집계이고 과거 실행의 계측 횟수는 아니다.

이전 batch 기록 404.82초보다 이번 263.35초가 짧았지만, 동일 OS cache·경합을 통제한 전후 benchmark는 아니다. 특히 readback은 이전 81.05초보다 이번 101.04초로 길었다. 고정 속도 개선율을 주장하지 않는다. 전체 시간에 하위 구간을 다시 더하지 않으며, driver의 환경 준비와 이 문서의 결과 비교는 batch 타이머 밖이다.

관련 Python 회귀 **73개 통과**(27.966초), typecheck, readback ESLint, 변경 Python 구문, Markdown/MTS 포맷, `git diff --check`를 확인했다. 회귀에는 저장소별 blob/membership 손상, 회전 후 다른 세대, 같은 SHA의 두 경로/그룹, mtime 복원 후 내용 변경, missing 저장 중 변경, 정상 no-op, facts 동등성, 비대상/대표판/evidence/metadata 훼손, 외부 writer에 의한 view 무효화, commit 실패와 pair rollback이 포함된다. 기존 전체 suite의 역사 fixture 오류를 해결하거나 전체 suite PASS로 보고한 것은 아니다.

### 채택하지 않은 조건부 항목

- **D3 live readback:** 약 89초의 replay는 유의미한 후속 대상이다. 다만 common preservation은 일부 PASS review/genre 필드를 변경 허용 범위로 검사하고, 신규 Theme/context는 membership/count를 확인한다. 모든 필드의 정확한 plan 값까지 대조하는 검사가 아니므로 actual에서 뽑은 `expectedAfter`만 넘겨 replay를 없애지 않았다. adapter별 exact-plan 확인과 Python owner→Node 내부 결과 전달을 함께 보완하는 별도 변경이 필요하다. 기존 독립 CLI·복원·resume의 원본 replay를 유지한다.
- **D4 최종 roots/references:** 기존 약 5초 구간을 위해 단일 snapshot 소비자와 복원 연결을 넓히지 않았다. 최종 814행 중 동일 path+SHA 중복은 6개였으며 대부분은 서로 다른 작업 경로였다. 이번에는 파일 삭제·저장 범위 축소·새 reference format을 하지 않았다.

참조 closure·복원 포맷을 바꾸지 않아 22,131파일 독립 복원을 반복하지 않았다. 작은 기존 복원/경로 회귀는 73개 검사에 포함된다. 신규 모델·운영 큐 재개·정식 Catalog/운영 STATE 반영·GitHub 쓰기는 없으며 보호 대상 6개 SHA가 그대로다.

근거: `.workspace/catalog-pipeline-performance-20260925/d1-d2-verification.json`, `d1-d2-tests.log`, `d1-d2-trial.log`. 최종 publication manifest는 `89be0380e8a4bee8fbc70dd57d2b1faf9b77e06cb7c6d433d585281fc12eeec1`이며 현재 publisher/readback identity를 확인했다. 배치 저장 snapshot은 20674, private STATE는 20675다. 이번 구현·요약의 별도 저장 영수증은 `d1-d2-storage.json`에 남긴다.
