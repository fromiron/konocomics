# Pilot 001 official metadata audit

- Scope: the 50 works frozen in `pilot-001`; the audited writes listed below were applied after the read-only review.
- Contract applied: `firstPublishedYear` is the earliest qualifying formal serialization/publication of the same work, not the representative volume sale year.
- Evidence rule: no inference from a volume date. Where an official source does not directly establish the start, the recommended value is left blank and the row is `unresolved`.
- Retrieval date for every source: **2026-08-22**.
- Candidate identity independently recomputed from the five manifest hashes: **`8b0ad5d8adf2e6638c72ebbee1fa16f02b8a531d4d4a61506704accb9a62d6cf`** (matches `manifest.json.candidateSha256`).
- Isolation: no Pass A, Gold annotation, prior-review conclusion, or `data/source/factors.csv` was used.

## 1. Official first-publication-year audit (all 50)

`source row` is the current row in `data/source/works.csv`; `candidate row` is the row in `data/staging/catalog-expansion/pilots/pilot-001/source/works.csv`.

| Work / workId | Rows (source / candidate) | Current | Official start | Decision | Official evidence and source date |
|---|---:|---:|---:|---|---|
| 違国日記 `work-0153a125c5a56225b06c` | 158 / 2 | 2017 | 2017 | keep | [FEEL YOUNG special index](https://feelyoung.jp/special/), 2017-10 archive, identifies the new work; page undated |
| ゴルゴ13 `work-0262dcaa820443c3185d` | 1491 / 3 | 1973 | 1968 | **change** | [小学館 Big Comic BROS](https://bigcomicbros.net/8278/), published 2018-05-13, explicitly says serialization began in 1968 |
| かくかくしかじか `work-07b11ec79f10c7eb7e05` | 191 / 4 | 2012 |  | unresolved; no write | [集英社 Cocohana work page](https://cocohana.shueisha.co.jp/story/higashimura/kakukaku/index.html), undated, does not state the start year; [vol.1 page](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-782457-5), product release 2012-07-25 only |
| しあわせは食べて寝て待て `work-07dc759bd91e1cffb2df` | 192 / 5 | 2021 | 2020 | **change** | [秋田書店 For Mrs. 2020年3月号](https://akitashoten.co.jp/formrs/2020/3), published 2020-02-03, says 新連載スタート |
| さよならミニスカート `work-07ff2a01ef593ce2f809` | 195 / 6 | 2018 | 2018 | keep | [集英社りぼん official special page](https://ribon.shueisha.co.jp/sayonara_miniskirt/), undated, says serialization from the September issue |
| ダイヤモンドの功罪 `work-081e75d8bbc53ac64713` | 196 / 7 | 2023 | 2023 | keep | [集英社 Young Jump work page](https://youngjump.jp/manga/diamond/) and [2023 archive](https://youngjump.jp/history/2023.html), 2023-02-09 / no.11 |
| 放浪息子 `work-0bec5d8d9474a2197312` | 214 / 8 | 2003 |  | unresolved; no write | [official anime book page](https://www.houroumusuko.jp/book/), undated, confirms serialization but not year; [KADOKAWA vol.1](https://store.kadokawa.co.jp/shop/g/g200700002446/), release 2003-07-25 only |
| 写らナイんです `work-112589a161d1596ec97f` | 238 / 9 | 2024 | 2024 | keep | [小学館 Sunday Webry episode 1](https://www.sunday-webry.com/episode/2550689798346084151), published 2024-03-27 |
| 透明なゆりかご `work-11296a590b885cb73b66` | 239 / 10 | 2015 | 2014 | **change** | [講談社 vol.1 bibliography / 初出](https://www.kodansha.co.jp/comic/products/0000036416), product 2015-05-13, says first appearance 2014年1月号 |
| YAWARA！ `work-14e489bf1afd1587c44a` | 1501 / 11 | 1987 | 1986 | **change** | [小学館 Urasawa digital official](https://bigcomicbros.net/urasawadigital/), undated, explicitly says serialization began in Big Comic Spirits in 1986 |
| 本なら売るほど `work-192cbecc59e9c028142b` | 280 / 12 | 2025 | 2022 | **change** | [KADOKAWA Harta vol.98](https://www.kadokawa.co.jp/product/322201000722/), published 2022-10-15; [KADOKAWA identity statement](https://www.kadokawa.co.jp/topics/16777/), published 2026-04-27, identifies the 2022 one-shot `本を葬送る` as chapter 1 |
| モンキーターン `work-1cf7a0bb5f55e0d69b27` | 1506 / 13 | 1997 | 1996 | **change** | [official-project annual report in NDL](https://www.dl.ndl.go.jp/view/prepareDownload?contentNo=8&itemId=info%3Andljp%2Fpid%2F3497453), report published 2005-02, explicitly says Weekly Shonen Sunday serialization began in 1996 |
| エマ `work-1fc61ddbeb429b4a2c15` | 328 / 14 | 2002 | 2002 | keep | [licensed anime official original page](https://www.emma-victorian.com/original.html), undated, says debut in Comic Beam 2002 January issue |
| 坂道のアポロン `work-205e576ef057e3aed1ab` | 333 / 15 | 2008 | 2007 | **change** | [小学館 月刊flowers author page](https://flowers.shogakukan.co.jp/author/267/), undated, states 2007–2012 |
| 王様ランキング `work-222504590507d3ab8093` | 343 / 16 | 2019 | 2017 | **change** | [creator/rightsholder official news](https://osama-ranking.com/news/?id=57061), published 2021-04-08, explicitly says web serialization began in 2017 |
| ふつうの軽音部 `work-268e1fa3599955359969` | 372 / 17 | 2024 | 2023 | **change** | [集英社 Jump Rookie series](https://rookie.shonenjump.com/series/pGBIkZlifOI), episode 1 published 2023-01-07; official page links the original to the Jump+ serial |
| あずみ `work-2f39795212f5ad8db155` | 1514 / 18 | 1995 | 1994 | **change** | [official licensed Bunkamura production page](https://www.bunkamura.co.jp/cocoon/lineup/20_azumi.html), 2020 production page (notice 2020-03-26), states Shogakukan serialization 1994–2008 |
| ギャラリーフェイク `work-303d0a9d67a606a817af` | 1516 / 19 | 1992 | 1992 | keep | [小学館 Big Comic BROS work page](https://bigcomicbros.net/work/6336/), undated, explicitly says serialization began in 1992 |
| 北北西に曇と往け `work-34bba03e2a127ef29cd7` | 430 / 20 | 2017 | 2016 | **change** | [KADOKAWA Harta vol.33](https://www.kadokawa.co.jp/product/321602000349/), published 2016-04-15, says the serial began in the previous issue |
| 海が走るエンドロール `work-3588928ab8f6a2520923` | 436 / 21 | 2021 | 2020 | **change** | [秋田書店 Mystery Bonita 2020年11月号](https://akitashoten.co.jp/bonita/2020/11), published 2020-10-06, says 新連載 |
| 路傍のフジイ `work-37ecced0b2392d7af9b2` | 454 / 22 | 2023 | 2023 | keep | [小学館 Big Comic BROS Spirits index](https://bigcomicbros.net/allworklist-spirits/), undated, record says 2023/05 |
| ましろのおと `work-3823ff0766f67c015c53` | 455 / 23 | 2010 | 2010 | keep | [講談社 vol.1 bibliography](https://www.kodansha.co.jp/comic/products/0000043275), product 2010-10-15, states Track 0 in 2010 January issue and regular serial in May issue |
| 名探偵コナン `work-39555fe7402dada0d79f` | 1521 / 24 | 1994 | 1994 | keep | [小学館 official news](https://www.shogakukan.co.jp/news/476148), published 2024-01-10, says serialization began with issue 5 sold 1994-01-05 |
| バラ色の明日 `work-440f93a4e60ef906685b` | 1529 / 25 | 1997 | 1997 | keep | [集英社 Bessatsu Margaret 1997 archive](https://betsuma.shueisha.co.jp/memories/magazine/1995_1999/1997/01.html), undated archive, identifies the January 1997 issue as series start |
| 大奥 `work-464322afcd10013437b9` | 526 / 26 | 2005 | 2004 | **change** | [白泉社 official notice](https://www.hakusensha.co.jp/information/62987/), published 2022-03-09, says serialization ran from the 2004 August issue |
| 天は赤い河のほとり `work-4a8a22fc766bf9bc4c59` | 1531 / 27 | 1995 | 1995 | keep | [小学館 official news](https://shogakukan-comic.jp/news/68631), published 2026-06-19, explicitly states 1995 start |
| ゴールデンゴールド `work-5e7eef6cc23d9738e034` | 650 / 28 | 2016 | 2015 | **change** | [講談社 vol.1 bibliography / 初出](https://www.kodansha.co.jp/comic/products/0000018813), product 2016-06-23, says first appearance 2015年12月号 |
| 銀の匙 Silver Spoon `work-61f2b70ee9f8217b3604` | 667 / 29 | 2011 | 2011 | keep | [小学館 AD Pocket](https://adpocket.shogakukan.co.jp/mangaplanning/detail/d6245609f9341aa8022554b45ea8d79e90ea83184e739b82629204b7dc6f9e80/), undated, says 2011 issue 19; [Web Sunday notice](https://websunday.net/5176/), published 2011-04-06 |
| 陽だまりの樹 `work-671e3453cf9e1df2ee87` | 1546 / 30 | 1983 | 1981 | **change** | [手塚プロダクション official work page](https://tezukaosamu.net/jp/manga/380.html), undated, gives serialization 1981-04-25 through 1986-12-25 |
| 妖しのセレス `work-76c038b398f4b28b7748` | 1551 / 31 | 1996 |  | unresolved verification; no write | [official VIZ copyright catalog](https://www.viz.com/copyrights), undated, gives `© 1996 Yuu WATASE/SHOGAKUKAN`, but this is not a direct serialization-start statement |
| 君と宇宙を歩くために `work-7730845c9cf7ba0cccc8` | 764 / 32 | 2023 | 2023 | keep | [講談社 press release PDF](https://www.kodansha.co.jp/upload/pr.kodansha.co.jp/files/pdf/2024/20240402_mangataisho2024.pdf), published 2024-04-02, explicitly says serialization began 2023-06 |
| 恋は雨上がりのように `work-8716f80d9b988bd0d055` | 859 / 33 | 2015 | 2014 | **change** | [小学館 Big Comic BROS Spirits index](https://bigcomicbros.net/allworklist-spirits/), undated, record says 2014/06 |
| 漂流教室 `work-98d513b70560f2f96a38` | 1561 / 34 | 1974 | 1972 | **change** | [小学館 AD Pocket](https://adpocket.shogakukan.co.jp/mangaplanning/detail/8e93e440f571a4dac32666ef784bf1f995b3ae865d4a9aa0ef981a44442ad39e/), undated, says Weekly Shonen Sunday 1972 no.23–1974 no.27 |
| かげきしょうじょ!! `work-9d04c47e7efbbbd8aca6` | 978 / 35 | 2015 | 2015 | keep | [Media Arts DB, MELODY 2015 no.4](https://mediaarts-db.artmuseums.go.jp/id/M677823), dated 2015-02-28; [白泉社 Season Zero relation](https://www.hakusensha.co.jp/comicslist/53883/), product 2019-03-05 |
| ポーの一族 `work-9d5d64262dbc2893acd4` | 1567 / 36 | 1974 | 1972 | **change** | [小学館 official news](https://www.shogakukan.co.jp/news/240678), published 2019-12-14, says original serial ran 1972–1976 |
| うる星やつら `work-a089c0eef91d1213da38` | 1568 / 37 | 1980 | 1978 | **change** | [小学館 AD Pocket](https://adpocket.shogakukan.co.jp/mangaplanning/detail/477e2d13152129e72c4a47a5abed06ce422daff2ca0e99d33bc527477effee34/), undated, says 1978 no.39 through 1987 no.8 |
| 海街diary `work-a7a1e0666169f1b2e8c0` | 1037 / 38 | 2007 | 2006 | **change** | [小学館 AD Pocket](https://adpocket.shogakukan.co.jp/mangaplanning/detail/fb48aaf65ec04e4bcfcb01a417e4a0c20297982b5fc67845b287707c0a95c465/), undated, says serialization from 月刊flowers 2006 August issue |
| Papa told me `work-ad2b80b81b7bc9b602a3` | 1578 / 39 | 1988 |  | unresolved verification; no write | [集英社 MANGA MILLION copyright page](https://mangamillion.shueisha.co.jp/copyright), undated, gives `© 1987`, but does not directly state first serialization/publication |
| 天幕のジャードゥーガル `work-b2c37bdb52e2a78dfd41` | 1099 / 40 | 2022 | 2021 | **change** | [秋田書店 Souffle episode 1](https://souffle.life/manga/tenmaku-no-ja-dougal/20210925/), published 2021-09-25, says 新連載始動 |
| Dr.コトー診療所 `work-b4b21d2ebe5b8efc84ea` | 1580 / 41 | 2000 | 2000 | keep | [薩摩川内市 official page](https://www.city.satsumasendai.lg.jp/kanko_bunka_sports/kankojoho/3/9136.html), updated 2023-03-27, says the manga began in Heisei 12 (2000) |
| 風光る `work-c4abbc1b44fa5706bce3` | 1587 / 42 | 1997 | 1997 | keep | [小学館 official news](https://shogakukan-comic.jp/news/24951), published 2020-05-28, says serialization began in 1997 |
| ダンダダン `work-cdf549d4b1888153e146` | 1230 / 43 | 2021 | 2021 | keep | [集英社 Jump+ episode 1](https://shonenjumpplus.com/episode/3269632237310729754), published 2021-04-06 |
| 女の園の星 `work-d489f5a2229689aa5115` | 1263 / 44 | 2020 | 2020 | keep | [creator announcement](https://x.com/wymaaa/status/1203204442541056000), 2019-12-07; [Media Arts DB, FEEL YOUNG 2020年2月号](https://mediaarts-db.artmuseums.go.jp/id/M1038471), 2020-01-08; [FEEL YOUNG editorial](https://note.com/feelyoung_ed/n/na1c33d1d34d2), 2020-07-21 |
| 深夜食堂 `work-d7e64b0b5479ca943edd` | 1288 / 45 | 2007 | 2006 | **change** | [小学館 Big Comic BROS](https://bigcomicbros.net/78774/), published 2023-07-20, says serialized since 2006 |
| これ描いて死ね `work-e049c9aaf92ba31da8b0` | 1333 / 46 | 2022 | 2021 | **change** | [小学館 award PDF](https://www.shogakukan.co.jp/storage/files/prize/2025/70mangashow.pdf), published 2025-01-17, records ゲッサン 2021年12月号～ |
| 鈴木先生 `work-ebe399258f28460b8f9b` | 1390 / 47 | 2006 |  | unresolved; no write | No qualifying publisher/magazine/rightsholder statement of the serialization start found. [双葉社 official product/API record](https://www.futabasha.co.jp/book/97845759402370000000?type=1) proves vol.1 release 2006-08-11 only |
| その女、ジルバ `work-ef7106f6a387c9860877` | 1408 / 48 | 2013 | 2011 | **change** | [小学館 official news](https://shogakukan-comic.jp/news/28579), published 2021-01-09, says serialized 2011–2018 |
| アイアムアヒーロー `work-f391e591282e435a3c1d` | 1427 / 49 | 2009 | 2009 | keep | [小学館 Big Comic BROS Spirits index](https://bigcomicbros.net/allworklist-spirits/), undated, record says 2009/04–2017/02 |
| 11人いる！ `work-f50fa290eb4116a7078e` | 1608 / 50 |  | 1975 | **change** | [小学館 official news](https://shogakukan-comic.jp/news/17107), published 2019-03-26, says it was presented in 別冊少女コミック in 1975 |
| ばらかもん `work-f5f0ee0b0ff16bc146e0` | 1439 / 51 | 2009 | 2008 | **change** | [Square Enix official magazine archive](https://blog.square-enix.com/magazine/powered/2008/04/), published 2008-04-03, records the first special one-shot in the April 2008 issue |

### Exact confirmed year writes

Apply the following **26** `firstPublishedYear` writes to both the source row and the frozen-candidate row identified above; do not write the five unresolved rows.

```text
work-0262dcaa820443c3185d 1973 -> 1968
work-07dc759bd91e1cffb2df 2021 -> 2020
work-11296a590b885cb73b66 2015 -> 2014
work-14e489bf1afd1587c44a 1987 -> 1986
work-192cbecc59e9c028142b 2025 -> 2022
work-1cf7a0bb5f55e0d69b27 1997 -> 1996
work-205e576ef057e3aed1ab 2008 -> 2007
work-222504590507d3ab8093 2019 -> 2017
work-268e1fa3599955359969 2024 -> 2023
work-2f39795212f5ad8db155 1995 -> 1994
work-34bba03e2a127ef29cd7 2017 -> 2016
work-3588928ab8f6a2520923 2021 -> 2020
work-464322afcd10013437b9 2005 -> 2004
work-5e7eef6cc23d9738e034 2016 -> 2015
work-671e3453cf9e1df2ee87 1983 -> 1981
work-8716f80d9b988bd0d055 2015 -> 2014
work-98d513b70560f2f96a38 1974 -> 1972
work-9d5d64262dbc2893acd4 1974 -> 1972
work-a089c0eef91d1213da38 1980 -> 1978
work-a7a1e0666169f1b2e8c0 2007 -> 2006
work-b2c37bdb52e2a78dfd41 2022 -> 2021
work-d7e64b0b5479ca943edd 2007 -> 2006
work-e049c9aaf92ba31da8b0 2022 -> 2021
work-ef7106f6a387c9860877 2013 -> 2011
work-f50fa290eb4116a7078e blank -> 1975
work-f5f0ee0b0ff16bc146e0 2009 -> 2008
```

Unresolved/no-write rows: `work-07b11ec79f10c7eb7e05`, `work-0bec5d8d9474a2197312`, `work-76c038b398f4b28b7748`, `work-ad2b80b81b7bc9b602a3`, `work-ebe399258f28460b8f9b`. Their official-start output remains blank; existing values must not be represented as officially verified.

Boundary notes:

- `本なら売るほど`: 2022 is correct under the stated contract because KADOKAWA identifies the renamed 2022 one-shot as chapter 1. If the product deliberately records exact-title serial launch only, the alternative is 2023-09-15; that is a different identity policy and must not be silently mixed.
- `かげきしょうじょ!!`: 2015 is the exact-title start. Hakusensha calls the prior Shueisha `かげきしょうじょ!` material a re-edited prequel/Season Zero; do not silently backdate `!!`.
- `ふつうの軽音部`: the official Jump Rookie publication is part of the work history and predates the 2024 collaborative Jump+ serial.
- Copyright years alone (`妖しのセレス`, `Papa told me`) were not promoted into start-year writes.

## 2. Representative-volume releaseDate / edition adjudication

The table below covers every currently blank `releaseDate` in the 50-row candidate. Rows with unresolved official conflict remain blank as requested. `source line` / `candidate line` refer to `data/source/volumes.csv` and the pilot `source/volumes.csv` respectively.

| Work / ISBN | Lines (source / candidate) | Recommended releaseDate | edition / volume | Official source and source date |
|---|---:|---:|---|---|
| 違国日記 / 9784396767174 | 162 / 2 |  | keep standard / 1; **leave blank** | [JPO Books](https://www.books.or.jp/book-details/9784396767174) says 2017-11-15, while the official production/editorial partner [Shu-Cream](https://shu-cream.com/published/%E9%81%95%E5%9B%BD%E6%97%A5%E8%A8%98-1%E5%B7%BB) says 2017-11-08; unresolved conflict |
| ゴルゴ13 / 9784845800018 | 1495 / 3 | **1989-03-01** | standard / 1 | [リイド社 product](https://www.leed.co.jp/9784845800018), product page undated |
| かくかくしかじか / 9784087824575 | 195 / 4 | **2012-07-25** | standard / 1 | [集英社 product](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-782457-5&mode=1), product page/release 2012-07-25 |
| 放浪息子 / 9784757715226 | 218 / 8 | **2003-07-25** | standard / 1 | [KADOKAWA product](https://store.kadokawa.co.jp/shop/g/g200700002446/), product page/release 2003-07-25 |
| 透明なゆりかご / 9784063409574 | 243 / 10 | **2015-05-13** | standard / 1 | [講談社 product](https://www.kodansha.co.jp/comic/products/0000036416), product page/release 2015-05-13 |
| YAWARA！ / 9784091813411 | 1505 / 11 | **1987-04-30** | standard / 1 | [小学館 product](https://www.shogakukan.co.jp/books/09181341), undated live bibliography; release field 1987-04-30 |
| 本なら売るほど / 9784047381070 | 284 / 12 | **2025-01-15** | standard / 1 | [KADOKAWA product](https://www.kadokawa.co.jp/product/322405000881/), product/release 2025-01-15 |
| モンキーターン / 9784091251619 | 1510 / 13 | **1997-02-18** | standard / 1 | [小学館 product](https://www.shogakukan.co.jp/books/09125161), undated live bibliography; release field 1997-02-18 |
| エマ / 9784047298804 | 332 / 14 | **2002-08-30** | keep standard / 1 | [KADOKAWA current ISBN record](https://www.kadokawa.co.jp/product/301407000933/), product/release 2002-08-30 |
| バラ色の明日 / 9784088487090 | 1533 / 25 |  | keep standard / 1; **leave blank** | Current 集英社 site exposes later bunko ISBN, while JPO/NDL only establish 1997 without a publisher-direct exact day for this ISBN |
| 天は赤い河のほとり / 9784091365019 | 1535 / 27 | **1995-05-26** | standard / 1 | [小学館 product](https://www.shogakukan.co.jp/books/09136501), undated live bibliography; release field 1995-05-26 |
| ゴールデンゴールド / 9784063886153 | 654 / 28 | **2016-06-23** | standard / 1 | [講談社 product](https://www.kodansha.co.jp/comic/products/0000018813), product/release 2016-06-23 |
| 銀の匙 Silver Spoon / 9784091231802 | 671 / 29 | **2011-07-15** | standard / 1 | [小学館 product](https://shogakukan-comic.jp/book?isbn=9784091231802), undated page; release field 2011-07-15 |
| 陽だまりの樹 / 9784091806017 | 1550 / 30 |  | keep standard / 1; **leave blank** | [JPO Books](https://www.books.or.jp/book-details/9784091806017) says 1983-05-30; [NDL national bibliography](https://ndlsearch.ndl.go.jp/) records 1983.7. No current 小学館 ISBN page resolves the conflict |
| 妖しのセレス / 9784091363541 | 1555 / 31 | **1996-12-11** | standard / 1 | [小学館 product](https://www.shogakukan.co.jp/books/09136354), undated live bibliography; release field 1996-12-11 |
| 恋は雨上がりのように / 9784091867285 | 863 / 33 | **2015-01-09** | standard / 1 | [小学館 product](https://www.shogakukan.co.jp/books/09186728), undated live bibliography; release field 2015-01-09 |
| 漂流教室 / 9784091200013 | 1565 / 34 | **1974-05-30** | standard / 1 | [JPO Books publisher-fed record](https://www.books.or.jp/book-details/9784091200013), undated database; release field 1974-05-30 |
| かげきしょうじょ!! / 9784592217268 | 982 / 35 | **2015-11-05** | standard / 1 | [白泉社 product](https://www.hakusensha.co.jp/comicslist/46806/), product/release 2015-11-05 |
| ポーの一族 / 9784091300010 | 1571 / 36 | **1974-05-28** | standard / 1 | [小学館 product](https://www.shogakukan.co.jp/books/09130001), undated live bibliography; release field 1974-05-28 |
| うる星やつら / 9784091204417 | 1572 / 37 |  | keep standard / 1; **leave blank** | JPO/NDL establish only 1980 for this ISBN; no qualifying exact official day was found |
| Papa told me / 9784088640136 | 1582 / 39 | **1988-02-19** | standard / 1 | [集英社 product](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08864013864013315501), live page gives paper release 1988-02-19 |
| 女の園の星 / 9784396767976 | 1267 / 44 | **2020-07-10** | standard / 1 | [JPO Books publisher-fed record](https://www.books.or.jp/book-details/9784396767976), release 2020-07-10 |
| 鈴木先生 / 9784575940237 | 1394 / 47 | **2006-08-11** | standard / 1 | [双葉社 official product](https://www.futabasha.co.jp/book/97845759402370000000?type=1) and official book API, undated live bibliography; release field 2006-08-11 |
| 11人いる！ / 9784091788115 | 1612 / 50 | **1986-10-15** | **volumeNumber blank; editionKind `complete`** | [NDL national bibliography record](https://ndlsearch.ndl.go.jp/books/R100000002-I000001820770) identifies a non-numbered 1986 one-volume book; [JPO Books](https://www.books.or.jp/book-details/9784091788115) gives release 1986-10-15; [小学館 exact-reproduction description](https://shogakukan-comic.jp/book?isbn=9784091792853), product 2019-03-26, says the source mook contains both `11人いる！` and `続・11人いる！ 東の地平 西の永遠` |

### Edition identity findings

- **11人いる！**: ISBN 9784091788115 is not a numbered original-series volume. It is the 1986 `萩尾望都スペースワンダー` one-volume collection; the publisher's exact-reproduction description establishes that it contains both the original and sequel. Keep `volumeNumber` blank, change `editionKind` from `standard` to `complete`, add `releaseDate=1986-10-15`. The work's `firstPublishedYear` remains the original story's 1975, not 1986.
- **エマ**: KADOKAWA has two official records for the same vol.1 and same paper release date: [original Enterbrain ISBN 9784757709720](https://www.kadokawa.co.jp/product/200700002181/) and [current ISBN 9784047298804](https://www.kadokawa.co.jp/product/301407000933/). The latter is not officially labeled a new/complete/bunko edition; do **not** infer a 2014 paper edition from third-party listings. Keep representative ISBN 9784047298804, `volumeNumber=1`, `editionKind=standard`, and set the official KADOKAWA date 2002-08-30, while retaining the old-ISBN relation in provenance notes.
- **陽だまりの樹**: ISBN 9784091806017 is standard vol.1, not the 1995 bunko (whose ISBN is 9784091920515). Keep the edition fields; leave `releaseDate` blank pending resolution of the official-record conflict.

## 3. Creator identity correction

- Pilot candidate `source/works.csv:10`, `work-11296a590b885cb73b66` (`透明なゆりかご`): change `creators` from **`沖田;華`** to the single pen name **`沖田×華`**. [講談社 official product](https://www.kodansha.co.jp/comic/products/0000036416), product date 2015-05-13. The semicolon incorrectly encodes two creators.
- Canonical `data/source/works.csv:239` is already `沖田×華`; no canonical source write is needed for this field, only candidate regeneration.
- Spacing variants such as `平井 大橋`, `児島 青`, `鍋 倉夫`, and `コノシマ ルカ` were not converted into identity changes: official display spacing varies and no delimiter-level identity split comparable to `沖田;華` was found.

## 4. Frozen URL mapping and safety/identity disposition

- Do not replace any frozen Rakuten `sourceUrl` merely because an official metadata URL was found. Official URLs above are new provenance/evidence records; the 50 frozen Rakuten mappings remain frozen until the packet is deliberately regenerated.
- No ISBN collision was found among these 50 representative rows.
- The material identity defects requiring regeneration are: 26 confirmed year writes, 20 confirmed `releaseDate` fills, the `11人いる！` edition change, and the one candidate-only creator delimiter correction.
- Four blank representative dates remain blank: 違国日記, バラ色の明日, 陽だまりの樹, うる星やつら.
- Five official-start-year rows remain unresolved/no-write: かくかくしかじか, 放浪息子, 妖しのセレス, Papa told me, 鈴木先生.

## 5. Root cause and regeneration warning

The imported rows historically mixed representative-volume sale years with work start years. `scripts/promote-library-only-expansion.ts` now writes `candidate.firstPublishedYear` to the Work and keeps the parsed Rakuten sale year separate from `releaseDate`; `scripts/repair-representative-isbns.ts` also preserves the candidate year. The 26 audited years were applied to both `data/source/works.csv` and `data/staging/catalog-expansion/candidates.csv`, so regeneration preserves them. Packet regeneration still changes the payload ledger and candidate SHA; final review artifacts must bind the new candidate identity.

