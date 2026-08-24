# 02 — 제품 사양 (Product Spec)

> konocomics의 **확정 제품 사양**이다. (초안 기획서는 감사 후 폐기되었고, 그 delta 기록은 `00-plan-audit.md`·`01-decision-ledger.md`에 있다.)
> 추천 산식은 이 문서 §6이, 팩터 정의는 `docs/factors/factor-dictionary.md`가 단일 진실 원천(single source of truth)이다.

---

## 1. 제품 테제

**konocomics**는 사용자가 좋아하거나 싫어한 만화로부터 장르가 아니라 **전개·문제 해결·전략·관계·톤·심리적 피로도·작화 성향**을 추론하고, 아직 읽지 않은 만화를 **왜 추천했는지 설명하면서** 제시하는 개인 만화 취향 서비스다.

- 사용자 노출 제품명: **konocomics** / 로고: **kono**co**mi**cs / 일본어: コノコミックス
- 내부 엔진명: Manga Taste Engine / 대표 기능명: **Manga DNA**
- 브랜드 기믹: `kono + mi = konomi = 好み`. 로고 안에 숨은 단어 = 작품 안에 숨은 취향.

### 대상 사용자

일본 만화 다독자. 인기순 추천에서 이미 읽은 작품만 반복되고, 장르 필터로는 부족하며, 추천 이유의 납득을 원하는 사람. Phase 1 UI 언어는 일본어.

### 검증 가설 (확정 요구사항이 아님 — 블라인드 테스트 대상)

- **A. 세부 취향 추천의 가치** — 장르+인기 Baseline보다 세부 요소 기반 추천이 더 가치 있다.
- **B. 설명의 신뢰 효과** — "93% 일치"보다 어떤 작품·요소가 비슷한지의 설명이 신뢰를 만든다.
- **C. 피드백의 누적 가치** — 초기 추천이 맞으면 사용자는 추가 입력 의향이 있다.
- **D. Discovery 가치** — 몰랐던 작품의 발견이 유명작 재노출보다 강한 가치다.
- **E. 취향 분석의 콘텐츠성** — Manga DNA 확인·보정 자체가 재미있는 결과물이다.

### 제품 원칙 (확정 — 모든 구현 판단의 상위 규칙)

1. 취향 적합도와 시장 인기도를 분리한다. 시장 신호는 tie-break로만 쓴다.
2. 데이터 없음(unknown)을 낮은 취향값으로 해석하지 않는다.
3. 작품을 선택하지 않았다는 사실을 불호로 해석하지 않는다.
4. 읽기 상태(readingState)와 감상(reaction)을 분리한다.
5. 명시적 불호와 데이터 불확실성을 분리한다.
6. 추천 설명은 실제 점수 기여 요소에서만 생성한다.
7. 런타임 LLM이 후보·순위를 결정하지 않는다.
8. 다중 취향을 하나의 평균 벡터로 뭉개지 않는다 (Best Anchor).
9. 팩터는 초반 1~3권 진입 경험만 기준으로 태깅한다.
10. 데이터가 부족한 작품을 높은 확신으로 추천하지 않는다.
11. MVP 투자는 인프라가 아니라 Catalog와 추천 정확도에 집중한다.
12. 확신도(Confidence)는 확률 숫자가 아니라 단계 레이블로 표시한다.

---

## 2. MVP 범위

### 포함

- 온보딩: 첫 등록은 좋아한 작품 5~10개 + 선택적 불호 작품 0~3개(이유 포함). 기존 프로필의 작품 추가는 새 좋아한 작품 1~10개만 받고 불호 단계는 반복하지 않는다.
- Manga DNA 생성·reveal·인라인 보정 (매우 선호/선호/자동/덜 추천/제외)
- 설명 가능한 추천 10개 (이유 최대 3 + 주의점 1 + 근거 Anchor)
- 추천 피드백: 읽고 싶음 / 이미 읽음 / 관심 없음(+이유)
- Library: 읽음 상태 5종 × 감상 4종 관리, Catalog 외 작품은 라쿠텐 검색으로 external entry 추가
- 작품 상세: 표지(고해상도), 블러 배경, 추천 근거, 라쿠텐 구매 링크
- 추천 정책 3종: 완결작 우선 / 숨은 작품 우선 / 검증된 작품 우선
- 로컬 데이터 Export / Import (v1 스키마) / 전체 삭제
- 반응형 웹 + 설치 가능한 PWA(manifest 우선, 오프라인 셸은 폴리시 단계)

### 제외 (Non-goals)

계정·서버 사용자 데이터 / 실시간 LLM / Vector DB / Collaborative Filtering / 커뮤니티 기능 / 리뷰 수집 크롤러 / 결제·광고 / 네이티브 앱 / 자체 뷰어 / 검색 서버 / **현재 Mood 모드(DEFER)** / **NDL 연동(DEFER)** / 분석 SDK(DEFER) / 한국어 UI(Phase 2).

### Catalog 범위

- 우선 장르: 액션·판타지·역사·SF·미스터리 / 인접: 코미디·무술·호러·일상·로맨스·스포츠
- 규모: sanity check는 동결된 정확히 50개의 서로 다른 `recommendationEligible` Work → 블라인드 테스트·공개 MVP의 Gold Set 150 (Anchor 30~40 / Bridge 30~40 / Discovery 70+) → 비성인 일본 만화 총 1,000작품 이상으로 확장. 1,000은 최소값이며 상한은 두지 않는다.
- 역할 분리: `onboardingEligible` / `recommendationEligible` / `libraryOnly`
- 기존 Gold Set 150작품은 ID·주석·추천 계약을 동결한다. 확장 작품은 안전·canonical identity·선정 provenance·대표 ISBN을 검증해 `libraryOnly`로 먼저 수용할 수 있으며, 17축을 명시적 `unknown`으로 두고 사람 또는 승인된 주석 게이트 전에는 온보딩·DNA·추천 산식에 사용하지 않는다.
- 외부 API가 제공하지 않는 원산지 국적과 원작 레이아웃 형식은 추론하지 않고 staging에서 `unknown`으로 유지한다. 별도 공식 근거로 세로 스크롤 우선 작품임이 확인된 경우에만 `excluded-webtoon`으로 제외한다.
- Anchor는 취향 판독기 역할(대비 축 커버)이어야 하며 단순 인기작 나열이 아니다.

---

## 3. 최종 사용자 흐름

```text
[신규]
/               랜딩. Slice 10 정적 konomi 로고 + 제품 설명 + CTA「好きなマンガから始める」(reveal은 Slice 11)
/onboarding     STEP 1  좋아한 작품 5~10개 선택 (검색 + 장르 Shelf)
                STEP 2  (선택) 싫어했거나 하차한 작품 0~3개 + 이유 선택
/taste?reveal=1 STEP 3  Manga DNA reveal → 인라인 보정 → CTA「おすすめを見る」
/recommendations 추천 10개 + 이유. 카드 액션: 読みたい / 読んだ / 興味なし(+이유)
/works/[workId] Catalog 상세: 표지·블러 배경·DNA 대조·추천 근거·라쿠텐 링크
/works/external?workId=<ExternalWorkId> 로컬 external 상세(고정 정적 셸)
/library        읽음 상태·감상 관리, 외부 작품 추가
/settings       추천 정책, Export/Import, 전체 삭제, 크레딧

[재방문]
/ → 현재 Catalog의 positive anchor가 5개 이상인 usable profile이면 /recommendations로 클라이언트 리다이렉트. `?landing=1`은 저장 없이 랜딩을 다시 보는 우회
온보딩 중단 시 → 진행 상태가 Dexie에 남아 이어서 진행
/taste의 「作品を追加して精度を上げる」 → /onboarding 추가 모드. 기존 기록은 보존하고 새 positive 1~10개만 추가한 뒤 reveal 없이 /taste로 복귀
```

피드백 루프: 추천 카드에서 `読んだ`/`興味なし` 입력 → 해당 작품은 후보에서 제거되고 즉시 다음 순위로 백필 → 감상·이유는 Library에 축적 → 프로필 입력 변경 시 다음 추천 계산에 반영.

**추천 재계산 계약:** 추천 목록은 `(프로필 입력 해시)`가 마지막 계산 시점과 다를 때만 페이지 진입 시 재계산한다. 같은 입력이면 동일한 목록을 유지한다(결정론). 카드 개별 제거는 재계산이 아니라 백필이다.

추천 카드 피드백은 호출자가 주입한 한 `updatedAt`으로 저장한다. `読んだ`는 먼저 `readingState="completed"`로 저장하고, 후속 시트의 `最高 / 良かった / 普通 / いまいち`를 각각 `favorite / liked / neutral / disliked`에 대응한다. 시트를 스킵하면 reaction을 만들지 않는다. `興味なし`는 먼저 `readingState="hidden"`으로 저장한다. 이유를 고른 경우에만 `reaction="disliked"`와 선택한 `negativeReasons`를 함께 기록하고, 스킵하면 reaction·reason을 합성하지 않는다. 특히 사용자 입력 없는 `vagueDislike`를 만들지 않는다.

---

## 4. Manga DNA 경험

- 사용자가 보는 것: 그룹(장르/테마/전개/톤·관계/작화)별 섹션 아래 **가로 막대(0~4)** 와 일본어 정성 레이블. 확인값은 `<0.5 → ごく控えめ`, `<1.5 → 控えめ`, `<2.5 → ほどほど`, `<3.5 → 強め`, 그 외 `とても強め`로 표시하고 숫자 원값은 노출하지 않는다. 상위 취향 3개는 상단에 konomi 강조 색으로 요약.
- 각 상위 취향에는 근거 Anchor 표지 칩("『ダンジョン飯』『キングダム』から")을 붙인다 — 원칙 6의 시각화.
- **미확인 정직성:** 데이터가 부족한 축은 빈(윤곽선) 막대 + 「まだ分析中」로 표시한다. 0으로 그리지 않는다.
- 인라인 보정: 각 축·테마에 5단계 칩 `とても好き / 好き / 自動 / 控えめに / 除外`. 내부 수치 슬라이더는 노출하지 않는다.
- 보정은 자동 학습을 덮어쓰지 않고 §6.6의 제한적 보정으로만 작동한다. `除外`만 절대 조건(Hard Exclusion)이다.
- DNA reveal 애니메이션은 온보딩 완료 시 1회 (`04-visual-interaction-spec.md` §5.2).

사용자 표시용 축 → 표시 언어 매핑(대표 예): `strategy→戦略的な展開`, `pacing→テンポの速さ`, `mentalStress→精神的な重さ`, `problemSolving→頭脳で解決する話`, `relationshipStructure→群像劇・関係の広がり`, `artRealism→リアル寄りの絵`. 전체 매핑은 팩터 사전(`docs/factors/factor-dictionary.md`)에서 관리한다.

---

## 5. 데이터 모델 (도메인 확정분)

### 5.1 원칙

- **ISBN은 작품 ID가 아니다.** 『キングダム』 1~3권은 서로 다른 ISBN이지만 추천에서는 하나의 `Work`다. MVP 계층은 `Work / Volume / ProviderListing` 셋뿐이며, 판형(완전판·문고판 등) 문제로 실제 오류가 발생한 뒤에만 별도 `Edition` 계층을 추가한다.
- **원본 응답과 자체 데이터의 물리적 분리:** Work Taste Metadata(자체 정의·검수, 영구) / ProviderListing(라쿠텐 취득, 갱신 가능) / providerCache(TTL 캐시). 라쿠텐 응답을 영구 canonical DB로 복제하지 않는다.
- 공개 Catalog에는 최종 값과 최소 confidence만 포함하고, 상세 근거(evidence)는 빌드용 `data/source/`에만 보존한다.

### 5.2 핵심 타입 (확정)

```ts
type Work = {
  id: string;
  title: string;
  titleKana?: string;
  aliases: string[];
  creators: string[];
  publisher?: string;
  demographic?: "shonen" | "seinen" | "shojo" | "josei" | "children" | "general" | "unknown";
  status: "ongoing" | "completed" | "hiatus" | "unknown";
  firstPublishedYear?: number;
  genres: GenreTag[];
  themes: ThemeFactor[];       // { id, centrality: 1|2, confidence }
  axes: WorkAxes;              // 17개 AxisFactor — 정의는 팩터 사전
  factorScope: "entry_1_3_volumes";
  eligibility: CatalogEligibility;
  evidence: WorkEvidence;
};
// demographic·firstPublishedYear는 핵심 Similarity 그룹에 넣지 않고
// 약한 사용자 정책 또는 필터로만 사용한다.

type Volume = {
  id: string;
  workId: string;
  volumeNumber?: number;
  isbn: string;
  releaseDate?: string;
  editionKind: "standard" | "digital" | "bunko" | "complete" | "limited" | "set" | "unknown";
};

type CatalogEligibility = {
  onboardingEligible: boolean;
  recommendationEligible: boolean;
  libraryOnly: boolean;
};

type RakutenBookItem = {
  title: string;
  author: string;
  publisherName: string;
  isbn: string;
  imageUrl?: string;
  itemUrl: string;
  affiliateUrl?: string;
  chirayomiUrl?: string;
  itemCaption?: string;
  salesDate?: string;
  itemPrice: number;
  availability: 1 | 2 | 3 | 4 | 5 | 6;
  reviewAverage: number;
  reviewCount: number;
};

// Route Handler는 공급자 필드만 반환한다. 현재 Catalog/외부 작품의 workId와
// 취득 시각·TTL은 브라우저 경계가 결합하며 서버가 합성하지 않는다.
type ProviderListing = {
  workId: string;
  provider: "rakuten";
  isbn: string;
  imageUrl?: string;
  itemUrl?: string;
  affiliateUrl?: string;
  chirayomiUrl?: string;
  itemCaption?: string;
  itemPrice?: number;
  availability?: 1 | 2 | 3 | 4 | 5 | 6;
  reviewAverage?: number;
  reviewCount?: number;
  fetchedAt: string;
  commercialExpiresAt: string; // 가격·재고: 24시간
  metadataExpiresAt: string;   // 소개·URL·이미지·리뷰: 90일(3개월의 결정론적 v1 해석)
};

type FactorEvidence = {
  sourceType: "rakuten" | "publisher" | "manual" | "model";  // ndl은 DEFER
  sourceUrl?: string;
  fetchedAt: string;
  extractorVersion?: string;
  reviewedByHuman: boolean;
  confidence: number;
};

type WorkEvidence = {
  metadataConfidence: number;
  groupingConfidence: number;
  sourceAgreement: number;
  annotationReviewedAt?: string;
};

// 읽기 상태와 감상을 하나의 enum에 섞지 않는다 (원칙 4).
// 표현 예: 완독+최애 / 읽는 중+좋음 / 완독+별로 / 하차+초반은 좋았음
type UserWorkRecord = {
  workId: string;
  readingState: "planned" | "reading" | "completed" | "dropped" | "hidden";
  reaction?: "favorite" | "liked" | "neutral" | "disliked";
  progress?: { volume?: number; chapter?: number };
  positiveReasons?: string[];
  negativeReasons?: NegativeReasonId[];   // §6.7 enum
  droppedReasons?: NegativeReasonId[];
  updatedAt: string;
};
```

`negativeReasons`는 명시적 `reaction="disliked"`와 함께 쓰며, 추천 카드의 `興味なし`는 선택 이유가 있을 때 이 조합을 `readingState="hidden"`과 함께 저장한다. 숨김만 선택하거나 이유 시트를 스킵한 record에는 reaction·reason이 없다.

### 5.3 추가 확정 타입

```ts
// Catalog 외 작품의 Library 기록 (추천·DNA 계산에 절대 사용하지 않음)
type ExternalWorkId = `ext:rakuten:v1:${string}`; // runtime: /^ext:rakuten:v1:[0-9a-f]{64}$/
type ExternalWorkRecord = {
  id: ExternalWorkId;
  normalizedKey: string;      // canonical JSON: [v1 normalized title, v1 primary creator]
  title: string;
  creators: string[];
  isbnSamples: string[];      // 확인된 권 ISBN-13 identity들의 distinct set
  coverUrl?: string;
  record: UserWorkRecord;     // record.workId === id
};

// 온보딩 진행 상태 (중단·재개용)
type PositiveOnboardingEntry = {
  workId: string;
  reaction: "favorite" | "liked";
};

type NegativeDisposition = "disliked" | "dropped";

type NegativeOnboardingEntry = {
  workId: string;
  disposition: NegativeDisposition;
  reasons: NegativeReasonId[];
};

type OnboardingDraft = {
  id: "current";
  mode: "firstRun" | "add";
  step: 1 | 2;
  positiveEntries: PositiveOnboardingEntry[];
  negativeEntries: NegativeOnboardingEntry[];
  updatedAt: string;
};
```

- external v1 identity는 `normalizedKey = JSON.stringify([normalizeExternalTitleV1(title), normalizeExternalCreatorV1(creators[0])])`, `digest = SHA-256(UTF8("konocomics-external-work-id-v1\0rakuten\0" + normalizedKey))`, `id = "ext:rakuten:v1:" + lowercaseHex(digest)`로 만든다. digest는 64자를 전부 보존한다. title v1은 NFKC·가나/폭·소문자·공백/중점(`[・･·]`, U+0387은 NFKC 후 `·`) 정규화 뒤 기존 권수·판형 토큰을 제거하고, creator v1은 같은 정규화에서 권수·판형 제거만 하지 않는다. 빈 결과는 거부하며 이 동작을 바꾸면 v2를 발급한다.
- Catalog version·ISBN·표지/구매 URL·출판사·가격/재고/리뷰·사용자 record·시각·삽입 순서는 external identity 입력이 아니다. Library에서 만드는 링크는 URL query 직렬화를 거친 `/works/external?workId=<ExternalWorkId>` 하나뿐이며 `/works/[workId]`에는 external ID를 넣지 않는다.
- 저장된 `id + normalizedKey`가 불변 identity다. 이후 표시용 title·creators가 갱신되어도 v1 ID를 다시 만들지 않는다. 같은 key/ID가 다시 선택되면 기존 user record를 보존하고 새 ISBN만 distinct union으로 합친다. ISBN-10은 기존 Catalog `isbnIdentityKey`로 동등한 ISBN-13에 canonicalize하므로 10/13 표현이 한 표본으로 합쳐진다. 상태·감상 편집은 최신 external row를 transaction 안에서 다시 읽고 nested `record`만 교체하여, 다른 탭이 합친 ISBN과 최신 표시 metadata를 보존한다. 대상이 삭제·손상되었거나 key가 달라졌으면 새 row를 만들거나 자동 복구하지 않고 거부한다. 같은 ID에 다른 key가 결합되면 전체 쓰기를 거부하고 suffix·시간·난수로 우회하지 않는다.
- external 작품은 `externalWorks`만 소유하며 `userWorks`에는 `external` 또는 `ext:` ID를 넣지 않는다. external 작품 ID `ext:rakuten:v1:*`와 부정 사유 ID `external:*`은 서로 다른 namespace이고 상호 대체할 수 없다.
- draft는 `mode` 판별 필드를 가진 strict union이다. `firstRun`은 step 1|2와 positive 0~10개·negative 0~3개를 허용하고 완료 시 positive 5~10개여야 한다. `add`는 step 1, 서로 다른 신규 positive 0~10개, `negativeEntries=[]`만 허용하며 완료 시 positive 1~10개여야 한다. 같은 `workId`가 양쪽에 동시에 있을 수 없다.
- `add` 완료는 기존 `UserWorkRecord`를 덮어쓰지 않는 insert-only 작업이다. 기존 workId와 충돌하면 draft·기존 기록을 그대로 둔 채 전체 작업을 거부한다. 누적 positive 총량에는 별도 상한을 두지 않고 10개는 추가 세션 하나의 상한이다.
- usable profile과 온보딩 mode는 현재 Catalog의 서로 다른 positive anchor 수와 완료 marker를 함께 해석한다. 5개 이상이면 `onboardingCompletedAt` 유무와 관계없이 usable profile이다. 5개 미만이면서 marker가 있으면 `firstRun`을 다시 열지 않고 `add` recovery로 진입하고, 5개 미만이면서 marker가 `null`이면 `firstRun`이다. recovery는 현재 Catalog 기준 5개를 회복할 때까지 profile guard를 유지하며 최초 완료 시각과 reveal marker를 바꾸지 않는다.
- `vagueDislike`는 해당 작품의 유일한 사유여야 한다. 이유를 고르지 않은 negative entry는 완료 시 `vagueDislike` 하나로 정규화한다. `external:*`은 `external:[a-z0-9]+(?:-[a-z0-9]+)*` 형식의 10~64자 id만 허용하고 같은 entry 안의 reason id는 중복될 수 없다.
- 완료 변환은 호출자가 주입한 동일 `completedAt`을 새 record의 `updatedAt`으로 쓴다. positive entry는 `readingState="completed"`와 보존된 reaction, `disliked` entry는 `readingState="completed"` + `reaction="disliked"` + `negativeReasons`, `dropped` entry는 `readingState="dropped"` + reaction 미지정 + `droppedReasons`가 된다. `add` 완료는 최초 `profile.onboardingCompletedAt`을 변경하지 않으므로 DNA reveal을 다시 열지 않는다.

### 5.4 데이터 주권·호환 프로필 계약

- 온보딩 전에도 `/settings`에서 Export할 수 있다. v1 파일은 `userWorks`·`externalWorks`, adjustments와 **네 정책 전부**(`preferCompleted`·`preferHidden`·`preferVerified`·`excludeIncomplete`), 필수 nullable `onboardingCompletedAt`, 필수 nullable `onboardingDraft`를 보존한다. 저장된 adjustments/policies row가 없으면 동결된 앱 기본값을 완전한 객체로 쓰고, 완료 시각이나 draft가 없으면 필드를 생략하거나 현재 시각을 합성하지 않고 정확히 `null`을 쓴다.
- Import는 strict whole-file·external identity·중복/충돌·프로필/draft 교차 필드 검증을 mutation 전에 끝낸다. 유효한 파일만 일곱 store를 한 트랜잭션으로 대체한다. 결과는 imported `userWorks`·`externalWorks`·profile·draft, 빈 recommendation/provider cache, 현재 앱의 schemaVersion·현재 bundled catalogVersion만 가진 runtime meta다. export의 meta나 cache는 가져오지 않는다.
- nullable draft의 `null`은 모든 resolver 상태에서 유효하다. non-null draft 교차 필드에서 `firstRun`은 현재 Catalog positive가 5개 미만이고 완료 marker가 `null`일 때만, `add`는 usable profile이거나 완료 marker가 있을 때만 유효하다. add draft의 workId는 imported 기록과 겹칠 수 없다. 모순된 조합은 mode를 자동 변경하지 않고 파일 전체를 거부한다.
- source `catalogVersion`이 현재와 달라도 경고 후 Import할 수 있다. 현재 Catalog에 없는 `userWorks` 기록은 삭제하지 않고 「カタログ外」로 표시하며 positive 수에는 포함하지 않는다. external identity는 저장된 version 규칙으로 검증하고 그대로 보존한다.
- 전체 삭제는 일곱 store를 원자적으로 비운 뒤 현재 runtime meta만 다시 만든다. Import·삭제 성공은 authoritative readback으로 exact outcome을 확인한 경우에만 표시한다. primary 결과가 불확실하면 memory backend에 destructive operation을 재생하지 않고 `indeterminate`로 알려 재로딩 후 primary 상태 확인을 요구한다. 명시적 memory-only 지원이 있다면 영속 성공과 구분된 session-only 결과와 새로고침 시 소실 안내가 필수다.

### 5.5 팩터 정의

Genre 10종, Theme 22종(centrality 1|2), Axis 17종(Narrative 6 / Tone·Relationship 7 / Art 4)의 전체 목록·0/2/4 판정 기준·`known/unknown/notApplicable` 의미·거리 종류·일본어 표시 레이블은 **`docs/factors/factor-dictionary.md`가 확정 정의**한다. `training` Theme 제외, `actionIntensity` Axis 제거(→`combat` centrality) 확정 포함.

---

## 6. 추천 산식 (단일 진실 원천)

### 6.1 파이프라인 순서

```text
1. Hard Exclusion (사용자 除外 조건, 미완결 제외 정책 등)
2. Eligibility 필터 (recommendationEligible, 읽음/하차/숨김/興味なし 제외)
3. 그룹별 Work Similarity (Weighted Jaccard + Axis 거리)
4. Coverage 미달 그룹만 중립(0.5) 수축
5. Best Positive Anchor 점수 + Consensus Bonus (≤ +0.05)
6. 명시적 보정 explicitAdjustment (±0.12 cap) + Theme soft exclusion
7. 사유별 Factor Penalty (합계 ≤ 0.25)
8. Vague Dislike Shape Penalty (maxSim × 0.08)
9. 완결 우선 정책 감점 → clamp(0, 1) → rawTasteScore
10. 정렬: 반올림된 tasteScore를 0.025 leader cohort로 분리한 뒤 cohort 안에서 tie-break
11. 리스트 제약 적용 후 상위 10개 확정
```

### 6.2 유사도

- Tag(Genre/Theme): Weighted Jaccard. Genre tag weight는 1, Theme는 각 작품의 centrality(1/2)를 가중치로 하며 tag별 교집합은 `min`, 합집합은 `max`다. Theme confidence는 similarity에 다시 곱하지 않고 Work confidence에서 사용한다.
- Axis: `1 − |a−b|/4`. `darkness / mentalStress / romance`는 presence-sensitive — 한쪽이 0이고 다른 쪽이 >0이면 거리 ×1.5 (상한 1).
- v1의 17개 `baseAxisWeight`는 모두 1이다. 팩터별 유효 가중치는 `1 × min(anchorConfidence, candidateConfidence)`이며 그룹 안에서만 정규화한다.
- Axis pair에서 한쪽이라도 notApplicable이면 기대 분모에서 제외한다. 그 외 pair는 기대 개수에 포함하고 양쪽 모두 known일 때만 관측 개수와 score에 포함한다. `coverage=observedCount/expectedCount`; 기대 개수 0이면 coverage 0이다. 관측 유효 가중치 합이 0이면 raw score는 0.5지만 known count coverage는 유지한다(known을 다시 unknown처럼 이중 처리하지 않음).
- Tag group은 양쪽 배열이 모두 비어 있지 않을 때 coverage 1, 한쪽이라도 비면 coverage 0이다. 합집합이 비면 raw score 0.5다. 한쪽만 비면 raw Jaccard는 0이지만 coverage 0으로 최종 0.5에 수축한다. 양쪽 그룹 주석이 있을 때만 개별 tag 부재를 known absence로 본다.
- 그룹 비중 고정: Genre 15% / Theme 25% / Narrative 25% / Tone·Relationship 20% / Art 15%.
- Coverage 임계: Genre 0.80 / Theme 0.60 / Narrative 0.60 / Tone 0.60 / Art 0.30. 미달 그룹만 `0.5 + (score−0.5) × min(1, coverage/threshold)`. **가중치 재분배 금지.**

### 6.3 Positive Anchor

```ts
weight = { favorite: 1.0, liked: 0.8 };            // neutral·disliked는 positive anchor 아님
anchorMatch = workSimilarity(candidate, anchor) * weight[reaction];
bestMatch   = max(anchorMatches);
// 같은 취향군: bestAnchor와 workSimilarity ≥ 0.65인 다른 positive anchor
supporterMatch = workSimilarity(candidate, supporter) * weight[supporter.reaction];
support        = average(supporterMatches.sort(desc, workIdAsc).slice(0, 2));
consensusBonus = max(0, support − 0.5) * 0.1;      // 실질 상한 ≈ +0.05
positiveAnchorScore = clamp(bestMatch + consensusBonus, 0, 1);
```

- positive anchor가 없으면 추천 배열은 비어 있다.
- best anchor 완전 동률은 `workId` 오름차순으로 결정한다. `anchorMatch` 최댓값과 supporter 정렬의 수치 동률은 §6.4의 부동소수점 비교 계약을 따른다.
- supporter가 0개면 support 0.5(보너스 0), 1개면 그 한 값의 평균이다. bonus는 계산 후 0.05에서 명시적으로 cap한다.

### 6.4 시장 신호 (tie-break 전용)

- `bayesianRating = (n·avg + 20·catalogAvg) / (n + 20)` — 1권 리뷰 기준, priorCount 20에서 시작.
- `maturity = min(1, log1p(volumeCount) / log1p(15))` — "검증된 작품 우선" 정책 선택 시에만 tie-break 우선순위 상승.
- 리뷰가 없으면 `n=0`으로 Bayesian 결과는 catalog average다. 결측 reviewCount는 0, 결측 정적 volumeCount는 0이다.
- `catalogAvg`는 대표 1권의 `reviewAverage`가 있고 `reviewCount>0`인 작품만 동일 가중으로 산술평균한다. 리뷰 0건 작품은 명시적 context entry를 유지하되 평균 분모에서 제외하며, 관측 작품이 하나도 없으면 catalog build를 실패시킨다.

근접 동률은 pairwise comparator를 쓰지 않는다. 최종 tasteScore를 소수 12자리로 반올림해 내림차순 정렬하고, 아직 cohort에 들지 않은 첫 작품을 leader로 삼아 leader와 차가 `<0.025`인 연속 작품을 같은 cohort로 묶는다. 정확히 0.025 차이면 새 cohort다.

- 기본 cohort tuple: `recommendationConfidence desc → bayesianRating desc → workId asc` (maturity 미사용).
- 검증된 작품 우선: `bayesianRating desc → maturity desc → recommendationConfidence desc → workId asc`.
- 숨은 작품 우선: `isPopular=false`를 위 tuple 맨 앞에 둔다. 검증 정책도 함께 켜졌으면 `isPopular asc → bayesianRating desc → maturity desc → recommendationConfidence desc → workId asc`.

`maturity`의 기본 미사용은 이 절의 “검증된 작품 우선에서만”이 §6.1의 축약을 구체화한 것이며 `07` §2-12가 경계를 검증한다.

부동소수점 비교 계약:

- `tol(a,b) = 4 × Number.EPSILON × max(1, |a|, |b|)`로 정의한다. raw similarity threshold `0.65`·`0.75`·`0.7`은 `value`가 threshold보다 작더라도 차이가 `tol(value, threshold)` 이하면 경계값을 충족한 것으로 본다. `0.025` taste cohort, Discovery `0.10`, coverage·표시 confidence 등 나머지 threshold에는 이 tolerance를 확장하지 않고 각 절의 반올림·exact 계약을 따른다.
- best anchor, supporter, vague source 및 cohort 내부 numeric tuple key는 raw 값 내림차순으로 먼저 정렬한다. 아직 묶이지 않은 최고값을 leader로 삼고 leader와의 차이가 tolerance 이내인 연속 항목만 같은 수치 동률 cohort로 묶는다. pairwise fuzzy comparator는 사용하지 않는다.
- numeric tuple은 key마다 위 leader cohort를 재귀 적용하고, 모든 key가 동률일 때만 `workId` 오름차순으로 결정한다. `isPopular` 같은 boolean key는 tolerance 없이 정확히 분리한다.
- 정렬·최댓값·threshold 선택에 쓰는 confidence·Bayesian·maturity·anchor·penalty 값은 q12로 조기 반올림하지 않는다. tasteScore cohort는 위 규칙대로 q12를 사용하고, contribution과 공개 숫자는 §6.9의 최종 출력 경계에서 q12로 만든다.

### 6.5 Confidence

```ts
profileConfidence = min(anchorCount/8, 1) * 0.8 + min(reasonedNegativeCount/2, 1) * 0.2;
workConfidence    = avgFactorConfidence * 0.6 + groupingConfidence * 0.2 + sourceAgreement * 0.2;
recommendationConfidence = sqrt(profileConfidence * workConfidence);
```

- `anchorCount`: distinct favorite/liked 작품 수.
- `reasonedNegativeCount`: vague/external 이외 factor-backed reason이 1개 이상인 distinct 불호 작품 수.
- `avgFactorConfidence`: 모든 known Axis confidence + 존재하는 Theme confidence의 산술 평균. unknown/notApplicable은 분모 제외, 값이 하나도 없으면 0.

표시: 숫자가 아니라 3단계 레이블. `≥0.75 → 高い`, `0.5~0.75 → ふつう`, `<0.5 → 低め(データ収集中)`.

### 6.6 명시적 보정 (확정 수치 — 기존 미정의 항)

DNA 보정 칩이 만드는 `explicitAdjustment`:

```ts
// Axis 설정: strength = とても好き +0.06 / 好き +0.03 / 控えめに −0.06
// (自動 = 0, 除外 = Hard Exclusion으로 별도 처리)
axisAdj(candidateValue: ScaleValue, strength: number) =
  strength * (candidateValue / 4 - 0.5) * 2;
  // value 4 → +strength, value 2 → 0, value 0 → −strength
  // unknown/notApplicable → 0 (원칙 2)

// Theme 설정: centrality 2 → ±strength, centrality 1 → ±strength/2, 없음 → −strength*0.5는 적용하지 않음(부재≠불호)
themeAdj = has(theme) ? strength * (centrality === 2 ? 1 : 0.5) : 0;

explicitAdjustment = clamp(sum(axisAdj) + sum(themeAdj), -0.12, +0.12);
```

0이 아닌 Axis raw adjustment contribution은 보정 방향을 `axisPreferenceDirection`에 기록한다. `とても好き / 好き`은 `higher`, `控えめに`는 `lower`이며 Theme adjustment에는 이 필드를 두지 않는다. 이 필드는 설명 provenance이며 점수에는 추가 영향을 주지 않는다.

`除外` 처리: Axis는 후보의 해당 값 ≥ 3이면 Hard Exclusion, Theme은 centrality 2이면 Hard Exclusion. Axis 값 0~2에는 soft penalty가 없다. Theme centrality 1은 explicit adjustment clamp 뒤 별도 `softExclusionPenalty=-0.10`이며 reasoned factor penalty cap에 넣지 않는다.

### 6.7 부정 사유 어휘 (확정 12종 + 외부 사유)

UI·엔진·설명이 공유하는 고정 enum. 각 사유는 "후보가 조건을 만족할 때만" 감점한다. 기본 감점 0.10, 합계 cap 0.25.

| id | 일본어 레이블 | 감점 조건 (candidate) | 비고 |
|---|---|---|---|
| `tooSlow` | 展開が遅い | `pacing ≤ 1` | 감점 0.12 |
| `tooRepetitiveProgression` | 強くなるだけの繰り返し | `progression = 4` かつ `problemSolving ≤ 1` | |
| `tooDark` | 暗すぎる・残酷 | `darkness ≥ 3` | |
| `tooStressful` | 精神的にしんどい | `mentalStress ≥ 3` | |
| `tooMuchRomance` | 恋愛の比重が高い | `romance ≥ 3` | |
| `tooMuchComedy` | ギャグが多すぎる | `comedy ≥ 3` | |
| `notEnoughSeriousness` | 軽すぎる・緊張感がない | `darkness ≤ 1` かつ `mentalStress ≤ 1` | |
| `tooComplex` | 設定・人間関係が複雑 | `worldBuilding = 4` または `relationshipStructure = 4` | |
| `artStyleDislike` | 絵が合わない | Art 그룹 유사도(대상 작품과) ≥ 0.75 | 약한 감점 0.08 |
| `genericStory` | ありきたりな展開 | 같은 불호 작품에 대해 bestAnchor↔불호와 candidate↔불호 Theme 유사도가 모두 ≥ 0.7 | 감점 0.08 |
| `powerInflation` | インフレ・強さの破綻 | `progression = 4` | 감점 0.08 |
| `vagueDislike` | なんとなく合わなかった | 작품 전체 유사도 기반 | `maxSim × 0.08` (§6.1-8) |
| `external:*` | 休載・時間がない・配信終了 등 | **감점 없음** | 기록만 |

unknown인 팩터는 감점 조건 판정에서 제외한다(원칙 2). 조건·수치는 Phase 1 sanity check에서 조정될 수 있으며, 조정 시 이 표를 갱신한다.

집계 계약:

- `external:*`은 계산에서 제거한다. factor-backed reason id는 여러 record에 반복되어도 전역 1회만 적용한다.
- `artStyleDislike`와 `genericStory`의 threshold는 coverage shrink가 적용된 group score다. 여러 source 작품 중 조건을 만족하는 최댓값으로 1회 적용한다.
- reasoned raw 합이 0.25를 넘으면 각 nominal penalty에 `0.25/rawTotal`을 곱해 비례 축소한다. 표 순서는 출력 안정화에만 쓰며 금액 우선권을 만들지 않는다.
- vague는 이유 미선택이 `vagueDislike` 단독으로 정규화된 record만 사용한다. factor-backed 또는 external reason과 함께 있으면 적용하지 않는다. 남은 vague 작품과 후보의 전체 similarity 최댓값 ×0.08을 factor cap 밖에서 1회 적용한다(동률 source는 workId 오름차순).
- `0.75`·`0.7` threshold와 vague 최댓값 동률은 §6.4의 부동소수점 비교 계약을 따른다.
- `penaltiesApplied`는 실제 적용액이 0보다 큰 factor-backed reason과 vague만 `NegativeReasonId[]`로 담는다. external, Theme soft exclusion, completed policy는 넣지 않으며 이 표 순서로 정렬한다.

### 6.8 추천 리스트 제약

```text
동일 best Anchor 기반         최대 4
동일 주요 Theme 조합          최대 3
동일 시리즈·직접 속편         최대 1
Discovery 슬롯               1~2 (top score − 0.10 이내에서만)
```

추천 정책 반영: `완결작 우선` = status≠completed 후보 −0.05 (제외 아님) / `숨은 작품 우선` = Discovery 슬롯 2~4로 확대 + reviewCount 상위 20% 후보 tie-break 강등 / `검증된 작품 우선` = tie-break에서 bayesianRating·maturity 우선.

정적 추천 제약 metadata는 확정 `Work` 타입을 늘리지 않고 별도 build input으로 둔다.

```ts
type RecommendationConstraintMetadata = {
  workId: string;
  catalogRole: "anchor" | "bridge" | "discovery";
  seriesGroupId?: string;
  volumeCount: number;
};

type RecommendationWorkMarketSignal = {
  workId: string;
  reviewAverage?: number;
  reviewCount?: number;
};
```

- 주요 Theme 조합 key는 centrality 2 Theme id 정렬 결합이며, 없으면 `none:{workId}`다. series/direct sequel key는 `seriesGroupId ?? workId`, Discovery는 `catalogRole=discovery`다.
- metadata 결측 fallback은 단위 픽스처에서만 bridge/고유 series/volumeCount 0/reviewCount 0이다. 50/150작품 gate에서는 추천 작품의 정적 metadata 누락이 validation failure다.
- review average/catalog average는 0~5 유한수, count류는 0 이상 정수로 경계 검증한다.
- 정적 metadata와 market snapshot은 catalog와 함께 빌드되는 불변 context다. version 필드를 제외한 catalog+정규화 context로 digest를 계산해 catalog와 snapshot 양쪽에 같은 `catalogVersion`을 기록하고, 입력 경계에서 일치를 검증한다.

리스트 선택은 §6.4에서 만든 전체 정렬을 순회하는 greedy다.

1. best anchor≤4, 주요 Theme key≤3, series key≤1을 항상 적용한다.
2. 모든 Discovery는 반올림된 `tasteScore >= overallTopTasteScore-0.10`일 때만 선택한다.
3. Discovery 최대는 기본 2/숨은 정책 4, 최소는 기본 1/숨은 정책 2다.
4. 최소 미달이면 가장 높은 미선택 Discovery `d`부터 본다. 선택이 10 미만이면 caps를 만족하는 `d`를 append한다. 이미 10이면 non-Discovery를 낮은 순위부터 `r`로 시도해 `(selected−r)+d`가 모든 cap을 만족하는 첫 쌍을 교체한다.
5. 한 건마다 전체 tie-break 순서로 재정렬하고 최소 충족 또는 후보 소진까지 반복한다. cap은 완화하지 않으며 10개 미달은 후보 부족 상태로 처리한다.

### 6.9 설명 생성

- 구성: 맞는 이유 최대 3 + 주의할 차이 1 + 근거 Anchor 1~3 + 확신도 레이블.
- 소스는 실제 기여도 상위 항목만. 그룹/Cluster당 최대 1개.
- Cluster: `tacticalThinking(problemSolving, strategy, mysteryReveal)` / `relationshipAppeal(characterArcWeight, relationshipStructure)` / `toneLoad(darkness, mentalStress)`.
- "주의할 차이"는 best Anchor 대비 전역 최대 음(−) similarity 하나만 후보로 삼는다. 해당 후보가 없거나 아래 group/Cluster 경쟁에서 탈락하면 생략한다.
- 템플릿 기반 일본어 문장. 예: `『{anchorTitle}』で好きだった「{factorLabel}」に近い作品です。` / 차이: `ただし「{factorLabel}」は、あなたの好みと少し異なります。`
- `axisPreferenceDirection=lower`인 양(+)의 Axis adjustment는 `「{factorLabel}」が控えめな点が、あなたの好みに合う作品です。`로 렌더링한다. 낮은 Axis 값이 `控えめに` 선호와 맞는다는 뜻이며, factor가 많아서 맞는다는 일반 positive 문장으로 바꾸지 않는다.
- 각 추천 결과는 `contributions[]`(팩터·그룹별 기여값)를 함께 반환하며, 설명은 이 배열에서만 생성한다. 테스트로 강제한다(`07` §2).

선택·렌더링 계약:

- positive 후보는 `explainable=true && value>0`, caution 후보는 best Anchor와의 차이인 `source=similarity && explainable=true && value<0`만이다. factor penalty·soft adjustment·policy를 Anchor 차이 문장으로 바꾸지 않는다.
- Axis adjustment는 `axisPreferenceDirection`이 있어야만 렌더링 후보가 된다. 이 provenance가 빠졌거나 Theme/다른 source에 잘못 붙은 contribution은 일반 positive 문장으로 추정하지 않고 설명 대상에서 제외한다.
- 안정 fallback은 `source → group → factorId → axisPreferenceDirection → anchorWorkIds.join("\\0") → negativeReasonId` 오름차순이다. 음수 similarity를 `value asc → fallback`으로 정렬한 첫 1개만 global caution 후보로 둔다.
- 모든 positive와 global caution 하나를 `abs(value) desc → fallback`으로 순회한다. 이미 쓴 group/Cluster는 건너뛰고 positive 최대 3, caution 최대 1을 고른다. caution이 더 강한 positive와 충돌하면 다른 음수로 백필하지 않고 생략한다.
- 렌더링 가능한 factor는 `ExplanationLexicon.factorLabels`에 정의된 Axis/Genre/Theme뿐이다. Cluster 소속 factor는 cluster label, 나머지는 factor label을 쓰되 구조화 identity에는 원래 factorId를 보존한다.
- 근거 Anchor는 렌더링된 positive 순서 뒤 caution 순서에서 `source=similarity` contribution의 실제 `anchorWorkIds`만 distinct 1~3개 수집한다. penalty source·미렌더 contribution·제목 미해결 ID는 제외하고, 0개면 bestAnchorId를 보충하지 않은 채 Anchor 구역을 생략한다.
- confidence는 Taste에만 정확히 `高い / ふつう / 低め(データ収集中)`로 표시한다. 모든 일본어 label/template은 `src/lib/strings.ts`가 소유하고 순수 설명기에 lexicon으로 주입한다.
- placeholder는 원본 template의 `{factorLabel}`·`{anchorTitle}` token을 단일 비재귀 pass로 치환한다. 주입 값 안의 같은 token bytes는 다시 해석하지 않는다.

```ts
type StructuredExplanationSentence =
  | {
      kind: "positive" | "caution";
      text: string;
      source: ContributionSource;
      group: CoverageGroup | "overall";
      factorId: string;
      value: number;
      anchorWorkIds: string[];
      axisPreferenceDirection?: "higher" | "lower";
      negativeReasonId?: NegativeReasonId;
    }
  | {
      kind: "baseline";
      text: string;
      source: "genre" | "market" | "maturity";
      group: "genre" | "overall";
      factorId: GenreTag | "bayesianRating" | "maturity";
      value: number;
      anchorWorkIds: string[];
    };
```

각 문장의 `source/group/factorId/value/anchorWorkIds`와 optional `axisPreferenceDirection`/`negativeReasonId`는 선택한 원 contribution identity와 정확히 같아야 한다.

Contribution ledger는 `tasteScore`를 완전히 추적한다.

```ts
type ContributionSource =
  | "baseline" | "similarity" | "consensus" | "adjustment"
  | "penalty" | "policy" | "clamp";

type GroupContribution = {
  source: ContributionSource;
  group: CoverageGroup | "overall";
  factorId: string;
  value: number;
  anchorWorkIds: string[];
  axisPreferenceDirection?: "higher" | "lower";
  negativeReasonId?: NegativeReasonId;
  explainable: boolean;
};
```

- similarity factor delta는 중립 0.5 기준이다. Axis는 `(sim-0.5)*effectiveWeight/observedWeightSum`, tag는 합집합의 **각 tag별** `(minWeight-0.5*maxWeight)/totalUnionWeight`에 group weight와 coverage scale을 곱한다. 0분모에는 항을 만들지 않는다.
- ledger는 `neutralBaseline=0.5*bestAnchorReactionWeight` + best anchor factor delta×reaction weight에서 시작한다. consensus는 clamp 후 실제 bonus, adjustment는 raw factor 항 + `adjustmentClamp`, penalty/policy는 실제 적용액, `finalClamp`는 `tasteScore-preClampScore`다.
- source 고정: baseline / factor similarity / consensus / raw adjustment / Theme soft exclusion·reason penalty / completed policy / adjustment·final clamp 순으로 각각 이름과 같은 source를 쓴다. zero 항은 만들지 않는다.
- group 고정: Genre/Theme tag=`genre/theme`, Axis=소속 그룹, Theme soft exclusion=`theme`, penalty는 §6.7의 원인 그룹(`tooComplex/vague=overall`), baseline/consensus/policy/clamp=`overall`.
- reserved factorId: `neutralBaseline`, `consensus`, `adjustmentClamp`, `finalClamp`, `preferCompleted`. penalty는 reason id, 나머지는 실제 factor id다.
- anchorWorkIds: similarity=[best], consensus=실제 supporter id 정렬, factor penalty=source disliked ids 정렬, vague=max source 1개, 나머지=[]다.
- axisPreferenceDirection: 0이 아닌 Axis adjustment에서만 §6.6의 `higher/lower`를 기록하며, Theme adjustment와 다른 source에는 없다.
- 설명 가능: similarity, 0이 아닌 adjustment/soft exclusion, factor-backed penalty만 true. baseline/consensus/vague/policy/clamp는 false다.
- 내부 계산 후 출력은 소수 12자리로 반올림한다. contribution은 절댓값 내림차순→source/group/factor/axis preference direction/anchor ids 오름차순이다. `tasteScore=sum(contribution.value)`가 반올림 허용오차에서 성립한다.

### 6.10 실험 Baseline v1

Baseline은 G1/G2에서만 쓰는 Genre+시장+축적도 control이다. 제품 Taste 점수에는 사용하지 않으며 G2 결과를 보기 전에 `BASELINE_VERSION="v1"`로 고정한다.

```text
genreAnchorScore = max(genreJaccard(candidate, anchor) × reactionWeight)
marketScore       = bayesianRating / 5
baselineScore     = q12(
  0.60 × genreAnchorScore + 0.30 × marketScore + 0.10 × maturity
)
```

- Genre는 중복 제거 set의 binary Jaccard이며 한쪽이라도 비면 0이다. positive anchor와 reactionWeight는 §6.3을 재사용하고 0개면 빈 결과다.
- best Genre anchor는 raw match 내림차순 leader cohort와 §6.4 tolerance, 최종 workId 오름차순으로 고른다. `genreAnchorScore=0`이면 공개 bestAnchorId는 null이고 Genre contribution·이유·Anchor를 만들지 않는다.
- 정렬은 공개 `baselineScore desc → workId asc`다. q12가 같으면 workId 순서다.
- Taste와 동일 recommendation eligibility, catalog 안 positive anchor, 읽음·하차·숨김·불호 제외, Axis/Theme exclude, catalog/context 검증을 사용한다. catalog 밖 record는 계산에서 제외한다. soft adjustment·penalty·consensus·confidence는 Baseline score에 넣지 않는다. Slice 3 profile의 네 policy는 모두 false다.
- 기본 리스트 제약을 공유한다. overlap>0의 anchor cap key는 bestAnchorId, 0이면 `none:{workId}`다. Discovery 창은 `baselineScore >= q12(overallTopBaselineScore-0.10)`이고 기본 1~2다.

```ts
type BaselineContribution = {
  source: "genre" | "market" | "maturity";
  group: "genre" | "overall";
  factorId: GenreTag | "bayesianRating" | "maturity";
  value: number;
  anchorWorkIds: string[];
  explainable: boolean;
};

type BaselineRecommendation = {
  workId: string;
  baselineScore: number;
  bestAnchorId: string | null;
  genreScore: number; // q12 reaction-weighted genreAnchorScore
  bayesianRating: number;
  maturity: number;
  contributions: BaselineContribution[];
};
```

- Genre 항은 best anchor와 공유하는 tag별 `0.60×reactionWeight/unionSize`, market은 `0.30×bayesianRating/5`, maturity는 `0.10×maturity`다. market/maturity anchor ids는 빈 배열이다.
- 실제 1권 reviewAverage와 reviewCount>0이 있을 때만 market 설명 가능, volumeCount>0일 때만 maturity 설명 가능이다. prior-only market은 점수에 남지만 설명하지 않는다.
- zero contribution은 생략한다. 공개 `baselineScore`, `genreScore`, `bayesianRating`, `maturity`, `contribution.value`는 모두 q12다. contribution은 절댓값 내림차순 뒤 source/factor/anchor 오름차순이며 `abs(sum-baselineScore)<=1e-11`이다.
- Baseline 이유는 explainable contribution의 `value desc → source/factor/anchor` 첫 1개만 사용하고 caution/confidence는 만들지 않는다. 구조화 문장은 선택 contribution identity를 그대로 반환한다.
- Baseline exact template은 `src/lib/strings.ts`에 다음 값으로 둔다.
  - `baselineGenreWithAnchor="『{anchorTitle}』と「{factorLabel}」が共通しています。"`
  - `baselineGenreWithoutAnchor="「{factorLabel}」のジャンル一致を順位に反映しています。"`
  - `baselineMarketObserved="第1巻のレビュー情報を順位に反映しています。"`
  - `baselineMaturity="刊行の蓄積を順位に反映しています。"`
- Genre 이유는 bestAnchorId 제목이 resolve되면 withAnchor, 아니면 withoutAnchor를 쓴다. market/maturity에는 placeholder가 없다. 보간은 §6.9의 단일 비재귀 pass다.

---

## 7. 검증 전략

### 단계 게이트

1. **Sanity Check (동결 cohort 50작품, 본인+지인 2~3명):** cohort는 정확히 50개의 서로 다른 `recommendationEligible` Work이며 evidence audit·블라인드 재태깅·CLI 리포트 사이에 동일해야 한다. `annotation-guide.md`의 Art 근거 정책을 제목 예외 없이 전 작품·전 축에 적용하고, coverage 통과를 근거 검수 완료로 간주하지 않는다. CLI 리포트로 Top 10을 육안 검증한다. 통과 기준 — 명백히 이상한 Top 10 없음 / 소수 취향 생존 / unknown 다수 작품 과대평가 없음 / 부정 사유가 올바른 팩터에만 작동.
2. **블라인드 테스트 (150작품):** 승인된 50작품을 교체·약화하지 않고 evidence-complete 100작품을 추가한다. 역할 범위는 Anchor 30~40 / Bridge 30~40 / Discovery 70+다. Baseline(장르 중첩+시장 신호+축적도)과 Taste Engine의 출처를 숨기고 설명 공개 전/후 2단 설문을 로컬 웹 하니스에서 수행한다.
3. **사람 경로 GO 기준 (방향성 판단, 통계적 유의성 주장 안 함):** 정확히 10명의 고유하고 완전한 사람 결과에서 Taste 또는 동률 7명 이상 / Unknown Want-to-Read 엄격 우세 / Taste Explanation Agreement 70% 이상 / Disliked Leakage 악화 없음 / Holdout Recall@10 열세 없음을 모두 만족해야 한다.
4. **사용자 승인 모델 패널 경로:** 사람 응답이나 사람 지표를 합성하지 않는다. 동결된 G2 evidence bundle에 대한 Local/Gemini/Grok/GPT-5.6 Pro의 hash-bound 조건 없는 만장일치 GO와 현재 사용자의 사전 승인이 있을 때만 제품 방향 게이트를 열 수 있다. 이는 사람 검증을 대체 측정한 결과가 아니다.
5. 어느 허용 경로로든 G2 GO를 받은 이후에만 Web MVP 본격 구현을 시작한다. 2회 수정 후에도 열세이고 DNA 콘텐츠 가치도 없으면 범위 축소·방향 전환을 검토한다.

### G2 참가자 유입과 identity

1. 하니스는 같은 client wizard를 사용하는 두 개의 문서화된 정적 진입점 `/human/`과 `/synthetic-pilot/`을 제공한다. 진입점은 wizard 시작 전에 respondent를 고정하며 실행 중 변경할 수 없다. `/human/`은 정확히 `{ kind: "human" }`, `/synthetic-pilot/`은 정확히 `{ kind: "syntheticPilot", label: "manual-round-trip" }`을 결과에 기록한다. 두 진입점은 engine identity나 A/B mapping을 final submit 전에 노출하지 않는다.
2. 두 진입점의 첫 단계는 다음 두 입력만 받는다.
   - `participantId`: 길이 1~64, `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`인 가명 ID.
   - 로컬 `ExperimentProfileV1` JSON 파일 1개.
3. respondent를 정하는 query/hash, 숨은 control, 빌드 환경값, 파일 내용 추론, 결과 편집 경로는 허용하지 않는다.
4. profile은 기존 strict schema를 통과하고 `profile.profileId === participantId`여야 한다. positive anchor는 6~10개, distinct negative source는 0~3개, 네 policy는 모두 false여야 한다. Slice 3의 5~10 positive anchor 계약은 변경하지 않고 G2 경계가 6~10을 추가 검증한다.
5. 모든 record workId는 catalog에 있어야 한다. positive anchor는 `recommendationEligible=true`여야 하고, 아래 holdout 뒤 공통 후보 필터에서 선택된 holdout이 다시 후보가 되지 못하는 profile은 입력 오류다.
6. profile import는 Slice 4의 의도된 입력 surface다. 프로필 작성 UI, 계정, 이메일, 비밀번호, Google 로그인, 서버 저장은 범위 밖이다. 고정 더미 이메일도 결과나 DOM에 저장하지 않는다. 장기 Google 계정 지원은 별도 post-MVP 결정이며 이 로컬 검증 계약의 식별자나 auth 추상화를 만들지 않는다.
7. participantId는 한 집계 안에서 고유하다. 표시명·실명·이메일·자유서술 개인정보는 수집하지 않는다.

### G2 결정론적 holdout

1. `positiveAnchorCount`는 catalog에 존재하는 distinct `favorite | liked` record 수다. G2에서는 6~10만 허용한다.
2. `holdoutCount = min(2, positiveAnchorCount - 5)`다. 따라서 6개면 1개, 7~10개면 2개를 holdout하고 엔진에는 항상 최소 5개 anchor가 남는다.
3. 각 positive anchor의 key는 다음 UTF-8 바이트의 SHA-256 lowercase hex다.

   ```text
   konocomics-g2-holdout-v1\0{catalogVersion}\0{participantId}\0{workId}
   ```

4. key 오름차순, 동률이면 code-unit workId 오름차순으로 정렬한 첫 `holdoutCount` record를 고른다.
5. 선택한 **record 전체**를 두 엔진에 전달할 records에서 제거한다. 다른 record·adjustment·policy는 바꾸지 않는다. 이로써 holdout 작품은 공통 eligibility/hard exclusion을 통과할 때 양 엔진의 후보로 복원된다.
6. holdout workId는 위 선택 순서로 저장한다. 별도 seed, 현재 시간, 난수, 재추첨은 없다.

### G2 엔진 실행, native list, A/B 배치

1. 같은 post-holdout input으로 Taste와 Baseline을 각각 정확히 한 번 실행한다. 각 엔진이 반환한 native rank 1~10을 그대로 사용한다. 리스트가 10개 미만이면 실제 N개만 사용하고 낮은 후보나 다른 엔진 결과로 채우지 않는다.
2. 두 리스트를 union, 교차 dedupe, 재정렬, interleave하지 않는다. 같은 work가 두 엔진에 있으면 각 native rank에 그대로 남는다.
3. slot digest는 다음 UTF-8 바이트의 SHA-256이다.

   ```text
   konocomics-g2-slot-v1\0{catalogVersion}\0{participantId}
   ```

4. digest 첫 byte가 짝수면 Taste=`A`, Baseline=`B`; 홀수면 Taste=`B`, Baseline=`A`다. 사용자 표시는 정확히 `リストA`, `リストB`다.
5. rank는 각 native list의 1부터 N까지 보존한다. 한 리스트 안 workId 중복은 오류다.

### G2 블라인딩과 단계 전환

1. pre 단계에는 두 리스트의 title/cover/native rank와 작품별 질문만 보인다. engine 이름, score, confidence, best anchor, contributions, penalty, market, maturity, catalog role은 보이지 않는다.
2. 이 비밀 정보는 final submit 전 visible text, accessible name/description, DOM text, `data-*`, id/class name, URL/query/hash, JSON-LD, console log, 다운로드 파일에 넣지 않는다. 로컬 client bundle을 역분석하는 적대적 보안은 목표가 아니지만 일반 UI·DOM 검사로 출처를 알 수 없어야 한다.
3. 모든 pre 응답과 A/B/tie 선택을 확정한 뒤에만 after 단계로 간다. 뒤로 가서 pre 값을 바꿀 수 없다.
4. after 단계는 같은 두 native list/rank를 유지하고 contribution 기반 설명을 공개한다. 설명이 없으면 exact Japanese copy `説明はありません。`를 표시한다. 이 단계에서도 engine identity는 숨긴다.
5. 모든 after 응답을 final submit한 뒤에만 A/B mapping을 debrief하고 canonical result JSON을 다운로드할 수 있다.
6. 새로고침·닫기는 draft를 영속하지 않는다. 로컬 파일·DB·브라우저 storage 없이 다시 시작한다.

### G2 질문과 exact Japanese scale

pre 단계에서는 distinct work마다 familiarity와 wantToReadBefore를 각각 정확히 한 번 필수 응답한다. distinct work 순서는 `リストA` rank 순서의 첫 등장 뒤 `リストB` rank 순서의 새 work 첫 등장 순서다. 모든 distinct-work 응답을 확정한 뒤 listPreference를 참가자당 정확히 한 번 필수 응답한다.

1. familiarity — `この作品を知っていましたか？`
   - `read`: `読んだことがある`
   - `knownUnread`: `知っているが未読`
   - `unknown`: `知らなかった`
2. wantToReadBefore — `今、この作品を読みたいですか？`
   - 1 `まったく読みたくない`
   - 2 `あまり読みたくない`
   - 3 `どちらともいえない`
   - 4 `読みたい`
   - 5 `とても読みたい`
3. listPreference — `説明を見る前のおすすめ一覧として、どちらが自分に合っていますか？`
   - `A`: `リストA`
   - `B`: `リストB`
   - `tie`: `同じくらい`

after 단계에서는 slot/rank/work occurrence마다 다음을 응답한다. 순서는 A rank 1~N, B rank 1~N이다.

1. wantToReadAfter — pre와 같은 질문·1~5 scale, 필수.
2. agreement — `このおすすめ理由は、あなたの好みとの関係を正しく説明していますか？`
   - 1 `まったく当てはまらない`
   - 2 `あまり当てはまらない`
   - 3 `どちらともいえない`
   - 4 `当てはまる`
   - 5 `とても当てはまる`
3. 해당 occurrence에 실제 설명이 있으면 agreement 1~5가 필수다. 설명이 없으면 agreement 질문을 표시하지 않고 값은 반드시 `null`이다.
4. 같은 work가 A/B 양쪽에 있어도 familiarity와 wantToReadBefore는 공유 응답 한 개다. wantToReadAfter와 agreement는 slot/rank/work별 별도 응답이다.

### G2 결과 schema와 canonical file boundary

구조는 아래 의미를 정확히 따른다. 구현은 strict Zod object와 literal/enum/int 범위를 사용한다.

```ts
type G2ResultV1 = {
  format: "konocomics-g2-result";
  schemaVersion: 1;
  contractVersion: "g2-v1";
  participantId: string;
  respondent:
    | { kind: "human" }
    | { kind: "syntheticPilot"; label: "manual-round-trip" };
  catalogVersion: string;
  factorDictionaryVersion: "v1";
  baselineVersion: "v1";
  profile: ExperimentProfileV1;
  holdoutWorkIds: string[];
  slots: {
    A: {
      engine: "taste" | "baseline";
      items: { rank: number; workId: string; explanationAvailable: boolean }[];
    };
    B: {
      engine: "taste" | "baseline";
      items: { rank: number; workId: string; explanationAvailable: boolean }[];
    };
  };
  preResponses: {
    workId: string;
    familiarity: "read" | "knownUnread" | "unknown";
    wantToReadBefore: 1 | 2 | 3 | 4 | 5;
  }[];
  listPreference: "A" | "B" | "tie";
  postResponses: {
    slot: "A" | "B";
    rank: number;
    workId: string;
    wantToReadAfter: 1 | 2 | 3 | 4 | 5;
    agreement: 1 | 2 | 3 | 4 | 5 | null;
  }[];
};
```

1. result는 최대 1 MiB regular file, fatal UTF-8, BOM 없음, LF only다. exact serialization은 `JSON.stringify(validatedValue, null, 2) + "\n"`이다.
2. key insertion order는 위 type의 field order, slot은 A→B, arrays는 holdout/native list/question 순서다. input bytes를 parse·strict validate·재직렬화한 bytes와 비교해 canonical이 아니면 거부한다. 이로써 duplicate JSON member, CRLF, key reorder, extra whitespace도 허용하지 않는다.
3. aggregator는 제출된 파생값을 신뢰하지 않는다. 제공된 catalog/context와 embedded profile로 다음을 재계산하고 byte/identity가 다르면 전체 파일을 거부한다: profile/participant 결합, holdout, post-holdout records, Taste/Baseline native list, slot mapping, rank/work, explanation availability, pre/post required key set과 순서, agreement null 규칙.
4. catalog/context는 각각 기존 16 MiB strict 경계와 semantic validation을 통과해야 한다. `catalogVersion`, factor dictionary, Baseline version, context catalogVersion이 result와 모두 같아야 한다.
5. 한 집계의 duplicate participantId와 duplicate input path/identity를 거부한다. result와 output 경로는 달라야 하며 output은 기존 private temp + atomic rename을 재사용한다.
6. result에는 설명 text, score, contribution, 실명, 이메일, 자유서술을 저장하지 않는다. aggregator가 current frozen engine에서 explanation availability만 재계산한다.

### G2 공통 occurrence와 leakage 판정

1. metric occurrence는 `(participantId, engine, native rank, workId)`다. 같은 work가 양 엔진 list에 있으면 엔진별 한 번씩 센다. 같은 work의 pre 응답은 두 occurrence가 같은 값을 참조한다.
2. Disliked Leakage는 두 엔진 모두 같은 순수 predicate를 사용한다. candidate마다 remaining positive anchors로 `calculatePositiveAnchorScore`를 계산해 그 candidate의 Taste best positive anchor를 고르고, 기존 `calculateNegativePenalties`의 factor-backed reason trigger를 평가한다.
3. `FACTOR_BACKED_NEGATIVE_REASON_IDS` 중 하나 이상이 trigger되면 leakage다. `vagueDislike`, `external:*`, 단순 disliked reaction만 있고 factor-backed reason이 없는 record는 leakage predicate에 쓰지 않는다.
4. 이 predicate는 list를 만든 엔진이나 그 엔진의 contribution/bestAnchor를 보지 않는다. 따라서 Baseline occurrence도 Taste occurrence와 동일 candidate/profile predicate로 판정한다.

### G2 지표의 정확한 분자·분모

모든 aggregate count는 유효한 `respondent.kind="human"` 결과만 사용한다. 각 rate는 분자/분모 integer를 보존하고 표시에만 q12를 적용한다. 비교와 70% threshold는 반올림 값이 아니라 integer cross multiplication으로 판정한다.

1. **사용자별 승패**
   - listPreference slot을 hidden mapping으로 해석해 `taste | baseline | tie`로 저장 없이 계산한다.
   - `tasteOrTieCount = tasteWinCount + tieCount`다. 사람 GO는 정확히 10명 중 `tasteOrTieCount >= 7`이다.
   - strict `tasteWinCount`도 별도 보고하지만 threshold는 두지 않는다.
2. **Unknown Want-to-Read Rate(engine)**
   - denominator: 해당 engine occurrence 중 familiarity=`unknown`인 수.
   - numerator: 그중 wantToReadBefore≥4인 수.
   - 같은 overlap work는 각 engine에 한 번씩 센다. denominator 0이면 rate=`null`이다.
   - 사람 GO는 두 denominator가 모두 >0이고 Taste fraction이 Baseline fraction보다 **strictly greater**여야 한다.
3. **Explanation Agreement(engine)**
   - denominator: 해당 engine의 전체 native list occurrence 수. 설명이 없는 occurrence도 포함한다.
   - numerator: explanationAvailable=true이고 agreement≥4인 occurrence 수.
   - 설명 없음은 agreement=null이며 numerator가 아니므로 누락 설명이 rate를 부풀리지 않는다.
   - 사람 GO는 Taste denominator>0이고 Taste numerator/denominator≥0.70이다. Baseline rate는 diagnostic이다.
4. **Explanation Lift(engine)**
   - 실제 explanationAvailable=true인 occurrence의 `wantToReadAfter - wantToReadBefore` 산술평균이다.
   - denominator 0이면 null이다. explanation availability count도 함께 보고한다. 방향 진단용이며 GO threshold는 없다.
5. **Disliked Leakage@10(engine)**
   - denominator: 해당 engine의 전체 native list occurrence 수.
   - numerator: 위 공통 leakage predicate가 true인 occurrence 수.
   - denominator 0이면 null이다. 사람 GO는 두 denominator>0이고 Taste fraction≤Baseline fraction이다.
6. **Holdout Recall@10(engine)**
   - denominator: 모든 participant의 holdoutWorkIds 수 합.
   - numerator: 해당 engine native list에 복구된 holdout work 수. 한 participant의 holdout은 distinct이고 engine당 최대 한 번 센다.
   - valid human result가 있으면 denominator는 항상 >0이어야 한다. 사람 GO는 Taste fraction≥Baseline fraction이다.
7. per-participant raw counts와 preference verdict를 participantId code-unit 순으로 함께 보고한다. aggregate는 participant마다 먼저 rate를 평균내는 macro 변형을 GO 판정에 쓰지 않는다.

### G2 집계 CLI와 verdict

문서화된 호출은 lifecycle noise가 stdout에 섞이지 않게 다음으로 고정한다.

```text
pnpm --silent g2:aggregate
  --result, -r <json>   # 반복 가능
  --catalog <json>      # 기본 data/generated/recommendation-profile-catalog-v1.json
  --context <json>      # 기본 data/generated/recommendation-profile-context-v1.json
  --output, -o <md|->   # 기본 stdout
  --help, -h
```

1. result 미지정 시 `data/local/g2-results/*.json`을 읽는다. 명시·기본 result 모두 parse 뒤 participantId 오름차순이다.
2. unknown flag, duplicate scalar flag는 usage error 2; data/runtime error 1; 성공 0이다. stdout은 deterministic Markdown만, 진단은 stderr만 쓴다.
3. report 순서는 identity/catalog metadata → accepted human/pilot counts → five GO criteria table → aggregate metric counts/rates → participant rows → diagnostics(Explanation Lift/coverage)다. 생성 시각, 절대 경로, locale, env, 네트워크, 자유서술은 없다. LF와 마지막 newline 1개다.
4. exactly 10 unique complete human result면 위 다섯 criterion을 모두 계산해 모두 PASS일 때만 `GO`, 아니면 `REVISE`다. human이 10명이 아니면 `INCOMPLETE`; 숫자 기준을 통과한 것처럼 표시하지 않는다.
5. `syntheticPilot` result는 round-trip 검증과 diagnostic에만 표시하고 모든 human 분자·분모·10명 수에서 제외한다. pilot만으로 GO/REVISE를 만들지 않는다.

### G2 사람 경로와 사용자 승인 모델 패널 경로

두 경로를 혼합하거나 같은 의미로 보고하지 않는다.

1. **Human path**
   - 정확히 10개의 고유하고 완전한 `respondent.kind="human"` result와 위 숫자 기준으로만 GO/REVISE한다.
   - 결과 문구는 `humanValidation: "complete"`, `decisionBasis: "ten-human-blind-test"`다.
2. **User-authorized model-panel path**
   - 10명 human response나 숫자 metric을 만들지 않는다. `authorizedModelProxy` row도 만들지 않는다.
   - 한 개의 `syntheticPilot`은 UI→download→aggregator round-trip 증거일 뿐 participant evidence가 아니다.
   - frozen 150-work catalog/context, engine identity, 구현 diff, contract/metric tests, deterministic aggregate output, manual pilot 증거를 하나의 hash manifest로 묶어 Local/Gemini/Grok/GPT-5.6 Pro 네 reviewer에게 동일 제공한다.
   - 네 reviewer의 hash-bound unqualified GO와 현재 사용자의 사전 승인으로만 product direction gate를 열 수 있다. 한 reviewer라도 REVISE이면 열지 않는다.
   - 결정 artifact는 exact `humanValidation: "not-run"`, `decisionBasis: "user-authorized-model-panel"`을 기록하고 human metrics는 `null`/`not-run`으로 둔다. “10명 다독자 통과”, 통계적 우세, human preference validation을 주장하지 않는다.
   - 이 GO는 Slice 5 진행을 허용하는 사용자 승인 제품 결정이지, 실행하지 않은 human criteria의 대체 측정값이 아니다.

### 핵심 지표

`Unknown Want-to-Read Rate` / `Explanation Agreement` / `Explanation Lift` / `Disliked Leakage@10` / `Holdout Recall@10` / 사용자별 승패.

### REVISE 진단표 (확정)

설명은 정확한데 읽고 싶지 않음 → Catalog Hook·진입성 / Holdout 좋고 Discovery 약함 → Bridge·Discovery 보강 / 추천 좋고 설명 부정확 → contribution·템플릿 수정 / 인기작만 상위 → tie-break 범위·Catalog 편향 수정.

---

## 8. 운영·법적 확정 사항

- Rakuten: 브라우저 직접 호출 금지(Route Handler 프록시), 캐시 TTL(가격·재고 24h / 기타 3개월), `Supported by Rakuten Developers` 크레디트, Affiliate 관계 표시, 약관 버전·검토일 기록.
- 표지: 원본 비율 유지, 크롭·누끼·텍스트 합성·콜라주 금지, 블러 배경은 동일 URL 재사용 + `aria-hidden`, 자체 CDN 영구 복제 금지.
- 배포: 향후 승인된 릴리스는 **Vercel Git Integration**을 사용한다. `main`은 Production, 그 외 브랜치·PR은 Preview로 배포한다. `main` 병합에는 GitHub `CI / quality` 성공을 요구하고, 같은 job을 Vercel의 필수 Deployment Check로도 연결하며, Vercel Production build에서도 `catalog:validate`를 필수 게이트로 실행한다. Vercel Hobby는 개인·비상업 용도로만 사용하며, 공개 운영의 성격이 이를 벗어나면 출시 전에 Pro 이상으로 전환한다. 이 대상 계약은 Slice 10의 로컬 구현·검증 완료 증거가 아니며, 현재 GitHub/Vercel mutation은 별도 사용자 승인 전까지 실행하지 않는다.
- 상표: **[사용자 결정 필요]** 공개 전 J-PlatPat·도메인·SNS 핸들 확인. 내부 개발명으로는 즉시 사용 가능.
