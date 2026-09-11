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
- 추천 변화 preview는 같은 최신 Catalog·기록·정책에 방문 시 처음 읽은 보정과 현재 보정을 각각 적용한 동일 engine의 선두 최대 4개 ID·순서를 비교한다. 표시는 제목·표지·범위를 명시한 상태이며 ID를 사용자에게 노출하지 않는다. 같으면 현재 목록 하나, 달라지면 두 목록, 양쪽 0개는 빈 안내 한 번, 한쪽 0개는 비교 유지, 계산 불가는 별도 안내다. 현재 목록의 컴포넌트 위치·작품 key와 조작 focus를 유지한다
- feedback history가 별도 event log가 아니므로 `UserWorkRecord.updatedAt`과 reasons로 최근 변경을 구성

## 제안 컴포넌트

```text
TasteFlow
  DnaHeader
  DnaTopFactors
  DnaRadarChart
  EvidenceWorkShelf
  ConfidenceCoachBanner (general-entry normal only; /onboarding)
  AdjustmentEditor
    AdjustmentCategorySummary × 5
    AdjustmentCategoryDetails × 1 open
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
2. top factors와 qualitative confidence를 hero 영역으로 이동한다. mobile `<768` 상위 취향은 3열·가로 snap이 아니라 순위 1열 행(레이블 14px 최대 2줄, 강도 16px nowrap, 근거 제목 1–2줄)이고, `>=768`만 기존 3열 카드와 28px 강도를 유지한다. Reveal A는 행 단위다.
3. radar component 구현 + accessible text alternative
4. representative anchor works를 MediaShelf로 표시
5. workspace를 「おすすめを調整」로 명명하고 분석값은 불변이며 설정만 추천에 반영된다는 설명을 제공한다. 5개 범주의 compact summary row를 먼저 표시하고 명시적인 「詳細設定」 disclosure로 한 범주의 상세만 연다. 장르는 분석 전용 desktop 2열/mobile 1열 meter grid를 사용하고 adjustment control을 추가하지 않는다. 나머지 네 범주의 desktop 상세은 `分析した好み` / `おすすめへの反映` 열과 divider로 분석/설정을 분리하고, mobile은 각 FactorBar 아래 visible 반영 label을 둔다. 기존 5단 radiogroup은 반복 segmented box 대신 unboxed marker + label 행으로 표시한다. `除外`는 구분선 뒤에 두고 선택될 때만 warning token을 사용한다.
6. adjustment 변경 시 preview를 기존 memoized local 계산으로 갱신한다. 별도 debounce·추천 목록 영속화는 추가하지 않는다. 기준은 보정 설정만 동결하며 새로고침 후 현재 저장값이 새 기준이다
7. persistence는 현재 save API 유지; network 요청 없음
8. recent feedback는 지원되는 records만 표시하고 empty state 제공

## 이미지에서 제거/교정

- 숫자형 percentile/analysis score 제거
- 존재하지 않는 자동학습 on/off 설정 추가 금지
- 가상 insight 문구를 생성하지 않고 existing lexicon/template 사용
- 추천 preview는 설명 가능한 실제 result만 표시
- confidence coaching banner는 일반 진입의 기존 정성 level normal에서만 근거 Shelf 뒤에 두고 `/onboarding`으로 연결한다. 최초 reveal과 high에서는 숨기고 최근 feedback의 동일 목적 링크를 중복하지 않는다. 현재 profile guard에서 low는 도달 불가능하므로 별도 UI state를 만들지 않는다

## 테스트

- no profile → route guard
- all-auto / partial adjustment / exclude states
- initial all-collapsed / query-selected group / one-open-at-a-time disclosure
- analysis-only genre desktop 2-column/mobile 1-column meter grid / zero radiogroup
- editable group unboxed five-choice radiogroup / selected marker + text weight / selected-only exclude warning
- immutable FactorBar before/after adjustment / no meter success highlight / specific save live message
- desktop analysis/adjustment column labels and divider / mobile per-row adjustment label
- disclosure accessible name / `aria-expanded` / `aria-controls` / keyboard activation
- unknown/notApplicable factor
- preview before/after deterministic
- chart keyboard/reader 대체 정보
- adjustment persistence failure
- 200% zoom에서 control reflow

## 수용 기준

- 10초 내 핵심 취향과 근거 작품을 파악 가능
- 모든 adjustment state에 keyboard 접근 가능
- 변경 후 추천 영향이 실제 engine result와 일치
