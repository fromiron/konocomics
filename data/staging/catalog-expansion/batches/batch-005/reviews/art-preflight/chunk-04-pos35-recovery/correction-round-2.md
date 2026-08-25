# Batch 005 Art preflight recovery correction ledger — position 35, round 2

- scope: frozen Batch 005 position 35 only
- workId: `work-8a7846af8ead1797e6a2`
- correction reason: Daybreak rejected the prior exact ref/hash association while confirming the official routes, page count, and context gate.
- correction status: applied
- acquisition change: none; the same six official browser-rendered JPEG bytes were retained
- image operation: explicit packet-only filename remap; no source/generated/promotion image mutation
- unchanged gates: readable BODY pages `6`, distinct contexts `2`, `staticGateAttemptable=true`, `motionGateAttemptable=false`
- unchanged Art state: no Art values assigned; existing motion-only evidence and terminal/final-Art rows untouched

## Exact remap

The three adjacent pairs were swapped in the review packet. Every filename, exact
`/img/NNN.jpg` URL reference, context description, CSV page reference, temporary
sample hash, output table, and root identity reader hash now follows this mapping.

| packet/ref | exact official URL | corrected SHA-256 | previous SHA-256 | context after correction |
| --- | --- | --- | --- | --- |
| `his02-p002` / `reader-his02-p002` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/002.jpg` | `0161e58893499257746ad7bd1cba7e6e07d7591711e3edd406044e176c3c4966` | `a5c3d1c83994934c193101fd0d10d676a462a48d28bda4421b65069349da803f` | street/social setup |
| `his02-p003` / `reader-his02-p003` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/003.jpg` | `a5c3d1c83994934c193101fd0d10d676a462a48d28bda4421b65069349da803f` | `0161e58893499257746ad7bd1cba7e6e07d7591711e3edd406044e176c3c4966` | street/social setup |
| `his02-p004` / `reader-his02-p004` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/004.jpg` | `6ec72f8e4fcb9c0ab0ffec6b2f0b13176210e71b3b355486e01a61c95155d487` | `112acb66d9bf6b5f8f9842982ced40fc5f90836127522d98312e8716927f61b5` | street/social interaction |
| `his02-p005` / `reader-his02-p005` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/005.jpg` | `112acb66d9bf6b5f8f9842982ced40fc5f90836127522d98312e8716927f61b5` | `6ec72f8e4fcb9c0ab0ffec6b2f0b13176210e71b3b355486e01a61c95155d487` | arcade/gameplay |
| `his02-p006` / `reader-his02-p006` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/006.jpg` | `44de76624bfaf4c4421794c8d670693d2ec5f8c1a2d4fe21c8861a09d26fbb9f` | `aee2737299e01a69175e69d013b95f82589aac058cd67f8ace6cca05dbd72de2` | arcade/gameplay |
| `his02-p007` / `reader-his02-p007` | `https://magazine.jp.square-enix.com/biggangan/tachiyomi/his02/img/007.jpg` | `aee2737299e01a69175e69d013b95f82589aac058cd67f8ace6cca05dbd72de2` | `44de76624bfaf4c4421794c8d670693d2ec5f8c1a2d4fe21c8861a09d26fbb9f` | arcade/gameplay |

## Verification boundary

This ledger records only the exact mapping correction. It does not silently alter
or overwrite the prior Daybreak QA, does not assign or judge Art factors, and does
not claim a motion sequence.
