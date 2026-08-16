# 02 — 작품 선택·온보딩 (`/onboarding`)

## 목표

확정 이미지의 search-first 선택 경험, 선택 수 표시, 장르 chip, 가로 작품 Shelf, collection card, 선택 tray를 구현하면서 현재 온보딩 draft/finalize와 부정 피드백 단계를 보존합니다.

## 현재 소스

- `src/features/onboarding/onboarding-flow.tsx`
- `anchor-cover-card.tsx`
- `negative-work-card.tsx`
- `selected-tray.tsx`
- `work-search-input.tsx`
- `work-shelf.tsx`
- `src/domain/profile/onboarding.ts`

## 데이터 계약

- min/max selection은 domain constant를 사용하고 이미지의 `5/10`을 hardcode하지 않음
- Catalog-backed work만 anchor로 사용
- onboarding draft는 현재 persistence API를 유지
- favorite/positive/negative reason 의미론을 변경하지 않음
- finalize는 기존 conflict/complete 처리 유지

## 화면 구조

```text
OnboardingFlow
  StepProgress
  IntroAndBenefits
  SelectedSummary
  WorkSearchInput
  GenreChips
  PopularOrFeaturedShelf
  CuratedCollectionGrid
  SelectionGuidance
  SelectedTray
  Footer
```

## 구현 단계

1. 현재 step state machine과 persistence test를 먼저 고정
2. positive anchor 단계의 layout을 확정 이미지처럼 재구성
3. WorkShelf를 공통 MediaShelf 기반으로 교체하되 roving tabindex 유지
4. GenreChips는 Catalog의 기존 genre/tag 필터만 사용
5. collection card는 결정론적 filter preset으로 구성
6. SelectedTray:
   - desktop: selected summary panel 또는 sticky inline tray
   - mobile: bottom sheet/tray
   - empty일 때 한 줄 상태로 축소
7. 기존 favorite/negative 단계도 같은 visual system으로 리스타일
8. finalize 성공 후 `/taste` 이동 유지

## Interaction

- poster click: select/unselect
- favorite는 별도 control과 `aria-pressed`
- ArrowLeft/Right: shelf card focus 이동
- selection limit 초과: 기존 warning + motion; reduced motion에서는 border/status만
- Search clear와 no-result 상태 제공

## 이미지에서 제거/교정

- profile avatar 제거
- 외부 추천 정확도 수치 제거
- 모든 단계가 한 화면에 끝나는 것처럼 만들지 않음
- bottom navigation 없음(immersive route)

## 테스트

- draft 복원
- min/max 경계
- 중복 선택 없음
- favorite와 selected state 독립
- keyboard-only로 모든 단계 완료
- limit warning reduced-motion
- storage degraded 상태
- 390×844 selected tray가 CTA/콘텐츠를 가리지 않음

## 수용 기준

- 현재 선택 수와 완료 조건을 항상 파악 가능
- search/genre/shelf 중 어느 경로로도 작품 선택 가능
- 기존 onboarding commit payload가 byte-equivalent
