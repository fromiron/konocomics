# Batch 003 chunk 01 Cursor Grok execution ledger

- executionDate: 2026-08-23
- completedAt: `2026-08-23T11:31:21+09:00`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- resolvedModelAttestation: Cursor Grok 4.6 High
- mode: non-fast, read-only `plan`
- sandbox: enabled
- outerType: `result`
- outerSubtype: `success`
- outerIsError: `false`
- exitCode: `0`
- durationMs: `689513`
- durationApiMs: `689513`
- sessionId: `fcb6f7c4-5dde-4d65-aef8-92f4d480b43c`
- requestId: `84c3c397-f492-401f-8eb3-170e1c493727`
- inputTokens: `78846`
- outputTokens: `45549`
- cacheReadTokens: `130944`
- cacheWriteTokens: `0`
- reviewedByHuman: `false`
- artAccess: `ART_ABSTAIN`; pixel access was not established
- museStatus: `NOT_USED`; the optional reviewer was not substituted
- oxStatus: `EXCLUDED`; the user removed Ox from the panel

## Invocation

The read-only run used this exact CLI boundary:

```text
agent --print --output-format json --mode plan --sandbox enabled --trust \
  --workspace /home/bell/Toys/konocomics \
  --model cursor-grok-4.6-high
```

The model ID was explicit and was not a `-fast` variant. The outer JSON does
not expose a separate model field; model provenance is preserved by the exact
invocation and the response's `cursor-grok-4.6-high` / Cursor Grok 4.6 High
execution attestation. No other model was invoked or silently substituted.

## Long-running process observation

- The CLI emitted no incremental stdout for more than 60 seconds; this was not
  treated as a failure or timeout.
- The wrapper kept the session open for `23` polling intervals and did not
  interrupt it.
- At approximately `678` seconds, process `205973` was observed alive in state
  `Ssl` with the exact `cursor-grok-4.6-high` command line.
- The process then returned the complete outer JSON normally at `689513` ms.
- The wrapper wrote the immutable outer JSON and extracted response only after
  the successful exit. The Cursor reviewer itself made no repository edits.

## Bound outputs

| path | SHA-256 |
| --- | --- |
| `grok-text-review-request-chunk-01.md` | `ea438bc681337a005dfc99be01727773aaef04021c8c3e09eef84e609f34219e` |
| `grok-text-review-outer-chunk-01.json` | `8bba7775a3df2973c290f73cac19e0adc4ea3184238b30f339659bb0629d2e7a` |
| `grok-text-review-response-chunk-01.txt` | `8bb43a64bdfee079a9de21153cc2facc1da369efc2848c208c7502240decf69c` |

The response file is the complete `result` string from the successful outer
JSON. The outer status and response were not salvaged from an error result.

## Validation

- All nine request-bound input hashes were recomputed locally after completion
  and still matched the frozen request and the hashes echoed by the reviewer.
- Independent matrix: `10` works, `13` non-Art Axis cells per work, frozen order.
- Genre table: `10` rows using only the dictionary's Genre IDs.
- Theme table: `10` rows using only the dictionary's Theme IDs and centrality
  `1` or `2`.
- Pass A comparison: all `10` works, `45` direct frozen-packet URL occurrences.
- Identity/safety/representative-ISBN table: `10` complete rows.
- Review outcome table: `10` complete rows using only the allowed outcomes.
- Canonical-title cells containing decorative `『` or `』`: `0`.
- `【推しの子】` retained its meaningful official brackets and
  `多聞くん今どっち!?` retained the frozen ASCII punctuation.
- Named Art axes judged or compared: `0`; the response includes the required
  `ART_ABSTAIN` attestation and completeness marker.

These conclusions remain independent Pass B proposals. They do not adjudicate
Pass A disagreements, authorize promotion, or alter source, generated, Gold,
registry, eligibility, recommendation, safety, or Art data.
