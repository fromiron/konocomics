# Pilot 001 annotation, review, and adjudication request

- Method policy: `promotion-evidence-v2`
- Candidate identity: read and echo `manifest.json.candidateSha256`.
- Scope: exact 50 frozen works, entry experience in volumes 1–3 or the first major episode.
- Local-file isolation: use only the packet manifest, ledger, packet source rows, the assigned research chunk, this request, the Factor Dictionary, and the annotation guide. Do not inspect existing Gold or library Factor·Theme·recommendation-context rows.

## Pass A — annotation

- Emit all 17 Axis states in dictionary order. Insufficient evidence is `unknown`, not zero.
- Assign Genre and Theme only from direct entry-scope evidence. Genre never determines an Axis value.
- Use official publisher or rights-holder descriptions first, followed by inspected official previews, official jury commentary, official bookseller or distributor descriptions, and reliable criticism or interviews.
- A short synopsis that does not establish recurrence or sustained experience cannot support a confident value.
- Keep selection provenance separate from Factor Evidence.

Required draft files per 10-work chunk:

- `factors.csv`: `workId,axisId,state,value,confidence,evidenceId`, exactly 10 × 17 rows.
- `genres.csv`: `workId,genres`, exactly 10 rows with canonical semicolon-ordered IDs.
- `themes.csv`: canonical Theme IDs, centrality 1 or 2, confidence, and evidence ID.
- `notes.md`: candidate SHA, isolation attestation, exact source URL for every known claim, every unknown limitation, uncertainty, and identity·safety conflict.

Pass A does not assign catalog role, recommendation context, eligibility, or promotion status.

## Art rule

First verify official-preview access, entry-scope edition mapping, at least six readable internal pages, and at least two scene contexts. Only qualifying works receive temporary page samples and visual judgment. `motionImpact=known` additionally requires an exact continuous-action start and end reference.

If any prerequisite fails, record official URL, edition, attempted scope, sample count, context count, and limitation, then close the affected Art axis as `unknown`. A cover, animation frame, synopsis, or user art opinion cannot support a known Art value. Temporary images are not committed; preserve only official URL, edition, references, counts, contexts, and SHA-256.

## Supplemental user-review pass

After the official-text draft, collect multiple independent user reviews only for text Factors where an additional entry-scope check is useful. Record source name, URL, published date or year, retrieval date, independence rationale, reading scope, and the repeated concrete observation.

Permitted supplemental claims are pacing, comedy, emotional warmth, mental stress, darkness, romance, relationship structure, character-arc weight, and recurring entry structure. Exclude single opinions, copied reviews, list membership, bare ratings or ranks, unread reactions, and vague likes or dislikes. Agreement with official evidence may raise secondary confidence; conflict goes to adjudication or `unknown`. User reviews never establish Art values and their text is never copied into UI explanations.

## Pass B — independent review

The reviewer must inspect the same frozen Evidence without reading Pass A conclusions, then independently check Factor Dictionary fit, Genre·Theme confusion, centrality inflation, extreme values, entry-scope drift, safety, identity, representative ISBN, series relation, and evidence-to-claim correspondence. Cursor Grok 4.6 High non-fast abstains from Art unless a future capability test proves direct pixel access.

## Pass C — adjudication

Do not average or decide by vote count. Resolve disagreements using the Factor Dictionary, direct evidence authority, edition mapping, and entry-scope fit. Choose a supported value, downgrade to `unknown`, request narrow additional research, approve `recommendationVerified`, or record a permitted hard blocker. Art sample shortage alone resolves to `unknown`, not blocker or pending.

Before declaring `SOURCE_INFORMATION_UNAVAILABLE`, calculate the unchanged Genre, Theme, Narrative, Tone, and Art coverage gates. If a gate is short and unused official volume descriptions, inspected entry pages, or eligible independent reviews still exist, return a narrow research request for the specific axes instead of a blocker. A blocker is allowed only after that reproducible recheck is exhausted.

## Panel availability

- Local Codex subagent + Gemini 3.7 Flash High: Art minimum quorum after direct-pixel capability proof.
- Cursor Grok 4.6 High non-fast: non-Art reviewer; Art abstention currently required.
- Muse Spark 1.2 xhigh: optional only when model identity, clean completion, full input access, complete output, and absence of rate-limit, timeout, or degraded output are all verified. Record exclusion per batch and never silently substitute another model.
