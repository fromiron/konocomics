# 검증 완료 113작품의 정식 Catalog 반영

## 승인과 범위

2026-09-12 사용자가 검증된 후보의 DB 반영과 로컬 커밋을 승인했다. 이어 테스트는 CI/CD에서 수행하므로 이번 커밋에서는 실행하지 말라고 지시했다. 푸시·배포는 수행하지 않는다.

- 입력: `recovery-factor-382-publication-20260912-v1`, 후보 SHA-256 `c6aa308cbe236c8bdd4b3e80ff132c7bac2c7d6b3e400617cfed32ebca0f5497`.
- 입력 publication manifest: `690469180afd6aec06b80521356b34cbfe73b789ca0af714d7952bdc186ce097`.
- 신규 등록 73작품과 기존 library-only 승격 40작품, 합계 113작품 및 해당 판정 근거만 반영했다. 미발행 `recovery-factor-386`과 다른 미승격 후보는 제외했다.
- 기존 추천 가능 1,455작품, 비대상 행, 기존 evidence, Gold Set, 서지 metadata 2행을 보존했다. 판정은 `authorizedEvidencePanel`이며 사람 검수로 재분류하지 않았다.

## 적용 결과

기존 CSV 임시 projection·대상별 merge·SQLite finalize·원자적 directory publication 경로를 재사용했다. 9개 CSV를 정식 source로 복구하지 않았다. 36개 review Markdown은 원본 바이트로 반영했다.

- 적용 전 DB: `a302787fd0f1408b6a0798fd9a1fe4ed6cc42d484fac720bb631a01b3c03f74f`.
- 적용 후 DB: `af419480bb3a99863662b621969b103667316bf7114db1a0bda5939ab44c5cab`.
- source snapshot: `2c167dfd82fdda44cf57809cd0b41ef28d21d8259b4283855deb6c7b55c16937`.
- 정식 Catalog: 총 **1,700작품 / 추천 가능 1,568작품 / library-only 132작품**.
- 생성 데이터: `v1-a6997804fb18`. 앱용 정적 JSON·추천 profile·context·identity·landing 및 버전별 public asset을 갱신했다.

전체 대상 ID·원본 source·준비/적용 receipt는 로컬 작업 저장소의 `runs/canonical-promotion-20260912-v1/`에 보존한다. 최초 적용은 Windows 폴더 이동 `EPERM`으로 차단됐고 기존 DB는 변경되지 않았다. 사용자가 개발서버를 중지한 후 재시도하여 원자적 교체와 source readback을 완료했다. 실패 자료와 적용 전 DB도 보존했다.

## 검증 범위와 후속 경계

DB 반영에 필요한 입력 manifest·hash·대상 membership·비대상/evidence 보존·SQLite authority·Gold 보호 및 적용 후 exact source readback만 확인했다. 생성은 `buildCatalog(..., { compact: true, verify: false })`를 사용했다.

사용자 지시에 따라 **테스트·lint·typecheck·제품 빌드·브라우저 검증은 실행하지 않았다.** 이번 정식 반영의 제품 흐름 및 CI 성공을 주장하지 않는다. 테스트 fixture나 기존 기대값은 변경하지 않았다.

원본 Factor 003 소실은 복구되지 않았으며 전체 승격 목표는 미완료다. 기존 recovery epoch·동결 입력/결과는 불변이다. 이전 canonical hash를 결속한 미발행 판정 및 후속 authoring은 이번 canonical 전환의 lineage를 확인한 뒤 진행해야 한다. 이 커밋은 해당 도구 전환이나 미발행 판정의 자동 재승인을 포함하지 않는다.
