# Batch 004 chunk 03 round-3 text recovery — independent adjudication

## Scope and bindings

- Reviewer: Daybreak independent adjudicator; `reviewedByHuman=false`.
- Repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`.
- Candidate SHA-256: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`.
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`.
- Round-3 recovery SHA-256: `7dc0b66fad281a649fe9c9ec5d538cc16e761350b7c14b6a44bba073fbb25d38`.
- Bound round-2 QA SHA-256: `17e6635471e8458908687961ff44b2d13967f7cf4eea8695fb0e04083397f0f8`.
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`.
- Retrieval/reverification date: `2026-08-25`.
- Entry scope: volumes 1–3, or the complete single volume for positions 25 and 26.
- Mutation boundary: only accepted previously-unknown cells in
  `adjudication/text-final-chunk-03.csv`. Genre, Theme, Art, source, identity,
  safety, blocker, overlay, registry, generated artifact, and promotion files were
  not changed.

The eight proposals were reviewed independently against the Dictionary anchors.
No round-2 rejection was reopened, no adjacent value was substituted, and no vote
or average was used. A live URL or a storefront shell was not treated as proof of
the claimed Factor by itself.

## Entry-range evidence verification

| Position | Direct range finding | Independent-review finding |
|---:|---|---|
| 21 | Shueisha exact readers identify [volume 2](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088823300) and [volume 3](https://www.shueisha.co.jp/books/reader/main.php?cid=9784088824048). The official range supplies the Union/quest/encounter boundary, while the bounded volume-2 accounts supply the actual short tactical sequences. | [Manga Laboratory](https://mangalab.hatenablog.com/entry/undeadunluckvol2) and [Yamaneko](https://photomedliban.com/2656.html) independently describe exploiting Gina's barrier gap and ability constraints, then additional bounded choices during the Spoil mission. This is repeated short tactics, not long-range war/resource planning. |
| 23 | Shogakukan's exact [volume-3 product](https://e-comi.shogakukan.co.jp/books/091212900000d0000000) identifies the rival incident and labels the licensed genre `ギャグ`; metadata alone was not used as an Axis. | The exact [BookLive volume-3 reviews](https://booklive.jp/review/list/title_id/263959/vol_no/003) identify laughter in the rival/childhood incidents, while [Cmoa](https://www.cmoa.jp/title/77388/vol/3/) independently identifies the volume-2 soba-shop incident as laugh-out-loud comedy. The observations are inside volumes 2–3 and establish recurring intermittent comedy, not constant comedy 4. |
| 24 | The exact BookLive listing reproduces Kodansha's volume-2 training/reward description and volume-3 cohabitation/bath/laundry/meal description. These are relationship events but do not alone prove warmth/healing as the reward. | The volume-2 BookLive and volume-3 Sony texts are both Booklog-powered and show a likely shared reviewer lineage. They are not counted as two independent review sources. The required independent supplemental quorum is therefore absent. |
| 25 | Shueisha's [complete single-volume product](https://www.shueisha.co.jp/books/items/contents_amp.html?jdcn=08X10000000016342800) binds the two creators, elapsed time, and mutual support over the full 144-page work. | [Toriheads](https://tktk1.net/manga/lookback/) and [Tsubulog](https://uniquerui.com/tblog/look-back-review/) independently map the competition, meeting, joint creation, later separation, violent loss, guilt/alternate possibility, and return to drawing. The bounded full-work sequence supports ordinary arc change plus mixed tragedy and psychological pressure; recovery prevents either Tone cell from being raised to 4. |
| 26 | KADOKAWA identifies a complete collection of eight shorts and a quiet everyday presentation. | The cited reviews establish one-chapter episodes and low-key daily-life tone, not that goals/locations/states change little across the complete collection. Short count and quiet tone cannot establish `pacing=0`. |
| 28 | Shueisha's exact volume-2/3 readers bind the secret, confession, rejection, and continuing four-person relationship range. | The exact [BookLive volume-2 review corpus](https://booklive.jp/review/list/title_id/344344/vol_no/002) repeatedly describes pain, anxiety, awkwardness, rejection, and mixed hopeful relief. However, `mentalStress=known,2,0.78` was already terminal before this round, so the new lower-confidence proposal must not rewrite it. |

No decorative title delimiter was imported into a canonical title. User observations
remain supplemental evidence and were not copied into recommendation explanations.

## Exact proposal adjudication

| Position | Proposed cell | Decision | Rationale |
|---:|---|---|---|
| 21 | `strategy=2, confidence=0.64` | `ACCEPT` | Multiple entry-range encounters require a stated constraint, a bounded plan, and a chosen exploitation step. This matches `전술·단기 계획 존재`; it does not support 4. |
| 23 | `comedy=2, confidence=0.65` | `ACCEPT` | Two independent volume-bounded observations add recurring situational laughter to the official range. Comedy is intermittent rather than the sole constant reward. |
| 24 | `emotionalWarmth=2, confidence=0.63` | `UNKNOWN` | Cohabitation, affection, and erotic reward overlap with the already-known romance axis. The supposed two-source user quorum is not independent because both detailed texts are Booklog-powered. Warmth/healing as a distinct mixed relationship reward remains unproven. |
| 25 | `pacing=2, confidence=0.62` | `ACCEPT` | The complete single-volume event sequence has ordinary arc-scale changes. The evidence does not require the more extreme short-interval churn anchor for 4. |
| 25 | `darkness=2, confidence=0.67` | `ACCEPT` | Unexpected violence, death, and loss are direct serious tragedy, mixed with creation, friendship, and renewed action. This matches 2, not tragedy as the exclusive center required for 4. |
| 25 | `mentalStress=2, confidence=0.65` | `ACCEPT` | Grief, guilt, regret, and an imagined alternative create real pressure, while recovery and resumed creation keep the entry experience mixed rather than sustained-collapse 4. |
| 26 | `pacing=0, confidence=0.60` | `UNKNOWN` | Eight self-contained shorts and a quiet tone do not prove little goal/situation change across the collection. The missing story-level event matrix remains necessary. |
| 28 | `mentalStress=2, confidence=0.60` | `ACCEPTED_NO_OP` | The direct volume-2 range corroborates mixed stress, but the terminal row already held the same value at higher confidence `0.78`. It is byte-preserved. |

New accepted cells: **5**. Accepted no-op cells: **1**. Unknown remains: **2**.
Existing cells rewritten: **0**. Genre changes: **0**. Theme changes: **0**.

## Hash, reverse substitution, and structure

- Terminal text CSV before adjudication:
  `11e84986cc0cd4b8f70c6e0f203f123d95feb755884f9962cc06436d77ce65fe`.
- Terminal text CSV after adjudication:
  `c37820ca7d6399bd2f3c6fe8e26ea7309f350f3a46c1a84d69800354cd260c56`.
- In-memory reverse substitution of exactly the five accepted rows:
  `11e84986cc0cd4b8f70c6e0f203f123d95feb755884f9962cc06436d77ce65fe` — **PASS**.
- Structure: `170` data rows, ten work IDs, seventeen unique axes per work — **PASS**.
- Genre terminal SHA-256 remains
  `6e4a37abd5683bdfcf5c58f6c4cf1ad7aec5028152feb2c9aaa8522e2112476e`.
- Theme terminal SHA-256 remains
  `5a938db4531544f619199cd6a2b72c6e9a6bf9667af56cfe622a89f59f936eec`.

## Gate recount

Thresholds remain Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, Tone `>=5/7`.

| Position | Before N / T | After N / T | Result |
|---:|---:|---:|---|
| 21 | `3/6 · 4/7` | `4/6 · 4/7` | `TEXT_GATE_FAIL — T+1` |
| 22 | `1/6 · 5/7` | unchanged | `TEXT_GATE_FAIL — N+3` |
| 23 | `2/6 · 4/7` | `2/6 · 5/7` | `TEXT_GATE_FAIL — N+2` |
| 24 | `3/6 · 4/7` | unchanged | `TEXT_GATE_FAIL — N+1, T+1` |
| 25 | `0/6 · 3/7` | `1/6 · 5/7` | `TEXT_GATE_FAIL — N+3` |
| 26 | `0/6 · 1/7` | unchanged | `TEXT_GATE_FAIL — N+4, T+4` |
| 27 | `3/6 · 5/7` | unchanged | `TEXT_GATE_FAIL — N+1` |
| 28 | `2/6 · 5/7` | unchanged | `TEXT_GATE_FAIL — N+2` |
| 29 | `0/6 · 1/7` | unchanged | `TEXT_GATE_FAIL — Theme+1, N+4, T+4` |
| 30 | `2/6 · 6/7` | unchanged | `TEXT_GATE_FAIL — N+2` |

- Chunk 03 all-text-gate count remains `0/10`.
- Batch 004 all-text-gate count remains `4/50` (positions 3, 14, 17, and 20).
- This review does not change Art or any promotion gate.

## Remaining route and blocker disposition

- Position 21 still needs one directly supported Tone cell; the official reader body
  remains a live evidence route.
- Positions 23 and 25 still need additional Narrative cells. Their live reader/body
  routes are not exhausted.
- Position 24 still needs an actually independent relationship observation or direct
  body evidence before `emotionalWarmth` can become known.
- Position 26 still needs a bounded eight-story event matrix before pacing can be
  resolved.
- Position 28 retains live official reader bodies for its remaining Narrative cells.
- No hard blocker is authorized. Coverage failures remain evidence-specific research
  gaps, not proof of `SOURCE_INFORMATION_UNAVAILABLE` or
  `FACTOR_MODEL_INCOMPATIBLE`.
