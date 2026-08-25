# Batch 004 Art chunk 03 — Gemini execution ledger

- executionDate: `2026-08-25`
- requestedModel: `gemini-3.7-flash-high`
- resolvedLabel: `Gemini 3.7 Flash High`
- effort: `high`
- mode: `plan`
- access: `--dangerously-skip-permissions` (full tool access)
- reviewedByHuman: `false`
- agyVersion: `1.1.19`
- requestSha256: `4bb65eee80f61b879fbd36c9d5f8685d7afe4ad7fa3f4b97dba44194f416d5fc`
- payloadLedgerSha256: `47041b5568f3128683675febd14b3dc236b7562536a0996cfe79410a39e529dd`
- rootIdentitySha256: `b92aa89baddb43f28c379d8a3abe7959e141c11932ce7f85d690c709997f8c92`
- payloadIdentitySha256: `059722be6395a449ed9e305687529f319f3eb033c89cb64445895c09516189be`
- Muse status: `NOT_USED`; no substitute reviewer was counted
- Cursor Grok Art status: `ART_ABSTAIN`; pixel access was not established

## Excluded attempts

| Attempt | Session | Result | Reason |
| --- | --- | --- | --- |
| 01 | none | `INPUT_OR_CAPABILITY_FAILURE` | The exact `agy` invocation used `--print-timeout 900`; the CLI rejected the value because a duration unit was required. The model was never invoked. |
| 02 | none | `INPUT_OR_CAPABILITY_FAILURE` | The exact model invocation with `--print-timeout 15m` exited 0 but produced no output because headless mode auto-denied a required `command` permission. The stderr explicitly reported no output produced; no model response was counted. |

No excluded attempt authorizes Art values. No fallback model, partial output, or Local conclusion is counted as Gemini review.

## Authorizing run

| Conversation | Requested/resolved model | Status | Direct duration | Pixel/hash result | Response artifact | Artifact SHA-256 |
| --- | --- | ---: | ---: | --- | --- | --- |
| `224f2389-ee56-4ed9-92ee-cbff5e1afbc1` | `gemini-3.7-flash-high` / Gemini 3.7 Flash High | `SUCCESS` | `503.257s` | `58/58` images and `8/8` frozen inputs matched | `gemini-response.md` | `c127753ae744839c674c9ab4e99e594ce69024aab56a10a2d1733f2859e6c5ef` |

The authorizing `agy` run used the exact requested model, effort `high`,
read-only plan mode, full tool access, the canonical uncompressed project and
image directories, exact request, complete payload ledger, and root identity.
It inspected all 58 original images, returned all ten works and 40 terminal
cells, and ended with outer `SUCCESS`, exit code 0, no fallback, timeout,
rate-limit, truncation, or degraded output. No adjudication, final-art,
promotion, or commit was performed.
