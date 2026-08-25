# Batch 005 text-gap recovery QA — chunk 04 round 3

## Scope and binding

- reviewer: Daybreak independent recovery QA/adjudicator
- reviewDate / retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- frozen scope: positions `31–40`, `entry_1_3_volumes`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- round-3 recovery packet SHA-256: `6cf07902145ee1337aa8e9960d021fc5772f6eb64da47d949b0554f186cabc46`
- prior terminal text / Genre / Theme SHA-256: `6108f34bcf95173e493c2a0d68eae58ef83f49de2cc373561198bb186cd032a5` / `74b97438f9d055f7f283826ddcb3f1d16cc0a7ebcd2efe0f4271664bdbf78fff` / `77f9212c341e62371e268246a19d3334c7eacc053ddb7fac1e866a7dd4cbbdcc`

The recovery packet was treated only as a proposal list. I independently
re-opened the cited official pages and entry-range reviews. No value was
inferred from title or Genre, no unknown was treated as zero, and Art was not
read or changed. The proposal's displayed position-36 Tone gain was also
recomputed from the actual terminal CSV rather than inherited.

## Independent source audit

All URLs were retrieved on `2026-08-25`.

- Position 31: Shogakukan's official [volume 3](https://shogakukan-comic.jp/book?isbn=9784091573650)
  (`2013-12-19`) identifies the continuing killer search, Setsuna's concealed
  ambition, and betrayal. Independent range-matched reviews from
  [すがちゃんねる](https://www.sugachannel.net/entry/2017/01/09/205412)
  (`2017-01-09`) and [オタわむれ](https://hanhans.hatenablog.com/entry/20131230/p2)
  (`2013-12-30`) explicitly describe the volume-3 enemy-name reveal and the
  bounded plan to seize territory through a secret deal and recruited
  assassins. The [volume-1 review](https://yamada10-07.hateblo.jp/entry/20121026/1351257521)
  (`2012-10-26`) was retained only as a boundary check and did not independently
  create a strategy value.
- Position 33: the [KADOKAWA series page](https://store.kadokawa.co.jp/shop/series/series00105801?sort=sp)
  (publication date not displayed), [BookLive volume-1 reviews](https://booklive.jp/review/list/title_id/13350/vol_no/001)
  (individual review dates include `2013-07-29`), and the cited Sony and
  retrospective pages confirm surreal gag incidents. They do not show that
  history, culture, rules, or factions are repeatedly important in the
  Dictionary sense. Repeated absurd entities are not by themselves functional
  world-building.
- Position 35: Square Enix's official [series page](https://magazine.jp.square-enix.com/biggangan/introduction/highscoregirl/)
  (page publication date not displayed; copyright `2021`) binds the ordinary
  volumes and official entry premise. The [volume-1 episode 7–9 review](https://ameblo.jp/abstract1/entry-11256902714.html)
  (`2012`, exact page date not displayed) records the arcade search, amusement
  park, separation, airport, and explicit late-volume acceleration. The
  independent [volume-3 review](https://mangablog.blog.jp/archives/8610327.html)
  (`2014-06-22`) and [猫くらげ volume-3 review](https://nekokurage.com/2019/11/05/%E3%80%90%E6%BC%AB%E7%94%BB%E3%80%91%E3%83%8F%E3%82%A4%E3%82%B9%E3%82%B3%E3%82%A2%E3%82%AC%E3%83%BC%E3%83%ABcontinue%EF%BC%93%E5%B7%BB%E3%80%90%E6%84%9F%E6%83%B3%E3%83%BB%E3%83%8D%E3%82%BF%E3%83%90/)
  (`2019-11-05`) both bind the Osaka tournament and final to volume 3. The
  [Bookworms volume-1 review](https://bookworms.jp/book/4757535120)
  (publication date not displayed) and 猫くらげ review independently describe
  opponent reading, counters, and next-move decisions. The latter plus the
  [licensed Sony volume-3 reviews](https://ebookstore.sony.jp/review/title/00194039/id/BT000037782500300301/)
  (`2016-07-25`, `2016-08-04`) also bind practice-to-win and the later study
  effort to the entry range.
- Position 36: Shogakukan's official [volume 1](https://e-comi.shogakukan.co.jp/books/091884940000d0000000)
  (`2015-06-26` digital release) binds Mana's conscription, training, rejection,
  and first deployment; official [volume 3](https://e-comi.shogakukan.co.jp/books/091885830000d0000000)
  (`2015-11-27` digital release) gives her a new pioneer role after combat.
  Independent [BookLive volume-1 reviews](https://booklive.jp/review/list/title_id/319608/vol_no/001)
  (individual dates include `2010-08-08`, `2012-01-09`) explicitly identify the
  protagonist-growth aspect. The cited Cmoa (`2017-04-21`) and
  [Sony volume-3 review page](https://ebookstore.sony.jp/review/title/10179479/id/LT000040052000475168/)
  (`2012-05-19`) were checked as supplemental range-matched observations.

## Proposal-by-proposal adjudication

| Pos | Proposal | Result | Independent rationale |
| --: | --- | --- | --- |
| 31 | `mysteryReveal=2` (`0.78`) | ACCEPT | Two independent entry reviews explicitly bind an unresolved enemy identity to its volume-3 disclosure. This is a bounded secret/reveal reward, not a copy of the `investigation` Theme. |
| 31 | `strategy=2` (`0.64`) | ACCEPT | The official volume description and detailed volume-3 review directly establish a short organization-takeover plan, secret transaction, and use of recruited killers. This reaches the value-2 short-plan anchor, not long-term strategy 4. |
| 33 | `worldBuilding=2` (`0.72`) | REJECT | The new sources repeat surreal gag elements but do not establish repeatedly important rules, history, culture, or factions. The prior unknown remains correct. |
| 35 | `tournament:1` (`0.94`) | ACCEPT | Two independent volume-3 reviews directly identify a formal Osaka event and final. It is a bounded entry event, so centrality remains 1. |
| 35 | `strategy=2` (`0.66`) | ACCEPT | Two independent bounded reviews describe opponent-pattern reading, feints/counters, and next-move choice. This is direct short-tactical planning; neither the game Genre nor the tournament itself supplies the value. |
| 35 | `pacing=3` (`0.70`) | ACCEPT | Independent volume-1 and volume-3 accounts show short-interval changes across arcade search, amusement park, airport separation, school trip, tournament, conflict, and exam goal. This is above ordinary arc change but not enough for 4. |
| 35 | `progression=2` (`0.58`) | ACCEPT | Range-matched independent observations bind practice and developed counters to a tournament win, followed by a separate self-directed study effort. This supports gradual growth at 2; the failed exam and relationship change do not justify a higher value. |
| 36 | `characterArcWeight=3` (`0.74`) | ACCEPT | Official volumes 1 and 3 bind the same protagonist's recruit-to-pioneer change, while independent entry reviews identify her growth as a major aspect. Value 3 fits between balanced event/character weight and the character-dominant endpoint. |

Positions 32, 34, and 37–40 contained no new proposal and remain byte-for-byte
unchanged. No Genre proposal was made. Six text cells and one Theme row were
accepted; one text proposal was rejected.

## Materialized outputs

| File | Before SHA-256 | After SHA-256 | Rows excluding header |
| --- | --- | --- | --: |
| `adjudication/text-final-chunk-04.csv` | `6108f34bcf95173e493c2a0d68eae58ef83f49de2cc373561198bb186cd032a5` | `c8a92dc507a6caf4dc54ef7e2d602cb99d904e2c8493d3e9174c6ad85f333877` | 170 |
| `adjudication/genres-final-chunk-04.csv` | `74b97438f9d055f7f283826ddcb3f1d16cc0a7ebcd2efe0f4271664bdbf78fff` | `74b97438f9d055f7f283826ddcb3f1d16cc0a7ebcd2efe0f4271664bdbf78fff` | 10 |
| `adjudication/themes-final-chunk-04.csv` | `77f9212c341e62371e268246a19d3334c7eacc053ddb7fac1e866a7dd4cbbdcc` | `8583aa7367ce234f0c2ae14a561dc2cd4c06f1262035a292b754feb2ee53bf50` | 10 |

The terminal text table remains exactly 10 works × 17 axes: `61 known`,
`109 unknown`. All accepted rows retain the work's canonical batch evidence ID;
unknown rows retain blank value/confidence fields.

## Gate recount

Coverage minima are Genre `1/1`, Theme `1/1`, Narrative `4/6`, and Tone `5/7`.
Art was excluded from this text adjudication.

| Pos | Genre | Theme | Narrative | Tone | Text result |
| --: | --: | --: | --: | --: | --- |
| 31 | 1/1 | 3/1 | 4/6 | 2/7 | fail — Tone |
| 32 | 2/1 | 3/1 | 2/6 | 5/7 | fail — Narrative |
| 33 | 2/1 | 1/1 | 1/6 | 2/7 | fail — Narrative, Tone |
| 34 | 1/1 | 0/1 | 1/6 | 5/7 | fail — Theme, Narrative |
| 35 | 2/1 | 1/1 | 4/6 | 5/7 | **pass** |
| 36 | 2/1 | 2/1 | 5/6 | 4/7 | fail — Tone |
| 37 | 2/1 | 0/1 | 1/6 | 5/7 | fail — Theme, Narrative |
| 38 | 2/1 | 0/1 | 1/6 | 5/7 | fail — Theme, Narrative |
| 39 | 1/1 | 0/1 | 0/6 | 2/7 | fail — Theme, Narrative, Tone |
| 40 | 1/1 | 0/1 | 2/6 | 5/7 | fail — Theme, Narrative |

Byte-derived gate totals are Genre `10/10`, Theme `5/10`, Narrative `3/10`,
Tone `6/10`, and all non-Art text gates `1/10` (position 35). Changing
position 36 from known value 2 to known value 3 improves the annotation but
does not change its Tone known-count; the recovery packet's predicted `5/7`
was an arithmetic error.

No Art, Pass A, source/provenance, identity, safety, promotion, overlay,
registry, generated catalog, formula, Gold, commit, or deployment state was
changed. No human-review claim was made.
