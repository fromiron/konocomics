# G1 chunk C 초벌 주석

- 작성 시점: 2026-08-11 (Asia/Tokyo)
- 범위: 지정된 13작품의 원판 단행본 1권 서지와 작품 초반 1~3권 팩터
- 상태: 전 작품 annotationReviewMethod=unreviewed, evidence sourceType=model, reviewedByHuman=false
- 판정 원칙: 팩터 사전 v1의 0/2/4 기준을 우선했다. 1/3은 사용하지 않았으며 motionImpact만 비적용 가능성을 열어 두었다.
- 버전 경계: 속편·스핀오프·신장판·문고판은 별도 Work로 합치지 않았다. volumeCount는 지정 작품의 원판 번호 체계에서 2026-08-11 현재 확인한 최신 번호다.
- 주의: 이 파일은 패널 전 staging 근거다. CSV의 eligibility와 catalogRole은 의도한 후보값이며 승인 기록이 아니다.
- G1 strict 후속 감사에서 공식 reader를 다시 열어 6쪽 이상·2개 맥락을 재확인했다. 아래의 선택 화면 서술은 최초 표본 요약이며 가용 페이지 수의 상한이 아니다. 최종 개별 refs와 표본 수는 `data/staging/g1/art-evidence-manifest.csv`가 우선한다.

## Rakuten 확인 제약

Rakuten Books API 신형 엔드포인트에 브라우저형 User-Agent와 localhost Referer/Origin을 붙인 smoke에서 referrer 검사는 통과했으나 503 Authentication service error가 반환되었다. 무리한 재시도를 하지 않았고 키 값은 출력하거나 파일에 기록하지 않았다. 대신 부모 에이전트가 각 대표권의 Rakuten Books 공개 상세 페이지를 직접 대조했고 현재 화면에 reviewAverage와 reviewCount가 함께 표시된 경우만 recommendation-context.csv에 채웠다. 이 값은 2026-08-11의 변동 가능한 시장 snapshot이며 API 응답값이 아니다.

| workId                     | reviewAverage | reviewCount | Rakuten 공개 상세                        |
| -------------------------- | ------------: | ----------: | ---------------------------------------- |
| natsumes-book-of-friends   |          4.55 |         457 | https://books.rakuten.co.jp/rb/3634138/  |
| march-comes-in-like-a-lion |          4.42 |         771 | https://books.rakuten.co.jp/rb/5393393/  |
| a-silent-voice             |          4.14 |         139 | https://books.rakuten.co.jp/rb/12504285/ |
| your-lie-in-april          |          4.19 |         133 | https://books.rakuten.co.jp/rb/11334463/ |
| kaguya-sama                |          4.44 |          31 | https://books.rakuten.co.jp/rb/13770604/ |
| horimiya                   |          4.32 |          97 | https://books.rakuten.co.jp/rb/11536900/ |
| kimi-ni-todoke             |          4.59 |         693 | https://books.rakuten.co.jp/rb/4021773/  |
| nana                       |          4.33 |         312 | https://books.rakuten.co.jp/rb/1155368/  |
| skip-and-loafer            |          4.60 |          73 | https://books.rakuten.co.jp/rb/15751027/ |
| bocchi-the-rock            |          4.17 |          12 | https://books.rakuten.co.jp/rb/15737629/ |
| haikyu                     |          4.53 |         245 | https://books.rakuten.co.jp/rb/11684455/ |
| slam-dunk                  |          4.80 |         271 | https://books.rakuten.co.jp/rb/1071048/  |
| hajime-no-ippo             |          4.25 |          62 | https://books.rakuten.co.jp/rb/1190632/  |

## 의도한 역할과 eligibility

| workId                     | 역할 후보 | onboarding | recommendation | 대비축 판독 이유                                                        |
| -------------------------- | --------- | ---------: | -------------: | ----------------------------------------------------------------------- |
| natsumes-book-of-friends   | anchor    |       true |           true | 느린 성장 보상·높은 온기·부드러운 작화와 요괴 세계관                    |
| march-comes-in-like-a-lion | discovery |      false |           true | 매우 느린 템포인데 문제 해결·정신 부담·온기가 함께 높음                 |
| a-silent-voice             | anchor    |       true |           true | 현실 작화·높은 인물 변화와 정신 부담·낮은 코미디                        |
| your-lie-in-april          | bridge    |      false |           true | 성장 보상·로맨스·정신 부담과 역동적 공연 연출의 결합                    |
| kaguya-sama                | anchor    |       true |           true | 밝은 코미디·로맨스 안에서 문제 해결과 단기 전술이 높음                  |
| horimiya                   | discovery |      false |           true | 낮은 어둠·높은 관계 변화와 온기·정적인 일상 연출                        |
| kimi-ni-todoke             | discovery |      false |           true | 매우 느린 템포·높은 로맨스와 온기·군상 관계의 희소 조합                 |
| nana                       | discovery |      false |           true | 현실 작화·높은 로맨스와 정신 부담·음악/직업 세계                        |
| skip-and-loafer            | bridge    |      false |           true | 낮은 어둠·높은 온기와 관계 폭·중간 로맨스를 일상군에 연결               |
| bocchi-the-rock            | bridge    |      false |           true | 높은 코미디와 정신 부담이 공존하고 작화 데포르메가 강함                 |
| haikyu                     | discovery |      false |           true | 빠른 템포·단기 전술·팀 관계·성장·동작 강조가 모두 높은 스포츠 대비 후보 |
| slam-dunk                  | anchor    |       true |           true | 성장·코미디 대비 후보이나 Art 4축은 공식 내부 표본 부재로 판정 보류     |
| hajime-no-ippo             | bridge    |      false |           true | 전투/스포츠에서 단기 전술·성장·속도감이 함께 높음                       |

역할 분포는 anchor 4, bridge 4, discovery 5다. Anchor 네 작품은 장르 인지도가 아니라 서로 다른 극단을 읽기 위한 판독기 후보로 골랐다. 역할은 전역 50작품 Discovery 인구통계 편향을 줄이는 curation 값이며 작품 사실 분류나 인기 등급이 아니다. 추천 eligibility는 G1 CLI 후보 풀을 위한 의도값이며 모든 행이 unreviewed라서 패널 승인 전 production source에 그대로 병합하면 안 된다.

## 작품별 근거

### natsumes-book-of-friends

- 공식 1권: https://www.hakusensha.co.jp/comicslist/40971/
- 연재 20주년 근거: https://www.hakusensha.co.jp/benefits_event/66535/
- 공식 33권: https://www.hakusensha.co.jp/comicslist/78224/
- 관찰: 1권 페이지에서 夏目友人帳, 緑川ゆき, ISBN 9784592171584, 2005-10-05를 확인했다. 20주년 공지는 2003년 LaLaDX 단편 시작을 설명하고 33권 페이지가 현행 번호를 확인한다.
- 상태/권수 한계: 최신 33권과 계속되는 공식 시리즈 노출을 근거로 ongoing으로 두었지만 출판사 페이지에 기계 판독 가능한 상태 필드는 없다.
- 공식 내부 페이지 Art 표본: https://manga-park.com/title/14363 의 인페이지 리더에서 `第一話①`, 뷰어 3/27과 11/27을 확인했다. 일반적으로 스타일화된 얼굴·인체 비례는 artRealism=2, 숲·신사·실내 배경과 여백이 공존하는 패널은 artDensity=2, 가는 곡선과 옅은 톤의 부드러운 표현은 visualSoftness=4를 지지한다. 3/27의 낙하·착지와 11/27의 부적이 끊어지는 연속 패널은 효과음과 운동선을 쓰지만 타격 강조가 과하지 않아 motionImpact=2다. 리더가 별도 URL로 전환되지 않는 구조라 위 URL에서 `第一話①` 항목과 뷰어 카운터를 함께 기록했다.
- 초반 판정: 친구장 계약과 요괴 사연이 반복되어 worldBuilding=4, characterArcWeight=4, emotionalWarmth=4다. 성장 보상은 구조 중심이 아니어서 progression=0이고 romance=0이다.
- 역할 이유: 스포츠 Anchor와 정반대인 느린 온기·부드러운 시각축을 읽는 anchor 후보.

### march-comes-in-like-a-lion

- 공식 1권: https://www.hakusensha.co.jp/comicslist/43152/
- 공식 작가/연재 시작: https://3lion.younganimal.com/author.html
- 공식 현행 작품 페이지: https://3lion.younganimal.com/
- 관찰: 1권에서 羽海野チカ, ISBN 9784592145110, 2008-02-22를 확인했다. 작가 페이지는 2007년 연재 시작을, 현행 페이지는 大好評連載中 및 최신 18권 2025-09-29를 명시한다.
- 공식 내부 페이지 Art 표본: <http://www.hakusensha-e.net/enet_otameshi.php?bid=v-3lion_001&rurl=http://3lion.younganimal.com> 의 1권 공식 시험 읽기에서 뷰어 15/65, 31/65, 45/65를 확인했다. 스타일화됐지만 일관된 인체는 artRealism=2, 15쪽의 도시·역 건축 묘사와 45쪽의 열린 대화 패널이 함께 나타나는 범위는 artDensity=2, 둥근 표정과 가는 선은 visualSoftness=4를 지지한다. 세 표본에서 대표적인 신체 동작 장면을 확인하지 못했지만 작품 전체에 동적 장면이 없다고 단정할 수도 없어 motionImpact는 `unknown`으로 두었다.
- 초반 판정: 프로 장기 대국의 제약 분석이 반복되어 problemSolving=4다. 현재 공식 근거가 장기 자원 운영보다 개별 대국의 수읽기·단기 계획을 지지하므로 strategy=2로 보수화했다. 회복과 가족 관계가 중심이라 characterArcWeight=4, relationshipStructure=4, mentalStress=4, emotionalWarmth=4다.
- 역할 이유: 전략이 높지만 템포가 0이고 온기도 높은 드문 조합을 확인하는 discovery 후보.

### a-silent-voice

- 공식 1권: https://www.kodansha.co.jp/comic/products/0000019055
- 공식 7권: https://www.kodansha.co.jp/comic/products/0000019341
- 관찰: 1권에서 大今良時, ISBN 9784063949735, 2013-11-15와 週刊少年マガジン 초출을 확인했다. 7권 소개의 完 표시로 completed 및 7권을 확정했다.
- 공식 내부 페이지 Art 표본: https://comic-days.com/episode/10834108156636913658 의 `第1話 石田将也`에서 56개 뷰어 페이지 중 17~~18쪽과 37~~38쪽을 확인했다. 현실적인 인체·손·교실/주거 배경은 artRealism=4, 배경과 열린 여백이 섞인 구성은 artDensity=2, 둥근 일상 표정과 거친 괴롭힘 장면이 공존하는 중립 표현은 visualSoftness=2를 지지한다. 37~38쪽의 밀침·충돌 연속 패널은 집중선과 신체 반동을 쓰되 스포츠 만화 수준의 속도 강조는 아니어서 motionImpact=2다.
- 초반 판정: 괴롭힘의 가해/피해 관계와 재접촉이 인물 변화 및 관계망을 이끌어 characterArcWeight=4, relationshipStructure=4, mentalStress=4다. 전략·세계 규칙은 핵심이 아니어서 strategy=0, worldBuilding=0이다. 초반 친구 관계만으로 선택가족을 확정하지 않아 foundFamily Theme는 제외했다.
- 역할 이유: 높은 정신 부담·현실 작화·낮은 코미디를 밝은 Anchor들과 대비하는 anchor 후보.

### your-lie-in-april

- 공식 1권: https://www.kodansha.co.jp/comic/products/0000043314
- 공식 11권: https://www.kodansha.co.jp/comic/products/0000042430
- 관찰: 1권에서 新川直司, ISBN 9784063713015, 2011-09-16과 月刊少年マガジン 초출을 확인했다. 11권의 完 표시로 completed 및 11권을 확정했다.
- 공식 내부 페이지 Art 표본: https://www.kodansha.co.jp/comic/products/0000043314/trial 의 1권 초반 인쇄 p14 전후와 https://www.kodansha.co.jp/comic/products/0000043330/trial 의 2권 `第5話 暗い海` 인쇄 pp5~~13을 확인했다. 일반적으로 스타일화된 인체는 artRealism=2, 교실·피아노 건반·악보·공연장과 여백이 균형을 이루는 패널은 artDensity=2, 가는 선·빛망울·부드러운 표정은 visualSoftness=4를 지지한다. 2권 pp8~~9의 충돌 장면은 가방과 물건이 날리고 전면 집중선·큰 효과음·신체 반동을 함께 써 motionImpact=4를 직접 지지한다. 공연 동세 자체는 이 시험 읽기 범위에서 별도로 확정하지 않았다.
- 초반 판정: 피아노 복귀와 공연 과제가 반복되어 progression=4이고 competition 구조 때문에 tournament centrality=2다. 과거 트라우마와 연애선이 동시에 중심이라 mentalStress=4, romance=4다.
- 역할 이유: 성장/경쟁 작품과 로맨스/정서 작품 사이를 잇는 bridge 후보.

### kaguya-sama

- 공식 1권: https://www.s-manga.net/items/contents.html?isbn=978-4-08-890432-0
- 공식 전권 목록: https://www.s-manga.net/search/search.html?seriesid=37405
- 공식 28권: https://www.s-manga.net/items/contents.html?isbn=9784088925349
- 관찰: 1권에서 赤坂アカ, ISBN 9784088904320, 2016-03-18과 ミラクルジャンプ/週刊ヤングジャンプ 게재를 확인했다. 전권 목록은 1~28권을, 28권 소개는 최종권임을 확인한다.
- 공식 내부 페이지 Art 표본: https://www.s-manga.net/reader/main.php?cid=9784088904320 의 1권 제1화에서 표지 기준 뷰어 전환 8을 확인했고 전환 14에서 시험 읽기가 끝나는 것도 대조했다. 스타일화된 얼굴·인체는 artRealism=2, 인물 클로즈업·대화 패널·열린 여백의 혼합은 artDensity=2, 가는 선과 강한 검정·폭발형 배경이 함께 있는 중립 표현은 visualSoftness=2를 지지한다. 확인 범위의 폭발형 배경은 심리 강조일 뿐 대표적인 신체 동작 표본이 아니므로 motionImpact는 `unknown`으로 유지했다.
- 초반 판정: 상대에게 고백을 유도하는 제약 설계가 매화 반복되어 problemSolving=4, strategy=2, comedy=4, romance=4다. 에피소드별 책략은 장기 운영보다 단기 계획이고, 초반은 두 주인공과 반복 조연 중심이라 relationshipStructure=2다. 어둠은 반복 구조가 아니어서 darkness=0이다.
- 역할 이유: 밝은 로맨스와 높은 문제 해결·단기 전술을 함께 읽는 anchor 후보.

### horimiya

- 공식 1권: https://magazine.jp.square-enix.com/top/comics/detail/9784757535435/
- 공식 작품 페이지: https://magazine.jp.square-enix.com/gfantasy/story/horimiya/
- 공식 17권: https://magazine.jp.square-enix.com/top/comics/detail/9784757586345/
- 관찰: 1권에서 HERO/萩原ダイスケ, ISBN 9784757535435, 2012-03-27을 확인했다. 작품 페이지는 2011년 시작과 2021년 본편 종료를 설명하며 번호가 붙은 17권은 추가 에피소드 A piece of memories다.
- 상태/권수 한계: 본편은 16권에서 끝났지만 공식 번호 체계의 17권까지 포함해 volumeCount=17, status=completed로 두었다. 공식 페이지가 독자층 enum을 직접 명시하지 않아 demographic은 `unknown`이다.
- 공식 내부 페이지 Art 표본: https://magazine.jp.square-enix.com/gfantasy/tcym/horimiya_01/ 의 `img/008.jpg`, `009`, `010`, `015`, `016`, `017`을 확인했다. 스타일화된 큰 눈·일반 인체는 artRealism=2, 학교·가정 배경과 열린 대화 패널이 섞인 구성은 artDensity=2, 매끈한 곡선과 옅은 톤은 visualSoftness=4를 지지한다. 기존에 얼음 충돌로 기록한 `016.jpg`는 실제로 학교 대화 페이지였고 연속 action sequence를 재현하지 못해 G1의 motionImpact는 override에서 `unknown`으로 내렸다.
- 초반 판정: 학교 밖 모습의 비밀과 관계 진전이 반복되어 characterArcWeight=4, relationshipStructure=4, romance=4, emotionalWarmth=4다. 초반 친구·연애 관계만으로 선택가족을 확정하지 않아 foundFamily Theme는 제외했다.
- 역할 이유: 높은 온기/관계 변화와 낮은 어둠/정적 연출을 확인하는 discovery 후보.

### kimi-ni-todoke

- 공식 1권: https://www.s-manga.net/items/contents.html?isbn=4-08-846061-8
- 공식 30권: https://www.s-manga.net/items/contents.html?isbn=978-4-08-844007-1
- 관찰: 1권에서 椎名軽穂, ISBN-10 4088460618, 2006-05-25와 別冊マーガレット 게재를 확인했다. 저장 ISBN-13은 체크섬 변환값 9784088460611이다. 30권의 완결 소개로 completed 및 30권을 확정했다.
- 시작연도 한계: 1권 페이지는 잡지 게재처와 단행본 일자는 명확하지만 2005년 연재 시작을 별도 구조화 필드로 제공하지 않는다.
- 공식 내부 페이지 Art 표본: https://www.s-manga.net/reader/main.php?cid=4088460618 의 1권 제1화 p7~12를 확인했다. 스타일화된 얼굴과 일반 인체는 artRealism=2, 학교 배경과 여백이 균형을 이루는 패널은 artDensity=2, 가는 머리카락 선·빛망울·둥근 표정은 visualSoftness=4를 지지한다. 작은 달리기 패널은 단일 장면이고 연속 action sequence가 아니므로 G1의 motionImpact는 override에서 `unknown`으로 내렸다.
- 초반 판정: 사회적 고립에서 친구/연애 관계가 넓어져 characterArcWeight=4, relationshipStructure=4, romance=4, emotionalWarmth=4다. 템포는 의도적으로 느려 pacing=0이다.
- 역할 이유: 느린 템포의 따뜻한 군상 로맨스를 다른 성장/경쟁 작품에 연결하는 bridge 후보.

### nana

- 공식 1권: https://www.s-manga.net/items/contents.html?isbn=4-08-856209-7
- 공식 작품 페이지: https://cookie.shueisha.co.jp/story/25.html
- 공식 21권: https://www.s-manga.net/items/contents.html?isbn=9784088568768
- 관찰: 1권에서 矢沢あい, ISBN-10 4088562097, 2000-05-15와 Cookie 게재를 확인했다. 저장 ISBN-13은 체크섬 변환값 9784088562094다. Cookie 작품 페이지와 전권 목록의 최신 번호는 21권이다.
- 상태 한계: 공식 작품 페이지는 장기 휴재를 구조화 상태로 표기하지 않는다. 21권 이후 신간 부재만으로 hiatus를 확정하지 않고 status는 `unknown`으로 두었으며 sourceAgreement를 0.86으로 낮췄다.
- 공식 내부 페이지 Art 표본: https://www.s-manga.net/reader/main.php?cid=4088562097 의 1권 제1화에서 표지 기준 뷰어 전환 8과 12를 확인했고 후자는 인쇄 p22를 포함한다. 길고 현실적인 성인 인체·패션 비례는 artRealism=4, 극장·학교·교실 배경과 열린 대화 패널의 혼합은 artDensity=2, 가는 선과 강한 패션 윤곽이 공존하는 중립 표현은 visualSoftness=2를 지지한다. 이 범위에는 공연이나 대표적인 신체 동작 표본이 없어 motionImpact는 `unknown`으로 유지했다.
- 초반 판정: 두 나나의 우정/동거와 음악·직업 환경이 반복되어 relationshipStructure=4, romance=4, mentalStress=4, workplace=2, foundFamily=2다.
- 역할 이유: 높은 정서 부담과 로맨스가 현실 작화/음악 세계와 결합되는 discovery 후보.

### skip-and-loafer

- 공식 1권: https://www.kodansha.co.jp/comic/products/0000318780
- 공식 13권: https://www.kodansha.co.jp/comic/products/0000425789
- 공식 작품 목록: https://www.kodansha.co.jp/titles/1000033341
- 관찰: 1권에서 高松美咲, ISBN 9784065142097, 2019-01-23과 アフタヌーン 2018년 10월호 초출을 확인했다. 작품 목록은 최신 13권을 노출한다.
- 상태 한계: 최신권과 계속되는 작품 목록을 근거로 ongoing으로 두었으며 별도 구조화 상태 필드는 없다.
- 공식 내부 페이지 Art 표본: https://www.kodansha.co.jp/comic/products/0000318780/trial 의 1권 첫 에피소드에서 표지 기준 뷰어 전환 5와 10을 확인했고 후자는 인쇄 p18을 포함한다. 단순화된 얼굴과 일반 인체는 artRealism=2, 전철역·교복 묘사와 열린 여백이 섞인 구성은 artDensity=2, 가는 선·둥근 표정·옅은 톤은 visualSoftness=4를 지지한다. p18의 달리기·팔을 잡는 연속 패널은 사선 효과선과 효과음을 쓰는 보통 수준의 동세라 motionImpact=2이며, 따라서 notApplicable을 쓰지 않았다.
- 초반 판정: 낯선 도쿄 학교에서의 관계 적응이 중심이라 characterArcWeight=4, relationshipStructure=4, emotionalWarmth=4다. darkness=0이고 초기 로맨스는 중심보다 완만해 romance=2다.
- 역할 이유: 낮은 어둠·높은 온기와 넓은 관계 구조를 읽는 discovery 후보.

### bocchi-the-rock

- 공식 전권 목록: https://houbunsha.co.jp/comics/detail.php?p=%25A4%25DC%25A4%25C3%25A4%25C1%25A1%25A6%25A4%25B6%25A1%25A6%25A4%25ED%25A4%25C3%25A4%25AF%25A1%25AA
- 공식 주문서 보조: https://houbunsha.co.jp/patron/pdf/202604_ordersheet_mangatimeKR.pdf
- 관찰: 芳文社 전권 목록에서 はまじあき, 1권 ISBN 9784832270725, 2019-02-27과 최신 8권을 확인했다. 주문서는 1권 ISBN을 독립적으로 보조한다.
- 메타데이터 한계: 구형 출판사 페이지의 URL 인코딩과 독자층 분류가 안정적이지 않아 demographic=unknown, metadataConfidence=0.96으로 보수화했다. 2018년 연재 시작은 공식 권목록의 연재/초출 맥락을 따르되 별도 구조화 필드는 없다.
- 공식 내부 페이지 Art 표본: https://comic-fuz.com/manga/viewer/24407 의 `1巻 第1話`에서 8/23과 16/23을 확인했다. 강한 치비·데포르메는 artRealism=0, 정형 4컷과 단순한 배경·큰 여백은 artDensity=0, 둥근 윤곽·옅은 톤·귀여운 표정은 visualSoftness=4를 지지한다. 확인한 두 페이지에는 대표적인 연주나 신체 동작 연속 표본이 없어 motionImpact는 `unknown`으로 유지했다.
- 초반 판정: 밴드 참여/무대 달성이 반복되어 progression=4이고 사회불안의 반복 압박 때문에 mentalStress=4다. comedy=4, emotionalWarmth=4다.
- 역할 이유: 높은 코미디와 높은 정신 부담이 공존하는 스타일화 작품을 성장/일상 군에 연결하는 bridge 후보.

### haikyu

- 공식 1권: https://www.s-manga.net/items/contents.html?isbn=978-4-08-870453-1
- 공식 45권: https://www.s-manga.net/items/contents.html?isbn=978-4-08-882471-0
- 관찰: 1권에서 古舘春一, ISBN 9784088704531, 2012-06-04와 週刊少年ジャンプ 게재를 확인했다. 45권 소개의 ここに完結 문구로 completed 및 45권을 확정했다.
- 공식 내부 페이지 Art 표본: https://www.s-manga.net/reader/main.php?cid=9784088704531 의 1권 제1화 p8~~11과 p31~~32를 확인했다. 스타일화됐지만 일관된 선수 인체는 artRealism=2, 코트·체육관·관중과 열린 동작 패널이 균형을 이루어 artDensity=2, 각진 선·강한 검정·거친 효과선은 visualSoftness=0을 지지한다. p31~32의 점프·스파이크·블록 연속은 원근 과장, 공 접촉 폭발, 속도선, 대형 효과음과 전신 반동을 함께 써 motionImpact=4를 직접 지지한다.
- 초반 판정: 연습/경기에서 숙련 보상과 실시간 적응이 반복되어 progression=4, problemSolving=4, strategy=2, pacing=4다. 팀 상호작용은 relationshipStructure=4다.
- 역할 이유: 스포츠의 성장·전략·속도·팀 관계를 로맨스/일상 군에 연결하는 bridge 후보.

### slam-dunk

- 공식 1권: https://www.s-manga.net/items/contents.html?isbn=4-08-871611-6
- 공식 원판 전31권 세트: https://www.s-manga.net/items/contents.html?isbn=4-08-851904-3
- 공식 31권: https://www.s-manga.net/items/contents.html?isbn=4-08-871839-9
- 관찰: 1권에서 井上雄彦, ISBN-10 4088716116, 1991-02-08과 週刊少年ジャンプ 게재를 확인했다. Rakuten 종이 1권(https://books.rakuten.co.jp/rb/1071048/)과 ISBN 체크섬을 대조해 저장 ISBN-13을 9784088716114로 확정했다. 출판사 세트 페이지가 원판 전31권을 명시한다.
- 판본 한계: 신장재편판이 아니라 원판 ジャンプコミックス 번호 체계만 volumeCount=31에 사용했다.
- 공식 내부 페이지 Art 차단: https://www.s-manga.net/reader/main.php?cid=08X10000000062717100 과 https://shonenjumpplus.com/volume/17106567266293399806/trial 을 모두 열었으나 전자는 표지에서 바로 종료 화면으로 넘어갔고, 후자는 뷰어 페이지 요소 2개가 표지와 구매/종료 화면뿐이었다. 두 공식 시험 읽기 모두 1권 내부 만화 페이지를 제공하지 않아 표지로 Art를 판정하지 않았고 artRealism, artDensity, visualSoftness, motionImpact를 전부 `unknown`으로 내렸다. 이 작품의 Art coverage는 0.00이며 내부 표본이 확보될 때까지의 명시적 blocker다.
- 초반 판정: 초보가 농구 기술을 얻는 보상이 반복되어 progression=4이고 characterArcWeight=4다. 가입·기초 훈련·연습·슛 특훈은 일반적인 arc 단위 변화라 pacing=2이며, 초반 반복 인물군은 복잡한 군상극보다 고정 팀·핵심 조연 구조라 relationshipStructure=2다. 코미디도 반복 핵심이다. 정신적 피로는 코미디와 경쟁 압박만으로 0/2/4 경계를 확정하지 않고 `unknown`으로 두었다. 1~3권에는 반복 tournament 구조가 없어 Theme에서 제외했다.
- 역할 이유: 성장·코미디의 anchor 후보로 제안했지만, Art는 공식 내부 표본 부재로 4축 모두 `unknown`이며 replacement 대상이다.

### hajime-no-ippo

- 공식 1권: https://www.kodansha.co.jp/comic/products/0000005071
- 공식 145권: https://www.kodansha.co.jp/comic/products/0000422841
- 관찰: 1권에서 森川ジョージ, ISBN 9784063115321, 1990-02-09와 週刊少年マガジン 게재를 확인했다. 1권의 관련 작품 목록과 145권 페이지가 현행 최신 번호를 확인한다.
- 시작/상태 한계: 1989년 잡지 연재 시작과 ongoing 판정은 공식 작품 맥락 및 계속되는 최신권을 근거로 했지만 구조화 상태 필드는 없다.
- 공식 내부 페이지 Art 표본: https://pocket.shonenmagazine.com/title/01291/episode/315412 의 `Round 1 The First Step`에서 인쇄 pp26~~27과 pp38~~39를 확인했다. 스타일화됐지만 일관된 인체는 artRealism=2, 촘촘한 다중 패널·해칭·학교/거리 배경은 artDensity=4, 각진 얼굴·거친 선·강한 검정은 visualSoftness=0을 지지한다. pp26~27의 펀치는 팔의 궤적선, 맞은 신체의 반동, 집중선과 큰 효과음을 연속으로 써 motionImpact=4를 직접 지지한다.
- 초반 판정: 훈련 숙련과 경기의 상대 분석이 반복되어 progression=4, strategy=2, pacing=4다. 복싱은 combat=2, martialArts=2, tournament=2, sportsCompetition=2다.
- 역할 이유: 직접 전투 스포츠에서 전략과 성장 보상이 모두 높은 bridge 후보.

## 패널 전달 메모

- Anchor 후보 4작품은 모든 축을 우선 수동 검수한다.
- recommendation-only 9작품은 Narrative/Tone을 먼저 재태깅하고 Art는 공식 1~3권 시험 읽기 표본으로 재확인한다.
- 무작위 15~20% 블라인드 재태깅은 최소 2작품이며 3작품을 권장한다. 기존 값을 숨기고 같은 범위만 보아 2단계 이상 차이를 기록한다.
- 병합 시점에 Rakuten snapshot이 오래되었으면 공개 상세 또는 정상화된 API로 다시 확인하고 두 값 중 하나라도 관찰되지 않으면 둘 다 공란으로 되돌린다.
- NANA status unknown, ホリミヤ volumeCount 17 포함 기준·demographic unknown, 芳文社 demographic unknown은 패널에서 명시적으로 승인 또는 수정해야 한다.
