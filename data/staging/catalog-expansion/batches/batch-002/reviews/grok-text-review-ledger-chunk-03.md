# Batch 002 chunk 03 Cursor Grok execution ledger

- executionDate: 2026-08-23
- requestedModel: `cursor-grok-4.6-high`
- resolvedModel: Cursor Grok 4.6 High
- mode: non-fast, read-only `ask`
- outerResult: success
- exitCode: 0
- durationMs: 525029
- sessionId: `dcdd8ecf-e036-4852-a217-5561c6918854`
- requestId: `55b541fe-82e1-400a-8723-6ca4d94c933f`
- inputTokens: 132345
- outputTokens: 32387
- cacheReadTokens: 92160
- cacheWriteTokens: 0
- reviewedByHuman: false
- artAccess: abstained
- museStatus: NOT_USED; optional reviewer was not substituted

## Bound payloads

| path                                     | SHA-256                                                            |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `grok-text-review-request-chunk-03.md`   | `6f8654e415d87691dfefbcdfc6d784e9c730ac3b1c7cc5cc404a27755a3da4ae` |
| `grok-text-review-response-chunk-03.txt` | `3916ba2f6a35c7ad27f6fabd7e95e5e30454ae1cbf90e1a9f27c3f020ee7d0fe` |
| successful session transcript            | `564250ee5806dfeb155d299c30cfe909bec1a1a221c64576ce67bd806ef11ca3` |

The authorizing run used `--model cursor-grok-4.6-high`, not a `-fast`
variant. Its workspace was the isolated bundle at
`/tmp/batch002-grok-chunk03.F4ICnc`, containing only the request and its nine
bound inputs. The saved response byte-for-byte matches the complete final
assistant text in the successful transcript. The model reported normal
completion, full access to all nine inputs, no rate-limit, timeout, or degraded
output, and abstained from every Art axis because no pixel access was requested
or proved.

The response remains a Pass B proposal. Pass C must resolve every Axis, Genre,
Theme, identity, safety, and ISBN disagreement against the Factor Dictionary
and frozen evidence instead of averaging or vote count.
