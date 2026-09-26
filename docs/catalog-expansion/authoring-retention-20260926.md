# Catalog 작업 저장소 보존 정책 전환 결과

2026-09-26 · 브랜치 `authoring-retention-compaction`

Oracle의 [불필요 데이터 개선 계획](https://chatgpt.com/c/6ab34eb0-9c64-83ee-adc0-13eacd080a36)을 검토하고 현재 큐레이션·근거·미완료 작업을 보존하는 schema v3으로 실제 전환했다. canonical Catalog의 내용은 변경하지 않았다.

## 적용 결과

| 항목      |                        전환 전 |                         전환 후 |
| --------- | -----------------------------: | ------------------------------: |
| 작업 DB   |           17,303,666,688 bytes |             3,395,698,688 bytes |
| 정규 백업 | latest + previous, 약 34.61 GB | latest 1개, 3,395,694,592 bytes |
| 합계      |           51,909,914,624 bytes |             6,791,393,280 bytes |
| 순감소    |                              — |   45,118,521,344 bytes (86.92%) |

구 작업 DB·latest·previous 세 파일은 새 세대의 readback 뒤 실제 삭제했다. `RETENTION-PRUNE.json`에 정확한 경로·크기·삭제 전 SHA를 남겼다. 원문·미완료 의존·명시적 legacy pin·사용자 제공 자료·`handoff/`는 유지했다. 별도 작업 사본 전체의 일괄 정리는 수행하지 않았다.

## 변경 내용

- SHA/zlib blob은 공유하고 revision/head/직접 근거 참조를 사용한다. generation `53d00f3c-e974-417e-a145-6f7d487b144a`가 활성 상태다. 옛 snapshot 번호는 필요한 실제 member만 legacy pin으로 보존한다.
- 원래 input/result manifest와 현행 SQL 행을 대조해 AEP claim 8,783개를 결속했다. 동일 의미 중복을 합치고 검증된 legacy claim을 포함한 prior 조회는 8,781개다. legacy 후보 값을 새 승인 판정으로 만들지 않았다.
- 참조 검토 문서 469개도 current basis에 포함한다. 신규 발행과 서지/eligibility 정정의 기준점 갱신 경로를 연결했다.
- 내부 명령은 즉시 `PERSISTED`, 수집·판정·발행·종료/중단의 명시적 경계는 실제 백업 후 `BACKED_UP`이다. hook은 대형 백업을 실행하지 않는다.
- 완료 배치 4개의 기존 발행/readback/STATE 결속을 검증해 작은 completion 기록으로 옮겼다. 성공 종료 execution은 7일 GC 대상이며, 미해결 실패·의미 있는 이력·pin은 시간만으로 제거하지 않는다.
- DB/STATE 전환 intent와 중단 재개, 구 코드의 새 schema 쓰기 거부를 구현했다. 현재 backup에 source의 모든 revision/head가 존재하는 것을 확인했다.

## 실제 검증

- canonical, 기존 최종 candidate/registry, Gold manifest, 통지 등록 파일의 SHA가 보존됐다. 3,309작품 / 추천 가능 2,020 / libraryOnly 1,289다.
- 새 저장소와 첫 백업의 전체 blob·membership·SQLite 무결성을 검증했다. 이후 단계 백업은 새 immutable 항목과 필요한 원문을 검사하는 증분 검증이다.
- 옛 workspace와 artifacts 경로의 파일/SQLite 접근을 거부한 프로세스에서도 실제 prior reader가 통과했다(17.71초). 현재 표본과 기계적 저장 경로 검증이며 모델의 새 의미 판정 검증이 아니다.
- 기존 READY 2건·HOLD 2건을 정상 runner `prepare`로 재개했다. CHECKED/PREPARED/frozen SHA는 동일했다.
- 새 입력 준비는 유효한 기존 자료로 5.63초에 통과했다. 재실행은 0.56초, 새 revision 0개, backup 파일 변경 0개였다.
- 완료 배치의 정상 CLI 재수신은 0.40초에 `ALREADY_APPLIED`를 반환했고 STATE는 같았다.
- 이미 발행된 실제 작품으로 새 basis 생성·조회 경로를 실행했고 STATE를 변경하지 않았다.
- Python 관련 검사 105개: 103 통과, 기존 외부 frozen fixture가 없는 2개 건너뜀. typecheck·lint·출판사 metadata 검사 1개 통과. Catalog 검사는 0 errors / 38,468 warnings였다.

## 확인한 차단과 한계

새 입력 표본 하나는 같은 작품의 정확한 추천 URL 근거가 없어 `INPUT_NEEDS_REPAIR`로 차단됐고 실패 원문/로그는 PERSISTED로 남았다. 검증을 위해 근거를 만들거나 판정 기준을 낮추지 않았다.

기존 READY 한 건의 private 발행은 `canonicalSha256`이 현재 canonical과 달라 차단됐다. 이 입력의 새 발행은 검증하지 못했다. 과거 frozen/판정 SHA를 바꾸지 않았고 current/canonical도 그대로다. 실제 신규 판정·승격이나 모델 호출은 수행하지 않았다. 다음 승격은 원래 정책대로 유효한 새 입력 revision과 판정 결속이 필요하다.

## 보존된 실행 근거

로컬 `.workspace/authoring-retention-20260925/`의 `retention-plan.json`, `verified-build.json`, `retired-inaccessible-verification.json`, `representative-verification.json`, `new-input-verification.json`, `no-op-verification.json`, `completed-batch-replay.json`, `published-basis-advance-verification.json`, `private-publication-verification.json`, `final-python-tests.log`, `final-storage.json`에 상세 근거를 남겼다. 운영 receipt는 `data/local/catalog-authoring/RETENTION-CUTOVER.json`과 `RETENTION-PRUNE.json`이다.
