# #56 탐색/랜딩 수정 근거 (#57 · #74 · #77)

2026-10-09. 아래는 이번 작업의 로컬 수정/집중 검증 기록이다. 최종 브라우저·전체 검사와 공개 배포 반영은 상위 통합 기록에서 별도로 판정한다.

## #57 랜딩 입력

- 소스 확인: 장면 그림은 실제 패널보다 큰 공유 종이 공간을 렌더하고, 상위 `.hh-art`는 액션 컷보다 높은 z-index다. 장식 `.hh-stage` 전체를 `pointer-events: none`으로 지정했다. 별도 재생/일시정지 버튼은 장식 밖에 있어 조작을 유지한다. 이 구조를 제보 환경의 독립 재현으로 단정하지 않는다.
- 상위 실행자의 공개 baseline: main `61443a4aa5fd8f6ecf0aa4d44cf607818851cd2b`, 2026-10-09 15:48 JST 신규 흐름에서 안정화 후 CTA 클릭은 성공했다. 제보 조건과 같은 viewport·장면·로딩 시점 여부는 미확인이다.
- 설명 단계에 키보드 포커스가 들어오면 다른 장면을 숨기고, 현재 장면의 body/card/tint 애니메이션을 멈춰 포커스 장면만 선명하게 표시한다. 기존 포커스 링·하단 CTA·스킵 링크를 유지한다.
- 집중 확인: landing-flow와 home-scroll-sections 단위 검증 PASS. CTA 중앙/가장자리, 신규/재방문, scroll 왕복, reduced motion, 확대, focus 장면의 최종 실제 렌더 확인은 통합 브라우저 검증 대상이다.

## #74 목적지와 복귀/404

- `03` 계약을 먼저 정리했다. 로고와 footer의 「使い方」는 `/?landing=1`, 개인 추천의 「おすすめ」는 `/recommendations`다. 랜딩 마스트헤드에도 같은 링크와 현재 페이지 표현을 제공한다. 일반 `/` 재방문 redirect 계약은 유지한다.
- Catalog/external 상세의 명시적 복귀 링크는 router history가 있으면 Back하여 기존 preview/scroll 복원을 사용한다. 직접 진입은 Catalog `/recommendations`, external `/library`다. 수정키 클릭/새 탭은 정상 href를 사용한다.
- 실제 공개 응답(상위 실행자 측정): `https://konocomics.vercel.app/tracker-56-missing` HTTP **404**, 제목 `konocomics`; `/works/tracker-56-missing` HTTP **404**, 제목 `作品詳細 | konocomics`. Vercel `dpl_5WjP1YjMbKHva4YzoWZJaF8GT6QA`, READY, main SHA `61443a4`. soft 404가 아니라 제목 미분화다.
- router head가 not-found match일 때 전용 제목을 반환하도록 수정했다. 설치된 `@tanstack/router-core` 1.171.34의 match `status`/`_notFound` 경로와 `useCanGoBack` 구현을 확인했다. Context7 도구는 이 세션에서 제공되지 않았다.
- 집중 확인: Back/직접 진입/수정키 단위 검사, app-shell/landing, catalog·external 상세 테스트 PASS. 최종 server/client 404 title 및 실제 Back/Forward는 통합 검증 대상이다.

## #77 유한 선반과 좁은 화면

- 기존 복제는 후보 데이터 중복이 아니라 세 벌의 loop geometry였다. `03`/`04`를 유한 선반으로 갱신한 뒤 복제·canonical 재배치·scroll settle jump를 삭제했다. 모든 후보는 한 번만 렌더하고 범위/전체 수를 표시한다. 화살표와 키보드는 끝에서 순환하지 않는다.
- loop helper 소비자(Featured motion list, Discovery list, RankingShelf, detail contrast)도 함께 정리했다. 추천 순서·후보·기여 값과 persistence는 바꾸지 않는다.
- Featured 액션을 숨기는 hover 조건은 폭 768px 이상·높이 600px 이상 fine-pointer에만 적용한다. 좁거나 짧은 화면에서는 읽고 싶음/미리보기 등 액션을 상시 표시한다. 작은 높이에서는 추가 sticky shelf navigation을 숨긴다.
- Ranking/MediaMetaLine 장르와 Discovery 이유는 전체 텍스트를 줄바꿈해 표시한다. Featured/anchor의 전체 이유는 기존 명시적 Quick Preview 경로로 접근한다.
- 외부 구매/search/share/about 링크에는 보조기술과 화면에서 새 탭임을 안내한다(관련 담당자의 동일 묶음 수정 포함).
- 이동 버튼은 기존 design-system `--control-min-size: 44px`를 사용한다. 실제 렌더의 크기·간격·sticky 포커스 가림·390px/200% 조건·실제 모바일은 단위 테스트로 주장하지 않는다.

## 실행한 집중 검증

- `vitest run` 7 파일 **32 tests PASS**: media-shelf, ranking-shelf, detail-back-link, recommendation-motion-list, app-shell, landing-flow, home-scroll-sections.
- `vitest run` catalog/external 상세 2 파일 **45 tests PASS**. External 저장은 #67의 기대 updatedAt도 전달하고 assertion을 갱신했다.
- 변경 핵심 TSX/테스트 파일 집중 ESLint PASS. React best-practices 검토: 기존 primitive/route hook 재사용, 조건부 hook 없음, 정리되는 resize/scroll listener, metadata/키보드 경로 보존, 새 의존성 없음.
- 전체 CI/CD·build·E2E는 개별 이슈마다 실행하지 않았고 상위 최종 통합 단계에서 한 번 수행한다. 공개 배포 반영 및 실제 터치 기기는 여기서 검증하지 않았다.
