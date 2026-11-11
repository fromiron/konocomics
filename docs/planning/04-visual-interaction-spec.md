# 04 — 비주얼·인터랙션 사양 (Visual & Interaction Spec)

> 코딩 에이전트가 시각적 판단을 새로 내리지 않도록 하는 구현 계약.
> 원칙: **표지가 항상 주인공이고, UI는 어두운 극장이다.** 시그니처 모먼트는 3곳뿐이며 나머지 표면은 의도적으로 조용하다.

---

## 1. 아트 디렉션 — dark media shelf

`docs/planning/redesign/visual-targets/`의 7화면처럼 near-black/navy canvas 위에 실제 표지와 조밀한 Shelf를 배치한다. dark-only이며 표면 테마 전환(surface theme selector), 라이트 fallback, 범용 SaaS의 글래스모피즘·오로라는 쓰지 않는다. 사용자가 고를 수 있는 것은 accent 1색뿐이다(§2.1, 2026-11-11 사용자 결정).

- **브랜드 인격:** 안목 있는 서점 점원. 조용하고 정확하며, 근거를 갖고 말한다. 과장·호들갑 없음.
- **색의 위계:** 화면에서 가장 채도 높은 것은 만화 표지와 의미 있는 accent다. UI 자체는 navy 중립색 + accent 1색이며, accent는 사용자가 고른 테마 하나(기본 バターイエロー, §2.1)다.
- **밀도:** 한 viewport에서 여러 작품을 탐색할 수 있게 Shelf·ranking을 밀도 있게 두고 장식은 희박하게 유지한다.
- **디자인 언어의 세 층(2026-10-07 사용자 결정):** 앱 전체를 홈 히어로의 만화 잡지 언어와 한 서비스로 묶되, 쓰임에 따라 강도를 나눈다.
  1. **바깥 틀(헤더·하단 탭·푸터):** 모든 화면에서 홈 마스트헤드의 축소판을 쓴다. 페이지와 같은 먹 바탕을 종이색 괘선(`--chrome-rule`)으로 끊고, 워드마크는 촘촘하게, 현재 위치는 accent 블록이다. 푸터는 판권면(奥付)이다.
  2. **편집적 순간(온보딩 웰컴):** 2026-11-11 사용자 결정(히어로 시안 A)으로 홈 히어로는 이 층에서 빠져 층 3의 재질로 만든다(`03` §1 「근거 무대」: 어두운 canvas·실제 표지·accent·종이 말풍선). 흰 바탕·먹선 컷, accent 별색 컷, 사선 경계의 만화 컷 문법은 그 뒤 온보딩 웰컴에만 남았으나 아래 두 결정으로 모두 폐기했다. 2026-11-11 사용자 결정(단계 표시 압축)으로 웰컴 아래 단계 띠의 흰 컷·accent 별색 사선 컷도 폐기하고 어두운 바탕의 한 줄 stepper로 바꾸었다(`03` §2). 2026-11-11 사용자 위임 디자인 결정으로 전체 폭의 흰 내레이션 컷도 내용 크기의 종이 말풍선(아이브로 「はじめに」·h1·안내 한 줄, 꼬리 있음)으로 바꾸었다. 배너가 아니라 제품이 말을 거는 자리로 읽히게 하기 위해서다(`03` §2). 이 층에 남는 종이 면은 그 웰컴 말풍선 하나다. 홈 히어로의 일러스트 장면·효과음 글자·바탕 그림문자·세로쓰기·반복 모션은 폐기했다.
  3. **도구(검색·선반·추천 카드·설정·폼):** 표지가 나오는 카드는 §2.10 선반 카드 문법을 따른다(2026-11-11 사용자 결정(플랜 승인)). 만화 장식을 더하지 않는다.
- **종이는 제품이 말하는 자리(2026-11-11 사용자 결정(플랜 승인)):** 홈의 만화 언어와 앱을 잇는 물건은 종이 말풍선이다. 밝은 종이 면은 제품이 독자에게 말을 거는 자리에만 쓴다: 추천 이유 말풍선(§2.9), 판매순 발견 질문 배너(§4), 작품 상세 「あなたとの相性」의 근거 말풍선, 층 2의 온보딩 웰컴 말풍선. 이 범주 밖의 표면은 dark다. 홈 히어로의 밝은 면은 근거 무대의 말풍선 하나다(`03` §1). 2026-11-11 사용자 위임 디자인 결정: 상세의 근거 말풍선도 카드와 같은 종이 말풍선이다(§2.9, `03` §6). 2026-10-01 상세 리디자인 이후의 dark variant는 폐기했으며, 이제 이 범주의 모든 자리가 같은 종이·먹 토큰을 쓴다.
- **선 대신 면(2026-10-07 사용자 결정), 모서리는 반경 단계(2026-11-11 사용자 결정):** 2026-10-07의 「각진 모서리」(패널·조작·라벨 0)는 종이 컨셉과 함께 폐기했다. 버튼은 각지고 카드는 둥근 불일치를 없애기 위해, 조작과 패널은 표지 카드와 같은 반경 언어인 §2.3의 단계를 따른다(조작·표지 카드 8px, 패널 12px, 칩·태그 999px, 표지 4px, 종이 말풍선 6px). 테두리 대신 면으로 구분하는 원칙은 유지한다.
  - 섹션 패널·대화상자·스낵바·빈 상태·칩·외곽선 버튼·세그먼트·라벨: 테두리 없이 면(`surface-1`/`surface-2`)으로 구분하고 모서리는 §2.3의 역할별 반경이다.
  - 선택·눌림: accent 면(`bg-accent` + `--on-accent`)으로 표시한다. 경고·위험·포커스의 테두리와 링은 정보이므로 유지한다.
  - 입력·선택 상자: 아래 선 하나(`border-b`)만 둔다.
  - 칸막이·표 행·점선이던 안내: 괘선 한 줄로 나눈다.
  - 설정 섹션은 면 대신 판권면처럼 굵은 종이색 괘선(2px) 아래의 블록이고, 섹션 사이는 48px다. 「危険な操作」만 빨간 테두리 상자를 유지한다. 섹션 탐색의 현재 항목은 헤더·하단 탭과 같은 accent 블록이며, 좁은 화면의 가로 탭은 오른쪽 끝을 흐려 더 있음을 알린다.
  - 원형 아이콘 버튼·스위치·진행 점은 원형을 유지한다.
  - **정보 태그는 둥글게(2026-10-13 사용자 결정):** 장르·중심 Theme 라벨은 공용 `GenreChips`의 둥근 태그(`--radius-tag` 999px, `surface-2` 면, 테두리·hover 없음, 12px)다. 2026-11-11부터 누르는 칩(장르 필터·선택 칩)도 999px이므로 모양으로 뜻을 나누지 않는다. 읽는 태그는 12px·hover 없음·선택 상태 없음이고, 누르는 칩은 44px 타깃·hover 면·선택 시 accent 면이다. 공간이 있는 곳(상세 히어로·같은 작가 대표작)은 전부, 캐러셀 카드(Top 10·「この作品と近い作品」)는 최대 2개를 보이고 나머지는 링크 접근 이름에만 둔다. 표지 옆 좁은 칸(같은 작가 작은 카드)과 이유 문장 안의 「近いポイント」는 텍스트를 유지한다.

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
  /* --accent / --on-accent: 아래 accent 테마 표의 선택값(기본 butter) */
  --accent-ink: var(--accent);
  --accent-hover: color-mix(in oklab, var(--accent) 90%, black);
  --accent-active: color-mix(in oklab, var(--accent) 85%, black);
  --accent-soft: color-mix(in oklab, var(--accent) 32%, black);
  --danger: oklch(0.64 0.21 15);
  --warn: var(--danger);
  --focus-ring: var(--accent-ink);
}
```

**accent 테마(2026-11-11 사용자 결정):** 앰버 primary는 종이 느낌을 위해 골랐지만 dark 화면에서 낡아 보여, accent를 사용자가 고르는 여섯 테마로 바꾼다. canvas·surface·text·종이 말풍선 토큰은 바꾸지 않는다(표면 테마가 아니다). 각 테마는 `--accent`와 `--on-accent` 두 값만 정의하고, hover·active·soft·accent 괘선·focus ring·무대 그라데이션·DNA 휠·FactorBar 채움 등 나머지는 위처럼 `--accent`에서 `color-mix`로 계산한다. 테마 블록 밖에는 accent 색 리터럴을 두지 않는다(순위 메달의 금·은·동 금속 토큰은 accent가 아니라 메달 색이므로 고정이다).

| id | 이름 | `--accent` | `--on-accent` | on-accent/accent | accent 글자/canvas·surface-1·surface-2 |
|---|---|---|---|---|---|
| `butter`(기본) | バターイエロー | `oklch(0.91 0.12 98)` | `oklch(0.25 0.05 95)` | 12.3 | 15.6 · 14.9 · 13.9 |
| `kinaka` | 金赤 | `oklch(0.71 0.19 38)` | `oklch(0.17 0.03 30)` | 6.9 | 7.3 · 7.0 · 6.5 |
| `lime` | ライム | `oklch(0.89 0.19 128)` | `oklch(0.26 0.07 130)` | 11.5 | 15.3 · 14.6 · 13.6 |
| `ice` | アイスブルー | `oklch(0.85 0.09 225)` | `oklch(0.22 0.04 245)` | 11.2 | 13.1 · 12.5 · 11.7 |
| `paper` | ペーパーホワイト | `oklch(0.965 0.012 90)` | `oklch(0.2 0.03 250)` | 16.4 | 18.3 · 17.5 · 16.4 |
| `amber` | アンバー | `oklch(0.76 0.11 72)` | `oklch(0.22 0.03 65)` | 8.0 | 9.3 · 8.9 · 8.3 |

- 구현: `:root`가 `butter`를 갖고 `[data-accent="<id>"]`가 나머지 다섯을 덮는다. 같은 블록이 선택 목록의 견본 색도 정한다(견본 요소에 `data-accent`를 붙인다). 허용 id 목록은 한 모듈이 소유하고 첫 paint 전 적용 script·CSS 검사·selector가 함께 쓴다. 선택·저장·적용은 `03` §0 「accent 선택」과 `05` §6이 정한다.
- 대비(sRGB gamut 매핑 후 WCAG 2 계산): 여섯 테마 모두 on-accent/accent ≥ 4.5:1, accent 글자/`--canvas`·`--surface-1`·`--surface-2` ≥ 4.5:1, focus ring/인접 표면(`--surface-3` 포함) ≥ 3:1(최소 金赤 5.9:1)이다. 파생 상태의 on-accent 대비도 hover·active에서 4.5:1 이상이다(최소 金赤 active 4.6:1). 값을 바꾸면 이 표를 다시 계산한다.
- **밝은 종이 면 위에서는 accent를 글자색으로 쓰지 않는다 — 강조는 굵기로 한다.** 밝은 accent(バターイエロー·ライム·ペーパーホワイト 등)는 종이 위에서 사라지므로, 말풍선(추천 이유·상세 상성·온보딩 웰컴)·판매순 발견 배너 안의 강조·아이브로·focus ring은 먹 토큰(`--discovery-ink`)과 굵기로 표시한다. 종이 범위는 `--accent-ink`를 먹으로 재정의한다. accent 채움(+`--on-accent` 글자)은 종이 범위 밖의 조작에만 쓴다.
- **danger·warning은 색만으로 전달하지 않고 어떤 accent와도 구별되어야 한다.** 위험·경고는 항상 아이콘·문구·제목(「危険な操作」·「注意」 등)이나 보더 형태를 함께 갖는다. 2026-11-11에 이전 `--danger` `oklch(0.65 0.22 25)`가 金赤와 거의 같아(OKLab ΔE 0.08) 전 테마 공통으로 더 차가운 빨강 `oklch(0.64 0.21 15)`로 옮겼다(金赤와 ΔE 0.11, 다른 accent와 ≥ 0.21; 글자 대비 canvas 5.4·surface-1 5.2·surface-2 4.8:1).
- `--accent`는 **의미를 가질 때만** 사용: konomi, 상위 취향, 주요 CTA, 선택, focus ring. 장식적 사용 금지.
  - 2026-11-11 사용자 결정: 「주요 CTA」는 제품 자신의 주요 액션이다. 외부 판매처로 나가는 링크(작품 상세의 라쿠텐 구매·검색 링크)는 accent 채움 대신 중립 보조 버튼(`outline`, `surface-2` 면)을 쓴다(`03` §6). 온보딩 stepper의 현재 단계 블록은 내비게이션 현재 위치와 같은 「현재 위치」 의미의 accent다.
- 본문/보조 텍스트와 모든 interaction state는 구현 viewport에서 WCAG AA 대비를 확인한다. accent 채움 위에는 흰색이 아니라 `--on-accent`를 사용한다.
- `--accent-hover`는 두 번째 accent가 아니라 같은 hue의 주요 CTA 포인터 상태다(밝은 accent에서도 보이도록 조금 어둡게 섞는다). `--surface-hover`는 outline/ghost와 중립 인터랙션에만 쓰며 accent 채움 CTA에 적용하지 않는다.
- 장식용 전면 gradient 금지. 읽기 대비를 위한 hero image overlay gradient, 표지 블러 배경(§4.2), 스크린톤은 예외다.
- 밝은 종이 표면은 §1 「종이는 제품이 말하는 자리」의 범주에만 쓴다(2026-11-11 사용자 결정(플랜 승인)). `--discovery-*` 토큰이 말풍선(§2.9, 2026-11-11부터 온보딩 웰컴 말풍선 포함)과 판매순 발견 질문 배너(§4)의 종이·먹 색을 소유한다. `--hero-paper-white`·`--hero-ink-cool`은 2026-11-11 웰컴 말풍선 전환 뒤 Library 기록 도장의 먹 바탕·흰 글자에만 남는다. 전역 dark theme은 유지한다. 2026-09-11의 상세 근거 배너와 그 `--evidence-surface` 회청색 표면은 2026-10-13 상세 재구성(`03` §6)으로 「あなたとの相性」 말풍선에 흡수되어 쓰는 곳이 없다. 소비자가 없던 `--evidence-surface` 토큰과 `RankingCard`의 `evidence`·`evidence-placeholder` variant는 2026-11-11 정리에서 삭제했다.

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
| semantic | `--text-section-title-size` | mobile·desktop 20px(2026-10-01 `03` 28/20 계약에 맞춤) |
| semantic | `--text-page-title-size` | mobile·desktop 28px(2026-10-01 `03` 28/20 계약에 맞춤) |
| semantic | `--text-display-size` | 40px. 랜딩·DNA 디스플레이 전용 |

온보딩과 `/taste`의 1440px/390px 실제 제품 렌더에서 일본어 제목·본문·캡션, mixed-script DNA 제목, 다중 행 그룹을 확인했다. 잘림·겹침·가로 오버플로가 없었고 `/taste` DNA 제목의 computed font stack은 Space Grotesk와 Noto Sans JP를 함께 포함했다.

### 2.3 표면·보더·그림자·radius

- 배경은 `--canvas`와 `--surface-1..3` 역할로만 구성하고 같은 card 안에서 불필요하게 3단을 모두 겹치지 않는다.
- 패널(섹션 패널·대화상자·스낵바·빈 상태): 테두리 없이 면으로 구분한다. 그림자는 기본 없음. hover·시트 상승 시에만 `--shadow-raised` 한 단을 사용한다. 주요 CTA만 accent 채움, 나머지는 outline/ghost.
- **radius 단계(2026-11-11 사용자 결정):** 버튼은 각지고 카드는 둥근 불일치를 없애 조작이 카드와 같은 모서리를 갖게 한다. 아래 토큰 밖의 반경(`rounded-none`, 임의 `rounded-[…px]`, 토큰을 거치지 않은 `border-radius`)을 쓰지 않는다.

  | 반경 | 토큰 | 쓰는 곳 |
  |---|---|---|
  | 4px | `--radius-cover` | 표지·썸네일(+1px `oklch(0 0 0 / 0.1)` 보더). 선택 외곽은 2px 보더를 더한 파생값 `--radius-cover-selection`(6px)로 동심 윤곽을 유지한다 |
  | 8px | `--radius-control`·`--radius-media-card` | 버튼·탭·입력·선택 상자·토글·내비게이션 현재 위치 블록, 표지 카드·미디어 카드(§2.10) |
  | 12px | `--radius-card` | 대화상자·팝오버·배너·시트·스낵바·빈 상태·큰 패널(홈 히어로 근거 무대·마무리 띠·설정/조건 패널 등) |
  | 999px | `--radius-pill`·`--radius-tag` | 칩(장르 필터·선택 칩)·정보 태그·순위 배지·견본 색·진행 막대. 원형 아이콘 버튼·스위치·진행 점도 원형이다 |
  | 6px | `--radius-bubble` | 종이 말풍선(§2.9 — 추천 이유·상세 상성·온보딩 웰컴) |

  - **중첩 규칙:** 안쪽 반경 = 바깥 반경 − 둘 사이 패딩이며 4px 아래로 내려가지 않는다(예: 4px 안쪽 여백의 12px 세그먼트 트랙은 8px 세그먼트를 담는다). 사이 패딩이 바깥 반경 이상이면 동심 관계가 생기지 않으므로 안쪽 요소는 위 표의 자기 역할 반경을 쓴다(예: 24px 여백의 대화상자 안 버튼은 8px).
  - 온보딩 단계 표시(2026-11-11 사용자 결정으로 사선 컷 띠를 대체한 한 줄 stepper, `03` §2)는 이 단계를 따른다: 단계 항목·현재 단계 블록은 8px(`--radius-control`), 번호/체크 배지와 「任意」 배지는 999px(`--radius-pill`)다. 테두리 없이 면으로 구분하고 단계 사이의 짧은 연결선만 `--line` 괘선이다.
- semantic 표면 역할은 `--surface-page`(`--canvas`), `--surface-raised`(`--surface-1`), `--surface-interactive`(`--surface-2`), `--surface-hover`(`--surface-3`)로 매핑한다.

### 2.4 간격·레이아웃 리듬

- 4px 기본 단위. primitive 간격은 `--space-1` / `--space-2` / `--space-3` / `--space-4` / `--space-5` / `--space-6` / `--space-7` / `--space-8` / `--space-12` / `--space-24` = 4/8/12/16/20/24/28/32/48/96px로 제한한다. 2/6/10/14/18px은 보더·아이콘 광학 보정·44px 타깃 내부 패딩처럼 역할이 명시된 컴포넌트 예외만 허용한다.
- semantic 간격은 `--space-content-tight` 4, `--space-content` 8, `--space-content-loose` 12, `--space-section` 32, `--space-section-large` 48, `--space-section-xl` 96px이다. `--space-section-xl`은 선반과 구분하는 큰 블록의 바깥 간격에 사용한다. `/recommendations` 전용으로 같은 묶음의 선반 사이 `--space-shelf`(= `--space-section-large`, 48px)와 묶음 사이 `--space-shelf-group`(64px)을 둔다.
- 화면 좌우 패딩은 `--layout-page-padding` mobile 16 / desktop 24, 페이지 시작 간격은 `--layout-page-block-start` mobile 32 / desktop 48이다. 바깥 page container가 이 값을 소유하며 내부 카드가 다시 화면 패딩을 만들지 않는다.
- 일반 본문 끝과 footer 사이의 여백은 공용 AppShell route-content의 `padding-bottom: var(--space-section-large)` 48px이다. 마지막 캐러셀의 별도 margin이나 각 화면의 일반 bottom padding은 사용하지 않는다. tray·고정 CTA·하단 navigation의 회피 공간은 아래 계약대로 별도 유지한다.
- 고정 UI 회피값만 별도 semantic 역할로 둔다. `--layout-safe-area-bottom`은 기기 safe area, `--layout-mobile-navigation-clearance`는 모바일 nav+safe area, `--layout-onboarding-tray-clearance`는 선택 tray가 있는 온보딩의 하단 여백, `--layout-taste-action-clearance`는 고정 추천 CTA가 있는 취향 화면의 하단 여백을 소유한다. 취향 화면 값은 mobile `calc(160px + safe area)`이고 desktop에서 120px로 바뀐다. 온보딩 값은 2026-11-11 사용자 위임 디자인 결정으로 mobile 하단 패널의 실제 높이와 같다: 기본값은 한 줄 tray(44px 행 + 위아래 `--space-3` + 1px 괘선 + safe area)이고, 패널이 화면 하단에 고정된 동안 패널이 자기 높이를 이 토큰으로 알린다(STEP 2 패널·선택 썸네일을 펼친 tray처럼 높이가 달라져도 같다). 온보딩 화면의 스크롤 끝 여백(푸터 포함)과 `scroll-padding-bottom`, 한도 안내의 위치가 이 값을 쓰므로 스크롤 끝에서도, 키보드 focus 이동에서도 조작이 패널 아래에 머물지 않는다. desktop 패널은 sticky이므로 값을 쓰지 않는다.
- 콘텐츠 최대폭: shelf 중심 `/recommendations`·landing·`/taste`·작품 상세는 `--layout-width-media` 1200, form 640을 기본으로 한다. 온보딩 shelf는 1120(desktop 우측 sticky 선택 패널 `--layout-width-onboarding-panel` 20rem), 읽기·안내 블록은 760, 전역 nav는 1200을 사용한다.
- 구분선은 그림자 대신 1px `--line` 헤어라인 사용(인쇄물의 괘선 감각).

### 2.5 인터랙션 상태 (전 컴포넌트 공통)

- hover(포인터만): outline/ghost는 `--surface-hover`, 주요 accent CTA는 `--accent-hover`, 탐색 카드는 background·shadow 또는 컴포넌트 고유 상태로 반응한다. **hover로 border color를 바꾸는 패턴은 전역 금지**(상세 「この作品と近い作品」의 임시 보더 예외도 Top 10 공용 카드 재사용으로 종료)이며 border 상태는 selected·validation·keyboard focus처럼 hover가 아닌 의미 상태에만 쓴다. 장식적인 generic Y축 lift는 전역에서 사용하지 않는다. 2026-10-01 사용자 결정으로 허용된 포스터형 카드의 포인터 광택(§6 G)은 lift가 아니며 §6 G의 위치·한도 안에서만 쓴다. 각도를 바꾸는 기울기(tilt)는 모든 요소에서 금지한다. 카드 확장·ranking accessory 이동·preview disclosure처럼 의미 있는 주 상태 전환만 spatial motion cue가 될 수 있다. `/onboarding`의 `コレクションから探す`는 compact 2열 disclosure trigger와 그 아래 하나의 full-width inline panel이다. 표지는 원본 비율을 유지하고 semantic token만 쓴다. Spotify Green·로고·음악 재생 UI·정확한 그래픽 복제는 하지 않는다. `--motion-duration-feedback` 120ms는 허용된 transform/opacity에만 적용하고 색·배경·그림자는 즉시 상태를 바꾼다.
- active/press: scale 0.97, `--motion-duration-press` 80ms. 데스크톱 GNB 헤더 브랜드 링크만 좁은 예외로, press transform 없이 compact opacity 피드백을 쓴다.
- focus-visible: 2px accent ring + 2px offset. **마우스 클릭에는 링 미표시.**
- disabled: opacity 0.45 + `cursor: not-allowed`. 색만으로 구분하지 않고 레이블 유지.
- selected: accent 보더 + 체크 오버레이(표지 카드) / accent 면(`bg-accent`) + `--on-accent` 글자(공용 선택 칩 — §1 2026-10-07 「선택·눌림」; 이전 `--accent-soft` 배경 + accent 보더·텍스트를 대체). 2026-10-01 사용자가 샘플과 동일한 디자인을 요구한 공용 `SegmentedControl`의 선택 인디케이터도 solid accent 채움이며 선택 글자는 `--on-accent`다.
- skeleton: 카드 실루엣 그대로, `--line` 톤 바탕에 §3.2 스크린톤 망점을 얹고 밝은 띠가 1.2s 주기로 한 방향 통과하는 시머다(2026-10-01, 로딩 중 한정). reduced-motion에서는 띠 이동 없이 정적 망점 실루엣에 1.6s opacity 0.7↔1 변화만 둔다. 1초 개발 throttle 동안의 짧은 placeholder 노출은 허용한다. 스피너는 전역 치명 오류 재시도에만 쓴다.
- empty state: 스크린톤 원 안에 아이콘 + 1줄 안내 + 1개 액션. 일러스트 신규 제작 없음. 유일한 예외는 `/library`의 전체 레코드 없음(overall-empty)뿐이며, 승인된 image-half empty-state로 기존 메시지 1개 + `作品を追加` 1개만 유지한다. 검색·탭·세그먼트 empty와 다른 화면에는 적용하지 않는다.
- functional contextual image banners: 상태/기능/CTA가 연결된 이미지 배너다. 필요한 기능 배너는 아래 §9의 장식 억제보다 상위 계약이며, 실제 상태·기능·기존 route CTA가 없는 순수 장식 배너는 계속 금지한다. `/recommendations` 후보 부족 full-shell만 허용한다. 나머지 닫는 안내는 공용 `SummarySection`(이미지 없음)을 쓴다. 장식 전용 hero가 아니며 이미지 속 텍스트는 쓰지 않는다. 좌측은 DOM copy·metrics·기존 route CTA, 우측은 장식 `img`(alt="", `aria-hidden`). Spotify Green/로고/재생 UI 복제는 하지 않는다. 상시 루프 모션은 없다.
- error: `--warn` 좌측 보더의 인라인 박스. 토스트는 성공 알림에만.
- 인라인 안내 상자(2026-11-11 사용자 위임 디자인 결정): 화면마다 손으로 만든 안내·경고·오류 상자는 디자인 시스템의 공용 `Notice` 하나로 통일한다(`src/components/design-system/notice.tsx`). 모양은 위 error 줄과 같은 좌측 보더(`--space-1` 폭)·`--surface-1` 면·오른쪽 `--radius-card`·14px 본문이며, 색만으로 구분하지 않도록 톤마다 아이콘(info 「i」·warn 삼각·danger 원)을 `aria-hidden`으로 둔다. 톤과 역할: `info`(정적 안내, `--line` 보더·`--text-muted` 글자, `role="note"`) · `warn`(저장 불가·공급자 장애 같은 상태 경고, `--warn` 보더·`--text` 글자, `role="status"`) · `danger`(조작이 실패해 사용자의 다음 행동이 필요한 오류, `--danger` 보더·`--text-strong` 글자, `role="alert"`). 이미 올라온 면 위에서는 `--canvas` 면으로 바꿔 구분한다. 역할을 바꿔 가며 같은 요소를 유지하는 live 영역(검색 공급자 상태 줄 등), 추천 화면, 상성 caution 같은 본문 블록, 스낵바·토스트는 이 상자가 아니다.

모션 값도 의미 역할로 소비한다: `--motion-duration-page` 160ms, `--motion-duration-floating-action` 200ms, `--motion-duration-value` 240ms, `--motion-duration-reveal-step` 400ms, `--motion-ease-direct` ease-out, `--motion-ease-value` ease-in-out, `--motion-ease-signature` cubic-bezier(0.2, 0, 0, 1). 이 값은 아래 A~G 분류를 대체하지 않고 구현 간 별칭 드리프트만 막는다. Top 10의 rank 배지는 2026-10-01부터 hover·focus 없이 항상 보이며(터치 포함, `03` §4 순위 명시), 진입 모션은 아래 왕관에만 남는다.

개인화 Top 10은 2026-09-10 사용자 승인에 따라 순위 배지에 기존 프라이머리 `--accent`를 사용하고 숫자는 어두운 `--on-accent`로 표시한다. 2026-10-01 사용자 결정으로 1·2·3위는 금·은·동 메달이다: 배지는 `--medal-{gold|silver|bronze}`의 밝은→기본→깊은 금속 그라디언트와 각 메달의 어두운 ink 숫자를 쓰고, 배지 위에 같은 금속의 장식 SVG 왕관(구슬 장식·보석·잉크 외곽선)을 둔다. 배지는 항상 보이고, D 입력 피드백으로 fine-pointer hover·keyboard focus-visible 진입 시 `--motion-delay-rank-crown` 150ms 후 왕관이 480ms 동안 위에서 떨어져 눌렸다 펴지며(squash·stretch, opacity·translate·scale만) 착지하고, 이어서 왕관 안을 광택 띠가 한 번 지나가며(520ms) 작은 반짝임 두 개가 한 번 깜박인다. 회전·기울기는 없다. 이탈 시 왕관만 숨기고 재진입 시 다시 한 번 재생하며 상시 반복하지 않는다. reduced-motion에서는 왕관을 지연·이동 없이 즉시 표시한다. 왕관은 `aria-hidden`이며 순위 이름·상세 링크·카드 외곽 geometry는 유지한다. 4위 이하는 accent 배지만 쓴다.

「読みたい」 저장 액션과 그 상태 표시(추천 카드·Quick Preview·Anchor 패널·작품 상세·판매순 발견 배너·Library 작품 추가·Library 「読みたい」 탭)는 2026-10-01 사용자 결정으로 모두 같은 북마크 아이콘을 쓰고, 저장된 상태는 채운 아이콘이다.

### 2.6 리뷰 통합 토큰·예산 경계

- 위 dark primitive + semantic 명칭이 migration 이후 권위다. 구현 원본은 framework-neutral global stylesheet의 `:root`이며 wide/narrow/reduced-motion에서 검증한다. 이전 light token과 `src/app/globals.css`는 migration baseline일 뿐 새 구현 권위가 아니다.
- radius의 bounded 단계는 4px·8px·12px과 999px, 종이 말풍선 6px이다(§2.3, 2026-11-11; 2026-10-07의 패널·조작 0은 폐기). 선택 표지 6px은 새 primitive가 아니라 `4px + 2px 선택 보더`의 파생값이다. §6.1 공용 세그먼트는 트랙 `--radius-card`(12px)·4px 안쪽 여백·인디케이터 8px로 중첩 규칙을 따른다.
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
- Shelf는 CSS scroll-snap + `ResizeObserver` + 기존 Motion만 사용한다. 2026-10-09 #77: Featured·Anchor·Discovery·Completed·Top 10은 모두 유한 트랙이며 canonical 후보를 한 번씩 표시하고 현재 범위/전체 수를 알린다. 끝에서는 그 방향의 화살표가 사라지고(2026-11-11, §7; 제목 줄에 화살표를 두는 선반은 disabled) pointer·touch·키보드 모두 wrap하지 않는다. 추천 featured card는 고정 poster 프레임 안에서 정상 상태의 큰 표지와 짧은 설명을 우선하고, desktop fine pointer hover와 keyboard focus에서는 외곽 geometry를 유지한 채 표지를 줄여 근거 설명과 action rail을 연다. mobile 390×844는 활성 카드 1장 + 다음 카드 peek이며 desktop은 약 3장 + 다음 카드 일부를 보인다. 표지 identity `Link`는 항상 작품 상세로 가고 Quick Preview는 별도 44px icon-only quiet control이며 공용 `RankingCard`에는 두지 않는다(추천 11~20위는 2026-11-11부터 `RankingCard`가 아니라 펼침 카드이므로 펼칠 수 없는 환경에서 「クイック表示」를 가진다, §2.10).
- 추천 featured card의 작품별 색 구분은 전경 표지와 같은 400px URL을 정적 decorative backdrop으로 재사용해 만든다. backdrop은 `alt=""`·`aria-hidden`·lazy이고 작은 local blur와 72% `--hero-scrim` 아래에 있으며 runtime palette 추출·추가 eager/high 요청은 없다. 전경 표지 컨테이너만 4px radius와 `--shadow-cover-featured: 0 8px 24px oklch(0 0 0 / 0.5)`를 사용한다.
- 추천 Discovery compact card의 resolved 표지만 원본 no-crop 규칙과 transform/opacity motion 예산의 사용자 승인 좁은 예외다. 고정 30:43 stage 중앙을 `clip-path: inset(15.116279% 0 round 50% / 34.883721%)`로 center-crop해 정확한 원을 만들고, hover/focus에서 `inset(0 round var(--radius-cover))`로 펼친다. 두 shape는 240ms linear로 직접 보간해 과대한 pill radius가 마지막에 풀리는 비균일한 형상 전환을 만들지 않는다. stage·article·형제 rect와 source URL/request는 바꾸지 않고, 표지 부재·실패 placeholder는 예외에서 제외한다. 카드 표면은 personalized Top 10과 동일하게 transparent → `--surface-2`, hover border 없음이다. 2026-11-11 사용자 결정(플랜 승인): 이 예외는 모핑 등급을 쓰는 위치(§2.10 — 추천 「隠れた候補」, 상세 「違う味わいの作品」, `/share` 추천작)에 같은 조건으로 적용한다.
- scroll/dialog animation과 focus restoration은 React local state다. Quick Preview 대상만 deep-link 가치가 있어 `/recommendations?preview=<workId>`로 표현할 수 있다.
- Shelf와 card 크기를 미리 예약한다. hover network fetch, autoplay, 스크롤 하이재킹은 없다.
- 2026-11-11 사용자 결정(플랜 승인): 위 featured card·Anchor 옆 패널 카드·Discovery card와 Shelf는 §2.10 선반 카드 문법의 무대·펼침·모핑 등급과 선반이다. 이 절의 치수·표지 처리·예외 조건은 그대로 유지하며 §2.10이 등급·원칙·적용 위치를 더한다.

### 2.9 추천 이유 말풍선 (2026-10-01 사용자 결정)

추천 이유는 「근거 있는 추천」을 보이는 제품의 핵심이므로 만화의 吹き出し 문법으로 감싼다. 2026-11-11 사용자 결정(플랜 승인)으로 종이 말풍선은 홈의 만화 언어와 앱을 잇는 물건이다(§1 「종이는 제품이 말하는 자리」). 말풍선은 정적 표현이다. 2026-10-01에 랜딩 「例」 lead reason 한 곳에만 허용했던 §6.1의 TextType·정적 종이 그레인은 2026-11-11 홈 재구성으로 그 카드가 없어져 현재 적용처가 없다(§6.1).

- 적용처: 펼침 카드의 패널(§2.10 — 추천 관점 선반과 11~20위의 lead reason, `/taste` 대표작의 그 작품이 만든 축, 홈 샘플 펼침 선반의 lead reason), Quick Preview의 이유 목록, 작품 상세 「あなたとの相性」의 이유, 홈 히어로 근거 무대의 lead reason(`03` §1, 2026-11-11 시안 A — 다른 자리와 같은 규격의 말풍선이다). 아래 색·형태 규격은 이 모든 말풍선에 적용한다. 무대 카드(추천 Featured·홈 샘플)는 2026-10-01 사용자 판단으로 말풍선 없이 기존 reason 줄을 유지한다(고정 poster의 hover 크기 전환과 겹치지 않게). 주의할 차이(caution)는 말풍선이 아니라 기존 `--warn` 좌측 보더 블록을 유지해 이유와 구분한다.
- 색: 2026-10-01 사용자 결정의 밝은 종이 바탕과 어두운 글자다. 2026-11-11 사용자 위임 디자인 결정으로 Catalog 상세 「あなたとの相性」의 말풍선도 카드와 같은 종이다(2026-10-01 상세 리디자인의 dark variant 폐기). `ReasonBubble`에는 표면 선택이 없고 모든 소비자가 같은 종이 말풍선을 쓴다(소비자가 없어진 `surface="dark"` variant는 같은 날 삭제했다). 승인된 밝은 토큰을 범위 안에서 재정의해 `--discovery-paper` 바탕, `--discovery-ink` 본문·강조, `--discovery-muted` 보조, `--discovery-line` 보더·꼬리를 쓴다. §1 「종이는 제품이 말하는 자리」 범주의 하나이며 말풍선 밖으로 번지지 않는다. 순백(`--discovery-button`)은 눈부심 때문에 쓰지 않는다.
- 형태: 위 색의 바탕과 1px 보더, `--radius-bubble`(6px, 2026-11-11) 모서리, 안쪽 여백 `--space-3`/`--space-2`. 꼬리는 같은 바탕·보더의 10px 정사각형을 45° 회전해 근거가 가리키는 표지·제목 쪽에 둔다. 위에 표지·제목이 있으면 위쪽 왼편, Anchor 옆 패널처럼 표지 옆으로 열리는 패널이면 표지 쪽 측면이다(오른쪽으로 열리면 왼쪽 꼬리, 왼쪽으로 열리면 오른쪽 꼬리, `data-expansion-side` 기준). 측면 꼬리가 스크롤 패널에 잘리지 않도록 말풍선 좌우에 8px 여백을 둔다. 꼬리·보더는 장식이며 접근성 트리에 의미를 더하지 않는다. 작품 상세(2026-11-11)는 근거 작품이 하나면 그 표지 오른쪽에 말풍선을 두고 왼쪽 측면 꼬리로 표지를 가리키며, 근거 작품이 여럿이면 표지 줄 아래에 두고 위쪽 왼편 꼬리로 첫(가장 강한) 근거 표지를 가리킨다. 근거 작품이 없으면 말풍선만 둔다. 상세는 말풍선 뒤에 다른 면(패널·그라데이션 띠)을 겹치지 않는다.
- 온보딩 웰컴 말풍선(2026-11-11 사용자 위임 디자인 결정, `03` §2)은 이유가 아니라 제품의 첫 인사이며 같은 종이·먹·보더·`--radius-bubble`을 쓴다. 내용 크기(최대 약 38rem)이고 꼬리는 아래쪽 왼편에서 바로 아래 단계 표시를 가리킨다. 모바일은 전체 폭이어도 좋고 안쪽 여백을 줄인다.
- 한 카드에 말풍선은 하나다. 이유가 여러 개인 Quick Preview·상세는 하나의 말풍선 안에 기존 목록 구조를 유지한다.
- 근거 작품명 강조(Anchor 패널)와 `data-contribution-summary` 등 기존 근거 대조 속성은 말풍선 안에서 그대로 유지한다.

### 2.10 선반 카드 문법 (2026-11-11 사용자 결정(플랜 승인))

추천 화면의 선반과 카드 3종, 그리고 「다가가면 근거가 열린다」는 모션을 앱 전체의 디자인 언어로 승격한다. 표지가 나오는 모든 카드는 이 문법을 따른다. 이 절은 등급·원칙·규칙·적용 위치를 정한다. 등급별 치수와 전환 값은 기존 계약(§2.8, §2.9, §6 표 아래의 D 예외와 전역 규칙, `03` §5)이 그대로 권위이고, 각 화면에서 카드가 싣는 말·소개·액션의 내용은 `03`의 화면 계약이 정한다. 새 시그니처 모먼트·새 모션 분류·새 의존성은 만들지 않는다.

**세 등급**

| 등급 | 자리 | 쉬는 상태 | 다가가면(`fine-hover`의 hover · keyboard focus) | 공용 컴포넌트 |
|---|---|---|---|---|
| **무대(Stage)** | 한 화면의 주인공 몇 장 | 고정 프레임. 같은 표지를 흐리게 깐 배경 + accent를 섞은 그라데이션, 그림자는 표지에만, 이유 최대 2줄(2026-11-11 위임 결정, 1줄 이유도 2줄 자리 예약) | 프레임과 이웃 위치는 그대로 두고 이유가 최대 3줄로 늘며 액션 행이 열린다. 포인터를 따라가는 은은한 광택(§6.2)을 쓰고 기울기는 쓰지 않는다 | `StageCard`(`src/components/media/stage-card.tsx`). `src/features/recommendations/recommendation-card.tsx`의 표현부를 추출한 것이며 기능 폴더에는 `contributions[]` → 문장 변환만 남긴다 |
| **펼침(Expand)** | 가로 선반의 다수 | 표지 + 제목 | 200ms 호버 의도 뒤(keyboard는 focus-visible 진입 때) 카드가 옆으로 넓어지며 종이 말풍선의 이유(근거 작품명 굵게, §2.9)·짧은 소개·액션을 보인다. 이웃이 같은 폭만큼 비켜 주고, 남은 공간에 따라 좌우를 고르며, 선반 스크롤을 보정해 카드가 흐림 없는 영역을 벗어나지 않는다. Esc·바깥 누름·blur로 닫히고 닫힌 패널은 `inert`다 | `ExpandableMediaCard`(`src/components/media/expandable-media-card.tsx`) |
| **모핑(Morph)** | 이유를 먼저 읽히고 싶은 발견 | 타원으로 잘린 표지 + accent 왼쪽 선이 달린 이유(항상 보임) | 표지가 원본 비율로 펴지고(`clip-path`) 면이 `surface-2`가 된다 | `DiscoveryCard`(`src/components/media/discovery-card.tsx`) |

**선반.** `MediaShelf`(`src/components/media/media-shelf.tsx`)도 문법의 일부다. 제목이 렌즈를 말하고(「『…』が好きなら」는 선반 단위의 이유다), 위치 표시(「1–6 / 8作品」)·원형 넘김 버튼·양끝 페이드를 가진다. 유한 트랙이며 위치 표시와 버튼은 실제로 넘칠 때만 보인다(§2.8, §7, `03` §5). 2026-11-11 위임 결정: 첫 카드는 제목의 시작선에서 시작하고, 넘김 버튼은 자리를 예약하지 않는 overlay로 트랙 양끝·표지 세로 중앙에 놓인다(§7).

**여섯 원칙**

1. **쉬는 상태는 표지, 다가가면 근거.** 정보 밀도는 사용자의 접근에 따라 열린다.
2. **움직임에는 원인과 방향이 있다.** 근거는 표지에서 자라나고 이웃이 비켜 준다. 아무것도 튀지 않는다.
3. **의도를 기다린다.** 200ms 호버 의도를 확인하고, 휠·수동 스크롤 중에는 열지 않는다.
4. **키보드가 동등하다.** focus-visible로 같은 것이 열리고 Esc로 닫힌다. 닫힌 패널은 `inert`다.
5. **재질은 하나씩.** 테두리 없는 면 → hover 때 `surface-2`, 그림자는 표지에만, 밝은 면은 말풍선뿐이다(무대 카드는 흐린 표지 배경을 깐 프레임이 그 재질이며 프레임의 기존 테두리는 `03` §5대로 유지한다).
6. **토큰으로 움직인다.** 카드와 패널의 전환은 `--motion-duration-value`, `--motion-duration-reveal-step`, `--motion-ease-signature`, `--motion-ease-direct` 토큰을 쓴다. reduced-motion에서는 같은 정보가 즉시 나타난다.

**규칙**

- 표지가 들어간 카드는 세 등급 중 하나다. 온보딩의 `AnchorCoverCard`·`NegativeWorkCard`는 선택 도구이므로 표지 카드 공통 규격과 hover 면만 공유하고 선택 스탬프(체크 오버레이·확정 스탬프)를 유지한다. 표지 카드 공통 규격은 30:43 표지 프레임, 표지 밖 제목(예약하는 줄 수는 `03`의 화면 계약을 따른다), `--radius-media-card`, 테두리·그림자 없는 투명 면 → hover·focus `surface-2`다.
- 공용 `RankingShelf`의 `RankingCard`(홈 editorial Top 10, 상세 「『…』が好きなら」)는 같은 공통 규격과 선반을 쓰는 펼침 계열의 접힌 형태다. 열어 보일 개인화 근거가 없거나(editorial Top 10) 근거를 카드에 항상 표시하므로(상세) 패널을 두지 않는다.
- 폭이 넓어지는 펼침은 가로 선반에서만 쓴다. 그리드에서는 이웃이 다시 배치되므로 무대 카드처럼 카드 외곽과 이웃 위치를 고정한 제자리 공개를 쓴다.
- 터치에서는 hover 뒤에 정보를 숨기지 않는다(§6). 「クイック表示」가 펼침이 보여 주는 내용의 동등 경로다. 무대 카드는 coarse pointer에서 이유와 액션을 처음부터 보이고, 모핑 카드의 이유는 항상 보인다.
- 새 시그니처 모먼트를 더하지 않는다(§5는 3개 그대로). 카드 모션은 §6의 기존 분류 D(접근에 대한 직접 반응)와 G(무대 카드의 포인터 광택) 안에 있다.
- fine-pointer 조건 `(min-width: 768px) and (hover: hover) and (pointer: fine)`은 Tailwind variant `fine-hover` 하나로 쓴다. 컴포넌트가 같은 media query를 직접 반복해 적지 않는다.

**적용 위치**

| 화면·영역 | 등급 |
|---|---|
| `/recommendations` 「あなたのために選んだ{N}作品」 | 무대 |
| `/recommendations` 관점 선반(「『…』が好きなら」·「「…」で選ぶ」) | 펼침 |
| `/recommendations` 「隠れた候補」 | 모핑 |
| `/recommendations` 「あなたの 11〜20位」 | 펼침 + 순위 배지 |
| `/taste` 「好みを代表する作品」 | 펼침. 말풍선은 그 작품이 만든 축을 말한다 |
| `/share` 「このDNAにおすすめの作品」 | 모핑(이유는 항상 보임) |
| `/library` | 표지 카드 공통 규격과 면. 상태는 스탬프로만 구분하고 표지를 흐리게 하지 않는다. hover 뒤에 숨기는 정보는 없다(면 전환만) |
| 작품 상세 | 이미 공용 선반을 쓴다(`RankingShelf`, 「違う味わいの作品」의 모핑 카드) |
| `/` | 히어로의 근거 무대(무대 재질 + 말풍선, 샘플 상위 3작품을 선택해 전환), 그 아래 펼침 선반 1줄과 Top 10의 공용 `RankingShelf`(`03` §1) |
| `/onboarding` | 선택 도구 — 공통 규격과 hover 면만 공유 |

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

참고: 스크린톤 외 질감의 유일한 앱 예외는 랜딩 「例」 말풍선의 정적 종이 그레인이다(2026-10-01 승인). 명시적 opt-in이며 opacity 0.035의 단색 SVG noise를 배경으로만 사용해 글자·표지를 덮지 않는다. 전역·본문·리스트·다른 말풍선에는 확장하지 않는다. 2026-11-11 홈 재구성으로 그 말풍선이 없어져 현재 적용처가 없다(§6.1). §6 G의 광택은 일시적 조명이며 상시 질감이 아니다. 공유용 Manga DNA 카드 이미지(`03` §4)는 앱 표면이 아니므로 이 절의 적용 대상이 아니다.

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
- 2026-10-01 상세 리디자인 승인: 모든 공용 CoverImage의 loading은 샘플 鈴木さん 커버의 16px 망점·1.2s 이동 시머다. 기존 surface/line/spacing 토큰을 사용하며 성공 시 기존 reveal-step/cinematic duration의 opacity 크로스페이드, 실패 placeholder는 즉시 표시한다. reduced-motion은 망점 이동을 제거하고 짧은 opacity만 허용한다. 실제 load/cache/fallback/lazy 경로를 유지하고 재생 버튼·가짜 지연은 만들지 않는다. 2026-11-11 위임 결정: 이미지를 받는 동안에도 자리는 빈 상자가 아니다 — 시머 망점 위에 §4.3 placeholder의 제목(과 자리가 넓으면 저자)을 함께 보이고, 이미지가 나타나면 시머와 함께 사라진다. 이 글자는 장식(`aria-hidden`)이며 접근 이름은 이미지의 `alt`가 가진다.
- 2026-11-11 위임 결정: 첫 viewport에 고정으로 놓이는 표지(홈 히어로 근거 무대, `03` §1)는 lazy가 아니다. 큰 표지와 샘플 5작품 표지는 eager·high priority, 같은 무대의 작은 선택 표지·숨은 장면 표지는 eager(기본 priority)다. 선반 표지는 lazy를 유지한다.

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

`--surface-raised` 배경 + 1px 보더 + 세로쓰기 느낌의 중앙 제목 텍스트(2줄 clamp, `--text-muted`) + 좌하단 저자. 스크린톤 12px 패턴을 우상단 모서리에만 둔다. 로딩 중에는 skeleton, 실패 확정 후 placeholder다(2026-11-11부터 로딩 중 skeleton에도 같은 제목을 얹는다, §4.1). 폭 7.5rem 이하에서는 저자를 생략하고, 4rem 이하의 작은 자리(홈 히어로 샘플·선택 표지 등)는 제목을 숨기지 않고 `--text-caption-size`·자리 폭 가득으로 줄여 보인다(2026-11-11 위임 결정; 이전에는 망점만 남아 빈 상자로 보였다).

---

## 5. 시그니처 모먼트 (전체 3개 — 추가 금지)

### 5.1 konomi 로고 reveal — 랜딩

- **목적:** 브랜드 기믹이 곧 제품 설명("숨은 취향의 발견")임을 10초 안에 체험시킨다.
- **자격:** usable profile이 아닌 일반 first-run의 resolved introduction에서만 세션당 1회 실행한다. `?landing=1`은 항상 정적이며 marker를 읽거나 쓰거나 지우지 않는다.
- **marker:** `sessionStorage["logoRevealed"] = "1"`. absent 확인 뒤 write/readback을 마치고 font 대기·Motion 시작·timer/listener 등록보다 먼저 marker를 소유한다. read·write·readback 중 하나라도 실패하면 reveal 없이 최종 정적 상태를 표시한다.
- **static-first 기본값:** 고정 300/700의 최종 2톤 wordmark, 태그라인·CTA가 resolved introduction의 첫 paint부터 최종 DOM에 존재한다. 2026-10-05 사용자 결정으로 `好み`·「kono + mi = このみ」 caption과 설명 문장은 두지 않는다. CSS 기본값과 enhancement 실패 상태는 전부 최종 시각 상태다. eligible A가 시작된 뒤에도 최종 2톤 base·태그라인·CTA는 숨기거나 비활성화하지 않는다.
- **오버레이 시퀀스(총 1.8초 이내, Motion A):** 최종 2톤 base 위의 별도 고정 300 ink monochrome wordmark overlay만 opacity로 합성한다. 0–400ms에는 base가 계속 보이는 상태에서 overlay opacity가 등장하고, 400–900ms에는 overlay가 1→0으로 사라져 base를 드러낸다. font-weight·color·layout·CTA는 애니메이션하지 않는다.
- **태그라인 글자 등장(2026-10-01, React Bits SplitText 참고):** 같은 A 안에서 150ms부터 태그라인 글자가 45ms 간격으로 `opacity 0→1` + `translateY(0.55em→0)`, 글자당 700ms `cubic-bezier(0.2,0.7,0.2,1)`로 나타나며 전체가 1.8초 안에 끝난다. 태그라인 문구 단위 줄바꿈(`03` §1)과 레이아웃 폭은 변하지 않는다. 접근성: 태그라인 heading은 전체 문장 하나를 accessible name으로 갖고, 글자 단위 span은 `aria-hidden`이다. 스크린리더가 글자를 하나씩 읽지 않는다. resolved introduction이 처음 그려질 때부터 숨겨진 상태로 시작해야 하며, 이미 보인 글자를 다시 숨기는 깜빡임을 만들지 않는다.
- **font:** marker를 먼저 기록한 뒤 `document.fonts.ready`를 기다린다. API가 없거나 reject하면 최종 정적 상태다.
- **스킵·정리:** pointer/tap/click·keydown·wheel/scroll은 `preventDefault`나 전파 차단 없이 즉시 완료한다. 자연 완료·스킵·`pagehide`·unmount는 controls·timer·pending continuation과 모든 listener를 정리한다. CTA activation은 reveal을 완료하면서도 그대로 이동한다.
- **재진입·reduced-motion:** marker가 이미 있으므로 reload/back/forward에서 재생하지 않는다. reduced-motion도 marker를 소비하고 §6의 대체 원칙을 따른다: overlay는 400ms opacity 크로스페이드만, 태그라인은 글자 분할·이동 없이 문장 전체가 300ms opacity로 나타난다. 실행 중 reduce로 바뀌면 남은 시퀀스를 즉시 완료하고 같은 session에서 다시 재생하지 않는다.

### 5.2 Manga DNA reveal — /taste?reveal=1

- **목적:** 온보딩의 보상. "선택한 작품들 → 분석된 취향"의 인과를 몸으로 느끼게 한다(가설 E).
- **시퀀스 (총 ≈2.4s + 사용자 스크롤):**
  1. 0–500ms: 기존 근거 선택의 대표작(2026-11-11부터 §2.10 펼침 선반, 이전 Anchor grid)이 fade-in.
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
| D. 직접 조작 피드백 | 입력 확인 | 80–120ms (확정 스탬프 220ms, 선반 카드의 접근 반응 240–400ms) | ease-out / 스탬프 spring | CSS / Motion | press scale 0.97, 선택 체크 페이드. 확정 스탬프(2026-10-01): 온보딩 작품 선택·「読みたい」 저장이 확정되는 순간 한 번 scale 1→1.06→1(220ms, 표지 카드는 체크 오버레이만)과 체크 페이드. 선반 카드 문법(§2.10, 2026-11-11 명문화)의 접근 반응 — 무대 카드의 제자리 공개(400ms), 펼침 카드의 폭 확장(200ms 호버 의도 뒤 240ms), 모핑 카드의 표지 펼침(240ms) — 은 표 아래의 승인된 D 예외로 이 분류에 속하며 새 분류가 아니다. 선반 넘김 버튼이 선반 hover·focus-within에서 나타나고 사라지는 것(2026-11-11, §7)은 `--motion-duration-feedback` 120ms opacity만이다. accent selector 팝오버의 열림·닫힘(2026-11-11)은 `--motion-duration-feedback` 120ms opacity + 4px 이동이며 reduced-motion에서는 opacity만이고, accent 변경 자체는 색 전환 애니메이션 없이 즉시 바뀐다. generic hover Y축 lift는 사용하지 않음. 헤더 브랜드 링크만 press transform 없이 compact opacity 피드백 |
| E. 값 전이 | 수치 변경 표현 | 240ms (진입 채움 600ms) | ease-in-out / ease-out-cubic | CSS transition / Motion | positive anchor 변경 뒤 FactorBar 분석값 갱신, 확신도 레이블 크로스페이드. 진입 채움(2026-10-01): FactorBar가 mount마다 처음 뷰포트에 들어올 때 0→값 1회. 실제 정수 count(분석 작품 수·후보 수)의 count-up 600ms. DNA 축 값은 숫자로 굴리지 않는다. 추천 adjustment는 FactorBar 입력이 아니다. |
| G. 포인터 반응·확정 축하 (2026-10-01) | 만질 수 있는 재질감, 긍정 확정의 보상 | 180–800ms | ease-out / `cubic-bezier(0.2,0.7,0.2,1)` | CSS 변수 + Motion/WAAPI | 아래 「G 허용 목록」만. React Bits GlareHover·Magnet·SpotlightCard·ClickSpark를 참고해 자작한다. 무대 카드(§2.10)의 포인터 광택은 이 목록의 광택이며 다른 등급이나 그리드 카드로 넓히지 않는다. 각도를 바꾸는 기울기(TiltedCard 류)는 모든 요소에서 금지 |
| F. 어텐션 | 오류·한도 안내 | 120ms×2 | linear | CSS | tray 흔들림(±4px), 오류 박스 등장. reduced-motion에서는 전체 `--warn` 보더를 정적으로 유지 |

아래 세 문단이 §2.10 선반 카드 문법의 D 예외다(2026-11-11 사용자 결정(플랜 승인)). 각 예외는 해당 등급을 쓰는 §2.10의 모든 적용 위치에 같은 조건으로 적용하며 새 분류·새 시그니처 모먼트를 만들지 않는다.

무대 카드의 제자리 공개는 아래 전역 규칙의 featured card 예외다(고정 프레임 안에서 표지 stage·reason·action rail을 `--motion-duration-reveal-step` 400ms / `--motion-ease-direct`로 함께 전환). 그리드에서 폭 확장 대신 쓰는 제자리 공개(§2.10 규칙)도 같은 조건 — 카드 외곽과 형제 위치 불변, overflow clipping, coarse pointer에서는 처음부터 최종 상태, reduced-motion 즉시 완료 — 을 따른다.

모핑 카드(Discovery)의 resolved 표지 원→직사각형은 D의 사용자 승인 scoped exception이다. `clip-path`만 `--motion-duration-value` 240ms 선형(§2.8)으로 전환하고 카드 표면색은 personalized Top 10과 같은 240ms / `--motion-ease-direct`를 쓴다. 반복·autoplay·layout 변화가 없으며 reduced motion에서는 두 상태를 즉시 바꾼다.

펼침 카드: 관점 선반(Anchor) 옆 패널은 2026-09-10 사용자 승인 D 예외다. `ExpandableMediaCard`는 200ms hover 의도 확인 또는 keyboard focus-visible 진입 뒤 article `width`를 기존 폭에서 `--control-min-size × 6`만큼 `--motion-duration-value` 240ms / `--motion-ease-signature`로 늘린다. 형제 카드가 같은 폭만큼 이동해 다음 표지를 가리지 않는다. 하나의 열린 카드를 다음 카드로 넘길 때는 기존 폭 축소와 새 폭 확장을 같은 타이밍으로 진행하며, 뒤쪽 카드가 공간을 넘겨받을 때는 표지를 오른쪽에 고정한다. 확장량은 정수 CSS 픽셀로 보간해 두 카드의 합산 폭과 후속 형제 위치가 반올림 때문에 흔들리지 않게 한다. 표지 DOM·원본 비율·카드 높이·텍스트 크기는 유지한다. 패널은 고정 폭이며 article의 overflow clipping으로 드러난다. 단독 진입과 카드 간 전환 모두 확장된 카드가 `scroll-padding` 안쪽의 흐림 없는 영역에 들어오도록 폭 전환과 함께 가로 위치를 보정하며, 사용자 직접 스크롤을 덮어쓰지 않는다. 확장 패널 하단에는 기존 Quick Preview와 같은 읽기 액션을 고정하고, 긴 근거·소개만 위쪽 영역에서 스크롤한다. 확장 불가 환경은 제목 아래 Quick Preview와 작품 상세 Link를 제공한다. reduced-motion은 최종 상태를 즉시 표시한다. 이전 overlay 및 고정 212px 높이 안은 사용하지 않는다.

### 6.1 샘플 효과의 제품 적용 (2026-10-01 사용자 승인)

바닐라 샘플의 느낌을 기존 React·Motion·CSS로 구현한다. 샘플의 고정 문장·수치·가짜 로딩 시간은 가져오지 않는다. 아래는 기존 정적 표면·B allowlist·프로퍼티 제한의 명시적 예외다.

| 효과 | 위치·트리거·일반 모드 | reduced-motion·기본값 |
|---|---|---|
| AnimatedList (B 한정 예외) | `/recommendations` 최초 resolved Featured 목록, route mount당 1회. 실제 보이는 canonical 카드 최대 4장만 240ms opacity 0.7→1·Y 8→0, 60ms stagger. clone·다른 선반·필터 변경·스크롤 왕복은 재생하지 않고 기존 C 백필은 유지 | 이동·stagger 없이 160ms opacity. 실행 중 reduce로 바뀌면 즉시 완료. JS 실패 시 완전히 보이는 목록 |
| TextType (랜딩 A의 예시 설명) — 2026-11-11 적용처 없음(표 아래) | 일반 랜딩 「例」 lead reason, mount당 1회. 실제 `contributions[]` 문장을 자소 단위로 최대 1100ms에 표시. 줄·공간을 처음부터 예약하고 작품명 강조 유지. 커서·삭제·반복 없음 | 전체 문장 즉시 표시. 접근성에는 항상 완성 문장 하나. `?landing=1`은 정적 |
| DNA 휠 (DNA A/E, 최신 샘플) | §5.2의 실제 축 원형 요약. 이전 SVG 직선 강조선 UI를 대체하며 새로운 축/수치는 만들지 않는다. 최초 진입 scale/opacity만 1회, 휠/목록 선택 상태 동기화 | 최종 geometry + 160ms opacity, 선택 indicator 이동 없음 |
| 띠지 (B 한정 예외) — 2026-11-11 폐기(표 아래) | 랜딩 Hero와 사용법 사이의 실제 사용 순서, 첫 viewport 진입 1회. 640ms opacity 0.7→1·X −16→0 후 정지. 줄바꿈 허용, 스크롤 속도 연동·무한 marquee·복제 문구 없음 | 정적 전체 문구. `?landing=1`도 정적. native scroll 유지 |
| 부족 선택 안내 (F) | STEP 1의 `次へ` 클릭·Enter·Space. 최소 개수 미달이면 진행·저장 없이 기존 tray ±4px/240ms 흔들림과 부족 개수 live 안내. 부족할 때도 안내를 받을 수 있는 버튼이며 실제 저장 중에만 disabled. 첫 등록 5개·add mode 1개 유지 | 정적 warn 보더·동일 부족 개수 안내 |
| spring (D 한정 예외) | 공용 `SegmentedControl`을 Library 상태 탭·Catalog 상세 `感想`에 적용하고 공용 Switch도 같은 Motion spring(stiffness 350, damping 24)을 사용. 한 중립 track 안의 채워진 accent 인디케이터와 `--on-accent` 선택 글자. 선택 배경·thumb만 실제 layout을 따라 이동하며 글자·control은 변형하지 않는다. 상세는 실제 저장된 감상 사이에서 이동하고 같은 감상을 다시 누르면 감상만 해제·인디케이터 제거 | 즉시 최종 선택. 최초 mount도 이동 없음. 실행 중 OS 설정 변경에도 즉시 반영. 키보드·focus·busy 유지 |
| shimmer | 표지는 이후 사용자 지정한 §4.1 공용 CoverShimmer(16px 망점 이동, 1.2s·성공 크로스페이드). 다른 추천·공유 loading은 기존 §2.5를 유지. 가짜 지연·재생 버튼 없음 | 표지는 이동 없는 망점·짧은 opacity, 다른 skeleton은 기존 1.6s opacity |
| StarBorder (DNA A의 다음 행동 안내) | reveal의 `おすすめを見る` 한 곳. 2400ms 뒤 accent 계열 gradient 테두리가 900ms 한 번 지나가고 종료. CTA는 처음부터 사용 가능. 다른 CTA·공유로 확장하지 않음 | 정적 테두리. focus ring·누를 영역 유지. 내부 장식만 transform/opacity |
| Noise — 2026-11-11 적용처 없음(표 아래) | 랜딩 「例」 말풍선에만 §3.2 정적 단색 종이 질감 opt-in | 동일 정적 질감. 추가 설정·저장 상태 없음 |

2026-11-11 홈 재구성(`03` §1, 사용자 결정(플랜 승인)): 위 표의 TextType·Noise는 랜딩 「例」 카드에만, 띠지는 Hero와 사용법 사이에만 허용한 효과다. 띠지는 2026-10-05 홈 개편에서 이미 사용법에 흡수됐고, 이번 재구성으로 「例」 카드와 사용법 섹션이 없어졌다. 따라서 세 효과는 현재 적용처가 없으며 구현하지 않는다. 히어로 말풍선 컷·무대 카드·펼침 말풍선으로 옮기지 않고, 다시 쓰려면 위치를 정하는 별도 사용자 결정이 필요하다.

상세 리디자인 후 감상 세그먼트는 読んだ일 때만 공개하며 다른 상태에서도 저장된 reaction은 보존한다. 공개는 콘텐츠 실제 높이+opacity 1회 spring이고 reduced-motion은 높이 이동 없이 opacity만이다.

공용 세그먼트의 anatomy는 샘플처럼 track 1개·4px 안쪽 여백·같은 행에서 균등하게 늘어나는 segment·채워진 인디케이터 1개다. track은 테두리 없는 `--surface-2` 면이고 track은 `--radius-card`(12px), 인디케이터는 4px 안쪽 여백을 뺀 8px이다(§2.3 중첩 규칙, 2026-11-11; 이전 1px `--line`, 10px/7px 파생값과 2026-10-07의 0은 폐기). 개별 segment에 선택 보더·별도 칩 배경을 만들지 않는다. Library만 내용에 따라 wrap하며 탭 semantics·ID·`aria-controls`·URL을 보존한다. 상세 감상은 4개가 한 줄이고 그룹 label은 track 밖에 둔다. Switch는 샘플의 46×26 track·20px 밝은 thumb·3px inset이며 on/off 모두 같은 밝은 thumb다. 공용 wrapper가 크기·색·spring·reduced-motion을 소유하고 feature는 option·값·선택 callback만 제공한다. 44px 조작 타깃은 유지한다.

추천 순서·`contributions[]`·부족 데이터 의미·검증·저장은 바꾸지 않는다. 시그니처 모먼트는 기존 세 곳이며, 동시 효과 family 최대 2개·로딩 외 상시 루프 0개를 유지한다. C 및 위 D spring의 layout 소유 컴포넌트만 local `domMax`를 허용한다. 다른 설정·Library 표면은 조용하게 유지한다.

### 6.2 G 허용 목록

2026-10-01 Taste 샘플의 radio 세그먼트도 같은 공용 track/indicator를 쓴다. positive 선택은 accent/on-accent, auto·less는 surface/text, exclude는 기존 경고 토큰을 사용한다. 「おすすめを調整」과 편집 범주 제목 옆 reset은 44px quiet icon button이며 범위가 있는 접근 이름과 tooltip을 가진다. 자동뿐인 범위는 disabled이고 펼침 trigger와 독립된다. reset은 같은 선택 indicator·저장 live message로 피드백하며 추가 모션을 만들지 않는다.

이 밖의 위치·효과는 구현하지 않는다.

| 효과 | 위치 | 한도 | 입력 조건 |
|---|---|---|---|
| 광택 (GlareHover 참고) | 무대 카드(§2.10): 추천 Featured 카드. 홈 히어로의 근거 무대에는 쓰지 않는다(2026-11-11) | 카드의 각도·위치·크기는 바꾸지 않는다. 포인터 위치 radial `--text-strong` 14%, 진입·이탈 opacity 250ms | fine pointer + hover만. 터치·펜은 D press만. 무대 카드의 제자리 공개와 같은 family로 세어 합성 2개를 넘지 않는다 |
| 마그넷 (Magnet 참고) | 랜딩 hero·마무리 CTA, /taste reveal의 「おすすめを見る」 | 포인터 거리 비례 이동 최대 x 10px·y 6px, 이탈 180ms 복귀. hover 그림자는 기존 `--shadow-raised` 1단 | fine pointer + hover만. 클릭 영역·focus ring 위치는 이동하지 않는 래퍼 기준 |
| 확정 스파크 (ClickSpark 참고) | 랜딩 CTA 클릭, 「読みたい」 저장 성공, 온보딩 작품 선택 성공 | 입자 최대 12개, `--accent` 계열, 36–90px 방사, 480–800ms, `aria-hidden`·`pointer-events: none`, 저장 성공 뒤에만 발화 | 모든 입력. 실패·취소·「読んだ」·「興味なし」·「今日はパス」·삭제처럼 부정·교정 액션에는 쓰지 않는다 |

상세 「あなたとの相性」의 스포트라이트는 2026-10-01 후속 사용자 요청으로 폐기했다. 포인터 추적 조명·전용 overlay를 만들지 않는다.

- 포인터 좌표는 `pointermove`에서 rAF로 묶어 CSS 변수(`--light-x`, `--magnet-x` 등)에 직접 쓰고 React state로 다시 렌더하지 않는다. 좌표를 따라가는 radial 배경 갱신은 보간 애니메이션이 아니며, 보간은 transform·opacity만 한다. `will-change`는 hover 중에만 둔다.
- dialog·sheet·panel·설정·Library·온보딩 STEP 2와 텍스트 입력 영역에는 G를 쓰지 않는다(§9).

전역 규칙:

- **상시 자동 루프 애니메이션 0개.** skeleton 시머·펄스만 예외(로딩 중 한정). 광택 sweep(§5.2)은 진입당 1회로 끝나며 반복하지 않는다.
- 한 인터랙션이 동시에 발화하는 **합성 효과 family**는 최대 2개다(예: 카드 제거/layout + 백필). DNA의 여러 카드·막대 instance stagger는 하나의 A family로 센다.
- transform/opacity 외 프로퍼티 애니메이션 금지(height 축소는 추천 카드 제거 시에 허용, contain 처리). 2026-10-01 상세 리디자인의 감상 공개 height와 공통 커버 loading 망점 background-position은 사용자 승인 한정 예외다. 위 펼침 카드(Anchor Shelf)의 article width는 예외다. 이전 랜딩 `ShowcaseCard` featured 핸드오프(article `width` 11rem↔14rem) 예외는 해당 컴포넌트가 없어져 폐기했다(2026-11-11 정리). 무대 카드(추천 featured card)는 고정 344×448px article 안에서 표지 stage의 flex 잔여 높이, reason `max-height`, action rail `height`·`margin`을 400ms(`--motion-duration-reveal-step`, `--motion-ease-direct`)로 함께 보간할 수 있다. 이 예외는 형제 위치 불변, overflow clipping, 최대 3줄 reason, 44px rail, coarse pointer 상시 최종 상태, reduced-motion 즉시 완료를 모두 만족해야 한다. 표지 DOM·텍스트/control 크기는 보간하지 않는다. color·background·border·box-shadow·font-weight 상태는 보간하지 않고 즉시 바꾼다.
- 자동재생 캐러셀·스크롤 하이재킹·패럴랙스·페이지 넘김 효과·효과음 문자 장식과 generic hover Y축 lift를 금지한다. 커서 추적은 G 허용 목록의 광택·마그넷만 허용하며, 각도를 바꾸는 기울기는 어떤 요소에도 쓰지 않는다. 모바일에서 hover 의존 정보 금지. 2026-11-11 사용자 결정(플랜 승인): 홈 히어로 아래의 스크롤 연동 연출(sticky 스크롤 무대, 흩어진 글자 제목, 회전하는 17축 바퀴, bloom 그리드)을 없애고 히어로는 시안 A의 「근거 무대」로 다시 만든다(`03` §1) — 일러스트 장면의 반복 모션, 바탕 그림문자, 효과음 글자 컷, 히어로 퇴장 효과를 폐기해 이 전역 규칙과 `AGENTS.md` §4(상시 루프 금지)에 대한 히어로의 예외가 없어졌다. 홈에는 스크롤 진행에 묶인 변형을 두지 않으며 카드·선반 모션은 §2.10을 따른다.
- B의 allowlist는 `/onboarding` Step 1 resolved content(첫 등록·add mode), reveal 요청으로 시작하지 않은 ordinary `/taste`, 유효한 `/works/[workId]` resolved Catalog 상세, `found`인 `/works/external` resolved 상세와 §6.1의 최초 Featured 카드다(랜딩 띠지는 2026-11-11 폐기). Catalog는 `workId`, external은 external ID가 바뀐 새 route mount에서 다시 실행할 수 있다.
- §6.1의 한정 예외(최초 Featured 카드) 외에는 B를 landing, A로 시작한 `/taste`, `/recommendations`, `/library`, `/settings`, onboarding Step 2, loading·hydration/redirect guard·skeleton·empty·invalid-link·local-missing·corrupt·unavailable·error, dialog·modal·drawer·panel·sheet·feedback surface에 적용하지 않는다. query cleanup·local state 변경·onboarding step 변경·dialog open/close·BFCache resume도 replay trigger가 아니다.
- B는 AppShell/global layout이 아니라 eligible resolved-content root에만 적용한다. CSS 기본값은 최종 위치에서 완전히 보이는 상태이며 keyframe은 `prefers-reduced-motion: no-preference` 안에만 둔다. 8px 이동 중에도 opacity 0으로 만들어 콘텐츠를 완전히 숨기지 않고, 실패 시 최종 상태가 남는다.
- E와 F는 CSS가 소유한다. ordinary FactorBar E는 static CSS 기본값을 target `scaleX`로 두고 underlying analysis 값 변경 시 delay 0 / 240ms만 적용한다. 추천 adjustment의 직접 피드백은 D의 선택 indicator/text와 저장 live message가 소유하며 FactorBar success highlight를 만들지 않는다. F 흔들림도 CSS만 사용한다.
- `prefers-reduced-motion: reduce` — **대체 원칙(2026-10-01 사용자 결정):** reduce는 모션을 없애는 스위치가 아니라 멀미를 유발하는 움직임을 의미가 같은 조용한 변화로 바꾸는 설정이다. 이동·확대/축소·회전·기울기·패럴랙스·포인터 추적·입자·반복은 제거하고, 상태와 인과를 전하는 opacity·색 변화는 짧게 남긴다. 정보·상태·focus·live message는 일반 모드와 동일하다.

  | 분류 | reduce에서의 대체 |
  |---|---|
  | A 1회 reveal | 같은 순서를 opacity만으로 총 600ms 이내(§5.1·§5.2). marker는 소비한다. 실행 중 reduce로 바뀌면 즉시 완료 |
  | B 페이지 진입 | 8px 이동 없이 160ms opacity만 |
  | C 상태 전환 | `layout={false}`. 제거·백필은 이동 없이 160ms opacity 크로스페이드, 순서·focus·live message는 즉시 반영 |
  | D 직접 조작 | scale·스탬프 제거, 선택 체크·색 상태는 120ms opacity로 유지. 선반 카드 문법(§2.10)의 무대·펼침·모핑 카드는 현재 pointer/focus 상태의 최종 geometry와 같은 정보를 즉시 표시 |
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

Shelf 구현 계약(캐러셀 대체): `overflow-x: auto` + CSS scroll-snap + 카드 `scroll-snap-align: start` + 데스크톱용 이전/다음 버튼(`scrollBy`, reduced-motion 시 instant) + `scrollbar-width: none`. 2026-10-12 사용자 요청: 카드가 잘린 것처럼 보이지 않도록 desktop fine-pointer overlay Shelf의 scroll viewport는 바깥 page gutter(최대 96px, 이하 「번짐」)까지 번지고 양끝 fade가 이웃 카드를 canvas로 녹인다. 문서 가로 overflow는 만들지 않는다.

2026-11-11 위임 결정 — 시작선과 overlay 버튼(이전의 control gutter 안을 대체): 이전에는 좌우에 control 크기+간격(52px) gutter를 예약해 desktop 첫 카드가 제목보다 52px 안쪽에서 시작했다. 이제 gutter를 예약하지 않는다.

- **시작선:** track padding은 번짐 폭과 같아서, 처음 위치의 첫 카드는 모든 breakpoint에서 선반 제목의 왼쪽 시작선(페이지 gutter)에서 시작하고 마지막 위치의 마지막 카드는 콘텐츠 오른쪽 끝에서 끝난다. 좁은 화면과 coarse pointer는 번짐 없이 콘텐츠 폭 그대로다.
- **가시 영역·fade:** fade 폭과 `scroll-padding`은 `max(번짐, --space-12)`다. 넓은 화면에서는 fade가 바깥 gutter에만 놓여 완전히 보이는 카드를 덮지 않고, 번짐이 작은 화면에서도 최소 48px fade가 남는다. 오른쪽 fade는 앞으로 더 갈 카드가 있을 때만, 왼쪽 fade는 스크롤한 뒤에만 보인다. 페이지 이동과 「n–m / N作品」 범위(그 영역 안에 절반 이상 보이는 카드), 펼침 카드의 방향 선택·스크롤 보정·선반 밖으로 나가지 않는 규칙은 모두 이 `scroll-padding` 안쪽 영역 기준이다. 번짐이 48px보다 작은 화면에서 스크롤 시작 위치의 첫 카드는 이 영역보다 왼쪽(왼쪽 fade가 없는 자리)에 있으며, 펼칠 때 스크롤하지 않고 그 자리에서 연다.
- **버튼:** 44px 원형 버튼은 자리를 예약하지 않는 overlay로 트랙 양끝, 첫 카드 표지의 세로 중앙에 놓인다. 번짐 안에 버튼과 `--space-2` 간격이 들어갈 자리가 있으면 콘텐츠 시작선 바깥(카드 밖)에, 없으면 가장자리 카드 위에 겹친다. 처음 위치에는 이전 버튼을, 마지막 위치에는 다음 버튼을 렌더하지 않는다. fine pointer에서 버튼은 쉬는 동안 투명하고 선반 hover·focus-within에서 §6 D의 `--motion-duration-feedback` opacity로 나타난다(reduced-motion도 opacity만이라 그대로 허용). 버튼은 트랙 뒤 Tab 순서에 있고 포커스를 받으면 보인다. 포커스된 버튼이 끝에 닿아 사라지면 반대쪽 버튼으로 포커스를 옮긴다. 제목 줄에 화살표를 두는 선반(`controlsPlacement="heading"`, 온보딩 작품 선반·상세 같은 작가 선반)은 gutter가 없으므로 기존처럼 제목 줄에 두고 끝에서 disabled된다.
- **겹침 순서:** 선반의 fade·버튼은 선반 안의 자기 stacking context(`isolation: isolate`)에서만 카드 위에 놓인다. sticky 헤더(GNB)·추천 선반 목차·Snackbar·dialog 위로 올라오지 않는다(이전에는 같은 z 단계의 선반 overlay가 문서 순서상 헤더 위에 그려져 accent 트리거를 가리고 흐리게 했다).

Featured를 포함한 모든 Shelf는 canonical 카드를 한 번씩만 그리는 유한 트랙이며 pointer·touch·키보드 모두 끝에서 wrap하지 않는다(§2.8, 2026-10-09 #77; 이전 Featured 3-copy 루프와 clone은 폐기). 키보드는 canonical 카드 간 Tab/화살표다.

## 8. 성능 예산

### 8.1 판정값

- 추천 페이지 초기 JS는 **250,000 bytes gzip 미만**이다. modern Chromium이 cold direct `/recommendations` 진입에서 사용자 입력 전 `networkidle`까지 실제 요청한 unique same-origin JavaScript를 대상으로 한다. URL을 TanStack Start/Vite build manifest의 emitted file에 대응해 dedupe하고 exact file gzip level 9 합계를 낸다. interaction-only chunk는 제외하고 inline executable script와 initial HTML bytes는 별도 보고한다.
- LCP: 랜딩 resolved introduction과 추천 화면에서 브라우저가 실제로 선택한 가장 큰 정당한 콘텐츠 후보의 cold mobile 5회 중앙값은 각각 < 3.5s다. 가시적인 태그라인·설명문을 숨기거나 축소하거나, mobile 96px 표지를 확대해 특정 element를 LCP로 강제하지 않는다. 랜딩 첫 로고 후보 시각과 추천 1위 표지의 request·삽입·load 시각은 LCP와 별도로 기록하고, 1위 표지는 eager/high-priority 계약을 유지한다.
- CLS < 0.05: 같은 cold mobile 5회 중앙값. 표지 aspect-ratio 고정과 폰트 메트릭 폴백을 유지한다.
- 60fps는 A/C 목표다. frozen local 4× CPU 환경에서 추천 C 제거·layout·백필의 median effective FPS가 30 미만이면 그 C owner의 layout motion을 비활성화한 뒤 다시 판정한다. runtime benchmark나 임의 기기 class는 만들지 않는다.
- skeleton pulse는 정확히 1.2s이며 loading 중 한정이다. 대형 hero 블러 배경은 화면당 1개다. 무대 카드(추천 featured card, §2.10)와 홈 히어로 근거 무대의 같은-source local blur는 색 구분을 위한 한정 예외이며 visible card 주변에서만 래스터되고 `will-change`·별도 이미지 요청·palette 연산을 추가하지 않는다.

### 8.2 재현 가능한 production-local 계측

- `pnpm build` 뒤 `pnpm start` production server와 현재 Playwright Chromium을 사용한다. dev server나 build summary, Lighthouse 수치로 아래 직접 계측을 대체하지 않는다.
- authoritative local mobile profile은 390×844, DPR 3, touch/mobile, CDP CPU 4× slowdown, 150ms RTT, 1.6Mbit/s down, 0.75Mbit/s up이다. 독립 browser context 5개에서 HTTP cache를 비운 cold run을 보존하고 중앙값으로 판정한다. 필요한 usable profile/recommendation state는 test-only route나 direct IndexedDB 주입 없이 실제 제품 flow로 만든 뒤 IndexedDB만 유지한다. Slice 11에서는 service worker를 우회한다.
- LCP·CLS `PerformanceObserver`는 app script와 navigation 전에 주입하고 buffered `largest-contentful-paint`, `layout-shift`(`hadRecentInput === false`)를 고정 관측 창까지 수집한다. 관측 중 사용자 입력은 하지 않는다.
- 1위 표지 provider 변동을 고정 fixture로 격리할 때도 실제 `CoverImage` 경로를 통과해야 한다. fulfilled bytes에 CDP throttle이 적용됨을 증명하거나 fixture 응답 자체가 위 latency·transfer profile을 재현해야 하며, 즉시 fulfill된 이미지를 mobile LCP gate로 쓰지 않는다. unmocked run은 진단으로 별도 기록할 수 있다.
- 각 run의 build identity·Node/package/browser version, CDP 조건, raw LCP/CLS, rAF frame interval/FPS, requested JS URL→emitted file→raw/gzip bytes와 total을 machine-readable artifact로 보존한다. production-local 결과는 배포·실기기 성능 증거가 아니며 중급 Android 열·프레임, real cellular/provider LCP와 iOS/Android 설치 모드는 별도 수동 검증 한계로 남긴다.

## 9. 조용한 표면 선언

다음 화면·영역에는 시그니처·B 진입·불필요한 설명형 장식을 **의도적으로 두지 않는다**: 랜딩의 A 외 별도 B, Library의 기능 배너 외 장식, 설정, 온보딩 STEP 2(불호 입력은 감정적으로 중립해야 함), 모든 dialog·panel·sheet. §2.5 기능 배너와 §6.1의 최초 Featured 카드·Library 탭 및 설정 Switch의 D spring만 명시적 예외다(랜딩 띠지는 2026-11-11 폐기). 추천 피드는 §6.1의 첫 Featured 표시, §2.8 고정 poster 직접 피드백, C 제거/백필, §6 G 허용 목록(Featured 광택, 「読みたい」 확정 스파크)을 허용한다. 표지 카드의 §2.10 접근 반응(무대·펼침·모핑, §6 D)은 장식이 아니라 문법의 일부이므로 §2.10의 적용 위치(홈 히어로 아래 선반, `/taste` 대표작, `/share` 추천작, `/library` 그리드의 제자리 공개)에 허용한다. 포인터 광택(G)은 무대 등급에만 쓰고 Library에는 쓰지 않는다(§6.2). Quick Preview와 Library sheet/panel entry는 최종 상태로 즉시 연다. cover/image의 실제 loading→성공 크로스페이드는 §4.1의 공용 표지 예외를 따른다.
