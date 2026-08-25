# Batch 005 text-gap recovery — chunk 03, round 4

## Scope and binding

- 조회일: `2026-08-25`
- 대상: `batch-005/frozen-work-set.csv` positions `21–30` only
- 평가 범위: `entry_1_3_volumes` (초반 1–3권 또는 해당 권에 직접 한정된 자료)
- `reviewedByHuman=false`
- repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- current terminal text SHA-256: `dcb6a9accea0933e3cbfd8fb79c4670156f39b32f5099a70b0601b6351cd3f29`
- batch payload SHA-256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- prior round-3 research SHA-256: `6edba870a61176f0e2a01d3abb2076085245aaa321fad570509c4a4a117aea45`
- prior round-3 QA SHA-256: `0faeea06098dcedbd3043d30c0e038c48fc2474c71e2be517d85e06da0a2f1d4`

This packet is research-only. It does not modify the terminal CSV, Genre/Theme
CSV, Pass A/B/C files, source/provenance, Art, safety, identity, promotion,
registry, generated catalog, eligibility, Gold data, or recommendation code.
Round-3 accepted cells are treated as final for this packet. Round-3 rejected
and no-op cells are not reopened. No new direct proposal met the required
threshold in this round; every position therefore has an explicit exhaustion
record below rather than an invented midpoint or a re-proposal.

The official/rightsholder route was checked first for each position. Reader
reviews were considered only when the page identity and entry-volume boundary
were concrete. BookLive, Sony Reader, and similar pages were marked as
syndicated when their text was attributable to the same Bklog feed; they were
not counted as independent observations against one another. Ratings,
popularity, list membership, title wording, and broad genre labels were not
used as Factor evidence. Art remained out of scope.

## Current terminal gaps

The latest terminal is authoritative. The remaining text gaps are:

| Pos | Work | Remaining gap after round 3 QA | Round-4 result |
| --: | --- | --- | --- |
| 21 | 娚の一生 | Theme + 3 Narrative | Exact exhaustion; no new cell |
| 22 | リューシカ・リューシカ | Theme + 3 Narrative + 2 Tone | Exact exhaustion; no new cell |
| 23 | 千年万年りんごの子 | Theme + 1 Narrative | Exact exhaustion; no new cell |
| 24 | 百舌谷さん逆上する | 2 Narrative | Exact exhaustion; no new cell |
| 25 | 天にひびき | Theme + 2 Narrative + 3 Tone | Exact exhaustion; no new cell |
| 26 | クジラの子らは砂上に歌う | 1 Narrative | Exact exhaustion; no new cell |
| 27 | 女王の花 | 1 Narrative | Exact exhaustion; rejected progression is not reopened |
| 28 | 血潜り林檎と金魚鉢男 | 2 Narrative + 2 Tone | Exact exhaustion; no new cell |
| 29 | 鉄楽レトラ | Theme + 2 Narrative + 2 Tone | Exact exhaustion; rejected mentalStress is not reopened |
| 30 | ジョジョリオン | 1 Tone | Exact exhaustion; no new cell |

## Official-first route audit

The following official routes were checked before reader material. Dates are
publication dates where the page supplied one; `date not stated` is preserved
when the page did not expose a date. Every route is limited to the first three
volumes unless otherwise stated.

| Pos | Official/rightsholder routes checked | What the entry range establishes | Why it does not create a new legal cell |
| --: | --- | --- | --- |
| 21 | Shogakukan e-comi [vol.1](https://e-comi.shogakukan.co.jp/books/091322690000d0000000), [vol.2](https://e-comi.shogakukan.co.jp/books/091326380000d0000000), [vol.3](https://e-comi.shogakukan.co.jp/books/091330270000d0000000) | Mature cohabitation, marriage disagreement, a third person and a former lover recur in the entry relationship arc. | These are relationship/romance facts already covered by the terminal. They do not supply a listed Theme or the repeated growth, constraint-solving, long-term planning, or revelation loop required for a fresh Narrative cell. |
| 22 | Square Enix [vol.1](https://magazine.jp.square-enix.com/top/comics/detail/9784757529083/), [vol.2](https://magazine.jp.square-enix.com/top/comics/detail/9784757532311/), [vol.3](https://magazine.jp.square-enix.com/top/comics/detail/9784757534155/); Cmoa editorial title route [vol.1–3](https://www.cmoa.jp/title/65391/) | Ordinary sibling-household days and small imagined/observed events recur; the official route does not present a sustained objective, clue chain, romance arc, or formal world rule. | Sibling cohabitation is not enough for a legal Theme, and imagined objects are not automatically `mysteryReveal`, `worldBuilding`, `adventure`, or `exploration`. No new Tone value is safely established from official copy alone. |
| 23 | Kodansha [vol.1](https://www.kodansha.co.jp/comic/products/0000046459), [vol.2](https://www.kodansha.co.jp/comic/products/0000046505), [vol.3](https://www.kodansha.co.jp/comic/products/0000046557) | Village god/ritual rules, the 60-year condition, the married pair, and the winter rite repeatedly govern the opening conflict. | Ritual/folk belief is not a directly named Dictionary Theme. The existing `worldBuilding`, `characterArcWeight`, `darkness`, and romance decisions already cover the supported entry facts; no additional progression/problem-solving/strategy anchor is direct enough. |
| 24 | Kodansha [vol.1](https://www.kodansha.co.jp/comic/products/0000029330), [vol.2](https://www.kodansha.co.jp/comic/products/0000029364), [vol.3](https://www.kodansha.co.jp/comic/products/0000029395) | Transfer, bullying, hospitalization, past disclosure, and repeated character dialogue are present; current Genre/Theme/Tone are already resolved by prior QA. | The opening incidents are interpersonal reactions, not constraint analysis or strategic planning. No new Narrative cell meets the 0/2/4 anchors. |
| 25 | Shonengahosha [vol.1](https://www.shonengahosha.co.jp/book_Info.php?id=6719), [vol.2](https://www.shonengahosha.co.jp/book_Info.php?id=6369), [vol.3](https://www.shonengahosha.co.jp/book_Info.php?id=6619) | Orchestra/rehearsal/performance activity, university context, reunion, and renewed effort recur across the entry volumes. | University identity is not automatically the `school` Theme, and music practice is not the listed `crafting` Theme. No repeated clue, tactical solution, long-term plan, romance center, or sustained mental-pressure pattern is explicit enough for a new cell. |
| 26 | Akita Shoten [vol.1](https://www.akitashoten.co.jp/comics/4253261019), [vol.2](https://www.akitashoten.co.jp/comics/4253261027), [vol.3](https://www.akitashoten.co.jp/comics/4253261035) | Closed-world rules, the calamity, lifespan information, invasion, elders/guards, and communal survival remain the opening structure. | `survival`, `politics`, `worldBuilding`, `darkness`, and `emotionalWarmth` already reflect the admissible facts. Discovery, survival, and crisis alone do not prove progression, clever problem solving, or strategy. |
| 27 | Shogakukan [vol.1](https://shogakukan-comic.jp/book?jdcn=091320090000d0000000), [vol.2](https://shogakukan-comic.jp/book?jdcn=091333830000d0000000), [vol.3](https://shogakukan-comic.jp/book?jdcn=091336540000d0000000) | Kingdom, hostage status, poisoning, protector history, and partial truth disclosure recur in the opening volumes. | `progression` was explicitly rejected in the prior rounds and is not reopened. Hostage movement and relationship change do not show the repeated growth/reward or an explicit tactical/planning loop needed for a remaining Narrative cell. |
| 28 | KADOKAWA [vol.1](https://www.kadokawa.co.jp/product/201108000200/), [vol.2](https://www.kadokawa.co.jp/product/201111000282/), store route [vol.3](https://store.kadokawa.co.jp/shop/g/g311781600000/) | Blood theft, bodily transformation, rescue/combat, recurring horror danger, and comic interruption continue through the entry range. | `combat`, `horror`, `darkness`, and `comedy` already cover the admissible pattern. Direct missions and rescue are action, not repeated constraint analysis or long-term strategy; no fresh Tone cell meets the evidence threshold. |
| 29 | Shogakukan e-comi [vol.1](https://e-comi.shogakukan.co.jp/books/091234450000d0000000), [vol.2](https://e-comi.shogakukan.co.jp/books/091236160000d0000000), [vol.3](https://e-comi.shogakukan.co.jp/books/091240770000d0000000) | Lost dreams, reunion, an inherited/new dream, dance study, and a new step form the opening character arc. | The terminal already has `characterArcWeight=4` and `emotionalWarmth=2`; dreams/dance/reunion do not directly establish a listed Theme, a strategy/problem-solving loop, or additional Tone. `mentalStress=2` was rejected and is not reopened. |
| 30 | Shueisha [vol.1](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-870311-4), [vol.2](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-870413-5), [vol.3](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-870526-2) | Identity investigation, Stand/memory phenomena, and a short-term infiltration tactic are already captured by the current Genre, Theme, `strategy=2`, and `mysteryReveal=3`. | The remaining Tone candidates are not directly supported by an entry-range recurring romance, warmth, or additional comedy structure; the known comedy cell is not reopened. |

### Official publication-date manifest

All official routes in the preceding table were retrieved on `2026-08-25`.
The following dates are the paper-volume publication dates recorded in the
existing official source packet (the linked pages are the official digital or
publisher volume routes):

| Pos | Vol.1 | Vol.2 | Vol.3 |
| --: | --- | --- | --- |
| 21 | Shogakukan, `2009-03-10` | Shogakukan, `2009-10-09` | Shogakukan, `2010-03-10` |
| 22 | Square Enix, `2010-06-22` | Square Enix, `2011-05-21` | Square Enix, `2011-11-22` |
| 23 | Kodansha, `2012-07-06` | Kodansha, `2013-05-07` | Kodansha, `2014-03-07` |
| 24 | Kodansha, `2008-06-23` | Kodansha, `2009-01-23` | Kodansha, `2009-07-23` |
| 25 | Shonengahosha, `2009-12-28` | Shonengahosha, `2010-07-17` | Shonengahosha, `2011-01-29` |
| 26 | Akita Shoten, `2013-12-16` | Akita Shoten, `2014-04-16` | Akita Shoten, `2014-09-16` |
| 27 | Shogakukan, `2008-08-26` | Shogakukan, `2010-07-26` | Shogakukan, `2011-01-26` |
| 28 | KADOKAWA, `2011-10-15` | KADOKAWA, `2012-02-15` | KADOKAWA Store, `2012-12-15` |
| 29 | Shogakukan, `2011-10-12` | Shogakukan, `2012-04-12` | Shogakukan, `2012-11-12` |
| 30 | Shueisha, `2011-12-19` | Shueisha, `2012-04-19` | Shueisha, `2012-09-19` |

## Independent entry-range review audit

The table records at least two separately authored routes where available. A
route is not counted as independent when it reproduces the Bklog text already
shown on another store. Reviews that are series-level, read beyond volume 3,
or lack a volume boundary are retained as negative audit evidence only; they
cannot create a new cell.

| Pos | Independent route(s), date | Concrete bounded observation | Result against remaining gaps |
| --: | --- | --- | --- |
| 21 | [BookLive vol.1](https://booklive.jp/review/list/title_id/183417/vol_no/001), ブクログ entry `2013-03-28`; [Goodreads vol.1](https://www.goodreads.com/book/show/6646300-1-otoko-no-issh-1), `Sho`, `2011-10-30` | Both describe an adult age-gap relationship with calm domestic/mature-romance emphasis; neither reports a repeated clue, tactic, plan, or listed Theme mechanic. | Corroborates known romance/relationship cells only. The BookLive text is syndicated Bklog; it is not counted as independent from other Bklog copies. No fresh cell. |
| 22 | [Honto vol.1](https://honto.jp/ebook/pd-review_0635175202.html), `はづき`, `2015-09-03`; [Cmoa title route](https://www.cmoa.jp/title/65391/), `トモ`, `2022-12-24`; [Manba board](https://manba.co.jp/boards/11870/reviews), `あうしぃ`, `2020-11-25` | Honto records a child's literal interpretation of ordinary words/TV and a gentle, nostalgic response. Cmoa records the unusual girl's daily-life premise and childhood recollection. Manba records encounters with strange objects and adults leaving the child room while she explores her own interpretation. | These are concrete and separately authored, but the latter two are title/series-board reviews rather than a reliably volume-1-limited review. The observations do not establish a repeated relational warmth reward structure at the Dictionary's required certainty, nor a legal Theme or Narrative mechanic. No direct proposal. |
| 23 | [Goodreads vol.1](https://www.goodreads.com/book/show/20817424-1), `Mark`, `2022-03-11`; [Cmoa title](https://www.cmoa.jp/title/59817), `チョロマカツ`, date not stated | Goodreads describes the 1971 setting, folklore/esoteric material, and slow-burn opening. Cmoa explicitly discusses reaching volume 3 after volume 1, arranged marriage, folklore, and forbidden land. | The Cmoa review is not strictly limited to volumes 1–3 with a dated entry boundary, and the observations reinforce existing world-building/romance/mystery rather than a new legal Theme or Narrative value. No direct proposal. |
| 24 | [Rakuten Books vol.1](https://books.rakuten.co.jp/rb/5719580/), アルファ0334, `2010-12-31`; [MangaLOG](https://m-kikuchi.hatenablog.com/entry/20090124/1232804076), `2009-01-24`; [Cmoa vol.1](https://www.cmoa.jp/title/63124/), いっちゃん, `2018-09-20` | Rakuten and MangaLOG report laughter mixed with tragic/heavy material and repeated dialogue/character dynamics. Cmoa reports frequent violence as an interpersonal expression and dense dialogue. | The comedy value was accepted in round 3; re-proposing it is forbidden. The remaining narrative candidates are not established by interpersonal reactions. No new cell. |
| 25 | [Sony Reader vol.1](https://ebookstore.sony.jp/review/title/10087064/id/LT000011886000312654), `susu`, `2013-12-30`; same page, `nak`, `2013-11-30`; [Zigsow vol.1](https://zigsow.jp/item/162225/review), コロさん, `2010-04-29` | The first two independently describe orchestra practice/performance exchanges, the father's disappearance, a conductor encounter, and the protagonist's changing motivation. Zigsow describes the gifted conductor's first impact on the protagonist's life. | These observations support the existing character arc and slice-of-life/music identity. They do not meet the missing Theme, Narrative, or three Tone-cell thresholds. Sony also contains syndicated entries; only the separately authored entries named above are counted. No direct proposal. |
| 26 | [Honzuki vol.1](https://www.honzuki.jp/book/221049/review/188320/), 坂本美香, `2017-10-14`; [Cmoa title](https://www.cmoa.jp/title/73194/), `あｂｃ`, `2022-05-31`; [Goodreads vol.1](https://www.goodreads.com/book/show/23265709), Jesse, `2018-01-23` | The reviews observe a closed world, records and unanswered mysteries, the girl's arrival as a change, and a calm first volume before a later shock. Cmoa explicitly says only volume 1 was read. | These are discovery/world/darkness observations already covered or rejected in prior adjudication. They do not show repeated growth, clever solutions, or planning. Existing `emotionalWarmth=2` was accepted in round 3; no new cell. |
| 27 | [Rakuten Books vol.1](https://books.rakuten.co.jp/rb/5807326/), モフモフにしてやんよ, `2010-09-13`; [Cmoa title](https://www.cmoa.jp/title/45636/), てふ, date not stated; Sony [vol.1 review route](https://ebookstore.sony.jp/review/title/10076370/id/LT000007573000289534) | Rakuten bounds the princess/merchant, hostage, mother-loss, and first truth material to the opening volumes. Cmoa discusses country-taking and political manoeuvre but at series level. Sony's relevant entries are Bklog-syndicated and not independent from BookLive. | No direct repeated strategic or problem-solving loop is visible in two independent entry-bounded reviews. The prior `progression` rejection remains final. No direct proposal. |
| 28 | [Rakuten Books vol.1](https://books.rakuten.co.jp/rb/11364746/), ちょこ2242, `2011-10-16`; same page, 購入者さん, `2012-09-10`; [Manba new-edition vol.1](https://manba.co.jp/boards/57564/books/1), `2017-06-14` | The reviews independently observe repeated vampire/blood attacks, a sister transformed into a goldfish, horror expectations, intermittent gags, and comic everyday scenes alongside action. | Comedy was accepted in round 3 and cannot be re-proposed. The remaining Narrative candidates are direct rescue/combat, not constraint analysis or long-term planning. The remaining Tone observations are not sufficient for a new known cell without reusing rejected or generic impressions. No direct proposal. |
| 29 | [Reviewne vol.1](https://reviewne.jp/reviews/27414), `2017-04-05`; [Sony Reader vol.1](https://ebookstore.sony.jp/review/title/10268473/id/LT000070726000627326), entry `2014-06-06`; [Booklog vol.1](https://booklog.jp/item/1/4091234453), 永遠ニ馨ル, `2013-03-29` | Reviewne reports the volume-1 shock and protagonist self-loathing. Sony's 2014 Bklog entry reports the school-site violence and search for a path; Booklog states that two volumes had been read. | The Sony passage is syndicated and Booklog exceeds the strict volume-1 boundary. The remaining sources do not establish a legal Theme or new Narrative/Tone cell. `mentalStress=2` was rejected; no direct proposal. |
| 30 | [Rakuten Books vol.1](https://books.rakuten.co.jp/rb/11466082/), CRAZY CRANE, `2012-01-01`; [Tonblog vol.1](https://ameblo.jp/tonkottan/entry-11113578095.html), `2011-12-22`; [Kurobook vol.1](https://www.kurobook.net/entry/%E3%82%B8%E3%83%A7%E3%82%B8%E3%83%A7%E3%83%AA%E3%82%AA%E3%83%B31), `2020-10-27` | The entries describe unresolved mysteries/ability applications, protagonist cooperation, self-parody, and investigation of a curse. Tonblog explicitly warns against reading ordinary cooperation as a conventional romance flag. | The known `comedy=2` cell is accepted and not reopened. The remaining evidence does not establish recurring romance or emotional warmth. No direct proposal. |

## Exact exhaustion and no-op ledger

| Pos | Unused route check completed | Why no direct proposal is permitted |
| --: | --- | --- |
| 21 | Official Shogakukan vols.1–3; BookLive/Goodreads reader routes | Only known romance/relationship observations repeat. No Theme and no three Narrative anchors satisfy the Dictionary. |
| 22 | Official Square Enix vols.1–3 and Cmoa editorial descriptions; Honto/Cmoa/Manba reader routes; Sony/BookLive syndication separated | Warm/nostalgic observations are not reliably volume-bounded in two independent reviews, and they do not prove recurring warmth as a reward. The prior comedy/pacing/darkness/mentalStress decisions stand. |
| 23 | Official Kodansha vols.1–3; Goodreads/Cmoa/Renta/LINE routes | Folklore/ritual has no direct legal Theme ID. Remaining reviews either extend beyond the entry boundary or repeat existing world/romance/mystery evidence. |
| 24 | Official Kodansha vols.1–3; Rakuten, MangaLOG, Cmoa | The only fresh admissible observation was comedy, already accepted in round 3. No two-route Narrative anchor remains. |
| 25 | Official Shonengahosha vols.1–3; Sony, Zigsow, Manba | Music/university activity is not a listed Theme by itself; reviews reinforce the existing arc and slice-of-life classification but do not supply two Narrative or three Tone cells. |
| 26 | Official Akita vols.1–3; Honzuki, Cmoa, Goodreads, BookLive | Discovery, closed-world rules, survival, and crisis do not satisfy progression/problemSolving/strategy beyond the already adjudicated cells. |
| 27 | Official Shogakukan vols.1–3; Rakuten/Cmoa/Sony | Progression was expressly rejected; series-level political manoeuvre cannot be substituted for an entry-bounded strategy value. |
| 28 | Official KADOKAWA vols.1–3; Rakuten/Manba/Akamegane | Comedy is accepted and closed. Rescue/combat is not problem solving/strategy; generic stress/warmth impressions cannot create Tone cells. |
| 29 | Official Shogakukan vols.1–3; Reviewne/Sony/Booklog/Goodreads/Cmoa | The known character-arc and warmth cells are sufficient for the supported observations; mental stress was rejected and dance/dream material is not a listed Theme or planning mechanic. |
| 30 | Official Shueisha vols.1–3; Rakuten/Tonblog/Kurobook | Mystery/investigation and short tactic are already terminal. Cooperation or self-parody does not establish a remaining romance/warmth cell. |

Accordingly, round 4 has **0 direct proposals** and **10 exact-exhaustion
dispositions**. This is not a promotion decision: the remaining values stay
`unknown`, and all ten works remain subject to the existing text/Art promotion
gates. No accepted or rejected cell was altered.

## Handoff boundary

- No Art source, image, pixel observation, or Art value was introduced.
- No user-review sentence is suitable for UI explanation text. Any later
  accepted evidence must be paraphrased and stored as provenance/evidence, then
  independently adjudicated before terminal materialization.
- No decorative title wrapper or title mutation was introduced.
- No zero or midpoint was synthesized for a missing value.
- No `reviewedByHuman` claim was made; it remains `false`.
- No commit was created in this packet.
