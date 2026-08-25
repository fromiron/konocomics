# Batch 004 flagged-cell independent review

## Review identity

- `batchId`: `batch-004`
- `pass`: independent flagged-cell review after Daybreak Pass A QA
- `reviewer`: Luna subagent, independent cell-level review
- `reviewedByHuman`: `false`
- `reviewScope`: the 10 Daybreak-flagged works only; exact flagged Genre, Theme, and non-Art Factor cells
- `sourcePolicy`: official-first evidence in the assigned frozen research packets; no Gold rows, recommendation context, or outside work annotations inspected
- `artPolicy`: every work is `ART_ABSTAIN`; no pixel access was used and no Art value or Art eligibility conclusion was made
- `retrievedAt`: `2026-08-25`
- `promotionDecision`: none; this review does not approve promotion or eligibility

## Disposition summary

| workId | title | flagged cells | independent disposition |
| --- | --- | --- | --- |
| `work-132ce7172750a3b1fa53` | ヒナまつり | `problemSolving` | `CHANGE(unknown)` |
| `work-3ad85a2ffdc026007d61` | 新しい上司はど天然 | `characterArcWeight`, `relationshipStructure`, `comedy`, `emotionalWarmth` | `CHANGE(known:2)`, `CHANGE(known:1)`, `CHANGE(known:2)`, `CHANGE(known:2)` |
| `work-44d0000353478596369e` | 環と周 | `worldBuilding`, `mentalStress` | `CHANGE(known:2)`, `CHANGE(known:2)` |
| `work-741deb03d9f59e723929` | ルックバック | missing `themes.crafting` | `ADD(crafting, centrality:2)` |
| `work-80a2f62ce5073ade2ec2` | 式の前日 | `characterArcWeight`, `emotionalWarmth` | `KEEP(unknown)`, `CHANGE(known:2)` |
| `work-8733067e6afcaeadbd8d` | さんすくみ | `romance` | `CHANGE(known:1)` |
| `work-d63a83030a8819ff553c` | モテキ | `romance` Genre, `pacing`, `romance` | `REMOVE(romance)`, `CHANGE(unknown)`, `CHANGE(unknown)` |
| `work-eef84d07d90ba2b040cf` | さよなら絵梨 | missing Genre | `ADD(mystery)` |
| `work-f8cb26831612e0c6ece5` | 極楽街 | `problemSolving` | `CHANGE(unknown)` |
| `work-fd2a957c501c36047ed0` | 青の祓魔師 | `mentalStress` | `CHANGE(unknown)` |

`known` values below are bounded to the packet's stated entry range. They do not claim that the same value holds for the complete series beyond that range.

## Cell-level findings

### 1. ヒナまつり — `work-132ce7172750a3b1fa53`

- `factors.problemSolving`: `CHANGE(unknown)`; confidence `0.89`.
- Dictionary anchor: `problemSolving=2` requires a mixed process of ingenuity and direct action; `4` requires constraint analysis and ingenious solutions as a core process.
- Packet evidence: [KADOKAWA volume 2](https://www.kadokawa.co.jp/product/301306000980/) (2011-11-15; retrieved 2026-08-25) says that 新田 devises a response around the psychic confrontation, alongside a biker-gang fight and shop theft. Volumes 1 and 3 provide cohabitation, threats, and continuing struggle, but no additional problem-solving process.
- Independent judgment: one response plan is an isolated event in the three-volume packet. The official text does not establish recurring constraint analysis or a repeated analysis/action pattern. The action and psychic confrontation support the existing `combat` Theme, but they do not make this Factor known.

### 2. 新しい上司はど天然 — `work-3ad85a2ffdc026007d61`

- `factors.characterArcWeight`: `CHANGE(known:2)`; confidence `0.67`.
- Dictionary anchor: `characterArcWeight=2` is a balance of events and character change; `4` makes motivation, change, or relationships the main reward.
- Packet evidence: [秋田書店 official release](https://prtimes.jp/main/html/rd/p/000000029.000040601.html) (2019-08-20; retrieved 2026-08-25) explicitly moves Momose from a power-harassing workplace to a new job where Shirasaki's behavior eases his worry.
- Independent judgment: the bounded volume-1 premise directly contains a before/after emotional state and makes the pair's interaction the stated mechanism. It supports a moderate value, not `4`; the single confirmed volume does not support a stronger series-wide arc claim.

- `factors.relationshipStructure`: `CHANGE(known:1)`; confidence `0.70`.
- Dictionary anchor: `relationshipStructure=0` is a primarily solitary protagonist; `2` is a repeating fixed party/core supporting cast; `4` is a complex ensemble/network.
- Packet evidence: [秋田書店 official release](https://prtimes.jp/main/html/rd/p/000000029.000040601.html) (2019-08-20; retrieved 2026-08-25) identifies Momose's relationship with new boss Shirasaki as the central setup. [秋田書店 volume 1 page](https://www.akitashoten.co.jp/comics/4253142311) confirms the same representative volume and identity.
- Independent judgment: the source establishes a recurring central pair within the bounded premise, but no fixed party or complex network. `1` is the justified between-anchor value; `2` would overstate the supplied evidence.

- `factors.comedy`: `CHANGE(known:2)`; confidence `0.72`.
- Dictionary anchor: `comedy=2` is intermittent or mixed humor; `4` is constant or core comedy.
- Packet evidence: [秋田書店 official release](https://prtimes.jp/main/html/rd/p/000000029.000040601.html) (2019-08-20; retrieved 2026-08-25) directly calls the premise a workplace comedy and ties the boss's overly natural behavior to the employee's worries being eased.
- Independent judgment: this is direct tone/content evidence for a moderate comedy value. It does not establish all-scenes or constant gag frequency, so `4` is not supported. The value is not inferred from the `comedy` Genre row; it is tied to the source's concrete workplace-comedy premise.

- `factors.emotionalWarmth`: `CHANGE(known:2)`; confidence `0.66`.
- Dictionary anchor: `emotionalWarmth=2` is mixed warmth; `4` is bonding, healing, or warmth as the core reward.
- Packet evidence: [秋田書店 official release](https://prtimes.jp/main/html/rd/p/000000029.000040601.html) (2019-08-20; retrieved 2026-08-25) explicitly describes Shirasaki's behavior easing Momose's worry after workplace harm.
- Independent judgment: worry relief and a supportive central relationship directly support moderate warmth in the bounded entry premise. The single synopsis does not establish uniformly healing tone or `4`.

### 3. 環と周 — `work-44d0000353478596369e`

- `factors.worldBuilding`: `CHANGE(known:2)`; confidence `0.69`.
- Dictionary anchor: `worldBuilding=2` is a functional setting; `4` requires history, culture, rules, or factions to be repeatedly important.
- Packet evidence: [集英社 volume page](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-844839-8) (2023-10-23; retrieved 2026-08-25) lists five stories in modern, Meiji, 1970s, postwar, and Edo settings. [集英社オンライン author interview](https://shueisha.online/articles/-/167862) (2023-10-23; retrieved 2026-08-25) describes the cross-period omnibus structure and the connected meetings.
- Independent judgment: the five settings are directly established and functional to the anthology, but the packet does not document recurring period rules, institutions, or cultural systems at level `3`. `2` is supported; `3` is not.

- `factors.mentalStress`: `CHANGE(known:2)`; confidence `0.58`.
- Dictionary anchor: `mentalStress=2` is mixed tension/frustration; `4` requires sustained anxiety, psychological breakdown, or continuing pressure.
- Packet evidence: [集英社 volume page](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-844839-8) (2023-10-23; retrieved 2026-08-25) directly lists illness-limited time, postwar survival, murder/revenge, separation, and forced marriage/family conflict across the complete one-volume anthology. [集英社オンライン author interview page 3](https://shueisha.online/articles/-/167862?disp=paging&page=3) (2023-10-23; retrieved 2026-08-25) details the limited-time illness episode.
- Independent judgment: the complete-book packet supports the presence of several pressure-bearing situations and therefore a moderate mixed value. It does not establish a sustained single-character pressure experience or psychological breakdown, so `3` is not supported and `4` is clearly not supported. This remains lower-confidence than the world-setting change because the source is an anthology synopsis rather than inspected entries.

### 4. ルックバック — `work-741deb03d9f59e723929`

- `themes.crafting`: `ADD(crafting, centrality:2)`; confidence `0.84`.
- Dictionary anchor: Theme centrality `2` means a repeated core structure rather than a one-off presence; `crafting` applies when making a work/product is a central recurring mechanic.
- Packet evidence: [集英社 ルックバック official one-shot page](https://www.shueisha.co.jp/books/items/contents_amp.html?jdcn=08X10000000016342800) (2021-09-03; retrieved 2026-08-25) directly states that Fujino and Kyomoto connect through drawing manga and that the support relationship unfolds as time passes.
- Independent judgment: manga creation is not merely background; it is the stated mechanism that creates and sustains the central relationship across the complete one-shot. This supports `crafting` centrality `2`, consistent with the packet's use of `crafting` for film production in さよなら絵梨. No other Theme is added. This is a Theme addition only, not an Art or Genre conclusion.

### 5. 式の前日 — `work-80a2f62ce5073ade2ec2`

- `factors.characterArcWeight`: `KEEP(unknown)`; confidence `0.86`.
- Dictionary anchor: `characterArcWeight` requires observable character motivation/change, with `2` balancing events and change and `4` making change/relationship the main reward.
- Packet evidence: [小学館 collection page](https://shogakukan-comic.jp/book?jdcn=091345850000d0000000) (2013-01-01 electronic listing; retrieved 2026-08-25) describes twins, parent/child pairs, and couples before marriage as two-person moments, but does not describe character change or motivation arcs.
- Independent judgment: repeated two-person subjects establish relationship focus, not character-arc movement. The source is insufficient for a known value; retain `unknown` rather than translating relationship presence into arc weight.

- `factors.emotionalWarmth`: `CHANGE(known:2)`; confidence `0.64`.
- Dictionary anchor: `emotionalWarmth=2` is mixed warmth; `4` is warmth/healing as the core reward.
- Packet evidence: [小学館 collection page](https://shogakukan-comic.jp/book?jdcn=091345850000d0000000) (2013-01-01 electronic listing; retrieved 2026-08-25) repeatedly frames the collection as family/marriage two-person moments presented warmly and distinctly.
- Independent judgment: unlike a bare user adjective, this is the rightsholder's whole-collection description and names repeated family/marriage relationship contexts. It supports a bounded moderate warmth value. It does not establish that every story is healing or that warmth is uniformly the sole reward, so `4` is not supported.

### 6. さんすくみ — `work-8733067e6afcaeadbd8d`

- `factors.romance`: `CHANGE(known:1)`; confidence `0.68`.
- Dictionary anchor: `romance=0` is nearly absent; `2` is a recurring subplot; `4` is a central relationship and plot driver. `1` is appropriate when direct presence is established but recurrence at the `2` anchor is not.
- Packet evidence: [小学館 volume 2](https://shogakukan-comic.jp/book?jdcn=091338140000d0000000) (2013-01-01 electronic listing; retrieved 2026-08-25) explicitly says romance is scarce. [小学館 volume 3](https://shogakukan-comic.jp/book?jdcn=091341120000d0000000) (2013-01-01 electronic listing; retrieved 2026-08-25) mentions the church heir meeting a young woman during training.
- Independent judgment: the packet directly establishes non-zero but scarce romance. A single bounded meeting does not support a recurring subplot at `2`; `1` records the supported low presence without treating it as unknown or zero.

### 7. モテキ — `work-d63a83030a8819ff553c`

- `genres=romance`: `REMOVE(romance)`; confidence `0.95`.
- Dictionary anchor: Genre is a content classification and cannot be established by selection provenance or suggestive chapter titles alone.
- Packet evidence: [講談社 volume 1](https://www.kodansha.co.jp/comic/products/0000038652), [volume 2](https://www.kodansha.co.jp/comic/products/0000038671), and [volume 3](https://www.kodansha.co.jp/comic/products/0000038689) (2009-03-23, 2009-08-21, 2010-01-22; retrieved 2026-08-25) provide tables of contents only. The packet explicitly limits titles such as rejection, liking, and popularity to surface clues, not plot evidence.
- Independent judgment: the supplied official packet does not directly establish a romance Genre under the isolation policy. Remove the row pending bounded synopsis, inspected entry content, or eligible corroborating reviews. Manga Taisho and bookseller list membership are selection provenance only.

- `factors.pacing`: `CHANGE(unknown)`; confidence `0.96`.
- Dictionary anchor: `pacing=2` requires ordinary arc-level goal/state change; `4` requires frequent short-interval changes in goal, place, or state.
- Packet evidence: the three Kodansha pages above show short chapter units through their contents listings, but no plot events or state transitions.
- Independent judgment: chapter count or short title units do not prove pacing. Close as `unknown`.

- `factors.romance`: `CHANGE(unknown)`; confidence `0.96`.
- Dictionary anchor: `romance=2` requires a subplot, and `4` requires romance to drive the main relationships and plot.
- Packet evidence: the three Kodansha contents listings contain romance-facing titles, but the packet itself says those titles are not direct scene or relationship summaries.
- Independent judgment: no numeric romance value can be responsibly assigned from these sources. Close as `unknown` rather than converting title implications into a Factor.

### 8. さよなら絵梨 — `work-eef84d07d90ba2b040cf`

- `genres`: `ADD(mystery)`; confidence `0.78`.
- Dictionary anchor: `mystery` Genre requires a work whose content is organized around an unresolved secret, investigation, or truth boundary; Genre is judged from direct content, not mechanically copied from `mysteryReveal`.
- Packet evidence: [集英社 official complete one-shot page](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-883167-1) (2022-07-04; retrieved 2026-08-25) directly states that Eri has a secret and that reality and creation intersect while Yuta and Eri make a film. The same source describes the preceding filming, suicide attempt, mourning, and subsequent film-making sequence.
- Independent judgment: the hidden secret and reality/creation boundary are direct structural content, not a Genre inference from the numeric Factor. They support `mystery` as a secondary Genre for this complete one-shot. No other Genre is added from the packet.

### 9. 極楽街 — `work-f8cb26831612e0c6ece5`

- `factors.problemSolving`: `CHANGE(unknown)`; confidence `0.92`.
- Dictionary anchor: `problemSolving=2` requires a described mixture of ingenuity and direct action; occupation labels and investigations alone are insufficient. `4` requires constraint analysis and ingenious solutions as a core process.
- Packet evidence: [集英社 volume 1](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000024865900), [volume 2](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883462-7), and [volume 3](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-883725-3) (2022-11-04, 2023-04-04, 2023-12-04; retrieved 2026-08-25) establish problem-solvers, missing-person/death investigations, pursuit, rescue, combat, and escalating threats.
- Independent judgment: the packet supports the existing `investigation` Theme and `mysteryReveal`/action observations, but it never describes how a constraint is analyzed or an ingenious solution is produced. Remove the unsupported known value and close the Factor as `unknown`.

### 10. 青の祓魔師 — `work-fd2a957c501c36047ed0`

- `factors.mentalStress`: `CHANGE(unknown)`; confidence `0.91`.
- Dictionary anchor: `mentalStress=2` requires mixed tension/frustration; `4` requires sustained anxiety, psychological breakdown, or continuing pressure. Darkness and danger are separate axes.
- Packet evidence: [集英社 volume 1](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874709-5), [volume 2](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874757-6), and [volume 3](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-870016-8) (2009-08-04, 2009-11-04, 2010-03-04; retrieved 2026-08-25) establish the adoptive father's death, demon attacks, academy training danger, weapon theft, and uncontrolled flames.
- Independent judgment: these are direct danger/darkness observations, not evidence of the protagonist's sustained anxiety, frustration, or psychological pressure. Keep the known `darkness` result separate and close only `mentalStress` as `unknown`.

## Art abstention ledger

All 40 Art cells for these 10 works remain `ART_ABSTAIN` in this review. The assigned packet records no qualifying representative-edition sample for any of them: `readableInternalPages=0`, `distinctSceneContexts=0`, and no image SHA-256. Covers, synopsis text, award commentary, and user/opinion text were not used as Art evidence. No Art value, `notApplicable`, or promotion conclusion is assigned.

| workId | attempted official entry source | Art disposition |
| --- | --- | --- |
| `work-132ce7172750a3b1fa53` | [KADOKAWA volume 1](https://www.kadokawa.co.jp/product/301306000979/) | `ART_ABSTAIN` |
| `work-3ad85a2ffdc026007d61` | [秋田書店 volume 1](https://www.akitashoten.co.jp/comics/4253142311) | `ART_ABSTAIN` |
| `work-44d0000353478596369e` | [集英社 one-volume page](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-844839-8) | `ART_ABSTAIN` |
| `work-741deb03d9f59e723929` | [集英社 one-shot page](https://www.shueisha.co.jp/books/items/contents_amp.html?jdcn=08X10000000016342800) | `ART_ABSTAIN` |
| `work-80a2f62ce5073ade2ec2` | [小学館 collection page](https://shogakukan-comic.jp/book?jdcn=091345850000d0000000) | `ART_ABSTAIN` |
| `work-8733067e6afcaeadbd8d` | [小学館 volume 1](https://shogakukan-comic.jp/book?jdcn=091334600000d0000000) | `ART_ABSTAIN` |
| `work-d63a83030a8819ff553c` | [講談社 volume 1](https://www.kodansha.co.jp/comic/products/0000038652) | `ART_ABSTAIN` |
| `work-eef84d07d90ba2b040cf` | [集英社 complete one-shot](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-883167-1) | `ART_ABSTAIN` |
| `work-f8cb26831612e0c6ece5` | [集英社 volume 1](https://www.shueisha.co.jp/books/items/contents.html?jdcn=08X10000000024865900) | `ART_ABSTAIN` |
| `work-fd2a957c501c36047ed0` | [集英社 volume 1](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-874709-5) | `ART_ABSTAIN` |

## Closure

- This ledger is an independent review of the exact 10 flagged works and does not edit Pass A CSV or notes.
- It records no human validation, no promotion approval, no safety adjudication, and no recommendation eligibility decision.
- Any later adjudication must apply these cell dispositions together with the unchanged Factor Dictionary, coverage contract, and promotion gate.
