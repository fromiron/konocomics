# AGENTS.md — konocomics 구현 에이전트 가이드

너는 **konocomics**(일본 만화 취향 분석 + 설명 가능한 추천, 로컬 우선 웹앱)의 구현 담당이다.
기획·설계 결정은 이미 완료되어 `docs/planning/`에 확정되어 있다. **네 역할은 결정을 다시 내리는 것이 아니라 계약대로 구현하는 것이다.**

## 0. 문서 우선순위 (충돌 시 위가 이긴다)

1. `docs/planning/02-product-spec.md` — 제품 사양·**추천 산식의 단일 진실 원천(§6)**
2. `docs/factors/factor-dictionary.md` — **팩터 정의(17 Axis·Theme·Genre·0/2/4 기준·표시 레이블)의 단일 진실 원천**
3. `docs/planning/05-architecture.md` — 스택·경계·영속성·API 계약·빌드 파이프라인
4. `docs/planning/03-ux-screen-contracts.md` — 화면별 구현 계약·수용 기준
5. `docs/planning/04-visual-interaction-spec.md` — 토큰·모션·시그니처 모먼트
6. `docs/planning/06-implementation-plan.md` — 슬라이스 순서·완료 기준
7. `docs/planning/07-acceptance-test-plan.md` — 테스트 계약

`docs/planning/00-plan-audit.md`·`01-decision-ledger.md`는 **이력 기록**(폐기된 초안 대비 무엇이 왜 달라졌는지)이다. 결정의 이유가 궁금할 때만 참조하고, 사양으로 읽지 마라.

## 1. 절대 규칙 (위반 금지)

- **결정론:** `src/domain/**`은 순수 함수만. React/Dexie/Next/`Date.now()`/난수/I-O import 금지(ESLint로 강제). 시간은 인자로 주입. 동일 입력 → 동일 출력.
- **설명은 근거에서만:** 추천 이유 문장은 엔진이 반환한 `contributions[]`에서만 생성한다. 임의 문구·하드코딩 설명 금지.
- **데이터 없음 ≠ 불호:** `unknown` 팩터는 유사도·감점·보정 어디에도 수치로 쓰지 않는다. Coverage 미달 그룹은 0.5로 수축만 하고 **가중치를 다른 그룹에 재분배하지 않는다.**
- **런타임 LLM 금지.** 추천·순위·설명 생성에 LLM API를 호출하지 않는다.
- **서버 경계:** 서버 코드는 `/api/rakuten/search`·`/api/rakuten/item` 둘뿐. 서버 액션·RSC 데이터 페칭·동적 SSR 추가 금지. 모든 페이지는 정적 셸 + 클라이언트 컴포넌트.
- **의존성 추가 금지(허용 목록 외):** next, react, tailwindcss v4, shadcn/ui 계열, motion, zod, dexie(+react-hooks), fuse.js, tsx, csv-parse, vitest, @testing-library/*, playwright, (폴리시 단계에서) @serwist/next, next-themes. 그 외가 필요하다고 판단되면 **추가하지 말고 사유를 남기고 사용자에게 물어라.** React Bits·NumberFlow·Embla·AutoAnimate·GSAP·TanStack Query·Zustand는 심의 끝에 기각된 것이니 재제안하지 마라.
- **표지 이미지:** 원본 비율 유지(크롭·누끼·텍스트 합성 금지), 블러 배경은 동일 URL + `aria-hidden`, 자체 저장소 복제 금지. `_ex` 확대는 로드 실패 시 200x200 폴백 필수.
- **비밀키:** `RAKUTEN_APPLICATION_ID` 등은 서버 전용. 클라이언트 번들·커밋에 포함 금지.
- **UI 언어는 일본어**, 문자열은 전부 `src/lib/strings.ts` 경유. 코드·주석·커밋은 영어, 문서는 한국어.

## 2. 작업 절차

- `06-implementation-plan.md`의 **슬라이스 순서를 따르고, 한 슬라이스를 완료 기준까지 끝낸 뒤 다음으로 넘어간다.** 슬라이스 범위 밖 기회적 확장 금지("Explicitly out of scope" 준수).
- **게이트 G1(50작품 sanity)·G2(블라인드 GO/NO-GO)는 사람·데이터 작업이다.** 게이트 도달 시 멈추고 사용자에게 보고한다. G2 통과 전에 UI 슬라이스(5~)를 시작하지 않는다.
- 화면 구현 시 `03-ux-screen-contracts.md`의 해당 섹션 **수용 기준 체크리스트를 그대로 검증**하고, 완료 보고에 항목별 충족 여부를 남긴다.
- 산식 수치(감점값·cap·임계 등)를 조정해야 할 근거가 생기면: 코드만 바꾸지 말고 `02-product-spec.md` §6의 표를 함께 갱신하고 골든 스냅샷을 재생성한다.
- 계약이 모호하거나 문서 간 모순을 발견하면: 임의로 정하지 말고 우선순위(§0)로 해소를 시도하고, 그래도 남으면 사용자에게 질문한다.

## 3. 명령어 (슬라이스 0 이후 유효)

```bash
npm run dev                 # 개발 서버 (PWA 테스트만 --webpack 필요)
npm run build               # 프로덕션 빌드
npm run test                # Vitest 유닛·컴포넌트
npm run test:e2e            # Playwright (라쿠텐은 라우트 모킹)
npm run lint && npm run typecheck
npm run catalog:validate    # CI 게이트 — 실패 시 배포 불가
npm run catalog:build       # data/source CSV → src/data/generated/catalog-v1.json
npm run catalog:coverage    # 팩터 coverage·상관 진단 리포트
npm run --silent experiment:baseline # Taste vs Baseline CLI 비교 리포트(stdout은 Markdown만)
```

커밋 전 최소: `typecheck` + `lint` + `test` + (catalog 변경 시) `catalog:validate`.

## 4. 코드 컨벤션

- TypeScript strict. `any`·`as` 캐스팅 지양, 경계(외부 API·파일·Import)는 반드시 zod 파싱.
- 의존 방향: `app → features → domain`, `features → infrastructure`. **domain은 아무것도 import하지 않는다.** 컴포넌트에서 Dexie 직접 접근 금지(`infrastructure/db` 훅 래퍼 경유).
- 스타일은 Tailwind + `globals.css`의 시맨틱 토큰(`04` §2)만 사용. 임의 hex·px 매직넘버로 토큰을 우회하지 않는다. `--accent`는 의미 있는 곳(로고 kono·mi, 상위 취향, 주요 CTA, 선택, focus)에만.
- 모션은 `04` §6의 분류 A~F 중 하나에 속해야 하며, 상시 루프 애니메이션 금지, `prefers-reduced-motion` 폴백 필수.
- 테스트는 `07`의 계약 목록이 기준이다. 계약 밖 커버리지 확대를 위한 테스트 양산 금지.
- 접근성 기본선: focus-visible 링, 터치 타깃 ≥44px, 장식 요소 `aria-hidden`, FactorBar는 `role="meter"`, 리스트 변경 `aria-live` — 상세는 `03` 각 화면.

## 5. 현재 상태

- 저장소는 아직 스캐폴드 전이다. 첫 작업 = 슬라이스 0 (`06-implementation-plan.md` 참조).
- 미해결(사용자 소유 결정): 상표·도메인 확인, 라쿠텐 App ID 발급, 블라인드 테스트 참가자 모집.
