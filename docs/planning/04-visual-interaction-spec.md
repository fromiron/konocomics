# 04 — 비주얼·인터랙션 사양 (Visual & Interaction Spec)

> 코딩 에이전트가 시각적 판단을 새로 내리지 않도록 하는 구현 계약.
> 원칙: **표지가 항상 주인공이고, UI는 종이다.** 시그니처 모먼트는 3곳뿐이며 나머지 표면은 의도적으로 조용하다.

---

## 1. 아트 디렉션 — "종이와 잉크 (紙とインク)"

만화라는 매체의 물성 — 인쇄된 종이, 검은 잉크, 스크린톤(망점), 그리고 그 위에서 유일하게 색을 가진 표지 — 을 UI 언어로 삼는다. 범용 SaaS의 글래스모피즘·그라데이션·오로라를 쓰지 않는다.

- **브랜드 인격:** 안목 있는 서점 점원. 조용하고 정확하며, 근거를 갖고 말한다. 과장·호들갑 없음.
- **색의 위계:** 화면에서 가장 채도 높은 것은 항상 만화 표지여야 한다. UI 자체는 무채색 + accent 1색.
- **밀도:** 정보는 밀도 있게, 장식은 희박하게. 여백은 종이의 여백처럼.

## 2. 디자인 토큰

### 2.1 색 (라이트 테마 — MVP 기준. 다크는 폴리시 슬라이스에서 동일 시맨틱 토큰으로 추가)

```css
:root {
  color-scheme: light;
  --paper:        oklch(0.975 0.005 90);  /* 따뜻한 종이 흰색 ≈ #F9F7F4 */
  --paper-raised: oklch(1 0 0);           /* 카드 표면 #FFFFFF */
  --ink:          oklch(0.22 0.01 90);    /* 본문 잉크 ≈ #26241F */
  --ink-strong:   oklch(0.14 0.01 90);    /* 제목 */
  --ink-muted:    oklch(0.50 0.01 90);    /* 보조 텍스트 */
  --line:         oklch(0.88 0.005 90);   /* 헤어라인 보더 */
  --accent:       oklch(0.60 0.19 33);    /* 주홍(朱色) ≈ #D9482B — konomi 색 */
  --accent-soft:  oklch(0.95 0.03 33);    /* accent 배경 틴트 */
  --warn:         oklch(0.55 0.15 60);    /* 除外 칩 등 */
  --focus-ring:   var(--accent);
}
```

규칙:

- `--accent`는 **의미를 가질 때만** 사용: konomi(로고의 kono·mi), 상위 취향 강조, 주요 CTA, 선택 상태, focus ring. 장식적 사용 금지.
- 본문 대비: ink/paper ≥ 12:1, muted/paper ≥ 4.6:1 (WCAG AA 확보). accent 위 텍스트는 white로 4.5:1 이상 유지.
- 그라데이션 배경 금지. 유일한 예외는 표지 블러 배경(§4.2)과 스크린톤(§3.4).

### 2.2 타이포그래피

| 역할 | 폰트 | 사용처 |
|---|---|---|
| 워드마크·디스플레이(라틴) | **Space Grotesk** (300 / 700) | 로고, 랜딩 hero, "Manga DNA" 표제 |
| UI·본문(일본어) | **Noto Sans JP** (400 / 500 / 700) | 전체 UI. 라틴 폴백 겸용 |

- 로고 조판: `kono`(700, accent) `co`(300, ink-muted) `mi`(700, accent) `cs`(300, ink-muted). letter-spacing −0.01em. 전체 단어가 한 단어로 읽히는 크기 대비 유지.
- 타입 스케일(모바일 기준, 데스크톱 +1단): 12 / 14(본문) / 16(강조 본문) / 20(섹션) / 28(페이지 h1) / 40(랜딩 hero). 행간 본문 1.7 (일본어), 표제 1.3.
- 숫자·데이터 레이블은 `font-feature-settings: "tnum"` (별도 모노 폰트 도입하지 않음).
- 폰트는 `next/font`로 self-host, `display: swap`, 서브셋 지정. CLS 방지를 위해 fallback 메트릭 조정 사용.

### 2.3 표면·보더·그림자·radius

- 배경 층 2단뿐: `--paper`(페이지) / `--paper-raised`(카드·시트). 3단 이상 겹치지 않는다.
- 카드: 1px `--line` 보더 + radius **8px**. 그림자는 기본 없음. hover·시트 상승 시에만 `0 4px 16px oklch(0 0 0 / 0.08)`.
- 표지: radius **4px** (인쇄물답게 작게) + 1px `oklch(0 0 0 / 0.1)` 보더.
- 버튼·칩: radius 8px(버튼) / 999px(칩). 주요 CTA만 accent 채움, 나머지는 outline/ghost.

### 2.4 간격·레이아웃 리듬

- 4px 기본 단위. 화면 좌우 패딩 mobile 16 / desktop 24. 섹션 간 32~48.
- 콘텐츠 최대폭: 추천 720 / DNA 960 / 상세 1040 / 설정 640.
- 구분선은 그림자 대신 1px `--line` 헤어라인 사용(인쇄물의 괘선 감각).

### 2.5 인터랙션 상태 (전 컴포넌트 공통)

- hover(포인터만): 배경 2% 어둡게 or 표지 lift(§6-D). 120ms.
- active/press: scale 0.97, 80ms.
- focus-visible: 2px accent ring + 2px offset. **마우스 클릭에는 링 미표시.**
- disabled: opacity 0.45 + `cursor: not-allowed`. 색만으로 구분하지 않고 레이블 유지.
- selected: accent 보더 + 체크 오버레이(표지 카드) / accent 채움(칩).
- skeleton: `--line` 톤 펄스(1.2s), 카드 실루엣 그대로. 스피너는 전역 치명 오류 재시도에만.
- empty state: 스크린톤 원 안에 아이콘 + 1줄 안내 + 1개 액션. 일러스트 신규 제작 없음.
- error: `--warn` 좌측 보더의 인라인 박스. 토스트는 성공 알림에만.

---

## 3. 배경과 질감

### 3.1 원칙

애니메이션 배경 없음. WebGL/Canvas 없음. 질감은 정적 CSS로만.

### 3.2 스크린톤(망점) 텍스처 — Aurora/Dot Grid 대체

```css
.screentone {
  background-image: radial-gradient(oklch(0.22 0.01 90 / 0.05) 1px, transparent 1px);
  background-size: 8px 8px;
}
```

- 적용처: 랜딩 hero 배경(마스크로 우상단→투명 페이드), 빈 상태 배경, DNA 요약 카드 배경. **본문·리스트 뒤에는 쓰지 않는다.**
- `aria-hidden` 불필요(배경 프로퍼티). 인쇄 망점의 시각 인용이며 KonoComics 고유 질감으로 일관 사용.

---

참고: 스크린톤 외의 질감·패턴·노이즈 텍스처는 도입하지 않는다.

## 4. 표지 표현

### 4.1 기본 규칙

- 항상 원본 비율(`object-fit: contain`), 크롭 금지. 프레임 비율은 3:4.3 고정 박스에 contain.
- 소스 크기: thumb `_ex=200x200` / 카드 `_ex=400x400` / 상세 hero `_ex=600x600`. `_ex` 확대는 비공식 동작이므로 `onError`에서 200x200 폴백 필수.
- `loading="lazy"`(뷰포트 첫 화면 제외), `decoding="async"`. 컨테이너에 aspect-ratio를 지정해 CLS 0.

### 4.2 블러 배경 (작품 상세 시그니처)

```html
<div class="relative isolate overflow-hidden">
  <img aria-hidden="true" alt="" src={coverUrl}
       class="absolute inset-0 size-full scale-125 object-cover opacity-30 blur-3xl" />
  <!-- 위에 paper 오버레이 60%를 얹어 텍스트 대비 확보 -->
  <img src={coverUrl} alt="{title} 表紙" class="relative h-auto w-full object-contain" />
</div>
```

- 동일 URL 재사용(추가 요청 없음). 정적 — 패럴랙스·모션 없음. 텍스트가 올라가는 영역은 paper 오버레이로 대비 4.5:1 보장.

### 4.3 Placeholder 표지 (이미지 실패·부재)

paper-raised 배경 + 1px 보더 + 세로쓰기 느낌의 중앙 제목 텍스트(2줄 클램프, ink-muted) + 좌하단 저자. 스크린톤 12px 패턴을 우상단 모서리에만. 로딩 중에는 skeleton, 실패 확정 후 placeholder.

---

## 5. 시그니처 모먼트 (전체 3개 — 추가 금지)

### 5.1 konomi 로고 reveal — 랜딩

- **목적:** 브랜드 기믹이 곧 제품 설명("숨은 취향의 발견")임을 10초 안에 체험시킨다.
- **위치·트리거:** 랜딩 hero, 마운트 시 자동 1회. `sessionStorage.logoRevealed` 가드. 반복 없음.
- **시퀀스 (총 ≈1.8s, Motion 사용):**
  1. 0–400ms: `konocomics` 전체가 ink 300 웨이트로 페이드 인.
  2. 400–900ms: `kono`·`mi`가 웨이트 300→700, 색 ink→accent로 전이(variable font 축 + color transition, ease `[0.2, 0, 0, 1]`).
  3. 900–1400ms: 로고 아래에 `好み`가 fade-up(8px, 400ms) — 소문자 캡션 「kono + mi = このみ」.
  4. 1400–1800ms: 캡션 유지, 태그라인·CTA fade-up(이미 조작 가능했던 요소의 시각 등장).
- **스킵:** 탭/클릭/스크롤/키 입력 시 즉시 최종 상태로 점프.
- **reduced-motion:** 시퀀스 생략. 처음부터 2톤 로고 + `好み` 캡션 정적 표시(정보 손실 없음).
- **성능:** 폰트 로드 완료 후 시작(FOUT 중 재생 금지). JS 실패 시 CSS 최종 상태가 기본값.

### 5.2 Manga DNA reveal — /taste?reveal=1

- **목적:** 온보딩의 보상. "선택한 작품들 → 분석된 취향"의 인과를 몸으로 느끼게 한다(가설 E).
- **시퀀스 (총 ≈2.4s + 사용자 스크롤):**
  1. 0–500ms: 선택한 Anchor 표지 썸네일들이 상단에 가로로 정렬되어 fade-in.
  2. 500–1200ms: 상위 취향 3개 요약 카드가 순서대로 fade-up(간격 180ms), 각 카드의 취향 레이블에 accent 밑줄이 좌→우로 그려짐(300ms).
  3. 1200ms~: 그룹 섹션의 FactorBar들이 뷰포트 진입 시 0→값으로 성장(막대당 400ms, 섹션 내 stagger 60ms, ease-out). 화면 밖 막대는 스크롤로 진입할 때 재생(각 1회).
- **reduced-motion:** 전부 생략, 완성 상태 즉시 표시.
- **반복:** reveal 모드 1회. 상시 /taste에서는 막대가 정적(보정 변경 시 값 전이 240ms만).
- **성능:** transform/opacity만 사용. 막대는 `scaleX` transform(레이아웃 리플로우 금지).

### 5.3 작품 상세 블러 표지 배경 (정적 시그니처)

모션 없음. §4.2. "이 작품의 세계에 들어왔다"는 공간감을 만드는 유일한 배경 연출.

---

## 6. 모션 분류 체계 (taxonomy)

모든 애니메이션은 아래 6종 중 하나여야 하며, 어디에도 속하지 않으면 구현하지 않는다.

| 분류 | 목적 | 지속 | easing | 도구 | 예 |
|---|---|---|---|---|---|
| A. 1회성 reveal | 시그니처 모먼트 | 400–1800ms | `[0.2,0,0,1]` / spring | Motion | §5.1, §5.2 |
| B. 페이지 진입 | 문맥 전환 인지 | 160ms | ease-out | CSS | 콘텐츠 fade-up 8px. **exit 애니메이션 없음**(내비 블로킹 금지) |
| C. 상태 전환 | 데이터 변화 표현 | 200–240ms | Motion spring (stiffness 350, damping 32) | Motion layout | 추천 카드 제거→백필, tray 재배치, Library 행 이동 |
| D. 직접 조작 피드백 | 입력 확인 | 80–120ms | ease-out | CSS | press scale 0.97, 선택 체크 페이드, hover lift 2px |
| E. 값 전이 | 수치 변경 표현 | 240ms | ease-in-out | CSS transition | FactorBar 보정 반영, 확신도 레이블 크로스페이드 |
| F. 어텐션 | 오류·한도 안내 | 120ms×2 | linear | CSS | tray 흔들림(±4px), 오류 박스 등장 |

전역 규칙:

- **상시(무한 루프) 애니메이션 0개.** skeleton 펄스만 예외(로딩 중 한정).
- 한 인터랙션이 동시에 발화하는 애니메이션 최대 2개(예: 카드 제거 + 백필).
- transform/opacity 외 프로퍼티 애니메이션 금지(height 축소는 카드 제거 시에만 허용, contain 처리).
- 자동재생 캐러셀·스크롤 하이재킹·패럴랙스·커서 추적 효과 금지. 모바일에서 hover 의존 정보 금지(D의 hover lift는 장식이므로 무손실).
- `prefers-reduced-motion: reduce`: A·B·C 전부 무모션 즉시 완료, D는 opacity 변화만, E는 즉시 값 반영, F는 유지(오류 인지 목적, 흔들림→보더 강조로 대체). Motion의 `useReducedMotion`으로 일괄 처리, CSS는 미디어 쿼리.

## 7. 서드파티 시각 라이브러리 판정

| 라이브러리 | 판정 | 근거·제약 |
|---|---|---|
| **Motion** (`motion`) | **채택** | 분류 A·C 전담. `LazyMotion` + `domAnimation`으로 번들 최소화. 유일한 애니메이션 의존성 |
| React Bits | **미채택** | 5개 후보 전부 자작·제거로 대체(`01` V2). 컴포넌트 복사·라이선스 추적 비용 제거 |
| NumberFlow | **미채택** | 서수 데이터에 숫자 굴림은 거짓 정밀도(`01` V4) |
| Embla Carousel | **미채택** | Shelf는 CSS scroll-snap + 버튼으로 구현(`01` V5) |
| AutoAnimate | **미채택** | Motion layout으로 커버 |
| GSAP / Lottie / three.js | **미채택** | 요구 없음 |

Shelf 구현 계약(캐러셀 대체): `overflow-x: auto` + `scroll-snap-type: x mandatory` + 카드 `scroll-snap-align: start` + 데스크톱용 이전/다음 버튼(`scrollBy` smooth, reduced-motion 시 instant) + `scrollbar-width: none`. 키보드는 카드 간 Tab/화살표.

## 8. 성능 예산

- 초기 JS(추천 페이지 기준) < 250KB gzip. Motion은 LazyMotion으로 ~5KB 수준 유지.
- LCP: 랜딩 = 로고 텍스트(이미지 아님), 추천 = 첫 표지. LCP < 2.5s(중급 모바일 기준).
- CLS < 0.05: 표지 aspect-ratio 고정, 폰트 메트릭 폴백.
- 애니메이션 프레임: 60fps 목표, 저사양에서 C 분류가 30fps 미만이면 해당 기기에서 layout 애니메이션 비활성(측정은 수동 QA).
- 블러 배경은 화면당 1개, `will-change` 사용 금지(정적이므로 불필요).

## 9. 조용한 표면 선언

다음 화면·영역에는 시그니처·장식을 **의도적으로 두지 않는다**: 추천 피드 전체(카드 hover lift 제외), Library, 설정, 온보딩 STEP 2(불호 입력은 감정적으로 중립해야 함), 모든 다이얼로그·시트. 이 화면들의 품질은 타이포·간격·상태 완성도로만 만든다.
