# Batch 003 chunk 04 Cursor Grok excluded attempt 02

- executionDate: 2026-08-23
- recordedAt: `2026-08-23T13:01:30+09:00`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- mode: non-fast, read-only `plan`
- sandbox: enabled
- exitCode: `0`
- outerType: `result`
- outerSubtype: `success`
- outerIsError: `false`
- durationMs: `664676`
- durationApiMs: `664676`
- sessionId: `4d90341d-b9d0-4190-abe0-2618d1d7c3fe`
- requestId: `c8cb5aef-b84b-4a18-b7e7-e34a213901b1`
- inputTokens: `140868`
- outputTokens: `41939`
- cacheReadTokens: `80640`
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
| `grok-text-review-outer-attempt-02-chunk-04.json` | `ae7a8f842ece89b0a6af716997e6ea0c3e2649a82b4b83f09433d47ac5e73698` |
| `grok-text-review-response-attempt-02-chunk-04.txt` | `e218faad2fb71624b0dd8513882019a173047f04f4eb24e73cd00b98118f9e36` |

## Exclusion reason

The exact non-fast model returned a normal successful outer envelope and a
substantively complete 10-work response. It is excluded because the response
did not satisfy two explicit frozen-output requirements:

1. Thirteen Pass A change bullets used `Source: 위 ... URL` or
   `Source: 같은 URL` instead of including a direct frozen-packet source URL in
   that change, despite the request requiring a direct URL for every change.
2. The Pass A comparison header for `work-b2be97620643b3342637` rendered the
   frozen title `アオイホノオ` as `アオイホノ오`, replacing the final Japanese
   character with a Korean character and violating exact canonical-title
   preservation.

Nothing from this attempt is accepted as final Pass B evidence, adjudicated, or
promoted. The next attempt must use the same exact model, request, and frozen
inputs; no alternate reviewer is substituted.
