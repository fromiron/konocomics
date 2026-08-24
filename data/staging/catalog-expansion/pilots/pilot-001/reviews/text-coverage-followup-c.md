# Pilot 001 official text coverage gap C

- Repository branch / HEAD: `main` / `e03cfc9e45077386d1ec4d744a3bdee4b9176f1a`
- Candidate SHA-256: `aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529`
- Research date: 2026-08-23
- Scope: exactly four works — 鈴木先生, 坂道のアポロン, ばらかもん, 海街diary
- Gate: Narrative known `>= 4/6`; Tone known `>= 5/7`; Genre and Theme nonempty
- Evaluation range: first 1–3 volumes or the first major episode only
- Repository mutation: none. This is a research/adjudication packet, not an applied annotation patch.

Canonical titles in this report do not contain decorative corner brackets. Selection provenance was not reused as Factor Evidence. Genre was not converted into Axis values, and synopsis omission was never treated as a zero.

## Outcome

| workId | title | evidence-backed additions | final Narrative | final Tone | Genre | Theme | gate |
|---|---|---|---:|---:|---|---|---|
| `work-ebe399258f28460b8f9b` | 鈴木先生 | `strategy=2`, `romance=1`, Genre `sliceOfLife` | `U/2/2/2/2/U` = **4/6** | `3/3/1/U/4/1/U` = **5/7** | `sliceOfLife` | `school=2; workplace=2` | **PASS** |
| `work-205e576ef057e3aed1ab` | 坂道のアポロン | `problemSolving=0`, `strategy=0` | `U/0/0/2/U/2` = **4/6** | `4/2/U/U/2/3/2` = **5/7** | `historical; romance` | `school=2` | **PASS** |
| `work-f5f0ee0b0ff16bc146e0` | ばらかもん | `strategy=0`, `darkness=0`, Theme `foundFamily=2` | `2/U/0/2/U/2` = **4/6** | `4/2/4/0/U/U/4` = **5/7** | `comedy; sliceOfLife` | `foundFamily=2` | **PASS** |
| `work-a7a1e0666169f1b2e8c0` | 海街diary | `problemSolving=2`, `strategy=0`, `worldBuilding=1`, Genre `sliceOfLife`, Theme `foundFamily=2` | `U/2/0/1/U/1` = **4/6** | `4/3/U/1/2/U/3` = **5/7** | `sliceOfLife` | `foundFamily=2` | **PASS** |

Narrative order is `progression / problemSolving / strategy / pacing / mysteryReveal / worldBuilding`. Tone order is `characterArcWeight / relationshipStructure / comedy / darkness / mentalStress / romance / emotionalWarmth`. `U` is explicit `unknown`, not a midpoint.

- Coverage/schema pass: **4/4**
- Still `RESEARCH_REQUIRED` for this gate: **0/4**
- Hard blocker candidates: **0**
- Remaining required official routes from the prior review: **0**
- Art decisions: **none**; no Art value was inferred from these pages.

## Method and temporary material

I re-read the Factor Dictionary, promotion method, Pass A chunk 03, `reviews/text-pass-bc-chunks-03-04.md`, the matching coverage-gap records, and the supplemental user-review records. The previously reviewed Pass B/C values are the baseline below; only the named coverage gaps were reconsidered.

Official readers were inspected in a real browser. Temporary screenshots are under ignored `output/playwright/pilot-text/gap-c/`. They are inspection aids only and must not be committed. No image is proposed as textual Evidence, and no screenshot was used to judge Art. The retained provenance is the official URL, edition/range, reader positions, source date or edition release date, retrieval date, and the direct observation.

## 1. 鈴木先生 — work-ebe399258f28460b8f9b

### Baseline from the current-SHA Pass B/C review

- Narrative: `U/2/U/2/2/U` = 3/6
- Tone: `3/3/1/U/4/U/U` = 4/7
- Genre: empty
- Themes: `school=2; workplace=2`
- Prior rejection preserved: professional sincerity alone does not prove `emotionalWarmth`.

### Official route ledger

1. Futabasha Book API, 鈴木先生 1
   - URL: `https://book-api.futabasha.co.jp/book_details?media=1&jdcn_code=97845759402370000000&image_size=330%2055%201000&grouping_media=0`
   - Source: 双葉社 official book API
   - Published: 2006-08-11
   - Retrieved: 2026-08-23
   - Edition/range: ISBN `9784575940237`, volume 1; API binds the official trial reader to this edition.
   - Direct observation: the publisher describes a teacher confronting both minor problems and major trials. `age_verification=0` is metadata only and was not used as a Factor.
2. Futabasha official volume-1 reader
   - URL: `https://reader.futabasha.co.jp/97845759402370000000`
   - Source: 双葉社 official internal preview
   - Published: reader page undated; bound edition published 2006-08-11
   - Retrieved: 2026-08-23
   - Edition/range: ISBN `9784575940237`; reader total 25 slots; inspected the complete available narrative sample through reader position 24 (printed pages through 26).
   - Direct observation: the sample opens with Suzuki and his girlfriend sharing a meal and discussing how rarely they meet. The lunch-refusal problem then moves to school. Suzuki gives himself a two-to-three-day deadline, consults a senior teacher, repeatedly watches the class at lunch, makes a seat map and written comparisons at home, and receives a follow-up message from his girlfriend before returning to the pupils.
3. Futabasha Book API, 鈴木先生 2
   - URL: `https://book-api.futabasha.co.jp/book_details?media=1&jdcn_code=97845759406880000000&image_size=330%2055%201000&grouping_media=0`
   - Source: 双葉社 official book API
   - Published: 2007-02-28
   - Retrieved: 2026-08-23
   - Edition/range: ISBN `9784575940688`, volume 2.
   - Direct observation: the description repeats the broad minor/major-problem structure. It exposes no volume-2 trial; `trial_url=null` and only the volume-1 trial is linked.
4. Futabasha Book API, 鈴木先生 3
   - URL: `https://book-api.futabasha.co.jp/book_details?media=1&jdcn_code=97845759410670000000&image_size=330%2055%201000&grouping_media=0`
   - Source: 双葉社 official book API
   - Published: 2007-07-03
   - Retrieved: 2026-08-23
   - Edition/range: ISBN `9784575941067`, volume 3.
   - Direct observation: this also repeats the broad series description and exposes no volume-3 trial. It is non-informative for additional scoped axes.

### Decisions

- `strategy=2` — **ACCEPT**, proposed confidence 0.86. This is no longer inferred from “long thought.” The official preview shows a bounded plan with a declared deadline, consultation, repeated observation, home analysis, and a planned return to the class. That directly matches the Dictionary's short-term-plan anchor and is distinct from the already-known `problemSolving=2` method.
- `romance=1` — **ACCEPT**, proposed confidence 0.72. The girlfriend is an actual recurring romantic partner in the first major episode: the shared meal establishes their relationship and limited time together, her observation informs his thinking, and her later message checks his progress. It is secondary to the school problem, so 1 rather than the subplot anchor 2.
- Genre `sliceOfLife` — **ACCEPT**, proposed confidence 0.84. The edition description and complete trial organize the entry around an everyday meal, an ordinary school-lunch dispute, staff consultation, and classroom routine. This conclusion comes from the episode structure, not from copying `school` or `workplace` Themes.
- `emotionalWarmth` remains **unknown**. The partner interaction is supportive, but the preview does not establish repeated bond/healing payoff. Romance presence is not warmth.
- `progression`, `worldBuilding`, and `darkness` remain **unknown**. Volumes 2–3 supply no scoped internal preview, and their generic descriptions cannot close those axes.

### Gate result

- Narrative `U/2/2/2/2/U` = **4/6**
- Tone `3/3/1/U/4/1/U` = **5/7**
- Genre and Theme nonempty
- Result: **PASS**

The named official route is exhausted: volume 1 has been read to the end of its available trial, and the official volume-2/3 records expose no separate trials. The remaining unknowns are valid final unknowns, not a pending route or blocker.

## 2. 坂道のアポロン — work-205e576ef057e3aed1ab

### Baseline from the current-SHA Pass B/C review

- Narrative: `U/U/U/2/U/2` = 2/6
- Tone: `4/2/U/U/2/3/2` = 5/7
- Genres: `historical; romance`
- Theme: `school=2`
- Prior rejection preserved: relationship change does not by itself prove `progression`, and synopsis omission does not prove `mysteryReveal=0`.

### Official route ledger

1. Shogakukan e-comi, 坂道のアポロン 1
   - URL: `https://e-comi.shogakukan.co.jp/books/091316700000d0000000`
   - Reader: `https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091316700000d0000000`
   - Companion same-JDCN metadata: `https://shogakukan-comic.jp/book?isbn=9784091316707`
   - Source: 小学館 official book page and internal preview
   - Published: same-JDCN digital edition 2013-01-01; e-comi page itself undated
   - Retrieved: 2026-08-23
   - Edition/range: JDCN `091316700000d0000000`, volume 1; inspected available reader positions 6–37.
   - Direct observation: Kaoru's school distress and rooftop obstacle lead to a confrontation with bullies. Sentaro resolves the immediate physical obstacle by fighting and then gives Kaoru access to the rooftop; Kaoru responds to the relationship gesture.
2. Shogakukan e-comi, 坂道のアポロン 2
   - URL: `https://e-comi.shogakukan.co.jp/books/091321740000d0000000`
   - Reader: `https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091321740000d0000000`
   - Companion same-JDCN metadata: `https://shogakukan-comic.jp/book?isbn=9784091321740`
   - Source: 小学館 official book page and internal preview
   - Published: same-JDCN digital edition 2013-01-01; e-comi page itself undated
   - Retrieved: 2026-08-23
   - Edition/range: JDCN `091321740000d0000000`, volume 2; inspected available reader positions 5–10.
   - Direct observation: the group rehearses jazz; classmates invite Kaoru to a welcome gathering, and he immediately chooses rehearsal with Sentaro. The publisher describes successive events changing the trio's friendship and unrequited feelings.
3. Shogakukan e-comi, 坂道のアポロン 3
   - URL: `https://e-comi.shogakukan.co.jp/books/091322680000d0000000`
   - Reader: `https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091322680000d0000000`
   - Companion same-JDCN metadata: `https://shogakukan-comic.jp/book?isbn=9784091322686`
   - Source: 小学館 official book page and internal preview
   - Published: same-JDCN digital edition 2013-01-01; e-comi page itself undated
   - Retrieved: 2026-08-23
   - Edition/range: JDCN `091322680000d0000000`, volume 3; inspected available reader positions 5–10.
   - Direct observation: Kaoru plays piano at a family Christmas gathering while relatives question his schooling and isolation. The publisher describes friendship deepening through jazz while romantic interests cross.

### Decisions

- `problemSolving=0` — **ACCEPT**, proposed confidence 0.79. The directly observed entry obstacle is resolved through force and an emotional relationship gesture, exactly the low anchor's “force/emotional decision” side. The volume-2/3 samples continue direct social and musical choices. This is not a zero inferred from the romance or historical Genres.
- `strategy=0` — **ACCEPT**, proposed confidence 0.77. Across the inspected entry samples, actions are immediate and reactive: fleeing or confronting bullies, accepting a key, refusing a party, rehearsing, and responding to family questions. No tactical or long-horizon planning mechanism appears in the defined sampled range.
- `progression` remains **unknown**. Performing music does not itself establish repeated acquisition or mastery rewards.
- `mysteryReveal` remains **unknown**. It is intentionally not converted to zero from the summaries' silence.

### Gate result

- Narrative `U/0/0/2/U/2` = **4/6**
- Tone `4/2/U/U/2/3/2` = **5/7**
- Genre and Theme nonempty
- Result: **PASS**

All three named edition-matched preview routes were inspected. No required route remains and there is no blocker.

## 3. ばらかもん — work-f5f0ee0b0ff16bc146e0

### Baseline from the current-SHA Pass B/C review

- Narrative: `2/U/U/2/U/2` = 3/6
- Tone: `4/2/4/U/U/U/4` = 4/7
- Genres: `comedy; sliceOfLife`
- Theme: empty
- Prior rejection preserved: warm-comedy marketing alone was insufficient to set absence values; the official first episode had to be inspected for counterexamples.

### Official route ledger

1. Square Enix, ばらかもん volume 1
   - URL: `https://magazine.jp.square-enix.com/top/comics/detail/9784757526167/`
   - Source: SQUARE ENIX official volume page
   - Published: 2009-07-22
   - Retrieved: 2026-08-23
   - Edition/range: ISBN `9784757526167`, volume 1.
   - Direct observation: the described entry obstacles are an island tractor ride, children using Handa's house, and neighbors entering unconventionally; the publisher frames these concrete obstacles as gentle island comedy.
2. Square Enix, ばらかもん volume 2
   - URL: `https://magazine.jp.square-enix.com/top/comics/detail/9784757527966/`
   - Source: SQUARE ENIX official volume page
   - Published: 2010-02-22
   - Retrieved: 2026-08-23
   - Edition/range: ISBN `9784757527966`, volume 2.
   - Direct observation: the narrow village society and highly sociable children are troublesome but make Handa slightly more open; the publisher again identifies the volume as heart-warming island comedy.
3. Square Enix, ばらかもん volume 3
   - URL: `https://magazine.jp.square-enix.com/top/comics/detail/9784757530270/`
   - Source: SQUARE ENIX official volume page
   - Published: 2010-10-22
   - Retrieved: 2026-08-23
   - Edition/range: ISBN `9784757530270`, volume 3.
   - Direct observation: a second-place calligraphy setback brings a rival and friend to the island, but the highlighted contest becomes comic sea fishing rather than serious peril or tragedy.
4. Gangan official work and character page
   - URL: `https://magazine.jp.square-enix.com/gangan/introduction/barakamon/`
   - Source: 月刊少年ガンガン official work page
   - Published: page undated
   - Retrieved: 2026-08-23
   - Edition/range: series introduction and recurring early cast structure.
   - Direct observation: the publisher describes Handa's punishment, island adaptation, and gradual growth as a heartful daily-life comedy. Its cast descriptions make Naru Handa's caretaker-like child, Hiroshi his meal provider, the village chief's wife another caregiver, and Kawafuji his only friend/manager-like support.
5. Gangan Online official first major episode
   - URLs: `https://www.ganganonline.com/title/868/chapter/33142` (ACT.1-1), `https://www.ganganonline.com/title/868/chapter/33139` (ACT.1-2), `https://www.ganganonline.com/title/868/chapter/33136` (ACT.1-3)
   - Source: ガンガンONLINE official internal reader
   - Published: chapter pages undated; volume-1 edition published 2009-07-22
   - Retrieved: 2026-08-23
   - Edition/range: complete available ACT.1 split into three routes. The reader lists 17, 18, and 27 slots respectively, including trailing release-information slots.
   - Direct observation: Handa impulsively punches the senior calligrapher, is sent to the island, reacts to local transport and his shared house, clashes with Naru, cleans and attempts calligraphy, apologizes after reflecting, accepts Naru's forgiveness and immediate help at the shore, and ends by making a freer new work. The water and wall scenes are played as supervised comic challenges, not sustained danger.

### Decisions

- `strategy=0` — **ACCEPT**, proposed confidence 0.86. The complete first episode positively shows impulsive and immediate response: the punch, anger at Naru, apology, following Naru's instructions, and an unplanned burst of calligraphy. Volumes 1–3 continue local episodes and direct setbacks rather than a tactical or long-horizon plan. This is an observed mechanism, not an absence inferred from `comedy`.
- `darkness=0` — **ACCEPT**, proposed confidence 0.90. The complete first episode supplies the counterexample check that the earlier packet lacked. Its potentially rough events are bounded comic beats with immediate safety and relationship payoff. The official descriptions of all three entry volumes enumerate low-stakes social, work, and fishing conflicts; none makes serious danger or tragedy part of the entry reward. This decision uses the direct episode plus concrete publisher descriptions, not the marketing adjective alone.
- Theme `foundFamily=2` — **ACCEPT**, proposed confidence 0.91. ACT.1 already makes a non-kin child enter Handa's home, help him, forgive him, and assist his first adjustment. The official recurring-cast page then assigns multiple villagers ongoing caretaker, meal, friendship, and household-support roles. Non-kin communal care is therefore a repeated core structure rather than a one-scene background element.
- `problemSolving`, `mysteryReveal`, `mentalStress`, and `romance` remain **unknown**. No substitute value is needed for the gate.

### Gate result

- Narrative `2/U/0/2/U/2` = **4/6**
- Tone `4/2/4/0/U/U/4` = **5/7**
- Genre and Theme nonempty
- Result: **PASS**

The named first-chapter route was exhausted through all three ACT.1 parts, and all three official entry-volume descriptions were checked. No required route remains and there is no blocker.

## 4. 海街diary — work-a7a1e0666169f1b2e8c0

### Baseline from the current-SHA Pass B/C review

- Narrative: `U/U/U/1/U/U` = 1/6
- Tone: `4/3/U/1/2/U/3` = 5/7
- Genre: empty
- Theme: empty
- Prior rejection preserved: family adaptation is not a separate mastery progression, and synopsis omission does not prove `mysteryReveal=0`.

### Official route ledger

1. Shogakukan, 海街diary 1
   - URL: `https://shogakukan-comic.jp/book?isbn=9784091670250`
   - Reader: `https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091670250000d0000000`
   - Source: 小学館 official volume page and internal preview
   - Published: 2007-04-26
   - Retrieved: 2026-08-23
   - Edition/range: ISBN `9784091670250`, JDCN `091670250000d0000000`, volume 1; reader total 51 positions, with the available narrative inspected through printed page 49 before the end modal.
   - Direct observation: the sisters travel to their estranged father's funeral, meet Suzu, eat and bathe together, discuss the father's debts and inheritance renunciation, learn who the legal heirs are, and confront adults about placing care and blame on a child. The episode repeatedly combines practical family constraints with direct moral choices and daily family interaction.
2. Shogakukan, 海街diary 2
   - URL: `https://shogakukan-comic.jp/book?isbn=9784091670373`
   - Source: 小学館 official volume page
   - Published: 2008-10-10
   - Retrieved: 2026-08-23
   - Edition/range: ISBN `9784091670373`, volume 2.
   - Direct observation: Suzu is now acclimating to a new life with her older sisters, while their individual concerns and relationships intersect in Kamakura.
3. Shogakukan, 海街diary 3
   - URL: `https://shogakukan-comic.jp/book?isbn=9784091670403`
   - Source: 小学館 official volume page
   - Published: 2010-02-10
   - Retrieved: 2026-08-23
   - Edition/range: ISBN `9784091670403`, volume 3.
   - Direct observation: a year after the first encounter, all four sisters return for the father's memorial; ordinary time, seasons, joy, and grief continue slowly inside the family.

### Decisions

- `problemSolving=2` — **ACCEPT**, proposed confidence 0.83. The first episode does more than present sadness: an inheritance specialist explains debt, renunciation, and the set of heirs; the sisters weigh who should bear the consequences; the eldest then acts directly in the family confrontation. This is a clear mix of constraint analysis and direct action, matching anchor 2 rather than 0 or 4.
- `strategy=0` — **ACCEPT**, proposed confidence 0.76. The episode's funeral, care, and household conflicts are answered in immediate conversations and moral/family decisions. It does not organize the resolution around a tactical or long-horizon plan. This decision is scoped to the complete available first-episode preview, not inferred from the Genre.
- `worldBuilding=1` — **ACCEPT**, proposed confidence 0.72. The modern-life background is mostly minimal, but inheritance law, funeral procedure, travel, and household arrangements briefly constrain the conflict. That is above pure backdrop yet below the repeated functional-setting anchor 2; 1 is the justified between-anchor value.
- Genre `sliceOfLife` — **ACCEPT**, proposed confidence 0.91. The first episode directly alternates sibling banter, travel, meals, bathing, funeral duties, grief, and family decisions. Volumes 2–3 continue ordinary household adaptation and seasonal time. This is based on repeated episode structure, not on the family Theme.
- Theme `foundFamily=2` — **ACCEPT**, proposed confidence 0.92. The volume-1 preview establishes the half-sisters' encounter and the eldest sister's active defense of Suzu; the official volume-2 description confirms Suzu's new life with the three older sisters, and volume 3 returns the four sisters as the continuing unit. The reconstituted household is the repeated central structure.
- `progression` and `mysteryReveal` remain **unknown**. `comedy` and `romance` also remain **unknown**. No absence value was manufactured from the descriptions.

### Gate result

- Narrative `U/2/0/1/U/1` = **4/6**
- Tone `4/3/U/1/2/U/3` = **5/7**
- Genre and Theme nonempty
- Result: **PASS**

The edition-matched volume-1 preview and official volume-1/2/3 routes are exhausted for this gate. The remaining unknowns are valid terminal unknowns, not a pending route or blocker.

## Final route and blocker ledger

| title | specified official routes attempted | remaining required route | blocker |
|---|---|---|---|
| 鈴木先生 | Futabasha volume-1 full available trial; volume-2/3 API records and trial availability | none | none |
| 坂道のアポロン | Shogakukan volume-1/2/3 same-JDCN product pages and internal previews | none | none |
| ばらかもん | Square Enix volume-1/2/3 pages; official work/cast page; complete ACT.1-1/2/3 | none | none |
| 海街diary | Shogakukan volume-1 full available preview; official volume-1/2/3 pages | none | none |

No `SOURCE_INFORMATION_UNAVAILABLE`, identity, safety, or product-contract blocker was found in this narrow task. The result does not authorize changing Gold data, the Factor Dictionary, recommendation math, unknown/coverage rules, or validators.

