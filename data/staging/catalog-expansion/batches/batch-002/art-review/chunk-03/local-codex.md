# Batch 002 Art review chunk 03 — Local Codex blind pass

- Reviewer: Local Codex subagent with direct access to the selected pixels
- Assessed: 2026-08-23
- Scope: frozen Batch 002 positions 21–30 and entry volumes 1–3 or the first major episode
- Frozen manifest SHA-256: `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6`
- Preflight SHA-256: `1f5444994829de49ad00b2a60281f3514e336c16e5160edf431c51dea11067ae`
- Inputs: Factor Dictionary v1, Batch 002 annotation/review/adjudication request, chunk-03 preflight, and the 24 selected pixel captures only
- Blindness: no Gemini conclusion or response was opened
- Human provenance: `reviewedByHuman=false`

## Pixel and hash verification

The preflight's 24 selected SHA-256 values were recomputed against `/tmp/batch002-art-preflight-chunk03.6Zlsbu` before review. All 24 matched. Only those captures were inspected; covers, animation, synopsis material, user opinion, and unselected debug captures were excluded.

| Work                                       | Evidence ID             | Selected captures                     | Hash result |
| ------------------------------------------ | ----------------------- | ------------------------------------- | ----------- |
| work-5e20323e014d6d390aaf あさひなぐ       | art-b002-c03-w22-pixels | asahinagu reader steps 05 12 and 19   | 3 of 3      |
| work-5ebbc9bede841d2faf7b 高台家の人々     | art-b002-c03-w23-pixels | kodai reader steps 05 12 and 19       | 3 of 3      |
| work-6f849a8e785deee3d5dc 怪物事変         | art-b002-c03-w24-pixels | kemonojihen reader steps 05 12 and 19 | 3 of 3      |
| work-71e824df2e6bc2125294 SAKAMOTO DAYS    | art-b002-c03-w25-pixels | p010-p011 p024-p025 and p038-p039     | 3 of 3      |
| work-7975d62582a89492a35f 図書館の大魔術師 | art-b002-c03-w26-pixels | toshokan reader steps 05 09 and 12    | 3 of 3      |
| work-7d259c925286a9f91310 聖☆おにいさん    | art-b002-c03-w27-pixels | saint reader steps 06 08 and 10       | 3 of 3      |
| work-8147aefccc365b0ecb4d 黒執事           | art-b002-c03-w28-pixels | kuro reader controls 04 11 and 18     | 3 of 3      |
| work-838a6f0ad2d1ef487588 信長協奏曲       | art-b002-c03-w29-pixels | p006-p007 p020-p021 and p034-p035     | 3 of 3      |

## Static Art decisions

Values follow the Dictionary's 0 and 2 and 4 anchors. Values 1 and 3 are used only between anchors.

| Work                                       | Contexts | `artRealism` | `artDensity` | `visualSoftness` | Static refs                       |
| ------------------------------------------ | -------: | -----------: | -----------: | ---------------: | --------------------------------- |
| work-5e20323e014d6d390aaf あさひなぐ       |        3 |    3 at 0.86 |    2 at 0.84 |        2 at 0.82 | reader steps 05 12 and 19         |
| work-5ebbc9bede841d2faf7b 高台家の人々     |        3 |    2 at 0.85 |    1 at 0.88 |        3 at 0.87 | reader steps 05 12 and 19         |
| work-6f849a8e785deee3d5dc 怪物事変         |        3 |    2 at 0.86 |    2 at 0.84 |        1 at 0.85 | reader steps 05 12 and 19         |
| work-71e824df2e6bc2125294 SAKAMOTO DAYS    |        3 |    3 at 0.88 |    3 at 0.87 |        1 at 0.86 | p010-p011 p024-p025 and p038-p039 |
| work-7975d62582a89492a35f 図書館の大魔術師 |        3 |    3 at 0.90 |    4 at 0.95 |        2 at 0.84 | reader steps 05 09 and 12         |
| work-7d259c925286a9f91310 聖☆おにいさん    |        3 |    2 at 0.86 |    2 at 0.84 |        1 at 0.83 | reader steps 06 08 and 10         |
| work-8147aefccc365b0ecb4d 黒執事           |        3 |    2 at 0.85 |    2 at 0.82 |        3 at 0.88 | reader controls 04 11 and 18      |
| work-838a6f0ad2d1ef487588 信長協奏曲       |        3 |    3 at 0.88 |    3 at 0.86 |        1 at 0.87 | p006-p007 p020-p021 and p034-p035 |

## Edition and Evidence ledger

| Work                                           | Edition/sample result                                                             | Art closure                                          |
| ---------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| work-5cafd57db6b870a71a05 機動警察パトレイバー | Standard vol1 is not officially bridged to frozen wide-edition ISBN 9784091247216 | Four axes `unknown`; no pixels opened and no blocker |
| work-5e20323e014d6d390aaf あさひなぐ           | Mapped vol1; six pages and three contexts                                         | Three static axes known; motion `unknown`            |
| work-5ebbc9bede841d2faf7b 高台家の人々         | Mapped vol1; six pages and three contexts                                         | Three static axes known; motion `unknown`            |
| work-6f849a8e785deee3d5dc 怪物事変             | Mapped vol1; six pages and three contexts                                         | Three static axes known; motion `unknown`            |
| work-71e824df2e6bc2125294 SAKAMOTO DAYS        | Mapped vol1; six pages and three contexts                                         | Three static axes known; p010-p011 motion known      |
| work-7975d62582a89492a35f 図書館の大魔術師     | Mapped vol1; six pages and three contexts                                         | Three static axes known; motion `unknown`            |
| work-7d259c925286a9f91310 聖☆おにいさん        | Mapped vol1; six pages and three contexts                                         | Three static axes known; motion `unknown`            |
| work-8147aefccc365b0ecb4d 黒執事               | Product-linked first episode; six pages and three contexts                        | Three static axes known; motion `unknown`            |
| work-838a6f0ad2d1ef487588 信長協奏曲           | Mapped vol1; six pages and three contexts                                         | Three static axes known; motion `unknown`            |
| work-83fc3c4366e51b35b821 風と木の詩           | Hakusensha bunko is not officially bridged to frozen Flower Comics ISBN           | Four axes `unknown`; no pixels opened and no blocker |

## Motion gate result

Only `SAKAMOTO DAYS` passed the separate motion sequence gate. In p010–p011 the attack begins with gunfire, continues through an evasive advance in a low-perspective speed-line panel, reaches the impact, and closes on visible aftermath. This exact bounded sequence supports `motionImpact=known 4` at confidence `0.92`.

The other seven sampled works remain `motionImpact=unknown`: none of their selected pages supplies exact continuous start, development or impact, and endpoint references. `機動警察パトレイバー` and `風と木の詩` are also `unknown` because no edition-valid pixels were opened. No `notApplicable` state was inferred from a six-page sample.

## Extrema and uncertainty

- `図書館の大魔術師 artDensity=4` is supported by repeated intricate textiles, equipment, architecture, crowds, and surface hatching in all three contexts.
- `SAKAMOTO DAYS motionImpact=4` is supported only by the exact p010–p011 bounded sequence. No other motion value was inferred.
- No other axis received 0 or 4. Between-anchor values 1 and 3 were used where the pixels consistently sat between Dictionary anchors.
- Output totals are 40 axis rows: 25 known and 15 unknown. The unknown total consists of nine motion rows plus six static rows for the two edition-unresolved works.
- Art `unknown` is not a low value and none of these closures is a promotion blocker.
