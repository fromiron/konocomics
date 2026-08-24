# Pilot 001 promotion panel

PROMOTION AUTHORIZATION: YES
HUMAN VALIDATION: NOT_RUN
LOCAL ART QUORUM: PASS
GEMINI ART QUORUM: PASS — gemini-3.7-flash-high
GROK ART: ABSTAIN
MUSE: NOT_USED
HARD BLOCKERS: 0
CANDIDATE SHA-256: aaf4f4a4845ec105b8218f0f9e8358a2ae95c5823519e68e1752acada6e22529

## Scope and decision

- Batch: `pilot-001`, frozen 50-work set.
- Decision: all 50 works may transition from `libraryOnly` to `recommendationVerified`.
- Human review was not run. Every new Evidence row remains `reviewedByHuman=false`; model-panel approval is not represented as human validation.
- Gold 150, Factor Dictionary, unknown/coverage contract, recommendation math, validator strength, safety gate, and identity gate remain unchanged.

## Final data

- Factor: 850 rows in frozen work order × current 17-axis order.
- Known/unknown: 637 / 213; no pending state.
- Text axes: 474 known / 176 unknown.
- Art axes: 163 known / 37 unknown.
- Genre: at least one per work.
- Theme: 78 rows and at least one per work.
- Evidence: 250 unique URL-backed rows; 50 text and 200 Art.
- Recommendation context: 50 rows; Anchor 12, Bridge 14, Discovery 24.
- Coverage: 50/50 pass for Genre, Theme, Narrative, Tone, and Art.
- Safety, canonical identity, representative ISBN or existing explicit exception, source provenance, series grouping, catalog role, and both eligibility flags: pass.
- Unresolved adjudication: 0. Promotion blocker: 0.

## Reviewer provenance

- Local Codex performed official-source annotation, Art page inspection, Pass C adjudication, and final byte/schema audit.
- Gemini authorizing Art runs used exact model `gemini-3.7-flash-high`, effort `high`, proved access to the cited pixels, completed normally, and showed no counted rate-limit, timeout, incomplete, or degraded-output signal. Failed attempts remain in the ledger but contribute no value.
- Cursor Grok used `cursor-grok-4.6-high`, non-fast mode, for current-SHA text Factor, Theme, identity, and safety review across chunks 01–05. It had no proved pixel access and therefore abstained from all Art judgments.
- Muse Spark 1.2 xhigh was not invoked; no substitute is recorded under its identity.
- Model disagreements were resolved against the Factor Dictionary, official evidence, edition mapping, and entry-range scope. Values were not averaged and no majority vote was used.

## Art policy result

Static Art known values require an official entry-volume or first-episode preview, edition mapping, at least six readable internal pages, and at least two scene contexts. `motionImpact=known` additionally requires exact bounded start, development/impact, and endpoint references. The 37 unresolved motion claims terminate as `unknown`, not a low value and not a blocker. Temporary image files are not committed; the manifest and review ledger retain URL, edition, page reference, sample count, contexts, limitation, and sampled-file SHA-256 provenance.

## Canonical and source integrity

- Target titles contain no decorative `『』` or `』` delimiters.
- Final standalone and combined matrices use the frozen Pilot work order.
- Source promotion may replace only the 50 approved Work/factor rows and add the approved Theme, Evidence, Art manifest, recommendation context, and review report rows.
- Existing non-target CSV record bytes and the frozen Gold manifest must remain unchanged.
- Approval bindings, current-SHA model-review bindings, exact-applied verification, and publish-directory snapshots are mandatory before write.
