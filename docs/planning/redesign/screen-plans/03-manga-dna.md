# 03 — Manga DNA (`/taste`)

## 목표

확정 이미지의 상위 취향, radar summary, 근거 작품, 조정 panel, 추천 변화 preview, 최근 피드백을 구현하되 현재 factor dictionary와 5단계 AdjustmentPreference를 그대로 유지합니다.

## 현재 소스

- `src/features/taste/taste-flow.tsx`
- `factor-bar.tsx`
- `adjustment-radiogroup.tsx`
- `src/domain/profile/dna-summary.ts`
- `src/domain/profile/confidence.ts`
- `src/domain/profile/types.ts`

## 데이터 계약

- axis/theme 값은 현재 deterministic profile에서만 취득
- `veryLike | like | auto | less | exclude`를 축소하지 않음
- 분석 신뢰도는 기존 정성 label 사용
- 이미지의 92% 같은 수치는 표시하지 않음
- 추천 변화 preview는 같은 recommendation engine을 local에서 재실행해 work ID 변화만 표시
- feedback history가 별도 event log가 아니므로 `UserWorkRecord.updatedAt`과 reasons로 최근 변경을 구성

## 제안 컴포넌트

```text
TasteFlow
  DnaHeader
  DnaTopFactors
  DnaRadarChart
  EvidenceWorkShelf
  AdjustmentEditor
  RecommendationDiffPreview
  RecentFeedbackSummary
  SiteFooter
```

신규 후보:

- `dna-radar-chart.tsx`
- `dna-top-factor-card.tsx`
- `dna-evidence-shelf.tsx`
- `recommendation-diff-preview.tsx`

## Radar chart

- 새 chart dependency 금지
- inline SVG 또는 CSS polygon으로 구현 가능
- 시각 chart 아래/옆에 동일 데이터를 list/table로 제공
- axis 수치 자체보다 기존 level label을 기본 노출
- animation은 최초 reveal 1회, reduced motion에서는 즉시 표시

## 구현 단계

1. 기존 DNA summary output snapshot test 고정
2. top factors와 qualitative confidence를 hero 영역으로 이동
3. radar component 구현 + accessible text alternative
4. representative anchor works를 MediaShelf로 표시
5. 기존 adjustment radio group를 dark segmented control로 리스타일
6. adjustment 변경 시 preview를 memoized/debounced local 계산
7. persistence는 현재 save API 유지; network 요청 없음
8. recent feedback는 지원되는 records만 표시하고 empty state 제공

## 이미지에서 제거/교정

- 숫자형 percentile/analysis score 제거
- 존재하지 않는 자동학습 on/off 설정 추가 금지
- 가상 insight 문구를 생성하지 않고 existing lexicon/template 사용
- 추천 preview는 설명 가능한 실제 result만 표시

## 테스트

- no profile → route guard
- all-auto / partial adjustment / exclude states
- unknown/notApplicable factor
- preview before/after deterministic
- chart keyboard/reader 대체 정보
- adjustment persistence failure
- 200% zoom에서 control reflow

## 수용 기준

- 10초 내 핵심 취향과 근거 작품을 파악 가능
- 모든 adjustment state에 keyboard 접근 가능
- 변경 후 추천 영향이 실제 engine result와 일치
