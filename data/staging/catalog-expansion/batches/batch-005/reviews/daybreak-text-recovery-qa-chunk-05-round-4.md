# Batch 005 independent text-recovery QA — chunk 05, round 4

- 검수일: 2026-08-25
- 범위: frozen positions 41–50, `entry_1_3_volumes`
- 입력 연구: `research/text-gap-recovery-chunk-05-round-4.md`
- reviewer: Daybreak independent QA; `reviewedByHuman=false`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- research packet SHA-256: `0061c5cb137cf70caee7556bbac919ef7aca402f58afd08b1968b61b8f932d15`
- Art: 검수·수정하지 않음

## 독립 검수 기준

Luna의 결론을 상속하지 않고 position 47의 공식 1권·2권 페이지를 다시 열었다.
`romance=2`는 1–3권 안에서 연애가 부차적 관계·사건으로 반복될 때만 허용하고,
한 번의 모티프나 장르 추정은 값으로 바꾸지 않았다. 두 페이지의 제목, 작가,
ISBN, 발매일, 권수를 대조해 같은 canonical 작품의 일반판 연속 권인지도 확인했다.

## Position 47 — デッドデッドデーモンズデデデデデストラクション

제안: `romance=2`, confidence `0.72`.

다시 연 공식 근거:

- [小学館コミック, volume 1](https://shogakukan-comic.jp/book?isbn=9784091865007),
  published 2014-09-30, retrieved 2026-08-25. 페이지는 작품명 1권, 작가
  浅野いにお, ISBN `9784091865007`을 직접 표시하며 frozen representative
  volume과 일치한다. 출판사 편집 문구는 학교 일상 모티프 가운데 첫사랑을
  명시한다.
- [小学館コミック, volume 2](https://shogakukan-comic.jp/book?isbn=9784091868572),
  published 2015-02-27, retrieved 2026-08-25. 페이지는 같은 작품명 2권, 같은
  작가, ISBN `9784091868572`을 직접 표시한다. 출판사 편집 문구는 시모키타자와의
  데이트를 침략자 병기 소재와 병치한다.

두 URL은 小学館의 일반 단행본 1·2권이며 특장판·한정판·합본 표기가 없다. 첫사랑과
데이트가 서로 다른 두 entry 권에서 반복되므로 단일 사건이 아니라 부차적 연애
소재의 지속을 확인할 수 있다. 반면 외계 침략, 학교 일상, 두 소녀의 우정과 병기
소재가 함께 중심이므로 `romance=4`의 중심축 근거는 없다.

판정: **ACCEPT**. Dictionary의 level 2 `서브 플롯`에 맞춰 terminal을
`known,2,0.72`로 변경했다. 새 Evidence ID를 만들지 않고 기존 작품 Evidence
binding을 유지했다.

## Materialized delta

| Pos | Work ID | Axis | Before | After | Evidence binding |
| --: | --- | --- | --- | --- | --- |
| 47 | `work-f31a42ea4ad724acefa5` | `romance` | `unknown` | `known,2,0.72` | 기존 `ev-batch-005-a-work-f31a42ea4ad724acefa5` 유지 |

| File | Rows excluding header | Before SHA-256 | After SHA-256 |
| --- | ---: | --- | --- |
| `adjudication/text-final-chunk-05.csv` | 170 | `f0fcd03f35074f991fc2778f6e76c0003f51ead66c62d19cd6fd1ec6ea88aa66` | `76b5c1878b76dcc4208c23d20751dd608eae1ad0e24fcc8675edcc4f74b57d94` |
| `adjudication/genres-final-chunk-05.csv` | 10 | `320f9e0d323c29e6ae46682d2c900e0768e61e23d960cc8dff3c303c4594ee1b` | 동일 |
| `adjudication/themes-final-chunk-05.csv` | 16 | `4bffb927c1d14162a8fef8a392d8459f67bb2f47ccc893991bb3e5ec27d12afa` | 동일 |
| `art-review/chunk-05/final-art.csv` | 40 | `d37620879b365a826cd4e835e63136f2152bdb8a043c616e3a0f9d9daeb87093` | 동일 |

Terminal text는 170행, 10작품, Dictionary Axis 순서를 유지하며 `known=67`,
`unknown=103`이다.

## Gate recompute

최소치는 Genre `1/1`, Theme `1/1`, Narrative `4/6`, Tone `5/7`, Art `2/4`다.
Position 47은 Genre 2개, Theme 2개, Narrative `3/6`, Tone `7/7`, Art `3/4`다.
이번 변경으로 Tone은 완전해졌지만 Narrative가 미달이므로 text gate와 all gate는
계속 FAIL이다. Chunk 05의 text-gate 통과 작품과 all-gate 통과 작품은 모두 0개로
변함없다.

## Boundary and validation

- `unknown`을 낮은 값으로 치환하지 않았고 제안된 한 셀만 수정했다.
- source, Genre, Theme, Art, promotion, generated catalog, Gold 150을 수정하지 않았다.
- canonical title이나 데이터에 장식용 `『』`를 추가하지 않았다.
- 이 판정은 모델 패널 검수이며 사람 검수가 아니다: `reviewedByHuman=false`.
- CSV 행·작품 수·known/unknown shape 검사와 `git diff --check`를 실행했다.
