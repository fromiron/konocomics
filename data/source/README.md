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

## 추천 context

모든 `recommendationEligible` 작품은 `recommendation-context.csv`에 정확히 한 행이 필요하다. `seriesGroupId`, `reviewAverage`, `reviewCount`는 결측을 허용하지만 `catalogRole`과 `volumeCount`는 필수다. `recommendation-config.csv`의 단일 `catalogAverageRating` 값은 0~5 범위여야 한다. Catalog와 이 context를 정규화한 공동 digest가 두 생성 artifact의 동일한 `catalogVersion`이 된다.

## 그룹핑

`catalog:normalize`은 제목 정규화 결과와 서로 다른 Work 사이의 잠재 중복 후보를 함께 출력한다. 그룹핑 점수는 아키텍처 §2.1의 다섯 신호와 고정 가중치만 사용한다. 런타임에서는 자동 그룹핑하지 않는다.
