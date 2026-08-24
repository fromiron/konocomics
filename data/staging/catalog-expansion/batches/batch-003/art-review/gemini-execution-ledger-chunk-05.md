# Batch 003 chunk 05 Gemini execution ledger

- executionDate: 2026-08-24
- requestedModel: `gemini-3.7-flash-high`
- resolvedModel: `gemini-3.7-flash-high`
- effort: `high`
- mode: read-only review
- outerStatus: `SUCCESS`
- conversationId: `e37deca0-a3a7-48f0-9e97-149af92a96c3`
- reviewedByHuman: `false`
- exactPayloadRootIdentity: `f2ba151d70f0d565c6bdd18f24f7e49c899a37c00ff6c18317ecd4e859b4650c`
- payloadImages: `18`
- payloadImageHashMatches: `18`
- frozenInputHashMatches: `6`
- museStatus: `NOT_USED`
- grokArtStatus: `ART_ABSTAIN`
- repositoryEditsByReviewer: `false`

The first invocation was rejected by the wrapper before model execution because
the prompt was passed as a positional argument after `--print`. It is excluded.
The corrected invocation attached the prompt to `--print`, resolved the exact
requested model, opened all frozen inputs and payloads, and returned the complete
required response normally. A later same-conversation read-only turn only
re-emitted the response for durable capture and did not change its judgments.

No temporary path or image is part of the durable evidence contract. The
preflight ledger and request preserve official URLs, edition bridges, page refs,
counts, contexts, and SHA-256 values.
