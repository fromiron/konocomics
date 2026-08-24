# Batch 002 chunk 02 Cursor Grok execution ledger

- executionDate: 2026-08-23
- requestedModel: `cursor-grok-4.6-high`
- resolvedModel: Cursor Grok 4.6 High
- mode: non-fast, read-only `ask`
- outerResult: success
- exitCode: 0
- durationMs: 600408
- sessionId: `df0ae48f-bafd-44b7-8e21-6f2c2c9248ee`
- requestId: `a1e2ac1b-81a0-4755-96c1-0cab9c50d2c7`
- inputTokens: 160660
- outputTokens: 37713
- cacheReadTokens: 109184
- cacheWriteTokens: 0
- reviewedByHuman: false
- artAccess: abstained
- museStatus: NOT_USED; optional reviewer was not substituted

## Bound payloads

| path                                     | SHA-256                                                            |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `grok-text-review-request-chunk-02.md`   | `194ad1f2ef6cf9603df8c02f6bdb2866ee859d9afd15f4c794d94d6ee828b787` |
| `grok-text-review-response-chunk-02.txt` | `5645f18ed6bb84484f0c44136cce1df325977b7051d7844753163f44bcec5061` |
| successful session transcript            | `cb9efda7ee5a4096944850c41b276ebc152913b174786a02dc811dee31e6a7f8` |

The authorizing run used `--model cursor-grok-4.6-high`, not a `-fast`
variant. Its workspace was the read-only canonical bundle at
`/tmp/batch002-grok-chunk02.rz1viA`, containing only the request and its nine
bound inputs. The saved response byte-for-byte matches the complete final
assistant text in the successful transcript. The model read all nine files,
reported normal completion, and abstained from every Art axis because no pixel
access was requested or proved.

## Excluded attempt

| sessionId                              | transcript SHA-256                                                 | terminal status | exclusion reason                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------ |
| `dbb16bcf-5d78-457f-b203-7266711377fa` | `bff1e198c6aaf1f108d68cda0e1103f441b7a677588a61a895cb047dbe860b91` | interrupted 130 | repository workspace exposed chunk-01 response and the model read it for format before finishing |

The excluded attempt supplies no verdict. It was not salvaged or silently
replaced under the same session. The clean rerun used a new isolated workspace,
the exact same request hash, and the exact requested model identity.

The successful response's conclusions remain Pass B proposals. Pass C must
resolve all Axis, Genre, Theme, identity, and safety disagreements against the
Factor Dictionary and frozen evidence rather than averaging or vote count.
