# Batch 005 chunk 02 Cursor Grok execution ledger

- executionDate: `2026-08-25`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- fastVariantInvoked: `false`
- resolvedModelAttestation: `Cursor Grok 4.6 High, non-fast`
- mode: read-only `plan`
- sandbox: `enabled`
- outerResult: `success`
- exitCode: `0`
- initialSessionId: `4387d42d-f6d2-4d4b-bf03-a68802355262`
- initialRequestId: `2a211e88-806f-42a5-a6d3-5cf484fe2e98`
- initialDurationMs: `387786`
- initialInputTokens: `77043`
- initialOutputTokens: `37015`
- initialCacheReadTokens: `258688`
- completeReemitSessionId: `4387d42d-f6d2-4d4b-bf03-a68802355262`
- completeReemitRequestId: `d47063cc-5fa6-4801-b284-01e445506146`
- completeReemitDurationMs: `55309`
- completeReemitInputTokens: `18692`
- completeReemitOutputTokens: `6664`
- completeReemitCacheReadTokens: `76544`
- reviewedByHuman: `false`
- artAccess: `ART_ABSTAIN`; no pixel proof was provided
- museStatus: `NOT_USED`
- oxStatus: `EXCLUDED`
- sourceMutation: `none`
- promotion: `not authorized`

## Canonical uncompressed payload binding

- canonicalPayloadRoot: `/tmp/konocomics-batch005-grok-text-chunk-02`
- packetCandidateSha256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifestSha256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- packetPayloadLedgerSha256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- requestSha256: `b334987215672062957f962ccf7390870f8ea25e2c324c7e43d9c9a328dff168`
- payloadFileCount: `13`
- payloadRootIdentitySha256: `146343e551fe176035896e145a568043ef49187a386812b25088b87ad5f14dcc`
- rootIdentityAlgorithm: SHA-256 of the byte-exact, path-sorted `sha256sum` lines for all 13 files below, with paths rooted as `./...` and LF terminators

| SHA-256 | Root-relative path |
| --- | --- |
| `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` | `./data/staging/catalog-expansion/batches/batch-005/PAYLOAD.sha256` |
| `f1a78e3029887f2549b5b4b3e9836a32680d311ca7e21252cfb8ec1de31de6c2` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-02/factors.csv` |
| `2dc31c0b29003889c0650e1ec3e208f766139050cab1afdcb143418e7bdd9e9e` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-02/genres.csv` |
| `0ea56e271b53ebbad98cd6eb80e71c6f5512893b48551366e31cd73f4f841c49` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-02/notes.md` |
| `8b61757f1d427ded69ebc351a7532f923b34e8e423f4213424fe821d77ab09b0` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-02/themes.csv` |
| `9254c3d00faeb844df9f81ffb7ce0b7873eff2c009dccf8e87fca7342c5f9527` | `./data/staging/catalog-expansion/batches/batch-005/annotation-review-adjudication-request.md` |
| `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | `./data/staging/catalog-expansion/batches/batch-005/frozen-work-set.csv` |
| `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | `./data/staging/catalog-expansion/batches/batch-005/manifest.json` |
| `7b102a7889fa15bc778d5eb0f91785a285fed2d08b0386f809eebd3d04fc6bdd` | `./data/staging/catalog-expansion/batches/batch-005/research/chunk-02.md` |
| `4f032d8fbfacdeec01ab01dc53a414dd9f1b118fc5f208b4584d520828a65539` | `./data/staging/catalog-expansion/batches/batch-005/reviews/daybreak-annotation-qa-chunks-01-02.md` |
| `b334987215672062957f962ccf7390870f8ea25e2c324c7e43d9c9a328dff168` | `./data/staging/catalog-expansion/batches/batch-005/reviews/grok-text-review-request-chunk-02.md` |
| `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | `./docs/factors/annotation-guide.md` |
| `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | `./docs/factors/factor-dictionary.md` |

## Exact output binding

- initialEnvelopeSha256: `50637f035f200a7aa42a949ebfbe73baeb748092d76ab4f16fe2c42e6ca185d6`
- completeReemitEnvelopeSha256: `9f6ba5936c47d72b1914fd3f03bf52cf612380a0b2dcfa637463a7215088abac`
- savedResponsePath: `data/staging/catalog-expansion/batches/batch-005/reviews/grok-text-review-response-chunk-02.txt`
- savedResponseSha256: `d998c4b628ded98489d1cb79308fefa9e2a8581fa1054f45cf37c2f8bfbf648f`
- terminalContract: `WORK_COUNT=10 AXIS_COUNT_PER_WORK=13 IDENTITY_ROWS=10 SAFETY_ROWS=10 ISBN_ROWS=10 ART_ABSTAIN`

The initial successful result contained only progress narration despite the
model having completed its analysis. The same model session re-emitted the
complete self-contained Markdown document; no model substitution occurred.
The saved response is that exact complete re-emission, normalized only to one
terminal LF.

## Discarded attempts

- A wrapper-only launch failed with exit `127` before any model call because
  `/usr/bin/time` was absent.
- An earlier `abda20eb…`-root process was interrupted with exit `130`; its empty
  stdout SHA-256 is `e3b0c442…` and it is `DISCARDED_NOT_EVIDENCE`.
- A current-candidate process launched before the fresh current-root Daybreak QA
  was also interrupted with exit `130`; its empty stdout is likewise
  `DISCARDED_NOT_EVIDENCE`.

No stale-root output contributes to the saved response or any conclusion.
