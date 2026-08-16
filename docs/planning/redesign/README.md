# konocomics 최종 리디자인 AI 에이전트 핸드오프 v2

이 번들은 사용자가 확정한 7개 풀페이지 이미지와, 현재 `fromiron/konocomics` 소스 계약을 보존하는 구현 계획을 묶은 것입니다.

## 기준

- Repository: `fromiron/konocomics`
- Baseline: `main@87ba09e733901e16279e758d2f437dd51476d663`
- Theme: dark-only
- Primary: `oklch(0.7525 0.1382 236.09)` / `#43BBFA`
- Desktop: 상단 GNB만 표시
- Mobile: 하단 navigation만 표시
- 로그인·계정·아바타 UI 없음

## 먼저 읽을 파일

1. `IMPLEMENTATION_PLAN.md`
2. `AGENT_TASKS.json`
3. 작업 대상 `screen-plans/*.md`
4. 대응하는 `visual-targets/*.png`

## 화면

| ID | Route | Visual | Plan |
|---|---|---|---|
| 01 | `/` | `visual-targets/01-home.png` | `screen-plans/01-home.md` |
| 02 | `/onboarding` | `visual-targets/02-onboarding.png` | `screen-plans/02-onboarding.md` |
| 03 | `/taste` | `visual-targets/03-manga-dna.png` | `screen-plans/03-manga-dna.md` |
| 04 | `/recommendations` | `visual-targets/04-recommendations.png` | `screen-plans/04-recommendations.md` |
| 05 | `/works/[workId]` 및 `/works/external` | `visual-targets/05-work-detail.png` | `screen-plans/05-work-detail.md` |
| 06 | `/library` | `visual-targets/06-library.png` | `screen-plans/06-library.md` |
| 07 | `/settings` | `visual-targets/07-settings.png` | `screen-plans/07-settings.md` |

## 중요

생성 이미지의 한국어 문구, 가상 표지, 매치 퍼센트, 사용자 리뷰, 알림, 계정 UI는 제품 계약이 아닙니다. 구현에서는 저장소의 일본어 문자열, 실제 Catalog/Rakuten 표지, 정성 confidence, 기존 local-first 데이터만 사용합니다.
