# Batch 005 text recovery round 6 — chunk 02 independent QA

## 범위와 결론

- reviewer: Daybreak independent QA/adjudicator
- reviewDate: `2026-08-25`
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- frozen scope: position `12`, `entry_1_3_volumes`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- round-6 recovery input SHA-256: `c73e9f122598c4d563bfbed7e13bbf99664a6ad29184639cb408edfdd99fcd8d`
- prior terminal text SHA-256: `1a7b2ea648a3bc2989f2b32fb87465f624cd7f06581395bb30ad9366f19c4bf8`

AGENTS.md, Factor Dictionary, 현재 terminal, chunk-02의 기존 연구·독립 QA·blocker
adjudication과 round-6 연구를 읽은 뒤 제안 결론을 상속하지 않고 공식 서지와
정식 유통 reader를 다시 열었다. 판정은 `comedy=2, confidence=0.60`을
`ACCEPT`한다. 사용자 리뷰는 사용하지 않았다.

## 재현한 근거

BookLive 판본은 제목, 작가, 권 번호와 출판사가 일치하며, 아래 일진사 초판
서지와 연결했다. `【イラスト特典付】` 추가 일러스트는 평가 범위에서 제외하고
겹치는 본문만 확인했다. reader sequence는 정식 유통 reader의 표시 번호이며,
printed page는 본문에 인쇄된 쪽수다. 임시 화면은 커밋하지 않았다.

| 권 | 출처 | publishedAt | 다시 확인한 범위 | 직접 관찰과 경계 |
| ---: | --- | --- | --- | --- |
| 1 | [一迅社WEB 1巻](https://data.ichijinsha.co.jp/detail/75805394), [BookLive 1巻 reader](https://booklive.jp/bviewer/s/?cid=176973_001&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F176973%2Fvol_no%2F001) | `2009-02-25` | reader `8/21`, `10/21` | 교실에서 동급생들이 미나미의 전생 노트를 수수께끼 노트처럼 놀리고 과장된 반응을 보이는 독립적인 가벼운 장면을 확인했다. 이어지는 장면은 전생 기억과 학교 고립을 진지하게 다루므로 개그 중심 작품으로 확대하지 않는다. |
| 2 | [一迅社WEB 2巻](https://data.ichijinsha.co.jp/detail/75805477), [BookLive 2巻 reader](https://booklive.jp/bviewer/s/?cid=176973_002&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F176973%2Fvol_no%2F002) | `2010-01-25` | printed pp. `7–9` | 클래스회·카라오케 준비의 과장된 반응, 예약을 둘러싼 말장난, 노래와 음료를 둘러싼 엇갈림이 여러 beat로 이어진다. 권 1의 노트 놀림과 다른 상황이므로 한 번의 고립된 gag만은 아니다. |
| 3 | [一迅社WEB 3巻](https://data.ichijinsha.co.jp/detail/75805543), [BookLive 3巻 reader](https://booklive.jp/bviewer/s/?cid=176973_003&rurl=https%3A%2F%2Fbooklive.jp%2Fproduct%2Findex%2Ftitle_id%2F176973%2Fvol_no%2F003) | `2010-09-25` | reader `8/15`, `10/15` | 인물·전생 관계 요약과 교실 대립이 중심이며 반복 개그는 확인되지 않았다. 이 반례 때문에 상시·핵심 개그인 값 4는 배제한다. |

출판사 권 소개도 각각 학교 고립, 동급생들의 기억 회복과 베로니카 주장,
현재 생활과 전생 지향의 충돌을 중심으로 한다. 따라서 comedy는 미스터리와
긴장 사이에 나타나는 간헐적 상황 코미디로만 판정한다.

## 셀 판정

| Pos | Work | Proposed cell | QA | Dictionary 대응 |
| --: | --- | --- | --- | --- |
| 12 | ボクラノキセキ | `comedy=2,0.60` | `ACCEPT` | 권 1 교실 놀림과 권 2 클래스회·카라오케는 서로 다른 진입 맥락에서 가벼운 comedy beat를 반복한다. 이는 `중간중간 개그`인 값 2에는 맞지만, 권 3과 공식 권 소개의 진지한 미스터리·갈등 비중 때문에 `개그가 상시 또는 핵심`인 값 4는 아니다. |

기존 `progression`, `problemSolving`, `strategy`, `romance`,
`emotionalWarmth`를 재개방하지 않았다. 특히 Narrative는 round-6 연구대로
`3/6`이며 이번 판정으로 증가하지 않는다.

## 반영과 무결성

| File | Old SHA-256 | New SHA-256 | Change |
| --- | --- | --- | --- |
| `adjudication/text-final-chunk-02.csv` | `1a7b2ea648a3bc2989f2b32fb87465f624cd7f06581395bb30ad9366f19c4bf8` | `fb132a8ab74fe0a73f10e18fd44a1644229f01fb363ca53f0cdf15435d4b9f0e` | exactly one existing row changed from `comedy,unknown` to `comedy,known,2,0.60`; evidence ID and row order retained |
| `adjudication/genres-final-chunk-02.csv` | `793bc52f85519ec1a6768bebb50d88ce129548eb13a6f9b5d2128517730764de` | same | byte-identical |
| `adjudication/themes-final-chunk-02.csv` | `b833210238186abd46c6ff638ebbcd63fd39e681b1ad604952eb2e1c3f30e4dc` | same | byte-identical |
| `art-review/chunk-02/final-art.csv` | `a579386129fe3754c15d083d1f1ad6e262bab3039eacb8c6814da26a71b0caff` | same | byte-identical |

Terminal text는 header 외 `170` data rows, `10` works, 작품당 `17` axes,
`6` columns, `170` unique `(workId, axisId)` keys와 기존 순서를 보존한다.

## Gate recount

| Scope | Genre | Theme | Narrative | Tone | Art | All non-Art text gates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| position 12 | `1/1` | `1/1` | `3/6` | `5/7` | `0/4` | fail (`Narrative +1`) |
| chunk 02 positions 11–20 | `10/10` | `10/10` | `1/10` works pass | `5/10` works pass | `0/10` works pass | `0/10` works pass |

- source, generated catalog, Pass A, provenance, promotion, registry, overlay,
  eligibility, safety, identity, Art, formula, Dictionary와 Gold data는 변경하지 않았다.
- `git diff --check`와 terminal row/schema/order 검사가 통과했다.
- 이 판정은 model-panel QA이며 human validation이 아니다.
