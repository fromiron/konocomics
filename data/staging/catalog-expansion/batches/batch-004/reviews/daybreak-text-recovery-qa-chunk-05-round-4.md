# Batch 004 chunk 05 round-4 text recovery — independent adjudication

## Scope and bindings

- Reviewer: Daybreak independent adjudicator; `reviewedByHuman=false`.
- Repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`.
- Retrieval and independent verification date: `2026-08-25`; every accessible source below has `retrievedAt=2026-08-25`.
- Scope: position `46` さよなら絵梨, complete one-shot, and position `48` アオハライド, entry volumes 1–3.
- Round-4 recovery packet SHA-256: `216da0208ef3bf54d158763261169b936410ec7a83f783826caf7c48be9dfb97`.
- Round-3 independent QA SHA-256: `34202023651f771e00dcec24dbe71532344b95c4f4427913908eae61bd086f63`.
- Chunk-05 blocker adjudication SHA-256: `c4be3b24ae4b9b9a3f1b1e8f4dff4531a3400dcb2e7e1fe77306a8425666abb1`.
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`.
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`.
- Mutation boundary: one `emotionalWarmth` cell in `adjudication/text-final-chunk-05.csv` and this report. Position 42, Genre, Theme, Art, source, identity, safety, ISBN, blockers, overlays, promotion state, registry, generated artifacts, and runtime explanations were not changed.

The two proposals were re-decided from the direct Dictionary anchor. A moving farewell, grief,
romantic attraction, or one kind action is not by itself sustained `emotionalWarmth`. Value `1` was
used only where repeated positive support and relationship preservation recur in the bounded entry,
but remain weaker than the mixed-warmth anchor at `2`. Reviews were supplemental; ratings,
popularity, genre, and vague affect were ignored.

## Exact evidence re-open

### Position 46 — さよなら絵梨 — `work-eef84d07d90ba2b040cf`

| Source | Published | Retrieved | Independent finding |
| --- | --- | --- | --- |
| [集英社 official product](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-883167-1) | `2022-07-04` | `2026-08-25` | The official synopsis confirms the mother's request and death, Yuta's suicide attempt, meeting Eri, joint filmmaking, Eri's secret, and the reality/creation boundary. It does not describe recurring care, comfort, affection, or healing between Yuta and Eri. |
| [少年ジャンプ＋ official complete-volume route](https://shonenjumpplus.com/volume/4856001361007486895) | `2022`; page-level date not exposed | `2026-08-25` | The official route and title/creator identity were reachable, but readable body text beyond the same synopsis was not exposed. No extra warmth observation was credited. |
| [rednought review](https://note.com/rednought_1/n/nc3d5037851) | reported `2022-04-11` in the proposal | `2026-08-25` | The exact URL currently resolves to a not-found page. Its claimed farewell observation could not be independently re-opened and was not credited. |
| [まゆ文明 complete-work review](https://www.mayubunmei.com/manga/3748) | `2024-07-09` | `2026-08-25` | The review concretely discusses ambiguity, Eri's death, later family loss, renewed filmmaking, and the reviewer's hope that Yuta recovers. These are grief, interpretation, and hoped-for recovery, not repeated on-page warmth. |
| [12garage complete-work review](https://12garage.hatenadiary.jp/entry/2022/04/16/040231) | `2022-04-16` | `2026-08-25` | The review follows Yuta's abuse, loss, artistic development, Eri's filmmaking contribution, and their final separation. It supports creation/character change, but does not independently establish sustained warmth as an entry reward. |

The two accessible independent reviews do not repeat a direct warmth observation. They converge on
loss, filmmaking, ambiguity, artistic recovery, and farewell. Treating those emotionally affecting
events as `emotionalWarmth=2` would collapse sadness, character development, and reciprocal warmth
into one value. The missing third review further removes the proposal's claimed three-review
convergence.

### Position 48 — アオハライド — `work-fc53cb5669aa4099ee4a`

| Source | Published | Retrieved | Independent finding |
| --- | --- | --- | --- |
| [集英社 official volume 1](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-846647-7) | `2011-04-13` | `2026-08-25` | The first-love reunion and Futaba's self-protective social performance establish the conflicted baseline, not warmth by themselves. |
| [集英社 official volume 2](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846690-3) | `2011-08-25` | `2026-08-25` | The publisher directly describes Futaba trying to form new relationships and calls Kou brusque but kind while they attend leadership training together. |
| [集英社 official volume 3](https://books.shueisha.co.jp/items/contents.html?isbn=978-4-08-846731-3) | `2011-12-22` | `2026-08-25` | Futaba recognizes her current feelings and must address her important friend's love for Kou, confirming that positive bonds coexist with substantial relational strain. |
| [しあわせのあんてな volume-2 review](https://ameblo.jp/chikezdiary/entry-11896012676.html) | `2014-07-19` page metadata | `2026-08-25` | One independent volume-bounded reviewer identifies separated practical-support beats: Kou joins Futaba's class role, stays with her after injury, and masks both actions with brusque explanations. |
| [BookLive volume-3 review surface](https://booklive.jp/review/list/title_id/193481/vol_no/003) | credited reviews include `2012-04-08`, `2013-01-24`, and `2014-05-04` | `2026-08-25` | Multiple separately dated reviewers describe Futaba preserving her friendship through honest disclosure, the friends not separating, and the relationship remaining positive despite competing affection. Ratings were ignored. |

The Ameblo article and BookLive/Booklog review records have different authorship surfaces, dates,
wording, and scene focus; no copied excerpt was observed. The official volume-2 description directly
anchors kindness, while the two independent review routes place recurring support and friendship
preservation in distinct volume-2 and volume-3 contexts. Conflict remains prominent, so the evidence
does not reach `emotionalWarmth=2`; it does establish a repeated but weaker-than-2 positive signal.

## Cell adjudication

| Position | Proposed cell | Decision | Applied terminal cell | Dictionary-anchor rationale |
| ---: | --- | --- | --- | --- |
| 46 | `emotionalWarmth=2` | `REJECT` | unchanged `unknown` | Joint filmmaking, farewell, grief, and hoped-for recovery are emotionally consequential, but the accessible sources do not repeat direct care, comfort, affection, or healing as a sustained reward. |
| 48 | `emotionalWarmth=1` | `ACCEPT` | `known,1,0.55` | Official kindness plus separated practical-support and friendship-preservation observations recur across volumes 2–3. The positive signal is real but intermittent and conflict-heavy, placing it between the 0 and 2 anchors. |

No value was averaged, no romance or Genre label was converted into warmth, and no Art evidence was
used. Position 46 remains `unknown`; unknown is not a low value.

## Hash, reverse-substitution, and schema checks

- Terminal CSV before adjudication: `4df2a5564ef8a582d199d0ffe852cf13e6a96b1338d591019dcdadd50b0e69f7`.
- Terminal CSV after the one-cell overlay: `ccb7e51c60ba966f65a77855483847b31d32e34436ce2caa3c1ec95a67156fa6`.
- In-memory reverse substitution of exactly the accepted row: `4df2a5564ef8a582d199d0ffe852cf13e6a96b1338d591019dcdadd50b0e69f7` — **PASS**.
- CSV cardinality: `170` data rows, `10` works, `17` axes per work, `170` unique `(workId, axis)` pairs — **PASS**.
- Position-42 terminal block: `17` rows; ordered-row SHA-256 `e39986a76a791872fdbae8dc93c5203c6739986c35af18a392e2cc5c737a5754` — **UNCHANGED**.
- Genre CSV: `c7c7ab76b16caa86418da729165b0f457f763be691fdf5941ddd14c97af3214b` — unchanged.
- Theme CSV: `4fd1c0aad8ca4ef2a32cc288d250fc7aab675bbd443b275ecb9ba228e27855cc` — unchanged.

## Gate recount

Thresholds remain Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, and Tone `>=5/7`.
Position 42 remains governed by its separate compound blocker.

| Position | Before N / T | After N / T | Terminal text result |
| ---: | ---: | ---: | --- |
| 46 | `2/6 · 4/7` | unchanged | `TEXT_GATE_FAIL — N+2, T+1` |
| 48 | `2/6 · 4/7` | `2/6 · 5/7` | `TEXT_GATE_FAIL — N+2` |

- Chunk-05 all-text-gate positions remain `43`, `44`, and `47` (`3/10`).
- Current Batch-004 all-text-gate positions remain `3`, `14`, `17`, `20`, `43`, `44`, and `47` (`7/50`).
- The accepted cell closes position 48's Tone coverage only. It does not pass Narrative coverage and authorizes no promotion or blocker decision.

## Handoff

- Position 46 retains `emotionalWarmth=unknown`; further research must produce direct, repeated warmth observations rather than another interpretation of grief or farewell.
- Position 48 now has `Tone 5/7` but remains an exact `Narrative +2` recovery case.
- Position 42 and its `FACTOR_MODEL_INCOMPATIBLE;SOURCE_INFORMATION_UNAVAILABLE` compound blocker were not inspected or changed.
- No source, generated artifact, final overlay, promotion registry, or blocker record was modified.
