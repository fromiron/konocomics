# 09 — Catalog authoring 권한과 SQLite source-of-truth

> 목표는 어떤 모델을 candidate 생성에 사용해도 동일한 canonical source와 동일한 비모델 권한 입력이면 동일한 사실·판정·승격 결과를 만드는 것이다. S0~S5의 shadow 증명을 마친 뒤 2026-08-28 승인된 S6에서 `data/source/catalog.sqlite`가 table-backed Catalog의 유일한 원천이 됐다.

## 1. 범위와 우선순위

- `02-product-spec.md`의 제품·추천 계약과 `factor-dictionary.md`의 팩터 의미가 이 문서보다 우선한다.
- 이 문서는 Catalog authoring 권한, source snapshot, 판정 digest, SQLite authority/shadow의 단일 계약이며 framework migration보다 우선한다.
- 제품 런타임은 생성된 정적 JSON과 순수 TypeScript만 사용한다. Dexie schema, 두 Rakuten server route, 추천 산식, 설명 생성, Export/Import는 바꾸지 않는다.
- tracked SQLite는 빌드 타임 Catalog 원천 하나만 허용한다. ORM, 새 의존성, runtime database, runtime LLM은 추가하지 않는다.

## 2. 권한 계약

1. S6의 table-backed 쓰기 권한과 최종 진실 원천은 `data/source/catalog.sqlite`다. 12개 Markdown 근거 문서는 같은 디렉터리의 opaque authority로 남는다. 삭제된 9개 CSV를 canonical source로 다시 두거나 SQLite와 함께 두는 dual authority는 거부한다.
2. 새 모델 출력은 `data/source/` 밖의 격리된 candidate artifact다. candidate의 존재·부재·순서·충돌·confidence·provider·model·attempt·citation은 accepted fact, `manualReview`, eligibility, blocker, promotion, semantic digest, verdict에 영향을 주지 않는다.
3. candidate 간 충돌은 진단 정보일 뿐 `manualReview`나 `pending`을 만들지 않는다.
4. 사실 resolution은 candidate와 독립적으로 고정된 비모델 권한이나 candidate-independent 결정론적 source 검증만 만들 수 있다. 모델이 제안한 값을 단순 승인하는 절차는 권한이 아니다.
5. `accepted`, `explicitUnknown`, `notApplicable`, `rejected`, `manualReview`는 비모델 resolution 상태다. 모델 수·모델명·응답 일치율로 이 상태를 정하지 않는다.
6. 기존 `authorizedModelPanel` 1,481행은 완료된 legacy provenance로 보존한다. 이 값은 신규 주석의 일반 권한 경로가 아니며 S0~S5에서 재판정하거나 `human`으로 바꾸지 않는다.

S4는 cutoff manifest의 exact path·hash·row tuple과 일치하는 기존 값에만 `authorityKind=legacySnapshot` 호환 resolution을 만들 수 있다. 이는 현재 결과를 재현하기 위한 candidate-independent 고정 입력이며 과거 모델 패널을 비모델 evidence나 사람 검수로 재분류하지 않는다. 새 사실을 수용하거나 cutoff 범위를 확장할 수 없고, 이후 정정은 별도 비모델 resolution로 provenance를 보존해 supersede한다.

## 3. 동결된 legacy 경계

현재 baseline은 다음 값을 그대로 보존한다.

- Work 1,614개: `authorizedModelPanel` 1,481개, `unreviewed` 133개.
- evidence 2,458개: model 1,490개, publisher 648개, Rakuten 250개, manual 70개. 전부 `reviewedByHuman=false`다.
- Gold Set 150개와 그 ID·주석·추천 계약.
- G2의 `humanValidation: "not-run"`, null human metrics, human 0 / synthetic pilot 1 / `INCOMPLETE` 경계.

이 snapshot은 migration 입력이지 사람 검증이나 신규 모델 권한의 근거가 아니다.

## 4. 단계와 중지선

| 단계 | 범위 | 완료 조건 |
|---|---|---|
| **S0** | 이 권한·digest·rollback 계약 확정 | 문서 간 모순 없음, legacy snapshot 확인 |
| **S1** | Node 24 SQLite shadow import/export | source·생성 artifact·promotion 결과 무변경 |
| **S2** | 판정 로직을 순수 결정 커널로 일원화 | 같은 judgment input에 byte-identical decision |
| **S3** | 모델 candidate 저장·실행 격리 | candidate 변화가 resolution·decision에 영향 없음 |
| **S4** | legacy resolution bootstrap | cutoff-bound `legacySnapshot`; 기존 값·라벨·human-not-run 불변 |
| **S5** | SQLite 기반 shadow judgment | 현행 결과와 exact parity, source 권한 유지 |
| **S6** | authoring 권한 전환 | **2026-08-28 승인·완료:** tracked SQLite 단일 권한, CSV 삭제, parity·rollback gate |

S0~S5는 CSV 권한을 보존한 채 수행한 cutover 증명 이력이다. S6은 그 결과와 별도 사용자 승인을 바탕으로 진행됐으며, 이후 일반 authoring은 SQLite candidate copy의 전체 검증과 원자적 교체를 통과해야 한다.

S3부터 동결된 model-panel 경로의 read-only `--check`는 보존하되 새 write는 public entry에서 파일 I/O 전에 거부한다. 대상은 promotion overlay, community adjudication, pilot, batch 002~005의 공유 publisher와 write-only `promoteG2Catalog`다. G1 staging·Rakuten library-only·canonical repair처럼 모델 claim을 authoring 권한으로 쓰지 않는 경로와 공용 atomic publish helper는 이 차단 대상이 아니다.

## 5. Source snapshot과 row identity

`data/source/` 아래 regular file을 재귀 탐색하고 `/` 구분의 상대 경로를 code-unit 순으로 정렬한다. S6의 허용 layout은 `catalog.sqlite` 하나와 opaque Markdown 12개, 총 13개 파일이다.

- SQLite table 9개: `source_works`, `source_aliases`, `source_volumes`, `source_factors`, `source_themes`, `source_recommendation_context`, `source_recommendation_config`, `source_evidence`, `source_art_evidence_manifest`. 각각의 logical projection path는 이전의 `works.csv`, `aliases.csv`, `volumes.csv`, `factors.csv`, `themes.csv`, `recommendation-context.csv`, `recommendation-config.csv`, `evidence/evidence.csv`, `evidence/art-evidence-manifest.csv`다.
- opaque file 12개: `README.md`, `evidence/seed-annotations.md`, `reviews/*.md` 10개.

canonical DB에는 위 9개 `STRICT` source table만 있고 `source_file`, `source_import`, candidate, resolution, judgment, view, trigger를 두지 않는다. S0~S5 증명용 OS 임시 shadow만 opaque raw bytes와 proof table을 가진다.

Bootstrap과 임시 CSV projection은 fatal UTF-8로 decode한다. 선두 UTF-8 BOM은 첫 header 이름에서만 제외하고, malformed quoting·열 수 불일치·빈 header·중복 header는 거부한다. 빈 record는 건너뛰되 physical line 계산에는 포함하며, cell은 `trim`·타입 강제 변환 없이 lexical string으로 저장한다. 각 SQLite record에는 다음 두 순서를 둔다.

- `sourceOrdinal`: header를 제외한 parsed record의 1-based 순서. table primary key, export 순서, semantic digest에 사용한다.
- `sourceLine`: header·빈 줄을 포함한 원본에서 record가 끝나는 1-based physical line. 오류·감사용이며 digest와 정렬에는 사용하지 않는다.

## 6. 임시 projection과 parity

- 기존 CSV-shaped validator·staging 도구가 필요할 때만 9개 logical CSV를 OS 임시 디렉터리에 투영한다. canonical source에는 남기지 않는다.
- 12개 opaque file은 canonical 파일에서 byte-for-byte 복사한다. S0~S5 proof shadow에서는 `source_file.raw_bytes`에서 export한다.
- CSV serializer는 UTF-8 without BOM, LF, 고정 header 순서, source 순서, 정확히 마지막 LF 하나를 사용한다. comma·quote·CR·LF가 있는 cell만 quote하고 내부 quote는 두 번 쓴다.
- 일반 valid CSV의 semantic parity는 `[normalizedPath, sourceOrdinal, columnName, lexicalValue]` tuple digest로 비교한다. quote/BOM/빈 줄·checkout EOL 표기 차이는 의미가 아니다.
- S1 baseline의 9개 CSV는 별도 golden probe에서 export bytes가 baseline HEAD `b8463b31ff58332fee8762dccb733ac902982cea`의 canonical Git blob과 정확히 같아야 한다. working-tree raw snapshot은 별도로 보존하며, golden 불일치를 semantic parity로 낮춰 통과시키지 않는다.
- opaque raw BLOB mutation은 opaque export만 바꾸고, CSV table mutation은 해당 CSV export만 바꾸는 isolation probe를 통과해야 한다.
- cutover proof의 export 결과를 기존 loader·validator·builder·promotion registry에 다시 넣어 기존 생성 artifact bytes와 직렬화된 promotion registry가 같아야 한다. S6 이후 primary loader·validator·builder·promotion registry는 SQLite를 직접 읽는다.

## 7. 판정 digest 계약

모든 semantic digest는 고정 field 순서의 JSON array를 `JSON.stringify`하고 UTF-8 without BOM으로 encode한 bytes의 lowercase SHA-256이다. 배열 항목은 기존 `compareText`와 같은 code-unit comparator로 각 canonical tuple 문자열을 정렬한다. 중복 stable fact key나 중복 source path는 digest 전에 거부한다.

단계 소유권은 S2가 순수 판정 결과와 reason/blocker code 정규화까지만, S4가 실제 `acceptedFactsDigest`·`resolutionSetDigest` 생성을, S5가 실제 `judgmentInputDigest`·`decisionDigest` 생성을 맡는다. 해당 입력 identity가 존재하기 전에는 빈 값·placeholder·합성 digest를 만들지 않는다.

- resolution tuple field 순서는 `[factKey, state, valueType, lexicalValue, authorityKind, authorityArtifactDigest, citationSetDigest, reasonCode]`다. `state`는 `accepted|explicitUnknown|notApplicable|rejected|manualReview` 중 하나이며 값이 없는 상태는 `valueType="none"`, `lexicalValue=""`를 쓴다.
- `acceptedFactsDigest`: effective `accepted|explicitUnknown|notApplicable` resolution tuple 배열의 digest. 신규 resolution은 비모델 권한만, legacy는 위 cutoff-bound `legacySnapshot`만 허용한다.
- `resolutionSetDigest`: effective 다섯 상태 전체의 resolution tuple 배열 digest.
- source manifest는 candidate·diagnostic 경로를 제외한 `data/source/`만 포함한다. table CSV entry field 순서는 `[path, "tableCsv", headerArray, lexicalRowTupleDigest]`, opaque entry는 `[path, "opaqueFile", rawSha256, byteLength]`이며 canonical entry 문자열을 code-unit 순으로 정렬한다.
- 모델 candidate·모델 공급 citation·diagnostic과 최종 promotion reason/blocker code는 source manifest와 두 resolution digest에서 모두 제외한다.
- `judgmentInputDigest` tuple field 순서는 `[targetType, targetId, sourceManifestDigest, acceptedFactsDigest, resolutionSetDigest, factorDictionaryIdentity, annotationGuideIdentity, policyIdentity, decisionSchemaIdentity, engineManifestDigest, contextMarketIdentity, goldManifestIdentity, legacyRegistryEvidenceIdentity]`다. 기존 12개 위치는 유지하고 legacy registry 입력 identity를 13번째에 추가한다. 각 `*Identity`는 `[version, exactArtifactDigest]`이고 `engineManifestDigest`는 normalization과 판정 커널의 transitive source manifest를 결속한다.
- `decisionDigest` tuple field 순서는 `[judgmentInputDigest, verdict, sortedUniqueReasonCodes, sortedUniqueBlockerCodes]`다. 두 code 배열은 각각 code-unit 순으로 정렬한다.

환경의 Node patch, SQLite version, OS, architecture, 절대 경로, 실행 시각은 audit metadata일 뿐 semantic digest에 넣지 않는다.

S5의 `legacyRegistryEvidenceIdentity`는 `legacy-registry-evidence-v1`과 다음 6개 CSV의 repo-relative path·고정 header·lexical tuple digest로 만든 source manifest digest다: `source-registry.csv`, `source-membership.csv`, `canonical-mapping.csv`, `safety-review.csv`, `promotion-blockers.csv`, `batch-ledger.csv`. 현재 고정 digest는 `e2aed5340ea7e71d849fad767637a592906999e4e23ef1927129a0785de73bbe`다. 이 파일들은 판정의 provenance·identity·safety·blocker·batch timestamp에 실제로 쓰이므로 source manifest와 별도의 판정 입력으로 결속한다. 그 밖의 catalog-expansion staging 파일은 identity에서 제외하되 기존 전체 validator를 계속 통과해야 한다. 위 6개 파일의 row 순서는 `sourceOrdinal` 의미이므로 순서 변경도 identity 변경이다.

Markdown·TypeScript identity text는 fatal UTF-8, BOM 거부, CRLF→LF, lone CR 거부를 적용하며 trim·Unicode normalization·마지막 LF 추가/제거를 하지 않는다. generated recommendation context와 Gold manifest도 같은 canonical artifact bytes 전체를 hash한다. promotion policy identity는 두 정책 문서의 `[repoRelativePath, canonicalTextSha256]` manifest를, decision schema identity는 허용 status·verdict·reason·blocker vocabulary descriptor를 결속한다.

`engineManifestDigest`의 root는 `scripts/build-promotion-registry.ts`와 `scripts/catalog/promotion-judgment.ts`다. local static import와 type-only import/export closure를 재귀 탐색해 각 source의 canonical text digest를 넣고, 외부 semantic dependency는 lockfile의 `csv-parse@7.0.2`, `zod@4.4.3`만 포함한다. Node built-in, Node patch, SQLite, tsx·TypeScript·test runner, package/lockfile 전체, UI·runtime·Dexie·server·test·문서는 제외한다.

S4의 resolution universe는 candidate가 주소화할 수 있는 `factor|theme|genre` 의미 사실만이다. 서지·판본·confidence·evidence·eligibility·recommendation context·promotion 필드는 source manifest가 결속하는 source 입력으로 남기며 resolution으로 복제하지 않는다. 현재 cutoff는 Factor 27,438행, 존재하는 Theme 2,565행, 존재하는 Genre membership 3,232행으로 총 33,235 resolution이다. 존재하지 않는 Theme·Genre membership은 명시적 거부가 아니므로 resolution을 만들지 않는다.

S4 canonical encoding은 다음과 같다.

| Source 사실 | state | valueType | lexicalValue |
|---|---|---|---|
| Factor `known` | `accepted` | `integer` | 원본 lexical `0|1|2|3|4` |
| Factor `unknown` | `explicitUnknown` | `none` | 빈 문자열 |
| Factor `notApplicable` | `notApplicable` | `none` | 빈 문자열 |
| 존재하는 Theme | `accepted` | `integer` | 원본 lexical `1|2` |
| 존재하는 Genre membership | `accepted` | `boolean` | `true` |

Factor `notApplicable`은 Factor Dictionary v1의 조건부 축인 `motionImpact`에만 허용하며 다른 Axis와의 조합은 첫 resolution insert 전에 거부한다. 모든 legacy tuple은 `authorityKind=legacySnapshot`, `authorityArtifactDigest=adf3f21c1be5ce6cb5691bd97cb4a03dc1bfd828c76697445621c9bf12171542`, `citationSetDigest=4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945`(`SHA-256(JSON.stringify([]))`), `reasonCode=LEGACY_SNAPSHOT_CUTOFF`를 쓴다. cutoff baseline commit은 `b8463b31ff58332fee8762dccb733ac902982cea`다.

Bootstrap은 `source_import`의 저장값만 신뢰하지 않는다. 첫 insert 직전에 현재 SQLite의 `source_*` lexical row와 opaque `source_file` BLOB에서 source manifest를 다시 계산하고, 재계산값·저장된 manifest·고정 cutoff manifest 및 저장된 baseline commit·고정 cutoff commit이 모두 일치해야 한다. `fact_resolution`은 하나의 `STRICT` table만 두며 비어 있지 않으면 교체하지 않고 실패한다. 두 resolution digest는 저장된 8-field tuple에서 매번 재계산하고 별도 digest cache table을 두지 않는다.

S3 candidate ingest는 `work:<workId>:factor:<axisId>`, `work:<workId>:theme:<themeId>`, `work:<workId>:genre:<genreId>`만 허용한다. `workId`는 현재 shadow의 `source_works`에 정확히 한 행이어야 하고 나머지 ID는 각각 고정 Axis·Theme·Genre vocabulary에 속해야 한다. ingest의 source manifest 표기는 현재 `source_import.source_manifest_digest`와 일치해야 하며, candidate citation은 URL 배열을 exact 중복 제거·code-unit 정렬한 compact JSON이다. 이 검증은 candidate에 source 권한을 주지 않고 잘못된 diagnostic provenance와 decision field 위장을 거부하기 위한 경계다.

## 8. S0~S5 one-time cutover proof

- `pnpm catalog:shadow`는 고정 parent Git snapshot을 OS temp에 복원해 S0~S5 cutoff를 증명하는 one-time/manual gate다. 일반 authoring을 동결하므로 S6 이후 ongoing CI에는 넣지 않는다.
- 명령은 Node 24 LTS에서만 성공해야 한다. 다른 major는 source mutation 전에 실패한다.
- SQLite는 OS 임시 디렉터리에 만들고 한 writer·한 transaction·`journal_mode=DELETE`로 import한 뒤 `integrity_check`, close, read-only reopen을 통과한다.
- 성공·실패 모두 DB와 `-wal`·`-shm` 및 export temp를 정리한다. tracked tree와 `data/source/`는 byte-identical해야 한다.
- source file raw snapshot, lexical tuple digest, 현재 CSV byte golden, opaque bytes, 기존 generated artifact, serialized promotion registry를 각각 비교한다.
- 실행 이력용 실제 Node/SQLite/OS/architecture는 결과에 기록하되 semantic 판정에는 사용하지 않는다.
- 이 gate 중 하나라도 실패하면 cutover proof는 실패다. 우회 export나 기존 source 덮어쓰기로 실패를 숨기지 않는다.

S1은 저장소 전체 pairwise 조합을 새로 전수 검사하지 않는다. 기존 validator와 golden을 재사용하는 것이 같은 계약을 가장 작은 범위로 검증한다.

## 9. S5 shadow judgment

- SQLite에는 `targetType="promotion"`, `targetId=workId`인 하나의 `STRICT judgment_run` table만 둔다. 저장 열은 `judgmentInputDigest`, `currentStatus`, `verdict`, canonical reason/blocker JSON, `decisionDigest`뿐이며 run ID·시각·cache·history·candidate FK·trigger·view는 두지 않는다.
- registry row adapter가 기존 `registryReasonCodes`와 S2 `decidePromotionJudgment`를 호출한다. SQLite나 shadow orchestration에서 reason·blocker·verdict 로직을 다시 구현하지 않는다.
- SQLite source export를 기존 catalog builder와 promotion loader/validator/builder에 넣은 뒤 13-field input digest와 4-field decision digest를 계산한다. 모든 1,614행을 메모리에서 검증한 다음 한 transaction으로 insert하고 exact readback한다.
- candidate-free fresh shadow와 maximal candidate fresh shadow는 judgment row·digest가 정확히 같아야 한다. 6개 legacy registry 입력 중 하나라도 바뀌거나 row 순서가 바뀌면 고정 identity gate가 insert 전 실패하고 `judgment_run`은 0행이어야 한다.
- close/read-only reopen 뒤 source·resolution·모든 identity와 judgment를 재계산한다. generated artifact·promotion registry bytes와 Gold 150 / verified 1,291 / blocked 173 / pending 0은 기존과 같고, 성공·실패 모두 임시 DB/export를 삭제하며 tracked tree는 변하지 않아야 한다.
- S5 당시에는 shadow 증명만 추가했고 authoring 권한을 옮기지 않았다. 이후 별도 승인으로 아래 S6을 수행했다.

## 10. S6 SQLite authority

- canonical authority는 `data/source/catalog.sqlite` 하나다. `PRAGMA user_version=1`, 정확히 9개 `STRICT` rowid table, 기준 DDL의 `CHECK`·column·type·PK와 일치해야 하며 view·trigger·journal sidecar를 허용하지 않는다.
- ongoing `pnpm catalog:authority:verify`는 layout, integrity, schema identity, 연속 `sourceOrdinal`, canonical `sourceLine`, opaque path set을 검증한다. `pnpm catalog:authority:verify-cutover`와 `pnpm catalog:shadow`는 삭제된 9개 CSV 및 S0~S5 cutoff와의 일회성 이관 증명이다.
- 일반 reader는 SQLite를 직접 읽는다. CSV compatibility가 필요한 frozen validator·staging 흐름은 OS 임시 projection만 사용하고 성공·실패 모두 제거한다.
- legitimate writer는 현재 DB를 candidate로 복사하고 `BEGIN IMMEDIATE` 안에서 table을 교체한 뒤 전체 schema·Catalog 검증을 수행한다. commit·close 뒤 read-only exact readback과 sidecar 부재를 확인한 candidate만 canonical DB와 원자적으로 교체한다. 검증 실패 전에는 현재 DB가 바뀌지 않는다.
- model-derived writer는 파일 I/O 전에 계속 실패한다. candidate 입력의 provider·model·attempt·순서·수·confidence·citation은 accepted fact나 판정 digest에 포함되지 않는다.
- runtime은 SQLite를 열지 않는다. build가 생성한 정적 JSON과 순수 TypeScript 추천 커널만 배포한다.
- 이관 자체의 rollback은 정확한 이전 Git commit revert다. authoring 중 실패 rollback은 미게시 candidate 삭제이며, publish 중 실패는 공용 atomic publish helper가 기존 source를 복구한다.
