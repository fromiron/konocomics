# Batch 004 Art chunk 04 — Gemini execution ledger

- executionDate: `2026-08-25`
- requestedModel: `opencode/gemini-3.7-flash`
- requestedVariant: `high`
- reviewedByHuman: `false`
- opencodeVersion: `1.18.21`
- agyVersion: `1.1.19`
- requestSha256: `96af631354c3489bf11637e79261b92506e7a24a8bef8edb3e0802e6d5ce7dda`
- payloadLedgerSha256: `6ed63929e9ea1fa44501560c5dca0b3bc88b651a87b79c3b2ce9c82cd229fc88`
- rootIdentitySha256: `06478392679390605acb546001105573b020e1fc8b07b4eae62cd22cdbf2a2a7`
- Muse status: `NOT_USED`; no substitute reviewer was counted
- Cursor Grok Art status: `ART_ABSTAIN`; pixel access was not established

## Excluded attempts

| Attempt | Session | Result | Reason |
| --- | --- | --- | --- |
| 01 | none | `INPUT_OR_CAPABILITY_FAILURE` | The positional instruction was placed after repeated `--file` options and was parsed as a file path; the model was never invoked. |
| 02 | `ses_fcb31bcbfffevTW5g6r3OB1GmV` | `INPUT_OR_CAPABILITY_FAILURE` | The exact model route returned HTTP 401 `CreditsError: No payment method` before any response or pixel inspection. |
| 03 | `04418abf-5125-48c0-8188-dfc5d98858dd` | `INPUT_OR_CAPABILITY_FAILURE` | The first `agy` call was denied before review when its read-only `find` command lacked permission. |

No excluded attempt authorizes Art values. No fallback model, visible partial
output, or Local conclusion is counted as Gemini review.

## Authorizing run

| Conversation | Requested/resolved model | Status | Direct duration | Pixel/hash result | Response artifact | Artifact SHA-256 |
| --- | --- | --- | ---: | --- | --- | --- |
| `fddddf49-33c9-4d3a-9b59-b2ef803f51ac` | `gemini-3.7-flash-high` / Gemini 3.7 Flash High | `SUCCESS` | `102.180193125s` | `6/6` images and `8/8` frozen inputs matched | `gemini-response.md` | `c82a7442d207a2bfcae7eb9d04d31be59e39149a78d08a74b2693729e3a8cabf` |

The authorizing `agy` run used effort `high`, read-only plan mode, the canonical
uncompressed project and image directories, exact request, complete payload
ledger, and root identity. It inspected all six original PNGs, returned all ten
works and 40 terminal cells, and ended with outer `SUCCESS`, exit code 0, no
fallback, timeout, rate limit, truncation, or degraded output. Two later turns
only reproduced the already completed response for exact durable transcription;
they did not authorize new values.
