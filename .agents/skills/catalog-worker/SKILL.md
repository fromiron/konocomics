---
name: catalog-worker
description: konocomics의 고정 Luna max 작업에서 배정된 한 작품을 수집하거나 동결 입력으로 판정하고 부모에게 완료 통지할 때 사용한다.
---

# Catalog 작업자

루나1~5 고정 작업방에서 **배정된 현재 단계만** 실행한다. 수집→동결 대기→판정 동안 같은 작품을 유지한다. 모델은 `gpt-5.6-luna` / `max`이며 추가 모델을 호출하지 않는다.

## 배정 수신

- 루나1~5의 고정 ID는 [현재 운영 지침](../../../docs/catalog-expansion/01a-promotion-method-operational-amendment.md)의 표를 따른다. 사용자 승인 부모의 새 배정은 이전 일반 대기 상태를 끝내는 실행 지시다. 단순히 “명령 대기”로 종료하지 말고 DISPATCH를 읽고 해당 단계에 착수한다. 별도 사용자 중단 지시는 우선한다.
- DISPATCH의 workId·본인 threadId·parentThreadId·단계·입출력 경로를 확인한다. 불일치하면 추정하지 말고 부모에 실제 오류를 보고한다. 신규 방 첫 배정 또는 부모가 요청한 경우에만 `COLLECTION_STARTED`와 workId·DISPATCH 경로를 보낸다.
- 이번 작품의 배정 자료만 읽는다. 다른 작품·전체 STATE·과거 세션 이력을 재탐색하지 않는다. 완료 결과가 있으면 재실행하지 말고 그 경로·SHA를 보고한다.

## 수집 단계

- `.workspace/user-sources/<workId>.json`을 우선 사용한다. 제공 URL 원문 검증으로 충분하면 즉시 종료한다. 추가 검색은 수집 지침의 「사용자 사전 수집 자료 우선 — 2026-09-19」에 따른 구체적 gap 보완 1회(검색어 최대 2개와 결과 직접 열람)만 허용하고, 미해결 gap은 부모에게 반환한다. 제공 URL 목록 전체 소진·더 좋은 리뷰·전권·Art는 조사 연장 사유가 아니다.

- [수집 지침](../../../docs/catalog-expansion/factor-collector-instructions.md)의 현재 실행과 원문 저장 절차를 읽는다. 해당 작품 brief와 기존 research/HOLD만 받고 과거 전체 이력을 읽지 않는다.
- 리드 JSON의 요약은 원문 근거가 아니다. 제공 URL의 실제 본문·작품/ISBN·판본·리뷰 독립성·읽은 범위를 확인한다. 대표판이 6권이면 조용히 1권으로 바꾸지 않는다. 자료가 충분하면 바로 종료하고, 기존 gap 기록에 추가 검색 사유·횟수만 남긴다.
- 기존 `scripts/catalog_authoring/collect_factor_evidence.mjs`로 실제 반환 원문·관찰·서지 receipt를 보존한다. 동결 전 수치 판정·공유 DB 직접 변경 금지. 공식 helper의 저장·백업 wrapper는 정상 경로이며 수동 DB 편집과 구분한다. 실제 오류가 없으면 같은 구조 검사를 반복하거나 별도 준비 보고서를 만들지 않는다.
- 유효 근거와 구체적 gap을 저장한 `research.jsonl`의 SHA를 확인한다. `COLLECTION_READY: workId=...; researchPath=...; sha256=...`를 지정 부모에 보내고 같은 작품의 동결을 기다린다.

## 판정 단계

- 배정된 `PROMPT.md`, `schema.json`, `FROZEN_INPUT_ROOT`와 명시적으로 결속된 prior만 사용한다. 사전은 frozen read view에서 읽으며 live 사전·다른 작품 기억·추가 검색으로 보완하지 않는다.
- 근거 채택과 팩터 판정은 모델이 한다. 기계 검사를 의미 검토로 대체하지 않는다. unknown≠0, 낮은 앵커, 선택적 Art 유보·accepted prior 보존 계약을 지킨다.
- 최초 판정에서 신규 비Art 축별로 적격 관찰→정확한 앵커→실제 범위를 연결한다. unknown 전 현재 입력의 관련 관찰을 확인하되 없으면 유지한다. 낮은 앵커에 높은 앵커의 반복성·중심성·장기성을 요구하지 않고, 단어·형식·언급 부재만으로 known/0을 만들지 않는다. 기존 observation/limitation/사유에 연결과 한계만 짧게 남기고 실제 사유가 같은 축만 unknownGroups로 묶는다. 상세 실행은 배정 PROMPT를 따르며 별도 원장·재검토 단계는 만들지 않는다.
- confidence는 검증기가 받는 `0..1` 숫자 **문자열**이다. low/medium/high를 쓰지 않는다. 원본을 조정자가 임의로 숫자에 매핑하지 않는다.
- 각 신규 claim의 `entryScope`는 실제 인용한 supplemental evidence의 `readingScope`에 결속한다. 서로 다른 권의 근거를 임의의 한 권 범위로 묶지 않는다. 범위를 넓히려고 원문 관찰을 바꾸지 않는다.
- 지정된 파일에 한 번 판정하고 SHA를 확인한다. HOLD도 완료이며 `SOL_COMPLETE: workId=...; runRoot=...; decisionsPath=...; sha256=...`를 지정 부모에 보낸다. 작업자는 봉인·발행하지 않는다.

## 오류 수정

- 부모가 구체적인 스키마·범위 결속 오류를 반환하면 보존된 원본과 같은 frozen 입력에서 해당 오류만 수정한다. 정상 claim 전수 재판정·새 조사·validator 완화는 하지 않는다. 의미를 바꿔야만 수정 가능하면 그 이유를 부모에게 알린다.
- 자료 부족의 유효 HOLD는 완료 결과다. 같은 입력을 반복 판정하거나 조사 제한을 넘어 보충하지 않는다.

## 완료 통지와 누락 방지

`SOL_COMPLETE`·`SOL_FAILED`는 기존 통지 호환용 이름이며 Sol 모델 사용을 뜻하지 않는다. 현재 모델은 Luna max다.

결과 파일의 최종 저장 후 도구로 SHA256을 산출하고 **64자리 값을 그대로** 통지에 넣는다. 파일 수정 뒤에는 다시 산출한다. 통지 오타는 파일을 바꾸지 않고 정정 통지만 보낸다. 수집 결과 SHA와 userSourcesSha256은 서로 다른 파일의 해시다.

`send_message_to_thread`의 실제 성공 반환을 확인한다. 조정자가 해당 단계의 notification guard를 등록했다면, 반환 JSON을 재작성하지 않고 그대로 stdin으로 전달한다:

```text
python -X utf8 scripts/catalog_authoring/notification_guard.py ack --session <본인-thread-ID> --sha <결과-SHA>
```

ack는 부모 threadId와 결과 해시를 검사한다. 확인하지 못한 전송을 성공으로 기록하지 않는다. 기존 성공 반환이 있으면 재전송 대신 그것을 사용한다. 전송/ack 실패 때문에 수집·판정을 다시 하지 않는다. 부모가 이미 다음 단계로 guard를 전환했으면 이전 단계 ack를 반복하거나 새 guard를 덮어쓰지 않는다. 보존된 전송 성공 응답을 부모에게 알리고 현재 배정 단계를 따른다. Stop 훅은 미통지 저장 결과에 대해 최대 한 번만 통지를 요청하며, 훅이 없거나 신뢰 대기여도 원래 완료 통지 책임은 유지된다.

결과 생성 자체가 실패하면 `SOL_FAILED` 또는 수집 실패와 실제 오류를 부모에 보내고 멈춘다. 다음 작품을 임의로 시작하지 않는다.
