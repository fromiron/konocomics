# 로컬 Catalog 작업 저장소

승인일: `2026-09-09`. 사용자는 Catalog와 조사·판정 작업 자료를 분리하고, 중요 자료를 `.tmp`가 아닌 로컬 SQLite에 영구 보존하는 전환과 문서화를 승인했다. 새 서버·ORM·패키지는 추가하지 않는다.

## 저장 경계

| 저장소 | 보관 내용 | 권한 |
| --- | --- | --- |
| `data/source/catalog.sqlite` | 검증·승격된 Catalog 작품·팩터·근거 | 기존의 유일한 canonical Catalog 원천. 스키마·발행 권한 불변 |
| `data/local/catalog-authoring/workspace.sqlite` | 수집 원문, 출처, 후보 팩터, job, 동결 입력, 판정 원장, 수정·HOLD·실패 기록, baseline/registry 및 재현에 필요한 계약·도구 | **저장된 작업 원본의 영구 저장소**. 저장 성공은 사실 검증·판정 승인·승격 성공이 아님 |
| `.tmp` | 기존 도구가 읽고 쓰는 JSON/CSV/Markdown/SQLite 작업 사본, 재생성 가능한 빌드·검토 출력 | 미저장 초안 또는 DB에서 복원한 투영. 유일한 보존 위치로 사용 금지 |

서비스 런타임은 기존대로 정적 JSON을 사용한다. 사용자 Library·취향의 Dexie와 두 Rakuten route는 바꾸지 않는다. 작업 DB는 Git에 올리지 않는 로컬 저장소이며, canonical DB와 섞거나 대체하지 않는다.

## 무엇을 영구 보존하는가

- 다른 사람이 작성한 원문, 재수집을 보장할 수 없는 출처 응답, 관찰·범위·한계, 실제 출처 URL·날짜.
- 후보와 별도 판정의 원본 바이트, 입력/결과 manifest, 원래 경로와 SHA-256, 과거 판정과 참조 bundle, 기준 Catalog/registry pair.
- 미승격·HOLD·실패도 보존한다. `STATE.json` 같은 수정 가능한 작업 상태는 변경할 때마다 새 snapshot으로 저장한다.
- 과거 executable·계약도 복원 자료로 보존한다. 보존했다는 이유로 오래된 실행 규칙을 현재 규칙으로 적용하지 않는다.

DB의 `blob`은 SHA-256별 원본 바이트를 zlib으로 압축해 중복 없이 저장한다. `snapshot`과 `entry`는 저장 시점·label·원래 저장소 경로·정확한 파일 집합·해시를 연결한다. 줄바꿈, JSON 필드 순서, CSV 순서, manifest 내용은 바꾸지 않는다. 수정본은 새 snapshot에 추가하며 이전 행의 UPDATE/DELETE는 DB trigger로 거부한다. Artifact를 별도 팩터 테이블로 재해석하지 않으므로 판정의 두 번째 진실 원천을 만들지 않는다.

초안은 아직 저장하지 않은 편집 내용이다. 중요한 내용을 작성한 즉시 `save`하고, 수집 결과를 인계하거나 다음 단계로 넘어가기 전에 저장·백업 receipt를 확인한다. 메시지에만 있는 HOLD 정보는 `STATE.json`에 반영하고 저장해야 한다.

## 기본 명령

저장소 루트에서 Python 3.13 표준 라이브러리만 사용한다.

```powershell
# 작성·수정된 자료 저장. 같은 경로를 다시 저장해도 이전 버전이 남는다.
python scripts/catalog_workspace.py save --label collection-handoff .tmp/catalog-expansion-continuation-20260902/research/<assignment>
python scripts/catalog_workspace.py save --label state-update .tmp/catalog-expansion-continuation-20260902/STATE.json

# 저장된 revision과 전체 DB 바이트/manifest 무결성 확인
python scripts/catalog_workspace.py list
python scripts/catalog_workspace.py verify

# 기존 파일을 건드리지 않는 별도 디렉터리 복원
python scripts/catalog_workspace.py restore --snapshot <id> --destination <new-directory> --prefix .tmp/catalog-expansion-continuation-20260902/research/<assignment>

# 원래 경로가 통째로 없어졌을 때만 해당 경로 복구. 기존 대상 덮어쓰기 금지.
python scripts/catalog_workspace.py checkout --snapshot <id> --prefix .tmp/catalog-expansion-continuation-20260902/research/<assignment>

# 별도 이름으로 보존하는 수동 checkpoint 백업. 기존 파일 덮어쓰기 금지.
python scripts/catalog_workspace.py backup --destination C:/Toys/konocomics-authoring-backups/<checkpoint>.sqlite
```

`restore`는 원래 repository-relative 구조를 새 디렉터리 아래 재현한다. 복원 파일을 원래 파일과 비교하고 필요한 범위만 사용한다. 역사적 artifact의 절대 경로 참조까지 문자열 치환하지 않는다. 기존 실행을 재개하려면 `checkout`으로 **원래 저장소 경로**에 복원한다. 다른 위치로 영구 이전하는 것은 별도의 경로 호환 작업이다. canonical `data/source`는 `checkout`으로 변경할 수 없다.

DB 파일 자체를 잃었을 때는 백업을 읽는 `--database <backup.sqlite>`로 `verify`, `list`, `restore`, `checkout`을 실행할 수 있다. 작업 DB 교체는 writer가 없는 상태에서 검증된 백업을 새 파일로 복원한 뒤 수행한다. 운영 중인 DB 파일이나 WAL 일부만 임의 복사하지 않는다.

## 기존 실행 경로 연결

수집 검사는 내용의 진실성을 대신하지 않고, SQLite 저장은 수집 검사도 대신하지 않는다. 기존 `validate_factor_collection_batch.mjs --research=... --require-source-audit`와 `prepare_factor_batch.py freeze / seal-result / publish`, registry correction의 판정·검증·직렬 발행 순서를 유지한다.

연결된 명령은 입력을 DB에 저장·백업한 뒤 원래 구현을 실행하고, 실제 결과 또는 남아 있는 실패 출력을 다시 저장·백업한 뒤 결과를 보고한다. SQLite 기록에는 단계별 snapshot ID가 남으며, 명령 인자·작업 경로·종료 코드와 stdout/stderr 원본도 중간 파일 없이 DB에 직접 기록한다. 저장·백업 실패는 정상 완료로 보고하지 않으며 기존 원본과 부분 결과를 보존한다. 발행 성공 뒤 저장 실패가 나면 실제 후보 DB가 존재할 수 있으므로 **같은 출력을 무조건 재실행하지 말고 먼저 readback**한다. current 갱신은 기존 최종 제품 검증 이후에만 한다.

자동 연결되지 않은 일회성 authoring 명령은 같은 저장 경로로 감싼다. 입력에는 원본 job·연구·계약·참조 bundle을, 출력에는 실제 생성 디렉터리를 명시한다. 임의 명령의 부작용을 이 wrapper가 허가하거나 되돌려 주지는 않는다.

```powershell
python scripts/catalog_workspace.py run --label <stage> --input <input-directory> --output <new-output-directory> -- python <existing-tool.py> <existing-arguments>
```

## 백업과 안전성

- 자동 백업은 저장소 밖 형제 디렉터리 `../konocomics-authoring-backups/`에 생성한다. 현재 Windows 경로는 `C:/Toys/konocomics-authoring-backups/`다.
- SQLite Backup API로 일관된 새 파일을 만들고 무결성을 검사한 뒤 `latest.sqlite`로 교체한다. 바로 이전 정상 세대는 `previous.sqlite`로 유지한다. 자동 물리 백업은 두 세대이며 **각 파일 안에 그 시점까지의 모든 논리 snapshot·원본 버전이 들어 있다.** 이름을 지정한 수동 checkpoint는 자동 교체하지 않는다.
- 작업 저장소의 트랜잭션은 부분 저장을 성공으로 노출하지 않는다. 원본 파일이 읽는 도중 바뀌거나 파일 집합이 달라지면 저장을 거부한다. 아직 writer가 있거나 journal sidecar가 남은 원천 SQLite는 exact-byte 이관 전에 닫고 상태를 확인한다.
- 복원은 SHA-256을 재계산하고 기존 경로 덮어쓰기·경로 이탈·symlink/junction을 거부한다. DB에 존재하지 않는 판정·근거는 합성하지 않는다.
- 동일 디스크에 둔 별도 폴더는 `.tmp` 정리 사고에는 유용하지만 디스크 고장·랜섬웨어의 독립 백업이 아니다. 다른 디스크나 외부 백업은 별도 목적지 승인이 필요하며, 이번 전환은 로컬 백업까지만 수행한다.
- 정상 도구의 append-only 제약은 OS 관리자나 임의 SQL 조작을 막는 보안 경계가 아니다. 실행 도구의 제한된 경로 처리와 별도 백업을 함께 유지한다.

## 이관과 검증

원본 보존 → 현재 자료 저장 → DB 바이트/집합 검증 → 별도 위치의 실제 백업 복원 → 기존 명령 실행·readback 순서다. 이관 중 `.tmp` 원본을 삭제하거나 과거 manifest를 다시 생성하지 않는다.

저장 회귀: `python scripts/test_catalog_workspace.py`. 기존 Factor·collection 회귀도 그대로 실행한다. 실제 이관 수량, snapshot, 복원과 제품 경로 결과는 아래 실행 기록에 남긴다. 저장소 테스트 통과를 신규 작품 승격이나 서비스 배포 증거로 사용하지 않는다.

### 2026-09-09 실행 기록

- 전체 이관 snapshot **2**: `.tmp`, `data/source`, `data/staging/catalog-expansion`의 **144,509개 파일**을 원본 보존 상태로 저장했다. 집합 SHA-256은 `1de95b548c8a42fd1d02b559b856fe5f827365d89df6c06cdbce43dbb4ff513b`다. 초기 전체 검증은 snapshot 2개·고유 blob 33,533개·원본 고유 바이트 5,238,230,874를 확인했다. 압축·중복 제거된 DB는 당시 약 1.02 GB였다.
- 고정 백업 `C:/Toys/konocomics-authoring-backups/migration-20260909.sqlite`의 무결성·전체 blob·manifest를 검증했다. 이 백업에서 `factor-rescue-001-recheck-v1`의 **1,152개 파일**을 새 위치에 실제 복원하고 바이트 SHA-256 readback을 통과했다. 원래 `.tmp` 파일은 삭제하지 않았다.
- 이미 승인됐던 batch 019의 동일 원본 job·ledger로 기존 **freeze → seal-result → publish** CLI를 실행했다. 2작품·29개 승인 claim 재현이며 새 판정이나 신규 승격이 아니다. 단계별 입력·출력·실행 기록이 SQLite에 저장·백업됐다.
- 새로 만든 검증용 publication 작업 사본만 별도 이름으로 이동한 뒤 snapshot **16**에서 원래 경로의 **71개 파일**을 `checkout`으로 복구했다. 후보 Catalog SHA-256 `21de010cdd083b8e42b31d3603db5926daad37fdd8836d6bd424441cd3ede4aa`가 복원 전과 같았다.
- 복원한 후보로 기존 `build-catalog.ts --verify --compact`를 실행했다. `v1-f362d9abe22e3304`, 3,308작품, 0 errors / 22,264 warnings, eligible 1,914개 coverage PASS였다. authority 9개 table·23개 opaque source와 Gold Set 150개 검증을 통과했다. 생성된 실제 Catalog·추천 context를 기존 추천 함수에 입력하여 1,909개 후보 계획과 상위 10개 결과를 확인했고 복원 대상 2작품 모두 추천 후보에 도달했다. 브라우저 UI나 배포 검증으로 주장하지 않는다.
- 저장 회귀 6개, 기존 prepare 회귀 17개, registry correction 회귀 27개, collection validator 회귀, `typecheck`, `lint`를 통과했다. Node 24.19.0 전체 `pnpm test` 재실행은 **868 PASS / 4 FAIL**: Windows 파일 mode·경로·`spawn npm ENOENT` 3건과 recommendations-flow의 dialog 대기 실패 1건이다. UI 관련 두 파일의 별도 실행은 48개 통과했지만 전체 실행 실패를 해소한 것으로 간주하지 않는다. 관련 없는 제품 코드·테스트는 변경하지 않았다.
- canonical Catalog, current 233 후보·registry와 `handoff/`를 보존했다. GitHub 쓰기·배포·신규 작품 승격은 수행하지 않았다. 기존 `factor-rescue-003`의 누락된 `panel-input-v2`/`panel-result-v2`는 이관으로 복구되지 않으며 별도 원본 소실 한계로 유지한다.
