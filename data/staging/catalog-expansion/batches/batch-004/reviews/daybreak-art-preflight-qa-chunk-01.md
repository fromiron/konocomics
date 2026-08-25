# Batch 004 Art preflight 독립 재-QA — chunk 01

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent re-QA
- reviewedByHuman: `false`
- scope: frozen positions `1–10`
- overallVerdict: `PASS`
- work-level: `PASS 10 / REJECT 0 / NEEDS_REVIEW 0`
- Art values assigned: `none`

## 재검증 결과

- `frozen-work-set.csv` positions 1–10과 preflight 10행의 `workId`·작품명·순서가 정확히 일치한다.
- frozen input SHA-256은 `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`이다.
- preflight CSV SHA-256은 `51862c41c9f15af4a2780aeed27db95c976b8e01c705efef9019425ec84f7a81`이며 ledger 선언값과 일치한다.
- ledger SHA-256은 `c32d3903fc677000576a4c743aa1f0707d7727eea5ebb45a8275bd80459d4a0a`이다.
- 헤더 포함 모든 CSV 행이 17열이고 `『』` 문자가 없으며 Art 값·confidence 값 열도 없다.
- retained SHA-256 40개는 모두 고유하다. `/tmp/konocomics-batch004-art-chunk01`의 40개 대응 파일을 다시 해시해 전부 일치함을 확인했다.
- retained 40개 이미지를 모두 원본 해상도로 열어 실제 픽셀을 재검했다. 구성은 sample-ready 4작품의 판정 표본 24장과 unknown-ready 3작품의 진단 표본 16장이다. 나머지 unknown-ready 3작품은 retained 이미지가 없다.
- 공식 출판사 상품·공식 리더 또는 출판사가 직접 연결한 정식 유통 리더를 live 재확인했다. 작품명·저자·1권·ISBN/JDCN/CID 연결은 모두 frozen 대표 판본과 일치한다. position 10은 ISBN이 일치하는 licensed retailer identity이며 공식 Tokuma route가 없다는 한계를 유지한다.
- sample-ready 4작품은 각각 읽을 수 있는 genuine body page 6장 이상과 실제로 구분되는 장면·맥락 2개 이상을 충족한다. 표지·속표지·chapter/title splash·목차·광고·애니메이션 이미지는 retained 표본에 없다.
- unknown-ready 6작품은 공식 경로 없음, 작품별 preview 없음, 1장면만 확보, 또는 genuine body page 5장뿐이라는 유한 실패를 정확히 기록했다. Art `unknown`은 promotion blocker가 아니다.
- 모든 행의 `motionGateAttemptable=false`가 정확하다. retained 표본 어디에도 하나의 연속 동작에 대한 start·development·impact·resolved endpoint가 모두 보존돼 있지 않다.

## 작품별 판정

| Pos. | workId | 작품 | preflight | pages / contexts | QA | 근거 |
|---:|---|---|---|---:|---|---|
| 1 | `work-025c8ab93483a39c9330` | ホストと社畜 | sample-ready | 6 / 4 | **PASS** | 双葉社 공식 리더가 작품·저자를 직접 식별하고 공식 상품으로 연결된다. 본문 6장은 식당, 직장·주거, 통근 열차, 전화 상호작용 등 2개 이상의 장면을 포함하며 제외 대상이 없다. |
| 2 | `work-098b1781e14365eea667` | うるわしの宵の月 | sample-ready | 6 / 3 | **PASS** | 講談社 공식 1권·저자·ISBN `9784065217771`과 linked reader가 일치한다. 학교 군중/친구 대화, 계단 조우, 교실 대화 등 서로 다른 장면이 확인되고 6장 모두 본문이다. |
| 3 | `work-0f3a44f5dcab9623d1be` | 応天の門 | unknown-ready | 0 / 0 | **PASS** | 新潮社 공식 1권·저자·ISBN `9784107717429`는 확인되지만 matched product에 작품별 internal trial이 없고 generic `/tryme/`는 registry 정책상 제외된다. 유한 실패와 nonblocker unknown 종결이 정직하다. |
| 4 | `work-11d23966f22f777e95d0` | のらみみ | sample-ready | 6 / 5 | **PASS** | 小学館 공식 vol.1 JDCN 상품과 리더의 제목·저자·권차가 일치하고 frozen ISBN 연결 한계도 명시돼 있다. 점포, 가정, 사무실 상담·회의, 야외 등 여러 장면의 본문 6장을 확인했다. |
| 5 | `work-132ce7172750a3b1fa53` | ヒナまつり | sample-ready | 6 / 2 | **PASS** | KADOKAWA 공식 1권·저자·ISBN `9784047273818`이 직접 연결한 BOOK☆WALKER CID `8335aa19-e942-4d8c-85b0-1f111f3766f8`과 일치한다. 이전 chapter-title page `reader-step-06`은 제거됐고, retained 6장은 car/arrival 장면과 apartment/living-room 장면의 genuine body page다. |
| 6 | `work-15dba4fdb46308ab45d7` | 駅から5分 | unknown-ready | 6 / 1 | **PASS** | 集英社 공식 JDCN `08865439865439315501` 리더가 제목·저자·1권과 frozen 원판을 연결한다. 6장은 읽을 수 있는 본문이지만 모두 같은 야외 분수 장면임을 숨기지 않고 static gate를 닫아 nonblocker unknown으로 종결했다. |
| 7 | `work-188ba092c6195603bb3f` | つらつらわらじ | unknown-ready | 5 / 2 | **PASS** | 講談社 공식 1권·저자·ISBN `9784063729443`과 reader가 일치한다. chapter-title/opening page `reader-step-07`을 제거한 뒤 genuine body page가 5장만 남는다는 한계를 정확히 기록해 unknown-ready로 닫았다. |
| 8 | `work-19c2017b33c07f48634e` | ふうらい姉妹 | unknown-ready | 5 / 3 | **PASS** | KADOKAWA 공식 1권·저자·ISBN `9784047268685`가 직접 연결한 BOOK☆WALKER CID `d42edacc-159a-432c-aa2b-41457c5a9221`과 일치한다. opening page `reader-step-05`를 제거해 남은 5장만 retained했고 표본 부족을 unknown-ready로 정확히 종결했다. |
| 9 | `work-1a6ad6771865b43c8516` | それでも町は廻っている | unknown-ready | 0 / 0 | **PASS** | 少年画報社 공식 1권·저자·ISBN `9784785926045`는 일치하지만 작품별 internal preview route가 없다. 표지·소개문을 Art 근거로 쓰지 않고 nonblocker unknown으로 닫았다. |
| 10 | `work-1cdc6c5cca7c33fafe51` | 青空にとおく酒浸り | unknown-ready | 0 / 0 | **PASS** | 楽天의 title·저자·徳間書店·1권·ISBN `9784199501746` identity는 일치한다. route registry에 Tokuma 공식 preview 경로가 없으므로 identity-only 한계를 명시하고 nonblocker unknown으로 닫았다. |

## 전체 판정

**PASS.** frozen binding, CSV·ledger·input 해시, 40개 retained 원본 픽셀, sample-ready 정적 표본 gate, unknown-ready 유한 실패, 제외 페이지 처리, motion gate를 모두 재검했다. corrected chunk 01의 10작품은 현재 Art preflight 계약을 충족하며, Art 값은 배정하지 않았다.
