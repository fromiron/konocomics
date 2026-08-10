# KonoComics
## **kono**co**mi**cs — 프로젝트 정의·브랜딩·추천 로직·MVP 구현 계획

> **문서 상태:** 구현 전 통합 기획안 v0.2  
> **제품명:** KonoComics  
> **로고 표기:** **kono**co**mi**cs  
> **내부 엔진명:** Manga Taste Engine  
> **초기 대상:** 일본 만화 / 일본어 우선 / 소년·청년 액션·판타지·역사·SF·미스터리 중심  
> **첫 검증 목표:** 단순 장르+시장 인기 Baseline보다 세부 취향 기반 추천이 실제로 더 나은지 증명한다.

---

# 1. 프로젝트 서머리

## 한 줄 정의

> **KonoComics**는 사용자가 좋아하거나 싫어한 만화를 바탕으로 장르뿐 아니라 **전개·성장·문제 해결·전략·캐릭터 관계·톤·심리적 피로도·작화 성향**을 추론하고, 아직 읽지 않은 만화를 **왜 추천했는지 설명하면서** 제시하는 개인 만화 취향 서비스다.

## 해결하려는 문제

기존 만화 추천은 주로 다음 신호에 의존한다.

```text
인기순
판매량순
같은 장르
같은 작가
별점
함께 본 작품
자연어 AI 질의
```

그러나 실제 독자 취향은 다음처럼 복합적이다.

```text
판타지를 좋아하지만 모든 판타지를 좋아하지 않는다.
성장물은 좋아하지만 반복적인 수치 상승은 싫다.
액션에서는 타격감과 현실적인 인체 표현을 중요하게 본다.
머리를 써서 해결하는 전개를 선호한다.
어두운 세계관은 괜찮지만 심리적 피로가 심한 작품은 싫다.
진지한 이야기 안의 캐릭터 개그를 좋아한다.
이미 읽은 작품이 추천에 반복해서 나오는 것을 싫어한다.
```

이 서비스는 “무슨 장르를 좋아하는가”보다 다음을 학습한다.

> **그 작품의 무엇을 좋아했고, 무엇 때문에 싫어하거나 하차했는가?**

## 제품의 세 가지 역할

```text
Manga DNA
→ 첫 유입과 공유를 만드는 취향 분석 콘텐츠

Explainable Recommendation
→ 아직 읽지 않은 작품을 찾게 하는 핵심 효용

Library / Feedback
→ 이미 읽은 작품을 제거하고 추천을 계속 개선하는 유지 장치
```

## 핵심 차별점

```text
출판사를 가로지르는 개인 취향 프로필
+
이미 읽은 작품과 실패한 추천의 누적
+
추천 근거의 명시
+
취향 데이터의 Export 및 이동성
```

핵심 문장:

> 플랫폼은 사용자가 무엇을 샀는지 안다.  
> **KonoComics**는 사용자가 왜 그것을 좋아했는지 이해하려 한다.

---

# 2. 브랜드와 네이밍

## 2.1 제품명

```text
제품명: KonoComics
로고 표기: **kono**co**mi**cs
일본어 표기: コノコミックス
내부 엔진명: Manga Taste Engine
대표 기능명: Manga DNA
```

`KonoComics`는 사용자에게 노출되는 제품명이다. `Manga Taste Engine`은 추천 로직과 프로젝트 설명에 쓰는 내부 엔진명으로 유지한다.

브랜드 구조는 다음처럼 분리한다.

```text
KonoComics
→ 사용자가 기억하는 제품명

Manga Taste Engine
→ 취향 분석·추천 계산 엔진

Manga DNA
→ 사용자가 보는 취향 분석 결과
```

## 2.2 네이밍 의도

### 숨겨진 취향 `Konomi`의 시각화

로고는 다음처럼 굵기와 색의 차이를 이용한다.

```text
**kono**co**mi**cs
```

굵게 강조되는 `kono`와 `mi`를 연결하면 `konomi`가 드러난다.

```text
kono + mi
= konomi
= 好み
= 취향
```

이는 단어 안에 숨겨진 `Konomi`를 유저가 직관적으로 발견하게 만드는 기믹이다. 서비스가 작품 안에 숨어 있는 취향 팩터를 찾아내고 사용자에게 시각화한다는 핵심 가치와 직접 연결된다.

```text
로고 안에 숨겨진 Konomi
        ↓
사용자가 발견하는 자신의 숨은 취향
        ↓
Manga DNA와 추천 이유
```

즉, 네이밍과 로고 자체가 제품의 작동 방식을 압축한다.

### 일본어 중의성 — このコミックス

일본어권 사용자가 소리 내어 읽으면 `KonoComics`는 자연스럽게 다음처럼 들린다.

```text
コノコミックス
このコミックス
= 이 만화
```

이는 추천 서비스의 정체성과 잘 맞는다.

```text
이 만화가 바로 당신 취향이다.
다음에 읽을 만화는 이것이다.
```

따라서 `KonoComics`는 두 층의 의미를 가진다.

```text
시각적 의미:
**kono**co**mi**cs 안에 숨은 Konomi / 好み

음성적 의미:
このコミックス / 이 만화
```

## 2.3 디자인 및 브랜딩 시너지

### 극단적인 타이포그래피 대비

로고는 추가 그래픽 없이 텍스트 자체로 완성되도록 한다.

```text
**kono**co**mi**cs
```

권장 방향:

```text
kono: Bold / 700 전후
co: Regular / 400 전후
mi: Bold / 700 전후
cs: Regular / 400 전후
```

굵기 차이를 충분히 주되, 전체 단어 `konocomics`가 읽히지 않을 정도로 나머지 글자를 약하게 만들지는 않는다.

### 컬러 포인트

무채색 텍스트를 기본으로 하고, `kono`와 `mi`에만 브랜드 포인트 컬러를 적용한다.

```text
[kono] co [mi] cs
  ↑       ↑
  브랜드 포인트 컬러
```

사용 위치:

```text
Splash screen
Landing hero
Onboarding 완료 화면
Manga DNA reveal
Share card
App icon의 보조 그래픽
```

### Logo reveal

첫 방문 또는 Splash에서만 짧게 의미를 보여준다.

```text
konocomics
↓
[kono]co[mi]cs
↓
konomi = 好み
↓
konocomics
```

반복 애니메이션으로 사용하지 않는다. `prefers-reduced-motion`에서는 정적 로고를 표시한다.

## 2.4 카피

메인 태그라인 후보:

```text
好みから見つける、次のマンガ。
```

네이밍과 직접 연결되는 카피:

```text
このコミックスが、あなたの好み。
```

제품 설명형 카피:

```text
好きなマンガから好みを分析し、
まだ読んでいない次の一冊を提案します。
```

취향 발견을 강조하는 카피:

```text
コミックスの中に、あなたの好みが見えてくる。
```

## 2.5 브랜드 사용 원칙

```text
정식 제품명: KonoComics
로고 표기: **kono**co**mi**cs
일본어 표기: コノコミックス
엔진명: Manga Taste Engine
기능명: Manga DNA
```

문서·코드·마케팅에서의 사용 구분:

```text
사용자-facing 문구
→ KonoComics

추천 로직과 내부 모듈
→ Manga Taste Engine

취향 분석 결과 화면
→ Manga DNA
```

## 2.6 상표·검색성 메모

`KonoComics`는 디자인적으로 강하지만, 정식 공개 전에는 다음을 확인한다.

```text
도메인
SNS handle
J-PlatPat 상표 검색
App Store / Google Play 검색
同一·類似 호칭
```

검색 대상:

```text
KonoComics
KONO COMICS
KONO-COMICS
コノコミックス
コノ コミックス
KONOMI
コノミ
```

MVP 내부 개발명으로는 바로 사용 가능하다. 공개 서비스명으로 확정하기 전에는 상표와 핸들 충돌을 확인한다.


---

# 3. 우선 검증할 제품 가설

## 가설 A — 세부 취향 추천의 가치

> 만화를 많이 읽는 사용자는 단순 장르·인기순보다 자신이 좋아한 작품의 세부 요소를 반영한 추천을 더 가치 있게 느낀다.

## 가설 B — 설명의 신뢰 효과

> “93% 일치” 같은 근거 불명의 숫자보다, 어떤 작품과 어떤 요소가 비슷한지 설명하는 추천이 더 신뢰받는다.

## 가설 C — 피드백의 누적 가치

> 초기 추천이 어느 정도 맞는다면 사용자는 읽음·좋아요·하차·불호 이유를 추가로 입력할 의향이 있다.

## 가설 D — Discovery 가치

> 유명작을 다시 보여주는 것보다, 사용자가 몰랐지만 취향에 맞는 작품을 발견하게 하는 경험이 더 강한 제품 가치를 만든다.

## 가설 E — 취향 분석의 콘텐츠성

> 사용자는 추천뿐 아니라 자신의 `Manga DNA`를 확인하고 보정하는 과정도 재미있는 결과물로 느낀다.

---

# 4. 확정된 제품 원칙

1. **취향 적합도와 시장 인기도를 분리한다.**
2. 시장 신호는 취향 점수를 뒤집는 큰 가산점이 아니라, 유사한 후보 사이의 제한적 tie-break로만 사용한다.
3. 데이터가 없다는 사실을 낮은 취향값으로 해석하지 않는다.
4. 사용자가 작품을 선택하지 않았다는 사실을 불호로 해석하지 않는다.
5. 읽기 상태와 감상 반응을 분리한다.
6. 명시적 불호와 데이터 불확실성을 분리한다.
7. 추천 설명은 실제 점수 기여 요소에서 생성한다.
8. 런타임 LLM이 후보와 순위를 임의로 결정하지 않는다.
9. 다중 취향을 하나의 평균 사용자 벡터로 뭉개지 않는다.
10. 초반 진입 경험과 장편 후반부의 변화를 혼합하지 않는다.
11. 추천 데이터가 부족한 작품을 높은 확신으로 추천하지 않는다.
12. MVP에서는 인프라보다 Catalog와 추천 정확도 검증에 투자한다.

---

# 5. 초기 타깃과 범위

## 초기 사용자

```text
일본 만화를 많이 읽는다.
인기순 추천에서는 이미 읽은 작품이 반복된다.
새 작품을 찾고 싶지만 장르 필터만으로는 부족하다.
추천 이유가 납득 가능하기를 원한다.
```

## 첫 검증 장르 범위

초기부터 일본 만화 전체를 동일한 깊이로 지원하지 않는다.

```text
우선 지원
- 액션
- 판타지
- 역사
- SF
- 미스터리

인접 지원
- 코미디
- 무술
- 호러
- 일상
- 로맨스
- 스포츠
```

순정·여성·아동·요리·전문 직업물 등을 영구 제외하지는 않지만, 첫 Catalog에서는 팩터 공간을 충분히 채울 수 있는 범위에 집중한다.

## 언어

```text
Phase 1: 일본어 UI
Phase 2: 한국어 UI
데이터 모델: 언어 독립 ID + 다국어 제목/설명
```

---

# 6. 가장 작은 제품 범위

## 사용자 흐름

```text
1. 좋아한 작품 5개 이상 선택
2. 권장 수량인 8개까지 선택
3. 선택적으로 싫어했거나 하차한 작품 0~3개 추가
4. 특히 중요하게 보는 요소 최대 3개 선택
5. 피하고 싶은 요소 최대 3개 선택
6. Manga DNA 확인 및 간단한 보정
7. 아직 읽지 않은 작품 10개 추천
8. 읽고 싶음 / 이미 읽음 / 관심 없음 입력
9. 실제 감상 또는 하차 이유 입력
10. 다음 추천에 반영
```

## 핵심 화면

```text
/
→ KonoComics Landing 및 짧은 제품 설명

/onboarding
→ 좋아한 작품과 부정 Anchor 선택

/taste
→ Manga DNA와 명시적 보정

/recommendations
→ 추천 10개와 추천 이유

/works/[workId]
→ 작품 상세, 표지, 블러 배경, 추천 근거, Rakuten 연결

/library
→ 읽음 상태와 감상 관리

/settings
→ 취향 보정, 추천 모드, Export/Import, 데이터 삭제
```

## MVP 기능

- 작품 선택과 검색
- Manga DNA 생성
- 설명 가능한 추천 10개
- 읽음·읽는 중·완독·하차·숨김 관리
- 최애·좋음·보통·별로 감상 관리
- 관심 없음 이유와 하차 이유
- Rakuten 상품 링크
- 로컬 데이터 Export / Import
- 반응형 웹과 설치 가능한 PWA

## MVP에서 하지 않는 것

```text
실시간 LLM 추천
Vector DB
Collaborative Filtering
사용자 리뷰·댓글·팔로우·DM
커뮤니티 리뷰 전문 수집
범용 인터넷 크롤러
프리미엄 결제
광고 수익화
출판사 B2B
별도 React Native 앱
자체 전자책 뷰어
대규모 검색 서버
```

---

# 7. 표지와 이미지 사용 원칙

별도 검토에서 확인한 전제를 기준으로 다음 방향을 확정한다.

## 허용 방향

- Rakuten API가 제공하는 표지 URL을 가능한 한 그대로 사용한다.
- 전경 표지는 원본 비율을 유지한다.
- 작품 상세에서는 **동일한 이미지 URL**을 전경 표지와 강한 블러 배경에 재사용할 수 있다.
- 블러 배경은 장식 요소이므로 `aria-hidden` 처리한다.
- 표지 바깥의 그림자·테두리·배경 효과는 허용한다.
- Rakuten 상품 또는 Affiliate 링크와 출처 표시를 명확히 둔다.

## 하지 않는 것

```text
표지 일부 크롭
캐릭터 누끼
표지 위 직접 텍스트 합성
표지 여러 장을 잘라 만든 콜라주
만화 컷 저장
허가받지 않은 키비주얼 사용
자체 이미지 CDN에 영구 복제
```

## 구현 예

```tsx
<div className="relative isolate overflow-hidden">
  <img
    aria-hidden="true"
    src={coverUrl}
    alt=""
    className="absolute inset-0 size-full scale-125 object-cover opacity-30 blur-3xl"
  />

  <img
    src={coverUrl}
    alt={`${title} 表紙`}
    className="relative h-auto w-full object-contain"
  />
</div>
```

Rakuten Books API의 최대 기본 이미지 URL은 200×200이므로, 전경 표지를 과도하게 확대하지 않는다. 블러 배경에는 낮은 해상도가 오히려 문제가 적다.

출시 전에는 최신 약관·크레디트 표시·캐시 정책을 다시 확인하고 기록한다.

---

# 8. Catalog 전략

Catalog를 하나의 목록으로 취급하지 않고 역할에 따라 분리한다.

## 8.1 Onboarding Anchor Catalog

역할:

- 사용자가 좋아한 작품을 빠르게 찾게 한다.
- 서로 다른 취향 축을 판별한다.
- 인지도가 어느 정도 높다.
- 핵심 팩터가 충분히 검수됐다.
- 서로 비슷한 유명작만 중복하지 않는다.

초기 규모:

```text
산식 검증: 20~30개
외부 실험: 30~40개
공개 MVP: 필요에 따라 60~100개
```

Anchor는 장르별 인기작이 아니라 다음처럼 **강하게 대비되는 취향 판독기** 역할을 해야 한다.

```text
빠른 전개 ↔ 느린 전개
밝음 ↔ 어두움
낮은 정신적 피로 ↔ 높은 정신적 피로
전략 중심 ↔ 직접 전투 중심
단독 주인공 ↔ 고정 파티 ↔ 군상극
성장 보상 중심 ↔ 캐릭터·서사 중심
현실적 작화 ↔ 강한 스타일화
```

단, 작품을 선택하지 않았다는 사실은 부정 신호가 아니다. 읽음 여부와 반응을 명시적으로 받아야 한다.

## 8.2 Recommendation Catalog

역할:

- 실제 추천 후보
- Anchor와 덜 알려진 작품 사이를 연결하는 Bridge 작품
- 미독 가능성이 높은 Discovery 작품
- 핵심 Narrative·Tone 팩터 Coverage가 충분한 작품

외부 검증용 권장 구성:

```text
Anchor                  30~40
Bridge                  30~40
Discovery               70 이상
총합                    약 150
```

## 8.3 Library-only Search Catalog

역할:

- 이미 읽음 등록
- 읽는 중 등록
- 중도하차 등록
- 소유 Library 기록

Rakuten 검색 등으로 더 넓게 제공한다. Taste Metadata가 부족한 작품은 Library에는 넣을 수 있지만 추천 Anchor나 후보로는 사용하지 않는다.

```ts
type CatalogEligibility = {
  onboardingEligible: boolean;
  recommendationEligible: boolean;
  libraryOnly: boolean;
};
```

---

# 9. 데이터 원천과 책임 분리

## 9.1 Rakuten Books API — 최우선 Provider

주요 취득 필드:

```text
ISBN
제목 / 제목 가나 / 부제
seriesName 후보
저자 / 출판사
발매일
Rakuten Books 장르 ID
상품 설명
가격 / 구매 가능 상태
표지 URL
상품 URL / Affiliate URL
리뷰 평균 / 리뷰 수
미리보기 URL
```

주요 역할:

```text
Volume 식별
Work 그룹 후보
제목 검색
대표 표지
출간 축적도
시장 근거량
판매처 연결
```

Rakuten API만으로 직접 얻기 어려운 것:

```text
문제 해결형 전개
성장 보상의 명확성
전략성
관계 구조
전개 속도
개그 비중
정신적 피로도
정서적 따뜻함
작화 밀도와 동작 표현
```

현재 공식 문서 기준으로 App ID와 Access Key가 필요하므로, 브라우저에서 Rakuten API를 직접 호출하지 않고 Next.js Route Handler를 사용한다.

```text
Browser
  ↓
Next.js Route Handler
  ↓
Rakuten Books API
```

환경변수:

```text
RAKUTEN_APPLICATION_ID
RAKUTEN_ACCESS_KEY
RAKUTEN_AFFILIATE_ID
```

## 9.2 NDL Search — 서지 검증 보조

사용 목적:

- ISBN·제목·저자·출판사 검증
- Rakuten 누락 또는 충돌 확인
- canonical bibliographic metadata 보조

NDL은 취향 팩터를 제공하는 서비스가 아니다. 상업적·수익 목적 사용과 Thumbnail API에는 신청이 필요한 경우가 있으므로 데이터 제공기관별 조건을 확인한다.

## 9.3 공식 출판사 페이지 — 허용 목록형 Enrichment

MVP에서는 범용 크롤러가 아니라 **출처를 등록한 배치형 수집기**만 만든다.

수집 후보:

```text
공식 작품명
공식 권수
연재·완결·휴재 상태
공식 장르·레이블
출판사 소개문
공식 발매 목록
구조화 데이터
```

직접 확정하지 않는 항목:

```text
전투 가독성
타격감
캐릭터 매력
후반부 붕괴
결말 만족도
```

## 9.4 LLM — 오프라인 초벌 제안만

허용 용도:

```text
공식 소개문에서 Theme 후보 생성
Narrative/Tone 팩터 초안
태그 누락 후보 탐지
서로 충돌하는 데이터 표시
```

금지 용도:

```text
런타임 후보 생성
최종 Ranking 결정
근거 없는 작품 특성 생성
미확인 작품 설명 생성
```

## 9.5 수동 검수

다음은 사람이 최종 승인한다.

- Work 그룹 경계 사례
- 초반 1~3권의 핵심 Narrative·Tone 팩터
- Art 팩터
- 추천 상위에 자주 등장하는 작품
- 낮은 Confidence의 자동 제안

---

# 10. 데이터 보존 경계

Rakuten 원본 응답과 서비스 자체 데이터를 물리적으로 분리한다.

```text
Work Taste Metadata
→ 서비스가 직접 정의·검수한 영구 데이터

ProviderListing
→ Rakuten에서 취득한 갱신 가능한 데이터

ProviderCache
→ TTL과 취득 시각을 가진 제한적 캐시
```

Rakuten 공식 FAQ의 일반 캐시 기준:

```text
가격·판매 가능 정보: 24시간
기타 정보: 3개월
```

따라서 Rakuten 응답을 영구 canonical DB로 복제하지 않는다.

```ts
type ProviderListing = {
  workId: string;
  provider: "rakuten";

  isbn: string;
  imageUrl?: string;
  itemUrl?: string;
  affiliateUrl?: string;
  chirayomiUrl?: string;

  itemPrice?: number;
  availability?: number;
  reviewAverage?: number;
  reviewCount?: number;

  fetchedAt: string;
  expiresAt: string;
};
```

필수 운영 항목:

- `Supported by Rakuten Developers` 크레디트
- Affiliate 또는 광고 관계 표시
- Provider별 TTL
- 삭제 요청 대응 경로
- 약관 버전과 검토 날짜 기록

---

# 11. Work와 Volume 모델

ISBN은 작품 ID가 아니다.

```text
キングダム 1
キングダム 2
キングダム 3
```

는 서로 다른 ISBN이지만 추천에서는 하나의 Work다.

```ts
type Work = {
  id: string;

  title: string;
  titleKana?: string;
  aliases: string[];

  creators: string[];
  publisher?: string;
  demographic?:
    | "shonen"
    | "seinen"
    | "shojo"
    | "josei"
    | "children"
    | "general"
    | "unknown";

  status: "ongoing" | "completed" | "hiatus" | "unknown";
  firstPublishedYear?: number;

  genres: GenreTag[];
  themes: ThemeFactor[];
  axes: WorkAxes;

  factorScope: "entry_1_3_volumes";
  eligibility: CatalogEligibility;
  evidence: WorkEvidence;
};

type Volume = {
  id: string;
  workId: string;

  volumeNumber?: number;
  isbn: string;
  releaseDate?: string;

  editionKind:
    | "standard"
    | "digital"
    | "bunko"
    | "complete"
    | "limited"
    | "set"
    | "unknown";
};
```

MVP에서는 `Work / Volume / ProviderListing`만 사용한다. 일반판·완전판·문고판 문제로 실제 오류가 발생한 뒤에만 별도 `Edition` 계층을 추가한다.

---

# 12. Work 자동 그룹핑

Rakuten `seriesName`은 선택 필드이므로 단독 기준으로 사용하지 않는다.

초기 후보 점수:

```text
정규화된 seriesName 일치       0.40
권수·판형 제거 제목 일치        0.25
저자 일치                       0.15
출판사 일치                     0.10
연속 권 번호                    0.10
```

```ts
groupingScore =
  seriesNameMatch * 0.40 +
  normalizedTitleMatch * 0.25 +
  authorMatch * 0.15 +
  publisherMatch * 0.10 +
  volumeSequenceMatch * 0.10;
```

임시 판정:

```text
0.90 이상     자동 그룹 후보
0.70~0.89     수동 검토
0.70 미만     별도 Work 유지
```

제목 정규화 시 분리할 표현:

```text
권수 숫자
上 / 下
完全版
新装版
文庫版
特装版
限定版
電子版
セット
```

자동 결과에는 항상 `groupingConfidence`와 검수 여부를 기록한다.

---

# 13. 팩터 데이터 타입

## 13.1 Theme Tag

Theme는 존재 여부뿐 아니라 작품의 중심성을 가진다.

```ts
type ThemeFactor = {
  id: ThemeTag;
  centrality: 1 | 2;
  confidence: number;
};
```

```text
centrality 1 = 일부 에피소드 또는 서브 소재
centrality 2 = 작품의 반복적 핵심 구조
```

## 13.2 Axis Factor

```ts
type ScaleValue = 0 | 1 | 2 | 3 | 4;

type AxisFactor =
  | {
      state: "known";
      value: ScaleValue;
      confidence: number;
    }
  | {
      state: "unknown";
    }
  | {
      state: "notApplicable";
    };
```

세 상태의 의미:

```text
known + 0
→ 실제로 거의 없거나 매우 낮음

unknown
→ 아직 모름 또는 근거 부족

notApplicable
→ 조건부 하위 축을 평가할 대상 자체가 없음
```

예:

```text
로맨스가 없음
→ romance = known 0

전투가 없는 작품의 타격감
→ motionImpact = notApplicable

작화 자료가 없어 타격감을 모름
→ motionImpact = unknown
```

`notApplicable`은 조건부 하위 축에만 제한적으로 사용한다.

---

# 14. 팩터 그룹과 기본 비중

팩터가 늘어나도 특정 그룹이 자동으로 과대 가점되지 않도록 그룹 비중을 고정한다.

| 그룹 | 기본 비중 | 역할 |
|---|---:|---|
| Genre | 15% | 넓은 작품 범주 |
| Theme / Mechanic | 25% | 반복되는 소재와 구조 |
| Narrative | 25% | 전개와 해결 방식 |
| Tone / Relationship | 20% | 정서·관계·심리적 피로 |
| Art | 15% | 시각적 성향 |

사용자가 “작화가 중요하다”처럼 명시적으로 선택해도 그룹당 기본값에서 최대 `±5%p`만 움직이고 전체 합은 다시 100%로 정규화한다.

명시적 중요도는 가능하면 그룹 전체보다 그룹 내부 팩터 우선순위를 먼저 조정한다.

---

# 15. Genre와 Theme

## 15.1 Genre

```ts
type GenreTag =
  | "action"
  | "fantasy"
  | "historical"
  | "scienceFiction"
  | "mystery"
  | "sports"
  | "comedy"
  | "horror"
  | "sliceOfLife"
  | "romance";
```

Rakuten `booksGenreId`는 그대로 추천 계산에 넣지 않고 자체 Genre로 매핑한다.

## 15.2 Theme / Mechanic

초기 후보:

```ts
type ThemeTag =
  | "adventure"
  | "combat"
  | "martialArts"
  | "war"
  | "politics"
  | "survival"
  | "investigation"
  | "dungeon"
  | "crafting"
  | "cooking"
  | "territoryManagement"
  | "tournament"
  | "revenge"
  | "timeTravel"
  | "reincarnation"
  | "school"
  | "workplace"
  | "sportsCompetition"
  | "foundFamily"
  | "historicalReconstruction"
  | "postApocalypse"
  | "exploration";
```

`training`은 `progression`과 중복되므로 핵심 Scoring Theme에서 제외한다. 필요하면 설명용 태그 `trainingArc`로만 보존한다.

기존 `actionIntensity` Axis는 제거하고 `combat` Theme의 `centrality`로 대체한다.

---

# 16. 핵심 Axis 17개

모든 팩터는 **초반 1~3권 또는 첫 주요 에피소드의 진입 경험**만을 기준으로 태깅한다.

## 16.1 Narrative 그룹

| 팩터 | 0 | 2 | 4 |
|---|---|---|---|
| `progression` | 성장 보상 구조가 거의 없음 | 서서히 성장 | 성장·획득·숙련 보상이 반복적으로 명확함 |
| `problemSolving` | 우연·힘·감정적 결단 중심 | 지략과 직접 행동 혼합 | 제약을 분석하고 기발하게 해결하는 과정이 핵심 |
| `strategy` | 즉흥 대응 중심 | 전술·단기 계획 존재 | 장기 계획·전쟁·정치·자원 운영이 중심 |
| `pacing` | 첫 3권 동안 목표·상황 변화가 적음 | 일반적인 Arc 단위 변화 | 짧은 간격으로 목표·장소·상태가 크게 바뀜 |
| `mysteryReveal` | 수수께끼 구조가 거의 없음 | 비밀·반전이 일부 존재 | 단서·추리·진실 공개가 주요 보상 |
| `worldBuilding` | 배경 규칙이 최소 | 기능적인 설정 | 역사·문화·규칙·세력이 반복적으로 중요함 |

## 16.2 Tone / Relationship 그룹

| 팩터 | 0 | 2 | 4 |
|---|---|---|---|
| `characterArcWeight` | 사건·세계·목표 중심 | 사건과 인물 변화가 균형 | 인물 동기·변화·관계가 핵심 보상 |
| `relationshipStructure` | 단독 주인공 중심 | 고정 파티·핵심 조연 반복 | 복잡한 군상극·다중 관계 구조 |
| `comedy` | 거의 없음 | 중간중간 개그 | 개그가 상시 또는 핵심 |
| `darkness` | 밝고 가벼움 | 진지한 위험·비극 존재 | 잔혹·암울·비극적 사건이 중심 |
| `mentalStress` | 심리적 압박이 거의 없음 | 긴장과 답답함이 혼합 | 불안·고구마·심리 붕괴·압박이 지속됨 |
| `romance` | 거의 없음 | 서브 플롯 | 주요 관계와 전개의 중심 |
| `emotionalWarmth` | 차갑고 가혹한 관계 | 혼합 | 유대·힐링·따뜻함이 핵심 보상 |

`darkness`와 `mentalStress`는 분리한다.

```text
어두운 세계관이지만 주인공이 안정적이고 개그가 많음
→ darkness 높음 / mentalStress 낮음

밝은 일상 배경이지만 관계 갈등과 불안이 지속됨
→ darkness 낮음 / mentalStress 높음
```

## 16.3 Art 그룹

| 팩터 | 0 | 2 | 4 |
|---|---|---|---|
| `artRealism` | 강한 데포르메·단순화 | 일반적 스타일화 | 현실적인 인체·배경·비례 |
| `artDensity` | 단순하고 여백이 많음 | 균형 | 선·배경·정보 밀도가 높음 |
| `visualSoftness` | 거칠고 각진 표현 | 중립 | 부드럽고 미려한 표현 |
| `motionImpact` | 정적·절제된 동적 표현 | 보통 | 속도감·타격감·동작 강조가 강함 |

`motionImpact`는 전투 또는 동적 장면이 존재할 때만 평가하며, 줄거리나 표지만으로 자동 확정하지 않는다.

---

# 17. 팩터 태깅 원칙

## 태깅 범위

```ts
type WorkFactorScope = "entry_1_3_volumes";
```

장편의 1권과 30권은 전개·톤·관계가 크게 달라질 수 있다. MVP에서는 모든 팩터를 초반 1~3권으로 고정한다.

향후 필요할 때만 다음으로 확장한다.

```ts
type WorkPhaseFactor = {
  phase: "entry" | "middle" | "late" | "ending";
  axes: WorkAxes;
};
```

## 평가 기준

- “빠르다”, “어둡다” 같은 형용사만 쓰지 않는다.
- 관찰 가능한 상태·빈도·반복 구조를 기준으로 정의한다.
- 먼저 각 축의 `0 / 2 / 4` 기준을 고정한다.
- `1 / 3`은 두 기준 사이일 때만 사용한다.
- 자동 제안은 사람이 승인하기 전까지 `reviewed=false`다.

## 검수 수준

```text
Anchor 작품
→ 모든 핵심 팩터 수동 검수

Recommendation 작품
→ 추천에 사용되는 Narrative/Tone 팩터 우선 검수

Library-only 작품
→ 서지와 Work 연결만 유지
```

## 자기 취향 편향 방지

- 무작위 15~20%를 점수를 숨긴 상태에서 재태깅한다.
- 두 평가가 2단계 이상 차이나면 정의 또는 데이터가 불안정한 것으로 본다.
- 추천 상위에 자주 등장하는 작품부터 재검수한다.
- 팩터 정의와 대표 사례를 별도 Annotation Guide로 유지한다.

---

# 18. Provenance와 Confidence

모든 자동 또는 수동 팩터에는 근거를 남긴다.

```ts
type FactorEvidence = {
  sourceType:
    | "rakuten"
    | "ndl"
    | "publisher"
    | "manual"
    | "model";

  sourceUrl?: string;
  fetchedAt: string;
  extractorVersion?: string;
  reviewedByHuman: boolean;
  confidence: number;
};
```

```ts
type WorkEvidence = {
  metadataConfidence: number;
  groupingConfidence: number;
  sourceAgreement: number;
  annotationReviewedAt?: string;
};
```

공개 Catalog에는 최종 값과 최소 Confidence만 포함하고, 상세 근거는 빌드용 source data에 보존한다.

```text
data/source
→ 원본·근거·검수 상태

data/generated
→ 공개 앱에 포함될 최소 JSON
```

---

# 19. 작품 간 유사도 계산

## 19.1 Tag 유사도

Genre와 Theme에는 Weighted Jaccard를 사용한다.

```ts
tagSimilarity =
  sum(min(aWeight, bWeight)) /
  sum(max(aWeight, bWeight));
```

Theme의 `centrality`를 가중치로 사용한다.

## 19.2 Axis 유사도

기본 선형 거리:

```ts
linearSimilarity = 1 - Math.abs(aValue - bValue) / 4;
```

다만 모든 Axis를 동일하게 취급하지 않는다.

```ts
type AxisDistanceKind =
  | "linear"
  | "presenceSensitive";
```

`0 = 없음`과 `1 이상 = 존재`의 차이가 큰 축:

```text
darkness
mentalStress
romance
```

초기 비선형 처리:

```ts
function axisSimilarity(
  a: ScaleValue,
  b: ScaleValue,
  kind: AxisDistanceKind,
): number {
  let distance = Math.abs(a - b) / 4;

  if (
    kind === "presenceSensitive" &&
    ((a === 0 && b > 0) || (a > 0 && b === 0))
  ) {
    distance = Math.min(1, distance * 1.5);
  }

  return 1 - distance;
}
```

`strategy`, `problemSolving`, `worldBuilding`, `artDensity` 등은 기본 선형 거리를 사용한다.

## 19.3 팩터 Confidence

```ts
effectiveAxisWeight =
  baseAxisWeight *
  Math.min(anchorConfidence, candidateConfidence);
```

근거가 약한 팩터는 일치하더라도 기여도가 작아진다.

---

# 20. unknown / notApplicable / Coverage

## 비교 규칙

```text
known ↔ known
→ 유사도 계산

unknown 포함
→ 해당 팩터 점수는 계산하지 않지만 Coverage를 낮춤

notApplicable 포함
→ 조건부 팩터의 기대 분모에서 제외
```

## Coverage 계산

```ts
groupCoverage =
  observedComparableWeight /
  expectedComparableWeight;
```

`expectedComparableWeight`에서 `notApplicable`은 제외하지만 `unknown`은 포함한다.

## 그룹별 임시 기준

```text
Genre       0.80
Theme       0.60
Narrative   0.60
Tone        0.60
Art         0.30
```

Art가 부족하다는 이유만으로 추천 후보를 제거하지 않는다.

## Coverage가 낮을 때만 중립 수축

```ts
const threshold = groupCoverageThreshold[group];
const effectiveCoverage = Math.min(1, coverage / threshold);

const adjustedGroupScore =
  0.5 +
  (observedGroupScore - 0.5) * effectiveCoverage;
```

기준 Coverage 이상이면 원래 점수를 유지한다.

중요한 규칙:

> 데이터가 없는 그룹의 가중치를 다른 그룹에 재분배하지 않는다.

예를 들어 Art 데이터가 없다고 Art의 15%를 Genre와 Theme에 나누면 장르 일치가 과대평가된다. Art 점수만 중립값 0.5에 가까워져야 한다.

---

# 21. 고정 그룹 비중의 Work Similarity

```ts
workSimilarity =
  genreScore * 0.15 +
  themeScore * 0.25 +
  narrativeScore * 0.25 +
  toneRelationshipScore * 0.20 +
  artScore * 0.15;
```

다음처럼 상관된 팩터가 여러 번 가점되는 것을 그룹 Cap으로 방지한다.

```text
소년 demographic
빠른 pacing
combat Theme
progression
전투 중심 작품
```

`demographic`과 `firstPublishedYear`는 핵심 Similarity 그룹에 넣지 않고 약한 사용자 정책 또는 필터로만 사용한다.

---

# 22. Positive Anchor 계산

기존의 Top-3 합산은 다수 취향군을 과증폭하고 소수 취향을 죽일 수 있으므로 사용하지 않는다.

## 반응 가중치

```ts
const positiveReactionWeight = {
  favorite: 1.0,
  liked: 0.8,
};
```

`neutral`은 Positive Anchor로 사용하지 않는다.

## 후보별 Best Anchor

```ts
anchorMatch =
  workSimilarity(candidate, positiveWork) *
  positiveReactionWeight[reaction];
```

가장 가까운 단일 Anchor를 중심으로 계산한다.

```ts
const bestMatch = matches[0];
```

## 같은 취향군의 작은 Consensus Bonus

별도 ML 클러스터 없이 다음 조건을 사용한다.

```text
사용자의 다른 Positive Anchor가
best Anchor와 workSimilarity 0.65 이상이면
같은 취향 모드의 보조 근거로 취급
```

```ts
const support = average(
  sameModeMatches.slice(0, 2),
);

const consensusBonus =
  Math.max(0, support - 0.5) * 0.1;

const positiveAnchorScore = clamp(
  bestMatch.score + consensusBonus,
  0,
  1,
);
```

Consensus Bonus는 최대 약 `+0.05`로 제한한다.

이 방식은 다음을 동시에 만족한다.

- 소수 취향도 가장 가까운 Anchor 하나로 살아남는다.
- 같은 취향군의 여러 좋아요는 작은 확신 보정만 만든다.
- 사용자가 동일 성향 작품을 많이 선택했다고 점수가 폭발하지 않는다.

---

# 23. 부정 신호 처리

부정 평가는 작품 전체 유사도 `Math.max`로 강하게 감점하지 않는다.

## 23.1 Hard Exclusion

```text
고어 중심 제외
로맨스 중심 제외
미완결 제외
특정 소재 제외
```

후보 계산 전에 제거한다.

## 23.2 Factor-specific Penalty

하차·불호 이유가 명확하면 해당 팩터만 감점한다.

```text
너무 느림
→ pacing가 낮은 후보만 감점

로맨스 비중
→ romance가 높은 후보만 감점

심리적으로 피곤함
→ mentalStress가 높은 후보만 감점

그림체 불호
→ Art 유사도가 높은 후보만 약한 감점
```

```ts
if (reason === "tooSlow" && candidate.pacing <= 1) {
  factorPenalty += 0.12;
}
```

초기 Soft Penalty 총합은 최대 `0.25`로 Cap한다.

## 23.3 Vague Dislike

“이유는 모르지만 전체적으로 별로”일 때만 작품 전체 형태 유사도를 약하게 반영한다.

```ts
weakShapePenalty =
  maxSimilarityToVaguelyDislikedWork * 0.08;
```

## 23.4 외부적 하차 이유

```text
휴재
시간 부족
플랫폼 변경
구매 중단
```

취향 감점에는 사용하지 않는다.

---

# 24. 명시적 사용자 설정

자동 학습 결과를 사용자가 이해하기 쉬운 언어로 보정하게 한다.

## 사용자 표현

```text
매우 선호
선호
자동 학습
덜 추천
제외
```

내부적으로 숫자 슬라이더를 직접 노출하지 않는다.

## 취향과 추천 정책 분리

### 취향 설정

```text
전략적 전개
빠른 전개
정신적 피로도
로맨스
군상극
현실적인 작화
```

### 추천 정책

```text
검증된 작품 우선
신작도 적극 탐색
완결작 우선
장편 우선
숨은 작품 우선
내 취향과 정확히 맞는 작품 우선
```

## 전역 취향과 현재 Mood 분리

```text
영구 취향
→ 평소 추천 전체에 반영

이번 추천
→ 오늘 읽고 싶은 작품에만 반영
```

명시적 설정은 자동 취향을 완전히 덮어쓰지 않는다. Hard Exclusion만 절대 조건으로 처리한다.

---

# 25. Taste Score 계산 순서

```text
1. Hard exclusion 적용
2. 추천 Eligibility 검사
3. 그룹별 Work Similarity 계산
4. Coverage 기준 미달 그룹만 중립 수축
5. Best Positive Anchor 중심 점수 계산
6. 같은 취향군 Consensus Bonus
7. 명시적 선호의 제한적 보정
8. 하차·불호 이유의 Factor Penalty
9. 이유 없는 Dislike의 약한 Shape Penalty
10. 0~1 범위로 Clamp
```

```ts
rawTasteScore = clamp(
  positiveAnchorScore +
  explicitPreferenceAdjustment -
  factorSpecificPenalty -
  weakShapePenalty,
  0,
  1,
);
```

MVP에서는 Coverage 수축 후 다시 전체 점수를 0.5로 당기는 **두 번째 Global Confidence Shrinkage를 사용하지 않는다.** 점수 Squashing을 피하기 위해 Confidence는 별도로 표시하고 tie-break와 Eligibility에 사용한다.

---

# 26. Confidence 계산

## 사용자 프로필 Confidence

```ts
profileConfidence =
  Math.min(positiveAnchorCount / 8, 1) * 0.7 +
  Math.min(reasonedNegativeCount / 3, 1) * 0.3;
```

Anchor 수뿐 아니라 서로 다른 팩터 공간의 다양성도 향후 반영할 수 있다.

## 작품 데이터 Confidence

```ts
workConfidence =
  averageFactorConfidence * 0.60 +
  groupingConfidence * 0.20 +
  sourceAgreement * 0.20;
```

## 추천 Confidence

```ts
recommendationConfidence = Math.sqrt(
  profileConfidence * workConfidence,
);
```

UI에는 확률로 표시하지 않는다.

```text
취향 적합도: 매우 높음
추천 확신도: 보통
작품 데이터: 검수 완료
```

---

# 27. 시장 신호와 작품 검증도

## Rakuten 리뷰 Bayesian 보정

리뷰 1개의 5점과 리뷰 100개의 5점을 동일하게 보지 않는다.

```ts
bayesianRating =
  (reviewCount * reviewAverage +
    priorCount * catalogAverage) /
  (reviewCount + priorCount);
```

초기 `priorCount`는 20 정도로 시작하되 실제 분포를 보고 조정한다.

## 첫 권과 전체 작품 분리

```text
첫 권 Bayesian Rating
→ 신규 독자의 입문 품질 prior

전체 권 리뷰 수 합계
→ 시장 근거량
```

후반 권 리뷰는 계속 읽은 독자만 남는 선택 편향이 있으므로 직접 품질 점수로 평균내지 않는다.

## 작품 축적도

```ts
maturity = Math.min(
  1,
  Math.log1p(observedVolumeCount) /
    Math.log1p(15),
);
```

길다고 좋은 작품이라는 의미가 아니다. 사용자가 “충분히 쌓인 작품 우선”을 선택했을 때만 정책 보정으로 사용한다.

## Market은 tie-break

```ts
if (Math.abs(a.tasteScore - b.tasteScore) >= 0.025) {
  return b.tasteScore - a.tasteScore;
}

return compareBy(
  recommendationConfidence,
  bayesianRating,
  maturity,
);
```

Taste 등급이 다른 작품을 시장 인기만으로 역전시키지 않는다.

---

# 28. 추천 리스트 구성

초기 Catalog에서는 MMR을 기본 사용하지 않는다. 작은 후보 풀에서 다양성 패널티가 엉뚱한 작품을 올릴 수 있기 때문이다.

대신 단순한 리스트 제약을 둔다.

```text
동일 best Anchor 기반 추천      최대 4개
동일 주요 Theme 조합           최대 3개
동일 시리즈·직접 속편          최대 1개
Discovery 후보                 1~2개
```

Discovery 후보도 최고 Taste Score에서 `0.10` 이상 떨어지지 않는 범위에서만 선택한다.

추천 10개 구성 예:

```text
주요 취향군        5~6개
보조 취향군        2~3개
Discovery          1~2개
```

향후 후보가 충분히 커진 뒤에만 제한적 MMR을 검토한다.

---

# 29. 추천 설명 생성

런타임 LLM 없이 실제 점수 기여도에서 생성한다.

## 출력 구조

```text
맞는 이유 3개
주의할 차이 1개
근거 Anchor 1~3개
추천 확신도
```

예:

```text
「ダンジョン飯」에서 좋아한 문제 해결형 전개와 유사합니다.
고정 파티의 관계와 진지한 본편 속 개그가 강합니다.
판타지 탐험과 세계 규칙을 활용하는 비중이 높습니다.

다만 초반 전개는 당신이 선호한 작품보다 느린 편입니다.
```

## 동어반복 방지

상관이 높은 팩터를 하나의 설명 Cluster로 묶는다.

```ts
const explanationClusters = {
  tacticalThinking: [
    "problemSolving",
    "strategy",
    "mysteryReveal",
  ],
  relationshipAppeal: [
    "characterArcWeight",
    "relationshipStructure",
  ],
  toneLoad: [
    "darkness",
    "mentalStress",
  ],
};
```

설명은 그룹 또는 Cluster당 최대 1개만 뽑는다.

```text
Narrative 이유 1개
Theme 이유 1개
Tone/Relationship 이유 1개
Art 또는 차이점 1개
```

향후 LLM을 사용하더라도 구조화된 근거를 자연스럽게 바꾸는 역할만 맡긴다.

---

# 30. 사용자 상태 모델

읽기 상태와 감상을 하나의 enum에 섞지 않는다.

```ts
type UserWorkRecord = {
  workId: string;

  readingState:
    | "planned"
    | "reading"
    | "completed"
    | "dropped"
    | "hidden";

  reaction?:
    | "favorite"
    | "liked"
    | "neutral"
    | "disliked";

  progress?: {
    volume?: number;
    chapter?: number;
  };

  positiveReasons?: string[];
  negativeReasons?: string[];
  droppedReasons?: string[];

  updatedAt: string;
};
```

표현 가능한 상태:

```text
완독 + 최애
읽는 중 + 재미있음
완독 + 별로
하차 + 초반은 재미있었음
```

---

# 31. 가장 작은 검증 실험

완성형 웹앱보다 Catalog와 Scorer를 먼저 검증한다.

## Phase 0 — Spreadsheet Sanity Check

```text
작품 수: 50
참여자: 본인 + 지인 2~3명
도구: Google Sheets / Excel
```

구성:

```text
행: 작품
열: 17개 Axis + Genre + Theme + Confidence
별도 시트: 사용자 Anchor / 부정 이유
```

확인할 것:

- 명백히 이상한 Top 10이 나오는가?
- 소수 취향이 사라지는가?
- 특정 팩터 하나가 순위를 지배하는가?
- unknown이 많은 작품이 과대평가되는가?
- 추천 이유가 실제 직관과 맞는가?

## Phase 1 — TypeScript Engine

Spreadsheet에서 납득 가능한 결과가 나온 뒤 구현한다.

```text
catalog-v0.json
recommendation-engine.ts
baseline-engine.ts
unit tests
```

## Phase 2 — Blind Baseline Test

```text
작품 수: 약 150
참여자: 다독자 10명
```

Baseline:

```text
Genre 중첩
+
Rakuten 리뷰·시장 신호
+
작품 축적도
```

Taste Engine:

```text
Best Anchor
+
Theme
+
Narrative / Tone / Art
+
명시적 선호·불호
```

두 엔진의 후보를 섞고 출처를 숨긴다.

### 설명 공개 전

```text
이미 읽었는가?
처음 보는 작품인가?
읽고 싶은가?
명백히 취향이 아닌가?
```

### 설명 공개 후

```text
추천 이유가 정확한가?
설명 후 관심이 높아졌는가?
설명의 어떤 부분이 틀렸는가?
```

## Holdout과 Discovery 분리

### Holdout

```text
좋아한 작품 일부를 숨김
→ Top 10에 복구되는지 확인
```

### Discovery

```text
처음 보는 작품
→ 읽고 싶음으로 바뀌는지 확인
```

## 핵심 지표

```text
Unknown Want-to-Read Rate
Explanation Agreement
Explanation Lift
Disliked Leakage@10
Holdout Recall@10
Baseline 대비 사용자별 승패
```

## 임시 GO 기준

- 10명 중 7명 이상에서 Taste Engine이 Baseline보다 동등 이상으로 선호됨
- Unknown Want-to-Read가 Baseline보다 높음
- Explanation Agreement가 약 70% 이상
- Disliked Leakage가 Baseline보다 악화되지 않음
- Holdout Recall@10이 Baseline보다 낮지 않음

소규모 실험이므로 통계적 유의성을 주장하지 않고 방향성 판단에 사용한다.

## REVISE 사례

```text
설명은 정확하지만 읽고 싶지 않음
→ Catalog Hook, 작품 진입성, Reading Cost를 보강

Holdout은 좋지만 Discovery가 약함
→ Discovery 후보 선정과 Bridge Catalog 보강

추천은 좋지만 설명이 부정확함
→ Contribution과 템플릿 매핑 수정

인기작만 계속 올라옴
→ Market tie-break 범위와 Catalog 편향 수정
```

두 차례의 수정 후에도 Baseline보다 우세하지 않고 사용자가 Manga DNA에도 가치를 느끼지 못할 때 범위 축소 또는 방향 전환을 검토한다.

---

# 32. 시스템 아키텍처

## MVP 구성

```text
Next.js Web App
+
정적 Recommendation Catalog
+
브라우저 TypeScript 추천 계산
+
Dexie / IndexedDB 사용자 데이터
+
Next.js Route Handler 기반 Rakuten Proxy
+
Netlify 배포
```

```text
┌─────────────────────────────────────────┐
│ Browser / PWA                           │
│                                         │
│ UI                                      │
│ Dexie User Library                      │
│ Fuse.js Search                          │
│ TypeScript Recommendation Engine        │
└───────────────────┬─────────────────────┘
                    │
                    │ ISBN Provider Fetch
                    ▼
┌─────────────────────────────────────────┐
│ Next.js Route Handler                   │
│ Validation / field selection / CDN TTL  │
└───────────────────┬─────────────────────┘
                    ▼
              Rakuten Books API
```

## 초기에는 없는 것

```text
애플리케이션 DB
회원가입
서버 사용자 프로필
추천 마이크로서비스
Redis
Queue
Python 서버
Vector DB
```

---

# 33. 호스팅 전략

## 1순위 — Netlify Free

선정 이유:

- Next.js 앱과 Route Handler를 한 저장소에서 운영 가능
- 상업적 MVP 배포 가능
- Free plan은 월간 hard limit 방식이라 의도치 않은 초과 과금 위험이 낮음
- CDN과 Deploy Preview 사용 가능
- 사용자가 이미 Netlify 경험이 있음

2026년 신규 Credit plan 기준 Free는 월 300 credits의 hard limit가 있으므로 사용량을 모니터링한다. 한도를 모두 쓰면 프로젝트가 일시 정지될 수 있다.

## 2순위 — Cloudflare Workers

다음 상황에서 고려한다.

- Provider API 캐시 요청량이 커짐
- Edge 중심 API가 유리함
- Netlify credits가 반복적으로 부족함

MVP에서는 OpenNext 등 플랫폼별 설정을 추가하지 않고 Netlify를 우선한다.

## 초기 VPS 자체 호스팅은 사용하지 않음

현재 제품에는 장시간 실행되는 서버나 영구 DB가 없다. VPS를 사용하면 다음 운영비용만 늘어난다.

```text
OS 패치
TLS
Nginx / Caddy
프로세스 복구
로그 관리
방화벽
백업
DB 운영
모니터링
```

VPS 검토 조건:

- 허용된 출처의 대량 정기 수집 작업
- 장시간 실행되는 데이터 정제·AI 배치
- 자체 PostgreSQL이 반드시 필요함
- 관리형 서비스 비용이 VPS보다 커짐
- Provider가 고정된 서버 환경을 요구함

---

# 34. 모바일 앱 전략

## Phase 1 — Responsive PWA

초기 스마트폰 앱은 별도 앱이 아니라 PWA다.

```text
홈 화면 설치
반응형 UI
오프라인 App Shell
오프라인 Library
오프라인 Taste Profile
Catalog 캐시
Web Share API
```

완전한 Service Worker 캐싱이 필요해질 때 `@serwist/next`를 추가한다. 초기 실험 단계에서는 manifest와 모바일 최적화만 먼저 적용해도 된다.

## Phase 2 — Capacitor 검토

반복 사용과 앱스토어 필요성이 확인된 뒤 검토한다.

주의:

> 서버 Route Handler와 SSR에 의존하는 Next.js 앱을 그대로 Capacitor에 넣는다고 가정하지 않는다.

선택지는 다음 두 가지다.

```text
A. 정적 Export 가능한 Mobile Shell을 만들고 API는 원격 호출
B. apps/mobile을 별도 Vite/React Shell로 만들고 domain 패키지만 공유
```

공유 대상:

```text
Catalog type
Recommendation engine
Validation schema
API client
Analytics event names
```

Native 전환 전 추가할 가치:

```text
Push notification
Deep link
Native share
안정적인 기기 저장소
오프라인 동기화
```

단순 WebView Wrapper만으로 앱스토어 출시하지 않는다.

---

# 35. 채택 라이브러리

정확한 버전은 프로젝트 Scaffold 시점의 stable을 확인한 뒤 `package.json`과 lockfile에 고정한다. `latest` 실행에 의존하지 않는다.

## 35.1 필수 Core

| 역할 | 선택 | 이유 |
|---|---|---|
| Framework | Next.js App Router | 공개 웹, Route Handler, PWA 기반 |
| UI Runtime | React | Next.js와 통합 |
| Language | TypeScript | 추천 수식·Catalog schema 타입 안정성 |
| Styling | Tailwind CSS | 빠른 반응형 UI |
| UI Primitive | shadcn/ui | 접근 가능한 Dialog, Drawer, Tabs, Form 기반 |
| Validation | Zod | Catalog·API·Import 데이터 검증 |

## 35.2 데이터와 검색

| 역할 | 선택 | 이유 |
|---|---|---|
| Local DB | Dexie | IndexedDB를 단순하게 사용 |
| Reactive DB | dexie-react-hooks | `useLiveQuery`로 UI 반영 |
| Local Search | Fuse.js | 150~수천 개 Catalog에 충분한 fuzzy search |
| CSV Build | csv-parse 또는 동등한 Node 전용 파서 | Google Sheets Export를 빌드 데이터로 변환 |

Fuse 검색 필드 예:

```ts
const fuse = new Fuse(works, {
  keys: [
    { name: "title", weight: 0.45 },
    { name: "titleKana", weight: 0.25 },
    { name: "aliases", weight: 0.20 },
    { name: "creators", weight: 0.10 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
});
```

일본어 정규화:

```text
Unicode NFKC
히라가나·가타카나 통합 검색 필드
전각·반각 통합
공백·중점 정규화
권수 표현 제거
영문 소문자화
```

## 35.3 기본 애니메이션

### Motion — 채택

용도:

```text
페이지 진입
선택된 표지 Tray
카드 재배치
추천 필터 전환
Shared layout transition
Taste 막대 애니메이션
```

Motion은 기능 상태 변화와 직접 연결되는 기본 애니메이션 엔진으로 사용한다.

### React Bits — 선택적 채택

React Bits는 앱 전체 디자인 시스템이 아니라 **강한 시각적 포인트의 소스**로 사용한다.

후보:

| 화면 | 컴포넌트 후보 |
|---|---|
| Landing 배경 | Aurora 또는 Dot Grid 중 하나 |
| Hero 표지 묶음 | Stack 또는 Card Swap 중 하나 |
| Taste 공개 | Animated Content |
| 추천 카드 | Spotlight Card 일부 |
| 데스크톱 강조 카드 | Tilted Card 선택적 |

사용 규칙:

```text
한 화면에 지속 애니메이션 최대 1개
WebGL/Canvas 배경은 앱 전체에서 매우 제한
추천 피드 전체에 3D Tilt를 적용하지 않음
모바일에서는 cursor 기반 효과 제거
prefers-reduced-motion 정적 fallback
화면 밖의 무거운 효과는 dynamic import
```

React Bits는 MIT + Commons Clause이므로 일반 앱 사용은 가능하지만, 구성 요소 라이브러리 자체를 경쟁 상품으로 판매하지 않는다. 가져온 컴포넌트의 출처·commit·로컬 수정사항을 기록한다.

```text
components/visual/react-bits/
docs/third-party-ui.md
```

## 35.4 보조 비주얼

| 라이브러리 | 결정 | 용도 |
|---|---|---|
| Embla Carousel | 채택 | 모바일 작품 Shelf, 수동 Swipe |
| NumberFlow | 채택 | Manga DNA 숫자 전환 |
| AutoAnimate | 선택 | 단순 Library 추가·삭제·정렬 |
| Magic UI | 보류 | React Bits와 겹치지 않는 작은 장식만 |
| Recharts | 보류 | 실제 데이터 변화 차트가 필요할 때만 |
| Serwist | PWA 단계에서 선택 | 완전한 오프라인 캐시가 필요해질 때 |

자동 재생 Carousel과 Smooth-scroll hijacking은 사용하지 않는다.

## 35.5 테스트

| 역할 | 선택 |
|---|---|
| Unit | Vitest |
| Component | Testing Library |
| E2E | Playwright |
| Type | TypeScript strict mode |
| Lint | ESLint |
| Format | Prettier 또는 프로젝트 표준 Formatter |

---

# 36. MVP에서 채택하지 않는 라이브러리·서비스

| 항목 | 이유 |
|---|---|
| TanStack Query | Provider API가 하나이고 CDN cache + `fetch`로 충분 |
| Zustand | 지속 데이터는 Dexie, 일시 상태는 React state로 충분 |
| Prisma / PostgreSQL | 로그인과 서버 사용자 데이터가 없음 |
| NestJS | Next.js Route Handler로 충분 |
| pgvector | Embedding을 사용하지 않음 |
| Python 추천 서버 | TypeScript 순수 함수로 충분 |
| Meilisearch / Typesense | 초기 Catalog가 작음 |
| Runtime LLM | 비용·환각·재현성 문제 |
| dnd-kit | 작품 선택 UI에 Drag and Drop이 핵심이 아님 |
| GSAP | Motion과 React Bits로 초기 요구 충족 |

---

# 37. 선택적 외부 서비스

## 현재 사용

| 역할 | 서비스 |
|---|---|
| 배포 | Netlify |
| 상품·표지 | Rakuten Books API |
| 서지 보조 | NDL Search |
| 소스·CI | GitHub |
| 사용자 데이터 | 브라우저 IndexedDB |

## 공개 베타 이후 선택

| 역할 | 후보 | 조건 |
|---|---|---|
| Product Analytics | PostHog | 최소 이벤트만, Taste 원본 전송 금지 |
| Cloud Sync / Auth | Supabase | 기기간 동기화 수요가 검증됨 |
| DNS / Edge 보조 | Cloudflare | 트래픽·캐시 필요가 생김 |
| Native Runtime | Capacitor | PWA 반복 사용과 앱스토어 가치가 확인됨 |

Analytics 이벤트 예:

```text
onboarding_started
work_selected
onboarding_completed
taste_revealed
recommendation_impression
recommendation_saved
recommendation_hidden
recommendation_already_read
provider_clicked
data_exported
```

분석 서비스에는 전체 Library·Taste Vector·민감한 부정 이유를 보내지 않는다.

---

# 38. 권장 Source 구조

```text
src/
├─ app/
│  ├─ page.tsx
│  ├─ onboarding/
│  ├─ taste/
│  ├─ recommendations/
│  ├─ works/[workId]/
│  ├─ library/
│  ├─ settings/
│  └─ api/providers/rakuten/
│
├─ components/
│  ├─ ui/
│  ├─ cover/
│  ├─ motion/
│  └─ visual/
│     └─ react-bits/
│
├─ features/
│  ├─ onboarding/
│  ├─ taste-profile/
│  ├─ recommendations/
│  └─ library/
│
├─ domain/
│  ├─ catalog/
│  ├─ recommendation/
│  ├─ preferences/
│  ├─ explanation/
│  └─ provider/
│
├─ infrastructure/
│  ├─ dexie/
│  ├─ rakuten/
│  └─ analytics/
│
└─ data/generated/
   └─ catalog-v1.json

data/
├─ source/
│  ├─ works.csv
│  ├─ factors.csv
│  ├─ themes.csv
│  ├─ aliases.csv
│  ├─ volumes.csv
│  └─ evidence/
└─ generated/

scripts/
├─ sync-rakuten.ts
├─ normalize-works.ts
├─ validate-catalog.ts
├─ build-catalog.ts
├─ report-coverage.ts
└─ run-baseline-experiment.ts
```

---

# 39. Catalog 빌드 명령

권장 명령:

```json
{
  "scripts": {
    "catalog:sync": "tsx scripts/sync-rakuten.ts",
    "catalog:normalize": "tsx scripts/normalize-works.ts",
    "catalog:validate": "tsx scripts/validate-catalog.ts",
    "catalog:build": "tsx scripts/build-catalog.ts",
    "catalog:coverage": "tsx scripts/report-coverage.ts",
    "experiment:baseline": "tsx scripts/run-baseline-experiment.ts"
  }
}
```

`catalog:validate` 검사 항목:

```text
Work ID 중복
ISBN 중복·충돌
존재하지 않는 Work 참조
잘못된 Factor 범위
unknown / notApplicable 상태 오류
Theme centrality 범위
대표 Volume 누락
Catalog Eligibility 충돌
추천 대상 Coverage 미달
Evidence 누락
```

---

# 40. 구현 순서

## Phase 0 — Factor Dictionary 고정

산출물:

```text
factor-dictionary.md
annotation-guide.md
catalog-v0.csv
```

완료 조건:

- 17개 Axis의 `0 / 2 / 4` 기준이 문서화됨
- `known / unknown / notApplicable` 규칙이 고정됨
- 초반 1~3권 범위가 모든 작품에 동일하게 적용됨

## Phase 1 — Spreadsheet 검증

산출물:

```text
50개 작품
3명 사용자 Anchor
Baseline 수식
Taste Engine 수식
Top 10 결과
```

완료 조건:

- 소수 취향이 Top 10에서 사라지지 않음
- unknown이 많은 작품이 과대평가되지 않음
- 명백한 부정 이유가 올바른 팩터에만 작동함

## Phase 2 — Recommendation Core

산출물:

```text
catalog schema
recommendation-engine.ts
baseline-engine.ts
explanation-engine.ts
unit tests
```

완료 조건:

- 동일 입력은 동일 결과를 냄
- 순위 기여도를 역추적할 수 있음
- 추천 설명이 실제 기여도와 일치함

## Phase 3 — 150개 Catalog와 Blind Test

산출물:

```text
30~40 Anchor
30~40 Bridge
70+ Discovery
10명 실험 결과
```

완료 조건:

- Baseline 대비 방향성 우세
- Disliked Leakage 악화 없음
- Explanation과 Ranking을 분리 평가함

## Phase 4 — Web MVP

산출물:

```text
Landing
Onboarding
Taste
Recommendations
Work Detail
Library
Settings
Rakuten Route Handler
Dexie persistence
```

완료 조건:

- 회원가입 없이 전체 핵심 흐름 가능
- API 장애 시에도 추천·Library 동작
- Export/Import 가능

## Phase 5 — Visual Polish와 PWA

산출물:

```text
Motion 전환
React Bits 2~3개 선택 도입
NumberFlow
Embla Shelf
PWA manifest
필요 시 Serwist
```

완료 조건:

- reduced motion 지원
- 모바일 성능 저하 없음
- 애니메이션이 조작·상태를 숨기지 않음

## Phase 6 — 검증 후 확장

후보:

```text
Supabase Sync
Capacitor Mobile Shell
한국어
신작 Discovery
사용자 집단 팩터 보정
Collaborative Filtering
Manga Wrapped
```

---

# 41. 테스트 계획

## Recommendation Unit Test

```text
읽은 작품 제외
중도하차·숨김 제외
Hard exclusion
Coverage 수축
notApplicable 분모 제외
Best Anchor 소수 취향 보존
Consensus Bonus Cap
하차 이유별 팩터 감점
Vague Dislike 약한 Shape Penalty
Market tie-break 범위
동일 입력 deterministic 결과
설명과 기여도 일치
```

## Catalog Test

```text
Schema validation
ISBN / Work grouping conflict
Factor state validation
Provider TTL validation
Recommendation Eligibility coverage
Source provenance completeness
```

## E2E

```text
1. 작품 선택 → Manga DNA → 추천
2. 이미 읽음 처리 → 다음 추천에서 제거
3. 브라우저 재실행 → Library 유지
4. Rakuten API 실패 → Placeholder + 추천 정상
5. Export → 데이터 삭제 → Import 복원
```

## 접근성·모션

```text
키보드로 작품 선택 가능
Carousel 이전·다음 버튼 제공
focus-visible 유지
prefers-reduced-motion 정적 fallback
배경 장식 aria-hidden
모바일 터치 타깃 44×44 이상
자동 재생 없음
```

---

# 42. 비주얼 구현 원칙

## 화면별 적용

### Landing

```text
KonoComics 로고: **kono**co**mi**cs
짧은 Logo reveal: kono + mi = konomi
React Bits Aurora 또는 Dot Grid 중 하나
표지 3~4장을 Stack 또는 Card Swap으로 표시
카피와 CTA는 정적이고 명확하게 유지
```

대표 카피:

```text
好みから見つける、次のマンガ。
```

### Onboarding

```text
표지 Grid
Motion layout transition
하단 Selected Tray
Embla는 장르별 Shelf에만 사용
```

### Taste

```text
가로 막대 + NumberFlow
상위 취향 3개만 강조
Radar는 후순위
```

### Recommendations

```text
피드는 비교적 차분하게 유지
일부 카드에만 Spotlight
저장·제외 시 짧은 Motion transition
```

### Work Detail

```text
동일 표지의 강한 Blur 배경
전경 원본 비율 표지
별도 WebGL 배경 사용 안 함
```

## 애니메이션 예산

```text
지속 애니메이션      한 화면 최대 1개
페이지 전환          160~280ms
큰 Reveal            400~700ms
WebGL/Canvas          앱 전체에서 극소수
자동 Carousel         사용 안 함
Smooth Scroll Hijack  사용 안 함
```

---

# 43. 주요 리스크와 대응

## 43.1 데이터 생성 비용

가장 큰 개발 비용은 UI가 아니라 작품별 Taste Metadata다.

대응:

- 범위를 좁힌다.
- 추천에 자주 등장하는 작품부터 검수한다.
- 자동 모델은 제안만 한다.
- 팩터가 부족한 작품은 Library-only로 둔다.

## 43.2 팩터 상관과 중복 가점

대응:

- 그룹 비중 고정
- 상관 높은 팩터는 설명 Cluster로 병합
- Catalog 데이터에서 상관계수를 진단용으로 사용
- 상관계수로 Anchor를 자동 선정하지 않음

## 43.3 소수 취향 소멸

대응:

- Top-3 합산 폐기
- Best Anchor 중심
- Consensus Bonus 제한
- 추천 리스트에 보조 취향군 슬롯 확보

## 43.4 Negative Overkill

대응:

- 하차 이유를 특정 팩터에 연결
- 이유 없는 Dislike만 약한 Shape Penalty
- Hard exclusion과 Soft penalty 분리

## 43.5 Late-volume Bias

대응:

- 모든 팩터를 초반 1~3권 기준으로 고정
- 사용자의 진행 권수를 기록
- Phase별 팩터는 후속 기능

## 43.6 설명은 맞지만 작품이 매력적이지 않음

가능한 원인:

```text
Catalog의 Discovery 품질 부족
작품 premise Hook 부족
Reading Cost가 너무 높음
표지·제목 진입성이 낮음
현재 Mood 불일치
```

이 경우 엔진 폐기보다 Catalog와 `entryEase`, 길이, 완결 상태 등의 정책 팩터를 먼저 검토한다.

## 43.7 Provider 의존성

대응:

- Work Metadata와 ProviderListing 분리
- Rakuten 장애 시 Placeholder
- Provider cache TTL
- NDL·공식 출판사 데이터로 식별 보조
- 출시 전 정책 재검토

---

# 44. 장기 확장 방향

추천 정확도와 반복 사용이 확인된 뒤에만 확장한다.

```text
Phase 1
일본 만화 Local-first PWA

Phase 2
계정·기기간 Sync

Phase 3
한국 정발 일본 만화와 한국어

Phase 4
한국 웹툰 Provider 제휴

Phase 5
Manga / Webtoon / Comics 통합 Taste Graph
```

향후 자산:

```text
Work Taste Graph
+
User Taste Graph
+
Read / Drop / Like Behavior
+
Factor Annotation Consensus
```

Collaborative Filtering은 충분한 사용자 행동이 생긴 뒤 Content-based 추천 위에 추가한다.

---

# 45. 당장 실행할 작업

```text
1. 17개 Axis의 Annotation Guide 작성
2. Google Sheets에 50개 작품 입력
3. 3명 사용자 Anchor로 Sanity Check
4. Best Anchor / Negative reason / Coverage 수식 검증
5. catalog schema와 validator 구현
6. recommendation-engine.ts 구현
7. 150개 Catalog로 확대
8. Baseline blind test
9. 방향성 확인 후 Next.js Web MVP 구현
10. 기능 완료 후 React Bits와 Motion으로 Visual Polish
```

첫 코드 산출물은 완성형 앱이 아니라 다음 세 가지다.

```text
catalog-v0.csv
recommendation-engine.ts
blind-baseline-test
```

---

# 46. 최종 채택안

```text
제품
→ KonoComics: 일본 만화 취향 분석 + 설명 가능한 추천

추천 방식
→ 고정 그룹 비중 + Best Anchor + 사유별 Negative

Catalog
→ Anchor / Bridge / Discovery / Library-only 분리

데이터
→ Rakuten 우선 + NDL/공식 출판사 보강 + 수동 검수

Factor 범위
→ 초반 1~3권

Frontend
→ Next.js + TypeScript + Tailwind + shadcn/ui

Local Data
→ Dexie

Search
→ Fuse.js

Animation
→ Motion 중심 + React Bits 선택 사용

Provider
→ Next.js Route Handler를 통한 Rakuten API

Hosting
→ Netlify Free 우선

Mobile
→ PWA 우선, 검증 후 Capacitor 또는 별도 Mobile Shell

Database/Auth
→ 초기 없음, 동기화 수요 검증 후 Supabase

AI
→ 오프라인 팩터 제안만, 런타임 Ranking에는 미사용
```

이 구조는 프로젝트의 독창적인 부분인 **Taste Metadata와 추천 경험**에는 충분히 투자하면서, 서버·ML·네이티브 앱에는 과잉 투자하지 않는 최소 설계다.

---

# 47. 공식 참고 자료

- [Rakuten Books Book Search API](https://webservice.rakuten.co.jp/documentation/books-book-search)
- [Rakuten Web Service 이용 가이드](https://webservice.rakuten.co.jp/guide)
- [Rakuten Web Service 이용약관](https://webservice.rakuten.co.jp/guide/rule)
- [Rakuten API 크레디트 표시](https://webservice.rakuten.co.jp/guide/credit)
- [Rakuten API 데이터 갱신·캐시 FAQ](https://webservice.faq.rakuten.net/hc/ja/articles/900001974343)
- [NDL Search API 이용 안내](https://ndlsearch.ndl.go.jp/en/help/api)
- [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Netlify Pricing](https://www.netlify.com/pricing/)
- [Dexie React Guide](https://dexie.org/docs/Tutorial/React)
- [Fuse.js](https://www.fusejs.io/)
- [Motion Layout Animations](https://motion.dev/docs/react-layout-animations)
- [React Bits](https://reactbits.dev/)
- [Embla Carousel](https://www.embla-carousel.com/)
- [NumberFlow](https://number-flow.barvian.me/)
- [AutoAnimate](https://auto-animate.formkit.com/)
- [Serwist for Next.js](https://serwist.pages.dev/docs/next)
- [Capacitor](https://capacitorjs.com/docs/)
