# Batch 002 promotion panel

PROMOTION AUTHORIZATION: YES
HUMAN VALIDATION: NOT_RUN
REVIEWED BY HUMAN: false
LOCAL ART QUORUM: PASS
GEMINI ART QUORUM: PASS — gemini-3.7-flash-high
GROK ART: ABSTAIN
MUSE: NOT_USED
RECOMMENDATION VERIFIED: 33
HARD BLOCKERS: 17
FROZEN WORK SET SHA-256: 80888903a34792a5b079d153c86493bc0263cb56bf5bb5a0c0528dd309cf61f6

## Scope and decision

- Batch: `batch-002`, frozen 50-work set.
- Decision: 33 works may transition from `libraryOnly` to `recommendationVerified`; 17 works terminate as `promotionBlocked` with `SOURCE_INFORMATION_UNAVAILABLE`, exact deficiencies, evidence, and a recheck path.
- Human review was not run. Every new Evidence row remains `reviewedByHuman=false`; model-panel approval is not human validation.
- Gold 150, Factor Dictionary, unknown/coverage contract, recommendation math, validator strength, safety gate, and identity gate remain unchanged.

## Final overlay

- Factor: 561 rows in frozen work order and current 17-axis order; 412 known and 149 unknown.
- Text: 309 known and 120 unknown. Art: 103 known and 29 unknown.
- Theme: 66 rows. Evidence: 165 URL-backed rows, comprising 33 text packets and 132 axis-specific Art records.
- Recommendation context: 33 rows; Anchor 14, Bridge 15, Discovery 4.
- Promotion gate: 33/33 pass Genre, Theme, Narrative, Tone, Art, identity, safety, representative ISBN, Evidence, review, context, and eligibility requirements.
- Terminal state: 33 `recommendationVerified`, 17 `promotionBlocked`, 0 pending or unresolved adjudication.

## Reviewer provenance

- Local Codex performed official-first annotation, direct Art-page inspection, independent review coordination, Pass C adjudication, and final byte/schema audit.
- Gemini authorizing Art runs used exact model `gemini-3.7-flash-high`, effort `high`, proved access to the cited pixels and hashes, and completed without a counted rate-limit, timeout, incomplete, or degraded-output signal. Failed attempts remain excluded in the execution ledgers.
- Cursor Grok used `cursor-grok-4.6-high`, non-fast mode, for non-Art Factor, Theme, identity, and safety review. It did not prove pixel access and abstained from Art.
- Muse Spark 1.2 xhigh was not used and no model was silently substituted for it.
- Differences were resolved from the Factor Dictionary, official evidence, edition mapping, and entry-range scope; values were neither averaged nor decided by vote count.

## Art closure

Static Art values require an edition-mapped official internal preview, at least six readable pages, and at least two scene contexts. `motionImpact=known` additionally requires an exact bounded sequence. Below-threshold states close as `unknown`, never as a low value. Art shortage becomes part of a blocker only where the unchanged Art coverage gate remains below 0.30 after the finite official route is exhausted. Temporary images and paths are not committed; the final manifest retains only official provenance, page references, counts, contexts, limitations, and SHA-256 values.

## Blocked works

The 17 blocked positions are 1, 5, 7, 8, 11, 14, 16, 19, 21, 23, 27, 30, 31, 34, 47, 49, and 50. `promotion-blockers-final.csv` records the exact failed coverage groups and the evidence needed for deterministic re-evaluation. No unsupported value, Genre, or Theme was invented to clear a gate.

## Immutable binding

- Final overlay validation SHA-256: `ea34b2459e967ba27129e0e7522dadfcbb8830a5cb1a90f5af3c2337f0d9432e`.
- Combined input/review packet SHA-256: `3852eea86b876b9231d549cf044e99a9a396b6adb6c1bd8d9b0ccd9be1e71e2f`.
- The validation document binds every promoted source overlay and blocker ledger by SHA-256.
- Source application must preserve every non-target CSV row and the frozen Gold manifest, validate the candidate tree, then publish all affected directories atomically.
