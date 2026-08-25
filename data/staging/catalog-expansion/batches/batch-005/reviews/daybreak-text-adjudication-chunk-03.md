# Batch 005 Pass C — text adjudication, chunk 03

## Scope and current-root attestation

- reviewer: Daybreak independent Pass C adjudicator
- `reviewedByHuman=false`
- reviewDate: 2026-08-25
- scope: frozen positions 21–30, entry volumes 1–3
- packetCandidateSha256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifestSha256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- packetPayloadLedgerSha256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- frozenWorkSetSha256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- annotation guide SHA-256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`
- research chunk SHA-256: `92f9a69121128aa2668898bdb70a112492bda8958247cd0e9c8202128e533191`
- Pass A factors / genres / themes / notes SHA-256: `230e0864ec9429b9b21898e50f5916d3420d70e4b72aea3f41b5fb8c2a8c243a` / `b4ba1df14b39b0436d5c7524a3488428de651d841f88b0adc1187c8656c2bb2b` / `6e7d05fb2023528745d902df7ec14c10baf096871389c757ec44798766019421` / `86c8e43665bbd75137a89ca9a5ae06a11898fec8b7228ffff66dcccbba71e6b6`
- fresh Daybreak Pass A QA SHA-256: `93613b984e2285187810ac97424ea7a618872a3ac65d8e7152db3294b93db620`
- Grok request / complete response / execution ledger SHA-256: `731eecd227e42e892127194070542e250e37f72e97b3babd067c0682abb26827` / `f60d47758b6943d915e505d26a0616ebaa0ddfd482d89e24ca77fa4ee2a8295b` / `9f0e10e59c2380b2bfbc0813dde36c6a6a4672bb6cab8e9e28bb96d80f4203da`
- panel status: Cursor Grok 4.6 High non-fast supplied independent non-Art Pass B; `ART_ABSTAIN`; Muse `NOT_USED`; Ox `EXCLUDED`
- excluded: stale roots and discarded Grok attempts, Gold/other-batch values, selection provenance as Factor evidence, Art inference, averaging, voting, promotion, overlay build, and source mutation

The exact Pass A files, research packet, Grok request, complete response, and
ledger were read against these hashes. Discarded attempts recorded by the Grok
ledger remain `DISCARDED_NOT_EVIDENCE`.

## Adjudication rule

- Every difference was resolved from the official entry-volume observations and
  the Dictionary anchors. Pass A and Pass B were proposals, not votes.
- Synopsis silence was never converted to zero. Zero was accepted only where
  all three official summaries affirmatively established a slow, bright, or
  low-pressure entry experience.
- A person being a professor, student, musician, spouse, or member of a village
  did not itself create a Theme. Theme rows require an observable listed
  mechanic; centrality 2 requires a repeating core structure.
- Narrative order is `progression / problemSolving / strategy / pacing /
  mysteryReveal / worldBuilding`.
- Tone order is `characterArcWeight / relationshipStructure / comedy /
  darkness / mentalStress / romance / emotionalWarmth`.
- Coverage minima are Genre `1/1`, Theme `1/1`, Narrative `4/6`, Tone
  `5/7`, and Art `2/4`. `TEXT_GATE_FAIL` below is a terminal evidence
  coverage result for this packet, not a schema failure or promotion verdict.
- All 40 Art cells remain `unknown`; this Pass C does not inspect or infer Art.

## Claim-by-claim resolution

| Pos | Final evidence resolution |
| --: | --- |
| 21 | ACCEPT `characterArcWeight=4` and `mentalStress=2`. The official [volume 2](https://e-comi.shogakukan.co.jp/books/091326380000d0000000) and [volume 3](https://e-comi.shogakukan.co.jp/books/091330270000d0000000) descriptions make cohabitation, marriage disagreement, a third party, the former lover, wavering, and the relationship conclusion the entry reward and mixed pressure. |
| 22 | ACCEPT `pacing=0`, `darkness=0`, and `mentalStress=0`; REJECT `romance=0`. The [three-volume sequence](https://magazine.jp.square-enix.com/top/comics/detail/9784757534155/) affirmatively repeats innocent ordinary days and small events with little goal/status change, but synopsis silence does not prove romance absent. |
| 23 | RETAIN Genre `fantasy;romance`; ACCEPT `worldBuilding=4`, `characterArcWeight=2`, and `darkness=2`; adjudicate `romance=3`. The [ritual, village god, 60-year rule](https://www.kodansha.co.jp/comic/products/0000046505) and [祭文/winter rite](https://www.kodansha.co.jp/comic/products/0000046557) repeatedly govern events. The married relationship is more than a subplot but shares the entry center with the ritual conflict, so neither 2 nor 4 is exact. No listed Theme is directly established. |
| 24 | ACCEPT Theme `school:1`; REJECT Genre `romance`, `romance=2`, and `emotionalWarmth=2`. The [volume-1 transfer/bullying premise](https://www.kodansha.co.jp/comic/products/0000029330) directly supports a limited school setting, while the official summaries never identify romantic love or warmth. Existing growth, bullying, hospitalization, and past-reveal cells remain. |
| 25 | ACCEPT Genre `sliceOfLife`; REJECT Theme `school:1`; RETAIN `characterArcWeight=3`. Music practice, orchestra activity, reunion, and renewed effort form a realistic activity/relationship entry genre across [volumes 1–3](https://www.shonengahosha.co.jp/book_Info.php?id=6719), but university identity alone is not a recurring school mechanic. |
| 26 | REMOVE Themes `adventure` and `exploration`; REJECT proposed `postApocalypse`; ACCEPT `politics:1`; RETAIN `survival:2`; ACCEPT `worldBuilding=4`; adjudicate `darkness=3`. Outside longing is not repeated travel/exploration, and a derelict ship plus calamity does not directly establish an apocalypse. The 30-year lifespan and calamity in [volume 2](https://www.akitashoten.co.jp/comics/4253261027) and invasion plus elders/guards in [volume 3](https://www.akitashoten.co.jp/comics/4253261035) establish survival, one political episode, repeated rules/factions, and darkness between the 2 and 4 anchors. |
| 27 | REJECT Genre `historical`; ACCEPT `mysteryReveal=2`, `characterArcWeight=2`, and `mentalStress=2`; adjudicate `romance=3`. Kingdom, slavery, and hostage status do not identify a historical period. The [hostage/poisoning entry](https://shogakukan-comic.jp/book?jdcn=091333830000d0000000) and [protector-past reveal](https://shogakukan-comic.jp/book?jdcn=091336540000d0000000) directly support mixed pressure and partial revelation; the central bond shares weight with the political-survival plot. |
| 28 | ACCEPT Genre `horror` and `darkness=4`; REMOVE Theme `survival`; retain `combat:2`. Repeated blood theft and body transformations in [volume 1](https://www.kadokawa.co.jp/product/201108000200/) through [volume 3](https://store.kadokawa.co.jp/shop/g/g311781600000/) make grotesque danger a central genre/tone. Survival is only the stake of combat, not an independently observed mechanic. |
| 29 | ACCEPT `characterArcWeight=4`; REJECT `mentalStress=2`. Lost dreams, reunion, an inherited/new dream, dance study, and a new step are the repeated character reward from [volume 1](https://e-comi.shogakukan.co.jp/books/091234450000d0000000) through [volume 3](https://e-comi.shogakukan.co.jp/books/091240770000d0000000). One hesitant supporting boy does not establish sustained entry-wide pressure. |
| 30 | ACCEPT Genre `fantasy` and `strategy=2`; RETAIN `mysteryReveal=3` rather than 4. The [volume-2 infiltration](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-870413-5) is an observed short-term tactic, and Stand/memory phenomena support fantasy. Identity investigation is central, but the official 1–3 summaries do not establish enough completed truth disclosure for the 4 reveal anchor. |

All other Pass A text cells and tags remain unchanged.

## Materialized outputs

| File | SHA-256 | Rows excluding header |
| --- | --- | --: |
| `adjudication/text-final-chunk-03.csv` | `fef2b9a117c509dec63c52ed89c3250da9891334b260ed19e4e34827b0c8e850` | 170 |
| `adjudication/genres-final-chunk-03.csv` | `7254153b4f7f296f1d3bd5818583f3f1ca01e544d31e0c1c3143bec88de1483f` | 10 |
| `adjudication/themes-final-chunk-03.csv` | `8565742fbe22b73f265857248834573c57c6a312941173eb377b62ab67d7f5d8` | 7 |

The text CSV is exact dictionary order for 10 works × 17 axes: 61 known and
109 unknown rows. Every known row has a value, confidence, and canonical
evidence ID; every unknown row has blank value/confidence. The Genre CSV has
exactly one row per work, nine non-empty. Theme rows use only direct Dictionary
IDs, centrality 1 or 2, and `ev-batch-005-a-{workId}`.

## Final vectors and gate outcome

| # | Canonical title | Narrative 6 | Tone 7 | Genre | Theme + centrality | Coverage G · Th · N · T · A | Terminal text outcome |
| --: | --- | --- | --- | --- | --- | --- | --- |
| 21 | 娚の一生 | U/U/U/2/U/U | 4/2/U/U/2/4/2 | romance | ∅ | 1/1 · 0/1 · 1/6 · 5/7 · 0/4 | `TEXT_GATE_FAIL` — Th+1, N+3 |
| 22 | リューシカ・リューシカ | U/U/U/0/U/U | U/U/U/0/0/U/U | sliceOfLife | ∅ | 1/1 · 0/1 · 1/6 · 2/7 · 0/4 | `TEXT_GATE_FAIL` — Th+1, N+3, T+3 |
| 23 | 千年万年りんごの子 | U/U/U/2/2/4 | 2/2/U/2/U/3/2 | fantasy;romance | ∅ | 1/1 · 0/1 · 3/6 · 5/7 · 0/4 | `TEXT_GATE_FAIL` — Th+1, N+1 |
| 24 | 百舌谷さん逆上する | U/U/U/2/2/U | 2/2/U/2/2/U/U | ∅ | school:1 | 0/1 · 1/1 · 2/6 · 4/7 · 0/4 | `TEXT_GATE_FAIL` — G+1, N+2, T+1 |
| 25 | 天にひびき | 2/U/U/2/U/U | 3/2/U/U/U/U/U | sliceOfLife | ∅ | 1/1 · 0/1 · 2/6 · 2/7 · 0/4 | `TEXT_GATE_FAIL` — Th+1, N+2, T+3 |
| 26 | クジラの子らは砂上に歌う | U/U/U/2/2/4 | 2/2/U/3/2/U/U | fantasy | politics:1; survival:2 | 1/1 · 1/1 · 3/6 · 4/7 · 0/4 | `TEXT_GATE_FAIL` — N+1, T+1 |
| 27 | 女王の花 | U/U/U/2/2/2 | 2/2/U/2/2/3/2 | romance | politics:2 | 1/1 · 1/1 · 3/6 · 6/7 · 0/4 | `TEXT_GATE_FAIL` — N+1 |
| 28 | 血潜り林檎と金魚鉢男 | U/U/U/2/U/2 | U/2/U/4/U/U/U | action;fantasy;horror | combat:2 | 1/1 · 1/1 · 2/6 · 2/7 · 0/4 | `TEXT_GATE_FAIL` — N+2, T+3 |
| 29 | 鉄楽レトラ | 2/U/U/2/U/U | 4/2/U/U/U/U/2 | sliceOfLife | ∅ | 1/1 · 0/1 · 2/6 · 3/7 · 0/4 | `TEXT_GATE_FAIL` — Th+1, N+2, T+2 |
| 30 | ジョジョリオン | U/2/2/2/3/2 | 2/2/U/2/2/U/U | action;fantasy;mystery | combat:1; investigation:2 | 1/1 · 1/1 · 5/6 · 4/7 · 0/4 | `TEXT_GATE_FAIL` — T+1 |

Gate totals:

| Scope | Genre | Theme | Narrative | Tone | Art | All non-Art text gates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| chunk 03 | 9/10 | 5/10 | 1/10 | 3/10 | 0/10 | 0/10 |

All ten works terminate as `TEXT_GATE_FAIL` for the current packet. This does
not imply that a known value is low and does not authorize promotion.

## Finite additional-research requirements

Further Narrative/Tone research must use an unused detailed official/rightsholder
entry source or at least two independent, eligible, range-matched reviews that
repeat a concrete observation. Genre and Theme gaps require direct support for
a legal Dictionary tag.

| Pos | Canonical title | Minimum additional evidence needed |
| --: | --- | --- |
| 21 | 娚の一生 | one direct recurring Dictionary Theme; 3 Narrative cells from progression/problemSolving/strategy/mysteryReveal/worldBuilding |
| 22 | リューシカ・リューシカ | one direct recurring Dictionary Theme; 3 Narrative cells from progression/problemSolving/strategy/mysteryReveal/worldBuilding; 3 Tone cells from characterArcWeight/relationshipStructure/comedy/romance/emotionalWarmth |
| 23 | 千年万年りんごの子 | one direct recurring Dictionary Theme; 1 Narrative cell from progression/problemSolving/strategy |
| 24 | 百舌谷さん逆上する | one legal Genre from direct entry evidence; 2 Narrative cells from progression/problemSolving/strategy/worldBuilding; 1 Tone cell from comedy/romance/emotionalWarmth |
| 25 | 天にひびき | one direct recurring Dictionary Theme; 2 Narrative cells from problemSolving/strategy/mysteryReveal/worldBuilding; 3 Tone cells from comedy/darkness/mentalStress/romance/emotionalWarmth |
| 26 | クジラの子らは砂上に歌う | 1 Narrative cell from progression/problemSolving/strategy; 1 Tone cell from comedy/romance/emotionalWarmth |
| 27 | 女王の花 | 1 Narrative cell from progression/problemSolving/strategy |
| 28 | 血潜り林檎と金魚鉢男 | 2 Narrative cells from progression/problemSolving/strategy/mysteryReveal; 3 Tone cells from characterArcWeight/comedy/mentalStress/romance/emotionalWarmth |
| 29 | 鉄楽レトラ | one direct recurring Dictionary Theme; 2 Narrative cells from problemSolving/strategy/mysteryReveal/worldBuilding; 2 Tone cells from comedy/darkness/mentalStress/romance |
| 30 | ジョジョリオン | 1 Tone cell from comedy/romance/emotionalWarmth |

Special category boundaries for finite re-search:

- position 21: a professor and rural cohabitation do not establish `school` or
  `workplace`.
- position 22: publisher wording that ordinary days feel like small adventures
  does not establish recurring `adventure` or `exploration`.
- position 23: village ritual is central, but no available Dictionary Theme
  directly names that mechanic; do not substitute `politics` or
  `historicalReconstruction`.
- position 25: university identity and music activity do not by themselves
  establish `school`, `workplace`, or `crafting`.
- position 29: dreams, dance study, and reunion do not by themselves establish a
  listed Theme.

Unused qualifying sources remain possible for these bounded routes. Therefore
neither `SOURCE_INFORMATION_UNAVAILABLE` nor `FACTOR_MODEL_INCOMPATIBLE` is
established by this adjudication.

## Final disposition

- Pass C text outputs for chunk 03 are materialized and internally complete.
- All ten works remain terminal text-coverage failures; 0/10 pass all four
  non-Art text gates.
- All 40 Art cells remain `unknown`; no Art value was adjudicated or inferred.
- No identity or adult-only safety conflict is established by the bound packet.
- No source, Pass A, research, promotion, overlay, generated catalog, or commit
  mutation was made.
