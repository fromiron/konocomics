# Batch 005 text recovery round 3 — chunk 03 independent QA and adjudication

## Scope and binding

- reviewer: Daybreak independent QA/adjudicator
- reviewDate: `2026-08-25`
- reviewedByHuman: `false`
- frozen scope: positions `21–30`, exact `entry_1_3_volumes`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- round-3 recovery input SHA-256: `6edba870a61176f0e2a01d3abb2076085245aaa321fad570509c4a4a117aea45`
- prior terminal text SHA-256: `b7d4427d675f0f7097b5998c099ca5f4e4c63f4dbdc917ec64b3cf89847fde7a`
- prior round-2 QA SHA-256: `3d780d5546b8ad89910c72c6f8dcaf65f22f2b6177b6b1de400525c8655affb9`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`

The recovery packet, current terminal text/Genre/Theme CSVs, prior Pass C and
round-2 QA reports, and Factor Dictionary were read independently. The four
proposals were checked against the live source identity, entry-volume boundary,
and observable `0 / 2 / 4` anchors. A negative preference statement was not
treated as evidence that comedy was absent, and source conflict was not averaged
or decided by vote. Art remained out of scope.

## Material source audit

All routes below were rechecked on `2026-08-25`.

| Pos | Reproduced source identity | Bounded observation and QA boundary |
| --: | --- | --- |
| 22 | [MANTANWEB first-volume feature](https://mantan-web.jp/article/20100813dog00m200026000c.html), `2010-08-13`; [Sony Reader Store volume 1](https://ebookstore.sony.jp/review/title/00211004/id/BT000021100400100101); [BookLive volume 1](https://booklive.jp/review/list/title_id/211004/vol_no/001) | The first-volume feature reproduces the publisher editor's description of plentiful high-energy gags. Separately authored volume-1 reader observations describe repeated wrong-but-serious child logic and gag construction; one explicitly says the tone varies by episode. This proves recurring comedy but bounds it below the always/core anchor. |
| 24 | [Rakuten Books volume 1](https://books.rakuten.co.jp/rb/5719580/), review by `アルファ0334`, `2010-12-31`; [マンガLOG volume-2 discussion](https://m-kikuchi.hatenablog.com/entry/20090124/1232804076), `2009-01-24`; [Rakuten Kobo volume 1](https://books.rakuten.co.jp/rk/3faa6c72870938fdbc49897b04af5ed1/) | The volume-1 reader observes densely mixed tragedy and comedy and repeated laughing/crying; the independent volume-2 reader observes repeated laughter from dialogue and character dynamics while also identifying the heavy premise. Another volume-1 review calls the first book less interesting, but does not report comedy absent. The publisher's love-comedy classification corroborates identity/genre only; it was not converted directly into an Axis value. |
| 26 | [BookLive volume 1](https://booklive.jp/review/list/title_id/247331/vol_no/001), reviews dated `2024-03-11` and `2022-07-29`; [Akita Shoten volume 1](https://www.akitashoten.co.jp/comics/4253261019), `2013-12-16` | Two separately authored volume-1 observations independently identify a happy, gentle, calm community before the disruptive turn, and both retain the later cruelty or despair boundary. That is mixed warmth, not warmth as the sole reward. |
| 28 | [KADOKAWA volume 1](https://www.kadokawa.co.jp/product/201108000200/), embedded reader entries dated `2011-10-20` and `2017-07-07`; [マンバ new-edition volume 1](https://manba.co.jp/boards/57564/books/1), review posted `2017-06-14` | The 2017 reader explicitly asks whether the absurd, laughter-producing work is gag or horror. The independent Manba reader describes many comic everyday scenes against recurring horror and action. The 2011 horror observation does not contradict intermittent comedy; together the routes establish a mixed level, not comedy as the core at 4. |

## Cell decisions

| Pos | Work | Proposed cell | QA | Exact rationale |
| --: | --- | --- | --- | --- |
| 22 | リューシカ・リューシカ | `comedy=2` | `ACCEPT` | Publisher-editor first-volume copy plus separately authored bounded observations establish repeated gags. Explicit episode-to-episode variation rules out treating comedy as uniformly dominant. |
| 24 | 百舌谷さん逆上する | `comedy=2` | `ACCEPT` | The apparent conflict is about enjoyment, not the presence of comedy. Two independent entry-range readers concretely observe repeated laughter mixed with serious or tragic material. This fits “intermittent comedy” at 2 and does not support 4. |
| 26 | クジラの子らは砂上に歌う | `emotionalWarmth=2` | `ACCEPT` | Two independent volume-1 observations repeat calm, kind communal life and also the same entry volume's cruel disruption. The evidence directly matches the Dictionary's mixed anchor. |
| 28 | 血潜り林檎と金魚鉢男 | `comedy=2` | `ACCEPT` | Independent bounded readers both identify recurring comic or laughter-producing material alongside horror/action. The mixture supports 2 only. |

No other cell, Genre, or Theme was reopened. No value was inferred from a star
rating, recommendation-list membership, title, or broad genre label.

## Materialized cell delta

Only the four accepted rows were overlaid. Row order and canonical evidence IDs
remain unchanged.

| Work | Axis | Old terminal state | New terminal state |
| --- | --- | --- | --- |
| `work-238c04ae3a3a61451078` | `comedy` | `unknown` | `known,2,0.78` |
| `work-4b4bbe8c10859c46e726` | `comedy` | `unknown` | `known,2,0.70` |
| `work-5b7cf2105a4bc6f6b46c` | `emotionalWarmth` | `unknown` | `known,2,0.74` |
| `work-62fb5d8e9f6c6bbbeba9` | `comedy` | `unknown` | `known,2,0.76` |

## Hash and reverse-substitution audit

| File | Rows excluding header | Old SHA-256 | New SHA-256 | Change |
| --- | ---: | --- | --- | --- |
| `adjudication/text-final-chunk-03.csv` | 170 | `b7d4427d675f0f7097b5998c099ca5f4e4c63f4dbdc917ec64b3cf89847fde7a` | `dcb6a9accea0933e3cbfd8fb79c4670156f39b32f5099a70b0601b6351cd3f29` | exactly four unknown rows became known |
| `adjudication/genres-final-chunk-03.csv` | 10 | `ed6869c24e1d55a2f651ebfd1ee0191c0d2e54156c997eb09be936e877b044f6` | same | byte-identical |
| `adjudication/themes-final-chunk-03.csv` | 7 | `8565742fbe22b73f265857248834573c57c6a312941173eb377b62ab67d7f5d8` | same | byte-identical |

The terminal text CSV remains exactly 10 works × 17 axes: 170 rows, 66 known
and 104 unknown. Reverse-substituting only the four accepted rows reproduced
`b7d4427d675f0f7097b5998c099ca5f4e4c63f4dbdc917ec64b3cf89847fde7a`.
A direct diff contains only those four rows, and `git diff --check` passes.

## Non-Art gate recount

Coverage minima are Genre `1/1`, Theme `1/1`, Narrative `4/6`, and Tone `5/7`.
Art was neither read nor recounted by this text-only QA.

| Pos | Canonical title | Genre | Theme | Narrative | Tone | Remaining text gap |
| --: | --- | ---: | ---: | ---: | ---: | --- |
| 21 | 娚の一生 | 1/1 | 0/1 | 1/6 | 5/7 | Theme+1, Narrative+3 |
| 22 | リューシカ・リューシカ | 1/1 | 0/1 | 1/6 | 3/7 | Theme+1, Narrative+3, Tone+2 |
| 23 | 千年万年りんごの子 | 2/1 | 0/1 | 3/6 | 5/7 | Theme+1, Narrative+1 |
| 24 | 百舌谷さん逆上する | 1/1 | 1/1 | 2/6 | 5/7 | Narrative+2 |
| 25 | 天にひびき | 1/1 | 0/1 | 2/6 | 2/7 | Theme+1, Narrative+2, Tone+3 |
| 26 | クジラの子らは砂上に歌う | 1/1 | 2/1 | 3/6 | 5/7 | Narrative+1 |
| 27 | 女王の花 | 1/1 | 1/1 | 3/6 | 6/7 | Narrative+1 |
| 28 | 血潜り林檎と金魚鉢男 | 3/1 | 1/1 | 2/6 | 3/7 | Narrative+2, Tone+2 |
| 29 | 鉄楽レトラ | 1/1 | 0/1 | 2/6 | 3/7 | Theme+1, Narrative+2, Tone+2 |
| 30 | ジョジョリオン | 3/1 | 2/1 | 5/6 | 5/7 | pass |

Chunk-03 totals after round 3: Genre `10/10`, Theme `5/10`, Narrative `1/10`,
Tone `6/10`, and all non-Art text gates `1/10`. Positions 24 and 26 newly pass
the Tone gate but still fail Narrative coverage. No work is promoted by this
text-only adjudication.

## Boundary

- Unfilled cells remain explicit `unknown`; no zero or midpoint was synthesized.
- No Art, Pass A, source/provenance, safety, identity, packet, overlay, registry,
  generated artifact, eligibility, recommendation formula, Gold, commit, or
  deployment state was changed.
- No human-review claim was made.
