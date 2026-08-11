# 슬라이스 1 샘플 주석 근거

> `data/source/*.csv`에 기록한 11작품 초벌 주석의 근거 기록이다. 값의 단일 원천은 CSV이며, 이 문서는 관찰 범위와 판정 이유를 보존한다.

## 검수 상태와 사용 제한

- 공식 출판사 서지·소개·공개 미리보기를 모델이 대조해 만든 오프라인 초벌 제안이다.
- `evidence/evidence.csv`의 `sourceType=model`, `reviewedByHuman=false`를 사실대로 유지한다.
- 작품별 관찰 범위는 1~3권 또는 공식 공개 첫 화다. 후반 전개는 초반 팩터에 섞지 않는다.
- 실제 페이지 근거가 부족한 축은 낮은 값으로 대신하지 않고 `unknown`으로 둔다.
- 추천 대상 사용 여부는 사용자가 지정한 독립 판정 패널의 만장일치 결과와 별도로 기록한다. 그 결과가 사람 검수를 의미하지는 않는다.
- G1의 더 엄격한 Art 재감사에서 바뀐 값은 원본 freeze를 수정하지 않고 `data/staging/g1/candidate-overrides/factors.csv`가 대체한다.

## ダンジョン飯

근거 자료:

- [KADOKAWA 1권 서지](https://www.kadokawa.co.jp/product/301411000826/)
- [KADOKAWA 2권 소개](https://www.kadokawa.co.jp/product/301506000927/)
- [KADOKAWA 3권 소개](https://www.kadokawa.co.jp/product/321604000684/)
- [카도코미 공식 제1화](https://comic-walker.com/detail/KC_000393_S/episodes/KC_0003930000100011_E)
- [KADOKAWA 연재 이력](https://www.kadokawa.co.jp/topics/13648/)

관찰:

- 식량을 잃은 고정 파티가 던전의 생태와 재료 제약을 분석해 몬스터를 조리하는 과정이 반복되므로 `problemSolving`, `worldBuilding`, `comedy`, `cooking`, `survival`이 높다.
- 층 이동과 구조 목표는 분명하지만 능력 획득형 성장 보상은 중심이 아니므로 `progression`은 낮다.
- 동료의 죽음과 아사 위험은 존재하지만 부활 규칙, 협력, 식사 개그가 톤을 완충하므로 `darkness`와 `emotionalWarmth`를 모두 중간 이상으로 판정했다.
- 카도코미 공식 제1화의 시작 페이지와 바실리스크 전투 스프레드를 확인했다. 기능적 인체·장비와 과장 표정이 섞여 `artRealism=2`, 몬스터 해칭·장비·던전 배경의 정보량이 중상이라 `artDensity=3`, 둥근 표정과 단단한 외곽선이 공존해 `visualSoftness=2`다. 바실리스크의 돌진·대각 패널·동작선은 `motionImpact=3`을 지지한다.
- 출판사 자료가 독자층을 명시하지 않아 `demographic=unknown`을 유지했다.

## キングダム

근거 자료:

- [集英社 1권 서지·개요](https://www.s-manga.net/items/contents.html?isbn=4-08-877079-X)
- [集英社 2권 소개](https://www.s-manga.net/items/contents.html?isbn=4-08-877129-X)
- [集英社 3권 소개](https://www.s-manga.net/items/contents.html?isbn=4-08-877171-0)
- [集英社 공식 1권 미리보기](https://www.s-manga.net/reader/main.php?cid=408877079X)
- [ヤングジャンプ 20주년 페이지](https://youngjump.jp/kingdom/20th/)
- [ヤングジャンプ 연재 목록](https://youngjump.jp/manga/)

관찰:

- 왕위 찬탈, 산민족 동맹, 왕도 탈환과 장기 전쟁 목표가 초반 사건을 결정하므로 `strategy`, `worldBuilding`, `war`, `politics`, `historicalReconstruction`이 높다.
- 신의 대장군 목표와 반복 수련은 성장 기대를 만들지만 초반부터 압도적인 획득 루프는 아니므로 `progression=3`으로 두었다.
- 살해·추격·열세 전투가 빠르게 이어져 `pacing`, `darkness`가 높고, 개그·정서적 휴식은 상대적으로 적다.
- 공식 1권 미리보기의 초반 병사·시신·갑옷 페이지를 확인했다. 연령과 신체 비례·갑옷 구조가 현실적이어서 `artRealism=4`, 군중·복식·해칭 정보량이 매우 높아 `artDensity=4`, 거칠고 각진 선과 강한 명암 때문에 `visualSoftness=0`이다.
- 확인한 지면이 전투 타격의 대표 동세를 충분히 보여 주지는 않아 `motionImpact`는 줄거리로 보충하지 않고 `unknown`으로 낮췄다.

## 鋼の錬金術師

근거 자료:

- [SQUARE ENIX 1권 서지·개요](https://magazine.jp.square-enix.com/top/comics/detail/9784757506206/)
- [SQUARE ENIX 2권 소개](https://magazine.jp.square-enix.com/top/comics/detail/9784757506992/)
- [SQUARE ENIX 3권 소개](https://magazine.jp.square-enix.com/top/comics/detail/9784757507913/)
- [SQUARE ENIX 공식 제1화](https://magazine.jp.square-enix.com/gangan/tcym/hagaren_01/index.html)
- [SQUARE ENIX 연재 시작 자료](https://www.jp.square-enix.com/presents/info/20210712002891.html)
- [SQUARE ENIX 완결 안내](https://magazine.jp.square-enix.com/top/anime/detail/hagaren/)

관찰:

- 등가교환과 물질 변환 규칙을 읽고 연성으로 해결하는 구조, 현자의 돌 단서 추적이 반복되어 `problemSolving`, `mysteryReveal`, `worldBuilding`, `investigation`, `crafting`이 높다.
- 형제는 초반부터 숙련되어 있어 능력 획득보다 진실 탐색이 보상이며 `progression`은 낮다.
- 신체 상실과 국가 범죄 같은 비극이 중심이지만 형제애와 돌봄이 반복 보상이므로 `darkness`와 `emotionalWarmth`를 함께 높게 판정했다.
- 공식 제1화의 교회 내부·연성진·신체 훼손 페이지를 확인했다. 기능적 인체에 표정 단순화가 섞여 `artRealism=2`, 배경·연성 기호·소품 정보량이 보통이라 `artDensity=2`, 각지고 거친 선과 혈흔 표현이 강해 `visualSoftness=1`이다. 연성 충격과 격투의 파편·대각 동작은 `motionImpact=4`를 지지한다.

## DEATH NOTE

근거 자료:

- [集英社 1권 서지·개요](https://www.s-manga.net/items/contents.html?isbn=4088736214)
- [集英社 2권 소개](https://www.s-manga.net/items/contents.html?isbn=4088736311)
- [集英社 3권 소개](https://www.s-manga.net/items/contents.html?isbn=4088736524)
- [集英社 공식 1권 미리보기](https://www.s-manga.net/reader/main.php?cid=4088736214)
- [集英社 최종권 안내](https://www.s-manga.net/items/contents.html?isbn=4088741315)

관찰:

- 살인 조건 검증, 신원 추적, 감시 회피, 가설과 반증이 전개의 핵심이므로 `problemSolving`, `strategy`, `mysteryReveal`, `investigation`이 최고 수준이다.
- 연쇄 살인, 사신, 도덕적 타락과 발각 압박이 지속되어 `darkness`, `mentalStress`가 높고 `comedy`, `emotionalWarmth`는 낮다.
- 학생 생활은 반복 배경이지만 수사전보다 하위여서 `school`의 중심성은 1이다.
- 공식 1권 미리보기와 少年ジャンプ＋ 공식 제1화는 현실적인 인체·공간과 세밀한 표정을 보여 `artRealism=4`를 지지한다. 다만 연속 action sequence를 확보하지 못해 G1의 `motionImpact`는 override에서 `unknown`으로 내렸다.
- G1 재감사에서 공식 제1화 6쪽을 악마계와 가정·학교 맥락으로 나누어 다시 확인했다. 번역 식자는 밀도에서 제외했고, 고밀도 악마계 해칭과 중밀도 생활 지면의 혼합을 `artDensity=3`, 가는 선과 각진 얼굴·강한 검정 면의 혼합을 `visualSoftness=1`로 override했다.

## SPY×FAMILY

근거 자료:

- [集英社 1권 서지·개요](https://www.s-manga.net/items/contents.html?isbn=978-4-08-882011-8)
- [集英社 2권 소개](https://www.s-manga.net/items/contents.html?isbn=978-4-08-882120-7)
- [集英社 3권 소개](https://www.s-manga.net/items/contents.html?isbn=9784088821832)
- [集英社 공식 1권 미리보기](https://www.s-manga.net/reader/main.php?cid=9784088820118)
- [少年ジャンプ＋ 연재 페이지](https://shonenjumpplus.com/episode/17107094913779619859)

관찰:

- Operation Strix의 장기 침투 계획, 정보 수집, 학교 입학 과제가 이어져 `strategy`, `investigation`, `school`이 높다.
- 서로 정체를 숨기는 가짜 가족의 일상 실패와 실제 유대 형성이 반복되어 `comedy`, `emotionalWarmth`, `foundFamily`가 최고 수준이다.
- 암살·납치·전쟁 위기는 있으나 가족 코미디가 표현을 완충하므로 `darkness`는 중간, `mentalStress`는 낮다.
- 공식 1권 미리보기의 가족 소개 페이지를 확인했다. 성인 인체의 기능적 비례와 아냐의 강한 데포르메가 함께 보여 `artRealism=2`, 인물 중심의 성긴 패널과 첩보 장비 더미가 공존해 `artDensity=2`, 둥근 얼굴·밝은 색조·부드러운 윤곽 때문에 `visualSoftness=3`이다.
- 공식 자료로 액션의 존재는 확인했지만 대표 전투 페이지의 동세 표본이 부족해 `motionImpact=unknown`으로 보존했다.

## 葬送のフリーレン

근거 자료:

- [小学館 1권](https://shogakukan-comic.jp/book?isbn=9784098501809)
- [小学館 2권](https://shogakukan-comic.jp/book?isbn=9784098501816)
- [小学館 3권](https://shogakukan-comic.jp/book?isbn=9784098502851)
- [小学館 공식 1권 미리보기](https://e-comi.shogakukan.co.jp/books/098501800000d0000000)
- [작품 공식 휴재 공지](https://x.com/FRIEREN_PR/status/1978113818501734694)

관찰:

- 용사 사후의 새로운 여행, 장소 이동과 과거 여정의 흔적 추적이 반복되어 `adventure`, `exploration`, `worldBuilding`이 높다.
- 프리렌의 후회와 인간 이해, 옛 파티와 새 파티의 유대가 핵심 보상이므로 `characterArcWeight`, `emotionalWarmth`가 높다.
- 정서적 호흡은 느리지만 시간 점프·장소·파티·위협 상태가 자주 바뀌므로 `pacing=3`으로 판정했다.
- 공식 미리보기의 첫 화 마차·숲·대화 페이지를 확인했다. 인체는 균형 잡힌 만화적 비례라 `artRealism=2`, 숲·마차·복식의 정보량이 중간이라 `artDensity=2`, 가는 윤곽과 부드러운 표정·채색 때문에 `visualSoftness=3`이다. 공개 범위에서 연속 action sequence를 확보하지 못해 G1의 `motionImpact`는 override에서 `unknown`으로 내렸고, 초반 공식 자료만으로 로맨스 서브플롯을 확정하기 어려워 `romance=unknown`이다.
- 2025-10-15 공식 휴재 공지 이후 2026-08-11 기준 공식 재개 근거를 찾지 못해 `status=hiatus`를 사용했다.

## チェンソーマン

근거 자료:

- [集英社 1권](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-881780-4)
- [集英社 2권](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-881831-3&mode=1)
- [集英社 3권](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-882016-3&mode=1)
- [少年ジャンプ＋ 공식 제1화](https://shonenjumpplus.com/episode/10834108156650024834)
- [少年ジャンプ＋ 최종 제232화](https://shonenjumpplus.com/episode/17107094915254021268)

관찰:

- 악마 사냥과 공안 임무, 배신·포위·폐쇄 공간의 생존 압력이 반복되므로 `combat`, `survival`, `workplace`가 중심 Theme다.
- 빈곤·배신·변신·공안 합류와 연속 전투가 빠르게 교체되어 `pacing`, `darkness`, `motionImpact`가 높다.
- 직접 전투와 피·지구력을 이용한 즉흥 해결이 섞여 `problemSolving=2`지만 장기 운영보다 현장 대응이 중심이므로 `strategy=1`이다.
- 공식 제1화의 빚·시골집·포치타 소개 페이지와 전투 지면을 확인했다. 기능적이지만 과장된 인체라 `artRealism=2`, 실내외 배경과 인물 중심 패널의 정보량이 중간이라 `artDensity=2`, 거친 신체 훼손 표현과 각진 선 때문에 `visualSoftness=0`, 큰 충돌·파편·속도선 때문에 `motionImpact=4`다. 극한 상황과 욕망의 불일치가 반복되어 `comedy=3`이다.
- 공식 제232화와 단행본 목록이 완결을 명시해 `status=completed`를 사용했다.

## ブルーロック

근거 자료:

- [講談社 1권](https://www.kodansha.co.jp/r/comic/product?item=0000314505)
- [講談社 2권](https://www.kodansha.co.jp/comic/products/0000318622)
- [講談社 3권](https://www.kodansha.co.jp/comic/products/0000319485)
- [マガポケ 공식 제1화](https://pocket.shonenmagazine.com/title/00617/episode/213491)
- [週刊少年マガジン 현행 호](https://pocket.shonenmagazine.com/magazine/smaga)

관찰:

- 탈락 시 대표 경력을 잃는 단계별 선발과 리그전이 핵심이므로 `survival`, `tournament`, `sportsCompetition`이 모두 중심성 2다.
- 랭킹·무기 발견·각성·다음 선발이 반복 보상이고 상대 공간·움직임 분석이 득점으로 연결되어 `progression`, `problemSolving`이 높다.
- 매 경기와 선발이 인생을 건 압박으로 제시되어 잔혹 세계관은 아니어도 `mentalStress=4`다.
- 마ガポケ 공식 제1화의 월드컵 관중·경기장·선수 페이지를 확인했다. 운동선수 인체는 현실 비례를 바탕으로 과장되어 `artRealism=3`, 관중·필드·공 궤적 정보가 조밀해 `artDensity=3`, 날카로운 눈과 각진 선 때문에 `visualSoftness=0`이다. 극단적 원근·공 궤적·속도 강조는 `motionImpact=4`를 지지한다.

## MONSTER

근거 자료:

- [小学館 완전판 1권](https://shogakukan-comic.jp/book?isbn=9784091817907)
- [小学館 완전판 2권](https://shogakukan-comic.jp/book?isbn=9784091818027)
- [小学館 공식 디지털 미리보기](https://e-comi.shogakukan.co.jp/books/091836510000d0000000)
- [ビッグコミックBROS 작품 이력](https://bigcomicbros.net/78774/)
- [楽天 원판 1권 서지](https://product.rakuten.co.jp/product/-/fc5576a3df130a454e71b3269aa4dd6b/)

관찰:

- 요한의 정체·살인·누명을 단서와 증언으로 추적하므로 `investigation`, `problemSolving`, `mysteryReveal`이 높다.
- 텐마·요한·니나·룽게와 여러 피해자가 교차하고 윤리 선택·책임·트라우마가 핵심이므로 `relationshipStructure`, `characterArcWeight`가 높다.
- 연쇄살인·아동학대·누명과 추격 압박이 지속되어 `darkness`, `mentalStress`가 모두 최고 수준이다.
- 공식 디지털 미리보기의 초반 병원 스프레드를 확인했다. 연령별 얼굴·신체·의료 공간이 자연스러워 `artRealism=4`, 복도·의복·표정과 다중 패널의 정보량이 중상이라 `artDensity=3`, 단단한 외곽선과 절제된 표정 때문에 `visualSoftness=1`이다. 공개 범위가 표정·구도·서스펜스 중심이고 연속 action sequence를 제공하지 않아 G1의 `motionImpact`는 override에서 `unknown`으로 내렸다.
- 대표권은 초반 범위의 원판 1권을 유지하고, 현행 완전판은 출판사 근거와 향후 표지 fallback으로만 기록했다.

## よつばと！

근거 자료:

- [KADOKAWA 1권](https://www.kadokawa.co.jp/product/312171800000/)
- [カドコミ 공식 제1화](https://comic-walker.com/detail/KC_003331_S/episodes/KC_0033310000100011_E?episodeType=first)
- [KADOKAWA 연재·16권 안내](https://group.kadokawa.co.jp/information/promotional_topics/article-11263.html)
- [電撃大王 공식 미디어 가이드](https://mediaguide.kadokawa.co.jp/archives/018/202506/%E9%9B%BB%E6%92%83%E5%A4%A7%E7%8E%8B%20%E3%83%A1%E3%83%87%E3%82%A3%E3%82%A2%E3%82%AC%E3%82%A4%E3%83%89_2025.pdf)

관찰:

- 이사·인사·동네·사물 같은 일상의 발견과 가족·이웃 공동체의 돌봄이 매 화 반복되어 `exploration`, `foundFamily`, `emotionalWarmth`가 높다.
- 공식 설명이 대략 하루 한 화의 느린 전개를 명시하고 별도 성장·전략·수수께끼 구조가 없어 해당 Narrative 축은 낮다.
- 요츠바의 오해와 주변인의 응수가 매 화 핵심이므로 `comedy=4`이며 어두움과 지속 압박은 관찰되지 않는다.
- 카도코미 공식 제1화의 이삿짐 차량·동네·가족 대화 스프레드를 확인했다. 성인과 공간은 현실 비례이고 요츠바는 강하게 단순화되어 `artRealism=3`, 차량·주택·가로수의 세부가 있으나 여백도 커 `artDensity=2`, 둥근 표정과 깨끗한 선 때문에 `visualSoftness=3`이다. 전투는 없지만 달리기·넘어짐·신체 개그의 동세가 반복되어 `motionImpact`는 `notApplicable`이 아니라 2다.
- 매체 독자의 성별 통계는 작품의 독자층 enum을 증명하지 않으므로 `demographic=unknown`을 유지했다.

## BLAME!

근거 자료:

- [講談社 원판 1권](https://www.kodansha.co.jp/comic/products/0000030097)
- [コミックDAYS 공식 LOG.1](https://comic-days.com/episode/13932016480029861973)
- [コミックDAYS 공식 FINAL-LOG](https://comic-days.com/episode/13932016480029941377)

관찰:

- 탐색자 霧亥가 초구조체를 방랑하며 네트 단말 유전자를 찾는 구조가 중심이므로 `adventure`, `exploration`, `worldBuilding`이 높다.
- 초반 중심은 독행 탐색자에게 고정되지만 シボ가 반복 동행자가 되므로 `relationshipStructure=1`이다. 완전한 단독 0보다 높고 처음부터 고정 파티가 작동하는 2보다 낮다.
- 성장·장기 계획·인물 변화보다 직접 탐색과 세계 규칙이 중심이어서 `progression`, `strategy`, `characterArcWeight`는 낮다.
- 가혹하고 어두운 환경이지만 주인공의 감정적 붕괴를 지속 소비시키지는 않으므로 `darkness=4`, `mentalStress=1`로 분리했다.
- コミックDAYS 공식 LOG.1의 시작 지면을 확인했다. 인물 신체는 기능적 비례를 유지하되 길게 스타일화되어 `artRealism=3`, 수직 구조물·배관·초구조체의 정보량이 매우 높아 `artDensity=4`, 거친 선과 강한 검정 면 때문에 `visualSoftness=0`이다. 이후 파괴 장면의 거대한 충격·잔해·대각 구도는 `motionImpact=4`를 지지한다.
