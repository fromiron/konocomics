# #56 통합 개선과 최종 검증

2026-10-09 JST. 기준 main `61443a4aa5fd8f6ecf0aa4d44cf607818851cd2b`, 작업 브랜치 `fix/review-tracker-56`.

## 범위와 실행 방식

트래커의 신규 25건(#57–#81)과 연결된 기존 #25를 공통 구현별로 묶었다. 묶음마다 관련 단위·컴포넌트 검사만 수행하고, 모든 구현을 합친 뒤 전체 suite·build·fixed 5 E2E를 실행했다. 통합 실패 후에는 실패 파일/시나리오만 재검사했다. 별도 여섯 번째 제품 E2E·의존성·서버 route를 추가하지 않았다. 공개 GitHub 쓰기, 배포와 실제 이슈 종료는 수행하지 않았다.

기존 비추적 `reports/`, `tmp/`와 실행 중인 3000/3030 서버는 보존했다. lint/format의 최초 기본 명령이 과거 `.claude/worktrees`와 생성 산출물까지 순회하여 중단했다. lint는 그 이전 worktree만 제외하고 전체 소스를 확인했고, format은 현재 Git 추적 파일 및 이번 신규 소스/테스트를 확인했다. 사용자 임시 자료를 포맷하지 않았다.

## 이슈별 결과

| 이슈 | 구현/판단 | 상세 근거 |
| --- | --- | --- |
| #57 | 장식의 pointer 차단 예방, 포커스 장면 중첩 제거. 공개 desktop CTA는 당시 재현 안 됨, 수정본 desktop/IAB 클릭 성공 | [탐색](tracker-56-navigation.md), [배포 대조](tracker-56-regression.md) |
| #58 | 선등록 적격 수/추가 필요 수 안내, 4+1 완료 경계 검증, 5→4 복구 경로 | [온보딩](tracker-56-onboarding.md) |
| #59 | 추천 적격과 분석 입력 기준 통일. 주요작 표, スラムダンク 별칭, 미수록 두 작품 libraryOnly 추가 | [온보딩](tracker-56-onboarding.md), [데이터](tracker-56-metadata.md) |
| #60 | 선호와 독서 상태를 별도로 확인. reading 보존, planned에 감상 합성 금지, 구 기록 일괄 재분류 없음 | [온보딩](tracker-56-onboarding.md) |
| #61 | 실제 유효 contribution 안에서 첫 이유 분산. 낮은 공통 강도 문장과 score/rank 불변 검사 | [추천](tracker-56-recommendations.md) |
| #62 | 확인한 2작품 권수/완결 정정, 시리즈와 구매 권·가격 구분, 미상 표시 | [데이터](tracker-56-metadata.md) |
| #63 | 소개 없음/요청 중/실패/목차 상태 분리. Conan 출판사 소개, Shiki 실제 누락, 표지 fallback | [데이터](tracker-56-metadata.md) |
| #64 | 입력·URL·provider 100단위 제한, 긴 fuzzy 차단, IME/취소/시간 측정 | [검색](tracker-56-search.md) |
| #65 | 로컬/외부 가용성·요청·실패·재시도 일치, 오래된 결과 취소, timeout | [검색](tracker-56-search.md) |
| #66 | 정확 제목/별칭 우선, 폭·공백 정규화, 제목과 장르 의도 분리. BL 미분류를 명시 | [검색](tracker-56-search.md) |
| #67 | 숨김≠disliked, 기존 감상·진도 보존, 조건부 저장/Undo·중립/미평가 안내 | [기록](tracker-56-records.md) |
| #68 | 전체/분석 긍정/부정 신호/제외 수 분리. planned 추가는 분석 수 불변 | [추천](tracker-56-recommendations.md) |
| #69 | 네 프로필의 hash/계산/후보 전후 진단. 고정 更新·완료·Undo를 겹치지 않는 한 스택으로 표시 | [추천](tracker-56-recommendations.md) |
| #70 | mood URL 초기화/선택/재방문 복원. 기존 Top10 전체 장르 계약은 명시하고 대표 후보는 전체 적격 pool에서 보충 | [추천](tracker-56-recommendations.md) |
| #71 | Export 준비/다운로드 시작/실패와 실제 파일 Import 왕복. 원본 초안 보존 | [백업·공유](tracker-56-settings-share.md) |
| #72 | 저장 보호 승인 범위·시크릿/직접 삭제 한계 명시. 승인 조회 경쟁 수정 | [백업·공유](tracker-56-settings-share.md) |
| #73 | 작품명+링크, DNA 공개 항목 미리보기/소개문. 이미지·개인 OG를 제공한다고 주장하지 않는 fallback | [백업·공유](tracker-56-settings-share.md) |
| #74 | 로고/소개/추천 목적지 구분, 상세 Back/fallback, 일반/작품 404 제목 | [탐색](tracker-56-navigation.md) |
| #75 | Catalog 등록 취소 진입점과 범위/Undo. 최신 타 탭 기록 보존 | [기록](tracker-56-records.md) |
| #76 | 공유 Button의 pressed hover 원인 수정, 체크 표시. 실제 대비 개선 | [검색](tracker-56-search.md) |
| #77 | loop 복제 제거, 후보 위치/끝·44px 조작·모바일 상시 액션·전체 문구·외부 링크 표시 | [탐색](tracker-56-navigation.md) |
| #78 | 분석 전용/현재 추천 조정 구분, 리셋의 변경 없음/성공/실패 피드백 | [온보딩](tracker-56-onboarding.md) |
| #79 | 현재 공개 배포가 PR #55 포함임을 확인하고 인접 결함/정상/재현 안 됨 구분 | [배포 대조](tracker-56-regression.md) |
| #80 | 공식 관계 근거와 최소 표시안 검토. 별개 속편/파트 기록 자동 병합 없음 | [데이터](tracker-56-metadata.md) |
| #81 | 미독은 무기록 닫기, 응답 억제·취소/성공 구분·자동 종료 Snackbar·조건부 Undo | [기록](tracker-56-records.md) |
| #25 | 신규 등록 시 planned/reading/completed 명시 선택, insert-only 보존. 미리보기 확대는 분리 | [검색](tracker-56-search.md) |

## 2026-10-09 통합 검사 기록

- 타입 검사 및 전체 소스 ESLint PASS. 마지막 테스트/설정 수정의 ESLint·Prettier·diff 검사도 PASS.
- `pnpm test`: 137파일/1,178테스트 실행, 136파일/1,177개 PASS. 실패 1건은 #77에서 제거한 `line-clamp-2`를 요구하던 구 검증이었다. 전체 문구 보존 계약에 맞게 갱신 후 해당 파일 **8/8 PASS**. 전체 suite를 불필요하게 다시 실행하지 않았다.
- 프로덕션 build PASS: 3,311개 작품을 포함한 전체 prerender. 처음에는 Nitro preview가 TanStack의 임의 포트 요청을 3000으로 덮고 dev의 strictPort를 상속하여 충돌했다. `preview.strictPort=false` 한 줄로 이미 사용 중인 포트를 피하도록 수정했다. 기존 서버를 중지하지 않았다.
- fixed 5 Playwright 시나리오 × desktop/mobile = 10개 실행. 처음 6개 PASS, 4개는 변경된 안내/소개 공백/가격 이름/복수 status의 이전 기대값으로 실패했다. 해당 두 시나리오만 정정·재검사하여 core 2/2, provider 2/2 PASS. 나머지 6개를 반복하지 않았다. 신규 여섯 번째 E2E를 만들지 않았다.
- E2E는 이번 checkout의 production server `localhost:3032`를 사용했다. `3030`의 사용자 개발 서버를 재사용하지 않았다. 실제 다운로드 JSON→제품 Import, seven-store 보존/실패·경쟁 쓰기·모바일 조작을 포함한다. provider mock은 실공급자 정상 증거가 아니다.
- `catalog:authority:verify`, `catalog:validate`, `catalog:expansion:validate`, `catalog:promotion:registry --check` PASS. 최종 `v1-bf43e2765bf2`: 3,311작품, 3,315판본, **0 errors / 55,125 warnings**. unknown/provenance 경고를 숨기거나 zero-warning으로 보고하지 않는다. Gold Set 150 유지.
- `harness:build` PASS. 추천 실험 golden은 Catalog 버전만 변경됐고 진단 snapshot의 후보·순위·점수·앵커·설명은 그대로다.
- 원문·receipt·정정 입력·이전 DB는 workspace SQLite에 저장하고 **BACKED_UP cursor 6985725**까지 검증했다. 서지 보강은 새 팩터 판정이나 추천 적격 승인으로 간주하지 않는다.

실행 로그: `.workspace/tracker-56-validation/`. `unit.log`, `unit-repair.log`, `e2e.log`, `e2e-repair.log`, `e2e-provider-final.log`, `build-final.log`, `harness-build.log`, `lint-final.log`, `typecheck-final.log`에 실패와 보완 이력을 함께 보존했다.

## 실제 브라우저 확인

- 사용자 요청에 따라 직접 조작은 Codex 인앱 브라우저로 전환했다. 자동 E2E만 기존 러너를 유지했다.
- 고정 네 취향에서 제품 Import→추천→다음 작품 planned 저장을 확인했다. warm: テガミバチ, kinetic: capeta, tactical: 親愛なる僕へ殺意をこめて, action-nine-and-drama: うさぎドロップ. 앞의 두 개는 별도 Chromium 격리 세션에서 실제 IndexedDB readback, 뒤의 두 개는 인앱 상세 저장 후 reload의 pressed 상태로 확인했다. 온보딩 완료 이력 없는 적격 Library 프로필도 진입했다. 이는 사람이 추천 품질을 선호한다고 평가한 결과가 아니다.
- `?mood=warm`에서 あたたかい話 선택 및 reload 후 동일 URL/선택을 확인했다.
- 390×844에서 카드 액션이 hover 없이 표시되고 viewport overflow가 없었다. 선택 grid/favorite의 hover 글자/배경은 `oklch(0.22 0.03 65)` / `oklch(0.81 0.11 74)`: sRGB 변환 후 대비 **9.454:1**, 이전 공개 배포 **1.053:1**. grid 99.33×44px, favorite 141.33×44px.
- 수정본 일반/작품 미존재 URL은 실제 HTTP 404, 각각 `ページが見つかりません | konocomics`, `作品が見つかりません | konocomics` 제목이다.
- 인앱 모바일 캡처: `output/playwright/tracker-56-mobile.jpg`.

## 종료 판단과 한계

구현·로컬 검증과 GitHub 병합·공개 배포는 구분한다. 2026-10-09 검증 시점에는 commit/push/PR/merge를 수행하지 않았다. 2026-10-12에는 검증 결과를 포함해 `fix/review-tracker-56`의 로컬 커밋으로 묶었다. push/PR/merge와 실제 이슈 close는 아직 수행하지 않았다. 원래 사용자 자료와 unrelated 작업을 포함시키지 않았다.

LINE/X 게시 후 실제 OG/캐시, 실물 모바일 기기 및 모든 브라우저의 private-mode 종료 후 보존은 검증하지 않았다. #73의 플랫폼별 실측 완료 기준은 이 상태에서 완료로 체크하지 않는다. 지원 범위는 텍스트/URL fallback으로 정확히 안내한다. 로컬 실제 provider는 자격 정보 없이 502 fallback이 발생하며, 공개 환경에서는 검색 502와 item 실패 후 성공을 별도로 관찰했다. 공급자 정상 가용성을 보장하지 않는다.

action-nine-and-drama에서 top5의 3작품이 違国日記에 가까운 것은 현재 best-anchor-max 산식의 실제 결과였다. 임의 shuffle/앵커 상한으로 순위를 숨기지 않았다. 다수 선택 장르 비중을 랭킹에 직접 반영하려면 별도 산식 검토가 필요하며, 본 #69 진단과 분리한다. #80은 요청된 검토/최소 표시안까지 완료했으며 광범위한 시리즈 시스템을 구현하지 않았다.


## 2026-10-12 최종 리뷰·검증

연결 코드 재검토에서 세 경계를 보완했다. #68의 전체 기록 수는 실제 별도 `externalWorks` 저장소를 포함한다. #58의 기존 4+신규 1 STEP2 초안을 복원하고, 동시 삭제와 완료가 경쟁해도 같은 transaction 안에서 최소 수를 검사한다. 이 검증 오류가 오래된 Memory mirror로 fallback하지 않도록 구분한다. 상세 근거는 온보딩·추천 문서에 추가했다.

- 전체 typecheck·ESLint, production build PASS. 포맷 검사에서 테스트 파일 한 개를 정렬하고 해당 파일 및 마지막 E2E 수정 파일을 재확인했다.
- 전체 unit: 137파일, 1,183 PASS / 3 timeout. 변경하지 않은 Catalog authority/publication 테스트 세 개가 120초 제한을 초과했다. 당시 32GiB 메모리와 swap의 압박·I/O 경합을 관찰했다. 다른 무거운 작업 종료 후 같은 timeout으로 실패 3건만 `--maxWorkers=1` 실행하여 3/3 PASS. 전체 suite를 한 번에 통과한 것으로 기록하지 않는다.
- authority·Catalog validation·expansion·registry·연구 파생물·batch-002/003·promote-library의 필수 check 전부 PASS. Catalog 3,311작품/3,315판본, 0 errors/55,125 warnings와 최종 버전을 유지한다.
- 첫 E2E 통합 실행은 3/10 PASS. 초기 화면 렌더링 5초 초과 6건과 stale-page 최종 readback 지연 1건을 보존했다. 후자는 일곱 store를 읽던 assertion을 기존 단건 `readStoredRecord`로 바꿨고 동일 기대값/5초 제한에서 모바일 해당 시나리오 1/1 PASS. 무거운 검사와 분리한 fixed 5 × desktop/mobile 순차 전체 실행 결과는 아래에 기록한다.

### 인앱 브라우저 보완

동일 checkout의 final production build, `localhost:3032`에서 실제 DOM·스타일·포커스·Storage API 응답을 확인했다. 기존 합성 11작품 기록을 유지했으며 새 Import나 삭제를 하지 않았다.

- #57: 히어로 CTA에서 Tab으로 스토리의 `20世紀少年` 링크에 진입한다. 포커스 중심 hit-test가 해당 링크이며 다른 장면이 덮지 않는다. 1242×1248 및 621×624 CSS viewport에서 확인했다. 후자는 200% 상당 reflow 조건이며 실제 브라우저 메뉴 zoom과 구분한다.
- #72: 일반 인앱 세션에서 실제 `navigator.storage.persisted()`는 요청 전/후 false. 제품 버튼을 누른 뒤 정확한 거절 안내와 수동 삭제·시크릿/게스트 종료·백업 한계가 유지됐다. 승인 분기는 기존 단위 검사이며 일반 세션에서 승인된 것으로 보고하지 않는다. 비영속 Chromium 실제 응답 검증을 기존 data-sovereignty E2E 안에 포함했다.
- #76: 선택 기본/hover의 글자는 `oklch(0.22 0.03 65)`, 배경은 각각 `oklch(0.76 0.11 72)`/`oklch(0.81 0.11 74)`. 비선택 기본/hover는 글자 `oklch(0.86 0.012 250)`, 배경 `oklch(0.2 0.024 250)`/`oklch(0.24 0.027 250)`. 현재 computed color를 sRGB 선형 채널로 환산한 명암비는 순서대로 7.96:1, 9.49:1, 11.83:1, 10.75:1이다. 선택·비선택 Tab focus에 2px solid focus ring을 확인했다. grid 99.33×44px, 선택 favorite 141.33×44px, 토글 사이 8px. 해당 제품 토글에는 disabled 상태가 없어 N/A다.
- #77: desktop 선반 앞/뒤 버튼 각 44×44px. 처음 앞 버튼 disabled, 끝의 `3–5 / 5作品`에서 뒤 버튼 disabled이며 반복 복제가 없다. 621×624 및 390×844에서 카드 액션 포커스 hit-test 성공·문서 가로 overflow 없음. 390px의 `今日はパス`는 68×44px, 하단 탭에 가리지 않는다. 실제 하드웨어 터치나 브라우저 메뉴 zoom 검증으로 확대 해석하지 않는다.
- 모바일 캡처 `output/playwright/tracker-56-final-mobile.jpg`. 임시 viewport를 해제하고 원래 GitHub 이슈 탭으로 복원했다.

실행 로그는 `.workspace/tracker-56-validation-20261012/`에 실패·보완 결과를 함께 보존했다. #73의 LINE/X 실제 미리보기·크롤러 검증은 여전히 미완료이므로 `Closes` 대상에서 제외하고 #56도 열린 상태로 유지한다.


### 종료 대상과 미완료 경계

병합 후 종료 가능한 범위는 #25, #57–#72, #74–#81의 25건이다. #57/#76/#77의 확대 근거는 CSS viewport reflow이며 실제 모바일 하드웨어·브라우저 메뉴 확대 검증과 구분한다. #72는 실제 일반/비영속 브라우저의 응답과 화면 일치, 승인 분기는 단위 검사로 구분한다. #73은 제목/텍스트·공개 요약·fallback 구현까지이며 LINE/X 실측은 남는다. #56은 #73 완료 전 종료하지 않는다. 기존 #24/#27/#40을 이번 범위로 닫지 않는다.


### 최종 순차 E2E 결과

2026-10-12 18시대 최종 fixed 5 × desktop/mobile **10/10 PASS**, 3.8분. 새 제품 변경 없이 단건 DB readback 수정과 순차 실행으로 확인했다. 동일 production build를 재사용하고 timeout을 늘리지 않았다. 실제 다운로드→Import, 손상 파일 원자적 거부, 다중 탭 기록 경쟁, 피드백→갱신→reload, provider 장애 복구를 포함한다. 비영속 Chromium의 실제 저장 보호 응답과 안내 일치도 두 viewport에서 통과했다(둘 다 요청 전/후 persisted=false).

중간 trace-on 시도는 첫 core PASS 후 프로세스 SIGTERM/Channel closed로 중단돼 완료 결과로 쓰지 않았다. 해당 trace를 `e2e-interrupted-traces/`에 보존했다. 최종 결과는 `e2e-final.log`와 `e2e-final.json`이다. 이 기록은 호스팅 CI·공개 배포·LINE/X 실측을 대신하지 않는다.


## 2026-10-12 온라인 CI 시간 예산

사용자는 온라인 CI 사양에 맞춰 기준을 낮추고, 단순 시간초과로 CI를 반복하지 않도록 충분한 여유를 요청했다. 기존 main CI에서도 Catalog 테스트 5건이 시간초과였고, unit 약 737초와 사전 검사 약 131초로 15분 job 예산 대부분을 사용했다.

온라인 CI의 Vitest 동시 실행 수를 4→2로 줄이고 job 상한을 15→60분으로 늘린다. 기본 테스트는 30초, hook은 120초로 여유를 둔다. 명시적 timeout이 있는 Catalog 통합 검사는 온라인 실행에 맞춰 최소 180초 또는 기존 제한의 3배 중 큰 값(30/45초→180초, 120초→360초, 480초→1,440초)을 적용한다. Catalog 개별 상한은 로컬에도 동일하게 적용한다. 로컬 동시 실행 수와 일반 테스트 기본 제한, assertion, Catalog 무결성·파생물 비교, 실패 판정과 검사 수는 유지한다. timeout을 무제한으로 끄거나 실패를 성공 처리하거나 자동 retry를 추가하지 않는다.

PR 최초 CI `38233153048`도 1,182 PASS/4 timeout, unit 713초였다. 기능 assertion 오류 없이 canonical 복구·pilot·대표 ISBN 복구에서 제한을 초과했다. 해당 실패 로그를 보존하고 위 자원/시간 예산만 보완한다.
