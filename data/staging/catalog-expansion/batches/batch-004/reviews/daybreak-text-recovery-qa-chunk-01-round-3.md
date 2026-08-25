# Batch 004 chunk 01 round-3 text recovery — independent adjudication

## Scope and bindings

- Reviewer: Daybreak independent adjudicator; `reviewedByHuman=false`.
- Repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`.
- Candidate SHA-256: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`.
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`.
- Recovery packet SHA-256: `d5e8683e839bc19ccbc37a654bab4400baf017311b6f134620ccc860ff92de42`.
- Terminal text CSV input SHA-256: `fbfd3b4d9039ae66bdcd7778c63dab317094ad2178a2c300f5f7bb0ee8775bfe`.
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`.
- Retrieval and independent source verification date: `2026-08-25`.
- Entry scope: volumes 1–3 only. Art, Genre, Theme, identity, safety, source data, promotion, blocker, overlay, and generated artifacts were excluded.

## Independent source and range verification

| Position | Reproducible observation | QA consequence |
|---:|---|---|
| 1 | Futabasha's official [volume-2 release](https://prtimes.jp/main/html/rd/p/000000700.000014531.html) fixes the repeated 05:00 breakfast and 15-minute routine. Its official [volume-3 release](https://prtimes.jp/main/html/rd/p/000000821.000014531.html) directly moves the entry through mutual encouragement, cooking help, and an ordinary routine becoming important. Distinct Cmoa review records separately describe the volume-2 self-introduction/contact exchange and successive one-episode situations. | This is direct ordinary episode/arc-level state change across the entry, not merely a genre or relationship label. `pacing=2` is supported; neither 0 nor 4 is inferred. |
| 5 | KADOKAWA's official [volume 2](https://www.kadokawa.co.jp/product/301306000980/) says Nitta devises one measure against Anzu's destructive pursuit. The Biyotoma account explains the same single peaceful contest; the Yuzu-no-Saka page mostly repeats the official synopsis and comments on that contest. | More citations to one countermeasure do not make the analytical/direct solving process recurrent. The earlier single-countermeasure gap remains; `problemSolving` stays `unknown`. |
| 7 | Kodansha's official [volume 1](https://www.kodansha.co.jp/comic/products/0000014069) establishes the procession, journey, and spy premise. On Cmoa's licensed [volume-2 page](https://www.cmoa.jp/title/45802/vol/2/), reviewer `mush` concretely describes timetables, route changes, advance lodging teams, crossings, and daily reports. The separate dated review attributed in the packet does not independently repeat those operational observations; it discusses the ensemble and difficult procession more generally. The Manba route was access-controlled in this QA. | The value is plausible, but the required independent recurring short-plan observation is not closed. Journey/setting is not converted into `strategy`; the cell stays `unknown`. |
| 9 | BookLive's editorial [entry review](https://booklive.jp/bkmr/soremachi-review) directly identifies multiple volume-1 everyday mysteries, deduction, and a chapter-3/chapter-11 clue connection. The independent [Manga no Tora review](https://manga-blog.net/soremachi/) separately identifies volume-1 chapter 4's picture mystery and its disclosure. Official volume records fix the work and entry identity. | Multiple concrete riddle/deduction/disclosure rewards support the Dictionary's “some secrets/reversals” anchor. `mysteryReveal=2` is supported; 4 and an `investigation` Theme are not inferred. |

All four work/title identities match frozen positions 1, 5, 7, and 9. No decorative `『』` was imported. User observations remain supplemental and paraphrased; no review sentence was copied into product explanation data.

## Cell adjudication

| Position | Proposed cell | Decision | Terminal cell | Exact rationale |
|---:|---|---|---|---|
| 1 | `pacing=2` | `ACCEPT` | `known,2,0.68` | Official volumes 2–3 and independent entry observations enumerate ordinary successive situation changes inside the stable routine. |
| 5 | `problemSolving=2` | `UNKNOWN` | unchanged `unknown` | All cited solving observations collapse to one volume-2 countermeasure; source repetition is not behavior recurrence. |
| 7 | `strategy=2` | `UNKNOWN` | unchanged `unknown` | One detailed reader establishes operational planning, but the claimed second independent observation does not; official journey context alone is insufficient. |
| 9 | `mysteryReveal=2` | `ACCEPT` | `known,2,0.84` | Retailer-editorial and independent entry records directly identify concrete volume-1 riddles, deduction, disclosure, and clue payoff. |

No adjacent value was substituted and no Genre, Theme, Tone, or Art cell was changed.

## Hash and reverse-substitution check

- Terminal CSV before this adjudication: `fbfd3b4d9039ae66bdcd7778c63dab317094ad2178a2c300f5f7bb0ee8775bfe`.
- Terminal CSV after the two-cell overlay: `1d36a1c9c5a99b0a935aaf49f1a4e327046308ad9507d17cc245214124e5f5fe`.
- In-memory reverse substitution of exactly the two accepted rows: `fbfd3b4d9039ae66bdcd7778c63dab317094ad2178a2c300f5f7bb0ee8775bfe`.
- Reverse result equals the recorded input hash: **PASS**.
- CSV cardinality remains `170` data rows: ten frozen works × seventeen axes.

## Gate recount

Thresholds remain Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, and Tone `>=5/7`. Genre, Theme, and Tone rows were not changed.

| Position | Before N / T | After N / T | Terminal text result |
|---:|---:|---:|---|
| 1 | `0/6 · 5/7` | `1/6 · 5/7` | `TEXT_GATE_FAIL — N+3` |
| 5 | `2/6 · 6/7` | `2/6 · 6/7` | `TEXT_GATE_FAIL — N+2` |
| 7 | `3/6 · 1/7` | `3/6 · 1/7` | `TEXT_GATE_FAIL — N+1, T+4` |
| 9 | `2/6 · 4/7` | `3/6 · 4/7` | `TEXT_GATE_FAIL — N+1, T+1` |

- Chunk 01 all-text-gate count remains `1/10` (position 3 only).
- Batch 004 all-text-gate count remains `4/50` (positions 3, 14, 17, and 20).
- This adjudication authorizes no hard blocker and no promotion. Exact unresolved evidence routes remain open for every failed gate.

## Diff boundary

- Changed: `adjudication/text-final-chunk-01.csv` (two cells) and this QA record.
- Unchanged: Art, Genre, Theme, source, identity, safety, blocker, promotion registry, overlay, and generated catalog.
- `git diff --check` plus no-index checks for both new files: **PASS**; whitespace errors `0`.
