<p align="center">
  <a href="https://konocomics.vercel.app">
    <img src="./docs/assets/readme/banner.webp" alt="konocomics — 好みから見つける、次のマンガ。" width="100%" />
  </a>
</p>

<p align="center">
  <strong>만화 취향을 알고, 다음 작품을 이유와 함께 찾으세요.</strong><br />
  좋아한 만화에서 17축 <em>Manga DNA</em>를 만들고 추천 이유까지 보여 주는 로컬 우선 웹앱입니다.
</p>

<p align="center">
  <a href="https://konocomics.vercel.app"><img alt="앱 열기" src="https://img.shields.io/badge/%EC%95%B1_%EC%97%B4%EA%B8%B0-konocomics.vercel.app-DCA55E?style=for-the-badge&labelColor=0B1018" /></a>
</p>

<p align="center">
  <img alt="TanStack Start" src="https://img.shields.io/badge/TanStack_Start-0B1018?style=flat-square&logo=reactquery&logoColor=DCA55E" />
  <img alt="React 19" src="https://img.shields.io/badge/React_19-0B1018?style=flat-square&logo=react&logoColor=DCA55E" />
  <img alt="TypeScript strict" src="https://img.shields.io/badge/TypeScript_strict-0B1018?style=flat-square&logo=typescript&logoColor=DCA55E" />
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS_4-0B1018?style=flat-square&logo=tailwindcss&logoColor=DCA55E" />
  <img alt="Local-first IndexedDB" src="https://img.shields.io/badge/Local--first-IndexedDB-0B1018?style=flat-square&labelColor=0B1018&color=1B232D" />
  <img alt="Node 24" src="https://img.shields.io/badge/Node-24-0B1018?style=flat-square&logo=nodedotjs&logoColor=DCA55E" />
</p>

<p align="center">
  <a href="./README.md">English</a> · <strong>한국어</strong> · <a href="./README.ja.md">日本語</a>
  <br />
  <a href="#작동-방식">작동 방식</a> ·
  <a href="#추천-엔진">추천 엔진</a> ·
  <a href="#아키텍처">아키텍처</a> ·
  <a href="#로컬에서-실행하기">로컬 실행</a>
</p>

<br />

<p align="center">
  <img src="./docs/assets/readme/showcase.webp" alt="데스크톱의 Manga DNA와 모바일의 추천 화면" width="100%" />
</p>

> [!NOTE]
> 제품 UI는 일본어입니다. <strong>kono</strong> + <strong>mi</strong> = konomi(好み, 취향). 이름 안에 제품의 주제가 숨어 있습니다.

## konocomics가 다른 점

<table>
  <tr>
    <td width="33%" valign="top">
      <h3>🧬 장르보다 세밀한 취향</h3>
      Manga DNA는 서사, 전개 속도, 관계, 분위기, 심리적 피로도를 <strong>17개 관찰 축</strong>으로 읽습니다. 점수가 아니라 단계로만 보여 줍니다.
    </td>
    <td width="33%" valign="top">
      <h3>🔎 근거까지 추적되는 이유</h3>
      모든 추천 문장은 점수 엔진이 반환한 팩터 기여도에서만 만듭니다. 런타임 LLM이 순위를 정하거나 이유를 쓰지 않습니다.
    </td>
    <td width="33%" valign="top">
      <h3>🔒 기본값부터 로컬</h3>
      프로필, 독서 기록, 피드백, 설정은 브라우저의 <strong>IndexedDB</strong>에만 저장됩니다. 계정도 서버 측 제품 DB도 없습니다.
    </td>
  </tr>
</table>

## 작동 방식

```mermaid
flowchart LR
    A["📚 좋아한 만화<br/>5~10작품 선택"] --> B["🙅 선택: 맞지 않았던<br/>작품 최대 3개 + 이유"]
    B --> C["🧬 Manga DNA<br/>17축 · 0~4단계"]
    C --> D["✨ 추천 10작품<br/>작품마다 이유"]
    D -- "읽음 · 저장 · 관심 없음" --> C

    classDef accent fill:#DCA55E,stroke:#DCA55E,color:#2B1F12,font-weight:bold
    classDef base fill:#1B232D,stroke:#3A4450,color:#E6EAF0
    class A,B base
    class C,D accent
```

<table>
  <tr>
    <td width="33%" align="center"><img src="./docs/assets/readme/step-1-pick.webp" alt="1단계: 좋아한 만화 고르기" /></td>
    <td width="33%" align="center"><img src="./docs/assets/readme/step-2-dna.webp" alt="2단계: Manga DNA 확인" /></td>
    <td width="33%" align="center"><img src="./docs/assets/readme/step-3-recommendations.webp" alt="3단계: 추천 탐색" /></td>
  </tr>
  <tr>
    <td valign="top"><strong>1 · 고르기</strong><br />Catalog를 검색하거나 책장에서 고릅니다. ☆로 「大好き」를 표시하면 더 강하게 반영됩니다.</td>
    <td valign="top"><strong>2 · DNA 읽기</strong><br />강한 취향, 그 판단을 뒷받침한 작품, 각 팩터가 순위에 미치는 영향을 확인합니다.</td>
    <td valign="top"><strong>3 · 탐색하기</strong><br />추천 이유를 열고, 기분·장르로 좁히고, 라이브러리에 저장하거나 맞지 않은 이유를 엔진에 알려 줍니다.</td>
  </tr>
</table>

<details>
<summary><strong>DNA를 링크로 공유하기</strong></summary>
<br />
<img src="./docs/assets/readme/share-link.webp" alt="Manga DNA 공유 대화상자" width="100%" />

공유 페이지는 완전히 정적입니다. DNA 단계, 고른 작품, 추천 작품이 URL 쿼리에 담기며 서버에는 아무것도 저장하지 않습니다.
</details>

## 추천 엔진

순위 규칙은 숨은 휴리스틱이 아니라 명시적인 제품 계약입니다. [제품 사양 §6](./docs/planning/02-product-spec.md)이 단일 진실 원천입니다.

```mermaid
flowchart TB
    subgraph INP["① 입력"]
      direction LR
      L["좋아한 · 大好き 작품"]:::base
      N["맞지 않았던 작품 + 이유"]:::base
      P["정책 · 기분 · 피드백"]:::base
      L ~~~ N ~~~ P
    end
    subgraph SCORE["② 취향 점수"]
      direction LR
      F["읽음 · 숨김 ·<br/>비대상 작품 제외"]:::base --> S["그룹별 유사도<br/>Genre · Theme · Narrative · Tone · Art"]:::accent
      S --> C["Coverage 미달 → 0.5로 수축<br/><i>가중치 재분배 없음</i>"]:::base
      C --> A["Best Positive Anchor<br/>+ Consensus Bonus"]:::accent
      A --> J["명시적 보정<br/>사유별 감점"]:::base
    end
    subgraph OUT["③ 출력"]
      direction LR
      R["근소한 점수 →<br/>시장 신호로 동률 조정"]:::base --> T["상위 10작품<br/>+ 기여도 원장"]:::accent
      T --> E["이유 · 주의점<br/>원장에서만 생성"]:::accent
    end
    INP --> SCORE --> OUT

    classDef accent fill:#DCA55E,stroke:#DCA55E,color:#2B1F12,font-weight:bold
    classDef base fill:#1B232D,stroke:#3A4450,color:#E6EAF0
    style INP fill:transparent,stroke:#7A8594,stroke-dasharray:4 4
    style SCORE fill:transparent,stroke:#7A8594,stroke-dasharray:4 4
    style OUT fill:transparent,stroke:#7A8594,stroke-dasharray:4 4
```

- **데이터 없음은 불호가 아닙니다.** `unknown` 팩터를 부정 취향으로 계산하지 않습니다. Coverage가 낮은 그룹만 중립값 `0.5`로 수축하고, 남은 그룹에 가중치를 재분배하지 않습니다.
- **여러 취향을 분리해 보존합니다.** Best Positive Anchor 방식으로 좋아한 작품 전체를 하나의 평균 벡터로 뭉개지 않습니다.
- **취향이 순위를 주도합니다.** 고정된 팩터 그룹 가중치가 취향 적합도를 결정하며, 시장 신호는 가까운 점수의 동률 조정에만 씁니다.
- **이유는 근거에서만 생성합니다.** 설명과 주의점은 선택된 작품의 기여도 원장과 근거 작품에서만 만듭니다.
- **같은 입력에는 같은 결과를 냅니다.** 도메인 계층은 순수하고 결정론적입니다. 시간, 난수, I/O, 런타임 모델 호출을 사용하지 않습니다.

### 팩터 어휘

| 그룹                   | 수  | 예시                                             |
| ---------------------- | :-: | ------------------------------------------------ |
| Genre                  | 10  | 액션, 판타지, 미스터리, 연애 …                   |
| Theme / Mechanic       | 22  | 수사, 유사 가족, 서바이벌 …                      |
| Narrative 축           |  6  | 성장, 전략, 전개 속도, 수수께끼·복선, 세계관 …   |
| Tone / Relationship 축 |  7  | 인물의 변화, 개그, 어두움, 심리적 무게, 따뜻함 … |
| Art 축                 |  4  | 사실성, 묘사 밀도, 부드러움, 박력·속도감         |

각 값은 `known`, `unknown`, `notApplicable` 상태를 구분합니다. 정의는 [팩터 사전](./docs/factors/factor-dictionary.md)에 있습니다.

## 아키텍처

```mermaid
flowchart LR
    subgraph BUILD["🛠 빌드 타임"]
      direction TB
      DB[("catalog.sqlite<br/>추적되는 권한 원천")]:::base --> V["검증"]:::base --> J["정적 JSON"]:::accent
    end
    subgraph BROWSER["🌐 사용자 브라우저"]
      direction TB
      UI["TanStack Start 앱"]:::accent
      DOM["순수 도메인 엔진<br/>DNA · 순위 · 이유"]:::accent
      IDB[("IndexedDB<br/>프로필 · 라이브러리 · 피드백")]:::base
      UI <--> DOM
      UI <--> IDB
    end
    SRV["☁️ 서버 route<br/>/api/rakuten/search<br/>/api/rakuten/item"]:::base
    RK["Rakuten Books API"]:::base
    BUILD --> BROWSER
    UI -- "표지 · 서지" --> SRV --> RK

    classDef accent fill:#DCA55E,stroke:#DCA55E,color:#2B1F12,font-weight:bold
    classDef base fill:#1B232D,stroke:#3A4450,color:#E6EAF0
    style BUILD fill:transparent,stroke:#7A8594,stroke-dasharray:4 4
    style BROWSER fill:transparent,stroke:#7A8594,stroke-dasharray:4 4
```

- 추적되는 SQLite Catalog는 **빌드 타임 권한 원천**이며 사용자 데이터를 보관하는 런타임 DB가 아닙니다.
- 개인 데이터는 모두 브라우저가 소유합니다.
- 서버 코드는 Rakuten Books 응답(표지·서지)을 검증하고 축소하는 두 route뿐이며, 자격 증명은 서버에만 둡니다.

현재 생성된 Catalog에는 **3,309작품**이 있습니다. **2,495작품**은 추천 대상이고 **814작품**은 Library 전용입니다. 적격 상태를 분리했기 때문에 Library에 있는 작품이 검증 없이 취향 분석에 섞이지 않습니다.

<details>
<summary><strong>주요 계약 문서</strong></summary>

- [제품 사양](./docs/planning/02-product-spec.md)
- [팩터 사전](./docs/factors/factor-dictionary.md)
- [아키텍처](./docs/planning/05-architecture.md)
- [Catalog authoring 권한](./docs/planning/09-catalog-authoring-authority.md)
- [UX 화면 계약](./docs/planning/03-ux-screen-contracts.md)

</details>

## 로컬에서 실행하기

**Node.js 24**와 **pnpm 10**이 필요합니다.

```bash
pnpm install
pnpm dev
```

번들 Catalog, Manga DNA, 추천, 로컬 Library는 원격 DB 없이 작동합니다. Rakuten 검색·작품 조회·표지 이미지를 사용하려면 `.env.example`을 `.env.local`로 복사하고 서버 전용 값을 설정하세요.

<details>
<summary><strong>품질 게이트</strong></summary>

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
pnpm catalog:authority:verify
pnpm catalog:validate
```

</details>

## 기술 스택

TanStack Start · TanStack Router · React 19 · TypeScript · Tailwind CSS 4 · Base UI · Motion · Dexie · Zod · Fuse.js · Vitest · Playwright

<br />

<p align="center">
  <sub>표지 이미지와 서지 정보는 <a href="https://books.rakuten.co.jp/">楽天ブックス</a> API에서 제공받습니다.</sub>
</p>
