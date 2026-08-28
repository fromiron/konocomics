<p align="center">
  <a href="https://konocomics.vercel.app">
    <img src="./docs/assets/readme/konocomics-hero.webp" alt="konocomics 열기" width="1600" />
  </a>
</p>

<h1 align="center">konocomics</h1>

<p align="center"><strong>만화 취향을 알고, 다음 작품을 이유와 함께 찾으세요.</strong></p>

<p align="center">
  좋아한 만화에서 17축 Manga DNA를 만들고 추천 이유까지 보여 주는 로컬 우선 웹앱입니다.
</p>

<p align="center">
  <a href="https://konocomics.vercel.app"><strong>앱 열기</strong></a>
  · <a href="#작동-방식">작동 방식</a>
  · <a href="#로컬에서-실행하기">로컬에서 실행하기</a>
</p>

<p align="center">
  <a href="./README.md">English</a> · <strong>한국어</strong> · <a href="./README.ja.md">日本語</a>
</p>

<p align="center"><sub><strong>kono</strong> + <strong>mi</strong> = konomi(好み, 취향). 이름 안에 제품의 주제가 숨어 있습니다.</sub></p>

## konocomics가 다른 점

### 장르보다 세밀한 취향

Manga DNA는 서사, 전개 속도, 관계, 분위기, 심리적 피로도, 작화 성향을 **17개 관찰 축**으로 표현합니다.

### 근거까지 추적되는 이유

모든 추천 문장은 점수 엔진이 반환한 팩터 기여도에서만 만듭니다. 런타임 LLM이 순위를 정하거나 이유를 쓰지 않습니다.

### 기본값부터 로컬

프로필, 독서 기록, 피드백, 설정은 **IndexedDB**에 저장됩니다. 계정도 서버 측 제품 데이터베이스도 없습니다.

## 작동 방식

1. **좋아한 만화 5~10개를 고릅니다.** 원한다면 맞지 않았거나 중단한 작품을 이유와 함께 최대 3개까지 추가합니다.
2. **Manga DNA를 확인하고 조정합니다.** 강한 취향, 그 판단을 뒷받침한 작품, 각 팩터의 추천 반영 방식을 살펴봅니다.
3. **순위가 매겨진 후보 10개를 탐색합니다.** 추천 근거를 열고, 라이브러리에 저장하거나 맞지 않은 이유를 엔진에 알려 줍니다.

현재 제품 UI는 일본어입니다. README는 영어, 한국어, 일본어를 제공합니다.

## 추천 엔진의 계약

순위 규칙은 숨은 휴리스틱이 아니라 명시적인 제품 계약입니다.

- **데이터 없음은 불호가 아닙니다.** `unknown` 팩터를 부정 취향으로 계산하지 않습니다. Coverage가 낮은 그룹만 중립값 `0.5`로 수축하고, 남은 그룹에 가중치를 재분배하지 않습니다.
- **여러 취향을 분리해 보존합니다.** Best Positive Anchor 방식으로 좋아한 작품 전체를 하나의 평균 벡터로 뭉개지 않습니다.
- **취향이 순위를 주도합니다.** 고정된 팩터 그룹 가중치가 취향 적합도를 결정하며, 시장 신호는 가까운 점수의 동률 조정에만 씁니다.
- **이유는 근거에서만 생성합니다.** 설명과 주의점은 선택된 작품의 기여도 원장과 근거 작품에서만 만듭니다.
- **같은 입력에는 같은 결과를 냅니다.** 추천·설명 코드는 순수하고 결정론적입니다. 도메인 계층에서 시간, 난수, I/O, 런타임 모델 호출을 사용하지 않습니다.

팩터 어휘는 **Genre 10종, Theme 22종, Axis 17종**이며, 각 값은 `known`, `unknown`, `notApplicable` 상태를 구분합니다.

## Catalog와 아키텍처

현재 생성된 Catalog에는 **1,614작품**이 있습니다. **1,441작품**은 추천 대상이고 **173작품**은 Library 전용입니다. 적격 상태를 분리했기 때문에 Library에 있는 작품이 검증 없이 취향 분석에 섞이지 않습니다.

```text
data/source/catalog.sqlite → 검증 → 정적 JSON → 브라우저
브라우저 IndexedDB → 프로필, Library, 피드백, 설정
Rakuten Books API → /api/rakuten/search | /api/rakuten/item → 브라우저
```

추적되는 SQLite Catalog는 **빌드 타임 권한 원천**이며 사용자 데이터를 보관하는 런타임 DB가 아닙니다. 개인 데이터는 브라우저가 소유합니다. 런타임 서버 경계는 Rakuten Books 검색·작품 응답을 검증하고 축소하는 두 route뿐이며, 공급자 자격 증명은 서버에만 둡니다.

주요 계약 문서:

- [제품 사양](./docs/planning/02-product-spec.md)
- [팩터 사전](./docs/factors/factor-dictionary.md)
- [아키텍처](./docs/planning/05-architecture.md)
- [Catalog authoring 권한](./docs/planning/09-catalog-authoring-authority.md)
- [UX 화면 계약](./docs/planning/03-ux-screen-contracts.md)

## 로컬에서 실행하기

**Node.js 24**와 **pnpm 10**이 필요합니다.

```bash
pnpm install
pnpm dev
```

번들 Catalog, Manga DNA, 추천, 로컬 Library는 원격 DB 없이 작동합니다. Rakuten 검색과 작품 조회를 사용하려면 `.env.example`을 `.env.local`로 복사하고 문서에 적힌 서버 전용 값을 설정하세요.

### 품질 게이트

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
pnpm catalog:authority:verify
pnpm catalog:validate
```

## 기술 스택

TanStack Start · TanStack Router · React 19 · TypeScript · Tailwind CSS 4 · Base UI · Motion · Dexie · Zod · Fuse.js · Vitest · Playwright
