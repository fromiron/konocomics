# 고정 세션 Catalog 배치 운영 계약

현재 확정 사양 · 갱신일: 2026-09-28

이 문서는 현재 배정·단계 전환·보고·발행 책임을 정의한다. 과거 시험·구현 계획·운영 수치는 Git 이력과 해당 실행 artifact에서 확인한다. 문서 갱신은 중단된 큐의 재개, 신규 판정, GitHub 쓰기나 배포 승인이 아니다. 2026-09-28 경량 보존은 [저장 계약](03-local-authoring-storage.md)을 따른다. compact 발행의 기본 pair checkpoint는 50작품이며, prior authority 검증과 작품별 판정은 유지한다.

## 1. 목표와 완료 기준

신규 배정은 가용한 루나1~6 고정 세션마다 최대 50작품이다. 50은 목록·확인 단위이며 PASS 목표나 모델 입력 묶음이 아니다. 이미 배정된 100작품 묶음과 진행 중 턴·동결 판정·실제 모델 이력은 완료 또는 정확한 부분 checkpoint까지 보존한다.

작업자는 **배치 전체 수집·보완 → 수집 완료 검증·저장/백업·통지 → dispatch 정책에 따른 판정 전환 → 작품별 동결·실제 판정·비발행 검사 → 판정 배치 완료 저장/백업·통지** 순서로 진행한다. 새 일반 배정은 `phase="collection"`, `transitionPolicy="auto-after-collection"`을 명시하고 검증된 완료 후 같은 세션에서 자동 전환한다. 명시적 `collection-only`와 정책이 없는 기존 배정은 부모 전환을 유지한다. 작품마다 수집과 판정을 교차하지 않으며 정상 작품마다 부모 응답을 기다리지 않는다.

조정자는 한 세션의 완료 배치부터 요약·예외·receipt를 확인하고 최신 candidate/registry에 직렬 발행한다. 2026-09-26 승인한 일반 완료 배치는 `--apply-canonical`로 해당 검증 완료 작품과 필요한 근거를 정식 DB·앱 정적 데이터까지 반영한다. 다른 세션의 완료를 기다리지 않는다. 후보 발행·canonical 반영·GitHub 발행·배포는 서로 다른 효과이며 각각 실제 권한과 readback으로 보고한다. 이번 고속화 구현 승인은 GitHub 쓰기·배포를 추가하지 않는다.

## 2. 계약과 책임 경계

| 사항                                     | 기준 문서                                                       |
| ---------------------------------------- | --------------------------------------------------------------- |
| 수집 범위·실제 독해·검색 종료·원문 보존  | [수집 지침](factor-collector-instructions.md)                   |
| 사전 제공 URL·리드 JSON 규격·자료 적격성 | [리드 규격](user-source-leads.md)                               |
| 원본 판정 권한·prior·N/T 예외·동결       | [AEP 계약](02-authorized-evidence-panel-v1.md)                  |
| 영구 저장·PERSISTED/BACKED_UP·세대·백업  | [저장 계약](03-local-authoring-storage.md)                      |
| prepare/check/발행/통지 CLI와 receipt    | [runner README](../../scripts/catalog_authoring/README.md)      |
| 충돌·서지 정정·실패 복구·측정            | [운영 예외 처리](01a-promotion-method-operational-amendment.md) |

대표 ISBN과 해당 판본을 확인하며 전권·1권 교체를 요구하지 않는다. 신규 Art 4축은 제외하고 unknown을 유지한다. 안전 분류는 porn/non-porn이며 성인등급·성적 소재·표현강도 미확인은 HOLD 사유가 아니다. N/T 예외는 실제 추가 조사·출처 소진을 결속한 그룹에만 적용한다. 세부 정의를 이 문서에서 별도로 변경하지 않는다.

## 3. 역할과 세션

| 담당                        | 일상 책임                                                                 | 공유 상태 권한                                                    |
| --------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 조정자 (GPT-6 Sol / xhigh) | 한 번 대상 선정·그룹 배정, 배치 완료·예외 수신, 배치 요약 확인, 직렬 발행 | 배정 원장·최신 candidate/registry/STATE·승인 대상 canonical 갱신  |
| 루나1~6 고정 세션           | 자기 목록의 수집→저장→동결→판정→비발행 검사                               | 자기 artifact만 직접 작성. 기존 helper를 통한 잠금·저장·백업 사용 |
| 기존 runner/helpers         | 원문 보존, manifest·schema·scope·HOLD/봉인 검사, 발행·제품 readback       | 기존 코드의 잠금·원자성 경계를 유지                               |

아래 표가 현재 배정 ID의 단일 기준이다. 실제 메시지 전송 전 해당 ID와 현재 배정을 확인한다. 세션 이름·과거 설정에서 ID나 모델을 추정하지 않는다.

| 현재 이름 | 고정 세션 ID                           | 이전 이름 |
| --------- | -------------------------------------- | --------- |
| 루나1     | `01a0ccdc-7cc9-78a1-911b-1e9481c909e5` | —         |
| 루나2     | `01a0ccdc-ab40-7df0-9bb7-e428fc4de595` | —         |
| 루나3     | `01a0ccdc-c606-7ed1-8730-d1df23c0ce4a` | —         |
| 루나4     | `01a0c193-f39c-7a72-b393-2977bff81697` | 솔1       |
| 루나5     | `01a0c194-0c0f-7092-8f80-b75eacf4d70a` | 솔2       |
| 루나6     | `01a0c194-1e06-77c3-bb1c-7c0afccca19b` | 솔3       |

모델·추론 설정: 루나1~6 모두 `gpt-6-luna` / `xhigh`(최신 사용자 지시). 조정자의 `gpt-6-sol` / `xhigh`는 부모 `01a0a3b8-5162-78f0-ac39-4e17f730a70a`에만 적용한다.

2026-09-28에 시작한 기존 루나1~6 배치 턴은 사용자 지정 `gpt-5.6-luna` / `max` 비교 실행이다. 진행 중인 턴과 배치의 실제 모델 이력은 유지하고, 부모 모델 변경을 작업자 변경으로 해석하지 않는다.

메시지의 model/thinking은 **수신 세션**에 적용된다. 부모가 루나1~~6에 보내면 `model="gpt-6-luna"`, `thinking="xhigh"`; 루나1~~6이 부모 `01a0a3b8-5162-78f0-ac39-4e17f730a70a`에 진행·완료·부분 중단을 보고하면 `model="gpt-6-sol"`, `thinking="xhigh"`를 지정한다. 작업자 자신의 모델 인자를 부모 보고에 복사하지 않는다.

현재 runner의 비발행 prepare/check와 배치 통지를 사용한다. 수집 전용 배정은 그 경계를 명시하고 부모의 판정 전환을 기다린다. 루나 작업 세션의 새 턴에는 위 모델·추론을 도구 인자로 지정한다. 이미 지정·승인된 방은 재승인을 요구하지 않으며 확인되지 않은 ID만 해당 배정을 보류한다.

고정 채팅을 재사용하며 일회성 `codex exec`·앱 채팅의 CLI resume로 대체하지 않는다. 독립적인 작품·출처 조사에는 범위와 반환 근거를 지정해 서브에이전트를 사용할 수 있다. 원문 결속과 최종 판정은 고정 세션이 맡고 공유 DB·registry·STATE·발행은 병렬 위임하지 않는다. 일반 배치에서는 `--allow-model`, `--retry-model`, `--model-session`을 사용하지 않는다. `SOL_COMPLETE` 등 과거 이름만으로 모델을 추정하지 않는다.

## 4. 대상 선정과 배정

1. 최신 canonical/candidate·registry·완료 기록·활성 배정과 보호 대상을 대조한다. 기존 `plan_dispatch.py`와 SHA-bound summary를 사용하고 mtime·파일 수·옛 backlog만으로 상태를 판단하지 않는다.
2. 이미 eligible인 작품, 유효 미발행 READY, 다른 세션의 배정을 중복 판정에서 제외한다. AEP prior 복구·registry 정정·미확인을 fresh로 취급하지 않는다.
3. 기존 배정 완료 후 N/T-only·추천 URL 결속 누락 복구 대상을 신규 작품보다 먼저 검토한다. 과거 190개 목록은 검토 후보이며 실제 남은 수나 승격 확정 수가 아니다. 최신 상태를 대조해 최대 50개씩 배정한다.
4. 배치 ID·owner/parent·기준 pair/계약 SHA·작품 ID·정체/대표 ISBN·gap·기존 research/prior/HOLD·원문/receipt·리드·출력 경로와 단계 전환 정책을 연결한다. 새 일반 수집은 `auto-after-collection`, 수집만 요청된 배정은 `collection-only`로 구분한다. 배치 전체 raw를 프롬프트에 넣지 않고 현재 작품에 도달했을 때 읽는다.
   - `prior-recovery` 작품도 `collectionOutput`과 실제 수집 결과를 가지며 배치 전체 collection summary에 포함한다. SHA 결속 prior recovery map은 이후 판정 freeze에서 accepted claim을 보존하는 입력이고, 수집 면제나 합성 결과를 허용하지 않는다.
5. 동일 선정 URL의 원문은 재사용하되 각 Work의 실제 언급·scope·evidence ID 결속을 확인한다. `COLLECTION-CONTEXT.json`은 dispatch/registry SHA와 원 registry 행을 보존한 lookup이며 판정 권한이 아니다.
6. 목록 밖 작품을 가져오지 않는다. 빈 방과 필요한 용량에만 배정하고 마지막 50개 미만 목록도 같은 절차로 처리한다. 단순히 인원 상한을 채우려고 추가 위임하지 않는다.

지정 세션 ID를 확인할 수 없으면 해당 배정만 보류하고 실제 오류와 함께 새 ID 또는 세션 생성 허가를 요청한다. 임의 새 방·옛 방 전용·일회성 CLI·앱 채팅의 CLI resume·판정용 서브에이전트로 대체하지 않는다. 정상 세션의 독립 작업은 계속한다. 조사 위임이 허용된 작업에서도 범위·반환 근거를 분리하고 최종 판정은 고정 세션이 맡는다.

## 5. 수집과 단계 전환

- 기존 유효 원문을 먼저 확인하고 제공 리드를 사용한다. 추가 검색 횟수 상한 없이 구체적 gap·새 정보·출처 소진으로 종료한다. 시간/쿼터/사용자 중단과 근거 소진을 구분한다.
- 새 동결의 원문·receipt·사전 리드는 해당 Work 범위로 결속한다. 정식 리드 루트에서 현재 Work JSON만 사용하고 session 없는 공용 원본은 기존 collector의 명시적 파일 입력으로 Work collection에 결속한다. 사용자 제공 폴더 전체를 매 작품 복사하거나 자료를 조용히 제외하지 않는다. 정확한 명령은 runner README와 수집 지침을 따른다.
- 정확한 추천 URL의 작품 근거·출판사/판본·원문 receipt·research/evidence ID를 결속한다. 동결 packet의 `contextEvidenceId=null`은 미판정 입력이지 수집 완료나 부족의 단독 증거가 아니다.
- 배치 전체에 실제 수집 결과 또는 출처 소진/오류와 재개 조건을 남긴다. EVIDENCE_FOUND는 coverage PASS가 아니다. N/T 소진 기록은 실제 조사자가 작성하며 자동 예외를 만들지 않는다.
- 작품별 원본·오류·checkpoint는 즉시 PERSISTED로 보존한다. 수집 배치 완료·작업 종료/부분 중단 경계에서 실제 BACKED_UP을 확인한다. 상세는 저장 계약을 따른다.
- 수집 완료 요약을 검증·백업·통지한다. 새 일반 배정은 `transition-collection`이 session lock 아래 현재 turn·generation·중단 여부·완료 receipt를 확인한 뒤 같은 실행 턴을 판정으로 전환한다. 부모 응답을 기다리지 않는다. 기존/수집 전용 배정은 부모 전환을 유지한다. 전체 수집 전 판정을 섞거나 Interrupt·사용자 중단을 자동으로 해제하지 않는다.
- 판정 dispatch는 원 collection summary의 정확한 path/SHA를 `collectionSummary`로 결속한다. 작품별 `ERROR`는 원인·실제 실패 artifact·재개 조건과 함께 `collectionErrors`에 보존하고 판정 목록에서 제외한다. 공통 오류 또는 전건 오류면 자동 전환하지 않는다. 시스템 오류를 `INSUFFICIENT`나 조사 소진으로 바꾸지 않는다.

## 6. 판정과 비발행 검사

- 구현된 runner `prepare`로 동결하고 해당 `PROMPT.md`·schema·원문·명시 prior를 읽는다. 대화 기억이나 live 조사로 동결 밖 근거를 채우지 않는다.
- 한 작품씩 실제 의미 판정을 작성한다. 반복문·기본값·문자열 탐지로 동일 HOLD/unknown/PASS를 생성해 판정을 대신하지 않는다. `unknown ≠ 0`과 실제 사전 앵커를 유지한다.
- 같은 frozen 입력의 형식 오류는 원본·실패본을 보존해 국소 수정한다. 근거·권한·관련 입력이 바뀌면 새 run revision을 사용한다. 완료한 유효 판정은 재사용한다.
- `check`가 봉인/HOLD 검사와 `CHECKED.json`·`CHECK-STORAGE.json` 저장을 수행한다. READY_FOR_PUBLICATION/HOLD는 비발행 상태이며 ERROR는 실제 실패로 기록한다. 작업자는 `run --decisions`나 직접 publisher로 공유 상태를 바꾸지 않는다.
- 작품별 기계 검사·PERSISTED·checkpoint는 즉시 수행한다. 판정 배치 완료 시 원본/결과/summary의 경계 백업을 확인한다. 내부 명령마다 물리 백업을 추가하지 않는다.
- 개별 HOLD/오류는 보존하고 다음 독립 작품을 처리한다. 공통 validator·manifest·저장 결함은 즉시 보고하고 영향을 받는 실행만 멈춘다.

## 7. 배치 통지와 조정자 확인

현재 Catalog 실행 턴에서만 기존 notification guard를 arm한다. register-batch → 단계 완료 enqueue/backup → 실제 메시지 전송 → 전송 ACK → 부모 drain/처리/consume 순서를 사용한다. 정확한 CLI·중단·부분 발행 이벤트 필드는 runner README를 따른다. 통지는 판정·발행 권한이 아니고 전송 ACK는 부모 처리 완료와 다르다.

조정자는 다음을 확인한다.

1. 배정 ID·Work 집합·owner·입력 버전·경로·최종 SHA가 일치하고 판정 배정 수 = READY + HOLD + ERROR이며 누락·중복이 없다. 수집에서 제외한 ERROR는 결속된 `collectionErrors`로 별도 보존해 원래 수집 배정 전건을 설명한다. 수집 단계 요약에는 판정 CHECKED를 요구하지 않는다.
2. READY의 `checkedPath`·`checkedSha256`·실제 `checkStorage`가 입력/판정/봉인 결과와 결속되고 단계 백업이 확인됐다. 없는 receipt를 상태 문자열로 채우지 않는다.
3. 공통 결함·구체적인 의미 이상·기존값 정정 충돌을 확인한다. 최초 배치군의 세션별 PASS/HOLD 표본 검토는 초기 품질 확인이며 매 배치 전량 재판정으로 확대하지 않는다.
4. 최신 candidate/registry에 기존 publisher로 순서대로 적용한다. frozen 기준과 current를 구분하고 무관한 작품의 변경은 보존한다. 오래된 배치 DB 전체를 덮어쓰지 않는다.
5. authority·Gold·서지·팩터·safety·coverage·제품 readback·backup과 STATE/completion 결속을 확인한 후보 결과만 VERIFIED로 집계한다. `--apply-canonical`에서는 별도 정식 DB·생성 JSON readback·백업까지 확인해 canonical 반영을 보고한다. 최종 배치 성공과 단순 BATCH-FINISHED를 구분한다.

오류가 섞인 묶음은 기존 preflight와 검증된 PASS-SUBSET 경로로 독립적인 유효 작품을 처리한다. 공통/미분류 오류를 임의 subset으로 숨기지 않는다. 일부 발행은 `partially-published`로 남기고 원 summary·실제 적용 집합·STATE를 결속한다. 재개는 readback과 완료 기록부터 확인해 재발행을 막는다.

작업 파일 유실 뒤 복구는 [저장 계약 R1~R9](03-local-authoring-storage.md#db-중심-복구-요구사항)를 따른다. 기본 `restore`는 DB와 mapping/report만 만들며, 기존 batch·runner·notification 명령이 요청 자료만 추출한다. 미추출 파일을 삭제로 취급하거나 과거 전체 폴더 재생성을 선행하지 않는다. generation·turn·중단 상태를 유지하고 복구만으로 새 의미 판정이나 중단 해제를 허용하지 않는다.

복구할 현재 판정은 완료 run을 포함해 Work별 최신 유효 판정으로 선택한다. 완료 run을 먼저 제외한 뒤 상태별 READY/HOLD를 고르면 이전 판정을 현재로 되살리므로 그렇게 하지 않는다. 이미 완료된 최신 판정은 completion으로 확인하며, 실제 미완료 summary나 기존 pending 작업이 특정 과거 CHECKED/SHA에 의존할 때만 그 정확한 의존을 함께 보존한다.

작업자의 판정 배치 완료·백업·통지 후 예약된 다음 비중복 목록이 있으면 부모 발행을 기다리지 않고 새 수집을 시작할 수 있다. 새 배치도 전체 수집 뒤 해당 dispatch 정책으로 전환한다. 사용자 중단은 재개 승인 없이 풀지 않는다. 미완료가 idle이면 실제 중단/쿼터/장애·승인 범위를 확인한 뒤 같은 checkpoint에서 이어간다. 상태 문구만으로 active를 추정하지 않는다. 예약 automation이나 정기 모델 폴링은 만들지 않는다.

## 8. 검증과 보고

수집·판정·검사·발행·canonical 반영·백업을 구분해 결과와 남은 조건을 보고한다. 준비된 입력의 재사용 시험을 신규 처리량으로 계산하지 않는다. 비용은 수집·판정·수정·대기·조정·후처리를 포함하며 실제 모델/설정과 요청값을 구분한다. unavailable을 추정값으로 채우지 않는다.

현재 기능의 실행 근거는 [파이프라인 검증 기록](07-pipeline-improvements-20260925.md)과 [저장소 최신 검증](authoring-retention-20260926.md)에 있다. 그 기록의 PASS는 해당 시점·입력·환경 범위이며 현재 배치의 실제 성공을 대신하지 않는다. 앱 hook의 자동 실행과 로컬 함수 검사는 별개다. 미확인 실행은 완료로 보고하지 않는다.

현재 연속 승격의 중간 커밋/푸시·검사 예외는 AGENTS.md의 사용자 승인 범위에만 적용한다. 문서의 완료 기록이나 예외를 다른 릴리스의 권한·검증 면제로 확대하지 않는다.
