# Authorized Evidence Panel V1

## 2026-09-23 추가 조사 후 N/T 승격 예외 — narrative-tone-exhaustion-v1

추가 조사·출처 소진 후에도 Narrative/Tone만 부족하면 해당 축을 `unknown`으로 유지하며 추천 승격할 수 있다. Genre/Theme, 작품·대표 ISBN 식별, 추천 맥락, porn/non-porn, 기존 권한·Gold 보호와 입력 결속은 그대로 검사한다. 아래 기본 N≥4/T≥5 규칙에 대한 작품별 예외이며, 추천 엔진의 coverage 임계·0.5 수축·고정 가중치는 바꾸지 않는다. Gold 인증을 부여하지 않는다.

새 v4 job의 해당 work에 선택 필드 `narrativeToneExhaustion`을 넣는다. `policy`, `workId`, `representativeIsbn`, `attempts`, `stopReason`을 기록한다. 각 attempt는 실제 추가 조사한 동결 research의 `sourceUrl`, `gap`(`narrative` 또는 `tone`), `outcome`(`insufficient`/`unavailable`/`duplicate`/`resolved`), 구체적 `observation`이다. 조사한 그룹만 예외 대상이다. 횟수·검색 키워드·문구 자동 매칭으로 완료를 추정하거나 실제 조사 없이 기록을 만들지 않는다. 기존 기록이 있으면 그 실제 결과를 재사용한다. Art·전권·성적 표현강도는 조사 대상으로 추가하지 않는다.

예외는 이 정책이 동결된 새 입력 revision에서만 유효하다. 이전 frozen/PREPARED/판정 SHA를 바꾸거나 새 입력에 옛 판정의 SHA만 교체하지 않는다. 기본 기준이 충족되면 `COVERAGE_COMPLETE`, 예외로 승격하면 `NARRATIVE_TONE_RESEARCH_EXHAUSTED`를 기록한다. 별도 `disposition=hold`는 자동으로 PASS로 바꾸지 않는다.

검사·발행은 동일 결속 기록을 읽는다. 발행은 기존 `source_evidence`에 `narrativeToneExhaustionV1` 기록을 추가하여 실제 조사 기록·입력 SHA·조사 SHA·review reference를 보존한다. 빌드는 현재 AEP review·대표 ISBN·기록 해시가 일치할 때만 `eligibility.narrativeToneException`을 생성한다. 과거 review의 예외는 새 review에 자동 승계되지 않는다. SQL schema/table 추가는 없다. 최종 readback은 unknown 보존 및 예외 메타데이터 유무에 따른 추천 산식 동일성을 확인한다.

## 2026-09-21 사용자 확정: 포르노 작품만 제외

Catalog의 성적 콘텐츠 제외 기준은 **porn / non-porn**이다. 성인등급, 폭력·출혈·잔혹 묘사, 노출·성적 장면의 존재 자체는 제외 사유가 아니다. 『베르세르크』처럼 성인등급인 비포르노 서사 만화는 허용한다. 작품의 주된 성격이 포르노인지 확인하며 별도의 비성인·일반 독자 등급 증명 수집은 요구하지 않는다. 해당 작품의 출판사·레이블 분류로 비포르노임이 확인되면 충분하며 그 확인으로 종료한다. 여러 레이블을 가진 출판사는 해당 작품의 레이블만 확인한다. 성적 소재·노출·성적 장면은 작품적 표현으로 허용하며, 에피소드별 표현 강도·무해성·전연령 적합성을 추가 조사하거나 미확인 gap/HOLD 사유로 삼지 않는다. 실제 포르노 분류 충돌이나 작품/레이블 식별 불가가 있을 때만 그 분류를 좁게 확인한다. 추천 선정 맥락과 팩터 근거는 별도 계약이다.

새 판정은 `non-pornographic-work` → `non-porn` / `SAFE`, `pornographic-work` → `porn` / `BLOCKED_SAFETY` (`SAFETY_PORNOGRAPHIC_WORK`)를 사용한다. 판단 불명은 `classification-unresolved`로 보존한다. SAFE는 아동 적합성이나 무폭력 인증이 아니다. 기존 `non-adult` 등 분류는 과거 artifact 호환용으로 유지하며 성인등급만으로 차단한 HOLD는 새 계약을 동결한 revision에서 재검토한다. 과거 frozen·판정은 수정하지 않는다.

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
- 비포르노 일본 만화 scope 확인(기존 작품 자료 재사용)
- 특정 팬덤·장르·연령·성별 등 지지 cohort와 선정 근거 URL
- 해당 만화 작품의 Factor evidence와 실제 관찰 범위. 작품 전체 리뷰·후반 권 자료도 허용하고 권수 확인이나 전권 독해를 의무화하지 않는다
- evidence ID, 작품 소유 URL, 게시·조회일, 관찰, 한계
- Factor Dictionary, Annotation Guide, 이 정책 문서의 SHA-256
- 전체 입력 파일의 `PANEL-INPUT.sha256`

선정 근거는 작품이 Catalog에 들어갈 이유를 증명한다. 해당 자료에 실제 사건 구조·빈도·반복 관찰이 없으면 Axis나 Theme 값 근거로 재사용하지 않는다.

같은 리뷰·수상/선정 페이지 URL은 출처 주소이므로 여러 작품이나 새 판정에서 다시 인용할 수 있다. 다만 각 작품이 그 페이지에 실제 등장하는지, 인용한 관찰·범위를 작품별로 확인한다. `evidenceId`는 URL 자체가 아니라 저장된 근거 행의 식별자다. 기존 ID는 Work·source URL/유형과 저장된 추천 문맥 결속(`factKey`, citation, scope, observation, limitation 등)이 동일할 때만 그대로 쓴다. 같은 URL이어도 새 판정이 다른 결속을 만들거나 기존 ID가 선정 provenance 등 다른 용도로 저장돼 있으면 새 ID와 입력 revision을 만들고 기존 행·동결·판정을 보존한다. URL 재인용만으로 새 raw capture가 생긴 것으로 기록하지 않는다.

## 3. Panel 판정

2026-09-25 수집 인계 형식: 새 수집 helper는 조사자가 작성한 기존 `narrative-tone-exhaustion-v1` 기록을 선택 sidecar `COLLECTION-HANDOFF.json`으로 전달한다. `schemaVersion=factor-collection-handoff-v1`, 정확한 `researchSha256`, `narrativeToneExhaustion` 세 필드를 가진다. Work·대표 ISBN·실제 source URL·attempt/stopReason은 기존 계약 그대로 검증한다. 신규 v4 research ref의 선택 `handoffSha256`과 frozen sourceInputBindings/provenance가 원본을 보존하며 기록 충돌이나 SHA 불일치는 준비 오류다. 이 형식은 소진 사실이나 판정 권한을 생성하지 않고 과거 collector/frozen/HOLD를 변경하지 않는다. 중국어 원문 언어는 `zh`로 기록한다.

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

중복·별칭·실제 비만화·포르노·비일본 작품은 별도 추천 Work로 만들지 않는다. 근거를 끝내 확보하지 못한 작품은 지지도 탈락으로 삭제하지 않고 코드·근거·재검토 경로가 있는 `promotionBlocked`로 보존한다.

수집 완료 receipt의 `handoffSha256`은 최초 조립 전에도 예상 sidecar 원본을 식별한다. `collection-events.jsonl`의 같은 research 완료 기록을 `collectionReceiptSha256`으로 결속하며, 예상 sidecar 누락/변경은 입력 복구 대상이다. 과거 sidecar 없는 수집분을 자동 조사 소진으로 해석하지 않는다.
