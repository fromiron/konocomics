# Batch 002 Art chunk 03 — Gemini execution ledger

- executionDate: 2026-08-23
- requestedModel: `gemini-3.7-flash-high`
- resolvedLabel: Gemini 3.7 Flash (High)
- effort: `high`
- reviewedByHuman: false
- temporarySampleRoot: `/tmp/batch002-art-preflight-chunk03.6Zlsbu`
- preflightSha256: `1f5444994829de49ad00b2a60281f3514e336c16e5160edf431c51dea11067ae`
- Muse status: `NOT_USED`; no substitute reviewer was counted
- Cursor Grok Art status: `ART_ABSTAIN`; pixel access was not established

## Bound requests

| Group | Request SHA-256                                                    |
| ----- | ------------------------------------------------------------------ |
| 01    | `a45d92259797c40b071cf8b96b06bfafc3fc84a61f634e9f095ab6d6bbb445d2` |
| 02    | `fb21d41e40852a85f8c2f1690de53de1c5f7dc3e3cef15a21adccdeac2c04ad2` |
| 03    | `a57fa915cd7ad532d5ac8486e458c5794db545f20d558dc84c3e00947b849844` |

## Excluded attempts

| Group | Conversation                           | Status  | Reason                                                                                                                                     |
| ----- | -------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 01    | `1e07bfdb-f703-4065-9991-c1018e83f531` | ERROR   | pixel run ended `context canceled`; its continuation also failed and neither contributes a verdict                                         |
| 01    | `1ed4d463-c3e1-4831-a0bd-2c6f568e084c` | ERROR   | command permission was denied before a countable response                                                                                  |
| 01    | `4294a029-4a54-4cb8-9b38-8cbc815aa882` | ERROR   | pixel run and continuation ended abnormally                                                                                                |
| 01    | `11cd5462-4c07-4765-9f19-7eb71fb1b2d8` | ERROR   | pixel run ended `context canceled`                                                                                                         |
| 01    | `20950119-6d20-4bb9-9d59-8f5de538133f` | ERROR   | completed-looking pixel payload ended `context canceled`; candidate SHA `eeb8cd981b4cbdcdc1c4928f1aeb8f0b0b2919cd80aaa538d97853d075dd8131` |
| 02    | `9f781921-f73a-4416-bc66-88ebfce45c8d` | ERROR   | completed-looking pixel payload ended `context canceled`; candidate SHA `423790035b0f9e5957b451b6e003400a927b3cb66db273f4a27ae6baea964c20` |
| 02    | `43b302a8-65e6-42b4-9aa0-2f71121357eb` | SUCCESS | first clean replay reordered two refs and failed the byte/semantic transport check                                                         |
| 03    | `e1812c01-7395-4901-a65c-f5c5496e554f` | SUCCESS | direct pixel review matched 6/6 hashes but misplaced one `visualSoftness.limitation` as invalid `axes.limitation`                          |
| 03    | `e1812c01-7395-4901-a65c-f5c5496e554f` | ERROR   | first correction tried a denied helper command and returned no review response                                                             |
| 03    | `e1812c01-7395-4901-a65c-f5c5496e554f` | ERROR   | second correction returned the corrected payload but retained an outer permission-error status                                             |

An abnormal outer status, incomplete schema, or non-exact replay is never
counted even when the nested payload looks complete. Group 03's corrected
candidate response has SHA-256
`6d51cec9f0af7d38ebe0c277a036a3d109d430618cf8f9b53745a740f3dfa853`;
the final fresh same-model transport returned that candidate byte-for-byte.

## Authorizing runs

| Group | Conversation                           | Status  | Response artifact                        | SHA-256                                                            |
| ----- | -------------------------------------- | ------- | ---------------------------------------- | ------------------------------------------------------------------ |
| 01    | `f9af7090-3e44-4775-9ddb-cbd33444f800` | SUCCESS | `gemini-response-chunk-03-group-01.json` | `ff59d967b40b9ad9d2e50cf64dc0b399d871f7329e67f016bb1f78242502e077` |
| 02    | `635dc07d-2cd7-4034-a67c-197b9456a805` | SUCCESS | `gemini-response-chunk-03-group-02.json` | `0cf5f7bf9396f0f408f815070e0bdfaa9dd70f6c00245fbea1cb4336990c3349` |
| 03    | `ffa5001e-824a-4dea-82e9-6ebd0df9ec03` | SUCCESS | `gemini-response-chunk-03-group-03.json` | `e1d5b3c9caf7a009083d6cd0c496070b94955ce9558b2d1be8f0685e08a9bb0b` |

The authorizing artifacts identify the requested model and effort, report
completion without rate-limit, timeout, or degraded output, preserve all
required rows, and state `reviewedByHuman=false`. Their 24 listed image hashes
match the temporary sample bytes. The clean replays only persist the exact
same-model conclusions produced after pixel access; they do not add or alter an
Art value. The primary adjudicator separately reopened conflicts and extrema
against the same temporary pixels before producing the terminal matrix.
