# Offline Catalog authoring

현재 명령·receipt 계약 · 갱신일: 2026-10-01

실행 코드와 필요한 기존 발행 backend를 이 디렉터리에서 추적한다. 원문·동결 입력·판정·후보·작업 DB는 Git에 포함하지 않는다.

[저장 계약](../../docs/catalog-expansion/03-local-authoring-storage.md#현재-보존-정책)에 따라 내부 `prepare`/`check`/`save`는 `PERSISTED`, 명시적 수집·판정·발행/종료·중단 경계는 실제 `BACKED_UP`으로 구분한다. 명시적 `catalog_workspace.py backup`으로 단계 백업을 수행한다. `run --phase-boundary`는 독립 실행 하나가 발행/인계 경계인 경우에만 사용한다. 현재 기준점은 `CURATION-BASELINE.json`과 generation/revision receipt다.

receipt의 `snapshot`·`snapshots`·`snapshotId`는 기존 인터페이스 필드명이다. v3/v4에서는 실제 generation과 revision UUID를 확인하며 구 숫자 snapshot은 명시적 legacy pin에만 사용한다. 필드명만 보고 새 ID를 만들거나 구 세대를 revision schema로 해석하지 않는다.

Catalog Python 명령은 `python scripts/catalog_python.py <script> <args>`로 실행한다(Linux/WSL은 `python3`). 최초 `python scripts/setup_catalog_runtime.py`가 공식 archive checksum과 실제 부모·자식 로드 버전을 검증한 SQLite 3.53.4 runtime을 설치한다. Windows는 Python 3.13.15 bundle, Linux는 호스트 Python 3.12+와 gcc로 준비하는 전용 venv/shared library다. 시스템 Python은 변경하지 않으며 내부 Python helper도 같은 runtime을 사용한다. v4 workspace만 WAL과 `synchronous=FULL`을 사용하고 catalog/registry attached pair는 DELETE를 유지한다. runtime 설치와 운영 DB 전환은 별개다. writer 중지·기존 백업·generation 보존·새 백업/readback을 포함하는 명시 전환은 `catalog_retention.py upgrade-v4 --enable-wal`이며 중단된 동일 전환만 `--resume`으로 재개한다.

## 역할별 진입점

- 조정자의 단일 작품 검사·발행 진입점: `python scripts/catalog_python.py scripts/catalog_authoring_runner.py run --run-root <영구 planning 경로> --job <job.json> --decisions <판정.json>`
  - 여러 작품의 봉인된 READY가 모이면 조정자는 `python scripts/catalog_python.py scripts/catalog_authoring_batch_publish.py --batch-summary <BATCH-SUMMARY.json> --batch-root <새 planning 디렉터리>`를 사용한다. 기본 compact 경로는 작품별 동결 입력·판정·현재 상태를 검사하며 private pair에 직렬 적용하고 최종 제품 빌드·추천 readback을 한 번 수행한다. 별도 publisher 사전검사 루프는 `--preflight-only` 또는 과거 `--publication-format full` 경로에서만 실행한다. 오류가 섞인 완료 묶음은 먼저 `--preflight-only`로 검사한다. 결과는 입력·결과·코드·candidate/registry·canonical SHA에 결속되고 같은 조합만 재사용한다. 알려진 Work별 prior/registry 충돌만 격리한 `PASS-SUBSET.json`을 원 summary SHA와 함께 저장하며, 공통·미분류 오류가 있으면 subset을 만들지 않는다. subset을 별도 batch root로 발행해 정상 작품의 동반 대기를 해소한다.
  - `BATCH-FINISHED.json`은 readback 완료 기록이다. 발행·readback 백업, STATE 반영·백업, `BATCH-COMPLETED.json`의 저장·백업까지 완료해야 최종 성공이다. 마지막 작은 영수증만 별도 저장하고 이미 보존한 배치 원본과 membership은 재사용한다. STATE 쓰기 실패는 같은 명령으로 재개하며 이미 발행한 결과를 재판정·재발행하지 않는다. `STATE.publicationBatches`가 같은 summary의 적용 사실을 보존해 후속 current 이후에도 중복 적용을 막는다. 옛 receipt의 적용 계보가 불명확하면 자동 재발행하지 않는다.
  - 승인한 완료 배치의 정식 반영에는 같은 명령에 `--apply-canonical`을 추가한다. candidate 완료와 canonical 완료는 별도이며 preflight에는 이 옵션을 사용하지 않는다. 대상 Work와 필요한 evidence/review만 최신 canonical에 병합하고 metadata·비대상·Gold를 보존해 정식 DB에서 생성 데이터를 다시 빌드한다. `CANONICAL-COMPLETED.json`과 `canonical-completion` revision은 candidate receipt SHA·summary SHA·실제 source/생성 파일 readback·백업에 결속한다. 같은 옵션으로 재개하면 후보를 재발행하지 않고 남은 정식 반영/백업을 이어간다. GitHub 쓰기·배포는 수행하지 않는다.
  - 수정 research의 원문 의존관계는 기존 `--provenance-root <원 collection> --provenance-root <revision collection>`을 사용한다. job은 수정 research를 참조해도 원 collection의 raw/receipt를 별도로 동결할 수 있다. binder가 같은 Work와 SHA를 검증한다. 같은 URL의 상충하는 과거 관찰을 `--research`로 무조건 병합하거나 상위 배치 폴더를 통째로 복사하지 않는다.
  - READY summary의 `checkedPath`·`checkedSha256`로 CHECKED 전체를 검증한 뒤 그 안의 판정·입력 SHA를 사용한다. summary에 동일 SHA를 중복 기재하는 것은 선택이며 기재된 값이 다르면 거부한다. 실제 `checkStorage`(snapshot/backup)를 전달한다. 중복 필드만 빠졌다는 이유로 모델에게 요약을 다시 작성시키지 않는다.
  - 대표 ISBN·권수는 맞지만 `editionKind`가 틀린 경우 조정자는 `python scripts/catalog_python.py scripts/catalog_authoring/repair_representative_editions.py --request <SHA 확인된 REQUEST.json> --output-root <새 planning/publication>`로 Catalog·registry를 함께 복사 정정한다. 공식 출판사 캡처의 정확한 ISBN·한정판 표기를 확인하고 새 volume evidence를 추가하며 기존 근거·ISBN·권수는 보존한다. 제품 readback과 발행물 백업 후에만 STATE를 옮긴다. 정정 전 frozen 입력은 수정하지 않고 새 판정 revision을 만든다.
- 위 명령은 **검사 후 발행**하며 조정자만 실행한다. 작업자는 `prepare --run-root <작품 run> --work-id <ID> --research <research.jsonl>`로 동결하고 `session-input/PROMPT.md`·`schema.json`과 동결 원문을 읽어 해당 작품의 실제 판정을 작성한다.
- 새 run은 `researchRefs`의 direct collection을 자동 결속한다. `collection-session.json`의 Work, research SHA, capture/web-response receipt의 원문 SHA·길이를 검증한 파일만 동결한다. 추가 collection은 `--provenance-root <완성 collection>`을 반복 지정할 수 있다. 폴더 전체나 다른 작품 자료를 자동 복사하지 않으며, collection별 경로를 분리해 같은 파일명·상대 rawPath를 보존한다. `MODEL-INPUT.json.inputAccess`와 source별 `rawAccess`/`rawLookupPaths`를 확인한다. observations-only는 원문 접근 한계이며 자동 HOLD가 아니다.
- `NEEDS_PROVENANCE_BINDING`은 준비 단계 오류다. 세션 없는 raw 묶음이나 다른 Work의 collection을 내용 근거 부족 HOLD로 바꾸지 않는다. 세션 없는 기존 자료는 작업자가 해당 작품 자료임을 확인하고 기존 `--provenance-root`로 명시 결속할 수 있다. 이 경우 `explicit-legacy`로 기록하고 모든 파일 SHA·중첩 receipt·링크 경로를 검사하되, 파일 포함 자체를 동일 작품의 근거 인증으로 표시하지 않는다. 상위 폴더(parent)를 자동 복사하지 않는다. 원본을 보존하고 올바른 결속으로 새 run을 만든다. 기존 RUN의 provenance·registry·recovery 인자 변경은 거부하며 기존 PREPARED 프롬프트와 frozen 입력을 재작성하지 않는다.
- `check --run-root <같은 run> --decisions <판정.json>`은 기존 seal/HOLD 검사를 공유하며 `CHECKED.json`·`CHECK-STORAGE.json`을 저장한다. READY_FOR_PUBLICATION/HOLD는 비발행 상태이고 공유 STATE·canonical을 변경하지 않는다. 새 원문은 새 run revision으로 동결한다.
- 기존 accepted prior를 보존하는 명시적 `--job`은 원본 권한 publication bundle을 `--prior-bundle <원본 디렉터리>`로 함께 전달한다(복수 지정 가능). RUN의 `priorBundleBindings`가 경로·manifest SHA를 결속하고 동결·저장·백업에 포함한다. 다른 bundle을 기존 run에 추가하거나 교체하지 말고 새 run을 만든다. `--recovery-epoch`로 accepted prior를 비워 이 경로를 대체하지 않는다. AMP 보호 경계는 유지한다.
- 기본 실행은 제공되거나 RUN에 저장된 판정만 사용한다. 판정 누락 시 모델을 자동 호출하지 않는다. 특정 모델·고정 세션은 요구하지 않는다([배치 계약 §3](../../docs/catalog-expansion/01c-catalog-batch-promotion-plan.md#3-역할과-실행-추적)). `--allow-model`·`--model-session`·`--retry-model`은 별도 모델 호출 경로이며 지정 해제만으로 자동 활성화하지 않는다.
- 같은 실행자가 수집·판정·발행 책임을 단계별로 맡거나 독립 작업을 서브에이전트에 담당 범위·출력 경로·반환 근거로 나눠 배정한다. 실제 담당·batch/Work·입력/판정 SHA·중단 사유를 보존하며 기존 owner/parent·세션 자료는 이력으로 유지한다.
- 사전 리드 JSON과 자료 적격성: [정식 리드 규격](../../docs/catalog-expansion/user-source-leads.md). 실제 취득·관찰·원문 저장: [수집 지침](../../docs/catalog-expansion/factor-collector-instructions.md).
- 새 freeze의 `--provenance-root`는 현재 job의 Work 범위로 해석한다. 정식 `.workspace/user-sources/` 루트는 해당 `<workId>.json`의 형식·Work를 검증해 결속하고 다른 작품 파일을 복사하지 않는다. Work collection은 research·raw receipt와 명시된 보충 파일을 검증한다. session 없는 임의 디렉터리는 전체 복사나 무시 대신 `NEEDS_PROVENANCE_BINDING`으로 거부한다. 그 안에서 쓸 파일은 `node scripts/catalog_authoring/collect_factor_evidence.mjs start <assigned-dir> <workId> --input <파일1> --input <파일2>`로 해당 Work collection에 먼저 결속하고 기존 `write`·`prepare --provenance-root <collection>` 순서를 사용한다. 이 입력은 파일 바이트 보존과 모델 접근을 결속하며 원문 독해·HTTP 응답·의미 채택을 합성하지 않는다.
- 수집: `node scripts/catalog_authoring/collect_factor_evidence.mjs`
- 독립 준비/발행: `python scripts/catalog_python.py scripts/catalog_authoring/prepare_factor_batch.py --help`
- 영구 자료: `data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902/`
- 저장 DB와 백업: `data/local/catalog-authoring/workspace.sqlite`, `backups/`
- 임시 출력: `.workspace/`. 호환 링크·심링크는 생성하지 않는다.

수집 배정 전 `python scripts/catalog_python.py scripts/catalog_authoring/plan_dispatch.py --dispatch <기존 COLLECTION-DISPATCH.json> --output <새 PLAN.json>`을 실행한다. 현재 candidate/registry·Gold·계약·소유권 SHA에 묶어 eligible/protected/prior-recovery/registry-repair/fresh를 구분하며 복합 문제를 유지한다. registry의 정확한 `supportEvidenceUrls`가 빈 Work는 `registry-repair`로 표시해 일반 fresh 판정 배정에서 제외한다. 판정 배정과 유효한 완료 요약은 `--batch-summary`로 검증해 READY 재사용을 식별한다. 자료 충분성·의미 판정은 하지 않고 기존 배정도 수정하지 않는다. 기준 SHA가 바뀌면 새 계획을 만든다.

검사 범위와 실행 시점은 AGENTS.md의 현재 작업 계약을 따른다. 연속 승격의 중간 검사 예외를 일반 유지보수에 확대하지 않는다.

과거 동결본의 경로 문자열은 변경하지 않는다. `workspace_paths.artifact_path()`는 읽기 경계에서 해당 자료의 현재 위치를 찾으며, 원래 manifest·SHA 검증은 유지한다. `legacy/`는 현재 발행 경로가 사용하는 기존 backend이며 검증 우회 경로가 아니다.

회귀 검사:

```powershell
python scripts/catalog_python.py -m unittest discover -s scripts -p test_catalog_authoring_runner.py
python scripts/catalog_python.py -m unittest discover -s scripts -p test_catalog_workspace.py
python scripts/catalog_python.py -m unittest discover -s scripts/catalog_authoring -p test_factor_single_pass_artifacts.py
```

실제 보존 artifact 검사는 로컬 원본이 필요하다. 원본이 없는 checkout의 skip이나 mock 모델 검사는 실제 판정·승격의 증거가 아니다. Node 24를 사용한다. 일반 판정은 현재 배정의 작업자가 수행하며 CLI 모델 로그인은 해당 모델 호출 경로를 사용할 때만 필요하다.

## 재개 옵션과 N/T 예외

- 새 RUN은 명시 `--provenance-root`만 `requestedProvenanceRoots`에 저장한다. 자동 발견을 합친 `provenanceRoots`/`provenanceBindings`는 실제 바이트 결속에 사용한다. 같은 명시 옵션으로 재개할 수 있고 변경된 명시 옵션은 거부한다. 옵션 생략은 기존 동결 입력 재사용이다. 구 RUN은 원래 명시 옵션을 복원할 수 없으므로 기존 엄격 비교를 유지한다. 혼합 구 RUN은 provenance 옵션을 생략해 재개하며 새 동결을 만들 필요가 없다.
- N/T 예외는 새 v4 job의 선택 `narrativeToneExhaustion`을 사용한다. [정확한 필드와 계약](../../docs/catalog-expansion/02-authorized-evidence-panel-v1.md)을 따르고 기존 `prepare --job` → 별도 실제 판정 → `check` → 조정자의 `run --decisions`/발행 → 제품 readback 순서를 유지한다. 별도 승격 명령이나 일회성 모델 호출을 추가하지 않는다.
- 역사적 legacy validator/직접 CLI의 기본 최소치는 그대로다. 현재 single-pass 경로의 검증된 adapter만 결속된 예외를 전달한다. 판정 자료·발행 evidence·compiled eligibility를 함께 검사한다.

## 기존 추천 Work의 scope 정정

기존 일본 만화 scope에서 제외되는 일본 원작이 아닌 작품을 잘못 추천한 경우, 기존 single-pass 진입점의 선택 `scopeCorrection`을 사용한다. scope 기준을 바꾸거나 새 추천 PASS를 만드는 절차가 아니다. [AEP §6](../../docs/catalog-expansion/02-authorized-evidence-panel-v1.md#6-완료와-승격)의 입력·보존 계약을 따른다.

- 기존 AEP 추천 Work 하나를 새 `factor-authoring-job-v4` revision으로 분리하고 해당 work에 `scopeCorrection={"action":"EXCLUDE_NON_JAPANESE_ORIGINAL"}`을 넣는다. 승인된 `priorClaims` 전부와 원 prior 권한을 결속하고 `priorDecisions=[]`를 유지한다. N/T 예외를 함께 요청하지 않는다. Gold·human·legacy 권한은 이 경로의 수정 대상이 아니다.
- `prepare --job`에 기존 `--prior-bundle`과 정확한 Work의 `--provenance-root`를 전달한다. 현재 catalog/registry SHA와 Work·대표 ISBN·전체 Work 소유 행의 `beforeSnapshotSha256`을 `scope-correction-request.json` 및 입력 manifest에 동결한다. 같은 run의 동결 입력·prior·job 바이트를 바꾸지 않는다.
- 현재 판정자가 실제 frozen 원문을 읽어 `factor-adjudication-v3`의 `disposition=scopeCorrection`, `sourceDecisions.uses=["scope"]`, `scope.outcome=OUT_OF_SCOPE`, `reasonCode=NON_JAPANESE_ORIGINAL`과 정확한 evidence IDs·관찰·범위·한계를 작성한다. 원작/번역판 근거가 부족하면 구체적 gap·retryCondition이 있는 `disposition=hold`로 남긴다. 국적만으로 원작 scope를 추정하거나 팩터·safety·context 값을 재판정하지 않는다.

```powershell
python scripts/catalog_python.py scripts/catalog_authoring_runner.py prepare --run-root <새-scope-run> --job <scope-job.json> --prior-bundle <봉인된-prior-권한> --provenance-root <같은-Work의-collection>
python scripts/catalog_python.py scripts/catalog_authoring_runner.py check --run-root <같은-scope-run> --decisions <실제-scope-decisions.json>
python scripts/catalog_python.py scripts/catalog_authoring_runner.py summarize --run-root <배치-root> --dispatch <해당-run에-결속된-배치목록.json>
```

- 성공한 비발행 검사는 `READY_FOR_PUBLICATION`과 봉인된 `scope-corrections.json`을 만들지만 `panelOutcome=SCOPE_CORRECTION`, `scopeCorrectionCount=1`, `passCount=0`이다. 실패 로그·`FAILURE.json`·`CHECKED.status=ERROR`를 근거 부족 HOLD나 완료로 바꾸지 않는다. 실패 사본을 보존하고 동일 frozen에 대한 새 검사 시도만 기존 재개 규칙으로 실행한다. 근거·job·prior·before snapshot이 바뀌면 새 run/input revision을 사용하며 사용자 중단을 자동 해제하지 않는다.
- 조정자는 기존 완료 summary의 publisher를 직렬 실행하고 정식 반영에는 같은 `--apply-canonical`을 사용한다. `onboardingEligible=false`, `recommendationEligible=false`, `libraryOnly=true`만 바꾸고 manifest-bound scope audit evidence/review를 추가한다. 원 claims·팩터·metadata·ISBN·추천 context 원행·이력·기존 리뷰를 유지하며 Library에는 작품이 남고 추천 profile/context/plan에서는 제외된다. current before와 봉인 SHA를 다시 대조하고 canonical readback·저장/백업 receipt까지 확인한다. 문서 갱신·READY·candidate 완료를 실제 canonical 반영이나 `BACKED_UP`으로 보고하지 않는다.

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

## 수집 완료 후 판정 전환

수집 전건의 실제 결과·원문 결속·summary SHA·저장/백업을 확인한 뒤 승인된 판정 단계로 진행한다. 수집 전용 요청은 여기서 종료한다. 기존 배정의 중단·소유권·원 summary는 보존한다.

기존 dispatch를 쓰는 경우 판정 단계에는 원 수집 summary path/SHA를 `collectionSummary`로 결속하고 개별 ERROR를 `collectionErrors`로 보존한다. 공통 ERROR·전건 ERROR·사용자 중단은 의존 작업을 막는다. 실제 실패 artifact와 재개 조건을 남기고 시스템 오류를 INSUFFICIENT나 출처 소진으로 바꾸지 않는다.

판정 완료 summary의 `sourceSummary`는 이전 판정 summary의 동일한 결과 행을 추린 경우에만 사용한다. 수집 summary를 여기에 넣지 않으며 결과가 달라졌으면 새 full 판정 summary를 만든다. 발행 도구가 원본 SHA·CHECKED·실제 결과를 검증한다.

## 입력 결속과 완료 기록

- 신규 v4 job의 빈 `sourceBindings`는 job 자체의 SHA-bound `researchRefs`에서도 조립한다. 비어 있지 않은 명시 선택은 보존하고, `--research`로 명시 추가한 자료만 추가 결속한다. source 채택 용도는 독립 판정의 `sourceDecisions.uses`가 정한다. 동결 전 원본/보충 evidence ID 중복과 정확한 registry support URL의 같은 Work 연결 누락은 `INPUT_NEEDS_REPAIR`로 보고한다. URL alias를 추정하거나 원문 접근 제한만으로 HOLD를 만들지 않는다.
- collector draft의 선택 `narrativeToneExhaustion`은 실제 조사자의 기존 예외 기록이다. `isbn13`과 같은 Work를 검증한 뒤 별도 `COLLECTION-HANDOFF.json` (`factor-collection-handoff-v1`)에 `researchSha256`과 함께 저장한다. collector v1 research schema는 그대로다. collector의 완료 receipt/`collection-events.jsonl`에 예상 `handoffSha256`을 남기므로 첫 조립 전에 sidecar가 삭제·변경돼도 복구 대상으로 검출한다. 조립된 research ref의 선택 `handoffSha256`·`collectionReceiptSha256`과 frozen `sourceInputBindings`/provenance가 원본을 결속한다. 과거 sidecar 없는 수집분도 지원한다. 명시 job과 서로 다른 기록은 거부한다. 부분 sidecar가 남으면 원본을 보존하고 새 collection revision을 쓴다. 소진·시도·unknown 값은 생성하지 않는다. 언어 `zh`를 명시 지원한다.
- 동일 CHECKED의 input/result/decision/RUN과 receipt는 실제 bytes 결속으로 재사용한다. revision store의 내부 check는 PERSISTED이며 경계 백업에서 source/latest를 확인한다. 구 `catalog-check-storage-v2`의 snapshot/backup 참조는 원래 세대의 결속으로 검증한다. 중단된 receipt 저장은 누락분만 보존하고 단계 백업을 마치며 판정·전체 실행을 반복하지 않는다.
- preflight receipt v2는 실제 Python 코드, 외부 경로·저장 helper, 계약, Gold manifest, SQL, Python/SQLite 버전과 정확한 명령·입력·현재 pair를 결속한다. 같은 key 생성은 OS lock으로 직렬화한다. `--preflight-attempt <새 시도 ID>`는 환경 오류를 재검사하며 과거 BLOCKED는 보존한다. `--preflight-retry <workId>=<새 시도 ID>`는 그 작품만 재검사한다. `timingsSeconds`는 이번 호출의 lock/validation/lookup/subprocess/total 시간이며 cache hit의 subprocess 시간은 0이다. 과거 실행 비용은 `originalCheckSeconds`와 `originalExecutionSeconds`로 분리한다. 이전 receipt에 subprocess 측정값이 없으면 후자는 null이다. workspace backup은 header/membership, blob copy/readback, 새 membership, commit/readback, rotation 시간을 구분한다. 캐시 hit에도 frozen 입력 검증을 수행하며 발행 직전 현재 상태 검사와 최종 readback은 생략하지 않는다. 기존 process 범위 manifest cache를 영구 캐시로 확대하지 않는다.
- `batchPublicationTimingsSeconds`는 기존 발행 호출의 summary/CHECKED 확인, 현재 pair/preflight, compact 의존 자료·적용, 제품 readback, 후보 artifact 저장, 큐레이션 기준점 갱신, STATE commit, 후보 completion, canonical 효과, 임시 사본 종료 시간을 비중복 구간으로 출력한다. 재개/완료 재사용은 후보 완료 구간을 합쳐 기록하며 `executionMode`로 신규 처리와 구분한다. 실패 구간과 예외 유형도 남긴다. `compactDependencyStorage`·작품별 metrics·백업 시간은 이 상위 시간에 포함되며 별도로 더하지 않는다. `batchPublicationSetupTimingsSeconds`는 그 밖의 attempt 선정·pending guard 시간이다. 시간 로그는 원 summary·동결·판정·completion receipt를 수정하지 않는다.

## 구형 통지 경로의 구현 상태

`.codex/hooks.json`의 Catalog `UserPromptSubmit`·`Interrupt`·`Stop` 등록은 비활성화했다. 과거 event·transport·중단·generation 자료와 호환 코드는 보존한다. 같은 파일의 검증 함수가 필요한 기존 소비자는 통지 실행과 구분한다.

배치 완료는 summary·CHECKED·저장/백업 receipt로, 발행은 STATE·completion·제품 readback으로 직접 확인한다. 현재 채팅에 단계별 결과와 남은 조건을 보고한다. 사용자 중단·쿼터·오류에는 완료 수·다음 Work·checkpoint·실제 사유를 남기고 자동 재개하지 않는다.

## 배치 진행과 재개

runner는 모델을 호출하지 않는다. 각 작품 담당자가 `session-input/PROMPT.md`·schema·동결 원문을 읽고 `decisions.json`을 작성한다. `prepare`·`check`는 비발행이고, `run --decisions`와 batch publisher는 발행이다. 새 입력·출력에는 모델별 사용/제외 필드를 만들지 않으며 모델명은 승인 조건이 아니다. 과거 자료의 부가 필드는 원본 바이트를 보존해 읽는다.

폐기된 `--allow-model`·`--retry-model`·`--model-session`은 저장·복원 전에 오류로 종료한다. 기존 완료 모델 결과는 원래 입력·prompt/schema/output SHA와 판정 형식이 모두 맞을 때 재사용한다. 미완료 PREPARED/RUNNING/실패 실행은 자동 재개하지 않으며 현재 실행자가 명시적으로 새 판정 파일을 제공한다. 새 실행이 과거 판정을 생성한 것으로 기록하지 않는다.

배치 목록에는 실제 `batchId`, `phase="adjudication-only"`, `publicationAllowed=false`, `works=[{workId,runRoot}]`를 기록한다. `runRoot`는 배치 루트 아래의 작품별 실제 절대 경로이고 서로 중복되지 않는다. 기존 ID가 있으면 소유권 추적을 위해 그대로 보존한다. 수집 전용 배정을 판정 완료로 집계하지 않는다.

```powershell
python scripts/catalog_python.py scripts/catalog_authoring_runner.py prepare --run-root <작품-run> --work-id <Work-ID> --research <원문에-결속된-research.jsonl>
# 현재 실행자가 frozen 입력을 읽고 실제 decisions.json을 작성
python scripts/catalog_python.py scripts/catalog_authoring_runner.py check --run-root <작품-run> --decisions <decisions.json>
python scripts/catalog_python.py scripts/catalog_authoring_runner.py summarize --run-root <배치-root> --dispatch <배치목록.json>
```

prior가 있는 작품은 기존 `--job`·`--prior-bundle` 경로를 사용한다. `summarize`는 기존 CHECKED·RUN·판정/입력 SHA·봉인 manifest·저장 receipt를 확인해 기계적으로 집계하고, 명시적 단계 백업을 수행한다. 판정이나 봉인을 새로 만들지 않는다. 결과는 내용 SHA별 `summaries/<SHA>/BATCH-SUMMARY.json`에 저장하며 같은 결과의 재실행은 같은 파일을 사용한다. 출력의 실제 `summaryPath`·`summarySha256`·`storage`를 그대로 사용한다.

CHECKED가 없는 작품은 `PENDING`, 전체가 끝나지 않았으면 `INCOMPLETE`와 `nextWorkId`를 반환한다. 기존 작품별 오류는 원본 사유를 그대로 보존한다. batch publisher는 새 형식의 미완료 summary를 거부한다. 부분 checkpoint는 재개 위치를 나타내며 사용자 중단 해제나 처리 시작을 뜻하지 않는다. 복구 후에는 기존 prepare/check로 필요한 run 자료를 준비하고 상태를 다시 읽는다.

전체 배치가 `COMPLETE`이면 실제 READY를 기존 publisher로 직렬 발행한다. 혼합 ERROR의 preflight/PASS-SUBSET과 중복 발행 방지·completion readback은 유지한다. 승인된 정식 반영은 같은 publisher의 `--apply-canonical`을 사용한다. collection·판정·후보·canonical·백업 상태는 각각 실제 receipt로 보고한다.

프로젝트 hook 등록은 비어 있고 `notification_guard.py`의 인자 없는 hook 진입점은 `{}`만 반환한다. 앱에 남은 구 등록도 새 턴·중단·통지 상태를 쓰지 않는다. 과거 통지 자료를 읽는 호환 함수와 자료 검증은 보존한다.

## 2026-10-01 검증 범위

runner·판정 입력·safety·배정·정책 호환·compact plan·배치 발행·구 통지 경로와 수집 검증의 해당 회귀 검사를 수행했다. 격리된 checkout의 실제 `summarize` CLI에서 미완료→HOLD 완료 집계, 원 summary 보존, SQLite 저장·실제 백업 readback, 동일 입력 재실행, 판정 바이트 변조 거부를 확인했다. 인자 없는 hook CLI는 입력을 읽거나 상태를 쓰지 않고 `{}`로 종료한다. 이 검사는 신규 작품의 모델 판정이나 운영 승격 성공을 뜻하지 않는다.

보존 원본에 의존하는 `test_prepare_factor_batch.py`의 두 검사는 `sol-next-candidates/jobs/510/records.json`과 `w2-preparation/frozen/panel-input/external-lineage.json` 부재로 실패했다. 다른 보존 artifact 기반 검사 일부도 원본 부재로 skip됐다. 실패를 PASS로 바꾸거나 해당 자료를 합성하지 않았다. 신규 실제 작품의 수집→판정→정식 반영 전체 흐름은 별도 운영 검증이 남아 있으며, 이번 변경으로 운영 Catalog·생성 데이터를 승격하지 않았다.
