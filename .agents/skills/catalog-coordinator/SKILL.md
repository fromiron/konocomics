---
name: catalog-coordinator
description: konocomics의 고정 작업 세션에 작품 묶음을 배정하고 배치 완료·예외 확인과 기존 runner의 직렬 승격을 조정할 때 사용한다.
---

# Catalog 조정자

## 2026-09-26 저장과 백업 경계

schema v3에서는 [현재 저장 정책](../../../docs/catalog-expansion/03-local-authoring-storage.md)을 우선한다. 단계 내부 `PERSISTED`와 단계 완료·인계의 실제 `BACKED_UP`을 구분한다. 수집/판정 배치 완료·발행 완료·종료/부분 중단 때 백업하고 source/latest의 필요한 원문을 확인한다. 매 작품/명령의 대형 백업을 다시 추가하지 않는다. 중복 완료는 `STATE.publicationBatches`와 작은 `completion` revision을 먼저 대조하며 오래된 전체 발행 트리를 다시 열지 않는다. 현재 기준점은 검증된 큐레이션 revision이고 과거 frozen과 미완료 의존의 pin을 보존한다. 보존 정책 변경은 재판정·큐 재개·권한 확대가 아니다.

## 2026-09-24 현재 고정 세션 설정

부모 오케스트레이터 세션 `01a0a3b8-5162-78f0-ac39-4e17f730a70a`는 `gpt-5.6-sol` / `high`로 고정하며 이 설정을 작업자 메시지의 모델 인자로 전파하지 않는다. 현재 배정 풀은 [배치 계획 §3의 검증된 ID 표](../../../docs/catalog-expansion/01c-sol-batch-promotion-plan.md#3-역할과-세션)에 있는 **루나1~6**이다. 루나4·5·6은 이전 솔1·2·3과 같은 thread ID다. 신규 배정은 세션당 50작품이며, **루나1~6에 보내는 모든 새 턴의 `send_message_to_thread`에 `model="gpt-6-luna"`, `thinking="xhigh"`를 명시한다. 부모 세션에는 이 작업자 설정을 전달하지 않는다.** 작업이 이미 진행 중인 방에도 다음 턴부터 적용하고 이전 대화 설정·이름·메모리에서 모델을 추정하지 않는다. 기존 100작품 배정·완료 판정·실제 모델 기록을 보존하며 사용자 중단 세션은 지침 변경만으로 재개하지 않는다.

## 2026-09-21 수집 범위: 전권 확인 금지

모든 권을 순서대로 확인하거나 전체 권수·완결권·전권 독해를 승격 완료 조건으로 삼지 않는다. 대표 ISBN과 해당 판본의 서지를 확인하고, 확보된 작품 소개·리뷰로 필요한 관찰이 충분하면 수집을 종료한다. 구체적인 필수 판정 gap을 해결할 가능성이 있는 특정 권 소개·리뷰만 선택적으로 추가 확인한다. `whole_work`는 주장의 범위이며 모든 권을 읽었다는 증명 요구가 아니다. 실제 읽은 범위와 한계는 정확히 남기되 전권 미확인 자체는 HOLD·재시도·추가 수집 사유가 아니다.

대표 ISBN이 3권·6권 등 중간 권이면 그 권의 제목·권수·URL을 정확히 결속하면 충분하며 1권으로 교체하지 않는다. 기존 ISBN과 권수의 연결이 틀렸다면 새 수집 revision과 배치 summary에 정정 근거·경로·SHA를 남기고 다음 동결에 반영한다. 과거 원문·동결·판정은 보존한다.

## 2026-09-21 현재 배치: Art 작업 전면 제외

사용자 지시로 이번 수집·승격 작업에서 Art 4축(`artRealism`, `artDensity`, `visualSoftness`, `motionImpact`)은 조사·판정 대상에서 제외한다. Art용 이미지 확인, 리뷰 근거 평가, 독립 출처/정족수 확인, 추가 검색, 신규 known claim을 수행하지 않는다. 기존 원문에 Art 서술이 있어도 별도 분석하지 않는다. 스키마가 요구하는 새 Art 축 표기는 `unknown`으로 유지하고 이번 범위 제외임을 기록한다. 기존 accepted prior·동결 입력·판정은 보존만 하며 변경하지 않는다. Art gap은 추가 수집 목록·재시도 조건·승격 차단·미완료 사유에 넣지 않는다. 이미 완료된 유효 결과는 이 지시만으로 재판정하지 않는다. 향후 Art 작업은 별도 사용자 요청 때 진행한다.

## 2026-09-21 사용자 확정: 포르노 작품만 제외

Catalog의 성적 콘텐츠 제외 기준은 **porn / non-porn**이다. 성인등급, 폭력·출혈·잔혹 묘사, 노출·성적 장면의 존재 자체는 제외 사유가 아니다. 『베르세르크』처럼 성인등급인 비포르노 서사 만화는 허용한다. 작품의 주된 성격이 포르노인지 확인하며 별도의 비성인·일반 독자 등급 증명 수집은 요구하지 않는다. 해당 작품의 출판사·레이블 분류로 비포르노임이 확인되면 충분하며 그 확인으로 종료한다. 여러 레이블을 가진 출판사는 해당 작품의 레이블만 확인한다. 성적 소재·노출·성적 장면은 작품적 표현으로 허용하며, 에피소드별 표현 강도·무해성·전연령 적합성을 추가 조사하거나 미확인 gap/HOLD 사유로 삼지 않는다. 실제 포르노 분류 충돌이나 작품/레이블 식별 불가가 있을 때만 그 분류를 좁게 확인한다. 추천 선정 맥락과 팩터 근거는 별도 계약이다.

새 판정은 `non-pornographic-work` → `non-porn` / `SAFE`, `pornographic-work` → `porn` / `BLOCKED_SAFETY` (`SAFETY_PORNOGRAPHIC_WORK`)를 사용한다. 판단 불명은 `classification-unresolved`로 보존한다. SAFE는 아동 적합성이나 무폭력 인증이 아니다. 기존 `non-adult` 등 분류는 과거 artifact 호환용으로 유지하며 성인등급만으로 차단한 HOLD는 새 계약을 동결한 revision에서 재검토한다. 과거 frozen·판정은 수정하지 않는다.

현재 목표는 **이 오케스트레이터 세션의 GPT-5.6 Sol / high 조정 + 루나1~6 고정 세션 + 신규 50작품 단위 배정·확인**이다. [배치 계획](../../../docs/catalog-expansion/01c-sol-batch-promotion-plan.md)의 현재 상태와 선행 구현을 먼저 확인한다. 문서 변경은 큐 재개가 아니며, 구현된 runner `prepare/check`와 notification_guard `register-batch`를 사용하고 [명령 계약](../../../scripts/catalog_authoring/README.md)을 따른다. 기존 Luna 운영은 [과거 운영 기록](../../../docs/catalog-expansion/01a-promotion-method-operational-amendment.md)에 보존한다.

## 배치 단계 순서 — 2026-09-21 사용자 정정

**한 세션의 현재 배치 전체 수집·gap 보완을 먼저 끝낸 뒤 판정 단계로 전환한다.** 작품마다 수집→판정을 교차하지 않는다. 수집 단계에서는 독립 URL 요청과 읽기 전용 검사를 안전하게 묶고, 공통 선정/추천 원문은 한 번 저장한 자료를 작품별 실제 연결 근거와 함께 재사용한다. 원문·scope·출처 독립성 검사는 생략하지 않는다. 수집 완료는 URL 확보만이 아니라 판정에 필요한 자료 확인 또는 출처 소진에 따른 INSUFFICIENT의 기록이다. PASS 목표치를 강제하지 않는다.

수집 배치 완료·저장/백업 보고 후 부모의 판정 전환 신호를 받는다. 판정 단계에서는 한 작품의 frozen 입력만 읽고 prepare/check를 연속 수행하며 정상 작품마다 부모와 왕복하지 않는다. 기존 유효 판정은 재사용한다. 배정된 판정 전건 완료 후 조정자가 배치 확인·직렬 승격한다. 다른 세션의 단계 완료를 기다리지는 않는다. 이전의 ‘수집된 작품부터 곧바로 판정’ 지시는 폐기됐다.

## 배정

- 2026-09-23: 새 수집 배정 전달 전에 기존 dispatch에 `plan_dispatch.py`를 실행한다([명령](../../../scripts/catalog_authoring/README.md)). eligible·Gold/human/authorizedModelPanel 보호·AEP prior 복구·registry 정정을 먼저 분류한다. 복합 문제와 NOT_ASSESSED를 보존하며 미확인을 fresh/검증 완료로 간주하지 않는다. SHA 결속된 유효 배치 요약의 READY만 재사용 대상으로 삼고 mtime/file count로 현재 attempt를 추정하지 않는다. 실행 중인 기존 배정은 이 조회 결과만으로 바꾸지 않는다.

2026-09-24 사용자 변경: 루나1~~6의 신규 턴 설정은 `gpt-6-luna` / `xhigh`다. 루나4의 이전 `max` 지시는 최신 사용자 지시로 대체됐다. 루나1~~6 대상 `send_message_to_thread`마다 model/thinking을 명시하고 과거 동결 판정의 모델 기록은 변경하지 않는다.

- 사용자 지정 루나1~~6 고정 채팅을 배치 계획 §3의 세션별 모델·추론 설정으로 사용한다. **현재 여섯 ID는 배치 계획 §3 표 하나에서만 읽는다.** 옛 솔1~~3과 루나4~6은 각각 같은 ID다. 과거 Luna 방을 자동 전용하거나 ID를 이름으로 추정하지 않는다. 확인할 수 없는 방은 실제 오류와 함께 새 ID 또는 생성 허가를 사용자에게 요청한다. 별도 모델·서브에이전트·일회성 CLI·앱 채팅의 CLI resume로 대체하지 않는다.
- 최신 canonical/candidate·registry·기존 배정·완료 결과를 한 번 대조한다. eligible·유효 미발행 PASS·타 세션 담당 작품을 새 판정에서 제외한다. HOLD는 구체적 새 수집 가능성이나 확인된 오류로 분류하고 같은 입력을 반복 판정하지 않는다.
- 신규 배정에서는 50개씩 겹치지 않는 목록을 만들고 자료 충분/추가 수집/gap 유형을 가용한 루나1~6 방에 고르게 배분한다. 50은 신규 작업 목록 크기이며 PASS 목표가 아니다. 마지막 작은 묶음도 배정한다.
- 배치 ID·owner/parent·기준 pair/계약 SHA와 각 작품의 brief·prior/HOLD·원문/receipt·리드·출력 경로를 결속한다. 스킬과 목록 경로를 보내고 배치 전체 raw를 프롬프트에 넣지 않는다. 한 세션은 한 작품씩 처리하며 배정 목록 안에서는 다음 작품을 자율 진행한다.
- 필요한 경우 작업자가 독립적인 작품·출처 조사를 서브에이전트에 나누도록 허용한다. 작품·출처·반환 근거를 분리하고 같은 작품 결속·최종 판정은 고정 세션이 맡는다. 공유 DB·registry·STATE·발행 변경은 서브에이전트에 병렬 위임하지 않는다.
- 저장된 유효 원문을 최우선 사용한다. 추가 검색 횟수 상한은 두지 않는다. [수집 지침](../../../docs/catalog-expansion/factor-collector-instructions.md)의 gap 해결·새 정보·출처 소진 종료 기준을 적용한다. 정상 수집→동결→판정마다 부모 응답을 요구하지 않는다.

## 배치 완료·예외 수신

- 작업자가 부모 ID `01a0a3b8-5162-78f0-ac39-4e17f730a70a`에 보고할 때의 `send_message_to_thread` 인자는 `model="gpt-5.6-sol"`, `thinking="high"`다. 받은 보고의 모델 인자를 확인하고 루나 설정으로 부모를 재개시키지 않는다. 부모가 루나1~6에 배정·재개를 보낼 때만 `gpt-6-luna` / `xhigh`를 사용한다.
- 중간 보고 수신은 실행 지속의 증거가 아니다. 보고를 처리할 때 해당 세션의 실제 active/idle 상태를 확인한다. 미완료 배정이 idle이고 사용자 중단·쿼터·해결되지 않은 장애가 없다면 checkpoint에서 재개 메시지를 보내고 active 전환까지 확인한다. `CATALOG_PARTIAL_STOP`은 완료로 집계하지 않고 재개 처리 대상으로 삼는다. 작업자의 “진행 중” 문구만으로 계속 실행 중이라고 보고하지 않는다.
- 배치 통지와 작품별 checkpoint를 코드로 대조한다. 배정 수 = READY + HOLD + ERROR, 경로·SHA·입력 버전·소유권·저장/백업 receipt를 확인한다. 결과 누락·중복을 완료로 처리하지 않는다. READY는 아직 발행이 아니다.
- 정상 요약은 배치당 한 번 소비한다. 공통 결함·쿼터/중단·통지 실패는 중간 보고 대상으로 삼는다. 상태 질문·타이머 automation·정기 모델 폴링을 추가하지 않는다. 필요할 때 기존 wait_threads와 artifact readback을 사용한다.
- notification_guard의 register-batch는 dispatch phase에 맞춰 검사한다. collection-only summary는 전체 Work 집합·상태·원문/user-source/research/receipt SHA·workspace/backup receipt를 확인하고 `checkedPath`를 요구하지 않는다. adjudication summary는 작품별 CHECKED·sealed result·백업 receipt를 확인한다. 부모의 새 active turn에서 `notification_guard.py drain --parent <ID>`로 미소비 이벤트를 확인한다. `handlingRecorded=true`이면 저장된 처리 결정을 먼저 읽고, 발행은 `STATE.publicationBatches`를 먼저 대조해 이미 발생한 효과를 반복하지 않는다. 실제 처리 또는 인계 결정을 기록한 뒤 `consume --parent <ID> --event <eventId> --effect <처리 JSON>`으로 ACK한다. 발행 subset은 처리 JSON의 `publications`에 실제 summary path/SHA로 결속한다. 일부만 발행하면 `partially-published`로 남겨 READY 잔여를 표시하고, 전부 확인된 뒤 `published`로 소비한다. sourceSummary 체인·적용 Work 집합·완료 receipt를 생략하지 않는다. drain은 등록 runRoot의 유실 인덱스를 복구한다. 전송 ACK·consumed·published는 별개다. 이벤트만으로 중단 큐를 재개하지 않으며 부모가 idle인 동안 즉시 처리된다고 주장하지 않는다. [명령 계약](../../../scripts/catalog_authoring/README.md)을 따른다.
- 매 작품 정상 원문을 재검토하지 않는다. 첫 배치군의 작은 PASS/HOLD 표본과 구체적인 의미 충돌만 [계획 §7](../../../docs/catalog-expansion/01c-sol-batch-promotion-plan.md)에 따라 확인한다. PASS율만으로 품질을 인증하거나 HOLD를 오류로 분류하지 않는다.

## 승격

- 완료 보고를 받으면 긴 HOLD 의미 감사에 앞서 READY의 현재 발행 사전검사 또는 명시적 차단 기록을 처리한다. `catalog_authoring_batch_publish.py --preflight-only`는 현재 입력·결과·코드·candidate/registry SHA에 결속된 작품별 결과와 `PASS-SUBSET.json`을 저장·백업한다. 알려진 작품별 prior/registry 충돌만 격리하고, 공통·미분류 오류가 있으면 subset을 만들지 않는다. 생성된 subset을 별도의 `--batch-root`로 발행한다. 기존 실패 메시지나 mtime으로 현재 상태를 대신하지 않는다. 같은 SHA 조합의 검사는 영수증을 재사용하고 실제 누적 발행 검사는 유지한다.
- `BATCH-FINISHED.json`은 readback 단계 영수증이며 최종 완료 표지가 아니다. 후보 백업·STATE 반영·STATE 백업 후 `BATCH-COMPLETED.json`과 저장/백업 성공을 확인해 소비한다. `STATE.publicationBatches`로 같은 summary 재수신을 확인하며, 후속 current가 생겨도 과거 후보를 다시 적용하지 않는다. 잠금·백업 실패 후에는 동일 summary와 batch root로 재개한다. 옛 receipt가 있지만 current가 다른 계보로 진행됐고 완료 결속을 확인할 수 없으면 재발행 대신 그 경계만 복구한다. 미완료 배치의 부분 발행·사용자 중단 해제는 이 변경에 포함되지 않는다.
- 2026-09-21 사용자 승인으로 현재 연속 작업에서는 완료 묶음의 DB 반영·커밋·작업 브랜치 푸시를 조정자가 적절한 시점에 수행한다. 중간 테스트·CI/CD는 실행하지 않고 전체 작업 종료 후 최종 검증한다. `[skip ci]` 커밋과 자동 배포 없는 경로를 사용한다. 입력 결속·무결성·잠금·readback·백업은 생략하지 않으며 미검증 상태를 명시한다. 이 승인은 메인 머지·배포까지 확대하지 않는다.
- 한 방의 배치가 끝나면 그 배치부터 확인한다. 다른 두 방의 완료를 기다리지 않는다. 정상 결과는 최신 candidate/registry에 기존 publisher로 직렬 반영한다. 판정/봉인 원본과 frozen 기준을 보존하며 오래된 배치 DB를 통째로 덮어쓰지 않는다. 여러 READY가 모이면 `scripts/catalog_authoring_batch_publish.py`로 누적한다. 이 경로는 모든 READY에 기존 publisher의 `--validate-only`를 먼저 실행해 accepted prior 충돌을 한꺼번에 차단하고, 통과한 뒤 제품 빌드/readback을 묶음당 한 번만 수행한다. 작품별 입력 결속은 유지하되 작품별 전체 저장·백업·빌드를 반복하지 않는다. 발행·readback 백업 후 STATE를 한 번 갱신·백업한다.
- 기존 `run --decisions`는 **검사와 발행을 함께 실행**한다. 이 명령은 조정자의 발행 단계에서만 사용하며 작업자의 비발행 검사로 배정하지 않는다. 일반 배치에서는 `--allow-model`·`--retry-model`·`--model-session`을 사용하지 않는다.
- HOLD/일반 봉인 분기를 유지한다. 완료 결과를 재사용하며 서지·Gold·팩터·safety·coverage·제품 readback·백업을 확인한다. partial publication은 실제 DB와 receipt부터 읽고 재개한다. 다른 유효 결과와 독립인 실패는 격리하되 공통 무결성 실패의 의존 발행은 멈춘다.
- 공유 DB·registry·발행·STATE는 기존 잠금 아래 직렬 처리한다. 원격/모델 대기 동안 잠금을 유지하지 않는다. canonical·GitHub·배포 권한을 확대하지 않는다.
- workspace save는 파일 준비를 writer lock 밖에서 수행하고 신규 blob·snapshot commit만 직렬화한다. 물리 backup rotation은 별도 OS lock으로 직렬화하며 workspace source는 read-only snapshot으로 읽는다. 새 백업이 workspace writer를 장시간 막는 상태를 정상 경합으로 운영하지 않는다.
- 작업자의 현재 배치 판정·CHECKED·요약·백업·완료 통지가 끝나면 다음 비중복 50작품 수집을 배정한다. 부모의 발행·예외 처리는 독립적으로 진행하며 다음 수집을 막지 않는다. 다음 목록을 미리 예약한 경우 작업자는 현재 배치 완료 보고 후 즉시 전환한다. 새 배치도 전체 수집 완료 후 부모의 판정 전환 신호를 받는다. 중단 요청을 우선하고 미완료 배정·결과를 보존한다.

## 보고

작업자와 조정자의 실제 usage 차분, 전체 비중복 경과시간, 추가 수집/수정 비용을 함께 집계한다. 판정 PASS와 실제 VERIFIED·canonical 반영을 분리한다. 캐시율만으로 비용 절감을 주장하지 않고, 미측정 값은 unavailable로 남긴다. 새 지침은 새 배정/입력 revision부터 적용하며 과거 frozen prompt·manifest·판정 이력을 소급 수정하지 않는다.

## 2026-09-23 N/T 예외 입력

추가 조사 후 N/T가 남은 작품은 실제 조사 결과를 새 v4 job의 `narrativeToneExhaustion`으로 결속한다. 필드·허용 값은 [AEP 계약](../../../docs/catalog-expansion/02-authorized-evidence-panel-v1.md)의 `narrative-tone-exhaustion-v1`을 따른다. 추가 조사 기록이 있는 그룹만 예외이며, 다른 차단·unknown·기존 권한 보호는 유지된다. 판정자는 필수 identity/safety/context가 확정됐으면 N/T 부족만으로 disposition=hold를 쓰지 않고 실제 supported claim과 unknown을 제출한다. 조정자는 기존 check→publish→readback을 사용한다. 기존 HOLD·입력은 덮어쓰거나 SHA만 교체하지 않는다. 이 문서 변경으로 정지한 솔1~3을 재개하지 않는다.
