# 08 — TanStack Start 마이그레이션 계약

> Next.js App Router에서 TanStack Start로 옮기는 동안 framework와 presentation layer만 바꾼다. 추천 산식·domain model·Dexie schema·Export/Import schema·external work identity·Rakuten API 계약은 변경하지 않는다.

## 1. 상태 소유권

TanStack Router는 route contract이며 범용 global state store가 아니다.

- Router 소유: pathname/path params, Zod로 검증한 search params, route loader data, pending/error/not-found boundary, route metadata.
- Router 비소유: Dexie 사용자 기록과 onboarding draft, Manga DNA adjustment, 추천 policy/output, provider cache, external work record, hover/focus animation, carousel scroll, 저장 전 form draft, mutation busy/error, toast.
- Router context는 catalog repository, Rakuten client, environment-safe config처럼 dependency injection에만 쓴다. mutable 사용자 상태나 UI 상태를 넣지 않는다.
- 브라우저 전용 Dexie instance를 server loader나 server `beforeLoad`에서 사용하지 않는다.

## 2. URL 계약

공유·새로고침·back/forward 복원 가치가 있는 상태만 search params로 둔다. 모든 route는 Zod `validateSearch`를 정의하고 malformed 값은 안전한 기본값으로 정규화한다.

| Route | URL state | URL 밖의 상태 |
|---|---|---|
| `/` | 호환용 `landing` (`?landing=1`) | profile guard와 reveal marker |
| `/onboarding` | `q`, `genre`, `shelf` | 선택 작품과 draft는 Dexie |
| `/taste` | `mode: summary \| adjust`, `group`, 호환용 `reveal` (`?reveal=1`) | DNA 값과 adjustment는 Dexie |
| `/recommendations` | `preview: workId`, `genre`, `sort`, `shelf` | 추천 policy와 결과는 Dexie/local state |
| `/library` | `state`, `q`, `sort`, `view` | record와 편집 draft는 Dexie/local state |
| `/settings` | `section` | form/mutation 상태는 local state |
| `/works/$workId` | canonical path param | 개인 기록은 Dexie |
| `/works/external` | 기존 계약의 typed `workId` search param | external record는 Dexie |

`/works/external`의 missing/duplicate/empty/malformed `workId`는 모두 기존 invalid-link 상태로 수렴하며 lookup이나 provider 요청을 시작하지 않는다. 추천 `sort`는 산식 순서를 바꾸지 않는 presentation-only 값만 허용한다.

## 3. SSR·정적 셸

- `/`는 prerender 가능한 공개 landing shell이다.
- `/works/$workId`는 bundled Catalog work ID만 prerender하며 unknown ID는 not-found다.
- `/onboarding`, `/taste`, `/recommendations`, `/library`, `/settings`는 IndexedDB 사용자 상태에 의존하므로 `ssr: false` route 또는 명시적 client boundary다.
- `/works/external`은 고정 static shell이며 hydration 뒤 client-side IndexedDB lookup만 한다.
- Dexie profile guard는 server loader/`beforeLoad`에서 실행하지 않고 hydration 뒤 browser에서 실행한다.
- shared root document는 server-safe하게 유지한다. persistence provider는 server render 중 memory 상태만 만들고 hydration effect에서 Dexie backend를 생성·연다. prerender되는 작품 상세의 개인 기록 영역은 client에서 hydrate한다.
- 공통 route parent에서 `ssr: false`를 선언해 prerender 가능한 작품 상세까지 차단하지 않는다.

## 4. 서버 경계

TanStack Start server route는 아래 두 URL과 기존 request/response/cache/error 계약만 유지한다. 초기 migration에서 server function으로 바꾸거나 새 server route·database·authentication·runtime LLM을 추가하지 않는다.

`02-product-spec.md`의 기존 “Route Handler” 표기는 이 두 provider server boundary를 뜻하며, migration 이후 구현 형태는 TanStack Start server route다.

```text
GET /api/rakuten/search?title=...
GET /api/rakuten/item?isbn=...
```

Provider cache/fetch flow를 TanStack Query로 재작성하지 않는다. 서로 다른 Rakuten client request 사이의 1초 간격은 개발 중 provider 보호용이며 development에서만 적용한다. production/test에서는 강제 지연하지 않고, loading placeholder의 짧은 노출은 허용한다.

## 5. 컴포넌트·의존성 계약

- 필요한 primitive만 shadcn CLI의 **Base UI 기반**으로 `src/components/ui/**`에 생성한다. 생성 파일을 직접 제품 디자인 API로 노출하지 않는다.
- `src/components/design-system/**`의 얇은 wrapper가 시맨틱 dark token, 최소 44px target, focus-visible, 상태/size variant를 적용한다. route와 feature는 이 wrapper를 사용한다.
- Shelf/carousel은 CSS scroll-snap, `ResizeObserver`, 현재 Motion으로 구현한다. Embla·Swiper·Zustand를 추가하지 않는다.
- TanStack Query는 실제 remote server-state 문제가 확인되고 별도 승인을 받기 전에는 추가하지 않는다.
- hover intent, focus expansion, Quick Preview focus restoration, scroll position, pending animation과 mutation busy/error는 React local state다. Quick Preview 대상만 `?preview=<workId>`로 deep-link할 수 있다.

## 6. 마이그레이션 순서

1. **M0** 현재 route, fixed 5 product E2E, deterministic screenshot, recommendation fixture 동결.
2. **M1** TanStack Start scaffold와 exact dependency version 고정.
3. **M2** domain/lib/data/infrastructure의 framework 독립성 확보.
4. **M3** route tree와 typed search schema 작성.
5. **M4** Dexie provider와 client hydration 연결.
6. **M5** Rakuten server route 두 개 이전.
7. **M6** 기존 기능 parity를 route별로 확보.
8. **M7** 공통 dark shell, shadcn wrapper, MediaShelf, expandable card, Top 10 구현.
9. **M8** 확정된 7개 디자인을 페이지별 수직 slice로 적용.
10. **M9** 제품의 Next.js 전용 파일·dependency 제거. 별도 G2 harness는 제품 migration과 독립적으로 유지한다.
11. **M10** 전체 회귀와 production deployment 검증.

Framework migration과 7개 화면 redesign은 검토 가능한 작은 commit/PR 단위로 분리한다. 새로운 visual-regression infrastructure나 여섯 번째 제품 E2E를 만들지 않고 기존 fixture·fixed 5 시나리오·수동 deterministic screenshot을 갱신한다.

## 7. 완료 조건

- 기존 route URL, 추천 work ID 순서/contribution/confidence/explanation source, Dexie 데이터, Export/Import, external deep link, Rakuten 응답 계약이 유지된다.
- 새로고침과 browser back/forward에서 URL state가 복원되고 malformed search params가 안전하게 처리된다.
- keyboard, touch, reduced motion, desktop GNB/mobile bottom navigation 상호 배타를 충족한다.
- format, typecheck, lint, unit, fixed 5 E2E, catalog validate, build가 통과한다.
