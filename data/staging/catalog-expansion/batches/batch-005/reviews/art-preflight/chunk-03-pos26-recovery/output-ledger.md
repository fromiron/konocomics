# Batch 005 Art preflight recovery output ledger — position 26

- scope: frozen position 26 only
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- output CSV: `data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-03/recovery-pos26-preflight.csv`
- output CSV SHA-256: `f517ac72fd97468fbca6bd75225ce66584f4b1ba1cb13281a4dbd8d8b3a750dd`
- recovery ledger: `data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-03/recovery-pos26-ledger.md`
- recovery ledger SHA-256: `de737e1fa421cfdefed8371b3040792450a94ea4d5db1b45122865e6ddbc4d07`
- output row count: 1 data row plus prescribed 17-column header
- state: `sample-ready`
- retained readable internal body pages: 9 (6 static plus 3 motion)
- distinct scene contexts: 4
- staticGateAttemptable: `true`
- motionGateAttemptable: `true`
- Art or other Factor values assigned: `false`
- promotion performed: `false`
- temporary images committed: `false`

## Output interpretation

This recovery defeats the prior position-26 `official-product-only` sampling limitation because the exact vol. 1 publisher page directly links the first-party ARC reader. The JSON packet is exact volume 1. Six retained pages satisfy the static gate and three additional retained pages preserve one exact bounded motion sequence. The result is only a preflight `sample-ready` state; independent Local and Gemini Art review remains required, with no values inferred here.

## Selected captures

`arc-page-04` through `arc-page-09` are the six selected static references. `arc-page-15` through `arc-page-17` are the exact request/preparation, throw/flight, and cut-impact/reaction motion references. All nine SHA-256 values are recorded in the CSV and in `recovery-pos26-ledger.md`. This only makes the motion gate attemptable; it does not assign a `motionImpact` value.
