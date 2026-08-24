# Pilot 001 Annotation Pass A — chunk 02

- Packet candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Policy rebind: the Factor Dictionary, annotation guide, source rows, research chunk, and Art preflight bytes are unchanged; `promotion-evidence-v2`, its review request, and batch-ledger policy were added after this draft. Pass B must independently enforce the new method.
- Scope: `entry_1_3_volumes`
- Isolation attestation: 기존 `data/source` Factor·Theme·recommendation-context, Gold 주석, 메모리, 웹을 보지 않았다. `factor-dictionary.md`, `annotation-guide.md`와 동결 패킷의 `source/works.csv`, `source/volumes.csv`, `research/chunk-02.md`, `manifest.json`, `PAYLOAD.sha256`만 사용했다.
- Art attestation: 10작품 모두 내부 페이지를 직접 시각 판독하지 않았다. 따라서 `artRealism`, `artDensity`, `visualSoftness`, `motionImpact`는 전부 `unknown`이다.
- 이 패스는 Annotation 초안만 작성하며 catalog role, recommendation context, eligibility를 판정하지 않는다.

## work-0bec5d8d9474a2197312 — 放浪息子

- Evidence ID: `ev-pilot-001-a-work-0bec5d8d9474a2197312`
- Genre: `sliceOfLife` — 두 학생의 학교생활과 성장을 중심으로 한다는 KADOKAWA 소개가 일상·성장 서사를 직접 지지한다: https://store.kadokawa.co.jp/shop/g/g200700002446/
- Theme: `school` centrality 2 — 학교와 주변 관계가 중심 무대임을 출판사와 문화청 소개가 함께 지지한다: https://store.kadokawa.co.jp/shop/g/g200700002446/ ; https://j-mediaarts-festival.bunka.go.jp/award/single/hourou-musuko/index.html
- Known axes: `characterArcWeight=4` — 두 주인공의 성별에 관한 바람과 성장이 핵심 보상이다: https://store.kadokawa.co.jp/shop/g/g200700002446/ ; https://j-mediaarts-festival.bunka.go.jp/award/single/hourou-musuko/index.html
- Known axes: `relationshipStructure=2` — 두 주인공과 학교의 주변 관계가 반복되는 고정 핵심 구조다: https://j-mediaarts-festival.bunka.go.jp/award/single/hourou-musuko/index.html
- Unknown limitations: `progression`은 일반적인 성장 서술만으로 반복적 획득·숙련 보상 구조를 확정할 수 없다. `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`은 공식 소개가 0/2/4에 필요한 사건 빈도와 구조를 제시하지 않는다. `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`는 민감한 정체성·관계 소재의 존재만으로 톤과 강도를 정할 수 없다.
- Art limitation: BOOK WALKER 샘플의 내부 페이지를 판독하지 않았으므로 Art 4축 모두 `unknown`이다: https://bookwalker.jp/series/162/
- Uncertainty/conflicts: 대표 ISBN `9784757715226`의 일반판 연결은 패킷에 있으나 공식 페이지와 판본 관계의 독립 확인이 남는다. 성별 정체성·표현과 사춘기 관계는 성인 전용 분류의 증거가 아니며, 공식 자료에 명시적 `adult=false`가 없어 최종 safety gate가 필요하다.

## work-1cf7a0bb5f55e0d69b27 — モンキーターン

- Evidence ID: `ev-pilot-001-a-work-1cf7a0bb5f55e0d69b27`
- Genre: `sports` — 경정 선수가 되어 프로를 목표로 하는 공식 소개가 경기 중심 스포츠 작품임을 직접 지지한다: https://e-comi.shogakukan.co.jp/books/091251610000d0000000
- Theme: `sportsCompetition` centrality 2 — 경정 학교와 프로 경기가 성장·경쟁의 반복 핵심 구조다: https://e-comi.shogakukan.co.jp/books/091251610000d0000000
- Known axes: `progression=4` — 경정 입문에서 훈련과 프로 목표로 이어지는 숙련·성장 보상이 작품의 명시적 중심이다: https://e-comi.shogakukan.co.jp/books/091251610000d0000000
- Known axes: `characterArcWeight=2` — 선수로 성장하는 인물 변화가 경기 목표와 함께 제시되어 사건과 인물 성장의 균형으로 판정했다: https://e-comi.shogakukan.co.jp/books/091251610000d0000000
- Unknown limitations: `problemSolving`과 `strategy`는 스포츠 장르와 경기 존재만으로 기술 분석·전술의 반복 비중을 확정할 수 없다. `pacing`, `mysteryReveal`, `worldBuilding`, `relationshipStructure`는 공식 소개에 초반 반복 구조가 부족하다. `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`는 톤과 관계 보상의 직접 근거가 없다.
- Art limitation: 공식 뷰어 내부 페이지를 판독하지 않았으므로 Art 4축 모두 `unknown`이다: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091251610000d0000000
- Uncertainty/conflicts: 작품·저자·대표 1권 identity 충돌은 발견되지 않았다. 고속 경기 위험은 성인 전용 분류의 근거가 아니며, 공식 자료에 명시적 `adult=false`가 없어 최종 safety gate가 필요하다.

## work-1fc61ddbeb429b4a2c15 — エマ

- Evidence ID: `ev-pilot-001-a-work-1fc61ddbeb429b4a2c15`
- Genres: `historical`, `romance` — 빅토리아 시대 영국과 계급을 넘는 메이드·상류계급 청년의 관계를 공식 출판사와 수상기관이 직접 설명한다: https://www.kadokawa.co.jp/product/301407000933/ ; https://j-mediaarts-festival.bunka.go.jp/award/single/emma/index.html
- Themes: `workplace` centrality 2 — 메이드의 노동과 생활이 인물·계급 관계의 반복 중심이다: https://www.kadokawa.co.jp/product/301407000933/ ; `historicalReconstruction` centrality 2 — 19세기 영국 생활·계급·세부 시대 묘사가 공식 심사평의 직접 평가 대상이다: https://j-mediaarts-festival.bunka.go.jp/award/single/emma/index.html
- Known axes: `worldBuilding=4` — 시대 생활, 계급 규칙과 사회 구조가 관계 전개에 반복적으로 중요하다: https://j-mediaarts-festival.bunka.go.jp/award/single/emma/index.html
- Known axes: `characterArcWeight=4` — 에마와 윌리엄의 동기·선택·관계 변화가 핵심 보상이다: https://www.kadokawa.co.jp/product/301407000933/
- Known axes: `relationshipStructure=2` — 중심 두 인물과 계급·가사 노동 관계가 고정 핵심 구조를 이룬다: https://www.kadokawa.co.jp/product/301407000933/ ; https://j-mediaarts-festival.bunka.go.jp/award/single/emma/index.html
- Known axes: `romance=4` — 계급을 넘는 두 인물의 연애가 공식 소개의 중심 전제다: https://www.kadokawa.co.jp/product/301407000933/
- Unknown limitations: `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`은 공식 소개가 초반 사건의 반복 빈도나 보상 구조를 제시하지 않는다. `comedy`, `darkness`, `mentalStress`, `emotionalWarmth`는 계급 갈등과 관계의 존재만으로 톤 강도를 확정할 수 없다.
- Art limitation: BOOK WALKER 샘플의 내부 페이지를 판독하지 않았으므로 Art 4축 모두 `unknown`이다: https://bookwalker.jp/series/11626/
- Uncertainty/conflicts: 패킷 대표 ISBN `9784047298804`와 공식 KADOKAWA 상품 페이지 판본의 관계를 독립 확인해야 한다. 계급·연애·결혼 갈등은 성인 전용 분류의 증거가 아니며, 명시적 `adult=false`가 없어 최종 safety gate가 필요하다.

## work-2f39795212f5ad8db155 — あずみ

- Evidence ID: `ev-pilot-001-a-work-2f39795212f5ad8db155`
- Genres: `action`, `historical` — 막부 초기의 정치적 혼란 속 자객 집단과 암살 임무를 공식 작품 페이지가 직접 설명한다: https://e-comi.shogakukan.co.jp/books/091835410000d0000000
- Themes: `combat` centrality 2 — 자객의 암살 임무가 반복 핵심 구조다: https://e-comi.shogakukan.co.jp/books/091835410000d0000000 ; `politics` centrality 2 — 막부 초기 혼란을 막기 위한 정치적 암살이 임무 목적 자체다: https://e-comi.shogakukan.co.jp/books/091835410000d0000000
- Known axes: `strategy=2` — 집단이 정치적 표적을 상대로 임무를 수행하므로 즉흥 대응만이 아닌 단기 계획이 존재하지만, 장기 운영 중심의 4를 뒷받침하지는 않는다: https://e-comi.shogakukan.co.jp/books/091835410000d0000000
- Known axes: `worldBuilding=2` — 막부 초기 세력·정치 상황이 임무에 기능적으로 관여한다: https://e-comi.shogakukan.co.jp/books/091835410000d0000000
- Known axes: `relationshipStructure=2` — 아즈미와 함께 길러진 동료 집단이 고정 핵심 관계를 이룬다: https://e-comi.shogakukan.co.jp/books/091835410000d0000000
- Known axes: `darkness=4` — 암살·참수·전쟁 폭력이 주변 장식이 아니라 주인공 집단의 중심 임무다: https://e-comi.shogakukan.co.jp/books/091835410000d0000000
- Unknown limitations: `progression`, `problemSolving`, `pacing`, `mysteryReveal`, `characterArcWeight`는 소개가 초반 반복 빈도와 인물 변화의 보상 비중을 확정하지 않는다. `comedy`, `mentalStress`, `romance`, `emotionalWarmth`는 폭력적 전제만으로 체감 톤과 관계 보상을 정할 수 없다.
- Art limitation: 공식 뷰어 내부 페이지를 판독하지 않았으므로 Art 4축 모두 `unknown`이다: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091835410000d0000000
- Uncertainty/conflicts: 후속작 `AZUMI`는 별도 canonical이어야 하며 현 작품과 합치지 않는다. 강한 폭력은 안전 검수 대상이지만 성인 전용 판매 분류와 동일하지 않고, 명시적 `adult=false`가 없어 최종 safety gate가 필요하다.

## work-303d0a9d67a606a817af — ギャラリーフェイク

- Evidence ID: `ev-pilot-001-a-work-303d0a9d67a606a817af`
- Genre: `mystery` — 미술품 진위와 관련 사건을 조사·해결하는 반복 구조를 공식 작품 페이지가 설명한다: https://e-comi.shogakukan.co.jp/books/091830210000d0000000
- Themes: `investigation` centrality 2 — 진품·위작과 사건의 조사 과정이 핵심이다: https://e-comi.shogakukan.co.jp/books/091830210000d0000000 ; `workplace` centrality 2 — 위작 전문 갤러리 운영과 전직 큐레이터의 전문 업무가 반복 무대다: https://e-comi.shogakukan.co.jp/books/091830210000d0000000
- Known axes: `problemSolving=4` — 미술품의 진위를 분석하고 사건을 해결하는 과정이 반복 핵심 보상이다: https://e-comi.shogakukan.co.jp/books/091830210000d0000000
- Known axes: `mysteryReveal=4` — 진품과 위작의 단서·판정·진실 공개가 작품의 명시적 반복 구조다: https://e-comi.shogakukan.co.jp/books/091830210000d0000000
- Unknown limitations: `progression`, `strategy`, `pacing`, `worldBuilding`, `characterArcWeight`, `relationshipStructure`은 공식 소개만으로 초반 반복 빈도와 상대적 비중을 확정할 수 없다. `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`는 사건·범죄 소재의 존재만으로 톤을 정할 수 없다.
- Art limitation: 미술을 소재로 한다는 사실은 작화 근거가 아니다. 공식 뷰어 내부 페이지를 판독하지 않았으므로 Art 4축 모두 `unknown`이다: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091830210000d0000000
- Uncertainty/conflicts: 작품·저자·대표 1권 identity 충돌은 발견되지 않았다. 사기·범죄 소재는 성인 전용 분류의 증거가 아니며, 명시적 `adult=false`가 없어 최종 safety gate가 필요하다.

## work-440f93a4e60ef906685b — バラ色の明日

- Evidence ID: `ev-pilot-001-a-work-440f93a4e60ef906685b`
- Genres: `sliceOfLife`, `romance` — 여러 인물의 사랑과 일상을 다루는 공식 소개가 두 장르를 직접 지지한다: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08782229848709315501
- Themes: 공식 자료로 22개 canonical Theme 중 반복 핵심 mechanic을 책임 있게 확정하지 못해 행을 만들지 않았다.
- Known axes: `characterArcWeight=4` — 각 인물의 감정과 관계가 에피소드의 핵심 보상이다: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08782229848709315501
- Known axes: `relationshipStructure=4` — 서로 다른 인물과 관계를 다루는 연작 구조 자체가 작품의 중심 구성이다: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08782229848709315501 ; https://betsuma.shueisha.co.jp/memories/magazine/1995_1999/1997/01.html
- Known axes: `romance=4` — 여러 인물의 사랑이 공식 소개의 중심 주제다: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08782229848709315501
- Unknown limitations: `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`은 연작의 개별 에피소드마다 구조가 달라 공식 짧은 소개로 0/2/4를 고정할 수 없다. `comedy`, `darkness`, `mentalStress`, `emotionalWarmth`도 에피소드별 이질성을 대표할 근거가 없다.
- Art limitation: 공식 뷰어 내부 페이지를 판독하지 않았고 한 에피소드가 연작 전체를 대표한다고 확인하지 못했으므로 Art 4축 모두 `unknown`이다: https://www.shueisha.co.jp/books/reader/main.php?cid=08782229848709315501
- Uncertainty/conflicts: 일반 전자판과 문고판은 판본이지 별도 Work가 아니다: https://www.shueisha.co.jp/books/items/contents.html?isbn=4-08-618341-2 . 연작·옴니버스 경계와 대표 ISBN 판본을 검수해야 한다. 연애·관계 갈등은 성인 전용 분류의 증거가 아니며 명시적 `adult=false`가 없어 최종 safety gate가 필요하다.

## work-464322afcd10013437b9 — 大奥

- Evidence ID: `ev-pilot-001-a-work-464322afcd10013437b9`
- Genres: `historical`, `scienceFiction` — 에도 사회를 재구성한 성별 역전 대체 역사와 남성만 감염되는 역병을 공식 출판사와 연재 매체가 설명한다: https://www.hakusensha.co.jp/comicslist/40895/ ; https://melody-web.com/sakuhin/?id=3
- Themes: `politics` centrality 2 — 쇼군·오오쿠와 여성 중심 통치 제도가 사건 자체의 핵심이다: https://melody-web.com/sakuhin/?id=3 ; `historicalReconstruction` centrality 2 — 역사 인물·에도 제도를 성별 역전 전제로 재구성하는 구조를 공식 심사평이 직접 논한다: https://j-mediaarts-festival.bunka.go.jp/award/single/ohoku/index.html
- Known axes: `strategy=2` — 궁정·통치·권력 관계에서 정치적 계획과 운영이 존재하지만 장기 전략만이 유일한 보상은 아니다: https://melody-web.com/sakuhin/?id=3
- Known axes: `worldBuilding=4` — 역병, 인구 변화, 성별 역전 통치 규칙과 역사 제도가 반복적으로 서사를 결정한다: https://www.hakusensha.co.jp/comicslist/40895/ ; https://melody-web.com/sakuhin/?id=3
- Known axes: `characterArcWeight=4` — 역사적 인물과 인간관계의 선택·변화를 공식 심사평이 핵심 성취로 다룬다: https://j-mediaarts-festival.bunka.go.jp/award/single/ohoku/index.html
- Known axes: `relationshipStructure=4` — 여러 세대의 쇼군·오오쿠·정치 관계망이 중심인 군상 구조다: https://melody-web.com/sakuhin/?id=3 ; https://j-mediaarts-festival.bunka.go.jp/award/single/ohoku/index.html
- Known axes: `darkness=2` — 역병, 권력과 폭력이 진지한 위험으로 반복되지만 공식 소개만으로 지속적 극단 4는 확정하지 않았다: https://www.hakusensha.co.jp/comicslist/40895/ ; https://j-mediaarts-festival.bunka.go.jp/award/single/ohoku/index.html
- Unknown limitations: `progression`, `problemSolving`, `pacing`, `mysteryReveal`은 세대별 장기 서사의 초반 반복 빈도를 공식 소개로 확정할 수 없다. `comedy`, `mentalStress`, `romance`, `emotionalWarmth`는 성·재생산·관계 소재의 존재만으로 강도와 보상 중심성을 정할 수 없다.
- Art limitation: 공식 뷰어 내부 페이지를 판독하지 않았으므로 Art 4축 모두 `unknown`이다: https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59214301ookuXXX00111&viewer=bs
- Uncertainty/conflicts: 공식 서지의 ISBN `9784592143017`은 패킷 대표 ISBN과 일치한다. 성관계·재생산·역병·권력 폭력을 다루지만 일반판 유통 작품이며, 소재만으로 성인 전용으로 분류하지 않는다. 명시적 `adult=false`가 없어 최종 safety gate가 필요하다.

## work-76c038b398f4b28b7748 — 妖しのセレス

- Evidence ID: `ev-pilot-001-a-work-76c038b398f4b28b7748`
- Genres: `fantasy`, `mystery`, `romance` — 천녀 혈통·초자연적 힘, 그 비밀, 중심 관계를 공식 작품 소개가 직접 제시한다: https://e-comi.shogakukan.co.jp/books/091363540000d0000000
- Theme: `survival` centrality 2 — 각성한 16세 주인공을 제거하려는 가문과의 생존 갈등이 중심 전제다: https://e-comi.shogakukan.co.jp/books/091363540000d0000000
- Known axes: `mysteryReveal=2` — 천녀 혈통과 힘의 비밀 공개가 주요 갈등에 관여하지만 소개만으로 매 에피소드의 핵심 보상 4는 확정하지 않았다: https://e-comi.shogakukan.co.jp/books/091363540000d0000000
- Known axes: `worldBuilding=2` — 천녀 전승·혈통·힘의 규칙이 갈등에 기능적으로 관여한다: https://e-comi.shogakukan.co.jp/books/091363540000d0000000
- Known axes: `characterArcWeight=2` — 아야의 각성과 정체성 변화가 초자연적 사건과 함께 중심을 이룬다: https://e-comi.shogakukan.co.jp/books/091363540000d0000000
- Known axes: `relationshipStructure=2` — 주인공과 가문·주요 관계가 고정 핵심 갈등 구조를 이룬다: https://e-comi.shogakukan.co.jp/books/091363540000d0000000
- Known axes: `darkness=3` — 가족의 살해 위협이 중심이어서 단순 진지함 2보다 높지만, 공식 소개만으로 지속적 극단 4는 확정하지 않았다: https://e-comi.shogakukan.co.jp/books/091363540000d0000000
- Known axes: `mentalStress=3` — 가족 내부에서 제거 대상이 되는 지속 위협은 강한 심리 압박을 만들지만, 붕괴가 지속되는 4의 근거는 부족하다: https://e-comi.shogakukan.co.jp/books/091363540000d0000000
- Known axes: `romance=2` — 공식 작품 페이지가 연애 관계를 주요 요소로 제시하지만 사건 전체의 유일한 중심 4까지는 확인되지 않았다: https://e-comi.shogakukan.co.jp/books/091363540000d0000000
- Unknown limitations: `progression`, `problemSolving`, `strategy`, `pacing`은 공식 소개가 반복적 보상·계획·상태 변화 빈도를 제시하지 않는다. `comedy`와 `emotionalWarmth`는 살해 위협과 로맨스의 존재만으로 낮음·높음을 확정할 수 없다.
- Art limitation: 공식 뷰어 내부 페이지를 판독하지 않았으므로 Art 4축 모두 `unknown`이다: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091363540000d0000000
- Uncertainty/conflicts: 작품·저자·대표 1권 identity 충돌은 발견되지 않았다. 가족 폭력과 연애·성 관련 민감 소재는 안전 검수 대상이지만 성인 전용 분류와 동일하지 않으며, 명시적 `adult=false`가 없어 최종 safety gate가 필요하다.

## work-b4b21d2ebe5b8efc84ea — Dr.コトー診療所

- Evidence ID: `ev-pilot-001-a-work-b4b21d2ebe5b8efc84ea`
- Genre: `sliceOfLife` — 외딴 섬에서 의사가 주민을 치료하고 신뢰를 쌓는 반복 일상·공동체 구조를 공식 소개가 지지한다: https://e-comi.shogakukan.co.jp/books/091525010000d0000000
- Theme: `workplace` centrality 2 — 제한된 환경의 섬 진료소와 의료 업무가 반복 핵심 무대다: https://e-comi.shogakukan.co.jp/books/091525010000d0000000
- Known axes: `problemSolving=4` — 제한된 의료 환경에서 환자의 문제를 진단·치료하는 과정이 반복 핵심이다: https://e-comi.shogakukan.co.jp/books/091525010000d0000000
- Known axes: `characterArcWeight=4` — 주민과 신뢰를 쌓는 인물·관계 변화가 치료 사건과 함께 핵심 보상이다: https://e-comi.shogakukan.co.jp/books/091525010000d0000000
- Known axes: `relationshipStructure=2` — 고토와 섬 주민 공동체가 반복되는 고정 관계 구조를 이룬다: https://e-comi.shogakukan.co.jp/books/091525010000d0000000
- Known axes: `mentalStress=2` — 질병·수술·죽음의 위험이 긴장을 만들지만 공동체 신뢰 서사가 압박을 완충한다: https://e-comi.shogakukan.co.jp/books/091525010000d0000000
- Known axes: `emotionalWarmth=4` — 고립된 진료소에서 주민을 치료하며 신뢰와 유대를 쌓는 과정이 핵심 보상이다: https://e-comi.shogakukan.co.jp/books/091525010000d0000000
- Unknown limitations: `progression`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`은 한 소개로 초반의 반복 빈도와 구조를 확정할 수 없다. `comedy`, `darkness`, `romance`는 의료 위험과 공동체 소재만으로 존재·강도를 판정할 수 없다.
- Art limitation: 공식 뷰어 내부 페이지를 판독하지 않았고 한 의료 에피소드가 톤을 대표한다고 확인하지 못했으므로 Art 4축 모두 `unknown`이다: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091525010000d0000000
- Uncertainty/conflicts: Factor Dictionary에 medical Genre가 없으므로 임의 태그를 만들지 않았다. 작품·저자·대표 1권 identity 충돌은 발견되지 않았다. 수술·질병·죽음은 성인 전용 분류의 증거가 아니며 명시적 `adult=false`가 없어 최종 safety gate가 필요하다.

## work-c4abbc1b44fa5706bce3 — 風光る

- Evidence ID: `ev-pilot-001-a-work-c4abbc1b44fa5706bce3`
- Genres: `historical`, `romance` — 막부 말기 신선조와 세이·오키타의 관계를 공식 작품 페이지가 중심 전제로 설명한다: https://e-comi.shogakukan.co.jp/books/091373510000d0000000
- Themes: `combat` centrality 1 — 신선조 입대와 검술 갈등이 존재하지만 공식 소개만으로 매회 핵심 2는 확정하지 않았다: https://e-comi.shogakukan.co.jp/books/091373510000d0000000 ; `politics` centrality 1 — 막부 말기·신선조 정치가 배경과 사건에 관여하지만 운영 자체가 유일한 중심은 아니다: https://e-comi.shogakukan.co.jp/books/091373510000d0000000 ; `revenge` centrality 1 — 가족의 원수가 입대의 직접 동기지만 장기 반복 mechanic인지는 확인되지 않았다: https://e-comi.shogakukan.co.jp/books/091373510000d0000000
- Known axes: `characterArcWeight=4` — 세이의 복수 동기·남장 정체성과 오키타와의 관계 변화가 중심 보상이다: https://e-comi.shogakukan.co.jp/books/091373510000d0000000
- Known axes: `relationshipStructure=2` — 세이·오키타의 중심 관계와 신선조 핵심 인물이 반복되는 고정 관계 구조다: https://e-comi.shogakukan.co.jp/books/091373510000d0000000
- Known axes: `darkness=2` — 가족의 죽음, 복수와 검술 폭력이 진지한 위험으로 존재하지만 공식 소개만으로 암울함 지속 4는 확정하지 않았다: https://e-comi.shogakukan.co.jp/books/091373510000d0000000
- Known axes: `romance=4` — 세이와 오키타의 관계가 공식 소개와 장르의 중심 전개다: https://e-comi.shogakukan.co.jp/books/091373510000d0000000
- Unknown limitations: `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`은 공식 소개가 초반 반복 구조나 계획·설정 비중을 제시하지 않는다. 특히 역사 배경만으로 `historicalReconstruction` Theme나 높은 `worldBuilding`을 자동 부여하지 않았다. `comedy`, `mentalStress`, `emotionalWarmth`는 복수·연애 소재만으로 강도를 확정할 수 없다.
- Art limitation: 공식 뷰어 내부 페이지를 판독하지 않았으므로 Art 4축 모두 `unknown`이다: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091373510000d0000000
- Uncertainty/conflicts: 七三太朗·川三番地의 동명 야구 만화와 제목만으로 병합하면 안 되며, 이 Work는 渡辺多恵子 작품으로 고정한다. 전쟁·복수·검술 폭력과 성별 위장은 성인 전용 분류의 증거가 아니고, 명시적 `adult=false`가 없어 최종 safety gate가 필요하다.
