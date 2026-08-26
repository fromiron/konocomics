# Batch 005 partial promotion panel

PROMOTION AUTHORIZATION: YES
HUMAN VALIDATION: NOT_RUN
REVIEWED BY HUMAN: false
LOCAL ART QUORUM: PASS
GEMINI ART QUORUM: PASS — gemini-3.7-flash-high
GROK ART: ABSTAIN
MUSE: NOT_USED
RECOMMENDATION VERIFIED: 9
HARD BLOCKERS: 4
PENDING: 37
FROZEN WORK SET SHA-256: ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8

## Scope and decision

- Batch: `batch-005`, frozen 50-work set.
- Apply only 9 verified works and 4 exact independently authorized blockers. Keep the other 37 works pending and byte-identical in source and registry state.
- Verified positions: `4, 8, 23, 26, 27, 30, 35, 45, 47`.
- Blocked positions: `29, 36, 39, 46`; position 46 uses the exact frozen Work ID and `FACTOR_MODEL_INCOMPATIBLE`, not the orphan ID from the superseded row.
- Position 08 `romance=2` is supported by the exact official volume-3 trial and two independent exact-volume Japanese reviews; value 4 and unsupported Korean community extrapolation were rejected.
- Human validation was not run. All new evidence remains `reviewedByHuman=false`.
- Gold 150, Factor Dictionary, unknown/coverage rules, recommendation math, frozen identities, and the 37 unresolved works remain unchanged.

## Immutable binding

- Final overlay validation SHA-256: `e5c0b43380b9ff041e1d17fc3abf2662ba03b2ad323cba5e20f7e52cf6c9439b`.
- Combined input/review packet SHA-256: `2f6e6ee4ba92ce93bc1a558aa2440581dc601e252233e53a10b80d747514880b`.
- The source application must validate the candidate tree and publish affected directories atomically without changing pending works.
