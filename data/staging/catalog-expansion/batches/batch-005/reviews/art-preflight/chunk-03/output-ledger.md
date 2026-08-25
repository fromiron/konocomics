# Batch 005 Art preflight output ledger — chunk 03

- scope: frozen positions 21–30 only
- retrievedAt: `2026-08-25`
- reviewedByHuman: `false`
- output CSV: `data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-03/preflight.csv`
- output ledger: `data/staging/catalog-expansion/batches/batch-005/art-preflight/chunk-03/ledger.md`
- output CSV SHA-256: `8379215c7c1ddcde7c4d3bfe2848b974a2200f5a95b5c7758e6778b9436f38f0`
- output ledger SHA-256: `ecda6c82f9b90e95354c7ed28c8234ecd774bf80ddacafef8c1ea45ddc60413c`
- output row count: 10 data rows plus the prescribed header
- temporary images committed: false
- Art or other Factor values assigned: false
- promotion performed: false

## Gate counts

| Result | Count | Positions |
| --- | ---: | --- |
| `sample-ready` | 6 | 21, 23, 24, 27, 29, 30 |
| `unknown-ready` | 4 | 22, 25, 26, 28 |
| `motionGateAttemptable=true` | 2 | 27, 30 |

All six sampled positions have exactly six readable internal body pages and three distinct contexts. Covers, title splashes, contents, advertisements, and synopsis material were excluded. Positions 27 and 30 satisfy exact bounded start → development → impact → resolved sequences; the remaining sampled positions do not, so only positions 27 and 30 have `motionGateAttemptable=true`.

## Unresolved items

- 22 リューシカ・リューシカ: Square Enix volume pages bridge the frozen ISBN and volumes 1–3 but no exact product-linked registered Gangan Online internal route was exposed.
- 25 天にひびき: Shonengahosha volume pages bridge the frozen ISBN and volumes 1–3 but no exact product or topic trial could be mapped to the frozen edition.
- 26 クジラの子らは砂上に歌う: Akita product pages bridge the frozen ISBN and volumes 1–3; an official ARC reader was observable but it is not the registered Champion Cross route and was not substituted.
- 28 血潜り林檎と金魚鉢男: KADOKAWA product pages bridge the frozen ISBN and volumes 1–3 but expose no product-linked readable BOOK WALKER sample.

These are terminal preflight limitations only. They are not Art values, promotion blockers, or annotation requests.

## Boundary

This output is an uncompressed preflight packet bound to the candidate, manifest, payload ledger, and frozen-work-set identities recorded in `root-identity.json`. Temporary PNGs remain only at `/tmp/konocomics-batch005-art-chunk03`. No repository image, factor CSV, promotion ledger, or commit was created by this chunk.
