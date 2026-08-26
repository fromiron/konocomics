# Batch 004 partial promotion panel

PROMOTION AUTHORIZATION: YES
HUMAN VALIDATION: NOT_RUN
REVIEWED BY HUMAN: false
LOCAL ART QUORUM: PASS
GEMINI ART QUORUM: PASS — gemini-3.7-flash-high
GROK ART: ABSTAIN
MUSE: NOT_USED
RECOMMENDATION VERIFIED: 11
HARD BLOCKERS: 1
PENDING: 38
FROZEN WORK SET SHA-256: a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1

## Scope and decision

- Batch: `batch-004`, frozen 50-work set.
- Apply only the 11 verified works and the exact position-42 compound blocker. Keep the other 38 works pending and byte-identical in source and registry state.
- Verified positions: `3, 14, 17, 18, 20, 21, 41, 43, 44, 47, 49`.
- Blocked position: `42`, with `FACTOR_MODEL_INCOMPATIBLE;SOURCE_INFORMATION_UNAVAILABLE` in the independently adjudicated order.
- Human validation was not run. All new evidence remains `reviewedByHuman=false`.
- Luna Max independently checked official promotion/product pages, Japanese community evidence, and Korean discovery routes. Only bounded, repeated evidence was accepted; community absence was not converted into a blocker.
- Gold 150, Factor Dictionary, unknown/coverage rules, recommendation math, frozen identities, and the 38 unresolved works remain unchanged.

## Immutable binding

- Final overlay validation SHA-256: `c6d9ca0e2dd7a5ef9016016a2d930cb61be617a5954a0b4ac81d5eafd52bd618`.
- Combined input/review packet SHA-256: `0dcdfce37fdec5e4eb9c84e49bdd3123a287f84150c47e8f992971fae95c23e8`.
- The source application must validate the candidate tree and publish affected directories atomically without changing pending works.
