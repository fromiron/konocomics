# G2 100작품 Catalog 주석 승격 독립 패널 요청 — Cycle 4

## 1. 역할, identity, 판정 경계

당신은 **konocomics (`fromiron/konocomics`)**의 독립 Catalog 주석 검토자다. 저장소를 수정하지 말고, 다른 검토자의 응답을 보지 않은 상태에서 아래에 동결한 동일 증거를 직접 심사한다.

- 저장소: `konocomics (fromiron/konocomics)`
- 기준 브랜치: `main`
- 기준 커밋: `a179da01807aae42ac55c800bc273b9540138be6` (`a179da0`)
- 로컬 `main`, `HEAD`, `origin/main`은 요청 동결 시점에 모두 위 커밋이다.
- GitHub tools/connectors를 사용할 수 있다. live repository, 정확한 commit, diff, checks와 관련 문맥 및 아래 파일을 직접 열어 확인하라.
- exact-head GitHub Actions run `31585524833`, job `94078342980` (`quality`)은 위 HEAD에서 완료됐고 결론은 `success`다.
- 로컬 checkout을 사용한다면 먼저 `git branch --show-current`, `git rev-parse HEAD`, `git rev-parse origin/main`으로 위 identity를 확인하라. 다른 commit의 결과로 이 번들을 승인하지 마라.

이 패널의 승격 판정 범위는 기존 G1 승인 50작품을 유지한 채 추가되는 정확히 100작품의 bibliography, Genre, Theme, 17 Axis, evidence와 intended eligibility, 그리고 Cycle 3에서 다시 연 `haikyu.relationshipStructure=2`다. 다만 Cycle 4 검토자는 후보 전체의 일관성과 교차 오염을 확인하기 위해 **150작품 전부를 독립적으로 검사**해야 한다. 기존 G1 49작품은 무변경 integrity control이며 재승격 대상은 아니다.

이 패널은 다음을 판정하거나 허가하지 않는다.

- Taste Engine 대 Baseline의 G2 제품 방향 `GO`
- 사람 10명의 블라인드 테스트를 통과했다는 주장
- synthetic pilot 또는 하니스 결과 승인
- Slice 5 또는 제품 UI 시작
- 추천 산식, factor dictionary, threshold 또는 역할 목표 변경
- 기존 G1 49작품의 재승인·교체·약화

이 요청에서 `GO`는 새 100작품과 다시 열린 `haikyu.relationshipStructure`의 주석 승격만 허용한다. G2 product-direction gate는 별도 동결 번들·별도 요청·별도 판정이 필요하다.

## 2. 독립 패널, Oracle 중단, 만장일치 조건

동일한 이 요청을 다음 네 경로가 서로 독립적으로 검토한다.

1. Local
2. Gemini
3. Grok
4. GPT-5.6 Pro Oracle

각 검토자는 다른 응답을 읽지 않고 현재 commit과 실제 근거를 처음부터 심사한다. **4/4 hash-bound, 조건 없는 `GO`**만 101개 열린 주석의 `authorizedModelPanel` 승격을 허용한다. 한 응답이라도 `REVISE` 또는 `NO-GO`이거나, 응답이 무효·미완료·미실행이면 승격하지 않는다. 이전 cycle의 부분 `PASS`나 `GO`는 재사용하지 않는다.

### 현재 실행 허가

- Local, Gemini, Grok은 이 요청으로 실행할 수 있다.
- **Oracle은 사용자가 재개를 명시하기 전까지 금지되어 있으며 `NOT RUN`이다.** 요청서 작성, 다른 세 검토자의 실행·응답 또는 세 경로의 `GO`도 Oracle 호출 승인이 아니다.
- Oracle을 미리 열거나, 요청을 첨부하거나, 질문하거나, 부분 실행하거나, 다른 모델·브라우저 경로로 대체하지 않는다.
- 사용자가 Oracle 재개를 명시하면 이 요청 전체를 한 번에 제공하고 다음 문맥을 반드시 포함한다: 프로젝트·저장소는 `konocomics (fromiron/konocomics)`, 브랜치는 `main`, 정확한 HEAD는 `a179da01807aae42ac55c800bc273b9540138be6`, 사용 가능한 GitHub tools/connectors로 live repo, commit, checks와 관련 문맥을 직접 검사할 수 있다.

모델 패널은 사람 검수를 뜻하지 않는다. 승인 뒤에도 모든 해당 evidence의 `reviewedByHuman=false`를 유지한다.

## 3. Cycle 1–3 이력과 Cycle 4 수정

### 이전 cycle 종료 상태

| Cycle | reviewed HEAD                              | request SHA-256                                                    | 종료 상태                                                                                                                      |
| ----- | ------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 1     | `b74d525b151785097aa42434a721202f2ec99e17` | `497e58eaa76a7881ed37f45cc330fce71d90109afb48c1c67b83621812511ffe` | Local 유효 `REVISE`; Gemini superseded/non-authorizing; Grok 미완료; Oracle 중단                                               |
| 2     | `e32adf696d921c30501e4e57c95a22577e3b033a` | `101b2c989e038041efd05789033c009e1d233af767c496b27286b72fe0150a4b` | Grok 유효 `REVISE`; Gemini invalid; Local 미완료; Oracle `NOT RUN`                                                             |
| 3     | `c5f19736712b55b4f129d99830f8012a1ef30d4d` | `ce5447c655fe790e71447677f5ff976716b9a271e4f327a73a6f515438714261` | Local 유효 `REVISE`; Gemini valid/non-authorizing `REVISE`; Grok invalid; Oracle `NOT RUN`; Local의 Art 직접 시각 검사는 0/100 |

Cycle 1에서는 `blue-giant` Genre, `initial-d`/`mf-ghost` series grouping과 `i-think-our-son-is-gay`/`my-home-hero`/`island-in-a-puddle`의 근거 없는 `foundFamily`를 고쳤다. Cycle 2 뒤에는 스포츠·직장·가족 경계의 Theme를 추가 정리하고 `yowamushi-pedal.relationshipStructure`를 4→2로 고쳤으며, `lovely-muco`와 `fire-force`의 Art 서술을 manifest와 맞췄다. Cycle 3 뒤에는 새 100작품 Theme 33개와 `relationshipStructure` 17개를 정정하고 `haikyu.relationshipStructure`를 4→2로 바꿔 후보에서 다시 `unreviewed`로 열었다.

### Cycle 4 콘텐츠 수정 — commit `d17b91d2ece50b09ebe48a85ac884f7bdff61165`

독립 재현 뒤 다음 네 Axis와 여덟 Theme만 원본 packet, 합성 후보, narrative·ledger 및 생성 산출물에 반영했다.

```text
mystery-to-iu-nakare.strategy: 3 -> 1
aoashi.strategy: 4 -> 2
gto.romance: 3 -> 1
mf-ghost.strategy: 4 -> 2

mystery-to-iu-nakare.school: remove
real.foundFamily: remove
blue-period.workplace: remove
saturn-apartments.foundFamily: remove
my-love-story-with-yamada-kun-at-lv999.workplace: remove
cardcaptor-sakura.foundFamily: remove
sailor-moon.foundFamily: remove
tomorrows-joe.foundFamily: remove
```

`showa-genroku-rakugo-shinju.foundFamily=1`, `the-golden-sheep.relationshipStructure=4`, `my-home-hero.revenge=1`은 초반 범위와 사전을 독립 대조해 유지했다. KEEP은 이전 cycle 승인이 아니며 현재 HEAD에서 다시 검사한다.

### Cycle 4 Art 근거 수정 — commit `a179da01807aae42ac55c800bc273b9540138be6`

실제 내부 페이지를 렌더링해 frontmatter·title splash를 제외하고 exact reference와 관찰 맥락을 바로잡았다. Factor 값, confidence, eligibility와 생성 산출물은 바꾸지 않았다.

- fresh-a 16작품: `medalist`, `that-time-i-got-reincarnated-as-a-slime`, `a-sign-of-affection`, `heavenly-delusion`, `ajin`, `historie`, `what-did-you-eat-yesterday`, `dance-dance-danseur`, `blood-on-the-tracks`, `metamorphose-no-engawa`, `kowloon-generic-romance`, `my-happy-marriage`, `my-next-life-as-a-villainess`, `boys-run-the-riot`, `blue-box`, `the-darwin-incident`.
- fresh-b 4작품: `fruits-basket`, `blue-giant`, `she-loves-to-cook-and-she-loves-to-eat`, `yowamushi-pedal`.
- `my-next-life-as-a-villainess`는 기존 BOOK WALKER 표본이 유효 내부 페이지 다섯 장뿐임을 확인해, 제목·creator가 일치하는 공식 Pixiv Comic Chapter 1 story `29486`의 page 5–10으로 교체했다.
- `data/staging/g2/admission/fresh-a.json`, packet/candidate Art manifest와 evidence URL, Korean narrative를 같은 provenance로 정합화했다.

## 4. 정확한 판정 대상과 구조

새 100작품은 아래 네 staging packet의 Work ID 합집합이다. packet 간 또는 기존 50작품과 겹치는 ID는 없어야 한다.

| Packet      | 작품 | Anchor / Bridge / Discovery | onboarding | recommendation | libraryOnly |
| ----------- | ---: | --------------------------: | ---------: | -------------: | ----------: |
| reuse-eight |    8 |                   4 / 0 / 4 |          4 |              8 |           0 |
| fresh-a     |   31 |                  3 / 3 / 25 |          3 |             31 |           0 |
| fresh-b     |   31 |                  3 / 4 / 24 |          3 |             31 |           0 |
| fresh-c     |   30 |                  2 / 3 / 25 |          2 |             30 |           0 |
| **합계**    |  100 |                12 / 10 / 78 |         12 |            100 |           0 |

각 packet의 실제 `works.csv`, `aliases.csv`, `volumes.csv`, `factors.csv`, `themes.csv`, `recommendation-context.csv`, `recommendation-config.csv`, `intended-eligibility.csv`, `evidence/evidence.csv`, `evidence/art-evidence-manifest.csv`, `annotations-and-evidence.md`를 읽는다. admission provenance는 `data/staging/g2/admission/fresh-{a,b,c}.json`도 함께 읽는다.

합성 pre-approval 후보는 `data/staging/g2/candidate-source/`의 정확한 10개 파일이다. 관찰 구조는 다음과 같다.

| 항목                   | 행 수 |
| ---------------------- | ----: |
| Work                   |   150 |
| Alias                  |   177 |
| Volume                 |   154 |
| Factor                 |  2550 |
| Theme                  |   463 |
| Recommendation context |   150 |
| Recommendation config  |     1 |
| Evidence               |   415 |
| Art evidence manifest  |   600 |

- 2550 Factor 행은 `150 × 17 Axis`, 600 Art 행은 `150 × 4 Art Axis`다.
- 후보 version은 `v1-df7474f9c604`, 최종 역할은 Anchor 30 / Bridge 30 / Discovery 90이다.
- 최종 의도는 onboarding 40 / recommendation 150 / libraryOnly 0이다.
- 기존 49작품은 `authorizedModelPanel`, 새 100작품과 `haikyu`는 `unreviewed`다.
- 승인 전 예상 issue는 정확히 error `UNREVIEWED_ELIGIBILITY` 101, warning `AUTHORIZED_MODEL_PANEL_REVIEW` 49, warning `EVIDENCE_NOT_HUMAN_REVIEWED` 415뿐이다.
- generated 세 파일은 source와 review를 대체하지 않는 판독 산출물이다.

## 5. provenance와 규범 계약

새 100작품의 Narrative, Tone/Relationship, Genre, Theme와 Art 값은 사람이 확정한 주석이 아니라 1차 bibliography와 공식 또는 권리자 허용 초반 미리보기를 대조한 **오프라인 모델 초벌 주석**이다.

- 모든 새 evidence는 `reviewedByHuman=false`다. `model`, `manual`, `publisher`와 `authorityClass`는 작성 주체·출처를 구분하며 사람 검수를 뜻하지 않는다.
- 빈 시장 `reviewAverage`·`reviewCount`, confidence, template 문구를 사람 검수나 품질 승인으로 해석하지 않는다.
- packet narrative만으로 승인하지 말고 실제 CSV 행, `evidenceId`, source URL, exact reference, manifest state/value를 교차 대조한다.
- 근거 부족은 0/2가 아니라 `unknown`; `notApplicable`은 동적 장면을 평가할 대상 자체가 없을 때만 허용한다.
- 평가 범위는 `factorScope=entry_1_3_volumes`; 17 Axis의 0/2/4와 1/3은 factor dictionary의 관찰 기준을 따른다.
- 단순 팀·직장·연애·생물학적 가족은 `foundFamily`가 아니며, 고정 파티·핵심 조연 반복 2를 복잡한 군상 관계 4로 과대평가하지 않는다.
- coverage·validator·CI 통과는 실제 주석과 이미지 품질 검토를 대체하지 않는다.

규범 우선순위대로 다음을 실제 commit에서 읽는다.

1. `docs/planning/02-product-spec.md` §5와 §7
2. `docs/factors/factor-dictionary.md`
3. `docs/factors/annotation-guide.md`
4. `docs/planning/06-implementation-plan.md` Slice 4
5. `docs/planning/07-acceptance-test-plan.md` §3–4

## 6. Art 직접 증거와 접근 경계

새 100작품의 정적 Art는 작품당 판독 가능한 서로 다른 내부 페이지 6장, 서로 다른 맥락 2개 이상을 직접 렌더링·검사했다. 표지·title splash·frontmatter·중복 페이지는 제외했다. known 정적 축은 exact reference를, known `motionImpact`는 숫자 endpoint를 가져야 한다.

### 로컬 시각 증거 ledger

아래 `/tmp` PNG와 CSV는 권리 이미지를 저장소에 복제하지 않기 위해 commit하지 않았다. Local 검토자는 해당 절대 경로의 artifact를 직접 열고 hash를 다시 계산한다. 외부 검토자는 이 ledger를 자신이 이미지를 직접 본 증거로 오인하지 말고, GitHub의 manifest·공식 URL·접근 가능한 공식 reader를 독립 검사한다. 접근할 수 없는 이미지가 판정에 필수라면 미검사를 `PASS`로 쓰지 말고 `REVISE` 또는 미완료로 남긴다.

| 범위                       | 작품 | 결과    | ledger SHA-256                                                     |
| -------------------------- | ---: | ------- | ------------------------------------------------------------------ |
| reuse-eight 8 + fresh-c 30 |   38 | 38 PASS | `769904bd897c4be157b8e7b39f09a44c5df6caaa77c9033055d13f1db5729301` |
| fresh-a Kodansha           |   12 | 12 PASS | `2bd5dd84799aaeb3aa1e9476aed1eb3a3d14996dcee50df03714f95a681a854c` |
| fresh-a non-Kodansha       |   19 | 19 PASS | `dee50e9980f759a7c223783615f62116808e0b288fc73a2d18e33eafd35ef4a7` |
| fresh-b                    |   31 | 31 PASS | `f7bdabb13ce470e86e58f5f89147fdceb4cdbe8e89b688167399aaf7f1eb91d4` |

정확한 경로:

```text
/tmp/konocomics-cycle4-art/index-fragment.csv
/tmp/konocomics-cycle4-art/fresh-a-kodansha-helper/index-fragment.csv
/tmp/konocomics-cycle4-art/fresh-a-nonkodansha-index-fragment.csv
/tmp/konocomics-cycle4-art/fresh-b-index-fragment.csv
```

네 ledger 합계는 100행/100고유 Work/100 PASS/100고유 artifact SHA다. 100개 경로가 모두 존재했고 실제 PNG SHA가 ledger와 일치했으며, 모든 행에 서로 다른 exact ref 6개와 `;`로 구분된 2개 이상 관찰 맥락이 있다.

새 100작품의 known motion은 6/6을 직접 확인했다.

- `chis-sweet-adventures`, `lovely-muco`, `penguin-and-house`, `fire-force`: 첫 번째 38행 ledger의 notes에 numeric page/panel sequence와 static artifact hash가 있다.
- `inuyasha`, `yowamushi-pedal`: `/tmp/konocomics-cycle4-art/fresh-b-motion-evidence.csv`, 2/2 PASS, SHA-256 `3fee9a6f51a914d469260a0b9c5982b9bb963925db438c1cf7b5c14d95827b7f`.
- 나머지 새 94작품의 `motionImpact=unknown`은 정지면에서 값을 만들지 않은 fail-closed 결과다.

artifact sheet/CSV identity 감사 결과:

- `/tmp/konocomics-cycle4-art/csv-audit-indexes.json`: SHA-256 `cbec13105e90d928aa02c66bff3a035b81e27ebdac32fe23dd698df2c6638aa8`; 5개 ledger 모두 마지막 LF 1개, blank record 0, 표 크기 `A1:O39`, `A1:O32`, `A1:O13`, `A1:O20`, `A1:L3`.
- `/tmp/konocomics-cycle4-art/csv-audit-repo.json`: SHA-256 `571eff0c2903f9e660beab9bd6dc9d1f2fd042840f8b4084e83deab66e862036`; fresh-a/fresh-b/candidate Art manifest와 fresh-a/candidate evidence 5개를 artifact-backed 표로 열어 행·열·빈 레코드를 확인했다.
- `/tmp/konocomics-cycle4-art/fresh-b-sheets.sha256`: 31개 fresh-b sheet의 identity ledger, SHA-256 `50c7ac177116635b61b8dfd43f445db4ad45acd027b05db0002126586fb4d0f6`.
- `/tmp/konocomics-cycle4-art/fresh-a-kodansha-helper/inspection-report.json`: 12작품/72 raw/72 readable unique pages, 12 PASS와 제외·대체 ref 기록, SHA-256 `ecf244b6d6841a4a2a7a343b6d04f652b80afa46da5e8dd4998c762175152254`.

이 ledger와 audit은 실제 이미지 검토 provenance를 보존하지만 패널 판정을 대신하지 않는다.

## 7. 동결 SHA-256

### 후보와 packet bundle

bundle digest는 각 디렉터리에서 `LC_ALL=C find <dir> -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum`의 LF 출력 전체를 다시 SHA-256한 값이다.

```text
65e9dcf840f1f26af685d1701fb91b7d6b95ec54f9f47ff0d639c32b7fd46a11  candidate-source bundle (10 files)
bf9b4527ba546c2138499f290687fcf15e447caa20f84bfd28611bb73ace8a43  reuse-eight bundle (11 files)
96960d5562949195531f0fded26f59fc221bd87d2b313843afb722d83235c861  fresh-a bundle (11 files)
c72edf3571d199bffc3ab499a7ae4520847865cc08d98b450a07980e1aacf197  fresh-b bundle (11 files)
e87e608863578994da24f7f4e01f332da8aa8f6d622f54c977aff74f837af5bb  fresh-c bundle (11 files)
```

후보 10개 파일:

```text
16b2964b3a4669bc07213c0f2fa70577fe7a9feefedc77752b24b637931d2ca4  data/staging/g2/candidate-source/aliases.csv
ebf3656d73c88fe0ac9c419330f7442d9dc60a1e303e0639d7c059d56d3d9a8f  data/staging/g2/candidate-source/evidence/art-evidence-manifest.csv
769174bc11c446fa4766ee36703102e7e70b5186b2081df17f528d5e67030fce  data/staging/g2/candidate-source/evidence/evidence.csv
d29d471d76d70a1b0337e8a7ee0724100e2e4673268943c5009a838b02c8d6f6  data/staging/g2/candidate-source/factors.csv
53f176328d441998917006e8e89ccbc2685798d4611ce40c66cea2775d94620d  data/staging/g2/candidate-source/recommendation-config.csv
87bc2661216c04b793449903bf8472714301fda3f75dd8de6c49d7b3b00ccf9d  data/staging/g2/candidate-source/recommendation-context.csv
382965a19ef75aeb03d051b2285eac0cd856acc2c016bb1635c3121627dac536  data/staging/g2/candidate-source/reviews/g1-sanity-panel.md
6080d6a1efaed3e2b8d430ff0e94cd2cfbe2380752f278b54cb25076da00c07c  data/staging/g2/candidate-source/themes.csv
4ab402e628d125decca67c550d7d1e32594cca78c1edcec54685148d15930009  data/staging/g2/candidate-source/volumes.csv
440cf921a03d771e0a6b46026e9b435e4a3be1802a680c764e187d119c0855a5  data/staging/g2/candidate-source/works.csv
```

admission, narrative, intended eligibility와 generated:

```text
937a2a9c8fe5757b4a3daf411fed70c62792470f8b915ec64801d3652884e5ee  data/staging/g2/admission/fresh-a.json
cbf7131d1654d10e2ebac191f2ea64ea1060564f82af55ba7a535f34a680e164  data/staging/g2/admission/fresh-b.json
60b7726b29eec55d0358dc76a769472fdc71e66ae39d5bd3a1ea2d3c9497a5d3  data/staging/g2/admission/fresh-c.json
24c8d0d5b8706abe5cbc4bc1460984a852b8342d47a3644b41c9182c5eb406a8  data/staging/g2/reuse-eight/annotations-and-evidence.md
fa9dbed4e0f0afc371f7a64cb5ade6b20edd3f00326a6c1ac11814ece5229562  data/staging/g2/fresh-a/annotations-and-evidence.md
a7006876477d3070e13ac632111f0cdf326c492995f7619bb4d86418b83743a7  data/staging/g2/fresh-b/annotations-and-evidence.md
98d786762a972fa3559e6a53a509d090ba5f35ef7a5dfe6ab608945f78f6dde8  data/staging/g2/fresh-c/annotations-and-evidence.md
117a562ed83b6c81d8529ac6e1522b0524a46372b7bdafe80f3bcd3bb2ea33c2  data/staging/g2/reuse-eight/intended-eligibility.csv
402fa2247e1568491cf4a098ed4ff6997f49cc46d4c194643ebc8ea1a5f81c24  data/staging/g2/fresh-a/intended-eligibility.csv
3ef2ac1e9e877e92747fa66c529eaad5d92e2bf1e3518e852b7c9f88783aa0b9  data/staging/g2/fresh-b/intended-eligibility.csv
fffbc944d3f00efdcd5f0359a65d29ab11821586712c7b266dc127359956cd03  data/staging/g2/fresh-c/intended-eligibility.csv
0f6d2553505d6f84b57d0ccae8fcb3dc8c91d2bbeab008bf242ee44f3ce26062  data/staging/g2/candidate-generated/catalog-v1.json
d184db6e925adf4fcfa6206585f9b2bf926b7bd4f4083cd4c8a9a161b3e1caf2  data/staging/g2/candidate-generated/recommendation-context-v1.json
c24d062bc62358aa48710363063a491e20bb80d06830f4975b7cb18ea3f7365d  data/staging/g2/candidate-generated/taste-vs-baseline.md
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

위 선언 repository 파일은 `10 candidate + 3 generated + 8 narrative/intended + 3 admission + 7 normative/gate = 31`개다. packet 네 bundle digest는 각 11개 source 파일 전체를 추가로 고정한다. 선언 hash나 bundle digest가 하나라도 다르면 `REVISE`다.

## 8. 재현 가능한 검사와 완료된 검증

후보 pipeline을 현재 HEAD에서 재현한다.

```bash
TEMP=/tmp TMP=/tmp TMPDIR=/tmp node --import tsx --input-type=module -e '
import { runCatalogPipeline } from "./scripts/catalog/pipeline.ts";
const result = runCatalogPipeline("data/staging/g2/candidate-source");
const counts = Object.fromEntries(
  [...new Set(result.issues.map((issue) => `${issue.severity}:${issue.code}`))]
    .sort()
    .map((key) => [key, result.issues.filter((issue) => `${issue.severity}:${issue.code}` === key).length]),
);
console.log({ catalogVersion: result.catalog.catalogVersion, works: result.catalog.works.length, volumes: result.catalog.volumes.length, counts });
'
```

예상 결과:

```text
catalogVersion: v1-df7474f9c604
works: 150
volumes: 154
error:UNREVIEWED_ELIGIBILITY: 101
warning:AUTHORIZED_MODEL_PANEL_REVIEW: 49
warning:EVIDENCE_NOT_HUMAN_REVIEWED: 415
other errors: 0
```

exact HEAD 직전 로컬에서 formatting, typecheck, lint, 전체 unit tests, catalog validation/build/currentness, production build, G2 harness build, candidate pipeline, Art ledger path/hash/중복 검증이 통과했다. GitHub run/job도 formatting, typecheck, lint, tests, catalog validation/currentness, build와 G2 harness build를 exact HEAD에서 성공시켰다. 테스트·CI 성공을 콘텐츠 승인으로 대체하지 않는다.

## 9. 전수 검토 질문과 verdict 기준

각 검토자는 150작품 모두를 독립 검사하고, 새 100작품과 `haikyu.relationshipStructure`에 대해 다음을 답한다.

1. **IDENTITY/HASH:** HEAD, exact-head CI, 31개 선언 파일, 5개 repository bundle digest와 접근 가능한 visual ledger hash가 일치하는가?
2. **SCOPE/DISJOINTNESS:** 100작품 합집합, 150 전체, role·eligibility·volume identity와 중복 없음이 맞는가?
3. **BIBLIOGRAPHY:** 새 100작품의 일본어 제목, creator, publisher, demographic, status/year, 대표 일본어 1권 ISBN·판본이 1차 근거와 맞는가?
4. **GENRE/THEME:** 150작품 전체 coherence와 새 100작품의 모든 Genre·Theme/centrality가 초반 범위와 dictionary에 맞는가?
5. **NON-ART:** 새 1300개 non-Art 셀, Cycle 4 네 Axis, 유지 세 항목과 `haikyu.relationshipStructure=2`가 직접 근거로 지지되는가?
6. **UNKNOWN:** 부족한 근거를 0/2/`notApplicable`로 치환한 셀이 없고 known을 `unknown`으로 내려야 할 항목이 없는가?
7. **ART:** 새 100작품 400행의 authority, edition mapping, 6쪽/2맥락, exact static refs와 known motion 6/6을 실제 이미지가 접근 가능한 범위에서 독립 확인했는가? 접근 불가를 `PASS`로 표현하지 않았는가?
8. **PROVENANCE:** 모델 초벌, `reviewedByHuman=false`, template와 한계가 정직하며 사람 검수로 오인시키지 않는가?
9. **ROLE/ELIGIBILITY/PIPELINE:** 30/30/90, 40/150/0, 101/49/415 fail-closed 상태와 generic Art gate가 맞는가?
10. **PROMOTION/BOUNDARY:** 아래 최소 변환을 값 수정 없이 수행할 수 있고, 이 판정이 G2 제품 방향·사람 테스트·UI·Slice 5 허가가 아님을 확인하는가?

`GO`는 150/150을 검사하고 새 100작품과 열린 `haikyu`에 수정 필수 항목이 없으며, 실제 Art 접근 한계를 숨기지 않고 아래 승격을 조건 없이 승인할 때만 가능하다. 한 필드라도 충돌·근거 부족·Art 정책 위반이 있거나 미검사 범위를 승인으로 확장하면 `REVISE`; 번들 전체가 필드별 수정으로 심사 가능하지 않으면 `NO-GO`다. `GO with conditions`는 허용하지 않는다.

4/4 유효한 `GO`와 현재 사용자의 별도 승인 후에만 새 100작품과 `haikyu`의 `annotationReviewMethod`를 `authorizedModelPanel`로 바꾸고, 실제 승인 시각과 `reviews/g2-catalog-annotation-panel.md`를 기록할 수 있다. 기존 49작품의 값과 G1 reference, 모든 `reviewedByHuman=false`, Factor/Theme/Genre/confidence/bibliography/role/eligibility는 바꾸지 않는다. 그 뒤 전체 pipeline을 다시 통과시킨다. 이 변환 전에는 eligibility promotion, `data/source` 승격, 제품 방향 판정과 Slice 5를 수행하지 않는다.

## 10. 단일 필수 출력 계약

첫 줄은 반드시 다음 셋 중 하나와 정확히 같아야 한다.

```text
VERDICT: GO
VERDICT: REVISE
VERDICT: NO-GO
```

이후 다음 형식을 모두 채운다.

```text
REVIEWER: Local | Gemini | Grok | GPT-5.6 Pro Oracle
REPOSITORY: konocomics (fromiron/konocomics)
BRANCH: main
HEAD: a179da01807aae42ac55c800bc273b9540138be6
CANDIDATE BUNDLE SHA-256: 65e9dcf840f1f26af685d1701fb91b7d6b95ec54f9f47ff0d639c32b7fd46a11
DECLARED REPOSITORY FILES CHECKED: 31/31
PACKET BUNDLE DIGESTS CHECKED: 4/4
VISUAL LEDGERS CHECKED: 5/5 | <접근 불가 항목과 대체하지 않은 검사 경계>
ALL CANDIDATE WORKS CHECKED: 150/150
NEW WORKS CHECKED: 100/100
REOPENED CHECK: haikyu.relationshipStructure

REQUIRED QUESTIONS:
1. IDENTITY/HASH: PASS | FAIL — <직접 확인한 근거>
2. SCOPE/DISJOINTNESS: PASS | FAIL — <직접 확인한 근거>
3. BIBLIOGRAPHY: PASS | FAIL — <직접 확인한 근거>
4. GENRE/THEME: PASS | FAIL — <직접 확인한 근거>
5. NON-ART: PASS | FAIL — <직접 확인한 근거>
6. UNKNOWN: PASS | FAIL — <직접 확인한 근거>
7. ART: PASS | FAIL — <직접 본 artifact/공식 URL, exact refs, known motion 6/6와 접근 한계>
8. PROVENANCE: PASS | FAIL — <직접 확인한 근거>
9. ROLE/ELIGIBILITY/PIPELINE: PASS | FAIL — <직접 확인한 근거>
10. PROMOTION/BOUNDARY: PASS | FAIL — <허가하는 것과 허가하지 않는 것을 명시>

PACKET CHECKS:
- reuse-eight: PASS | REVISE — <8/8 전수 검사 근거>
- fresh-a: PASS | REVISE — <31/31 전수 검사 근거>
- fresh-b: PASS | REVISE — <31/31 전수 검사 근거>
- fresh-c: PASS | REVISE — <30/30 전수 검사 근거>
- existing G1 integrity controls: PASS | REVISE — <50/50 교차 검사 근거>
- haikyu.relationshipStructure: PASS | REVISE — <직접 확인한 근거>

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

유효한 `GO`는 31/31, 4/4, 150/150, 100/100을 선언하고 10개 질문·네 packet·G1 integrity control·`haikyu`가 모두 `PASS`, `BLOCKERS: none`, `PROMOTION AUTHORIZATION: YES`여야 한다. Local은 5/5 visual ledger를 실제 `/tmp` artifact와 대조한다. 외부 검토자는 접근하지 못한 로컬 artifact를 직접 봤다고 선언할 수 없으며, 공식 URL로 동등한 검사를 완료하지 못하면 조건 없는 `GO`가 아니다. Oracle은 사용자 재개 전에는 이 출력 자체를 생성하지 않는다.
