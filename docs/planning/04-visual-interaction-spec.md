# 04 — 비주얼·인터랙션 사양 (Visual & Interaction Spec)

> 코딩 에이전트가 시각적 판단을 새로 내리지 않도록 하는 구현 계약.
> 원칙: **표지가 항상 주인공이고, UI는 어두운 극장이다.** 시그니처 모먼트는 3곳뿐이며 나머지 표면은 의도적으로 조용하다.

---

## 1. 아트 디렉션 — dark media shelf

`docs/planning/redesign/visual-targets/`의 7화면처럼 near-black/navy canvas 위에 실제 표지와 조밀한 Shelf를 배치한다. dark-only이며 theme selector, 라이트 fallback, 범용 SaaS의 글래스모피즘·오로라는 쓰지 않는다.

- **브랜드 인격:** 안목 있는 서점 점원. 조용하고 정확하며, 근거를 갖고 말한다. 과장·호들갑 없음.
- **색의 위계:** 화면에서 가장 채도 높은 것은 만화 표지와 의미 있는 cyan accent다. UI 자체는 navy 중립색 + accent 1색.
- **밀도:** 한 viewport에서 여러 작품을 탐색할 수 있게 Shelf·ranking을 밀도 있게 두고 장식은 희박하게 유지한다.

## 2. 디자인 토큰

### 2.1 색 (dark-only)

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
  --accent: oklch(0.7525 0.1382 236.09); /* #43BBFA */
  --accent-hover: oklch(0.80 0.135 236.09);
  --accent-active: oklch(0.69 0.14 236.09);
  --accent-soft: oklch(0.22 0.055 236.09);
  --on-accent: oklch(0.15 0.02 250);
  --danger: oklch(0.65 0.22 25);
  --warn: var(--danger);
  --focus-ring: var(--accent);
}
```

규칙:

- `--accent`는 **의미를 가질 때만** 사용: konomi, 상위 취향, 주요 CTA, 선택, focus ring. 장식적 사용 금지.
- 본문/보조 텍스트와 모든 interaction state는 구현 viewport에서 WCAG AA 대비를 확인한다. cyan accent 채움 위에는 흰색이 아니라 `--on-accent`를 사용한다.
- `--accent-hover`는 두 번째 accent가 아니라 같은 hue/chroma 계열의 주요 CTA 포인터 상태다. `--surface-hover`는 outline/ghost와 중립 인터랙션에만 쓰며 accent 채움 CTA에 적용하지 않는다.
- 장식용 전면 gradient 금지. 읽기 대비를 위한 hero image overlay gradient, 표지 블러 배경(§4.2), 스크린톤은 예외다.

### 2.2 타이포그래피

| 역할 | 폰트 | 사용처 |
|---|---|---|
| 워드마크·디스플레이(라틴) | **Space Grotesk** (300 / 700) | 로고, 랜딩 hero, "Manga DNA" 표제 |
| UI·본문(일본어) | **Noto Sans JP** (400 / 500 / 700) | 전체 UI. 라틴 폴백 겸용 |

- 로고 조판: `kono`(700, accent) `co`(300, text-muted) `mi`(700, accent) `cs`(300, text-muted). letter-spacing −0.01em. 전체 단어가 한 단어로 읽히는 크기 대비 유지.
- 일본어와 라틴이 섞인 디스플레이(`あなたの Manga DNA`)는 Space Grotesk 뒤에 Noto Sans JP를 명시적으로 폴백한다. 일본어 글리프를 Arial에 맡기지 않는다.
- 타입 스케일(모바일 기준, 데스크톱 +1단): 12 / 14(본문) / 16(강조 본문) / 20(섹션) / 28(페이지 h1) / 40(랜딩 hero). 행간 본문 1.7 (일본어), 표제 1.3.
- 숫자·데이터 레이블은 `font-feature-settings: "tnum"` (별도 모노 폰트 도입하지 않음).
- 폰트는 framework-neutral `@font-face` 또는 승인된 self-host package로 로드하고 `font-display: swap`과 fallback metric을 사용한다. `next/font`에 의존하지 않는다.

타입 값과 역할은 아래 2단 토큰으로 소유한다. primitive는 실제 값을, semantic은 문맥을 나타낸다.

| 구분 | 토큰 | 값·매핑 |
|---|---|---|
| primitive | `--font-size-12` / `--font-size-14` / `--font-size-16` / `--font-size-20` / `--font-size-28` / `--font-size-40` | 각각 0.75 / 0.875 / 1 / 1.25 / 1.75 / 2.5rem |
| primitive | `--line-height-body` / `--line-height-heading` | 1.7 / 1.3 |
| semantic | `--text-caption-size` | 12px 유지 |
| semantic | `--text-body-size` | mobile 14px → desktop 16px |
| semantic | `--text-subheading-size` | mobile 16px → desktop 20px |
| semantic | `--text-section-title-size` | mobile 20px → desktop 28px |
| semantic | `--text-page-title-size` | mobile 28px → desktop 40px |
| semantic | `--text-display-size` | 40px. 랜딩·DNA 디스플레이 전용 |

온보딩과 `/taste`의 1440px/390px 실제 제품 렌더에서 일본어 제목·본문·캡션, mixed-script DNA 제목, 다중 행 그룹을 확인했다. 잘림·겹침·가로 오버플로가 없었고 `/taste` DNA 제목의 computed font stack은 Space Grotesk와 Noto Sans JP를 함께 포함했다.

### 2.3 표면·보더·그림자·radius

- 배경은 `--canvas`와 `--surface-1..3` 역할로만 구성하고 같은 card 안에서 불필요하게 3단을 모두 겹치지 않는다.
- 카드: 1px `--line` 보더 + `--radius-card` **8px**. 그림자는 기본 없음. hover·시트 상승 시에만 `--shadow-raised` 한 단을 사용한다.
- 표지: `--radius-cover` **4px** (인쇄물답게 작게) + 1px `oklch(0 0 0 / 0.1)` 보더. 선택 외곽은 2px 보더를 더한 `--radius-cover-selection: calc(var(--radius-cover) + 2px)`로 동심 윤곽을 유지한다.
- 버튼·칩: `--radius-control` 8px(버튼) / `--radius-pill` 999px(칩·원형 상태). 주요 CTA만 accent 채움, 나머지는 outline/ghost.
- semantic 표면 역할은 `--surface-page`(`--canvas`), `--surface-raised`(`--surface-1`), `--surface-interactive`(`--surface-2`), `--surface-hover`(`--surface-3`)로 매핑한다.

### 2.4 간격·레이아웃 리듬

- 4px 기본 단위. primitive 간격은 `--space-1` / `--space-2` / `--space-3` / `--space-4` / `--space-5` / `--space-6` / `--space-7` / `--space-8` / `--space-12` = 4/8/12/16/20/24/28/32/48px로 제한한다. 2/6/10/14/18px은 보더·아이콘 광학 보정·44px 타깃 내부 패딩처럼 역할이 명시된 컴포넌트 예외만 허용한다.
- semantic 간격은 `--space-content-tight` 4, `--space-content` 8, `--space-content-loose` 12, `--space-section` 32, `--space-section-large` 48px이다.
- 화면 좌우 패딩은 `--layout-page-padding` mobile 16 / desktop 24, 페이지 시작 간격은 `--layout-page-block-start` mobile 32 / desktop 48이다. 바깥 page container가 이 값을 소유하며 내부 카드가 다시 화면 패딩을 만들지 않는다.
- 고정 UI 회피값만 별도 semantic 역할로 둔다. `--layout-safe-area-bottom`은 기기 safe area, `--layout-mobile-navigation-clearance`는 모바일 nav+safe area, `--layout-onboarding-tray-clearance`는 선택 tray가 있는 온보딩의 하단 여백, `--layout-taste-action-clearance`는 고정 추천 CTA가 있는 취향 화면의 하단 여백을 소유한다. 마지막 두 값은 각각 mobile `calc(120px + safe area)` / `calc(160px + safe area)`이며, 취향 화면은 desktop에서 120px로 바뀐다.
- 콘텐츠 최대폭: shelf 중심 `/recommendations`와 landing은 `--layout-width-media` 1200, `/taste` 960, 상세 1040, form 640을 기본으로 한다. 온보딩 shelf는 1120, 읽기·안내 블록은 760, 전역 nav는 1200을 사용한다.
- 구분선은 그림자 대신 1px `--line` 헤어라인 사용(인쇄물의 괘선 감각).

### 2.5 인터랙션 상태 (전 컴포넌트 공통)

- hover(포인터만): outline/ghost는 `--surface-hover`, 주요 accent CTA는 `--accent-hover`, 표지는 lift(§6-D). `--motion-duration-feedback` 120ms는 허용된 transform/opacity에만 적용하고 색·배경·보더·그림자는 즉시 상태를 바꾼다.
- active/press: scale 0.97, `--motion-duration-press` 80ms.
- focus-visible: 2px accent ring + 2px offset. **마우스 클릭에는 링 미표시.**
- disabled: opacity 0.45 + `cursor: not-allowed`. 색만으로 구분하지 않고 레이블 유지.
- selected: accent 보더 + 체크 오버레이(표지 카드) / `--accent-soft` 배경 + accent 보더·텍스트(칩). solid accent 채움은 주요 CTA에만 쓴다.
- skeleton: `--line` 톤 펄스(1.2s), 카드 실루엣 그대로. 1초 개발 throttle 동안의 짧은 placeholder 노출은 허용한다. 스피너는 전역 치명 오류 재시도에만 쓴다.
- empty state: 스크린톤 원 안에 아이콘 + 1줄 안내 + 1개 액션. 일러스트 신규 제작 없음.
- error: `--warn` 좌측 보더의 인라인 박스. 토스트는 성공 알림에만.

모션 값도 의미 역할로 소비한다: `--motion-duration-page` 160ms, `--motion-duration-value` 240ms, `--motion-duration-reveal-step` 400ms, `--motion-ease-direct` ease-out, `--motion-ease-value` ease-in-out, `--motion-ease-signature` cubic-bezier(0.2, 0, 0, 1). 이 값은 아래 A~F 분류를 대체하지 않고 구현 간 별칭 드리프트만 막는다.

### 2.6 리뷰 통합 토큰·예산 경계

- 위 dark primitive + semantic 명칭이 migration 이후 권위다. 구현 원본은 framework-neutral global stylesheet의 `:root`이며 wide/narrow/reduced-motion에서 검증한다. 이전 light token과 `src/app/globals.css`는 migration baseline일 뿐 새 구현 권위가 아니다.
- radius의 bounded 단계는 4px/8px 두 개다. 999px은 칩·원형 상태를 구별하기 위한 `pill-or-circle` 예외이고, 선택 표지 6px은 새 primitive가 아니라 `4px + 2px 선택 보더`의 파생값이다.
- 그림자 1단, accent 1색, primary CTA 1종, secondary CTA 1종을 유지한다. 상태색 `--warn`은 장식 accent로 세지 않는다.
- visual entropy 기본 모션 예산 2종을 이 프로젝트에 강제하지 않는다. §6의 A~F 6종은 reveal·문맥 전환·재배치·직접 입력·수치 변화·오류 인지라는 서로 다른 정보를 보존하므로 **검토가 필요한 명시적 예외**로 유지한다. 무한 ambient motion과 분류 밖 모션은 계속 0개다.
- 기존 `design-token-budget.json`과 `design-token-proposal.html`은 light baseline의 역사 자료다. M7에서 dark token 구현값으로 다시 생성하기 전에는 현재 token 권위로 사용하지 않는다.

### 2.7 외부 모델 독립 리뷰 통합 기록 (2026-08-14)

- **Grok:** `Cursor Grok 4.6 High` (`cursor-grok-4.6-high`, non-fast), session `d77400a8-ad25-4212-b86e-ac353d9aaf8d`, verdict `ACCEPT WITH MUST FIXES`, final SHA-256 `35d147f0096e55a55d6a5d8d9177e83936f6e658f3832f7d62a4481b27a83269`.
- **Gemini:** `gemini-3.6-flash-high`, session `e5e85532-7775-4c66-989b-8ea34a5cc1cb`, verdict `PASS WITH CHANGES`, final SHA-256 `0aa9bf003abbaa74435bf47b217a9a2d05fede0e87f48875cb1ef5a027716845`.
- **수용:** CTA hover 대비와 공유 accent-hover 상태, safe-area·고정 UI clearance 역할, mixed-script Noto 폴백, F의 정적 보더 대체, A~F 예외 유지, accent-soft 선택 칩, 미사용 selector 제거를 반영했다.
- **Gemini trigger 한정:** Motion의 `initial={false}` 때문에 일반 `/taste` 최초 진입에서 1.2초 빈 막대가 생긴다는 주장은 성립하지 않는다. 유효한 결함은 **이후 non-reveal target 변경**도 reveal delay와 400ms를 상속한다는 점이며, non-reveal은 delay 0 / 240ms로 분리해야 한다.
- **거절:** Tailwind `@theme inline`에 spacing/radius를 중복 노출하는 제안은 채택하지 않는다. TSX의 Tailwind utility는 `:root` semantic custom property를 직접 소비하며 spacing/radius 값의 단일 권위는 `:root`다.
- 구조화 checker의 `review-required`는 오류가 아니라 pill radius와 A~F 예외의 인간 검토 필요성을 보존한다. 모델 리뷰 완료를 자동 `pass`로 과장하지 않는다.

### 2.8 Base UI wrapper·media interaction

- shadcn CLI가 Base UI 기반 primitive를 `src/components/ui/**`에 생성한다. 이 파일은 vendored primitive이며 제품 token이나 feature 의미를 직접 소유하지 않는다.
- `src/components/design-system/**` wrapper가 위 primitive에 dark semantic token, 최소 44px target, focus-visible, disabled/busy 상태와 size variant를 적용한다. route/feature는 wrapper를 소비한다.
- Shelf는 CSS scroll-snap + `ResizeObserver` + 기존 Motion만 사용한다. desktop fine pointer는 200ms hover intent 뒤 expanded card를 열고 keyboard focus는 즉시 연다. touch는 card를 확장하지 않고 Quick Preview sheet를 연다.
- expanded/focus/scroll/dialog animation과 focus restoration은 React local state다. Quick Preview 대상만 deep-link 가치가 있어 `/recommendations?preview=<workId>`로 표현할 수 있다.
- Shelf 높이를 미리 예약하고 expansion 정보는 이미 보유한 local data만 사용한다. hover network fetch, autoplay, 스크롤 하이재킹은 없다.

---

## 3. 배경과 질감

### 3.1 원칙

애니메이션 배경 없음. WebGL/Canvas 없음. 질감은 정적 CSS로만.

### 3.2 스크린톤(망점) 텍스처 — Aurora/Dot Grid 대체

```css
.screentone {
  background-image: radial-gradient(oklch(0.97 0.006 250 / 0.05) 1px, transparent 1px);
  background-size: 8px 8px;
}
```

- 적용처: 랜딩 hero 배경(마스크로 우상단→투명 페이드), 빈 상태 배경, DNA 요약 카드 배경. **본문·리스트 뒤에는 쓰지 않는다.**
- `aria-hidden` 불필요(배경 프로퍼티). 인쇄 망점의 시각 인용이며 konocomics 고유 질감으로 일관 사용.

---

참고: 스크린톤 외의 질감·패턴·노이즈 텍스처는 도입하지 않는다.

## 4. 표지 표현

### 4.1 기본 규칙

- 항상 원본 비율(`object-fit: contain`), 크롭 금지. 프레임 비율은 3:4.3 고정 박스에 contain.
- 소스 크기: thumb `_ex=200x200` / 카드 `_ex=400x400` / 상세 hero `_ex=600x600`. `_ex` 확대는 비공식 동작이므로 `onError`에서 200x200 폴백 필수.
- `loading="lazy"`(뷰포트 첫 화면 제외), `decoding="async"`. 컨테이너에 aspect-ratio를 지정해 CLS 0.
- 추천 1위 표지는 첫 viewport의 LCP 후보이므로 eager/high-priority로 요청한다. 나머지 첫 화면 밖 표지는 lazy loading을 유지한다.
- skeleton에서 성공 이미지 또는 실패 placeholder로 바뀔 때 opacity fade를 적용하지 않고 즉시 교체한다.

### 4.2 블러 배경 (작품 상세 시그니처)

```html
<div class="relative isolate overflow-hidden">
  <img aria-hidden="true" alt="" src={coverUrl}
       class="absolute inset-0 size-full scale-125 object-cover opacity-30 blur-3xl" />
  <div aria-hidden="true" class="cover-hero__tone-overlay"></div>
  <img src={coverUrl} alt="{title} 表紙" class="relative h-auto w-full object-contain" />
</div>
```

- 동일 URL 재사용(추가 요청 없음). 정적이며 패럴랙스·모션은 없다. dark canvas/overlay gradient를 블러 위·전경 콘텐츠 아래에 렌더해 텍스트 대비를 보장한다.

### 4.3 Placeholder 표지 (이미지 실패·부재)

`--surface-raised` 배경 + 1px 보더 + 세로쓰기 느낌의 중앙 제목 텍스트(2줄 clamp, `--text-muted`) + 좌하단 저자. 스크린톤 12px 패턴을 우상단 모서리에만 둔다. 로딩 중에는 skeleton, 실패 확정 후 placeholder다.

---

## 5. 시그니처 모먼트 (전체 3개 — 추가 금지)

### 5.1 konomi 로고 reveal — 랜딩

- **목적:** 브랜드 기믹이 곧 제품 설명("숨은 취향의 발견")임을 10초 안에 체험시킨다.
- **자격:** usable profile이 아닌 일반 first-run의 resolved introduction에서만 세션당 1회 실행한다. `?landing=1`은 항상 정적이며 marker를 읽거나 쓰거나 지우지 않는다.
- **marker:** `sessionStorage["logoRevealed"] = "1"`. absent 확인 뒤 write/readback을 마치고 font 대기·Motion 시작·timer/listener 등록보다 먼저 marker를 소유한다. read·write·readback 중 하나라도 실패하면 reveal 없이 최종 정적 상태를 표시한다.
- **static-first 기본값:** 고정 300/700의 최종 2톤 wordmark, `好み`와 「kono + mi = このみ」 caption, 태그라인·설명·CTA가 resolved introduction의 첫 paint부터 최종 DOM에 존재한다. CSS 기본값과 enhancement 실패 상태는 전부 최종 시각 상태다. eligible A가 시작된 뒤에도 최종 2톤 base·태그라인·설명·CTA는 숨기거나 비활성화하지 않고 caption group만 아래 시퀀스의 opacity/transform을 적용한다.
- **오버레이 시퀀스(총 1.4초 이내, Motion A):** 최종 2톤 base 위의 별도 고정 300 ink monochrome wordmark overlay만 opacity로 합성한다. 0–400ms에는 base가 계속 보이는 상태에서 overlay opacity가 등장하고, 400–900ms에는 overlay가 1→0으로 사라져 base를 드러낸다. 900–1400ms에는 caption group만 opacity와 `translateY(8px→0)`로 나타난다. font-weight·color·layout·tagline·description·CTA는 애니메이션하지 않는다.
- **font:** marker를 먼저 기록한 뒤 `document.fonts.ready`를 기다린다. API가 없거나 reject하면 최종 정적 상태다.
- **스킵·정리:** pointer/tap/click·keydown·wheel/scroll은 `preventDefault`나 전파 차단 없이 즉시 완료한다. 자연 완료·스킵·`pagehide`·unmount는 controls·timer·pending continuation과 모든 listener를 정리한다. CTA activation은 reveal을 완료하면서도 그대로 이동한다.
- **재진입·reduced-motion:** marker가 이미 있으므로 reload/back/forward에서 재생하지 않는다. reduced-motion도 marker는 소비하되 처음부터 최종 정적 상태다. 실행 중 reduce로 바뀌면 즉시 완료하고 같은 session에서 다시 재생하지 않는다.

### 5.2 Manga DNA reveal — /taste?reveal=1

- **목적:** 온보딩의 보상. "선택한 작품들 → 분석된 취향"의 인과를 몸으로 느끼게 한다(가설 E).
- **시퀀스 (총 ≈2.4s + 사용자 스크롤):**
  1. 0–500ms: 선택한 Anchor 표지 썸네일들이 상단에 가로로 정렬되어 fade-in.
  2. 500–1200ms: 상위 취향 3개 요약 카드가 순서대로 fade-up(간격 180ms), 각 카드의 취향 레이블에 accent 밑줄이 좌→우로 그려짐(300ms).
  3. 1200ms~: 1200ms는 페이지 전체에 한 번만 적용하는 전역 gate다. gate 전에 뷰포트에 들어온 FactorBar는 gate가 열린 뒤 0→값으로 성장하고, gate 뒤 처음 진입한 화면 밖 막대는 추가 1200ms 지연 없이 즉시 시작한다(막대당 400ms, 섹션 내 stagger 60ms, ease-out, 각 1회).
- **URL 소비:** mount에서 `?reveal=1` 판정을 local state/ref에 고정한 즉시 같은 effect에서 query를 `replaceState`로 제거한다. URL 제거 뒤에도 고정된 판정으로 A를 계속하며 query를 in-progress state나 replay token으로 사용하지 않는다.
- **reduced-motion:** 전부 생략, 완성 상태 즉시 표시.
- **반복:** reveal 모드 1회. 상시 /taste의 막대는 positive anchor에서 계산한 분석 출력으로 정적이며, 추천 adjustment 변경으로 값·길이·색을 바꾸지 않는다.
- **성능:** transform/opacity만 사용. 막대는 `scaleX` transform(레이아웃 리플로우 금지).

### 5.3 작품 상세 블러 표지 배경 (정적 시그니처)

모션 없음. §4.2. "이 작품의 세계에 들어왔다"는 공간감을 만드는 유일한 배경 연출.

---

## 6. 모션 분류 체계 (taxonomy)

모든 애니메이션은 아래 6종 중 하나여야 하며, 어디에도 속하지 않으면 구현하지 않는다.

| 분류 | 목적 | 지속 | easing | 도구 | 예 |
|---|---|---|---|---|---|
| A. 1회성 reveal | 시그니처 모먼트 | 400–1800ms | `[0.2,0,0,1]` / spring | Motion | §5.1, §5.2 |
| B. 페이지 진입 | 문맥 전환 인지 | 160ms | ease-out | CSS | 허용된 resolved content만 fade-up 8px. **exit 애니메이션 없음**(내비 블로킹 금지) |
| C. 상태 전환 | 데이터 변화 표현 | 200–240ms | Motion spring (stiffness 350, damping 32) | Motion layout | 추천 카드 제거→백필, tray 재배치, Library 행 이동 |
| D. 직접 조작 피드백 | 입력 확인 | 80–120ms | ease-out | CSS | press scale 0.97, 선택 체크 페이드, hover lift 2px |
| E. 값 전이 | 수치 변경 표현 | 240ms | ease-in-out | CSS transition | positive anchor 변경 뒤 FactorBar 분석값 갱신, 확신도 레이블 크로스페이드. 추천 adjustment는 FactorBar 입력이 아니다. |
| F. 어텐션 | 오류·한도 안내 | 120ms×2 | linear | CSS | tray 흔들림(±4px), 오류 박스 등장. reduced-motion에서는 전체 `--warn` 보더를 정적으로 유지 |

전역 규칙:

- **상시(무한 루프) 애니메이션 0개.** skeleton 펄스만 예외(로딩 중 한정).
- 한 인터랙션이 동시에 발화하는 **합성 효과 family**는 최대 2개다(예: 카드 제거/layout + 백필). DNA의 여러 카드·막대 instance stagger는 하나의 A family로 센다.
- transform/opacity 외 프로퍼티 애니메이션 금지(height 축소는 추천 카드 제거 시에만 허용, contain 처리). 단, desktop fine-pointer `ExpandableMediaCard`는 같은 카드의 공간 연속성을 유지하기 위해 실제 article `width`만 128~160px→300~360px로 240ms 보간할 수 있다. 이 예외는 높이 364px 고정, 최종 폭의 고정 content canvas, 동일 cover DOM, 고정 폭 identity rail, article 자체의 border/background/overflow clipping, reduced-motion 즉시 완료를 모두 만족해야 하며 `flex-basis`·텍스트/control 크기는 보간하지 않는다. color·background·border·box-shadow·font-weight 상태는 보간하지 않고 즉시 바꾼다.
- 자동재생 캐러셀·스크롤 하이재킹·패럴랙스·커서 추적 효과 금지. 모바일에서 hover 의존 정보 금지(D의 hover lift는 장식이므로 무손실).
- B의 정확한 allowlist는 `/onboarding` Step 1 resolved content(첫 등록·add mode), reveal 요청으로 시작하지 않은 ordinary `/taste`, 유효한 `/works/[workId]` resolved Catalog 상세, `found`인 `/works/external` resolved 상세뿐이다. Catalog는 `workId`, external은 external ID가 바뀐 새 route mount에서 다시 실행할 수 있다.
- B는 landing의 모든 상태, A로 시작한 `/taste`, `/recommendations`, `/library`, `/settings`, onboarding Step 2, loading·hydration/redirect guard·skeleton·empty·invalid-link·local-missing·corrupt·unavailable·error, dialog·modal·drawer·panel·sheet·feedback surface에 적용하지 않는다. query cleanup·local state 변경·onboarding step 변경·dialog open/close·BFCache resume도 replay trigger가 아니다.
- B는 AppShell/global layout이 아니라 eligible resolved-content root에만 적용한다. CSS 기본값은 최종 위치에서 완전히 보이는 상태이며 keyframe은 `prefers-reduced-motion: no-preference` 안에만 둔다. 8px 이동 중에도 opacity 0으로 만들어 콘텐츠를 완전히 숨기지 않고, 실패 시 최종 상태가 남는다.
- E와 F는 CSS가 소유한다. ordinary FactorBar E는 static CSS 기본값을 target `scaleX`로 두고 underlying analysis 값 변경 시 delay 0 / 240ms만 적용한다. 추천 adjustment의 직접 피드백은 D의 선택 marker/text와 저장 live message가 소유하며 FactorBar success highlight를 만들지 않는다. F 흔들림도 CSS만 사용한다.
- `prefers-reduced-motion: reduce`: A는 최종 상태로 즉시 완료하고 해당 1회 marker를 소비하며 B도 최종 상태로 즉시 표시한다. C는 `layout={false}`로 즉시 상태·순서·focus/live message를 반영하고 expandable card의 한정 width 예외도 최종 폭으로 즉시 완료한다. D는 scale/travel을 제거하고 선택·focus 상태는 유지한다. E는 underlying analysis의 target 값을 즉시 반영한다. F는 흔들림 없이 전체 `--warn` 보더와 오류·한도 text를 정적으로 유지한다. skeleton은 pulse 없는 정적 silhouette, Shelf 버튼 scroll은 `auto`다.

## 7. 서드파티 시각 라이브러리 판정

| 라이브러리 | 판정 | 근거·제약 |
|---|---|---|
| **Motion** (`motion`) | **채택** | 분류 A·C 전담. 기본은 `LazyMotion` + `domAnimation`; C의 실제 `layout` 소유 컴포넌트만 local `domMax`를 사용한다. 추천은 목록 owner만 감싸고 페이지·사이드 패널·control·error·dialog까지 올리지 않는다. reduced-motion에서는 해당 C element의 `layout`을 `false`로 둔다. 유일한 애니메이션 의존성 |
| React Bits | **미채택** | 5개 후보 전부 자작·제거로 대체(`01` V2). 컴포넌트 복사·라이선스 추적 비용 제거 |
| NumberFlow | **미채택** | 서수 데이터에 숫자 굴림은 거짓 정밀도(`01` V4) |
| Embla Carousel | **미채택** | Shelf는 CSS scroll-snap + 버튼으로 구현(`01` V5) |
| AutoAnimate | **미채택** | Motion layout으로 커버 |
| GSAP / Lottie / three.js | **미채택** | 요구 없음 |

Shelf 구현 계약(캐러셀 대체): `overflow-x: auto` + `scroll-snap-type: x mandatory` + 카드 `scroll-snap-align: start` + 데스크톱용 이전/다음 버튼(`scrollBy` smooth, reduced-motion 시 instant) + `scrollbar-width: none`. 키보드는 카드 간 Tab/화살표.

## 8. 성능 예산

### 8.1 판정값

- 추천 페이지 초기 JS는 **250,000 bytes gzip 미만**이다. modern Chromium이 cold direct `/recommendations` 진입에서 사용자 입력 전 `networkidle`까지 실제 요청한 unique same-origin JavaScript를 대상으로 한다. URL을 TanStack Start/Vite build manifest의 emitted file에 대응해 dedupe하고 exact file gzip level 9 합계를 낸다. interaction-only chunk는 제외하고 inline executable script와 initial HTML bytes는 별도 보고한다.
- LCP: 랜딩 resolved introduction과 추천 화면에서 브라우저가 실제로 선택한 가장 큰 정당한 콘텐츠 후보의 cold mobile 5회 중앙값은 각각 < 3.5s다. 가시적인 태그라인·설명문을 숨기거나 축소하거나, mobile 96px 표지를 확대해 특정 element를 LCP로 강제하지 않는다. 랜딩 첫 로고 후보 시각과 추천 1위 표지의 request·삽입·load 시각은 LCP와 별도로 기록하고, 1위 표지는 eager/high-priority 계약을 유지한다.
- CLS < 0.05: 같은 cold mobile 5회 중앙값. 표지 aspect-ratio 고정과 폰트 메트릭 폴백을 유지한다.
- 60fps는 A/C 목표다. frozen local 4× CPU 환경에서 추천 C 제거·layout·백필의 median effective FPS가 30 미만이면 그 C owner의 layout motion을 비활성화한 뒤 다시 판정한다. runtime benchmark나 임의 기기 class는 만들지 않는다.
- skeleton pulse는 정확히 1.2s이며 loading 중 한정이다. 블러 배경은 화면당 1개, `will-change` 사용 금지(정적이므로 불필요).

### 8.2 재현 가능한 production-local 계측

- `pnpm build` 뒤 `pnpm start` production server와 현재 Playwright Chromium을 사용한다. dev server나 build summary, Lighthouse 수치로 아래 직접 계측을 대체하지 않는다.
- authoritative local mobile profile은 390×844, DPR 3, touch/mobile, CDP CPU 4× slowdown, 150ms RTT, 1.6Mbit/s down, 0.75Mbit/s up이다. 독립 browser context 5개에서 HTTP cache를 비운 cold run을 보존하고 중앙값으로 판정한다. 필요한 usable profile/recommendation state는 test-only route나 direct IndexedDB 주입 없이 실제 제품 flow로 만든 뒤 IndexedDB만 유지한다. Slice 11에서는 service worker를 우회한다.
- LCP·CLS `PerformanceObserver`는 app script와 navigation 전에 주입하고 buffered `largest-contentful-paint`, `layout-shift`(`hadRecentInput === false`)를 고정 관측 창까지 수집한다. 관측 중 사용자 입력은 하지 않는다.
- 1위 표지 provider 변동을 고정 fixture로 격리할 때도 실제 `CoverImage` 경로를 통과해야 한다. fulfilled bytes에 CDP throttle이 적용됨을 증명하거나 fixture 응답 자체가 위 latency·transfer profile을 재현해야 하며, 즉시 fulfill된 이미지를 mobile LCP gate로 쓰지 않는다. unmocked run은 진단으로 별도 기록할 수 있다.
- 각 run의 build identity·Node/package/browser version, CDP 조건, raw LCP/CLS, rAF frame interval/FPS, requested JS URL→emitted file→raw/gzip bytes와 total을 machine-readable artifact로 보존한다. production-local 결과는 배포·실기기 성능 증거가 아니며 중급 Android 열·프레임, real cellular/provider LCP와 iOS/Android 설치 모드는 별도 수동 검증 한계로 남긴다.

## 9. 조용한 표면 선언

다음 화면·영역에는 시그니처·B 진입·장식을 **의도적으로 두지 않는다**: 랜딩의 A 외 별도 B, Library, 설정, 온보딩 STEP 2(불호 입력은 감정적으로 중립해야 함), 모든 dialog·panel·sheet. 추천 피드는 §2.8의 기능적 expanded card와 C 제거/백필만 허용한다. Quick Preview와 Library sheet/panel entry, cover/image load opacity fade는 금지하고 최종 상태로 즉시 연다.
