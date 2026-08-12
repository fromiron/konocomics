# G2 100작품 Catalog 주석 승격 독립 패널 요청 — Cycle 5

## 1. 역할, 동결 identity, 판정 경계

당신은 **konocomics (`fromiron/konocomics`)**의 독립 Catalog 주석 검토자다. 저장소를 수정하지 말고, 다른 검토자의 응답이나 이전 cycle의 response/report를 읽지 않은 상태에서 현재 동결 번들을 처음부터 직접 심사한다.

- 저장소: `konocomics (fromiron/konocomics)`
- 기준 브랜치: `main`
- 기준 커밋: `e56f663ea602b09d52d3d1608a4f89bf8b3c3398` (`e56f663`)
- 요청 동결 시점의 로컬 `main`, `HEAD`, `origin/main`: 모두 위 커밋
- exact-head GitHub Actions: run `31590978314`, quality job `94095599985`, conclusion `success`
- GitHub tools/connectors가 있다면 live repository, 정확한 commit, diff, checks와 관련 문맥을 직접 검사할 수 있다.
- 로컬 checkout에서는 먼저 `git branch --show-current`, `git rev-parse HEAD`, `git rev-parse origin/main`으로 identity를 확인한다. 다른 commit의 결과로 승인하지 않는다.

승격 판정 대상은 기존 G1 승인 50작품을 integrity control로 유지하면서 추가되는 정확히 100작품의 bibliography, Genre, Theme, 17 Axis, evidence와 intended eligibility, 그리고 다시 열린 `haikyu.relationshipStructure=2`다. 후보 전체의 일관성과 교차 오염을 확인하기 위해 **150작품 전부**를 독립 검사한다. 기존 G1 49작품은 무변경 control이며 재승격 대상이 아니다.

이 요청의 `GO`는 Catalog 주석 승격만 뜻한다. 다음은 판정하거나 허가하지 않는다.

- Taste Engine 대 Baseline의 G2 제품 방향 `GO`
- 사람 10명의 블라인드 테스트 통과 주장
- synthetic pilot·하니스의 제품 결과 대체
- `data/source` 승격, 제품 UI 변경, Slice 5 시작
- 추천 산식, factor dictionary, threshold, 역할 목표 변경
- 기존 G1 49작품의 재승인·교체·약화

## 2. 독립 패널과 Oracle 중단

동일 요청을 Local, Gemini, Grok, GPT-5.6 Pro Oracle 네 경로가 서로 독립적으로 검토한다.

- **Local, Gemini, Grok은 서로의 응답과 Cycle 1–4 request/response/report를 읽지 않는다.** 현재 요청, 동결 commit, 규범 문서, 원본 source와 실제 외부 근거만 읽는다.
- 이전 응답의 부분 `PASS`, 후보 수정 lead, 주장 또는 verdict를 재사용하지 않는다.
- **Oracle은 사용자가 재개를 명시하기 전까지 금지되며 `NOT RUN`이다.** 미리 열기, 요청 첨부, 부분 질문, 다른 모델·브라우저로의 대체도 금지한다.
- 사용자가 Oracle 재개를 명시하면 한 번의 충분한 요청에 이 문서 전체를 제공하고, 프로젝트·저장소는 `konocomics (fromiron/konocomics)`, 브랜치는 `main`, 정확한 HEAD는 `e56f663ea602b09d52d3d1608a4f89bf8b3c3398`, GitHub tools/connectors로 live repo·commit·checks와 관련 문맥을 직접 검사할 수 있음을 반드시 알린다.
- **네 경로 모두의 hash-bound, 조건 없는 유효 `GO`와 사용자의 별도 승인 전에는 승격하지 않는다.** Oracle 미실행, 무효·미완료 응답, `REVISE`, `NO-GO` 중 하나라도 있으면 승격 금지다.

모델 패널은 사람 검수가 아니다. 승인 뒤에도 모든 해당 evidence의 `reviewedByHuman=false`를 유지한다.

## 3. Cycle 4 종료와 Cycle 5 수정

Cycle 4는 동결 HEAD `a179da01807aae42ac55c800bc273b9540138be6`에서 종료됐다. Local의 유효한 전수 검토는 `REVISE`, Gemini와 Grok 응답은 실행 근거·출력 계약 미충족으로 무효, Oracle은 `NOT RUN`이었다. 무효 응답의 콘텐츠 lead는 수정 권한으로 사용하지 않았다.

### 3.1 strategy 7건: 모두 `2`로 수정

Factor dictionary의 `2=에피소드·경기 단위 전술/수읽기`, `4=장기 복합 운영·책략` 경계를 다시 적용했다.

```text
baby-steps.strategy: 4 -> 2
capeta.strategy: 3 -> 2
yowamushi-pedal.strategy: 3 -> 2
ace-of-the-diamond.strategy: 3 -> 2
all-rounder-meguru.strategy: 3 -> 2
tomorrows-joe.strategy: 3 -> 2
shangri-la-frontier.strategy: 3 -> 2
```

### 3.2 relationshipStructure 2건: 모두 `4`에서 `2`로 수정

Cycle 4의 무효 응답과 독립적으로 source와 SSOT를 다시 대조했다. 두 작품의 초반부는 주인공 중심의 고정 핵심 관계망이며 복잡한 다중 군상 축 `4`가 아니다.

```text
my-next-life-as-a-villainess.relationshipStructure: 4 -> 2
rent-a-girlfriend.relationshipStructure: 4 -> 2
```

### 3.3 정적 Art exact reference 6건 수정

값·confidence·motion 상태는 바꾸지 않고 표지, frontispiece, chapter title, loading/partial state를 제외한 서로 다른 내부 페이지 6장으로 manifest와 관찰 ledger를 맞췄다.

| Work                  | 현재 exact refs                                       | 유지 값 (`artRealism/artDensity/visualSoftness`, motion) |
| --------------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| `a-brides-story`      | BOOK WALKER `9/19, 11/19, 13/19, 15/19, 17/19, 19/19` | `4/4/2`, `unknown`                                       |
| `thermae-romae`       | BOOK WALKER `7/18, 9/18, 11/18, 13/18, 15/18, 17/18`  | `4/4/1`, `unknown`                                       |
| `gto`                 | Omoi `13, 21, 32, 44, 55, 67`                         | `3/4/1`, `unknown`                                       |
| `parasyte`            | Omoi `15, 19, 23, 31, 39, 47`                         | `3/3/1`, `unknown`                                       |
| `island-in-a-puddle`  | Omoi `10, 14, 22, 29, 37, 45`                         | `2/3/2`, `unknown`                                       |
| `shangri-la-frontier` | Omoi `9, 20, 34, 41, 52, 63`                          | `2/3/2`, `unknown`                                       |

### 3.4 보호된 KEEP anchors

다음 값은 경계 비교용 anchor다. KEEP 목록 자체가 승인이 아니며 현재 source와 dictionary에서 다시 검사한다. 근거가 충돌하면 유지하지 말고 blocker로 보고한다.

```text
giant-killing.strategy=4
the-full-time-wife-escapist.strategy=3
real.relationshipStructure=4
tokyo-tarareba-girls.relationshipStructure=4
my-brothers-husband.foundFamily=2
she-loves-to-cook-and-she-loves-to-eat.foundFamily=2
showa-genroku-rakugo-shinju.foundFamily=1
the-golden-sheep.relationshipStructure=4
my-home-hero.revenge=1
haikyu.relationshipStructure=2  # reopened promotion target
```

## 4. 판정 대상과 데이터 계약

새 100작품은 아래 네 packet의 Work ID 합집합이며 packet 간·기존 50작품과 겹치지 않아야 한다.

| Packet      |    작품 | Anchor / Bridge / Discovery | onboarding | recommendation | libraryOnly |
| ----------- | ------: | --------------------------: | ---------: | -------------: | ----------: |
| reuse-eight |       8 |                   4 / 0 / 4 |          4 |              8 |           0 |
| fresh-a     |      31 |                  3 / 3 / 25 |          3 |             31 |           0 |
| fresh-b     |      31 |                  3 / 4 / 24 |          3 |             31 |           0 |
| fresh-c     |      30 |                  2 / 3 / 25 |          2 |             30 |           0 |
| **합계**    | **100** |            **12 / 10 / 78** |     **12** |        **100** |       **0** |

각 packet의 `works.csv`, `aliases.csv`, `volumes.csv`, `factors.csv`, `themes.csv`, `recommendation-context.csv`, `recommendation-config.csv`, `intended-eligibility.csv`, `evidence/evidence.csv`, `evidence/art-evidence-manifest.csv`, `annotations-and-evidence.md`를 실제로 읽는다. `data/staging/g2/admission/fresh-{a,b,c}.json`도 대조한다.

합성 후보 `data/staging/g2/candidate-source/`는 정확히 10개 파일이며 관찰 구조는 다음과 같다.

| 항목                            |           행 수 |
| ------------------------------- | --------------: |
| Work / Alias / Volume           | 150 / 177 / 154 |
| Factor / Theme                  |      2550 / 463 |
| Recommendation context / config |         150 / 1 |
| Evidence / Art manifest         |       415 / 600 |

- `2550 = 150 × 17 Axis`, `600 = 150 × 4 Art Axis`다.
- 후보 version `v1-5aaf4ddb0325`; 역할 Anchor 30 / Bridge 30 / Discovery 90.
- 최종 의도 onboarding 40 / recommendation 150 / libraryOnly 0.
- 기존 49작품은 `authorizedModelPanel`; 새 100작품과 `haikyu`는 `unreviewed`.
- 승인 전 예상 issue는 정확히 error `UNREVIEWED_ELIGIBILITY` 101, warning `AUTHORIZED_MODEL_PANEL_REVIEW` 49, warning `EVIDENCE_NOT_HUMAN_REVIEWED` 415뿐이다.

규범 우선순위대로 다음을 실제 commit에서 읽는다.

1. `docs/planning/02-product-spec.md` §5, §7
2. `docs/factors/factor-dictionary.md`
3. `docs/factors/annotation-guide.md`
4. `docs/planning/06-implementation-plan.md` Slice 4
5. `docs/planning/07-acceptance-test-plan.md` §3–4

핵심 계약:

- 모델 초벌 주석이며 사람 검수로 표현하지 않는다. 모든 새 evidence는 `reviewedByHuman=false`다.
- `unknown`은 0/2가 아니다. 근거가 부족하면 `unknown`; 동적 장면 자체가 없을 때만 `notApplicable`이다.
- 범위는 `factorScope=entry_1_3_volumes`; 0/2/4와 중간값 1/3은 dictionary의 관찰 기준을 따른다.
- 단순 팀·직장·연애·생물학적 가족은 `foundFamily`가 아니고, 고정 핵심 조연 반복 `2`를 복잡한 군상 관계 `4`로 올리지 않는다.
- narrative, confidence, template, validator, CI, generated output은 source·실제 페이지·주석 품질 검토를 대신하지 않는다.

## 5. 실제 외부 근거와 Art 검토 의무

모든 검토자는 bibliography, Genre/Theme, 17 Axis를 공식·1차 또는 권리자 허용 source에서 직접 확인한다. URL 목록이나 다른 검토자의 요약만 읽고 확인했다고 쓰지 않는다.

정적 Art는 새 100작품 각각에 대해 **실제 이미지**를 열어 다음을 확인한다.

- 판독 가능한 서로 다른 내부 페이지 정확히 6장
- 서로 다른 관찰 맥락 2개 이상
- source/edition/entry 범위와 Work identity 일치
- cover, title-only splash, frontmatter, loading shell, duplicate 제외
- known 정적 축은 exact reference와 실제 페이지가 값 기준을 지지
- known `motionImpact` 6작품은 숫자 page/panel sequence를 실제로 열어 확인
- 나머지 94작품의 `motionImpact=unknown`을 정지면에서 임의 수치화하지 않음

### Local 전용 canonical visual artifacts

권리 이미지는 저장소에 복제하지 않았다. Local은 아래 `/tmp` CSV를 열고 hash/path를 대조한 뒤, **CSV만 보지 말고 100개 sheet와 known motion 6개를 실제로 열어** 검사한다. Gemini/Grok은 로컬 ledger에 접근하지 못하면 봤다고 주장하지 말고, manifest의 공식/권리자 허용 URL에서 동등한 전수 검사를 수행한다. 이미지 접근 불가를 `PASS`로 대체할 수 없다.

```text
bb51fa09eed000984f78bbe0e5393997ef4d5665dae77fa2ae1c0ad53afed5e2  /tmp/konocomics-cycle5-art/index.csv
f76c2d62e6f503dc789b3dce454e367e677d49d0636fdf80b4e029a3b14d6e8d  /tmp/konocomics-cycle5-art/known-motion-index.csv
e1ae7e11be674971e44eadba80ff63dbab9f791288d3524753e2c07d6fff539a  /tmp/konocomics-cycle5-art/audit.json
168f1c1efa39623a7009e544454602b4cecb8783c996f5a5ef07bbcbdc9ac2f1  /tmp/konocomics-cycle5-art/csv-audit.json
ef1a0cbac293d677e4d9c72b6b37ffa164981e09583c6231efb6910191940d72  /tmp/konocomics-cycle5-art/visual-inspection.md
```

`index.csv`: 100행 / 100고유 Work / 100 PASS / 100고유 artifact SHA / 100 exact-six-unique-ref / 100 two-or-more-context. `known-motion-index.csv`: 6행 / 6 PASS. CSV artifact 감사 결과는 `A1:O101`, `A1:N7`, final LF 1, blank record 0이다. `audit.json`의 `validationProblems=[]`이며 현재 manifest와 100행 ledger의 source/edition/ref를 대조했다.

Cycle 5 교체 sheet:

```text
7aaf059be8a7f5826842c741c83bc1090da5f8e3468dc7a7c47b7353318f0d9a  replacements/a-brides-story.png
d9a5236de8f4a8be611c8b7cb62fc1c035e4f7490c96dbed2ae2f692317fa55c  replacements/thermae-romae.png
e3c2f077d35452b6297f0bf59d2a0dc66fe2b3f78275816554ed73727c210076  replacements/gto.png
adf99380eb338bb87579007780c86f980f4d388de4aef43cce6ffb3a2338a79f  replacements/parasyte.png
7d093334bec4ece784d037742f1b671a72ee5a7e3bf3b671155e76af75447169  replacements/island-in-a-puddle.png
6a8a626818104fa5a762e39871bca0556d66bffbc4ca8918aacab58122d7cd8f  replacements/shangri-la-frontier.png
```

위 11개 선언 artifact의 정렬된 `sha256sum` 출력 bundle digest는 `cce31fa6ad4b90142a75cdb884671f13f7e72245612844f7cfca49e4e3371fd4`다. **ledger hash, audit, PASS 문자열, contact sheet 존재는 이미지 내용 검토의 대체물이 아니다.**

## 6. 동결 SHA-256

bundle digest는 각 디렉터리에서 `LC_ALL=C find <dir> -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum`의 LF 출력 전체를 다시 SHA-256한 값이다.

```text
fce949ff838bdb17f8fdfc8abc037b6dce9a6da54c7f65f08be843ee5236badf  candidate-source bundle (10 files)
bf9b4527ba546c2138499f290687fcf15e447caa20f84bfd28611bb73ace8a43  reuse-eight bundle (11 files)
e6499df2af85ca722773e765d69449c6b91cbbb38c671181a77c25296d84701b  fresh-a bundle (11 files)
65825450a704b4164577323f7ff8d827f143452a9ad92cee7806d919c2c001a9  fresh-b bundle (11 files)
e9f8bb8a7f7da45d0f10849852cdabc8afaa88fb6f02c51375778db1552f59b0  fresh-c bundle (11 files)
```

후보 10개 파일:

```text
16b2964b3a4669bc07213c0f2fa70577fe7a9feefedc77752b24b637931d2ca4  data/staging/g2/candidate-source/aliases.csv
7a3092cb2e0aab6a4914f5f4abf13020faa164e1ceba9c2b73da3bee545431fe  data/staging/g2/candidate-source/evidence/art-evidence-manifest.csv
769174bc11c446fa4766ee36703102e7e70b5186b2081df17f528d5e67030fce  data/staging/g2/candidate-source/evidence/evidence.csv
25f72263e28b4d3b92bcb6acef7b73af93bab59ccbc67a077bedf149802a11a4  data/staging/g2/candidate-source/factors.csv
53f176328d441998917006e8e89ccbc2685798d4611ce40c66cea2775d94620d  data/staging/g2/candidate-source/recommendation-config.csv
87bc2661216c04b793449903bf8472714301fda3f75dd8de6c49d7b3b00ccf9d  data/staging/g2/candidate-source/recommendation-context.csv
382965a19ef75aeb03d051b2285eac0cd856acc2c016bb1635c3121627dac536  data/staging/g2/candidate-source/reviews/g1-sanity-panel.md
6080d6a1efaed3e2b8d430ff0e94cd2cfbe2380752f278b54cb25076da00c07c  data/staging/g2/candidate-source/themes.csv
4ab402e628d125decca67c550d7d1e32594cca78c1edcec54685148d15930009  data/staging/g2/candidate-source/volumes.csv
440cf921a03d771e0a6b46026e9b435e4a3be1802a680c764e187d119c0855a5  data/staging/g2/candidate-source/works.csv
```

admission, narrative, intended eligibility, generated:

```text
937a2a9c8fe5757b4a3daf411fed70c62792470f8b915ec64801d3652884e5ee  data/staging/g2/admission/fresh-a.json
cbf7131d1654d10e2ebac191f2ea64ea1060564f82af55ba7a535f34a680e164  data/staging/g2/admission/fresh-b.json
ee0b420f135ad0589f7f07f49e70df0c8198f3ec4831f7332f9662165b06874a  data/staging/g2/admission/fresh-c.json
24c8d0d5b8706abe5cbc4bc1460984a852b8342d47a3644b41c9182c5eb406a8  data/staging/g2/reuse-eight/annotations-and-evidence.md
d143b8916812269b9ce1b7087f65fdd8ce07bcae7bdce18ddb255f56c19e45c1  data/staging/g2/fresh-a/annotations-and-evidence.md
76770d54c0d937cf53d5fc4cf4cf7edd1f5fffbbe12d37eaf660f71b101aec1c  data/staging/g2/fresh-b/annotations-and-evidence.md
80356529181607a671c2fcf1b4d528a7614a9178e6075886a36b92456fb38cad  data/staging/g2/fresh-c/annotations-and-evidence.md
117a562ed83b6c81d8529ac6e1522b0524a46372b7bdafe80f3bcd3bb2ea33c2  data/staging/g2/reuse-eight/intended-eligibility.csv
402fa2247e1568491cf4a098ed4ff6997f49cc46d4c194643ebc8ea1a5f81c24  data/staging/g2/fresh-a/intended-eligibility.csv
3ef2ac1e9e877e92747fa66c529eaad5d92e2bf1e3518e852b7c9f88783aa0b9  data/staging/g2/fresh-b/intended-eligibility.csv
fffbc944d3f00efdcd5f0359a65d29ab11821586712c7b266dc127359956cd03  data/staging/g2/fresh-c/intended-eligibility.csv
78e3888ef196d03daaa8c26035a605774291035bd79f4caf89dd619d38d6fa98  data/staging/g2/candidate-generated/catalog-v1.json
fd02b45856bd300bfd54e9092ff6879d74132bd6bba92ffee04ee89d62e40a86  data/staging/g2/candidate-generated/recommendation-context-v1.json
ac9ce7b2c6cd647f3e6aea907bcf070d14180e2e003acf1c5806249849061294  data/staging/g2/candidate-generated/taste-vs-baseline.md
```

규범·게이트 파일:

```text
0650bb77d69d4f0dcabab0fa9384040cbcadd93d9f31d18a2cbe00d2a3aba0c1  docs/planning/02-product-spec.md
0c0df6733d4ee61db33f901ee15b19be6a7fbe0d690c439f89882273e2cdfb00  docs/planning/06-implementation-plan.md
e9048e7bf2f71d1f26d844de5920621fbd80f111a4118362fa6f51abfbd84106  docs/planning/07-acceptance-test-plan.md
a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be  docs/factors/factor-dictionary.md
f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3  docs/factors/annotation-guide.md
8e1da282006496c8d3a68c7f4934147dd82906da28821d4d6f6bb2e22cc14c11  scripts/catalog/art-evidence.ts
7811ee6c451646a8bb4a5668949d62167aabcf76210b72ddc611cc7338a40bd6  tests/unit/catalog/art-evidence.test.ts
```

선언 repository 파일은 `10 candidate + 3 generated + 8 narrative/intended + 3 admission + 7 normative/gate = 31`개다. 선언 hash나 5개 repository bundle digest가 하나라도 다르면 `REVISE`다.

## 7. 재현 검사와 완료된 검증

후보 pipeline을 현재 HEAD에서 재현한다.

```bash
TEMP=/tmp TMP=/tmp TMPDIR=/tmp node --import tsx --input-type=module -e '
import { runCatalogPipeline } from "./scripts/catalog/pipeline.ts";
const result = runCatalogPipeline("data/staging/g2/candidate-source");
const counts = Object.fromEntries(
  [...new Set(result.issues.map((i) => `${i.severity}:${i.code}`))].sort()
    .map((key) => [key, result.issues.filter((i) => `${i.severity}:${i.code}` === key).length]),
);
console.log({ catalogVersion: result.catalog.catalogVersion, works: result.catalog.works.length, volumes: result.catalog.volumes.length, counts });
'
```

예상 결과:

```text
catalogVersion: v1-5aaf4ddb0325
works: 150
volumes: 154
error:UNREVIEWED_ELIGIBILITY: 101
warning:AUTHORIZED_MODEL_PANEL_REVIEW: 49
warning:EVIDENCE_NOT_HUMAN_REVIEWED: 415
other errors: 0
```

exact HEAD에서 formatting, typecheck, lint, 341 unit tests, catalog validation, generated-currentness diff, production build와 G2 harness build가 로컬과 GitHub quality job에서 통과했다. 테스트·CI·harness 성공은 콘텐츠 승인이나 실제 이미지 검토를 대체하지 않는다.

## 8. 독립 전수 검토 질문과 verdict 기준

1. **IDENTITY/HASH:** HEAD, exact-head CI, 31개 파일, repository bundle 5개와 접근 가능한 visual hash가 일치하는가?
2. **SCOPE/DISJOINTNESS:** 100작품 합집합, 150 전체, role·eligibility·volume identity, 중복 없음이 맞는가?
3. **BIBLIOGRAPHY:** 새 100작품의 일본어 제목, creator, publisher, demographic, status/year, 대표 일본어 1권 ISBN·판본이 공식·1차 근거와 맞는가?
4. **GENRE/THEME:** 150작품 coherence와 새 100작품의 모든 Genre·Theme/centrality가 초반 범위와 dictionary에 맞는가?
5. **NON-ART:** 새 1300개 non-Art 셀, Cycle 5의 strategy 7건·relationship 2건, 보호 KEEP anchors와 `haikyu.relationshipStructure=2`가 직접 근거로 지지되는가?
6. **UNKNOWN:** 근거 부족을 0/2/`notApplicable`로 치환한 셀이 없고 known을 `unknown`으로 내려야 할 항목이 없는가?
7. **ART:** 새 100작품 400행을 실제 이미지 100/100과 known motion 6/6에서 독립 확인했는가? 여섯 교체 ref와 값, authority, edition, 6쪽/2맥락, exact refs가 맞는가?
8. **PROVENANCE:** 모델 초벌, `reviewedByHuman=false`, template와 한계가 정직하며 사람 검수로 오인시키지 않는가?
9. **ROLE/ELIGIBILITY/PIPELINE:** 30/30/90, 40/150/0, 101/49/415 fail-closed 상태와 generic Art gate가 맞는가?
10. **PROMOTION/BOUNDARY:** 최소 승격 변환을 값 수정 없이 수행할 수 있고, 이 verdict가 G2 제품 방향·사람 테스트·UI·Slice 5 허가가 아님을 확인하는가?

`GO`는 150/150, 새 100/100, 실제 정적 Art 100/100, known motion 6/6과 필요한 공식 source를 독립 검사하고 수정 필수 항목이 없을 때만 가능하다. 필드 충돌, 근거 부족, Art 정책 위반, 접근 불가 또는 미검사 범위를 승인으로 확장하면 `REVISE`; 번들이 필드별 수정으로 심사 불가능하면 `NO-GO`다. `GO with conditions`는 없다.

유효 응답은 실행 trace와 모순되면 안 된다. 실제 URL·브라우저·이미지 접근 없이 전수 확인을 주장하거나, hash/CI/test만으로 콘텐츠를 승인하거나, 요구 수치를 임의로 기입하면 무효·비승격 응답이다.

4/4 유효 `GO`와 사용자의 별도 승인 후에만 새 100작품과 `haikyu`의 `annotationReviewMethod`를 `authorizedModelPanel`로 바꾸고 실제 승인 시각과 `reviews/g2-catalog-annotation-panel.md`를 기록할 수 있다. 기존 49작품의 값과 G1 reference, 모든 `reviewedByHuman=false`, Factor/Theme/Genre/confidence/bibliography/role/eligibility는 바꾸지 않는다. 그 전에는 승격, `data/source`, 제품 방향 판정, UI, Slice 5를 수행하지 않는다.

## 9. 단일 필수 출력 계약

첫 줄은 반드시 다음 셋 중 하나와 정확히 같아야 한다.

```text
VERDICT: GO
VERDICT: REVISE
VERDICT: NO-GO
```

이후 다음을 모두 채운다.

```text
REVIEWER: Local | Gemini | Grok | GPT-5.6 Pro Oracle
REPOSITORY: konocomics (fromiron/konocomics)
BRANCH: main
HEAD: e56f663ea602b09d52d3d1608a4f89bf8b3c3398
CANDIDATE BUNDLE SHA-256: fce949ff838bdb17f8fdfc8abc037b6dce9a6da54c7f65f08be843ee5236badf
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
1. IDENTITY/HASH: PASS | FAIL — <직접 확인한 근거>
2. SCOPE/DISJOINTNESS: PASS | FAIL — <직접 확인한 근거>
3. BIBLIOGRAPHY: PASS | FAIL — <실제로 연 공식·1차 source 근거>
4. GENRE/THEME: PASS | FAIL — <직접 확인한 근거>
5. NON-ART: PASS | FAIL — <9개 수정, KEEP, haikyu를 직접 확인한 근거>
6. UNKNOWN: PASS | FAIL — <직접 확인한 근거>
7. ART: PASS | FAIL — <실제로 연 image/source, exact refs, 교체 6건, known motion 6/6, 접근 한계>
8. PROVENANCE: PASS | FAIL — <직접 확인한 근거>
9. ROLE/ELIGIBILITY/PIPELINE: PASS | FAIL — <직접 확인한 근거>
10. PROMOTION/BOUNDARY: PASS | FAIL — <허가하는 것과 허가하지 않는 것>

PACKET CHECKS:
- reuse-eight: PASS | REVISE — <8/8 전수 근거>
- fresh-a: PASS | REVISE — <31/31 전수 근거>
- fresh-b: PASS | REVISE — <31/31 전수 근거>
- fresh-c: PASS | REVISE — <30/30 전수 근거>
- existing G1 integrity controls: PASS | REVISE — <50/50 교차 근거>
- haikyu.relationshipStructure: PASS | REVISE — <직접 확인한 근거>

CYCLE 5 CORRECTIONS:
- strategy 7: PASS | REVISE — <7/7>
- relationshipStructure 2: PASS | REVISE — <2/2>
- corrected static Art refs: PASS | REVISE — <6/6 실제 image 근거>
- protected KEEP anchors: PASS | REVISE — <10/10>

BLOCKERS:
- none
또는
- <workId.field>: <현재값> -> <제안값 또는 unknown> — <공식 URL/사전 기준/manifest ref>

PROMOTION AUTHORIZATION: YES | NO
PRODUCT-DIRECTION G2 AUTHORIZATION: NO
PRODUCT UI CHANGE AUTHORIZATION: NO
SLICE 5 AUTHORIZATION: NO
ORACLE EXECUTION STATUS: NOT RUN | RUN AFTER EXPLICIT USER RESUMPTION
```

유효한 `GO`는 31/31, 5/5, 150/150, 100/100, 공식 source set 100/100, 실제 정적 image 100/100, known motion 6/6, 질문 10개·packet 4개·G1 control·`haikyu`·Cycle 5 수정·KEEP을 모두 `PASS`, `BLOCKERS: none`, `PROMOTION AUTHORIZATION: YES`로 보고해야 한다. Local은 visual ledger 2/2와 실제 `/tmp` image를 대조한다. Gemini/Grok은 로컬 artifact를 보지 못했으면 `inaccessible-not-claimed`로 쓰고 공식 URL에서 실제 image 100/100을 열어야 한다. Oracle은 사용자 재개 전 이 출력 자체를 생성하지 않는다.
