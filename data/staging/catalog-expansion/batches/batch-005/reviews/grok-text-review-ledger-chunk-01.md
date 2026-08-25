# Batch 005 chunk 01 Cursor Grok execution ledger

- executionDate: `2026-08-25`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- fastVariantInvoked: `false`
- resolvedModelAttestation: `Cursor Grok 4.6 High, non-fast`
- mode: read-only `plan`
- sandbox: `enabled`
- outerResult: `success`
- exitCode: `0`
- initialSessionId: `5bbd1c13-05d3-422d-bf3c-5fbc64ef831f`
- initialRequestId: `4567e687-6f41-4a27-8d6f-297391b58f60`
- initialDurationMs: `606051`
- initialInputTokens: `137800`
- initialOutputTokens: `39163`
- initialCacheReadTokens: `150144`
- completeReemitSessionId: `5bbd1c13-05d3-422d-bf3c-5fbc64ef831f`
- completeReemitRequestId: `68517068-09d6-457e-b699-f0e22fdca7bb`
- completeReemitDurationMs: `77074`
- completeReemitInputTokens: `20597`
- completeReemitOutputTokens: `6758`
- completeReemitCacheReadTokens: `78464`
- reviewedByHuman: `false`
- artAccess: `ART_ABSTAIN`; no pixel proof was provided
- museStatus: `NOT_USED`
- oxStatus: `EXCLUDED`
- sourceMutation: `none`
- promotion: `not authorized`

## Canonical uncompressed payload binding

- canonicalPayloadRoot: `/tmp/konocomics-batch005-grok-text-chunk-01`
- packetCandidateSha256: `8e9a726ceef4daaaabaa133502ffe59a39594adc359e1fde1ec7f58d26517695`
- manifestSha256: `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03`
- packetPayloadLedgerSha256: `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02`
- requestSha256: `8f3b810f067a8ea6e3c2800a9b5e55c871df1fcad1367a0cbeb9646f0a1511e5`
- payloadFileCount: `13`
- payloadRootIdentitySha256: `6735e71056281394f887597c4f4bdcd28a13717c47705e79396e4342618a3588`
- rootIdentityAlgorithm: SHA-256 of the byte-exact, path-sorted `sha256sum` lines for all 13 files below, with paths rooted as `./...` and LF terminators

| SHA-256 | Root-relative path |
| --- | --- |
| `50512fc57d612eb50d2b76bf7f32354241c3478933fd16e4c90908aa9b9c0d02` | `./data/staging/catalog-expansion/batches/batch-005/PAYLOAD.sha256` |
| `d49ca60fc5ebe84c5ca0b7665be613f3fd66682c0d25459edce9189254251511` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-01/factors.csv` |
| `0e4c10c3e182c262ddba6a13e149e44b431496d36e2dbedb2c83524455f02fb4` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-01/genres.csv` |
| `4857566793b21112dc258fe7c23663277598a33a2e69f796d12579402e2350c0` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-01/notes.md` |
| `3c3db45ff29da9186ffcbc8dd72566d5dd7765a4785f8be9d8883d6c51d6f529` | `./data/staging/catalog-expansion/batches/batch-005/annotation-pass-a/chunk-01/themes.csv` |
| `9254c3d00faeb844df9f81ffb7ce0b7873eff2c009dccf8e87fca7342c5f9527` | `./data/staging/catalog-expansion/batches/batch-005/annotation-review-adjudication-request.md` |
| `ddf9343b48146eaaf58971155f4190b4ec53e09d28d932d0d03cdc515ff8b2b8` | `./data/staging/catalog-expansion/batches/batch-005/frozen-work-set.csv` |
| `3aee17575d6d10bd93071c0ca1129e7f75d170d9cb34616e1692c6621b1aaf03` | `./data/staging/catalog-expansion/batches/batch-005/manifest.json` |
| `2390a3e9b6f57c48b109710728568d4eeb2f6d08416122f9f91b2e81b78909e0` | `./data/staging/catalog-expansion/batches/batch-005/research/chunk-01.md` |
| `4f032d8fbfacdeec01ab01dc53a414dd9f1b118fc5f208b4584d520828a65539` | `./data/staging/catalog-expansion/batches/batch-005/reviews/daybreak-annotation-qa-chunks-01-02.md` |
| `8f3b810f067a8ea6e3c2800a9b5e55c871df1fcad1367a0cbeb9646f0a1511e5` | `./data/staging/catalog-expansion/batches/batch-005/reviews/grok-text-review-request-chunk-01.md` |
| `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` | `./docs/factors/annotation-guide.md` |
| `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` | `./docs/factors/factor-dictionary.md` |

## Exact output binding

- initialEnvelopeSha256: `2edc71907c381e6cadc787c34af8176ac597ead72e5218fd3fba83f4b8579a0b`
- completeReemitEnvelopeSha256: `4ede6f5213fbf4ea7d6f46f7dc7fe8a3d74b07876ed6713fbb5d55c2c7f36551`
- savedResponsePath: `data/staging/catalog-expansion/batches/batch-005/reviews/grok-text-review-response-chunk-01.txt`
- savedResponseSha256: `9a3e883d4c9c48445c48d06a0902834e502aa0ac45bd5e0ca539388183f57f0d`
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
