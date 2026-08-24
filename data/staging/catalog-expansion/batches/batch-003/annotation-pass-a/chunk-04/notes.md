# Batch 003 Pass A annotation notes — chunk 04

## Binding and review boundary

- pass: `annotation-pass-a`
- chunk: `04`
- scope: `entry_1_3_volumes`
- annotator: Local Codex subagent
- reviewedByHuman: `false`
- candidateSha256: `2277f22c0c0f4b04815801059a4faca0db316d9de5efe1027cb3221725c9c410`
- manifest.json SHA-256: `2425deaaa1672ba12f089d3a4633b2cef86bb610980fb41506c8f73e4fe5bdb3`
- manifest ordered-work-set SHA-256: `119b093b1d4e0835fc4aede53e72a2a514bf703f8bb057eea29f557d50c76d95`
- PAYLOAD.sha256 ledger SHA-256: `b9e33aafa0456e2cc863a1230de7173eb24ae268a8a50d08a3c9b37ccfac8bdf`
- frozen-work-set.csv SHA-256: `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd`
- annotation-review-adjudication-request.md SHA-256: `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759`
- research/chunk-04.md SHA-256: `80450417a3500e632acddcf20ee568fbc18b56f363530bbf840cc2735c585546`
- factor-dictionary.md SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- annotation-guide.md SHA-256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`

Pass A는 동결된 공식 우선 텍스트 Evidence만 사용했다. 이 chunk에는 독립성·게시일·확인 범위를 갖춘 복수 유저평 packet이 없으므로 유저평을 보조 근거로 사용하지 않았다. Genre는 Axis 값으로 변환하지 않았고, 짧은 소개나 단일 사건으로 지속성을 확인할 수 없는 축은 `unknown`으로 닫았다. 이 산출물은 recommendation context, eligibility, promotion, safety 또는 identity 결론을 만들지 않는다.

공식 내부 페이지의 직접 픽셀 표본이 어느 작품에도 동결되지 않았다. 따라서 10작품의 `artRealism`, `artDensity`, `visualSoftness`, `motionImpact` 40행은 모두 명시적 `unknown`이다. 표본 부족은 낮은 값이나 `notApplicable`의 근거가 아니며, 연속 동작의 시작·전개·끝 참조도 없다. 임시 이미지는 생성하거나 보존하지 않았다.

## work-a7413b6e35e0d316a538 — となりの怪物くん

- Official text: [講談社 1권](https://www.kodansha.co.jp/comic/products/0000041905), [講談社 2권](https://www.kodansha.co.jp/comic/products/0000041920), [講談社 3권](https://www.kodansha.co.jp/comic/products/0000041940). Retrieved 2026-08-23.
- Genre·Theme: 학교 과제에서 시작된 만남, 여름방학, 문화제가 1~3권의 관계 변화를 계속 매개하므로 `sliceOfLife;romance`, `school=2`로 제안했다.
- Known text axes: 서로에게 무관심하던 상태에서 고백·감정 자각·엇갈림의 변화로 서서히 이동해 `progression=2`; 두 주인공의 동기와 감정 인식이 핵심 보상이어서 `characterArcWeight=4`; 중심 쌍과 가족·동급생이 반복되는 핵심군이므로 `relationshipStructure=2`; 연애 감정의 고백과 상호 인식이 세 권의 중심 전개라 `romance=4`이다.
- Unknown limitation: `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `comedy`, `darkness`, `mentalStress`, `emotionalWarmth`는 권 소개가 분석 과정, 장면 변화 간격 또는 지속적인 정서 강도를 확정하지 못한다. 가족 문제나 엇갈림의 존재만으로 압박과 따뜻함을 수치화하지 않았다.
- Art closure: [講談社 1권 상품 페이지](https://www.kodansha.co.jp/comic/products/0000041905), 일반판 1권, readable pages `0`, scene contexts `0`, SHA-256 `not-generated`. 조사 packet에 공식 내부 페이지 표본이 없다.

## work-a7e0062c7153978fc6fe — 失恋ショコラティエ

- Official text: [小学館eコミックストア 1권](https://e-comi.shogakukan.co.jp/books/091322600000d0000000), [2권](https://e-comi.shogakukan.co.jp/books/091328240000d0000000), [3권](https://e-comi.shogakukan.co.jp/books/091334640000d0000000). Retrieved 2026-08-23.
- Genre·Theme: 초콜릿 기술 연마와 쇼콜라티에 활동이 지속되는 연애 서사이므로 `sliceOfLife;romance`, `crafting=2`; 직업 활동과 경쟁점은 2권부터 병행되므로 `workplace=1`로 제한했다.
- Known text axes: 제과학교 학생에서 파리 수련을 마친 직업인으로 이동해 `progression=2`; 爽太와 주변 인물의 동기·자의식·선택이 핵심이라 `characterArcWeight=4`; 서로 다른 방향의 복수 감정선이 병행되어 `relationshipStructure=4`; 이루어지지 않은 사랑과 새로운 감정 관계가 세 권의 전개를 지배해 `romance=4`이다.
- Unknown limitation: `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `comedy`, `darkness`, `mentalStress`, `emotionalWarmth`는 소개가 관계 행동의 계산, 장면 빈도, 윤리적 처리 또는 체감 강도를 충분히 보여 주지 않는다. 거절과 집착을 자동으로 정신적 압박 값으로 바꾸지 않았다.
- Art closure: [小学館eコミックストア 1권](https://e-comi.shogakukan.co.jp/books/091322600000d0000000), 원판 일반판 1권의 공식 전자 페이지, readable pages `not-counted`, scene contexts `not-counted`, SHA-256 `not-generated`. 내부 페이지를 직접 취득하거나 판독하지 않았다.

## work-a960372ed5efa4031896 — シルバーマウンテン

- Official text: [小学館 1권](https://shogakukan-comic.jp/book?isbn=9784098542420), [小学館 2권](https://shogakukan-comic.jp/book?isbn=9784098543267), [小学館 3권](https://shogakukan-comic.jp/book?isbn=9784098544530). Retrieved 2026-08-23.
- Genre·Theme: 무술가가 괴물과 마법이 있는 이세계의 산 정상으로 이동하며 매권 적과 맞서므로 `action;fantasy`, `adventure=2`, `combat=2`, `martialArts=2`, `exploration=2`로 제안했다.
- Known text axes: 용의 서식지, 거짓말할 수 없는 사람들, 불과 마법, 서로 다른 적의 규칙이 여정에 반복 관여하고 범위가 확장되어 `worldBuilding=3`이다.
- Unknown limitation: `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `characterArcWeight`, `relationshipStructure`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`는 강함 추구, 한 번의 과거 공개, 적의 책략만으로 반복 성장·해결 구조·정서 강도를 확정할 수 없다.
- Art closure: [小学館 1권 상품 페이지](https://shogakukan-comic.jp/book?isbn=9784098542420), 일반판 1권, readable pages `0`, scene contexts `0`, SHA-256 `not-generated`. 내부 페이지와 연속 동작 표본을 확인하지 않았다.

## work-aa6d796e2e04a55b94b1 — 惑星のさみだれ

- Official text: [少年画報社 1권](https://www.shonengahosha.co.jp/book_Info.php?id=7347), [少年画報社 2권](https://www.shonengahosha.co.jp/book_Info.php?id=6004), [少年画報社 3권](https://www.shonengahosha.co.jp/book_Info.php?id=6115). Retrieved 2026-08-23.
- Genre·Theme: 평범한 대학생 일상 옆에서 기사들의 지구 방어와 반복 공격이 진행되므로 `action;fantasy;sliceOfLife`, `combat=2`, `survival=2`로 제안했다.
- Known text axes: 동물 기사·공주·힘의 부여·진흙 인형·지구 파괴 목표가 사건에 반복 관여해 `worldBuilding=3`; 夕日의 신뢰 형성과 さみだれ의 목적·동기가 사건과 함께 중요해 `characterArcWeight=3`; 중심 두 사람과 기사들이 이어지는 핵심군이므로 `relationshipStructure=2`이다.
- Unknown limitation: `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`는 3권 소개가 시리즈 공통 문구에 가깝고 심사 코멘트의 독서 범위도 통일되지 않아 반복 보상이나 체감 톤을 확정하지 못한다. 지구 파괴 위기를 darkness 값으로 자동 변환하지 않았다.
- Art closure: [少年画報社 1권 상품 페이지](https://www.shonengahosha.co.jp/book_Info.php?id=7347), 일반판 1권, readable pages `0`, scene contexts `0`, SHA-256 `not-generated`. 공식 내부 페이지 표본을 확보하지 않았다.

## work-ae0ac8a5acfc5fbb7dd6 — 終末のワルキューレ

- Official and licensed text: [コアミックス 원작 작품 페이지](https://catalog.coamix.co.jp/record-of-ragnarok/), [コミックシーモア 원작 1~3권 유통 페이지](https://www.cmoa.jp/title/149793/). Retrieved 2026-08-23.
- Edition boundary: [コアミックス 総天然色 페이지](https://catalog.coamix.co.jp/valktennen/)는 전면 컬러 세로 스크롤 리메이크의 identity·edition lead일 뿐 원작 Factor나 Art 근거로 사용하지 않았다.
- Genre·Theme: 인류 존속을 건 신과 인간의 13개 일대일 대결이 반복 구조이므로 `action;fantasy`, `combat=2`, `survival=2`, `tournament=2`로 제안했다.
- Known text axes: 신과 역사상의 인물, 13대13 규칙, 경기 순서가 초반 대결을 계속 규정하므로 기능적인 설정 수준의 `worldBuilding=2`이다.
- Unknown limitation: `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `characterArcWeight`, `relationshipStructure`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`는 정식 유통 소개가 경기의 개시·결말만 요약해 성장, 책략, 전개 간격, 인물 비중 또는 체감 강도를 확정하지 못한다. 멸망 위험과 전투를 darkness 값으로 바꾸지 않았다.
- Art closure: [코아믹스 원작 작품 페이지](https://catalog.coamix.co.jp/record-of-ragnarok/)의 제1화 진입점, 원작 만화 판본, readable pages `not-counted`, scene contexts `not-counted`, SHA-256 `not-generated`. 내장 미리보기의 내부 페이지·판본·연속 동작 범위를 직접 검증하지 않았다.

## work-b2be97620643b3342637 — アオイホノオ

- Official text: [小学館eコミックストア 1권](https://e-comi.shogakukan.co.jp/books/091512680000d0000000), [2권](https://e-comi.shogakukan.co.jp/books/091216500000d0000000), [3권](https://e-comi.shogakukan.co.jp/books/091221090000d0000000). Retrieved 2026-08-23.
- Genre·Theme: 예술대학에서 만화가를 꿈꾸고 실제 원고·투고로 이동하는 창작 지망 생활이 반복되어 `comedy;sliceOfLife`, `crafting=2`, `school=2`로 제안했다. Genre 존재만으로 comedy Axis 값을 정하지 않았다.
- Known text axes: 행동하지 못하던 상태에서 한계·시도·좌절을 거쳐 실제 투고로 이동해 `progression=2`; 1980년대 초 만화·애니메이션 환경과 동시대 작품이 선택에 기능적으로 관여해 `worldBuilding=2`; 창작 자의식과 행동 변화가 핵심 보상이어서 `characterArcWeight=4`; 큰 포부와 성과의 간극, 불안과 실패가 세 권에 반복되어 혼합 수준의 `mentalStress=2`이다.
- Unknown limitation: `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `relationshipStructure`, `comedy`, `darkness`, `romance`, `emotionalWarmth`는 소개와 주관적 심사 코멘트만으로 해결 과정, 인물망, 희극 빈도 또는 정서 강도를 더 확정할 수 없다. 과장된 홍보 문구를 comedy 값으로 환산하지 않았다.
- Art closure: [小学館eコミックストア 1권](https://e-comi.shogakukan.co.jp/books/091512680000d0000000), 원판 일반판 1권의 공식 전자 페이지, readable pages `not-counted`, scene contexts `not-counted`, SHA-256 `not-generated`. 내부 페이지를 직접 판독하지 않았다.

## work-b708734262fb9b67f948 — ねこだらけ

- Official text: [講談社 단권 상품 페이지](https://www.kodansha.co.jp/comic/products/0000013952). Retrieved 2026-08-23.
- Genre·Theme: 여러 고양이의 기묘한 짧은 행동을 반복하는 4컷 구성에서 `comedy` Genre만 제안했다. 현재 Theme 사전에서 직접 대응하는 반복 핵심이 없어 Theme row는 만들지 않았다.
- Known text axes: 2006~2009년 게재분이 독립적인 짧은 행동 단위를 반복하고 장기 성장 서사를 두지 않아 `progression=0`; 인물 변화보다 개별 행동 상황 자체가 보상이므로 `characterArcWeight=0`이다.
- Unknown limitation: `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `relationshipStructure`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`는 4컷 형식과 홍보 문구만으로 목표 변화 간격, 재미의 빈도, 관계 구조 또는 정서 체감을 판정할 수 없다. Genre를 comedy Axis 값으로 자동 변환하지 않았다.
- Art closure: [講談社 단권 상품 페이지](https://www.kodansha.co.jp/comic/products/0000013952), 일반판 단권, readable pages `0`, scene contexts `0`, SHA-256 `not-generated`. 공식 내부 페이지 표본을 취득하지 않았다.

## work-bd42208a660912d9d95d — 路地恋花

- Official text: [講談社 1권](https://www.kodansha.co.jp/comic/products/0000029686), [講談社 2권](https://www.kodansha.co.jp/comic/products/0000029749), [講談社 3권](https://www.kodansha.co.jp/comic/products/0000029829). Retrieved 2026-08-23.
- Genre·Theme: 교토의 공동 공간에서 장인·예술가의 일과 관계를 에피소드별로 반복하므로 `sliceOfLife;romance`, `crafting=2`, `workplace=2`로 제안했다.
- Known text axes: 교토 골목의 연립주택, 공방과 서로 다른 직업이 각 사건의 연결 규칙으로 기능해 `worldBuilding=2`; 직업인의 동기와 만남·관계가 각 에피소드의 중심이므로 `characterArcWeight=4`; 매권 다른 인물을 중심에 두는 다중 관계 구조여서 `relationshipStructure=4`; 연애는 직업·공예와 함께 반복되는 주요 서브 플롯이므로 `romance=2`이다.
- Unknown limitation: `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `comedy`, `darkness`, `mentalStress`, `emotionalWarmth`는 상품 소개가 에피소드 연결 정도, 장면 빈도, 갈등 결과 또는 정서 강도를 확정하지 못한다. 결혼식 당일 사건 하나를 지속적인 압박으로 일반화하지 않았다.
- Art closure: [講談社 1권 상품 페이지](https://www.kodansha.co.jp/comic/products/0000029686), 일반판 1권, readable pages `0`, scene contexts `0`, SHA-256 `not-generated`. 장소·공예에 대한 심사 인상은 Art Evidence로 사용하지 않았다.

## work-c5e8c957903bf1832dc5 — 日々ロック

- Official text: [集英社 1권 전자판](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08879034879034315501), [集英社 2권 전자판](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08879173879034315501), [集英社 3권 전자판](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08879337879034315501). Retrieved 2026-08-23.
- Genre·Theme: 학교생활에서 시작해 밴드와 녹음 활동으로 이동하는 일상형 음악 성장 서사이므로 `sliceOfLife`; 학교가 1권과 2권 초반에만 중심이어서 `school=1`로 제한했다.
- Known text axes: 밴드 시작·상경·재결합·첫 녹음이라는 성취 단계가 이어져 `progression=3`; 1년 경과, 졸업 진로, 도쿄 이동, 녹음으로 목표·장소·상태가 크게 바뀌어 `pacing=3`; 자신감과 록의 꿈, 진로 선택이 핵심이라 `characterArcWeight=4`; 고정 밴드와 외부 인물이 반복되어 `relationshipStructure=2`; 괴롭힘·진로 불안·연주 갈등이 초반 세 권에 지속되어 혼합 수준의 `mentalStress=2`이다.
- Unknown limitation: `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`, `comedy`, `darkness`, `romance`, `emotionalWarmth`는 권 소개가 연주 문제의 해결 과정, 공연 사이 체감 톤, 관계의 지속적 정서를 충분히 보여 주지 않는다. 폭행 한 번과 체육관 손상을 darkness 값으로 바꾸지 않았다.
- Art closure: [集英社 1권 전자판 페이지](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08879034879034315501), 전자판 1권, readable pages `0`, scene contexts `0`, SHA-256 `not-generated`. 공연에 대한 심사 인상은 픽셀 표본이 아니므로 Art 값을 만들지 않았다.

## work-c805c5b70111f75d6fb5 — 海獣の子供

- Official text: [小学館eコミックストア 1권](https://e-comi.shogakukan.co.jp/books/091883680000d0000000), [2권](https://e-comi.shogakukan.co.jp/books/091883690000d0000000), [3권](https://e-comi.shogakukan.co.jp/books/091884220000d0000000). Retrieved 2026-08-23.
- Genre·Theme: 항구·수족관·바다를 오가며 소년들의 정체와 해양 사건을 추적하므로 `fantasy;mystery`, `investigation=2`, `exploration=2`로 제안했다.
- Known text axes: 과거 섬의 소년, 현재의 실종, 운석, 두 소년의 과거가 단서와 공개 구조로 이어져 `mysteryReveal=4`; 바다·수족관·포경 섬·소년들의 기원과 해양 현상이 반복 관여해 `worldBuilding=3`; 琉花의 소외와 만남, 실종 뒤 반응 및 세 인물의 과거가 사건과 함께 중요해 `characterArcWeight=3`; 琉花·海·空·ジム가 현재와 과거를 잇는 핵심군이므로 `relationshipStructure=2`이다.
- Unknown limitation: `progression`, `problemSolving`, `strategy`, `pacing`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`는 소개가 현상의 해결 방식, 장면 간격, 사라짐의 의미 또는 정서 영향의 지속성을 확정하지 못한다. 실종과 포경을 자동으로 어둠이나 압박 값으로 바꾸지 않았다.
- Art closure: [小学館eコミックストア 1권](https://e-comi.shogakukan.co.jp/books/091883680000d0000000), 원판 일반판 1권의 공식 전자 페이지, readable pages `not-counted`, scene contexts `not-counted`, SHA-256 `not-generated`. 내부 페이지를 직접 판독하지 않았고 심사평의 감각·그림 찬사는 Art Evidence로 사용하지 않았다.
