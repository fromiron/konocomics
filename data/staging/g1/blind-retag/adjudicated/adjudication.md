# G1 전체 공식 근거 재판정

## 경계와 방법

- 정책: `g1-full-evidence-adjudication-v1`.
- 범위: `sample-manifest.json`의 9작품, 각 작품의 `entry_1_3_volumes`, 비-Art 13축, Genre 전체 셀, Theme 전체 work-set.
- 비교 기준: 동결된 pre-adjudication `candidate-source`와 blind A/B 및 `reconciled`만 사용했다. 추천 출력, 시장·리뷰 신호는 사용하지 않았다.
- Art 4축은 열람·재판정·덮어쓰지 않았다. 별도 200행 `art-evidence-manifest.csv`가 계속 권위다.
- 판정자는 승인된 모델이며 사람 검토가 아니다. 모든 신규 evidence 행은 `sourceType=model`, `reviewedByHuman=false`다.
- 표기: `K2`는 known 2, `U`는 unknown, `R`은 reconciled다. confidence는 Final에만 표시한다.

## 공식 근거 범위와 판본 매핑

### jojo-bizarre-adventure

- 일본 원판 1–3권: <https://books.shueisha.co.jp/items/contents.html?isbn=4-08-851126-3>, <https://books.shueisha.co.jp/items/contents.html?isbn=4-08-851127-1>, <https://books.shueisha.co.jp/items/contents.html?isbn=4-08-851128-X>.
- 공식 독자 범위: <https://shonenjumpplus.com/episode/3269632237245268586>, <https://shonenjumpplus.com/episode/3269632237245270313>, <https://shonenjumpplus.com/episode/3269632237245464205>.
- 정식 영문판 보조: <https://shop.viz.com/products/jojo-s-bizarre-adventure-part-1-phantom-blood-vol-1>, <https://www.viz.com/blog/posts/jojo-s-bizarre-adventure-vol-2>. Part 1 원판 1–3권 밖 사건은 전이하지 않았다.

### berserk

- 일본 원판 1–3권: <https://www.hakusensha.co.jp/comicslist/40773/>, <https://www.hakusensha.co.jp/comicslist/40775/>, <https://www.hakusensha.co.jp/comicslist/40777/>.
- 공식 독자: `https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=` 뒤에 `59213574berserk00111`, `59213575berserk00211`, `59213576berserk00311`을 각각 사용했다.
- 공식 영문판 범위 보조: <https://images.darkhorse.com/common/salestools/catalogs/DHManga_Readers_Guide_2013.pdf>, <https://digital.darkhorse.com/series/826/berserk>. 후속 Golden Age 전개는 끌어오지 않았다.

### dr-stone

- 일본 원판 1–3권: <https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-881184-0>, <https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-881259-5>, <https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-881288-5>.
- S-MANGA 공식 독자: <https://www.s-manga.net/reader/main.php?cid=9784088811840>, <https://www.s-manga.net/reader/main.php?cid=9784088812595>, <https://www.s-manga.net/reader/main.php?cid=9784088812885>.
- VIZ 정식판 1–3권 product 5625, 5714, 5777은 동일 권 범위의 영문 보조로만 사용했다.

### 20th-century-boys

- 일본 원판 1–3권: <https://shogakukan-comic.jp/book?isbn=9784091855312>, <https://shogakukan-comic.jp/book?isbn=9784091855329>, <https://shogakukan-comic.jp/book?isbn=9784091855336>.
- 위 원판 범위에서 확인되는 실종, 교단·살인, 생물학 공격까지만 사용했다. 후대 세계나 완전판 전체 사건은 전이하지 않았다.

### dungeon-meshi

- 일본 원판 1–3권: <https://www.kadokawa.co.jp/product/301411000826/>, <https://www.kadokawa.co.jp/product/301506000927/>, <https://www.kadokawa.co.jp/product/321604000684/>.
- 공식 독자: <https://comic-walker.com/detail/KC_000393_S>.
- 공식 애니메이션 <https://delicious-in-dungeon.com/>의 1–10화는 원판 진입 사건과 대응되는 범위만 보조했다. 이후 사건은 사용하지 않았다.

### kingdom

- 일본 원판 1–3권: <https://books.shueisha.co.jp/items/contents.html?jdcn=08877079877079315501>, <https://books.shueisha.co.jp/items/contents.html?jdcn=08877129877079315501>, <https://books.shueisha.co.jp/items/contents.html?jdcn=08877171877079315501>.
- 공식 작품 소개: <https://youngjump.jp/kingdom/intro/>.
- 공식 애니메이션 <https://kingdom-anime.com/bd_recommend/story/>의 1–10화는 원판 진입 사건에 대응되는 범위만 보조했다.

### bocchi-the-rock

- 芳文社 원판 1–3권: <https://houbunsha.co.jp/comics/detail.php?current=2&p=%25A4%25DC%25A4%25C3%25A4%25C1%25A1%25A6%25A4%25B6%25A1%25A6%25A4%25ED%25A4%25C3%25A4%25AF%25A1%25AA>.
- 정식 영문판 1–3권: <https://yenpress.com/titles/9781975378004-bocchi-the-rock-vol-1>, <https://yenpress.com/titles/9781975378035-bocchi-the-rock-vol-2>, <https://yenpress.com/titles/9781975378042-bocchi-the-rock-vol-3>.
- 공식 제1화: <https://comic-fuz.com/manga/viewer/24407>.

### monster

- 대표 원판 1권 ISBN URL <https://shogakukan-comic.jp/book?isbn=9784091836519>은 공식 Digital Ver.1 <https://shogakukan-comic.jp/book?jdcn=091836510000d0000000>로 연결된다.
- 원판 2–3권: <https://shogakukan-comic.jp/book?isbn=9784091836526>, <https://shogakukan-comic.jp/book?isbn=9784091836533>.
- 完全版 1 <https://shogakukan-comic.jp/book?isbn=9784091817907>의 뒤 8개 화는 원판 2권의 8개 화 제목과 일치하므로 完全版 1은 원판 1+2권 교차검증에만 썼다. 完全版 2 <https://shogakukan-comic.jp/book?isbn=9784091818027>는 원판 3권 절단점이 공식 노출되지 않아 전체를 전이하지 않았다.
- VIZ Perfect Edition 1 <https://www.viz.com/manga-books/manga/monster-volume-1-0/product/3451>은 동일 초반 범위의 보조다.

### blue-lock

- 일본 원판 1–3권: <https://www.kodansha.co.jp/r/comic/product?item=0000314505>, <https://www.kodansha.co.jp/comic/products/0000318622>, <https://www.kodansha.co.jp/comic/products/0000319485>.
- 공식 제1화: <https://pocket.shonenmagazine.com/title/00617/episode/213491>.

## 비-Art 축 판정

### jojo-bizarre-adventure

| Axis                  | Current | R   | Final   | Disposition            | 근거 요약                                                             |
| --------------------- | ------- | --- | ------- | ---------------------- | --------------------------------------------------------------------- |
| progression           | K2      | U   | K2@0.84 | RETAIN_CURRENT         | Ripple 학습은 반복되지만 성장 보상만 지배하지 않는다.                 |
| problemSolving        | K2      | U   | K2@0.80 | RETAIN_CURRENT         | 기지와 직접 전투가 함께 문제를 푼다.                                  |
| strategy              | K2      | U   | K2@0.76 | RETAIN_CURRENT         | Dio의 계획과 단기 전술은 있으나 운영 중심은 아니다.                   |
| pacing                | K4      | U   | K4@0.93 | RETAIN_CURRENT         | 입양 갈등, 흡혈귀화, 저택 화재, Ripple 추격으로 상태가 빠르게 바뀐다. |
| mysteryReveal         | K4      | U   | K4@0.92 | RETAIN_CURRENT         | 가면 기능과 Dio 생존의 공개가 핵심 보상이다.                          |
| worldBuilding         | K4      | K2  | K2@0.88 | ADOPT_BLIND            | 가면·흡혈귀·Ripple 규칙은 기능적이나 다층 제도·세력 밀도는 아니다.    |
| characterArcWeight    | K4      | U   | K4@0.92 | RETAIN_CURRENT         | Jonathan과 Dio의 동기·변화가 사건만큼 중심이다.                       |
| relationshipStructure | K2      | K2  | K2@0.88 | RETAIN_CURRENT         | 핵심 대립 둘과 아버지·Speedwagon·Zeppeli의 고정 조연 구조다.          |
| comedy                | K0      | U   | K2@0.76 | REPLACE_WITH_NEW_VALUE | 공식 소개의 wild humor와 진입 범위 반응 개그가 반복된다.              |
| darkness              | K4      | K2  | K4@0.96 | RETAIN_CURRENT         | 살인, 흡혈귀, 화재, 언데드 위협이 반복 중심이다.                      |
| mentalStress          | K4      | U   | K3@0.86 | REPLACE_WITH_NEW_VALUE | 괴롭힘과 가족 붕괴 압박이 크지만 영웅적 행위성이 완충한다.            |
| romance               | K2      | U   | K2@0.72 | RETAIN_CURRENT         | Erina와 소녀를 둘러싼 갈등은 존재하나 주축은 아니다.                  |
| emotionalWarmth       | K2      | U   | K2@0.82 | RETAIN_CURRENT         | 멘토·동료 유대와 비극이 혼재한다.                                     |

### berserk

| Axis                  | Current | R   | Final   | Disposition            | 근거 요약                                               |
| --------------------- | ------- | --- | ------- | ---------------------- | ------------------------------------------------------- |
| progression           | K0      | U   | U       | SET_UNKNOWN            | 진입 범위만으로 성장 보상의 반복 부재를 확정할 수 없다. |
| problemSolving        | K0      | U   | K0@0.86 | RETAIN_CURRENT         | 문제 해결은 폭력적 직접 행동이 지배한다.                |
| strategy              | K0      | U   | K0@0.82 | RETAIN_CURRENT         | 장기 운영·다단계 계획이 보상 구조가 아니다.             |
| pacing                | K4      | U   | K4@0.90 | RETAIN_CURRENT         | 권별 목표와 적·장소가 빠르게 바뀐다.                    |
| mysteryReveal         | K4      | U   | K4@0.91 | RETAIN_CURRENT         | 낙인, 사도, God Hand의 공개가 핵심이다.                 |
| worldBuilding         | K4      | U   | K4@0.91 | RETAIN_CURRENT         | 사도·낙인·악령 규칙이 사건을 계속 제약한다.             |
| characterArcWeight    | K4      | U   | K3@0.86 | REPLACE_WITH_NEW_VALUE | Guts의 동기와 변화가 중요하지만 행동 서사와 균형이다.   |
| relationshipStructure | K0      | U   | K1@0.90 | REPLACE_WITH_NEW_VALUE | Puck의 반복 동행으로 완전한 단독 구조는 아니다.         |
| comedy                | U       | U   | K2@0.80 | REPLACE_WITH_NEW_VALUE | Puck의 반응과 대비 개그가 어두운 사건 사이에 반복된다.  |
| darkness              | K4      | K4  | K4@0.99 | RETAIN_CURRENT         | 유혈·절단·악령·잔혹한 죽음이 지속된다.                  |
| mentalStress          | K4      | U   | K3@0.88 | REPLACE_WITH_NEW_VALUE | 위협은 강하지만 Guts의 높은 행위성이 완충한다.          |
| romance               | K0      | U   | U       | SET_UNKNOWN            | 공식 진입 근거로 로맨스 반복 부재를 확정할 수 없다.     |
| emotionalWarmth       | K0      | U   | K1@0.78 | REPLACE_WITH_NEW_VALUE | Puck과의 동행이 제한적 온기를 만든다.                   |

### dr-stone

| Axis                  | Current | R   | Final   | Disposition            | 근거 요약                                              |
| --------------------- | ------- | --- | ------- | ---------------------- | ------------------------------------------------------ |
| progression           | K4      | U   | K4@0.98 | RETAIN_CURRENT         | 문명 재건과 제작 성취가 반복 보상이다.                 |
| problemSolving        | K4      | U   | K4@0.98 | RETAIN_CURRENT         | 과학 제약을 분석해 재료·도구로 푼다.                   |
| strategy              | K2      | U   | K2@0.90 | RETAIN_CURRENT         | 단기 전술은 있으나 운영보다 과학 해결이 중심이다.      |
| pacing                | K4      | U   | K4@0.95 | RETAIN_CURRENT         | 석화, 부활, 분리, 마을 진입으로 상태가 빠르게 바뀐다.  |
| mysteryReveal         | K2      | K2  | K2@0.88 | RETAIN_CURRENT         | 석화 원인 미스터리는 지속하지만 제작 보상보다 하위다.  |
| worldBuilding         | K4      | U   | K4@0.96 | RETAIN_CURRENT         | 석화 세계의 자원·기술 규칙이 반복 제약이다.            |
| characterArcWeight    | K2      | U   | K2@0.86 | RETAIN_CURRENT         | 인물 변화와 사건·발명이 균형이다.                      |
| relationshipStructure | K2      | K2  | K2@0.90 | RETAIN_CURRENT         | 핵심 삼인조와 마을 동료의 고정 그룹이다.               |
| comedy                | K4      | U   | K4@0.92 | RETAIN_CURRENT         | 공식 독자의 과학 과장·반응 개그가 반복된다.            |
| darkness              | K2      | U   | K2@0.88 | RETAIN_CURRENT         | 생존 위협은 있으나 모험·코미디가 완충한다.             |
| mentalStress          | K2      | U   | K2@0.84 | RETAIN_CURRENT         | 위험과 분리는 있으나 높은 문제해결 행위성이 있다.      |
| romance               | K0      | U   | K2@0.91 | REPLACE_WITH_NEW_VALUE | Taiju의 Yuzuriha 고백·구출 동기가 명시적으로 반복된다. |
| emotionalWarmth       | K4      | U   | K4@0.93 | RETAIN_CURRENT         | 우정·구조·협력이 반복 보상이다.                        |

### 20th-century-boys

| Axis                  | Current | R   | Final   | Disposition            | 근거 요약                                                     |
| --------------------- | ------- | --- | ------- | ---------------------- | ------------------------------------------------------------- |
| progression           | K0      | U   | U       | SET_UNKNOWN            | 진입 범위로 성장 보상의 반복 부재를 확정할 수 없다.           |
| problemSolving        | K2      | U   | K3@0.92 | REPLACE_WITH_NEW_VALUE | 실종·상징·교단·살인 단서를 반복 조사한다.                     |
| strategy              | K2      | U   | K2@0.85 | RETAIN_CURRENT         | 예언과 장기 음모는 있으나 독자 보상은 운영보다 추적이다.      |
| pacing                | K4      | U   | K4@0.96 | RETAIN_CURRENT         | 실종에서 교단·살인·생물학 공격으로 상태가 크게 바뀐다.        |
| mysteryReveal         | K4      | K4  | K4@0.99 | RETAIN_CURRENT         | Friend, 상징, 살인, 예언, 친자 정보 공개가 핵심이다.          |
| worldBuilding         | K4      | U   | K2@0.86 | REPLACE_WITH_NEW_VALUE | 교단·경찰·피해자망은 기능적이나 다층 세계 규칙 중심은 아니다. |
| characterArcWeight    | K4      | U   | K3@0.90 | REPLACE_WITH_NEW_VALUE | Kenji의 책임과 인물 선택이 사건 전개와 균형이다.              |
| relationshipStructure | K4      | K3  | K3@0.92 | ADOPT_BLIND            | 친구·가족·수사 인물이 교차하는 앙상블이나 최고 밀도는 아니다. |
| comedy                | K0      | U   | U       | SET_UNKNOWN            | 공식 진입 근거로 개그 반복 부재를 확정할 수 없다.             |
| darkness              | K4      | K2  | K4@0.97 | RETAIN_CURRENT         | 살인·생물학적 죽음·종말 위협이 반복된다.                      |
| mentalStress          | K4      | U   | K3@0.92 | REPLACE_WITH_NEW_VALUE | 지속 위협이 강하나 조사·대응 행위성이 완충한다.               |
| romance               | K0      | U   | K1@0.68 | REPLACE_WITH_NEW_VALUE | 누나의 연인과 친자 관계가 제한적 하위 소재다.                 |
| emotionalWarmth       | K2      | U   | K2@0.85 | RETAIN_CURRENT         | Kanna 보호와 친구 재결합이 위협과 혼재한다.                   |

### dungeon-meshi

| Axis                  | Current | R   | Final   | Disposition            | 근거 요약                                            |
| --------------------- | ------- | --- | ------- | ---------------------- | ---------------------------------------------------- |
| progression           | K1      | U   | K1@0.83 | RETAIN_CURRENT         | 제한적 학습은 있으나 성장 보상이 지배하지 않는다.    |
| problemSolving        | K4      | U   | K4@0.98 | RETAIN_CURRENT         | 몬스터 생태·조리 지식으로 반복 해결한다.             |
| strategy              | K2      | U   | K2@0.93 | RETAIN_CURRENT         | 자원·전투의 단기 계획이 반복된다.                    |
| pacing                | K3      | U   | K3@0.92 | RETAIN_CURRENT         | 장소·몬스터·목표가 규칙적으로 바뀐다.                |
| mysteryReveal         | K2      | U   | K3@0.91 | REPLACE_WITH_NEW_VALUE | 갑옷·보물·그림·던전 성질의 공개가 누적된다.          |
| worldBuilding         | K4      | K2  | K4@0.99 | RETAIN_CURRENT         | 던전 규칙·생태·식재료 상호작용이 핵심 제약이다.      |
| characterArcWeight    | K2      | U   | K2@0.90 | RETAIN_CURRENT         | 인물과 사건·탐험이 균형이다.                         |
| relationshipStructure | K2      | U   | K2@0.95 | RETAIN_CURRENT         | 고정 파티 중심 구조다.                               |
| comedy                | K4      | U   | K4@0.96 | RETAIN_CURRENT         | 몬스터 요리와 파티 반응 개그가 반복된다.             |
| darkness              | K2      | U   | K2@0.93 | RETAIN_CURRENT         | 죽음 위험은 있으나 모험·요리 톤이 완충한다.          |
| mentalStress          | K1      | U   | K2@0.90 | REPLACE_WITH_NEW_VALUE | 구조 기한·부상·자원 압박이 반복되지만 행위성이 있다. |
| romance               | K0      | U   | U       | SET_UNKNOWN            | 공식 진입 범위로 로맨스 반복 부재를 확정할 수 없다.  |
| emotionalWarmth       | K3      | U   | K3@0.94 | RETAIN_CURRENT         | 구조 의지·공동 식사·우정이 반복 보상이다.            |

### kingdom

| Axis                  | Current | R   | Final   | Disposition            | 근거 요약                                                |
| --------------------- | ------- | --- | ------- | ---------------------- | -------------------------------------------------------- |
| progression           | K3      | U   | K3@0.94 | RETAIN_CURRENT         | 검술 훈련과 신분·역할 상승이 사건과 균형이다.            |
| problemSolving        | K2      | U   | K2@0.92 | RETAIN_CURRENT         | 전술적 돌파와 직접 전투가 함께 해결한다.                 |
| strategy              | K3      | U   | K4@0.96 | REPLACE_WITH_NEW_VALUE | 도성 탈환, 산민족 동맹, 수적 열세, 위장·침투가 반복된다. |
| pacing                | K4      | U   | K4@0.96 | RETAIN_CURRENT         | 장소·세력·목표가 빠르게 바뀐다.                          |
| mysteryReveal         | K1      | U   | K1@0.80 | RETAIN_CURRENT         | 그림자 정체 공개는 있으나 보상 중심은 아니다.            |
| worldBuilding         | K4      | U   | K4@0.98 | RETAIN_CURRENT         | 전국시대·조정·세력·산민족 규칙이 지속 제약이다.          |
| characterArcWeight    | K3      | U   | K3@0.93 | RETAIN_CURRENT         | 상실·야망·왕의 동기가 사건과 균형이다.                   |
| relationshipStructure | K3      | U   | K3@0.92 | RETAIN_CURRENT         | 핵심 삼인조와 여러 세력 관계가 교차한다.                 |
| comedy                | K1      | U   | K1@0.72 | RETAIN_CURRENT         | 가벼운 말다툼이 제한적으로 반복된다.                     |
| darkness              | K4      | U   | K3@0.94 | REPLACE_WITH_NEW_VALUE | 전쟁고아·살인·유혈이 크지만 영웅적 희망이 완충한다.      |
| mentalStress          | K3      | U   | K2@0.91 | REPLACE_WITH_NEW_VALUE | 위협은 지속되나 핵심 인물의 행위성과 결속이 안정적이다.  |
| romance               | K0      | U   | U       | SET_UNKNOWN            | 공식 진입 근거로 로맨스 반복 부재를 확정할 수 없다.      |
| emotionalWarmth       | K1      | U   | K2@0.91 | REPLACE_WITH_NEW_VALUE | 맹세·충성·동료 보호가 전쟁과 혼재한다.                   |

### bocchi-the-rock

| Axis                  | Current | R   | Final   | Disposition    | 근거 요약                                                          |
| --------------------- | ------- | --- | ------- | -------------- | ------------------------------------------------------------------ |
| progression           | K4      | U   | K4@0.96 | RETAIN_CURRENT | 가입·공연·아르바이트·학원제·페스티벌로 숙련 보상이 반복된다.       |
| problemSolving        | K2      | U   | U       | SET_UNKNOWN    | 도전은 있으나 제약 분석·기발한 해결의 반복 근거가 부족하다.        |
| strategy              | K0      | U   | U       | SET_UNKNOWN    | 목표는 있으나 장기 계획·운영 빈도를 확정할 수 없다.                |
| pacing                | K2      | U   | K2@0.86 | RETAIN_CURRENT | 권·arc 단위로 일반적인 속도의 변화가 이어진다.                     |
| mysteryReveal         | K0      | U   | K0@0.80 | RETAIN_CURRENT | 세 권과 제1화의 보상은 밴드·불안·공연이며 단서 공개 구조가 아니다. |
| worldBuilding         | K2      | U   | K2@0.84 | RETAIN_CURRENT | 학교·라이브하우스·밴드·페스티벌 규칙이 기능적으로 반복된다.        |
| characterArcWeight    | K4      | U   | K4@0.97 | RETAIN_CURRENT | 대인불안에서 친구·밴드·무대로 나아가는 변화가 핵심이다.            |
| relationshipStructure | K2      | U   | K2@0.94 | RETAIN_CURRENT | 결속밴드 고정 그룹과 핵심 조연 구조다.                             |
| comedy                | K4      | U   | K4@0.98 | RETAIN_CURRENT | 공식 4컷·Comedy 분류와 반복 상황 개그가 직접 근거다.               |
| darkness              | K0      | U   | K0@0.86 | RETAIN_CURRENT | 반복 stakes가 무대 실패·창피·경쟁이며 밝은 코미디 톤이다.          |
| mentalStress          | K4      | U   | K4@0.98 | RETAIN_CURRENT | 극심한 사회불안과 낯선 무대 압박이 지속된다.                       |
| romance               | K0      | U   | U       | SET_UNKNOWN    | 공식 소개의 미기재만으로 known 0을 만들 수 없다.                   |
| emotionalWarmth       | K4      | U   | K4@0.94 | RETAIN_CURRENT | 고립에서 벗어나는 친구·밴드 유대가 반복 보상이다.                  |

### monster

| Axis                  | Current | R   | Final   | Disposition            | 근거 요약                                                 |
| --------------------- | ------- | --- | ------- | ---------------------- | --------------------------------------------------------- |
| progression           | K0      | U   | K0@0.88 | RETAIN_CURRENT         | 보상은 숙련보다 윤리 선택·추적·진실 공개다.               |
| problemSolving        | K4      | U   | K3@0.86 | REPLACE_WITH_NEW_VALUE | 증언·메일·수사 단서를 따르지만 직접 행동과 혼합된다.      |
| strategy              | K2      | U   | K1@0.78 | REPLACE_WITH_NEW_VALUE | 단기 추적·회피는 있으나 장기 운영 중심은 아니다.          |
| pacing                | K4      | U   | K3@0.90 | REPLACE_WITH_NEW_VALUE | 시간·장소·목표가 자주 바뀌지만 매 장면 급변은 아니다.     |
| mysteryReveal         | K4      | U   | K4@0.99 | RETAIN_CURRENT         | Johan의 정체·살인·메일·쌍둥이 과거 공개가 핵심이다.       |
| worldBuilding         | K2      | U   | K2@0.90 | RETAIN_CURRENT         | 병원·BKA·통일 전후 독일이 기능적 환경을 만든다.           |
| characterArcWeight    | K4      | U   | K4@0.96 | RETAIN_CURRENT         | Tenma의 의료 윤리·책임과 Nina의 충격이 핵심이다.          |
| relationshipStructure | K4      | U   | K3@0.88 | REPLACE_WITH_NEW_VALUE | 여러 인물이 교차하지만 진입 범위는 Tenma 중심성이 강하다. |
| comedy                | K0      | U   | K0@0.90 | RETAIN_CURRENT         | 공식 psycho-suspense와 살인·추적이 반복 사건이다.         |
| darkness              | K4      | U   | K4@0.99 | RETAIN_CURRENT         | 가족 총격·연쇄살인·아동 충격이 반복 중심이다.             |
| mentalStress          | K4      | U   | K4@0.98 | RETAIN_CURRENT         | 충격·책임·누명·추격·살인 위협이 지속된다.                 |
| romance               | K1      | U   | K1@0.86 | RETAIN_CURRENT         | Eva와의 약혼·갈등은 존재하나 추적보다 하위다.             |
| emotionalWarmth       | K1      | U   | U       | SET_UNKNOWN            | 생명 구호는 있으나 유대·힐링의 반복 보상 근거가 부족하다. |

### blue-lock

| Axis                  | Current | R   | Final   | Disposition            | 근거 요약                                                             |
| --------------------- | ------- | --- | ------- | ---------------------- | --------------------------------------------------------------------- |
| progression           | K4      | U   | K4@0.98 | RETAIN_CURRENT         | 순위·자기 무기·각성·승리의 성장 보상이 반복된다.                      |
| problemSolving        | K4      | U   | K3@0.90 | REPLACE_WITH_NEW_VALUE | 상대·팀 문제를 읽지만 분석과 직접 경기력이 함께 해결한다.             |
| strategy              | K3      | U   | K2@0.94 | REPLACE_WITH_NEW_VALUE | 팀 리그와 경기 계획은 단기 전술이며 장기 운영은 아니다.               |
| pacing                | K4      | U   | K4@0.95 | RETAIN_CURRENT         | 실패·입소·선별·팀전·내분이 짧은 간격으로 이어진다.                    |
| mysteryReveal         | K1      | U   | K0@0.88 | REPLACE_WITH_NEW_VALUE | 세 권의 보상은 경기·무기·각성·선별이고 은유는 미스터리 장치가 아니다. |
| worldBuilding         | K2      | K2  | K2@0.94 | RETAIN_CURRENT         | 300명·탈락·기숙사·팀 리그 규칙이 기능적으로 반복된다.                 |
| characterArcWeight    | K3      | U   | K3@0.93 | RETAIN_CURRENT         | Isagi의 에고 변화와 동료 사연이 경기 구조와 균형이다.                 |
| relationshipStructure | K3      | U   | K2@0.93 | REPLACE_WITH_NEW_VALUE | Team Z와 라이벌은 고정되지만 관계망 자체가 보상은 아니다.             |
| comedy                | K1      | U   | K1@0.62 | RETAIN_CURRENT         | 과장된 에고 표현은 있으나 gag 중심은 아니다.                          |
| darkness              | K1      | U   | K1@0.86 | RETAIN_CURRENT         | 경력 박탈 stakes는 진지하지만 잔혹·비극 중심은 아니다.                |
| mentalStress          | K4      | U   | K4@0.97 | RETAIN_CURRENT         | 299명 탈락·경기 생존·팀 내분 압박이 지속된다.                         |
| romance               | K0      | U   | U       | SET_UNKNOWN            | 공식 소개의 미기재만으로 known 0을 만들 수 없다.                      |
| emotionalWarmth       | K1      | U   | U       | SET_UNKNOWN            | 공동 경기는 있으나 유대·돌봄이 반복 보상인지 근거가 부족하다.         |

## Genre tag disposition

`Blind`는 `A/B/R`의 존재 여부다.

| Work                   | Tag            | Current | Blind | Final | Disposition | 근거 요약                                            |
| ---------------------- | -------------- | ------- | ----- | ----- | ----------- | ---------------------------------------------------- |
| jojo-bizarre-adventure | action         | P       | -/P/- | P     | KEEP_TAG    | 직접 전투가 반복 중심이다.                           |
| jojo-bizarre-adventure | fantasy        | P       | -/P/- | P     | KEEP_TAG    | 흡혈귀·가면·Ripple이 직접 근거다.                    |
| jojo-bizarre-adventure | historical     | P       | P/P/P | P     | KEEP_TAG    | 19세기 영국 배경이 명시된다.                         |
| jojo-bizarre-adventure | mystery        | -       | P/P/P | P     | ADD_TAG     | 가면 기능과 Dio 생존 공개가 주요 보상이다.           |
| jojo-bizarre-adventure | horror         | P       | -/-/- | P     | KEEP_TAG    | 흡혈귀·언데드·신체 공포가 반복된다.                  |
| berserk                | action         | P       | P/P/P | P     | KEEP_TAG    | 직접 전투가 중심이다.                                |
| berserk                | fantasy        | P       | P/-/- | P     | KEEP_TAG    | 사도·악령·낙인 규칙이 반복된다.                      |
| berserk                | horror         | P       | P/P/P | P     | KEEP_TAG    | 잔혹한 초자연 위협이 반복된다.                       |
| dr-stone               | action         | P       | -/-/- | P     | KEEP_TAG    | 위험·대결과 직접 행동이 반복된다.                    |
| dr-stone               | fantasy        | -       | P/-/- | -     | REMOVE_TAG  | 석화 세계를 fantasy로 확정할 근거가 부족하다.        |
| dr-stone               | scienceFiction | P       | P/P/P | P     | KEEP_TAG    | 과학 재건이 중심이다.                                |
| dr-stone               | mystery        | -       | P/P/P | -     | REMOVE_TAG  | 미스터리는 보조 축이지 Genre 중심성이 아니다.        |
| dr-stone               | comedy         | P       | -/-/- | P     | KEEP_TAG    | 과학 과장·반응 개그가 반복된다.                      |
| 20th-century-boys      | scienceFiction | P       | -/-/- | -     | REMOVE_TAG  | 원판 1–3권에서 Genre 중심성을 충족하지 못한다.       |
| 20th-century-boys      | mystery        | P       | P/P/P | P     | KEEP_TAG    | 상징·Friend·사건 추적이 핵심이다.                    |
| dungeon-meshi          | action         | P       | -/-/- | P     | KEEP_TAG    | 몬스터 전투가 반복된다.                              |
| dungeon-meshi          | fantasy        | P       | P/P/P | P     | KEEP_TAG    | 던전·몬스터 생태 규칙이 중심이다.                    |
| dungeon-meshi          | comedy         | P       | P/-/- | P     | KEEP_TAG    | 요리와 파티 반응 개그가 반복된다.                    |
| kingdom                | action         | P       | P/P/P | P     | KEEP_TAG    | 전투·침투가 중심이다.                                |
| kingdom                | historical     | P       | P/P/P | P     | KEEP_TAG    | 전국시대 역사 배경이 기능한다.                       |
| bocchi-the-rock        | comedy         | P       | -/-/- | P     | KEEP_TAG    | 공식 Comedy·4컷 분류가 직접 근거다.                  |
| bocchi-the-rock        | sliceOfLife    | P       | -/-/- | P     | KEEP_TAG    | 학교·밴드 일상이 반복 구조다.                        |
| monster                | mystery        | P       | P/P/- | P     | KEEP_TAG    | 추적과 진실 공개가 핵심이다.                         |
| monster                | horror         | -       | P/P/- | P     | ADD_TAG     | 공식 psycho-suspense와 반복 살인·아동 공포가 근거다. |
| blue-lock              | sports         | P       | P/P/P | P     | KEEP_TAG    | 축구 선별·경기가 중심이다.                           |

## Theme tag disposition

`Current`, `Blind`, `Final`의 숫자는 centrality이며 `Blind` 순서는 `A/B/R`이다.

| Work                   | Theme                    | Current | Blind | Final | Disposition | 근거 요약                                                  |
| ---------------------- | ------------------------ | ------- | ----- | ----- | ----------- | ---------------------------------------------------------- |
| jojo-bizarre-adventure | adventure                | 2       | -/-/- | 2     | KEEP_TAG    | 추격·여정이 반복된다.                                      |
| jojo-bizarre-adventure | combat                   | 2       | -/-/- | 2     | KEEP_TAG    | 직접 전투가 중심이다.                                      |
| jojo-bizarre-adventure | martialArts              | 2       | -/-/- | 2     | KEEP_TAG    | Ripple 수련·전투가 반복된다.                               |
| jojo-bizarre-adventure | revenge                  | 2       | -/-/- | 2     | KEEP_TAG    | Dio와의 보복 동기가 중심이다.                              |
| jojo-bizarre-adventure | historicalReconstruction | 1       | 1/-/- | 1     | KEEP_TAG    | 19세기 영국 맥락은 하위지만 반복된다.                      |
| berserk                | adventure                | 1       | -/-/- | 1     | KEEP_TAG    | 이동·의뢰가 하위 반복 소재다.                              |
| berserk                | combat                   | 2       | 2/2/2 | 2     | KEEP_TAG    | 전투가 중심이다.                                           |
| berserk                | revenge                  | 2       | -/-/- | 2     | KEEP_TAG    | 복수 동기가 중심이다.                                      |
| dr-stone               | adventure                | 2       | 2/2/2 | 2     | KEEP_TAG    | 탐사·재건 여정이 중심이다.                                 |
| dr-stone               | survival                 | 2       | 2/2/2 | 2     | KEEP_TAG    | 생존 자원 제약이 중심이다.                                 |
| dr-stone               | crafting                 | 2       | 2/2/2 | 2     | KEEP_TAG    | 제작이 핵심 mechanic이다.                                  |
| dr-stone               | postApocalypse           | 2       | 2/2/2 | 2     | KEEP_TAG    | 문명 붕괴 후 재건이 중심이다.                              |
| dr-stone               | exploration              | 1       | -/1/- | 1     | KEEP_TAG    | 탐색은 하위 반복 소재다.                                   |
| 20th-century-boys      | politics                 | 2       | -/-/- | -     | REMOVE_TAG  | 진입 범위에서 정치 운영 중심성을 충족하지 못한다.          |
| 20th-century-boys      | investigation            | 2       | 2/2/2 | 2     | KEEP_TAG    | 사건·상징 추적이 핵심이다.                                 |
| 20th-century-boys      | school                   | -       | -/1/- | 1     | ADD_TAG     | 과거 학교 경험이 현재 미스터리와 반복 연결된다.            |
| 20th-century-boys      | workplace                | -       | -/1/- | 1     | ADD_TAG     | 편의점·직업 생활이 하위 반복 맥락이다.                     |
| 20th-century-boys      | foundFamily              | 1       | 1/1/- | -     | REMOVE_TAG  | 보호 관계는 있으나 Theme 중심성을 충족하지 못한다.         |
| 20th-century-boys      | postApocalypse           | 1       | -/-/- | -     | REMOVE_TAG  | 원판 1–3권 범위에서 종말 이후 상태는 아직 중심이 아니다.   |
| dungeon-meshi          | adventure                | 2       | -/1/- | 2     | KEEP_TAG    | 던전 여정이 중심이다.                                      |
| dungeon-meshi          | combat                   | 2       | -/-/- | 2     | KEEP_TAG    | 몬스터 전투가 반복된다.                                    |
| dungeon-meshi          | survival                 | 2       | -/-/- | 2     | KEEP_TAG    | 식량·체력·구조 기한이 중심 제약이다.                       |
| dungeon-meshi          | investigation            | -       | -/-/- | 1     | ADD_TAG     | 갑옷·보물·그림·던전 성질 확인이 하위 반복 소재다.          |
| dungeon-meshi          | dungeon                  | 2       | 2/2/2 | 2     | KEEP_TAG    | 던전 규칙이 핵심 mechanic이다.                             |
| dungeon-meshi          | cooking                  | 2       | 2/2/2 | 2     | KEEP_TAG    | 몬스터 조리가 핵심 mechanic이다.                           |
| dungeon-meshi          | school                   | -       | -/-/- | 1     | ADD_TAG     | 마법학교 과거가 진입 범위 인물 이해에 반복 연결된다.       |
| dungeon-meshi          | exploration              | 2       | -/-/- | 2     | KEEP_TAG    | 층별 탐색이 중심이다.                                      |
| kingdom                | adventure                | 2       | -/1/- | 2     | KEEP_TAG    | 도성·산지 이동과 목표 수행이 중심이다.                     |
| kingdom                | combat                   | 2       | -/2/- | 2     | KEEP_TAG    | 전투가 중심이다.                                           |
| kingdom                | martialArts              | 1       | -/-/- | 1     | KEEP_TAG    | 검술 훈련이 하위 반복 소재다.                              |
| kingdom                | war                      | 2       | 2/2/2 | 2     | KEEP_TAG    | 전쟁·병력 대결이 중심이다.                                 |
| kingdom                | politics                 | 2       | -/-/- | 2     | KEEP_TAG    | 왕위·조정·동맹 운영이 중심이다.                            |
| kingdom                | revenge                  | 1       | -/-/- | 1     | KEEP_TAG    | 상실에 대한 보복이 하위 동기다.                            |
| kingdom                | historicalReconstruction | 2       | 2/2/2 | 2     | KEEP_TAG    | 전국시대 사건·세력이 중심이다.                             |
| bocchi-the-rock        | tournament               | -       | -/-/- | 1     | ADD_TAG     | 3권 청소년 페스티벌·그랑프리가 단일 arc로 등장한다.        |
| bocchi-the-rock        | school                   | 1       | -/-/- | 1     | KEEP_TAG    | 학교·학원제가 반복 배경이다.                               |
| bocchi-the-rock        | workplace                | 2       | -/-/- | 1     | KEEP_TAG    | 아르바이트·라이브하우스는 반복되나 하위 소재로 재평가했다. |
| bocchi-the-rock        | foundFamily              | 2       | -/-/- | 2     | KEEP_TAG    | 결속밴드 유대가 중심이다.                                  |
| monster                | investigation            | 2       | 2/2/- | 2     | KEEP_TAG    | 살인·정체 추적이 중심이다.                                 |
| monster                | revenge                  | -       | -/1/- | -     | REMOVE_TAG  | Tenma의 동기는 개인 보복보다 책임·위협 방지다.             |
| monster                | workplace                | 1       | 1/1/- | 1     | KEEP_TAG    | 병원 직업 윤리가 하위 반복 맥락이다.                       |
| monster                | historicalReconstruction | 1       | -/-/- | 1     | KEEP_TAG    | 통일 전후 독일은 하위 역사 맥락이다.                       |
| blue-lock              | survival                 | 2       | 2/-/- | 2     | KEEP_TAG    | 탈락이 경력 상실로 이어지는 생존 구조다.                   |
| blue-lock              | tournament               | 2       | -/2/- | 2     | KEEP_TAG    | 선별·팀 리그가 중심이다.                                   |
| blue-lock              | school                   | -       | 1/1/- | -     | REMOVE_TAG  | 고등학생은 연령 조건이며 학교생활 mechanic이 아니다.       |
| blue-lock              | sportsCompetition        | 2       | 2/2/2 | 2     | KEEP_TAG    | 축구 경쟁이 핵심 mechanic이다.                             |

## 보존된 unknown과 한계

- 보존 unknown: `berserk` progression·romance, `20th-century-boys` progression·comedy, `dungeon-meshi` romance, `kingdom` romance, `bocchi-the-rock` problemSolving·strategy·romance, `monster` emotionalWarmth, `blue-lock` romance·emotionalWarmth.
- known 0은 공식 범위에서 반복 부재를 직접 판정할 수 있을 때만 유지했다. 공식 소개의 미기재만으로 0을 만들지 않았다.
- MONSTER 원판 3권과 完全版 2의 공식 절단점은 미확정이다. 그 불확실성에 기대는 후반 의미는 사용하지 않았다.
- 정식 번역판과 애니메이션은 원판 1–3권에 대응되는 사건을 교차검증하는 데만 썼다.
- 이 문서는 pre-G1 데이터 경계다. G1, G2 또는 UI 진행을 승인하지 않는다.
