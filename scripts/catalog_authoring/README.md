# Offline Catalog authoring

실행 코드와 필요한 기존 발행 backend를 이 디렉터리에서 추적한다. 원문·동결 입력·판정·후보·작업 DB는 Git에 포함하지 않는다.

2026-09-26 schema v3: [보존 정책과 전환 명령](../../docs/catalog-expansion/03-local-authoring-storage.md#현재-보존-정책--2026-09-26)을 따른다. 내부 `prepare`/`check`/`save`는 `PERSISTED`, 명시적 수집·판정·발행/중단 경계는 실제 `BACKED_UP`으로 구분한다. `notification_guard.py enqueue`와 명시적 `catalog_workspace.py backup`이 단계 백업을 수행하며 hook은 무거운 백업을 실행하지 않는다. `catalog_workspace.py run --phase-boundary`는 독립 실행 하나가 발행/인계 경계인 경우에만 사용한다. 현재 기준점은 `CURATION-BASELINE.json`과 generation/revision receipt이며, 완료 배치는 작은 completion 기록으로 중복을 차단한다. 아래 과거 snapshot 설명은 v2 호환이며 숫자 snapshot을 새 revision ID로 바꾸지 않는다.

- 일반 진입점: `python -X utf8 scripts/catalog_authoring_runner.py run --run-root <영구 planning 경로> --job <job.json> --decisions <판정.json>`
  - 여러 작품의 봉인된 READY가 모이면 조정자는 `python -B -X utf8 scripts/catalog_authoring_batch_publish.py --batch-summary <BATCH-SUMMARY.json> --batch-root <새 planning 디렉터리>`를 사용한다. 기본 compact 경로는 작품별 동결 입력·판정·현재 상태를 검사하며 private pair에 직렬 적용하고 최종 제품 빌드·추천 readback을 한 번 수행한다. 별도 publisher 사전검사 루프는 `--preflight-only` 또는 과거 `--publication-format full` 경로에서만 실행한다. 오류가 섞인 완료 묶음은 먼저 `--preflight-only`로 검사한다. 결과는 입력·결과·코드·candidate/registry·canonical SHA에 결속되고 같은 조합만 재사용한다. 알려진 Work별 prior/registry 충돌만 격리한 `PASS-SUBSET.json`을 원 summary SHA와 함께 저장하며, 공통·미분류 오류가 있으면 subset을 만들지 않는다. subset을 별도 batch root로 발행해 정상 작품의 동반 대기를 해소한다.
  - `BATCH-FINISHED.json`은 readback 완료 기록이다. 발행·readback 백업, STATE 반영·백업, `BATCH-COMPLETED.json`의 저장·백업까지 완료해야 최종 성공이다. 마지막 작은 영수증만 별도 저장하고 대규모 배치 snapshot은 재사용한다. STATE 쓰기 실패는 같은 명령으로 재개하며 이미 발행한 결과를 재판정·재발행하지 않는다. `STATE.publicationBatches`가 같은 summary의 적용 사실을 보존해 후속 current 이후에도 중복 적용을 막는다. 옛 receipt의 적용 계보가 불명확하면 자동 재발행하지 않는다.
  - 수정 research의 원문 의존관계는 기존 `--provenance-root <원 collection> --provenance-root <revision collection>`을 사용한다. job은 수정 research를 참조해도 원 collection의 raw/receipt를 별도로 동결할 수 있다. binder가 같은 Work와 SHA를 검증한다. 같은 URL의 상충하는 과거 관찰을 `--research`로 무조건 병합하거나 상위 배치 폴더를 통째로 복사하지 않는다.
  - READY summary의 `checkedPath`·`checkedSha256`로 CHECKED 전체를 검증한 뒤 그 안의 판정·입력 SHA를 사용한다. summary에 동일 SHA를 중복 기재하는 것은 선택이며 기재된 값이 다르면 거부한다. 실제 `checkStorage`(snapshot/backup)를 전달한다. 중복 필드만 빠졌다는 이유로 모델에게 요약을 다시 작성시키지 않는다.
  - 대표 ISBN·권수는 맞지만 `editionKind`가 틀린 경우 조정자는 `python -B -X utf8 scripts/catalog_authoring/repair_representative_editions.py --request <SHA 확인된 REQUEST.json> --output-root <새 planning/publication>`로 Catalog·registry를 함께 복사 정정한다. 공식 출판사 캡처의 정확한 ISBN·한정판 표기를 확인하고 새 volume evidence를 추가하며 기존 근거·ISBN·권수는 보존한다. 제품 readback과 발행물 백업 후에만 STATE를 옮긴다. 정정 전 frozen 입력은 수정하지 않고 새 판정 revision을 만든다.
- 위 명령은 **검사 후 발행**하며 조정자만 실행한다. 작업자는 `prepare --run-root <작품 run> --work-id <ID> --research <research.jsonl>`로 동결하고 `session-input/PROMPT.md`·`schema.json`을 읽어 같은 세션에서 판정한다.
- 새 run은 `researchRefs`의 direct collection을 자동 결속한다. `collection-session.json`의 Work, research SHA, capture/web-response receipt의 원문 SHA·길이를 검증한 파일만 동결한다. 추가 collection은 `--provenance-root <완성 collection>`을 반복 지정할 수 있다. 폴더 전체나 다른 작품 자료를 자동 복사하지 않으며, collection별 경로를 분리해 같은 파일명·상대 rawPath를 보존한다. `MODEL-INPUT.json.inputAccess`와 source별 `rawAccess`/`rawLookupPaths`를 확인한다. observations-only는 원문 접근 한계이며 자동 HOLD가 아니다.
- `NEEDS_PROVENANCE_BINDING`은 준비 단계 오류다. 세션 없는 raw 묶음이나 다른 Work의 collection을 내용 근거 부족 HOLD로 바꾸지 않는다. 세션 없는 기존 자료는 작업자가 해당 작품 자료임을 확인하고 기존 `--provenance-root`로 명시 결속할 수 있다. 이 경우 `explicit-legacy`로 기록하고 모든 파일 SHA·중첩 receipt·링크 경로를 검사하되, 파일 포함 자체를 동일 작품의 근거 인증으로 표시하지 않는다. 자동 parent 복사는 하지 않는다. 원본을 보존하고 올바른 결속으로 새 run을 만든다. 기존 RUN의 provenance·registry·recovery 인자 변경은 거부하며 기존 PREPARED 프롬프트와 frozen 입력을 재작성하지 않는다.
- `check --run-root <같은 run> --decisions <판정.json>`은 기존 seal/HOLD 검사를 공유하며 `CHECKED.json`·`CHECK-STORAGE.json`을 저장한다. READY_FOR_PUBLICATION/HOLD는 비발행 상태이고 공유 STATE·canonical을 변경하지 않는다. 새 원문은 새 run revision으로 동결한다.
- 기존 accepted prior를 보존하는 명시적 `--job`은 원본 권한 publication bundle을 `--prior-bundle <원본 디렉터리>`로 함께 전달한다(복수 지정 가능). RUN의 `priorBundleBindings`가 경로·manifest SHA를 결속하고 동결·저장·백업에 포함한다. 다른 bundle을 기존 run에 추가하거나 교체하지 말고 새 run을 만든다. `--recovery-epoch`로 accepted prior를 비워 이 경로를 대체하지 않는다. AMP 보호 경계는 유지한다.
- `notification_guard.py register-batch --session <ID> --parent <ID> --dispatch <배치 dispatch> --artifact <단계 summary> --run <배치 디렉터리>`는 dispatch phase에 맞춰 collection-only 또는 adjudication 배치를 등록한다. Collection summary는 배정된 Work ID·수집 상태·user-source/research SHA·raw receipt/body SHA·workspace/backup receipt를 검사하며 `checkedPath`를 요구하지 않는다. Adjudication summary는 기존 CHECKED·봉인·백업 결속을 검사한다. 검증된 결과만 실제 전송 응답과 함께 기존 `ack`에 전달한다. ERROR는 원인과 저장된 검사 artifact를 보존한다.
- 기본 실행은 제공되거나 RUN에 저장된 판정만 사용한다. 판정 누락 시 모델을 자동 호출하지 않는다. `--allow-model`은 과거 별도 승인된 일회성 Sol medium CLI 경로이며 **현재 루나1~6 고정 세션의 모델 설정이 아니다**. 현재 배정·판정은 [고정 세션 표](../../docs/catalog-expansion/01c-sol-batch-promotion-plan.md#3-역할과-세션)와 조정자가 루나1~6에 보내는 `send_message_to_thread(model="gpt-6-luna", thinking="xhigh")`를 사용한다. 부모 오케스트레이터 세션 `01a0a3b8-5162-78f0-ac39-4e17f730a70a`의 설정은 `gpt-5.6-sol` / `high`로 별개다. 일반 배치에서 `--allow-model`·`--model-session`·`--retry-model`을 쓰지 않는다.
- `send_message_to_thread`의 model/thinking은 수신 세션 설정이다. 루나1~6에 배정·재개할 때는 `gpt-6-luna` / `xhigh`, 부모 `01a0a3b8-5162-78f0-ac39-4e17f730a70a`에 보고할 때는 `gpt-5.6-sol` / `high`를 지정한다.
- 수집: `node scripts/catalog_authoring/collect_factor_evidence.mjs`
- 독립 준비/발행: `python -X utf8 scripts/catalog_authoring/prepare_factor_batch.py --help`
- 영구 자료: `data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902/`
- 저장 DB와 백업: `data/local/catalog-authoring/workspace.sqlite`, `backups/`
- 임시 출력: `.workspace/`. 호환 링크·심링크는 생성하지 않는다.

수집 배정 전 `python -X utf8 scripts/catalog_authoring/plan_dispatch.py --dispatch <기존 COLLECTION-DISPATCH.json> --output <새 PLAN.json>`을 실행한다. 현재 candidate/registry·Gold·계약·소유권 SHA에 묶어 eligible/protected/prior-recovery/registry-repair/fresh를 구분하며 복합 문제를 유지한다. 판정 배정과 유효한 완료 요약은 `--batch-summary`로 검증해 READY 재사용을 식별한다. 자료 충분성·의미 판정은 하지 않고 기존 배정도 수정하지 않는다. 기준 SHA가 바뀌면 새 계획을 만든다.

2026-09-23 효율화 검토 및 실제 실행 근거: [검토 결과](../../docs/catalog-expansion/04-efficiency-review-20260923.md). 아래 회귀 명령은 현재 연속 작업 중 실행하지 않으며 사용자 지시대로 최종 검증 때 실행한다.

과거 동결본의 경로 문자열은 변경하지 않는다. `workspace_paths.artifact_path()`는 읽기 경계에서 해당 자료의 현재 위치를 찾으며, 원래 manifest·SHA 검증은 유지한다. `legacy/`는 현재 발행 경로가 사용하는 기존 backend이며 검증 우회 경로가 아니다.

회귀 검사:

```powershell
python -B -X utf8 -m unittest discover -s scripts -p test_catalog_authoring_runner.py
python -B -X utf8 -m unittest discover -s scripts -p test_catalog_workspace.py
python -B -X utf8 -m unittest discover -s scripts/catalog_authoring -p test_factor_single_pass_artifacts.py
```

실제 보존 artifact 검사는 로컬 원본이 필요하다. 원본이 없는 checkout의 skip이나 mock 모델 검사는 실제 판정·승격의 증거가 아니다. Node 24와 기존 로그인된 Codex CLI가 실행 전제다.

### 2026-09-23 재개 옵션과 N/T 예외

- 새 RUN은 명시 `--provenance-root`만 `requestedProvenanceRoots`에 저장한다. 자동 발견을 합친 `provenanceRoots`/`provenanceBindings`는 실제 바이트 결속에 사용한다. 같은 명시 옵션으로 재개할 수 있고 변경된 명시 옵션은 거부한다. 옵션 생략은 기존 동결 입력 재사용이다. 구 RUN은 원래 명시 옵션을 복원할 수 없으므로 기존 엄격 비교를 유지한다. 혼합 구 RUN은 provenance 옵션을 생략해 재개하며 새 동결을 만들 필요가 없다.
- N/T 예외는 새 v4 job의 선택 `narrativeToneExhaustion`을 사용한다. [정확한 필드와 계약](../../docs/catalog-expansion/02-authorized-evidence-panel-v1.md)을 따르고 기존 `prepare --job` → 별도 실제 판정 → `check` → 조정자의 `run --decisions`/발행 → 제품 readback 순서를 유지한다. 별도 승격 명령이나 일회성 모델 호출을 추가하지 않는다.
- 역사적 legacy validator/직접 CLI의 기본 최소치는 그대로다. 현재 single-pass 경로의 검증된 adapter만 결속된 예외를 전달한다. 판정 자료·발행 evidence·compiled eligibility를 함께 검사한다.
- 추가한 회귀: runner 자동+명시 collection 최초 prepare/동일 재개/옵션 변경 거부, planner 전체 plan의 READY+registry-repair·소유권·SHA·stale STATE, N/T check→임시 후보 발행→기존 제품 readback, 다른 blocker·unknown·추천 수축 보존. 현재 사용자 지시에 따라 작성만 했으며 테스트 실행·CI는 최종 검증 때 한다.

### 2026-09-25 반복 저장과 compact 발행

- 재사용 보존은 한 호출의 실제 파일 inventory를 공유한다. source와 최종 backup은 각각 하나의 읽기 transaction에서 전체 snapshot membership과 고유 blob을 검증하고, 마지막에 파일 집합·실제 bytes를 다시 대조한다. 읽기 연결은 저장/backup 회전 전에 닫으며 source의 검증을 backup에 재사용하지 않는다. 포맷·참조 집합은 유지한다.
- compact planner는 같은 before snapshot에서 facts를 만든다. commit 성공 후의 after snapshot·의미 SHA만 다음 Work의 before로 재사용한다. 다른 연결의 쓰기·schema 변경·own-connection 쓰기·rollback·checkpoint 재개 시 재사용하지 않는다. 비대상/Gold/대표판/evidence/metadata 보존과 독립 replay는 유지한다.
- 기존 stdout 로그의 `compactDependencyStorage`, `compactProcessed.metrics`, `readbackTimingsSeconds`로 실제 helper의 hash·blob·membership·snapshot 횟수와 구간 시간을 확인한다. 계측은 publication/receipt identity에 넣지 않으며 OS의 실제 디스크 I/O 수치가 아니다.
- 같은 `prepare`는 기존 PREPARED와 실행 입력의 bytes를 source/backup에서 확인하고 재사용한다. 새 파일만 저장한다. `storage.snapshot`은 단일 snapshot, `storage.snapshots`는 여러 기존 snapshot 조합이며 `references`에 정확한 member SHA가 있다. 판정·동결 입력 변경은 기존대로 거부한다.
- preflight report/PASS-SUBSET identity에는 source summary SHA와 Work별 receipt SHA/status/scope만 포함한다. 호출 시간·cache hit는 실행 로그에 남기며 같은 검사 결과의 identity를 바꾸지 않는다.
- `catalog_authoring_batch_publish.py`의 기본 발행 형식은 `compact`다. `--checkpoint-every 10`이 기본이며 `--publication-format full`은 기존 full 형식으로 실행한다. 동일 canonical 서지는 한 번만 반영하고 같은 행은 DML을 하지 않는다.
- compact는 기존 원본 판정과 publisher planner를 사용한다. 작품별 plan/delta/expected-after를 저장하고 최종 제품 readback에서 같은 권한으로 재구성해 전체 source 행과 registry를 확인한다. 구 publication과 신규 compact의 prior/review reader를 함께 유지한다. [저장·복원 계약](../../docs/catalog-expansion/03-local-authoring-storage.md)을 따른다.

### 2026-09-25 입력·통지 개선

- 신규 v4 job의 빈 `sourceBindings`는 job 자체의 SHA-bound `researchRefs`에서도 조립한다. 비어 있지 않은 명시 선택은 보존하고, `--research`로 명시 추가한 자료만 추가 결속한다. source 채택 용도는 독립 판정의 `sourceDecisions.uses`가 정한다. 동결 전 원본/보충 evidence ID 중복과 정확한 registry support URL의 같은 Work 연결 누락은 `INPUT_NEEDS_REPAIR`로 보고한다. URL alias를 추정하거나 원문 접근 제한만으로 HOLD를 만들지 않는다.
- collector draft의 선택 `narrativeToneExhaustion`은 실제 조사자의 기존 예외 기록이다. `isbn13`과 같은 Work를 검증한 뒤 별도 `COLLECTION-HANDOFF.json` (`factor-collection-handoff-v1`)에 `researchSha256`과 함께 저장한다. collector v1 research schema는 그대로다. collector의 완료 receipt/`collection-events.jsonl`에 예상 `handoffSha256`을 남기므로 첫 조립 전에 sidecar가 삭제·변경돼도 복구 대상으로 검출한다. 조립된 research ref의 선택 `handoffSha256`·`collectionReceiptSha256`과 frozen `sourceInputBindings`/provenance가 원본을 결속한다. 과거 sidecar 없는 수집분도 지원한다. 명시 job과 서로 다른 기록은 거부한다. 부분 sidecar가 남으면 원본을 보존하고 새 collection revision을 쓴다. 소진·시도·unknown 값은 생성하지 않는다. 언어 `zh`를 명시 지원한다.
- 동일 `catalog-check-storage-v2` CHECKED는 input/result/decision/RUN의 실제 bytes를 작업 SQLite와 latest backup에서 확인한 뒤 재사용한다. receipt 자체까지 양쪽 저장소에 있으면 새 snapshot·백업·receipt를 쓰지 않는다. 중단된 receipt 저장은 누락된 작은 receipt만 한 번 저장·백업해 복구한다. 이전 형식은 최초 한 번 새 영수증을 만든다.
- preflight receipt v2는 실제 Python 코드, 외부 경로·저장 helper, 계약, Gold manifest, SQL, Python/SQLite 버전과 정확한 명령·입력·현재 pair를 결속한다. 같은 key 생성은 OS lock으로 직렬화한다. `--preflight-attempt <새 시도 ID>`는 환경 오류를 재검사하며 과거 BLOCKED는 보존한다. `--preflight-retry <workId>=<새 시도 ID>`는 그 작품만 재검사한다. `timingsSeconds`는 이번 호출의 lock/validation/lookup/subprocess/total 시간이며 cache hit의 subprocess 시간은 0이다. 과거 실행 비용은 `originalCheckSeconds`와 `originalExecutionSeconds`로 분리한다. 이전 receipt에 subprocess 측정값이 없으면 후자는 null이다. workspace backup은 header/membership, blob copy/readback, 새 membership, commit/readback, rotation 시간을 구분한다. 캐시 hit에도 frozen 입력 검증을 수행하며 발행 직전 현재 상태 검사와 최종 readback은 생략하지 않는다. 기존 process 범위 manifest cache를 영구 캐시로 확대하지 않는다.

통지 절차:

1. 기존 `register-batch`로 배정을 등록한다. Catalog를 실행하는 턴에서만 `notification_guard.py arm --session <ID>`를 호출한다. UserPromptSubmit은 턴 ID만 저장하며 프롬프트 본문은 보존하지 않는다. 새 프롬프트는 이전 arm을 해제한다. 회고·보고 전용 턴은 arm하지 않는다. 사용자 중단/Interrupt 후 재실행은 명시 승인된 새 턴의 `arm --resume`만 허용한다. 중단 턴 ID와 배정 generation을 보존하여 같은 턴의 `--resume`과 오래된 Interrupt를 거부한다. 기존 active 등록은 자동 활성화하지 않는다.
2. 결과·backup을 확인한 다음 `enqueue --session <ID>`를 실행한다. `runRoot/notification-events/<eventId>/`에 원본 checkpoint와 불변 event를 저장한다. ID는 owner/parent/배정 digest/phase/generation/checkpoint SHA/kind에 결속된다. `notifications/inbox/<parent>/<eventId>.json`은 작은 인덱스다. 등록한 runRoot/generation을 `notifications/roots/<parent>/`에 보존하고 drain·새 배정 전에 해당 event 디렉터리만 대조해 유실된 인덱스를 복구한다. Catalog 전체를 검색하지 않는다. 다음 정상 배치 저장·백업에 event 디렉터리·이 인덱스·roots 등록을 함께 포함한다. 강제 종료 전 저장되지 않은 결과나 idle 부모의 즉시 처리를 보장하지 않는다.
3. 전송 성공 뒤 `ack --session <ID> --sha <checkpoint SHA> --event <eventId>`의 stdin으로 실제 도구 응답 JSON을 전달한다. 부분/사용자 중단도 event ID로 ACK하며 정지 상태는 유지한다. 기존 완료 통지는 event 생략도 지원한다. `transport.json`은 전송 기록이며 소비 완료를 뜻하지 않는다. Stop은 arm된 현재 턴의 새 완료 checkpoint만 한 번 상기하며 전송/소비된 checkpoint를 반복하지 않는다. 결과가 없는 턴을 강제 계속하거나 보고하도록 막지 않는다.
4. 부분 보고는 `enqueue --session <ID> --checkpoint <JSON> --kind partial-stop`이다. JSON은 `batchId`, `ownerThreadId`, `parentThreadId`, guard의 `phase` (`batch` 또는 `collection-batch`), `processedCount`, `nextWorkId` (없으면 null), `exactReason`, `needsResume`를 실제 checkpoint에서 작성한다. 사용자 중단은 `--kind user-stop`, `needsResume=false`이며 등록도 중지한다. 부분 이벤트는 발행 권한이 아니다.
5. 부모의 다음 active turn에서 `drain --parent <ID>`로 검증된 미소비 이벤트를 읽는다. 처리 후 ACK 전 중단에 대비해 `handlingRecorded`와 실제 발행 summary SHA를 키로 한 `STATE.publicationBatches`를 먼저 대조한다. 기존 발행은 원래 batch root의 완료·백업 복구 경로를 사용하고 재발행하지 않는다.
6. 부모는 아래 형식으로 실제 처리/인계 결정을 저장하고 `consume --parent <ID> --event <eventId> --effect <JSON>`을 실행한다. `handling.json`을 먼저 내구성 있게 기록하고 `consumed.json`에 그 SHA를 남긴다. 같은 결정 재전달은 멱등이다. `published`/`partially-published`는 `publications: [{summaryPath, summarySha256}]`로 실제 발행 subset들을 결속한다(생략 시 원 summary). `sourceSummary` 체인의 SHA·정확한 원 행, STATE 원장, `BATCH-FINISHED`의 실제 적용 Work 집합, `verify_completed`의 완료/readback/backup을 확인한다. `partially-published`는 처리 이력을 남기되 consumed로 닫지 않고 남은 READY를 drain에 표시한다. 이후 처리 이력은 적용 Work 집합이 증가할 때만 갱신할 수 있고, 전부 처리되면 `published`로 닫는다. 나머지 결정은 덮어쓰지 않는다. 다른 결정은 단계 전환이나 발행을 수행하지 않는다. 처리 영수증도 다음 정상 저장에 포함한다.

```json
{
  "schemaVersion": "catalog-notification-handling-v1",
  "eventId": "<drain이 반환한 64자리 SHA>",
  "parentThreadId": "<부모 ID>",
  "decision": "deferred",
  "reason": "실제 처리 결과 또는 후속 조치가 필요한 구체적인 이유"
}
```

`decision`은 `deferred | stopped | stage-reviewed | published | partially-published`다. [공식 Hooks 계약](https://learn.chatgpt.com/docs/hooks)의 UserPromptSubmit/Stop `turn_id`와 Interrupt를 사용한다. 변경한 프로젝트 hook 정의는 앱의 신뢰 검토 대상이며 로컬 명령 검사와 실제 앱 hook 실행은 구분한다.

이번 변경은 발행 포맷·작품별 판정·수집→판정 승인 경계를 유지한다. private pair/10작품 checkpoint/논리 delta/최종 projection 1회와 50작품 차등 시험은 다음 구조 변경 단계다.

## Publisher 책임 경계 (2026-09-25 PR B)

기존 `publish_batch`/legacy `publish`의 CLI·결과 파일·manifest 형식은 유지한다. legacy publisher 내부를 `verify_immutable` → `plan_against_current` → `apply_plan_in_transaction` → `verify_expected_after` → `finalize_projection`으로 분리했다. `_apply_plan`은 기존 경로 인자를 받는 wrapper로 남으며, BEGIN IMMEDIATE부터 공통·context·정정·복구 반영과 예상 결과 검사까지 한 connection에서 처리한 뒤 commit한다. 각 materializer는 connection/commit을 생성하지 않는다. 호출자가 직접 connection을 공급할 경우 transaction과 rollback도 호출자 소유다.

정정/복구 후반 실패는 앞선 공통 변경까지 되돌릴 수 있다. 입력·기존 DB 행·Gold·unknown·대표판 검증은 그대로 유지한다. 트랜잭션 수 변화로 SQLite header의 change counter와 이에 결속된 SHA가 달라질 수 있으므로 출력 DB의 물리 SHA 동일성을 약속하지 않는다. registry/metadata와 기존 full publication의 외부 순서는 유지하며, catalog/registry pair transaction 및 compact publication은 PR C의 별도 변경이다.
