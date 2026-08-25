# Batch 005 Theme-gap recovery — position 23 round 1

- 조사일 및 모든 URL 조회일: `2026-08-25`
- 대상: position `23`, `work-43ebf010a490cfd4bb50`, `千年万年りんごの子`
- 평가 범위: `entry_1_3_volumes` (공식 1–3권 및 첫 주요 arc)
- `reviewedByHuman=false`
- 현재 Theme coverage: `0/1`
- 이 문서는 Theme만 다루는 research-only packet이다. terminal/source/Pass A/B/C,
  Genre/Narrative/Tone/Art, registry, eligibility, promotion, generated catalog,
  recommendation code는 변경하지 않는다.
- 작품명·Genre·수상·기억에서 Theme를 추론하지 않는다. 출판사 공식 권 소개와
  해당 권의 첫 arc 근거만 사용한다.

## Contract boundary

Factor Dictionary v1의 Theme 목록과 중심성 정의를 적용했다. `investigation`은
합법적인 Dictionary Theme이다. 중심성 `1`은 일부 에피소드 또는 종속 소재이고,
`2`는 작품의 반복적 핵심 구조다. 이번 제안은 2권과 3권에 걸친 하나의 연결된
구출 arc에서 정보 수집과 기록 단서가 반복된다는 점만 확정하며, 독립된 사건들의
반복이나 작품 전체의 핵심 구조까지 주장하지 않으므로 `centrality=1`로 제한한다.

이전 Daybreak 판정이 거부한 **의례/민속 신앙 → `historicalReconstruction` 또는
`politics` 치환**은 다시 열지 않는다. 아래 제안은 의례라는 소재가 아니라,
雪之丞가 마을의 설명을 듣고 기록을 단서로 삼는 별도의 정보 탐색 행위만을
`investigation`으로 판정한다. 기존 `mysteryReveal=2` Narrative 축도 변경하지
않는다.

## Official Kodansha source ledger

| evidenceId | source / edition | direct URL | publishedAt | accessedAt | bounded direct support |
| --- | --- | --- | --- | --- | --- |
| `p23-theme-r1-k1` | 講談社公式商品ページ — 千年万年りんごの子（１）, ISBN `9784063805789` | https://www.kodansha.co.jp/comic/products/0000046459 | `2012-07-06` | `2026-08-25` | The opening publisher copy places 雪之丞 in the snowy apple village and says that 朝日の illness triggers his action and shocks the village. This establishes the bounded village-conflict context; it is not, by itself, a Theme assignment. |
| `p23-theme-r1-k2` | 講談社公式商品ページ — 千年万年りんごの子（２）, ISBN `9784063806250` | https://www.kodansha.co.jp/comic/products/0000046505 | `2013-05-07` | `2026-08-25` | After the 60-year ritual returns, the synopsis explicitly says 雪之丞 obtains the village lore from 陸郎 (`陸郎から村の言い伝えを聞き出した`) before deciding how to rescue 朝日. This is active information acquisition in response to the village rule. |
| `p23-theme-r1-k3` | 講談社公式商品ページ — 千年万年りんごの子（３）＜完＞, ISBN `9784063806786` | https://www.kodansha.co.jp/comic/products/0000046557 | `2014-03-07` | `2026-08-25` | The conclusion states that the only clue for saving 朝日 is the record of the event sixty years earlier (`朝日を救う唯一の手掛かりは、六十年前の出来事を記録した“祭文”`). The record is used as the continuing information path while 雪之丞 remains in the village. |

All three routes are direct Kodansha rightsholder product pages. The linked official
trial routes were also checked in the existing entry-range packet: volume 1
`https://www.kodansha.co.jp/comic/products/0000046459/trial/reader?cid=16004bb7861da5596a0684a912a8f99c1021434d87c50d73d1a592067049f05b`, volume 2
`https://www.kodansha.co.jp/comic/products/0000046505/trial/reader?cid=56e678f2df9766f824a09fefe2b0189812567a041d226b356cf468599dd20cec`, and volume 3
`https://www.kodansha.co.jp/comic/products/0000046557/trial/reader?cid=7390232d899457a0c036dcbc21a9eae13ffe71a7525b54eb32923c2b16340c2a`.
Their sampled entry pages are used only as range/scene corroboration here; the
Theme claim rests on the direct publisher descriptions above.

## Direct recurring entry-range support

The official volume-2 description supplies the first explicit investigative action:
雪之丞 actively elicits the village lore after the revived rite changes 朝日の
status. The official volume-3 description repeats the same information-seeking
objective in the next entry volume: the rescue depends on locating and using the
old `祭文` as the only clue. These are two distinct consecutive volume descriptions,
and both place knowledge acquisition or a record clue inside the same bounded rescue
problem. This is recurring entry-range support for the legal `investigation` mechanic,
not a title/Genre/mystery-label conversion.

The evidence does **not** establish `centrality=2`: the publisher blurbs do not show
multiple independent investigation cases, a repeated case loop, or investigation as
the work-wide reward structure. The conservative centrality-1 proposal records the
observed connected sub-arc without inflating it.

## Single provisional Theme proposal

| field | value |
| --- | --- |
| `themeId` | `investigation` |
| `centrality` | `1` |
| `confidence` | `0.84` |
| `evidenceIds` | `p23-theme-r1-k2`, `p23-theme-r1-k3` |
| `evaluatedRange` | `entry_1_3_volumes` |
| `accessedAt` | `2026-08-25` |
| `proposedState` | `known` |

The proposal is limited to the observable mechanic: obtain village lore, then use a
historical record as the stated sole clue for the rescue. It does not add a second
Narrative cell, alter the accepted `problemSolving=2`, or treat the god/ritual as an
unlisted supernatural Theme.

## Explicit non-proposals

| candidate | disposition | exact reason |
| --- | --- | --- |
| `historicalReconstruction` | no | The 60-year record is a clue in a rescue investigation, not direct evidence that reconstructing history is a repeated work mechanic. |
| `politics` | no | Village market pressure and the local rule are setting/conflict context, not a recurring political decision structure. |
| `survival` | no | 朝日の danger is the stake of the rescue, not a repeated survival mechanic. |
| `adventure` / `exploration` | no | No recurring journey or exploration loop is stated in the bounded official descriptions. |
| `foundFamily` | no | The official material concerns an existing married/family relationship; no found-family formation is shown. |
| `mysteryReveal` Theme | no | `mysteryReveal` is an existing Narrative axis, not a legal Theme ID; this proposal uses the distinct investigative action only. |

## Daybreak and prior-QA reconciliation

The following existing QA reports were read as audit constraints, not as annotation
votes:

- `reviews/daybreak-text-recovery-position-23-round-1-qa.md` accepts the separate
  `problemSolving=2` recovery and explicitly leaves the ritual/record material out of
  Theme. This packet preserves that decision and isolates `investigation` as the
  newly tested legal Theme mechanic.
- `reviews/daybreak-text-adjudication-chunk-03.md` records the recurring village
  god/ritual/60-year rule and says no listed Theme was directly established. The
  present packet does not label that ritual; it adds only the two directly stated
  information-seeking acts from the Kodansha volume pages.
- `reviews/daybreak-text-recovery-qa-chunk-03-round-2.md` and
  `reviews/daybreak-text-recovery-qa-chunk-03-round-3.md` preserve the entry boundary
  and prohibit title, broad-Genre, or review-vote inference. No such inference is
  used here.
- `reviews/daybreak-text-blocker-adjudication-chunk-03.md` keeps position 23 at
  `NO_FINAL_BLOCKER_YET` and names the exact Kodansha volume routes for residual Theme
  research. This packet uses those direct routes and does not change blocker state.
- `reviews/daybreak-annotation-qa-chunks-03-05.md` confirms the prior unsupported
  `politics` Theme was removed for position 23; `politics` is not reintroduced.
- `reviews/daybreak-art-preflight-qa-chunk-03.md`,
  `reviews/daybreak-art-preflight-qa-chunk-03-round-2.md`, and
  `reviews/daybreak-art-preflight-qa-chunk-03-round-3.md` are Art-only QA and assign
  no Theme or text value; Art evidence is not used in this proposal.

## Verification boundary

- Exactly one legal Theme candidate is proposed: `investigation:1`.
- No terminal CSV, source/provenance record, Pass A/B/C file, Art record, registry,
  eligibility, blocker, promotion, overlay, generated catalog, or recommendation
  file was changed.
- `reviewedByHuman=false` remains in force.
- No Genre, title, award, memory, or later-volume inference was used.
- Independent adjudication must accept, reduce, or reject this proposal before any
  Theme row is materialized.
