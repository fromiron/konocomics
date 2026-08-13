# Catalog source 운영 계약

`data/source/`는 공개 Catalog를 만드는 빌드 전용 원천이다. 생성 JSON은 직접 수정하지 않고 CSV와 evidence를 변경한 뒤 `catalog:validate`와 `catalog:build`로 다시 만든다.

## 파일 역할

- `works.csv`: Work 서지, eligibility, 주석 검토 provenance
- `aliases.csv`: Work 검색 별칭
- `volumes.csv`: Work에 속한 권과 대표권
- `factors.csv`: 17개 Axis의 known/unknown/notApplicable 값
- `themes.csv`: Theme 중심성 1/2
- `recommendation-context.csv`: 작품별 catalog 역할·시리즈·권수와 선택적 market snapshot 값
- `recommendation-config.csv`: catalog 전체 market 평균값(정확히 1행)
- `evidence/evidence.csv`: 기계 검증 가능한 evidence ID·범위·출처·검수 상태
- `evidence/*.md`: 작품별 관찰, 공식 보조 URL, 경계 판정 설명
- `reviews/*.md`: 사람 또는 사용자가 승인한 대체 게이트의 요청·판정 기록

## evidence 범위

`targetType=work`인 evidence는 해당 Work의 서지·Theme·Axis·대표권을 함께 검토한 work-scope 묶음이다. 이 범위를 사용하는 경우 `evidence/*.md`에 known 값의 관찰 근거와 불확실성을 남겨야 한다. 그 외 `axis`, `theme`, `volume` evidence는 `targetId`가 정확히 일치해야 한다. Validator는 ID·대상 연결과 누락을 검사하고, prose의 품질은 주석 검토 게이트가 심사한다.

## 주석 검토 상태

`annotationReviewMethod`은 다음 세 값만 사용한다.

- `unreviewed`: 주석 게이트 미통과. onboarding/recommendation eligibility를 켜면 validation 오류다.
- `human`: 실제 사람이 검토했다. work evidence의 `reviewedByHuman=true`, 검토 시각, 보고서가 모두 필요하다.
- `authorizedModelPanel`: 사용자가 명시적으로 허용한 대체 판정. 동일 증거를 독립 검토 경로에 제공하고 요구된 만장일치를 얻은 경우만 사용한다. 이 경우에도 `reviewedByHuman=false`를 유지한다.

검토 완료 상태에는 `annotationReviewedAt`과 `annotationReviewReference`가 모두 필요하며, 참조 보고서가 실제로 존재하지 않으면 validation이 실패한다.

## G1 동결·빌드 계약

- G1 cohort는 서로 다른 Work ID를 가진 정확히 50개 `recommendationEligible=true` 작품이다. 작품 목록과 정책 버전을 먼저 manifest로 동결하고, evidence audit·블라인드 표본·CLI 리포트가 모두 같은 목록을 사용한다.
- `docs/factors/annotation-guide.md`의 Art 근거 최소선을 50작품 전부에 동일하게 적용한다. 작품명·validator별 예외는 없고 coverage 통과만으로 evidence audit을 중단하지 않는다.
- 후보 빌더는 전체 source 후보를 sibling 임시 디렉터리에 만든 뒤 cohort·evidence·Catalog 검증을 모두 통과한 완성 디렉터리만 원자적으로 게시한다. 어느 단계에서든 실패하면 기존 후보와 `data/source/`는 byte-identical하게 유지한다.
- 블라인드 재태깅 표본은 동결 manifest의 ID만으로 결정론적으로 15~20%를 선택하고, 선택 목록을 원점수 공개 전에 기록한다. 입력에는 원점수를 넣지 않는다. 작품 목록이나 정책 버전이 바뀌면 기존 표본·조정 결과를 폐기하고 새 manifest에서 다시 선택한다.
- 근거 미달 작품을 교체할 때는 `06-implementation-plan.md`의 non-Art 거리와 다양성 보존 규칙을 사용하고, 전체 후보 주석·입력 hash·모든 조합의 거리·guard 결과·선택을 replacement manifest에 기록한다. 추천 결과를 본 뒤 후보를 바꾸지 않는다.

## G2 Catalog 주석 승격

- 현재 source는 G1의 50작품을 보존한 150작품 Catalog다. 기존 승인 49작품은 G1 provenance를 유지하고, 신규 100작품과 재개방한 `haikyu`는 `reviews/g2-catalog-annotation-panel.md`의 Catalog 주석 판정에만 결속된다.
- 승격 전 후보·생성물·4개 검토 경로·시각 evidence ZIP의 해시는 `data/staging/g2/g2-catalog-annotation-approval.json`에 동결되어 있다. 승격은 그 manifest와 정확히 101작품의 `annotationReview*` 세 필드만 갱신하며 주석 값과 evidence를 다시 쓰지 않는다.
- 이 상태는 150작품 Catalog 주석 승격만 승인한다. 제품 방향 G2와 Slice 5는 엔진 identity, 구현 diff, contract/metric 테스트, 결정론적 aggregate, 실제 브라우저 pilot을 같은 manifest로 동결한 별도 4경로 GO 전까지 닫혀 있다.

## 추천 context

모든 `recommendationEligible` 작품은 `recommendation-context.csv`에 정확히 한 행이 필요하다. `seriesGroupId`, `reviewAverage`, `reviewCount`는 결측을 허용하지만 `catalogRole`과 `volumeCount`는 필수다. 리뷰 0건을 확인한 대표권은 `reviewAverage`를 비우고 `reviewCount=0`으로 기록한다. `recommendation-config.csv`의 단일 `catalogAverageRating`은 `reviewAverage`가 있고 `reviewCount>0`인 대표권만 동일 가중으로 평균한 0~5 값이어야 한다. Catalog와 이 context를 정규화한 공동 digest가 두 생성 artifact의 동일한 `catalogVersion`이 된다.

## 그룹핑

`catalog:normalize`은 제목 정규화 결과와 서로 다른 Work 사이의 잠재 중복 후보를 함께 출력한다. 그룹핑 점수는 아키텍처 §2.1의 다섯 신호와 고정 가중치만 사용한다. 런타임에서는 자동 그룹핑하지 않는다.
