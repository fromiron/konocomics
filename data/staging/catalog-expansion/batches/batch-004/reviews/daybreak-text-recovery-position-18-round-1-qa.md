# Batch 004 position 18 round-1 text recovery — independent QA

## Scope and bindings

- Reviewer: Daybreak independent QA; `reviewedByHuman=false`.
- Work: frozen position `18`, `work-39c1a2b6791238827ed5`, `とろける鉄工所`.
- Review date: `2026-08-25`.
- Repository HEAD: `7c23eaf23297c0e0dc042b632c48f0fc77d9d047`.
- Packet candidate SHA-256 from the manifest: `8ceb427f6b455baee94e6afd4d28123ab7e53da3ed735431007395293fdfb59d`.
- Manifest SHA-256: `6471599e70992b42b7be29380133be8275c6f187724eedd4a67c954d2ee3bdef`.
- Frozen work-set SHA-256: `a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1`.
- Factor Dictionary SHA-256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`.
- Recovery note SHA-256: `3e6fff37248475d30d37b668bc677022603742b484ff28ae513a9106c57164a4`.
- Entry scope: volumes 1–3 only.
- Result: **ACCEPT** `progression=known 2`, confidence `0.76`. One exact terminal row changed. No Genre, Theme, Art, source, generated catalog, overlay, blocker, registry, or promotion state changed.

## Fresh official verification

All three exact Kodansha product routes were reopened with redirect following on `2026-08-25`; each returned HTTP `200` and exposed the matching title, creator, volume, and paper release date.

| Official source | Paper release | Direct bounded observation |
|---|---:|---|
| [講談社 volume 1](https://www.kodansha.co.jp/comic/products/0000038640) | `2008-11-21` | Establishes the present small-ironworks state: the workers already weld and handle recurring jobs and hazards. It does not independently establish progression. |
| [講談社 volume 2](https://www.kodansha.co.jp/comic/products/0000038651) | `2009-03-23` | Presents summer, autumn, and winter workplace/family episodes. Seasonal chronology and repeated employment do not independently establish progression. |
| [講談社 volume 3](https://www.kodansha.co.jp/comic/products/0000038677) | `2009-10-23` | Explicitly binds Kitano's wish to marry to obtaining a trade, entering the vocational-training route, and overcoming the barriers to becoming a welder; the product description says the Polytechnic Center arc is completely included. |

The earlier round-2 rejection of `progression=1` concerned welding facts shown to the reader and an unavailable trial body. This recovery presents a different direct claim from the official volume-3 product description: a bounded character skill-acquisition arc.

## Independent Dictionary adjudication

| Candidate | Decision | Rationale |
|---|---|---|
| `progression=2` | **ACCEPT** | Volumes 1–2 alone are only episodic workplace chronology. Volume 3 adds a complete causal trajectory inside the entry range: goal (marriage), acquisition route (obtain a trade through vocational training), barriers (becoming a welder), and the already established present outcome (working as a welder). That is a sustained acquisition arc rather than a value inferred from the workplace premise. It meets the Dictionary's moderate `서서히 성장` anchor. |
| `progression=4` | **REJECT** | The official descriptions do not expose repeated mastery levels or recurring growth/acquisition rewards across the entry range. One complete backstory arc cannot support the `4` anchor. |
| `strategy`, `mysteryReveal` | `UNKNOWN` | Vocational training is not long-range tactical/resource planning, and the past episode is not a clue-to-reveal reward. No unrelated gap is filled to satisfy coverage. |

Confidence `0.76` is retained from the proposal because the official description directly exposes the complete acquisition arc, while the evidence remains a product synopsis rather than a page-indexed event ledger.

## Terminal mutation and integrity

- Terminal CSV before SHA-256: `863050365637a4cce32c1b7cd368de0d8f17275511d552282d24204ce80ead81`.
- Terminal CSV after SHA-256: `0baabb3833eb2c4551eac5b97a8211b773d9bb59a1073c5b2bebc4622cd21c60`.
- Exact mutation: `work-39c1a2b6791238827ed5,progression,unknown,,` → `known,2,0.76`; evidence ID preserved.
- Reverse-substitution SHA-256: `863050365637a4cce32c1b7cd368de0d8f17275511d552282d24204ce80ead81`; equals the pre-mutation hash: **PASS**.
- Structure: `170` data rows, `10` work IDs, `17` unique axes per work, unchanged six-column header and row order: **PASS**.
- Genre terminal SHA-256 remains `05c7f1678e6089dbcc7a2076a96157bae0fc3702028a4e482b1f80f43f44cfc9`.
- Theme terminal SHA-256 remains `bb5a08ec02e6b06399086de9c27b5eb3ef944a5d62c29c45daef89478cf107ac`.
- Art terminal SHA-256 remains `f2a9deaed403d6f90e10404043a2e805a29c21c356a2c7856f75b67ed17929e0`.

## Gate recomputation

Thresholds remain Genre `>=1`, Theme `>=1`, Narrative `>=4/6`, Tone `>=5/7`, and Art `>=3/4`.

| Gate | Before | After | Result |
|---|---:|---:|---|
| Genre | `1` | `1` | pass |
| Theme | `2` | `2` | pass |
| Narrative | `3/6` | `4/6` | **pass** |
| Tone | `5/7` | `5/7` | pass |
| Art | `3/4` | `3/4` | pass |

- Position 18 changes from text-gate fail (`N+1`) to all required coverage gates passing.
- Chunk 02 text-gate count changes from `3/10` to `4/10`, now positions `14, 17, 18, 20`.
- Current live Batch 004 text-gate snapshot changes from `9/50` to `10/50`; the after-set is positions `3, 14, 17, 18, 20, 21, 43, 44, 47, 49`.
- This coverage result does not authorize promotion or any Art/source/generated mutation.
