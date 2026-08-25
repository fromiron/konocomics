# Batch 005 text-gap recovery — position 02 round 1

- 조사일 및 모든 URL 조회일: `2026-08-25`
- 대상: position `2`, `work-076beb86f844b642beef`, `くーねるまるた`
- 평가 범위: `entry_1_3_volumes`; 대표판에 연결되는 공식 1–3권 소개와 그 권에
  대응하는 공식 유통·서점 설명, entry 범위를 명시한 독립 리뷰
- 조사 축: residual Narrative `progression/problemSolving/strategy/mysteryReveal/worldBuilding`
  및 Tone `characterArcWeight/comedy/romance`
- `reviewedByHuman=false`
- Art, 이미지 캡처, 픽셀 판정, `motionImpact`, terminal CSV, source, generated
  catalog, registry, promotion 파일은 변경하지 않음
- canonical title에는 장식용 `『』`·`「」`를 넣지 않음
- 외부 자료의 `retrievedAt`: `2026-08-25`

## Current terminal gap

현재 terminal text row는 다음과 같다. 기존 known 값은 재판정하지 않는다.

| group | current known | minimum | residual candidates |
| --- | ---: | ---: | --- |
| Genre | 1/1 (`sliceOfLife`) | 1/1 | 없음 |
| Theme | 1 (`cooking:2`) | 1/1 | 없음 |
| Narrative | 1/6 (`pacing=0`) | 4/6 | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding` 중 3개 필요 |
| Tone | 4/7 (`relationshipStructure=2`, `darkness=0`, `mentalStress=0`, `emotionalWarmth=2`) | 5/7 | `characterArcWeight`, `comedy`, `romance` 중 1개 필요 |
| Art | 0/4 | 2/4 | 이번 packet의 범위 밖 |

Round 3/4의 판정은 다음과 같이 보존한다.

- 음식 준비·이웃 나눔만으로 `progression`, `problemSolving`, `strategy`,
  `worldBuilding`, `comedy`를 자동 채우지 않았다.
- 단순한 레시피 목록과 “愉快”·“毎日笑って” 같은 홍보 문구만으로 `comedy`를
  확정하지 않았다.
- 이 packet은 새로 확인한 권별 반복 관찰과 독립 리뷰를 추가해 좁은 후보를
  제안할 뿐이며 terminal 값이 아니다.

## Official source ledger

| sourceName | URL | publishedAt / route date | retrievedAt | bounded use |
| --- | --- | --- | --- | --- |
| 小学館 ビッグコミックBROS 공식 작품 페이지 — くーねるまるた | https://bigcomicbros.net/category/a1146w10092/ | undated | `2026-08-25` | Rightsholder series synopsis and named recurring setting/cast: 70-year-old apartment, Tokyo graduate student, neighbors, librarian, doctor, and shared food. |
| 小学館 eコミック公式 — くーねるまるた 1 | https://e-comi.shogakukan.co.jp/books/091848470000d0000000 | `2014-04-02` | `2026-08-25` | Volume 1 identity and bounded low-budget cooking examples. |
| 小学館 eコミック公式 — くーねるまるた 2 | https://e-comi.shogakukan.co.jp/books/091853050000d0000000 | undated | `2026-08-25` | Volume 2 identity and repeated seasonal food, neighbor sharing, and named preparation examples. |
| 小学館 eコミック公式 — くーねるまるた 3 | https://e-comi.shogakukan.co.jp/books/091857280000d0000000 | undated | `2026-08-25` | Volume 3 identity and repeated neighbor/friend daily-life and recipe examples. |
| BOOK☆WALKER公式シリーズページ — くーねるまるた 1–3 | https://bookwalker.jp/series/125948/ | page undated; volume 1 delivery date `2017-12-14` | `2026-08-25` | Licensed distributor reproduces volume-specific descriptions: volume 2 seasonal/cultural rediscovery and inventive sharing; volume 3 carefree Tokyo life and recipes. |

The official descriptions are entry-range observations only. No later volume, sequel,
adaptation, popularity label, or demographic label is used for a Factor value.

## Direct bounded observations

### Repeated resource constraint and adaptive preparation

The volume-1 publisher page pairs poverty with multiple low-cost dishes and describes a
careful everyday life. The volume-2 publisher/distributor descriptions add seasonal
dishes and inventive food sharing, while the volume-3 descriptions add further dishes
made in the same neighborhood/friend setting. The pattern is not merely “food exists”:
limited money or available ingredients are repeatedly turned into a concrete preparation
choice and a shared result.

The official BROS page also identifies the recurring apartment community and its
exchange of food. This supplies the context for the repeated mechanism, but does not
itself establish a separate Theme or relationship value.

### Repeated functional setting

The official BROS page names the 70-year-old apartment and recurring residents, while
the volume-2/3 descriptions repeatedly place seasonal discovery, Japanese cultural
experience, neighborhood exchange, and everyday Tokyo life in that setting. This is
stronger than the earlier generic “neighborhood” synopsis: the apartment community and
its recurring occupations/exchanges organize the entry episodes. It is still a
functional setting, not a claim that the work has a complex rule system.

## Supplemental independent review ledger

Reviews are secondary corroboration only. They are not used for Art, identity, Genre,
Theme, or a value that the official entry packet cannot support. The two domains below
are independently authored retail review surfaces; the review records have different
named authors or a separately dated user record and are bound to volumes 1–3.

| sourceName | URL | publishedAt | retrievedAt | independence and bounded observation |
| --- | --- | --- | --- | --- |
| コミックシーモア user review — くーねるまるた 1, まなみん | https://www.cmoa.jp/title/71299/ | `2017-10-07` | `2026-08-25` | Named user, volume-1 product page. Describes the protagonist using varied know-how to eat well despite little money and learning through literature. This supports the repeated constraint-to-preparation observation as secondary evidence. |
| コミックシーモア user review — くーねるまるた 1, jurak | https://www.cmoa.jp/title/71299/ | `2021-11-04` | `2026-08-25` | Different named user, volume-1 product page. Notes short everyday episodes, recurring food as the key, old Tokyo neighborhood life, and ordinary literary/cultural references. This supports the bounded functional-setting observation, not a complex world system. |
| コミックシーモア user review — くーねるまるた 1, かなえ | https://www.cmoa.jp/title/71299/ | `2023-06-27` | `2026-08-25` | Different named user, volume-1 product page. Describes gentle exchanges, the protagonist’s consistently cheerful presentation, and pleasant conversations. It is tone corroboration only; the review does not by itself prove a comedy mechanism. |
| BookLive user review — くーねるまるた 2, 夏人 | https://booklive.jp/review/list/title_id/241730/vol_no/002 | `2025-07-03` | `2026-08-25` | Different retail domain and named volume-2 record. Notes Tokyo places, seasonal customs, and a flea-market episode; this independently corroborates a recurring Tokyo/seasonal setting, not a world-system rule. |
| BookLive user review — くーねるまるた 3, anonymous record posted by ブクログ | https://booklive.jp/review/list/title_id/241730/vol_no/003?spoiler=1 | `2022-11-04` | `2026-08-25` | Separate retail domain and volume-3 record. Describes a sale-priced ingredient, a gifted ingredient, a rice-cooker preparation, and a straw-fire dish; this independently corroborates repeated constrained ingredient adaptation. |

The reviews are summarized rather than copied into user-facing text. The first two
review records support `problemSolving` and `worldBuilding` as secondary observations;
the 2023 review is not treated as proof of `comedy` because “pleasant” and “cheerful”
are not the dictionary’s repeated comedy anchor.

## Provisional proposals for independent adjudication

These rows are proposals only. No terminal CSV was edited.

| axisId | proposed state/value | confidence | proposed evidence | dictionary mapping and boundary |
| --- | --- | ---: | --- | --- |
| `problemSolving` | `known / 2` | `0.80` | Official volume 1–3 pages; BOOK☆WALKER volume 2/3 descriptions; Cmoa 2017-10-07; BookLive volume-3 2022-11-04 | Across the entry range, scarce money or available ingredients are repeatedly converted into a concrete preparation choice. This is mixed ingenuity and direct action, not the `4` anchor of constraint-analysis as the primary puzzle reward. It does not use the cooking Theme as a shortcut; the evidence is the repeated obstacle/choice/result chain. |
| `worldBuilding` | `known / 2` | `0.73` | Official BROS character/setting page; official volume 2/3 descriptions; Cmoa 2021-11-04; BookLive volume-2 2025-07-03 | The recurring apartment community, named residents/occupations, Tokyo neighborhood, seasonal Japanese customs, and exchange routines form a functional setting across entry volumes. This remains `2`, not `4`: no complex historical/political rule system is claimed. The new proposal is narrower and better bound than the earlier generic-neighborhood lead. |

Both proposals require Pass B/Pass C review. In particular, the adjudicator should confirm
that `problemSolving=2` is not merely a duplicate of `cooking:2`, and that the apartment
and cultural context really meets the dictionary’s “functional setting” anchor rather
than being background decoration.

## Candidate Tone review and exhaustion

`comedy` was investigated because it is the only plausible remaining Tone cell with
entry-range user observations. The official volume-2 distributor description uses
pleasant/laughing-life language, and the Cmoa reviewers describe a cheerful protagonist,
lively apartment exchanges, and enjoyable conversations. However, these are not two
independent concrete observations of a recurring joke/gag mechanism. They establish
positive everyday tone already represented by `darkness=0`, `mentalStress=0`, and
`emotionalWarmth=2`, but do not safely establish `comedy=2` under the dictionary.

Therefore no Tone value is proposed in this packet:

| axisId | terminal disposition | reason |
| --- | --- | --- |
| `characterArcWeight` | `unknown` | Recurring character presence and personality do not establish character change as the primary reward. |
| `comedy` | `unknown` | “Cheerful”, “fun”, and lively exchanges are not a repeated concrete comedy mechanism; prior promo-language rejection is preserved. |
| `romance` | `unknown` | No entry-range romantic subplot or active romantic progression was found. |

The absence of a Tone proposal is intentional. It is not a blocker decision and does
not convert unknown to zero.

## Narrative exhaustion register

| axisId | disposition | exact bounded reason |
| --- | --- | --- |
| `progression` | `unknown` | The entry record shows recurring cooking and cultural discovery, but no sustained character growth, acquisition, or mastery reward. Reader learning is not protagonist progression. |
| `problemSolving` | provisional `2` above | New volume-specific and independent observations show repeated resource/ingredient adaptation; adjudication must distinguish this from the existing cooking Theme. |
| `strategy` | `unknown` | Budget-conscious preparation is local improvisation, not long-term planning, war, politics, or resource operation. |
| `mysteryReveal` | `unknown` | No clue, investigation, secret, or reveal reward is present in the bounded entry evidence. |
| `worldBuilding` | provisional `2` above | The recurring apartment/cultural environment may satisfy functional setting; adjudication must reject it if the evidence is only background description. |

No further eligible official entry route was located in this round that would support
`progression`, `strategy`, or `mysteryReveal`. Later volumes and the sequel were excluded.
The two proposals above are not a promotion decision; they are the narrow remaining
routes for independent review.

## Handoff and verification

- terminal state: unchanged; no Factor, Genre, Theme, Art, source, generated, registry,
  or promotion mutation
- proposed terminal effect if both proposals are accepted: Narrative `3/6`, still
  below the `4/6` minimum; Tone remains `4/7`, below `5/7`
- `reviewedByHuman=false`
- run:

```bash
git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-02-round-1.md
sha256sum data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-02-round-1.md
```
