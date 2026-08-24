# Batch 002 Art chunk 02 — Gemini execution ledger

- executionDate: 2026-08-23
- requestedModel: `gemini-3.7-flash-high`
- resolvedLabel: Gemini 3.7 Flash (High)
- effort: `high`
- reviewedByHuman: false
- temporarySampleRoot: `/tmp/batch002-art-preflight-chunk02.polhkX`
- preflightSha256: `56e6a1d4bc74e0e074cdaec6973a54b2fe49697dc2cbdbfeae4f1d812de2bdf1`
- Muse status: `NOT_USED`; no substitute reviewer was counted

## Bound requests

| Group | Request SHA-256                                                    |
| ----- | ------------------------------------------------------------------ |
| 01    | `4179fe972e088dd2fe683e73e7a6af1c176b012035d2035e4edc0aae0a48d91b` |
| 02    | `f80a14abad09afd918a527ce28f36ac6130d477434234887e780cabfd213d8a8` |
| 03    | `ad23b2c0be7040b74d91c346b50e94584e85d0c76ea0240bd4055d94e650d157` |

## Excluded attempts

| Group | Conversation                           | Status   | Reason                                                                                               |
| ----- | -------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| 01    | `a772a7a4-2bf0-41f7-b787-d20f3f153845` | ERROR    | relative request path was resolved beneath the temporary sample root; no review response             |
| 01    | `ca5a7ee0-87c8-4e89-9b6e-1f98bc88cd4f` | CANCELED | headless mode denied the command permission required to recompute SHA-256; no review response        |
| 02    | `9ffcf950-d76c-4955-9e07-2f00427c7af1` | CANCELED | headless mode denied the command permission required to recompute SHA-256; no review response        |
| 03    | `c725c5f7-08d6-4484-8724-c727ef784654` | CANCELED | headless mode denied the command permission required to recompute SHA-256; no review response        |
| 01    | `21fd5e60-c95b-4d88-ba66-be998a2122b9` | ERROR    | complete-looking response was followed by sandbox connection reset; abnormal termination excludes it |
| 02    | `b25777e1-614e-40bb-baff-3dcaaf8cf547` | ERROR    | complete-looking response was followed by sandbox connection reset; abnormal termination excludes it |
| 03    | `b3bab054-bc47-47d9-88d5-623e8ad54241` | ERROR    | complete-looking response was followed by sandbox connection reset; abnormal termination excludes it |

These attempts produced no countable verdict and are excluded from the Art
quorum. The three sandbox-error payloads are not salvaged despite containing a
response because normal termination is a required reviewer condition. Clean
reruns use the same model, effort, request hashes, and image hashes in plan mode
with tool permission enabled. Their results are counted only after exact
identity, clean completion, full pixel access, hash matches, complete rows, and
absence of rate-limit, timeout, or degraded output are verified.

## Authorizing runs

| Group | Conversation                           | Status  | Response artifact                        | SHA-256                                                            |
| ----- | -------------------------------------- | ------- | ---------------------------------------- | ------------------------------------------------------------------ |
| 01    | `b6b4286d-3870-45bf-a314-41936c1500b5` | SUCCESS | `gemini-response-chunk-02-group-01.json` | `46aa1a89caa60bb50da7898b4734bcf6a0675d41977f48f6c1d3b5fa3b8cfe3e` |
| 02    | `799d7ede-9b27-4ef5-936c-73553bea4ea7` | SUCCESS | `gemini-response-chunk-02-group-02.json` | `ceea08c731ef08ba8a5799116bdf02cd225155e740bfe628f67f7d79fb7d1edb` |
| 03    | `6923e86e-e5ff-41eb-9dfb-e6a367885069` | SUCCESS | `gemini-response-chunk-02-group-03.json` | `75161a2ec3351447cb32ad56de3b16eb8f864aa9d165c1c0cf375a3e3f910616` |

All three authorizing responses attest exact model `gemini-3.7-flash-high`,
resolved label `Gemini 3.7 Flash (High)`, effort `high`, completion
`completed`, full pixel access, `reviewedByHuman=false`, nine matching sample
hashes, three complete work rows, no issue, and no hard blocker. The saved
outer JSON is the successful conversation's exact-response replay used only to
persist the already completed result without truncating it; it does not change
the Art conclusions.
