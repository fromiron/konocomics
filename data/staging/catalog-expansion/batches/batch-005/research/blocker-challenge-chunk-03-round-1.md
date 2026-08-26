# Batch 005 chunk 03 blocker challenge — round 1

## Review scope and contract

- Review date: `2026-08-25`
- `retrievedAt` for every route below: `2026-08-25`
- Positions challenged: `22`, `25`, `26`, `28`
- Review mode: independent blocker challenge; no inherited blocker conclusion was accepted without a fresh route check.
- Frozen source: `data/staging/catalog-expansion/batches/batch-005/frozen-work-set.csv` (SHA-256 `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`)
- Frozen adjudication snapshot: `text-final-chunk-03.csv` (SHA-256 `dcb6a9accea0933e3cbfd8fb79c4670156f39b32f5099a70b0601b6351cd3f29`)
- Existing challenge baseline: `reviews/daybreak-text-blocker-adjudication-chunk-03.md` (SHA-256 `6f7dcd357b13d113e72315236ec74813c3abb6186956df0019c73799b924c76d`)

The check used the entry-volume contract (volumes 1–3), the frozen representative edition, the Factor Dictionary, and the existing Narrative/Tone/Art gates. `unknown` was retained where the source could not support a value. No Art value was inferred from a review, cover, synopsis, or store genre label. The only Art conclusion in this report is whether a compliant exact-edition sample route now exists.

All URLs below were re-requested or opened on the review date. `HTTP 200` means the page/route was reachable; it does not by itself make the content usable evidence.

## Verdict summary

| position | workId | title | frozen gate snapshot | proposed blocker | round-1 verdict | reason |
|---:|---|---|---|---|---|---|
| 22 | `work-238c04ae3a3a61451078` | リューシカ・リューシカ | `Genre 1/1 · Theme 0/1 · Narrative 1/6 · Tone 3/7 · Art 0/4` | `SOURCE_INFORMATION_UNAVAILABLE` | **BLOCKER_SUPPORTED** | No new Theme/Narrative/Tone cell or exact-edition Art route met the gate; accessible store reviews were syndicated or non-entry-bounded. |
| 25 | `work-5ad62e6413f67d351f1d` | 天にひびき | `Genre 1/1 · Theme 0/1 · Narrative 2/6 · Tone 2/7 · Art 0/4` | `SOURCE_INFORMATION_UNAVAILABLE` | **BLOCKER_SUPPORTED** | BookWalker exposes a 12-page electronic preview, but does not bridge the frozen print ISBN; no residual Theme/Narrative/Tone evidence or compliant Art sample was established. |
| 26 | `work-5b7cf2105a4bc6f6b46c` | クジラの子らは砂上に歌う | `Genre 1/1 · Theme 2/1 · Narrative 3/6 · Tone 5/7 · Art 0/4` | `SOURCE_INFORMATION_UNAVAILABLE` | **BLOCKER_DEFEATED** | The Akita publisher product page directly links an exact-volume first-party ARC reader. Its JSON identifies the title, author, volume 1, and 45 pages; six readable body pages and two scene contexts are available for the required Art quorum. |
| 28 | `work-62fb5d8e9f6c6bbbeba9` | 血潜り林檎と金魚鉢男 | `Genre 1/1 · Theme 1/1 · Narrative 2/6 · Tone 3/7 · Art 0/4` | `SOURCE_INFORMATION_UNAVAILABLE` | **BLOCKER_SUPPORTED** | Exact frozen products have no linked preview; BookWalker’s usable sample is a later 新装版, and reviews repeat only already-known comedy/darkness rather than residual entry-range cells. |

## Position 22 — リューシカ・リューシカ

Frozen identity: Square Enix/Gangan Comics Online vol. 1, ISBN `9784757529083`, release `2010-06-22`. The existing terminal annotation has only `pacing=0`, `comedy=2`, `darkness=0`, and `mentalStress=0` known; Theme, five Narrative axes, and `romance`/`emotionalWarmth` remain unknown.

### Fresh route attempts

| route | URL | publication/route date | status on 2026-08-25 | bounded result |
|---|---|---|---|---|
| Square Enix official vol. 1 | https://magazine.jp.square-enix.com/top/comics/detail/9784757529083/ | `2010-06-22` | HTTP 200 | Exact title, author 安倍吉俊, ISBN, and entry synopsis. The page exposes purchase links but no current product-linked internal page sample. |
| Square Enix official vol. 2 | https://magazine.jp.square-enix.com/top/comics/detail/9784757532311/ | `2011-05-21` | HTTP 200 | Exact continuation identity; no linked sample/chapter sufficient for a new cell. |
| Square Enix official vol. 3 | https://magazine.jp.square-enix.com/top/comics/detail/9784757534155/ | `2011-11-22` | HTTP 200 | Exact continuation identity; no linked sample/chapter sufficient for a new cell. |
| Gangan Online publisher route | https://www.ganganonline.com/ | current route checked | HTTP 200 | The current site did not expose an exact ISBN-linked vol. 1 chapter/internal sample. The old Square Enix app announcement only records a historical limited digest, not a currently retrievable exact-edition cell. |
| BookWalker entry product | https://bookwalker.jp/de745bb4da-3c9e-455c-bdff-aac5ba4beb31/ | electronic edition; date not shown in route | HTTP 200 | Authorized sample/product metadata was reachable. It did not provide an edition-bound six-page sample tied to frozen ISBN `9784757529083` in the checked surface. |
| Comic Cmoa | https://www.cmoa.jp/title/65391/ | current store route | HTTP 200 | Editorial description and one user review. It supports ordinary/fantastical daily-life description but does not supply two missing Tone cells or the missing Narrative/Theme coverage. |
| honto | https://honto.jp/ebook/pd_35175202.html | current/free-sample page | HTTP 200 | Entry-volume review surface is present, but the displayed reviews are Booklog/syndicated material; no independent two-review threshold. |
| Sony Reader Store | https://ebookstore.sony.jp/review/title/00211004/id/BT000021100400100101 | reviews dated `2010-10-12` and later | HTTP 200 | Concrete user observations are available, but the page identifies Booklog-powered review content. Not counted as independent evidence. |
| BookLive | https://booklive.jp/product/index/title_id/211004/vol_no/001 | current store route | HTTP 200 | Same Booklog review corpus and entry synopsis; no independent source. |
| Rakuten Kobo sample | https://books.rakuten.co.jp/rk/91ce8f88c8e037bbb350aab313c18d9c/ | free-sample listing; period not current | HTTP 200 | Metadata/sample listing, but no currently usable exact-page packet or residual cell. |
| Renta! | https://renta.papy.co.jp/renta/sc/frm/item/43232/ | current store route | HTTP 200 | Series/sample surface reachable; no new bounded residual Factor evidence or exact-edition Art packet. |

### Review challenge

- MANTANWEB’s entry-volume editorial (`https://mantan-web.jp/article/20100813dog00m200026000c.html`, published `2010-08-13`) is a bounded vol. 1 recommendation and gives concrete incidents plus a warm/nostalgic reception. It is one editorial source, not the two independent reader-review route required by the existing blocker decision, and it cannot fill the remaining gate by itself.
- Mamba’s review (`https://manba.co.jp/topics/26585`) gives a concrete childhood-imagination/inner-world observation, but the page is a single community review and its publication display is relative rather than a precise entry-volume date. It is therefore retained as a possible future supplementary source, not counted as two independent reviews.
- Sony, BookLive, honto, and related store pages expose duplicated Booklog material. They are not independent corroboration.
- No checked source supplies a second independent, non-syndicated, entry-range observation that would add a distinct residual Tone axis. No official source supplies a Theme or the three additional Narrative cells required by the gate.

**Verdict: `BLOCKER_SUPPORTED`.** Bounded follow-up proposal: if a current Square Enix/Gangan Online product-linked packet becomes available, bind it to ISBN `9784757529083`; otherwise obtain two independently authored, non-syndicated entry-range reviews that each repeat a concrete residual Tone mechanism. Do not promote from the single MANTAN or single Mamba observation.

## Position 25 — 天にひびき

Frozen identity: Shonengahosha/Yang King Comics vol. 1, ISBN `9784785932909`, release `2009-12-28`. The terminal annotation has `progression=2`, `pacing=2`, `characterArcWeight=3`, and `relationshipStructure=2`; Theme remains empty, and the residual Narrative/Tone axes remain unknown.

### Fresh route attempts

| route | URL | publication/route date | status on 2026-08-25 | bounded result |
|---|---|---|---|---|
| Shonengahosha official vol. 1 | https://www.shonengahosha.co.jp/book_Info.php?id=6719 | `2009-12-28` | HTTP 200 | Exact title, author やまむらはじめ, ISBN `9784785932909`, and entry synopsis. No publisher trial/internal-page link in the checked HTML. |
| Shonengahosha official vol. 2 | https://www.shonengahosha.co.jp/book_Info.php?id=6369 | `2010-07-17` | HTTP 200 | Exact ISBN `9784785934248`; synopsis confirms later university/music context, but does not establish a dictionary Theme or additional required Narrative/Tone cells. |
| Shonengahosha official vol. 3 | https://www.shonengahosha.co.jp/book_Info.php?id=6619 | `2011-01-29` | HTTP 200 | Exact ISBN `9784785935573`; synopsis confirms renewed effort/reunion, already reflected in progression/character arc. No trial link. |
| Animate authorized vol. 3 listing | https://www.animate-onlineshop.jp/pn/%E3%80%90%E3%82%B3%E3%83%9F%E3%83%83%E3%82%AF%E3%80%91%E5%A4%A9%E3%81%AB%E3%81%B2%E3%81%B3%E3%81%8D+3/pd/1049192/ | `2011-01-29` | HTTP 200/search surface | Authorized product metadata and synopsis; no internal page packet or residual cell. |
| BookWalker vol. 1 | https://bookwalker.jp/de4f439ba9-dd74-4f55-8acd-d8137cc38e6a/ | electronic listing (`2013-04-15` distribution shown) | HTTP 200 | Authorized product page exposes a 12-page trial and exact series/volume title. It does not expose or bridge frozen print ISBN `9784785932909`; no six-page exact-edition Art packet was accepted. |
| BookWalker series | https://bookwalker.jp/series/4677/ | current series route | HTTP 200 | Volumes 1–10 and vol. 1/3 synopses visible; synopsis repetition does not create a new Factor cell. |
| Renta! | https://renta.papy.co.jp/renta/sc/frm/item/19195/ | current route; vol. 1 distribution `2012-06-26` | HTTP 200 | Entry sample and two user reviews. Reviews are generic reception and do not repeat a concrete residual Tone mechanism; no exact edition bridge. |
| dBook | https://dbook.docomo.ne.jp/item/a3564c8bc71f64bbf90588e26356aab6b803d39f871be71dfa4bf3a774339d4b/2000/ | electronic distribution `2013-11-12` shown | HTTP 200 | Authorized entry metadata and sample surface; no exact frozen print-edition bridge or additional gate cell. |
| Manba | https://manba.co.jp/boards/11564/books/1 | page date `2013-12-06` | HTTP 200 | Entry page/sample and one community review; no two independent reviews and no missing Factor coverage. |
| Sony Reader Store | https://ebookstore.sony.jp/review/title/10087064/id/LT000011886000312654 | review dates shown on page | HTTP 200 | Review surface is Booklog-powered/syndicated; not independent corroboration. |

### Review and dictionary check

- “音楽”, “音楽青春”, and university attendance are not automatically a `school` Theme under the dictionary; a recurring school/education mechanism across the entry range was not established.
- The official vol. 2/3 descriptions support the already-known progression and relationship/character-arc cells. They do not provide two further Narrative cells or three further Tone cells.
- BookWalker’s trial is a same-title electronic vol. 1 surface, but the checked page provides no frozen-print ISBN mapping. It therefore cannot satisfy the exact-edition Art rule or be used to claim Art values.
- Renta/Manba/Sony/BookLive review material did not produce two independent, non-syndicated, entry-range observations for the residual Tone axes.

**Verdict: `BLOCKER_SUPPORTED`.** Bounded follow-up proposal: obtain an exact edition-linked internal packet from product IDs `6719`, `6369`, or `6619`, or two independently authored entry-range reviews that repeat distinct residual Tone mechanisms. Do not use the BookWalker 12-page electronic surface as an Art value source without an explicit edition bridge and the six-page/two-context check.

## Position 26 — クジラの子らは砂上に歌う

Frozen identity: Akita Shoten/Bonita Comics vol. 1, ISBN `9784253261012` (publisher URL product code `4253261019`), release `2013-12-16`. The text snapshot remains below Narrative minimum (`3/6`), while Tone is `5/7`; all four Art axes are currently unknown.

### Fresh exact-edition route

| route | URL | publication/route date | status on 2026-08-25 | bounded result |
|---|---|---|---|---|
| Akita Shoten official vol. 1 | https://www.akitashoten.co.jp/comics/4253261019 | `2013-12-16` | HTTP 200 | Exact title, author 梅田阿比, ISBN `9784253261012`, and a publisher `試し読み！` link to the ARC reader below. This direct link defeats the earlier “unregistered route” assumption. |
| Akita Shoten ARC reader | https://arc.akitashoten.co.jp/comics/kojiranoko/1 | route current on review date | HTTP 200 | First-party publisher reader reached directly from the exact vol. 1 product page. The route title/author match the frozen work. |
| ARC episode JSON | https://arc.akitashoten.co.jp/comics/kojiranoko/1.json | `created_at 2013-12-12`, updated `2015-06-15` | HTTP 200 | JSON identifies `title=クジラの子らは砂上に歌う`, `author=梅田阿比`, `volume=1`, `page_count=45`, and exposes official page URLs. Retrieved JSON SHA-256: `8569535d979bc9f4a5368c46e692ff1133dba0ace2b3d27a180934925989dcf2`. |
| Akita Shoten official vol. 2 | https://www.akitashoten.co.jp/comics/4253261027 | official vol. 2 | HTTP 200 | Exact series/volume identity; no need to infer a new Factor from later synopsis. |
| Akita Shoten official vol. 3 | https://www.akitashoten.co.jp/comics/4253261035 | official vol. 3 | HTTP 200 | Exact series/volume identity and later synopsis; not used to force Narrative values. |
| Akita series page | https://www.akitashoten.co.jp/series/3463 | current series route | HTTP 200 | Confirms the publisher’s series identity and volume bridge. |

### Sample packet audit

The reader’s official page images at orders 4–9 were fetched transiently; no repository path was modified or used to retain them. They are all readable 1450×2057 JPEG body pages, not covers/ads. The individual SHA-256 values are:

| page order | official image URL | transient SHA-256 |
|---:|---|---|
| 4 | https://arc.akitashoten.co.jp/comics/kojiranoko/1/4?style=pc | `5267b559b1b94d3b3db55b27e3abcecbf927dea5234e8958e098c162a5202ca8` |
| 5 | https://arc.akitashoten.co.jp/comics/kojiranoko/1/5?style=pc | `499baf43abe445f2c224edd63d01c53228869e0768b4779c455c579c85f5bb22` |
| 6 | https://arc.akitashoten.co.jp/comics/kojiranoko/1/6?style=pc | `662dd7d48b21a5ccedcc544a4f56e9011ad08e56c3282ba5979958fb08bf92ba` |
| 7 | https://arc.akitashoten.co.jp/comics/kojiranoko/1/7?style=pc | `d0242000a68c5c33b5db2bf66a57bb867c0e4b999ca9655cba17959fddca274a` |
| 8 | https://arc.akitashoten.co.jp/comics/kojiranoko/1/8?style=pc | `7198867a4aa18bd890d756f2a6588b9a7818163fed12df9a9ea18d0ae76bab45` |
| 9 | https://arc.akitashoten.co.jp/comics/kojiranoko/1/9?style=pc | `dc34ceca0dd9ecd4d1bbd7c1b82b304cf3ac4e20c7990a805fdde99f8822f4c3` |

The six-page set contains at least two distinct scene contexts (ship/outdoor world-building and character/group scenes) and is directly tied by the publisher product page and reader metadata to frozen vol. 1. This is a compliant sample-ready Art route under the current preflight policy. It does **not** assign any Art values: Local + Gemini must perform the required Art review, and only extreme/conflicting results proceed to adjudication.

### Other route checks

The official Anime introduction (`https://kujisuna-anime.com/introduction/`) and Akita campaign (`https://akitashoten.co.jp/topics/bonita`) were also reachable, but later-series descriptions were not substituted for entry-volume Factor evidence. Honzuki/Cmoa/Goodreads/BookLive reviews were not needed to defeat the blocker and were not used for Art.

**Verdict: `BLOCKER_DEFEATED`.** The proposed `SOURCE_INFORMATION_UNAVAILABLE` blocker is no longer supported because a new exact-edition, first-party internal sample route exists. Next action is a fresh Local+Gemini Art quorum and a separate Narrative evidence check; do not write Art values in this challenge report.

## Position 28 — 血潜り林檎と金魚鉢男

Frozen identity: KADOKAWA/Dengeki Japan Comics vol. 1, ISBN `9784048860499`, release `2011-10-15`. The terminal snapshot has Genre `action;fantasy;horror`, Theme `combat=2`, Narrative `pacing=2`, `worldBuilding=2`, Tone `relationshipStructure=2`, `comedy=2`, `darkness=4`; `progression`, `problemSolving`, `strategy`, `characterArcWeight`, `mentalStress`, `romance`, and `emotionalWarmth` remain unknown.

### Fresh route attempts

| route | URL | publication/route date | status on 2026-08-25 | bounded result |
|---|---|---|---|---|
| KADOKAWA official vol. 1 | https://www.kadokawa.co.jp/product/201108000200/ | `2011-10-15` | HTTP 200 | Exact frozen ISBN/title/author and entry synopsis. Current HTML has no usable `試し読み`/BookWalker link; product metadata reports no trial. |
| KADOKAWA official vol. 2 | https://www.kadokawa.co.jp/product/201111000282/ | `2012-02-15` | HTTP 200 | Exact continuation and Media Arts Festival jury recommendation. No internal sample; user review text is not sufficient for residual gate coverage. |
| KADOKAWA official vol. 3 | https://store.kadokawa.co.jp/shop/g/g311781600000/ | `2012-12-15` | HTTP 200 | Exact final-volume metadata and synopsis (“彼女の策略”); one local tactic is not dictionary-level recurring strategy, so no new `strategy` value was proposed. |
| KADOKAWA series page | https://store.kadokawa.co.jp/shop/series/series00088101 | current series route | HTTP 200 | Confirms all three frozen volumes; no exact preview packet. |
| BookWalker 新装版 vol. 1 | https://bookwalker.jp/de233d22bb-4e73-4149-a72a-080cbd5c5030/ | `2016-01-22` digital edition | HTTP 200 | Legal sample is available, but this is the later `新装版` and explicitly differs in contents/edition from frozen ISBN `9784048860499`; rejected for exact-edition Art. |
| BookWalker series (新装版) | https://bookwalker.jp/series/58987/ | `2016` digital series | HTTP 200 | Confirms 3 new-edition volumes and added material; not a frozen-edition route. |
| Rakuten Books exact ISBN | https://books.rakuten.co.jp/rb/11364746/ | `2011-10` listing; reviews dated `2011-10-16`, `2012-02-22`, `2012-09-10` | HTTP 200 | Exact product and several user observations (strange world, jokes, horror). They repeat already-known `comedy`/`darkness`; no missing Narrative/Tone cell. |
| KADOKAWA user-review surface | https://www.kadokawa.co.jp/product/201108000200/ | review dates not all visible | HTTP 200 | User review content is attached to the exact product but does not independently establish the residual progression/problem-solving/strategy or Tone cells. |
| Bookmeter exact original volume | https://bookmeter.com/b/4048860496 | current page | HTTP 200 | Exact original-volume page; review payload was not available in the checked response, so no evidence cell. |
| Goodreads exact volume | https://www.goodreads.com/book/show/18997194-1 | `2011-10-15` first publication shown | HTTP 200/search surface | Exact volume identity and community ratings/reviews; no bounded Japanese entry-range observation that fills a residual axis. |
| Akamegane independent blog | https://akamegane365museum.blog.fc2.com/blog-entry-381.html | `2014-07-19` | HTTP 200 via direct HTTP fallback | Independent article covers volumes 1–3 together. It is not entry-volume bounded; its review cannot be used to promote a missing cell. |
| Ameblo “漫画と珈琲” | https://ameblo.jp/gainzbourg1991/entry-12203391616.html | `2016-10-01` URL date | HTTP 200 | The author explicitly says the book was not read; rejected as evidence. |

### Review and dictionary check

- Exact-product reviews on Rakuten/KADOKAWA mention the unusual world, jokes, and horror, but those cells are already known and do not create the two missing Narrative or two missing Tone cells.
- The official vol. 3 word “策略” is a single plot tactic. The dictionary’s `strategy` requires sustained planning/resource/war/political management; no value was added. Combat/rescue synopsis text likewise does not automatically become `problemSolving`.
- The only currently visible BookWalker internal sample is the later 新装版, which contains edition changes and additional short works. It cannot be used for the frozen first-edition Art gate.
- No two new independent, non-syndicated entry-range reviews repeat one of the residual Tone mechanisms. No exact product-linked six-page/two-context Art route was found.

**Verdict: `BLOCKER_SUPPORTED`.** Bounded follow-up proposal: only a product-linked preview explicitly mapped to frozen ISBN `9784048860499`, or two independent entry-range reviews with distinct residual Tone observations, can reopen this blocker. Do not use the 新装版 sample or the single local `策略` synopsis as a substitute.

## Challenge disposition

- Supported blockers: positions `22`, `25`, and `28`.
- Defeated blocker: position `26` only.
- No source/terminal/generated/promotion file was edited by this challenge. No Factor, Theme, Genre, or Art value was changed. The pos. 26 route is only sample-ready and must be passed through the existing Art quorum and normal promotion gate.
