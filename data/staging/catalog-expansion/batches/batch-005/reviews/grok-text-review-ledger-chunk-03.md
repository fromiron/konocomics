# Batch 005 chunk 03 Cursor Grok execution ledger

- executionDate: `2026-08-25`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- fastVariantInvoked: `false`
- resolvedModelAttestation: `Cursor Grok 4.6 High, non-fast`
- mode: read-only `plan`
- sandbox: `enabled`
- outerResult: `success`
- exitCode: `0`
- initialSessionId: `7b3547db-042c-4489-90e5-9ff5005cc6f2`
- initialRequestId: `aaa069f8-dd4b-4ede-bc18-acd18eec1933`
- initialDurationMs: `828472`
- initialInputTokens: `158577`
- initialOutputTokens: `43363`
- initialCacheReadTokens: `175616`
- completeCaptureSessionId: `7b3547db-042c-4489-90e5-9ff5005cc6f2`
- completeCaptureRequestId: `771abc2a-3cb3-4abe-ba12-55ac91cb25e7`
- completeCaptureDurationMs: `80985`
- completeCaptureInputTokens: `6875`
- completeCaptureOutputTokens: `6322`
- completeCaptureCacheReadTokens: `130048`
- reviewedByHuman: `false`
- artAccess: `ART_ABSTAIN`; no pixel proof was provided
- museStatus: `NOT_USED`
- oxStatus: `EXCLUDED`
- sourceMutation: `none`
- promotion: `not authorized`

## Canonical uncompressed payload binding

- canonicalPayloadRoot: `/tmp/konocomics-batch005-grok-text-chunk03`
- packetCandidateSha256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifestSha256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- packetPayloadLedgerSha256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- requestSha256: `731eecd227e42e892127194070542e250e37f72e97b3babd067c0682abb26827`
- daybreakQaSha256: `93613b984e2285187810ac97424ea7a618872a3ac65d8e7152db3294b93db620`
- payloadFileCount: `13`
- payloadRootIdentitySha256: `ac58e1afd9c0414d499e212ff222da33282f26f0e223141236116f0de24da935`
- rootIdentityAlgorithm: SHA-256 of the byte-exact, path-sorted `sha256sum` lines for all 13 files below, with paths rooted as `./...` and LF terminators

| SHA-256 | Root-relative path |
| --- | --- |
| `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` | `./data/staging/catalog-expansion/batches/batch-005/PAYLOAD.sha256` |
| `230e0864ec9429b9b21898e50f5916d3420d70e4b72aea3f41b5fb8c2a8c243a` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-03/factors.csv` |
| `b4ba1df14b39b0436d5c7524a3488428de651d841f88b0adc1187c8656c2bb2b` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-03/genres.csv` |
| `86c8e43665bbd75137a89ca9a5ae06a11898fec8b7228ffff66dcccbba71e6b6` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-03/notes.md` |
| `6e7d05fb2023528745d902df7ec14c10baf096871389c757ec44798766019421` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-03/themes.csv` |
| `9254c3d00faeb844df9f81ffb7ce0b7873eff2c009dccf8e87fca7342c5f9527` | `./data/staging/catalog-expansion/batches/batch-005/annotation-review-adjudication-request.md` |
| `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | `./data/staging/catalog-expansion/batches/batch-005/frozen-work-set.csv` |
| `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | `./data/staging/catalog-expansion/batches/batch-005/manifest.json` |
| `92f9a69121128aa2668898bdb70a112492bda8958247cd0e9c8202128e533191` | `./data/staging/catalog-expansion/batches/batch-005/research/chunk-03.md` |
| `93613b984e2285187810ac97424ea7a618872a3ac65d8e7152db3294b93db620` | `./data/staging/catalog-expansion/batches/batch-005/reviews/daybreak-annotation-qa-chunks-03-05.md` |
| `731eecd227e42e892127194070542e250e37f72e97b3babd067c0682abb26827` | `./data/staging/catalog-expansion/batches/batch-005/reviews/grok-text-review-request-chunk-03.md` |
| `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | `./docs/factors/annotation-guide.md` |
| `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | `./docs/factors/factor-dictionary.md` |

## Exact output binding

- savedResponsePath: `data/staging/catalog-expansion/batches/batch-005/reviews/grok-text-review-response-chunk-03.txt`
- savedResponseSha256: `f60d47758b6943d915e505d26a0616ebaa0ddfd482d89e24ca77fa4ee2a8295b`
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
- The first same-session complete re-emission stalled without output and was interrupted with exit `130`; the later same-session re-emission succeeded.

No discarded output contributes to the saved response or any conclusion.
