# Batch 003 Pass A annotation notes — chunk 01

## Binding and review boundary

- reviewer: Local Codex
- reviewedByHuman: `false`
- pass: `A — annotation draft`
- scope: `entry_1_3_volumes`
- immutable candidate SHA-256: `2277f22c0c0f4b04815801059a4faca0db316d9de5efe1027cb3221725c9c410`
- manifest SHA-256: `2425deaaa1672ba12f089d3a4633b2cef86bb610980fb41506c8f73e4fe5bdb3`
- PAYLOAD.sha256 SHA-256: `b9e33aafa0456e2cc863a1230de7173eb24ae268a8a50d08a3c9b37ccfac8bdf`
- frozen work set SHA-256: `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd`
- annotation request SHA-256: `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- annotation guide SHA-256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`
- research chunk SHA-256: `24504373ec03820b36f87e7b211b4be557d8991b555d831afcdf6dd9b60c5f45`
- evidence ID rule: `ev-batch-003-a-{workId}`
- isolation: 동결된 1~10번 연구 패킷의 내용 근거만 사용했다. 선정 목록 등재 사실은 Factor Evidence로 사용하지 않았다.
- non-decisions: 이 Pass는 catalog role, recommendation context, eligibility, promotion, safety, identity 결론을 내리지 않는다.

## Shared Art closure

연구 패킷에는 10개 작품 모두 공식 내부 미리보기 표본이 없다. 시도 범위는 각 작품의 1~3권이며, 판독 가능한 내부 페이지 수는 `0`, 서로 다른 장면 맥락 수는 `0`, 정확한 페이지 참조와 연속 동작 시작·끝 참조는 `none`, 공식 미리보기 URL과 대표판 일치 관계도 `not established`다. 따라서 `artRealism`, `artDensity`, `visualSoftness`, `motionImpact`를 모두 `unknown`으로 명시적으로 종결했다. 이는 낮은 값이나 blocker 판단이 아니다.

## Work reasoning

### work-0029e59a039dce3f6e74 — 【推しの子】

- official evidence: 集英社 1~3권 소개 — [1권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-891650-7), [2권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-891717-7), [3권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-891801-3); 보조 교차 확인 — [マンガ大賞 2021 심사 코멘트](https://www.mangataisho.com/data/2021/comment2021.pdf).
- reasoning: 의료인과 아이돌의 만남에서 환생·가족 상실·복수 목표로 급전환하고, 이어 학교·아이돌 준비·연애 리얼리티 제작 현장으로 상태와 활동 영역이 다시 바뀐다. 이 반복된 큰 전환과 복수의 심사 관찰이 `pacing=4`를 직접 지지한다. 두 주인공의 진로 진입은 `progression=2`, 연예계의 여러 직무와 현장 규칙은 `worldBuilding=2`, 상실 뒤 갈라진 목표와 관계는 `characterArcWeight=3`, 쌍둥이와 반복 조연은 `relationshipStructure=2`를 지지한다. 살인·복수가 중심 목표와 연결되지만 밝은 활동 전개도 병치되므로 `darkness=3`; 복수 심사 코멘트가 진지한 사건과 코믹 장면의 병치를 반복 관찰해 `comedy=2`로 두었다.
- Genre/Theme: 환생 전제와 복수·서스펜스 구조로 `fantasy;mystery`; 복수는 한 주인공의 핵심 목표라 `revenge=1`, 환생은 전체 전제라 `reincarnation=2`, 학교는 일부 활동 범위라 `school=1`, 연예계 활동은 두 주인공에게 반복되는 핵심 구조라 `workplace=2`다.
- unknown limitations: 공식 요약은 해결 과정·장기 계획·단서 공개 구조를 설명하지 않아 `problemSolving`, `strategy`, `mysteryReveal`은 unknown이다. 사건 존재만으로 지속 체감 압박을 확정하지 않았고, 리얼리티 쇼 참여만으로 연애 비중을 추론하지 않아 `mentalStress`, `romance`, `emotionalWarmth`도 unknown이다.

### work-048a39f42bd18cb0823e — 大東京トイボックス

- licensed evidence: 대표 ISBN과 연결된 원판 1~3권 정식 유통 소개 — [コミックシーモア](https://www.cmoa.jp/title/49274/). [マンガ大賞 2012 심사 코멘트](https://www.mangataisho.com/data/2012/mantai_comment2012.pdf)는 대다수 범위가 7권 전후라 값의 직접 근거로 사용하지 않았다.
- reasoning: 기획 견습 진입, 공동 개발과 예산·납기 조건, 새 프로젝트와 다른 팀 협업이 1~3권에 이어져 `progression=2`, 단기 자원·프로젝트 계획이 존재해 `strategy=2`, 권 단위 변화가 일반적이어서 `pacing=2`로 두었다. 게임 제작 규칙과 사업 조건이 반복 기능하므로 `worldBuilding=2`; 창작 이상과 사업 현실, 고정 제작팀 관계가 함께 움직여 `characterArcWeight=2`, `relationshipStructure=2`다.
- Genre/Theme: 직업 현장의 반복 일상을 근거로 `sliceOfLife`; 게임 제작은 `crafting=2`, 제작 조직은 `workplace=2`다.
- unknown limitations: 현재 원출판사 개별 소개가 없고 정식 유통 요약만 확보됐으므로 confidence를 제한했다. 구체적 해결 절차, 수수께끼 보상, 웃음 빈도, 어둠·압박·연애·온기의 지속성을 확인할 수 없어 나머지 text 축은 unknown이다. 전자 리마스터판은 추가 원고가 있는 별도 판본 lead이므로 이번 값 근거에 섞지 않았다.

### work-04f35b4c99514d50231d — デトロイト・メタル・シティ

- licensed evidence: 원판 ISBN과 연결된 정식 1~3권 소개 — [コミックシーモア](https://www.cmoa.jp/title/312348/); 초반 반복 관찰 보조 근거 — [マンガ大賞 2008 심사 코멘트](https://www.mangataisho.com/archives/2008/02/049.html).
- reasoning: 본래 인격과 무대 인격의 충돌이 1권에서 정립되고, 팬·기타·경쟁 밴드 갈등과 대형 축제로 확장되므로 `pacing=2`, 음악 업계의 공연·팬·경쟁 구조가 기능해 `worldBuilding=2`다. 이중 인격의 동기 충돌이 핵심 보상이라 `characterArcWeight=3`, 밴드·팬·경쟁자가 반복돼 `relationshipStructure=2`다. 복수의 심사위원이 초반의 과장된 음악 패러디, 반복 곤경, 저속 농담을 독립적으로 관찰했고 이중 인격 자체가 반복 개그 구조이므로 `comedy=4`를 제안했다. 곤경과 공적 인격 충돌은 지속되지만 심리 붕괴 중심은 아니어서 `mentalStress=2`다.
- Genre/Theme: 반복 구조가 희극 중심이라 `comedy`; 3권의 음악 축제 경쟁은 일부 구간이라 `tournament=1`, 전문 음악 활동은 보조 직업 구조라 `workplace=1`이다.
- unknown limitations: 원출판사 내용 소개가 없고 현 유통판의 권리·판본 계보가 미확정이어서 해당 known 값은 독립 검수 대상이다. 성장 보상, 해결·전략, 수수께끼, 어둠, 연애, 온기의 지속성은 확보된 요약으로 확정할 수 없어 unknown이다.

### work-064c0062e7a8e29cfbed — COSMOS

- official evidence: 小学館 1~3권 소개 — [1권](https://e-comi.shogakukan.co.jp/books/091577840000d0000000), [2권](https://e-comi.shogakukan.co.jp/books/091577980000d0000000), [3권](https://e-comi.shogakukan.co.jp/books/091578230000d0000000).
- reasoning: 실종 조사에서 보험회사 입사·연수, 선배와의 사건 대응, 정식 조사원 활동으로 단계가 분명히 누적돼 `progression=3`이다. 외계인 유괴·보험금 절도와 숨은 사정을 조사하는 사건이 반복돼 `problemSolving=3`, `mysteryReveal=3`; 목표와 직업 상태가 권마다 바뀌어 `pacing=3`이다. 외계 존재와 전용 보험 업무 규칙이 사건마다 기능해 `worldBuilding=3`, 사건과 신입 조사원의 변화가 균형을 이뤄 `characterArcWeight=2`, 선배·동료가 반복돼 `relationshipStructure=2`다. 유괴와 범죄라는 진지한 위험이 존재하지만 암울함 자체가 핵심이라고 입증되지는 않아 `darkness=2`다.
- Genre/Theme: 외계 존재와 사건 조사를 근거로 `scienceFiction;mystery`; 사건 조사는 `investigation=2`, 보험회사 업무는 `workplace=2`다.
- unknown limitations: 장기 자원 운영, 코미디 빈도, 지속 심리 압박, 연애, 온기를 직접 보여 주는 반복 근거가 없어 `strategy`, `comedy`, `mentalStress`, `romance`, `emotionalWarmth`은 unknown이다.

### work-07faf4019b12de5e877d — 私の少年

- official evidence: 双葉社 원판 1~3권 소개 — [1권](https://www.futabasha.co.jp/book/97845758481060000000?type=1), [2권](https://www.futabasha.co.jp/book/97845758489530000000?type=1), [3권](https://www.futabasha.co.jp/book/97845758500170000000?type=1).
- reasoning: 양쪽의 고립에서 시작한 관계가 특별한 시간, 가정 문제, 거리 두기, 감정 인식과 가족 대면으로 3권 연속 변화해 `pacing=2`다. 인물의 고립·동기·관계 경계가 사건의 핵심 보상이므로 `characterArcWeight=4`, 중심 두 인물과 가족 관계가 반복돼 `relationshipStructure=2`다. 고립과 가족 문제라는 진지한 갈등은 `darkness=2`, 관계 경계와 거리 두기의 반복 압박은 `mentalStress=3`을 지지한다. 서로를 필요로 하고 함께하는 시간을 지키려는 보상과 갈등이 혼합돼 `emotionalWarmth=2`다.
- Genre/Theme: 확보된 초반 소개는 관계 중심 일상을 직접 지지하므로 `sliceOfLife`; 현재 22개 Theme 중 직접 대응하고 지속성이 확인된 항목은 없어 Theme set을 비웠다.
- unknown limitations: 공식 소개 자체가 성인과 아동 관계의 정확한 성격을 양가적으로 남기므로 `romance`를 값이나 Genre로 확정하지 않았다. 성장 보상, 해결·전략, 수수께끼, 배경 규칙, 코미디의 지속 근거도 없어 해당 축은 unknown이다. safety와 관계 윤리는 이 Pass의 결론이 아니다.

### work-131ba7a362fa9e38a10a — 超巡！超条先輩

- official evidence: 集英社 1~3권 소개 — [1권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884108-3), [2권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884172-4), [3권](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-884255-4).
- reasoning: 초능력 수사관의 파출소 배치, 단서 추적과 지역 축제, 어린이·지역 인물·평판 경쟁으로 권마다 사건이 바뀌어 `pacing=2`다. 초능력 경찰과 지역 공동체라는 기능적 설정이 반복돼 `worldBuilding=2`; 사건과 반복 관계가 균형을 이루므로 `characterArcWeight=2`, 고정 경찰 동료와 지역 인물이 이어져 `relationshipStructure=2`다. 능력과 문제 행동의 대비가 경찰 코미디로 제시되고 각 권에서 지역 소동이 반복돼 `comedy=3`이다.
- Genre/Theme: 경찰 사건과 희극 구조를 근거로 `mystery;comedy`; 단서 추적과 사건 대응은 `investigation=2`, 파출소 업무는 `workplace=2`다.
- unknown limitations: 소개는 능력 사용이나 단서 해결 과정을 생략해 `problemSolving`, `strategy`, `mysteryReveal`을 확정하지 않았다. 성장, 어둠, 심리 압박, 연애, 온기의 지속적 강도도 알 수 없어 unknown이다.

### work-171b262b7ad72871f795 — ドリフターズ

- official evidence: 少年画報社 1~3권 소개 — [1권](https://www.shonengahosha.co.jp/book_Info.php?id=6358), [2권](https://www.shonengahosha.co.jp/book_Info.php?id=6837), [3권](https://www.shonengahosha.co.jp/book_Info.php?id=7119); 초반 전개 보조 근거 — [マンガ大賞 2012 심사 코멘트](https://www.mangataisho.com/data/2012/mantai_comment2012.pdf).
- reasoning: 세키가하라 퇴각전에서 이세계 전쟁으로 이동하고 역사 인물 집결과 영토 확보 행동까지 빠르게 전환되며, 복수 심사위원도 초반의 빠른 추진을 반복 관찰해 `pacing=4`다. 세력 전쟁과 영토 행동이 장기·군사 계획을 요구해 `strategy=3`; 역사 인물, 이세계 종족과 세력이 사건마다 기능해 `worldBuilding=3`이다. 단독 이동에서 역사 인물 팀과 여러 세력 충돌로 넓어져 `relationshipStructure=3`, 긴장 속 농담의 반복 관찰은 `comedy=2`, 전쟁과 중상·충돌이 핵심이라 `darkness=3`이다.
- Genre/Theme: 전쟁 행동과 이세계의 역사 인물을 근거로 `action;fantasy;historical`; 이세계 이동과 전쟁 진행은 `adventure=2`, `combat=2`, `war=2`, 3권에서 시작한 영토 확보는 아직 일부 범위라 `territoryManagement=1`이다.
- unknown limitations: 성장 보상과 구체적 문제 해결, 수수께끼 공개, 인물 변화의 상대 비중, 지속 심리 압박, 연애, 온기는 짧은 공식 소개로 판정할 수 없어 unknown이다. 심사평의 작화 체감은 픽셀 근거가 아니므로 Art에 사용하지 않았다.

### work-174e7603bb0e71bb62ab — からかい上手の高木さん

- official evidence: 小学館 1~3권 소개 — [1권](https://e-comi.shogakukan.co.jp/books/091250150000d0000000), [2권](https://e-comi.shogakukan.co.jp/books/091255270000d0000000), [3권](https://e-comi.shogakukan.co.jp/books/091266500000d0000000).
- reasoning: 세 권 모두 같은 두 학생의 놀림·되갚기·당황이라는 저위험 반복 구조를 직접 확인한다. 숙련 보상이 거의 없고 목표·상황 변화도 작아 `progression=0`, `pacing=0`; 되갚기 시도에 작은 고안은 있으나 분석 중심은 아니어서 `problemSolving=1`이다. 배경 규칙이 최소라 `worldBuilding=0`, 관계와 감정이 핵심이라 `characterArcWeight=3`, 중심 두 인물 구조라 `relationshipStructure=2`다. 반복 놀림과 역전이 희극 보상이라 `comedy=3`, 진지한 위험·비극이 거의 없어 `darkness=0`, 당황은 반복되지만 지속 압박은 아니어서 `mentalStress=1`이다. 3권까지 연애적 긴장이 명시돼 `romance=3`, 장난 속 유대가 갈등과 섞여 `emotionalWarmth=2`다.
- Genre/Theme: 반복 장난·학교 일상·관계 감정을 근거로 `comedy;sliceOfLife;romance`; 학교가 반복 무대라 `school=2`다.
- unknown limitations: 장기 계획이나 단서·진실 공개 구조를 보여 주는 근거가 없어 `strategy`, `mysteryReveal`은 unknown이다. 0 값은 미확인 항목을 낮게 채운 것이 아니라 공식 1~3권에서 같은 최소 변화·저위험 구조가 반복 확인된 축에만 사용했다.

### work-197089286d30de82f9e9 — 多聞くん今どっち!?

- official evidence: 白泉社 1~3권 소개 — [1권](https://www.hakusensha.co.jp/comicslist/62381/), [2권](https://www.hakusensha.co.jp/comicslist/63106/), [3권](https://www.hakusensha.co.jp/comicslist/64511/).
- reasoning: 팬이 아이돌의 가사도우미가 된 뒤 그룹 센터 경쟁과 다음 활동으로 진행돼 `progression=2`, `pacing=2`다. 무대·사적 인격, 그룹 활동과 경쟁 규칙이 반복 기능해 `worldBuilding=2`; 낮은 자존감, 팬의 지원, 경쟁과 감정 반응이 전개의 핵심 보상이라 `characterArcWeight=4`, 중심 두 인물과 고정 그룹 멤버는 `relationshipStructure=2`다. 낮은 자존감과 경쟁·질투 반응은 지속되지만 붕괴 중심은 아니어서 `mentalStress=2`, 팬·가사도우미 관계와 상호 감정은 `romance=3`, 반복 지원은 `emotionalWarmth=3`이다.
- Genre/Theme: 초반 관계 감정을 근거로 `romance`; 다섯 종목의 센터 경쟁은 일부 Arc라 `tournament=1`, 가사도우미와 아이돌 그룹 활동이 반복돼 `workplace=2`다.
- unknown limitations: 구체적 해결·계획·단서 공개, 코미디 빈도, 어둠의 지속성을 공식 요약이 설명하지 않아 `problemSolving`, `strategy`, `mysteryReveal`, `comedy`, `darkness`는 unknown이다. 제목의 ASCII 문장부호는 canonical 표기를 유지했다.

### work-1d447cc9026b530fb53d — だがしかし

- official evidence: 小学館 1~3권 소개 — [1권](https://e-comi.shogakukan.co.jp/books/091251250000d0000000), [2권](https://e-comi.shogakukan.co.jp/books/091253990000d0000000), [3권](https://e-comi.shogakukan.co.jp/books/091262100000d0000000).
- reasoning: 세 권 모두 특정 과자에 관한 질문·도전·지식 설명과 같은 여름의 만남을 반복한다. 성장 보상은 거의 없어 `progression=0`, 작은 질문 해결은 있으나 분석 서사 중심은 아니어서 `problemSolving=1`, 큰 상태 변화가 드물고 축제에서만 관계 변화가 있어 `pacing=1`이다. 과자 지식과 가게 배경은 기능하지만 복잡한 규칙은 아니어서 `worldBuilding=1`, 사건 중심 속 관계 변화는 제한적이라 `characterArcWeight=1`, 중심 두 인물에서 サヤ까지 반복돼 `relationshipStructure=2`다. 과자 대결과 반응이 반복 희극 구조라 `comedy=3`; 1~3권의 저위험 여름 일상에는 진지한 비극과 지속 압박이 거의 없어 `darkness=0`, `mentalStress=0`이다. 3권의 관계 변화만 확인돼 `romance=1`, 반복 교류는 혼합된 온기를 보여 `emotionalWarmth=2`다.
- Genre/Theme: 과자 중심 희극과 여름 일상을 근거로 `comedy;sliceOfLife`; 현재 Theme 사전에는 먹기·과자 지식 자체에 대응하는 태그가 없고 조리 반복도 확인되지 않아 Theme set을 비웠다.
- unknown limitations: 장기 전략과 수수께끼 공개 구조는 확인되지 않아 `strategy`, `mysteryReveal`은 unknown이다. 0 값은 공식 1~3권의 반복된 저위험 구조가 직접 지지하는 축에만 사용했다.

## Pass A handoff

- known text 축은 frozen source가 직접 확인한 1~3권 반복 구조만 반영했다. 소개가 사건 존재만 밝히고 빈도·강도를 숨긴 경우 unknown으로 남겼다.
- 모든 Art 축은 표본 기준 미달로 종결됐다. 후속 Pass가 Art 값을 만들려면 공식 내부 페이지 6쪽·2맥락·판본 매핑과, `motionImpact`의 경우 연속 동작 시작·끝 참조를 새로 확보해야 한다.
- 사용자 리뷰 패킷은 이 chunk에 없으므로 사용하지 않았다.
- extreme 제안은 `pacing=4` 두 작품, `comedy=4` 한 작품, `characterArcWeight=4` 두 작품, 그리고 1~3권의 반복 구조가 직접 뒷받침한 일부 0 값에 한정했다. Pass B는 특히 이 값을 독립 검수해야 한다.
