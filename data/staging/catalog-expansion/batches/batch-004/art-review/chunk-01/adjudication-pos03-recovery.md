# Batch 004 Art recovery 독립 adjudication — chunk 01 position 3

- adjudicationDate: `2026-08-25`
- adjudicator: Daybreak independent original-pixel adjudication
- reviewedByHuman: `false`
- workId: `work-0f3a44f5dcab9623d1be`
- canonicalTitle: `応天の門`
- scope: 교정된 공식 제1화 BODY 6쪽에 대한 Factor Dictionary Art 4축
- decision rule: Local과 exact Gemini 값을 평균하거나 투표하지 않고, preflight gate와 원본 픽셀 및 0·2·4 앵커로 직접 판정
- Cursor Grok Art: `ART_ABSTAIN`
- Muse: `NOT_USED`
- promotion: 수행하지 않음
- temporaryImagesCommitted: `false`

## 결론

최종 벡터는 `artRealism=3 / artDensity=3 / visualSoftness=1 / motionImpact=unknown`이다. Local과 Gemini가 합의한 realism·density는 원본에서 다시 확인됐다. `visualSoftness` 충돌은 각진 얼굴과 눈, 하드 블랙, 거친 동작 해칭, 날카로운 건축 윤곽이 네 장면 맥락 전반에서 반복되므로 Local의 `1`을 채택했다. 머리카락·관복의 정돈된 세부선은 완전한 거침 `0`을 막지만, Gemini가 제안한 부드럽고 미려한 쪽 `3`을 지배적으로 만들지는 않는다.

`motionGateAttemptable=false`다. 간격을 둔 페이지에 달리기와 이동 조각은 있으나 하나의 동작을 시작→전개→충격→종결까지 정확한 연속 ref로 고정하지 못하므로 `motionImpact`는 값과 confidence가 빈 `unknown`으로 종결된다. Gemini 원문이 unknown confidence에 쓴 `0.0`은 원문을 수정하지 않고 최종 CSV에서 빈 값으로 정규화했다.

| Axis             | Local | Exact Gemini | Final | 원본·사전 앵커 판정                                                                                                  |
| ---------------- | ----: | -----------: | ----: | -------------------------------------------------------------------------------------------------------------------- |
| `artRealism`     |     3 |            3 | **3** | 성인 인체·관복·말·건축·공간 원근이 일반적 스타일화보다 현실 쪽이지만 얼굴·표정·동작의 만화적 변형 때문에 4는 아니다. |
| `artDensity`     |     3 |            3 | **3** | 도시 조감·기와·격자·복식·톤·해칭의 정보가 반복돼 2보다 높지만 대화 클로즈업의 넓은 여백 때문에 4는 아니다.           |
| `visualSoftness` |     1 |            3 | **1** | 각진 얼굴, 날카로운 눈·머리, 하드 블랙과 거친 해칭이 반복돼 중립 2보다 거칠다. 정돈된 선과 톤 때문에 0은 아니다.     |
| `motionImpact`   |     U |            U | **U** | exact bounded sequence가 없어 수치 판정 불가다. `unknown`은 낮은 값이 아니다.                                        |

## 입력 결속

| Input                                                  | SHA-256                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/factors/factor-dictionary.md`                    | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md`                     | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `frozen-work-set.csv`                                  | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| `recovery-pos03-preflight.csv`                         | `01e7a7c7c80e6d9dc552e190caff3846352d0bef010bc6846233d31fb2f33da8` |
| `recovery-pos03-ledger.md`                             | `e50216651b98700395a61224ea8318e0c19f0c38192df95d4e56c234a047c54d` |
| `daybreak-art-preflight-qa-chunk-01-pos03-recovery.md` | `953456c5fbf70bc33a147a574c09f7caf952f13c59028d626a4046dd750bb56c` |
| `recovery-pos03-input-manifest.md`                     | `7b1761bf1f9502070ca6bcc4ec14114943e73e6aac389af3c0b7b8f1f9d356cc` |
| `local-art-pos03-recovery.csv`                         | `3a99bd67c6d5c9c6a59c6083e3d0072dbf608d551cad36d171dc8209aa8c9a7f` |
| `local-codex-pos03-recovery.md`                        | `b75f53381cbe29afe57f3cbef3c24c799931242b0eefec4029386f398f189ae4` |
| `gemini-request-pos03-recovery.md`                     | `fe0d6c0b78ce2c2425988ad90a5cce1a9697653ab7b4974906ca096d32b27e7e` |
| `gemini-payload-files-pos03-recovery.sha256`           | `a31680d0f959ad0a75040861f6517e8465fccd303dea24f5e520d2c8303e5857` |
| `gemini-root-identity-pos03-recovery.json`             | `1981ff0a4369bc9704ea338e296b1e8246fc0df04b48f47e5fc25fe8657d7f9d` |
| `gemini-execution-ledger-pos03-recovery.md`            | `6a611fcffbcfdb97c3cb6e1380a14f3354eab49f86a7e3689e56cde34f59058a` |
| `gemini-response-pos03-recovery.md`                    | `123349c4c9dedbbd608576267367c3b3caab7d7c1e04d782737d4b52d9a289bd` |

Gemini 실행은 exact `gemini-3.7-flash-high`, effort `high`, read-only plan mode이며 canonical uncompressed root `/tmp/konocomics-batch004-gemini-art01-pos03.S3UNgP`를 사용했다. root의 `payload-files.sha256`을 다시 검산해 context 5개와 원본 이미지 6개, 총 `11/11`이 일치했다. request·response·root identity는 보존본과 byte-identical이며 실행은 exit code `0`, completion `completed`, 원본 픽셀 접근 `6/6`이다. fallback·timeout·rate-limit·degraded output·repository mutation은 기록되지 않았다.

## 원본 픽셀과 page 663 제외 검증

6개 retained JPEG를 `985×1400` 원본 detail로 모두 다시 열었고 hash가 preflight와 일치했다.

| Ref               | SHA-256                                                            | 독립 확인                                       |
| ----------------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| `kurage-page-666` | `641c81e47c48f60f0436bc25f77e03721f15c594df11dbd4ca4c760731e6eeab` | 야외 이동·도시 조감, 하드 블랙과 거친 이동 해칭 |
| `kurage-page-674` | `d9384fe969953f9f76bc31f3b28dea48066937db68a0874417d0c97e4076a189` | 문턱 대면, 우차·기와·인물 얼굴과 관복           |
| `kurage-page-682` | `13d4a9e45e079a502bc4748bf5035bc9ded984a5f53b32a2ba9ab57db7eb8974` | 평안경 건축·경로 설명과 반복되는 지붕·격자 원근 |
| `kurage-page-690` | `479a89dbe21d157b7c87b35dbfca17501e12f7432d5d2b33acd79f09556e3b7d` | 복수 인물 문답, 격자·복식·각진 얼굴·정원 질감   |
| `kurage-page-698` | `1ae0f8b5745d9efff18df749280f4c90a79a36498a79c2dadb2a014e764b3e4d` | 관복 인물 대화, 날카로운 눈과 넓은 대화 여백    |
| `kurage-page-703` | `6ddb6b65c143e69ccd1b5f579b6572c943181248a50444e3a838e8ad57d8ae13` | 근접 문답, 정확한 신체·소품과 단단한 윤곽       |

별도 보존된 `kurage-page-663`도 열어 `第一話`를 명시한 chapter opening임을 확인했고 SHA-256은 `f204f5239e1add475af9ac10b1617f39ff65257fc2986e5849c6a7c4b12ac768`이다. 이 페이지의 옅고 회화적인 표현은 retained Art 표본과 최종 값에서 완전히 제외했다. 표지·광고·애니메이션·줄거리·Genre·리뷰도 사용하지 않았다.

## 출력 무결성

- `final-art-pos03-recovery.csv`: header 1 + data rows `4`, SHA-256 `213e461022fa551ffa0b4107490c7c6563b8331d1deb4fdcff3e68d248958ea2`
- aggregate `final-art.csv`: header 1 + data rows `40`, SHA-256 `2c21e11ff0e8bcfc3f8751760db8653a300eba5d092e6191c4a9411eb37b0c45`
- aggregate row order: 보존
- aggregate 변경 범위: position 3의 기존 unknown 4행만 교체
- final known cells: `3`; final unknown cells: `1`; unresolved Art conflicts: `0`
- reviewedByHuman: `false`
- Cursor Grok: `ART_ABSTAIN`
- Muse: `NOT_USED`
- text·source·generated·promotion 파일 변경: 없음

이 adjudication은 교정된 Art 상태만 종결한다. Art 표본 부족을 blocker로 바꾸거나 추천 승격을 수행하지 않는다.
