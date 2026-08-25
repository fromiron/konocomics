# Batch 005 text gap recovery round 6 — chunk 02 targeted near-gate

- 조사일 및 조회일: `2026-08-25`
- `retrievedAt`: `2026-08-25`
- 대상: positions `12`, `16`, `17` in `batch-005/frozen-work-set.csv`
- 평가 범위: `entry_1_3_volumes`
- `reviewedByHuman=false`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- terminal text SHA-256 before this round: `1a7b2ea648a3bc2989f2b32fb87465f624cd7f06581395bb30ad9366f19c4bf8`

## 처리 경계

rounds 2–5의 연구·독립 QA·adjudication과 현재 terminal을 먼저 대조했다. 이미
`ACCEPT`, `REJECT`, `UNKNOWN` 또는 finite-exhaustion으로 종결된 셀은 다시
제안하지 않았다. 따라서 position 12의 `progression`과 기존 Tone 제안,
position 16의 `problemSolving`/`worldBuilding`, position 17의 이전 Narrative
소진 판단은 재개방하지 않는다. 아래의 유일한 새 제안은 position 12의
`comedy`이며, terminal CSV에는 반영하지 않았다.

Reader 페이지는 임시 로컬 이미지로만 확인했으며 이미지 파일을 저장소에
추가하지 않았다. 제목·장르·직업명·단일 사건을 Axis로 자동 변환하지 않았고,
Art는 이 라운드의 대상이 아니다.

## 새로 확인한 정식 권 1–3 경로

### Position 12 — ボクラノキセキ (`work-1550d4a52c3fe6d9f94c`)

| 권 | 출처 | publishedAt | exact reader 범위 | 직접 관찰 |
| ---: | --- | --- | --- | --- |
| 1 | [一迅社WEB 1巻](https://data.ichijinsha.co.jp/detail/75805394), [BookLive 1巻 reader](https://booklive.jp/bviewer/s/?cid=176973_001&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F176973%2Fvol_no%2F001) | `2009-02-25` | BookLive licensed reader, opening sample | 학교에서 전생 기억과 정체성에 대해 대화하는 장면. 역사·기억 설명과 인물 간 반응은 보이지만, 제약 분석이나 전술 계획은 보이지 않는다. |
| 2 | [一迅社WEB 2巻](https://data.ichijinsha.co.jp/detail/75805477), [BookLive 2巻 reader](https://booklive.jp/bviewer/s/?cid=176973_002&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F176973%2Fvol_no%2F002) | `2010-01-25` | printed pp. `7–8` | 같은 학급 장면에서 `みんなでカラオケ`, `クラス会`, 건배와 과장된 표정·반응이 연속된다. 한 장면 안의 가벼운 농담/웃음으로, 작품 전체가 개그 중심이라는 뜻은 아니다. |
| 3 | [一迅社WEB 3巻](https://data.ichijinsha.co.jp/detail/75805543), [BookLive 3巻 reader](https://booklive.jp/bviewer/s/?cid=176973_003&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F176973%2Fvol_no%2F003) | `2010-09-25` | printed pp. `5–8` | 대학·학교에서 기억 보유자와 주변 인물이 대화하고, 인물 소개·과거 설명이 이어진다. p. 6의 인물 간 지시와 반응도 분석 절차나 장기 계획으로 확장되지 않는다. |

`publishedAt`은 출판사 서지 페이지의 초판 단행본 날짜이며, reader route의 조회일은
모두 `2026-08-25`이다. BookLive reader는 정식 유통 미리보기로 사용했으며,
selection provenance와 Factor Evidence를 혼동하지 않았다.

### Position 16 — 銀のスプーン (`work-1b3afe12c434a9cf7603`)

| 권 | 출처 | publishedAt | exact reader 범위 | 직접 관찰 |
| ---: | --- | --- | --- | --- |
| 1 | [講談社 1巻](https://www.kodansha.co.jp/comic/products/0000044784), [official reader](https://www.kodansha.co.jp/comic/products/0000044784/trial/reader?cid=e065c6210d9cf7f6d3ef7b0bdda4d31a08f964295ff1825cea62607cc2516231) | `2011-02-10` | opening reader route | 요리·가족 일상의 entry 장면은 확인했지만, 반복되는 자원 계획이나 전술 선택은 확인하지 못했다. |
| 2 | [講談社 2巻](https://www.kodansha.co.jp/comic/products/0000044817), [official reader](https://www.kodansha.co.jp/comic/products/0000044817/trial/reader?cid=c8ed6ec79b61ee258f2561e70b9b58d6f9e5374d2c974fc6415767e065aa9ff0) | `2011-06-13` | printed pp. `4–8` | 병원·가족 대화와 어머니의 치료 경과가 중심이다. 어려운 메뉴에 도전했다는 권 소개와 달리, 이 exact page range에는 조리 제약을 분석하고 해결하는 절차나 tactical plan이 없다. |
| 3 | [講談社 3巻](https://www.kodansha.co.jp/comic/products/0000044883), [official reader](https://www.kodansha.co.jp/comic/products/0000044883/trial/reader?cid=c4b3a721fec5b6f1090356e09a04939d25cf9f55fcf558f68f64f7fbfc674af3) | `2011-12-13` | printed pp. `5–8` | 대학 일정표, 동아리·진로 대화, 시험·진학 제약이 보인다. 선택과 대화는 단기 전술을 반복하는 전략 루프가 아니며, strategy anchor를 직접 충족하지 않는다. |

### Position 17 — おかめ日和 (`work-1b7c4ed54d7761cd242b`)

| 권 | 출처 | publishedAt | exact reader 범위 | 직접 관찰 |
| ---: | --- | --- | --- | --- |
| 1 | [講談社 1巻](https://www.kodansha.co.jp/comic/products/0000043658), [official reader](https://www.kodansha.co.jp/comic/products/0000043658/trial/reader?cid=94de8b54d798ecc4677e7e76c51712dedff77397cff8c49d36603c57817e4857) | `2007-04-13` | printed pp. `4–15` | 식사·등교·가족의 일상 에피소드와 반복적인 부부·자녀 대화가 보인다. 새 능력 습득·성장 보상·장기 상태 변화는 직접 확인되지 않았다. |
| 2 | [講談社 2巻](https://www.kodansha.co.jp/comic/products/0000043712), [official reader](https://www.kodansha.co.jp/comic/products/0000043712/trial/reader?cid=3b28a6283329d648e4c63e7bb1968b9618484e049d2284246607883edf4e4489) | `2007-11-13` | printed pp. `1`, `5–8` | 가족·치료원 관련 대화와 일상 장면. 기존에 승인된 운영비 계산/구매 sequence 밖에서는 clue→truth reveal이나 새 규칙·faction 체계가 드러나지 않는다. |
| 3 | [講談社 3巻](https://www.kodansha.co.jp/comic/products/0000044241), [official reader](https://www.kodansha.co.jp/comic/products/0000044241/trial/reader?cid=42bb2191fb6247450b1d3329ba43ff16ea427ce98a7f60dcf36bcf9657a46bbe) | `2008-04-11` | printed pp. `4–8` | 아이 돌봄, 자전거 이동, 집안 대화가 이어진다. 반복되는 생활 곤란을 별도의 progression 보상·mystery reveal·world-system으로 확대할 직접 근거는 없다. |

## 새 제안

| Pos | Work | Axis | Proposed value | Confidence | Evidence ID | Dictionary anchor 및 범위 |
| ---: | --- | --- | ---: | ---: | --- | --- |
| 12 | ボクラノキセキ | `comedy` | 2 | 0.60 | `ev-batch-005-r6-work-1550d4a52c3fe6d9f94c-comedy` | 권 2 printed pp. 7–8에서 학급의 카라오케·클래스회 대화, 건배, 과장된 반응이 한 장면에 반복된다. 이는 intermittent/mixed comedy를 지지하지만, 미스터리·긴장 장면과 공존하며 4 수준의 지속적 개그 중심은 아니다. 단일 reader scene만으로 작품 전체의 빈도를 확정하지 않도록 낮은 confidence를 부여한다. |

이 제안은 기존 `relationshipStructure`, `mysteryReveal`, `darkness`,
`mentalStress`를 재평가하지 않는다. `comedy`는 현재 terminal에서 `unknown`이며,
rounds 2–5에 같은 셀의 accepted/rejected proposal이 없음을 재확인했다.

## Exact exhaustion — 새 값 없음

### Position 12 — Narrative

`progression`은 round 3에서 memory acquisition과 `mysteryReveal` 중복으로
거부되었으므로 재제안하지 않았다. 권 1–3 reader의 위 범위에서 확인된 것은
기억·인물 설명, 학급 대화, 관계 반응이다. 이는 이미 known인 reveal/world/arc
축과 겹치며, `problemSolving`의 constraint analysis 또는 `strategy`의 반복
단기 계획을 직접 보여주지 않는다. 따라서 이 라운드의 exact route 범위에서
두 셀은 `unknown` 유지이며 새 Narrative 제안이 없다.

### Position 16 — Narrative

남은 `strategy`만 조사했다. 권 2 pp. 4–8의 병원·가족 장면과 권 3 pp. 5–8의
진학·동아리 선택은 목표·대화·개인 선택을 보여줄 뿐, 작품의 지속적인
전술/단기 계획 구조를 보여주지 않는다. `problemSolving`과
`worldBuilding`은 이전 QA에서 거부·미충족으로 종결되어 재개방하지 않았다.
따라서 `strategy`는 이 exact 1–3권 조사 범위에서 새 값 없음으로 유지한다.

### Position 17 — Narrative

이전 rounds에서 `progression`, `mysteryReveal`, `worldBuilding`에 대한
직접 anchor가 finite-exhaustion으로 판단되었고, 이번 권 1–3 reader에서도
그 결론을 뒤집을 관찰이 없었다. 일상 에피소드의 반복은 progression이 아니며,
부부 갈등·의심스러운 사건은 기존 QA가 mystery/darkness로 승격하지 않은
경계다. 치료원·가족 배경은 accepted Theme/Axis와 중복되고
history/culture/rules/factions 중심의 worldBuilding이 아니다. 세 셀 모두
`unknown`을 유지한다.

## Gate recount (terminal 변경 전과 동일)

연구 제안은 adjudication 전이고 terminal CSV를 변경하지 않았으므로 아래 수치는
round 5 후 상태와 동일하다.

| Pos | Canonical title | Narrative | Tone | Genre | Theme | Art | Remaining text gap |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 12 | ボクラノキセキ | 3/6 | 4/7 | pass | pass | 0/4 | N+1, T+1 (new comedy proposal pending) |
| 16 | 銀のスプーン | 3/6 | 5/7 | pass | pass | 0/4 | N+1 |
| 17 | おかめ日和 | 3/6 | 5/7 | pass | pass | 0/4 | N+1 |

## 경계와 무결성

- `data/staging/catalog-expansion/batches/batch-005/adjudication/text-final-chunk-02.csv`를 변경하지 않았다.
- Genre, Theme, Art, Pass A, source/provenance, overlay, registry, generated catalog, safety, identity, recommendation formula, Dictionary, Gold data를 변경하지 않았다.
- reader 임시 캡처는 `/tmp`에서만 사용했고 커밋하지 않는다.
- 이 문서는 모델 연구 기록이며 human validation이 아니다. `reviewedByHuman=false`를 유지한다.
