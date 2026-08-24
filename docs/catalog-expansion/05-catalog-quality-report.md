# 카탈로그 품질 보고서

조회일: 2026-08-25

## Pilot 001 최종 품질

- frozen 작품: 50
- 승격 판정: 50 `recommendationVerified`, hard blocker 0
- Gold 150 변경: 없음
- 평가 범위: 초반 1~3권 또는 첫 주요 에피소드
- Factor: 850행(50×17), known 637 / unknown 213 / pending 0
- 텍스트 13축: known 474 / unknown 176
- Art 4축: known 163 / unknown 37
- Genre: 전 작품 1개 이상
- Theme: 78행, 전 작품 1개 이상
- Evidence: 250개 고유 ID(텍스트 50, Art 200), URL 보유율 100%
- independent review: Local Codex Pass B/C + Cursor Grok 4.6 High non-fast 비작화 검수
- Art quorum: 실제 픽셀을 본 Local Codex + Gemini 3.7 Flash High
- 사람 검증: 미실행(`reviewedByHuman=false`); model panel을 사람 검증으로 표시하지 않음

모든 값은 현재 Factor Dictionary와 기존 coverage 계약으로 검증했다. dictionary, unknown 처리, recommendation 산식, validator, Gold ID·Factor·Evidence는 바꾸지 않았다.

## Art 상태 종결

목표를 Art 전수 known이 아니라 Art 상태 전수 종결로 두었다. 공식 진입부 판본과 연결되고 판독 가능한 내부 페이지 6쪽 이상·서로 다른 장면 맥락 2개 이상을 충족한 경우에만 정적 3축을 판정했다. 후속 공식-viewer salvage를 거쳐 50작품 모두 정적 3축이 known이 됐다.

`motionImpact`는 시작·전개·끝이 정확히 이어진 연속 동작 시퀀스를 확인한 13작품만 known이다. 나머지 37작품은 낮은 값으로 대체하지 않고 unknown으로 종결했다. 표지, 애니메이션 이미지, 줄거리, 유저 작화평은 known 근거로 사용하지 않았다.

최종 Art 합계는 known 163 / unknown 37이며 전 작품이 변경하지 않은 Art coverage 0.30을 통과한다. 각 행은 공식 URL, 판본, scope, 페이지·시간 참조, 표본 수, 장면 맥락, 관찰, 한계, model-quorum 상태를 보존한다. 임시 이미지는 커밋하지 않고 표본 SHA-256만 검수 원장에 남겼다.

Local–Gemini 값 차이는 평균이나 다수결로 합치지 않았다. Factor Dictionary, 동일 판본, 실제 페이지 범위로 Pass C를 수행했다. Grok은 실제 픽셀 접근을 입증하지 못해 Art 전부 기권했고 Muse Spark 1.2는 호출하지 않았다.

## 텍스트 Factor·Genre·Theme

공식 출판사 작품·권 소개와 내부 미리보기를 우선하고, 공식 수상기관·서점·배급사 자료를 뒤에 배치했다. 짧은 소개가 지속적 특성을 입증하지 못하면 unknown을 유지했다. 장르에서 Axis를 자동 추론하지 않았고, 0 또는 4 극단값과 모델 충돌은 좁은 추가 조사와 independent review를 거쳤다.

공식-first follow-up과 Pass C 결과는 다음과 같다.

- 50/50 Narrative coverage 통과(known 4/6 이상)
- 50/50 Tone coverage 통과(known 5/7 이상)
- 텍스트 650행 중 known 474 / unknown 176
- Theme 78행, centrality는 근거 범위 안에서만 부여
- 완전히 동일한 17축 벡터를 복사해 만든 작품 없음
- unresolved adjudication 0, text hard blocker 0

Pilot 001과 Batch 002의 내구적 입력에는 URL·게시일·독립성·진입 범위가 함께 연결된 복수 독립 유저평 패킷이 없어 Factor Evidence로 사용하지 않았다. Batch 003부터 새로 수집하는 복수 독립 리뷰는 `pacing`, `comedy`, `emotionalWarmth`, `mentalStress`, `darkness`, `romance`, `relationshipStructure`, `characterArcWeight`, 진입부 반복 구조의 구체적 관찰에 한해 보조 교차검증 후 사용할 수 있다. 단일 감상, 추천 목록 포함 사실, 별점·인기 순위, 복제 리뷰, 구체적 관찰이 없는 호불호는 Factor Evidence에서 제외한다. 리뷰 문장은 UI로 복사하지 않으며 추천 설명은 기존 contribution 기반 엔진만 생성한다.

### 리뷰 유래 비점수 신호

`예쁜 그림`, `감동적`, `액션이 좋다`처럼 축 기준·반복 구조·entry scope를 확정하지 못하는 평가적 문구 자체는 `promotion-evidence-v2`가 적용되는 모든 catalog-expansion batch의 staging에서 비점수 감사 신호로만 다룬다. 복수 독립 리뷰에서 확인된 구체적 entry-scope 관찰을 기존 텍스트 Factor의 보조 Evidence로 검토하는 절차와는 별개이며, 평가적 문구를 Axis 이름이나 값으로 직접 매핑하지 않는다.

이 신호는 공식 자료 재검사 순서를 정하거나 기존 주석과의 충돌을 경고할 수만 있다. promotion coverage·eligibility·Manga DNA·점수·contribution·설명에 관여하지 않고, absence로 조사를 조기 종료하거나 blocker를 만들지 않는다. 이 금지는 외부 유저평 문구에서 추출한 review-language staging signal에만 적용한다. 기존 수치형 `reviewAverage`·`reviewCount` 시장 계약과 사용자가 직접 선택한 `artStyleDislike` 등 profile reason 계약은 변경하지 않으며, review-language signal을 그 필드로 변환하거나 자동 입력하지 않는다.

`여성향/남성향 그림체` 같은 성별 코딩 표현은 work-level trait로 정규화하거나 저장하지 않고 source-scoped 감사 문구와 공식 내부 페이지 재검사 가설로만 보존한다. 문구 자체는 Art의 state·value·confidence를 만들거나 변경하지 않는다. Art 판정은 기존과 동일하게 entry-scope 판본 연결, 판독 가능한 공식 내부 페이지 6쪽 이상, 서로 다른 장면 맥락 2개 이상을 충족한 직접 픽셀 관찰만 사용한다. `motionImpact`는 연속 동작의 시작·전개 또는 타격·끝을 추가로 확인해야 하며, 통과한 관찰만 `artRealism`, `artDensity`, `visualSoftness`, `motionImpact`의 기존 0/2/4 기준으로 주석한다.

향후 review-signal을 점수화하려면 현재 v1 Factor Dictionary·Work axes·추천 산식과 분리된 새 versioned schema와 engine version을 먼저 정의해야 한다. 새 계약은 Gold 150과 현재 Axis·Genre·Theme·coverage·eligibility·contribution·explanation을 변경하거나 재해석할 수 없다. 실제 사람 블라인드 검증을 통과하기 전에는 점수·순위·설명에 사용하지 않으며 model-panel 승인이나 synthetic pilot은 이 human gate를 대체하지 않는다.

이 경계는 Local 계약 감사와 [Oracle Pro 검수](../../data/staging/catalog-expansion/batches/batch-003/reviews/oracle-review-signal-policy-response.md)에서 재확인했다. Oracle의 최초 판정은 문구가 위 구분을 충분히 드러내지 않아 `FAIL`, 수정 뒤 정책 결정은 `PASS`였다.

## Evidence와 판정원 품질

선정 provenance와 Factor Evidence를 분리했다. 최종 250 Evidence는 모두 Pilot work에 귀속되고 고유 ID와 URL을 가지며 `reviewedByHuman=false`다. Art manifest 200행은 모두 `quorum-verified`와 `reviewedByHuman=false` 상태를 가진다.

Cursor Grok 4.6 High non-fast는 현재 candidate SHA에 대해 5개 chunk의 비작화 Factor·Theme·identity·safety를 검수했고 Art는 기권했다. Gemini Art authorizing run은 정확한 `gemini-3.7-flash-high`, effort `high`, 정상 종료, 전체 입력·픽셀 접근, 완결 응답을 확인한 것만 사용했다. 실패·timeout·connection-reset 응답은 원장에 남기되 판정에서 제외했다. Muse는 사용하지 않았으며 다른 모델로 대체했다고 기록하지 않았다.

후속 batch Art 수집은 `art-source-route-registry.csv`의 출판사별 공식 상품·미리보기 경로를 먼저 재사용한다. Luna xhigh는 공식 경로 확인과 임시 캡처·SHA-256 수집만 수행하고 값을 정하지 않으며, Primary Local Codex가 판본과 원본 픽셀을 재확인한다. Daybreak Blue는 이 수집물과 Local 제안을 독립 검증하는 보조 판정원이다. Local Codex와 정상 종료한 exact Gemini의 최소 Art 정족수는 그대로 유지한다.

## Promotion gate 결과

50작품 모두 canonical identity, safety, representative ISBN 또는 기존 명시적 예외, provenance, Genre·Theme·Factor schema, Evidence, recommendation context, series group, catalog role, onboarding·recommendation eligibility를 통과했다. `『』` 같은 장식 괄호는 canonical title에 포함하지 않았다.

승격은 승인 overlay의 모든 바이트와 model-review 원장 hash를 동결한 뒤 수행한다. source merge는 Pilot 행만 바꾸고 비대상 CSV record 바이트와 Gold manifest를 보존한다. publish 직전 5개 출력 디렉터리 snapshot을 재검증하며, 부분 적용·승인 후 변경·Evidence ID 충돌은 실패한다.

## Batch 002 최종 품질

- frozen 작품: 50
- 승격 판정: 33 `recommendationVerified`, 17 `promotionBlocked`
- 누적 상태: Gold 150, 신규 `recommendationVerified` 83, `promotionBlocked` 17, pending 1,364
- 추천 가능 작품: 233 / 전체 canonical 1,614
- Gold manifest SHA-256: `eee9030933949bd92fbb48d0a94610ed933d2aaa76d620b86fec6c4a44b18fe2`(변경 없음)
- 승격 작품 Factor: 561행, known 412 / unknown 149 / pending 0
- 텍스트 13축: known 309 / unknown 120
- Art 4축: known 103 / unknown 29
- Theme: 66행
- Evidence: 165행, Art evidence manifest 132행
- recommendation context: 33행(`anchor` 14, `bridge` 15, `discovery` 4)
- 사람 검증: 미실행(`reviewedByHuman=false`)

50작품 전체의 Art 200상태는 known 131 / unknown 69로 종결했다. 정적 Art known은 공식 내부 페이지 6쪽 이상·서로 다른 장면 맥락 2개 이상, `motionImpact` known은 정확한 시작·끝 참조가 있는 연속 동작 시퀀스를 요구했다. 표본 미달은 unknown으로 닫았으며 Art unknown만으로 blocker를 만들지 않았다. Local Codex와 `gemini-3.7-flash-high`가 실제 픽셀 정족수를 구성했고 Cursor Grok은 Art 기권, Muse는 `NOT_USED`로 기록했다.

17건은 모두 `SOURCE_INFORMATION_UNAVAILABLE`이다. 공식-first 재조사 뒤에도 기존 coverage를 충족하지 못한 그룹만 blocker로 확정했으며, 각 행에 부족 그룹, 공식 URL, 발표일 또는 연도, 조회일, 재검토 경로를 기록했다. 부족 그룹은 Narrative 9건, Tone 9건, Art 8건이며 한 작품에 여러 그룹이 겹칠 수 있다. 값 보충, 임계 완화, 산식 변경은 하지 않았다.

승격 overlay validation SHA-256은 `ea34b2459e967ba27129e0e7522dadfcbb8830a5cb1a90f5af3c2337f0d9432e`, annotation·review·adjudication 결합 입력 패킷 SHA-256은 `3852eea86b876b9231d549cf044e99a9a396b6adb6c1bd8d9b0ccd9be1e71e2f`다. 179개 입력 파일과 8개 publish overlay를 바이트 단위로 검증한 뒤 원자적으로 반영했으며, 같은 입력의 재검증은 `exactlyApplied`로 통과했다. 최종 source·publish overlay에 임시 이미지, 임시 경로, `『』` 제목 구분자는 없다.

## 현재 검증 게이트

- `pnpm format:check`, `pnpm typecheck`, `pnpm lint`: 통과
- `pnpm test`: 103파일, 796테스트 통과
- `pnpm catalog:validate`: 1,614작품, 오류 0; 사람 미검수·authorized model panel 경계를 드러내는 경고는 유지
- `pnpm catalog:expansion:validate`: staging 계약 통과
- `pnpm catalog:build`: `v1-55a34b73abb4`; 생성물 6개의 빌드 전후 SHA-256 일치
- `pnpm catalog:coverage`: 추천 가능 233작품 전부 coverage PASS
- Batch 002 overlay·promotion, library-only expansion, Rakuten adjudication, Batch 003 freeze의 `--check`: 통과
- `pnpm build`, `pnpm harness:build`, `pnpm test:e2e`: 통과; desktop·mobile Chromium 10/10

## Batch 003 공식-first 연구 동결

동결된 50작품을 10작품씩 나눠 초반 1~3권 또는 첫 주요 에피소드의 공식-first Evidence packet을 만들었다. 5개 chunk는 동결 `workId`·canonical title·순서와 정확히 일치하며 총 174개 source block이 URL, 출처명, 발표일 또는 연도, 조회일, 평가 범위, 관찰, 한계를 보존한다. 필수 필드 누락, 작품 내 중복 URL, canonical title의 `『`·`』`, 선행 Factor·Art·promotion 판정은 0건이다.

| chunk | 작품 | source block | SHA-256                                                            |
| ----: | ---: | -----------: | ------------------------------------------------------------------ |
|    01 |   10 |           33 | `24504373ec03820b36f87e7b211b4be557d8991b555d831afcdf6dd9b60c5f45` |
|    02 |   10 |           43 | `7c59174ec97cc10922aabc09208f19e04e74ea6a852734cb9dbdf77ebdc5add5` |
|    03 |   10 |           30 | `1e65e398e2c375129ac118c9f54e0d75eae1f145fc1b8b7fa68cb847c459aaa1` |
|    04 |   10 |           37 | `80450417a3500e632acddcf20ee568fbc18b56f363530bbf840cc2735c585546` |
|    05 |   10 |           31 | `b0db5cfb6a223c87bff5352860e11bff37d62259cd74d75644d3f02fe3150f68` |

이 단계는 근거 수집 동결이며 승격 결과가 아니다. 50작품은 계속 `libraryOnly`이고 Pass A, 독립 Pass B, Art 표본 gate, model quorum, adjudication, promotion gate를 통과하기 전에는 추천에 참여하지 않는다. Art 내부 페이지 표본과 복수 독립 유저평 pair를 확인하지 못한 항목은 만들어 내지 않았고, 후속 gate에서 각각 `unknown` 또는 좁은 추가 조사로 처리한다.

## Batch 003 진행 중 품질 경계

Pass A는 50작품의 17축 850상태를 모두 닫았다. 현재 초안은 known 286 / unknown 564이며 Art 200상태는 시각 판독 전에 전부 unknown으로 시작했다. 이는 초안 완료이지 검수 또는 승격 판정이 아니다. 다섯 chunk 모두 동결 후보 SHA와 10작품×17축 행렬, Genre·Theme 참조, canonical title 구분자 금지를 검증했다.

Art chunk 01은 공식 내부 미리보기 사전검사 뒤 6작품만 시각 정족수 대상으로 삼고 4작품은 접근·판본·표본 기준 미달로 즉시 unknown 종결했다. Local Codex와 정상 종료한 정확한 `gemini-3.7-flash-high`가 같은 18개 원본 픽셀과 SHA-256을 확인했고, 실패한 Gemini 실행 3건은 원장에 남기되 판정에서 제외했다. Cursor Grok은 Art 기권, Muse는 `NOT_USED`다. 최종 40상태는 known 19 / unknown 21이며 `motionImpact` known은 정확한 연속 동작 시퀀스가 확인된 1작품뿐이다. 모델 값은 평균이나 다수결로 합치지 않고 Factor Dictionary, 판본, 페이지 범위로 adjudication했다.

이 Art 결과만으로 blocker를 만들지 않는다. 텍스트·Theme·identity·safety의 독립 검수와 공식-first gap search를 먼저 끝낸 뒤 변경하지 않은 coverage 계약을 작품별로 적용한다. 임시 페이지 이미지는 저장소에 넣지 않았고 staging에는 공식 URL, 판본, 페이지 참조, 표본 수, 장면 맥락, SHA-256과 판독 한계만 보존한다.

## 남은 전체 작업

Pilot과 Batch 002 뒤 추천 가능 작품은 233개다. 남은 pending 1,364작품에 같은 공식-first 수집 → Local annotation → independent review → adjudication → deterministic promotion gate를 50~100작품 단위로 반복한다. 현재 1,000개 수량은 중단 조건이 아니며, 남은 유효 canonical 전부가 `recommendationVerified` 또는 재현 가능한 `promotionBlocked`가 될 때까지 계속한다.
