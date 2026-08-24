# Batch 003 chunk 05 Cursor Grok excluded attempt 01

- executionDate: 2026-08-24
- requestedModel: `cursor-grok-4.6-high`
- mode: read-only `plan`
- sandbox: enabled
- outerType: `result`
- outerSubtype: `success`
- outerIsError: `false`
- exitCode: `0`
- durationMs: `914372`
- sessionId: `b194f927-d7cd-4400-a0c6-3951ca9173aa`
- requestId: `52dec40c-4284-4198-b5a1-d9c7127d867c`
- inputTokens: `82189`
- outputTokens: `39497`
- cacheReadTokens: `205312`
- reviewedByHuman: `false`
- disposition: `EXCLUDED_INCOMPLETE_OUTPUT`

The outer envelope completed successfully and the response said all nine hashes
matched, but the returned result contained only six progress sentences. It did
not include the required 13-axis matrix, Genre and Theme tables, comparison,
identity/safety/ISBN table, outcomes, extremes, or completeness marker. No
partial conclusion is salvaged. A fresh exact-model read-only attempt is used
instead.
