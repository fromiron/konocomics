# Batch 003 chunk 03 Cursor Grok execution ledger

- executionDate: 2026-08-23
- completedAt: `2026-08-23T12:14:40+09:00`
- acceptedAttempt: `01`
- requestedModel: `cursor-grok-4.6-high`
- invokedModel: `cursor-grok-4.6-high`
- resolvedModelAttestation: Cursor Grok 4.6 High
- mode: non-fast, read-only `plan`
- sandbox: enabled
- outerType: `result`
- outerSubtype: `success`
- outerIsError: `false`
- exitCode: `0`
- durationMs: `671462`
- durationApiMs: `671462`
- sessionId: `bb02716a-77ce-487b-bce8-3cd669ae8316`
- requestId: `5ec1c113-5522-4a99-9530-a3fa49b5bc6f`
- inputTokens: `98497`
- outputTokens: `41423`
- cacheReadTokens: `142080`
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

The model ID was explicit and was not a `-fast` variant. The outer JSON does
not expose a separate model field; model provenance is preserved by the exact
invocation and the response's `cursor-grok-4.6-high` / Cursor Grok 4.6 High
execution attestation. No other model was invoked or silently substituted.

## Attempt boundary

Attempt 01 is the only run for chunk 03 and the only accepted response. It
returned exit code 0, a successful outer envelope, and the required complete
final document. There is no excluded or salvaged attempt.

## Long-running process observation

- The CLI emitted no incremental stdout for more than 60 seconds; this was not
  treated as a failure or timeout.
- The wrapper kept the session open through `19` complete 30-second polling
  intervals and did not interrupt it.
- At approximately `346` seconds, process `324551` was observed alive in
  state `Ssl` with the exact `cursor-grok-4.6-high` command line.
- The process returned the complete outer JSON normally at `671462` ms.
- The immutable outer JSON is byte-identical to the successful wrapper output.
  The response file is the exact outer `result` string with one POSIX trailing
  newline, matching the established review-artifact convention.
- The Cursor reviewer itself made no repository edits.

## Frozen input hashes

| path | SHA-256 |
| --- | --- |
| `docs/factors/factor-dictionary.md` | `a9c29a853a108aca1b9bb8d5d71a3e7d5d583303691c0b35cc6424c1e45ee8be` |
| `docs/factors/annotation-guide.md` | `f7dd1ec55d97bf9200fcec92ce270e7745a0d3aa4fe98a40c746fc56b6a777b3` |
| `annotation-review-adjudication-request.md` | `fc865e59e5b8b92dc94cdb5ad0a7db47c5e6f3b0f8ee4e867717c30e27778759` |
| `frozen-work-set.csv` | `ccba877e5377f7f02fc3a5010bad076bae979eb250fc8d2432cb5d7b0b9a5ddd` |
| `research/chunk-03.md` | `1e65e398e2c375129ac118c9f54e0d75eae1f145fc1b8b7fa68cb847c459aaa1` |
| `annotation-pass-a/chunk-03/factors.csv` | `588a2f6fcd26d67c6cec9d9e107649d64c73155d12944b1e917e967010678bbb` |
| `annotation-pass-a/chunk-03/genres.csv` | `229d65b82839343a04a85c26d22c48bd87bb7cb61c9ec447250922344ebe0b00` |
| `annotation-pass-a/chunk-03/themes.csv` | `ff6b6fca5c9145a7e477f57ade502be76056c56af6bc25e7773da81c29b682e7` |
| `annotation-pass-a/chunk-03/notes.md` | `3429a8fb958f499b4f4a5ca46cffae72d7dba5bb926d161305dac28d90d110f7` |

All nine hashes were recomputed before execution, echoed by the reviewer, and
recomputed after completion without drift.

## Bound outputs

| path | SHA-256 |
| --- | --- |
| `grok-text-review-request-chunk-03.md` | `9f51e4ee907e94f229dc6210c66ce80be3fd89c6b8578dba2970c476ad81115c` |
| `grok-text-review-outer-chunk-03.json` | `102a089402f18b54e7a8f1219d0e8f21dbea47e8233132ba5b171cb0d8f5472a` |
| `grok-text-review-response-chunk-03.txt` | `222e068df410c348a10b79f5318584c594cfe639ee60208a8d23249811ceb802` |

## Validation

- All nine request-bound input hashes still matched the request and the hashes
  echoed by the reviewer.
- Independent matrix: `10` works, `13` non-Art Axis cells per work, frozen
  positions 21–30 in exact order.
- Genre table: `10` rows using only the dictionary's 10 Genre IDs.
- Theme table: `10` rows using only the dictionary's 22 Theme IDs and
  centrality `1` or `2`.
- Pass A comparison: all `10` works, and every non-`none` comparison block
  contains a direct frozen-packet URL.
- Identity/safety/representative-ISBN table: `10` complete rows, each with
  separate findings, a 13-digit ISBN, an allowed verdict, and a direct URL.
- Review outcome table: `10` complete rows using only the allowed outcomes;
  this reviewer proposed `verified` for all 10 works.
- Identity/safety/ISBN verdicts: `PASS` for all 10 works.
- Canonical-title cells containing decorative `『` or `』`: `0`.
- Named Art axes judged or compared: `0`; the response includes the required
  `ART_ABSTAIN` attestation and completeness marker.
- Response completeness markers: `WORK_COUNT=10`,
  `AXIS_COUNT_PER_WORK=13`, `IDENTITY_ROWS=10`, `SAFETY_ROWS=10`,
  `ISBN_ROWS=10`, and `ART_ABSTAIN`.

These conclusions remain independent Pass B proposals. They do not adjudicate
Pass A disagreements, authorize promotion, or alter source, generated, Gold,
registry, eligibility, recommendation, safety, ISBN, identity, or Art data.
