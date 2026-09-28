# Offline Catalog authoring

현재 명령·receipt 계약 · 갱신일: 2026-09-27

실행 코드와 필요한 기존 발행 backend를 이 디렉터리에서 추적한다. 원문·동결 입력·판정·후보·작업 DB는 Git에 포함하지 않는다.

[저장 계약](../../docs/catalog-expansion/03-local-authoring-storage.md#현재-보존-정책)에 따라 내부 `prepare`/`check`/`save`는 `PERSISTED`, 명시적 수집·판정·발행/종료·중단 경계는 실제 `BACKED_UP`으로 구분한다. `notification_guard.py enqueue`와 명시적 `catalog_workspace.py backup`이 단계 백업을 수행하며 hook은 백업하지 않는다. `run --phase-boundary`는 독립 실행 하나가 발행/인계 경계인 경우에만 사용한다. 현재 기준점은 `CURATION-BASELINE.json`과 generation/revision receipt다.

receipt의 `snapshot`·`snapshots`·`snapshotId`는 기존 인터페이스 필드명이다. v3/v4에서는 실제 generation과 revision UUID를 확인하며 구 숫자 snapshot은 명시적 legacy pin에만 사용한다. 필드명만 보고 새 ID를 만들거나 구 세대를 revision schema로 해석하지 않는다.

Catalog Python 명령은 `python scripts/catalog_python.py <script> <args>`로 실행한다(Linux/WSL은 `python3`). 최초 `python scripts/setup_catalog_runtime.py`가 공식 archive checksum과 실제 부모·자식 로드 버전을 검증한 SQLite 3.53.4 runtime을 설치한다. Windows는 Python 3.13.15 bundle, Linux는 호스트 Python 3.12+와 gcc로 준비하는 전용 venv/shared library다. 시스템 Python은 변경하지 않으며 내부 Python helper도 같은 runtime을 사용한다. v4 workspace만 WAL과 `synchronous=FULL`을 사용하고 catalog/registry attached pair는 DELETE를 유지한다. runtime 설치와 운영 DB 전환은 별개다. writer 중지·기존 백업·generation 보존·새 백업/readback을 포함하는 명시 전환은 `catalog_retention.py upgrade-v4 --enable-wal`이며 중단된 동일 전환만 `--resume`으로 재개한다.

## 역할별 진입점

- 일반 진입점: `python scripts/catalog_python.py scripts/catalog_authoring_runner.py run --run-root <영구 planning 경로> --job <job.json> --decisions <판정.json>`
  - 여러 작품의 봉인된 READY가 모이면 조정자는 `python scripts/catalog_python.py scripts/catalog_authoring_batch_publish.py --batch-summary <BATCH-SUMMARY.json> --batch-root <새 planning 디렉터리>`를 사용한다. 기본 compact 경로는 작품별 동결 입력·판정·현재 상태를 검사하며 private pair에 직렬 적용하고 최종 제품 빌드·추천 readback을 한 번 수행한다. 별도 publisher 사전검사 루프는 `--preflight-only` 또는 과거 `--publication-format full` 경로에서만 실행한다. 오류가 섞인 완료 묶음은 먼저 `--preflight-only`로 검사한다. 결과는 입력·결과·코드·candidate/registry·canonical SHA에 결속되고 같은 조합만 재사용한다. 알려진 Work별 prior/registry 충돌만 격리한 `PASS-SUBSET.json`을 원 summary SHA와 함께 저장하며, 공통·미분류 오류가 있으면 subset을 만들지 않는다. subset을 별도 batch root로 발행해 정상 작품의 동반 대기를 해소한다.
  - `BATCH-FINISHED.json`은 readback 완료 기록이다. 발행·readback 백업, STATE 반영·백업, `BATCH-COMPLETED.json`의 저장·백업까지 완료해야 최종 성공이다. 마지막 작은 영수증만 별도 저장하고 이미 보존한 배치 원본과 membership은 재사용한다. STATE 쓰기 실패는 같은 명령으로 재개하며 이미 발행한 결과를 재판정·재발행하지 않는다. `STATE.publicationBatches`가 같은 summary의 적용 사실을 보존해 후속 current 이후에도 중복 적용을 막는다. 옛 receipt의 적용 계보가 불명확하면 자동 재발행하지 않는다.
  - 승인한 완료 배치의 정식 반영에는 같은 명령에 `--apply-canonical`을 추가한다. candidate 완료와 canonical 완료는 별도이며 preflight에는 이 옵션을 사용하지 않는다. 대상 Work와 필요한 evidence/review만 최신 canonical에 병합하고 metadata·비대상·Gold를 보존해 정식 DB에서 생성 데이터를 다시 빌드한다. `CANONICAL-COMPLETED.json`과 `canonical-completion` revision은 candidate receipt SHA·summary SHA·실제 source/생성 파일 readback·백업에 결속한다. 같은 옵션으로 재개하면 후보를 재발행하지 않고 남은 정식 반영/백업을 이어간다. GitHub 쓰기·배포는 수행하지 않는다.
  - 수정 research의 원문 의존관계는 기존 `--provenance-root <원 collection> --provenance-root <revision collection>`을 사용한다. job은 수정 research를 참조해도 원 collection의 raw/receipt를 별도로 동결할 수 있다. binder가 같은 Work와 SHA를 검증한다. 같은 URL의 상충하는 과거 관찰을 `--research`로 무조건 병합하거나 상위 배치 폴더를 통째로 복사하지 않는다.
  - READY summary의 `checkedPath`·`checkedSha256`로 CHECKED 전체를 검증한 뒤 그 안의 판정·입력 SHA를 사용한다. summary에 동일 SHA를 중복 기재하는 것은 선택이며 기재된 값이 다르면 거부한다. 실제 `checkStorage`(snapshot/backup)를 전달한다. 중복 필드만 빠졌다는 이유로 모델에게 요약을 다시 작성시키지 않는다.
  - 대표 ISBN·권수는 맞지만 `editionKind`가 틀린 경우 조정자는 `python scripts/catalog_python.py scripts/catalog_authoring/repair_representative_editions.py --request <SHA 확인된 REQUEST.json> --output-root <새 planning/publication>`로 Catalog·registry를 함께 복사 정정한다. 공식 출판사 캡처의 정확한 ISBN·한정판 표기를 확인하고 새 volume evidence를 추가하며 기존 근거·ISBN·권수는 보존한다. 제품 readback과 발행물 백업 후에만 STATE를 옮긴다. 정정 전 frozen 입력은 수정하지 않고 새 판정 revision을 만든다.
- 위 명령은 **검사 후 발행**하며 조정자만 실행한다. 작업자는 `prepare --run-root <작품 run> --work-id <ID> --research <research.jsonl>`로 동결하고 `session-input/PROMPT.md`·`schema.json`을 읽어 같은 세션에서 판정한다.
- 새 run은 `researchRefs`의 direct collection을 자동 결속한다. `collection-session.json`의 Work, research SHA, capture/web-response receipt의 원문 SHA·길이를 검증한 파일만 동결한다. 추가 collection은 `--provenance-root <완성 collection>`을 반복 지정할 수 있다. 폴더 전체나 다른 작품 자료를 자동 복사하지 않으며, collection별 경로를 분리해 같은 파일명·상대 rawPath를 보존한다. `MODEL-INPUT.json.inputAccess`와 source별 `rawAccess`/`rawLookupPaths`를 확인한다. observations-only는 원문 접근 한계이며 자동 HOLD가 아니다.
- `NEEDS_PROVENANCE_BINDING`은 준비 단계 오류다. 세션 없는 raw 묶음이나 다른 Work의 collection을 내용 근거 부족 HOLD로 바꾸지 않는다. 세션 없는 기존 자료는 작업자가 해당 작품 자료임을 확인하고 기존 `--provenance-root`로 명시 결속할 수 있다. 이 경우 `explicit-legacy`로 기록하고 모든 파일 SHA·중첩 receipt·링크 경로를 검사하되, 파일 포함 자체를 동일 작품의 근거 인증으로 표시하지 않는다. 자동 parent 복사는 하지 않는다. 원본을 보존하고 올바른 결속으로 새 run을 만든다. 기존 RUN의 provenance·registry·recovery 인자 변경은 거부하며 기존 PREPARED 프롬프트와 frozen 입력을 재작성하지 않는다.
- `check --run-root <같은 run> --decisions <판정.json>`은 기존 seal/HOLD 검사를 공유하며 `CHECKED.json`·`CHECK-STORAGE.json`을 저장한다. READY_FOR_PUBLICATION/HOLD는 비발행 상태이고 공유 STATE·canonical을 변경하지 않는다. 새 원문은 새 run revision으로 동결한다.
- 기존 accepted prior를 보존하는 명시적 `--job`은 원본 권한 publication bundle을 `--prior-bundle <원본 디렉터리>`로 함께 전달한다(복수 지정 가능). RUN의 `priorBundleBindings`가 경로·manifest SHA를 결속하고 동결·저장·백업에 포함한다. 다른 bundle을 기존 run에 추가하거나 교체하지 말고 새 run을 만든다. `--recovery-epoch`로 accepted prior를 비워 이 경로를 대체하지 않는다. AMP 보호 경계는 유지한다.
- `notification_guard.py register-batch --session <ID> --parent <ID> --dispatch <배치 dispatch> --artifact <단계 summary> --run <배치 디렉터리>`는 dispatch phase에 맞춰 collection 또는 adjudication 배치를 등록한다. Collection summary는 배정된 Work ID·수집 상태·user-source/research SHA·raw receipt/body SHA·workspace/backup receipt를 검사하며 `checkedPath`를 요구하지 않는다. Adjudication summary는 기존 CHECKED·봉인·백업 결속을 검사한다. 검증된 결과만 실제 전송 응답과 함께 기존 `ack`에 전달한다. ERROR는 원인과 저장된 검사 artifact를 보존한다.
- 기본 실행은 제공되거나 RUN에 저장된 판정만 사용한다. 판정 누락 시 모델을 자동 호출하지 않는다. 일반 고정 세션 배치에서 `--allow-model`·`--model-session`·`--retry-model`을 쓰지 않는다. 별도 승인된 호환 CLI 모델 경로를 현재 배정의 대체 수단으로 사용하지 않는다.
- 메시지 수신자 ID와 작업자 새 턴의 model/thinking은 [배치 계약 §3](../../docs/catalog-expansion/01c-sol-batch-promotion-plan.md#3-역할과-세션)을 따른다. 작업자가 부모에게 보고할 때는 model/thinking을 생략해 부모 설정을 건드리지 않는다. 과거 이름·CLI 기본값에서 추정하지 않는다.
- 사전 리드 JSON과 자료 적격성: [정식 리드 규격](../../docs/catalog-expansion/user-source-leads.md). 실제 취득·관찰·원문 저장: [수집 지침](../../docs/catalog-expansion/factor-collector-instructions.md).
- 새 freeze의 `--provenance-root`는 현재 job의 Work 범위로 해석한다. 정식 `.workspace/user-sources/` 루트는 해당 `<workId>.json`의 형식·Work를 검증해 결속하고 다른 작품 파일을 복사하지 않는다. Work collection은 research·raw receipt와 명시된 보충 파일을 검증한다. session 없는 임의 디렉터리는 전체 복사나 무시 대신 `NEEDS_PROVENANCE_BINDING`으로 거부한다. 그 안에서 쓸 파일은 `node scripts/catalog_authoring/collect_factor_evidence.mjs start <assigned-dir> <workId> --input <파일1> --input <파일2>`로 해당 Work collection에 먼저 결속하고 기존 `write`·`prepare --provenance-root <collection>` 순서를 사용한다. 이 입력은 파일 바이트 보존과 모델 접근을 결속하며 원문 독해·HTTP 응답·의미 채택을 합성하지 않는다.
- 수집: `node scripts/catalog_authoring/collect_factor_evidence.mjs`
- 독립 준비/발행: `python scripts/catalog_python.py scripts/catalog_authoring/prepare_factor_batch.py --help`
- 영구 자료: `data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902/`
- 저장 DB와 백업: `data/local/catalog-authoring/workspace.sqlite`, `backups/`
- 임시 출력: `.workspace/`. 호환 링크·심링크는 생성하지 않는다.

수집 배정 전 `python scripts/catalog_python.py scripts/catalog_authoring/plan_dispatch.py --dispatch <기존 COLLECTION-DISPATCH.json> --output <새 PLAN.json>`을 실행한다. 현재 candidate/registry·Gold·계약·소유권 SHA에 묶어 eligible/protected/prior-recovery/registry-repair/fresh를 구분하며 복합 문제를 유지한다. 판정 배정과 유효한 완료 요약은 `--batch-summary`로 검증해 READY 재사용을 식별한다. 자료 충분성·의미 판정은 하지 않고 기존 배정도 수정하지 않는다. 기준 SHA가 바뀌면 새 계획을 만든다.

검사 범위와 실행 시점은 AGENTS.md의 현재 작업 계약을 따른다. 연속 승격의 중간 검사 예외를 일반 유지보수에 확대하지 않는다.

과거 동결본의 경로 문자열은 변경하지 않는다. `workspace_paths.artifact_path()`는 읽기 경계에서 해당 자료의 현재 위치를 찾으며, 원래 manifest·SHA 검증은 유지한다. `legacy/`는 현재 발행 경로가 사용하는 기존 backend이며 검증 우회 경로가 아니다.

회귀 검사:

```powershell
python scripts/catalog_python.py -m unittest discover -s scripts -p test_catalog_authoring_runner.py
python scripts/catalog_python.py -m unittest discover -s scripts -p test_catalog_workspace.py
python scripts/catalog_python.py -m unittest discover -s scripts/catalog_authoring -p test_factor_single_pass_artifacts.py
```

실제 보존 artifact 검사는 로컬 원본이 필요하다. 원본이 없는 checkout의 skip이나 mock 모델 검사는 실제 판정·승격의 증거가 아니다. Node 24를 사용한다. 일반 판정은 고정 작업 세션에서 수행하며 CLI 모델 로그인은 별도 승인된 모델 호출 경로에만 필요하다.

## 재개 옵션과 N/T 예외

- 새 RUN은 명시 `--provenance-root`만 `requestedProvenanceRoots`에 저장한다. 자동 발견을 합친 `provenanceRoots`/`provenanceBindings`는 실제 바이트 결속에 사용한다. 같은 명시 옵션으로 재개할 수 있고 변경된 명시 옵션은 거부한다. 옵션 생략은 기존 동결 입력 재사용이다. 구 RUN은 원래 명시 옵션을 복원할 수 없으므로 기존 엄격 비교를 유지한다. 혼합 구 RUN은 provenance 옵션을 생략해 재개하며 새 동결을 만들 필요가 없다.
- N/T 예외는 새 v4 job의 선택 `narrativeToneExhaustion`을 사용한다. [정확한 필드와 계약](../../docs/catalog-expansion/02-authorized-evidence-panel-v1.md)을 따르고 기존 `prepare --job` → 별도 실제 판정 → `check` → 조정자의 `run --decisions`/발행 → 제품 readback 순서를 유지한다. 별도 승격 명령이나 일회성 모델 호출을 추가하지 않는다.
- 역사적 legacy validator/직접 CLI의 기본 최소치는 그대로다. 현재 single-pass 경로의 검증된 adapter만 결속된 예외를 전달한다. 판정 자료·발행 evidence·compiled eligibility를 함께 검사한다.

## Catalog 유지보수 명령의 입력 범위

- ISBN 수정은 전체 source와 실제로 읽는 staging 입력 12개만 반영 직전 변경 확인에 결속한다. staging 목록은 `loadCatalogExpansion`과 공유하며, 과거 배치·조사 디렉터리는 해시·임시 복사 대상에서 제외한다. 필수 입력의 누락·비정규 파일은 거부한다.
- dry-run은 반영용 snapshot 해시를 만들지 않는다. SQLite 경로는 이미 만든 전용 CSV projection에서 계획을 적용·검증하고, 정식 반영 직전 source·staging 입력을 다시 대조한다. 공유 쓰기 잠금, 전체 Catalog 검증, 원자적 반영과 DB readback은 유지한다.
- Library 승격은 한 호출에서 읽고 검증한 staging과 Gold Set을 재사용한다. 호출을 넘는 캐시나 검증 생략을 추가하지 않는다.
- 전체 Vitest의 기본 병렬 설정과 timeout은 유지한다. 대용량 Catalog 검사를 포함하므로 `typecheck`·`lint`를 마친 뒤 실행해 별도 검사 프로세스와의 CPU·디스크 경합을 줄인다.

## 저장 재사용과 compact 발행

- 복구의 단일 스펙은 [저장 계약 R1~R9](../../docs/catalog-expansion/03-local-authoring-storage.md#db-중심-복구-요구사항)다. `catalog_workspace.py --database <백업-SQLite> restore --destination <새-경로>`는 workspace DB와 mapping/report만 생성한다. 같은 버전의 실행 코드·전용 runtime을 준비한 뒤 기존 batch·runner·notification·metadata·canonical CLI에 요청 summary/run/Work/event/intent를 전달하면 해당 자료만 추출한다. 기존 불변 파일의 다른 bytes는 덮지 않는다. 명시적 과거 원본 export는 `restore --snapshot <revision-UUID> [--prefix <범위>] --destination <새-경로>`를 유지한다.
- 초기 latest는 source/latest 검증이 필요한 단계에 생성하고 이후 증분 백업한다. 파일 미추출은 삭제가 아니며 실제 변경·명시 삭제만 CAS를 거쳐 artifact와 같은 DB commit에 기록한다. 기본 DB 복구를 작업자 재개·canonical 반영·전체 원본 감사 완료로 보고하지 않는다. 불변 completion별 identity를 재사용하며 옛 full RUN/frozen 전체를 반복 저장하지 않는다.
- live 판정 선택은 완료 run까지 포함한 Work별 최신 유효 판정이 기준이다. 최신 판정의 완료를 확인한 뒤 그 full tree를 제외하며, 완료 run을 먼저 빼고 `(workId, status)`별로 이전 HOLD/READY를 다시 고르지 않는다. 미완료 summary·기존 pending 처리에 exact CHECKED/SHA로 결속된 과거 run은 필요한 의존으로 보존한다. 저장된 역사 blob·원본 receipt를 재작성하거나 판정을 다시 수행하지 않는다.
- 재사용 보존은 한 호출의 실제 파일 inventory를 공유한다. source와 단계 backup은 각각 필요한 읽기 transaction에서 해당 저장 단위의 membership과 고유 blob을 검증하고, 마지막에 파일 집합·실제 bytes를 다시 대조한다. 읽기 연결은 저장/backup 회전 전에 닫으며 source의 검증을 backup에 재사용하지 않는다. 포맷·참조 집합은 유지한다.
- v4 workspace 저장은 파일 읽기/SHA/압축·기존 blob 검증을 writer 밖에서 수행하고 준비된 새 blob·revision·변경 순번만 commit한다. 최초 전체 백업 뒤에는 고정 순번까지의 delta를 준비해 source 읽기를 종료하고 `latest.sqlite`의 단일 transaction에서 delta·cursor를 적용·readback한다. 실패하면 직전 백업으로 rollback한다. 변경 없는 저장은 쓰기 없이 재사용하고 정상 백업에서 전체 복사/교체를 반복하지 않는다.
- 신규 compact v2는 한 번 색인화한 baseline에서 작품별 plan을 만들고 변경 전에 `plans/<workId>.json`에 봉인한다. 원본 input/authority·대상 before SHA·plan·registry 변경·canonical rebase가 결속된다. 독립 `compact_plan.CatalogState`가 baseline과 plan으로 expected-after를 계산하고 실제 SQL 결과와 비교한다. 작품별 전체 Catalog snapshot을 반복하지 않으며 최종 전체 행 비교는 한 번 수행한다. 비대상/Gold/대표판/evidence/metadata 보존을 검사한다.
- 기존 stdout 로그의 `compactDependencyStorage`, `compactProcessed.metrics`, `readbackTimingsSeconds`로 실제 helper의 hash·blob·membership·snapshot 횟수와 구간 시간을 확인한다. 계측은 publication/receipt identity에 넣지 않으며 OS의 실제 디스크 I/O 수치가 아니다.
- 같은 `prepare`는 기존 PREPARED와 실행 입력의 bytes 및 저장 receipt를 확인하고 재사용한다. 새 파일만 저장하고 단계 경계에서 backup 포함 여부를 확인한다. `storage.snapshot`은 단일 snapshot, `storage.snapshots`는 여러 기존 snapshot 조합이며 `references`에 정확한 member SHA가 있다. 판정·동결 입력 변경은 기존대로 거부한다.
- preflight report/PASS-SUBSET identity에는 source summary SHA와 Work별 receipt SHA/status/scope만 포함한다. 호출 시간·cache hit는 실행 로그에 남기며 같은 검사 결과의 identity를 바꾸지 않는다.
- `catalog_authoring_batch_publish.py`의 기본 발행 형식은 `compact`다. `--checkpoint-every 50`이 기본이며(전체 pair 사본을 줄이려 간격을 키웠다) checkpoint는 실제 `BACKED_UP`까지 확인한다. 더 촘촘한 재개 지점이 필요하면 작은 값을 지정한다. `--publication-format full`은 기존 full 형식으로 실행한다. 동일 canonical 서지는 한 번만 반영하고 같은 행은 DML을 하지 않는다.
- 신규 형식은 `catalog-compact-publication-v2`, 작품 receipt는 `catalog-compact-work-v2`, 봉인 plan은 `catalog-compact-plan-v2`다. `verify_publication(root, audit=False)`는 원본 권한으로 plan을 재구성하고 독립 expected-after와 최종 전체 source/registry를 비교한다. `audit=True`는 원본 SQL materializer replay까지 추가한다. 구 v1/full publication과 신규 compact의 prior/review/복원 reader를 함께 유지한다. [저장·복원 계약](../../docs/catalog-expansion/03-local-authoring-storage.md)을 따른다.
- canonical의 전체 SHA가 달라도 대상·Gold·schema/설정·alias·대표판·prior·정책의 의미가 같으면 `canonical-rebase-v1` receipt로 원래 frozen SHA와 현재 기준을 결속해 판정을 재사용한다. 관련 의존 충돌은 거부하며 과거 manifest·판정을 새 SHA로 재작성하지 않는다.
- 정책 문서의 추가 운영 규칙은 `policy_compatibility.py`의 검토된 원문·삽입 문맥과 일치할 때만 별도 `catalog-policy-compatibility-v1` receipt로 결속한다. frozen/current SHA·공통 정책 SHA·해당 추가 조항을 보존하고 나머지 본문 변경이나 기존 조항 제거는 거부한다. 이 호환 증명은 과거 입력에 N/T 예외·수집 handoff 권한을 추가하지 않으며 실제 발행은 동결된 기록과 정책을 계속 검증한다.
- publisher 독점 `publication-owner.lock`과 실제 공유 반영 `publication.lock`을 분리한다. private 준비·검사·빌드·백업은 commit 락 밖에서 수행하고 반영 직전에 현재 STATE/canonical/registry 기준을 다시 확인한다. metadata import·대표판 정정·retention도 같은 shared lock을 사용한다. 잠금 경합만 제한 시간 안에서 재시도한다.
- canonical 교체는 검증된 intent와 복구 자료를 보존한다. `locks/publication.pending.json`이 있으면 해당 준비본을 `--commit-prepared`로 복구하기 전 다른 공유 쓰기를 거부한다. DB·정적 데이터의 authoritative readback 뒤 CLI의 APPLIED/PASS가 나오며, 호출자의 실제 저장/백업 뒤에만 `BACKED_UP`을 보고한다. candidate 빌드 산출물을 canonical 빌드 산출물로 대신하지 않는다.

## 수집 완료 자동 전환

새 일반 수집 dispatch는 `phase="collection"`, `transitionPolicy="auto-after-collection"`, `adjudicationAllowed=false`, `publicationAllowed=false`를 명시한다. 명시적 `collection-only`와 정책이 없는 기존 배정의 기본값은 `parent`이며 자동 전환하지 않는다.

수집 전건 완료·검증·백업·통지 후 새 판정 dispatch를 같은 run 아래에 작성한다. `phase="adjudication-only"`, 기존 batchId/owner/parent, `adjudicationAllowed=true`, `publicationAllowed=false`, `collectionSummary={path,sha256}`를 사용한다. `works`에는 ERROR 외의 정확한 Work/researchPath/researchSha256을 넣고 원 ERROR 행은 `collectionErrors`에 그대로 보존한다. 다음 명령은 현재 collection summary의 불변 이벤트와 실제 성공 응답을 담은 `transport.json` ACK를 확인하고, session lock 아래 실제 원문/backup 검증과 turn·generation·중단 CAS를 통과한 경우에만 같은 턴의 arm을 유지해 전환한다. `enqueue`만으로는 전환하지 않으며 부모의 drain·consume·발행은 기다리지 않는다.

```powershell
python scripts/catalog_python.py scripts/catalog_authoring/notification_guard.py transition-collection --session <ID> --generation <현재 등록 generation> --turn <현재 executionTurnId> --dispatch <같은-run/ADJUDICATION-DISPATCH.json> --artifact <같은-run/ADJUDICATION-SUMMARY.json>
```

공통 ERROR·전건 ERROR 또는 사용자 중단/Interrupt는 자동 전환을 막는다. 개별 collection ERROR는 `errorScope="work"|"shared"`, `error`, `retryCondition`, `errorPath`, `errorSha256`과 실제 실패 artifact의 `failureEvidence=[{path,sha256}]`를 요구한다. 시스템 오류를 INSUFFICIENT나 조사 소진으로 바꾸지 않는다.

구 phase/summary 등록의 정정은 `reconcile-registration --session <ID> --expected-sha <원 등록 SHA> [--summary <새 검증 가능 summary>]`를 사용한다. 기존 등록 전체와 SHA를 별도 revision에 보존하고 실제 근거·백업을 검증한 뒤 새 등록을 만든다. 부족한 필드는 합성하지 않는다. 새 등록은 arm되지 않으며 명시 실행 턴에서 `arm`이 필요하다. 중단 상태는 보존한다.

판정 완료 summary의 `sourceSummary`는 이전 판정 summary의 **동일한 결과 행**만 추린 경우에 사용한다. 수집 summary는 판정 dispatch의 `collectionSummary`에 결속하며 완료 판정 summary의 `sourceSummary`로 쓰지 않는다. 완료 등록 검사는 source 체인의 SHA와 원 행을 확인해 잘못된 결속을 발행 단계 전에 거부한다. 결과 행이 바뀐 완료분은 새 full 판정 summary로 등록하고 원본을 보존한다.

## 입력 결속과 통지

- 신규 v4 job의 빈 `sourceBindings`는 job 자체의 SHA-bound `researchRefs`에서도 조립한다. 비어 있지 않은 명시 선택은 보존하고, `--research`로 명시 추가한 자료만 추가 결속한다. source 채택 용도는 독립 판정의 `sourceDecisions.uses`가 정한다. 동결 전 원본/보충 evidence ID 중복과 정확한 registry support URL의 같은 Work 연결 누락은 `INPUT_NEEDS_REPAIR`로 보고한다. URL alias를 추정하거나 원문 접근 제한만으로 HOLD를 만들지 않는다.
- collector draft의 선택 `narrativeToneExhaustion`은 실제 조사자의 기존 예외 기록이다. `isbn13`과 같은 Work를 검증한 뒤 별도 `COLLECTION-HANDOFF.json` (`factor-collection-handoff-v1`)에 `researchSha256`과 함께 저장한다. collector v1 research schema는 그대로다. collector의 완료 receipt/`collection-events.jsonl`에 예상 `handoffSha256`을 남기므로 첫 조립 전에 sidecar가 삭제·변경돼도 복구 대상으로 검출한다. 조립된 research ref의 선택 `handoffSha256`·`collectionReceiptSha256`과 frozen `sourceInputBindings`/provenance가 원본을 결속한다. 과거 sidecar 없는 수집분도 지원한다. 명시 job과 서로 다른 기록은 거부한다. 부분 sidecar가 남으면 원본을 보존하고 새 collection revision을 쓴다. 소진·시도·unknown 값은 생성하지 않는다. 언어 `zh`를 명시 지원한다.
- 동일 CHECKED의 input/result/decision/RUN과 receipt는 실제 bytes 결속으로 재사용한다. revision store의 내부 check는 PERSISTED이며 경계 백업에서 source/latest를 확인한다. 구 `catalog-check-storage-v2`의 snapshot/backup 참조는 원래 세대의 결속으로 검증한다. 중단된 receipt 저장은 누락분만 보존하고 단계 백업을 마치며 판정·전체 실행을 반복하지 않는다.
- preflight receipt v2는 실제 Python 코드, 외부 경로·저장 helper, 계약, Gold manifest, SQL, Python/SQLite 버전과 정확한 명령·입력·현재 pair를 결속한다. 같은 key 생성은 OS lock으로 직렬화한다. `--preflight-attempt <새 시도 ID>`는 환경 오류를 재검사하며 과거 BLOCKED는 보존한다. `--preflight-retry <workId>=<새 시도 ID>`는 그 작품만 재검사한다. `timingsSeconds`는 이번 호출의 lock/validation/lookup/subprocess/total 시간이며 cache hit의 subprocess 시간은 0이다. 과거 실행 비용은 `originalCheckSeconds`와 `originalExecutionSeconds`로 분리한다. 이전 receipt에 subprocess 측정값이 없으면 후자는 null이다. workspace backup은 header/membership, blob copy/readback, 새 membership, commit/readback, rotation 시간을 구분한다. 캐시 hit에도 frozen 입력 검증을 수행하며 발행 직전 현재 상태 검사와 최종 readback은 생략하지 않는다. 기존 process 범위 manifest cache를 영구 캐시로 확대하지 않는다.

통지 절차:

새 `auto-after-collection` 배정과 그 판정 전환은 `expectedPublicationEffect="canonical"`을 통지 identity에 결속한다. 직접 만드는 새 판정 dispatch도 이 필드를 명시한다. 이 배정의 `published` 처리는 candidate 완료와 동일 receipt에 결속된 정식 반영의 source/latest 완료 proof를 모두 요구한다. 기존 정책 누락 배정은 종전 candidate 완료 의미를 유지하며 정식 반영 완료로 바꿔 해석하지 않는다.

1. 기존 `register-batch`로 배정을 등록한다. Catalog를 실행하는 턴에서만 `notification_guard.py arm --session <ID>`를 호출한다. UserPromptSubmit은 턴 ID만 저장하며 프롬프트 본문은 보존하지 않는다. 새 프롬프트는 이전 arm을 해제한다. 회고·보고 전용 턴은 arm하지 않는다. 사용자 중단/Interrupt 후 재실행은 명시 승인된 새 턴의 `arm --resume`만 허용한다. 중단 턴 ID와 배정 generation을 보존하여 같은 턴의 `--resume`과 오래된 Interrupt를 거부한다. 기존 active 등록은 자동 활성화하지 않는다.
2. 결과·backup을 확인한 다음 `enqueue --session <ID>`를 실행한다. 이 단계에서 전체 결과 검증을 묶어 수행하고 `validation.json` 및 `runRoot/notification-events/<eventId>/`의 원본 checkpoint·불변 event를 저장한다. 이후 ACK/drain/consume는 불변 결속을 확인하고 실제 발행 효과에는 별도 readback을 유지한다. ID는 owner/parent/배정 digest/phase/generation/checkpoint SHA/kind에 결속된다. `notifications/inbox/<parent>/<eventId>.json`은 작은 인덱스다. 등록한 runRoot/generation을 `notifications/roots/<parent>/`에 보존하고 drain·새 배정 전에 해당 event 디렉터리만 대조해 유실된 인덱스를 복구한다. Catalog 전체를 검색하지 않는다. 다음 정상 배치 저장·백업에 event 디렉터리·이 인덱스·roots 등록을 함께 포함한다. 강제 종료 전 저장되지 않은 결과나 idle 부모의 즉시 처리를 보장하지 않는다.
3. 전송 성공 뒤 `ack --session <ID> --sha <checkpoint SHA> --event <eventId>`의 stdin으로 실제 도구 응답 JSON을 전달한다. 부분/사용자 중단도 event ID로 ACK하며 정지 상태는 유지한다. 기존 완료 통지는 event 생략도 지원한다. `transport.json`은 전송 기록이며 소비 완료를 뜻하지 않는다. Stop은 arm된 현재 턴의 새 완료 checkpoint만 한 번 상기하며 전송/소비된 checkpoint를 반복하지 않는다. 결과가 없는 턴을 강제 계속하거나 보고하도록 막지 않는다.
4. 부분 보고는 `enqueue --session <ID> --checkpoint <JSON> --kind partial-stop`이다. JSON은 `batchId`, `ownerThreadId`, `parentThreadId`, guard의 `phase` (`batch` 또는 `collection-batch`), `processedCount`, `nextWorkId` (없으면 null), `exactReason`, `needsResume`를 실제 checkpoint에서 작성한다. 사용자 중단은 `--kind user-stop`, `needsResume=false`이며 등록도 중지한다. 부분 이벤트는 발행 권한이 아니다.
5. 부모의 다음 active turn에서 `drain --parent <ID>`로 검증된 미소비 이벤트를 읽는다. 처리 후 ACK 전 중단에 대비해 `handlingRecorded`와 실제 발행 summary SHA를 키로 한 `STATE.publicationBatches`를 먼저 대조한다. 기존 발행은 원래 batch root의 완료·백업 복구 경로를 사용하고 재발행하지 않는다.
6. 부모는 아래 형식으로 실제 처리/인계 결정을 저장하고 `consume --parent <ID> --event <eventId> --effect <JSON>`을 실행한다. `handling.json`을 먼저 내구성 있게 기록하고 `consumed.json`에 그 SHA를 남긴다. 같은 결정 재전달은 멱등이다. `published`/`partially-published`는 `publications: [{summaryPath, summarySha256}]`로 실제 발행 subset들을 결속한다(생략 시 원 summary). `sourceSummary` 체인의 SHA·정확한 원 행, STATE 원장, `BATCH-FINISHED`의 실제 적용 Work 집합, `verify_completed`의 완료/readback/backup을 확인한다. `partially-published`는 처리 이력을 남기되 consumed로 닫지 않고 남은 READY를 drain에 표시한다. 이후 처리 이력은 적용 Work 집합이 증가할 때만 갱신할 수 있고, 전부 처리되면 `published`로 닫는다. 나머지 결정은 덮어쓰지 않는다. 다른 결정은 단계 전환이나 발행을 수행하지 않는다. 처리 영수증도 다음 정상 저장에 포함한다.

다음 예약 배정의 `register-batch`도 이전 배치의 현재 summary SHA에 결속된 완료 이벤트와 실제 전송 ACK를 요구한다. `notifiedSha256` 플래그만으로 진행하지 않는다. ACK가 `transport.json` 저장 뒤 등록 플래그 갱신 전에 중단돼도 해당 전송 기록으로 전환·다음 배정과 Stop 중복 알림 방지를 복구한다. 이전 부모 이벤트는 미소비 상태로 유지할 수 있으며 부모의 실제 발행을 다음 수집의 조건으로 삼지 않는다.

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

현재 compact 실행 계약은 private pair·기본 50작품 백업 checkpoint·작품별 봉인 plan/논리 delta·최종 projection/readback을 사용한다. 작품별 실제 판정과 수집→판정 전환 경계는 유지한다. [과거 실행 기록](../../docs/catalog-expansion/07-pipeline-improvements-20260925.md)은 그 시점의 표본 범위로만 해석하며 신규 v4 저장·v2 발행·자동 전환의 실행 완료 증거로 쓰지 않는다.

## Publisher 책임 경계

기존 `publish_batch`/legacy `publish`의 CLI·결과 파일·manifest 형식은 유지한다. legacy publisher 내부를 `verify_immutable` → `plan_against_current` → `apply_plan_in_transaction` → `verify_expected_after` → `finalize_projection`으로 분리했다. `_apply_plan`은 기존 경로 인자를 받는 wrapper로 남으며, BEGIN IMMEDIATE부터 공통·context·정정·복구 반영과 예상 결과 검사까지 한 connection에서 처리한 뒤 commit한다. 각 materializer는 connection/commit을 생성하지 않는다. 호출자가 직접 connection을 공급할 경우 transaction과 rollback도 호출자 소유다.

정정/복구 후반 실패는 앞선 공통 변경까지 되돌릴 수 있다. 입력·기존 DB 행·Gold·unknown·대표판 검증은 그대로 유지한다. 트랜잭션 수 변화로 SQLite header의 change counter와 이에 결속된 SHA가 달라질 수 있으므로 출력 DB의 물리 SHA 동일성을 약속하지 않는다. 기존 full publication의 외부 형식을 유지한다. 현재 compact 경로는 catalog/registry pair transaction과 작품별 expected-after를 사용하며 full 형식을 흉내 낸 중간 디렉터리를 만들지 않는다.
