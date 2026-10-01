# Catalog 운영 예외 처리

현재 확정 사양 · 갱신일: 2026-10-01

정상 배정·실행 추적·단계 전환·완료 확인은 [배치 계약](01c-catalog-batch-promotion-plan.md), 수집은 [수집 지침](factor-collector-instructions.md), 저장은 [저장 계약](03-local-authoring-storage.md), 명령은 [runner README](../../scripts/catalog_authoring/README.md)를 따른다. 이 문서는 그 경로에서 실제 실패·충돌이 생겼을 때만 읽는다. 과거 모델·역할·배정·시험 기록은 Git 이력에서 확인하고 새 실행 지시로 사용하지 않는다.

## 근거·권한과 형식 오류의 구분

- 준비 구조 검사 성공은 실제 freeze·독립 판정·발행 성공이 아니다. 격리 입력 DB의 SHA·작품 집합을 배정된 candidate와 대조하고 canonical 복사본의 PASS를 최신 후보 검증으로 보고하지 않는다.
- 현재 작품의 연구·미소비 관찰·반대 근거·최신 HOLD를 전달한다. status/claimCandidates만을 근거 허용 목록으로 삼지 않고 같은 URL의 상충 관찰을 자동 합치지 않는다. prior 수치 행이나 materialized fact authority는 출판사/리뷰 원문이 아니다.
- 실제 manifest-bound prior의 accepted claim/evidence를 확인하면 기존 의미 판정을 재사용한다. 과거 job 부재만으로 prior를 비우지 않으며 원본 권한 누락을 'prior 없음'으로 추정하지 않는다. 새 명시 job·prior bundle 결속은 기존 prepare 경로를 사용한다.
- 동일 frozen 입력의 순수 형식 오류는 원본·실패본·수정 diff를 보존해 같은 입력에서 국소 수정한다. 실제 내용·권한·관련 계약이 바뀌면 새 revision을 만든다. 누락된 판단·날짜·근거·수치를 통과용으로 자동 생성하지 않는다.
- `factor-adjudication-v2`의 unknownGroups는 명시적 축·이유를 사용한다. v1의 부적격 unknown 근거를 의미 변경으로 자동 보정하지 않는다. 실패한 seal은 원래 input digest를 유지하고 새 result output 경로에서 처리한다.
- 신규 claim의 `evidenceIds`·`citationUrls` 정렬과 digest 생성은 기존 seal이 담당한다. 중복 ID·누락 축·판정값은 자동 보정하지 않으며 이미 결속된 prior/correction digest는 그대로 검증한다.
- source binding은 출처 채택 판정이 아니다. Work·ISBN·source가 결속돼도 실제 identity/safety/context/factor 용도는 frozen 판정의 sourceDecisions로 결정한다.

## 원문·서지 연결의 복구

| 실패                                         | 현재 처리                                                                                                                                                                                                   |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 실제 수집시각·evidence timestamp 누락/불일치 | 원 source의 실제 `readAudit.retrievedAt`과 정밀도를 보존한다. 날짜만 있으면 현재 시각·자정으로 채우지 않는다. 연구 정정은 새 revision과 SHA에 결속한다.                                                     |
| 작성자/역할 미확인                           | 본문에서 확인한 경우만 기록한다. 미확인은 `author=""`, `authorRole="unknown"`이며 사이트 소유자로부터 추정하지 않는다.                                                                                      |
| safety 라벨 관찰 형식 오류                   | 해당 작품의 실제 출판사/레이블 관찰을 확인한다. 스키마가 요구하는 `label=`·`selection=`·`mangaCategory=`는 관찰 시작 또는 세미콜론 뒤에 쓴다. 순수 구분자 오류만 국소 수정하며 라벨 판단을 합성하지 않는다. |
| evidence ID 충돌                             | 같은 ID의 기존 Work·source·맥락·행 내용을 확인한다. 다른 새 결속은 새 ID와 새 입력 revision을 사용하고 원문·기존 행을 보존한다.                                                                             |
| 정확한 추천 URL에 작품 근거 없음             | 다른 URL로 임의 대체하지 않고 context gap 또는 registry 정정으로 반환한다. 실제 새 근거가 있으면 같은 Work의 research/evidence ID까지 결속한다.                                                             |
| 원문/receipt 결속 누락                       | 기존 유효 raw에서 먼저 확인하고 `--provenance-root`로 정확한 collection을 연결한다. 형식/경로 오류를 의미상 HOLD로 바꾸거나 같은 원문을 재수집하지 않는다.                                                  |
| 저장/backup 실패                             | 실제 산출물과 PERSISTED 여부부터 읽고 필요한 저장/경계 백업만 재개한다. 동결·판정을 반복하거나 진행 중인 다른 writer를 임의 종료하지 않는다.                                                                |

서지 혼입·권한 연결·파일 결속 문제 때문에 팩터 전체를 재수집하지 않는다. 필요한 관찰만 담당자에게 돌려보내고 독립적으로 준비된 작품은 진행한다. source 원문을 확인하지 않은 요약 수정으로 결함을 감추지 않는다.

## 동결 후 최신 후보가 전진한 경우

1. correction 출력의 `catalog-source-registry.candidate.sqlite`를 동결에 전달한다. 같은 폴더의 `source-registry.csv`를 registry DB 대신 쓰지 않는다. 동결 전에 기준이 달라졌으면 최신 pair 기준 정정을 준비한다.
2. publisher 독점 아래 최신 catalog/registry를 같은 검증 publication pair로 읽고 private 준비를 수행한다. 검증된 서지 정정을 최신 registry에 재적용하고 원본·동결 정정본·최신본의 의미를 비교한다. 공유 commit 락에서는 직전 STATE/canonical/registry 기준을 재확인하고 변경한다. 무관한 Work 변경은 보존하고 같은 행·필드 충돌은 해당 발행을 차단한다.
3. 최신 registry 전체를 과거 정정본으로 교체하거나 정정을 조용히 버리지 않는다. registry-only 가짜 publication·수동 STATE 수정·후보 롤백으로 검사를 우회하지 않는다.
4. 기존 판정·frozen·sealed·실패를 보존한다. 무관한 후보 전진만으로 모델 판정을 다시 하지 않으며, 원본 manifest가 다른 입력에 예전 판정을 붙이지 않는다.
5. 기존 발행 경로에서 대상 정정·비대상 변경·catalog/registry 결속·제품 readback·경계 백업을 확인한 뒤 STATE를 전진시킨다. 단순 문서화는 복구 완료가 아니다.

canonical 전체 SHA의 변경만으로 유효 판정을 폐기하지 않는다. 기존 발행 경로의 `canonical-rebase-v1` 검사가 원래 바이트 결속과 현재 대상·Gold·alias·대표판·prior·schema/정책 의존을 확인하고 무관한 전진을 새 receipt에 보존한다. 실제 관련 충돌만 보류한다. 원래 frozen SHA·manifest를 수정하거나 관계없는 후보 DB를 canonical 대신 읽지 않는다.

하나의 호환 correction request로 표현할 수 있는 공통 수정은 검증 pair (C0,R0)에서 R0에 결속한 R*로 준비하고 영향받는 모든 Work의 원래 입력을 보존한다. 독립 job은 같은 (C0,R*)로 동결할 수 있지만 발행은 직렬이다. 후속 correction은 실제 publication/readback 후 다음 검증 pair에서 시작한다.

## 단계·반영 중단의 복구

- collection 등록을 adjudication으로 잘못 해석한 구 등록은 `reconcile-registration --expected-sha`로 원본 등록을 보존하고 새 revision을 만든다. 실제 summary·근거·백업이 부족하면 먼저 누락 원인을 해결하며 `checkedPath`·백업 문자열을 합성하지 않는다. 새 등록은 명시 실행 턴에서 arm하고 사용자 중단 상태는 유지한다.
- 시스템 오류는 `ERROR`와 실제 실패 artifact·재개 조건으로 남긴다. 출처를 소진한 `INSUFFICIENT`로 바꾸지 않는다. 개별 작품 오류를 보존하고 나머지를 처리하되 공통 저장·무결성 오류는 자동 판정 전환을 막는다.
- compact의 실제 `BACKED_UP` checkpoint부터 재개한다. 판정·봉인·이미 commit한 작품을 다시 만들지 않으며 부분 checkpoint의 불변 intent와 실제 pair를 대조한다. 일반 검증의 독립 plan checker와 명시 audit의 SQL replay를 구분한다.
- `--apply-canonical` 중단은 같은 summary·batch root·옵션으로 재개한다. candidate 완료가 있으면 그 결과를 재사용하고 정식 DB·생성 artifact·백업의 남은 경계만 복구한다. `publication.pending.json`이 있으면 같은 준비 intent의 `--commit-prepared` 복구 전 다른 shared writer를 실행하지 않는다. 후보 완료를 canonical 완료로 보고하지 않는다.
- 작업 저장소는 v4 변경 순번·backup cursor로 증분 복구한다. 백업 실패는 직전 latest transaction을 보존하며 source의 PERSISTED 결과를 다시 수집/판정하지 않는다. schema 전환은 `catalog_retention.py upgrade-v4 --enable-wal [--resume]`의 유지보수 경계로만 수행한다. 기존 writer를 임의 종료하거나 운영 중 DB 파일을 수동 교체하지 않는다.

## 재검토와 독립 작업

새 관찰·관련 계약/입력 변경·구체적 오류·충돌이 있는 부분만 재검토한다. 같은 근거의 완료 의미 판정, 변하지 않은 HOLD, 실제 실패를 재현하지 않는 전체 검사를 반복하지 않는다. Oracle 상담은 의미·기준이 모호한 쟁점에 사용하며 일반 발행의 의무 최종 승인 단계가 아니다.

필요한 사전 앵커만 요구한다. 2점에 4점의 반복성·강도·장기성·성공을 덧붙이지 않는다. `remainingGaps`는 필수 판단을 막는 실제 부족, `limitation`은 미독해 범위·접근 한계다. 전권·초반 3권·직접 패널·임의 출처 수를 추가 게이트로 만들지 않는다. 근거 없는 수치는 unknown으로 유지하며 N/T 예외는 실제 조사 기록이 결속된 경우만 적용한다.

같은 수집의 관찰을 준비 보고서·최종 원장·중복 산문으로 반복 작성하지 않는다. 실제 freeze/seal report·manifest·필수 원장은 보존한다. 수집의 구조 검사는 기존 `validateResearchRow` 등을 사용하되 실제 CLI가 이미 수행하는 전체 검사를 앞에서 반복하지 않는다. 읽기 connection/cursor는 사용 후 닫고 네트워크/모델 대기 중 유지하지 않는다.

## 구형 완료 통지의 수신 호환

기존 등록에 결속된 `COLLECTION_READY`·`SOL_COMPLETE`·`SOL_FAILED`를 받으면 현재 담당 Work·run·판정 SHA와 실제 상태를 확인한다. 이름은 모델 설정이 아니다. 새 배정을 이 형식으로 만들거나 작품별 부모 왕복 운영을 다시 시작하지 않는다. 적용된 결과는 현재 completion/STATE 기록으로 중복을 차단하며 통지의 성공만으로 발행됐다고 간주하지 않는다.

```text
SOL_COMPLETE: workId=<ID>; runRoot=<절대 경로>; decisionsPath=<절대 경로>; sha256=<SHA256>
```

현재 배치는 hook·부모 메시지·전송/소비 ACK를 사용하지 않는다. 현재 실행자가 실제 checkpoint·summary·completion·STATE와 백업을 대조한다. 구형 통지 자료는 이력으로만 보존하며 세션 ID·CLI 모델 설정을 호환 명목으로 재사용하지 않는다.

## 측정과 보고

- 실제 시작/종료, 준비 재고, 신규 VERIFIED·HOLD·실패, 미완료 WIP, 수집·판정·수정·대기·발행/백업·진단 비용을 구분한다. 병렬 작업 시간 합을 전체 경과시간으로 쓰지 않는다.
- 신규 승격 처리량은 60분 이상 실제 발행·제품 readback을 마친 고유 신규 eligible 수/전체 경과시간으로 측정하고 eligible 순증·시작/종료 WIP를 함께 기록한다. 짧은 표본은 그 표본의 비용만 보고한다.
- 준비 재고 연결·이미 완료된 판정의 replay·캐시 적중은 신규 처리량이나 품질 향상의 증거가 아니다. 캐시 워밍업을 위해 완료 모델 호출을 반복하지 않는다.
- 요청 모델/추론과 실제 실행 metadata를 구분한다. 누적 usage는 실제 차분을 사용하고 unavailable을 추정하거나 구독 과금액으로 환산하지 않는다. 지원이 확인되지 않은 캐시 옵션을 추가하지 않는다.
- 배치/후보/canonical·코드·schema·원본 manifest identity와 실제 남은 한계를 표시한다. 외부 frozen fixture 부재·canonical mismatch로 막힌 검사를 통과한 것으로 바꾸지 않는다.
