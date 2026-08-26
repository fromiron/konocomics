# 전체 canonical 추천 승격 방법론

정책 버전: `promotion-evidence-v3`

이 문서는 전체 batch에 적용하는 조사·주석 계약이다. 기존 수집·canonical 정규화 결과, 추천 산식과 동결 Gold 150은 유지한다. v3는 승격 필수 coverage를 Genre·Theme·Narrative·Tone으로 한정하고 Art를 이미지 분석 또는 커뮤니티 평가로 보강할 수 있는 선택 축으로 바꾼다. Art가 없으면 `unknown`을 유지하며 점수의 15%를 다른 그룹에 재분배하지 않는다.

## 1. 처리 순서

1. canonical identity, 대표 ISBN, scope, safety를 먼저 감사한다.
2. 공식 출판사 작품·권 소개, 공식 수상기관 심사평, 공식 서점·배급사 설명, 신뢰 가능한 비평·인터뷰와 독립 커뮤니티 평가 순서로 초반 1~3권 또는 첫 주요 에피소드 근거를 묶는다. Art 이미지 경로는 선택 사항이다.
3. 공식 텍스트로 Pass A 주석을 만들되 지속성을 확인할 수 없는 축은 `unknown`으로 둔다.
4. 복수의 독립 유저평에서 반복되는 구체 관찰만 텍스트 축의 보조 근거로 교차검증한다.
5. 필수 coverage 미달 축은 같은 범위의 공식 권 소개·복수 독립 리뷰를 좁게 추가 조사한다. 실제 자료가 남아 있는 동안 미달을 hard blocker로 확정하지 않는다. Art 미달은 blocker가 아니다.
6. 독립 Pass B, 충돌·극단값 Pass C adjudication을 거친다. 자동 평균이나 단순 다수결은 하지 않는다.
7. 주석·Evidence·context·eligibility 전체 gate를 통과한 작품만 `recommendationVerified`로 승격한다.

## 2. Art 선택 경로

Art는 승격 필수 coverage가 아니다. 이미지 분석과 커뮤니티 평은 동급의 대체 경로이며 둘 다 없으면 네 축을 `unknown`으로 둔다.

- **이미지 경로:** 공식 내부 미리보기를 초반 1~3권과 판본상 연결하고, 판독 가능한 내부 페이지 6쪽 이상과 서로 다른 장면 맥락 2개 이상을 확인한다. `motionImpact=known`은 정확한 시작·끝 참조가 있는 연속 동작 시퀀스가 필요하다. 임시 이미지는 커밋하지 않고 공식 URL, 판본, 참조, 표본 수, 맥락과 SHA-256만 보존한다.
- **커뮤니티 경로:** 공식 자료로 작품과 entry 범위를 고정하고, 서로 복제되지 않은 독립 리뷰 2개 이상이 같은 구체적 시각 관찰을 반복해야 한다. URL, 작성 주체, 날짜, 독립성, 범위, 반복 관찰과 Dictionary anchor 연결을 남긴다. terminal Art row는 `evidenceRoute=community`와 두 exact review URL을 `refs`에 기록한다. 비구체 호불호나 액션 장르 언급만으로는 Art 값을 만들지 않는다.
- 두 경로를 함께 요구하지 않는다. 충돌은 adjudication 또는 `unknown`으로 닫는다. Art `unknown` 자체는 blocker가 아니다.

이미지 경로를 선택한 경우에만 `미리보기 접근·표본 기준 확인 → 충족 작품만 임시 표본 → 시각 판정 → 미달 즉시 unknown → 극단값·충돌만 adjudication`을 수행한다.

## 3. 텍스트와 유저평

공식 자료는 작품 identity와 entry 범위를 고정한다. 다음 조건을 모두 만족하는 공통 커뮤니티 관찰은 Narrative·Tone 또는 Art Evidence로 쓸 수 있다.

- 서로 복제되지 않은 복수 출처다.
- 실제 독서 범위가 확인된다.
- 0/2/4 기준에 연결되는 사건 구조·반복 메커니즘 또는 구체적 시각 관찰이다.
- URL, 출처명, 게시일 또는 연도, 조회일, 독립성, 반복 주장을 기록한다.

공식 홍보·상품 자료, 일본 독립 커뮤니티, 한국 커뮤니티는 서로 다른 증거 층으로 기록한다. 한국 커뮤니티 조사는 작품의 정식 또는 통용 한국어 제목을 우선 사용하고 한국어 표기 변형과 실제 검색어를 함께 남긴다. 일본어 원제만 사용한 검색으로는 한국 커뮤니티의 적격 근거가 없다고 판정할 수 없다.

단일 감상, 추천 목록 등재, 별점·순위만 있는 자료, 미독 반응, 복제 리뷰, 근거 없는 호불호는 제외한다. 공식 자료와 충돌하거나 리뷰끼리 갈리면 자동 다수결하지 않고 adjudication 또는 `unknown`으로 종결한다. 원문은 UI 문구로 복사하지 않고 공통 관찰만 저작권을 침해하지 않는 형태로 요약한다. 추천 설명은 기존 contribution 기반 엔진에서만 생성한다.

## 4. 판정원

- 이미지 Art 경로를 선택한 경우의 최소 정족수: 실제 픽셀 접근을 입증한 Local Codex subagent와 Gemini 3.7 Flash High.
- 커뮤니티 경로: 공식 범위 고정 + 서로 복제되지 않은 독립 JP/KR 리뷰 2개 이상 + Dictionary 기준 adjudication. 한국 커뮤니티는 정식·통용 한국어 제목과 표기 변형으로 검색한다.
- Cursor Grok 4.6 High non-fast: Factor·Theme·identity·safety와 커뮤니티 근거를 검수한다. 픽셀 접근을 입증하지 못한 이미지 경로 Art에서는 기권한다.
- Muse Spark 1.2 xhigh: 정확한 모델 identity, 정상 종료, 전체 입력 접근, 완결 응답, rate-limit·timeout·degraded output 부재를 모두 만족할 때만 보조 참여. 실패 사유를 batch 원장에 남기며 조용히 대체하지 않는다.

판정 차이는 Factor Dictionary, 직접 근거, 판본과 평가 범위 일치 여부로 해결한다. 모델 패널은 사람 검수가 아니며 `reviewedByHuman=false`를 유지한다.

## 5. 최종 상태

각 유효 canonical Work는 `recommendationVerified` 또는 근거·코드·재검토 경로를 가진 `promotionBlocked`로 끝난다. Art 이미지·커뮤니티 근거 부족은 pending이나 blocker가 아니며 명시적 `unknown`으로 닫는다.
