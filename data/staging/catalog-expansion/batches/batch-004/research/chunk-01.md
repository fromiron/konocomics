# Batch 004 official-first text evidence research — chunk 01

- 대상: `batch-004/frozen-work-set.csv` position 1–10
- 조사일: 2026-08-25
- 평가 범위: 각 작품의 1–3권. 공식 권별 소개가 확인되지 않는 경우 확인된 권과 시리즈 소개의 범위를 분리해 적었다.
- 산출물 경계: 이 문서는 서지·정체성·공식 텍스트 사실의 evidence packet이다. Factor 값, Genre/Theme 분류, Art 값, eligibility, promotion, safety 판정은 지정하지 않는다.
- 출처 순서: publisher/rightsholder의 권별 페이지·보도자료 → 공식 award/jury comment → 공인 유통·서점의 서지 보조. `selection-provenance-only` 출처는 작품 선정 사실만 보조하며 작품 내용 근거로 쓰지 않는다.
- 인용 원칙: source URL과 날짜를 각 source record에 고정했다. `retrievedAt`은 모든 외부 출처에 `2026-08-25`를 사용했다. 공식 페이지에서 게시일이 노출되지 않으면 `undated`로 명시하고, 확인 가능한 도서 발매일을 별도로 적었다.
- 판본 원칙: frozen representative ISBN은 교체하지 않는다. 재판·문고판 ISBN은 별도 판본으로 기록한다.
- 제목 원칙: frozen set의 canonical title을 사용하고 장식용 `『』`는 포함하지 않는다.

## Source taxonomy

- `factor-evidence-primary`: publisher/rightsholder가 1–3권의 줄거리나 작품 소개를 직접 제공한 경우. 관찰된 텍스트 사실만 제한적으로 요약한다.
- `factor-evidence-secondary-lead`: 공식 jury/editorial text 또는 공인 distributor가 제공한 보조 단서. 권 범위·편집 여부를 확인하고 확정적 작품 판정으로 확장하지 않는다.
- `identity-edition-lead-only`: ISBN·발매월·저작권자·판본 정체성 확인만 가능한 출처.
- `selection-provenance-only`: 작품이 특정 award/selection 목록에 실렸다는 provenance. 내용 evidence로 사용하지 않는다.

## Target table

| position | workId                      | canonicalTitle         | frozen representative ISBN | confirmed entry scope                                            |
| -------: | --------------------------- | ---------------------- | -------------------------- | ---------------------------------------------------------------- |
|        1 | `work-025c8ab93483a39c9330` | ホストと社畜           | `9784575860016`            | 1–3권: 3권 공식 보도자료, 1권 공식 링크 및 서지 보조             |
|        2 | `work-098b1781e14365eea667` | うるわしの宵の月       | `9784065217771`            | 1–3권 공식 Kodansha 권별 페이지                                  |
|        3 | `work-0f3a44f5dcab9623d1be` | 応天の門               | `9784107717429`            | 1–3권 공식 Shinchosha 권별 페이지                                |
|        4 | `work-11d23966f22f777e95d0` | のらみみ               | `9784091884114`            | 1–3권 공식 Shogakukan e-comic 페이지; 발매일은 페이지에 미노출   |
|        5 | `work-132ce7172750a3b1fa53` | ヒナまつり             | `9784047273818`            | 1–3권 공식 KADOKAWA 권별 페이지                                  |
|        6 | `work-15dba4fdb46308ab45d7` | 駅から5分              | `9784088654393`            | 1–3권: 1권 원판 및 1–2권 공식 재수록 소개, 3권 서지 보조         |
|        7 | `work-188ba092c6195603bb3f` | つらつらわらじ         | `9784063729443`            | 1–3권: 1권 공식, 2권 공인 유통, 3권 공식 신간·서지               |
|        8 | `work-19c2017b33c07f48634e` | ふうらい姉妹           | `9784047268685`            | 1–3권 공식 KADOKAWA 권별 페이지                                  |
|        9 | `work-1a6ad6771865b43c8516` | それでも町は廻っている | `9784785926045`            | 1권·3권 공식 Shonen Gahosha, 2권은 시리즈 목록으로 정체성만 확인 |
|       10 | `work-1cdc6c5cca7c33fafe51` | 青空にとおく酒浸り     | `9784199501746`            | 1–3권 공인 서점·유통 서지; 공식 권별 줄거리 미확인               |

## workId: `work-025c8ab93483a39c9330` — ホストと社畜

### Source 1

- `sourceName`: 双葉社 / PR TIMES 공식 보도자료
- `sourceUrl`: https://prtimes.jp/main/html/rd/p/000000821.000014531.html
- `publishedAt`: 2025-09-25 (기사에 명시된 3권 발매일; 페이지 게시일 자체는 확인된 본문에 별도 표시되지 않음)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher press release
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 1–3권 중 3권 직접, 1–2권은 공식 링크로 식별
- `supportedClaims`: 3권은 새벽 5시 가부키초 규동집에서 샐러리맨 直人과 호스트 蓮이 만나는 장면으로 시작한다. 매일 아침 식사를 함께하는 15분이 두 사람에게 중요한 시간이 되고, 서로를 격려하고 요리·일상의 곤란을 돕는 관계가 이어진다. 둘은 친구도 연인도 아니며 서로 다른 생활 리듬 속에서 편안한 거리를 유지한다.
- `observation`: 보도자료는 3권 ISBN `9784575861389` 및 双葉社 Action Comics 발매를 명시하고, 1권·2권·3권의 双葉社 공식 상품 링크를 함께 제공한다. 공식 1권 링크는 frozen representative `9784575860016`과 대응한다.
- `limitation`: 확보한 공식 텍스트는 3권 중심이다. 1권·2권의 권별 본문은 공식 상품 링크의 동적 페이지에서 별도로 추출하지 못했으므로 3권의 관계 묘사를 1·2권 전체의 세부 사건으로 확장하지 않는다.

### Source 2

- `sourceName`: 双葉社 공식 도서 페이지 (1–3권 링크)
- `sourceUrl`: https://www.futabasha.co.jp/book/97845758600160000000?type=2 ; https://www.futabasha.co.jp/book/97845758607400000000?type=2 ; https://www.futabasha.co.jp/book/97845758613890000000?type=2
- `publishedAt`: 2024-08 (1권 발매월은 공인 서지와 일치; 2·3권 개별 페이지의 게시일은 동적 본문에서 미노출)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product pages
- `provenanceFactorClassification`: `identity-edition-lead-only`
- `evaluatedRange`: 1–3권 판본 식별
- `supportedClaims`: 双葉社 공식 페이지 경로가 1권 `9784575860016`, 2권 `9784575860740`, 3권 `9784575861389`를 각각 가리킨다.
- `observation`: frozen representative는 1권 ISBN이며, 3권 발매일은 공식 보도자료의 2025-09-25와 연결된다.
- `limitation`: 상품 페이지에서 추가 줄거리·안전 상세를 확인하지 못했으므로 출처의 정체성 역할만 사용한다.

### Source 3

- `sourceName`: 三洋堂書店 / Hanmoto 공인 서지
- `sourceUrl`: https://www.sanyodo.co.jp/lookup/products-detail?productcode=0100000000000007530880 ; https://www.hanmoto.com/bd/isbn/9784575860740
- `publishedAt`: 2024-08 (1권), 2025-04-10 (2권)
- `retrievedAt`: 2026-08-25
- `authorityClass`: bookseller/distributor catalog
- `provenanceFactorClassification`: `factor-evidence-secondary-lead`
- `evaluatedRange`: 1–2권 보조
- `supportedClaims`: 1권은 河尻みつる, 双葉社, ISBN `9784575860016`으로 식별된다. 2권 소개는 두 사람이 매일 아침 만나는 상태에서 直人의 건강검진 걱정과 蓮의 장래 고민을 서로 격려하는 흐름을 설명한다.
- `observation`: 연령·가치관·배경은 다르지만 함께 보내는 시간이 일상을 개선한다는 관계 단서가 있다.
- `limitation`: publisher 원문이 아닌 서지·유통 보조이며, Cmoa 등 일부 유통 페이지의 인물명 표기가 공식 보도자료와 달라 공식 보도자료의 이름을 우선한다.

**범위·안전 메모:** entry 텍스트에서 확인된 핵심은 가부키초의 호스트와 샐러리맨, 새벽 식사, 상호 격려라는 일상 관계다. 성인 직업 환경은 명시되지만 공식 요약만으로 성적 내용·폭력의 유무나 강도를 판정하지 않는다. 안전 판정이 아니라 확인 범위의 기록이다.

## workId: `work-098b1781e14365eea667` — うるわしの宵の月

### Source 1

- `sourceName`: 講談社 공식 도서 페이지 1권
- `sourceUrl`: https://www.kodansha.co.jp/comic/products/0000347553
- `publishedAt`: 2020-12-11 (단행본 발매일)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 1권
- `supportedClaims`: 고교 1학년 滝口宵는 아름답고 공부도 잘해 여자이지만 ‘왕자님’이라고 불린다. 자신이 소녀만화의 남자 주인공처럼 취급되는 데 복잡함을 느끼던 중, 같은 별명을 가진 市村 선배를 만난다. 처음에는 그가 자신이 기대한 왕자님 같지 않다고 느끼지만 관계가 시작된다.
- `observation`: Dessert 연재작으로 표기되며 ISBN은 frozen representative `9784065217771`이다.
- `limitation`: 공식 소개는 인물의 첫 만남과 학교 로맨스의 출발점까지만 설명하므로 이후 관계의 결론이나 갈등 강도는 주장하지 않는다.

### Source 2

- `sourceName`: 講談社 공식 도서 페이지 2권
- `sourceUrl`: https://www.kodansha.co.jp/comic/products/0000351649
- `publishedAt`: 2021-05-13
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 2권
- `supportedClaims`: 市村의 도움 이후 宵의 감정이 변하고, 宵는 그와 시험 교제를 시작한다. 공식 소개는 두 ‘왕자님’의 서툰 사랑 이야기로 관계 변화를 요약한다.
- `observation`: ISBN `9784065232798`, Dessert 단행본으로 식별된다.
- `limitation`: 시험 교제의 구체적 사건과 인물 외부의 안전 이슈는 공식 요약에 없다.

### Source 3

- `sourceName`: 講談社 공식 도서 페이지 3권
- `sourceUrl`: https://www.kodansha.co.jp/comic/products/0000356350
- `publishedAt`: 2021-11-12
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 3권
- `supportedClaims`: 시험 교제가 시작된 뒤 宵는 경계하면서도 자신의 감정 변화를 알아차리고, 市村도 宵의 중요성을 깨닫는다. 아르바이트 장소에서 또 다른 ‘왕자님’을 만나며 관계가 진전된다.
- `observation`: ISBN `9784065256800`, 3권 발매일 및 권별 소개를 공식 페이지에서 확인했다.
- `limitation`: ‘왕자님’은 공식 소개의 호칭이며 성별 역할이나 작품 전체의 Theme로 재분류하지 않는다.

**범위·안전 메모:** 1–3권에서 확인된 것은 고등학생 등장인물의 호칭·학교생활·시험 교제와 감정 변화다. 공식 소개에는 명시적 폭력·성적 사건이 없지만, 이를 전 권의 부재로 해석하거나 안전 판정으로 사용하지 않는다. frozen ISBN은 1권 공식 ISBN과 일치한다.

## workId: `work-0f3a44f5dcab9623d1be` — 応天の門

### Source 1

- `sourceName`: 新潮社 공식 도서 페이지 1권
- `sourceUrl`: https://www.shinchosha.co.jp/book/771742/
- `publishedAt`: 2014-04-09
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 1권
- `supportedClaims`: 헤이안 시대를 배경으로 궁중 권력과 관련된 궁녀 실종 사건이 발생한다. 在原業平는 사람을 피하는 젊은 학생 菅原道真과 만나고, 두 사람은 약 20년의 나이 차이에도 함께 기묘한 사건을 해결한다. 공식 소개는 이를 헤이안 시대 범죄·서스펜스로 설명한다.
- `observation`: BUNCH COMICS, ISBN `9784107717429`이며 frozen representative와 일치한다.
- `limitation`: 1권 소개만으로 사건의 폭력 묘사나 초자연성의 실제 여부를 판단하지 않는다.

### Source 2

- `sourceName`: 新潮社 공식 도서 페이지 2권
- `sourceUrl`: https://www.shinchosha.co.jp/book/771777
- `publishedAt`: 2014-10-09
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 2권
- `supportedClaims`: 道真과 業平 콤비가 앞선 두 사건 뒤 藤原高子로부터 새로운 의뢰를 받는다. 이성적인 道真과 기지를 쓰는 業平의 조합으로 헤이안의 괴이한 사건을 조사하는 흐름이다.
- `observation`: ISBN `9784107717771` 및 권별 사건 의뢰가 공식 본문에 있다.
- `limitation`: ‘괴이’는 소개상의 사건 표현이며, 실제 유령·요괴 장르로 단정하지 않는다.

### Source 3

- `sourceName`: 新潮社 공식 도서 페이지 3권
- `sourceUrl`: https://www.shinchosha.co.jp/book/771810/
- `publishedAt`: 2015-04-09
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 3권
- `supportedClaims`: 도깨비·괴물로 보인 사건의 배후를 콤비가 해결하고, 道真의 형 죽음에 얽힌 진실이 드러난다. 새 인물이 등장하며 두 사람의 운명이 움직이기 시작한다고 공식 소개한다.
- `observation`: ISBN `9784107718105`와 3권 발매일이 공식 페이지에 제시된다.
- `limitation`: 죽음의 언급은 서사 사건의 존재를 보여 주지만 잔혹성·화면 묘사 수준을 의미하지 않는다.

**범위·안전 메모:** entry 범위에 실종, 의뢰, 죽음의 진실, 정치·궁중 사건이 있다. 범죄·미스터리의 위험 요소는 확인되지만 공식 소개만으로 폭력의 강도나 공포도를 판정하지 않는다. 1권 ISBN은 frozen 값과 일치한다.

## workId: `work-11d23966f22f777e95d0` — のらみみ

### Source 1

- `sourceName`: 小学館 eコミ 공식 1권 페이지
- `sourceUrl`: https://e-comi.shogakukan.co.jp/books/091884110000d0000000
- `publishedAt`: undated (동적 공식 eコミ 페이지에 권별 발매일 미노출)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher e-comic page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 1권
- `supportedClaims`: ‘Hello Kids’ 지점은 아이가 있는 가정에 아이용 캐릭터가 거주하도록 연결한다. 곰 같은 クマエモン은 한 집에 16년 머물렀고 아이가 23세가 되어도 캐릭터를 떠나보내지 못한다. 소개는 캐릭터와 아이의 일상을 동행하며 즐겁게 만드는 세계를 설명한다.
- `observation`: 原一雄, IKKI Comics, 8권 완결로 표시되며 페이지의 플랫폼 장르 라벨에는 휴먼드라마·일상·SF/판타지·개그가 함께 있다. 이 라벨은 원문 사실로만 기록하고 별도 분류로 사용하지 않는다.
- `limitation`: 공식 페이지에 ISBN과 발매일이 노출되지 않아 frozen ISBN `9784091884114`은 global identity metadata와의 대조값으로만 기록한다. 플랫폼 장르 라벨을 제품 Genre/Theme 값으로 전환하지 않는다.

### Source 2

- `sourceName`: 小学館 eコミ 공식 2권 페이지
- `sourceUrl`: https://e-comi.shogakukan.co.jp/books/091884120000d0000000
- `publishedAt`: undated (동적 공식 eコミ 페이지에 권별 발매일 미노출)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher e-comic page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 2권
- `supportedClaims`: 아이들이 학교에 간 동안 거주 캐릭터들이 무료함을 느껴 ‘チョコバットグループ’을 만들고, 성인 인간 리더가 상담 상대가 된다. のらみみ와 更科가 방문하며, のらみみ가 캐릭터를 싸게 팔지 않겠다고 말하면서도 아이가 있는 가정을 원한다는 흐름이 소개된다.
- `observation`: 공동생활, 캐릭터의 소속과 희망, 아이와의 관계를 다루는 에피소드 단서가 공식 소개에 있다.
- `limitation`: 권별 발매일·ISBN이 페이지에 없으므로 서지 정체성은 1권과 같은 시리즈 경계에서만 보조한다.

### Source 3

- `sourceName`: 小学館 eコミ 공식 3권 페이지
- `sourceUrl`: https://e-comi.shogakukan.co.jp/books/091884130000d0000000
- `publishedAt`: undated (동적 공식 eコミ 페이지에 권별 발매일 미노출)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher e-comic page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 3권
- `supportedClaims`: 더운 날 のらみみ가 심부름 중 여러 털복숭이·이상한 캐릭터를 만나고, 예전의 아이 집에 다시 머물려는 나이 든 캐릭터를 살핀다. 소개는 노인, 성인 여성의 연애, 건망증이 있는 캐릭터, 코미디언 지망 캐릭터 등 다양한 거주 캐릭터를 언급한다.
- `observation`: 캐릭터의 연령·생활 형태가 여러 가지라는 직접적인 텍스트 단서가 있다.
- `limitation`: 일부 에피소드의 결말·정서적 강도 및 권별 서지는 공식 동적 페이지에서 확인하지 못했다.

**범위·안전 메모:** 아이가 있는 가정, 거주 캐릭터의 이별·독립 문제, 일상 코미디적 공동생활이 확인된다. 공식 1–3권 소개에는 폭력·성적 내용이 나타나지 않지만, 이는 부재 판정이 아니다. frozen ISBN은 공식 e-comic 페이지가 아닌 identity metadata 대조값이다.

## workId: `work-132ce7172750a3b1fa53` — ヒナまつり

### Source 1

- `sourceName`: KADOKAWA 공식 도서 페이지 1권
- `sourceUrl`: https://www.kadokawa.co.jp/product/301306000979/
- `publishedAt`: 2011-07-15 (종이판; 전자판 페이지에는 2013-08-01도 표기)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 1권
- `supportedClaims`: 젊은 야쿠자 新田의 방에 타원형 물체가 떨어지고, 안에서 표정 없는 초능력 소녀 ヒナ가 나온다. 히나는 염동력으로 위협하며 방에 눌러앉고, 新田의 위험하고 소란스러운 공동생활이 시작된다.
- `observation`: 공식 KADOKAWA 상품 소개가 야쿠자, 초능력, 공동생활을 직접 명시한다. frozen representative `9784047273818`은 KADOKAWA 서지와 대응한다.
- `limitation`: ‘위험’은 상품 소개의 표현이며 장면의 그래픽성·폭력 강도로 확대하지 않는다.

### Source 2

- `sourceName`: KADOKAWA 공식 도서 페이지 2권
- `sourceUrl`: https://www.kadokawa.co.jp/product/301306000980/
- `publishedAt`: 2011-11-15 (종이판; 전자판 2013-08-01)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 2권
- `supportedClaims`: 新田이 히나와의 생활에 익숙해질 때 두 번째 초능력 소녀 アンズ가 등장한다. 아ンズ는 폭주족을 쓰러뜨리고 무전취식·절도에 관여하며, 新田이 대응책을 짜는 초능력 대결과 생활 곤란이 전개된다.
- `observation`: 초능력 사용, 폭주족, 상점 절도라는 entry 사건 단서가 공식 소개에 명시된다.
- `limitation`: 사건이 희극적으로 제시되더라도 폭력·범죄 행위의 묘사 강도나 윤리적 결론은 페이지에서 판정하지 않는다.

### Source 3

- `sourceName`: KADOKAWA 공식 도서 페이지 3권 및 KADOKAWA Store
- `sourceUrl`: https://www.kadokawa.co.jp/product/201110000430/ ; https://store.kadokawa.co.jp/shop/g/g201110000430/
- `publishedAt`: 2012-03-03 (종이판)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product/store pages
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 3권
- `supportedClaims`: 공식 3권 소개는 세 소녀가 계속 고군분투하는 흐름을 제시하고, KADOKAWA Store가 3권 ISBN `9784047278783`을 확인한다.
- `observation`: 권별 공식 소개의 내용량이 1·2권보다 짧으므로 3권의 세부 사건은 주장하지 않는다.
- `limitation`: 3권의 ‘세 소녀’는 소개 문구의 표현이며 작품 전체 인물관계·안전 판정으로 확장하지 않는다.

**범위·안전 메모:** entry 범위에서 야쿠자, 초능력에 의한 위협·대결, 폭주족, 무전취식·절도가 직접 확인된다. 공식 줄거리만으로 폭력의 잔혹성, 미성년 캐릭터를 둘러싼 위험의 표현 방식, 성적 내용 여부를 판정하지 않는다. frozen ISBN은 1권 공식 서지와 일치한다.

## workId: `work-15dba4fdb46308ab45d7` — 駅から5分

### Source 1

- `sourceName`: 集英社 공식 디지털 도서 페이지 1권 원판
- `sourceUrl`: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865439865439315501
- `publishedAt`: 2007-11-19 (종이 원판 발매일; 페이지에는 2012-07-06 디지털 발매도 병기)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 1권
- `supportedClaims`: 花染町을 무대로 여러 사람이 스쳐 지나가고 풍경과 사건이 교차한다. 공식 소개는 마을 안의 사람과 풍경을 따라가는 이야기로 작품의 기본 구조를 설명한다.
- `observation`: 원판 대표 ISBN은 frozen set의 `9784088654393`이다.
- `limitation`: 디지털 상품 페이지가 원판 ISBN을 직접 노출하지 않으므로 ISBN은 frozen identity와 함께 대조했다. 개별 에피소드의 안전 요소는 짧은 소개만으로 판단하지 않는다.

### Source 2

- `sourceName`: 集英社 S-MANGA 공식 문고판 1권 / 공식 문고판 2권
- `sourceUrl`: https://www.s-manga.net/items/contents.html?isbn=978-4-08-619654-3 ; https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-619655-0
- `publishedAt`: 2016-12-16
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product pages
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 1–2권 재수록판
- `supportedClaims`: 1권 소개는 吉子의 고백 수락, 八重子가 어린 시절 친구를 찾아가던 중의 택시 사고, るり가 신사에서 풍선을 받는 사건을 花染町에서 교차시킨다. 2권은 로봇 오타쿠 入谷의 감정, 사고 뒤의 丹野와 澤田, 사고로 운전하지 못하는 成田를 통해 마을의 인연이 이어진다고 소개한다.
- `observation`: 문고판 1권 ISBN `9784086196543`, 2권 ISBN `9784086196550`은 frozen representative와 다른 재수록 판본이다.
- `limitation`: 문고판 소개를 원판의 정확한 권 편집 순서로 단정하지 않으며, frozen ISBN을 문고판 ISBN으로 교체하지 않는다.

### Source 3

- `sourceName`: 集英社 공식 디지털 3권 페이지 및 e-hon 공인 서지
- `sourceUrl`: https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865566865439315501 ; https://www.e-hon.ne.jp/bec/SA/Detail?refBook=9784088655666&refHpStenCode=92005
- `publishedAt`: 2009-11 (3권 원판 발매월; 공식 디지털 페이지는 권별 본문이 충분히 노출되지 않음)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher page plus bookseller catalog
- `provenanceFactorClassification`: `identity-edition-lead-only`
- `evaluatedRange`: 3권 서지·시리즈 구조 보조
- `supportedClaims`: 3권 원판 ISBN은 `9784088655666`으로 서지 식별되며, 공식 페이지도 동일한 集英社 작품의 3권 디지털 경로를 제공한다. 공인 소개는 사람·풍경·花染町의 교차라는 시리즈 축을 반복한다.
- `observation`: 1–3권의 개별 원판 ISBN을 서로 다른 재판·디지털 경로와 혼동하지 않는다.
- `limitation`: 3권 공식 권별 줄거리의 전체 문장은 확보하지 못했으므로 3권 사건을 구체적으로 추가하지 않는다.

**범위·안전 메모:** 학교·연애 관계와 택시 사고 등 일상적 교차 사건이 확인된다. 사고는 공식 소개에 있지만 부상 정도·그래픽성은 설명되지 않는다. frozen 대표 ISBN `9784088654393`은 원판 1권이며, 공식 문고판 `9784086196543`으로 대체하지 않는다.

## workId: `work-188ba092c6195603bb3f` — つらつらわらじ

### Source 1

- `sourceName`: 講談社 공식 도서 페이지 1권
- `sourceUrl`: https://www.kodansha.co.jp/comic/products/0000014069
- `publishedAt`: 2010-09-22
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 1권
- `supportedClaims`: 에도 후기·간세이 연간을 배경으로 비젠 번주 熊田治隆가 수백 명의 행렬을 이끌고 참근교대 길에 오른다. 절약을 요구하는 막부 개혁과 松平定信 측의 첩자가 행렬에 섞인 사정이 있으며, 긴 여행이 순탄하지 않다고 공식 소개한다.
- `observation`: Morning KC, ISBN `9784063729443`으로 frozen representative와 일치한다.
- `limitation`: 첩자의 존재와 여행 곤란은 공식 줄거리의 설정 단서일 뿐 정치적 폭력의 강도나 실제 사건의 결말은 주장하지 않는다.

### Source 2

- `sourceName`: Sony Reader 공인 유통 페이지
- `sourceUrl`: https://ebookstore.sony.jp/title/00133690/id/BT000013369000200201/
- `publishedAt`: 2011-03-23 (2권 도서 발매일; 디지털 페이지에는 2011-11-25도 표시)
- `retrievedAt`: 2026-08-25
- `authorityClass`: licensed distributor
- `provenanceFactorClassification`: `factor-evidence-secondary-lead`
- `evaluatedRange`: 2권
- `supportedClaims`: 행렬이 셋쓰의 椿の本陣에 도착한 뒤 번주의 서자 소문이 돌고, 영주 일행의 변덕이 이즈미를 곤란하게 한다는 2권 소개가 있다.
- `observation`: 출판사는 講談社, 레이블은 Morning Two로 식별된다.
- `limitation`: publisher 원문이 아닌 공인 유통 소개이므로 세부 인물·사건의 편집 여부를 알 수 없다.

### Source 3

- `sourceName`: 講談社 공식 신간 목록 및 Rakuten Books 공인 서지
- `sourceUrl`: https://www.kodansha.co.jp/comic/new-releases/p?page=1396 ; https://books.rakuten.co.jp/rb/11364804/
- `publishedAt`: 2011-10-21 (공식 신간 목록의 3권 발매일; 서지에는 2011-10)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher release list plus bookseller catalog
- `provenanceFactorClassification`: `identity-edition-lead-only`
- `evaluatedRange`: 3권 정체성
- `supportedClaims`: 講談社 공식 목록에 つらつらわらじ（3）가 실리고, 공인 서지는 3권 ISBN `9784063870534`와 Morning KC를 확인한다.
- `observation`: 3권의 권별 줄거리 본문은 확보하지 못했으므로 1–2권에서 확인된 행렬·소문·정치적 긴장만 entry 범위의 사실 단서로 유지한다.
- `limitation`: 3권 사건·안전 내용은 미확인이다.

**범위·안전 메모:** 참근교대 행렬, 번주·가신·첩자, 서자 소문과 이동 중 곤란이 확인된다. 정치적 음모와 여행 위험의 존재는 말할 수 있지만 폭력·성적 내용의 강도는 공식 소개에 없어 판정하지 않는다. frozen ISBN은 1권 공식 ISBN과 일치한다.

## workId: `work-19c2017b33c07f48634e` — ふうらい姉妹

### Source 1

- `sourceName`: KADOKAWA 공식 도서 페이지 1권 / KADOKAWA Store
- `sourceUrl`: https://www.kadokawa.co.jp/product/201008000188/ ; https://store.kadokawa.co.jp/shop/g/g201008000188/
- `publishedAt`: 2010-11-15
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product/store pages
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 1권
- `supportedClaims`: 공식 소개는 4컷 형식의 자매 코미디를 ‘가장 웃긴 4컷’으로 제시한다. KADOKAWA Store가 長崎ライチ, Haruta Comics, ISBN `9784047268685`를 확인한다.
- `observation`: frozen-work-set의 대표 ISBN도 `9784047268685`이다.
- `limitation`: 1권 상품 소개는 짧은 홍보 문구 중심이므로 자매의 구체적 행동·안전 내용을 추가하지 않는다.

### Source 2

- `sourceName`: KADOKAWA 공식 도서 페이지 2권
- `sourceUrl`: https://www.kadokawa.co.jp/product/201109000335/
- `publishedAt`: 2012-01-14
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 2권
- `supportedClaims`: 2권은 두 자매를 세계 제일의 ‘유감스러운 자매’로 소개하며, 1권의 4컷 자매 코미디 형식을 이어간다. ISBN은 `9784047277694`이다.
- `observation`: 이 ISBN은 예전 후보 representative로 보였으나, 현재 frozen representative는 명시적 1권 ISBN `9784047268685`로 유지한다.
- `limitation`: ‘유감스럽다’는 공식 홍보 문구이며 성격·심리·Theme 판단으로 바꾸지 않는다.

### Source 3

- `sourceName`: KADOKAWA 공식 도서 페이지 3권 / KADOKAWA Store
- `sourceUrl`: https://www.kadokawa.co.jp/product/301309000222/ ; https://store.kadokawa.co.jp/shop/g/g201302000121/
- `publishedAt`: 2013-09-14 (종이판; 전자 상품 페이지에는 2013-10-03도 표기)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product/store pages
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 3권
- `supportedClaims`: 아름답지만 유감스러운 언니 れい子와 귀엽지만 유감스러운 동생 しおり의 발견과 웃음이 계속되며, 경제적으로 넉넉하지 않아도 함께 있어 세계가 즐겁다는 자매 일상 코미디의 소개가 있다. 3권 ISBN은 `9784047291676`이다.
- `observation`: 공식 상품과 Store의 발매일·ISBN 경로가 다르게 보이는 부분은 종이/전자 판본 차이로 기록한다.
- `limitation`: 4컷의 개별 에피소드, 폭력·성적 내용 여부는 소개에서 확인되지 않는다.

**범위·안전 메모:** 1–3권 공식 소개에서 확인되는 것은 자매 동거와 일상 4컷 코미디, 경제적 어려움, ‘유감스러운’이라는 홍보 표현이다. 폭력·성적 내용은 공식 요약에 없어 부재를 단정하지 않는다. frozen representative는 1권 ISBN이며 2권 ISBN으로 교체하지 않는다.

## workId: `work-1a6ad6771865b43c8516` — それでも町は廻っている

### Source 1

- `sourceName`: 少年画報社 공식 도서 페이지 1권
- `sourceUrl`: https://www.shonengahosha.co.jp/book_Info.php?id=5944
- `publishedAt`: 2006-01-02
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 1권
- `supportedClaims`: 마루코 상점가의 메이드 카페 ‘Seaside’가 무대이며, 실제로는 카페답지 않은 곳에서 벌어지는 활기찬 개그를 공식 소개한다.
- `observation`: ISBN `9784785926045`로 frozen representative와 일치한다.
- `limitation`: 1권 소개만으로 등장인물의 전체 성격, 미스터리 요소, 안전 내용을 확정하지 않는다.

### Source 2

- `sourceName`: 少年画報社 공식 도서 페이지 3권
- `sourceUrl`: https://www.shonengahosha.co.jp/book_Info.php?id=6146
- `publishedAt`: 2007-08-03
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher product page
- `provenanceFactorClassification`: `factor-evidence-primary`
- `evaluatedRange`: 3권
- `supportedClaims`: 같은 동네의 메이드 ‘찻집’을 배경으로, 고교생이면서 탐정 지망인 嵐山歩鳥와 능력 있는 辰野俊子, 나이 든 메이드가 등장하는 동네 코미디라고 공식 소개한다.
- `observation`: ISBN `9784785928278` 및 3권 발매일을 공식 페이지에서 확인했다.
- `limitation`: 3권 소개의 ‘탐정 지망’은 인물 설정 단서이며 실제 범죄·추리 장르 확정이 아니다.

### Source 3

- `sourceName`: 少年画報社 공식 시리즈 목록 / Manga Taisho 공식 jury comment
- `sourceUrl`: https://www.shonengahosha.co.jp/book_Search.php?bookTag=それでも町は廻っている ; https://www.mangataisho.com/data/2009/comment090324.pdf
- `publishedAt`: 2009-03-24 (공식 comment PDF; 시리즈 목록 게시일은 미표시)
- `retrievedAt`: 2026-08-25
- `authorityClass`: publisher series page plus official jury comment
- `provenanceFactorClassification`: `factor-evidence-secondary-lead`
- `evaluatedRange`: 1–3권을 포함할 수 있는 시리즈·초기 독자 comment 보조
- `supportedClaims`: 공식 comment는 메이드가 전형적인 모에 캐릭터가 되지 않고, 주인공 歩鳥가 ‘어딘가 부족한 여자아이’로 보이는 점, 평범한 동네와 메이드 카페에 연결된 에피소드·느슨한 분위기 속에 계획된 개그가 있다는 독자 관찰을 담는다.
- `observation`: comment는 권별 공식 줄거리보다 넓은 독자·심사 의견이며, publisher 시리즈 목록은 작품의 3권 이후 존재만 보강한다.
- `limitation`: comment의 관찰을 1–3권 각각의 사실이나 제품 분류 값으로 분해하지 않는다.

**범위·안전 메모:** 메이드 카페가 있는 동네 일상, 고교생 탐정 지망, 개그가 확인된다. 공식 1·3권 소개에는 폭력·성적 사건이 드러나지 않지만 전체 부재를 단정하지 않는다. frozen 1권 ISBN은 공식 페이지와 일치한다.

## workId: `work-1cdc6c5cca7c33fafe51` — 青空にとおく酒浸り

### Source 1

- `sourceName`: 楽天ブックス 공인 서지 (徳間書店 Ryu Comics)
- `sourceUrl`: https://books.rakuten.co.jp/rb/6414362/
- `publishedAt`: 2010-04 (1권 발매월)
- `retrievedAt`: 2026-08-25
- `authorityClass`: bookseller catalog
- `provenanceFactorClassification`: `identity-edition-lead-only`
- `evaluatedRange`: 1권 정체성
- `supportedClaims`: 작가 安永航一郎, 徳間書店, Ryu Comics, ISBN `9784199501746`, 168쪽으로 1권을 식별한다.
- `observation`: ISBN은 frozen representative와 일치한다.
- `limitation`: 해당 서지 페이지에 공식 줄거리·권별 안전 정보가 없어 내용 evidence로 확장하지 않는다.

### Source 2

- `sourceName`: 日本出版販売 계열 Honya Club 공인 시리즈 서지
- `sourceUrl`: https://www.honyaclub.com/shop/e/eS4865176/
- `publishedAt`: 2010-04 (1권), 2010-06 (2·3권)
- `retrievedAt`: 2026-08-25
- `authorityClass`: distributor/bookseller catalog
- `provenanceFactorClassification`: `identity-edition-lead-only`
- `evaluatedRange`: 1–3권 판본
- `supportedClaims`: 1권 `9784199501746`, 2권 `9784199501753`, 3권 `9784199501814`가 모두 徳間書店 Ryu Comics로 목록화된다.
- `observation`: 2·3권의 발매월과 ISBN을 확인할 수 있어 entry 범위의 권별 identity를 고정한다.
- `limitation`: 시리즈 서지에는 개별 권 줄거리·인물·안전 내용이 없다.

### Source 3

- `sourceName`: Manga Taisho 공식 jury comment PDF
- `sourceUrl`: https://www.mangataisho.com/data/2012/mantai_comment2012.pdf
- `publishedAt`: 2012
- `retrievedAt`: 2026-08-25
- `authorityClass`: official award jury comment
- `provenanceFactorClassification`: `factor-evidence-secondary-lead`
- `evaluatedRange`: 시리즈 전반에 대한 comment; 1–3권에 제한해 확정하지 않음
- `supportedClaims`: 공식 심사 코멘트는 安永節의 지속·강화, SF적인 밀도, 앞을 예상하기 어려운 큰 전개를 작품에 대한 독자 관찰로 표현한다.
- `observation`: 이는 권별 publisher synopsis가 아닌 award comment의 평가 언어이며, 작품에 SF적 요소와 고밀도·예측 불가능한 전개가 있다는 제한적 보조 단서로만 남긴다.
- `limitation`: comment가 1–3권의 어느 장면을 가리키는지 특정하지 못하므로 개별 인물·사건·안전 내용을 만들지 않는다.

**범위·안전 메모:** 1–3권의 ISBN·출판사·발매월은 공인 서지로 확인되지만, 공식 publisher 권별 줄거리 경로는 이번 조사에서 확보하지 못했다. 따라서 SF·전개에 관한 award comment 외에는 entry 내용 주장을 추가하지 않으며, 폭력·성적 내용·안전 요소는 미확인으로 남긴다. promotion이나 eligibility 판정은 하지 않는다.
