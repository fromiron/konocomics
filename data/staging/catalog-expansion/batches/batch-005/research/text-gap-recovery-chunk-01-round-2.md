# Batch 005 text-gap recovery — chunk 01 round 2

- 조사일: 2026-08-25
- 대상: `batch-005/frozen-work-set.csv` positions 1–10 only
- 평가 범위: 각 작품의 entry 1–3 volumes. 권별 본문이 확인되지 않은 경우에는 source가 명시한 첫 major episode 또는 해당 권의 공식 소개 범위로 제한했다.
- `reviewedByHuman=false`
- current candidate root SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifest SHA-256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- frozen work set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- terminal text CSV SHA-256 (read-only attestation): `4905ce2a2336323ad7c3573ed0df38d2a8b1fce26c80a0e170fc9568ff8376d6`
- Pass A factors SHA-256: `d49ca60fc5ebe84c5ca0b7665be613f3fd66682c0d25459edce9189254251511`
- Grok response SHA-256: `9a3e883d4c9c48445c48d06a0902834e502aa0ac45bd5e0ca539388183f57f0d`
- Grok ledger SHA-256: `a4b725b715f2341b3b8898710da25bbe60b77bfe9653b74b76c6f390994c52dd`
- retrievedAt for every external source in this report: `2026-08-25`

## Recovery contract

The residual set is copied from the current Pass C report `reviews/daybreak-text-adjudication-chunks-01-02.md`. Existing accepted terminal known cells were not reopened. The recovery order was:

1. publisher/rightsholder volume 1–3 pages and authorized previews;
2. official award or bookseller pages, only as direct category or route evidence and never as a substitute for an Axis observation;
3. at least two independent user-review pages per position, used only as supplemental corroboration.

A review was counted as independent when it came from a different domain and/or a different named reviewer, and its page stated a bounded volume or entry scope. Reviews never overrode the official range boundary. No review, award label, selection label, demographic label, food subject, occupation, chapter-title list, or Genre label was used to infer an Axis. “Synopsis silence” was not converted to known `0`. No Art axis was investigated or assigned.

The proposal status below is deliberately separate from the terminal CSV. `provisional` and `lead` mean that a later adjudicator may accept or reject the proposal; they are not terminal known values. Because the terminal CSV was not edited, every residual cell listed under `terminal unknowns` remains `unknown`.

Decorative Japanese title brackets were excluded throughout; canonical titles are written without decorative delimiters.

## Recovery summary

| pos | canonical title | residual route | provisional proposal | confidence | terminal disposition |
| ---: | --- | --- | --- | ---: | --- |
| 1 | チェーザレ 破壊の創造者 | Narrative `progression/problemSolving/mysteryReveal`; Tone `characterArcWeight/comedy/darkness/mentalStress/romance/emotionalWarmth` | none | — | all residual cells remain unknown |
| 2 | くーねるまるた | Narrative `progression/problemSolving/strategy/mysteryReveal/worldBuilding`; Tone `characterArcWeight/comedy/romance` | none | — | all residual cells remain unknown |
| 3 | インベスターZ | Genre; Tone `characterArcWeight/relationshipStructure/comedy/darkness/mentalStress/romance/emotionalWarmth` | none; bookseller labels do not resolve a legal entry Genre | — | all residual cells remain unknown |
| 4 | 黄泉のツガイ | Narrative `progression/problemSolving/strategy`; Tone `characterArcWeight/comedy/mentalStress/romance/emotionalWarmth` | none | — | all residual cells remain unknown |
| 5 | ラーメン大好き小泉さん | Theme; Narrative `progression/problemSolving/strategy/pacing/mysteryReveal/worldBuilding`; Tone all seven axes | none; ramen consumption is not `cooking` Theme | — | all residual cells remain unknown |
| 6 | 忘却のサチコ | Narrative `progression/problemSolving/strategy/mysteryReveal/worldBuilding`; Tone `relationshipStructure/comedy/darkness/emotionalWarmth` | `comedy=2` provisional; `emotionalWarmth=2` provisional | 0.78; 0.65 | proposals are not terminal; all residual cells remain unknown |
| 7 | 機動旅団八福神 | Narrative `progression/problemSolving/strategy/mysteryReveal`; Tone `characterArcWeight/comedy/mentalStress/romance/emotionalWarmth` | none | — | all residual cells remain unknown |
| 8 | 不滅のあなたへ | Narrative `progression/problemSolving/strategy/mysteryReveal/worldBuilding`; Tone `relationshipStructure/comedy/mentalStress/romance` | none; “evolution”/“new family” title text remains insufficient | — | all residual cells remain unknown |
| 9 | よるくも | Genre; Theme; Narrative `progression/problemSolving/strategy/mysteryReveal`; Tone `comedy/romance/emotionalWarmth` | Genre `scienceFiction` 0.84 and `fantasy` 0.78 leads; Theme `survival:2` lead | 0.84; 0.78; 0.70 | leads are not terminal; all residual cells remain unknown |
| 10 | 高校球児 ザワさん | Narrative `progression/problemSolving/strategy/mysteryReveal/worldBuilding`; Tone `characterArcWeight/comedy/mentalStress/romance/emotionalWarmth` | `comedy=2` provisional | 0.68 | proposal is not terminal; all residual cells remain unknown |

## Source ledger

All URLs below were opened or checked as part of the bounded route. Existing packet URLs are repeated here to make the recovery independently auditable. `official` and `bookseller` sources are distinct from `user-review` sources. A page marked `undated` did not expose a publication date; this is not a guessed date.

### Position 1 — チェーザレ 破壊の創造者

| id | sourceName | URL | publishedAt | scope / independence |
| --- | --- | --- | --- | --- |
| 1-O1 | 講談社公式商品ページ — 1 | https://www.kodansha.co.jp/comic/products/0000013469 | 2006-10-23 | official publisher, volume 1 / Angelo enters Pisa and meets Cesare |
| 1-O2 | 講談社公式商品ページ — 2 | https://www.kodansha.co.jp/comic/products/0000013470 | 2006-10-23 | official publisher, volume 2 / secular-religious conflict and papal plan |
| 1-O3 | 講談社公式商品ページ — 3 | https://www.kodansha.co.jp/comic/products/0000013493 | 2007-04-23 | official publisher, volume 3 / cardinals plot succession |
| 1-O4 | 講談社公式試し読み — volume 1 | https://www.kodansha.co.jp/comic/products/0000013469/trial | 2006-10-23 | official preview route checked; no new repeatable non-Art mechanism was promoted |
| 1-O5 | マンガ大賞公式選考コメント — チェーザレ | https://www.mangataisho.com/data/2009/comment090324.pdf | 2009-03-24 | official award commentary checked for context only; not Factor evidence |
| 1-R1 | 読書メーター — チェーザレ 破壊の創造者(1) | https://bookmeter.com/books/557820 | 2021-01-08 / 2021-01-07 records visible | independent user reviews, volume 1; history comprehension and Angelo viewpoint |
| 1-R2 | note 個人読書記録 — チェーザレ 破壊の創造者 1 | https://note.com/fe1955/n/nf2ad285d784e | 2017-01-16 | independent user review, volume 1; entry premise and historical setting |

### Position 2 — くーねるまるた

| id | sourceName | URL | publishedAt | scope / independence |
| --- | --- | --- | --- | --- |
| 2-O1 | 小学館 eコミック公式 — 1 | https://e-comi.shogakukan.co.jp/books/091848470000d0000000 | 2014-04-02 | official publisher, volume 1 / daily food preparation |
| 2-O2 | 小学館 eコミック公式 — 2 | https://e-comi.shogakukan.co.jp/books/091853050000d0000000 | undated | official publisher, volume 2 / food, seasons, neighbours |
| 2-O3 | 小学館 eコミック公式 — 3 | https://e-comi.shogakukan.co.jp/books/091857280000d0000000 | undated | official publisher, volume 3 / friends, neighbours, named dishes |
| 2-O4 | 小学館公式試し読み — volume 1 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091848470000d0000000 | 2014-04-02 | official preview checked; no additional repeatable missing Axis mechanism was promoted |
| 2-O5 | マンガ大賞公式選考コメント — くーねるまるた | https://www.mangataisho.com/data/2014/comment2014.pdf | 2014-03-27 | official award commentary checked for context only; not Axis evidence |
| 2-R1 | コミックシーモア user reviews — くーねるまるた 1 | https://www.cmoa.jp/title/71299/ | 2017-10-07 / 2018-03-02 / 2020-05-15 / 2021-11-04 records visible | independent users, volume 1; slow everyday life and food/comfort observations |
| 2-R2 | BookLive user reviews — くーねるまるた 3 | https://booklive.jp/review/list/title_id/241730/vol_no/003?spoiler=1 | 2014-01-16 / 2022-11-04 records visible | independent users, volume 3; repeated food-and-neighbour routine |

### Position 3 — インベスターZ

| id | sourceName | URL | publishedAt | scope / independence |
| --- | --- | --- | --- | --- |
| 3-O1 | 講談社公式商品ページ — 1 | https://www.kodansha.co.jp/comic/products/0000018461 | 2013-09-20 | official publisher, volume 1 / investment school premise |
| 3-O2 | 講談社公式商品ページ — 2 | https://www.kodansha.co.jp/comic/products/0000018483 | 2013-12-20 | official publisher, volume 2 / investment club, first investment, rules |
| 3-O3 | 講談社公式商品ページ — 3 | https://www.kodansha.co.jp/comic/products/0000018518 | 2014-03-20 | official publisher, volume 3 / investment method description |
| 3-O4 | BOOK☆WALKER bookseller — インベスターZ(1) | https://bookwalker.jp/de5f74b244-e8c3-496b-b1a6-e9b6eece51c9/ | 2016-08-23 | bookseller, volume 1 entry synopsis and categories `金融/部活/歴史`; categories do not map directly to the product Genre enum |
| 3-O5 | 講談社コクリコ — money-learning manga feature | https://cocreco.kodansha.co.jp/cocreco/general/study/iRSxG?page=3 | 2024-09-30 | official publisher editorial feature; entry school/investment explanation, no legal product Genre |
| 3-R1 | コミックシーモア user reviews — インベスターZ(1) | https://www.cmoa.jp/title/76196/ | 2017-08-12 / 2020-01-31 / 2021-05-16 records visible | independent users, volume 1; investment learning and school-club premise |
| 3-R2 | いつか子供に伝えたいお金の話 — インベスターZ 1–3 | https://mushitori.blog.fc2.com/blog-entry-94.html | undated | independent personal review, volumes 1–3; investment-history and school-club observations |

### Position 4 — 黄泉のツガイ

| id | sourceName | URL | publishedAt | scope / independence |
| --- | --- | --- | --- | --- |
| 4-O1 | スクウェア・エニックス公式商品ページ — 1 | https://magazine.jp.square-enix.com/top/comics/detail/9784757579620/ | 2022-06-10 | official publisher, volume 1 / village, twin, mystery, first battle |
| 4-O2 | スクウェア・エニックス公式商品ページ — 2 | https://magazine.jp.square-enix.com/top/comics/detail/9784757581005/ | 2022-09-12 | official publisher, volume 2 / underworld travel and Kagemori clash |
| 4-O3 | スクウェア・エニックス公式商品ページ — 3 | https://magazine.jp.square-enix.com/top/comics/detail/9784757584013/ | 2023-02-10 | official publisher, volume 3 / reunion, attack, seal/unseal questions |
| 4-O4 | SQUARE ENIX ガンガンオンライン公式第1話試し読み | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/ | 2022-06-10 | official preview checked; image-led route did not establish a repeatable missing Tone/Narrative value |
| 4-O5 | 次にくるマンガ大賞公式 — 2023 comics | https://tsugimanga.jp/winner/2023/comics | 2023-08-31 | official award route checked only as selection context; not Axis evidence |
| 4-R1 | BookLive user reviews — 黄泉のツガイ 1 | https://booklive.jp/review/list/title_id/20045746/vol_no/001 | 2026-06-07 / 2026-06-09 / 2026-06-12 / 2026-06-30 records visible | independent users, volume 1; setting, action, and surprise observations |
| 4-R2 | Sony Reader/ブクログ user reviews — 黄泉のツガイ 3 | https://ebookstore.sony.jp/review/title/10698755/id/LT000178283001729708/ | 2026-02-18 / 2026-05-08 / 2026-05-28 records visible | independent users, volume 3; information, faction unease, mixed serious/gag tone |

### Position 5 — ラーメン大好き小泉さん

| id | sourceName | URL | publishedAt | scope / independence |
| --- | --- | --- | --- | --- |
| 5-O1 | フジテレビ公式原作プロモーション | https://www.fujitv.co.jp/ramen_koizumi/2019/topics_01.html | undated | official broadcaster adaptation promotion, first major premise only; not a volume 1–3 publisher record |
| 5-O2 | アニメイト公式販売ページ — 1 | https://www.animate-onlineshop.jp/pn/pd/1290164/ | 2014-10-07 | licensed distributor, volume 1 identity and first-premise synopsis |
| 5-O3 | マンガ大賞公式選考コメント — ラーメン大好き小泉さん | https://www.mangataisho.com/data/2015/comment2015.pdf | 2015-03-24 | official award commentary checked for context only; no cooking-mechanic evidence |
| 5-O4 | 次にくるマンガ大賞公式 — 2015 comics | https://tsugimanga.jp/winner/2015/comics | 2015-02-06 | official award route checked only as selection context; not Theme evidence |
| 5-R1 | BookLive user reviews — ラーメン大好き小泉さん 秋田書店版 1 | https://booklive.jp/review/list/title_id/1657125/vol_no/001 | 2025-04-02 / 2025-04-10 / 2025-06-19 / 2025-08-16 records visible | independent users, volume 1 alternate edition; content is stated to overlap the frozen Bamboo edition |
| 5-R2 | note 個人読書記録 — ラーメン大好き小泉さん | https://note.com/bokuha99/n/n893a9d09c7c9 | 2024-02-23 | independent user review, volume 1/series entry; repeated ramen consumption, no preparation mechanic |

### Position 6 — 忘却のサチコ

| id | sourceName | URL | publishedAt | scope / independence |
| --- | --- | --- | --- | --- |
| 6-O1 | 小学館公式商品ページ — 1 | https://shogakukan-comic.jp/book?isbn=9784091866707&lang=en | 2014-12-26 | official publisher, volume 1 / editor, broken engagement, food-seeking |
| 6-O2 | 小学館公式商品ページ — 2 | https://shogakukan-comic.jp/book?isbn=9784091868800 | 2015-04-30 | official publisher, volume 2 / editorial trip, food and former-fiancé reminder |
| 6-O3 | 小学館公式商品ページ — 3 | https://shogakukan-comic.jp/book?isbn=9784091871756 | 2015-08-28 | official publisher, volume 3 / railway reporting, food-seeking and schedule pressure |
| 6-O4 | 小学館公式試し読み — frozen volume 1 | https://sc-portal.tameshiyo.me/9784091866707 | 2014-12-26 | official preview checked; no Art or unbounded later-series evidence used |
| 6-O5 | マンガ大賞公式選考コメント — 忘却のサチコ | https://www.mangataisho.com/data/2017/comment2017.pdf | 2017-03-28 | official award commentary checked as supplemental tone-language route; not sole evidence |
| 6-R1 | コミックシーモア user reviews — 忘却のサチコ 1 | https://www.cmoa.jp/title/91082/ | 2016-04-22 / 2018-10-18 / 2019-06-15 / 2024-05-24 records visible | independent users, volume 1; comedy, recovery, work and food observations |
| 6-R2 | オタわむれ personal review — 忘却のサチコ 1–3 | https://hanhans.hatenablog.com/entry/20151003/p3 | 2015-10-03 | independent user review, volumes 1–3; work frustration, food-seeking, and emotional after-effects |

### Position 7 — 機動旅団八福神

| id | sourceName | URL | publishedAt | scope / independence |
| --- | --- | --- | --- | --- |
| 7-O1 | KADOKAWA公式商品ページ — 1 | https://www.kadokawa.co.jp/product/200700002796/ | 2004-12-25 | official publisher, volume 1 / occupied Japan, losses, eight child soldiers |
| 7-O2 | Hulu licensed manga page | https://www.hulu.jp/comic/series/138521/chapter | undated | licensed platform, volumes 1–2 abbreviated descriptions |
| 7-O3 | Sony Reader bookseller — volume 3 | https://ebookstore.sony.jp/title/10102361/id/LT000016409000340695/ | 2014-03-08 | licensed distributor, volume 3 synopsis; edition is not the frozen representative |
| 7-O4 | BOOK☆WALKER official preview — volume 1 | https://bookwalker.jp/dedf955cea-e140-4634-9394-232ed5dbbc7a/?sample=1&from=1 | 2004-12-25 | rightsholder/bookseller preview checked; vol1 ISBN does not bridge frozen vol9, so no value promoted |
| 7-O5 | マンガ大賞公式選考コメント — 機動旅団八福神 | https://www.mangataisho.com/data/2009/comment090324.pdf | 2009-03-24 | official award commentary checked for context only; not Axis evidence |
| 7-R1 | BookLive user reviews — 機動旅団八福神 1 | https://booklive.jp/product/index/title_id/247464/vol_no/001 | 2011-02-21 / 2022-09-30 / 2025-04-04 records visible | independent users, volume 1; density, politics, cruelty, and war observations |
| 7-R2 | ピロEK personal review — 機動旅団八福神 3 | https://piro-ek0324.hatenablog.com/entry/2007/05/05/114256 | 2007-05-05 | independent user review, volume 3; early war/character continuity |

### Position 8 — 不滅のあなたへ

| id | sourceName | URL | publishedAt | scope / independence |
| --- | --- | --- | --- | --- |
| 8-O1 | 講談社公式商品ページ — 1 | https://www.kodansha.co.jp/comic/products/0000019901 | 2017-01-17 | official publisher, volume 1 / sphere, transformations, first encounters and loss |
| 8-O2 | 講談社公式商品ページ — 2 | https://www.kodansha.co.jp/comic/products/0000019946 | 2017-03-17 | official publisher, volume 2 / repeated series premise only |
| 8-O3 | 講談社公式商品ページ — 3 | https://www.kodansha.co.jp/comic/products/0000020013 | 2017-06-16 | official publisher, volume 3 / repeated premise and table-of-contents range |
| 8-O4 | マガポケ公式第1話試し読み | https://pocket.shonenmagazine.com/title/00211/episode/154357 | 2017-01-17 | official rightsholder preview checked; five body canvases, no new repeated missing Axis mechanism |
| 8-O5 | マンガ大賞公式選考コメント — 不滅のあなたへ | https://www.mangataisho.com/data/2018/comment2018.pdf | 2018-03-22 | official award commentary checked as context only; not Axis evidence |
| 8-R1 | BookLive user reviews — 不滅のあなたへ 1 | https://booklive.jp/review/list/title_id/60005607/vol_no/001 | 2019-11-24 and undated user records visible | independent users, volume 1; encounters, pain, hope, and learning observations |
| 8-R2 | 読書メーター user reviews — 不滅のあなたへ 1 | https://bookmeter.com/books/11256104?review_filter=netabare | 2018-02-07 / 2018-02-09 / 2019-07-11 records visible | independent users, volume 1; transformation and loss observations |

### Position 9 — よるくも

| id | sourceName | URL | publishedAt | scope / independence |
| --- | --- | --- | --- | --- |
| 9-O1 | 小学館 eコミック公式 — 1 | https://shogakukan-comic.jp/book?jdcn=091885380000d0000000 | 2013-01-01 (e-comic page display) | official publisher, volume 1 / City-Fields-Forest class world, diner, killer |
| 9-O2 | 小学館 eコミック公式 — 2 | https://shogakukan-comic.jp/book?jdcn=091885600000d0000000 | 2013-07-18 | official publisher, volume 2 / class system, intimacy, tragedy |
| 9-O3 | 小学館 eコミック公式 — 3 | https://shogakukan-comic.jp/book?jdcn=091885980000d0000000 | 2013-07-18 | official publisher, volume 3 / murder, abduction, escape, family claim |
| 9-O4 | 小学館公式試し読み — frozen volume 1 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091885380000d0000000 | 2013-01-01 | official preview checked; no Art inference and no unsupported mystery value promoted |
| 9-O5 | BOOK☆WALKER bookseller — よるくも(1) | https://bookwalker.jp/de737c9ab2-7378-4986-9194-47f62317a2f7/ | 2011-01-28 (bookseller product date) | bookseller, volume 1 entry synopsis and direct categories `SF/ファンタジー/バトル・格闘・アクション` |
| 9-O6 | マンガ大賞公式選考コメント — よるくも | https://www.mangataisho.com/data/2013/comment2013.pdf | 2013-03-21 | official award commentary checked for context only; not used to infer a Theme |
| 9-R1 | Sony Reader/ブクログ user reviews — よるくも 1 | https://ebookstore.sony.jp/review/title/10080979/id/LT000009084000299045 | 2015-04-14 and undated records visible | independent users, volume 1; class gap, darkness, and human warmth observations |
| 9-R2 | BookLive user reviews — よるくも 2 | https://booklive.jp/review/list/title_id/214355/vol_no/002 | 2015-04-19 and undated records visible | independent users, volume 2; class system, intimacy, and tragedy observations |

### Position 10 — 高校球児 ザワさん

| id | sourceName | URL | publishedAt | scope / independence |
| --- | --- | --- | --- | --- |
| 10-O1 | 小学館 eコミック公式 — 1 | https://e-comi.shogakukan.co.jp/books/091825370000d0000000 | undated | official publisher, volume 1 / ordinary baseball-club life |
| 10-O2 | 小学館 eコミック公式 — 2 | https://e-comi.shogakukan.co.jp/books/091826690000d0000000 | undated | official publisher, volume 2 / class, club, daily scenes, promotional “dokidoki” wording |
| 10-O3 | 小学館 eコミック公式 — 3 | https://e-comi.shogakukan.co.jp/books/091828640000d0000000 | undated | official publisher, volume 3 / training, game restriction, peer daily life |
| 10-O4 | 小学館公式試し読み — frozen volume 1 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091825370000d0000000 | undated | official preview checked; only three qualifying body pages and no new repeatable missing mechanism |
| 10-O5 | マンガ大賞公式選考コメント — 高校球児 ザワさん | https://www.mangataisho.com/data/2010/comment2010.pdf | 2010-03-17 | official award commentary checked for context only; not used as Axis evidence |
| 10-R1 | BookLive user reviews — 高校球児 ザワさん 1 | https://booklive.jp/review/list/title_id/214356/vol_no/001 | 2025-12-25 and undated records visible | independent users, volume 1; everyday cut-outs, humour, and slow pace |
| 10-R2 | Sony Reader user reviews — 高校球児 ザワさん 1 | https://ebookstore.sony.jp/review/LT000011460000310627/ | undated | independent users, volume 1; short everyday episodes, comedy/fetish framing, multiple viewpoints |

## Per-cell recovery decisions

The following tables enumerate only the cells named by the Daybreak finite-research table. `unknown` means the route did not meet the known-value threshold. `provisional` is a candidate for later adjudication and does not mutate the terminal CSV. `lead` is weaker than provisional and is retained only to show why the route is not yet classified as information-unavailable.

### Position 1 — チェーザレ 破壊の創造者

| cell | result | confidence | bounded reason |
| --- | --- | ---: | --- |
| progression | unknown | — | Volume pages show political entry events, not a repeated growth-reward loop. |
| problemSolving | unknown | — | Papal manoeuvring is strategy; no repeated constraint-analysis solution process is exposed. |
| mysteryReveal | unknown | — | Historical exposition and succession plots are not a recurring clue/reveal reward. |
| characterArcWeight | unknown | — | Angelo/Cesare relationship is present, but summaries do not make character change the primary reward. |
| comedy | unknown | — | No repeated comedy mechanism in official entry text or the two bounded reviews. |
| darkness | unknown | — | Political conflict is serious, but cruelty/bleakness as the entry centre is not established. |
| mentalStress | unknown | — | No repeated psychological-pressure observation is range-matched. |
| romance | unknown | — | No entry-range romantic subplot is established. |
| emotionalWarmth | unknown | — | No repeated bond/healing reward is established. |

### Position 2 — くーねるまるた

| cell | result | confidence | bounded reason |
| --- | --- | ---: | --- |
| progression | unknown | — | Daily food episodes do not prove either growth or its absence. |
| problemSolving | unknown | — | Recipe improvisation is not enough to establish the dictionary constraint-solving axis across the range. |
| strategy | unknown | — | No long-term plan/resource operation is exposed. |
| mysteryReveal | unknown | — | No clue/reveal mechanism is exposed. |
| worldBuilding | unknown | — | Tokyo neighbourhood detail remains setting, not repeated load-bearing rules. |
| characterArcWeight | unknown | — | Warm everyday reception does not establish character-change reward. |
| comedy | unknown | — | Reviews describe gentle daily life; no bounded repeated comedy mechanism is confirmed by official text. |
| romance | unknown | — | No romantic subplot is established. |

### Position 3 — インベスターZ

| cell | result | confidence | bounded reason |
| --- | --- | ---: | --- |
| Genre | unknown | — | Kodansha calls it a stock-investment school manga; BOOK☆WALKER categories `金融/部活/歴史` do not supply a legal product Genre without taxonomy leakage. |
| characterArcWeight | unknown | — | Investor training is not automatically a character-change reward. |
| relationshipStructure | unknown | — | Club membership alone does not establish fixed-party or ensemble reward. |
| comedy | unknown | — | No repeated comedy mechanism in the bounded official entry sources. |
| darkness | unknown | — | Financial stakes and competitive language do not establish a dark world. |
| mentalStress | unknown | — | Risk and pressure are plot stakes, not repeated psychological pressure evidence. |
| romance | unknown | — | No romantic subplot. |
| emotionalWarmth | unknown | — | No repeated bond/healing reward. |

### Position 4 — 黄泉のツガイ

| cell | result | confidence | bounded reason |
| --- | --- | ---: | --- |
| progression | unknown | — | Travel and information accumulation are not enough for a repeated growth-reward structure. |
| problemSolving | unknown | — | Attacks and movement do not expose repeated constraint analysis and solutions. |
| strategy | unknown | — | Faction conflict is not enough to establish long-term planning/resource operation. |
| characterArcWeight | unknown | — | Twin reunion and faction cast do not make character change the primary reward. |
| comedy | unknown | — | Two reviews mention gags, but official volume copy does not establish a repeated entry comedy mechanism; reviews remain supplemental only. |
| mentalStress | unknown | — | Danger/unease is not enough to establish sustained psychological pressure. |
| romance | unknown | — | No entry-range romance. |
| emotionalWarmth | unknown | — | Reunion is a positive event, not enough to establish repeated healing/bond reward. |

### Position 5 — ラーメン大好き小泉さん

| cell | result | confidence | bounded reason |
| --- | --- | ---: | --- |
| Theme | unknown | — | Official/bounded reviews repeatedly show ramen seeking and consumption; no recurring preparation/crafting mechanic supports legal Theme `cooking`. |
| progression | unknown | — | No volume-range growth-reward evidence. |
| problemSolving | unknown | — | Restaurant/ramen knowledge is not a repeated constraint-solving process. |
| strategy | unknown | — | No long-term plan or resource operation. |
| pacing | unknown | — | First-premise/adaptation material is not a 1–3-volume frequency audit. |
| mysteryReveal | unknown | — | No clue/reveal mechanism. |
| worldBuilding | unknown | — | Real restaurant references are not a load-bearing fictional rule system. |
| characterArcWeight | unknown | — | Student identity and ramen fixation do not establish character-change reward. |
| relationshipStructure | unknown | — | Classmate presence is not enough for a fixed-party/ensemble structure. |
| comedy | unknown | — | Reviews use “笑える” tags, but the official packet lacks a bounded 1–3 repeated mechanism; retain unknown. |
| darkness | unknown | — | No dark-world evidence. |
| mentalStress | unknown | — | No sustained pressure evidence. |
| romance | unknown | — | No romantic subplot established. |
| emotionalWarmth | unknown | — | Food pleasure is not automatically emotional warmth. |

### Position 6 — 忘却のサチコ

| cell | result | confidence | bounded reason |
| --- | --- | ---: | --- |
| progression | unknown | — | Food-seeking and work travel recur, but an explicit growth-reward loop is not established. |
| problemSolving | unknown | — | Reporting/food travel does not expose repeated constraint-solving. |
| strategy | unknown | — | Editorial assignments are not long-term strategy/resource operation. |
| mysteryReveal | unknown | — | Former-fiancé uncertainty is not a recurring clue/reveal structure. |
| worldBuilding | unknown | — | Travel locations are not a fictional rule system. |
| relationshipStructure | unknown | — | Editor/writer interactions recur, but a fixed party is not the primary reward. |
| comedy | provisional 2 | 0.78 | Official volume-1/bookseller copy explicitly uses グルメ・コメディー; volume 1–3 food/work episodes and independent Cmoa/Hatena reviews repeatedly describe comic mismatch and humour. |
| darkness | unknown | — | Engagement loss and work pressure do not establish dark-world centrality. |
| emotionalWarmth | provisional 2 | 0.65 | Food repeatedly functions as a small recovery/“忘却” reward; Cmoa users independently describe healing and regained human warmth. The proposal remains below 4 and requires adjudication because this is individual recovery, not a bond-centred work. |

### Position 7 — 機動旅団八福神

| cell | result | confidence | bounded reason |
| --- | --- | ---: | --- |
| progression | unknown | — | War sortie and equipment premise do not establish a repeated growth-reward loop. |
| problemSolving | unknown | — | Tactical questions appear, but no repeated constraint-solution process is bounded across 1–3. |
| strategy | unknown | — | Military setting is not enough to establish long-term planning/resource operation. |
| mysteryReveal | unknown | — | Technology/world questions are not a demonstrated clue/reveal reward in the bounded text. |
| characterArcWeight | unknown | — | Eight-person cast and loss list do not make character change primary. |
| comedy | unknown | — | No repeated comedy mechanism in official entry copy; reader remarks are tone impressions only. |
| mentalStress | unknown | — | Losses establish serious stakes/darkness, not necessarily sustained psychological pressure. |
| romance | unknown | — | “恋” appears in a loss list, not as an entry romantic subplot. |
| emotionalWarmth | unknown | — | Team membership alone does not establish healing/bond reward. |

### Position 8 — 不滅のあなたへ

| cell | result | confidence | bounded reason |
| --- | --- | ---: | --- |
| progression | unknown | — | Official “小さな進化” and “新しい家族” are table-of-contents/premise text; they do not establish repeated 1–3 growth reward. Reviews are corroborative but not enough to replace the official range evidence. |
| problemSolving | unknown | — | Information gathering is a premise, not a repeated constraint-solving process. |
| strategy | unknown | — | No long-term plan/resource operation in the exposed volume copy. |
| mysteryReveal | unknown | — | The sphere’s rules remain unexplained; mystery presence alone is not reveal payoff. |
| worldBuilding | unknown | — | The world is broad, but 2–3 official pages repeat only the series premise and do not expose load-bearing rules. |
| relationshipStructure | unknown | — | Encounters and separations do not establish a fixed party. |
| comedy | unknown | — | One reviewer notes humorous exchanges, but no repeated official mechanism. |
| mentalStress | unknown | — | Death/loss and sadness are present, but range-matched sustained pressure is not established. |
| romance | unknown | — | No romantic subplot. |

### Position 9 — よるくも

| cell | result | confidence | bounded reason |
| --- | --- | ---: | --- |
| Genre `scienceFiction` | lead | 0.84 | BOOK☆WALKER directly labels volume 1 `SF`; the official three-volume setting is a stratified City/Fields/Forest world. This is a Genre lead only and is not used to infer any Axis. |
| Genre `fantasy` | lead | 0.78 | BOOK☆WALKER directly labels volume 1 `ファンタジー`; the official synopsis supports an invented class-world/assassin premise. This remains a competing legal Genre lead pending adjudication. |
| Theme `survival:2` | lead | 0.70 | Official volumes 1–3 repeatedly bind disposable Forest children, an inescapable class system, murder, abduction, and escape. The route is strong enough to keep Theme research open, but “survival” is not yet terminal because the synopses do not explicitly frame survival as the recurring reward. |
| progression | unknown | — | Relationship and world collapse are not a demonstrated growth-reward loop. |
| problemSolving | unknown | — | Murder/escape events do not expose repeated constraint analysis and solutions. |
| strategy | unknown | — | The broker’s work and class system do not establish long-term planning/resource operation. |
| mysteryReveal | unknown | — | World secrets and tragedy are present, but a repeated clue/reveal reward is not explicit enough. |
| comedy | unknown | — | Reviews focus on darkness and warmth; no repeated comedy mechanism is established. |
| romance | unknown | — | Intimacy and “愛” wording do not establish an active romantic subplot. |
| emotionalWarmth | unknown | — | Human warmth appears as contrast, but the entry reward is not clearly healing/bond-centred. |

### Position 10 — 高校球児 ザワさん

| cell | result | confidence | bounded reason |
| --- | --- | ---: | --- |
| progression | unknown | — | Training and time passing are not enough to establish repeated growth reward in the 1–3 packet. |
| problemSolving | unknown | — | Baseball-club activity does not expose repeated constraint-solving. |
| strategy | unknown | — | No long-term tactical/resource operation in the official descriptions. |
| mysteryReveal | unknown | — | No clue/reveal mechanism. |
| worldBuilding | unknown | — | High-school club setting is functional, not a load-bearing fictional rule system. |
| characterArcWeight | unknown | — | Daily interaction and training do not make character change the primary reward. |
| comedy | provisional 2 | 0.68 | Official volume-1 framing is ordinary daily life, volume 3 contrasts serious training with a spacey expression, and BookLive/Sony users independently describe short humorous/schur episodes. This is occasional comedy, not a 4 anchor. |
| mentalStress | unknown | — | “Dokidoki,” restriction, and user remarks about unease do not establish sustained psychological pressure. |
| romance | unknown | — | Promotional “dokidoki” and peer interest are not enough for an active romantic subplot. |
| emotionalWarmth | unknown | — | Teammate proximity is not sufficient for healing/bond reward. |

## Terminal unknowns after this bounded pass

The following cells remain terminal `unknown` in the untouched `text-final-chunk-01.csv`; proposals and leads above are not materialized:

| pos | terminal unknown cells |
| ---: | --- |
| 1 | `progression`, `problemSolving`, `mysteryReveal`, `characterArcWeight`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth` |
| 2 | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`, `characterArcWeight`, `comedy`, `romance` |
| 3 | Genre; `characterArcWeight`, `relationshipStructure`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth` |
| 4 | `progression`, `problemSolving`, `strategy`, `characterArcWeight`, `comedy`, `mentalStress`, `romance`, `emotionalWarmth` |
| 5 | Theme; `progression`, `problemSolving`, `strategy`, `pacing`, `mysteryReveal`, `worldBuilding`, `characterArcWeight`, `relationshipStructure`, `comedy`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth` |
| 6 | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`, `relationshipStructure`, `comedy`, `darkness`, `emotionalWarmth` |
| 7 | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `characterArcWeight`, `comedy`, `mentalStress`, `romance`, `emotionalWarmth` |
| 8 | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`, `relationshipStructure`, `comedy`, `mentalStress`, `romance` |
| 9 | Genre; Theme; `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `comedy`, `romance`, `emotionalWarmth` |
| 10 | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding`, `characterArcWeight`, `comedy`, `mentalStress`, `romance`, `emotionalWarmth` |

The two provisional cells for position 6, the two Genre leads and Theme lead for position 9, and the provisional comedy cell for position 10 therefore do not change coverage or gate status. They are finite recovery proposals for later adjudication only.

## Finite route exhaustion

| pos | routes exhausted in this pass | remaining boundary |
| ---: | --- | --- |
| 1 | official Kodansha volumes 1–3 and vol1 trial; official award comment; two independent bounded reviews | no paid/full reader or later-volume evidence used; residuals remain unknown |
| 2 | official Shogakukan e-comic volumes 1–3 and vol1 trial; official award comment; two independent bounded reviews | no later-series material used; synopsis/review routine cannot establish missing endpoints |
| 3 | official Kodansha volumes 1–3; Kodansha editorial feature; BOOK☆WALKER bookseller route; two independent bounded reviews | bookseller categories remain taxonomy leads, not legal Genre assignment; no publisher preview route exists |
| 4 | official Square Enix volumes 1–3 and first-episode preview; official award route; two independent bounded reviews | reviews corroborate setting/unease only; no repeatable missing Tone/Narrative mechanism |
| 5 | official broadcaster/distributor routes; award and next-manga routes; alternate-edition bookseller/review routes; two independent bounded reviews | no publisher volume preview; cooking Theme cannot be inferred from ramen consumption |
| 6 | official Shogakukan volumes 1–3 and tameshiyo preview; award comment; two independent bounded reviews | comedy/warmth are provisional only; no CSV or source mutation |
| 7 | official KADOKAWA vol1, licensed volume 1–3 leads, BookWalker vol1 preview with edition mismatch; award route; two independent bounded reviews | frozen representative is vol9; no exact vol9-to-entry preview bridge |
| 8 | official Kodansha volumes 1–3 and Pocket first-episode preview; award route; two independent bounded reviews | official 2–3 pages repeat premise/TOC only; no additional entry mechanism |
| 9 | official Shogakukan volumes 1–3 and vol1 preview; BOOK☆WALKER categories; award route; two independent bounded reviews | Genre/Theme leads require adjudication; no paid/full reader used |
| 10 | official Shogakukan volumes 1–3 and vol1 preview; award comment; two independent bounded reviews | only three readable preview pages; comedy remains provisional, no endpoint or Theme inference |

“Exhausted” means the finite official-first routes listed above were checked for this round. It does not claim that a paid/full reader or future publisher page can never add evidence. Any new route must preserve the same representative-edition and entry-range boundary.

## Non-mutation attestation

- `adjudication/text-final-chunk-01.csv` was not edited.
- `adjudication/themes-final-chunk-01.csv` was not edited.
- `adjudication/genres-final-chunk-01.csv` was not edited.
- Pass A annotation, research chunk, source registry, overlay, status, promotion, and catalog files were not edited.
- No Art value, Art source, preview pixel judgment, or motion judgment was created.
- No Genre label was converted into an Axis value.
- No title delimiter was added.
- This report is an evidence/recovery packet only; `reviewedByHuman=false` remains unchanged.
