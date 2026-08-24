# Batch 002 Art chunk 05 — Gemini execution ledger

- executionDate: 2026-08-23
- requestedModel: `gemini-3.7-flash-high`
- resolvedLabel: Gemini 3.7 Flash (High)
- effort: `high`
- reviewedByHuman: false
- temporarySampleRoot: `/tmp/batch002-art-preflight-chunk05.aOTBj4`
- preflightSha256: `24f97e6b79806d66a9a3051f7ab0cd65bba47d70b944deac3d863da1f5cae480`
- Muse status: `NOT_USED`; no substitute reviewer was counted
- Cursor Grok Art status: `ART_ABSTAIN`; pixel access was not established

## Bound requests

| Group | Request SHA-256                                                    |
| ----- | ------------------------------------------------------------------ |
| 01    | `fa9d548df6ca378cad219b94836c14d23b508c38366a56d70dfc0361cabb4f0d` |
| 02    | `2be3d67e059aa7b00b4689b216357f3d7ceb7ee96742f940d75d7131a8d3038c` |
| 03    | `182d413f4ac8e7fbfc79d21c3ffaf86e3e5a0ac6d5796b2e995afaa1a8e98413` |

## Excluded attempts

| Group | Conversation                           | Status                             | Reason                                                                                                                                                            |
| ----- | -------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01    | `89296e77-8e9a-49c6-bb42-d0b4605a925a` | SUCCESS outer; invalid nested JSON | Direct pixel output contained all 9 hashes and complete conclusions but used four unescaped nested limitation objects, so it was not counted.                     |
| 01    | `89296e77-8e9a-49c6-bb42-d0b4605a925a` | SUCCESS outer; invalid nested JSON | Exact replay artifact SHA `3be4896a81cf005e72d9065091d44b44ff00eca22e51166137e7ad9f2eaa530e` preserved the conclusions but remained syntactically invalid.        |
| 01    | `89296e77-8e9a-49c6-bb42-d0b4605a925a` | SUCCESS outer; invalid nested JSON | First syntax correction artifact SHA `052f9a1c83865ecce855cec66236b3937482e03237201327e97e131800fc9334` left one unescaped limitation object and was not counted. |

Malformed nested JSON is never counted even when the outer transport succeeds
and its visible candidate looks complete. The same Gemini conversation was
asked only to repair JSON syntax and explicitly forbidden to change semantic
content. The second correction produced valid JSON with the same values, refs,
hashes, observations, and limitations.

## Authorizing runs

| Group | Conversation                           | Status  | Response artifact                        | SHA-256                                                            | Nested response SHA-256                                            |
| ----- | -------------------------------------- | ------- | ---------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| 01    | `89296e77-8e9a-49c6-bb42-d0b4605a925a` | SUCCESS | `gemini-response-chunk-05-group-01.json` | `a19e52bc5757cfbd9671e5dbde3b08a284284b5b453fafb1b1d192111fdff1d1` | `ce559b09869135898ac785da3545575e34bf1abddcdd6a518f92574b8a6b513e` |
| 02    | `b5c86717-76f9-4464-b0a5-7089767d783c` | SUCCESS | `gemini-response-chunk-05-group-02.json` | `66a6f018f974dc19eb56b5fede0679ac9b442c616e7f8d9608e7d305c2e97a37` | `179d42a047d733ad2f61d6c982446049f433f592cd742018a9ac9aafb4c88e52` |
| 03    | `3569964a-5b2a-4faa-a684-0cd7b0a4712d` | SUCCESS | `gemini-response-chunk-05-group-03.json` | `3b6e917146cadb7e9ea108e2706f33bc1e9aa2050d888c3a73ae15514359f299` | `07e4bbb429d22d6c0696b7ec16f384dea5ddf26b2528dab40393484ceb82b3ed` |

The authorizing artifacts identify the requested model and effort, report
completion without rate-limit, timeout, or degraded output, preserve every
required work and axis, and state `reviewedByHuman=false`. Their 24 listed
image hashes match the temporary sample bytes. The primary adjudicator
separately reopened every conflict and final extreme against those same bytes
before producing the terminal matrix.
