# Batch 003 recovery AC — Gemini execution ledger

- executionDate: `2026-08-25`
- requestedModel: `gemini-3.7-flash-high`
- resolvedModel: `gemini-3.7-flash-high`
- resolvedLabel: `Gemini 3.7 Flash High`
- effort: `high`
- mode: read-only `plan`
- reviewedByHuman: `false`
- countedProviderRoute: `Cursor Agent`
- countedSessionId: `7f0395fd-779b-40cf-896d-0b3a095a979c`
- countedRequestId: `2fa004e4-f251-4e7f-aaf5-c2508585f576`
- outerSubtype: `success`
- outerIsError: `false`
- durationMs: `362436`
- durationApiMs: `362436`
- inputTokens: `217950`
- outputTokens: `25595`
- cacheReadTokens: `1908284`
- cacheWriteTokens: `0`
- requestSha256: `bdbddf7838594ccfd5db58951f02c61cef113040223bb7287bb272cc85ab5eb9`
- rawOuterJsonSha256: `6cf31c0bb98a23540e606db94edb46bbac3cebb5ba3456ee621d10b3182e5f9e`
- rawResultMarkdownSha256: `136c81119b5e707946e7a8c5a335855dbe24413b2a9f8f178d27f60e05cfc51e`
- formattedResponseSha256: `92f6e70ae4fb1414f580272a4834e5b64998794535e68d1f3b41e682f6f3540f`
- payloadFiles: `24`
- payloadHashResult: `24/24 HASH_MATCH`
- Muse status: `NOT_USED`; no substitute reviewer was counted
- Cursor Grok Art status: `ART_ABSTAIN`; pixel access was not requested

## Routing record

The first OpenCode CLI attempt was a local argument-order error and did not reach a model. The corrected OpenCode request resolved provider/model `opencode/gemini-3.7-flash`, variant `high`, but was rejected before inference with HTTP 401 `CreditsError: No payment method`; it returned zero model content. Its error event SHA-256 is `2e455d1befce84388a099ee986876a4f006a30d1c49b70d6617e66bae30ce50a`.

The counted run used the same exact request and canonical uncompressed 24-image payload through Cursor Agent with exact model `gemini-3.7-flash-high`, effort `high`, and read-only plan mode. Workspace trust was explicitly granted for the already-created read-only temporary payload directory. The run completed normally in one request without retry, resumed conversation, timeout, rate limit, degraded output, fallback, or model substitution. Standard error was empty.

## Capability and completeness

- All ten frozen repository hashes were echoed exactly.
- All 24 selected images were opened at original pixels and recomputed as exact SHA-256 matches, with a unique visible cue per file.
- The matrix contains the four requested Works in exact position order and 16 terminal cells.
- Every `motionImpact` cell is `U` under the accepted Daybreak gate.
- Every known static cell includes multiple exact refs, anchor-linked observation, limitation, and confidence.
- The only extreme value, `artDensity=4` for position 48, was audited across both accepted contexts.
- The counted run did not inspect Local Art values. The request accidentally supplied an invalid position-47 Work ID in its requested matrix, while the attached frozen Work set and the response prose identify the correct canonical ID as `work-f1d22b68efa7fbd501ee`. This is a clerical identity defect in the request and matrix only; adjudication must bind the pixel observations to the frozen Work ID and must not treat the invalid ID as a Work.

This run makes no promotion or Local-versus-Gemini adjudication decision. Temporary images and their filesystem path are not catalog Evidence and are not committed.
