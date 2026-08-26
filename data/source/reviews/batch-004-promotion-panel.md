# Batch 004 partial promotion panel

PROMOTION AUTHORIZATION: YES
HUMAN VALIDATION: NOT_RUN
REVIEWED BY HUMAN: false
COMMUNITY/IMAGE POLICY: promotion-evidence-v3
ART EVIDENCE ROUTE: OPTIONAL — COMMUNITY OR IMAGE
MUSE: NOT_USED
RECOMMENDATION VERIFIED: 12
HARD BLOCKERS: 1
PENDING: 37
FROZEN WORK SET SHA-256: a07a3bd053ce3edb79bdd5803ea3f04dbf8ceac4fd422d84ca97432ba75f68a1

## Scope and decision

- Batch: `batch-004`, frozen 50-work set.
- Apply only the 12 verified works and the exact position-42 compound blocker. Keep the other 37 works pending and byte-identical in source and registry state.
- Verified positions: `3, 14, 17, 18, 20, 21, 24, 41, 43, 44, 47, 49`.
- Blocked position: `42`, with `FACTOR_MODEL_INCOMPATIBLE;SOURCE_INFORMATION_UNAVAILABLE` in the independently adjudicated order.
- Human validation was not run. All new evidence remains `reviewedByHuman=false`.
- Luna Max independently checked official promotion/product pages, Japanese community evidence, and Korean discovery routes using official or common Korean titles and recorded Korean spelling variants. Only bounded, repeated evidence was accepted; community absence was not converted into a blocker.
- Position 24 reached the required text coverage after two independent Japanese reviews supported `strategy=2`; image analysis was not required.
- Korean and cross-layer adjudication accepted position 25 `progression=2` and position 29 `mysteryReveal=2`. Both works remain below the complete promotion gate, stay pending, and are not written into product source rows.
- Position 15 remains pending after Korean-title and Japanese review rechecks left Narrative at `3/6`.
- Gold 150, Factor Dictionary values, recommendation math, frozen identities, and the 37 unresolved works remain unchanged. Art is an optional peer evidence route; unknown Art remains neutral-shrunk in scoring.

## Immutable binding

- Final overlay validation SHA-256: `bc9c60a448deda934b265e72ef40b3dfc24859c37f71354444298cc728d7a97f`.
- Combined input/review packet SHA-256: `5d402f3e73986ccb36bc7c98bc201805b34573336b11108a8e9cf41bbf0c6505`.
- The source application must validate the candidate tree and publish affected directories atomically without changing pending works.
