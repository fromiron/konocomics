# Authorized Evidence Panel V1

정책 ID: `authorized-evidence-panel-v1`

적용일: `2026-09-01`

이 문서는 신규 Catalog 확장에 사용하는 비인간 evidence panel의 정식 authoring 계약이다. 원시 모델 candidate에 권한을 주지 않고, 동결된 작품별 evidence packet에서 각 claim을 다시 판정한 별도 artifact만 권한 입력으로 인정한다. 기존 Gold 150과 legacy `authorizedModelPanel`은 변경하지 않는다.

## 1. 권한 경계

- 승인된 source 값은 `annotationReviewMethod=authorizedEvidencePanel`을 사용한다.
- 사람 검수가 아니므로 evidence와 보고서 모두 `reviewedByHuman=false`를 유지한다.
- candidate의 provider, 모델명, 응답 수, confidence, 다수결은 사실 권한이 아니다.
- panel은 candidate 값을 그대로 승인하지 않고 evidence packet의 관찰에서 Genre·Theme·Axis 값을 다시 도출한다.
- 격리된 별도 에이전트는 필수 조건이 아니다. 수집 결과와 panel 판정 결과를 별도 파일로 만들고 판정이 frozen input manifest에 결속되면 된다.
- 런타임 LLM, 추천 순위 생성 LLM, 설명 생성 LLM은 계속 금지한다.

## 2. 입력 패킷

작품별 입력에는 최소한 다음이 있어야 한다.

- canonical Work identity, 일본어 제목, creator, source identity
- 대표 일반판 volume과 유효 ISBN
- 비성인 일본 만화 scope와 safety 근거
- 특정 팬덤·장르·연령·성별 등 지지 cohort와 선정 근거 URL
- 해당 만화 작품의 Factor evidence와 실제 관찰 범위. 작품 전체 리뷰·후반 권 자료도 허용하고 권수 확인이나 전권 독해를 의무화하지 않는다
- evidence ID, 작품 소유 URL, 게시·조회일, 관찰, 한계
- Factor Dictionary, Annotation Guide, 이 정책 문서의 SHA-256
- 전체 입력 파일의 `PANEL-INPUT.sha256`

선정 근거는 작품이 Catalog에 들어갈 이유를 증명한다. 해당 자료에 실제 사건 구조·빈도·반복 관찰이 없으면 Axis나 Theme 값 근거로 재사용하지 않는다.

## 3. Panel 판정

Panel은 작품마다 다음 순서로 처리한다.

1. identity·판본·ISBN·scope·safety를 확인한다.
2. evidence URL이 해당 만화 작품의 실제 관찰을 담고 있는지 확인한다.
3. Genre와 Theme centrality를 판정한다.
4. 17 Axis를 `0/2/4` 기준에 먼저 대조하고 사이값일 때만 `1/3`을 사용한다.
5. 근거 부족은 낮은 값이 아니라 `unknown`으로 둔다. `notApplicable`은 `motionImpact`에만 허용한다.
6. 모든 accepted claim에 evidence IDs, citation URLs, observation, limitation, confidence를 남긴다.
7. 충돌은 자동 평균하지 않고 재판정하거나 `unknown`으로 닫는다.

추천 승격의 최소 coverage는 다음과 같다.

- Genre: 1개 이상
- Theme: centrality가 있는 1개 이상
- Narrative: 6축 중 known 4개 이상
- Tone/Relationship: 7축 중 known 5개 이상
- Art: 선택 축이며 전부 `unknown`이어도 허용

기존 승격 데이터의 신뢰성은 범위 변경으로 낮추지 않는다. 초반·후반 변화는 독립 축이나 필수 조사 항목이 아니며, 확보한 구체적인 리뷰에서 확인되는 경우에만 관련 기존 팩터의 근거에 반영한다. 과거 판정·manifest는 원본 그대로 검증한다.

`entryScope` 필드명은 저장 호환을 위해 유지한다. 신규 작품 단위 판정은 `whole_work`를 사용한다. 이는 평가 대상이 작품이라는 뜻이며 전권을 읽었다는 주장이 아니다. source 행에는 실제 확인 범위를 그대로 남기며, 작품 단위 리뷰의 권수를 알 수 없으면 `whole_work`와 그 한계를 기록한다. claim 범위는 인용한 모든 source 범위를 포함해야 한다.

## 4. 필수 산출물

- `evidence-panel-ledger.csv`: work/fact별 입력·판정·근거
- `evidence-panel-summary.json`: 작품별 PASS/BLOCKED와 coverage
- `authorized-evidence-panel-v1.md`: 실행 범위·판정원·한계·수량
- `PANEL-INPUT.sha256`: 입력 패킷 manifest
- `PANEL-RESULT.sha256`: panel 산출물 manifest
- `promotion-ledger.csv`: identity·review·context·eligibility 결과

각 accepted ledger 행은 최소 `workId`, `factKey`, `state`, `value`, `confidence`, `evidenceIds`, `citationUrls`, `entryScope`, `observation`, `limitation`, `decision`, `reasonCode`를 가진다.

2026-09-09 사용자 승인으로 위 산출물과 입력 근거의 영구 보존 위치는 [로컬 작업용 SQLite](03-local-authoring-storage.md)다. 파일명·원본 바이트·manifest·입력/결과 분리는 그대로 유지하며 영구 원본은 `data/local/catalog-authoring/artifacts/`에, 재생성 가능한 임시 사본만 `.workspace/`에 둔다. 호환 연결·심링크를 만들지 않는다. 저장 DB에 후보와 판정이 함께 있어도 후보에 판정 권한이 생기지 않는다. 원문·참조 bundle까지 보존하며 경로 문자열만 저장하는 것으로 보존을 충족하지 않는다.

## 5. 조사 제한

- Grok은 수집·판정·교차검증에서 전면 제외한다.
- AniList는 사용자가 허용한 1회성 참고조사만 가능하며 최종 identity·Factor의 단독 권한 근거로 사용하지 않는다.
- 무료 검색·크롤링·다운로드만 사용한다. 유료 API·과금 자료는 금지한다.
- 근거·URL·ISBN·판정값을 quota 충족 목적으로 합성하지 않는다.

## 6. 완료와 승격

모든 원천 행은 canonical Work, alias, duplicate, 명시적 scope 제외 중 하나로 추적돼야 한다. `UNRESOLVED_IDENTITY`는 실제 유한 조사 경로가 남아 있는 동안 완료로 간주하지 않는다.

in-scope 고유 작품은 다음을 모두 만족할 때만 `recommendationVerified`가 될 수 있다.

- canonical identity, safety, 대표 ISBN, 선정 provenance가 검증됨
- 17 Axis와 필수 Genre·Theme·Narrative·Tone coverage가 충족됨
- 모든 known claim에 적격 evidence가 있음
- recommendation context가 정확히 한 행 존재함
- panel ledger와 두 manifest가 검증됨
- `annotationReviewMethod=authorizedEvidencePanel`
- `reviewedByHuman=false`
- `recommendationEligible=true`, `libraryOnly=false`
- hard blocker가 없음

중복·별칭·실제 비만화·성인·비일본 작품은 별도 추천 Work로 만들지 않는다. 근거를 끝내 확보하지 못한 작품은 지지도 탈락으로 삭제하지 않고 코드·근거·재검토 경로가 있는 `promotionBlocked`로 보존한다.
