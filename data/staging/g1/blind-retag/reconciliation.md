# G1 블라인드 재태깅 조정 기록

## 범위

이 기록은 G1 이전 블라인드 재태깅 체크포인트다. G1, G2, UI 구현 승인이 아니다. 조정 산출물을 동결하기 전까지 기존 catalog label과 추천 결과를 열지 않았다.

## 고정 입력

- `input.md`: `331a2f007603cf9b46e4002b004f0f131c4a6a7a60c5c573e706f41015f3fa2c`
- `sample-manifest.json`: `05e31a288edaf11fb5cf7872537c56a9154e09516864674c90c2a2cc02b21658`
- `factor-dictionary.md`: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`

## 독립 출력

### A — Gemini 3.6 Flash High

`agy -p`의 `gemini-3.6-flash-high` 고추론 실행이다. 작업공간은 두 고정 입력으로 시작했다. 실행 중 정확한 허용 URL에서 파생된 helper와 HTML/text cache를 만들었다. orchestrator는 `notes.md`의 여분 마지막 LF 하나를 제거하고 Bocchi 허용 URL의 잘못 복사된 문자 하나만 입력 문자열로 복원했다. 의미 필드와 근거 문장은 바꾸지 않았다. 따라서 A의 문자상 격리 선언은 “두 고정 입력 외에 미리 존재하던 로컬 의미 자료를 읽지 않았다”로 한정하며, 이 공개 기록이 선언을 대체한다. GPT-5.6 Pro Oracle은 이 공개 사항을 검토하고 A 사용을 GO로 판정했다.

- `factors.csv`: `0ced91cab95116d5030bf177cb63e00ca686a93e2c889a45f53d9cdf93554ac0`
- `genres.csv`: `26fd11b9f6172fcd3758e9df7330f827249d80835f51205dce2abcb2f6f74111`
- 정규화된 `notes.md`: `5ff5238f41005a63c5e814d6dbb34730e2cc24652a58d3a6d0ba02c489fb8966`
- `themes.csv`: `38c9e4fa307a200be723995f1f155b6966d68c9bc50738b603f99f10333f01d0`

### B — Grok 4.5 High

비-fast `agent -p --model cursor-grok-4.5-high --sandbox enabled --force --trust` 실행이다. 작업공간에는 두 고정 입력과 네 출력만 있으며 normalization 없이 validator를 통과했다.

- `factors.csv`: `f7ea1400a95b329be52ca1768ff6f1cb7efb7ae4f00dcf24acfe5f62814e0fe2`
- `genres.csv`: `2f42d7ac1581a8f519ebd5e43a292a14043ee923b095306a4ba7fdb86f2490d1`
- `notes.md`: `d4fb0d1af27a6d8dc3c4f5ec000e78c3c391c3cd56acc5233be314e1a9b67c61`
- `themes.csv`: `286c31282ba25f6b8c3b5621dbe71a73824bda6061cae53cdbf2291a873da6b6`

## Oracle 판정

- Chat: <https://chatgpt.com/c/6a7a6f34-c3f8-83e8-af26-c6d7476f0f01>
- Model: GPT-5.6 Pro
- 요청: `blind-retag-rerun-oracle-request.md`, SHA-256 `711c7efa932ba90e419bd4864136b0ede6f06692389ed496ff0ef935f276a0a6`
- 업로드 bundle 영수증: SHA-256 `63d1e77e35934a75fe0bf081694dcf8b78adc83398c87727ac502cd8c42e1bcc` (중복 bundle bytes는 저장소에 보존하지 않음)
- 응답: `blind-retag-rerun-oracle-response.txt`, trailing whitespace 제거 및 final LF 1개로 보존, SHA-256 `b6b98cd3fe6e1ed5fe92e17bbbad2bb3fda154d5c0d088b9ed7057dab216946d`
- 판정: Output A admissibility GO, conservative reconciliation GO.

## 적용 규칙

1. state 불일치는 `unknown`.
2. value 불일치는 `unknown`.
3. 한 모델에만 있는 Genre/Theme은 생략.
4. Theme centrality 불일치는 생략.
5. ordinal value와 confidence는 평균하지 않음.
6. 직접 근거가 있는 동일 value만 유지하고 confidence는 더 낮은 값을 사용.
7. 동일 판단이어도 허용된 entry-scope 근거가 부족하면 폐기.
8. Oracle의 명시 예외가 generic 교집합보다 우선.
9. Art 36행은 모두 `unknown`.

## 동결 산출물

- `reconciled/factors.csv`: header + 153행, known 11행, SHA-256 `8ee2e1d4b0e319ae464f9c2049cd4030891c28fc65853d341896913ebe308953`
- `reconciled/genres.csv`: header + 9행, SHA-256 `644cac39e1243b8971c8a0e718fb85032f735465534b96e1bc5ab075234d05bd`
- `reconciled/themes.csv`: header + 11행, SHA-256 `59556a4f5d31523faffd4192452738fe2214e45145a6e6750fa61e7a1d89d923`

`output-a/notes.md`와 `output-b/notes.md`의 격리 선언은 각 annotation run에만 적용된다. 특히 A의 문구는 위의 controlling disclosure로 한정·대체된다. 조정자는 A/B/Oracle을 읽었으므로 `reconciled/`에는 그 선언을 복제하지 않았다. 새 validator mode나 helper는 추가하지 않았다. 일회성 검사에서 기존 `factorSourceRowSchema`, `themeSourceRowSchema`, `AXIS_IDS`, `GENRE_TAGS`, `THEME_TAGS`로 153 factors(known 11), 9 Genre rows, 11 Theme rows와 canonical order를 확인했다.
