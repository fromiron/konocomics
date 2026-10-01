# Catalog 배치 운영 계약

현재 확정 사양 · 갱신일: 2026-10-01

이 문서는 현재 배정·단계 전환·보고·발행 책임을 정의한다. 과거 시험·구현 계획·운영 수치는 Git 이력과 해당 실행 artifact에서 확인한다. 문서 갱신은 중단된 큐의 재개, 신규 판정, GitHub 쓰기나 배포 승인이 아니다. 2026-09-28 경량 보존은 [저장 계약](03-local-authoring-storage.md)을 따른다. compact 발행의 기본 pair checkpoint는 50작품이며, prior authority 검증과 작품별 판정은 유지한다.

## 1. 목표와 완료 기준

신규 배정은 작업자별 최대 50작품이다. 50은 목록·확인 단위이며 PASS 목표나 모델 입력 묶음이 아니다. 이미 배정된 100작품 묶음과 진행 중 턴·동결 판정·실제 모델 이력은 완료 또는 정확한 부분 checkpoint까지 보존한다.

현재 실행자는 **배치 전체 수집·보완 → 수집 완료 검증·저장/백업 → 작품별 동결·실제 판정·비발행 검사 → 판정 배치 완료 저장/백업 → 승인 범위의 직렬 승격·readback** 순서로 진행한다. 부모·자식 세션 분리, hook 등록, 메시지·ACK, `transition-collection`은 선행 조건이 아니다. 수집만 요청된 작업은 수집에서 멈추고, 일반 승격 작업은 수집 완료 근거를 확인한 뒤 판정으로 이어간다. 작품마다 수집과 판정을 교차하지 않는다.

발행 담당은 완료 배치부터 요약·예외·receipt를 확인하고 최신 candidate/registry에 직렬 발행한다. 2026-09-26 승인한 일반 완료 배치는 `--apply-canonical`로 해당 검증 완료 작품과 필요한 근거를 정식 DB·앱 정적 데이터까지 반영한다. 다른 배치의 완료를 기다리지 않는다. 후보 발행·canonical 반영·GitHub 발행·배포는 서로 다른 효과이며 각각 실제 권한과 readback으로 보고한다. 이번 고속화 구현 승인은 GitHub 쓰기·배포를 추가하지 않는다.

## 2. 계약과 책임 경계

| 사항                                     | 기준 문서                                                       |
| ---------------------------------------- | --------------------------------------------------------------- |
| 수집 범위·실제 독해·검색 종료·원문 보존  | [수집 지침](factor-collector-instructions.md)                   |
| 사전 제공 URL·리드 JSON 규격·자료 적격성 | [리드 규격](user-source-leads.md)                               |
| 원본 판정 권한·prior·N/T 예외·동결       | [AEP 계약](02-authorized-evidence-panel-v1.md)                  |
| 영구 저장·PERSISTED/BACKED_UP·세대·백업  | [저장 계약](03-local-authoring-storage.md)                      |
| prepare/check/발행 CLI와 receipt         | [runner README](../../scripts/catalog_authoring/README.md)      |
| 충돌·서지 정정·실패 복구·측정            | [운영 예외 처리](01a-promotion-method-operational-amendment.md) |

대표 ISBN과 해당 판본을 확인하며 전권·1권 교체를 요구하지 않는다. 신규 Art 4축은 제외하고 unknown을 유지한다. 안전 분류는 porn/non-porn이며 성인등급·성적 소재·표현강도 미확인은 HOLD 사유가 아니다. N/T 예외는 실제 추가 조사·출처 소진을 결속한 그룹에만 적용한다. 세부 정의를 이 문서에서 별도로 변경하지 않는다.

## 3. 역할과 실행 추적

2026-10-01 사용자 지시로 특정 모델·추론 강도·고정 세션 이름/ID·세션 수 지정 등 모델 제한을 제거한다. 부모·자식 세션 기반 hook과 자동 통지도 사용하지 않는다. 현재 작업 환경에서 수집·판정·검증을 수행하며, 모델명은 판정 권한이나 승격 조건이 아니다.

| 역할                | 책임                                                           | 경계                                        |
| ------------------- | -------------------------------------------------------------- | ------------------------------------------- |
| 수집·판정 담당      | 대상 자료 확인, 원문·관찰 저장, 작품별 동결 판정·비발행 검사   | 검증 전 결과를 공유 Catalog에 반영하지 않음 |
| 발행 담당           | 대상·중복·예외 확인, 검증된 결과의 직렬 반영                   | 기존 잠금·권한·최신 상태·readback·백업 유지 |
| 기존 runner/helpers | 원문 보존, schema·manifest·scope·HOLD 검사, 봉인·발행·readback | 의미 판정을 합성하지 않음                   |

조정자/작업자는 위 책임을 가리키며 별도 채팅을 뜻하지 않는다. 같은 실행자가 단계를 구분해 수행할 수 있다. 배치/Work ID·실제 실행자·입력/판정 SHA·checkpoint·중단 사유를 보존한다. 기존 자료의 owner/parent·thread/turn·generation은 원본 호환과 소유권 추적에 사용하며 새 부모 세션을 만드는 근거가 아니다. 확인되지 않은 식별자나 통지 receipt를 만들어 형식을 맞추지 않는다.

현재 경로는 제공되거나 저장된 유효 판정과 runner의 `prepare`/`check`/발행을 사용한다. 누락·오류를 추가 모델 호출로 자동 보충하지 않는다. 기존 frozen·판정·모델 이력과 사용자 중단은 보존한다. 미완료 기존 배정을 새 실행자가 이어갈 때 완료 readback과 실제 소유권을 확인해 중복 실행을 막는다. 문서 변경 자체가 중단 해제·신규 판정·발행 승인은 아니다.

현재 실행자는 [runner의 집계·재개 경로](../../scripts/catalog_authoring/README.md#단일-실행자의-진행과-재개)를 사용한다. 실제 완료는 입력·판정·저장·승격 receipt로 확인한다.

## 4. 대상 선정과 배정

1. 최신 canonical/candidate·registry·완료 기록·활성 배정과 보호 대상을 대조한다. 기존 `plan_dispatch.py`와 SHA-bound summary를 사용하고 mtime·파일 수·옛 backlog만으로 상태를 판단하지 않는다.
2. 이미 eligible인 작품, 유효 미발행 READY, 다른 세션의 배정을 중복 판정에서 제외한다. AEP prior 복구·registry 정정·미확인을 fresh로 취급하지 않는다.
3. 기존 배정 완료 후 N/T-only·추천 URL 결속 누락 복구 대상을 신규 작품보다 먼저 검토한다. 과거 190개 목록은 검토 후보이며 실제 남은 수나 승격 확정 수가 아니다. 최신 상태를 대조해 최대 50개씩 배정한다.
4. 배치 ID·실제 담당·기준 pair/계약 SHA·작품 ID·정체/대표 ISBN·gap·기존 research/prior/HOLD·원문/receipt·리드·출력 경로와 허용된 단계 범위를 연결한다. 수집 전용과 승격까지 허용된 작업을 구분한다. 배치 전체 raw를 프롬프트에 넣지 않고 현재 작품에 도달했을 때 읽는다.
   - `prior-recovery` 작품도 `collectionOutput`과 실제 수집 결과를 가지며 배치 전체 collection summary에 포함한다. SHA 결속 prior recovery map은 이후 판정 freeze에서 accepted claim을 보존하는 입력이고, 수집 면제나 합성 결과를 허용하지 않는다.
5. 동일 선정 URL의 원문은 재사용하되 각 Work의 실제 언급·scope·evidence ID 결속을 확인한다. `COLLECTION-CONTEXT.json`은 dispatch/registry SHA와 원 registry 행을 보존한 lookup이며 판정 권한이 아니다.
6. 목록 밖 작품을 가져오지 않는다. 가용한 실행자와 필요한 용량에만 배정하고 마지막 50개 미만 목록도 같은 절차로 처리한다. 단순히 인원 상한을 채우려고 추가 위임하지 않는다.

기존 배정의 실제 소유권이나 중단 사유를 확인할 수 없으면 해당 작업의 재개만 보류하고 독립 작업은 계속한다. 과거 고정 ID 부재를 전체 작업의 중단 사유로 삼지 않는다.

## 5. 수집과 단계 전환

- 기존 유효 원문을 먼저 확인하고 제공 리드를 사용한다. 추가 검색 횟수 상한 없이 구체적 gap·새 정보·출처 소진으로 종료한다. 시간/쿼터/사용자 중단과 근거 소진을 구분한다.
- 새 동결의 원문·receipt·사전 리드는 해당 Work 범위로 결속한다. 정식 리드 루트에서 현재 Work JSON만 사용하고 session 없는 공용 원본은 기존 collector의 명시적 파일 입력으로 Work collection에 결속한다. 사용자 제공 폴더 전체를 매 작품 복사하거나 자료를 조용히 제외하지 않는다. 정확한 명령은 runner README와 수집 지침을 따른다.
- 정확한 추천 URL의 작품 근거·출판사/판본·원문 receipt·research/evidence ID를 결속한다. 동결 packet의 `contextEvidenceId=null`은 미판정 입력이지 수집 완료나 부족의 단독 증거가 아니다.
- 배치 전체에 실제 수집 결과 또는 출처 소진/오류와 재개 조건을 남긴다. EVIDENCE_FOUND는 coverage PASS가 아니다. N/T 소진 기록은 실제 조사자가 작성하며 자동 예외를 만들지 않는다.
- 작품별 원본·오류·checkpoint는 즉시 PERSISTED로 보존한다. 수집 배치 완료·작업 종료/부분 중단 경계에서 실제 BACKED_UP을 확인한다. 상세는 저장 계약을 따른다.
- 수집 완료 요약과 원문·receipt를 검증하고 명시적 단계 백업을 확인한 뒤 판정으로 전환한다. hook의 arm·enqueue·전송 ACK·부모 응답은 사용하지 않는다. 전체 수집 전 판정을 섞거나 사용자 중단을 자동 해제하지 않는다.
- 원 collection summary의 정확한 path/SHA를 다음 단계 기록에 결속한다. 기존 dispatch 형식에서는 `collectionSummary`를 사용한다. 작품별 `ERROR`는 원인·실제 실패 artifact·재개 조건과 함께 보존하고 판정 목록에서 제외한다. 공통 오류 또는 전건 오류면 의존 판정을 진행하지 않는다. 시스템 오류를 `INSUFFICIENT`나 조사 소진으로 바꾸지 않는다.

## 6. 판정과 비발행 검사

- 구현된 runner `prepare`로 동결하고 해당 `PROMPT.md`·schema·원문·명시 prior를 읽는다. 대화 기억이나 live 조사로 동결 밖 근거를 채우지 않는다.
- 한 작품씩 실제 의미 판정을 작성한다. 반복문·기본값·문자열 탐지로 동일 HOLD/unknown/PASS를 생성해 판정을 대신하지 않는다. `unknown ≠ 0`과 실제 사전 앵커를 유지한다.
- 같은 frozen 입력의 형식 오류는 원본·실패본을 보존해 국소 수정한다. 근거·권한·관련 입력이 바뀌면 새 run revision을 사용한다. 완료한 유효 판정은 재사용한다.
- `check`가 봉인/HOLD 검사와 `CHECKED.json`·`CHECK-STORAGE.json` 저장을 수행한다. READY_FOR_PUBLICATION/HOLD는 비발행 상태이며 ERROR는 실제 실패로 기록한다. 수집·판정 단계에서는 `run --decisions`나 직접 publisher로 공유 상태를 바꾸지 않는다.
- 작품별 기계 검사·PERSISTED·checkpoint는 즉시 수행한다. 판정 배치 완료 시 원본/결과/summary의 경계 백업을 확인한다. 내부 명령마다 물리 백업을 추가하지 않는다.
- 개별 HOLD/오류는 보존하고 다음 독립 작품을 처리한다. 공통 validator·manifest·저장 결함은 즉시 보고하고 영향을 받는 실행만 멈춘다.

## 7. 배치 완료와 발행 확인

실행자가 결과와 백업 receipt를 저장하고 현재 채팅에 보고한다. hook·부모 inbox·메시지 전송/소비 ACK를 만들거나 완료 조건으로 요구하지 않는다. 발행 담당은 실제 summary와 CHECKED·completion·STATE를 직접 대조한다.

1. 배정 ID·Work 집합·owner·입력 버전·경로·최종 SHA가 일치하고 판정 배정 수 = READY + HOLD + ERROR이며 누락·중복이 없다. 수집에서 제외한 ERROR는 결속된 `collectionErrors`로 별도 보존해 원래 수집 배정 전건을 설명한다. 수집 단계 요약에는 판정 CHECKED를 요구하지 않는다.
2. READY의 `checkedPath`·`checkedSha256`·실제 `checkStorage`가 입력/판정/봉인 결과와 결속되고 단계 백업이 확인됐다. 없는 receipt를 상태 문자열로 채우지 않는다.
3. 공통 결함·구체적인 의미 이상·기존값 정정 충돌을 확인한다. 최초 배치군의 세션별 PASS/HOLD 표본 검토는 초기 품질 확인이며 매 배치 전량 재판정으로 확대하지 않는다.
4. 최신 candidate/registry에 기존 publisher로 순서대로 적용한다. frozen 기준과 current를 구분하고 무관한 작품의 변경은 보존한다. 오래된 배치 DB 전체를 덮어쓰지 않는다.
5. authority·Gold·서지·팩터·safety·coverage·제품 readback·backup과 STATE/completion 결속을 확인한 후보 결과만 VERIFIED로 집계한다. `--apply-canonical`에서는 별도 정식 DB·생성 JSON readback·백업까지 확인해 canonical 반영을 보고한다. 최종 배치 성공과 단순 BATCH-FINISHED를 구분한다.

오류가 섞인 묶음은 기존 preflight와 검증된 PASS-SUBSET 경로로 독립적인 유효 작품을 처리한다. 공통/미분류 오류를 임의 subset으로 숨기지 않는다. 일부 발행은 `partially-published`로 남기고 원 summary·실제 적용 집합·STATE를 결속한다. 재개는 readback과 완료 기록부터 확인해 재발행을 막는다.

작업 파일 유실 뒤 복구는 [저장 계약 R1~R9](03-local-authoring-storage.md#db-중심-복구-요구사항)를 따른다. 기본 `restore`는 DB와 mapping/report만 만들며, 기존 batch·runner 명령이 요청 자료만 추출한다. 미추출 파일을 삭제로 취급하거나 과거 전체 폴더 재생성을 선행하지 않는다. generation·turn·중단 상태를 유지하고 복구만으로 새 의미 판정이나 중단 해제를 허용하지 않는다.

복구할 현재 판정은 완료 run을 포함해 Work별 최신 유효 판정으로 선택한다. 완료 run을 먼저 제외한 뒤 상태별 READY/HOLD를 고르면 이전 판정을 현재로 되살리므로 그렇게 하지 않는다. 이미 완료된 최신 판정은 completion으로 확인하며, 실제 미완료 summary나 기존 pending 작업이 특정 과거 CHECKED/SHA에 의존할 때만 그 정확한 의존을 함께 보존한다.

판정 배치 완료·백업 후 승인된 다음 비중복 목록을 처리할 수 있다. 사용자 중단은 재개 승인 없이 풀지 않는다. 미완료 상태는 실제 checkpoint·쿼터·장애·승인 범위를 확인한 뒤 이어간다. 상태 문구만으로 실행 중이라고 판단하지 않으며 예약 automation이나 정기 모델 폴링을 만들지 않는다.

## 8. 검증과 보고

수집·판정·검사·발행·canonical 반영·백업을 구분해 결과와 남은 조건을 보고한다. 준비된 입력의 재사용 시험을 신규 처리량으로 계산하지 않는다. 비용은 수집·판정·수정·대기·조정·후처리를 포함하며 실제 모델/설정과 요청값을 구분한다. unavailable을 추정값으로 채우지 않는다.

현재 기능의 실행 근거는 [파이프라인 검증 기록](07-pipeline-improvements-20260925.md)과 [저장소 최신 검증](authoring-retention-20260926.md)에 있다. 그 기록의 PASS는 해당 시점·입력·환경 범위이며 현재 배치의 실제 성공을 대신하지 않는다. 과거 hook 검증은 현재 운영 절차의 근거로 사용하지 않는다. 미확인 실행은 완료로 보고하지 않는다.

현재 연속 승격의 중간 커밋/푸시·검사 예외는 AGENTS.md의 사용자 승인 범위에만 적용한다. 문서의 완료 기록이나 예외를 다른 릴리스의 권한·검증 면제로 확대하지 않는다.
