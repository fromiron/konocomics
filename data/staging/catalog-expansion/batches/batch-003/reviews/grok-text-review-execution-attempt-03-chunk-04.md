# Batch 003 chunk 04 Cursor Grok excluded attempt 03

- executionDate: 2026-08-23
- recordedAt: `2026-08-23T13:15:19+09:00`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- mode: non-fast, read-only `plan`
- sandbox: enabled
- exitCode: `0`
- outerType: `result`
- outerSubtype: `success`
- outerIsError: `false`
- durationMs: `707142`
- durationApiMs: `707142`
- sessionId: `3085e2d5-5b72-44f5-ab06-60be53728032`
- requestId: `42846148-76d2-4857-b5c5-981c5c53ef01`
- inputTokens: `184575`
- outputTokens: `42848`
- cacheReadTokens: `8064`
- cacheWriteTokens: `0`
- reviewedByHuman: `false`
- artAccess: `ART_ABSTAIN`
- museStatus: `NOT_USED`
- oxStatus: `EXCLUDED`
- disposition: `EXCLUDED_INCOMPLETE_RESPONSE`

## Bound files

| path | SHA-256 |
| --- | --- |
| `grok-text-review-request-chunk-04.md` | `5e36de8759e0e69200b2d686279e378d4cd967d85d908825745fbcb683b6a68d` |
| `grok-text-review-outer-attempt-03-chunk-04.json` | `741313509136154e42fbc9978aaf38f316b52520aacdce3532ff3248e2a76e56` |
| `grok-text-review-response-attempt-03-chunk-04.txt` | `a4ccd142625d3025c595ef1bff6c53e9ce1935d4d8b901d4bdf6921d8f2b7eba` |

## Exclusion reason

The exact non-fast model process stayed alive and exited normally with a
successful outer envelope, but the final `result` contained only four progress
sentences (`187` JavaScript characters; `433` UTF-8 bytes). It ended by stating
that it was submitting the review document, but the required Markdown was
absent.

The response therefore had no 10-work matrix, Genre table, Theme table,
identity/safety/ISBN rows, outcomes, full hash echo, completeness marker, or
usable `ART_ABSTAIN` attestation. Token usage cannot replace the missing final
response. Nothing from this attempt is accepted as Pass B evidence, compared,
adjudicated, or promoted. The next attempt must use the same exact model,
request, and frozen inputs; no alternate reviewer is substituted.
