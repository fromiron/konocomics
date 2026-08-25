# Batch 004 text-gap recovery — chunk 02, round 2

- 대상: frozen positions `11–20` 중 미사용 공식 경로가 지정된 `11, 12, 13, 15, 16, 18, 19`
- 조회일: `2026-08-25`
- `retrievedAt`: 모든 아래 경로에 `2026-08-25` 적용
- 목적: Daybreak의 `NO_FINAL_BLOCKER` 판정에 따라 지정된 공식 volume/episode 경로를 재검증하고, 직접 Dictionary anchor가 있는 경우에만 후보로 기록
- 상태: research only. Pass A/최종 adjudication CSV, terminal CSV, blocker/overlay/source/registry/promotion 파일, generated artifact는 수정하지 않음
- canonical title: 장식 구분자인 `『`·`』`는 작품명에 포함하지 않음
- Art: 본 라운드에서 값을 변경하지 않음. Art 표본 부족은 `unknown`으로 종결하는 기존 계약을 유지함

## Bound inputs and invariants

| Input | SHA-256 / value |
|---|---|
| current repository root (`git rev-parse HEAD`) | `a423c20add1162b7cdf71342a721ffcd7191d3c2` |
| `frozen-work-set.csv` | `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1` |
| candidate set (manifest `candidateSha256`) | `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d` |
| prior recovery packet `research/text-gap-recovery-chunk-02.md` | `05e613f1630a4ac5b99aa88f8094ec43090ba6b40eb46e139b7bfdff2b93f3a6` |
| Daybreak blocker adjudication | `reviews/daybreak-blocker-adjudication-chunk-02.md` (bound review; no terminal edits) |

The working tree is already dirty; this report is bound to the current root SHA above and does not claim that unrelated dirty files are part of this research note. Positions `14` (`ねずみの初恋`), `17` (`アリスと蔵六`), and `20` (`環と周`) are intentionally untouched and remain `VERIFIED_NO_BLOCKER` in the bound review.

## Gate baseline

The terminal coverage gaps below are copied from the bound Daybreak review. They are not converted into blockers.

| position | workId | title | residual gap | round-2 objective |
|---:|---|---|---|---|
| 11 | `work-23077ad33a2066bef5a6` | Sunny | Narrative `+3`, Tone `+1` | official Shogakukan volume 3 portal and linked volume 1 route |
| 12 | `work-2356050c72240569e1c5` | すみれファンファーレ | Narrative `+3`, Tone `+1` | exact official e-comi volumes 2 and 3 |
| 13 | `work-2c4fe00df5255fc082f9` | ヒーローカンパニー | Narrative `+3`, Tone `+4` | complete first official episode parts and one adjacent episode |
| 15 | `work-2df743e085adef5e9bd3` | キルアオ | Narrative `+2`, Tone `+1` | exact Shueisha volume 2 and 3 readers |
| 16 | `work-2f1d1c3ad0f943f1562f` | 尾守つみきと奇日常。 | Narrative `+3`, Tone `+1` | exact Shogakukan volume 2 and 3 portals |
| 18 | `work-39c1a2b6791238827ed5` | とろける鉄工所 | Narrative `+2`, Tone `+1` | exact Kodansha volume 2 trial |
| 19 | `work-3ad85a2ffdc026007d61` | 新しい上司はど天然 | Narrative `+4`, Tone `+1` | Akita volume 2 and publisher-linked official series reader |

## Official route ledger

### 11 — Sunny (`work-23077ad33a2066bef5a6`)

| source | exact URL | sourcePublishedAt / page date | retrievedAt | observation |
|---|---|---|---|---|
| 小学館・TAMESHIYO official internal preview, volume 3 | https://sc-portal.tameshiyo.me/9784091886132 | `2013-01-30` | `2026-08-25` | HTTP 200; title is `「Ｓｕｎｎｙ　３」｜ＩＫＫＩ　ＣＯＭＩＸ｜小学館`; product-linked OG description and episode summaries are exposed |
| 小学館・e-comi official reader, volume 1 cross-check | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091885570000d0000000 | edition-bound volume-1 route; original date not exposed in this route | `2026-08-25` | retained as the earlier edition-bound comparison route; not treated as a replacement for vol. 3 |
| 小学館 official product link exposed by vol. 3 portal | https://www.shogakukan.co.jp/books/09188613?utm_source=tameshiyome | page date not exposed | `2026-08-25` | confirms rightsholder/product mapping; no new numeric cell by itself |

Vol. 3's official description says the children of Hoshi-no-ko gradually move up, stop, or sometimes go down “the stairs of adulthood.” The episode summaries expose repeated bounded events: TV coverage entering daily life, children waiting at a hospital, and catching escaped pigs. This supports a conservative `progression=2` candidate because the same volume explicitly frames repeated developmental movement across named episodes. It does not support `progression=4`.

Rejected direct anchors: the pig escape is one short event and its description does not expose a repeated attempt/outcome chain, so it is not sufficient for `problemSolving`; the TV visit is an external disruption, not `strategy`; no clue-to-reveal sequence is exposed for `mysteryReveal`. “ポンコツ” and “悪だくみ” wording is not a recurring comedy observation, so `comedy` remains unknown. No Genre/Theme change is proposed.

**Route result:** the specified volume-3 portal, its product mapping, and the prior volume-1 cross-check were reached. The bounded official text route is exhausted for this round, but residual cells remain unknown; this is not a hard blocker and no terminal value is written.

### 12 — すみれファンファーレ (`work-2356050c72240569e1c5`)

| source | exact URL | sourcePublishedAt / page date | retrievedAt | observation |
|---|---|---|---|---|
| 小学館・e-comi official reader, volume 2 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091886030000d0000000 | electronic re-release `2015-01-26` | `2026-08-25` | official reader bootstrap/API response exposed exact title/author/publisher and description; `ContentType=1`, `ViewMode=2` |
| 小学館・e-comi official reader, volume 3 | https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091886240000d0000000 | electronic re-release `2015-01-26` | `2026-08-25` | official reader bootstrap/API response exposed exact title/author/publisher and description; `ContentType=1`, `ViewMode=2` |
| 小学館・e-comi product page, volume 2 | https://e-comi.shogakukan.co.jp/books/091886030000d0000000 | page date not exposed | `2026-08-25` | HTTP 200; title `すみれファンファーレ 2` |
| 小学館・e-comi product page, volume 3 | https://e-comi.shogakukan.co.jp/books/091886240000d0000000 | page date not exposed | `2026-08-25` | HTTP 200; title `すみれファンファーレ 3` |

Vol. 2's official description lists the hospitalized neighboring girl/nurse, the apartment resident, the sports festival, and the eclipse watched with the mother. Vol. 3 lists a friend's love, being left out on Valentine's Day, thinking about alternative names, tears, and discovering an unexpected side of an important person. Together these are repeated experience/reflection anchors for a conservative `progression=2` candidate; they do not establish mastery and therefore do not support `4`.

Rejected direct anchors: the descriptions do not expose a goal-attempt-outcome process for `problemSolving`; emotional reflection is not automatically problem solving. No planning/counter-plan for `strategy`, and no clue/reveal chain for `mysteryReveal`. Sadness and tears are consistent with the existing `mentalStress=2` candidate but do not justify an increase. No repeated comedy anchor is exposed, so `comedy` remains unknown. Existing school/slice-of-life classification is unchanged.

**Route result:** both exact official volume-2 and volume-3 reader branches were reached through the official e-comi reader bootstrap and checked against their product pages. The bounded route is exhausted for this round; the narrative gate is not force-filled and no blocker is authorized.

### 13 — ヒーローカンパニー (`work-2c4fe00df5255fc082f9`)

| source | exact URL | sourcePublishedAt / page date | retrievedAt | observation |
|---|---|---|---|---|
| HERO'S Web official episode, first part | https://heros-web.com/episodes/abc82cfdbc52d/1 | entry publication basis `2012-09-28`; current site display `2026-05-18` | `2026-08-25` | HTTP 200; title `第1目標 街の平和を守れ!!`; official synopsis and ordered episode navigation exposed |
| HERO'S Web official episode, second part | https://heros-web.com/episodes/abc82cfdbc52d/2 | entry publication basis `2012-09-28`; current site display `2026-05-18` | `2026-08-25` | HTTP 200; title/ordered episode navigation exposed; viewer panel text is not present in static body |
| HERO'S Web official series | https://heros-web.com/series/634a04c316435 | page date not exposed | `2026-08-25` | exact series/creator mapping `ヒーローカンパニー - 島本和彦`; first and adjacent episode routes exposed |
| HERO'S Web official adjacent episode | https://heros-web.com/episodes/04248090c630c | current site display `2026-05-18` | `2026-08-25` | title `第56目標 お父さん 外へは行かないで！`; paid/gated episode shell, official synopsis and neighboring route metadata exposed |

The official synopsis defines the profession as protecting people from incidents, accidents, and disasters. The first episode shell exposes a goal/incident sequence and 52-entry navigation; the adjacent episode confirms that the work format continues beyond the opening. These observations retain the prior conservative candidates: `progression=2`, `problemSolving=2`, `pacing=3`, `characterArcWeight=2`, `relationshipStructure=2`, `emotionalWarmth=2`, and `mentalStress=1`. They do not justify `pacing=4` or any extreme Tone value.

Rejected direct anchors: episode titles and tags alone are insufficient for `strategy` because no plan/counter-plan/resource sequence is exposed; they are insufficient for `mysteryReveal` because no clue-to-reveal chain is visible. The viewer's static DOM does not include panel text, and the adjacent episode is gated, so no additional numeric value is fabricated from titles, tags, or the series synopsis. Existing action/workplace Genre/Theme remains unchanged.

**Route result:** both parts of the first official episode, the series map, and the specified adjacent episode shell were reached. The accessible bounded route is exhausted for this round; gated/panel-only content is an access limitation, not proof of source unavailability and not a blocker.

### 15 — キルアオ (`work-2df743e085adef5e9bd3`)

| source | exact URL | sourcePublishedAt / page date | retrievedAt | observation |
|---|---|---|---|---|
| 集英社・S-MANGA official reader, volume 2 | https://www.s-manga.net/reader/main.php?cid=08X10000000032350600 | `2023-11-02` | `2026-08-25` | HTTP 200; official title, author, release metadata and description exposed |
| 集英社・S-MANGA official reader, volume 3 | https://www.s-manga.net/reader/main.php?cid=9784088837970 | `2024-01-04` | `2026-08-25` | HTTP 200; official title, author, release metadata and description exposed |

Vol. 2's official description presents repeated contests over the fiancée role. Vol. 3 presents an attempted rescue after a renewed abduction while the protagonist and Tenma are pursued by two assassins. This directly strengthens `problemSolving=2`: there are explicit goal/obstacle/action situations across two volumes, but no basis for `4`.

The school-restart/role-adaptation `progression=2` candidate, `characterArcWeight=2`, and `emotionalWarmth=2` remain bounded candidates from the prior packet; these routes do not add a mastery ladder. Rejected: `strategy` remains unknown because the descriptions omit plan/counter-plan/resource management; `mysteryReveal` remains unknown because the biological cause is a premise, not a clue-to-reveal sequence. Do not infer from assassin/action labels. Existing Genre/Theme and `romance=2` are unchanged.

**Route result:** both named S-MANGA reader routes were reached and their official descriptions were checked. No new terminal value is written; the bounded official route is exhausted for this round and no blocker is authorized.

### 16 — 尾守つみきと奇日常。 (`work-2f1d1c3ad0f943f1562f`)

| source | exact URL | sourcePublishedAt / page date | retrievedAt | observation |
|---|---|---|---|---|
| 小学館・TAMESHIYO official internal preview, volume 2 | https://sc-portal.tameshiyo.me/9784098533817 | `2024-06-18` | `2026-08-25` | HTTP 200; official title and OG description exposed |
| 小学館・TAMESHIYO official internal preview, volume 3 | https://sc-portal.tameshiyo.me/9784098535750 | `2024-09-18` | `2026-08-25` | HTTP 200; official title and OG description exposed |
| linked volume-1 portal exposed in both pages | https://sc-portal.tameshiyo.me/9784098531820 | volume 1 date not exposed in this route | `2026-08-25` | confirms same-series publisher mapping |

Vol. 2's official description spans the phantom-human classmates, the sports festival, and a relationship that may deepen. Vol. 3 spans the end of first term, summer, discovering classmates' unknown sides, and searching for feelings. This supports `pacing=2` as ordinary school/seasonal episode movement, not fast pacing.

Rejected direct anchors: “searching for feelings” and a relationship deepening are not a dictionary-level mastery reward, so `progression` remains unknown. “Difficult and fun days” and social self-understanding do not expose a goal-attempt-outcome process, so the prior `problemSolving=1` candidate remains provisional and should stay unknown unless a direct action sequence is later found. No plan/counter-plan or clue/reveal chain supports `strategy` or `mysteryReveal`; “fun” and romance labeling do not establish recurring `comedy`. `mentalStress=1` remains the prior mild-pressure candidate without an increase. Existing Genre/Theme is unchanged.

**Route result:** both exact product-linked volume-2/3 portals and the linked volume-1 mapping were reached. The bounded official text route is exhausted for this round; residual Narrative coverage remains explicit and no blocker is authorized.

### 18 — とろける鉄工所 (`work-39c1a2b6791238827ed5`)

| source | exact URL | sourcePublishedAt / page date | retrievedAt | observation |
|---|---|---|---|---|
| 講談社 official volume-2 product trial | https://www.kodansha.co.jp/comic/products/0000038651/trial | `2009-03-23` | `2026-08-25` | redirect loop observed; no stable reader body was obtained in this CLI round |
| 講談社 official title/series ledger | https://www.kodansha.co.jp/titles/1000004427 | page date not exposed | `2026-08-25` | HTTP 200; exact series mapping `とろける鉄工所` confirmed |
| redirect target observed during bounded attempt | https://www.kodansha.co.jp/comic/products/0000038651/trial/reader?cid=645023aab77a2c0eb51078a91e980b7054f76cb6e4e6212ba7199205e25bc0f | reader date not exposed | `2026-08-25` | target was observed, but repeated redirects prevented reliable body capture |

The prior official volume packet and independent work reviews retain `problemSolving=2` for recurring practical welding/work-process problems and `comedy=2` for the recurring workplace-comedy format. This round does not add a new known cell: the trial's redirect loop means no direct vol. 2 event ledger can be claimed.

Rejected: accumulated trade knowledge is not automatically protagonist `progression`; no stable vol. 2 page was available to establish a repeated acquisition/mastery reward. No plan/counter-plan or clue/reveal sequence supports `strategy` or `mysteryReveal`. The route should be retried with a browser session or stabilized redirect handling; this is a bounded access failure, not `SOURCE_INFORMATION_UNAVAILABLE` and not a promotion blocker.

**Route result:** official series mapping succeeded; the exact trial route was attempted but remains partially unexhausted because of a reproducible redirect loop. No terminal data or blocker row is changed.

### 19 — 新しい上司はど天然 (`work-3ad85a2ffdc026007d61`)

| source | exact URL | sourcePublishedAt / page date | retrievedAt | observation |
|---|---|---|---|---|
| 秋田書店 official volume 2 product page | https://www.akitashoten.co.jp/comics/425314232X | `2020-05-20` | `2026-08-25` | HTTP 200; title, ISBN `978-4-253-14232-8`, release date and official description exposed |
| 秋田書店/publisher-linked trial entry | https://mangacross.jp/comics/dotennen/1 | original date not exposed; redirects to current official series | `2026-08-25` | redirects to Champion Cross official series |
| チャンピオンクロス official series ledger | https://championcross.jp/series/068fd6dbdf163 | site display date `2024-03-29`; original episode dates not exposed | `2026-08-25` | official synopsis, tags, and at least 24 listed episode routes/titles exposed; page body also says 21 episodes, so no exact total is asserted |
| チャンピオンクロス official episode examples | https://championcross.jp/episodes/70d91aef3c691; https://championcross.jp/episodes/4ed6db31744c8; https://championcross.jp/episodes/ea82aaafe3245; https://championcross.jp/episodes/4d492212c7e11; https://championcross.jp/episodes/2ed6722812730 | site display date `2024-03-29` | `2026-08-25` | ordered official episode shells for early and later entries; current migration display date is not treated as original publication date |

The official volume-2 description gives recurring work/private situations: the protagonist wakes at the new boss's home, and the boss/colleague travel episode is named. The series synopsis describes recovery from a mentally and physically harmful former workplace into a healing office comedy. The official episode ledger exposes repeated episodic structure. Together with the prior distinct user-review observations, this supports the conservative candidates `pacing=2`, `worldBuilding=2`, `progression=1`, and `mentalStress=1`; `progression=1` remains provisional because adaptation is not a clear skill-acquisition reward.

Rejected: official tags `#コメディ #日常 #お仕事` are provenance/context, not automatic Axis values. No recurring analytical problem process supports `problemSolving`; no plan/counter-plan or clue/reveal chain supports `strategy`/`mysteryReveal`. Do not infer values from the work title or from the episode count. Existing Genre/Theme and terminal `comedy=2` are unchanged.

**Route result:** the official volume-2 product, publisher redirect, official series ledger, and bounded early/later episode shells were reached. The prior scope limitation is disproved. The specified route set is exhausted for this round; residual gate cells remain explicit and no blocker is authorized.

## Supplementary independent-review check

Independent reviews were used only to cross-check repeated observations already bounded by official descriptions. They were not used for Art, score conversion, selection provenance, or automatic majority voting. No review-only observation is promoted to a terminal cell in this report.

| position | bounded supplementary URLs | usable cross-check | not accepted |
|---:|---|---|---|
| 11 | https://booklive.jp/review/list/title_id/268777/vol_no/001?spoiler=1; https://www.cmoa.jp/title/79928/ | understated daily rhythm, child pressure/recovery | no puzzle/plan/reveal anchor |
| 12 | https://books.rakuten.co.jp/rb/11536708/; https://booklive.jp/product/index/title_id/294027/vol_no/002; https://blog.livedoor.jp/gogo_konomichi/archives/28843761.html | repeated encounters, reflection, child-scale practical response | no strategy/mystery chain; ratings ignored |
| 13 | https://ebookstore.sony.jp/review/title/00192282/id/BT000019228200100101/; https://honto.jp/ebook/pd-review_0634950093.html; https://booklive.jp/review/list/title_id/268310/vol_no/001 | incident sequence and corporate-hero framing | no plan/reveal numeric inference from reviews/tags |
| 15 | https://aqm.hatenablog.jp/entry/2023/09/05/221106; https://hobbyforest.com/2025/07/01/kiruaocomic/ | school re-entry, constrained response, social warmth | no extreme values; later-volume claims not independently re-used |
| 16 | https://ganbattekakuzoi.hatenablog.com/entry/2024/03/25/071400; https://booklive.jp/review/list/title_id/20078498/vol_no/001; https://note.com/sister_note/n/n76b8f5dcc700 | school/daily rhythm and mild social pressure | no mastery/problem-solving/reveal anchor |
| 18 | https://mangamusou.com/shohyo/torokeru/; https://www.cmoa.jp/title/customer_review/title_id/60020/; https://buzz-manga.blog.jp/Torokeru-Iron-works-vol1-10-All-Volumes.html | recurring work process and workplace comedy | redirect-limited official vol. 2 not papered over with reviews |
| 19 | https://www.cmoa.jp/title/181071/vol/1/; https://booklive.jp/review/list/title_id/621874/vol_no/001 | episodic gag rhythm, office context, relief/adaptation | no automatic progression/problem-solving/reveal values |

## Direct Dictionary-anchor disposition

All entries below are proposals or explicit rejections for the next adjudication. They are not terminal writes. `U` means the axis remains unknown under the current evidence contract.

| position | direct candidate(s) retained for adjudication | direct rejection / final round state |
|---:|---|---|
| 11 | `progression=2` | `problemSolving=U`, `strategy=U`, `mysteryReveal=U`, `comedy=U`; no value beyond prior `pacing=2`, `mentalStress=2` candidates |
| 12 | `progression=2` | `problemSolving=U` (emotional reflection is not a goal-attempt-outcome chain), `strategy=U`, `mysteryReveal=U`, `comedy=U`; retain prior `pacing=2`, `mentalStress=2` candidates |
| 13 | prior `progression=2`, `problemSolving=2`, `pacing=3`, `characterArcWeight=2`, `relationshipStructure=2`, `emotionalWarmth=2`, `mentalStress=1` | no `strategy`/`mysteryReveal` from episode titles/tags; no extreme Tone value; no Genre/Theme change |
| 15 | prior `problemSolving=2` and `progression=2` candidates; `characterArcWeight=2`, `emotionalWarmth=2` retained | `strategy=U`, `mysteryReveal=U`; no mastery or extreme value |
| 16 | `pacing=2`; retain prior mild `mentalStress=1` candidate only for adjudication | `progression=U`, `problemSolving=U`, `strategy=U`, `mysteryReveal=U`, `comedy=U`; no relationship-to-problem-solving conversion |
| 18 | retain prior `problemSolving=2`, `comedy=2`; `progression=1` remains weak/provisional | `strategy=U`, `mysteryReveal=U`; no progression upgrade from trade knowledge; official trial redirect loop prevents new direct cell |
| 19 | `pacing=2`, `worldBuilding=2`; retain prior `progression=1`, `mentalStress=1` candidates for adjudication | `problemSolving=U`, `strategy=U`, `mysteryReveal=U`; tags and episode count are not Factor evidence |

## Route exhaustion and handoff

- Positions `11, 12, 13, 15, 16, 19`: every exact official route named in the Daybreak request was reached and bounded metadata/description/episode structure was inspected. Remaining unknowns are evidence decisions, not silently converted values. The route set is exhausted for this round; this is not global web/source exhaustion.
- Position `18`: the exact official trial was attempted, but repeated redirects prevented stable reader-body capture. The route is not globally exhausted. Retry with a browser session or stabilized redirect handling; do not assign a blocker from this condition.
- Positions `14, 17, 20`: no route action; preserve their verified terminal state exactly.
- Art: no image capture or Art adjudication occurred in this round. No Art value, SHA, or evidence row is created.
- No work receives `recommendationVerified`, `promotionBlocked`, `gold`, or a new terminal factor from this note. The next independent adjudication must resolve candidates against the frozen Dictionary and existing coverage contract.

## Closure

This report records the additional official routes, exact source URLs, source/page dates, retrieval date, direct anchors, rejected inferences, and the bounded access limitation for the requested seven positions. It does not modify terminal data or authorize a blocker. The current conclusion remains `NO_FINAL_BLOCKER` for positions `11, 12, 13, 15, 16, 18, 19`, with `14, 17, 20` preserved unchanged.
