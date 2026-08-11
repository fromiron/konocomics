# 01 — 결정 원장 (Decision Ledger)

> 초안 기획서(`konocomics-project-plan.md` v0.2, **감사 후 폐기됨**) 대비 변경분(delta) 기록.
> "기존 제안" 열은 폐기된 초안의 내용 요약이다. 상세 근거는 `00-plan-audit.md`, 최종 사양은 02~07 문서와 `docs/factors/factor-dictionary.md` 참조 — **구현은 항상 최종 문서를 따르고, 이 원장은 이력 참고용이다.**
> Verdict: KEEP / REFINE / REPLACE / MERGE / DEFER / REMOVE

## 제품

| # | 영역 | 기존 제안 | Verdict | 최종 결정 | 이유 |
|---|---|---|---|---|---|
| P1 | 제품 가설 A~E | 5개 가설 | **KEEP** | 그대로 | 제품 존재 이유. 변경 근거 없음 |
| P2 | 12개 제품 원칙 | 취향/인기 분리, unknown≠불호 등 원칙 목록 | **KEEP** | 그대로 (`02` §1) | 내부 모순 없음 |
| P3 | 온보딩 흐름 | 작품 선택 → 불호 → 중요 요소 3개 → 회피 요소 3개 → DNA → 추천 | **MERGE** | 사전 "중요/회피 요소" 선택 2단계를 DNA reveal 화면의 인라인 보정으로 병합 | DNA 보정과 기능 중복, 추상적 사전 질문은 UX·데이터 품질 모두 열등 (감사 P-1) |
| P4 | 재방문/중단 상태 | 미정의 | **REFINE** | 프로필 존재 시 `/`→`/recommendations` 리다이렉트, 온보딩 진행 상태 Dexie 저장·이어하기 | 필수 제품 상태 누락 (감사 P-2) |
| P5 | 취향 보정 위치 | `/taste` + `/settings` 양쪽 | **MERGE** | `/taste` 단독 소유. `/settings`는 정책·데이터만 | 소유권 중복 (감사 P-3) |
| P6 | 현재 Mood(이번 추천만 반영) | 전역 취향/Mood 분리 | **DEFER** | MVP 제외 | 어떤 가설도 검증하지 않으면서 상태 모델 복잡화 (감사 P-4) |
| P7 | 추천 정책 6종 | 6개 정책 | **REFINE** | 3종만: 완결작 우선 / 숨은 작품 우선 / 검증된 작품 우선 | 검증 가치 대비 설명·테스트 비용 과다 (감사 P-5) |
| P8 | 추천 10개 + 이유 구조 | 맞는 이유 3 + 차이 1 + 근거 Anchor | **KEEP** | 그대로 | 가설 B의 핵심 |
| P9 | UI 언어 | Phase 1 일본어 | **KEEP** | 일본어 UI, 중앙 문자열 테이블(i18n 라이브러리 없음) | 대상 시장 일치, 라이브러리는 과잉 |

## 추천 모델

| # | 영역 | 기존 제안 | Verdict | 최종 결정 | 이유 |
|---|---|---|---|---|---|
| R1 | 팩터 체계 | 17개 Axis + Theme centrality + 3상태(known/unknown/notApplicable) | **KEEP** | 그대로 (`factor-dictionary.md`로 이관). 단 Phase 1 데이터로 상관 진단 후 병합 여부 재평가 | 세부 취향의 가치가 검증 대상 가설 그 자체 |
| R2 | 그룹 비중 | 고정 15/25/25/20/15 (Genre/Theme/Narrative/Tone/Art) | **KEEP** | 그대로 (`02` §6.2) | 상관 팩터 중복 가점 방지 |
| R3 | Positive 점수 | Best Anchor + Consensus Bonus ≤ +0.05 (Top-3 합산 폐기) | **KEEP** | 그대로 (`02` §6.3) | 소수 취향 보존의 올바른 해법 |
| R4 | 결측 처리 | Coverage 중립 수축, 가중치 재분배 금지 | **KEEP** | 그대로 (`02` §6.2) | 결측 처리의 정석 |
| R5 | 부정 신호 | Hard Exclusion / Factor Penalty / Vague Shape의 3단 분리 | **KEEP** | 어휘·매핑을 확정(R6)한 뒤 그대로 | 구조는 옳음 |
| R6 | 불호·하차 이유 어휘 | 예시 4개만 | **REFINE** | 고정 12개 사유 enum + 팩터 매핑 테이블 확정 (`02` §6.7) | 미정의 시 UI·엔진·설명 구현 불가 (감사 R-3) |
| R7 | `explicitPreferenceAdjustment` | 항만 존재, 수식 없음 | **REFINE** | per-axis 매우선호 +0.06 / 선호 +0.03 / 덜추천 −0.06, 총합 ±0.12 cap (`02` §6.6) | 구현 fork 제거 (감사 R-2) |
| R8 | `profileConfidence` | anchor 0.7 + 부정 0.3 | **REFINE** | anchor 0.8 + 부정 0.2 | 부정 입력은 선택 사항인데 비중 과다 (감사 R-4) |
| R9 | 시장 신호 | tie-break 전용 + Bayesian 리뷰 보정(prior 20) + maturity | **KEEP** | 그대로 (`02` §6.4) | 원칙 1·2와 일치 |
| R10 | 리스트 구성 | MMR 미사용, 슬롯 제약(동일 Anchor ≤4 등) | **KEEP** | 그대로 (`02` §6.8) | 작은 후보 풀에 적정 |
| R11 | 설명 생성 | 상관 팩터를 Cluster로 묶고 그룹당 1개 | **KEEP** | 그대로 (`02` §6.9) | 동어반복 방지 |
| R12 | Spreadsheet 수식으로 산식 검증 | Phase 1 Google Sheets | **REPLACE** | 주석 입력만 Sheets/CSV, 계산은 처음부터 TS 엔진 + CLI 리포트 | Sheets로 이 산식 구현은 TS보다 느리고 오류 많음. 엔진 코드가 그대로 재사용됨 (감사 R-1) |

## 아키텍처

| # | 영역 | 기존 제안 | Verdict | 최종 결정 | 이유 |
|---|---|---|---|---|---|
| A1 | Next.js App Router | 채택 | **KEEP+REFINE** | 채택하되 경계 선언: 전 페이지 정적 셸 + 클라이언트 컴포넌트, 서버는 `/api/rakuten/*` 하나뿐. 서버 액션·RSC 페칭 금지 | 프레임워크는 건전, 경계 미선언이 문제 (감사 A-1) |
| A2 | Dexie + dexie-react-hooks | 채택 | **KEEP** | 그대로 | 로컬 우선에 적정 |
| A3 | Fuse.js 로컬 검색 | 채택 | **KEEP** | 그대로 (Catalog 검색용) | 150~수천 규모에 적정 |
| A4 | Tailwind + shadcn/ui + Zod + TS strict | 채택 | **KEEP** | 그대로 (Tailwind v4, Zod v4 기준) | 표준적이고 건전 |
| A5 | Library-only Rakuten 검색 | 방향만 존재 | **REFINE** | ISBN→Catalog 대조 우선, 불일치 시 정규화 제목+저자 키의 external entry (추천에 절대 미사용) | 런타임 Work 그룹핑 미정의 해소 (감사 A-2) |
| A6 | NDL Search | "현재 사용" | **DEFER** | MVP 완전 제외. Rakuten 품질 문제 발생 시 도입 | 150개 수동 검수 규모에서 불필요 (감사 A-4) |
| A7 | Export/Import | 기능 명시만 | **REFINE** | v1 JSON 스키마(zod), 전체 트랜잭션 적용, 미래 major 버전 거부 (`05` §7) | 데이터 이동성은 핵심 차별점이므로 계약 필요 |
| A8 | Netlify Free | 채택 | **KEEP** | 그대로 (월 300크레딧 하드리밋 검증됨, 2026-08) | 사실 확인 완료 |
| A9 | PWA: manifest 우선, Serwist는 나중 | 채택 | **KEEP** | 그대로 (Serwist 9.x 유지보수 활발·Turbopack 호환 검증됨) | 사실 확인 완료 |
| A10 | 분석(PostHog) | 베타 이후 | **KEEP(DEFER)** | MVP에 분석 코드 없음 | 검증은 블라인드 테스트로 수행 |
| A11 | Catalog 빌드 파이프라인 | CSV→정규화→검증→JSON 스크립트 체인 | **KEEP** | 그대로 (`05` §2.1) | 건전 |
| A12 | 폴더 구조 | app/components/features/domain/infrastructure 분리 | **REFINE** | `infrastructure/analytics` 제거, `lib/strings`(일본어 문자열) 추가 등 소폭 정리 (`05` §5) | A10·P9 반영 |

## 비주얼

| # | 영역 | 기존 제안 | Verdict | 최종 결정 | 이유 |
|---|---|---|---|---|---|
| V1 | Aurora / Dot Grid WebGL 배경 | React Bits 후보 | **REPLACE** | 정적 CSS 스크린톤(망점) 텍스처 | 범용 AI 클리셰 → 만화 인쇄 언어로 교체, 런타임 비용 0 (감사 V-1) |
| V2 | React Bits 의존성 | 선택적 채택 | **REMOVE** | 전면 미채택. 필요 효과는 Motion+CSS 자작 | 5개 후보 전부 대체·제거 가능, 관리 비용만 남음 (감사 V-2) |
| V3 | Motion | 채택 | **KEEP** | 유일한 애니메이션 의존성으로 채택 | 상태 연동 애니메이션의 기반 |
| V4 | NumberFlow | 채택 | **REMOVE** | 막대 성장 + 레이블 크로스페이드로 대체 | 서수 데이터에 거짓 정밀도 신호 (감사 V-3) |
| V5 | Embla Carousel | 채택 | **REMOVE** | CSS scroll-snap + 이전/다음 버튼 | 자동재생·루프 없는 요구에 과잉 (감사 V-4) |
| V6 | AutoAnimate | 선택 | **REMOVE** | Motion layout으로 커버 | 중복 |
| V7 | Spotlight Card / Tilted Card | 일부 채택 | **REMOVE** | 추천 피드는 조용하게. hover는 미세 lift만 | 콘텐츠(표지)와 경쟁하는 장식 |
| V8 | 표지 200×200 전제 | 원본 그대로 사용 | **REFINE** | 프록시에서 `_ex=400x400`(상세 600x600) 재작성 + 200 폴백 | `_ex` 파라미터 동작 검증됨(비공식이므로 폴백 필수) (감사 V-5) |
| V9 | 로고 reveal (1회성) | 채택 | **KEEP+REFINE** | 시그니처 모먼트 #1로 승격, 타이밍·reduced-motion 사양 확정 (`04` §5.1) | 브랜드=제품 구조의 핵심 |
| V10 | Taste 가로 막대 + 상위 3개 강조 | 채택 | **KEEP** | DNA reveal을 시그니처 모먼트 #2로 사양화 | 올바른 시각화 선택 |
| V11 | 작품 상세 블러 표지 배경 | 채택 | **KEEP** | 시그니처 비주얼 #3 (정적) | 저작권 안전 + 몰입감 |
| V12 | 다크 모드 | 미언급 | **REFINE** | 시맨틱 토큰 첫날 설계, MVP는 라이트 단일, 다크는 폴리시 슬라이스에서 추가 | 야간 사용자 대응과 검증 단계 QA 비용의 균형 (감사 V-6) |
| V13 | 애니메이션 예산 | 지속 애니메이션 1개/화면, 자동 캐러셀·스크롤 하이재킹 금지 | **KEEP** | 모션 분류 체계로 정식화 (`04` §6) | 건전한 원칙 |

## 검증·순서

| # | 영역 | 기존 제안 | Verdict | 최종 결정 | 이유 |
|---|---|---|---|---|---|
| S1 | 구현 단계 | Phase 0~6 (7단계: 사전→Sheets 검증→엔진→블라인드→MVP→폴리시→확장) | **MERGE** | 5단계로 재편: 사전+엔진 → 50작품 sanity → 150작품 블라인드(GO 게이트) → Web MVP → 폴리시+PWA (`06` §1) | R12 반영, 블라인드 하니스 정의 추가 (감사 S-1) |
| S2 | 블라인드 테스트 방법 | 지표만 정의 | **REFINE** | 엔진·Catalog 재사용하는 로컬 웹 하니스로 진행, 결과 JSON 기록 | 실행 방법 미정의 해소 |
| S3 | GO/REVISE 기준·핵심 지표 | 7/10명 우세, Explanation Agreement 70% 등 | **KEEP** | 그대로 (`02` §7) | 방향성 판단 기준으로 적정 |
| S4 | E2E 범위 | 핵심 여정·피드백·영속성·장애·Export의 5개 시나리오 | **KEEP** | 그대로 (`07` §4) | 과하지 않은 적정 범위 |
| S5 | G1 Art 근거 미달 처리 | 작품명별 validator·coverage 예외 | **REMOVE** | 제목 예외 없이 동일 근거 최소선을 적용. 정식 라이선스 해외 출판사·출판사 승인 플랫폼은 공식 근거로 허용하고, 미달 축은 `unknown`, cohort 요건 미달 작품은 사전 선택 규칙으로 교체 | 검증 통과를 위한 제목 특례는 데이터 비교 가능성과 재현성을 훼손함 |
