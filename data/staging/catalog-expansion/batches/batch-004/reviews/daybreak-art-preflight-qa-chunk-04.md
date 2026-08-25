# Batch 004 Art preflight QA — chunk 04

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent QA
- reviewedByHuman: `false`
- scope: frozen positions 31–40
- overallVerdict: `PASS`
- Art values assigned: none

## 검증 경계

- `frozen-work-set.csv`의 31–40번과 preflight 10행의 `workId`·canonical title·순서가 정확히 일치한다.
- canonical title에 금지된 장식 구분자 `『`·`』`는 없다.
- preflight는 헤더 포함 전 행이 17열이며, Art 값은 포함하지 않는다.
- `/tmp/konocomics-batch004-art-chunk04`의 선택 파일 SHA-256은 기록과 `9/9` 일치했다.
- 선택 픽셀을 원본 해상도로 확인했다. 31번의 6개 선택물은 모두 판독 가능한 본문 페이지이며, 표지·목차·광고·애니메이션·중복 뷰어 셸이 아니다. bakery/household, outdoor market/flower stall, city-history/wall tableau는 최소 2개를 넘는 실제 구별 장면이다.
- 35·37·40번은 각각 고유한 판독 가능 본문 1페이지만 확인된다. 나머지 관찰물은 표지·타이틀·목차·빈 페이지 또는 같은 본문을 반복한 뷰어 출력이므로 `unknown-ready`가 맞다.
- 요청된 `docs/catalog-expansion/02-annotation-guidelines.md`는 현재 워크트리에 존재하지 않았다. 판정에는 명시된 작업 계약과 현존하는 `01-promotion-method.md`, `01a-promotion-method-operational-amendment.md`, `art-source-route-registry.csv`를 사용했다.

## 작품별 판정

| Pos | Work | 판정 | 근거 |
| --: | --- | --- | --- |
| 31 | `work-925f371723beac5227f7` — 邪神の弁当屋さん | **PASS** | 講談社 1권 `9784065378557`과 공식 작품 페이지가 연결한 ヤンマガWeb 第1話가 동일 작품·초반 범위에 결속된다. 선택한 본문 6쪽의 해시가 모두 일치하고 3개 구별 장면이 확인되어 `sample-ready`가 타당하다. |
| 32 | `work-961a49798df191311f42` — 働かないふたり | **PASS** | 新潮社 1권 상품은 제목·吉田覚·ISBN `9784107717443`을 결속한다. 상품별 내부 미리보기는 없고 generic trial catalog는 registry상 판본 bridge가 아니므로 0쪽 `unknown-ready` 한계가 재현 가능하다. |
| 33 | `work-9bd00739b995d84e2494` — あした死ぬには、 | **PASS** | 太田出版 1권 상품은 제목·雁須磨子·ISBN `9784778323011`을 결속한다. 상품이 YONDEMILL을 연결하지만 太田出版 검증 route가 registry에 없어 샘플을 사용하지 않은 0쪽 `unknown-ready`가 보수적으로 타당하다. |
| 34 | `work-a3d922576a1a1ecc8e3e` — ドカ食いダイスキ！ もちづきさん | **PASS** | 白泉社 1권 상품은 제목·まるよのかもめ·ISBN `9784592160311`을 결속한다. 白泉社 검증 route가 registry에 없어 연결 reader를 승격하지 않은 0쪽 `unknown-ready`가 재현 가능하다. |
| 35 | `work-aa85b65d02f367e76a07` — ディグイット | **PASS** | 講談社 상품 `0000413972`와 ISBN `9784065398043`의 공식 trial이다. 유효 본문은 1쪽·1장면뿐이고 해시가 일치하므로 6쪽/2장면 gate 미달 `unknown-ready`가 맞다. |
| 36 | `work-af3443bab1c30d470a76` — 坂本ですが? | **PASS** | KADOKAWA 상품 `201211000248`은 제목·佐野菜見·ISBN `9784047286337`과 상품 연결 BOOK☆WALKER route를 입증한다. CSV CID `efae4a8f-92f6-4093-8a11-61ce9bea897d`는 실제 302 viewer 대상과 일치한다. 제한 시간 내 본문이 열리지 않아 0쪽 `unknown-ready`로 닫은 한계도 재현 가능하다. |
| 37 | `work-bd5c323a3dbc9f3a04d4` — 来世は他人がいい | **PASS** | 講談社 1권 `9784065103760`과 공식 Comic DAYS 第1話가 제목·小西明日翔·entry episode를 결속한다. 판독 가능한 본문은 1쪽·1장면이고 해시가 일치하므로 `unknown-ready`가 맞다. |
| 38 | `work-c2df32661c0b925ff74f` — カラオケ行こ！ | **PASS** | KADOKAWA 상품 `322002001211`은 제목·和山やま·ISBN `9784047361515`과 상품 연결 BOOK☆WALKER route를 입증한다. CSV CID `542153af-b038-486c-9d6b-e58d0548ba2b`는 실제 302 viewer 대상과 일치한다. 제한 시간 내 본문이 열리지 않아 0쪽 `unknown-ready`로 닫은 한계도 재현 가능하다. |
| 39 | `work-c2f3864045578cebb590` — となりの猫と恋知らず | **PASS** | スクウェア・エニックス 1권 상품은 제목·あきのこ·ISBN `9784757591264`을 결속한다. registry가 요구하는 상품 연결 Gangan Online chapter가 없으므로 0쪽 `unknown-ready` 한계가 재현 가능하다. |
| 40 | `work-c5c2695ad33fd05af945` — カッコウの許嫁 | **PASS** | 講談社 상품 `0000341183`과 ISBN `9784065193808`의 공식 trial이다. 유효 본문은 1쪽·1장면뿐이고 해시가 일치하므로 6쪽/2장면 gate 미달 `unknown-ready`가 맞다. |

## 종합 판정

`PASS`: 31번의 `sample-ready`와 32–40번의 `unknown-ready` 분류가 모두 gate에 맞는다. 수정된 36·38번 `editionMapping` CID는 실제 product-linked BOOK☆WALKER 302 대상과 일치하고 ledger URL과도 일관된다. `unknown-ready`는 Art 부족 자체로 blocker가 아니며, 이 QA는 Art 값을 부여하지 않는다.
