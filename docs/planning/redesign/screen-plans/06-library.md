# 06 — 라이브러리 (`/library`)

## 목표

확정 이미지의 상태별 count, 최근 활동, 읽는 중 progress, 읽고 싶은 작품, favorites, 관리 도구를 현재 UserWorkRecord 범위 안에서 구현합니다.

## 현재 소스

- `src/features/library/library-flow.tsx`
- `library-view.tsx`
- `record-editor.tsx`
- `modal-surface.tsx`
- `work-search-sheet.tsx`
- `search.ts`
- `UserWorkRecord`

## 데이터 계약

지원됨:

- readingState 5종
- reaction
- volume/chapter progress
- updatedAt
- Catalog/external work

지원되지 않음:

- 자유 메모
- 페이지/시간 통계
- cloud sync
- reader session history

따라서 이미지의 memo와 읽은 시간 통계는 추가하지 않습니다.

## 화면 구조

```text
LibraryFlow
  LibraryHeader
  LibraryToolbar (mobile wrapping tablist with counts; desktop count matrix + label tabs)
  RecentUpdatedShelf
  ReadingShelf
  PlannedShelf
  CompletedShelf
  FavoriteShelf
  RecentActivityPanel
  LibraryDataBanner (populated only; /settings?section=data)
  ModalSurface
    LibraryRecordEditor / WorkSearchSheet
  SiteFooter
```

## 상태 count

- rows를 readingState별로 group하여 계산
- 전체 수는 Catalog + external record의 union
- mobile `<768`은 별도 6칸 matrix를 두지 않고 `すべて`+5 readingState wrapping tablist에 count를 붙인다. `role="tablist"` / `?state=`는 유지하고 favorite는 탭이 아니라 Shelf다.
- desktop은 읽기 전용 6칸 matrix를 유지하고 탭에는 count를 반복하지 않는다
- 통계는 count와 progress 존재 여부까지만
- `updatedAt`으로 recent activity 구성

## 카드

- reading: progress bar와 `이어 관리` action
- planned: compact poster card
- completed/hidden/dropped: 상태 badge
- favorite: `reaction === favorite`
- click/tap: 기존 LibraryRecordEditor modal 또는 Quick Preview surface

## 구현 단계

1. current union/sort/state filtering tests 고정
2. mobile에서 잘리는 상태 탭을 wrapping tablist(건수 포함)로 합치고, desktop count matrix는 유지한다
3. tab/filter는 전체 Shelf의 표시 필터로 유지
4. progress component 추가
5. recent activity는 updatedAt 기반으로 구성
6. favorite shelf 추가
7. add/search/editor modal 재사용
8. export/import는 Settings 링크로 연결하고 중복 구현하지 않음. populated 화면의 tools 카드는 data-portability half-shell banner로 대체한다
9. sparse/empty/degraded UI 구현

## 이미지에서 제거/교정

- memo editor 제거
- reading time/page count 제거
- cloud sync 제거
- Premium/계정 UI 제거
- notification dot 제거

## 접근성

- state tabs는 기존 tablist keyboard 계약 유지
- grouped Shelf마다 heading
- progress는 `aria-valuetext`로 volume/chapter 전달
- modal focus trap/opener restore 유지
- updated state는 live region으로 알림

## 테스트

- Catalog + external union
- catalog-missing row
- each reading state empty/non-empty
- progress volume only/chapter only/both/none
- favorite/no reaction
- sort by updatedAt
- add work and duplicate result
- editor save failure
- storage degraded
- mobile bottom nav만 표시

## 수용 기준

- 상태 count와 최근 활동이 실제 records에서만 계산
- 빈 Library도 다음 행동을 명확히 안내
- schema 확장 없이 확정 이미지의 관리 밀도를 구현
