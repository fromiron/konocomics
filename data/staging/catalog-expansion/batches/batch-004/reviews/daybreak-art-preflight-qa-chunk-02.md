# Batch 004 Art preflight QA — chunk 02

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent QA
- reviewedByHuman: `false`
- scope: frozen positions 11–20
- overallVerdict: `PASS`
- work-level results: `PASS 10`, `REJECT 0`, `NEEDS_REVIEW 0`
- Art values assigned: none

## 검증 경계

- `frozen-work-set.csv`의 positions 11–20과 preflight 10행은 순서·`workId`·canonical title이 정확히 일치한다. canonical title에 `『`·`』`는 없다.
- preflight는 정확히 17열·10행이며 모든 행이 `sample-ready`, `readableInternalPageCount=6`, `staticGateAttemptable=true`, `motionGateAttemptable=false`다. Art 값·confidence·user Art opinion은 포함하지 않는다.
- 입력 SHA-256은 preflight `249d177ae697a41231e15801e86097e3d011a6689027a2bc4f1e80d67968feae`, ledger `4509e34e78eb35596d2aa5b66babbe4ca55dcd02945afe89efc4978c1d6f4ae7`다.
- CSV와 ledger의 선택 SHA-256 집합은 각각 60개·고유 60개로 정확히 같다. `/tmp/konocomics-batch004-art-chunk02`의 대응 원본 파일에서 다시 계산한 60개도 `60/60` 일치했다.
- 60개 선택 픽셀을 `original` detail로 각각 열었다. 선택 근거는 모두 판독 가능한 정적 PNG/JPEG의 내부 서사 본문이다. 표지·frontispiece·목차·광고·애니메이션은 없다. viewer spread에 chapter-title 면이 함께 보이는 경우 그 면은 세지 않고 반대편의 패널 본문 면만 1페이지로 계산했으며, 그래도 각 작품은 본문 6페이지 이상이다.
- 공식 상품·권·작가·ISBN/JDCN과 reader 연결을 live first-party route에서 재확인했다. 小学館 e-comi, 講談社 product trial, 集英社 S-MANGA reader, HERO'S Web, COMICリュウ, 秋田書店→チャンピオンクロス의 선택 픽셀은 각 동결 작품과 정확한 초반 권/episode 범위에 결속된다.
- 모든 작품에 최소 2개의 실제로 다른 장면 맥락이 있다. 9작품은 3맥락, `新しい上司はど天然`은 수정된 값대로 workplace와 outdoor/neighborhood의 2맥락이다.
- 선택 표본에는 고립된 물리 행동은 있으나, 동일한 연속 사건의 시작·전개/impact·해결 종점을 exact refs로 고정한 작품은 없다. 따라서 10행 모두 `motionGateAttemptable=false`가 정확하며 motion 값은 열지 않는다.

## 작품별 판정

| Pos | Work | 판정 | 근거 |
| --: | --- | --- | --- |
| 11 | `work-23077ad33a2066bef5a6` — Sunny | **PASS** | 小学館 vol.1 ISBN `9784091885579`과 e-comi JDCN `091885570000d0000000`이 제목·松本大洋·권을 결속한다. 수정된 `reader-step-10`의 chapter-title 반쪽은 제외하고 반대편 패널 본문만 세었으며, refs 10/14/16/18/20/22에서 본문 6쪽과 car/wilderness·school/classroom·child-group interior의 3맥락이 확인된다. |
| 12 | `work-2356050c72240569e1c5` — すみれファンファーレ | **PASS** | 小学館 vol.1 ISBN `9784091885791`과 JDCN `091885790000d0000000`이 정확히 결속된다. step-09의 title 반쪽은 제외하고 본문 면만 세어도 refs 09/13/17/21/25/29에서 본문 6쪽 이상이며 school·home/interior·street/park의 3맥락이다. |
| 13 | `work-2c4fe00df5255fc082f9` — ヒーローカンパニー | **PASS** | HERO'S Web 공식 `第1目標`이 같은 series·島本和彦과 공식 vol.1 unit item을 연결하며 frozen ISBN `9784864683043` 범위와 일치한다. refs 11/15/19/23/27/31은 모두 본문이고 city/street·hall·office/action의 3맥락이다. |
| 14 | `work-2d385ad0525742330e70` — ねずみの初恋 | **PASS** | 講談社 product `0000385374`가 vol.1 ISBN `9784065344231`과 `/trial` reader를 직접 결속한다. 기존 opening 대신 선택된 official `P0008`은 crane-game 장면의 패널 본문이고, P0008/11/15/19/23/27 전체가 본문 6쪽·3맥락·동일 판본 해시다. |
| 15 | `work-2df743e085adef5e9bd3` — キルアオ | **PASS** | 集英社 exact ISBN `9784088836867` 상품이 `キルアオ 1`·藤巻忠俊과 official reader를 직접 결속한다. 기존 opening 대신 선택된 official `P0007`은 왼쪽의 총격 서사 패널 면만 세었고 오른쪽 작품-title 면은 제외했다. P0007/11/15/19/23/27에서 본문 6쪽 이상과 3맥락이 남는다. |
| 16 | `work-2f1d1c3ad0f943f1562f` — 尾守つみきと奇日常。 | **PASS** | 小学館 vol.1 ISBN `9784098531820`, official trial, e-comi JDCN `098531820000d0000000`이 제목·森下みゆ·권을 결속한다. refs 09/13/17/21/25/29에서 title 반쪽을 제외해도 본문 6쪽 이상이며 school/classroom·home/interior·friend interaction의 3맥락이다. |
| 17 | `work-3713ab561de583d709bc` — アリスと蔵六 | **PASS** | COMICリュウ official Chapter.1이 제목·今井哲也를 표시하고 공식 vol.1 ISBN `9784199503375`에 연결된다. pages 05/15/25/35/45/55는 모두 판독 가능한 본문이고 city/street·store/car·police/restaurant 등 3맥락 이상이다. |
| 18 | `work-39c1a2b6791238827ed5` — とろける鉄工所 | **PASS** | 講談社 product `0000038640`이 제목·野村宗弘·vol.1 ISBN `9784063522471`과 `/trial`을 결속한다. refs 07/11/15/19/23/27은 모두 본문이며 welding floor·worker safety·meal/family/office의 3맥락이다. |
| 19 | `work-3ad85a2ffdc026007d61` — 新しい上司はど天然 | **PASS** | 秋田書店 vol.1 ISBN `9784253142311`의 official trial이 チャンピオンクロス의 동일 series·いちかわ暖 `第1話`로 이어진다. viewer pages 01–06은 정적 내부 본문 6쪽이며, 수정된 `distinctContextCount=2`와 limitation은 실제 workplace 및 outdoor/neighborhood 맥락에 정확히 맞는다. |
| 20 | `work-44d0000353478596369e` — 環と周 | **PASS** | 集英社 exact ISBN `9784088448398` 상품이 제목·よしながふみ·단권과 official reader를 직접 결속한다. refs 10/12/14/18/22/26에서 title 면을 제외해도 본문 6쪽 이상이며 apartment/family·workplace·restaurant/group의 3맥락이다. |

## 종합 판정

`PASS`: 기존 반려 셀 네 곳이 모두 닫혔다. Sunny의 frontispiece는 패널 본문 ref로, `ねずみの初恋`과 `キルアオ`의 opening은 각각 official P0008/P0007의 본문 면으로 교체되었고, `新しい上司はど天然`의 맥락 수와 limitation은 실제 2맥락에 맞게 수정됐다. 10작품 모두 exact binding, 정적 본문 6페이지 이상, 서로 다른 장면 2개 이상, 60/60 해시 일치, non-body 배제, motion 미개방 조건을 충족한다. 이 QA는 Art Factor 값을 부여하지 않으며 `reviewedByHuman=false`를 유지한다.
