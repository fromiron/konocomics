# konocomics 최종 7페이지 리디자인 구현 계획

## 0. 동결 identity

- Repository: `fromiron/konocomics`
- Current `main`: `87ba09e733901e16279e758d2f437dd51476d663`
- Framework: Next.js 16.3 / React 19.2 / TypeScript 5 / Tailwind CSS 4 / Motion 13
- Persistence: Dexie + IndexedDB, memory degradation fallback
- Theme: dark-only
- Primary: `oklch(0.7525 0.1382 236.09)` / `#43BBFA`
- Visual target: `visual-targets/`의 확정 이미지 7장

## 1. 권위와 non-goal

### 1.1 권위 순서

1. `docs/planning/02-product-spec.md`
2. `docs/factors/factor-dictionary.md`
3. `docs/planning/05-architecture.md`
4. `docs/planning/03-ux-screen-contracts.md`
5. `docs/planning/04-visual-interaction-spec.md`
6. 이 구현 계획과 화면별 계획
7. 생성 이미지의 구도·색·밀도·상호작용 감각

### 1.2 반드시 보존

- 결정론적 Manga Taste Engine과 현재 추천 work ID 순서
- 실제 `contributions[]`에서 생성되는 추천 설명
- `ReadingState = planned | reading | completed | dropped | hidden`
- `Reaction = favorite | liked | neutral | disliked`
- progress의 volume/chapter 필드
- IndexedDB local-first 저장과 export/import schema
- 정적 Next.js shell
- 서버 route는 `/api/rakuten/search`, `/api/rakuten/item`만
- Catalog `/works/[workId]`와 external `/works/external?workId=...` identity
- 프로덕션 문구는 `src/lib/strings.ts`를 통한 일본어
- keyboard, focus restoration, `prefers-reduced-motion`, 200% zoom

### 1.3 구현하지 않음

- 로그인, 계정, 이메일, 아바타, Premium, 결제
- 커뮤니티, 사용자 리뷰 작성/피드, 팔로우
- 원격 알림, 주간 이메일 리포트
- 자체 만화 리더, 다운로드, 「첫 화부터 보기」
- 런타임 LLM
- 근거 없는 `96% Match` 같은 확률형 수치
- 생성 이미지의 가상 표지·가로 key art를 프로덕션 자산으로 사용
- 신규 서버 route, Server Action, 동적 SSR
- 승인 없는 신규 dependency(Embla, Swiper, GSAP, Zustand 등)

## 2. 이미지와 실제 제품의 변환 규칙

| 이미지 요소 | 실제 구현 |
|---|---|
| 한국어 UI | 기존 일본어 string을 유지하고 `src/lib/strings.ts`에서만 관리 |
| 90–98% 매치 | `高い / 中程度 / 低い` 같은 기존 정성 confidence |
| 가로 애니 key art | 실제 세로 표지 1장 + 같은 URL의 blur/dim backdrop, 또는 표지 mosaic |
| 로그인/프로필 아바타 | 제거 |
| 알림 bell | 제거; 비기능 아이콘을 남기지 않음 |
| desktop bottom dock | 제거 |
| mobile GNB | 숨기고 bottom navigation만 표시 |
| 사용자 리뷰/별점 작성 | 제거; Rakuten 제공 평점은 provider metadata 안에서만 표시 가능 |
| 읽기 버튼/자체 reader | reading state 변경 또는 Rakuten 외부 링크로 대체 |
| 메모 기능 | 현재 schema에 없으므로 추가하지 않음 |
| 주간 인기 | 검증된 popularity 데이터가 없으면 `注目の10作品` 등 중립 문구 사용 |
| global search | 새 route 없이 기존 Catalog/Fuse/Rakuten search를 dialog/sheet로 재사용할 때만 노출 |

## 3. 구현 전 R0 — 규범 정렬

런타임 코드 전에 다음 문서를 개정하고 별도 PR로 검토합니다.

- `docs/planning/03-ux-screen-contracts.md`
  - dark-only shell
  - desktop GNB / mobile bottom navigation 상호 배타
  - Shelf, fixed recommendation card, ranking, Quick Preview 계약
  - 7개 route의 최종 정보 구조
- `docs/planning/04-visual-interaction-spec.md`
  - dark semantic token
  - image overlay gradient 예외
  - fixed-card hover/focus feedback, reduced-motion
- `docs/planning/06-implementation-plan.md`
  - 아래 R1–R10 단계 반영
- `docs/planning/07-acceptance-test-plan.md`
  - responsive, shelf, dialog/sheet, failure/empty/offline 테스트
- `AGENTS.md`
  - 최종 visual authority와 non-goal 추가

R0에서는 runtime 파일을 수정하지 않습니다.

## 4. 전역 Shell 및 공통 구조

### 4.1 Responsive navigation

- `>= 768px`: 상단 GNB만 렌더링/표시
- `< 768px`: post-onboarding route에서 bottom navigation만 표시
- `/`와 `/onboarding`: immersive route. 모바일에서도 bottom navigation을 표시하지 않음
- CSS media query로 상호 배타적으로 `display:none`; 두 navigation이 동시에 보이거나 accessibility tree에 남지 않게 함
- 로그인/프로필/알림 control 없음
- Search는 실제 dialog가 완성된 경우에만 노출

수정 대상:

- `src/components/nav/app-shell.tsx`
- `src/components/nav/post-onboarding-navigation.tsx`
- `src/components/nav/navigation-icon.tsx`
- `src/components/nav/brand-mark.tsx`
- `src/app/globals.css` 또는 분리된 style import

### 4.2 Dark token

권장 semantic token:

```css
:root {
  color-scheme: dark;
  --canvas: oklch(0.12 0.018 250);
  --surface-1: oklch(0.16 0.021 250);
  --surface-2: oklch(0.20 0.024 250);
  --surface-3: oklch(0.24 0.027 250);
  --text-strong: oklch(0.97 0.006 250);
  --text: oklch(0.86 0.012 250);
  --text-muted: oklch(0.67 0.018 250);
  --line: oklch(0.29 0.025 250);
  --accent: oklch(0.7525 0.1382 236.09);
  --accent-hover: oklch(0.80 0.135 236.09);
  --accent-active: oklch(0.69 0.14 236.09);
  --accent-soft: oklch(0.22 0.055 236.09);
  --on-accent: oklch(0.15 0.02 250);
  --danger: oklch(0.65 0.22 25);
  --focus-ring: var(--accent);
}
```

`#43BBFA` 위에는 흰 글자가 아니라 `--on-accent`의 어두운 글자를 사용합니다.

### 4.3 신규 공통 컴포넌트

```text
src/components/media/
  media-shelf.tsx
  shelf-heading.tsx
  shelf-controls.tsx
  media-poster-card.tsx
  expandable-media-card.tsx
  ranking-shelf.tsx
  ranking-card.tsx
  quick-preview-dialog.tsx
  quick-preview-sheet.tsx
  hero-backdrop.tsx
  media-empty-state.tsx

src/components/layout/
  site-footer.tsx

src/components/search/
  global-work-search.tsx   # 실제 기능을 함께 구현할 때만
```

원칙:

- Media 컴포넌트는 추천 계산이나 Dexie 접근을 소유하지 않음
- route flow가 data를 준비하고 presentational props로 전달
- Shelf는 `ResizeObserver`, CSS scroll-snap, 기존 Motion만 사용
- 추천 featured card는 desktop hover/focus에서도 고정 geometry를 유지
- touch에서는 identity link로 Quick Preview sheet를 엶
- card의 상세 정보는 local data로만 표시하며 hover network 요청 금지
- Ranking은 `<ol>`과 텍스트 순위를 사용
- Quick Preview 닫기 후 opener focus 복원

### 4.4 Cover/Hero

`src/components/cover/CoverImage.tsx`를 확장하되 현재 fallback과 alt 계약을 보존합니다.

- `standard`, `poster`, `hero-foreground`, `hero-backdrop` 표현 분리
- foreground는 원본 비율 유지, `object-fit: contain`
- backdrop만 blur/dim/cover 허용
- generated art, crop된 저작권 이미지, 별도 key art 수집 금지
- 600 실패 → 200 fallback 유지
- 첫 viewport 일부만 eager, 나머지 lazy

### 4.5 Footer

7개 이미지의 footer 밀도만 따르고 dead link를 만들지 않습니다.

- 기존 route: Home, Recommendations, Library, DNA, Settings
- Help/Privacy 문구가 별도 route가 없으면 Settings 내부 anchor로 연결
- Community/SNS 링크는 실제 URL 설정이 없으면 렌더하지 않음
- landing과 post-onboarding footer의 시각 표현은 공유하되 navigation 항목은 context에 맞춤

## 5. 페이지 구현 순서

| 단계 | Branch/PR | 범위 |
|---|---|---|
| R0 | `design/r0-contract-realignment` | planning/AGENTS 계약 개정 |
| R1 | `design/r1-dark-shell` | token, GNB/bottom nav, footer, CoverImage foundation |
| R2 | `design/r2-media-primitives` | Shelf, cards, ranking, Quick Preview, hero backdrop |
| R3 | `design/r3-home` | `/` |
| R4 | `design/r4-recommendations` | `/recommendations` |
| R5 | `design/r5-onboarding` | `/onboarding` |
| R6 | `design/r6-manga-dna` | `/taste` |
| R7 | `design/r7-work-detail` | Catalog/external detail |
| R8 | `design/r8-library` | `/library` |
| R9 | `design/r9-settings` | `/settings` |
| R10 | `design/r10-final-qa` | 전체 responsive/accessibility/performance |

각 page 세부 계획은 `screen-plans/`를 따릅니다.

## 6. AI 에이전트 실행 루프

각 PR에서 아래 순서를 고정합니다.

1. 현재 branch/HEAD와 authority 문서를 확인
2. 작업 ledger 작성
   - 수정 파일
   - 신규 파일
   - 수정하지 않을 경계
   - 테스트할 기존 계약
3. 시각 target에서 구현할 요소와 제외할 요소를 PR 설명에 먼저 기록
4. 가장 작은 수직 slice 구현
5. unit/interaction test
6. targeted E2E
7. 1440×900, 390×844 full-page screenshot
8. keyboard-only, touch, reduced-motion, 200% zoom 검증
9. 아래 전체 명령 실행
10. visual target과 의도적 차이를 PR에 기록

```bash
pnpm format:check
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm catalog:validate
pnpm build
```

## 7. 공통 테스트 매트릭스

### Viewport

- 320×800
- 390×844
- 768×1024
- 1024×768
- 1440×900
- 1920×1080
- 1440 폭에서 200% zoom

### Input

- pointer-fine hover
- keyboard only
- touch
- reduced motion

### Data/failure

- 표지 정상
- 표지 없음
- 600 load 실패 후 200 fallback
- 추천 10개 이상 / 10개 미만
- empty/sparse library
- IndexedDB degraded → memory
- offline cached app/catalog
- provider 502/timeout
- external local record 누락/손상
- 긴 일본어 제목·작가명
- dialog/sheet 반복 open/close

## 8. 성능 예산

- 기존 mobile LCP 예산 유지
- Hero 외 Shelf 전체 이미지를 preload하지 않음
- 첫 viewport 카드만 eager
- Shelf/hero 높이를 예약하여 CLS 방지
- hover에서 fetch 금지
- Quick Preview는 필요한 컴포넌트만 lazy boundary 검토
- 새 carousel dependency 금지
- 각 PR에 client JS bundle delta 기록

## 9. 완료 정의

7페이지 전체 완료는 다음을 모두 충족해야 합니다.

1. 확정 이미지의 색, 밀도, 위계, shelf 경험을 재현
2. 생성 이미지의 unsupported 기능은 제품 계약에 맞게 교정
3. 기존 recommendation work IDs와 ranking 의미론 유지
4. 기존 IndexedDB/export/import/external identity 테스트 통과
5. desktop GNB와 mobile bottom navigation이 동시에 노출되지 않음
6. 로그인/아바타/알림/계정 UI가 없음
7. keyboard, focus, touch, reduced-motion 동등성 확보
8. empty, error, offline, long-text 상태 설계
9. desktop/mobile full-page screenshot 검토
10. format/typecheck/lint/unit/E2E/catalog/build 통과
