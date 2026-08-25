# Batch 005 Art 독립 adjudication — chunk 03

- adjudicationDate: `2026-08-25`
- adjudicator: Daybreak independent original-pixel adjudication
- reviewedByHuman: `false`
- scope: frozen positions `21–30`; Factor Dictionary Art 4축만
- decision rule: Local/Gemini 값의 평균 또는 다수결 없이 원본 픽셀, 사전 앵커, preflight gate로 셀별 판정
- promotion: 수행하지 않음
- source·preflight·Local·Gemini artifact 수정: 수행하지 않음
- temporaryImagesCommitted: `false`
- commit: 수행하지 않음

## 결론

현행 preflight의 `sample-ready` 6작품은 공식 초반 판본에 결속된 본문 6쪽과 3개 맥락을 모두 충족한다. 그 36개 이미지를 Local root와 Gemini canonical root에서 각각 다시 해시 검증하고 원본 `1280×720` 픽셀로 판독했다. `unknown-ready`인 positions 22, 25, 26, 28은 표본을 보충하거나 낮은 값으로 대체하지 않고 정확히 `U/U/U/U`로 종결했다.

Local과 Gemini가 합의한 29셀은 원본 픽셀 및 gate와 대조해 유지했다. 서로 달랐던 11셀은 독립 픽셀 판독으로 해소했다. 최종 벡터는 다음과 같다.

| Pos | Work | artRealism | artDensity | visualSoftness | motionImpact |
| --: | --- | --: | --: | --: | ---: |
| 21 | 娚の一生 | 2 | 2 | 4 | U |
| 22 | リューシカ・リューシカ | U | U | U | U |
| 23 | 千年万年りんごの子 | 2 | 2 | 3 | U |
| 24 | 百舌谷さん逆上する | 2 | 3 | 2 | U |
| 25 | 天にひびき | U | U | U | U |
| 26 | クジラの子らは砂上に歌う | U | U | U | U |
| 27 | 女王の花 | 2 | 3 | 4 | 2 |
| 28 | 血潜り林檎と金魚鉢男 | U | U | U | U |
| 29 | 鉄楽レトラ | 2 | 2 | 2 | U |
| 30 | ジョジョリオン | 3 | 4 | 0 | 2 |

`U`는 낮은 값이나 blocker가 아니라 근거 기준에 따라 닫힌 terminal `unknown`이다.

## 입력과 실행 결속

| Input | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| `frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| `art-preflight/chunk-03/preflight.csv` | `8379215c7c1ddcde7c4d3bfe2848b974a2200f5a95b5c7758e6778b9436f38f0` |
| `art-preflight/chunk-03/ledger.md` | `ecda6c82f9b90e95354c7ed28c8234ecd774bf80ddacafef8c1ea45ddc60413c` |
| `reviews/daybreak-art-preflight-qa-chunk-03-round-3.md` | `70c26ee3952595ca74e2041ecc85349e3e63c6f08daf8f0b16db4f4e3e5dd05d` |
| `art-review/chunk-03/local-art.csv` | `35a0e73473057594d2b0fe691d6591124b4ad6bf0a566eef79ac5dd29e972665` |
| `art-review/chunk-03/local-codex.md` | `9ede6812f0a65572076b17f50970becbfa190750614377cd2c4e1c3755108803` |
| `art-review/chunk-03/gemini-request.md` | `51fc3f2c5cbe9d4049552c9c845c4e44a19b98afb952519d3205b980fac46a21` |
| `art-review/chunk-03/gemini-payload-files.sha256` | `e8e47da8de3a5a7e22a46bd2c027444722cba187ae54d66428df27c88724b150` |
| `art-review/chunk-03/gemini-payload-ledger.md` | `3605a5bc0962d019934e7dd77ddd0d71bc9e4abf9b53a798e3c2227c449145ea` |
| `art-review/chunk-03/gemini-root-identity.json` | `793228f2e76a487c534d5f74c6e9e51c59ddbf5abf313796f13e37728b4de610` |
| `art-review/chunk-03/gemini-execution-ledger.md` | `a1c71590c75b2b3d8a9204f8bdcb55e624e21801b87a1d1144f9ed970e9b7da6` |
| `art-review/chunk-03/gemini-response.md` | `127d2c28acb2069210d396b8a696726ce67fda6d098d33c5297f21217be9bbcd` |
| `art-review/chunk-03/final-art.csv` | `be73736121f53fd0286ee8cf334776f507f00bb8a40c3c007f8a1b6baec35f8d` |

Candidate SHA는 manifest의 `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`와 일치한다. Gemini canonical uncompressed root는 `/tmp/konocomics-batch005-gemini-art03.16ZXVH`이고 payload identity는 `e8e47da8de3a5a7e22a46bd2c027444722cba187ae54d66428df27c88724b150`이다.

## 36/36 원본 픽셀·해시 검증

`sha256sum -c`를 Gemini canonical root에서 실행해 payload 47파일 전부가 일치했다(`47/47`, 실패 0). 그중 이미지 36개는 모두 `1280×720`이었다. Local temporary root의 동일 selected ref도 다시 계산해 `36/36`, 실패 0으로 일치했다. 두 root가 공유하는 preflight 순서의 정확한 이미지 결속은 다음과 같다.

- 21 娚の一生: `04=929fd481fb2d278e43cc6a1039277dd64e207e2a0ce4083e3e1210c65dc543e5`; `05=9c0f95ba69797435776e64c9a2866bed3210c050b6b783cf549d832254b18c0e`; `06=9b42d6b2a50cb466796fc7ab4489ab3d4f40f134ef0710251ca2a4e57fb0a8b9`; `07=df4866e5fd08d70c60fc71c544bfeda4ae8f320a8d1def588aab0dcf64acf408`; `08=ea9475225f62b2cde2b6e301aeb4c3b1874835b301e86eb6c86f8e6ae9b96854`; `09=a4f244ecec2772100240b248e2d14a7227ad6e6ef104a82500cf5e31af38961a`
- 23 千年万年りんごの子: `04=3a04c9585e1f57ce2138c6063dd8f6a9cab93bf7c080b02cb79ac8543940010e`; `05=38d013ba7c534a2c9743b52d1d6203c2e167c60f9808fd279203533d22d8b6df`; `06=f5274e88c63b8851965d73535ee3319c97fa0d697e04819cbc5dea4add230262`; `07=83116f9f697ed0161c5e7fa00b01fc05188c6f0b0107c5df0ece7d89518c808c`; `08=4bd728d88734529152661fe6284ea8937b1e7b75295c49de55945ba44f2f421f`; `09=7623b77ddc003159f9e7aa288c951ca78ec3d72e9532da7ee145a37579ccf5a8`
- 24 百舌谷さん逆上する: `04=92abea8b4aa94fff54f14b89e269a8fa94219f734155430e7c0377f6e9f6e31a`; `05=ecd3cea43191300657310721453aaabb7e7df0131c9f3e760551d09c0f3317df`; `06=7f9d3c98df7fc6877f94c93012c009c9243704eda1cda422673e82417323f5de`; `07=812dc6c6936b3236c4d6c578a48940edad6e2bbd6e0acc977a2f9b00d6f81bf1`; `08=996beb99f07b333619b7db6d6a6d340246663a00cfebd8ca545b70546f516386`; `09=6ffc6d95f2519e28b376dea2953d13b29d49503f077779eff78c0db72bece957`
- 27 女王の花: `04=f283db06cd04d06c3cddab3796c28d7555cc6781bab50e24d7e78be4010cbd28`; `05=1bcda3bbec6ed83d84a853db909b5917fffd187b0f3c96dcfa06075db3d29ad6`; `06=5c81a04abd5a4ae7c7d99f4bdc0efb51b1b353a4569cad89b1773fa5f7e45f4a`; `07=ea775ffa3eb18160919a0986edcf0ff7895d6d26c62b4110a6fed900fc501f28`; `08=2906c7decb5e90e1a0ac674ae6c4f2c91a63b43a61ca18d78ef69761e3d531b2`; `09=7fe5491aaf1ed6d0797625def24cfa41b2d72ef8cd894c8b0d4a94a6f9afa06e`
- 29 鉄楽レトラ: `04=fb313bdddc18d983219c2b78d1eb9180494bdfdc4a2eeb4ad4e90d81ccd4bda3`; `05=a927ae93f9c8b2b529ff5be4c3f7298262126247d4eff8a6ec715c0772da5ab3`; `06=a2cb9e02f813392f5d0ee4b5e0190984b8bd6c90f2503a2bf470aaf45111d4fa`; `07=400ea2e057c5384146fb4f46286c6011ff55198a103dd11d4a981559202eec8f`; `08=2f70f46ab410efbd5c2615e0c765bb20a0fcec4eed5918897fb7d4a357de67a8`; `09=4fff94f5aa17f58ff4abcb4fbd774ecc87c1ca2887896bdcac292e63a937b5af`
- 30 ジョジョリオン: `05=bba491a471d3ce544ec68d68af9e50462d3b14487ebd51cbf7a1c246b8d2730b`; `06=f12ced145bae2595583e2d2471d184f815f3fe7ca23b2e07b28de6a05d6635e1`; `07=b655fa7fe144dd4be99e92b58cb3aeca65a95e83c1eb4dfc310da9b5d1f35682`; `08=9ad26c84852e6eefefe2e12c47f23490ff3c1ab5d731b967cb90f6399e174587`; `09=90155f576f780b31b62f2ac6d938ba333b1d4d259f9165c88093a4e195b9c599`; `10=fbd1bbb44a4371f13cb59c16d8984f9ca3d584054305235f00daf3f233ab940e`

Preflight work/ref 순서의 `workId,ref=sha256` 레코드 결합 SHA-256은 `8d07d536e932f2497270c7ab274778095270154af331d9f3f013aa3c365ea3c2`다.

## 두 모델 증명 검증

### Local Codex

- Local pass는 Gemini나 다른 Art 결론을 보지 않았다고 명시했고 adjudication·promotion을 수행하지 않았다.
- `/tmp/konocomics-batch005-art-chunk03`의 selected 36파일을 원본 `1280×720`로 열었으며 현행 preflight와 `36/36` 해시 일치를 기록했다.
- 정적 값은 6 body pages와 3 contexts를 충족한 6작품에만, motion 값은 preflight가 허용한 positions 27과 30에만 냈다.
- `local-art.csv`는 40행, known 20셀과 unknown 20셀이다.

### Gemini 3.7 Flash High

- 요청 모델 `gemini-3.7-flash-high`, resolved label `Gemini 3.7 Flash High`, effort `high`, mode `plan`을 확인했다.
- authorizing conversation `368f7809-aeb1-4156-bb8d-f2a962906409`은 completion `completed`, outer `SUCCESS`, exit `0`, duration `300.798s`다.
- canonical uncompressed root의 이미지 `36/36`과 frozen input `10/10`을 original pixels로 읽었고 Local 결론은 보지 않았다고 명시했다.
- fallback, timeout, rate-limit, degraded output, truncation, repository mutation이 없었다. 오케스트레이션 표시 한계를 넘은 직접 출력은 같은 conversation의 read-only re-emission으로 완전한 319-line response에 보존됐다.

따라서 두 pass 모두 독립성, exact model/root/input, 정상 종료, 전체 입력 접근, 완결 응답 조건을 충족한다. Cursor Grok은 Art에서 `ART_ABSTAIN`, Muse는 `NOT_USED`로 유지했다.

## 11개 불일치 셀의 픽셀 adjudication

| Pos / Axis | Local | Gemini | Final | 원본 픽셀·사전 앵커 판정 |
| --- | --: | --: | --: | --- |
| 21 `artDensity` | 3 | 2 | **2** | 건축·가구·하천 detail은 선택적이고 portrait/dialogue의 큰 여백이 반복된다. 3개 맥락 전체는 사전의 균형 2에 해당한다. |
| 21 `visualSoftness` | 3 | 4 | **4** | 가는 윤곽, 흐르는 머리, 둥근 얼굴, 옅은 tone, 감정 표현이 domestic·river·family 전부에서 지속된다. 건축선은 극단값을 깨지 않는다. |
| 23 `artRealism` | 3 | 2 | **2** | 의상·방·소품은 관찰됐지만 둥글고 단순화된 얼굴과 folk-tale식 인물이 모든 맥락에 남아 일반적 스타일화다. |
| 23 `artDensity` | 3 | 2 | **2** | tatami·의상·음식 detail과 함께 넓은 흰 여백과 정돈된 panel이 반복되어 정보량은 균형이다. |
| 24 `artDensity` | 4 | 2 | **3** | classroom·assembly·gag는 figure·text·effect가 분명히 2보다 높지만 hallway·portrait·library에는 열린 면이 있어 4가 아니다. 두 앵커 사이 3을 직접 판정했다. |
| 24 `visualSoftness` | 1 | 2 | **2** | rage gag의 각진 효과와 별개로 calm school scene의 둥근 인물·깨끗한 얼굴·중립 윤곽이 반복된다. 한 action page가 전체를 거친 쪽으로 지배하지 않는다. |
| 27 `artDensity` | 2 | 3 | **3** | capital panorama, palace·stonework, robe, map, 다중 panel의 고정보량이 2보다 높고 큰 portrait 여백 때문에 4에는 못 미친다. |
| 29 `visualSoftness` | 3 | 2 | **2** | 미세한 얼굴 tone과 gradient는 있으나 날카로운 머리, 검은 면, crisp contour, urban geometry가 계속 맞서 전체는 중립이다. |
| 30 `artRealism` | 4 | 3 | **3** | anatomy·hand·terrain·architecture는 현실 지향이지만 dramatic proportion, eye, pose, fashion의 강한 작가 스타일이 계속 보여 4는 아니다. |
| 30 `visualSoftness` | 1 | 0 | **0** | chiseled face, hard contour, angular pose, cross-hatching, jagged rubble·fault가 character·urban·geological 세 맥락 모두를 지배한다. polished draftsmanship은 사전의 거칠고 각진 0을 중립으로 만들지 않는다. |
| 30 `motionImpact` | 3 | 2 | **2** | 한 spread의 stumble→fall/collision→fallen pause/crouched recovery는 완결됐지만 속도·타격 강조가 보통이며 지속적 above-normal action은 아니다. |

## 모든 0/4 극단값 감사

두 proposal 또는 final에 등장한 Art 0/4를 전부 다음처럼 감사했다.

| Pos / Axis | 제안 | Final | 감사 결과 |
| --- | --- | ---: | --- |
| 21 `visualSoftness` | Gemini 4 | **4** | domestic, river, family 세 맥락 모두 fine·rounded·delicate treatment가 지속되어 유지. |
| 24 `artDensity` | Local 4 | **3** | crowding은 강하지만 hallway·portrait·library의 열린 면 때문에 high-density endpoint를 거부. |
| 27 `visualSoftness` | Local/Gemini 4 | **4** | court, chase, confrontation 모두 luminous eyes, flowing hair, fine contour, soft tone이 지속되어 유지. |
| 30 `artRealism` | Local 4 | **3** | highly observed anatomy/environment와 반복되는 강한 deformation이 공존하므로 realistic endpoint를 거부. |
| 30 `artDensity` | Local/Gemini 4 | **4** | rubble, maps, architecture, fault panorama, hatching이 모든 맥락에서 high-density endpoint를 충족. |
| 30 `visualSoftness` | Gemini 0 | **0** | character, urban, geological 맥락 전부가 rough/angular anchor를 직접 충족하므로 유지. |

최종 0은 1셀, 최종 4는 3셀이다. 중간값을 피하려고 극단을 낮추거나, 극단을 맞추려고 context 예외를 무시하지 않았다.

## motion endpoint 감사

### Position 27 — `reader-step-05→06→07`, final `2`

- start: 05의 도주와 추격
- development/impact: 06의 성벽 leap·descent, speed lines, 착지
- resolved endpoint: 07의 crouch·turn과 confrontation 정지

연속성과 endpoint는 충족하지만 타격 강조는 보통이다. Local/Gemini의 2 합의를 픽셀로 재확인했다.

### Position 30 — `reader-step-05` 내부, final `2`

- start: 경사 rubble에서 발을 헛디딤
- development/impact: fall과 dirt/rock collision
- resolved endpoint: 쓰러진 정지, 호흡, 관찰, crouched recovery

완전한 compact sequence지만 한 spread의 보통 강도다. Local 3은 거부하고 Gemini 2와 같은 값을 독립 판정했다. Positions 21, 23, 24, 29는 `motionGateAttemptable=false`, unknown-ready 네 작품은 표본 자체가 없으므로 motion은 모두 unknown이다.

## 출력 계수와 무결성

- works: `10`
- axes per work: `4`
- `final-art.csv`: header 1 + data rows `40`, columns `8`
- known cells: `20`
- unknown cells: `20`
- notApplicable cells: `0`
- unknown-ready 작품의 unknown cells: `16/16`
- sample-ready에서 motion gate가 닫힌 unknown cells: `4/4`
- Local/Gemini agreements rechecked: `29`
- Local/Gemini disagreements adjudicated: `11`
- unresolved Art disagreements: `0`
- reviewedByHuman: `false`
- Art sample shortage를 promotion blocker로 변환: `0`
- source·promotion·catalog·code mutation: 없음

이 결과는 Art 상태를 terminal known 또는 terminal unknown으로만 종결하며 coverage를 채우기 위한 추정값을 추가하지 않는다.
