# Batch 003 official-first text evidence research — chunk 01

- 대상: batch-003 동결 manifest의 1~10번 작품
- 조사일: 2026-08-23
- 평가 범위: 현재 Work 계약의 `entry_1_3_volumes`; 공식 1~3권 소개를 우선하고, 실제 확인 범위를 각 source에 명시한다.
- 산출물 경계: 이 문서는 Evidence packet이다. Factor, Genre, Theme, centrality, Art, known/unknown 상태 및 값, promotion 결과를 배정하지 않는다.
- 출처 순서: 공식 출판사·권리자 권 소개를 먼저 조사했다. 해당 페이지를 찾지 못한 경우 정식 유통 페이지를 후순위로 기록했다. 공식 수상기관 자료는 작품 내용에 관한 심사 코멘트가 있을 때만 포함했다.
- provenance 경계: 추천·수상 목록에 실렸다는 사실만으로는 Factor Evidence가 되지 않는다. 이번 문서에는 내용 코멘트가 없는 단순 등재 페이지를 source block으로 반복하지 않았다.
- 판본 경계: 원판, 재출간판, 전자 리마스터의 관계는 후속 identity·edition 검토 lead로만 기록한다.
- Rakuten 경계: 기존 Rakuten match는 상품·판본 대조 자료로만 읽었으며 국적, 작품 범위, Factor를 추론하는 데 사용하지 않았다.
- 제목 정규화: 출처가 제목 주변에 사용하는 장식용 인용 부호는 canonical title에 포함하지 않는다. `【推しの子】`의 대괄호는 출판사 표기와 canonical 데이터가 일치하는 작품명 자체이므로 유지한다.
- 인용 원칙: 출처 문구를 복사하지 않고, 확인된 사실과 관찰을 한국어로 요약했다.

## 분류 키

- `factor-evidence-primary`: 공식 출판사가 해당 권의 내용을 직접 설명한 1차 자료. 이후 annotation/review가 근거 적합성을 다시 판정한다.
- `factor-evidence-secondary-lead`: 정식 유통 소개 또는 작품을 읽은 복수 심사위원의 구체적 관찰처럼 추가 교차 검증에 쓸 수 있는 보조 자료. 그 자체로 값을 확정하지 않는다.
- `selection-provenance-only`: 후보 선정 경로만 증명한다. 내용 코멘트가 없는 등재 사실은 Factor, Genre, Theme 판단에 사용하지 않는다.
- `identity-edition-lead-only`: ISBN, 출판 주체, 판본 또는 판매 상태를 대조하기 위한 자료. 작품 특성의 근거로 사용하지 않는다.

## 조사 대상

| 순서 | workId                      | canonicalTitle             | representative ISBN | 이번 확인 범위                                     |
| ---: | --------------------------- | -------------------------- | ------------------- | -------------------------------------------------- |
|    1 | `work-0029e59a039dce3f6e74` | 【推しの子】               | `9784088916507`     | 공식 1~3권 소개와 공식 수상기관 심사 코멘트        |
|    2 | `work-048a39f42bd18cb0823e` | 大東京トイボックス         | `9784344809437`     | 정식 유통 1~3권 소개, 원판·전자 리마스터 판본 lead |
|    3 | `work-04f35b4c99514d50231d` | デトロイト・メタル・シティ | `9784592143512`     | 공식 서지, 정식 유통 1~3권 소개, 공식 심사 코멘트  |
|    4 | `work-064c0062e7a8e29cfbed` | COSMOS                     | `9784091577849`     | 공식 1~3권 소개                                    |
|    5 | `work-07faf4019b12de5e877d` | 私の少年                   | `9784575848106`     | 원출판사 공식 1~3권 소개                           |
|    6 | `work-131ba7a362fa9e38a10a` | 超巡！超条先輩             | `9784088841083`     | 공식 1~3권 소개                                    |
|    7 | `work-171b262b7ad72871f795` | ドリフターズ               | `9784785934071`     | 공식 1~3권 소개와 공식 수상기관 심사 코멘트        |
|    8 | `work-174e7603bb0e71bb62ab` | からかい上手の高木さん     | `9784091250155`     | 공식 1~3권 소개                                    |
|    9 | `work-197089286d30de82f9e9` | 多聞くん今どっち!?         | `9784592224266`     | 공식 1~3권 소개                                    |
|   10 | `work-1d447cc9026b530fb53d` | だがしかし                 | `9784091251251`     | 공식 1~3권 소개                                    |

## workId: `work-0029e59a039dce3f6e74` — 【推しの子】

### Source 1

- sourceName: 集英社 【推しの子】 1권 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-891650-7
- publishedAt: 2020-07-17 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 지방의 산부인과 의사 ゴロー가 자신이 응원하던 아이돌 アイ와 만나고, 그 만남을 계기로 연예계와 연결된 비현실적 사건에 들어간다는 도입부를 지원한다.
- observation: 공식 소개는 의료인의 일상, 팬과 아이돌의 관계, 연예계라는 배경이 한 사건을 통해 연결되는 시작점을 직접 제시한다.
- limitation: 1권 소개는 핵심 전제를 숨기며 압축하므로 이후의 전환, 관계 지속성, 정서 강도 또는 시각 특성을 판정할 수 없다.

### Source 2

- sourceName: 集英社 【推しの子】 2권 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-891717-7
- publishedAt: 2020-10-16 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 쌍둥이가 アイ의 자녀로 다시 태어난 설정, アイ가 스토커에게 살해되는 사건, アクア의 복수 목표와 ルビー의 아이돌 목표, 두 사람이 연예계에 관여하기 시작한다는 사실을 지원한다.
- observation: 2권 공식 소개는 가족 상실 뒤 두 인물이 서로 다른 목표를 세우고 동일한 업계에 진입하는 구조를 보여 준다.
- limitation: 살인과 복수라는 사건이 초반 전체에서 차지하는 비중이나 이후 장기 연재의 성격은 이 소개만으로 확정할 수 없다.

### Source 3

- sourceName: 集英社 【推しの子】 3권 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-891801-3
- publishedAt: 2021-02-19 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 예능계 고등학교 진학, ルビー의 아이돌 활동 준비, アクア의 연애 리얼리티 쇼 참여, 또래 연예인들과 업계의 현실을 마주하는 전개를 지원한다.
- observation: 3권에서 두 주인공의 활동 영역이 학교와 실제 프로그램 제작 현장으로 넓어지며, 업계의 여러 직무와 동료 관계가 초반 전개의 일부가 된다.
- limitation: 상품 소개의 업계 비판 표현을 개별 Axis 값이나 작품 전체의 중심 Theme로 곧바로 환산할 수 없다.

### Source 4

- sourceName: マンガ大賞 2021 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2021/comment2021.pdf
- publishedAt: 2021 (수상 주기; PDF 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 심사 당시 출간된 초반부; 여러 코멘트가 1~2권의 전제와 전환을 언급
- supportedClaims: 복수 심사위원이 환생, 복수·서스펜스, 연예계 소재가 연속해서 결합되고, 진지한 사건과 코믹한 장면이 병치되며, 전개 성격이 빠르게 바뀐다고 관찰했다는 사실을 지원한다.
- observation: 서로 다른 심사위원의 반복 관찰은 공식 1~3권 소개에서 보이는 장르적 전환과 업계 진입 구조를 교차 확인할 보조 lead가 된다.
- limitation: 심사 코멘트는 주관적이고 합의된 단일 평가가 아니며, 각 필자의 정확한 독서 범위가 같지 않다. 이 자료만으로 값이나 centrality를 확정하지 않는다.

## workId: `work-048a39f42bd18cb0823e` — 大東京トイボックス

### Source 1

- sourceName: 幻冬舎コミックス 현재 작품 검색
- sourceUrl: https://www.gentosha-comics.net/search/?search_title=%E5%A4%A7%E6%9D%B1%E4%BA%AC%E3%83%88%E3%82%A4%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9
- publishedAt: undated
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-catalog-search
- provenanceFactorClassification: identity-edition-lead-only
- evaluatedRange: 현재 공식 카탈로그에서 작품명 검색
- supportedClaims: 현재 幻冬舎コミックス 검색 화면에서는 이 제목에 대응하는 판매 상품을 확인하지 못했다는 조사 상태만 지원한다.
- observation: frozen representative ISBN이 가리키는 원판 출판사와 현재 공식 웹 카탈로그 사이에 가용성 공백이 있다.
- limitation: 검색 결과 부재는 절판, 권리 이동, 작품 정체성 또는 내용에 대한 결론이 아니다. Factor Evidence로 사용할 수 없다.

### Source 2

- sourceName: コミックシーモア 大東京トイボックス 원판 1~3권 유통 페이지
- sourceUrl: https://www.cmoa.jp/title/49274/
- publishedAt: undated (페이지; 1권 표시 발행월 2007-03)
- retrievedAt: 2026-08-23
- authorityClass: licensed-distributor-volume-list
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 원판 1~3권 소개; 1권 ISBN `9784344809437`
- supportedClaims: 게임 제작자를 지망하는 モモ가 スタジオG3의 기획 견습으로 들어가고, 2권에서 자금·공동개발·예산·납기와 재미 사이의 문제가 다뤄지며, 3권에서 차세대 프로젝트와 다른 개발팀의 협업이 시작된다는 사실을 지원한다.
- observation: 정식 유통 소개는 초반 3권이 게임 제작 현장의 입문, 팀 관계, 제작 이상과 사업 조건의 충돌, 새 프로젝트의 순서로 진행된다고 요약한다.
- limitation: 출판사 자체 페이지가 아니라 정식 유통사의 요약이며 현재 판매가 종료됐다. 소개 문구의 공급 주체와 각 권의 정확한 수록 범위를 추가 확인해야 하며, 값 확정에는 직접 사용하지 않는다.

### Source 3

- sourceName: コミックシーモア 大東京トイボックス 전자 리마스터판 페이지
- sourceUrl: https://www.cmoa.jp/title/190848/
- publishedAt: undated
- retrievedAt: 2026-08-23
- authorityClass: licensed-distributor-edition-page
- provenanceFactorClassification: identity-edition-lead-only
- evaluatedRange: 전자 리마스터판의 판본 설명
- supportedClaims: 현재 전자판은 원고 데이터를 바탕으로 전자책용으로 다시 제작됐고 추가 원고 페이지가 포함된 별도 판본이라는 설명을 지원한다.
- observation: 원판의 물리 ISBN과 현재 Studio G3·ナンバーナイン 계열 전자 리마스터는 내용 계보는 연결되지만 동일 상품 판본으로 취급할 수 없다.
- limitation: 판본 설명만으로 Work 병합·분리나 representative ISBN 변경을 결정하지 않는다. Factor Evidence도 아니다.

### Source 4

- sourceName: マンガ大賞 2012 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2012/mantai_comment2012.pdf
- publishedAt: 2012 (수상 주기; PDF 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 심사 당시 연재분; 다수 코멘트가 7권을 명시하므로 현재 entry 범위보다 넓음
- supportedClaims: 복수 심사위원이 게임 제작 직장, 창작자의 이상과 사업 현실, 조직·윤리·계약 문제, 제작에 대한 집념을 반복해서 관찰했다는 사실을 지원한다.
- observation: 공식 심사 코멘트는 정식 유통 1~3권 소개에 나온 제작 현장과 사업 조건이 이후에도 중요한 갈등으로 다뤄지는지 재검토할 보조 lead를 제공한다.
- limitation: 대다수 코멘트의 독서 범위가 7권 전후여서 초반 1~3권 값의 직접 근거가 아니다. 주관적 심사평을 자동 합의나 장기 지속성의 확정으로 취급하지 않는다.

## workId: `work-04f35b4c99514d50231d` — デトロイト・メタル・シティ

### Source 1

- sourceName: 白泉社 영애니멀계 주문서 PDF
- sourceUrl: https://www.hakusensha.co.jp/book-store/order/pdf/young.pdf
- publishedAt: 2026-08-01 (PDF 기준일)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-order-list
- provenanceFactorClassification: identity-edition-lead-only
- evaluatedRange: 1~3권 서지 행
- supportedClaims: 白泉社 목록에 1~3권의 서지 코드가 연속으로 남아 있고, 이를 통해 원판 ISBN `9784592143512`, `9784592143529`, `9784592143536`을 대조할 수 있다는 사실을 지원한다.
- observation: frozen representative ISBN은 원출판사 주문 목록의 1권 일반판과 일치한다.
- limitation: 주문서는 줄거리나 작품 특성을 설명하지 않는다. 재고 상태와 현재 전자 유통 권리 관계도 이 자료만으로 결정할 수 없다.

### Source 2

- sourceName: コミックシーモア デトロイト・メタル・シティ 1~3권 유통 페이지
- sourceUrl: https://www.cmoa.jp/title/312348/
- publishedAt: 2024-12-27 (표시된 배포 시작일; 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: licensed-distributor-volume-list
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 1~3권 소개; 현재 유통 메타데이터와 원판 ISBN 대조
- supportedClaims: 1권에서 대중적 데스메탈 밴드의 프런트맨과 세련된 팝을 지향하는 소심한 본래 인격의 간극이 설정되고, 2권에서 무대 인격의 영향력과 기타를 둘러싼 충돌이 확대되며, 3권에서 대형 메탈 축제의 밴드 경쟁으로 무대가 넓어진다는 사실을 지원한다.
- observation: 유통 소개는 초반 3권이 이중적 공적 인격, 음악 활동, 팬과 경쟁 밴드가 만드는 반복 갈등을 중심으로 진행된다고 요약한다.
- limitation: 현재 페이지의 출판사 필드는 プロテカ로 표시되지만 대표 ISBN은 白泉社 원판과 같고, 과거 상품과 내용이 같다는 안내가 붙는다. 권리·판본 계보 확인이 필요하며 정식 유통 요약만으로 값을 확정하지 않는다.

### Source 3

- sourceName: マンガ大賞 2008 심사위원 코멘트 아카이브
- sourceUrl: https://www.mangataisho.com/archives/2008/02/049.html
- publishedAt: 2008 (제1회 심사 주기; 페이지의 정확한 게시일은 미확인)
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 심사 당시 초반 연재분; 여러 코멘트가 1권의 첫인상을 명시
- supportedClaims: 복수 심사위원이 과장된 음악 패러디, 무대 인격과 본래 인격의 간극, 팬 반응, 반복되는 곤경과 저속·성적 농담을 구체적으로 관찰했다는 사실을 지원한다.
- observation: 심사 코멘트는 유통 소개의 이중 인격·음악 활동 구조를 교차 확인하며, 민감한 유머가 있다는 safety 재검토 lead도 제공한다.
- limitation: 심사평은 주관적이고 코미디의 체감과 반복성에 대한 평가가 갈린다. 성인 전용 분류를 의미하지 않으며, safety나 값을 이 자료 하나로 판정하지 않는다.

## workId: `work-064c0062e7a8e29cfbed` — COSMOS

### Source 1

- sourceName: 小学館eコミックストア COSMOS 1권 작품 페이지
- sourceUrl: https://e-comi.shogakukan.co.jp/books/091577840000d0000000
- publishedAt: 2023-11-17 (단행본 발매일)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 거짓말을 알아채는 고등학생 水森楓, 수수께끼의 인물 穂村燐, 사라진 친구가 외계인이라는 주장, 외계인 전문 보험회사 COSMOS의 등장을 지원한다.
- observation: 공식 소개는 일상적인 인간관계에서 시작한 실종 조사가 외계 존재와 보험 조사라는 직업적 틀로 연결되는 도입을 직접 제시한다.
- limitation: 소개는 독특한 설정과 사건만 요약하며, 각 요소의 지속적 비중이나 정서·시각 특성은 판정할 수 없다.

### Source 2

- sourceName: 小学館eコミックストア COSMOS 2권 작품 페이지
- sourceUrl: https://e-comi.shogakukan.co.jp/books/091577980000d0000000
- publishedAt: 2024-02-19 (단행본 발매일)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 楓가 COSMOS에 들어가 선배 조사원에게 일을 배우고, 외계인 영아의 유괴와 관련된 고난도 사건에 穂村와 함께 대응한다는 사실을 지원한다.
- observation: 2권에서 초능력적 전제가 직업 훈련, 선후배 관계, 구체적 보험 사건의 반복 구조로 이어진다.
- limitation: 한 사건의 난도 표현을 작품 전체의 위험도나 진행 속도로 일반화할 수 없다.

### Source 3

- sourceName: 小学館eコミックストア COSMOS 3권 작품 페이지
- sourceUrl: https://e-comi.shogakukan.co.jp/books/091578230000d0000000
- publishedAt: 2024-05-17 (단행본 발매일)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 연수 종료 뒤 조사원으로 활동하는 楓, 조사원 テツ・ソプラノ, 보험금을 둘러싼 절도 조사, 사건 이면의 사정이 드러나는 전개를 지원한다.
- observation: 초반 3권에서 입사 전제는 정식 조사 업무로 전환되고, 표면적 범죄와 당사자의 사정을 함께 조사하는 사례가 나타난다.
- limitation: 사건 당사자의 사정을 다룬다는 사실만으로 작품 전체의 공감 방향이나 Theme centrality를 확정하지 않는다.

## workId: `work-07faf4019b12de5e877d` — 私の少年

### Source 1

- sourceName: 双葉社 私の少年 1권 상품 페이지
- sourceUrl: https://www.futabasha.co.jp/book/97845758481060000000?type=1
- publishedAt: 2016-06-11 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 원판 1권
- supportedClaims: 스포츠 회사에 다니는 30세 多和田聡子가 밤의 공원에서 12세 早見真修를 만나고, 각각 연인과 가족 관계에서 겪은 고립을 계기로 서로를 필요로 하기 시작한다는 사실을 지원한다.
- observation: 공식 소개는 성인과 아동의 만남, 양쪽의 고립, 관계 감정의 모호함을 도입부의 핵심으로 직접 제시한다.
- limitation: 민감한 연령 차이를 포함한 관계이므로 소개의 홍보적 질문만으로 관계 성격이나 safety를 단정하지 않는다. 시각 특성도 확인할 수 없다.

### Source 2

- sourceName: 双葉社 私の少年 2권 상품 페이지
- sourceUrl: https://www.futabasha.co.jp/book/97845758489530000000?type=1
- publishedAt: 2016-12-12 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 원판 2권
- supportedClaims: 聡子와 真修가 함께 보내는 시간을 특별하게 느끼는 가운데 사건이 발생하고, 聡子가 真修의 가정 문제를 엿보게 된다는 사실을 지원한다.
- observation: 2권 공식 소개는 두 사람의 관계가 단순한 우연한 만남을 넘어서고, 아동의 가족 환경이 갈등의 일부로 드러나는 전개를 보여 준다.
- limitation: 사건의 구체적 내용과 관계에 미친 장기 영향은 요약돼 있다. 관계의 윤리적·정서적 평가나 safety 결론에는 추가 맥락이 필요하다.

### Source 3

- sourceName: 双葉社 私の少年 3권 상품 페이지
- sourceUrl: https://www.futabasha.co.jp/book/97845758500170000000?type=1
- publishedAt: 2017-07-12 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 원판 3권
- supportedClaims: 聡子가 真修와 거리를 두려다가 자신의 감정을 인식하고, 함께하는 시간을 지키기 위해 그의 가족과 대면하는 전개를 지원한다.
- observation: 초반 3권에서 개인적 고립을 공유한 만남이 가족 구조와 경계 문제를 직접 다루는 관계 갈등으로 확대된다.
- limitation: 공식 소개만으로 작품이 이 관계를 비판·긍정·양가적으로 다루는 정확한 방식이나 이후 변화는 판정할 수 없다. safety 독립 검수 대상이지 자동 차단 근거가 아니다.

## workId: `work-131ba7a362fa9e38a10a` — 超巡！超条先輩

### Source 1

- sourceName: 集英社 超巡！超条先輩 1권 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884108-3
- publishedAt: 2024-06-04 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 독심·투시·염동 등 여러 초능력을 가진 특수 수사관 超条巡이 지역 파출소에 배치되고, 능력과 별개로 문제 행동이 많은 경찰이라는 기본 전제를 지원한다.
- observation: 공식 소개는 강한 수사 능력과 일상적 조직 부적응의 대비를 경찰 코미디 도입으로 제시한다.
- limitation: 홍보 문구의 코미디 표방만으로 웃음의 빈도, 사건의 무게, 능력 사용의 시각적 강도를 판정하지 않는다.

### Source 2

- sourceName: 集英社 超巡！超条先輩 2권 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884172-4
- publishedAt: 2024-09-04 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: ポン가 犬養와 함께 千尋의 단서를 쫓고, 지역 벚꽃 축제에서 주변 인물과 사건이 얽히며 소동이 커지는 전개를 지원한다.
- observation: 2권에서도 경찰 업무와 지역 행사·인물 관계가 결합되며, 수사 목표가 소동의 구조 안에서 진행된다.
- limitation: 소개가 사건의 결말과 세부 비중을 생략하므로 수사와 코미디 중 어느 쪽이 지속적으로 우세한지 확정할 수 없다.

### Source 3

- sourceName: 集英社 超巡！超条先輩 3권 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884255-4
- publishedAt: 2024-11-01 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 지역 어린이들과의 놀이, 과거 전설적 야쿠자였으나 현재는 지역 인기인이 된 獅子原, 巡의 지역 내 지위를 둘러싼 경쟁이 포함된다는 사실을 지원한다.
- observation: 초반 3권에서 초능력 수사뿐 아니라 지역 공동체의 평판과 반복 인물 관계가 전개의 축으로 확장된다.
- limitation: 야쿠자 경력은 인물 배경 정보이며 성인 전용 분류를 뜻하지 않는다. 사건 요약만으로 폭력 강도나 장기 관계 변화를 판정하지 않는다.

## workId: `work-171b262b7ad72871f795` — ドリフターズ

### Source 1

- sourceName: 少年画報社 ドリフターズ 1권 상품 페이지
- sourceUrl: https://www.shonengahosha.co.jp/book_Info.php?id=6358
- publishedAt: 2010-07-07 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 1600년 세키가하라 전투에서 퇴각전을 치르던 島津豊久가 중상을 입은 뒤 수수께끼의 문을 지나 다른 세계의 새 전쟁에 들어간다는 도입을 지원한다.
- observation: 공식 소개는 실제 역사 전투에서 이세계 전쟁으로 이어지는 전환과, 전투 중인 무사의 관점이 시작점임을 직접 제시한다.
- limitation: 전쟁과 부상 사건은 확인되지만 폭력 묘사의 시각적 수위, 전투 비중, 이후 세계관의 지속적 성격은 소개만으로 판정할 수 없다.

### Source 2

- sourceName: 少年画報社 ドリフターズ 2권 상품 페이지
- sourceUrl: https://www.shonengahosha.co.jp/book_Info.php?id=6837
- publishedAt: 2011-10-13 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 豊久가 전장에서 낯선 세계로 옮겨지고, 여러 역사적 인물과 세력이 얽힌 전쟁에 참여하는 구조가 이어진다는 사실을 지원한다.
- observation: 2권 소개는 이세계 전제가 일회성 사건이 아니라 역사 인물들이 충돌하는 전쟁 구조로 계속됨을 확인한다.
- limitation: 공식 소개가 매우 짧아 세력 관계, 전투 외 장면, 정서 리듬 또는 작품의 전체 지속성을 세밀하게 판단할 수 없다.

### Source 3

- sourceName: 少年画報社 ドリフターズ 3권 상품 페이지
- sourceUrl: https://www.shonengahosha.co.jp/book_Info.php?id=7119
- publishedAt: 2013-03-18 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 豊久가 織田信長와 那須与一를 만나고, 역사 인물 집단이 영토 확보를 위한 행동에 나서며 다른 세력과 충돌한다는 사실을 지원한다.
- observation: 초반 3권에서 단독 이동은 역사 인물 팀과 세력 간 군사 행동으로 확대된다.
- limitation: 인물의 실제 역사적 배경과 작품 안 재해석을 구분해야 하며, 상품 소개만으로 전투 장면의 표현 방식이나 극단값을 판단하지 않는다.

### Source 4

- sourceName: マンガ大賞 2012 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2012/mantai_comment2012.pdf
- publishedAt: 2012 (수상 주기; PDF 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 심사 당시 1~2권 중심의 초반부
- supportedClaims: 복수 심사위원이 역사 인물과 이세계 종족의 결합, 전쟁·모험의 추진력, 빠른 사건 전개, 긴장 속 농담을 반복해서 관찰했다는 사실을 지원한다.
- observation: 심사 코멘트는 공식 권 소개의 역사 인물 집결과 전쟁 확대를 교차 확인할 후속 검토 lead를 제공한다.
- limitation: 일부 심사위원의 작화·움직임 체감은 텍스트 소감일 뿐 실제 픽셀 판독이나 허용된 Art evidence가 아니다. 코멘트 간 강조점도 달라 값을 확정하지 않는다.

## workId: `work-174e7603bb0e71bb62ab` — からかい上手の高木さん

### Source 1

- sourceName: 小学館eコミックストア からかい上手の高木さん 1권 작품 페이지
- sourceUrl: https://e-comi.shogakukan.co.jp/books/091250150000d0000000
- publishedAt: 2014-06-12 (단행본 발매일)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 중학생 西片가 옆자리 高木さん에게 반복해서 놀림을 받고, 상대를 부끄럽게 만들어 되갚으려 한다는 기본 관계와 에피소드 구조를 지원한다.
- observation: 공식 소개는 같은 두 인물 사이의 놀림, 당황, 역전 시도가 반복되는 일상적 관계를 도입부의 중심으로 제시한다.
- limitation: 소개의 반복 구조만으로 감정의 방향, 웃음의 빈도, 관계 변화의 속도 또는 장기 지속성을 확정하지 않는다.

### Source 2

- sourceName: 小学館eコミックストア からかい上手の高木さん 2권 작품 페이지
- sourceUrl: https://e-comi.shogakukan.co.jp/books/091255270000d0000000
- publishedAt: 2014-11-12 (단행본 발매일)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 西片가 高木さん을 부끄럽게 만들려 하지만 오히려 자신이 당황하는 상호작용이 2권에서도 이어진다는 사실을 지원한다.
- observation: 1권의 두 인물 중심 반복 틀이 2권에서도 유지되는지 공식 소개로 확인할 수 있다.
- limitation: 소개가 매우 짧아 개별 에피소드 변주, 주변 인물의 비중 또는 관계의 진전을 자세히 판단할 수 없다.

### Source 3

- sourceName: 小学館eコミックストア からかい上手の高木さん 3권 작품 페이지
- sourceUrl: https://e-comi.shogakukan.co.jp/books/091266500000d0000000
- publishedAt: 2015-12-11 (단행본 발매일)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 놀림 관계가 계속되고, 공식 소개가 西片의 당황과 두 사람 사이의 연애적 긴장을 이전보다 분명히 언급한다는 사실을 지원한다.
- observation: 초반 3권에서 반복 장난의 틀은 유지되며 관계 감정에 관한 출판사 설명이 추가된다.
- limitation: 홍보 문구가 강조한 연애적 분위기의 실제 장면 비중과 centrality는 독립 검수가 필요하다. 표지나 제목만으로 Art를 판단하지 않는다.

## workId: `work-197089286d30de82f9e9` — 多聞くん今どっち!?

### Source 1

- sourceName: 白泉社 多聞くん今どっち！？ 1권 상품 페이지
- sourceUrl: https://www.hakusensha.co.jp/comicslist/62381/
- publishedAt: 2022-02-18 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 고등학생 팬 木下うたげ가 아이돌 福原多聞의 집에서 가사도우미로 일하게 되고, 무대 위 모습과 낮은 자존감의 사적 모습 사이의 큰 차이를 알게 되며 그를 지지하는 관계가 시작된다는 사실을 지원한다.
- observation: 공식 소개는 팬과 아이돌의 만남, 노동 관계, 공적·사적 인격의 간극을 한 도입 안에 제시한다.
- limitation: 팬의 지지와 연애 감정이 실제로 어떻게 구분·변화하는지, 인격 간극이 얼마나 지속되는지는 1권 소개만으로 확정할 수 없다.

### Source 2

- sourceName: 白泉社 多聞くん今どっち！？ 2권 상품 페이지
- sourceUrl: https://www.hakusensha.co.jp/comicslist/63106/
- publishedAt: 2022-05-20 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 아이돌 그룹 F/ACE의 신곡 센터를 정하는 다섯 종목의 경쟁, うたげ의 응원, 멤버 甲斐倫太郎와의 경쟁 관계가 전개에 포함된다는 사실을 지원한다.
- observation: 2권에서 가정 내 이중 모습이라는 도입이 그룹 활동, 멤버 경쟁, 팬의 지원으로 범위를 넓힌다.
- limitation: 경쟁 종목의 사건 요약을 전체 진행 속도나 멤버 관계의 지속적 적대감으로 일반화할 수 없다.

### Source 3

- sourceName: 白泉社 多聞くん今どっち！？ 3권 상품 페이지
- sourceUrl: https://www.hakusensha.co.jp/comicslist/64511/
- publishedAt: 2022-10-20 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 多聞과 甲斐의 경쟁, うたげ가 다른 멤버를 응원했을 때의 반응, 센터 경쟁의 결말과 다음 활동으로의 전환을 지원한다.
- observation: 초반 3권에서 팬·가사도우미 관계와 그룹 내부 경쟁이 서로 영향을 주며, 주인공의 공적 활동과 사적 감정이 함께 전개된다.
- limitation: 출판사 표기의 전각 문장부호와 canonical title의 ASCII 문장부호 차이는 표기 정규화 lead일 뿐 별도 Work 근거가 아니다. 감정의 강도나 관계 구조 값은 이 소개만으로 결정하지 않는다.

## workId: `work-1d447cc9026b530fb53d` — だがしかし

### Source 1

- sourceName: 小学館eコミックストア だがしかし 1권 작품 페이지
- sourceUrl: https://e-comi.shogakukan.co.jp/books/091251250000d0000000
- publishedAt: 2014-09-18 (단행본 발매일)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 시골 마을 과자가게의 아들 鹿田ココノツ가 도시에서 온 과자 애호가 枝垂ほたる를 만나고, 과자에 관한 대화와 도전이 여름 동안 이어지는 도입을 지원한다.
- observation: 공식 소개는 가업인 과자가게, 과자 지식, 두 인물의 반복 상호작용을 초반 에피소드의 공통 틀로 제시한다.
- limitation: 과자 소재와 홍보 문구의 코미디 표방만으로 웃음의 빈도, 관계 감정 또는 생활 리듬 값을 자동 추론하지 않는다.

### Source 2

- sourceName: 小学館eコミックストア だがしかし 2권 작품 페이지
- sourceUrl: https://e-comi.shogakukan.co.jp/books/091253990000d0000000
- publishedAt: 2015-03-18 (단행본 발매일)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 여러 실제 과자를 매개로 한 질문, 대결, 지식 설명과 ココノツ의 반응이 반복되고 여름의 만남이 계속된다는 사실을 지원한다.
- observation: 2권에서도 특정 과자 하나를 중심으로 인물 간 대화와 작은 사건이 구성되는 반복 형식이 유지된다.
- limitation: 상품 소개가 나열한 소재만으로 각 에피소드의 감정적 비중, 정보량, 관계 변화 속도를 판정할 수 없다.

### Source 3

- sourceName: 小学館eコミックストア だがしかし 3권 작품 페이지
- sourceUrl: https://e-comi.shogakukan.co.jp/books/091262100000d0000000
- publishedAt: 2015-10-16 (단행본 발매일)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 새로운 과자와 놀이가 계속 등장하고, 여름 축제를 계기로 ココノツ, ほたる, 遠藤サヤ 사이 관계에 변화가 생긴다는 사실을 지원한다.
- observation: 초반 3권의 과자 중심 반복 구조 안에서도 지역 행사와 세 인물 관계가 전개에 들어온다.
- limitation: 한 권의 관계 변화 언급만으로 연애나 관계 Theme의 centrality를 확정하지 않는다. 공식 내부 페이지 표본이 아니므로 Art evidence도 아니다.

## Identity, safety, edition research leads

- 동결 데이터의 10개 작품 모두 `safety-approved`, 일반판 representative ISBN, Rakuten exact match로 기록돼 있음을 읽었다. 이 문서는 그 결정을 재심하거나 국적을 다시 판정하지 않는다.
- 大東京トイボックス는 frozen ISBN이 幻冬舎コミックス 원판 1권을 가리키지만, 현재 확인 가능한 전자 리마스터판은 Studio G3·ナンバーナイン 표기와 추가 원고를 가진다. Work 동일성은 유지하더라도 representative edition과 evidence 범위를 분리해서 검수해야 한다.
- デトロイト・メタル・シティ는 白泉社 원판 주문 목록과 현재 プロテカ 표기의 정식 유통 페이지가 같은 1권 ISBN을 연결한다. 권리·판본 계보와 현재 판매 상태를 별도 확인할 필요가 있다.
- 私の少年의 1~3권 근거는 frozen representative ISBN과 같은 双葉社 원판으로 통일했다. 성인과 아동의 연령 차이, 가족 문제는 safety 맥락 lead지만 성인 전용 여부의 자동 결론이 아니다.
- 【推しの子】의 스토커 살인, ドリフターズ의 전쟁 폭력, デトロイト・メタル・シティ의 저속·성적 농담은 공식·공식 심사 자료가 드러낸 민감 내용 lead다. 폭력적이거나 어두운 소재 자체를 성인 전용 분류로 간주하지 않는다.
- からかい上手の高木さん은 original standard series 1~3권만 조사했다. 풀컬러판 및 관련 스핀오프와 섞지 않았다.
- 多聞くん今どっち!?의 ASCII 문장부호와 白泉社 페이지의 전각 문장부호는 표기 차이다. 다른 저자·ISBN·작품을 가리킨다는 충돌 증거는 발견하지 못했다.

## Unresolved research gaps

- 大東京トイボックス는 현재 幻冬舎コミックス의 개별 1~3권 공식 소개를 찾지 못했다. 정식 유통 요약은 annotation 전 출판사·권리자 자료 또는 원판 권말 서지와 추가 교차 검증하는 편이 안전하다.
- デトロイト・メタル・シティ의 현재 プロテカ 유통판과 白泉社 원판 사이 권리·판본 관계는 별도 identity 검수 항목으로 남는다.
- 이번 chunk에는 판독 기준을 충족한 공식 내부 미리보기 페이지 묶음이 없다. 따라서 어떤 작품에도 Art 판단 근거를 제공하지 않는다.
- 공식 1~3권 소개가 짧은 작품은 장기 지속성, 사건 비중, 관계 centrality 또는 극단값을 지원하지 않는다. 후속 annotation에서 필요한 항목은 unknown으로 종결하거나 추가 근거를 조사해야 한다.
- 내용 코멘트가 없는 수상·추천 등재 사실은 기존 selection provenance에만 남기고 Factor Evidence로 승격하지 않는다.
