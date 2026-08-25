# Batch 005 Art 독립 adjudication — chunk 05

- adjudicationDate: `2026-08-25`
- adjudicator: Daybreak independent original-pixel adjudication
- reviewedByHuman: `false`
- scope: frozen positions `41–50`; Factor Dictionary Art 4축만
- decision rule: Local/Gemini 값의 평균 또는 다수결 없이 원본 픽셀, 사전 0·2·4 앵커, preflight gate로 셀별 판정
- Cursor Grok Art: `ART_ABSTAIN`
- Muse: `NOT_USED`
- promotion: 수행하지 않음
- source·preflight·Local·Gemini artifact 수정: 수행하지 않음
- temporaryImagesCommitted: `false`
- commit: 수행하지 않음

## 결론

독립 preflight QA에서 `sample-ready`로 승인된 positions 41, 46, 47, 50만 정적 Art 3축을 판정했다. positions 42–45, 48, 49는 판독 가능한 내부 본문 6쪽·2맥락 최소선에 미달하므로 값을 낮게 채우지 않고 `U/U/U/U`로 종결했다. 모든 작품의 `motionGateAttemptable=false`도 재확인해 `motionImpact` 10셀은 전부 terminal `unknown`이다.

| Pos | Work                                           | artRealism | artDensity | visualSoftness | motionImpact |
| --: | ---------------------------------------------- | ---------: | ---------: | -------------: | -----------: |
|  41 | 機械仕掛けの愛                                 |          1 |          2 |              3 |            U |
|  42 | 臨死!!江古田ちゃん                             |          U |          U |              U |            U |
|  43 | 町でうわさの天狗の子                           |          U |          U |              U |            U |
|  44 | 万福児                                         |          U |          U |              U |            U |
|  45 | スピリットサークル                             |          U |          U |              U |            U |
|  46 | トリリオンゲーム                               |          4 |          4 |              0 |            U |
|  47 | デッドデッドデーモンズデデデデデストラクション |          2 |          4 |              2 |            U |
|  48 | 月に吠えらんねえ                               |          U |          U |              U |            U |
|  49 | 1/11 じゅういちぶんのいち                      |          U |          U |              U |            U |
|  50 | シュトヘル                                     |          2 |          3 |              1 |            U |

`U`는 낮은 값이나 promotion blocker가 아니라 근거 최소선에 따라 닫힌 `unknown`이다.

## 입력과 실행 결속

| Input                                                   | SHA-256                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                     | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                      | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `manifest.json`                                         | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| `frozen-work-set.csv`                                   | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| `art-preflight/chunk-05/preflight.csv`                  | `57ef95da4593b94895e053c686cb316bde2a83259b071b474456ab7fefb1c8f9` |
| `art-preflight/chunk-05/ledger.md`                      | `6a2758d0180d3793fd9fb6ac54892ec164f6ac09ee1e7bdc122a63b8d598d0a2` |
| `reviews/daybreak-art-preflight-qa-chunk-05-round-2.md` | `1c31452360c80a8ef4801e2aee9ead56c23fc42d1ecc1960d2782a0c1c681f01` |
| `art-review/chunk-05/local-art.csv`                     | `d1028c0442f9ee42b287575f848c92ba6ac64f4350ccf9468a8b3736ba960805` |
| `art-review/chunk-05/local-codex.md`                    | `fb6629c77f38adfd1d558620bf62ccc53f1a7a215a7dfb43f9b427b6925d92b3` |
| `art-review/chunk-05/gemini-request.md`                 | `d83274c27b36c1b98d384630c25a9c3159dfd88a223e00aab7c36a47aadca0cd` |
| `art-review/chunk-05/gemini-payload-files.sha256`       | `e1de856ad21c92358ccabbb33f8e80c6cf4b3ab1f95c0366883660e7a48e457e` |
| `art-review/chunk-05/gemini-payload-ledger.md`          | `f7babd8a9a2c07bfb7eec0e3354b0230010e08c2ff04c2d3af3540e7acfd2c40` |
| `art-review/chunk-05/gemini-root-identity.json`         | `09909bbcf0f987b5cb36d89bfb9133897ad0d3e914a5364df52854460736f502` |
| `art-review/chunk-05/gemini-execution-ledger.md`        | `a25211ad60510f3579393674fea0326e9129521fcd2d3426d81e14f73d73b594` |
| `art-review/chunk-05/gemini-response.md`                | `107b7b8ee77286af4bd9b29fbf31a6cea364d565e691dc5d1817a6bb2855f6ad` |
| `art-review/chunk-05/final-art.csv`                     | `d37620879b365a826cd4e835e63136f2152bdb8a043c616e3a0f9d9daeb87093` |

Candidate SHA는 manifest의 `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`와 일치한다. Gemini canonical uncompressed root는 `/tmp/konocomics-batch005-gemini-art05.PnR3Af`이고 payload identity는 `e1de856ad21c92358ccabbb33f8e80c6cf4b3ab1f95c0366883660e7a48e457e`다.

## 24/24 원본 픽셀·해시 검증

Gemini canonical root에서 `gemini-payload-files.sha256`을 다시 검사해 35개 파일 전부가 일치했다. 그중 정적 판정 대상의 공식 BODY 이미지 24개는 모두 `847×1200`이었고 original-detail로 직접 열어 ref 순서, 장면 맥락, 픽셀 내용을 재검수했다.

- position 41: `reader-trg-06`–`11`; amusement park, robot shop, home의 3맥락
- position 46: `reader-trg-11`–`16`; coastal luxury residence와 urban flashback/assault의 2맥락
- position 47: `reader-trg-07`–`12`; household, street/bicycle, school의 3맥락
- position 50: `reader-trg-09`–`14`; historical battle/rescue와 modern indoor/karaoke의 2맥락

positions 42–45, 48, 49는 승인된 decoded BODY 표본이 없으며 preflight의 `unknown-ready`를 유지했다.

## 두 모델의 독립성·capability 검증

### Local Codex

- Gemini 또는 다른 Art 결론을 보지 않았고 adjudication·promotion을 하지 않았다고 명시했다.
- QA 승인 이미지 24개를 원본 픽셀로 열고 preflight와 `24/24` 해시 일치를 기록했다.
- 정적 값은 sample-ready 4작품에만 냈고, unknown-ready 6작품과 motion 10셀은 모두 unknown으로 닫았다.
- `local-art.csv`는 정확히 40행이며 known 12셀, unknown 28셀이다.

### Gemini 3.7 Flash High

- 요청 모델 `gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash High`, effort `high`, mode `plan`을 확인했다.
- canonical uncompressed root의 이미지 `24/24`와 frozen input `10/10`을 original pixels로 읽고 Local 결론에 접근하지 않았다고 명시했다.
- completion은 normal, outer result는 success, exit code는 `0`이며 timeout·rate-limit·degraded output·fallback·substitution·truncation·filesystem mutation이 없다.
- 완결 응답은 250줄로 보존됐고 `reviewedByHuman=false`다.

따라서 두 pass 모두 exact root/input 결속, 실제 Art 접근, 독립성, 정상 종료, 전체 입력 접근, 완결 응답 조건을 충족한다. Cursor Grok은 Art에서 `ART_ABSTAIN`, Muse는 `NOT_USED`로 유지했다.

## 5개 불일치 셀의 독립 판정

| Pos / Axis          | Local | Gemini | Final | 원본 픽셀·사전 앵커 판정                                                                                                                                       |
| ------------------- | ----: | -----: | ----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 41 `artRealism`     |     1 |      0 | **1** | 단순한 얼굴과 둥근 인물이 계속되지만 놀이공원 구조물, 매장, 차량, 주택은 정상 원근과 기능적 형태를 유지한다. 강한 단순화 0과 일반 스타일화 2 사이가 맞다.      |
| 41 `artDensity`     |     2 |      1 | **2** | 인물 패널에는 여백이 있으나 놀이공원, robot showroom, home 각 맥락마다 기능적 배경·소품 정보가 반복돼 sparse 쪽 1보다 균형 2에 해당한다.                       |
| 41 `visualSoftness` |     3 |      2 | **3** | 둥근 얼굴·눈, 매끄러운 윤곽, 완만한 표정이 세 맥락 모두 지속되며 neutral 2보다 부드럽다. 기계·건축의 직선 때문에 4는 아니다.                                   |
| 47 `artRealism`     |     3 |      2 | **2** | 방·거리·학교 배경은 사진적으로 관찰됐지만 단순하고 둥근 얼굴과 코미디식 인물 변형이 세 맥락 모두 남는다. 전체 anchor는 현실 지향 3이 아니라 일반 스타일화 2다. |
| 50 `artRealism`     |     2 |      3 | **2** | 역사 소품·인체·현대 실내는 기능적으로 타당하지만 얼굴, 머리, 실루엣의 의도적 만화 변형이 전장과 현대 맥락에 모두 지속돼 realism-leaning 3까지 올리지 않는다.   |

그 밖의 35셀은 두 proposal이 합의했으며 gate와 픽셀에 대조해 유지했다. 모델 값을 평균하거나 단순 다수결로 처리하지 않았다.

## 모든 0·4 endpoint 감사

최종 endpoint는 position 46의 `artRealism=4`, `artDensity=4`, `visualSoftness=0`과 position 47의 `artDensity=4`다.

- position 46 realism 4: 현실적인 성인 인체·얼굴 모델링·원근·도시 구조가 luxury residence와 urban flashback 양쪽에서 지속된다.
- position 46 density 4: 실내 가구·패턴·해안 도시, 초고층 건물, 야간 상가와 해칭이 두 맥락 모두를 높은 정보량으로 채운다.
- position 46 softness 0: 각진 얼굴 면, 단단한 윤곽, 강한 검은 면과 해칭이 실내·도시·인물에 모두 지배적이다.
- position 47 density 4: cable·책·가구·주방, 거리·수목, 학교 건축과 표면 texture가 household·street·school 세 맥락에 모두 반복된다.

Gemini가 제안한 position 41 `artRealism=0`은 정상 원근의 복수 배경 맥락 때문에 1로, position 50 `artRealism=3`은 두 맥락의 지속적 인물 스타일화 때문에 2로 조정했다. endpoint를 맞추기 위해 예외 맥락을 무시하지 않았다.

## motion endpoint 감사

preflight 10행 모두 `motionGateAttemptable=false`다. position 41의 이동, position 46의 폭행 aftermath, position 47의 bicycle 이동, position 50의 전장 순간은 고립된 장면이며 exact start·development/impact·resolved endpoint가 함께 고정된 하나의 연속 시퀀스가 아니다. 따라서 `motionImpact` 10셀은 전부 `unknown`이고 `notApplicable`이나 낮은 수치로 바꾸지 않았다.

## 출력 계수와 무결성

- works: `10`
- axes per work: `4`
- `final-art.csv`: header 1 + data rows `40`, columns `8`
- known cells: `12`
- unknown cells: `28`
- notApplicable cells: `0`
- unknown-ready 작품의 unknown cells: `24/24`
- sample-ready 작품의 motion unknown cells: `4/4`
- Local/Gemini agreements rechecked: `35`
- Local/Gemini disagreements adjudicated: `5`
- unresolved Art disagreements: `0`
- reviewedByHuman: `false`
- Art sample shortage를 promotion blocker로 변환: `0`
- source·promotion·catalog·code mutation: 없음

이 결과는 Art 상태를 terminal known 또는 terminal unknown으로 종결하며 coverage를 채우기 위한 추정값을 추가하지 않는다.
