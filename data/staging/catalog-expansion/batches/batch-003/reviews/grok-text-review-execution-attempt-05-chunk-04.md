# Batch 003 chunk 04 Cursor Grok excluded attempt 05

- executionDate: 2026-08-23
- recordedAt: `2026-08-23T13:39:34+09:00`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- mode: non-fast, read-only `plan`
- sandbox: enabled
- exitCode: `0`
- outerType: `result`
- outerSubtype: `success`
- outerIsError: `false`
- durationMs: `640140`
- durationApiMs: `640140`
- sessionId: `d1c9ece6-98d0-4b35-a083-2a63281d1312`
- requestId: `b7e56148-b559-4191-a80f-a6e98a44f657`
- inputTokens: `96105`
- outputTokens: `45399`
- cacheReadTokens: `105984`
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
| `grok-text-review-outer-attempt-05-chunk-04.json` | `bfedf17f15d4f9dbf5e896d061d69f888507161151ec7ec4af8157da47ef72d0` |
| `grok-text-review-response-attempt-05-chunk-04.txt` | `dbd8941d293b0a71b67387b2b274e347b743815bce04807597dae60c6d47398a` |

## Exclusion reason

The exact non-fast model process exited normally with a successful outer
envelope, but the final `result` contained only four progress sentences (`239`
JavaScript characters; `537` UTF-8 bytes). It ended by stating that it was
submitting the required 10-section document, but the document was absent.

The response therefore had no 10-work matrix, Genre table, Theme table,
identity/safety/ISBN rows, outcomes, full hash echo, completeness marker, or
usable `ART_ABSTAIN` attestation. Token usage cannot replace the missing final
response. Nothing from this attempt is accepted as Pass B evidence, compared,
adjudicated, or promoted. The next attempt uses the same exact model, request,
and frozen inputs; no alternate reviewer is substituted.
