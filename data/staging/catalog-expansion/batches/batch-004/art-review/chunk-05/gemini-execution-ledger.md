# Batch 004 Art chunk 05 — Gemini execution ledger

- executionDate: `2026-08-25`
- requestedModel: `gemini-3.7-flash-high`
- resolvedLabel: `Gemini 3.7 Flash High`
- effort: `high`
- reviewedByHuman: `false`
- agyVersion: `1.1.19`
- requestSha256: `2d4062836f7a627d52556e05ffd983a0caddc66e5c7ab745a0c6b5fb067b7fdf`
- payloadLedgerSha256: `5b3b61616da9304c68ed2e14bd0d884a2fb49eb517b981a5aa9287246c94b98f`
- rootIdentitySha256: `3637dcbf9378a564b28f57fbfd14dbc3176aae228b23d6f78ae70b7656e7365f`
- Muse status: `NOT_USED`; no substitute reviewer was counted
- Cursor Grok Art status: `ART_ABSTAIN`; pixel access was not established

## Authorizing run

| Conversation | Status | Direct duration | Pixel/hash result | Response artifact | Artifact SHA-256 |
| --- | --- | ---: | --- | --- | --- |
| `c72bae47-bb6f-411f-bce4-c6b5540d4464` | `SUCCESS` | `471.140406064s` | `48/48` images and `8/8` frozen inputs matched | `gemini-response.md` | `61e230a50c6554c391687165bbe9842daf797bad551c469730563001525de42d` |

The authorizing `agy` run used read-only plan mode, the canonical uncompressed
project and image directories, exact request, complete payload ledger, and root
identity. It inspected all 48 original images, returned all ten works and 40
terminal cells, and ended with outer `SUCCESS`, exit code 0, no fallback,
timeout, rate limit, truncation, or degraded output. Later turns only reproduced
the already completed response for exact durable transcription; they did not
authorize new values.
