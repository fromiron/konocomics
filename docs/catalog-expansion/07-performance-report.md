# 카탈로그 승격 성능 보고서

측정일: 2026-08-23 (JST)

## 결론

Batch 002 뒤 전체 canonical 수는 1,614로 같고 추천 가능 작품은 233개다. 로컬 데스크톱에서 `tactical-mystery` 프로필의 순수 추천 계산은 p50 22.329ms, p95 27.713ms였다. Pilot 001의 200후보 대비 후보 수가 16.5% 늘 때 각각 17.061%, 16.902% 증가해 현재 범위에서는 후보 증가와 거의 선형이며 비정상적인 회귀는 확인되지 않았다. 100회 결과 바이트 hash는 모두 같았다.

Batch 002 추천 projection은 raw 752,818 bytes, gzip 47,637 bytes, Brotli 28,205 bytes다. 이 결과는 CPU throttling이나 브라우저·네트워크가 없는 개발 PC의 순수 로컬 측정이며 모바일, production-local, 실제 배포 성능을 입증하지 않는다.

## Batch 002 측정

- 기준 HEAD: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a` + Batch 002 승격이 적용된 dirty worktree
- 전체 Catalog: `v1-55a34b73abb4`, 1,614작품
- 추천 projection: `v1-28e5de19a60b`, 233작품
- 환경: Linux 7.1.8-arch1-3, AMD Ryzen 5 5600X, logical CPU 12, Node.js v24.14.0
- rank 프로토콜: 20회 warmup + 100회 측정, `tactical-mystery`, `rankRecommendations`만 포함

| 산출물                      | raw bytes | gzip bytes | Brotli bytes | SHA-256                                                            |
| --------------------------- | --------: | ---------: | -----------: | ------------------------------------------------------------------ |
| 전체 Catalog                | 3,605,988 |    211,650 |      104,881 | `350222bf04df30ba3041998490af97ad1c379ce4d6cbee1fccc418056d269264` |
| 전체 recommendation context |    52,095 |      6,913 |        5,223 | `c47f34de8e66590905177a610e8854da4e8a18119a36817a6a3f0b40c1d4a42c` |
| 추천 projection Catalog     |   752,818 |     47,637 |       28,205 | `2a400b430f5ec38b28fbad52a59169331a297289cbd888bd3f9711f02933eb05` |
| 추천 projection context     |    52,095 |      6,913 |        5,222 | `eb0ff1af645dc25a6f245dc590cade8d78c3100256043c6a627debd80fa68828` |

gzip과 Brotli는 기존 Pilot 기록과 같은 Node `gzipSync`·`brotliCompressSync` 기본 설정이다. Pilot 001 대비 전체 Catalog는 raw +0.878%, gzip +2.645%, Brotli +1.510%이고, 추천 projection은 raw +15.269%, gzip +15.826%, Brotli +13.159%다.

| 항목      | Pilot 001 | Batch 002 |                변화 |
| --------- | --------: | --------: | ------------------: |
| 추천 후보 |       200 |       233 |      +33 (+16.500%) |
| rank p50  |  19.075ms |  22.329ms | +3.254ms (+17.061%) |
| rank p95  |  23.706ms |  27.713ms | +4.007ms (+16.902%) |

Batch 002의 min/max는 19.966/36.734ms이며 100회 결과 SHA-256은 `da707b514a8e32a3eddff4d46bace1be6c22fbb1a52073880870afb5417ecb16`이다. 원시 측정 JSON은 `/tmp/batch002-post-performance.json`에만 두었고 SHA-256은 `8bdbf8b01f5430fe2d0af61e104164a0590235e6198f5825d960c0388a969fb0`다.

## Batch 002 production-local gate

`pnpm build`, `pnpm harness:build`, `pnpm test:e2e`를 2026-08-23에 다시 실행했다. 제품과 G2 harness build가 통과했고, production server를 사용하는 fixed Playwright 시나리오는 desktop·390×844 mobile Chromium에서 10/10 통과했다. 이 검증은 provider 실패 복구, 추천 reload 안정성, 피드백 backfill, Catalog·external Library 영속성, Export→삭제→Import 원자성을 포함한다.

현재 client build의 주요 크기는 전체 Catalog chunk 1,950.85 kB(minified) / 182.07 kB(gzip), recommendations route 70.08 / 17.10 kB, main index 336.48 / 115.41 kB, CSS 250.18 / 61.22 kB다. Catalog chunk는 Vite의 500 kB 경고를 초과하므로 전체 승격이 진행될수록 계속 추적한다. 이번 단계에서는 측정된 기능 회귀가 없고 recommendation 산식 변경도 금지되어 있어 speculative shard·retrieval index를 추가하지 않았다.

이 production-local E2E는 실제 Android, CPU slowdown, throttled network, 메모리·LCP 측정의 대체가 아니다.

## Pilot 001 비교 기준과 기록

아래의 “현재”는 Batch 002 이전 Pilot 001 직후 snapshot을 뜻한다.

승격 전 기록값은 다음과 같다.

| 항목                |         승격 전 |
| ------------------- | --------------: |
| 전체 작품           |           1,614 |
| 추천 가능 작품      |             150 |
| compile             |       576.605ms |
| 전체 Catalog raw    | 2,137,273 bytes |
| 전체 Catalog gzip   |   173,013 bytes |
| 전체 Catalog Brotli |    96,818 bytes |
| rank p50            |        13.352ms |
| rank p95            |        17.286ms |

승격 전 compile 값은 단일 기록값이고, 그때의 warmup·반복 수와 rank 프로필 정보는 저장소에 보존되어 있지 않다. 따라서 파일 크기는 정확히 비교할 수 있지만 compile과 rank 증감률은 동일 장비의 방향성 비교이며 엄격한 A/B gate로 사용하지 않는다.

## 측정 환경

- 기준 HEAD: `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a` + Pilot 승격이 적용된 dirty worktree
- OS: Linux 7.1.8-arch1-3, x86_64
- CPU: AMD Ryzen 5 5600X 6-Core Processor, logical CPU 12
- 메모리: 33,567,207,424 bytes
- Node.js: v24.14.0
- pnpm: 10.30.3
- 전체 Catalog: `v1-85de75ee2a47`, 1,614작품, 추천 가능 200작품
- 추천 projection: `v1-4632c297fc3b`, 200작품
- CPU slowdown, 브라우저, 네트워크 throttle: 사용하지 않음

## 프로토콜

1. `pnpm --silent catalog:build`를 1회 warmup한 뒤 5회 측정했다. pnpm/tsx 시작, CSV load·compile·validation, 산출물 쓰기를 포함한다.
2. `runCatalogPipeline(data/source)`를 2회 warmup한 뒤 10회 측정했다. CSV load·compile·Art validation을 포함하고 파일 쓰기는 제외한다.
3. 저장소 fixture `data/fixtures/experiment-profiles/tactical-mystery.json`과 추천 projection을 사용해 `rankRecommendations`만 20회 warmup 후 100회 측정했다. JSON parse와 파일 I/O는 제외했다.
4. percentile은 nearest-rank `sorted[ceil(q × n) - 1]`로 계산했다.
5. 크기는 파일 원본과 Node `gzipSync`, `brotliCompressSync` 기본 설정으로 계산했다.

## Compile과 build

| 항목                          |         p50 |         p95 |         min |         max | 비고               |
| ----------------------------- | ----------: | ----------: | ----------: | ----------: | ------------------ |
| `runCatalogPipeline`          |   466.421ms |   623.836ms |   397.366ms |   623.836ms | 2 warmup + 10 runs |
| `pnpm --silent catalog:build` | 1,539.398ms | 2,579.489ms | 1,389.417ms | 2,579.489ms | 1 warmup + 5 runs  |

compile 10회 raw sample은 `623.836, 497.588, 397.366, 466.421, 399.801, 438.794, 469.467, 561.733, 466.124, 482.161ms`다. build 5회 raw sample은 `1,539.398, 2,579.489, 1,753.315, 1,389.417, 1,471.351ms`다. 여섯 번의 build(warmup 포함)는 모두 `v1-85de75ee2a47`을 생성했고 stderr는 없었다.

승격 전 단일 compile 기록 576.605ms와 비교하면 현재 p50은 19.109% 낮고 p95는 8.191% 높다. 비교 기준의 분포가 없으므로 compile 회귀 또는 개선으로 판정하지 않는다.

## 산출물 크기

| 산출물                           | raw bytes | gzip bytes | Brotli bytes | SHA-256                                                            |
| -------------------------------- | --------: | ---------: | -----------: | ------------------------------------------------------------------ |
| 승격 전 전체 Catalog             | 2,137,273 |    173,013 |       96,818 | 기록 없음                                                          |
| 현재 전체 Catalog                | 3,574,608 |    206,196 |      103,321 | `ad9f7e7d1afa87639ffda3cb96ad6bfb27f28082673bb5669ed857a937db9f10` |
| 현재 전체 recommendation context |    44,371 |      5,942 |        4,539 | `01f9d8669557f9e10a2a9eb242a0abd6038616d535d0a083a5b427f51279c5de` |
| 현재 추천 projection Catalog     |   653,095 |     41,128 |       24,925 | `96f8da23d8988259e10a55bb2d0db5504576edbde2fa27f5b403d4a359f4181a` |
| 현재 추천 projection context     |    44,371 |      5,943 |        4,526 | `871863438f654725bacaa11f7d921befebfcb2afef9abb61b1d0dac4a5352b90` |

현재 전체 Catalog의 승격 전 대비 증가는 raw `+1,437,335` bytes(+67.251%), gzip `+33,183` bytes(+19.179%), Brotli `+6,503` bytes(+6.717%)다. 추천 projection의 승격 전 크기 기록은 없어 증감률을 만들지 않았다.

## 추천 계산

| 항목      | 승격 전 기록 |     현재 |                변화 |
| --------- | -----------: | -------: | ------------------: |
| 추천 후보 |          150 |      200 |      +50 (+33.333%) |
| rank p50  |     13.352ms | 19.075ms | +5.723ms (+42.864%) |
| rank p95  |     17.286ms | 23.706ms | +6.420ms (+37.139%) |

- 측정 범위: `rankRecommendations`만 포함
- fixture: `tactical-mystery`
- warmup/runs: 20/100
- min/max: 17.448/28.634ms
- 100회 결과 동일: 예
- 결과 SHA-256: `8cef9195b9bae3d68da66b4376c800c000515245ebcd39d2d582095b3a6a5f6e`

후보 수보다 p50 증가율이 크지만 절대 p95는 이 개발 PC에서 23.706ms였다. 현재 계약에 순수 rank 시간의 합격 임계가 없으므로 이 수치만으로 별도 Web Worker나 retrieval index를 도입하지 않는다. 전체 batch에서 후보가 더 늘 때 같은 프로토콜로 추세를 다시 측정한다.

## 검증 한계와 후속 측정

이번 측정은 다음을 검증하지 않았다.

- JSON parse·초기 로드·route chunk와 초기 JavaScript 요청량
- onboarding/library 검색 시간
- 추천 preview의 React render와 사용자 입력 후 전체 지연
- 브라우저 메모리, CPU slowdown, frame interval/FPS
- 390×844/DPR 3, 4× CPU, throttled network의 production-local LCP/CLS
- 실제 중급 Android 열·프레임, 실제 cellular/provider, iOS/Android 설치 모드

따라서 `docs/planning/04-visual-interaction-spec.md` §8과 `07-acceptance-test-plan.md`의 production-local 성능 gate는 별도로 실행해야 한다. 이 보고서는 데이터 승격 직후의 로컬 compile·크기·순수 rank 추세만 기록한다.

원시 측정 JSON은 작업 중 `/tmp/pilot-post-performance.json`에 생성했으며 SHA-256은 `d438c299c70f0f20d9432f2a39fa69a9ea15d8065c542604bcaaa1353f0f738d`다. `/tmp` 파일은 커밋 산출물이 아니며 모바일 또는 배포 증거가 아니다.
