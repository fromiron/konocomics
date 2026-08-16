# 04 — 맞춤 추천 (`/recommendations`)

## 목표

확정 이미지의 criteria summary, filter bar, 확장형 추천 card, Quick Preview, 이유별 Shelf, hidden-gem/completed Shelf, personalized Top 10, 피드백 반영 summary를 구현합니다. 추천 계산과 순위는 절대 변경하지 않습니다.

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
    ExpandableRecommendationCard
  QuickPreviewDialog/Sheet
  AnchorReasonShelf
  DiscoveryShelf
  CompletedShelf
  RankingShelf
  FeedbackImpactSummary
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

## Expandable card

- desktop fine pointer: 200ms hover intent
- keyboard focus: 즉시 확장
- 기본 128–160px, 확장 300–360px
- Shelf 높이 사전 예약
- title/reason/action control은 scale하지 않고 reflow
- touch: 고정 card + Quick Preview sheet

## Quick Preview

- cover, title, lead reasons, caution, qualitative confidence
- planned/reading/completed/hidden action
- completed/hidden 후속 reason은 기존 FeedbackDialog 재사용
- 상세 링크
- focus trap 및 opener 복원

## 구현 단계

1. 현재 plan work IDs/order regression test 추가
2. 공통 MediaShelf/ExpandableCard 적용
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
- hover/focus expansion과 collapse
- active card viewport 보정
- card 제거 중 focus 보존 및 backfill
- dialog/sheet 반복 open/close
- completed/hidden feedback flow
- provider cover failure
- reduced motion

## 수용 기준

- 한 viewport에서 여러 작품을 탐색하면서 확장 card로 이유 확인 가능
- 상세 이동 없이 주요 reading action 수행 가능
- recommendation engine output은 변경 전과 동일
