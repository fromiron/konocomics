# 07 — 수용 테스트 계획 (Acceptance Test Plan)

> 최소 신뢰 가능한 검증 전략. 매트릭스 완결성이 아니라 실제 계약 보호가 목적이다.
> 자동화 계층: 유닛(Vitest) / 컴포넌트(Testing Library) / E2E(Playwright) / 정적 검사 / 수동 QA.

---

## 1. 정적 검사 (CI 매 커밋)

- `tsc --noEmit` (strict) / ESLint (domain 계층 격리 규칙 포함: domain이 react·dexie·next를 import하면 실패) / Prettier check.
- **`catalog:validate`를 CI 게이트로:** 검증 실패 데이터는 빌드 자체가 실패한다. 검사 항목 — ID·ISBN 중복, 팩터 범위·상태 오류, centrality 범위, eligibility 충돌, 추천 대상 coverage 미달, evidence 누락, 대표 volume 누락.

## 2. 추천 엔진 유닛 테스트 (가장 두터운 계층)

계약 목록 (각각 독립 픽스처):

1. 읽음(completed)·하차·숨김·興味なし 작품이 후보에서 제외된다.
2. Hard Exclusion(除外 축·테마, 미완결 제외 정책)이 점수 계산 전에 적용된다.
3. Coverage 미달 그룹만 0.5로 수축하고, **가중치가 다른 그룹으로 재분배되지 않는다** (Art 전부 unknown인 후보의 Genre 기여가 변하지 않음을 명시 검증).
4. notApplicable이 기대 분모에서 제외되고 unknown은 포함된다.
5. presence-sensitive 축(darkness/mentalStress/romance)의 0↔양수 거리 ×1.5.
6. 소수 취향 보존: 8개 anchor 중 1개만 이질적인 프로필에서, 그 anchor와 유사한 후보가 Top 10에 생존한다.
7. Consensus Bonus 상한 +0.05. 동일 성향 anchor를 8개로 늘려도 점수가 폭발하지 않는다.
8. 부정 사유 12종 각각: 감점 조건을 만족하는 후보만 감점되고, unknown 팩터 후보는 감점되지 않는다. 합계 cap 0.25.
9. 외부적 하차 사유(`external:*`)는 어떤 감점도 만들지 않는다.
10. vagueDislike는 `maxSim × 0.08`이며 이유 있는 불호와 중복 적용되지 않는다.
11. explicitAdjustment: 축값 4/2/0에서 +s/0/−s, 총합 ±0.12 clamp, unknown 축 0.
12. market tie-break: tasteScore 차 0.025 경계의 양쪽 동작. 정책 미선택 시 maturity가 순위를 뒤집지 않는다.
13. 리스트 제약: 동일 best Anchor ≤4, 동일 Theme 조합 ≤3, 동일 시리즈 ≤1, Discovery는 top−0.10 이내.
14. **결정론:** 동일 입력 2회 호출 → 완전 동일 출력(순서 포함).
15. **설명-기여 일치:** 생성된 모든 이유 문장의 소스 팩터가 contributions 상위 항목에 존재한다. Cluster당 1개 초과 금지. 주의점은 음의 기여에서만.
16. confidence: 산식 값과 3단 레이블 경계(0.5 / 0.75).
17. 20작품 골든 스냅샷: 산식 수치 변경 시 순위 변화가 리뷰에 드러난다.

## 3. Catalog·데이터 유닛 테스트

- zod 스키마 라운드트립(catalog JSON, Export v1, Rakuten 응답 축소형).
- 일본어 정규화 골든 케이스(NFKC·가나·전각/반각·권수 토큰 10례 이상).
- Export→Import 라운드트립: 임의 상태 생성 → export → import → Dexie 상태 동등.
- Import 거부: schemaVersion 2 / 필드 손상 / 부분 손상 배열 — 모두 기존 데이터 불변.
- providerCache TTL: 만료 판정(시간 주입) 경계.
- Route Handler: 쿼리 검증 400, 필드 축소, `_ex` 재작성, 타임아웃→502.

## 4. E2E (Playwright — 5 시나리오 고정, 확장 금지)

Chromium + 모바일 뷰포트(390×844) 프로젝트 2개로 실행. 라쿠텐은 라우트 모킹.

1. **핵심 여정:** 온보딩(검색 포함 8작품, 1 favorite) → 불호 1개+이유 → DNA reveal → 추천 10개 표시, 1위 카드의 이유 문장이 카드 data-attribute의 contribution 요약과 일치.
2. **피드백 루프:** 추천 1위를 読んだ 처리 → 카드 제거·백필 → 재계산 후에도 해당 작품 미등장.
3. **영속성:** 기록 생성 → 컨텍스트 재시작 → Library·DNA 유지.
4. **Provider 장애:** `/api/rakuten/*` 전부 502 모킹 → placeholder 표지로 온보딩·추천·상세 성립, 구매 버튼 폴백.
5. **데이터 주권:** Export → 전체 삭제(랜딩 복귀 확인) → Import → 추천·Library 원상 복구.

E2E 내 접근성 스모크: 시나리오 1을 키보드만으로 완주(탭 순서·Enter/Space 선택) + 각 페이지 `axe-core` 주입 검사(critical 위반 0).

## 5. 수동 QA 체크리스트 (릴리스 게이트, 슬라이스 11~12에서 전체 실행)

### 모바일 실기기 (iOS Safari + Android Chrome 각 1대)

- [ ] 온보딩 Shelf 스와이프·스크롤 스냅 자연스러움, 터치 타깃 44px 실측.
- [ ] 하단 탭 바가 키보드(가상)·세이프 에어리어와 충돌하지 않음.
- [ ] 홈 화면 설치 → standalone 실행 → 오프라인에서 DNA·Library·기존 추천 열람.
- [ ] 작품 상세 블러 배경의 스크롤 성능(프레임 드랍 육안 확인).

### 키보드·스크린리더 (데스크톱)

- [ ] 전 화면 focus-visible 링 표시, 시트·다이얼로그 포커스 트랩과 복귀.
- [ ] FactorBar가 VoiceOver/NVDA에서 「戦略的な展開: 強い好み」 형태로 읽힘. 미확인 축은 「まだ分析中」.
- [ ] 추천 카드 제거 시 aria-live 어나운스와 포커스 이동.

### reduced-motion

- [ ] OS 설정 활성 후: 로고 reveal·DNA reveal·카드 layout 애니메이션이 무모션으로 즉시 완료되고 정보 손실이 없다.
- [ ] Shelf 버튼 스크롤이 instant로 동작.

### 비주얼 충실도 (04 문서 대조)

- [ ] 토큰 값·radius(카드 8/표지 4)·accent 사용처 제한 준수.
- [ ] 표지가 어떤 화면에서도 크롭되지 않음(세로/가로 특이 비율 표지 3종으로 확인).
- [ ] placeholder 표지·빈 상태·오류 상태를 화면별로 강제 재현해 확인(라쿠텐 차단 + 데이터 비움).
- [ ] 스크린톤이 지정 표면(랜딩 hero·빈 상태·DNA 요약)에만 존재.
- [ ] 다크 모드(슬라이스 12 이후): 대비 재측정, 블러 배경 위 텍스트 4.5:1.

### 성능 (수동 측정, 예산은 04 §8)

- [ ] Lighthouse(모바일 스로틀): LCP < 2.5s, CLS < 0.05, PWA 설치 가능.
- [ ] 추천 페이지 초기 JS < 250KB gzip (`next build` 출력 확인).
- [ ] 중급 안드로이드(또는 CPU 4× 스로틀)에서 DNA reveal·카드 제거 60fps 근접.

## 6. 명시적으로 하지 않는 것

- 크로스 브라우저 전수 매트릭스(Firefox는 스모크 수동 1회만), 시각 회귀 스냅샷 인프라, 부하 테스트, 엔진 property-based testing(골든+계약 테스트로 충분), 하니스(`harness/`)의 자동 테스트.
