# Batch 004 annotation, review, and adjudication request

- Method policy: `promotion-evidence-v2`
- Candidate identity: read and echo the frozen Batch 004 manifest SHA-256 once the packet is built.
- Scope: the exact 50 frozen works in `selection-report.md`, limited to volumes 1–3 or the first major episode.
- Isolation: use only the frozen batch packet, assigned research chunk, this request, the Factor Dictionary, and the annotation guide. Do not inspect Gold or another work's Factor·Theme·recommendation-context rows.
- Canonical titles must not include decorative `『` or `』` delimiters.

## Pass A — annotation

- Emit all 17 Axis states in dictionary order. Insufficient evidence is `unknown`, not zero.
- Assign Genre and Theme only from direct entry-scope evidence. Genre never determines an Axis value.
- Use official publisher or rights-holder descriptions first, followed by inspected official previews, official jury commentary, official bookseller or distributor descriptions, and reliable criticism or interviews.
- A short synopsis that does not establish recurrence or sustained experience cannot support a confident value.
- Keep selection provenance separate from Factor Evidence.

Per 10-work chunk, produce the existing validated `factors.csv`, `genres.csv`, `themes.csv`, and `notes.md` shapes. Pass A does not assign catalog role, recommendation context, eligibility, or promotion status.

## Art state closure

Verify official-preview access, entry-scope edition mapping, at least six readable internal pages, and at least two scene contexts before any static Art value. `motionImpact=known` additionally requires exact continuous-action start, development or impact, and endpoint references.

If a prerequisite fails, record official URL, edition, attempted scope, page and context counts, and limitation, then close the affected Art axes as `unknown`. Art `unknown` is not a low value and is not itself a blocker. A cover, animation frame, synopsis, or user art opinion cannot support a known Art value. Do not commit temporary images; retain official URL, edition, page references, counts, contexts, and SHA-256 only.

## Supplemental user reviews

After the official-text draft, use multiple independent user reviews only as supplemental evidence for concrete entry-scope observations about pacing, comedy, emotional warmth, mental stress, darkness, romance, relationship structure, character-arc weight, or recurring structure. Record source name, URL, published date or year, retrieval date, independence rationale, reading scope, and repeated claim.

Exclude single opinions, copied reviews, list membership, bare ratings or ranks, unread reactions, and vague likes or dislikes. Agreement may raise secondary confidence; conflict goes to adjudication or `unknown`. User reviews never establish Art values, and their prose is never copied into UI explanations.

## Pass B — independent review

The reviewer inspects the same frozen Evidence without inheriting Pass A conclusions. Independently check the Factor Dictionary, Genre·Theme separation, centrality inflation, extremes, entry-scope drift, identity, safety, representative ISBN, series relation, and evidence-to-claim correspondence. Cursor Grok 4.6 High non-fast handles non-Art review and abstains from Art without proven pixel access.

## Pass C — adjudication

Do not average or decide by vote count. Resolve disagreement from the Factor Dictionary, source authority, edition mapping, and scope fit. Adopt a supported value, downgrade to `unknown`, request narrow additional research, approve promotion, or record a permitted hard blocker. Art sample shortage alone closes as `unknown`, not blocker or pending.

Before `SOURCE_INFORMATION_UNAVAILABLE`, calculate the unchanged Genre, Theme, Narrative, Tone, and Art coverage gates. If an unused qualifying official source or eligible independent review remains, request that narrow evidence rather than declaring a blocker.

## Panel availability

- Local Codex subagent + Gemini 3.7 Flash High: Art minimum quorum after direct-pixel capability proof.
- Cursor Grok 4.6 High non-fast: non-Art reviewer; Art abstention required without pixel proof.
- Muse Spark 1.2 xhigh: optional only with exact identity, clean completion, full input access, complete output, and no rate-limit, timeout, or degraded output. Record exclusion and never substitute silently.
- Model-panel review is not human validation; preserve `reviewedByHuman=false`.
