# G2 제품 방향 독립 패널 Cycle 1 종료 보고

## 결론

Cycle 1의 제품 방향 판정은 **REVISE**다. Local의 유효한 `REVISE` 한 표로 이 동결 cycle은 비승인으로 종료한다. Gemini, Grok, Oracle의 `GO`는 각각의 독립 행으로 보존하지만, 4/4 유효하고 조건 없는 `GO`가 아니므로 G2와 Slice 5를 승인하지 않는다.

동결 identity는 branch `agent/promote-approved-catalog`의 HEAD `0382c60c32a4eee32a3333149a3a746d96d1d0d7`, tree `511fcfa3c6277ce31e6aae479ff4ab0146087be9`, catalog `v1-83f85ca42c87`이다. 검토 ZIP SHA-256은 `523bc95f4c1dcdd6439d3791d66053ccabb0b1c44fa962f7e18fc81f51ed7f3e`이며, 173개 payload와 자기 제외 ledger로 동결됐다.

## 응답 identity

- request SHA-256: `0a4e061814bbc03d48ea357cb42aa853d35812ced8a20001b88323f2ca6a1805`
- Local response SHA-256: `7e23c4d617e27ca61fb92408f1d8c4c917fdd62564a8000532edf5ef6c23cd7b`
- Local validity SHA-256: `623c768ea0b71161e9dc536954a2edaa624c92df7df18e0aa6fe0bdea4ce31b7`
- Gemini response SHA-256: `45790954ec38fff317b74e1ca7b558b9fa2d0a258ea2d2a059ca94e58a244474`
- Gemini validity SHA-256: `724211e22f03bfe6019b574cbcc63039af0d9158438cd73ae384d4a471ab4dac`
- Grok raw response SHA-256: `249fd3ff281b9255bff28be3dfcd10fb6ea0d3fd8efe755fac14bf3b420d80f5`
- Grok stored response SHA-256: `ccaafcb08f141e01ca28da4b403682a2c7cbe52d92b61d6e2a1c291082b1e7d0` (원본 2,304 bytes 뒤에 terminal LF 하나만 추가)
- Grok validity SHA-256: `878b9bc938e3e1800bac5504bb8d481c0cc5e65b6898fbe14dda42459584260a`
- Oracle response SHA-256: `ebd19e228bde88737f2bf9efbf12037294eae9b01711369119b30392a975a979`
- Oracle validity SHA-256: `a712f1e1dd2c6d70f93d6a53ec0709d3124de158b0657620a5d213f6b21f1220`

## 검토 경로

| 경로                          | 실행 및 유효성                                                             | 판정   | 패널 효력                                                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Local                         | ZIP 173/173, 규범·구현·카탈로그·브라우저 파일럿·권위 집계 결과를 직접 검사 | REVISE | 유효한 비승인                                                                                                                   |
| Gemini 3.6 Flash High         | 격리 workspace에서 ZIP 173/173과 필수 증거를 검사; validity `VALID`        | GO     | 유효한 단일 승인 표                                                                                                             |
| Cursor Grok 4.6 High non-fast | `agent -p` 격리 실행, 전체 ZIP·소스·스크린샷을 검사; validity `VALID`      | GO     | 유효한 단일 승인 표                                                                                                             |
| GPT-5.6 Pro Oracle            | ChatGPT.com의 단일 ZIP/단일 응답, 모델·첨부·종료 상태·형식은 확인          | GO     | `VALID_WITH_ACTIVITY_TRACE_LIMIT`; 173개 재계산·스크린샷·전수 읽기·성공 browser replay의 완전한 activity trace는 독립 확인 불가 |

Oracle의 제한은 해당 행의 제품 판단을 다시 판정하는 것이 아니다. 정확한 첨부·모델·턴·완료 상태·응답 형식은 유효하지만, 보존된 ChatGPT activity resources만으로 모든 검사 주장을 완전하게 재현할 수 없다는 실행 관측 한계다. Oracle 한 행은 전체 G2나 Slice 5를 단독 승인하지 않는다.

## 차단 결함

파일럿 프로필은 Axis `comedy`를 `less`로 요청한다. `promised-neverland`, `vinland-saga`, `vagabond`의 `comedy=0`은 그 낮은 선호와 일치해 양의 adjustment가 되지만, 실제 Taste 10개 중 해당 3개의 일본어 설명은 모두 `「ギャグ・コメディ」があなたの好みに合う作品です。`라고 표시됐다.

점수 방향은 맞지만 설명이 낮음·부재가 맞는다는 방향을 잃어, 사용자가 코미디 존재 자체를 선호한다고 읽을 수 있다. 실제 제품 표면 10개 중 3개가 명시적 역방향 선호를 모호하게 설명하므로 핵심 설명가능성 계약을 충족하지 못한다. 이 결함은 hash·테스트·집계 실패가 아니라 제품 의미의 차단 결함이다.

## Cycle 2 최소 완전 수정 범위

1. 제품 사양의 contribution-grounded 설명 계약에 Axis 선호 방향을 명시한다.
2. 추천 contribution에서 `higher` / `lower` 방향을 보존하고, Axis adjustment에서 방향이 없거나 비-Axis 근거에 방향이 섞이면 설명을 fail-closed 처리한다.
3. `lower` 양의 adjustment는 낮거나 절제된 정도가 선호와 맞는다는 일본어 문장으로 렌더링한다.
4. `less + value 0` 단위 회귀와 G2 실제 설명 통합 회귀를 추가하고, 영향받는 golden을 갱신한다.
5. 같은 프로필로 정적 하니스를 다시 빌드해 실제 브라우저 입력 → 블라인드 응답 → 최종 제출 → 편집 없는 다운로드 → 권위 집계 흐름을 재실행한다.
6. 수정 HEAD, 새 파일럿 증거, 새 payload ledger와 ZIP hash에 묶인 Cycle 2를 열어 네 경로 모두 새로 투표한다. Cycle 1의 부분 GO는 승계하지 않는다.

## 경계

- `humanValidation: not-run`과 `decisionBasis: user-authorized-model-panel`을 유지한다.
- human metrics는 null/not-run이며, 합성 파일럿은 human 0 / synthetic 1 / `INCOMPLETE`다.
- 사람 10명 검증, 통계적 유의성, Taste 승리는 주장하지 않는다.
- 이 보고서는 catalog 승격을 되돌리지 않지만 제품 방향 G2, Slice 5 제품 UI, Vercel 배포를 승인하지 않는다.

`PRODUCT-DIRECTION G2 AUTHORIZATION: NO`

`SLICE 5 AUTHORIZATION: NO`

`VERCEL DEPLOYMENT AUTHORIZATION: NO`
