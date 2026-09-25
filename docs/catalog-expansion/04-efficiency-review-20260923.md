# 승격 효율화 리뷰 검토 및 반영 — 2026-09-23

사용자가 제공한 코드 조사 보고서를 현재 작업 트리와 실제 실행 경로에 대조했다. 기준 HEAD는 `3ee8b4fa696ddd925aba90aafb7735ca0f9ecef7`이며 아래 변경은 미커밋 작업 트리에 반영했다. 기존 판정·원문·frozen·공유 candidate/registry/STATE는 이 검토 때문에 수정하지 않았다.

## 판단과 변경

| 지적 | 판단·조치 |
|---|---|
| 수집 원문이 frozen에서 누락됨 | 타당. runner가 명시 provenance만 전달하던 것이 원인이다. 새 run은 direct research collection의 session Work·research SHA·receipt SHA/bytes를 확인하여 원문을 결속한다. 복수 collection의 동일 파일명·상대 rawPath는 별도 경로로 보존한다. 자동 parent 통째 복사는 하지 않는다. |
| 기존 run에서 새 provenance/registry/recovery 옵션이 무시됨 | 타당. 다른 인자를 주면 새 run/input revision을 요구한다. 기존 PREPARED 프롬프트도 재생성하지 않는다. |
| 동결 원문 접근 상태가 불명확함 | 타당. reading view와 신규 PREPARED에 inputAccess, 각 출처에 rawAccess/rawLookupPaths를 제공한다. observations-only는 접근 제한이지 근거 없음·자동 HOLD가 아니다. 기존 PASS를 무효화하지 않는다. |
| 배정 전 authority/registry 라우팅 | 타당. `plan_dispatch.py`가 기존 packet/baseline 검사·notification_guard를 재사용한다. eligible, 보호 대상, AEP prior 복구, registry 정정, 신규 수집을 구분한다. 유효 요약의 READY만 재사용 표시하며 복합 정정 필요를 유지한다. 기존 배정은 변경하지 않는다. |
| 반복 snapshot 입력 저장 | 병목 근거가 있다. snapshot 15852의 9,928개와 15856의 9,906개 중 9,902개가 같은 path+SHA였다. 큰 root만 참조로 분리하려면 inputSnapshot·복원·백업 소비자 계약을 함께 변경해야 하므로 refs-V2 개편은 보류한다. 기존 두 세대 증분 백업·old blob 검증·논리 이력은 유지한다. |
| safety 프롬프트가 구 non-adult 기준임 | 타당. 동결 schema와 policy에 맞춰 새 입력은 porn/non-porn 기준을 설명한다. 출판사·해당 레이블로 충분하며 성인등급·성적 장면·표현 강도 미확인만으로 막지 않는다. 기존 동결 계약에는 그 계약의 설명을 유지한다. |
| inputDiscovery=0 | 실제 전달 누락을 수정했다. runner가 탐색 시간을 측정해 recorded_run에 넘긴다. 기존 최종 timing 8항목을 반환 객체와 다음 정상 frozen checkpoint에 포함하며, 계측만을 위한 추가 save/backup은 하지 않는다. |
| EVIDENCE_FOUND/hint=[]와 coverage readiness | EVIDENCE_FOUND는 충분성 판정이 아니라는 지적이 타당하다. 별도 모델·숫자 판정·readiness schema는 추가하지 않았다. 기존 observation/limitation/remainingGaps로 구체적 보완·출처 소진을 기록한다. 빈 hint를 자동 HOLD로 바꾸지 않는다. |
| progress counter 결함 | 확정할 근거 없음. 배정 집합·명시 CHECKED·SHA·결정·동결·백업을 검증하는 기존 notification_guard를 재사용하며, 제공된 processedCount/resultCounts도 같은 요약의 결과 집합과 일치하는지 검사한다. mtime나 파일 개수로 현재 판정을 선택하지 않는다. |

보고서의 Narrative 4/Tone 5를 항상 유지하자는 부분은, **추가 조사 후에도 N/T만 부족하면 unknown을 유지하며 승격한다**는 사용자 결정과 충돌한다. 이 제안을 새로운 차단 조건으로 채택하지 않았다. 1차 원문 패치 시점에는 그 사용자 예외가 별도 미완료였다. 아래 후속 수정에서 코드 연결을 구현했으며, 실행 검증과 실제 처리량 검증은 아직 미완료다. Genre/Theme·작품 식별·추천 맥락·porn 분류와 Art 제외 경계는 별개다.

## 실제 경로 확인

아래 새 run은 기존 runner의 `prepare`를 사용했다. 새 모델 호출·판정·발행은 하지 않았다.

| Work | 기존 rawCaptures | 새 rawCaptures | 신규 frozen manifest SHA |
|---|---:|---:|---|
| `work-0341d443a460fc74086a` | 0 | 5 | `617136db01ad16418890b23d7e9c70225afd9378877cec30c8411eda8b4a992d` |
| `work-3f07e8ec5a3154380b0f` | 0 | 7 | `24b3023622426db4ad10ab9ac1ff63edae4b46499ceb828a02dbf1daf1f29c1e` |

첫 표본의 5개는 모두 원 receipt SHA·길이 일치, 신규 non-porn prompt 생성과 lookup 4개 출처 연결을 확인했다. 두 번째도 원문 7개 전부 SHA·길이 일치와 PREPARED·저장/백업 snapshot 16015를 확인했다. 기존 run에 새 provenance를 추가하는 실제 명령은 거부됐고 원 RUN·frozen manifest·프롬프트 SHA는 모두 불변이었다. 이 readback과 Sol3 계획은 snapshot 16031로 저장·백업했다. 작업 폴더는 `data/local/catalog-authoring/artifacts/catalog-expansion-continuation-20260902/planning/provenance-repair-20260923/`다. 128 KiB inline 한도를 넘는 원문은 삭제·잘림 없이 rawLookupPaths로 남는다.

- 수집 전 planner의 Sol1 100개 실조회: registry 정정 필요 11개(그중 prior 복구 병행 1개), 보호 대상 1개를 식별했다.
- Sol3 완료 요약 100개에 기존 notification_guard를 적용한 실제 planner 실행: READY 재사용 32개, 그중 현재 registry 정정 병행 1개, 보호 대상 1개를 구분했다. 저장된 `SOL3-REUSE-PLAN.json`은 READY를 발행 완료로 표시하지 않는다.
- 저장 helper의 작은 실제 저장·백업·복원에서 18-byte 원본 readback과 timing 8항목 반환을 확인했다. 전체 저장 구조의 변경이나 처리속도 향상 배수는 검증하지 않았다.
- 수정 Python 문법·diff 형식을 확인했다. 회귀 코드는 작성했으며 **사용자 지시대로 테스트 스위트·CI/CD는 실행하지 않았다.** 최종 작업 완료 시 실행한다.

원문 누락과 높은 HOLD의 상관은 확인됐지만 모든 HOLD의 원인이라고 단정할 수 없다. 두 prepare의 기계 처리 timing은 각각 약 14.39초/10.92초이며 입력·writer 경합이 다르므로 전후 속도 비교로 사용하지 않는다. 판정 PASS율·전체 처리량의 개선은 후속 실제 판정으로 측정해야 한다.

## 후속 리뷰 반영 — 동일 명령 재개와 N/T 예외

- 자동 A + 명시 B를 저장한 후 `[B]`와 `[A,B]`를 비교하던 재개 결함을 수정했다. 새 RUN의 `requestedProvenanceRoots`는 명시 옵션만 보존한다. 전체 collection/바이트 결속은 기존 필드로 유지한다. 변경 옵션을 허용하는 부분집합 비교는 넣지 않았다.
- 추가 조사 기록이 있는 N/T 그룹만 예외를 받도록 `narrative-tone-exhaustion-v1`을 구현했다. v4 job → frozen → 두 ledger validator → single-pass publisher → recovery/correction readback → source evidence → compiler → coverage report/build → 제품 readback으로 연결했다. 역사적 standalone legacy validator는 옛 계약을 유지하고 현재 adapter가 검증된 예외만 전달한다.
- 새 source evidence 기록은 작품·대표 ISBN·입력 SHA·조사 기록 SHA·현재 review에 결속된다. 다른 차단과 기존 권한은 유지하며, 기존 17축 값/unknown과 추천 엔진 산식은 바꾸지 않았다. 모델 출력이 실제 HOLD인 경우 자동으로 판정을 조작하지 않는다. 과거 frozen/PREPARED/판정은 변경하지 않았다.
- 회귀 작성 범위를 보강했다: 실제 run_job의 최초 준비/동일 옵션 재개/변경 거부, 실제 plan의 READY와 registry 정정 공존·완료 소유권·CHECKED SHA·조회 중 STATE 변경, N/T 대상의 check→임시 후보 발행→기존 build/추천 readback 연결, Genre/Theme·identity·context·safety 보존과 unknown/0.5 수축 구분.
- **검증 한계:** Python/TypeScript 문법과 diff만 확인한다. 작성한 회귀·전체 테스트·CI/CD 및 실제 모델 승격은 사용자 중단/중간 테스트 금지 지시에 따라 실행하지 않았다. 테스트의 임시 N/T 표본은 경계 검사용 자료이며 실제 추가 조사나 새 모델 판정 증거가 아니다. 새 방침의 운영 PASS·처리량 향상은 아직 주장할 수 없다.
- 솔1~3은 정지 상태를 유지한다. canonical/공유 candidate/registry/STATE는 수정하지 않았으며 저장 참조 V2·전체 속도 비교는 계속 보류한다.

## 2026-09-24 Oracle 후속 개선

- 현재 run·CHECKED·frozen/sealed SHA·코드·candidate/registry·canonical에 결속된 사전검사 영수증을 저장한다. 같은 조합만 재사용하며 이전 오류 메시지만으로 현재 발행 가능성을 판단하지 않는다.
- 기존 batch publisher에 `--preflight-only`를 추가했다. 알려진 작품별 accepted Axis 충돌·registry 행 불일치만 격리해 원 summary SHA에 연결된 PASS subset을 생성한다. 공통·미분류 실패는 묶음을 중단하며 실제 누적 발행 검사는 유지한다.
- `BATCH-FINISHED`는 readback 단계이며 최종 완료는 후보 백업·STATE 반영/백업 후 `BATCH-COMPLETED` 저장/백업까지다. STATE의 적용 원장이 같은 summary 재수신을 처리한다. 과거 후보를 다시 덮어쓰지 않으며, 실패 후 같은 batch root에서 미완료 저장 경계를 재개한다.
- revision 원문은 기존 반복 `--provenance-root`로 원 collection과 수정 collection을 명시해 결속한다. 새 데이터 형식이나 상위 폴더 자동 복사는 추가하지 않았다. 작업자 스킬과 새 동결 프롬프트에 내부 enum 문구 요구 금지, prior 보존과 신규 Genre/Theme 추가 구분, 개별 리뷰 scope 평가, 실제 N/T 조사 기록의 job 인계를 명확히 했다.
- snapshot 확인 시 저장된 모든 경로의 부모 디렉터리를 반복 조회하던 비용을 제거했다. 요청한 실제 파일 경로·링크·SHA·blob·snapshot membership 검사는 유지한다.
- 실제 READY/충돌 2건을 비발행 CLI로 확인해 PASS 1·WORK 차단 1과 PASS subset 생성, 동일 검사의 재사용 및 STATE 불변을 확인했다. 변경된 저장/재개·원문 결속의 국소 회귀 검사를 실행했다. 전체 테스트·CI/CD와 전체 backlog의 재판정은 이 검증에 포함하지 않는다. 검토 기준은 Oracle의 11:10 JST 표본이며 현재 잔량과 혼합하지 않는다.
- 개선된 실제 발행 경로로 루나2 복구 READY 2건을 반영했다. 후보 추천 가능 수 1926→1928, 제품 readback coverage 1928 PASS/0 FAIL, 후보 snapshot 19150·STATE snapshot 19151의 백업과 `BATCH-COMPLETED`까지 확인했다. canonical DB 반영이나 전체 backlog 완료를 뜻하지 않는다.
