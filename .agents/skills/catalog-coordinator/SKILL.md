---
name: catalog-coordinator
description: konocomics 수집·승격의 고정 Luna max 채팅 배정, COLLECTION_READY/SOL_COMPLETE 처리, 기존 runner 후처리와 다음 작품 연결에 사용한다.
---

# Catalog 조정자

현재 역할은 Astra low 조정·루나1~5 고정 작업방의 Luna max 수집/판정이다. [운영 보충](../../../docs/catalog-expansion/01a-promotion-method-operational-amendment.md)의 현재 결정·고정 ID·완료 큐 절차를 읽는다. 2026-09-19 사용자 결정으로 일반 작업은 Luna max를 사용한다. 과거 시험은 재개하지 않는다.

## 배정

- 사전 수집 파일 `.workspace/user-sources/<workId>.json`이 있으면 경로와 SHA를 배정에 결속하고 기존 저장·백업에 원본을 포함한다. 작업자는 제공 URL 검증을 우선하며 추가 검색은 수집 지침의 2026-09-19 규칙으로 제한한다. 자료가 없는 작품도 무제한 조사로 전환하지 말고 구체적 gap과 한정된 배정을 사용한다. 이미 동결된 판정에는 새 리드를 끼워 넣지 않는다.

현재 후보·최신 작품 기록·채팅 상태로 중복 배정과 변경 없는 HOLD를 제외한다. 고정 방당 한 작품만 배정하고 수집→동결 대기 동안 예약을 유지한다. 지정 방이 확인되지 않으면 사용자에게 새 ID 또는 생성 허가를 묻고 다른 정상 방은 계속한다.

`send_message_to_thread`에 고정 ID, `model=gpt-5.6-luna`, `thinking=max`, `$catalog-worker`와 현재 단계의 workId·ISBN·근거/prior/HOLD·출력 경로·부모 ID를 전달한다. 계약 전문을 반복 복사하지 않는다. 실행 전 해당 단계의 통지 감지를 등록한다:

```text
python -X utf8 scripts/catalog_authoring/notification_guard.py register --session <worker-ID> --parent <parent-ID> --work <workId> --phase <collection|adjudication> --artifact <연구-또는-판정-절대경로> --run <runRoot-절대경로>
```

이 등록은 작업 배정 권한이나 결과 검증을 대신하지 않는다. notification 파일은 `data/local/catalog-authoring/notifications/<worker-ID>.json`에 있으며 기존 단계 저장·백업에 함께 포함한다. 이전 단계가 성공 통지됐거나 부모가 실제 완료/실패를 소비했는지 확인한 뒤 필요하면 `notification_guard.py clear --session <worker-ID>`로 감지만 해제한다. 미처리 작업을 덮어쓰지 않는다.

신규 작업방의 첫 배정은 전달 성공만으로 착수로 기록하지 않는다. 시작 통지나 실제 도구 실행을 확인하고, 대기 응답으로 종료했으면 동일 배정을 명시적으로 재전달한다.

## 완료 이벤트 처리

- `COLLECTION_READY`: 배정·경로·SHA 대조 → 기존 helper/runner로 저장·백업·동결 → 같은 Luna 작업방에 frozen prompt/schema/input 전달. 수집 원문을 전수 재검토하지 않는다.
- `SOL_COMPLETE`: 배정·경로·SHA 대조 → 기존 `catalog_authoring_runner.py run --decisions` 경로. 정확한 옵션은 기존 RUN/job와 `--help`에서 확인하며 임의 inline 발행 절차를 만들지 않는다.
- runner는 판정이 없으면 오류로 종료한다. 일반 Luna 후처리에는 `--allow-model`을 사용하지 않는다. 별도 승인된 Sol 실행만 이 옵션으로 허용하며, `--model-session`·`--retry-model`만으로 모델 실행이 허용되지는 않는다.
- runner는 유효 HOLD와 일반 봉인을 이미 분기한다. `seal-result` 직접 호출로 이를 우회하지 않는다. 정상 PASS는 승인 범위에서 직렬 발행·제품 readback·저장·백업까지 확인한다. canonical/GitHub/배포 권한은 확대하지 않는다.
- 중복 이벤트는 `FINISHED.json`·해시로 구별한다. 완료된 판정은 재사용한다. 정상 결과의 중복 의미 검토와 주기적 상태 질문은 하지 않는다. 구체적인 오류만 원본·실패·보정 diff와 함께 처리한다.
- 후처리 확인 후 감지를 해제하고 빈 방에 다음 승인된 작품을 배정한다. 상태 질문·문서 수정이 끼어들어도 미소비 완료 이벤트와 완료된 방의 다음 배정을 같은 처리 주기에서 마무리한다. 종료 전 현재 배정 5개의 FINISHED/단계 전환 상태를 짧게 대조하며, 완료 결과가 있는데 STATE만 실행 중이면 부모의 처리 누락으로 복구한다. 통지 실패와 부모 미처리를 혼동하지 않는다. 예약 automation은 만들지 않는다.

공유 DB·발행·STATE는 기존 잠금 아래 직렬 처리한다. 상태 변경 전 저장/백업 receipt를 확인한다. 토큰은 실제 누적 차분, 시간은 단계별로 기록하며 추론/출력을 중복 합산하지 않는다. 측정 불가를 0으로 쓰지 않는다.

## 판정 정밀도 예외 — 2026-09-19

HOLD 비율·낮은 confidence만으로 재판정하지 않는다. 구체적인 factKey, frozen evidence ID/구간, 앵커, 현 판정의 충돌이 확인된 경우에만 기존 정정 경로로 국소 수정한다. 먼저 원문→readingText 표시→용도·supplemental binding→앵커를 구분해 원인을 확인한다. 입력 누락은 수집/표시 문제로 처리하고 정상 HOLD는 보존한다. 상위 모델 의견도 정답이나 발행 권한이 아니며 기존 원본·정정 lineage를 유지한다.

새 판정에는 runner의 현행 prompt를 사용한다. 이미 배정된 frozen/session-input과 완료 결과는 덮어쓰지 않는다. 현재 스킬이 달라져도 진행 중 판정은 배정 시 prompt를 유지하고 변경 시점을 다음 판정부터 기록한다.
