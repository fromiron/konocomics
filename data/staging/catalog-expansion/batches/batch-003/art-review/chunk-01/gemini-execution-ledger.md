# Batch 003 Art chunk 01 — Gemini execution ledger

- executionDate: `2026-08-23`
- requestedModel: `gemini-3.7-flash-high`
- resolvedLabel: `Gemini 3.7 Flash (High)`
- effort: `high`
- reviewedByHuman: `false`
- temporarySampleRoot: `/tmp/batch003-art-preflight-chunk01.MFt2Ak`
- requestSha256: `b5e7bd32021f07e26dc4907d9fb4ac68aaf2daae5f3998b4c67066158f40db0f`
- preflightSha256: `119e2ecfc831dacc1735421e8b27fa4aae6445774c515967ef1eb1aef5ab8c39`
- Muse status: `NOT_USED`; no substitute reviewer was counted
- Cursor Grok Art status: `ART_ABSTAIN`; pixel access was not established

## Excluded attempts

| Attempt | Conversation                           | Status | Reason                                                                         |
| ------- | -------------------------------------- | ------ | ------------------------------------------------------------------------------ |
| 01      | `7b68eec7-069b-4840-b0ec-677ede904a98` | ERROR  | complete-looking body followed by sandbox connection reset                     |
| 02      | `35776620-c8a5-4c62-801b-094e4864b70c` | ERROR  | complete-looking body ended `context canceled`                                 |
| 03      | `b7060818-9950-4e79-becb-54a8eb7c5642` | ERROR  | relative request path was resolved beneath the additional temporary image root |

All three attempts are excluded. Their visible conclusions are not used merely
because they look complete: normal outer completion is a required Art reviewer
condition.

## Authorizing run

| Conversation                           | Status  | Direct duration | Pixel/hash result | Response artifact               | Artifact SHA-256                                                   |
| -------------------------------------- | ------- | --------------- | ----------------- | ------------------------------- | ------------------------------------------------------------------ |
| `5b769dc8-cd4a-48bd-ad4d-c790120328f7` | SUCCESS | `144.980563676` | `18/18` matched   | `gemini-response-chunk-01.json` | `5be24e80dfe01a7ac30c43294e0fc47fd6458f26c7b9069b41ce958e645813b4` |

The direct run used the unchanged frozen request through its absolute
repository path, resolved the exact requested model and effort, opened all 18
temporary PNGs, matched every image and frozen-input hash, returned all ten
works and four axes, and ended with outer `SUCCESS` and no error. A second
turn in the same conversation persisted the already completed Markdown review
without authorizing new values; the saved outer JSON is also `SUCCESS`.

The response has 40 terminal cells. Four access-limited works are
`U/U/U/U`; six sample-ready works have static values; only COSMOS has a known
`motionImpact`. No Art unknown is treated as a blocker.
