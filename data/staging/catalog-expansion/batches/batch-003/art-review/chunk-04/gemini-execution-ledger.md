# Batch 003 Art chunk 04 — Gemini execution ledger

- executionDate: `2026-08-24`
- requestedModel: `gemini-3.7-flash-high`
- resolvedLabel: `Gemini 3.7 Flash High`
- effort: `high`
- reviewedByHuman: `false`
- countedRunNumber: `4`
- countedConversationId: `c7279d5e-4075-4ad5-a699-73f3fde1a5c7`
- outerStatus: `SUCCESS`
- outerError: `null`
- durationSeconds: `345.064691067`
- inputTokens: `270196`
- outputTokens: `35206`
- thinkingTokens: `18987`
- cacheReadTokens: `2537913`
- totalTokens: `305402`
- requestSha256: `d3c0fca493e2242beeb3fa99cfdc6962329fd3dd329bba78e1570d444f8b1b33`
- payloadRootIdentitySha256: `a1721ad7be0265bbb8eaab793f939b518e26717bd777e69fffc4ccdef1857f1a`
- countedOuterJsonSha256: `a4fe6bd422d84f24997fba00199a66cad1c52c3fcc65128fe99fe2dae63c15a2`
- countedRawResponseSha256: `9ddb12827feb603f17413dc6a742087f671c0b003c92b1e264fb7def04a2459f`
- formattedResponseArtifactSha256: `87b7a3f03e09e07907d3f187864b084fddf2306eac73fd1a05c185efa2162cae`
- factorDictionarySha256: `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be`
- annotationGuideSha256: `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3`
- reviewRequestSha256: `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759`
- frozenWorkSetSha256: `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd`
- preflightSha256: `4bce1df481f80adf6d51719f989c48780db7adddda0b927bfee0eece4aabe17d`
- preflightLedgerSha256: `bfc108991d9363f8780c927cd3976d63ea210193cff784c2229c746a4ec266cd`
- Muse status: `NOT_USED`; no substitute reviewer was counted
- Cursor Grok Art status: `ART_ABSTAIN`; pixel access was not established
- Daybreak Blue status: supplemental `PASS`; it does not replace the Local plus exact Gemini minimum quorum

## Attempt disposition

| Attempt | Route                                        | Outer result                                                              | Artifact identity                                                                                                                                                           | Disposition                                                     |
| ------: | -------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
|       1 | OpenCode provider direct                     | HTTP 401 `CreditsError` before a response                                 | JSONL SHA-256 `4ad4a0eebf5bda6625b240bea47650395521b51838abc224e0169149ab4c19cb`                                                                                            | excluded; no model conclusion                                   |
|       2 | `agy`, exact model, headless plan            | `CANCELED`; read permission auto-denied                                   | outer SHA-256 `f187c5190714a063b8ac098c4ea73c063a717fedd399545f0e3ad81fad669d8d`; permission log SHA-256 `2f70f945243833d446f0501960769e51d4aabe7f6b4f4f502a24883d197ccc06` | excluded; empty response                                        |
|       3 | `agy`, exact model, sandboxed read-only plan | outer `ERROR`: sandbox connection reset after a 30,191-character response | outer SHA-256 `5d6216e50e8e31e111eb08a77ede6873839814a97d744ce790a2c9375b3fcbed`; response SHA-256 `1cc33fa8c5f97b32d50d66e607738e4063f5ccaaf4fe22f0c3ede0267acacc87`       | excluded despite complete-looking content; abnormal termination |
|       4 | `agy`, exact model, read-only plan           | `SUCCESS`, error `null`, one turn                                         | outer and response hashes frozen above                                                                                                                                      | counted                                                         |

No failed, canceled, unauthorized, connection-reset, substituted, timed-out, rate-limited, or degraded attempt contributes a value. Attempt 4 is the only counted Gemini reviewer run.

## Counted run

The counted run used exact `gemini-3.7-flash-high`, effort `high`, and read-only plan mode. It completed normally without fallback or model substitution, recomputed all six frozen input hashes, opened all 33 selected files at original pixel detail, and returned the complete requested Markdown in one turn. The raw response was persisted with Markdown formatting normalization only; the raw and formatted hashes are both recorded.

The canonical uncompressed payload root contained exactly 33 read-only files. Its identity is the SHA-256 of the sorted `filename + file SHA-256` ledger recorded above. No temporary path, image, or capture is retained in the repository.

## Capability and completeness

- Six of six frozen input hashes match.
- All 33 expected and computed image SHA-256 values match, and every row has a unique visible-pixel cue with `openedAtOriginalPixels=yes`.
- The exact-order matrix contains ten Works and forty terminal Art cells.
- Nine sample-ready Works contain 27 known static cells; `海獣の子供` also contains the sole known `motionImpact=2`.
- `ねこだらけ` is `U/U/U/U`; nine unknown motion cells plus its three unknown static cells produce 12 total unknown cells.
- Every known cell includes exact refs, an anchor-linked observation, a limitation, and confidence. Every unknown cell states its unmet gate.
- The full-color vertical `終末のワルキューレ 総天然色` remake was not inspected or used.
- Art unknown is explicitly not a low value or blocker.

Local, Grok, Muse, Daybreak, earlier reviewer, adjudication, and final Art conclusions were not inspected by the counted Gemini turn. This ledger makes no promotion decision and no Local-versus-Gemini adjudication.
