# Batch 005 text-gap recovery — position 04 round 5

## Scope and non-repetition guard

- 조사일 및 모든 URL 조회일: `2026-08-25`
- 대상: position `4`, `work-0cf463005cc77eeded8e`, `黄泉のツガイ`
- 평가 범위: `entry_1_3_volumes`; 공식 MANGA UP 제3화 body pages only
- 조사 축: `strategy`, `problemSolving`
- `reviewedByHuman=false`
- `progression`, `characterArcWeight`의 기존 거부 결론과 `emotionalWarmth=2`, `mentalStress=2`의 기존 승인 결론은 재심·재제안하지 않음
- 기존 제2화의 `strategy`·`problemSolving` 거부 근거(위기 중 명령·반응·구조만 있고 계획/분석 과정이 없다는 결론)는 재사용하지 않되, 그 거부된 값도 재제안하지 않음
- Art, Genre, Theme, terminal CSV, source, generated catalog, registry, promotion 파일은 변경하지 않음
- 장식용 `『』`·`「」`를 canonical title 또는 작품 식별 필드에 사용하지 않음

`strategy=2`의 사전 기준은 “전술·단기 계획 존재”이다. `problemSolving=2`는
“지략과 직접 행동 혼합”이며, 단순한 이동·명령·전투 성공·사후 설명만으로는
충족하지 않는다. 따라서 이번 라운드는 공식 제3화에서 (1) 위협 판단→목표·경로
선택→역할 운용, (2) 은폐·주거 제약→대안 비교→위장 가족 설정 확정이라는
서로 다른 계획 과정을 직접 확인했다.

## Official source ledger

| sourceName | URL | publishedAt | retrievedAt | bounded use |
| --- | --- | --- | --- | --- |
| SQUARE ENIX 공식 MANGA UP 작품 페이지 — 黄泉のツガイ | https://www.manga-up.com/titles/901 | undated | `2026-08-25` | 작품 ID `901`, 제목·작가·공식 rightsholder route 확인 |
| SQUARE ENIX 공식 MANGA UP 제3화 전편 ① — デラとハナ | https://www.manga-up.com/titles/901/chapters/191003 | undated | `2026-08-25` | chapter `1163d3730_8`, body pages `001–006` |
| SQUARE ENIX 공식 MANGA UP 제3화 전편 ② — デラとハナ | https://www.manga-up.com/titles/901/chapters/191006 | undated | `2026-08-25` | chapter `1163d3730_9`, body pages `023–028` |

The retrieved HTML payloads were retained only in `/tmp/konocomics-yomitsuga-episode03/`
and are not committed:

| route | local payload SHA-256 |
| --- | --- |
| `191003` | `58df529375969ae7edb40c762914f1029d5c589273155c3c48ffe89f5c300f60` |
| `191006` | `0cc6f3a2be05307d35b5b2a494c7ef5e84a0783926e52757f2558a6e6a1442c7` |

The direct reader asset URLs use the rightsholder's current signed route with
`expires=1787695200`. Temporary image files were inspected outside the repository;
no image was added to this packet or committed.

## Exact official body-page references

| pageRef | direct official URL | SHA-256 |
| --- | --- | --- |
| `official-mangaup-episode03-001` | https://ja-img.manga-up.com/secure/1652418365/manga/high/1163d3730_8/1163d3730_8_001.webp?hash=WSawtXhokjCT_gzf3Ied3g&expires=1787695200 | `a6095d2e92e1b8469e7d0a77798ebb9c5cd47aef038e135b3a3cbfb0d5ce2ed1` |
| `official-mangaup-episode03-002` | https://ja-img.manga-up.com/secure/1652418368/manga/high/1163d3730_8/1163d3730_8_002.webp?hash=88rH9--rsYlko6hd5IvYvg&expires=1787695200 | `24ac956feee4a861e0dfb74a3dc51f72c16afcb22f12d3ab931d11176bd7f769` |
| `official-mangaup-episode03-003` | https://ja-img.manga-up.com/secure/1652418370/manga/high/1163d3730_8/1163d3730_8_003.webp?hash=kIhV75jVnIC1uobxKbuYqw&expires=1787695200 | `5d7acb96adc9578c55ff84fc08237f363944337801df7f3169ef8adcc70c7ed6` |
| `official-mangaup-episode03-004` | https://ja-img.manga-up.com/secure/1652418373/manga/high/1163d3730_8/1163d3730_8_004.webp?hash=qboaWE40sh_DSnP1uuq_bg&expires=1787695200 | `d856eca6ee7c50a70437e745a18116b2b71d007b630279f0698666002e0aa3c1` |
| `official-mangaup-episode03-005` | https://ja-img.manga-up.com/secure/1652418376/manga/high/1163d3730_8/1163d3730_8_005.webp?hash=HO3pjRXFKhoyKUXGCdCTMQ&expires=1787695200 | `356769d88082468215422a801eefb59565e777e9348ed645e0bd188408a78153` |
| `official-mangaup-episode03-006` | https://ja-img.manga-up.com/secure/1652418379/manga/high/1163d3730_8/1163d3730_8_006.webp?hash=Mw3P9R54zY1DXNlRWLWBkA&expires=1787695200 | `32ee3e0d617fa23dd41bc3a64393be4610a94da8ee20a0dc6da74f856f63d65a` |
| `official-mangaup-episode03-023` | https://ja-img.manga-up.com/secure/1652418425/manga/high/1163d3730_9/1163d3730_9_023.webp?hash=T0KW2fsHbFITQzl3amnXRg&expires=1787695200 | `c800da3e052641a9d0cf1021ab5af6bc54663447d6b23d646b9c5e660cd03c06` |
| `official-mangaup-episode03-024` | https://ja-img.manga-up.com/secure/1652418427/manga/high/1163d3730_9/1163d3730_9_024.webp?hash=0WAi9s2ajK-_YVM-eM6bgQ&expires=1787695200 | `8bd1ebea8aa17344e5cb07c98764fa4644c074e5f89a1661a98bb0f3dc4a9158` |
| `official-mangaup-episode03-025` | https://ja-img.manga-up.com/secure/1652418430/manga/high/1163d3730_9/1163d3730_9_025.webp?hash=FS71Vnh8FXvHSmP__M7EKA&expires=1787695200 | `88f7fb46ac8d025ec91ec3ecfd3381a28ed2a7e01f6273b6b7abcfffda0fb6d1` |
| `official-mangaup-episode03-026` | https://ja-img.manga-up.com/secure/1652418433/manga/high/1163d3730_9/1163d3730_9_026.webp?hash=gHPY03QbXWY3XAJpL0kg4w&expires=1787695200 | `5f75473e469a8762bd241e15c08eedb21dc1fc98200079d270b18fe1cf048a4a` |
| `official-mangaup-episode03-027` | https://ja-img.manga-up.com/secure/1652418436/manga/high/1163d3730_9/1163d3730_9_027.webp?hash=WcFAdNPLAK8c5U_iZsyEiw&expires=1787695200 | `d201df67fa353ff0db3844898ea981a5df373d48f8c6d9de27873114c02507f8` |
| `official-mangaup-episode03-028` | https://ja-img.manga-up.com/secure/1652418438/manga/high/1163d3730_9/1163d3730_9_028.webp?hash=zGSpmC6znuqzZB_1EJFYJA&expires=1787695200 | `3571d9050b6f4060e0fc9702ace50c6d757890172a4e04970cc3d75d880ce73c` |

## Direct repeated planning/process observations

### Cluster A — threat assessment and short-term relocation plan

- `official-mangaup-episode03-001`: Dera says the detailed discussion can happen while
  running and orders the group to leave immediately; the group is told that Yuru is
  being targeted. This establishes an observed threat and an urgent route objective,
  not merely a travel montage.
- `official-mangaup-episode03-002`: the group checks whether a nearby Tsugai user is
  present, then chooses a more populated place and puts Yuru in the vehicle. The
  threat check leads to a concrete relocation choice and role movement.
- `official-mangaup-episode03-005`: after learning that the pursuing side has troops,
  the group identifies the Kagemori risk and states that they must move house. This
  re-evaluates the threat and updates the immediate plan rather than repeating an
  episode-2 rescue command.
- `official-mangaup-episode03-006`: the group detects a nearby Tsugai, checks whether
  the approaching party is hostile, and continues the flight after identifying an
  old friend. This is the plan's monitoring/response step; it is not counted as a
  separate factor value.

### Cluster B — concealment and household-cover plan

- `official-mangaup-episode03-025`: Dera states the operational constraint: they must
  protect Yuru while blending into a crowd. He explains that rural rumors spread
  immediately, so a sufficiently large town is preferable. He compares alternatives
  (marriage versus room-sharing) and gives the practical reason for a family cover:
  a family is easier to house and receives substantially more social trust.
- `official-mangaup-episode03-026`: the group turns that reasoning into an executable
  cover: Yuru is Dera's carried-in child, Hana is the younger new wife, and the
  arrangement is explicitly a false setting. The page also works through the
  single-parent alternative, showing constraint comparison before settling the
  household roles.
- `official-mangaup-episode03-027`: the group continues implementing the plan in the
  populated area and handles operational details such as food, names, and the new
  social setting. This is post-choice execution, not a new independent plan.

These are two distinct bounded processes: immediate threat avoidance/relocation and
longer-lived concealment/household logistics. The second contains an explicit
constraint, alternatives, a reasoned selection, and assigned roles. No episode-2
command/rescue observation is used as a substitute for these page clusters.

## Adjudication proposal

### `strategy=2` — provisional proposal

| field | value |
| --- | --- |
| axisId | `strategy` |
| proposedState / value | `known / 2` |
| confidence | `0.88` |
| proposal evidence ID | `ev-batch-005-a-work-0cf463005cc77eeded8e-r5-strategy` |
| primary evidence | `official-mangaup-episode03-001`, `002`, `005`, `025`, `026` |
| dictionary fit | The entry range visibly contains short-term threat avoidance and a concrete operational cover plan. The cover plan compares alternatives and assigns executable household roles; this fits tactical/short-range planning without claiming long-term war, politics, or resource management. |
| boundary | Do not promote to `strategy=4`: no long-term plan, war/political operation, or resource-management loop. Do not duplicate the same cover plan into `problemSolving`. |

The value is intentionally a midpoint. It is supported by two separate planning
clusters and direct process steps, but the work is not being characterized as a
strategy-centered political or military series.

### `problemSolving` — remain `unknown`

The concealment plan is clever and constraint-aware, but it is one bounded logistical
solution whose reward is safe relocation/cover. The direct pages do not show a second
independent obstacle→analysis→non-obvious solution sequence of the kind required for
this axis, and the relocation process is better represented by `strategy`. The
episode-2 command/action and rescue material remains excluded. Therefore no numeric
`problemSolving` proposal is made and no prior rejected value is recycled.

## Closed cells and handoff

| axis | disposition |
| --- | --- |
| `strategy` | new provisional `known=2`; independent non-Art review required |
| `problemSolving` | remain `unknown`; no admissible repeated analytic solution process found |
| `progression` | existing rejected conclusion unchanged; do not reopen |
| `characterArcWeight` | existing rejected conclusion unchanged; do not reopen |
| `mentalStress` | existing accepted `known=2` unchanged |
| `emotionalWarmth` | existing accepted `known=2` unchanged |
| Art axes | unchanged; outside this text recovery |

If the independent reviewer accepts `strategy=2`, the work's Narrative count moves
from `3/6` to `4/6`, closing the sole current text coverage deficit while leaving all
other gates and promotion conditions subject to the normal pipeline. Rejection must
leave `strategy=unknown`; this packet does not authorize terminal mutation,
recommendation promotion, or blocker creation.

## Reproducibility and verification

- all 12 official body pages returned through the rightsholder MANGA UP route on
  `2026-08-25`; temporary files are under `/tmp/konocomics-yomitsuga-episode03/`
- exact page URLs, signed query parameters, and SHA-256 values are recorded above
- no terminal/source/generated/promotion/Art file was edited
- `reviewedByHuman=false`
- `git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-04-round-5.md` must pass before handoff
- `sha256sum data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-04-round-5.md` records the packet identity
