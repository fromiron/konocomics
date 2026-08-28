# 03 — UX 화면 계약 (Screen Contracts)

> 각 화면의 구현 계약. Router/search/SSR 소유권은 `08-tanstack-start-migration.md`, 비주얼 토큰·모션은 `04-visual-interaction-spec.md`, 데이터 흐름은 `05-architecture.md` 참조.
> 브레이크포인트: **mobile < 768px ≤ tablet < 1024px ≤ desktop**. 태블릿은 명시된 경우에만 desktop과 다르게 취급한다.

---

## 0. 전역 셸과 내비게이션

제품은 dark-only다. light mode와 theme selector를 렌더하지 않는다.

### 구조

- `>=768px`: dark 상단 GNB만 표시한다. 좌측 로고(**kono**co**mi**cs), 우측 `おすすめ`(/recommendations), `DNA`(/taste), `ライブラリ`(/library), `設定`(/settings)을 둔다.
- `<768px`: post-onboarding route에서 하단 탭 바 4개만 표시한다. 높이 64px, 아이콘+레이블, 터치 타깃 ≥44×44다. `/`와 `/onboarding`은 immersive route라 bottom navigation을 표시하지 않는다.
- 두 navigation은 CSS media query로 상호 배타적으로 숨기며 숨겨진 쪽은 accessibility tree에도 남기지 않는다. 로그인·계정·아바타·알림 control은 없다. Global Search는 실제 dialog/sheet 기능이 연결된 경우에만 표시한다.
- Catalog 상세 `/works/[workId]`와 고정 external 상세 `/works/external?workId=<ExternalWorkId>`는 탭 바를 유지한 채 스택처럼 열린다. 뒤로가기는 브라우저 history다.

### 전역 상태

- **Catalog 로드 실패(치명):** 풀스크린 오류 — 「カタログを読み込めませんでした」 + 再試行 버튼. 앱의 나머지는 렌더하지 않는다.
- **오프라인:** Dexie 기반 기능(DNA·Library·기존 추천)은 정상. 라쿠텐 의존 요소만 개별 폴백(각 화면 참조). 전역 배너는 두지 않는다.
- **라우트 가드:** 현재 Catalog의 서로 다른 favorite/liked 작품이 5개 이상이면 완료 marker와 무관하게 usable profile이다. 5개 미만+`onboardingCompletedAt` 존재는 `/onboarding` add recovery, 5개 미만+marker `null`은 first-run으로 보낸다. /taste·/recommendations만 이 가드를 적용하고 /library·/settings는 온보딩 전에도 접근·Export할 수 있다.

### URL 상태

- 모든 route는 Zod `validateSearch`를 갖고 malformed 값은 안전한 기본값으로 정규화한다.
- `/onboarding`: `q`, `genre`, `shelf`; `/taste`: `mode`, `group`; `/recommendations`: `preview`, `genre`, `sort`, `shelf`; `/library`: `state`, `q`, `sort`, `view`; `/settings`: `section`.
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
4. 첫 방문자를 위해 명시적으로 큐레이션한 editorial Top 10 ranking(`<ol>`). 시장 popularity나 개인화 결과로 주장하지 않고 「今週の人気」 같은 문구는 쓰지 않는다. 1위 card는 Top 10 crown accessory의 기본 spotlight이며, 다른 card의 fine-pointer hover 또는 keyboard focus 동안 accessory가 해당 순위로 이동하고 이탈 시 1위로 돌아온다. generic card Y축 lift는 적용하지 않는다.
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
3. 장르별 가로 Shelf (CSS scroll-snap): アクション / ファンタジー / 歴史 / SF / ミステリー / その他
4. 하단 고정 Selected Tray: 선택된 표지 썸네일 + 개수 + 진행 버튼

### 컴포넌트 책임

- `WorkSearchInput`: 300ms 디바운스, NFKC·가나 정규화 질의, 결과는 Shelf 영역을 대체하는 그리드로 표시. 비우면 Shelf 복귀.
- `AnchorCoverCard`: 표지 + 제목. 상태 unselected / selected(liked) / selected(favorite). 선택 카드에서 별 아이콘 탭 → favorite 토글. 선택 시 체크 오버레이 + 테두리 accent.
- `SelectedTray`: 썸네일 탭 → 선택 해제. 가로 스크롤. Motion layout으로 추가/제거 재배치.

### 상태

- initial: Shelf 표시, tray 비어 있음 + 「まだ選ばれていません」.
- 검색 결과 없음: 「見つかりませんでした。別の書き方で試してください」 + Catalog에 없는 작품은 라이브러리에서 나중에 추가할 수 있다는 1줄 안내.
- 10개 도달: 추가 선택 시 카드가 선택되지 않고 tray가 짧게 흔들리며(4px, 120ms×2) 안내 토스트 「最大 10 作品までです」.
- 중단·복귀: `OnboardingDraft.positiveEntries[]`에 `workId`와 `favorite | liked` reaction을 함께 담아 매 변경 시 Dexie에 저장. 재진입 시 reaction까지 복원.
- 표지 로드 실패: 타이포그래피 placeholder(`04` §4.3). 선택 기능은 동일.

### 반응형

- mobile: Shelf 카드 폭 ~104px(표지 3:4.3 비율), 한 화면에 3.5장 보이게(스크롤 가능성 암시). tray 높이 88px.
- desktop: Shelf 대신 장르 섹션별 그리드(6~8열)로 전개해도 좋으나, **Shelf 유지 + 카드 폭 128px**로 통일한다(구현 단순화, 좌우 화살표 버튼 표시).

### 인터랙션

- 키보드: 카드로 Tab 이동, Enter/Space 선택 토글. Shelf 내 좌우 화살표로 이동(roving tabindex). 검색 입력 `/` 단축키 없음(일본어 IME 간섭 방지).
- 카드에 `aria-pressed` 상태. 선택 시 「選択済み」 어나운스.

### 모션

선택 시 카드 → tray로의 fly-to 애니메이션은 **하지 않는다**(구현·성능 대비 가치 낮음). tray 내 썸네일 등장은 Motion layout(200ms spring). 카드 선택 피드백은 120ms scale 0.97→1 + 체크 페이드.

### 수용 기준

- [ ] 5개 미만에서 진행 버튼이 disabled + 남은 개수 표기.
- [ ] favorite/liked가 구분 저장되고 STEP 2로 전달된다.
- [ ] 「ダンジョン飯」를 히라가나(だんじょんめし)로 검색해도 찾을 수 있다(가나 필드).
- [ ] 새로고침 후 선택 상태가 복원된다.
- [ ] 키보드만으로 8개 선택 → 다음 단계 진행이 가능하다.

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
2. **상위 취향 3개 요약 카드**: 취향 레이블 + 근거 Anchor 표지 칩 1~3개 ("『キングダム』『ダンジョン飯』から")
3. 동일 deterministic profile의 대표 축을 요약한 radar. 새 chart dependency 없이 inline SVG/CSS로 그리고 같은 데이터를 text list로 제공한다.
4. 근거 작품 `MediaShelf`
5. 5개 범주(장르/테마/전개/톤·관계/작화)의 compact summary row. 각 row는 범주 icon, 실제 profile에서 계산한 대표 factor, 조정 상태, 명시적인 「詳細設定」 disclosure를 제공한다. 초기에는 모두 접고 한 번에 한 범주의 상세만 연다. 장르는 분석 전용으로 가로 막대(0~4) + 일본어 레이블만 제공하고 보정 control을 만들지 않는다. 나머지 네 범주의 열린 상세에는 기존 5단 보정 control을 그대로 제공한다.
6. 보정 전후 같은 recommendation engine을 local에서 실행해 work ID 변화만 보여 주는 preview. network 요청과 별도 추천 산식은 없다.
7. `UserWorkRecord.updatedAt`과 기존 reasons로 구성한 최근 feedback 요약 + 「作品を追加して精度を上げる」 링크

### 막대 규칙

- 값 = 사용자 positive anchor들의 가중 평균에서 추론된 선호 강도(엔진의 프로필 요약 출력).
- 확인값의 표시 레이블: `<0.5 → ごく控えめ`, `<1.5 → 控えめ`, `<2.5 → ほどほど`, `<3.5 → 強め`, 그 외 `とても強め`. 숫자 원값은 화면에 표시하지 않는다.
- **미확인 축: 빈 윤곽선 막대 + 「まだ分析中」. 0으로 그리지 않는다.**
- 보정 radio 5단: `とても好き / 好き / 自動 / 控えめに / 除外`. 기본 `自動`. 반복되는 segmented box 대신 배경·외곽선이 없는 marker + label 행을 사용하고, 선택값은 채운 marker와 굵은 text로 구분한다. `除外`는 앞의 가는 구분선으로 일반 강도 조절과 분리하며 선택 시에만 marker와 text를 경고색으로 표시한다. 확인 다이얼로그 없이 즉시 적용한다.
- adjustment workspace의 visible contract는 「おすすめを調整」이다. 설명은 분석값이 바뀌지 않고 설정만 추천에 반영된다는 점과 `自動`이 분석 결과를 따른다는 점을 명시한다. 열린 보정 범주의 desktop 상세은 `分析した好み` / `おすすめへの反映` 두 열 제목과 가는 구분선을 사용한다. FactorBar는 read-only 분석 출력이며 radio 변경으로 값·길이·색을 바꾸지 않는다.

### 상태

- reveal(1회): §`04` 5.2의 시퀀스. `?reveal=1`을 발견하면 현재 mount의 reveal 여부를 local state/ref에 먼저 고정하고 같은 effect에서 query를 즉시 `replaceState`로 제거한다. 이후 A 시퀀스는 고정된 판정으로 계속하며 URL을 진행 중 상태나 재생 token으로 사용하지 않는다.
- 보정 변경 직후: 선택 marker와 text 상태를 즉시 반영하고, 저장 성공 시 어떤 factor를 어떤 값으로 변경했는지 `aria-live` snackbar로 알린다. FactorBar에는 보정 성공 highlight나 값 전이를 적용하지 않는다.
- anchor < 5 (가드 통과 못함): /onboarding 리다이렉트.

### 반응형

- mobile: 5개 범주 summary를 1열로 쌓고 한 범주의 상세만 연다. 열린 상세은 각 FactorBar 아래에 visible `おすすめへの反映` micro-label과 줄바꿈 없는 가로 스크롤 radio 행을 둔다.
- desktop: 최대폭 960px의 full-width 범주 row를 사용하고 한 범주의 상세만 연다. 분석 전용 장르 상세은 2열 meter grid로 10개 항목을 5행에 배치한다. 보정 가능한 네 범주는 sticky `分析した好み` / `おすすめへの反映` 열 제목 아래 FactorBar + 5단 control 행을 유지한다.

### 접근성

- 확인된 막대는 축 레이블만 접근 가능한 이름으로 사용하고 `role="meter"` + `aria-valuemin/max/now`를 제공한다. `aria-valuetext`는 중복된 축 이름이나 숫자 없이 위 정성 레이블만 제공한다(예: 이름 `戦略的な展開`, `aria-valuetext="強め"`).
- radar와 동일한 값은 keyboard/screen reader가 읽을 수 있는 text list로 중복 제공하고 SVG 자체는 장식으로 처리한다.
- 각 범주의 「詳細設定」은 범주명을 포함한 accessible name, `aria-expanded`, `aria-controls`, visible focus를 가진 44px 이상 button이다. 접힌 상세의 control은 accessibility tree에서 제외한다.
- 보정 선택은 `「{factor}」のおすすめへの反映を設定` 형식의 이름을 가진 radiogroup이며 각 선택은 44px 이상 target, visible label, outline/filled marker, `aria-checked`, visible focus를 제공한다. 선택 상태는 색만으로 전달하지 않는다. 미확인 막대는 가짜 0을 넣지 않고, 축 이름과 「まだ分析中」을 함께 읽는 비수치 group 상태로 노출한다.
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
- [ ] radio 변경 전후 해당 FactorBar의 `aria-valuenow`와 시각 길이는 동일하며, 막대 highlight 대신 구체적인 저장 `aria-live` message와 recommendation preview가 실제 영향을 전달한다.
- [ ] 열린 범주의 모든 기존 5단 보정 control을 keyboard로 접근할 수 있고 접고 다시 열어도 값이 유지된다.
- [ ] 보정 칩 변경 → Dexie 반영 → /recommendations 재진입 시 추천이 변한다.
- [ ] 미확인 축이 0값 축과 시각·접근성 DOM 시맨틱 모두에서 구분된다. 실제 스크린리더 낭독 검증은 제품 완료 후 선택적 접근성 감사 범위다.
- [ ] 상위 취향 3개 각각에 근거 Anchor 칩이 표시된다.
- [ ] 보정 preview의 before/after work ID가 동일 engine input에서 결정론적으로 계산되고 영속 추천 결과를 URL이나 Router context에 저장하지 않는다.

---

## 5. `/recommendations` — 추천

### 목적

핵심 효용 전달: "아직 읽지 않은, 취향에 맞는 10작품 + 납득 가능한 이유".

### 주요 액션

카드별 3버튼: **読みたい**(주요) / 読んだ / 興味なし. 페이지 레벨 액션: 정책 선택 칩(완결 우선/숨은 작품/검증작), 「更新」 버튼(수동 재계산).

### 정보 위계

1. 현재 적용 중인 정성 기준/policy 요약과 presentation filter bar
2. plan order 상위 작품의 `FeaturedRecommendationShelf` + expandable card
3. lead contribution의 anchor/reason별 Shelf
4. engine plan에서 이미 discovery/completed 성격인 항목을 추출한 Shelf
5. canonical plan 첫 10개를 그대로 보여 주는 personalized Top 10(`<ol>`)
6. 피드백 반영 요약과 footer

Shelf grouping은 presentation-only selector다. main Shelf 사이에는 work ID를 dedupe할 수 있지만 Top 10은 canonical summary이므로 중복을 허용한다. score를 다시 계산하거나 새로운 가중치·인기 순위를 만들지 않는다.

### Expandable card·Quick Preview

- 카드에는 원본 비율 표지, 제목/저자/메타, 실제 `contributions[]` 기반 lead reason, 정성 confidence와 reading action을 표시한다.
- desktop fine pointer의 첫 진입은 1위 card를 300~360px 확장 상태로 보여 주고, 같은 viewport에 220~250px의 접힌 2·3위 card가 함께 보이게 한다. 접힌 card는 200ms hover intent 뒤 확장하고 keyboard focus는 즉시 확장한다. Shelf 높이는 212px로 미리 예약하며 기존 제목·메타·확신도·action의 폭·패딩·정렬·글자 크기·줄바꿈은 접힌 상태와 동일하게 유지한다. 실제 article 경계만 240ms 동안 확장하고, 전경 표지는 하나의 30:43 고정 크기 DOM으로 이동하는 가장자리를 따라 translate만 하며 scale하지 않는다. backdrop은 동일 URL 표지를 낮춘 채도로 blur한다. 추천 이유는 새로 열린 영역에만 opacity로 나타나며 기존 카피를 밀지 않는다. compact action은 정확히 44px 레일과 16px 아이콘이며 접근 가능한 이름·pressed/busy 상태를 유지한다. 왼쪽 확장에서는 card가 shelf 밖으로 넘치지 않게 scroll 위치를 보정한다.
- touch에서는 card를 확장하지 않고 Quick Preview sheet를 연다. desktop preview는 Base UI Dialog wrapper를 사용한다.
- Quick Preview는 cover, lead reasons, caution, 정성 confidence, reading action, 상세 링크만 가진다. 닫으면 opener focus를 복원한다. 대상 work ID만 `?preview=<workId>`로 복원할 수 있고 animation/focus state는 local state다.

### 리스트 동작 계약

- 진입 시: 프로필 입력 해시가 저장된 계산 해시와 다르면 재계산, 같으면 저장된 plan을 표시한다. 재계산 시 200ms 미만이면 로딩 UI를 생략하고, 이상이면 현재 Shelf/card silhouette의 skeleton을 표시한다.
- 보이는 카드의 표지는 순위 순 `workId → representativeVolume ISBN`으로 해석한다. 1위의 exact-workId fresh metadata를 cache 또는 provider 갱신+저장 readback까지 먼저 확정한 뒤 2~10위를 병렬로 해석하고, 백필 때는 생존 카드 URL을 유지한 채 새 카드만 해석한다. fresh no-image와 cache/provider 실패는 placeholder로 끝내되 카드·이유·액션을 제거하지 않는다.
- `読んだ` / `興味なし`: 영속 쓰기 성공 뒤 카드 제거(Motion layout, 240ms) → 최초 계산에서 보존한 전체 후보 plan의 다음 순위로 즉시 백필한다(점수 재계산 없음, 리스트는 항상 10개 유지, 후보 소진 시 예외). `読んだ`는 `completed`로 저장한 뒤 후속 시트의 `最高/良かった/普通/いまいち`를 `favorite/liked/neutral/disliked`에 대응하며 스킵은 reaction 없음이다. `興味なし`는 `hidden`으로 저장하고, 이유 칩을 고른 경우만 `disliked + negativeReasons`를 추가한다. 스킵은 reaction·reason 없음이며 `vagueDislike`를 합성하지 않는다.
- `読みたい`: 카드 유지, 버튼이 확정 상태로 변경 + Library(planned)에 추가.
- 「更新」: 전체 재계산. 이전 목록과 동일 입력이면 동일 결과(결정론)임을 전제로, 버튼은 입력 변경이 있을 때만 활성화.

### 상태

- 후보 부족(<10): 있는 만큼 표시 + 말미 카드 「候補を増やすには: 好きな作品を追加 / 除外条件をゆるめる」.
- 후보 0: 빈 상태 일러스트 + 위 안내 + /taste 링크.
- 오프라인/이미지 실패: placeholder 표지, 이유·액션은 정상.
- 계산 오류(스키마 불일치 등): 오류 카드 + 再試行. Library는 영향 없음.

### 반응형

- mobile: 2.4장 이상 보이는 poster Shelf + 고정 compact card를 사용하고 상세 정보는 Quick Preview sheet에서 제공한다. action target은 모두 44px 이상이다.
- desktop: 최대폭 1200px에서 가로 Shelf와 expandable card를 사용한다. canonical Top 10은 ranking Shelf/row로 순위를 명확히 표시한다.

### 인터랙션·접근성

- Slice 7에서는 아직 존재하지 않는 `/works/[id]` 404나 가짜 상세 셸을 노출하지 않도록 표지·제목·메타 identity 영역을 비대화형으로 둔다. Slice 8에서 실제 상세 계약이 구현되는 순간 이 identity 영역 전체를 `/works/[id]` 링크로 승격하고 버튼 영역의 이벤트를 분리한다.
- Top 10만 `<ol>`로 순위 의미를 부여한다. 카드 제거·백필 시 `aria-live="polite"`로 「1件を除外し、新しい候補を追加しました」.
- 스와이프 제스처는 도입하지 않는다(발견 가능성 낮고 오조작 위험).

### 모션

카드 제거/백필은 해당 Shelf owner의 C만 사용한다. expandable card는 실제 article 경계를 240ms signature easing으로 확장하는 `04` §6의 한정 예외를 사용하고, 전경 표지는 가장자리 translate만 보간하며 기존 카피·action 기하는 고정한다. 추천 이유만 새로 노출된 공간에서 opacity로 나타나며 가변 폭에 맞춘 text reflow는 노출하지 않는다. reduced-motion에서는 확장과 표지 이동·reveal을 모두 즉시 반영한다. hover intent는 network 요청 없이 local detail을 열고, generic hover Y축 lift는 사용하지 않는다. Quick Preview는 진입 keyframe 없이 최종 상태로 열린다. 추천 화면에는 B 페이지 진입 모션을 적용하지 않는다.

### 수용 기준

- [ ] 동일 프로필 입력에서 새로고침해도 목록·순서가 동일하다.
- [ ] desktop 첫 진입에서 1위 card가 확장되어 있고 2·3위 접힌 card와 선택된 상세 panel이 함께 보인다.
- [ ] `読んだ` 처리한 작품이 이후 어떤 추천에도 다시 나타나지 않는다.
- [ ] 각 카드의 이유가 해당 카드 contribution 데이터와 일치한다(E2E에서 data-attribute 대조).
- [ ] 카드 제거→후속 시트→백필이 키보드 포커스를 잃지 않는다(시트가 열리면 내부로, 닫히면 제거된 카드 다음 카드로 복귀).
- [ ] 정책 칩 변경 시 목록이 재계산되고 칩 상태가 Dexie에 저장된다.
- [ ] 1위 카드 표지는 첫 viewport의 LCP 후보로 eager/high-priority 요청되고 나머지 표지는 lazy loading을 유지한다.
- [ ] 1위 표지 해석이 끝나기 전에 2~10위 provider 요청이 시작되지 않으며, expired/mismatched/miss만 갱신하고 fresh exact-workId no-image는 재요청하지 않는다.
- [ ] hover/focus expansion과 touch Quick Preview가 같은 정보·action을 제공하고 닫은 뒤 opener focus가 복원된다.
- [ ] presentation Shelf를 추가해도 동일 fixture의 canonical Top 10 work ID 순서가 바뀌지 않는다.

---

## 6. 작품 상세 — `/works/[workId]` · `/works/external?workId=<ExternalWorkId>`

### 목적

Catalog 작품은 추천 근거를 깊이 확인하고 구매(라쿠텐)로 연결한다. external 작품은 같은 프레젠테이션 골격에서 로컬 서지 정보와 상태만 관리하며 추천 문맥 밖에서도 동작한다.

### 주요 액션

**「楽天ブックスで見る」** (affiliate 링크, 새 탭). 부가: 읽음 상태 변경 드롭다운, 読みたい 토글. 토글은 record 없음 ↔ 부가 정보 없는 최소 `planned` record일 때만 양방향이며, 다른 상태·감상·진행·이유가 있는 record는 상태 드롭다운이 소유하고 삭제하지 않는다.

### 정보 위계

1. 히어로: 동일 표지 URL의 강한 블러 배경(`aria-hidden`) 위에 원본 비율 표지(고해상도 `_ex=600x600`)
2. 제목·저자·출판사·연재 상태·권수
3. **「あなたとの相性」 섹션** (프로필 존재 시): 이유 3 + 주의점 1 + 근거 Anchor 표지 칩 + 확신도 레이블
4. 작품 소개문(라쿠텐 itemCaption)
5. 이 작품의 주요 팩터 요약(레이블 칩: 戦略 / 群像劇 / ダークめ 등 — 값 ≥3 또는 centrality 2인 것만)
6. 구매 링크 + 가격·재고(ProviderListing, TTL 내) + `Supported by Rakuten Developers`
7. Catalog 작품만 deterministic known factor/theme selector로 구성한 관련/Same Mood Shelf. core 추천 순위는 변경하지 않으며 external에는 factor를 추측하지 않는다.

### 상태

- 추천 문맥 없이 진입(프로필 없음): 상성 섹션 생략, 팩터 요약은 표시.
- ProviderListing 만료·실패: 가격·재고 숨김, 구매 버튼은 itemUrl 캐시가 있으면 유지, 없으면 「楽天ブックスで検索」(제목 질의 링크)로 대체.
- Catalog route는 bundled Catalog ID만 허용한다. 존재하지 않는 `/works/[workId]`는 실제 404 페이지 + /recommendations 링크이며 external ID를 이 route에서 해석하거나 리다이렉트하지 않는다.
- external entry는 고정 정적 셸 `/works/external?workId=<ExternalWorkId>`만 사용하고 팩터·상성 섹션 없이 서지 정보와 상태 관리만 표시한다. query는 hydration 뒤 client feature가 읽으며 `workId`가 정확히 한 번 존재하고 `^ext:rakuten:v1:[0-9a-f]{64}$`를 만족한 뒤에만 IndexedDB를 조회한다.
- external query가 없거나 중복·비어 있음·namespace/version/digest 형식이 틀리면 in-page invalid-link 상태와 /library 이동만 표시한다. 해당 값을 `inspectExternalWork`에 넘기거나 Rakuten API를 호출하지 않고 404·Catalog route로 바꾸지 않는다. 전역 PersistenceProvider의 일반 초기화는 이 ID별 lookup과 별개다.
- 유효 ID가 이 브라우저에 없으면 저장되지 않은 로컬 작품 상태와 /library 이동을 표시한다. digest에서 작품을 복원하거나 제목 검색·빈 record 생성을 하지 않는다.
- 로컬 row의 strict schema, parent/nested ID, canonical key 또는 ID/digest가 맞지 않으면 서지 정보를 렌더하지 않는 local-data error를 표시한다. 자동 repair/re-key와 provider 요청은 하지 않는다. IndexedDB 자체를 읽을 수 없으면 missing/corrupt와 구분되는 unavailable 상태를 표시한다.

### 반응형

- mobile: 히어로 표지 높이 최대 40vh, 이하 세로 스크롤.
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
- [ ] 읽음 상태 변경이 Library와 다음 추천에 반영된다.
- [ ] 같은 브라우저에서 external 상세 URL을 새로고침해도 같은 로컬 record와 사용자 상태를 읽는다.
- [ ] 같은 URL을 해당 row가 없는 브라우저에서 열면 local-missing 상태가 되고 provider로 복원하지 않는다.
- [ ] malformed query는 해당 값으로 ID별 local lookup/provider 요청을 하지 않고, corrupt row는 provider 요청과 questionable 서지 렌더링을 하지 않는다.
- [ ] 관련 Shelf selector는 동일 입력에서 같은 work ID 순서이고 external 작품에는 표시되지 않는다.

---

## 7. `/library` — 라이브러리

### 목적

읽은/읽는 중/하차 기록의 관리와 추천 제외 목록의 투명성. 기록 축적이 추천을 개선한다는 감각을 만든다(가설 C).

### 주요 액션

「作品を追加」 버튼 → 검색 시트(로컬 Catalog 우선, 하단 「楽天ブックスで探す」 확장).

### 정보 위계

1. 실제 Catalog+external union에서 계산한 상태별 count summary와 filter/tab toolbar
2. `updatedAt` 기반 최근 변경 Shelf
3. 読んでる / 読みたい / 読んだ / favorite(`reaction === favorite`) grouped Shelf. 선택 filter에 따라 해당 Shelf만 줄일 수 있다.
4. 읽는 중 card의 volume/chapter progress와 상태 badge. 메모·읽은 시간·cloud 통계는 만들지 않는다.
5. card/행 탭 → 상세 시트: readingState / reaction / 진행 권수 / 이유 편집. Catalog는 `/works/{catalogWorkId}`, external은 `/works/external?workId={encodedExternalWorkId}` 링크를 사용한다.

### 검색·추가 계약

1. 시트 내 검색은 우선 로컬 Catalog(Fuse). 결과에 있으면 그 Work로 추가.
2. 없으면 「楽天ブックスで探す」 → `/api/rakuten/search?title=` 호출 → 결과 각 항목을 ISBN으로 Catalog 대조 → 일치 시 Catalog Work로, 불일치 시 versioned external identity를 생성한다.
3. 작품 추가는 stale tab이 기존 상태를 기본 `planned`로 덮지 못하는 원자적 insert-only 작업이다. `added` 또는 authoritative `already-exists` readback 뒤에만 성공을 알리고, 쓰기 결과를 확정할 수 없으면 `preserved-unknown`으로 남겨 재시도를 안내한다. 같은 external key/ID는 기존 record를 보존하고 새 ISBN만 distinct union으로 합치며 same-ID/different-key는 거부한다.
4. external 상태·감상 편집은 전체 `ExternalWorkRecord`를 upsert하지 않는다. transaction이 최신 row를 읽어 identity를 확인하고 nested `record`만 갱신하며 최신 title·creators·cover와 ISBN union을 보존한다. stale 삭제·손상·key 충돌은 재생성·repair 없이 실패하고, 결과를 확정할 수 없는 primary write는 memory mirror에 재실행하지 않는다.
5. external entry 행에는 「カタログ外」 배지. 추천·DNA에 사용되지 않음을 상세 시트에 명시.

### 상태

- 전체 빈 상태: 「読んだ作品を記録すると、おすすめから自動的に外れます」 + 추가 버튼.
- 탭별 빈 상태: 탭 의미에 맞는 1줄 안내.
- 라쿠텐 검색 실패/오프라인: 「今はカタログ内の作品だけ追加できます」 안내, 로컬 검색은 정상.

### 반응형

- mobile: poster Shelf/compact row를 상태별로 쌓고 상세는 bottom sheet다. 하단 navigation clearance를 보장한다.
- desktop: 최대폭 1200px grouped Shelf와 count summary를 사용하고 상세는 dialog다.

### 접근성

- 상태 탭은 `role="tablist"`. 행은 버튼(전체 탭 가능). 시트 열림 시 포커스 트랩, 닫힘 시 원 위치 복귀.

### 모션

Library와 상세 panel·bottom sheet·dialog는 조용한 표면이다. panel/sheet 진입 keyframe과 표지 load opacity fade를 적용하지 않고 최종 위치·상태로 즉시 표시한다.

### 수용 기준

- [ ] 브라우저 재시작 후 모든 기록이 유지된다.
- [ ] 読んだ/途中でやめた/非表示 작품이 추천 후보에서 제외된다.
- [ ] external entry가 Export에 포함되고 Import로 복원된다.
- [ ] 하차 이유 편집이 다음 추천 감점에 반영된다.
- [ ] Catalog 행 링크는 기존 `/works/{catalogWorkId}`를 유지하고 external 행만 canonical fixed-query URL을 사용한다.
- [ ] 상태 count·recent/favorite Shelf는 실제 record와 `updatedAt`/reaction만 사용하고 memo·시간 통계를 합성하지 않는다.

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

| 컴포넌트 | 책임 | 핵심 규칙 |
|---|---|---|
| `CoverImage` | 모든 표지 렌더 | 원본 비율(object-contain), radius 4px, 1px `--line` 테두리, 로드 실패 시 타이포 placeholder, `_ex` 크기 프리셋(thumb 200/card 400/hero 600), lazy loading |
| `MediaShelf` | 가로 탐색 | CSS scroll-snap + ResizeObserver, overflow일 때만 control, reduced-motion instant scroll, Embla/Swiper 없음 |
| `ExpandableMediaCard` | desktop 탐색 | pointer-fine 200ms intent, focus 즉시 확장, local data만 사용, touch에서는 Quick Preview |
| `RankingShelf` | Top 10 | `<ol>` + 화면에 보이는 텍스트 순위, canonical plan 순서 유지 |
| `QuickPreview` | 상세 전 주요 정보/action | desktop Dialog/mobile Sheet wrapper, `?preview` 대상만 URL, focus trap/opener 복원 |
| `ReasonChips` | 이유·주의점 표시 | contribution 데이터에서만 생성, cluster당 1개, 최대 3+1 |
| `ConfidenceLabel` | 확신도 표시 | 3단 레이블만, 숫자·퍼센트 금지 |
| `WorkSearchSheet` | 검색·추가 | 로컬 우선 → 라쿠텐 확장, ISBN 대조 |
| `StateActionRow` | 読みたい/読んだ/興味なし | 44px 타깃, 처리 후 후속 시트(스킵 가능) |
| `FactorBar` | DNA 막대 | 확인값=meter 시맨틱, 미확인=이름 있는 비수치 상태+윤곽선, 값 표기는 레이블 |
