# Batch 005 Art recovery independent adjudication — chunk 03 position 26

- adjudicationDate: `2026-08-25`
- adjudicator: Daybreak independent original-pixel adjudication
- scope: frozen Batch 005 position `26`, `work-5b7cf2105a4bc6f6b46c`, `クジラの子らは砂上に歌う`
- reviewedByHuman: `false`
- decision rule: Local/Gemini 값을 평균하거나 다수결하지 않고 원본 픽셀, Factor Dictionary 앵커, 정확한 표본 범위로 축별 판정
- Grok: `ART_ABSTAIN`
- Muse: `NOT_USED`
- temporaryImagesCommitted: `false`
- promotion/source/generated/text mutation: 수행하지 않음

## 결론

공식 표준 제1권에 직접 연결된 정적 본문 6쪽과 연속 동작 3쪽을 원본 `1450 × 2057` 픽셀로 다시 열었다. 최종 벡터는 `artRealism=2`, `artDensity=3`, `visualSoftness=3`, `motionImpact=2`다.

Local과 Gemini의 일치값인 realism 2와 motion 2는 원본으로 재확인했다. density와 softness의 충돌은 평균하지 않았다. density는 세 맥락에서 균형보다 높지만 큰 하늘·모래·인물·대화 여백이 반복되어 지속적인 4 endpoint가 아니므로 3이다. softness는 둥근 인물·유기적 실루엣·섬세한 얼굴선이 지속되지만 거친 crosshatching과 단단한 검은 면도 반복되어 neutral 2와 soft 4 사이의 3이다.

## 결속 재검증

| Input                        | SHA-256                                                            | 결과                             |
| ---------------------------- | ------------------------------------------------------------------ | -------------------------------- |
| Factor Dictionary            | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | match                            |
| Batch manifest               | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | match                            |
| `PAYLOAD.sha256`             | `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` | match                            |
| frozen work set              | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | match                            |
| corrected recovery preflight | `f517ac72fd97468fbca6bd75225ce66584f4b1ba1cb13281a4dbd8d8b3a750dd` | match                            |
| corrected recovery ledger    | `de737e1fa421cfdefed8371b3040792450a94ea4d5db1b45122865e6ddbc4d07` | match                            |
| independent preflight QA     | `16d8314311af029d8b04bcc7ecce75c020eb80904a5bf08b3fbce76fe61bc90f` | match                            |
| Local four-row proposal      | `e1659292bc5f7674cfaf35ac4d5c8ed5bc7c4b8d3887d3796f65f5531bf2aa81` | match                            |
| Local report                 | `ae6c95f1f9fd5961ad3612f6b7c5d8e2e6f37a11038408e07e592ca71bc0d8f4` | match                            |
| Gemini exact request         | `9f20ef2ece09c6df73dc9f89c896cbd6d7538db9dfeec6de2d04954a1f2dd8a4` | match                            |
| Gemini payload ledger        | `aea331030c4b9c4dfc6208476c4c5d1890331a16ca263970c3b24847c9db0b9d` | 15/15 canonical-root files match |
| Gemini root identity         | `3509249b1f9d4ad8a5d2d208c5a24f832e5536af3f079fc2ce08e446726c97f7` | match                            |
| Gemini execution ledger      | `202d96d77cb65cfe5e6e8896e14afebc61667cb61a1f7123c846c8d9b0945ff2` | completed, exit 0                |
| Gemini response              | `0849b2243f5a915ba2cb33bf845ec304ebfc84814c65e31806a487020c312402` | complete four-row response       |

Local은 canonical uncompressed root `/tmp/konocomics-batch005-pos26-recovery`의 선택 원본을 `9/9` 열었다고 각 파일의 해시·해상도·관찰과 함께 기록했다. Gemini는 별도 canonical uncompressed root `/tmp/konocomics-batch005-gemini-art03-pos26.QmLmhk`에서 payload `15/15`를 `sha256sum -c`로 통과했고, 이미지 `9/9`를 원본 픽셀로 열었다는 ACCESS 표와 literal attestation을 완결 응답에 남겼다. 두 root의 이미지 해시는 preflight의 정확한 9개 SHA와 모두 일치한다. adjudicator도 같은 9개 원본을 별도로 다시 열어 총 `26,843,850` 픽셀을 판독했다.

## 원본 표본 판독

| Refs                      | 용도               | 독립 관찰                                                                                      |
| ------------------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| `arc-page-04`, `05`       | static             | 유기적 정착지·사막 전경의 촘촘한 구조선과 crosshatching이 큰 하늘·모래 여백과 공존             |
| `arc-page-06`, `07`, `08` | static             | 장례·애도·집단 상호작용의 둥근 얼굴과 섬세한 감정선이 단단한 검은 머리·거친 환경 질감과 공존   |
| `arc-page-09`             | static             | 정착지 전경은 매우 조밀하지만 하단 인물 대화 panel은 열린 면과 일반적 manga stylization을 유지 |
| `arc-page-15`             | motion start       | 잎 절단 요청, 도구 제시, 투척 준비                                                             |
| `arc-page-16`             | motion development | 원반 release와 큰 곡선 비행 경로                                                               |
| `arc-page-17`             | impact/resolution  | 잎 절단, 낙하 파편, 동료들의 즉시 반응으로 종결                                                |

## 모델 충돌 adjudication

| Axis             | Local | Gemini | Final | 근거                                                                                                                                   |
| ---------------- | ----: | -----: | ----: | -------------------------------------------------------------------------------------------------------------------------------------- |
| `artRealism`     |     2 |      2 | **2** | 관찰된 손·의복·원근·건축과 확대된 눈·단순화된 얼굴·이상화된 비례가 함께 지속되어 일반적 스타일화 앵커다.                               |
| `artDensity`     |     3 |      4 | **3** | 04·05·09의 고밀도 전경은 강하지만 06–08의 큰 portrait·대화 면과 전경의 하늘·모래 여백 때문에 모든 맥락에서 지속되는 4는 아니다.        |
| `visualSoftness` |     2 |      4 | **3** | 둥근 인물·유기적 건축·흐르는 실루엣은 neutral보다 부드럽지만 scratchy hatching·hard black mass·거친 구조 질감이 4 endpoint를 깨뜨린다. |
| `motionImpact`   |     2 |      2 | **2** | 정확한 start-development-impact-resolution은 충족하지만 궤적선과 절단 효과의 강조는 보통이며 강한 속도·타격 endpoint는 아니다.         |

Gemini가 제안한 극단값 density 4와 softness 4는 모두 표본의 반복적 counter-context 때문에 거부했다. 최종 0/4 극단값은 없고 unresolved disagreement도 없다.

## 출력 무결성

- recovery final: `final-art-pos26-recovery.csv`, data rows `4`, axis order exact, known `4`, unknown `0`
- recovery final SHA-256: `047ead40990abac0951dc03d4235e4667441357180ba6efb89b88a7cca9f465b`
- aggregate `final-art.csv` before SHA-256: `be73736121f53fd0286ee8cf334776f507f00bb8a40c3c007f8a1b6baec35f8d`
- aggregate `final-art.csv` after SHA-256: `f495bc0bfa6719a85cd8870cb855fb2a2f64bedf0b00c3a5a806ffe84eee53bf`
- aggregate rows: `40`, works: `10`, exactly four axes per work
- changed aggregate rows: position 26 four rows only
- reviewedByHuman: `false`

Art 표본 부족을 blocker로 바꾸지 않았고, 기존 텍스트·source·generated·promotion·Gold 데이터와 추천 산식은 수정하지 않았다.
