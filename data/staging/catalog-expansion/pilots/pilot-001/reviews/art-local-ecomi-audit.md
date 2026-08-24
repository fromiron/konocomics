# Pilot 001 — 小学館 eコミ Art qualification (Local Codex)

- 감사 범위: Pilot 001의 e-comi 공식 미리보기 18작품
- 실행일: 2026-08-23 (Asia/Tokyo)
- 계약: `docs/factors/factor-dictionary.md`의 `entry_1_3_volumes`, `docs/catalog-expansion/01-promotion-method.md`의 Art 6쪽/2맥락/판본 일치 규칙
- 실행 방식: 저장소에 이미 설치된 `@playwright/test`의 headless Chromium. 상품 페이지에서 같은 세션의 `試し読み` 링크를 클릭하고, 공식 BinB reader의 `currentPageInfo.pages`, `endPageNumber`, 표시 제목을 기록했다. `tips_pc_speed` iframe의 공식 close button을 실행한 뒤 해당 spread를 캡처했다.
- Local 픽셀 접근: 아래 12작품의 36개 원본 PNG를 `view_image(detail=original)`로 직접 확인했다. 검수 편의를 위한 montage는 이 PNG들로만 만들었고 판정 근거 파일은 아래 SHA-256 원본이다.
- 저장소 파일 수정: 없음. PNG는 `.gitignore`의 `/output/playwright/` 아래 임시 파일이며 커밋 대상이 아니다.

## 1. 18작품 판본 및 page-count gate

`reader pages`는 reader가 표시한 `1/N`, `endPageNumber=N`이다. 판본 gate가 실패한 작품은 내부 페이지 표본을 만들지 않았고 네 Art 축을 모두 `unknown`으로 종결한다. 많은 페이지가 있다는 사실은 판본 불일치를 치유하지 않는다.

| workId | 작품 | frozen 대표 ISBN / edition | 공식 e-comi 표시판 / JDCN | reader pages | 결과 |
|---|---|---|---|---:|---|
| `work-0262dcaa820443c3185d` | ゴルゴ13 | `9784845800018`, standard, リイド社 | `ゴルゴ13 1`, `091794010001d0000000` | 31 | disqualified — ISBN 본체 `84580001`과 JDCN `09179401`이 다르고 출판사도 달라 동일 판본·내용 연결을 입증하지 못함. Art 4축 `unknown`. |
| `work-9d5d64262dbc2893acd4` | ポーの一族 | `9784091300010`, standard v1 | `ポーの一族 1`, `091300010000d0000000` | 31 | qualified — ISBN 본체 `09130001`과 JDCN 일치, 표준 1권 표시. |
| `work-98d513b70560f2f96a38` | 漂流教室 | `9784091200013`, standard v1 | `漂流教室〔文庫版〕 1`, `091931710000d0000000` | 317 | disqualified — 문고판이며 ISBN/JDCN도 불일치. Art 4축 `unknown`. |
| `work-f50fa290eb4116a7078e` | 11人いる！ | `9784091788115`, volume blank, standard | `11人いる!` 단권, `091910110000d0000000` | 16 | disqualified — frozen 대표 합본 성격/ISBN과 JDCN 단권이 연결되지 않음. Art 4축 `unknown`. |
| `work-a089c0eef91d1213da38` | うる星やつら | `9784091204417`, standard v1 | `うる星やつら 〔新装版〕 1`, `091207160000d0000000` | 31 | disqualified — 신장판 표시 및 ISBN/JDCN 불일치. Art 4축 `unknown`. |
| `work-14e489bf1afd1587c44a` | YAWARA！ | `9784091813411`, standard v1 | `ＹＡＷＡＲＡ！ 完全版 デジタル Ver. 1`, `091813410000d0000000` | 28 | disqualified — JDCN 숫자는 같지만 공식 페이지가 2014–2015 완전판을 20권에서 29권으로 재편집한 디지털판이라고 명시한다. 표준판과 내용 범위 불일치. Art 4축 `unknown`. |
| `work-39555fe7402dada0d79f` | 名探偵コナン | `9784091233714`, standard v1 | `名探偵コナン 1`, `091233710000d0000000` | 31 | qualified |
| `work-4a8a22fc766bf9bc4c59` | 天は赤い河のほとり | `9784091365019`, standard v1 | `天は赤い河のほとり 1`, `091365010000d0000000` | 190 | qualified |
| `work-2f39795212f5ad8db155` | あずみ | `9784091835413`, standard v1 | `あずみ 1`, `091835410000d0000000` | 216 | qualified |
| `work-1cf7a0bb5f55e0d69b27` | モンキーターン | `9784091251619`, standard v1 | `モンキーターン 1`, `091251610000d0000000` | 31 | qualified |
| `work-303d0a9d67a606a817af` | ギャラリーフェイク | `9784091830210`, standard v1 | `ギャラリーフェイク 1`, `091830210000d0000000` | 28 | qualified |
| `work-c4abbc1b44fa5706bce3` | 風光る | `9784091373519`, standard v1 | `風光る 1`, `091373510000d0000000` | 31 | qualified |
| `work-76c038b398f4b28b7748` | 妖しのセレス | `9784091363541`, standard v1 | `妖しのセレス 1`, `091363540000d0000000` | 31 | qualified |
| `work-b4b21d2ebe5b8efc84ea` | Dr.コトー診療所 | `9784091525017`, standard v1 | `Dr.コトー診療所 公式版 1`, `091525010000d0000000` | 31 | disqualified — JDCN 숫자는 같지만 공식판 표시가 frozen standard와 충돌하며 내용 동등성을 확인하지 못함. Art 4축 `unknown`. |
| `work-205e576ef057e3aed1ab` | 坂道のアポロン | `9784091316707`, standard v1 | `坂道のアポロン 1`, `091316700000d0000000` | 38 | qualified |
| `work-a7a1e0666169f1b2e8c0` | 海街diary | `9784091670250`, standard v1 | `海街ｄｉａｒｙ １ 蝉時雨のやむ頃 1`, `091670250000d0000000` | 51 | qualified |
| `work-d7e64b0b5479ca943edd` | 深夜食堂 | `9784091817075`, standard v1 | `深夜食堂 1`, `091817070000d0000000` | 36 | qualified |
| `work-61f2b70ee9f8217b3604` | 銀の匙 Silver Spoon | `9784091231802`, standard v1 | `銀の匙 Silver Spoon 1`, `091231800000d0000000` | 196 | qualified |

공식 URL 형식:

- 상품: `https://e-comi.shogakukan.co.jp/books/<JDCN>`
- reader: `https://e-comi.shogakukan.co.jp/viewer/open?jdcn=<JDCN>`

12개 qualified 행은 `JDCN[0..8] == representative ISBN의 9784 뒤 8자리(체크섬 제외)`이고 표시 제목에 별도 판본 표기가 없다. `YAWARA！`와 `Dr.コトー診療所`는 숫자 일치만으로 판본을 승인하면 안 되는 반례다.

## 2. Qualified 표본과 Local Art 판정

모든 static 판정은 정확히 6쪽, 3 spread, 2개 이상의 장면 맥락을 사용한다. 값은 Factor Dictionary의 0/2/4 anchor 뒤 필요한 경우 1/3을 사용했다. `unknown`은 낮은 값이 아니다.

| workId | 표본 pages / 장면 맥락 | artRealism | artDensity | visualSoftness | motionImpact |
|---|---|---:|---:|---:|---|
| `work-9d5d64262dbc2893acd4` | 6–7 이별·마을/야외, 14–15 교실·기마 이동, 22–23 학교·정원 대화 | known 2 (.85) | known 2 (.85) | known 4 (.85) | unknown — 연속 동작의 시작·끝이 표본에 없음 |
| `work-39555fe7402dada0d79f` | 6–7 저택 대면, 14–15 주택가 대화, 22–23 차량 충돌·직후 | known 2 (.90) | known 3 (.90) | known 1 (.85) | known 4 (.90), exact sequence 22–23: 충돌 진입→충격→직후 반응 |
| `work-4a8a22fc766bf9bc4c59` | 6–7 학교 관계 장면, 14–15 복도·교실, 22–23 욕실의 물 이상 | known 2 (.85) | known 2 (.85) | known 3 (.85) | unknown — 정확한 연속 동작 sequence 없음 |
| `work-2f39795212f5ad8db155` | 6–7 수목·암벽 chapter opening, 14–15 야외 훈련, 22–23 산길 이동·대화 | known 3 (.90) | known 3 (.90) | known 2 (.85) | unknown — 훈련 장면은 있으나 확인 범위 안에 명확한 시작·끝 연속 동작이 없음 |
| `work-1cf7a0bb5f55e0d69b27` | 6–7 보트·미식축구 splash, 14–15 야구 투구, 22–23 자동차·오토바이 | known 3 (.90) | known 3 (.90) | known 1 (.85) | known 3 (.85), exact sequence 14–15: 투구 준비→투구/타석→포구·반응 |
| `work-303d0a9d67a606a817af` | 6–7 갤러리 거래, 14–15 전시장 감정, 22–23 복원 공방 | known 3 (.90) | known 3 (.90) | known 1 (.85) | unknown — 연속 동작 sequence 없음 |
| `work-c4abbc1b44fa5706bce3` | 6–7 도장·검술, 14–15 대련, 22–23 입문 대화·마당 | known 2 (.85) | known 2 (.85) | known 3 (.85) | known 3 (.85), exact sequence 14–15: 찌르기 교환→충돌/회피→동작 종료 반응 |
| `work-76c038b398f4b28b7748` | 6–7 도심·인물 소개, 14–15 난간 투척/낙하, 22–23 가정 대화 | known 2 (.85) | known 2 (.85) | known 4 (.90) | known 3 (.85), exact sequence 14–15: 투척·낙하→충격/파편→반응 |
| `work-205e576ef057e3aed1ab` | 6–7 학교 도착, 14–15 과거 회상·교실/복도, 22–23 복도 대치 | known 3 (.85) | known 2 (.85) | known 2 (.85) | unknown — 달리기 단편은 있으나 하나의 exact start/end sequence로 확정하기 부족함 |
| `work-a7a1e0666169f1b2e8c0` | 6–7 야외 chapter opening, 14–15 가족 식사, 22–23 역·열차 배웅 | known 3 (.90) | known 2 (.85) | known 3 (.90) | unknown — 열차 맥락은 있으나 연속 동작의 시작·끝을 판독할 sequence가 없음 |
| `work-d7e64b0b5479ca943edd` | 8–9 손님 도착·주문, 14–15 다른 손님·뉴스, 22–23 별도 식사 에피소드 | known 1 (.90) | known 1 (.85) | known 1 (.85) | unknown — 식당 대화 표본뿐이며 전체 entry의 동적 장면 부재까지 입증하지 않으므로 notApplicable로 만들지 않음 |
| `work-61f2b70ee9f8217b3604` | 6–7 설원 opening, 14–15 말과 조우, 22–23 교실 입장 | known 2 (.85) | known 2 (.85) | known 2 (.85) | known 3 (.85), exact sequence 14–15: 말의 돌진/뜀→급정지·조우→반응 |

합계: qualified 12, disqualified 6. Qualified static known 36축, motion known 5축, motion unknown 7축. Disqualified 6작품은 Art 24축 모두 `unknown`으로 명시 종결한다. 이 보고서는 Local evidence assistance이며 Gemini와의 최종 adjudication 또는 promotion 승인이 아니다.

## 3. 원본 PNG SHA-256

기준 경로: `/home/bell/Toys/konocomics/output/playwright/pilot-art/ecomi/`

| workId | viewer pages | SHA-256 |
|---|---|---|
| `work-9d5d64262dbc2893acd4` | `6-7` | `ff346d9ee8611bc073c6c8e71c82aa44fe21efc1cea22e8e834eb273c66ba1a1` |
| `work-9d5d64262dbc2893acd4` | `14-15` | `21dc84c8129aa99c3eb272ec02c901aca0de765d6a369e8f16b827089687ba20` |
| `work-9d5d64262dbc2893acd4` | `22-23` | `95c99285455d644c605c84f580b18d3b5065bdb023eeb1f02f79d87acfed851b` |
| `work-39555fe7402dada0d79f` | `6-7` | `d318e196d8aaa4cf809a6dda5c76bb3214c92a3ecdf23f10dd0b72719c4a46fc` |
| `work-39555fe7402dada0d79f` | `14-15` | `22a7fc0db64592af4b3c71ef094fe5780c1db31760bc572a4d01515414dd3aab` |
| `work-39555fe7402dada0d79f` | `22-23` | `ceaea0395597af9e986d65f000db368c8b5bbdcc9b6ef971d9e90840464238d2` |
| `work-4a8a22fc766bf9bc4c59` | `6-7` | `92ec61f24ea8e26ad72c205b3c81506354f4ba3df66188c6b7f4e31941f39b92` |
| `work-4a8a22fc766bf9bc4c59` | `14-15` | `508ef6da6fd901a1b538cb7fddee3620a5ea15660949d8bceb68e50c25e07f25` |
| `work-4a8a22fc766bf9bc4c59` | `22-23` | `8d71cb7c6d522dff482d30268ca6f09ad4a0d004c337881d7964615083c874bf` |
| `work-2f39795212f5ad8db155` | `6-7` | `dba5dd83c564ea2c785102608240718aa30f237670ce265cd03d3604baa5b5ee` |
| `work-2f39795212f5ad8db155` | `14-15` | `a33b66cf5f9d7a90d2cf98605efcbfea3b178a8d6183b30283a037f436c29ae6` |
| `work-2f39795212f5ad8db155` | `22-23` | `ba3ff12f8194a5a6e9d34976ccc6fed43ab6468d350abe72f86e8b189ebdc873` |
| `work-1cf7a0bb5f55e0d69b27` | `6-7` | `4b4850c92c1157b40d521beae7716acb43848cfb6d1b89541d2a5200d8986c60` |
| `work-1cf7a0bb5f55e0d69b27` | `14-15` | `d016e2abf800e8848ad1a205ac5b1f676c83600e86793f80bd5d45dbeeafaf64` |
| `work-1cf7a0bb5f55e0d69b27` | `22-23` | `381d1820ced13e53b1b2d94953bf704e5494a07986123ecd3e45735ffdf396c7` |
| `work-303d0a9d67a606a817af` | `6-7` | `adff6dc342d6f48fda89e9ad4b79ef634d14d5263171401b14b4954d3df151b1` |
| `work-303d0a9d67a606a817af` | `14-15` | `d05d6290b0ce0fa8e09cd6d83722ab3060fe8510c925225b05fc240779eef694` |
| `work-303d0a9d67a606a817af` | `22-23` | `037abf4ceced9b66605000e757704d0ff3e72b551ddfa24ebda50b374047b689` |
| `work-c4abbc1b44fa5706bce3` | `6-7` | `f1be15b62de5e87409f5b982aa53f9631650cdca01f6dc8d539ebeb036be66c0` |
| `work-c4abbc1b44fa5706bce3` | `14-15` | `24bf09c8b04e4d0b70fe2e75dc37811d18640390f55c6d1b2cebccaccba091c4` |
| `work-c4abbc1b44fa5706bce3` | `22-23` | `6bad91abaaff7960e75a98bd3337516b7d963d8f6cf449ca06fa1739d9f41626` |
| `work-76c038b398f4b28b7748` | `6-7` | `f445edd8e4f88635186ec69a92f0d3f8c7febf4975c34f5c616e0c36e9a73c7f` |
| `work-76c038b398f4b28b7748` | `14-15` | `39bcf317a8f65432c8d2b0b7db492341cef84236416afb214620612192ae408e` |
| `work-76c038b398f4b28b7748` | `22-23` | `1047fa88018d3fff465bef56fb1f459ec904246c450799077c329677253060b1` |
| `work-205e576ef057e3aed1ab` | `6-7` | `7d77bc0a1e4d20073ffa5858fbab5b85965503f9a935cbf45c83237a5cf2c5c0` |
| `work-205e576ef057e3aed1ab` | `14-15` | `ad6cec5462c56efa820eb88045be21e65d7f78a17fc4f8ee12f0a64584c4672e` |
| `work-205e576ef057e3aed1ab` | `22-23` | `cd64b6dd2e0e3d4110b62ccfcd8a095fa8038c10e8dba0c55f11908e2d2157a3` |
| `work-a7a1e0666169f1b2e8c0` | `6-7` | `d306bc968b8be3e0d6534eb0b5c58ca9579cf1e1c1a9a9f45172b3385f905932` |
| `work-a7a1e0666169f1b2e8c0` | `14-15` | `bd13b8b128e63f6c39fa435427c92041883141eeab68198e819e6d8daf83ecaf` |
| `work-a7a1e0666169f1b2e8c0` | `22-23` | `3a8a825310fc2d5fba544225a7ebcd6eb5e52f776a501d0702b14b5e0b9f63d4` |
| `work-d7e64b0b5479ca943edd` | `8-9` | `78dce3a20373af51aca3f01f705a2a4c89a4a2624b921713fedc1cdaf073e037` |
| `work-d7e64b0b5479ca943edd` | `14-15` | `30e01478eb534a3376be2003f2ce03ec14d367552ac2e78bb570569f0c8a9c13` |
| `work-d7e64b0b5479ca943edd` | `22-23` | `0decb162ad38b0d6a2a0cd44c7a6725c2f72e338a7bd3ff55f652e87548ecefb` |
| `work-61f2b70ee9f8217b3604` | `6-7` | `197f52cd6d2a2d96ed2660e4c866f7713da04ae172a93c1ccd6445198c46c476` |
| `work-61f2b70ee9f8217b3604` | `14-15` | `11df310b75d8fb72c78104db11b443c618c2687c522070d172a210d1796dfc66` |
| `work-61f2b70ee9f8217b3604` | `22-23` | `a2b87fc55abb8c280bb3c037b9d16c3d4d6a1f06911a8eb44c305a5a965ccc42` |

## 4. Reproduction notes

1. 상품 URL을 먼저 연다. reader URL 직접 진입은 세션/권한 오류가 날 수 있다.
2. 같은 page에서 해당 JDCN의 첫 `試し読み` 링크를 클릭한다.
3. `window.__sreaderFunc__.initialized === true`를 기다린다.
4. `tips_pc_speed` iframe의 `button.close-button`을 실행한다.
5. RTL reader에서 `ArrowLeft`로 진행하고 `currentPageInfo.pages`가 목표 pair인지 확인한 뒤 1280×900 PNG를 캡처한다.
6. 출력 PNG의 SHA-256을 위 표와 대조한다. 네트워크 초기화 timeout은 동일 상품 세션을 새 page로 다시 열어 재시도하되, 조용히 다른 URL·판본으로 대체하지 않는다.
