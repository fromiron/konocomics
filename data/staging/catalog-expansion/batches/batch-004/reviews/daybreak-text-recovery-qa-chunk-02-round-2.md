# Batch 004 chunk 02 round-2 text recovery — independent adjudication

## Scope and bindings

- Reviewer: Daybreak independent adjudicator; `reviewedByHuman=false`.
- Repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`.
- Candidate SHA-256: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`.
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`.
- Round-2 recovery SHA-256: `939befb76f08d8150b7f5209b3be5c6a294681502c22fe8c0cfbb76551c2ab28`.
- Prior blocker adjudication SHA-256: `a55c39a961484317f689a85104a4f7e3f040155de6ed47e3b0f1c1cf99afbb6a`.
- Retrieval/reverification date: `2026-08-25`.
- Entry scope: volumes 1–3 or the first bounded official episode only.
- Mutation result: **zero newly accepted cells**. `adjudication/text-final-chunk-02.csv` is unchanged. No Genre, Theme, Art, identity, safety, blocker, overlay, source, registry, generated artifact, or promotion state changed.
- Positions 14, 17, and 20 were compared byte-for-byte through the unchanged terminal CSV and remain preserved.

## URL, identity, and date verification

All named official routes were independently requested with redirect following. Every route returned final HTTP `200` except Kodansha volume-2 trial for position 18, which reproduced a redirect loop and stopped at HTTP `302` after ten redirects.

| Position | Verified official route result | Date and entry-range finding |
|---:|---|---|
| 11 | Shogakukan/TAMESHIYO [Sunny 3](https://sc-portal.tameshiyo.me/9784091886132) and [product](https://www.shogakukan.co.jp/books/09188613) both resolve the exact title/creator/volume. | Product metadata exposes `publish_date=2013-01-30`. The six episode summaries are volume 3, within scope. |
| 12 | Shogakukan e-comi volume [2](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091886030000d0000000) and [3](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091886240000d0000000) each redirect once to an exact `speedreader` route and return `200`; product titles match. | The packet's electronic re-release date `2015-01-26` is retained as edition metadata. Official descriptions are explicitly volumes 2–3. |
| 13 | HERO'S Web first episode [part 1](https://heros-web.com/episodes/abc82cfdbc52d/1), [part 2](https://heros-web.com/episodes/abc82cfdbc52d/2), [series](https://heros-web.com/series/634a04c316435), and [adjacent shell](https://heros-web.com/episodes/04248090c630c) return `200` and match title/creator. | The live route exposes migrated `publishDate=1778640582` (`2026-05-13T11:49:42+09:00`), not `2026-05-18`. `2012-09-28` is not exposed by these current pages and is not used as a Factor claim. Static part 1/2 descriptions are identical series copy; panel text is absent. |
| 15 | Shueisha S-MANGA exact readers for volume [2](https://www.s-manga.net/reader/main.php?cid=08X10000000032350600) and [3](https://www.s-manga.net/reader/main.php?cid=9784088837970) return `200` and match `キルアオ`. | Reader metadata directly exposes `2023-11-02` and `2024-01-04`. Both are within entry scope. |
| 16 | Shogakukan/TAMESHIYO exact volume [2](https://sc-portal.tameshiyo.me/9784098533817) and [3](https://sc-portal.tameshiyo.me/9784098535750) portals return `200` and match title/volume. | Publisher-linked dates `2024-06-18` and `2024-09-18` are retained; descriptions are explicitly volumes 2–3. |
| 18 | Kodansha [volume-2 trial](https://www.kodansha.co.jp/comic/products/0000038651/trial) reproduces the redirect loop; the [series ledger](https://www.kodansha.co.jp/titles/1000004427) returns `200` and confirms identity. | Product date `2009-03-23` is retained. No reader body was available, so no new event claim is permitted. |
| 19 | Akita Shoten [volume 2](https://www.akitashoten.co.jp/comics/425314232X) returns `200`; its [publisher-linked trial](https://mangacross.jp/comics/dotennen/1) redirects twice to the exact [Champion Cross series](https://championcross.jp/series/068fd6dbdf163), which returns `200`. | Akita exposes `2020-05-20`. Current Champion Cross series metadata exposes `publishDate=1711946796` (`2024-04-01T13:46:36+09:00`); that migration timestamp is not treated as original publication. |

The date discrepancies for positions 13 and 19 are ledger corrections only. They do not create or remove a Factor observation.

## Direct candidate adjudication

`ACCEPTED_NO_OP` means the evidence corroborates a cell already present in the terminal CSV; it does not rewrite that row or increase confidence. `UNKNOWN` preserves the current unknown state. `REJECT` records a wrong Dictionary mapping.

| Position | Candidate | Decision | Exact rationale |
|---:|---|---|---|
| 11 | `progression=2` | `REJECT` | The publisher explicitly describes movement along adulthood and episode experiences, which is character development. The Dictionary progression axis requires repeated growth/acquisition/mastery reward; the new summaries expose no acquisition or mastery loop. |
| 12 | `progression=2` | `REJECT` | Hospital, festival, relationship, naming, and reflection episodes are experiences and character change. They do not establish repeated acquisition/mastery and cannot reverse the first independent rejection. |
| 13 | `progression=2` | `UNKNOWN` | Employment and a hero aspiration make progression plausible, but the live static description exposes no repeated acquisition/mastery sequence. |
| 13 | `problemSolving=2` | `UNKNOWN` | Protecting people from incidents defines the profession and obstacles; it does not expose repeated analysis/direct-action solution processes. Panel text is absent. |
| 13 | `pacing=3`, `characterArcWeight=2`, `relationshipStructure=2` | `ACCEPTED_NO_OP` | These exact rows are already known in the terminal vector and remain supported by prior bounded evidence. No rewrite is needed. |
| 13 | `emotionalWarmth=2` | `UNKNOWN` | Protecting the public and team membership do not directly establish warmth/healing as a recurring reader reward. |
| 13 | `mentalStress=1` | `UNKNOWN` | Incident urgency and a job test are not a direct repeated psychological-pressure observation. |
| 15 | `problemSolving=2` | `ACCEPTED_NO_OP` | Volumes 2–3 corroborate goal/obstacle/action situations; this cell is already terminal known. |
| 15 | `progression=2` | `UNKNOWN` | School restart and role adaptation still do not expose a repeated skill-acquisition/mastery reward. Assassins and rescue cannot substitute for progression. |
| 15 | `characterArcWeight=2`, `emotionalWarmth=2` | `ACCEPTED_NO_OP` | Both are already terminal known and are preserved without confidence drift. |
| 16 | `pacing=2`, `mentalStress=1` | `ACCEPTED_NO_OP` | Both exact cells already exist and the official volume 2–3 descriptions corroborate them. |
| 16 | `progression`, `problemSolving`, `strategy`, `mysteryReveal`, `comedy` | `UNKNOWN` | Seasonal movement, relationship deepening, and searching for feelings do not map to mastery, analytical solving, planning, clue/reveal, or recurring comedy. |
| 18 | `problemSolving=2`, `comedy=2` | `ACCEPTED_NO_OP` | Existing terminal cells remain supported by the prior packet; the redirecting trial adds no new claim. |
| 18 | `progression=1` | `REJECT` | Trade knowledge presented to the reader is not the protagonist's repeated growth/acquisition reward. The inaccessible body cannot cure that construct mismatch. |
| 19 | `pacing=2`, `mentalStress=1` | `ACCEPTED_NO_OP` | Both exact rows are already terminal known. The current series synopsis corroborates residual worry followed by relief and episodic format. |
| 19 | `worldBuilding=2` | `REJECT` | Office, colleagues, home, and business travel are workplace context. They do not establish repeated history/culture/rules and must not duplicate the existing `workplace:2` Theme into an Axis. |
| 19 | `progression=1` | `REJECT` | Job change and emotional relief are setup/character adaptation, not acquisition/mastery. A between-anchor value cannot be used merely to avoid unknown. |

New accepted cells: **0**. Existing accepted cells rewritten: **0**. Unknown-to-numeric substitutions: **0**.

## Hash, reverse substitution, and structural check

- Terminal CSV before adjudication: `f4881fb929ca3256ce82efb2984998f325fc2383c3c6be8a1fa496e57d24fcea`.
- Terminal CSV after adjudication: `f4881fb929ca3256ce82efb2984998f325fc2383c3c6be8a1fa496e57d24fcea`.
- Reverse substitution set: empty; no-op reverse SHA-256: `f4881fb929ca3256ce82efb2984998f325fc2383c3c6be8a1fa496e57d24fcea`.
- Reverse result equals the pre-adjudication hash: **PASS**.
- Structure: `170` data rows, ten work IDs, seventeen unique axes per work: **PASS**.
- Positions 14/17/20 retain the exact known/unknown rows present in the pre-adjudication hash: **PASS**.

## Gate recount

Thresholds remain Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, Tone `>=5/7`. No terminal row changed, so every count is unchanged.

| Position | Narrative | Tone | Result |
|---:|---:|---:|---|
| 11 | `2/6` | `5/7` | `TEXT_GATE_FAIL — N+2` |
| 12 | `2/6` | `5/7` | `TEXT_GATE_FAIL — N+2` |
| 13 | `2/6` | `3/7` | `TEXT_GATE_FAIL — N+2, T+2` |
| 14 | `4/6` | `6/7` | `TEXT_GATE_PASS` — preserved |
| 15 | `3/6` | `6/7` | `TEXT_GATE_FAIL — N+1` |
| 16 | `2/6` | `5/7` | `TEXT_GATE_FAIL — N+2` |
| 17 | `4/6` | `5/7` | `TEXT_GATE_PASS` — preserved |
| 18 | `3/6` | `5/7` | `TEXT_GATE_FAIL — N+1` |
| 19 | `1/6` | `5/7` | `TEXT_GATE_FAIL — N+3` |
| 20 | `4/6` | `5/7` | `TEXT_GATE_PASS` — preserved |

- Chunk 02 all-text-gate count remains `3/10`.
- With chunk 01 round-2 adjudication already applied, Batch 004 all-text-gate count remains `4/50` (positions 3, 14, 17, and 20).
- This report does not change Art or any promotion gate.

## Exact remaining-route disposition

| Position | Exact next route | Disposition |
|---:|---|---|
| 11 | TAMESHIYO volume-3 page-level reader content remains the only exact branch capable of adding an event/process observation beyond the inspected summary; use a browser-capable page ledger if it is readable. | `NO_FINAL_BLOCKER`; current summary did not satisfy a new anchor. |
| 12 | The exact e-comi volume-2/3 `speedreader` bodies remain available after the verified redirect. A bounded page/event ledger may test the missing Narrative axes. | `NO_FINAL_BLOCKER`; bootstrap metadata is not global exhaustion. |
| 13 | The exact first-episode part 1/2 viewer panels remain a browser/computer-use route because static HTML omits panel text. The adjacent episode is gated and may not be treated as read. | `NO_FINAL_BLOCKER`; static-shell limitation is not source absence. |
| 14 | No text recovery route is required; all text gates pass. | Preserve verified terminal state. |
| 15 | The exact S-MANGA volume-2/3 reader bodies remain a browser-capable route beyond the inspected official descriptions. | `NO_FINAL_BLOCKER`; progression remains unknown. |
| 16 | TAMESHIYO volume-2/3 page-level reader content remains an exact route for an event/process ledger. | `NO_FINAL_BLOCKER`; descriptions alone do not close Narrative. |
| 17 | No text recovery route is required; all text gates pass. | Preserve verified terminal state. |
| 18 | Retry the exact Kodansha volume-2 trial with browser session/redirect stabilization; the redirect loop is reproducible and unresolved. | `NO_FINAL_BLOCKER`; access failure is not source unavailability. |
| 19 | Use the exact free Champion Cross episode bodies linked by the verified series ledger, including the already recorded episode hashes, and keep paid/gated entries unread. | `NO_FINAL_BLOCKER`; series metadata alone cannot fill axes. |
| 20 | No text recovery route is required; all text gates pass. | Preserve verified terminal state. |

No hard blocker is authorized. Failure to reach a coverage threshold after this round remains an evidence-specific state, not proof of `SOURCE_INFORMATION_UNAVAILABLE` or `FACTOR_MODEL_INCOMPATIBLE`.
