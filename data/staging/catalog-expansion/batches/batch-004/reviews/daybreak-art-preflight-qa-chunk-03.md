# Batch 004 Art preflight QA — chunk 03

- reviewDate: `2026-08-25`
- reviewer: Daybreak independent QA
- reviewedByHuman: `false`
- scope: frozen positions 21–30
- overallVerdict: `PASS`
- work-level results: `PASS 10`, `REJECT 0`, `NEEDS_REVIEW 0`
- Art values assigned in this QA: none

## 검증 결과

- frozen positions 21–30과 preflight 10행의 `workId` title 순서가 정확히 일치하며 금지된 `『`·`』`는 없다.
- strict CSV parse에서 header와 10개 data row가 모두 정확히 17열이다.
- 현행 preflight SHA-256 `cfea3c57b84331d9255dabf652aef7c2b9ef48031d2db31e64b5aaca569a7eee`가 ledger 선언과 일치한다.
- CSV와 ledger의 선택 해시는 동일한 고유 58개이며 `/tmp/konocomics-batch004-art-chunk03` 실제 파일에서 `58/58` 재계산 일치했다.
- 공식 작품·작가·권/collection·ISBN/JDCN과 reader의 exact edition/volume bridge 10건이 frozen 작품과 일치한다.
- 선택 픽셀을 원본 상세로 확인했다. 표지 frontispiece standalone title/chapter-opening splash 목차 광고 애니메이션 synopsis user opinion은 genuine body page에 포함되지 않는다.
- 23·24·25·26·28·29·30번은 판독 가능한 genuine body page 6개 이상과 서로 다른 장면 2개 이상을 충족해 `sample-ready`다. 26번 4맥락과 28번 5맥락의 count/limitation도 선택 픽셀과 정확히 일치한다.
- 21번은 6쪽이 한 railway sequence뿐이고 22·27번은 제외 페이지 제거 뒤 genuine body page가 5쪽뿐이다. 세 행의 static `false`, `unknown-ready`는 정직한 유한 실패다.
- 어느 행도 정확한 start-development-impact-resolved 연속 시퀀스를 제공하지 않으므로 전 행 motion `false`가 정확하다.

## 작품별 판정

| Pos | Work | 판정 | Static / state |
| --: | --- | --- | --- |
| 21 | アンデッドアンラック | **PASS** | `false` / `unknown-ready` |
| 22 | 俺物語！！ | **PASS** | `false` / `unknown-ready` |
| 23 | お茶にごす。 | **PASS** | `true` / `sample-ready` |
| 24 | 黒月のイェルクナハト | **PASS** | `true` / `sample-ready` |
| 25 | ルックバック | **PASS** | `true` / `sample-ready` |
| 26 | 夢中さ、きみに。 | **PASS** | `true` / `sample-ready` |
| 27 | 異世界おじさん | **PASS** | `false` / `unknown-ready` |
| 28 | 思い、思われ、ふり、ふられ | **PASS** | `true` / `sample-ready` |
| 29 | 式の前日 | **PASS** | `true` / `sample-ready` |
| 30 | さんすくみ | **PASS** | `true` / `sample-ready` |

## 종합 판정

`PASS`: 10개 작품 모두 exact edition binding hash serialization page exclusion static finite-failure 및 motion 경계를 충족한다. 이 QA는 Art Factor 값을 부여하지 않으며 `reviewedByHuman=false`를 유지한다.
