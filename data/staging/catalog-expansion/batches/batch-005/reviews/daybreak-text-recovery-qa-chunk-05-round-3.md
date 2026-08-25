# Batch 005 independent text-recovery QA — chunk 05, round 3

- 검수일: 2026-08-25
- 범위: frozen positions 41–50, `entry_1_3_volumes`
- 입력 연구: `research/text-gap-recovery-chunk-05-round-3.md`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- reviewer: Daybreak independent QA; `reviewedByHuman=false`
- Art: 검수·수정하지 않음

## 독립 검수 기준

연구 결론을 상속하지 않고 두 제안의 원문을 다시 열었다. `comedy=2`는 1–3권
또는 첫 주요 arc 안에서 간헐적 개그가 반복돼야 하고, `emotionalWarmth=2`는 같은
범위에서 유대·배려와 가혹함이 혼합된 보상이 복수 독립 출처에 직접 나타나야 한다.
별점, 인기, 작품 전체 감상, 후반부 관찰, 같은 원문을 재배포한 리뷰는 독립 근거로
세지 않았다.

## Position 47 — デッドデッドデーモンズデデデデデストラクション

제안: `comedy=2`, confidence `0.72`.

다시 연 근거:

- [このマンガがすごい！WEB, 第1巻ガイド](https://konomanga.jp/guide/13188-2),
  2014-10-14, retrieved 2026-08-25. 1권을 명시하고, 붕괴된 일상과 여고생의
  대화 사이에 국민적 캐릭터 패러디와 진지함/개그가 섞인 톤이 놓인다고 관찰한다.
- [BookLive, volume 1 reviews](https://booklive.jp/review/list/title_id/291239/vol_no/001),
  user posts dated 2015-10-17 and 2018-02-18, retrieved 2026-08-25. 서로 다른
  독자가 각각 SF·불안 장면 사이의 개그 톤과 1권의 비일상/일상 간 슈르한 웃음을
  구체적으로 반복한다. 별점이나 `#笑える` 태그는 근거로 사용하지 않았다.
- [コメからジャガイモ, volume-1 review](https://ameblo.jp/ap-ro-pos/entry-12866496782.html),
  2024-09-09, retrieved 2026-08-25. 1권이 일상 대화 중심이라는 점은 확인하지만,
  작품을 진지한 SF로 읽고 개그의 반복을 직접 진술하지 않으므로 보조 근거로 세지
  않았다. 이는 `comedy=4`를 막는 제한이지 위 두 출처의 간헐적 개그 관찰과 충돌하지
  않는다.

판정: **ACCEPT WITH LOWER CONFIDENCE**. 전문 1권 비평과 별도 1권 독자평이
패러디·간헐적 개그를 독립적으로 반복한다. 다만 진지한 SF와 불안이 함께 중심이므로
Dictionary의 level 4가 아니라 `comedy=2`; terminal confidence는 `0.70`으로
보수적으로 낮췄다.

## Position 48 — 月に吠えらんねえ

제안: `emotionalWarmth=2`, confidence `0.64`.

다시 연 근거:

- [コミックシーモア customer reviews](https://www.cmoa.jp/title/customer_review/title_id/75960/),
  user post dated 2019-03-05, retrieved 2026-08-25. 리뷰어는 1–3권을 선호한다고
  구분하지만, 주변 인물의 걱정·동정이라는 관찰은 현재 7권까지 읽은 뒤 변화한
  주인공을 논하는 문맥이다. 따라서 해당 따뜻함 관찰을 1–3권에 귀속할 수 없다.
- [Sony Reader Store, volume-1 reviews](https://ebookstore.sony.jp/review/title/10108925/id/LT000018628000351916/),
  syndicated Booklog posts dated 2014-04-26 through 2014-07-08, retrieved
  2026-08-25. 1권의 광기·공포·우스움과 인물 군을 반복해서 관찰하지만, 상호 배려나
  따뜻한 관계 보상을 직접 반복하지 않는다.
- [honto, volume-1 reviews](https://honto.jp/ebook/pd-review_0626189711.html),
  Booklog posts including 2014-05-11, retrieved 2026-08-25. Sony와 같은 Booklog
  원문 풀을 재배포하므로 독립 리뷰 시스템으로 이중 계산할 수 없고, 이 페이지에서도
  따뜻함의 직접 관찰을 확인하지 못했다.
- [講談社, volume 1](https://www.kodansha.co.jp/comic/products/0000047330) 및
  [volume 3](https://www.kodansha.co.jp/comic/products/0000047407), published 2014,
  retrieved 2026-08-25. 공식 권 소개는 작품 identity와 문학적 세계·사건을
  확인하지만, 1–3권의 반복적 관계 온기를 확정하지 않는다.

판정: **REJECT**. 유일하게 걱정·동정을 구체적으로 언급한 독립 출처는 후반 7권
문맥을 섞고, 범위가 맞는 1권 리뷰들은 `emotionalWarmth`의 직접 anchor를 반복하지
않는다. `emotionalWarmth`는 terminal `unknown`으로 유지했다.

## Materialized delta

| Pos | Work ID | Axis | Before | After | Evidence binding |
| --: | --- | --- | --- | --- | --- |
| 47 | `work-f31a42ea4ad724acefa5` | `comedy` | `unknown` | `known,2,0.70` | 기존 `ev-batch-005-a-work-f31a42ea4ad724acefa5` 유지 |
| 48 | `work-f4bfc29a5e0a9b5148d0` | `emotionalWarmth` | `unknown` | `unknown` | 변경 없음 |

| File | Rows excluding header | Before SHA-256 | After SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-05.csv` | 170 | `9dfacbe4b451243f9de430af1f73537f4a5c79482f1c98d6a78d2d95ce9d8c30` | `f0fcd03f35074f991fc2778f6e76c0003f51ead66c62d19cd6fd1ec6ea88aa66` |
| `adjudication/genres-final-chunk-05.csv` | 10 | `320f9e0d323c29e6ae46682d2c900e0768e61e23d960cc8dff3c303c4594ee1b` | 동일 |
| `adjudication/themes-final-chunk-05.csv` | 16 | `4bffb927c1d14162a8fef8a392d8459f67bb2f47ccc893991bb3e5ec27d12afa` | 동일 |

Terminal text는 170행, 10작품, Dictionary Axis 순서를 유지하며 `known=66`,
`unknown=104`다. source, Genre, Theme, Art, promotion, generated catalog는 수정하지
않았다.

## Gate recompute

현재 terminal text와 별도 최종 Art 파일을 함께 읽어 계산했다. 최소치는 Genre
`1/1`, Theme `1/1`, Narrative `4/6`, Tone `5/7`, Art `2/4`다.

| Pos | Genre | Theme | Narrative | Tone | Art | Text gates | All gates |
| --: | --: | --: | --: | --: | --: | --: | --: |
| 41 | 1 | 1 | 2 | 4 | 3 | FAIL | FAIL |
| 42 | 1 | 1 | 1 | 3 | 0 | FAIL | FAIL |
| 43 | 1 | 1 | 2 | 5 | 0 | FAIL | FAIL |
| 44 | 1 | 0 | 1 | 3 | 0 | FAIL | FAIL |
| 45 | 1 | 1 | 3 | 5 | 0 | FAIL | FAIL |
| 46 | 0 | 1 | 4 | 4 | 3 | FAIL | FAIL |
| 47 | 1 | 1 | 3 | 6 | 3 | FAIL | FAIL |
| 48 | 1 | 1 | 3 | 4 | 0 | FAIL | FAIL |
| 49 | 1 | 1 | 1 | 5 | 0 | FAIL | FAIL |
| 50 | 1 | 1 | 2 | 5 | 3 | FAIL | FAIL |

Chunk totals: Genre `9/10`, Theme `9/10`, Narrative `1/10`, Tone `5/10`, Art
`4/10`, all non-Art text gates `0/10`, all promotion data gates `0/10`.
Position 47은 Tone coverage가 5에서 6으로 늘었지만 Narrative가 3/6이므로 승격
가능 상태가 되지 않았다. Position 48은 Narrative와 Tone 모두 미달이다.

## Boundary and validation

- rejected proposal은 `unknown`으로 명시적으로 종결했고 낮은 값으로 대체하지 않았다.
- Art, formula, Factor Dictionary, coverage, validator, Gold 150을 변경하지 않았다.
- canonical title에 장식용 `『』`를 추가하지 않았다.
- 이 판정은 모델 패널 검수이며 사람 검수가 아니다: `reviewedByHuman=false`.
- `git diff --check`와 CSV 행·known/unknown shape 검사를 실행한다.
