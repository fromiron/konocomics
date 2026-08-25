# Batch 004 text-gap recovery — position 24 round 1

- 조사일 / `accessedAt`: `2026-08-25`
- 대상: `work-65f856a6fa2078f21d2f` / `黒月のイェルクナハト` / スズモト コウ
- 범위: Factor Dictionary의 `entry_1_3_volumes`; 講談社 공식 1–3권 상품 설명과 1권 첫 화 시험 읽기 경로
- 판정 경계: research only, `reviewedByHuman=false`
- 변경 경계: 이 문서만 생성한다. terminal/source/generated/Genre/Theme/Art/overlay/promotion/blocker 파일은 수정하지 않는다.
- 작품명·장르·인구통계·선정·평판·기억에서 Factor 값을 만들지 않는다. 사용자 리뷰는 이번 라운드에서 사용하지 않았다.

## Bound inputs and current gate

| input | value |
|---|---|
| repository root at read | `7c23eaf23297c0e0dc042b632c48f0fc77d9d047` |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| frozen work set | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| terminal text CSV before this note | `6ac0f81582672c4d07e56b07208299b4c7b8ad92156ffffc48dc8178d5685fb8` |

The task baseline is Narrative `3/6`, Tone `4/7`, and Art `3/4`; Genre `action;fantasy;romance` and Theme `combat:2` are already present. In the terminal text rows, the residual Narrative axes are `problemSolving`, `strategy`, and `mysteryReveal`; the residual Tone axes are `comedy`, `darkness`, and `emotionalWarmth`. This note makes at most one proposal in each family. The official entry-range evidence supports one Tone proposal, while the residual Narrative set reaches exact exhaustion without a defensible new value.

## Direct official source ledger

All product routes below were opened on `2026-08-25`; the date in `sourcePublishedAt` is the release date shown by 講談社. The observations are bounded to the publisher's 1–3 volume copy, not title or genre inference.

| source | exact URL | sourcePublishedAt | bounded direct observation |
|---|---|---:|---|
| 講談社 `黒月のイェルクナハト（1）` product | [official vol. 1](https://www.kodansha.co.jp/comic/products/0000415577) | `2025-07-16` | The publisher describes an 18-year-old with no work, dream, or will to live meeting the non-human Yerkunacht, whose demand is marriage or death. The same description calls it a battle-romance tale. |
| 講談社 `黒月のイェルクナハト（2）` product | [official vol. 2](https://www.kodansha.co.jp/comic/products/0000419091) | `2025-10-17` | The publisher describes a death match with Noa, the protagonist's felt lack of power, practical training with the new ally, and a bloody battle. |
| 講談社 `黒月のイェルクナハト（3）` product | [official vol. 3](https://www.kodansha.co.jp/comic/products/0000424213) | `2026-02-17` | The publisher describes Noa and Brigid living under one roof, abduction by the mysterious organization “Mad Dead Company,” a fierce rescue fight, and subsequent bathing, laundry, and beef-stew routines. |
| 講談社 vol. 1 trial entry | [official vol. 1 trial](https://www.kodansha.co.jp/comic/products/0000415577/trial) | `2025-07-16` | The official trial redirected to a session-bound reader whose content metadata names `第1話　夜の邂逅` and 31 sample images. Provider image requests were not stably readable in this run (network change/403), so no page-level event or Factor value is promoted from the images. |

The three product descriptions form the sustained entry range: a lethal forced-choice opening (vol. 1), a defeat/training and bloody combat continuation (vol. 2), then abduction/rescue combat alongside shared domestic life (vol. 3). The trial route was checked as a first-arc access path, but its unavailable image pixels are not treated as evidence.

## Axis decision

### Proposed Tone: `darkness=known:2`, confidence `0.88`

This is the midpoint anchor in the Dictionary: serious danger or tragedy is present, but the entry range does not establish that cruel, bleak, or tragic events remain the dominant core at level 4.

- **Vol. 1:** the publisher foregrounds the protagonist's despair and a literal marriage-or-death ultimatum.
- **Vol. 2:** the continuation explicitly includes a death match, recognition of powerlessness, practical combat training, and a bloody battle.
- **Vol. 3:** abduction and a fierce rescue fight continue the danger register, while the same official description gives substantial shared-household and cooking routines.

This is repeated direct danger/tragedy across the 1–3 volume range, not a safety-label inference. The vol. 3 domestic material and the synopsis-only boundary are why `4` is rejected and `2` is the conservative proposal. The proposal must be independently adjudicated; no terminal CSV is changed here.

### Narrative exact exhaustion: no new proposal

The remaining Narrative axes were checked against the same finite official scope and the prior research/QA record. They remain `unknown` rather than being assigned low values from absent synopsis detail:

| residual axis | exact exhaustion reason |
|---|---|
| `problemSolving` | Vol. 2 gives defeat and practical training, and vol. 3 gives a rescue fight, but no official 1–3 passage exposes constraint analysis or an ingenious solving process. Prior QA rejected reopening this candidate; the absence of a described method is not evidence for `0`. |
| `strategy` | The official descriptions name fights, training, abduction, and rescue, but expose no tactical plan/counter-plan, long-range planning, political maneuver, or resource operation. The trial image pixels were unavailable, so no strategy sequence can be claimed. |
| `mysteryReveal` | Vol. 3's “mysterious organization” is an unresolved label in the product copy, not a bounded clue-to-truth sequence. Neither the 1–3 product descriptions nor the readable trial metadata supplies clues, deductions, or a reveal reward. Mystery is not inferred from the word `謎`. |

Therefore no Narrative axis is proposed in this round. This is exact exhaustion of the official publisher 1–3 product/first-arc routes that were available and the previously recorded official research/QA; it is not a quota fill and does not convert unknown to `0`.

## Supplemental review boundary

No user review was needed for the darkness proposal: the publisher's 1–3 descriptions already provide the direct sustained danger/tragedy evidence. User reviews would be supplemental only and cannot repair the missing direct Narrative sequence.

## Handoff

- proposed candidate: `darkness=2`, confidence `0.88`, pending independent adjudication
- Narrative: exact exhaustion; `problemSolving`, `strategy`, and `mysteryReveal` remain `unknown`
- existing progression/pacing/worldBuilding/characterArcWeight/relationshipStructure/mentalStress/romance, Genre, Theme, and Art are not re-opened
- `reviewedByHuman=false`
- no terminal/source/generated/Genre/Theme/Art/registry/overlay/promotion/blocker file was changed
