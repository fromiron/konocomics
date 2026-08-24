# Pilot 001 official text coverage gap C — independent Pass B review

- Repository branch / HEAD: `main` / `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Reviewed proposal: `/tmp/pilot-text-gap-c.md`
- Proposal SHA-256: `6341971ad5ce9ceaac19706866e1eb8b92ccda5960496582e677c21fcf38f2c3`
- Review date / source retrieval date: 2026-08-23
- Scope: exactly four works — 鈴木先生, 坂道のアポロン, ばらかもん, 海街diary
- Repository mutation: none
- Art: out of scope; no Art state or value is proposed here

This review independently re-read the Factor Dictionary, the current-SHA raw research packet, Pass A chunk 03, the existing Pass B/C review, the coverage-gap ledger, the promotion method, and the hard-blocker rule. It then re-opened the official product pages and readers and directly inspected the retained entry-page samples. It did not inherit the proposal's conclusions.

Canonical titles below contain no decorative corner brackets. Genre was never converted into an Axis, and a synopsis's silence was never treated as a known zero.

## 1. Contract and gate used

- Factor scope: first 1–3 volumes or the first major episode.
- Narrative gate: at least 4 known axes out of 6. `4/6 = 0.667`, above the unchanged 0.60 product coverage threshold.
- Tone gate: at least 5 known axes out of 7. `5/7 = 0.714`, above the unchanged 0.60 product coverage threshold.
- Pilot schema gate: Genre and Theme must each be nonempty.
- `unknown` is not zero and is not a midpoint.
- A low value is allowed only when the inspected entry structure positively supports the low anchor; omission from marketing copy is insufficient.
- A text hard blocker is allowed only after a failing gate remains failing and its reproducible official entry routes have been exhausted. Passing this narrow text gate does not by itself approve full promotion; identity, safety, Art, Evidence, context, and all other promotion gates remain separate.

Narrative order is `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`.

Tone order is `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`.

## 2. Independent outcome

| workId | title | review of proposed additions | independently reviewed Narrative | Tone | Genre | Theme | text gate |
|---|---|---|---:|---:|---|---|---|
| `work-ebe399258f28460b8f9b` | 鈴木先生 | accept `strategy=2`, `romance=1`, `sliceOfLife` | `U/2/2/2/2/U` = **4/6** | `3/3/1/U/4/1/U` = **5/7** | `sliceOfLife` | `school=2; workplace=2` | **PASS** |
| `work-205e576ef057e3aed1ab` | 坂道のアポロン | accept `problemSolving=0`, `strategy=0` | `U/0/0/2/U/2` = **4/6** | `4/2/U/U/2/3/2` = **5/7** | `historical; romance` | `school=2` | **PASS** |
| `work-f5f0ee0b0ff16bc146e0` | ばらかもん | accept `strategy=0`, `darkness=0`, `foundFamily=2` | `2/U/0/2/U/2` = **4/6** | `4/2/4/0/U/U/4` = **5/7** | `comedy; sliceOfLife` | `foundFamily=2` | **PASS** |
| `work-a7a1e0666169f1b2e8c0` | 海街diary | accept `problemSolving=2`, `worldBuilding=1`, `sliceOfLife`, `foundFamily=2`; **reject `strategy=0`, correct to `strategy=1`** | `U/2/1/1/U/1` = **4/6** | `4/3/U/1/2/U/3` = **5/7** | `sliceOfLife` | `foundFamily=2` | **PASS WITH CORRECTION** |

Aggregate result:

- Coverage/schema pass: **4/4**
- Proposal values accepted unchanged: **12** — 8 Axis, 2 Genre assignments, and 2 Theme assignments
- Proposal value rejected: **1** — 海街diary `strategy=0`
- Corrected supported value: **1** — 海街diary `strategy=1`
- Text `RESEARCH_REQUIRED` after this review: **0/4**
- Text hard-blocker candidates: **0**
- Remaining required official route for this narrow text gate: **0**

The count wording above treats each Genre set or Theme assignment as one proposed addition. At the field level there are 13 proposed additions: 12 accepted unchanged and 1 corrected.

## 3. 鈴木先生 — work-ebe399258f28460b8f9b

### 3.1 Official source and edition check

1. 双葉社 official Book API, volume 1
   - URL: https://book-api.futabasha.co.jp/book_details?media=1&jdcn_code=97845759402370000000&image_size=330%2055%201000&grouping_media=0
   - Published: 2006-08-11
   - Retrieved: 2026-08-23
   - Edition: volume 1, ISBN `9784575940237`, JDCN `97845759402370000000`
   - Direct check: the API returns the title, creator, ISBN, release date, `trial_url`, and a description of a teacher tackling minor problems and major trials.
2. 双葉社 official internal reader
   - URL: https://reader.futabasha.co.jp/97845759402370000000
   - Published: reader undated; bound edition dated 2006-08-11
   - Retrieved: 2026-08-23
   - Edition/range: the API binds this reader to ISBN `9784575940237`; the complete accessible sample was checked through its purchase end screen, covering printed pages 4–26.
   - Direct check: pages 4–5 show Suzuki sharing a meal with a female partner who says they are both busy and rarely meet. The school-lunch conflict follows. Around pages 16–18 Suzuki fixes a bounded observation period, watches the pupils repeatedly, writes a seat map and comparative notes, tests a hypothesis, and receives a follow-up message from 麻美 before returning to the class.
3. 双葉社 official Book API, volume 2
   - URL: https://book-api.futabasha.co.jp/book_details?media=1&jdcn_code=97845759406880000000&image_size=330%2055%201000&grouping_media=0
   - Published: 2007-02-28
   - Retrieved: 2026-08-23
   - Edition: volume 2, ISBN `9784575940688`
   - Direct check: `trial_url=null`; the description repeats the broad teacher/problem premise and adds no scoped scene evidence.
4. 双葉社 official Book API, volume 3
   - URL: https://book-api.futabasha.co.jp/book_details?media=1&jdcn_code=97845759410670000000&image_size=330%2055%201000&grouping_media=0
   - Published: 2007-07-03
   - Retrieved: 2026-08-23
   - Edition: volume 3, ISBN `9784575941067`
   - Direct check: `trial_url=null`; the description is likewise non-informative for additional scoped axes.

### 3.2 Independent decisions

- `strategy=2` — **ACCEPT**, proposed confidence 0.86 is supportable. This is not a duplicate inference from `problemSolving=2`. The reader positively shows a short plan: a declared observation window, repeated observation, a seat map, written comparison, hypothesis testing, and a planned return to the pupils. That directly matches the level-2 short-plan anchor and does not reach long-horizon level 4.
- `romance=1` — **ACCEPT**, proposed confidence 0.72 is supportable. The partner meal, stated scarcity of meetings, later follow-up message, and Suzuki's continued response establish a recurring romantic relationship in the entry sample. It is secondary framing rather than a subplot-level reward, so the between-anchor value 1 is more precise than 2. The value is not inferred from a character's gender or from a Genre.
- Genre `sliceOfLife` — **ACCEPT**, proposed confidence 0.84 is supportable. The accessible entry sample is organized around an ordinary meal, daily school lunch, staff consultation, classroom observation, home notes, and return to class. That repeated everyday structure independently supports the Genre; it is not copied from `school` or `workplace` Themes.
- `emotionalWarmth` remains **unknown**. The partner interaction is supportive, but the entry does not establish repeated healing or bond payoff, and professional care is not automatically warmth.
- `progression`, `worldBuilding`, and `darkness` remain **unknown**.

### 3.3 Count and boundary

- Narrative: `U/2/2/2/2/U` = **4/6**
- Tone: `3/3/1/U/4/1/U` = **5/7**
- Genre/Theme: nonempty
- Result: **PASS**
- Remaining route: none. Volume 1's accessible sample ends at printed page 26, and official volume 2–3 records expose no separate trial.
- Hard blocker: none.

## 4. 坂道のアポロン — work-205e576ef057e3aed1ab

### 4.1 Official source and edition check

The three product pages and readers share exact JDCNs. The companion 小学館コミック JDCN pages show the digital edition date 2013-01-01 for each volume. An ISBN query for volume 1 redirects to JDCN `091316700000d0000000`, preserving the paper-to-digital edition mapping; that electronic date must not replace the repository's paper-edition date.

1. Volume 1
   - Product URL: https://e-comi.shogakukan.co.jp/books/091316700000d0000000
   - Reader URL: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091316700000d0000000
   - Companion metadata: https://shogakukan-comic.jp/book?isbn=9784091316707
   - Source date: product page undated; companion digital edition 2013-01-01
   - Retrieved: 2026-08-23
   - Edition/range: volume 1, JDCN `091316700000d0000000`; accessible reader pages 4–37 were checked.
   - Direct check: Kaoru's school distress leads to the rooftop-key obstacle. He reacts to the bullies, Sentaro resolves the physical obstacle by force, and then gives Kaoru the key. The scene lands on an interpersonal gesture rather than analysis or a plan.
2. Volume 2
   - Product URL: https://e-comi.shogakukan.co.jp/books/091321740000d0000000
   - Reader URL: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091321740000d0000000
   - Companion metadata: https://shogakukan-comic.jp/book?isbn=9784091321740
   - Source date: product page undated; companion digital edition 2013-01-01
   - Retrieved: 2026-08-23
   - Edition/range: volume 2, JDCN `091321740000d0000000`; accessible opening pages 6–9 were checked.
   - Direct check: the group rehearses jazz; classmates invite Kaoru out, and he immediately chooses rehearsal with Sentaro. The product summary describes first experiences and events changing the trio's relationship.
3. Volume 3
   - Product URL: https://e-comi.shogakukan.co.jp/books/091322680000d0000000
   - Reader URL: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091322680000d0000000
   - Companion metadata: https://shogakukan-comic.jp/book?isbn=9784091322686
   - Source date: product page undated; companion digital edition 2013-01-01
   - Retrieved: 2026-08-23
   - Edition/range: volume 3, JDCN `091322680000d0000000`; accessible opening pages 6–9 were checked.
   - Direct check: Kaoru plays piano at a family gathering while relatives question his schooling and social isolation. The product summary continues friendship through jazz and crossed romantic interests.

### 4.2 Independent decisions

- `problemSolving=0` — **ACCEPT**, proposed confidence 0.79 is supportable. The directly inspected entry obstacle is resolved through force and an emotional relationship gesture, which is the Dictionary's low anchor. The later openings continue immediate social or musical choices. This is positive mechanism evidence, not a zero inferred from `historical` or `romance`.
- `strategy=0` — **ACCEPT**, proposed confidence 0.77 is supportable. The entry sample repeatedly shows immediate reaction: attempting to get the key, confronting or fleeing the bullies, accepting the key, choosing rehearsal, and responding to family pressure. No tactical or long-horizon plan organizes the inspected range. Unlike 海街diary below, no explicit short procedural plan appears as a counterexample.
- `progression` remains **unknown**. Playing music does not alone prove repeated skill-acquisition rewards.
- `mysteryReveal` remains **unknown**. The official summaries' silence cannot establish zero.

### 4.3 Count and boundary

- Narrative: `U/0/0/2/U/2` = **4/6**
- Tone: `4/2/U/U/2/3/2` = **5/7**
- Genre/Theme: nonempty
- Result: **PASS**
- Remaining route: none for this narrow gate; all three named JDCN-matched product and preview routes were checked.
- Hard blocker: none.

## 5. ばらかもん — work-f5f0ee0b0ff16bc146e0

### 5.1 Official source and edition check

1. SQUARE ENIX volume 1
   - URL: https://magazine.jp.square-enix.com/top/comics/detail/9784757526167/
   - Published: 2009-07-22
   - Retrieved: 2026-08-23
   - Edition: volume 1, ISBN `9784757526167`
   - Direct check: the page enumerates tractor travel, children using Handa's home, and unconventional neighbor entry as concrete everyday obstacles and links the official first chapter.
2. SQUARE ENIX volume 2
   - URL: https://magazine.jp.square-enix.com/top/comics/detail/9784757527966/
   - Published: 2010-02-22
   - Retrieved: 2026-08-23
   - Edition: volume 2, ISBN `9784757527966`
   - Direct check: the narrow village society and overly sociable children are troublesome but make Handa slightly more open.
3. SQUARE ENIX volume 3
   - URL: https://magazine.jp.square-enix.com/top/comics/detail/9784757530270/
   - Published: 2010-10-22
   - Retrieved: 2026-08-23
   - Edition: volume 3, ISBN `9784757530270`
   - Direct check: a second-place calligraphy setback brings a rival and Handa's only friend to the island; the highlighted contest becomes comic sea fishing.
4. 月刊少年ガンガン official work and cast page
   - URL: https://magazine.jp.square-enix.com/gangan/introduction/barakamon/
   - Published: undated
   - Retrieved: 2026-08-23
   - Range: work-level premise and recurring cast, checked against the entry-volume descriptions.
   - Direct check: the publisher describes gradual growth through island daily life. Naru is explicitly Handa's caretaker-like child, Hiroshi handles his meals, the village chief's wife looks after him, and Kawafuji is his only friend and manager-like support.
5. ガンガンONLINE official first major episode
   - URLs:
     - https://www.ganganonline.com/title/868/chapter/33142
     - https://www.ganganonline.com/title/868/chapter/33139
     - https://www.ganganonline.com/title/868/chapter/33136
   - Published: chapter pages undated; volume 1 dated 2009-07-22
   - Retrieved: 2026-08-23
   - Edition/range: ACT.1-1, ACT.1-2, and ACT.1-3 together form the complete available first major episode; all accessible slots were checked.
   - Direct check: Handa impulsively punches a senior calligrapher, is sent to the island, reacts to unfamiliar transport and a shared home, clashes with Naru, cleans and attempts calligraphy, apologizes after reflection, accepts Naru's forgiveness and help, and produces a freer new work. Water and wall episodes are bounded comic challenges with immediate safety, not sustained peril.

### 5.2 Independent decisions

- `strategy=0` — **ACCEPT**, proposed confidence 0.86 is supportable. The complete first major episode positively shows impulsive or immediate action: the punch, anger, apology, following Naru's directions, and an unplanned calligraphic response. The three official entry-volume summaries continue local episodes and direct setbacks rather than a tactical or long-horizon plan.
- `darkness=0` — **ACCEPT**, proposed confidence 0.90 is supportable. This is not inferred from the `comedy` Genre. The inspected episode provides the necessary counterexample check: potentially rough events are bounded comic beats and immediately resolve into safety or relationship payoff. The three entry-volume summaries enumerate low-stakes social, work, and fishing conflicts rather than serious danger or tragedy as an entry reward.
- Theme `foundFamily=2` — **ACCEPT**, with confidence 0.88–0.91 supportable. The assignment is not based merely on residents being present. The first episode establishes non-kin domestic intrusion, conflict, forgiveness, help, and adjustment; volume 2 repeats the children's role in opening Handa up; the official cast page explicitly assigns multiple non-kin caretaker, meal, friendship, and household-support roles. Non-kin communal care is therefore a repeated core mechanism.
- `problemSolving`, `mysteryReveal`, `mentalStress`, and `romance` remain **unknown**.

### 5.3 Count and boundary

- Narrative: `2/U/0/2/U/2` = **4/6**
- Tone: `4/2/4/0/U/U/4` = **5/7**
- Genre/Theme: nonempty
- Result: **PASS**
- Remaining route: none. The complete available ACT.1 and the official volume 1–3 descriptions were checked.
- Hard blocker: none.

## 6. 海街diary — work-a7a1e0666169f1b2e8c0

### 6.1 Official source and edition check

1. 小学館 volume 1
   - URL: https://shogakukan-comic.jp/book?isbn=9784091670250
   - Reader: https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091670250000d0000000
   - Published: 2007-04-26
   - Retrieved: 2026-08-23
   - Edition/range: volume 1, ISBN `9784091670250`, JDCN `091670250000d0000000`; the complete accessible reader sample was checked from printed page 6 through the end modal after printed page 49. This is the complete available sample, not a claim that the whole volume or whole first episode ends at page 49.
   - Direct check: the sisters travel to their estranged father's funeral and meet Suzu. Pages 28–29 explicitly discuss estate constraints and a procedural option: dispose of real property, include debts, divide among legal heirs, obtain agreement, and change registration. Pages 44–47 show the eldest sister directly confronting adults who are placing ceremonial and emotional responsibility on a 13-year-old child. Meals, bathing, travel, family banter, grief, and practical decisions alternate throughout the sample.
2. 小学館 volume 2
   - URL: https://shogakukan-comic.jp/book?isbn=9784091670373
   - Published: 2008-10-10
   - Retrieved: 2026-08-23
   - Edition: volume 2, ISBN `9784091670373`
   - Direct check: Suzu is explicitly becoming accustomed to a new life with the older sisters in Kamakura.
3. 小学館 volume 3
   - URL: https://shogakukan-comic.jp/book?isbn=9784091670403
   - Published: 2010-02-10
   - Retrieved: 2026-08-23
   - Edition: volume 3, ISBN `9784091670403`
   - Direct check: after a full turn of the seasons, Suzu and the three sisters return for the father's memorial; the publisher says the four sisters' time moves slowly and joy and grief become family memory.

### 6.2 Independent decisions

- `problemSolving=2` — **ACCEPT**, proposed confidence 0.83 is supportable. The entry sample directly combines constraint analysis with action: an inheritance professional identifies property, debt, legal-heir, consent, and registration constraints; the eldest sister then acts in the family conflict. This matches the level-2 mix of considered resolution and direct action, not level 4's repeated ingenious-solving core.
- Proposed `strategy=0` — **REJECT**. The proposal's own evidence contains a counterexample to zero. Pages 28–29 do not show only immediate moral reaction; they explicitly set out a short procedural estate plan. Therefore the entry cannot be described as wholly plan-free or purely reactive.
- `strategy=1` — **ACCEPT AS CORRECTION**, confidence about 0.70. Planning is present but limited and peripheral: one concrete short-term procedure is discussed, while the episode's main family conflicts still resolve through immediate conversations and moral decisions. Value 1 correctly places the sample between reactive level 0 and a recurring tactical-plan level 2.
- `worldBuilding=1` — **ACCEPT**, proposed confidence 0.72 is supportable. Inheritance law, funeral procedure, travel, and household arrangements briefly constrain the episode. They are more than pure visual backdrop but do not form the repeated history, culture, rule, or faction system required for level 2–4. The same legal scene may support this distinct setting claim because it contains an independently observable rule constraint; it is not being reused as a Genre inference.
- Genre `sliceOfLife` — **ACCEPT**, proposed confidence 0.91 is supportable. The entry alternates ordinary sibling banter, travel, meals, bathing, funeral tasks, grief, and family decisions. Volumes 2–3 continue daily household adjustment and seasonal time. This conclusion comes from repeated episode structure, not from mechanically converting the publisher's human-drama label.
- Theme `foundFamily=2` — **ACCEPT**, proposed confidence 0.92 is supportable. Biological relation alone would be insufficient, as Pass A correctly warned. The new evidence is stronger: previously separate half-sisters meet, the eldest actively protects Suzu, volume 2 confirms Suzu's new household life with the three older sisters, and volume 3 returns the four sisters as the continuing unit. This is a newly constructed family household after separation and loss, analogous to the repository's established guardian-relative `foundFamily` usage, not a tag assigned merely because relatives appear.
- `progression`, `mysteryReveal`, `comedy`, and `romance` remain **unknown**.

### 6.3 Count and boundary

- Narrative after correction: `U/2/1/1/U/1` = **4/6**
- Tone: `4/3/U/1/2/U/3` = **5/7**
- Genre/Theme: nonempty
- Result: **PASS WITH CORRECTION**
- Remaining route: none for this narrow gate. The complete accessible volume-1 sample and official volume 1–3 pages were checked.
- Hard blocker: none.

## 7. Final route and blocker ledger

| title | official route independently checked | remaining required text route | text blocker |
|---|---|---|---|
| 鈴木先生 | Futabasha ISBN-matched volume-1 reader through printed page 26; volume-2/3 APIs and trial availability | none | none |
| 坂道のアポロン | Shogakukan JDCN-matched volume-1/2/3 product pages and readers | none | none |
| ばらかもん | SQUARE ENIX volume-1/2/3 pages; official work/cast page; all three ACT.1 reader segments | none | none |
| 海街diary | Shogakukan ISBN/JDCN-matched volume-1 sample through printed page 49; official volume-1/2/3 pages | none | none |

No `SOURCE_INFORMATION_UNAVAILABLE`, `FACTOR_MODEL_INCOMPATIBLE`, identity, or safety blocker is established by this narrow review. The result authorizes neither source-data mutation nor `recommendationVerified` status by itself. It only closes the specified official-text coverage questions with one required correction: 海街diary `strategy=1`, not `strategy=0`.

Temporary inspection files remain only under ignored `output/playwright/pilot-text/gap-c-review/`; they are not Evidence artifacts and must not be committed.
