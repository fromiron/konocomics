# Batch 005 text-gap recovery — position 04 round 4

## Scope and non-repetition guard

- 조사일 및 모든 URL 조회일: `2026-08-25`
- 대상: position `4`, `work-0cf463005cc77eeded8e`, `黄泉のツガイ`
- 평가 범위: `entry_1_3_volumes`; 공식 제1화·제2화 body pages 및 권 1–3 공식 소개
- 조사 축: `problemSolving`만
- `reviewedByHuman=false`
- `progression`, `strategy`, `characterArcWeight`의 기존 거부 결론과 `emotionalWarmth=2`, `mentalStress=2`의 기존 승인 결론은 재심·재제안하지 않음
- Art, Genre, Theme, terminal CSV, source, generated catalog, registry, promotion 파일은 변경하지 않음
- 장식용 `『』`·`「」`를 canonical title 또는 작품 식별 필드에 사용하지 않음

`problemSolving`의 dictionary anchor는 “제약을 분석하고 기발하게 해결하는 과정이
핵심”이다. 단순한 명령, 전투의 성공, 이동 목표, 구조·보호 행동, 또는 한 번의
능력 사용은 이 축의 반복적인 장애→분석/과정→해결 근거로 세지 않는다.

## Official source ledger

| sourceName | URL | publishedAt | retrievedAt | bounded use |
| --- | --- | --- | --- | --- |
| SQUARE ENIX 공식 — 黄泉のツガイ 1 | https://magazine.jp.square-enix.com/top/comics/detail/9784757579620/ | `2022-06-10` | `2026-08-25` | volume 1 identity and entry premise; links to the official episode-1 reader |
| SQUARE ENIX 공식 — 黄泉のツガイ 2 | https://magazine.jp.square-enix.com/top/comics/detail/9784757581005/ | `2022-09-12` | `2026-08-25` | volume 2 synopsis: village attack, descent, search for Asa, and Kagemori conflict |
| SQUARE ENIX 공식 — 黄泉のツガイ 3 | https://magazine.jp.square-enix.com/top/comics/detail/9784757584013/ | `2023-02-10` | `2026-08-25` | volume 3 synopsis: Kagemori residence, reunion, attack, and death/survival mystery |
| SQUARE ENIX 공식 Gangan 제1화 | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/ | undated; linked volume-1 date `2022-06-10` | `2026-08-25` | exact rightsholder episode-1 body route |
| SQUARE ENIX 공식 Gangan 제2화 | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/ | issue date `2022-01-12` | `2026-08-25` | exact rightsholder episode-2 body route; HTML reports `fr_pagenum=47`, body pages `003–044`, `fr_imgval=250212` |
| SQUARE ENIX 공식 少年ガンガン 2022年2月号 | https://magazine.jp.square-enix.com/top/magazines/gg/?p=5 | `2022-01-12` | `2026-08-25` | confirms episode 2 as the second entry-range episode |

The direct episode-2 body template was independently reopened:

`https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/NNN.jpg?250212`

Temporary image files were inspected outside the repository. No image was added to
this packet or committed.

## Rechecked direct page clusters

These are the exact clusters relevant to a possible obstacle/process/solution claim.
The hashes are retained from the rightsholder downloads and bind the observations to
the edition route.

| pageRef | official URL(s) | SHA-256 | bounded observation | decision for `problemSolving` |
| --- | --- | --- | --- | --- |
| episode 1 `012`, `014–016`, `020` | `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/img/012.jpg?241217`; `014.jpg?241217`; `015.jpg?241217`; `016.jpg?241217`; `020.jpg?241217` | `012=f1b5557a7bc0aeeaed893352b3870bfe6cc8e50b257f2b4cb0383bc69e288421`; `014=a4fe2128dd8ee379d5b963ac1a98d78245be3d44cf82696eac09ceb3286c2e29`; `015=7d0af0507c0cbc46d12f01bb31efb885aa09eabc30893d6de617486903def446`; `016=a0d9a1880fdfd9ce298ec20caee20dd4bd29d137afea1118baf4c5f726d55c3e`; `020=4b5ee11af2e3a7fe1f51d47bcb3b24793e5b0bc22314ae5412d40ef9a877ed40` | Village reciprocity, Yuru's protection promise, conditional choice to leave with Asa, and the attack that breaks the calm. | No obstacle is analyzed and solved; these are premise, relationship, and crisis-entry observations. |
| episode 2 `010–011` | `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/010.jpg?250212`; `011.jpg?250212` | `010=c7a3130627e37555e3bb99fb88ef5da2f01974278ac443d0716e27d9d888e829`; `011=c93b7899f41014ca9479642ab2b13d376ce88b671f765795325d06f6b7c02503` | Safe descent is stated as an immediate objective; Dera and Hana explain the master/command relation. | Objective and hierarchy are constraints, not an analytical solution process. |
| episode 2 `013–015` | `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/013.jpg?250212` through `015.jpg?250212` | `013=94ef6a04cdf40aaace6a7993a40a9d4a8995d5e34381cfa6d533ad16f1a34811`; `014=366ce147a546c6cc0ad1f1ac586d4a8a547334a8b3275aee2f820a488d137997`; `015=1ee307753419685466b407708ed5494348822feedd946a21fec2ccc5f1d6d360` | Yuru orders protection of survivors and gives a no-interference instruction about his bird. | A direct command followed by action; no shown analysis of alternatives or clever resolution. |
| episode 2 `020–022` | `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/020.jpg?250212` through `022.jpg?250212` | `020=9af8a98c88c027c4c0076afbad3b98d7f74ff6171aca81ef0cffadf585fde1c3`; `021=72d80373608a5a88132099581b49c6a4342be51c89b83c2fd0603340f17b93ec`; `022=7e472bb218a31ac136daaf803c3e72ec2be6d208ce9702a36fc8c876bef99c14` | The group identifies an attacker, checks a child, and moves survivors toward safety during the attack. | Reactive combat/rescue sequence; target identification and evacuation are not a recurring analytic puzzle solution. |
| episode 2 `025–030` | `https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_02/img/025.jpg?250212` through `030.jpg?250212` | `025=37c17ab3c0e835d39102057425091244aee6475368851753defc6b3f176a5a92`; `026=abdf89e151f6e35a5f8b68820dc09be3acd203e536a601e3456dd2f18802bb0b`; `027=11ba58ff081cea3770dd6bcedfe0e941a0bed067c6e9c41b8035dce694ac7529`; `028=6757e7a3ea531e18ff82470420effc5d8a5c8e7cc8b205ad61389000125ebf25`; `029=2995fee94a9cd747350a963e402866cfe6ee7c97fbcaf4691dfa5257445ab551`; `030=a5ecea124b4f444021316c7d7bdb2c6fa1b94faf40a1ddcb4ee15ee6346d3b63` | An ability/user constraint and “do not attack now” command are followed by confrontation and Asa supporting the injured Yuru. | Command, force, and rescue endpoint; no explicit analysis-and-clever-solution chain. |

The same episode-2 clusters therefore repeat command/action and reactive rescue,
not `problemSolving`'s required mechanism. The episode-1 pages and official volume
2–3 synopses add no independent puzzle or constraint-analysis loop.

## Review of supplementary sources

Existing BookLive volume-1 records and Sony Reader volume-3 records were checked as
secondary corroboration. They describe mystery, violence, fear, faction pressure,
and relational stakes, but do not provide an independent repeated
obstacle→analysis→resolution observation. They cannot convert the official command
and rescue scenes into `problemSolving`, and no review-only proposal is made.

## Decision and exact exhaustion

`problemSolving` remains `unknown`. No provisional value is proposed.

Reason: the official entry record contains goals, commands, ability constraints,
combat reactions, protection, evacuation, and rescue. It does not show at least two
separate, concrete sequences in which the protagonists analyze a constraint or
obstacle, choose a non-obvious method, and reach a demonstrated solution. The
episode-2 clusters are multiple scenes in one crisis and still do not meet that
definition. A forced `2` would duplicate `pacing`, `combat`, `mentalStress`, or
`emotionalWarmth` rather than represent the dictionary axis.

No additional admissible official route was found within volumes 1–3 or the first two
official episodes. Later-volume knowledge, general genre labels, ratings, popularity,
and isolated commands were excluded. This is an exact exhaustion result, not a
priority or time-based blocker.

## Handoff and verification

- terminal state: unchanged; `problemSolving=unknown`
- no source/generated/promotion/Art mutation
- `reviewedByHuman=false`
- `git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-04-round-4.md`
- `sha256sum data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-04-round-4.md`
