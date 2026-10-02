# 로컬 Catalog 작업 저장소

현재 확정 사양 · 갱신일: 2026-10-01

이 문서는 저장 위치·보존 범위·백업 경계의 단일 운영 계약이다. 2026-09-26 승인한 실행 계약은 workspace schema v4이며 실제 전환 여부는 대상 DB의 schema·generation과 전환 receipt에서 확인한다. 문서 갱신을 운영 DB 전환 완료로 간주하지 않는다. [기존 검증 요약](authoring-retention-20260926.md)은 해당 실행 근거와 한계를 기록하며 이 문서의 규칙을 대신하지 않는다. 과거 규칙은 Git 이력에서 확인한다.

**2026-09-27 SDD 상태:** 아래 R1~R9에 따라 DB 전용 기본 복구·요청별 추출·부분 작업 폴더의 증분 백업을 구현하고 기존 CLI에서 검증했다. [현재 구현·검증 근거와 한계](08-structural-throughput-20260927.md)를 따른다. 과거 원본 도구 누락 검사 4개와 당시 고정 세션 자동 전환은 해당 검증의 한계였다. 문서 변경으로 중단된 큐를 재개하지 않는다.

**2026-09-28 경량 보존:** `scripts/catalog_authoring/lean_migration.py`는 불필요한 로컬 사본·백업·반복 검증을 줄이되, 남긴 자료를 실제로 읽고 재사용·정리할 수 있게 한다. 같은 generation에서 Work별 `curation`, 원문 `collection`(`retained-originals`), 작은 `active` 제어, `completion`, `canonical-completion`과 previous·dependency closure를 새 파일로 복사한다. 불필요한 `artifact`, 종료된 `execution`, `legacy-pin`, `active/migration-working-sets`는 독립 보존 근거로 삼지 않는다. 다만 미완료 실행과 남긴 checkpoint의 원래 소유 관계, closure에 이미 포함된 legacy pin의 조회 head는 유지한다. 이 예외로 무관한 과거 publication 사본을 복원하지 않는다. 완료 확인·GC의 구형/신규 구분은 원래 revision rowid, 생존 행 범위의 legacy watermark, 변경된 revision당 하나의 journal 표식으로 유지한다. 전체 change history를 복사하거나 새 DB에 다시 `VACUUM`하지 않는다. 원본은 한 읽기 transaction에서 선택·복사하고, 새 journal origin으로 최초 백업 후 기존 증분 백업을 사용한다. canonical `catalog.sqlite`는 바꾸지 않는다. 과거 추출 폴더는 DB blob 결속과 실제 소비 가능 범위를 확인한 뒤 정리하며, 이후 수집·판정 파일의 위치는 계속 `artifacts/`다. prior authority의 manifest 결속, freeze의 계약 문서 결속, canonical apply의 current·candidate·projection 검증, v2/v3 reader는 유지한다. 한 배치 안의 prior 재검증은 기존 `manifest_verification_cache`를 쓴다.

## 저장 경계

| 위치                                                        | 내용과 권한                                                                                                             |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `data/source/catalog.sqlite`                                | Git으로 추적하는 유일한 canonical Catalog. 작업 DB가 대체하지 않는다.                                                   |
| `scripts/catalog_authoring/` 및 기존 runner/storage scripts | Git으로 추적하는 실행 코드·회귀 검사. artifact의 도구 사본은 새 실행 코드가 아니다.                                     |
| `data/local/catalog-authoring/workspace.sqlite`             | 원문·판정·큐레이션·작업 의존의 영구 작업 저장소. 저장 성공은 판정 승인이나 승격 성공이 아니다.                          |
| `data/local/catalog-authoring/artifacts/`                   | 원문·동결 입력·판정·후보·실패·인계의 작업 파일과 receipt. 필요한 원본은 작업 DB에 결속한다.                             |
| `data/local/catalog-authoring/backups/latest.sqlite`        | 검증된 현재 세대의 정규 백업 하나.                                                                                      |
| `.workspace/`                                               | 재생성 가능한 임시 출력. 사용자 제공 자료인 `user-sources/`는 보호 예외이며 [리드 규격](user-source-leads.md)을 따른다. |

로컬 작업 데이터는 Git에서 제외한다. 서비스 런타임은 정적 JSON·기존 Dexie·두 Rakuten route를 유지하며 작업 DB를 사용하지 않는다. `.tmp`나 메모리만을 원본의 유일한 보존 위치로 사용하지 않는다. `handoff/`와 미분류 사용자 자료도 보존한다.

## 현재 보존 정책

- 보존 대상은 현재 큐레이션, 실제 원문·관찰·범위·한계, 의미 있는 판정 변경, Work별 최신 유효 판정, 미완료 작업 의존과 중복 발행 방지 기록이다. 최신 판정은 READY와 HOLD를 각각 하나씩 고르는 뜻이 아니다. 모든 실행 사본의 영구 복원을 요구하지 않는다.
- `revision`·`head`·`revision_blob`과 SHA-256/zlib blob을 사용한다. 같은 내용의 재저장은 같은 revision을 반환한다. UUID와 generation을 사용하며 옛 snapshot 번호를 새 ID로 재사용하지 않는다.
- v4의 `change_log` 순번과 백업 cursor는 실제 revision/blob·head·삭제·의존 변경과 같은 commit에 결속한다. v3→v4는 generation·revision ID·동결 원문을 보존하며 새 세대로 위장하지 않는다. v3 읽기는 지원하되 v4 writer는 명시 전환 전의 v3 쓰기를 거부한다.
- 현재 기준점 `CURATION-BASELINE.json`은 원래 result/input manifest·claim·원문과 현행 SQL 행을 대조한다. 값만 읽어 새 승인 판정을 만들지 않는다. AEP·기존 모델 판정·미검토·Gold 구분과 unknown을 보존한다. legacy 권한은 검증된 adapter와 명시적 bundle pin으로 유지한다.
- prior reader는 기준점에서 필요한 작품을 읽는다. 필요한 권한·원문 결속은 검증하되 과거 전체 publication 계보를 매 작품 순회하지 않는다. 누락·손상된 근거를 합성하지 않는다.
- 완료 배치는 `completion` revision의 summary SHA·실제 발행/readback·STATE 적용 기록으로 중복을 차단한다. 작은 원래 receipt를 보존하며 재수신 때문에 오래된 전체 STATE/publication을 다시 열지 않는다.
- 정상 백업은 불변 completion별로 재수신에 필요한 원 summary·CHECKED·RUN·판정·동결 manifest/job·봉인 manifest 멤버의 정확한 SHA를 한 번 확인해 복구용 identity를 보존하고 이후 재사용한다. 매번 옛 full RUN·frozen·provenance 전체를 다시 저장하지 않으며 기존 원본 receipt를 수정하지 않는다.
- 기존 frozen SHA·원본 바이트·판정 이력은 변경하지 않는다. 새 사실·정정은 새 revision에 남긴다. 같은 경로의 다른 원본 버전은 덮어쓰지 않는다.
- 의존 자료 탐색 한 호출 안에서는 공통 조상의 링크 검사를 재사용할 수 있다. 호출 종료에는 새 검사 집합으로 모든 확인 경로를 다시 검증하며, 다음 호출·저장·발행으로 검사 결과를 넘기지 않는다. 탐색 대상·원문 SHA·retained revision 및 source/backup 검증 범위는 줄이지 않는다.
- 이미 순회한 자료 범위는 경로의 실제 조상으로 조회하며 무관한 형제 파일 전체와 비교하지 않는다. 여러 캐시 범위가 겹치면 최초 순회의 선택을 유지한다. 대상 파일·retained 참조의 path/SHA 집합이 동일해야 하며 이 최적화로 의존을 제외하지 않는다.
- 구조적 입력 오류는 가능한 한 원문 전수 해시·복사 전에 기존 preflight로 진단한다. 서지 기준·정확한 선정 URL·동일 URL 관찰 충돌의 기존 거부 조건을 유지하고, 실제 원문 독해나 근거 채택을 자동화한 것으로 보고하지 않는다. 입력 변경은 새 revision으로 처리하며 후속 동결의 바이트·기준 변경 검사는 유지한다.
- 발행 실행 시간은 실제 기존 단계의 비중복 구간으로 기록한다. 의존 자료 탐색·저장과 작품별 적용 등의 하위 측정은 상위 구간에 포함되므로 합산하지 않는다. 실패·재개 실행과 완료 재사용을 구분하며 시간 기록은 판정·completion identity를 바꾸지 않는다.
- 기본 복구와 요청별 자료 사용의 목표 범위는 아래 R1~R9를 따른다. DB에 보존한 이력과 작업 폴더에 꺼내 놓은 파일을 동일시하지 않는다.

## DB 중심 복구 요구사항

요구 ID는 구현·회귀·실행 증거의 연결 기준이다. 기본 DB 복구와 기존 소비 명령의 요청별 자료 준비를 구현했다. 각 수용 기준의 실제 실행 근거와 남은 검증 한계는 [SDD 검증 기록](08-structural-throughput-20260927.md)에 구분한다. 별도 복구 API나 시험 전용 실행 경로를 만들지 않는다.

### R1 기본 복구는 DB 복원과 검증만 수행한다

**요구:** 일관된 v4 백업 SQLite 한 파일을 작업 데이터 입력으로 받아 새 목적지의 `data/local/catalog-authoring/workspace.sqlite`와 소량의 진행 기록·경로 mapping·복구 report만 만든다. current basis, 6개 작업 세션, live·과거 artifact 폴더를 미리 생성하거나 전역 이력을 따라가며 복구 범위를 찾지 않는다. 동일 버전의 Git 실행 코드·계약 문서·전용 runtime은 별도 실행 환경이며 DB 복원이 코드 설치를 대신하지 않는다.

**수용 기준:**

- R1.1 기존 `catalog_workspace.py ... restore --destination <새 경로>`에서 snapshot을 생략한 실제 기본 경로가 DB와 소량의 진행 기록·mapping/report 외 artifact를 0개 생성한다. current-basis·작업 세션·전역 history 경로 순회도 0회다. 이후 R3의 특정 operation이 필요한 파일을 추출하는 수용 기준과 구분한다.
- R1.2 입력과 복구 DB의 schema v4, generation, revision ID 집합과 commit 완료 순번을 대조하고 SQLite `integrity_check`·`foreign_key_check`를 통과한다. 이 DB 검증을 전체 blob 해제·원문 재해시·과거 의미 replay 감사와 혼동하지 않는다.
- R1.3 기존 목적지·파일을 덮어쓰지 않고 경로 이탈·링크를 거부한다. 중간 실패의 부분 목적지와 오류는 미완료로 남기며 성공 report를 만들지 않는다. source 백업과 원래 운영 DB는 바뀌지 않는다.

### R2 과거 원본 export와 감사는 명시적으로 선택한다

**요구:** 기존 `restore --snapshot <revision UUID>`와 허용된 `--prefix`·`checkout`의 과거 원본 복원/감사 경로를 유지한다. 이것을 기본 DB 복구의 선행 조건으로 호출하지 않는다.

**수용 기준:**

- R2.1 명시한 snapshot의 generation·membership·원문 SHA를 검증해 해당 범위만 export한다. 같은 경로의 다른 버전은 기존 충돌 처리 규칙을 지키며 원본을 재작성하지 않는다.
- R2.2 기본 restore는 이 경로와 전체 원본 replay를 호출하지 않는다. DB 복구 성공과 과거 원본 export/감사 결과·시간은 별도 기록한다.

### R3 기존 소비 명령이 요청한 자료만 읽거나 추출한다

**요구:** batch·runner·metadata·notification의 기존 명령 시작점에서 명시적으로 요청된 summary/run/Work/metadata/event와 그 정확한 의존만 DB에서 읽거나 파일로 꺼낸다. 범용 `artifact_path()`·JSON/blob 읽기 함수가 숨은 파일 쓰기를 하게 만들지 않는다. 새 freeze의 Work 범위 source/receipt 계약은 유지한다.

**수용 기준:**

- R3.1 DB만 복원된 저장소에서 기존 batch summary 재수신, runner의 명시 run 재개, metadata 입력 처리, notification의 명시 session/event 처리가 각각 해당 요청 범위로 시작된다. 요청과 무관한 Work·옛 history 파일 추출은 0개다.
- R3.2 추출한 bytes·raw/receipt·경로의 원래 식별자·revision/generation·SHA는 DB의 해당 원본과 일치한다. 누락·손상은 해당 요청의 오류로 남기고 원문·판정·receipt를 합성하지 않는다.
- R3.3 기존 동일 파일은 검증 후 재사용하고 다른 bytes의 기존 파일은 덮어쓰지 않는다. 일반 경로 해석·읽기 함수만 호출하면 파일 생성·수정이 0건이다.
- R3.4 복구 대상 불변 artifact의 exact SHA 불일치는 해당 요청의 실패다. 정상적인 새 입력은 기존 prepare·저장·새 revision 계약으로 처리하며, 새 입력까지 DB의 오래된 SHA와 같도록 강요하지 않는다.

### R4 완료 배치 재수신은 완료 증거와 요구된 효과를 확인한다

**요구:** 해당 summary의 source/latest completion을 검증하고 기존 적용 사실을 재사용한다. canonical 효과가 요청된 경우 실제 현재 canonical·정적 데이터 readback도 확인한다. 전체 과거 replay·새 모델 판정·새 발행으로 완료를 다시 만들지 않는다.

**수용 기준:**

- R4.1 DB 중심 복구 뒤 원래 완료 summary를 기존 batch CLI에 재전달하여 정확한 summary/판정/적용 집합과 source/latest completion이 일치함을 확인한다. 현재 STATE 조회는 허용하되 요청 외 완료 배치의 proof·원문 재검증 순회와 전체 원본 replay는 0회다.
- R4.2 candidate만 확인한 결과를 canonical 완료로 보고하지 않는다. `--apply-canonical` 등 실제 효과 요구가 있으면 해당 현재 DB·생성 데이터 버전과 bytes를 확인한다.
- R4.3 같은 완료의 재수신에서 새 모델 호출·새 의미 판정·중복 발행·STATE 적용 변경은 0건이다. 필요한 source/latest 검증은 R5의 실제 단계 경계를 따른다.

### R5 파일 미추출은 삭제가 아니다

**요구: SPARSE FILE ABSENCE IS NOT DELETION.** DB에 보존된 현재 논리 상태와 명시적인 mutation/delta가 권한이다. 아직 추출하지 않은 controls·registration·정적 데이터가 디스크에 없다는 이유로 backup이 삭제를 추론하거나 head를 덮어쓰면 안 된다. 실제 원문이 필요한 소비 시점의 검증은 생략하지 않는다.

**수용 기준:**

- R5.1 R1 직후 artifact가 없는 상태와 STATE·한 Work만 부분 추출한 상태 양쪽에서 기존 backup을 실행해, 추출되지 않은 controls/registration/current 효과의 논리 행·head가 유지됨을 source/latest의 실제 행 비교로 확인한다. generation·revision 식별과 commit/cursor 결속도 일치해야 한다.
- R5.2 변경 없는 backup은 미추출 상태를 빈 상태로 저장하지 않는다. 명시적 수정·삭제가 있을 때만 허용된 delta가 생기며, 요청하지 않은 상태 변화는 0건이다.
- R5.3 source/latest 검증이 필요한 실제 작업·백업 단계에만 복구본의 초기 latest를 만든다. R1 restore 자체에는 두 번째 DB 복사를 필수화하지 않는다. 초기 latest가 생성된 뒤 정규 백업은 실제 증분으로 진행하며 반복 전체 DB 복사·교체는 0회다.

### R6 canonical과 정적 데이터는 별도 요청 효과다

**요구:** DB 복원 자체는 canonical·정적 데이터의 복원/발행 완료가 아니다. 실제 소비 operation이 해당 효과를 요구할 때 현행 version에 맞는 자료만 준비·적용·readback한다. 기존 pending intent·공유 commit lock·중복 적용 방지 계약을 유지한다.

**수용 기준:**

- R6.1 기본 DB restore의 canonical·정적 파일 생성/변경은 0건이다. 요청된 canonical 효과는 같은 현재 version의 DB와 생성 JSON을 읽어 확인하며 서로 다른 candidate/canonical 빌드 결과를 혼용하지 않는다.
- R6.2 canonical 교체 중단은 보존된 동일 intent를 기존 명령으로 재개한다. 공유 락과 commit 직전 기준 비교를 유지하고, 재시도에서 중복 반영이 없으며 DB·생성 자료·백업의 readback 후에만 완료 처리한다.
- R6.3 대상 외·Gold·서지·기존 근거를 보존한다. canonical 효과와 candidate completion의 상태를 분리해 실패·미완료를 숨기지 않는다.

### R7 현재 판정은 상태별이 아니라 Work별로 선택한다

**요구:** 완료 run을 포함해 Work별 최신 유효 판정을 먼저 선택한다. ERROR/실패 실행은 유효 판정을 대체하지 않고, 완료된 최신 판정 때문에 옛 HOLD/READY가 현재로 되살아나지 않아야 한다. 실제 미완료 summary·기존 pending 작업의 명시적 exact CHECKED/SHA 의존은 예외로 유지한다.

**수용 기준:**

- R7.1 이전 HOLD → 최신 READY 완료 → 후속 ERROR가 있는 Work에서 기존 유효 완료를 확인하며 옛 HOLD/READY 전체 트리를 추출하지 않는다. `(Work, status)`별 최신 선택을 하지 않는다.
- R7.2 미완료 요청이 특정 과거 CHECKED/SHA를 요구하면 그 정확한 의존만 읽거나 추출한다. 이를 일반 과거 이력 전체 복원으로 확대하지 않는다. 잘못된 세대·변조된 참조를 다른 오래된 값으로 대체하지 않는다.

### R8 DB 이력 보존과 물리 파일 복원은 분리한다

**요구:** 옛 history blob·원본 frozen SHA·의미 있는 판정 이력은 보존하되 모든 실행 사본을 영구 물리 복제하지 않는다. GC는 기존 소유·참조·pin·성공 종료 후 보존 수명 범위만 적용한다. 이번 전환에 과거 자료 대량 삭제를 포함하지 않는다.

**수용 기준:**

- R8.1 DB restore 전후 보존된 이력의 revision·blob 결속이 유지되고, 요청하지 않은 과거 실행 폴더의 물리 생성은 0건이다. 새 저장·백업은 동일한 실행 사본 전체를 매번 영구 복제하지 않는다.
- R8.2 선언된 임시 실행 소유 범위의 성공 종료·수명·참조 검증 없이 GC하거나 활성·미완료·legacy pin을 제거하지 않는다. 원본 대량 삭제·기존 frozen 재작성은 0건이다.

### R9 복구는 세션 실행이나 모델 호출 권한이 아니다

**요구:** restore/bootstrap은 arm·send·resume·새 모델 판정을 수행하지 않는다. 기존 session generation·turn·중단 상태를 그대로 보존하며 runtime/Git 코드는 데이터 백업과 별도로 준비·식별한다.

**수용 기준:**

- R9.1 기본 복구 및 자료 준비 과정의 arm·메시지 전송·작업자 재개·모델 호출은 각각 0회다. 사용자 중단 플래그·기존 turn/generation은 바뀌지 않는다.
- R9.2 재개가 별도로 승인된 기존 명령에서만 작업을 이어가고 작품별 의미 판정·실제 실행 이력·소유권 결속을 유지한다. 특정 모델·고정 세션 지정은 요구하지 않으며 [배치 계약 §3](01c-catalog-batch-promotion-plan.md#3-역할과-실행-추적)을 따른다. 복구 report에 사용한 runtime/코드 identity와 데이터 generation을 구분하며 DB 복원을 코드 배포로 보고하지 않는다.

### 기존 진입점과 요구 ID 연결

| 기존 진입점                                                 | 목표 책임                                               | 요구 ID            |
| ----------------------------------------------------------- | ------------------------------------------------------- | ------------------ |
| `catalog_workspace.py restore` (snapshot 생략)              | DB만 복원·검증                                          | R1, R5, R8, R9     |
| `catalog_workspace.py restore --snapshot` / `checkout`      | 명시적 과거 원본 export                                 | R2, R8, R9         |
| `catalog_workspace.py backup` 및 기존 단계 백업             | sparse 논리 상태 유지·source/latest readback            | R5, R8             |
| `catalog_authoring_batch_publish.py`                        | 요청 summary 추출·완료 재수신·요청한 canonical 효과     | R3, R4, R6, R7, R9 |
| `apply-catalog-authoring-canonical.ts`의 기존 CLI           | 요청 canonical/static 효과·pending intent 재개·readback | R3, R5, R6, R9     |
| `catalog_authoring_runner.py`의 기존 prepare/check/run 경로 | 명시 run/Work의 자료 사용·기존 run 재개                 | R3, R5, R7, R9     |
| `import-publisher-book-metadata.ts`                         | 요청 metadata·근거와 해당 canonical 효과                | R3, R5, R6, R9     |
| `notification_guard.py`의 기존 session/event 명령           | 구형 session/event 자료 조회·호환                       | R3, R5, R7, R9     |

이 표는 기존 소비자에 요구를 배정한 스펙이며 구현 완료 표가 아니다. 수용 기준을 작은 실제 진입점 재현 검사로 작성해 미충족을 확인하고, 그 스펙을 충족하도록 구현한 뒤 동일 경로로 재검증한다. 코드 동결 후 필수 통합 검증을 한 번 수행한다. r005의 과거 전체 원본 replay PASS는 R1·R3·R5의 대체 증거가 아니다.

## 저장과 백업의 단계 경계

| 시점                                                           | 필수 동작·상태                                                                                                                               |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 원문 수집, prepare/check, 새 판정·실패·checkpoint 저장         | 즉시 SQLite commit 및 `PERSISTED`. 내부 명령마다 물리 백업하지 않는다.                                                                       |
| 수집 배치 완료, 판정 배치 완료, 발행 완료, 작업 종료·부분 중단 | 필요한 원본·결과·receipt를 백업하고 실제 source/latest를 대조한 뒤 `BACKED_UP`.                                                              |
| compact 발행의 기본 50작품 checkpoint                          | pair·작품 receipt·의존을 실제 단계 백업하고 `BACKED_UP`을 확인한 지점부터 재개한다. 더 촘촘한 재개가 필요하면 `--checkpoint-every`로 줄인다. |
| 변경 없는 재실행                                               | 실제 입력·원문·membership·receipt 결속을 확인하고 유효 결과 재사용. 불필요한 revision·백업 복사/rotation을 만들지 않는다.                    |

신규 배정 크기와 단계 전환은 [배치 계약](01c-catalog-batch-promotion-plan.md)을 따른다. 원본 저장·작품별 기계 검사·checkpoint는 배치 끝까지 미루지 않는다. `PERSISTED`는 마지막 경계 백업에 포함됐다는 뜻이 아니며 작업자가 문자열을 `BACKED_UP`으로 바꾸면 안 된다.

현재 경계 백업은 명시적 `catalog_workspace.py backup`으로 수행한다. 과거 통지·백업 receipt는 이력으로 보존한다. 독립 명령 하나가 발행/인계 경계인 경우에만 `run --phase-boundary`를 사용한다. 최종 백업 실패는 미완료로 보고하고 실제 저장 결과에서 재개한다. 강제 종료 전 미저장 자료를 복원됐다고 주장하지 않는다.

collection summary의 `workspaceAndBackupReadbackVerified`는 실제 source/latest의 원문 SHA 확인을 가리킨다. 상태명·manifest 파일 SHA 하나·경로 존재만으로 원본 보존이나 백업을 대신하지 않는다. 전체 blob 감사와 해당 단계 원문 검사는 다른 범위다.

## 실행·잠금·복원

- 역할별 `prepare`·`check`·발행·백업 명령은 [runner README](../../scripts/catalog_authoring/README.md)를 따른다. `run --decisions`는 발행 명령이며 작업자의 비발행 검사로 사용하지 않는다. 판정 누락을 모델 자동 호출로 채우지 않는다.
- 원격 수집·모델 판정·파일 읽기/SHA/압축·기존 blob 검증은 workspace writer 밖에서 수행한다. 입력과 기준 head를 다시 확인한 뒤 준비된 신규 blob·revision·변경 순번만 commit한다. 같은 입력의 재실행은 실제 결속 검증 후 쓰기 없이 반환하고, 입력 변경·경쟁 저장은 성공으로 기록하지 않는다.
- workspace만 수정된 SQLite runtime에서 WAL을 사용하고 `synchronous=FULL`을 유지한다. catalog/registry의 attached transaction 쌍은 다중 DB 원자성을 위해 DELETE 모드를 유지한다. 시스템 Python의 SQLite 3.49.1로 WAL을 활성화하지 않는다.
- 정상 백업은 최초에만 전체 복사·검증한다. 이후에는 source의 고정 변경 순번까지 필요한 delta를 준비하고 읽기 snapshot을 닫은 뒤 `latest.sqlite`의 단일 transaction에 새 revision/blob·head·삭제·cursor를 적용한다. 실제 readback 실패는 직전 백업으로 rollback하며 정상 증분 경로에서 전체 DB 복사·교체·전체 목록 비교를 반복하지 않는다. 같은 세대의 정상 운영에는 `latest.sqlite` 하나를 유지한다.
- 원문/receipt 검증은 한 호출에서 inventory를 공유하되 source와 backup에 각각 독립 snapshot과 cache를 사용한다. 같은 revision membership·고유 blob은 각 저장소에서 한 번 검증하고 마지막에 실제 입력 집합·bytes를 다시 대조한다. source 검사를 backup 검사로 대체하거나 mtime만으로 검증을 생략하지 않는다.
- publisher 독점 `publication-owner.lock`과 공유 반영 `publication.lock`을 구분한다. private 준비·검사·빌드·백업은 공유 commit 락 밖에서 수행하며 commit 직전에 STATE·canonical·registry 기준을 확인한다. metadata·대표판 정정·retention 전환도 같은 공유 반영 규칙을 따른다. pending canonical intent가 있으면 다른 공유 변경에 앞서 같은 intent를 복구한다. 잠금 경합만 제한 시간 안에서 재시도하며 권한·I/O 오류를 경합으로 무한 재시도하지 않는다.
- 실행에 실제 사용한 입력·직접 의존·도구를 결속한다. 도구 디렉터리 전체나 관계없는 과거 실행 사본을 무조건 추가하지 않는다. 원본 파일/집합이 저장 중 바뀌면 성공으로 기록하지 않는다.
- 새 freeze의 provenance는 현재 job의 Work 범위다. `.workspace/user-sources/` 같은 정식 리드 루트를 전달해도 해당 `<workId>.json`만 형식·Work를 확인해 결속한다. 원문 collection은 Work/research/raw receipt와 명시된 보충 파일을 검증한다. session 없는 임의 공유 디렉터리를 통째로 복사하거나 무시하지 않으며, 사용할 파일을 기존 collector의 `start ... --input <파일>`로 Work에 먼저 결속한다. 이 선택은 보존·전달 범위이며 출처의 의미 채택·HTTP 사실을 인증하지 않는다. 원래 사용자 자료를 삭제하지 않는다.
- 과거 artifact의 경로는 읽기 경계의 `workspace_paths.artifact_path()`로 해석한다. 원문 경로 문자열·manifest를 재작성하거나 호환 심링크/junction을 만들지 않는다.
- 복원은 SHA 재계산·경로 이탈·링크·기존 파일 덮어쓰기 검사를 유지한다. source SQLite의 exact-byte 이관은 writer/journal 상태를 확인한 뒤 진행한다.
- 전체 환경 보관·이전이 필요한 경우 수집·발행·DB writer 종료 후 `data/local/catalog-authoring/` 전체와 같은 버전의 추적 코드를 복사한다. 이는 일반 현재 상태 복구와 다른 범위다. 루트가 바뀐 절대 경로는 별도 매핑과 검증이 필요하다.
- 같은 디스크의 백업은 임시 파일 정리 사고에 대비한 별도 사본이며 디스크 장애의 독립 백업은 아니다. 외부 백업은 별도 목적지 권한을 확인한다.

## 기본 명령

저장소 루트에서 전용 Catalog Python launcher를 사용한다. `setup_catalog_runtime.py`는 공식 배포 archive의 고정 checksum을 확인한다. Windows는 Python 3.13.15와 SQLite 3.53.4를, Linux/WSL은 호스트 Python 3.12+ 기반 전용 venv와 SQLite 3.53.4 shared library를 로컬 작업 디렉터리에 설치한다. 실제 부모·자식 실행기의 로드 버전을 receipt에 기록하며 시스템 Python·SQLite는 바꾸지 않는다. launcher는 내부 Python 호출에도 같은 runtime을 전달한다. 실행 전 해당 명령의 `--help`와 대상 세대를 확인한다. 아래 PowerShell 예의 `python`은 Linux에서 `python3`로 바꾼다.

```powershell
# 최초 runtime 설치 또는 설치 receipt 복구
python scripts/setup_catalog_runtime.py
python scripts/catalog_python.py scripts/catalog_workspace.py save --label <작업-label> <원본-또는-결과-경로>
python scripts/catalog_python.py scripts/catalog_workspace.py list
# 명시적 단계 완료/인계 경계
python scripts/catalog_python.py scripts/catalog_workspace.py backup
# 손상 의심·명시적 전체 감사
python scripts/catalog_python.py scripts/catalog_workspace.py verify
# 기본 복구: workspace DB와 mapping/report만 생성
python scripts/catalog_python.py scripts/catalog_workspace.py --database data/local/catalog-authoring/backups/latest.sqlite restore --destination <새-경로>
# 명시적인 과거 revision 원본 복원·감사
python scripts/catalog_python.py scripts/catalog_workspace.py --database data/local/catalog-authoring/backups/latest.sqlite restore --snapshot <revision-UUID> --destination <새-경로>
```

기본 restore는 R1의 DB 전용 경로로 실행하며 성공 상태는 `DATABASE_RESTORED`다. 같은 버전의 Git 실행 코드·전용 runtime을 별도로 준비한 뒤 기존 소비 명령에 요청 경로를 전달한다. 범용 경로 조회는 파일을 생성하지 않는다. 복구본의 초기 latest는 R5.3에 따라 source/latest 검증이 필요한 단계에서 생성하며 restore 자체에 두 번째 DB 복사를 요구하지 않는다. 이후 backup은 미추출 자료의 논리 상태를 보존하고 실제 delta만 반영한다.

v3/v4 저장 영수증은 실제 generation/revision을 사용한다. 기존 receipt의 `snapshot`·`snapshotId` 필드명만 보고 숫자 ID를 추정하지 않는다. 명시적 `restore --snapshot <ID>`/`checkout --snapshot <ID>`는 실제 revision UUID 또는 보존된 legacy snapshot ID를 받으며 R2의 과거 원본 범위로 실행한다. restore는 새 destination, checkout은 현재 존재하지 않는 prefix에만 사용한다. 기본 DB 복구와 과거 원본 export의 시간·결과는 따로 보고한다.

## 다른 환경으로 코드와 작업 DB 이전

2026-09-27 사용자 승인 범위는 로컬 commit·main 병합·push와 Linux/WSL로의 작업 DB 이전이다. Git은 코드·스펙·정식 Catalog·생성 데이터를 전달한다. 원문·판정·진행 상태가 든 작업 DB와 runtime은 Git 제외 대상이며 공개 저장소에 추가하지 않는다.

이관 수용 기준은 다음과 같다.

- Linux/WSL의 기존 Python 3.12+와 gcc는 설치 시작에만 사용한다. 기존 `setup_catalog_runtime.py`는 공식 SQLite 3.53.4 archive checksum을 확인하고 저장소 전용 runtime을 준비한다. 실제 실행기와 자식 Python의 loaded SQLite·WAL 기능을 확인하고 시스템 Python·SQLite는 변경하지 않는다. Windows 설치와 명시 runtime override도 유지한다.
- Windows/POSIX 원래 경로를 호스트 OS와 독립적으로 해석하고, 복구 mapping에 선언된 원래 root 안의 참조만 현재 root로 연결한다. 원 JSON·manifest·receipt의 경로 문자열과 SHA는 그대로다. 경로 이탈·다른 drive/root·링크는 허용하지 않는다.
- 보낼 자료는 writer가 변경하지 않는 일관된 최신 백업 SQLite와 작은 인계 manifest다. manifest에 코드 commit·DB SHA/bytes·schema·generation·변경 순번·canonical identity·중단 보존을 기록한다. 파일 수신 후 SHA와 DB identity를 다시 확인한다. 실행 코드와 근거가 누락된 과거 원본의 검증 한계를 숨기지 않는다.
- 기존 작업 DB를 덮어쓰지 않는다. 기본 restore는 새 목적지에서 R1을 수행한다. 명시적 `restore --into-checkout --destination <Git-root>`만 이미 있는 Git checkout root에 DB·mapping/report를 추가한다. 이 옵션은 snapshot/prefix export와 함께 쓰지 않으며 기존 workspace DB·journal·복구 mapping/report 또는 runtime 외 authoring 자료가 있으면 파일 생성 전에 거부한다. Git 코드·canonical은 바꾸지 않는다. 원래 데이터와 복구 기록을 보존하며 root mapping은 실제 실행 checkout에서 해석한다.
- 대상 Linux/WSL에서 같은 commit의 기존 명령으로 완료 배치 재수신과 한 Work 준비를 확인한다. 원본 Windows 폴더 없이 동작하고 기존 판정·중단 상태를 유지해야 한다. 복구·환경 설치가 모델 호출·메시지 전송·중단 큐 재개를 수행하지 않는다.

설치·전달의 실제 대상과 검증 결과는 인계 기록에 남긴다. `git pull`만으로 Git 제외 작업 DB까지 받았다고 보고하지 않는다.

EndeavourOS를 듀얼부팅하는 동안에는 Windows에서 대상 home 경로를 추정해 쓰지 않는다. Linux로 부팅한 뒤 실제 checkout에서 `git rev-parse --show-toplevel`로 root를 확인하고 Windows 파티션에 준비한 인계 manifest·SQLite를 읽는다. Code/runtime/DB 수신은 고정 채팅·인증 정보·실행 중 turn을 이전하는 동작이 아니다. 원래 세션 접근성과 중단 상태는 기존 운영 계약으로 확인한다.

## 출판사 소개를 수집과 함께 저장

사용자 요청에 따라 출판사 작품·판본 페이지를 읽는 같은 수집분에서 소개 원문도 보존한다. Factor 관찰 요약을 공식 소개로 전용하지 않는다. 조정자는 정확한 Work·ISBN과 소개 구간을 확인한 서지 입력을 기존 직렬 발행 경계에서 canonical `source_book_metadata`에 반영한다. 이 요청은 소개·서지 추가 범위이며 Factor 승격이나 과거 frozen candidate 수정 권한이 아니다.

수집 디렉터리에 원본 HTTP 응답, 수집 receipt, `publisher-metadata.json`을 함께 둔다. receipt는 `url`, `resolvedUrl`, 실제 `fetchedAt`(offset 포함 ISO 시각), `status`, 원본 `sha256`, `bytes`를 기록한다. 이미 보존한 응답은 다시 요청하지 않으며, 정확한 수집시각이 없거나 접근에 실패한 자료는 기록만 보존한다. 소개 텍스트는 해당 판본의 실제 소개 구간 전체에서 추출하고 HTML 정리·trim 후 표시값과 원본 바이트를 구분한다.

브라우저가 표시한 원문은 기존 collector의 `recordCapture(kind="browser-text")`로 저장한 실제 body·receipt를 그대로 사용한다. 이 typed 경로는 같은 collection의 `collection-session.json.workId`, receipt의 `rawPath`·SHA·bytes·HTTPS 요청/최종 URL과 실제 offset ISO `observedAt`을 검증하고 그 관찰 시각을 metadata의 `fetchedAt`으로 사용한다. `status`·`complete`가 null이면 원 receipt에서 그대로 보존하며 HTTP 200이나 완전한 HTTP 응답으로 바꾸지 않는다. 알려진 실패 status·불완전 capture·error 또는 실제 관찰 시각이 없는 자료는 반영하지 않는다. HTTP 경로의 기존 6필드·status 200 receipt 규약은 유지한다. 같은 URL의 JS shell receipt와 다른 browser body/소개를 섞지 않으며, 원문 소개가 같은 capture의 본문에 존재하는지도 확인한다. 출판사·Work·판본·소개 전체 구간의 의미 검토는 담당자의 책임으로 남는다.

`publisher-metadata.json`은 다음 객체의 배열이다. `metadata`는 기존 source row 형식이므로 선택 값도 문자열로 입력하고 확인하지 못한 값은 `""`로 둔다. `sourceUrl`과 `fetchedAt`은 입력하지 않고 검증한 receipt의 최종 URL과 시각을 사용한다.

```json
[
  {
    "metadata": {
      "workId": "exact-catalog-work-id",
      "isbn": "exact-volume-isbn",
      "publisherName": "",
      "itemCaption": "抽出した紹介本文",
      "salesDate": "",
      "imageUrl": "",
      "imprint": "",
      "pageCount": ""
    },
    "sourceFile": "publisher.html",
    "receiptFile": "publisher.receipt.json",
    "receiptSha256": "64-character-sha256-of-receipt-bytes",
    "captionKind": "original",
    "originalItemCaption": "抽出した紹介本文"
  }
]
```

`captionKind="summary"`로 요약을 표시할 때도 `originalItemCaption`에는 추출한 원문을 남긴다. 출판사 여부·동일 판본·소개 의미의 검토는 수집·서지 검토 담당자의 책임이다. hash와 ISBN 구조 검사가 그 의미 검토를 대체하지 않는다. 입력의 원문·receipt 경로는 같은 수집 디렉터리 내부의 파일이어야 한다.

browser-text도 같은 입력 객체를 사용하며 `sourceFile`·`receiptFile`은 새 HTTP receipt 대신 기존 실제 capture body·capture JSON을 지정한다. 원문과 receipt를 수정하지 않고 서지 입력만 추가한 새 collection revision으로 저장·백업한다.

```bash
node --import tsx scripts/import-publisher-book-metadata.ts --input <collection>/publisher-metadata.json --output .workspace/<new-publication-directory>
```

이 명령은 기존 저장 wrapper와 직렬 발행 경계를 사용한다. 입력·새 결과·실패는 즉시 영구 저장하고, 서지 발행 완료/중단 경계에서 백업·readback을 확인한다. 기존 collection 저장 후 서지 파일을 추가했다면 새 revision이 필요하다. 단순 수집 단계에서도 기존 `catalog_workspace.py save` 또는 direct collection의 디렉터리 저장을 사용한다.

- metadata 행이 없고 같은 Work·ISBN Volume이 존재하며 소개가 유효하면 한 응답에서 확인한 필드만 추가한다. 중복 ISBN·다른 Work 충돌·receipt/원문 hash 불일치는 발행 전에 실패한다.
- 기존 metadata 행은 빈 필드까지 그대로 보존한다. 같은 URL의 다른 수집분을 섞거나 수집일만 갱신하지 않는다. 기존 행의 갱신은 유지할 모든 필드를 한 응답에서 재확인하는 별도 완결 검토가 필요하다.
- 아직 canonical에 없는 ISBN은 `deferred-missing-volume`, 빈 소개는 `skipped-empty-caption`으로 보존한다. 정식 Work·Volume 추가 뒤 같은 입력을 다시 반영할 수 있다. 소개를 위해 Factor 승격을 요구하지 않는다.
- 기존 authority projection·finalize·build와 `publishDirectorySet`을 재사용한다. 다른 9개 table과 opaque 문서는 보존하고 baseline DB·source manifest 및 준비 artifact hash를 교체 전에 확인한다. 작업은 직렬로 실행하며 진행 중 Factor bundle의 frozen identity를 갱신하지 않는다.
- `receipt.json`의 실제 disposition, `published` 및 DB/생성 파일 readback을 확인한다. 생성된 `Volume.metadata`는 `03-ux-screen-contracts.md`의 상세 경로에서 사용한다. 양쪽 소개가 있으면 저장된 출판사 소개를 우선하고 다른 서지는 Rakuten 우선순위를 유지한다. 로컬 발행은 GitHub 발행·배포 증거가 아니다.

## Compact 발행 자료

- 신규 `catalog-compact-publication-v2`는 private catalog/registry 한 쌍을 사용한다. 작품별 두 DB 변경과 독립 expected-after 검사를 동일 attached SQLite transaction에서 수행한다. candidate 완료 후 명시 `--apply-canonical`이 별도 정식 반영을 수행하며 기존 publication은 보존한다. v1 발행·복원 reader도 유지한다.
- 공통 입력·실행 코드·원본 frozen/판정은 저장소의 정확한 member SHA에 결속한다. 새 파일만 저장하고 source/latest에서 실제 원문과 membership을 확인한다. 구 snapshot 의존은 명시적 pin으로 유지하며 임의로 새 revision ID로 바꾸지 않는다.
- 변경 전에 봉인하는 `plans/<workId>.json` (`catalog-compact-plan-v2`)은 원본 input/authority 참조·검토 시각·대상 before digest·권한에서 유도한 plan·registry 변경·canonical rebase를 보존한다. `works/<workId>.json` (`catalog-compact-work-v2`)은 plan SHA와 논리 delta·expected-after를 결속한다. 독립 `CatalogState` checker가 baseline과 승인 plan으로 기대 결과를 구성하며 실제 변경 결과에서 기대값을 만들지 않는다.
- 배치 기준 catalog/registry를 한 번 색인화하고 작품별 조회·검사는 해당 범위로 제한한다. 최종 전체 행 비교는 한 번 수행한다. 일반 검증은 원본 권한→plan 재구성과 독립 expected-after 비교를 사용하며 명시 audit는 원본 SQL materializer replay도 수행한다. 과거 SQLite의 물리 bytes와 같다고 주장하지 않는다.
- 무관한 canonical 전진은 `canonical-rebase-v1` receipt로 결속한다. 원래 동결 SHA를 보존하고 대상·Gold·대표판·prior·alias·schema/정책 의존을 비교해 실제 충돌을 거부한다. 새 기준으로 기존 frozen SHA를 덮어쓰지 않는다.
- 기본 checkpoint 간격은 50작품이다. 완전히 저장·백업된 checkpoint의 pair/receipt로 재개하고 이후 미완료 작업은 같은 불변 intent로 재적용한다. 최종 projection·제품 readback·backup 후 기존 STATE/completion 경로를 사용한다.
- prior/review reader는 원래 sealed 판정과 보존된 검토 문서를 읽는다. 구 full 형식도 지원하되 신규 compact를 위해 가짜 full 디렉터리를 만들지 않는다.
- 원본 의존 복원은 정확한 member/blob을 검증한다. 같은 경로의 다른 버전은 `restored-versions/<sha256>`와 `.catalog-restore.json`으로 분리하며 누락/손상은 실패로 보고한다.

## 세대 전환과 정리

활성 v4의 정상 정리는 `gc`다. 성공 종료 후 7일이 지난 비고정 execution과 그 소유 artifact·참조 없는 blob만 검증된 범위에서 제거한다. 명시적 소유 관계·receipt 의존·의미 있는 현재 head와 pin을 보존하고 v3에서 이어진 수명 불명 artifact는 자동 삭제하지 않는다. 의미 있는 큐레이션 이력·미해결 실패·활성/legacy pin은 시간이나 mtime만으로 제거하지 않는다. 배치마다 VACUUM을 하지 않는다.

새 compact 배치는 `compact-working`과 `checkpoints`의 정확한 임시 범위를 실행 시작 때 선언하고, checkpoint의 `execution-artifact` revision·head·소유권을 같은 commit에 결속한다. 미완료 실행과 canonical 반영·백업이 남은 실행의 사본은 보존한다. 요청된 후보·정식 반영과 readback·백업이 모두 끝나면 종료를 한 번만 기록하고, 저장 SHA 및 `latest.sqlite`의 실제 원문과 일치하는 선언 범위의 파일만 정리한다. 변경·추가 파일이나 살아 있는 참조가 있으면 보존하고, 임시 범위가 남아 있는 동안 GC도 소유자와 복구 자료를 유지한다. 정상 GC는 7일 수명이 지난 이 명시적 임시 head만 예외적으로 제거할 수 있으며 일반 artifact·근거·큐레이션 head에는 적용하지 않는다. 실행 시작 시각은 payload에 보존하고 종료 후 재수신으로 보존 기간을 연장하지 않는다. 최종 배치 저장은 이 임시 사본을 제외하고 발행·판정·원문·완료 근거를 보존한다. 이 규칙은 과거 자료의 일괄 삭제 권한이 아니다.

완료 재수신에서 source/latest의 같은 execution 원문·membership·종료 상태·종료 시각이 일치하고 선언된 임시 경로가 모두 없으면, 정리 결과를 읽기 전용으로 재사용한다. 이 경우 전역 복구 제어 자료 수집·백업을 반복하지 않는다. 경로가 다시 생겼거나 종료/백업이 미완료이면 기존 종료·백업·소유권 및 원문 readback 경로를 수행하며, 새 파일·변경 파일·살아 있는 참조는 그대로 보존한다. 이는 완료한 임시 사본 정리만의 재사용이며 새 수집·판정·발행 단계의 백업을 대신하지 않는다.

v3→v4는 writer 중지 → 기존 최종 백업 → 전용 runtime 확인 → schema/WAL 전환 → source·backup·generation/revision readback → writer 재개의 명시적 운영 전환이다. `catalog_retention.py upgrade-v4 --enable-wal`이 publisher/commit lock과 maintenance intent 아래 기존 백업·실제 v4 전환·새 백업·STATE readback을 결속한다. 중단된 같은 전환은 `--resume`으로 재개한다. 기존 generation과 revision을 유지하고 v4 인덱스·변경 순번을 추가한다. 전환 후 새 쓰기가 있으면 과거 파일의 단순 복원으로 변경을 버리지 않는다. 이 경계는 아래 과거 v2 retention cutover와 다르며, 문서나 runtime 설치만으로 전환됐다고 보고하지 않는다.

```powershell
# writer 중지와 실제 runtime 설치를 확인한 뒤 실행
python scripts/catalog_python.py scripts/catalog_retention.py upgrade-v4 --enable-wal
# 동일 maintenance intent가 미완료인 경우에만
python scripts/catalog_python.py scripts/catalog_retention.py upgrade-v4 --enable-wal --resume
```

v2에서 v3으로의 전환 순서는 read-only plan → `workspace.next.sqlite` 선택 복사 → 현재 값·원문·실제 prior/재개 검증 → 별도 새 백업 → writer 중지 경계의 DB/STATE 교체다. DB pathname 교체는 atomic이지만 DB와 STATE 전체는 하나의 atomic transaction이 아니다. `RETENTION-MAINTENANCE.json`의 같은 intent로 중단된 전환을 재개한다.

```powershell
# 아래 build/activate는 v2에서 v3으로 전환할 때만 사용
python scripts/catalog_python.py scripts/catalog_retention.py plan --output <retention-plan.json>
python scripts/catalog_python.py scripts/catalog_retention.py build --plan <retention-plan.json> --legacy-integrated <원래-result-root> --report <build.json>
python scripts/catalog_python.py scripts/catalog_retention.py verify --build <build.json> --report <verified.json>
python scripts/catalog_python.py scripts/catalog_workspace.py --database data/local/catalog-authoring/workspace.next.sqlite backup --destination data/local/catalog-authoring/backups/retention-next.sqlite
# 모든 writer 종료 확인 후. 중단된 같은 전환은 --resume
python scripts/catalog_python.py scripts/catalog_retention.py activate --build <build.json> --verification <verified.json>
# 실제 새 경로 readback 후 cutover가 지정한 구 v2 파일에만 적용
python scripts/catalog_python.py scripts/catalog_retention.py prune-retired --cutover data/local/catalog-authoring/RETENTION-CUTOVER.json
# 활성 v4 정상 정리: 검토 후 승인된 범위만 적용
python scripts/catalog_python.py scripts/catalog_retention.py gc
python scripts/catalog_python.py scripts/catalog_retention.py gc --apply
```

전환 전 아직 v2인 저장소에는 v2 동작을 유지한다. revision schema로 해석하거나 숫자 snapshot을 UUID로 치환하지 않는다. v3/v4를 이해하지 못하는 코드는 schema 검사에서 거부한다. plan 이후 입력·보호 파일이 바뀌면 다시 선별한다. 검증된 plan 범위 밖 물리 사본을 함께 삭제하지 않는다. `.workspace/user-sources/`, `handoff/`, 미분류 사용자 자료와 활성 의존은 보호한다.

원본의 권한·의미·검증 한계는 축소 후에도 유지한다. 정리 완료는 실제 제거와 readback으로 확인하며 archive로 이름만 바꾼 것을 축소라고 보고하지 않는다. 계약 갱신만으로 DB 전환·정리·큐 재개를 실행하지 않는다.
