# Batch 004 Pass C — recovered text adjudication

## Scope and attestation

- Reviewer: Daybreak independent Pass C rerun after targeted text-gap recovery.
- Frozen manifest SHA-256: `6471599e70992b42b7be29380133be8275c6f187724eedd4a67c954d2ee3bdef`.
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`.
- Recovery inputs SHA-256, chunks 01–05: `962a24c93289d77ee3354fba7f9675598e7b900b4698893054ff64c9d376a08f`, `05e613f1630a4ac5b99aa88f8094ec43090ba6b40eb46e139b7bfdff2b93f3a6`, `6e19713e4dcb86dd1eac3cb954fd9a5ec7e733d75d581fd13e9233ca3a7b99dd`, `5d6929f9b87e98f4f7f526733c46588643888af8c7c274b9f31bd4a79a9668b0`, `eff8683fc217cbca8ab74e8146f177fe2363354961cade8cb597628c2b5d54ce`.
- Independent recovery QA SHA-256: chunks 01–03 `9f198a61fdc5f9c0f92e7ac279075f477e096cbf65ac672d230a9a154e052f0b`; chunks 04–05 `1f61f1b8dabff8de05ad0cdfd01b68f4aaed22d0656bb9e0a17059fdf1c5caf6`.
- `reviewedByHuman=false`; Muse `NOT_USED`; Ox `EXCLUDED`; Grok `ART_ABSTAIN`.
- Art is not adjudicated here. This file creates no promotion, eligibility, CSV, source, registry, generated-catalog, or Art mutation.
- The first Pass C identity, representative ISBN, and adult-only safety verdicts remain unchanged. All 50 canonical titles still match the frozen set, contain no decorative `『』`, and remain non-adult-safe under the recorded identity limitations.

## Adjudication rule

- The previous Pass C vector is frozen. Only an exact recovery cell marked `ACCEPT` by the independent QA is overlaid.
- `REJECT` proposals are not applied. `UNKNOWN` proposals terminate as `unknown`; no adjacent value is substituted. The three `ACCEPT (frozen/no-op)` cells remain unchanged.
- Applied recovery decisions: `79` new accepted cells/tags plus `3` frozen/no-op confirmations. The QA's `23` rejected proposals and `47` unknown proposals do not alter the vector.
- Narrative order: `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`.
- Tone order: `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`.
- `U` is exact state `unknown`; `0`–`4` are exact state `known` with that value. No Narrative/Tone cell is `notApplicable`.
- Coverage order is `Genre / Theme / Narrative / Tone`; minimums are `1/1`, `1/1`, `4/6`, and `5/7`.
- `TEXT_GATE_PASS` is a text-only result. It is not `recommendationVerified` and says nothing about the separate Art gate.
- `TEXT_GATE_FAIL` records terminal unknown coverage after this recovery packet. It is not a schema hard blocker unless a permitted blocker candidate is explicitly named.

## Final 50-work vectors and terminal text outcome

| # | Canonical title | Narrative 6 | Tone 7 | Genre | Theme + centrality | Coverage G · Th · N · T | Terminal text outcome |
|---:|---|---|---|---|---|---|---|
| 01 | ホストと社畜 | U/U/U/U/U/U | 2/2/U/U/2/0/4 | sliceOfLife | workplace:1 | 1/1 · 1/1 · 0/6 · 5/7 | `TEXT_GATE_FAIL` — N+4 |
| 02 | うるわしの宵の月 | U/U/U/2/U/0 | 4/2/U/U/2/4/2 | romance | school:2 | 1/1 · 1/1 · 2/6 · 5/7 | `TEXT_GATE_FAIL` — N+2 |
| 03 | 応天の門 | U/2/U/2/4/3 | 2/2/U/2/2/U/U | historical;mystery | politics:1; investigation:2; historicalReconstruction:2 | 1/1 · 1/1 · 4/6 · 4/7 | `TEXT_GATE_FAIL` — T+1 |
| 04 | のらみみ | U/U/U/2/U/2 | 3/2/2/U/U/U/3 | sliceOfLife;fantasy | foundFamily:2 | 1/1 · 1/1 · 2/6 · 4/7 | `TEXT_GATE_FAIL` — N+2, T+1 |
| 05 | ヒナまつり | U/U/U/2/U/2 | 2/2/2/2/U/U/U | action;fantasy | combat:1 | 1/1 · 1/1 · 2/6 · 4/7 | `TEXT_GATE_FAIL` — N+2, T+1 |
| 06 | 駅から5分 | U/U/U/2/U/2 | 2/4/U/U/U/2/2 | sliceOfLife | workplace:1 | 1/1 · 1/1 · 2/6 · 4/7 | `TEXT_GATE_FAIL` — N+2, T+1 |
| 07 | つらつらわらじ | U/U/U/2/2/3 | U/2/U/U/U/U/U | historical | adventure:2; politics:2; historicalReconstruction:2 | 1/1 · 1/1 · 3/6 · 1/7 | `TEXT_GATE_FAIL` — N+1, T+4 |
| 08 | ふうらい姉妹 | U/U/U/U/U/U | U/2/4/0/U/U/4 | comedy;sliceOfLife | ∅ | 1/1 · 0/1 · 0/6 · 4/7 | `TEXT_GATE_FAIL` — Th+1, N+4, T+1 |
| 09 | それでも町は廻っている | U/U/U/2/U/2 | 2/2/4/U/U/U/U | comedy;sliceOfLife | workplace:1 | 1/1 · 1/1 · 2/6 · 3/7 | `TEXT_GATE_FAIL` — N+2, T+2 |
| 10 | 青空にとおく酒浸り | U/U/U/U/U/3 | U/U/4/2/U/U/U | scienceFiction;comedy | combat:1 | 1/1 · 1/1 · 1/6 · 2/7 | `TEXT_GATE_FAIL` — N+3, T+3; `SOURCE_INFORMATION_UNAVAILABLE` withdrawn |
| 11 | Sunny | U/U/U/2/U/2 | 2/2/U/2/2/U/2 | sliceOfLife | foundFamily:2 | 1/1 · 1/1 · 2/6 · 5/7 | `TEXT_GATE_FAIL` — N+2 |
| 12 | すみれファンファーレ | U/U/U/2/U/0 | 3/2/U/2/2/U/3 | sliceOfLife | school:1 | 1/1 · 1/1 · 2/6 · 5/7 | `TEXT_GATE_FAIL` — N+2 |
| 13 | ヒーローカンパニー | U/U/U/3/U/2 | 2/2/2/U/U/U/U | action;comedy | combat:2; workplace:2 | 1/1 · 1/1 · 2/6 · 3/7 | `TEXT_GATE_FAIL` — N+2, T+2 |
| 14 | ねずみの初恋 | 2/U/U/2/2/2 | 2/2/U/2/2/4/2 | action;romance | combat:2 | 1/1 · 1/1 · 4/6 · 6/7 | `TEXT_GATE_PASS` |
| 15 | キルアオ | U/2/U/2/U/2 | 2/2/3/2/U/2/2 | action;comedy;scienceFiction | combat:2; school:2 | 1/1 · 1/1 · 3/6 · 6/7 | `TEXT_GATE_FAIL` — N+1 |
| 16 | 尾守つみきと奇日常。 | U/U/U/2/U/2 | 2/2/U/U/1/2/3 | fantasy;sliceOfLife;romance | school:2 | 1/1 · 1/1 · 2/6 · 5/7 | `TEXT_GATE_FAIL` — N+2 |
| 17 | アリスと蔵六 | 2/U/U/2/2/2 | 2/2/2/2/U/U/3 | scienceFiction;sliceOfLife | workplace:1 | 1/1 · 1/1 · 4/6 · 5/7 | `TEXT_GATE_PASS` |
| 18 | とろける鉄工所 | U/2/U/2/U/2 | 2/2/2/U/U/0/2 | sliceOfLife | crafting:2; workplace:2 | 1/1 · 1/1 · 3/6 · 5/7 | `TEXT_GATE_FAIL` — N+1 |
| 19 | 新しい上司はど天然 | U/U/U/2/U/U | 2/1/2/U/1/U/2 | comedy;sliceOfLife | workplace:2 | 1/1 · 1/1 · 1/6 · 5/7 | `TEXT_GATE_FAIL` — N+3 |
| 20 | 環と周 | 0/U/U/2/2/2 | 4/2/U/2/U/2/2 | historical;romance | revenge:1; historicalReconstruction:2 | 1/1 · 1/1 · 4/6 · 5/7 | `TEXT_GATE_PASS` |
| 21 | アンデッドアンラック | U/U/U/2/2/2 | 2/2/U/2/U/U/U | action;fantasy | combat:2 | 1/1 · 1/1 · 3/6 · 3/7 | `TEXT_GATE_FAIL` — N+1, T+2 |
| 22 | 俺物語！！ | U/U/U/2/U/U | 2/2/2/U/U/4/2 | comedy;romance | school:1 | 1/1 · 1/1 · 1/6 · 5/7 | `TEXT_GATE_FAIL` — N+3 |
| 23 | お茶にごす。 | 2/U/U/2/U/U | 4/2/U/U/U/2/2 | comedy;sliceOfLife | school:2 | 1/1 · 1/1 · 2/6 · 4/7 | `TEXT_GATE_FAIL` — N+2, T+1 |
| 24 | 黒月のイェルクナハト | U/U/U/2/U/2 | 2/2/U/U/U/4/U | action;fantasy;romance | combat:2 | 1/1 · 1/1 · 2/6 · 3/7 | `TEXT_GATE_FAIL` — N+2, T+2 |
| 25 | ルックバック | U/U/U/U/U/U | 4/2/U/U/U/U/2 | sliceOfLife | crafting:2 | 1/1 · 1/1 · 0/6 · 3/7 | `TEXT_GATE_FAIL` — N+4, T+2 |
| 26 | 夢中さ、きみに。 | U/U/U/U/U/U | U/U/2/U/U/U/U | comedy;sliceOfLife | school:2 | 1/1 · 1/1 · 0/6 · 1/7 | `TEXT_GATE_FAIL` — N+4, T+4 |
| 27 | 異世界おじさん | U/U/U/2/2/2 | 2/2/2/U/U/2/2 | fantasy;comedy;sliceOfLife | adventure:1 | 1/1 · 1/1 · 3/6 · 5/7 | `TEXT_GATE_FAIL` — N+1 |
| 28 | 思い、思われ、ふり、ふられ | U/U/U/2/2/U | 4/4/U/U/2/4/2 | sliceOfLife;romance | school:1 | 1/1 · 1/1 · 2/6 · 5/7 | `TEXT_GATE_FAIL` — N+2 |
| 29 | 式の前日 | U/U/U/U/U/U | U/U/U/U/U/U/2 | sliceOfLife | ∅ | 1/1 · 0/1 · 0/6 · 1/7 | `TEXT_GATE_FAIL` — Th+1, N+4, T+4 |
| 30 | さんすくみ | U/U/U/2/U/2 | 2/2/2/U/2/1/2 | comedy;sliceOfLife | workplace:2 | 1/1 · 1/1 · 2/6 · 6/7 | `TEXT_GATE_FAIL` — N+2 |
| 31 | 邪神の弁当屋さん | U/U/U/2/2/2 | U/2/U/U/U/U/U | fantasy;sliceOfLife | cooking:2 | 1/1 · 1/1 · 3/6 · 1/7 | `TEXT_GATE_FAIL` — N+1, T+4 |
| 32 | 働かないふたり | U/U/U/0/U/U | U/2/2/U/U/U/3 | comedy;sliceOfLife | ∅ | 1/1 · 0/1 · 1/6 · 3/7 | `TEXT_GATE_FAIL` — Th+1, N+3, T+2 |
| 33 | あした死ぬには、 | U/U/U/2/U/U | 3/2/U/2/2/1/U | sliceOfLife | workplace:1 | 1/1 · 1/1 · 1/6 · 5/7 | `TEXT_GATE_FAIL` — N+3 |
| 34 | ドカ食いダイスキ！ もちづきさん | U/U/U/2/U/U | U/U/4/U/U/U/U | comedy;sliceOfLife | ∅ | 1/1 · 0/1 · 1/6 · 1/7 | `TEXT_GATE_FAIL` — Th+1, N+3, T+4 |
| 35 | ディグイット | 2/U/U/2/U/U | 3/2/U/U/2/U/U | sports | sportsCompetition:2 | 1/1 · 1/1 · 2/6 · 3/7 | `TEXT_GATE_FAIL` — N+2, T+2 |
| 36 | 坂本ですが? | U/2/U/2/U/U | U/U/4/U/U/U/2 | comedy;sliceOfLife | school:2 | 1/1 · 1/1 · 2/6 · 2/7 | `TEXT_GATE_FAIL` — N+2, T+3 |
| 37 | 来世は他人がいい | U/U/U/2/U/2 | 3/3/2/2/2/4/U | romance | ∅ | 1/1 · 0/1 · 2/6 · 6/7 | `TEXT_GATE_FAIL` — Th+1, N+2 |
| 38 | カラオケ行こ！ | U/U/U/U/U/U | 3/2/2/U/U/U/3 | comedy;sliceOfLife | school:1 | 1/1 · 1/1 · 0/6 · 4/7 | `TEXT_GATE_FAIL` — N+4, T+1 |
| 39 | となりの猫と恋知らず | U/U/U/2/U/U | 3/2/U/U/U/4/3 | sliceOfLife;romance | school:2 | 1/1 · 1/1 · 1/6 · 4/7 | `TEXT_GATE_FAIL` — N+3, T+1 |
| 40 | カッコウの許嫁 | U/U/U/2/U/U | 3/3/2/U/U/4/3 | sliceOfLife;romance | school:2 | 1/1 · 1/1 · 1/6 · 5/7 | `TEXT_GATE_FAIL` — N+3 |
| 41 | 鵺の陰陽師 | 2/2/U/2/U/2 | 2/2/U/U/U/U/U | action;fantasy | combat:2; school:1 | 1/1 · 1/1 · 4/6 · 2/7 | `TEXT_GATE_FAIL` — T+3 |
| 42 | モテキ | U/U/U/2/U/U | 2/2/2/U/2/4/U | romance | ∅ | 1/1 · 0/1 · 1/6 · 5/7 | `FACTOR_MODEL_INCOMPATIBLE` candidate — Th+1 after finite re-search; N+3; `SOURCE_INFORMATION_UNAVAILABLE` withdrawn |
| 43 | 八雲さんは餌づけがしたい。 | 0/U/U/0/0/0 | 2/1/2/U/U/U/4 | sliceOfLife | cooking:2; sportsCompetition:1 | 1/1 · 1/1 · 4/6 · 4/7 | `TEXT_GATE_FAIL` — T+1 |
| 44 | 高嶺と花 | U/1/U/2/U/U | 2/2/2/U/U/4/2 | comedy;romance | school:1 | 1/1 · 1/1 · 2/6 · 5/7 | `TEXT_GATE_FAIL` — N+2 |
| 45 | ここは今から倫理です。 | U/2/U/2/U/U | 2/2/U/2/2/U/2 | sliceOfLife | school:2; workplace:2 | 1/1 · 1/1 · 2/6 · 5/7 | `TEXT_GATE_FAIL` — N+2 |
| 46 | さよなら絵梨 | U/U/U/3/2/U | 4/1/U/3/3/U/U | mystery | crafting:2 | 1/1 · 1/1 · 2/6 · 4/7 | `TEXT_GATE_FAIL` — N+2, T+1 |
| 47 | 極楽街 | U/U/U/2/2/2 | 2/2/U/4/2/U/U | action;fantasy;mystery | combat:2; investigation:2 | 1/1 · 1/1 · 3/6 · 4/7 | `TEXT_GATE_FAIL` — N+1, T+1 |
| 48 | アオハライド | U/U/U/2/U/U | 3/2/U/U/2/4/U | sliceOfLife;romance | school:2 | 1/1 · 1/1 · 1/6 · 4/7 | `TEXT_GATE_FAIL` — N+3, T+1 |
| 49 | 青の祓魔師 | 2/U/U/2/U/2 | 2/2/U/2/U/U/U | action;fantasy | combat:2; school:2 | 1/1 · 1/1 · 3/6 · 3/7 | `TEXT_GATE_FAIL` — N+1, T+2 |
| 50 | LOVE SO LIFE | U/U/U/2/U/U | 2/2/U/U/U/U/4 | sliceOfLife | school:1; workplace:2; foundFamily:2 | 1/1 · 1/1 · 1/6 · 3/7 | `TEXT_GATE_FAIL` — N+3, T+2 |

Gate totals: Genre `50/50`, Theme `44/50`, Narrative `6/50`, Tone `21/50`, all four non-Art text gates `3/50`.

## Exact accepted recovery evidence references

Reference notation:

- `R1`, `R2`, `R3`, `R4`, `R5` mean [recovery chunk 01](../research/text-gap-recovery-chunk-01.md), [02](../research/text-gap-recovery-chunk-02.md), [03](../research/text-gap-recovery-chunk-03.md), [04](../research/text-gap-recovery-chunk-04.md), and [05](../research/text-gap-recovery-chunk-05.md).
- `Pnn:Sx-y` means that work's numbered source-ledger entries; `Pnn:O1-3` means its official primary evidence entries 1–3. `tgr-*` is the exact source ID printed in the corresponding recovery ledger.
- QA authority is [chunks 01–03](daybreak-text-recovery-qa-chunks-01-03.md) and [chunks 04–05](daybreak-text-recovery-qa-chunks-04-05.md). Only their `ACCEPT` rows appear below.

| # | Accepted recovery overlay | Exact recovery evidence refs |
|---:|---|---|
| 01 | Theme `workplace:1`; `mentalStress=2` | `R1:P01:S1-2` |
| 02 | `mentalStress=2`; `emotionalWarmth=2` | `R1:P02:S1-3` |
| 03 | `mentalStress=2` | `R1:P03:S2-4` |
| 04 | `comedy=2` | `R1:P04:S1-3` |
| 05 | `comedy=2` | `R1:P05:S1-3` |
| 06 | Theme `workplace:1` | `R1:P06:S1-2` |
| 09 | `pacing=2` | `R1:P09:S1-2` |
| 10 | Genre `scienceFiction;comedy`; Theme `combat:1`; `worldBuilding=3`; `comedy=4`; `darkness=2` | `R1:P10:S1-6` |
| 11 | `pacing=2`; `mentalStress=2` | `R2:tgr-11-macc`; `tgr-11-jt`; `tgr-11-bl`; `tgr-11-cmoa` |
| 12 | `pacing=2`; `mentalStress=2` | `R2:tgr-12-rakuten`; `tgr-12-mangashokudo`; `tgr-12-livedoor`; `tgr-12-booklive` |
| 13 | `pacing=3`; `characterArcWeight=2`; `relationshipStructure=2` | `R2:tgr-13-sony`; `tgr-13-booklive`; `tgr-13-manba` (`tgr-13-honto` excluded by QA) |
| 14 | `mysteryReveal=2` | `R2:tgr-14-ameblo`; `tgr-14-bookmeter`; `tgr-14-booklive` |
| 15 | `problemSolving=2`; `characterArcWeight=2`; `emotionalWarmth=2` | `R2:tgr-15-aqm`; `tgr-15-hobbyforest`; official volumes 2–3 in the original packet |
| 16 | `pacing=2`; `mentalStress=1` | `R2:tgr-16-paper`; `tgr-16-booklive`; `tgr-16-sister` |
| 17 | `progression=2`; `pacing=2`; `mysteryReveal=2`; `comedy=2`; `darkness=2`; `emotionalWarmth=3` | `R2:tgr-17-booklive`; `tgr-17-cmoa`; `tgr-17-official-special`; official volume 3 |
| 18 | `problemSolving=2`; `comedy=2` | `R2:tgr-18-mangamusou`; `tgr-18-cmoa`; `tgr-18-buzz` |
| 19 | `pacing=2`; `mentalStress=1` | `R2:tgr-19-cmoa`; `tgr-19-booklive`; original official opening |
| 20 | `pacing=2` | `R2:tgr-20-note`; `tgr-20-cmoa`; official complete-volume structure (`tgr-20-reads` not required) |
| 22 | Theme `school:1`; `comedy=2`; `emotionalWarmth=2` | `R3:P22:O1-3`; Cmoa volume-1 review records in P22 |
| 23 | `emotionalWarmth=2` | `R3:P23:O1-3` |
| 24 | `worldBuilding=2` | `R3:P24:O1-3` |
| 28 | Theme `school:1` | `R3:P28:O1-3` |
| 31 | `mysteryReveal=2`; `pacing=2` | `R4:tgr-31-kodansha-123`; `tgr-31-cmoa` |
| 32 | `pacing=0`; `emotionalWarmth=3` | `R4:tgr-32-shinchosha-123`; `tgr-32-cmoa`; `tgr-32-mangasuki`¹ |
| 33 | `pacing=2` | `R4:tgr-33-ohta-123`; `tgr-33-cmoa`; `tgr-33-manba` |
| 34 | `pacing=2` | `R4:tgr-34-hakusensha-123`; `tgr-34-note`; `tgr-34-mangawatch`¹ |
| 35 | `mentalStress=2` | `R4:tgr-35-kodansha-123`; `tgr-35-booklog` |
| 36 | `problemSolving=2`; `pacing=2`; `emotionalWarmth=2` | `R4:tgr-36-kadokawa-123`; `tgr-36-buzzmanga`; `tgr-36-bulublog` |
| 37 | `worldBuilding=2` | `R4:tgr-37-kodansha-123`; `tgr-37-cmoa`; `tgr-37-matsumoto` |
| 38 | `emotionalWarmth=3` | `R4:tgr-38-kadokawa-award`; `tgr-38-note-meg`; `tgr-38-note-etou` (`tgr-38-note-kaoru` excluded) |
| 39 | `emotionalWarmth=3` | `R4:tgr-39-squareenix-123`; `tgr-39-booklive`; `tgr-39-note-haizuki` |
| 40 | `comedy=2`; `emotionalWarmth=3` | `R4:tgr-40-kodansha-123`; `tgr-40-booklive`; `tgr-40-cmoa`; `tgr-40-uharu` |
| 41 | `progression=2`; `problemSolving=2`; `characterArcWeight=2` | `R5:P41:S1-5` |
| 42 | Genre `romance`; `pacing=2`; `characterArcWeight=2`; `relationshipStructure=2`; `comedy=2`; `mentalStress=2`; `romance=4` | `R5:P42:S4-6`; publisher identity records `S1-3` |
| 43 | `comedy=2` | `R5:P43:S1-3` (`relationshipStructure=2` rejected; frozen 1 retained) |
| 44 | `problemSolving=1`; `emotionalWarmth=2` | `R5:P44:S1-3` |
| 45 | `problemSolving=2`; `pacing=2`; `darkness=2`; `emotionalWarmth=2` | `R5:P45:S1-5` |
| 46 | `mentalStress=3` | `R5:P46:S1-2` |
| 47 | `mentalStress=2` | `R5:P47:S2-3`; frozen `characterArcWeight=2` confirmed no-op |

¹ The QA accepted the cell but identified source-ledger metadata corrections before downstream overlay use: `tgr-32-mangasuki` exposes publication `2020-10-05` and update `2024-08-11`; `tgr-34-mangawatch` exposes publication `2024-10-28`. This adjudication does not edit those research ledgers.

## Final disposition

- Text-gate pass: positions `14`, `17`, and `20` (`3/50`). These remain text-only candidates; no `recommendationVerified` or promotion is asserted.
- Terminal text coverage fail: `47/50`. Unknown is not converted to zero and thresholds are unchanged.
- Position 10: the prior `SOURCE_INFORMATION_UNAVAILABLE` candidate is withdrawn because the finite recovery found reliable press, jury, and entry-review sources. It remains a real Narrative/Tone coverage failure, not a source blocker.
- Position 42: the prior `SOURCE_INFORMATION_UNAVAILABLE` candidate is withdrawn. The finite recovery establishes Genre and Tone but no Dictionary Theme; `FACTOR_MODEL_INCOMPATIBLE` is the only permitted hard-blocker candidate raised here, pending explicit product-contract adjudication. Its Narrative gate also remains at `1/6`.
- No other permitted hard blocker is established by this rerun. Their terminal outcomes are exact evidence-coverage failures, not time or priority claims.
