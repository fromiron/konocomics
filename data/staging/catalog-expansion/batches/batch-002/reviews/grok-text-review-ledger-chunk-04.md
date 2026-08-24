# Batch 002 chunk 04 Cursor Grok execution ledger

- executionDate: 2026-08-23
- requestedModel: `cursor-grok-4.6-high`
- resolvedModel: Cursor Grok 4.6 High
- mode: non-fast, read-only `ask`
- outerResult: success
- exitCode: 0
- durationMs: 657613
- sessionId: `cb755422-c4ed-43a3-b279-a1c665f416c8`
- requestId: `24593963-f811-4c7e-8c79-441a66adc0f1`
- inputTokens: 133450
- outputTokens: 38452
- cacheReadTokens: 235136
- cacheWriteTokens: 0
- reviewedByHuman: false
- artAccess: abstained
- museStatus: NOT_USED; optional reviewer was not substituted

## Bound payloads

| path                                     | SHA-256                                                            |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `grok-text-review-request-chunk-04.md`   | `b8461b4ab93e5d0f0754b28f441126a40034a59fa89f598b663af9503d30c159` |
| `grok-text-review-response-chunk-04.txt` | `c0d495de2e6693446c038c34e267123a1ef282bbf517c52dd274d3f037faf330` |
| successful session transcript            | `cdf2353b1d226043aa4547f07ed359a7ea42b776a1baec37903221ed0c2f1fcd` |

The authorizing run used `--model cursor-grok-4.6-high`, not a `-fast`
variant. Its workspace was the isolated bundle at
`/tmp/batch002-grok-chunk04.HCMFv1`, containing only the request and its nine
bound inputs. The saved response byte-for-byte matches the complete final
assistant text in the successful transcript. The model reported normal
completion, full access to all nine inputs, no rate-limit, timeout, or degraded
output, and abstained from every Art axis because no pixel access was requested
or proved.

The response remains a Pass B proposal. Pass C must resolve every Axis, Genre,
Theme, identity, safety, and ISBN disagreement against the Factor Dictionary
and frozen evidence instead of averaging or vote count.
