# Catalog 저장소 압축 실행 기록

문서 갱신일: 2026-10-14 · 운영 실행일: 2026-10-14

현재 저장 규칙은 [저장 계약](03-local-authoring-storage.md#세대-전환과-정리)에서 관리한다. 이 문서는 2026-10-14 실행의 대상 identity, 측정값, 검증 범위, 남은 한계만 기록한다.

## 대상과 판정

- 구현 브랜치: `chore/catalog-storage-compaction`. 코드 커밋 `9d8db91`에서 실행했고, 이후 gc 미리보기 집계 수정은 같은 브랜치의 후속 커밋에 있다.
- 저장 세대: generation `53d00f3c-e974-417e-a145-6f7d487b144a`. schema v4에서 v5로 전환했다.
- **판정:** 추출 사본 정리, v5 전환, gc 적용, rollback 쌍 제거를 실제 저장소에서 수행하고 readback으로 확인했다.
- **범위 밖:** 새 작품의 판정과 승격, canonical 반영, GitHub 푸시와 배포, 독립 디스크 백업은 수행하지 않았다.

## 크기 변화

| 항목                    | 이전       | 이후       |
| ----------------------- | ---------- | ---------- |
| `data/` 전체            | 54G        | 13G        |
| `workspace.sqlite`      | 13.9G (v4) | 4.52G (v5) |
| `backups/latest.sqlite` | 13.9G      | 4.52G      |
| `artifacts/`            | 22G        | 3.4G       |
| `retained/`             | 4.2G       | 249M       |
| `restored-versions/`    | 2.5G       | 0          |

v5 DB의 내부 구성은 다음과 같다.

- **blob:** 5.68G에서 2.62G로 줄었다. 전환 때 xz로 재압축했다.
- **membership과 경로 인덱스:** 7.4G에서 1.54G로 줄었다.
- **change_log:** 690만 행에서 cursor 행 하나로 줄었다.

## 수행과 확인

1. **`prune-materialized`:** 미리보기와 적용 결과가 모두 252,239개 파일, 23.52GiB로 같았다. 적용 결과는 `operations/materialized-prune/`에 기록했다.
   - 보존한 파일은 내구 revision 결속이 없는 1,064개(주로 `BATCH-STORAGE.json`, `canonical-readback`)다.
   - 보호한 범위는 최신 attempt 1개와 현재·직전 기준점이다.
2. **v4 상태에서 완료 배치 재수신(R4):** `direct234-publication-v2` 배치를 기존 batch CLI로 재수신했다.
   - 결과는 `ALREADY_APPLIED`였다.
   - STATE와 canonical `catalog.sqlite`의 SHA가 바뀌지 않았다.
   - 다시 추출된 파일은 2개뿐이었다.
3. **`upgrade-v5`:** 35분이 걸렸다.
   - 원본과 대조한 결과 revision 25,415개(rowid 포함), membership 6,897,646행, blob 241,417개가 일치했다.
   - 전체 blob 디코드(원본 26.7GB)와 payload membership 감사를 통과했다.
   - 새 journal origin으로 초기 백업을 만들었고, STATE `authoringStore.schemaVersion=5`를 readback했다.
4. **`gc --apply`:**
   - 만료: execution 2,774개, 소유 artifact 2개, 대체된 제어 스냅샷 536개(membership 1,579,194행).
   - 대형 blob 5개를 재압축했다.
   - journal을 cursor `7013421` 아래로 정리했다.
   - 여유 페이지를 회수해 source와 백업이 각각 4.79G에서 4.52G로 줄었다.
5. **전환 후 검증:**
   - `catalog_workspace.py verify`가 source와 백업 양쪽에서 `STORAGE_VERIFIED`였다. 둘 다 revision 22,105개, blob 232,711개다.
   - `backup`은 `reused`였다.
   - v5 상태에서 다른 정리 배치(`direct10-integrated3-publication-v2`)를 재수신해 `ALREADY_APPLIED`를 확인했다. STATE와 canonical은 바뀌지 않았다.
   - `pnpm catalog:authority:verify` PASS.
6. **`prune-pre-v5`:** rollback 쌍(`workspace.pre-v5.sqlite`, `backups/pre-v5.sqlite`, 각 13.9G)의 revision 집합을 기록과 대조한 뒤 제거했다.

## 남은 한계

- 백업은 여전히 같은 디스크에 있다. 디스크 장애에 대비하려면 별도 목적지 결정이 필요하다.
- `.workspace/`(5.2G)의 출판사 metadata 발행 사본은 디스크를 직접 읽는 소비자를 검토하지 않아 정리 범위에서 뺐다.
- run·worker·collection 폴더(약 1.9G)와 적용되지 않은 attempt는 디스크를 직접 읽는 소비자가 있어 남겼다.
- Python 회귀 스위트의 기존 실패 106건은 변경 전 기준과 같은 목록이다. 이 checkout의 복구 표식이 임시 경로를 거부하는 환경 문제이며, 이번 변경으로 늘거나 줄지 않았다.
