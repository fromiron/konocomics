# 05 — 아키텍처 (Architecture)

> 검증된 MVP를 위한 최소 완결 아키텍처. "어디서 데이터가 생기고, 어디서 변환되고, 어디에 저장되며, 어떤 계층이 그 변환을 소유하는가"를 정의한다.

---

## 1. 기술 스택 (확정)

| 역할 | 선택 | 존재 이유 |
|---|---|---|
| Framework | **Next.js (App Router, 최신 stable)** | 정적 셸 + 단일 Route Handler + Netlify 1저장소 배포. §3의 경계 선언과 함께 사용 |
| Language | TypeScript strict | 산식·스키마 타입 안정성 |
| Styling | Tailwind CSS v4 | 토큰(`04` §2)을 `@theme`으로 정의 |
| UI Primitive | shadcn/ui (Dialog, Sheet, Tabs, Toast 등 필요분만) | 접근성 확보된 프리미티브 |
| Animation | Motion (LazyMotion) | `04` §7. 유일한 애니메이션 의존성 |
| Validation | Zod v4 | Catalog·API 응답·Import 전 경계 검증 |
| Local DB | Dexie + dexie-react-hooks | IndexedDB + `useLiveQuery` 반응성 |
| Local Search | Fuse.js | Catalog 검색(온보딩·Library) |
| Catalog Build | tsx + csv-parse | CSV→JSON 파이프라인 |
| Test | Vitest / Testing Library / Playwright | `07` 참조 |
| Hosting | Netlify Free (Next.js Runtime v5) | 월 300크레딧 하드리밋 — 과금 폭주 없음(2026-08 검증) |
| PWA | manifest 우선 → Serwist(`@serwist/next`) 폴리시 단계 | Serwist 9.x 유지보수 활발, Turbopack 빌드 호환(dev PWA 테스트만 `--webpack`) |

**의도적으로 없는 것:** TanStack Query(단일 프록시 + CDN 캐시로 충분) / Zustand(지속=Dexie, 일시=React state) / 서버 DB·Auth / i18n 라이브러리(중앙 문자열 테이블) / 분석 SDK / React Bits·Embla·NumberFlow·AutoAnimate(`01` V2~V6) / NDL 연동(DEFER).

## 2. 데이터 흐름 전체도

```text
[빌드 타임]                              [런타임 - 브라우저]
data/source/*.csv (수동 주석)            src/data/generated/catalog-v1.json (번들 포함)
   │  scripts/sync-rakuten.ts                │ CatalogProvider (1회 로드+zod 검증, 메모리 상주)
   │  scripts/normalize-works.ts             ├→ Fuse 인덱스 (온보딩·Library 검색)
   │  scripts/validate-catalog.ts            ├→ Recommendation Engine (순수 함수)
   ▼  scripts/build-catalog.ts               │     입력: catalog + Dexie 스냅샷(프로필·기록)
data/generated/catalog-v1.json               │     출력: RankedRecommendation[] (contributions 포함)
   (검증 통과분만 src/data로 복사)            ▼
                                         Dexie (IndexedDB)
                                           userWorks / externalWorks / profile /
                                           onboardingDraft / recommendationCache / meta
[런타임 - 서버(유일)]
/api/rakuten/search|item  ← 브라우저 fetch
   │ zod로 쿼리 검증 → Rakuten Books API 호출(App ID 서버 보관)
   │ 필드 축소 + `_ex` 재작성 + Cache-Control(CDN) 부여
   ▼ ProviderListing 형태로 응답 → 브라우저 Dexie providerCache(TTL)
```

Slice 4의 G2 하니스는 제품 런타임과 분리된 로컬 정적 흐름이다.

```text
[로컬 G2 하니스 — 배포하지 않음]
participantId + ExperimentProfileV1 JSON
   │ /human/ 또는 /synthetic-pilot/에서 strict 검증(G2 positive anchor 6~10)
   ▼
순수 G2 모듈: 결정론적 holdout → 동일 post-holdout input
   ├→ Taste native Top 10 + contribution 기반 설명
   └→ Baseline native Top 10 + contribution 기반 설명
   │ 결정론적 A/B slot 배치
   ▼
client wizard: pre 설문 → 값 고정 → after 설문 → final/debrief
   ▼ 브라우저가 canonical G2ResultV1 JSON 다운로드
data/local/g2-results/*.json
   │ scripts/aggregate-g2.ts가 catalog/context와 전 항목 재계산
   ▼
deterministic Markdown 집계 리포트(stdout 또는 reports/local/)
```

### 변환 소유권

| 데이터 | 원천 | 변환 | 소유 계층 | 저장 |
|---|---|---|---|---|
| Work Taste Metadata | 사람 주석(CSV) | CSV→zod 검증→JSON | 빌드 스크립트 | 번들(정적) |
| ProviderListing | Rakuten API | 필드 축소·URL 재작성 | Route Handler | Dexie providerCache (TTL: 가격·재고 24h / 기타 72h*) |
| 사용자 프로필·기록 | 사용자 입력 | UI 이벤트→도메인 타입 | features 계층 | Dexie (영구) |
| 추천 결과 | 엔진 계산 | catalog×프로필→순위+기여도 | domain/recommendation (순수) | Dexie recommendationCache (입력 해시 키) |
| 설명 문장 | 추천 contributions | 기여도→템플릿 문장 | domain/explanation (순수) | 저장 안 함(파생) |
| G2 결과 | 가명 ID+로컬 profile+설문 응답 | holdout·A/B·strict result 검증 | domain G2 모듈(순수)+로컬 하니스 | 브라우저 JSON 다운로드만 |
| G2 집계 | G2 result+동결 catalog/context | 결과 전 항목 재계산→지표·verdict | domain G2 모듈(순수)+scripts I/O | stdout 또는 gitignore된 로컬 리포트 |

\* 라쿠텐 약관상 상한은 3개월이지만 신선도를 위해 72h로 운용.

### 2.1 Catalog 빌드 파이프라인 상세 (normalize-works)

**제목 정규화 규칙** (검색 인덱스·그룹핑·external entry 키가 공유):

```text
Unicode NFKC → 히라가나·가타카나 통합 필드 생성 → 전각/반각 통합
→ 공백·중점(・) 정규화 → 영문 소문자화
→ 권수·판형 토큰 제거: 권수 숫자 / 上·下 / 完全版 / 新装版 / 文庫版 / 特装版 / 限定版 / 電子版 / セット
```

**Work 자동 그룹핑 (빌드 타임 전용):** Rakuten `seriesName`은 선택 필드이므로 단독 기준으로 쓰지 않는다.

```ts
groupingScore =
  seriesNameMatch      * 0.40 +   // 정규화된 seriesName 일치
  normalizedTitleMatch * 0.25 +   // 권수·판형 제거 제목 일치
  authorMatch          * 0.15 +
  publisherMatch       * 0.10 +
  volumeSequenceMatch  * 0.10;    // 연속 권 번호
```

판정: `≥ 0.90` 자동 그룹 후보 / `0.70~0.89` 수동 검토 / `< 0.70` 별도 Work 유지. 자동 결과에는 항상 `groupingConfidence`와 검수 여부를 기록하고, 경계 사례는 사람이 최종 승인한다. **런타임에는 이 그룹핑을 수행하지 않는다** — 런타임 라쿠텐 검색 결과는 ISBN→Catalog 대조 또는 external entry로만 처리한다(§`03` 7).

## 3. 클라이언트/서버 경계 (선언)

1. **모든 페이지는 정적 프리렌더 셸이다.** 각 `page.tsx`는 메타데이터와 레이아웃만 서버에서 결정하고, 본문은 `"use client"` 컴포넌트다. 동적 SSR·서버 액션·RSC 데이터 페칭을 사용하지 않는다.
2. **서버 코드는 `/api/rakuten/*` Route Handler 단 둘(search, item)이다.** 이유: App ID·Access Key 은닉 + CDN 캐시 부여. 그 외 서버 로직 추가 금지.
3. **추천 엔진·설명 엔진은 순수·결정론 함수다.** `Date.now()`·난수·I/O 접근 금지. 시간 의존 값(예: TTL 판정)은 인자로 주입. 동일 입력 → 동일 출력을 단위 테스트로 강제.
4. Dexie 접근은 `infrastructure/db` 모듈을 통해서만. 컴포넌트가 Dexie를 직접 import하지 않는다(`useLiveQuery` 훅 래퍼 경유).
5. **G2 하니스는 별도 `harness/` Next static export다.** 제품 `src/app`에 route를 추가하지 않고 `/human/`·`/synthetic-pilot/` 두 정적 진입점만 제공한다. API·Route Handler·server action·동적 SSR·DB·브라우저 storage·auth·analytics·network·비밀키를 사용하지 않으며, wizard draft는 React state에만 있어 새로고침·종료 시 소실된다.

## 4. Route Handler 계약

```text
GET /api/rakuten/search?title=...        → { items: ProviderSearchItem[] }
GET /api/rakuten/item?isbn=...           → { listing: ProviderListing }
```

- 응답 헤더: `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800` (Netlify CDN 캐시로 라쿠텐 호출 절감).
- 라쿠텐 응답에서 필요한 필드만 추출(§`02` 5). `largeImageUrl`의 `_ex=200x200`를 요청 프리셋(200/400/600)으로 재작성해 `imageUrl` 필드로 반환. 클라이언트 `CoverImage`는 로드 실패 시 200x200 폴백.
- 실패 처리: 라쿠텐 4xx/5xx·타임아웃(5s) → `502 { error: "provider_unavailable" }`. 클라이언트는 placeholder 폴백(`03` 각 화면). 재시도는 사용자 액션으로만(자동 재시도 없음).
- 요청 검증: title 1~100자 / isbn 형식. 미통과 400. (공개 프록시 남용 방지 겸)

## 5. 소스 구조

```text
src/
├─ app/
│  ├─ page.tsx  onboarding/  taste/  recommendations/
│  ├─ works/[workId]/  library/  settings/
│  ├─ api/rakuten/search/route.ts  api/rakuten/item/route.ts
│  ├─ layout.tsx  manifest.ts  globals.css(토큰)
├─ components/            # ui/(shadcn) cover/ feedback/ nav/
├─ features/              # onboarding/ taste/ recommendations/ work-detail/ library/ settings/
│                         # (화면 상태·Dexie 연결·이벤트 → 도메인 호출)
├─ domain/                # 순수 로직. React·Dexie import 금지 (lint로 강제)
│  ├─ catalog/            # 타입, zod 스키마, 정규화(NFKC·가나·권수 제거)
│  ├─ recommendation/     # similarity / coverage / anchor / penalty / rank / baseline
│  ├─ explanation/        # contribution 선택 + 주입 lexicon → 일본어 템플릿 문장
│  ├─ profile/            # DNA 요약, explicitAdjustment, confidence
│  └─ g2.ts               # holdout/slot/result schema/metric의 단일 순수 모듈
├─ infrastructure/
│  ├─ db/                 # Dexie 스키마, 훅 래퍼, export/import
│  └─ rakuten/            # 클라이언트 fetch 래퍼, providerCache TTL
├─ lib/strings.ts         # 일본어 UI 문자열 중앙 테이블
└─ data/generated/
   ├─ catalog-v1.json
   └─ recommendation-context-v1.json

data/source/  (works.csv factors.csv themes.csv aliases.csv volumes.csv
               recommendation-context.csv recommendation-config.csv evidence/)
data/generated/
scripts/      (sync-rakuten.ts normalize-works.ts validate-catalog.ts
               build-catalog.ts report-coverage.ts run-baseline-experiment.ts
               aggregate-g2.ts)
docs/factors/ (factor-dictionary.md annotation-guide.md)
harness/      (별도 Next static export — /human/ /synthetic-pilot/, 배포 제외)
```

의존 방향(ESLint `import/no-restricted-paths`로 강제): `app → features → domain` / `features → infrastructure` / **domain은 어떤 계층도 import하지 않음** / scripts와 harness는 domain·data만 import. 예외는 읽기 전용 일본어 lexicon 주입뿐이다. `scripts/run-baseline-experiment.ts → src/lib/strings.ts`와 `harness → src/lib/strings.ts`를 허용하되, harness의 다른 `src/lib/**` import는 금지한다.

### 5.1 G2 로컬 하니스 경계

#### 진입점과 실행 상태

- `/human/`은 result에 정확히 `{ kind: "human" }`, `/synthetic-pilot/`은 정확히 `{ kind: "syntheticPilot", label: "manual-round-trip" }`을 기록한다. respondent는 wizard 시작 전에 route로 고정하며 query/hash·숨은 control·환경값·파일 내용으로 바꾸지 않는다.
- 첫 단계 입력은 가명 `participantId`와 로컬 `ExperimentProfileV1` JSON 한 개뿐이다. `profileId === participantId`, slug 형식, catalog 결합, policy=false, distinct negative source 0~3과 G2 positive anchor 6~10을 검증한다. 기존 Slice 3의 5~10 profile schema는 변경하지 않고 G2 wrapper가 강화한다.
- 프로필 작성 UI, 계정·이메일·비밀번호·Google 로그인·서버 저장은 없다. 표시명·실명·이메일·자유서술도 result와 DOM에 저장하지 않는다.

#### 순수 계산과 블라인딩

- 단일 G2 domain 모듈이 UTF-8 SHA-256과 code-unit 정렬을 입력받아 holdout, A/B slot, strict result schema, cross-field 검증, 지표와 verdict를 소유한다. SHA-256과 파일 I/O는 Web Crypto 또는 Node `crypto`를 쓰는 경계에서 주입하며 domain은 시간·난수·I/O를 직접 사용하지 않는다.
- positive anchor 6개면 1개, 7~10개면 2개를 결정론적으로 holdout해 두 엔진 records에서 같은 record 전체를 제거한다. 두 엔진은 같은 catalog/context와 post-holdout profile로 각각 정확히 한 번 실행한다.
- 각 엔진의 native rank 1~10을 그대로 보존한다. 두 리스트를 union·dedupe·재정렬·interleave·백필하지 않으며 overlap work는 양쪽 native rank에 각각 남긴다. A/B slot도 catalogVersion+participantId의 동결된 SHA-256 계약으로 결정한다.
- pre 단계에는 title·cover·native rank와 familiarity/Want-to-Read/list preference만 보이고, 응답 확정 뒤에는 수정할 수 없다. after 단계는 같은 occurrence에 contribution 기반 설명과 after Want-to-Read/Agreement를 더한다. final submit 전에는 engine·score·confidence·anchor·contribution·penalty·market·maturity·catalog role을 visible/accessibility/DOM metadata/URL/console/download에 노출하지 않는다. final 뒤에만 mapping을 debrief하고 result를 다운로드한다.

#### 파일 경계와 authoritative readback

- `G2ResultV1`은 participant/respondent/catalog identity, embedded profile, ordered holdout IDs, A/B native rank·workId·설명 유무, distinct-work pre 응답, list preference, occurrence별 post 응답만 가진 strict object다. 설명 text·점수·contribution·개인정보는 저장하지 않는다.
- result는 1 MiB 이하 regular file, fatal UTF-8, BOM 없음, LF only이며 `JSON.stringify(validatedValue, null, 2) + "\n"`와 byte-identical해야 한다. key reorder, duplicate member, extra field/whitespace, CRLF는 거부한다.
- aggregator는 result의 파생값을 신뢰하지 않는다. 동결 catalog/context와 embedded profile로 holdout, post-holdout records, 두 native list, slot, rank/work, explanation availability, required 응답 key·순서와 agreement null 규칙을 모두 재계산하고 하나라도 다르면 파일 전체를 거부한다. 한 집계의 participantId와 input path/identity도 중복될 수 없다.
- 브라우저는 파일을 다운로드만 한다. 운영자는 이를 gitignore된 `data/local/g2-results/`에 두고 다음 CLI로 authoritative Markdown을 만든다.

```text
pnpm --silent g2:aggregate
  --result, -r <json>   # 반복 가능; 미지정 시 data/local/g2-results/*.json
  --catalog <json>      # 기본 data/generated/catalog-v1.json
  --context <json>      # 기본 data/generated/recommendation-context-v1.json
  --output, -o <md|->   # 기본 stdout
  --help, -h
```

- 성공 0, data/runtime error 1, usage error 2다. stdout은 deterministic Markdown만, 진단은 stderr만 사용한다. output 파일은 모든 input과 다른 private sibling temp에 완성한 뒤 atomic rename하며 실패 시 기존 output을 보존한다.
- 집계는 valid human만 GO 분자·분모에 포함한다. 정확히 10개의 고유하고 완전한 human result가 아니면 human verdict는 `INCOMPLETE`다. `syntheticPilot`은 실제 browser→download→CLI round-trip 진단에만 포함하고 human metric이나 GO/REVISE에 넣지 않는다.

## 6. 영속성 (Dexie 스키마 v1)

```ts
db.version(1).stores({
  userWorks:      "workId, readingState, updatedAt",   // UserWorkRecord
  externalWorks:  "id, updatedAt",                     // ExternalWorkRecord
  profile:        "key",                               // 단일 행들: adjustments, policies, onboardingCompletedAt
  onboardingDraft:"id",                                // 단일 행 (id="current")
  recommendationCache: "inputHash",                    // { inputHash, rankedIds, contributions, computedAt }
  providerCache:  "isbn, expiresAt",                   // ProviderListing
  meta:           "key",                               // schemaVersion, catalogVersion
});
```

- **로컬 상태 vs 영속 상태:** 위 테이블이 영속의 전부다. 열림/선택/입력 중 텍스트 등 UI 일시 상태는 React state. URL이 표현 가능한 상태(탭, reveal 모드)는 URL이 소유.
- `inputHash` = `hash(catalogVersion + 정렬된 anchor·reaction + 부정 항목·이유 + adjustments + policies + 제외 workId 목록)`. 추천 재계산 판정의 단일 기준(`03` §5).
- 마이그레이션: Dexie version() 체인 사용. 파괴적 변경 시 meta.schemaVersion 확인 후 변환.

## 7. Export / Import (v1 계약)

```ts
type ExportFileV1 = {
  format: "konocomics-export";
  schemaVersion: 1;
  exportedAt: string;          // ISO 8601
  catalogVersion: string;
  userWorks: UserWorkRecord[];
  externalWorks: ExternalWorkRecord[];
  profile: { adjustments: ...; policies: ...; onboardingCompletedAt: string };
};
```

- Import 절차: zod 파싱 → `schemaVersion > 1`이면 거부(업데이트 안내) → 미리보기 표시 → 확인 시 **Dexie 트랜잭션으로 전체 대체**(병합 아님 — v1은 대체만 지원). 실패 시 롤백, 기존 데이터 불변.
- catalogVersion 불일치: 경고만(존재하지 않는 workId 기록은 보존하되 UI에서 「カタログ外」 처리).

## 8. PWA 경계

- MVP: `app/manifest.ts`(이름·아이콘·`start_url: "/"`·`display: standalone`) + 설치 가능성. 오프라인은 Dexie 데이터의 자연 오프라인성에 의존.
- 폴리시 슬라이스: Serwist 도입 — precache(앱 셸·catalog JSON) + 표지 이미지 runtime cache(cache-first, 7일, 최대 300항목) + `/api/rakuten/*`는 network-only. 오프라인 폴백 페이지 1개.
- `start_url`은 `/` 유지(랜딩의 리다이렉트 로직이 온보딩 여부 분기 담당).

## 9. 실패 동작 요약

| 실패 | 동작 |
|---|---|
| Catalog JSON 파싱·검증 실패 | 치명 오류 화면(재시도). 빌드에서 발생 시 배포 차단(`catalog:validate`가 CI 게이트) |
| Rakuten API 실패 | 표지 placeholder / 가격·재고 숨김 / 검색은 로컬 전용 안내. 추천·DNA·Library 무영향 |
| IndexedDB 사용 불가(프라이빗 모드 등) | 최초 진입 시 감지 → 「このブラウザではデータを保存できません」 경고 배너 + 세션 메모리 폴백(새로고침 시 소실 명시) |
| Import 파일 손상 | 구체 오류 표시, 데이터 불변 |
| 추천 후보 소진 | 빈 상태 + 개선 안내(`03` §5) |

## 10. 국제화·분석 준비

- 문자열은 전부 `lib/strings.ts`의 키 참조. Phase 2 한국어는 이 테이블의 교체로 시작(라이브러리 도입은 그때 판단).
- 분석: MVP 코드 없음. 공개 베타 이후 도입 시(후보: PostHog) 이벤트는 아래 최소 목록으로 시작하고, **Taste Vector 원본·Library 전체·민감한 부정 이유는 절대 전송하지 않는다**:

```text
onboarding_started / work_selected / onboarding_completed / taste_revealed /
recommendation_impression / recommendation_saved / recommendation_hidden /
recommendation_already_read / provider_clicked / data_exported
```
