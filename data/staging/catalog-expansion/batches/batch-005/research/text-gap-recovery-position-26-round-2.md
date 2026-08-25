# Batch 005 text-gap recovery — position 26 round 2

- 조사일: `2026-08-25`
- 대상: position `26`, `work-5b7cf2105a4bc6f6b46c`, `クジラの子らは砂上に歌う`
- 평가 범위: `entry_1_3_volumes`; 공식 제1권 ARC 본문과 공식 제2·3권 소개
- `reviewedByHuman=false`
- 모든 외부 자료의 `retrievedAt`: `2026-08-25`
- 텍스트·Genre·Theme 연구만 수행했다. Art 픽셀 판정, terminal CSV, source/generated,
  promotion, registry, safety, identity, Gold, 추천 산식은 변경하지 않았다.
- canonical title에는 장식용 `『』`·`「」`를 넣지 않았다.

## 목적과 현재 gate

이전 blocker challenge에서 정확한 상품 페이지→공식 ARC 독자 연결이 확인됐다.
따라서 기존 `SOURCE_INFORMATION_UNAVAILABLE`의 Art 경로 사유는 폐기됐고, 별도
Art quorum에서 `artRealism=2`, `artDensity=3`, `visualSoftness=3`,
`motionImpact=2`가 이미 확정됐다. 이 문서는 그와 분리된 텍스트 재조사다.

현재 terminal text row와 Art recovery를 다시 세어 확인한 결과는 다음과 같다.

| group | 현재 known | 최소 | 남은 gap |
| --- | ---: | ---: | --- |
| Genre | 1/1 (`fantasy`) | 1/1 | 없음 |
| Theme | 2개 (`politics:1`, `survival:2`) | 1/1 | 새 Theme 불필요 |
| Narrative | 3/6 (`pacing=2`, `mysteryReveal=2`, `worldBuilding=4`) | 4/6 | `progression`·`problemSolving`·`strategy` 중 1개 |
| Tone / Relationship | 5/7 (`characterArcWeight=2`, `relationshipStructure=2`, `darkness=3`, `mentalStress=2`, `emotionalWarmth=2`) | 5/7 | `comedy`·`romance`는 unknown으로 유지 가능 |
| Art | 4/4 | 2/4 | 없음 |

따라서 이 packet의 유일한 승격 관련 텍스트 gap은 Narrative 1칸이다. 제안은
독립 검수·adjudication 전까지 terminal 값이 아니다.

## 공식 source ledger

| id | sourceName | URL | publishedAt / route date | bounded observation |
| --- | --- | --- | --- | --- |
| `26-R2-O1` | 秋田書店 공식 제1권 상품 페이지 | https://www.akitashoten.co.jp/comics/4253261019 | `2013-12-16` | 대표 ISBN `9784253261012`, 제1권 제목·작가를 확인하고 공식 ARC 시험읽기 링크를 직접 제공한다. |
| `26-R2-O2` | 秋田書店 ARC episode JSON | https://arc.akitashoten.co.jp/comics/kojiranoko/1.json | created `2013-12-12`, updated `2015-06-15` | 제목·작가·volume `1`, `page_count=45`와 공식 본문 페이지 URL을 식별한다. JSON SHA-256은 `8569535d979bc9f4a5368c46e692ff1133dba0ace2b3d27a180934925989dcf2`다. |
| `26-R2-O3` | 秋田書店 공식 제2권 상품 페이지 | https://www.akitashoten.co.jp/comics/4253261027 | `2014-04-16` | 30년 수명 조건, 외부 세계를 향한 조사·희망, 모래 바다에서 오는 재앙이라는 entry-range 세계 조건을 확인한다. |
| `26-R2-O4` | 秋田書店 공식 제3권 상품 페이지 | https://www.akitashoten.co.jp/comics/4253261035 | `2014-09-16` | 거대선의 위기, 침략자, 장로회와 자경단의 선택, 아이들의 선택을 확인한다. 이는 기존 `politics`·`survival`·`darkness`의 보조 범위이며 새 numeric cell로 중복 사용하지 않는다. |

ARC 페이지는 모두 `https://arc.akitashoten.co.jp/comics/kojiranoko/1/{n}?style=pc`
형식이며, 아래 페이지는 임시 local capture를 다시 열어 텍스트·사건 흐름을
확인했다. 임시 이미지는 커밋하지 않는다.

| pageRef | official URL | temporary SHA-256 | text/event observation |
| --- | --- | --- | --- |
| `arc-page-30` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/30?style=pc | `3228bf62467ed56bf2cf336646eda29544f9a0d6b0998af67b0163194118163a` | 지금까지의 기록에 따라 섬 조사 가능 시점을 약 5일 전후로 잡고, 이후에는 거리가 벌어져 곤란해진다고 제한을 설명한다. 다음 날까지 정찰대를 보내자는 실행 계획이 이어진다. |
| `arc-page-31` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/31?style=pc | `041614b6bcd9c28af134623a376d1d7556a6b2ee149e7579204773e4749d88e2` | 정찰대 편성·선정과 이동 중 문제 가능성을 대화로 조정한다. 단순한 외부 동경이 아니라 조사 목적과 일정이 있는 단기 작전으로 연결된다. |
| `arc-page-32` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/32?style=pc | `7ea83df3fea867b0bbacaf41e7947b29b8027fb6c4083c152c8dd91b1149d1ed` | 모래 바다에서 특정 능력을 쓰지 않으면 사람과 물자가 가라앉고, 보트를 띄우는 데 체력을 소모하며, 전진 가능한 거리가 제한된다는 이동·자원 제약을 설명한다. |
| `arc-page-33` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/33?style=pc | `ee3d2c68eeae80ff127f0fd8d13418cc8e693dc3bdc9fb6ae81b660e1e37c4a2` | 섬 정찰을 우선하고 다른 활동은 뒤로 미루는 판단이 드러난다. 앞선 시간·거리·체력 제약과 함께 계획의 우선순위를 확인한다. |

## Direct Narrative candidate

### `strategy=2`

| field | value |
| --- | --- |
| axisId | `strategy` |
| proposedState / value | `known / 2` |
| confidence | `0.84` |
| evidenceId | `ev-batch-005-a-work-5b7cf2105a4bc6f6b46c` |
| primary evidence | `26-R2-O1`, `26-R2-O2`, `26-R2-O3`, `arc-page-30`–`arc-page-33` |
| dictionary anchor | 시간 창을 기록으로 산정하고, 거리가 벌어지는 시점을 제한 조건으로 삼아, 다음 날까지 정찰대를 보내며, 모래 바다의 이동 방식·체력 소모·운반 한계를 고려해 우선순위를 정하는 단기 전술 계획이 직접 제시된다. 이는 `strategy=0`의 즉흥 대응보다 높고, `strategy=4`의 지속적인 장기 계획·전쟁·정치·자원 운영 중심까지는 가지 않는 중간값이다. |
| entry boundary | 모든 핵심 관찰은 공식 제1권 ARC 본문 30–33쪽에 있고, 제2·3권은 동일 세계의 수명·재앙·세력 조건을 확인하는 보조 source다. 후반 줄거리나 애니메이션 자료는 수치 근거로 사용하지 않았다. |
| limitation | 이 packet은 하나의 entry-range 작전 계획을 확인한다. 장기 작전·반복적인 전략 보상 루프를 입증하지 않으므로 `strategy=4`는 제안하지 않는다. |

이 제안은 `problemSolving`과 구분한다. 페이지 32의 제약 설명은 전략 계획의
입력 조건이지만, 여러 제약을 분석해 해결하는 반복 퍼즐 구조까지 직접 보여주지
않으므로 `problemSolving`은 unknown으로 유지한다. `progression`도 성장·획득·숙련
보상 반복이 확인되지 않아 unknown이다.

## Tone / Genre / Theme audit

- `comedy`: ARC 18–22쪽의 장난스러운 대화와 일상적 엇갈림은 확인했지만, 현재
  Narrative gap을 해결하기 위해 새 Tone 값을 억지로 추가하지 않는다. comedy는
  unknown으로 유지한다.
- `romance`: entry 자료에서 연애 전개는 확인되지 않는다. unknown을 유지한다.
- `politics`, `survival`: 이미 terminal Theme으로 확정됐으며, 제3권의 장로회·자경단
  자료를 다시 사용해 centrality를 높이거나 새 Theme을 만들지 않는다.
- `Genre`: 공식 권 소개는 판타지 세계와 생존 조건을 제공하지만 현재 `fantasy` 외의
  추가 Genre를 직접 확정할 근거는 없다.

## Exhaustion and handoff

이번 round에서 새로 제안하는 셀은 `strategy=2` 하나뿐이다. 독립 검수자는 다음을
확인해야 한다.

1. ARC page 30–33이 실제로 동일 제1권·대표판에 연결되는지
2. 시간·거리·체력·정찰대 우선순위가 `strategy=2`의 단기 전술 anchor에 직접 대응하는지
3. 이 관찰을 `problemSolving` 또는 `progression`으로 중복 확장하지 않는지
4. 기존 `politics`, `survival`, `worldBuilding` evidence를 재사용해 과대평가하지 않는지

제안이 채택되면 텍스트 coverage는 Narrative `4/6`, Tone `5/7`이 되고, 이미 확정된
Art `4/4`와 함께 이 작품의 다섯 promotion gate가 모두 통과한다. 거부될 경우
`strategy`는 unknown으로 남기고 이 route packet의 유일한 residual Narrative 후보가
소진된 것으로 기록한다. 어느 경우에도 근거 없는 중간값이나 blocker 우회는 하지
않는다.

## Verification

```text
git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-26-round-2.md
sha256sum data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-26-round-2.md
```
