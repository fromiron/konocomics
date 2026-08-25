# Batch 005 text-gap recovery QA — chunk 03 round 2

## Scope and binding

- reviewer: Daybreak independent recovery QA/adjudicator
- reviewDate: `2026-08-25`
- reviewedByHuman: `false`
- frozen scope: positions `21–30`, exact `entry_1_3_volumes`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- round-2 recovery input SHA-256: `1e7a09fc5be364562f66ffe9a4d31dfafc57dbaf8e5642c3e53a4f0bf6979cc4`
- prior terminal text / Genre / Theme SHA-256: `fef2b9a117c509dec63c52ed89c3250da9891334b260ed19e4e34827b0c8e850` / `7254153b4f7f296f1d3bd5818583f3f1ca01e544d31e0c1c3143bec88de1483f` / `8565742fbe22b73f265857248834573c57c6a312941173eb377b62ab67d7f5d8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- prior Pass C report: `reviews/daybreak-text-adjudication-chunk-03.md`

The recovery packet, terminal text/Genre/Theme CSVs, prior Pass C report, and
Factor Dictionary were read independently. Existing known cells were not
reopened. A proposal was accepted only when its cited source directly matched the
work, edition/range, and Dictionary construct; no averaging or model vote was
used. Art remained out of scope.

## Direct source audit

| Pos | Source identity and entry-range observation | QA boundary |
| --: | --- | --- |
| 24 | [講談社 official title page](https://www.kodansha.co.jp/titles/1000004043) identifies the work itself as a violent love comedy and describes its entry relationship premise; the [official volume-3 route](https://www.kodansha.co.jp/comic/products/0000029395) is the bound ordinary edition within the evaluated range. | A publisher's explicit series classification directly supports legal Genre `comedy`. Its broad “human growth” copy does not establish a numeric progression loop. |
| 27 | [小学館 official volume 3](https://shogakukan-comic.jp/book?jdcn=091336540000d0000000) identifies the exact JDCN and says the two characters have grown and their relationship changes after the hostage transfer. | The accessible official copy does not contain the recovery packet's asserted “conquest/growth story” formulation. Natural aging and relationship change do not demonstrate repeated growth, acquisition, or mastery reward. |
| 30 | [rhの読書録](https://rhbiyori.hatenablog.jp/entry/20111222/1324532647) and [とんブロ](https://ameblo.jp/tonkottan/entry-11113578095.html) are different authors/sites, both dated `2011-12-22`, and both explicitly limit themselves to volume 1. One observes repeated self-parody and sudden gags in serious scenes; the other independently observes many gags and an overall bright tone. | The two texts are not copies and repeat a concrete bounded comedy observation. They support intermittent/recurrent comedy at 2, not comedy as the sole or dominant structure at 4. |

All three routes were rechecked on `2026-08-25`. The Kodansha direct product
page returned an access restriction to the independent fetch, so the decision
does not depend on an unverifiable product-page sentence: the separately indexed
official title page supplies the work-level Genre classification, while the
existing bound volume route supplies edition/range identity.

## Proposal decisions

| Pos | Work | Proposal | QA | Exact reason |
| --: | --- | --- | --- | --- |
| 24 | 百舌谷さん逆上する | Genre `comedy` | `ACCEPT` | The official publisher classifies the work as a love comedy and applies that classification to the entry premise. Genre does not require inferring an Axis value. |
| 27 | 女王の花 | `progression=2` | `REJECT` | The cited official page shows elapsed growth and a relationship change, but no repeated reward, acquisition, skill, or mastery structure. The recovery packet's stronger quoted formulation is not reproduced by the linked page. The cell remains `unknown`. |
| 30 | ジョジョリオン | `comedy=2` | `ACCEPT` | Two independent, range-matched volume-1 reviews repeat concrete gag observations. This meets the supplementary-review rule and the Dictionary's intermittent-comedy anchor, but not the level-4 anchor. |

Positions 21–23, 25–26, and 28–29 proposed no terminal value. Their negative
research findings were checked for category leakage: occupation, school identity,
music activity, ordinary-day wording, ritual, travel desire, blood-diving danger,
and broad “human drama/bond” copy do not by themselves create an unlisted Theme
or an unobserved numeric Axis. No additional Genre, Theme, or Axis change is
authorized.

## Materialized delta

Only the two accepted proposals were overlaid; row order and evidence identity
remain unchanged.

| File | Old row | New row |
| --- | --- | --- |
| `adjudication/genres-final-chunk-03.csv` | `work-4b4bbe8c10859c46e726,` | `work-4b4bbe8c10859c46e726,comedy` |
| `adjudication/text-final-chunk-03.csv` | `work-77008e04537e3fd889e2,comedy,unknown,,,ev-batch-005-a-work-77008e04537e3fd889e2` | `work-77008e04537e3fd889e2,comedy,known,2,0.72,ev-batch-005-a-work-77008e04537e3fd889e2` |

## Hash and reverse-substitution audit

| File | Rows excluding header | Old SHA-256 | New SHA-256 | Change |
| --- | ---: | --- | --- | --- |
| `adjudication/text-final-chunk-03.csv` | 170 | `fef2b9a117c509dec63c52ed89c3250da9891334b260ed19e4e34827b0c8e850` | `b7d4427d675f0f7097b5998c099ca5f4e4c63f4dbdc917ec64b3cf89847fde7a` | exactly one unknown row became known |
| `adjudication/genres-final-chunk-03.csv` | 10 | `7254153b4f7f296f1d3bd5818583f3f1ca01e544d31e0c1c3143bec88de1483f` | `ed6869c24e1d55a2f651ebfd1ee0191c0d2e54156c997eb09be936e877b044f6` | exactly one empty Genre row gained `comedy` |
| `adjudication/themes-final-chunk-03.csv` | 7 | `8565742fbe22b73f265857248834573c57c6a312941173eb377b62ab67d7f5d8` | `8565742fbe22b73f265857248834573c57c6a312941173eb377b62ab67d7f5d8` | byte-identical |

Reverse-substituting the one accepted text row reproduced
`fef2b9a117c509dec63c52ed89c3250da9891334b260ed19e4e34827b0c8e850`.
Reverse-substituting the one accepted Genre row reproduced
`7254153b4f7f296f1d3bd5818583f3f1ca01e544d31e0c1c3143bec88de1483f`.

## Gate recount

Coverage minima are Genre `1/1`, Theme `1/1`, Narrative `4/6`, Tone `5/7`,
and Art `2/4`.

| Pos | Canonical title | Genre | Theme | Narrative | Tone | Art | Text result |
| --: | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 21 | 娚の一生 | 1/1 | 0/1 | 1/6 | 5/7 | 0/4 | fail: Theme+1, Narrative+3 |
| 22 | リューシカ・リューシカ | 1/1 | 0/1 | 1/6 | 2/7 | 0/4 | fail: Theme+1, Narrative+3, Tone+3 |
| 23 | 千年万年りんごの子 | 1/1 | 0/1 | 3/6 | 5/7 | 0/4 | fail: Theme+1, Narrative+1 |
| 24 | 百舌谷さん逆上する | 1/1 | 1/1 | 2/6 | 4/7 | 0/4 | fail: Narrative+2, Tone+1 |
| 25 | 天にひびき | 1/1 | 0/1 | 2/6 | 2/7 | 0/4 | fail: Theme+1, Narrative+2, Tone+3 |
| 26 | クジラの子らは砂上に歌う | 1/1 | 1/1 | 3/6 | 4/7 | 0/4 | fail: Narrative+1, Tone+1 |
| 27 | 女王の花 | 1/1 | 1/1 | 3/6 | 6/7 | 0/4 | fail: Narrative+1 |
| 28 | 血潜り林檎と金魚鉢男 | 1/1 | 1/1 | 2/6 | 2/7 | 0/4 | fail: Narrative+2, Tone+3 |
| 29 | 鉄楽レトラ | 1/1 | 0/1 | 2/6 | 3/7 | 0/4 | fail: Theme+1, Narrative+2, Tone+2 |
| 30 | ジョジョリオン | 1/1 | 1/1 | 5/6 | 5/7 | 0/4 | all non-Art text gates pass |

Chunk-03 totals after this recovery QA: Genre `10/10`, Theme `5/10`,
Narrative `1/10`, Tone `4/10`, Art `0/10`, and all non-Art text gates `1/10`.
Only position 30 newly clears the complete non-Art text gate; this does not
itself authorize promotion because the Art and remaining promotion gates are
outside this review.

## Boundary

- All unaccepted proposals remain explicit `unknown`; no zero or midpoint was synthesized.
- All 40 Art rows remain outside this text review.
- No Theme, Pass A, source/provenance, packet, safety, identity, registry,
  promotion, overlay, generated catalog, eligibility, formula, Gold, commit, or
  deployment state was changed.
- No human-review claim was made.
