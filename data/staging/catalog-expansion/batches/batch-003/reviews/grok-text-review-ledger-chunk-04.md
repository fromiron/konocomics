# Batch 003 chunk 04 Cursor Grok execution ledger

- executionDate: 2026-08-23
- completedAt: `2026-08-23T13:52:14+09:00`
- acceptedAttempt: `06`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- resolvedModelAttestation: Cursor Grok 4.6 High
- mode: non-fast, read-only `plan`
- sandbox: enabled
- outerType: `result`
- outerSubtype: `success`
- outerIsError: `false`
- exitCode: `0`
- durationMs: `615247`
- durationApiMs: `615247`
- sessionId: `d94d462b-ab95-415f-a1f6-a723b49a04ef`
- requestId: `bfbe73b3-fe0b-4a28-9b8b-75d3248ec5d0`
- inputTokens: `84177`
- outputTokens: `41202`
- cacheReadTokens: `107776`
- cacheWriteTokens: `0`
- reviewedByHuman: `false`
- artAccess: `ART_ABSTAIN`; pixel access was not established
- museStatus: `NOT_USED`; the optional reviewer was not substituted
- oxStatus: `EXCLUDED`; the user removed Ox from the panel

## Invocation

The accepted read-only run used this exact CLI boundary:

```text
agent --print --output-format json --mode plan --sandbox enabled --trust \
  --workspace /home/bell/Toys/konocomics \
  --model cursor-grok-4.6-high
```

The model ID was explicit and was not a `-fast` variant. The local model list
resolved `cursor-grok-4.6-high` to Cursor Grok 4.6, separately from
`cursor-grok-4.6-high-fast`. The outer JSON does not expose a separate model
field; model provenance is preserved by the exact invocation and the response's
`cursor-grok-4.6-high` / Cursor Grok 4.6 High execution attestation. No other
model was invoked or silently substituted.

## Attempt boundary

Attempt 06 is the only accepted response for chunk 04.

- Attempt 01 returned exit code 0 and a successful outer envelope after one
  automatic reconnect, but its result contained only five progress sentences.
  It is preserved and excluded by
  `grok-text-review-execution-attempt-01-chunk-04.md`.
- Attempt 02 returned a complete document, but 13 change bullets omitted the
  required literal direct URL and one comparison heading altered the frozen
  `アオイホノオ` title. It is preserved and excluded by
  `grok-text-review-execution-attempt-02-chunk-04.md`.
- Attempt 03 returned exit code 0 and a successful outer envelope, but its
  result contained only four progress sentences. It is preserved and excluded
  by `grok-text-review-execution-attempt-03-chunk-04.md`.
- Attempt 04 returned a complete document, but seven change bullets omitted
  the required literal direct URL. It is preserved and excluded by
  `grok-text-review-execution-attempt-04-chunk-04.md`.
- Attempt 05 returned exit code 0 and a successful outer envelope, but its
  result contained only four progress sentences. It is preserved and excluded
  by `grok-text-review-execution-attempt-05-chunk-04.md`.
- Attempt 06 returned exit code 0, a successful outer envelope, literal direct
  URLs for every change, exact frozen canonical titles, and the required
  complete final document. No excluded attempt was salvaged or combined with
  the accepted response.

## Long-running process observation

- The accepted CLI emitted no incremental stdout for more than 60 seconds; this
  was not treated as a failure or timeout.
- The wrapper kept the session open with 30-second polling and did not interrupt
  it.
- At approximately `256` seconds, process `566234` was observed alive in state
  `Ssl` with the exact `cursor-grok-4.6-high` command line.
- The process returned the complete outer JSON normally at `615247` ms.
- The immutable outer JSON binds the successful wrapper metadata and response.
  The response file is the exact outer `result` string with one POSIX trailing
  newline, matching the established review-artifact convention.
- The accepted run reported no timeout, rate limit, degraded output, or
  repository edits.

## Frozen input hashes

| path | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `annotation-review-adjudication-request.md` | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `frozen-work-set.csv` | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `research/chunk-04.md` | `80450417a3500e632acddcf20ee568fbc18b56f363530bbf840cc2735c585546` |
| `annotation-pass-a/chunk-04/factors.csv` | `910a44e7148df1ad8a028117e4b2c17190dab717ba346c033dd466f61dc88763` |
| `annotation-pass-a/chunk-04/genres.csv` | `af1a1aae86a3b726fc9606891f2df2afb3f3c3ed4fc8084cc250b0ca9f8e12d1` |
| `annotation-pass-a/chunk-04/themes.csv` | `c3f78748ca19ec5e140efc1deba877e93dced6dae138fc31651628f060f855c8` |
| `annotation-pass-a/chunk-04/notes.md` | `0dfa15c3cd6aa4100cc4e8e4637ce88fb555fd699a386b53b4518d88b704bff0` |

All nine hashes were recomputed before execution, echoed by the accepted
reviewer, and recomputed after completion without drift.

## Bound outputs

| path | SHA-256 |
| --- | --- |
| `grok-text-review-request-chunk-04.md` | `5e36de8759e0e69200b2d686279e378d4cd967d85d908825745fbcb683b6a68d` |
| `grok-text-review-outer-chunk-04.json` | `b583b0c0ab28320acda730f10545ec9d667e489be072465de4b71626f84af5f9` |
| `grok-text-review-response-chunk-04.txt` | `db2792cae61c237c893fa31b8f686b7a933264b1e3e15c9b9ced846c1abbbd72` |

## Validation

- JSON parsing and the successful outer-envelope contract passed; the response
  is the outer `result` plus exactly one trailing newline.
- All nine request-bound input hashes still matched the request and the hashes
  echoed by the accepted reviewer.
- Independent matrix: `10` works, `13` non-Art Axis cells per work, frozen
  positions 31–40 in exact order, with only `U` or `0`–`4` values.
- Genre table: `10` rows using only the dictionary's 10 Genre IDs.
- Theme table: `10` rows using only the dictionary's 22 Theme IDs and
  centrality `1` or `2`.
- Pass A comparison was programmatically diffed against all 130 non-Art cells,
  Genre rows, and Theme rows. All `10` work blocks are present; every change is
  listed with a literal direct frozen-packet URL and every no-change block says
  `none`.
- Identity/safety/representative-ISBN table: `10` complete rows, each with
  separate findings, a frozen 13-digit ISBN, an allowed verdict, and a direct
  URL. Verdicts are `9 PASS` and `1 NEEDS_ADJUDICATION`.
- Review outcome table: `10` complete rows using only allowed outcomes;
  `9` are `needs-adjudication` and `1` is `verified`.
- The extremes section has `25` rows and covers every independent Axis `0` or
  `4` plus every Theme centrality `2`.
- Canonical-title cells containing decorative `『` or `』` delimiters: `0`.
- Named Art axes judged or compared: `0`; the response includes the required
  `ART_ABSTAIN` attestation and completeness marker.
- The request contains no `text-gap` path, earlier Grok response, or earlier
  independent-review conclusion.
- Prettier check passed for the request, ledger, and all five excluded-attempt
  Markdown records.
- All `19` chunk-04 Grok artifacts passed final-newline, CR, NUL, trailing
  whitespace, and JSON parsing checks as applicable.
- Response completeness markers: `WORK_COUNT=10`,
  `AXIS_COUNT_PER_WORK=13`, `IDENTITY_ROWS=10`, `SAFETY_ROWS=10`,
  `ISBN_ROWS=10`, and `ART_ABSTAIN`.

These conclusions remain independent Pass B proposals. They do not adjudicate
Pass A disagreements, authorize promotion, or alter source, generated, Gold,
registry, eligibility, recommendation, safety, ISBN, identity, or Art data.
