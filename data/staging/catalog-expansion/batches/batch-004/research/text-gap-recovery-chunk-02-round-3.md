# Batch 004 chunk 02 text-gap recovery — round 3

- Scope: frozen positions `11–20`; this round investigated only the exact official routes left in the round-2 handoff.
- Retrieval date: `2026-08-25`.
- Reviewer: research-only pass; `reviewedByHuman=false`.
- Repository HEAD at start: `a423c20add1162b7cdf71342a721ffcd7191d3c2`.
- Candidate-set SHA-256: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`.
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`.
- Round-2 packet SHA-256: `939befb76f08d8150b7f5209b3be5c6a294681502c22fe8c0cfbb76551c2ab28`.
- Terminal text CSV before this pass: `f4881fb929ca3256ce82efb2984998f325fc2383c3c6be8a1fa496e57d24fcea`.
- Mutation policy: no source CSV, terminal CSV, annotation, adjudication, overlay, promotion, generated artifact, registry, or Art file was edited. This note records proposals for independent adjudication only.
- Work titles are canonical text; decorative `『` and `』` are not part of any title.

## Round-3 outcome

One new direct Dictionary proposal is retained for independent adjudication:

| position | workId | proposal | status | reason |
|---:|---|---|---|---|
| 13 | `work-2c4fe00df5255fc082f9` | `strategy=2` | `PROPOSE` | The official first-episode page images expose a bounded short-term dispatch/resource-allocation process across pages 9–11. It is tactical resource management, not long-range planning, so `4` is not proposed. |

No other missing cell is promoted in this research note. The exact routes below either expose only a synopsis/bootstrap, repeat an already-known terminal cell, or remain blocked by a reproducible reader redirect. No round-2 rejected proposal is silently reintroduced. In particular, the following remain `unknown` unless a later adjudicator obtains a new direct anchor: `progression` for positions 11, 12, 13, 15, 16, 18, 19; `problemSolving` for 13, 16, 19; `strategy` for all positions other than the new position-13 proposal; and `mysteryReveal` for all seven positions.

## Dictionary and evidence boundary

The proposal uses the current `factor-dictionary.md` definition: `strategy=2` is an ordinary short plan/tactical or resource-management pattern; `strategy=4` requires long-range planning, war/politics, or sustained resource management as a central reward. The page-range observation below does not establish a long-range arc and therefore cannot support `4`.

Official descriptions, official reader bootstrap data, and official page-indexed reader images are primary evidence. Independent reviews are supplementary checks only. Review ratings, rankings, tags, selection provenance, title wording, and a single impression are not converted to factor values. No review text is copied into UI copy. Art is outside this packet; no art factor is inferred from text, reviews, or the temporary page captures.

## Official route ledger and direct observations

### 11 — Sunny (`work-23077ad33a2066bef5a6`)

| source | exact route | source date/year | retrieved | bounded observation |
|---|---|---|---|---|
| 小学館 TAMESHIYO, `Sunny 3` internal preview | https://sc-portal.tameshiyo.me/9784091886132 | product metadata `2013-01-30` | `2026-08-25` | HTTP 200; the official volume page exposes six episode entries and page-level reader metadata. |
| 小学館 product mapping | https://www.shogakukan.co.jp/books/09188613 | page date not exposed | `2026-08-25` | Confirms title/volume/rightsholder mapping for the same ISBN. |
| 小学館 e-comi volume-1 cross-check | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091885570000d0000000 | edition date not exposed | `2026-08-25` | Exact series/edition route was retained as a cross-check; no additional direct factor anchor appeared. |

The page-level sample covers daily facility life, a hospital visit, an outside television crew, and an escaped-pig incident. The “stairs of adulthood” language is a developmental framing, but the sampled episodes do not show repeated skill acquisition/mastery. It therefore does not reverse the round-2 rejection of `progression=2`; `progression` remains `unknown`. The single pig incident is not enough for `problemSolving`, and no plan/counter-plan or clue/reveal sequence is visible. No new numeric proposal is made.

### 12 — すみれファンファーレ (`work-2356050c72240569e1c5`)

| source | exact route | source date/year | retrieved | bounded observation |
|---|---|---|---|---|
| 小学館 e-comi reader, volume 2 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091886030000d0000000 | electronic re-release `2015-01-26` | `2026-08-25` | Redirects to the exact official `speedreader` route and returns HTTP 200; reader bootstrap and official description are available. |
| 小学館 e-comi reader, volume 3 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091886240000d0000000 | electronic re-release `2015-01-26` | `2026-08-25` | Same exact redirect/reader path; title, creator, edition and bounded description match. |
| 小学館 e-comi product, volume 2 | https://e-comi.shogakukan.co.jp/books/091886030000d0000000 | page date not exposed | `2026-08-25` | Confirms the volume identity. |
| 小学館 e-comi product, volume 3 | https://e-comi.shogakukan.co.jp/books/091886240000d0000000 | page date not exposed | `2026-08-25` | Confirms the volume identity. |

Volume 2 lists a hospital friendship, a sports festival, and a family eclipse; volume 3 lists a friend's first love, Valentine's Day exclusion, naming/reflection, tears, and discovering another side of an important person. These are repeated experiences and reflection, not repeated acquisition/mastery. The prior `progression=2` proposal remains rejected under the Dictionary. The route provides no goal-attempt-outcome problem-solving chain, tactical plan, or clue/reveal chain. No new numeric proposal is made.

### 13 — ヒーローカンパニー (`work-2c4fe00df5255fc082f9`)

| source | exact route | source date/year | retrieved | bounded observation |
|---|---|---|---|---|
| HERO'S Web, first episode part 1 | https://heros-web.com/episodes/abc82cfdbc52d/1 | live page migration displays `2026-05-18`; original entry basis in the bound ledger `2012-09-28` | `2026-08-25` | HTTP 200; exact title `第1目標 街の平和を守れ!!`, viewer identity and ordered page navigation exposed. |
| HERO'S Web, first episode part 2 | https://heros-web.com/episodes/abc82cfdbc52d/2 | same page-date caveat | `2026-08-25` | HTTP 200; the second part is the same first-episode reader and is bound to the same viewer. |
| HERO'S Web official viewer contents API | https://heros-web.com/api/book/contentsInfo?user-id=&comici-viewer-id=dabd9795266840ac34ce8aa585bf96cf&page-from=0&page-to=33 | reader response date not exposed | `2026-08-25` | Official response reports `totalPages=34`, ordered `sort=0..33`, width 844, height 1200; stable page references are used below, not signed image URLs. Capture SHA-256: `bea063fe0cc5ca3e3df911219a41c201bcd007e5e285fe248332e8969060ffb7`. |
| HERO'S Web series ledger | https://heros-web.com/series/634a04c316435 | page date not exposed | `2026-08-25` | Confirms `ヒーローカンパニー` / 島本和彦 and the episode map. |

#### New official page-range anchor

The opening reader pages are a new exact route beyond the round-2 static-shell check. Page references are reader page numbers (the API `sort` values are zero-based, so p09/p10/p11 correspond to `sort=8/9/10`). The temporary images were used for inspection only and are not committed.

| page range | concrete observation | Dictionary implication |
|---|---|---|
| p09 (`sort=8`) | The company command center allocates a job by importance, urgency, and difficulty; staff discuss which dispatch should be handled first. | A short tactical allocation/triage process is directly visible. |
| p10 (`sort=9`) | The equipment center manages queues, equipment sets, IDs, shortages, staffing, and time before dispatch. | Resource constraints are part of the immediate work process. |
| p11 (`sort=10`) | Staff explicitly weigh staff shortage, training time, wages, and equipment limits, then choose to dispatch to the scene first. | The bounded sequence resolves into an immediate tactical decision, not a long-range campaign. |

**Retained proposal:** `strategy=2`. The three-page sequence is sufficient for the Dictionary's short-plan/resource-management level, but only within the opening episode; it is not `strategy=4`. `problemSolving=2` is not proposed because the inspected range shows allocation and dispatch, not a complete protagonist analysis-and-solution reward. `progression`, `mysteryReveal`, and new Tone values remain unknown.

The official static episode synopsis still describes the profession as protecting people from incidents, accidents, and disasters. That supports the work setting and existing Genre/Theme, but the synopsis alone is not used as a factor value.

### 15 — キルアオ (`work-2df743e085adef5e9bd3`)

| source | exact route | source date/year | retrieved | bounded observation |
|---|---|---|---|---|
| 集英社 S-MANGA official reader, volume 2 | https://www.s-manga.net/reader/main.php?cid=08X10000000032350600 | `2023-11-02` | `2026-08-25` | HTTP 200; exact title/creator/release metadata and official description expose contest/role obstacles. |
| 集英社 S-MANGA official reader, volume 3 | https://www.s-manga.net/reader/main.php?cid=9784088837970 | `2024-01-04` | `2026-08-25` | HTTP 200; exact title/creator/release metadata and official description expose renewed abduction/pursuit. |

The descriptions corroborate the existing `problemSolving=2` terminal cell: explicit goal/obstacle/action situations occur across two volumes. They still do not show a mastery ladder for `progression`, a plan/counter-plan/resource sequence for `strategy`, or a clue-to-truth reward for `mysteryReveal`. No new cell is proposed.

### 16 — 尾守つみきと奇日常。 (`work-2f1d1c3ad0f943f1562f`)

| source | exact route | source date/year | retrieved | bounded observation |
|---|---|---|---|---|
| 小学館 TAMESHIYO, volume 2 | https://sc-portal.tameshiyo.me/9784098533817 | `2024-06-18` | `2026-08-25` | HTTP 200; official volume description and linked reader metadata expose the exact series. |
| 小学館 TAMESHIYO, volume 3 | https://sc-portal.tameshiyo.me/9784098535750 | `2024-09-18` | `2026-08-25` | HTTP 200; official volume description covers end-of-term/summer and relationship events. |
| linked volume-1 mapping | https://sc-portal.tameshiyo.me/9784098531820 | date not exposed | `2026-08-25` | Confirms the same publisher series/edition family. |

The official volume descriptions remain ordinary school/seasonal movement and relationship reflection. They do not expose repeated mastery, an analytical goal-attempt-outcome process, long-range planning, or clue/reveal reward. The existing `pacing=2` and `mentalStress=1` observations are not rewritten. No new numeric proposal is made.

### 18 — とろける鉄工所 (`work-39c1a2b6791238827ed5`)

| source | exact route | source date/year | retrieved | bounded observation |
|---|---|---|---|---|
| 講談社 volume-2 trial | https://www.kodansha.co.jp/comic/products/0000038651/trial | `2009-03-23` | `2026-08-25` | The same redirect loop reproduces; the route reaches the observed reader target but does not yield a stable body in this CLI pass. |
| observed reader target | https://www.kodansha.co.jp/comic/products/0000038651/trial/reader?cid=645023aab77a2c0eb51078a91e980b7054f76cb6e4e6212ba7199205e25bc0f | date not exposed | `2026-08-25` | Target is recorded for browser/session retry; it is not treated as read content. |
| 講談社 title ledger | https://www.kodansha.co.jp/titles/1000004427 | page date not exposed | `2026-08-25` | HTTP 200; confirms exact title/series identity. |

No new direct observation can responsibly be made from the redirecting trial. The existing `problemSolving=2` and `comedy=2` cells remain no-op; trade knowledge is not converted to `progression`, and no strategy/reveal anchor is fabricated. This is a route-access limitation, not a hard blocker or global source-exhaustion claim.

### 19 — 新しい上司はど天然 (`work-3ad85a2ffdc026007d61`)

| source | exact route | source date/year | retrieved | bounded observation |
|---|---|---|---|---|
| 秋田書店 volume-2 product | https://www.akitashoten.co.jp/comics/425314232X | `2020-05-20` | `2026-08-25` | HTTP 200; title, ISBN, release date, and volume-2 description exposed. |
| publisher-linked trial | https://mangacross.jp/comics/dotennen/1 | date not exposed | `2026-08-25` | Redirects to the current official Champion Cross series. |
| チャンピオンクロス series ledger | https://championcross.jp/series/068fd6dbdf163 | current site migration display `2024-03-29`; not treated as original publication | `2026-08-25` | Official synopsis/tags and ordered episode links exposed. |
| Champion Cross first five episode routes | https://championcross.jp/episodes/70d91aef3c691; https://championcross.jp/episodes/4ed6db31744c8; https://championcross.jp/episodes/ea82aaafe3245; https://championcross.jp/episodes/a8d3b4977cdad; https://championcross.jp/episodes/c55fcdec7eb8e | episode dates not exposed | `2026-08-25` | HTTP 200; exact episode titles `第1話`–`第5話`, viewer IDs, and the same official series synopsis are exposed. Static page text is not a panel transcript. |

The first five exact episode bodies are therefore reachable as official viewer shells, but their static HTML repeats the series synopsis rather than exposing panel events. The product/series text confirms recurring work/private situations and the episodic format, not a new analytical problem, tactical plan, or mastery ladder. The existing `pacing=2`, `comedy=2`, `mentalStress=1`, and `emotionalWarmth=2` observations remain no-op. No new cell is proposed.

## Independent entry-range review check

The following independent sources were read only after the official routes above. Each row uses reviews bounded to volume 1 or the opening episode/volume range. The observations are paraphrased, not copied; review dates/years are included where the page exposes them. They corroborate or challenge the official route but never override it by popularity or simple vote.

| position | independent source (title / route) | publication date/year | bounded concrete observation | adjudication use |
|---:|---|---|---|---|
| 11 | コミックシーモア, `Sunny` volume page/reviews — https://www.cmoa.jp/title/79928/ | review dates not uniformly exposed | Readers describe the shared facility, children from different backgrounds, and painful-but-caring daily scenes in the opening volume. | Corroborates `characterArcWeight`, relationships, warmth/darkness already bounded; no repeated mastery or plan/reveal anchor. |
| 11 | BookLive, `Sunny` volume-1 reviews — https://booklive.jp/review/list/title_id/268777/vol_no/001?spoiler=1 | review dates page-bound; retrieved `2026-08-25` | Opening-volume observations concern the facility's daily rhythm and child pressure/recovery. | No new Dictionary cell. |
| 12 | 楽天ブックス, `すみれファンファーレ` — https://books.rakuten.co.jp/rb/11536708/ | page date not exposed | Opening-volume descriptions/reviews frame child-scale encounters and reflection. | Does not establish progression as acquisition/mastery. |
| 12 | BookLive, volume 2 reviews — https://booklive.jp/product/index/title_id/294027/vol_no/002 | page date not uniformly exposed | Volume-2 observations remain encounter/reflection centered. | No strategy/problem-solving/reveal anchor. |
| 13 | Sony Reader Store, `ヒーローカンパニー 1` reviews — https://ebookstore.sony.jp/review/title/00192282/id/BT000019228200100101/ | review observations dated `2012-09-08`–`2012-10-28` on page | Independent readers describe the company-employed hero model, profit/contract constraints, and the opening employment test with incidents on the way. | Supports the official corporate/resource frame; it does not independently establish `strategy=2` alone, but is consistent with the official p09–p11 anchor. |
| 13 | honto, `ヒーローカンパニー 1` reviews — https://honto.jp/ebook/pd-review_0634950093.html | review observations dated `2012-09-08`–`2018-12-26` on page | Reviews independently describe a corporate hero system balancing public safety and profit, and the five young entrants/early test. | Independent corroboration of the same bounded work/resource frame; no extreme value. |
| 13 | BookLive, volume-1 reviews — https://booklive.jp/review/list/title_id/268310/vol_no/001 | review observations dated `2012-09-08` onward | Reviews describe the entry test, workplace hero setting, and direct incident obstacles. | Confirms scope/entry range; no `problemSolving=2` or `strategy=4` inference from review alone. |
| 15 | あくまでも趣味のブログ, volume-1/early review — https://aqm.hatenablog.jp/entry/2023/09/05/221106 | `2023-09-05` | Early-volume discussion centers on school re-entry, identity/role constraints, and action obstacles. | Corroborates existing `problemSolving=2`; no mastery/long plan/reveal anchor. |
| 15 | Hobby Forest, early-volume review — https://hobbyforest.com/2025/07/01/kiruaocomic/ | `2025-07-01` | Opening-range discussion centers on the protagonist's constrained role and contests/rescue situations. | No new cell; later-volume material was not used to fill entry gaps. |
| 16 | がんばってかくぞー, early review — https://ganbattekakuzoi.hatenablog.com/entry/2024/03/25/071400 | `2024-03-25` | Opening school/daily interactions and mild social pressure are the concrete focus. | Corroborates `pacing=2`, mild stress/warmth; no mastery/problem-solving/reveal. |
| 16 | BookLive, volume-1 reviews — https://booklive.jp/review/list/title_id/20078498/vol_no/001 | review dates page-bound | Early-volume reviews emphasize school rhythm and relationship observation. | No new Dictionary cell. |
| 18 | Manga Musou, opening review — https://mangamusou.com/shohyo/torokeru/ | page date not exposed | Opening work scenes are discussed as recurring practical welding/workplace situations. | Corroborates existing `problemSolving=2`; cannot substitute for the unread Kodansha volume-2 body. |
| 18 | コミックシーモア reviews — https://www.cmoa.jp/title/customer_review/title_id/60020/ | review dates page-bound | Readers repeatedly describe workplace process and humor. | Existing `comedy=2` no-op; no progression/strategy/reveal value. |
| 19 | コミックシーモア volume-1 reviews — https://www.cmoa.jp/title/181071/vol/1/ | concrete reviews dated `2021-08-27`–`2026-05-15` on page | Opening volume is described as repeated one-episode natural-boss jokes; readers repeatedly note relief/warmth after the former workplace harm. | Corroborates existing comedy, mild stress, and warmth; no new axis. |
| 19 | BookLive volume-1 reviews — https://booklive.jp/review/list/title_id/621874/vol_no/001 | concrete review dates include `2019-11-30`–`2021-10-09` | Opening-volume readers describe repeated laughter/comfort, the boss/employee relationship, and a few bounded everyday episodes. | No progression/problem-solving/strategy/reveal inference. |
| 19 | ミオの備忘録, work-1 review — https://mionote.hatenablog.com/entry/2023/12/29/100000 | `2023-12-29` | Independent entry-range summary emphasizes recovery from the former workplace and the new office's recurring natural-boss rhythm. | Same existing cells only; no new numeric proposal. |

The position-13 review set contains at least three independent entry-range review hosts and the official page-indexed route contains the concrete direct observation. This meets the supplementary-review requirement without using review consensus as a substitute for the official page evidence.

## Candidate disposition for next adjudication

| position | new direct proposal | unchanged unknowns / no-op cells | route state |
|---:|---|---|---|
| 11 | none | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `comedy` remain unknown; existing pacing/world/character/relations/tone cells unchanged | TAMESHIYO vol. 3 page-level route inspected; no mastery/process anchor. |
| 12 | none | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `comedy` remain unknown | e-comi vol. 2/3 exact speedreader bootstrap reached; no new direct anchor. |
| 13 | `strategy=2` from official p09–p11 | do not infer `problemSolving=2`, `progression=2`, `strategy=4`, `mysteryReveal`, or Tone from synopsis/reviews | first-episode viewer API reached; 34-page sequence indexed and bounded. |
| 15 | none | `progression`, `strategy`, `mysteryReveal`, `mentalStress` remain unknown; existing problem solving and other known cells unchanged | S-MANGA vol. 2/3 readers reached; descriptions only for this route. |
| 16 | none | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `comedy` remain unknown; existing pacing/mild stress unchanged | TAMESHIYO vol. 2/3 exact portals reached; no new process anchor. |
| 18 | none | `progression`, `strategy`, `mysteryReveal`, `mentalStress` remain unknown; existing work/problem-solving/comedy cells unchanged | Kodansha trial redirect loop persists; browser/session retry remains appropriate. |
| 19 | none | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `worldBuilding` remain unknown; existing episodic/comedy/warmth/mild-stress cells unchanged | Champion Cross first five exact episode shells reached; static synopsis repeats and does not expose panel events. |

No Genre or Theme change is proposed. No Art value or Art evidence is created.

## Coverage and integrity handoff

The round-2 text gate baseline was `3/10` for chunk 02 (positions 14, 17, 20), with Batch 004 at `4/50` including position 3 from chunk 01. A single retained `strategy=2` proposal for position 13 would increase its Narrative known count by one only after independent adjudication; this note does not alter the gate or terminal data.

Expected next step is an independent adjudicator review against the current Dictionary and the existing coverage contract. The adjudicator must not average model outputs, treat review agreement as primary evidence, or write the proposal directly into the terminal CSV without preserving the page-indexed official evidence.

## Hash and no-mutation check

- Terminal CSV before this note: `f4881fb929ca3256ce82efb2984998f325fc2383c3c6be8a1fa496e57d24fcea`.
- Terminal CSV after this note: unchanged; re-run `sha256sum data/staging/catalog-expansion/batches/batch-004/adjudication/text-final-chunk-02.csv` before adjudication and require the same SHA.
- This file is research-only and contains no terminal/source/promotion/overlay edits.
- No blocker is authorized. Position 18 remains a reproducible access limitation, not `SOURCE_INFORMATION_UNAVAILABLE`; positions 11, 12, 13, 15, 16, and 19 are not globally source-exhausted.
