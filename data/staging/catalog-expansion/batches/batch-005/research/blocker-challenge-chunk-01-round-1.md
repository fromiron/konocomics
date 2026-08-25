# Batch 005 chunk 01 blocker challenge — round 1

## Review scope and contract

- Review date: `2026-08-25`
- `retrievedAt` for every route below: `2026-08-25`
- Positions challenged: `3`, `4`, `7`
- Review mode: independent blocker challenge; the proposed blocker was not accepted without a fresh route check.
- Frozen source: `data/staging/catalog-expansion/batches/batch-005/frozen-work-set.csv` (SHA-256 `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`)
- Frozen text snapshot: `data/staging/catalog-expansion/batches/batch-005/adjudication/text-final-chunk-01.csv` (SHA-256 `930896b683110c6bd3f3a0c43a64ade38bf32a770b71493459523b89e949365f`)
- Frozen Genre snapshot: `data/staging/catalog-expansion/batches/batch-005/adjudication/genres-final-chunk-01.csv` (SHA-256 `ecd78e2a747f054211a898f883f1650a3e4c795a48badbc6e2f4c24e299a27c1`)
- Frozen Theme snapshot: `data/staging/catalog-expansion/batches/batch-005/adjudication/themes-final-chunk-01.csv` (SHA-256 `ea18f67d14f909f0c14cfdb50e84d9cf448a99dd13c11a1cf239245c171adb12`)
- Frozen Art snapshot: `data/staging/catalog-expansion/batches/batch-005/art-review/chunk-01/final-art.csv` (SHA-256 `2b915b96a67852f8c38b4abcd4d0a000b9cae00a2e05f56f4a27f0a229e4fb67`)
- Existing blocker baseline: `data/staging/catalog-expansion/batches/batch-005/reviews/daybreak-text-blocker-adjudication-chunk-01-round-2.md` (SHA-256 `ff8776fc05ef728c6012912af2ecfd307a03cfd2123528eac6b4f4e35dcd4a94`)
- `reviewedByHuman=false`

The check used the entry-volume contract (volumes 1–3), the frozen representative edition, the Factor Dictionary, and the existing Narrative/Tone/Art gates. `unknown` was retained where the source could not support a value. No Art value was inferred from a review, cover, synopsis, store category, or user impression. The only Art conclusion in this report is whether a compliant exact-edition sample route now exists.

All URLs below were re-requested or opened on the review date. `HTTP 200` means that the route was reachable; it does not by itself make the content usable evidence.

## Verdict summary

| position | workId | title | frozen gate snapshot | proposed blocker | round-1 verdict | reason |
|---:|---|---|---|---|---|---|
| 3 | `work-091d231d37f037fb07e8` | インベスターZ | `Genre 0/1 · Theme 1/1 · Narrative 4/6 · Tone 0/7 · Art 0/4` | `SOURCE_INFORMATION_UNAVAILABLE` | **BLOCKER_SUPPORTED** | Official product and editorial routes still provide no legal Genre, no additional admissible Tone coverage, and no edition-bound Art packet. The two bounded reader observations are concrete but do not repeat a residual Tone mechanism at the required threshold. |
| 4 | `work-0cf463005cc77eeded8e` | 黄泉のツガイ | `Genre 1/1 · Theme 1/1 · Narrative 3/6 · Tone 2/7 · Art 3/4` | `SOURCE_INFORMATION_UNAVAILABLE` | **BLOCKER_DEFEATED** | Two new directly authored, non-Booklog BookLive entries independently describe recurring humor/comic interaction in entry volume 1. This is a usable candidate for `comedy=2`; no terminal file is changed here and normal adjudication must rerun the Tone gate. |
| 7 | `work-0ebf010ac12b9b60d80e` | 機動旅団八福神 | `Genre 1/1 · Theme 1/1 · Narrative 2/6 · Tone 2/7 · Art 0/4` | `SOURCE_INFORMATION_UNAVAILABLE` | **BLOCKER_SUPPORTED** | KADOKAWA’s exact volume links still lead to BookWalker viewer shells with no deterministic body payload in the fresh browser check. The retained volume-1 pages remain unbound to frozen representative volume 9, and no two new independent non-syndicated reviews establish a residual cell. |

## Position 3 — インベスターZ

Frozen identity: Kodansha vol. 1, ISBN `9784063872576`, release `2013-09-20`. The terminal annotation has `progression=2`, `strategy=2`, `pacing=2`, and `worldBuilding=2` known, Theme `school=2`, no product Genre, all seven Tone axes unknown, and all four Art axes unknown.

### Fresh route attempts

| route | URL | publication/route date | status on 2026-08-25 | bounded result |
|---|---|---|---|---|
| Kodansha official vol. 1 | https://www.kodansha.co.jp/comic/products/0000018461 | `2013-09-20` | HTTP 200 | Exact title, author 三田紀房, ISBN, and investment-school synopsis. The product HTML has no work-specific internal body reader. |
| Kodansha official vol. 2 | https://www.kodansha.co.jp/comic/products/0000018483 | `2013-12-20` | HTTP 200 | Exact title/author/ISBN `9784063872798`; official synopsis adds the initial-investment and risk-management episode, which overlaps known progression/strategy rather than a missing Tone mechanism. |
| Kodansha official vol. 3 | https://www.kodansha.co.jp/comic/products/0000018518 | `2014-03-20` | HTTP 200 | Exact title/author/ISBN `9784063883152`; official “10万円から始める投資術” description is bounded educational/investment context, not legal product Genre or Tone evidence. |
| Kodansha vol. 1 trial route | https://www.kodansha.co.jp/comic/products/0000018461/trial | product route checked | HTTP 200, canonicalized to product | The route resolves back to the product page. No internal body-page payload or edition-bound trial was exposed. |
| Kodansha vol. 2 trial route | https://www.kodansha.co.jp/comic/products/0000018483/trial | product route checked | HTTP 200, canonicalized to product | Same result; no vol. 2 body packet. |
| Kodansha vol. 3 trial route | https://www.kodansha.co.jp/comic/products/0000018518/trial | product route checked | HTTP 200, canonicalized to product | Same result; no vol. 3 body packet. |
| Kodansha editorial, Cocreco | https://cocreco.kodansha.co.jp/cocreco/general/study/iRSxG?page=3 | `2024-09-30` | HTTP 200 | Describes the school/investment learning premise and factual finance examples. It does not establish a legal Genre or five repeatable Tone anchors. |
| BOOK☆WALKER authorized product | https://bookwalker.jp/de5f74b244-e8c3-496b-b1a6-e9b6eece51c9/ | electronic listing; date not shown | HTTP 200 | Store categories include finance/club/history-like labels. Those are retailer taxonomy leads, not one of the product Genre enum values, and no exact frozen-print six-page body packet was available. |
| Manga Award official commentary | https://www.mangataisho.com/data/2009/comment090324.pdf | `2009-03-24` | HTTP 200 | Selection context was reachable, but award provenance does not substitute for a product Genre or Factor evidence. |
| Comic Cmoa title and vol. 1 reviews | https://www.cmoa.jp/title/76196/ | review records include `2017-08-12` and `2022-05-09` | HTTP 200 | Product description and named reader entries are bounded to the early volume. They describe the protagonist as curious/competitive and investment learning as educational, but do not repeat five residual Tone mechanisms. |
| FC2 independent review | https://mushitori.blog.fc2.com/blog-entry-94.html | undated | HTTP 200 | The author discusses volumes 1–3, financial explanations, and a strategy example. This corroborates known strategy/educational context but does not provide a second repeatable residual Tone axis. |

### Review and dictionary check

- The Cmoa entries are concrete observations, but they are entry-volume comments about curiosity, competitiveness, and educational interest. They do not establish a repeated dictionary Tone axis at value 2 or higher across the required independent threshold.
- The FC2 article is one independent long-form source and covers volumes 1–3, but its concrete observations are about learning and strategy. It does not independently repeat a residual Tone mechanism with the Cmoa entries.
- Kodansha’s official descriptions establish investment, school, risk, and learning mechanisms. They do not supply a legal product Genre under the current ten-value Genre schema. Retailer categories were not copied into `Genre`.
- The three `/trial` routes are navigation aliases, not internal readers. No exact-edition six-body-page/two-context Art route exists in this fresh check.

**Verdict: `BLOCKER_SUPPORTED`.** Reopen only if a Kodansha product ID (`0000018461`, `0000018483`, or `0000018518`) exposes a genuine edition-bound reader, or if two new independently authored, non-syndicated, entry-range reviews repeat one concrete residual Tone mechanism. Do not convert the finance/education descriptions into a Genre or invent Tone values.

## Position 4 — 黄泉のツガイ

Frozen identity: Square Enix vol. 1, ISBN `9784757579620`, release `2022-06-10`. The terminal annotation has Genre `action;fantasy`, Theme `adventure=1` and `combat=2`, Narrative `pacing=3`, `mysteryReveal=2`, `worldBuilding=2`, Tone `relationshipStructure=2`, `darkness=2`; `progression`, `problemSolving`, `strategy`, `characterArcWeight`, `comedy`, `mentalStress`, `romance`, and `emotionalWarmth` remain unknown. Art has three known axes from the official first-episode sample; `motionImpact` remains unknown.

### Fresh route attempts

| route | URL | publication/route date | status on 2026-08-25 | bounded result |
|---|---|---|---|---|
| Square Enix official vol. 1 | https://magazine.jp.square-enix.com/top/comics/detail/9784757579620/ | `2022-06-10` | HTTP 200 | Exact title, author 荒川弘, ISBN, first-volume synopsis, and official first-episode link. |
| Square Enix official vol. 2 | https://magazine.jp.square-enix.com/top/comics/detail/9784757581005/ | `2022-09-12` | HTTP 200 | Exact vol. 2 identity and synopsis; its `第1話 試し読み` link is the same shared first-episode route, not a vol. 2 body packet. |
| Square Enix official vol. 3 | https://magazine.jp.square-enix.com/top/comics/detail/9784757584013/ | `2023-02-10` | HTTP 200 | Exact vol. 3 identity and synopsis; again links to the same first episode. |
| Square Enix official first episode | https://magazine.jp.square-enix.com/gangan/tcym/yomitsuga_01/ | first episode route | HTTP 200 | The exact official body sample remains the existing Art packet. It does not add a new Narrative/Tone value by metadata alone, and no new volume-specific body text route was found. |
| Next Manga Award official context | https://tsugimanga.jp/winner/2023/comics | `2023-08-31` | HTTP 200 | Award/selection provenance only; it is not a Factor value or a substitute for a residual Narrative/Tone observation. |
| BookLive vol. 1 review page | https://booklive.jp/review/list/title_id/20045746/vol_no/001 | entry-volume page; review dates include `2022-06-13` and `2024-01-12` | HTTP 200 | Two distinct, named, direct BookLive entries are not marked `Posted by ブクログ`: the BookLive editorial review describes hard early danger alongside repeated character banter/comic tone; reviewer エマ independently describes the entry volume’s strong tempo and humor. Both are bounded to vol. 1 and are concrete rather than a star rating. |
| Sony Reader vol. 3 review surface | https://ebookstore.sony.jp/review/title/10698755/id/LT000178283001729708/ | electronic vol. 3 route | HTTP 200 | Concrete review material is explicitly powered by ブクログ. It is retained as corroboration only and not counted as an independent non-syndicated review. |

### Review challenge and proposal

- The two direct BookLive entries provide a new, bounded, independently authored observation: comic interactions/gags recur alongside otherwise hard early events. This maps conservatively to `comedy=2` (“intermittent comedic scenes”) rather than `comedy=4`; no Art value is implied.
- The first BookLive entry is a store editorial, not a user star-rating summary, and the second is a named purchaser review. They are separately authored and are not labeled as Booklog syndication. The Sony/Booklog material is excluded from the independence count.
- The official vol. 1 synopsis describes the hard assault, village disruption, and character interactions; it does not contradict the review observation. The proposal remains supplemental text evidence and must be independently adjudicated before any CSV change.
- The new proposal does not assert any of `progression`, `problemSolving`, `strategy`, `mentalStress`, `romance`, or `emotionalWarmth`. Silence remains `unknown`.

**Verdict: `BLOCKER_DEFEATED`.** Fresh evidence defeats the recheck condition for one residual Tone cell. Proposed adjudication packet: `comedy=2`, confidence provisional `0.76`, evidence URLs `https://booklive.jp/review/list/title_id/20045746/vol_no/001` (two separate direct entries, retrieved `2026-08-25`) and the official vol. 1 synopsis above. Do not edit the terminal CSV from this report; rerun independent review and the Narrative/Tone promotion gate. Art remains unchanged and `motionImpact=unknown`.

## Position 7 — 機動旅団八福神

Frozen identity: KADOKAWA vol. 1 entry product, ISBN `9784757720923`, release `2004-12-25`; frozen representative is volume 9, ISBN `9784757746954`. The terminal annotation has Genre `action;scienceFiction`, Theme `combat=2` and `war=2`, Narrative `pacing=2` and `worldBuilding=2`, Tone `relationshipStructure=2` and `darkness=3`; all other Narrative/Tone axes and all four Art axes remain unknown.

### Fresh route attempts

| route | URL | publication/route date | status on 2026-08-25 | bounded result |
|---|---|---|---|---|
| KADOKAWA official vol. 1 | https://www.kadokawa.co.jp/product/200700002796/ | `2004-12-25` | HTTP 200 | Exact title/author/ISBN, war-and-occupation introduction, eight young soldiers, and BookWalker product link. |
| KADOKAWA official vol. 2 | https://www.kadokawa.co.jp/product/200700002920/ | `2005-06-25` | HTTP 200 | Exact title/ISBN `9784757723245`, continuation synopsis, and exact BookWalker link `https://bookwalker.jp/ded06fa6ff-4c2c-46be-b64c-75a5b94adb34/`. |
| KADOKAWA official vol. 3 | https://www.kadokawa.co.jp/product/200700003057/ | `2005-12-26` | HTTP 200 | Exact title/ISBN `9784757725621`, continuation synopsis, and exact BookWalker link `https://bookwalker.jp/ded58267a8-f4c8-4751-9065-aae9e8b46aaa/`. |
| BookWalker authorized vol. 2 sample | https://bookwalker.jp/ded06fa6ff-4c2c-46be-b64c-75a5b94adb34/?sample=1&from=1 | electronic trial route | HTTP 200 after redirect | Browser redirected through `viewer-trial.bookwalker.jp` to the viewer shell. Fresh Playwright observation loaded viewer HTML/CSS/loader JS but no deterministic body image, page JSON, or readable text payload after the bounded wait. |
| BookWalker authorized vol. 3 sample | https://bookwalker.jp/ded58267a8-f4c8-4751-9065-aae9e8b46aaa/?sample=1&from=1 | electronic trial route | HTTP 200 after redirect | Same viewer-shell result; no reproducible body payload was observed. |
| Hulu licensed series page | https://www.hulu.jp/comic/series/138521/chapter | undated | HTTP 200 | Licensed vol. 1–2 descriptions corroborate war, the Fuku-jin machine, and an additional eighth protagonist. No residual Tone/Narrative cell or Art packet. |
| Sony Reader vol. 3 | https://ebookstore.sony.jp/title/10102361/id/LT000016409000340695/ | electronic release `2014-03-08` | HTTP 200 | Licensed vol. 3 synopsis corroborates the occupied fictional Japan, unit, and peace question. Frozen representative remains vol. 9; no edition bridge. |
| KADOKAWA product review excerpts | the three KADOKAWA product URLs above | review dates vary | HTTP 200 | Excerpts are explicitly powered by Bookmeter. They repeat war, training, battle, and political context but are not new independent non-syndicated review routes. |
| BookLive licensed product | https://booklive.jp/product/index/title_id/247464/vol_no/001 | electronic listing `2014-03-11` | HTTP 200 | Licensed product metadata and sample shell are reachable, but no new independent review cell or exact frozen representative bridge was exposed. |
| Piro independent review | https://piro-ek0324.hatenablog.com/entry/2007/05/05/114256 | `2007-05-05` | HTTP 200 | One independent vol. 3 review discusses a battle/rescue, a discovered machine weakness, captivity, and political/philosophical dialogue. It is one source, not the required two-review corroboration, and is not used to infer Art. |

### Review and edition check

- KADOKAWA’s exact vol. 1–3 product pages establish product-to-BookWalker links, but the fresh BookWalker routes expose only a JavaScript viewer shell in the current browser run. No deterministic body-page payload was retained or claimed.
- The diagnostic six body pages from official volume 1 remain rejected for static Art because the frozen representative is volume 9 and no exact edition bridge was found. `unknown` is not low and no review was used for Art.
- KADOKAWA’s visible excerpts are Bookmeter-powered; Sony/Booklog material is likewise syndicated. The Piro article is a single independent review. The fresh set therefore does not contain two new independently authored, non-syndicated entry-range reviews that repeat one residual Tone mechanism.
- “Weakness discovery”, rescue, training, or a single tactical event were not promoted automatically to `problemSolving` or `strategy`; the dictionary requires a sustained mechanism. Plot summaries were not converted into `mentalStress`, `romance`, or `emotionalWarmth`.

**Verdict: `BLOCKER_SUPPORTED`.** Reopen only if a KADOKAWA-linked BookWalker route yields a deterministic body payload plus a frozen representative-volume bridge, or if two independent non-syndicated entry-range reviews repeat one concrete residual Tone mechanism. Any Art reopening still requires six readable body pages, two contexts, exact edition binding, and the Local+Gemini quorum.

## Challenge disposition

- Supported blockers: positions `3` and `7`.
- Defeated blocker: position `4` only, through a proposed text-only `comedy=2` cell.
- No source, terminal, generated, promotion, or Art CSV was edited by this challenge.
- No Factor, Theme, Genre, ISBN, safety, identity, or Art value was changed.
- Position 4’s proposed cell is not an approval; the normal independent review/adjudication path must verify evidence identity, range, and the Narrative/Tone gate before any promotion mutation.
