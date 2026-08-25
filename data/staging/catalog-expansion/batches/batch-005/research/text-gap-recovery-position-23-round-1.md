# Batch 005 text-gap recovery — position 23 round 1

- 조사일 및 모든 URL 조회일: `2026-08-25`
- 대상: position `23`, `work-43ebf010a490cfd4bb50`, `千年万年りんごの子`
- 평가 범위: `entry_1_3_volumes` (공식 1–3권 및 첫 주요 arc)
- `reviewedByHuman=false`
- 현재 text coverage: Narrative `3/6`, Tone `5/7`, Art `3/4`
- 현재 미확인 Narrative 후보: `progression`, `problemSolving`, `strategy`
- 이 문서는 research-only packet이다. terminal/source/Pass A/B/C/Genre/Theme/Art,
  registry, eligibility, promotion, generated catalog, recommendation code는 변경하지
  않는다.
- Genre를 추론하지 않으며, 의례·민속 신앙을 Dictionary Theme으로 치환하지 않는다.
- 사용자 리뷰는 이 round에서 사용하지 않았다. 공식 출판사 자료만으로 단일 후보를
  제안한다.
- 외부 자료의 `retrievedAt` 및 `accessedAt`: `2026-08-25`

## Current terminal gap

기존 known Narrative 값은 재판정하지 않는다. 이번 packet은 남은 세 Narrative 축 중
최대 하나만 제안한다.

| group | current coverage | residual candidates | packet boundary |
| --- | ---: | --- | --- |
| Genre | existing terminal value retained | none in this packet | no genre work |
| Theme | existing terminal value retained | none in this packet | ritual is not remapped to a legal Theme |
| Narrative | `3/6` | `progression`, `problemSolving`, `strategy` | propose at most one axis |
| Tone | `5/7` | unchanged | no Tone research |
| Art | `3/4` | unchanged | no Art research |

## Official source ledger

| evidenceId | source | direct URL | publishedAt | accessedAt | bounded direct support |
| --- | --- | --- | --- | --- | --- |
| `p23-r1-o1` | 講談社公式商品ページ — 千年万年りんごの子（２） | https://www.kodansha.co.jp/comic/products/0000046505 | `2013-05-07` | `2026-08-25` | After the ritual's revival makes 朝日 the local god's wife, the publisher synopsis states that 雪之丞 elicits the village lore from 陸郎, decides to take 朝日 back to Tokyo, and fights the god to protect his wife. |
| `p23-r1-o2` | 講談社公式商品ページ — 千年万年りんごの子（３）＜完＞ | https://www.kodansha.co.jp/comic/products/0000046557 | `2014-03-07` | `2026-08-25` | The entry-range conclusion states that 雪之丞 remains in the village and that the only clue for saving 朝日 is the `祭文`, a record of events from sixty years earlier; it also identifies the winter rite and the final choice. |
| `p23-r1-o3` | 文化庁メディア芸術祭公式受賞作品ページ — 千年万年りんごの子 | https://j-mediaarts-festival.bunka.go.jp/award/single/sennenmannenringonoko/index.html | `2013` (第16回 award cycle) | `2026-08-25` | The official award summary independently bounds the inciting forbidden-apple action, the revived ritual, and the village's inherited rule/history. It corroborates the constraint context only; it is not used to add a Theme or a second Narrative axis. |

The two Kodansha volume routes are direct rightsholder descriptions for volumes 2 and
3. They are limited to the frozen entry range and do not rely on later-volume events.
The award page is used only as bounded corroboration of the same opening conflict.

## Single provisional Narrative proposal

### `problemSolving=2`

| field | value |
| --- | --- |
| `proposedState` | `known` |
| `proposedValue` | `2` |
| `confidence` | `0.82` |
| `evidenceIds` | `p23-r1-o1`, `p23-r1-o2` |
| `accessedAt` | `2026-08-25` |

The volume-2 synopsis gives a concrete bounded obstacle/action chain: after the ritual
turns 朝日 into the god's wife, 雪之丞 obtains the village lore, makes a rescue decision,
and directly confronts the god. The publisher's action wording is explicit: `聞き出した`
(elicited the lore), `決断する` (decides), and `神と闘う` (fights the god). Volume 3
continues the same rescue objective by identifying the `祭文` as the sole clue for saving
朝日 and placing the winter rite and final choice inside that objective.

This matches the Dictionary midpoint: a bounded mix of information-gathering/assessment
and direct action. It is not `4`: no sustained multi-stage puzzle-solving method or
repeated primary clever-solution reward is stated. The proposal also does not turn the
existing `mysteryReveal=2` into a second cell; the clue/record is used here only to show
that the rescue problem has an information-and-action structure.

## Explicit non-proposals

| axis | disposition | exact reason |
| --- | --- | --- |
| `progression` | remain `unknown` | The official entry descriptions show escalating danger and decisions, not repeated growth, acquisition, or mastery rewards. |
| `strategy` | remain `unknown` | A rescue decision and one direct confrontation do not establish long-term planning, politics, war, or resource operation. |
| Theme | unchanged | The village ritual and god-wife rule are not directly named by a legal Dictionary Theme; no substitute label is made. |
| Tone | unchanged | Current `5/7` is retained; no additional Tone claim is needed. |
| Art | unchanged | Art was not researched in this packet. |
| Genre | unchanged | No Genre inference is made. |

If independently accepted, this single proposal changes only the Narrative count from
`3/6` to `4/6`; current Tone `5/7` and Art `3/4` remain unchanged. This packet is not a
terminal overlay or promotion decision, and every non-proposed unknown remains unknown.

## Verification boundary

- No terminal CSV, source/provenance record, Genre/Theme CSV, Art record, registry,
  eligibility, overlay, generated catalog, recommendation code, or commit was changed.
- No user-review sentence was used for a Factor value or UI explanation.
- No value was inferred from the title, genre labels, memory, or later volumes.
- No `reviewedByHuman` claim was made; it remains `false`.
