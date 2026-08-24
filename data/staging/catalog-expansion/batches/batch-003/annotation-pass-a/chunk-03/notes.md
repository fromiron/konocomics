# Batch 003 Pass A annotation notes — chunk 03

## Binding and review boundary

- pass: `annotation-pass-a`
- chunk: `03`
- scope: `entry_1_3_volumes`
- annotator: Local Codex subagent
- reviewedByHuman: `false`
- candidateSha256: `2277f22c0c0f4b04815801059a4faca0db316d9de5efe1027cb3221725c9c410`
- manifest.json SHA-256: `2425deaaa1672ba12f089d3a4633b2cef86bb610980fb41506c8f73e4fe5bdb3`
- manifest ordered-work-set SHA-256: `119b093b1d4e0835fc4aede53e72a2a514bf703f8bb057eea29f557d50c76d95`
- PAYLOAD.sha256 ledger SHA-256: `b9e33aafa0456e2cc863a1230de7173eb24ae268a8a50d08a3c9b37ccfac8bdf`
- frozen-work-set.csv SHA-256: `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd`
- annotation-review-adjudication-request.md SHA-256: `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759`
- research/chunk-03.md SHA-256: `1e65e398e2c375129ac118c9f54e0d75eae1f145fc1b8b7fa68cb847c459aaa1`
- factor-dictionary.md SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- annotation-guide.md SHA-256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`

Pass A는 동결된 공식 우선 텍스트 Evidence만 사용했다. 이 chunk에는 독립성·게시일·확인 범위를 갖춘 복수 유저평 packet이 없으므로 유저평을 보조 근거로 사용하지 않았다. Genre는 Axis 값으로 변환하지 않았고, 짧은 소개나 단일 사건으로 지속성을 확인할 수 없는 축은 `unknown`으로 닫았다. 이 산출물은 recommendation context, eligibility, promotion, safety 또는 identity 결론을 만들지 않는다.

공식 내부 페이지의 직접 픽셀 표본이 어느 작품에도 동결되지 않았다. 따라서 10작품의 `artRealism`, `artDensity`, `visualSoftness`, `motionImpact` 40행은 모두 명시적 `unknown`이다. 표본 부족은 낮은 값이나 `notApplicable`의 근거가 아니며, 연속 동작의 시작·전개·끝 참조도 없다. 임시 이미지는 생성하거나 보존하지 않았다.

## work-7a4e7ba45413e1b8af34 — 青空エール

- Official text: [集英社 1권 전자 리마스터판](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08846366846366345501), [集英社 2권 전자 리마스터판](https://books.shueisha.co.jp/items/contents.html?jdcn=08846393846366345501), [集英社 3권 전자 리마스터판](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08846426846366345501). Retrieved 2026-08-23.
- Genre·Theme: 취주악부와 야구부의 학교 활동, 고시엔 목표, 감정 변화가 1~3권 소개에 반복되어 `sports;sliceOfLife;romance`, `school=2`, `sportsCompetition=2`로 제안했다.
- Known text axes: 초보 입부, 강도 높은 반복 연습, 실패 뒤 재도전이 이어져 `progression=4`; 동기와 실패·회복이 핵심 사건이므로 `characterArcWeight=4`; 두 학생과 양쪽 부·선배·지도자가 반복되어 `relationshipStructure=2`; 연애 감정은 2권부터 스포츠 목표와 병행되어 `romance=2`; 상호 격려와 조언이 반복 보상이어서 `emotionalWarmth=3`이다.
- Unknown limitation: `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `comedy`, `darkness`, `mentalStress`는 권 소개가 분석 과정, 장기 계획, 장면 간격 또는 지속 체감을 확정하지 못한다. 한 번의 실패와 두려움만으로 어둠이나 정신적 압박의 정도를 정하지 않았다.
- Art closure: [集英社 reader](https://www.shueisha.co.jp/books/reader/main.php?cid=08846366846366345501), 전자 리마스터판 1권, readable pages `not-counted`, scene contexts `not-counted`, SHA-256 `not-generated`. Frozen 종이 일반판과 전자 리마스터판의 내용·시각 판본 대응이 확인되지 않았다.

## work-7abb6e8396c5e1252173 — 甘々と稲妻

- Official text: [講談社 1권](https://www.kodansha.co.jp/comic/products/0000047277), [講談社 2권](https://www.kodansha.co.jp/comic/products/0000047323), [講談社 3권](https://www.kodansha.co.jp/comic/products/0000047354). Retrieved 2026-08-23.
- Genre·Theme: 한부모 가정의 식사 일상과 매권 반복되는 조리·함께 먹기가 직접 확인되어 `sliceOfLife`, `cooking=2`; 학생이 부녀의 식사 공동체에 지속적으로 합류하는 범위만 `foundFamily=1`로 제한했다.
- Known text axes: 초보 조리에서 재료와 조리법이 넓어져 `progression=2`; 가족 기억과 세 사람의 감정 교류가 중심이라 `characterArcWeight=4`; 부녀와 학생의 고정된 식사 단위가 반복되어 `relationshipStructure=2`; 함께 만들고 먹으며 상실과 유대를 다루는 것이 핵심 보상이어서 `emotionalWarmth=4`이다.
- Unknown limitation: `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `comedy`, `darkness`, `mentalStress`, `romance`는 상품 소개만으로 빈도와 강도를 확인할 수 없다. 배우자의 죽음과 가족 기억은 곧바로 darkness나 mentalStress 값으로 바꾸지 않았다.
- Art closure: [講談社 1권 상품 페이지](https://www.kodansha.co.jp/comic/products/0000047277), 일반판 1권, readable pages `0`, scene contexts `0`, SHA-256 `not-generated`. 조사 환경에서 내부 페이지 자산을 판독 가능한 형태로 취득하지 못했다.

## work-81c561ca6bb74a301cf8 — ライドンキング

- Official text: [講談社 1권](https://www.kodansha.co.jp/comic/products/0000318782), [講談社 2권](https://www.kodansha.co.jp/comic/products/0000321710), [講談社 3권](https://www.kodansha.co.jp/comic/products/0000325216). Retrieved 2026-08-23.
- Genre·Theme: 이세계의 마물, 산적·기사단 전투, 던전·마을 활동이 직접 반복되어 `action;fantasy`, `adventure=2`, `combat=2`; 3권의 교섭과 독립은 `politics=1`, 2권 던전은 `dungeon=1`, 2~3권 마을 건설·진로는 `territoryManagement=1`로 제한했다.
- Known text axes: 전투, 공동체 건설, 교섭이 혼합되어 `problemSolving=2`; 마을 방위·교섭·독립에 단기 계획이 있으므로 `strategy=2`; 인간·마물·던전·기사단·마을 규칙과 세력이 사건에 반복 관여해 `worldBuilding=3`; 고정 일행과 보호 대상 공동체가 이어져 `relationshipStructure=2`; 산적, 언데드, 마을 공격이라는 진지한 위험이 반복되지만 암울함이 전부를 지배한다는 근거는 없어 `darkness=2`이다.
- Unknown limitation: `progression`, `pacing`, `mysteryReveal`, `characterArcWeight`, `comedy`, `mentalStress`, `romance`, `emotionalWarmth`는 과장된 전제와 권별 사건 목록만으로 반복 보상, 장면 간격 또는 지속적 정서 체감을 정할 수 없다. 3권의 후회 한 번을 장기 인물 변화로 일반화하지 않았다.
- Art closure: [講談社 1권 상품 페이지](https://www.kodansha.co.jp/comic/products/0000318782), 일반판 1권, readable pages `0`, scene contexts `0`, SHA-256 `not-generated`. 조사 환경에서 내부 페이지 자산을 판독 가능한 형태로 취득하지 못했다.

## work-83510afea8d961aec880 — 俺はまだ本気出してないだけ

- Official text: [小学館eコミックストア 1권](https://e-comi.shogakukan.co.jp/books/091883770000d0000000), [2권](https://e-comi.shogakukan.co.jp/books/091884140000d0000000), [3권](https://e-comi.shogakukan.co.jp/books/091884270000d0000000). Retrieved 2026-08-23.
- Genre·Theme: 늦은 진로 전환을 풍자적으로 다루는 일상과 아르바이트·창작 진로가 확인되어 `comedy;sliceOfLife`, `workplace=1`로 제안했다. Genre 존재만으로 comedy Axis의 강도를 확정하지 않았다.
- Known text axes: 창작 지속 여부와 자기 인식, 가족 갈등이 1~3권의 중심이므로 `characterArcWeight=4`; 아버지·딸·친구·직장 동료가 반복되는 핵심 조연군이라 `relationshipStructure=2`; 투고 평가, 부친과의 갈등, 여러 자아의 내적 논쟁이 계속되어 혼합 수준의 압박인 `mentalStress=2`로 두었다.
- Unknown limitation: `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `comedy`, `darkness`, `romance`, `emotionalWarmth`는 원고 투고, 풍자적 소개, 가족 반응만으로 반복 보상이나 체감 강도를 확정할 수 없다.
- Art closure: [小学館eコミックストア 1권](https://e-comi.shogakukan.co.jp/books/091883770000d0000000), 원판 일반판 1권, readable pages `not-counted`, scene contexts `not-counted`, SHA-256 `not-generated`. 미리보기 링크만 확인했고 내부 페이지와 맥락을 목록화하지 않았다.

## work-84a6a139c55f2760544e — 僕の心のヤバイやつ

- Official text: [秋田書店 1권](https://www.akitashoten.co.jp/comics/4253226159), [秋田書店 2권](https://www.akitashoten.co.jp/comics/4253226167), [秋田書店 3권 일반판](https://www.akitashoten.co.jp/comics/4253226175). Retrieved 2026-08-23.
- Genre·Theme: 학교의 교실·도서실 일상에서 첫사랑과 관계 변화가 반복되어 `sliceOfLife;romance`, `school=2`로 제안했다.
- Known text axes: 일방 관찰에서 상호 접근과 3권의 전환으로 이어지는 일반적인 arc 변화가 확인되어 `pacing=2`; 선입견, 감정 자각, 두 사람의 변화가 핵심이라 `characterArcWeight=4`; 중심 쌍에 집중된 구조는 단독 0과 고정 핵심군 2 사이여서 `relationshipStructure=1`; 첫사랑과 상호 호의가 매권 전개의 중심이므로 `romance=4`; 상호 접근과 호의가 늘지만 관계 긴장도 함께 있어 `emotionalWarmth=2`이다.
- Unknown limitation: `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`, `comedy`, `darkness`, `mentalStress`는 소개가 해당 반복 구조나 체감 강도를 확정하지 못한다. 1권의 살해 상상만으로 darkness나 mentalStress를 정하지 않았다.
- Art closure: [秋田書店 1권](https://www.akitashoten.co.jp/comics/4253226159), 일반판 1권에서 공식 플랫폼으로 이어지는 후보, readable pages `not-counted`, scene contexts `not-counted`, SHA-256 `not-generated`. 내부 페이지 수·장면 맥락·정확한 판본 자산을 검증하지 않았다.

## work-88e75622b83b794c03ac — 山賊ダイアリー

- Official text: [講談社 1권](https://www.kodansha.co.jp/comic/products/0000038783), [講談社 2권](https://www.kodansha.co.jp/comic/products/0000038817), [講談社 3권](https://www.kodansha.co.jp/comic/products/0000038845). Retrieved 2026-08-23.
- Genre·Theme: 실제 엽사 생활의 일기형 반복 구조가 직접 확인되어 `sliceOfLife`; 포획·해체·야외 위험은 `survival=2`, 잡은 동물의 조리와 식사는 `cooking=1`로 제안했다.
- Known text axes: 첫 사냥에서 다양한 대상·도구·처리 기술로 범위가 넓어져 `progression=2`; 준비, 시행착오, 도구와 책임을 함께 다뤄 직접 행동과 지식이 혼합된 `problemSolving=2`; 총기·면허·덫·자연 환경의 기능적 규칙이 반복되어 `worldBuilding=2`; 공식 목차가 인물 변화보다 사냥 사건과 기술에 집중해 `characterArcWeight=0`; 저자 중심 기록에 공동 사냥과 식사 동료가 간헐적으로 합류해 `relationshipStructure=1`이다.
- Unknown limitation: `strategy`, `pacing`, `mysteryReveal`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`는 목차형 소개가 장면 빈도와 체감 톤을 확정하지 못한다. 동물의 죽음·해체와 야외 위험을 자동으로 darkness나 mentalStress 값으로 바꾸지 않았다.
- Art closure: [講談社 1권 상품 페이지](https://www.kodansha.co.jp/comic/products/0000038783), 일반판 1권, readable pages `0`, scene contexts `0`, SHA-256 `not-generated`. 조사 환경에서 내부 페이지 자산을 판독 가능한 형태로 취득하지 못했다.

## work-9036a98c069b5ef8cd54 — よふかしのうた

- Official text: [小学館eコミックストア 1권](https://e-comi.shogakukan.co.jp/books/091294920000d0000000), [2권](https://e-comi.shogakukan.co.jp/books/091295560000d0000000), [3권](https://e-comi.shogakukan.co.jp/books/098500640000d0000000). Retrieved 2026-08-23.
- Genre·Theme: 흡혈귀와 밤거리 활동, 감정 목표가 1~3권에 이어져 `fantasy;sliceOfLife;romance`; 학교 이탈·복귀 권유는 `school=1`, 밤 활동과 관계 세계의 확대는 `exploration=2`로 제안했다.
- Known text axes: 만나고 좋아하게 되려는 목표가 입맞춤·감정 의식·관계 확장으로 서서히 진행되어 `progression=2`; 흡혈귀 조건과 밤의 인간관계가 기능적 설정으로 반복되어 `worldBuilding=2`; 학교 이탈과 감정 자각·관계 변화가 중심 보상이라 `characterArcWeight=4`; 중심 쌍에 동급생과 새 인물이 반복 합류해 `relationshipStructure=2`; 사랑에 빠지는 목표와 관계 변화가 전개의 중심이므로 `romance=4`이다.
- Unknown limitation: `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `comedy`, `darkness`, `mentalStress`, `emotionalWarmth`는 권 소개가 분석 과정, 장면 간격 또는 지속 체감을 확인하지 못한다. 3권의 수수께끼라는 홍보 표현만으로 mysteryReveal을 정하지 않았고 흡혈귀 설정을 darkness로 변환하지 않았다.
- Art closure: [공식 캠페인 연결 reader 후보](https://sc-portal.tameshiyo.me/9784091294920), ISBN 연결 일반판 1권 후보, readable pages `not-counted`, scene contexts `not-counted`, SHA-256 `not-generated`. 페이지·장면 표본, 판본 범위와 제공 기간을 검증하지 않았다.

## work-98637340992f2f50107d — いつかティファニーで朝食を

- Official text: [新潮社 1권](https://www.shinchosha.co.jp/book/771677/), [新潮社 2권](https://www.shinchosha.co.jp/book/771698/), [新潮社 3권](https://www.shinchosha.co.jp/book/771716/). Retrieved 2026-08-23.
- Genre·Theme: 이별 뒤 생활 재정비, 친구들의 일·연애, 아침 식사 장소가 반복되어 `sliceOfLife;romance`; 여러 인물의 직업 문제가 병행되므로 `workplace=1`로 제한했다.
- Known text axes: 동거 종료 뒤 아침 루틴과 새 생활을 다시 만들고 지역 활동까지 넓어져 `progression=2`; 주인공과 친구들의 일·연애·생활 변화가 중심이라 `characterArcWeight=4`; 여러 친구의 독립적인 문제와 관계가 병행되어 `relationshipStructure=4`; 연애는 식사·일과 함께 지속되는 주요 서브 플롯이므로 `romance=2`이다.
- Unknown limitation: `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `comedy`, `darkness`, `mentalStress`, `emotionalWarmth`는 상품 소개가 에피소드 빈도와 정서 강도를 확정하지 못한다. 이별과 직업 문제의 존재만으로 압박이나 따뜻함의 값을 만들지 않았다.
- Art closure: [新潮社 1권](https://www.shinchosha.co.jp/book/771677/), 일반판 1권, readable pages `0`, scene contexts `0`, SHA-256 `not-generated`. 공식 메타데이터에서 내부 페이지 미리보기 endpoint를 확인하지 못했다.

## work-a25bac53b4757f13f21a — 鬼灯の冷徹

- Official text: [講談社 1권](https://www.kodansha.co.jp/comic/products/0000018223), [講談社 2권](https://www.kodansha.co.jp/comic/products/0000018241), [講談社 3권](https://www.kodansha.co.jp/comic/products/0000018267). Retrieved 2026-08-23.
- Genre·Theme: 저승과 신화·설화 존재를 직장 문제에 반복 배치하는 구성이 확인되어 `fantasy;comedy`, `workplace=2`로 제안했다. Genre 존재와 공식 소개의 희극적 병치는 comedy Axis의 빈도·강도를 확정하지 않는다.
- Known text axes: 1~3권이 성장 단계보다 같은 실무자의 에피소드형 업무 처리를 반복해 `progression=0`; 여러 부서의 문제를 실무와 직접 행동으로 다뤄 `problemSolving=2`; 저승 부서·직무·벌·신화 체계가 사건마다 중요해 `worldBuilding=4`; 인물 변화보다 업무 사건과 설정 활용이 중심이라 `characterArcWeight=0`이다.
- Unknown limitation: `strategy`, `pacing`, `mysteryReveal`, `relationshipStructure`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`는 인물 수나 지옥의 벌, 희극적 소개만으로 구조·빈도·체감을 정할 수 없다. 등장인물 증가를 군상극 값으로 바꾸지 않았다.
- Art closure: [講談社 1권 상품 페이지](https://www.kodansha.co.jp/comic/products/0000018223), 일반판 1권, readable pages `0`, scene contexts `0`, SHA-256 `not-generated`. 조사 환경에서 내부 페이지 자산을 판독 가능한 형태로 취득하지 못했다.

## work-a4ca6e21e97927928e1a — 喰う寝るふたり住むふたり

- Official and licensed text: [コアミックス 작품 페이지](https://catalog.coamix.co.jp/kuuneru/), [コミックシーモア 원판 1~3권 유통 페이지](https://www.cmoa.jp/title/67697/), [コアミックス 신장판 안내](https://www.coamix.co.jp/topics/j1p2sfbvd28v). Retrieved 2026-08-23.
- Genre·Theme: 장기 동거 커플의 일상과 양쪽 관점이 직접 확인되어 `sliceOfLife;romance`로 제안했다. 현재 22개 Theme 중 관계 일상 자체를 직접 나타내는 항목이 없으므로 Theme row는 만들지 않았다.
- Known text axes: 같은 사건을 두 사람의 관점과 감정 변화로 반복해 `characterArcWeight=4`; 중심 쌍에 집중된 dual-view 구조는 단독 0과 고정 핵심군 2 사이여서 `relationshipStructure=1`; 식사·친밀감·아이·돈·결혼 문제에서 반복되는 엇갈림은 혼합 수준의 `mentalStress=2`; 장기 연애와 공동생활 자체가 핵심이므로 `romance=4`; 갈등과 공동생활 유지가 함께 있어 `emotionalWarmth=2`이다.
- Unknown limitation: `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `comedy`, `darkness`는 공식 작품 페이지가 권별 범위를 나누지 않고, 원판 1~3권 내용은 정식 유통사의 보조 요약이어서 값의 빈도와 강도를 더 확정할 수 없다.
- Art closure: [코아믹스 작품 페이지의 1화 후보](https://catalog.coamix.co.jp/kuuneru/), 현재 공식 페이지와 2021년 신장판은 frozen 2012년 원판과 판본 관계가 미확정, readable pages `not-counted`, scene contexts `not-counted`, SHA-256 `not-generated`. 내부 표본과 원판 대응을 검증하지 않았다.
