# 01 — Home / Top (`/`)

## 목표

확정 Home 이미지의 시네마틱 Hero, 추천 예시 Shelf, Top 10형 랭킹, 발견 Shelf, 서비스 설명, footer를 구현합니다. 현재 profile 보유 사용자의 `/recommendations` redirect 계약은 유지합니다.

## 현재 소스

- `src/app/page.tsx`
- `src/features/landing/landing-flow.tsx`
- `src/features/landing/landing-logo-reveal.tsx`
- `src/components/cover/CoverImage.tsx`
- `src/lib/strings.ts`

현재 LandingFlow는 profile guard, hero, 3단계 소개, footer를 이미 제공합니다. 이 guard를 제거하거나 recommendation engine으로 대체하지 않습니다.

## 데이터 계약

- profile 없음: build-time Catalog 기반 showcase만 표시
- profile 있음 + `?landing=1` 없음: 기존처럼 `/recommendations`로 redirect
- showcase는 개인화라고 주장하지 않음
- popularity analytics가 없으므로 「今週の人気」 같은 검증 불가 문구를 사용하지 않음
- Top 10은 `src/data/landing-showcase.ts`의 명시적 Catalog ID 순서를 editorial 추천 순위로 사용하며, market popularity나 개인화 순위라고 주장하지 않음
- editorial Top 10 ID는 정확히 10개·중복 없음·Catalog 존재·`onboardingEligible`을 test로 검증
- 실제 표지는 기존 Catalog/Rakuten resolver와 placeholder를 사용

## 제안 컴포넌트

```text
LandingFlow
  HomeHero
    HeroBackdrop
    HeroCopy
    PrimaryCTA
    PrivacyBenefits
  HomeShowcaseShelf
  HomeRankingShelf
  HomeDiscoveryShelf
  HomeHowItWorks
  SiteFooter
```

신규 후보:

- `src/features/landing/home-hero.tsx`
- `src/features/landing/home-showcase.tsx`
- `src/features/landing/landing-showcase-data.ts`

## 구현 단계

1. `LandingGuard`와 redirect test를 고정
2. hero copy/CTA를 dark layout으로 재배치
3. CoverFan을 `HeroBackdrop + poster mosaic`로 교체
4. showcase Shelf를 공통 `MediaShelf`로 구현
5. Top 10 시각 구조와 crown을 유지하되 label은 첫 방문자를 위한 editorial 추천임을 명시. crown accessory는 1위를 기본 spotlight로 두고, 다른 card의 fine-pointer hover 또는 keyboard focus 동안 해당 순위로 이동하며 이탈하면 1위로 복귀
6. 서비스 설명 4개 card를 기존 제품 핵심에 맞게 재작성
7. SiteFooter 적용
8. mobile에서는 compact hero + 2.4장 노출 Shelf, bottom navigation 없음

## 이미지에서 제거/교정

- 로그인/아바타/알림 제거
- 매치 퍼센트 → 정성 label 또는 미표시
- 가상 horizontal hero art → 실제 세로 표지 기반 backdrop/mosaic
- community/social dead links 제거

## 접근성

- H1은 한 개
- CTA의 accessible name 명확화
- decorative mosaic는 `aria-hidden`
- Shelf section마다 H2와 accessible label
- ranking은 `<ol>`
- scroll control은 overflow가 있을 때만 표시

## 테스트

- profile 없음: landing 표시
- profile 있음: `/recommendations` redirect
- `?landing=1`: profile이 있어도 소개 표시
- showcase ID 누락 시 build/test failure
- cover failure fallback
- desktop GNB만, mobile immersive header만
- 320px에서 hero CTA와 shelf overflow 정상

## 수용 기준

- 첫 viewport에서 가치 제안, CTA, 실제 표지 기반 hero가 보임
- editorial 추천과 개인화 추천, market popularity를 서로 오인시키지 않음
- showcase 확장과 editorial crown 이동은 각각 hover/focus의 유일한 spatial state이며, 해당 카드에 generic 상단 lift를 추가하지 않음
- footer까지 full-page layout이 확정 이미지의 밀도와 일치
