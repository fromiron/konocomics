# 03 — UX 화면 계약 (Screen Contracts)

> 각 화면의 구현 계약. Router/search/SSR 소유권은 `08-tanstack-start-migration.md`, 비주얼 토큰·모션은 `04-visual-interaction-spec.md`, 데이터 흐름은 `05-architecture.md` 참조.
> 브레이크포인트: **mobile < 768px ≤ tablet < 1024px ≤ desktop**. 태블릿은 명시된 경우에만 desktop과 다르게 취급한다.

---

## 0. 전역 셸과 내비게이션

제품은 dark-only다. light mode와 theme selector를 렌더하지 않는다.

### 구조

- `>=768px`: dark 상단 GNB만 표시한다. 좌측 로고(**kono**co**mi**cs), 우측 `おすすめ`(/recommendations), `DNA`(/taste), `ライブラリ`(/library), `設定`(/settings)을 둔다.
- `<768px`: post-onboarding route에서 하단 탭 바 4개만 표시한다. 높이 64px, 아이콘+레이블, 터치 타깃 ≥44×44다. `/`와 `/onboarding`은 immersive route라 bottom navigation을 표시하지 않는다.
- post-onboarding 모바일 footer는 Discover/Understand/Manage 라우트 그룹 없이 local-first 1줄과 `Supported by Rakuten Developers`만 둔다. immersive `/`·`/onboarding` 모바일 footer는 같은 두 줄에 設定 링크를 더한다. `>=768px` footer sitemap은 유지한다.
- 두 navigation은 CSS media query로 상호 배타적으로 숨기며 숨겨진 쪽은 accessibility tree에도 남기지 않는다. 로그인·계정·아바타·알림 control은 없다. Global Search는 실제 dialog/sheet 기능이 연결된 경우에만 표시한다.
- Catalog 상세 `/works/[workId]`와 고정 external 상세 `/works/external?workId=<ExternalWorkId>`는 탭 바를 유지한 채 스택처럼 열린다. 뒤로가기는 브라우저 history다.
- 2026-09-11 사용자 지시에 따라 전역 document scroll container는 `scrollbar-gutter: stable`로 스크롤바 자리를 확보한다. 필터·페이지 이동으로 세로 스크롤바가 생기거나 사라져도 본문 가로 폭·중앙 정렬은 유지한다. overlay scrollbar 환경에는 불필요한 별도 여백을 더하지 않는다.

### 전역 상태

- **Catalog 로드 실패(치명):** 풀스크린 오류 — 「カタログを読み込めませんでした」 + 再試行 버튼. 앱의 나머지는 렌더하지 않는다.
- **오프라인:** Dexie 기반 기능(DNA·Library·기존 추천)은 정상. 라쿠텐 의존 요소만 개별 폴백(각 화면 참조). 전역 배너는 두지 않는다.
- **라우트 가드:** 현재 Catalog의 서로 다른 favorite/liked 작품이 5개 이상이면 완료 marker와 무관하게 usable profile이다. 5개 미만+`onboardingCompletedAt` 존재는 `/onboarding` add recovery, 5개 미만+marker `null`은 first-run으로 보낸다. /taste·/recommendations만 이 가드를 적용하고 /library·/settings는 온보딩 전에도 접근·Export할 수 있다.

### URL 상태

- 모든 route는 Zod `validateSearch`를 갖고 malformed 값은 안전한 기본값으로 정규화한다.
- `/onboarding`: `q`, `genre`, `shelf`는 **서로 배타적인 discovery mode 하나**다. 쓰기와 해석은 `q` > 유효한 collection `shelf` > `genre` 우선이며 AND 교집합 필터를 쓰지 않는다. `q` 입력은 genre/shelf를 제거하고, genre는 q/shelf를, collection은 q/genre를, 닫기는 shelf를 제거한다. 혼합 URL은 같은 우선순위로 정규화한다. back/forward는 그 mode와 collection panel을 복원한다. `/taste`: `mode`, `group`; `/recommendations`: `preview`, `genre`, `sort`, `shelf`; `/library`: `state`, `q`, `sort`, `view`, 선택 시 `favorite=1`, 2페이지부터 `page`; `/settings`: `section`.
- `?landing=1`과 `?reveal=1`은 기존 호환 계약을 유지한다. `/works/external`의 typed `workId`는 missing/duplicate/empty/malformed를 기본값으로 덮지 않고 invalid-link 상태로 보낸다.
- 선택 작품, DNA adjustment, 추천 policy/result, provider cache, 편집 draft, mutation/animation/scroll state는 URL에 넣지 않는다.

### 접근성(전역)

- 모든 인터랙티브 요소 `focus-visible` 링(2px, accent) 유지. 마우스 클릭 시에는 링 미표시.
- 페이지 전환 시 `<h1>`으로 포커스 이동 또는 라우트 어나운스.
- 장식 요소(스크린톤, 블러 배경)는 전부 `aria-hidden="true"`.
- 언어: `<html lang="ja">`.

---

## 1. `/` 랜딩

### 목적

30초 안에 "무엇을 하는 서비스인지"와 "시작하면 무엇을 받는지"를 전달하고 온보딩으로 보낸다. **일반 재방문의 usable profile은 이 화면을 보지 않는다** — hydration 뒤 현재 Catalog positive anchor가 5개 이상이면 `/recommendations`로 클라이언트 리다이렉트한다. 판정 중에는 정적 로고만 표시하고 `?landing=1`이면 리다이렉트를 우회한다.

### 주요 액션

CTA 버튼 1개: **「好きなマンガから始める」** → /onboarding.

### 정보 위계

1. 실제 Catalog 표지의 hero backdrop/mosaic + konomi 2톤 로고와 태그라인 「好みから見つける、次のマンガ。」
2. CTA와 데이터가 브라우저에만 저장된다는 짧은 privacy benefit
3. 개인화라고 주장하지 않는 Catalog showcase Shelf
4. 첫 방문자를 위해 명시적으로 큐레이션한 editorial Top 10 ranking(`<ol>`). 시장 popularity나 개인화 결과로 주장하지 않고 「今週の人気」 같은 문구는 쓰지 않는다. 각 card는 표지 위에 큰 텍스트 순위를 고정 표시하며 generic card Y축 lift는 적용하지 않는다.
5. discovery Shelf와 3단 설명: 選ぶ → 好みが見える → 理由つきでおすすめ
6. 실제 route만 연결한 footer + `Supported by Rakuten Developers`

### 상태

- Slice 10 initial/hydrating: 정적 2톤 로고만 표시한다. IndexedDB와 bundled Catalog를 읽기 전에 랜딩 본문이나 CTA를 추측 렌더하지 않는다.
- usable profile: hydration 판정 뒤 콘텐츠 플래시 없이 `/recommendations`로 이동한다. `onboardingCompletedAt`만으로 redirect하지 않는다.
- `?landing=1`: profile 상태와 무관하게 정적 소개를 표시한다. `logoRevealed` marker는 읽거나 쓰거나 지우지 않고, 우회 자체가 DB·profile·draft·cache를 변경하지 않는다.
- Slice 11: usable profile이 아닌 일반 first-run의 **resolved introduction**에서만 로고 reveal을 세션당 1회 적용하고 이후 방문은 정적 로고다. resolved introduction은 hydration 판정이 끝나 소개를 표시하기로 확정된 상태를 뜻한다.

### 반응형

- mobile: compact hero의 첫 viewport에 로고+태그라인+CTA를 두고 discovery Shelf는 2.4장을 보여 overflow를 암시한다. editorial Top 10은 96px 폭을 사용한다. bottom navigation은 없다.
- desktop: hero 2열 — 좌측 텍스트+CTA, 우측 실제 세로 표지 기반 backdrop/mosaic. 아래에는 1200px media container의 Shelf/ranking을 둔다. editorial Top 10은 112px 폭으로 부분 노출+가로 탐색을 만들고, discovery `cover-overlay`는 152px 폭으로 7장을 한 화면에 둔다.

### 인터랙션·모션

- Slice 10은 정적 로고와 직접 피드백만 구현한다. 랜딩 reveal·페이지 진입 모션은 Slice 11 전용이다.
- Slice 11 로고 reveal은 일반 first-run의 resolved introduction에서 세션당 1회, 총 1.4초 이내로만 실행한다. 최종 2톤 로고·`好み` 캡션·태그라인·설명·CTA는 resolved introduction의 첫 paint부터 최종 DOM에 존재하며 CTA는 항상 조작 가능하다. 2톤 base·태그라인·설명·CTA는 시각 최종 상태를 유지하고, 고정 웨이트 단색 오버레이와 캡션만 움직인다.
- 탭/클릭·키 입력·휠/스크롤은 기본 동작을 소비하지 않고 reveal만 즉시 완료한다. 완료·스킵·`pagehide`·unmount에서는 controls·timer·pending continuation과 모든 listener를 정리한다.
- reduced-motion: reveal 생략, 정적 2톤 로고.

### 수용 기준

- [ ] hydration 판정 동안 정적 로고만 보이고 랜딩 본문이 플래시하지 않는다.
- [ ] 현재 Catalog positive anchor가 5개 이상이면 marker 유무와 무관하게 `/recommendations`로 이동한다.
- [ ] `?landing=1`은 usable profile에도 정적 소개를 표시하고 `logoRevealed` marker를 읽거나 쓰거나 지우지 않으며 다른 로컬 상태도 변경하지 않는다.
- [ ] CTA로 first-run 온보딩에 진입할 수 있고 라쿠텐 이미지 차단 상태에서도 hero가 placeholder 표지로 성립한다.
- [ ] showcase/ranking은 bundled Catalog ID만 사용하고 개인화·인기 수치를 근거 없이 주장하지 않는다.
- [ ] Slice 10에는 reveal이 없고, Slice 11에서 marker 선기록·1회 재생·비소비 스킵·정리·CTA 상시 조작성·실패 시 정적 완결·reduced-motion 동등성을 검증한다.

---

## 2. `/onboarding` — STEP 1: 좋아한 작품 선택

### 목적

취향 판독에 필요한 positive anchor 5~10개를 최소 마찰로 수집. reaction(favorite/liked)도 함께.

### 주요 액션

작품 카드 탭 = 선택(기본 `liked`). 하단 고정 진행 버튼: 5개 미만 「あと n 作品」(disabled), 5개 이상 「次へ (n/10)」.

### 정보 위계

1. 안내 1줄: 「好きなマンガを 5〜10 作品えらんでください」
2. 검색 입력(Fuse.js, Catalog의 onboardingEligible 대상)
3. 장르 칩: アクション / ファンタジー / 歴史 / SF / ミステリー / その他
4. 주 탐색 Shelf 「選びやすい作品」. collection panel이 열려도 이 제목과 작품은 교체되거나 사라지지 않는다.
5. 「コレクションから探す」 compact 2열 disclosure trigger. 클릭은 새 route/modal/배너/hero가 아니라 트리거 아래 full-width inline region 하나를 연다. 같은 trigger 재클릭은 닫고, 다른 trigger는 같은 region 내용을 교체한다.
6. 하단 고정 Selected Tray: 선택된 표지 썸네일 + 개수 + 진행 버튼

이 viewport의 편집적 순간은 위 inline collection 자체다. 온보딩에 새 배너나 hero를 추가하지 않는다. 브랜드 복제(Spotify Green/로고/재생 UI/정확한 그래픽)가 아니라 discovery → 즉시 저장되는 큐레이션 흐름이다.

### 컴포넌트 책임

- `WorkSearchInput`: 300ms 디바운스, NFKC·가나 정규화 질의, 결과는 Shelf 영역을 대체하는 그리드로 표시. 비우면 Shelf 복귀.
- `AnchorCoverCard`: 표지 + 제목. 상태 unselected / selected(liked) / selected(favorite). 선택 카드에서 별 아이콘 탭 → favorite 토글. 선택 시 체크 오버레이 + 테두리 accent. collection panel 카드도 같은 컴포넌트와 `togglePositiveSelection` / `positiveByWorkId`를 재사용한다.
- `SelectedTray`: 썸네일 탭 → 선택 해제. 가로 스크롤. Motion layout으로 추가/제거 재배치.
- `OnboardingCollectionGrid`: compact 2열 `type="button"` disclosure. `aria-expanded`와 공통 `aria-controls`. 열린 panel은 고정 id + 보이는 제목을 `aria-labelledby`로 연결한 named region. 트리거 장식 표지는 `aria-hidden`. nested interactive 금지.

### 상태

- initial: 「選びやすい作品」 Shelf 표시, collection trigger는 접힘, tray 비어 있음 + 「まだ選ばれていません」.
- 검색 결과 없음: 「見つかりませんでした。別の書き方で試してください」 + Catalog에 없는 작품은 라이브러리에서 나중에 추가할 수 있다는 1줄 안내.
- collection panel: onboarding·recommendation eligible, persisted work 제외, workId 중복 제거, 해당 preset만 적용. 표시는 desktop `min(12, available)`, mobile `min(8, available)`. 「もっと見る」 1회로 `min(40, available)`까지이며 40 초과 금지. 후보 0이면 named empty state.
- 10개 도달: 추가 선택 시 카드가 선택되지 않고 tray가 짧게 흔들리며(4px, 120ms×2) 안내 토스트 「最大 10 作品までです」. panel 선택도 같은 10개 limit·draft·aria-live·favorite 경로를 쓴다.
- 중단·복귀: `OnboardingDraft.positiveEntries[]`에 `workId`와 `favorite | liked` reaction을 함께 담아 매 변경 시 Dexie에 저장. 재진입 시 reaction까지 복원. collection 공개 여부는 URL `shelf`로 복원한다.
- 표지 로드 실패: 타이포그래피 placeholder(`04` §4.3). 선택 기능은 동일.

### 반응형

- mobile: Shelf 카드 폭 ~104px(표지 3:4.3 비율), 한 화면에 3.5장 보이게(스크롤 가능성 암시). tray 높이 88px. 장르 칩은 wrap하고 단계 progress는 compact 처리해 가로 스크롤 영역이 되지 않게 한다. Selected Tray와 work shelf는 시맨틱이 다른 가로 영역으로 유지한다. collection trigger는 320px에서도 2열로 줄바꿈되며 가로 오버플로를 만들지 않는다.
- desktop: Shelf 대신 장르 섹션별 그리드(6~8열)로 전개해도 좋으나, **Shelf 유지 + 카드 폭 128px**로 통일한다(구현 단순화, 좌우 화살표 버튼 표시). collection trigger도 같은 2열 compact disclosure다.

### 인터랙션

- 키보드: 카드로 Tab 이동, Enter/Space 선택 토글. Shelf 내 좌우 화살표로 이동(roving tabindex). 검색 입력 `/` 단축키 없음(일본어 IME 간섭 방지). collection trigger는 포커스를 유지하고, Tab으로 같은 페이지의 named panel에 진입한다. 포커스를 panel로 옮기지 않는다.
- 작품 카드에 `aria-pressed` 상태. 선택 시 「選択済み」 어나운스. collection trigger는 `aria-expanded`이며 `aria-pressed`를 쓰지 않는다.
- collection trigger·panel 컨트롤은 44px, `focus-visible` 링, 장식 `aria-hidden`, `prefers-reduced-motion`에서 panel 입장 모션 생략.

### 모션

선택 시 카드 → tray로의 fly-to 애니메이션은 **하지 않는다**(구현·성능 대비 가치 낮음). tray 내 썸네일 등장은 Motion layout(200ms spring). 카드 선택 피드백은 120ms scale 0.97→1 + 체크 페이드.

### 수용 기준

- [ ] 5개 미만에서 진행 버튼이 disabled + 남은 개수 표기.
- [ ] favorite/liked가 구분 저장되고 STEP 2로 전달된다.
- [ ] 「ダンジョン飯」를 히라가나(だんじょんめし)로 검색해도 찾을 수 있다(가나 필드).
- [ ] 새로고침 후 선택 상태가 복원된다.
- [ ] 키보드만으로 8개 선택 → 다음 단계 진행이 가능하다.
- [ ] 「選びやすい作品」는 collection panel이 열려도 유지되고, panel에서 고른 작품이 tray/draft/aria-live/10개 limit에 즉시 반영된다.
- [ ] collection URL `shelf`와 검색 `q`·장르 `genre`는 한 번에 하나만 유효하며 back/forward가 panel 공개를 복원한다.

### 기존 프로필 작품 추가 모드

`/taste`의 「作品を追加して精度を上げる」로 재진입한 경우 첫 등록과 구분되는 `mode="add"` draft를 사용한다.

- 기존 `userWorks`의 작품은 Shelf·검색에서 제외하고 저장 경계에서도 중복을 거부한다.
- 최초 완료 marker가 있으나 Catalog 교체로 현재 positive anchor가 5개 미만인 경우도 add mode로 진입한다. first-run 저장을 재시도하지 않으며 현재 Catalog 기준 5개를 회복할 때까지 보호된 경로는 온보딩으로 돌아온다.
- 이 세션에서 새 positive 작품 1~10개를 받는다. 1개부터 「追加する (n/10)」가 활성화되며 STEP 2는 표시하지 않는다. 10개는 세션 상한이고 기존 기록을 포함한 누적 상한은 없다.
- 헤더는 「好きなマンガを追加してください」와 1~10개 안내를 사용하고 tray는 「追加するマンガ」로 명명한다.
- 「DNAに戻る」는 현재 add draft를 보존하고 `/taste`로 돌아간다. 별도 「入力内容を破棄」만 draft를 삭제한다.
- 완료는 신규 positive만 insert-only로 추가하고 기존 `UserWorkRecord` 전체와 최초 `onboardingCompletedAt`을 보존한다. 성공 시 draft를 삭제하고 reveal 없이 `/taste`로 돌아간다.
- [ ] 새 작품 1개만으로 완료할 수 있고 기존 작품·진행률·사유·시각은 변하지 않는다.
- [ ] 기존 workId 충돌은 draft와 기존 기록을 보존한 채 전체 거부된다.
- [ ] 닫기 후 재진입하면 reaction을 포함한 draft가 복원되고, 명시적 폐기 후에는 빈 add draft로 시작한다.
- [ ] 완료 후 `?reveal=1` 없이 `/taste`로 복귀하며 최초 reveal marker는 변하지 않는다.

---

## 3. `/onboarding` — STEP 2: 불호 작품 (선택 단계)

### 목적

이유 있는 negative anchor 0~3개 수집. **건너뛰기가 1급 경로다**(선택하지 않음 ≠ 불호, 원칙 3).

### 주요 액션

「スキップ」와 「好みを見る」(둘 다 상시 활성) → STEP 3(/taste?reveal=1).

### 정보 위계

1. 안내: 「合わなかった・途中でやめたマンガはありますか?(任意)」
2. 검색 입력 (STEP 1과 동일 컴포넌트, Catalog 전체 대상)
3. 작품을 고르면 카드 확정 전에 작품별 disposition radiogroup 「この作品について」를 표시: `合わなかった` / `途中でやめた`. 둘 중 하나를 고른 작품만 선택된 negative entry가 된다.
4. 선택된 negative 작품 카드: disposition 아래 **이유 칩 멀티 선택** — §6.7의 12사유 + 외부 사유(休載した/時間がなかった 등) + 「なんとなく合わなかった」
5. 진행 버튼

### 상태

- 0개 선택: 「スキップ」가 시각적 주 버튼.
- 이유 미선택 negative 작품: 선택한 disposition의 reason bucket에 `vagueDislike`로 저장됨을 카드에 소문구로 표시 「理由なし = 弱くだけ反映されます」.
- STEP 1에서 선택한 작품은 검색 결과에서 「好きに選択済み」 배지와 함께 비활성.
- 중단·복귀: `OnboardingDraft.negativeEntries[]`의 disposition과 reason id를 함께 저장하고 그대로 복원한다.

### 인터랙션·접근성

- disposition은 작품마다 accessible name을 가진 필수 radiogroup이다. Tab으로 그룹에 진입하고 화살표 키로 `合わなかった` / `途中でやめた`를 선택한다. 선택 전 작품은 draft에 넣지 않아 암묵적 기본값을 만들지 않는다.
- 이유 칩은 토글 버튼 그룹(`aria-pressed`), 칩당 최소 높이 44px.
- 외부 사유 선택 시 「おすすめの計算には使いません」 헬퍼 텍스트.

### 수용 기준

- [ ] 아무것도 선택하지 않고 스킵해도 DNA가 정상 생성된다.
- [ ] `合わなかった`는 `readingState="completed"` + `reaction="disliked"` + `negativeReasons`, `途中でやめた`는 `readingState="dropped"` + reaction 미지정 + `droppedReasons`로 저장된다.
- [ ] 이유 미선택은 선택한 disposition의 reason bucket에 `vagueDislike` 하나로 저장되며, disposition·사유는 새로고침 후에도 복원된다.
- [ ] 외부 사유만 선택된 작품은 엔진 감점에 사용되지 않는다(단위 테스트로 검증).

---

## 4. `/taste` — Manga DNA (reveal + 보정)

### 목적

(a) 온보딩 직후: 분석 결과를 "결과물"로 공개하는 보상 화면(가설 E). (b) 상시: DNA 분석값 열람과 추천 반영 설정. 동일 화면, `?reveal=1`일 때만 1회 reveal 모드.

### 주요 액션

- reveal 모드: 하단 고정 CTA 「おすすめを見る」.
- 상시 모드: 추천 반영 radio 변경 자체가 액션. 저장 버튼 없이 즉시 Dexie에 반영하고, 성공 시 factor와 선택값을 포함한 스낵바를 제공한다(예: 「『戦略的な展開』のおすすめへの反映を『除外』に変更しました。」).

### 정보 위계

1. 헤더: 「あなたの Manga DNA」 + 프로필 확신도 레이블(高い/ふつう/低め)
2. **상위 취향 3개**: 취향 레이블 + 근거 제목 1~2줄. mobile `<768`은 순위 있는 1열 행(가로 snap 없음)이고 desktop `>=768`은 기존 3열 카드다.
3. 동일 deterministic profile의 대표 축을 요약한 radar. 새 chart dependency 없이 inline SVG/CSS로 그리고 같은 데이터를 text list로 제공한다.
4. 근거 작품 `MediaShelf`
5. 일반 진입에서 확신도가 `normal`일 때만 근거 Shelf 뒤에 두는 coaching banner. CTA는 `/onboarding` 「作品を追加」. `high`, 최초 reveal, 학습/AI 암시는 없다. 현재 profile guard를 통과한 사용자의 최저 확신도가 `normal`이므로 도달 불가능한 `low` UI 상태는 만들지 않는다.
6. 5개 범주(장르/테마/전개/톤·관계/작화)의 compact summary row. 각 row는 범주 icon, 실제 profile에서 계산한 대표 factor, 조정 상태, 명시적인 「詳細設定」 disclosure를 제공한다. 초기에는 모두 접고 한 번에 한 범주의 상세만 연다. 장르는 분석 전용으로 가로 막대(0~4) + 일본어 레이블만 제공하고 보정 control을 만들지 않는다. 나머지 네 범주의 열린 상세에는 기존 5단 보정 control을 그대로 제공한다.
7. 같은 최신 Catalog·기록·추천 정책에 페이지에서 처음 읽은 보정 설정과 현재 보정 설정을 각각 적용하는 preview. 동일 recommendation engine의 선두 최대 4개 work ID와 순서만 비교하고, 사용자는 제목·표지·해당 범위의 상태를 본다. 방문 당시 추천 목록을 동결하는 기능이 아니며 새로고침하면 저장된 현재 보정이 새 기준이다. 같으면 현재 목록 하나, 다르면 기준/현재 두 목록, 양쪽 0개면 빈 안내 한 번, 한쪽만 0개면 비교와 빈 쪽 안내를 제공한다. 계산 불가는 빈 결과·변화 없음과 구분하고 작품 정보가 없으면 ID 대신 이름 있는 안내로 해당 자리를 유지한다. network 요청과 별도 추천 산식은 없다.
8. `UserWorkRecord.updatedAt`과 기존 reasons로 구성한 최근 feedback 요약. 「作品を追加して精度を上げる」 링크는 coaching banner가 숨는 `high` 또는 최초 reveal에서만 유지한다.

### 막대 규칙

- 값 = 사용자 positive anchor들의 가중 평균에서 추론된 선호 강도(엔진의 프로필 요약 출력).
- 확인값의 표시 레이블: `<0.5 → ごく控えめ`, `<1.5 → 控えめ`, `<2.5 → ほどほど`, `<3.5 → 強め`, 그 외 `とても強め`. 숫자 원값은 화면에 표시하지 않는다.
- **미확인 축: 빈 윤곽선 막대 + 「まだ分析中」. 0으로 그리지 않는다.**
- 보정 radio 5단: `とても好き / 好き / 自動 / 控えめに / 除外`. 기본 `自動`. 반복되는 segmented box 대신 배경·외곽선이 없는 marker + label 행을 사용하고, 선택값은 채운 marker와 굵은 text로 구분한다. `除外`는 앞의 가는 구분선으로 일반 강도 조절과 분리하며 선택 시에만 marker와 text를 경고색으로 표시한다. 확인 다이얼로그 없이 즉시 적용한다.
- adjustment workspace의 visible contract는 「おすすめを調整」이다. 설명은 분석값이 바뀌지 않고 설정만 추천에 반영된다는 점과 `自動`이 분석 결과를 따른다는 점을 명시한다. 열린 보정 범주의 desktop 상세은 `分析した好み` / `おすすめへの反映` 두 열 제목과 가는 구분선을 사용한다. FactorBar는 read-only 분석 출력이며 radio 변경으로 값·길이·색을 바꾸지 않는다.

### 상태

- reveal(1회): §`04` 5.2의 시퀀스. `?reveal=1`을 발견하면 현재 mount의 reveal 여부를 local state/ref에 먼저 고정하고 같은 effect에서 query를 즉시 `replaceState`로 제거한다. 이후 A 시퀀스는 고정된 판정으로 계속하며 URL을 진행 중 상태나 재생 token으로 사용하지 않는다.
- 보정 변경 직후: 선택 marker와 text 상태를 즉시 반영하고, 저장 성공 시 어떤 factor를 어떤 값으로 변경했는지 `aria-live` snackbar로 알린다. FactorBar에는 보정 성공 highlight나 값 전이를 적용하지 않는다.
- 분석 확신도 `normal`: 일반 진입에서 헤더의 정성 레이블과 근거 Shelf를 유지한 채, 근거 Shelf 뒤·조정 workspace 앞에 desktop half-shell·mobile full-width coaching banner를 둔다. 기존 `calculateProfileConfidence` + `getConfidenceLevel`만 사용하고 상위 취향/근거 Shelf takeover는 금지한다. CTA는 `/onboarding`뿐이며, 최근 feedback의 동일 목적 링크는 숨긴다. 최초 reveal에서는 배너를 숨긴다. 현재 profile guard에서 `low`는 도달 불가능하므로 별도 배너 상태를 만들지 않는다.
- 분석 확신도 `high`: coaching banner를 표시하지 않는다.
- anchor < 5 (가드 통과 못함): /onboarding 리다이렉트.

### 반응형

- mobile: 상위 취향 3개는 순위 1열 행이다. 각 행은 순위 `1–3`, 팩터 레이블(최대 2줄, 14px/bold), 강도 16px nowrap(28px 금지), 기존 근거 제목 1–2줄이다. 5개 범주 summary를 1열로 쌓고 한 범주의 상세만 연다. 열린 상세은 각 FactorBar 아래에 visible `おすすめへの反映` micro-label과 줄바꿈 없는 가로 스크롤 radio 행을 둔다.
- desktop: 상위 취향 3개는 기존 3열 카드와 28px 강도를 유지한다. 최대폭 960px의 full-width 범주 row를 사용하고 한 범주의 상세만 연다. 분석 전용 장르 상세은 2열 meter grid로 10개 항목을 5행에 배치한다. 보정 가능한 네 범주는 sticky `分析した好み` / `おすすめへの反映` 열 제목 아래 FactorBar + 5단 control 행을 유지한다.

### 접근성

- 확인된 막대는 축 레이블만 접근 가능한 이름으로 사용하고 `role="meter"` + `aria-valuemin/max/now`를 제공한다. `aria-valuetext`는 중복된 축 이름이나 숫자 없이 위 정성 레이블만 제공한다(예: 이름 `戦略的な展開`, `aria-valuetext="強め"`).
- radar와 동일한 값은 keyboard/screen reader가 읽을 수 있는 text list로 중복 제공하고 SVG 자체는 장식으로 처리한다.
- 각 범주의 「詳細設定」은 범주명을 포함한 accessible name, `aria-expanded`, `aria-controls`, visible focus를 가진 44px 이상 button이다. 접힌 상세의 control은 accessibility tree에서 제외한다.
- 보정 선택은 `「{factor}」のおすすめへの反映を設定` 형식의 이름을 가진 radiogroup이며 각 선택은 44px 이상 target, visible label, outline/filled marker, `aria-checked`, visible focus를 제공한다. 선택 상태는 색만으로 전달하지 않는다. 미확인 막대는 가짜 0을 넣지 않고, 축 이름과 「まだ分析中」을 함께 읽는 비수치 group 상태로 노출한다.
- 미리보기에서 현재 목록은 같은 컴포넌트 위치·작품 key를 유지한다. 갱신 상태 문장만 `aria-live`로 알리고 전체 작품 목록을 반복 낭독하거나 보정 radio의 focus·스크롤을 강제로 이동하지 않는다. 사용자에게 raw work ID를 출력하지 않는다.
- reveal 애니메이션은 정보 추가 없음 — reduced-motion 시 즉시 완성 상태.

### 수용 기준

- [ ] reveal이 온보딩 완료 직후 1회만 재생된다(뒤로가기·새로고침 시 재생 안 됨).
- [ ] reveal 판정 직후 `?reveal`이 즉시 제거되지만 anchors·요약·FactorBar A 시퀀스는 local decision으로 계속된다.
- [ ] 1200ms 전 뷰포트에 들어온 FactorBar는 전역 gate 뒤 시작하고, gate가 지난 뒤 처음 진입한 화면 밖 FactorBar는 추가 1200ms 지연 없이 섹션 내 60ms stagger만 적용해 각 1회 재생된다.
- [ ] 모든 막대 값이 엔진 프로필 출력과 일치한다(스냅샷 테스트).
- [ ] 초기 화면에는 5개 범주 summary가 모두 보이고 상세는 접혀 있다. disclosure를 열면 해당 범주의 상세만 노출되며 다른 범주의 상세는 닫힌다.
- [ ] 장르 상세은 desktop 2열/mobile 1열 meter grid이며 radiogroup이 없다. 다른 네 범주의 5단 보정 control에는 영향이 없다.
- [ ] 보정 radiogroup은 반복 segmented container나 선택 pill 없이 marker + label로 표시되고, 선택값은 filled marker와 text weight로도 구분된다. `除外` warning은 선택 시에만 표시된다.
- [ ] 열린 보정 범주는 desktop에서 `分析した好み` / `おすすめへの反映` 열 제목과 divider, mobile에서 행별 `おすすめへの反映` label을 제공한다. workspace heading과 설명은 분석값과 추천 설정을 별개로 설명한다.
- [ ] radio 변경 전후 해당 FactorBar의 `aria-valuenow`와 시각 길이는 동일하며, 막대 highlight 대신 구체적인 저장 `aria-live` message와 선두 최대 4작품의 recommendation preview가 해당 표시 범위의 영향을 전달한다.
- [ ] 열린 범주의 모든 기존 5단 보정 control을 keyboard로 접근할 수 있고 접고 다시 열어도 값이 유지된다.
- [ ] 보정 칩 변경 → Dexie 반영 → /recommendations 재진입 시 추천이 변한다.
- [ ] 미확인 축이 0값 축과 시각·접근성 DOM 시맨틱 모두에서 구분된다. 실제 스크린리더 낭독 검증은 제품 완료 후 선택적 접근성 감사 범위다.
- [ ] 상위 취향 3개 각각에 근거 제목이 표시된다.
- [ ] 일반 진입의 `normal` coaching banner는 근거 Shelf 뒤에서 `/onboarding` CTA와 DOM 문구만 사용하고, 최근 feedback의 동일 목적 링크를 중복하지 않는다. `high`와 최초 reveal에서는 숨긴다. 도달 불가능한 `low` UI fixture는 추가하지 않는다.
- [ ] 보정 preview의 before/after work ID가 같은 최신 기록·정책에 각 보정 설정을 적용해 결정론적으로 계산되고 영속 추천 결과를 URL이나 Router context에 저장하지 않는다. 동일/변경/양쪽 빈 목록/한쪽 빈 목록/계산 불가를 구분하며 사용자 표시는 제목·표지·선두 최대 4작품의 상태다.

---

## 5. `/recommendations` — 추천

### 목적

핵심 효용 전달: "아직 읽지 않은, 취향에 맞는 10작품 + 납득 가능한 이유".

### 주요 액션

카드별 3버튼: **読みたい**(주요) / 読んだ / 興味なし. 페이지 레벨 액션: 정책 선택 칩(완결 우선/숨은 작품/검증작), 「更新」 버튼(현재 입력의 유효 cache 재사용 또는 수동 재계산).

### 정보 위계

1. 페이지 h1 「あなたへのおすすめ」(desktop는 28px 한 줄). 중복 설명은 시각적으로 숨기고 접근성 DOM에 유지한다.
2. 현재 적용 중인 정성 기준/policy 요약과 presentation filter bar
3. plan order 상위 작품의 `FeaturedRecommendationShelf` + cover-forward poster card
4. lead contribution의 anchor/reason별 Shelf
5. engine plan에서 이미 discovery/completed 성격인 항목을 추출한 Shelf
6. canonical plan 첫 10개를 그대로 보여 주는 personalized Top 10(`<ol>`)
7. 피드백 반영 요약과 footer. `completed`+`hidden` 합이 0보다 클 때만 ranking 뒤 콘텐츠 폭 full-width image banner로 표시한다.

Shelf grouping은 presentation-only selector다. main Shelf 사이에는 work ID를 dedupe할 수 있지만 Top 10은 canonical summary이므로 중복을 허용한다. score를 다시 계산하거나 새로운 가중치·인기 순위를 만들지 않는다.

### 판매순 발견 배너 (2026-09-11 사용자 승인)

- `/recommendations`의 Anchor Shelf 뒤·Discovery Shelf 앞, `/library`의 「作品を追加」 시트에서 검색어가 비어 있을 때 각각 한 개만 표시한다. 시안의 흰색 배너·왼쪽 입체 표지·가운데 질문·오른쪽 두 pill 답변을 공통 컴포넌트로 사용한다. 좁은 시트에서는 답변을 세로로, 모바일에서는 본문 아래로 배치한다.
- 2026-09-11 추가 사용자 결정: 추천 배너는 1280px 이상 데스크톱에서 본문 양쪽으로 최대 64px 확장하며 책·질문·답변의 기존 내부 정렬을 유지한다. 화면 여백이 부족하면 확장량을 줄이고, 1280px 미만 화면과 Library 시트에서는 기존 콘텐츠 폭에 맞춘다.
- 데스크톱(768px 이상) 판매순 발견 배너는 최소 높이 160px로 표시하고 내용을 세로 중앙에 배치한다. 표지는 사용자 추가 시안의 비율에 맞춰 기존보다 30% 크게 표시하되 질문·구분선 위치와 표지 원본 비율을 유지한다. 768px 미만 또는 콘텐츠 폭 640px 이하에서는 기존 표지 크기를 유지하고, 768px 미만에서는 기존 내용에 따른 높이를 유지한다.
- 확대된 책의 단면이 배너 하단 밖으로 조금 나오도록 표시한다. 표지를 배너 경계에서 자르지 않고 다음 선반과의 간격 안에서 표현한다. 데스크톱 추천 화면에서는 배너 하단에 16px 여백을 더해 다음 선반까지의 실제 간격을 32px에서 48px로 늘린다.
- 표지에는 누를 때 축소되는 버튼 효과를 적용하지 않는다. 작품 소개를 여는 동작과 키보드 focus 표시는 유지한다.
- `/api/rakuten/search?sort=sales`의 만화 판매순 상위 30건에서 이미 기록한 Catalog/external 작품을 제외하고 첫 적격 작품을 표시한다. 취향·장르·방침으로 재정렬하지 않는다. 「楽天ブックスで売れている作品」으로 출처를 밝히며 기간·순위·추천 적합도를 합성하지 않는다.
- 기존 external v1 정규화로 같은 작품의 다른 권을 비교한다. 표시 제목은 기존 권수·판본 토큰 제거 함수를 사용하며, 같은 제목·저자의 1권이 검색되면 해당 ISBN·표지·소개로 연결한다. 1권이 없거나 조회가 실패하면 판매순에 나온 실제 권을 표시하고 소개에 정확한 도서명을 남긴다. Catalog 연결·저장은 확인된 ISBN 일치에만 의존한다.
- 표지·제목·「まだ読んでいない」는 저장 없이 작품 소개를 연다. 미독 답변과 배너 닫기는 reaction·negativeReasons·hidden 상태를 만들지 않는다. 「読みたいに追加」를 눌러야 planned를 저장한다.
- 「読んだことがある」는 기존 독서 기록 편집기를 연다. completed 초깃값을 reading·dropped 등으로 바꿀 수 있고 감상은 선택 사항이다. 저장 버튼 전에는 기록을 만들지 않는다. Catalog/external 모두 기존 insert-only·authoritative readback 경로로 저장해 동시 변경을 덮지 않는다. `preserved-unknown`이면 성공을 표시하지 않고 편집기를 유지한다.
- 작품 추가 시트에서는 소개·편집을 같은 시트 안에 표시하고 중첩 dialog를 만들지 않는다. 뒤로 가면 답변 버튼으로 포커스를 복원한다. 추천 페이지에서는 기존 Dialog wrapper를 사용한다.
- 닫기·저장 성공 뒤에는 해당 탭 세션에서 두 위치 모두 배너를 다시 묻지 않는다. 판매순 목록은 공용 24h cache를 재사용한다. 데이터가 없거나 공급자가 실패하면 배너를 생략하며 기존 추천·로컬 검색은 계속 동작한다.

수용 기준:

- [ ] 두 위치에서 같은 밝은 배너·입체 표지를 표시하며 검색어 입력 시 배너가 사라진다.
- [ ] 실제 판매순 응답을 사용하고 취향·추천 순위를 변경하지 않는다.
- [ ] 미독·소개·취소·닫기는 독서 상태나 불호 기록을 만들지 않는다.
- [ ] 읽기 상태 확인 또는 명시적 planned 추가 뒤 Catalog/external 기록의 authoritative readback이 일치한다.
- [ ] 중복·동시 저장은 기존 record를 보존하고 확인 불가 결과를 성공으로 표시하지 않는다.
- [ ] 키보드·390px/320px 화면에서 44px 답변·닫기, 소개와 편집 접근, 포커스 복원을 유지한다.
- [ ] 공급자 실패·닫힘 상태에서도 추천·Library 검색이 정상 동작한다.

### 추천 헤더 (2026-09-10 사용자 위임 개선)

- 제목 옆에는 아이콘 없는 `Manga DNA` 링크를 두고, 그 아래 실제 기록 수의 `N作品から`와 근거 팩터 요약을 표시한다. `あなたの好み` 제목과 적용 방침 수 캡션은 표시하지 않는다. `おすすめの方針`은 독립된 44px 선택 칩으로 유지한다.
- `検証済み作品を優先`의 표시 레이블은 추천·설정에서 공통으로 `評価・実績を重視`를 사용한다. `preferVerified` key와 Bayesian 평가·maturity tie-break 의미는 바꾸지 않는다.
- 장르는 별도 표시 제어이며 `ジャンル` label과 연결한 기존 공통 NativeSelect만 왼쪽에 둔다. 장르 줄에는 선반 점프 컨트롤을 두지 않는다. 기존 genre/shelf URL 복원 계약은 유지한다.
- Top 10은 전체 순위 요약을 유지한다. 장르 선택 중에는 `Top 10は全ジャンルの順位です。`를 표시해 적용 범위를 알린다.
- 방침의 기본 안내 문구는 표시하지 않는다. 자동 반영 중에는 제목 줄의 고정된 상태 요소에서 `並べ直しています…`만 표시하며 줄이나 버튼 행을 추가하지 않는다. 저장부터 재계산까지 칩·장르·선반 제어를 비활성으로 표시하고, 계산 성공 후 표시된 plan을 교체한다.
- `更新`는 표시된 plan과 현재 입력의 hash가 다른 수동 갱신에만 나타나며 방침 자동 반영 중에는 표시하지 않는다. 기존 hash/cache·busy·오류 복구 계약을 유지하며 성공 후 버튼이 사라지면 그 버튼에 있던 포커스를 페이지 제목으로 복원한다. 후속 시트의 기존 카드 복귀가 불가능하고 갱신 버튼도 없으면 페이지 제목에 복귀한다.
- 모바일에서도 방침·장르를 항상 표시한다. 칩은 44px 영역과 체크/비선택 표식을 유지하고 폭에 따라 줄바꿈한다. 펼침 상태에 선택 정보를 숨기지 않는다.

### 추천 선반 내비게이션 (2026-09-10 사용자 위임 조건)

- `/recommendations`에만 데스크톱(`md` 이상) 페이지 내 목차를 제공한다. 목적지가 두 개 미만이면 생략한다. 없는 선반은 목록에서 제외하고 모바일 점프 UI는 두지 않는다. 앱 셸·DNA·Library 내비게이션은 변경하지 않는다.
- 인트로의 끝이 GNB 아래 목차 영역의 하단을 통과하면 표시한다. 44px 목차는 높이 0인 sticky 홀더에서 겹쳐 표시하므로 첫 화면이나 표시 전환 시 Featured를 밀지 않는다. 상단으로 돌아오면 숨기고 포커스·접근 트리에서도 제외한다.
- 표시 라벨은 `上位` / `好きな作品から` / `隠れた候補` / `完結` / `Top 10`이다. 모든 선반이 계속 보이므로 ARIA tab/tabpanel 대신 nav의 링크와 `aria-current="location"`을 사용한다. 현재 선반은 밑줄·굵기·색으로 표시한다. 접근 이름에는 표시 라벨과 기존 선반 제목을 포함하되 중복 문구는 합친다.
- 명시적 링크 선택은 기존 search를 보존한 채 `?shelf`를 변경하고 `scrollIntoView` 뒤 목적지 `h2`에 포커스한다. 같은 선반도 다시 선택할 수 있다. 일반 스크롤은 현재 선반 강조만 갱신하며 URL·포커스를 변경하지 않는다. fragment를 별도의 URL 상태로 추가하지 않는다.
- 초기 진입·새로고침의 `?shelf`는 표시 가능한 목적지로 이동한다. 뒤로가기·앞으로가기는 URL 상태와 기존 Router의 저장된 스크롤 위치 복원을 유지한다. 같은 URL의 방침 재계산은 사용자의 현재 스크롤 위치를 보존한다. 모바일에서도 URL 복원을 유지한다.
- 데스크톱의 기존 전역 GNB scroll-padding을 재사용하고 추천 선반 scroll-margin에는 목차 높이와 추가 간격만 둔다. GNB 높이를 중복 계산하지 않는다. 모바일은 상단 GNB·목차가 없으므로 기본 간격만 둔다.

### Featured card·Quick Preview

- 카드에는 원본 비율 표지, 제목/저자/메타, 실제 `contributions[]` 기반 lead reason, 정성 confidence와 reading action을 표시한다.
- featured card는 외곽 344×448px desktop poster를 기준으로 한 고정 geometry다. 반응형 width/height, padding, title slot은 4px grid에 맞춘다. 정상 상태는 2줄 title slot → 상태·권수·정성 confidence → 원본 비율 표지 → contribution 기반 lead reason 1줄 순서다. 표지 URL이 있으면 같은 400px source를 `aria-hidden`·lazy decorative backdrop으로 재사용하고 작은 local blur와 72% `--hero-scrim` 아래에 둔다. 별도 palette 추출은 하지 않으며 URL이 없거나 실패하면 기존 accent/surface 배경으로 끝낸다. 카드·Shelf control에는 shadow를 두지 않고 표지에만 4px radius와 `--shadow-cover-featured`(`0 8px 24px / 50%`) local shadow를 둔다. desktop fine pointer hover/focus는 article 경계를 움직이지 않은 채 표지 영역을 약 71% 높이로 줄이고 reason을 최대 3줄로 늘리며 44px action rail을 연다. coarse pointer에서는 같은 정보와 action을 처음부터 표시한다.
- 표지 identity `Link`는 mouse·keyboard·touch·pen 모두 `/works/[workId]`로 이동한다. Quick Preview는 action rail의 별도 44px icon-only quiet control이며 `ScanSearchIcon`은 `aria-hidden`, 접근 이름은 `「{title}」をクイック表示`다. `読みたい`·`読んだ`·`興味なし`도 같은 rail에 둔다. Top 10 ranking card에는 Quick Preview가 없다. `matchMedia`로 identity 클릭을 가로채지 않는다.
- Quick Preview는 cover, lead reasons, caution, 정성 confidence, reading action, 상세 링크만 가진다. 닫으면 opener focus를 복원한다. 대상 work ID만 `?preview=<workId>`로 복원할 수 있고 animation/focus state는 local state다.
- 2026-09-10 모바일 레이아웃 개선 요청에 따라 Quick Preview sheet는 상단의 작은 표지·작품명·권수/상태, 전체 폭의 추천 이유·주의점·확신도·상세 링크, 하단의 읽기 액션으로 구성한다. 기능 안내 문장은 모바일에서 시각적으로 생략하되 dialog의 접근성 설명은 유지한다. 닫기 버튼과 읽기 액션은 스크롤되는 본문 밖에 두고, 모든 액션은 44px 이상이며 하단 safe area를 확보한다. 좁거나 낮은 화면에서는 본문만 세로 스크롤하고 제목과 닫기가 겹치지 않는다. 처음 열 때 작품 제목으로 포커스를 옮겨 본문이 상세 링크까지 자동 스크롤되지 않게 한다. fine-pointer desktop의 표지 왼쪽·본문 오른쪽 배치는 유지한다.
- Discovery Shelf의 resolved 표지는 hover 최종 크기인 30:43 slot을 항상 예약한다. 기본은 같은 slot 중앙을 정확한 원으로 center-crop하고 fine-pointer hover·keyboard `focus-within`에서 4px radius의 전체 직사각형으로 펼친다. 원의 시작 radius는 30:43 frame의 실제 수평·수직 반경(`50% / 34.883721%`)이며 `clip-path`는 240ms linear로 보간해 pill radius 제한 때문에 마지막에 형태 변화가 몰리지 않게 한다. article·cover Link·형제 위치는 상태 전후 고정한다. 카드 표면은 personalized Top 10과 같이 transparent → `--surface-2`로 바꾸고 hover border·title accent는 추가하지 않는다. 문맥 없는 confidence 단독 레이블(`高い`/`ふつう`/`低め`)은 Discovery와 Anchor 접힌 카드에서 생략한다. Discovery의 lead contribution 설명과 Quick Preview는 유지한다. 표지 부재·실패 placeholder는 직사각형과 contain 경로를 유지한다.
- 추천 카드 hover는 전역 계약대로 border color를 바꾸지 않는다. Completed Shelf와 Anchor는 personalized Top 10처럼 투명한 기본 표면에서 hover·keyboard focus 시 `--surface-2`로만 바뀌며 title accent를 추가하지 않는다. 2026-09-11 사용자 요청에 따라 Anchor의 펼침 상태도 같은 표면색을 유지하고 패널은 article의 배경을 상속한다. Featured card는 기존 기본 border·surface를 유지한다. keyboard focus 표현은 별도 접근성 상태로 유지한다.

### Anchor Shelf 옆 패널 (2026-09-10 사용자 승인)

- `好きな作品から広げる`의 `ExpandableMediaCard`는 세로 표지 크기와 카드 높이를 유지하면서 설명 패널 폭만큼 실제 article 폭을 늘린다. 뒤쪽 카드도 같은 폭만큼 이동해 이웃 표지를 가리지 않는다. 2026-09-10 후속 사용자 지시로 overlay 안을 대체한다. 한 번에 하나만 열고, 선반 안에서 다음 표지로 이동하는 동안 기존 패널을 유지한 뒤 새 카드로 전환한다.
- 접힌 카드는 동일한 30:43 표지 프레임과 표지 아래 2줄 높이를 예약한 제목으로 후보를 식별한다. 정사각형·세로 원본·placeholder에서도 제목 시작선과 카드 높이는 같다. 세로형 이미지는 원본 비율 `contain`이며, 2026-09-10 후속 사용자 지시에 따라 160×160 같은 정사각형 원본은 Anchor에서만 중앙 `cover`로 프레임을 채운다. 이미지를 변형·재저장하지 않으며 placeholder는 crop하지 않는다. 표지·제목은 하나의 작품 상세 Link다. 표지 위 제목·그라디언트·confidence·hover title accent는 제거하고, 확장 가능한 desktop의 접힌 카드에는 Quick Preview를 두지 않는다.
- desktop `min-width:768px` + fine pointer + hover에서 200ms 의도 확인 후 연다. 패널 폭은 `--control-min-size × 6`, 높이는 현재 카드 높이이며 기본 오른쪽, 트랙 오른쪽 공간이 부족하면 왼쪽으로 연다. 패널은 트랙 안에 두고 긴 문구는 패널 내부에서 스크롤할 수 있다. 표지 DOM·비율·상세 Link를 유지한다.
- 2026-09-11 사용자 요청에 따라 표지·제목·모바일 Quick Preview를 감싸는 안쪽 여백은 Completed 카드와 같은 `--space-2`, `md` 이상 세로 여백은 `--space-3`이다. desktop 카드의 최소·최대 폭에는 가로 여백을 포함해 표지와 Quick Preview의 공간을 확보한다. 펼침 패널은 `--space-3` 여백으로 표지 상단과 맞춘다.
- 패널 상단에는 기존 `generateTasteExplanation(...).positiveReasons[0]` 문장을 표시하고 그 문장의 실제 좋아한 작품명만 강조한다. 별도 캡션·세로 가운데 정렬·Quick Preview는 없다. 좋아한 작품명과 공통 팩터는 해당 contribution에서만 나온다. 별도 추천 산식·목록 정렬·설명 문구 생성 경로를 추가하지 않는다.
- 2026-09-10 후속 사용자 요청으로 근거 아래에 작품 소개를 최대 3줄로 표시한다. 작품 상세와 같은 라쿠텐 `itemCaption` 원문을 보조 텍스트로 발췌하며 재요약하지 않는다. 기존 대표권 ISBN·exact-workId·metadata TTL·가시성 요청 경로를 재사용하고 별도 요청이나 런타임 LLM을 추가하지 않는다. 소개가 없으면 해당 문단만 생략하고 근거는 유지한다.
- 2026-09-10 후속 사용자 요청으로 펼친 패널 아래에는 Quick Preview와 같은 `StateActionRow`의 `読みたい`·`読んだ`·`興味なし`를 둔다. 모든 타깃은 44px 이상이며 긴 근거·소개는 위쪽 텍스트 영역에서 스크롤하고 액션은 하단에 유지한다. 기존 busy·저장 상태·Dexie 저장·제외·후속 시트 처리를 공유하며, 후속 시트를 닫으면 같은 선반의 다음 카드(끝이면 이전 카드)로 포커스를 복원한다.
- keyboard focus-visible 진입에서도 열고, 선반 안 포인터 또는 카드 안 포커스가 유지되는 동안 읽을 수 있다. Escape와 바깥 클릭은 닫기를 수행한다. Escape를 패널 내부 액션에서 누르면 숨겨질 컨트롤 대신 같은 카드의 상세 Link로 포커스를 돌리고, 접힌 영역에 있는 포커스는 유지한다. 카드 밖으로 포커스가 이동하면 닫고, 한 expanded 카드에 포커스가 있으면 다른 카드의 hover 확장을 막는다. 선반 밖 포인터 이동과 페이지 화살표는 패널을 닫는다.
- 새 카드가 기존 열린 카드의 뒤에 있으면 왼쪽 패널로 공간을 이어받는다. 확장 방향과 가로 스크롤은 `scroll-padding` 안쪽의 가시 영역을 기준으로 정하며, 단독 진입과 카드 간 전환 모두 펼쳐진 카드 전체가 보이도록 폭 전환에 맞춰 위치를 보정한다. 사용자가 직접 가로 스크롤한 뒤에는 원래 위치로 되돌리지 않는다. 펼친 동안 snap을 일시 해제하고 닫으면 기존 유한 트랙 snap을 복원한다.
- 위 확장 조건을 만족하지 않는 환경은 펼치지 않는다. 제목 아래에는 다른 보조 선반과 같은 44px `ScanSearchIcon` + `クイック表示` quiet control을 표시하고, 기존 sheet에서 전체 이유·분석의 확신도·읽기 액션에 접근한다. 이전 1줄 출발 작품 단서는 이 컨트롤로 대체한다. 표지·제목 Link는 작품 상세로 이동하며, 넓은 coarse-pointer 화면과 768px 미만 fine-pointer 화면에도 같은 경로를 제공한다.
- 패널 공개는 D의 승인된 240ms 직접 피드백이다. article의 `width`만 보간하고 패널은 고정 폭으로 그린 뒤 article overflow로 드러낸다. 표지·문구 크기는 보간하지 않는다. reduced-motion에서는 즉시 표시한다.

### 리스트 동작 계약

- 진입 시: 프로필 입력 해시가 저장된 계산 해시와 다르면 재계산, 같으면 저장된 plan을 표시한다. 표시할 plan이 없는 최초 계산만 200ms 미만이면 로딩 UI를 생략하고, 이상이면 현재 Shelf/card silhouette의 skeleton을 표시한다. 기존 plan을 갱신할 때는 Shelf와 계산 해시를 유지한다. 방침 자동 반영은 제목 줄의 「並べ直しています…」, 수동 갱신은 기존 버튼의 「更新しています…」 상태를 표시한 뒤 성공한 새 plan을 한 번에 교체하며, 실패하면 기존 plan을 보존한다.
- Featured Shelf는 3-copy scroll-snap 루프다. 가운데 copy만 canonical·interactive이고 양쪽 copy는 `aria-hidden`·`inert`이며 표지 가시성 요청과 ref 등록을 하지 않는다. 초기 진입과 scroll settle 뒤 같은 위치의 가운데 copy로 보이지 않게 점프한다. Featured 화살표·touch scroll은 순환하지만 키보드는 canonical 실카드만 대상으로 하고 끝에서 순환하지 않는다. Anchor·Discovery·Completed·Top 10은 유한 트랙이며 끝에서 화살표가 disabled되고 wrap하지 않는다. 네이티브 가로 snap은 유지하되 전용 swipe 제스처는 도입하지 않는다.
- 렌더 대상 카드의 표지는 표시 순 `workId → representativeVolume ISBN` registry로 해석한다. 첫 `target[0]` metadata만 LCP lane에서 자동 시작하고, 나머지는 각 표지 root가 실제 viewport에 진입할 때 요청한다. 전체 해석 상한은 4이며 각 결과를 도착 즉시 commit한다. 가시성 수요는 target generation이 바뀌어도 유지해 백필 때 생존 카드 URL을 보존하고 새로 보인 카드만 해석한다. fresh no-image와 cache/provider 실패는 같은 `workId + ISBN`에서 재시도 없이 placeholder로 끝내되 카드·이유·액션을 제거하지 않는다.
- `読んだ` / `興味なし`: 영속 쓰기 성공 뒤 카드 제거(Motion layout, 240ms) → 최초 계산에서 보존한 전체 후보 plan의 다음 순위로 즉시 백필한다(점수 재계산 없음, 리스트는 항상 10개 유지, 후보 소진 시 예외). `読んだ`는 `completed`로 저장한 뒤 후속 시트의 `最高/良かった/普通/いまいち`를 `favorite/liked/neutral/disliked`에 대응하며 스킵은 reaction 없음이다. `興味なし`는 `hidden`으로 저장하고, 이유 칩을 고른 경우만 `disliked + negativeReasons`를 추가한다. 스킵은 reaction·reason 없음이며 `vagueDislike`를 합성하지 않는다.
- `読みたい`: 카드 유지, 버튼이 확정 상태로 변경 + Library(planned)에 추가.
- 「更新」: 현재 `inputHash`의 유효한 전체 plan cache가 있으면 재사용하고, 없으면 전체 재계산한다. 이전 목록과 동일 입력이면 동일 결과(결정론)임을 전제로, 버튼은 입력 변경이 있을 때만 활성화.

### 상태

- 후보 부족(실제 표시 결과 1–9): Featured Shelf 직후·후속 shelves 앞에, snap list 밖의 콘텐츠 폭 full-width contextual banner를 둔다. 기존 shortage 안내와 `/onboarding`(好きな作品を追加)·`/taste`(好みを見直す)만 사용한다. 0건, 10건 이상, filter-empty, 계산 오류, 초기 오류에서는 표시하지 않는다.
- 피드백 기록(`completed`+`hidden` 합 > 0): ranking Shelf 뒤 콘텐츠 폭 full-width image banner. `/media/recommendations-feedback-manga-v4.png`는 장식 이미지이며 제목·설명·수치는 DOM으로 제공한다. 제목은 `読んだ・興味なしの記録`, 설명은 `記録した作品は、おすすめから外しています。`를 사용한다. 수치는 추천 카드에서 제거한 이력만이 아니라 온보딩·Library를 포함한 전체 현재 기록의 読んだ·興味なし count다. 수치 아래에 별도 44px outline 링크 `好みを見直す`(`/taste`)를 둔다. 152px 고정 높이는 두지 않고 내용에 맞춰 늘린다. Top 10과의 위 간격 및 푸터까지의 아래 실제 간격은 사용자 추가 지시에 따라 `--space-section-xl`(96px)다. 아래 간격은 기존 main padding과 합산하며 중복해서 더하지 않는다. 합이 0이면 배너를 숨기고 후보 부족 조건은 바꾸지 않는다.
- 후보 0: 빈 상태 일러스트 + 위 안내 + /taste 링크.
- 오프라인/이미지 실패: placeholder 표지, 이유·액션은 정상.
- 계산 오류(스키마 불일치 등): 오류 카드 + 再試行. Library는 영향 없음.

### 반응형

- mobile: Featured는 390×844에서 272×356px snap-aligned 활성 카드 1장과 다음 카드 peek가 보인다. hover가 없는 환경은 reason 최대 3줄과 preview/feedback action을 처음부터 표시하며 action target은 모두 44px 이상이다. Featured의 추가 상세 정보는 Quick Preview sheet에서 제공한다. Anchor는 위의 Quick Preview·작품 상세 경로를 사용한다.
- desktop: 최대폭 1200px에서 344×448px poster 약 3장과 다음 카드 일부가 보이는 Shelf를 사용한다. 페이지 h1은 28px 한 줄로 보이고 인접 설명은 숨긴다. canonical Top 10은 ranking Shelf/row로 순위를 명확히 표시한다.

### 인터랙션·접근성

- Top 10만 `<ol>`로 순위 의미를 부여한다. 카드 제거·백필 시 `aria-live="polite"`로 「1件を除外し、新しい候補を追加しました」.
- 스와이프 제스처는 도입하지 않는다(발견 가능성 낮고 오조작 위험).

### 모션

카드 제거/백필은 해당 Shelf owner의 C만 사용한다. featured card는 desktop fine pointer hover/focus에서 article 경계를 바꾸지 않고 표지 stage·reason max-height·action rail을 400ms로 함께 전환한다. Discovery resolved 표지의 원→직사각형은 사용자 요청의 좁은 D 예외로 `clip-path`만 240ms ease-in-out 전환하고, 카드 표면색은 personalized Top 10과 같은 240ms ease-out을 쓴다. card/캐러셀 shadow와 generic hover Y축 lift는 사용하지 않는다. reduced-motion은 같은 최종 상태를 즉시 표시한다. Quick Preview는 진입 keyframe 없이 최종 상태로 열린다. 추천 화면에는 B 페이지 진입 모션을 적용하지 않는다.

### 수용 기준

- [ ] 동일 프로필 입력에서 새로고침해도 목록·순서가 동일하다.
- [ ] desktop 첫 진입에서 344×448px featured card 3장 이상과 다음 카드 일부가 보이고, 정상 상태는 표지가 주된 면적이며 hover/focus는 외곽 geometry를 바꾸지 않고 reason과 action rail을 연다.
- [ ] `読んだ` 처리한 작품이 이후 어떤 추천에도 다시 나타나지 않는다.
- [ ] 각 카드의 이유가 해당 카드 contribution 데이터와 일치한다(E2E에서 data-attribute 대조).
- [ ] 카드 제거→후속 시트→백필이 키보드 포커스를 잃지 않는다(시트가 열리면 내부로, 닫히면 제거된 카드 다음 카드로 복귀).
- [ ] 정책 칩 변경 시 목록이 재계산되고 칩 상태가 Dexie에 저장된다.
- [ ] 1위 카드 표지는 첫 viewport의 LCP 후보로 eager/high-priority 요청되고 나머지 표지는 lazy loading을 유지한다.
- [ ] 1위 `target[0]`의 exact-workId metadata만 첫 lane에서 자동 요청하고 나머지는 표지가 실제 viewport에 진입한 뒤 요청한다. 전체 동시 해석은 4개를 넘지 않고 각 결과를 도착 즉시 commit한다. 실제 `<img>` load/error는 기다리지 않으며 expired/mismatched/miss만 갱신하고 fresh exact-workId no-image와 실패 결과는 같은 `workId + ISBN`에서 재요청하지 않는다.
- [ ] Featured의 hover/focus로 card 외곽 크기와 형제 위치가 바뀌지 않고 표지 축소분이 reason/action 영역으로 전환되며 Quick Preview가 닫힌 뒤 opener focus가 복원된다.
- [ ] presentation Shelf를 추가해도 동일 fixture의 canonical Top 10 work ID 순서가 바뀌지 않는다.
- [ ] 피드백 image banner는 실제 completed/hidden count와 `/taste` CTA를 유지하고, 둘 다 0이면 큰 이미지 배너를 표시하지 않는다.
- [ ] Discovery 카드는 기본 정원과 hover/focus 직사각형 사이에서 article·cover Link·형제 rect가 변하지 않고, 표면색만 transparent → `--surface-2`로 바뀌며 단독 confidence 레이블을 표시하지 않는다. placeholder는 crop하지 않는다.
- [ ] Anchor 접힌 카드는 같은 높이의 표지 프레임과 표지 밖 2줄 제목 슬롯을 사용한다. 세로형은 contain, 정사각형 원본은 중앙 cover이며 placeholder를 crop하지 않는다. 단독 confidence·제목 overlay가 없고 표지·제목 Link는 작품 상세로 이동한다. 확장 가능한 desktop에서는 접힌 카드의 Quick Preview를 표시하지 않는다.
- [ ] Anchor 옆 패널은 contribution의 좋아한 작품·공통 근거와, 있을 때만 실제 `itemCaption` 소개 최대 3줄을 상단부터 표시한다. 표지 크기·DOM·카드 높이를 유지하면서 확장 폭만큼 뒤쪽 카드를 이동시켜 다음 표지를 가리지 않는다. 연속 hover·keyboard 진입·Escape 닫기·reduced-motion을 유지하며, 오른쪽 끝의 왼쪽 확장 보정은 사용자 직접 스크롤을 덮어쓰지 않는다.
- [ ] Anchor 확장 패널의 44px 읽기 액션은 Quick Preview와 같은 저장·제외·후속 시트 처리를 수행한다. 텍스트가 길어도 액션은 패널 하단에서 접근 가능하며, 시트 종료 후 같은 선반의 인접 카드로 포커스가 복원된다.
- [ ] 확장 불가 환경은 제목 아래 Quick Preview를 표시한다. 기존 sheet에서 전체 이유·분석의 확신도·읽기 액션에 접근하고, 닫으면 opener로 포커스가 돌아온다. 표지·제목의 상세 진입도 유지한다.
- [ ] 모바일 Quick Preview는 표지 아래 전체 폭으로 이유를 표시한다. 320px 폭과 낮은 viewport에서도 가로 넘침 없이 본문을 읽을 수 있고, 스크롤 중 닫기·44px 읽기 액션·포커스 복원과 기존 저장/제외 경로를 유지한다.

---

## 6. 작품 상세 — `/works/[workId]` · `/works/external?workId=<ExternalWorkId>`

### 목적

Catalog 작품은 추천 근거를 깊이 확인하고 구매(라쿠텐)로 연결한다. external 작품은 같은 프레젠테이션 골격에서 로컬 서지 정보와 상태만 관리하며 추천 문맥 밖에서도 동작한다.

### 주요 액션

**「楽天ブックスで見る」** (affiliate 링크, 새 탭). 부가: 읽음 상태 변경 드롭다운, 読みたい 토글. 토글은 record 없음 ↔ 부가 정보 없는 최소 `planned` record일 때만 양방향이며, 다른 상태·감상·진행·이유가 있는 record는 상태 드롭다운이 소유하고 삭제하지 않는다.

### 정보 위계

1. 히어로: 동일 표지 URL의 강한 블러 배경(`aria-hidden`) 위에 원본 비율 표지(고해상도 `_ex=600x600`)
2. 제목·저자·출판사·연재 상태·권수
3. 작품 소개와 대표권 정보(발매일·레이블·페이지 수). 소개는 기본 최대 5줄이며, 현재 화면 폭에서 5줄을 넘을 때만 「続きを読む」로 원문 전체를 펼치고 「閉じる」로 다시 접는다. 원문과 출처는 보존하며 소개와 서지는 아래 항목별 우선순위를 따른다.
4. 이 작품의 주요 팩터 요약(레이블 칩: 戦略 / 群像劇 / ダークめ 등 — 값 ≥3 또는 centrality 2인 것만). desktop에서는 소개·서지 오른쪽에 표시한다.
5. **「あなたとの相性」 섹션** (프로필 존재 시): desktop은 같은 폭의 2열로 왼쪽에 제목·핵심 이유와 보조 포인트·주의점 최대 1, 오른쪽에 「根拠になった作品」 배너를 배치한다. 이유 표현은 아래 계약을 따른다. 2026-09-11 사용자 선택 이미지 1의 회청색 표면·흰 카드 구성을 적용하며 `あなたの Top 10`의 `RankingCard`를 `evidence` variant로 재사용한다. 근거 카드는 §6.9의 실제 Anchor 최대 3개이고 원본 비율 표지·역할·제목 전체가 Catalog 상세 링크다. 순위·왕관은 표시하지 않는다. 후속 사용자 지시에 따라 이 섹션의 「分析の確信度」 레이블과 전용 구분선은 표시하지 않는다. mobile은 이유 다음에 배너를 쌓으며 아래의 실제 근거 개수별 배치를 따른다. 확장 카드는 `完結作から選ぶ`의 표지 왼쪽·제목과 정보 오른쪽 배치를 사용한다. 부족한 개수를 가짜 근거로 채우지 않는다.
6. 구매 링크 + 가격·재고(ProviderListing, TTL 내) + `Supported by Rakuten Developers`
7. 같은 작가의 다른 작품 배너: 2026-09-11 사용자 선택 이미지 1의 본문 전체폭 구성. 왼쪽 실제 책, 오른쪽 「{作者}の、もう一冊」·작품명·「作品を見る」를 표시하고 전체 배너가 해당 Catalog 상세로 이동한다. 기존 creator 정규화로 같은 저자임을 확인한 다른 `recommendationEligible` 작품 중 Work ID code-unit 순서의 첫 작품을 택하며 현재 작품·libraryOnly·external을 제외한다. 대상이 없으면 생략한다.
8. Catalog 작품만 deterministic known factor/theme selector로 구성한 관련/Same Mood Shelf. 2026-09-11 사용자 지시에 따라 「似た作品」·「同じ雰囲気の作品」은 `あなたの Top 10`과 같은 `RankingCard`의 `unranked` variant를 사용한다. 카드 폭·표지·제목·hover/focus 표현을 공유하고 저자를 본문 아래 metadata로 표시한다. 순위 숫자·왕관·순위 접근성 이름은 없으며 목록은 순서 없는 목록이다. core 추천 순위는 변경하지 않으며 external에는 factor를 추측하지 않는다.

### 상성 이유 표현 (2026-09-11 사용자 승인)

- 제목은 왼쪽의 현재 위치에서 `--text-section-title-size`(desktop 28px, mobile 20px)를 사용한다. 전체 폭 제목 행이나 새 크기를 추가하지 않고 「合いそうな理由」 소제목은 제거한다.
- 첫 `positiveReasons[0].text`를 그대로 표시하며, 그 이유의 `anchorWorkIds`에 결속된 작품명만 강조한다. 나머지 positive 이유는 기존 팩터/클러스터 레이블로 본문 크기·본문 대비의 짧은 나열을 표시한다. 첫 이유와 같은 레이블과 보조 레이블끼리의 중복은 제외한다. 새 소제목·칩·추천 문장을 만들지 않는다.
- 낮은 강도를 선호하는 `axisPreferenceDirection: lower` 이유는 「控えめ」의 방향을 잃지 않도록 원문 문장으로 유지한다. 원래 레이블을 찾을 수 없는 이유도 원문으로 보존한다. 이유가 하나면 보조 나열을 생략하며 빈 이유 안내와 실제 caution은 유지한다. 엔진 산식·문장 생성·다른 추천 화면의 표현은 바꾸지 않는다. 「好みのつながり」를 개별 팩터 이유 문장으로 풀지 않는다.
- mobile의 보조 레이블 중 실제로 렌더되는 첫 근거 카드의 「近いポイント」와 겹치는 것만 왼쪽에서 생략한다. 카드 수가 1개·3개이고 첫 카드에 해당 포인트가 있을 때만 적용한다. 2개 상태, 포인트 없음, 첫 카드가 설명하지 않는 레이블은 왼쪽에 남긴다. 오른쪽 배너의 크기·표면·카드 구성은 유지한다.

### 부족한 근거 슬롯 (2026-09-11 사용자 최종 선택)

- desktop은 실제 근거 수에 관계없이 기존 3열·카드 크기를 유지한다. 근거가 1~2개면 남은 슬롯에 같은 `RankingCard`의 `evidence-placeholder` 상태를 사용한다. 실제 카드보다 대비가 낮은 밝은 바탕 중앙에 작은 책 윤곽 아이콘과 「追加の根拠なし」를 표시한다. 실제 표지 이미지·작품 제목·역할·링크·포커스가 없고 `aria-hidden`으로 접근성 트리에서 제외하며 추천 근거 개수나 contribution에 추가하지 않는다.
- mobile은 빈 카드를 표시하지 않고 그 공간도 제거한다. 실제 근거가 1개면 확장 카드 하나, 2개면 기존 3개 표시의 두 번째·세 번째 카드와 같은 크기의 일반 카드 두 개를 표시한다. 3개면 첫 카드 전체 행·나머지 두 카드 아래 2열을 유지한다. 저자·근거 포인트는 확장 카드에만 표시한다.
- 실제 근거가 0개면 배너를 생략한다. 실제 작품의 표지만 없는 경우에는 제목·저자가 있는 기존 대체 표지를 사용한다.

### 소개·서지 우선순위 (2026-09-11 사용자 승인)

- 같은 Work·대표권·ISBN에 결속된 유효한 항목별로 **TTL 내 라쿠텐 API > 출판사 수집 Catalog > 기존 Catalog 서지 또는 미확인** 순으로 표시한다. HTTP 200만으로 모든 항목이 있다고 판단하지 않는다. 공백 문자열·null·누락은 결측이며 유효한 숫자 0은 결측이 아니다.
- 양쪽 값이 있으면 라쿠텐 값을 선택한다. 소개를 이어 붙이거나 길이로 고르지 않는다. 출처 URL·수집일을 원천별로 보존하고 수집 자료를 Rakuten 캐시에 쓰지 않는다. 소개 옆에는 실제 선택한 출처 링크를 같은 형식의 「楽天ブックスの紹介」 / 「出版社の紹介」로 표시한다. 출판사 요약 여부와 원문은 authoring 자료에 보존한다.
- 수집 서지는 빌드 전용 `source_book_metadata`에서 해당 Volume의 선택적 `metadata`로 생성한다. 표지는 원본 URL을 사용하며 이미지 파일을 복제하지 않는다. 발매일은 API의 「頃」 등 원래 정밀도를 유지한다.
- 가격·재고·리뷰·구매 링크는 기존 ProviderListing 경로만 사용한다. 수집값으로 만료된 상업 정보를 대체하지 않는다. 시리즈 전체 권수·상태와 canonical 제목·저자는 Catalog가 소유하며 단권 API 응답의 제목이나 권수를 시리즈 사실로 해석하지 않는다.

### 상태

- 추천 문맥 없이 진입(프로필 없음): 상성 섹션 생략, 팩터 요약은 표시.
- ProviderListing 만료·실패: 가격·재고 숨김, 구매 버튼은 itemUrl 캐시가 있으면 유지, 없으면 「楽天ブックスで検索」(제목 질의 링크)로 대체.
- Catalog route는 bundled Catalog ID만 허용한다. 존재하지 않는 `/works/[workId]`는 실제 404 페이지 + /recommendations 링크이며 external ID를 이 route에서 해석하거나 리다이렉트하지 않는다.
- external entry는 고정 정적 셸 `/works/external?workId=<ExternalWorkId>`만 사용하고 팩터·상성 섹션 없이 서지 정보와 상태 관리만 표시한다. query는 hydration 뒤 client feature가 읽으며 `workId`가 정확히 한 번 존재하고 `^ext:rakuten:v1:[0-9a-f]{64}$`를 만족한 뒤에만 IndexedDB를 조회한다.
- external query가 없거나 중복·비어 있음·namespace/version/digest 형식이 틀리면 in-page invalid-link 상태와 /library 이동만 표시한다. 해당 값을 `inspectExternalWork`에 넘기거나 Rakuten API를 호출하지 않고 404·Catalog route로 바꾸지 않는다. 전역 PersistenceProvider의 일반 초기화는 이 ID별 lookup과 별개다.
- 유효 ID가 이 브라우저에 없으면 저장되지 않은 로컬 작품 상태와 /library 이동을 표시한다. digest에서 작품을 복원하거나 제목 검색·빈 record 생성을 하지 않는다.
- 로컬 row의 strict schema, parent/nested ID, canonical key 또는 ID/digest가 맞지 않으면 서지 정보를 렌더하지 않는 local-data error를 표시한다. 자동 repair/re-key와 provider 요청은 하지 않는다. IndexedDB 자체를 읽을 수 없으면 missing/corrupt와 구분되는 unavailable 상태를 표시한다.

### 반응형

- mobile: 히어로 표지 높이 최대 40vh, 이하 세로 스크롤. 상성 이유는 본문 「あなたとの相性」에서만 표시하고 히어로에 중복하지 않는다. 「楽天ブックスで見る」와 검색 대체 버튼은 구매 영역의 전체 폭을 사용한다.
- desktop: dark cinematic backdrop 위 2열 — 좌측 고정 표지(sticky), 우측 정보 스크롤. 최대폭 1040px. 관련 Shelf는 hero 아래 전체폭이다.

### 접근성

- 표지 `alt="{title} 表紙"`, 블러 배경 `alt=""` + `aria-hidden`.
- 외부 링크에 「楽天ブックスを開く(新しいタブ)」 어나운스.

### 모션

- 유효 Catalog 상세의 resolved content와 `found` external 상세의 resolved content에만 B를 적용한다. Catalog는 `workId`, external은 immutable external ID가 바뀐 새 route mount에서 다시 실행할 수 있다. loading·invalid-link·local-missing·corrupt·unavailable·error에는 적용하지 않는다.
- 블러 배경과 표지 교체는 정적이며 이미지 load opacity fade를 적용하지 않는다.

### 수용 기준

- [ ] 블러 배경과 전경이 동일 URL이며 추가 이미지 요청이 없다(같은 캐시 항목).
- [ ] `_ex=600x600` 로드 실패 시 200x200으로 자동 폴백된다.
- [ ] 상성 섹션 문구가 /recommendations 카드의 이유와 동일 소스(contribution)에서 생성된다.
- [ ] 상성 제목은 왼쪽 위치와 기존 section-title 토큰을 사용하며 「合いそうな理由」 소제목을 표시하지 않는다. 첫 이유 원문·결속된 작품명 강조·나머지 중복 없는 본문 레이블을 표시하며, 낮은 강도 이유 원문과 빈 이유 안내·caution을 보존한다.
- [ ] mobile에서 실제 첫 근거 카드에 표시되는 「近いポイント」와 겹치는 보조 레이블만 왼쪽에서 생략한다. 1·3개와 달리 2개 상태에서는 왼쪽 보조 레이블을 유지하고, 카드에 없는 실제 이유도 사라지지 않는다.
- [ ] 소개는 기본 최대 5줄이며 넘칠 때만 「続きを読む」를 표시한다. 버튼으로 원문 전체를 펼치고 「閉じる」로 다시 접으며 출처 링크를 유지한다. 화면 폭이 바뀌면 넘침을 다시 판단하고 버튼은 키보드·44px 터치 타깃·확장 상태 안내를 제공한다.
- [ ] mobile 히어로에 상성 이유를 중복 표시하지 않고 본문 「あなたとの相性」에 기존 contribution 이유를 유지한다.
- [ ] 근거 배너는 렌더링된 similarity 근거와 양수 적용 consensus의 실제 supporter만 최대 3개 표시하며 역할을 구분한다. 0개면 생략하고 표지·제목 링크는 키보드와 터치로 상세에 진입한다. desktop 반폭·mobile 적층에서 가로 넘침 없이 표시한다.
- [ ] desktop에서 실제 근거가 1~2개이면 기존 크기의 근거 카드 뒤 남은 슬롯에 대비가 낮은 밝은 카드·책 윤곽 아이콘·「追加の根拠なし」를 표시한다. 빈 카드에는 실제 표지·작품 제목·역할·링크·포커스가 없고 접근성 트리와 실제 근거 개수에 포함되지 않는다. 0개면 배너를 생략한다.
- [ ] mobile은 빈 카드와 그 공간을 제거한다. 실제 근거가 1개면 확장 카드 하나, 2개면 같은 크기의 일반 카드 두 개, 3개면 첫 작품 한 행·나머지 두 작품 아래 2열이다. 확장 카드는 표지와 제목·역할을 좌우에 두고 일반 카드보다 큰 표지와 제목을 사용한다.
- [ ] mobile 확장 카드의 역할 아래에는 Catalog 저자와 「近いポイント」를 표시한다. 포인트는 해당 Anchor를 실제로 참조하는 렌더링된 positive similarity 이유의 Factor/Cluster 레이블만 사용하며, 해당 이유가 없으면 포인트 부분을 생략한다.
- [ ] mobile의 「楽天ブックスで見る」와 검색 대체 버튼은 구매 영역의 전체 폭을 사용한다.
- [ ] 읽음 상태 변경이 Library와 다음 추천에 반영된다.
- [ ] 같은 브라우저에서 external 상세 URL을 새로고침해도 같은 로컬 record와 사용자 상태를 읽는다.
- [ ] 같은 URL을 해당 row가 없는 브라우저에서 열면 local-missing 상태가 되고 provider로 복원하지 않는다.
- [ ] malformed query는 해당 값으로 ID별 local lookup/provider 요청을 하지 않고, corrupt row는 provider 요청과 questionable 서지 렌더링을 하지 않는다.
- [ ] 관련 Shelf selector는 동일 입력에서 같은 work ID 순서이고 external 작품에는 표시되지 않는다.
- [ ] 「似た作品」·「同じ雰囲気の作品」은 Top 10과 같은 카드 컴포넌트의 순위 없는 상태로 표시한다. 표지·제목·저자·상세 링크·키보드 탐색을 유지하며 순위 효과와 순위 안내를 표시하지 않는다.
- [ ] 정상 API 응답에서도 소개가 없으면 같은 ISBN의 수집 소개를 표시하며, 양쪽에 값이 있는 항목은 라쿠텐 값을 선택한다. 다른 Work·ISBN의 수집 정보는 결합하지 않는다.
- [ ] 본문 전체폭의 같은 작가 배너가 실제 다른 Catalog 상세로 이동한다. mobile에서도 책과 문구를 나란히 표시하며 가로 넘침·hover 전용 조작이 없다.

---

## 7. `/library` — 라이브러리

### 목적

내 책 찾기 → 상태 확인 → 기록 수정이 주 작업이다. 읽음/읽는 중/하차 기록과 추천 제외 상태를 투명하게 관리한다(가설 C).

### 주요 액션

「作品を追加」 버튼 → 검색 시트(로컬 Catalog 우선, 하단 「楽天ブックスで探す」 확장).

### 정보 위계 (2026-09-11 관리 흐름 개선 승인)

1. 간결한 제목과 「作品を追加」 → 내 기록 검색 → 상태 탭 → 즐겨찾기 조건·정렬·보기·표시 건수 → 하나의 작품 목록 순서다. 읽기 전용 count matrix와 중복 페이지 설명은 사용하지 않는다.
2. 모든 크기에서 `すべて`+readingState 5종에 **전체 등록 수**를 붙인다. mobile 탭은 높이 최소 44px로 wrap하며 검색·다른 조작과 겹치지 않는다. `favorite=1`은 `reaction === "favorite"`인 기록만 고르는 별도 조건이며 탭이나 readingState가 아니다. 잘못된 값은 무시한다.
3. 검색·상태·favorite 조건을 AND로 적용하고, `最近更新` / `タイトル順`으로 정렬한 **동일 결과 배열**을 grid/list에 표시한다. 같은 기록을 최근·상태별·favorite Shelf에 반복하지 않는다. 결과 수는 목록 위에 짧게 표시하고 `aria-live`로 알린다. 기존 Catalog/external union과 identity는 유지한다.
4. 카드는 표지·제목·감상·있는 진행 기록을 보여준다. 전체 보기에는 상태를 포함하고 단일 상태 필터에서는 같은 상태를 반복하지 않는다. Catalog/external/catalog-missing 구분은 유지한다. 읽는 중 진행 막대는 입력된 volume과 확인된 총 권수가 있을 때만 표시한다. 없는 메모·시간·날짜·진행을 만들지 않는다.
5. 카드/행 전체는 「記録を編集」 버튼이며 작은 문구로 동작을 보인다. 상세 시트에는 기존 기록의 `updatedAt`을 업데이트 날짜로 표시한다. Catalog는 `/works/{catalogWorkId}`, external은 `/works/external?workId={encodedExternalWorkId}` 링크를 사용한다.
6. 기존 기록은 실제 편집 값이 달라야 저장한다. 수정 후 원복하면 다시 비활성화하며 `updatedAt`만 바꾸는 저장을 실행하지 않는다. 판매순 발견의 신규 기록은 기본 상태를 확인하여 저장할 수 있어야 한다. 진행 입력은 「進み具合（任意）」로 접을 수 있고 읽는 중/기존 진행 값이 있으면 기본 펼침이다. 접기는 값을 삭제하지 않는다.
7. populated 목록 하단에는 기존 `/settings?section=data` 안내를 약하게 둔다. 검색 중이거나 표시 결과 0건이면 숨긴다.
8. 2026-09-11 추가 사용자 결정: 전체 기록에 검색·필터·정렬을 적용한 뒤 **24개 단위 페이지네이션**을 한다. 200개면 9페이지이며 한 페이지에 카드가 최대 24개다. 1페이지는 page를 생략하고 2페이지부터 `page`를 URL에 저장한다. q/state/favorite/sort 변경은 1페이지로, grid/list 변경은 현재 페이지를 유지한다. 잘못된 page는 무시하고 결과 범위를 넘으면 마지막 페이지로 replace 정규화한다. 2페이지 이상일 때 `1–24 / 200作品`처럼 표시 범위·전체 결과 수와 이전/페이지 선택/다음을 제공한다. 페이지 조작 후 목록에 포커스를 이동하고 목록 위로 스크롤한다.
9. Library cover resolver의 대상은 현재 페이지와 열린 편집/추가 검색 결과로 한정한다. 기존 visibility demand·cache·ISBN 요청 중복 제거·동시 요청 제한을 재사용한다. 페이지 이동은 이전 resolver generation의 대기 작업을 중단하며 이미 시작한 요청은 기존 제한 아래 완료한다. 모든 기록을 미리 렌더하거나 모든 표지 API를 동시에 호출하지 않는다.

### 검색·추가 계약

검색어가 비어 있을 때 §5 판매순 발견 배너를 표시한다. 입력한 검색어의 처리와 Catalog/external 저장 경계는 아래 계약을 유지한다.

1. 시트 내 검색은 우선 로컬 Catalog(Fuse). 결과에 있으면 그 Work로 추가.
2. 없으면 「楽天ブックスで探す」 → `/api/rakuten/search?title=` 호출 → 결과 각 항목을 ISBN으로 Catalog 대조 → 일치 시 Catalog Work로, 불일치 시 versioned external identity를 생성한다.
3. 작품 추가는 stale tab이 기존 상태를 기본 `planned`로 덮지 못하는 원자적 insert-only 작업이다. `added` 또는 authoritative `already-exists` readback 뒤에만 성공을 알리고, 쓰기 결과를 확정할 수 없으면 `preserved-unknown`으로 남겨 재시도를 안내한다. 같은 external key/ID는 기존 record를 보존하고 새 ISBN만 distinct union으로 합치며 same-ID/different-key는 거부한다.
4. external 상태·감상 편집은 전체 `ExternalWorkRecord`를 upsert하지 않는다. transaction이 최신 row를 읽어 identity를 확인하고 nested `record`만 갱신하며 최신 title·creators·cover와 ISBN union을 보존한다. stale 삭제·손상·key 충돌은 재생성·repair 없이 실패하고, 결과를 확정할 수 없는 primary write는 memory mirror에 재실행하지 않는다.
5. external entry 행에는 「カタログ外」 배지. 추천·DNA에 사용되지 않음을 상세 시트에 명시.

### 상태

- 전체 빈 상태: 승인된 `library-empty-shelf` image-half + 「読んだ作品を記録すると、おすすめから自動的に外れます」 + 추가 버튼. data-portability banner와 동시에 쓰지 않는다.
- populated: 검색어가 없고 표시 결과가 있을 때 목록보다 약한 data-portability banner. 2026-09-11 추가 사용자 지시에 따라 desktop/mobile 모두 목록과 같은 본문 전체 폭을 쓴다. `/media/library-data-portability.png`, DOM 제목/설명, `/settings?section=data` 「データ設定を開く」. 별도 export/import/delete UI와 중복 tools 카드는 두지 않는다.
- 등록 기록은 있지만 표시 결과가 0이면 원인과 다음 행동을 안내한다. 검색어가 있으면 그 검색어와 「検索をクリア」를 표시하고, 상태/favorite 조건이 있으면 적용 조건과 「絞り込みを解除」를 함께 제공한다. 검색어가 없으면 상태/favorite의 빈 안내와 「すべての作品を見る」를 제공한다. 검색 해제는 q만, 조건 해제는 state/favorite만 지우고 sort/view를 보존한다.
- 라쿠텐 검색 실패/오프라인: 「今はカタログ内の作品だけ追加できます」 안내, 로컬 검색은 정상.

### 반응형

- mobile: 검색 위에 탭을 겹쳐 놓지 않는다. 상태 탭은 44px 이상 높이로 wrap하고 count를 레이블에 붙인다. grid는 두 열의 세로 목록, list는 조밀한 행이다. 즐겨찾기 조건은 정렬·보기와 별도 행으로 wrap할 수 있다. 상세는 bottom sheet이며 마지막 카드·포커스 조작의 하단 navigation clearance를 보장한다.
- desktop: 기존 media 최대폭 안의 단일 grid/list와 건수가 있는 상태 탭을 사용하고 상세는 dialog다. grid/list 전환으로 ID·순서·필터는 바뀌지 않는다.

### 접근성

- 상태 탭은 `role="tablist"`이며 keyboard·`?state=` 계약을 유지한다. 표시 방법 컨트롤은 `role="group"`, 즐겨찾기는 눌림 상태를 가진 별도 조건 버튼이다. 행은 버튼(전체 탭 가능). 편집창의 초기 포커스는 제목(`tabIndex=-1`), 추가 시트는 검색 입력이다. 포커스 트랩과 Escape 닫기를 유지하고 원래 카드가 없어졌으면 활성 상태 탭으로 돌아간다. 편집 표지는 목록에서 이미 로드한 URL·크기를 재사용하며 200px fallback을 유지한다.

### 모션

Library와 상세 panel·bottom sheet·dialog는 조용한 표면이다. panel/sheet 진입 keyframe과 표지 load opacity fade를 적용하지 않고 최종 위치·상태로 즉시 표시한다.

### 수용 기준

- [ ] 브라우저 재시작 후 모든 기록이 유지된다.
- [ ] 読んだ/途中でやめた/非表示 작품이 추천 후보에서 제외된다.
- [ ] external entry가 Export에 포함되고 Import로 복원된다.
- [ ] 하차 이유 편집이 다음 추천 감점에 반영된다.
- [ ] Catalog 행 링크는 기존 `/works/{catalogWorkId}`를 유지하고 external 행만 canonical fixed-query URL을 사용한다.
- [ ] 상태 count는 등록 기록, 결과 count/범위는 필터 결과와 현재 페이지에 일치한다. 전체 기록을 필터·정렬한 뒤 최대 24개를 표시하며 grid/list의 ID·순서·페이지가 같다. 페이지 이동/새로고침/범위 초과를 복원·정규화하고 현재 페이지 밖 표지를 일괄 요청하지 않는다. `updatedAt`/reaction/progress 외의 memo·시간 통계를 합성하지 않는다.
- [ ] 모바일 검색·wrap 탭·정렬·보기와 마지막 카드가 조작 가능하고 겹치지 않는다.
- [ ] 검색 0건·빈 상태/favorite 조건을 구분하고 해제 시 관련 URL 조건만 변경한다.
- [ ] 무변경 저장과 수정 후 원복 저장을 막고, 접힌 진행 값을 보존한다. 신규 기록의 명시적 확인·저장은 유지한다.
- [ ] 편집 제목/추가 검색으로 초기 포커스가 이동하고 Escape·포커스 복귀가 동작한다. 추가 검색 결과와 편집창에 같은 작품의 표지가 표시된다.
- [ ] populated data-portability banner는 `/settings?section=data`만 열고 overall-empty image-half·검색 중·필터 결과 0건과 동시에 보이지 않는다.

---

## 8. `/settings` — 설정

### 목적

추천 정책, 데이터 주권(Export/Import/삭제), 서비스 정보. **취향 보정은 여기 없다**(→ /taste).

### 주요 액션

섹션별 개별 액션. 위계상 첫 섹션은 추천 정책.

### 구성

1. dark card 기반 **おすすめの方針**: 현재 네 boolean policy control(노출 여부는 `02` 계약) — 즉시 저장.
2. **Manga DNA**: 현재 adjustment 요약과 `/taste?mode=adjust` 링크. 별도 자동학습/intensity slider는 없다.
3. **データ**:
   - 「エクスポート」 → 온보딩 전에도 `konocomics-export-YYYYMMDD.json` 다운로드. 작품 기록·external identity·adjustments·네 정책 전부·nullable 완료 시각·nullable draft를 포함한다. profile row가 아직 없으면 앱 기본 adjustments/policies를 쓰되 없는 완료 시각은 합성하지 않는다.
   - 「インポート」 → 파일 선택 → mutation 전 whole-file 검증 → 미리보기(작품 수·내보낸 날짜·Catalog version 불일치 경고) → 「置き換える」 확인 다이얼로그(현재 데이터가 대체됨을 명시).
   - 「すべて削除」 → 타이핑 확인(「削除」 입력) 다이얼로그 → 일곱 store를 한 트랜잭션으로 비우고 현재 runtime meta만 재생성 → authoritative readback 뒤 랜딩으로.
4. **このアプリ**: 버전, 데이터가 브라우저에만 저장됨 안내, `Supported by Rakuten Developers`와 Affiliate ID가 설정된 경우의 관계를 별도 항목으로 표시, 앱 자체 라이선스는 「未設定」, 「紹介をもう一度見る」(/?landing=1 — write-free 리다이렉트 우회). `package.json`의 `private: true`를 라이선스로 해석하지 않는다.

계정·이메일·알림·weekly report·cloud sync·theme selector는 없다. 제품은 dark-only다.

### 상태

- Import 검증 실패: 구체 오류 — 「バージョンが新しすぎます(v2)。アプリを更新してください」 / 「ファイル形式が正しくありません(details)」. external row 하나, profile/draft 교차 필드 하나라도 잘못되면 mutation 전 전체 거부하며 **부분 적용 절대 금지**다.
- Catalog version 불일치: 오류가 아니라 경고다. 현재 Catalog에 없는 기록도 보존하고 Library에서 「カタログ外」로 표시한다.
- Import 성공: imported userWorks/externalWorks/profile/draft, 빈 recommendation/provider cache, 현재 runtime meta의 exact readback 뒤에만 스낵바를 표시한다. 추천 cache가 비었으므로 usable profile의 다음 진입에서 재계산한다.
- Import·삭제 결과를 primary readback으로 확정할 수 없으면 성공이나 기존 상태 불변을 주장하지 않는다. 자동 memory replay 없이 확인 불가 상태와 재로딩 후 확인 방법을 표시한다. 의도적 memory-only 모드를 제공한다면 영속 성공과 다른 session-only 안내가 필요하다.

### 수용 기준

- [ ] usable profile에서 Export → 전체 삭제 → Import로 추천·Library·정책·canonical external URL/identity가 온보딩 없이 원상 복구된다(E2E #5).
- [ ] pre-profile의 nullable 완료 시각과 first-run draft도 Export/Import되고, 없는 완료 시각을 합성하지 않는다.
- [ ] 손상 JSON·external identity·profile/draft 모순 Import는 mutation 전 전체 거부되고 기존 일곱 store가 조금도 변하지 않는다.
- [ ] Catalog version 불일치 경고 뒤에도 out-of-current-catalog 기록이 보존되고 「カタログ外」로 표시된다.
- [ ] 전체 삭제 readback은 여섯 data/cache store가 비고 meta만 현재 값임을 확인하며, 이후 /recommendations 접근은 first-run 온보딩으로 유도된다.

---

## 9. 공유 컴포넌트 계약 (요약)

Base UI primitive는 shadcn CLI로 `src/components/ui/**`에 생성하고 `src/components/design-system/**` wrapper가 dark token, 44px target, focus/disabled/busy contract를 적용한다. feature는 wrapper를 통해서만 primitive를 사용한다.

| 컴포넌트             | 책임                     | 핵심 규칙                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CoverImage`         | 모든 표지 렌더           | 원본 비율(object-contain), radius 4px, 1px `--line` 테두리, 로드 실패 시 타이포 placeholder, `_ex` 크기 프리셋(thumb 200/card 400/hero 600), lazy loading                                                                                                                                                                                                                    |
| `MediaShelf`         | 가로 탐색                | CSS scroll-snap + ResizeObserver. Featured는 inert/aria-hidden clone을 둔 3-copy pointer/touch 루프이고 키보드는 canonical card 끝에서 비순환한다. 나머지 Shelf는 끝에서 화살표·키보드 비순환이다. overlay variant는 track 시작선을 콘텐츠 shell에 유지한 채 좌우 fade 폭만큼 viewport와 fade를 negative gutter로 확장한다. reduced-motion instant scroll, Embla/Swiper 없음 |
| `RecommendationCard` | 추천 featured 탐색       | 4px-grid 고정 poster(Desktop 344×448), 2줄 title slot·메타/confidence·원본비율 표지·lead reason. fine pointer hover/focus는 외곽 고정 상태에서 표지를 줄이고 최대 3줄 reason+44px icon action rail을 열며 coarse pointer는 rail을 상시 표시한다. identity는 상세, Quick Preview는 작품 단위 접근 이름을 가진 ScanSearch icon control                                         |
| `RankingShelf`       | Top 10                   | `<ol>` + 화면에 보이는 텍스트 순위, canonical plan 순서 유지. Quick Preview 없음                                                                                                                                                                                                                                                                                             |
| `QuickPreview`       | 상세 전 주요 정보/action | desktop Dialog/mobile Sheet wrapper, `?preview` 대상만 URL, focus trap/opener 복원. opener는 동일 ScanSearch+「クイック表示」 quiet 컨트롤이며 identity `Link` 밖에 둔다. Top 10에는 없다                                                                                                                                                                                    |
| `ReasonChips`        | 이유·주의점 표시         | contribution 데이터에서만 생성, cluster당 1개, 최대 3+1                                                                                                                                                                                                                                                                                                                      |
| `ConfidenceLabel`    | 확신도 표시              | 3단 레이블만, 숫자·퍼센트 금지                                                                                                                                                                                                                                                                                                                                               |
| `WorkSearchSheet`    | 검색·추가                | 로컬 우선 → 라쿠텐 확장, ISBN 대조                                                                                                                                                                                                                                                                                                                                           |
| `StateActionRow`     | 読みたい/読んだ/興味なし | 44px 타깃, 처리 후 후속 시트(스킵 가능)                                                                                                                                                                                                                                                                                                                                      |
| `FactorBar`          | DNA 막대                 | 확인값=meter 시맨틱, 미확인=이름 있는 비수치 상태+윤곽선, 값 표기는 레이블                                                                                                                                                                                                                                                                                                   |
