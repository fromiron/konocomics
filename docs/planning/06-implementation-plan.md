# 06 — 구현 계획 (Implementation Plan)

> 수직 슬라이스 단위. 각 슬라이스는 검증 가능한 동작을 만든다.
> **게이트 G1(sanity)·G2(블라인드 GO)는 사람·데이터 작업이며, 통과 전에 후속 UI 슬라이스를 시작하지 않는다.** 단, 디자인 토큰·화면 계약은 본 문서 세트로 이미 확정되어 있어 GO 직후 병목 없이 진행 가능하다.

## 단계 재편 (기존 Phase 0~6 → 5단계)

```text
Stage A  팩터 사전 + 엔진 + CLI          (슬라이스 0~3)
Stage B  50작품 sanity check             (게이트 G1 — 데이터·사람 작업)
Stage C  150작품 + 블라인드 테스트        (슬라이스 4, 게이트 G2 = GO/NO-GO)
Stage D  Web MVP                          (슬라이스 5~10)
Stage E  시그니처 폴리시 + PWA + 다크     (슬라이스 11~12)
```

기존 계획과의 차이: Spreadsheet 수식 검증 제거(엔진을 처음부터 TS로, `01` R12), 블라인드 하니스 신설, 7단계→5단계.

---

## 슬라이스 0 — 저장소 스캐폴드

- **목표:** 빌드·테스트·린트가 도는 빈 프로젝트.
- **내용:** `create-next-app`(TS, App Router, Tailwind v4) + Vitest + Playwright + ESLint(strict, `import/no-restricted-paths`로 domain 격리 규칙) + Prettier + shadcn/ui 초기화. `docs/factors/factor-dictionary.md`·`annotation-guide.md` 골격 생성(17 Axis의 0/2/4 기준은 원본 계획 §16 표를 이관).
- **완료 기준:** CI(GitHub Actions)에서 typecheck·lint·unit 통과. 버전은 lockfile 고정.
- **제외:** UI 페이지, 배포 설정.

## 슬라이스 1 — Catalog 스키마 + 빌드 파이프라인

- **목표:** CSV 주석 → 검증된 `catalog-v1.json`.
- **의존:** 슬라이스 0.
- **파일:** `domain/catalog/`(타입·zod·정규화), `scripts/normalize-works.ts`·`validate-catalog.ts`·`build-catalog.ts`·`report-coverage.ts`, `data/source/*.csv`(샘플 10작품 수동 작성).
- **구현 결정:** validator 검사 항목은 원본 §39 목록 전부(ID·ISBN 중복, 팩터 범위, 상태 오류, centrality, eligibility 충돌, coverage 미달, evidence 누락). `report-coverage`는 축 간 상관계수 표를 출력(진단용). 정규화 규칙: NFKC, 가나 통합, 전각/반각, 권수 토큰 제거(§원본 12).
- **테스트:** validator 규칙별 실패 픽스처, 정규화 골든 케이스(일본어 제목 10개).
- **완료 기준:** 샘플 10작품이 validate 통과 → JSON 생성. 오류 CSV가 정확한 행·이유로 거부됨.
- **제외:** `sync-rakuten.ts`(슬라이스 8과 병행 가능, 초기 표지 URL은 수동 입력 허용).

## 슬라이스 2 — 추천 엔진 코어

- **목표:** `02` §6 산식의 결정론적 구현 + 기여도 출력.
- **의존:** 슬라이스 1.
- **파일:** `domain/recommendation/`(similarity.ts, coverage.ts, anchor.ts, penalty.ts, adjustment.ts, rank.ts), `domain/profile/`(confidence.ts, dna-summary.ts).
- **구현 결정:** 모든 함수 순수. 반환 `RankedRecommendation = { workId, tasteScore, confidence, bestAnchorId, contributions: GroupContribution[], penaltiesApplied[] }`. tie-break·리스트 제약(§6.8) 포함. 정책 3종 반영.
- **테스트(핵심 계약):** 원본 §41 유닛 목록 전부 — 읽음/하차/숨김 제외, hard exclusion, coverage 수축, notApplicable 분모, 소수 취향 보존(2개 취향군 픽스처), consensus cap, 사유별 감점 조건(12사유 각각), vague penalty, 명시 보정 cap ±0.12, market tie-break 0.025 경계, 결정론(동일 입력 2회 호출 결과 동일).
- **완료 기준:** 전체 테스트 통과 + 20작품 픽스처 골든 스냅샷.

## 슬라이스 3 — Baseline + CLI 리포트

- **목표:** 사람이 읽을 수 있는 비교 리포트로 G1 수행 가능.
- **의존:** 슬라이스 2.
- **파일:** `domain/recommendation/baseline.ts`(장르 Jaccard + bayesianRating + maturity), `scripts/run-baseline-experiment.ts`, `domain/explanation/`(템플릿 문장 생성 — CLI에서도 사용).
- **구현 결정:** CLI 입력 = catalog JSON + 사용자 프로필 JSON(anchor·부정·보정), 출력 = 마크다운 리포트(양 엔진 Top 10, 각 항목의 이유 문장, 기여도 상위 5, coverage 경고).
- **완료 기준:** 3인 프로필 픽스처로 리포트 생성. 설명 문장이 contributions에서만 생성됨을 테스트로 강제.

## 게이트 G1 — Sanity Check (데이터·사람 작업)

50작품 주석(annotation-guide 준수, 15~20% 블라인드 재태깅 포함) → 본인+지인 2~3명 프로필로 CLI 리포트 검토. 통과 기준은 `02` §7-1. **실패 시 팩터 사전·산식 수치를 수정하고 반복(코드 슬라이스 진행 중단).**

## 슬라이스 4 — 블라인드 테스트 하니스 + 150작품

- **목표:** G2(GO/NO-GO) 실행 도구.
- **의존:** G1 통과.
- **파일:** `harness/`(로컬 전용 페이지 1~2개: 참가자 ID 입력 → 양 엔진 혼합·출처 은닉 리스트 → 설명 공개 전/후 2단 설문 → 결과 JSON 다운로드), `scripts/`에 지표 집계 스크립트(Unknown Want-to-Read, Explanation Agreement/Lift, Disliked Leakage@10, Holdout Recall@10, 사용자별 승패).
- **구현 결정:** 하니스는 스타일 최소(shadcn 기본). 배포하지 않고 로컬 실행. Holdout은 참가자 anchor 중 1~2개를 엔진 입력에서 자동 제외.
- **완료 기준:** 참가자 1명 파일럿 후 10명 실행 가능. 집계 스크립트가 GO 기준표를 출력.
- **제외:** 하니스의 시각 폴리시, 접근성 심화(내부 도구).

## 게이트 G2 — GO/NO-GO

`02` §7-3 기준. GO → 슬라이스 5 진행. REVISE → §7 진단표. 2회 수정 후에도 열세면 사용자와 방향 재논의.

## 슬라이스 5 — 앱 셸 + 토큰 + 온보딩

- **목표:** 신규 사용자가 anchor를 선택하고 저장까지.
- **의존:** G2.
- **파일:** `app/layout.tsx`(폰트·토큰·내비), `components/nav/`, `infrastructure/db/`(Dexie 스키마 v1 전체), `features/onboarding/`, `components/cover/CoverImage.tsx`(placeholder 포함), Fuse 검색 모듈.
- **구현 결정:** `03` §0·2·3 계약 전부. OnboardingDraft 저장·복원. IndexedDB 불가 감지 배너(`05` §9).
- **비주얼:** 토큰(`04` §2) 정확 반영, Shelf는 scroll-snap 계약(`04` §7), tray Motion layout.
- **테스트:** 검색 정규화 컴포넌트 테스트, draft 복원 유닛. E2E는 슬라이스 7에서 통합.
- **완료 기준:** `03` §2·3 수용 기준 전부. 키보드 전용 온보딩 완주.

## 슬라이스 6 — Manga DNA (/taste)

- **목표:** DNA reveal·상시 열람·인라인 보정.
- **의존:** 슬라이스 5.
- **파일:** `features/taste/`, `FactorBar`, 보정 칩(radiogroup), reveal 시퀀스(`04` §5.2).
- **구현 결정:** `03` §4 계약. 보정 → profile.adjustments 즉시 저장 → inputHash 변경.
- **완료 기준:** §4 수용 기준 전부 + reduced-motion 검증.

## 슬라이스 7 — 추천 + 설명 + 피드백

- **목표:** 핵심 효용의 완성. E2E #1·#2가 도는 상태.
- **의존:** 슬라이스 6.
- **파일:** `features/recommendations/`(inputHash 재계산·recommendationCache·백필 로직), `ReasonChips`, `StateActionRow`, 후속 시트(reaction·興味なし 이유), 정책 칩.
- **구현 결정:** `03` §5 계약 전부. 카드 data-attribute에 contribution 요약을 노출해 E2E가 설명-근거 일치를 검증.
- **완료 기준:** §5 수용 기준 전부. E2E #1(온보딩→DNA→추천), #2(読んだ→다음 추천 제외) 통과.

## 슬라이스 8 — Rakuten 프록시 + 작품 상세

- **목표:** 상세 페이지와 실이미지·구매 연결.
- **의존:** 슬라이스 7 (프록시 자체는 병행 가능).
- **파일:** `app/api/rakuten/search|item/route.ts`, `infrastructure/rakuten/`, `features/work-detail/`, `scripts/sync-rakuten.ts`(빌드용 표지·서지 동기화).
- **구현 결정:** `05` §4 계약(필드 축소, `_ex` 재작성, CDN 캐시, 5s 타임아웃, 실패 시 502 + 클라이언트 placeholder 폴백). providerCache TTL(가격·재고 24h/기타 72h). 블러 배경 시그니처(`04` §4.2).
- **테스트:** Route Handler 유닛(검증·필드 축소·재작성), 실패 폴백 E2E #4.
- **완료 기준:** `03` §6 수용 기준 전부. API 키 없는 로컬 환경에서도 placeholder로 전 화면 성립.

## 슬라이스 9 — Library + 외부 작품 추가

- **목표:** 기록 관리와 external entry.
- **의존:** 슬라이스 8 (라쿠텐 검색 재사용).
- **파일:** `features/library/`, `WorkSearchSheet`(로컬→라쿠텐 확장, ISBN 대조→external 생성).
- **완료 기준:** `03` §7 수용 기준 전부. E2E #3(재실행 후 Library 유지).

## 슬라이스 10 — 설정 + Export/Import + 랜딩

- **목표:** 데이터 주권 완결 + 공개 가능한 첫인상.
- **의존:** 슬라이스 9.
- **파일:** `features/settings/`(export/import/삭제, `05` §7 계약), `app/page.tsx` 랜딩(리다이렉트 로직, 정적 버전의 로고 — reveal 애니메이션은 슬라이스 11).
- **완료 기준:** `03` §8 수용 기준 전부. E2E #5(Export→삭제→Import 복원). Netlify 배포 성립(환경변수·CI 게이트에 catalog:validate 포함).

## 슬라이스 11 — 시그니처 모먼트 + 모션 총정리

- **목표:** `04`의 3개 시그니처와 모션 분류 체계 완성.
- **의존:** 슬라이스 10.
- **내용:** konomi 로고 reveal(§5.1 시퀀스·스킵·sessionStorage 가드), DNA reveal 타이밍 정밀화, 페이지 진입 B분류 일괄 적용, reduced-motion 전수 점검, 성능 예산(§8) 측정·조정.
- **완료 기준:** `03` §1 수용 기준 전부. reduced-motion에서 정보 손실 0. LCP·CLS 예산 충족.

## 슬라이스 12 — PWA + 다크 모드 + 최종 QA

- **목표:** 설치 가능·오프라인 셸·다크 테마.
- **의존:** 슬라이스 11.
- **내용:** manifest 완성 + Serwist 도입(`05` §8 캐시 전략), 다크 토큰 세트(시맨틱 변수에 값만 추가) + `next-themes`(system 기본 + settings 수동 3단), `07`의 수동 QA 체크리스트 전체 실행.
- **완료 기준:** 홈 화면 설치 → 오프라인에서 DNA·Library·기존 추천 열람 가능. 다크에서 대비 기준 재충족. Lighthouse PWA·a11y 통과.

---

## 임계 경로 주의

코드가 아니라 **주석 데이터가 임계 경로다.** G1(50작품)·G2(+100작품) 사이 사람 작업 기간에 슬라이스 4의 하니스 구현과 `sync-rakuten.ts`(슬라이스 8 일부)를 병행하면 대기 시간을 흡수할 수 있다. UI 슬라이스(5~)는 G2 전에 시작하지 않는다.
