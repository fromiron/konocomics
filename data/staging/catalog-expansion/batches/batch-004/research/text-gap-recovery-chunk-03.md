# Batch 004 text-gap recovery — chunk 03

- 대상: frozen Batch 004의 21–30번
- 조사일: 2026-08-25
- 범위: 기존 Pass C가 남긴 Genre·Theme·Narrative·Tone 잔여 gap만 재조사
- 판정자: Luna text-gap recovery
- `reviewedByHuman=false`
- Art: 조사·판정하지 않음. Art 표본 부족은 이 문서의 blocker가 아니다.
- 변경 경계: Pass A, Pass C가 확정한 셀을 덮어쓰지 않았다. CSV, promotion registry, generated catalog를 수정하지 않았다.
- 제목 정규화: 장식용 `『』`는 canonical title과 이 문서의 title field에 포함하지 않는다.
- 조회일: 모든 URL은 2026-08-25에 확인했다.

## 적용 규칙

1. Factor Dictionary와 annotation guide를 먼저 적용했다. `unknown`은 0이 아니며, 장르·상품 태그·제목만으로 Axis를 만들지 않았다.
2. 기본 관찰 범위는 공식 출판사의 1–3권 또는 단권·단편집의 유일한 주요 에피소드다. 한 권의 홍보문만으로 작품 전체의 지속성을 단정하지 않았다.
3. 공식 권 소개는 직접 근거로 기록했다. 서점·배급사 소개와 사용자 리뷰는 보조 자료로 분리했다.
4. 사용자 리뷰를 Factor 근거로 올릴 때는 서로 다른 작성자의 구체적인 관찰이 entry 범위와 맞아야 한다. 제목 페이지에 함께 노출되었지만 읽은 권수·범위가 명시되지 않은 리뷰는 독립성은 기록하되 known 확정에 사용하지 않았다.
5. `absence from synopsis`는 known 0의 근거가 아니다. 공식 홍보문이 말하지 않은 축은 `unknown`으로 유지했다.
6. 출처의 `independence`는 공식 출판사에는 `publisher-primary`, 정식 유통사에는 `licensed-secondary`, 사용자 리뷰에는 작성자별 `yes`로 기록했다. 범위가 불명확한 리뷰는 독립 작성자라도 entry evidence로 승격하지 않았다.
7. 아래의 proposed cell은 Pass C 후속 adjudication 후보일 뿐이며, 이 문서 자체가 최종 promotion 승인 문서는 아니다.

## Residual matrix

Pass C 당시의 순서, 현재 상태, 이번 조사에서 확인한 후보를 요약한다.

| # | canonical title | current Narrative | current Tone | current Genre | current Theme | Pass C gap | recovery result |
|---:|---|---|---|---|---|---|---|
| 21 | アンデッドアンラック | U/U/U/2/2/2 | 2/2/U/2/U/U/U | action;fantasy | combat:2 | N +1, T +2 | `problemSolving=2`, `comedy=2`, `emotionalWarmth=2` 후보. 범위가 명확하지 않은 리뷰 때문에 확정 보류 |
| 22 | 俺物語！！ | U/U/U/2/U/U | 2/2/U/U/U/4/U | comedy;romance | 없음 | Theme +1, N +3, T +2 | `school:1`, `comedy=2`는 공식 1–3권으로 유력. N은 미충족 |
| 23 | お茶にごす。 | 2/U/U/2/U/U | 4/2/U/U/U/2/U | comedy;sliceOfLife | school:2 | N +2, T +2 | `characterArcWeight=2`, `worldBuilding=2`, `comedy=2`, `emotionalWarmth=2` 후보. 공식 전자판과 종이판 경계 유지 |
| 24 | 黒月のイェルクナハト | U/U/U/2/U/U | 2/2/U/U/U/4/U | action;fantasy;romance | combat:2 | N +3, T +2 | `progression=2`, `worldBuilding=2`, `mentalStress=2`, `emotionalWarmth=2` 후보. 홍보문 한계 기록 |
| 25 | ルックバック | U/U/U/U/U/U | 4/2/U/U/U/U/2 | sliceOfLife | crafting:2 | N +4, T +2 | `progression=2`, `pacing=2` 후보뿐. 단편 공식 개요로는 gate 미충족 |
| 26 | 夢中さ、きみに。 | U/U/U/U/U/U | U/U/2/U/U/U/U | comedy;sliceOfLife | school:2 | N +4, T +4 | 공식 보도자료는 학교·개그·우정을 확인하지만 Axis 4개를 만들 정도의 지속 근거 없음 |
| 27 | 異世界おじさん | U/U/U/2/2/2 | 2/2/2/U/U/2/2 | fantasy;comedy;sliceOfLife | adventure:1 | N +1 | `problemSolving=2` 후보. vol.2의 생계 적응과 사용자 관찰은 보조적으로 일치하나 review 범위 불명 |
| 28 | 思い、思われ、ふり、ふられ | U/U/U/2/2/U | 4/4/U/U/2/4/2 | sliceOfLife;romance | 없음 | Theme +1, N +2 | `school:1` 후보. 고교 setting은 확인되나 N 두 축은 미확정 |
| 29 | 式の前日 | U/U/U/U/U/U | U/U/U/U/U/U/2 | sliceOfLife | 없음 | Theme +1, N +4, T +4 | 단편집의 관계·가족 소재는 확인되나 공통 Theme/Axis로 승격할 직접 근거 부족 |
| 30 | さんすくみ | U/U/U/2/U/2 | 2/2/2/U/2/1/2 | comedy;sliceOfLife | workplace:2 | N +2 | `problemSolving=2` 후보. 직무·의식의 반복은 확인되나 progression/strategy는 미확정 |

## Work records

### 21 アンデッドアンラック

현재 값은 Narrative `U/U/U/2/2/2`, Tone `2/2/U/2/U/U/U`, Genre `action;fantasy`, Theme `combat:2`이다. 공식 1–3권으로 능력 조건, 조직 임무, 정체 공개가 이어지는 것은 확인되었지만 Pass C가 확정한 셀은 보존했다.

#### Primary evidence

- **集英社 アンデッドアンラック 1** — https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882310-2; published 2020-04-03; accessed 2026-08-25; scope: 일반판 1권, representative ISBN `9784088823102`; direct observation: 불운 때문에 고립된 風子가 불사에 가까운 Andy를 만나고, 접촉으로 그를 끝낼 수 있다는 조건 때문에 동행을 시작한다. 능력의 조건과 공동 목표가 초반 사건의 동력이다; limit: 능력 사용 빈도, 해결 방식의 반복, 코미디·따뜻함의 비중은 확인하지 않는다.
- **集英社 アンデッドアンラック 2** — https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882330-0; published 2020-06-04; accessed 2026-08-25; scope: 일반판 2권; direct observation: 두 주인공이 추적하던 조직에 들어가고 10명의 Negator 자리를 얻기 위해 적과 싸운다. 추적이 팀·조직·임무 구조로 확장된다; limit: 전투가 분석적 문제해결인지, 장기 전략인지, 반복 코미디인지 수치화하지 않는다.
- **集英社 アンデッドアンラック 3** — https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882404-8; published 2020-09-04; accessed 2026-08-25; scope: 일반판 3권; direct observation: Andy 안의 Victor가 드러나고 조직 구성원이 모이며, 風子가 Unluck으로 Andy를 되돌리려는 대결이 이어진다; limit: 요약문만으로 장면 비중·정서 강도·시각 요소를 판단하지 않는다.

#### Supplemental review evidence

- **古見, CMOA title review** — https://www.cmoa.jp/title/195846/; posted 2024-01-24; accessed 2026-08-25; scope: title page review이며 읽은 권수 미기재; independent: yes, author has separate review history; direct observation (paraphrase): 초반부터 복선이 여러 곳에 놓이고 뒤에서 풀린다고 관찰한다; limit: entry boundary가 명시되지 않아 `mysteryReveal`은 이미 공식 근거로 확정한 2를 넘겨 올리는 데 사용하지 않는다.
- **まな, CMOA title review** — https://www.cmoa.jp/title/195846/; posted 2024-01-13; accessed 2026-08-25; scope: title page review, read range not stated; independent: yes, separate author; direct observation (paraphrase): 능력의 제약을 보고 다음 전투에서 어떻게 활용할지 예상하며, 인물들이 서로 돕는 흐름을 관찰한다; limit: series-level 가능성이 있어 entry-scoped evidence로 승격하지 않는다.

#### Proposed cells and decision

| field | proposed cell | basis | confidence / limit |
|---|---|---|---|
| `problemSolving` | 2 | 공식 1–3권의 능력 조건·팀 임무와 두 독립 리뷰의 제약 활용 관찰이 같은 방향 | `medium-low`; 리뷰 범위가 불명확하고 공식 개요만으로 반복적 분석 과정의 비중을 확정하기 어려움 |
| `comedy` | 2 | 두 리뷰가 전투와 개그·관계의 병치를 관찰 | `low`; 두 리뷰 모두 title-level이며 공식 권 소개는 코미디 비중을 직접 명시하지 않음 |
| `emotionalWarmth` | 2 | 공식 3권의 구출 목표 및 리뷰의 상호 지원 관찰 | `low`; 전투·죽음 표현이 함께 있고 review 범위가 entry로 고정되지 않음 |

`strategy`, `progression`, `mentalStress`, `romance`는 근거가 부족하다. 위 세 후보를 곧바로 적용해도 Narrative/Tone gate를 안정적으로 충족하지 못하므로 final cell은 미적용, 추가 adjudication 대상으로 남긴다.

### 22 俺物語！！

현재 값은 Narrative `U/U/U/2/U/U`, Tone `2/2/U/U/U/4/U`, Genre `comedy;romance`, Theme 없음이다. 공식 1–3권은 고교생, 친구 관계, 연애와 돌발 상황을 반복적으로 명시한다.

#### Primary evidence

- **集英社 俺物語！！ 1** — https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-846756-6; published 2012-03-23; accessed 2026-08-25; scope: 일반판 1권, representative ISBN `9784088467566`; direct observation: 고교생 猛男가 전철에서 凛子를 구하며 친구 砂川와 함께 관계의 출발점에 선다; limit: 코미디와 로맨스의 실제 분량은 소개만으로 수치화하지 않는다.
- **集英社 俺物語！！ 2** — https://www.shueisha.co.jp/books/items/contents.html?jdcn=08846817846756315501; published 2012-08-24; accessed 2026-08-25; scope: 일반판 2권; direct observation: 커플 관계가 성립한 뒤 친구가 마련한 만남과 현장 사건이 이어진다; limit: 신체적 대응의 반복성은 미확인.
- **集英社 俺物語！！ 3** — https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-846896-9; published 2013-02-25; accessed 2026-08-25; scope: 일반판 3권; direct observation: 고교생 커플의 소풍, 고립, 귀가 과정과 감정적 긴장이 이어진다; limit: ‘첫날 밤’의 표현 수위·지속성은 판정하지 않는다.
- **コミックシーモア 俺物語！！ 1** — https://www.cmoa.jp/title/61275/; published year not shown consistently on the accessed product block; accessed 2026-08-25; scope: vol.1 product block; direct observation: 상품 분류와 소개가 학원·연애·코미디와 고교생 관계를 함께 명시한다; source class: licensed retailer metadata, not publisher; limit: Genre 보조 확인일 뿐 Axis 근거로 단독 사용하지 않는다.

#### Supplemental review evidence

- **まこ, CMOA review** — https://www.cmoa.jp/title/61275/; posted 2013-07-23; accessed 2026-08-25; scope: vol.1 product page review; independent: yes; direct observation (paraphrase): 고교생 주인공의 연애 시작과 표정 중심의 개그·설렘을 구체적으로 언급한다; limit: 권수 범위는 리뷰에 명시되지 않아 공식 1–3권을 보조할 뿐이다.
- **やお, CMOA community review** — https://www.cmoa.jp/community/review/good/3441804/?ret_url=%2Ftitle%2Fcustomer_review%2Ftitle_id%2F61275%2Fvol%2F1%2Fpage%3D2; posted 2023-04-18; accessed 2026-08-25; scope: vol.1 backlink, review text itself read range not stated; independent: yes; direct observation (paraphrase): 凛子를 구한 뒤 교제가 시작되고 에피소드마다 연애 감정이 커진다고 본다; limit: entry-scoped review로 확정할 수 없어 `romance` 재평가에 사용하지 않는다.

#### Proposed cells and decision

| field | proposed cell | basis | confidence / limit |
|---|---|---|---|
| Theme `school` | 1 | 공식 1–3권 모두 고교생의 통학·친구 모임·소풍을 사건 범위로 제시; 상품 metadata도 학원으로 표시 | `medium-high`; school은 반복 setting이지만 학교 제도 자체가 중심인지는 아니므로 centrality 1만 제안 |
| `comedy` | 2 | 1권 공식 소개의 순정 코미디 표기와 2명의 독립 리뷰의 개그·설렘 관찰 | `medium`; 리뷰 범위 제한 때문에 공식 1–3권과 결합한 보조 근거로만 사용 |
| `emotionalWarmth` | 2 | 친구·연인·구조 행동이 1–3권에 반복 | `low-medium`; 공식 개요는 관계의 따뜻함보다 사건을 압축하므로 Pass C의 warmth 4를 올리지는 않음 |

`progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`은 직접 근거가 없다. Theme와 comedy 후보를 적용해도 Narrative gate는 충족하지 않는다.

### 23 お茶にごす。

현재 값은 Narrative `2/U/U/2/U/U`, Tone `4/2/U/U/U/2/U`, Genre `comedy;sliceOfLife`, Theme `school:2`이다. 판본은 공식 전자 페이지와 frozen 대표 종이 ISBN이 다르므로 edition limit을 유지한다.

#### Primary evidence

- **小学館コミック 1** — https://e-comi.shogakukan.co.jp/books/091211680000d0000000; published 2014-08-25 (전자판; frozen paper 2007-08-10); accessed 2026-08-25; scope: 전자판 1권, paper bridge `9784091211682`; direct observation: 폭력으로 불린 학생이 평온을 얻으려 다도부에 들어가고 친절해지는 방법을 고민한다; limit: 전자판과 종이판의 content/ISBN 대응은 identity 검토에서 유지.
- **小学館コミック 2** — https://shogakukan-comic.jp/book?jdcn=091212160000d0000000; published 2014-08-25 (전자판; paper bridge `9784091212160`); accessed 2026-08-25; scope: 전자판 2권; direct observation: 차를 마시는 방법, 미닫이문, 정좌 등 다도 절차를 익히고 부장과 보내는 시간이 늘며 폭력 없는 생활을 이어간다; limit: 홍보문의 ‘폭력 없음’은 known 0 근거가 아니다.
- **小学館コミック 3** — https://shogakukan-comic.jp/book?jdcn=091212900000d0000000; published 2014-08-25 (전자판; paper bridge `9784091212900`); accessed 2026-08-25; scope: 전자판 3권; direct observation: 다도부에 라이벌이 등장하고 부장을 둘러싼 감정의 긴장이 추가된다; limit: 경쟁·로맨스의 비중과 지속성은 개요만으로 수치화하지 않는다.
- **コミックシーモア お茶にごす。** — https://www.cmoa.jp/title/77388/; published year not relied on; accessed 2026-08-25; scope: vol.1 retailer product block; direct observation: 다도부·학원·인간드라마·개그/코미디 metadata와 평온·친절 전제를 반복; source class: licensed retailer metadata; limit: official source를 대체하지 않는다.

#### Supplemental review evidence

- **FFumi, comic review** — https://ffumilog.com/2024/05/20/comic-review-14/; posted 2024-05-20; accessed 2026-08-25; scope: review is series-oriented; independent: yes; direct observation (paraphrase): 다도 예절·정좌·인사와 친구를 위해 행동하는 에피소드가 관계 변화와 함께 언급된다; limit: 첫 1–3권에 한정되었다고 명시하지 않아 보조 lead로만 기록.
- **CMOA title review block** — https://www.cmoa.jp/title/77388/; posted date varies by author; accessed 2026-08-25; scope: product/title review block, exact read range not shown; independent: multiple authors, but individual bounds unclear; direct observation: 다도부와 친절·감정 변화를 반복 관찰하는 리뷰가 검색되었다; limit: entry-scoped 독립 리뷰 2건으로 확정할 수 없으므로 값을 리뷰 다수결로 만들지 않는다.

#### Proposed cells and decision

| field | proposed cell | basis | confidence / limit |
|---|---|---|---|
| `characterArcWeight` | 2 | 1권의 폭력에서 벗어나려는 목적, 2권의 차·예절 습득과 관계 변화, 3권의 관계 긴장이 연결됨 | `medium`; 인물 변화의 장기 보상까지는 1–3권 소개만으로 확정하지 않음 |
| `worldBuilding` | 2 | 다도 절차와 도구·예절이 1–2권의 행동 제약으로 반복 | `medium-low`; tea practice가 기능적 설정으로 충분한지 adjudication 필요 |
| `comedy` | 2 | 공식 장르 metadata/소개와 retailer lead가 일치 | `medium`; metadata만으로 극단값 4를 만들지 않음 |
| `emotionalWarmth` | 2 | 친절을 배우는 목표, 동아리 동료와 보내는 시간, 관계를 둘러싼 감정이 반복 | `medium-low`; direct page summaries are promotional and user reviews are not entry-bounded |

`problemSolving`, `strategy`, `mysteryReveal`는 다도 습득이나 경쟁을 곧바로 문제 해결·전략·미스터리로 해석하지 않아 `unknown` 유지 후보다. 위 셀은 판본 경계 확인 후 adjudication한다.

### 24 黒月のイェルクナハト

현재 값은 Narrative `U/U/U/2/U/U`, Tone `2/2/U/U/U/4/U`, Genre `action;fantasy;romance`, Theme `combat:2`이다.

#### Primary evidence

- **講談社 1** — https://www.kodansha.co.jp/comic/products/0000415577; published 2025-07-16; accessed 2026-08-25; scope: 일반판 1권, representative ISBN `9784065400753`; direct observation: 무직 18세 주인공이 비인간 여성과 만나 결혼하거나 죽는 선택을 받고, 신화적 전투 로맨스가 시작된다; limit: 강압·죽음 표현은 safety lead이며 성인물 근거가 아니다.
- **講談社 2** — https://www.kodansha.co.jp/comic/products/0000419091; published 2025-10-17; accessed 2026-08-25; scope: 일반판 2권; direct observation: 주인공이 재앙의 사자를 쓰러뜨린 뒤 힘의 부족을 깨닫고 실전 훈련을 시작한다; limit: 훈련이 장기 성장 보상으로 계속되는지는 미확인.
- **講談社 3** — https://www.kodansha.co.jp/comic/products/0000424213; published 2026-02-17; accessed 2026-08-25; scope: 일반판 3권; direct observation: 비인간 동거 집단, 적대 조직의 납치, 구출 전투와 목욕·세탁·식사 루틴이 이어진다; limit: 전투와 일상 비중 및 관계의 합의 맥락은 개요만으로 확정하지 않는다.

#### Supplemental review evidence

- **tak, CMOA title review** — https://www.cmoa.jp/title/328298/; posted 2025-10-05; accessed 2026-08-25; scope: title/vol.1 product page review, read range not stated; independent: yes; direct observation (paraphrase): 초기의 소극적인 주인공이 상대와 맞추기 위해 노력하고 전투·관계 설정이 함께 전개된다고 본다; limit: entry range 불명으로 progression을 공식 2권 근거 이상으로 올리지 않는다.
- **時雨, CMOA title review** — https://www.cmoa.jp/title/328298/; posted 2025-10-30; accessed 2026-08-25; scope: title review, read range not stated; independent: yes; direct observation (paraphrase): 인간과 비인간 인물의 상호작용 및 주인공의 능력·위험 감지를 관찰한다; limit: 구체적 1–3권 경계가 없어 worldBuilding/strategy 확정 근거로 사용하지 않는다.

#### Proposed cells and decision

| field | proposed cell | basis | confidence / limit |
|---|---|---|---|
| `progression` | 2 | 2권에서 힘 부족을 인식하고 실전 훈련으로 이동 | `medium`; 단일 훈련 lead로 장기 성장 4를 만들지 않음 |
| `worldBuilding` | 2 | 비인간 존재, 재앙의 사자, 적대 회사, 동거 집단이 1–3권에서 반복 | `medium`; 설정이 기능적으로 반복되지만 체계의 범위는 미확인 |
| `mentalStress` | 2 | 결혼 또는 죽음이라는 생존 조건과 3권 납치·구출이 직접 제시됨 | `medium-low`; 긴장 사건과 지속적인 심리 압박을 구분해야 함 |
| `emotionalWarmth` | 2 | 구출 행동 뒤 공동생활의 목욕·세탁·식사 루틴이 반복적으로 제시됨 | `low-medium`; 홍보문이 관계의 내면을 설명하지 않아 4로 올리지 않음 |

이 후보들은 Narrative 3개와 Tone 2개를 더하지만, 실제 적용 전 safety/context와 공식 1–3권 범위의 재확인이 필요하다. `problemSolving`, `strategy`, `mysteryReveal`은 추측하지 않는다.

### 25 ルックバック

현재 값은 Narrative 전부 `U`, Tone `4/2/U/U/U/U/2`, Genre `sliceOfLife`, Theme `crafting:2`다. 2·3권이 없는 one-shot이므로 유일한 단편의 전체 범위를 entry로 기록하되, 짧은 공식 개요로 축을 과잉 생성하지 않는다.

#### Primary evidence

- **集英社 ルックバック** — https://www.shueisha.co.jp/books/items/contents_amp.html?jdcn=08X10000000016342800; published 2021-09-03; accessed 2026-08-25; scope: one-shot, representative ISBN `9784088827827`; direct observation: 藤野와 京本이 만화 그리기로 연결되고 시간이 흐르며 한 사람이 다른 사람을 지지한다; limit: 단일 개요로 사건 해결·세계 규칙·미스터리의 지속성을 판단할 수 없다.

#### Supplemental review evidence

- **既読メモル, CMOA review** — https://www.cmoa.jp/title/228750/; posted 2022-04-23; accessed 2026-08-25; scope: one-shot product review; independent: yes; direct observation (paraphrase): 두 인물이 공통의 만화 제작을 통해 만난다는 점을 관찰한다; limit: one-shot 전체를 읽었다는 것은 보이지만 별도 장면 범위와 축별 관찰은 충분하지 않다.
- **矢口恭平, CMOA review** — https://www.cmoa.jp/title/228750/; posted 2024-12-05; accessed 2026-08-25; scope: one-shot product review; independent: yes; direct observation (paraphrase): 과거를 돌아보는 구조와 인생의 전환점을 언급한다; limit: 결말·전체 감상에 의존하며 공식 개요에 없는 세부를 known 값으로 만들지 않는다.

#### Proposed cells and decision

| field | proposed cell | basis | confidence / limit |
|---|---|---|---|
| `progression` | 2 | 공식 개요의 만화 제작과 시간 경과, 두 독립 리뷰의 공통 제작·회고 관찰 | `low-medium`; 단편의 시간 이동이 Factor의 성장 보상 구조와 동일한지 adjudication 필요 |
| `pacing` | 2 | 단편 안에서 제작 관계와 시간 경과가 연결됨 | `low`; pacing은 빠른 목표·상태 변화가 반복된다는 정의이므로 단순히 단편이라는 이유로 known 처리하지 않음 |

추가 Narrative 2개와 Tone 2개를 만들 자료가 없다. `mysteryReveal`은 공식 소개가 공개하지 않는 장치나 반전을 제목·기억으로 추론하지 않고, `problemSolving`, `strategy`, `worldBuilding`도 `unknown`으로 남긴다. 따라서 승격 후보가 아니다.

### 26 夢中さ、きみに。

현재 값은 Narrative 전부 `U`, Tone `U/U/2/U/U/U/U`, Genre `comedy;sliceOfLife`, Theme `school:2`다. 8개의 단편을 묶은 단권 collection이며 일반적인 1–3권 연재 작품으로 확장하지 않는다.

#### Primary evidence

- **KADOKAWA 상품 페이지** — https://www.kadokawa.co.jp/product/321904000716/; published 2019-08-10; accessed 2026-08-25; scope: collection one volume, ISBN `9784047357181`, 168쪽; direct observation: 8개 단편으로 구성됨; limit: 개별 단편의 축별 반복성은 상품 페이지에서 확인하지 않는다.
- **KADOKAWA press PDF** — https://group.kadokawa.co.jp/documents/topics/20200428_k43ef.pdf; published 2020-04-28; accessed 2026-08-25; scope: collection 전체; direct observation: Hayashi 4편과 Nikaido 4편, 학교 남학생들, 비정상적으로 어긋난 유머, 우정·표정의 재미를 작품 특징으로 소개한다; limit: 보도자료는 작품 소개이지 6개 Narrative 축의 직접 장면 근거가 아니다.

#### Supplemental review evidence

- **Kansou blog review** — https://www.kansou-blog.jp/entry/2019/08/13/200648; posted 2019-08-13; accessed 2026-08-25; scope: collection 전체; independent: yes; direct observation (paraphrase): 대화의 미묘한 어긋남과 남학생 관계의 거리를 관찰한다; limit: 단권 전체 감상이므로 first-major-episode 단위로 축을 분리하지 않는다.
- **Lomico editorial review** — https://lomico.jp/review/598/; published year shown in accessed page/search metadata, exact day not relied on; accessed 2026-08-25; scope: collection; independent: editorial, not user review; direct observation (paraphrase): 학교 남학생들의 초현실적 대화와 친구 관계를 설명한다; limit: user-review quorum이 아니며 Factor 값을 대신하지 않는다.

#### Proposed cells and decision

공식 자료와 보조 리뷰는 school/comedy/관계의 존재에는 수렴하지만, `relationshipStructure=2` 또는 `characterArcWeight=2`를 확정할 만큼 동일한 entry-scoped 반복 관찰 2건은 확보하지 못했다. Narrative는 `pacing=2`조차 단편집의 짧은 형식을 빠른 pacing으로 오해할 수 있어 제안하지 않는다. 모든 미확인 Narrative와 Tone은 `unknown` 유지, 최종 상태는 미승격이다.

### 27 異世界おじさん

현재 값은 Narrative `U/U/U/2/2/2`, Tone `2/2/2/U/U/2/2`, Genre `fantasy;comedy;sliceOfLife`, Theme `adventure:1`이다. Pass C가 남긴 단일 Narrative gap은 `problemSolving` 후보로만 검토했다.

#### Primary evidence

- **KADOKAWA 異世界おじさん 1** — https://www.kadokawa.co.jp/product/321808000769/; published 2018-11-21; accessed 2026-08-25; scope: 일반판 1권, representative ISBN `9784040653686`; direct observation: 오랜 혼수에서 돌아온 삼촌이 조카와 동거하며 이세계 경험을 들려주는 현재/이세계 교차 구조가 시작된다; limit: 실용적 해결 방식의 반복은 1권 소개만으로 확정하지 않는다.
- **KADOKAWA 異世界おじさん 2** — https://www.kadokawa.co.jp/product/321901000234/; published 2019-04-22; accessed 2026-08-25; scope: 일반판 2권; direct observation: 삼촌이 YouTube로 생계를 만들고, 이세계 기억을 현재 생활에 연결하며 주변 인물이 늘어난다; limit: YouTube 생계가 전략적 운영인지 단순 설정인지 구분해야 한다.
- **KADOKAWA 異世界おじさん 3** — https://www.kadokawa.co.jp/product/321906000326/; published 2019-10-21; accessed 2026-08-25; scope: 일반판 3권; direct observation: 이세계 첫날의 기억을 되짚고 충격적인 사실이 드러난다; limit: 미스터리 2는 이미 Pass C에서 확정했으며 이 자료로 추가 축을 만들지 않는다.

#### Supplemental review evidence

- **ごはんつぶ, CMOA review** — https://www.cmoa.jp/title/162381/; posted 2020-12-15; accessed 2026-08-25; scope: title page review, read range not stated; independent: yes; direct observation (paraphrase): 현재와 이세계를 오가는 구성, 마법을 배달비 절감·외출에 활용하는 실용적 장면, 그 결과가 개그가 되는 구조를 관찰한다; limit: 범위 불명이라 official vol.2를 보조할 뿐이다.
- **ナリさん, CMOA review** — https://www.cmoa.jp/title/162381/; posted 2021-10-01; accessed 2026-08-25; scope: title page review, read range not stated; independent: yes; direct observation (paraphrase): 사건과 조카의 해설, 과거 문화·마법을 현재에 적용하는 개그 구조를 관찰한다; limit: entry boundary가 없어 독립 review quorum을 known 확정에 직접 사용하지 않는다.

#### Proposed cell and decision

| field | proposed cell | basis | confidence / limit |
|---|---|---|---|
| `problemSolving` | 2 | 공식 vol.2의 YouTube 생계 전환과, 두 독립 리뷰가 공통으로 관찰한 마법의 비용·생활 문제 적용 | `medium`; 제약 분석과 기발한 해결의 반복이 실제 1–3권 전체에서 중심인지 추가 entry check 필요 |

`strategy`와 `progression`은 생계·이세계 경험만으로 자동 추론하지 않는다. 문제 해결 후보를 적용하더라도 N은 4/6에서 멈추므로 추가 known을 억지로 만들지 않는다.

### 28 思い、思われ、ふり、ふられ

현재 값은 Narrative `U/U/U/2/2/U`, Tone `4/4/U/U/2/4/2`, Genre `sliceOfLife;romance`, Theme 없음이다.

#### Primary evidence

- **集英社 1** — https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-845467-2; published 2015-10-13; accessed 2026-08-25; scope: 일반판 1권, representative ISBN `9784088454672`; direct observation: 네 명의 고교 1학년이 같은 학교·아파트 생활권에서 우정과 사랑의 관계를 시작한다; limit: school은 setting인지 중심 Theme인지 1–3권 교차 확인이 필요하다.
- **集英社 2** — https://www.shueisha.co.jp/books/items/contents.html?jdcn=08845528845467315501&rf=hr; published 2016-02-25; accessed 2026-08-25; scope: 일반판 2권, source ISBN `9784088455280`; direct observation: 네 인물의 감정 사슬과 숨겨진 비밀이 행동을 통해 드러난다; limit: mystery 2는 이미 확정했고, 비밀을 문제 해결이나 세계 설정으로 전환하지 않는다.
- **集英社 3** — https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-845596-9&mode=1; published 2016-06-24; accessed 2026-08-25; scope: 일반판 3권; direct observation: 같은 고교 생활권에서 네 인물의 관계와 비밀 후속 전개가 이어진다; limit: 학교 제도·활동 자체의 중심성은 별도 증거가 없다.
- **コミックシーモア product block** — https://www.cmoa.jp/title/105424/; published year not relied on; accessed 2026-08-25; scope: vol.1/2 product summaries; direct observation: 고교 1학년, 같은 학교·아파트, 연애와 비밀을 metadata/상품 소개로 재확인; source class: licensed retailer; limit: metadata는 Theme 후보 보조일 뿐이다.

#### Supplemental review evidence

이번 회수에서는 title-level reviews를 확인했지만, 읽은 범위와 고교 초반 1–3권이 함께 명시된 독립 리뷰 2건을 확보하지 못했다. 따라서 제안 dictionary cell은 `school:1` 하나이며, 유저평은 school Theme 또는 Narrative의 직접 근거로 사용하지 않는다.

#### Proposed cell and decision

| field | proposed cell | basis | confidence / limit |
|---|---|---|---|
| Theme `school` | 1 | 공식 1–3권 모두 고교생·통학·학교·같은 생활권을 직접 제시 | `medium-high`; 학교가 관계의 무대이므로 centrality 1, 학교 제도 자체가 주요 보상이라는 2는 아님 |

`progression`, `problemSolving`, `strategy`, `worldBuilding`은 공식 개요에 직접 관찰이 없어 `unknown` 유지한다. 관계와 로맨스가 있다는 사실을 Narrative 값으로 재사용하지 않는다.

### 29 式の前日

현재 값은 Narrative 전부 `U`, Tone `U/U/U/U/U/U/2`, Genre `sliceOfLife`, Theme 없음이다. one-volume short-story collection으로 조사했다.

#### Primary evidence

- **小学館 式の前日 collection** — https://shogakukan-comic.jp/book?jdcn=091345850000d0000000; published 2013-01-01 (전자 listing; frozen paper ISBN `9784091345851`, paper 2012-09-10); accessed 2026-08-25; scope: collection one volume; direct observation: 쌍둥이·부모와 자녀·약혼한 두 사람 등 여러 2인 관계를 다루는 단편집으로 소개된다; limit: 서로 다른 단편의 소재를 하나의 Theme 또는 공통 Narrative로 합치지 않는다.

#### Supplemental review evidence

- **BookLive review list** — https://booklive.jp/review/list/title_id/205643/vol_no/001; posted review dates include 2015-01-25 and 2015-11-29; accessed 2026-08-25; scope: one-volume collection; independent: multiple users; direct observation (paraphrase): 가족 관계, 감정적 여운, 단편별 반전이 언급된다; limit: 반전·감정은 작품별 관찰이며 collection-wide `mysteryReveal`이나 `foundFamily`의 centrality를 만들지 않는다.
- **Sony/ebookstore review** — https://ebookstore.sony.jp/review/title/10074712/id/LT000007099000286252/?sort=-like; posted years/dates vary by reviewer; accessed 2026-08-25; scope: one-volume collection; independent: yes, separate readers; direct observation (paraphrase): 단편별 가족·관계와 여운을 언급한다; limit: 리뷰 범위는 단권 전체이며 공통 반복 구조를 정량화할 수 없다.

#### Decision

가족이 나온다는 이유로 `foundFamily`를 붙이지 않았다. 부모·자녀와 쌍둥이는 found family가 아니며, 약혼 관계도 동일 Theme가 아니다. 단편마다 다른 관계를 다루므로 `relationshipStructure`, `characterArcWeight`, `mysteryReveal`을 알려진 값으로 확정할 entry-scoped 직접 근거가 없다. 제안 dictionary cell은 없음이며, 모든 잔여 셀은 `unknown` 유지한다.

### 30 さんすくみ

현재 값은 Narrative `U/U/U/2/U/2`, Tone `2/2/2/U/2/1/2`, Genre `comedy;sliceOfLife`, Theme `workplace:2`다. 공식 전자 페이지와 frozen 종이 ISBN의 edition limit을 유지한다.

#### Primary evidence

- **小学館 さんすくみ 1** — https://shogakukan-comic.jp/book?jdcn=091334600000d0000000; published 2013-01-01 listing date; accessed 2026-08-25; scope: 전자 listing 1권, paper bridge `9784091334602`; direct observation: 신사·절·교회의 후계자 세 명이 종교법인의 기쁨과 고충, 실패가 허용되지 않는 의식과 후계 압력을 겪는다; limit: 직무 문제가 실제 분석적 해결 과정인지 구분해야 한다.
- **小学館 さんすくみ 2** — https://shogakukan-comic.jp/book?jdcn=091338140000d0000000; published 2013-01-01 listing date; accessed 2026-08-25; scope: 전자 listing 2권; direct observation: 우정과 일의 부담이 계속되고, gagaku·의식·정화·사슴 문제와 마찰이 이어진다; limit: ‘일이 많다’는 사실만으로 progression이나 strategy를 만들지 않는다.
- **小学館 さんすくみ 3** — https://shogakukan-comic.jp/book?jdcn=091341120000d0000000; published 2013-01-01 listing date; accessed 2026-08-25; scope: 전자 listing 3권; direct observation: 기공식 문제, 불교 순회, 교회 훈련과 인물 간 사건이 직무 배경의 개그 에피소드로 이어진다; limit: 사건 해결의 지략 수준·직업 숙련 보상은 개요만으로 판단하지 않는다.
- **コミックシーモア さんすくみ** — https://www.cmoa.jp/title/54451/; published year not relied on; accessed 2026-08-25; scope: vol.1 product block with vol.1–4 summaries; direct observation: 세 후계자의 종교법인 업무와 의식의 실수·사건이 반복됨을 retailer summary가 재확인; source class: licensed retailer; limit: 공식 전자 listing을 대체하지 않는다.

#### Supplemental review evidence

- **月と海, CMOA review** — https://www.cmoa.jp/title/54451/; posted 2020-01-04; accessed 2026-08-25; scope: title/vol.1 product review, read range not stated; independent: yes; direct observation (paraphrase): 종교법인 후계자들의 직업적 ‘있는ある’와 사건을 코미디로 관찰한다; limit: 범위 불명으로 problem solving의 entry quorum에 단독 사용하지 않는다.
- **spailallife, CMOA review** — https://www.cmoa.jp/title/54451/; posted 2013-07-15; accessed 2026-08-25; scope: title/vol.1 product review, read range not stated; independent: yes; direct observation (paraphrase): 세 후계자의 우정과 에피소드 단위 사건, 서로 돕는 흐름을 관찰한다; limit: title-level 범위이며 official 1–3권과 일치하는 보조 lead일 뿐이다.

#### Proposed cells and decision

| field | proposed cell | basis | confidence / limit |
|---|---|---|---|
| `problemSolving` | 2 | 1–3권에서 의식·직무·작은 사고에 대응하는 에피소드가 반복되고, 두 독립 리뷰도 사건/협업을 구체적으로 관찰 | `low-medium`; 리뷰 범위가 명시되지 않았고 공식 요약은 해결 과정의 분석 정도를 말하지 않음 |

`progression=2`는 후계 압력과 훈련만으로 확정하지 않는다. `strategy`도 장기 계획·자원 운영의 근거가 없다. problemSolving 후보 하나로는 Narrative gate에 도달하지 않으므로 final cell은 adjudication 전까지 미적용이다.

## Recovery conclusion

- 공식 1–3권으로 가장 강하게 회수 가능한 후보는 22번 `school:1`, `comedy=2`, 23번의 `characterArcWeight=2`/`worldBuilding=2`/`comedy=2`/`emotionalWarmth=2`, 24번의 `progression=2`/`worldBuilding=2`/`mentalStress=2`/`emotionalWarmth=2`, 28번 `school:1`이다.
- 21번, 27번, 30번의 `problemSolving=2`는 공식 사건 구조와 보조 리뷰가 방향상 일치하지만, 리뷰의 정확한 entry 범위가 불명확하므로 낮은 신뢰도의 adjudication 후보로만 남긴다.
- 25번과 26번은 단편·단편집이라는 이유만으로 Narrative 값을 채우지 않았다. 29번도 서로 다른 단편의 가족·관계 소재를 `foundFamily` 또는 공통 Narrative로 합치지 않았다.
- 이번 회수에서 `strategy`, `mysteryReveal` 추가값, Narrative 4/6을 채우기 위한 추정값은 만들지 않았다. Tone 또한 공식 직접 관찰이 없는 축을 리뷰 다수결로 생성하지 않았다.
- 따라서 이 chunk에서 `recommendationVerified` 또는 `promotionBlocked` 상태를 변경할 근거는 없다. 후속 adjudication은 이 문서의 proposed cell을 공식 범위·판본과 대조한 뒤 적용해야 한다.
