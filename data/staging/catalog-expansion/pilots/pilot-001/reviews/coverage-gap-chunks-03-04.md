# Pilot 001 Narrative/Tone coverage-gap evidence — chunks 03–04

## 1. Scope and decision boundary

- 대상: Pilot 001 annotation Pass A의 chunk-03 및 chunk-04, 총 20작품.
- 평가 범위: 각 작품의 1~3권 또는 첫 주요 에피소드. 범위를 벗어난 자료는 현재 제안의 직접 근거로 쓰지 않았다.
- 목표: Narrative 4/6, Tone 5/7 coverage에 실제로 도움이 되는 좁은 추가 Evidence를 찾는 것. 이 문서는 Pass A CSV를 수정하거나 값을 확정하지 않는다.
- 출처 우선순위: 공식 출판사 권·작품 소개 → 공식 미리보기에서 이미 확인된 텍스트 정보 → 공식 수상기관의 초기권 심사평 → 공식 서점 → 복수 독립 리뷰.
- 유저평 사용 범위: `pacing`, `comedy`, `emotionalWarmth`, `mentalStress`, `darkness`, `romance`, `relationshipStructure`, `characterArcWeight`, 초반 반복 구조에 한정했다. 단일 리뷰·평점·목록 포함 사실은 사용하지 않았다.
- `known 0` 경계: 장르나 소개문에서의 단순 미언급을 0으로 바꾸지 않았다. 1~3권을 빠짐없이 설명하는 공식 권 소개 또는 명시적인 초기 에피소드 구조가 해당 보상의 부재를 직접 보여주는 경우만 독립 검수용 후보로 냈다.
- Art: 이번 조사 범위가 아니다. 아래 출처는 어떤 Art 축도 `known`으로 만들지 않는다.
- 제목: 출처의 장식 괄호 `『`와 `』`는 canonical title에 포함하지 않았다.
- 모든 출처의 조회일: `2026-08-23`.

값은 Factor Dictionary의 0/2/4 anchor 사이 정수 후보다. `candidate`는 독립 검수 전 제안이며, 특히 0 또는 1은 Pass B가 평가 범위와 부재 근거를 다시 확인해야 한다.

## 2. Coverage summary

| workId | canonicalTitle | Pass A N/T | 추가 조사 후 후보 N/T | 결과 |
|---|---|---:|---:|---|
| work-ebe399258f28460b8f9b | 鈴木先生 | 1/3 | 4/5 | 가능하나 `emotionalWarmth=1`은 adjudication-sensitive |
| work-f391e591282e435a3c1d | アイアムアヒーロー | 1/3 | 4/5 | 공식 1~3권 연속 소개로 가능 |
| work-205e576ef057e3aed1ab | 坂道のアポロン | 0/4 | 4/5 | `mysteryReveal=0` 독립 검수 필요 |
| work-f5f0ee0b0ff16bc146e0 | ばらかもん | 1/4 | 4/5 | 초기 구조상 낮은 축을 독립 검수해야 함 |
| work-a7a1e0666169f1b2e8c0 | 海街diary | 0/5 | 4/5 | Tone은 이미 충족, Narrative 보강 가능 |
| work-d7e64b0b5479ca943edd | 深夜食堂 | 1/2 | 4/5 | 공식 1~3권의 옴니버스 구조로 가능 |
| work-3823ff0766f67c015c53 | ましろのおと | 1/3 | 4/5 | 공식 권 소개 + 2011 초기권 심사평으로 가능 |
| work-61f2b70ee9f8217b3604 | 銀の匙 Silver Spoon | 1/3 | 4/5 | 공식 1~3권 소개로 가능 |
| work-07b11ec79f10c7eb7e05 | かくかくしかじか | 1/5 | 4/5 | Tone은 이미 충족, Narrative 보강 가능 |
| work-ef7106f6a387c9860877 | その女、ジルバ | 1/4 | 4/5 | 공식 1~3권 소개로 가능 |
| work-8716f80d9b988bd0d055 | 恋は雨上がりのように | 0/3 | 4/5 | pacing은 충돌 때문에 unknown 유지 |
| work-11296a590b885cb73b66 | 透明なゆりかご | 0/5 | 4/5 | Tone은 이미 충족, Narrative 보강 가능 |
| work-5e7eef6cc23d9738e034 | ゴールデンゴールド | 2/4 | 4/5 | 공식 3권의 포획 작전이 gap을 직접 보강 |
| work-0153a125c5a56225b06c | 違国日記 | 0/5 | 4/5 | Tone은 이미 충족, Narrative 보강 가능 |
| work-34bba03e2a127ef29cd7 | 北北西に曇と往け | 3/0 | 4/5 | 공식 1~3권·초기권 심사평으로 가능 |
| work-9d04c47e7efbbbd8aca6 | かげきしょうじょ!! | 1/2 | 4/5 | 본편 `!!` 1~3권만 평가, Season Zero 제외 |
| work-222504590507d3ab8093 | 王様ランキング | 2/3 | 4/5 | 공식 1~3권 소개로 가능 |
| work-07ff2a01ef593ce2f809 | さよならミニスカート | 1/4 | 4/5 | `comedy=0`은 독립 검수 필요 |
| work-d489f5a2229689aa5115 | 女の園の星 | 0/3 | 4/5 | 공식 초기 에피소드 목록으로 가능 |
| work-cdf549d4b1888153e146 | ダンダダン | 3/4 | 4/5 | 공식 2~3권 소개로 직접 보강 가능 |

해석: 20작품 모두 coverage에 도달할 재현 가능한 후보 경로는 생겼다. 그러나 이 보고서만으로 `known`을 확정한 작품은 0개다. 모든 후보는 Pass B를 거쳐야 하며, 특히 값 0/1이 gate 충족에 결정적인 작품은 해당 부재·저강도 판정을 독립적으로 재확인해야 한다.

## 3. Work-level evidence and proposals

### 3.1 鈴木先生 — work-ebe399258f28460b8f9b

현재: Narrative `problemSolving=2`만 known(1/6). Tone `characterArcWeight=3`, `relationshipStructure=3`, `mentalStress=4`(3/7).

Evidence:

- sourceName: 文化庁メディア芸術祭 第11回マンガ部門 優秀賞 鈴木先生
  - URL: https://www.j-mediaarts.jp/award/single/suzuki-sensei/index.html
  - publishedAt: 2007 회계연도
  - retrievedAt: 2026-08-23
  - evaluationRange: 작품 전반을 평가한 공식 심사평; 1~3권 한정이 아님
  - directObservation: 학생 문제를 해결하려 고뇌하는 중학교 교사, 불안을 일으키는 교실, 통상적 화해에 도달하지 못하고 계속 괴로워하는 교사를 직접 설명한다. `problemSolving`과 높은 `mentalStress`는 강화하지만, progression 부재를 1~3권 값으로 바로 옮길 수는 없다.
- sourceName: ファミ通.com 鈴木先生 1권 소개
  - URL: https://www.famitsu.com/news/202103/28216540.html
  - publishedAt: 2021-03-28
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 사소한 문제부터 중대한 문제까지 교사와 학생이 철저히 생각하고, 1권의 급식 메뉴 논쟁처럼 매번 뜻밖의 결론에 도달하는 반복 구조를 설명한다. 단기 논리 전개와 에피소드 단위 상태 전환의 직접 근거다.
- sourceName: マンガ大賞2008 공식 심사평
  - URL: https://www.mangataisho.com/data/2008/comment.pdf
  - publishedAt: 2008
  - retrievedAt: 2026-08-23
  - evaluationRange: 당시 출간 초기권; 개별 평의 정확한 권 범위는 미표기
  - directObservation: 문제 해결 시 독자적인 논리 전개가 미스터리와 유사한 해답의 카타르시스를 만든다고 평가한다. 선정 사실이 아니라 이 직접 서술만 보조 Evidence로 사용한다.
- sourceName: BookLive/Booklog 1권 독립 리뷰 묶음
  - URL: https://booklive.jp/review/list/title_id/14090/vol_no/001
  - publishedAt: 2019-08-16, 2013-08-12; 추가 확인 2011-07-17, 2011-06-06
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 서로 다른 계정이 긴 사고·대화, 명쾌하게 끝나지 않는 갈등, 진지함 속 부조리한 웃음을 반복 관찰했다. `comedy`와 초반 반복 구조에만 보조 사용한다.

Candidate additions:

- Narrative: `strategy=1`(장기 운영이 아니라 문제마다 숙고한 지도 방식을 세움), `pacing=3`(1권 안에서 여러 교실 문제가 제시·논의·착지), `mysteryReveal=2`(논리와 해답의 카타르시스). projected 4/6.
- Tone: `comedy=1`(부조리한 완화가 간헐적), `emotionalWarmth=1`(학생을 끝까지 대하는 성실함은 있으나 공식 심사평상 화해·힐링 보상은 제한적). projected 5/7.
- adjudication note: `emotionalWarmth=1`은 가장 약한 후보다. Pass B가 1권 내부 페이지 또는 별도 공식 편집 자료에서 교사-학생 유대 보상을 확인하지 못하면 `unknown`으로 되돌리고 Tone은 4/7로 남겨야 한다.
- explicit unknown after exhausted narrow search: `progression`, `worldBuilding`, `darkness`, `romance`. 작품 전반 심사평의 “성장·화해 부재”를 entry 1~3권의 0으로 전용하지 않는다.

### 3.2 アイアムアヒーロー — work-f391e591282e435a3c1d

현재: Narrative `worldBuilding=2`(1/6). Tone `characterArcWeight=2`, `darkness=4`, `mentalStress=4`(3/7).

Evidence:

- sourceName: 小学館 Big Comic BROS 第1集
  - URL: https://bigcomicbros.net/comics/30630/
  - publishedAt: 2009-08-28
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 혼자 어둠을 두려워하는 만화 어시스턴트, 망상, 여자친구 관계의 불안, 현실 붕괴의 시작을 설명한다.
- sourceName: 小学館 Big Comic BROS 第2集
  - URL: https://bigcomicbros.net/comics/30631/
  - publishedAt: 2009-12-26
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 연인과 화해하려던 주인공이 변이한 연인의 공격을 맞고, 이해하지 못한 사건을 조금씩 파악하며 도시와 직장의 이상을 목격한다.
- sourceName: 小学館 Big Comic BROS 第3集
  - URL: https://bigcomicbros.net/comics/30632/
  - publishedAt: 2010-05-28
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 일상이 붕괴한 수도권에서 탈출해 후지산 지하도에 도착하고, 극심한 혼란 뒤 고립 상태로 바뀐다.
- sourceName: 독립 초기 1권 리뷰 2건
  - URLs: https://makaronisan.hatenablog.com/entry/20090906/1252176014 ; https://bookmeter.com/books/571207
  - publishedAt: 2009-09-06; 2025-09-16
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 서로 다른 플랫폼의 작성자가 정체된 일상 누적 뒤 말미 붕괴, 현실과 망상의 경계, 지속 불안을 공통 관찰했다. pacing·stress·darkness의 보조 Evidence다.

Candidate additions:

- Narrative: `strategy=0`(1~3권의 대응은 장기 계획보다 혼란 속 즉흥 탈출), `pacing=4`(연인·직장·도시·장소·생존 상태가 짧은 간격으로 급변), `mysteryReveal=2`(이해 불능에서 사태를 조금씩 파악). projected 4/6.
- Tone: `relationshipStructure=1`(단독 주인공 중심이나 연인·직장 인물이 반복 관여), `romance=2`(1~2권의 연인 관계가 붕괴 발단의 중요한 서브 플롯). projected 5/7.
- explicit unknown: `progression`, `problemSolving`, `comedy`, `emotionalWarmth`. 도주가 곧 기발한 문제 해결이라는 근거는 없다.

### 3.3 坂道のアポロン — work-205e576ef057e3aed1ab

현재: Narrative 0/6. Tone `characterArcWeight=4`, `relationshipStructure=2`, `mentalStress=2`, `romance=3`(4/7).

Evidence:

- sourceName: 小学館 eコミックストア 坂道のアポロン 1
  - URL: https://e-comi.shogakukan.co.jp/books/091316700000d0000000
  - publishedAt: 페이지 날짜 미표기
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 1966년 규슈, 학교가 괴로운 전학생 薫이 千太郎를 만나고 재즈를 접하며 고교 생활이 바뀌기 시작한다.
- sourceName: 小学館 eコミックストア 坂道のアポロン 2
  - URL: https://e-comi.shogakukan.co.jp/books/091321740000d0000000
  - publishedAt: 페이지 날짜 미표기
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 재즈와 친구 관계가 깊어지고 薫의 짝사랑을 포함한 세 사람의 관계를 바꾸는 사건들이 이어진다.
- sourceName: 小学館 eコミックストア 坂道のアポロン 3
  - URL: https://e-comi.shogakukan.co.jp/books/091322680000d0000000
  - publishedAt: 페이지 날짜 미표기
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 우정과 연애가 교차하며 청춘이 예상 밖 방향으로 움직인다고 명시한다.

Candidate additions:

- Narrative: `progression=2`(만남·음악·우정으로 서서히 변함), `pacing=3`(세 권 동안 관계·감정 상태가 연속 변함), `worldBuilding=2`(1966년 규슈와 재즈 문화가 관계·행동에 기능), `mysteryReveal=0`(1~3권 전체 공식 소개의 보상은 음악·우정·연애 변화이고 단서/진실 공개 구조가 없음). projected 4/6.
- Tone: `emotionalWarmth=2`(재즈를 통한 우정 심화가 반복되지만 갈등과 짝사랑이 섞임). projected 5/7.
- adjudication note: `mysteryReveal=0`은 완전한 1~3권 소개에 근거한 부재 후보다. 내부 페이지에서 반복되는 비밀·추리 보상이 발견되면 unknown으로 되돌린다.
- explicit unknown: `problemSolving`, `strategy`, `comedy`, `darkness`.

### 3.4 ばらかもん — work-f5f0ee0b0ff16bc146e0

현재: Narrative `progression=2`(1/6). Tone `characterArcWeight=4`, `relationshipStructure=2`, `comedy=4`, `emotionalWarmth=4`(4/7).

Evidence:

- sourceName: SQUARE ENIX ばらかもん 1
  - URL: https://magazine.jp.square-enix.com/top/comics/detail/9784757526167/
  - publishedAt: 2009-07-22
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 젊은 서예가가 섬으로 옮겨와 아이와 주민, 낯선 생활을 마주하는 따뜻한 섬 코미디라고 설명한다.
- sourceName: 月刊少年ガンガン ばらかもん 공식 작품 페이지
  - URL: https://magazine.jp.square-enix.com/gangan/introduction/barakamon/
  - publishedAt: 날짜 미표기
  - retrievedAt: 2026-08-23
  - evaluationRange: 작품 도입 및 초기 반복 구조
  - directObservation: 주민과 아이들과의 섬 생활을 통해 서예가·인간으로 서서히 성장하며, 마음 따뜻한 섬 일상 코미디가 반복된다고 명시한다.
- sourceName: honto·Rakuten 1권 독립 리뷰
  - URLs: https://honto.jp/ebook/pd-review_0625165495.html ; https://books.rakuten.co.jp/rb/6101957/?l-id=item-c-physical-series
  - publishedAt: 2016-05-31, 2021-09-29; 2009-08-03
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 다른 계정·플랫폼이 섬 주민의 개입으로 한다가 풀리고, 웃음과 따뜻함이 함께 유지된다고 관찰한다. 기존 Tone 값을 보조할 뿐 Art에는 쓰지 않는다.

Candidate additions:

- Narrative: `pacing=2`(섬 일상 에피소드와 점진 성장), `worldBuilding=2`(섬 공동체의 생활 규칙·주민 관계가 반복적으로 기능), `mysteryReveal=0`(초기 공식 구조가 일상·성장·코미디이며 단서/진실 공개 보상이 없음). projected 4/6.
- Tone: `darkness=0`(출판사가 초기 구조를 명시적으로 따뜻한 일상 코미디로 규정하며 중심적 위험·비극이 없음). projected 5/7.
- adjudication note: `mysteryReveal=0`, `darkness=0`은 내부 첫 1~3권에서 반례 장면이 없는지 확인 후 확정한다.
- explicit unknown: `problemSolving`, `strategy`, `mentalStress`, `romance`.

### 3.5 海街diary — work-a7a1e0666169f1b2e8c0

현재: Narrative 0/6. Tone `characterArcWeight=4`, `relationshipStructure=3`, `darkness=1`, `mentalStress=2`, `emotionalWarmth=3`(5/7, 이미 충족).

Evidence:

- sourceName: 小学館コミック 海街diary 1
  - URL: https://shogakukan-comic.jp/book?isbn=9784091670250
  - publishedAt: 2007-04-26
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 가마쿠라 세 자매가 아버지의 부고를 받고 이복동생과 가족이 되어 가는 유대·슬픔·온화를 설명한다.
- sourceName: 小学館コミック 海街diary 2
  - URL: https://shogakukan-comic.jp/book?isbn=9784091670373
  - publishedAt: 2008-10-10
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 스즈가 새 생활에 적응하고 여러 사람의 걱정과 감정이 교차하며 가족 유대가 깊어진다.
- sourceName: 小学館コミック 海街diary 3
  - URL: https://shogakukan-comic.jp/book?isbn=9784091670403
  - publishedAt: 2010-02-10
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 1년이 지나고 추도와 계절 속에서 네 자매의 시간이 천천히 흐르며 기쁨과 슬픔이 기억이 된다.

Candidate additions:

- Narrative: `progression=2`(스즈의 적응과 가족 관계의 점진 변화), `pacing=1`(공식 3권 소개가 시간을 천천히 축적한다고 직접 설명), `worldBuilding=1`(가마쿠라의 계절·가족 생활이 기능하지만 복잡한 규칙 세계는 아님), `mysteryReveal=0`(1~3권 공식 소개 전부가 가족·시간·감정 보상이며 수수께끼 구조 없음). projected 4/6.
- Tone: 기존 5/7 유지. 새 Tone 값을 만들 필요가 없다.
- explicit unknown: `problemSolving`, `strategy`, `comedy`, `romance`.

### 3.6 深夜食堂 — work-d7e64b0b5479ca943edd

현재: Narrative `pacing=4`(1/6). Tone `relationshipStructure=3`, `emotionalWarmth=3`(2/7).

Evidence:

- sourceName: 小学館コミック 深夜食堂 1
  - URL: https://shogakukan-comic.jp/book?isbn=9784091817075
  - publishedAt: 2007-12-26
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 심야 식당에서 음식 주문을 매개로 여러 손님의 독립된 이야기가 이어진다.
- sourceName: 小学館コミック 深夜食堂 2
  - URL: https://shogakukan-comic.jp/book?isbn=9784091821607
  - publishedAt: 2008-07-30
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 음식별 15개 에피소드와 조연 배우의 병을 포함한 인간사를 열거하고, 마음을 부드럽게 치유한다고 설명한다.
- sourceName: 小学館コミック 深夜食堂 3
  - URL: https://shogakukan-comic.jp/book?isbn=9784091824479
  - publishedAt: 2009-01-30
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 음식 제목의 14개 이야기가 다시 교체되며 배와 마음을 채운다고 설명한다.
- sourceName: honto 1권 독립 리뷰 3건
  - URL: https://honto.jp/ebook/pd-review_0635198548.html?srt=3
  - publishedAt: 2025-05-04, 2021-02-27, 2022-09-05
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 서로 다른 계정이 음식으로 시작하는 짧은 독립 인생담, 쓸쓸함과 대체로 온화한 착지를 공통 관찰한다.

Candidate additions:

- Narrative: `progression=0`(주요 손님과 갈등이 에피소드마다 재설정되어 누적 성장 보상이 거의 없음), `mysteryReveal=0`(1~3권의 40여 편 구조가 인생담이지 단서·추리 보상이 아님), `worldBuilding=2`(심야 영업·주문 가능한 메뉴라는 반복 규칙과 식당 공간이 모든 이야기를 묶음). projected 4/6.
- Tone: `characterArcWeight=3`(매화 인물 사정과 감정 변화가 핵심), `darkness=1`(병·쓸쓸함이 있으나 중심이 가혹함은 아님), `mentalStress=1`(일부 사연의 압박은 있으나 에피소드 종결과 온화함이 완충). projected 5/7.
- explicit unknown: `problemSolving`, `strategy`, `comedy`, `romance`.

### 3.7 ましろのおと — work-3823ff0766f67c015c53

현재: Narrative `progression=3`(1/6). Tone `characterArcWeight=4`, `relationshipStructure=2`, `mentalStress=2`(3/7).

Evidence:

- sourceName: 講談社 ましろのおと 1
  - URL: https://www.kodansha.co.jp/comic/products/0000043275
  - publishedAt: 2010-10-15
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 스승인 할아버지를 잃고 자기 소리를 잃은 雪가 아오모리에서 도쿄로 와 여러 사람을 만나며 자기 소리를 찾기 시작한다.
- sourceName: 講談社 ましろのおと 2
  - URL: https://www.kodansha.co.jp/comic/products/0000043280
  - publishedAt: 2010-12-17
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 학교에서 津軽三味線 동아리 설립과 할아버지의 곡을 둘러싼 만남·격동이 시작된다.
- sourceName: 講談社 ましろのおと 3
  - URL: https://www.kodansha.co.jp/comic/products/0000043295
  - publishedAt: 2011-04-15
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 松吾郎杯를 향한 동아리 연습에서 인원·지도자 부족이라는 제약을 마주한다.
- sourceName: マンガ大賞2011 공식 초기권 심사평
  - URL: https://www.mangataisho.com/data/2011/comment2011.pdf
  - publishedAt: 2011
  - retrievedAt: 2026-08-23
  - evaluationRange: 당시 1~2권(심사평이 “2권밖에 나오지 않았다”고 명시)
  - directObservation: 빠르게 변하는 신변과 전개 속도, 자기와 마주한 성장, 유나와의 감정, 형제 관계의 융화와 따뜻함을 서로 다른 심사자가 구체적으로 언급한다.

Candidate additions:

- Narrative: `problemSolving=1`(인원·지도자·연습 제약에 직접 대응하나 분석 해결이 핵심은 아님), `pacing=3`(상경→학교→동아리→대회 준비로 상태와 목표가 빠르게 바뀜), `worldBuilding=2`(津軽三味線의 곡·연주·동아리·대회 문화가 반복 기능). projected 4/6.
- Tone: `romance=1`(유나와의 감정이 초기 일부에 존재하나 중심은 음악 성장), `emotionalWarmth=2`(형제 융화와 여러 사람의 영향이 갈등과 함께 작동). projected 5/7.
- explicit unknown: `strategy`, `mysteryReveal`, `comedy`, `darkness`.

### 3.8 銀の匙 Silver Spoon — work-61f2b70ee9f8217b3604

현재: Narrative `progression=3`(1/6). Tone `characterArcWeight=3`, `relationshipStructure=2`, `emotionalWarmth=3`(3/7).

Evidence:

- sourceName: 小学館コミック 銀の匙 Silver Spoon 1
  - URL: https://shogakukan-comic.jp/book?isbn=9784091231802
  - publishedAt: 2011-07-15
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 농업고교에 들어간 하치켄이 낯선 실습·가축·동료를 경험하는 도입이다.
- sourceName: 小学館コミック 銀の匙 Silver Spoon 2
  - URL: https://shogakukan-comic.jp/book?isbn=9784091234278
  - publishedAt: 2011-12-14
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 농업고교에 적응한 하치켄이 여름 농장 노동과 농업의 즐거움·어려움을 경험한다.
- sourceName: 小学館コミック 銀の匙 Silver Spoon 3
  - URL: https://shogakukan-comic.jp/book?isbn=9784091236531
  - publishedAt: 2012-04-18
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 해소되지 않은 고민, 직접 기른 돼지가 고기가 되는 과정, 하치켄의 결정을 중심에 둔다.

Candidate additions:

- Narrative: `problemSolving=2`(농장 노동·가축·선택의 현실 제약에 지식과 직접 행동을 혼합), `pacing=2`(학기·여름·농장·가축 에피소드가 일반 arc 단위로 변함), `worldBuilding=3`(농업고교와 축산 생산의 규칙·직업 문화가 사건과 결정에 반복 관여). projected 4/6.
- Tone: `darkness=1`(도축·생계의 진지함이 있으나 암울함이 중심은 아님), `mentalStress=2`(미해결 고민과 생명·식품 선택의 압박). projected 5/7.
- explicit unknown: `strategy`, `mysteryReveal`, `comedy`, `romance`.

### 3.9 かくかくしかじか — work-07b11ec79f10c7eb7e05

현재: Narrative `progression=3`(1/6). Tone `characterArcWeight=4`, `relationshipStructure=2`, `comedy=2`, `mentalStress=2`, `emotionalWarmth=3`(5/7, 이미 충족).

Evidence:

- sourceName: 集英社 かくかくしかじか 1
  - URL: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-782457-5
  - publishedAt: 2012-07-25
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 미대 진학을 꿈꾸는 주인공이 엄격한 미술 교사 아래서 훈련을 시작한다.
- sourceName: 集英社 かくかくしかじか 2
  - URL: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-782653-1
  - publishedAt: 2013-05-24
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 혹독한 훈련을 거쳐 미대 입시에 합격하고 꿈에 접근한다.
- sourceName: 集英社 かくかくしかじか 3
  - URL: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-782746-0
  - publishedAt: 2014-01-24
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 미대를 졸업해 무직으로 미야자키에 돌아오고 스승과 다시 만난다.

Candidate additions:

- Narrative: `problemSolving=1`(입시·훈련 과제를 행동으로 통과하지만 기발한 분석 해결 중심은 아님), `pacing=3`(훈련 시작→합격→대학 졸업→귀향으로 큰 상태 변화), `worldBuilding=2`(미술 교습·입시·미대 제도가 진로 선택과 갈등에 기능). projected 4/6.
- Tone: 기존 5/7 유지.
- explicit unknown: `strategy`, `mysteryReveal`, `darkness`, `romance`.

### 3.10 その女、ジルバ — work-ef7106f6a387c9860877

현재: Narrative `progression=3`(1/6). Tone `characterArcWeight=4`, `relationshipStructure=3`, `mentalStress=3`, `emotionalWarmth=3`(4/7).

Evidence:

- sourceName: 小学館 eコミックストア その女、ジルバ 1
  - URL: https://e-comi.shogakukan.co.jp/books/091850240000d0000000
  - publishedAt: 페이지 날짜 미표기
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 정리해고와 미래 불안에 놓인 40세 여성이 전후부터 살아온 고령 호스티스들의 바에서 웃고 노래하고 춤추며 잊었던 것을 되찾기 시작한다.
- sourceName: 小学館 eコミックストア その女、ジルバ 2
  - URL: https://e-comi.shogakukan.co.jp/books/091863530000d0000000
  - publishedAt: 페이지 날짜 미표기
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 전후의 밤 문화를 살아온 여성들과 일하며 주인공이 마음의 저축을 쌓는다.
- sourceName: 小学館 eコミックストア その女、ジルバ 3
  - URL: https://e-comi.shogakukan.co.jp/books/091870780000d0000000
  - publishedAt: 페이지 날짜 미표기
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 주인공이 마음을 열고, 세상을 떠난 지르바의 숨겨진 과거를 알아가기 시작한다.

Candidate additions:

- Narrative: `pacing=2`(직장 이동→바 적응→과거 탐색의 arc 변화), `mysteryReveal=2`(3권에서 지르바의 숨겨진 과거가 명시적 보상), `worldBuilding=2`(고령 바·전후 밤 문화·두 직장이 인물 선택과 관계에 반복 기능). projected 4/6.
- Tone: `darkness=2`(정리해고·노후 불안·전후 생존과 죽은 지르바의 과거가 존재하지만 따뜻함과 활기가 완충). projected 5/7.
- explicit unknown: `problemSolving`, `strategy`, `comedy`, `romance`.

### 3.11 恋は雨上がりのように — work-8716f80d9b988bd0d055

현재: Narrative 0/6. Tone `characterArcWeight=4`, `relationshipStructure=2`, `romance=4`(3/7).

Evidence:

- sourceName: 小学館コミック 恋は雨上がりのように 1
  - URL: https://shogakukan-comic.jp/book?isbn=9784091867285
  - publishedAt: 2015-01-09
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 부상 뒤 패밀리 레스토랑에서 일하는 17세 아키라와 45세 점장의 관계 도입이다.
- sourceName: 小学館コミック 恋は雨上がりのように 2
  - URL: https://shogakukan-comic.jp/book?isbn=9784091868688
  - publishedAt: 2015-04-10
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 고백과 나이 차, 사랑의 행방이 직접 전개된다.
- sourceName: 小学館コミック 恋は雨上がりのように 3
  - URL: https://shogakukan-comic.jp/book?isbn=9784091872005
  - publishedAt: 2015-09-11
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 아키라의 감정과 점장의 동요, 두 사람이 잃어버린 과거의 꿈을 병치한다.
- sourceName: 小学館 공식 영화 연계 편집 기사
  - URL: https://shogakukan-comic.jp/news/12269
  - publishedAt: 2018-05-25
  - retrievedAt: 2026-08-23
  - evaluationRange: 작품 도입·초기 관계
  - directObservation: 부상으로 육상 꿈을 잃은 아키라를 점장이 도왔고, 일방적 사랑을 점장이 받아들이지 못하는 섬세한 감정 갈등을 설명한다.
- sourceName: 독립 초기권 리뷰 2건
  - URLs: https://osusumedia.info/article/263 ; https://xn--kck4aa4nk081acvh.com/%E6%81%8B%E3%81%AF%E9%9B%A8%E4%B8%8A%E3%81%8C%E3%82%8A%E3%81%AE%E3%82%88%E3%81%86%E3%81%AB/
  - publishedAt: 2016-02-23(2016-06-20 갱신); 2021-08-10
  - retrievedAt: 2026-08-23
  - evaluationRange: 1~3권; 초반·1권
  - directObservation: 감정 변화와 관계 진전에는 합의하지만 pacing 체감은 일치하지 않는다. 따라서 pacing에는 사용하지 않는다.

Candidate additions:

- Narrative: `progression=1`(잃은 꿈과 관계를 통해 변화가 시작되나 획득·숙련 보상은 약함), `problemSolving=0`(1~3권의 핵심 대응은 분석 해결보다 감정적 결단과 관계 선택), `mysteryReveal=0`(완전한 1~3권 소개에 단서·추리 보상 없음), `worldBuilding=1`(식당·육상 환경은 기능하지만 복잡한 규칙 세계는 아님). projected 4/6.
- Tone: `mentalStress=2`(나이 차, 일방 고백, 잃은 꿈의 긴장), `emotionalWarmth=2`(점장의 도움과 상호 배려가 갈등과 함께 작동). projected 5/7.
- explicit unknown: `strategy`, `pacing`, `comedy`, `darkness`. 특히 pacing은 독립 리뷰가 갈리므로 자동 다수결하지 않는다.

### 3.12 透明なゆりかご — work-11296a590b885cb73b66

현재: Narrative 0/6. Tone `characterArcWeight=4`, `relationshipStructure=2`, `darkness=4`, `mentalStress=4`, `emotionalWarmth=2`(5/7, 이미 충족).

Evidence:

- sourceName: 講談社 透明なゆりかご 1
  - URL: https://www.kodansha.co.jp/comic/products/0000036416
  - publishedAt: 2015-05-13
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 간호학과 고교생이 산부인과 견습으로 중절과 출산을 경험해 그만둘 뻔하다가 생명의 힘을 보고 계속 일하기로 결심한다.
- sourceName: 講談社 透明なゆりかご 2
  - URL: https://www.kodansha.co.jp/comic/products/0000036427
  - publishedAt: 2015-10-13
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 분만 중 사망, 14세 임신, 둘라, 간호사의 직업 이유 등 서로 다른 의료·윤리 사례를 에피소드로 제시한다.
- sourceName: 講談社 透明なゆりかご 3
  - URL: https://www.kodansha.co.jp/comic/products/0000036443
  - publishedAt: 2016-04-13
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 짧은 생명, 중절 결정, 보호자를 기다리는 아이, 고위험 출산 등 7개 사례를 수록한다.

Candidate additions:

- Narrative: `progression=2`(견습생이 충격 뒤 일을 계속하기로 하고 사례를 거치며 관점이 축적), `problemSolving=1`(의료진·가족이 제약 속 대응하지만 주인공의 기발한 해결이 핵심은 아님), `pacing=3`(사례가 짧은 에피소드 단위로 교체되고 상태가 크게 달라짐), `worldBuilding=2`(산부인과의 의료 절차·역할·윤리 조건이 매화 핵심). projected 4/6.
- Tone: 기존 5/7 유지.
- explicit unknown: `strategy`, `mysteryReveal`, `comedy`, `romance`.

### 3.13 ゴールデンゴールド — work-5e7eef6cc23d9738e034

현재: Narrative `mysteryReveal=4`, `worldBuilding=2`(2/6). Tone `characterArcWeight=2`, `relationshipStructure=4`, `darkness=4`, `mentalStress=4`(4/7).

Evidence:

- sourceName: 講談社 ゴールデンゴールド 2
  - URL: https://www.kodansha.co.jp/comic/products/0000018886
  - publishedAt: 2017-01-23
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 후쿠노카미의 힘으로 가게가 번성하는 동시에 할머니가 점점 이상해진다.
- sourceName: 講談社 ゴールデンゴールド 3
  - URL: https://www.kodansha.co.jp/r/comic/product?isbn=9784065102022
  - publishedAt: 2017-10-23
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 살인 사건 조사가 들어오고, 黒蓮과 琉花가 할머니의 변화를 보고 후쿠노카미 포획 작전을 실행하며, 중학생의 연정이 급전개를 일으킨다.
- sourceName: マンガ大賞2017 공식 심사평
  - URL: https://www.mangataisho.com/archives/2017/01/post-1013.html
  - publishedAt: 2017
  - retrievedAt: 2026-08-23
  - evaluationRange: 심사평이 1권 또는 1~2권을 명시
  - directObservation: 평범한 섬 일상이 서서히 뒤틀리고 불온함이 점진적으로 침투하며, 2권에서 큰 파동이 온다고 반복 평가한다.
- sourceName: 독립 초기권 리뷰 2건
  - URLs: https://www.matsumototakahito.com/archives/24087507.html ; https://buzz-manga.blog.jp/Golden-Gold.html
  - publishedAt: 2020-09-12; 2017-02-27
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권; 1~2권
  - directObservation: 점진적 불길함·가족과 섬의 변화·루카의 연정을 공통 관찰한다. 공식 자료와 일치하는 보조 Evidence로만 사용한다.

Candidate additions:

- Narrative: `problemSolving=2`(3권에서 관찰한 변화를 바탕으로 포획 작전을 세워 실행), `pacing=1`(1~2권의 점진 침투 뒤 3권 급전개; 전체 entry 평균은 느린 쪽). projected 4/6.
- Tone: `romance=2`(어린 시절 친구를 붙잡고 싶은 소원과 3권의 연정이 전개의 서브 플롯). projected 5/7.
- explicit unknown: `progression`, `strategy`, `comedy`, `emotionalWarmth`. 포획 작전 한 번을 장기 전략으로 올리지 않는다.

### 3.14 違国日記 — work-0153a125c5a56225b06c

현재: Narrative 0/6. Tone `characterArcWeight=4`, `relationshipStructure=2`, `darkness=2`, `mentalStress=2`, `emotionalWarmth=4`(5/7, 이미 충족).

Evidence:

- sourceName: 祥伝社 違国日記 특설 사이트
  - URL: https://www.shodensha.co.jp/ikokunikki/
  - publishedAt: 날짜 미표기
  - retrievedAt: 2026-08-23
  - evaluationRange: 사이트 내 1~3권 개별 소개
  - directObservation: 1권은 부모를 잃은 조카를 이모가 맡아 어색한 동거를 시작하고, 2권은 학교·친구·이모의 편지와 전 연인 관계, 3권은 집필에 몰두한 이모와 서운한 조카가 이해를 향해 움직이는 과정을 설명한다.
- sourceName: マンガ大賞2019 공식 초기권 심사평
  - URL: https://www.mangataisho.com/data/2019/comment2019.pdf
  - publishedAt: 2019
  - retrievedAt: 2026-08-23
  - evaluationRange: 당시 초기 출간분; 심사평은 동거 도입과 초기 관계를 구체적으로 언급
  - directObservation: 두 사람이 충돌하면서도 말과 거리 조절을 통해 천천히 관계를 만든다고 평가한다.

Candidate additions:

- Narrative: `progression=2`(학교·편지·동거 갈등을 거치며 상호 이해가 점진 변화), `problemSolving=1`(말·편지·거리 조정으로 생활 문제에 대응하나 지략 해결 중심은 아님), `pacing=1`(초기 3권의 관계 변화가 천천히 축적), `worldBuilding=0`(현대 일상 공간은 최소 배경이고 별도 역사·규칙·세력 보상이 거의 없음). projected 4/6.
- Tone: 기존 5/7 유지. 기존 supplemental review에서 warmth 반응이 갈렸으므로 새로 값을 높이지 않는다.
- explicit unknown: `strategy`, `mysteryReveal`, `comedy`, `romance`.

### 3.15 北北西に曇と往け — work-34bba03e2a127ef29cd7

현재: Narrative `problemSolving=4`, `mysteryReveal=2`, `worldBuilding=2`(3/6). Tone 0/7.

Evidence:

- sourceName: KADOKAWA 北北西に曇と往け 1
  - URL: https://www.kadokawa.co.jp/product/321706000806/
  - publishedAt: 2017-10-13
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 아이슬란드의 17세 탐정이 차와 대화하는 능력으로 달아난 개와 첫눈에 반한 상대 찾기 같은 의뢰를 해결한다.
- sourceName: KADOKAWA 北北西に曇と往け 3
  - URL: https://www.kadokawa.co.jp/product/321807000123/
  - publishedAt: 2019-01-15
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 일상으로 돌아온 주인공이 실종자 의뢰를 재개하고, 낯익은 계단과 동생의 등장으로 이야기가 크게 선회한다.
- sourceName: マンガ大賞2019 공식 심사평
  - URL: https://www.mangataisho.com/data/2019/comment2019.pdf
  - publishedAt: 2019
  - retrievedAt: 2026-08-23
  - evaluationRange: 심사평이 1~2권을 직접 언급
  - directObservation: 1권의 동생 실종 긴장과 2권의 친구 아이슬란드 관광 에피소드가 교차하고, 이야기가 담담히 진행되는 중 간헐적 광기와 서스펜스가 보인다고 평가한다.

Candidate additions:

- Narrative: `pacing=2`(1권 긴장→2권 여행 완화→3권 실종 의뢰와 동생 미스터리로 arc 단위 변화). projected 4/6.
- Tone: `characterArcWeight=2`(탐정 사건·여행과 형제 동기가 균형), `relationshipStructure=2`(할아버지·친구·동생이 반복 핵심 조연), `darkness=2`(실종·광기·위험이 존재하나 여행 일상이 완충), `mentalStress=2`(동생 행방과 간헐적 서스펜스), `romance=1`(1권의 첫눈에 반한 상대 찾기 의뢰로 낮은 존재). projected 5/7.
- explicit unknown: `progression`, `strategy`, `comedy`, `emotionalWarmth`. 2권의 친근한 여행만으로 warmth 값을 확정하지 않는다.

### 3.16 かげきしょうじょ!! — work-9d04c47e7efbbbd8aca6

현재: Narrative `progression=4`(1/6). Tone `characterArcWeight=4`, `relationshipStructure=4`(2/7).

Identity/evaluation boundary:

- sourceName: 白泉社 かげきしょうじょ!! シーズンゼロ
  - URL: https://www.hakusensha.co.jp/comicslist/53883/
  - publishedAt: 2019-03-05
  - retrievedAt: 2026-08-23
  - evaluationRange: identity only
  - directObservation: 集英社판 かげきしょうじょ! 1~2권을 재편집한 전작/전사라고 명시한다. 이번 평가는 白泉社 본편 `かげきしょうじょ!!` 1~3권만 대상으로 하며 Season Zero 내용을 합치지 않는다.

Evidence:

- sourceName: 白泉社 かげきしょうじょ!! 1
  - URL: https://www.hakusensha.co.jp/comicslist/46806/
  - publishedAt: 2015-11-05
  - retrievedAt: 2026-08-23
  - evaluationRange: 본편 1권
  - directObservation: 여성 가극단 음악학교 학생들의 입학·훈련·목표 관계를 설명한다.
- sourceName: 白泉社 かげきしょうじょ!! 2
  - URL: https://www.hakusensha.co.jp/comicslist/48355/
  - publishedAt: 2016-09-05
  - retrievedAt: 2026-08-23
  - evaluationRange: 본편 2권
  - directObservation: 교사의 “톱스타가 될 수 없다”는 평가 뒤 여름 귀향, 사라사와 아이의 동행, 어린 시절 지인과의 재회를 다룬다.
- sourceName: 白泉社 かげきしょうじょ!! 3
  - URL: https://www.hakusensha.co.jp/comicslist/48734/
  - publishedAt: 2016-12-05
  - retrievedAt: 2026-08-23
  - evaluationRange: 본편 3권
  - directObservation: 100주년 운동회에서 학생들이 선배들과 퍼레이드·하프타임 공연을 연습한다.
- sourceName: BookLive 본편 1권 독립 리뷰 2건
  - URL: https://booklive.jp/review/list/title_id/365953/vol_no/001
  - publishedAt: 2022-09-29, 2022-02-11
  - retrievedAt: 2026-08-23
  - evaluationRange: 본편 1권
  - directObservation: 다른 계정이 성장·학교 관계망·간헐적 웃음에 합의한다. identity 범위가 확정됐으므로 comedy 보조에만 사용 가능하다.

Candidate additions:

- Narrative: `problemSolving=1`(훈련·인원·공연 과제에 대응하나 기발한 분석 해결은 아님), `pacing=3`(입학→교사 평가→귀향→대규모 공연 준비), `worldBuilding=3`(음악학교·가극단 서열·수업·공연 관습이 목표와 갈등에 반복 관여). projected 4/6.
- Tone: `comedy=1`(복수 초기 리뷰가 간헐적 웃음에 합의), `mentalStress=2`(경쟁·교사 평가·훈련 압박), `emotionalWarmth=2`(동행·재회·학생 공동 연습의 유대가 경쟁과 병존). projected 5/7.
- adjudication note: warmth는 공식 줄거리상 관계 행동은 직접 확인되지만 정서 강도는 낮은 신뢰다. 내부 1~3권 또는 공식 심사평에서 유대 보상이 확인되지 않으면 unknown으로 되돌린다.
- explicit unknown: `strategy`, `mysteryReveal`, `darkness`, `romance`.

### 3.17 王様ランキング — work-222504590507d3ab8093

현재: Narrative `progression=2`, `worldBuilding=2`(2/6). Tone `characterArcWeight=4`, `relationshipStructure=2`, `emotionalWarmth=4`(3/7).

Evidence:

- sourceName: KADOKAWA 王様ランキング 1
  - URL: https://www.kadokawa.co.jp/product/321811000381/
  - publishedAt: 2019-02-12
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 청각장애가 있고 힘이 약한 왕자 보지와 첫 친구 카게, 왕의 자질을 둘러싼 주변 평가를 설명한다.
- sourceName: KADOKAWA 王様ランキング 2
  - URL: https://www.kadokawa.co.jp/product/321811000382/
  - publishedAt: 2019-02-12
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 왕위를 잃은 보지가 여행을 결심하고 여러 위험을 만나며, 다이다의 동기와 음모가 얽혀 빠르게 전개된다.
- sourceName: KADOKAWA 王様ランキング 3
  - URL: https://www.kadokawa.co.jp/product/321901000444/
  - publishedAt: 2019-04-12
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 카게와 재회해 보지를 강하게 만들 사람을 찾아 위험을 통과하고, 다이다는 아버지의 힘을 추구한다.

Candidate additions:

- Narrative: `problemSolving=2`(약점을 인정하고 스승을 찾아 훈련 방법을 모색), `pacing=4`(왕위 상실→여행→음모→재회→스승 탐색으로 짧은 간격 급변). projected 4/6.
- Tone: `darkness=2`(왕위 음모·위험·힘의 계승이 진지하게 존재), `mentalStress=2`(무력함·배제·위험 압박이 우정의 지지와 혼합). projected 5/7.
- explicit unknown: `strategy`, `mysteryReveal`, `comedy`, `romance`.

### 3.18 さよならミニスカート — work-07ff2a01ef593ce2f809

현재: Narrative `mysteryReveal=2`(1/6). Tone `characterArcWeight=4`, `relationshipStructure=2`, `darkness=3`, `mentalStress=4`(4/7).

Evidence:

- sourceName: 集英社 さよならミニスカート 1
  - URL: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-867520-6
  - publishedAt: 2018-11-22
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 습격 뒤 “여자아이” 정체성을 버리고 바지 교복으로 사는 仁那의 비밀과 충격적 사건을 도입한다.
- sourceName: 集英社 さよならミニスカート 2
  - URL: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-867543-5
  - publishedAt: 2019-03-25
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 전 아이돌 피해자에게 피해자 비난이 가해지고 정체를 숨긴 주변에서 추가 사건이 일어난다.
- sourceName: Mangaism·BookLive 초기 독립 리뷰
  - URLs: https://www.mangaism.net/sayonara1/ ; https://booklive.jp/review/list/title_id/560240/vol_no/001
  - publishedAt: 2018-11-30; 2018-11-24, 2018-11-23
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권
  - directObservation: 별도 블로그와 구매 계정이 습격·피해자 비난·반복 의문이 1권 내내 긴장을 유지하고 진지한 젠더 현실을 다룬다고 공통 관찰한다.

Candidate additions:

- Narrative: `progression=2`(피해 이후 숨은 정체와 자기 인식을 둘러싼 변화), `pacing=3`(비밀 도입·정체 위협·추가 사건이 1~2권에 연속), `worldBuilding=1`(학교·아이돌 산업의 사회 규범이 기능하나 복잡한 규칙 세계는 아님). projected 4/6.
- Tone: `comedy=0`(공식 1~2권 전체 소개와 복수 초기 리뷰가 습격·피해자 비난·지속 긴장을 핵심으로 확인하며 코미디 완화가 거의 없음). projected 5/7.
- adjudication note: `comedy=0`은 presence가 아닌 부재 값이므로 내부 1~2권에서 반복적 개그가 없는지 Pass B가 확인한다.
- explicit unknown: `problemSolving`, `strategy`, `romance`, `emotionalWarmth`.

### 3.19 女の園の星 — work-d489f5a2229689aa5115

현재: Narrative 0/6. Tone `characterArcWeight=2`, `relationshipStructure=4`, `comedy=4`(3/7).

Evidence:

- sourceName: 祥伝社 女の園の星 공식 특설 페이지
  - URL: https://www.shodensha.co.jp/onnanosono_special/
  - publishedAt: 2022-12-08 연계(3권 특장판 발매일)
  - retrievedAt: 2026-08-23
  - evaluationRange: 원작 초기 에피소드 1시간目·4시간目의 공식 애니 수록 목록
  - directObservation: 학급일지 그림 끝말잇기, `ほ□い`의 수수께끼, 폴로셔츠 앰배서더, 두 교사의 술자리라는 저위험 단편 구조를 열거한다. 공식 페이지의 출연자 코멘트는 이를 “일상·포근함·재미”로 직접 묘사한다.
- sourceName: 祥伝社 공식 작품 뉴스
  - URL: https://news.shodensha.co.jp/article/479008557.html
  - publishedAt: 페이지 날짜 메타데이터 미확인
  - retrievedAt: 2026-08-23
  - evaluationRange: 작품 도입·초기 일상 구조
  - directObservation: 여자고등학교 남자 교사의 평범한 일상에서 생기는 무의미하고 우스운 사건들을 작품 핵심으로 설명한다.

Candidate additions:

- Narrative: `progression=0`(선택된 초기 에피소드가 성장 누적 없이 일상 상태로 복귀), `problemSolving=1`(그림 끝말잇기·문자 수수께끼 같은 작은 문제를 다룸), `pacing=2`(짧은 단편 단위로 사건이 교체), `mysteryReveal=1`(`ほ□い`처럼 작은 수수께끼·착지가 있으나 주요 추리 구조는 아님). projected 4/6.
- Tone: `darkness=0`, `mentalStress=0`(공식 초기 에피소드가 저위험 일상 코미디이며 지속 위험·압박이 거의 없음). projected 5/7.
- explicit unknown: `strategy`, `worldBuilding`, `romance`, `emotionalWarmth`. “포근한 재미” 홍보 문구만으로 warmth를 별도 known 처리하지 않는다.

### 3.20 ダンダダン — work-cdf549d4b1888153e146

현재: Narrative `pacing=4`, `mysteryReveal=2`, `worldBuilding=2`(3/6). Tone `characterArcWeight=2`, `relationshipStructure=2`, `comedy=4`, `romance=2`(4/7).

Evidence:

- sourceName: 集英社 ダンダダン 2
  - URL: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882804-6
  - publishedAt: 2021-10-04
  - retrievedAt: 2026-08-23
  - evaluationRange: 2권
  - directObservation: 저주를 풀기 위해 모모와 오카룽이 명시된 승리 조건의 터보 할머니 술래잡기에 도전하고, 게 형태 장애물에 함께 대응한다.
- sourceName: 集英社 ダンダダン 3
  - URL: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-882854-1
  - publishedAt: 2021-12-03
  - retrievedAt: 2026-08-23
  - evaluationRange: 3권
  - directObservation: 잃어버린 물건을 찾는 목표, 아이라의 힘과 오해, 초자연 존재의 공격에 두 주인공이 대응한다.
- sourceName: 독립 1권 리뷰 2건
  - URLs: https://magazin-review.net/dandadan-1 ; https://hanhans.hatenablog.com/entry/2021/08/29/175948
  - publishedAt: 2021-10-04; 2021-08-29
  - retrievedAt: 2026-08-23
  - evaluationRange: 1권 5화; 1권
  - directObservation: 큰 상태 변화, 빠른 대화·액션, 코미디와 연애 기류가 공백 없이 이어진다고 독립적으로 관찰한다. 기존 pacing·comedy·romance를 보조한다.

Candidate additions:

- Narrative: `problemSolving=2`(명시된 술래잡기 규칙·승리 조건과 장애물에 두 사람이 협력 대응). projected 4/6.
- Tone: `darkness=2`(저주·신체 위협·초자연 공격이 반복되나 상시 코미디가 완충). projected 5/7.
- explicit unknown: `progression`, `strategy`, `mentalStress`, `emotionalWarmth`.

## 4. Review/adjudication queue

다음 후보는 gate 숫자를 맞추기 위한 자동 채움으로 사용하면 안 된다. Pass B가 직접 범위를 재확인해야 한다.

1. 鈴木先生 `emotionalWarmth=1`: 공식 자료는 성실한 돌봄을 지지하지만 화해 보상은 제한적이다. 거부 시 Tone 4/7로 남는다.
2. 坂道のアポロン `mysteryReveal=0`: 공식 1~3권 소개 전부를 확인한 부재 후보지만 내부 페이지 반례 확인 필요.
3. ばらかもん `mysteryReveal=0`, `darkness=0`: “따뜻한 일상 코미디”라는 공식 규정과 초기 범위를 내부 페이지로 확인.
4. 海街diary `mysteryReveal=0`: 1~3권 공식 소개는 완전하지만 부재 값이므로 재확인.
5. 深夜食堂 `progression=0`, `mysteryReveal=0`: 공식 1~3권의 40여 편 옴니버스 구조가 정말 누적 arc를 만들지 않는지 확인.
6. 恋は雨上がりのように `problemSolving=0`, `mysteryReveal=0`: pacing은 충돌 때문에 계속 unknown. 두 0 중 하나라도 반려되면 Narrative 추가 조사 필요.
7. 違国日記 `worldBuilding=0`: 현대 일상 배경 최소성의 부재 판정.
8. かげきしょうじょ!! `emotionalWarmth=2`: 본편 `!!` 1~3권만으로 유대 보상을 확인해야 하며 Season Zero를 끌어오면 안 됨.
9. さよならミニスカート `comedy=0`: 공식 1~2권과 복수 리뷰가 일치하지만 내부 페이지 반례 확인 필요.
10. 女の園の星의 0축: 공식 초기 에피소드 목록과 저위험 코미디 규정은 강하지만 선택된 에피소드 외 초기권 반례 확인 필요.

## 5. Exhausted-but-unknown findings

- `unknown`은 낮은 값이 아니며 coverage를 위해 억지로 0이나 2로 바꾸지 않았다.
- 좁은 공식-first 조사 후에도 특히 남은 축은 각 작품 절의 `explicit unknown`에 기록했다.
- 초반 권 소개만으로 극단값 4를 새로 제안한 축은 `pacing=4`처럼 공식 1~3권이 연속적으로 큰 상태 변화를 직접 보여주는 경우뿐이다.
- 유저평끼리 충돌한 恋は雨上がりのように `pacing`은 조사 후에도 `unknown`으로 종결했다.
- 鈴木先生의 작품 전반 심사평에 있는 “통상적 성장·화해 부재”는 entry 1~3권과 범위가 맞지 않아 `progression=0`으로 쓰지 않았다.
- ゴールデンゴールド의 3권 포획 작전은 `problemSolving` 근거이지만 한 번의 작전을 `strategy` known으로 올리지 않았다.
- 北北西に曇と往け의 여행 친밀감은 `emotionalWarmth`를 확정할 만큼 직접적이지 않아 unknown으로 남겼다.

## 6. Recommended application order

1. 이 문서의 후보를 별도 Annotation patch로 옮기되 기존 CSV를 덮어쓰지 않는다.
2. Pass B는 각 작품의 proposed 축만 독립적으로 재평가하고, 특히 0/1 후보를 먼저 반증 검색한다.
3. 반려된 축은 자동 대체하지 않고 `unknown`으로 되돌린 뒤 실제 gate를 다시 계산한다.
4. gate가 다시 짧아진 작품만 위 adjudication queue 순서로 공식 내부 페이지 또는 추가 복수 독립 리뷰를 좁게 조사한다.
5. 추천 목록 포함 사실, 별점, 표지, 애니메이션 이미지는 Factor Evidence로 사용하지 않는다.

