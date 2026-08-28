# Catalog source 운영 계약

`data/source/`는 공개 Catalog를 만드는 빌드 전용 원천이다. S6 이후 table-backed 단일 권한은 `catalog.sqlite`이고, 생성 JSON은 직접 수정하지 않는다. DB 변경은 공용 candidate 검증·원자적 publish 경로를 사용한 뒤 `catalog:validate`와 `catalog:build`로 다시 만든다.

## 파일 역할

- `catalog.sqlite/source_works`: Work 서지, eligibility, 주석 검토 provenance
- `catalog.sqlite/source_aliases`: Work 검색 별칭
- `catalog.sqlite/source_volumes`: Work에 속한 권과 대표권
- `catalog.sqlite/source_factors`: 17개 Axis의 known/unknown/notApplicable 값
- `catalog.sqlite/source_themes`: Theme 중심성 1/2
- `catalog.sqlite/source_recommendation_context`: 작품별 catalog 역할·시리즈·권수와 선택적 market snapshot 값
- `catalog.sqlite/source_recommendation_config`: catalog 전체 market 평균값(정확히 1행)
- `catalog.sqlite/source_evidence`: 기계 검증 가능한 evidence ID·범위·출처·검수 상태
- `catalog.sqlite/source_art_evidence_manifest`: Art 근거 manifest
- `evidence/seed-annotations.md`: 작품별 관찰, 공식 보조 URL, 경계 판정 설명
- `reviews/*.md`: 사람 또는 사용자가 승인한 대체 게이트의 요청·판정 기록

`works.firstPublishedYear`는 작품의 최초 정식 연재·발표 시작 연도다. 대표 단행본의 판매 연도는 `volumes.releaseDate`에만 기록하며 Work 연도로 대체하지 않는다. 공식 시작 연도를 확인하지 못하면 빈 값으로 둔다.

## evidence 범위

`targetType=work`인 evidence는 해당 Work의 서지·Theme·Axis·대표권을 함께 검토한 work-scope 묶음이다. 이 범위를 사용하는 경우 `evidence/*.md`에 known 값의 관찰 근거와 불확실성을 남겨야 한다. 그 외 `axis`, `theme`, `volume` evidence는 `targetId`가 정확히 일치해야 한다. Validator는 ID·대상 연결과 누락을 검사하고, prose의 품질은 주석 검토 게이트가 심사한다.

## 주석 검토 상태

`annotationReviewMethod`은 다음 세 값만 사용한다.

- `unreviewed`: 주석 게이트 미통과. onboarding/recommendation eligibility를 켜면 validation 오류다.
- `human`: 실제 사람이 검토했다. work evidence의 `reviewedByHuman=true`, 검토 시각, 보고서가 모두 필요하다.
- `authorizedModelPanel`: 과거 사용자 승인 대체 판정의 legacy provenance. 기존 행은 `reviewedByHuman=false`로 보존하며 신규 주석에 사용하지 않는다.

검토 완료 상태에는 `annotationReviewedAt`과 `annotationReviewReference`가 모두 필요하며, 참조 보고서가 실제로 존재하지 않으면 validation이 실패한다.

신규 모델 출력은 `data/source/` 밖의 candidate이며, 모델 수·일치·confidence·citation으로 주석 사실이나 판정을 승인하지 않는다. 신규 resolution은 `docs/planning/09-catalog-authoring-authority.md`의 candidate-independent 비모델 권한만 만들 수 있다.

## G1 동결·빌드 계약

- G1 cohort는 서로 다른 Work ID를 가진 정확히 50개 `recommendationEligible=true` 작품이다. 작품 목록과 정책 버전을 먼저 manifest로 동결하고, evidence audit·블라인드 표본·CLI 리포트가 모두 같은 목록을 사용한다.
- `docs/factors/annotation-guide.md`의 Art 근거 최소선을 50작품 전부에 동일하게 적용한다. 작품명·validator별 예외는 없고 coverage 통과만으로 evidence audit을 중단하지 않는다.
- 후보 빌더는 전체 source 후보를 sibling 임시 디렉터리에 만든 뒤 cohort·evidence·Catalog 검증을 모두 통과한 완성 디렉터리만 원자적으로 게시한다. 어느 단계에서든 실패하면 기존 후보와 `data/source/`는 byte-identical하게 유지한다.
- 블라인드 재태깅 표본은 동결 manifest의 ID만으로 결정론적으로 15~20%를 선택하고, 선택 목록을 원점수 공개 전에 기록한다. 입력에는 원점수를 넣지 않는다. 작품 목록이나 정책 버전이 바뀌면 기존 표본·조정 결과를 폐기하고 새 manifest에서 다시 선택한다.
- 근거 미달 작품을 교체할 때는 `06-implementation-plan.md`의 non-Art 거리와 다양성 보존 규칙을 사용하고, 전체 후보 주석·입력 hash·모든 조합의 거리·guard 결과·선택을 replacement manifest에 기록한다. 추천 결과를 본 뒤 후보를 바꾸지 않는다.

## G2 Catalog 주석 승격

- G2 승격 당시 source는 G1의 50작품을 보존한 150작품 Catalog였다. 기존 승인 49작품은 G1 provenance를 유지하고, 당시 신규 100작품과 재개방한 `haikyu`는 `reviews/g2-catalog-annotation-panel.md`의 Catalog 주석 판정에만 결속된다.
- 승격 전 후보·생성물·4개 검토 경로·시각 evidence ZIP의 해시는 `data/staging/g2/g2-catalog-annotation-approval.json`에 동결되어 있다. 승격은 그 manifest와 정확히 101작품의 `annotationReview*` 세 필드만 갱신하며 주석 값과 evidence를 다시 쓰지 않는다.
- Catalog 주석 승격의 범위와 provenance는 이후 제품 방향 판정과 분리되어 유지된다.

## G2 제품 방향 승인

- 제품 방향 Cycle 2는 HEAD `ce3bf4fca9dd5ba3f4bba371c9ae83407224ebc3`의 engine identity, 구현 diff, contract/metric 테스트, 결정론적 aggregate, 실제 브라우저 pilot을 같은 payload identity로 동결한 뒤 Local/Gemini/Grok/GPT-5.6 Pro의 유효하고 조건 없는 4/4 `GO`를 받았다. 결정과 모든 응답·유효성 해시는 `data/staging/g2/g2-product-direction-approval.json`에 결속되어 있다.
- 이 승인은 `humanValidation: "not-run"`, `decisionBasis: "user-authorized-model-panel"` 경로다. Human metrics는 `null`이고 실제 파일럿은 human `0`, synthetic pilot `1`, verdict `INCOMPLETE`, 다섯 human 기준 전부 `NOT_RUN`이다. 사람 검증이나 통계적 우세를 주장하지 않는다.
- 제품 방향 G2와 Slice 5는 승인됐다. Vercel은 배포 대상으로 확정되어 있지만 이 판정은 Vercel 배포를 승인하지 않으며, 실제 연결과 Production 배포는 Slice 10의 별도 완료 기준에 따른다.
- 이후 검토에서 Local/Gemini/Grok CLI에는 canonical uncompressed evidence directory와 exact request·complete ledger·root identity를 제공한다. ChatGPT.com GPT-5.6 Pro Oracle에만 같은 payload의 deterministic ZIP을 제공한다.

## 1,000+작품 확장

- 위 150작품은 Gold Set으로 고정하며 ID·행·검토 문서 hash를 `data/staging/catalog-expansion/gold-set-manifest.json`으로 검사한다.
- 총 작품 수 1,000은 최소값이고 상한은 없다. 외부 목록 원문 항목은 terminal membership 상태 없이 누락할 수 없다.
- 안전·canonical identity·선정 provenance·대표 ISBN을 확인한 신규 작품은 보수적으로 `libraryOnly=true`로 승격할 수 있다. 이 단계에서는 17축을 모두 명시적 `unknown`으로 두고 Theme·추천 context를 만들지 않으며 `onboardingEligible`과 `recommendationEligible`을 모두 끈다.
- Rakuten 응답에 없는 원산지 국적·원작 형식은 추론하지 않는다. staging에는 `unknown`으로 남기고, 별도 공식 근거로 세로형임을 확인한 항목만 제외한다. 따라서 `libraryOnly` 승격을 페이지형·일본 제작 검증 완료로 표현하지 않는다.
- `libraryOnly` 기록은 Library 검색·상세·Export/Import에만 참여한다. `09`의 candidate-independent 비모델 resolution 전에는 프로필 수, DNA, confidence, 입력 hash의 record payload, Baseline/Taste 순위와 설명 근거에 참여하지 않는다. 다만 전체 `catalogVersion` 변경은 캐시를 한 번 무효화한다.
- `data/staging/`의 연구·배치 원천은 CSV, 중첩된 Rakuten 응답 캐시는 JSONL로 유지한다. canonical Catalog는 tracked SQLite이고, OS 임시 CSV projection/shadow는 frozen staging 도구와 one-time cutover proof에만 사용한다.

## SQLite authority와 projection 경계

- 허용 regular file은 `catalog.sqlite` 하나와 opaque Markdown 12개, 총 13개다. 삭제된 9개 authoritative CSV나 SQLite journal sidecar가 함께 있으면 검증에 실패한다.
- canonical DB에는 정확히 9개 `STRICT` source table만 둔다. proof/candidate/resolution/judgment table, view, trigger는 넣지 않는다.
- row order는 1-based `sourceOrdinal`이 결정한다. `sourceLine`은 canonical CSV projection에서 record가 끝나는 physical line이며 오류·감사에만 쓰고 digest나 정렬에는 쓰지 않는다.
- 일반 reader·validator·builder·promotion registry는 SQLite를 직접 읽는다. CSV-shaped frozen 도구만 sibling OS temp에 projection하며 기존 `data/source/`를 덮어쓰지 않고 성공·실패 모두 temp와 sidecar를 제거한다.
- legitimate write는 현재 DB를 candidate로 복사해 한 transaction에서 변경·전체 검증하고, close/read-only exact readback 뒤에만 원자적으로 교체한다. 모델 출력 기반 writer는 I/O 전에 거부한다.
- S0~S5의 9개 CSV byte golden과 shadow judgment는 고정 parent Git snapshot에서 실행하는 one-time cutover proof다. ongoing authority는 `pnpm catalog:authority:verify`로 schema·layout·integrity를 검증한다.

## 추천 context

모든 `recommendationEligible` 작품은 `source_recommendation_context`에 정확히 한 행이 필요하다. `seriesGroupId`, `reviewAverage`, `reviewCount`는 결측을 허용하지만 `catalogRole`과 `volumeCount`는 필수다. 리뷰 0건을 확인한 대표권은 `reviewAverage`를 비우고 `reviewCount=0`으로 기록한다. `source_recommendation_config`의 단일 `catalogAverageRating`은 `reviewAverage`가 있고 `reviewCount>0`인 대표권만 동일 가중으로 평균한 0~5 값이어야 한다. Catalog와 이 context를 정규화한 공동 digest가 두 생성 artifact의 동일한 `catalogVersion`이 된다.

## 그룹핑

`catalog:normalize`은 제목 정규화 결과와 서로 다른 Work 사이의 잠재 중복 후보를 함께 출력한다. 그룹핑 점수는 아키텍처 §2.1의 다섯 신호와 고정 가중치만 사용한다. 런타임에서는 자동 그룹핑하지 않는다.
