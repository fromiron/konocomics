---
name: catalog-coordinator
description: konocomics의 작품 묶음을 배정하고 배치 완료·예외 확인과 기존 runner의 직렬 승격을 조정할 때 사용한다.
---

# Catalog 조정자

## 현재 계약

- [배치 계약 §3](../../../docs/catalog-expansion/01c-catalog-batch-promotion-plan.md#3-역할과-실행-추적)의 역할·실행 추적을 따른다. 특정 모델·추론 강도·고정 세션 이름/ID·세션 수는 요구하지 않는다. 실제 담당과 기존 실행 이력은 보존한다. 신규 최대 50작품 목록을 사용하며 기존 100작품 배정·진행 중 턴·과거 판정은 소급 변경하지 않는다.
- [수집 지침](../../../docs/catalog-expansion/factor-collector-instructions.md)과 [사전 리드 JSON·자료 적격성](../../../docs/catalog-expansion/user-source-leads.md)을 따른다. 현재 대표판을 1권으로 바꾸지 않으며 전권 확인을 요구하지 않는다. 신규 Art는 제외하고 safety는 porn/non-porn으로 판단한다.
- [저장 계약](../../../docs/catalog-expansion/03-local-authoring-storage.md)에 따라 원문·판정·checkpoint를 즉시 PERSISTED로 보존하고 수집/판정/발행 완료·종료/부분 중단 경계에서 실제 BACKED_UP을 확인한다. 내부 명령마다 물리 백업하지 않는다. compact 발행의 기본 pair checkpoint는 50작품이다. prior authority 검증은 유지한다. 원본 SHA·generation/revision을 보존하며 상태 문자열로 실제 백업을 대신하지 않는다.
- [runner 명령 계약](../../../scripts/catalog_authoring/README.md)을 사용한다. 작업자는 prepare/check, 조정자는 발행 책임을 뜻하며 같은 실행자가 단계를 나눠 수행할 수 있다. 문서 갱신만으로 중단된 큐를 재개하지 않는다.

## 배치 단계 순서

**현재 배치 전체 수집·gap 보완을 먼저 끝낸 뒤 판정 단계로 전환한다.** 작품마다 수집→판정을 교차하지 않는다. 수집 단계에서는 독립 URL 요청과 읽기 전용 검사를 안전하게 묶고, 공통 선정/추천 원문은 한 번 저장한 자료를 작품별 실제 연결 근거와 함께 재사용한다. 원문·scope·출처 독립성 검사는 생략하지 않는다. 수집 완료는 URL 확보만이 아니라 판정에 필요한 자료 확인 또는 출처 소진에 따른 INSUFFICIENT의 기록이다. PASS 목표치를 강제하지 않는다.

수집 배치 완료·검증·명시적 백업을 확인한 뒤 승인된 판정 단계로 이어간다. 같은 배치에서 반영할 출판사 서지 입력은 정확한 Work·ISBN 검토와 직렬 반영·readback을 먼저 마친 뒤 해당 작품을 동결한다. 동결 후 같은 작품의 canonical 서지가 바뀌면 기존 입력·판정을 보존하고 새 기준으로 동결·판정 결속을 확인하며 rebase 충돌 검사를 우회하지 않는다. 수집 전용 요청은 수집에서 종료한다. 원 수집 summary path/SHA와 개별 ERROR를 보존하고 오류 작품은 판정에서 제외한다. 공통 오류·전건 오류·사용자 중단이면 의존 작업을 진행하지 않는다. 판정 단계는 작품별 frozen 입력으로 prepare/check를 수행하며 유효 판정은 재사용한다. 완료 결과는 실제 summary·receipt로 확인하고 승인 범위에서 직렬 승격한다.

## 배정

- 새 수집 배정 전달 전에 기존 dispatch에 `plan_dispatch.py`를 실행한다([명령](../../../scripts/catalog_authoring/README.md)). eligible·Gold/human/authorizedModelPanel 보호·AEP prior 복구·registry 정정을 먼저 분류한다. 복합 문제와 NOT_ASSESSED를 보존하며 미확인을 fresh/검증 완료로 간주하지 않는다. SHA 결속된 유효 배치 요약의 READY만 재사용 대상으로 삼고 mtime/file count로 현재 attempt를 추정하지 않는다. 실행 중인 기존 배정은 이 조회 결과만으로 바꾸지 않는다.

- 현재 작업 환경의 가용한 실행자에게 배정한다. 과거 고정 ID 표나 모델 설정을 요구하지 않는다. 실제 담당과 결과 경로를 확인하고 기존 배정의 소유권·중단 상태를 임의 변경하지 않는다.
- 최신 canonical/candidate·registry·기존 배정·완료 결과를 한 번 대조한다. 같은 기준 pair의 Catalog와 동일 Work registry 행에서 제목·저자·ISBN·권·판본을 비교하고, 확인된 차이를 brief에 모두 남긴다. eligible·유효 미발행 PASS·타 작업자 담당 작품을 새 판정에서 제외한다. HOLD는 구체적 새 수집 가능성이나 확인된 오류로 분류하고 같은 입력을 반복 판정하지 않는다.
- 복구는 [저장 계약 R1~R9](../../../docs/catalog-expansion/03-local-authoring-storage.md#db-중심-복구-요구사항)를 따른다. 기본 `restore`는 workspace DB와 mapping/report만 만들며, 기존 batch·runner·canonical 명령이 요청 자료를 준비한다. 미추출 파일은 삭제가 아니므로 과거 전체 폴더를 먼저 복원하지 않는다. 완료 summary는 원본 그대로 재전달하고 source/latest completion과 요청한 현재 canonical 효과를 확인한다. 누락·손상과 중단 상태를 합성하지 않는다.
- 최신 유효 판정은 완료 run까지 포함해 Work별로 먼저 고른다. 최신 판정이 완료됐다면 그 completion을 확인하고 과거 HOLD/READY를 다시 현재 미완료로 배정하지 않는다. 상태별 최신을 각각 고르는 방식은 사용하지 않는다. 실제 미완료 summary·기존 pending 처리의 exact CHECKED/SHA 의존은 별도로 보존한다.
- 신규 배정에서는 50개씩 겹치지 않는 목록을 만들고 자료 충분/추가 수집/gap 유형을 가용한 작업자에게 배분한다. 50은 신규 작업 목록 크기이며 PASS 목표가 아니다. 마지막 작은 묶음도 배정한다.
- 배치 ID·실제 담당·기준 pair/계약 SHA·허용된 단계 범위와 각 작품의 brief·prior/HOLD·원문/receipt·리드·출력 경로를 결속한다. 승격까지 허용된 작업과 수집 전용 요청을 구분한다. 스킬·목록 경로와 공통 권한·기준 정보를 전달하고, 작업자는 자기 Work 행·brief를 조회하도록 한다. 배치 전체 dispatch를 반복 출력하거나 전체 raw를 프롬프트에 넣지 않는다. 각 작품은 배정된 담당자가 해당 동결 입력으로 판정하며 독립 작품은 담당 범위와 출력 경로가 겹치지 않게 나눠 진행한다.
- registry의 작품별 `supportEvidenceUrls`는 `registry_source_rows.canonicalWorkId`로 조회한다. `existingCatalogWorkId`는 이 배정의 lookup 키가 아니다. collection context를 만들면 dispatch/registry SHA와 Work 전건의 URL 목록을 대조한 뒤 저장한다. 잘못 만든 context는 덮어쓰지 않고 새 revision으로 정정해 작업자에게 철회를 명시한다.
- prior-recovery도 dispatch에 `collectionOutput`을 포함하고 배치 전체 수집·summary 검증을 거친다. prior recovery map은 판정 시 accepted claim을 보존하는 manifest 결속이며 수집 단계 생략이나 가짜 collection 결과의 근거가 아니다.
- 독립적인 작품·출처 수집·작품별 동결 판정·읽기 전용 검증을 서브에이전트에 나눠 배정한다. 작품·출처·출력 경로·반환 근거를 분리하고 각 작품 담당자가 근거 결속·최종 판정을 책임진다. 공유 DB·registry·STATE·발행 변경은 서브에이전트에 병렬 위임하지 않는다.
- 저장된 유효 원문을 최우선 사용한다. 추가 검색 횟수 상한은 두지 않는다. [수집 지침](../../../docs/catalog-expansion/factor-collector-instructions.md)의 gap 해결·새 정보·출처 소진 종료 기준을 적용한다.
- 배정에는 해당 Work의 정확한 리드 파일·source/receipt 범위를 전달한다. 큰 `.workspace/user-sources/` 또는 여러 작품의 원본 디렉터리 전체를 매 작품 frozen으로 복사하도록 지시하지 않는다. 비정형 원본은 기존 collector의 명시적 파일 입력으로 Work collection에 결속하고 기존 사용자 자료·과거 frozen SHA를 보존한다.

## 배치 완료·예외 확인

- 현재 실행자가 summary와 작품별 checkpoint·CHECKED·저장/백업 receipt를 직접 확인한다. 배정 수 = READY + HOLD + ERROR와 경로·SHA·입력 버전·소유권을 대조한다. READY는 아직 발행이 아니다.
- 중단·쿼터·장애는 실제 checkpoint와 사유로 판단한다. 사용자 중단을 자동 해제하거나 “진행 중” 문구만으로 실제 실행을 주장하지 않는다.
- 발행 전 `STATE.publicationBatches`와 실제 completion/readback을 확인해 이미 발생한 효과를 반복하지 않는다. 과거 미소비 통지를 새 판정·발행 권한으로 취급하지 않는다.
- 정상 원문을 매번 전수 재검토하지 않는다. 초기 작은 PASS/HOLD 표본과 구체적 의미 충돌은 [배치 계약 §7](../../../docs/catalog-expansion/01c-catalog-batch-promotion-plan.md#7-배치-완료와-발행-확인)에 따라 확인한다. PASS율만으로 품질을 인증하거나 HOLD를 오류로 분류하지 않는다.
- 수집 완료 확인에서 담당자가 필수 정체/판본·출판사 분류·정확한 선정 URL의 실제 원문과 Work 결속을 확인했는지 먼저 본다. HTTP 200·raw 파일 존재·구조 검사 PASS·SHA 일치는 실제 가독성과 source별 관찰을 대신하지 않는다. 이후에는 작품별 독해·입력/판정 SHA·검사/저장 receipt를 재사용하고, 정상 결과를 조정자가 다시 전량 독해하거나 과거 이력 전체를 확장한 보고서를 만들지 않는다. 오류·누락·의미 충돌이 있는 범위만 다시 조사한다.
- 같은 완료 배치의 READY는 기존 compact publisher에 모아 전달한다. 정상 작품마다 전체 발행 절차를 반복하지 않는다. 독립 배치의 다음 수집·판정·읽기 전용 검증은 완료 발행과 병렬로 진행하되, 배치 전체 수집/백업 선행 조건과 공유 발행의 직렬 처리는 유지한다.

## 승격

- 완료 보고를 받으면 긴 HOLD 의미 감사에 앞서 READY의 현재 발행 사전검사 또는 명시적 차단 기록을 처리한다. `catalog_authoring_batch_publish.py --preflight-only`는 현재 입력·결과·코드·candidate/registry SHA에 결속된 작품별 결과와 `PASS-SUBSET.json`을 저장·백업한다. 알려진 작품별 prior/registry 충돌만 격리하고, 공통·미분류 오류가 있으면 subset을 만들지 않는다. 생성된 subset을 별도의 `--batch-root`로 발행한다. 기존 실패 메시지나 mtime으로 현재 상태를 대신하지 않는다. 같은 SHA 조합의 검사는 영수증을 재사용하고 실제 누적 발행 검사는 유지한다.
- `BATCH-FINISHED.json`은 readback 단계 영수증이며 최종 완료 표지가 아니다. 후보 백업·STATE 반영·STATE 백업 후 `BATCH-COMPLETED.json`과 저장/백업 성공을 확인해 소비한다. `STATE.publicationBatches`로 같은 summary 재수신을 확인하며, 후속 current가 생겨도 과거 후보를 다시 적용하지 않는다. 잠금·백업 실패 후에는 동일 summary와 batch root로 재개한다. 옛 receipt가 있지만 current가 다른 계보로 진행됐고 완료 결속을 확인할 수 없으면 재발행 대신 그 경계만 복구한다. 부분 발행은 실제 subset과 완료 기록을 결속하며 사용자 중단은 재개 승인 없이 해제하지 않는다.
- 2026-09-21 사용자 승인으로 현재 연속 작업에서는 완료 묶음의 DB 반영·커밋·작업 브랜치 푸시를 조정자가 적절한 시점에 수행한다. 중간 테스트·CI/CD는 실행하지 않고 전체 작업 종료 후 최종 검증한다. `[skip ci]` 커밋과 자동 배포 없는 경로를 사용한다. 입력 결속·무결성·잠금·readback·백업은 생략하지 않으며 미검증 상태를 명시한다. 이 승인은 메인 머지·배포까지 확대하지 않는다.
- 한 배치가 끝나면 그 배치부터 확인한다. 다른 세션의 완료를 기다리지 않는다. 정상 결과는 최신 candidate/registry에 기존 publisher로 직렬 반영한다. 판정/봉인 원본과 frozen 기준을 보존하며 오래된 배치 DB를 통째로 덮어쓰지 않는다. 여러 READY가 모이면 `scripts/catalog_authoring_batch_publish.py`로 누적한다. 기본 compact 경로는 작품별 권한·현재 pair 검사를 거쳐 직렬 적용하고 최종 제품 readback을 한 번 수행한다. 오류가 섞인 완료 묶음은 기존 `--preflight-only`와 검증된 PASS-SUBSET 경로로 확인한다. 작품별 입력 결속은 유지하되 작품별 전체 저장·백업·빌드를 반복하지 않는다. 발행·readback 백업 후 STATE를 한 번 갱신·백업한다.
- 기존 `run --decisions`는 **검사와 발행을 함께 실행**한다. 이 명령은 조정자의 발행 단계에서만 사용하며 작업자의 비발행 검사로 배정하지 않는다. 판정 누락·오류를 `--allow-model`·`--retry-model`·`--model-session`의 추가 호출로 자동 보충하지 않는다.
- HOLD/일반 봉인 분기를 유지한다. 완료 결과를 재사용하며 서지·Gold·팩터·safety·coverage·제품 readback·백업을 확인한다. partial publication은 실제 DB와 receipt부터 읽고 재개한다. 다른 유효 결과와 독립인 실패는 격리하되 공통 무결성 실패의 의존 발행은 멈춘다.
- publisher 독점은 `publication-owner.lock`, 실제 공유 DB·registry·STATE·canonical 교체는 `publication.lock`으로 구분한다. private 준비·검사·빌드·백업은 공유 commit 락 밖에서 수행하고 반영 직전에 기준 identity를 다시 확인한다. metadata·대표판 정정·retention도 같은 공유 변경 규칙을 사용한다. 2026-09-26 승인 대상 배치의 정식 DB·앱 데이터 반영은 `--apply-canonical`로 수행하며 별도 canonical 완료·readback·백업을 확인한다. GitHub·배포 권한은 확대하지 않는다.
- workspace save는 파일 준비를 writer lock 밖에서 수행하고 신규 blob·revision commit만 직렬화한다. 단계 백업은 별도 OS lock으로 직렬화하며 workspace source는 read-only snapshot으로 읽는다. 새 백업이 workspace writer를 장시간 막는 상태를 정상 경합으로 운영하지 않는다.
- 작업자의 현재 배치 판정·CHECKED·요약·백업·완료 기록가 끝나면 다음 비중복 50작품 수집을 배정한다. 발행·예외 처리는 독립적으로 진행하며 다음 수집을 막지 않는다. 다음 목록을 미리 예약한 경우 작업자는 현재 배치 완료 기록 후 다음 수집을 진행한다. 새 배치도 전체 수집을 완료한 뒤 허용된 판정을 수행한다. 중단 요청을 우선하고 미완료 배정·결과를 보존한다.

## 보고

작업자와 조정자의 실제 usage 차분, 전체 비중복 경과시간, 추가 수집/수정 비용을 함께 집계한다. 판정 PASS와 실제 VERIFIED·canonical 반영을 분리한다. 캐시율만으로 비용 절감을 주장하지 않고, 미측정 값은 unavailable로 남긴다. 새 지침은 새 배정/입력 revision부터 적용하며 과거 frozen prompt·manifest·판정 이력을 소급 수정하지 않는다.

## N/T 예외 입력

추가 조사 후 N/T가 남은 작품은 실제 조사 결과를 새 v4 job의 `narrativeToneExhaustion`으로 결속한다. 필드·허용 값은 [AEP 계약](../../../docs/catalog-expansion/02-authorized-evidence-panel-v1.md)의 `narrative-tone-exhaustion-v1`을 따른다. 추가 조사 기록이 있는 그룹만 예외이며, 다른 차단·unknown·기존 권한 보호는 유지된다. 판정자는 필수 identity/safety/context가 확정됐으면 N/T 부족만으로 disposition=hold를 쓰지 않고 실제 supported claim과 unknown을 제출한다. 조정자는 기존 check→publish→readback을 사용한다. 기존 HOLD·입력은 덮어쓰거나 SHA만 교체하지 않는다. 이 문서 변경으로 중단된 세션을 재개하지 않는다.
