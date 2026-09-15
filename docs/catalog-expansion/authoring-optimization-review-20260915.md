# Catalog authoring 개선·저장 경로 정리 검증

검토 기준: `b06c93c6ef1f7f7da8a3907a664d38d3bd165140`, Windows, Node `24.19.0`, 2026-09-15.

Oracle의 추가 개선을 실제 코드·보존 artifact와 대조했다. 저장 실패 후 미실행 요청 재개, 완료 모델 결과 재사용, 읽기 view 제공, 실제 DB·제품 코드에 결속된 readback 재사용은 유지한다. 신규 모델 호출·판정·Catalog 승격·STATE 변경·배포는 이번 검증 범위에 포함하지 않았다.

## 반영한 변경

- 실행 코드와 현재 발행 backend를 `scripts/catalog_authoring/`에서 Git으로 추적한다. 수집·판정 지시 문서는 `docs/catalog-expansion/`으로 옮겼다.
- 작업 DB·백업·원본·동결본·판정·인계 자료를 `data/local/catalog-authoring/`의 실제 디렉터리로 이전했다. `.workspace/`에는 검토 중 생성한 임시 자료만 남겼다.
- 저장소 안 33개 및 외부 백업 경로 1개의 호환 연결을 제거했다. `.git`·패키지 관리용 `node_modules`를 제외한 전체 탐색에서 남은 호환 링크는 0개였다. 기존 handoff 내용은 `artifacts/local/handoff/`에 보존했다.
- 과거 동결본과 DB 저장 키의 바이트는 변경하지 않는다. 읽기·복원 경계에서 기존 참조를 실제 위치로 해석하며 링크를 재생성하지 않는다. 전체 작업 사본이 소실된 경우의 복원도 검사했다.
- 경로가 바뀐 미실행 `PREPARED` 요청은 원본을 보존하고 새 위치를 담은 다음 요청을 준비한다. 실행 흔적이 있거나 상태가 불명확하면 재호출을 거부한다. 같은 경로에서 백업만 실패한 요청은 같은 attempt를 재사용한다.
- 실제 freeze에서 발견한 `correct_factor_registry` 의존성 누락을 수정했다. 기존 보정 원장과 원본 job의 SHA 검증을 유지한다.
- 영구 자료에 포함된 과거 코드·검증 복사본이 현재 lint·typecheck·Vitest 대상에 섞이지 않게 제외했다. 기존 taste 테스트의 `never` 타입 오류는 동일 의미의 `some` 비교로 수정했다.

## 이번에 직접 확인한 결과

| 확인                                           | 결과                                                                                                  |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Runner 회귀                                    | 21 PASS: 저장 전 호출 금지, PREPARED 재개·이전, 불명확 실행 거부, 결과 재사용                         |
| 작업 저장소 회귀                               | 15 PASS: 버전·백업·복원·변조 거부, 링크 없는 과거 저장 키 readback                                    |
| Single-pass 및 실제 보존 artifact              | 1 + 6 PASS: 실제 freeze, v3 소비, 원장·context·파일 집합 변조 거부, 원문 view                         |
| 기존 Candy job의 실제 freeze                   | PASS, 1작품, 약 4.18초(사전 검사 3.46초 + 동결 0.72초), 새 임시 출력은 제거                           |
| 실제 `prepare_factor_batch.py seal-result` CLI | PASS, 실제 저장·백업 포함 23.74초, seal 명령 1.38초, 신규 승격 없음                                   |
| 실제 제품 readback CLI                         | `SQL_BUILD_COVERAGE_ENGINE_VERIFIED`, 추천 엔진까지 실행, 생성 JSON 10개가 기존 결과와 byte-identical |
| typecheck / lint / catalog:validate            | PASS / PASS / PASS                                                                                    |
| 전체 Vitest (`--maxWorkers=2`)                 | 908 PASS / 14 FAIL: 동일 HEAD의 별도 작업 트리와 실패 집합 동일, 신규 실패 0                          |
| 변경 파일 포맷·Python 구문·diff 공백           | PASS                                                                                                  |

Seal CLI의 입력·출력·실행 기록은 작업 DB snapshot **1763·1764·1765**에 저장했으며 `latest.sqlite` 백업 receipt는 `BACKED_UP`, latest snapshot **1765**였다. 경로 이전 자체는 DB 바이트를 보존했고, 이후 위 검증 기록을 정상적으로 추가했다.

Candidate readback은 **3,309 works / 1,681 eligible / 1,628 libraryOnly / Gold 150**였다. canonical 검증의 **1,700 works / 1,568 eligible**와 다른 artifact이며 혼동하지 않는다. Canonical validator는 오류 0개, 기존 경고 10,378개였다.

STATE, canonical SQLite, Gold manifest, 기존 Candy candidate 및 registry의 SHA-256은 전후 모두 동일했다. Readback의 임시 생성 디렉터리는 제거했으므로 보관한 receipt를 재사용 가능한 출력 캐시라고 주장하지 않는다.

## 성능 및 검증 한계

Oracle의 동일 Candy 동결 입력 실험 기록은 기존 369.36초·파일 명령 32회, 최종 172.01초·0회였다. 단일 성공 사례에서는 약 53.4% 짧아졌다. 그러나 앞선 실패 두 번을 합친 세 번의 시도는 522.37초였다. 이것을 전체 작품 처리량 개선이나 동일한 의미 판정의 증명으로 확대하지 않는다. 이번 검토에서는 모델을 다시 호출하지 않았다.

전체 저장소는 green이 아니다. 기준 HEAD의 기존 CI도 실패 상태였다. 14개 기존 실패는 Catalog alias·promotion registry 기대값, Windows 경로·권한·npm 실행, 실험 golden, taste·작품 상세 테스트에 걸쳐 있다. 기본 병렬 실행에서 추가로 흔들린 Catalog 테스트 두 개는 해당 파일 단독 실행에서 7개 모두 통과했고, 동시 실행 수를 제한한 전체 검사에서는 기준 HEAD와 동일한 실패 집합이었다.

과거 준비 테스트 일부는 보존되지 않은 `jobs/hina-drifters/records.json` 등 역사적 fixture 때문에 전체 실행할 수 없었다. 원본을 합성하거나 테스트 기준을 완화하지 않았다. 위 43개 회귀와 실제 freeze·seal·readback의 결과를 전체 과거 Python 검사가 통과했다는 의미로 사용하지 않는다.

로컬 검증 원본은 `data/local/catalog-authoring/` 작업 저장소에 보존한다. 실행 안내와 현재 경로 계약은 [도구 README](../../scripts/catalog_authoring/README.md), [로컬 저장소 계약](03-local-authoring-storage.md)을 따른다.
