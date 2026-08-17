# 05 — 작품 상세 (`/works/[workId]`, `/works/external`)

## 목표

확정 이미지의 cinematic detail hero, 상태 action, 추천 이유 card, metadata, 관련 Shelf를 구현합니다. Catalog와 external work의 identity 및 provider failure 계약을 보존합니다.

## 현재 소스

- `src/features/work-detail/work-detail-flow.tsx`
- `external-work-detail-flow.tsx`
- `src/components/cover/CoverImage.tsx`
- `scoreWorkCompatibility`, `generateTasteExplanation`
- Rakuten provider cache/client

## 화면 구조

```text
WorkDetailShell
  DetailHero
    CoverImage foreground
    HeroBackdrop
    IdentityAndMetadata
    ReadingStateActions
  CompatibilityReasons
  WorkMetadata
  ProviderPurchasePanel
  RelatedWorkShelf
  SameMoodShelf
  ReaderAlsoViewed replacement/optional catalog shelf
  ProviderRatingSummary (available only)
  SiteFooter
```

## 상태 action

현재 5개 ReadingState에 직접 매핑합니다.

- planned
- reading
- completed
- dropped
- hidden

이미지의 「첫 화부터 보기」는 구현하지 않습니다. 외부 행동은 기존 Rakuten purchase/view link만 사용합니다.

## Compatibility

- 기존 `scoreWorkCompatibility`와 explanation을 그대로 사용
- numeric match 대신 qualitative confidence
- positive reasons, caution, anchors 표시
- profile이 없으면 compatibility section 숨김

## 관련 Shelf

- core ranking을 변경하지 않음
- work-to-work selector가 필요하면 `src/features/work-detail/related-works.ts`에 pure deterministic helper로 구현
- same central themes/known axes를 이용하되 규칙과 tie-break를 unit test로 고정
- external work에는 Catalog factor가 없으므로 related personalization을 추측하지 않음

## Catalog/external 공유

- `WorkDetailShell` presentational component를 공유
- Catalog: compatibility, factors, related shelves 가능
- External: local record + Rakuten metadata + reading state 중심
- external local record missing/malformed UI 유지

## 이미지에서 제거/교정

- 사용자 리뷰 작성/댓글/아바타 제거
- 평균 별점은 Rakuten provider 값이 존재할 때 provider section에서만 표시
- generated horizontal key art는 사용하지 않음
- bookmark/account icon 제거
- match percentage 제거

## 구현 단계

1. current reading state/provider/compatibility tests 고정
2. Catalog/external 공통 shell 추출
3. mobile first viewport에 cover/title/action 동시 배치
4. desktop two-column + backdrop 적용
5. state select를 accessible direct buttons/segmented control로 표현
6. compatibility card 재배치
7. deterministic related shelves 추가
8. provider link와 app state action 시각 분리
9. footer 적용

## 테스트

- Catalog detail static route
- external query identity
- missing/malformed local external record
- profile 있음/없음
- provider loading/cache/stale/error/retry
- reading state transition, planned minimal record removal
- long title/creators
- cover fallback
- mobile CTA와 bottom nav 겹침 없음

## 수용 기준

- 모바일 첫 viewport에서 제목, 추천 이유 요약, 주요 상태 action 확인 가능
- Catalog/external의 기존 persistence/URL 계약 불변
- unsupported reader/community 기능 없음
