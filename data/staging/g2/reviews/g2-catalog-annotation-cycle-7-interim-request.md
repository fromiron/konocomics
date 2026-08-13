# G2 100작품 Catalog 주석 Cycle 7 중간 3경로 독립 검토 요청

## 1. 목적과 권한 경계

당신은 **konocomics (`fromiron/konocomics`)**의 독립 Catalog 주석 검토자다. 저장소를 수정하지 말고, 다른 검토자의 응답과 Cycle 1~6의 response/validity/report를 읽지 않은 상태에서 현재 동결 번들을 처음부터 직접 심사한다.

이번 실행은 데이터 변경 없이 증거를 보강하는 **중간 3경로 검토**다. 결과가 3/3 `GO`여도 기존 G2의 유효하고 조건 없는 `GO` 4/4 승격 계약을 3/3으로 바꾸거나 충족한 것으로 간주하지 않는다. Catalog 승격, `data/source` 승격, 제품 방향 G2, 사람 10명 블라인드 테스트, UI 변경, Slice 5, Vercel 배포는 모두 승인하지 않는다.

- 저장소: `konocomics (fromiron/konocomics)`
- 브랜치: `main`
- HEAD / origin/main: `cee70000f4af0a03476c9f09667e7c2d526fc814`
- exact-head GitHub Actions: run `31663821707`, quality job `94334070325`, conclusion `success`
- candidate version: `v1-61168a24beea`
- candidate-source bundle SHA-256: `85eb3d88598c5320bc9bb68c5f149a746f28ad854aba273969aff4002851b442`

GitHub tools/connectors가 있다면 live repository, exact commit, checks를 확인할 수 있다. live 검사는 아래 hash와 artifact identity 확인을 대체하지 않는다.

## 2. 독립 실행 identity

세 경로는 서로의 출력과 이전 cycle 기록을 읽지 않는다.

1. Local: 독립 Codex subagent
2. Gemini: `agy -p`, **`gemini-3.6-flash-high`**, effort high
3. Grok: Cursor `agent -p`, **`cursor-grok-4.6-high` non-fast**

실제 실행 model identity가 다르거나 Section 6의 단일 출력 계약을 따르지 않은 응답은 `INVALID`다.

## 3. 동결 후보와 필수 검사

승격 후보는 기존 G1 50작품을 integrity control로 유지하면서 추가되는 100작품과 다시 열린 `haikyu.relationshipStructure=2`다. 일관성을 위해 150작품 전부를 검사한다.

| 항목                            |                                             기대값 |
| ------------------------------- | -------------------------------------------------: |
| Candidate Work / Alias / Volume |                                    150 / 177 / 154 |
| Factor / Theme                  |                                         2550 / 462 |
| Recommendation context / config |                                            150 / 1 |
| Evidence / Art manifest         |                                          416 / 600 |
| Role                            |               Anchor 30 / Bridge 30 / Discovery 90 |
| Intended eligibility            | onboarding 40 / recommendation 150 / libraryOnly 0 |

- 새 100작품은 `reuse-eight` 8 + `fresh-a` 31 + `fresh-b` 31 + `fresh-c` 30이며 packet 간·기존 50과 disjoint여야 한다.
- 기존 49작품은 `authorizedModelPanel`; 새 100작품과 `haikyu`는 `unreviewed`다.
- 승인 전 issue는 정확히 `UNREVIEWED_ELIGIBILITY` 101, `AUTHORIZED_MODEL_PANEL_REVIEW` 49, `EVIDENCE_NOT_HUMAN_REVIEWED` 416뿐이어야 한다.
- `unknown`은 0/2가 아니다. 근거 부족을 known 값으로 채우면 안 된다.
- 새 100작품 각각의 bibliography, Genre, Theme, 13개 non-Art Axis를 공식·1차 또는 권리자 허용 source에서 직접 확인한다.
- 정적 Art 100작품은 실제 이미지를 열어 서로 다른 판독 가능한 내부 페이지 정확히 6장, 2개 이상 context, source/edition identity, 3개 known 값과 refs 일치를 확인한다.
- known motion 6작품은 숫자 page/panel 연속 장면을 실제로 열어 값까지 확인한다.
- URL 목록, narrative, validator, CI, visual ledger의 PASS 문자열은 source나 이미지 내용 검토를 대체하지 않는다. 접근하지 못한 항목은 0이 아닌 실제 수로 보고하되 `GO`로 확장하지 않는다.

Cycle 6에서 동결된 보정도 재검사한다.

```text
welcome-to-the-ballroom.status: completed -> ongoing
historie Volume 1 releaseDate: 2004-10-22 -> 2004-10-21
i-think-our-son-is-gay.relationshipStructure: 3 -> 2
my-brothers-husband.relationshipStructure: 3 -> 2
she-loves-to-cook-and-she-loves-to-eat.foundFamily: 2 -> absent
```

Art 재검수 대상은 `i-think-our-son-is-gay`, `requiem-of-the-rose-king`, `blue-period`, `arte`, `accomplishments-of-the-dukes-daughter`, `isabella-bird-in-wonderland`, `lovely-muco`다. KEEP controls는 `chi-on-the-movements-of-the-earth`, `chis-sweet-adventures`, `initial-d`다.

규범 우선순위대로 `docs/planning/02-product-spec.md`, `docs/factors/factor-dictionary.md`, `docs/factors/annotation-guide.md`, `docs/planning/06-implementation-plan.md` Slice 4, `docs/planning/07-acceptance-test-plan.md`를 읽는다.

## 4. 시각 bundle

Local canonical bundle은 `/home/bell/.cache/konocomics/cycle6-art`다. Local은 CSV나 ledger만 보지 말고 sheet 100개와 motion 6개를 실제로 연다. 다른 경로가 이 경로에 접근하지 못하면 접근했다고 주장하지 말고 공식 reader에서 동등 검사를 수행한다.

```text
ad1791add43508e7115dc0a001660ae4eeccd0ed2bf5deb86372178aea91a78b  index.csv
34576993cdaed5c555806e25439177007469da80bbb781c7fafa98f2d7a5ef15  known-motion-index.csv
af5d93dd460af50baf5193a377b8823c56924763c6b1ec70ab536cbe25df3f8c  audit.json
4937553c791c872ea18a151c4edf9d28ec78bfd4b7bb6d01ebb2b26c07ae370e  csv-audit.json
a6773dcfc570b43d4f71cddad894f0b85e86184db5dd64324037f0c467c46835  visual-inspection.md
4c8bec7b4d5f34e0d07139aabfc3f6e6e3bad802c6251c2cc78c2cdab7cc1ae0  static-sheets.sha256
4035bc84103d7ff53731b8945b27207665a2ec43619063b60f03b4444b08f6af  known-motion-sheets.sha256
8408df0a2a89c19808965753926c63397d003b03ccb5c199aa9ac35cb3459ea0  declared-artifacts.sha256
0660e9a488d337cdc7521793a33d3a3fc5f3a1cf43cc78a7aeb28a6fac658b2d  bundle-files.sha256 / bundle digest
6a0f832aa3a7baccbf9beeeec7ea215c4d4ac45da5ccbf3b806ec006a06b46b8  bundle.sha256
```

## 5. 동결 SHA-256

### Repository bundle digests

```text
85eb3d88598c5320bc9bb68c5f149a746f28ad854aba273969aff4002851b442  candidate-source bundle (10 files)
8fbd868b485edf8ed2d9a650fc5d5561987720b6879e8ee611b76159f94a8577  reuse-eight bundle (11 files)
d1240761811b396e7cd34504d71402fbd939f804cfa8cd81dd345c1aaf92e594  fresh-a bundle (11 files)
bf6c443274a1392667cab7eaab06cb2a3576b5d5f8a3286377ff519047579ed8  fresh-b bundle (11 files)
e9f8bb8a7f7da45d0f10849852cdabc8afaa88fb6f02c51375778db1552f59b0  fresh-c bundle (11 files)
```

### Declared repository files (31)

```text
16b2964b3a4669bc07213c0f2fa70577fe7a9feefedc77752b24b637931d2ca4  data/staging/g2/candidate-source/aliases.csv
356e1d2eba63bca92340860f06d3f94bd8049ae6000c1d3dd91461d2fee5fc8e  data/staging/g2/candidate-source/evidence/art-evidence-manifest.csv
266cad29ab74ccae937682b1dbf8adfa2c96cf03f67f4a45c43fde6869de575c  data/staging/g2/candidate-source/evidence/evidence.csv
4a0e3dc5450ac96250d23e84302ecd5554413f007adb751670ad59c4fb58973f  data/staging/g2/candidate-source/factors.csv
53f176328d441998917006e8e89ccbc2685798d4611ce40c66cea2775d94620d  data/staging/g2/candidate-source/recommendation-config.csv
87bc2661216c04b793449903bf8472714301fda3f75dd8de6c49d7b3b00ccf9d  data/staging/g2/candidate-source/recommendation-context.csv
382965a19ef75aeb03d051b2285eac0cd856acc2c016bb1635c3121627dac536  data/staging/g2/candidate-source/reviews/g1-sanity-panel.md
eef4ffffbc5f8570e224808479be764d204e30e4e0aa1dd522fe5cf42cb83f19  data/staging/g2/candidate-source/themes.csv
6fec4d757482328e9b609ce139ee2edcedfa7766be76a80bef35705857e1bf50  data/staging/g2/candidate-source/volumes.csv
80400ee58d9e33ce419237d779020b6b57e72f565c986c52026e5c479a1050ca  data/staging/g2/candidate-source/works.csv
8695c5646a388f049dc25dcd6af5b5db06437ea82d8755b6b008ea4b97b27abb  data/staging/g2/candidate-generated/catalog-v1.json
a802af6c04d5d3c81668493ff4af7eec5fba5169dc38578e3013f4a71752c171  data/staging/g2/candidate-generated/recommendation-context-v1.json
1b34a84865b6a5f099ea54a95aacbcc51d59e864cb41e4bf53d382dd08ba831e  data/staging/g2/candidate-generated/taste-vs-baseline.md
0687c2c36767ed230abda2a8050198175904b9b6b8a8258053b2d1b1d3b91f69  data/staging/g2/admission/fresh-a.json
f11310adb066e6813e5e127007f200d2cd682d2ca8b4ac1e5d9b151ed33760ff  data/staging/g2/admission/fresh-b.json
ee0b420f135ad0589f7f07f49e70df0c8198f3ec4831f7332f9662165b06874a  data/staging/g2/admission/fresh-c.json
1cbc4c7cc262d29c404b07f4b0aa8aedac5dbb823b20f3cae18dcf8bb0a70faa  data/staging/g2/reuse-eight/annotations-and-evidence.md
035b70ae01b00cd1b617b3ab5e24c7a37a7e65ce73b9a9a47f8b8a4fba59efba  data/staging/g2/fresh-a/annotations-and-evidence.md
9a61241b38bbdba5f416d64fe0b3e5cf74dac98602cea4efd898f30c0ccdb22f  data/staging/g2/fresh-b/annotations-and-evidence.md
80356529181607a671c2fcf1b4d528a7614a9178e6075886a36b92456fb38cad  data/staging/g2/fresh-c/annotations-and-evidence.md
117a562ed83b6c81d8529ac6e1522b0524a46372b7bdafe80f3bcd3bb2ea33c2  data/staging/g2/reuse-eight/intended-eligibility.csv
402fa2247e1568491cf4a098ed4ff6997f49cc46d4c194643ebc8ea1a5f81c24  data/staging/g2/fresh-a/intended-eligibility.csv
3ef2ac1e9e877e92747fa66c529eaad5d92e2bf1e3518e852b7c9f88783aa0b9  data/staging/g2/fresh-b/intended-eligibility.csv
fffbc944d3f00efdcd5f0359a65d29ab11821586712c7b266dc127359956cd03  data/staging/g2/fresh-c/intended-eligibility.csv
ad9e20bda260ae77bf89886cfafa779180f702683dafe00ecda066544ec60fb1  docs/planning/02-product-spec.md
82868ac1028da5a38bcaeed2db1f8fae1f4df0aaf5dc62bbe84aef1024c18475  docs/planning/06-implementation-plan.md
e9048e7bf2f71d1f26d844de5920621fbd80f111a4118362fa6f51abfbd84106  docs/planning/07-acceptance-test-plan.md
a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be  docs/factors/factor-dictionary.md
f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3  docs/factors/annotation-guide.md
8e1da282006496c8d3a68c7f4934147dd82906da28821d4d6f6bb2e22cc14c11  scripts/catalog/art-evidence.ts
7811ee6c451646a8bb4a5668949d62167aabcf76210b72ddc611cc7338a40bd6  tests/unit/catalog/art-evidence.test.ts
```

하나라도 다르면 `REVISE`다.

## 6. 단일 출력 계약

`GO`는 150/150, 새 100/100, 공식 source 100/100, 실제 정적 Art 100/100, known motion 6/6을 독립 검사하고 수정 필수 항목이 없을 때만 가능하다. 미검사·접근 불가를 승인으로 확장하면 `REVISE`다. `GO with conditions`는 없다.

첫 줄은 정확히 `VERDICT: GO`, `VERDICT: REVISE`, `VERDICT: NO-GO` 중 하나다. 이후 아래를 모두 채운다.

```text
REVIEWER: Local | Gemini 3.6 Flash High | Cursor Grok 4.6 High non-fast
EXECUTION IDENTITY: <subagent identity 또는 exact CLI/model/effort/fast 설정>
REPOSITORY: konocomics (fromiron/konocomics)
BRANCH: main
HEAD: cee70000f4af0a03476c9f09667e7c2d526fc814
CANDIDATE BUNDLE SHA-256: 85eb3d88598c5320bc9bb68c5f149a746f28ad854aba273969aff4002851b442
PREVIOUS RESPONSE/VALIDITY/REPORT FILES READ: 0
DECLARED REPOSITORY FILES CHECKED: <actual n>/31
REPOSITORY BUNDLE DIGESTS CHECKED: <actual n>/5
ALL CANDIDATE WORKS CHECKED: <actual n>/150
NEW WORKS CHECKED: <actual n>/100
OFFICIAL/PRIMARY WORK SOURCE SETS ACTUALLY OPENED: <actual n>/100
STATIC ART WORKS WHOSE IMAGES WERE ACTUALLY OPENED: <actual n>/100
KNOWN MOTION SEQUENCES WHOSE IMAGES WERE ACTUALLY OPENED: <actual n>/6
LOCAL VISUAL LEDGERS CHECKED: <actual n>/2 | inaccessible-not-claimed | <boundary>
REOPENED CHECK: haikyu.relationshipStructure

REQUIRED QUESTIONS:
1. IDENTITY/HASH: PASS | FAIL — <evidence>
2. SCOPE/DISJOINTNESS: PASS | FAIL — <evidence>
3. BIBLIOGRAPHY: PASS | FAIL — <evidence and actual source-open boundary>
4. GENRE/THEME: PASS | FAIL — <evidence>
5. NON-ART/UNKNOWN: PASS | FAIL — <evidence>
6. ART/MOTION: PASS | FAIL — <actually opened images and access boundary>
7. PROVENANCE: PASS | FAIL — <evidence>
8. ROLE/ELIGIBILITY/PIPELINE: PASS | FAIL — <evidence>
9. PROMOTION BOUNDARY: PASS | FAIL — <non-authorizing interim scope>

PACKET CHECKS:
- reuse-eight: PASS | REVISE — <actual n>/8
- fresh-a: PASS | REVISE — <actual n>/31
- fresh-b: PASS | REVISE — <actual n>/31
- fresh-c: PASS | REVISE — <actual n>/30
- existing G1 controls: PASS | REVISE — <actual n>/50
- haikyu.relationshipStructure: PASS | REVISE — <evidence>

CYCLE 6 FROZEN CORRECTIONS:
- bibliography/status/theme/relationship: PASS | REVISE — <actual n>/5
- Art refs/contexts: PASS | REVISE — <actual n>/7
- protected KEEP controls: PASS | REVISE — <actual n>/3

BLOCKERS:
- <none or workId.field: current -> required + exact evidence>

INTERIM THREE-PATH EVIDENCE: ACCEPT | REVISE | REJECT
PROMOTION AUTHORIZATION: NO
PRODUCT-DIRECTION G2 AUTHORIZATION: NO
PRODUCT UI CHANGE AUTHORIZATION: NO
SLICE 5 AUTHORIZATION: NO
```
