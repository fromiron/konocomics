# 05 — 아키텍처 (Architecture)

> 검증된 MVP를 위한 최소 완결 아키텍처. Framework/Router의 세부 계약은 `08-tanstack-start-migration.md`가 우선하며, 이 문서는 데이터의 생성·변환·저장 소유권을 정의한다.

---

## 1. 기술 스택 (확정)

| 역할 | 선택 | 존재 이유 |
|---|---|---|
| Framework | **TanStack Start + TanStack Router** | typed route contract, 선택적 SSR/client boundary, 두 server route. 상세 계약은 `08` |
| Language | TypeScript strict | 산식·스키마 타입 안정성 |
| Styling | Tailwind CSS v4 | 토큰(`04` §2)을 `@theme`으로 정의 |
| UI Primitive | shadcn CLI의 Base UI 기반 primitive + design-system wrapper | 필요한 primitive만 `components/ui`에 생성하고 tokenized wrapper로 제품 API 제공 |
| Animation | Motion (LazyMotion) | `04` §7. 유일한 애니메이션 의존성 |
| Validation | Zod v4 | Catalog·API 응답·Import 전 경계 검증 |
| Local DB | Dexie + dexie-react-hooks | IndexedDB + `useLiveQuery` 반응성 |
| Local Search | Fuse.js | Catalog 검색(온보딩·Library) |
| Catalog Build | tsx + csv-parse | CSV→zod→JSON 파이프라인 |
| Catalog Shadow | Node 24 `node:sqlite` | OS 임시 import/export parity gate. 제품 build 입력이 아님. `09` 참조 |
| Test | Vitest / Testing Library / Playwright | `07` 참조 |
| Hosting | Vercel Git Integration + TanStack Start Nitro output | `main` Production + 브랜치·PR별 Preview 배포 |
| PWA | manifest 우선, service worker adapter는 framework migration 뒤 별도 결정 | 현재 local-first·offline 경계를 보존하고 Next 전용 adapter를 이식하지 않음 |

**의도적으로 없는 것:** TanStack Query(단일 프록시 + 기존 provider cache로 충분) / Zustand(지속=Dexie, 일시=React state) / 제품 runtime·서버 DB·Auth / i18n 라이브러리(중앙 문자열 테이블) / 분석 SDK / React Bits·Embla·Swiper·NumberFlow·AutoAnimate(`01` V2~V6) / theme switcher / NDL 연동(DEFER). `09`의 SQLite는 OS 임시 디렉터리에서만 쓰는 빌드 타임 shadow다.

### 1.1 Vercel 배포 계약

이 절은 **별도 사용자 승인을 받은 릴리스/배포 단계**의 목표 계약이다. Slice 10의 로컬 구현·build·Playwright 완료와 GitHub/Vercel 연결·Preview·Production mutation은 서로 다른 증거이며, 현재는 후자를 실행하도록 승인되지 않았다.

- GitHub 저장소를 Vercel Project에 연결한다. Production Branch는 `main`이고, 그 외 브랜치와 PR은 고유 Preview Deployment를 만든다.
- `main` 보호 규칙에서 GitHub `CI / quality` check 성공을 병합 필수 조건으로 둔다. 이 workflow의 format·typecheck·lint·unit test·catalog validate·generated-currentness·production build·G2 harness build가 실패한 커밋은 Vercel Production 대상이 될 수 없다.
- Vercel Project Settings에서 같은 GitHub `quality` job을 Production의 **필수 Deployment Check**로 선택한다. Production build가 성공해도 이 check 전에는 production domain을 alias하지 않으며, `Force Promote`는 사용자가 명시적으로 승인한 긴급 릴리스에서만 사용한다.
- Vercel Production Build Command는 `pnpm catalog:validate && pnpm build`로 고정한다. Preview 성공만으로 GitHub 품질 게이트 통과나 Production 승격을 대체하지 않는다.
- `RAKUTEN_APPLICATION_ID`·`RAKUTEN_ACCESS_KEY`와 선택적 `RAKUTEN_AFFILIATE_ID`, 앱 등록의 허용 도메인과 일치하는 `RAKUTEN_ALLOWED_ORIGIN`은 Vercel Project Settings의 Environment Variables에만 저장하고 Preview/Production 범위를 명시한다. 저장소·클라이언트 번들·배포 로그에 값을 출력하지 않는다.
- Vercel Hobby는 공식 정책상 개인·비상업 용도로 제한된다. 개발·비상업 Preview에는 사용할 수 있지만, 공개 운영 성격이 이를 벗어나면 Production 공개 전에 Pro 이상을 선택한다. 요금제 선택은 호스팅 플랫폼 결정을 다시 여는 것이 아니다.
- 커스텀 도메인은 상표·도메인 확인 뒤 연결한다. 도메인 미확정은 Vercel 제공 Preview/Production URL을 이용한 구현·검증을 막지 않는다.
- G2 하니스는 계속 로컬 전용이며 Vercel Project에 포함하거나 별도 배포하지 않는다.

검증 기준(2026-08-13): [Vercel Git 배포](https://vercel.com/docs/git), [Vercel Deployment Checks](https://vercel.com/docs/deployment-checks), [Vercel Hobby 정책](https://vercel.com/docs/plans/hobby), [Vercel CDN Cache-Control](https://vercel.com/docs/caching/cache-control-headers).

Rakuten 계약 검토일(2026-08-14): [Rakuten Books Book Search API 2017-04-04](https://webservice.rakuten.co.jp/documentation/books-book-search). 현재 공식 계약은 App ID와 Access Key를 함께 요구하며 Access Key는 request header로 전달한다. Affiliate ID는 설정된 경우에만 query에 넣는다.

## 2. 데이터 흐름 전체도

```text
[빌드 타임 - 제품]                       [런타임 - 브라우저]
data/source/** (S0~S5 권한 원천)          root: catalogVersion+전체 workIds+profileWorkIds만 직렬화
   │  scripts/normalize-works.ts             ├→ landing: 소형 showcase projection
   │  scripts/validate-catalog.ts            ├→ route-scoped bundled Catalog: 온보딩·DNA·Library·Catalog 상세
   │  scripts/build-catalog.ts               └→ /recommendations: content-addressed public Catalog fetch
   │  scripts/build-catalog.ts                  (`/catalog/catalog-v1.<catalogVersion>.json`)
   ▼                                            strict zod+exact identity 확인 뒤
data/generated/catalog-v1.json                  Recommendation Engine (순수 함수)
   ├→ src/data/generated/catalog-v1.json        입력: catalog + Dexie 스냅샷(프로필·기록)
   └→ public/catalog/catalog-v1.<version>.json  출력: RankedRecommendation[] (contributions 포함)
   (세 Catalog artifact는 byte-identical)       ▼
   ├→ src/data/generated/catalog-identity-v1.json
   └→ src/data/generated/landing-v1.json
   └→ data/generated/recommendation-profile-{catalog,context}-v1.json
      (recommendationEligible 작품만의 공동 digest; G1/G2 회귀 입력)
                                         Dexie (IndexedDB)
                                           userWorks / externalWorks / profile /
                                           onboardingDraft / recommendationCache / meta

[빌드 타임 - 병렬 shadow gate, 제품 build 입력 아님]
data/source/** → OS 임시 SQLite → 격리 export → 기존 loader/validator/builder parity → 폐기
                 (`catalog:shadow`; source를 덮어쓰지 않음)
[런타임 - TanStack Start server route(유일)]
/api/rakuten/search|item  ← 브라우저 fetch
   │ zod로 쿼리 검증 → Rakuten Books API 호출(App ID·Access Key 서버 보관)
   │ 필드 축소 + `_ex` 재작성 + Cache-Control(CDN) 부여
   ▼ RakutenBookItem 축소 DTO
      ├→ Catalog ISBN match → bundled workId
      └→ no match → 브라우저가 external v1 identity를 결정론적으로 파생 → Dexie externalWorks
      브라우저가 workId·시간을 결합 → Dexie providerCache(TTL)
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
| Work metadata | `data/source/`의 권한 사실과 legacy snapshot | CSV→zod 검증→byte-identical bundled/public JSON + 소형 identity/landing projection | 빌드 스크립트 | route-scoped 번들 + content-addressed 정적 자산 |
| Model candidate | source 밖 격리 artifact | 진단만; resolution·promotion 입력에서 제외 | 로컬 authoring 도구 | runtime·source에 저장 안 함 |
| Legacy resolution | 고정 cutoff source manifest | Factor·present Theme·present Genre만 canonical 8-field tuple로 bootstrap | build-time SQLite shadow | OS 임시 `fact_resolution`; digest 재계산 후 폐기 |
| ProviderListing | Rakuten API | 필드 축소·URL 재작성·브라우저 workId 결합·normalized ISBN in-flight 합류 | Start server route + infrastructure/rakuten | Dexie providerCache (가격·재고 24h / 기타 90일) |
| 사용자 프로필·기록 | 사용자 입력 | UI 이벤트→도메인 타입 | features 계층 | Dexie (영구) |
| External 작품 | Rakuten 축소 DTO | ISBN 대조→v1 canonical key/hash identity→원자적 insert/readback | domain/catalog + infrastructure/db | Dexie externalWorks |
| 추천 결과 | 엔진 계산 | catalog×프로필→순위+기여도 | domain/recommendation (순수) | Dexie recommendationCache (입력 해시 키) |
| 설명 문장 | 추천 contributions | 기여도→템플릿 문장 | domain/explanation (순수) | 저장 안 함(파생) |
| G2 결과 | 가명 ID+로컬 profile+설문 응답 | holdout·A/B·strict result 검증 | domain G2 모듈(순수)+로컬 하니스 | 브라우저 JSON 다운로드만 |
| G2 집계 | G2 result+동결 catalog/context | 결과 전 항목 재계산→지표·verdict | domain G2 모듈(순수)+scripts I/O | stdout 또는 gitignore된 로컬 리포트 |

90일은 `02`의 기타 metadata 3개월을 시간 주입으로 결정론적으로 검사하기 위한 v1 고정값이다. 가격·재고가 만료되면 화면에서 숨긴다. metadata 만료는 사용자 액션/화면 진입에서 단 한 번의 갱신을 시도하는 경계이며, 실패하면 `03` 계약대로 기존 `itemUrl`만 stale purchase fallback으로 유지하고 만료된 소개·이미지·리뷰는 표시하지 않는다.

### 2.1 Catalog 빌드 파이프라인 상세 (normalize-works)

**제목 정규화 규칙** (검색 인덱스·그룹핑과 version-frozen external title v1이 공유):

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

`normalizeExternalTitleV1`은 위 NFKC·폭·가나·locale-independent lowercase·Unicode 공백/중점(`[・･·]`; U+0387은 NFKC 후 `·`)·권수/판형 제거 결과를 고정하고, `normalizeExternalCreatorV1`은 같은 규칙에서 권수/판형 제거만 생략하며 첫 creator 순서를 유지한다. title은 가나 통합을 먼저 적용하므로 `セット`와 `せっと`가 같은 edition token으로 제거된다. v1 edition 목록은 현재 grouping regex와 동일하게 인접 문자열 안의 exact listed substring도 제거하고 나머지는 보존한다(`完全版画集→画集`, `セットアップ→あっぷ`); 목록에 없는 부분 문자열은 제거하지 않는다. 두 결과의 빈 문자열은 거부한다. `normalizedKey = JSON.stringify([titleV1, creatorV1])`, digest input은 UTF-8 `konocomics-external-work-id-v1\0rakuten\0${normalizedKey}`, ID는 full lowercase SHA-256을 붙인 `ext:rakuten:v1:<64hex>`다. token boundary·가나·중점 변형·UTF-8 digest golden을 고정하며 규칙 수정은 기존 v1을 바꾸지 않고 새 identity version을 발급한다.

## 3. Router·클라이언트/서버 경계 (선언)

1. TanStack Router는 pathname/path params, Zod search params, loader data, route boundary와 metadata만 소유한다. Dexie 사용자 상태, 추천 결과/policy/cache, form·animation·scroll·mutation state는 소유하지 않는다(`08` §1~2).
2. `/`는 공개 prerender shell, `/works/$workId`는 bundled Catalog ID만 prerender한다. `/onboarding`·`/taste`·`/recommendations`·`/library`·`/settings`는 `ssr: false` route 또는 client boundary이고 `/works/external`은 고정 static shell + hydration 뒤 IndexedDB lookup이다.
3. shared root document는 server-safe하게 유지한다. persistence provider는 server render 중 memory 상태만 만들고 hydration effect에서만 Dexie backend를 생성·연다. Dexie profile guard를 server loader/`beforeLoad`에서 실행하지 않는다. Router context는 repository/client/config dependency injection에만 쓰며 mutable UI·사용자 state를 넣지 않는다.
4. **서버 코드는 `/api/rakuten/*` Start server route 단 둘(search, item)이다.** App ID·Access Key 은닉과 CDN cache를 위한 경계이며 임의 server function·새 server route를 추가하지 않는다.
5. **추천 엔진·설명 엔진은 순수·결정론 함수다.** `Date.now()`·난수·I/O 접근 금지. 시간 의존 값(예: TTL 판정)은 인자로 주입. 동일 입력 → 동일 출력을 단위 테스트로 강제한다.
6. Dexie 접근은 `infrastructure/db` 모듈을 통해서만 한다. 컴포넌트가 Dexie를 직접 import하지 않는다(`useLiveQuery` 훅 래퍼 경유).
7. **G2 하니스는 제품 runtime과 분리된 기존 `harness/` 정적 export다.** `/human/`·`/synthetic-pilot/`만 제공하고 API·DB·browser storage·auth·analytics·network·비밀키를 사용하지 않는다. 제품 M9에서 Next dependency를 제거할 때도 별도 workspace dependency로 격리한다.
8. `/works/external`의 server shell은 query나 local record를 읽지 않는다. hydration 뒤 client feature가 typed `workId`를 strict parse하고 IndexedDB를 읽는다. `/works/$workId`의 bundled ID와 unknown not-found 경계를 유지한다.
9. `/`의 hydration guard는 현재 Catalog positive anchor가 5개 이상이면 콘텐츠 플래시 없이 `/recommendations`로 이동한다. `?landing=1`은 redirect만 우회하며 storage·profile·draft·cache·session reveal state를 쓰지 않는다.

## 4. Start server route 계약

```text
GET /api/rakuten/search?title=...        → { items: RakutenBookItem[] }
GET /api/rakuten/item?isbn=...           → { listing: RakutenBookItem }
```

- 응답 헤더: `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800` (Vercel CDN 캐시로 라쿠텐 호출 절감). 응답은 사용자별 정보가 없는 공용 Rakuten 축소 응답만 담는다.
- Catalog 대표권이 품절이어도 메타데이터를 조회할 수 있도록 `outOfStockFlag=1`을 고정한다. 공급자의 현재 `Items`와 이전 `items` envelope를 모두 경계에서 정규화하고, 빈 availability는 미확인으로 보존하며 숫자 문자열 reviewAverage는 검증 후 number로 변환한다.
- 라쿠텐 응답에서 필요한 필드만 추출(§`02` 5). `largeImageUrl`은 `_ex=600x600`으로 정규화해 `imageUrl`로 반환하고, 클라이언트 `CoverImage`가 같은 원본 URL에서 200/400/600 preset을 파생한다. 600 로드 실패 시 같은 URL의 200x200으로 폴백한다.
- 실패 처리: 라쿠텐 4xx/5xx·타임아웃(5s) → `502 { error: "provider_unavailable" }`. 클라이언트는 placeholder 폴백(`03` 각 화면). 재시도는 사용자 액션으로만(자동 재시도 없음).
- 요청 간격: 공통 Rakuten 클라이언트 큐의 1초 간격은 개발 중 provider 보호용으로 development에서만 적용한다. production/test에는 강제 지연하지 않는다. 동일 ISBN의 동시 요청은 기존 in-flight 합류를 우선하며 짧은 placeholder 노출은 허용한다.
- 요청 검증: title 1~100자 / isbn 형식. 미통과 400. (공개 프록시 남용 방지 겸)

## 5. 소스 구조

```text
src/
├─ routes/
│  ├─ __root.tsx  index.tsx  onboarding.tsx  taste.tsx  recommendations.tsx
│  ├─ works/$workId.tsx  works/external.tsx  library.tsx  settings.tsx
│  └─ api/rakuten/search.ts  api/rakuten/item.ts
├─ styles/globals.css     # dark-only semantic token
├─ components/
│  ├─ ui/                 # shadcn CLI가 생성한 Base UI primitive
│  └─ design-system/      # primitive를 감싸 token·size·focus contract 제공
├─ features/              # onboarding/ taste/ recommendations/ work-detail/ library/ settings/
│                         # (화면 상태·Dexie 연결·이벤트 → 도메인 호출)
├─ domain/                # 순수 로직. React·Dexie import 금지 (lint로 강제)
│  ├─ catalog/            # 타입, zod 스키마, 정규화 + external v1 canonical key/hash input
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
  recommendation-profile-{catalog,context}-v1.json
public/catalog/catalog-v1.<catalogVersion>.json
scripts/      (normalize-works.ts validate-catalog.ts
               build-catalog.ts report-coverage.ts run-baseline-experiment.ts
               aggregate-g2.ts)
docs/factors/ (factor-dictionary.md annotation-guide.md)
harness/      (제품과 격리된 기존 정적 export — /human/ /synthetic-pilot/, 배포 제외)
```

의존 방향(ESLint `import/no-restricted-paths`로 강제): `routes → features → domain` / `features → infrastructure` / **domain은 어떤 계층도 import하지 않음** / scripts와 harness는 domain·data만 import. External canonical key와 digest input 조립은 pure domain이 소유하고 Web Crypto SHA-256 구현은 브라우저/infrastructure 경계에서 주입한다. 예외는 읽기 전용 일본어 lexicon 주입뿐이다. `scripts/run-baseline-experiment.ts → src/lib/strings.ts`와 `harness → src/lib/strings.ts`를 허용하되, harness의 다른 `src/lib/**` import는 금지한다.

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
  --catalog <json>      # 기본 data/generated/recommendation-profile-catalog-v1.json
  --context <json>      # 기본 data/generated/recommendation-profile-context-v1.json
  --output, -o <md|->   # 기본 stdout
  --help, -h
```

- 성공 0, data/runtime error 1, usage error 2다. stdout은 deterministic Markdown만, 진단은 stderr만 사용한다. output 파일은 모든 input과 다른 private sibling temp에 완성한 뒤 atomic rename하며 실패 시 기존 output을 보존한다.
- 집계는 valid human만 GO 분자·분모에 포함한다. 정확히 10개의 고유하고 완전한 human result가 아니면 human verdict는 `INCOMPLETE`다. `syntheticPilot`은 실제 browser→download→CLI round-trip 진단에만 포함하고 human metric이나 GO/REVISE에 넣지 않는다.

## 6. 영속성 (Dexie 스키마 v1 → v2)

```ts
db.version(1).stores({
  userWorks:      "workId, readingState, updatedAt",   // UserWorkRecord
  externalWorks:  "id, record.updatedAt",              // ExternalWorkRecord
  profile:        "key",                               // 단일 행들: adjustments, policies, onboardingCompletedAt
  onboardingDraft:"id",                                // 단일 행 (id="current")
  recommendationCache: "inputHash",                    // { schemaVersion, engineVersion, inputHash, plan, computedAt }
  providerCache:  "isbn, expiresAt",                   // v1 ProviderListing
  meta:           "key",                               // schemaVersion, catalogVersion
});

db.version(2).stores({
  // 나머지 여섯 store schema는 v1과 동일하다.
  providerCache:  "isbn", // commercialExpiresAt·metadataExpiresAt은 일반 필드
});
```

- v2는 provider cache의 단일 `expiresAt`을 가격·재고 24시간과 기타 metadata 90일로 분리한다. 기존 v1 provider row는 새 strict schema에서 cache miss로 취급하며 프로필·기록·추천 cache를 변경하지 않는다.
- external identity 결정은 store/index 변경이 아니므로 v2에 새 store나 index를 추가하지 않는다. `externalWorks` read/write 경계는 exact supported ID, canonical `normalizedKey`, ID/digest 일치, `record.workId === id`, distinct valid ISBN identity를 모두 검증한다. ISBN-10은 `isbnIdentityKey`로 동등한 ISBN-13에 canonicalize하고 10/13 표현 중복을 거부한다. `userWorks`는 exact `external`과 모든 `ext:` ID를 거부한다.
- Library의 Catalog/external 추가는 각각 단일 transaction의 insert-only + authoritative readback이다. stale tab이 기존 의미 있는 record를 기본 `planned`로 덮지 않는다. 같은 external ID/key가 이미 있으면 기존 서지·사용자 record를 보존하고 incoming ISBN만 distinct union으로 합친 뒤 existing 결과를 반환하며, same-ID/different-key는 전체 write를 거부하고 suffix를 만들지 않는다. 결과를 확정할 수 없는 primary insert는 memory mirror에 재실행하지 않고 `preserved-unknown`을 반환한다.
- external 상태·감상 편집은 `saveExternalUserRecord(id, expectedNormalizedKey, record)`의 update-only transaction을 사용한다. caller는 화면이 읽은 immutable key를 함께 보내고 transaction은 최신 row를 다시 읽어 exact ID/key와 nested `record.workId`를 확인한 뒤 nested user record만 교체하므로, stale UI snapshot이 최신 title·creators·cover·canonical ISBN union을 덮을 수 없다. 대상 row가 없거나 손상되었거나 pre-read 이후 key가 달라지면 insert·repair·re-key 없이 거부한다. primary mutation/readback이 불확실한 실패는 stale mirror에 재실행하지 않는다.
- 저장된 `id + normalizedKey`가 immutable identity다. 표시 title·creators·cover는 identity를 재계산하지 않고 갱신할 수 있다. external 목록은 row별로 독립 검증해 유효 row만 UI/memory mirror에 반영하고, 손상 row 하나를 IndexedDB operation failure로 취급하거나 다른 유효 row를 숨기지 않는다. 손상 raw row는 primary storage에 남겨 ID별 상세 read가 `corrupt`를 반환하게 한다. ID별 authoritative read가 `corrupt`를 확인하면 그 ID의 과거 valid mirror는 즉시 무효화하여 이후 storage failure에서 stale `found`로 부활하지 않게 한다. 상세 read는 `found / missing / corrupt / unavailable`을 구분하고 `inspectExternalWork`는 malformed ID를 자체 enqueue/ID별 DB 조회 전에 거부한다. 전역 provider 초기화는 별개이며 corrupt row는 자동 복구·re-key·provider refresh 대상이 아니다. degraded memory mirror의 부재는 영구 저장소 부재를 증명하지 못하므로 `missing`이 아니라 `unavailable`이고, 이미 검증된 mirror hit만 `found`가 될 수 있다.

- **로컬 상태 vs 영속 상태:** 위 테이블이 영속의 전부다. 열림/선택/입력 중 텍스트 등 UI 일시 상태는 React state. URL이 표현 가능한 상태(탭, reveal 모드)는 URL이 소유.
- `onboardingDraft` readback은 `02` §5.3의 `mode: "firstRun" | "add"` strict union으로 파싱한다. 완료 변환은 시간 값을 인자로 받고 positive/disliked/dropped mapping을 적용하며 domain이 런타임 시계를 직접 읽지 않는다.
- `firstRun` 완료는 신규 `userWorks` insert-only + `profile.onboardingCompletedAt` 최초 기록 + draft 삭제를 한 트랜잭션으로 수행한다. 이미 완료 marker가 있거나 workId가 충돌하면 stale tab으로 간주해 전체를 거부한다. `add` 완료는 신규 workId의 insert-only 추가 + draft 삭제만 한 트랜잭션으로 수행하고 기존 `userWorks`와 최초 `onboardingCompletedAt`을 byte-equivalent로 보존한다. add workId 충돌도 트랜잭션 전체를 롤백한다.
- 추가 모드의 일반 닫기는 draft를 보존한다. 명시적 폐기만 draft 단일 행을 삭제한다. 성공한 추가는 새 anchor가 `inputHash`를 바꾸지만 reveal marker와 최초 완료 시각은 바꾸지 않는다.
- 호환 프로필 resolver는 현재 bundled Catalog 중 `recommendationEligible`인 서로 다른 favorite/liked record 수만 센다. `libraryOnly` 기록은 보존·표시하지만 프로필·DNA·입력 hash의 record payload·추천에는 쓰지 않는다. 전체 `catalogVersion` 변경은 추천 캐시를 한 번 무효화한다. 5개 이상이면 `profile.onboardingCompletedAt` 유무와 무관하게 usable profile, 5개 미만+marker 존재면 `add` recovery, 5개 미만+marker `null`이면 `firstRun`이다. recovery path는 first-run 트랜잭션을 다시 호출하지 않고 insert-only 추가만 허용한다.
- recommendation cache의 `plan`은 점수 재계산 없는 백필을 위해 전체 정렬 후보를 보존한다. 각 항목은 공개 추천 결과(contributions 포함)와 `isDiscovery / majorThemeKey / seriesGroupId` 제약 metadata를 가지며 렌더링된 설명 문장은 저장하지 않는다. 최초 10개와 이후 백필은 같은 plan에서만 고른다.
- `inputHash` = `hash(engineVersion + catalogVersion + 정렬된 anchor·reaction + 부정 항목·disposition·이유 + adjustments + policies + 제외 workId 목록)`. 추천 재계산 판정의 단일 기준(`03` §5)이다. `updatedAt`·진행률·자유 positive text·추천 산식에 영향을 주지 않는 planned-only record는 hash에서 제외한다.
- 추천 카드 피드백은 record 쓰기와 authoritative readback이 성공한 뒤에만 화면에 반영한다. `読んだ`는 completed + 선택 reaction(스킵 시 없음), `興味なし`는 hidden + 선택 이유가 있을 때만 disliked/negativeReasons(스킵 시 둘 다 없음)이다. 현재 세션은 기존 plan으로 백필하고 기존 계산 hash를 유지해 입력 변경 상태를 정직하게 표시하며, 재진입이나 명시적 更新에서 새 hash로 계산한다.
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
  profile: {
    adjustments: ProfileAdjustments;
    policies: RecommendationPolicies; // 네 필드 전부, UI 비노출 excludeIncomplete 포함
    onboardingCompletedAt: string | null; // required nullable, 합성 금지
  };
  onboardingDraft: OnboardingDraft | null; // required nullable
};
```

- Export는 온보딩 전에도 유효하다. 하나의 readonly snapshot에서 `userWorks`·`externalWorks`·profile의 adjustments/네 policies/nullable completion marker·nullable draft를 읽고, external `id + normalizedKey`와 표시 metadata·`isbnSamples`·nested user record를 그대로 보존하며 ID를 다시 계산하지 않는다. adjustments/policies row가 없으면 각각 동결된 앱 기본값을 완전한 객체로 직렬화한다. 완료 marker나 draft가 없으면 필드를 생략하거나 현재 시각을 만들지 않고 `null`을 기록한다. recommendation/provider cache와 meta는 export payload가 아니다.
- Import 절차는 strict zod/정확한 key set 파싱 → 지원 schemaVersion 확인 → user/external/profile/draft의 중복·namespace·교차 필드 검증 → external identity version dispatch와 canonical key/ID digest/nested ID/distinct ISBN/collision 전체 검증 → 미리보기 → 확인 순서다. **모든 검증은 첫 mutation 전에 끝나며**, 한 row나 교차 필드 하나라도 실패하면 기존 일곱 store는 불변이다.
- profile/draft 교차 필드는 §6 resolver를 그대로 사용한다. nullable draft의 `null`은 모든 상태에서 유효하다. non-null `firstRun` draft는 현재 Catalog positive <5와 marker `null`에서만, `add` draft는 usable profile 또는 marker 존재 상태에서만 유효하며 imported `userWorks`와 add entry workId가 겹치면 전체 거부한다. resolver가 mode나 marker를 조용히 고치지 않는다.
- 확인 뒤 일곱 store를 포괄하는 단일 replacement transaction을 수행한다(병합 아님 — v1은 대체만 지원). commit 후 exact outcome은 imported `userWorks`·`externalWorks`·profile rows·`onboardingDraft`, 빈 `recommendationCache`·`providerCache`, 현재 앱의 schemaVersion과 현재 bundled catalogVersion을 가진 `meta`다. export의 cache·meta·과거 catalogVersion을 runtime state로 복원하지 않는다.
- 최신 normalizer로 과거 ID를 재계산하지 않는다. imported v1은 v1 규칙으로 검증하고 그대로 주소화한다. unsupported newer external identity는 앱 업데이트가 필요한 파일로 전체 거부하며 silent v1→v2 re-key를 금지한다. 향후 re-key는 모든 nested reference를 원자적으로 바꾸는 명시적 DB/export schema migration만 허용한다.
- catalogVersion 불일치는 미리보기 경고만 만든다. 현재 Catalog에 없거나 `recommendationEligible`이 아닌 `userWorks` 기록은 보존하고 UI에 표시하되 usable profile count·추천 계산에는 넣지 않는다.
- 전체 삭제도 일곱 store의 단일 transaction이다. 모든 row를 지운 뒤 현재 schemaVersion·현재 bundled catalogVersion의 runtime meta만 다시 쓰며, 여섯 non-meta store empty + exact meta의 authoritative readback 뒤에만 성공으로 반환한다.
- Import·삭제의 primary commit/readback 결과가 불확실하면 동일 destructive operation을 memory backend에 재생하거나 성공·불변을 주장하지 않는다. `indeterminate` 결과로 재로딩 후 primary 상태 확인을 요구한다. 제품이 의도적 memory-only 모드를 제공한다면 `session-only`를 별도 결과로 반환하고 새로고침 시 소실됨을 UI가 명시해야 한다.

## 8. PWA 경계

- MVP: 정적 manifest(이름·아이콘·`start_url: "/"`·`display: standalone`) + 설치 가능성. 오프라인은 Dexie 데이터의 자연 오프라인성에 의존한다.
- 폴리시 슬라이스: TanStack Start 배포 output과 호환되는 service worker adapter를 별도 검토한다. exact Catalog precache, 표지 cache-first(7일/300항목), `/api/rakuten/*` network-only 계약은 보존하되 Next 전용 Serwist 설정을 그대로 이식하지 않는다.
- `start_url`은 `/` 유지(랜딩의 리다이렉트 로직이 온보딩 여부 분기 담당).

## 9. 실패 동작 요약

| 실패 | 동작 |
|---|---|
| Catalog JSON 요청·파싱·검증·identity 확인 실패 | 치명 오류 화면과 실제 요청 재시도. 빌드 artifact 누락·byte 불일치는 배포 차단(`catalog:validate`가 CI 게이트) |
| Rakuten API 실패 | 표지 placeholder / 가격·재고 숨김 / 검색은 로컬 전용 안내. 추천·DNA·Library 무영향 |
| IndexedDB 사용 불가(프라이빗 모드 등) | 최초 진입 시 감지 → 「このブラウザではデータを保存できません」 경고 배너 + 세션 메모리 폴백(새로고침 시 소실 명시) |
| External query 누락·중복·형식 오류 | 고정 static shell의 invalid-link 상태 + Library 이동. 해당 값으로 ID별 local lookup·Rakuten 요청·Catalog redirect 없음 |
| 유효 external ID의 local row 없음 | 이 브라우저에 저장되지 않은 상태 + Library 이동. digest 복원·provider 검색·blank row 생성 없음 |
| External local row 손상/지원하지 않는 ID version | 서지 비표시 local-data error. 자동 repair/re-key/provider 요청 없음 |
| Import 파일 손상·교차 필드 모순 | mutation 전 전체 거부, 구체 오류 표시, 일곱 store 불변 |
| Import·전체 삭제 primary 결과 확인 불가 | 자동 memory replay·성공 주장 금지, indeterminate 안내 뒤 재로딩하여 authoritative primary readback |
| 추천 후보 소진 | 빈 상태 + 개선 안내(`03` §5) |

## 10. 국제화·분석 준비

- 문자열은 전부 `lib/strings.ts`의 키 참조. Phase 2 한국어는 이 테이블의 교체로 시작(라이브러리 도입은 그때 판단).
- 분석: MVP 코드 없음. 공개 베타 이후 도입 시(후보: PostHog) 이벤트는 아래 최소 목록으로 시작하고, **Taste Vector 원본·Library 전체·민감한 부정 이유는 절대 전송하지 않는다**:

```text
onboarding_started / work_selected / onboarding_completed / taste_revealed /
recommendation_impression / recommendation_saved / recommendation_hidden /
recommendation_already_read / provider_clicked / data_exported
```
