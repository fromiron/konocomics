# 전체 canonical 추천 승격 방법론

정책 버전: `promotion-evidence-v2`

이 문서는 현재 50작품 Pilot부터 전체 batch까지 적용하는 조사·주석 효율화 계약이다. 기존 수집·canonical 정규화 결과를 초기화하지 않으며 Factor Dictionary, `unknown`·coverage 계약, 추천 산식, Gold 150, safety·identity·promotion gate를 변경하지 않는다.

## 1. 처리 순서

1. canonical identity, 대표 ISBN, scope, safety를 먼저 감사한다.
2. 공식 출판사 작품·권 소개, 공식 내부 미리보기에서 확인한 내용, 공식 수상기관 심사평, 공식 서점·배급사 설명, 신뢰 가능한 비평·인터뷰 순서로 초반 1~3권 또는 첫 주요 에피소드 근거를 묶는다.
3. 공식 텍스트로 Pass A 주석을 만들되 지속성을 확인할 수 없는 축은 `unknown`으로 둔다.
4. 복수의 독립 유저평에서 반복되는 구체 관찰만 텍스트 축의 보조 근거로 교차검증한다.
5. coverage 미달 축은 같은 범위의 공식 권 소개·내부 페이지·복수 독립 리뷰를 좁게 추가 조사한다. 실제 자료가 남아 있는 동안 미달을 hard blocker로 확정하지 않는다.
6. 독립 Pass B, 충돌·극단값 Pass C adjudication을 거친다. 자동 평균이나 단순 다수결은 하지 않는다.
7. 주석·Evidence·context·eligibility 전체 gate를 통과한 작품만 `recommendationVerified`로 승격한다.

## 2. Art 상태 종결

목표는 모든 Art 값을 억지로 known으로 만드는 것이 아니라 네 축의 상태를 모두 확정하는 것이다.

- 공식 내부 미리보기가 초반 1~3권과 판본상 연결돼야 한다.
- 판독 가능한 내부 페이지 6쪽 이상과 서로 다른 장면 맥락 2개 이상을 확인한 작품만 정적 Art 축을 판정한다.
- `motionImpact=known`은 정확한 시작·끝 참조가 있는 연속 동작 시퀀스를 직접 확인했을 때만 허용한다.
- 접근 불가, 판본 불명, 표본 부족, 기준 미달은 URL·판본·확인 범위·한계를 남기고 해당 축을 `unknown`으로 종결한다.
- 표지, 애니메이션 이미지, 줄거리, 유저의 작화 평만으로 Art 값을 만들지 않는다.
- Art `unknown` 자체는 blocker가 아니다. 현재 추천 coverage와 promotion 계약을 실제로 충족하지 못할 때만 blocker 후보가 된다.
- 임시 페이지 이미지는 커밋하지 않는다. 공식 URL, 판본, 페이지 참조, 표본 수, 장면 맥락, SHA-256만 보존한다.

처리 파이프라인은 `미리보기 접근·표본 기준 확인 → 충족 작품만 임시 표본 → 시각 판정 → 미달 즉시 unknown → 극단값·충돌만 adjudication`이다.

## 3. 텍스트와 유저평

유저평은 공식 근거를 대체하지 않는다. 다음 조건을 모두 만족하는 공통 관찰만 보조 Evidence로 쓸 수 있다.

- 서로 복제되지 않은 복수 출처다.
- 실제 독서 범위가 확인된다.
- `pacing`, `comedy`, `emotionalWarmth`, `mentalStress`, `darkness`, `romance`, `relationshipStructure`, `characterArcWeight` 또는 초반 반복 구조에 관한 구체 관찰이다.
- URL, 출처명, 게시일 또는 연도, 조회일, 독립성, 반복 주장을 기록한다.

단일 감상, 추천 목록 등재, 별점·순위만 있는 자료, 미독 반응, 복제 리뷰, 근거 없는 호불호는 제외한다. 공식 자료와 충돌하거나 리뷰끼리 갈리면 자동 다수결하지 않고 adjudication 또는 `unknown`으로 종결한다. 원문은 UI 문구로 복사하지 않고 공통 관찰만 저작권을 침해하지 않는 형태로 요약한다. 추천 설명은 기존 contribution 기반 엔진에서만 생성한다.

## 4. 판정원

- Art 최소 정족수: 실제 픽셀 접근을 입증한 Local Codex subagent와 Gemini 3.7 Flash High.
- Cursor Grok 4.6 High non-fast: 비작화 Factor·Theme·identity·safety 검수. 픽셀 접근을 입증하지 못한 Art에서는 기권.
- Muse Spark 1.2 xhigh: 정확한 모델 identity, 정상 종료, 전체 입력 접근, 완결 응답, rate-limit·timeout·degraded output 부재를 모두 만족할 때만 보조 참여. 실패 사유를 batch 원장에 남기며 조용히 대체하지 않는다.

판정 차이는 Factor Dictionary, 직접 근거, 판본과 평가 범위 일치 여부로 해결한다. 모델 패널은 사람 검수가 아니며 `reviewedByHuman=false`를 유지한다.

## 5. 최종 상태

각 유효 canonical Work는 `recommendationVerified` 또는 근거·코드·재검토 경로를 가진 `promotionBlocked`로 끝난다. Art 표본 부족은 장기 pending 사유가 아니며 명시적 `unknown`으로 닫는다.
