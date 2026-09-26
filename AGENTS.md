# AGENTS.md — konocomics 구현 에이전트 가이드

너는 **konocomics**(일본 만화 취향 분석 + 설명 가능한 추천, 로컬 우선 웹앱)의 구현 담당이다.
기획·설계 결정은 `docs/planning/`에 확정되어 있다. 현재 사용자 요청의 범위에서 계약대로 구현하고, 의도한 제품 경로에서 결과를 확인한다. 기존 구현·테스트·과거 완료 기록을 새 요구사항이나 현재 검증의 대용으로 삼지 않는다.

## 실행 원칙

- **권한과 범위:** 상위 시스템·개발자 지시 아래에서 현재 명시적 사용자 지시와 승인된 제품 의도를 우선한다. 아래 문서 순위는 프로젝트 계약 간 충돌을 해소하는 기준이다. 코드·테스트·작업용 지시 파일은 이 계약을 재정의하지 않는다.
- **끝까지 실행:** “개선해줘”, “고쳐줄 수 있어?”는 범위 내 작업 요청이다. 승인된 가역적 작업은 구현·필요한 검증까지 진행한다. 결과를 바꾸지 않는 작은 모호함은 가정을 밝히고 해결하며, 계획이나 진행 제안만으로 끝내지 않는다.
- **질문할 때:** 제품 결과를 바꾸는 미해결 계약 충돌, 허용 목록 밖 의존성, 권한 없는 외부 효과·파괴적 작업만 해당 결정을 보류한다. 이미 승인된 동일 범위는 재승인을 요구하지 않는다. 질문 전에 가능한 조사·수정·검증으로 검토 가능한 결과를 준비하고, 독립 작업은 계속한다. 이 원칙 자체가 GitHub 쓰기·배포 권한을 부여하지 않는다.
- **지시 충돌:** 적용할 AGENTS.md·스킬·작업 지시의 범위와 현재 승인 여부를 확인한다. 과거의 승인 대기 문구를 현재 중단 조건으로 재사용하지 않는다. 해결되지 않는 충돌은 해당 파일·조항과 필요한 결정을 보고한다.
- **최소 완결 변경:** 관련 진입점과 호출자를 먼저 읽고 기존 구현·표준 기능을 재사용한다. 결함은 공통 원인과 영향받는 소비자까지 수정하되, 무관한 정리·새 추상화·검증 전용 우회 경로를 추가하지 않는다. 기존 사용자 변경과 비추적 자료를 보존한다.
- **병렬 작업:** 독립 조회는 도구가 지원하면 묶고 각 결과를 확인한다. 의존 작업·공유 상태 변경·발행은 순서대로 수행한다. 서브에이전트는 사용자나 적용되는 작업 계약이 요청한 경우에 사용하며, 범위·담당 파일·반환 근거를 지정한다. Catalog 확장은 §2의 전용 배정·검증 책임을 따른다.
- **보고:** 한국어로 결과부터 간결하게 쓴다. 변경 내용·수행한 검증·남은 한계를 구분하고, 실패나 미검증을 숨기지 않는다. 진행 중에는 의미 있는 발견과 다음 확인을 알리며, 단순 작업에 장문 계획이나 반복 보고를 만들지 않는다. 계약상 체크리스트·PR 증거 기록은 생략하지 않는다.

작성 근거: [OpenAI Model guidance — Prompting best practices](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices) (2026-09-10 확인). 자율 실행·지시 충돌·응답 방식·위임 범위·검증 강도에 관한 가이던스를 프로젝트에 적용했다. 모델 선택과 API 설정을 변경하는 지시는 아니다.

## 0. 문서 우선순위 (충돌 시 위가 이긴다)

1. `docs/planning/02-product-spec.md` — 제품 사양·**추천 산식의 단일 진실 원천(§6)**
2. `docs/factors/factor-dictionary.md` — **팩터 정의(17 Axis·Theme·Genre·0/2/4 기준·표시 레이블)의 단일 진실 원천**
3. `docs/planning/09-catalog-authoring-authority.md` — Catalog authoring 권한·SQLite authority/shadow·판정 결정론 계약
4. `docs/planning/08-tanstack-start-migration.md` — framework·Router·URL·SSR·server migration 계약
5. `docs/planning/05-architecture.md` — 스택·경계·영속성·API 계약·빌드 파이프라인
6. `docs/planning/03-ux-screen-contracts.md` — 화면별 구현 계약·수용 기준
7. `docs/planning/04-visual-interaction-spec.md` — dark token·모션·시그니처 모먼트
8. `docs/planning/redesign/` — 확정 7화면의 구도·밀도·페이지별 구현 번들
9. `docs/planning/06-implementation-plan.md` — 슬라이스 순서·완료 기준
10. `docs/planning/07-acceptance-test-plan.md` — 테스트 계약

`docs/planning/00-plan-audit.md`·`01-decision-ledger.md`는 **이력 기록**(폐기된 초안 대비 무엇이 왜 달라졌는지)이다. 결정의 이유가 궁금할 때만 참조하고, 사양으로 읽지 마라.

## 1. 절대 규칙 (위반 금지)

- **결정론:** `src/domain/**`은 순수 함수만. React/Dexie/TanStack/`Date.now()`/난수/I-O import 금지(ESLint로 강제). 시간은 인자로 주입. 동일 입력 → 동일 출력.
- **설명은 근거에서만:** 추천 이유 문장은 엔진이 반환한 `contributions[]`에서만 생성한다. 임의 문구·하드코딩 설명 금지.
- **데이터 없음 ≠ 불호:** `unknown` 팩터는 유사도·감점·보정 어디에도 수치로 쓰지 않는다. Coverage 미달 그룹은 0.5로 수축만 하고 **가중치를 다른 그룹에 재분배하지 않는다.**
- **런타임 LLM 권한 금지.** 런타임 추천·순위·설명 생성에 LLM API를 호출하지 않는다. 원시 오프라인 모델 출력은 `09`의 격리된 candidate일 뿐이다. 다만 사용자가 2026-09-01 승인한 `authorizedEvidencePanel`은 `docs/catalog-expansion/02-authorized-evidence-panel-v1.md`의 동결 근거·claim 재판정·manifest 계약을 전부 통과한 별도 오프라인 adjudication artifact에 한해 신규 Catalog 판정 권한을 가진다. 사람 검수로 표시하지 않는다.
- **서버 경계:** 서버 코드는 TanStack Start server route의 `/api/rakuten/search`·`/api/rakuten/item` 둘뿐. 임의 server function·새 server route·runtime database·auth·runtime LLM 추가 금지. `09`의 tracked SQLite authority와 OS 임시 shadow는 빌드 타임에만 존재하며 `08` §3의 route별 SSR/client 경계를 바꾸지 않는다.
- **의존성 추가 금지(허용 목록 외):** TanStack Start/Router, Vite/React plugin/Nitro, react, tailwindcss v4, shadcn Base UI 계열, motion, zod, dexie(+react-hooks), fuse.js, tsx, csv-parse, vitest, @testing-library/*, playwright. 그 외가 필요하면 **추가하지 말고 사유를 남기고 사용자에게 물어라.** React Bits·NumberFlow·Embla·Swiper·AutoAnimate·GSAP·TanStack Query·Zustand·next-themes는 추가하지 않는다. 별도 G2 harness의 동결된 Next dependency는 제품 M9와 격리한다.
- **UI primitive:** shadcn CLI의 Base UI 기반 primitive를 필요한 것만 `src/components/ui/**`에 생성하고, 시맨틱 dark token과 접근성 기본값은 `src/components/design-system/**` wrapper에서 적용한다. route/feature가 생성 primitive를 직접 소비하지 않는다.
- **dark-only:** theme selector와 전역 light theme을 만들지 않는다. 2026-09-11 사용자가 선택한 판매순 발견 배너와 상세 근거 배너에만 밝은 `--discovery-*`·`--evidence-surface` 표면·텍스트 토큰을 허용한다. 확정 primary는 `oklch(0.7525 0.1382 236.09)`이며 accent 위 텍스트는 어두운 `--on-accent`를 쓴다.
- **표지 이미지:** 원본 비율 유지(크롭·누끼·텍스트 합성 금지), 블러 배경은 동일 URL + `aria-hidden`, 자체 저장소 복제 금지. `_ex` 확대는 로드 실패 시 200x200 폴백 필수.
- **비밀키:** `RAKUTEN_APPLICATION_ID` 등은 서버 전용. 클라이언트 번들·커밋에 포함 금지.
- **UI 언어는 일본어**, 문자열은 전부 `src/lib/strings.ts` 경유. 코드·주석·커밋은 영어, 문서는 한국어.

## 2. 작업 절차

- **Catalog 실행 스킬:** 조정자는 [.agents/skills/catalog-coordinator/SKILL.md](.agents/skills/catalog-coordinator/SKILL.md), 작업자는 [.agents/skills/catalog-worker/SKILL.md](.agents/skills/catalog-worker/SKILL.md)를 사용한다. 현재 목표는 고정 세션 배치 운영이며 기존 runner·수집 helper를 재사용한다. 코드의 비발행 단계·배치 통지 준비 상태를 확인하고 과거 운영 이력 전체를 작업 지시로 복사하지 않는다.

- **현재 운영 목표 — 2026-09-24:** 사용자 요청으로 **부모 오케스트레이터 세션 `01a0a3b8-5162-78f0-ac39-4e17f730a70a`의 GPT-5.6 Sol(`gpt-5.6-sol`) / high + 루나1~6 고정 작업 세션의 GPT-6 Luna(`gpt-6-luna`) / xhigh + 신규 배정당 50작품**을 운영한다. 오케스트레이터 모델 설정은 루나 작업 세션에 전달하지 않는다. 루나4·5·6은 이전 솔1·2·3과 같은 thread ID다. 조정자는 [배치 계획 §3](docs/catalog-expansion/01c-sol-batch-promotion-plan.md)의 현재 6개 ID를 확인하고 **루나 작업 세션에 보내는 매 새 턴에만** `model="gpt-6-luna"`, `thinking="xhigh"`를 명시한다. 부모 세션에 보내는 메시지에는 이 작업자 모델을 사용하지 않는다. 기존 세션 설정·메모리·과거 이름에서 모델을 추정하지 않는다. 이미 실행 중인 턴, 배정된 100작품 묶음, 기존 판정·모델 이력은 보존한다. 각 세션은 자기 배치 전체를 로컬 원문 우선으로 수집·보완·저장한 뒤 판정 단계로 전환한다. 수집과 판정을 작품마다 교차하지 않는다. 판정은 작품별 동결 입력으로 연속 처리하고, 판정 배치 완료 후 조정자가 집계·예외 확인과 직렬 승격을 담당한다. 매 작품 부모 왕복·정상 결과 전수 의미 재검토는 하지 않는다. 추가 검색 횟수 상한은 폐지하고 구체적 gap·새 정보·출처 소진으로 종료한다. 기존 근거·HOLD·실패·모델 이력은 보존한다. 지침 갱신만으로 중단된 큐를 재개하지 않는다.

- **세션 간 메시지 모델:** `send_message_to_thread`의 model/thinking은 받는 세션에 적용한다. 부모 `01a0a3b8-5162-78f0-ac39-4e17f730a70a` → 루나1~~6은 `gpt-6-luna` / `xhigh`, 루나1~~6 → 부모의 진행·완료·부분 중단 보고는 `gpt-5.6-sol` / `high`를 지정한다. 작업자 모델을 부모 보고에 넣지 않는다.
- **현재 수집 범위 — 2026-09-21:** 대표 ISBN과 해당 판본만 정확히 결속하며 전권·완결권 확인을 요구하지 않는다. 중간 권 ISBN을 1권으로 바꾸지 않는다. 추가 조사는 구체적 필수 팩터 gap에 한정한다. 안전 분류는 출판사·해당 레이블 근거에 따른 porn/non-porn이며 성인등급·성적 소재·표현강도 미확인은 HOLD 사유가 아니다. Art 4축은 수집·판정·정족수 검사에서 전면 제외하고 신규 표기는 unknown으로 유지한다. 기존 근거를 재사용하고 정정은 새 revision으로 남기며 과거 frozen·판정은 보존한다.

- **현재 N/T·추천 문맥 처리:** 추가 조사를 마쳤는데 서사·톤만 부족하면 실제 조사 시도와 출처 소진을 새 v4 job의 `narrativeToneExhaustion`에 결속하고 해당 축을 `unknown`으로 둔 채 추천 승격을 진행한다. 조사 기록 없는 자동 예외나 다른 차단의 면제는 허용하지 않는다. 수집 완료 전 registry `supportEvidenceUrls`의 정확한 URL이 작품 선정 사실을 보여주는지 확인하고, 캡처 원문뿐 아니라 같은 작품 research·evidence ID까지 결속한다. 정확한 URL에 작품 근거가 없으면 추천 문맥 gap 또는 registry 정정 대상으로 남기며 URL을 임의 대체하지 않는다. 기존 frozen·HOLD는 새 입력 revision으로만 복구한다.

- **우선 복구 — 2026-09-23:** 직전 HOLD 263건에서 분류한 N/T-only 120건과 추천 URL 결속 누락 70건을 신규 작품보다 먼저 검토한다. 현재 배정은 완료하고 각 세션의 완료 보고 뒤 최신 candidate·registry·중복 배정·유효 READY를 대조해 최대 50작품씩 복구를 배정한다. 190은 검토 후보 수이지 승격 확정 수가 아니다. 복구된 작품만 기존 비발행 검사와 조정자의 직렬 발행·readback을 거쳐 집계한다.

- Catalog authoring은 `09`의 **`S0~S6` 순서**를 따른다. `S0~S5` shadow와 별도 승인된 `S6` 전환은 완료됐으며, 이후 table-backed 단일 권한은 `data/source/catalog.sqlite`다. 9개 authoritative CSV를 복구하거나 DB와 함께 두지 않는다.
- 조사·판정 저장은 `docs/catalog-expansion/03-local-authoring-storage.md`의 2026-09-26 보존 정책을 따른다. 현재 큐레이션·원문 근거·의미 있는 변경 이력·최신 유효 READY/HOLD·미완료 의존을 보존하며 모든 실행 사본의 영구 복원을 요구하지 않는다. schema v3에서는 내부 저장 `PERSISTED`와 수집/판정/발행/종료·중단 경계의 실제 `BACKED_UP`을 구분한다. `.tmp`만을 유일한 보존 위치로 쓰거나 상태 문자열로 백업·판정·승격을 대신하지 않는다. 구 frozen SHA를 변경하지 않고 세대 전환과 삭제는 검증된 retention plan 범위로 제한한다.
- 출판사 판본 페이지 수집 시 소개 원문·수집 receipt·서지 입력도 같은 수집분에 보존한다. 정확한 Work·ISBN 검토 후 `scripts/import-publisher-book-metadata.ts`로 기존 metadata를 보존하며 직렬 반영한다. 입력·저장·갱신 경계는 위 저장 계약의 「출판사 소개를 수집과 함께 저장」를 따른다.
- Catalog 배정·보고·발행은 [배치 계획](docs/catalog-expansion/01c-sol-batch-promotion-plan.md)의 **현재 세션 표**와 [운영 보충](docs/catalog-expansion/01a-promotion-method-operational-amendment.md)의 최신 절을 따른다. 사용자 지정 루나1~6 고정 채팅을 재사용하며 판정용 서브에이전트·일회성 CLI·앱 채팅의 CLI resume로 대체하지 않는다. 지정 ID 확인 불가 시 해당 배정만 보류하고 사용자에게 새 ID 또는 세션 생성 허가를 명시적으로 요청한다. 허가 없이 방을 만들거나 옛 Luna 방을 전용하지 않는다. 신규 배정 50작품은 목록·확인 단위이며 기존 100작품 배정은 완료 또는 부분 checkpoint까지 보존한다. 작품별 입력·기계 검사·checkpoint·백업을 유지한다. 한 세션의 배치가 끝나면 다른 방을 기다리지 않고 확인·발행한다. `run --decisions`는 발행 경로이므로 작업자의 검사 전용 명령으로 쓰지 않는다. 일반 배치에서는 `--allow-model`을 사용하지 않는다. 공유 DB·registry·STATE·발행은 기존 잠금 아래 직렬 처리하고, 완료 판정 재사용·최신 서지 보존·제품 readback을 지킨다. 예약 automation은 만들지 않는다. 과거 Luna 5개 방·매 작품 통지는 이력으로만 보존한다.
- `06-implementation-plan.md`의 단계별 완료 기준과 `08`의 **`M0~M10` 순서**를 보존한다. 완료된 단계는 일반 유지보수에서 처음부터 재실행하지 않고 변경이 영향을 주는 계약을 검증한다. framework migration과 7화면 redesign을 하나의 대형 PR로 합치지 않는다.
- **게이트 G1(50작품 sanity)·G2(GO/NO-GO)**의 미충족 조건에 도달하면 의존 작업을 멈추고 보고한다. 기존 G2 제품 방향·Slice 5 승인은 §5의 model-panel artifact 범위에서 적용하며 재승인을 요구하지 않는다. 이를 사람 블라인드 검증 완료나 다른 범위의 승인으로 확대하지 않는다.
- Model-panel evidence 검토에서 Local/Gemini/Grok CLI에는 ZIP이 아니라 canonical uncompressed directory와 exact request·complete payload ledger·root identity를 제공한다. ChatGPT.com Oracle에만 같은 payload의 deterministic ZIP을 제공한다. 이후 모든 Oracle 검토 모델은 사용자 2026-09-09 지시에 따라 ChatGPT UI의 6 Pro를 사용한다.
- Oracle에 코드만 첨부할 때는 전역 `repomix`로 단일 context 파일을 만들고, 이미지도 필요하면 그 context와 대상 이미지를 ZIP으로 묶거나 각각 파일로 첨부한다.
- 화면 구현 시 `03-ux-screen-contracts.md`의 해당 섹션 **수용 기준 체크리스트를 그대로 검증**하고, 완료 보고에 항목별 충족 여부를 남긴다.
- 산식 수치(감점값·cap·임계 등)를 조정해야 할 근거가 생기면: 코드만 바꾸지 말고 `02-product-spec.md` §6의 표를 함께 갱신하고 골든 스냅샷을 재생성한다.
- 제품 계약의 모호함·문서 간 모순은 §0의 우선순위로 해소한다. 그래도 제품 결과를 바꾸는 선택이 남으면 실행 원칙의 질문 기준을 따른다.

## 3. 명령어 (슬라이스 0 이후 유효)

```bash
pnpm dev                    # TanStack Start 개발 서버
pnpm build                  # 프로덕션 빌드
pnpm test                   # Vitest 유닛·컴포넌트
pnpm test:e2e               # fixed 5 Playwright 시나리오(라쿠텐 route mock)
pnpm lint && pnpm typecheck
pnpm catalog:validate       # CI 게이트 — 실패 시 배포 불가
pnpm catalog:build          # data/source/catalog.sqlite → generated static JSON
pnpm catalog:authority:verify # tracked SQLite schema·layout·integrity
pnpm catalog:coverage       # 팩터 coverage·상관 진단 리포트
pnpm --silent experiment:baseline # Taste vs Baseline CLI 비교 리포트(stdout은 Markdown만)
```

푸시 전 최소: `typecheck` + `lint` + `test` + (catalog 변경 시) `catalog:validate`. 일반 작업에서는 푸시 직전에 실행하며 로컬 커밋의 조건으로 실행하지 않는다. **2026-09-21 사용자 예외 승인:** 현재 연속 Catalog 승격 작업은 완료 묶음마다 조정자가 DB 반영·커밋·푸시한다. 중간 테스트·CI/CD는 실행하지 않고 전체 작업 완료 후 최종 검증·테스트를 수행한다. 중간에도 입력 결속·DB 무결성·잠금·반영 readback·저장/백업은 유지한다. 작업 브랜치를 사용하고 커밋에 `[skip ci]`를 넣으며 자동 배포 경로는 실행하지 않는다. 중간 푸시는 검증 완료나 릴리스 완료로 보고하지 않는다.

### 검증 범위와 종료 조건

- 실행 명령은 현재 `package.json`에서 확인한다. 문서만 수정하고 커밋하지 않는 작업은 참조 경로·계약 충돌·문서 포맷·diff를 확인한다. 동작 변경은 영향받는 기존 테스트와 대표 제품 흐름을 검증하고, 실제 결함에는 최소 회귀 검사를 남긴다. 위 푸시 전 검사와 해당 작업의 필수 게이트는 유지한다.
- 의도한 진입점에서 주 구현 경로를 실행하고, 영속성·외부 효과가 관련되면 결과 상태를 직접 읽어 확인한다. mock E2E는 실제 Rakuten 연동 증거가 아니며 로컬 build는 배포 증거가 아니다. 대상 환경이나 권한이 없으면 가능한 계약 동등 경로를 검증하고 남은 한계를 명시한다.
- 요청 결과와 필수 검증을 충족하면 종료한다. 새 변경·실패·구체적 미해결 우려가 없으면 같은 검사를 반복하거나 범위를 넓히지 않는다. 구현을 그대로 따라 쓰는 테스트나 성공을 만들기 위한 harness를 추가하지 않는다.

## 4. 코드 컨벤션

- TypeScript strict. `any`·`as` 캐스팅 지양, 경계(외부 API·파일·Import)는 반드시 zod 파싱.
- 의존 방향: `routes → features → domain`, `features → infrastructure`. **domain은 아무것도 import하지 않는다.** 컴포넌트에서 Dexie 직접 접근 금지(`infrastructure/db` 훅 래퍼 경유).
- 스타일은 Tailwind + `globals.css`의 시맨틱 토큰(`04` §2)만 사용. 임의 hex·px 매직넘버로 토큰을 우회하지 않는다. `--accent`는 의미 있는 곳(로고 kono·mi, 상위 취향, 주요 CTA, 선택, focus)에만.
- 모션은 `04` §6의 분류 A~F 중 하나에 속해야 하며, 상시 루프 애니메이션 금지, `prefers-reduced-motion` 폴백 필수.
- 테스트는 `07`의 계약 목록이 기준이다. fixed 5 product E2E를 늘리거나 새 visual-regression infrastructure를 만들지 않고 기존 fixture·테스트를 migration 회귀에 재사용한다.
- 접근성 기본선: focus-visible 링, 터치 타깃 ≥44px, 장식 요소 `aria-hidden`, 확인된 FactorBar는 `role="meter"`, 미확인 축은 이름 있는 비수치 상태, 리스트 변경 `aria-live` — 상세는 `03` 각 화면.

## 5. 기존 완료·승인 기록

아래는 작업 출발점인 이력이다. 현재 상태나 릴리스를 보고할 때는 관련 HEAD·artifact·실제 결과를 확인한다. 과거 검증을 이번 실행의 PASS로 보고하지 않으며, 승인 범위는 현재 사용자 지시와 함께 판단한다.

- 슬라이스 0~4와 150작품 Catalog를 완료했다. 제품 방향 G2는 `data/staging/g2/g2-product-direction-approval.json`의 사용자 승인 model-panel 경로로 `GO`이며 Slice 5가 승인됐다.
- 사람 블라인드 검증은 실행하지 않았다. `humanValidation: "not-run"`, human metrics `null`, synthetic pilot human `0` / pilot `1` / verdict `INCOMPLETE` 경계를 유지한다.
- 슬라이스 5(앱 셸·토큰·온보딩), 6(`/taste`), 7(`/recommendations`), 8(Rakuten 프록시·Catalog 작품 상세), 9(`/library`·external 작품), 10(`/settings`·Export/Import·전체 삭제·정적 랜딩)을 완료했다. 데스크톱·390×844 Playwright에서 키보드 온보딩→DNA→추천, 정책 저장·피드백 백필, Catalog/external Library 영속성, provider 장애, canonical external URL과 동시 편집 ISBN 보존, seven-store Export→삭제→Import와 손상·Catalog mismatch·pre-profile draft 분기를 검증했다.
- Catalog 상세은 현재 모든 bundled ID를 prerender하고 unknown ID는 닫으며, external은 고정 정적 셸 `/works/external?workId=<ExternalWorkId>`에서만 client lookup한다. 기존 150작품은 추천 Gold Set으로 동결하고, 검증된 확장 작품은 주석 게이트 전까지 `libraryOnly`로만 수용한다. external v1 ID/key는 immutable이며 Export/Import 호환을 유지한다.
- 슬라이스 11까지의 Next.js 제품이 migration baseline이다. `09`의 Catalog authoring `S0~S6`, `08`의 `M0~M10` TanStack Start migration, dark-only 7화면 redesign을 완료했으며 추천/Dexie/Rakuten 계약은 동결한다.
- 향후 릴리스 대상은 Vercel로 확정됐지만 현재 배포 권한은 열지 않았다. GitHub의 현재 Slice 5~11 commit·PR·`main` merge만 2026-08-16 사용자 승인 범위이며, Vercel Project 연결·Preview·Production은 별도 승인 작업이다. 로컬 build/Playwright나 GitHub merge를 배포 증거로 간주하지 않는다.
- 미해결 사용자 소유 항목: 상표·도메인 확인, 라쿠텐 App ID 발급, 향후 사람 블라인드 테스트 참가자 모집.
