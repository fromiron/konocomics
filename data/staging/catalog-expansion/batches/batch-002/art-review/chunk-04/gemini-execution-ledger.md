# Batch 002 Art chunk 04 — Gemini execution ledger

- executionDate: 2026-08-23
- requestedModel: `gemini-3.7-flash-high`
- resolvedLabel: Gemini 3.7 Flash (High)
- effort: `high`
- reviewedByHuman: false
- temporarySampleRoot: `/tmp/batch002-art-preflight-chunk04.7n26GY`
- preflightSha256: `c2737cd4fa27e9d9239f5bb15f3a78ed0fbffc885e77955cb1a7af01801736a3`
- Muse status: `NOT_USED`; no substitute reviewer was counted
- Cursor Grok Art status: `ART_ABSTAIN`; pixel access was not established

## Bound requests

| Group | Request SHA-256                                                    |
| ----- | ------------------------------------------------------------------ |
| 01    | `1f3bbcee77e74bc3ed790bc3a7638232af106698a2905724ecb7958e3b214130` |
| 02    | `dbd4de3d34db447a04656f10852387c8653ced254de9cddb1472c8e70c81abee` |
| 03    | `f668c7eb9143118d5e5dcff79bc8d51c0d021364eef87c1ffc6b267b36852a60` |

## Excluded attempts

| Group | Conversation                           | Status  | Reason                                                                                                                                                                             |
| ----- | -------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01    | `b6fde018-9ef7-4e34-b5bc-f70f5a1c1a1b` | ERROR   | Direct pixel run returned a complete 9/9-hash candidate but ended with sandbox connection reset; candidate SHA `67e3949df57cc33d0061f9244985b31e92f4a6f1e02bf5102974d232d9166635`. |
| 01    | `50dce049-001a-4dda-80e6-f72dcac46b7b` | SUCCESS | First transport replay changed 百姓貴族 density from 0 to 2 and failed the exact semantic replay check.                                                                            |
| 02    | `d34495ae-0e6a-4d25-a36f-af4d4a349cb3` | ERROR   | Direct pixel run returned a complete 9/9-hash candidate but ended with sandbox connection reset; candidate SHA `8a0112ed6825f5fd655605040b80caa01b82bd89f743eb2f0496595fb5203280`. |
| 03    | `b354d020-1124-42cd-b4f1-893a2e2574fc` | ERROR   | Direct pixel run returned a complete 6/6-hash candidate but ended with sandbox connection reset; candidate SHA `7f146513b57cbff8851e0179af21276ef7df7259b9dbb6c3b979c440c5524e1c`. |

An abnormal outer status or a non-exact replay is never counted even when its
nested candidate looks complete. The final fresh same-model transports returned
the direct pixel conclusions byte-for-byte.

## Authorizing runs

| Group | Conversation                           | Status  | Response artifact                        | SHA-256                                                            |
| ----- | -------------------------------------- | ------- | ---------------------------------------- | ------------------------------------------------------------------ |
| 01    | `4a166c0b-1324-47f8-a50e-9c7e77b305d0` | SUCCESS | `gemini-response-chunk-04-group-01.json` | `d8f8951a694b6b1474eaed78e1938f3f4c3bc9705a61edd4d315d8363ffb7d5b` |
| 02    | `9af5cc18-9f69-4e2d-9387-96a6d57d125c` | SUCCESS | `gemini-response-chunk-04-group-02.json` | `c7b9b544e90aed4f4fa17b1c194d2b05691fe11a75ced34ce1f386a1fbf6352e` |
| 03    | `3c848635-d9e2-4962-83fa-d8b25034bfb4` | SUCCESS | `gemini-response-chunk-04-group-03.json` | `2b04820297ffa29baa6c5775ee7f71ed8ad767f22d5d04bc31bb8eecc27a5cdd` |

The authorizing artifacts identify the requested model and effort, report
completion without rate-limit, timeout, or degraded output, preserve every
required work and axis, and state `reviewedByHuman=false`. Their 24 listed image
hashes match the temporary sample bytes. Clean transports persist exact
same-model conclusions produced after pixel access; they do not add or alter an
Art value. The primary adjudicator separately reopened conflicts and extrema
against the same temporary pixels before producing the terminal matrix.
