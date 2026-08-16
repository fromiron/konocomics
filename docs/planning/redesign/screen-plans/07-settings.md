# 07 — 설정 (`/settings`)

## 목표

확정 이미지의 panel-based settings layout을 사용하되, 현재 RecommendationPolicies, ProfileAdjustments, local data 관리, import/export/reset만 구현합니다.

## 현재 소스

- `src/features/settings/settings-flow.tsx`
- `policy-settings.tsx`
- `data-settings.tsx`
- `settings-dialog.tsx`
- persistence export/import/reset API
- `src/domain/profile/types.ts`

## 지원되는 설정

RecommendationPolicies:

- `preferCompleted`
- `preferHidden`
- `preferVerified`
- `excludeIncomplete`

ProfileAdjustments:

- axes/theme의 5단계 preference

Data:

- export
- import
- clear/reset
- local-only/degraded status

## 구현하지 않는 설정

- 계정/이메일
- notification/weekly report
- dark/light theme selector(dark-only)
- cloud sync
- auto-learning on/off(현재 engine 의미론을 바꿈)
- age rating filter(현재 schema 근거 없음)
- arbitrary recommendation intensity slider(현재 policy와 대응하지 않음)

## 화면 구조

```text
SettingsFlow
  SettingsHero
  RecommendationPolicyPanel
  DnaAdjustmentSummary + /taste link
  LocalDataPrivacyPanel
  ExportImportPanel
  ResetPanel
  AppInfoPanel
  SiteFooter
```

## 구현 단계

1. current policy/data tests 고정
2. policy controls를 dark card/toggle로 리스타일
3. unsupported slider 대신 기존 boolean policy를 명시적으로 표현
4. DNA panel은 adjustments summary와 `/taste` 이동 제공
5. local-only status/degraded state 강조
6. export/import 충돌 mode와 schema error UI 보존
7. clear/reset을 danger zone으로 분리
8. app version/help는 실제 package/build 정보와 existing strings만 사용
9. footer 적용

## Destructive flow

- export를 먼저 제안
- confirmation dialog에서 삭제 범위 명시
- focus trap/opener restore
- 실행 중 중복 클릭 방지
- 성공 후 route/profile guard 상태를 정확히 갱신

## 이미지에서 제거/교정

- gear hero illustration은 CSS/icon 정도로 단순화; 별도 generated asset 불필요
- notification toggles 제거
- age/content rating control 제거
- account section 제거
- social/community dead links 제거

## 테스트

- each policy toggle persistence
- import valid/invalid/version mismatch/conflict mode
- export file content and name
- clear cancel/confirm/failure
- degraded storage
- no profile state
- keyboard dialog
- 320px action layout

## 수용 기준

- 모든 control이 현재 schema에 직접 대응
- 파괴적 action과 일반 설정이 명확히 분리
- 계정/notification/theme/cloud 같은 unsupported 설정이 없음
