# Batch 005 Pass C — text adjudication, chunk 05

## Scope and current-root attestation

- reviewer: Daybreak independent Pass C adjudicator
- `reviewedByHuman=false`
- reviewDate: 2026-08-25
- scope: frozen positions 41–50, entry volumes 1–3
- packetCandidateSha256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifestSha256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- packetPayloadLedgerSha256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- frozenWorkSetSha256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- annotation guide SHA-256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`
- research chunk SHA-256: `cf36b8d5e6fe4a363e87d832de0079b52dd0e96ecffb2e0f96e0c4b627864710`
- Pass A factors / genres / themes / notes SHA-256: `5a2642237dcaf1f61028ec89c36b77fcc8fd0f92f9d5d6dcb0887a982bb788c0` / `320f9e0d323c29e6ae46682d2c900e0768e61e23d960cc8dff3c303c4594ee1b` / `56b70ed3ff000805399663dfc1c0aaf7747ca36de1f4b6cd008446eb9a73a243` / `8eb02630e8e98bd86631a6d6d311333b14fb89342465a4b2e905ebf867a38dbb`
- fresh Daybreak Pass A QA SHA-256: `93613b984e2285187810ac97424ea7a618872a3ac65d8e7152db3294b93db620`
- Grok request / complete response / execution ledger SHA-256: `a14d04dd6ac1bb5f008b7f83f7f4561aa4f9a90087219eb78dee742156992fb3` / `fa2b54e08b20483c827d247405fa17c24aef3b6808ce5f5eb717f516f5411f83` / `47064514e50c6c9d421b350976869fb25835e95974c9595c7374414af3ac23a0`
- panel status: Cursor Grok 4.6 High non-fast supplied independent non-Art Pass B; `ART_ABSTAIN`; Muse `NOT_USED`; Ox `EXCLUDED`
- excluded: stale roots and discarded Grok attempts, Gold/other-work values, selection provenance as Factor evidence, Art inference, averaging, voting, promotion, overlay build, and source mutation

The exact frozen packet, Pass A files, fresh QA, Grok request, complete response,
and execution ledger were independently read against these hashes. Canonical
titles are the frozen titles without decorative delimiters.

## Adjudication rule

- Official entry-volume observations and Dictionary anchors resolved each claim.
  Pass A and Pass B remained proposals rather than votes.
- Synopsis silence was never converted to zero. No new zero was assigned.
- Genre never supplied an Axis value. A setting or occupation did not create a
  Theme without a directly repeated listed mechanic.
- Narrative order is `progression / problemSolving / strategy / pacing /
  mysteryReveal / worldBuilding`.
- Tone order is `characterArcWeight / relationshipStructure / comedy /
  darkness / mentalStress / romance / emotionalWarmth`.
- Coverage minima are Genre `1/1`, Theme `1/1`, Narrative `4/6`, Tone
  `5/7`, and Art `2/4`. `TEXT_GATE_FAIL` is a terminal evidence result
  for this packet, not a schema failure, hard blocker, or promotion verdict.
- All 40 Art cells remain `unknown`; this text Pass C neither inspected nor
  inferred Art.

## Claim-by-claim resolution

| Pos | Work ID | Final evidence resolution |
| --: | --- | --- |
| 41 | `work-c50ea94bb66f72c679a2` | RETAIN Pass A and Grok agreement. The three [Shogakukan descriptions](https://shogakukan-comic.jp/book?isbn=9784091846440) support the omnibus `scienceFiction` premise, repeated occupation/function cases as `workplace:2`, and case succession as `pacing=2`; they do not establish more sustained Axis values. |
| 42 | `work-c7e065f61bb7a176ee56` | REJECT Pass A `relationshipStructure=2`; ACCEPT Grok `romance=2`. The [volume-1 official description](https://www.kodansha.co.jp/comic/products/0000029261) centers one protagonist in rotating jobs and relationships rather than a fixed party, while boyfriend and convenience-partner treatment directly establish a recurring romantic subplot. |
| 43 | `work-c8243866b7c8a6d9a2f8` | ADJUDICATE `romance=3`. Dating, the postponed first date, and the seaside date drive [volume 2](https://e-comi.shogakukan.co.jp/books/091316920000d0000000) and [volume 3](https://e-comi.shogakukan.co.jp/books/091322580000d0000000?page=1), but supernatural rites and unstable power remain co-central. Other Pass A rows remain. |
| 44 | `work-db4a0ec451d7f4ffd8b8` | RETAIN Pass A and Grok agreement. Repeated [official gag descriptions](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08865345865345315501) support `comedy=4`; temple, preschool, family, and Buddhist imagery do not directly establish a listed Theme. |
| 45 | `work-e658d3aee2e33c17aa38` | RETAIN Pass A and Grok agreement. [Volumes 2–3](https://www.shonengahosha.co.jp/book_Info.php?id=7156) make past lives and multiple eras the core `reincarnation:2` mechanism, while the packet supports no additional sustained Tone claim. |
| 46 | `work-e906b3eaa9ef9eafe23c` | RETAIN Pass A and Grok agreement. [Company founding](https://shogakukan-comic.jp/book?isbn=9784098610105), investment constraints, contest response, new businesses, and a roadmap support the four Narrative values and `workplace:2`; business is not converted into an unsupported legal Genre. |
| 47 | `work-f31a42ea4ad724acefa5` | RETAIN Pass A and Grok agreement. The [three-volume packet](https://shogakukan-comic.jp/book?isbn=9784091865007) supports invasion-era setting, school life, a two-girl core, external threat, and `darkness=2`, but not additional sustained Narrative or Tone values. |
| 48 | `work-f4bfc29a5e0a9b5148d0` | REMOVE Theme `crafting:2`; RETAIN `mentalStress=2`. The packet describes poetry composition but does not establish a repeated listed crafting mechanic. Creative karma versus happiness in [volume 1](https://www.kodansha.co.jp/comic/products/0000047330), followed by creative despair and war responsibility in [volume 3](https://www.kodansha.co.jp/comic/products/0000047407), directly establishes mixed psychological pressure. |
| 49 | `work-fb89f119251610cf1648` | REJECT Pass A `progression=2`; ACCEPT `romance=2`; RETAIN `mentalStress=2`; lower `sportsCompetition` centrality `2→1`. Returning to soccer once does not prove a repeated growth-reward loop. Substitute status, unfulfilled love, inability to score, later tears, and feelings toward Sora recur in [volume 2](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08870244870161315501) and [volume 3](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08870426870161315501). Soccer recurs, but competition itself is not proven as the entry's core structure. |
| 50 | `work-fe35a5f01946f5153eb4` | RETAIN `combat:2`; ADD `timeTravel:2`. Daily battlefield visions and explicit transformation across time and space in [volume 1](https://shogakukan-comic.jp/book?jdcn=091825290000d0000000), followed by the fortress rescue, enemy encounter, combat, and death focus in [volume 3](https://shogakukan-comic.jp/book?jdcn=091834200000d0000000), directly establish both recurring mechanisms. |

All other Pass A text cells and tags remain unchanged.

## Materialized outputs

| File | SHA-256 | Rows excluding header |
| --- | --- | --: |
| `adjudication/text-final-chunk-05.csv` | `c7d22e6718276435d672a823ef5e9755a723954418a31d0be994fe8a52dab312` | 170 |
| `adjudication/genres-final-chunk-05.csv` | `320f9e0d323c29e6ae46682d2c900e0768e61e23d960cc8dff3c303c4594ee1b` | 10 |
| `adjudication/themes-final-chunk-05.csv` | `4bffb927c1d14162a8fef8a392d8459f67bb2f47ccc893991bb3e5ec27d12afa` | 16 |

The text CSV is the exact frozen 10-work × 17-axis matrix: 42 known and 128
unknown rows. Every known row has a legal value, confidence, and canonical
evidence ID; every unknown row has blank value/confidence. The Genre CSV has
one row per frozen work. Theme rows use only Dictionary IDs, centrality 1 or 2,
canonical Theme order, and `ev-batch-005-a-{workId}`.

## Final vectors and gate outcome

| # | Canonical title | Narrative 6 | Tone 7 | Genre | Theme + centrality | Coverage G · Th · N · T · A | Terminal text outcome |
| --: | --- | --- | --- | --- | --- | --- | --- |
| 41 | 機械仕掛けの愛 | U/U/U/2/U/U | U/U/U/U/U/U/U | scienceFiction | workplace:2 | 1/1 · 1/1 · 1/6 · 0/7 · 0/4 | `TEXT_GATE_FAIL` — N+3, T+5 |
| 42 | 臨死!!江古田ちゃん | U/U/U/2/U/U | U/U/U/U/U/2/U | sliceOfLife | workplace:2 | 1/1 · 1/1 · 1/6 · 1/7 · 0/4 | `TEXT_GATE_FAIL` — N+3, T+4 |
| 43 | 町でうわさの天狗の子 | U/U/U/2/U/2 | 2/2/U/U/U/3/U | fantasy;sliceOfLife;romance | school:1 | 1/1 · 1/1 · 2/6 · 3/7 · 0/4 | `TEXT_GATE_FAIL` — N+2, T+2 |
| 44 | 万福児 | U/U/U/2/U/U | U/2/4/U/U/U/U | comedy;sliceOfLife | ∅ | 1/1 · 0/1 · 1/6 · 2/7 · 0/4 | `TEXT_GATE_FAIL` — Th+1, N+3, T+3 |
| 45 | スピリットサークル | U/U/U/2/2/2 | 2/2/U/U/U/U/U | fantasy | reincarnation:2; school:1 | 1/1 · 1/1 · 3/6 · 2/7 · 0/4 | `TEXT_GATE_FAIL` — N+1, T+3 |
| 46 | トリリオンゲーム | 2/2/2/2/U/U | U/2/U/U/U/U/U | ∅ | workplace:2 | 0/1 · 1/1 · 4/6 · 1/7 · 0/4 | `TEXT_GATE_FAIL` — G+1, T+4 |
| 47 | デッドデッドデーモンズデデデデデストラクション | U/U/U/2/U/2 | U/2/U/2/U/U/U | scienceFiction;sliceOfLife | war:1; school:1 | 1/1 · 1/1 · 2/6 · 2/7 · 0/4 | `TEXT_GATE_FAIL` — N+2, T+3 |
| 48 | 月に吠えらんねえ | U/U/U/2/U/2 | 2/2/U/2/2/U/U | fantasy | historicalReconstruction:1 | 1/1 · 1/1 · 2/6 · 4/7 · 0/4 | `TEXT_GATE_FAIL` — N+2, T+1 |
| 49 | 1/11 じゅういちぶんのいち | U/U/U/2/U/U | 2/2/U/U/2/2/2 | sports;sliceOfLife | school:1; sportsCompetition:1 | 1/1 · 1/1 · 1/6 · 5/7 · 0/4 | `TEXT_GATE_FAIL` — N+3 |
| 50 | シュトヘル | U/U/U/2/U/2 | 2/2/U/3/U/U/U | action;fantasy;historical | adventure:2; combat:2; war:2; timeTravel:2; historicalReconstruction:2 | 1/1 · 1/1 · 2/6 · 3/7 · 0/4 | `TEXT_GATE_FAIL` — N+2, T+2 |

Gate totals:

| Scope | Genre | Theme | Narrative | Tone | Art | All non-Art text gates |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| chunk 05 | 9/10 | 9/10 | 1/10 | 1/10 | 0/10 | 0/10 |

All ten works terminate as `TEXT_GATE_FAIL` for the current packet. This does
not imply that a known value is low and does not authorize promotion.

## Finite additional-research requirements

Further Narrative/Tone research must use an unused detailed official or
rights-holder entry source, or at least two independent eligible range-matched
reviews repeating a concrete observation. Genre and Theme gaps require direct
support for a legal Dictionary tag.

| Pos | Canonical title | Minimum additional text evidence needed |
| --: | --- | --- |
| 41 | 機械仕掛けの愛 | 3 Narrative cells from progression/problemSolving/strategy/mysteryReveal/worldBuilding; 5 Tone cells |
| 42 | 臨死!!江古田ちゃん | 3 Narrative cells from progression/problemSolving/strategy/mysteryReveal/worldBuilding; 4 Tone cells excluding romance |
| 43 | 町でうわさの天狗の子 | 2 Narrative cells from progression/problemSolving/strategy/mysteryReveal; 2 Tone cells from comedy/darkness/mentalStress/emotionalWarmth |
| 44 | 万福児 | one direct recurring Dictionary Theme; 3 Narrative cells from progression/problemSolving/strategy/mysteryReveal/worldBuilding; 3 Tone cells excluding relationshipStructure/comedy |
| 45 | スピリットサークル | 1 Narrative cell from progression/problemSolving/strategy; 3 Tone cells excluding characterArcWeight/relationshipStructure |
| 46 | トリリオンゲーム | one legal Genre from direct entry evidence; 4 Tone cells excluding relationshipStructure |
| 47 | デッドデッドデーモンズデデデデデストラクション | 2 Narrative cells from progression/problemSolving/strategy/mysteryReveal; 3 Tone cells excluding relationshipStructure/darkness |
| 48 | 月に吠えらんねえ | 2 Narrative cells from progression/problemSolving/strategy/mysteryReveal; 1 Tone cell from comedy/romance/emotionalWarmth |
| 49 | 1/11 じゅういちぶんのいち | 3 Narrative cells from progression/problemSolving/strategy/mysteryReveal/worldBuilding |
| 50 | シュトヘル | 2 Narrative cells from progression/problemSolving/strategy/mysteryReveal; 2 Tone cells from comedy/mentalStress/romance/emotionalWarmth |

Special category boundaries for finite re-search:

- position 44: temple, preschool age, family, and Buddhist imagery are settings
  or content and do not by themselves establish a listed Theme.
- position 46: company/business is a direct Theme mechanic but is not one of the
  ten legal Genre IDs.
- position 48: poetry composition is not promoted to `crafting` without direct
  evidence of the repeated listed mechanic.
- position 49: soccer is recurrent, but competition remains centrality 1 until
  an entry-scope source establishes competition itself as the core structure.

Unused qualifying sources remain possible for these bounded routes. Therefore
neither `SOURCE_INFORMATION_UNAVAILABLE` nor
`FACTOR_MODEL_INCOMPATIBLE` is established by this adjudication.

## Final disposition

- Pass C text outputs for chunk 05 are materialized and internally complete.
- All ten works currently fail one or more non-Art text gates; 0/10 pass all
  four non-Art text gates.
- All 40 Art cells remain `unknown`; no Art value was adjudicated or inferred.
- No identity or adult-only safety conflict is established by the bound packet.
- No source, Pass A, research, promotion, overlay, generated catalog, or commit
  mutation was made.
