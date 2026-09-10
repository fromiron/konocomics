# 검증 완료 14작품의 정식 Catalog 반영

## 승인과 범위

2026-09-10 사용자는 추천 가능 후보를 정식 DB에 등록해야 한다고 확인한 뒤, **검증 완료 14개와 판정 근거만 정식 DB에 반영 → 빌드·추천 확인 → 추가 로컬 커밋**하는 제안에 `진행해`라고 승인했다. 후보 전체 전환, GitHub push·PR·배포 승인은 아니다.

이는 복구 계약의 기존 canonical 보존 경계에 대한 이번 14작품 한정 후속 승인이다. 과거 복구 epoch·정책·입력/결과 manifest는 수정하지 않는다. 원본 003 소실과 `originalScopeComplete=false`, 미재판정·BLOCKED 상태도 그대로 유지한다.

입력은 `recovery-factor-263-publication-20260909-v1`의 이미 발행·검증된 판정이다. 원시 후보 값이나 과거 PASS를 새 권한으로 사용하지 않는다.

- 전환 전 canonical SHA-256: `78888710f280f9a10ab3f93f94c63ea80e897c4fc4cff9416c9ef33fb618f83b`
- 입력 후보 SQLite SHA-256: `eb645b67ccfe54815c7372898b2e7b77d4e5605cc881903ae7b56c37ae01d85e`
- 입력 publication manifest SHA-256: `3abff16364ff49cbe17ce2921481cf63174704a375785218adee3b882aa41dfa`
- 전체 후보 3,309개 중 14개만 반영한다. 기존 추천 1,441개, 비대상 작품과 모든 기존 evidence는 보존한다. 13개 신규 등록과 1개 기존 library-only 승격으로 총 1,627개·추천 가능 1,455개·library-only 172개가 된다.

| Work ID | 작품 | 동결 판정 batch |
| --- | --- | --- |
| work-0bf4fb9ebf916a0012a9 | 兄だったモノ | 253 |
| work-15bd517753d06957f3b8 | 「きみを愛する気はない」と言った次期公爵様がなぜか溺愛してきます | 245 |
| work-4e1952454733bb0b7944 | 双影双書 | 263 |
| work-4e6c4d1d71f6a16fca70 | 火色の文楽 | 263 |
| work-4fcd37ce00805912ecd5 | 光とともに…～自閉症児を抱えて～ | 263 |
| work-5157cca8eedb61415032 | VS.アゲイン | 259 |
| work-54744a0ec5abf1f4d205 | やおろちの巫女さん | 261 |
| work-57130794fc2f5b4f8739 | Shrink～精神科医ヨワイ～ | 258 |
| work-578e741be251a4ec8d3f | 宇宙を駆けるよだか | 258 |
| work-6055c9b65925c5ac041b | ARMS | 259 |
| work-69af93716ed70019c580 | ソウナンですか? | 258 |
| work-7090c81c142fd31e591a | バーサス | 247 |
| work-85cd5d55bd130b036126 | 緑の歌 - 収集群風 - | 255 |
| work-9bd00739b995d84e2494 | あした死ぬには、 | 255（既存 library-only） |

## 発行 경로와 보존

기존 `writeCatalogCsvProjection` → 대상별 `mergeRawCsv` → `finalizeCatalogAuthorityProjection` → authority/Gold/build/coverage → 동시 변경 확인 → `publishDirectorySet` → 실제 정식 source readback을 사용한다. 스키마·추천 산식·임계·런타임은 바꾸지 않는다.

참조하는 8개 review Markdown은 원본 바이트 그대로 `data/source/reviews/`에 반영한다. 전체 동결 입력·판정·소실/대체 이력과 이전 canonical은 기존 로컬 작업 SQLite 및 별도 백업에 보존한다. 정식 DB에 다른 후보 1,682개를 새로 넣거나 보류 판정을 활성화하지 않는다.

실행 자료는 `.tmp/catalog-expansion-continuation-20260902/runs/canonical-promotion-20260910-v2/`이며 작업 SQLite에 저장한다. 최초 v1의 evidence merge 호출 조건 실패는 canonical 변경 전에 차단됐고, 실패 입력/출력을 보존했다. v2는 신규 evidence ID만 append 대상으로 지정하며 모든 기존 evidence를 유지한다.

## 검증 상태

정식 source를 2026-09-10T01:01:10.840Z에 발행했고, 다음 readback을 확인했다.

- DB SHA-256: `7a72b610169621eba2301cb24128f11431e39870b1261c7e6a17b6c693cd87fa`
- source snapshot: `41b8c1e531eae7896e1e5744bc4ac6d4e2d647b0507c886f23da04b44b894a96`
- 실제 정식 DB: 총 1,627개 / 추천 가능 1,455개 / library-only 172개. Gold 150·비대상 행·모든 기존 evidence 보존.
- SQLite authority, `catalog:validate`, `catalog:build`와 생성 파일 readback PASS. Catalog `v1-dcb321425c4a`, 추천 coverage 1,455 PASS / 0 FAIL, source 0 errors / 4,608 warnings.
- `pnpm build`, typecheck, lint PASS. 새 정식 ID의 상세 페이지도 production build에 포함된다. 배포는 하지 않았다.
- 로컬 production 서버 `127.0.0.1:3030`에서 빈 브라우저 origin의 기본 온보딩으로 ARMS·あした死ぬには、·双影双書·火色の文楽·バーサス를 검색하고 5개 선호 작품을 저장했다. 새로고침 후 5개가 유지되며 DNA와 추천 화면이 실제로 열렸다. 추천 이유에 새 작품이 근거 앵커로 표시됐다.
- Library의 ARMS 저장 기록 → 작품 상세 링크 → 정식 상세 페이지에서 저장 상태, バーサス 기반 상성 설명, 주요 Factor와 관련 작품을 확인했다. DB 직접 주입·mock·추천용 별도 harness는 사용하지 않았다. 기존 `localhost` origin의 사용자 데이터는 변경하지 않았다.
- Rakuten 가격·재고·소개와 표지 없음 상태가 표시됐다. 외부 제공자 성공·표지 확보·전체 서지 보강을 검증한 결과는 아니다.
- 실험 CLI의 결과는 이전 golden과 Catalog identity 한 줄만 달라졌다. 그 한 줄을 갱신했으며 점수·순위·설명 기대값은 바꾸지 않았다. ongoing authority의 review 개수 검사는 고정 13개가 아니라 기존 source 개수 + 새 참조 1개로 검증한다.

## 남은 검증 한계

전체 Vitest 최초 실행은 873개 중 864 PASS / 9 FAIL이었다. 원인을 확인한 뒤 golden identity와 동적 review 개수만 수정했다. 관련 4개 파일 재실행은 45개 중 44 PASS / 1 FAIL이며 남은 실패는 Windows의 `spawn npm ENOENT`다. 추천 dialog 검사는 이 분리 실행에서는 PASS였다. 전체 검사 결과를 전부 PASS로 보고하지 않는다.

최종 전체 재실행(`pnpm test --maxWorkers=1`)은 **868 PASS / 5 FAIL**, 106개 파일 PASS / 5개 파일 FAIL이다. 실패는 아래의 legacy registry/pilot 2개와 기존 Windows 의존 검사 3개(Unix 파일 권한, Unix 절대 경로, `spawn npm ENOENT`)다. 추천 dialog와 갱신한 golden/authority 검사는 최종 전체 실행에서도 PASS였다.

기존 `promotion-registry`는 신규 panel의 accepted publication을 소비하지 않고 `09` §7의 동결 legacy CSV만 읽는다. 따라서 신규 13개를 pending, 승격한 기존 1개를 과거 blocked로 집계한다. 이에 따라 registry와 pilot read-only 회귀 검사가 실패한다. 제품은 정식 SQLite에서 만든 정적 Catalog를 소비하므로 추천 가능 1,455개와 새 선호 작품의 추천 반영은 별도로 확인됐다.

이번에는 과거 6개 CSV·동결 digest·판정 이력을 덮어쓰거나, eligibility 플래그만으로 상태표의 검증을 우회하지 않았다. 필요한 후속 변경은 accepted panel publication의 identity·safety·provenance·blocker 해소 근거를 결속한 현재 상태표 입력 경로다. 따라서 **정식 DB 및 로컬 제품 반영은 검증됐지만 전체 authoring 도구의 전환은 미완료**다.

별도 소실 복구 도구도 이전 canonical hash에 묶여 있으므로, 후속 재판정 발행 전에 이번 source 전환을 명시한 lineage 연결이 필요하다. 기존 epoch를 고쳐 쓸 수 없다. 추가 복구 후보 승격·상태표 권한 경로 변경·Windows 테스트 수정은 이번 14작품 반영에 섞지 않았다.
