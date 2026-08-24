# Batch 003 chunk 02 Cursor Grok excluded attempt 01

- executionDate: 2026-08-23
- recordedAt: `2026-08-23T11:47:17+09:00`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- mode: non-fast, read-only `plan`
- sandbox: enabled
- exitCode: `0`
- outerType: `result`
- outerSubtype: `success`
- outerIsError: `false`
- durationMs: `721880`
- durationApiMs: `721880`
- sessionId: `57a6ff81-63e3-43db-9ea3-925d404f9361`
- requestId: `9233d837-bb68-4a93-8168-924098d1ddad`
- inputTokens: `104144`
- outputTokens: `43772`
- cacheReadTokens: `143616`
- cacheWriteTokens: `0`
- reviewedByHuman: `false`
- artAccess: `ART_ABSTAIN`
- museStatus: `NOT_USED`
- oxStatus: `EXCLUDED`
- disposition: `EXCLUDED_INCOMPLETE_RESPONSE`

## Bound files

| path | SHA-256 |
| --- | --- |
| `grok-text-review-request-chunk-02.md` | `29e05a2f50629eefc0e25e54f4a81d068c66caf731783465fb83cc983e405d31` |
| `grok-text-review-outer-attempt-01-chunk-02.json` | `454bdcebe98fd5e8b16c261b7a1b568ce76cc8c130a9f45fb2f8f5e359f7e6d0` |
| `grok-text-review-response-attempt-01-chunk-02.txt` | `ced82e5c416fb91cf6acd9135f58074d8983f99834481aca48e9ef647e4ec64a` |

## Exclusion reason

The exact model process stayed alive during the long no-output interval. At
approximately `448` seconds, process `248244` was observed in state `Ssl` with
the expected command line. The run later exited normally and returned a
successful outer envelope, but the final `result` contained only five progress
sentences (`291` JavaScript characters; `658` UTF-8 bytes). It ended by claiming
that the completed Markdown would follow, but the required document was absent.

The response therefore had no 10-work matrix, Genre table, Theme table,
identity/safety/ISBN rows, outcomes, hash echo, completeness marker, or usable
`ART_ABSTAIN` attestation. Token usage cannot replace the missing final response.
Nothing from this attempt is accepted as Pass B evidence, compared, adjudicated,
or promoted. The next attempt must use the same exact model and frozen inputs;
no alternate reviewer is substituted.
