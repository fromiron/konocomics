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
  --accent: oklch(0.76 0.11 72);
  --accent-hover: oklch(0.81 0.11 74);
  --accent-active: oklch(0.70 0.12 70);
  --accent-soft: oklch(0.27 0.05 70);
  --on-accent: oklch(0.22 0.03 65);
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
- 2026-09-11 사용자 선택 이미지 1의 상세 근거 배너에만 `--evidence-surface: oklch(0.8 0.018 215)` 회청색 표면을 허용한다. 기존 `--discovery-*`의 흰 카드·짙은 글자·옅은 경계 토큰을 배너 내부에만 매핑한다. 전역 dark theme은 유지하며 `RankingCard`의 `evidence` variant는 원본 비율 표지, 역할 pill, 제목 링크를 공유하고 순위 장식을 생략한다.

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

- 4px 기본 단위. primitive 간격은 `--space-1` / `--space-2` / `--space-3` / `--space-4` / `--space-5` / `--space-6` / `--space-7` / `--space-8` / `--space-12` / `--space-24` = 4/8/12/16/20/24/28/32/48/96px로 제한한다. 2/6/10/14/18px은 보더·아이콘 광학 보정·44px 타깃 내부 패딩처럼 역할이 명시된 컴포넌트 예외만 허용한다.
- semantic 간격은 `--space-content-tight` 4, `--space-content` 8, `--space-content-loose` 12, `--space-section` 32, `--space-section-large` 48, `--space-section-xl` 96px이다. `--space-section-xl`은 선반과 구분하는 큰 블록의 바깥 간격에 사용한다. `/recommendations` 전용으로 같은 묶음의 선반 사이 `--space-shelf`(= `--space-section-large`, 48px)와 묶음 사이 `--space-shelf-group`(64px)을 둔다.
- 화면 좌우 패딩은 `--layout-page-padding` mobile 16 / desktop 24, 페이지 시작 간격은 `--layout-page-block-start` mobile 32 / desktop 48이다. 바깥 page container가 이 값을 소유하며 내부 카드가 다시 화면 패딩을 만들지 않는다.
- 일반 본문 끝과 footer 사이의 여백은 공용 AppShell route-content의 `padding-bottom: var(--space-section-large)` 48px이다. 마지막 캐러셀의 별도 margin이나 각 화면의 일반 bottom padding은 사용하지 않는다. tray·고정 CTA·하단 navigation의 회피 공간은 아래 계약대로 별도 유지한다.
- 고정 UI 회피값만 별도 semantic 역할로 둔다. `--layout-safe-area-bottom`은 기기 safe area, `--layout-mobile-navigation-clearance`는 모바일 nav+safe area, `--layout-onboarding-tray-clearance`는 선택 tray가 있는 온보딩의 하단 여백, `--layout-taste-action-clearance`는 고정 추천 CTA가 있는 취향 화면의 하단 여백을 소유한다. 마지막 두 값은 각각 mobile `calc(120px + safe area)` / `calc(160px + safe area)`이며, 취향 화면은 desktop에서 120px로 바뀐다.
- 콘텐츠 최대폭: shelf 중심 `/recommendations`·landing·`/taste`·작품 상세는 `--layout-width-media` 1200, form 640을 기본으로 한다. 온보딩 shelf는 1120, 읽기·안내 블록은 760, 전역 nav는 1200을 사용한다.
- 구분선은 그림자 대신 1px `--line` 헤어라인 사용(인쇄물의 괘선 감각).

### 2.5 인터랙션 상태 (전 컴포넌트 공통)

- hover(포인터만): outline/ghost는 `--surface-hover`, 주요 accent CTA는 `--accent-hover`, 탐색 카드는 background·shadow 또는 컴포넌트 고유 상태로 반응한다. **hover로 border color를 바꾸는 패턴은 전역 금지**(상세 「この作品と近い作品」의 임시 보더 예외도 Top 10 공용 카드 재사용으로 종료)이며 border 상태는 selected·validation·keyboard focus처럼 hover가 아닌 의미 상태에만 쓴다. 장식적인 generic Y축 lift는 전역에서 사용하지 않는다. 2026-10-01 사용자 결정으로 허용된 포스터형 카드의 포인터 광택(§6 G)은 lift가 아니며 §6 G의 위치·한도 안에서만 쓴다. 각도를 바꾸는 기울기(tilt)는 모든 요소에서 금지한다. 카드 확장·ranking accessory 이동·preview disclosure처럼 의미 있는 주 상태 전환만 spatial motion cue가 될 수 있다. `/onboarding`의 `コレクションから探す`는 compact 2열 disclosure trigger와 그 아래 하나의 full-width inline panel이다. 표지는 원본 비율을 유지하고 semantic token만 쓴다. Spotify Green·로고·음악 재생 UI·정확한 그래픽 복제는 하지 않는다. `--motion-duration-feedback` 120ms는 허용된 transform/opacity에만 적용하고 색·배경·그림자는 즉시 상태를 바꾼다.
- active/press: scale 0.97, `--motion-duration-press` 80ms. 데스크톱 GNB 헤더 브랜드 링크만 좁은 예외로, press transform 없이 compact opacity 피드백을 쓴다.
- focus-visible: 2px accent ring + 2px offset. **마우스 클릭에는 링 미표시.**
- disabled: opacity 0.45 + `cursor: not-allowed`. 색만으로 구분하지 않고 레이블 유지.
- selected: accent 보더 + 체크 오버레이(표지 카드) / `--accent-soft` 배경 + accent 보더·텍스트(칩). solid accent 채움은 주요 CTA와 2026-10-01 사용자가 샘플과 동일한 디자인을 요구한 공용 `SegmentedControl`의 선택 인디케이터에만 쓴다. 세그먼트 선택 글자는 `--on-accent`다.
- skeleton: 카드 실루엣 그대로, `--line` 톤 바탕에 §3.2 스크린톤 망점을 얹고 밝은 띠가 1.2s 주기로 한 방향 통과하는 시머다(2026-10-01, 로딩 중 한정). reduced-motion에서는 띠 이동 없이 정적 망점 실루엣에 1.6s opacity 0.7↔1 변화만 둔다. 1초 개발 throttle 동안의 짧은 placeholder 노출은 허용한다. 스피너는 전역 치명 오류 재시도에만 쓴다.
- empty state: 스크린톤 원 안에 아이콘 + 1줄 안내 + 1개 액션. 일러스트 신규 제작 없음. 유일한 예외는 `/library`의 전체 레코드 없음(overall-empty)뿐이며, 승인된 image-half empty-state로 기존 메시지 1개 + `作品を追加` 1개만 유지한다. 검색·탭·세그먼트 empty와 다른 화면에는 적용하지 않는다.
- functional contextual image banners: 상태/기능/CTA가 연결된 이미지 배너다. 필요한 기능 배너는 아래 §9의 장식 억제보다 상위 계약이며, 실제 상태·기능·기존 route CTA가 없는 순수 장식 배너는 계속 금지한다. `/recommendations` 후보 부족 full-shell만 허용한다. 나머지 닫는 안내는 공용 `SummarySection`(이미지 없음)을 쓴다. 장식 전용 hero가 아니며 이미지 속 텍스트는 쓰지 않는다. 좌측은 DOM copy·metrics·기존 route CTA, 우측은 장식 `img`(alt="", `aria-hidden`). Spotify Green/로고/재생 UI 복제는 하지 않는다. 상시 루프 모션은 없다.
- error: `--warn` 좌측 보더의 인라인 박스. 토스트는 성공 알림에만.

모션 값도 의미 역할로 소비한다: `--motion-duration-page` 160ms, `--motion-duration-floating-action` 200ms, `--motion-duration-value` 240ms, `--motion-duration-reveal-step` 400ms, `--motion-ease-direct` ease-out, `--motion-ease-value` ease-in-out, `--motion-ease-signature` cubic-bezier(0.2, 0, 0, 1). 이 값은 아래 A~G 분류를 대체하지 않고 구현 간 별칭 드리프트만 막는다. Top 10의 floating rank accessory는 `transform`·`opacity`만 200ms ease-out으로 전환하고 reduced motion에서는 이동 없이 즉시 상태를 바꾼다.

개인화 Top 10은 2026-09-10 사용자 승인에 따라 순위 배지에 기존 프라이머리 `--accent`를 사용하고 숫자는 어두운 `--on-accent`로 표시한다. 2026-10-01 사용자 결정으로 1·2·3위는 금·은·동 메달이다: 배지는 `--medal-{gold|silver|bronze}`의 밝은→기본→깊은 금속 그라디언트와 각 메달의 어두운 ink 숫자를 쓰고, 배지 위에 같은 금속의 장식 SVG 왕관(구슬 장식·보석·잉크 외곽선)을 둔다. D 입력 피드백으로 fine-pointer hover·keyboard focus-visible 진입 시 배지가 먼저 나타나고, `--motion-delay-rank-crown` 150ms 후 왕관이 480ms 동안 위에서 떨어져 눌렸다 펴지며(squash·stretch, opacity·translate·scale만) 착지하고, 이어서 왕관 안을 광택 띠가 한 번 지나가며(520ms) 작은 반짝임 두 개가 한 번 깜박인다. 회전·기울기는 없다. 이탈 시 숨기고 재진입 시 다시 한 번 재생하며 상시 반복하지 않는다. reduced-motion에서는 배지·왕관을 지연·이동 없이 즉시 표시한다. 왕관은 `aria-hidden`이며 순위 이름·상세 링크·카드 외곽 geometry는 유지한다. 4위 이하는 accent 배지만 쓴다.

「読みたい」 저장 액션과 그 상태 표시(추천 카드·Quick Preview·Anchor 패널·작품 상세·판매순 발견 배너·Library 작품 추가·Library 「読みたい」 탭)는 2026-10-01 사용자 결정으로 모두 같은 북마크 아이콘을 쓰고, 저장된 상태는 채운 아이콘이다.

### 2.6 리뷰 통합 토큰·예산 경계

- 위 dark primitive + semantic 명칭이 migration 이후 권위다. 구현 원본은 framework-neutral global stylesheet의 `:root`이며 wide/narrow/reduced-motion에서 검증한다. 이전 light token과 `src/app/globals.css`는 migration baseline일 뿐 새 구현 권위가 아니다.
- radius의 bounded 단계는 4px/8px 두 개다. 999px은 칩·원형 상태를 구별하기 위한 `pill-or-circle` 예외이고, 선택 표지 6px은 새 primitive가 아니라 `4px + 2px 선택 보더`의 파생값이다. §6.1 공용 세그먼트의 트랙 10px·인디케이터 7px은 사용자 샘플 형태를 보존하는 control radius 파생값이며 다른 표면으로 확대하지 않는다.
- 그림자 1단, accent 1색, primary CTA 1종, secondary CTA 1종을 유지한다. 상태색 `--warn`은 장식 accent로 세지 않는다.
- visual entropy 기본 모션 예산 2종을 이 프로젝트에 강제하지 않는다. §6의 A~G 7종(G는 2026-10-01 추가)은 reveal·문맥 전환·재배치·직접 입력·수치 변화·오류 인지라는 서로 다른 정보를 보존하므로 **검토가 필요한 명시적 예외**로 유지한다. 무한 ambient motion과 분류 밖 모션은 계속 0개다.
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
- Shelf는 CSS scroll-snap + `ResizeObserver` + 기존 Motion만 사용한다. 추천 Featured는 가운데 canonical copy와 `aria-hidden`·`inert` 양쪽 clone을 둔 3-copy pointer/touch 루프이며, scroll settle 뒤 같은 위치의 가운데 copy로 즉시 점프한다. 키보드는 canonical 실카드만 대상으로 하고 끝에서 비순환이다. Anchor·Discovery·Completed·Top 10은 유한 트랙이며 끝에서 화살표가 disabled되고 wrap하지 않는다. 추천 featured card는 고정 poster 프레임 안에서 정상 상태의 큰 표지와 짧은 설명을 우선하고, desktop fine pointer hover와 keyboard focus에서는 외곽 geometry를 유지한 채 표지를 줄여 근거 설명과 action rail을 연다. mobile 390×844는 활성 카드 1장 + 다음 카드 peek이며 desktop은 약 3장 + 다음 카드 일부를 보인다. 표지 identity `Link`는 항상 작품 상세로 가고 Quick Preview는 별도 44px icon-only quiet control이며 Top 10에는 두지 않는다.
- 추천 featured card의 작품별 색 구분은 전경 표지와 같은 400px URL을 정적 decorative backdrop으로 재사용해 만든다. backdrop은 `alt=""`·`aria-hidden`·lazy이고 작은 local blur와 72% `--hero-scrim` 아래에 있으며 runtime palette 추출·추가 eager/high 요청은 없다. 전경 표지 컨테이너만 4px radius와 `--shadow-cover-featured: 0 8px 24px oklch(0 0 0 / 0.5)`를 사용한다.
- 추천 Discovery compact card의 resolved 표지만 원본 no-crop 규칙과 transform/opacity motion 예산의 사용자 승인 좁은 예외다. 고정 30:43 stage 중앙을 `clip-path: inset(15.116279% 0 round 50% / 34.883721%)`로 center-crop해 정확한 원을 만들고, hover/focus에서 `inset(0 round var(--radius-cover))`로 펼친다. 두 shape는 240ms linear로 직접 보간해 과대한 pill radius가 마지막에 풀리는 비균일한 형상 전환을 만들지 않는다. stage·article·형제 rect와 source URL/request는 바꾸지 않고, 표지 부재·실패 placeholder는 예외에서 제외한다. 카드 표면은 personalized Top 10과 동일하게 transparent → `--surface-2`, hover border 없음이다.
- scroll/dialog animation과 focus restoration은 React local state다. Quick Preview 대상만 deep-link 가치가 있어 `/recommendations?preview=<workId>`로 표현할 수 있다.
- Shelf와 card 크기를 미리 예약한다. hover network fetch, autoplay, 스크롤 하이재킹은 없다.

### 2.9 추천 이유 말풍선 (2026-10-01 사용자 결정)

추천 이유는 「근거 있는 추천」을 보이는 제품의 핵심이므로 만화의 吹き出し 문법으로 감싼다. 기본은 정적 표현이며, 2026-10-01 추가 승인으로 랜딩 「例」 lead reason 한 곳만 §6.1의 TextType·정적 종이 그레인을 사용한다.

- 적용처: 관점 선반 Anchor 옆 패널의 lead reason, Quick Preview의 이유 목록, 작품 상세 「あなたとの相性」의 이유, 랜딩 「例」 카드의 lead reason. 추천 Featured 카드는 2026-10-01 사용자 판단으로 말풍선 없이 기존 reason 줄을 유지한다(고정 poster의 hover 크기 전환과 겹치지 않게). 주의할 차이(caution)는 말풍선이 아니라 기존 `--warn` 좌측 보더 블록을 유지해 이유와 구분한다.
- 색: 기본은 2026-10-01 사용자 결정의 밝은 종이 바탕과 어두운 글자다. 이후 상세 리디자인 승인으로 Catalog 상세의 상성 말풍선만 기존 `--surface-2`·`--line`·`--text-strong`의 dark variant를 쓴다. 꼬리도 같은 토큰을 따르며 상세 밖 말풍선은 바꾸지 않는다. 승인된 밝은 토큰을 범위 안에서 재정의해 `--discovery-paper` 바탕, `--discovery-ink` 본문·강조, `--discovery-muted` 보조, `--discovery-line` 보더·꼬리를 쓴다. dark-only 원칙의 세 번째 명시 예외이며 말풍선 밖으로 번지지 않는다. 순백(`--discovery-button`)은 눈부심 때문에 쓰지 않는다.
- 형태: 위 색의 바탕과 1px 보더, `--radius-card` 모서리, 안쪽 여백 `--space-3`/`--space-2`. 꼬리는 같은 바탕·보더의 10px 정사각형을 45° 회전해 근거가 가리키는 표지·제목 쪽에 둔다. 위에 표지·제목이 있으면 위쪽 왼편, Anchor 옆 패널처럼 표지 옆으로 열리는 패널이면 표지 쪽 측면이다(오른쪽으로 열리면 왼쪽 꼬리, 왼쪽으로 열리면 오른쪽 꼬리, `data-expansion-side` 기준). 측면 꼬리가 스크롤 패널에 잘리지 않도록 말풍선 좌우에 8px 여백을 둔다. 꼬리·보더는 장식이며 접근성 트리에 의미를 더하지 않는다.
- 한 카드에 말풍선은 하나다. 이유가 여러 개인 Quick Preview·상세는 하나의 말풍선 안에 기존 목록 구조를 유지한다.
- 근거 작품명 강조(Anchor 패널)와 `data-contribution-summary` 등 기존 근거 대조 속성은 말풍선 안에서 그대로 유지한다.

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

- 적용처: 랜딩 hero 배경(마스크로 우상단→투명 페이드), 빈 상태 배경, DNA 요약 카드 배경, 로딩 skeleton 실루엣(§2.5, 로딩 중 한정). **본문·리스트 뒤에는 쓰지 않는다.**
- `aria-hidden` 불필요(배경 프로퍼티). 인쇄 망점의 시각 인용이며 konocomics 고유 질감으로 일관 사용.

---

참고: 스크린톤 외 질감의 유일한 앱 예외는 랜딩 「例」 말풍선의 정적 종이 그레인이다(2026-10-01 승인). 명시적 opt-in이며 opacity 0.035의 단색 SVG noise를 배경으로만 사용해 글자·표지를 덮지 않는다. 전역·본문·리스트·다른 말풍선에는 확장하지 않는다. §6 G의 광택은 일시적 조명이며 상시 질감이 아니다. 공유용 Manga DNA 카드 이미지(`03` §4)는 앱 표면이 아니므로 이 절의 적용 대상이 아니다.

## 4. 표지 표현

2026-09-11 사용자 선택 시안의 판매순 발견 배너는 흰색 `--discovery-paper`와 어두운 `--discovery-ink`, 보라색 답변 표식·하늘색 제목 밑줄을 쓰는 한정된 밝은 표면이다. 앱 전역의 dark theme은 유지한다. `BookCover`는 사용자가 제공한 투명 3D 책 바탕과 그 앞면에 맞춘 실제 `CoverImage`를 합성한다. 종이 단면·둥근 왼쪽 아래 제본·오른쪽 옆면·그림자는 공통 바탕 이미지에 포함하며 서로 끊기지 않아야 한다. 표지 내용이 없는 공통 3D 바탕만 제품 asset으로 보존하며, 실제 작품 표지는 저장소에 복제하거나 새 글자를 합성하지 않는다. 원본 비율·400→200 fallback을 유지한다. 앞면은 원본 1254×1254 이미지의 네 모서리에 맞춘 고정 투영을 사용하고 다른 비율의 표지는 contain으로 보존한다. 배너에는 장식 애니메이션·배경 gradient·별도 3D 라이브러리를 추가하지 않는다.

공통 바탕은 `/media/book-base-small.webp`(256×256), `book-base-medium.webp`(512×512), `book-base-large.webp`(1024×1024) 세 크기다. 모든 크기의 투명도·구도는 같으며 `srcSet`과 lazy 이미지의 `sizes="auto, 225px"`로 브라우저가 표시 크기와 픽셀 밀도에 맞게 고른다. 다른 위치에서도 같은 `BookCover`와 자산을 재사용하고, CSS `--book-cover-width`로 크기를 조정한다. 원본과 크기별 생성 근거는 `outputs/design/book-base-source-20260911.png`와 `design-qa.md`에 보존한다.

같은 작가 영역은 2026-10-01 후속 사용자 요청에 따라 본문 전체 폭의 `--surface-1`·`--radius-card` 공통 배경을 사용한다. 대표작은 왼쪽 책·오른쪽 문구의 독립 Link이고, 나머지 작품은 같은 배경 안의 작은 선반으로 배치한다. desktop은 좌우 2열, mobile은 위아래이며 대표작 책·문구의 나란한 구도는 유지한다. 「そのほかの作品」 소제목은 생략하고 목록의 접근 이름과 overflow 시 이전/다음·키보드 이동은 유지한다. 공통 배경 자체를 Link로 만들지 않는다. 대표작 최소 높이 desktop 192px/mobile 160px, 책 기준 폭 desktop 112px/mobile 80–96px, 나머지 카드 폭 112px는 기존 spacing 토큰 조합으로 표현한다. 작은 카드의 제목은 14px이며 상위 「{作者}の作品」이 저자 문맥을 제공하므로 카드 안의 저자명은 생략한다. 대표작과 작은 카드 모두 실제 장르와 centrality 2 핵심 테마를 합쳐 기존 순서대로 최대 3개까지 표시한다. 작은 카드는 12px 정적 태그로 줄바꿈하며 태그 데이터가 없으면 해당 행을 만들지 않는다. 태그 2~3개의 줄 수 차이도 공용 카드 전체 높이에 흡수해 hover/focus 영역을 맞춘다. 원본 표지·각 상세 링크를 보존한다. 공통 `BookCover`와 `RankingCard`를 재사용하고 이 배너의 책은 수직 중앙에 둔다. 반복·hover 이동·새 이미지 자산은 추가하지 않는다.

2026-10-01 카드 높이 후속 수정: 공용 `RankingCard`의 일반 ranking/unranked 카드는 제목 2줄 공간을 예약하고 같은 선반 행의 article·Link가 카드 전체 높이를 채운다. 제목 줄 수·저자 길이에 따라 hover/focus 배경과 클릭 영역의 아래쪽 경계가 달라지지 않는다. 표지 크기는 그대로 두고 남는 세로 공간은 카드 아래에 둔다. editorial 표지 전용 링크와 evidence의 3줄 제목 계약은 유지한다.

2026-10-01 상세 선반 후속 승인: 두 상세 캐러셀의 컨테이너는 추천 화면과 같은 `--layout-width-media` 1200px와 공용 좌우 page padding을 사용해 동일 viewport에서 트랙 표시 폭·카드 수를 맞춘다. 「この作品と近い作品」은 개인화 Top 10의 RankingShelf/RankingCard를 순위 없이 재사용한다. 상세 전용 테두리/표면은 두지 않고 overlay 화살표·양끝 fade·유한 트랙을 공유한다. 「違う味わいの作品」은 추천 隠れた候補의 공용 DiscoveryCard를 재사용해 같은 크기·표지 원형→사각 hover/focus morph·reduced-motion 대체를 적용한다. 이 위치도 기존 Discovery 표지 크롭/morph의 사용자 승인 예외에 포함한다. 현재 작품과의 실제 축 차이 설명은 모바일에서도 보이며 미리보기 대신 실제 상세 Link를 제공한다. 캐러셀 하단은 공용 AppShell 패딩을 사용한다.

### 4.1 기본 규칙

- 항상 원본 비율(`object-fit: contain`), 크롭 금지. 프레임 비율은 3:4.3 고정 박스에 contain.
- 소스 크기: thumb `_ex=200x200` / 카드 `_ex=400x400` / 상세 hero `_ex=600x600`. `_ex` 확대는 비공식 동작이므로 `onError`에서 200x200 폴백 필수.
- `loading="lazy"`(뷰포트 첫 화면 제외), `decoding="async"`. 컨테이너에 aspect-ratio를 지정해 CLS 0.
- 추천 1위 표지는 첫 viewport의 LCP 후보이므로 대표 ISBN metadata와 이미지를 eager/high-priority로 요청한다. 나머지 표지 metadata는 각 표지 root가 실제 viewport에 진입할 때만 요청하고, 이미지는 lazy loading을 유지한다. metadata 해석은 화면 전체에서 최대 4개 동시 처리하며 hover/focus를 선행 fetch 신호로 쓰지 않는다.
- 2026-10-01 상세 리디자인 승인: 모든 공용 CoverImage의 loading은 샘플 鈴木さん 커버의 16px 망점·1.2s 이동 시머다. 기존 surface/line/spacing 토큰을 사용하며 성공 시 기존 reveal-step/cinematic duration의 opacity 크로스페이드, 실패 placeholder는 즉시 표시한다. reduced-motion은 망점 이동을 제거하고 짧은 opacity만 허용한다. 실제 load/cache/fallback/lazy 경로를 유지하고 재생 버튼·가짜 지연은 만들지 않는다.

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
- **오버레이 시퀀스(총 1.8초 이내, Motion A):** 최종 2톤 base 위의 별도 고정 300 ink monochrome wordmark overlay만 opacity로 합성한다. 0–400ms에는 base가 계속 보이는 상태에서 overlay opacity가 등장하고, 400–900ms에는 overlay가 1→0으로 사라져 base를 드러낸다. 900–1400ms에는 caption group만 opacity와 `translateY(8px→0)`로 나타난다. font-weight·color·layout·description·CTA는 애니메이션하지 않는다.
- **태그라인 글자 등장(2026-10-01, React Bits SplitText 참고):** 같은 A 안에서 150ms부터 태그라인 글자가 45ms 간격으로 `opacity 0→1` + `translateY(0.55em→0)`, 글자당 700ms `cubic-bezier(0.2,0.7,0.2,1)`로 나타나며 전체가 1.8초 안에 끝난다. 태그라인 문구 단위 줄바꿈(`03` §1)과 레이아웃 폭은 변하지 않는다. 접근성: 태그라인 heading은 전체 문장 하나를 accessible name으로 갖고, 글자 단위 span은 `aria-hidden`이다. 스크린리더가 글자를 하나씩 읽지 않는다. resolved introduction이 처음 그려질 때부터 숨겨진 상태로 시작해야 하며, 이미 보인 글자를 다시 숨기는 깜빡임을 만들지 않는다.
- **font:** marker를 먼저 기록한 뒤 `document.fonts.ready`를 기다린다. API가 없거나 reject하면 최종 정적 상태다.
- **스킵·정리:** pointer/tap/click·keydown·wheel/scroll은 `preventDefault`나 전파 차단 없이 즉시 완료한다. 자연 완료·스킵·`pagehide`·unmount는 controls·timer·pending continuation과 모든 listener를 정리한다. CTA activation은 reveal을 완료하면서도 그대로 이동한다.
- **재진입·reduced-motion:** marker가 이미 있으므로 reload/back/forward에서 재생하지 않는다. reduced-motion도 marker를 소비하고 §6의 대체 원칙을 따른다: overlay는 400ms opacity 크로스페이드만, 태그라인은 글자 분할·이동 없이 문장 전체가 300ms opacity로 나타나고, caption은 이동 없이 opacity만 쓴다. 실행 중 reduce로 바뀌면 남은 시퀀스를 즉시 완료하고 같은 session에서 다시 재생하지 않는다.

### 5.2 Manga DNA reveal — /taste?reveal=1

- **목적:** 온보딩의 보상. "선택한 작품들 → 분석된 취향"의 인과를 몸으로 느끼게 한다(가설 E).
- **시퀀스 (총 ≈2.4s + 사용자 스크롤):**
  1. 0–500ms: 기존 근거 선택의 Anchor grid가 fade-in.
  2. 2026-10-01 최신 HTML 샘플 승인: 상위 취향 목록·직선 강조선과 별도 8축 막대를 하나의 DNA 휠/선택 목록으로 대체한다. 실제 known 축 최대 8개만 사용하고 상위 3축은 accent 계열 gradient와 순위 배지, 나머지는 accent를 낮게 혼합한 표면이다. 휠은 500ms 뒤 조각당 70ms stagger로 scale/opacity를 통해 한 번 나타난다(기존 cinematic 640ms 토큰). 임시 선택은 표면/윤곽선·중앙 레이블만 바꾸며 실제 값은 바꾸지 않는다. DNA 엠블럼 안에만 희미한 정적 동심원을 허용하고 별도 spotlight·pointer tracking·루프는 없다.
  3. 1200ms~: 1200ms는 페이지 전체에 한 번만 적용하는 전역 gate다. gate 전에 뷰포트에 들어온 FactorBar는 gate가 열린 뒤 0→값으로 성장하고, gate 뒤 처음 진입한 화면 밖 막대는 추가 1200ms 지연 없이 즉시 시작한다(막대당 400ms, 섹션 내 stagger 60ms, ease-out, 각 1회).
  4. 헤더의 분석 작품 수는 0에서 실제 정수까지 600ms ease-out으로 count-up한다. 범주 FactorBar의 정성 레이블은 막대 정착 뒤 나타난다. 이전 상위 취향 제목 광택은 휠 통합으로 제거한다. DNA 값 자체는 숫자로 굴리거나 표시하지 않는다(`01` V4·`02` 원칙).
- **URL 소비:** mount에서 `?reveal=1` 판정을 local state/ref에 고정한 즉시 같은 effect에서 query를 `replaceState`로 제거한다. URL 제거 뒤에도 고정된 판정으로 A를 계속하며 query를 in-progress state나 replay token으로 사용하지 않는다.
- **reduced-motion (대체):** 휠은 처음부터 최종 geometry에 160ms opacity만 사용하고 stagger·확대·count-up을 제거한다. 범주 막대도 최종 길이를 유지하며 기존 600ms 이내 opacity 대체를 따른다. spring 세그먼트는 indicator가 이동하지 않고 현재 선택 위치에 표시된다.
- **반복:** reveal은 기존 1회 소비를 유지한다. 일반 진입의 휠은 mount의 최초 viewport 진입에 한 번만 나타나며 재스크롤·선택·보정으로 재생하지 않는다. 범주 FactorBar의 기존 E 진입 채움은 유지한다. 모든 분석값은 positive anchor 출력이며 adjustment로 값·길이·색을 바꾸지 않는다.
- **성능:** 휠 진입은 transform/opacity, 막대는 scaleX다. SVG path는 실제 값/표시 축이 바뀔 때만 변경하고 hover/선택은 geometry를 애니메이션하지 않는다. 휠·목록·대표작·배너·세그먼트의 색·font·radius·간격은 기존 프로젝트 토큰을 사용한다.

### 5.3 작품 상세 블러 표지 배경 (정적 시그니처)

모션 없음. §4.2. "이 작품의 세계에 들어왔다"는 공간감을 만드는 유일한 배경 연출.

---

## 6. 모션 분류 체계 (taxonomy)

모든 애니메이션은 아래 7종 중 하나여야 하며(G는 허용 목록의 위치만), 어디에도 속하지 않으면 구현하지 않는다.

| 분류 | 목적 | 지속 | easing | 도구 | 예 |
|---|---|---|---|---|---|
| A. 1회성 reveal | 시그니처 모먼트 | 400–1800ms | `[0.2,0,0,1]` / spring | Motion | §5.1, §5.2 |
| B. 페이지 진입 | 문맥 전환 인지 | 160ms | ease-out | CSS | 허용된 resolved content만 fade-up 8px. **exit 애니메이션 없음**(내비 블로킹 금지) |
| C. 상태 전환 | 데이터 변화 표현 | 200–240ms | Motion spring (stiffness 350, damping 32) | Motion layout | 추천 카드 제거→백필, tray 재배치, Library 행 이동. 온보딩 collection panel 공개는 같은 목적의 CSS(240ms opacity+8px)이며 B가 아니다 |
| D. 직접 조작 피드백 | 입력 확인 | 80–120ms (확정 스탬프 220ms) | ease-out / 스탬프 spring | CSS / Motion | press scale 0.97, 선택 체크 페이드. 확정 스탬프(2026-10-01): 온보딩 작품 선택·「読みたい」 저장이 확정되는 순간 한 번 scale 1→1.06→1(220ms, 표지 카드는 체크 오버레이만)과 체크 페이드. generic hover Y축 lift는 사용하지 않음. 헤더 브랜드 링크만 press transform 없이 compact opacity 피드백 |
| E. 값 전이 | 수치 변경 표현 | 240ms (진입 채움 600ms) | ease-in-out / ease-out-cubic | CSS transition / Motion | positive anchor 변경 뒤 FactorBar 분석값 갱신, 확신도 레이블 크로스페이드. 진입 채움(2026-10-01): FactorBar가 mount마다 처음 뷰포트에 들어올 때 0→값 1회. 실제 정수 count(분석 작품 수·후보 수)의 count-up 600ms. DNA 축 값은 숫자로 굴리지 않는다. 추천 adjustment는 FactorBar 입력이 아니다. |
| G. 포인터 반응·확정 축하 (2026-10-01) | 만질 수 있는 재질감, 긍정 확정의 보상 | 180–800ms | ease-out / `cubic-bezier(0.2,0.7,0.2,1)` | CSS 변수 + Motion/WAAPI | 아래 「G 허용 목록」만. React Bits GlareHover·Magnet·SpotlightCard·ClickSpark를 참고해 자작한다. 각도를 바꾸는 기울기(TiltedCard 류)는 모든 요소에서 금지 |
| F. 어텐션 | 오류·한도 안내 | 120ms×2 | linear | CSS | tray 흔들림(±4px), 오류 박스 등장. reduced-motion에서는 전체 `--warn` 보더를 정적으로 유지 |

Discovery resolved 표지의 원→직사각형은 D의 사용자 승인 scoped exception이다. `clip-path`만 `--motion-duration-value` 240ms / `--motion-ease-value`로 전환하고 카드 표면색은 personalized Top 10과 같은 240ms / `--motion-ease-direct`를 쓴다. 반복·autoplay·layout 변화가 없으며 reduced motion에서는 두 상태를 즉시 바꾼다.

관점 선반(Anchor) 옆 패널은 2026-09-10 사용자 승인 D 예외다. `ExpandableMediaCard`는 200ms hover 의도 확인 또는 keyboard focus-visible 진입 뒤 article `width`를 기존 폭에서 `--control-min-size × 6`만큼 `--motion-duration-value` 240ms / `--motion-ease-signature`로 늘린다. 형제 카드가 같은 폭만큼 이동해 다음 표지를 가리지 않는다. 하나의 열린 카드를 다음 카드로 넘길 때는 기존 폭 축소와 새 폭 확장을 같은 타이밍으로 진행하며, 뒤쪽 카드가 공간을 넘겨받을 때는 표지를 오른쪽에 고정한다. 확장량은 정수 CSS 픽셀로 보간해 두 카드의 합산 폭과 후속 형제 위치가 반올림 때문에 흔들리지 않게 한다. 표지 DOM·원본 비율·카드 높이·텍스트 크기는 유지한다. 패널은 고정 폭이며 article의 overflow clipping으로 드러난다. 단독 진입과 카드 간 전환 모두 확장된 카드가 `scroll-padding` 안쪽의 흐림 없는 영역에 들어오도록 폭 전환과 함께 가로 위치를 보정하며, 사용자 직접 스크롤을 덮어쓰지 않는다. 확장 패널 하단에는 기존 Quick Preview와 같은 읽기 액션을 고정하고, 긴 근거·소개만 위쪽 영역에서 스크롤한다. 확장 불가 환경은 제목 아래 Quick Preview와 작품 상세 Link를 제공한다. reduced-motion은 최종 상태를 즉시 표시한다. 이전 overlay 및 고정 212px 높이 안은 사용하지 않는다.

### 6.1 샘플 효과의 제품 적용 (2026-10-01 사용자 승인)

바닐라 샘플의 느낌을 기존 React·Motion·CSS로 구현한다. 샘플의 고정 문장·수치·가짜 로딩 시간은 가져오지 않는다. 아래는 기존 정적 표면·B allowlist·프로퍼티 제한의 명시적 예외다.

| 효과 | 위치·트리거·일반 모드 | reduced-motion·기본값 |
|---|---|---|
| AnimatedList (B 한정 예외) | `/recommendations` 최초 resolved Featured 목록, route mount당 1회. 실제 보이는 canonical 카드 최대 4장만 240ms opacity 0.7→1·Y 8→0, 60ms stagger. clone·다른 선반·필터 변경·스크롤 왕복은 재생하지 않고 기존 C 백필은 유지 | 이동·stagger 없이 160ms opacity. 실행 중 reduce로 바뀌면 즉시 완료. JS 실패 시 완전히 보이는 목록 |
| TextType (랜딩 A의 예시 설명) | 일반 랜딩 「例」 lead reason, mount당 1회. 실제 `contributions[]` 문장을 자소 단위로 최대 1100ms에 표시. 줄·공간을 처음부터 예약하고 작품명 강조 유지. 커서·삭제·반복 없음 | 전체 문장 즉시 표시. 접근성에는 항상 완성 문장 하나. `?landing=1`은 정적 |
| DNA 휠 (DNA A/E, 최신 샘플) | §5.2의 실제 축 원형 요약. 이전 SVG 직선 강조선 UI를 대체하며 새로운 축/수치는 만들지 않는다. 최초 진입 scale/opacity만 1회, 휠/목록 선택 상태 동기화 | 최종 geometry + 160ms opacity, 선택 indicator 이동 없음 |
| 띠지 (B 한정 예외) | 랜딩 Hero와 사용법 사이의 실제 사용 순서, 첫 viewport 진입 1회. 640ms opacity 0.7→1·X −16→0 후 정지. 줄바꿈 허용, 스크롤 속도 연동·무한 marquee·복제 문구 없음 | 정적 전체 문구. `?landing=1`도 정적. native scroll 유지 |
| 부족 선택 안내 (F) | STEP 1의 `次へ` 클릭·Enter·Space. 최소 개수 미달이면 진행·저장 없이 기존 tray ±4px/240ms 흔들림과 부족 개수 live 안내. 부족할 때도 안내를 받을 수 있는 버튼이며 실제 저장 중에만 disabled. 첫 등록 5개·add mode 1개 유지 | 정적 warn 보더·동일 부족 개수 안내 |
| spring (D 한정 예외) | 공용 `SegmentedControl`을 Library 상태 탭·Catalog 상세 `感想`에 적용하고 공용 Switch도 같은 Motion spring(stiffness 350, damping 24)을 사용. 한 중립 track 안의 채워진 accent 인디케이터와 `--on-accent` 선택 글자. 선택 배경·thumb만 실제 layout을 따라 이동하며 글자·control은 변형하지 않는다. 상세는 실제 저장된 감상 사이에서 이동하고 같은 감상을 다시 누르면 감상만 해제·인디케이터 제거 | 즉시 최종 선택. 최초 mount도 이동 없음. 실행 중 OS 설정 변경에도 즉시 반영. 키보드·focus·busy 유지 |
| shimmer | 표지는 이후 사용자 지정한 §4.1 공용 CoverShimmer(16px 망점 이동, 1.2s·성공 크로스페이드). 다른 추천·공유 loading은 기존 §2.5를 유지. 가짜 지연·재생 버튼 없음 | 표지는 이동 없는 망점·짧은 opacity, 다른 skeleton은 기존 1.6s opacity |
| StarBorder (DNA A의 다음 행동 안내) | reveal의 `おすすめを見る` 한 곳. 2400ms 뒤 accent 계열 gradient 테두리가 900ms 한 번 지나가고 종료. CTA는 처음부터 사용 가능. 다른 CTA·공유로 확장하지 않음 | 정적 테두리. focus ring·누를 영역 유지. 내부 장식만 transform/opacity |
| Noise | 랜딩 「例」 말풍선에만 §3.2 정적 단색 종이 질감 opt-in | 동일 정적 질감. 추가 설정·저장 상태 없음 |

상세 리디자인 후 감상 세그먼트는 読んだ일 때만 공개하며 다른 상태에서도 저장된 reaction은 보존한다. 공개는 콘텐츠 실제 높이+opacity 1회 spring이고 reduced-motion은 높이 이동 없이 opacity만이다.

공용 세그먼트의 anatomy는 샘플처럼 track 1개·4px 안쪽 여백·같은 행에서 균등하게 늘어나는 segment·채워진 인디케이터 1개다. track은 `--surface-2`와 1px `--line`, radius는 기존 control에서 파생한 10px/7px다. 개별 segment에 선택 보더·별도 칩 배경을 만들지 않는다. Library만 내용에 따라 wrap하며 탭 semantics·ID·`aria-controls`·URL을 보존한다. 상세 감상은 4개가 한 줄이고 그룹 label은 track 밖에 둔다. Switch는 샘플의 46×26 track·20px 밝은 thumb·3px inset이며 on/off 모두 같은 밝은 thumb다. 공용 wrapper가 크기·색·spring·reduced-motion을 소유하고 feature는 option·값·선택 callback만 제공한다. 44px 조작 타깃은 유지한다.

추천 순서·`contributions[]`·부족 데이터 의미·검증·저장은 바꾸지 않는다. 시그니처 모먼트는 기존 세 곳이며, 동시 효과 family 최대 2개·로딩 외 상시 루프 0개를 유지한다. C 및 위 D spring의 layout 소유 컴포넌트만 local `domMax`를 허용한다. 다른 설정·Library 표면은 조용하게 유지한다.

### 6.2 G 허용 목록

2026-10-01 Taste 샘플의 radio 세그먼트도 같은 공용 track/indicator를 쓴다. positive 선택은 accent/on-accent, auto·less는 surface/text, exclude는 기존 경고 토큰을 사용한다. 「おすすめを調整」과 편집 범주 제목 옆 reset은 44px quiet icon button이며 범위가 있는 접근 이름과 tooltip을 가진다. 자동뿐인 범위는 disabled이고 펼침 trigger와 독립된다. reset은 같은 선택 indicator·저장 live message로 피드백하며 추가 모션을 만들지 않는다.

이 밖의 위치·효과는 구현하지 않는다.

| 효과 | 위치 | 한도 | 입력 조건 |
|---|---|---|---|
| 광택 (GlareHover 참고) | 추천 Featured 카드, 랜딩 「例」 카드 | 카드의 각도·위치·크기는 바꾸지 않는다. 포인터 위치 radial `--text-strong` 14%, 진입·이탈 opacity 250ms | fine pointer + hover만. 터치·펜은 D press만. Featured의 기존 hover geometry 전환과 같은 family로 세어 합성 2개를 넘지 않는다 |
| 마그넷 (Magnet 참고) | 랜딩 hero·마무리 CTA, /taste reveal의 「おすすめを見る」 | 포인터 거리 비례 이동 최대 x 10px·y 6px, 이탈 180ms 복귀. hover 그림자는 기존 `--shadow-raised` 1단 | fine pointer + hover만. 클릭 영역·focus ring 위치는 이동하지 않는 래퍼 기준 |
| 확정 스파크 (ClickSpark 참고) | 랜딩 CTA 클릭, 「読みたい」 저장 성공, 온보딩 작품 선택 성공 | 입자 최대 12개, `--accent` 계열, 36–90px 방사, 480–800ms, `aria-hidden`·`pointer-events: none`, 저장 성공 뒤에만 발화 | 모든 입력. 실패·취소·「読んだ」·「興味なし」·「今日はパス」·삭제처럼 부정·교정 액션에는 쓰지 않는다 |

상세 「あなたとの相性」의 스포트라이트는 2026-10-01 후속 사용자 요청으로 폐기했다. 포인터 추적 조명·전용 overlay를 만들지 않는다.

- 포인터 좌표는 `pointermove`에서 rAF로 묶어 CSS 변수(`--light-x`, `--magnet-x` 등)에 직접 쓰고 React state로 다시 렌더하지 않는다. 좌표를 따라가는 radial 배경 갱신은 보간 애니메이션이 아니며, 보간은 transform·opacity만 한다. `will-change`는 hover 중에만 둔다.
- dialog·sheet·panel·설정·Library·온보딩 STEP 2와 텍스트 입력 영역에는 G를 쓰지 않는다(§9).

전역 규칙:

- **상시 자동 루프 애니메이션 0개.** 사용자가 직접 조작하는 Featured의 위치 순환은 autoplay가 아니다. skeleton 시머·펄스만 예외(로딩 중 한정). 광택 sweep(§5.2)은 진입당 1회로 끝나며 반복하지 않는다.
- 한 인터랙션이 동시에 발화하는 **합성 효과 family**는 최대 2개다(예: 카드 제거/layout + 백필). DNA의 여러 카드·막대 instance stagger는 하나의 A family로 센다.
- transform/opacity 외 프로퍼티 애니메이션 금지(height 축소는 추천 카드 제거 시에 허용, contain 처리). 2026-10-01 상세 리디자인의 감상 공개 height와 공통 커버 loading 망점 background-position은 사용자 승인 한정 예외다. 위 Anchor Shelf의 article width는 예외다. 단, 랜딩 `ShowcaseCard` featured 핸드오프는 article `width`만 11rem↔14rem으로 240ms(`--motion-duration-value`, `--motion-ease-value`) 보간하고 reduced-motion에서는 즉시 완료한다. 추천 featured card는 고정 344×448px article 안에서 표지 stage의 flex 잔여 높이, reason `max-height`, action rail `height`·`margin`을 400ms(`--motion-duration-reveal-step`, `--motion-ease-direct`)로 함께 보간할 수 있다. 이 예외는 형제 위치 불변, overflow clipping, 최대 3줄 reason, 44px rail, coarse pointer 상시 최종 상태, reduced-motion 즉시 완료를 모두 만족해야 한다. 표지 DOM·텍스트/control 크기는 보간하지 않는다. color·background·border·box-shadow·font-weight 상태는 보간하지 않고 즉시 바꾼다.
- 자동재생 캐러셀·스크롤 하이재킹·패럴랙스·페이지 넘김 효과·효과음 문자 장식과 generic hover Y축 lift를 금지한다. 커서 추적은 G 허용 목록의 광택·마그넷만 허용하며, 각도를 바꾸는 기울기는 어떤 요소에도 쓰지 않는다. 모바일에서 hover 의존 정보 금지.
- B의 allowlist는 `/onboarding` Step 1 resolved content(첫 등록·add mode), reveal 요청으로 시작하지 않은 ordinary `/taste`, 유효한 `/works/[workId]` resolved Catalog 상세, `found`인 `/works/external` resolved 상세와 §6.1의 최초 Featured 카드·랜딩 띠지다. Catalog는 `workId`, external은 external ID가 바뀐 새 route mount에서 다시 실행할 수 있다.
- §6.1의 두 한정 예외 외에는 B를 landing, A로 시작한 `/taste`, `/recommendations`, `/library`, `/settings`, onboarding Step 2, loading·hydration/redirect guard·skeleton·empty·invalid-link·local-missing·corrupt·unavailable·error, dialog·modal·drawer·panel·sheet·feedback surface에 적용하지 않는다. query cleanup·local state 변경·onboarding step 변경·dialog open/close·BFCache resume도 replay trigger가 아니다.
- B는 AppShell/global layout이 아니라 eligible resolved-content root에만 적용한다. CSS 기본값은 최종 위치에서 완전히 보이는 상태이며 keyframe은 `prefers-reduced-motion: no-preference` 안에만 둔다. 8px 이동 중에도 opacity 0으로 만들어 콘텐츠를 완전히 숨기지 않고, 실패 시 최종 상태가 남는다.
- E와 F는 CSS가 소유한다. ordinary FactorBar E는 static CSS 기본값을 target `scaleX`로 두고 underlying analysis 값 변경 시 delay 0 / 240ms만 적용한다. 추천 adjustment의 직접 피드백은 D의 선택 indicator/text와 저장 live message가 소유하며 FactorBar success highlight를 만들지 않는다. F 흔들림도 CSS만 사용한다.
- `prefers-reduced-motion: reduce` — **대체 원칙(2026-10-01 사용자 결정):** reduce는 모션을 없애는 스위치가 아니라 멀미를 유발하는 움직임을 의미가 같은 조용한 변화로 바꾸는 설정이다. 이동·확대/축소·회전·기울기·패럴랙스·포인터 추적·입자·반복은 제거하고, 상태와 인과를 전하는 opacity·색 변화는 짧게 남긴다. 정보·상태·focus·live message는 일반 모드와 동일하다.

  | 분류 | reduce에서의 대체 |
  |---|---|
  | A 1회 reveal | 같은 순서를 opacity만으로 총 600ms 이내(§5.1·§5.2). marker는 소비한다. 실행 중 reduce로 바뀌면 즉시 완료 |
  | B 페이지 진입 | 8px 이동 없이 160ms opacity만 |
  | C 상태 전환 | `layout={false}`. 제거·백필은 이동 없이 160ms opacity 크로스페이드, 순서·focus·live message는 즉시 반영 |
  | D 직접 조작 | scale·스탬프 제거, 선택 체크·색 상태는 120ms opacity로 유지. 추천 featured card와 Anchor 옆 패널은 현재 pointer/focus 상태의 최종 geometry를 즉시 표시 |
  | E 값 전이 | 진입 채움·count-up 없이 최종 값을 160ms opacity로 표시. 값 변경은 즉시 반영 |
  | F 어텐션 | 흔들림 대신 정적 `--warn` 전체 보더와 오류·한도 text |
  | G 포인터 반응 | 광택·마그넷·스포트라이트·스파크 없음. 광택 sweep 없음. hover의 기존 표면색 변화는 유지 |
  | skeleton | 띠 이동 없이 정적 망점 실루엣 + 1.6s opacity 0.7↔1 |
  | Shelf 버튼 scroll | `auto` |
  | 온보딩 collection panel | 이동 없이 160ms opacity |

## 7. 서드파티 시각 라이브러리 판정

| 라이브러리 | 판정 | 근거·제약 |
|---|---|---|
| **Motion** (`motion`) | **채택** | 분류 A·C와 §6.1 D spring 전담. 기본은 `LazyMotion` + `domAnimation`; C 및 D spring의 실제 `layout` 소유 컴포넌트만 local `domMax`를 사용한다. 추천은 목록 owner만 감싸고 페이지·사이드 패널·control·error·dialog까지 올리지 않는다. reduced-motion에서는 해당 element의 `layout`을 `false`로 두고 공유 `layoutId`도 제거한다. 유일한 애니메이션 의존성 |
| React Bits | **레퍼런스로만 채택(2026-10-01)** | 코드·의존성은 들이지 않는다. 느낌의 기준으로만 쓰고 Motion·CSS로 자작한다. 참고한 효과: SplitText(§5.1), ShinyText(§5.2 1회 sweep), CountUp(정수 count만, E), GlareHover·Magnet·ClickSpark(G). TiltedCard는 2026-10-01 사용자 결정으로 쓰지 않는다. WebGL·GSAP·물리 엔진 기반 효과(Aurora·Galaxy·Particles 등)는 참고 대상이 아니다 |
| NumberFlow | **미채택** | 서수 데이터에 숫자 굴림은 거짓 정밀도(`01` V4) |
| Embla Carousel | **미채택** | Shelf는 CSS scroll-snap + 버튼으로 구현(`01` V5) |
| AutoAnimate | **미채택** | Motion layout으로 커버 |
| GSAP / Lottie / three.js | **미채택** | 요구 없음 |

Shelf 구현 계약(캐러셀 대체): `overflow-x: auto` + CSS scroll-snap + 카드 `scroll-snap-align: start` + 데스크톱용 이전/다음 버튼(`scrollBy`, reduced-motion 시 instant) + `scrollbar-width: none`. overlay Shelf의 viewport와 fade는 같은 폭의 좌우 negative margin/padding으로 콘텐츠 shell 바깥 gutter에 두되 첫 카드 시작선과 문서 가로 overflow는 바꾸지 않는다. Featured만 3-copy pointer/touch 루프를 쓰고 clone은 `aria-hidden`·`inert`이며 image demand/ref를 소유하지 않는다. 키보드는 canonical 카드 간 Tab/화살표이고 끝에서 wrap하지 않는다. 나머지 Shelf는 끝에서 disabled·비순환이다.

## 8. 성능 예산

### 8.1 판정값

- 추천 페이지 초기 JS는 **250,000 bytes gzip 미만**이다. modern Chromium이 cold direct `/recommendations` 진입에서 사용자 입력 전 `networkidle`까지 실제 요청한 unique same-origin JavaScript를 대상으로 한다. URL을 TanStack Start/Vite build manifest의 emitted file에 대응해 dedupe하고 exact file gzip level 9 합계를 낸다. interaction-only chunk는 제외하고 inline executable script와 initial HTML bytes는 별도 보고한다.
- LCP: 랜딩 resolved introduction과 추천 화면에서 브라우저가 실제로 선택한 가장 큰 정당한 콘텐츠 후보의 cold mobile 5회 중앙값은 각각 < 3.5s다. 가시적인 태그라인·설명문을 숨기거나 축소하거나, mobile 96px 표지를 확대해 특정 element를 LCP로 강제하지 않는다. 랜딩 첫 로고 후보 시각과 추천 1위 표지의 request·삽입·load 시각은 LCP와 별도로 기록하고, 1위 표지는 eager/high-priority 계약을 유지한다.
- CLS < 0.05: 같은 cold mobile 5회 중앙값. 표지 aspect-ratio 고정과 폰트 메트릭 폴백을 유지한다.
- 60fps는 A/C 목표다. frozen local 4× CPU 환경에서 추천 C 제거·layout·백필의 median effective FPS가 30 미만이면 그 C owner의 layout motion을 비활성화한 뒤 다시 판정한다. runtime benchmark나 임의 기기 class는 만들지 않는다.
- skeleton pulse는 정확히 1.2s이며 loading 중 한정이다. 대형 hero 블러 배경은 화면당 1개다. 추천 featured card의 같은-source local blur는 색 구분을 위한 한정 예외이며 visible card 주변에서만 래스터되고 `will-change`·별도 이미지 요청·palette 연산을 추가하지 않는다.

### 8.2 재현 가능한 production-local 계측

- `pnpm build` 뒤 `pnpm start` production server와 현재 Playwright Chromium을 사용한다. dev server나 build summary, Lighthouse 수치로 아래 직접 계측을 대체하지 않는다.
- authoritative local mobile profile은 390×844, DPR 3, touch/mobile, CDP CPU 4× slowdown, 150ms RTT, 1.6Mbit/s down, 0.75Mbit/s up이다. 독립 browser context 5개에서 HTTP cache를 비운 cold run을 보존하고 중앙값으로 판정한다. 필요한 usable profile/recommendation state는 test-only route나 direct IndexedDB 주입 없이 실제 제품 flow로 만든 뒤 IndexedDB만 유지한다. Slice 11에서는 service worker를 우회한다.
- LCP·CLS `PerformanceObserver`는 app script와 navigation 전에 주입하고 buffered `largest-contentful-paint`, `layout-shift`(`hadRecentInput === false`)를 고정 관측 창까지 수집한다. 관측 중 사용자 입력은 하지 않는다.
- 1위 표지 provider 변동을 고정 fixture로 격리할 때도 실제 `CoverImage` 경로를 통과해야 한다. fulfilled bytes에 CDP throttle이 적용됨을 증명하거나 fixture 응답 자체가 위 latency·transfer profile을 재현해야 하며, 즉시 fulfill된 이미지를 mobile LCP gate로 쓰지 않는다. unmocked run은 진단으로 별도 기록할 수 있다.
- 각 run의 build identity·Node/package/browser version, CDP 조건, raw LCP/CLS, rAF frame interval/FPS, requested JS URL→emitted file→raw/gzip bytes와 total을 machine-readable artifact로 보존한다. production-local 결과는 배포·실기기 성능 증거가 아니며 중급 Android 열·프레임, real cellular/provider LCP와 iOS/Android 설치 모드는 별도 수동 검증 한계로 남긴다.

## 9. 조용한 표면 선언

다음 화면·영역에는 시그니처·B 진입·불필요한 설명형 장식을 **의도적으로 두지 않는다**: 랜딩의 A 외 별도 B, Library의 기능 배너 외 장식, 설정, 온보딩 STEP 2(불호 입력은 감정적으로 중립해야 함), 모든 dialog·panel·sheet. §2.5 기능 배너와 §6.1의 랜딩 띠지·최초 Featured 카드·Library 탭 및 설정 Switch의 D spring만 명시적 예외다. 추천 피드는 §6.1의 첫 Featured 표시, §2.8 고정 poster 직접 피드백, C 제거/백필, §6 G 허용 목록(Featured 광택, 「読みたい」 확정 스파크)을 허용한다. Quick Preview와 Library sheet/panel entry는 최종 상태로 즉시 연다. cover/image의 실제 loading→성공 크로스페이드는 §4.1의 공용 표지 예외를 따른다.
