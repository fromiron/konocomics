# Batch 005 Pass C — text adjudication, chunks 01–02

## Scope and current-root attestation

- reviewer: Daybreak independent Pass C adjudicator
- reviewedByHuman: `false`
- reviewDate: 2026-08-25
- scope: frozen positions 1–20, entry volumes 1–3 or the explicitly narrower first-major-episode range
- packetCandidateSha256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifestSha256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- packetPayloadLedgerSha256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- frozenWorkSetSha256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- annotation guide SHA-256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`
- research chunk SHA-256: chunk 01 `2390a3e9b6f57c48b109710728568d4eeb2f6d08416122f9f91b2e81b78909e0`; chunk 02 `7b102a7889fa15bc778d5eb0f91785a285fed2d08b0386f809eebd3d04fc6bdd`
- fresh Daybreak Pass A QA SHA-256: `4f032d8fbfacdeec01ab01dc53a414dd9f1b118fc5f208b4584d520828a65539`
- Grok complete response SHA-256: chunk 01 `9a3e883d4c9c48445c48d06a0902834e502aa0ac45bd5e0ca539388183f57f0d`; chunk 02 `d998c4b628ded98489d1cb79308fefa9e2a8581fa1054f45cf37c2f8bfbf648f`
- Grok execution ledger SHA-256: chunk 01 `a4b725b715f2341b3b8898710da25bbe60b77bfe9653b74b76c6f390994c52dd`; chunk 02 `82b8622da42a4df38b3ef83741f2ab3827c3ca9c706c0155ecdae40381eed55d`
- excluded: stale `12ad…`/`abda…` roots, Gold and other-batch values, selection provenance as Factor evidence, Art inference, promotion, overlay build, and source mutation
- panel status: Cursor Grok 4.6 High non-fast used for non-Art Pass B; `ART_ABSTAIN`; Muse `NOT_USED`; Ox `EXCLUDED`

The Pass A CSV/notes and both Grok requests, complete responses, and ledgers were
read against the hashes above. The stale-root attempts recorded in the Grok
ledgers remain `DISCARDED_NOT_EVIDENCE`.

## Adjudication rule

- Every disputed claim was resolved from source authority, entry-scope fit, and
  the Factor Dictionary. Values were neither averaged nor selected by vote.
- Synopsis silence is not affirmative absence. A proposed zero was accepted only
  when the three-volume evidence positively established the low anchor.
- Genre does not determine an Axis. Selection labels are not Factor evidence.
  Unknown remains non-numeric and is not converted to a low or neutral value.
- All four Art rows for all 20 works remain `unknown`. No internal-page sample
  was supplied, so Art shortage is closed evidence state, not a blocker.
- Narrative order is `progression / problemSolving / strategy / pacing /
  mysteryReveal / worldBuilding`.
- Tone order is `characterArcWeight / relationshipStructure / comedy /
  darkness / mentalStress / romance / emotionalWarmth`.
- Coverage minima are Genre `1/1`, Theme `1/1`, Narrative `4/6`, Tone
  `5/7`, and Art `2/4` (the 0.30 Art threshold requires two known cells).

## Claim-by-claim resolution

| Pos | Final resolution of Pass B differences |
| --: | --- |
| 1 | ACCEPT `strategy=4` and `worldBuilding=3`: papal succession planning is the entry political operation, while institutions/factions exceed a merely functional setting without reaching the 4 anchor. |
| 2 | ACCEPT `pacing=0`, `darkness=0`, and `mentalStress=0`; REJECT the other proposed zeros. Three volumes affirm slow, bright, low-pressure everyday food life, but synopsis silence does not prove no growth, solving, strategy, mystery, world structure, or character reward. |
| 3 | No Pass A/Pass B value conflict; the empty Genre remains evidence-bound. |
| 4 | ACCEPT `pacing=3`, `worldBuilding=2`, and Theme `adventure:1`; repeated attacks and location/goal shifts support the faster midpoint, the ツガイ setting is functional, and travel is subsidiary to `combat:2`. |
| 5 | ACCEPT Genre `sliceOfLife`; REJECT Themes `cooking` and `school`. Ramen seeking is not the preparation mechanic, and high-school identity alone is not a recurring school structure. |
| 6 | ACCEPT `mentalStress=2`; adjudicate `romance=1`, not Pass A 2 or Pass B unknown. The broken engagement repeatedly motivates food-seeking, but it is below an active romantic subplot. REJECT the proposed Narrative/world zeros. |
| 7 | ACCEPT `darkness=3`: war, occupation, and the explicit loss list exceed ordinary serious stakes but do not establish the dictionary 4 anchor. |
| 8 | ACCEPT `progression=unknown` and `relationshipStructure=unknown`. “Small evolution” and “new family” are TOC titles within an explicitly limited 2–3-volume record, not sufficient recurrence evidence. |
| 9 | ACCEPT removal of Genre `action`; murder, abduction, and escape establish darkness but not an action-genre identity. |
| 10 | ACCEPT `pacing=0` and `darkness=0`: the official descriptions affirm ordinary, light club life with little goal/situation change. |
| 11 | ACCEPT `pacing=2`, `darkness=4`, Themes `adventure:1`, `war:1`, and `revenge:1`; retain `combat:2`. Travel, war milieu, and revenge are subordinate while child-soldier loss, assassination, mines, and armed conflict remain the cruel entry center. |
| 12 | No Pass A/Pass B value conflict. |
| 13 | No Pass A/Pass B value conflict. |
| 14 | ACCEPT `mentalStress=2`: online abuse, professional uncertainty, and partner/future worry directly establish mixed pressure without collapse. |
| 15 | No Pass A/Pass B value conflict. |
| 16 | No Pass A/Pass B value conflict. |
| 17 | REJECT `darkness=2`. Couple conflict and a suspicious incident establish relationship pressure, already represented by `mentalStress=2`, but do not independently establish a dark world or recurring tragedy. |
| 18 | RETAIN `characterArcWeight=3`; ACCEPT `relationshipStructure=0`; REJECT `darkness=2`. The three summaries center Kurosawa's solitary social return, while hardship supports `survival:2` without by itself proving darkness. |
| 19 | ACCEPT `problemSolving=unknown`. Passenger-service incidents do not expose constraint analysis or a repeated solution process. |
| 20 | ACCEPT `worldBuilding=2`, `characterArcWeight=1`, `darkness=4`, and Genre `horror`; REJECT `strategy=2`, `mysteryReveal=2`, and `relationshipStructure=2`. Plant behavior is a functional rule, the threat plot dominates character change, fear/despair are central, and the named people are not established as a recurring party. Weapons search is not repeated planning and unresolved prophecy is not a reveal payoff. |

## Materialized outputs

| File | SHA-256 | Rows excluding header |
| --- | --- | --: |
| `adjudication/text-final-chunk-01.csv` | `4905ce2a2336323ad7c3573ed0df38d2a8b1fce26c80a0e170fc9568ff8376d6` | 170 |
| `adjudication/genres-final-chunk-01.csv` | `20cf598439f4d2ba363a1e220afe6fb26706c40f6efb26abdd75996f177171c9` | 10 |
| `adjudication/themes-final-chunk-01.csv` | `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12` | 11 |
| `adjudication/text-final-chunk-02.csv` | `430aad3d52757f02a1bfeab003af0dea49e8fec92283204b55240376dff704b6` | 170 |
| `adjudication/genres-final-chunk-02.csv` | `793bc52f85519ec1a6768bebb50d88ce129548eb13a6f9b5d2128517730764de` | 10 |
| `adjudication/themes-final-chunk-02.csv` | `671539087a1958781e9d11a9e9bc67e057f009846f0ba5e6f2203a18d1ad7cf9` | 17 |

Each text CSV has exact dictionary order for 10 works × 17 axes. Every known
row has value, confidence, and canonical evidence ID; every unknown row has
blank value/confidence. Each Genre CSV has exactly one row per work. Theme rows
use only dictionary IDs, centrality 1 or 2, and
`ev-batch-005-a-{workId}`.

## Final vectors and gate outcome

| # | Canonical title | Narrative 6 | Tone 7 | Genre | Theme + centrality | Coverage G · Th · N · T · A | Terminal text outcome |
| --: | --- | --- | --- | --- | --- | --- | --- |
| 01 | チェーザレ 破壊の創造者 | U/U/4/2/U/3 | U/2/U/U/U/U/U | historical | politics:2; historicalReconstruction:2 | 1/1 · 1/1 · 3/6 · 1/7 · 0/4 | `TEXT_GATE_FAIL` — N+1, T+4 |
| 02 | くーねるまるた | U/U/U/0/U/U | U/2/U/0/0/U/2 | sliceOfLife | cooking:2 | 1/1 · 1/1 · 1/6 · 4/7 · 0/4 | `TEXT_GATE_FAIL` — N+3, T+1 |
| 03 | インベスターZ | 2/U/2/2/U/2 | U/U/U/U/U/U/U | ∅ | school:2 | 0/1 · 1/1 · 4/6 · 0/7 · 0/4 | `TEXT_GATE_FAIL` — G+1, T+5 |
| 04 | 黄泉のツガイ | U/U/U/3/2/2 | U/2/U/2/U/U/U | action;fantasy | adventure:1; combat:2 | 1/1 · 1/1 · 3/6 · 2/7 · 0/4 | `TEXT_GATE_FAIL` — N+1, T+3 |
| 05 | ラーメン大好き小泉さん | U/U/U/U/U/U | U/U/U/U/U/U/U | sliceOfLife | ∅ | 1/1 · 0/1 · 0/6 · 0/7 · 0/4 | `TEXT_GATE_FAIL` — Th+1, N+4, T+5 |
| 06 | 忘却のサチコ | U/U/U/2/U/U | 2/U/U/U/2/1/U | sliceOfLife | workplace:2 | 1/1 · 1/1 · 1/6 · 3/7 · 0/4 | `TEXT_GATE_FAIL` — N+3, T+2 |
| 07 | 機動旅団八福神 | U/U/U/2/U/2 | U/2/U/3/U/U/U | action;scienceFiction | combat:2; war:2 | 1/1 · 1/1 · 2/6 · 2/7 · 0/4 | `TEXT_GATE_FAIL` — N+2, T+3 |
| 08 | 不滅のあなたへ | U/U/U/2/U/U | 2/U/U/2/U/U/2 | fantasy | exploration:2 | 1/1 · 1/1 · 1/6 · 3/7 · 0/4 | `TEXT_GATE_FAIL` — N+3, T+2 |
| 09 | よるくも | U/U/U/2/U/2 | 2/2/U/4/3/U/U | ∅ | ∅ | 0/1 · 0/1 · 2/6 · 4/7 · 0/4 | `TEXT_GATE_FAIL` — G+1, Th+1, N+2, T+1 |
| 10 | 高校球児 ザワさん | U/U/U/0/U/U | U/2/U/0/U/U/U | sports;sliceOfLife | school:2 | 1/1 · 1/1 · 1/6 · 2/7 · 0/4 | `TEXT_GATE_FAIL` — N+3, T+3 |
| 11 | ヨルムンガンド | U/U/U/2/U/2 | 2/2/U/4/U/U/U | action | adventure:1; combat:2; war:1; revenge:1 | 1/1 · 1/1 · 2/6 · 3/7 · 0/4 | `TEXT_GATE_FAIL` — N+2, T+2 |
| 12 | ボクラノキセキ | U/U/U/U/3/2 | 3/2/U/U/2/U/U | fantasy;mystery | investigation:2; reincarnation:2; school:2 | 1/1 · 1/1 · 2/6 · 3/7 · 0/4 | `TEXT_GATE_FAIL` — N+2, T+2 |
| 13 | おまかせ精霊 | U/U/U/U/U/U | U/U/U/U/U/U/U | fantasy;sliceOfLife | school:1 | 1/1 · 1/1 · 0/6 · 0/7 · 0/4 | `TEXT_GATE_FAIL` — N+4, T+5 |
| 14 | ニラメッコ | U/U/U/U/U/U | 3/2/U/U/2/U/U | sliceOfLife | workplace:2 | 1/1 · 1/1 · 0/6 · 3/7 · 0/4 | `TEXT_GATE_FAIL` — N+4, T+2 |
| 15 | 恋愛ラボ | U/U/U/U/U/U | 2/2/3/U/U/3/2 | comedy;romance | school:2 | 1/1 · 1/1 · 0/6 · 5/7 · 0/4 | `TEXT_GATE_FAIL` — N+4 |
| 16 | 銀のスプーン | 2/U/U/2/2/U | 3/2/U/2/2/U/4 | sliceOfLife | cooking:2 | 1/1 · 1/1 · 3/6 · 5/7 · 0/4 | `TEXT_GATE_FAIL` — N+1 |
| 17 | おかめ日和 | U/U/U/2/U/U | 2/2/U/U/2/3/2 | sliceOfLife;romance | ∅ | 1/1 · 0/1 · 1/6 · 5/7 · 0/4 | `TEXT_GATE_FAIL` — Th+1, N+3 |
| 18 | 新黒沢 最強伝説 | U/U/U/2/U/U | 3/0/U/U/U/U/U | sliceOfLife | survival:2 | 1/1 · 1/1 · 1/6 · 2/7 · 0/4 | `TEXT_GATE_FAIL` — N+3, T+3 |
| 19 | カレチ | 2/U/U/3/U/2 | 2/U/U/U/U/U/2 | historical;sliceOfLife | workplace:2; historicalReconstruction:2 | 1/1 · 1/1 · 3/6 · 2/7 · 0/4 | `TEXT_GATE_FAIL` — N+1, T+3 |
| 20 | GREEN WORLDZ | U/U/U/3/U/2 | 1/U/U/4/3/U/U | action;scienceFiction;horror | combat:2; survival:2; postApocalypse:2 | 1/1 · 1/1 · 2/6 · 3/7 · 0/4 | `TEXT_GATE_FAIL` — N+2, T+2 |

Gate totals:

| Scope | Genre | Theme | Narrative | Tone | Art | All non-Art text gates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| chunk 01 | 8/10 | 8/10 | 1/10 | 0/10 | 0/10 | 0/10 |
| chunk 02 | 10/10 | 9/10 | 0/10 | 3/10 | 0/10 | 0/10 |
| positions 1–20 | 18/20 | 17/20 | 1/20 | 3/20 | 0/20 | 0/20 |

`TEXT_GATE_FAIL` is a terminal evidence-coverage result for this packet. It is
not `recommendationVerified`, a schema failure, or an Art blocker.

## Finite additional-research requirements

The exact remaining minimums are below. Narrative/Tone research must use an
unused detailed official/rightsholder entry source or at least two independent,
eligible, range-matched reviews repeating a concrete observation. Genre/Theme
gaps require direct evidence for one legal dictionary tag; a demographic,
selection label, food subject, occupation mention, or isolated setting is not
enough.

| Pos | Canonical title | Minimum additional evidence needed |
| --: | --- | --- |
| 01 | チェーザレ 破壊の創造者 | 1 Narrative cells from progression/problemSolving/mysteryReveal; 4 Tone cells from characterArcWeight/comedy/darkness/mentalStress/romance/emotionalWarmth |
| 02 | くーねるまるた | 3 Narrative cells from progression/problemSolving/strategy/mysteryReveal/worldBuilding; 1 Tone cells from characterArcWeight/comedy/romance |
| 03 | インベスターZ | one legal Genre from direct entry-scope evidence; 5 Tone cells from characterArcWeight/relationshipStructure/comedy/darkness/mentalStress/romance/emotionalWarmth |
| 04 | 黄泉のツガイ | 1 Narrative cells from progression/problemSolving/strategy; 3 Tone cells from characterArcWeight/comedy/mentalStress/romance/emotionalWarmth |
| 05 | ラーメン大好き小泉さん | one dictionary Theme from direct recurring structure; 4 Narrative cells from progression/problemSolving/strategy/pacing/mysteryReveal/worldBuilding; 5 Tone cells from characterArcWeight/relationshipStructure/comedy/darkness/mentalStress/romance/emotionalWarmth |
| 06 | 忘却のサチコ | 3 Narrative cells from progression/problemSolving/strategy/mysteryReveal/worldBuilding; 2 Tone cells from relationshipStructure/comedy/darkness/emotionalWarmth |
| 07 | 機動旅団八福神 | 2 Narrative cells from progression/problemSolving/strategy/mysteryReveal; 3 Tone cells from characterArcWeight/comedy/mentalStress/romance/emotionalWarmth |
| 08 | 不滅のあなたへ | 3 Narrative cells from progression/problemSolving/strategy/mysteryReveal/worldBuilding; 2 Tone cells from relationshipStructure/comedy/mentalStress/romance |
| 09 | よるくも | one legal Genre from direct entry-scope evidence; one dictionary Theme from direct recurring structure; 2 Narrative cells from progression/problemSolving/strategy/mysteryReveal; 1 Tone cells from comedy/romance/emotionalWarmth |
| 10 | 高校球児 ザワさん | 3 Narrative cells from progression/problemSolving/strategy/mysteryReveal/worldBuilding; 3 Tone cells from characterArcWeight/comedy/mentalStress/romance/emotionalWarmth |
| 11 | ヨルムンガンド | 2 Narrative cells from progression/problemSolving/strategy/mysteryReveal; 2 Tone cells from comedy/mentalStress/romance/emotionalWarmth |
| 12 | ボクラノキセキ | 2 Narrative cells from progression/problemSolving/strategy/pacing; 2 Tone cells from comedy/darkness/romance/emotionalWarmth |
| 13 | おまかせ精霊 | 4 Narrative cells from progression/problemSolving/strategy/pacing/mysteryReveal/worldBuilding; 5 Tone cells from characterArcWeight/relationshipStructure/comedy/darkness/mentalStress/romance/emotionalWarmth |
| 14 | ニラメッコ | 4 Narrative cells from progression/problemSolving/strategy/pacing/mysteryReveal/worldBuilding; 2 Tone cells from comedy/darkness/romance/emotionalWarmth |
| 15 | 恋愛ラボ | 4 Narrative cells from progression/problemSolving/strategy/pacing/mysteryReveal/worldBuilding |
| 16 | 銀のスプーン | 1 Narrative cells from problemSolving/strategy/worldBuilding |
| 17 | おかめ日和 | one dictionary Theme from direct recurring structure; 3 Narrative cells from progression/problemSolving/strategy/mysteryReveal/worldBuilding |
| 18 | 新黒沢 最強伝説 | 3 Narrative cells from progression/problemSolving/strategy/mysteryReveal/worldBuilding; 3 Tone cells from comedy/darkness/mentalStress/romance/emotionalWarmth |
| 19 | カレチ | 1 Narrative cells from problemSolving/strategy/mysteryReveal; 3 Tone cells from relationshipStructure/comedy/darkness/mentalStress/romance |
| 20 | GREEN WORLDZ | 2 Narrative cells from progression/problemSolving/strategy/mysteryReveal; 2 Tone cells from relationshipStructure/comedy/romance/emotionalWarmth |

Positions 3, 5, 9, and 17 require special category-boundary attention:

- position 3: seek a direct legal Genre characterization for the investment-club
  entry experience; “investment manga” is not a dictionary Genre.
- position 5: seek recurring entry structure for a legal Theme; ramen consumption
  does not establish `cooking`, and student identity does not establish school.
- position 9: seek direct Genre and Theme evidence without converting dark events
  into action or a one-volume diner into workplace.
- position 17: seek a recurring dictionary Theme without treating an existing
  family as `foundFamily` or a spouse's occupation as workplace.

Unused qualifying official detail or eligible independent reviews remain
possible for these finite routes. Therefore neither
`SOURCE_INFORMATION_UNAVAILABLE` nor `FACTOR_MODEL_INCOMPATIBLE` is
established at this stage. Re-evaluate only after the listed bounded searches
are exhausted.

## Final disposition

- Pass C text outputs for chunks 01–02 are materialized and internally complete.
- All 20 works remain terminal text-coverage failures; 0/20 pass every non-Art
  text gate.
- All 80 Art cells remain `unknown`; missing pixel proof is not a low value,
  blocker, or pending adjudication.
- No identity or adult-only safety conflict was found in the current packet.
- No promotion, overlay build, Pass A/research/source edit, or commit was made.
