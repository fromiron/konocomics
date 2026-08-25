# Batch 005 chunk 04 Cursor Grok execution ledger

- executionDate: `2026-08-25`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- fastVariantInvoked: `false`
- resolvedModelAttestation: `Cursor Grok 4.6 High, non-fast`
- mode: read-only `plan`
- sandbox: `enabled`
- outerResult: `success`
- exitCode: `0`
- initialSessionId: `4bb782fb-bb83-4071-a1d7-d6b6c1d3708d`
- initialRequestId: `66255053-7ece-473e-b99f-66e20d539d64`
- initialDurationMs: `702164`
- initialInputTokens: `107651`
- initialOutputTokens: `34191`
- initialCacheReadTokens: `149120`
- completeCaptureSessionId: `4bb782fb-bb83-4071-a1d7-d6b6c1d3708d`
- completeCaptureRequestId: `ef622c7f-7d0d-48f9-ab08-25ad696fc9e7`
- completeCaptureDurationMs: `67996`
- completeCaptureInputTokens: `5932`
- completeCaptureOutputTokens: `5309`
- completeCaptureCacheReadTokens: `118656`
- reviewedByHuman: `false`
- artAccess: `ART_ABSTAIN`; no pixel proof was provided
- museStatus: `NOT_USED`
- oxStatus: `EXCLUDED`
- sourceMutation: `none`
- promotion: `not authorized`

## Canonical uncompressed payload binding

- canonicalPayloadRoot: `/tmp/konocomics-batch005-grok-text-chunk04`
- packetCandidateSha256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifestSha256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- packetPayloadLedgerSha256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- requestSha256: `e88b5f8570b2e4f64391cbea694c331e09df2d54cc2b925519d26b13ffe913e1`
- daybreakQaSha256: `93613b984e2285187810ac97424ea7a618872a3ac65d8e7152db3294b93db620`
- payloadFileCount: `13`
- payloadRootIdentitySha256: `a1a84ad3905f9549f64331efe0aaf8645507cc0079c0932de644d3a41c3936c6`
- rootIdentityAlgorithm: SHA-256 of the byte-exact, path-sorted `sha256sum` lines for all 13 files below, with paths rooted as `./...` and LF terminators

| SHA-256 | Root-relative path |
| --- | --- |
| `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` | `./data/staging/catalog-expansion/batches/batch-005/PAYLOAD.sha256` |
| `0ec928d7914d3061847e223adfd23915647b82f39a050fa514f30705eb6058d8` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-04/factors.csv` |
| `41d4f721d19def51cc686d86f4b235afdbfb2e23524170ab7beb72258aadbfb7` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-04/genres.csv` |
| `e3de7edbe9486d469cbdef9c014f38b6836121190e0a1a5d91cef1659c690d4e` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-04/notes.md` |
| `873753e3b438c22f3e55f5d2551ff1fee83e2b87550ff8eb4a3db16a0b814509` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-04/themes.csv` |
| `9254c3d00faeb844df9f81ffb7ce0b7873eff2c009dccf8e87fca7342c5f9527` | `./data/staging/catalog-expansion/batches/batch-005/annotation-review-adjudication-request.md` |
| `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | `./data/staging/catalog-expansion/batches/batch-005/frozen-work-set.csv` |
| `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | `./data/staging/catalog-expansion/batches/batch-005/manifest.json` |
| `46e6b37d07f4b2baee839dca05331e9c870a6d158c392e3d77ad77419a5b76a3` | `./data/staging/catalog-expansion/batches/batch-005/research/chunk-04.md` |
| `93613b984e2285187810ac97424ea7a618872a3ac65d8e7152db3294b93db620` | `./data/staging/catalog-expansion/batches/batch-005/reviews/daybreak-annotation-qa-chunks-03-05.md` |
| `e88b5f8570b2e4f64391cbea694c331e09df2d54cc2b925519d26b13ffe913e1` | `./data/staging/catalog-expansion/batches/batch-005/reviews/grok-text-review-request-chunk-04.md` |
| `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | `./docs/factors/annotation-guide.md` |
| `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | `./docs/factors/factor-dictionary.md` |

## Exact output binding

- savedResponsePath: `data/staging/catalog-expansion/batches/batch-005/reviews/grok-text-review-response-chunk-04.txt`
- savedResponseSha256: `32037336642378ba6761f26e35c2bef615df1b4982fae273c8bc67d3f7c96ada`
- responseNormalization: exact final assistant `result` text with one terminal LF
- terminalContract: `WORK_COUNT=10 AXIS_COUNT_PER_WORK=13 IDENTITY_ROWS=10 SAFETY_ROWS=10 ISBN_ROWS=10 ART_ABSTAIN`

The initial successful result contained progress narration after completing the
analysis. The same exact model session then emitted the complete self-contained
Markdown document. The saved response is the final complete same-session
capture; no model substitution occurred. The outer JSON envelope was not
retained as a repository artifact; its byte-exact `result` field is bound by
the saved response SHA-256 above.

## Discarded attempts

- All earlier `abda20eb...`, `12ad...`, or otherwise stale-root QA/Grok
  inputs are `DISCARDED_NOT_EVIDENCE` and contribute to no conclusion.
- A preliminary current-candidate launch used an incomplete ten-input bundle
  that omitted `manifest.json` and the batch `PAYLOAD.sha256`; it was
  discarded before the canonical 13-file bundle was frozen.
- A local exact-capture helper failed after model calls because its JavaScript
  runtime lacked `TextEncoder`; it wrote no response file and contributes no
  evidence.
- An earlier complete re-emission used `reviewedByHuman: false`; a same-session re-emission corrected only that attestation to the request's exact literal `reviewedByHuman=false`. The earlier text is discarded, not evidence.

No discarded output contributes to the saved response or any conclusion.
