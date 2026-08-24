# Batch 003 promotion panel

PROMOTION AUTHORIZATION: YES
HUMAN VALIDATION: NOT_RUN
REVIEWED BY HUMAN: false
LOCAL ART QUORUM: PASS
GEMINI ART QUORUM: PASS — gemini-3.7-flash-high
GROK ART: ABSTAIN
MUSE: NOT_USED
RECOMMENDATION VERIFIED: 11
HARD BLOCKERS: 39
FROZEN WORK SET SHA-256: ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd

## Scope and decision

- Batch: `batch-003`, frozen 50-work set.
- Decision: 11 works may transition from `libraryOnly` to `recommendationVerified`; 39 works terminate as `promotionBlocked` with `SOURCE_INFORMATION_UNAVAILABLE`, exact deficiencies, evidence, and a recheck path.
- Human review was not run. Every new Evidence row remains `reviewedByHuman=false`; model-panel approval is not human validation.
- Gold 150, Factor Dictionary, unknown/coverage contract, recommendation math, validator strength, safety gate, and identity gate remain unchanged.

## Final overlay

- Factor: 187 rows in frozen work order and current 17-axis order; 145 known and 42 unknown.
- Text: 111 known and 32 unknown. Art: 34 known and 10 unknown.
- Theme: 17 rows. Evidence: 55 URL-backed rows, comprising 11 text packets and 44 axis-specific Art records.
- Recommendation context: 11 rows; Anchor 5, Bridge 3, Discovery 3.
- Promotion gate: 11/11 pass Genre, Theme, Narrative, Tone, Art, identity, safety, representative ISBN, Evidence, review, context, and eligibility requirements.
- Terminal state: 11 `recommendationVerified`, 39 `promotionBlocked`, 0 pending or unresolved adjudication in this frozen batch.

## Reviewer provenance

- Local Codex performed official-first annotation coordination, direct Art-page inspection, Pass C adjudication, and final byte/schema audit.
- Gemini authorizing Art runs used exact model `gemini-3.7-flash-high`, effort `high`, proved access to the cited pixels and hashes, and completed without a counted rate-limit, timeout, incomplete, or degraded-output signal. Failed attempts remain excluded in the execution ledgers.
- Cursor Grok used `cursor-grok-4.6-high`, non-fast mode, for non-Art Factor, Theme, identity, and safety review. It did not prove pixel access and abstained from Art.
- Daybreak Blue independently verified the disputed recovery samples and their hashes. It was supplemental and was not presented as human validation.
- Muse Spark 1.2 xhigh was not used and no model was silently substituted for it.
- The ChatGPT Oracle review of the signal policy is retained under Batch 003 reviews; it did not replace the work-level Local/Gemini/Grok panel.
- Differences were resolved from the Factor Dictionary, official evidence, edition mapping, and entry-range scope; values were neither averaged nor decided by vote count.

## Art closure

Static Art values require an edition-mapped official internal preview, at least six readable body pages, and at least two materially distinct scene contexts. `motionImpact=known` additionally requires an exact bounded sequence. Below-threshold states close as `unknown`, never as a low value. Art shortage becomes part of a blocker only where the unchanged Art coverage gate remains below 0.30 after finite official routes are exhausted. Temporary images and paths are not committed; the final manifest retains official provenance, page references, counts, contexts, limitations, and SHA-256 values.

Recovery A/C closed four accepted samples without voting or averaging. Position 48 `artDensity=4` passed an explicit endpoint audit. Positions 45 and 46 remain Art-unknown after independent edition and scene-gate review; their text data passes, but their unchanged Art coverage remains 0/4, so they terminate with the same reproducible blocker as every other gate failure.

## Blocked works

The 39 blocked positions are 2, 3, 5, 7, 9, 11, 12, 13, 14, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 48, and 49. `promotion-blockers-final.csv` records exact failed coverage groups and the evidence needed for deterministic re-evaluation. No unsupported value, Genre, or Theme was invented to clear a gate.

## Immutable binding

- Final overlay validation SHA-256: `e7a4f8ef3c5f52a2d43d59f36a488870075f1ae7afbf1382cc3837fb027117f8`.
- Combined input/review packet SHA-256: `f4f08de2b64f307247b140ef10810a100bb07e05bd42593130818edf00158bff`.
- The validation document binds every promoted source overlay and blocker ledger by SHA-256.
- Source application must preserve every non-target CSV row and the frozen Gold manifest, validate the candidate tree, then publish all affected directories atomically.
