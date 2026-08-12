# G2 100작품 Catalog 주석 승격 독립 패널 요청

## 1. 역할과 판정 경계

당신은 **konocomics (`fromiron/konocomics`)**의 독립 Catalog 주석 검토자다. 저장소 파일을 수정하지 말고, 다른 검토자의 응답을 보지 않은 상태에서 아래에 동결한 동일 증거를 직접 심사한다.

- 저장소: `konocomics (fromiron/konocomics)`
- 기준 브랜치: `main`
- 기준 커밋: `b74d525b151785097aa42434a721202f2ec99e17` (`b74d525`)
- GitHub tools/connectors를 사용할 수 있다. live repository, 정확한 commit, diff, checks와 아래 파일을 직접 열어 확인하라.
- 로컬 checkout을 사용한다면 먼저 `git branch --show-current`와 `git rev-parse HEAD`로 위 identity를 확인하라. 다른 commit의 결과로 이 번들을 승인하지 마라.

이 패널의 범위는 기존 G1 승인 50작품을 유지한 채 추가되는 **정확히 100작품의 bibliography, Genre, Theme, 17 Axis, evidence와 intended eligibility를 검토하고 Catalog 승격 가능 여부를 판정하는 것뿐**이다.

이 패널은 다음을 판정하거나 허가하지 않는다.

- Taste Engine 대 Baseline의 G2 제품 방향 `GO`
- 사람 10명의 블라인드 테스트를 통과했다는 주장
- G2 하니스, 결과 JSON, 집계 지표 또는 synthetic pilot 승인
- Slice 5 제품 UI 시작
- 추천 산식, factor dictionary, threshold 또는 역할 목표 변경
- 기존 G1 50작품의 재승인·교체·약화

이 요청에서 `GO`는 오직 100작품의 주석과 아래에 고정한 승격 변환을 허용한다. 이후 G2 product-direction gate는 별도 동결 번들·별도 요청·별도 판정을 거쳐야 한다.

## 2. 독립 패널과 승인 조건

동일한 이 요청을 다음 네 경로가 서로 독립적으로 검토한다.

1. Local
2. Gemini
3. Grok
4. GPT-5.6 Pro Oracle

각 검토자는 다른 응답을 읽지 않고 이 commit과 실제 파일만 심사한다. **4/4 hash-bound, 조건 없는 `GO`**만 100작품의 `authorizedModelPanel` 승격을 허용한다. 한 응답이라도 `REVISE` 또는 `NO-GO`이면 승격하지 않는다. 모델 패널은 사람 검수를 뜻하지 않으며, 승인 후에도 모든 해당 evidence의 `reviewedByHuman=false`를 유지한다.

Oracle에는 반드시 다음 문맥을 함께 제공하라.

- 프로젝트는 `konocomics (fromiron/konocomics)`이다.
- 브랜치는 `main`, 정확한 HEAD는 `b74d525b151785097aa42434a721202f2ec99e17`다.
- 사용 가능한 GitHub tools/connectors로 live repo, commit, checks와 관련 코드를 직접 검사할 수 있다.

## 3. 정확한 판정 대상

새 100작품은 아래 네 staging packet의 Work ID 합집합이다. packet 간 또는 기존 50작품과 겹치는 ID는 없어야 한다.

| Packet        |    작품 | 의도 역할 Anchor / Bridge / Discovery | 의도 onboarding | 의도 recommendation | 의도 libraryOnly |
| ------------- | ------: | ------------------------------------: | --------------: | ------------------: | ---------------: |
| reuse-eight   |       8 |                             4 / 0 / 4 |               4 |                   8 |                0 |
| fresh-a       |      31 |                            3 / 3 / 25 |               3 |                  31 |                0 |
| fresh-b       |      31 |                            3 / 4 / 24 |               3 |                  31 |                0 |
| fresh-c       |      30 |                            2 / 3 / 25 |               2 |                  30 |                0 |
| **추가 합계** | **100** |                      **12 / 10 / 78** |          **12** |             **100** |            **0** |

Packet 원본은 다음 경로다.

- `data/staging/g2/reuse-eight/`
- `data/staging/g2/fresh-a/`
- `data/staging/g2/fresh-b/`
- `data/staging/g2/fresh-c/`

각 packet에서 반드시 다음 실제 파일을 읽는다.

- `works.csv`
- `aliases.csv`
- `volumes.csv`
- `factors.csv`
- `themes.csv`
- `recommendation-context.csv`
- `intended-eligibility.csv`
- `evidence/evidence.csv`
- `evidence/art-evidence-manifest.csv`
- `annotations-and-evidence.md`

150작품으로 합성한 정확한 pre-approval 후보는 `data/staging/g2/candidate-source/`다. 다음 10개 파일이 후보의 완전한 파일 집합이다.

- `data/staging/g2/candidate-source/works.csv`
- `data/staging/g2/candidate-source/aliases.csv`
- `data/staging/g2/candidate-source/volumes.csv`
- `data/staging/g2/candidate-source/factors.csv`
- `data/staging/g2/candidate-source/themes.csv`
- `data/staging/g2/candidate-source/recommendation-context.csv`
- `data/staging/g2/candidate-source/recommendation-config.csv`
- `data/staging/g2/candidate-source/evidence/evidence.csv`
- `data/staging/g2/candidate-source/evidence/art-evidence-manifest.csv`
- `data/staging/g2/candidate-source/reviews/g1-sanity-panel.md`

후보의 관찰된 구조는 다음과 같다. 이는 탐색용 요약일 뿐이며 검토자는 실제 파일과 validator 결과를 독립적으로 재확인해야 한다.

| 항목                   | 행 수 |
| ---------------------- | ----: |
| Work                   |   150 |
| Alias                  |   177 |
| Volume                 |   154 |
| Factor                 |  2550 |
| Theme                  |   516 |
| Recommendation context |   150 |
| Recommendation config  |     1 |
| Evidence               |   415 |
| Art evidence manifest  |   600 |

- 2550 Factor 행은 `150 × 17 Axis`, 600 Art 행은 `150 × 4 Art Axis`다.
- 150개 Work ID, 154개 Volume ID, 154개 정규화 ISBN identity, 415개 Evidence ID는 각각 고유해야 한다.
- 최종 역할은 정확히 Anchor 30 / Bridge 30 / Discovery 90이다.
- 최종 eligibility 의도는 onboarding 40 / recommendation 150 / libraryOnly 0이다.
- 기존 50작품은 `annotationReviewMethod=authorizedModelPanel`이며 이 패널의 재판정 대상이 아니다.
- 새 100작품은 `annotationReviewMethod=unreviewed`, `annotationReviewedAt`과 `annotationReviewReference`가 비어 있다.
- 새 100작품은 intended eligibility가 후보에 적용돼 있으므로, 승인 전에는 정확히 작품당 하나의 `UNREVIEWED_ELIGIBILITY` 오류가 나는 것이 의도된 fail-closed 상태다.
- 후보의 관찰된 Catalog version은 `v1-57aaede217a7`이다.

동일 후보에서 생성해 commit에 동결한 판독 산출물도 실제 내용과 source 연결을 함께 확인한다. 생성 산출물은 source와 review를 대체하지 않는다.

- `data/staging/g2/candidate-generated/catalog-v1.json`
- `data/staging/g2/candidate-generated/recommendation-context-v1.json`
- `data/staging/g2/candidate-generated/taste-vs-baseline.md`

## 4. 정직한 초벌 provenance

새 100작품의 Narrative, Tone/Relationship, Genre, Theme와 Art 값은 사람이 확정한 주석이 아니다. 공식 작품 소개, 1차 출판사 bibliography, 초반 1~3권 범위의 공식 또는 권리자가 허용한 내부 미리보기를 대조한 **오프라인 모델 초벌 주석**이다.

- 모든 새 evidence는 `reviewedByHuman=false`다.
- `model`, `manual`, `publisher`는 각각 주석 작성 주체와 출처 유형을 구분한다. 모델이 관찰했다는 사실을 출판사 검수로 바꾸어 말하지 마라.
- Art manifest의 `authorityClass`와 연결 evidence의 `sourceType`은 권리 출처를 나타내며, 실제 관찰자가 사람이라는 뜻이 아니다.
- 시장 `reviewAverage`와 `reviewCount`는 권위 있게 관찰하지 못한 새 작품에서는 비워 두었다. 이를 결측 오류로 보거나 임의 값으로 채우지 마라.
- confidence가 존재해도 사람 검수 완료를 의미하지 않는다.
- `reviewedByHuman=false` 자체는 `REVISE` 사유가 아니다. 반대로 모델 초벌이라는 이유만으로 근거 부족 known 값을 허용해서도 안 된다.

검토자는 packet narrative만 읽고 승인하지 말고, 각 값이 실제 CSV 행, 연결 `evidenceId`, source URL, exact reference와 일치하는지 확인해야 한다.

## 5. 규범 계약

다음 파일을 실제 commit에서 읽고 우선순위대로 적용한다.

1. `docs/planning/02-product-spec.md` §5와 §7
2. `docs/factors/factor-dictionary.md`
3. `docs/factors/annotation-guide.md`
4. `docs/planning/05-architecture.md`
5. `docs/planning/06-implementation-plan.md` Slice 4
6. `docs/planning/07-acceptance-test-plan.md` §3–4

핵심 계약은 다음과 같다.

- 평가 범위는 `factorScope=entry_1_3_volumes`다. 후반 전개·애니메이션·영화만으로 값을 확정하지 않는다.
- 17 Axis의 0/2/4 anchor와 1/3 경계값은 factor dictionary의 관찰 가능한 기준을 따라야 한다.
- 근거 부족은 0 또는 중립 2가 아니라 `unknown`이다.
- `notApplicable`은 `motionImpact`에서 동적 장면을 평가할 대상 자체가 없다는 충분한 근거가 있을 때만 허용한다.
- Genre와 Theme는 정해진 목록만 사용하며 Theme centrality 1/2를 실제 초반 범위에서 판정한다.
- `progression`과 `characterArcWeight`, `darkness`와 `mentalStress`, Genre와 Theme를 서로 대신 사용하지 않는다.
- coverage 통과는 evidence 품질이나 주석 정확성 승인을 대신하지 않는다.

## 6. Art 근거 정책과 일반 Catalog 게이트

Art는 100작품 모두 다음 정책을 만족해야 한다.

1. 허용 출처는 원권리 출판사, 정식 라이선스 해외 출판사 또는 출판사 승인 플랫폼이다.
2. 판독 가능한 내부 페이지 또는 동등한 still frame을 작품당 서로 다른 6개 이상, 서로 다른 맥락 2개 이상 직접 확인한다. 표지는 표본이 아니다.
3. known 정적 Art 축(`artRealism`, `artDensity`, `visualSoftness`)마다 서로 다른 exact non-cover reference가 2개 이상이어야 한다.
4. known `motionImpact`는 숫자로 특정한 연속 page/panel 시작·끝 또는 유효한 timecode 범위가 있어야 한다. `first panel through final panel`, `first-to-final panels` 같은 비수치 표현은 불충분하다.
5. 대표 연속 동작을 확인하지 못하면 `motionImpact=unknown`으로 남긴다. 정지면 인상이나 줄거리로 값을 만들지 않는다.
6. `notApplicable`로 표본 부족이나 Art coverage 검사를 우회할 수 없다.
7. manifest의 state/value/confidence는 최종 Factor와 수치적으로 같아야 한다.
8. Factor가 가리키는 evidence는 같은 Work, 같은 source type, 정규화된 같은 URL을 가져야 한다.
9. edition과 `entry_1_3_volumes`의 판본 관계, observation, limitation, review status가 비어 있으면 안 된다.

일반 Catalog pipeline은 이제 Art manifest를 필수 입력으로 읽고 위 계약을 검사한다. 검토자는 구현과 테스트를 직접 확인한다.

- `scripts/catalog/art-evidence.ts`
- `scripts/catalog/load-source.ts`
- `scripts/catalog/pipeline.ts`
- `tests/unit/catalog/art-evidence.test.ts`

단순히 "600행이 있다"거나 "coverage가 0.30 이상이다"라는 이유로 Art를 승인하지 마라. validator가 검사하는 구조와 validator가 검사하지 못하는 실제 이미지·문맥·판정 품질을 모두 심사해야 한다.

## 7. 동결 identity와 SHA-256

아래 hash를 실제 파일과 대조하라. 후보 bundle digest는 `LC_ALL=C find data/staging/g2/candidate-source -type f -print0 | LC_ALL=C sort -z | xargs -0 sha256sum`이 출력한 정확한 10개 LF 행의 SHA-256이다.

```text
eab5e8bc2b5842a3801a744dd20f3f6dd31dc5df2d3634d0c6a24d8797102ad2  candidate-source bundle digest

16b2964b3a4669bc07213c0f2fa70577fe7a9feefedc77752b24b637931d2ca4  data/staging/g2/candidate-source/aliases.csv
0aa9176475190e81239d296b79f5b5b8f0960787c99914f042f801c0f2d85829  data/staging/g2/candidate-source/evidence/art-evidence-manifest.csv
4e7edbc4d356d62e96d035281dd3f480d2d8c292032cb4be1b4cbf85094c1b69  data/staging/g2/candidate-source/evidence/evidence.csv
05a6f08a6dcdb19a8b53645eefbe86cc7dddd504258a8e4b885016201ee5d9c7  data/staging/g2/candidate-source/factors.csv
53f176328d441998917006e8e89ccbc2685798d4611ce40c66cea2775d94620d  data/staging/g2/candidate-source/recommendation-config.csv
9e02f415d1af87ad6af5c19b0caf53099cf2bd0b2d9be2e55e45cdda3e923094  data/staging/g2/candidate-source/recommendation-context.csv
382965a19ef75aeb03d051b2285eac0cd856acc2c016bb1635c3121627dac536  data/staging/g2/candidate-source/reviews/g1-sanity-panel.md
ac0a90b5b2d9319e95c3b5b31f06e65b50ac58b999423123d15070b53e6f4fd4  data/staging/g2/candidate-source/themes.csv
4ab402e628d125decca67c550d7d1e32594cca78c1edcec54685148d15930009  data/staging/g2/candidate-source/volumes.csv
83809362ac85513a5a29b42894e23fe3285298c3f1f1f7729c1d1ab32ac913c7  data/staging/g2/candidate-source/works.csv
```

동결 생성 산출물 hash:

```text
c0d3d6702fcbdbe8a13ba28e157ff2d4f4174225278aea14a4ee00b0b73d5d1b  data/staging/g2/candidate-generated/catalog-v1.json
c8c93ed1219df96cfda6eb7a7c36483ed5d8f834d8dd287cab9a564a08b3bff3  data/staging/g2/candidate-generated/recommendation-context-v1.json
81c7e764149b6ad68cb7901a53da82367e279c1732d3d501819761b37bb27c9e  data/staging/g2/candidate-generated/taste-vs-baseline.md
```

Packet별 판단 서술과 intended eligibility의 hash는 다음과 같다.

```text
ed09e1b0b858527344ff56daa9025cb38ad92be5664bb465ad71b76975fa17e9  data/staging/g2/reuse-eight/annotations-and-evidence.md
a70f160edd14767328f3a89c62d8708e6b68452a68c351c3ad2b447974f8e3ba  data/staging/g2/fresh-a/annotations-and-evidence.md
a5a19b570acaad4704a4fdf7cc7bc28bc945e33ea5d04a4122a7cc515a8c1feb  data/staging/g2/fresh-b/annotations-and-evidence.md
45b074f38f5234ad6e5b58bcb2a037bceabf0a97f1a2310c1d2e7ad20ebc86c7  data/staging/g2/fresh-c/annotations-and-evidence.md
117a562ed83b6c81d8529ac6e1522b0524a46372b7bdafe80f3bcd3bb2ea33c2  data/staging/g2/reuse-eight/intended-eligibility.csv
402fa2247e1568491cf4a098ed4ff6997f49cc46d4c194643ebc8ea1a5f81c24  data/staging/g2/fresh-a/intended-eligibility.csv
3ef2ac1e9e877e92747fa66c529eaad5d92e2bf1e3518e852b7c9f88783aa0b9  data/staging/g2/fresh-b/intended-eligibility.csv
fffbc944d3f00efdcd5f0359a65d29ab11821586712c7b266dc127359956cd03  data/staging/g2/fresh-c/intended-eligibility.csv
```

규범·게이트 파일 hash:

```text
0650bb77d69d4f0dcabab0fa9384040cbcadd93d9f31d18a2cbe00d2a3aba0c1  docs/planning/02-product-spec.md
0c0df6733d4ee61db33f901ee15b19be6a7fbe0d690c439f89882273e2cdfb00  docs/planning/06-implementation-plan.md
e9048e7bf2f71d1f26d844de5920621fbd80f111a4118362fa6f51abfbd84106  docs/planning/07-acceptance-test-plan.md
a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be  docs/factors/factor-dictionary.md
f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3  docs/factors/annotation-guide.md
8e1da282006496c8d3a68c7f4934147dd82906da28821d4d6f6bb2e22cc14c11  scripts/catalog/art-evidence.ts
7811ee6c451646a8bb4a5668949d62167aabcf76210b72ddc611cc7338a40bd6  tests/unit/catalog/art-evidence.test.ts
```

hash 하나라도 다르면 해당 파일을 현재 요청의 일부로 간주하지 말고 `REVISE`로 판정하라.

## 8. 재현해야 할 구조 검사

검토자는 GitHub checks만 읽거나 아래 명령만 실행하고 끝내지 말고, 실제 파일·근거를 먼저 심사해야 한다. 그 후 같은 pipeline을 이용해 후보의 fail-closed 상태를 재현한다.

```bash
TEMP=/tmp TMP=/tmp TMPDIR=/tmp node --import tsx --input-type=module -e '
import { runCatalogPipeline } from "./scripts/catalog/pipeline.ts";
const result = runCatalogPipeline("data/staging/g2/candidate-source");
const counts = Object.fromEntries(
  [...new Set(result.issues.map((issue) => `${issue.severity}:${issue.code}`))]
    .sort()
    .map((key) => [key, result.issues.filter((issue) => `${issue.severity}:${issue.code}` === key).length]),
);
console.log(JSON.stringify({
  catalogVersion: result.catalog.catalogVersion,
  works: result.catalog.works.length,
  volumes: result.catalog.volumes.length,
  counts,
}, null, 2));
'
```

승인 전 예상 결과는 정확히 다음과 같다.

```text
catalogVersion: v1-57aaede217a7
works: 150
volumes: 154
error:UNREVIEWED_ELIGIBILITY: 100
warning:AUTHORIZED_MODEL_PANEL_REVIEW: 50
warning:EVIDENCE_NOT_HUMAN_REVIEWED: 415
other errors: 0
```

100개의 `UNREVIEWED_ELIGIBILITY`는 이 패널 전 의도된 차단이다. 다른 오류가 하나라도 있으면 `GO`를 내지 마라. 반대로 이 숫자만 맞는다고 주석 내용이 승인되는 것은 아니다.

또한 정확한 commit의 live checks 또는 같은 commit에서 최소한 Catalog unit tests, typecheck, lint와 `catalog:validate`가 generic Art gate를 포함해 실행됐는지 확인하라. check가 pending 또는 실패 상태라면 완료·해결을 직접 확인하기 전 `GO`를 내리지 마라. 테스트 통과를 실제 근거 심사의 대체물로 사용하지 마라.

## 9. 반드시 집중 감사할 정량 신호

다음은 앞선 read-only 감사에서 발견한 **편향 가능성 신호**다. 자동 오류도 자동 승인 사유도 아니다. 각 신호를 실제 작품·근거와 대조해 오류인지 정당한 분포인지 판정하라.

1. 새 100작품의 non-Art 13축 1300개 셀이 모두 `known`이다. 근거가 약한 셀을 중립값으로 채운 것은 아닌지, 필요한 곳이 `unknown`인지 확인하라.
2. fresh-a/b/c의 non-Art 1196행 confidence가 모두 `0.82`다. evidence 품질을 작품별로 실제 평가하지 않고 기계적으로 부여한 confidence인지 확인하라. reuse-eight의 104행은 더 다양한 confidence를 가진다.
3. 새 100작품 중 `characterArcWeight=4`가 65작품이다. `progression`과 혼동하거나 인물 중심성을 과대평가하지 않았는지 확인하라.
4. 새 100작품의 `relationshipStructure`는 0 또는 1이 없고 값 2/3/4가 각각 24/44/32작품이다. 초반에 고정 관계가 약한 작품까지 높게 주지 않았는지 확인하라.
5. `foundFamily` Theme가 새 100작품 중 62작품에 붙어 있다. 단순 동료·가족 등장과 선택된 가족/유사가족 중심 Theme를 구분했는지 확인하라.
6. `aoashi`, `yowamushi-pedal`, `ace-of-the-diamond`, `days`는 정확히 같은 Theme set인 `foundFamily:2; school:2; sportsCompetition:2; tournament:2`를 가진다. 네 작품의 초반 범위에 각각 독립적으로 맞는지 확인하라.
7. packet별 evidence notes, Art observation과 limitation에 반복 template 문장이 많다. 서로 다른 exact ref와 작품별 관찰이 template 결론을 실제로 지지하는지 확인하라.
8. 새 100작품의 `motionImpact`는 known 6, unknown 94, notApplicable 0이다. unknown 94는 정직한 보수성인지, known 6은 숫자 endpoint를 가진 대표 연속 동작인지 확인하라.
9. 최종 Genre 10종과 Theme 22종이 모두 존재하고 coverage threshold를 통과한다는 사실은 개별 tag·축의 정확성을 증명하지 않는다. 다양성 목표를 맞추려고 근거 없는 tag를 붙이지 않았는지 확인하라.

## 10. 작품별 필수 검사

100개 각 Work에 대해 다음을 모두 확인하라. 일부 표본만 보고 전체에 `GO`를 확장하지 마라.

1. `workId`, 일본어 제목, creator, publisher, demographic, status와 firstPublishedYear가 1차 bibliography와 모순되지 않는다.
2. 대표 일본어 1권의 ISBN checksum, Work 연결, volume number, edition과 release date가 근거와 맞는다. 출판사 페이지가 원본 종이책 초판일을 제시하지 않은 경우 빈 날짜를 임의로 오류 처리하지 않는다.
3. Alias가 같은 작품을 가리키며 다른 기존·신규 Work와 중복 작품 또는 속편을 별도 작품처럼 만들지 않는다.
4. Genre와 Theme/centrality가 초반 1~3권의 반복 중심을 나타낸다.
5. 13개 non-Art Axis 각각이 사전의 anchor와 실제 evidence에 맞고, 근거 부족은 `unknown`이다.
6. Art 4축 각각이 §6 정책과 manifest의 실제 페이지·맥락을 만족한다.
7. 모든 `evidenceId`가 존재하고 Work/volume/axis/theme 범위를 올바르게 지원한다.
8. packet의 intended role·eligibility가 합성 후보에 정확히 보존된다.
9. narrative가 CSV 값과 모순되지 않고 한계를 숨기지 않는다.
10. 수정이 필요하면 정확한 `workId.field`, 현재 값, 제안 값과 공식 URL 또는 사전 기준을 기록한다.

## 11. GO가 허용하는 정확한 승격 변환

4/4 조건 없는 `GO`와 현재 사용자의 승인 후에만 다음 최소 변환을 수행할 수 있다.

1. `data/staging/g2/candidate-source/`의 완전한 150작품 파일 집합을 기존 `data/source/`의 차기 완전본으로 승격한다. 별도 G2 Catalog나 merger를 만들지 않는다.
2. 기존 50작품의 값·eligibility·`annotationReviewMethod`·G1 review reference는 바꾸지 않는다.
3. 새 100작품의 `annotationReviewMethod`만 `unreviewed`에서 `authorizedModelPanel`로 바꾼다.
4. 새 100작품에 동일한 실제 승인 시각의 offset 포함 ISO 8601 `annotationReviewedAt`을 기록한다. 요청 작성 시점의 가짜 시각을 미리 넣지 않는다.
5. 새 100작품의 `annotationReviewReference`를 정확히 `reviews/g2-catalog-annotation-panel.md`로 설정하고, 네 독립 응답 identity/hash와 4/4 판정을 담은 실제 보고서를 그 경로에 포함한다.
6. 모든 evidence의 `reviewedByHuman=false`를 유지한다.
7. Factor, Theme, Genre, confidence, bibliography, role 또는 eligibility 값은 패널 `GO`를 이유로 다시 조정하지 않는다. 수정이 필요하면 먼저 `REVISE`하고 새 hash-bound 번들을 만든다.
8. 승격 후 generic Art gate를 포함한 `catalog:validate`, `catalog:build`, `catalog:coverage`, typecheck, lint, tests와 diff check를 통과시킨다.
9. 승격 후 기대 상태는 Work 150, recommendation 150, onboarding 40, libraryOnly 0, 역할 30/30/90, `UNREVIEWED_ELIGIBILITY` 0이다.

이 변환은 100작품의 주석 승격만 완료한다. G2 product-direction gate는 여전히 열리지 않으며 Slice 5를 시작할 수 없다.

## 12. 필수 질문

아래 질문에 모두 답하라. `PASS`에는 실제 파일·Work ID·행·공식 URL 또는 코드 위치를 인용하고, 숫자 요약만 반복하지 마라.

1. **IDENTITY:** `main`의 정확한 commit `b74d525b151785097aa42434a721202f2ec99e17`와 모든 동결 hash가 일치하는가?
2. **SCOPE:** 새 Work ID 합집합이 정확히 100개이고 기존 50작품·packet 상호 간 중복이나 속편 중복이 없는가?
3. **BIBLIOGRAPHY:** 100작품 모두 공식 bibliography, 대표 일본어 1권 ISBN, 판본과 초반 범위 연결이 충분한가?
4. **GENRE/THEME:** 모든 Genre와 Theme/centrality가 실제 entry 범위와 dictionary에 맞는가? 특히 foundFamily 집중과 sports quartet가 각각 독립적으로 정당한가?
5. **NON-ART AXES:** 1300개 non-Art 셀의 known/값이 근거로 지지되는가? all-known 상태, confidence `0.82`, characterArcWeight와 relationshipStructure 집중에 수정 필수 항목이 없는가?
6. **UNKNOWN POLICY:** 근거 부족을 0/2/`notApplicable`로 치환한 셀이 없는가? known을 `unknown`으로 내려야 할 Work/Axis가 없는가?
7. **ART:** 400개 신규 Art 행이 authority, edition mapping, 6쪽/2맥락, static exact refs, numeric continuous motion, Factor/evidence provenance 정책을 실제로 만족하는가?
8. **PROVENANCE:** 모델 초벌, `reviewedByHuman=false`, 반복 template와 각 한계가 정직하게 드러나며 사람 검수처럼 오인시키는 필드가 없는가?
9. **ROLE/ELIGIBILITY:** packet의 12/10/78 역할과 onboarding 12가 후보의 최종 30/30/90, onboarding 40, recommendation 150, libraryOnly 0으로 정확히 변환됐는가?
10. **PIPELINE:** generic Art gate가 실제 manifest를 읽고 검사하며, 후보에서 예상 100개 `UNREVIEWED_ELIGIBILITY` 외 오류가 없는가? live code와 checks에서 확인했는가?
11. **PROMOTION:** §11의 최소 변환을 값 수정 없이 그대로 수행해도 되는가?
12. **BOUNDARY:** 이 verdict가 G2 제품 방향 GO, 사람 테스트 성공 또는 Slice 5 허가가 아님을 확인하는가?

## 13. 엄격한 verdict 기준

- `GO`: 100작품 모두 현재 값 그대로 승격할 만큼 bibliography·Genre·Theme·17 Axis·Art·provenance가 충분하고, 수정 필수 항목이 없으며 §11 변환을 조건 없이 승인한다.
- `REVISE`: 한 작품·한 필드라도 공식 근거와 충돌하거나, known 값의 근거가 부족하거나, Art 정책을 만족하지 않거나, identity/hash/pipeline 문제가 있다. 가장 작은 정확한 수정 목록을 제시한다.
- `NO-GO`: 번들이나 주석 방법이 광범위하게 신뢰할 수 없어 필드별 수정으로 심사 가능한 상태를 만들 수 없다.

사소한 confidence ±0.05 취향 차이 또는 근거 있는 1단계 경계 이견만으로 `REVISE`하지 않는다. 반대로 4/4를 만들기 위해 불확실성을 숨기거나 `GO with conditions`를 쓰지 않는다. 조건·후속 수정·미확인 사항이 있으면 verdict는 `REVISE`다.

## 14. 필수 출력 형식

첫 줄은 반드시 다음 셋 중 하나와 정확히 같아야 한다.

```text
VERDICT: GO
VERDICT: REVISE
VERDICT: NO-GO
```

그 뒤 다음 형식을 모두 채운다.

```text
REVIEWER: Local | Gemini | Grok | GPT-5.6 Pro Oracle
REPOSITORY: konocomics (fromiron/konocomics)
BRANCH: main
HEAD: b74d525b151785097aa42434a721202f2ec99e17
BUNDLE SHA-256: eab5e8bc2b5842a3801a744dd20f3f6dd31dc5df2d3634d0c6a24d8797102ad2

REQUIRED QUESTIONS:
1. IDENTITY: PASS | FAIL — <직접 확인한 근거>
2. SCOPE: PASS | FAIL — <직접 확인한 근거>
3. BIBLIOGRAPHY: PASS | FAIL — <직접 확인한 근거>
4. GENRE/THEME: PASS | FAIL — <직접 확인한 근거>
5. NON-ART AXES: PASS | FAIL — <직접 확인한 근거>
6. UNKNOWN POLICY: PASS | FAIL — <직접 확인한 근거>
7. ART: PASS | FAIL — <직접 확인한 근거>
8. PROVENANCE: PASS | FAIL — <직접 확인한 근거>
9. ROLE/ELIGIBILITY: PASS | FAIL — <직접 확인한 근거>
10. PIPELINE: PASS | FAIL — <직접 확인한 근거>
11. PROMOTION: PASS | FAIL — <직접 확인한 근거>
12. BOUNDARY: PASS | FAIL — <이 판정이 허가하지 않는 것을 명시>

PACKET CHECKS:
- reuse-eight: PASS | REVISE — <구체 근거>
- fresh-a: PASS | REVISE — <구체 근거>
- fresh-b: PASS | REVISE — <구체 근거>
- fresh-c: PASS | REVISE — <구체 근거>

BLOCKERS:
- none
또는
- <workId.field>: <현재값> -> <제안값 또는 unknown> — <공식 URL/사전 기준/manifest ref>

PROMOTION AUTHORIZATION: YES | NO
PRODUCT-DIRECTION G2 AUTHORIZATION: NO
SLICE 5 AUTHORIZATION: NO
```

`GO` 응답은 12개 질문과 네 packet이 모두 `PASS`, `BLOCKERS: none`, `PROMOTION AUTHORIZATION: YES`여야 한다. 그 외 조합은 유효한 `GO`가 아니다.
