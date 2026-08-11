# G1 Catalog authoring — chunk A

## 상태와 범위

- 작성 범위는 고정된 13작품의 **초반 1~3권 진입 경험**이다. 후반 반전·장기 연재 중 변화는 Axis와 Theme 판정에 섞지 않았다.
- 이 디렉터리는 패널 전 staging이다. `annotationReviewMethod=unreviewed`, `reviewedByHuman=false`이며, 아래 eligibility와 role은 합병 후 패널이 검토할 **의도값**이다.
- 대표권은 일본어 종이 단행본 표준판 1권으로 통일했다. ISBN·발매일·저자·출판사는 출판사 공식 상품 페이지에서 확인했다.
- 권수와 status는 2026-08-11 시점의 출판사 공식 최신권·연재/완결 표기를 우선했다. `ジョジョの奇妙な冒険`은 원제 단행본 1~~63권(Part 1~~5)만 하나의 work로 잡았으며 후속 별도 표제 시리즈는 포함하지 않는다.
- 라쿠텐 Books API는 `.env` 자격 증명을 출력하지 않는 단일 ISBN 스모크에서 HTTP 503 인증 서비스 오류를 반환했다. 반복 호출하지 않았다. 대신 인증이 필요 없는 라쿠텐 Books 공개 종이책 상품 페이지에서 동일 대표 ISBN을 대조해, 2026-08-11 관찰 스냅샷의 `reviewAverage`·`reviewCount`를 기록했다. 값은 이후 변할 수 있으며 API 응답으로 교차 확인되지는 않았다.
- 축은 우선 0/2/4 기준에 맞췄고 경계값은 실제 지면이 두 기준 사이를 지지할 때만 썼다. Art known 값은 공식 내부 페이지를 확인한 경우에만 유지하며, 대표 동세를 확인하지 못한 작품의 `motionImpact`는 `unknown`이다. `notApplicable`은 쓰지 않았다.
- G1 strict 후속 감사에서 공식 reader를 다시 열어 6쪽 이상·2개 맥락을 재확인했다. 아래의 선택 화면 서술은 최초 표본 요약이며 가용 페이지 수의 상한이 아니다. 최종 개별 refs와 표본 수는 `data/staging/g1/art-evidence-manifest.csv`가 우선한다.

## 역할·eligibility 제안

| workId                   | onboarding | recommendation | role      | 대비축 판독 목적                                               |
| ------------------------ | ---------: | -------------: | --------- | -------------------------------------------------------------- |
| `one-piece`              |       true |           true | anchor    | 빠른 전개·밝음·고정 파티·강한 코미디/유대와 낮은 전략·로맨스   |
| `naruto`                 |      false |           true | bridge    | 성장 보상·관계 드라마·전투를 중간 톤에서 연결                  |
| `dragon-ball`            |       true |           true | anchor    | 직접 전투·극저 darkness/stress·강한 데포르메 대비              |
| `attack-on-titan`        |       true |           true | anchor    | 극고 darkness/stress·군상·미스터리·생존 대비                   |
| `demon-slayer`           |      false |           true | bridge    | 성장·직접 전투·비극과 따뜻한 가족 동기를 연결                  |
| `jujutsu-kaisen`         |      false |           true | bridge    | 학교/팀 구조와 고강도 darkness/stress를 연결                   |
| `my-hero-academia`       |      false |           true | bridge    | 성장·학교 관계·중간 온기와 빠른 액션을 연결                    |
| `hunter-x-hunter`        |       true |           true | anchor    | 제약 해결·단기 전술·시험 구조가 직접 전투 중심작과 대비        |
| `jojo-bizarre-adventure` |      false |           true | discovery | 빅토리아 고딕·스타일화된 고밀도 작화·로맨스가 결합된 희소 조합 |
| `berserk`                |       true |           true | anchor    | 극고 darkness/stress와 단독 주인공·저 warmth의 끝점            |
| `vinland-saga`           |      false |           true | bridge    | 전쟁·복수·역사 재구성과 인물극을 연결                          |
| `vagabond`               |       true |           true | anchor    | 비교적 느린 전개·무예 성장·현실적 고밀도 작화 대비             |
| `golden-kamuy`           |      false |           true | discovery | 고 darkness와 고 comedy/warmth, 생존·조리·역사 조합의 희소성   |

제안 분포는 anchor 6 / bridge 5 / discovery 2다. anchor는 밝음↔어두움, 전략↔직접 전투, 파티↔단독, 스타일화↔현실 작화, 빠름↔상대적으로 느림을 읽도록 배치했다. discovery는 단순 비인기 슬롯이 아니라 기존 seed와 겹치기 어려운 조합을 의도했다.

## 작품별 근거

### `one-piece`

- 공식 1권: https://books.shueisha.co.jp/items/contents.html?isbn=4-08-872509-3
- 공식 최신권: https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-885130-3
- 공식 연재 페이지: https://www.shonenjump.com/j/rensai/onepiece/
- 공식 제1화 내부 페이지: https://shonenjumpplus.com/episode/10833519556325021794
- 라쿠텐 공개 상품 페이지: https://books.rakuten.co.jp/rb/941204/ — 사용자 평가 4.67, 756건
- 확인: 1권은 尾田栄一郎, 1997-12-24, ISBN 9784088725093. 공식 115권은 2026-07-03 발매이고 연재 페이지가 현재 연재작으로 표시하므로 `ongoing`, 115권으로 기록했다.
- 초반 관찰: 해적왕 목표와 섬 이동, 동료 영입, 짧은 간격의 대결이 반복된다. 즉흥 직접 행동이 장기 책략보다 앞서고, 개그와 동료 유대가 위협을 빠르게 완충한다. 이를 높은 pacing/worldBuilding/characterArc/comedy/warmth, 낮은 strategy/romance/artRealism/visualSoftness로 반영했다.
- Art 직접 관찰: 공식 제1화의 뷰어 시작·1·4·13번째 화면(인쇄 12~13쪽 포함)을 확인했다. 팔·입·표정을 크게 늘이는 강한 데포르메, 인물과 선실/술집 배경이 균형을 이루는 중간 정보량, 굵고 각진 검정 면과 방사선을 근거로 `artRealism=0`, `artDensity=2`, `visualSoftness=0`을 유지했다.
- 한계: 확인 범위에는 대표 전투 연속 패널이 없어 `motionImpact=unknown`이다. 라쿠텐 평점은 공개 페이지 스냅샷이며 API는 503으로 확인하지 못했다.

### `naruto`

- 공식 1권: https://books.shueisha.co.jp/items/contents.html?isbn=4-08-872840-8
- 공식 72권: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-880220-6
- 공식 제1화 내부 페이지: https://shonenjumpplus.com/episode/10833519556325021854
- 라쿠텐 공개 상품 페이지: https://books.rakuten.co.jp/rb/1136318/ — 사용자 평가 4.67, 50건
- 확인: 1권은 岸本斉史, 2000-03-03, ISBN 9784088728407. 공식 목록의 72권과 종결부 서술을 근거로 `completed`, 72권으로 기록했다. 연재 시작 연도는 공식 게재 정보의 1999년이다.
- 초반 관찰: 낙제생이 기술을 익히고 인정받는 보상이 명시적이며, 팀 편성·임무·라이벌 관계가 반복된다. 개그와 유대가 비극적 출생 비밀을 완충한다. progression/characterArc/worldBuilding/comedy/warmth를 높고, 로맨스는 존재하지만 서브 플롯 2보다 약한 1로 두었다.
- Art 직접 관찰: 공식 제1화의 인쇄 5쪽, 마을 전경/타이틀 전개, 17~18쪽을 확인했다. 인체와 표정은 일반적 소년만화 스타일화이고, 마을 전경은 조밀하지만 교실·라멘 장면은 여백과 배경이 균형적이며, 선은 깨끗하고 거칠거나 미려한 쪽으로 치우치지 않아 `artRealism=2`, `artDensity=2`, `visualSoftness=2`를 유지했다.
- 한계: 초반 팀 임무에서 strategy와 problemSolving의 경계가 흔들릴 수 있다. 패널은 `romance=1`을 블라인드 재태깅 후보로 삼아야 한다. 확인 Art 범위에는 대표 전투 동세가 없어 `motionImpact=unknown`이다.

### `dragon-ball`

- 공식 1권: https://books.shueisha.co.jp/items/contents.html?isbn=4088518314
- 공식 42권: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-851090-3
- 공식 전42권 세트: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-851912-8
- 공식 제1화 내부 페이지: https://shonenjumpplus.com/episode/10833519556325021841
- 라쿠텐 공개 상품 페이지: https://books.rakuten.co.jp/rb/1071084/ — 사용자 평가 4.56, 126건
- 확인: 1권은 鳥山明, 1985-09-10, ISBN 9784088518312. 출판사가 전42권·완결 후 작품으로 표기하므로 `completed`, 42권이다. 연재 시작은 공식 게재 정보의 1984년이다.
- 초반 관찰: 드래곤볼 탐색과 장소 전환, 직접 전투, 상시 개그가 핵심이다. 장기 전략·수수께끼 보상·암울함·지속 압박은 거의 없고 둥근 데포르메가 두드러진다. 밝음/저스트레스/직접전투의 anchor로 제안했다.
- Art 직접 관찰: 공식 제1화 타이틀/오프닝과 인쇄 8쪽, 18~19쪽을 확인했다. 머리·눈·팔다리와 동물형 신체는 강하게 단순화·데포르메되고, 숲·집·자동차는 읽기 쉬운 중간 밀도로 반복되며, 둥근 윤곽과 정돈된 선이 거칠지 않되 미려함을 전면화하지 않아 `artRealism=0`, `artDensity=2`, `visualSoftness=2`를 유지했다.
- 한계: 3권 말의 대회 진입 여부에 따라 `tournament` centrality 1의 범위 판정이 달라질 수 있다. 패널은 표준판 3권 목차 경계를 확인해야 한다. 인쇄 8쪽의 파괴 한 컷만으로 연속 동세를 대표시키지 않아 `motionImpact=unknown`이다.

### `attack-on-titan`

- 공식 1권: https://www.kodansha.co.jp/comic/products/0000017064
- 공식 34권: https://www.kodansha.co.jp/comic/products/0000352102
- 공식 제1화 내부 페이지: https://comic-days.com/episode/10834108156636966525
- 라쿠텐 공개 상품 페이지: https://books.rakuten.co.jp/rb/6380121/ — 사용자 평가 4.03, 613건
- 확인: 1권은 諫山創, 2010-03-17, ISBN 9784063842760. 34권 페이지가 “ついに完結”로 명시하므로 `completed`, 34권이다. 첫 게재는 2009년이다.
- 초반 관찰: 벽 붕괴 이후 생존·훈련·대규모 인명 손실이 연속되고, 거인의 정체와 벽의 규칙이 보상 구조를 만든다. 군사 집단의 다중 관계와 지속 압박을 반영해 darkness/mentalStress/mystery/world/ensemble을 높였다.
- Art 직접 관찰: 코믹 DAYS 공식 제1화의 뷰어 시작·4·14번째 화면(성벽 회상, 표지/조사병, 나무 아래 대화)을 확인했다. 인체·얼굴은 일반적 스타일화이고 거리·성벽·숲의 배경량은 장면별로 균형적이며, 불규칙한 윤곽·거친 해칭·각진 눈매가 반복되어 `artRealism=2`, `artDensity=2`, `visualSoftness=0`을 유지했다.
- 한계: 확인 표본은 정찰 준비와 정적 대화가 중심이라 거인 전투의 대표 타격·속도 패턴을 보여 주지 않는다. 따라서 `motionImpact=unknown`이다.

### `demon-slayer`

- 공식 1권: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-880723-2
- 공식 23권: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-882495-6
- 공식 제1화 내부 페이지: https://shonenjumpplus.com/episode/13932016480029012543
- 라쿠텐 공개 상품 페이지: https://books.rakuten.co.jp/rb/14141502/ — 사용자 평가 4.43, 292건
- 확인: 1권은 吾峠呼世晴, 2016-06-03, ISBN 9784088807232. 23권이 장기 투쟁의 결말을 명시하므로 `completed`, 23권이다.
- 초반 관찰: 가족 피살과 여동생 회복 목표, 수련·시험·검술 숙련, 이동 전투가 반복된다. darkness는 높지만 주인공의 공감과 가족 유대가 warmth를 동시에 높인다. romance는 초반에 관찰되지 않아 알려진 0이다.
- Art 직접 관찰: 공식 제1화의 뷰어 시작·4·14번째 화면(설원 오프닝, 가족 대화/타이틀, 집 내부 발견과 숲 이동)을 확인했다. 큰 눈과 단순화된 얼굴은 일반적 스타일화이고, 설원 여백과 집·숲의 선 정보가 균형을 이루며, 둥근 얼굴선과 옅은 톤이 거친 0과 미려한 4 어느 쪽에도 치우치지 않아 `artRealism=2`, `artDensity=2`, `visualSoftness=2`를 유지했다.
- 한계: Taisho 배경을 `historicalReconstruction=1`로만 두었다. 문화·제도 재현보다 귀살대 판타지 규칙이 중심이라는 판정은 패널 확인이 필요하다. 확인 범위에 대표 검술 연속 패널이 없어 `motionImpact=unknown`이다.

### `jujutsu-kaisen`

- 공식 1권: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-881516-9
- 공식 30권: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-884378-0
- 공식 제1화 내부 페이지: https://shonenjumpplus.com/episode/10834108156650001170
- 라쿠텐 공개 상품 페이지: https://books.rakuten.co.jp/rb/15510301/ — 사용자 평가 4.25, 135건
- 확인: 1권은 芥見下々, 2018-07-04, ISBN 9784088815169. 30권이 “最終巻”으로 명시되므로 `completed`, 30권이다.
- 초반 관찰: 저주받은 물건을 삼킨 뒤 사형 유예 상태에서 학교 임무와 전투가 빠르게 이어진다. 저주 규칙은 worldBuilding을 높이고, 죽음 위협과 육체 공유는 darkness/mentalStress를 높인다. 관계·따뜻함은 존재하나 사건과 위험보다 우선하지 않아 2다.
- Art 직접 관찰: 공식 제1화의 학교/복도 오프닝, 타이틀 전개, 인쇄 14~15쪽을 확인했다. 인체 비례는 일반적 스타일화이고, 교사·도시 배경과 패널 정보량은 균형적이며, 마른 선·짙은 검정·톱니 같은 저주 형상이 거칠고 각진 방향으로 반복되어 `artRealism=2`, `artDensity=2`, `visualSoftness=0`을 유지했다.
- 한계: 초반 1~3권에서 progression이 “반복 성장 보상” 4에 이르는지는 불충분해 2로 두었다. 오프닝의 단일 타격 장면만으로 반복 동세를 확정하지 않아 `motionImpact=unknown`이다.

### `my-hero-academia`

- 공식 1권: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-880264-0
- 공식 42권: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-884349-0
- 공식 최종권 확인: https://books.shueisha.co.jp/info/comics/3829.html
- 공식 제1화 내부 페이지: https://shonenjumpplus.com/episode/10833519556325021790
- 라쿠텐 공개 상품 페이지: https://books.rakuten.co.jp/rb/12953319/ — 사용자 평가 4.27, 96건
- 확인: 1권은 堀越耕平, 2014-11-04, ISBN 9784088802640. 출판사 뉴스가 42권을 최종권으로 명시하므로 `completed`, 42권이다.
- 초반 관찰: 무개성 주인공의 능력 계승·훈련·학교 입학이 명확한 성장 보상을 만들고, 학생·교사 관계가 일반 arc 수준으로 확장된다. 지지와 개그가 위험을 완충하지만 압도적 반복 보상은 아니어서 relationshipStructure와 emotionalWarmth는 2다. 초기 호감 표현은 존재하나 서브 플롯 2보다 약해 romance 1이다.
- Art 직접 관찰: 공식 제1화의 뷰어 시작·4·10번째 화면(오프닝, 프로 히어로 전투, 인쇄 25쪽)을 확인했다. 과장된 팔다리·표정은 0과 일반 스타일화 2 사이이고, 도시 원경·효과음·다층 패널은 균형보다 조밀하되 전면 고밀도는 아니며, 각진 검정 면이 중립과 거친 0 사이에 놓여 `artRealism=1`, `artDensity=3`, `visualSoftness=1`이다. 거대화·비행·신장 타격을 여러 패널의 사선, 폭발선, 파편으로 연속 강조해 `motionImpact=4`를 유지했다.
- 한계: 3권의 체육제 진입을 `tournament`·`sportsCompetition` centrality 1로만 반영했다. 판형별 수록 경계가 다르면 해당 Theme는 재검토해야 한다. Art 판정은 공식 제1화 표본이며 후반 작화로 일반화하지 않았다.

### `hunter-x-hunter`

- 공식 1권: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-872571-0
- 공식 작품/권 목록: https://sp.shonenjump.com/j/rensai/hunter/
- 공식 제1화 내부 페이지: https://shonenjumpplus.com/episode/10833519556325021810
- 라쿠텐 공개 상품 페이지: https://books.rakuten.co.jp/rb/977831/ — 사용자 평가 4.42, 219건
- 확인: 1권은 冨樫義博, 1998-06-04, ISBN 9784088725710. 공식 현재 작품 페이지가 39권을 최신으로 싣고 연재작 목록에 포함하므로 `ongoing`, 39권이다.
- 초반 관찰: 헌터 시험의 매 단계가 규칙·제약 분석과 경쟁자 읽기를 요구한다. 직접 화력보다 문제 해결과 단기 전술이 주요 보상이고, 네 명의 동행 관계가 위험을 완충한다. 초반 1~3권의 전술은 장기 계획·전쟁·정치·자원 운영 중심이 아니므로 `problemSolving=4`, `strategy=2`로 구분했다.
- Art 직접 관찰: 공식 제1화의 인쇄 5쪽, 14~~15쪽, 28~~29쪽, 33쪽을 확인했다. 큰 눈과 단순한 얼굴은 일반적 스타일화이고, 숲·가게·실내와 큰 여백이 교차해 전체 정보량은 균형적이며, 윤곽과 톤도 거칠거나 미려한 극단이 아니어서 `artRealism=2`, `artDensity=2`, `visualSoftness=2`를 유지했다.
- 한계: 시험을 정규 대진형 `tournament`로 볼지 경계가 있어 centrality 1로 제한했다. 공식 현재 페이지는 발행/연재 상태를 제공하지만 연속 게재 빈도는 표현하지 않는다. 확인 표본에 대표 전투가 없어 `motionImpact=unknown`이다.

### `jojo-bizarre-adventure`

- 공식 1권: https://books.shueisha.co.jp/items/contents.html?isbn=4-08-851126-3
- 공식 63권: https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-872709-7
- 공식 제1화 내부 페이지: https://shonenjumpplus.com/episode/3269632237245268586
- 라쿠텐 공개 상품 페이지: https://books.rakuten.co.jp/rb/1070477/ — 사용자 평가 4.61, 132건
- 확인: 1권은 荒木飛呂彦, 1987-08-10, ISBN 9784088511269. 이 work identity는 원제 단행본 1~63권이며, 63권이 제5부 완결을 명시하므로 `completed`, 63권으로 기록했다. 첫 연재는 1986년이다.
- 초반 관찰: 빅토리아 시대 조너선·디오의 가족 갈등과 석가면의 수수께끼가 고딕 호러·인물극·연애 관계로 전개되고, 초반 3권 안에 무술적 대응이 중심으로 올라온다. 높은 mystery/darkness/stress/artDensity와 낮은 comedy/softness가 희소하다.
- Art 직접 관찰: 공식 Part 1 제1화 프롤로그의 뷰어 시작·5·13번째 화면(마차 추락, 병상, 저택 원경)을 확인했다. 성인 인체·손·얼굴과 말·마차·저택 비례가 현실적이고, 촘촘한 해칭·의복 주름·배경 정보가 높으며, 굵은 눈썹·각진 근육·강한 명암이 반복되어 `artRealism=4`, `artDensity=4`, `visualSoftness=0`을 유지했다.
- 한계: 후속 Part 6 이후는 별도 표제로 발행되어 이 권수에 합산하지 않았다. G1 합병 시 동일 seriesGroup을 만들지 여부는 별도 데이터 결정이며 현재 blank다. 마차 추락 외에 대표 연속 전투 동세를 확인하지 못해 `motionImpact=unknown`이다.

### `berserk`

- 공식 1권: https://www.hakusensha.co.jp/comicslist/40773/
- 공식 43권: https://www.hakusensha.co.jp/comicslist/75529/
- 공식 1권 상품 페이지가 연결한 시험 읽기: https://www.hakusensha-e.net/hakusensha_otameshi?jdcn=59213574berserk00111
- 라쿠텐 공개 상품 페이지: https://books.rakuten.co.jp/rb/675894/ — 사용자 평가 4.37, 112건
- 확인: 1권은 三浦建太郎, 1990-11-26, ISBN 9784592135746. 43권은 2025-08-29 발매이며 三浦建太郎/スタジオ我画/森恒二를 현 저자·제작진으로 표기한다. 계속되는 서술과 최신권을 근거로 `ongoing`, 43권이다. 첫 연재는 1989년이다.
- 초반 관찰: Black Swordsman 시기의 단독 방랑자, 복수 동기, 사도 전투, 과거와 낙인의 수수께끼가 핵심이다. 성장 보상·제약 해결·장기 전략·따뜻한 관계보다 darkness/stress/mystery가 압도적이라 problemSolving은 0이다.
- Art 직접 관찰: 공식 51면 시험 읽기의 뷰어 8면, 인쇄 17~~18쪽과 30~~31쪽을 확인했다. 자연스러운 성인 인체와 말·갑옷·성곽 비례는 일반 스타일화 2보다 현실적이나 일부 얼굴·장비 과장이 있어 `artRealism=3`; 석조·군중·갑옷·무기·해칭이 대부분의 패널을 채워 `artDensity=4`; 검정 덩어리·날카로운 윤곽·거친 해칭이 지배해 `visualSoftness=0`을 유지했다.
- 한계: 이 범위는 후대의 고정 파티나 로맨스를 섞지 않아 relationship/romance/warmth가 0이다. comedy는 반복 강도를 공식 근거만으로 확정하지 못해 `unknown`이다. 검을 드는 한 전개는 있으나 대표 전투 연속이 아니므로 `motionImpact=unknown`이다.

### `vinland-saga`

- 공식 1권: https://www.kodansha.co.jp/comic/products/0000029270
- 공식 1권 시험 읽기: https://www.kodansha.co.jp/comic/products/0000029270/trial
- 공식 29권: https://www.kodansha.co.jp/comic/products/0000412718
- 공식 완결 기사: https://afternoon.kodansha.co.jp/news/5890.html
- 라쿠텐 공개 상품 페이지: https://books.rakuten.co.jp/rb/4100537/ — 사용자 평가 4.31, 101건
- 확인: 현행 Afternoon KC 1권은 幸村誠, 2006-08-23, ISBN 9784063144239. 공식 29권과 기사가 “ついに完結”을 명시하므로 `completed`, 29권이다. 최초 연재는 2005년이다.
- 초반 관찰: 북유럽 전쟁과 가족 상실·복수, 용병 집단, 해상 이동이 인물 변화와 함께 전개된다. 전쟁/복수/역사 재구성, 높은 darkness/stress와 군상 관계를 반영했고, survival은 독립 반복 주제로 보지 않아 제거했다.
- Art 직접 관찰: 현행 Afternoon KC 1권 공식 시험 읽기의 뷰어 2~4면을 확인했다. 4면의 요새·방패·군중은 현실적 비례에 일부 표정 과장이 섞여 `artRealism=3`, 건축·병력·화살·방패가 화면을 가득 채워 `artDensity=4`, 거친 전쟁선과 날카로운 명암 때문에 `visualSoftness=1`이다. 같은 면에서 대각선 화살 궤적, 집단 돌진, 충돌 효과가 여러 패널에 이어져 `motionImpact=4`를 유지했다.
- 한계: 주간 소년 매거진판 초기 권과 현행 Afternoon KC 재편의 수록 단위가 다르다. 대표 ISBN과 factor scope는 현행 Afternoon KC 1~3권으로 고정했으며, 다른 판형을 섞으면 안 된다. Art는 이 판형의 공식 시험 읽기만 사용했다.

### `vagabond`

- 공식 1권: https://www.kodansha.co.jp/comic/products/0000007491
- 공식 37권: https://www.kodansha.co.jp/comic/products/0000018543
- 공식 작품 페이지: https://morning.kodansha.co.jp/c/vagabond.html
- 공식 내부 페이지: 講談社 1권 `/trial`은 상품 페이지로 돌아가지만, 정식 라이선스 출판사 [VIZ Definitive Edition 1권](https://www.viz.com/manga-books/manga/vagabond-definitive-edition-volume-1-0/product/8139)은 원판 1~3권 수록을 명시하고 갤러리 3개 spread를 제공한다. 각 spread의 gutter 기준 좌·우를 별도 page equivalent로 판독했다.
- 라쿠텐 공개 상품 페이지: https://books.rakuten.co.jp/rb/1048909/ — 사용자 평가 4.28, 133건
- 확인: 1권은 井上雄彦/吉川英治, 1999-03-22, ISBN 9784063286199. 공식 작품 페이지가 현재도 “モーニングで連載中”으로 분류하고 최신 단행본이 37권이므로, 제3자식 hiatus 추정을 쓰지 않고 `ongoing`, 37권으로 기록했다. 첫 게재는 1998년이다.
- 초반 관찰: 강함을 좇는 무예 성장과 생존, 살상 후 심리 압박, 인물 관계가 비교적 긴 호흡으로 전개된다. 성장·인물극은 높고 빠른 액션군과 대비하도록 pacing은 2다.
- Art 후속 감사: VIZ 갤러리의 수채화 인물, 식생·농촌, 건축 spread 6개 page equivalent에서 현실적 인체와 공간(`artRealism=4`), 반복되는 식생·건물·해칭의 높은 정보량(`artDensity=4`), 거친 붓·각진 선·강한 검정 면(`visualSoftness=0`)을 확인해 override했다. 번역 식자는 밀도에서 제외했다.
- 한계: 라이선스판의 마케팅 선택 spread이므로 초반 전체의 동세 대표성을 증명하지 않는다. trailer의 pan/zoom도 만화 패널 연속 동세가 아니어서 `motionImpact=unknown`을 유지한다. 공식 페이지는 실제 게재 빈도나 장기 공백을 별도 status로 표시하지 않으므로 status는 출판사 표기대로 `ongoing`이다.

### `golden-kamuy`

- 공식 1권: https://books.shueisha.co.jp/items/contents.html?jdcn=08890082890082315501
- 공식 31권: https://books.shueisha.co.jp/items/contents.html?jdcn=08X10000000022132600
- 공식 제1화 내부 페이지: https://tonarinoyj.jp/episode/13932016480028986525
- 라쿠텐 공개 상품 페이지: https://books.rakuten.co.jp/rb/13062647/ — 사용자 평가 4.33, 136건
- 확인: 1권은 野田サトル, 2015-01-19, ISBN 9784088900827. 31권이 “大団円の最終巻”으로 명시하므로 `completed`, 31권이다. 첫 연재는 2014년이다.
- 초반 관찰: 금괴와 문신 지도를 좇는 조사, 홋카이도 생존 기술·수렵 식사, 아이누 문화, 군/탈옥수 세력이 빠르게 결합한다. darkness가 높지만 개그·파트너 유대·식문화 보상도 높아 같은 고어 액션군 안의 희소 대비가 된다.
- Art 직접 관찰: 공식 제1화의 뷰어 시작·5·13번째 화면(전쟁 회상 오프닝, 총검 돌격, 전투 직후)을 확인했다. 현실적인 성인 인체와 군복·총검·설원 배경 비례, 병사·장비·파편이 겹치는 높은 정보량, 굵은 검정 면과 각진 전쟁선이 반복되어 `artRealism=4`, `artDensity=4`, `visualSoftness=0`을 유지했다. 총검 돌격·베기·피탄이 연속 패널의 사선 자세, 파편, 큰 효과음으로 강조되어 `motionImpact=4`로 확정했다.
- 한계: Ainu 문화 표현은 단순한 장식 Theme가 아니며 사람 검수 없이 “정확한 역사 재현”으로 단정하면 안 된다. `historicalReconstruction=2`는 반복적 서사 중심성만 뜻하며 내용의 문화적 정확성 보증이 아니다. Art는 공식 제1화 표본이며 후반 작화로 일반화하지 않았다.

## 패널 전 체크 항목

- 13작품 모두 대표 표준판 1권과 유효 ISBN을 갖는다.
- 각 작품은 `AXIS_IDS` 17개를 정확히 한 번씩 가지며 값은 초반 1~3권 범위다.
- Theme는 존재만으로 넣지 않고 초반 반복 구조의 중심성 1/2로 제한했다.
- 13개 라쿠텐 review 값은 대표 ISBN의 공개 종이책 상품 페이지 스냅샷에서 기록했다. API는 HTTP 503으로 별도 확인하지 못했다.
- role/eligibility는 모델 제안일 뿐이다. 합병 전 사람 또는 승인된 독립 패널이 팩터·Theme·역할을 검수하고 review 상태를 별도 승격해야 한다.
