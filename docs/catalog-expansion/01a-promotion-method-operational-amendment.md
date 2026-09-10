# 승격 방법론 운영 보충

현재 운영 지침 갱신일: `2026-09-09`

이 문서는 Catalog 확장의 작업 배정·검증 책임·보고 방식을 정한다. Factor 정의와 추천 산식은 기존 상위 사양을 따르고, 별도 동결 판정은 [authorizedEvidencePanel 계약](02-authorized-evidence-panel-v1.md)을 따른다. 아래의 2026-08-26 기록은 과거 방식이며 현재 모델 배정이나 필수 처리 단계로 사용하지 않는다.

## 현재 실행 규칙 — 2026-09-09

1. **목표와 권한:** 검증 가능한 모든 in-scope 고유 작품을 후보 Catalog의 추천 가능 레벨로 승격한다. 추천 가능 작품 수 확대를 우선하며 Gold 150과 legacy authority를 보존한다. canonical 전환·GitHub 쓰기·배포는 별도 승인 없이는 하지 않는다.
2. **배정:** 활성 서브에이전트는 최대 5명이다. 단순 텍스트 정보 수집은 Luna Max(`gpt-5.6-luna`, reasoning effort `max`), 출처 의미 검토·준비·동결 후 수치 판정은 Sol High가 맡는다. Luna Max는 2026-09-09 사용자 변경 지시 이후 새로 배정하는 작업부터 적용하며, 이전 실행 기록과 동결 산출물의 모델 표기는 소급 변경하지 않는다. Grok·유료 출처는 사용하지 않는다. 서사 근거를 이미지에서 추출하지 않으며 선택적인 Art도 텍스트 근거를 먼저 사용한다.
3. **우선순위:** 발행 가능한 동결 판정 → 준비 완료 → 수집 완료 → 구체적 새 근거가 있는 보류 → 신규 수집 순서다. 같은 단계에서는 남은 필수 근거 부족분과 접근 가능한 자료로 순서를 정한다. ID순 신규 조사나 새로운 근거 없는 보류 재배정을 기본값으로 쓰지 않는다.
4. **Sol의 책임:** 같은 담당자가 최대 5작품의 출처 의미 검토·준비부터 실제 freeze → 동결 후 별도 수치 원장 → seal-result까지 중간 재승인 없이 이어서 맡는다. 실제 동결은 준비된 1~5작품이며 조정자가 고유 batchId·경로·frozen pair를 배정한다. 원시 수집 결과나 준비 완료를 판정 권한으로 대신하지 않는다. 같은 묶음을 여러 Sol에게 중복 검증시키지 않는다. 직접 작성하는 수치 산출물은 17축과 채택 tag의 adjudicated-ledger.csv이며 나머지 결과 파일·digest·manifest는 기존 seal 도구가 생성한다.
5. **조정자의 책임:** Sol의 검토·검사 결과를 채택한다. 동일 출처 재독해, 전체 필드 비교, 동일 검사 재실행, 전체 과거 판정 원장 재검색을 반복하지 않는다. 입력 결속·현재 baseline 충돌·보호 대상 검사는 기존 freeze/seal/publish 경로가 담당하고, 조정자는 직렬 발행과 최종 DB·제품 경로 readback을 맡는다. 동결 판정에 필요한 입력/결과 manifest와 원본 권한 연결은 유지한다.
6. **재검토 조건:** 입력 hash·계약·관련 baseline 상태 변경 또는 구체적 실패·모순이 있을 때 해당 부분만 담당자에게 돌려보낸다. 무관한 작품의 승격만으로 의미 검토를 다시 시작하지 않는다. 과거 판정은 최초 대상별 조회 결과와 원본 권한 경로를 재사용하고 이후 새 관련 artifact만 확인한다. 불완전한 조회를 근거로 과거 판정이 없다고 추정하지 않는다.
7. **실패의 조기 차단:** 맥락 근거 ID가 실제 동일 작품의 출처 행으로 연결되는지 준비 단계에서 검사한다. 기존 DB·동결 packet·supplemental의 지원 경로를 유지한다. 맥락과 안전성은 별도 판정하되 서로 다른 추가 URL을 의무화하지 않는다. 발행기의 최종 무결성 검사는 생략하지 않는다.
8. **묶음 처리:** 완결된 수집분은 1~5작품 단위로 즉시 전달하고 전달 파일에는 이후 append하지 않는다. 다음 반환은 새 파일로 한다. 복잡한 metadata/prior 보류는 준비된 일반 작품과 분리한다. 실패·분할용 고유 ID·경로를 제한적으로 사전 배정할 수 있으며 미사용 ID를 채울 의무는 없다. 이미 동결된 membership은 수정하거나 sealed bundle끼리 합치지 않는다. baseline이 바뀌면 기존 publisher의 frozen/current 충돌 검사를 사용하며 실패를 덮어쓰지 않는다. 0 PASS는 보류 결과로 보존하고 일반 발행 대기열에서 제외한다.
9. **최종 확인:** 실제 후보 SQLite 상태를 읽고 기존 authority·Gold 검사, 단일 catalog build/coverage 확인, 생성된 추천 데이터와 기존 추천 엔진 경로를 확인한 뒤 현재 후보 상태를 갱신한다. 동일 성공 검사를 별도 단계로 반복하지 않으며 추가 검사는 구체적 실패나 변경의 영향을 확인할 때만 한다. candidate 증가와 canonical 증가를 구분한다.
10. **보고 범위:** 필수 기계 필드, 판정, 실제 변경, 실패·남은 근거 부족분, 원본 경로만 남긴다. 이전 근거·계약·해시 목록을 단계별 산문으로 다시 작성하지 않는다. 별도 효율 보고서·대시보드·cache·새 harness를 만들지 않는다. 실패는 즉시 기록하고 실제 처리량을 측정하기 전에는 개선 배수를 주장하지 않는다.
11. **승격 기준:** Genre ≥1, Theme ≥1, Narrative known ≥4/6, Tone/Relationship known ≥5/7을 유지하며 Art는 선택이다. 근거 없음은 `unknown`이며 0으로 채우지 않는다. 기준 검토는 확정 수치와 운영자가 덧붙인 요구를 구분하며, 수치 변경은 품질 영향과 사양 변경을 포함한 별도 제품 결정이다.
12. **추가 조건 금지:** 2점 기준에 4점의 반복·장기성·성공을 요구하지 않는다. 직접 만화 본문/page-level 접근, 출처 3개, 전 3권, 일반 Factor의 독립 정족수를 승격 필수 조건으로 삼지 않는다. 정확한 초반 범위의 구체적 텍스트 리뷰도 근거다. Theme 1은 확인된 에피소드·부소재로 판정할 수 있다. Art의 별도 적격성·독립성 조건은 Art 값을 채택할 때만 적용하며 승격을 지연시키지 않는다.
13. **자료 중심 수집:** 관련 초반 본문을 한 번 읽고 실제 관찰·반대 근거·범위 한계를 함께 남긴다. 같은 자료를 Axis마다 다시 검색하지 않는다. requiredFactOptions는 대안이며 추가 검색은 구체적인 남은 gap에 집중한다. 짧은 claimCandidates는 작업 연결용으로 유지하지만 사전 17축 장문 판정을 요구하지 않는다. 같은 관찰을 여러 독립 출처로 부풀리거나 발견한 근거를 숨기지 않는다. 실제 확보한 원문은 기존 provenance 경로로 전달할 수 있으나 새 필수 캡처 게이트나 과거 PASS cache로 삼지 않는다.
14. **Registry 누적:** 검증된 publication pair (C0,R0)에서 R0에 직접 결속한 공통 correction R*를 만들고, 변경되는 모든 Work를 포함한 원래 job·연구 입력을 보존한다. 하나의 호환 request schema로 표현 가능한 수정만 합친다. 독립 job은 같은 (C0,R*)로 동결할 수 있지만 발행은 직렬이며, 첫 실제 publication/readback 후 다음 검증 pair에서만 후속 correction을 시작한다. current/frozen이 다르면 current Catalog·registry는 같은 publication 디렉터리 pair다. registry branch 병합·registry-only 가짜 publication은 하지 않는다.
15. **Prior와 측정 경계:** 대상별 탐색을 재사용해도 참조 bundle의 전체 manifest·원본 claim 결속은 검증한다. 현재 manifest 누락은 FAIL이며 별도 bundle의 완전한 membership·권한 의존 관계를 입증하지 못하면 비관련이나 prior 없음으로 추정하지 않는다. 준비 재고 연결 시험은 신규 처리량에서 제외한다. 신규 처리량은 60분 이상 실제 발행·최종 제품 readback을 마친 고유 신규 eligible 수/전체 경과 시간으로 측정하고 eligible 순증·시작/종료 WIP·실패·수정·대기를 함께 기록한다. 역할 배분별 용량 상한은 그 구성에만 적용하며 목표 미달로 기준을 낮추지 않는다.

현재 수집 형식과 기존 실행 명령은 작업 디렉터리의 `FACTOR-COLLECTOR-INSTRUCTIONS.md`와 `AUTHORING.md`에 둔다. 이 절은 운영 방식을 정하며, 해당 문서나 검사 도구가 제품 사양·근거 권한·안전성 계약을 대신하지 않는다.

2026-09-09 사용자 승인된 Factor 003 소실 사건에는 [복구 계약](04-loss-recovery-v1.md)을 추가 적용한다. 일반 누락 manifest 실패를 완화하지 않으며, 동결된 사건·대상에 대한 명시적 새 권한 전환만 허용한다.

2026-09-09 사용자 승인으로 [로컬 작업 저장소 계약](03-local-authoring-storage.md)을 적용한다. 수집 원문·후보·준비 job·동결 입력·별도 판정·HOLD/실패·발행 자료는 `data/local/catalog-authoring/workspace.sqlite`에 원본 바이트와 버전을 보존하고, `.tmp`는 복원 가능한 작업 사본으로만 사용한다. 인계 전에 저장·백업 receipt를 확인하며 `STATE.json` 변경도 저장한다. 기존 판정/승격 게이트와 최종 제품 readback은 그대로 유지한다. 초기 자료 소실을 저장소 전환으로 해결된 것으로 표시하지 않는다.

## Oracle GO 이후 실행 — 2026-09-09

[Oracle 6 Pro 검토](https://chatgpt.com/c/6a8f9f77-8d48-83e8-a959-eeb7b4ad6344)는 위 방식의 구현·대표 실험 진입에 최종 `GO`를 반환했고, 사용자는 문서화·필요한 코드 개선·승격 계속 진행을 승인했다. 이 GO는 작품별 판정, 실제 발행 성공 또는 시간당 50작품 달성의 증거가 아니다. 검토 당시 입력은 작업 디렉터리 `planning/throughput-oracle-20260909/`에 보존하며, 과거 계획의 승인 대기 문구 대신 이 절과 위 현재 실행 규칙을 따른다.

### 배정과 반환

- **조정자 → Luna:** 최대 5개의 겹치지 않는 target, 최신 근거 경로, 구체적 gap, 담당 Sol과 출력 경로를 배정한다. 완결된 1~5작품을 고정 파일로 즉시 전달하고 `research.jsonl` 구조 검사는 기존 direct collection 명령으로 수행한다. 결과는 완료 ID·경로·남은 gap·실제 시간만 요약한다.
- **대상 선택:** 오래된 planner는 탐색 지도다. 먼저 현재 검증된 candidate의 실제 eligible 플래그로 이미 승격된 ID를 제외하고, 남은 대상만 최신 작품별 수집·HOLD·발행 기록과 대조한다. 오래된 READY 문구만으로 미발행을 주장하지 않는다. `next-targets`가 오래됐으면 기존 `ranked-backlog`의 같은 필드를 사용할 수 있으며, 전체 과거 권한 재검색이나 누락 manifest 무시는 하지 않는다.
- **조정자 → Sol:** 최대 5개 target, 고유 batchId·job/output 경로, frozen Catalog/registry pair와 원본 권한 경로를 배정한다. 필요한 경우 제한된 재시도·분할 ID도 미리 배정한다. 같은 Sol이 준비된 부분의 `records → freeze → adjudicated-ledger.csv → seal-result`를 완료하고 sealed 경로·원래 frozen pair·PASS/BLOCKED ID·실패/남은 gap·실제 시간을 반환한다. 별도 SOURCE/PREPARATION/NUMERIC 장문 보고를 요구하지 않는다.
- **동결 전 HOLD:** Sol은 새 `REVIEW.json`이나 `PREPARATION-REVIEW.json`을 만들지 않고 target·근거 경로·구체적 gap·재시도 조건·실제 시간만 메시지로 반환한다. 조정자가 이를 기존 STATE에 기록한다. 원문·교정 snapshot, 준비된 job, 실제 freeze/seal이 생성하는 필수 report·manifest는 그대로 보존한다. 이미 작성된 과거 검토 파일은 삭제하거나 다시 쓰지 않는다.
- **조정자 발행:** registry 수정이 유실되지 않는 의존 순서로 sealed 결과를 현재 검증 pair에 직렬 발행한다. 원래 frozen pair는 별도 인자로 유지한다. 발행 실패나 최종 DB/제품 readback 실패 시 그 결과를 current로 갱신하지 않는다. 실패를 수정한 후 영향받는 경로를 재실행하고, 의존하지 않는 준비·수집은 계속한다.

### 필요한 코드 변경의 판단

먼저 기존 v3 job·direct collection·freeze/seal/publish와 단일 build 결과 재사용을 사용한다. 실제 실패를 고칠 때는 공통 원인의 최소 완결 범위와 최소 회귀 검사를 수정하고 같은 대표 흐름을 다시 실행한다. 단순히 코드 변경이 없다는 이유로 도구를 추가하지 않는다.

수집·출처 확인/준비·수치 판정·형식 작성/수정·조정자 대기·발행/readback의 실제 시간을 기존 report/assignment에 남긴다. 측정하지 않은 값은 `null`이며 manifest-bound report를 사후 수정하지 않는다. 시작·종료 WIP와 실패·보류·수정 비용을 포함한다. Luna 2/Sol 3으로 신규 구간을 시작하되 최대 5명 안에서 실제 대기열에 맞춰 조정한다.

형식 작성/수정이 지배 비용이면 **모델이 명시한 판정만 기존 17-field ledger로 변환하는 작은 직렬화 어댑터**를 먼저 검토한다. 값·confidence·누락 축·prior 선택을 자동 결정하지 않으며, 같은 frozen 입력의 최종 의미·고정 순서 bytes·seal 결과와 누락 축/cross-work/stale prior 오류 처리를 확인한다. 반복 탐색이 지배하면 실제 원문 전달, 인계가 지배하면 연속 배정을 먼저 개선한다. backend reuse나 중복 읽기 제거는 해당 비용이 측정될 때만 적용하고 mutable publisher 상태를 공유하지 않는다. 새 scheduler·장기 cache·registry merger·harness·검증 연기·기준 완화는 이 승인에 포함하지 않는다.

## 과거 운영 기록 — 2026-08-26

당시 `01-promotion-method.md`의 `promotion-evidence-v3` 대량 처리 순서와 판정원 역할을 보충한 기록이다. 아래 역할 배정은 현재 실행 규칙으로 대체됐다.

### 선택 이미지 경로의 출판사별 재사용

이미지 경로를 선택한 경우 미리보기 접근은 `data/staging/catalog-expansion/art-source-route-registry.csv`의 검증된 출판사별 경로에서 시작한다. 같은 출판사를 작품마다 다시 검색하지 않고 `공식 상품 → 공식 또는 상품이 직접 연결한 정식 유통 미리보기`를 재사용한다. 작품별로는 frozen 판본 연결과 표본 gate만 다시 확인하며, 경로 실패·판본 충돌만 예외 조사 큐로 보낸다.

초반 1–3권의 각 판본이 모두 공식 상품과 직접 연결되면, 같은 Work의 여러 초반 권에서 확인한 판독 가능 본문 페이지를 합산할 수 있다. 그러나 총 6쪽 이상·서로 다른 장면 맥락 2개 이상은 유지하고, 권별 ISBN·JDCN·판본 연결과 페이지 SHA-256을 각각 남긴다.

### 모델 역할

- Luna xhigh subagent는 공식 홍보문구와 독립 JP/KR 커뮤니티 근거를 수집한다. 이미지 경로가 선택된 작품에만 출판사 경로 재사용, 공식 상품·미리보기 연결, 임시 페이지 캡처와 SHA-256 수집을 수행한다. 주석 값이나 승격 여부는 결정하지 않는다.
- Daybreak Blue는 이미지 경로에서 Luna 산출물의 판본 연결, 표본 gate, 픽셀·해시, Local Art 제안을 독립 검증한다. 단독으로 Local Codex와 Gemini의 이미지 Art 정족수를 대체하지 않는다.
- Cursor Grok 4.6 High non-fast는 Factor·Theme·identity·safety와 커뮤니티 근거를 검수하고, 픽셀 접근을 입증하지 못한 이미지 경로 Art에서만 기권한다.

커뮤니티 경로는 정확한 제목·검색어·URL·작성 주체·날짜·entry 범위·독립성·반복 관찰을 원장에 남긴다. 이미지와 커뮤니티 경로는 동급이며 함께 요구하지 않는다. 이 운영 보충은 기존 batch candidate 정체성을 바꾸지 않으며 새 판정 아티팩트는 해당 batch의 별도 원장과 SHA-256으로 동결한다.
