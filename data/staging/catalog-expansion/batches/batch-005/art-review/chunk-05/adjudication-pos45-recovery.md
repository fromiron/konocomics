# Batch 005 Art recovery independent adjudication — chunk 05 position 45

- adjudicationDate: `2026-08-25`
- adjudicator: Daybreak independent original-pixel adjudication
- scope: frozen Batch 005 position `45`, `work-e658d3aee2e33c17aa38`, `スピリットサークル`
- reviewedByHuman: `false`
- decision rule: Local/Gemini 값을 평균하거나 다수결하지 않고 원본 픽셀과 Factor Dictionary `0 / 2 / 4` 앵커로 축별 판정
- Grok: `ART_ABSTAIN`
- Muse: `NOT_USED`
- temporaryImagesCommitted: `false`
- promotion/source/generated/text mutation: 수행하지 않음

## 결론

공식 표준 제2권에 연결된 내부 BODY 6쪽을 원본 `853 × 1200` 픽셀로 다시 열었다. 최종 벡터는 `artRealism=2`, `artDensity=1`, `visualSoftness=2`, `motionImpact=unknown`이다.

Local과 Gemini가 합의한 softness 2와 motion unknown은 원본으로 재확인했다. realism은 일반적인 manga stylization이 6쪽에 지속되어 2로, density는 기능적 배경이 일부 반복되지만 큰 흰 면과 생략 배경이 표본 대부분을 차지해 0과 2 사이의 1로 판정했다.

## 결속 재검증

| Input                    | SHA-256                                                            | 결과                             |
| ------------------------ | ------------------------------------------------------------------ | -------------------------------- |
| Factor Dictionary        | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | match                            |
| Batch manifest           | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | match                            |
| frozen work set          | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | match                            |
| recovery preflight       | `3231c03511f68373204addd118e1a89c6f8bc1253ea829f2336ae066f29e4fd7` | match                            |
| recovery ledger          | `9f2a0f9e7e37a50d9142ea89581d76ceb8cc8b2258d8b37aeb9d3762674ae31f` | match                            |
| independent preflight QA | `c512c93a55e974a78737788554f206aeb66deb9ed8b4e9c5ac22ff5debd3728b` | match                            |
| Local four-row proposal  | `1141894409afa56dc8d062460d4d1053e5dd0e569ed98512c17fb0f8579b2794` | match                            |
| Local report             | `490bd1e8b1b65c9e284602b7633e5774e7108b8d52ecf091f02f5858a77ea63f` | match                            |
| exact Gemini request     | `3070ea61c63d846868c33cebc4547c0917dc34c47178769bdd79dde1058b6246` | match                            |
| Gemini payload ledger    | `70247d355509014f8dc36cc39225ae3769c0becfaa64a9a7a53a7e1456bcf7df` | 11/11 canonical-root files match |
| Gemini root identity     | `a55b9de232a94d85ec6f35d35e88b40229651e631e8b2d2721ce4bdb57003e18` | match                            |
| Gemini execution ledger  | `215b0ab4f2ce24d62c2bc20ff882f72ac5df6567bae57c5f60548d25b87bcaac` | completed, exit 0                |
| complete Gemini response | `6813d2a99ec3795324ff34c0c15ef21d20c10110e9f9871b69b1344e30d8205f` | complete four-row response       |

Local은 `/tmp/konocomics-spirit45-recovery-v2`의 원본 `6/6`을 각 해시·해상도·관찰과 함께 기록했다. Gemini는 별도 canonical uncompressed root `/tmp/konocomics-batch005-gemini-art05-pos45.gn31H1`의 payload `11/11`을 `sha256sum -c`로 통과했고 이미지 `6/6`을 원본 픽셀로 열었다는 ACCESS 표와 literal attestation을 남겼다. adjudicator도 같은 6장을 독립적으로 다시 열었으며 두 root의 파일 해시는 모두 아래 값과 일치한다.

| Ref              | SHA-256                                                            | 맥락                         |
| ---------------- | ------------------------------------------------------------------ | ---------------------------- |
| `reader-v2-p006` | `54ea32927502dd995b0952d77a64e726f3f03441f84e8f2927cb85677bacd9ad` | colour fantasy/travel-memory |
| `reader-v2-p007` | `6e572900e5e33c863c26e2f87b5d574f2b38b41e5c7a7f48c4af0108903b41a4` | school corridor interaction  |
| `reader-v2-p008` | `65a6e3949dd6e08d4b724497b0673d96f3f1acbcd29a890213eac7752dfe938c` | corridor and school exterior |
| `reader-v2-p009` | `39dd198ac1d80541b03abd9faa1f01c94a070532b0cad4f913e3f7a6722dcfc4` | classroom interaction        |
| `reader-v2-p010` | `0d37650396712882c4147ef87c7334fc4cbd244c09a981b94d33a771fef26dd5` | classroom confrontation      |
| `reader-v2-p011` | `e2b97fdebf7d8b483136615e770e87470bc437f14153e0b62d85b58811c23ed4` | classroom discussion         |

## 모델 충돌 adjudication

| Axis             | Local | Gemini | Final | 원본 픽셀·사전 앵커 판정                                                                                                                                                |
| ---------------- | ----: | -----: | ----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `artRealism`     |     1 |      2 | **2** | 확대된 눈·단순화된 얼굴·과장 반응은 지속되지만 인체·의복·가구·학교 원근은 일관되고 기능적이다. 강한 데포르메 0과의 중간값보다 사전의 일반적 스타일화 2에 직접 해당한다. |
| `artDensity`     |     1 |      2 | **1** | p006·p008의 풍경·건축과 일부 교실 정보는 0을 넘기지만 p007·p009–p011을 포함해 큰 흰 면, 생략 배경, 단순 portrait가 반복돼 균형 2가 표본 전반에 지속되지 않는다.         |
| `visualSoftness` |     2 |      2 | **2** | 둥근 얼굴·매끄러운 곡선과 spiky hair·hard black·각진 반응선이 함께 반복돼 neutral 2다.                                                                                  |
| `motionImpact`   |     U |      U | **U** | 걷기·팔 들기·대화 gesture는 고립된 장면이며 정확한 start-development-impact-resolved endpoint를 가진 연속 시퀀스가 아니다.                                              |

값을 평균하거나 단순 다수결하지 않았다. 최종 0/4 endpoint와 unresolved disagreement는 없다. `unknown`은 낮은 값이 아니며 motion 표본 부족을 blocker로 바꾸지 않았다.

## 출력 무결성

- bounded recovery final: `final-art-pos45-recovery.csv`, data rows `4`, axis order exact, known `3`, unknown `1`
- bounded recovery final SHA-256: `cb9eb47114acc42ec9cc0a78d4ae561f18e572b6b0e20fc022851f4c868185ab`
- aggregate `final-art.csv` before SHA-256: `d37620879b365a826cd4e835e63136f2152bdb8a043c616e3a0f9d9daeb87093`
- aggregate `final-art.csv` after SHA-256: `8e9687ff8d951965eda03bfb78bf496c9f1b33f25cbfe658721068848e010ea8`
- aggregate rows: `40`, works: `10`, exactly four axes per work
- changed aggregate rows: position 45 four rows only
- reviewedByHuman: `false`

기존 텍스트·source·generated·promotion·Gold 데이터와 추천 산식은 수정하지 않았다.
