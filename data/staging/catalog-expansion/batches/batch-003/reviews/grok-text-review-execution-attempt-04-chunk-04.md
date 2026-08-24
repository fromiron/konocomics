# Batch 003 chunk 04 Cursor Grok excluded attempt 04

- executionDate: 2026-08-23
- recordedAt: `2026-08-23T13:31:22+09:00`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- mode: non-fast, read-only `plan`
- sandbox: enabled
- exitCode: `0`
- outerType: `result`
- outerSubtype: `success`
- outerIsError: `false`
- durationMs: `713452`
- durationApiMs: `713452`
- sessionId: `d945fcf3-434f-4412-b409-bceaaf829ce8`
- requestId: `d3fd8e59-cbfa-45fd-9c3e-e72ad6c18b1c`
- inputTokens: `115948`
- outputTokens: `45155`
- cacheReadTokens: `109184`
- cacheWriteTokens: `0`
- reviewedByHuman: `false`
- artAccess: `ART_ABSTAIN`
- museStatus: `NOT_USED`
- oxStatus: `EXCLUDED`
- disposition: `EXCLUDED_CONTRACT_NONCOMPLIANT`

## Bound files

| path | SHA-256 |
| --- | --- |
| `grok-text-review-request-chunk-04.md` | `5e36de8759e0e69200b2d686279e378d4cd967d85d908825745fbcb683b6a68d` |
| `grok-text-review-outer-attempt-04-chunk-04.json` | `31b34c13e574f3e82e4d8b5c21acbd8257b636df8fb1c53e284c41a3658c0a6c` |
| `grok-text-review-response-attempt-04-chunk-04.txt` | `5125e5f305381bfc14c1ff1c28c83ce0f4fda3ebd10932827d73a080f838e070` |

## Exclusion reason

The exact non-fast model returned a normal successful outer envelope and a
substantively complete 10-work response. It is excluded because seven Pass A
change bullets used `Source: the same ...` or `Source: same URL` rather than
including the literal direct frozen-packet URL required for each change.

Nothing from this attempt is accepted as final Pass B evidence, adjudicated, or
promoted. The next attempt uses the same exact model, request, and frozen
inputs; no alternate reviewer is substituted.
