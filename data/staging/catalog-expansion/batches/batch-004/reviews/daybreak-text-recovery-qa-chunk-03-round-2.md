# Batch 004 chunk 03 round-2 text recovery — independent adjudication

## Scope and bindings

- Reviewer: Daybreak independent adjudicator; `reviewedByHuman=false`.
- Repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`.
- Candidate SHA-256: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`.
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`.
- Round-2 recovery SHA-256: `25293b784d4345bbe169787c5c201ca344de53b2cbe07af055e445ff09e357d1`.
- Prior blocker adjudication SHA-256: `8af242b491d03018a31470fb119c316352fe114f4329a1b50277ec0ad9a5aefd`.
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`.
- Retrieval/reverification date: `2026-08-25`.
- Entry scope: volumes 1–3, or the complete single-volume work for positions 25, 26, and 29.
- Mutation result: three accepted cells in `adjudication/text-final-chunk-03.csv`. Genre and Theme terminal CSVs are byte-identical. Art, identity, safety, blockers, overlay, source, registry, generated artifacts, and promotion state were not changed.

## Source identity, availability, and range verification

The 17 primary official product/reader routes named by the packet were requested independently with redirect following. All returned final HTTP `200`; the Shogakukan reader links resolved to exact JDCN `speedreader` routes. The 13 supplementary review routes used or rejected by the packet also returned final HTTP `200`. Availability does not by itself authorize a Factor value.

| Position | Independently verified entry source | Range and date finding |
|---:|---|---|
| 21 | Shueisha official readers for volumes [2](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088823300) and [3](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088824048). | Exact title/creator and release dates `2020-06-04` / `2020-09-04` are exposed in the reader HTML. The descriptions repeat the central duo's joint action and Fuko's choice to restore Andy. |
| 22 | Shueisha official readers for volumes [2](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088468174) and [3](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088468969). | Exact title/creators and dates `2012-08-24` / `2013-02-25` are exposed. The described resolutions are force/direct-action events, while volume 3 directly calls the work a comedy. |
| 23 | Shogakukan e-comi readers for volumes [2](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091212160000d0000000) and [3](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091212900000d0000000). | Both exact JDCNs resolve to live readers. The packet's `2014-08-25` electronic-edition boundary is retained; no paper pagination is transferred. |
| 24 | Kodansha official products for volumes [1](https://www.kodansha.co.jp/comic/products/0000415577), [2](https://www.kodansha.co.jp/comic/products/0000419091), and [3](https://www.kodansha.co.jp/comic/products/0000424213). | The official descriptions directly expose the despair/death-or-marriage premise, recognition of insufficient strength followed by practical training, and later combat/domestic events. Product dates are `2025-07-16`, `2025-10-17`, and `2026-02-17`. |
| 25 | Shueisha official [single-volume product](https://www.shueisha.co.jp/books/items/contents_amp.html?jdcn=08X10000000016342800) and reader. | The `2021-09-03` synopsis exposes connection, elapsed time, and mutual support, but not an acquisition/mastery loop. |
| 26 | KADOKAWA official [product](https://www.kadokawa.co.jp/product/321904000716/) and [press release](https://group.kadokawa.co.jp/documents/topics/20200428_k43ef.pdf). | The `2019-08-10` product and `2020-04-28` press release confirm eight shorts and a calm, naturalistic presentation. They do not map each story's goals or situation changes. |
| 27 | KADOKAWA official volumes [2](https://www.kadokawa.co.jp/product/321901000234/) and [3](https://www.kadokawa.co.jp/product/321906000326/). | Exact products/dates `2019-04-22` / `2019-10-21` and BookWalker links are live. The static official descriptions do not expose an analytical solution process. |
| 28 | Shueisha official readers for volumes [2](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088455280) and [3](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088455969). | Exact readers are live and within entry scope. The secret/reaction chain and school setting corroborate existing terminal cells. |
| 29 | Shogakukan exact [collection reader](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091345850000d0000000), [BookLive reviews](https://booklive.jp/review/list/title_id/205643/vol_no/001), and [Sony reviews](https://ebookstore.sony.jp/review/title/10074712/id/LT000007099000286252/?sort=-like). | All routes are live. The official description supplies collection-level warmth, but the review packet has no story/page mapping or dated, bounded two-source reveal ledger. |
| 30 | Shogakukan e-comi readers for volumes [2](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091338140000d0000000) and [3](https://e-comi.shogakukan.co.jp/viewer/open?jdcn=091341120000d0000000). | Both exact JDCNs resolve to live readers. Workplace mishaps are direct; their solving method is not exposed by the official descriptions. |

No decorative title delimiters were imported into a canonical title. Review observations remain supplemental and are not copied into product explanation data.

## Candidate adjudication

`ACCEPTED_NO_OP` corroborates an existing terminal cell without rewriting it. `UNKNOWN` means the candidate remains plausible but the direct entry evidence does not satisfy the Dictionary anchor. `REJECT` identifies a construct mismatch.

| Position | Candidate | Decision | Rationale |
|---:|---|---|---|
| 21 | `problemSolving=2` | `REJECT` | Repelling attackers and activating Unluck to restore Andy are force/ability/direct-decision events. The descriptions expose no mixture of analysis and direct action required for 2. |
| 21 | `emotionalWarmth=2` | `ACCEPT` → `known,2,0.66` | Volumes 2–3 repeat joint action and Fuko's decision to restore her partner amid severe combat risk. Support is present but is not the sole reward, matching mixed warmth rather than 4. |
| 22 | `problemSolving=2` | `REJECT` | The crisis is resolved by Takeo's physical power and the mountain episode states a direct escort mission. No analytical or ingenious process is exposed. |
| 22 | `comedy=2`; Theme `school:1` | `ACCEPTED_NO_OP` | Both exact terminal cells already exist and the official readers corroborate them. No confidence drift is applied. |
| 23 | `characterArcWeight=2` | `REJECT` as a downgrade | The new descriptions do not refute the existing bounded `characterArcWeight=4` judgment; they cannot lower a previously adjudicated cell merely because the summaries are compressed. |
| 23 | `worldBuilding=2` | `REJECT` | Tea etiquette and club practice are activity content, not a repeated functional history/culture/rule/faction system. This also follows the prior adjudicator's explicit anti-conversion instruction. |
| 23 | `emotionalWarmth=2` | `ACCEPTED_NO_OP` | Already terminal known; the peaceful-life framing corroborates it without a rewrite. |
| 23 | `comedy=2` | `UNKNOWN` | Licensed/genre metadata establishes Genre comedy, not recurring Axis frequency. |
| 24 | `progression=2` | `ACCEPT` → `known,2,0.66` | Volume 2 directly joins recognized insufficient strength to practical combat training. This is an explicit entry growth process, but there is no repeated mastery reward for 4. |
| 24 | `problemSolving=2` | `REJECT` | Defeat, training, kidnapping, and rescue identify obstacles and action, not mixed analytical solving. |
| 24 | `worldBuilding=2` | `ACCEPTED_NO_OP` | Already terminal known and corroborated by the nonhuman/divine rules; no rewrite. |
| 24 | `mentalStress=2` | `ACCEPT` → `known,2,0.68` | Volume 1 directly identifies a despairing protagonist with no will to live and a marry-or-die demand. Later danger is mixed with romance/domestic comedy, supporting 2 rather than sustained-collapse 4. |
| 24 | `emotionalWarmth=2` | `UNKNOWN` | Bathing, laundry, meals, and cohabitation do not directly establish warmth/healing as a relationship reward. |
| 25 | `progression=2` | `REJECT` | Elapsed time and creative connection are not repeated acquisition/mastery rewards. The synopsis does not describe improvement or training. |
| 25 | `emotionalWarmth=2` | `ACCEPTED_NO_OP` | Mutual support corroborates the existing terminal value. |
| 26 | `pacing=0` | `UNKNOWN` | “Natural-paced” characters and a quietly drawn everyday world describe presentation and character manner. Without a story-level event map, they do not prove little goal/situation change across eight shorts. |
| 27 | `problemSolving=2` | `UNKNOWN` | Official descriptions expose livelihood and memories, not solution sequences. Unbounded user-review observations cannot independently establish this Narrative axis. |
| 28 | `mysteryReveal=2`; Theme `school:1` | `ACCEPTED_NO_OP` | Both terminal cells already exist and the official volume descriptions corroborate them. |
| 29 | `emotionalWarmth=2` | `ACCEPTED_NO_OP` | The official collection description corroborates the existing mixed-warmth cell. |
| 29 | `mysteryReveal=2` | `UNKNOWN` | Review references to reversals are not tied to named stories/pages or a dated, bounded independent quorum. They do not establish a collection-level reveal structure. |
| 29 | no allowed Theme | `NO_OP` | The finite 22-Theme test correctly rejects `foundFamily`; no unsupported Theme is added. |
| 30 | `problemSolving=2` | `REJECT` | Workplace trouble and mutual assistance do not expose the solving method. User reviews cannot substitute for a direct Narrative process ledger. |

New accepted cells: **3**. Existing accepted cells rewritten: **0**. Genre changes: **0**. Theme changes: **0**. No adjacent value or automatic average was substituted.

## Hash, reverse substitution, and structure

- Terminal text CSV before adjudication: `97e85a3f5876e132bf326e8597b868d642dadbeb021d6444221f3f545c6d5e96`.
- Terminal text CSV after adjudication: `11e84986cc0cd4b8f70c6e0f203f123d95feb755884f9962cc06436d77ce65fe`.
- In-memory reverse substitution of exactly the three accepted rows: `97e85a3f5876e132bf326e8597b868d642dadbeb021d6444221f3f545c6d5e96` — **PASS**.
- Structure: `170` data rows, ten work IDs, seventeen unique axes per work — **PASS**.
- Genre terminal SHA-256 remains `6e4a37abd5683bdfcf5c58f6c4cf1ad7aec5028152feb2c9aaa8522e2112476e`.
- Theme terminal SHA-256 remains `5a938db4531544f619199cd6a2b72c6e9a6bf9667af56cfe622a89f59f936eec`.

## Gate recount

Thresholds remain Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, Tone `>=5/7`.

| Position | Before N / T | After N / T | Result |
|---:|---:|---:|---|
| 21 | `3/6 · 3/7` | `3/6 · 4/7` | `TEXT_GATE_FAIL — N+1, T+1` |
| 22 | `1/6 · 5/7` | unchanged | `TEXT_GATE_FAIL — N+3` |
| 23 | `2/6 · 4/7` | unchanged | `TEXT_GATE_FAIL — N+2, T+1` |
| 24 | `2/6 · 3/7` | `3/6 · 4/7` | `TEXT_GATE_FAIL — N+1, T+1` |
| 25 | `0/6 · 3/7` | unchanged | `TEXT_GATE_FAIL — N+4, T+2` |
| 26 | `0/6 · 1/7` | unchanged | `TEXT_GATE_FAIL — N+4, T+4` |
| 27 | `3/6 · 5/7` | unchanged | `TEXT_GATE_FAIL — N+1` |
| 28 | `2/6 · 5/7` | unchanged | `TEXT_GATE_FAIL — N+2` |
| 29 | `0/6 · 1/7` | unchanged | `TEXT_GATE_FAIL — Theme+1, N+4, T+4` |
| 30 | `2/6 · 6/7` | unchanged | `TEXT_GATE_FAIL — N+2` |

- Chunk 03 all-text-gate count remains `0/10`.
- Batch 004 all-text-gate count remains `4/50` (positions 3, 14, 17, and 20).
- This review does not change Art or any promotion gate.

## Remaining-route disposition

- Positions 21–23, 25, 28, and 30 retain live exact official reader bodies as browser/computer-use routes beyond the inspected metadata descriptions.
- Position 24 retains the session-bound Kodansha trial bodies; the accepted official-text cells do not exhaust the remaining Narrative/Tone gaps.
- Positions 26 and 27 retain live BookWalker viewer bodies that still need a bounded page/event matrix.
- Position 29 retains the live exact collection body; its story/page map and an allowed Theme remain unresolved.
- No hard blocker is authorized. Residual coverage failures remain evidence-specific research states, not proof of `SOURCE_INFORMATION_UNAVAILABLE` or `FACTOR_MODEL_INCOMPATIBLE`.
