# Batch 005 text gap recovery round 3 — chunk 02

## Scope and binding

- 조사일 및 조회일: `2026-08-25`
- 대상: `batch-005/frozen-work-set.csv` positions `11–20` only
- 평가 범위: `entry_1_3_volumes` (권 1–3 또는 그에 대응하는 초반 범위)
- `reviewedByHuman=false`
- repository branch: `main`
- repository HEAD at packet creation: `a423c20add1162b7cdf71342a721ffcd7191d3c2`
- current packet candidate SHA-256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- current frozen work-set SHA-256: `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8`
- current Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- current annotation guide SHA-256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`
- current root identity: `/tmp/konocomics-batch005-grok-text-chunk-02`; the exact root is the packet candidate above, not a mutable working-tree snapshot.

This is a research-only packet. It does not edit Pass C terminal CSVs, Pass A files,
source/provenance files, overlay files, promotion status, generated catalog, or
eligibility. Existing known cells are not reopened. A proposed cell below is an
input to the independent adjudicator, not an approval.

The dictionary anchor was applied literally. A title, genre label, occupation,
single event, or a review's overall impression is not converted into a numeric
Axis. Art is out of scope here; all Art cells remain `unknown` because no exact
representative-edition sample met the six readable-page/two-context minimum.

## Material source corrections

### Position 16 — 銀のスプーン

The prior packet incorrectly associated this URL with 銀のスプーン:

`https://booklive.jp/review/list/title_id/217009/vol_no/001`

The page title and work metadata identify that page as `カレチ（1）`, so it is a
valid position-19 source and an invalid position-16 source. The corrected
position-16 BookLive route is:

`https://booklive.jp/review/list/title_id/243606/vol_no/001`

The corrected page identifies `銀のスプーン（1）`, 講談社, and its volume-1
recipe list. The same `title_id=243606` is used for the volume-2 review route:
`https://booklive.jp/review/list/title_id/243606/vol_no/002`.

### Position 13 — おまかせ精霊

The earlier Manga Taisho citation was over-strong in two ways: it treated one
selector's prose as an award-institution finding, and it used that prose as if it
alone established a numeric Factor. The primary page records selection comments,
not a validated Factor judgment. The exact official records are:

- `https://www.mangataisho.com/data/2008/comment.pdf`, 2008 comment collection.
  It contains a selector comment describing the work as becoming a growth story.
- `https://www.mangataisho.com/data/2009/comment090324.pdf`, 2009 comment
  collection for 2008 works. It also contains a selector comment about the work's
  growth. This is a second award-year record, not an independent reading sample.
- `https://www.mangataisho.com/archives/2009.html`, official archive. It lists
  おまかせ精霊 among the 2009 first-selection works, not among the nominees.

Correct interpretation: the PDFs are bounded secondary commentary and provenance;
they may supplement direct volume evidence, but they do not by themselves prove
`progression`, `characterArcWeight`, or any other numeric Axis. The overclaim is
retracted. The candidate below uses the PDF only together with licensed volume 2–3
descriptions.

## Source ledger and residual decisions

### 11. ヨルムンガンド — `work-151b456508f78852b002`

Additional/rechecked routes:

1. **小学館eコミックストア, ヨルムンガンド 3**, published date not stated on
   page, retrieved `2026-08-25`,
   `https://e-comi.shogakukan.co.jp/books/091571090000d0000000`. The official
   volume page describes Yona confronting Casper over the landmine incident and
   beginning revenge with a weapon.
2. **マンガ大賞2010選考員コメント集**, published `2010`, retrieved
   `2026-08-25`, `https://www.mangataisho.com/data/2010/comment2010.pdf`. One
   selector describes the early military emphasis and says the characters' pasts
   and the story background become gradually clearer as the story progresses. This
   is bounded commentary, not an award consensus.
3. **BookLive, ヨルムンガンド 1 user reviews**, page date not stated, retrieved
   `2026-08-25`,
   `https://booklive.jp/review/list/title_id/183192/vol_no/001`. Separate volume-1
   reviews mention the slow approach to the core and the arms-trade/weapon-hatred
   conflict; these are supplementary observations only.
4. **レビューン, ヨルムンガンド review**, page date not stated, retrieved
   `2026-08-25`, `https://reviewne.jp/reviews/27701`. The bounded entry-to-volume-3
   observation says the story becomes more engaging around volume 3 and that the
   group relationship gains warmth. It is not used for Art or as a standalone
   numeric judgment.

**Proposed cell for adjudication:** `mysteryReveal=2`, confidence `0.68`.
The official selector observation directly supports partial/gradual revelation,
and the volume-1 review routes independently describe the entry as not yet at the
core. The evidence does not support 4 because clue solving and truth disclosure
are not shown as the dominant reward in the bounded entry.

**Retain `unknown`:** `progression`, `problemSolving`, `strategy`, `comedy`,
`romance`, and all Art axes. The arms-trade setting and combat do not establish
long-term resource strategy, clever constraint analysis, recurring comedy, or
romance. The prior `pacing`, `worldBuilding`, `characterArcWeight`,
`relationshipStructure`, and `darkness` cells are unchanged.

### 12. ボクラノキセキ — `work-1550d4a52c3fe6d9f94c`

Additional/rechecked routes:

1. **一迅社 Comic ZERO-SUM series page**, page date not stated, retrieved
   `2026-08-25`, `https://www.ichijinsha.co.jp/zerosum/title/bokuranokiseki/`.
   The rightsholder describes classmates recovering past-life memories and
   trying to unravel the past truth.
2. **一迅社WEB, ボクラノキセキ 2**, published `2010-01-25`, retrieved
   `2026-08-25`, `https://data.ichijinsha.co.jp/detail/75805477`. It directly
   states that classmates successively recover memories and that Hiroki claims
   to be Veronica.
3. **マンガ大賞2010選考員コメント集**, published `2010`, retrieved
   `2026-08-25`, `https://www.mangataisho.com/data/2010/comment2010.pdf`. A
   selector records the protagonist's past-life memory and that multiple people
   remember past lives; this is supplementary commentary, not a numeric decision.
4. **honto, volume-1/2 bounded user reviews**, page dates `2015-02-01` and
   `2010-02-06`, retrieved `2026-08-25`,
   `https://honto.jp/ebook/pd-review_0635423420.html?srt=3` and
   `https://honto.jp/ebook/pd-review_0635423421.html?srt=2`. The reviews note
   that volume 2 introduces many awakened people and that the layered memory
   structure changes the reader's understanding. They are supplemental, not
   selection provenance.
5. **BookLive, volume-1 reviews**, page date not stated, retrieved `2026-08-25`,
   `https://booklive.jp/review/list/title_id/176973/vol_no/001`. Reviews describe
   the many past identities, suspicion, and the entry's layered structure.

**Proposed cell for adjudication:** `progression=2`, confidence `0.61`.
Volumes 1–2 expose a repeated acquisition structure: the protagonist's memory is
confirmed and classmates successively recover their memories. This is ordinary
knowledge/roster progression, not a level-4 reward loop. The adjudicator should
reject the proposal if “memory revelation” is treated as only the existing
`mysteryReveal` construct rather than a distinct progression reward.

**Retain `unknown`:** `problemSolving`, `strategy`, `pacing`, `comedy`, and
`romance`. “Unravel the truth” belongs to the already-known mystery evidence; it
does not create a second Narrative value. No romantic wording or school setting
was used as a numeric inference.

### 13. おまかせ精霊 — `work-15d6508605fbd4a266fc`

Additional/rechecked routes:

1. **KADOKAWA Comic Alive series page**, volumes 1–4 release dates, retrieved
   `2026-08-25`, `https://comic-alive.jp/product/omakase/`. The official page
   confirms the four-volume series and dates; it is identity/volume evidence only.
2. **Renta!, licensed volume descriptions 1–4**, page date not stated, retrieved
   `2026-08-25`, `https://renta.papy.co.jp/renta/sc/frm/item/4991/`. Volume 2
   names two new members and an adviser while aiming for promotion; volume 3
   names the four-member group seeking a fifth member and a clubroom; volume 4
   describes the protagonist confronting his feelings. The route has one bounded
   user review dated `2019-08-24`; it is supplementary only.
3. **マンバ, volume list and descriptions**, page date not stated, retrieved
   `2026-08-25`, `https://manba.co.jp/boards/21440/books/1`. The volume 2–3
   descriptions independently repeat the member acquisition and clubroom goal.
4. **マンガ大賞2008 selector comments**, published `2008`, retrieved `2026-08-25`,
   `https://www.mangataisho.com/data/2008/comment.pdf`. One selector says the
   work unexpectedly became a growth story. This is one selector's opinion.
5. **マンガ大賞2009 selector comments**, published `2009`, retrieved `2026-08-25`,
   `https://www.mangataisho.com/data/2009/comment090324.pdf`. It repeats a
   selector's growth-story observation. It is not a second reading sample.

**Proposed cell for adjudication:** `characterArcWeight=2`, confidence `0.60`.
The two licensed volume descriptions establish group/member change and the
official selector commentary supplies a bounded character-growth observation.
The value remains 2 because club expansion and the spirit activity remain jointly
central; the records do not support character change as the sole reward.

**Retain `unknown`:** `problemSolving`, `strategy`, `mysteryReveal`,
`worldBuilding`, `darkness`, `mentalStress`, `romance`, `emotionalWarmth`, and
Art. `comedy` remains unresolved: “精霊召喚コメディ” is a distributor label and
cannot alone establish recurring gag frequency. The prior progression, pacing,
and relationshipStructure cells are unchanged.

### 14. ニラメッコ — `work-18e08fe95968a6537773`

Rechecked routes:

- **白泉社, volumes 1–2**, published `2021-06-16` and `2022-01-28`, retrieved
  `2026-08-25`, `https://www.hakusensha.co.jp/comicslist/60421/` and
  `https://www.hakusensha.co.jp/comicslist/62179/`.
- **白泉社 Young Animal series page**, page date not stated, retrieved
  `2026-08-25`, `https://magazine.younganimal.com/title/?id=44`.
- **BookLive and Comic Cmoa volume-1 review pages**, page dates not stated,
  retrieved `2026-08-25`,
  `https://booklive.jp/review/list/title_id/20033480/vol_no/001` and
  `https://www.cmoa.jp/title/223338/vol/1/`.

The official and independent routes repeat the five-person comedy-work setting,
professional anxiety, and shared-house premise. They do not expose recurring
growth rewards, strategy, clue resolution, a functional rule system, romance, or
warmth as a primary entry reward.

**No new cell.** Retain all residual Narrative/Tone unknowns and Art unknowns.
The existing `comedy=2`, relationship, workplace Theme, and other terminal cells
are not reopened.

### 15. 恋愛ラボ — `work-19b578d0e828242f14f3`

Rechecked routes:

- **芳文社 まんがタイム series/volume page**, volumes 1–3, published
  `2008-03-07`, `2009-01-07`, `2009-07-07`, retrieved `2026-08-25`,
  `https://manga-time.com/comics/cart/mru.html`.
- **マンガ大賞2009 selector comment collection**, published `2009`, retrieved
  `2026-08-25`, `https://www.mangataisho.com/data/2009/comment090324.pdf`.
  The entry for this title calls it a girls' comedy; it is selection commentary,
  not evidence for pacing, solving, or strategy.
- **BookLive volume-1 reviews**, page date not stated, retrieved `2026-08-25`,
  `https://booklive.jp/review/list/title_id/210181/vol_no/001`.
- **それはロックじゃない volume-1 review**, published `2008-05-11`, retrieved
  `2026-08-25`, `https://arr.hatenadiary.jp/entry/20080511/1210468267`.

The official volume copy describes romance practice, changing personalities, and a
student-council crisis, but the bounded material does not establish a repeated
growth reward, constraint-analysis process, long-term plan, rapid pacing,
clue-based payoff, or world-system. The award comment confirms comedy only, which
is already represented.

**No new cell.** Retain the six residual Narrative unknowns and all Art unknowns.

### 16. 銀のスプーン — `work-1b3afe12c434a9cf7603`

Corrected and additional routes:

1. **講談社, volumes 1–3**, published `2011-02-10`, `2011-06-13`, and
   `2011-12-13`, retrieved `2026-08-25`,
   `https://www.kodansha.co.jp/comic/products/0000044784`,
   `https://www.kodansha.co.jp/comic/products/0000044817`, and
   `https://www.kodansha.co.jp/comic/products/0000044883`. The summaries show
   the mother's illness/hospitalization, new recipes, and family facts.
2. **BookLive, 銀のスプーン（1） reviews**, page date not stated, retrieved
   `2026-08-25`, `https://booklive.jp/review/list/title_id/243606/vol_no/001`.
   The corrected page lists the volume-1 recipes and multiple bounded readers
   describing cooking from basic dishes through more involved recipes under the
   family constraint. The prior `title_id=217009` URL is not used for this work.
3. **レビューン, 銀のスプーン review**, page date not stated, retrieved
   `2026-08-25`, `https://reviewne.jp/reviews/23095`. The bounded review describes
   the recipe instructions, ingredient diagrams, and the way cooking is integrated
   with the family story. This is supplementary evidence, not a standalone value.
4. **コミックシーモア, 銀のスプーン volume-1 review page**, page date not stated,
   retrieved `2026-08-25`, `https://www.cmoa.jp/title/0000072977/`. Independent
   readers repeatedly describe the recurring recipes and family responses; no
   numerical Factor was copied from ratings or labels.

**Proposed cell for adjudication:** `problemSolving=1`, confidence `0.67`.
The corrected BookLive page and the independent Reviewne route directly describe
repeated practical recipe procedures under family/illness constraints. This is a
low intermediate value: the evidence does not show the repeated analysis and
ingenious solutions required for 4, and it does not justify a known 0. The
adjudicator should keep `unknown` if recipe execution is considered activity
rather than problem-solving under the dictionary.

**Reject:** `worldBuilding=2`. A household and family roles are a domestic
setting, not recurring world rules, history, culture, or factions. `strategy` and
all other residual unknowns remain unchanged.

### 17. おかめ日和 — `work-1b7c4ed54d7761cd242b`

Rechecked routes:

- **講談社, volumes 1–3**, published `2007-04-13`, `2007-10-25`, and
  `2008-04-11`, retrieved `2026-08-25`,
  `https://www.kodansha.co.jp/comic/products/0000043658`,
  `https://www.kodansha.co.jp/comic/products/0000043712`, and
  `https://www.kodansha.co.jp/comic/products/0000044241`.
- **BookLive volume-1 reviews**, page date not stated, retrieved `2026-08-25`,
  `https://booklive.jp/review/list/title_id/286133/vol_no/001`.
- **Comic Cmoa volume-1 review page**, page date not stated, retrieved
  `2026-08-25`, `https://www.cmoa.jp/title/86326/`.

Both independent review routes repeat household warmth and couple pressure. The
husband's acupuncture occupation is background to a family comedy/drama rather
than a recurring workplace mechanic, and family existence is not
`foundFamily`. The suspicious call and later marital incident are not enough for a
repeated mystery structure.

**No new cell.** Retain the missing Theme and residual Narrative unknowns.

### 18. 新黒沢 最強伝説 — `work-1bce95b6c02673e59bcf`

Rechecked routes:

- **小学館ビッグコミックBROS., volumes 1–3**, published `2013-11-29`,
  `2014-05-30`, and `2014-07-30`, retrieved `2026-08-25`,
  `https://bigcomicbros.net/comics/30136/`,
  `https://bigcomicbros.net/comics/30137/`, and
  `https://bigcomicbros.net/comics/30138/`.
- **Sony Reader volume-1 reviews**, page date not stated, retrieved `2026-08-25`,
  `https://ebookstore.sony.jp/review/title/10152692/id/LT000032940000431762/`.
- **ツェーイーメン volume-1 review**, published `2013-11-30`, retrieved
  `2026-08-25`, `https://ameblo.jp/fake-or-bluff/entry-11715030732.html`.
- **マンバ early-volume page**, page date not stated, retrieved `2026-08-25`,
  `https://manba.co.jp/topics/63716`.

The official chain establishes return from hospital, unemployment, street
sleeping, food insecurity, and a clerk fight. The reviews independently describe
absurdity and loneliness. These are event/survival observations, not repeated
clever solving, long-term strategy, mystery payoff, romance, or warmth.

**No new cell.** Retain the residual Narrative/Tone unknowns and Art unknowns;
the existing `comedy=2`, `mentalStress=2`, and `darkness=unknown` decisions are
not reopened.

### 19. カレチ — `work-1d5a3158e78e639f1973`

Additional/rechecked routes:

1. **講談社, カレチ 3**, published `2012-02-23`, retrieved `2026-08-25`,
   `https://www.kodansha.co.jp/comic/products/0000018293`. The official contents
   list repeated service incidents: track work, power-car monitoring, judicial
   patrol, lost-property inspection, disciplinary action, a surprise test, and
   route/permission matters.
2. **ITmedia, author interview on カレチ**, published `2017-10-13`, retrieved
   `2026-08-25`, `https://www.itmedia.co.jp/business/articles/1710/13/news048_4.html`
   and `https://www.itmedia.co.jp/business/articles/1710/13/news048_3.html`.
   The author explains that onboard trouble and how it is resolved form the basic
   episode construction, while resolutions may remain imperfect. This is an
   interview about the work, not a user rating.
3. **軌楽庵のつれづれ日記, カレチ 1–2**, published `2011-05-26`, retrieved
   `2026-08-25`, `https://kirakuann.exblog.jp/13653322/`. It gives a bounded
   ticket-cancellation example and describes repeated passenger-service work.
4. **BookLive, カレチ（1） reviews**, page date not stated, retrieved `2026-08-25`,
   `https://booklive.jp/review/list/title_id/217009/vol_no/001`. The page confirms
   the work's short-story service format and Ogino's entry growth.

**Proposed cell for adjudication:** `problemSolving=2`, confidence `0.70`.
The official volume-3 incident list demonstrates recurrence, while the author
interview explains that resolving passenger/vehicle trouble is the episode engine
and the independent review gives a concrete early-volume example. This is 2
because the work mixes professional judgment and direct action; it is not a
level-4 work centered on ingenious constraint analysis.

**Retain `unknown`:** `strategy`, `mysteryReveal`, `relationshipStructure`,
`comedy`, `darkness`, `mentalStress`, and `romance`. Multiple railway occupations
do not create a complex relationship network or a long-term resource plan.

### 20. GREEN WORLDZ — `work-1e9c4852863a22bba058`

Rechecked routes:

- **講談社, volumes 1–3**, published `2014-05-09`, `2014-08-08`, and `2014-11-07`,
  retrieved `2026-08-25`,
  `https://www.kodansha.co.jp/comic/products/0000019152`,
  `https://www.kodansha.co.jp/comic/products/0000019222`, and
  `https://www.kodansha.co.jp/comic/products/0000019307`.
- **Comic Cmoa volume-1 reviews**, page date not stated, retrieved `2026-08-25`,
  `https://www.cmoa.jp/title/0000076654/`.
- **Sony Reader volume-1 reviews**, dated reviews `2014-09-20` and `2016-08-08`,
  retrieved `2026-08-25`,
  `https://ebookstore.sony.jp/review/title/10109180/id/LT000018679000352229/`.
- **マンガ大賞2015 selector comments**, published `2015`, retrieved
  `2026-08-25`, `https://www.mangataisho.com/data/2015/comment2015.pdf`.

The routes confirm plant attacks, weapon search, the night movement rule, and
unresolved prophecy/insect threats. None establishes a repeated analysis-and-
solution process, a long-term strategy, a completed reveal, or a fixed complex
party in the bounded entry. Reviews supply survival/threat observations only.

**No new cell.** Retain all residual Narrative/Tone unknowns and Art unknowns.

## Cross-position disposition

| Position | Work | Candidate for independent adjudication | Retain `unknown` / rejected claims |
| ---: | --- | --- | --- |
| 11 | ヨルムンガンド | `mysteryReveal=2` | progression, problemSolving, strategy, comedy, romance |
| 12 | ボクラノキセキ | `progression=2` | problemSolving, strategy, pacing, comedy, romance |
| 13 | おまかせ精霊 | `characterArcWeight=2` | PDF alone does not establish a value; comedy and remaining Narrative unknowns retained |
| 14 | ニラメッコ | none | all residual text cells |
| 15 | 恋愛ラボ | none | all six residual Narrative cells |
| 16 | 銀のスプーン | `problemSolving=1` | worldBuilding=2 rejected; strategy and remaining residuals retained |
| 17 | おかめ日和 | none | missing Theme and all residual Narrative cells |
| 18 | 新黒沢 最強伝説 | none | all residual Narrative/Tone cells |
| 19 | カレチ | `problemSolving=2` | strategy, mysteryReveal, relationshipStructure, comedy, darkness, mentalStress, romance |
| 20 | GREEN WORLDZ | none | all residual Narrative/Tone cells |

Proposals are deliberately conservative and require independent adjudication. No
proposal is a terminal CSV change. Unsupported cells remain `unknown`, never a
synthetic middle value or known zero.

## Exhausted routes and recheck path

- Publisher/rightsholder volume pages for positions 11–20 were rechecked for the
  entry range where available.
- Official Manga Taisho archive/comment routes were checked only as supplemental
  work commentary or selection provenance; they were not treated as votes or as
  automatic Factor evidence.
- Licensed store descriptions were used for concrete volume transitions where an
  official publisher page was bibliographic only.
- At least two independent bounded reader-review routes were retained or checked
  for each position. Ratings, platform tags, unbounded whole-series comments, and
  animation material were not used to create numeric cells.
- Any remaining unknown is evidence-limited under the current dictionary and
  entry scope, not a low value. A later packet may reopen a cell only with a new
  exact entry-range source or a new independent observation that directly matches
  the dictionary anchor.

## Boundary and integrity

- `reviewedByHuman=false`.
- All Art cells remain `unknown`; no Art model panel was run.
- No final CSV, source CSV, provenance, overlay, registry, generated artifact,
  eligibility, or promotion status was modified.
- No source correction was silently applied to the original packet: both the
  invalid old URL and the corrected URL are recorded above for adjudication and
  later source-packet maintenance.
- No vote, averaging, or automatic promotion was performed.
