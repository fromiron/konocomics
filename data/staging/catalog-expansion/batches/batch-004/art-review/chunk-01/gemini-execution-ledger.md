# Batch 004 Art chunk 01 — Gemini execution ledger

- executionDate: `2026-08-25`
- requestedModel: `gemini-3.7-flash-high`
- resolvedLabel: `Gemini 3.7 Flash High`
- effort: `high`
- mode: `plan`
- reviewedByHuman: `false`
- agyVersion: `1.1.19`
- requestSha256: `8bc1666f9cd86e8acc41ffd470fef352b3daf903821e8d9639ffc44eccaa9ee6`
- payloadLedgerSha256: `f49c56a3f453173edb250c2b3dd7abdbc21890d4075300f2b0d76ab508679ee5`
- rootIdentitySha256: `c45b45989ed81f9568603731dd987b96326c3c0264b6377f569dacb48fbe0be4`
- Muse status: `NOT_USED`; no substitute reviewer was counted
- Cursor Grok Art status: `ART_ABSTAIN`; pixel access was not established

## Excluded attempts

| Attempt | Session | Outer result | Reason |
| --- | --- | --- | --- |
| 01 | none | `INPUT_OR_CAPABILITY_FAILURE` | The first command placed the prompt as a positional argument after `--print`; `agy` parsed `--model` as the prompt and exited 2 before model invocation. |
| 02 | none | `INPUT_OR_CAPABILITY_FAILURE` | The corrected headless command returned no model output because a required command permission was auto-denied; outer exit was 0 but no review was produced. |

Neither excluded attempt authorizes Art values. No fallback model, partial
output, or Local conclusion was counted.

## Authorizing run

| Conversation / session | Requested/resolved model | Status | Direct duration | Pixel/hash result | Response artifact | Artifact SHA-256 |
| --- | --- | --- | ---: | --- | --- | --- |
| `agy-headless-session-78823` | `gemini-3.7-flash-high` / Gemini 3.7 Flash High | `SUCCESS` | `141.362s` | `24/24` images and `8/8` frozen inputs matched | `gemini-response.md` | `8c987dd0319a4e6a02a44653e298f5db85eba8721bcf516fefe17eb4caf3393f` |

The authorizing `agy` run used effort `high`, read-only `plan` mode, the
canonical uncompressed isolated project/image root, exact request, complete
payload ledger, and root identity. It inspected all 24 original PNGs, returned
all ten works and 40 terminal cells, and ended with outer `SUCCESS`, exit code
0, no fallback, timeout, rate limit, truncation, or degraded output. The
canonical payload root contains only frozen metadata, original preview pixels,
the exact request, payload ledger, and root identity; no Local reviewer output
was exposed.
