---
name: catalog-worker
description: konocomics의 고정 작업 세션에서 배정된 작품 목록을 로컬 자료 우선으로 수집·동결·판정·비발행 검사하고 배치 완료를 보고할 때 사용한다.
---

# Catalog 작업자

## 현재 계약

- [배치 계약 §3](../../../docs/catalog-expansion/01c-sol-batch-promotion-plan.md#3-역할과-세션)에서 고정 세션 ID·모델·추론·수신자별 메시지 설정을 읽는다. 신규 50작품 목록을 사용하며 기존 100작품 배정·진행 중 턴·과거 판정은 보존한다. 이름·이전 설정에서 모델을 추정하지 않는다.
- [수집 지침](../../../docs/catalog-expansion/factor-collector-instructions.md)과 [사전 리드 JSON·자료 적격성](../../../docs/catalog-expansion/user-source-leads.md)을 따른다. 현재 대표판을 1권으로 바꾸지 않으며 전권 확인을 요구하지 않는다. 신규 Art는 제외하고 safety는 porn/non-porn으로 판단한다.
- [저장 계약](../../../docs/catalog-expansion/03-local-authoring-storage.md)에 따라 원문·판정·checkpoint를 즉시 PERSISTED로 보존하고 수집/판정/발행 완료·종료/부분 중단 경계에서 실제 BACKED_UP을 확인한다. 내부 명령마다 물리 백업하지 않는다. compact 발행의 기본 pair checkpoint는 50작품이다. prior authority 검증은 유지한다. 원본 SHA·generation/revision을 보존하며 상태 문자열로 실제 백업을 대신하지 않는다.
- [runner 명령 계약](../../../scripts/catalog_authoring/README.md)을 사용한다. 작업자는 prepare/check, 조정자는 발행을 담당한다. 일반 배치에 CLI 모델·판정용 서브에이전트를 사용하지 않는다. 문서 갱신만으로 중단된 큐를 재개하지 않는다.

## 배치 단계 순서

**한 세션의 현재 배치 전체 수집·gap 보완을 먼저 끝낸 뒤 판정 단계로 전환한다.** 작품마다 수집→판정을 교차하지 않는다. 수집 단계에서는 독립 URL 요청과 읽기 전용 검사를 안전하게 묶고, 공통 선정/추천 원문은 한 번 저장한 자료를 작품별 실제 연결 근거와 함께 재사용한다. 원문·scope·출처 독립성 검사는 생략하지 않는다. 수집 완료는 URL 확보만이 아니라 판정에 필요한 자료 확인 또는 출처 소진에 따른 INSUFFICIENT의 기록이다. PASS 목표치를 강제하지 않는다.

`planningRequirements`에 `prior-recovery`가 있어도 수집 면제가 아니다. dispatch의 해당 `collectionOutput`에 user-source·기존 원문·필요 보완을 검증한 새 수집 결과를 만들고, 다른 작품과 함께 collection summary 전건에 포함한다. prior recovery map과 `--prior-bundle`은 이후 판정 freeze에서 accepted claim을 보존하는 결속이며 빈 collection 폴더나 수집 결과의 합성을 허용하지 않는다.

수집 배치 완료·검증·백업·통지 후 dispatch 정책으로 전환한다. 새 일반 배정의 `phase="collection"`, `transitionPolicy="auto-after-collection"`은 기존 `transition-collection` 명령이 현재 turn·generation·중단 상태·실제 완료 receipt를 확인한 뒤 같은 세션에서 판정으로 전환한다. 명시적 `collection-only`와 정책이 없는 기존 배정은 부모 신호를 기다린다. 판정 dispatch는 원 summary path/SHA와 collection ERROR를 보존하고 오류 작품을 제외한다. 공통 오류·전건 오류·사용자 중단이면 자동 전환하지 않는다. 판정 단계에서는 작품별 frozen 입력만 읽고 prepare/check를 연속 수행하며 정상 작품마다 부모와 왕복하지 않는다. 기존 유효 판정은 재사용한다. 조정자는 판정 배치 완료 후 확인·직렬 승격하며 다른 세션의 완료를 기다리지 않는다.

## 시작·재개

- 배치/작품 ID, 본인 threadId·부모 ID, 기준·입출력 경로를 확인한다. 불일치는 부모에 보고한다. 계약·스킬은 세션 시작 때 읽고 버전 변경 시 갱신한다.
- 조사에 필요한 독립적인 작품·출처가 있으면 서브에이전트에 겹치지 않는 범위와 반환 근거·URL을 지정할 수 있다. 같은 작품의 근거 결속과 최종 판정은 이 세션이 맡고, 공유 DB·registry·STATE·발행 변경은 병렬 위임하지 않는다.
- 배정 인덱스와 현재 작품의 brief·research/prior/HOLD·receipt만 읽는다. 전체 STATE·과거 채팅·전체 후보 DB를 작품마다 재탐색하지 않는다. 완료된 결과는 해시 확인 후 재사용한다.
- 물리 작업 자료가 없으면 [저장 계약 R1~R9](../../../docs/catalog-expansion/03-local-authoring-storage.md#db-중심-복구-요구사항)에 따라 기본 `restore`로 workspace DB를 복구한 뒤 기존 runner에 명시 run/Work를 전달한다. 해당 명령이 필요한 자료만 추출하며 미추출 파일은 삭제가 아니다. 과거 전체 폴더 재생성을 선행하지 않는다. generation·turn·중단 상태를 보존하고 과거 판정을 다시 만들지 않는다.
- 현재 판정은 완료 여부를 포함해 Work별 최신 유효 판정으로 확인한다. 최신 READY가 완료됐다는 이유로 이전 HOLD나 READY를 재개하지 않으며 READY/HOLD를 상태별로 따로 보존·재개할 대상으로 고르지 않는다. 실제 미완료 summary가 특정 CHECKED/SHA를 요구하는 경우만 그 정확한 과거 의존을 유지한다.
- 현재 배치 단계 안에서 다음 작품은 저장된 결과/checkpoint를 남긴 뒤 자율 진행한다. 목록 밖 작품이나 다른 세션의 작업을 가져오지 않는다. 중단·문맥 압축 후에는 checkpoint와 현재 frozen 입력 경계를 확인한다.

## 수집·동결

- 원문 결속: 새 run의 direct research collection은 Work/session·research SHA·raw receipt SHA/bytes 검증 후 자동 동결한다. 추가 완성 collection은 `--provenance-root`를 반복 지정한다. `MODEL-INPUT.json.inputAccess`·source별 `rawLookupPaths`를 확인하고 이미 확보한 raw가 빠졌다면 판정 전에 결속을 고친다. `NEEDS_PROVENANCE_BINDING`은 준비 오류이지 내용 HOLD가 아니다. observations-only 자료도 유효할 수 있으므로 raw 부재만으로 탈락시키지 않는다. 새 원문/registry/recovery는 새 run에 넣으며 과거 frozen·PREPARED·판정 SHA를 수정하지 않는다.

- [수집 지침](../../../docs/catalog-expansion/factor-collector-instructions.md)을 따른다. 기존 유효 raw·research·receipt를 먼저 재사용하고 `.workspace/user-sources/<workId>.json`의 제공 URL을 다음으로 확인한다. points는 원문 근거가 아니다.
- 새 freeze에 정식 리드 루트를 전달해도 현재 Work의 JSON만 결속한다. 여러 작품의 사용자 원본 폴더를 통째로 `--provenance-root`로 복사하지 않는다. session 없는 PDF·메모·raw 파일은 `collect_factor_evidence.mjs start <assigned-dir> <workId> --input <정확한-파일>`의 반복 옵션으로 해당 Work collection에 결속한 뒤 기존 research 작성과 `prepare --provenance-root <collection>`을 사용한다. 필요한 파일이 선택되지 않은 `NEEDS_PROVENANCE_BINDING`은 준비 오류이며 내용 HOLD가 아니다. 원문 의미·실제 독해·HTTP 사실은 이 파일 결속이 대신하지 않는다.
- 추가 검색은 횟수 상한 대신 실제 gap과 새 정보로 판단한다. 구체적 gap을 해결할 새 출처·관찰이 나오면 계속하고, 충분하면 종료한다. 같은 내용만 반복되거나 관련 접근 경로를 소진하면 HOLD 사유·재개 조건을 남긴다. Art·전권·더 좋은 리뷰·known 축 최대화를 위해 연장하지 않는다.
- 추천 맥락에 필요한 registry `supportEvidenceUrls`의 작품 선정/추천 원문도 수집·결속한다. v3의 `contextEvidenceId=null`은 의도된 미판정 상태다. schema context ID가 빈 문자열뿐이면 채택 가능한 support URL 원문이 빠졌는지 확인하고 새 research/run revision을 만든다. 스키마를 완화하거나 ID를 임의로 채우지 않는다. 낡은 registry URL로 연결할 수 없으면 정확한 gap을 보고한다.
- 같은 리뷰·수상/선정 URL은 작품별 실제 언급과 범위를 확인해 재사용한다. URL과 `evidenceId`를 동일시하지 않는다. 기존 ID는 저장된 Work·source·추천 문맥 결속이 완전히 같을 때만 재사용한다. 같은 URL이라도 새 결속이나 기존 선정 provenance와 충돌하면 새 source ID를 새 입력 revision에 넣고 과거 행·frozen·CHECKED를 보존한다. [AEP 계약](../../../docs/catalog-expansion/02-authorized-evidence-panel-v1.md)의 근거 ID 규칙을 따른다.
- Work·ISBN·판본·리뷰 독립성·실제 읽은 범위를 확인한다. 대표판이 6권이면 조용히 1권으로 바꾸지 않는다. 원문·관찰·출판사 소개·서지 receipt를 기존 collector helper로 보존한다. 비밀키·유료 서비스·인증/차단 우회는 조사 수단으로 추가하지 않는다.
- 새 유효 원문·gap은 즉시 영구 저장한다. 수집 배치 완료의 검증·백업·통지와 dispatch 정책에 따른 전환 후 같은 세션이 기존 준비 helper로 동결한다. 시스템 오류는 실제 실패 artifact·재개 조건을 가진 `ERROR`로 남기며 `INSUFFICIENT`·조사 소진으로 바꾸지 않는다. 동결 전 수치 판정이나 공유 DB 수동 수정은 하지 않는다. 수집 중 정상 작품마다 부모의 응답을 기다리지 않는다.

## 수집 반복 비용 줄이기

- 수정 research가 기존 관찰을 재사용하면 새 revision 폴더뿐 아니라 원래 원문·receipt가 있는 같은 Work collection도 `prepare --provenance-root <original> --provenance-root <revision>`으로 전달한다. 기존 research와 충돌하는 관찰을 다시 합치려는 것이 아니다. 기존 binder가 각 collection의 Work·research·receipt·raw SHA를 확인하고 `RUN.provenanceBindings`와 frozen `provenance-bindings.json`에 보존한다. 준비 후 필요한 원문이 두 경로에서 결속됐는지 확인한다. 상위 배치 폴더 전체를 복사하거나 원문 없는 과거 observations-only를 일괄 HOLD로 바꾸지 않는다.
- 배치 COLLECTION-CONTEXT.json이 있으면 dispatch/registry SHA를 확인한 뒤 작품별 support URL union을 조회한다. 원 registry 행을 보존한 수집 리드이며 근거 채택을 대신하지 않는다.
- 제공 URL과 support URL은 중복 제거해 함께 요청하고 공통 raw/receipt를 재사용한다. 작품별 실제 연결·독립성·scope는 각각 확인한다.
- 큰 HTML은 필요한 제목/본문/작품명 주변부터 읽는다. 한 줄 HTML에는 줄 수 제한만 적용하지 말고 문자 주변 구간이나 기존 reading helper를 사용한다. 부분 발췌를 전수 독해로 표시하지 않는다.
- 요약 observation에 필수 항목이 없다는 이유만으로 원문 근거 부재를 선언하지 않는다. 추가 검색이나 identity HOLD 전에 저장된 raw/receipt에서 제목·저자·ISBN 등 해당 gap을 확인한다. 기존 원문에 사실이 있으면 정확한 관찰·receipt 연결을 새 research revision에 저장하고 단계 백업·전환 후 새 run으로 동결한다. 이전 frozen을 수정하거나 미결속 raw를 기존 판정에 섞지 않는다.
- `collect_factor_evidence.mjs write <collection-dir> draft.mjs`의 draft는 collection 기준 경로다. scopeAliases/권 범위 형식을 확인하되 실제 읽은 범위를 기준으로 선택하고 타 작품 값을 무조건 복사하지 않는다.
- validator receipt가 동일 bytes의 영구 저장을 증명하면 collection 전체의 중복 save를 생략한다. 단계 완료에는 별도로 실제 BACKED_UP을 확인한다. mtime만으로 동일성을 판단하지 않는다. 이후 새 REPORT/progress/summary와 외부 raw는 별도 저장하며 필수 검사·백업은 유지한다.

## 판정·비발행 검사

- 출처에 내부 enum `non-pornographic-work` 또는 “비포르노”라는 문장이 그대로 있어야 하는 것은 아니다. 작품에 결속된 출판사·레이블·카테고리의 실제 분류로 판단한다. 예를 들어 공식 페이지의 해당 작품 `ベツコミ / フラワーコミックス` 분류를 사용할 수 있으며, 출판사 이름만으로 모든 작품을 일괄 SAFE 처리하지 않는다.
- 기존 accepted prior 보존은 비어 있는 Genre·Theme 등의 신규 판정을 금지하지 않는다. 기존 값을 유지하면서 적격 관찰로 빠진 factKey를 좁게 추가한다. 한 권 상품 페이지에 전체 작품 리뷰가 섞여 있어도 페이지 전체를 제외하지 않고 개별 리뷰의 실제 범위·관찰·독립성을 판단한다. 동급생·연애라는 단어만으로 school·foundFamily 등 사전의 다른 Theme를 만들어내지는 않는다.
- 수집 요청·파일 검사·저장은 배치화할 수 있지만 의미 판정은 작품별 frozen 근거를 직접 읽어 수행한다. 반복문/기본값/문자열 탐지로 동일 HOLD·unknown·PASS를 대량 생성해 판정을 대신하지 않는다. 파일 수·validator PASS는 실제 의미 판정 완료가 아니다. 진짜 HOLD는 그 작품의 확인한 근거·구체적 부족·재개 조건을 남긴다.
- collection의 `readAudit=partial-body`나 제목·meta 관찰은 판정의 독해 범위가 아니다. frozen `rawLookupPaths`에 같은 Work의 실제 소개·리뷰 본문이 있으면 관련 구간을 직접 읽고 작품별 지원 축을 판정한다. 완전한 17축 known을 요구하지 않으며 Art는 제외한다. 완료 요약에서 여러 작품의 HOLD 사유가 동일하면 저장된 원문과 판정 3건을 감사하고, 원문을 읽지 않은 일괄 HOLD는 새 revision으로 복구한다.
- `N/T-only`는 남은 blocker 집합이 `NARRATIVE_COVERAGE_INCOMPLETE`와 `TONE_COVERAGE_INCOMPLETE`의 부분집합인 상태다. 두 blocker가 동시에 있어도 N/T-only이며, Theme·추천 문맥 등 다른 blocker가 하나라도 있으면 아니다. 실제 추가 조사와 출처 소진을 `narrativeToneExhaustion`에 결속한 새 입력에서만 예외를 적용한다.
- N/T-only에 기존 소진 기록이 없으면 그 부재를 최종 HOLD 사유로 삼지 않는다. 해당 Work의 부족한 축을 대상으로 추가 출처를 실제 조사하고, 찾은 근거를 판정하거나 출처 소진 시도·결과를 새 수집/v4 job revision에 기록해 재동결·검사한다. 진행을 막는 외부 장애가 있으면 그 Work만 부분 중단하고 기존 결과를 보존한다.

- 해당 PROMPT.md·schema.json·FROZEN_INPUT_ROOT·명시적으로 결속된 prior만 사용한다. 사전은 frozen read view에서 읽는다. 수집 대화의 기억·live 사전·추가 검색을 동결 근거로 사용하지 않는다.
- 신규 비Art claim은 적격 관찰→정확한 앵커→실제 범위를 연결한다. unknown 전 관련 관찰을 확인하되 없으면 유지한다. unknown≠0이며 낮은 앵커에 높은 앵커의 반복성·중심성·장기성을 요구하지 않는다. 단어·형식·언급 부재만으로 known/0을 만들지 않는다.
- Art는 이번 배치에서 전면 제외하고 기존 accepted prior는 보존만 한다. confidence는 스키마가 받는 0..1 숫자 문자열이며 low/medium/high를 쓰지 않는다. entryScope는 인용 supplemental evidence의 실제 readingScope에 결속한다. 사유가 같은 축만 unknownGroups로 묶고 별도 중복 원장을 만들지 않는다.
- 판정 파일·SHA를 저장하고 기존 로직을 공유하는 **비발행 check 단계**로 검사한다. 형식·scope 오류는 같은 frozen 입력에서 국소 수정한다. 새 사실이 필요하면 수집 단계의 새 revision을 저장·동결하며 기존 입력·판정은 보존한다. 수치를 합산하거나 validator를 완화하지 않는다.
- 기존 accepted Axis·Theme·Genre의 값과 새 판정이 다르면, 이전 값을 덮어쓰는 대신 그 factKey의 정확한 prior REPLACE/WITHDRAW를 새 job revision에 결속한다. 비발행 check만으로 발행 가능성을 확정하지 않으며, 기존값과 다른 factKey 및 correction 결속을 완료 요약에 남긴다. 충돌이 확인되면 원본·동결·판정을 보존하고 새 revision 또는 HOLD로 보고한다. publisher의 묶음 `--validate-only`는 조정자가 수행한다.
- 이미 AEP 검수된 Work의 과거 v4 job 파일이 없다는 사실만으로 배치를 멈추지 않는다. 부모가 원본 manifest-bound bundle을 지정하고 `load_prior_authority`가 해당 Work의 accepted claim/evidence를 검증했으면, 현재 후보의 Work·대표 판본·원본 evidence와 저장된 새 연구를 결속해 **새 명시적 v4 job revision**을 작성한다. 검증된 priorClaims를 그대로 보존하고 실제 근거 없는 priorDecisions는 만들지 않는다. `--job`·`--prior-bundle`로 prepare/check 하며 freeze가 권한·현재 baseline 의미 결속을 거부한 그 작품만 BLOCKED로 남긴다. `--work-id`로 reviewed prior를 비우지 않는다.
- 배정 계획이 `prior-recovery`인 Work는 기존 known 축을 먼저 원 AEP manifest의 exact claim/source map에 대조한다. 원 판정 run의 빈 `prior-authority.json`, 현재 DB 행, 비-AEP `ev-v4` 메모만으로 priorClaims·REPLACE/WITHDRAW를 만들지 않는다. 충돌 축의 원 권한을 찾지 못하면 새 판정의 READY를 발행 가능으로 보고하지 말고 `PRIOR_AUTHORITY_BUNDLE_MISSING`과 필요한 원본을 기록한다. 근거가 새 값의 정정을 지지하지 않으면 기존값을 보존하고 HOLD로 종료한다.
- 작품별 READY/HOLD/ERROR와 원본·판정·검사·실패·백업 receipt를 기록한다. READY는 승격 성공이 아니다. HOLD도 완료다. 공유 candidate/registry·STATE·canonical을 갱신하거나 직접 publish하지 않는다.
- 정상적인 공유 저장은 파일 준비를 read-only로 수행하고 신규 blob·revision commit만 workspace writer lock으로 직렬화한다. 단계 백업은 별도 OS lock으로 직렬화하고 workspace를 read-only snapshot으로 읽어, 긴 백업이 새 workspace 저장을 막지 않게 한다. 기존 프로세스가 이전 구현으로 실행 중인 전환 구간만 그 프로세스 종료 뒤 재개한다.
- `run --decisions`는 즉시 발행하므로 작업자의 검사 명령으로 사용하지 않는다. 추가 모델 판정을 만드는 `--allow-model`·`--retry-model`·`--model-session`과 별도 CLI 모델은 사용하지 않는다. 독립 조사 서브에이전트는 위 범위에서만 사용할 수 있다.

## 배치 보고·누락 방지

부모 보고의 수신자 ID는 [배치 계약 §3](../../../docs/catalog-expansion/01c-sol-batch-promotion-plan.md#3-역할과-세션)에서 확인한다. 부모에게 보내는 `send_message_to_thread`에서는 `model`과 `thinking`을 모두 생략한다. 두 인자는 수신자인 부모 세션의 설정을 바꾼다.

- 일반 중간 진행은 commentary나 부모 메시지로 보고하고 작업을 이어간다. final을 보내면 실행이 종료되므로 “진행 중”이라는 final로 연속 실행을 대신하지 않는다. 불가피한 부분 종료 시 부모에 `CATALOG_PARTIAL_STOP`과 batchId·완료 수·다음 작품·checkpoint·실제 종료 사유·needsResume를 전송한다. 입력 경로 미확인 등 해결 가능한 부분 중단은 `needsResume=true`다. 사용자 중단이면 needsResume=false이며 자동 재개하지 않는다.
- Catalog 실행 턴에서만 `notification_guard.py arm --session <ID>`로 현재 `UserPromptSubmit.turn_id`에 등록을 결속한다. 회고·보고 전용 턴에는 arm하지 않는다. Stop은 동일 실행 턴의 검증된 새 checkpoint만 한 번 알리며 과거 active 등록으로 작업 재개나 보고를 강제하지 않는다. 사용자 중단·Interrupt 뒤에는 명시적으로 승인된 새 턴에서만 `arm --resume`을 사용한다. 전송 실패는 보존하고 종료하며 모델 판정을 반복하지 않는다.
- 신규 배정 50작품은 목록 크기다. 기존 100작품 배정은 완료 또는 정확한 부분 상태까지 보존한다. 모든 항목이 결과 또는 오류로 기록되면 배치 완료를 알린다. 마지막 작은 묶음도 같은 절차다. 한 작품의 유효 HOLD/개별 오류는 보존하고 다음 독립 작품을 진행한다. 여러 작품에 영향을 주는 공통 결함은 즉시 보고하고 의존 작업을 멈춘다.
- 배치 summary와 작품별 경로·최종 SHA·입력 결속·상태·gap·단계별 시간/usage·백업 receipt를 보존한다. READY 행은 `checkedPath`·`checkedSha256`·`checkStorage`(snapshot/backup)를 포함한다. 발행 도구는 그 SHA로 검증한 CHECKED의 판정·입력 SHA를 읽으므로 `decisionsSha256`·`inputManifestSha256`의 중복 기재는 선택이며 기재 시 일치해야 한다. 필드는 실제 CHECKED와 저장 receipt에서 가져오며 누락된 backup을 문자열로 만들어 채우지 않는다. `CATALOG_BATCH_COMPLETE: batchId=...; summaryPath=...; sha256=...`를 지정 부모에 한 번 전송하고 실제 성공 응답을 확인한다. 사용자 중단·쿼터 종료는 부분 결과로 보고한다.
- 최종 판정 summary의 `sourceSummary`는 이전 **판정** summary에서 결과 행을 그대로 추린 경우에만 쓴다. 수집 summary는 adjudication dispatch의 `collectionSummary`에만 결속한다. 수집→판정 전환이나 HOLD→READY 수정으로 행 내용이 달라졌다면 새 full 판정 summary를 만들고 `sourceSummary`를 생략한다. 완료 등록 전에 notification guard 검사를 통과시킨다.
- 배치 시작 시 notification_guard register-batch를 등록한다. 결과·백업 확인 뒤 `enqueue --session <ID>`로 불변 완료 이벤트를 보존하고 실제 전송 응답을 stdin으로 전달해 `ack --event <eventId> --sha <checkpoint SHA>`한다. 부분/사용자 중단도 같은 event ID로 ACK하며 중단 턴은 재활성화하지 않는다. 부분 중단은 `enqueue --checkpoint <부분 보고 JSON> --kind partial-stop`, 사용자 중단은 `--kind user-stop`으로 기록한다. 필드는 [명령 계약](../../../scripts/catalog_authoring/README.md)을 따른다. 다음 정상 배치 저장에 `notification-events/`와 부모 inbox 인덱스·roots 등록도 포함하며 이벤트마다 별도 전체 백업을 반복하지 않는다. 전송 ACK와 부모 consumed ACK는 별개이고, 통지 실패 때문에 수집·판정을 다시 하지 않는다.
- 자체 응답 분량 판단이나 임의 소량 처리 수를 종료 사유로 삼지 않는다. 문맥 압축 후에는 checkpoint에서 계속한다. 전체 배치 판정·CHECKED·요약·백업·완료 통지를 마치고, 다음 묶음이 예약 배정되어 있으면 부모 발행을 기다리지 않고 새 수집을 시작해 전환을 보고한다. 예약 목록이 없으면 다음 배정을 요청한다. 새 배치도 전체 수집 완료 후 해당 dispatch 정책으로 전환한다. 별도 상태 질문이나 매 작품 COLLECTION_READY/SOL_COMPLETE 왕복을 추가하지 않는다. 기존 단일 작품 등록의 통지 수신은 [운영 예외 처리](../../../docs/catalog-expansion/01a-promotion-method-operational-amendment.md)의 해당 형식을 따른다.

## N/T 예외 입력

N/T 부족 복구 배정은 수집 단계에서 해당 gap의 추가 조사를 실제로 마친 뒤 넘긴다. 충분해졌으면 근거를 결속하고, 부족한 채 출처를 소진했으면 시도·그룹·stopReason을 새 명시적 v4 job에 전달한다. 예외 필드가 없다는 이유로 같은 입력을 다시 판정해 HOLD를 반복하지 않는다. 실제 조사를 아직 하지 않았다면 수집 미완료로 보고하고 그 조사를 먼저 끝낸다.

구 정책 HOLD와 새 정책 HOLD를 구분하고 실제 추가 조사 기록→명시 job→runner job→frozen job을 확인한다. `remainingGaps=[]`, 추천 URL 보완, 원문 파일 수만으로 N/T 조사 소진을 추정하지 않는다. 기존 실제 시도는 재사용하되 조사한 그룹·확인 내용·종료 이유를 연결한다. 필드가 없으면 먼저 작성 누락인지, 실제 조사 미실시인지 구분하며 자동 attempts를 만들지 않는다.

새 collector draft에는 실제 기록이 있을 때만 `narrativeToneExhaustion`과 정확한 `isbn13`을 넣는다. 수집 helper는 이를 research와 분리한 `COLLECTION-HANDOFF.json`에 결속한다. 완료 receipt와 `collection-events.jsonl`에도 예상 sidecar SHA를 남기므로 첫 조립 전 유실도 검출하며 새 v4 입력에 전달한다. job과 수집 기록의 충돌·누락·SHA 불일치는 `INPUT_NEEDS_REPAIR`로 수정한다. `zh` 원문은 실제 언어로 기록한다. source binding 생성은 근거 채택이 아니며 `sourceDecisions.uses` 판정은 그대로 필요하다.

추가 조사 후 N/T가 남은 작품은 실제 조사 결과를 새 v4 job의 `narrativeToneExhaustion`으로 결속한다. 필드·허용 값은 [AEP 계약](../../../docs/catalog-expansion/02-authorized-evidence-panel-v1.md)의 `narrative-tone-exhaustion-v1`을 따른다. 추가 조사 기록이 있는 그룹만 예외이며, 다른 차단·unknown·기존 권한 보호는 유지된다. 판정자는 필수 identity/safety/context가 확정됐으면 N/T 부족만으로 disposition=hold를 쓰지 않고 실제 supported claim과 unknown을 제출한다. 조정자는 기존 check→publish→readback을 사용한다. 기존 HOLD·입력은 덮어쓰거나 SHA만 교체하지 않는다. 이 문서 변경으로 중단된 세션을 재개하지 않는다.
