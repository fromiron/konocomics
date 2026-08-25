# Batch 005 selection QA

## 판정

- 판정: `PASS`
- reviewedByHuman: `false`
- 검수일: 2026-08-25
- 대상: `batch-005-selection-proposal.md`
- freeze 수행: `false`

수정된 proposal을 동일 staging snapshot에서 독립 재검증했다. 작품 선택, pool·frozen 배제, provenance 입력 count와 hash가 모두 일치한다.

## 검증 결과

- 제안 행: 50개, position 중복 0개, workId 중복 0개
- registry 일치: 50/50
  - `currentStatus=libraryOnly`
  - `targetStatus=recommendationVerified`
  - `promotionOutcome=pending`
  - `recommendationEligibilityStatus=ineligible`
  - `onboardingEligibilityStatus=ineligible`
- 독립 eligible pool: 1,264개; 제안 작품의 pool 소속 50/50
- frozen set: pilot-001 및 batch-002~004 각 50개, 총 200개 unique; 제안과 겹침 0개
- 제목: registry canonicalTitle과 50/50 일치; `『` 또는 `』` 포함 0개
- sourceCount: registry 합계 68; source-membership 행 수와 작품별 50/50 일치
- source type: `award=31`, `bookseller=15`, `editorial=4`; 복수 source type 작품 0개
- 시대 합계: 1989년 이전 8, 1990년대 6, 2000년대 16, 2010년대 12, 2020년대 8
- canonical mapping: 작품별 단일 candidate 및 included mapping 확인, title 불일치 0건
- safety: 50/50 `safe`, 누락·불일치 0건
- representative ISBN: 50/50 `matched / standard / true`, 누락·불일치 0건
- 기존 Gold·recommendationVerified·promotionBlocked 상태 작품과의 workId 중복 0건

## batch-ledger 재검증

제안서 수정 내용과 실제 파일이 일치한다.

- 경로: `data/staging/catalog-expansion/batch-ledger.csv`
- 실제 data rows: 200개 (header 제외)
- batchId별: `pilot-001=50`, `batch-002=50`, `batch-003=50`, `batch-004=50`
- SHA-256: `57e8627b7d06267b636173029769cac82c7030d651a1b04ac9b3fa4b6a603b7c`
- proposal 기재: `200 rows (pilot-001 and batch-002–004, 50 each)` 및 동일 hash

## 입력 snapshot hash

- promotion-registry.csv: `4058421824d4135959cdc19df2eb63027addd645a74465ca82949578f5df22f4`
- candidates.csv: `ad9fcafe3ca85ffab4e29a6b0aecc86e0134eecc3615b7faeaae53d62d2e1294`
- source-membership.csv: `187b2981a2fdc0c57e0c3bfbca1f92542371b5a8acf906d32dbbf460f26cfc1d`
- canonical-mapping.csv: `426d6aea72c7609f6ed828921b07c2832981447e7b41f18c4381c733b0fa9d8d`
- safety-review.csv: `965bce7bcf842ee7005c80a86efc0c36776a59acc2f71eaa55a3f8b7bba82bb7`
- rakuten-matches.csv: `70052da5afd94fa6428237d01916d04a8882af9e63c6e2dc047a90b0494cc824`
- batch-002/frozen-work-set.csv: `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6`
- batch-003/frozen-work-set.csv: `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd`
- batch-004/frozen-work-set.csv: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`

재검증 중 차이는 발견되지 않았다. 이 QA는 선택안 승인 기록이며 실제 `batch-005/frozen-work-set.csv` 생성이나 registry 변경을 승인하지 않는다.
