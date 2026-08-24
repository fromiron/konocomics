# Batch 004 official-first text evidence research — chunk 02

- 대상: batch-004 동결 manifest의 11~20번 작품
- 조사일: 2026-08-25
- 평가 범위: 현재 Work 계약의 `entry_1_3_volumes`. 단권 완결작과 3권 미만 작품은 실제 확인 가능한 범위를 명시하고, 확인하지 못한 권으로 범위를 넓히지 않는다.
- 산출물 경계: 이 문서는 텍스트 Evidence packet이다. Factor, Genre, Theme, centrality, Art, known/unknown 상태 및 값, promotion, safety 판정을 배정하지 않는다. 아래 `supportedClaims`는 후속 annotation에서 검토할 수 있는 구체적 관찰 후보일 뿐이다.
- 출처 순서: 공식 출판사·권리자의 권별 상품/시리즈 소개를 먼저 조사했다. 공식 소개가 짧거나 판본 정보가 필요한 경우 공식 편집 기사·심사 코멘트, 정식 유통사·서점 자료를 후순위로 기록했다.
- provenance 경계: 수상·추천 목록 등재만으로는 Factor Evidence가 되지 않는다. 내용 관찰이 없는 수상/추천 페이지는 `selection-provenance-only`로만 남기거나 생략했다.
- 판본 경계: 전자판·재출간판·단행본의 날짜와 ISBN이 다르면 identity/edition 검토 lead로만 기록한다. representative ISBN은 `data/source/volumes.csv`의 frozen work와 대조하되, 그 파일을 내용 근거로 사용하지 않는다.
- 제목 정규화: canonical title에는 출처의 장식용 인용 부호를 넣지 않는다.
- 인용 원칙: 출처 문구를 장문으로 복사하지 않고, 확인된 사실과 관찰을 한국어로 요약했다.
- Art 경계: 공식 미리보기의 판본·페이지 참조·표본 수·장면 맥락·SHA-256을 갖춘 별도 표본은 이번 텍스트 조사에서 만들지 않았다. 따라서 어떤 source도 Art 판단 근거로 제공하지 않는다.
- retrievedAt: 모든 source는 실제 확인일인 `2026-08-25`로 고정했다.

## 분류 키

- `factor-evidence-primary`: 공식 출판사 또는 권리자가 해당 권이나 작품 초반의 내용을 직접 설명한 1차 자료. 이후 annotation/review가 근거 적합성을 다시 판정한다.
- `factor-evidence-secondary-lead`: 공식 편집 기사, 정식 유통 소개 또는 작품을 읽은 심사위원의 구체적 관찰처럼 추가 교차 검증에 쓸 수 있는 보조 자료. 그 자체로 값을 확정하지 않는다.
- `selection-provenance-only`: 후보 선정 경로만 증명한다. 내용 코멘트가 없는 등재 사실은 Factor, Genre, Theme 판단에 사용하지 않는다.
- `identity-edition-lead-only`: ISBN, 출판 주체, 판본 또는 판매 상태를 대조하기 위한 자료. 작품 특성의 근거로 사용하지 않는다.

## 조사 대상

| 순서 | workId                      | canonicalTitle       | representative ISBN | 이번 확인 범위                                               |
| ---: | --------------------------- | -------------------- | ------------------- | ------------------------------------------------------------ |
|   11 | `work-23077ad33a2066bef5a6` | Sunny                | `9784091885579`     | 공식 1~3권 소개와 공식 수상기관 심사 코멘트                  |
|   12 | `work-2356050c72240569e1c5` | すみれファンファーレ | `9784091885791`     | 공식 1~3권 소개와 공식 수상기관 심사 코멘트                  |
|   13 | `work-2c4fe00df5255fc082f9` | ヒーローカンパニー   | `9784864683043`     | 공식 권리자 시리즈/에피소드 소개와 공식 수상기관 심사 코멘트 |
|   14 | `work-2d385ad0525742330e70` | ねずみの初恋         | `9784065344231`     | 공식 1~3권 상품 소개                                         |
|   15 | `work-2df743e085adef5e9bd3` | キルアオ             | `9784088836867`     | 공식 1~3권 상품 소개와 공식 시리즈 페이지                    |
|   16 | `work-2f1d1c3ad0f943f1562f` | 尾守つみきと奇日常。 | `9784098531820`     | 공식 1~3권 상품/전자책 소개                                  |
|   17 | `work-3713ab561de583d709bc` | アリスと蔵六         | `9784199503375`     | 공식 권리자 시리즈 서지와 3권 소개                           |
|   18 | `work-39c1a2b6791238827ed5` | とろける鉄工所       | `9784063522471`     | 공식 1~3권 소개와 공식 수상기관 심사 코멘트                  |
|   19 | `work-3ad85a2ffdc026007d61` | 新しい上司はど天然   | `9784253142311`     | 공식 1권 소개 및 작품 권수 확인                              |
|   20 | `work-44d0000353478596369e` | 環と周               | `9784088448398`     | 공식 단권 상품/편집 기사와 공식 수상기관 심사 코멘트         |

## workId: `work-23077ad33a2066bef5a6` — Sunny

### Source 1

- sourceName: 小学館eコミックストア Sunny 1권
- sourceUrl: https://e-comi.shogakukan.co.jp/books/091885570000d0000000
- publishedAt: 2011-08-30 (representative paper edition release; the current e-comic catalog page itself does not expose a paper release date)
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 별과 아이 학원에 부모와 떨어져 사는 여러 배경의 아이들이 모여 있고, 고장 난 Sunny가 놀이방 겸 교실 한쪽에 놓여 있다는 작품 도입을 지원한다.
- observation: 부모와 떨어진 아이들의 공동 생활 공간과 이동 수단이 아닌 낡은 자동차가 초반 배경으로 함께 제시된다.
- limitation: 상품 소개는 설정 중심의 압축된 문구이며, 학원 생활의 반복 양상이나 관계 변화 전체를 보여주지 않는다. e-comic 페이지와 representative paper ISBN의 연결은 별도 edition 확인이 필요하다.

### Source 2

- sourceName: 小学館コミック Sunny 2권
- sourceUrl: https://shogakukan-comic.jp/book?isbn=9784091885760
- publishedAt: 2012-02-29
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 별과 아이 학원 아이들이 자기 감정과 욕구를 주장하고, 친구를 알아가며, 새로 온 아이에게 각자가 자신의 과거를 겹쳐 보는 사건들을 지원한다.
- observation: 여자아이들의 걱정과 거짓말, 친구를 알아보는 과정, 새 입소자에 대한 투사가 2권 소개에 구체적으로 언급된다.
- limitation: 출판사 소개가 대표 에피소드만 요약하므로 각각의 사건 비중과 장기적 반복을 확정할 수 없다.

### Source 3

- sourceName: 小学館コミック Sunny 3권
- sourceUrl: https://shogakukan-comic.jp/book?isbn=9784091886132
- publishedAt: 2013-01-30
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 아이들이 Sunny 주변에 모이고, 학원 안팎의 어른 세계와 과거를 마주한다는 설명을 지원한다. 인기 많은 아이의 보이지 않는 산, 가정에서 온 아이와 시설에서 온 아이의 차이, 방송 제작진의 방문, 아이의 어머니 방문이 권별 소개에 포함된다.
- observation: 일상 공간의 관계와 부모·가정에 대한 기억이 외부 방문과 이동 에피소드로 확장된다.
- limitation: 3권 소개에 언급된 여러 에피소드가 전체 권에서 차지하는 비율과 결말은 확인할 수 없다.

### Source 4

- sourceName: マンガ大賞 2013 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2013/comment2013.pdf
- publishedAt: 2013 (수상 주기; PDF 본문에는 별도 발행일 표기 없음)
- retrievedAt: 2026-08-25
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 심사 코멘트상 주로 2권의 특정 에피소드; 심사위원별 독서 범위는 균일하지 않음
- supportedClaims: 한 심사위원이 니베아 냄새로 어머니를 떠올리는 소년, 어머니를 만난 뒤의 거리감과 남은 애정, 사랑받는지 묻는 정서를 구체적으로 관찰한다.
- observation: 공식 상품 소개의 부모와 떨어진 아이 설정을 특정 모자 관계 장면으로 교차 검토할 수 있다.
- limitation: 개인 심사평의 독해이며, 작품 전체나 모든 독자의 경험을 대표하지 않는다. 이 코멘트는 심리 정서의 존재를 보여주는 lead일 뿐 수치나 상태를 배정하지 않는다.

### Identity, scope, and safety observations

- identity: frozen representative ISBN은 `9784091885579`이며, Source 1의 e-comic catalog ID와 동일 판본 관계는 별도 edition 검토 대상이다.
- scope: entry_1_3은 1~3권으로 확인했다. 시리즈 페이지에는 6권까지가 보이지만 4권 이후를 이 문서의 근거로 사용하지 않았다.
- safety: 부모와의 분리, 시설 생활, 외로움과 슬픔이 내용상 언급된다. 이는 민감도 검토를 위한 관찰이며 안전 판정이나 작품 분류가 아니다.

## workId: `work-2356050c72240569e1c5` — すみれファンファーレ

### Source 1

- sourceName: 小学館コミック すみれファンファーレ 1권
- sourceUrl: https://shogakukan-comic.jp/book?jdcn=091885790000d0000000
- publishedAt: 2015-01-26 (official electronic re-release date; representative paper edition released 2012-03-30)
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 초등학교 4학년 가와바타 스미레가 이혼한 부모 중 어머니와 살며, 도시락과 추첨 같은 행동으로 어머니와 친구가 웃기를 바란다는 도입을 지원한다.
- observation: 아이가 주변 사람의 표정과 기분을 살피고 직접 행동으로 돌보려는 상황이 공식 소개에 구체적으로 제시된다.
- limitation: 공식 페이지의 날짜는 전자 재출간일이므로 원래 인쇄본 발매일과 혼동하지 않아야 한다. 행동의 빈도와 성장 결과는 소개만으로 확정할 수 없다.

### Source 2

- sourceName: 小学館コミック すみれファンファーレ 2권
- sourceUrl: https://shogakukan-comic.jp/book?jdcn=091886030000d0000000
- publishedAt: 2015-01-26 (official electronic re-release date)
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 병원에서 옆 침대의 아이와 간호사를 만나고, 아파트 주민을 알아가며, 친구와 운동회에 참여하고, 어머니와 개기일식을 보는 경험을 지원한다.
- observation: 학교·병원·주거 공간의 만남과 가족과의 관찰 경험이 병렬적으로 소개된다.
- limitation: 여러 대표 사건의 나열이므로 각 관계의 지속성이나 정서적 강도를 일반화할 수 없다.

### Source 3

- sourceName: 小学館コミック すみれファンファーレ 3권
- sourceUrl: https://shogakukan-comic.jp/book?jdcn=091886240000d0000000
- publishedAt: 2015-01-26 (official electronic re-release date)
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 친구의 짝사랑과 발렌타인 데이의 고립, 자신의 현재 이름과 다른 가능성을 생각하며 우는 상황, 중요한 사람들의 예상 밖 모습을 알게 되는 경험을 지원한다.
- observation: 스미레가 주변 인물을 관찰하고 자신의 생각을 되짚는 에피소드가 3권 소개에 포함된다.
- limitation: 전자판 소개의 동일 날짜는 권별 원발매일을 제공하지 않는다. 3권의 원래 인쇄본 ISBN과 발매일은 이 조사에서 공식 페이지로 확인하지 못했다.

### Source 4

- sourceName: 小学館キッズ 공식 기사
- sourceUrl: https://sho.jp/manga/35007
- publishedAt: 2019-03-20
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-editorial
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 작품 개요; entry 권별 장면을 넘는 작가 경험·연재 맥락
- supportedClaims: 작가의 경험을 바탕으로 4학년 스미레가 친구와 어른을 만나며 성장하는 일상을 그린다는 설명을 지원한다.
- observation: Source 1~3에서 확인한 학교·가족·주변 어른과의 만남을 작품의 편집 맥락으로 교차 확인할 수 있다.
- limitation: 후속 기사이자 작품 전체 개요이므로 1~3권의 특정 장면 빈도나 결말을 증명하지 않는다.

### Source 5

- sourceName: マンガ大賞 2013 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2013/comment2013.pdf
- publishedAt: 2013 (수상 주기; PDF 본문에는 별도 발행일 표기 없음)
- retrievedAt: 2026-08-25
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 심사 코멘트상 1~2권 중심; 심사위원별 독서 범위는 균일하지 않음
- supportedClaims: 심사위원들이 이혼한 가정의 열 살 아이가 감정을 직접 표현하고, 어른의 실수·제약 속에서 서로를 이해해 가는 장면과 눈물·따뜻함을 관찰한다.
- observation: 공식 권 소개의 가족 구성과 주변 사람을 웃게 하려는 행동에 대한 독립적인 독해 lead다.
- limitation: 심사위원의 주관적 표현이며, 따뜻함이나 눈물 같은 해석을 작품 값으로 직접 변환하지 않는다.

### Identity, scope, and safety observations

- identity: frozen representative ISBN은 `9784091885791`이고 Source 1은 2015년 전자 재출간 페이지다. paper vol.1의 2012-03-30 발매 정보와 전자 페이지를 혼합하지 않도록 edition 확인이 필요하다.
- scope: 공식 전자 페이지로 1~3권의 소개를 확인했다. 3권의 원래 인쇄판 식별자와 발매일은 미확인으로 남긴다.
- safety: 이혼 가정, 아이의 외로움과 울음, 어른의 제약이 내용상 언급된다. 이는 민감도 관찰이며 안전성·정서 상태 판정이 아니다.

## workId: `work-2c4fe00df5255fc082f9` — ヒーローカンパニー

### Source 1

- sourceName: HERO’S Web 공식 에피소드 페이지
- sourceUrl: https://viewer.heros-web.com/episode/10834108156657187802
- publishedAt: 2020-08-07
- retrievedAt: 2026-08-25
- authorityClass: official-rightsholder-episode
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 작품 도입/시리즈 에피소드 소개; 특정 단행본 권수와 완전히 일치하지 않음
- supportedClaims: 황폐해진 세계에서 히어로가 악의적 사건과 재해로부터 사람을 지키는 직업이며, 정부·경찰과 협력하고 변신·거대 로봇·전대 구성 등의 직무가 있다는 설정을 지원한다. 주인공에게 Hero Company 입사를 권하는 도입도 확인된다.
- observation: 히어로 활동이 초능력 개인의 비공식 행동이 아니라 규칙과 직업 조직을 가진 일로 제시된다.
- limitation: 공식 페이지는 시리즈/에피소드 소개이므로 1~3권에서 이 설정이 반복되는 정도, 개별 사건의 폭력성, 장기 전개는 확인할 수 없다.

### Source 2

- sourceName: Sony Reader 정식 유통 ヒーローカンパニー 1권
- sourceUrl: https://ebookstore.sony.jp/title/00192282/
- publishedAt: 2012-12-07 (official electronic release)
- retrievedAt: 2026-08-25
- authorityClass: licensed-distributor-volume
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 1권
- supportedClaims: 정의를 좋아하는 아마노 긴가가 평화를 지키면서 이익도 내는 회사를 찾고, 입사 시험에서 사건을 만나 자신의 자질을 시험받는다는 권별 소개를 지원한다.
- observation: 히어로라는 직업의 공익 목적과 회사의 수익 목적이 함께 설명된다.
- limitation: 정식 유통사의 상품 소개를 통한 교차 확인이며 출판사 원문이 아니다. 입사 시험의 전체 과정이나 이후 조직 운영은 이 문구만으로 판단하지 않는다.

### Source 3

- sourceName: マンガ大賞 2013 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2013/comment2013.pdf
- publishedAt: 2013 (수상 주기; PDF 본문에는 별도 발행일 표기 없음)
- retrievedAt: 2026-08-25
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 심사 당시 초반 권 중심; 심사위원별 독서 범위는 균일하지 않음
- supportedClaims: 심사위원이 단순 패러디가 아니라 히어로 장르에 대한 지식이 보이고, 성인 사회의 답답함을 암시하면서 개그로 웃기기도 한다고 관찰한다.
- observation: Source 1의 직업·조직 전제를 장르 관습과 사회적 직장 맥락으로 읽는 보조 lead다.
- limitation: 심사자의 해석과 정서적 표현이며, 장르·테마 값을 확정하지 않는다.

### Source 4

- sourceName: マンガ大賞 2014 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2014/comment2014.pdf
- publishedAt: 2014 (수상 주기; PDF 본문에는 별도 발행일 표기 없음)
- retrievedAt: 2026-08-25
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 후속 심사 시점의 작품 초반 이후; 1~3권과 정확한 경계는 코멘트별로 불명확
- supportedClaims: 전대물 패러디처럼 보이지만 다르게 전개되고, 후속 권에서 깊이와 성인 개그의 타이밍이 넓어진다는 심사 관찰을 지원한다.
- observation: 조직형 히어로 설정이 단순한 한 장면의 장치가 아닐 수 있다는 추가 검증 lead를 제공한다.
- limitation: 후속 심사평의 독서 범위가 entry_1_3과 정확히 일치하지 않는다. 후속 권의 사실을 entry 근거로 소급하지 않는다.

### Identity, scope, and safety observations

- identity: frozen representative ISBN은 `9784864683043`이다. Source 2는 전자 유통 페이지이고, 공식 권리자 에피소드 페이지와 인쇄판의 판본 관계는 edition 확인 대상이다.
- scope: 공식 권리자 도입과 1권 유통 소개, 심사 코멘트를 확인했다. 2~3권의 공식 권별 내용은 이 조사에서 충분히 확인하지 못했으므로 해당 권의 반복·전개를 주장하지 않는다.
- safety: 재해, 악의적 사건, 범죄 대응과 전투적 히어로 직무가 전제에 포함되지만, 이 자료로 그래픽 폭력 여부를 판단할 수 없다.

## workId: `work-2d385ad0525742330e70` — ねずみの初恋

### Source 1

- sourceName: 講談社 ねずみの初恋 1권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000385374
- publishedAt: 2024-03-06
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 야쿠자 조직에 살인자로 길러져 사랑을 알지 못한 소녀 네즈미가 평범한 청년 아오이와 만나 사랑에 빠지고 함께 살기 시작한다는 도입을 지원한다. 조직이 아오이를 납치·살해하려 하고, 네즈미가 그를 구하기 위한 조건을 제안하는 사건도 소개된다.
- observation: 비일상적 조직에 길들여진 인물과 평범한 청년의 동거·구출 조건이 초반 갈등으로 제시된다.
- limitation: 출판사 줄거리는 주요 사건을 압축한 홍보문이므로 실제 장면의 빈도, 관계의 전개, 잔혹성의 정도를 확정하지 않는다. 작품 제목의 연애 표현을 어떤 값으로 해석하지 않는다.

### Source 2

- sourceName: 講談社 ねずみの初恋 2권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000392937
- publishedAt: 2024-06-06
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 조직이 두 사람의 행복한 생활을 허락하지 않고, 아오이를 살인자로 훈련하라는 조건을 내걸며, 훈련과 첫 살인의 날이 이어진다는 내용을 지원한다.
- observation: 동거 관계가 조직의 조건과 살인 훈련으로 강제적으로 재편된다.
- limitation: “첫 살인”은 공식 줄거리의 사건 요약이지만 장면 묘사·수위·반복을 설명하지 않는다.

### Source 3

- sourceName: 講談社 ねずみの初恋 3권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000398073
- publishedAt: 2024-09-05
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 아오이가 조직의 시험에서 살아남아 네즈미와 새로운 살인자 생활을 시작하고, 메시아라는 소녀가 아오이를 납치하자 네즈미가 적 조직의 사무실을 혼자 공격한다는 전개를 지원한다.
- observation: 조직 간 대립과 납치·구출이 3권의 갈등으로 확장된다.
- limitation: 3권의 대표 사건을 이후 시리즈 전체의 구조로 일반화할 수 없고, 그래픽 표현 여부는 확인하지 않았다.

### Source 4

- sourceName: ヤングマガジン 공식 작품 페이지
- sourceUrl: https://magazine.yanmaga.jp/c/nezuminohatsukoi/
- publishedAt: page date not stated (current official series page)
- retrievedAt: 2026-08-25
- authorityClass: official-rightsholder-series
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 작품 시리즈 개요
- supportedClaims: 살인자로 길러진 소녀와 평범한 청년의 한계적 사랑 이야기라는 시리즈 전제를 권리자 페이지에서 재확인한다.
- observation: Source 1~3에서 확인한 조직·동거·구출 전제를 시리즈 소개 수준에서 교차 확인할 수 있다.
- limitation: 시리즈 개요는 1~3권의 사건별 빈도와 독서 경험을 대신할 수 없다. “한계적”이라는 편집 표현을 정량적 성향이나 안전 결론으로 사용하지 않는다.

### Identity, scope, and safety observations

- identity: frozen representative ISBN은 `9784065344231`이며 Source 1과 일치한다. 2권 ISBN은 `9784065358252`, 3권 ISBN은 `9784065368800`으로 공식 상품 페이지에서 확인했다.
- scope: 1~3권의 공식 상품 페이지를 모두 확인했다.
- safety: 야쿠자, 살인 훈련·첫 살인, 납치, 살해 위협과 조직 공격이 직접 언급된다. 이는 콘텐츠 민감도 관찰이며 폭력성 수치나 안전 판정을 의미하지 않는다.

## workId: `work-2df743e085adef5e9bd3` — キルアオ

### Source 1

- sourceName: 集英社 S-MANGA キルアオ 1권
- sourceUrl: https://www.s-manga.net/items/contents.html?isbn=978-4-08-883686-7
- publishedAt: 2023-09-04
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 이혼한 아버지이자 조직에서 길러진 전설적 살인자 오가미 주조가 수수께끼의 생물 병기에 찔린 뒤 중학생 정도의 모습이 되고 학교에 들어간다는 도입을 지원한다.
- observation: 살인자 경력, 부친 역할, 중학교 생활의 격차가 같은 인물에게 겹쳐진다.
- limitation: 상품 소개가 변신과 입학이라는 전제를 압축하므로 학교 일상과 암살 사건의 실제 비중을 확정할 수 없다.

### Source 2

- sourceName: 集英社 S-MANGA キルアオ 2권
- sourceUrl: https://www.s-manga.net/items/contents.html?jdcn=08X10000000032350600
- publishedAt: 2023-11-02
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 생물 병기를 만든 회사와의 관계가 이어지고, 주조가 노렌의 가짜 남자친구 역할을 하며 약혼자 후보들과 맞서고, 살인자 신과 운동을 잘하는 중학생 텐마가 경쟁 구조에 참여한다는 전개를 지원한다.
- observation: 학교의 연애·경쟁 역할극과 암살자·기업 갈등이 병행된다.
- limitation: 공식 줄거리의 경쟁 구도가 모든 장면에서 반복되는지, 코미디와 액션의 분량이 어떤지는 알 수 없다.

### Source 3

- sourceName: 集英社 S-MANGA キルアオ 3권
- sourceUrl: https://www.s-manga.net/items/contents.html?isbn=978-4-08-883797-0
- publishedAt: 2024-01-04
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 더블 데이트 중 주조가 다시 성인 모습으로 돌아오고, 노렌이 납치되자 두 회사의 최고 살인자와 추격하며 주조와 텐마가 구출을 시도한다는 사건을 지원한다.
- observation: 학교 밖 납치·추격 위기에 학생 동료의 협력이 연결된다.
- limitation: 납치와 추격은 3권 소개의 특정 사건이며, 장기적 반복이나 표현 수위는 확인하지 않는다.

### Source 4

- sourceName: 週刊少年ジャンプ 공식 キルアオ 시리즈 페이지
- sourceUrl: https://www.shonenjump.com/j/rensai/killblue/
- publishedAt: 2023 (연재 개시 연도; 현재 시리즈 페이지에 정확한 게시일은 무기재)
- retrievedAt: 2026-08-25
- authorityClass: official-rightsholder-series
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 작품 시리즈 개요
- supportedClaims: 학교에서 다시 시작하는 암살자 코미디라는 공식 시리즈 전제와, 중학생이 된 암살자의 학교 에피소드 구성을 재확인한다.
- observation: Source 1~3의 성인 암살자와 중학생 생활의 병치를 권리자 시리즈 설명이 유지한다.
- limitation: 시리즈 페이지는 권별 사건의 세부 근거나 코미디의 빈도·방식까지는 제공하지 않는다.

### Identity, scope, and safety observations

- identity: frozen representative ISBN은 `9784088836867`이다. 2권 `9784088837376`, 3권 `9784088837970`도 공식 S-MANGA 페이지에서 확인했다.
- scope: 공식 1~3권 상품 페이지와 권리자 시리즈 페이지를 확인했다.
- safety: 살인자, 생물 병기, 납치, 추격, 조직 간 대결이 전제와 사건 소개에 포함된다. 이는 민감 콘텐츠 관찰이며 폭력 장르 값이나 안전 결론이 아니다.

## workId: `work-2f1d1c3ad0f943f1562f` — 尾守つみきと奇日常。

### Source 1

- sourceName: 小学館eコミックストア 尾守つみきと奇日常。 1권
- sourceUrl: https://e-comi.shogakukan.co.jp/books/098531820000d0000000
- publishedAt: 2024-03-18 (representative paper edition release; the current e-comic page does not expose all paper metadata)
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 인간과 함께 살아가는 비인간 출신의 환인들이 현대 사회에 존재하고, 景希高校에 다니는 늑대인간 소녀 오모리 츠미키와 인간 소년 마소 토모타카가 만난다는 도입을 지원한다. 토모타카가 관계 문제를 안고 있고 만남을 통해 감정을 찾는다는 설명도 확인된다.
- observation: 비인간 존재의 공존 설정과 인간 학생의 감정 문제를 학교 일상에 결합한다.
- limitation: e-comic 소개는 설정과 첫 만남 중심이며, 환인과 인간의 관계가 이후 얼마나 반복·확장되는지는 판단할 수 없다.

### Source 2

- sourceName: 小学館コミック 尾守つみきと奇日常。 2권
- sourceUrl: https://shogakukan-comic.jp/book?isbn=9784098533817
- publishedAt: 2024-06-18
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 츠미키의 늑대인간 특성인 힘·발톱·털·꼬리와 토모타카가 감정을 찾으려는 과정, 환인 친구들과의 어렵고 즐거운 날들, 관계의 진전과 체육제가 2권 소개에 포함된다.
- observation: 이종적 신체 특성과 학교 행사·친구 관계가 함께 묘사되는 초반 사건을 확인한다.
- limitation: 상품 소개의 표현은 대표적인 학교 사건을 요약한 것이며, 관계의 변화나 판타지 규칙 전체를 확정하지 않는다.

### Source 3

- sourceName: 小学館コミック 尾守つみきと奇日常。 3권
- sourceUrl: https://shogakukan-comic.jp/book?isbn=9784098535750
- publishedAt: 2024-09-18
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 첫 학기 말 토모타카가 감정을 찾기 위해 여러 경험을 하고, 환인 친구들의 몰랐던 면을 알게 되며, 츠미키와 보낸 여름에 감정이 넘친다는 전개를 지원한다.
- observation: 학교 일상과 계절 활동이 친구의 새로운 면을 알아가는 경험으로 이어진다.
- limitation: “감정이 넘친다”는 출판사 홍보 표현이며, 실제 장면의 수와 정서 강도를 정량화하지 않는다.

### Source 4

- sourceName: 小学館 공식 작품 기사
- sourceUrl: https://shogakukan-comic.jp/news/59792
- publishedAt: 2025-06-18
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-editorial
- provenanceFactorClassification: identity-edition-lead-only
- evaluatedRange: 후속 권 홍보·시리즈 개요; entry_1_3 밖의 내용은 평가 범위에서 제외
- supportedClaims: 환인과 인간 학생이 학교에서 관계를 이어가는 시리즈 전제가 계속된다는 권리자 맥락을 확인한다.
- observation: 1~3권의 공존·학교·관계 설정을 작품 전체 소개에서 대조할 수 있다.
- limitation: 2025년 후속 권 기사이므로 1~3권의 내용 증거로 직접 사용하지 않는다. 후속 사건·등장인물을 entry 범위에 소급하지 않는다.

### Identity, scope, and safety observations

- identity: frozen representative ISBN은 `9784098531820`이다. Source 1은 e-comic catalog이고, 2권 `9784098533817`, 3권 `9784098535750`은 공식 상품 페이지에서 확인했다.
- scope: 1~3권의 공식 소개를 확인했다. Source 4의 후속 권 내용은 범위 밖이므로 identity/series 맥락 lead로만 남긴다.
- safety: 비인간 출신의 공존과 사회적 경계가 설정에 포함되지만, 차별이나 위험의 정도는 이 자료에서 확정하지 않는다. 이는 가능한 주제 탐색 lead일 뿐 값이 아니다.

## workId: `work-3713ab561de583d709bc` — アリスと蔵六

### Source 1

- sourceName: COMICリュウ 공식 アリスと蔵六 시리즈/저자 페이지
- sourceUrl: https://www.comic-ryu.jp/author/simizu-jn/
- publishedAt: 2013-03-30 (vol.1 release listed by the rightsholder; page itself is a current series listing)
- retrievedAt: 2026-08-25
- authorityClass: official-rightsholder-series
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 시리즈 개요와 1~3권 서지
- supportedClaims: 초능력 소녀와 꽃집을 운영하는 완고한 노인의 만남이 세계를 바꾸는 SF×소녀 이야기라는 시리즈 전제를 지원한다. 1권 `9784199503375` 2013-03-30, 2권 `9784199503566` 2013-09-13, 3권 `9784199503917` 2014-03-29의 서지도 확인된다.
- observation: 초능력의 비일상성과 꽃집이라는 생활 공간, 나이와 입장이 다른 두 인물의 만남이 공식 개요에서 결합된다.
- limitation: 권리자 페이지는 1~3권의 상세 줄거리보다 시리즈 요약과 서지에 가깝다. 소개만으로 능력의 규칙, 관계 변화, 사건 빈도를 확정하지 않는다.

### Source 2

- sourceName: Sony Reader 정식 유통 アリスと蔵六 3권
- sourceUrl: https://ebookstore.sony.jp/title/00336100/id/BT000033610000300301/
- publishedAt: 2014-04-10 (paper book release shown by the distributor; e-book release 2016-02-19)
- retrievedAt: 2026-08-25
- authorityClass: licensed-distributor-volume
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 3권
- supportedClaims: 연구기관에서 도망친 사나가 상상한 것을 실체화하는 Alice’s Dream 능력을 가지고 꽃집 주인 蔵六을 만나며, 꽃집 일을 돕고 성장하는 과정과 새로운 Alice’s Dream 능력자가 나타나는 전개를 지원한다.
- observation: 연구기관 탈출과 초능력, 꽃집의 생활 노동, 새로운 능력자의 등장이 3권 소개에 함께 제시된다.
- limitation: 정식 유통사의 3권 소개로서 권리자 페이지보다 상세하지만, 전자판과 종이판의 날짜가 다르며 장면 수와 표현 수위는 확인하지 않는다.

### Source 3

- sourceName: COMICリュウ 공식 시리즈 안내
- sourceUrl: https://www.comic-ryu.jp/series_group/tv%E3%82%A2%E3%83%8B%E3%83%A1%E5%8C%96/
- publishedAt: page date not stated (current rightsholder series page)
- retrievedAt: 2026-08-25
- authorityClass: official-rightsholder-series
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 작품 시리즈 개요
- supportedClaims: 초능력 소녀와 완고한 노인의 만남을 중심으로 한 SF×소녀 이야기라는 권리자 설명을 재확인한다.
- observation: Source 1의 인물 관계와 장르적 전제를 다른 공식 시리즈 진입점에서 교차 확인한다.
- limitation: 같은 권리자 개요를 반복하는 자료이므로 새로운 권별 사건이나 강도를 증명하지 않는다.

### Source 4

- sourceName: 文化庁メディア芸術祭 공식 신인상 발표 PDF
- sourceUrl: https://www.cgarts.or.jp/v1/outline/press/2013/img/131205.pdf
- publishedAt: 2013-12-05
- retrievedAt: 2026-08-25
- authorityClass: official-award-registry
- provenanceFactorClassification: selection-provenance-only
- evaluatedRange: 작품 수상·선정 사실
- supportedClaims: 작품이 해당 연도 미디어 예술제 신인상 수상작으로 공표된다는 사실만 지원한다.
- observation: 공식 선정 경로와 작품 식별을 대조하는 provenance 자료다.
- limitation: 발표문은 내용 관찰을 제공하지 않으므로 Factor, Genre, Theme 근거로 사용하지 않는다.

### Identity, scope, and safety observations

- identity: frozen representative ISBN은 `9784199503375`이고 공식 COMICリュウ 페이지의 1권 서지와 일치한다. 2~3권 ISBN·날짜도 같은 페이지에서 확인했다.
- scope: 1~3권 서지와 3권 정식 유통 소개를 확인했다. 후속 권은 사용하지 않았다.
- safety: 연구기관 탈출, 초능력과 운명적 위험이 내용에 언급된다. 잔혹성·위험 수위는 출처만으로 판단하지 않는다.

## workId: `work-39c1a2b6791238827ed5` — とろける鉄工所

### Source 1

- sourceName: 講談社 とろける鉄工所 1권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000038640
- publishedAt: 2008-11-21
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 변두리의 작은 철공소에서 독재적인 사장과 노동자들이 용접을 하며 일하고, 비계·감전·화상 같은 작업 상황과 가족을 돕는 아내가 소개된다는 사실을 지원한다.
- observation: 제조 현장의 일과 위험, 회사 안팎의 가족 관계가 같은 권별 소개에 함께 놓인다.
- limitation: 상품 소개의 사건 나열이므로 실제 위험 장면의 반복·상세 묘사와 노동 조건 전체를 확정하지 않는다.

### Source 2

- sourceName: 講談社 とろける鉄工所 2권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000038651
- publishedAt: 2009-03-23
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 더운 여름의 용접 공장, 가을에 들어온 길고양이, 가족과 함께하는 겨울 회사 여행 등 계절별 직장·생활 에피소드를 지원한다.
- observation: 작업장 일상과 가족 동반 행사가 계절 변화에 따라 이어지는 구조가 공식 소개에 제시된다.
- limitation: 권별 소개의 대표 에피소드만으로 작품 전체의 일상성이나 가족 비중을 수치화할 수 없다.

### Source 3

- sourceName: 講談社 전자 신간 목록 とろける鉄工所 3권
- sourceUrl: https://www.kodansha.co.jp/comic/new-releases/e?page=1629
- publishedAt: 2013-01-04 (official electronic edition listing; paper vol.3 release is separately shown as 2009-10-23 by a licensed distributor)
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 철공소 노동자들이 힘든 일과 가끔의 위험·좋은 일을 겪고, 기타노의 과거와 직업훈련센터, 딸의 진로와 용접 현장 상식이 함께 다뤄진다는 소개를 지원한다.
- observation: 현장 노동의 어려움이 개인의 과거·가족의 진로·직업 지식으로 확장된다.
- limitation: 페이지는 전자판 신간 목록 날짜를 사용하므로 종이판 발매일과 혼동하지 않아야 한다. 3권 소개만으로 이후 권의 전개는 말하지 않는다.

### Source 4

- sourceName: Apple Books 정식 유통 とろける鉄工所 3권
- sourceUrl: https://books.apple.com/jp/book/%E3%81%A8%E3%82%8D%E3%81%91%E3%82%8B%E9%89%84%E5%B7%A5%E6%89%80-3/id608950922
- publishedAt: 2009-10-23 (publisher shown as 講談社)
- retrievedAt: 2026-08-25
- authorityClass: licensed-distributor-volume
- provenanceFactorClassification: identity-edition-lead-only
- evaluatedRange: 3권 판본·유통 소개
- supportedClaims: 3권의 종이판 발매일과 기타노의 과거, 아내·딸, 직업훈련센터 및 용접 현장 상식이라는 상품 소개를 대조할 수 있다.
- observation: Source 3의 전자판 날짜와 representative edition을 구분하는 판본 확인 자료다.
- limitation: 유통사 페이지는 출판사 원문보다 후순위이며, 판본 대조 이외의 작품 특성 근거로 사용하지 않는다.

### Source 5

- sourceName: マンガ大賞 2010 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2010/comment2010.pdf
- publishedAt: 2010 (수상 주기; PDF 본문에는 별도 발행일 표기 없음)
- retrievedAt: 2026-08-25
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 심사 당시 초반 권; 심사위원별 독서 범위는 균일하지 않음
- supportedClaims: 심사위원이 철공소라는 3K 작업장을 일상으로 흥미롭게 그린 점과, 늦게까지 일하는 가족을 걱정하는 아내의 장면을 관찰한다.
- observation: Source 1~3에서 확인한 작업장 일상과 가족 지원 관계를 구체적 독해로 교차 검토할 수 있다.
- limitation: 심사위원의 주관적 감상이며 “흥미롭다” 같은 평가 표현은 수치나 장르·테마 값으로 옮기지 않는다.

### Identity, scope, and safety observations

- identity: frozen representative ISBN은 `9784063522471`이며 Source 1과 일치한다. 3권은 공식 전자판 목록과 Apple Books의 종이판 날짜가 다르므로 edition lead로 분리한다.
- scope: 공식 1~3권 소개를 확인했다. 3권 종이판 발매일의 최종 identity adjudication은 별도 판본 검토로 남긴다.
- safety: 용접, 감전, 화상, 비계와 작업 스트레스가 내용상 언급된다. 이는 작업장 위험 관찰이며 안전성·위험도 판정이 아니다.

## workId: `work-3ad85a2ffdc026007d61` — 新しい上司はど天然

### Source 1

- sourceName: 秋田書店 공식 보도자료(공식 release의 PR TIMES 게시본)
- sourceUrl: https://prtimes.jp/main/html/rd/p/000000029.000040601.html
- publishedAt: 2019-08-20
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-editorial
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 전 직장의 파워하라로 상처 입은 모모세가 이직하고, 새 상사 시라사키의 지나치게 천연스러운 행동 때문에 걱정이 풀리는 직장 코미디라는 1권 전제를 지원한다.
- observation: 직장 이동, 이전 상사의 권력 괴롭힘 경험, 새 상사의 엉뚱한 행동이 도입 갈등으로 직접 연결된다.
- limitation: 보도자료는 1권의 홍보 개요이며, 파워하라 경험의 구체적 장면·지속성·회복 과정 전체를 확인할 수 없다. PR TIMES는 출판사 공식 release를 호스팅하는 정식 배포면이다.

### Source 2

- sourceName: 秋田書店 공식 新しい上司はど天然 1권 상품 페이지
- sourceUrl: https://www.akitashoten.co.jp/comics/4253142311
- publishedAt: 2019-08-20
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: identity-edition-lead-only
- evaluatedRange: 1권 상품 식별·개요
- supportedClaims: ISBN `9784253142311`과 1권 발매일 2019-08-20을 출판사 상품 페이지에서 대조할 수 있다.
- observation: Source 1에서 확인한 작품명·1권 발매 정보의 rightsholder identity를 확인한다.
- limitation: 상품 페이지에서 확인한 서지·짧은 개요만 사용한다. 후속 권의 내용이나 작품 전체의 직장 관계를 여기서 추론하지 않는다.

### Source 3

- sourceName: 新しい上司はど天然 공식/정식 유통 권수 대조 자료
- sourceUrl: https://books.rakuten.co.jp/rb/15940866/
- publishedAt: 2019-08-20
- retrievedAt: 2026-08-25
- authorityClass: licensed-bookseller
- provenanceFactorClassification: identity-edition-lead-only
- evaluatedRange: 1권 ISBN·판매 메타데이터
- supportedClaims: representative ISBN `9784253142311`과 1권 발매일을 정식 유통 상품으로 대조한다.
- observation: frozen work의 Rakuten match와 출판사 상품 페이지의 식별자가 일치한다.
- limitation: 서점의 짧은 상품 소개와 metadata는 작품의 Factor, Genre, Theme 근거로 사용하지 않는다.

### Source 4

- sourceName: 秋田書店·정식 시리즈 서지 대조
- sourceUrl: https://www.akitashoten.co.jp/comics/4253142311
- publishedAt: 2019-08-20 (1권; page current catalog)
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-series
- provenanceFactorClassification: identity-edition-lead-only
- evaluatedRange: 1권 및 현재 publisher catalog
- supportedClaims: 현재 확인 가능한 인쇄본은 1권 상품으로 식별되며, 이 조사에서는 공식 2권·3권 상품 페이지를 찾지 못했다.
- observation: entry 범위를 무리하게 3권으로 채우지 않고 권리자 catalog에서 확인된 권수만 기록한다.
- limitation: 이 source가 시리즈가 영구적으로 1권만 존재한다는 사실을 증명하는 것은 아니다. 2026-08-25 현재 조사 범위에서 2~3권 공식 상품을 확인하지 못했다는 제한이다.

### Identity, scope, and safety observations

- identity: frozen representative ISBN은 `9784253142311`이다. Source 1~3에서 같은 1권 identity를 확인했다.
- scope: entry_1_3 규칙에 따라 공식적으로 확인 가능한 1권만 평가 범위로 기록한다. 2~3권은 미확인으로 남기며, 이후 권의 내용·반복·변화를 추론하지 않는다.
- safety: 이전 직장의 파워하라와 그로 인한 상처·걱정이 작품 도입에 명시된다. 이는 민감 콘텐츠 관찰이며 직장 안전성이나 회복 결과에 대한 판정이 아니다.

## workId: `work-44d0000353478596369e` — 環と周

### Source 1

- sourceName: 集英社 단행본 環と周 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-844839-8
- publishedAt: 2023-10-23
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 단권 완결본 전체
- supportedClaims: 현대·메이지·1970년대·전후·에도를 배경으로 다섯 이야기가 배치되며, 여성 간 우정과 이별, 질병을 앞둔 인물의 만남, 전후 생존과 비밀, 복수와 재회, 현대의 동성 관계를 둘러싼 가족의 흔들림이 작품 소개에 구체적으로 열거된다.
- observation: 같은 이름의 인물들이 시대와 관계를 달리하며 이어지는 옴니버스 구성이 공식 상품 소개에 드러난다.
- limitation: 단권 전체 줄거리 요약이므로 일부 결말과 관계의 반전을 포함한다. 여러 시대의 에피소드가 한 권에 묶였다는 사실과 개별 장면의 비중을 구분해야 한다.

### Source 2

- sourceName: 集英社オンライン 작가 인터뷰
- sourceUrl: https://shueisha.online/articles/-/167862
- publishedAt: 2023-10-23
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-editorial-interview
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 단권 전체의 창작 의도와 첫 에피소드·주제 맥락
- supportedClaims: 작가가 여러 시대와 관계 속에서 타마키와 아마네가 만나는 옴니버스이며, 서로 다른 형태의 “좋아함”을 다루는 구상이라고 설명한다. 첫 에피소드의 현대 가족 관계와 여성 동급생에 대한 흔들림도 편집 기사에서 확인된다.
- observation: Source 1의 시대별 에피소드 연결을 작가의 구성 설명과 교차 확인할 수 있다.
- limitation: 작가 인터뷰는 창작자의 의도·설명이지 모든 독자의 해석이나 장면 빈도의 증명이 아니다. “좋아함”을 특정 Genre/Theme 값으로 확정하지 않는다.

### Source 3

- sourceName: 集英社オンライン 작가 인터뷰 3면
- sourceUrl: https://shueisha.online/articles/-/167862?disp=paging&page=3
- publishedAt: 2023-10-23
- retrievedAt: 2026-08-25
- authorityClass: official-publisher-editorial-interview
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 단권의 1970년대 에피소드에 대한 작가 설명
- supportedClaims: 불치병으로 살 날이 길지 않은 30대 미혼 여성이 아파트의 소년을 만나 돌보고, 제한된 시간 안에서 관계를 경험하는 에피소드의 창작 맥락을 지원한다.
- observation: 단권 소개의 질병·만남 에피소드를 작가가 의도와 인물 관계의 관점에서 구체화한다.
- limitation: 특정 에피소드에 대한 인터뷰 설명이며, 작품 전체의 정서·관계 강도·독자 반응을 일반화하지 않는다.

### Source 4

- sourceName: マンガ大賞 2024 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2024/comment2024.pdf
- publishedAt: 2024 (수상 주기; PDF 본문에는 별도 발행일 표기 없음)
- retrievedAt: 2026-08-25
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 단권 전체를 읽은 심사 코멘트; 심사자의 독해를 작품 사실과 구분
- supportedClaims: 심사 코멘트들이 서로 다른 시대의 다섯 단편과 타마키·아마네 관계의 연결, 마지막 에피소드에서 숨은 배경이 드러나는 구조, 에필로그를 구체적으로 언급한다.
- observation: 공식 단권 소개와 작가 인터뷰에서 확인한 시대·관계·연결 구조를 독립 심사 관찰로 교차 검토할 수 있다.
- limitation: 심사위원의 주관적 독해이고 결말을 포함할 수 있다. “아름답다”, “비극적이다” 같은 평가 표현을 값으로 변환하지 않으며, 스포일러를 포함한 요약은 범위 표시에만 사용한다.

### Identity, scope, and safety observations

- identity: frozen representative ISBN은 `9784088448398`이며, 2023-10-23 발매의 단권 상품과 일치한다.
- scope: 이 작품은 조사된 공식 상품상 단권 완결본이다. `entry_1_3_volumes`는 단권 전체로 적용하며, 2~3권을 가정하지 않는다.
- safety: 편성된 에피소드에 병, 수명 제한, 전후 갈등·생존, 살해와 복수, 강제 결혼·이별이 언급된다. 이는 민감 콘텐츠·스포일러 관찰이며 안전 판정이나 테마 값이 아니다.
