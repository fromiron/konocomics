# Batch 003 chunk 04 Cursor Grok excluded attempt 01

- executionDate: 2026-08-23
- recordedAt: `2026-08-23T12:47:32+09:00`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- mode: non-fast, read-only `plan`
- sandbox: enabled
- exitCode: `0`
- outerType: `result`
- outerSubtype: `success`
- outerIsError: `false`
- durationMs: `940989`
- durationApiMs: `940989`
- sessionId: `0cab8be6-7d51-4203-b9f0-ece65d9b3c43`
- requestId: `5e07cd7c-d8d4-4204-8939-78ffcf0a94a0`
- inputTokens: `76`
- outputTokens: `20899`
- cacheReadTokens: `86784`
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
| `grok-text-review-outer-attempt-01-chunk-04.json` | `e9550acaeb34df145b905430a4a47cff9a14dc0252fb19cbe4f1e2568cae2494` |
| `grok-text-review-response-attempt-01-chunk-04.txt` | `f45352f959d1cea4ba97c96d59c6c2b37532bb1a2c0bea1e78ce199514836b83` |

## Exclusion reason

The exact model process stayed alive during the long no-output interval. At
approximately `302` seconds, process `403007` was observed in state `Ssl` with
the expected `cursor-grok-4.6-high` command line. At approximately 10 minutes,
the CLI reported a lost connection and automatic reconnect attempt 1 while
keeping the same process and session. The run later exited normally and returned
a successful outer envelope, but the final `result` contained only five progress
sentences (`266` JavaScript characters; `599` UTF-8 bytes). It ended by stating
that it was writing the required review document, but the document was absent.

The response therefore had no 10-work matrix, Genre table, Theme table,
identity/safety/ISBN rows, outcomes, full hash echo, completeness marker, or
usable `ART_ABSTAIN` attestation. Token usage cannot replace the missing final
response. Nothing from this attempt is accepted as Pass B evidence, compared,
adjudicated, or promoted. The next attempt must use the same exact model,
request, and frozen inputs; no alternate reviewer is substituted.
