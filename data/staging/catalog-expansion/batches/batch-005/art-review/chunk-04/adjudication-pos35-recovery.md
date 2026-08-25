# Batch 005 Art recovery final QA — chunk 04 position 35

- adjudicationDate: `2026-08-25`
- adjudicator: Daybreak independent original-pixel adjudication
- scope: frozen Batch 005 position `35`, `work-8a7846af8ead1797e6a2`, `ハイスコアガール`
- reviewedByHuman: `false`
- judged axes: static `artRealism`, `artDensity`, `visualSoftness` only
- decision rule: Local/Gemini 값을 평균하거나 다수결하지 않고 원본 픽셀과 Factor Dictionary `0 / 2 / 4` 앵커로 축별 판정
- `motionImpact`: 재판정하지 않고 기존 aggregate 행을 정확히 보존
- Grok: `ART_ABSTAIN`
- Muse: `NOT_USED`
- source/generated/promotion/image mutation: 수행하지 않음

## 결론

교정된 공식 제2화 BODY 6쪽을 모두 원본 `870 × 1236` 픽셀로 다시 열었다. 최종 정적 벡터는 `artRealism=1`, `artDensity=2`, `visualSoftness=1`이다. 기존 `motionImpact=known 4 / confidence 0.93 / reader-page-010` 행은 근거·문구를 포함해 byte-for-byte 보존했다.

세 불일치는 각각 사전 앵커와 반복 evidence로 해소했다. Realism은 강한 얼굴·인체 변형이 지속되지만 비례가 잡힌 소녀, 손·의복·상점·기계가 모든 맥락에 반복돼 0 endpoint에 머물지 않으므로 1이다. Density는 상세한 상점·기계 panel과 큰 하늘·바닥·tone·portrait 면이 반복적으로 상쇄돼 balanced 2다. Softness는 거친 caricature가 우세하지만 매 페이지 반복되는 소녀의 둥근 얼굴·섬세한 눈·매끈한 머리 표현 때문에 0 endpoint가 지속되지 않아 1이다.

## Preflight와 원본 결속

독립 preflight QA의 `PASS — SAMPLE_READY`를 재확인했다. Recovery preflight는 readable BODY `6`, distinct contexts `2`, `staticGateAttemptable=true`, `motionGateAttemptable=false`이고, exact official ref/hash mapping은 현재 packet bytes와 `6/6` 일치한다.

| Ref | SHA-256 | 원본 픽셀 독립 관찰 |
| --- | --- | --- |
| `reader-his02-p002` | `0161e58893499257746ad7bd1cba7e6e07d7591711e3edd406044e176c3c4966` | 비례가 잡힌 소녀와 단순화된 소년, 의복 tone, 하늘·전선·수목, 선과 질감이 촘촘한 상점 전경이 공존한다. |
| `reader-his02-p003` | `a5c3d1c83994934c193101fd0d10d676a462a48d28bda4421b65069349da803f` | cabinet·joystick·button·손의 구체적 구조와 큰 흰 대화 면, 극단적으로 변형된 눈·입·얼굴이 함께 관찰된다. |
| `reader-his02-p004` | `6ec72f8e4fcb9c0ab0ffec6b2f0b13176210e71b3b355486e01a61c95155d487` | 소녀의 섬세한 눈·매끈한 머리와 소년의 찌그러진 얼굴·과장된 입, 열린 바닥·하늘과 cabinet fragment가 대비된다. |
| `reader-his02-p005` | `112acb66d9bf6b5f8f9842982ced40fc5f90836127522d98312e8716927f61b5` | control diagram, 단순화된 kick figure, 거친 표정·효과선과 넓은 tone·흰 면, 정돈된 소녀 전신이 한 페이지에 공존한다. |
| `reader-his02-p006` | `44de76624bfaf4c4421794c8d670693d2ec5f8c1a2d4fe21c8861a09d26fbb9f` | 선반·counter·상품·기계·출입구 정보가 높지만 큰 얼굴·대화 panel도 반복되고 노인과 소년은 강하게 caricature됐다. |
| `reader-his02-p007` | `aee2737299e01a69175e69d013b95f82589aac058cd67f8ace6cca05dbd72de2` | 큰 소녀 portrait의 둥근 모델링·손·의복·머리 highlight와 열린 길바닥, 단순화된 소년들, 배경 수목·전선이 공존한다. |

모든 파일은 baseline RGB JPEG `870 × 1236`이고, packet SHA는 corrected preflight CSV·ledger·Daybreak QA·Gemini payload manifest의 exact mapping과 일치한다.

## 세 disagreement의 독립 adjudication

| Axis | Gemini | Local | Final | 사전·원본 evidence 판정 |
| --- | ---: | ---: | ---: | --- |
| `artRealism` | 0 | 1 | **1** | Gemini의 강한 deformation 관찰은 맞지만 p002–p007 전반의 비례가 잡힌 소녀, 손·의복, 상점 원근, cabinet 구조가 0 endpoint를 반복적으로 깨뜨린다. 반대로 소년·노인·diagram figure의 확대·압축·grotesque deformation이 일반적 스타일화 2를 막으므로 0과 2 사이의 1이다. |
| `artDensity` | 2 | 3 | **2** | Local이 든 상점·선반·arcade hardware·수목·hatching은 실제로 반복된다. 그러나 p003–p007의 큰 흰 대화 면, flat tone, 열린 하늘·길바닥, 생략 배경, sparse portrait도 같은 빈도로 반복되어 above-balanced 3이 지속되지 않는다. 표본 전체의 직접 앵커는 balanced 2다. |
| `visualSoftness` | 0 | 1 | **1** | Gemini가 든 jagged expression·scratchy hatching·hard black·sharp effect는 우세하다. 다만 p002–p007 모두에 소녀의 둥근 얼굴, fine eye, smooth hair highlight, clean garment contour가 반복돼 rough 0 endpoint가 지속되지 않는다. 거친 처리가 neutral 2에는 너무 강하므로 중간 1이다. |

세 값은 모델 값의 산술 중간이나 투표 결과가 아니다. 각 축에서 endpoint를 깨뜨리는 반복 counter-evidence를 직접 확인해 판정했다. 최종 0/4 static endpoint와 unresolved disagreement는 없다.

## Local/Gemini provenance 검증

| Artifact | SHA-256 | 결과 |
| --- | --- | --- |
| Factor Dictionary | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | match |
| Batch manifest | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | match |
| frozen work set | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | position 35 identity match |
| recovery preflight CSV | `976c4a6dc54470b6fdfc56dd23dd16a8161200f9599a0d88a940e915a13db79b` | match |
| recovery ledger | `967fa34a1babc9f4ae987d386973db4084bb74bebaf7ed918d537e91856d8d51` | match |
| independent PASS preflight QA | `84c3212b366c6882896b1703d267ad05489273f3bfba112544de8e4ab2eb1156` | match |
| Local static proposal | `932b83a57b4f16c8e97320b526f9bfd5936984598f769f92aeba42b59ca1179f` | exact three rows `1 / 3 / 1` |
| Local report | `de3e26842d10b85d86ba410df1630585e7cc90ecba385dfe5519b3e92fb9c650` | independent `6/6` original-pixel record |
| Gemini request | `2637b727e83f402413ab3c3daff449e5db41e80769e7d934758bdd351cab5143` | match root identity and exact root |
| Gemini response | `3bf826a5aac8c2280940382df6e31a79c486f4d8693a8a6be7783586eb194d71` | complete static rows `0 / 2 / 0` |
| Gemini payload manifest | `ec56221a2e3c47d0cadb9107f1473aab9a26a5f636662ef7214469aefa493e6c` | canonical-root files `12/12` match |
| Gemini payload ledger | `85b851e8c52e9b85e43a24ef7043028f1cb8e88900f76f0cc311663c135a52c7` | exact root and count match |
| Gemini execution ledger | `e851f269d9de0c339e4fd262c580c038fcacb1b9f872171ad081e9b0ab15a657` | completed / SUCCESS |
| Gemini root identity artifact | `a0a11d1c5b8f9c413d54bb1ee7e3f9a70b031fe8110be4c0602aa5be545f793b` | embedded request/response/manifest/ledger hashes match |

Gemini exact root는 `/tmp/konocomics-batch005-gemini-art04-pos35.Peqx6H`이고 canonical uncompressed payload `12/12`가 `sha256sum -c`를 통과했다. Exact root의 request와 response SHA는 repository artifacts 및 Gemini root identity와 일치하며, payload의 preflight root identity SHA는 `d54f35f6a1038c5c921f895522fe1be6cade3a0ddf23645929655a0bfa82c733`로 manifest와 일치한다.

Execution ledger와 complete response의 literal provenance는 `model=gemini-3.7-flash-high`, effort `high`, `completionStatus=completed`, outer `SUCCESS`, `openedOriginalPixels=6/6`, `reviewedByHuman=false`, `Grok=ART_ABSTAIN`, `Muse=NOT_USED`로 서로 일치한다. Local과 Gemini 모두 세 정적 축만 제안했고 recovery packet에서 motion을 판단하지 않았다.

## Motion 보존과 출력 무결성

Recovery final `final-art-pos35-recovery.csv`는 세 정적 known 행만 포함한다. Aggregate patch는 position 35의 contiguous four-row block만 교체하며, 새 정적 세 행 뒤에 기존 motion 행을 정확히 재사용했다.

- recovery final data rows: `3`, values `1 / 2 / 1`, axis order exact
- recovery final SHA-256: `c3f58151c27c6d2e4476edf4a81c5c2e64ddcbfd45add59fc66987067dc65024`
- aggregate before SHA-256: `b93020f3f1bdbc0aad0adbc2efe9cd9254e7ecb8b678dc7bcc519dbfe60fe346`
- aggregate after SHA-256: `2a130c5991569f542e670693c95f5f3d56699c06f042780c5c02fc390a4ca84e`
- aggregate parse: data rows `40`, works `10`, exactly four ordered axes per work
- reconstructed pre-patch bytes from the replaced four-row block: before SHA exact match
- preserved motion row: `motionImpact,known,4,0.93,reader-page-010` with exact prior observation and limitation
- changed aggregate scope: position 35 four-row block only; only the three static rows differ in content
- reviewedByHuman: `false`

Source, generated catalog, promotion registry, batch ledger, text adjudication, image packet, preflight, Local, Gemini, and existing chunk-level adjudication artifacts were not modified.
