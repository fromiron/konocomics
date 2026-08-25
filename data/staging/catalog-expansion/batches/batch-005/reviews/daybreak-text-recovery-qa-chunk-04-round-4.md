# Batch 005 text-gap recovery QA — chunk 04 round 4

## Scope and binding

- reviewer: Daybreak independent recovery QA/adjudicator
- reviewDate / retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- frozen scope: positions `31–40`, `entry_1_3_volumes`
- adjudicated work: position 39, `work-aa6018249b7fe7e92d95`, `かよちゃんの荷物`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- round-4 recovery packet SHA-256: `53b647c82db9883e325bb4414d3ee20a706fa678136d462f7af3e54033298215`
- prior terminal Text / Genre / Theme SHA-256:
  `c8a92dc507a6caf4dc54ef7e2d602cb99d904e2c8493d3e9174c6ad85f333877` /
  `74b97438f9d055f7f283826ddcb3f1d16cc0a7ebcd2efe0f4271664bdbf78fff` /
  `8583aa7367ce234f0c2ae14a561dc2cd4c06f1262035a292b754feb2ee53bf50`

The Luna recovery packet was treated only as a proposal list. I independently
re-opened the finite official routes, the licensed edition descriptions, the
official trial, and range-bounded reviews. A setting or isolated event was not
converted into a Theme or Axis. All accepted values describe repeated traits in
the entry range; unsupported cells remain `unknown`. No Art value was reviewed
or changed.

## Independently re-opened source ledger

All sources were retrieved on `2026-08-25`.

| Source | publishedAt | Range and direct observation used |
| --- | --- | --- |
| [BookLive 新装版 上](https://booklive.jp/product/index/title_id/439092/vol_no/001) | `2017-04-27` digital release | Licensed description identifies the 30-year-old protagonist, unemployment, re-employment at a variety shop, and a compatible younger hairdresser. |
| [BookLive 新装版 下](https://booklive.jp/product/index/title_id/439092/vol_no/002) | `2017-05-03` digital release | Licensed description repeats seasonal events with friends, uncertainty about life, and an explicitly bright, positive daily-life stance without one fixed partner. |
| [コミックナタリー](https://natalie.mu/comic/news/227415) | `2017-04-04` | Confirms that the 2005–2011 serialization was collected as the upper/lower new edition and that each half contains a newly drawn episode. This is the edition bridge, not Factor evidence by itself. |
| [webDICE volume 1–2 review](http://www.webdice.jp/dice/detail/2068/index.html) | `2009-11-07 23:00` | Range-matched review repeats the variety-shop job, manager, younger hairdresser, fixed female friends, slow inner reflection, romance hints that stay secondary, deliberate lack of decisive movement, and warm/comfortable landings. HTTP was used because the current HTTPS route failed TLS. |
| [のんのんの部屋 all-three-volume review](https://nonnon4u.com/post-9413/) | `2018-12-14` | Identifies all three original volumes / 37 chapters and concretely covers the recurring workplace, manager and coworkers, friends, younger hairdresser, mutual Christmas interest, and a supportive relationship resolution. |
| [マンガ大賞 2010 selection comments](https://www.mangataisho.com/data/2010/comment2010.pdf) | `2010` | The official comment for this work characterizes its daily life as relaxed and the protagonist as not rushing, with romance treated lightly. It supports low darkness but not ordinary/fast pacing. |

## Official trial and attribution audit

The exact BookLive viewer for the upper new edition was re-opened from the
licensed product page. Its content manifest was
[`content.js`](https://d1cv2lzt22ijfr.cloudfront.net/439092/001/pub/binb/trial/content.js?dmytime=20170427150147).
It binds the author `雁須磨子`, publisher `竹書房`, and a 12-page trial whose
body segment is `baggage1 かよちゃんの荷物`, pages `p008–p011`. Those four body
pages were visibly inspected and showed the opening friend/conversation and
shopping context. They did not show a workplace sequence and were not used to
infer any Art value. The workplace decision instead relies on the repeated,
range-bounded text evidence above.

The source attribution was also corrected before adjudication. Language about
`チルヒ`, an impossible relationship, social disparity, and tragedy appears in
the next, separate Manga Taisho entry, `河内遙時代短編集 チルヒ`; it is not the
official comment for `かよちゃんの荷物`. None of that material was used for
this work. The actual official comment describes relaxed daily life and romance
as something the protagonist does not chase.

## Proposal-by-proposal adjudication

| Proposal | Result | Independent rationale |
| --- | --- | --- |
| `workplace:1` (`0.76`) | ACCEPT | The licensed upper-edition description establishes re-employment at the shop; the original-volume reviews independently repeat the manager, coworkers, and later workplace episodes. Work recurs as supporting material, but it is not the centrality-2 subject. |
| `pacing=2` (`0.68`) | REJECT | Re-employment and seasonal episode changes show events, but the entry-matched volume 1–2 review expressly emphasizes an unchanged self, detours, mannerism, and little decisive movement. Episode/location changes do not establish the Dictionary's arc-level situation-change anchor. The cell remains `unknown`, not 0. |
| `characterArcWeight=2` (`0.72`) | ACCEPT | Licensed descriptions and range-bounded reviews repeatedly center Kayo's inner stance, setbacks, work transition, and relationship choices. These are balanced with episodic relationship material, so value 2 is supported and value 4 is not. |
| `romance=2` (`0.70`) | ACCEPT | The younger hairdresser, dates, and mutual Christmas interest recur across the licensed and original-volume evidence, while the lower-edition description and review explicitly keep romance secondary. This matches a recurring subplot, not a romance-centered 4. |
| `relationshipStructure=2` (`0.70`) | ACCEPT | The official trial shows the fixed friend context, and both original-volume reviews repeat friends, the manager/coworkers, and the hairdresser as a stable supporting set. The material does not establish ensemble-distributed structure at 4. |
| `darkness=0` (`0.62`) | ACCEPT | The official selection comment, licensed lower-edition description, and two range-bounded reviews independently converge on relaxed, bright/positive, warm daily-life treatment. This supports the low/bright endpoint; the misattributed tragic comment was excluded. |

`progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`,
and `mentalStress` remain `unknown`. Re-employment is not a repeated growth
reward, ordinary choices are not constraint-driven problem solving or strategy,
and a life setback alone is not sustained psychological pressure. All four Art
axes remain `unknown`.

## Materialized outputs

| File | Before SHA-256 | After SHA-256 | Rows excluding header |
| --- | --- | --- | --: |
| `adjudication/text-final-chunk-04.csv` | `c8a92dc507a6caf4dc54ef7e2d602cb99d904e2c8493d3e9174c6ad85f333877` | `300d06d0a6414db1442d2b1b37f7584a1748a4237caff54a33058d69c5d5d037` | 170 |
| `adjudication/genres-final-chunk-04.csv` | `74b97438f9d055f7f283826ddcb3f1d16cc0a7ebcd2efe0f4271664bdbf78fff` | `74b97438f9d055f7f283826ddcb3f1d16cc0a7ebcd2efe0f4271664bdbf78fff` | 10 |
| `adjudication/themes-final-chunk-04.csv` | `8583aa7367ce234f0c2ae14a561dc2cd4c06f1262035a292b754feb2ee53bf50` | `05e30410a5b7401a2ca462c4abb3bf7a97b8023dbc8812cd82a326cfb29bb72f` | 11 |
| `art-review/chunk-04/final-art.csv` | `b93020f3f1bdbc0aad0adbc2efe9cd9254e7ecb8b678dc7bcc519dbfe60fe346` | `b93020f3f1bdbc0aad0adbc2efe9cd9254e7ecb8b678dc7bcc519dbfe60fe346` | 40 |

Four Text rows and one Theme row were accepted. Genre and Art stayed
byte-for-byte unchanged. The terminal Text table remains exactly 10 works × 17
axes: `65 known`, `105 unknown`. Reversing only the four accepted Text rows
reproduces the prior Text hash; removing only the accepted Theme row reproduces
the prior Theme hash.

## Gate recount

Coverage minima are Genre `1/1`, Theme `1/1`, Narrative `4/6`, Tone `5/7`, and
Art `3/4` when the full promotion gate is evaluated.

| Pos | Genre | Theme | Narrative | Tone | Art | Result |
| --: | --: | --: | --: | --: | --: | --- |
| 31 | 1/1 | 3/1 | 4/6 | 2/7 | 3/4 | fail — Tone |
| 32 | 2/1 | 3/1 | 2/6 | 5/7 | 3/4 | fail — Narrative |
| 33 | 2/1 | 1/1 | 1/6 | 2/7 | 0/4 | fail — Narrative, Tone, Art |
| 34 | 1/1 | 0/1 | 1/6 | 5/7 | 3/4 | fail — Theme, Narrative |
| 35 | 2/1 | 1/1 | 4/6 | 5/7 | 1/4 | fail — Art |
| 36 | 2/1 | 2/1 | 5/6 | 4/7 | 3/4 | fail — Tone |
| 37 | 2/1 | 0/1 | 1/6 | 5/7 | 3/4 | fail — Theme, Narrative |
| 38 | 2/1 | 0/1 | 1/6 | 5/7 | 0/4 | fail — Theme, Narrative, Art |
| 39 | 1/1 | 1/1 | 0/6 | 6/7 | 0/4 | fail — Narrative, Art |
| 40 | 1/1 | 0/1 | 2/6 | 5/7 | 3/4 | fail — Theme, Narrative |

Byte-derived gate totals are Genre `10/10`, Theme `6/10`, Narrative `3/10`,
Tone `7/10`, and Art `6/10`. All non-Art text gates pass for `1/10` works
(position 35); all promotion coverage gates pass for `0/10` works because
position 35 remains Art-ineligible. Position 39 gains Theme and Tone coverage
but correctly remains below Narrative and Art minima.

No Pass A, source/provenance, identity, safety, promotion, overlay, registry,
generated catalog, recommendation formula, Factor Dictionary, Gold, commit, or
deployment state was changed. No human-review claim was made.
