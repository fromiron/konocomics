# Batch 004 chunk 02 round-3 text recovery — independent QA

## Scope and bindings

- Reviewer: Daybreak independent QA; `reviewedByHuman=false`.
- Repository HEAD: `a423c20add1162b7cdf71342a721ffcd7191d3c2`.
- Candidate-set SHA-256: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`.
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`.
- Round-3 research SHA-256: `1ac2e369e054d1dafd48e77de238e1dc403d42ae07e81b483a4242b01f3835fa`.
- Retrieval and independent inspection date: `2026-08-25`.
- Scope: position 13, `work-2c4fe00df5255fc082f9`, `ヒーローカンパニー`, first official episode only.
- Result: accept one direct text cell, `strategy=known 2`, confidence `0.64`. No Genre, Theme, Art, identity, safety, blocker, overlay, source, registry, generated artifact, or promotion state changed.

## Official route and body verification

| Source | URL | Source date/year | Retrieved | Access and identity result |
|---|---|---|---|---|
| HERO'S Web, first episode part 1 | https://heros-web.com/episodes/abc82cfdbc52d/1 | current migrated episode metadata `2026-05-18`; series migration metadata `2026-05-13` | `2026-08-25` | HTTP 200; canonical title, 島本和彦, episode title, and viewer ID `dabd9795266840ac34ce8aa585bf96cf` are present. The migration dates are not treated as original publication dates. |
| HERO'S Web, first episode part 2 | https://heros-web.com/episodes/abc82cfdbc52d/2 | same migrated episode metadata | `2026-08-25` | HTTP 200; resolves to the same first-episode viewer ID. |
| HERO'S Web official contents API | https://heros-web.com/api/book/contentsInfo?user-id=&comici-viewer-id=dabd9795266840ac34ce8aa585bf96cf&page-from=0&page-to=33 | response date not exposed | `2026-08-25` | HTTP 200; `34` ordered pages, `sort=0..33`, all `844x1200`. Retrieval response SHA-256 `c3d955a031e0bbc503d6a5cffe16d6a7cfa6339ba982b9cbbca0d1cb68122735`. |

The adjudicator opened the current official reader pixels for `sort=8`, `sort=9`, and `sort=10` directly. These are the stable p09–p11 references used by the research packet; temporary signed URLs and images were not committed.

| Stable reference | Temporary pixel SHA-256 | Direct text observation |
|---|---|---|
| p09 / `sort=8` | `f4d034abca069fefe5ec2f535cfa0ed431d6b1717ce7e75e2e30cb2b6937f170` | The command center assigns work by importance, urgency, and difficulty and selects departments for specific dispatches. |
| p10 / `sort=9` | `9bf043632f819c86aceeff36c110c05ec07e44e118f289a8221edc11794e494d` | The equipment center visibly operates a queue and allocates multiple equipment sets while personnel complain about time and staffing shortages. |
| p11 / `sort=10` | `87ba2a06d33944b5c62e6bee9053231531956538fc64e07e3665472f272c7109` | Staff weigh personnel cost, role requirements, salary, and training time; the bounded discussion resolves in an immediate decision to dispatch first and defer the hiring question. |

Pixel access was used only to read the official page text and follow the bounded operational sequence. No Art axis was evaluated. The prior Sony, honto, and BookLive user-review observations were treated only as supplementary context; no review claim was needed to establish the accepted value.

## Independent Dictionary adjudication

| Candidate | Decision | Rationale |
|---|---|---|
| `strategy=2` | `ACCEPT` | The three consecutive official pages directly show triage, resource constraints, a short personnel decision, and immediate dispatch. This matches the Dictionary anchor `전술·단기 계획 존재`. Confidence `0.64` reflects one exact opening-episode sequence rather than repeated long-range planning. |
| `strategy=4` | `REJECT` | The sample does not establish a long-range campaign, war/politics, or sustained resource-management reward. |
| `problemSolving=2` | `UNKNOWN` | The sequence explains company allocation and dispatch, but does not show a complete recurring protagonist analysis-and-solution reward. |
| Other previously unknown Narrative/Tone cells | `UNKNOWN` | No unrelated value is inferred from this resource-allocation sequence, title, Genre, Theme, or reviews. |

## Terminal mutation and structural check

- Terminal CSV before SHA-256: `f4881fb929ca3256ce82efb2984998f325fc2383c3c6be8a1fa496e57d24fcea`.
- Terminal CSV after SHA-256: `863050365637a4cce32c1b7cd368de0d8f17275511d552282d24204ce80ead81`.
- Exact mutation: `work-2c4fe00df5255fc082f9,strategy,unknown` → `known,2,0.64`; evidence ID preserved.
- Structure: `170` data rows, `10` work IDs, `17` unique axes per work, six-column schema: **PASS**.
- Genre CSV SHA-256 remains `05c7f1678e6089dbcc7a2076a96157bae0fc3702028a4e482b1f80f43f44cfc9`.
- Theme CSV SHA-256 remains `bb5a08ec02e6b06399086de9c27b5eb3ef944a5d62c29c45daef89478cf107ac`.

## Gate recomputation

Thresholds remain Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, and Tone `>=5/7`.

| Position | Narrative | Tone | Result |
|---:|---:|---:|---|
| 11 | `2/6` | `5/7` | fail |
| 12 | `2/6` | `5/7` | fail |
| 13 | `3/6` | `3/7` | fail — Narrative improved from `2/6`; still needs `N+1`, `T+2` |
| 14 | `4/6` | `6/7` | pass |
| 15 | `3/6` | `6/7` | fail |
| 16 | `2/6` | `5/7` | fail |
| 17 | `4/6` | `5/7` | pass |
| 18 | `3/6` | `5/7` | fail |
| 19 | `1/6` | `5/7` | fail |
| 20 | `4/6` | `5/7` | pass |

- Chunk 02 all-text gate remains `3/10` at positions `14, 17, 20`.
- Current Batch 004 all-text gate remains `6/50` at positions `3, 14, 17, 20, 43, 44`.
- This accepted cell does not itself authorize recommendation promotion or a blocker.
