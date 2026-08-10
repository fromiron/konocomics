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

### 변환 소유권

| 데이터 | 원천 | 변환 | 소유 계층 | 저장 |
|---|---|---|---|---|
| Work Taste Metadata | 사람 주석(CSV) | CSV→zod 검증→JSON | 빌드 스크립트 | 번들(정적) |
| ProviderListing | Rakuten API | 필드 축소·URL 재작성 | Route Handler | Dexie providerCache (TTL: 가격·재고 24h / 기타 72h*) |
| 사용자 프로필·기록 | 사용자 입력 | UI 이벤트→도메인 타입 | features 계층 | Dexie (영구) |
| 추천 결과 | 엔진 계산 | catalog×프로필→순위+기여도 | domain/recommendation (순수) | Dexie recommendationCache (입력 해시 키) |
| 설명 문장 | 추천 contributions | 기여도→템플릿 문장 | domain/explanation (순수) | 저장 안 함(파생) |

\* 라쿠텐 약관상 상한은 3개월이지만 신선도를 위해 72h로 운용.

## 3. 클라이언트/서버 경계 (선언)

1. **모든 페이지는 정적 프리렌더 셸이다.** 각 `page.tsx`는 메타데이터와 레이아웃만 서버에서 결정하고, 본문은 `"use client"` 컴포넌트다. 동적 SSR·서버 액션·RSC 데이터 페칭을 사용하지 않는다.
2. **서버 코드는 `/api/rakuten/*` Route Handler 단 둘(search, item)이다.** 이유: App ID·Access Key 은닉 + CDN 캐시 부여. 그 외 서버 로직 추가 금지.
3. **추천 엔진·설명 엔진은 순수·결정론 함수다.** `Date.now()`·난수·I/O 접근 금지. 시간 의존 값(예: TTL 판정)은 인자로 주입. 동일 입력 → 동일 출력을 단위 테스트로 강제.
4. Dexie 접근은 `infrastructure/db` 모듈을 통해서만. 컴포넌트가 Dexie를 직접 import하지 않는다(`useLiveQuery` 훅 래퍼 경유).

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
│  ├─ recommendation/     # similarity / coverage / anchor / penalty / rank
│  ├─ explanation/        # contributions → 일본어 템플릿 문장
│  └─ profile/            # DNA 요약, explicitAdjustment, confidence
├─ infrastructure/
│  ├─ db/                 # Dexie 스키마, 훅 래퍼, export/import
│  └─ rakuten/            # 클라이언트 fetch 래퍼, providerCache TTL
├─ lib/strings.ts         # 일본어 UI 문자열 중앙 테이블
└─ data/generated/catalog-v1.json

data/source/  (works.csv factors.csv themes.csv aliases.csv volumes.csv evidence/)
data/generated/
scripts/      (sync-rakuten.ts normalize-works.ts validate-catalog.ts
               build-catalog.ts report-coverage.ts run-baseline-experiment.ts)
docs/factors/ (factor-dictionary.md annotation-guide.md)
harness/      (블라인드 테스트 로컬 하니스 — 배포 제외)
```

의존 방향(ESLint `import/no-restricted-paths`로 강제): `app → features → domain` / `features → infrastructure` / **domain은 어떤 계층도 import하지 않음** / scripts와 harness는 domain·data만 import.

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
- 분석: MVP 코드 없음. 도입 시 이벤트 이름은 원본 계획 §37 목록을 따르고, Taste 원본·Library 전체를 전송하지 않는다는 원칙만 상속.
