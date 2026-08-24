# Batch 002 text-gap independent review — chunk 02

- Pass: B, independent supplemental-evidence review
- Scope: frozen positions 11–20, entry volumes 1–3 or the complete single volume
- Review date: 2026-08-23
- `reviewedByHuman=false`
- Frozen Batch 002 manifest (`frozen-work-set.csv`) SHA-256: `80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6`
- Coverage gates: Narrative known `>= 4/6`; Tone known `>= 5/7`
- Decision boundary: this file reviews the supplemental packet. It does not edit a source row, promotion state, identity, safety, or representative ISBN.

`ACCEPT` keeps a proposed known value, `MODIFY` keeps a known state at a different value, and `UNKNOWN` closes the axis without a numeric value. Confidence is annotation confidence for a known value; an `unknown` state has no confidence.

## Frozen order

| Pos | workId                    | canonicalTitle   |
| --: | ------------------------- | ---------------- |
|  11 | work-29d4300ad9d3358fb67a | 外天楼           |
|  12 | work-3dfaf6231e21133620c6 | 忍者と極道       |
|  13 | work-3e725951eb9c49771087 | 嘘解きレトリック |
|  14 | work-40b8c35b1d8c9a90144c | orange           |
|  15 | work-4c784fc78dfd9b139c3f | 正反対な君と僕   |
|  16 | work-518d7ed42dd9253679c3 | 墨攻             |
|  17 | work-53e54c95f637b66c4fb2 | がんばれ元気     |
|  18 | work-5915d6d7601377fcc75f | 赤髪の白雪姫     |
|  19 | work-5b4dc4e6e966436b2990 | 人形芝居         |
|  20 | work-5b9a3ec60ac5fc90f444 | 魔法使いの嫁     |

## Cross-source audit

- The 43 URLs in the supplemental packet were requested again on 2026-08-23: `43/43` returned HTTP 200. Availability does not establish scope or sufficiency.
- The URL set contains 30 publisher or rights-holder-family pages and 13 bookseller review pages. Accounts on one review platform are separate reviewers but not separate platform families. BookLive entries labelled `Posted by ブクログ` are treated as Booklog-syndicated reviews and are not counted again as a third platform.
- No copied wording was found among the concrete observations used below. Cmoa and BookLive/Booklog are therefore two corroborating review families where both appear, while several accounts on one family establish repetition only.
- Direct entry-scope mapping is established for 外天楼, 嘘解きレトリック, 正反対な君と僕, 赤髪の白雪姫, and 人形芝居. 魔法使いの嫁 has an explicit current-to-Mag Garden statement that the manga content is unchanged for each of volumes 1–3.
- 忍者と極道 exposes an official premise and episode 1, not the claimed official volumes 1–3 descriptions. 墨攻 and がんばれ元気 expose official later electronic volumes 1–3 but no explicit unchanged-content bridge to the frozen paper edition in this packet. orange exposes current Futabasha bibliography and overview but no content bridge to frozen Shueisha ISBN `9784088468044`.

## 11. work-29d4300ad9d3358fb67a — 外天楼

### Source and range check

- [Kodansha product](https://www.kodansha.co.jp/comic/products/0000223170): exact complete volume, ISBN `9784063761597`; its official description calls the work twisted, amusing, bittersweet mystery material but does not quantify a recurring relationship reward.
- [Cmoa title and reviews](https://www.cmoa.jp/title/54875/): exact complete volume; distinct accounts repeatedly describe a light or absurd comic opening that turns ominous and serious.
- [BookLive volume 1 reviews](https://booklive.jp/review/list/title_id/179913/vol_no/001): exact complete volume; multiple Booklog-syndicated accounts independently repeat the comic-to-serious transition and sustained early-to-middle gags.
- Range is the whole single volume. Cmoa and BookLive/Booklog are two review families; accounts inside either family are not multiplied into source-family independence.

### Axis decisions

| Axis                 | Proposed | Decision  | Final | Confidence | Direct evidence reason                                                                                                   |
| -------------------- | -------- | --------- | ----- | ---------: | ------------------------------------------------------------------------------------------------------------------------ |
| `characterArcWeight` | `U`      | `UNKNOWN` | `U`   |          — | A shocking or sad ending does not by itself show that motivation and character change are the recurring primary reward.  |
| `comedy`             | `2`      | `ACCEPT`  | `2`   |       0.86 | The complete-volume official wording and two review families repeatedly locate comedy in the early and middle incidents. |
| `mentalStress`       | `U`      | `UNKNOWN` | `U`   |          — | Reader shock and unease do not establish sustained subjective pressure on the characters.                                |
| `romance`            | `U`      | `UNKNOWN` | `U`   |          — | No scoped source establishes either recurring romance or its repeated absence.                                           |
| `emotionalWarmth`    | `U`      | `UNKNOWN` | `U`   |          — | Bittersweet affect and one interpretation of the ending do not establish repeated bond or healing rewards.               |

- Genre: `mystery` — **ACCEPT**. Robot and space-police material belongs to incidents, so `scienceFiction` remains excluded at work level.
- Theme: `investigation:2` — **ACCEPT**. Detective inquiry and converging clues are the repeated structure.
- Final Narrative: `U / 2 / U / 3 / 4 / 2` = **4/6**.
- Final Tone: `U / 2 / 2 / 2 / U / U / U` = **3/7**.
- Remaining coverage: Tone short by **2**.
- Hard blocker: **no**. Finite next route: a complete-volume publisher editorial, creator interview, or rights-holder-approved commentary that directly covers recurring character change, subjective pressure, romance, or bond rewards.

## 12. work-3dfaf6231e21133620c6 — 忍者と極道

### Source and range check

- [Kodansha launch release](https://prtimes.jp/main/html/rd/p/000002502.000001719.html) and [Comic DAYS episode 1](https://comic-days.com/episode/10834108156722664318) are one Kodansha source family. They verify the two leads, hidden criminal role, 300-year faction conflict, trauma, and the complete first episode's availability.
- The cited URLs do **not** expose official volume 1, 2, and 3 descriptions. The responsible evaluated range is official premise plus episode 1, not volumes 1–3.

### Axis decisions

| Axis             | Proposed | Decision  | Final | Confidence | Direct evidence reason                                                                                             |
| ---------------- | -------- | --------- | ----- | ---------: | ------------------------------------------------------------------------------------------------------------------ |
| `progression`    | `U`      | `UNKNOWN` | `U`   |          — | The premise and first episode do not establish repeated growth, acquisition, or mastery rewards through entry 1–3. |
| `problemSolving` | `U`      | `UNKNOWN` | `U`   |          — | No repeated constraint-analysis and inventive-solution loop is exposed.                                            |
| `strategy`       | `U`      | `UNKNOWN` | `U`   |          — | A centuries-long conflict is not evidence of repeated long planning, politics, war operations, or resource use.    |

- Genre: `action` — **ACCEPT**.
- Theme: `combat:2` — **ACCEPT**. `revenge:1` — **UNKNOWN in this supplemental packet** because the direct sources establish a feud, not a revenge motive; Pass C should retain it only if the earlier in-scope evidence is explicitly reattached.
- Final Narrative: `U / U / U / 3 / 2 / 3` = **3/6**.
- Final Tone: `3 / 2 / U / 4 / 3 / U / 1` = **5/7**.
- Remaining coverage: Narrative short by **1**.
- Hard blocker: **no**. Finite next route: official volume 1–3 product pages, editorial, or readable previews that show one repeated progression, problem-solving, or strategy method.

## 13. work-3e725951eb9c49771087 — 嘘解きレトリック

### Source and range check

- Hakusensha [volume 1](https://www.hakusensha.co.jp/comicslist/45955/), [volume 2](https://www.hakusensha.co.jp/comicslist/45957/), and [volume 3](https://www.hakusensha.co.jp/comicslist/45959/) are the exact original volumes. They establish the ostracized heroine, stable detective partnership, and separate entry-scope cases.
- [BookLive volume 1 reviews](https://booklive.jp/review/list/title_id/303808/vol_no/001) contain distinct, volume-bound accounts describing gentle comedy, acceptance, trust, and warm episodes.
- [Cmoa reviews](https://www.cmoa.jp/title/91279/) are a second platform family and repeat comic tone, acceptance, and warmth. Whole-series observations are corroboration only; later romance is not projected backward.

### Axis decisions

| Axis              | Proposed | Decision  | Final | Confidence | Direct evidence reason                                                                                             |
| ----------------- | -------- | --------- | ----- | ---------: | ------------------------------------------------------------------------------------------------------------------ |
| `comedy`          | `2`      | `ACCEPT`  | `2`   |       0.80 | Multiple volume-1 reviewers on one family and a separate platform repeat a light comic tone around mystery cases.  |
| `mentalStress`    | `U`      | `UNKNOWN` | `U`   |          — | Past ostracism and case tension do not prove sustained pressure as the entry experience.                           |
| `romance`         | `U`      | `UNKNOWN` | `U`   |          — | Later relationship development is outside the range, and repeated absence in volumes 1–3 was not directly checked. |
| `emotionalWarmth` | `2`      | `ACCEPT`  | `2`   |       0.84 | Exact volume-1 reviews and a second platform repeat acceptance, trust, and warmth; mystery remains co-primary.     |

- Genres: `historical;mystery` — **ACCEPT**.
- Theme: `investigation:2` — **ACCEPT**. `workplace` remains excluded because case inquiry, not office procedure, is the repeated mechanic.
- Final Narrative: `U / 3 / U / 3 / 3 / 2` = **4/6**.
- Final Tone: `2 / 2 / 2 / 2 / U / U / 2` = **5/7**.
- Remaining coverage: **none; text gate passes**.
- Hard blocker: **no**. No additional route is required for the text gate.

## 14. work-40b8c35b1d8c9a90144c — orange

### Source and range check

- [Futabasha special site](https://www.futabasha.co.jp/introduction/orange/pc/index.html) verifies the current publisher's series overview.
- [Futabasha February 2022 order sheet](https://www.futabasha.co.jp/pdf/to-store-extra/comics.pdf) lists current volumes 1–3 and current ISBN suffixes `84323-1`, `84324-8`, and `84470-2`.
- Neither source maps the frozen Shueisha ISBN `9784088468044` to the Futabasha contents or states that the manga contents are unchanged. Current-edition synopsis and classification cannot be applied to the frozen edition before that bridge exists.

### Axis decisions

| Axis                    | Proposed | Decision  | Final | Confidence | Direct evidence reason                                                     |
| ----------------------- | -------- | --------- | ----- | ---------: | -------------------------------------------------------------------------- |
| `progression`           | `U`      | `UNKNOWN` | `U`   |          — | The evaluated edition is not bridged to the frozen representative edition. |
| `problemSolving`        | `U`      | `UNKNOWN` | `U`   |          — | The evaluated edition is not bridged to the frozen representative edition. |
| `strategy`              | `U`      | `UNKNOWN` | `U`   |          — | The evaluated edition is not bridged to the frozen representative edition. |
| `pacing`                | `U`      | `UNKNOWN` | `U`   |          — | The evaluated edition is not bridged to the frozen representative edition. |
| `mysteryReveal`         | `U`      | `UNKNOWN` | `U`   |          — | The evaluated edition is not bridged to the frozen representative edition. |
| `worldBuilding`         | `U`      | `UNKNOWN` | `U`   |          — | The evaluated edition is not bridged to the frozen representative edition. |
| `characterArcWeight`    | `U`      | `UNKNOWN` | `U`   |          — | The evaluated edition is not bridged to the frozen representative edition. |
| `relationshipStructure` | `U`      | `UNKNOWN` | `U`   |          — | The evaluated edition is not bridged to the frozen representative edition. |
| `comedy`                | `U`      | `UNKNOWN` | `U`   |          — | The evaluated edition is not bridged to the frozen representative edition. |
| `darkness`              | `U`      | `UNKNOWN` | `U`   |          — | The evaluated edition is not bridged to the frozen representative edition. |
| `mentalStress`          | `U`      | `UNKNOWN` | `U`   |          — | The evaluated edition is not bridged to the frozen representative edition. |
| `romance`               | `U`      | `UNKNOWN` | `U`   |          — | The evaluated edition is not bridged to the frozen representative edition. |
| `emotionalWarmth`       | `U`      | `UNKNOWN` | `U`   |          — | The evaluated edition is not bridged to the frozen representative edition. |

- Genres: **UNKNOWN**. The current site's SF love-story label is not a frozen-edition bridge.
- Themes: **none assigned**.
- Final Narrative: `U / U / U / U / U / U` = **0/6**.
- Final Tone: `U / U / U / U / U / U / U` = **0/7**.
- Remaining coverage: Narrative short by **4**; Tone short by **5**.
- Hard blocker: **no**. Finite next route: a Shueisha original volume 1–3 contents source or an official Shueisha/Futabasha unchanged-content statement; only then may scoped descriptions or reviews be used.

## 15. work-4c784fc78dfd9b139c3f — 正反対な君と僕

### Source and range check

- Shueisha [volume 1](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000022198000), [volume 2](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000024401900), and [volume 3](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883395-8) provide exact chapter tables and entry-scope summaries.
- The [official entry preview page](https://www.shonenjump.com/p/re/pixiv/164/) and [Shueisha author interview](https://shueisha.online/articles/-/135510) are the same publisher family. They add entry presentation and author intent, not an independent source family.
- The evaluated range is correctly volumes 1–3. The material repeatedly establishes school romance, dialogue, self-reflection, friends, and a second pair, but not one of the missing Narrative methods.

### Axis decisions

| Axis             | Proposed | Decision  | Final | Confidence | Direct evidence reason                                                                                                       |
| ---------------- | -------- | --------- | ----- | ---------: | ---------------------------------------------------------------------------------------------------------------------------- |
| `progression`    | `U`      | `UNKNOWN` | `U`   |          — | Relationship steps and self-reflection are character change, not repeated acquisition, mastery, or progression rewards.      |
| `problemSolving` | `U`      | `UNKNOWN` | `U`   |          — | Social situations are present, but the sources do not show constraint analysis and inventive resolution as the core process. |
| `strategy`       | `U`      | `UNKNOWN` | `U`   |          — | No repeated long planning, politics, war operations, or resource management is exposed.                                      |
| `mysteryReveal`  | `U`      | `UNKNOWN` | `U`   |          — | The summaries do not establish a clue, deduction, or truth-reveal reward; they also do not prove exhaustive absence.         |
| `worldBuilding`  | `U`      | `UNKNOWN` | `U`   |          — | A school setting alone does not establish or negate repeatedly important history, culture, rules, or factions.               |

- Genres: `comedy;romance;sliceOfLife` — **MODIFY by adding `comedy`**. All three official volume summaries directly call the work a romantic comedy; this Genre decision does not create a numeric `comedy` Axis value.
- Theme: `school:2` — **ACCEPT**.
- Final Narrative: `U / U / U / 2 / U / U` = **1/6**.
- Final Tone: `4 / 2 / U / U / 1 / 4 / 4` = **5/7**.
- Remaining coverage: Narrative short by **3**.
- Hard blocker: **no**. Finite next route: an official volume 1–3 editorial or readable sequence that directly demonstrates a repeated Narrative method; otherwise retain the closed unknowns.

## 16. work-518d7ed42dd9253679c3 — 墨攻

### Source and range check

- Shogakukan eComic Store [volume 1](https://e-comi.shogakukan.co.jp/books/091830410000d0000000), [volume 2](https://e-comi.shogakukan.co.jp/books/091830420000d0000000), and [volume 3](https://e-comi.shogakukan.co.jp/books/091830430000d0000000) expose exact episode lists and detailed siege summaries.
- [Cmoa reviews](https://www.cmoa.jp/title/9397/?order=up&page=1) are separate users on one platform, mostly whole-series retrospectives. They corroborate tactics and wartime human drama but do not establish entry-scoped subjective tone.
- The official pages establish later electronic volumes 1–3, but this packet contains no explicit unchanged-content statement tying them to the frozen paper edition. They are usable as scoped continuity evidence, not as a representative-ISBN replacement.

### Axis decisions

| Axis              | Proposed | Decision  | Final | Confidence | Direct evidence reason                                                                                                |
| ----------------- | -------- | --------- | ----- | ---------: | --------------------------------------------------------------------------------------------------------------------- |
| `comedy`          | `U`      | `UNKNOWN` | `U`   |          — | No scoped source establishes recurring comedy or an exhaustively observed absence.                                    |
| `mentalStress`    | `U`      | `UNKNOWN` | `U`   |          — | Siege injury, casualties, and danger support tragic stakes, not sustained subjective anxiety or psychological strain. |
| `romance`         | `U`      | `UNKNOWN` | `U`   |          — | No scoped source establishes recurring romance or an exhaustively observed absence.                                   |
| `emotionalWarmth` | `U`      | `UNKNOWN` | `U`   |          — | Whole-series reader emotion does not establish repeated entry-scope bond or healing rewards.                          |

- Genres: `action;historical` — **ACCEPT**.
- Themes: `combat:2;territoryManagement:2;war:2` — **ACCEPT**. Fortification, weapons, training, command authority, siege methods, and repeated attacks directly separate the three mechanics.
- Final Narrative: `U / 4 / 4 / 3 / 1 / 3` = **5/6**.
- Final Tone: `2 / 3 / U / 3 / U / U / U` = **3/7**.
- Remaining coverage: Tone short by **2**.
- Hard blocker: **no**. Finite next route: a bridged original-edition preview or volume-scoped criticism that directly observes subjective pressure, romance, comedy, or recurring bond rewards in volumes 1–3.

## 17. work-53e54c95f637b66c4fb2 — がんばれ元気

### Source and range check

- Shogakukan eComic Store [volume 1](https://e-comi.shogakukan.co.jp/books/091202110000d0000000), [volume 2](https://e-comi.shogakukan.co.jp/books/091202120000d0000000), and [volume 3](https://e-comi.shogakukan.co.jp/books/091202130000d0000000) establish the father's comeback and death, inherited goal, secret practice, teacher support, and gym entry.
- [Cmoa reviews](https://www.cmoa.jp/title/528/) contain distinct accounts on one platform. One review is limited to volumes 1–2; the others are broad retrospectives. None exposes repeated entry-scope bout analysis or planning.
- The official pages are later electronic volumes and provide no explicit unchanged-content bridge to the frozen paper edition in this packet. Their summaries still do not supply the missing Narrative method.

### Axis decisions

| Axis             | Proposed | Decision  | Final | Confidence | Direct evidence reason                                                                                   |
| ---------------- | -------- | --------- | ----- | ---------: | -------------------------------------------------------------------------------------------------------- |
| `problemSolving` | `U`      | `UNKNOWN` | `U`   |          — | Training and bouts exist, but no repeated constraint-analysis and inventive-solution process is exposed. |
| `strategy`       | `U`      | `UNKNOWN` | `U`   |          — | A long-term goal and perseverance are not repeated tactical or resource-planning rewards.                |
| `mysteryReveal`  | `U`      | `UNKNOWN` | `U`   |          — | No clue or reveal structure is established, and the sources do not exhaustively prove its absence.       |

- Genre: `sports` — **ACCEPT**. A store metadata tag for gags does not independently establish work-level `comedy` Genre from entry recurrence.
- Themes: `martialArts:2;sportsCompetition:2` — **ACCEPT**.
- Final Narrative: `2 / U / U / 3 / U / 2` = **3/6**.
- Final Tone: `4 / 2 / U / 2 / 2 / U / 3` = **5/7**.
- Remaining coverage: Narrative short by **1**.
- Hard blocker: **no**. Finite next route: an official volumes 1–3 episode sequence or scoped commentary that directly shows bout analysis, constraint handling, or a repeated plan.

## 18. work-5915d6d7601377fcc75f — 赤髪の白雪姫

### Source and range check

- Hakusensha [volume 1](https://www.hakusensha.co.jp/comicslist/44169/), [volume 2](https://www.hakusensha.co.jp/comicslist/44171/), and [volume 3](https://www.hakusensha.co.jp/comicslist/44173/) are exact original editions. They establish migration, the court pharmacist exam, a garrison illness, and royal relationship conflict.
- [BookLive volume 2 reviews](https://booklive.jp/review/list/title_id/319367/vol_no/002) are volume-bound accounts on one platform. [Cmoa reviews](https://www.cmoa.jp/title/customer_review/title_id/98014/) are a second platform family, but most are whole-series retrospectives; the explicitly one-volume account is only supplemental.
- The sources expose the illness event but not the causal observation, knowledge application, or resolution steps.

### Axis decisions

| Axis             | Proposed | Decision  | Final | Confidence | Direct evidence reason                                                                                    |
| ---------------- | -------- | --------- | ----- | ---------: | --------------------------------------------------------------------------------------------------------- |
| `problemSolving` | `U`      | `UNKNOWN` | `U`   |          — | Pharmacist work and a solved illness event do not show the analysis and solution process.                 |
| `strategy`       | `U`      | `UNKNOWN` | `U`   |          — | Royal conflict is present, but long planning, political operation, or resource management is not exposed. |
| `mysteryReveal`  | `U`      | `UNKNOWN` | `U`   |          — | The illness cause and its discovery sequence are absent from the descriptions and scoped reviews.         |

- Genres: `fantasy;romance` — **ACCEPT**.
- Themes: `politics:1;workplace:1` — **ACCEPT**. The court conflict and pharmacist work are recurring secondary material, not inflated to centrality 2.
- Final Narrative: `2 / U / U / 3 / U / 2` = **3/6**.
- Final Tone: `4 / 3 / U / 2 / 2 / 3 / 3` = **6/7**.
- Remaining coverage: Narrative short by **1**.
- Hard blocker: **no**. Finite next route: an official volume-2 preview or approved editorial showing the garrison illness's observation, inference, and resolution sequence.

## 19. work-5b4dc4e6e966436b2990 — 人形芝居

### Source and range check

- Hakusensha [volume 1](https://www.hakusensha.co.jp/comicslist/41133/), [volume 2](https://www.hakusensha.co.jp/comicslist/41065/), and [volume 3](https://www.hakusensha.co.jp/comicslist/43939/) are exact original volumes. They establish episodic dolls aiding lonely people, creator secrets, lost healing ability, inheritance, and three human-drama stories.
- [Cmoa reviews](https://www.cmoa.jp/title/91264/) include distinct accounts on one platform; entry-specific observations separate bittersweet or unbearable episodes from the generally warm one-shot structure.
- [BookLive volume 1 reviews](https://booklive.jp/review/list/title_id/303790/vol_no/001) are Booklog-syndicated accounts, several explicitly covering volumes 1–3. They form a second review family and repeatedly describe inevitable human–doll separation alongside warmth.

### Axis decisions

| Axis             | Proposed | Decision  | Final | Confidence | Direct evidence reason                                                                                                |
| ---------------- | -------- | --------- | ----- | ---------: | --------------------------------------------------------------------------------------------------------------------- |
| `progression`    | `U`      | `UNKNOWN` | `U`   |          — | Episodic visitor change does not establish repeated growth, acquisition, or mastery rewards.                          |
| `problemSolving` | `U`      | `UNKNOWN` | `U`   |          — | Dolls helping people is a premise, not evidence of repeated constraint analysis and inventive resolution.             |
| `strategy`       | `U`      | `UNKNOWN` | `U`   |          — | No repeated long planning, politics, war operations, or resource management is exposed.                               |
| `comedy`         | `U`      | `UNKNOWN` | `U`   |          — | No scoped source establishes recurring comedy or an exhaustively observed absence.                                    |
| `darkness`       | `2`      | `ACCEPT`  | `2`   |       0.77 | Original summaries establish loneliness and loss; two review families repeat unavoidable separation and sad episodes. |
| `mentalStress`   | `U`      | `UNKNOWN` | `U`   |          — | Reader tears and sadness are not sustained subjective anxiety, frustration, or collapse.                              |
| `romance`        | `U`      | `UNKNOWN` | `U`   |          — | Some stories contain love, but the packet does not establish recurring work-level romance or repeated absence.        |

- Genres: `scienceFiction;sliceOfLife` — **ACCEPT**.
- Themes: **none assigned**. Doll construction is setting infrastructure, not a recurring `crafting` reward; family-like bonds vary by episode, so `foundFamily` is not promoted without clearer repeated mechanic evidence.
- Final Narrative: `U / U / U / 2 / 2 / 3` = **3/6**.
- Final Tone: `3 / 3 / U / 2 / U / U / 3` = **4/7**.
- Remaining coverage: Narrative short by **1**; Tone short by **1**.
- Hard blocker: **no**. Finite next route: an exact volumes 1–3 preview or volume-scoped criticism showing a repeated solution method and one additional distinct Tone axis.

## 20. work-5b9a3ec60ac5fc90f444 — 魔法使いの嫁

### Source and range check

- KADOKAWA [volume 1](https://store.kadokawa.co.jp/shop/g/g302401004255/), [volume 2](https://store.kadokawa.co.jp/shop/g/g302401004256/), and [volume 3](https://store.kadokawa.co.jp/shop/g/g302401004784/) each explicitly state that the manga content is unchanged from the Mag Garden edition. This is a sufficient edition bridge for text observations.
- The [Bushiroad Works release](https://bushiroad.com/media/ad0a6356920f0b15) is the same current-publisher family and places the volume 1–3 summaries and release order together; it is corroboration, not an independent source family.
- The [Mag Garden author-supervised supplement page](https://comic.mag-garden.co.jp/mgnbooks/mediamix_books/mahoyome-supplement/) explicitly covers dialogue intent, mythology, animals, plants, and spells from volumes 1–3. Its metadata and page payload establish that scope even though the rendered text endpoint is sparse.
- [BookLive volume 2 reviews](https://booklive.jp/review/list/title_id/1523783/vol_no/002) and [volume 3 reviews](https://booklive.jp/product/index/title_id/1523783/vol_no/003) are separate accounts on one platform family and are directly volume-bound.
- [Cmoa Mag Garden-edition reviews](https://www.cmoa.jp/title/80730/) form a second review family. The 2014-09-11 account is limited by publication date to the entry volumes and is used only to corroborate the mix of danger and warmth.

### Axis decisions

| Axis                    | Proposed | Decision  | Final | Confidence | Direct evidence reason                                                                                                                                       |
| ----------------------- | -------- | --------- | ----- | ---------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `progression`           | `2`      | `UNKNOWN` | `U`   |          — | Restarting life, learning love, and expressing an opinion are character-arc evidence; no repeated acquisition or mastery payoff is exposed.                  |
| `problemSolving`        | `U`      | `UNKNOWN` | `U`   |          — | Three assigned tasks are named, but the constraint analysis and solution method are not exposed.                                                             |
| `strategy`              | `U`      | `UNKNOWN` | `U`   |          — | No repeated long planning, politics, war operations, or resource management is exposed.                                                                      |
| `pacing`                | `3`      | `MODIFY`  | `2`   |       0.88 | The official summaries show substantial volume/arc changes, exactly the anchor-2 pattern; they do not show repeated short-interval changes required above 2. |
| `mysteryReveal`         | `2`      | `ACCEPT`  | `2`   |       0.85 | Volume 2 poses the attackers' purpose and the heroine's power; volume 3 identifies the power, cost, attacker, and another form.                              |
| `worldBuilding`         | `3`      | `ACCEPT`  | `3`   |       0.91 | Tasks, magical roles, named powers and costs repeatedly affect events, and the author-supervised volume 1–3 supplement confirms the rule and myth layer.     |
| `characterArcWeight`    | `4`      | `ACCEPT`  | `4`   |       0.92 | The official framing centers a stopped life restarting, learning love, and mutual understanding; volume-bound reviews repeat both leads' change.             |
| `relationshipStructure` | `2`      | `ACCEPT`  | `2`   |       0.91 | The same two-person core recurs through all three summaries; supporting figures do not create an ensemble relationship network.                              |
| `comedy`                | `U`      | `UNKNOWN` | `U`   |          — | Light moments are noted, but recurring comedy or an exhaustively observed absence is not established.                                                        |
| `darkness`              | `3`      | `ACCEPT`  | `3`   |       0.90 | Hopelessness and sale, sacrifice and attack, then a harsh power cost and stabbing repeat tragic danger across all three volumes.                             |
| `mentalStress`          | `2`      | `ACCEPT`  | `2`   |       0.76 | Volume-bound accounts separately observe tension, painful events, dependence concern, and a heavy past; recurring warmth limits the value to mixed 2.        |
| `romance`               | `3`      | `ACCEPT`  | `3`   |       0.90 | Bride and interspecies-marriage framing, learning love, and mutual understanding recur from volumes 1–3, without proving an unqualified anchor 4.            |
| `emotionalWarmth`       | `3`      | `ACCEPT`  | `3`   |       0.86 | Love learning and relationship change are official; two review families repeat safety, warmth, and hope amid substantial danger.                             |

- Genres: `fantasy;romance` — **MODIFY by adding `romance`**. The official volumes repeatedly identify marriage and love as entry-scope story material; this is not inferred from the numeric `romance` Axis.
- Themes: **none assigned**. The evidence supports setting, relationship, and tone axes, but no listed mechanic should be inflated solely to fill a tag.
- Final Narrative: `U / U / U / 2 / 2 / 3` = **3/6**.
- Final Tone: `4 / 2 / U / 3 / 2 / 3 / 3` = **6/7**.
- Remaining coverage: Narrative short by **1**.
- Hard blocker: **no**. Finite next route: an official volumes 1–3 preview or approved editorial showing either repeated skill acquisition or a concrete constraint-analysis and solution loop.

## Coverage and disposition

| Pos | canonicalTitle   | Final N/T | Gate result | Remaining deficit | Hard blocker | Finite route |
| --: | ---------------- | --------- | ----------- | ----------------- | ------------ | ------------ |
|  11 | 外天楼           | 4/6, 3/7  | fail        | T +2              | no           | yes          |
|  12 | 忍者と極道       | 3/6, 5/7  | fail        | N +1              | no           | yes          |
|  13 | 嘘解きレトリック | 4/6, 5/7  | **pass**    | none              | no           | not needed   |
|  14 | orange           | 0/6, 0/7  | fail        | N +4, T +5        | no           | yes          |
|  15 | 正反対な君と僕   | 1/6, 5/7  | fail        | N +3              | no           | yes          |
|  16 | 墨攻             | 5/6, 3/7  | fail        | T +2              | no           | yes          |
|  17 | がんばれ元気     | 3/6, 5/7  | fail        | N +1              | no           | yes          |
|  18 | 赤髪の白雪姫     | 3/6, 6/7  | fail        | N +1              | no           | yes          |
|  19 | 人形芝居         | 3/6, 4/7  | fail        | N +1, T +1        | no           | yes          |
|  20 | 魔法使いの嫁     | 3/6, 6/7  | fail        | N +1              | no           | yes          |

- Research-proposed known axes reviewed: **14** — `ACCEPT 12`, `MODIFY 1`, `UNKNOWN 1`.
- All routed gap-axis decisions recorded: **60** — `ACCEPT 12`, `MODIFY 1`, `UNKNOWN 47`.
- Responsible new known axes after review: **13 across 4 works**.
- Text coverage: **1 pass, 9 fail**.
- Remaining minimum deficit: **Narrative 12 axes, Tone 10 axes**.
- Hard-blocker candidates: **0**. Nine works have a finite next route. If a finite route returns no qualifying evidence, the relevant axes remain `unknown` and the work fails the text gate; no value is fabricated to meet coverage.
