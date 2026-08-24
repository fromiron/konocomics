# Batch 003 chunk 02 Cursor Grok execution ledger

- executionDate: 2026-08-23
- completedAt: `2026-08-23T12:00:18+09:00`
- acceptedAttempt: `02`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- resolvedModelAttestation: Cursor Grok 4.6 High
- mode: non-fast, read-only `plan`
- sandbox: enabled
- outerType: `result`
- outerSubtype: `success`
- outerIsError: `false`
- exitCode: `0`
- durationMs: `689320`
- durationApiMs: `689320`
- sessionId: `b4114da5-57af-41ae-afcf-822c30888083`
- requestId: `af6f01b9-ed2e-48ca-a8c6-46dd4ff86a82`
- inputTokens: `99330`
- outputTokens: `43072`
- cacheReadTokens: `113152`
- cacheWriteTokens: `0`
- reviewedByHuman: `false`
- artAccess: `ART_ABSTAIN`; pixel access was not established
- museStatus: `NOT_USED`; the optional reviewer was not substituted
- oxStatus: `EXCLUDED`; the user removed Ox from the panel

## Invocation

The accepted read-only run used this exact CLI boundary:

```text
agent --print --output-format json --mode plan --sandbox enabled --trust \
  --workspace /home/bell/Toys/konocomics \
  --model cursor-grok-4.6-high
```

The model ID was explicit and was not a `-fast` variant. The outer JSON does
not expose a separate model field; model provenance is preserved by the exact
invocation and the response's `cursor-grok-4.6-high` / Cursor Grok 4.6 High
execution attestation. No other model was invoked or silently substituted.

## Attempt boundary

Attempt 01 returned a successful outer envelope but omitted the required final
document. Its immutable outer JSON, short response, and exclusion ledger remain
bound under `attempt-01` names. No conclusion or token stream from that attempt
was salvaged, merged, compared, adjudicated, or promoted. Attempt 02 independently
read the same request and exact nine frozen inputs and is the only accepted
chunk-02 Pass B response.

## Long-running process observation

- The accepted CLI emitted no incremental stdout for more than 60 seconds; this
  was not treated as a failure or timeout.
- The wrapper kept the session open for `23` polling intervals and did not
  interrupt it.
- At approximately `431` seconds, process `283685` was observed alive in state
  `Ssl` with the exact `cursor-grok-4.6-high` command line.
- The process returned the complete outer JSON normally at `689320` ms.
- The wrapper wrote the immutable outer JSON and extracted response only after
  the successful exit and completeness-marker check. The Cursor reviewer itself
  made no repository edits.

## Bound outputs

| path | SHA-256 |
| --- | --- |
| `grok-text-review-request-chunk-02.md` | `29e05a2f50629eefc0e25e54f4a81d068c66caf731783465fb83cc983e405d31` |
| `grok-text-review-outer-chunk-02.json` | `0ca3a300fb5382389238a0a3dc84ba9f2db80fb4c56e6c087dd3fd516fd729f3` |
| `grok-text-review-response-chunk-02.txt` | `0f2eae1459c63e6f39010b5e824700c62268a94b8e4ba8434d2d9b50a0a14eaf` |
| `grok-text-review-execution-attempt-01-chunk-02.md` | `dcebad1821b539aeb9c9b7c551d5a436e8f93ea7872f4eece1bdc46e12f38cc5` |

The accepted response file is the complete `result` string from the successful
attempt-02 outer JSON. It was not reconstructed from hidden token output or the
excluded attempt.

## Validation

- All nine request-bound input hashes were recomputed locally after completion
  and still matched the frozen request and the hashes echoed by the reviewer.
- Independent matrix: `10` works, `13` non-Art Axis cells per work, frozen
  positions 11–20 in order.
- Genre table: `10` rows using only the dictionary's Genre IDs.
- Theme table: `10` rows using only the dictionary's Theme IDs and centrality
  `1` or `2`.
- Pass A comparison: all `10` works, `49` direct frozen-packet URL occurrences.
- Identity/safety/representative-ISBN table: `10` complete rows.
- Review outcome table: `10` complete rows using only the allowed outcomes.
- Canonical-title cells containing decorative `『` or `』`: `0`.
- `BUTTER！！！` retained its three meaningful full-width exclamation marks.
- Named Art axes judged or compared: `0`; the response includes the required
  `ART_ABSTAIN` attestation and completeness marker.

These conclusions remain independent Pass B proposals. They do not adjudicate
Pass A disagreements, authorize promotion, or alter source, generated, Gold,
registry, eligibility, recommendation, safety, or Art data.
