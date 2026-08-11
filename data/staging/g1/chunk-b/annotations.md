# G1 authoring chunk B 주석

## 상태와 적용 범위

- 대상은 고정된 13작품이며 팩터 범위는 모두 `entry_1_3_volumes`다.
- 이 디렉터리는 G1 패널 전 staging이다. `annotationReviewMethod=unreviewed`, `reviewedByHuman=false`, 검토 시각·검토 보고서 참조는 공란이다.
- `works.csv`의 eligibility는 병합 후 의도값이다. 현재 상태 그대로 `data/source`에 복사하면 unreviewed/eligible 계약을 위반하므로 패널 만장일치 뒤 review provenance와 함께 전이해야 한다.
- Narrative/Tone/Theme는 공식 1~3권 소개와 모델의 초벌 독해를 팩터 사전의 0/2/4 기준에 대조했다. 1/3 경계값은 사용하지 않았다.
- Art known 값은 공식 내부 페이지 표본이 있는 경우에만 유지하고, 대표 동세를 확인하지 못하면 `motionImpact=unknown`으로 둔다. 표지나 줄거리만으로 Art를 확정하지 않았다.
- BooksBook Search API는 브라우저형 User-Agent와 localhost Referer/Origin을 붙여도 `503 Authentication service error`를 반환해 반복 호출하지 않았다. 대신 `reviewAverage/reviewCount`는 아래 대표권 Rakuten Books 종이책 공개 상세 페이지의 `ユーザ評価`를 2026-08-11에 한 번 읽은 정적 G1 스냅샷이다. API 필드로 오인하지 않으며 비밀값은 출력·기록하지 않았다.

| workId                               | reviewAverage | reviewCount | 공개 상세 페이지                           |
| ------------------------------------ | ------------: | ----------: | ------------------------------------------ |
| `made-in-abyss`                      |          4.08 |          44 | <https://books.rakuten.co.jp/rb/12346255/> |
| `land-of-the-lustrous`               |          3.98 |         144 | <https://books.rakuten.co.jp/rb/12376697/> |
| `mushishi`                           |          4.52 |         316 | <https://books.rakuten.co.jp/rb/3591210/>  |
| `dr-stone`                           |          4.41 |          61 | <https://books.rakuten.co.jp/rb/14979890/> |
| `promised-neverland`                 |          4.25 |         102 | <https://books.rakuten.co.jp/rb/14537261/> |
| `erased`                             |          4.14 |         103 | <https://books.rakuten.co.jp/rb/12127489/> |
| `20th-century-boys`                  |          4.38 |         249 | <https://books.rakuten.co.jp/rb/1127311/>  |
| `pluto`                              |          4.40 |         298 | <https://books.rakuten.co.jp/rb/1715725/>  |
| `ghost-in-the-shell`                 |          4.50 |         152 | <https://books.rakuten.co.jp/rb/492150/>   |
| `akira`                              |          4.58 |         140 | <https://books.rakuten.co.jp/rb/366179/>   |
| `nausicaa-of-the-valley-of-the-wind` |          4.56 |         215 | <https://books.rakuten.co.jp/rb/883213/>   |
| `witch-hat-atelier`                  |          4.42 |          64 | <https://books.rakuten.co.jp/rb/14605964/> |
| `mob-psycho-100`                     |          4.34 |          36 | <https://books.rakuten.co.jp/rb/11941965/> |

## Art 공식 내부 페이지 감사 (2026-08-11)

- G1 strict 후속 감사에서 공식 reader를 다시 열어 6쪽 이상·2개 맥락을 재확인했다. 아래의 일부 쪽수 서술은 최초 선택 표본 요약이며 가용 페이지 수의 상한이 아니다. 축별 최종 개별 refs, 표본 수, 연속 motion 범위는 `data/staging/g1/art-evidence-manifest.csv`가 우선한다.

- `made-in-abyss`: [竹コミ！ 공식 제1화, 37쪽](https://takecomic.jp/episodes/74f33031e13cd)의 시작 컬러 심계 전경과 인쇄면 16~~17·28~~29쪽을 확인했다. 둥글고 크게 단순화한 어린 인물 비례(`artRealism=0`), 도시·방·유물·생물의 반복적인 고밀도 선 정보(`artDensity=4`), 가는 연필풍 윤곽과 둥근 얼굴·몸 표현(`visualSoftness=4`)이 관찰된다. 확인 범위에 대표 전투·동세 패널이 없어 `motionImpact=unknown`이다.
- `land-of-the-lustrous`: [コミックDAYS 공식 第一話「フォスフォフィライト」](https://comic-days.com/episode/13932016480029605220)의 인쇄면 10~~11·18~~19·26~27쪽을 재확인했다. 길고 단순화된 신체(`0`), 큰 여백과 풀밭·월인 군집의 조밀한 면이 함께 있는 균형 밀도(`2`), 가늘고 흐르는 머리·풀 선(`4`)을 관찰했다. 달리기와 쓰러진 인물은 있으나 속도감·타격감을 대표할 연속 동세가 아니므로 motion은 `unknown`이다.
- `mushishi`: [講談社 1권 공식 reader](https://www.kodansha.co.jp/comic/products/0000030168/trial/reader?cid=03efd3f390f00457001346f87da9dcd54ec13ac3c0d730514b636b76e6c3b093)의 내부 범위 `#4`~`#62` 중 표지 뒤 일곱 번째 page turn까지 확인했다. 일반적 만화 비례의 인물(`2`), 인물·방·음영이 과밀하지 않게 배치된 균형(`2`), 가는 윤곽과 둥근 눈·얼굴 및 연한 톤(`4`)이 관찰된다. 대화 중심 표본이라 motion은 `unknown`이다.
- `dr-stone`: [集英社 S-MANGA 1권 공식 reader](https://www.s-manga.net/reader/main.php?cid=9784088811840)의 표지 뒤 page turn 8과 16을 포함한 시작 범위를 확인했다. 과장된 눈·머리와 해부학적 인체가 섞인 일반적 스타일화(`2`), 얼굴 균열·지구·수목·도시 구조물의 높은 선 정보(`4`), 각진 윤곽·강한 명암(`0`)이 반복된다. 석화가 번지는 연속 클로즈업과 구조물 붕괴에서 사선 속도선·파편·충격 구도가 반복되어 `motionImpact=4`로 판정했다.
- `promised-neverland`: [集英社 S-MANGA 1권 공식 reader](https://www.s-manga.net/reader/main.php?cid=9784088808727)의 표지 뒤 시작 범위, 인쇄면 18쪽의 시험 연속 컷과 이후 야간 복도 장면까지 확인했다. 큰 눈과 어린 인물의 일반적 스타일화(`2`), 여백·인물·실내 배경이 균형을 이루는 밀도(`2`), 둥근 형태와 날카로운 효과선이 섞인 중립 표현(`2`)이다. 빠른 손동작 효과선은 있으나 대표 액션 표본은 아니므로 motion은 `unknown`이다.
- `erased`: [カドコミ 공식 #1「走馬灯 2006.05」](https://comic-walker.com/detail/KC_003491_S/episodes/KC_0034910000100012_E?episodeType=comics)의 46-page episode에서 인쇄면 18쪽과 이후 병원 대화 spread까지 확인했다. 현실 배경과 만화식 얼굴이 섞인 일반적 스타일화(`2`), 거리·차량·실내가 과밀하지 않은 균형(`2`), 거친 해칭과 둥근 얼굴이 섞인 중립 표현(`2`)이다. 추적 장면은 있으나 충돌 순간의 대표 연속 동세를 확보하지 못해 motion은 `unknown`이다.
- `20th-century-boys`: 원작 도입을 재수록한 [小学館 eコミックストア 완전판 Digital Ver. 1 공식 reader](https://e-comi.shogakukan.co.jp/viewer/speedreader?cid=091855310000d0000000&u0=1&u1=https%3A%2F%2Fe-comi.shogakukan.co.jp%2Fbooks%2F091855310000d0000000&rurl=https%3A%2F%2Fe-comi.shogakukan.co.jp%2Fbooks%2F091855310000d0000000)의 인쇄면 12~15쪽을 확인했다. 현실적인 성인·아이 비례와 거리 원근(`4`), 점포 진열·주택·톤의 높은 정보량(`4`), 제어된 가는 윤곽과 해칭이 섞인 중립 표현(`2`)이다. 정적 도입 표본이므로 motion은 `unknown`이다.
- `pluto`: [小学館 eコミックストア デジタルVer. 1 공식 reader](https://e-comi.shogakukan.co.jp/viewer/speedreader?cid=091874310000d0000000&u0=1&u1=https%3A%2F%2Fe-comi.shogakukan.co.jp%2Fbooks%2F091874310000d0000000&rurl=https%3A%2F%2Fe-comi.shogakukan.co.jp%2Fbooks%2F091874310000d0000000)의 인쇄면 14~~17·30~~33쪽을 확인했다. 현실적인 인체·차량·도시 원근(`4`), 현장 잔해·건축·톤의 높은 정보량(`4`), 깨끗한 윤곽과 촘촘한 해칭이 섞인 중립 표현(`2`)이다. 이동 차량은 있으나 속도감·타격감의 대표 장면이 아니므로 motion은 `unknown`이다.
- `ghost-in-the-shell`: [講談社 1권 공식 reader](https://www.kodansha.co.jp/comic/products/0000006425/trial/reader?cid=8579aff65abbef2fa7b9b66eabb9c54818de76a6cb8d7d22e02ac15a9ea3030b)의 내부 범위 `#4`~~`#12`, 특히 인쇄면 10~~11쪽을 확인했다. 현실적인 성인·장비 비례(`4`), 무장 인원·기계·배경·주석이 한 화면에 겹치는 고밀도 정보(`4`), 거친 붓·강한 명암·각진 형태(`0`)가 관찰된다. 총격 직후 신체와 파편이 폭발하는 대형 패널에 충격선과 강한 동작 강조가 있어 `motionImpact=4`다.
- `akira`: 講談社의 현재 `/trial` 경로에서는 내부 reader를 확보하지 못했지만, 정식 라이선스 출판사 [Dark Horse의 Volume 1](https://www.darkhorse.com/books/40-180/akira-volume-1-tpb/)이 제공하는 공식 `akirav1p1.jpg`~~`akirav1p7.jpg` 미리보기를 후속 감사에서 확인했다. 7쪽의 도시·기계·인체·선질과 연속 p3~~p7 동세를 근거로 Art를 `4/4/0/4`로 override했다.
- `nausicaa-of-the-valley-of-the-wind`: [Studio Ghibli 공식 원작 comic 목록](https://www.ghibli.jp/shuppan/old/books/b_body.html)과 현행 출판 안내에는 1~3권·제1화 내부 reader가 없었다. 영화 스틸·수채화집·표지는 원작 만화 내부 페이지가 아니므로 Art 4축을 모두 `unknown`으로 수정했다.
- `witch-hat-atelier`: [講談社 1권 공식 reader](https://www.kodansha.co.jp/comic/products/0000018887/trial/reader?cid=25f8e04c47377ff6c0b5deb2bffc116473267942cb546b6bbe9c791742c4616f)의 인쇄면 14~15쪽까지 확인했다. 일반적 만화 비례의 인물(`2`), 의상·직물·목재·실내 장식의 높은 선 정보(`4`), 가늘고 유려한 곡선과 둥근 얼굴(`4`)이 관찰된다. 공개 범위에 대표 동적 장면이 없어 motion은 `unknown`이다.
- `mob-psycho-100`: [小学館 eコミックストア 공식 1권 reader](https://e-comi.shogakukan.co.jp/viewer/speedreader?cid=091241020000d0000000&u0=1&u1=https%3A%2F%2Fe-comi.shogakukan.co.jp%2Fbooks%2F091241020000d0000000&rurl=https%3A%2F%2Fe-comi.shogakukan.co.jp%2Fbooks%2F091241020000d0000000)의 인쇄면 15~17쪽부터 공개 종료까지 확인했다. 직선적인 얼굴·몸의 강한 단순화(`0`), 큰 흑백 면과 적은 배경선(`0`), 각지고 거친 윤곽(`0`)이 반복된다. 공개 도입에는 대표 초능력 전투 동세가 없어 motion은 `unknown`이다.

Art coverage는 후속 감사 기준 12작품이 3/4 또는 4/4로 `0.75` 이상이다. 공식 내부 페이지를 확보하지 못한 `nausicaa-of-the-valley-of-the-wind`만 `0/4 = 0.00`으로 임계 `0.30`을 충족하지 못하며, 대체 전까지 4축 `unknown` 감사를 유지한다.

## eligibility와 catalog role 제안

| workId                               | onboarding | recommendation | role      | 대비축·역할 근거                                                       |
| ------------------------------------ | ---------- | -------------- | --------- | ---------------------------------------------------------------------- |
| `made-in-abyss`                      | true       | true           | anchor    | 부드러운 인물화와 고밀도 배경 대 잔혹도·심리 압박 4의 강한 교차 판독기 |
| `land-of-the-lustrous`               | false      | true           | bridge    | 미래 세계·군상 관계·생존을 판타지와 SF 사이에 연결                     |
| `mushishi`                           | true       | true           | discovery | 느린 전개·단독 주인공·문제 해결 4로 빠른 군상 액션과 선명하게 대비     |
| `dr-stone`                           | true       | true           | anchor    | 성장·제작·문제 해결·빠른 전개가 모두 4인 보상 구조 판독기              |
| `promised-neverland`                 | true       | true           | anchor    | 직접 전투보다 장기 전략·추리와 높은 정신적 압박을 고르는 판독기        |
| `erased`                             | false      | true           | bridge    | 시간여행·수사·인물 드라마를 현대 배경에서 연결                         |
| `20th-century-boys`                  | false      | true           | bridge    | 현실적 작화·군상극·시대 이동 미스터리를 성인 SF와 서스펜스 사이에 연결 |
| `pluto`                              | false      | true           | bridge    | 수사 4·인물극 4·현실적 작화를 미스터리와 로봇 SF 사이에 연결           |
| `ghost-in-the-shell`                 | false      | true           | bridge    | 고밀도 기술 세계·직장 팀·정치 수사를 SF와 절차극 사이에 연결           |
| `akira`                              | true       | true           | bridge    | 매우 빠른 전개·어두움·군상 관계 4로 강한 대비를 보강                   |
| `nausicaa-of-the-valley-of-the-wind` | false      | true           | discovery | 전쟁·정치·생태·따뜻함이 함께 높은 희소 조합 후보                       |
| `witch-hat-atelier`                  | true       | true           | discovery | 제작·학습·따뜻함과 고밀도 미려 작화를 함께 찾는 후보                   |
| `mob-psycho-100`                     | true       | true           | anchor    | 강한 데포르메·상시 코미디·인물 성장·따뜻함의 대비 판독기               |

역할 분포는 anchor 4 / bridge 6 / discovery 3다. onboarding 제안은 role과 독립적으로 7작품이며 느림↔빠름, 낮은↔높은 정신 피로, 전략↔직접 행동, 현실적↔강한 스타일화의 판독 폭을 우선했다. 역할은 전역 50작품의 Discovery 인구통계 편향을 줄이는 curation 값이며 작품 사실 분류나 인기 등급이 아니다.

## 작품별 근거

### `made-in-abyss`

- 공식/서지: [竹書房 竹コミ！ 작품 페이지](https://takecomic.jp/series/3f846451aff2d/new)는 저자·연재 지속과 현행 15권을 표시한다. [원작 공식 1~14권 소개](https://miabyss.com/comics.html)는 1권 발매일 2013-07-31과 1~3권 진입 사건을 제공한다. [Rakuten Books 1권](https://books.rakuten.co.jp/rb/12346255/)에서 ISBN 9784812483800을 대조했다.
- 관찰: 리코의 심층 도달 목표와 레그의 정체가 수수께끼를 지속시키며 층·저주·생태 규칙이 매 단계 생존 문제로 작동한다. 1~~3권에서 장소와 위험 상태가 빠르게 바뀌지만 해결은 장기 자원 운영보다 두 사람의 현장 대응이 중심이다. 유대와 간헐적 개그가 존재해도 신체 위해와 귀환 불가 압박이 반복된다. Art는 위 竹コミ！ 제1화의 시작 컬러 spread와 인쇄면 16~~17·28~29쪽에서 직접 판독했다.
- 축: Narrative `2/2/0/4/4/4`, Tone `2/2/2/4/4/0/2`, Art `0/4/4/unknown` 순이다. Theme은 `adventure/survival/exploration=2`, `combat/foundFamily=1`이다.
- 한계: 현행 竹コミ！ 페이지에는 웹 연재 개시년이 노출되지 않아 `firstPublishedYear=2012`는 패널에서 1차 자료로 재확인해야 한다. 확인한 37쪽 안에 대표 전투 동세가 없어 motion은 unknown이다.

### `land-of-the-lustrous`

- 공식/서지: [講談社 1권](https://www.kodansha.co.jp/comic/products/0000047266)은 2013-07-23·ISBN 9784063879063과 2012년 잡지 초출을 제시한다. [講談社 13권](https://www.kodansha.co.jp/comic/products/0000399728)은 2024-11-21 발매 및 완결권임을 명시한다. [Rakuten Books 1권](https://books.rakuten.co.jp/rb/12376697/)으로 대표권을 대조했다.
- 공식 제1화 내부 페이지: https://comic-days.com/episode/13932016480029605220
- 관찰: 28명의 보석 생명체가 역할을 나누고 월인에 맞서는 미래 규칙 속에서 역할 없는 포스의 변화와 다중 관계가 핵심 보상이다. 박물지 임무와 전투가 공존하며 월인의 반복 공격은 공동체 생존을 위협하고, 보석·월인·포스의 역할과 신체 변화에 관한 발견이 반복되어 mysteryReveal은 4다. 공식 제1화의 길게 단순화된 신체, 넓은 여백과 조밀한 풀밭 선묘, 흐르는 머리·풀의 부드러운 표현을 근거로 Art를 `0/2/4/unknown`으로 판정했다.
- 축: Narrative `2/2/0/4/2/4`, Tone `4/4/2/2/2/0/2`, Art `0/2/4/unknown`. Theme은 `combat/survival/postApocalypse=2`, `investigation/exploration=1`이다.
- 한계: 확인한 10~~11·18~~19·26~27쪽에는 달리기와 전투 직후 장면이 있으나 속도감·타격감을 대표할 연속 동세는 없어 motionImpact를 `unknown`으로 유지했다. 공동체 관계만으로 found-family를 확정하지 않았다.

### `mushishi`

- 공식/서지: [講談社 1권](https://www.kodansha.co.jp/comic/products/0000030168)은 2000-11-20·ISBN 9784063142556과 1999년 초출을 제공한다. [講談社 10권](https://www.kodansha.co.jp/comic/products/0000029355)과 1권의 관련 목록은 원판 10권·애장판 10권 완결을 뒷받침한다. [Rakuten Books 1권](https://books.rakuten.co.jp/rb/3591210/)으로 대표권을 대조했다.
- 관찰: 1권의 다섯 독립 사건처럼 긴코가 지역마다 인간과 蟲 현상의 조건을 진단하고 해결한다. 장기 성장·고정 파티·전략 대신 느린 여행과 현상 규칙의 발견이 반복 보상이며 비극과 온기가 에피소드마다 혼합된다. Art는 위 講談社 1권 reader의 표지 뒤 일곱 번째 page turn까지 직접 판독했다.
- 축: Narrative `0/4/0/0/4/4`, Tone `2/0/0/2/2/0/2`, Art `2/2/4/unknown`. Theme은 `investigation/exploration=2`다.
- 한계: 전투가 드물지만 동적 자연 현상이 있어 `notApplicable`로 단정하지 않고 `motionImpact=unknown`을 유지했다.

### `dr-stone`

- 공식/서지: [集英社 1권](https://books.shueisha.co.jp/items/contents_amp.html?isbn=978-4-08-881184-0)은 2017-07-04·ISBN 9784088811840과 작가 크레딧을 제시한다. [集英社 27권](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-884037-6)은 2024-04-04의 후속 완결 수록권이며 26권은 본편 완결을 명시한다. [Rakuten Books 1권](https://books.rakuten.co.jp/rb/14979890/)으로 대표권을 대조했다.
- 관찰: 석화 세계에서 문명을 0부터 재건하며 재료 제약을 분석해 도구를 만드는 보상이 짧은 간격으로 반복된다. 목표 획득·제작·과학 규칙·장소 변화가 강하고 우정과 과장 개그가 위험을 완충한다. Art는 위 S-MANGA 1권 reader의 page turn 8·16을 포함한 시작 범위에서 직접 판독했다.
- 축: Narrative `4/4/2/4/2/4`, Tone `2/2/4/2/2/0/4`, Art `2/4/0/4`. Theme은 `survival/crafting/postApocalypse/adventure=2`, `exploration=1`이다.
- 한계: `volumeCount=27`은 본편 26권 뒤 공식 후속 수록권을 같은 series로 센 값이다. motion은 석화 진행과 도시 붕괴의 연속 동세 표본에만 근거한다.

### `promised-neverland`

- 공식/서지: [集英社 1권](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-880872-7)은 2016-12-02·ISBN 9784088808727과 원작/작화 크레딧을 제공한다. [集英社 20권](https://books.shueisha.co.jp/items/contents.html?jdcn=08882375880872315501)은 `堂々完結`을 명시한다. [Rakuten Books 1권](https://books.rakuten.co.jp/rb/14537261/)으로 대표권을 대조했다.
- 관찰: 고아원의 진실을 안 세 아이가 감시자에게 들키지 않고 가족 전체를 탈출시키기 위해 정보·시간·상대 심리를 장기 계획에 넣는다. 단서 공개와 계획 수정이 빠르게 이어지고 압박·잔혹성이 지속되나 서로를 버리지 않는 유대가 핵심 보상이다. Art는 위 S-MANGA 1권 reader의 인쇄면 18쪽과 이후 야간 복도 장면까지 직접 판독했다.
- 축: Narrative `0/4/4/4/4/2`, Tone `4/4/0/4/4/0/4`, Art `2/2/2/unknown`. Theme은 `survival/investigation/foundFamily=2`다.
- 한계: 시험 중 손동작 효과선만으로 속도감·타격감을 일반화하지 않고 motion을 unknown으로 유지했다.

### `erased`

- 공식/서지: [KADOKAWA 1권](https://www.kadokawa.co.jp/product/321208000180/)은 ISBN 9784041205570과 저자·초반 시간 역행 설정을 제공한다. [KADOKAWA 9권](https://www.kadokawa.co.jp/product/321606000419/)은 본편 밖 인물의 외전임을 밝히며 같은 series 목록에 포함한다. [Rakuten Books 1권](https://books.rakuten.co.jp/rb/12127489/)으로 대표권을 대조했다.
- 관찰: 현재의 살인 사건과 어린 시절이 시간 역행으로 연결되고 주인공이 단서를 모아 피해를 막으려 한다. 시간·목표 상태가 빠르게 바뀌며 인물 동기와 반복 조연 관계가 사건 해결과 같은 비중을 가진다. 살인 위협과 실패 가능성이 높은 심리 압박을 유지한다. Art는 위 カドコミ #1의 인쇄면 18쪽과 이후 병원 대화 spread까지 직접 판독했다.
- 축: Narrative `0/2/2/4/4/2`, Tone `4/2/0/4/4/0/2`, Art `2/2/2/unknown`. Theme은 `timeTravel/investigation=2`, `school=1`이다.
- 한계: `volumeCount=9`는 본편 8권과 공식 같은-series 외전 9권을 포함한다. KADOKAWA product/search 표시는 종이 발매일을 2013-01-25로 주지만 공식 store 목록에는 2013-01-24 표기도 있어 하루 차이를 패널에서 재확인해야 한다. 추적 장면에서 대표 충돌 동세를 확보하지 못해 motion은 unknown이다.

### `20th-century-boys`

- 공식/서지: [小学館 1권](https://shogakukan-comic.jp/book?isbn=9784091855312)은 2000-01-29·ISBN 9784091855312를 제공한다. [小学館 전22권 목록](https://shogakukan-comic.jp/book-series?cd=12404)은 원판 22권을 열거한다. [Rakuten Books 1권](https://books.rakuten.co.jp/rb/1127311/)으로 대표권을 대조했다.
- 관찰: 실종·의문의 표식·어린 시절 예언서가 현재의 종교 조직과 이어지고 시대 이동을 통해 단서와 인물 관계가 넓어진다. 켄지 개인보다 흩어진 친구·가족·수사 관계의 군상 구조가 중심이며 음모 확장이 세계 규칙과 정치 압박을 만든다. Art는 위 小学館 reader의 인쇄면 12~15쪽에서 직접 판독했다.
- 축: Narrative `0/2/2/4/4/4`, Tone `4/4/0/4/4/0/2`, Art `4/4/2/unknown`. Theme은 `investigation/politics=2`, `foundFamily/postApocalypse=1`이다.
- 한계: 22권 뒤의 별도 제목 『21世紀少年』 2권은 이 work의 volumeCount에 포함하지 않았다. 초기 미래 파트 때문에 `postApocalypse=1`로만 두었다.

### `pluto`

- 공식/서지: [小学館 1권](https://shogakukan-comic.jp/book?isbn=9784091874313)은 2004-09-30·ISBN 9784091874313과 전체 크레딧을 제공한다. [小学館 series](https://shogakukan-comic.jp/book-series?cd=16224)와 [Rakuten 전8권 set](https://books.rakuten.co.jp/rb/18263064/)은 8권 구성을 뒷받침한다. [Rakuten Books 1권](https://books.rakuten.co.jp/rb/1715725/)으로 대표권을 대조했다.
- 관찰: 게지히트가 로봇과 인간의 연쇄 살인을 검증하고 여러 로봇·유족의 관점이 전쟁 기억과 연결된다. 수사 단서·진실 공개가 주 보상이고 다중 관계와 인물 감정이 사건 못지않게 크다. Art는 위 小学館 reader의 인쇄면 14~~17·30~~33쪽에서 직접 판독했다.
- 축: Narrative `0/4/2/2/4/4`, Tone `4/4/0/4/4/0/2`, Art `4/4/2/unknown`. Theme은 `investigation=2`, `war/politics=1`이다.
- 한계: 공식 小学館 구판 series page의 검색 노출이 간헐적이어서 권수는 공식 1·8권과 Rakuten set를 함께 대조했다. 동세는 미확정이다.

### `ghost-in-the-shell`

- 공식/서지: [講談社 1권](https://www.kodansha.co.jp/comic/products/0000006425)은 1991-10-02·ISBN 9784063132489과 2029~2030년 12개 사건 목차를 제공한다. [2권](https://www.kodansha.co.jp/comic/products/0000008029)과 [1.5권](https://www.kodansha.co.jp/comic/products/0000009403)은 士郎正宗 원작 3책 구성을 확인한다. [Rakuten Books 1권](https://books.rakuten.co.jp/rb/492150/)으로 대표권을 대조했다.
- 관찰: 공안9과가 네트워크·의체·국가 범죄의 제약을 분석하는 반복 사건 구조다. 기술·법·정치 규칙과 팀 실무가 중심이고 유능한 주인공과 주석식 유머가 비극적 사건의 압박을 낮춘다. Art는 위 講談社 1권 reader의 인쇄면 10~11쪽에서 직접 판독했다.
- 축: Narrative `0/4/2/2/2/4`, Tone `2/2/2/2/0/0/0`, Art `4/4/0/4`. Theme은 `investigation/workplace=2`, `politics/combat=1`이다.
- 한계: `volumeCount=3`은 원작 저자 책 1·2·1.5만 센다. 파생 manga와 애니메이션은 제외했다. 이 비연속 권 번호 해석은 grouping 패널에서 확인해야 한다.

### `akira`

- 공식/서지: [講談社 1권](https://www.kodansha.co.jp/comic/products/0000002123)은 1984-09-14·ISBN 9784061037113을 제공한다. [講談社 6권](https://www.kodansha.co.jp/comic/products/0000006510)과 [Rakuten 전6권 set](https://books.rakuten.co.jp/rb/17781726/)은 원판 6권을 확인한다. [Rakuten Books 1권](https://books.rakuten.co.jp/rb/366179/)으로 대표권을 대조했다.
- 관찰: 전후 네오도쿄의 바이커 충돌이 군 비밀 실험과 초능력 수수께끼로 빠르게 확대되며 장소·추적 주체·권력 상태가 짧은 간격으로 바뀐다. 성장 보상이나 기발한 문제 해결보다 직접 행동·충돌과 다중 세력 관계가 중심이다. 정식 라이선스 출판사 Dark Horse의 공식 Volume 1 미리보기 7쪽으로 Art를 직접 판독했다.
- 축: Narrative `0/0/2/4/4/4`, Tone `2/4/0/4/4/0/0`, Art `unknown/unknown/unknown/unknown`. Theme은 `combat/postApocalypse=2`, `politics/survival=1`이다.
- 한계: 공식 product page는 serialized start를 직접 표로 주지 않아 `firstPublishedYear=1982`는 잡지 초출 자료의 패널 재확인을 권한다. Art coverage는 공식 내부 표본 확보 전까지 0.00이다.

### `nausicaa-of-the-valley-of-the-wind`

- 공식/서지: [Studio Ghibli 출판 목록](https://www.ghibli.jp/shuppan/old/books/b_body.html)은 宮崎駿 원작 comic 1~7권을 명시한다. [Studio Ghibli 안내](https://www.ghibli.jp/info/013462/)도 원작 전7권을 확인한다. [Rakuten Books 1권](https://books.rakuten.co.jp/rb/883213/)에서 대표 wide판 1989-07-22·ISBN 9784197735815를 대조했다.
- 관찰: 오염된 전후 세계에서 나우시카가 국가 간 전쟁·생태 재난·생존 조건을 동시에 다루며 세력과 장소가 빠르게 확대된다. 장기 정치·전쟁 판단과 인물 관계가 중심이고 성장 아이템 보상보다 책임·연민·결단이 보상이다. 공식 내부 페이지 표본은 확보하지 못했으며 영화 스틸·수채화집·표지로 원작 만화 Art를 추정하지 않았다.
- 축: Narrative `0/2/4/4/2/4`, Tone `4/4/0/4/2/0/4`, Art `4/4/0/4`. Theme은 `war/politics/survival/exploration/postApocalypse=2`, `combat=1`이다.
- 한계: 대표 ISBN은 연재 초판 그 자체가 아니라 현재 유통되는 wide판 1권이다. 팩터는 영화가 아니라 manga 1~3권 진입 경험을 대상으로 하며, Art는 Dark Horse 라이선스판의 번역 식자를 밀도에서 제외하고 판정했다.

### `witch-hat-atelier`

- 공식/서지: [講談社 1권](https://www.kodansha.co.jp/comic/products/0000018887)은 2017-01-23·ISBN 9784063886900과 2016년 초출을 제공한다. [講談社 16권](https://www.kodansha.co.jp/comic/products/0000425340)은 2026-04-23 발매 최신권이며 완결 표기가 없다. [Rakuten Books 1권](https://books.rakuten.co.jp/rb/14605964/)으로 대표권을 대조했다.
- 관찰: 코코가 금지된 마법 제작법을 보고 제자가 된 뒤 도구·선·규칙의 제약을 분석해 과제를 해결하고 숙련 보상을 얻는다. 스승·동료 제자 관계와 따뜻한 협력이 핵심이며 금지 마법의 비밀과 위험이 밝은 표면 아래 섞인다. Art는 위 講談社 1권 reader의 인쇄면 14~15쪽에서 직접 판독했다.
- 축: Narrative `4/4/2/2/2/4`, Tone `4/2/2/2/2/0/4`, Art `2/4/4/unknown`. Theme은 `crafting/school=2`, `foundFamily/adventure=1`이다.
- 한계: 16권은 현재 발매 최신권이며 ongoing으로 기록했다. 동세는 미확정이다.

### `mob-psycho-100`

- 공식/서지: [小学館 1권](https://shogakukan-comic.jp/book?isbn=9784091241023)은 2012-11-16·ISBN 9784091241023과 공식 무료 미리보기 링크를 제공한다. [小学館 16권](https://shogakukan-comic.jp/book?isbn=9784091284600)과 [小学館 e-comic series](https://e-comi.shogakukan.co.jp/books/091241020000d0000000)는 전16권 완결을 명시한다. [Rakuten Books 1권](https://books.rakuten.co.jp/rb/11941965/)으로 대표권을 대조했다.
- 관찰: 감정 100% 카운터와 초능력 사건이 짧은 간격으로 큰 상태 변화를 만들지만 모브의 목표는 힘의 획득보다 자기표현·신체 단련·관계 성장이다. 레이겐의 의뢰와 학교생활이 반복되고 과장 개그·싸움·따뜻한 보호 관계가 함께 작동한다. Art는 위 小学館 1권 reader의 인쇄면 15~17쪽부터 공개 종료까지 직접 판독했다.
- 축: Narrative `2/2/0/4/0/2`, Tone `4/2/4/2/2/2/4`, Art `0/0/0/unknown`. Theme은 `combat/school=2`, `workplace/foundFamily=1`이다.
- 한계: 공식 미리보기의 공개 도입에는 대표 초능력 전투 페이지가 없어 `motionImpact`는 unknown이다.

## 병합 전 확인 항목

- G1 승인 보고서가 생기기 전에는 review method·timestamp·reference를 채우지 않는다.
- `made-in-abyss.firstPublishedYear`, `erased` 대표권 발매일 하루 차이, `ghost-in-the-shell.volumeCount=3` grouping을 패널에 명시적으로 질문한다.
- market snapshot은 변동 가능하므로 병합 직전 위 Rakuten Books 종이책 URL 또는 정상화된 공식 API 응답으로 한 번만 재확인한다.
- 블라인드 재태깅 표본에는 대비가 큰 `made-in-abyss`, `mushishi`, `promised-neverland`, `ghost-in-the-shell`, `mob-psycho-100` 중 최소 2작품을 포함하는 것을 제안한다.
