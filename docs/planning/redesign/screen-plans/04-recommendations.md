# 04 — 맞춤 추천 (`/recommendations`)

## 목표

확정 이미지의 criteria summary, filter bar, 고정 cover-forward 추천 card, Quick Preview, 이유별 Shelf, hidden-gem/completed Shelf, personalized Top 10, 피드백 반영 summary를 구현합니다. 추천 계산과 순위는 절대 변경하지 않습니다.

## 현재 소스

- `src/features/recommendations/recommendations-flow.tsx`
- `recommendation-card.tsx`
- `recommendation-motion-list.tsx`
- `feedback-dialog.tsx`
- `recommendation-cover-resolver.ts`
- recommendation/explanation domain modules

## 데이터 계약

- base order는 기존 RecommendationPlan 순서
- Top 10은 그 순서의 첫 10개
- Shelf grouping은 presentation-only selector
- description은 실제 `contributions[]`와 existing explanation generator
- policies는 현재 4개 boolean만 사용
- genre/status filter는 표시 필터일 뿐 ranking 재계산 규칙을 새로 만들지 않음
- match percentage 금지

## 화면 구조

```text
RecommendationsFlow
  RecommendationCriteriaSummary
  RecommendationFilterBar
  FeaturedRecommendationShelf
    RecommendationCard
  QuickPreviewDialog/Sheet
  AnchorReasonShelf
  DiscoveryShelf
  CompletedShelf
  RankingShelf
  FeedbackImpactSummary (completed+hidden > 0일 때만 image banner)
  SiteFooter
```

## Shelf grouping 규칙

- Featured: plan order 상위 항목
- Anchor reason: lead contribution의 anchor work 기준
- Discovery: engine이 이미 준 plan 중 discovery 성격의 항목을 presentation selector로 추출
- Completed: candidate work.status가 completed인 항목
- Top 10: plan[0:10]
- main shelves 사이에는 work ID dedupe; Top 10은 요약이므로 중복 허용

Grouping을 위해 ranking score를 다시 계산하거나 새 가중치를 만들지 않습니다.

## Featured card

- desktop fine pointer와 keyboard focus에서도 344×448px article geometry와 형제 위치 고정
- desktop은 card 3장 이상+다음 card 일부, mobile 390×844는 272×356px 활성 1장+다음 card peek. 모든 주요 geometry는 4px grid
- 정상: 2줄 title slot, 상태·권수·정성 confidence, 원본 비율 표지, contribution lead reason 1줄. 같은 400px 표지를 `aria-hidden`·lazy backdrop으로 재사용하고 작은 local blur와 72% semantic dark scrim을 덮되 runtime palette 추출은 하지 않음. card/캐러셀 shadow 없음, 전경 표지에만 4px radius+`0 8px 24px / 50%` local shadow
- hover/focus: 400ms 동안 표지가 약 71% 높이로 줄고 reason 최대 3줄+44px action rail이 열린다. coarse pointer는 최종 정보/action을 상시 표시하고 reduced-motion은 즉시 전환
- 표지 identity `Link`는 항상 작품 상세. Quick Preview는 별도 44px icon-only quiet control(접근 이름 `「{title}」をクイック表示`). `読みたい`·`読んだ`·`興味なし`도 같은 rail. Top 10에는 없음
- Featured Shelf는 inert/aria-hidden 양쪽 clone을 둔 3-copy pointer/touch loop이고 키보드는 canonical 카드 끝에서 비순환. 나머지 추천 Shelf는 유한 snap. desktop h1 「あなたへのおすすめ」는 28px 한 줄

## Quick Preview

- opener: aria-hidden `ScanSearchIcon`만 보이고 접근 이름은 `「{title}」をクイック表示`. identity `Link` 밖 action rail에 노출
- cover, title, lead reasons, caution, qualitative confidence
- planned/completed/hidden action
- completed/hidden 후속 reason은 기존 FeedbackDialog 재사용
- 상세 링크
- focus trap 및 opener 복원
- Top 10 ranking card에는 opener를 두지 않음

## 구현 단계

1. 현재 plan work IDs/order regression test 추가
2. 공통 MediaShelf/고정 RecommendationCard 적용
3. Quick Preview 연결
4. Top 10 `<ol>` 구현
5. presentation selector로 이유별 Shelf 구성
6. policy/filter panel을 상단 summary로 압축
7. removal/backfill animation을 기존 motion flow와 연결
8. full-page footer 및 empty/error state 정리

## 이미지에서 제거/교정

- 97% match → qualitative confidence
- AI가 쓴 자유 문장 → contribution template
- 알림/avatar 없음
- 존재하지 않는 notification/report control 없음

## 테스트

- 동일 fixture에서 work ID/order 불변
- 10개 미만 ranking
- hover/focus에서 article geometry 고정, 표지 축소→reason/action 확장, focus-visible 유지
- card·Shelf overflow와 viewport 폭 검증
- card 제거 중 focus 보존 및 backfill
- dialog/sheet 반복 open/close
- completed/hidden feedback flow와 피드백 image banner 표시/숨김
- provider cover failure
- reduced motion

## 수용 기준

- 한 viewport에서 여러 작품과 각 lead reason을 별도 확장 없이 확인 가능
- 상세 이동 없이 주요 reading action 수행 가능
- recommendation engine output은 변경 전과 동일
