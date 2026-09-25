# Offline Catalog authoring

실행 코드와 필요한 기존 발행 backend를 이 디렉터리에서 추적한다. 원문·동결 입력·판정·후보·작업 DB는 Git에 포함하지 않는다.

- 일반 진입점: `python -X utf8 scripts/catalog_authoring_runner.py run --run-root <영구 planning 경로> --job <job.json> --decisions <판정.json>`
  - 여러 작품의 봉인된 READY가 모이면 조정자는 `python -B -X utf8 scripts/catalog_authoring_batch_publish.py --batch-summary <BATCH-SUMMARY.json> --batch-root <새 planning 디렉터리>`를 사용한다. 각 작품의 동결 입력·판정 SHA와 기존 publisher `--validate-only`를 전건 확인한 뒤 기존 publisher를 직렬 실행하고, 최종 후보에서 전체 대상의 제품 빌드·추천 readback을 한 번 수행한다. 오류가 섞인 완료 묶음은 먼저 `--preflight-only`로 검사한다. 결과는 입력·결과·코드·candidate/registry·canonical SHA에 결속되고 같은 조합만 재사용한다. 알려진 Work별 prior/registry 충돌만 격리한 `PASS-SUBSET.json`을 원 summary SHA와 함께 저장하며, 공통·미분류 오류가 있으면 subset을 만들지 않는다. subset을 별도 batch root로 발행해 정상 작품의 동반 대기를 해소한다.
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
