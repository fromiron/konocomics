# Batch 005 text-gap recovery — position 36 round 1

## Scope and non-repetition guard

- `position`: `36`
- `workId`: `work-8ff141505b0a27f8d630`
- `canonicalTitle`: `WOMBS`
- `retrievedAt`: `2026-08-25`
- `accessedAt`: `2026-08-25`
- `evaluatedRange`: `entry_1_3_volumes`
- `reviewedByHuman=false`
- Current terminal coverage supplied for this recovery: Narrative `5/6`, Tone
  `4/7`, Art `3/4`. The remaining Tone unknowns are `comedy`, `romance`, and
  `emotionalWarmth`.
- This is a research-only packet. It does not modify terminal text, Genre,
  Theme, Art, source/provenance, registry, eligibility, promotion, generated
  catalog, or recommendation code.
- The previous `romance=2` provisional proposal was not adopted. The final
  adjudication boundary is explicit: a lover left behind in the volume-1
  introduction is not, by itself, a recurring romance subplot. This round
  checks unused official volume-2/3 product material and the licensed-store
  range, but does not reuse that rejected proposal.
- No Genre inference is used. Publisher/category labels are not converted into
  a Tone value.

### Binding inputs

| file | SHA-256 |
| --- | --- |
| `frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| `manifest.json` | `3aee17575d6d10bd93071d0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| `adjudication/text-final-chunk-04.csv` (read-only input) | `300d06d0a6414db1442d2b1b37f7584a1748a4237caff54a33058d69c5d5d037` |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |

The relevant Dictionary anchors are: `comedy=2` requires intermittent comedy,
`romance=2` requires a subplot, and `emotionalWarmth=2` requires mixed warmth
and harshness. Silence is not `known 0`; an unsupported axis remains
`unknown`.

## Official publisher, award, and bookstore source ledger

All external pages below were checked on `2026-08-25`. The date of a product or
article is kept separate from `accessedAt`. Sources are bounded to volumes 1–3
or are explicitly marked as broad context.

| id | source | URL | publishedAt | accessedAt | direct, bounded support |
| --- | --- | --- | --- | --- | --- |
| `36-R1-O1` | 小学館 eコミック WOMBS 1 | https://e-comi.shogakukan.co.jp/books/091884940000d0000000 | `2015-06-26` (digital listing) | `2026-08-25` | The official page lists the first eight episode titles and introduces conscript Mana joining the transfer unit in the First/Second immigrant war. It explicitly says she left family and a lover in her hometown. This is a background relationship fact; the page does not describe recurring lover scenes, relationship choices, or a romantic subplot. |
| `36-R1-O2` | 小学館 eコミック WOMBS 2 | https://e-comi.shogakukan.co.jp/books/091885390000d0000000 | `2015-06-26` (digital listing) | `2026-08-25` | The official volume-2 description moves Mana to her first battle and an attack on the Second base, then describes her adaptation, bodily change, Almea watching, and intersecting motives. It adds no romantic interaction, warm recovery, or recurring comic frame. |
| `36-R1-O3` | 小学館 eコミック WOMBS 3 | https://e-comi.shogakukan.co.jp/books/091885830000d0000000 | `2015-06-26` (digital listing; the blocker packet records the same edition-bound viewer route as `2015-11-27`) | `2026-08-25` | The official volume-3 description says that after combat Mana becomes a `開拓者`, and that the transfer soldiers' origins and the effect of her ability on the war are gradually disclosed. It supplies arc/world/war progression, but no romantic continuation, comic pattern, or warmth/healing payoff. |
| `36-R1-O4` | 小学館 eコミック WOMBS 3 edition-bound viewer | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091885830000d0000000 | same volume-3 listing route | `2026-08-25` | The route is the unused official reader path named by the blocker packet. The accessible speed-reader shell exposes the edition identity but not a stable, text-readable scene packet in this research run; reachability is not treated as scene evidence. |
| `36-R1-O5` | 紀伊國屋書店 WOMBS 2 electronic product | https://www.kinokuniya.co.jp/f/dsg-08-EK-0259910 | `2015-06-26` | `2026-08-25` | The licensed product repeats the first-battle, base-attack, adaptation, bodily-change, Almea, and intersecting-motives description. It is a corroborating volume-2 source, not evidence of a romantic or warm subplot. |
| `36-R1-O6` | 小学館 award/news article on WOMBS | https://www.shogakukan.co.jp/news/155998 | `2017-04-24` | `2026-08-25` | The publisher's award article describes Mana as a young female soldier, the women's special unit, her fighting and conflicts, and the weight/darkness of war and human drama. This is broad series/award context, not a volume-1–3 numeric anchor; it provides no romance, comedy, or healing payoff. |

The official volume-1/2/3 descriptions therefore establish a continuous
military-SF arc: enlistment and harsh unit life, first battle/base attack, then
Mana's pioneer role and ability/origin disclosure. They do not establish a
second, recurring Tone pattern beyond the already adjudicated axes.

## Supplemental independent-review audit

These are supplemental observations only. They are not used as primary
evidence, and broad whole-series comments are not silently converted into an
entry-range factor.

| id | source | URL | review date / range | accessedAt | direct observation and limitation |
| --- | --- | --- | --- | --- | --- |
| `36-R1-S1` | コミックシーモア WOMBS 2 / series reviews | https://www.cmoa.jp/title/95829/vol/2/ | `2017-04-21` (`ちゃりこ`, `とうにゃん`); `2020-08-20` (`いちごジャム`); one reviewer states reading through volume 3 | `2026-08-25` | Named reviewers describe women's strength/sadness, women fighting to protect, and a female perspective on war/motherhood. These observations are about gendered wartime stakes and motherhood; they do not document recurring romantic interactions or a repeated healing/warmth payoff. |
| `36-R1-S2` | honto WOMBS 1 reviews | https://honto.jp/ebook/pd-review_0627220576.html | dated volume-1 reader posts including `2010-02-07`, `2010-02-13`, and `2010-02-28` | `2026-08-25` | Readers discuss the war/SF setup and women/character impressions. The page does not provide two independent, concrete observations of a recurring romance, comedy mechanism, or warmth payoff within volumes 1–3. |
| `36-R1-S3` | BookLive WOMBS 1 reviews | https://booklive.jp/review/list/title_id/319608/vol_no/001 | volume-1 review page; dated posts visible on the page | `2026-08-25` | Reviews emphasize the SF/world-building/war premise and character development. No repeated romantic subplot, comic framing, or relationship-healing pattern is directly described. |
| `36-R1-S4` | BookLive WOMBS 2 product/review surface | https://booklive.jp/product/index/title_id/319608/vol_no/002 | `2011-03-30` review record; volume 2 | `2026-08-25` | The review extends the war/SF observation into volume 2. It does not add a recurring romantic or warm relationship observation. |

The Cmoa reviews are useful negative-boundary corroboration, but they are not
treated as two qualifying entry-range reviews for a new cell: the strongest
motherhood/protection wording is a whole-series or multi-volume reading and is
not the Dictionary's “warmth/healing as reward” anchor.

## Tone axis audit

### `romance` — no route

`36-R1-O1` is direct support for the existence of a lover left in Mana's
hometown. However, `36-R1-O2` and `36-R1-O3` move the described entry arc through
combat, bodily change, pioneer work, and transfer-unit origins/war impact; they
do not return to that lover or describe romantic action. The licensed-store
volume-1–3 summaries and supplemental reviews likewise do not supply a
repeated romantic subplot. Assigning `romance=2` would therefore convert one
background fact into a subplot and would repeat the already rejected route;
`romance=4` is even less supported. Keep this axis `unknown`.

### `emotionalWarmth` — no route

Family/lover separation in O1 and reviewer observations about protecting women
or motherhood show that relationships and reproductive stakes exist, but they
do not show bonds, healing, or warmth as a recurring reward. The publisher's
award context instead bounds the entry's dominant human drama as conflict under
harsh wartime conditions. That mixed contextual reading is not enough to assign
the Dictionary's `2` without a direct warm relationship/payoff observation;
keep `emotionalWarmth` `unknown`, not `0`.

### `comedy` — no route

The volume-1 episode list includes a title translated as “Dog Day,” but a
chapter title is not a direct gag observation or a repeated comedy mechanism.
Neither the official volume-2/3 descriptions nor the eligible supplemental
reviews document intermittent or core comedy. Keep `comedy` `unknown`.

No Narrative, Genre, Theme, or Art value is proposed in this packet. Existing
accepted values are not reopened or re-rated.

## Result and handoff

`NO_ROUTE` / `NO_NEW_LEGAL_TONE_CELL`

No currently unknown Tone axis has a defensible value and confidence from the
available official entry-range evidence. Coverage remains Narrative `5/6`, Tone
`4/7`, Art `3/4`; no terminal or promotion decision changes. This negative
result does not mean any Tone value is low or zero: the three residual axes stay
`unknown` under the contract.

A future route would require either (a) a stable, edition-bound readable
volume-2/3 body packet showing repeated romantic interaction, comic framing, or
warm/healing payoff, or (b) at least two independent reviews explicitly bounded
to the first three volumes and repeating the same concrete Tone observation.
The current speed-reader shell and broad review comments do not meet that bar.

## Verification boundary

Only this research report is created by this round. No terminal, source,
generated, Art, promotion, registry, or recommendation file was changed.

```bash
git diff --check -- data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-36-round-1.md
sha256sum data/staging/catalog-expansion/batches/batch-005/research/text-gap-recovery-position-36-round-1.md
```
