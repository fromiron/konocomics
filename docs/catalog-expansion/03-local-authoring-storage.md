# 로컬 Catalog 작업 저장소

현재 확정 사양 · 갱신일: 2026-09-26

이 문서는 저장 위치·보존 범위·백업 경계의 단일 운영 계약이다. 현재 운영 세대는 schema v3이다. [최신 검증 요약](authoring-retention-20260926.md)은 실행 근거와 한계를 기록하며 이 문서의 규칙을 대신하지 않는다. 과거 규칙은 Git 이력에서 확인한다.

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

- 보존 대상은 현재 큐레이션, 실제 원문·관찰·범위·한계, 의미 있는 판정 변경, 최신 유효 READY/HOLD, 미완료 작업 의존과 중복 발행 방지 기록이다. 모든 실행 사본의 영구 복원을 요구하지 않는다.
- `revision`·`head`·`revision_blob`과 SHA-256/zlib blob을 사용한다. 같은 내용의 재저장은 같은 revision을 반환한다. UUID와 generation을 사용하며 옛 snapshot 번호를 새 ID로 재사용하지 않는다.
- 현재 기준점 `CURATION-BASELINE.json`은 원래 result/input manifest·claim·원문과 현행 SQL 행을 대조한다. 값만 읽어 새 승인 판정을 만들지 않는다. AEP·기존 모델 판정·미검토·Gold 구분과 unknown을 보존한다. legacy 권한은 검증된 adapter와 명시적 bundle pin으로 유지한다.
- prior reader는 기준점에서 필요한 작품을 읽는다. 필요한 권한·원문 결속은 검증하되 과거 전체 publication 계보를 매 작품 순회하지 않는다. 누락·손상된 근거를 합성하지 않는다.
- 완료 배치는 `completion` revision의 summary SHA·실제 발행/readback·STATE 적용 기록으로 중복을 차단한다. 작은 원래 receipt를 보존하며 재수신 때문에 오래된 전체 STATE/publication을 다시 열지 않는다.
- 기존 frozen SHA·원본 바이트·판정 이력은 변경하지 않는다. 새 사실·정정은 새 revision에 남긴다. 같은 경로의 다른 원본 버전은 덮어쓰지 않는다.

## 저장과 백업의 단계 경계

| 시점                                                           | 필수 동작·상태                                                                                                            |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 원문 수집, prepare/check, 새 판정·실패·checkpoint 저장         | 즉시 SQLite commit 및 `PERSISTED`. 내부 명령마다 물리 백업하지 않는다.                                                    |
| 수집 배치 완료, 판정 배치 완료, 발행 완료, 작업 종료·부분 중단 | 필요한 원본·결과·receipt를 백업하고 실제 source/latest를 대조한 뒤 `BACKED_UP`.                                           |
| 변경 없는 재실행                                               | 실제 입력·원문·membership·receipt 결속을 확인하고 유효 결과 재사용. 불필요한 revision·백업 복사/rotation을 만들지 않는다. |

신규 배정 크기와 단계 전환은 [배치 계약](01c-sol-batch-promotion-plan.md)을 따른다. 원본 저장·작품별 기계 검사·checkpoint는 배치 끝까지 미루지 않는다. `PERSISTED`는 마지막 경계 백업에 포함됐다는 뜻이 아니며 작업자가 문자열을 `BACKED_UP`으로 바꾸면 안 된다.

명시적 `catalog_workspace.py backup` 또는 `notification_guard.py enqueue`가 경계 백업을 수행한다. Stop/Interrupt hook은 무거운 백업을 실행하지 않는다. 독립 명령 하나가 발행/인계 경계인 경우에만 `run --phase-boundary`를 사용한다. 최종 백업 실패는 미완료로 보고하고 실제 저장 결과에서 재개한다. 강제 종료 전 미저장 자료를 복원됐다고 주장하지 않는다.

collection summary의 `workspaceAndBackupReadbackVerified`는 실제 source/latest의 원문 SHA 확인을 가리킨다. 상태명·manifest 파일 SHA 하나·경로 존재만으로 원본 보존이나 백업을 대신하지 않는다. 전체 blob 감사와 해당 단계 원문 검사는 다른 범위다.

## 실행·잠금·복원

- 역할별 `prepare`·`check`·발행·통지 명령은 [runner README](../../scripts/catalog_authoring/README.md)를 따른다. `run --decisions`는 발행 명령이며 작업자의 비발행 검사로 사용하지 않는다. 판정 누락을 모델 자동 호출로 채우지 않는다.
- 원격 수집·모델 판정은 공유 writer 밖에서 수행한다. 파일 준비와 읽기 연결은 필요한 범위만 유지하고 신규 revision/blob commit·공유 상태 변경은 기존 잠금으로 직렬 처리한다. 실제 잠금·백업 구현을 우회하는 수동 SQL이나 새 writer를 만들지 않는다.
- 정상 백업은 검증된 같은 세대의 이전 백업에 새 immutable revision/blob과 현재 head를 반영하고 필요한 원문을 readback한다. 새 세대의 첫 백업은 별도로 생성해 전체 검증한다. 같은 세대의 정상 운영에는 `latest.sqlite` 하나를 유지한다.
- 실행에 실제 사용한 입력·직접 의존·도구를 결속한다. 도구 디렉터리 전체나 관계없는 과거 실행 사본을 무조건 추가하지 않는다. 원본 파일/집합이 저장 중 바뀌면 성공으로 기록하지 않는다.
- 과거 artifact의 경로는 읽기 경계의 `workspace_paths.artifact_path()`로 해석한다. 원문 경로 문자열·manifest를 재작성하거나 호환 심링크/junction을 만들지 않는다.
- 복원은 SHA 재계산·경로 이탈·링크·기존 파일 덮어쓰기 검사를 유지한다. source SQLite의 exact-byte 이관은 writer/journal 상태를 확인한 뒤 진행한다.
- 환경 이전은 수집·발행·DB writer 종료 후 `data/local/catalog-authoring/` 전체와 같은 버전의 추적 코드를 복사한다. 루트가 바뀐 절대 경로는 별도 매핑과 검증이 필요하다.
- 같은 디스크의 백업은 임시 파일 정리 사고에 대비한 별도 사본이며 디스크 장애의 독립 백업은 아니다. 외부 백업은 별도 목적지 권한을 확인한다.

## 기본 명령

저장소 루트에서 기존 Python 표준 라이브러리 도구를 사용한다. 실행 전 해당 명령의 `--help`와 대상 세대를 확인한다.

```powershell
python -B -X utf8 scripts/catalog_workspace.py save --label <작업-label> <원본-또는-결과-경로>
python -B -X utf8 scripts/catalog_workspace.py list
# 명시적 단계 완료/인계 경계
python -B -X utf8 scripts/catalog_workspace.py backup
# 복원·손상 의심·명시적 전체 감사에만 실행
python -B -X utf8 scripts/catalog_workspace.py verify
```

v3의 저장 영수증은 실제 generation/revision을 사용한다. 기존 receipt의 `snapshot`·`snapshotId` 필드명만 보고 숫자 ID를 추정하지 않는다. `restore --snapshot <ID>`/`checkout --snapshot <ID>`는 실제 v3 revision UUID 또는 보존된 legacy snapshot ID를 받는다. generation·membership·원문 SHA를 확인하며 폐기된 전체 실행 트리의 복원을 약속하지 않는다. restore는 새 destination, checkout은 현재 존재하지 않는 prefix에만 사용한다.

## 출판사 소개를 수집과 함께 저장

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
node --import tsx scripts/import-publisher-book-metadata.ts --input <collection>/publisher-metadata.json --output .workspace/<new-publication-directory>
```

이 명령은 기존 저장 wrapper와 직렬 발행 경계를 사용한다. 입력·새 결과·실패는 즉시 영구 저장하고, 서지 발행 완료/중단 경계에서 백업·readback을 확인한다. 기존 collection 저장 후 서지 파일을 추가했다면 새 revision이 필요하다. 단순 수집 단계에서도 기존 `catalog_workspace.py save` 또는 direct collection의 디렉터리 저장을 사용한다.

- metadata 행이 없고 같은 Work·ISBN Volume이 존재하며 소개가 유효하면 한 응답에서 확인한 필드만 추가한다. 중복 ISBN·다른 Work 충돌·receipt/원문 hash 불일치는 발행 전에 실패한다.
- 기존 metadata 행은 빈 필드까지 그대로 보존한다. 같은 URL의 다른 수집분을 섞거나 수집일만 갱신하지 않는다. 기존 행의 갱신은 유지할 모든 필드를 한 응답에서 재확인하는 별도 완결 검토가 필요하다.
- 아직 canonical에 없는 ISBN은 `deferred-missing-volume`, 빈 소개는 `skipped-empty-caption`으로 보존한다. 정식 Work·Volume 추가 뒤 같은 입력을 다시 반영할 수 있다. 소개를 위해 Factor 승격을 요구하지 않는다.
- 기존 authority projection·finalize·build와 `publishDirectorySet`을 재사용한다. 다른 9개 table과 opaque 문서는 보존하고 baseline DB·source manifest 및 준비 artifact hash를 교체 전에 확인한다. 작업은 직렬로 실행하며 진행 중 Factor bundle의 frozen identity를 갱신하지 않는다.
- `receipt.json`의 실제 disposition, `published` 및 DB/생성 파일 readback을 확인한다. 생성된 `Volume.metadata`는 기존 상세 경로에서 유효한 Rakuten 항목 뒤의 fallback으로 사용한다. 로컬 발행은 GitHub 발행·배포 증거가 아니다.

## Compact 발행 자료

- 기본 `catalog-compact-publication-v1`은 private catalog/registry 한 쌍을 사용한다. 작품별 두 DB 변경과 승인 plan의 expected-after 검사를 동일 attached SQLite transaction에서 수행한다. canonical과 기존 publication은 바꾸지 않는다.
- 공통 입력·실행 코드·원본 frozen/판정은 저장소의 정확한 member SHA에 결속한다. 새 파일만 저장하고 source/latest에서 실제 원문과 membership을 확인한다. 구 snapshot 의존은 명시적 pin으로 유지하며 임의로 새 revision ID로 바꾸지 않는다.
- `works/<workId>.json`은 원본 input/authority 참조, 검토 시각, 승인 plan, before/after 의미 digest, 논리 delta와 expected-after를 보존한다. 원래 판정을 검증한 planner로 기대 상태를 재구성하며 actual self-hash만 확인하지 않는다. 과거 SQLite의 물리 bytes와 같다고 주장하지 않는다.
- 기본 checkpoint 간격은 10작품이다. 완전히 저장·백업된 checkpoint의 pair/receipt로 재개하고 이후 미완료 작업은 같은 불변 intent로 재적용한다. 최종 projection·제품 readback·backup 후 기존 STATE/completion 경로를 사용한다.
- prior/review reader는 원래 sealed 판정과 보존된 검토 문서를 읽는다. 구 full 형식도 지원하되 신규 compact를 위해 가짜 full 디렉터리를 만들지 않는다.
- 원본 의존 복원은 정확한 member/blob을 검증한다. 같은 경로의 다른 버전은 `restored-versions/<sha256>`와 `.catalog-restore.json`으로 분리하며 누락/손상은 실패로 보고한다.

## 세대 전환과 정리

활성 v3의 정상 정리는 `gc`다. 성공 종료 후 7일이 지난 비고정 execution과 참조 없는 blob만 제거한다. 의미 있는 큐레이션 이력·미해결 실패·활성/legacy pin은 시간이나 mtime만으로 제거하지 않으며 수명이 불확실하면 유지한다. 배치마다 VACUUM을 하지 않는다.

v2에서 v3으로의 전환 순서는 read-only plan → `workspace.next.sqlite` 선택 복사 → 현재 값·원문·실제 prior/재개 검증 → 별도 새 백업 → writer 중지 경계의 DB/STATE 교체다. DB pathname 교체는 atomic이지만 DB와 STATE 전체는 하나의 atomic transaction이 아니다. `RETENTION-MAINTENANCE.json`의 같은 intent로 중단된 전환을 재개한다.

```powershell
# 아래 build/activate는 v2에서 v3으로 전환할 때만 사용
python -B -X utf8 scripts/catalog_retention.py plan --output <retention-plan.json>
python -B -X utf8 scripts/catalog_retention.py build --plan <retention-plan.json> --legacy-integrated <원래-result-root> --report <build.json>
python -B -X utf8 scripts/catalog_retention.py verify --build <build.json> --report <verified.json>
python -B -X utf8 scripts/catalog_workspace.py --database data/local/catalog-authoring/workspace.next.sqlite backup --destination data/local/catalog-authoring/backups/retention-next.sqlite
# 모든 writer 종료 확인 후. 중단된 같은 전환은 --resume
python -B -X utf8 scripts/catalog_retention.py activate --build <build.json> --verification <verified.json>
# 실제 새 경로 readback 후 cutover가 지정한 구 v2 파일에만 적용
python -B -X utf8 scripts/catalog_retention.py prune-retired --cutover data/local/catalog-authoring/RETENTION-CUTOVER.json
# 활성 v3 정상 정리: 검토 후 승인된 범위만 적용
python -B -X utf8 scripts/catalog_retention.py gc
python -B -X utf8 scripts/catalog_retention.py gc --apply
```

전환 전 아직 v2인 저장소에는 v2 동작을 유지한다. v3으로 해석하거나 숫자 snapshot을 UUID로 치환하지 않는다. v3을 이해하지 못하는 코드는 schema 검사에서 거부한다. plan 이후 입력·보호 파일이 바뀌면 다시 선별한다. 검증된 plan 범위 밖 물리 사본을 함께 삭제하지 않는다. `.workspace/user-sources/`, `handoff/`, 미분류 사용자 자료와 활성 의존은 보호한다.

원본의 권한·의미·검증 한계는 축소 후에도 유지한다. 정리 완료는 실제 제거와 readback으로 확인하며 archive로 이름만 바꾼 것을 축소라고 보고하지 않는다. 계약 갱신만으로 DB 전환·정리·큐 재개를 실행하지 않는다.
