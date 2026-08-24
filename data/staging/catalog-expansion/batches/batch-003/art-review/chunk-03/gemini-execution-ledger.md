# Batch 003 Art chunk 03 — Gemini execution ledger

- executionDate: `2026-08-23`
- requestedModel: `gemini-3.7-flash-high`
- resolvedLabel: `Gemini 3.7 Flash High`
- effort: `high`
- reviewedByHuman: `false`
- countedRunNumber: `1`
- countedSessionId: `fb0c89bb-bbb6-4e19-83b1-aa3a478413ac`
- countedRequestId: `0821a6e4-5098-40aa-bcdc-c22f55cc8365`
- outerStatus: `success`
- outerIsError: `false`
- durationMs: `243241`
- inputTokens: `173866`
- outputTokens: `28235`
- cacheReadTokens: `443708`
- cacheWriteTokens: `0`
- requestSha256: `8ed4984658b2983b0e3821183e8f454e493a95b781d92215c5387f1ac7f3bb37`
- responseArtifactSha256: `60ee0d539c472a9756bbd1424f7592b74b4723249e50e30e76904df703402128`
- factorDictionarySha256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- annotationGuideSha256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`
- reviewRequestSha256: `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759`
- frozenWorkSetSha256: `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd`
- preflightSha256: `0d922527dcb8b1cbfc1196810c5e5963c01d1c3c6b4540999cd7185ce9f1b7aa`
- preflightLedgerSha256: `2c69e652a9399d110e98e0c77efb14da686d2c29d303d02a52e44b8f2e6bfe38`
- Muse status: `NOT_USED`; no substitute reviewer was counted
- Cursor Grok Art status: `ART_ABSTAIN`; pixel access was not established or requested

## Counted run

The first and only Art-review turn completed normally with exact model
`gemini-3.7-flash-high`, effort `high`, read-only plan mode, outer subtype
`success`, zero model retries, and no fallback, timeout, rate limit, or degraded
output. The model recomputed all six frozen input hashes, opened all 27 selected
images at original pixels, and returned the complete requested document.

One CLI invocation exited before any model session because the additional
read-only workspace required an explicit trust flag. It is an excluded local
preflight failure, not an Art-review attempt or substitute model run.

## Response-capture boundary

The counted run's complete JSON exceeded the wrapper's display cap. No
conclusion was salvaged from the truncated display. The same conversation was
resumed only to repeat its immediately preceding complete Markdown response;
these are transcription turns, not additional Art reviewers or new
adjudications.

| Retrieval request                      | Duration | Input | Output | Cache read | Disposition                                                      |
| -------------------------------------- | -------: | ----: | -----: | ---------: | ---------------------------------------------------------------- |
| `9e433105-4fad-4add-be88-e3de376bdb34` | 58422 ms | 66137 |  11212 |      24012 | complete response returned; wrapper display truncated; discarded |
| `bb338d4b-ec1b-47a7-a5fa-15ecefa02f41` | 53173 ms | 13150 |  11154 |      88264 | complete response returned; wrapper display truncated; discarded |
| `0dbee82d-100b-430d-8131-f6a6b4c6dd40` | 54857 ms | 12182 |  11181 |     100497 | complete response parsed and persisted                           |

All retrieval turns used the same exact model and conversation and were
instructed not to re-evaluate, summarize, omit, or add a conclusion. The
persisted Markdown was then formatting-normalized without changing its
substantive content and validated independently against the frozen inputs and
selected files.

## Capability and completeness

- All six frozen input hashes match the request.
- All 27 selected image expected and computed SHA-256 values match the
  ephemeral files.
- Every selected image has a unique visible-pixel cue and
  `openedAtOriginalPixels=yes`.
- The exact-order matrix contains ten works and forty terminal Art cells.
- Eight sample-ready works contain 24 known static cells and eight unknown
  motion cells.
- 青空エール and いつかティファニーで朝食を are each `U/U/U/U`, producing
  the other eight unknown cells.
- Every `motionImpact` cell is `U`; no bounded continuous motion sequence was
  available.
- Every known static cell has exact refs, an anchor-linked observation, a
  limitation, and confidence.
- Art unknown is explicitly not treated as a low value or blocker.

Local conclusions were not inspected by the counted Art-review turn. No
promotion decision or Local-versus-Gemini adjudication is made in this ledger,
and no temporary image path is retained.
