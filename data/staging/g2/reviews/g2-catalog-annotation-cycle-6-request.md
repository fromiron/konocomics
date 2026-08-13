# G2 100작품 Catalog 주석 승격 독립 패널 요청 — Cycle 6

## 1. 역할과 동결 identity

당신은 **konocomics (`fromiron/konocomics`)**의 독립 Catalog 주석 검토자다. 저장소를 수정하지 말고, 다른 검토자의 응답이나 이전 cycle의 response/report를 읽지 않은 상태에서 현재 동결 번들을 처음부터 직접 심사한다.

- 저장소: `konocomics (fromiron/konocomics)`
- 브랜치: `main`
- HEAD / origin/main: `543fd59fe5fc1e030fa98009b6c5fcf1a86cc209`
- exact-head GitHub Actions: run `31660364965`, quality job `94323731086`, conclusion `success`
- GitHub tools/connectors가 있다면 live repository, 정확한 commit과 checks를 직접 검사할 수 있다. live 검사는 아래 hash/artifact identity 확인을 대체하지 않는다.

승격 대상은 기존 G1 50작품을 integrity control로 유지하면서 추가되는 100작품과 다시 열린 `haikyu.relationshipStructure=2`다. 후보 전체의 일관성을 위해 150작품 전부를 검사한다.

이 요청의 `GO`는 Catalog 주석 승격만 뜻한다. Taste Engine 대 Baseline의 제품 방향, 사람 10명의 블라인드 테스트, `data/source` 승격, UI 변경, Slice 5 시작, Vercel 배포는 허가하지 않는다. 네 검토자의 유효하고 조건 없는 `GO` 4/4와 사용자의 별도 승인 전에는 아무것도 승격하지 않는다.

## 2. 독립 검토 경로

- Local, Gemini, Cursor Grok, GPT-5.6 Pro Oracle은 서로의 응답과 이전 cycle의 response/report를 읽지 않는다.
- Grok은 Cursor `agent -p`의 **`cursor-grok-4.6-high` non-fast**만 사용한다.
- Oracle은 **ChatGPT.com의 GPT-5.6 Pro**이며 Grok이나 다른 CLI 모델로 대체하지 않는다. 프로젝트명·저장소·브랜치·HEAD와 GitHub connector 범위를 이 요청 그대로 제공한다.
- 모델 패널은 사람 검수가 아니다. 승인 뒤에도 evidence의 `reviewedByHuman=false`를 유지한다.

## 3. Cycle 6 수정 범위

현재 HEAD의 diff와 원본 source를 직접 확인한다.

### 3.1 서지·상태·Theme·관계축

```text
welcome-to-the-ballroom.status: completed -> ongoing
historie Volume 1 releaseDate: 2004-10-22 -> 2004-10-21
i-think-our-son-is-gay.relationshipStructure: 3 -> 2
my-brothers-husband.relationshipStructure: 3 -> 2
she-loves-to-cook-and-she-loves-to-eat.foundFamily: 2 -> absent
```

- `welcome-to-the-ballroom`은 공식 연재 페이지 `https://gmaga.co/c/ballroomheyoukoso/`의 현재 `連載中` 표기를 별도 status evidence로 연결했다.
- Historie는 공식 Kodansha 상품 `0000030267`의 ISBN `9784063143584`와 발매일을 사용했다.
- 관계축 `2`는 고정 핵심 관계, `4`는 다중 관점과 복잡한 관계망 자체가 반복 보상인 경우라는 SSOT 경계를 적용했다.
- 단순 이웃 GL/식사 관계를 `foundFamily`로 확장하지 않았다.

### 3.2 Art evidence 재검수

값과 confidence는 유지하고, cover·전용 title/chapter splash·frontispiece·blank·UI·crop을 제외한 실제 내부면으로 refs와 contexts를 정정했다.

| Work                                    | 현재 정적 refs                                       | 값 (`realism/density/softness`, motion) |
| --------------------------------------- | ---------------------------------------------------- | --------------------------------------- |
| `i-think-our-son-is-gay`                | Pixiv `74681640 p0-p2`, `74791760 p0-p2`             | `1/1/3`, `unknown`                      |
| `requiem-of-the-rose-king`              | Akita p6-p11; contexts만 정정                        | `3/4/2`, `unknown`                      |
| `blue-period`                           | Kodansha left-turn states 4/6/8/10/12/14             | `2/3/3`, `unknown`                      |
| `arte`                                  | Zenon turns 2-7                                      | `3/4/2`, `unknown`                      |
| `accomplishments-of-the-dukes-daughter` | Kado p1,p2,p4-p9; manifest 8, sheet exact-six subset | `1/2/3`, `unknown`                      |
| `isabella-bird-in-wonderland`           | Kado p1,p3-p9; manifest 8, sheet exact-six subset    | `3/3/2`, `unknown`                      |
| `lovely-muco`                           | Omoi p9-p14; p8 title excluded                       | `0/1/3`, motion `2` at p12 panels 3-7   |

KEEP controls: astronomy `chi-on-the-movements-of-the-earth` p6-p11, `chis-sweet-adventures` panel-rich story pages, Initial D p10의 장면 내 Gunma/Akina 지도 설명면. 이 KEEP도 직접 근거와 충돌하면 blocker로 보고한다.

## 4. 데이터 계약과 검사 범위

새 100작품은 `reuse-eight` 8 + `fresh-a` 31 + `fresh-b` 31 + `fresh-c` 30이며 packet 간·기존 50과 disjoint여야 한다.

| 항목                            |                                             기대값 |
| ------------------------------- | -------------------------------------------------: |
| Candidate Work / Alias / Volume |                                    150 / 177 / 154 |
| Factor / Theme                  |                                         2550 / 462 |
| Recommendation context / config |                                            150 / 1 |
| Evidence / Art manifest         |                                          416 / 600 |
| Role                            |               Anchor 30 / Bridge 30 / Discovery 90 |
| Intended eligibility            | onboarding 40 / recommendation 150 / libraryOnly 0 |

- `2550 = 150 × 17`, `600 = 150 × 4`다.
- candidate version은 `v1-61168a24beea`다.
- 기존 49작품은 `authorizedModelPanel`; 새 100작품과 `haikyu`는 `unreviewed`다.
- 승인 전 예상 issue는 정확히 `UNREVIEWED_ELIGIBILITY` 101, `AUTHORIZED_MODEL_PANEL_REVIEW` 49, `EVIDENCE_NOT_HUMAN_REVIEWED` 416뿐이다.
- `unknown`은 0/2가 아니며, 표본이 부족하면 known으로 채우지 않는다. 정적 Art는 모든 작품에서 6개 서로 다른 내부 refs와 2개 이상 contexts가 필수다.

규범 우선순위대로 실제 HEAD에서 읽는다: `docs/planning/02-product-spec.md`, `docs/factors/factor-dictionary.md`, `docs/factors/annotation-guide.md`, `docs/planning/06-implementation-plan.md` Slice 4, `docs/planning/07-acceptance-test-plan.md`.

## 5. 외부 근거와 실제 이미지 의무

새 100작품 각각의 bibliography, Genre, Theme, 13개 non-Art Axis를 공식·1차 또는 권리자 허용 source에서 직접 확인한다. URL 목록·narrative·validator·CI는 콘텐츠 검토를 대신하지 않는다.

정적 Art 100작품은 실제 이미지를 열어 다음을 전수 확인한다.

- 서로 다른 판독 가능한 내부 페이지 정확히 6장
- 2개 이상 관찰 맥락과 Work/source/edition identity
- 금지된 cover/title-only/frontmatter/loading/duplicate/crop 없음
- 3개 known 정적 값과 exact refs의 일치
- known motion 6작품은 숫자 page/panel 연속 장면을 실제로 열어 값까지 확인

Local canonical bundle은 `/home/bell/.cache/konocomics/cycle6-art`다. CSV나 PASS 문자열만 읽지 말고 sheet 100개와 motion 6개를 실제로 연다. 다른 경로가 이 로컬 bundle에 접근하지 못하면 접근했다고 주장하지 말고 공식 reader에서 동등 검사를 수행한다. 이미지 접근 불가를 `PASS`로 확장할 수 없다.

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

bundle은 100/100 static exact-six PASS, 100 unique sheet hashes, 6/6 known motion PASS, `validationProblems=[]`, artifact-tool CSV import/render `A1:O101`·`A1:N7`, 19개 변경 CSV render를 기록한다. 이 수치 자체는 이미지 내용 검토의 대체물이 아니다.

## 6. 동결 SHA-256

bundle digest는 각 디렉터리의 정렬된 `sha256sum` LF 출력 전체를 다시 SHA-256한 값이다.

```text
85eb3d88598c5320bc9bb68c5f149a746f28ad854aba273969aff4002851b442  candidate-source bundle (10 files)
8fbd868b485edf8ed2d9a650fc5d5561987720b6879e8ee611b76159f94a8577  reuse-eight bundle (11 files)
d1240761811b396e7cd34504d71402fbd939f804cfa8cd81dd345c1aaf92e594  fresh-a bundle (11 files)
bf6c443274a1392667cab7eaab06cb2a3576b5d5f8a3286377ff519047579ed8  fresh-b bundle (11 files)
e9f8bb8a7f7da45d0f10849852cdabc8afaa88fb6f02c51375778db1552f59b0  fresh-c bundle (11 files)
```

후보 10개:

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
```

생성물:

```text
8695c5646a388f049dc25dcd6af5b5db06437ea82d8755b6b008ea4b97b27abb  data/staging/g2/candidate-generated/catalog-v1.json
a802af6c04d5d3c81668493ff4af7eec5fba5169dc38578e3013f4a71752c171  data/staging/g2/candidate-generated/recommendation-context-v1.json
1b34a84865b6a5f099ea54a95aacbcc51d59e864cb41e4bf53d382dd08ba831e  data/staging/g2/candidate-generated/taste-vs-baseline.md
```

admission·narrative·intended eligibility:

```text
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
```

규범·게이트:

```text
ad9e20bda260ae77bf89886cfafa779180f702683dafe00ecda066544ec60fb1  docs/planning/02-product-spec.md
82868ac1028da5a38bcaeed2db1f8fae1f4df0aaf5dc62bbe84aef1024c18475  docs/planning/06-implementation-plan.md
e9048e7bf2f71d1f26d844de5920621fbd80f111a4118362fa6f51abfbd84106  docs/planning/07-acceptance-test-plan.md
a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be  docs/factors/factor-dictionary.md
f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3  docs/factors/annotation-guide.md
8e1da282006496c8d3a68c7f4934147dd82906da28821d4d6f6bb2e22cc14c11  scripts/catalog/art-evidence.ts
7811ee6c451646a8bb4a5668949d62167aabcf76210b72ddc611cc7338a40bd6  tests/unit/catalog/art-evidence.test.ts
```

위 선언 repository 파일은 정확히 31개다. 하나라도 hash가 다르면 `REVISE`다.

## 7. 재현 결과와 판정 질문

현재 HEAD에서 후보 pipeline은 `v1-61168a24beea`, works 150, volumes 154, issue 101/49/416과 other errors 0을 재현한다. local과 exact-head GitHub CI에서 Prettier, typecheck, lint, 341 unit tests, catalog validate/currentness, production build, G2 harness build가 통과했다. 테스트·CI 성공은 콘텐츠 승인이나 실제 이미지 검토를 대체하지 않는다.

다음을 모두 답한다.

1. IDENTITY/HASH — branch/HEAD/CI, 31파일, repository bundle 5개, 접근 가능한 visual hashes가 맞는가?
2. SCOPE/DISJOINTNESS — 100 합집합과 150 전체, role·eligibility·ISBN/ID 중복 없음이 맞는가?
3. BIBLIOGRAPHY — 새 100의 제목·creator·publisher·demographic·status/year·대표 일본어 1권이 공식 source와 맞는가?
4. GENRE/THEME — 150 coherence와 새 100의 모든 Genre/Theme가 entry 범위와 dictionary에 맞는가?
5. NON-ART — 새 1300개 non-Art 셀과 Cycle 6 5개 보정, `haikyu=2`가 근거로 지지되는가?
6. UNKNOWN — 근거 부족을 known/0/2/notApplicable로 치환한 항목이 없는가?
7. ART — 100/100 이미지, 6/6 motion, Cycle 6 대상 7작품의 refs/context/value/authority/edition을 직접 확인했는가?
8. PROVENANCE — 416 evidence와 `reviewedByHuman=false`, model draft 경계가 정직한가?
9. ROLE/ELIGIBILITY/PIPELINE — 30/30/90, 40/150/0, 101/49/416 fail-closed 상태가 맞는가?
10. PROMOTION/BOUNDARY — 승인 변환이 값 수정 없이 가능하고 이 verdict가 제품 방향·UI·Slice 5 허가가 아님을 확인하는가?

`GO`는 150/150, 새 100/100, 공식 source 100/100, 실제 정적 Art 100/100, known motion 6/6을 독립 검사하고 수정 필수 항목이 없을 때만 가능하다. 미검사·접근 불가를 승인으로 확장하면 `REVISE`다. `GO with conditions`는 없다.

## 8. 단일 출력 계약

첫 줄은 정확히 `VERDICT: GO`, `VERDICT: REVISE`, `VERDICT: NO-GO` 중 하나다. 이후 아래를 모두 채운다.

```text
REVIEWER: Local | Gemini | Grok | GPT-5.6 Pro Oracle
REPOSITORY: konocomics (fromiron/konocomics)
BRANCH: main
HEAD: 543fd59fe5fc1e030fa98009b6c5fcf1a86cc209
CANDIDATE BUNDLE SHA-256: 85eb3d88598c5320bc9bb68c5f149a746f28ad854aba273969aff4002851b442
PREVIOUS RESPONSE/REPORT FILES READ: 0
DECLARED REPOSITORY FILES CHECKED: <n>/31
REPOSITORY BUNDLE DIGESTS CHECKED: <n>/5
ALL CANDIDATE WORKS CHECKED: <n>/150
NEW WORKS CHECKED: <n>/100
OFFICIAL/PRIMARY WORK SOURCE SETS ACTUALLY OPENED: <n>/100
STATIC ART WORKS WHOSE IMAGES WERE ACTUALLY OPENED: <n>/100
KNOWN MOTION SEQUENCES WHOSE IMAGES WERE ACTUALLY OPENED: <n>/6
LOCAL VISUAL LEDGERS CHECKED: <n>/2 | inaccessible-not-claimed | <경계>
REOPENED CHECK: haikyu.relationshipStructure

REQUIRED QUESTIONS:
1. IDENTITY/HASH: PASS | FAIL — <근거>
2. SCOPE/DISJOINTNESS: PASS | FAIL — <근거>
3. BIBLIOGRAPHY: PASS | FAIL — <근거>
4. GENRE/THEME: PASS | FAIL — <근거>
5. NON-ART: PASS | FAIL — <근거>
6. UNKNOWN: PASS | FAIL — <근거>
7. ART: PASS | FAIL — <실제로 연 이미지와 접근 한계>
8. PROVENANCE: PASS | FAIL — <근거>
9. ROLE/ELIGIBILITY/PIPELINE: PASS | FAIL — <근거>
10. PROMOTION/BOUNDARY: PASS | FAIL — <허가/비허가>

PACKET CHECKS:
- reuse-eight: PASS | REVISE — <8/8>
- fresh-a: PASS | REVISE — <31/31>
- fresh-b: PASS | REVISE — <31/31>
- fresh-c: PASS | REVISE — <30/30>
- existing G1 controls: PASS | REVISE — <50/50>
- haikyu.relationshipStructure: PASS | REVISE — <근거>

CYCLE 6 CORRECTIONS:
- bibliography/status/theme/relationship: PASS | REVISE — <5/5>
- Art refs/contexts: PASS | REVISE — <7/7>
- protected KEEP controls: PASS | REVISE — <근거>

BLOCKERS:
- <none 또는 workId.field: current -> required + exact evidence>

PROMOTION AUTHORIZATION: YES | NO
PRODUCT-DIRECTION G2 AUTHORIZATION: NO
PRODUCT UI CHANGE AUTHORIZATION: NO
SLICE 5 AUTHORIZATION: NO
ORACLE EXECUTION STATUS: RUN | NOT RUN
```
