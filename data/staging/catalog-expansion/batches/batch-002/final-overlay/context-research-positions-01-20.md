# Batch 002 recommendation-context research: positions 1–20 subset

- 기준일 및 조회일: 2026-08-23 (Asia/Tokyo)
- 대상 position: 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20
- 제외 position: 5 (RED), 14 (orange)
- 결과: 18건 resolved, 0건 unresolved
- 기계 판독 결과: `context-research-positions-01-20.csv`
- 적용 경계: 조사 overlay만 작성했으며 source CSV와 generated catalog는 변경하지 않았다.

## 판정 원칙

1. `volumeCount`는 2026-08-23까지 실제 발매된 일본어 일반 단행본 본편의 현재 권수다. 특장판, 한정판, 문고판, 신장판, 복각 BOX, 소설, 가이드와 별도 스핀오프는 더하지 않았다.
2. 대표 ISBN 하나를 근거로 1권이라고 추론하지 않았다. 출판사 시리즈 목록, 최신 일반판 상품 페이지의 권 번호와 완결 표기, 또는 출판사 공식 재고 목록의 연속 권 목록으로 확인했다.
3. 아직 발매되지 않은 예약 권은 제외했다. 특히 `魔法使いの嫁` 25권은 기준일 뒤 발매 예정이므로 집계하지 않았다.
4. `catalogRole`은 인기도 등급이 아니라 추천 기능 역할이다. `anchor`는 취향 대비가 선명한 작품, `bridge`는 서로 다른 취향 군을 연결하는 작품, `discovery`는 좁거나 비정형인 소재를 발견 슬롯에 제시하는 작품으로 보수적으로 판정했다.
5. 이 subset과 현재 카탈로그에서 동일 추천 시리즈로 묶어야 할 직접 속편·스핀오프 쌍을 확인하지 못했다. 따라서 모든 `seriesGroupId`를 공란으로 유지했다. 동일 작가, 느슨한 프랜차이즈 연관 또는 현재 canonical Work가 아닌 외전만으로 그룹을 만들지 않았다.
6. 동결된 canonical title을 그대로 대조했고 일본식 장식 인용부호를 작품명에 포함하지 않았다.

## 권수 및 공식 출처 원장

| Pos. | workId                      | canonical title  | volumeCount | 상태 및 판본 범위                                                               | 공식 출처                                                                                                     | source date | retrieved  |
| ---: | --------------------------- | ---------------- | ----------: | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
|    1 | `work-017446dd1a9039d9839b` | サンダー３       |          10 | 일반 단행본 10권 완결                                                           | [講談社 サンダー３](https://www.kodansha.co.jp/titles/1000042981)                                             | 2026-08-17  | 2026-08-23 |
|    2 | `work-02d5d329c9ef85e481cb` | のたり松太郎     |          36 | Big Comics 36권; 1973~1998년 연재 종료                                          | [小学館コミック のたり松太郎 36](https://shogakukan-comic.jp/book?jdcn=091850860000d0000000)                  | 2017-12-01  | 2026-08-23 |
|    3 | `work-089947c5303024841fef` | デカワンコ       |          12 | 일반 단행본 1~12권; 출판사는 완결·연재 상태를 명시하지 않음                     | [集英社 デカワンコ 12](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865664865501315501)        | 2013-03-25  | 2026-08-23 |
|    4 | `work-0e036724913c69bb937a` | ファイアパンチ   |           8 | Jump Comics 8권 완결                                                            | [集英社 ファイアパンチ 8](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-881327-1)        | 2018-02-02  | 2026-08-23 |
|    6 | `work-1088a1dc00a3b0d22201` | 邪眼は月輪に飛ぶ |           1 | 일반 단행본 전1권 완결; 대표 ISBN에서 단권을 추론하지 않음                      | [小学館コミック 邪眼は月輪に飛ぶ](https://shogakukan-comic.jp/book?isbn=9784091811974)                        | 2007-04-27  | 2026-08-23 |
|    7 | `work-19a26f01512166856a6a` | 銀河鉄道999      |          21 | 현재 Big Comics 일반판 전21권 완결; 애장판·복각판 제외                          | [小学館 銀河鉄道999 21](https://www.shogakukan.co.jp/books/09188181)                                          | 2005-03-30  | 2026-08-23 |
|    8 | `work-1e27731b880d0d9012f8` | 吉祥天女         |           4 | Flower Comics 전4권 완결                                                        | [小学館 吉祥天女 4](https://www.shogakukan.co.jp/books/09131304)                                              | 1984-09-26  | 2026-08-23 |
|    9 | `work-207bb1ca28b7472fbe1d` | 六三四の剣       |          24 | Shonen Sunday Comics 전24권 완결                                                | [小学館 六三四の剣 24](https://www.shogakukan.co.jp/books/09121324)                                           | 1985-11-18  | 2026-08-23 |
|   10 | `work-23851cd7ccf1d0c676cc` | 怪獣8号          |          16 | 본편 16권 완결; `side B`와 `RELAX`는 별도 작품이므로 제외                       | [集英社 怪獣8号 16](https://www.shueisha.co.jp/books/items/contents_amp.html?isbn=978-4-08-884726-9)          | 2025-09-04  | 2026-08-23 |
|   11 | `work-29d4300ad9d3358fb67a` | 外天楼           |           1 | 원 KC Deluxe 전1권; 2015년 講談社文庫 재판은 중복 집계하지 않음                 | [講談社 外天楼](https://www.kodansha.co.jp/comic/products/0000223170)                                         | 2011-10-21  | 2026-08-23 |
|   12 | `work-3dfaf6231e21133620c6` | 忍者と極道       |          17 | 일반 단행본 1~17권 발매, 연재 중                                                | [講談社 忍者と極道](https://www.kodansha.co.jp/titles/1000036050)                                             | 2026-04-08  | 2026-08-23 |
|   13 | `work-3e725951eb9c49771087` | 嘘解きレトリック |          10 | Hana to Yume Comics 10권 완결                                                   | [白泉社 嘘解きレトリック 10](https://www.hakusensha.co.jp/comicslist/52166/)                                  | 2018-08-20  | 2026-08-23 |
|   15 | `work-4c784fc78dfd9b139c3f` | 正反対な君と僕   |           8 | Jump Comics 8권 완결                                                            | [集英社 正反対な君と僕 8](https://www.shueisha.co.jp/books/items/contents_amp.html?jdcn=08X10000000059600800) | 2025-03-04  | 2026-08-23 |
|   16 | `work-518d7ed42dd9253679c3` | 墨攻             |          11 | Big Comics 전11권 완결                                                          | [小学館 墨攻 11](https://www.shogakukan.co.jp/books/09183236)                                                 | 1996-09-30  | 2026-08-23 |
|   17 | `work-53e54c95f637b66c4fb2` | がんばれ元気     |          28 | Shonen Sunday Comics 전28권 완결                                                | [小学館 がんばれ元気 28](https://www.shogakukan.co.jp/books/09120488)                                         | 1981-07-17  | 2026-08-23 |
|   18 | `work-5915d6d7601377fcc75f` | 赤髪の白雪姫     |          27 | 일반 단행본 1~27권; 출판사는 완결로 표시하지 않음                               | [白泉社 赤髪の白雪姫 27](https://www.hakusensha.co.jp/comicslist/74758/)                                      | 2025-05-02  | 2026-08-23 |
|   19 | `work-5b4dc4e6e966436b2990` | 人形芝居         |           4 | 일반 단행본 1~4권; 출판사는 완결·연재 상태를 명시하지 않음                      | [白泉社 人形芝居 4](https://www.hakusensha.co.jp/comicslist/52004/)                                           | 2018-06-20  | 2026-08-23 |
|   20 | `work-5b9a3ec60ac5fc90f444` | 魔法使いの嫁     |          24 | 만화 본편 24권 발매, 연재 중; 기준일 뒤 예약된 25권과 특장판·단편집·외전은 제외 | [コミックグロウル 魔法使いの嫁 24](https://comic-growl.com/store_items/17424)                                 | 2026-04-08  | 2026-08-23 |

小学館 작품의 원판 최종권 상품과 함께 현재 전자책 시리즈 원장을 교차 확인했다. 원장은 [のたり松太郎 36권](https://e-comi.shogakukan.co.jp/books/091850860000d0000000), [邪眼は月輪に飛ぶ 전1권](https://e-comi.shogakukan.co.jp/books/091811970000d0000000), [銀河鉄道999 전21권](https://e-comi.shogakukan.co.jp/books/091881810000d0000000), [吉祥天女 전4권](https://e-comi.shogakukan.co.jp/books/091313030000d0000000), [六三四の剣 전24권](https://e-comi.shogakukan.co.jp/books/091206340000d0000000), [墨攻 전11권](https://e-comi.shogakukan.co.jp/books/091832360000d0000000), [がんばれ元気 전28권](https://e-comi.shogakukan.co.jp/books/091204880000d0000000)을 각각 명시한다. `のたり松太郎`의 종료 연도와 36권 구성은 [小学館 공식 회고 기사](https://shogakukan-comic.jp/news/10131)도 교차 확인했다.

`デカワンコ`는 [集英社 저자별 공식 검색 결과](https://www.shueisha.co.jp/books/search/search.html?digital=1&page=2&titleauthor=%E6%A3%AE%E6%9C%AC+%E6%A2%A2%E5%AD%90)에서 1~12권의 연속 목록을 확인했다. 이후 권이나 명시적인 완결 표기가 없어 권수는 해소하되 상태는 추정하지 않았다.

`外天楼`는 [講談社 작품별 출판 원장](https://www.kodansha.co.jp/titles/1000005726)의 2건이 2011년 KC Deluxe 원 일반판과 2015년 講談社文庫 재판임을 각 서지에서 확인했다. 따라서 일반판 작품 권수는 1이며 문고 재판을 두 번째 권으로 세지 않았다.

`人形芝居`는 4권 상품과 [白泉社 2026년 4월 현재 주문 목록](https://www.hakusensha.co.jp/book-store/order/pdf/hanayume.pdf)의 1~4권 연속 등재를 교차 확인했다. 다만 출판사가 완결 또는 연재 중을 명시하지 않아 상태를 보수적으로 미분류했다.

## Catalog role 판정 원장

| workId                      | canonical title  | role      | 추천 기능 근거                                                                            |
| --------------------------- | ---------------- | --------- | ----------------------------------------------------------------------------------------- |
| `work-017446dd1a9039d9839b` | サンダー３       | anchor    | 차원 이동 SF와 고속 전투의 강한 대비가 액션·모험 취향을 선명하게 판독한다.                |
| `work-02d5d329c9ef85e481cb` | のたり松太郎     | discovery | 거칠고 비정형인 성인 주인공의 장기 스모 생활극을 고전 스포츠 발견 슬롯에 제시한다.        |
| `work-089947c5303024841fef` | デカワンコ       | bridge    | 직업 수사·미스터리에 높은 코미디와 인물 관계를 결합해 절차극과 생활 코미디 취향을 잇는다. |
| `work-0e036724913c69bb937a` | ファイアパンチ   | anchor    | 극한 생존·복수와 높은 어둠·심리 압박이 고강도 포스트아포칼립스 취향을 강하게 가른다.      |
| `work-1088a1dc00a3b0d22201` | 邪眼は月輪に飛ぶ | anchor    | 단권 안의 초자연 전투·생존·호러 밀도가 고강도 액션 취향을 뚜렷하게 판독한다.              |
| `work-19a26f01512166856a6a` | 銀河鉄道999      | anchor    | 에피소드형 우주 여행과 광대한 세계 탐색이 모험·세계관 취향의 선명한 기준점이 된다.        |
| `work-1e27731b880d0d9012f8` | 吉祥天女         | discovery | 고전 소녀만화의 심리 미스터리와 차가운 학교 관계극을 비정형 발견 슬롯에 제시한다.         |
| `work-207bb1ca28b7472fbe1d` | 六三四の剣       | anchor    | 검도 수련·경기·장기 성장이 고전 스포츠 성장 취향을 선명하게 판독한다.                     |
| `work-23851cd7ccf1d0c676cc` | 怪獣8号          | bridge    | 성인 직업 재도전과 괴수 전투·코미디를 함께 다뤄 직업 성장과 배틀 SF 취향을 잇는다.        |
| `work-29d4300ad9d3358fb67a` | 外天楼           | discovery | 단권형 SF 미스터리의 구조적 반전과 비정형 앙상블을 발견 슬롯에 제시한다.                  |
| `work-3dfaf6231e21133620c6` | 忍者と極道       | anchor    | 전쟁 규모의 대립·전투와 높은 어둠·속도가 극단적인 액션 취향을 선명하게 가른다.            |
| `work-3e725951eb9c49771087` | 嘘解きレトリック | bridge    | 시대 배경의 직업 수사와 관계 중심 미스터리를 연결해 역사물·절차극 취향을 잇는다.          |
| `work-4c784fc78dfd9b139c3f` | 正反対な君と僕   | anchor    | 높은 정서적 온기와 관계 성장의 학교 로맨스가 따뜻한 로맨스 취향을 강하게 판독한다.        |
| `work-518d7ed42dd9253679c3` | 墨攻             | anchor    | 공성전·전략·문제 해결의 밀도가 역사 전쟁과 두뇌전 취향의 선명한 기준점이 된다.            |
| `work-53e54c95f637b66c4fb2` | がんばれ元気     | anchor    | 복싱 수련·경기와 긴 성장 궤적이 스포츠 성장 취향을 선명하게 판독한다.                     |
| `work-5915d6d7601377fcc75f` | 赤髪の白雪姫     | bridge    | 판타지 궁정·직업 성장과 로맨스를 결합해 세계관·관계 성장 취향을 잇는다.                   |
| `work-5b4dc4e6e966436b2990` | 人形芝居         | discovery | 인간과 기계인형의 에피소드형 관계극을 잔잔한 SF 생활극 발견 슬롯에 제시한다.              |
| `work-5b9a3ec60ac5fc90f444` | 魔法使いの嫁     | bridge    | 민속 판타지의 세계 탐색과 장기 관계·회복을 결합해 세계관과 인물 관계 취향을 잇는다.       |

역할 판정은 Batch 002의 동결 작품 집합과 annotation/adjudication packet을 기준으로 했으며, 권수 출처를 Factor evidence로 전용하지 않았다.

## 해소 결과

- `volumeCount` resolved: 18
- `volumeCount` unresolved: 0
- `seriesGroupId` assigned: 0
- canonical title 장식 인용부호 위반: 0
