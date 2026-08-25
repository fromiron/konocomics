# Batch 005 position 36 text-exhaustion QA — round 1

## Scope and independent attestation

- reviewer: Daybreak independent exhaustion adjudicator
- reviewDate / retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- position / workId: `36` / `work-8ff141505b0a27f8d630`
- canonical title: `WOMBS`
- evaluated range: `entry_1_3_volumes`
- reviewed research packet:
  `research/text-gap-recovery-position-36-round-1.md`
- packet SHA-256:
  `14d573aa0148798976a50ae9b6c6592d83a6fed84e73b3653840e66f771b41c7`

This QA independently read the Factor Dictionary, the frozen work row, every
position-36 original/recovery research and Daybreak text review, the current
terminal Text/Genre/Theme rows, and final Art rows. It then reopened the cited
official volumes 1–3, the exact volume-3 reader, publisher award material, and
the enumerated bookstore/review routes. It does not modify terminal, source,
generated, registry, promotion, eligibility, blocker, or Art data.

Ponytail's minimum-change rule was applied: this file records the smallest
supported conclusion and does not manufacture a quota-closing value.

## Binding and exact gate recount

| Input | SHA-256 |
| --- | --- |
| `frozen-work-set.csv` | `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` |
| `manifest.json` | `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` |
| terminal `adjudication/text-final-chunk-04.csv` | `300d06d0a6414db1442d2b1b37f7584a1748a4237caff54a33058d69c5d5d037` |
| final `art-review/chunk-04/final-art.csv` | `b93020f3f1bdbc0aad0adbc2efe9cd9254e7ecb8b678dc7bcc519dbfe60fe346` |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |

The reviewed research packet has one clerical binding error: it prints the
manifest digest with `...93071d0ca...`; the current and independently hashed
file is `...93071c0ca...`, as recorded above. This does not change its work or
evidence scope, but the printed digest must not be copied into a blocker row.

| Gate | Current terminal evidence | Count | Result |
| --- | --- | ---: | --- |
| Genre | `action`, `scienceFiction` | `2/1` | pass |
| Theme | `combat:2`, `war:2` | `2/1` | pass |
| Narrative | all except `problemSolving` | `5/6` | pass |
| Tone | `characterArcWeight=3`, `relationshipStructure=2`, `darkness=4`, `mentalStress=3` | `4/7` | fail by 1 |
| Art | `artRealism=3`, `artDensity=3`, `visualSoftness=2`; `motionImpact=unknown` | `3/4` | pass |

The only residual Tone axes are `comedy`, `romance`, and
`emotionalWarmth`. Their Dictionary anchors require, respectively, intermittent
gags, a romantic subplot, or bonds/care/warmth as a recurring reward. Silence
is not `0`; an unsupported axis remains `unknown`.

## Official volumes 1–3 and award recheck

Every route below returned HTTP `200` and was reopened on `2026-08-25`.

| Source | Provenance and range | Reopened result for the three residual Tone axes |
| --- | --- | --- |
| [小学館 WOMBS 1](https://e-comi.shogakukan.co.jp/books/091884940000d0000000) | first-party product; volume 1; digital listing records `2015-06-26` | Mana leaves family and a lover in her hometown and enters harsh military life. This establishes a background relationship fact, not recurring romantic action, a subplot, warmth as reward, or comedy. |
| [小学館 WOMBS 2](https://e-comi.shogakukan.co.jp/books/091885390000d0000000) | first-party product; volume 2; digital listing records `2015-06-26` | First combat, base attack, bodily change, Almea's observation, and intersecting motives continue the war arc. No lover continuation, recurring gag, or warm/healing payoff is stated. |
| [小学館 WOMBS 3](https://e-comi.shogakukan.co.jp/books/091885830000d0000000) | first-party product; volume 3; digital listing records `2015-06-26` | Mana becomes a pioneer; transfer-soldier origins/abilities and their effect on war emerge. This reinforces accepted arc/world/dark material only. |
| [小学館 WOMBS 3 reader](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091885830000d0000000) | first-party, exact JDCN `091885830000d0000000`; BinB title `ＷＯＭＢＳ ３`; 11 exposed reader pages | The live reader is more usable than the research packet states. It exposes the cover/title/contents and three readable opening body pages, not merely an identity shell. The body says the soldier did not intend to return alive and felt relief at release; it then describes post-transplant loss of control, unavoidable deployment, an unending dream, and madness. This directly repeats already-known darkness/mental stress and supplies no comedy, romantic interaction, or warmth/healing reward. |
| [小学館 award/news article](https://www.shogakukan.co.jp/news/155998) | first-party award context; `2017-04-24`; broad series range, not numeric entry evidence | Female soldiers' battle/conflict, the weight/darkness of war, and human drama under harsh conditions reinforce known cells. A “strict but attractive sergeant” is characterization, not a romance subplot. |
| [紀伊國屋 WOMBS 2](https://www.kinokuniya.co.jp/f/dsg-08-EK-0259910) / [WOMBS 3](https://www.kinokuniya.co.jp/f/dsg-08-EK-0259911) | licensed products plus DokushoMeter posts; exact volumes 2 and 3 | The licensed copy repeats the publisher arc. Visible posts discuss first battle, the transferred organ as a child-like presence, madness, life-community unease, and harsh combat. Those are reproductive/body-horror observations, not a relationship reward or repeated warmth mechanism. |

The earlier finite official route named by
`reviews/daybreak-text-blocker-adjudication-chunk-04.md` is therefore completed.
The reader correction does not defeat the packet's substantive `NO_ROUTE`
result: the newly inspected body pages support only already-known axes.

## Bookstore and independent-review exhaustion

| Source family | Independence / range result | Residual-cell result |
| --- | --- | --- |
| [Comic Cmoa WOMBS 2 / series reviews](https://www.cmoa.jp/title/95829/vol/2/) | independently authored visible posts, including a reviewer who states reading through volume 3; other comments are whole-series | Women's strength/sadness, protection, war, and motherhood are stakes. They do not directly repeat romance, comedy, or bonds/healing/warmth as reward within volumes 1–3. |
| [honto WOMBS 1](https://honto.jp/ebook/pd-review_0627220576.html) | direct honto reactions coexist with rows explicitly labelled `投稿元: ブクログ` | Direct posts stay with war/SF/setting. Bklog-labelled passages cannot be counted independently from their BookLive/Sony reproductions. |
| BookLive [volume 1](https://booklive.jp/review/list/title_id/319608/vol_no/001), [volume 2](https://booklive.jp/review/list/title_id/319608/vol_no/002), and [volume 3](https://booklive.jp/review/list/title_id/319608/vol_no/003) | the relevant visible volume-2/3 posts are marked `Posted by ブクログ`; they are one syndicated provenance family | Pseudo-maternal feeling, women's pasts, trust in the sergeant, tragedy, and intersecting motives describe conflict/dread or isolated relationship facts. They do not form two independent observations of one residual mechanism. |
| [Sony WOMBS 3 reviews](https://ebookstore.sony.jp/review/title/10179479/id/LT000040052000475168/) | page identifies its review feed as powered by Bklog | “Fights like a mother” and physiological dread duplicate the syndicated family and cannot create an independent pair or emotional-warmth anchor. |

The reviewed research packet should therefore be read as
`PASS_WITH_CORRECTIONS`: its no-cell conclusion is supported, but its manifest
digest and statement that the volume-3 reader exposes no readable scene packet
are inaccurate. The packet also understates syndication: honto, BookLive, and
Sony Bklog-labelled passages are one provenance family, not three independent
routes. None of these corrections opens a legal Tone cell.

## Residual Tone adjudication

### `comedy` — keep `unknown`

No official volume description, exposed volume-3 body page, or qualifying
independent entry-range observation describes a gag or recurring comic frame.
The volume-1 chapter title `犬の日` is not scene evidence. `comedy=0` cannot be
derived from silence, while `2` or `4` has no direct support.

### `romance` — keep `unknown`

The volume-1 synopsis directly establishes that a lover was left behind. The
volume-2/3 official arc, exposed volume-3 body pages, and qualifying review
routes do not return to romantic interaction, relationship choices, or a
romantic subplot. The already rejected `romance=2` proposal remains rejected;
one background stake cannot be averaged or promoted into recurrence.

### `emotionalWarmth` — keep `unknown`

Motherhood, protection, pregnancy imagery, an organ perceived as child-like,
and trust in a sergeant are not automatically warmth. Here the direct context
is war, bodily loss of control, madness, and suicidal relief. No source repeats
bonds, care, healing, or warmth as an entry-range reward. Harshness alone cannot
justify `0`, and reproductive/body-horror subject matter cannot justify `2`.

No Genre label, overall genre impression, average, vote, or quota pressure was
used for any axis.

## Final decision

```text
decision=promotionBlocked
blockerCode=SOURCE_INFORMATION_UNAVAILABLE
reviewedByHuman=false
retrievedAt=2026-08-25
```

- `SOURCE_INFORMATION_UNAVAILABLE`: **authorized**. The exact finite
  Shogakukan volume-3 reader route named by the prior blocker adjudication is
  now inspected, alongside official volumes 1–3, publisher award context,
  licensed products, independent review systems, and the identified syndicated
  review family. None directly supports one additional legal Tone cell.
- `FACTOR_MODEL_INCOMPATIBLE`: **not authorized**. The available sources are
  excerpts and commentary, not a complete reading proving that the Dictionary
  cannot represent the work.
- Identity, safety, scope, duplicate, ISBN, Genre, Theme, Narrative, and Art
  blockers: **none**. The sole failed gate is Tone `4/7`.

### Exact blocker record

- blockerCode: `SOURCE_INFORMATION_UNAVAILABLE`
- blockerDetails: `Exact Shogakukan WOMBS volumes 1–3 products and the title/JDCN-bound volume-3 reader, the publisher award article, licensed Kinokuniya products, independent Cmoa/DokushoMeter routes, and the honto/BookLive/Sony review provenance were rechecked on 2026-08-25. The exposed volume-3 body pages directly repeat suicidal war pressure, transplant-driven loss of control, and madness, while the products and reviews repeat combat, bodily/reproductive stakes, motherhood, and already-known relationship/character material. They do not directly establish intermittent comedy, a recurring romance subplot, or bonds/care/healing/warmth as reward. Bklog-syndicated passages were counted as one provenance family; broad series remarks, chapter titles, genre labels, source silence, and averages were not converted into values. Unchanged coverage passes Genre 2/1, Theme 2/1, Narrative 5/6, and Art 3/4 but fails Tone 4/7 by one cell.`
- evidenceName: `小学館 eコミックストア — WOMBS 3 / edition-bound reader`
- evidenceUrl: `https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091885830000d0000000`
- evidencePublishedAt: `2015-06-26` (digital product listing; the reader itself is undated)
- retrievedAt: `2026-08-25`
- insufficientGroups: `Tone`
- coverageSnapshot: `Genre 2/1; Theme 2/1; Narrative 5/6; Tone 4/7; Art 3/4`
- recheckPath: `Reopen only if an exact Shogakukan volumes-1–3 product/reader exposes materially expanded readable body pages beyond the currently checked volume-3 opening, an official editor/author/award source directly documents one repeated residual Tone mechanism within volumes 1–3, or at least two newly available non-syndicated independently authored reviews with explicit volume-1–3 boundaries repeat the same concrete residual mechanism. Recheck only comedy, romance, and emotionalWarmth; require direct Dictionary-anchor support, retain unknown on silence, then rerun all five unchanged gates and independent adjudication.`

## Verification boundary

```text
reviewedByHuman=false
terminalOrSourceMutation=false
temporaryReaderImagesCommitted=false
```
