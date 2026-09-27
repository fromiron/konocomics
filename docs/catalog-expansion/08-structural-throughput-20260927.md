# Catalog 구조적 고속화 구현·검증 기록

## 2026-09-27 SDD 구현과 검증

사용자가 구현보다 스펙 구체화를 먼저 요청하여 코드 수정과 복구·회귀 시험을 중단한 뒤, R1~R9를 정리하고 사용자의 개선 진행 지시에 따라 구현을 재개했다. [저장 계약 R1~R9](03-local-authoring-storage.md#db-중심-복구-요구사항)가 현재 목표의 단일 스펙이다. **기본 DB 복구·요청별 자료 준비·부분 작업 폴더의 정상 증분 백업을 구현하고 실제 운영 백업의 격리 복구본에서 확인했다.** 새 입력 준비, 완료 배치 재수신, 통지, metadata와 canonical 중단 복구의 기존 CLI 검증도 마쳤다. 과거 원본 도구 누락 검사 4개와 다음 승인된 운영 배치에서 확인할 고정 세션 자동 전환은 남은 한계다. 아래에서 과거 이력과 현재 증거를 구분하며 전체 플랜의 운영 완료나 신규 수집·판정 처리량으로 확대하지 않는다.

기본 복구는 검증된 백업 SQLite에서 workspace DB만 복원·검증한다. 파일 전개는 기존 소비 명령이 요청한 자료에 한정한다. 아직 파일로 꺼내지 않은 자료를 삭제로 오해해 백업의 현재 상태를 바꾸면 안 된다. 기존 v4 저장·증분 백업·Work 범위 동결 개선은 유지하고, 기본 복구의 전역 작업 트리 전개와 이를 전제로 한 소비 경로를 교정한다.

| 순서 | 변경 대상과 실제 진입점                                                                     | 다음 단계로 넘어갈 조건                                                                                         |
| ---- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1    | `catalog_workspace.py restore` / `catalog_retention.py`: DB 복사·검증과 파일 전개 분리      | R1: 원본 폴더 접근 없이 DB·mapping/report만 생성, artifact 0개, schema/generation/순번/무결성 일치              |
| 2    | `catalog_workspace.py backup` / `catalog_revision_store.py`: 미추출 자료의 논리 상태 보존   | R5: 빈 파일 환경과 STATE·한 Work만 추출한 환경 모두에서 기존 head·등록·중단·현재 효과 유지, 최초 이후 증분 백업 |
| 3    | 기존 `catalog_authoring_batch_publish.py` CLI: 요청 summary와 완료 증거만 준비              | R3/R4: 실제 원본 완료 summary 재수신, 요청 외 Work 추출·모델 호출·중복 발행 0건, 요구한 canonical 효과 readback |
| 4    | 기존 runner·notification 명령: 한 Work/run 또는 명시 session/event의 자료만 준비            | R3/R7/R9: 정확한 SHA로 재개, 완료 결과를 과거 HOLD로 대체하지 않음, 중단·turn·generation·통지 상태 보존         |
| 5    | 기존 metadata·canonical CLI: 요청 입력·동일 pending intent의 현재 효과 복구                 | R6: 실제 DB·정적 데이터·백업 readback, 중간 장애 후 같은 명령 재시도와 중복 적용 차단                           |
| 6    | 동결된 구현의 관련 Python 회귀, `typecheck`, `lint`, `test`, `catalog:validate`와 제품 흐름 | 요구 ID별 실제 근거 기록, 실패·환경 한계 구분, 앞 단계 미충족이면 대규모 계측으로 넘어가지 않음                 |

각 단계는 스펙의 수용 기준을 기존 실제 진입점의 작은 재현 검사로 작성하고, 미충족을 확인한 뒤 구현과 같은 경로의 재검증으로 닫는다. 검증 전용 진입점이나 범용 파일 조회의 숨은 쓰기를 추가하지 않는다. 1·10·50작품 장시간 비교는 위 동작이 확인된 뒤 동일 입력·동일 포함 범위로 필요한 경우에 수행한다. 오류가 나면 해당 요구와 직접 의존을 확인하며 과거 전체 복원으로 범위를 넓히지 않는다. 누락된 원 도구가 필요한 과거 Authoring 검사 4개는 별도 한계로 남기며 가짜 원본 생성·manifest 완화로 PASS를 만들지 않는다.

### DB 전용 복구와 요청별 소비의 실제 실행

같은 운영 백업을 새 목적지 `sdd-restored-r001`로 복구했다. 실행 observer는 기존 공개 CLI를 호출하면서 원래 운영 artifact 접근과 새 child process를 거부했다. 실행 코드·runtime은 별도로 공급했으며, 수동으로 원본 자료를 복구본에 추가하거나 모델을 호출하지 않았다. 시간은 각 실행의 관측값이며 서로 다른 작업의 속도 배수나 신규 수집·판정 처리량으로 환산하지 않는다.

| 요구           | 기존 진입점에서 확인한 결과                                                                                                                              |                         경과시간 | 근거 (`.workspace/catalog-throughput-20260926/` 기준)              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------: | ------------------------------------------------------------------ |
| R1/R8/R9       | 3,522,621,440-byte 백업에서 workspace DB·mapping·report만 생성, artifact 0개. generation·5,363 revision·seq 23,984·무결성/FK 일치, 원본 접근 0회         |                        36.3815초 | `SDD-RESTORE-r001.json`                                            |
| R2/R5          | 빈 작업 폴더에서 정상 초기 backup, 명시 STATE·한 Work checkout 후 재백업. 미추출 논리 자료·head·중단 상태 보존, source/latest 일치                       | 초기 73.7384초 / 재백업 0.2641초 | `SDD-BACKUP-r001.json`                                             |
| R3/R4/R6/R7/R9 | 원래 17행 summary와 원래 절대 경로를 `--apply-canonical`에 전달. 5건 ALREADY_APPLIED·12건 HOLD, 재판정·중복 발행·무관 completion 조회·다른 Work 추출 0건 |                        10.2864초 | `sdd-restored-r001/.verification/sdd-rereception-r001/RESULT.json` |
| R3/R5/R7/R9    | 실제 보존 F6 run을 기존 `prepare`로 재개. 필요한 48파일만 추가, 같은 frozen·RUN 바이트와 권한 head 유지. 새 준비는 PERSISTED                             |                         4.0759초 | `sdd-restored-r001/.verification/sdd-prepare-r001/RESULT.json`     |
| R5             | 해당 준비 후 정상 backup은 blob 1개·revision 1개·4,254 bytes만 증분 반영, PREPARED 원문의 source/latest readback 완료                                    |                         0.3614초 | `sdd-restored-r001/.verification/sdd-prepare-backup-r001.json`     |
| R6/R9          | 마지막 읽기에서 canonical/static 485파일 SHA와 STATE 불변, pending 없음. source/latest의 5,364 revision·5,075 heads·seq 24,060 일치                      |                        읽기 검증 | `sdd-restored-r001/.verification/SDD-FINAL-READBACK-r001.json`     |

복구 후 workspace는 실제 SQLite 3.53.4의 WAL/FULL이며 latest는 DELETE/FULL이다. 원래 generation `53d00f3c-e974-417e-a145-6f7d487b144a`를 보존했다. 정식 제품 identity는 `v1-e4a0fc8842b4`, canonical SHA는 `4ae2fccc8c82e42528090fb1116cab50bb24f06d6be61c209bb38d748b7d1c8c`, STATE SHA는 `3258e6b50bf21a97823d40961449407829b87c85b7e07c9562d7d121c102f6bb`다. 새 private 준비의 저장·백업 외에 실제 운영 DB·큐는 변경하지 않았다.

요청 자료의 선택·blob 검증·private 파일 생성은 공유 반영 락 밖에서 수행한다. 락 안에서는 최신 control head의 해당 경로 SHA와 명시 삭제 tombstone을 다시 확인한 뒤 shared 파일만 반영한다. 독립 변경은 허용하되 선택 경로 변경·삭제는 거부한다. 명시 delta 저장도 같은 artifact commit에 결속하며 파일 미추출을 삭제로 추론하지 않는다. 요청별 core 14개 회귀와 별도 소스 검토에서 이 경계를 확인했다(`R3-REQUESTED-RECOVERY-CLOSEOUT.json`). 작은 fixture의 락 시간은 실제 운영 성능 수치로 보고하지 않는다.

### 새 입력과 준비 초기 중단의 추가 확인

완료 결과 재사용과 별도로, 운영 latest의 새 DB 전용 복구본에서 실제 Work `work-7783c60325de208ab8c6`의 원 job을 기존 `prepare --job`에 전달했다. 원래 운영 폴더 읽기는 child freeze까지 차단했다. 첫 실행은 5.115초에 FAIL했다. retained basis의 전체 manifest 검사가 요청하지 않은 다른 Work review까지 요구한 것이 원인이었으며 `sdd-new-prepare-evidence/attempt-1.*`에 그대로 보존했다.

retained basis에 한해 원 manifest·저장 anchor·정확한 pair와 요청 Work의 review·curation을 검증하도록 기존 소비 경계를 수정했다. 전체 publication/감사 검사는 유지했다. 같은 CLI로 새 run을 준비한 두 번째 실행은 7.621초에 PASS했고 새 frozen SHA `97cedb80dfa4a3e40e00bf3291a3d7bfa20d15b975f2b3a55972b2d4c222195e`와 모델 입력·프롬프트·schema를 만들었다. 기존 frozen 재사용·모델 호출은 0건, 원 canonical·STATE·job·frozen·판정 바이트는 그대로다. 이 실행은 `PERSISTED`이며 단계 `BACKED_UP`으로 보고하지 않는다(`sdd-new-prepare-evidence/attempt-2.*`).

최종 readback은 새 run 67파일의 정확한 revision·membership·blob을 확인했다. frozen은 59파일·1,299,185 bytes이며 provenance 35개는 이전 표본의 33개와 같은 SHA에 원 research receipt에 결속된 `collection-events.jsonl` 2개가 추가된 범위다. 원 basis manifest 473항목을 유지하면서 실물은 요청 review 1개를 포함한 5파일만 준비했다. 미완료 READY도 기존 runner 선택기를 재사용해 현재 canonical과 과거 동결 원본을 분리한다. 관련 3-module 21개와 Windows 경로 이탈 음성 검사 1개가 각각 PASS했다. 실행별 코드 identity와 마지막 Windows 경로 정규화의 영향 범위는 `sdd-new-prepare-evidence/closeout.json`에 보존한다.

반영 준비가 seal 이전에 중단돼 `begin.json`만 보존된 경우도 기본 DB 복구 뒤 같은 원 CLI 인자로 재개했다. 원 begin/source 바이트와 candidate SHA readback을 확인했다. 선택 case 1개 PASS·다른 4개 filter 제외, 63.87초다(`canonical-pre-seal-20260927.log`). 실행 중 독립 R3 변경이 있었으므로 단일 전체 core SHA의 검증으로 확대하지 않는다. 해당 begin/prepared 선택 조건은 실행 전후 동일했고, 원본 intent 보존·재개 동작을 검사했다.

### 최종 통합 검증

관련 Python 24-module 회귀는 342개·283.558초·skip 0·실행 중 코드 불변이며 전체 결과는 FAIL이다(`SDD-REGRESSIONS.json`). 과거 wrapper 원본 누락의 고유 검사 4개에서 failure 기록 4개와 error 1개가 발생했고 나머지는 통과했다. 이전 Candy 입력 경계 오류는 재현되지 않았다. 누락된 두 wrapper를 합성하거나 manifest·검사를 완화하지 않았다. 이전 FAIL 보고서도 보존한다.

이후 native metadata 복구 검사에서 STATE가 없는 저장소의 pending intent만 보고 실제 보존된 source까지 생략하는 결함을 확인했다. `catalog_recovery.py`의 해당 분기를 고쳐 같은 저장 revision의 source 전체와 해당 버전 정적 자료만 준비한다. source가 실제 없거나 현재 controls에서 명시 삭제된 경우는 계속 absent로 보존한다. 기본 DB 복구·역사 verify·기존 consumer 소스는 바꾸지 않았다. 이 후속 변경은 위 broad 실행 이후이므로 별도 영향 회귀와 native CLI 재실행으로 검증한다.

후속 복구 영향 회귀는 실제 runner·notification·canonical·완료 재수신을 포함한 6-module 82개가 75.168초에 PASS했고 skip 0·코드 불변이다(`SDD-RECOVERY-FINAL.json`). core SHA는 `d5a523b0d77e6e9ab1d142195ce5daaf5a5fe3248b5f47ff1121d4924b124a4f`다. broad 검사 수와 중복 합산하지 않는다.

`typecheck`·`lint`·변경 파일 format·`git diff --check`와 두 Catalog 스킬 검증은 통과했다. `catalog:validate`는 3,309 works·3,313 volumes·오류 0·경고 38,487건이다. 경고를 제거한 결과로 보고하지 않는다.

전체 Vitest 첫 실행은 460.36초에 FAIL했다(`sdd-vitest.log`). 112개 파일·923개 검사가 통과하고 4개 파일·5개 검사가 실패했으며, metadata 파일 1개/검사 1개는 source-map 오류로 결과가 보고되지 않았다. canonical의 실제 중단·복구 4개는 이 실행에서 통과했다. 이 전체 실행을 나중에 PASS로 덮어쓰지 않았다.

일반 실패 5개는 승인된 F6 정식 반영 뒤 파생 파일이 갱신되지 않은 원인이었다. 기존 공개 CLI 결과와 비교해 registry 3,309행 중 F6 한 행의 8개 필드만 다르고, 추천 비교 golden은 버전 한 줄만 다름을 확인했다. 전체 Catalog `v1-e4a0fc8842b4`와 eligible 2,021작품 projection `v1-862f722c212e`는 각 범위로 계산한 별도 identity다. projection에서 F6만 제외하면 기존 golden의 `v1-818991b07eda`가 재현되며 기존 작품·점수·순위·보고서 본문은 같다. 기존 registry 생성 CLI와 baseline CLI로 두 파생 파일만 갱신했고, 실패했던 네 파일의 17개 검사는 129.22초에 모두 PASS했다(`sdd-derived-fixtures-focused.log`). 엔진·산식·검사 기대 코드의 변경은 없다.

metadata 원 CLI의 실제 실패는 원 prepared의 Windows `data\\source\\catalog.sqlite` 경로를 private scratch에 조합할 때 검증된 정규화 값 대신 raw 값을 사용한 결함이었다. 같은 경계의 역사 verify 경로도 이미 검증된 `files.key()` 값을 사용하도록 수정했으며 원 prepared 바이트·SHA는 그대로다. 진단용 계측을 제거한 원 테스트로 최종 재실행한 결과 1/1 PASS·145.25초, 8개 실행 파일의 전후 SHA가 같았다(`metadata-final-20260927T192321431/runner.log`, `identity-before.json`, `identity-after.json`). 실제 pending 복구·lock broker 반영·DB/source readback·불변 receipt·역사 재수신·원본 폴더 접근 차단·다른 입력의 무덮어쓰기를 확인했다. 최종 core SHA는 `620b5702ca69b857057501356c4b6397749701c899b783f8283ef162f6b54497`다. TS 통합 근거는 `ts-db-only-cli-verification-20260927.json`에 있다.

최종 소스 동결 뒤 `typecheck`·`lint`·영향 파일 format을 다시 통과했다(`sdd-final-typecheck.log`, `sdd-final-lint.log`, `sdd-final-format.log`). 변경으로 영향받은 검사만 다시 실행했으며 전체 Vitest를 새로 모두 실행했다고 주장하거나 중복 검사 수를 합산하지 않는다. 현재 확인된 실행 실패는 위 후속 검사로 해소했고, Python의 과거 원본 누락 4개는 별도 한계로 유지한다.

운영 원본의 마지막 읽기는 source/latest 모두 generation·5,363 revisions·seq 23,984·control head가 유지되고 canonical·STATE SHA도 같은 것을 확인했다(`SDD-OPERATING-READBACK.json`). 실제 고정 세션의 자동 단계 전환은 다음 승인된 운영 배치에서 확인해야 한다. 이번 복구·검증으로 중단된 작업자를 재개하지 않았다.

## 이전 구현·검증 이력

이하의 '일반 current 복구'와 초기 DB 두 개 생성 설명은 DB 중심 스펙 이전의 구현 이력이다. 다음 구현의 규칙으로 재사용하지 않으며 현재 규칙은 위 R1~R9를 따른다.

2026-09-27. 기준 commit은 `020161d96d7b1bd316591613601f86878db8340f`이며 아래 변경은 작업 브랜치 `catalog-pipeline-throughput`의 미커밋 구현이다. **추가 구조 개선·검증 중**이다. 실제 운영 작품 1건의 정식 반영·앱 readback, 원본 전체 summary의 중복 수신, 실행 사본의 보존 수명 구현·private 실증과 영향 회귀는 완료했다. 아래 r005의 1·10·50작품 발행 및 대규모 독립 복원은 과거 full dependency closure를 따라가는 구조의 실측이다. 50작품 약 43.7분과 대규모 원본 복원을 최종 일반 운영 경로의 완료로 인정하지 않고, 검증된 최신 기준점 중심의 일반 복구와 Work 범위 동결을 추가 구현한다. 과거 테스트 4개에는 별도 원본 도구 누락에 따른 검증 한계가 남는다. 이 문서는 전체 플랜 완료나 새 작품 수집·판정 처리량을 인증하지 않는다. 현재 실행 근거는 저장소의 `.workspace/catalog-throughput-20260926/`에 보존한다.

### DB 중심 스펙 이전의 복구 시도

일반 복구는 이미 검증된 최신 curation basis, 현행 catalog/registry pair와 review, completion proof, 실제 미완료 작업 의존을 복구하는 범위로 좁힌다. 옛 full frozen/전체 실행 자료를 따라가는 원본 replay는 명시적 감사 경로로 분리한다. 새 freeze는 해당 Work가 실제 사용하는 source·receipt를 결속하고 `.workspace/user-sources/` 전체를 반복 복사하지 않는다. 사용자 제공 원본을 삭제하거나 기존 frozen SHA를 고치는 변경은 아니다.

이 방향은 승인된 추가 구현 대상이며 문서만으로 완료된 동작이라고 주장하지 않는다. 기존 `advance_basis`와 prepare/storage 진입점을 재사용하는 실제 인터페이스를 구현 담당과 맞춘 뒤 명령·스킬을 확정하고 일반 복구의 영속성·readback을 다시 검증한다. 고정 세션·모델·작품별 의미 판정·중단 보존을 유지하고 새 재판정 권한을 추가하지 않는다.

일반 복구 초기 DB 생성은 일관된 workspace 사본 1회와 복구본의 정상 `backup()`을 통한 초기 latest 생성 1회로 구분한다. source/latest 검증을 생략하는 경로가 아니며 이후 정규 백업은 증분이다. 첫 실제 backup-only 복구는 디스크에 정확한 SHA로 남아 있던 과거 완료 summary가 저장 DB에 보존되지 않아 실패했다(`CURRENT-RECOVERY-RESTORE-r001-fail.json`). FAIL과 `unpreserved file` 오류를 보존했고 원본을 복구본에 수동 추가하지 않았다.

정상 backup 생산자가 불변 completion마다 원 summary·CHECKED·RUN·판정·frozen manifest/job·sealed manifest의 필요한 identity 자료를 한 번 보존하고 이후 재사용하도록 보완했다. 옛 full RUN·frozen·provenance의 반복 복사는 추가하지 않았다. 이 수정 직후 실제 운영 backup은 34.082초에 PASS했고 보호 파일 bytes는 변하지 않았으며 source/latest 모두 같은 generation의 revision 5,358개·sequence 16,252와 같은 recovery control을 확인했다(`CURRENT-RECOVERY-BACKUP-r002.json`). 이것은 해당 시점 backup 생산자 검증이며 일반 복구 재시도 성공을 뜻하지 않는다.

일반 복구 r001~r005의 실제 FAIL은 각각 `CURRENT-RECOVERY-RESTORE-r001-fail.json`부터 `r005-fail.json`과 같은 이름의 log에 보존했다. 이 복구 시도 번호는 아래 과거 full dependency closure 발행 기준선 r005와 별개다. 완료 summary, Work 상대 경로의 research/CHECKED, 이전 결정 경로와 과거 history alias에서 필요한 바이트를 찾지 못해 중단됐으며 결과를 PASS로 덮어쓰지 않았다. 일반 복구 r005 뒤에는 history container와 파일에 결속된 SHA를 함께 사용해 현재 정정 자료를 찾도록 수정했다. 현재 정정 SHA의 원문은 실제 보존되어 있었고 옛 blob·history·원본 receipt를 삭제하거나 재작성하지 않았다. 일반 restore의 후속 재검증은 아직 완료로 확정하지 않는다.

일반 복구 r006은 현재 범위를 잘못 고르는 결함을 확인해 중단했다(`CURRENT-RECOVERY-RESTORE-r006-interrupted.json`). 완료 run을 먼저 제외하고 `(Work, status)`별로 선택하여, 이미 완료된 최신 READY 대신 이전 HOLD/READY 트리를 다시 현재 의존으로 복원하고 있었다. 중단 시점의 불완전 목적지 파일 수는 50,649개였으며 최종 restore/readback은 없었다. 실행 명령과 PID 32988을 확인한 private 검증 프로세스만 중단했고 목적지·로그를 보존했다. 운영 작업자 재개나 원본 변경은 없었으며 이 시도는 시간 비교 대상이 아니다.

이 지연의 주요 원인은 과거 복원 범위가 여전히 넓었던 점이다. 현재 범위를 먼저 충분히 좁히기 전에 개별 누락을 차례로 고치면서 검증 시간이 늘어났다. 수정 계약은 완료 run까지 포함해 Work별 최신 유효 판정을 먼저 고른 뒤, 그 판정이 완료됐다면 실행 전체 트리를 제외하는 것이다. 실제 미완료 summary·기존 pending 작업이 특정 과거 CHECKED와 SHA를 요구하는 의존은 유지한다. READY와 HOLD를 각각 하나씩 현재로 보존하는 규칙이 아니다. 문서·스킬에 이 기준을 명시했고 구현 수정 뒤 새 일반 복구 실행 증거를 기다린다.

후속 읽기 전용 집계에서 잘못 재선택한 17개 RUN의 직접 subtree는 3,765개 파일·200,463,370 bytes로 확인했다. 이 값으로 중단 당시 50,649개 전체가 불필요했다거나 지연 전체가 이 결함 하나 때문이었다고 주장하지 않는다. 이후 사용자가 DB 한 파일 복구를 명확히 하여, 전역 파일 선택을 더 다듬는 대신 기본 DB 복구와 요청별 파일 사용을 분리하는 R1~R9로 재정렬했다.

정상 변경 없는 backup의 경로 처리 비용도 별도로 측정했다. 아래 세 실행은 source/latest 모두 revision 5,363개·sequence 23,984로 같았고 canonical·STATE·통지 큐를 포함한 보호 bytes가 변하지 않았다.

| 변경 없는 정상 backup 관측    |   경과시간 | 근거                                            |
| ----------------------------- | ---------: | ----------------------------------------------- |
| 기존 경로 처리의 warmed 실행  |  45.9701초 | `CURRENT-RECOVERY-BACKUP-r005-warm-before.json` |
| 저장 경로의 lexical key 처리  |  21.2343초 | `CURRENT-RECOVERY-BACKUP-r005-lexical.json`     |
| 같은 호출 안의 key 해석 cache | 5.195157초 | `CURRENT-RECOVERY-BACKUP-r005-cached.json`      |

cache는 호출 안에서 같은 경로 key의 반복 해석만 공유하며 다음 호출에 결과를 영구 재사용하는 cache가 아니다. 이 시간은 정상 backup 명령의 해당 표본이며 모델 수집·판정 처리량이나 새 일반 복구의 완료 시간을 뜻하지 않는다. 일반 restore 재시도 후반은 독립 Python 통합 회귀와 겹친 실행도 있으므로 복구 경과시간을 격리된 성능 비교나 속도 배수 근거로 사용하지 않는다. 파일 범위·DB 결과·원본 접근 차단·중단 보존을 확인하는 실행으로 구분한다.

### 추가 구조 변경의 통합 회귀 기록

`CURRENT-REGRESSIONS.json`의 실제 20-module 실행은 309개 검사, 191.520초, skip 0이며 결과는 FAIL이다. 기록된 failure 4개에는 target 검사의 subtest 2개가 포함되고 error 2개가 있다. 이는 고유 Authoring 4개 메서드의 원본 wrapper 누락과 Candy provenance 입력 경계 검사 1개에 해당한다. 앞선 222개·134개 실행과 합산하거나 전체 PASS로 바꾸지 않는다.

Candy 검사는 session 없는 세 collection의 부모 폴더를 새 freeze에 넘기던 기존 시험 입력이 Work 범위 계약과 맞지 않았던 문제다. 테스트만 기존 collector `start --input` 반복과 `write` 명령을 실제 실행하도록 고쳤고, 정확한 원본 파일을 같은 Work collection에 결속해 기존 freeze 경로를 재실행했다. `CANDY-REGISTRY-TEST-CORRECTION.json`은 5.245초 PASS, 모든 원문·supplemental SHA와 원래 registry correction SHA 일치, 기존 provenance/job/registry/frozen 불변을 확인한다. mock·새 진입점·production guard 완화·모델 호출은 없었다. 통합 실행 FAIL/ERROR는 원본으로 보존하며 남은 Authoring 4개의 exact wrapper 누락 한계는 그대로다.

### 새 Work 범위 동결의 실제 진입점 확인

`work-capture-native/attempt-2.json`과 후속 `work-capture-native/closeout.json`에서 실제 보존 Work `work-7783c60325de208ab8c6`를 private 저장소의 기존 `prepare_factor_batch.py freeze` CLI로 새 동결했다. 자동 입력 저장을 포함한 정상 진입점으로 실행했고 freeze·표준 `catalog_authoring_runner.prepare_session_input` 모델 reading view의 exit code가 모두 0이었다. 이전 provenance 3,025개 파일은 새 동결에서 해당 Work 리드 1개와 원 collection 17개·수정 collection 15개, 총 33개로 줄었다. reading view에서는 실제 raw capture 11개, 결속 source 8개와 해당 Work의 추가 리드 1개를 확인했다.

자동 저장한 입력 revision은 총 516개 파일이며 `.workspace/user-sources/`에서는 정확한 해당 Work 파일 1개만 포함하고 이전 run의 frozen 파일은 0개였다. 따라서 동결 출력만 줄이고 사전 저장에서 큰 리드 디렉터리를 다시 복사하는 형태도 이 표본에서 제거됐다. 새 private generation은 `3e363f9a-44d7-40a2-a35c-5f4009b8b4a8`이며 기존 원본 frozen·판정은 바뀌지 않았다. 운영 canonical·STATE·source/latest는 이 private 실증의 변경 대상이 아니다.

후속 closeout의 native freeze 재실행은 4.742초였다. `attempt-2.json`의 `freezeSeconds=null`은 이전 관측 기록으로 그대로 두며 이 후속 측정과 구분한다. 해당 실행은 이미 채워진 private 저장소와 복사된 환경을 사용하므로 전후 처리량 개선율로 환산하지 않는다. 원래 research·evidence·supplementalEvidence·priorClaims·priorDecisions와 캡처 bytes가 유지됐고 운영 canonical·STATE·작업 저장소·큐를 변경하지 않았다.

실행 runtime 109개 파일의 사전·private 사후·closeout 시점 root SHA는 같았다. 처음의 전체 scripts 관측기는 별도 `test_catalog_recovery_notifications.py` 한 파일의 동시 변경 때문에 FAIL했으며 `final-report.json`과 로그를 그대로 보존했다. 그 unittest 파일은 freeze·사전 저장·모델 읽기 import 경로에 없고 두 명령에서 실행되지 않았으므로, 별도 closeout은 실제 실행 runtime의 동일성을 근거로 해당 차이를 이 실증에 비본질적인 것으로 판정했다. operation receipt의 Git `020161d9`·`uncommittedCode=false`는 private 경로가 상위 checkout을 발견한 값이며 복사해 실행한 코드 identity의 증거로 쓰지 않는다.

이 closeout의 제한된 검사 범위는 Python focused/notification 27개 PASS(11.57초·skip 0), collection JavaScript 2개 PASS(skip 0), 영향 JavaScript ESLint·typecheck·diff PASS다. 전체 Python 회귀를 새로 통과한 것으로 확대하거나 기존 검사 수와 합산하지 않는다. 첫 절대 researchRef 경로 실패와 관측기의 packet 표시 필드 오류도 보존했고 원래 job bytes는 고치지 않았다.

이 결과는 새 입력의 `PERSISTED`와 읽기 경로 확인이다. 단계 `BACKED_UP`이나 새 의미 판정·운영 발행을 증명하지 않는다. 보충 파일의 실제 source/latest 결속은 별도 `test_normal_collection_requires_supplemental_bytes_in_source_and_backup` 회귀 범위이며 standalone 실행의 단계 백업으로 보고하지 않는다. 일반 current 복구는 별도 구현·검증 중이다.

## 구현과 운영 전환

- 파일 읽기·SHA·압축·기존 blob 확인을 SQLite writer 밖으로 옮겼다. 변경 없는 저장은 쓰지 않으며, commit에는 신규 blob·revision/head·변경 순번을 함께 기록한다.
- 작업 저장소를 schema v4 / WAL / FULL로 전환했다. generation `53d00f3c-e974-417e-a145-6f7d487b144a`와 기존 revision/frozen SHA를 유지했다. 전환 전 복구본은 `data/local/catalog-authoring/backups/pre-v4.sqlite`, 전환 readback은 `data/local/catalog-authoring/STORAGE-V4-UPGRADE.json`에 보존한다. canonical/registry와 백업 latest는 DELETE 모드다.
- Catalog 전용 Python 3.13.15가 실제 SQLite 3.53.4를 로드한다. 시스템 Python을 바꾸지 않았으며 `scripts/catalog_python.py`가 전용 실행기를 선택한다.
- 정규 백업은 최초 검증 이후 변경 cursor까지의 delta를 기존 latest의 단일 transaction에 적용한다. source snapshot은 delta 수집 후 닫고, 실패한 백업은 이전 cursor로 rollback한다.
- source/backup별 invocation 안에서 revision membership과 blob 검증을 공유한다. 작품 prior는 해당 작품의 SQL·claim·review·직접 원문 범위로 읽는다.
- frozen 입력의 canonical·Gold·alias·정책·요청 원문을 저장하고, 실제 frozen manifest SHA에 결속한 dependency revision으로 보존한다. 실행 artifact 소유와 GC 의존 인덱스를 추가했으며 과거 자료 일괄 삭제는 하지 않았다.
- 새 일반 배정의 자동 전환 정책, 실제 ERROR 및 재개 조건, 기존 배정 이행 adapter와 불변 통지 검증 receipt를 구현했다. 현재 turn·generation·중단 상태·완료 자료를 검사한다.
- 자동 전환·다음 배정은 완료 검증·백업뿐 아니라 실제 부모 전송 성공 receipt의 ACK를 확인한다. enqueue만으로 진행을 허용하던 검사 기대는 통지 후 전환 계약과 충돌한 `TEST DRIFT`로 수정했다. 부모의 consume나 발행 완료까지 기다리지는 않는다. Stop과 ACK 경합에서도 상태 flag만으로 전송 성공을 인정하지 않는다.
- 기존 summary의 BOM·줄바꿈·마지막 LF 차이는 summary 전용 adapter로 읽는다. 원본 SHA와 행을 보존하며 원본·정규화본·adapter를 새 revision으로 저장한다. sourceSummary 연쇄와 CHECKED·결정·frozen 결속 검사는 유지한다.
- 이미 완료된 판정은 동일 CHECKED·원래 판정·curation·source/latest completion과 요구된 canonical 효과를 확인해 중복 수신을 처리한다. 과거 CHECK 실행 사본이 정리됐다는 이유로 완료한 원래 판정을 다시 발행하지 않는다.
- compact 준비 사본·checkpoint는 선언된 실행 소유 범위로 저장하고 최종 배치의 영구 사본에서는 제외한다. 요청된 효과와 백업 완료 후 안전한 실제 파일 정리와 7일 GC를 연결했다. 7일은 성공 종료부터 계산하며 완료 배치 재수신은 보존 기간을 연장하지 않는다.
- publisher 독점과 공유 commit 락을 분리했다. compact v2는 작품별 변경 계획과 별도 전체 행 checker를 사용하며 이전 reader/감사 replay를 유지한다. 기본 10작품 checkpoint는 실제 백업한다.
- 새 정식 반영은 `catalog_authoring_batch_publish.py --apply-canonical`로 진입한다. 대상과 필요한 근거만 merge하고 canonical용 정적 데이터를 별도로 빌드한다. intent·완료 revision·백업·DB/생성 데이터 readback을 분리했다.
- canonical·정책의 무관한 변경은 원래 frozen SHA를 유지하는 별도 proof로 처리한다. 정책의 알려진 승인 추가 조항과 Markdown 표의 비의미적 padding만 호환하며 의미 변경은 거부한다. 기존 입력에 새 N/T 예외를 부여하지 않는다. 발행 당시 정책 원문과 실제 commit의 정책 원문을 각각 보존한다.

## 추가 구조 변경 전에 완료한 실증

이 절과 아래 회귀 표의 결과는 각 artifact에 결속된 실행 시점의 코드로 확인한 사실이다. 일반 current 복구·Work 범위 freeze를 추가한 현재 코드 전체가 검증됐다는 뜻은 아니다. 새 변경의 결과는 별도 실행 artifact가 나온 뒤 추가한다.

| 범위                                   | 관측 결과                                                                                                                                                                                               | 해석 한계                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 운영 저장소 v3→v4                      | 같은 generation/revision을 보존하고 source/latest readback 완료                                                                                                                                         | 문서만 바꾼 전환이 아님                                                          |
| 최초 전환 후 실제 증분 백업            | 537,051 compressed bytes, 0.0413초                                                                                                                                                                      | 단일 변경 표본이며 전체 수집 처리량이 아님                                       |
| 실제 6개 프로세스 저장·백업            | 128MiB 준비와 64MiB 백업 중 작은 저장 4개가 23.8~52.4ms에 완료                                                                                                                                          | 임의 바이트 입력을 이용한 저장 동시성 실증                                       |
| 동시성 시험 후 작은 백업               | 201,707,520-byte latest에 181 compressed bytes만 적용, 28.9ms, 전체 복사 호출 0, 파일 identity 유지                                                                                                     | 다른 크기/장치에서 같은 시간을 보장하지 않음                                     |
| 동시성 readback                        | 6개 receipt의 source/latest 및 모든 권한 테이블 일치                                                                                                                                                    | 대형 신규 blob commit은 writer를 1.639초 점유                                    |
| 실제 작품 prior 조회                   | 결과 18 claims/3 evidence 동일, 1.8507초→0.0919초, 59 SQL rows/1 review                                                                                                                                 | 동일 작품 1회 표본                                                               |
| 기존 50작품/229 receipts 검증          | 개선 전 108.21초에도 미완료. 개선 후 완료 표본 3.765초 및 32.87초                                                                                                                                       | 파일 캐시·경합이 달라 고정 개선 배수를 산출하지 않음                             |
| 실제 보존 판정 1작품 compact 발행·복원 | 전체 원본 행/registry 일치, 실제 source/latest 저장, 복원 후 제품 readback PASS                                                                                                                         | 당시 코드 identity의 내부 발행 표본. 기본 배치 CLI·새 판정 실행을 대신하지 않음  |
| 기본 배치 CLI의 private 정식 반영      | `--apply-canonical`으로 1작품의 CHECKED·원래 판정·v4 source/latest·STATE·candidate/canonical completion·생성 데이터/추천 엔진 readback PASS, 345.467초                                                  | 전체 private 복원 저장소에서 실행. 운영 canonical 반영이나 신규 모델 판정은 아님 |
| 같은 완료 배치 명령 재실행             | PASS, 1.915초. canonical DB·STATE·생성 JSON 4개의 SHA가 모두 동일                                                                                                                                       | 이미 완료된 1작품 배치의 중복 반영 차단 표본                                     |
| 실제 운영 기본 CLI 정식 반영           | 원본 summary에 결속된 미완료 1작품을 `--apply-canonical`로 반영. source/latest completion·canonical DB·생성 JSON readback PASS. publisher 독점 구간 303.133초                                           | 기존 실제 판정의 재사용이며 신규 모델 판정 속도는 아님                           |
| 운영 원본 전체 summary 재수신          | 일반 복구·Work 범위 freeze 추가 변경 전 코드로 17행 원본 summary를 일반 CLI에 재전달해 2.835초에 성공. READY 5건의 실제 canonical 효과 확인, canonical·STATE·원본 summary·생성 JSON 4개의 SHA 모두 동일 | 새로운 발행 없이 완료 효과를 확인하는 경로                                       |
| 운영 반영 후 실제 앱 경로              | 새 `テセウスの船` 상세·팩터 확인→실제 버튼/검색으로 해당 작품을 포함한 5작품 취향 선택→DNA→추천 PASS, console error 없음                                                                                | 로컬 Vite 앱 검증. 배포나 실제 Rakuten 구매/재고 검증은 아님                     |

동시성 상세: `.workspace/catalog-throughput-20260926/storage-concurrency-final/RESULT.json` 및 같은 디렉터리의 `README.md`. 실제 대용량 준비/백업 구간의 관측 wrapper는 타임스탬프만 기록했으며 작업 대체나 sleep을 삽입하지 않았다.

기본 명령 실증은 `primary-r002/RESULT.json`과 `primary-r002/REPEAT.json`에 보존한다. 대상은 `work-f6f272e478d275e1df91`이며 private canonical readback에서 `recommendationEligible=true`, `libraryOnly=false`를 확인했다. 최초 실행 중 코드 identity가 바뀌지 않았다. 이 결과는 private 환경의 주 진입점 전체 실행을 확인하며, 아래 내부 발행 계측과 구분한다.

운영 실증은 `operational-readback.json`, `operating-browser-readback.json`, `operational-apply-luna1.log`에 보존한다. 실제 canonical은 `v1-e4a0fc8842b4`, 총 3,309작품/추천 적격 2,021작품이며 DB integrity `ok`, journal mode `delete`다. `テセウスの船`(`work-f6f272e478d275e1df91`)은 onboarding/recommendation 적격이며 `libraryOnly=false`다. 원래 판정을 재사용했고 새 모델 판정은 호출하지 않았다. 앱에서는 새 작품을 검색해 다섯 번째 선호 작품으로 선택하고 DNA·추천까지 이동했다. mock route/data나 브라우저 DB 직접 쓰기는 사용하지 않았다.

운영 입력 `planning/structural-throughput-20260927/PENDING-LUNA1.json`은 원본 전체 summary의 SHA와 미완료 행을 그대로 결속한 기존 지원 subset이다. 원본 루나1 summary의 다른 READY 4건은 동일한 원래 판정으로 이미 완료된 자료다. 전체 summary로 바로 진입했을 때 이 완료 자료의 과거 CHECK 저장 참조 때문에 차단된 결함은 수정했다. 수정 후 원본 17행 summary(SHA `2b096745d4ece8c144f9e02a1be3ff785ef225218651f85a0c739ebcb2e78310`)를 일반 `--apply-canonical` 명령으로 재전달해 READY 5건 모두 `ALREADY_APPLIED`로 확인했다(`operating-rereception.json`).

별도 읽기 전용 확인도 같은 5건의 원래 판정과 canonical 효과를 2.1884초에 검증했다. 전후 source/latest는 동일 generation, change seq `9905`, revisions `5346`이었고 STATE·canonical SHA도 바뀌지 않았다. 관련 helper 25·batch 21·notification 18개, 총 64개 회귀가 통과했다(`completed-checks-static-verification.json`).

일반 복구·Work 범위 freeze 추가 변경 전 production 코드의 원본 summary 재수신은 `operating-rereception.json`에 2.8346515초·returncode 0·운영 SHA 7개 불변으로 기록했다. 앞선 2.7225초 실행은 `operating-rereception-pre-final.json`과 같은 이름의 log로 보존했으며 당시 이후 실행 수치와 혼용하지 않는다. 추가 구조 변경 후 코드의 재검증 결과를 뜻하지 않는다.

## 추가 개선 전 full dependency closure 계측

아래는 r005 이전 `publish-final-1-r002/RESULT.json`과 `publish-final-10-r002/RESULT.json`의 보존 계측이다. 기존 실제 판정·동결 원문·reviewedAt·초기 DB 쌍을 사용했다. 두 실행은 동일 workload SHA `0c1bbfd0b2fccb276cbd259afee39028bc60de1fe3a28f21a136b2dab56b3aa5`에 결속되며 각 실행 중 코드 identity가 바뀌지 않았다. 실제 compact 발행과 private v4 저장·백업을 실행했고 원래 full 결과의 전체 행과 registry가 일치했다. 이후 복원 의존과 보존 수명 수정이 있으므로 이 값을 r005나 이후 일반 복구·Work 범위 freeze 코드의 계측으로 확정하지 않는다.

| 작품 수 | compact 발행 | 별도 독립 검증 | 준비·비교 포함 총시간 | 마지막 증분 백업                     |
| ------- | -----------: | -------------: | --------------------: | ------------------------------------ |
| 1       |     50.675초 |       34.160초 |              90.629초 | 22,212,232 compressed bytes, 0.963초 |
| 10      |    207.007초 |      177.517초 |             391.112초 | 22,822,050 compressed bytes, 1.085초 |

이 계측은 `compact.publish`를 직접 호출하므로 batch CHECKED·decision·백업 적격성·중복 처리 orchestration, runner STATE commit, canonical/제품 readback 시간은 포함하지 않는다. 완료된 판정을 재사용한 발행 비용이며 신규 수집·모델 판정 처리량이 아니다. seed 저장소를 준비한 비용과 마지막 증분 백업 비용도 구분한다.

비교 기준 `020161d9`의 원래 authority/plan/mutation/readback core는 같은 보존 입력으로 1작품 87.578초, 10작품 269.174초, 50작품 1,425.375초였다(`baseline-core-{1,10,50}-r001/RESULT.json`). 이 기준 측정에는 과거 전체 저장·백업·운영 명령 비용이 빠져 있다. compact 발행 및 별도 검증과 포함 범위가 다르므로 숫자를 나눠 전체 개선율로 보고하지 않는다.

보존 수명·통지 ACK·잠금 오류 분류 수정 후 `r005` 코드를 동결해 측정했다. 1·10·50작품 발행과 세 크기 모두의 native 독립 복원·제품 readback gate가 통과했다(`R005-FINAL-EVIDENCE.json`). 세 크기의 `codeIdentity.files` 39개 SHA, Python/SQLite 실행 identity와 import 전 Python digest가 모두 동일하고 각 발행 실행 도중에도 코드 identity가 바뀌지 않았다. 이후 승인된 일반 복구·Work 범위 freeze 개선의 최종 수치가 아니라 과거 full dependency closure 구조의 비교 기준으로 보존한다.

| r005 작품 수 | 발행·저장·백업 계측                                                                                                  | 독립 복원·제품 readback                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1            | 발행 44.942초, 별도 독립 검증 29.533초, 총 79.594초. 원래 전체 행·registry 일치                                      | PASS, 총 304.508초. 원본 저장소 접근 차단 audit 52.974초 및 native 제품 readback 완료                          |
| 10           | 발행 248.798초, 별도 독립 검증 148.652초, 총 402.691초. 원래 전체 행·registry 일치                                   | PASS, 총 792.257초. 복원 240.857초·원본 차단 audit 304.052초·native 제품 readback 244.600초                    |
| 50           | 50/50 성공·실패 0. 발행 1,845.280초, 별도 독립 검증 773.708초, 총 2,624.715초(약 43.7분). 원래 전체 행·registry 일치 | 과거 r005 범위 PASS, 총 3,149.258초. 복원 767.961초·원본 차단 audit 1,473.804초·native 제품 readback 904.065초 |

표의 발행 쪽 총시간(`totalSeconds`)은 별도 복원 시간을 포함하지 않는다. 발행·원래 결과 동등성 검증과 독립 복원·제품 readback은 각각의 receipt에서 따로 확인했다. 이 PASS는 r005 당시 코드와 과거 판정 범위다.

50작품은 최초 seed 백업 뒤 10작품 간격 checkpoint 4회와 최종 백업 모두 `revision-incremental`이었다. 마지막 delta는 신규 blob 34개·변경 revision 1개·12,732,850 compressed bytes이며 0.476초에 끝났다(`publish-final-50-r005/RESULT.json`). 이 백업의 `timingsSeconds.lockWait`는 백업이 보고한 잠금 대기값이며 DB writer나 공유 commit 락의 대기·점유로 해석하지 않는다. 저장과 독립 복원의 성공은 서로 다른 검증 결과다.

반복 전체 복사와 작품별 전체 Catalog 순회, 중복 SQL materializer replay는 제거했지만 원본 권한·변경 계획 검증 자체를 없애지는 않았다. 50작품은 필요한 의존 자료 범위 확인에 169.401초, 입력 보존에 272.382초를 썼고 발행 후 별도 원본 권한 검증도 773.708초 남았다. 이 값은 새 수집·의미 판정을 포함하지 않으며 추가 구조 변경 전 r005에서도 큰 과거 근거를 확인하는 비용이 남았다는 실측이다.

남은 큰 비용도 확인했다. `WORK-415-COST-COMPARISON.json`의 같은 작품 `work-41570037d4e582e642ba`는 r005에서 authority/plan에 108.886초, 적용·readback에 0.073초를 사용했다. 작품별 발행 경로의 전체 Catalog·registry 읽기와 전체 Catalog hash 계수는 각각 0이지만 prior·원문 검증 읽기까지 사라졌다는 뜻은 아니다. 이전 관측의 authority/plan은 55.546~70.892초였으며 캐시·동시 I/O를 격리하지 않았다. 동일 validator/recovery 소스 SHA가 유지됐어도 compact/storage 변경과 실행 환경 차이가 있으므로 지연 원인을 하나로 확정하지 않는다. 작품별 CPU/I/O 분할은 계측하지 않았고 프로세스 누적 I/O를 해당 작품의 물리 디스크 비용으로 해석하지 않는다.

## 실행 사본의 보존 수명 실증

보존 수명 코드를 기본 발행 경로에 반영했고, `transient-retention-patch/NATIVE-LIFECYCLE.json`에 private 기본 명령 실증을 보존했다. 실제 과거 pre-f6 DB 쌍과 원래 READY 판정을 사용해 `work-f6f272e478d275e1df91`을 발행하고, `work-6e805410e8ba08557830`의 실제 `characterArcWeight` 충돌은 작품 범위로 격리했다. CHECKED·frozen·판정 원본 SHA는 유지했다.

첫 canonical 적용 직전에는 private 과거 DB에 이후 시점의 opaque review 1개가 남아 있어 정확한 authority layout 검사에서 중단됐다. 이때 candidate만 완료되고 canonical은 미반영이었으며 source/latest의 execution owner는 미종료 상태이고 준비·checkpoint 범위가 보존됐다(`NATIVE-INCOMPLETE-RETENTION.json`). 잘못 배치된 review를 기존 before-image와 백업에 보존한 뒤 과거 layout을 정확히 복원했고, 같은 명령을 재개해 publisher 독점 구간 145.9849초 후 canonical `APPLIED`·readback `PASS`를 얻었다. 이 중단 원인은 private 시험 환경 구성 오류이며 운영 DB 장애로 보고하지 않는다.

완료 후 실제 checkpoint 파일 3개를 정리했고 성공 종료로부터 7일이 지난 조건의 GC에서 execution owner와 그 소유 임시 artifact revision을 제거했다. 후속 증분 백업은 삭제 변경 revision 2개를 반영했고 새 blob·복사 bytes는 0, 92.7ms였다. 그 백업에서 제품 파일 485개를 복원하여 canonical 대상의 추천 적격성과 정적 데이터 바이트 일치를 확인했다. 당시 보존 수명 수정 코드로 같은 공개 배치 명령을 다시 실행한 publisher 독점 구간은 1.2461초였으며 같은 canonical completion을 확인했고 만료 owner를 다시 열지 않았다.

실증의 범위는 private 저장소다. 운영 GC나 과거 운영 자료 일괄 삭제는 실행하지 않았다. 최초 private 발행 runtime에는 독립적으로 수정한 transport ACK와 WinError 분류가 아직 없었으며 해당 분기는 이 실증에서 실행하지 않았다. 종료 시각에 따른 7일 계산 수정은 오래된 시작·새 종료·재종료·source/latest 회귀로 별도 확인했고, GC·백업·복원·공개 명령 재수신은 당시 보존 수명 수정 코드로 수행했다. 이 identity 한계는 `NATIVE-LIFECYCLE.json`의 `verificationLimit`에 기록되어 있으며 별도 r005 복원 및 이후 일반 복구 검증과 구분한다.

## 복원 실패와 수정 범위

`publish-final-10-r003/RESTORE-READBACK-RESULT.json`은 23,771개 파일 복원 후 guarded compact 검증에서 `FileNotFoundError`로 FAIL했다. 원본 저장소를 차단한 상태에서 중첩 prior의 recovery epoch가 누락된 실제 저장 의존 결함이었다. 다음 `publish-final-1-r004/RESTORE-READBACK-RESULT.json`은 21,266개 파일 복원 뒤 `OperationalError('unable to open database file')`로 FAIL했고, 중첩 recovery가 읽는 frozen baseline catalog DB 누락을 확인했다.

두 FAIL은 보존했고 원본 파일을 추가 복사해서 성공으로 바꾸지 않았다. `catalog_workspace`가 해당 lineage와 SHA에 결속된 manifest·baseline catalog DB, epoch·scope·policy 및 필수 원본 DB 의존만 보존하도록 수정했다. 원본 경로를 제거한 v4 백업 복원과 SHA 변조 거부를 포함한 저장 회귀 48개는 13.761초에 통과했다(`storage-recovery-basis-final.log`). 이 회귀 통과는 실제 배치의 독립 복원 성공을 대신하지 않으므로 다음 r005 백업 검사와 별도로 기록한다.

후속 `publish-final-1-r005/RESTORE-READBACK-RESULT.json`은 PASS했다. `latest.sqlite`에서 revision `7ea695db-baf8-4df5-9e55-dffd7faf62ec`의 21,268개 파일을 복원했다. 원본 저장소 Python 읽기를 차단한 compact 검증은 52.974초에 PASS했고 외부 경로 접근은 없었다. 이어 변경하지 않은 제품 readback 명령에서 SQL·build·coverage·추천 엔진을 확인했다. 복원 결과는 `v1-40d92674816f`, 총 3,309작품/추천 적격 1,934작품, Gold 150작품, 추천 계획 1,932개였다. 전체 복원·검증은 304.508초이며 운영 canonical과는 다른 과거 표본이다.

이어 `publish-final-10-r005/RESTORE-READBACK-RESULT.json`도 전체 PASS했다. `latest.sqlite`에서 복원한 10대상을 원본 접근 차단 audit와 native 제품 readback으로 검증했다. 제품 결과는 `v1-5f119042677a`, 총 3,309작품/추천 적격 1,943작품, Gold 150작품, 추천 계획 1,941개였다. 복원 240.857초, audit 304.052초, native readback 244.600초이며 준비를 포함한 전체 시간은 792.257초다.

마지막 `publish-final-50-r005/RESTORE-READBACK-RESULT.json`도 과거 r005 범위에서 PASS했다. 선언 의존 44,191개와 발행 자체 자료 등을 포함해 44,779개 파일을 latest에서 복원했다. 원본 접근 차단 audit의 외부 경로·차단된 접근 목록은 비어 있었고, native readback은 대상 50개·Gold 150개·`v1-e7d3d732f2de`의 총 3,309작품/추천 적격 1,983작품·추천 계획 1,981개를 확인했다. 복원 767.961초, audit 1,473.804초, native readback 904.065초, 준비 포함 총 3,149.258초였다.

이 복원에는 receipt에 결속된 Python 코드와 해당 실행 시점의 제품 readback 도구를 실행 환경으로 제공했다. 누락된 frozen/prior/canonical/정책/Gold 데이터를 운영 파일에서 가져와 보완하지 않았다. 50작품 복원의 `executionCodeIdentityMatched=true`지만 `currentRepoCodeIdentityMatches=false`다. 복원은 봉인된 r005와 일치하는 private 코드로 실행했고 그 사이 운영 소스는 일반 복구·Work 범위 freeze 개선으로 진행됐기 때문이다. 따라서 r005의 역사적 발행·복원 완료는 인정하되 새 일반 복구 구현 검증이나 새로운 수집·판정 처리량으로 보고하지 않는다. r003/r004 FAIL 원본도 보존한다.

## 추가 구조 변경 전에 실행한 회귀와 입력 복원 검사

| 검사                                         | 결과                                                                                                                                    | 근거                                                 |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `pnpm test --maxWorkers=2`                   | 117파일, 928검사 PASS, 472.05초                                                                                                         | `vitest-final-proper.log`                            |
| Python 관련 회귀                             | 보고된 실행 222건, failures/errors 0, 166.486초. 당시 물리 작업 경로에 입력이 없어 class setup 3개 skip                                 | `python-final-summary.json`, `python-final-r003.log` |
| `pnpm typecheck`                             | 운영 반영 후 재실행 PASS                                                                                                                | `typecheck-operating-final.log`                      |
| `pnpm lint`                                  | PASS                                                                                                                                    | `lint-final.log`                                     |
| 운영 반영 후 `catalog:validate`              | `v1-e4a0fc8842b4`, 3,309작품/3,313권, errors 0, warnings 38,487                                                                         | `catalog-validate-operating-final.log`               |
| 완료 summary 호환 영향 회귀                  | 64개 PASS(helper 25·batch 21·notification 18)                                                                                           | `completed-checks-static-verification.json`          |
| 복원 의존 보존 영향 회귀                     | 48개 PASS, 13.761초                                                                                                                     | `storage-recovery-basis-final.log`                   |
| Windows 잠금 오류 분류                       | 4개 PASS, 0.560초. native WinError 5 권한 오류를 경합으로 재시도하지 않음                                                               | `locks-permission-final.log`                         |
| r005 전 보존 수명·ACK·Stop·잠금 등 영향 회귀 | 134개 PASS, 38.814초                                                                                                                    | `python-final-affected.log`                          |
| 원본 복원 후 lineage 검사                    | 2개 중 2개 PASS, 12.963초                                                                                                               | `restored-test-closeout.json`                        |
| 원본 복원 후 AuthoringTest                   | 고유 21개 전부 실행, skip 0. 정확한 연구 입력 복원과 test-only metadata 수정 후 17개 PASS, 4개는 원본 도구 누락으로 목표 검증 전에 차단 | `restored-test-closeout.json`                        |

앞선 Python 222개 실행에서 current-119/rescue-002 frozen bundle, batch-115 prepare bundle, `jobs/hina-drifters/records.json`을 요구하는 class setup 3개가 skip된 사실은 유지한다. 이후 `MISSING-TEST-INPUTS-INVENTORY.json`에서 workspace source·latest·pre-v4 세 DB 모두에 해당 원본 경로와 SHA가 남아 있음을 확인했다. prefix별 기록 수는 batch-115 32개, current-119 228개, rescue-002 5,791개, hina records 1개로 세 DB가 동일했다. 당시에는 물리 작업 경로가 미복원 상태였다.

정확한 원본을 복원한 뒤 lineage 2개는 모두 통과했고 AuthoringTest 21개는 skip 없이 전부 실행했다. 추가 연구 입력 2건 복원과 임시 panel metadata의 필수 `schemaVersion`을 넣는 test-only 한 줄 수정 후 고유 17개가 통과했다. 해당 필드는 실제 `prepare.freeze`가 출력하는 계약이며 production guard는 변경하지 않았다. 최초 FAIL/ERROR와 부분 재실행 결과는 보존했다(`restored-test-closeout.json`).

나머지 4개는 `factor-rescue-009-v2`의 manifest `11baf3d14d3a39c9ce3a6ec66cb9152f64c571779a0bf5f9d32abb1e3146a368`가 요구하는 `build_registry_correction.py`·`preflight_registry_correction.py` 원본을 찾지 못해 목표 assertion 전에 차단됐다. 두 파일이 요구하는 SHA는 `022624d93c470c68439bd56059ea55635ddb98d2a5c00f003c52a4b1a0156ee0`이다. source·latest·pre-v4 blob, 추적된 일반 도구 Git 4개 버전, 이름으로 확인한 로컬 registry Python artifact 190개에서 이 원본을 찾지 못했다. 재구성·manifest 완화·PASS/skip 대체는 하지 않았다. 차단된 메서드는 `test_all_context_urls_must_be_packet_supported_before_freeze`, `test_exact_target_guard_before_freeze`, `test_full_safety_contract_before_freeze`, `test_v2_volume_proof_uses_existing_frozen_packet_transport`이다.

이 추가 검증 전후 운영 canonical·STATE SHA와 source/latest generation·metadata·change seq `9905`·revision 수 `5346`은 같았다. 해당 검사 중에는 production 코드 동결을 유지했으며 변경된 추적 파일은 위 테스트 metadata 한 줄뿐이다. 따라서 현재 Python 전체 PASS라고 보고하지 않는다. 이전 222개 실행, 이후 134개 영향 회귀, 복원한 lineage 2개와 Authoring 17개 PASS, 남은 4개 환경 제약은 각각 기록하며 겹치는 검사 수를 합산하지 않는다. 당시 diff 검사도 통과했다. 이 표의 PASS를 이후 일반 복구·Work 범위 freeze 변경의 최종 회귀 결과로 대체하지 않는다.

운영 반영으로 warning은 38,468개에서 38,487개로 19개 증가했다. `catalog-warning-delta.json`의 추가 목록은 AEP가 사람 검수가 아님을 알리는 작품 경고 1개, 근거의 사람 미검수 경고 11개, 현재 source row에서 참조하지 않는 보존 근거 경고 7개이며 제거된 경고는 없다. 새 경고를 모두 기존 경고로 분류하거나 errors 0만으로 생략하지 않는다.

## 추가 구현과 남은 검증

- 다음 구현은 이 문서 첫 표와 저장 계약 R1~R9 순서로 진행한다. 기본 DB 복구에서 current/live/과거 파일 트리를 전개하지 않으며, 실제 소비 요청의 정확한 의존만 준비한다. 과거 full replay 성공을 이 새 경로의 완료 증거로 대신하지 않는다.
- Work별 최신 유효 판정과 정당한 미완료 exact 의존의 구분은 R7로 검증한다. 이 작업을 위해 다시 기본 복구에서 모든 작업 세션을 탐색하지 않는다.
- 새 freeze의 Work 범위 캡처는 위 실제 standalone CLI 표본에서 provenance 3,025→33개 및 자동 사전 저장의 Work 리드 1개·이전 frozen 0개로 확인했다. 이 결과를 일반 current 복구나 단계 백업까지 완료한 증거로 확대하지 않는다. 옛 frozen·원본 SHA와 제공 자료 보호는 유지한다.

- 대형 입력의 경로 전수 쌍 비교 병목을 제거했고 5,000개 경로 회귀 및 r005 50작품 발행·원래 full 전체 행 대조까지 마쳤다. 수정 전 831.32초에도 의존 자료 준비가 끝나지 않아 중단한 기록은 보존한다.
- recovery epoch와 frozen baseline catalog DB 누락 수정 뒤 r005 1·10·50작품의 latest-only 복원·원본 접근 차단 audit·native 제품 readback은 모두 해당 과거 코드 범위에서 통과했다. 이 기준선 완료를 새 일반 current 복구의 완료로 대체하지 않는다. r003/r004 FAIL은 보존한다.
- 복원한 과거 입력의 검사는 마쳤으나 manifest에 결속된 원본 도구가 없는 4개 Authoring 검사는 목표 assertion까지 검증하지 못했다. 원본 도구 확보가 필요한 환경 제약으로 남기며 완료나 skip으로 바꾸지 않는다.
- 고정 작업 세션의 자동 전환은 계획대로 다음 승인된 운영 배치에서 확인한다. 이번 검증으로 중단된 세션을 재개하거나 새 모델 판정을 호출하지 않았다.

이 작업은 GitHub 발행·배포를 포함하지 않는다. 과거 테스트 입력은 새로 합성하지 않고 보존된 원본으로 복원했다. 이전 skip, 복원 후 통과, 추가 원본 누락으로 차단된 검사의 결과를 구분한다.
