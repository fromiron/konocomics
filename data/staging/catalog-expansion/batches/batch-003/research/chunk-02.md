# Batch 003 official-first text evidence research — chunk 02

- 대상: batch-003 동결 manifest의 11~20번 작품
- 조사일: 2026-08-23
- 평가 범위: 현재 Work 계약의 `entry_1_3_volumes`; 공식 1~3권 소개를 우선하고, 실제 확인 범위를 각 source에 명시한다.
- 산출물 경계: 이 문서는 Evidence packet이다. Factor, Genre, Theme, centrality, Art, known/unknown 상태 및 값, promotion, safety, identity 결과를 배정하지 않는다.
- 출처 순서: 공식 출판사·권리자 권 소개를 먼저 조사했다. 해당 페이지에 내용 소개가 없거나 너무 짧은 경우 정식 유통 페이지를 후순위로 기록했다. 공식 수상기관 자료는 작품 내용에 관한 심사 코멘트가 있을 때만 포함했다.
- provenance 경계: 추천·수상 목록에 실렸다는 사실만으로는 Factor Evidence가 되지 않는다. 이번 문서에는 내용 코멘트가 없는 단순 등재 페이지를 source block으로 반복하지 않았다.
- 판본 경계: 원판, 재출간판, 전자판의 관계는 후속 identity·edition 검토 lead로만 기록한다.
- Rakuten 경계: 기존 Rakuten match는 상품·판본 대조 자료로만 읽었으며 국적, 작품 범위, Factor를 추론하는 데 사용하지 않았다.
- 제목 정규화: 출처가 제목 주변에 사용하는 장식용 인용 부호는 canonical title에 포함하지 않는다.
- 인용 원칙: 출처 문구를 복사하지 않고, 확인된 사실과 관찰을 한국어로 요약했다.
- Art 경계: 공식 내부 미리보기의 판본·페이지 참조·표본 수·장면 맥락·SHA-256을 갖춘 별도 표본은 이번 텍스트 조사에서 만들지 않았다. 따라서 어떤 source도 Art 판단 근거로 제공하지 않는다.

## 분류 키

- `factor-evidence-primary`: 공식 출판사 또는 권리자가 해당 권이나 작품 초반의 내용을 직접 설명한 1차 자료. 이후 annotation/review가 근거 적합성을 다시 판정한다.
- `factor-evidence-secondary-lead`: 정식 유통 소개 또는 작품을 읽은 복수 심사위원의 구체적 관찰처럼 추가 교차 검증에 쓸 수 있는 보조 자료. 그 자체로 값을 확정하지 않는다.
- `selection-provenance-only`: 후보 선정 경로만 증명한다. 내용 코멘트가 없는 등재 사실은 Factor, Genre, Theme 판단에 사용하지 않는다.
- `identity-edition-lead-only`: ISBN, 출판 주체, 판본 또는 판매 상태를 대조하기 위한 자료. 작품 특성의 근거로 사용하지 않는다.

## 조사 대상

| 순서 | workId                      | canonicalTitle             | representative ISBN | 이번 확인 범위                                    |
| ---: | --------------------------- | -------------------------- | ------------------- | ------------------------------------------------- |
|   11 | `work-29806fe5f9633b940747` | 暗殺教室                   | `9784088705965`     | 공식 1~3권 소개와 공식 수상기관 심사 코멘트       |
|   12 | `work-319e39a597d16251efc9` | 乱と灰色の世界             | `9784047261457`     | 공식 1~3권 소개와 공식 수상기관 심사 코멘트       |
|   13 | `work-3ba6e8e3cfdec674eae3` | 劇光仮面                   | `9784098613632`     | 공식 1~3권 소개와 공식 수상기관 심사 코멘트       |
|   14 | `work-40ea287aae6305289cf6` | その着せ替え人形は恋をする | `9784757559202`     | 공식 1~3권 소개와 공식 수상기관 심사 코멘트       |
|   15 | `work-550854424fc9cc94d585` | 高杉さん家のおべんとう     | `9784040661001`     | 공식 작품 개요·서지, 정식 유통 소개, 공식 심사평  |
|   16 | `work-5baea1ce0e7e74df34b9` | 刻刻                       | `9784063728224`     | 공식 1~3권 소개와 공식 수상기관 심사 코멘트       |
|   17 | `work-672862529a341488245b` | BUTTER！！！               | `9784063106824`     | 공식 1~3권 소개와 공식 수상기관 심사 코멘트       |
|   18 | `work-680837b0db4ec9d2932c` | トクサツガガガ             | `9784091866066`     | 공식 1~3권 소개와 공식 수상기관 심사 코멘트       |
|   19 | `work-724c064d491faf4c7414` | もやしもん                 | `9784063521061`     | 공식 1~3권 소개, 공식 심사평, 신장판 edition lead |
|   20 | `work-78d44d381562e37dd94a` | きょうは会社休みます。     | `9784088467696`     | 공식 1~3권 소개와 공식 수상기관 심사 코멘트       |

## workId: `work-29806fe5f9633b940747` — 暗殺教室

### Source 1

- sourceName: 集英社 暗殺教室 1권 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-870596-5
- publishedAt: 2012-11-02 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 3-E 학생들이 담임 교사를 암살해야 하며, 교사와 학생이 동시에 표적과 암살자 관계라는 도입을 지원한다.
- observation: 교실의 일상과 암살 임무가 함께 시작된다.
- limitation: 전제만 압축한 소개이므로 이후 반복 구조와 강도를 확정할 수 없다.

### Source 2

- sourceName: 集英社 暗殺教室 2권 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-870604-7
- publishedAt: 2012-12-28 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 외국어 교사로 부임한 암살자가 외모와 대화를 이용해 접근하고 학생들도 암살 준비를 이어간다는 사실을 지원한다.
- observation: 교사·학생 관계와 외부 암살자의 개입이 병행된다.
- limitation: 개별 사건의 비중이나 장기적 지속성은 알 수 없다.

### Source 3

- sourceName: 集英社 暗殺教室 3권 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-870633-7
- publishedAt: 2013-03-04 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 수학여행 중 납치된 학생을 찾는 행동과 교토에서의 암살 시도가 함께 진행된다는 사실을 지원한다.
- observation: 학교 밖 집단 사건에서도 학급과 담임의 관계가 이어진다.
- limitation: 한 권의 위기 사건을 작품 전체 특성으로 일반화할 수 없다.

### Source 4

- sourceName: マンガ大賞 2013 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2013/comment2013.pdf
- publishedAt: 2013 (수상 주기; PDF 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 심사 당시 1~2권 중심; 일부 필자의 독서 범위는 미기재
- supportedClaims: 복수 심사위원이 기묘한 전제, 코믹한 제시 방식, 학생을 돌보는 교사, 교육 문제를 다루는 면, 예측하기 어려운 전개를 구체적으로 언급했다.
- observation: 공식 권 소개에서 확인되는 교실·암살의 병치를 교차 검토할 보조 자료다.
- limitation: 개인 심사평의 집합이며 독서 범위와 평가 기준이 균일하지 않다.

## workId: `work-319e39a597d16251efc9` — 乱と灰色の世界

### Source 1

- sourceName: KADOKAWA 乱と灰色の世界 1권 상품 페이지
- sourceUrl: https://www.kadokawa.co.jp/product/200908000223/
- publishedAt: 2009-11-16 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 네 명의 마법사를 중심으로 한다는 최소 전제만 지원한다.
- observation: 공식 설명은 매우 짧아 인물 구성 외에는 확인할 수 없다.
- limitation: 사건, 관계, 반복 구조를 판단할 정보가 없다.

### Source 2

- sourceName: KADOKAWA 乱と灰色の世界 2권 상품 페이지
- sourceUrl: https://www.kadokawa.co.jp/product/201008000181/
- publishedAt: 2010-11-15 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 네 명의 마법사라는 구성이 이어진다는 사실만 지원한다.
- observation: 2권 소개도 한 문장 수준이다.
- limitation: 내용 기반 주석을 지지하기에는 정보가 부족하다.

### Source 3

- sourceName: KADOKAWA 乱と灰色の世界 3권 상품 페이지
- sourceUrl: https://www.kadokawa.co.jp/product/301709000036/
- publishedAt: 2011-07-15 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 열 살 마법사 乱과 漆間 가족이 마법을 숨기며 살고, 외부에서 마법을 쓰지 말라는 어머니의 금기를 乱이 어겨 큰 문제를 맞는다는 사실을 지원한다.
- observation: 가족의 비밀과 어린 인물의 규칙 위반이 3권 사건의 출발점이다.
- limitation: 3권 사건만으로 1~3권 전체의 지속적 특성을 확정할 수 없다.

### Source 4

- sourceName: マンガ大賞 2012 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2012/mantai_comment2012.pdf
- publishedAt: 2012 (수상 주기; PDF 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 최대 3권; 심사위원별 범위는 균일하지 않음
- supportedClaims: 복수 코멘트가 마법을 쓰는 가족, 어린 乱의 시점, 코미디를 반복해서 언급하며, 일부는 3권에서 성인의 욕망과 어린 인물의 순진한 반응이 병치된다고 관찰했다.
- observation: 짧은 공식 1·2권 소개를 보완할 내용별 조사 lead다.
- limitation: 민감한 관찰을 포함한 주관적 심사평이며 분류나 값으로 직접 환산할 수 없다.

## workId: `work-3ba6e8e3cfdec674eae3` — 劇光仮面

### Source 1

- sourceName: 小学館 劇光仮面 1권 상품 페이지
- sourceUrl: https://www.shogakukan.co.jp/books/09861363
- publishedAt: 2022-05-30 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 29세 実相寺二矢가 아르바이트로 생활하며 자신을 그릇에 불과하다고 여기는 현재와 특촬 소재의 연결을 지원한다.
- observation: 현대 생활 속 인물의 자기인식에서 이야기가 시작된다.
- limitation: 공식 홍보문이 원인을 숨기므로 인물 상태의 범위와 지속성을 확정할 수 없다.

### Source 2

- sourceName: 小学館 劇光仮面 2권 상품 페이지
- sourceUrl: https://www.shogakukan.co.jp/books/09861506
- publishedAt: 2022-10-28 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 대학 시절 특촬미술연구회 구성원들이 현실에 개입할 수 있는 특수 의상을 추구했으며, 현재의 実相寺가 재판대에 오르는 전개를 지원한다.
- observation: 과거의 제작 활동과 현재의 책임 문제가 연결된다.
- limitation: 홍보문이 핵심 사건을 의문형으로 제시해 인과관계를 완전히 설명하지 않는다.

### Source 3

- sourceName: 小学館 劇光仮面 3권 상품 페이지
- sourceUrl: https://www.shogakukan.co.jp/books/09861744
- publishedAt: 2023-04-28 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 가면을 쓴 특촬 코스플레이어 ヴァイパー가 범죄 대응으로 알려진 実相寺에게 도전하고 새로운 사건 국면이 시작된다는 사실을 지원한다.
- observation: 개인의 과거와 재판에서 다른 의상 착용자의 직접적 경쟁으로 범위가 넓어진다.
- limitation: 3권의 새 국면이 이후에도 지속되는지는 확인할 수 없다.

### Source 4

- sourceName: マンガ大賞 2023 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2023/comment2023.pdf
- publishedAt: 2023 (수상 주기; PDF 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 주로 1~2권; 일부 필자의 독서 범위는 미기재
- supportedClaims: 복수 심사위원이 현대극과 특촬 역사, 의상 제작에 대한 강한 집념, 현실과 허구의 경계, 사회적으로 고립된 주인공, 2권 말의 급격한 사건을 언급했다.
- observation: 공식 소개의 특촬 제작과 현재 사건 연결을 교차 검토할 수 있다.
- limitation: 주관적 평가이며 3권 내용과 정확한 값은 지원하지 않는다.

## workId: `work-40ea287aae6305289cf6` — その着せ替え人形は恋をする

### Source 1

- sourceName: スクウェア・エニックス その着せ替え人形は恋をする 1권 상품 페이지
- sourceUrl: https://magazine.jp.square-enix.com/top/comics/detail/9784757559202/
- publishedAt: 2018-11-24 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 히나 인형 머리 장인을 지망하는 五条新菜와 같은 반의 喜多川海夢가 재봉실에서 만나 코스프레 의상을 함께 만들기 시작한다는 사실을 지원한다.
- observation: 서로 다른 학교 내 위치와 기술·관심사가 공동 작업으로 연결된다.
- limitation: 첫 만남만으로 이후 관계의 지속적 성격을 확정할 수 없다.

### Source 2

- sourceName: スクウェア・エニックス その着せ替え人形は恋をする 2권 상품 페이지
- sourceUrl: https://magazine.jp.square-enix.com/top/comics/detail/9784757559219/
- publishedAt: 2018-11-24 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 新菜가 2주 안에 海夢의 의상을 제작하며 코스프레 활동이 본격적으로 시작된다는 사실을 지원한다.
- observation: 관심사 공유가 실제 제작 일정과 협업으로 구체화된다.
- limitation: 한 번의 마감 경험을 작품 전체의 진행 방식으로 일반화할 수 없다.

### Source 3

- sourceName: スクウェア・エニックス その着せ替え人形は恋をする 3권 상품 페이지
- sourceUrl: https://magazine.jp.square-enix.com/top/comics/detail/9784757561380/
- publishedAt: 2019-05-25 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 첫 코스프레 행사 뒤 海夢의 감정이 달라지고, 두 사람이 원작 애니메이션을 함께 보며, 새 코스플레이어 ジュジュ가 합류한다는 사실을 지원한다.
- observation: 3권에서 공동 관심사와 관계망이 확장된다.
- limitation: 홍보문의 감정 변화 표현만으로 관계 강도나 이후 지속성을 확정할 수 없다.

### Source 4

- sourceName: マンガ大賞 2019 심사위원 코멘트 아카이브
- sourceUrl: https://www.mangataisho.com/archives/2019/01/085.html
- publishedAt: 2019 (수상 주기; 페이지의 정확한 게시일은 미확인)
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 당시 출간된 1~2권
- supportedClaims: 복수 심사위원이 인형 제작을 배우는 조용한 학생과 자신의 취향을 솔직하게 표현하는 학생이 코스프레로 연결되고, 상호 호감과 관계 변화가 나타난다고 관찰했다.
- observation: 공식 1~2권 소개에서 확인되는 인물 대비와 공동 제작 구조를 보조적으로 교차 확인한다.
- limitation: 3권은 포함하지 않으며 개인 심사평으로 시각적 특성이나 정확한 값을 확정할 수 없다.

## workId: `work-550854424fc9cc94d585` — 高杉さん家のおべんとう

### Source 1

- sourceName: KADOKAWA カドコミ 高杉さん家のおべんとう 공식 작품 페이지
- sourceUrl: https://comic-walker.com/detail/KC_000801_S
- publishedAt: undated (페이지; 전자판 1~3권 표시 배포일 2012-06-21)
- retrievedAt: 2026-08-23
- authorityClass: official-rightsholder-series
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 공식 작품 개요와 1~3화 링크 존재 여부; 내부 페이지는 판독하지 않음
- supportedClaims: 박사 학위를 가진 温巳가 열두 살 사촌 久留里를 맡고, 서툰 두 사람이 함께 살며 도시락을 통해 소통한다는 전제를 지원한다.
- observation: 식사 준비와 공동생활이 두 인물의 의사소통 경로로 제시된다.
- limitation: 권별 소개가 아니며 공개 화 링크의 내부 이미지는 확인하지 않았다.

### Source 2

- sourceName: KADOKAWA 高杉さん家のおべんとう 1권 상품 페이지
- sourceUrl: https://www.kadokawa.co.jp/product/302408001751/
- publishedAt: 2010-01-23 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: identity-edition-lead-only
- evaluatedRange: 1권 서지
- supportedClaims: 현재 KADOKAWA 페이지가 ISBN `9784040661001`을 1권에 연결한다는 사실을 지원한다.
- observation: frozen representative ISBN과 일치한다.
- limitation: 줄거리 설명이 없어 내용 Evidence로 사용할 수 없으며, 원래 Media Factory판 ISBN과의 관계가 남아 있다.

### Source 3

- sourceName: KADOKAWA 高杉さん家のおべんとう 2권 상품 페이지
- sourceUrl: https://www.kadokawa.co.jp/product/302408001752/
- publishedAt: 2010-06-23 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: identity-edition-lead-only
- evaluatedRange: 2권 서지
- supportedClaims: 현재 KADOKAWA 페이지가 ISBN `9784040661018`을 2권에 연결한다는 사실을 지원한다.
- observation: 현재 공식 카탈로그의 연속 권 서지다.
- limitation: 내용 소개와 원판 ISBN 계보는 제공하지 않는다.

### Source 4

- sourceName: KADOKAWA 高杉さん家のおべんとう 3권 상품 페이지
- sourceUrl: https://www.kadokawa.co.jp/product/302408001757/
- publishedAt: 2011-01-22 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: identity-edition-lead-only
- evaluatedRange: 3권 서지
- supportedClaims: 현재 KADOKAWA 페이지가 ISBN `9784040679112`을 3권에 연결한다는 사실을 지원한다.
- observation: 공식 1~3권 서지는 확인되지만 상품 설명은 없다.
- limitation: 내용 Evidence로 사용할 수 없다.

### Source 5

- sourceName: コミックシーモア 高杉さん家のおべんとう 1~3권 유통 페이지
- sourceUrl: https://www.cmoa.jp/title/31428/vol/1/
- publishedAt: 2014-09-27 (표시된 전자판 배포 시작일; 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: licensed-distributor-volume-list
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 1~3권 소개
- supportedClaims: 1권에서 温巳와 久留里가 도시락으로 소통하기 시작하고, 2권에서 대학 취업과 주변 인물의 접근으로 관계가 복잡해지며, 3권에서 久留里의 사회적 적응과 출생 관련 비밀이 다뤄진다는 사실을 지원한다.
- observation: 공식 출판사 권별 페이지에 줄거리가 없어 정식 유통 소개를 보조 자료로 사용했다.
- limitation: 출판사 직접 설명이 아니며 공급된 소개문의 작성 주체와 정확한 수록 범위는 별도 검토가 필요하다.

### Source 6

- sourceName: マンガ大賞 高杉さん家のおべんとう 심사위원 코멘트 아카이브
- sourceUrl: https://www.mangataisho.com/archives/2013/01/post-23.html
- publishedAt: 2013 archive; 2012 selection cycle
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 심사 당시 초기 출간분; 필자별 범위는 미기재이며 일부는 4권까지 포함했을 가능성 있음
- supportedClaims: 복수 심사위원이 도시락과 음식이 두 인물의 감정을 전달하고, 함께 사는 거리감이 서서히 달라지며, 주변 인물과 가족 기억이 전개에 관여한다고 관찰했다.
- observation: 공식 작품 개요의 음식 매개 소통을 교차 확인할 수 있다.
- limitation: entry 1~3권을 넘는 독서가 섞였을 수 있어 직접적인 권별 근거로 사용할 수 없다.

## workId: `work-5baea1ce0e7e74df34b9` — 刻刻

### Source 1

- sourceName: 講談社 刻刻 1권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000013948
- publishedAt: 2009-08-21 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 실직 중인 28세 佑河樹里와 세대가 함께 사는 가족, 조카 真와 형 翼의 납치, 가족에게 전해진 止界術, 정지한 세계 안에서 움직이는 다른 사람들과 管理人의 등장을 지원한다.
- observation: 가족 구출이라는 시간 제한 사건이 정지한 세계의 규칙, 종교 집단과의 대립으로 연결된다.
- limitation: 공식 소개는 강한 폭력 장면까지 포함하지만, 1권 사건만으로 작품 전체의 강도나 장기 구조를 확정할 수 없다.

### Source 2

- sourceName: 講談社 刻刻 2권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000013949
- publishedAt: 2009-08-21 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 翼와 真가 정지한 세계를 떠돌고, 樹里의 어린 시절 경험과 少女・間島翔子가 止界의 기원에 연결되며, 樹里가 다른 사람을 밖으로 내보내는 능력을 드러낸다는 사실을 지원한다.
- observation: 2권에서 가족 구출과 추격 외에 止界의 과거와 인물별 능력 차이가 전개에 들어온다.
- limitation: 상품 소개가 밝힌 능력과 기원 단서만으로 세계 규칙의 완결성이나 이후 비중을 판단할 수 없다.

### Source 3

- sourceName: 講談社 刻刻 3권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000014049
- publishedAt: 2010-08-23 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 間島가 神ノ離忍이 된 가족을 찾아 되돌리려 하고, 그 목적에 樹里의 능력이 필요하며, 樹里와 순간 이동하는 할아버지가 도주하는 가운데 佐河의 실험으로 새로운 神ノ離忍이 생긴다는 사실을 지원한다.
- observation: 초반의 가족 구출 문제는 다른 가족의 과거와 종교 집단의 실험으로 확장된다.
- limitation: 여러 집단의 목적이 한꺼번에 소개되므로 긴장도, 정보 밀도, 사건 속도를 개별 값으로 환산할 수 없다.

### Source 4

- sourceName: マンガ大賞 2011 심사위원 코멘트 아카이브
- sourceUrl: https://www.mangataisho.com/archives/2011/12/194.html
- publishedAt: 2011 (수상 주기; 페이지의 정확한 게시일은 미확인)
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 당시 출간된 1~3권; 필자별 정확한 범위는 균일하지 않음
- supportedClaims: 복수 심사위원이 止界라는 정지한 시간, 가족과 종교 집단의 대립, 규칙이 점차 드러나는 전개, 빠르고 예측하기 어려운 긴장감을 구체적으로 언급했다.
- observation: 공식 1~3권 소개에서 확인되는 세계 규칙과 추격 구조를 교차 검토할 보조 자료다.
- limitation: 주관적 심사평이며 일부 시각적 인상은 이번 텍스트 Evidence나 Art 근거로 사용하지 않는다.

## workId: `work-672862529a341488245b` — BUTTER！！！

### Source 1

- sourceName: 講談社 BUTTER！！！ 1권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000029740
- publishedAt: 2010-07-23 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 힙합을 기대하고 댄스부에 들어온 여고생 夏가 사교댄스를 접하고, 춤을 꺼리는 어두운 분위기의 端場와 짝이 되어 충돌하면서도 춤의 즐거움을 발견한다는 사실을 지원한다.
- observation: 기대와 다른 동아리 활동, 성격이 다른 파트너, 실제 연습이 초반 관계의 출발점이다.
- limitation: 첫 체험과 충돌만으로 이후 노력의 강도나 관계 변화 속도를 확정할 수 없다.

### Source 2

- sourceName: 講談社 BUTTER！！！ 2권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000029780
- publishedAt: 2011-01-21 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 夏와 端場의 조합이 좋아지는 가운데 한 사건으로 夏가 춤을 출 수 없게 되고, 端場가 파트너의 위기에 대응해야 한다는 사실을 지원한다.
- observation: 기술 습득과 파트너 관계가 개인적 위기와 함께 다뤄진다.
- limitation: 상품 소개가 사건을 숨기므로 위기의 성격과 해결 범위를 확인할 수 없다.

### Source 3

- sourceName: 講談社 BUTTER！！！ 3권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000029838
- publishedAt: 2011-08-23 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 夏가 결심과 달리 사람들 앞에서 춤추기를 두려워하고, 柘植는 체형 조롱 때문에 문화제 참가를 망설이며, 端場와 掛井도 각자의 의욕·대인 문제를 마주한다는 사실을 지원한다.
- observation: 3권은 한 조의 기술 향상뿐 아니라 여러 부원의 약점과 문화제 참여 문제로 범위를 넓힌다.
- limitation: 각 인물의 한 시점 문제를 작품 전체의 정서나 인물 성장 비중으로 일반화할 수 없다.

### Source 4

- sourceName: マンガ大賞 2012 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2012/mantai_comment2012.pdf
- publishedAt: 2012 (수상 주기; PDF 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 당시 출간된 1~3권; 필자별 정확한 범위는 미기재
- supportedClaims: 복수 심사위원이 고등학교 사교댄스 동아리, 노력과 우정, 미숙한 청소년들이 활동에 몰입하는 과정을 구체적으로 언급했다.
- observation: 공식 1~3권 소개에서 확인되는 동아리·파트너·개인 약점의 전개를 교차 검토할 보조 자료다.
- limitation: 개인 심사평이며 일부 그림체 관련 평가는 실제 픽셀·페이지 표본 검증이 없으므로 Art Evidence가 아니다.

## workId: `work-680837b0db4ec9d2932c` — トクサツガガガ

### Source 1

- sourceName: 小学館 トクサツガガガ 1권 상품 페이지
- sourceUrl: https://www.shogakukan.co.jp/books/09186606
- publishedAt: 2014-11-28 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 26세 회사원 仲村叶가 특촬 팬이라는 사실을 직장에서 숨기고, 노출을 두려워하면서 캡슐 토이·혼자 하는 노래방·영웅의 말을 일상에 연결한다는 사실을 지원한다.
- observation: 직장인의 비밀 취미와 일상 문제가 특촬 작품을 보는 관점 안에서 함께 제시된다.
- limitation: 여러 에피소드 소재를 나열한 소개이므로 웃음의 빈도나 비밀 노출 스트레스의 강도를 확정할 수 없다.

### Source 2

- sourceName: 小学館 トクサツガガガ 2권 상품 페이지
- sourceUrl: https://www.shogakukan.co.jp/books/09186810
- publishedAt: 2015-03-30 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 仲村가 직장에서 취미를 계속 숨기면서 팬 친구들과 관련 장소를 찾고, 로봇 피규어를 장식하며, 배우 팬인 인물을 특촬 쪽으로 이끌려 하는 사건을 지원한다.
- observation: 2권에서 혼자 숨기던 취미가 팬 친구와의 공동 활동, 수집·전시, 다른 팬 성향과의 접점으로 확장된다.
- limitation: 소개의 팬 활동 사례만으로 공동체 비중이나 인물 간 친밀도를 판단할 수 없다.

### Source 3

- sourceName: 小学館 トクサツガガガ 3권 상품 페이지
- sourceUrl: https://www.shogakukan.co.jp/books/09187060
- publishedAt: 2015-06-30 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 취향 공개를 신경 쓰지 말라는 조언에도 仲村가 이를 말하지 못하는 이유, 취미를 싫어하는 동료가 만드는 노출 위험, 팬 대화·수제 전시·디지털카메라 관심사가 전개에 포함된다는 사실을 지원한다.
- observation: 3권은 비밀을 유지하는 내적 이유와 직장 관계의 위험을 더 직접적으로 다룬다.
- limitation: 한 동료의 태도나 특정 에피소드를 직장 전체 환경 또는 장기적 갈등으로 일반화할 수 없다.

### Source 4

- sourceName: マンガ大賞 2016 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2016/comment2016.pdf
- publishedAt: 2016 (수상 주기; PDF 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 심사 당시 출간분; entry 1~3권보다 넓을 수 있고 필자별 범위는 미기재
- supportedClaims: 복수 심사위원이 팬의 구체적 체험을 대변하는 면과, 仲村가 영웅·프로그램 제작자·판매자의 태도에서 일상 문제를 다룰 단서를 얻는 구조를 언급했다.
- observation: 공식 권 소개의 특촬 관점과 회사원 일상 연결을 교차 확인할 보조 lead다.
- limitation: entry 범위를 직접 한정하지 않은 주관적 심사평이며, 이후 권의 관찰이 섞였을 수 있다.

## workId: `work-724c064d491faf4c7414` — もやしもん

### Source 1

- sourceName: 講談社 もやしもん 1권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000038500
- publishedAt: 2005-05-21 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 원판 1권
- supportedClaims: 종국 제조업 집안의 차남 沢木가 균을 볼 수 있는 능력을 지닌 채 도쿄의 농업대학에 입학하고, 연구실과 동료들, 균들과 함께 캠퍼스 생활을 시작한다는 전제를 지원한다.
- observation: 공식 소개는 특수 능력, 농업대학, 연구실과 학생 집단을 초반의 공통 환경으로 제시한다.
- limitation: 짧은 시리즈 개요형 소개이므로 개별 사건, 정보 설명의 양, 인물 관계 비중을 판정할 수 없다.

### Source 2

- sourceName: 講談社 もやしもん 2권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000038520
- publishedAt: 2005-10-20 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 원판 2권
- supportedClaims: 공식 페이지가 2권을 동일 작품·출판 계열에 연결하고, 균을 보는 沢木의 농업대학 생활이라는 작품 개요를 계속 제시한다는 사실을 지원한다.
- observation: 출판사 페이지는 초반 환경의 연속성은 확인해 주지만 2권 고유 사건은 설명하지 않는다.
- limitation: 1권과 같은 시리즈 개요를 반복하므로 권별 전개나 반복 구조의 독립 근거가 아니다.

### Source 3

- sourceName: 講談社 もやしもん 3권 상품 페이지
- sourceUrl: https://www.kodansha.co.jp/comic/products/0000038545
- publishedAt: 2006-05-23 (단행본 발매일; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 원판 3권
- supportedClaims: 공식 페이지가 3권을 동일 작품·출판 계열에 연결하고, 농업대학의 연구실·동료·균이라는 시리즈 개요를 유지한다는 사실을 지원한다.
- observation: 3권 공식 페이지도 작품 환경은 확인하지만 권별 사건을 제공하지 않는다.
- limitation: 반복된 시리즈 소개만으로 초반 1~3권의 지속적 성격이나 값의 강도를 확정할 수 없다.

### Source 4

- sourceName: マンガ大賞 2008 심사위원 코멘트 PDF
- sourceUrl: https://www.mangataisho.com/data/2008/comment.pdf
- publishedAt: 2008 (수상 주기; PDF 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 심사 당시 출간분; entry 1~3권보다 넓고 필자별 범위는 균일하지 않음
- supportedClaims: 복수 심사위원이 농업대학의 캠퍼스 생활, 균을 보는 능력, 발효·음식 관련 지식, 여러 인물이 함께 움직이는 전개와 정보의 접근성을 구체적으로 언급했다.
- observation: 짧은 공식 시리즈 개요의 대학·균·연구 환경을 교차 확인하고 추가 내용 근거를 찾을 보조 lead다.
- limitation: 심사 당시 범위가 더 넓으며 주관적 평가다. 일부 시각적 인상은 이번 텍스트 Evidence나 Art 근거로 사용하지 않는다.

### Source 5

- sourceName: 講談社 もやしもん 공식 작품 목록 페이지
- sourceUrl: https://www.kodansha.co.jp/titles/1000000069
- publishedAt: 2025-05-22 to 2026-05-22 (신장판 1~13권 발매 기간; 웹 페이지 자체는 무기재)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-series
- provenanceFactorClassification: identity-edition-lead-only
- evaluatedRange: 원판과 신장판의 공식 판본 안내
- supportedClaims: 현재 신장판은 전 13권이며 새 표지를 사용하지만 본편과 보너스 만화 내용은 원판과 같고 종이책으로만 나온다는 안내를 지원한다.
- observation: frozen representative ISBN의 원판 1권과 현재 신장판은 별도 상품 판본이지만 같은 본편 계보로 설명된다.
- limitation: 판본 안내만으로 representative ISBN 변경이나 Work 병합·분리를 결정하지 않는다. Factor Evidence도 아니다.

## workId: `work-78d44d381562e37dd94a` — きょうは会社休みます。

### Source 1

- sourceName: 集英社 きょうは会社休みます。 1권 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08846769846769315501
- publishedAt: 2012-04-25 (종이 단행본 발매일; 전자판 2013-02-12)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 1권
- supportedClaims: 연애와 성경험이 없는 채 33세 생일을 맞은 회사원 青石花笑가 놓친 기회를 후회하고, 생일의 한 사건으로 지금까지와 다른 상황을 맞는다는 도입을 지원한다.
- observation: 직장인의 자기인식과 첫 관계로 이어질 사건이 생일을 계기로 연결된다.
- limitation: 공식 소개가 사건의 상대와 결과를 숨기므로 1권만으로 관계 구조나 정서 강도를 확정할 수 없다.

### Source 2

- sourceName: 集英社 きょうは会社休みます。 2권 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08846820846769315501
- publishedAt: 2012-08-24 (종이 단행본 발매일; 전자판 2013-02-12)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 2권
- supportedClaims: 花笑가 생일 밤 21세 대학생이자 회사 아르바이트생인 田之倉와 성관계를 가진 뒤 교제를 시작하고, 크리스마스를 포함한 여러 첫 경험을 맞는다는 사실을 지원한다.
- observation: 2권에서 첫 관계라는 전제가 나이 차이가 있는 연애와 직장 접점 안에서 구체화된다.
- limitation: 상품 소개의 첫 경험 나열만으로 관계의 지속성, 갈등 수준 또는 작품 전체 비중을 판정할 수 없다.

### Source 3

- sourceName: 集英社 きょうは会社休みます。 3권 상품 페이지
- sourceUrl: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08845002846769315501
- publishedAt: 2013-02-25 (종이 단행본 발매일; 전자판 2013-05-24)
- retrievedAt: 2026-08-23
- authorityClass: official-publisher-volume
- provenanceFactorClassification: factor-evidence-primary
- evaluatedRange: 3권
- supportedClaims: 첫 교제가 깊어지는 가운데 다른 여성이 田之倉에게 접근하고, 후배 瞳을 주인공으로 한 특별편이 함께 수록된다는 사실을 지원한다.
- observation: 3권은 주인공 커플 외의 인물과 관계 변수를 초반 전개에 추가한다.
- limitation: 다른 인물의 접근이라는 한 사건을 이후 관계 구조나 긴장도의 지속적 근거로 일반화할 수 없다.

### Source 4

- sourceName: マンガ大賞 2013 심사위원 코멘트 아카이브
- sourceUrl: https://www.mangataisho.com/archives/2013/02/post-366.html
- publishedAt: 2013 (수상 주기; 페이지의 정확한 게시일은 미확인)
- retrievedAt: 2026-08-23
- authorityClass: official-award-jury-commentary
- provenanceFactorClassification: factor-evidence-secondary-lead
- evaluatedRange: 심사 당시 출간된 1~3권; 필자별 정확한 범위는 미기재
- supportedClaims: 복수 심사위원 중 구체적 코멘트는 33세 회사원과 21세 대학생의 첫 연애라는 전제와, 기존 연애물의 범위를 넓힌 사회적 배경을 언급했다.
- observation: 공식 1~3권 소개의 주인공 연령, 첫 교제, 나이 차이 전제를 교차 검토할 보조 자료다.
- limitation: 코멘트 수가 적고 주관적이므로 관계의 질이나 정확한 값, centrality를 확정할 수 없다.

## Identity, safety, edition research leads

- 동결 데이터의 10개 작품 모두 `safety-approved`, 일반판 representative ISBN, Rakuten exact match로 기록돼 있음을 읽었다. 이 문서는 그 결정을 재심하거나 국적을 다시 판정하지 않는다.
- 高杉さん家のおべんとう는 현재 KADOKAWA가 frozen representative ISBN을 1권에 연결하지만, 초기 Media Factory판과의 ISBN·판본 계보는 후속 edition 검토가 필요하다.
- もやしもん은 원판 1~~3권을 내용 조사 범위로 삼았다. 2025~~2026년 신장판은 새 표지를 쓰되 본편과 보너스 만화 내용이 원판과 같다는 공식 안내만 edition lead로 남겼다.
- きょうは会社休みます。의 현재 集英社 URL은 JDCN 전자판 레코드이며 종이책 발매일도 함께 표시한다. frozen representative ISBN과 종이 일반판의 직접 매핑은 후속 서지 검수 lead다.
- 刻刻의 납치·폭력적 죽음·종교 집단·이형 존재, 乱と灰色の世界의 어린 인물과 성인의 욕망 병치, 劇光仮面의 범죄·재판, きょうは会社休みます。의 성관계와 나이 차이는 공식·공식 심사 자료가 드러낸 민감 내용 lead다. 이 문서는 소재만으로 성인 전용 여부를 판정하지 않는다.
- 暗殺教室의 표적·암살, BUTTER！！！의 체형 조롱과 대인 위기, トクサツガガガ의 취미 노출 위험도 작품 내용 lead일 뿐 safety나 Factor 결론이 아니다.

## Unresolved research gaps

- 乱と灰色の世界 1·2권 공식 설명은 한 문장 수준이어서 내용 판단에 충분하지 않다.
- 高杉さん家のおべんとう의 공식 권별 페이지에는 내용 소개가 없어 정식 유통 1~3권 요약을 보조 lead로 사용했다. 현재 KADOKAWA ISBN과 초기 Media Factory판의 관계도 남아 있다.
- 高杉さん家のおべんとう의 공식 カドコミ URL은 일반 브라우저 User-Agent로는 200을 반환하지만 기본 `curl` 요청에는 403을 반환했다. 자동 링크 검증 시 접근 불가로 잘못 분류하지 않도록 재현 조건을 구분해야 한다.
- もやしもん 2·3권 공식 페이지는 동일한 시리즈 개요를 반복해 권별 전개를 지원하지 않는다.
- 공식 심사평은 필자별 독서 범위가 다르고 일부는 entry 1~3권을 넘는다. 따라서 모두 secondary lead로만 기록했다.
- 사용자 리뷰 packet은 포함하지 않았다. 공식 출판사 자료와 공식 수상 심사평이 있었고, 독립성·확인 범위·반복 주장 요건을 만족하는 별도 review pair를 이 제한된 조사에서 구성하지 않았다.
- 이번 chunk에는 판독 기준을 충족한 공식 내부 미리보기 페이지 묶음이 없다. 판본·페이지 참조·최소 6쪽·서로 다른 두 장면 맥락·SHA-256을 갖춘 표본이 없으므로 어떤 작품에도 Art 판단 근거를 제공하지 않는다.
- 공식 1~3권 소개가 짧은 작품은 장기 지속성, 사건 비중, 관계 centrality 또는 극단값을 지원하지 않는다. 후속 annotation/review가 필요한 항목을 별도 조사하거나 계약에 따라 종결해야 한다.
- 내용 코멘트가 없는 수상·추천 등재 사실은 기존 selection provenance에만 남기고 Factor Evidence로 승격하지 않는다.
