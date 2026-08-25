# Batch 005 text recovery independent QA — position 26 round 2

- reviewDate: `2026-08-25`
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- scope: Batch 005 position `26`, `work-5b7cf2105a4bc6f6b46c`, `クジラの子らは砂上に歌う`
- evaluationRange: `entry_1_3_volumes`; numeric decision uses the official volume 1 ARC body only
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- recovery proposal SHA-256: `6ed084ea24d4401365c2e8f2d0211ee90dd8121ddef1bd0252602d17394a5682`
- prior terminal text SHA-256: `dcb6a9accea0933e3cbfd8fb79c4670156f39b32f5099a70b0601b6351cd3f29`
- terminal Art SHA-256: `f495bc0bfa6719a85cd8870cb855fb2a2f64bedf0b00c3a5a806ffe84eee53bf`

The proposal was not inherited. The four original JPEGs were fetched again from
the official ARC URLs, opened at their original `1450×2057` resolution, and
compared byte-for-byte with the retained temporary captures. The official volume
1 product page still links the ARC reader, and the episode JSON still identifies
the title, creator, `volume=1`, and 45-page sequence.

## Source and pixel audit

| Ref | Official URL | Published / route date | SHA-256 | Independent observation |
| --- | --- | --- | --- | --- |
| product | https://www.akitashoten.co.jp/comics/4253261019 | `2013-12-16` | direct ARC link rechecked | Standard volume 1, ISBN `9784253261012`, links the first-party ARC reader. |
| episode JSON | https://arc.akitashoten.co.jp/comics/kojiranoko/1.json | created `2013-12-12`; updated `2015-06-15` | `8569535d979bc9f4a5368c46e692ff1133dba0ace2b3d27a180934925989dcf2` | Identifies `クジラの子らは砂上に歌う`, 梅田阿比, volume 1, and 45 ordered pages. |
| `arc-page-30` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/30?style=pc | official volume 1 route | `3228bf62467ed56bf2cf336646eda29544f9a0d6b0998af67b0163194118163a` | The council derives an approximately five-day reconnaissance window from records, orders a scout party by the next day, sequences supply procurement after safety confirmation, and delegates member selection with a deadline. |
| `arc-page-31` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/31?style=pc | official volume 1 route | `041614b6bcd9c28af134623a376d1d7556a6b2ee149e7579204773e4749d88e2` | The selected party arrives and discusses the risk of one member's inclusion and the trust behind that personnel choice. |
| `arc-page-32` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/32?style=pc | official volume 1 route | `7ea83df3fea867b0bbacaf41e7947b29b8027fb6c4083c152c8dd91b1149d1ed` | The route exposes operational constraints: people and cargo sink without thymia, propulsion consumes endurance comparable to sprinting, and this limits range. |
| `arc-page-33` | https://arc.akitashoten.co.jp/comics/kojiranoko/1/33?style=pc | official volume 1 route | `ee3d2c68eeae80ff127f0fd8d13418cc8e693dc3bdc9fb6ae81b660e1e37c4a2` | During execution, the group explicitly prioritizes reconnaissance and defers hunting, preserving the mission sequence rather than reacting opportunistically. |

## Independent decision

**ACCEPT `strategy=known 2`, confidence `0.84`.** Pages 30–33 show more than a
single reaction: a time window is calculated from records, reconnaissance is
ordered before procurement, personnel selection is delegated and executed, the
travel/resource constraints are made explicit, and the field party preserves the
reconnaissance priority. This directly matches the Dictionary's short-term
tactical-planning anchor.

The same evidence does not support `strategy=4`: it is one bounded mission, not a
sustained long-term planning, war, political, or resource-management loop.
`problemSolving` and `progression` remain `unknown`; the constraint exposition is
not a repeated clever-solution process and no growth/reward loop is shown.

## Terminal patch and gates

Only the existing strategy row changed:

```text
work-5b7cf2105a4bc6f6b46c,strategy,unknown,,,ev-batch-005-a-work-5b7cf2105a4bc6f6b46c
→ work-5b7cf2105a4bc6f6b46c,strategy,known,2,0.84,ev-batch-005-a-work-5b7cf2105a4bc6f6b46c
```

- terminal text: 170 data rows, 10 works, exactly 17 axes per work
- terminal text SHA-256 after patch: `93fb420cefad1eac48a2191c7e1f558a935d21b2b716f242a9d2de6a16530089`
- position 26 gates: Genre `1/1`, Theme `2/1`, Narrative `4/6`, Tone `5/7`, Art `4/4`
- position 26 result: all five promotion coverage gates pass
- chunk 03 gate totals after patch: Genre `10/10`, Theme `5/10`, Narrative `2/10`, Tone `6/10`, Art `7/10`
- chunk 03 all-gate positions: `26`, `30`

No Art row, source/generated catalog, promotion record, registry, Gold work, Factor
Dictionary, or recommendation formula was changed.
