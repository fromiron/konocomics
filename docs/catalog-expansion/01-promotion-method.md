# Catalog 추천 가능 승격 방법론

현재 절차 요약 · 갱신일: 2026-10-01

이 문서는 수집부터 추천 가능 반영까지의 읽기 순서와 완료 조건을 안내한다. 세부 권한·팩터 정의·승격 조건은 [Catalog authoring 권한](../planning/09-catalog-authoring-authority.md), [Factor Dictionary](../factors/factor-dictionary.md), [AEP 계약](02-authorized-evidence-panel-v1.md)을 따른다. 추천 산식과 Gold 150은 변경하지 않는다.

## 1. 현재 실행 흐름

| 단계              | 실행과 산출물                                                                          | 다음 단계 조건                                                         |
| ----------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 대상 선정·배정    | 최신 canonical/candidate·registry·기존 배정·완료 결과를 대조하고 최대 50작품 목록 작성 | eligible·유효 READY·타 작업자 담당 중복 제외, prior/registry 복구 구분 |
| 배치 전체 수집    | 로컬 원문 우선, 정확한 Work·대표 ISBN·선정 URL·research/evidence·receipt 결속          | 실제 자료 확인 또는 출처 소진/오류·재개 조건 기록                      |
| 수집 완료·전환    | 전체 summary 검사·저장·명시적 백업 후 승인 범위에서 판정 전환                          | 수집 전용은 종료; 판정 허용 범위 확인                                  |
| 작품별 동결·판정  | `prepare` 후 해당 frozen 입력·원문·schema에서 실제 의미 판정 작성                      | 같은 Work 근거만 사용, unknown·prior·HOLD 보존                         |
| 비발행 검사       | `check --decisions`로 봉인/HOLD 검사, CHECKED·저장 receipt와 배치 summary/백업         | READY/HOLD/ERROR 전건 설명; READY는 아직 추천 반영이 아님              |
| 직렬 후보 발행    | 조정자가 완료 배치를 검증하고 기존 batch publisher로 최신 candidate/registry에 적용    | 권한·Gold·서지·팩터·safety·coverage·제품 readback·STATE·백업 확인      |
| 정식 Catalog 반영 | 승인 대상에 `--apply-canonical`, 정식 DB와 생성 JSON의 별도 readback·백업              | `CANONICAL-COMPLETED.json`으로 실제 앱 데이터 반영 확인                |

작품마다 수집과 판정을 교차하지 않는다. 공유 DB·registry·STATE·발행은 기존 잠금 아래 직렬 처리한다. 대상·단계·책임의 상세는 [배치 계약](01c-catalog-batch-promotion-plan.md), 정확한 명령과 구현 한계는 [runner README](../../scripts/catalog_authoring/README.md)를 따른다. GitHub 발행·배포는 위 상태와 별도다.

## 2. 근거와 판정 조건

- 대표 ISBN과 해당 판본을 정확히 확인하며 중간 권을 1권으로 교체하거나 전권·완결권 독해를 요구하지 않는다.
- 신규 Art 4축은 현재 수집·판정에서 제외하고 `unknown`으로 둔다. 기존 accepted prior는 보존한다.
- 안전 분류는 출판사·해당 레이블에 근거한 porn/non-porn이다. 성인등급·성적 소재·표현강도 미확인은 단독 HOLD 사유가 아니다.
- 정확한 registry 선정 URL의 작품 언급과 같은 Work의 research/evidence를 결속한다. 선정 사실·별점·순위만으로 팩터를 추론하지 않는다.
- Genre·Theme와 Narrative·Tone의 기본 coverage는 AEP 계약을 따른다. 실제 추가 조사·출처 소진이 결속된 N/T 그룹에만 예외를 적용하고 해당 축은 `unknown`으로 유지한다.
- 새 known claim은 동결된 적격 근거와 Dictionary 기준에서 도출한다. 자동 평균·다수결·판정 템플릿·모델명은 권한이 아니다. `reviewedByHuman=false`를 유지한다.

수집 범위·출처 적격성·종료 기준은 [수집 지침](factor-collector-instructions.md)과 [리드 규격](user-source-leads.md)에 있다. 새 근거·정정은 새 입력 revision으로 만들며 과거 frozen·판정 SHA를 바꾸지 않는다.

## 3. 실행자와 이력

특정 모델·추론 강도·고정 세션 이름/ID·세션 수를 요구하지 않는다. 같은 실행자가 단계별 책임을 맡거나 독립 작업을 서브에이전트에 나눠 배정할 수 있다. 역할·실제 owner/parent·실행 추적은 [배치 계약 §3](01c-catalog-batch-promotion-plan.md#3-역할과-실행-추적)을 따른다. 모델 지정 해제는 누락된 판정을 추가 모델 호출로 자동 보충하거나 중단된 큐를 재개하는 지시가 아니다.

과거 `promotion-evidence-v3`의 복수 Pass·Art 선택 경로·모델별 정족수는 현재 신규 배치 지시가 아니다. 당시 방법론은 Git 이력, 모델 전환 시험은 [종료된 시험 기록](01b-model-transition-trial-history.md), 실제 수치·실패·판정 이력은 해당 보존 artifact에서 확인한다. 과거 결과를 새 모델이 수행한 것으로 재기록하지 않는다.

## 4. 완료와 예외

수집 완료, READY, 후보 VERIFIED, canonical 반영을 구분한다. 추천 가능 반영 완료는 실제 정식 DB·생성 JSON·제품 readback과 백업으로 확인한다. HOLD/ERROR는 구체적 원인과 재개 조건을 보존하며 정상 결과에 합산하지 않는다. 충돌·구형 통지·중단 복구는 [운영 예외 처리](01a-promotion-method-operational-amendment.md), 저장·복원·세대는 [저장 계약](03-local-authoring-storage.md)을 따른다.
