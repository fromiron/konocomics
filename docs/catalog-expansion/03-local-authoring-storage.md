# 로컬 Catalog 작업 저장소

승인일: `2026-09-09`. 사용자는 Catalog와 조사·판정 작업 자료를 분리하고, 중요 자료를 `.tmp`가 아닌 로컬 SQLite에 영구 보존하는 전환과 문서화를 승인했다. 새 서버·ORM·패키지는 추가하지 않는다.

## 저장 경계

| 저장소                                          | 보관 내용                                                                                                                | 권한                                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `data/source/catalog.sqlite`                    | 검증·승격된 Catalog 작품·팩터·근거                                                                                       | 기존의 유일한 canonical Catalog 원천. 스키마·발행 권한 불변                          |
| `data/local/catalog-authoring/workspace.sqlite` | 수집 원문, 출처, 후보 팩터, job, 동결 입력, 판정 원장, 수정·HOLD·실패 기록, baseline/registry 및 재현에 필요한 계약·도구 | **저장된 작업 원본의 영구 저장소**. 저장 성공은 사실 검증·판정 승인·승격 성공이 아님 |
| `.tmp`                                          | 기존 도구가 읽고 쓰는 JSON/CSV/Markdown/SQLite 작업 사본, 재생성 가능한 빌드·검토 출력                                   | 미저장 초안 또는 DB에서 복원한 투영. 유일한 보존 위치로 사용 금지                    |

서비스 런타임은 기존대로 정적 JSON을 사용한다. 사용자 Library·취향의 Dexie와 두 Rakuten route는 바꾸지 않는다. 작업 DB는 Git에 올리지 않는 로컬 저장소이며, canonical DB와 섞거나 대체하지 않는다.

## 출판사 소개를 수집과 함께 저장 — 2026-09-12

사용자 요청에 따라 출판사 작품·판본 페이지를 읽는 같은 수집분에서 소개 원문도 보존한다. Factor 관찰 요약을 공식 소개로 전용하지 않는다. 조정자는 정확한 Work·ISBN과 소개 구간을 확인한 서지 입력을 기존 직렬 발행 경계에서 canonical `source_book_metadata`에 반영한다. 이 요청은 소개·서지 추가 범위이며 Factor 승격이나 과거 frozen candidate 수정 권한이 아니다.

수집 디렉터리에 원본 HTTP 응답, 수집 receipt, `publisher-metadata.json`을 함께 둔다. receipt는 `url`, `resolvedUrl`, 실제 `fetchedAt`(offset 포함 ISO 시각), `status`, 원본 `sha256`, `bytes`를 기록한다. 이미 보존한 응답은 다시 요청하지 않으며, 정확한 수집시각이 없거나 접근에 실패한 자료는 기록만 보존한다. 소개 텍스트는 해당 판본의 실제 소개 구간 전체에서 추출하고 HTML 정리·trim 후 표시값과 원본 바이트를 구분한다.

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

```bash
node --import tsx scripts/import-publisher-book-metadata.ts --input <collection>/publisher-metadata.json --output .tmp/<new-publication-directory>
```

이 명령은 입력 디렉터리·현재 source·도구를 기존 작업 SQLite에 저장·백업한 후 실행하고, 결과·실패·canonical DB readback을 다시 저장·백업한 뒤 반환한다. 기존 collection 저장 후 서지 파일을 추가했다면 새 snapshot이 필요하다. 단순 수집 단계에서도 기존 `catalog_workspace.py save` 또는 direct collection의 디렉터리 저장을 사용한다.

- metadata 행이 없고 같은 Work·ISBN Volume이 존재하며 소개가 유효하면 한 응답에서 확인한 필드만 추가한다. 중복 ISBN·다른 Work 충돌·receipt/원문 hash 불일치는 발행 전에 실패한다.
- 기존 metadata 행은 빈 필드까지 그대로 보존한다. 같은 URL의 다른 수집분을 섞거나 수집일만 갱신하지 않는다. 기존 행의 갱신은 유지할 모든 필드를 한 응답에서 재확인하는 별도 완결 검토가 필요하다.
- 아직 canonical에 없는 ISBN은 `deferred-missing-volume`, 빈 소개는 `skipped-empty-caption`으로 보존한다. 정식 Work·Volume 추가 뒤 같은 입력을 다시 반영할 수 있다. 소개를 위해 Factor 승격을 요구하지 않는다.
- 기존 authority projection·finalize·build와 `publishDirectorySet`을 재사용한다. 다른 9개 table과 opaque 문서는 보존하고 baseline DB·source manifest 및 준비 artifact hash를 교체 전에 확인한다. 작업은 직렬로 실행하며 진행 중 Factor bundle의 frozen identity를 갱신하지 않는다.
- `receipt.json`의 실제 disposition, `published` 및 DB/생성 파일 readback을 확인한다. 생성된 `Volume.metadata`는 기존 상세 경로에서 유효한 Rakuten 항목 뒤의 fallback으로 사용한다. 로컬 발행은 GitHub 발행·배포 증거가 아니다.

2026-09-12 Oracle 후속 검토로 입력 파싱과 SHA를 같은 Buffer에 결속하고, candidate의 opaque 경로·원문 hash가 기준 source와 같은지 비교하도록 보완했다. 시간이 걸리는 검사를 끝낸 뒤 실제 발행용 복사본과 canonical DB hash를 재확인한다. `verifyCatalogAuthority`에서 이미 검증한 tables를 선택적으로 받아 인접한 전체 DB 읽기 두 번만 제거했으며, 기존 요약 출력과 transaction·재개방·build·발행 직전/직후 검증은 유지한다. 새 캐시·동시 writer 지원은 추가하지 않았다.

실제 『花野井くんと恋の病』1권(ISBN9784065114698)의 [출판사 소개](https://www.kodansha.co.jp/comic/products/0000116236)를 수집해 기존2행을 보존하며3행으로 늘렸다. Catalog `v1-a80698134140`은1700작품/1568추천가능을 유지하고 Gold150·build/coverage와 생성 대표권의 기존 상세 fallback을 확인했다. 최종 Node24 관련 검사4건과 lint는 통과했으며 전체 typecheck는 기존 `taste-flow.test.tsx:206` 오류1건으로 실패했다. 같은 입력의 정상 CLI 재실행은 `preserved-existing-metadata`/`published:false`였고 저장1014~1016·백업1016을 확인했다. [Oracle 최종 검토](https://chatgpt.com/c/6aa4cc89-4a60-83ee-a91f-790fe03b7b2b)는 추가 필수 수정 없음이지만 정적 코드·로그 확인이며 독립 실물 재실행은 아니다. 처리량 향상·브라우저·실제 API·배포는 이 검증에 포함하지 않는다.

## 무엇을 영구 보존하는가

- 다른 사람이 작성한 원문, 재수집을 보장할 수 없는 출처 응답, 관찰·범위·한계, 실제 출처 URL·날짜.
- 후보와 별도 판정의 원본 바이트, 입력/결과 manifest, 원래 경로와 SHA-256, 과거 판정과 참조 bundle, 기준 Catalog/registry pair.
- 미승격·HOLD·실패도 보존한다. `STATE.json` 같은 수정 가능한 작업 상태는 변경할 때마다 새 snapshot으로 저장한다.
- 과거 executable·계약도 복원 자료로 보존한다. 보존했다는 이유로 오래된 실행 규칙을 현재 규칙으로 적용하지 않는다.

DB의 `blob`은 SHA-256별 원본 바이트를 zlib으로 압축해 중복 없이 저장한다. `snapshot`과 `entry`는 저장 시점·label·원래 저장소 경로·정확한 파일 집합·해시를 연결한다. 줄바꿈, JSON 필드 순서, CSV 순서, manifest 내용은 바꾸지 않는다. 수정본은 새 snapshot에 추가하며 이전 행의 UPDATE/DELETE는 DB trigger로 거부한다. Artifact를 별도 팩터 테이블로 재해석하지 않으므로 판정의 두 번째 진실 원천을 만들지 않는다.

초안은 아직 저장하지 않은 편집 내용이다. 원본은 작업 입력에 포함해 보존하고, 인계·작업 종료 전에 저장·백업 receipt를 확인한다. 같은 연속 작업의 내부 단계마다 별도 `save`·백업을 반복하지 않는다. 메시지에만 있는 HOLD 정보는 `STATE.json`에 반영하고 작업 결과와 함께 저장해야 한다.

인계 확인은 해당 입력·결과의 snapshot과 `BACKED_UP` receipt를 사용한다. `verify`는 저장된 모든 snapshot과 blob을 읽는 전체 작업 저장소 감사이며, 매 수집·동결·봉인 뒤에 반복하는 게이트가 아니다. 복원·손상 의심·명시적 전체 감사 때 실행한다. 자동 검사와 백업이 끝난 고정 수집분은 담당 검토자에게 즉시 전달하고, 이후 REPORT 수정은 별도 저장하되 인계를 지연시키지 않는다.

## 기본 명령

저장소 루트에서 Python 3.13 표준 라이브러리만 사용한다.

```powershell
# 작성·수정된 자료 저장. 같은 경로를 다시 저장해도 이전 버전이 남는다.
python scripts/catalog_workspace.py save --label collection-handoff .tmp/catalog-expansion-continuation-20260902/research/<assignment>
python scripts/catalog_workspace.py save --label state-update .tmp/catalog-expansion-continuation-20260902/STATE.json

# 저장된 revision 목록. verify는 복원·손상 의심·명시적 전체 감사 때만 실행.
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

### 작업 단위 저장·백업 — 2026-09-12 사용자 변경

저장·백업 단위는 작품이나 내부 명령이 아니라 **한 번에 받은 처리분**이다. 오라클의 최종 원장 9작품을 받았다면 seal → 직렬 publish → 제품 readback → STATE 갱신을 하나의 로컬 작업으로 묶는다. 원격 요청·담당자 인계는 작업 경계이며 원격 응답을 기다리는 동안 작업을 열어 두지 않는다.

새 도구 없이 기존 `catalog_workspace.py run`을 바깥에서 한 번 사용한다. 해당 처리분의 원본·기준 pair·코드·동결 입력을 `--input`에, 생성될 각 batch·publication·validation 경로와 STATE를 `--output`에 지정한다. 전체 작업 저장소나 전체 runs를 지정하지 않는다. 내부 authoring CLI는 상위 run의 `KONOCOMICS_AUTHORING_RECORDED`를 상속해 중복 저장을 생략한다. 제품 readback에도 안쪽 `catalog_workspace.py run`을 다시 추가하지 않는다. 이 환경변수만 수동 설정해 저장을 우회하지 않는다.

입력 저장·백업 한 번과 종료 결과·실패·명령 출력 저장·백업 한 번, 즉 **작업 전체의 시작/종료 두 번**으로 묶는다. 중간 artifact는 고유 경로에 남기고 단계별 명령·종료코드·원시 출력도 상위 결과에 포함한다. 실패 시 의존 실행을 멈추고 부분 결과를 보존한다. 최종 BACKED_UP 전에는 작업 완료를 보고하지 않는다. 강제 종료로 마지막 저장이 없으면 미완료로 남기고 실제 상태를 읽은 뒤 재개한다. 단독 명령의 자동 저장과 물리 백업 두 세대는 유지한다.

출처·동결 membership·별도 판정·safety·coverage·발행 충돌·Gold·제품 readback은 유지한다. 오라클의 유효한 의미 판정을 조정자가 반복 심사하지 않으며 기존 검사가 통과하면 발행한다. 아래 명령 전후 저장 설명은 단독 명령 또는 위의 작업 전체에 적용하며 내부 단계별 백업 의무가 아니다.

수집 검사는 내용의 진실성을 대신하지 않고, SQLite 저장은 수집 검사도 대신하지 않는다. 기존 `validate_factor_collection_batch.mjs --research=... --require-source-audit`와 `prepare_factor_batch.py freeze / seal-result / publish`, registry correction의 판정·검증·직렬 발행 순서를 유지한다.

연결된 명령은 입력을 DB에 저장·백업한 뒤 원래 구현을 실행하고, 실제 결과 또는 남아 있는 실패 출력을 다시 저장·백업한 뒤 결과를 보고한다. SQLite 기록에는 단계별 snapshot ID가 남으며, 명령 인자·작업 경로·종료 코드와 stdout/stderr 원본도 중간 파일 없이 DB에 직접 기록한다. 저장·백업 실패는 정상 완료로 보고하지 않으며 기존 원본과 부분 결과를 보존한다. 발행 성공 뒤 저장 실패가 나면 실제 후보 DB가 존재할 수 있으므로 **같은 출력을 무조건 재실행하지 말고 먼저 readback**한다. current 갱신은 기존 최종 제품 검증 이후에만 한다.

`command.json`의 `timingsSeconds`는 단조 시계로 측정한 `inputSave`, `inputBackup`, `command`, `outputSave`를 보존한다. 마지막 stderr의 `authoringStorage.timingsSeconds`에는 `operationSave`, `outputBackup`, `total`도 포함한다. 마지막 백업의 시간은 그 백업 안에 소급 저장할 수 없으므로 최종 receipt에만 남으며, 진단값을 위해 추가 백업을 만들지 않는다. `total`은 입력 저장 시작부터 마지막 백업 완료까지이며 참조 입력 탐색·결과 출력 시간은 제외한다. 두 번의 백업과 원본·membership 검증은 유지한다.

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

### 2026-09-12 계측·최적화 확인

- 기준은 `ca308e7`과 로컬 수정본이다. [Oracle 세션](https://chatgpt.com/c/6aa4cc89-4a60-83ee-a91f-790fe03b7b2b)에 repomix 원문을 직접 전달했다. digest·저장 계측을 채택하고, 추가로 지적된 HTTP-date의 UTC/유효성 검사와 빈 대상 캐시 보존을 수정했다. 최종 파일 검토에서 두 결함 해소·추가 필수 수정 없음 판정을 받았다. Oracle의 분리 실행은 Node 22이며 아래 로컬 실행은 Node 24.19.0이다.
- 실제 1작품 collection CLI의 저장 wrapper는 입력 저장 **0.0385초**, 입력 백업 **14.1266초**, 원래 명령 **0.0889초**, operation 저장 **0.0114초**, 출력 백업 **12.7194초**, 합계 **26.9848초**였다. 당시 작업 DB는 **1,710,477,312바이트**였다. 입력 snapshot **1006**과 operation **1007**을 백업하고, 백업에서 각각 **4파일·3파일**을 기존 `restore`로 복원해 저장 SHA-256과 입력 원본 바이트를 확인했다. 이 작은 실행의 비용 측정이며 신규 작품 수집·판정·발행 처리량은 아니다. 백업 횟수·검사·보존 범위는 유지했다.
- 실제 canonical **10개 table·358,424 cells**의 digest는 모두 동일했다. 같은 입력의 3회 측정 중앙값은 **1,050.97ms → 278.19ms**로 감소했다. 최종 기존 build/verify는 `v1-a6997804fb18`, **1,700작품**, **0 errors / 10,378 warnings**, eligible **1,568 PASS / 0 FAIL**이었다. canonical SQLite와 추적된 생성 파일 **8개**는 빌드 후에도 기존 바이트와 같았다. README 수정에 따른 source manifest와 엔진 소스 identity 변경은 데이터 digest 호환성과 별개이며 과거 동결 manifest를 다시 쓰지 않았다.
- 저장 회귀 **7개**, 최종 Rakuten 회귀 **14개**, 기존 캐시 **2,114 queries / 0 fetched** 확인을 통과했다. 앞선 관련 TS 실행은 **31 PASS / 1 FAIL**이며 실패는 별칭 179개에 한 개를 추가하면서 총 179개를 기대하는 기존 authority 테스트다. `typecheck`는 수정하지 않은 `taste-flow.test.tsx:206`의 `missing-work`/`never` 오류로 실패했다. 두 별도 결함을 이번 최적화에 섞지 않았으며 CI·E2E·전체 테스트·실제 API 재수집·GitHub 발행·배포는 수행하지 않았다.
