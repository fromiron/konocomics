# Batch 005 text-gap recovery — position 04 round 2

- 조사일: `2026-08-25`
- 대상: position `4`, `work-0cf463005cc77eeded8e`, `黄泉のツガイ`
- 평가 범위: representative volume에 연결된 entry volumes `1–3` 및 공식 제1화
- `reviewedByHuman=false`
- 모든 외부 자료의 `retrievedAt`: `2026-08-25`
- Art, 이미지 값, `motionImpact`, terminal CSV, source, generated catalog, registry,
  promotion 상태는 변경하지 않았다.
- 장식용 `『』`·`「」`는 canonical title과 이 문서의 식별 필드에 넣지 않았다.

## 목적과 현재 gate

Round 1의 blocker challenge가 position 4의 `comedy=2`를 수용하면서 기존
`SOURCE_INFORMATION_UNAVAILABLE` 결론은 폐기됐다. 이 packet은 남은 진입 경로를
다시 확인하기 위한 연구 문서이며, 제안값은 독립 검수 전까지 terminal 값이 아니다.

| group | 현재 known | 최소 추가 필요 | 남은 축 |
| --- | ---: | ---: | --- |
| Genre | 1/1 | 0 | — |
| Theme | 1/1 | 0 | — |
| Narrative | 3/6 | 1 | `progression`, `problemSolving`, `strategy` |
| Tone / Relationship | 3/7 | 2 | `characterArcWeight`, `mentalStress`, `romance`, `emotionalWarmth` |
| Art | 3/4 | unchanged | static 3축 known; `motionImpact` unknown |

## Official source ledger

### SQUARE ENIX 권별 공식 페이지

| id | sourceName | URL | publishedAt | bounded observation |
| --- | --- | --- | --- | --- |
| `4-R2-O1` | SQUARE ENIX 공식 — 黄泉のツガイ 1 | https://magazine.jp.square-enix.com/top/comics/detail/9784757579620/ | `2022-06-10` | 유루의 산골 마을 생활, 감금에 가까운 아사의 おつとめ, 마을의 불가해한 비밀, 첫 ツガイ 전투를 묶어 entry premise를 제시한다. |
| `4-R2-O2` | SQUARE ENIX 공식 — 黄泉のツガイ 2 | https://magazine.jp.square-enix.com/top/comics/detail/9784757581005/ | `2022-09-12` | 마을 습격으로 평온이 끝나고, 유루가 ツガイ使い가 되어 데라·하나의 협력으로 하계에 내려가 아사를 찾으며 影森家와 충돌한다. |
| `4-R2-O3` | SQUARE ENIX 공식 — 黄泉のツガイ 3 | https://magazine.jp.square-enix.com/top/comics/detail/9784757584013/ | `2023-02-10` | 유루가 진 일행의 유인으로 影森家 저택에 들어가 아사와 재회하고, 정체불명의 습격을 물리친 뒤 아사의 사망·생존과 封/解의 비밀에 직면한다. |
| `4-R2-O4` | SQUARE ENIX 공식 ガンガンオンライン — 제1화 시험읽기 | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/ | `undated` (linked vol.1 edition `2022-06-10`) | official Fotorama body sequence. The page's `fr_imgval=241217` route was reopened and the image bytes below were checked against the direct official URLs. |

### 제1화 직접 body page refs

The following are temporary local inspection files only; they are not committed.
The retained evidence is the official URL, exact page ref, edition route, and SHA-256.
Page `012` records the sibling protection promise and the conflict between staying in
the village and leaving. Pages `014–015` show repeated village care/exchange. Page
`016` records the decision to leave with the sister and accompany her. Page `020`
shows the aircraft/attack interruption of the previously quiet village.

| pageRef | official URL | SHA-256 | bounded observation |
| --- | --- | --- | --- |
| `official-fotorama-012` | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/img/012.jpg?241217 | `f1b5557a7bc0aeeaed893352b3870bfe6cc8e50b257f2b4cb0383bc69e288421` | 유루가 마을을 떠나지 않겠다고 말하고, 아사가 곁에 있는 동안 지키겠다는 관계적 약속을 나눈다. |
| `official-fotorama-014` | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/img/014.jpg?241217 | `a4fe2128dd8ee379d5b963ac1a98d78245be3d44cf82696eac09ceb3286c2e29` | 마을 사람들이 하계의 물건·약·생활 문제를 서로 묻고 돕는 일상적 공동체 장면이다. |
| `official-fotorama-015` | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/img/015.jpg?241217 | `7d0af0507c0cbc46d12f01bb31efb885aa09eabc30893d6de617486903def446` | 유루가 받은 물건에 감사하고, 마을 사람과 상호 호의를 주고받는 장면이다. |
| `official-fotorama-016` | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/img/016.jpg?241217 | `a0d9a1880fdfd9ce298ec20caee20dd4bd29d137afea1118baf4c5f726d55c3e` | 유루가 마을 밖을 원한다는 말을 듣고, 아사와 함께 나가면 된다는 선택지가 대화에 등장한다. |
| `official-fotorama-020` | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/img/020.jpg?241217 | `4b5ee11af2e3a7fe1f51d47bcb3b24793e5b0bc22314ae5412d40ef9a877ed40` | 비행체와 공격으로 평온한 마을의 안전이 깨지고, 인물이 공포 반응을 보이는 위기 진입 장면이다. |

The earlier blocker-challenge packet already established the separated comedy beats
at `official-fotorama-005`, `008`, `015`, and `017`; this round does not reopen or
re-propose `comedy=2`.

## Independent review supplement

Reviews are corroboration only. No star rating, tag, recommendation membership, or
unbounded later-series statement is used as a Factor value. The two BookLive entries
below have different named reviewer records and are independently authored; the Sony
page is a separate licensed review route for volume 3. Whole-series reviews on the
volume-1 page were excluded.

| id | sourceName | URL | reviewer / publishedAt | bounded observation used |
| --- | --- | --- | --- | --- |
| `4-R2-R1` | BookLive 黄泉のツガイ 1巻 reviews | https://booklive.jp/review/list/title_id/20045746/vol_no/001 | `1055`, `2025-02-13`, retrieved `2026-08-25` | volume-1 reader identifies the sister as someone the protagonist values and reports the village/protagonist mystery and unpredictable turn. Supplemental support for character stakes and pressure, not a standalone value. |
| `4-R2-R2` | BookLive 黄泉のツガイ 1巻 reviews | https://booklive.jp/review/list/title_id/20045746/vol_no/001 | `山口透析鉄`, `2022-06-10`, retrieved `2026-08-25` | volume-1 reader concretely discusses the village slaughter, pain of being cut, fear of death, and suffering of those left behind. Supplemental support for sustained mental pressure; it is not used to change `darkness`. |
| `4-R2-R3` | Sony Reader Store 黄泉のツガイ 3巻 reviews | https://ebookstore.sony.jp/review/title/10698755/id/LT000178283001729708/ | embedded ブクログ reviews, `2026-02-18`, retrieved `2026-08-25` | volume-3 reader contrasts an apparent act of care with instructions to treat a person as a disposable piece, and notes the fear of that treatment. Supplemental corroboration for mixed relational warmth and pressure. |
| `4-R2-R4` | Sony Reader Store 黄泉のツガイ 3巻 reviews | https://ebookstore.sony.jp/review/title/10698755/id/LT000178283001729708/ | embedded ブクログ review, `2025-10-20`, retrieved `2026-08-25` | volume-3 reader observes uncertainty about how factions may control or use gifted children and calls the serious/gag mixture effective. This supports pressure context only; `comedy=2` is already terminal. |

## Provisional proposals

The proposals below are the only new numeric candidates in this packet. Each is
bounded to the entry range and deliberately conservative. Independent adjudication
must decide whether the evidence meets the terminal coverage contract.

### Narrative — progression = 2

| field | value |
| --- | --- |
| axisId | `progression` |
| proposedState / value | `known / 2` |
| confidence | `0.84` |
| primary evidence | official vol.2 (`4-R2-O2`) and vol.3 (`4-R2-O3`) |
| dictionary anchor | The entry sequence contains an observable status/goal progression: quiet village life ends, Yuru becomes a ツガイ使い and descends with collaborators to search for Asa; in vol.3 he accepts a route into the Kagemori estate, reunites with Asa, and faces new facts. This is gradual entry-range advancement, not repeated mastery rewards. |
| boundary | Do not promote `progression=4`: the packet does not show a repeated acquisition/mastery reward loop. Do not transfer the status change to `problemSolving` or `strategy`; no recurring constraint analysis or long-term plan is directly established. |

### Tone — characterArcWeight = 2

| field | value |
| --- | --- |
| axisId | `characterArcWeight` |
| proposedState / value | `known / 2` |
| confidence | `0.76` |
| primary evidence | official episode body refs `official-fotorama-012` and `official-fotorama-016`, corroborated by official vol.2 (`4-R2-O2`) |
| dictionary anchor | Yuru is introduced in a stable village routine with a confined twin, then makes a personal choice about leaving/protecting Asa and is subsequently positioned as a ツガイ使い searching for her. The plot change is coupled to a bounded change in his role and immediate goal, fitting the balanced midpoint rather than an event-only or character-only extreme. |
| boundary | The packet does not establish a multi-volume character transformation or a character-change reward as the sole core, so `4` is not proposed. The sibling relationship itself is not counted as `relationshipStructure` because that axis is already known. |

### Tone — mentalStress = 2

| field | value |
| --- | --- |
| axisId | `mentalStress` |
| proposedState / value | `known / 2` |
| confidence | `0.82` |
| primary evidence | official episode ref `official-fotorama-020`, official vol.1 (`4-R2-O1`), vol.2 (`4-R2-O2`), and vol.3 (`4-R2-O3`) |
| dictionary anchor | The entry range repeatedly places the protagonists under mixed psychological pressure: Asa's confinement and village secret, a violent village attack that ends the quiet life, repeated faction/ツガイ clashes, and the unresolved fact that Asa once died but is alive. This is sustained tension and uncertainty with comic relief, matching `2`, not the continuous breakdown/pressure required for `4`. |
| supplemental review support | `4-R2-R2` independently describes the entry-volume killing, fear of death, and grief for survivors; `4-R2-R3` independently describes the volume-3 disposable-person threat and fear. These observations corroborate the official pressure pattern but do not override it. |
| boundary | Do not raise `darkness`; the violence is already represented by the terminal `darkness=2` and the episode contains separated comedy. Do not infer mental pressure from a rating or from the word “dark” alone. |

## Deliberately unresolved cells

| axis | disposition | reason |
| --- | --- | --- |
| `problemSolving` | keep `unknown` | The entry materials show searching, fighting, and an invitation/route, but no recurring constraint-analysis and solution mechanism. A single choice or battle is insufficient. |
| `strategy` | keep `unknown` | No sustained long-term plan, resource operation, or faction strategy is directly described in volumes 1–3. The volume-3 enemy-base decision is not enough to label strategy. |
| `romance` | keep `unknown` | Sibling/faction bonds are not romance, and no entry-range romantic progression is evidenced. |
| `emotionalWarmth` | keep `unknown` | Pages `012`, `014`, and `015` show care, sibling protection, and village reciprocity, while `4-R2-R1`/`4-R2-R3` corroborate relational stakes. However, the packet does not establish warmth as the repeated central reward rather than a mixed supporting element. |
| `comedy` | unchanged `known=2` | Existing blocker-challenge acceptance is retained; this round does not duplicate it. |
| Art axes | unchanged | Art values and `motionImpact=unknown` are outside this text recovery. |

## Exhaustion and handoff

The official publisher routes for volumes 1–3 and the exact first-episode body route
were reopened. Four independently authored/licensed review records were checked as
supplemental corroboration. No additional admissible direct candidate was found for
`problemSolving`, `strategy`, `romance`, or `emotionalWarmth`; silence remains
`unknown`. The only new proposals are one Narrative and two Tone cells above.

An independent adjudicator should accept or reject each proposal against the
unchanged Factor Dictionary and coverage gates. If all three are accepted, the live
count would become Narrative `4/6`, Tone `5/7`, Art `3/4`, subject to the existing
terminal Art/recommendation gate. This packet itself authorizes no terminal mutation,
promotion, or blocker.

## Verification

```text
git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-04-round-2.md
```
