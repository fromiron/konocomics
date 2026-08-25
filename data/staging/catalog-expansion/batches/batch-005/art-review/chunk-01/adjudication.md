# Batch 005 Art 독립 adjudication — chunk 01

- adjudicationDate: `2026-08-25`
- adjudicator: Daybreak independent pixel adjudication
- reviewedByHuman: `false`
- scope: frozen positions `1–10`; Factor Dictionary Art 4축만
- decision rule: Local/Gemini 값을 평균하거나 투표하지 않고 preflight gate, 원본 결속 이미지, Factor Dictionary 0·2·4 앵커로 셀별 판정
- Cursor Grok Art: `ART_ABSTAIN`
- Muse: `NOT_USED`
- promotion: 수행하지 않음
- source·preflight·Local·Gemini artifact 수정: 수행하지 않음
- temporaryImagesCommitted: `false`
- commit: 수행하지 않음

## 결론

교정 후 독립 QA에서 `sample-ready`로 승인된 positions 2, 4, 8만 정적 Art 3축을 판정했다. 나머지 7작품은 page 수, context 수, 정확한 판본 bridge 또는 내부 preview route가 최소선에 미달하므로 값을 낮게 채우지 않고 `U/U/U/U`로 종결했다. 모든 작품의 `motionGateAttemptable=false`를 재확인해 `motionImpact` 10셀도 전부 terminal `unknown`이다.

| Pos | Work                    | artRealism | artDensity | visualSoftness | motionImpact |
| --: | ----------------------- | ---------: | ---------: | -------------: | -----------: |
|   1 | チェーザレ 破壊の創造者 |          U |          U |              U |            U |
|   2 | くーねるまるた          |          2 |          2 |              3 |            U |
|   3 | インベスターZ           |          U |          U |              U |            U |
|   4 | 黄泉のツガイ            |          2 |          3 |              2 |            U |
|   5 | ラーメン大好き小泉さん  |          U |          U |              U |            U |
|   6 | 忘却のサチコ            |          U |          U |              U |            U |
|   7 | 機動旅団八福神          |          U |          U |              U |            U |
|   8 | 不滅のあなたへ          |          3 |          1 |              3 |            U |
|   9 | よるくも                |          U |          U |              U |            U |
|  10 | 高校球児 ザワさん       |          U |          U |              U |            U |

`U`는 낮은 값이나 blocker가 아니라 근거 최소선에 따라 명시적으로 닫힌 `unknown`이다.

## 입력과 실행 결속

| Input                                                   | SHA-256                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                     | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                      | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `manifest.json`                                         | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| `frozen-work-set.csv`                                   | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| `art-preflight/chunk-01/preflight.csv`                  | `6d6ba98891618f57360849c924e9cd73ce64795c8d3e70f3a96799d021fb7e4d` |
| `art-preflight/chunk-01/ledger.md`                      | `50f18b1f93d6620650f84fdedf38c4fe51985fdee45250b11740cd50585f3df4` |
| `reviews/daybreak-art-preflight-qa-chunk-01-round-2.md` | `3aa1f87665bc18e49b25bf4623e8ff9c0e87ca2d54651efdf100692f3701b793` |
| `art-review/chunk-01/local-art.csv`                     | `7d6738e8370bf451430284de07ea3593411f490f93567f3d6146f364434ca7f3` |
| `art-review/chunk-01/local-codex.md`                    | `3cd83772c6417afe8fa3aa1e14fe21eb737500f6947100db4e26bb805e8d8bf1` |
| `art-review/chunk-01/gemini-request.md`                 | `9c00e42c54f67f3f32a02a66b4a60c4c66a942ef48d5d88472d51609c96453b4` |
| `art-review/chunk-01/gemini-payload-files.sha256`       | `405eae14db483160f2a24de426fb95d4f270d5879830da5ca22cd3d31c759bea` |
| `art-review/chunk-01/gemini-payload-ledger.md`          | `2156f65f58250d09ad281085b918b1db035e7ad01bbf269499b6745d6b7008ef` |
| `art-review/chunk-01/gemini-root-identity.json`         | `6006ba19049c8a7f406823befe39b7898c5a0e7d1baa1ca7bbdf453f2197b141` |
| `art-review/chunk-01/gemini-execution-ledger.md`        | `708e719c12f64e1cc9853792b700379fe97595528cb203c7af037d9e44a1447e` |
| `art-review/chunk-01/gemini-response.md`                | `708a28a6b5898c6dc9f2a024961f52dd3e12459d908228c1dac193796327d2ea` |
| `art-review/chunk-01/final-art.csv`                     | `2b915b96a67852f8c38b4abcd4d0a000b9cae00a2e05f56f4a27f0a229e4fb67` |

Candidate SHA는 manifest의 `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`와 일치한다. Gemini canonical uncompressed root는 `/tmp/konocomics-batch005-gemini-art01.Glb4KB`이고 payload identity는 `405eae14db483160f2a24de426fb95d4f270d5879830da5ca22cd3d31c759bea`다.

## 18/18 이미지 검증

canonical root의 manifest를 `sha256sum -c`로 다시 검사해 이미지 18개와 frozen input 10개 및 payload ledger 1개가 모두 일치했다(`29/29`, 실패 0). 정적 판정 대상은 다음 세 작품뿐이다.

- position 2: `reader-step-04`–`09`, 각 `1850×1937`, 6개 hash 일치
- position 4: `official-fotorama-004`–`009`, 각 `900×1280`, 6개 hash 일치
- position 8: `episode-1-canvas-7`–`10` 각 `395×566`, `11`–`12` 각 `837×1200`, 6개 hash 일치

18개 exact root 파일을 모두 original-detail로 열어 내용과 ref 순서를 재검수했다. 화면 렌더러는 position 2의 `1850×1937` 이미지만 표시 단계에서 `1536×1608`로 축소했으나 파일 해시·원본 크기·내용 결속은 원본에서 재계산했다. Local과 Gemini가 각각 기록한 원본 픽셀 접근 증명도 아래와 같이 독립적으로 검증했다.

## 두 모델의 독립성·capability 검증

### Local Codex

- Gemini 또는 다른 Art 결론을 보지 않았고 adjudication·promotion을 하지 않았다고 명시했다.
- 별도 Local root의 18개 selected image를 원본 크기로 열고 current preflight와 `18/18` hash 일치를 기록했다.
- 정적 값은 positions 2, 4, 8에만, motion은 전부 unknown으로 냈다.
- `local-art.csv`는 40행이며 known 9셀, unknown 31셀이다.

### Gemini 3.7 Flash High

- 요청 모델 `gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash High`, effort `high`, mode `plan`이다.
- canonical uncompressed root의 이미지 `18/18`과 frozen input `10/10`을 열었고 Local 결론에 접근하지 않았다고 명시했다.
- completion은 normal, outer result는 success, exit code는 `0`이며 timeout·rate-limit·degraded output·fallback·substitution·truncation·filesystem mutation이 없다.
- 완결 응답은 231줄로 보존됐고 `reviewedByHuman=false`다.

따라서 두 pass 모두 exact input 결속, 실제 Art 접근, 독립성, 정상 종료, 완결 응답 조건을 충족한다. Cursor Grok은 픽셀 증명 없이 Art에서 기권했고 Muse는 사용하지 않았다.

## 4개 불일치 셀의 독립 판정

| Pos / Axis         | Local | Gemini | Final | 원본·사전 앵커 판정                                                                                                                                                                                  |
| ------------------ | ----: | -----: | ----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2 `visualSoftness` |     3 |      2 | **3** | rounded character construction, flowing hair, light tone과 gentle expression이 exterior·apartment 모두에서 2보다 부드럽다. 다만 hard architecture와 bold comic lettering 때문에 지속적인 4는 아니다. |
| 4 `artRealism`     |     3 |      2 | **2** | terrain·animal·architecture가 관찰적으로 그려졌어도 simplified shonen faces와 expressive deformation이 character panel마다 지속돼 전체 anchor는 일반적 스타일화 2다.                                 |
| 8 `artRealism`     |     3 |      2 | **3** | wolf anatomy, wound·deterioration, fur, snow contact와 shelter perspective가 현실 쪽으로 기울지만 boy face와 일부 환경 형식화 때문에 4는 아니다.                                                     |
| 8 `artDensity`     |     1 |      2 | **1** | 4개의 wilderness page에서 large snow field, isolated figure, broad white panel이 반복되고 마지막 2쪽만 inhabited detail을 보강한다. 0보다 정보가 있으나 chunk 전체는 balanced 2보다 낮다.            |

그 밖의 36셀은 두 proposal이 합의했으며 gate와 픽셀에 대조해 유지했다. 모델 값의 평균이나 단순 다수결은 사용하지 않았다.

## 0·4 endpoint 및 motion 감사

Local·Gemini proposal과 final에 값 `0` 또는 `4`인 Art 셀은 없다. 최종 `1`인 position 8 `artDensity`는 sparse 0과 balanced 2 사이의 직접 관찰값이고, 최종 `3`인 세 셀은 2와 4 사이의 직접 관찰값이다. endpoint를 피하기 위해 중간값을 기계적으로 부여하지 않았고, endpoint를 맞추기 위해 표본 예외를 무시하지 않았다.

모든 preflight 행의 `motionGateAttemptable=false`를 확인했다. position 2의 입장·대화, position 4의 이동·작업, position 8의 변형·보행 fragment 어디에도 하나의 연속 동작에 대한 exact start·development/impact·resolved endpoint가 함께 고정되지 않았다. 따라서 `motionImpact` 10셀은 모두 `unknown`이며 `notApplicable`이나 낮은 수치로 대체하지 않았다.

## 출력 계수와 무결성

- works: `10`
- axes per work: `4`
- `final-art.csv`: header 1 + data rows `40`, columns `8`
- known cells: `9`
- unknown cells: `31`
- notApplicable cells: `0`
- unknown-ready 작품의 unknown cells: `28/28`
- sample-ready 작품의 motion unknown cells: `3/3`
- Local/Gemini agreements rechecked: `36`
- Local/Gemini disagreements adjudicated: `4`
- unresolved Art disagreements: `0`
- reviewedByHuman: `false`
- Art sample shortage를 promotion blocker로 변환: `0`
- source·promotion·catalog·code mutation: 없음

이 결과는 Art 상태만 terminal known 또는 terminal unknown으로 종결하며 coverage를 채우기 위한 추정값을 추가하지 않는다.
