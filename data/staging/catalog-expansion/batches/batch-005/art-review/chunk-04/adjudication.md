# Batch 005 Art 독립 adjudication — chunk 04

- adjudicationDate: `2026-08-25`
- adjudicator: Daybreak independent original-pixel adjudication
- reviewedByHuman: `false`
- scope: frozen positions `31–40`; Factor Dictionary Art 4축만
- decision rule: Local/Gemini 값의 평균 또는 다수결 없이 원본 픽셀, 사전 앵커, preflight gate로 셀별 판정
- promotion: 수행하지 않음
- source·preflight·Local·Gemini artifact 수정: 수행하지 않음
- temporaryImagesCommitted: `false`
- commit: 수행하지 않음

## 결론

현행 preflight는 정적 Art에 positions 31, 32, 34, 36, 37, 40만 허용하고 position 35에는 `reader-page-010`의 motion-only 판정만 허용한다. Positions 33, 38, 39와 position 35의 정적 3축은 근거를 보충하거나 낮은 값으로 대체하지 않고 terminal `unknown`으로 종결했다.

Local과 Gemini가 합의한 34셀은 원본 픽셀 및 gate와 대조해 유지했다. 서로 달랐던 6셀은 독립 원본 판독으로 해소했다. 최종 벡터는 다음과 같다.

| Pos | Work | artRealism | artDensity | visualSoftness | motionImpact |
| --: | --- | --: | --: | --: | ---: |
| 31 | デストロ２４６ | 3 | 3 | 1 | U |
| 32 | 夢の雫、黄金の鳥籠 | 2 | 3 | 4 | U |
| 33 | 日常 | U | U | U | U |
| 34 | ひらやすみ | 2 | 2 | 3 | U |
| 35 | ハイスコアガール | U | U | U | 4 |
| 36 | WOMBS | 3 | 3 | 2 | U |
| 37 | ママはテンパリスト | 1 | 1 | 3 | U |
| 38 | 僕らはみんな河合荘 | U | U | U | U |
| 39 | かよちゃんの荷物 | U | U | U | U |
| 40 | 脳内ポイズンベリー | 2 | 2 | 3 | U |

`U`는 낮은 값이나 blocker가 아니라 근거 기준에 따라 닫힌 terminal `unknown`이다.

## 입력과 실행 결속

| Input | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| `frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| `art-preflight/chunk-04/preflight.csv` | `a69ba0d2149828c4f0c3d3a6d3865f0bf50622adc6c912fcb9086251f0b7c9f7` |
| `art-preflight/chunk-04/ledger.md` | `f10dda88943066dcfb4fdcd92b863b338cca9a184f27947440d5af990415323c` |
| `reviews/daybreak-art-preflight-qa-chunk-04-round-4.md` | `4873b025adb2591e1d540af5a5faca268fd4d5e3b7511fbd42bfe2a7daac2b38` |
| `art-review/chunk-04/local-art.csv` | `cf4d22f5a8e68b23d4a6fe907cdc5a81a2ef640816f2611b5ac23f83e046c7b9` |
| `art-review/chunk-04/local-codex.md` | `0aced58ea317f29d75b1ede8f989e92ff6b19bf8b9aa171331e87f4540c567ee` |
| `art-review/chunk-04/gemini-request.md` | `1c8b7773d375faa557dd0ab7f1de79cb80bf97ce238fe65984eadf0fe6c74ea1` |
| `art-review/chunk-04/gemini-payload-files.sha256` | `61deabd357de4ae2fb3e80e42249e67861de2a44630ae8dca1026c503282c469` |
| `art-review/chunk-04/gemini-payload-ledger.md` | `f256c325262fc8a55d5b47e577664505dded65ecedba514674f4754842d1accd` |
| `art-review/chunk-04/gemini-root-identity.json` | `57fe77a44dba66322d4d7f22e31bf222a627b3d75ae6ecb7b3dd363455e54357` |
| `art-review/chunk-04/gemini-execution-ledger.md` | `2e0dbcfc93a2c0a7a2ea8d36b0600ff2b60d0ccf0eb044366a6ee85fd18aa1c2` |
| `art-review/chunk-04/gemini-response.md` | `f0609123c6f5faf7bf950a74a27c13747a4687252aacd3e2e478a57705658a49` |
| `art-review/chunk-04/final-art.csv` | `b93020f3f1bdbc0aad0adbc2efe9cd9254e7ecb8b678dc7bcc519dbfe60fe346` |

Candidate SHA는 manifest의 `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`와 일치한다. Gemini canonical uncompressed root는 `/tmp/konocomics-batch005-gemini-art04.EOXSVN`이고 payload identity는 `61deabd357de4ae2fb3e80e42249e67861de2a44630ae8dca1026c503282c469`이다.

## 48/48 파일·37/37 원본 픽셀 검증

Canonical root에서 `gemini-payload-files.sha256`의 48개 항목을 다시 계산해 전부 일치했다. 구성은 frozen input 10개, payload ledger 1개, 원본 이미지 37개이며 누락과 mismatch는 각각 0이다. 이미지 37개는 모두 `openedAtOriginalPixels=yes`로 직접 열어 장면과 ref를 대조했다.

작품별 원본 픽셀은 position 31 `6`, 32 `6`, 34 `6`, 35 `1`, 36 `6`, 37 `6`, 40 `6`으로 합계 37개다. Positions 33, 38, 39는 Gemini payload에서 정적 판정 대상이 아니며 preflight gate대로 Art 값이 없다. Position 35의 정적 6쪽도 단일 맥락이므로 panel payload에서 제외되고 motion-only `reader-page-010`만 포함됐다.

## 두 모델 증명 검증

### Local Codex

- Local pass는 Gemini 결론을 보지 않고 먼저 40 terminal cells를 작성했다고 명시했다.
- 현행 preflight의 48개 SHA를 원본에서 재계산했고, 정적 값은 6쪽·2맥락 이상을 충족한 6작품에만 냈다.
- Position 35 motion은 단일 허용 sequence만 사용했고 다른 motion cell은 전부 기권했다.

### Gemini 3.7 Flash High

- 요청·resolved model은 `gemini-3.7-flash-high`, effort `high`, mode `plan`이다.
- 실행은 exit `0`, outer `success`, 정상 완료이며 timeout, rate-limit, degraded output, fallback, substitution이 없다.
- Exact request, canonical uncompressed root, 10개 frozen input, 37개 이미지에 접근했고 302-line complete response를 남겼다.
- 모든 48개 payload SHA와 37개 원본 픽셀을 직접 검증했으며 Local 결론을 보지 않았다고 명시했다.

따라서 Local/Gemini 모두 독립성, 입력 결속, 픽셀 접근, 정상 종료, 완결 응답 조건을 충족한다. Cursor Grok은 실제 픽셀 접근 없이 `ART_ABSTAIN`, Muse는 `NOT_USED`로 유지했다.

## 6개 불일치 셀의 픽셀 adjudication

| Pos / Axis | Local | Gemini | Final | 원본 픽셀·사전 앵커 판정 |
| --- | --: | --: | --: | --- |
| 31 `artRealism` | 3 | 2 | **3** | 저택·총기·손·의복·성인 비례·식당 인물이 4에 가깝게 관찰됐지만 얼굴과 머리의 manga stylization이 계속 남는다. 2와 4 사이의 현실 지향 3이다. |
| 36 `artRealism` | 4 | 3 | **3** | 성인 비례·군복·기계·지형은 현실 지향이나 얼굴, 군중, 회화적 변형이 세 맥락 모두에 남아 realistic endpoint 4를 거부한다. |
| 36 `visualSoftness` | 1 | 2 | **2** | 절벽·통제실·군중의 거친 선과 hard shadow가 있지만 color landscape와 transfer chamber의 painterly wash·blur가 반복되어 전체는 중립이다. |
| 37 `artDensity` | 2 | 1 | **1** | caption과 panel 수는 많지만 배경과 인물 drawing 자체는 넓은 여백·단순 윤곽·최소 소품이 반복된다. balanced 2보다 sparse 0에 가까운 중간 1이다. |
| 40 `artRealism` | 3 | 2 | **2** | 역·의복·성인 비례가 관찰됐어도 idealized eyes, elastic reaction, brain-personification 얼굴이 두 맥락에 지속되어 일반적 스타일화 2다. |
| 40 `artDensity` | 3 | 2 | **2** | 역 건축·머리·tone detail과 넓은 portrait·dialogue·meeting field가 균형을 이룬다. 정보량이 계속 above-balanced인 3은 아니다. |

## 모든 0/4 극단값 감사

두 proposal 또는 final에 등장한 endpoint를 전부 감사했다.

| Pos / Axis | 제안 | Final | 감사 결과 |
| --- | --- | --: | --- |
| 32 `visualSoftness` | Local/Gemini 4 | **4** | 마을·수확 장면과 침실·야간 장면 모두 fine contour, 흐르는 머리, 둥근 얼굴, 옅은 tone이 지속되어 soft endpoint를 유지한다. |
| 35 `motionImpact` | Local/Gemini 4 | **4** | 단일 공식 page 안에서 접근·주먹 접촉·속도선·얼굴 변형·코피 aftermath가 모두 결속되어 forceful endpoint를 유지한다. |
| 36 `artRealism` | Local 4 | **3** | 환경과 인체의 관찰력은 높지만 얼굴·군중·회화적 변형이 계속되어 4를 거부한다. |

최종 0은 0셀, 최종 4는 2셀이다.

## motion endpoint 감사

Position 35 `reader-page-010`, final `4`:

1. start — 소년이 arcade cabinet 앞에 앉아 있고 소녀가 몸을 일으킨다.
2. development — 소녀의 다리와 접근 panel이 거리를 닫는다.
3. impact — 큰 중앙 panel에서 주먹이 얼굴에 직접 접촉하고 speed arc, burst line, 심한 facial deformation이 나타난다.
4. resolved endpoint — 별도 하단 panel에서 소년이 코피 난 얼굴을 붙잡고 소녀는 주먹을 쥔 채 정지한다.

연속성, impact, 별도 aftermath가 모두 확인돼 4를 유지했다. 다른 9작품은 `motionGateAttemptable=false`이므로 모두 unknown이다. Violent aftermath, countdown, crowd materialization, 일상 gesture를 motion sequence로 재해석하지 않았다.

## 출력 계수와 무결성

- works: `10`
- axes per work: `4`
- `final-art.csv`: header 1 + data rows `40`, columns `8`
- known cells: `19`
- unknown cells: `21`
- notApplicable cells: `0`
- Local/Gemini agreements rechecked: `34`
- Local/Gemini disagreements adjudicated: `6`
- unresolved Art disagreements: `0`
- reviewedByHuman: `false`
- Art sample shortage를 promotion blocker로 변환: `0`
- source·promotion·catalog·code mutation: 없음

이 결과는 Art 상태를 terminal known 또는 terminal unknown으로만 종결하며 coverage를 채우기 위한 추정값을 추가하지 않는다.
