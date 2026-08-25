# Batch 005 chunk 05 Cursor Grok execution ledger

- executionDate: `2026-08-25`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- fastVariantInvoked: `false`
- resolvedModelAttestation: `Cursor Grok 4.6 High, non-fast`
- mode: read-only `plan`
- sandbox: `enabled`
- outerResult: `success`
- exitCode: `0`
- initialSessionId: `264ec99d-9ab2-4ab5-8cbd-add4c55f78ff`
- initialRequestId: `c1055dba-169e-4605-8383-197322e09621`
- initialDurationMs: `452469`
- initialInputTokens: `79276`
- initialOutputTokens: `27485`
- initialCacheReadTokens: `165888`
- completeCaptureSessionId: `264ec99d-9ab2-4ab5-8cbd-add4c55f78ff`
- completeCaptureRequestId: `b9661e26-06f0-47e7-b479-0432491c9e8d`
- completeCaptureDurationMs: `56521`
- completeCaptureInputTokens: `5774`
- completeCaptureOutputTokens: `4917`
- completeCaptureCacheReadTokens: `100096`
- reviewedByHuman: `false`
- artAccess: `ART_ABSTAIN`; no pixel proof was provided
- museStatus: `NOT_USED`
- oxStatus: `EXCLUDED`
- sourceMutation: `none`
- promotion: `not authorized`

## Canonical uncompressed payload binding

- canonicalPayloadRoot: `/tmp/konocomics-batch005-grok-text-chunk05`
- packetCandidateSha256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifestSha256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- packetPayloadLedgerSha256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- requestSha256: `a14d04dd6ac1bb5f008b7f83f7f4561aa4f9a90087219eb78dee742156992fb3`
- daybreakQaSha256: `93613b984e2285187810ac97424ea7a618872a3ac65d8e7152db3294b93db620`
- payloadFileCount: `13`
- payloadRootIdentitySha256: `c1dbe552c57c960818a48bd3cf105f189e04748f78e364c6543994d7cd3a9b74`
- rootIdentityAlgorithm: SHA-256 of the byte-exact, path-sorted `sha256sum` lines for all 13 files below, with paths rooted as `./...` and LF terminators

| SHA-256 | Root-relative path |
| --- | --- |
| `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` | `./data/staging/catalog-expansion/batches/batch-005/PAYLOAD.sha256` |
| `5a2642237dcaf1f61028ec89c36b77fcc8fd0f92f9d5d6dcb0887a982bb788c0` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-05/factors.csv` |
| `320f9e0d323c29e6ae46682d2c900e0768e61e23d960cc8dff3c303c4594ee1b` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-05/genres.csv` |
| `8eb02630e8e98bd86631a6d6d311333b14fb89342465a4b2e905ebf867a38dbb` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-05/notes.md` |
| `56b70ed3ff000805399663dfc1c0aaf7747ca36de1f4b6cd008446eb9a73a243` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-05/themes.csv` |
| `9254c3d00faeb844df9f81ffb7ce0b7873eff2c009dccf8e87fca7342c5f9527` | `./data/staging/catalog-expansion/batches/batch-005/annotation-review-adjudication-request.md` |
| `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | `./data/staging/catalog-expansion/batches/batch-005/frozen-work-set.csv` |
| `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | `./data/staging/catalog-expansion/batches/batch-005/manifest.json` |
| `cf36b8d5e6fe4a363e87d832de0079b52dd0e96ecffb2e0f96e0c4b627864710` | `./data/staging/catalog-expansion/batches/batch-005/research/chunk-05.md` |
| `93613b984e2285187810ac97424ea7a618872a3ac65d8e7152db3294b93db620` | `./data/staging/catalog-expansion/batches/batch-005/reviews/daybreak-annotation-qa-chunks-03-05.md` |
| `a14d04dd6ac1bb5f008b7f83f7f4561aa4f9a90087219eb78dee742156992fb3` | `./data/staging/catalog-expansion/batches/batch-005/reviews/grok-text-review-request-chunk-05.md` |
| `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | `./docs/factors/annotation-guide.md` |
| `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | `./docs/factors/factor-dictionary.md` |

## Exact output binding

- savedResponsePath: `data/staging/catalog-expansion/batches/batch-005/reviews/grok-text-review-response-chunk-05.txt`
- savedResponseSha256: `fa2b54e08b20483c827d247405fa17c24aef3b6808ce5f5eb717f516f5411f83`
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

No discarded output contributes to the saved response or any conclusion.
